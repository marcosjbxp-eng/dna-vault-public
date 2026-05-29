# Guia de Deploy na Vercel e Configuração do GitHub - VAULT Game Store

Este guia foi elaborado para auxiliá-lo a publicar o seu projeto no **GitHub** e realizar o deploy na **Vercel** com todas as configurações necessárias para o correto funcionamento (Banco de dados Prisma, Autenticação, Mercado Pago, etc.).

---

## 📋 1. Enviando o Projeto para o GitHub

O projeto já possui um repositório Git inicializado dentro da pasta `vault/` (indicado pela presença da pasta oculta `.git`). O arquivo `.gitignore` já está configurado para não enviar dados sensíveis (como arquivos `.env*` e a pasta `node_modules`).

### Passo a Passo:

1. **Abra o seu terminal favorito** e navegue até a pasta do projeto:
   ```bash
   cd c:/DNA/vault
   ```

2. **Verifique o status do Git** para garantir que tudo está limpo e pronto:
   ```bash
   git status
   ```

3. **Adicione todas as alterações** ao controle de versão local:
   ```bash
   git add .
   ```

4. **Crie o commit inicial** com uma mensagem clara:
   ```bash
   git commit -m "feat: setup inicial do projeto vault e painel admin"
   ```

5. **Crie um repositório no GitHub**:
   - Vá para o site do [GitHub](https://github.com/) e faça login.
   - Clique no botão **New** (Novo) no painel esquerdo ou visite [github.com/new](https://github.com/new).
   - Nomeie o repositório (ex: `vault-game-store`).
   - Escolha a visibilidade (**Public** ou **Private** - *Recomendado Private se você quiser ocultar o código-fonte de terceiros*).
   - **NÃO** marque as caixas para adicionar README, `.gitignore` ou licença (para evitar conflitos, já que já os temos no local).
   - Clique em **Create repository**.

6. **Conecte o repositório local ao GitHub e envie os arquivos**:
   Copie os comandos exibidos na página do GitHub recém-criada (substituindo pelo seu link) ou rode estes comandos no seu terminal na pasta `vault/`:
   ```bash
   # Garante que a branch principal se chame main
   git branch -M main

   # Vincula o repositório local ao repositório do GitHub
   git remote add origin https://github.com/SEU_USUARIO/NOME_DO_REPOSITORIO.git

   # Envia os commits locais para o GitHub
   git push -u origin main
   ```

---

## 🗄️ 2. Criando o Banco de Dados de Produção (PostgreSQL)

Como o banco de dados atual está rodando localmente (`localhost`), a Vercel não conseguirá se conectar a ele. Você precisará de uma instância do PostgreSQL hospedada na nuvem.

### Opções Recomendadas (Gratuitas / Planos de Entrada):
1. **Neon Tech** ([neon.tech](https://neon.tech/)): Banco de dados PostgreSQL serverless com plano gratuito generoso. Altamente recomendado para Next.js e Vercel.
2. **Supabase** ([supabase.com](https://supabase.com/)): Plataforma de Backend-as-a-Service que oferece banco de dados Postgres gratuito e muito robusto.
3. **Vercel Postgres**: O banco de dados PostgreSQL integrado da própria Vercel, configurável diretamente no painel do seu projeto.

### Passo a Passo no Neon ou Supabase:
1. Crie uma conta no serviço escolhido e inicialize um novo banco de dados PostgreSQL.
2. Na tela de conexão do painel, copie a **Connection String** (URL de conexão). Ela será parecida com:
   ```text
   postgresql://usuario:senha@host-neon.tech/neondb?sslmode=require
   ```
3. Guarde este link seguro. **Você o usará no deploy da Vercel e nas migrações do Prisma**.

---

## 🚀 3. Realizando o Deploy na Vercel

1. **Crie uma conta / Entre na Vercel**:
   - Vá para o site da [Vercel](https://vercel.com/) e faça login utilizando a sua conta do **GitHub**.

2. **Importe o Repositório**:
   - No painel da Vercel, clique em **Add New...** -> **Project**.
   - Localize o repositório `vault-game-store` na lista e clique em **Import**.

3. **Configure as Opções de Build**:
   - **Framework Preset**: O painel detectará automaticamente **Next.js**.
   - **Root Directory**: Caso o seu repositório do GitHub tenha a pasta `vault` na raiz, clique em **Edit** e aponte para a subpasta `vault` do projeto.

4. **Configure as Variáveis de Ambiente (Environment Variables)**:
   Expanda a seção e adicione cada uma das variáveis de ambiente listadas abaixo. Elas são essenciais para que seu site compile e funcione perfeitamente:

   | Nome da Variável | Valor Recomendado / Descrição |
   | :--- | :--- |
   | `DATABASE_URL` | A connection string do seu banco online (obtida no Neon ou Supabase). |
   | `NEXTAUTH_SECRET` | Uma chave de criptografia segura. Gere uma rodando `openssl rand -base64 32` no seu terminal e cole o resultado aqui. |
   | `NEXTAUTH_URL` | O domínio final da Vercel (ex: `https://meu-projeto.vercel.app`). Se for NextAuth v5 (como usado no seu projeto), a Vercel costuma inferir a URL principal automaticamente, mas definir de forma explícita evita comportamentos inesperados. |
   | `MERCADOPAGO_ACCESS_TOKEN` | Seu Token de Acesso obtido no painel de desenvolvedor do Mercado Pago. |
   | `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY` | Sua Chave Pública do Mercado Pago para inicializar o Payment Brick no frontend. |
   | `MERCADOPAGO_WEBHOOK_SECRET` | Chave de validação secreta gerada ao configurar o webhook do Mercado Pago (para receber confirmações de pagamento). |
   | `GOOGLE_CLIENT_ID` | Client ID do Google OAuth configurado no Google Cloud Console. |
   | `GOOGLE_CLIENT_SECRET` | Client Secret correspondente no Google Cloud Console. |
   | `RESEND_API_KEY` | Sua chave de API do Resend (para envio automatizado de emails com chaves de jogos). |
   | `BLOB_READ_WRITE_TOKEN` | Token do Vercel Blob (se configurado na aba Storage da Vercel). |

5. **Prisma Postinstall**:
   - O projeto já possui o script `"postinstall": "prisma generate"` configurado no `package.json`. A Vercel executará este comando automaticamente após instalar as dependências para gerar o cliente do Prisma no build.

6. **Execute o Deploy**:
   - Clique em **Deploy** e aguarde o build completar!

---

## 🛠️ 4. Sincronizando o Banco de Dados Online (Prisma Migrations)

Para criar as tabelas e o esquema do banco de dados no seu novo banco online, você precisa aplicar as migrações locais no banco de produção.

No seu computador local:
1. Abra o arquivo `.env.local` na pasta `vault` e altere a variável `DATABASE_URL` temporariamente para a URL do banco online de produção.
2. Execute o comando de migração:
   ```bash
   npx prisma migrate deploy
   ```
3. Se você quiser rodar as sementes (dados iniciais dos jogos/admin), você pode rodar o seed:
   ```bash
   npm run db:seed
   ```
4. **IMPORTANTE**: Após rodar as migrações, lembre-se de voltar a `DATABASE_URL` no seu arquivo `.env.local` para a URL do seu banco local (`localhost`), para que seus testes locais continuem funcionando isoladamente e você não altere dados de produção sem querer.

---

## 🔄 5. Atualizando o Google OAuth para Produção

Não se esqueça de acessar o **Console do Google Cloud** e atualizar o cadastro do seu app OAuth:
- Adicione o domínio da Vercel (`https://seu-projeto.vercel.app`) nas **Origens JavaScript autorizadas**.
- Adicione a URL do callback do NextAuth nas **URIs de redirecionamento autorizadas**:
  `https://seu-projeto.vercel.app/api/auth/callback/google`
