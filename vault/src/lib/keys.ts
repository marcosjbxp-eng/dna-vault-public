import { prisma } from "@/lib/prisma";
import type { Key } from "@prisma/client";

/**
 * Reserva keys atomicamente usando FOR UPDATE SKIP LOCKED.
 * Nunca entregue key sem confirmar pagamento.
 * Nunca permita race condition (dois usuários pegando a mesma key).
 */
export async function reserveKeys(
  gameId: string,
  quantity: number,
  orderId: string
) {
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
      throw new Error("INSUFFICIENT_STOCK");
    }

    // 2. Marca como RESERVED atomicamente
    await tx.key.updateMany({
      where: { id: { in: keys.map((k) => k.id) } },
      data: { status: "RESERVED", orderId },
    });

    return keys;
  });
}

/**
 * Entrega keys após pagamento confirmado.
 * Chamado APENAS pelo webhook do Mercado Pago após status = 'approved'.
 */
export async function deliverKeys(orderId: string) {
  return await prisma.$transaction(async (tx) => {
    // Idempotência: verifica se já não foi entregue
    const order = await tx.order.findUnique({
      where: { id: orderId },
      select: { status: true },
    });

    if (order?.status === "DELIVERED") {
      return; // Já foi entregue — webhook duplicado
    }

    const deliveredKeys = await tx.key.findMany({
      where: { orderId, status: "RESERVED" },
    });

    await tx.key.updateMany({
      where: { orderId, status: "RESERVED" },
      data: { status: "DELIVERED", usedAt: new Date() },
    });

    await tx.order.update({
      where: { id: orderId },
      data: { status: "DELIVERED" },
    });

    return deliveredKeys;
  });
}

/**
 * Libera keys reservadas caso o pagamento falhe.
 */
export async function releaseKeys(orderId: string) {
  return await prisma.$transaction(async (tx) => {
    await tx.key.updateMany({
      where: { orderId, status: "RESERVED" },
      data: { status: "AVAILABLE", orderId: null },
    });

    await tx.order.update({
      where: { id: orderId },
      data: { status: "FAILED" },
    });
  });
}
