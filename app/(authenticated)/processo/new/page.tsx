'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { ProcessType } from '@/types/database';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  Calendar, 
  FileText, 
  Info, 
  Lock, 
  Save, 
  User
} from 'lucide-react';

export default function CreateProcess() {
  const router = useRouter();
  const supabase = createClient();
  
  // Generate a unique process key
  const generateProcessKey = () => {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    return `PROC-${year}-${randomNum}`;
  };
  
  const [processKey] = useState(generateProcessKey());
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
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
        toast.error('You must be logged in to create a process');
        router.push('/signin');
        return;
      }
      
      // Create the process in the database
      const { data, error } = await supabase
        .from('processes')
        .insert({
          process_key: processKey,
          title: formData.title,
          description: formData.description,
          status: formData.status,
          process_type: formData.process_type,
          case_number: formData.case_number || null,
          court: formData.court || null,
          client_name: formData.client_name || null,
          client_email: formData.client_email || null,
          filing_date: formData.filing_date || null,
          lawyer_id: user.id
        })
        .select();
      
      if (error) {
        throw error;
      }
      
      toast.success('Process created successfully!');
      router.push(`/processo/${processKey}`);
    } catch (error) {
      console.error('Error creating process:', error);
      toast.error('Failed to create process. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Process type categories for the dropdown
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
  
  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50">
      <div className="mb-6">
        <Link href="/processo" className="inline-flex items-center text-navy hover:text-gold">
          <ArrowLeft className="mr-2" size={16} />
          Back to Processes
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold font-merriweather text-navy mb-4">
                Basic Information
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Process Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-navy focus:border-navy"
                    placeholder="Enter a descriptive title for this process"
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-navy focus:border-navy"
                    placeholder="Provide details about this process"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                      Status <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      required
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-navy focus:border-navy"
                    >
                      <option value="active">Active</option>
                      <option value="pending">Pending</option>
                      <option value="pre-filing">Pre-Filing</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="process_type" className="block text-sm font-medium text-gray-700 mb-1">
                      Process Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="process_type"
                      name="process_type"
                      value={formData.process_type}
                      onChange={handleChange}
                      required
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-navy focus:border-navy"
                    >
                      {Object.entries(processTypeCategories).map(([category, types]) => (
                        <optgroup key={category} label={category}>
                          {types.map(type => (
                            <option key={type} value={type}>
                              {processTypeLabels[type as ProcessType]}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Court Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold font-merriweather text-navy mb-4">
                Court Information
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="court" className="block text-sm font-medium text-gray-700 mb-1">
                    Court
                  </label>
                  <input
                    type="text"
                    id="court"
                    name="court"
                    value={formData.court}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-navy focus:border-navy"
                    placeholder="Enter the court name"
                  />
                </div>
                
                <div>
                  <label htmlFor="case_number" className="block text-sm font-medium text-gray-700 mb-1">
                    Case Number
                  </label>
                  <input
                    type="text"
                    id="case_number"
                    name="case_number"
                    value={formData.case_number}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-navy focus:border-navy"
                    placeholder="Enter the case number if available"
                  />
                </div>
                
                <div>
                  <label htmlFor="filing_date" className="block text-sm font-medium text-gray-700 mb-1">
                    Filing Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      id="filing_date"
                      name="filing_date"
                      value={formData.filing_date}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-navy focus:border-navy"
                    />
                    <Calendar className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" size={16} />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Client Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold font-merriweather text-navy mb-4">
                Client Information
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="client_name" className="block text-sm font-medium text-gray-700 mb-1">
                    Client Name
                  </label>
                  <input
                    type="text"
                    id="client_name"
                    name="client_name"
                    value={formData.client_name}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-navy focus:border-navy"
                    placeholder="Enter client's full name"
                  />
                </div>
                
                <div>
                  <label htmlFor="client_email" className="block text-sm font-medium text-gray-700 mb-1">
                    Client Email
                  </label>
                  <input
                    type="email"
                    id="client_email"
                    name="client_email"
                    value={formData.client_email}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-navy focus:border-navy"
                    placeholder="Enter client's email address"
                  />
                </div>
              </div>
            </div>
            
            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-navy text-white rounded-md hover:bg-navy/90 flex items-center disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <Save className="mr-2" size={18} />
                {isSubmitting ? 'Creating Process...' : 'Create Process'}
              </button>
            </div>
          </form>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Process Identifier */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold font-merriweather text-navy mb-4">Process Identifier</h2>
            <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
              <div className="flex items-center">
                <FileText className="text-navy mr-2" size={20} />
                <span className="text-lg font-medium text-navy">{processKey}</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                This is the unique identifier for this process. It will be used to access and reference this process.
              </p>
            </div>
          </div>
          
          {/* Help Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold font-merriweather text-navy mb-4">Help</h2>
            <div className="space-y-4">
              <div className="flex">
                <Info className="text-navy flex-shrink-0 mt-1 mr-3" size={18} />
                <div>
                  <h3 className="font-medium text-gray-700">Required Fields</h3>
                  <p className="text-sm text-gray-600">
                    Fields marked with an asterisk (*) are required to create a process.
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <User className="text-navy flex-shrink-0 mt-1 mr-3" size={18} />
                <div>
                  <h3 className="font-medium text-gray-700">Client Information</h3>
                  <p className="text-sm text-gray-600">
                    Adding client information is optional but recommended for better organization.
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <Lock className="text-navy flex-shrink-0 mt-1 mr-3" size={18} />
                <div>
                  <h3 className="font-medium text-gray-700">Privacy</h3>
                  <p className="text-sm text-gray-600">
                    All process information is private and only accessible to you unless explicitly shared.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 