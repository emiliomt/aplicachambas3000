export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText,
  BookOpen,
  Building2,
  Briefcase,
  ArrowRight,
} from "lucide-react";

async function getStats() {
  const [cvCount, jobCount, letterCount, companyCount] = await Promise.all([
    prisma.cV.count(),
    prisma.jobOpportunity.count(),
    prisma.coverLetter.count(),
    prisma.companyResearch.count(),
  ]);
  const recentJobs = await prisma.jobOpportunity.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, company: true, status: true, createdAt: true },
  });
  return { cvCount, jobCount, letterCount, companyCount, recentJobs };
}

const features = [
  {
    href: "/cv",
    icon: FileText,
    title: "CV Analyzer",
    description:
      "Upload your CV and get detailed AI feedback with an ATS score, strengths, weaknesses, and actionable suggestions.",
    cta: "Analyze My CV",
    color: "text-blue-600",
    bg: "bg-blue-50 dark:bg-blue-950/30",
  },
  {
    href: "/cover-letter",
    icon: BookOpen,
    title: "Cover Letter & Q&A",
    description:
      "Generate tailored cover letters for any job and get answers to application questions using the STAR method.",
    cta: "Generate Cover Letter",
    color: "text-purple-600",
    bg: "bg-purple-50 dark:bg-purple-950/30",
  },
  {
    href: "/companies",
    icon: Building2,
    title: "Company Research",
    description:
      "Learn a company's culture, products, and values. Get interview tips and questions to ask before you apply.",
    cta: "Research a Company",
    color: "text-rose-600",
    bg: "bg-rose-50 dark:bg-rose-950/30",
  },
  {
    href: "/jobs",
    icon: Briefcase,
    title: "Job Tracker",
    description:
      "Paste job listing URLs and we'll scrape and save them. Track your application status from saved to offer.",
    cta: "Track Jobs",
    color: "text-green-600",
    bg: "bg-green-50 dark:bg-green-950/30",
  },
];

const statusVariantMap: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  saved: "secondary",
  applied: "default",
  interviewing: "outline",
  offer: "default",
  rejected: "destructive",
};

export default async function DashboardPage() {
  const stats = await getStats();

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AplicaChambas</h1>
        <p className="text-muted-foreground mt-2 max-w-xl">
          Your all-in-one job application prep hub. Powered by AI to help you
          land the job you want.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "CVs Analyzed", value: stats.cvCount },
          { label: "Jobs Tracked", value: stats.jobCount },
          { label: "Cover Letters", value: stats.letterCount },
          { label: "Companies Researched", value: stats.companyCount },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-5">
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-0.5">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Feature cards */}
      <div className="grid sm:grid-cols-2 gap-4">
        {features.map(({ href, icon: Icon, title, description, cta, color, bg }) => (
          <Card key={href} className="flex flex-col">
            <CardHeader>
              <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center mb-2`}>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <CardTitle className="text-lg">{title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between gap-4">
              <p className="text-sm text-muted-foreground">{description}</p>
              <Link
                href={href}
                className="self-start inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 h-8 text-sm font-medium hover:bg-muted transition-colors"
              >
                {cta}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent jobs */}
      {stats.recentJobs.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Recent Jobs</h2>
            <Link
              href="/jobs"
              className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="space-y-2">
            {stats.recentJobs.map((job) => (
              <Card key={job.id}>
                <CardContent className="py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">
                      {job.title || "Untitled Position"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {job.company || "Unknown Company"} &middot;{" "}
                      {new Date(job.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant={statusVariantMap[job.status] ?? "secondary"}>
                    {job.status}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
