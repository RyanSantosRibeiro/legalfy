'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Share2, Copy, Mail, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface ShareProcessDialogProps {
  isOpen: boolean;
  onClose: () => void;
  processKey: string;
  processTitle: string;
  clientEmail?: string;
}

export default function ShareProcessDialog({
  isOpen,
  onClose,
  processKey,
  processTitle,
  clientEmail
}: ShareProcessDialogProps) {
  const [isCopying, setIsCopying] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [email, setEmail] = useState(clientEmail || '');
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    setShareUrl(`${window.location.origin}/processo/${processKey}`);
  }, [processKey]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setIsCopying(true);
      toast.success('Link copiado para a área de transferência');
      setTimeout(() => setIsCopying(false), 2000);
    } catch (error) {
      toast.error('Erro ao copiar o link');
    }
  };

  const handleSendEmail = async () => {
    if (!email) {
      toast.error('Por favor, insira um endereço de email');
      return;
    }

    setIsSending(true);
    try {
      // TODO: Implement email sending functionality
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Email enviado com sucesso');
      onClose();
    } catch (error) {
      toast.error('Erro ao enviar o email');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <DialogHeader className="space-y-3">
          <DialogTitle className="flex items-center gap-2 text-xl font-semibold text-navy">
            <Share2 className="h-5 w-5" />
            Compartilhar Processo
          </DialogTitle>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Compartilhe este processo com seu cliente de forma segura.
          </p>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Link de Acesso
            </label>
            <div className="flex gap-2">
              <Input
                readOnly
                value={shareUrl}
                className="font-mono text-sm bg-gray-50 dark:bg-gray-700"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={copyToClipboard}
                disabled={isCopying}
                className="shrink-0 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {isCopying ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Enviar por Email
            </label>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="email@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-gray-50 dark:bg-gray-700"
              />
              <Button
                onClick={handleSendEmail}
                disabled={isSending}
                className="shrink-0 bg-navy hover:bg-navy-700 text-white gap-2"
              >
                <Mail className="h-4 w-4" />
                {isSending ? 'Enviando...' : 'Enviar'}
              </Button>
            </div>
          </div>

          <div className="rounded-lg bg-gray-50 dark:bg-gray-700/50 p-4 space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              O cliente receberá um email com o link de acesso e instruções para visualizar o processo.
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-1">
              <span className="text-green-500">✓</span>
              O acesso é seguro e requer autenticação.
            </p>
          </div>
        </div>

        <DialogFooter className="sm:justify-start">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 