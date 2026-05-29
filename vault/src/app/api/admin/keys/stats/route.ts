import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const games = await prisma.game.findMany({
      where: { active: true },
      select: {
        id: true,
        title: true,
        coverUrl: true,
        keys: {
          select: {
            status: true,
          },
        },
      },
      orderBy: { title: "asc" },
    });

    const stats = games.map((game) => {
      const counts = game.keys.reduce(
        (acc, key) => {
          acc[key.status] = (acc[key.status] || 0) + 1;
          return acc;
        },
        { AVAILABLE: 0, RESERVED: 0, DELIVERED: 0, REFUNDED: 0 } as Record<string, number>
      );

      return {
        id: game.id,
        title: game.title,
        coverUrl: game.coverUrl,
        available: counts.AVAILABLE,
        reserved: counts.RESERVED,
        delivered: counts.DELIVERED,
        refunded: counts.REFUNDED,
        total: game.keys.length,
      };
    });

    return NextResponse.json(stats);
  } catch (error) {
    console.error("[KEYS_STATS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
