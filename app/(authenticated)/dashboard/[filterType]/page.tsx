import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ProcessType } from '@/types/database';
import { getUser } from '@/utils/supabase/queries';
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Plus,
  ArrowLeft,
  Filter
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

// Valid process types for URL validation
const validProcessTypes: ProcessType[] = [
  'trabalhista',
  'civil',
  'jec',
  'familia',
  'os',
  'criminal',
  'jecrim',
  'tributario',
  'fazendario',
  'federal_civil',
  'federal_jec',
  'federal_criminal',
  'federal_jecrim',
  'federal_tributario',
  'federal_fazendario',
  'adm_inss',
  'adm_municipal',
  'adm_estadual',
  'adm_federal',
  'adm_cartorio',
  'adm_inpi',
  'outro'
];

// This is a Server Component
export default async function FilteredDashboardPage({
  params
}: {
  params: { filterType: string };
}) {
  const filterType = params.filterType;
  
  // Validate filter type
  if (!validProcessTypes.includes(filterType as ProcessType)) {
    return redirect('/dashboard');
  }
  
  // Create Supabase client
  const supabase = createClient();
  
  // Get the current user
  const user = await getUser(supabase);
  
  if (!user) {
    return redirect('/signin');
  }
  
  // Get processes filtered by type
  const { data: processes, error: processesError } = await supabase
    .from('processes')
    .select('*')
    .eq('lawyer_id', user.id)
    .eq('process_type', filterType)
    .order('created_at', { ascending: false });
  
  if (processesError) {
    console.error('Error fetching processes:', processesError);
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-red-500">Error</h1>
        <p>Unable to fetch process information.</p>
      </div>
    );
  }
  
  // Get counts for statistics
  const { data: activeCount } = await supabase
    .from('processes')
    .select('id', { count: 'exact', head: true })
    .eq('lawyer_id', user.id)
    .eq('process_type', filterType)
    .in('status', ['active', 'pending']);
    
  const { data: closedCount } = await supabase
    .from('processes')
    .select('id', { count: 'exact', head: true })
    .eq('lawyer_id', user.id)
    .eq('process_type', filterType)
    .eq('status', 'closed');
    
  const { data: preFilingCount } = await supabase
    .from('processes')
    .select('id', { count: 'exact', head: true })
    .eq('lawyer_id', user.id)
    .eq('process_type', filterType)
    .eq('status', 'pre-filing');
  
  // Get the human-readable label for the filter type
  const filterTypeLabel = processTypeLabels[filterType as ProcessType];
  
  return (
    <div className="container mx-auto px-4 py-8 bg-gray-100">
      <div className="mb-6">
        <Link href="/dashboard" className="inline-flex items-center text-navy hover:text-gold">
          <ArrowLeft className="mr-2" size={16} />
          Back to Dashboard
        </Link>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <div className="flex items-center">
            <h1 className="text-3xl font-bold font-merriweather text-navy mb-2">
              {filterTypeLabel} Processes
            </h1>
            <span className="ml-3 bg-navy text-white text-xs px-2 py-1 rounded-full">
              {processes?.length || 0}
            </span>
          </div>
          <p className="text-gray-600">
            Filtered view of your {filterTypeLabel.toLowerCase()} cases
          </p>
        </div>
        <Link href="/processo/new">
          <button className="mt-4 md:mt-0 bg-navy text-white px-4 py-2 rounded-md flex items-center hover:bg-navy/90">
            <Plus className="mr-2" size={18} />
            New Process
          </button>
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard 
          title="Active Cases" 
          value={activeCount?.count || 0} 
          icon={<FileText className="text-navy" size={24} />} 
        />
        <StatCard 
          title="Closed Cases" 
          value={closedCount?.count || 0} 
          icon={<CheckCircle className="text-navy" size={24} />} 
        />
        <StatCard 
          title="Pre-Filing" 
          value={preFilingCount?.count || 0} 
          icon={<Clock className="text-navy" size={24} />} 
        />
      </div>

      {/* Process List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold font-merriweather text-navy">
            {filterTypeLabel} Process List
          </h2>
          <div className="flex items-center text-sm text-gray-500">
            <Filter size={16} className="mr-1" />
            Filtered by: {filterTypeLabel}
          </div>
        </div>
        
        {processes && processes.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Process Key</th>
                  <th className="py-3 px-6 text-left">Title</th>
                  <th className="py-3 px-6 text-left">Client</th>
                  <th className="py-3 px-6 text-left">Status</th>
                  <th className="py-3 px-6 text-left">Created At</th>
                  <th className="py-3 px-6 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm">
                {processes.map((process) => (
                  <tr key={process.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-6 text-left">
                      <Link href={`/processo/${process.process_key}`} className="text-navy hover:underline">
                        {process.process_key}
                      </Link>
                    </td>
                    <td className="py-3 px-6 text-left">
                      {process.title || '-'}
                    </td>
                    <td className="py-3 px-6 text-left">
                      {process.client_name || '-'}
                    </td>
                    <td className="py-3 px-6 text-left">
                      <span className={`py-1 px-3 rounded-full text-xs ${
                        process.status === 'active' ? 'bg-green-100 text-green-800' :
                        process.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        process.status === 'closed' ? 'bg-gray-100 text-gray-800' :
                        process.status === 'pre-filing' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {process.status || 'Active'}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-left">
                      {new Date(process.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-6 text-left">
                      <div className="flex items-center space-x-3">
                        <Link href={`/processo/${process.process_key}`} className="text-navy hover:text-gold mr-3">
                          View
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <p className="text-gray-500">No {filterTypeLabel.toLowerCase()} processes found.</p>
            <p className="mt-2 text-sm text-gray-400">Create a new process to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// StatCard Component
function StatCard({ title, value, icon }: { title: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-3xl font-bold mt-1 text-navy">{value}</h3>
        </div>
        <div className="p-3 rounded-full bg-navy/10">
          {icon}
        </div>
      </div>
    </div>
  );
} 