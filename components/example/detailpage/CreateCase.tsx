
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { 
  Card, 
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Upload } from "lucide-react";

const generateCaseKey = () => {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `PR-${year}-${random}`;
};

const CreateCase = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    processNumber: "",
    status: "draft" as "draft" | "ready" | "ongoing" | "impediment" | "cancelled" | "completed",
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleStatusChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      status: value as typeof formData.status
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulando o envio de dados para o servidor
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Processo criado com sucesso!",
        description: "O novo processo foi registrado no sistema."
      });
      navigate("/cases");
    }, 1500);
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 container py-8 mt-16">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)} 
            className="mb-4"
          >
            <ArrowLeft className="mr-2" size={16} />
            Voltar
          </Button>
          
          <h1 className="text-3xl font-bold mb-2">Novo Processo</h1>
          <p className="text-muted-foreground">
            Cadastre um novo processo no sistema
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Informações principais */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informações Básicas</CardTitle>
                  <CardDescription>
                    Preencha as informações principais do processo
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Nome do caso</Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="Ex: Reclamação Trabalhista - João Silva"
                      value={formData.title}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição detalhada</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Descreva os detalhes relevantes do processo"
                      value={formData.description}
                      onChange={handleChange}
                      rows={5}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="processNumber">Número do processo (se existir)</Label>
                      <Input
                        id="processNumber"
                        name="processNumber"
                        placeholder="Ex: 0001234-12.2023.8.26.0100"
                        value={formData.processNumber}
                        onChange={handleChange}
                      />
                      <p className="text-xs text-muted-foreground">
                        Deixe em branco caso ainda não tenha sido protocolado
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="status">Status do processo</Label>
                      <Select
                        value={formData.status}
                        onValueChange={handleStatusChange}
                      >
                        <SelectTrigger id="status">
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Rascunho</SelectItem>
                          <SelectItem value="ready">Pronto para protocolar</SelectItem>
                          <SelectItem value="ongoing">Em andamento</SelectItem>
                          <SelectItem value="impediment">Impeditivo</SelectItem>
                          <SelectItem value="cancelled">Cancelado</SelectItem>
                          <SelectItem value="completed">Finalizado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Documentos</CardTitle>
                  <CardDescription>
                    Anexe os documentos relacionados ao processo
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-10 border border-dashed rounded-md flex flex-col items-center justify-center">
                    <Upload className="h-10 w-10 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-1">Arraste arquivos ou clique para anexar</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Suporta PDFs, imagens e documentos (até 10MB cada)
                    </p>
                    <Button variant="outline" type="button">
                      Selecionar arquivos
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Identificador</CardTitle>
                  <CardDescription>
                    Este será o código único do processo
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted p-4 rounded-md">
                    <p className="text-center font-mono text-lg">{generateCaseKey()}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Este identificador será gerado automaticamente ao salvar
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Advogados</CardTitle>
                  <CardDescription>
                    Quem terá acesso a este processo
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-xs font-medium text-primary">AC</span>
                        </div>
                        <span>Você (Principal)</span>
                      </div>
                    </div>
                    
                    <Button variant="outline" className="w-full" type="button">
                      Adicionar advogado
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Segurança</CardTitle>
                  <CardDescription>
                    Configurações de acesso do cliente
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="accessCode">Chave de acesso para cliente</Label>
                      <Input
                        id="accessCode"
                        placeholder="Ex: 123456"
                        defaultValue="123456"
                      />
                      <p className="text-xs text-muted-foreground">
                        Compartilhe esta chave com o cliente para que ele possa acompanhar o processo
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardFooter className="pt-6 flex flex-col space-y-2">
                  <Button className="w-full" type="submit" disabled={isLoading}>
                    <Save className="mr-2" size={16} />
                    {isLoading ? "Salvando..." : "Salvar Processo"}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    type="button"
                    onClick={() => navigate(-1)}
                  >
                    Cancelar
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </form>
      </main>
      
      <Footer />
    </div>
  );
};

export default CreateCase;
