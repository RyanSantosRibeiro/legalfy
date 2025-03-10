import { createClient } from '@/utils/supabase/server';
import { getLawyerProcesses, getUser } from '@/utils/supabase/queries';
import Link from 'next/link';
import { ProcessType } from '@/types/database';
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Plus,
  Filter,
  ChevronRight
} from 'lucide-react';

// Process type labels for better display
const processTypeLabels: Record<ProcessType, string> = {
  'trabalhista': 'Trabalhista',
  'civil': 'Civil',
  'jec': 'JEC',
  'familia': 'Família',
  'os': 'OS',
  'criminal': 'Criminal',
  'jecrim': 'JECRIM',
  'tributario': 'Tributário',
  'fazendario': 'Fazendário',
  'federal_civil': 'Federal - Civil',
  'federal_jec': 'Federal - JEC',
  'federal_criminal': 'Federal - Criminal',
  'federal_jecrim': 'Federal - JECRIM',
  'federal_tributario': 'Federal - Tributário',
  'federal_fazendario': 'Federal - Fazendário',
  'adm_inss': 'INSS',
  'adm_municipal': 'Municipal',
  'adm_estadual': 'Estadual',
  'adm_federal': 'Federal',
  'adm_cartorio': 'Cartório',
  'adm_inpi': 'INPI',
  'outro': 'Outro'
};

// Process type categories for organization
const processTypeCategories = {
  'Trabalhista': ['trabalhista'],
  'Civil': ['civil', 'jec', 'familia', 'os'],
  'Criminal': ['criminal', 'jecrim'],
  'Tributário e Fazendário': ['tributario', 'fazendario'],
  'Federal': [
    'federal_civil', 'federal_jec', 'federal_criminal', 
    'federal_jecrim', 'federal_tributario', 'federal_fazendario'
  ],
  'Administrativo': [
    'adm_inss', 'adm_municipal', 'adm_estadual', 
    'adm_federal', 'adm_cartorio', 'adm_inpi'
  ],
  'Outro': ['outro']
};

// This is a Server Component
export default async function DashboardPage() {
  // Create Supabase client
  const supabase = createClient();
  
  // Get the current user
  const user = await getUser(supabase);
  
  if (!user) {
    return null; // The layout will handle the redirect
  }
  
  // Get all processes for the lawyer using the centralized query
  const processes = await getLawyerProcesses(supabase, user.id);
  
  if (!processes) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-red-500">Error</h1>
        <p>Unable to fetch process information.</p>
      </div>
    );
  }

  // Calculate statistics
  const activeProcesses = processes.filter(p => p.status === 'active' || p.status === 'pending');
  const closedProcesses = processes.filter(p => p.status === 'closed');
  const preFilingProcesses = processes.filter(p => p.status === 'pre-filing');
  
  // Group processes by type
  const processesByType: Record<string, any[]> = {};
  
  // Initialize with empty arrays for all process types
  Object.keys(processTypeLabels).forEach(type => {
    processesByType[type] = [];
  });
  
  // Fill with actual processes
  processes.forEach(process => {
    const type = process.process_type || 'outro';
    if (!processesByType[type]) {
      processesByType[type] = [];
    }
    processesByType[type].push(process);
  });
  
  return (
    <div className="container mx-auto px-4 py-8 bg-gray-100">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold font-merriweather text-navy mb-2">Dashboard</h1>
          <p className="text-gray-600">
            Monitor and manage your legal cases
          </p>
        </div>
        <Link href="/dashboard/processo/new">
          <button className="mt-4 md:mt-0 bg-navy text-white px-4 py-2 rounded-md flex items-center hover:bg-navy/90">
            <Plus className="mr-2" size={18} />
            New Process
          </button>
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Active Cases" 
          value={activeProcesses.length} 
          icon={<FileText className="text-navy" size={24} />} 
        />
        <StatCard 
          title="Closed Cases" 
          value={closedProcesses.length} 
          icon={<CheckCircle className="text-navy" size={24} />} 
        />
        <StatCard 
          title="Pre-Filing" 
          value={preFilingProcesses.length} 
          icon={<Clock className="text-navy" size={24} />} 
        />
        <StatCard 
          title="Total Cases" 
          value={processes.length} 
          icon={<FileText className="text-navy" size={24} />} 
        />
      </div>

      {/* Recent Cases */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold font-merriweather text-navy">Recent Cases</h2>
          <Link href="/dashboard/processo" className="text-navy hover:text-gold">
            View All
          </Link>
        </div>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Process Key
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {processes.slice(0, 5).map((process) => (
                <tr key={process.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-navy">
                    {process.process_key}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {process.title || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {process.process_type ? 
                      <Link href={`/dashboard/${process.process_type}`} className="text-navy hover:underline">
                        {processTypeLabels[process.process_type as ProcessType]}
                      </Link> : 
                      '-'
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {process.client_name || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      process.status === 'active' ? 'bg-green-100 text-green-800' :
                      process.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      process.status === 'closed' ? 'bg-gray-100 text-gray-800' :
                      process.status === 'pre-filing' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {process.status || 'Active'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {new Date(process.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    <Link href={`/dashboard/processo/${process.process_key}`} className="text-navy hover:text-gold mr-3">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Status Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatusColumn 
          title="Active" 
          processes={activeProcesses} 
          status="active"
        />
        <StatusColumn 
          title="Pending" 
          processes={processes.filter(p => p.status === 'pending')} 
          status="pending"
        />
        <StatusColumn 
          title="Pre-Filing" 
          processes={preFilingProcesses} 
          status="pre-filing"
        />
        <StatusColumn 
          title="Closed" 
          processes={closedProcesses} 
          status="closed"
        />
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

// StatusColumn Component
function StatusColumn({ 
  title, 
  processes, 
  status 
}: { 
  title: string; 
  processes: any[]; 
  status: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-100">
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <h3 className="font-medium text-gray-700">{title}</h3>
        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium text-white ${
          status === 'active' ? 'bg-green-500' :
          status === 'pending' ? 'bg-yellow-500' :
          status === 'closed' ? 'bg-gray-500' :
          status === 'pre-filing' ? 'bg-blue-500' :
          'bg-green-500'
        }`}>
          {processes.length}
        </div>
      </div>
      
      <div className="p-2 space-y-2 max-h-[400px] overflow-y-auto">
        {processes.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm">
            No processes in this category
          </div>
        ) : (
          processes.slice(0, 5).map((process) => (
            <ProcessCard key={process.id} process={process} />
          ))
        )}
        
        {processes.length > 5 && (
          <div className="text-center pt-2 pb-1">
            <Link href="/dashboard/processo" className="text-sm text-navy hover:text-gold">
              View all {processes.length} processes
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

// ProcessCard Component
function ProcessCard({ process }: { process: any }) {
  return (
    <Link href={`/dashboard/processo/${process.process_key}`}>
      <div className="p-3 bg-white rounded-md border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-medium text-navy">{process.title || process.process_key}</h4>
            <p className="text-sm text-gray-500 mt-1">{process.client_name || 'No client'}</p>
          </div>
          <span className={`px-2 py-1 text-xs rounded-full ${
            process.status === 'active' ? 'bg-green-100 text-green-800' :
            process.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
            process.status === 'closed' ? 'bg-gray-100 text-gray-800' :
            process.status === 'pre-filing' ? 'bg-blue-100 text-blue-800' :
            'bg-green-100 text-green-800'
          }`}>
            {process.status || 'Active'}
          </span>
        </div>
        {process.process_type && (
          <div className="mt-2 flex items-center">
            <Filter className="text-gray-400 mr-1" size={12} />
            <Link href={`/dashboard/${process.process_type}`} className="text-xs text-gray-500 hover:text-navy">
              {processTypeLabels[process.process_type as ProcessType]}
            </Link>
          </div>
        )}
        <p className="text-xs text-gray-400 mt-2">
          Created: {new Date(process.created_at).toLocaleDateString()}
        </p>
      </div>
    </Link>
  );
} 