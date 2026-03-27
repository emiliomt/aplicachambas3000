import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { scrapeJob } from "@/lib/scraper";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function GET() {
  const jobs = await prisma.jobOpportunity.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(jobs);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: "url is required" }, { status: 400 });
    }

    let scraped = {};
    try {
      scraped = await scrapeJob(url);
    } catch (scrapeErr) {
      console.warn("[jobs] scrape failed, saving URL only:", scrapeErr);
    }

    const job = await prisma.jobOpportunity.create({
      data: {
        sourceUrl: url,
        scrapedAt: new Date(),
        ...scraped,
      },
    });

    return NextResponse.json(job, { status: 201 });
  } catch (err) {
    console.error("[jobs POST]", err);
    return NextResponse.json(
      { error: "Failed to save job" },
      { status: 500 }
    );
  }
}
