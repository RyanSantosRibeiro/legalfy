export type ProcessType =
  | 'trabalhista'
  | 'civil'
  | 'jec'
  | 'familia'
  | 'os'
  | 'criminal'
  | 'jecrim'
  | 'tributario'
  | 'fazendario'
  | 'federal_civil'
  | 'federal_jec'
  | 'federal_criminal'
  | 'federal_jecrim'
  | 'federal_tributario'
  | 'federal_fazendario'
  | 'adm_inss'
  | 'adm_municipal'
  | 'adm_estadual'
  | 'adm_federal'
  | 'adm_cartorio'
  | 'adm_inpi'
  | 'outro';

export type ProcessStatus = 'active' | 'pending' | 'closed' | 'pre-filing';

export interface Process {
  id: string;
  process_key: string;
  title: string;
  description: string | null;
  process_type: ProcessType;
  status: ProcessStatus;
  lawyer_id: string;
  client_id: string | null;
  client_name: string | null;
  client_email: string | null;
  client_phone: string | null;
  court: string | null;
  case_number: string | null;
  judge: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProcessDocument {
  id: string;
  process_id: string;
  name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  uploaded_by: string;
  created_at: string;
  updated_at: string;
}

export interface ProcessQuestionnaire {
  id: string;
  process_id: string;
  data: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface ProcessWithRelations extends Process {
  documents?: ProcessDocument[];
  questionnaire?: ProcessQuestionnaire;
} 