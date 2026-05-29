import { MercadoPagoConfig, Preference, Payment } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
});

export const preferenceClient = new Preference(client);
export const paymentClient = new Payment(client);

export interface CreatePreferenceItem {
  id: string;
  title: string;
  quantity: number;
  unit_price: number;
  currency_id?: string;
}

/**
 * Cria uma preferência de pagamento no Mercado Pago.
 * Em produção (APP_USR-xxx), redireciona para checkout real.
 * Retorna a preferência com init_point (produção) e sandbox_init_point (teste).
 */
export async function createPreference(
  items: CreatePreferenceItem[],
  orderId: string,
  payerEmail: string
) {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  const isLocalhost = baseUrl.includes("localhost") || baseUrl.includes("127.0.0.1");

  const preferenceBody: any = {
    items: items.map((item) => ({
      id: item.id,
      title: item.title,
      quantity: item.quantity,
      unit_price: Number(item.unit_price),
      currency_id: item.currency_id ?? "BRL",
    })),
    payer: { email: payerEmail },
    external_reference: orderId,
    back_urls: {
      success: `${baseUrl}/checkout/success?order_id=${orderId}`,
      failure: `${baseUrl}/checkout/failure?order_id=${orderId}`,
      pending: `${baseUrl}/checkout/pending?order_id=${orderId}`,
    },
    auto_return: "approved",
    statement_descriptor: "VAULT GAMES",
    binary_mode: false,
  };

  if (!isLocalhost) {
    preferenceBody.notification_url = `${baseUrl}/api/webhooks/mercadopago`;
  }

  const preference = await preferenceClient.create({
    body: preferenceBody,
  });

  return preference;
}
