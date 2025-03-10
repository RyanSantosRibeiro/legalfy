'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import { ProcessType } from '@/types/database';
import { 
  ArrowLeft, 
  Save,
  AlertCircle,
  CheckCircle,
  Edit as EditIcon
} from 'lucide-react';
import { 
  saveQuestionnaire, 
  getQuestionnaire,
  TrabalhistaQuestionnaire,
  CivilQuestionnaire,
  CriminalQuestionnaire,
  QuestionnaireTypes
} from '@/utils/supabase/questionnaires';

// Componentes de formulário para cada tipo de processo
const TrabalhistaForm = ({ 
  data, 
  onChange 
}: { 
  data: TrabalhistaQuestionnaire, 
  onChange: (data: TrabalhistaQuestionnaire) => void 
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      onChange({ ...data, [name]: checked });
    } else if (name === 'salary' || name === 'weekly_hours' || name === 'overtime_hours_per_week') {
      onChange({ ...data, [name]: parseFloat(value) || 0 });
    } else if (name === 'specific_claims' || name === 'documents_provided' || name === 'benefits') {
      // Assumindo que estes valores serão separados por vírgulas
      const arrayValue = value.split(',').map(item => item.trim());
      onChange({ ...data, [name]: arrayValue });
    } else {
      onChange({ ...data, [name]: value });
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Questionário Trabalhista</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Nome da Empresa</label>
          <input
            type="text"
            name="company_name"
            value={data.company_name || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-navy focus:border-navy"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Cargo/Função</label>
          <input
            type="text"
            name="job_title"
            value={data.job_title || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-navy focus:border-navy"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Data de Início do Emprego</label>
          <input
            type="date"
            name="employment_start_date"
            value={data.employment_start_date || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-navy focus:border-navy"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Data de Término (se aplicável)</label>
          <input
            type="date"
            name="employment_end_date"
            value={data.employment_end_date || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-navy focus:border-navy"
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Salário Mensal (R$)</label>
          <input
            type="number"
            name="salary"
            value={data.salary || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-navy focus:border-navy"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Horas Semanais</label>
          <input
            type="number"
            name="weekly_hours"
            value={data.weekly_hours || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-navy focus:border-navy"
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="has_overtime"
            name="has_overtime"
            checked={data.has_overtime || false}
            onChange={(e) => handleChange({
              ...e,
              target: {
                ...e.target,
                name: 'has_overtime',
                value: e.target.checked ? 'true' : 'false',
                type: 'checkbox'
              }
            })}
            className="h-4 w-4 text-navy focus:ring-navy border-gray-300 rounded"
          />
          <label htmlFor="has_overtime" className="ml-2 block text-sm text-gray-700">
            Trabalhou horas extras?
          </label>
        </div>
        
        {data.has_overtime && (
          <div className="ml-6 mt-2">
            <label className="block text-sm font-medium text-gray-700">Horas extras por semana (média)</label>
            <input
              type="number"
              name="overtime_hours_per_week"
              value={data.overtime_hours_per_week || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-navy focus:border-navy"
            />
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="has_benefits"
            name="has_benefits"
            checked={data.has_benefits || false}
            onChange={(e) => handleChange({
              ...e,
              target: {
                ...e.target,
                name: 'has_benefits',
                value: e.target.checked ? 'true' : 'false',
                type: 'checkbox'
              }
            })}
            className="h-4 w-4 text-navy focus:ring-navy border-gray-300 rounded"
          />
          <label htmlFor="has_benefits" className="ml-2 block text-sm text-gray-700">
            Recebeu benefícios?
          </label>
        </div>
        
        {data.has_benefits && (
          <div className="ml-6 mt-2">
            <label className="block text-sm font-medium text-gray-700">Benefícios (separados por vírgula)</label>
            <input
              type="text"
              name="benefits"
              value={data.benefits?.join(', ') || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-navy focus:border-navy"
              placeholder="Ex: Vale-refeição, Vale-transporte, Plano de saúde"
            />
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="has_formal_contract"
            name="has_formal_contract"
            checked={data.has_formal_contract || false}
            onChange={(e) => handleChange({
              ...e,
              target: {
                ...e.target,
                name: 'has_formal_contract',
                value: e.target.checked ? 'true' : 'false',
                type: 'checkbox'
              }
            })}
            className="h-4 w-4 text-navy focus:ring-navy border-gray-300 rounded"
          />
          <label htmlFor="has_formal_contract" className="ml-2 block text-sm text-gray-700">
            Teve contrato formal (carteira assinada)?
          </label>
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Motivo do Desligamento (se aplicável)</label>
        <select
          name="termination_reason"
          value={data.termination_reason || ''}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-navy focus:border-navy"
        >
          <option value="">Selecione</option>
          <option value="Demissão sem justa causa">Demissão sem justa causa</option>
          <option value="Demissão por justa causa">Demissão por justa causa</option>
          <option value="Pedido de demissão">Pedido de demissão</option>
          <option value="Acordo entre as partes">Acordo entre as partes</option>
          <option value="Término de contrato">Término de contrato</option>
          <option value="Outro">Outro</option>
        </select>
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Reivindicações Específicas (separadas por vírgula)</label>
        <input
          type="text"
          name="specific_claims"
          value={data.specific_claims?.join(', ') || ''}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-navy focus:border-navy"
          placeholder="Ex: Horas extras, Férias não pagas, 13º salário"
          required
        />
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Documentos Fornecidos (separados por vírgula)</label>
        <input
          type="text"
          name="documents_provided"
          value={data.documents_provided?.join(', ') || ''}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-navy focus:border-navy"
          placeholder="Ex: Carteira de trabalho, Holerites, Comprovantes de ponto"
          required
        />
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Observações Adicionais</label>
        <textarea
          name="additional_notes"
          value={data.additional_notes || ''}
          onChange={handleChange}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-navy focus:border-navy"
          placeholder="Informações adicionais relevantes para o caso"
        ></textarea>
      </div>
    </div>
  );
};

// Componente principal da página
export default function QuestionnaireForProcess({
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
  const [questionnaireData, setQuestionnaireData] = useState<any>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      try {
        // Verificar autenticação
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          router.push('/signin');
          return;
        }
        
        // Buscar dados do processo
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
        
        // Buscar questionário existente
        const { data: questionnaireResult, error: questionnaireError } = await getQuestionnaire(
          supabase,
          processData.id
        );
        
        if (questionnaireResult) {
          setQuestionnaireData(questionnaireResult.questionnaire);
        } else {
          // Inicializar questionário baseado no tipo de processo
          const processType = processData.process_type as ProcessType;
          
          if (processType === 'trabalhista') {
            setQuestionnaireData({
              employment_start_date: '',
              company_name: '',
              job_title: '',
              salary: 0,
              weekly_hours: 40,
              has_overtime: false,
              has_benefits: false,
              has_formal_contract: true,
              specific_claims: [],
              documents_provided: []
            } as TrabalhistaQuestionnaire);
          } else if (processType === 'civil') {
            setQuestionnaireData({
              incident_date: '',
              incident_location: '',
              claim_type: '',
              opposing_parties: [],
              has_previous_agreement: false,
              has_documents: false,
              documents_provided: []
            } as CivilQuestionnaire);
          } else if (processType === 'criminal') {
            setQuestionnaireData({
              offense_date: '',
              offense_location: '',
              offense_type: '',
              has_been_charged: false,
              has_court_date: false,
              has_previous_offenses: false,
              has_witnesses: false,
              has_legal_representation_before: false
            } as CriminalQuestionnaire);
          } else {
            // Para outros tipos, inicialize com um objeto vazio
            setQuestionnaireData({});
          }
        }
      } catch (error) {
        console.error('Erro:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [router, supabase, processKey]);
  
  const handleSave = async () => {
    if (!process || !questionnaireData) return;
    
    setIsSaving(true);
    setSaveStatus('idle');
    
    try {
      const { error } = await saveQuestionnaire(
        supabase,
        process.id,
        process.process_type as ProcessType,
        questionnaireData
      );
      
      if (error) {
        console.error('Erro ao salvar questionário:', error);
        setSaveStatus('error');
      } else {
        setSaveStatus('success');
        
        // Reset status after 3 seconds
        setTimeout(() => {
          setSaveStatus('idle');
        }, 3000);
      }
    } catch (error) {
      console.error('Erro:', error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };
  
  const renderQuestionnaireForm = () => {
    if (!process || !questionnaireData) return null;
    
    const processType = process.process_type as ProcessType;
    
    switch (processType) {
      case 'trabalhista':
        return (
          <TrabalhistaForm
            data={questionnaireData as TrabalhistaQuestionnaire}
            onChange={setQuestionnaireData}
          />
        );
      // Adicionar formulários para outros tipos de processo conforme necessário
      default:
        return (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-yellow-700">
              Formulário de questionário não disponível para o tipo de processo "{processType}".
            </p>
          </div>
        );
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-500">Carregando questionário...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Link href={`/dashboard/processo/${processKey}`}>
            <button className="mr-3 text-gray-500 hover:text-navy">
              <ArrowLeft size={20} />
            </button>
          </Link>
          <h1 className="text-2xl font-bold text-navy">Questionário do Processo</h1>
        </div>
        
        <div className="flex gap-2">
          <Link href={`/dashboard/processo/${processKey}/questionnaire/builder`}>
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-navy hover:bg-gray-50">
              <EditIcon className="mr-2" size={16} />
              Construtor de Questionário
            </button>
          </Link>
          
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`inline-flex items-center px-4 py-2 bg-navy text-white rounded-md transition-all ${
              isSaving ? 'opacity-50 cursor-not-allowed' : 'hover:bg-navy-dark'
            }`}
          >
            <Save className="mr-2" size={16} />
            {isSaving ? 'Salvando...' : 'Salvar Questionário'}
          </button>
        </div>
      </div>
      
      {saveStatus === 'success' && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md flex items-center">
          <CheckCircle className="text-green-500 mr-2" size={20} />
          <span className="text-green-700">Questionário salvo com sucesso!</span>
        </div>
      )}
      
      {saveStatus === 'error' && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-center">
          <AlertCircle className="text-red-500 mr-2" size={20} />
          <span className="text-red-700">Erro ao salvar o questionário. Tente novamente.</span>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md p-6">
        {process && (
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Informações do Processo</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Número do Processo</p>
                <p className="font-medium">{process.process_key}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Título</p>
                <p className="font-medium">{process.title}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tipo</p>
                <p className="font-medium">{process.process_type}</p>
              </div>
              {process.client_name && (
                <div>
                  <p className="text-sm text-gray-500">Cliente</p>
                  <p className="font-medium">{process.client_name}</p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {renderQuestionnaireForm()}
      </div>
    </div>
  );
} 