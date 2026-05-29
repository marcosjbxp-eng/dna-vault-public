import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { reserveKeys } from "@/lib/keys";
import { createPreference } from "@/lib/mercadopago";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized — faça login para finalizar", {
        status: 401,
      });
    }

    const body = await request.json();
    const { items } = body as {
      items: { gameId: string; quantity: number }[];
    };

    if (!items || items.length === 0) {
      return new NextResponse("Carrinho vazio", { status: 400 });
    }

    // Fetch games and validate
    const games = await prisma.game.findMany({
      where: {
        id: { in: items.map((i) => i.gameId) },
        active: true,
      },
    });

    if (games.length !== items.length) {
      return new NextResponse("Jogo(s) indisponível(is)", { status: 400 });
    }

    const totalAmount = items.reduce((sum, item) => {
      const game = games.find((g) => g.id === item.gameId)!;
      return sum + Number(game.price) * item.quantity;
    }, 0);

    // Create order
    const order = await prisma.order.create({
      data: {
        userId: session.user.id!,
        totalAmount,
        status: "PENDING",
        items: {
          create: items.map((item) => {
            const game = games.find((g) => g.id === item.gameId)!;
            return {
              gameId: item.gameId,
              price: game.price,
              quantity: item.quantity,
            };
          }),
        },
      },
    });

    // Reserve keys atomically
    for (const item of items) {
      await reserveKeys(item.gameId, item.quantity, order.id);
    }

    // Create Mercado Pago preference
    const preference = await createPreference(
      games.map((game) => {
        const item = items.find((i) => i.gameId === game.id)!;
        return {
          id: game.id,
          title: game.title,
          quantity: item.quantity,
          unit_price: Number(game.price),
        };
      }),
      order.id,
      session.user.email
    );

    // Save preference ID
    await prisma.order.update({
      where: { id: order.id },
      data: { mpPreferenceId: preference.id },
    });

    return NextResponse.json({
      preferenceId: preference.id,
      initPoint: preference.init_point,
      sandboxInitPoint: preference.sandbox_init_point,
      orderId: order.id,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal error";

    if (message === "INSUFFICIENT_STOCK") {
      return new NextResponse("Estoque insuficiente de keys", { status: 409 });
    }

    console.error("[CHECKOUT_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
