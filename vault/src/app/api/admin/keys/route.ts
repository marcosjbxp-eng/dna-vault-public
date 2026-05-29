import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { keyUploadSchema } from "@/lib/validations/game";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { gameId, keys } = keyUploadSchema.parse(body);

    // Deduplication: filter out keys that already exist
    const existingKeys = await prisma.key.findMany({
      where: { code: { in: keys } },
      select: { code: true },
    });
    const existingCodes = new Set(existingKeys.map((k) => k.code));
    const newKeys = keys.filter((k) => !existingCodes.has(k));

    if (newKeys.length === 0) {
      return NextResponse.json({
        created: 0,
        duplicates: keys.length,
        message: "Todas as keys já existem",
      });
    }

    const result = await prisma.key.createMany({
      data: newKeys.map((code) => ({
        code: code.trim(),
        gameId,
        status: "AVAILABLE" as const,
      })),
    });

    return NextResponse.json({
      created: result.count,
      duplicates: keys.length - newKeys.length,
      message: `${result.count} keys adicionadas com sucesso`,
    });
  } catch (error) {
    console.error("[KEYS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
