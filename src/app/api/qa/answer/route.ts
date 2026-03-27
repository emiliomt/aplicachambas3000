import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { answerApplicationQuestion } from "@/lib/anthropic";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { question, context, cvId } = body;

    if (!question) {
      return NextResponse.json(
        { error: "question is required" },
        { status: 400 }
      );
    }

    let cvText: string | undefined;
    if (cvId) {
      const cv = await prisma.cV.findUnique({ where: { id: cvId } });
      cvText = cv?.rawText;
    }

    const answer = await answerApplicationQuestion({ question, context, cvText });

    const session = await prisma.qASession.create({
      data: { cvId: cvId || null, question, context: context || null, answer },
    });

    return NextResponse.json(session);
  } catch (err) {
    console.error("[qa/answer]", err);
    return NextResponse.json(
      { error: "Failed to generate answer" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const sessions = await prisma.qASession.findMany({
    orderBy: { createdAt: "desc" },
    take: 30,
  });
  return NextResponse.json(sessions);
}
