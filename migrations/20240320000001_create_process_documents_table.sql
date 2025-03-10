-- Create the process_documents table
CREATE TABLE process_documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    process_id UUID NOT NULL REFERENCES processes(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_type VARCHAR(50),
    file_size BIGINT,
    uploaded_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Add indexes
CREATE INDEX idx_process_documents_process_id ON process_documents(process_id);
CREATE INDEX idx_process_documents_uploaded_by ON process_documents(uploaded_by);

-- Add RLS policies
ALTER TABLE process_documents ENABLE ROW LEVEL SECURITY;

-- Policy for viewing documents (lawyers can view their process documents)
CREATE POLICY "Users can view their process documents"
    ON process_documents
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM processes
            WHERE processes.id = process_documents.process_id
            AND processes.lawyer_id = auth.uid()
        )
    );

-- Policy for inserting documents
CREATE POLICY "Users can insert documents to their processes"
    ON process_documents
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM processes
            WHERE processes.id = process_documents.process_id
            AND processes.lawyer_id = auth.uid()
        )
    );

-- Policy for deleting documents
CREATE POLICY "Users can delete their process documents"
    ON process_documents
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM processes
            WHERE processes.id = process_documents.process_id
            AND processes.lawyer_id = auth.uid()
        )
    );

-- Create trigger for updating updated_at
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON process_documents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 