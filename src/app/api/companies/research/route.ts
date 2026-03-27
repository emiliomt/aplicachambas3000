import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { researchCompany } from "@/lib/anthropic";
import { scrapeCompanyPage } from "@/lib/scraper";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { companyName, websiteUrl } = body;

    if (!companyName) {
      return NextResponse.json(
        { error: "companyName is required" },
        { status: 400 }
      );
    }

    let scrapedContent: string | undefined;
    if (websiteUrl) {
      scrapedContent = await scrapeCompanyPage(websiteUrl);
    }

    const research = await researchCompany({
      companyName,
      websiteUrl,
      scrapedContent,
    });

    const record = await prisma.companyResearch.create({
      data: {
        companyName,
        websiteUrl: websiteUrl || null,
        researchData: JSON.stringify(research),
      },
    });

    return NextResponse.json({ ...record, research });
  } catch (err) {
    console.error("[companies/research]", err);
    return NextResponse.json(
      { error: "Failed to research company" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const records = await prisma.companyResearch.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
  });
  return NextResponse.json(
    records.map((r) => ({
      ...r,
      research: JSON.parse(r.researchData),
    }))
  );
}
