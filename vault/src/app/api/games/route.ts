import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { gameSchema } from "@/lib/validations/game";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const genre = searchParams.get("genre");
    
    const games = await prisma.game.findMany({
      where: {
        active: true,
        ...(search && {
          title: { contains: search, mode: "insensitive" },
        }),
        ...(genre && {
          genres: { has: genre },
        }),
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(games);
  } catch (error) {
    console.error("[GAMES_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    
    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const validatedData = gameSchema.parse(body);

    const game = await prisma.game.create({
      data: validatedData,
    });

    return NextResponse.json(game);
  } catch (error) {
    console.error("[GAMES_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
