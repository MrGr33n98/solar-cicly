# SolarCycle - Marketplace de Painéis Solares

Uma plataforma moderna que conecta proprietários de painéis solares usados com empresas recicladoras especializadas, promovendo a economia circular no setor de energia solar.

## 🌟 Funcionalidades

### Para Proprietários (Owners)
- Cadastro simples e rápido
- Upload de painéis solares com fotos e especificações
- Avaliação técnica pela equipe SolarCycle
- Recebimento de ofertas de empresas recicladoras
- Gestão de vendas e transações

### Para Empresas Recicladoras (Recyclers)
- Cadastro com validação de CNPJ
- Acesso ao marketplace após aprovação
- Busca avançada de painéis disponíveis
- Sistema de ofertas competitivas
- Gestão de compras e logística

### Para Administradores
- Painel de controle completo
- Aprovação de empresas recicladoras
- Avaliação e precificação de painéis
- Monitoramento de transações

## 🚀 Tecnologias

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Inter Font
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Roteamento**: React Router DOM
- **Formulários**: React Hook Form + Zod
- **Ícones**: Lucide React

## 🎨 Design

Inspirado no design minimalista e profissional do G2.com, com:
- Paleta de cores verde/azul para sustentabilidade
- Tipografia Inter para legibilidade
- Componentes modulares e reutilizáveis
- Animações sutis e micro-interações
- Design responsivo para todos os dispositivos

## 📊 Modelos de Dados

### Usuários (Users)
- Proprietários: cadastro simples, podem vender painéis
- Recicladoras: cadastro com validação, podem comprar painéis
- Administradores: gestão completa da plataforma

### Painéis Solares (Solar Panels)
- Informações técnicas completas
- Sistema de status (pendente → à venda → vendido → reciclado)
- Avaliação e precificação pela equipe

### Transações (Transactions)
- Ofertas de compra
- Negociação entre partes
- Coordenação de logística
- Processamento de pagamentos

## 🔐 Segurança

- Autenticação via Supabase Auth
- Row Level Security (RLS) em todas as tabelas
- Validação de dados no frontend e backend
- Verificação de empresas recicladoras

## 🚀 Como Executar

1. Clone o repositório
2. Configure as variáveis de ambiente (copie `.env.example` para `.env`)
3. Configure seu projeto Supabase
4. Execute as migrações do banco de dados
5. Instale as dependências: `npm install`
6. Execute o projeto: `npm run dev`

## 📝 Próximos Passos

- [ ] Sistema de pagamentos (Stripe/Mercado Pago)
- [ ] Upload de imagens para Supabase Storage
- [ ] Sistema de notificações por email
- [ ] Chat entre usuários
- [ ] Relatórios e analytics
- [ ] App mobile (React Native)

## 🌱 Sustentabilidade

A SolarCycle promove a economia circular no setor de energia solar, garantindo que painéis solares usados sejam adequadamente reciclados, reduzindo o impacto ambiental e criando valor econômico para todos os envolvidos.