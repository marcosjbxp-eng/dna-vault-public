# Guia de Configuração do Vercel Plugin para Agentes (Claude Code / Cursor)

Este guia documenta o processo de configuração e as informações necessárias para que o **Vercel Plugin** instalado nas ferramentas de agente funcione com 100% de eficiência.

---

## ⚡ O que é o Vercel Plugin?
Instalado via `npx plugins add vercel/vercel-plugin`, este plugin estende as capacidades das ferramentas de inteligência artificial de desenvolvimento local (como o Claude Code). Ele adiciona comandos nativos, hooks, servidores MCP e 26 novas habilidades específicas da plataforma Vercel para construir, inspecionar e implantar aplicações diretamente do terminal do agente.

Com a instalação concluída, o agente agora pode:
- Gerenciar projetos da Vercel.
- Disparar novos deploys locais ou em nuvem.
- Inspecionar builds ativos e ver logs de erros de produção.
- Visualizar e gerenciar variáveis de ambiente na Vercel.

---

## 🔑 Informações Necessárias: Autenticação do Plugin

Para que as suas ferramentas de agente consigam interagir com a API da Vercel em seu nome, você precisa fornecer o **Token de Acesso Pessoal (Personal Access Token)** da sua conta Vercel.

### 1. Como obter o seu Vercel Token:
1. Acesse o painel da Vercel em [Vercel Tokens](https://vercel.com/account/tokens).
2. Clique em **"Create"** para gerar um novo token de acesso.
3. Dê um nome descritivo (ex: `ag-kit-agent-token`).
4. Selecione o escopo apropriado (ou mantenha padrão de conta de usuário) e defina uma data de expiração.
5. Copie o token gerado (ex: `v1.xxxxxxxxxxxxxxxxxxxx`). **Importante:** Guarde-o em local seguro, pois ele não será exibido novamente.

### 2. Onde Adicionar o Token no Agente:
Para que o plugin e a CLI do agente encontrem o seu token de forma global, adicione-o como variável de ambiente no seu sistema ou no arquivo `.env` do seu projeto.

No arquivo `.env` do projeto local:
```env
# Token de acesso à API da Vercel
VERCEL_TOKEN="INSIRA_SEU_VERCEL_TOKEN_AQUI"
```

No PowerShell do seu computador local (para sessões persistentes):
```powershell
[System.Environment]::SetEnvironmentVariable("VERCEL_TOKEN", "INSIRA_SEU_VERCEL_TOKEN_AQUI", "User")
```

---

## 🏗️ Vinculando o Projeto Local com a Vercel

O plugin da Vercel precisa saber a qual organização e projeto na Vercel o seu repositório local `vault` pertence. Essa vinculação é feita criando a pasta `.vercel/` e o arquivo `project.json` na raiz do seu projeto.

Se você possuir a CLI da Vercel instalada na sua máquina física, execute o comando abaixo no terminal da pasta `c:\DNA\vault`:
```powershell
npx vercel link
```
Isso guiará você por um assistente interativo para:
1. Fazer login no Vercel (caso não esteja logado).
2. Selecionar o seu workspace (ex: `marcosjbxp-eng`).
3. Vincular a um projeto existente ou criar um novo projeto (ex: criar o projeto `neymarjr`).

Após concluir, a CLI criará a pasta `.vercel/` contendo:
* **`orgId`**: ID único do seu time/conta na Vercel.
* **`projectId`**: ID único do projeto que receberá os deploys.

### Criando a Vinculação Manualmente (Alternativa)
Se preferir que façamos manualmente, após você criar o projeto na Vercel:
1. Obtenha o seu `orgId` (nas configurações da conta na Vercel) e o `projectId` (nas configurações do projeto na Vercel).
2. Crie o arquivo `c:\DNA\vault\.vercel\project.json` com o seguinte formato:
```json
{
  "orgId": "SUA_ORG_ID",
  "projectId": "SEU_PROJECT_ID"
}
```

---

## 🛠️ Comandos Ganhos com o Vercel Plugin

Com o plugin ativo e configurado com o `VERCEL_TOKEN`, o seu agente ganha novas capacidades fantásticas! Você pode solicitar comandos como:

| Ação Desejada | Exemplo de Instrução para o Agente |
|---------------|------------------------------------|
| **Fazer Deploy** | *"Faça deploy de produção do projeto na Vercel"* |
| **Listar Deploys** | *"Quais são os builds mais recentes e o status de deploy?"* |
| **Variáveis de Ambiente** | *"Adicione a DATABASE_URL na Vercel usando o plugin"* |
| **Logs de Erro** | *"Verifique se há erros no build da Vercel"* |

---

## 📝 Atualização na Memória do Projeto

As informações de instalação do plugin da Vercel foram integradas à memória geral no arquivo `vault-store-memory.md` para guiar todas as sessões futuras sobre as capacidades estendidas do agente.
