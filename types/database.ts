export interface User {
  id: string;
  email?: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
}

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

export interface Process {
  id: string;
  process_key: string;
  lawyer_id: string;
  client_name?: string;
  client_email?: string;
  title?: string;
  description?: string;
  status?: string;
  process_type?: ProcessType;
  court?: string;
  case_number?: string;
  filing_date?: string;
  created_at: string;
  updated_at: string;
}

export interface Database {
  users: User[];
  processes: Process[];
} 