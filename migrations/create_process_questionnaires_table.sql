-- Create a table to store questionnaires for different process types
CREATE TABLE IF NOT EXISTS process_questionnaires (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  process_id UUID NOT NULL,
  process_type TEXT NOT NULL,
  questionnaire_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Add a foreign key constraint to ensure the process exists
  CONSTRAINT fk_process FOREIGN KEY (process_id) REFERENCES processes(id) ON DELETE CASCADE
);

-- Add an index to make queries by process_id faster
CREATE INDEX IF NOT EXISTS idx_questionnaires_process_id ON process_questionnaires(process_id);

-- Add an index to make queries by process_type faster
CREATE INDEX IF NOT EXISTS idx_questionnaires_process_type ON process_questionnaires(process_type);

-- Add a GIN index to make queries within the JSONB field faster
CREATE INDEX IF NOT EXISTS idx_questionnaires_json ON process_questionnaires USING GIN (questionnaire_data);

-- Add row level security (RLS) policies
ALTER TABLE process_questionnaires ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to select their own questionnaires
CREATE POLICY select_questionnaires ON process_questionnaires 
  FOR SELECT USING (
    -- Join with processes table to check ownership
    process_id IN (
      SELECT id FROM processes WHERE lawyer_id = auth.uid()
    )
  );

-- Policy to allow users to insert their own questionnaires
CREATE POLICY insert_questionnaires ON process_questionnaires 
  FOR INSERT WITH CHECK (
    -- Join with processes table to check ownership
    process_id IN (
      SELECT id FROM processes WHERE lawyer_id = auth.uid()
    )
  );

-- Policy to allow users to update their own questionnaires
CREATE POLICY update_questionnaires ON process_questionnaires 
  FOR UPDATE USING (
    -- Join with processes table to check ownership
    process_id IN (
      SELECT id FROM processes WHERE lawyer_id = auth.uid()
    )
  );

-- Policy to allow users to delete their own questionnaires
CREATE POLICY delete_questionnaires ON process_questionnaires 
  FOR DELETE USING (
    -- Join with processes table to check ownership
    process_id IN (
      SELECT id FROM processes WHERE lawyer_id = auth.uid()
    )
  );

-- Create a trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_process_questionnaires_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_process_questionnaires_timestamp
BEFORE UPDATE ON process_questionnaires
FOR EACH ROW
EXECUTE FUNCTION update_process_questionnaires_updated_at(); 