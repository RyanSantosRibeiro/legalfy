'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Save,
  AlertCircle,
  CheckCircle,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  Settings,
  Eye
} from 'lucide-react';
import { Json } from '@/types/supabase';

// Tipos de campos suportados
type FieldType = 'text' | 'textarea' | 'number' | 'boolean' | 'select' | 'date' | 'email';

// Interface para opções de select
interface SelectOption {
  value: string;
  label: string;
}

// Interface para campos de questionário
interface QuestionField {
  id: string;
  type: FieldType;
  label: string;
  required: boolean;
  placeholder?: string;
  helpText?: string;
  options?: SelectOption[]; // Para campos select
  defaultValue?: string | number | boolean;
}

// Interface para modelo de questionário
interface QuestionnaireTemplate {
  id?: string;
  title: string;
  description: string | null;
  process_type: string;
  fields: QuestionField[];
  created_at?: string;
  updated_at?: string;
}

export default function QuestionnaireBuilder({
  params
}: {
  params: { processKey: string };
}) {
  const router = useRouter();
  const supabase = createClient();
  const processKey = params.processKey;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [process, setProcess] = useState<any>(null);
  const [template, setTemplate] = useState<QuestionnaireTemplate>({
    title: '',
    description: null,
    process_type: '',
    fields: []
  });
  
  // Estado para o campo que está sendo editado
  const [editingField, setEditingField] = useState<QuestionField | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          router.push('/signin');
          return;
        }
        
        const { data: processData, error: processError } = await supabase
          .from('processes')
          .select('*')
          .eq('process_key', processKey)
          .eq('lawyer_id', session.user.id)
          .single();
        
        if (processError || !processData) {
          console.error('Erro ao buscar processo:', processError);
          router.push('/dashboard/processo');
          return;
        }
        
        setProcess(processData);
        
        const { data: templateData, error: templateError } = await supabase
          .from('questionnaire_templates')
          .select('*')
          .eq('process_type', processData.process_type)
          .single();
        
        if (templateData) {
          const parsedFields = templateData.fields as unknown as QuestionField[];
          setTemplate({
            ...templateData,
            fields: Array.isArray(parsedFields) ? parsedFields : []
          });
        } else {
          setTemplate({
            title: `Questionário - ${processData.process_type}`,
            description: null,
            process_type: processData.process_type,
            fields: []
          });
        }
      } catch (error) {
        console.error('Erro:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [router, supabase, processKey]);
  
  // Função para adicionar um novo campo
  const addField = (type: FieldType) => {
    const newField: QuestionField = {
      id: `field_${Date.now()}`,
      type,
      label: 'Nova pergunta',
      required: false,
      placeholder: '',
      helpText: '',
    };
    
    // Se for select, adicionar opções padrão
    if (type === 'select') {
      newField.options = [
        { value: 'option1', label: 'Opção 1' },
        { value: 'option2', label: 'Opção 2' }
      ];
    }
    
    // Se for boolean, adicionar valor padrão false
    if (type === 'boolean') {
      newField.defaultValue = false;
    }
    
    setTemplate({
      ...template,
      fields: [...template.fields, newField]
    });
    
    // Abrir o novo campo para edição
    setEditingField(newField);
    setEditingIndex(template.fields.length);
  };
  
  // Função para remover um campo
  const removeField = (index: number) => {
    const updatedFields = [...template.fields];
    updatedFields.splice(index, 1);
    
    setTemplate({
      ...template,
      fields: updatedFields
    });
    
    // Se estava editando o campo removido, limpar edição
    if (editingIndex === index) {
      setEditingField(null);
      setEditingIndex(null);
    } else if (editingIndex !== null && editingIndex > index) {
      // Ajustar o índice se estava editando um campo após o removido
      setEditingIndex(editingIndex - 1);
    }
  };
  
  // Função para mover um campo para cima
  const moveFieldUp = (index: number) => {
    if (index === 0) return;
    
    const updatedFields = [...template.fields];
    const temp = updatedFields[index];
    updatedFields[index] = updatedFields[index - 1];
    updatedFields[index - 1] = temp;
    
    setTemplate({
      ...template,
      fields: updatedFields
    });
    
    // Ajustar índice de edição se necessário
    if (editingIndex === index) {
      setEditingIndex(index - 1);
    } else if (editingIndex === index - 1) {
      setEditingIndex(index);
    }
  };
  
  // Função para mover um campo para baixo
  const moveFieldDown = (index: number) => {
    if (index === template.fields.length - 1) return;
    
    const updatedFields = [...template.fields];
    const temp = updatedFields[index];
    updatedFields[index] = updatedFields[index + 1];
    updatedFields[index + 1] = temp;
    
    setTemplate({
      ...template,
      fields: updatedFields
    });
    
    // Ajustar índice de edição se necessário
    if (editingIndex === index) {
      setEditingIndex(index + 1);
    } else if (editingIndex === index + 1) {
      setEditingIndex(index);
    }
  };
  
  // Função para editar um campo
  const editField = (index: number) => {
    setEditingField(template.fields[index]);
    setEditingIndex(index);
  };
  
  // Função para atualizar um campo
  const updateField = (updatedField: QuestionField) => {
    if (editingIndex === null) return;
    
    const updatedFields = [...template.fields];
    updatedFields[editingIndex] = updatedField;
    
    setTemplate({
      ...template,
      fields: updatedFields
    });
  };
  
  // Função para salvar alterações no campo sendo editado
  const saveFieldChanges = () => {
    if (editingField === null || editingIndex === null) return;
    
    updateField(editingField);
    setEditingField(null);
    setEditingIndex(null);
  };
  
  // Função para cancelar edição de campo
  const cancelFieldEdit = () => {
    setEditingField(null);
    setEditingIndex(null);
  };
  
  // Função para adicionar opção em campo select
  const addSelectOption = () => {
    if (!editingField || editingField.type !== 'select') return;
    
    const options = editingField.options || [];
    const newOption: SelectOption = {
      value: `option_${options.length + 1}`,
      label: `Opção ${options.length + 1}`
    };
    
    setEditingField({
      ...editingField,
      options: [...options, newOption]
    });
  };
  
  // Função para remover opção em campo select
  const removeSelectOption = (optionIndex: number) => {
    if (!editingField || editingField.type !== 'select') return;
    
    const options = [...(editingField.options || [])];
    options.splice(optionIndex, 1);
    
    setEditingField({
      ...editingField,
      options
    });
  };
  
  // Função para atualizar opção em campo select
  const updateSelectOption = (optionIndex: number, key: 'value' | 'label', value: string) => {
    if (!editingField || editingField.type !== 'select') return;
    
    const options = [...(editingField.options || [])];
    options[optionIndex] = {
      ...options[optionIndex],
      [key]: value
    };
    
    setEditingField({
      ...editingField,
      options
    });
  };
  
  // Função para salvar o template de questionário
  const saveTemplate = async () => {
    if (!process) return;
    
    setIsSaving(true);
    setSaveStatus('idle');
    
    try {
      const templateData = {
        title: template.title,
        description: template.description,
        process_type: template.process_type,
        fields: template.fields as unknown as Json
      };

      const { error } = template.id
        ? await supabase
            .from('questionnaire_templates')
            .update(templateData)
            .eq('id', template.id)
        : await supabase
            .from('questionnaire_templates')
            .insert(templateData);
      
      if (error) throw error;
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      console.error('Erro:', error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };
  
  // Função para testar o questionário
  const testQuestionnaire = () => {
    router.push(`/dashboard/processo/${processKey}/questionnaire`);
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-500">Carregando construtor de questionário...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Link href={`/dashboard/processo/${processKey}/questionnaire`}>
            <button className="mr-3 text-gray-500 hover:text-navy">
              <ArrowLeft size={20} />
            </button>
          </Link>
          <h1 className="text-2xl font-bold text-navy">Construtor de Questionário</h1>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={testQuestionnaire}
            className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            <Eye className="mr-2" size={16} />
            Testar Questionário
          </button>
          <button
            onClick={saveTemplate}
            disabled={isSaving}
            className={`inline-flex items-center px-4 py-2 bg-navy text-white rounded-md transition-all ${
              isSaving ? 'opacity-50 cursor-not-allowed' : 'hover:bg-navy-dark'
            }`}
          >
            <Save className="mr-2" size={16} />
            {isSaving ? 'Salvando...' : 'Salvar Template'}
          </button>
        </div>
      </div>
      
      {saveStatus === 'success' && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md flex items-center">
          <CheckCircle className="text-green-500 mr-2" size={20} />
          <span className="text-green-700">Template de questionário salvo com sucesso!</span>
        </div>
      )}
      
      {saveStatus === 'error' && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-center">
          <AlertCircle className="text-red-500 mr-2" size={20} />
          <span className="text-red-700">Erro ao salvar o template. Tente novamente.</span>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Painel principal */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título do Questionário</label>
                <input
                  type="text"
                  value={template.title}
                  onChange={(e) => setTemplate({ ...template, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-navy focus:border-navy"
                  placeholder="Ex: Questionário Trabalhista"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição (opcional)</label>
                <textarea
                  value={template.description || ''}
                  onChange={(e) => setTemplate({ ...template, description: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-navy focus:border-navy"
                  placeholder="Breve descrição do questionário"
                ></textarea>
              </div>
            </div>
            
            <h2 className="text-lg font-semibold mb-4">Perguntas</h2>
            
            {template.fields.length === 0 ? (
              <div className="text-center py-10 border-2 border-dashed border-gray-300 rounded-md">
                <p className="text-gray-500 mb-3">Nenhuma pergunta adicionada</p>
                <p className="text-sm text-gray-400">Use o painel lateral para adicionar perguntas</p>
              </div>
            ) : (
              <div className="space-y-4">
                {template.fields.map((field, index) => (
                  <div 
                    key={field.id} 
                    className={`border rounded-md ${
                      editingIndex === index 
                        ? 'border-navy-light border-2' 
                        : 'border-gray-200'
                    } hover:border-gray-300`}
                  >
                    <div className="flex justify-between items-center bg-gray-50 p-3 border-b border-gray-200 rounded-t-md">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-600">
                          {fieldTypeLabels[field.type]}
                        </span>
                        {field.required && (
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                            Obrigatório
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => moveFieldUp(index)}
                          disabled={index === 0}
                          className={`p-1 rounded-md ${
                            index === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-200'
                          }`}
                          title="Mover para cima"
                        >
                          <MoveUp size={16} />
                        </button>
                        <button
                          onClick={() => moveFieldDown(index)}
                          disabled={index === template.fields.length - 1}
                          className={`p-1 rounded-md ${
                            index === template.fields.length - 1 
                              ? 'text-gray-300 cursor-not-allowed' 
                              : 'text-gray-500 hover:bg-gray-200'
                          }`}
                          title="Mover para baixo"
                        >
                          <MoveDown size={16} />
                        </button>
                        <button
                          onClick={() => editField(index)}
                          className="p-1 rounded-md text-gray-500 hover:bg-gray-200"
                          title="Editar"
                        >
                          <Settings size={16} />
                        </button>
                        <button
                          onClick={() => removeField(index)}
                          className="p-1 rounded-md text-red-500 hover:bg-red-50"
                          title="Remover"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-medium text-gray-800 mb-1">{field.label}</h3>
                      {field.helpText && (
                        <p className="text-sm text-gray-500 mb-3">{field.helpText}</p>
                      )}
                      
                      {/* Preview do campo */}
                      <div className="mt-2">
                        {field.type === 'text' && (
                          <input
                            type="text"
                            disabled
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50"
                            placeholder={field.placeholder || 'Texto...'}
                          />
                        )}
                        
                        {field.type === 'textarea' && (
                          <textarea
                            disabled
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50"
                            placeholder={field.placeholder || 'Texto multilinhas...'}
                          ></textarea>
                        )}
                        
                        {field.type === 'number' && (
                          <input
                            type="number"
                            disabled
                            className="w-40 px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50"
                            placeholder={field.placeholder || '0'}
                          />
                        )}
                        
                        {field.type === 'boolean' && (
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              disabled
                              className="h-4 w-4 text-navy focus:ring-navy border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-500">Sim/Não</span>
                          </div>
                        )}
                        
                        {field.type === 'select' && (
                          <select
                            disabled
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50"
                          >
                            <option value="">{field.placeholder || 'Selecione...'}</option>
                            {field.options?.map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        )}
                        
                        {field.type === 'date' && (
                          <input
                            type="date"
                            disabled
                            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50"
                          />
                        )}
                        
                        {field.type === 'email' && (
                          <input
                            type="email"
                            disabled
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50"
                            placeholder={field.placeholder || 'email@exemplo.com'}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Painel lateral */}
        <div className="lg:col-span-1 space-y-6">
          {/* Adicionar campo */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Adicionar Campo</h2>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => addField('text')}
                className="flex flex-col items-center p-3 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <span className="text-sm mb-1">Texto</span>
                <span className="text-xs text-gray-500">Linha única</span>
              </button>
              <button
                onClick={() => addField('textarea')}
                className="flex flex-col items-center p-3 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <span className="text-sm mb-1">Texto</span>
                <span className="text-xs text-gray-500">Multilinha</span>
              </button>
              <button
                onClick={() => addField('number')}
                className="flex flex-col items-center p-3 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <span className="text-sm mb-1">Número</span>
                <span className="text-xs text-gray-500">1, 2, 3...</span>
              </button>
              <button
                onClick={() => addField('date')}
                className="flex flex-col items-center p-3 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <span className="text-sm mb-1">Data</span>
                <span className="text-xs text-gray-500">00/00/0000</span>
              </button>
              <button
                onClick={() => addField('boolean')}
                className="flex flex-col items-center p-3 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <span className="text-sm mb-1">Sim/Não</span>
                <span className="text-xs text-gray-500">Checkbox</span>
              </button>
              <button
                onClick={() => addField('select')}
                className="flex flex-col items-center p-3 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <span className="text-sm mb-1">Seleção</span>
                <span className="text-xs text-gray-500">Dropdown</span>
              </button>
              <button
                onClick={() => addField('email')}
                className="flex flex-col items-center p-3 border border-gray-300 rounded-md hover:bg-gray-50 col-span-2"
              >
                <span className="text-sm mb-1">Email</span>
                <span className="text-xs text-gray-500">nome@exemplo.com</span>
              </button>
            </div>
          </div>
          
          {/* Editar campo */}
          {editingField && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Editar Campo</h2>
                <button 
                  onClick={cancelFieldEdit}
                  className="text-sm text-gray-500 hover:text-navy"
                >
                  Cancelar
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Título da Pergunta</label>
                  <input
                    type="text"
                    value={editingField.label}
                    onChange={(e) => setEditingField({ ...editingField, label: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-navy focus:border-navy"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Texto de Ajuda (opcional)</label>
                  <input
                    type="text"
                    value={editingField.helpText || ''}
                    onChange={(e) => setEditingField({ ...editingField, helpText: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-navy focus:border-navy"
                    placeholder="Instruções para o usuário"
                  />
                </div>
                
                {(editingField.type === 'text' || editingField.type === 'textarea' || 
                  editingField.type === 'number' || editingField.type === 'email' || 
                  editingField.type === 'select') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Placeholder</label>
                    <input
                      type="text"
                      value={editingField.placeholder || ''}
                      onChange={(e) => setEditingField({ ...editingField, placeholder: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-navy focus:border-navy"
                      placeholder="Texto de exemplo"
                    />
                  </div>
                )}
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="required"
                    checked={editingField.required}
                    onChange={(e) => setEditingField({ ...editingField, required: e.target.checked })}
                    className="h-4 w-4 text-navy focus:ring-navy border-gray-300 rounded"
                  />
                  <label htmlFor="required" className="ml-2 block text-sm text-gray-700">
                    Campo obrigatório
                  </label>
                </div>
                
                {/* Opções para Select */}
                {editingField.type === 'select' && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="block text-sm font-medium text-gray-700">Opções</label>
                      <button
                        onClick={addSelectOption}
                        className="text-xs text-navy hover:text-navy-dark"
                      >
                        + Adicionar opção
                      </button>
                    </div>
                    
                    {editingField.options?.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={option.label}
                          onChange={(e) => updateSelectOption(optionIndex, 'label', e.target.value)}
                          className="flex-grow px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-navy focus:border-navy"
                          placeholder="Texto da opção"
                        />
                        <input
                          type="text"
                          value={option.value}
                          onChange={(e) => updateSelectOption(optionIndex, 'value', e.target.value)}
                          className="w-24 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-navy focus:border-navy"
                          placeholder="Valor"
                        />
                        <button
                          onClick={() => removeSelectOption(optionIndex)}
                          className="p-1 rounded-md text-red-500 hover:bg-red-50"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="pt-4 mt-4 border-t border-gray-200">
                  <button
                    onClick={saveFieldChanges}
                    className="w-full flex justify-center items-center px-4 py-2 bg-navy text-white rounded-md hover:bg-navy-dark"
                  >
                    <Save className="mr-2" size={16} />
                    Salvar Alterações
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Label para cada tipo de campo
const fieldTypeLabels: Record<FieldType, string> = {
  text: 'Texto (linha única)',
  textarea: 'Texto (multilinha)',
  number: 'Número',
  boolean: 'Sim/Não',
  select: 'Seleção',
  date: 'Data',
  email: 'Email'
}; 