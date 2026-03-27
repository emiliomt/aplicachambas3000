"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QASessionRecord, CVRecord } from "@/types";
import { MessageSquare } from "lucide-react";

interface QAPanelProps {
  cvList: CVRecord[];
  onAnswer: (data: { question: string; context?: string; cvId?: string }) => void;
  loading: boolean;
  history: QASessionRecord[];
}

export default function QAPanel({ cvList, onAnswer, loading, history }: QAPanelProps) {
  const [question, setQuestion] = useState("");
  const [context, setContext] = useState("");
  const [cvId, setCvId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    onAnswer({ question, context: context || undefined, cvId: cvId || undefined });
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="question">Application Question</Label>
          <Textarea
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder='e.g. "Tell me about a challenge you overcame at work."'
            rows={3}
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="context">Additional Context (optional)</Label>
          <Textarea
            id="context"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="Any specific experience or angle you want to highlight..."
            rows={2}
          />
        </div>

        {cvList.length > 0 && (
          <div className="space-y-1.5">
            <Label htmlFor="qa-cvId">Base on CV (optional)</Label>
            <select
              id="qa-cvId"
              value={cvId}
              onChange={(e) => setCvId(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="">— None —</option>
              {cvList.map((cv) => (
                <option key={cv.id} value={cv.id}>
                  {cv.fileName}
                </option>
              ))}
            </select>
          </div>
        )}

        <Button type="submit" disabled={loading} className="w-full" size="lg">
          {loading ? "Generating answer..." : "Get Answer"}
        </Button>
      </form>

      {history.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-medium text-sm text-muted-foreground">Recent Q&A</h3>
          {history.map((session) => (
            <Card key={session.id}>
              <CardHeader className="pb-1">
                <CardTitle className="text-sm flex items-center gap-2 text-muted-foreground">
                  <MessageSquare className="h-3.5 w-3.5" />
                  {session.question}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {session.answer}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
