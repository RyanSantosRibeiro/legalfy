'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { ProcessType } from '@/types/database';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  Calendar, 
  Edit, 
  FileText, 
  Info, 
  Lock, 
  Save, 
  User
} from 'lucide-react';

export default function EditProcess({
  params
}: {
  params: { processKey: string };
}) {
  const router = useRouter();
  const supabase = createClient();
  const processKey = params.processKey;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'active',
    process_type: 'outro' as ProcessType,
    case_number: '',
    court: '',
    client_name: '',
    client_email: '',
    filing_date: '',
  });
  
  // Process type options for the dropdown
  const processTypeOptions = [
    { value: 'trabalhista', label: 'Trabalhista' },
    { value: 'civil', label: 'Civil' },
    { value: 'jec', label: 'Juizado Especial Cível (JEC)' },
    { value: 'familia', label: 'Família' },
    { value: 'os', label: 'OS' },
    { value: 'criminal', label: 'Criminal' },
    { value: 'jecrim', label: 'Juizado Especial Criminal (JECRIM)' },
    { value: 'tributario', label: 'Tributário' },
    { value: 'fazendario', label: 'Fazendário' },
    { value: 'federal_civil', label: 'Federal - Civil' },
    { value: 'federal_jec', label: 'Federal - JEC' },
    { value: 'federal_criminal', label: 'Federal - Criminal' },
    { value: 'federal_jecrim', label: 'Federal - JECRIM' },
    { value: 'federal_tributario', label: 'Federal - Tributário' },
    { value: 'federal_fazendario', label: 'Federal - Fazendário' },
    { value: 'adm_inss', label: 'Administrativo - INSS' },
    { value: 'adm_municipal', label: 'Administrativo - Municipal' },
    { value: 'adm_estadual', label: 'Administrativo - Estadual' },
    { value: 'adm_federal', label: 'Administrativo - Federal' },
    { value: 'adm_cartorio', label: 'Administrativo - Cartório' },
    { value: 'adm_inpi', label: 'Administrativo - INPI' },
    { value: 'outro', label: 'Outro' }
  ];
  
  // Status options for the dropdown
  const statusOptions = [
    { value: 'active', label: 'Ativo' },
    { value: 'pending', label: 'Pendente' },
    { value: 'closed', label: 'Encerrado' },
    { value: 'archived', label: 'Arquivado' }
  ];
  
  // Fetch the process data when the component mounts
  useEffect(() => {
    const fetchProcess = async () => {
      setIsLoading(true);
      
      try {
        // Get the current user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          router.push('/signin');
          return;
        }
        
        // Get the process data
        const { data: process, error } = await supabase
          .from('processes')
          .select('*')
          .eq('process_key', processKey)
          .eq('lawyer_id', user.id)
          .single();
        
        if (error || !process) {
          console.error('Error fetching process:', error);
          toast.error('Processo não encontrado ou você não tem permissão para editá-lo.');
          router.push('/processo');
          return;
        }
        
        // Update form data with the process data
        setFormData({
          title: process.title || '',
          description: process.description || '',
          status: process.status || 'active',
          process_type: (process.process_type as ProcessType) || 'outro',
          case_number: process.case_number || '',
          court: process.court || '',
          client_name: process.client_name || '',
          client_email: process.client_email || '',
          filing_date: process.filing_date || '',
        });
      } catch (error) {
        console.error('Error:', error);
        toast.error('Ocorreu um erro ao carregar os dados do processo.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProcess();
  }, [processKey, router, supabase]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/signin');
        return;
      }
      
      // Update the process
      const { data: updatedProcess, error } = await supabase
        .from('processes')
        .update({
          title: formData.title,
          description: formData.description,
          status: formData.status,
          process_type: formData.process_type,
          case_number: formData.case_number,
          court: formData.court,
          client_name: formData.client_name,
          client_email: formData.client_email,
          filing_date: formData.filing_date,
          updated_at: new Date().toISOString()
        })
        .eq('process_key', processKey)
        .eq('lawyer_id', user.id)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      toast.success('Processo atualizado com sucesso!');
      router.push(`/processo/${processKey}`);
    } catch (error) {
      console.error('Error updating process:', error);
      toast.error('Erro ao atualizar o processo. Por favor, tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-4">Carregando...</h1>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href={`/processo/${processKey}`} className="inline-flex items-center text-navy hover:text-gold">
          <ArrowLeft className="mr-2" size={16} />
          Voltar para o Processo
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6 flex items-center">
          <Edit className="mr-2" size={24} />
          Editar Processo: {processKey}
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Process Information Section */}
          <div className="border-b pb-4 mb-4">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FileText className="mr-2" size={20} />
              Informações do Processo
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Título do Processo*
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-navy"
                  placeholder="Ex: Ação de Cobrança - João vs Empresa XYZ"
                />
              </div>
              
              <div>
                <label htmlFor="process_type" className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Processo*
                </label>
                <select
                  id="process_type"
                  name="process_type"
                  value={formData.process_type}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-navy"
                >
                  {processTypeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status do Processo*
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-navy"
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="filing_date" className="block text-sm font-medium text-gray-700 mb-1">
                  Data de Distribuição
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id="filing_date"
                    name="filing_date"
                    value={formData.filing_date}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-navy"
                  />
                  <Calendar className="absolute right-3 top-2.5 text-gray-400" size={16} />
                </div>
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição do Processo
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-navy"
                  placeholder="Descreva os detalhes relevantes do processo..."
                ></textarea>
              </div>
            </div>
          </div>
          
          {/* Court Information Section */}
          <div className="border-b pb-4 mb-4">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Lock className="mr-2" size={20} />
              Informações Judiciais
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="case_number" className="block text-sm font-medium text-gray-700 mb-1">
                  Número do Processo
                </label>
                <input
                  type="text"
                  id="case_number"
                  name="case_number"
                  value={formData.case_number}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-navy"
                  placeholder="Ex: 0001234-12.2023.8.26.0100"
                />
              </div>
              
              <div>
                <label htmlFor="court" className="block text-sm font-medium text-gray-700 mb-1">
                  Tribunal/Vara
                </label>
                <input
                  type="text"
                  id="court"
                  name="court"
                  value={formData.court}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-navy"
                  placeholder="Ex: 2ª Vara Cível de São Paulo"
                />
              </div>
            </div>
          </div>
          
          {/* Client Information Section */}
          <div className="border-b pb-4 mb-4">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <User className="mr-2" size={20} />
              Informações do Cliente
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="client_name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Cliente
                </label>
                <input
                  type="text"
                  id="client_name"
                  name="client_name"
                  value={formData.client_name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-navy"
                  placeholder="Nome completo do cliente"
                />
              </div>
              
              <div>
                <label htmlFor="client_email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email do Cliente
                </label>
                <input
                  type="email"
                  id="client_email"
                  name="client_email"
                  value={formData.client_email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-navy"
                  placeholder="email@exemplo.com"
                />
              </div>
            </div>
          </div>
          
          {/* Form Actions */}
          <div className="flex justify-end space-x-4">
            <Link
              href={`/processo/${processKey}`}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy"
            >
              Cancelar
            </Link>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-navy text-white rounded-md hover:bg-navy-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy flex items-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="mr-2" size={16} />
                  Salvar Alterações
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 