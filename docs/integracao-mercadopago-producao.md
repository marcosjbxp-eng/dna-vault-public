# Integração Mercado Pago — Produção Real

## Status
- **Data**: 21 de Maio de 2026
- **Ambiente**: ✅ PRODUÇÃO (APP_USR, não TEST)
- **Tipo de integração**: Checkout Pro (redirect para Mercado Pago)

## Credenciais Configuradas

| Campo | Valor | Arquivo |
|-------|-------|---------|
| **Public Key** | `APP_USR-588c4354-feec-48cf-a112-494c9565e4e2` | `.env` / `.env.local` |
| **Access Token** | `APP_USR-3190916375716317-...` | `.env` / `.env.local` |
| **Client ID** | `3190916375716317` | `.env` / `.env.local` |
| **Client Secret** | `S2e0WsNYV40HuR4ayk3IYqeOyBtKfZy1` | `.env` / `.env.local` |
| **Webhook Secret** | `9c5aa07f...bafce6a1` | `.env` / `.env.local` |

> ✅ **Webhook Secret configurado** — A validação HMAC-SHA256 está ativa. Todo webhook recebido será verificado.

## Arquivos Modificados/Criados

### Modificados
1. **`.env`** — Credenciais de TEST trocadas por APP_USR (produção)
2. **`.env.local`** — Idem
3. **`.env.example`** — Atualizado template com novos nomes de variáveis
4. **`src/lib/mercadopago.ts`** — Melhorado:
   - `back_urls` agora incluem `order_id` como query param
   - `statement_descriptor: "VAULT GAMES"` (aparece na fatura do cartão)
   - `binary_mode: false` (permite pagamentos pendentes como PIX/boleto)
5. **`src/app/api/checkout/route.ts`** — Retorna `init_point` (produção) e `sandbox_init_point`
6. **`src/app/(store)/checkout/page.tsx`** — Usa `data.initPoint` para redirecionar ao checkout real do MP
7. **`src/app/api/webhooks/mercadopago/route.ts`** — Melhorado com:
   - Validação HMAC-SHA256 da assinatura do webhook
   - Logging detalhado para debugging
   - Idempotência mantida

### Criados
8. **`src/app/(store)/checkout/success/page.tsx`** — Página de pagamento aprovado
9. **`src/app/(store)/checkout/failure/page.tsx`** — Página de pagamento recusado
10. **`src/app/(store)/checkout/pending/page.tsx`** — Página de pagamento pendente (PIX/boleto)

## Fluxo Completo de Pagamento

```
Usuário adiciona ao carrinho
       ↓
Checkout page → POST /api/checkout
       ↓
API cria Order (PENDING) → reserva Keys (FOR UPDATE SKIP LOCKED) → cria Preference no MP
       ↓
API retorna { init_point, preferenceId, orderId }
       ↓
Frontend redireciona para init_point (checkout do Mercado Pago REAL)
       ↓
Usuário paga (PIX / Cartão / Boleto)
       ↓
MP redireciona para:
  ├─ /checkout/success (aprovado)
  ├─ /checkout/failure (recusado)
  └─ /checkout/pending (pendente)
       ↓
MP envia webhook POST /api/webhooks/mercadopago
       ↓
Webhook valida assinatura HMAC → busca payment → atualiza Order
  ├─ approved → PAID → deliverKeys → DELIVERED
  ├─ rejected/cancelled → releaseKeys → FAILED
  └─ pending → aguarda próximo webhook
```

## Configuração Pendente no Painel do Mercado Pago

Para que o webhook funcione em produção:

1. Acessar [mercadopago.com.br/developers](https://www.mercadopago.com.br/developers)
2. Ir em **Suas integrações** → selecionar a aplicação
3. **Webhooks** → Configurar:
   - **URL**: `https://SEU-DOMINIO.vercel.app/api/webhooks/mercadopago`
   - **Eventos**: `payment`
4. Copiar o **segredo** gerado e colocar em `MERCADOPAGO_WEBHOOK_SECRET` no `.env` e na Vercel

## Na Vercel — Variáveis de Ambiente

Adicionar na Vercel (Settings → Environment Variables):

```
MERCADOPAGO_ACCESS_TOKEN=APP_USR-3190916375716317-051814-ad55576edfc137ed7d8199545ffbdf88-2241762188
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=APP_USR-588c4354-feec-48cf-a112-494c9565e4e2
MERCADOPAGO_CLIENT_ID=3190916375716317
MERCADOPAGO_CLIENT_SECRET=S2e0WsNYV40HuR4ayk3IYqeOyBtKfZy1
MERCADOPAGO_WEBHOOK_SECRET=<valor_do_painel_MP>
```

## Segurança

- ✅ Webhook com validação HMAC-SHA256 (quando `MERCADOPAGO_WEBHOOK_SECRET` configurado)
- ✅ Keys nunca entregues sem pagamento confirmado
- ✅ Idempotência no webhook (não re-processa pedidos já entregues)
- ✅ Race condition protegida com `FOR UPDATE SKIP LOCKED`
- ✅ `statement_descriptor` configurado (aparece na fatura como "VAULT GAMES")
- ⚠️ Credenciais em `.env` — já no `.gitignore`
