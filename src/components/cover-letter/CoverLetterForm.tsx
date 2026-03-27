"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CVRecord } from "@/types";

interface CoverLetterFormProps {
  cvList: CVRecord[];
  onGenerate: (data: {
    jobTitle: string;
    companyName: string;
    jobDescription: string;
    tone: string;
    cvId?: string;
  }) => void;
  loading: boolean;
}

const tones = ["Professional", "Enthusiastic", "Concise"];

export default function CoverLetterForm({
  cvList,
  onGenerate,
  loading,
}: CoverLetterFormProps) {
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [tone, setTone] = useState("Professional");
  const [cvId, setCvId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate({
      jobTitle,
      companyName,
      jobDescription,
      tone,
      cvId: cvId || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="jobTitle">Job Title</Label>
          <Input
            id="jobTitle"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="e.g. Senior Software Engineer"
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="companyName">Company Name</Label>
          <Input
            id="companyName"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="e.g. Acme Corp"
            required
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="jobDescription">Job Description</Label>
        <Textarea
          id="jobDescription"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the job description here..."
          rows={6}
          required
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Tone</Label>
          <div className="flex gap-2">
            {tones.map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => setTone(t)}
                className={`px-3 py-1.5 rounded-md text-sm border transition-colors ${
                  tone === t
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-input hover:bg-muted"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {cvList.length > 0 && (
          <div className="space-y-1.5">
            <Label htmlFor="cvId">Base on CV (optional)</Label>
            <select
              id="cvId"
              value={cvId}
              onChange={(e) => setCvId(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="">— None —</option>
              {cvList.map((cv) => (
                <option key={cv.id} value={cv.id}>
                  {cv.fileName} (score: {cv.score ?? "?"})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <Button type="submit" disabled={loading} className="w-full" size="lg">
        {loading ? "Generating..." : "Generate Cover Letter"}
      </Button>
    </form>
  );
}
