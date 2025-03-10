-- Insert test processes for user ID: 05bbcff3-bbc5-4c2b-b988-f79cb65933e7

-- Process 1: Active civil case
INSERT INTO processes (
  process_key,
  lawyer_id,
  client_name,
  client_email,
  title,
  description,
  status,
  court,
  case_number,
  filing_date,
  created_at,
  updated_at
) VALUES (
  'CIVIL-2023-001',
  '05bbcff3-bbc5-4c2b-b988-f79cb65933e7',
  'John Smith',
  'john.smith@example.com',
  'Smith vs. Johnson - Property Dispute',
  'Property boundary dispute between neighbors. Client claims neighbor built fence 2 feet into their property.',
  'active',
  'County Civil Court',
  'CC-2023-45678',
  '2023-10-15',
  NOW(),
  NOW()
);

-- Process 2: Pending family case
INSERT INTO processes (
  process_key,
  lawyer_id,
  client_name,
  client_email,
  title,
  description,
  status,
  court,
  case_number,
  filing_date,
  created_at,
  updated_at
) VALUES (
  'FAM-2023-042',
  '05bbcff3-bbc5-4c2b-b988-f79cb65933e7',
  'Maria Rodriguez',
  'maria.r@example.com',
  'Rodriguez Divorce Proceedings',
  'Divorce case with custody arrangements for 2 children and division of assets including family home and retirement accounts.',
  'pending',
  'Family Court Division',
  'FC-2023-78945',
  '2023-11-20',
  NOW(),
  NOW()
);

-- Process 3: Closed criminal case
INSERT INTO processes (
  process_key,
  lawyer_id,
  client_name,
  client_email,
  title,
  description,
  status,
  court,
  case_number,
  filing_date,
  created_at,
  updated_at
) VALUES (
  'CRIM-2023-103',
  '05bbcff3-bbc5-4c2b-b988-f79cb65933e7',
  'David Williams',
  'david.w@example.com',
  'State vs. Williams - Misdemeanor',
  'Client charged with misdemeanor trespassing. Case resolved with community service agreement.',
  'closed',
  'Municipal Criminal Court',
  'CR-2023-12345',
  '2023-08-05',
  NOW() - INTERVAL '3 months',
  NOW() - INTERVAL '1 month'
);

-- Process 4: Active corporate case
INSERT INTO processes (
  process_key,
  lawyer_id,
  client_name,
  client_email,
  title,
  description,
  status,
  court,
  case_number,
  filing_date,
  created_at,
  updated_at
) VALUES (
  'CORP-2024-007',
  '05bbcff3-bbc5-4c2b-b988-f79cb65933e7',
  'TechStart Inc.',
  'legal@techstart.example',
  'TechStart Inc. - Patent Infringement',
  'Representing client in patent infringement claim against competitor. Patent relates to mobile app technology.',
  'active',
  'Federal District Court',
  'FDC-2024-56789',
  '2024-01-10',
  NOW() - INTERVAL '2 weeks',
  NOW() - INTERVAL '2 weeks'
);

-- Process 5: Pre-filing consultation
INSERT INTO processes (
  process_key,
  lawyer_id,
  client_name,
  client_email,
  title,
  description,
  status,
  created_at,
  updated_at
) VALUES (
  'CONSULT-2024-015',
  '05bbcff3-bbc5-4c2b-b988-f79cb65933e7',
  'Sarah Johnson',
  'sarah.j@example.com',
  'Workplace Discrimination Consultation',
  'Initial consultation regarding potential workplace discrimination claim. Gathering evidence and evaluating case strength.',
  'pre-filing',
  NOW() - INTERVAL '3 days',
  NOW() - INTERVAL '3 days'
); 