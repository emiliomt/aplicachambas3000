import * as cheerio from "cheerio";

export interface ScrapedJob {
  title?: string;
  company?: string;
  location?: string;
  salaryRange?: string;
  jobType?: string;
  description?: string;
  requirements?: string;
  applicationUrl?: string;
}

async function fetchPage(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; JobTrackerBot/1.0; +https://aplicachambas.app)",
      Accept: "text/html,application/xhtml+xml",
    },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`);
  return response.text();
}

function extractJsonLd(
  $: cheerio.CheerioAPI
): Record<string, unknown> | null {
  try {
    const scripts = $('script[type="application/ld+json"]');
    for (let i = 0; i < scripts.length; i++) {
      const raw = $(scripts[i]).html();
      if (!raw) continue;
      const parsed = JSON.parse(raw);
      if (
        parsed["@type"] === "JobPosting" ||
        (Array.isArray(parsed) &&
          parsed.some((p: Record<string, unknown>) => p["@type"] === "JobPosting"))
      ) {
        return Array.isArray(parsed) ? parsed[0] : parsed;
      }
    }
  } catch {
    // ignore parse errors
  }
  return null;
}

export async function scrapeJob(url: string): Promise<ScrapedJob> {
  const html = await fetchPage(url);
  const $ = cheerio.load(html);

  // 1. Try JSON-LD structured data
  const jsonLd = extractJsonLd($);
  if (jsonLd) {
    const hiringOrg = jsonLd["hiringOrganization"] as Record<string, unknown> | undefined;
    const jobLocation = jsonLd["jobLocation"] as Record<string, unknown> | undefined;
    const address = jobLocation?.["address"] as Record<string, unknown> | undefined;
    const baseSalary = jsonLd["baseSalary"] as Record<string, unknown> | undefined;
    const salaryValue = baseSalary?.["value"] as Record<string, unknown> | undefined;

    return {
      title: (jsonLd["title"] as string) || (jsonLd["name"] as string) || undefined,
      company:
        typeof hiringOrg === "string"
          ? hiringOrg
          : (hiringOrg?.["name"] as string) || undefined,
      location:
        typeof address === "string"
          ? address
          : (address?.["addressLocality"] as string) || undefined,
      salaryRange: salaryValue
        ? `${salaryValue["minValue"] || ""} - ${salaryValue["maxValue"] || ""} ${baseSalary?.["currency"] || ""}`.trim()
        : undefined,
      jobType: (jsonLd["employmentType"] as string) || undefined,
      description: (jsonLd["description"] as string)?.slice(0, 5000) || undefined,
      requirements: (jsonLd["qualifications"] as string) || undefined,
      applicationUrl: (jsonLd["url"] as string) || url,
    };
  }

  // 2. OpenGraph / meta tags
  const ogTitle =
    $('meta[property="og:title"]').attr("content") ||
    $('meta[name="title"]').attr("content");

  // 3. Heuristic cheerio parsing
  const title =
    ogTitle ||
    $("h1").first().text().trim() ||
    $("title").text().replace(/[\|\-–—].*$/, "").trim();

  // Company: look for common patterns
  const company =
    $('[class*="company"]').first().text().trim() ||
    $('[class*="employer"]').first().text().trim() ||
    $('[data-company]').attr("data-company") ||
    undefined;

  // Location
  const location =
    $('[class*="location"]').first().text().trim() ||
    $('[class*="address"]').first().text().trim() ||
    undefined;

  // Salary
  const salary =
    $('[class*="salary"]').first().text().trim() ||
    $('[class*="compensation"]').first().text().trim() ||
    undefined;

  // Description: largest text block near "description" or main content
  let description = "";
  $('[class*="description"], [class*="job-detail"], [id*="description"]').each(
    (_, el) => {
      const text = $(el).text().trim();
      if (text.length > description.length) description = text;
    }
  );
  if (!description) {
    description = $("main").text().trim().slice(0, 5000);
  }

  // Requirements: look for list items near "requirements" heading
  let requirements = "";
  $("h2, h3").each((_, el) => {
    const headingText = $(el).text().toLowerCase();
    if (
      headingText.includes("requirement") ||
      headingText.includes("qualif") ||
      headingText.includes("skill")
    ) {
      const nextList = $(el).nextAll("ul, ol").first();
      if (nextList.length) {
        requirements = nextList.text().trim();
      }
    }
  });

  return {
    title: title || undefined,
    company: company || undefined,
    location: location || undefined,
    salaryRange: salary || undefined,
    description: description.slice(0, 5000) || undefined,
    requirements: requirements || undefined,
    applicationUrl: url,
  };
}

export async function scrapeCompanyPage(url: string): Promise<string> {
  try {
    const html = await fetchPage(url);
    const $ = cheerio.load(html);
    $("script, style, nav, footer, header").remove();
    return $("body").text().replace(/\s+/g, " ").trim().slice(0, 4000);
  } catch {
    return "";
  }
}
