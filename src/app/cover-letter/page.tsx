"use client";

import { useState, useEffect, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CoverLetterForm from "@/components/cover-letter/CoverLetterForm";
import CoverLetterOutput from "@/components/cover-letter/CoverLetterOutput";
import QAPanel from "@/components/cover-letter/QAPanel";
import { CoverLetterRecord, QASessionRecord, CVRecord } from "@/types";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function CoverLetterPage() {
  const [cvList] = useState<CVRecord[]>([]);
  const [letterHistory, setLetterHistory] = useState<CoverLetterRecord[]>([]);
  const [qaHistory, setQaHistory] = useState<QASessionRecord[]>([]);
  const [currentLetter, setCurrentLetter] = useState<CoverLetterRecord | null>(null);
  const [generatingLetter, setGeneratingLetter] = useState(false);
  const [answeringQA, setAnsweringQA] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);

  const fetchHistory = useCallback(async () => {
    const [lettersRes, qaRes] = await Promise.all([
      fetch("/api/cover-letter/generate"),
      fetch("/api/qa/answer"),
    ]);
    const [letters, qa] = await Promise.all([lettersRes.json(), qaRes.json()]);
    setLetterHistory(letters);
    setQaHistory(qa);
    setHistoryLoading(false);
  }, []);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  const generateLetter = async (data: {
    jobTitle: string;
    companyName: string;
    jobDescription: string;
    tone: string;
    cvId?: string;
  }) => {
    setGeneratingLetter(true);
    try {
      const res = await fetch("/api/cover-letter/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      const record: CoverLetterRecord = await res.json();
      setCurrentLetter(record);
      setLetterHistory((prev) => [record, ...prev]);
      toast.success("Cover letter generated!");
    } catch {
      toast.error("Failed to generate cover letter");
    } finally {
      setGeneratingLetter(false);
    }
  };

  const answerQuestion = async (data: {
    question: string;
    context?: string;
    cvId?: string;
  }) => {
    setAnsweringQA(true);
    try {
      const res = await fetch("/api/qa/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      const record: QASessionRecord = await res.json();
      setQaHistory((prev) => [record, ...prev]);
      toast.success("Answer generated!");
    } catch {
      toast.error("Failed to generate answer");
    } finally {
      setAnsweringQA(false);
    }
  };

  const deleteLetter = async (id: string) => {
    await fetch(`/api/cover-letter/${id}`, { method: "DELETE" });
    setLetterHistory((prev) => prev.filter((l) => l.id !== id));
    if (currentLetter?.id === id) setCurrentLetter(null);
    toast.success("Letter deleted");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Cover Letter & Q&A</h1>
        <p className="text-muted-foreground mt-1">
          Generate tailored cover letters and answer application questions with AI.
        </p>
      </div>

      <Tabs defaultValue="cover-letter">
        <TabsList className="w-full">
          <TabsTrigger value="cover-letter" className="flex-1">Cover Letter</TabsTrigger>
          <TabsTrigger value="qa" className="flex-1">Application Q&A</TabsTrigger>
        </TabsList>

        <TabsContent value="cover-letter" className="space-y-6 mt-4">
          <CoverLetterForm
            cvList={cvList}
            onGenerate={generateLetter}
            loading={generatingLetter}
          />

          {generatingLetter && (
            <Skeleton className="h-64 rounded-xl" />
          )}

          {!generatingLetter && currentLetter && (
            <CoverLetterOutput
              letter={currentLetter.generatedLetter}
              jobTitle={currentLetter.jobTitle}
              companyName={currentLetter.companyName}
            />
          )}

          {historyLoading ? (
            <Skeleton className="h-20 rounded-xl" />
          ) : letterHistory.length > 0 && (
            <div className="space-y-2 pt-4 border-t">
              <h2 className="font-semibold text-sm text-muted-foreground">History</h2>
              {letterHistory.map((letter) => (
                <Card
                  key={letter.id}
                  className={`cursor-pointer transition-colors ${
                    currentLetter?.id === letter.id ? "border-primary" : "hover:border-muted-foreground/50"
                  }`}
                  onClick={() => setCurrentLetter(letter)}
                >
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        {letter.jobTitle} @ {letter.companyName}
                        <span className="text-muted-foreground font-normal text-xs">
                          {new Date(letter.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => { e.stopPropagation(); deleteLetter(letter.id); }}
                        className="text-muted-foreground hover:text-destructive h-7 w-7 p-0"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="qa" className="mt-4">
          <QAPanel
            cvList={cvList}
            onAnswer={answerQuestion}
            loading={answeringQA}
            history={qaHistory}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
