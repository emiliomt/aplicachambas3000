export interface CVFeedback {
  score: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  ats_keywords_missing: string[];
  ats_keywords_present: string[];
}

export interface CVRecord {
  id: string;
  fileName: string;
  fileSize: number;
  score: number | null;
  feedback: CVFeedback | null;
  createdAt: string;
}

export interface CoverLetterRecord {
  id: string;
  cvId: string | null;
  jobTitle: string;
  companyName: string;
  jobDescription: string;
  generatedLetter: string;
  createdAt: string;
}

export interface QASessionRecord {
  id: string;
  cvId: string | null;
  question: string;
  context: string | null;
  answer: string;
  createdAt: string;
}

export interface CompanyResearchData {
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
}

export interface CompanyResearchRecord {
  id: string;
  companyName: string;
  websiteUrl: string | null;
  researchData: string;
  research: CompanyResearchData;
  createdAt: string;
}

export type JobStatus =
  | "saved"
  | "applied"
  | "interviewing"
  | "offer"
  | "rejected";

export interface JobRecord {
  id: string;
  sourceUrl: string;
  title: string | null;
  company: string | null;
  location: string | null;
  salaryRange: string | null;
  jobType: string | null;
  description: string | null;
  requirements: string | null;
  applicationUrl: string | null;
  status: JobStatus;
  notes: string | null;
  scrapedAt: string | null;
  createdAt: string;
  updatedAt: string;
}
