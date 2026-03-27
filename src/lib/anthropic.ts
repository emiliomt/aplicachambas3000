import Anthropic from "@anthropic-ai/sdk";

const globalForAnthropic = globalThis as unknown as {
  anthropic: Anthropic | undefined;
};

export const anthropic =
  globalForAnthropic.anthropic ??
  new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

if (process.env.NODE_ENV !== "production")
  globalForAnthropic.anthropic = anthropic;

// ─── CV Feedback ─────────────────────────────────────────────────────────────

export async function analyzeCv(rawText: string): Promise<{
  score: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  ats_keywords_missing: string[];
  ats_keywords_present: string[];
}> {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1500,
    messages: [
      {
        role: "user",
        content: `You are a professional career coach and HR expert with 15+ years of experience reviewing CVs for top-tier companies. Analyze the following CV and return a JSON object with this exact structure:
{
  "score": <integer 0-100>,
  "summary": "<2-3 sentence overall assessment>",
  "strengths": ["<strength 1>", "<strength 2>"],
  "weaknesses": ["<weakness 1>", "<weakness 2>"],
  "suggestions": ["<actionable suggestion 1>", "<actionable suggestion 2>"],
  "ats_keywords_missing": ["<keyword>"],
  "ats_keywords_present": ["<keyword>"]
}

Scoring guide: 90-100 exceptional, 70-89 strong, 50-69 average, below 50 needs major revision.

CV TEXT:
---
${rawText}
---

Return ONLY the JSON object, no additional text.`,
      },
    ],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";
  return JSON.parse(text);
}

// ─── Cover Letter ─────────────────────────────────────────────────────────────

export async function generateCoverLetter(params: {
  jobTitle: string;
  companyName: string;
  jobDescription: string;
  tone: string;
  cvText?: string;
}): Promise<string> {
  const cvSection = params.cvText
    ? `\nCandidate Background:\n---\n${params.cvText.slice(0, 3000)}\n---`
    : "";

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 800,
    messages: [
      {
        role: "user",
        content: `You are an expert cover letter writer who creates compelling, personalized cover letters that get interviews. Write in a natural, human voice — never generic or robotic.

Write a professional cover letter for the following position.

Job Title: ${params.jobTitle}
Company: ${params.companyName}
Tone: ${params.tone}

Job Description:
---
${params.jobDescription}
---
${cvSection}

Requirements:
- 3-4 paragraphs, max 400 words
- Opening: hook that shows genuine interest, mention something specific about the company
- Middle: connect 2-3 specific experiences/skills to the job requirements
- Closing: clear call to action
- Do NOT use phrases like "I am writing to express my interest" or "I am a perfect fit"
- Sound like a real human, not a template
- Match the requested tone: ${params.tone}

Return ONLY the cover letter text, ready to copy-paste.`,
      },
    ],
  });

  return response.content[0].type === "text" ? response.content[0].text : "";
}

// ─── Q&A ─────────────────────────────────────────────────────────────────────

export async function answerApplicationQuestion(params: {
  question: string;
  context?: string;
  cvText?: string;
}): Promise<string> {
  const contextSection = params.context
    ? `\nAdditional context:\n${params.context}`
    : "";
  const cvSection = params.cvText
    ? `\nCandidate background:\n${params.cvText.slice(0, 2000)}`
    : "";

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 400,
    messages: [
      {
        role: "user",
        content: `You are a career coach helping a job candidate answer application questions strategically and authentically.

Answer the following job application question.

Question: ${params.question}
${contextSection}
${cvSection}

Guidelines:
- Use the STAR method (Situation, Task, Action, Result) where applicable
- Keep the answer between 100-200 words
- Sound genuine and specific, not generic
- If candidate background is provided, ground the answer in their actual experience
- If no specific experience is available, provide a framework answer with clear [CUSTOMIZE THIS] placeholders

Return only the answer text.`,
      },
    ],
  });

  return response.content[0].type === "text" ? response.content[0].text : "";
}

// ─── Company Research ─────────────────────────────────────────────────────────

export async function researchCompany(params: {
  companyName: string;
  websiteUrl?: string;
  scrapedContent?: string;
}): Promise<{
  overview: {
    mission: string;
    industry: string;
    size: string;
    founded: string;
    headquarters: string;
  };
  products_services: string[];
  culture_values: string[];
  interview_tips: string[];
  talking_points: string[];
  questions_to_ask: string[];
  watch_out_for: string[];
}> {
  const websiteSection = params.scrapedContent
    ? `\nWebsite/About page content:\n${params.scrapedContent.slice(0, 3000)}`
    : params.websiteUrl
    ? `\nWebsite URL: ${params.websiteUrl}`
    : "";

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 2000,
    messages: [
      {
        role: "user",
        content: `You are a business analyst and career advisor helping job candidates prepare for interviews.

Research and analyze the following company for a job candidate who is preparing to interview or apply there.

Company Name: ${params.companyName}
${websiteSection}

Return a JSON object with this exact structure:
{
  "overview": {
    "mission": "<mission statement or inferred mission>",
    "industry": "<industry/sector>",
    "size": "<estimated company size>",
    "founded": "<founding year if known>",
    "headquarters": "<location>"
  },
  "products_services": ["<product/service 1>"],
  "culture_values": ["<value or culture point 1>"],
  "interview_tips": ["<specific tip 1>"],
  "talking_points": ["<compelling point to mention in interview>"],
  "questions_to_ask": ["<question candidate should ask interviewer>"],
  "watch_out_for": ["<potential concern or red flag>"]
}

Use your training knowledge about this company. If unsure about specific facts, note uncertainty with "(estimated)" or "(unverified)".

Return ONLY the JSON object.`,
      },
    ],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";
  return JSON.parse(text);
}
