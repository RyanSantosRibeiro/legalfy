Prompt para Loveable.io - Geração de Site para Sistema SaaS de Advogados

Objetivo do Sistema

Criar um Sistema SaaS para Advogados que permita:

Visualizar e gerenciar processos de maneira intuitiva.

Coletar e organizar informações dos casos antes e depois da protocolização.

Facilitar a comunicação e transparência entre advogados e clientes.

Gerenciar o andamento dos processos e oferecer visibilidade ao cliente sem necessidade de login.

Funcionalidades Principais

1. Tela de Cadastro/Edição do Processo

Campos principais:

Nome do caso

Descrição detalhada

Número do processo (caso exista)

Status do processo

Lista de advogados associados

Chave de acesso para clientes

Upload de arquivos (PDFs, imagens, documentos legais)

Caso não tenha um número de processo, significa que ainda não foi protocolado, mas já está registrado no sistema.

2. Tela de Processos (Listagem)

Lista de processos cadastrados pelo advogado logado.

Opção de filtragem por status: Rascunho, Pronto para protocolar, Em andamento, Impeditivo, Cancelado, Finalizado.

3. Tela de Processo Detalhado - Advogado

Exibição completa das informações do processo.

Integração com API externa para buscar informações adicionais a partir do número do processo.

Histórico de alterações e anexos.

4. Tela de Processo Detalhado - Cliente

Exibição de informações básicas e status atualizado.

Acesso via link e chave de acesso, sem necessidade de cadastro.

Permite que o cliente acompanhe o progresso sem precisar entrar em contato direto.

5. Dashboard do Advogado

Exibição de métricas relevantes:

Total de processos ativos

Processos concluídos

Processos não protocolados (em aberto e sem número de processo)

Seção com colunas organizadas por status do processo:

Rascunho

Pronto para protocolar

Em andamento

Impeditivo

Cancelado

Finalizado

6. Página Home

Descrição do sistema, explicando os principais benefícios para os advogados.

Seção destacando funcionalidades e diferenciais.

Planos de assinatura, com opções e preços.

Botão de cadastro para novos advogados.

Estilo e Design

Moderno, profissional e minimalista para transmitir confiança e seriedade.

Paleta de cores:

Azul-marinho (#1F3B73) - Transmite segurança e confiança.

Cinza-claro (#F5F5F5) - Para fundo e espaçamentos suaves.

Branco (#FFFFFF) - Para dar leveza e contraste.

Dourado (#C6A35D) - Para destaques e elementos premium.

Tipografia profissional:

Fonte principal: Merriweather (para títulos, transmitindo seriedade).

Fonte secundária: Inter (para textos e descrições, visando legibilidade).

Layout responsivo, adaptável a desktop, tablet e celular.

Design baseado em Cards, para facilitar a visualização dos processos.

Icons e gráficos minimalistas para destacar métricas importantes.

Fluxo do Usuário

O advogado se cadastra e faz login.

Cria novos processos, adiciona informações e documentos.

Adiciona outros advogados, se necessário, para compartilhamento do caso.

O cliente recebe um link com a chave de acesso para visualizar o status do seu processo.

O advogado gerencia tudo pela dashboard, acompanhando status e evolução dos casos.

As informações são atualizadas automaticamente através da API quando o número de processo é informado.

Tecnologias Recomendadas

Next.js

Banco de Dados: Supabase

Autenticação: Supabase Auth (JWT ou OAuth2)

Armazenamento de Arquivos: Supabase Storage

API de Consulta de Processos: Integração com tribunais (exemplo: JusBrasil API)

Hospedagem: Vercel

Modelo de Assinatura

O advogado precisa assinar um plano para utilizar o sistema.

O pagamento pode ser mensal ou anual.

Diferentes planos podem oferecer limites de processos cadastrados ou funcionalidades extras.

Resumo

Este sistema SaaS ajudará advogados a gerenciar processos, acompanhar status, compartilhar informações com outros advogados e oferecer visibilidade para os clientes de forma simples e organizada. A experiência será intuitiva, responsiva e visualmente profissional, garantindo um ambiente de gestão eficiente para escritórios de advocacia.