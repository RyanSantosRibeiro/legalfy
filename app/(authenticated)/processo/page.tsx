import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { getUser, getLawyerProcesses } from '@/utils/supabase/queries';
import Link from 'next/link';
import { ProcessType } from '@/types/database';

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

// This is a Server Component
export default async function ProcessosPage() {
  // Create Supabase client
  const supabase = createClient();
  
  // Get the current user (lawyer)
  const user = await getUser(supabase);
  
  // If no user is logged in, redirect to sign in page
  if (!user) {
    return redirect('/signin');
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
  
  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold font-merriweather text-navy">
            My Processes
          </h1>
          <Link href="/processo/new">
            <button className="bg-navy text-white px-4 py-2 rounded hover:bg-navy/90">
              New Process
            </button>
          </Link>
        </div>
        
        {processes && processes.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Process Key</th>
                  <th className="py-3 px-6 text-left">Title</th>
                  <th className="py-3 px-6 text-left">Type</th>
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
                      {process.process_type ? processTypeLabels[process.process_type as ProcessType] : '-'}
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
                        <Link href={`/processo/${process.process_key}`} className="text-blue-600 hover:text-blue-900">
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
            <p className="text-gray-500">No processes found.</p>
            <p className="mt-2 text-sm text-gray-400">Create a new process to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
} 