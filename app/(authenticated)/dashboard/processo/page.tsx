'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import { ProcessType } from '@/types/database';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Calendar, 
  FileText, 
  Plus, 
  Search,
  ArrowRight,
  Filter,
  X
} from 'lucide-react';

// Process type labels for better display
const processTypeLabels: Record<ProcessType, string> = {
  'trabalhista': 'Trabalhista',
  'civil': 'Civil',
  'jec': 'Juizado Especial Cível (JEC)',
  'familia': 'Família',
  'os': 'OS',
  'criminal': 'Criminal',
  'jecrim': 'Juizado Especial Criminal (JECRIM)',
  'tributario': 'Tributário',
  'fazendario': 'Fazendário',
  'federal_civil': 'Federal - Civil',
  'federal_jec': 'Federal - JEC',
  'federal_criminal': 'Federal - Criminal',
  'federal_jecrim': 'Federal - JECRIM',
  'federal_tributario': 'Federal - Tributário',
  'federal_fazendario': 'Federal - Fazendário',
  'adm_inss': 'Administrativo - INSS',
  'adm_municipal': 'Administrativo - Municipal',
  'adm_estadual': 'Administrativo - Estadual',
  'adm_federal': 'Administrativo - Federal',
  'adm_cartorio': 'Administrativo - Cartório',
  'adm_inpi': 'Administrativo - INPI',
  'outro': 'Outro'
};

type StatusFilter = 'all' | 'active' | 'pending' | 'closed';

// This is now a Client Component
export default function ProcessosPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  
  const initialSearchTerm = searchParams.get('search') || '';
  const initialStatusFilter = (searchParams.get('status') as StatusFilter) || 'all';
  
  const [processes, setProcesses] = useState<any[]>([]);
  const [filteredProcesses, setFilteredProcesses] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(initialStatusFilter);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch processes on component mount
  useEffect(() => {
    const fetchProcesses = async () => {
      setIsLoading(true);
      
      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/signin');
        return;
      }
      
      // Get all processes for the lawyer
      const { data, error } = await supabase
        .from('processes')
        .select('*')
        .eq('lawyer_id', session.user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching processes:', error);
        setError('There was an error fetching your processes. Please try again later.');
      } else {
        setProcesses(data || []);
        
        // Apply initial filtering if there's a search parameter
        if (initialSearchTerm) {
          const filtered = filterProcessesByTerm(data || [], initialSearchTerm);
          setFilteredProcesses(filtered);
        } else {
          setFilteredProcesses(data || []);
        }
      }
      
      setIsLoading(false);
    };
    
    fetchProcesses();
  }, [router, supabase, initialSearchTerm]);
  
  // Apply all filters to processes
  const applyFilters = (processesToFilter: any[], term: string, status: StatusFilter) => {
    // First apply search term filter
    let filtered = filterProcessesByTerm(processesToFilter, term);
    
    // Then apply status filter
    if (status !== 'all') {
      filtered = filtered.filter(process => process.status === status);
    }
    
    return filtered;
  };
  
  // Helper function to filter processes by term
  const filterProcessesByTerm = (processesToFilter: any[], term: string) => {
    if (!term.trim()) return processesToFilter;
    
    const lowerTerm = term.toLowerCase();
    return processesToFilter.filter(process => 
      (process.title && process.title.toLowerCase().includes(lowerTerm)) ||
      (process.description && process.description.toLowerCase().includes(lowerTerm)) ||
      (process.client_name && process.client_name.toLowerCase().includes(lowerTerm)) ||
      (process.case_number && process.case_number.toLowerCase().includes(lowerTerm)) ||
      (process.process_key && process.process_key.toLowerCase().includes(lowerTerm)) ||
      (process.process_type && processTypeLabels[process.process_type as ProcessType].toLowerCase().includes(lowerTerm))
    );
  };
  
  // Filter processes when search term or status filter changes
  useEffect(() => {
    const filtered = applyFilters(processes, searchTerm, statusFilter);
    setFilteredProcesses(filtered);
  }, [searchTerm, statusFilter, processes]);
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    updateUrlParams(e.target.value, statusFilter);
  };
  
  // Handle status filter change
  const handleStatusFilter = (status: StatusFilter) => {
    setStatusFilter(status);
    updateUrlParams(searchTerm, status);
  };
  
  // Update URL parameters without page reload
  const updateUrlParams = (search: string, status: StatusFilter) => {
    const newParams = new URLSearchParams(searchParams.toString());
    
    if (search.trim()) {
      newParams.set('search', search);
    } else {
      newParams.delete('search');
    }
    
    if (status !== 'all') {
      newParams.set('status', status);
    } else {
      newParams.delete('status');
    }
    
    const newUrl = `${window.location.pathname}?${newParams.toString()}`;
    window.history.pushState({}, '', newUrl);
  };
  
  // Handle search form submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // URL is already updated in handleSearchChange
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    updateUrlParams('', 'all');
  };
  
  // Check if any filters are active
  const hasActiveFilters = searchTerm.trim() !== '' || statusFilter !== 'all';
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-red-500">Error</h1>
          <p>{error}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-navy">Meus Processos</h1>
        <Link href="/dashboard/processo/new">
          <button className="inline-flex items-center px-4 py-2 bg-navy text-white rounded-md hover:bg-navy-dark">
            <Plus className="mr-2" size={16} />
            Novo Processo
          </button>
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
          <form onSubmit={handleSearchSubmit} className="relative flex-grow">
            <input
              type="text"
              placeholder="Buscar processos por título, descrição, cliente, número ou tipo..."
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-navy"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <button type="submit" className="sr-only">Search</button>
          </form>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500 whitespace-nowrap">Status:</span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleStatusFilter('all')}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  statusFilter === 'all'
                    ? 'bg-navy text-white'
                    : 'border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => handleStatusFilter('active')}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  statusFilter === 'active'
                    ? 'bg-green-600 text-white'
                    : 'border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Ativos
              </button>
              <button
                onClick={() => handleStatusFilter('pending')}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  statusFilter === 'pending'
                    ? 'bg-yellow-500 text-white'
                    : 'border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Pendentes
              </button>
              <button
                onClick={() => handleStatusFilter('closed')}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  statusFilter === 'closed'
                    ? 'bg-gray-600 text-white'
                    : 'border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Encerrados
              </button>
              
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-3 py-1.5 text-sm rounded-md border border-gray-300 hover:bg-gray-50 flex items-center"
                  title="Limpar filtros"
                >
                  <X size={14} className="mr-1" />
                  Limpar
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {isLoading ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-500">Loading processes...</p>
        </div>
      ) : filteredProcesses.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <FileText className="mx-auto mb-4 text-gray-400" size={48} />
          <h2 className="text-xl font-semibold mb-2">
            {hasActiveFilters ? 'Nenhum processo encontrado para os filtros aplicados' : 'Nenhum processo encontrado'}
          </h2>
          <p className="text-gray-500 mb-4">
            {hasActiveFilters
              ? 'Tente usar termos diferentes ou alterar os filtros.'
              : 'Você ainda não tem processos cadastrados.'}
          </p>
          {hasActiveFilters ? (
            <button 
              onClick={clearFilters}
              className="inline-flex items-center px-4 py-2 bg-navy text-white rounded-md hover:bg-navy-dark"
            >
              <X className="mr-2" size={16} />
              Limpar Filtros
            </button>
          ) : (
            <Link href="/dashboard/processo/new">
              <button className="inline-flex items-center px-4 py-2 bg-navy text-white rounded-md hover:bg-navy-dark">
                <Plus className="mr-2" size={16} />
                Criar Novo Processo
              </button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProcesses.map((process) => (
            <Link 
              key={process.id} 
              href={`/dashboard/processo/${process.process_key}`}
              className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-lg font-semibold text-navy line-clamp-2">
                    {process.title || 'Untitled Process'}
                  </h2>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    process.status === 'active' ? 'bg-green-100 text-green-800' :
                    process.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    process.status === 'closed' ? 'bg-gray-100 text-gray-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {process.status || 'Active'}
                  </span>
                </div>
                
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                  {process.description || 'No description provided.'}
                </p>
                
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div>
                    <p className="text-xs text-gray-500">Process ID</p>
                    <p className="text-sm font-medium">{process.process_key}</p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-gray-500">Type</p>
                    <p className="text-sm font-medium">
                      {process.process_type ? processTypeLabels[process.process_type as ProcessType] : 'Other'}
                    </p>
                  </div>
                  
                  {process.client_name && (
                    <div className="col-span-2">
                      <p className="text-xs text-gray-500">Client</p>
                      <p className="text-sm font-medium">{process.client_name}</p>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="mr-1" size={14} />
                    {new Date(process.created_at).toLocaleDateString()}
                  </div>
                  
                  <div className="text-navy flex items-center text-sm font-medium">
                    View Details
                    <ArrowRight className="ml-1" size={14} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
} 