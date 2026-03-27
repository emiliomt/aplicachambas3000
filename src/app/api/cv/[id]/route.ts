import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const cv = await prisma.cV.findUnique({ where: { id } });
    if (!cv) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({
      ...cv,
      feedback: cv.feedback ? JSON.parse(cv.feedback) : null,
    });
  } catch (err) {
    console.error("[cv/[id]]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await prisma.cV.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
