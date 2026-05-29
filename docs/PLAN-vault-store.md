# PLAN-vault-store

## 1. Overview
**Projeto:** VAULT Game Store
**Tipo:** E-commerce de jogos digitais estilo Steam/Epic Games.
**Identidade Visual:** Dark, cinético e premium. Baseado nas instruções de `prompt.md` e na paleta de `paleta.html`.
**Objetivo:** Construir a loja do zero ao deploy (Next.js 15, PostgreSQL, Prisma, NextAuth, Mercado Pago, Framer Motion). As chaves do Mercado Pago utilizadas inicialmente serão de teste (`TEST-...`).

## 2. Project Type
**WEB** (Next.js App Router, React, Tailwind CSS, TypeScript)

## 3. Success Criteria
- [ ] O projeto roda localmente sem erros (`npm run dev`).
- [ ] O banco PostgreSQL sobe via `docker-compose up -d` e as migrations do Prisma aplicam o schema fornecido.
- [ ] O design system aplica rigorosamente a paleta de cores (Void base, Flare como CTA, etc).
- [ ] O sistema de carrinho funciona anonimamente via cookies e funde os dados no login via Zustand.
- [ ] Integração com Mercado Pago gera preferências em modo de teste e aceita webhooks simulados.
- [ ] A reserva de keys no banco de dados é atômica e segura.

## 4. Tech Stack
- **Framework:** Next.js 15 (App Router, RSC)
- **Linguagem:** TypeScript (`strict: true`)
- **Estilo:** Tailwind CSS + CSS Variables (`paleta.html`)
- **Animação:** Framer Motion 11
- **Banco / ORM:** PostgreSQL 16 (Docker) + Prisma 5
- **Autenticação:** NextAuth.js v5 (Google OAuth)
- **Pagamento:** Mercado Pago SDK (Test Mode initially)
- **Estado Global:** Zustand

## 5. File Structure
A estrutura de arquivos seguirá estritamente a definida no `prompt.md`, incluindo separação de rotas públicas `(store)`, autenticadas `(auth)`, e painel `admin`.

## 6. Socratic Gate (Perguntas em Aberto)
> [!IMPORTANT]
> **Aguardando confirmação do usuário para as seguintes questões:**
> 1. Para o upload de imagens (capas/galeria dos jogos), usaremos o armazenamento local do Next.js temporariamente, ou você já possui as chaves do Vercel Blob / Cloudinary para o ambiente de testes?
> 2. Você já possui as credenciais OAuth do Google (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`) criadas no Google Cloud Console para testarmos o login?
> 3. Deseja que eu gere um script de *seed* (`prisma/seed.ts`) criando um usuário `ADMIN` padrão para testarmos o painel de administração imediatamente após a configuração do banco?

## 7. Task Breakdown

### Task 1: Setup Inicial & Infraestrutura
- **Agent:** `frontend-specialist` & `backend-specialist`
- **Skills:** `app-builder`, `clean-code`
- **Ação:** Inicializar projeto Next.js 15, configurar TypeScript, Docker Compose (PostgreSQL 16), e instalar as dependências base (Tailwind, Framer Motion, Zustand).
- **INPUT → OUTPUT → VERIFY:** `npx create-next-app` → Repositório base configurado → `npm run dev` abre a aplicação sem erros e o container Docker do banco é inicializado.

### Task 2: Configuração do Design System
- **Agent:** `frontend-specialist`
- **Skills:** `frontend-design`, `tailwind-patterns`
- **Ação:** Configurar `globals.css` com as CSS Variables baseadas no `paleta.html`. Configurar fontes (`Syne`, `DM Mono`).
- **INPUT → OUTPUT → VERIFY:** `paleta.html` + `prompt.md` → `globals.css` populado e aplicado no layout principal → Paleta confirmada renderizando corretamente.

### Task 3: Schema Prisma & Banco de Dados
- **Agent:** `database-architect`
- **Skills:** `database-design`, `api-patterns`
- **Ação:** Implementar o arquivo `schema.prisma` com os modelos fornecidos (`User`, `Game`, `Key`, `Order`, etc) e rodar a primeira migration.
- **INPUT → OUTPUT → VERIFY:** `schema.prisma` fornecido → Tabelas criadas no banco de dados local → `npx prisma studio` abre e mostra as tabelas estruturadas.

### Task 4: Autenticação Base (NextAuth v5)
- **Agent:** `security-auditor`
- **Skills:** `api-patterns`
- **Ação:** Configurar NextAuth v5 com o Prisma Adapter e Google Provider.
- **INPUT → OUTPUT → VERIFY:** Variáveis de ambiente configuradas → Rota de API configurada → Botão "Login com Google" funcional (testado local).

### Task 5: Componentes UI Core & Framer Motion
- **Agent:** `frontend-specialist`
- **Skills:** `frontend-design`
- **Ação:** Criar os componentes fundamentais (Botões, Cards, Badges, Modais, Inputs) utilizando a identidade visual (efeito Flare, cantos arredondados corretos) e animações base de hover/tap.
- **INPUT → OUTPUT → VERIFY:** Classes do Tailwind + Framer Motion → UI Core Library → Renderização visual perfeita dos botões.

### Task 6: Implementação do Carrinho (Zustand + Cookies)
- **Agent:** `frontend-specialist`
- **Skills:** `clean-code`
- **Ação:** Desenvolver a loja Zustand para gerenciamento de carrinho, e a lógica de merge de cookies (carrinho anônimo) no momento de autenticação.
- **INPUT → OUTPUT → VERIFY:** Zustand hook → Carrinho guardando e lendo do cookie → O recarregamento da página não perde os itens do carrinho; o login transfere os itens.

### Task 7: Mercado Pago Checkout & Transações de Keys
- **Agent:** `backend-specialist`
- **Skills:** `api-patterns`
- **Ação:** Implementar `lib/keys.ts` (`reserveKeys` com transactions), `api/checkout/route.ts` (geração da Preference com TEST keys) e a UI do Payment Brick.
- **INPUT → OUTPUT → VERIFY:** Chaves MP TEST → Pedido criado no banco com as keys `RESERVED` → Webhook processa com sucesso ou Payment Brick renderiza o checkout na tela.

### Task 8: Páginas de Loja e Admin Dashboard
- **Agent:** `frontend-specialist`
- **Skills:** `frontend-design`
- **Ação:** Criar a Home (`/`), detalhe do jogo (`/game/[slug]`), e as rotas administrativas CRUD (`/admin/*`) protegidas por Middleware verificando a role `ADMIN`.
- **INPUT → OUTPUT → VERIFY:** Telas construídas → Navegação fluída e animada → Middleware bloqueia usuários não administradores.

## 8. Phase X: Final Verification
- [ ] **Lint & Build:** Executar `npm run build` e `npm run lint`.
- [ ] **Design Rules:** Validar uso de `var(--flare)`, fundos sempre `var(--void)`, e ausência de branco de fundo.
- [ ] **Fluxo E2E:** Navegar anônimo -> Add to Cart -> Login -> Compra Sandbox (MP) -> Webhook Confirma -> Key recebida.
- [ ] **Admin Protect:** Rota `/admin` bloqueada para anônimos.
- [ ] **Segurança:** Rodar scripts do Ag Kit (ex: `ux_audit.py`, `security_scan.py` se disponíveis/aplicáveis para Next.js na base de scripts).
