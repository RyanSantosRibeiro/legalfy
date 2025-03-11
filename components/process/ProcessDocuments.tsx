'use client';

import { useState, useEffect } from 'react';
import { FileText, Upload, Trash2, Eye, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'sonner';
import { Database } from '@/types/supabase';

type ProcessDocument = Database['public']['Tables']['process_documents']['Row'];
type ProcessDocumentInsert = Database['public']['Tables']['process_documents']['Insert'];

interface ProcessDocumentsProps {
  processId: string;
  processKey: string;
}

export default function ProcessDocuments({ processId, processKey }: ProcessDocumentsProps) {
  const [documents, setDocuments] = useState<ProcessDocument[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    fetchDocuments();
  }, [processId]);

  const fetchDocuments = async () => {
    const { data, error } = await supabase
      .from('process_documents')
      .select('*')
      .eq('process_id', processId)
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Não foi possível carregar os documentos');
      return;
    }

    setDocuments(data || []);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tamanho do arquivo (máximo 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB em bytes
    if (file.size > maxSize) {
      toast.error('O arquivo é muito grande. Tamanho máximo permitido: 10MB');
      return;
    }

    // Validar tipo do arquivo
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Tipo de arquivo não permitido. Formatos aceitos: PDF, JPEG, PNG, DOC, DOCX');
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${processKey}/${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('process-documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const newDocument: ProcessDocumentInsert = {
        process_id: processId,
        name: file.name,
        file_path: fileName,
        file_type: file.type,
        file_size: file.size,
        uploaded_by: user.id
      };

      const { error: dbError } = await supabase
        .from('process_documents')
        .insert(newDocument);

      if (dbError) throw dbError;

      toast.success('Documento anexado com sucesso');
      fetchDocuments();
    } catch (error) {
      toast.error('Erro ao anexar documento. Tente novamente');
      console.error('Erro no upload:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (documentId: string, filePath: string) => {
    if (!confirm('Tem certeza que deseja excluir este documento?')) {
      return;
    }

    try {
      const { error: storageError } = await supabase.storage
        .from('process-documents')
        .remove([filePath]);

      if (storageError) throw storageError;

      const { error: dbError } = await supabase
        .from('process_documents')
        .delete()
        .eq('id', documentId);

      if (dbError) throw dbError;

      toast.success('Documento excluído com sucesso');
      setDocuments(documents.filter(doc => doc.id !== documentId));
    } catch (error) {
      toast.error('Erro ao excluir documento. Tente novamente');
      console.error('Erro na exclusão:', error);
    }
  };

  const handleView = async (document: ProcessDocument) => {
    try {
      const { data, error } = await supabase.storage
        .from('process-documents')
        .createSignedUrl(document.file_path, 60);

      if (error) throw error;

      window.open(data.signedUrl, '_blank');
    } catch (error) {
      toast.error('Erro ao abrir documento. Tente novamente');
      console.error('Erro ao visualizar:', error);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2 text-navy">
          <FileText className="h-5 w-5" />
          Documentos do Processo
        </h2>
        <div className="relative">
          <input
            type="file"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
            disabled={isUploading}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          />
          <label
            htmlFor="file-upload"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <Upload className="h-4 w-4 mr-2" />
            {isUploading ? 'Anexando...' : 'Anexar Documento'}
          </label>
        </div>
      </div>

      <div className="space-y-4">
        {documents.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">
              Nenhum documento anexado a este processo.
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Clique em "Anexar Documento" para adicionar
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {documents.map((document) => (
              <div
                key={document.id}
                className="py-4 flex items-center justify-between hover:bg-gray-50 transition-colors rounded-lg px-3"
              >
                <div className="flex items-center space-x-4">
                  <FileText className="h-8 w-8 text-navy" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      {document.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Anexado em {formatDate(document.created_at)}
                      {' • '}
                      {formatFileSize(document.file_size)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleView(document)}
                    className="text-navy hover:text-navy-700 hover:bg-navy-50"
                    title="Visualizar documento"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(document.id, document.file_path)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    title="Excluir documento"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 