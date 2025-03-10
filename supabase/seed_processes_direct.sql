-- Insert test processes for user ID: 05bbcff3-bbc5-4c2b-b988-f79cb65933e7
-- Run this directly in the Supabase SQL editor

-- Process 1: Active civil case
INSERT INTO public.processes (
  id,
  process_key,
  lawyer_id,
  client_name,
  client_email,
  title,
  description,
  status,
  process_type,
  court,
  case_number,
  filing_date,
  created_at,
  updated_at
) VALUES (
  uuid_generate_v4(),
  'CIVIL-2023-001',
  '05bbcff3-bbc5-4c2b-b988-f79cb65933e7',
  'John Smith',
  'john.smith@example.com',
  'Smith vs. Johnson - Property Dispute',
  'Property boundary dispute between neighbors. Client claims neighbor built fence 2 feet into their property.',
  'active',
  'civil',
  'County Civil Court',
  'CC-2023-45678',
  '2023-10-15',
  NOW(),
  NOW()
);

-- Process 2: Pending family case
INSERT INTO public.processes (
  id,
  process_key,
  lawyer_id,
  client_name,
  client_email,
  title,
  description,
  status,
  process_type,
  court,
  case_number,
  filing_date,
  created_at,
  updated_at
) VALUES (
  uuid_generate_v4(),
  'FAM-2023-042',
  '05bbcff3-bbc5-4c2b-b988-f79cb65933e7',
  'Maria Rodriguez',
  'maria.r@example.com',
  'Rodriguez Divorce Proceedings',
  'Divorce case with custody arrangements for 2 children and division of assets including family home and retirement accounts.',
  'pending',
  'familia',
  'Family Court Division',
  'FC-2023-78945',
  '2023-11-20',
  NOW(),
  NOW()
);

-- Process 3: Closed criminal case
INSERT INTO public.processes (
  id,
  process_key,
  lawyer_id,
  client_name,
  client_email,
  title,
  description,
  status,
  process_type,
  court,
  case_number,
  filing_date,
  created_at,
  updated_at
) VALUES (
  uuid_generate_v4(),
  'CRIM-2023-103',
  '05bbcff3-bbc5-4c2b-b988-f79cb65933e7',
  'David Williams',
  'david.w@example.com',
  'State vs. Williams - Misdemeanor',
  'Client charged with misdemeanor trespassing. Case resolved with community service agreement.',
  'closed',
  'criminal',
  'Municipal Criminal Court',
  'CR-2023-12345',
  '2023-08-05',
  NOW() - INTERVAL '3 months',
  NOW() - INTERVAL '1 month'
);

-- Process 4: Active corporate case
INSERT INTO public.processes (
  id,
  process_key,
  lawyer_id,
  client_name,
  client_email,
  title,
  description,
  status,
  process_type,
  court,
  case_number,
  filing_date,
  created_at,
  updated_at
) VALUES (
  uuid_generate_v4(),
  'CORP-2024-007',
  '05bbcff3-bbc5-4c2b-b988-f79cb65933e7',
  'TechStart Inc.',
  'legal@techstart.example',
  'TechStart Inc. - Patent Infringement',
  'Representing client in patent infringement claim against competitor. Patent relates to mobile app technology.',
  'active',
  'federal_civil',
  'Federal District Court',
  'FDC-2024-56789',
  '2024-01-10',
  NOW() - INTERVAL '2 weeks',
  NOW() - INTERVAL '2 weeks'
);

-- Process 5: Pre-filing consultation
INSERT INTO public.processes (
  id,
  process_key,
  lawyer_id,
  client_name,
  client_email,
  title,
  description,
  status,
  process_type,
  created_at,
  updated_at
) VALUES (
  uuid_generate_v4(),
  'CONSULT-2024-015',
  '05bbcff3-bbc5-4c2b-b988-f79cb65933e7',
  'Sarah Johnson',
  'sarah.j@example.com',
  'Workplace Discrimination Consultation',
  'Initial consultation regarding potential workplace discrimination claim. Gathering evidence and evaluating case strength.',
  'pre-filing',
  'trabalhista',
  NOW() - INTERVAL '3 days',
  NOW() - INTERVAL '3 days'
); 