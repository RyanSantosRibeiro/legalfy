'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
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
  Briefcase,
  ClipboardList
} from 'lucide-react';
import ShareProcessDialog from '@/components/process/ShareProcessDialog';
import ProcessDocuments from '@/components/process/ProcessDocuments';

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
export default function LawyerProcessPage({
  params
}: {
  params: { processKey: string };
}) {
  const router = useRouter();
  const supabase = createClient();
  const processKey = params.processKey;
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [process, setProcess] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadProcess = async () => {
      const user = await getUser(supabase);
      if (!user) {
        router.push('/signin');
        return;
      }
      
      const processData = await getProcessByKey(supabase, processKey, user.id);
      if (!processData) {
        router.push('/dashboard/processo');
        return;
      }
      
      setProcess(processData);
      setIsLoading(false);
    };
    
    loadProcess();
  }, [processKey, router, supabase]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  // Format dates
  const createdDate = new Date(process?.created_at).toLocaleDateString();
  const updatedDate = new Date(process?.updated_at).toLocaleDateString();
  const filingDate = process?.filing_date ? new Date(process.filing_date).toLocaleDateString() : null;
  
  // Get process type label
  const processTypeLabel = process?.process_type ? 
    processTypeLabels[process.process_type as ProcessType] : 'Outro';

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50">
      <div className="mb-6">
        <Link href="/dashboard/processo" className="inline-flex items-center text-navy hover:text-gold">
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
                  {process?.title || 'Untitled Process'}
                </h1>
                <p className="text-gray-500 mt-1">
                  Process ID: {process?.process_key}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                process?.status === 'active' ? 'bg-green-100 text-green-800' :
                process?.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                process?.status === 'closed' ? 'bg-gray-100 text-gray-800' :
                process?.status === 'pre-filing' ? 'bg-blue-100 text-blue-800' :
                'bg-green-100 text-green-800'
              }`}>
                {process?.status || 'Active'}
              </span>
            </div>
            
            {process?.description && (
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
              
              {process?.case_number && (
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
              <Link href={`/dashboard/processo/${process?.process_key}/edit`}>
                <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  <Edit className="mr-2" size={16} />
                  Edit Process
                </button>
              </Link>
              
              <Link href={`/dashboard/processo/${process?.process_key}/questionnaire`}>
                <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  <ClipboardList className="mr-2" size={16} />
                  Questionário
                </button>
              </Link>
              
              <button 
                onClick={() => setIsShareDialogOpen(true)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Share2 className="mr-2" size={16} />
                Share with Client
              </button>
            </div>
          </div>
          
          {/* Court Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Shield className="mr-2" size={20} />
              Court Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {process?.court && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-1">Court/Jurisdiction</h3>
                  <p className="text-gray-600">{process.court}</p>
                </div>
              )}
              
              {process?.case_number && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-1">Case Number</h3>
                  <p className="text-gray-600">{process.case_number}</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Client Information */}
          {(process?.client_name || process?.client_email) && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Users className="mr-2" size={20} />
                Client Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {process?.client_name && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-1">Client Name</h3>
                    <p className="text-gray-600">{process.client_name}</p>
                  </div>
                )}
                
                {process?.client_email && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-1">Client Email</h3>
                    <p className="text-gray-600">{process.client_email}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Documents Section */}
          <ProcessDocuments 
            processId={process.id} 
            processKey={processKey}
          />
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <button className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-100 flex items-center text-navy">
                <FileText className="mr-2" size={16} />
                Add Document
              </button>
              <button className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-100 flex items-center text-navy">
                <Calendar className="mr-2" size={16} />
                Schedule Hearing
              </button>
              <button className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-100 flex items-center text-navy">
                <Copy className="mr-2" size={16} />
                Create Invoice
              </button>
            </div>
          </div>
          
          {/* Process Timeline */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Timeline</h2>
            <div className="space-y-4">
              <div className="border-l-2 border-navy pl-4 pb-4">
                <p className="text-xs text-gray-500">{createdDate}</p>
                <p className="font-medium">Process Created</p>
                <p className="text-sm text-gray-600">Initial process information added to the system.</p>
              </div>
              
              <div className="border-l-2 border-navy pl-4">
                <p className="text-xs text-gray-500">{updatedDate}</p>
                <p className="font-medium">Last Updated</p>
                <p className="text-sm text-gray-600">Process information was updated.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ShareProcessDialog
        isOpen={isShareDialogOpen}
        onClose={() => setIsShareDialogOpen(false)}
        processKey={processKey}
        processTitle={process?.title || ''}
        clientEmail={process?.client_email}
      />
    </div>
  );
} 