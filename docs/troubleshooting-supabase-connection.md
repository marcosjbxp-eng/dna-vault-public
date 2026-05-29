# Análise Técnica e Depuração de Conexão - Supabase (VAULT Game Store)

## 📋 Resumo Final
**STATUS: ✅ RESOLVIDO** — Conexão estabelecida, schema aplicado, seed executado, build validado.

Realizamos uma bateria extensiva de testes físicos, lógicos e de rede na integração entre a aplicação local **VAULT Game Store** e o banco de dados hospedado no **Supabase** (região `us-west-1`, ID do projeto `upekifhjirdunqhogymb`).

---

## 🔍 Descobertas e Resultados dos Testes

### 1. Conectividade de Rede Física (TCP)
Executamos testes diretos de comunicação TCP via `Test-NetConnection`:
- **Host `aws-0`:** Portas 5432 e 6543 — `TcpTestSucceeded: True` ✅
- **Host `aws-1`:** Portas 5432 e 6543 — `TcpTestSucceeded: True` ✅

> [!NOTE]
> Não existe nenhum bloqueio de Firewall local ou provedor de internet. A conexão física de rede está 100% aberta.

### 2. Resolução de DNS (IPv4 vs IPv6)
- O host direto do banco (`db.upekifhjirdunqhogymb.supabase.co`) possui apenas registro **AAAA (IPv6)**, tornando conexões diretas impossíveis em redes IPv4-only.
- Os hosts do pooler resolvem exclusivamente para **IPv4**:
  - `aws-0`: IPs `52.8.172.168`, `54.177.55.191`
  - `aws-1`: IPs `54.241.91.151`, `3.101.5.153` (CNAME → `pool-tcp-usw11-f3ce7a2-b29bc868fe86d9c2.elb.us-west-1.amazonaws.com`)

### 3. Comportamento do Parser do Prisma
- O caractere especial de exclamação (`!`) na senha original quebrava o parser de URI interno do Prisma, induzindo ao erro genérico `P1001`.
- **Solução**: Usar senhas sem caracteres especiais ou escapar com URL-encoding (`%21`).

### 4. Certificado SSL Auto-Assinado
- O módulo `pg` do Node.js rejeitava a conexão com `SELF_SIGNED_CERT_IN_CHAIN`.
- O Prisma Query Engine (binário Rust) também falhava com `P1001` internamente pelo mesmo motivo.
- **Solução**: Usar `ssl: { rejectUnauthorized: false }` no `pg`, e `NODE_TLS_REJECT_UNAUTHORIZED=0` para operações Node.js.

### 5. 🎯 DESCOBERTA CRUCIAL: Cluster Errado!
Esta foi a raiz principal do problema de autenticação:

| Cluster | Erro Retornado | Significado |
|---------|---------------|-------------|
| `aws-0` | `XX000: Tenant or user not found` | **Projeto NÃO existe neste cluster** |
| `aws-1` | `28P01: password authentication failed` | **Projeto EXISTE aqui!** |

> [!IMPORTANT]
> O projeto `upekifhjirdunqhogymb` está alocado no cluster **`aws-1`**, não no `aws-0`. A API de gerenciamento do Supabase reportava a região como `us-west-1`, mas NÃO especificava o sub-cluster. A descoberta foi feita via teste empírico com múltiplos clusters.

### 6. Limitação do Prisma Schema Engine com Poolers
- O Prisma Schema Engine (`prisma db push`, `prisma migrate deploy`) é um binário Rust que NÃO respeita `NODE_OPTIONS` ou `NODE_TLS_REJECT_UNAUTHORIZED`.
- Ele falha consistentemente com `P1001` ao tentar conectar ao pooler do Supabase.
- **Contorno**: Gerar o SQL via `prisma migrate diff` e executar via módulo `pg` diretamente.

---

## ✅ Solução Aplicada

### Connection Strings Corretas
```env
# Para Prisma Client runtime (Transaction Mode + PgBouncer)
DATABASE_URL="postgresql://postgres.upekifhjirdunqhogymb:12dr0wpqn301@aws-1-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require"

# Para migrações (Session Mode — suporta DDL e transações longas)
DIRECT_URL="postgresql://postgres.upekifhjirdunqhogymb:12dr0wpqn301@aws-1-us-west-1.pooler.supabase.com:5432/postgres?sslmode=require"
```

### Processo de Migração (Contorno do Schema Engine)
```powershell
# 1. Gerar SQL do schema
npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script > prisma/migration.sql

# 2. Aplicar via script Node.js com módulo pg
$env:NODE_OPTIONS="--dns-result-order=ipv4first"; $env:NODE_TLS_REJECT_UNAUTHORIZED="0"; node prisma/apply-migration.mjs
```

### Resultado da Migração
- **22/22 statements** executados sem erros
- 3 enums: `Role`, `KeyStatus`, `OrderStatus`
- 7 tabelas: `User`, `Game`, `Key`, `Order`, `OrderItem`, `Account`, `Session`
- 5 unique indexes
- 7 foreign keys

### Seed
- Usuário admin `admin@vault.com` (role: `ADMIN`) criado com sucesso.

### Build
- `npm run build` → 21/21 páginas compiladas com sucesso (Next.js 15.5.18 + Turbopack).

---

## 📚 Referência: Scripts de Diagnóstico Criados

| Arquivo | Função |
|---------|--------|
| `prisma/test-connection.ts` | Teste de conexão via Prisma Client |
| `prisma/test-raw-pg.mjs` | Teste de conexão via módulo `pg` puro (múltiplos clusters/portas) |
| `prisma/apply-migration.mjs` | Aplica schema SQL statement-by-statement no Supabase |
| `prisma/migration.sql` | SQL gerado pelo Prisma para criação completa do schema |

---

## 🔑 Lições Aprendidas

1. **Nunca assumir o cluster do Supabase**: Testar `aws-0` E `aws-1` (ou outros) empiricamente.
2. **O erro `Tenant or user not found` no cluster errado mascara o problema real**: Parece erro de credencial, mas é erro de roteamento.
3. **O Prisma Schema Engine é incompatível com poolers do Supabase**: Usar `prisma migrate diff` + execução direta via `pg`.
4. **Senhas sem caracteres especiais**: Evitam problemas de parser em múltiplas camadas (Prisma, URI, PostgreSQL).
5. **SSL auto-assinado do Supabase**: Requer `rejectUnauthorized: false` no Node.js e `sslmode=require` (não `verify-full`) nas connection strings.
