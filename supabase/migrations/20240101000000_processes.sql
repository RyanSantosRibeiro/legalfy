-- Create extension for UUID generation if it doesn't exist
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum type for process types
CREATE TYPE process_type AS ENUM (
  -- Trabalhista
  'trabalhista',
  
  -- Civil categories
  'civil',
  'jec',
  'familia',
  'os',
  
  -- Criminal categories
  'criminal',
  'jecrim',
  
  -- Tax and Treasury categories
  'tributario',
  'fazendario',
  
  -- Federal categories
  'federal_civil',
  'federal_jec',
  'federal_criminal',
  'federal_jecrim',
  'federal_tributario',
  'federal_fazendario',
  
  -- Administrative categories
  'adm_inss',
  'adm_municipal',
  'adm_estadual',
  'adm_federal',
  'adm_cartorio',
  'adm_inpi',
  
  -- Other
  'outro'
);

-- Create processes table
CREATE TABLE IF NOT EXISTS processes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  process_key TEXT NOT NULL UNIQUE,
  lawyer_id UUID NOT NULL REFERENCES auth.users(id),
  client_name TEXT,
  client_email TEXT,
  title TEXT,
  description TEXT,
  status TEXT DEFAULT 'active',
  process_type process_type DEFAULT 'outro',
  court TEXT,
  case_number TEXT,
  filing_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS processes_lawyer_id_idx ON processes(lawyer_id);
CREATE INDEX IF NOT EXISTS processes_process_key_idx ON processes(process_key);
CREATE INDEX IF NOT EXISTS processes_process_type_idx ON processes(process_type);

-- Enable Row Level Security
ALTER TABLE processes ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow users (lawyers) to view their own processes
CREATE POLICY "Lawyers can view their own processes"
  ON processes FOR SELECT
  USING (lawyer_id = auth.uid());

-- Allow users (lawyers) to insert their own processes
CREATE POLICY "Lawyers can insert their own processes"
  ON processes FOR INSERT
  WITH CHECK (lawyer_id = auth.uid());

-- Allow users (lawyers) to update their own processes
CREATE POLICY "Lawyers can update their own processes"
  ON processes FOR UPDATE
  USING (lawyer_id = auth.uid());

-- Allow users (lawyers) to delete their own processes
CREATE POLICY "Lawyers can delete their own processes"
  ON processes FOR DELETE
  USING (lawyer_id = auth.uid()); 