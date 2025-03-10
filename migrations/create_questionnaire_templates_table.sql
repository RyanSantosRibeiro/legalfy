-- Create a table to store questionnaire templates
CREATE TABLE IF NOT EXISTS questionnaire_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  process_type TEXT NOT NULL,
  fields JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add an index for faster queries by process_type
CREATE INDEX IF NOT EXISTS idx_questionnaire_templates_process_type ON questionnaire_templates(process_type);

-- Add row level security (RLS) policies
ALTER TABLE questionnaire_templates ENABLE ROW LEVEL SECURITY;

-- Policy to allow any authenticated user to select templates
CREATE POLICY select_questionnaire_templates ON questionnaire_templates
  FOR SELECT USING (auth.role() = 'authenticated');

-- Only allow lawyers with specific permissions to insert, update, or delete templates
CREATE POLICY manage_questionnaire_templates ON questionnaire_templates
  FOR ALL USING (auth.uid() IN (
    SELECT user_id FROM lawyer_permissions WHERE can_manage_templates = TRUE
  ));

-- Create a trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_questionnaire_templates_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_questionnaire_templates_timestamp
BEFORE UPDATE ON questionnaire_templates
FOR EACH ROW
EXECUTE FUNCTION update_questionnaire_templates_updated_at(); 