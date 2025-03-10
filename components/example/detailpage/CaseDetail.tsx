
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/status-badge";
import { CaseData } from "@/components/ui/card-case";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  Calendar,
  Clock,
  Copy,
  Edit,
  FileText,
  Share2,
  Shield,
  Users
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Dados simulados para demonstração
const MOCK_CASES: CaseData[] = [
  {
    id: "case-1",
    key: "PR-2023-001",
    title: "Reclamação Trabalhista - João Silva",
    status: "draft",
    createdAt: "2023-06-15",
    updatedAt: "2023-06-20",
    lawyersCount: 2,
    description: "Reclamação trabalhista referente a horas extras não pagas."
  },
  {
    id: "case-2",
    key: "PR-2023-002",
    title: "Ação de Indenização - Maria Souza",
    status: "ready",
    createdAt: "2023-07-02",
    updatedAt: "2023-07-10",
    lawyersCount: 1,
    description: "Ação de indenização por danos morais."
  },
  {
    id: "case-3",
    key: "PR-2023-003",
    title: "Processo Administrativo - Empresa ABC",
    status: "ongoing",
    processNumber: "0001234-12.2023.8.26.0100",
    createdAt: "2023-07-15",
    updatedAt: "2023-08-01",
    lawyersCount: 3,
    description: "Processo administrativo referente a alvará de funcionamento."
  },
  {
    id: "case-4",
    key: "PR-2023-004",
    title: "Recurso de Multa - Carlos Ferreira",
    status: "impediment",
    processNumber: "0002345-23.2023.8.26.0100",
    createdAt: "2023-08-05",
    updatedAt: "2023-08-15",
    lawyersCount: 1,
    description: "Recurso contra multa de trânsito."
  },
  {
    id: "case-5",
    key: "PR-2023-005",
    title: "Divórcio Consensual - Antônio e Paula",
    status: "completed",
    processNumber: "0003456-34.2023.8.26.0100",
    createdAt: "2023-05-10",
    updatedAt: "2023-09-20",
    lawyersCount: 2,
    description: "Processo de divórcio consensual."
  },
  {
    id: "case-6",
    key: "PR-2023-006",
    title: "Execução Fiscal - Empresa XYZ",
    status: "cancelled",
    processNumber: "0004567-45.2023.8.26.0100",
    createdAt: "2023-04-22",
    updatedAt: "2023-06-30",
    lawyersCount: 2,
    description: "Execução fiscal de IPTU não pago."
  }
];

const accessCodes = {
  "PR-2023-001": "123456",
  "PR-2023-002": "234567",
  "PR-2023-003": "345678",
  "PR-2023-004": "456789",
  "PR-2023-005": "567890",
  "PR-2023-006": "678901",
};

// Mock de histórico de alterações
const MOCK_HISTORY = [
  {
    id: "hist-1",
    date: "2023-08-15T14:30:00",
    action: "Status atualizado",
    details: "Status alterado de Rascunho para Em andamento",
    user: "Dra. Ana Costa"
  },
  {
    id: "hist-2",
    date: "2023-08-10T10:15:00",
    action: "Documento adicionado",
    details: "Petição inicial anexada",
    user: "Dr. Pedro Santos"
  },
  {
    id: "hist-3",
    date: "2023-08-05T09:45:00",
    action: "Processo criado",
    details: "Caso registrado no sistema",
    user: "Dra. Ana Costa"
  }
];

const CaseDetail = () => {
  const { caseId, caseKey } = useParams();
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState<CaseData | null>(null);
  const [isClientView, setIsClientView] = useState(false);
  const [accessCode, setAccessCode] = useState("");
  const [showAccessForm, setShowAccessForm] = useState(false);
  
  // Simula verificação de autenticação
  const isAuthenticated = true; // Na implementação real, verificar se o usuário está autenticado

  useEffect(() => {
    // Se estamos na rota /processo/:caseKey, é visualização de cliente
    if (caseKey) {
      setIsClientView(true);
      setShowAccessForm(true);
      
      // Tenta encontrar o caso pelo caseKey
      const foundCase = MOCK_CASES.find(c => c.key === caseKey);
      if (foundCase) {
        setCaseData(foundCase);
      } else {
        navigate("/not-found");
      }
    } else if (caseId) {
      // Se estamos na rota /cases/:caseId, é visualização de advogado
      setIsClientView(false);
      
      // Tenta encontrar o caso pelo caseId
      const foundCase = MOCK_CASES.find(c => c.id === caseId);
      if (foundCase) {
        setCaseData(foundCase);
      } else {
        navigate("/not-found");
      }
    }
  }, [caseId, caseKey, navigate]);

  const verifyAccessCode = () => {
    if (!caseData) return;
    
    const correctCode = accessCodes[caseData.key as keyof typeof accessCodes];
    if (accessCode === correctCode) {
      setShowAccessForm(false);
      toast({
        title: "Acesso autorizado",
        description: "Você agora pode visualizar os detalhes do processo.",
      });
    } else {
      toast({
        title: "Código incorreto",
        description: "O código de acesso informado é inválido.",
        variant: "destructive"
      });
    }
  };

  const copyShareLink = () => {
    if (!caseData) return;
    
    const shareUrl = `${window.location.origin}/processo/${caseData.key}`;
    navigator.clipboard.writeText(shareUrl);
    
    toast({
      title: "Link copiado!",
      description: "O link de acesso foi copiado para a área de transferência.",
    });
  };

  if (!caseData) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 container py-8 mt-16 flex items-center justify-center">
          <p>Carregando detalhes do processo...</p>
        </main>
        <Footer />
      </div>
    );
  }

  // Visualização para cliente (com senha de acesso)
  if (isClientView && showAccessForm) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 container py-12 mt-16 flex flex-col items-center justify-center max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Acesso ao Processo</h1>
            <p className="text-muted-foreground">
              Digite a chave de acesso fornecida pelo seu advogado
            </p>
          </div>
          
          <Card className="w-full">
            <CardContent className="pt-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">{caseData.title}</h2>
                <p className="text-sm text-muted-foreground">
                  Identificador: {caseData.key}
                </p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="accessCode" className="block text-sm font-medium mb-1">
                    Chave de acesso
                  </label>
                  <Input
                    id="accessCode"
                    type="password"
                    placeholder="Digite a chave de acesso"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
                  />
                </div>
                
                <Button 
                  onClick={verifyAccessCode}
                  className="w-full"
                >
                  Acessar Processo
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  // Conteúdo principal para visualização de advogado ou cliente com acesso verificado
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 container py-8 mt-16">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold">{caseData.title}</h1>
                <StatusBadge status={caseData.status} className="ml-2" />
              </div>
              <div className="flex items-center gap-4 mt-2 text-muted-foreground">
                <span className="flex items-center gap-1">
                  <FileText size={16} />
                  {caseData.key}
                </span>
                {caseData.processNumber && (
                  <span className="flex items-center gap-1">
                    <FileText size={16} />
                    {caseData.processNumber}
                  </span>
                )}
              </div>
            </div>
            
            {!isClientView && (
              <div className="flex gap-3 mt-4 md:mt-0">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Share2 className="mr-2" size={16} />
                      Compartilhar
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Compartilhar processo</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                      <p className="text-sm text-muted-foreground mb-4">
                        Compartilhe este link com seu cliente para que ele possa acompanhar o andamento do processo.
                      </p>
                      <div className="flex gap-2">
                        <Input 
                          readOnly 
                          value={`${window.location.origin}/processo/${caseData.key}`}
                        />
                        <Button variant="outline" onClick={copyShareLink}>
                          <Copy size={16} />
                        </Button>
                      </div>
                      <div className="mt-4">
                        <p className="text-sm font-medium mb-1">Chave de acesso:</p>
                        <p className="text-lg font-mono bg-muted p-2 rounded text-center">
                          {accessCodes[caseData.key as keyof typeof accessCodes]}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Forneça esta chave ao cliente para acesso ao processo.
                        </p>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={copyShareLink}>
                        Copiar link
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                
                <Link to={`/cases/${caseData.id}/edit`}>
                  <Button>
                    <Edit className="mr-2" size={16} />
                    Editar
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Informações principais */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Detalhes do processo</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Descrição</h3>
                    <p>{caseData.description || "Sem descrição disponível."}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Status atual</h3>
                      <StatusBadge status={caseData.status} />
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Número do processo</h3>
                      <p>{caseData.processNumber || "Ainda não protocolado"}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Data de criação</h3>
                      <p className="flex items-center gap-2">
                        <Calendar size={16} />
                        {new Date(caseData.createdAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Última atualização</h3>
                      <p className="flex items-center gap-2">
                        <Clock size={16} />
                        {new Date(caseData.updatedAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {!isClientView && (
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-4">Documentos</h2>
                  <div className="p-8 border border-dashed rounded-md flex flex-col items-center justify-center">
                    <p className="text-muted-foreground mb-2">Nenhum documento anexado ainda</p>
                    <Button variant="outline">
                      Adicionar documentos
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {!isClientView && (
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-4">Histórico de alterações</h2>
                  
                  <div className="space-y-4">
                    {MOCK_HISTORY.map((item) => (
                      <div key={item.id} className="border-b pb-4 last:border-0">
                        <div className="flex justify-between mb-1">
                          <span className="font-medium">{item.action}</span>
                          <span className="text-sm text-muted-foreground">
                            {new Date(item.date).toLocaleDateString('pt-BR')} às {new Date(item.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-sm">{item.details}</p>
                        <p className="text-sm text-muted-foreground mt-1">Por: {item.user}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Advogados</h2>
                  {!isClientView && (
                    <Button variant="outline" size="sm">
                      <Users size={16} className="mr-1" />
                      Gerenciar
                    </Button>
                  )}
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users size={20} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Dra. Ana Costa</p>
                      <p className="text-sm text-muted-foreground">Principal</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users size={20} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Dr. Pedro Santos</p>
                      <p className="text-sm text-muted-foreground">Auxiliar</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Segurança</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                      <Shield size={20} className="text-accent" />
                    </div>
                    <div>
                      <p className="font-medium">Chave de acesso do cliente</p>
                      <p className="text-sm text-muted-foreground">
                        {isClientView ? "Verificada" : accessCodes[caseData.key as keyof typeof accessCodes]}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CaseDetail;
