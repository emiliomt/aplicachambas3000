"use client";

import { CVFeedback } from "@/types";
import { CheckCircle2, AlertCircle, Lightbulb, Tag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CVFeedbackDisplayProps {
  feedback: CVFeedback;
}

export default function CVFeedbackDisplay({ feedback }: CVFeedbackDisplayProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{feedback.summary}</p>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2 text-green-600">
              <CheckCircle2 className="h-4 w-4" /> Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {feedback.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-green-500 mt-0.5">•</span>
                  {s}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2 text-amber-600">
              <AlertCircle className="h-4 w-4" /> Weaknesses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {feedback.weaknesses.map((w, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-amber-500 mt-0.5">•</span>
                  {w}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2 text-blue-600">
            <Lightbulb className="h-4 w-4" /> Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {feedback.suggestions.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="text-blue-500 mt-0.5 font-bold">{i + 1}.</span>
                {s}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {(feedback.ats_keywords_present?.length > 0 ||
        feedback.ats_keywords_missing?.length > 0) && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Tag className="h-4 w-4" /> ATS Keywords
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {feedback.ats_keywords_present?.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-1.5">Present</p>
                <div className="flex flex-wrap gap-1.5">
                  {feedback.ats_keywords_present.map((k, i) => (
                    <Badge key={i} variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      {k}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {feedback.ats_keywords_missing?.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-1.5">Missing</p>
                <div className="flex flex-wrap gap-1.5">
                  {feedback.ats_keywords_missing.map((k, i) => (
                    <Badge key={i} variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                      {k}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
