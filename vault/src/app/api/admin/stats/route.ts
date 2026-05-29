import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const [
      totalGames,
      totalKeysAvailable,
      keysDeliveredToday,
      totalRevenueAgg,
      monthRevenueAgg,
      recentOrders,
    ] = await Promise.all([
      prisma.game.count({ where: { active: true } }),
      prisma.key.count({ where: { status: "AVAILABLE" } }),
      prisma.key.count({
        where: {
          status: "DELIVERED",
          usedAt: { gte: startOfDay },
        },
      }),
      prisma.order.aggregate({
        where: { status: "DELIVERED" },
        _sum: { totalAmount: true },
      }),
      prisma.order.aggregate({
        where: {
          status: "DELIVERED",
          createdAt: { gte: startOfMonth },
        },
        _sum: { totalAmount: true },
      }),
      prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { name: true, email: true } },
          items: { include: { game: { select: { title: true } } } },
        },
      }),
    ]);

    return NextResponse.json({
      totalGames,
      totalKeysAvailable,
      keysDeliveredToday,
      totalRevenue: Number(totalRevenueAgg._sum.totalAmount ?? 0),
      monthRevenue: Number(monthRevenueAgg._sum.totalAmount ?? 0),
      recentOrders,
    });
  } catch (error) {
    console.error("[STATS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
