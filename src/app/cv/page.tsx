"use client";

import { useState, useEffect, useCallback } from "react";
import CVDropzone from "@/components/cv/CVDropzone";
import CVScoreRing from "@/components/cv/CVScoreRing";
import CVFeedbackDisplay from "@/components/cv/CVFeedbackDisplay";
import { CVRecord } from "@/types";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CVPage() {
  const [cvList, setCvList] = useState<CVRecord[]>([]);
  const [selected, setSelected] = useState<CVRecord | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchCvList = useCallback(async () => {
    // We'll fetch all CVs via direct Prisma calls on the client isn't possible;
    // we need a list endpoint. For now, track locally in state.
  }, []);

  useEffect(() => { fetchCvList(); }, [fetchCvList]);

  const analyze = async (file: File) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/cv/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Upload failed");
      }
      const data = await res.json();
      const newCV: CVRecord = {
        id: data.id,
        fileName: data.fileName,
        fileSize: file.size,
        score: data.score,
        feedback: data.feedback,
        createdAt: new Date().toISOString(),
      };
      setCvList((prev) => [newCV, ...prev]);
      setSelected(newCV);
      toast.success("CV analyzed!", { description: `Score: ${data.score}/100` });
    } catch (err) {
      toast.error("Analysis failed", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteCV = async (id: string) => {
    await fetch(`/api/cv/${id}`, { method: "DELETE" });
    setCvList((prev) => prev.filter((c) => c.id !== id));
    if (selected?.id === id) setSelected(null);
    toast.success("CV removed");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">CV Analyzer</h1>
        <p className="text-muted-foreground mt-1">
          Upload your CV and get AI-powered feedback to improve it.
        </p>
      </div>

      <CVDropzone onAnalyze={analyze} loading={loading} />

      {loading && (
        <div className="space-y-4">
          <div className="flex justify-center">
            <Skeleton className="h-36 w-36 rounded-full" />
          </div>
          <Skeleton className="h-24 rounded-xl" />
          <div className="grid md:grid-cols-2 gap-4">
            <Skeleton className="h-40 rounded-xl" />
            <Skeleton className="h-40 rounded-xl" />
          </div>
          <Skeleton className="h-32 rounded-xl" />
        </div>
      )}

      {!loading && selected && (
        <div className="space-y-6">
          <div className="flex flex-col items-center">
            <CVScoreRing score={selected.score ?? 0} />
            <p className="mt-2 text-sm text-muted-foreground">{selected.fileName}</p>
          </div>
          {selected.feedback && <CVFeedbackDisplay feedback={selected.feedback} />}
        </div>
      )}

      {cvList.length > 0 && (
        <div className="space-y-2 pt-4 border-t">
          <h2 className="font-semibold text-sm text-muted-foreground">Previous Analyses</h2>
          {cvList.map((cv) => (
            <Card
              key={cv.id}
              className={`cursor-pointer transition-colors ${
                selected?.id === cv.id ? "border-primary" : "hover:border-muted-foreground/50"
              }`}
              onClick={() => setSelected(cv)}
            >
              <CardHeader className="py-3">
                <CardTitle className="text-sm flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    {cv.fileName}
                    <span className="text-muted-foreground font-normal">
                      — score: {cv.score ?? "?"}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => { e.stopPropagation(); deleteCV(cv.id); }}
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
    </div>
  );
}
