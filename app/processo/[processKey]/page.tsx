import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { getPublicProcessByKey } from '@/utils/supabase/queries';
import Link from 'next/link';
import { ProcessType } from '@/types/database';
import { 
  Calendar,
  Clock,
  FileText,
  Shield,
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
export default async function PublicProcessPage({
  params
}: {
  params: { processKey: string };
}) {
  const processKey = params.processKey;
  
  // Create Supabase client
  const supabase = createClient();
  
  // Get the process data using the public query
  const process = await getPublicProcessByKey(supabase, processKey);
  
  // If no process is found, show not found message
  if (!process) {
    return (
      <div className="container mx-auto px-4 py-8 bg-gray-50">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-red-500">Process Not Found</h1>
          <p>The requested process does not exist or is not available for public view.</p>
          <Link href="/" className="mt-4 inline-block text-navy hover:text-gold">
            <ArrowLeft className="inline-block mr-2" size={16} />
            Back to Home
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
        <Link href="/" className="inline-flex items-center text-navy hover:text-gold">
          <ArrowLeft className="mr-2" size={16} />
          Back to Home
        </Link>
      </div>
      
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
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
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
          
          {process.court && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-1">Court/Jurisdiction</h3>
              <p className="text-gray-600 flex items-center">
                <Shield className="mr-2" size={16} />
                {process.court}
              </p>
            </div>
          )}
          
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-1">Last Updated</h3>
            <p className="text-gray-600 flex items-center">
              <Clock className="mr-2" size={16} />
              {updatedDate}
            </p>
          </div>
        </div>
        
        <div className="mt-8 p-4 bg-blue-50 rounded-md">
          <p className="text-blue-800 text-sm">
            This is a public view of the process. For more details, please contact your lawyer.
          </p>
        </div>
      </div>
    </div>
  );
} 