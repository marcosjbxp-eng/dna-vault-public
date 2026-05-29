# Diagnóstico do Erro - Invalid Access Token no Mercado Pago

Este documento serve como registro histórico no Obsidian Vault sobre o diagnóstico do erro `invalid access token` ocorrido no ambiente de produção (Vercel) para a plataforma **VAULT Game Store**.

---

## 📅 Detalhes do Incidente
- **Data do Diagnóstico**: 21 de Maio de 2026
- **Ambiente Afetado**: Produção (Vercel)
- **Erro Relatado**: `[CHECKOUT_POST] { code: 'unauthorized', message: 'invalid access token' }`

---

## 🔎 Análise e Investigações Realizadas

### 1. Teste de Validação do Token Local
Criamos e executamos um script standalone em `scratch/test-mp-token.mjs` que carrega a credencial de produção `MERCADOPAGO_ACCESS_TOKEN` do arquivo `.env.local` e faz uma chamada direta para o endpoint `GET https://api.mercadopago.com/v1/payment_methods` da API do Mercado Pago.

**Resultado do Teste Local**:
```bash
Lendo variáveis de ambiente de: .env.local
MERCADOPAGO_ACCESS_TOKEN carregado: APP_USR-3190916...2241762188
Chamando a API do Mercado Pago (GET /v1/payment_methods)...
✅ SUCESSO! O Token de Acesso do Mercado Pago é válido!
Foram retornados 11 métodos de pagamento disponíveis.
```

### 2. Conclusão do Diagnóstico
Como a chamada com o token do arquivo `.env.local` funcionou com **100% de sucesso** localmente, concluímos que **o token em si é válido**. 

Portanto, o erro `invalid access token` no Vercel está ocorrendo devido a um dos seguintes motivos:
1. **Ausência ou Cópia Incorreta na Vercel**: A variável de ambiente `MERCADOPAGO_ACCESS_TOKEN` no painel da Vercel foi copiada de forma incompleta, com espaços em branco adicionais, com aspas embutidas, ou refere-se a uma credencial de testes antiga (`TEST-...`).
2. **Falta de Re-deploy**: O Vercel **NÃO** atualiza as variáveis de ambiente em deploys existentes em tempo real. Se o token foi cadastrado ou alterado recentemente no painel da Vercel, a aplicação continuará usando a versão antiga (ou ficará sem ela) até que um **novo deploy (Build/Redeploy)** seja disparado.

---

## 🛠️ Plano de Ação Recomendado para o Usuário

Para sincronizar e aplicar o token de produção válido na Vercel:

1. **Verificar a Variável de Ambiente no Vercel**:
   - Acesse o painel do seu projeto na Vercel.
   - Vá em **Settings** → **Environment Variables**.
   - Procure por `MERCADOPAGO_ACCESS_TOKEN`.
   - Clique em editar e certifique-se de que o valor colado é **exatamente** o mesmo do seu arquivo `.env.local`:
     `APP_USR-3190916375716317-051814-ad55576edfc137ed7d8199545ffbdf88-2241762188`
   - Certifique-se de que não há espaços vazios no início ou no fim e nem aspas rodeando a chave.

2. **Realizar um Novo Deploy (Crucial)**:
   - Na Vercel, vá para a aba **Deployments**.
   - Selecione o último deploy que falhou, clique nos três pontinhos (`...`) e selecione **Redeploy** (com a opção *Use existing Build Cache* desmarcada, de preferência).
   - Alternativamente, envie um novo commit para o seu repositório GitHub para forçar um deploy automático.
   - **Somente novos deploys lerão as novas variáveis configuradas!**

---

## 🛡️ Melhoria Preventiva de Código Aplicada

Para evitar que a aplicação quebre localmente ao tentar usar chaves de produção (já que o Mercado Pago em produção rejeita `localhost` como URL de webhook/notificação), ajustamos o arquivo `src/lib/mercadopago.ts`. 

Se a aplicação rodar em `localhost`, omitiremos a propriedade `notification_url`, garantindo que você possa testar o redirecionamento ao checkout sem erros localmente.
