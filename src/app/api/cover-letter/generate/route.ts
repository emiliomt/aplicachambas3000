import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateCoverLetter } from "@/lib/anthropic";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { jobTitle, companyName, jobDescription, tone = "Professional", cvId } = body;

    if (!jobTitle || !companyName || !jobDescription) {
      return NextResponse.json(
        { error: "jobTitle, companyName, and jobDescription are required" },
        { status: 400 }
      );
    }

    let cvText: string | undefined;
    if (cvId) {
      const cv = await prisma.cV.findUnique({ where: { id: cvId } });
      cvText = cv?.rawText;
    }

    const generatedLetter = await generateCoverLetter({
      jobTitle,
      companyName,
      jobDescription,
      tone,
      cvText,
    });

    const record = await prisma.coverLetter.create({
      data: {
        cvId: cvId || null,
        jobTitle,
        companyName,
        jobDescription,
        generatedLetter,
      },
    });

    return NextResponse.json(record);
  } catch (err) {
    console.error("[cover-letter/generate]", err);
    return NextResponse.json(
      { error: "Failed to generate cover letter" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const letters = await prisma.coverLetter.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
  });
  return NextResponse.json(letters);
}
