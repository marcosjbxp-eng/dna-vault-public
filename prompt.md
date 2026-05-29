# VAULT Game Store — Mega-Prompt de Implementação

> Copie e cole este prompt em qualquer IA de código (Claude, Cursor, GPT-4o, Gemini).
> Ele foi estruturado para eliminar ambiguidades e forçar decisões de alta qualidade em cada camada.

---

## CONTEXTO E PAPEL

Você é um engenheiro fullstack sênior e designer de produto especializado em e-commerce de jogos digitais. Sua missão é construir **VAULT**, uma loja de jogos estilo Steam/Epic Games, do zero até o deploy em produção na Vercel. O produto é **dark, cinético e premium** — cada detalhe visual e técnico deve refletir isso. Não entregue código genérico; entregue o melhor código possível para esse contexto específico.

---

## STACK OBRIGATÓRIA (sem negociação)

| Camada | Tecnologia | Justificativa |
|---|---|---|
| Framework | Next.js 15 (App Router, RSC) | SSR/SSG nativo, otimização de imagem, middleware |
| Linguagem | TypeScript estrito (`strict: true`) | Segurança de tipos em toda a base |
| Estilo | Tailwind CSS + CSS Variables customizadas | Tokens de design + utilitários |
| ORM | Prisma 5 | Type-safe, migrações versionadas |
| Banco | PostgreSQL 16 (Docker local, Neon/Supabase em prod) | Transações ACID para entrega de keys |
| Auth | NextAuth.js v5 (Auth.js) | Sessão DB-backed, Google OAuth |
| Pagamento | Mercado Pago SDK + Payment Brick | PIX + cartão + boleto nativos no BR |
| Animação | Framer Motion 11 | Page transitions, spring physics, scroll-linked |
| Estado global | Zustand | Carrinho, UI state |
| Formulários | React Hook Form + Zod | Validação type-safe client + server |
| Emails | Resend + React Email | Templates React renderizados server-side |
| Upload | Vercel Blob ou Cloudinary | CDN automático para assets de jogos |
| Deploy | Vercel (prod) + Docker Compose (local) | Preview deploys automáticos |
| CI/CD | GitHub Actions | Lint, typecheck, build em cada PR |

---

## DESIGN SYSTEM — VAULT

### Paleta de cores (implemente via CSS Variables no `globals.css`)

```css
:root {
  /* Backgrounds */
  --void:      #0A0C10;   /* bg principal — quase preto azulado */
  --surface:   #111520;   /* cards, painéis primários */
  --panel:     #1C2133;   /* elevação secundária */
  --border:    #2A3148;   /* linhas, divisores */

  /* Accent */
  --flare:     #E8FF47;   /* amarelo-lima elétrico — CTA principal, preços */
  --flare-dim: #B8CC38;   /* hover do flare */
  --ice:       #A8C4FF;   /* azul gelo — links, badges, destaques 2 */
  --ice-dim:   #6E94E8;   /* hover/variante do ice */

  /* Texto */
  --smoke:     #8A93A8;   /* texto secundário, placeholders */
  --mist:      #C8D0E0;   /* texto primário */
  --white:     #F0F4FF;   /* títulos, máximo contraste */

  /* Semânticas */
  --danger:    #FF5050;   /* erros, alertas críticos */
  --success:   #3DFFA0;   /* confirmações, conquistas, keys entregues */
}
```

### Tipografia

- **Display/UI**: `Syne` (Google Fonts) — pesos 400, 600, 700, 800
- **Monospace/Código**: `DM Mono` — pesos 300, 400, 500
- Import no `layout.tsx` via `next/font/google`
- Hierarquia: `--white` para títulos, `--mist` para corpo, `--smoke` para secundário, `--ice` para links

### Regras visuais inegociáveis

1. Fundo nunca é branco. `--void` é o default absoluto.
2. Todo CTA primário usa `background: var(--flare); color: #0A0C10` — texto preto no amarelo.
3. Cards têm `background: var(--surface); border: 1px solid var(--border); border-radius: 12px`.
4. Preços e números importantes usam `color: var(--flare); font-family: 'DM Mono'`.
5. Hover em cards: `border-color: var(--ice-dim); box-shadow: 0 0 0 1px var(--ice-dim)`.
6. Estados de sucesso (key entregue, pagamento confirmado): `color: var(--success)`.
7. Toda animação de entrada usa `initial: { opacity: 0, y: 20 }` com spring suave.
8. Nenhum elemento usa `border-radius > 16px` exceto modais (24px) e avatares (full).

---

## ESTRUTURA DE PASTAS (gere exatamente assim)

```
vault/
├── app/
│   ├── (store)/              # Grupo público (layout com nav + footer)
│   │   ├── page.tsx          # Home: hero, destaques, grid de jogos
│   │   ├── store/page.tsx    # Catálogo completo com filtros
│   │   ├── game/[slug]/      # Página do jogo (ISR, revalidate: 3600)
│   │   ├── cart/page.tsx     # Carrinho (funciona sem login)
│   │   ├── checkout/page.tsx # Checkout (exige login — redirect se anônimo)
│   │   └── library/page.tsx  # Biblioteca do usuário (keys compradas)
│   ├── (auth)/
│   │   ├── login/page.tsx    # Página de login/registro
│   │   └── callback/         # Handlers OAuth
│   ├── admin/                # Painel admin (ROLE: ADMIN)
│   │   ├── layout.tsx        # Sidebar admin, verifica role
│   │   ├── page.tsx          # Dashboard: stats, vendas recentes
│   │   ├── games/            # CRUD de jogos
│   │   │   ├── page.tsx      # Lista com busca e filtros
│   │   │   ├── new/page.tsx  # Formulário de novo jogo
│   │   │   └── [id]/edit/    # Edição com preview live
│   │   ├── keys/             # Gerenciamento de estoque de keys
│   │   │   ├── page.tsx      # Lista de keys por jogo
│   │   │   └── [gameId]/     # Upload em lote, status por key
│   │   └── orders/page.tsx   # Pedidos, status, reenvio de key
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── games/route.ts        # GET (público), POST (admin)
│   │   ├── games/[id]/route.ts   # GET, PATCH, DELETE
│   │   ├── cart/route.ts         # GET, POST, DELETE (cookie-based)
│   │   ├── checkout/route.ts     # Cria preferência no Mercado Pago
│   │   ├── webhooks/mercadopago/ # Confirma pagamento, entrega key
│   │   └── admin/
│   │       ├── keys/route.ts     # Upload em lote de keys
│   │       └── stats/route.ts    # Métricas do dashboard
│   ├── layout.tsx            # Root layout, fontes, providers
│   └── globals.css           # CSS Variables + resets
├── components/
│   ├── ui/                   # Primitivos: Button, Input, Badge, Modal, Skeleton
│   ├── store/                # GameCard, GameGrid, HeroSection, FilterBar, SearchBox
│   ├── cart/                 # CartDrawer, CartItem, CartSummary
│   ├── checkout/             # PaymentBrick, OrderSummary, StatusPoll
│   ├── admin/                # StatsCard, KeyUploader, GameForm, OrderTable
│   └── layout/               # Navbar, Footer, AdminSidebar
├── lib/
│   ├── prisma.ts             # Singleton do Prisma Client
│   ├── auth.ts               # Config do NextAuth (providers, callbacks)
│   ├── mercadopago.ts        # Instância e helpers do SDK MP
│   ├── cart.ts               # Lógica de carrinho (cookie + DB merge)
│   ├── keys.ts               # Reserva atômica de keys (transaction)
│   └── validations/          # Schemas Zod para cada entidade
├── store/
│   ├── cart.store.ts         # Zustand: itens, total, open/close drawer
│   └── ui.store.ts           # Zustand: toasts, modais globais
├── types/
│   └── index.ts              # Types globais (Game, Order, Key, User...)
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── emails/
│   ├── KeyDelivery.tsx       # Template React Email para entrega de key
│   └── OrderConfirmation.tsx
├── docker-compose.yml
├── .env.example              # Todas as vars necessárias com comentários
├── middleware.ts             # Proteção de rotas /admin e /checkout
└── next.config.ts
```

---

## SCHEMA DO BANCO DE DADOS (Prisma)

Implemente exatamente este schema, sem omissões:

```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  role          Role      @default(USER)
  createdAt     DateTime  @default(now())

  accounts  Account[]
  sessions  Session[]
  orders    Order[]
}

enum Role { USER ADMIN }

model Game {
  id          String   @id @default(cuid())
  slug        String   @unique
  title       String
  description String   @db.Text
  coverUrl    String
  images      String[] // array de URLs para gallery
  trailerUrl  String?
  price       Decimal  @db.Decimal(10,2)
  genres      String[]
  platforms   String[]
  developer   String
  publisher   String?
  releaseDate DateTime
  featured    Boolean  @default(false)
  active      Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  keys        Key[]
  orderItems  OrderItem[]

  @@fulltext([title, description]) // habilitar no PostgreSQL via índice
}

model Key {
  id        String    @id @default(cuid())
  code      String    @unique // a key em si — nunca exposta sem pagamento
  gameId    String
  game      Game      @relation(fields: [gameId], references: [id])
  status    KeyStatus @default(AVAILABLE)
  orderId   String?
  order     Order?    @relation(fields: [orderId], references: [id])
  createdAt DateTime  @default(now())
  usedAt    DateTime?
}

enum KeyStatus { AVAILABLE RESERVED DELIVERED REFUNDED }

model Order {
  id               String      @id @default(cuid())
  userId           String
  user             User        @relation(fields: [userId], references: [id])
  status           OrderStatus @default(PENDING)
  totalAmount      Decimal     @db.Decimal(10,2)
  mpPaymentId      String?     // ID retornado pelo Mercado Pago
  mpPreferenceId   String?
  paymentMethod    String?     // 'pix' | 'credit_card' | 'boleto'
  createdAt        DateTime    @default(now())
  updatedAt        DateTime    @updatedAt

  items  OrderItem[]
  keys   Key[]
}

enum OrderStatus { PENDING PAID DELIVERING DELIVERED FAILED REFUNDED }

model OrderItem {
  id        String  @id @default(cuid())
  orderId   String
  order     Order   @relation(fields: [orderId], references: [id])
  gameId    String
  game      Game    @relation(fields: [gameId], references: [id])
  price     Decimal @db.Decimal(10,2) // preço no momento da compra
  quantity  Int     @default(1)
}

// NextAuth required models
model Account { ... } // padrão NextAuth
model Session { ... } // padrão NextAuth
```

---

## SISTEMA DE KEYS — LÓGICA CRÍTICA

A entrega de keys deve ser **atômica e à prova de falhas**. Implemente exatamente assim em `lib/keys.ts`:

```typescript
// NUNCA entregue key sem confirmar pagamento.
// NUNCA permita race condition (dois usuários pegando a mesma key).

export async function reserveKeys(gameId: string, quantity: number, orderId: string) {
  return await prisma.$transaction(async (tx) => {
    // 1. Bloqueia as rows com FOR UPDATE SKIP LOCKED (sem deadlock)
    const keys = await tx.$queryRaw<Key[]>`
      SELECT * FROM "Key"
      WHERE "gameId" = ${gameId}
        AND status = 'AVAILABLE'
      LIMIT ${quantity}
      FOR UPDATE SKIP LOCKED
    `;

    if (keys.length < quantity) {
      throw new Error('INSUFFICIENT_STOCK');
    }

    // 2. Marca como RESERVED atomicamente
    await tx.key.updateMany({
      where: { id: { in: keys.map(k => k.id) } },
      data: { status: 'RESERVED', orderId },
    });

    return keys;
  });
}

export async function deliverKeys(orderId: string) {
  // Chamado APENAS pelo webhook do Mercado Pago após status = 'approved'
  return await prisma.$transaction(async (tx) => {
    await tx.key.updateMany({
      where: { orderId, status: 'RESERVED' },
      data: { status: 'DELIVERED', usedAt: new Date() },
    });
    await tx.order.update({
      where: { id: orderId },
      data: { status: 'DELIVERED' },
    });
    // Dispara email com as keys (via Resend)
  });
}
```

---

## CARRINHO — NAVEGAÇÃO ANÔNIMA

O carrinho deve funcionar **sem login**. Implemente com dois estados:

1. **Anônimo**: Carrinho salvo em cookie (`vault_cart`) como JSON stringificado `{ items: [{ gameId, quantity }] }`
2. **Autenticado**: Ao logar, o carrinho do cookie é **mesclado** com o estado do Zustand. Não há tabela de carrinho no banco — carrinho é efêmero até virar pedido.

```typescript
// store/cart.store.ts
interface CartStore {
  items: CartItem[]
  isOpen: boolean
  addItem: (game: Game) => void
  removeItem: (gameId: string) => void
  clearCart: () => void
  mergeWithCookie: () => void // chamado após login
  totalItems: number
  totalPrice: number
}
```

**Regra de merge**: se o jogo já está no carrinho Zustand, não duplica. Cookie é descartado após merge.

---

## PAINEL ADMIN — ESPECIFICAÇÕES DETALHADAS

### Acesso
- Rota: `/admin/*`
- Verificação dupla: `middleware.ts` (JWT role check) + `layout.tsx` (server-side role check)
- Role `ADMIN` definida no model `User`. Adicione o primeiro admin via seed ou SQL direto.

### Dashboard `/admin`
Mostre em cards:
- Total de jogos ativos
- Keys disponíveis (todas) / Keys entregues (hoje)
- Receita total / Receita do mês
- Últimos 10 pedidos com status

### CRUD de Jogos `/admin/games`
- Listagem com busca, filtro por gênero/status, ordenação
- Formulário com: título, slug (auto-gerado do título), descrição (textarea rich), preço, gêneros (multi-select), plataformas, developer, data de lançamento, featured toggle
- Upload de capa e gallery (drag & drop, preview imediato, upload para Vercel Blob)
- Preview do card como ficará na loja (ao vivo enquanto edita)
- Soft delete: campo `active: false` (nunca DELETE no banco)

### Estoque de Keys `/admin/keys`
- Por jogo: mostra contagem de AVAILABLE / RESERVED / DELIVERED
- Upload em lote: textarea ou `.txt` com uma key por linha
- Parser: trim, deduplicação, validação mínima (>8 chars)
- Botão de download de keys entregues por pedido (para suporte)
- Alerta visual quando estoque < 5 keys (badge vermelho no sidebar)

### Pedidos `/admin/orders`
- Tabela com: id, usuário, jogo(s), valor, status, método de pagamento, data
- Filtro por status e período
- Reenvio manual de key por e-mail (botão por pedido)
- Link direto para o pagamento no painel do Mercado Pago

---

## INTEGRAÇÃO MERCADO PAGO

### Fluxo completo

```
Usuário clica "Finalizar compra"
  → POST /api/checkout
  → Cria preferência no MP com os itens do carrinho
  → Reserva keys (status: RESERVED) via reserveKeys()
  → Retorna preferenceId ao cliente
  → Frontend renderiza <Payment> brick com o preferenceId
  → Usuário paga (PIX / cartão / boleto)
  → MP chama POST /api/webhooks/mercadopago
  → Webhook verifica assinatura (x-signature header)
  → Se status = 'approved': chama deliverKeys() + envia e-mail
  → Se status = 'rejected': libera keys reservadas (RESERVED → AVAILABLE)
```

### Variáveis necessárias (inclua no `.env.example` com comentários)

```bash
# Mercado Pago
MERCADOPAGO_ACCESS_TOKEN=        # APP_USR-... (produção) ou TEST-... (sandbox)
MERCADOPAGO_PUBLIC_KEY=          # Para o Payment Brick no frontend
MERCADOPAGO_WEBHOOK_SECRET=      # Para validar assinatura dos webhooks

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# NextAuth
NEXTAUTH_URL=                    # http://localhost:3000 em dev, URL real em prod
NEXTAUTH_SECRET=                 # openssl rand -base64 32

# Banco
DATABASE_URL=                    # postgresql://... (local: Docker, prod: Neon/Supabase)

# Upload
BLOB_READ_WRITE_TOKEN=           # Vercel Blob (ou CLOUDINARY_URL=)

# Email
RESEND_API_KEY=                  # Para envio de keys e confirmações
```

---

## ANIMAÇÕES — ESPECIFICAÇÕES EXATAS

Use Framer Motion em **todos** os elementos interativos. Implemente estes padrões:

### 1. Page transitions (em `layout.tsx` ou `(store)/layout.tsx`)
```tsx
<AnimatePresence mode="wait">
  <motion.div
    key={pathname}
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
  >
    {children}
  </motion.div>
</AnimatePresence>
```

### 2. Cards de jogos (stagger na entrada)
```tsx
const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } }
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 400, damping: 30 } } }

<motion.ul variants={container} initial="hidden" animate="show">
  {games.map(game => <motion.li variants={item} key={game.id}>...</motion.li>)}
</motion.ul>
```

### 3. Hero com parallax
```tsx
const { scrollY } = useScroll()
const y = useTransform(scrollY, [0, 500], [0, -150])
const opacity = useTransform(scrollY, [0, 300], [1, 0])

<motion.div style={{ y, opacity }}>
  {/* conteúdo do hero */}
</motion.div>
```

### 4. Cart drawer
```tsx
<AnimatePresence>
  {isOpen && (
    <>
      <motion.div // overlay
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={close}
      />
      <motion.aside // drawer
        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 400, damping: 40 }}
        className="fixed right-0 top-0 h-full w-[420px] bg-[--surface] z-50 border-l border-[--border]"
      >
        {/* conteúdo */}
      </motion.aside>
    </>
  )}
</AnimatePresence>
```

### 5. Micro-interações obrigatórias
- Botão "Comprar": `whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}`
- Skeleton loaders: pulse com `animate={{ opacity: [0.4, 0.8, 0.4] }}`
- Badge de quantidade no carrinho: `animate={{ scale: [1, 1.3, 1] }}` ao adicionar item
- Notificação de key entregue: slide-in do canto inferior esquerdo com `--success` color

---

## DOCKER COMPOSE (local)

```yaml
# docker-compose.yml
version: '3.9'
services:
  db:
    image: postgres:16-alpine
    restart: unless-stopped
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: vault
      POSTGRES_PASSWORD: vault_dev
      POSTGRES_DB: vault_store
    volumes:
      - ./data/postgres:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U vault"]
      interval: 5s
      timeout: 5s
      retries: 5
```

**Comandos de setup** (inclua no README):
```bash
docker compose up -d          # Sobe o banco
npx prisma migrate dev         # Aplica migrations
npx prisma db seed             # Popula com dados de teste
npm run dev                    # Inicia Next.js
```

---

## GITHUB ACTIONS — CI/CD

```yaml
# .github/workflows/ci.yml
name: CI
on:
  pull_request:
    branches: [main, dev]
  push:
    branches: [main]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npx prisma generate
      - run: npm run type-check    # tsc --noEmit
      - run: npm run lint          # eslint
      - run: npm run build         # next build (falha se quebrar)
```

**Vercel**: conecte o repo no dashboard. Main → produção automática. Cada PR → preview URL automática. Configure as variáveis de ambiente na Vercel (Settings → Environment Variables).

---

## REGRAS DE QUALIDADE — A IA DEVE SEGUIR

1. **TypeScript estrito**: zero uso de `any`. Se não souber o tipo, use `unknown` e faça type guard.
2. **Server Components por padrão**: só adicione `'use client'` quando houver interatividade obrigatória (hooks, eventos).
3. **Error boundaries**: cada rota deve ter `error.tsx` e `loading.tsx` correspondentes.
4. **Segurança em APIs**: valide body com Zod em toda route handler. Verifique sessão e role antes de qualquer operação de escrita.
5. **Sem secrets no cliente**: `MERCADOPAGO_ACCESS_TOKEN` nunca vai para o bundle do browser. Apenas `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY`.
6. **Acessibilidade**: todo elemento interativo tem `aria-label`. Imagens têm `alt` descritivo. Contraste mínimo WCAG AA.
7. **Sem `console.log` em produção**: use um logger condicional (`if (process.env.NODE_ENV === 'development')`).
8. **Transações atômicas para operações financeiras**: qualquer operação que envolva mudança de status de key + pedido usa `prisma.$transaction()`.
9. **Idempotência no webhook**: antes de entregar keys, verifique se `order.status !== 'DELIVERED'` para não entregar duas vezes.
10. **Imagens via `next/image`**: proibido usar `<img>` para imagens de produto. Configure `remotePatterns` no `next.config.ts` para os domínios de upload.

---

## COMO USAR ESTE PROMPT

**Opção A — Implementação incremental (recomendada)**
Divida em pedidos separados para cada fase:

1. *"Com base no prompt do VAULT Game Store, implemente a Fase 1: setup do projeto, docker-compose, schema Prisma completo e configuração do NextAuth com Google."*
2. *"Agora implemente os componentes de UI base (Button, Card, Input, Badge) seguindo o design system VAULT exatamente."*
3. *"Implemente a home page com hero, grid de jogos com stagger animation e skeleton loaders."*
4. *"Implemente o sistema de carrinho com Zustand e o CartDrawer animado."*
5. ... e assim por diante.

**Opção B — Geração de arquivo único**
*"Com base no prompt do VAULT Game Store, gere o arquivo `[nome]` completo e production-ready."*

**Opção C — Debug e melhoria**
*"No contexto do VAULT Game Store descrito no prompt, aqui está meu código atual de `[arquivo]`: [código]. Identifique problemas e reescreva com qualidade de produção."*

---

## CHECKLIST DE ENTREGA FINAL

Antes de considerar o projeto pronto, verifique:

- [ ] `npm run build` sem erros ou warnings de TypeScript
- [ ] `npm run lint` sem erros
- [ ] Fluxo completo: navegação anônima → adicionar ao carrinho → login → checkout → pagamento sandbox → key recebida por e-mail
- [ ] Painel admin: criar jogo, fazer upload de capa, adicionar keys, visualizar pedido
- [ ] Webhook do Mercado Pago testado com CLI do MP (`mp webhook test`)
- [ ] Variáveis de ambiente configuradas na Vercel
- [ ] Deploy na Vercel funcionando com DATABASE_URL apontando para banco de produção
- [ ] Imagens carregando via CDN (não do servidor Next.js)
- [ ] Middleware bloqueando `/admin` para não-admins
- [ ] Middleware redirecionando `/checkout` para login se anônimo
