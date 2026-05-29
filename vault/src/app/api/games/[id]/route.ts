import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { gameSchema } from "@/lib/validations/game";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const game = await prisma.game.findUnique({
      where: { id },
      include: {
        _count: { select: { keys: { where: { status: "AVAILABLE" } } } },
      },
    });

    if (!game) {
      return new NextResponse("Game not found", { status: 404 });
    }

    return NextResponse.json(game);
  } catch (error) {
    console.error("[GAME_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const validatedData = gameSchema.partial().parse(body);

    const game = await prisma.game.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json(game);
  } catch (error) {
    console.error("[GAME_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;

    // Soft delete
    await prisma.game.update({
      where: { id },
      data: { active: false },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[GAME_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
