import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { getUser, getProcessByKey } from '@/utils/supabase/queries';
import Link from 'next/link';
import { ProcessType } from '@/types/database';
import { 
  Calendar,
  Clock,
  Copy,
  Edit,
  FileText,
  Share2,
  Shield,
  Users,
  ArrowLeft,
  Briefcase
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

// This is a Server Component
export default async function ProcessoPage({
  params
}: {
  params: { processKey: string };
}) {
  const processKey = params.processKey;
  
  // Create Supabase client
  const supabase = createClient();
  
  // Get the current user (lawyer)
  const user = await getUser(supabase);
  
  // If no user is logged in, redirect to sign in page
  if (!user) {
    return redirect('/signin');
  }
  
  // Get the process data using the centralized query
  const process = await getProcessByKey(supabase, processKey, user.id);
  
  // If no process is found, show not found message
  if (!process) {
    return (
      <div className="container mx-auto px-4 py-8 bg-gray-50">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-red-500">Process Not Found</h1>
          <p>The requested process does not exist or you don't have access to it.</p>
          <Link href="/processo" className="mt-4 inline-block text-navy hover:text-gold">
            <ArrowLeft className="inline-block mr-2" size={16} />
            Back to Processes
          </Link>
        </div>
      </div>
    );
  }
  
  // Format dates
  const createdDate = new Date(process.created_at).toLocaleDateString();
  const updatedDate = new Date(process.updated_at).toLocaleDateString();
  const filingDate = process.filing_date ? new Date(process.filing_date).toLocaleDateString() : null;
  
  // Get process type label
  const processTypeLabel = process.process_type ? 
    processTypeLabels[process.process_type as ProcessType] : 'Outro';
  
  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50">
      <div className="mb-6">
        <Link href="/processo" className="inline-flex items-center text-navy hover:text-gold">
          <ArrowLeft className="mr-2" size={16} />
          Back to Processes
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-2xl font-bold font-merriweather text-navy">
                  {process.title || 'Untitled Process'}
                </h1>
                <p className="text-gray-500 mt-1">
                  Process ID: {process.process_key}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                process.status === 'active' ? 'bg-green-100 text-green-800' :
                process.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                process.status === 'closed' ? 'bg-gray-100 text-gray-800' :
                process.status === 'pre-filing' ? 'bg-blue-100 text-blue-800' :
                'bg-green-100 text-green-800'
              }`}>
                {process.status || 'Active'}
              </span>
            </div>
            
            {process.description && (
              <div className="mt-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-1">Description</h3>
                <p className="text-gray-600">{process.description}</p>
              </div>
            )}
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-1">Created</h3>
                <p className="text-gray-600 flex items-center">
                  <Calendar className="mr-2" size={16} />
                  {createdDate}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-1">Last Updated</h3>
                <p className="text-gray-600 flex items-center">
                  <Clock className="mr-2" size={16} />
                  {updatedDate}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-1">Process Type</h3>
                <p className="text-gray-600 flex items-center">
                  <Briefcase className="mr-2" size={16} />
                  {processTypeLabel}
                </p>
              </div>
              
              {process.case_number && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-1">Case Number</h3>
                  <p className="text-gray-600 flex items-center">
                    <FileText className="mr-2" size={16} />
                    {process.case_number}
                  </p>
                </div>
              )}
              
              {filingDate && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-1">Filing Date</h3>
                  <p className="text-gray-600 flex items-center">
                    <Calendar className="mr-2" size={16} />
                    {filingDate}
                  </p>
                </div>
              )}
            </div>
            
            <div className="mt-6 flex flex-wrap gap-2">
              <Link href={`/processo/${process.process_key}/edit`}>
                <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  <Edit className="mr-2" size={16} />
                  Edit Process
                </button>
              </Link>
              
              <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <Share2 className="mr-2" size={16} />
                Share with Client
              </button>
            </div>
          </div>
          
          {/* Court Information */}
          {process.court && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold font-merriweather text-navy mb-4">Court Information</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-1">Court</h3>
                  <p className="text-gray-600">{process.court}</p>
                </div>
                
                {process.case_number && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-1">Case Number</h3>
                    <p className="text-gray-600">{process.case_number}</p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Documents Section - Placeholder */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold font-merriweather text-navy mb-4">Documents</h2>
            <div className="p-10 border border-dashed rounded-md flex flex-col items-center justify-center">
              <FileText className="h-10 w-10 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-1">No documents yet</h3>
              <p className="text-sm text-gray-500 mb-4">
                Upload documents related to this process
              </p>
              <button className="px-4 py-2 bg-navy text-white rounded-md hover:bg-navy/90">
                Upload Documents
              </button>
            </div>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Client Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold font-merriweather text-navy mb-4">Client Information</h2>
            {process.client_name ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-1">Client Name</h3>
                  <p className="text-gray-600">{process.client_name}</p>
                </div>
                
                {process.client_email && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-1">Client Email</h3>
                    <p className="text-gray-600">{process.client_email}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-4">
                <Users className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">No client information</p>
                <button className="mt-2 text-navy hover:text-gold text-sm">
                  Add Client
                </button>
              </div>
            )}
          </div>
          
          {/* Access Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold font-merriweather text-navy mb-4">Client Access</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-1">Access Link</h3>
                <div className="flex items-center">
                  <input 
                    type="text" 
                    value={`${process.process_key}`} 
                    readOnly 
                    className="flex-1 p-2 border border-gray-300 rounded-l-md text-sm bg-gray-50"
                  />
                  <button className="p-2 bg-navy text-white rounded-r-md hover:bg-navy/90">
                    <Copy size={16} />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Share this link with your client to provide access to case status
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-1">Security</h3>
                <div className="flex items-center mt-2">
                  <Shield className="text-navy mr-2" size={16} />
                  <span className="text-sm text-gray-600">Access code required</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Status History - Placeholder */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold font-merriweather text-navy mb-4">Status History</h2>
            <div className="space-y-4">
              <div className="border-l-2 border-navy pl-4 pb-4">
                <p className="text-sm text-gray-500">{createdDate}</p>
                <h3 className="font-medium text-navy">Process Created</h3>
                <p className="text-sm text-gray-600">Initial status: {process.status}</p>
              </div>
              
              <div className="border-l-2 border-gray-200 pl-4">
                <p className="text-sm text-gray-500">{updatedDate}</p>
                <h3 className="font-medium text-navy">Last Updated</h3>
                <p className="text-sm text-gray-600">Current status: {process.status}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 