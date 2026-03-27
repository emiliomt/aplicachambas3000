import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parsePDF } from "@/lib/pdf-parser";
import { analyzeCv } from "@/lib/anthropic";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are supported" },
        { status: 400 }
      );
    }
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large (max 10MB)" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const parsed = await parsePDF(buffer);
    if (!parsed.text.trim()) {
      return NextResponse.json(
        { error: "Could not extract text from PDF" },
        { status: 422 }
      );
    }

    // Save initial record
    const cv = await prisma.cV.create({
      data: {
        fileName: file.name,
        fileSize: file.size,
        rawText: parsed.text,
      },
    });

    // Analyze with Claude
    const feedback = await analyzeCv(parsed.text);

    const updated = await prisma.cV.update({
      where: { id: cv.id },
      data: {
        feedback: JSON.stringify(feedback),
        score: feedback.score,
      },
    });

    return NextResponse.json({
      id: updated.id,
      fileName: updated.fileName,
      score: updated.score,
      feedback,
    });
  } catch (err) {
    console.error("[cv/upload]", err);
    return NextResponse.json(
      { error: "Failed to process CV" },
      { status: 500 }
    );
  }
}
