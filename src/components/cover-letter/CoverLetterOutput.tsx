"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Check, Download } from "lucide-react";

interface CoverLetterOutputProps {
  letter: string;
  jobTitle: string;
  companyName: string;
}

export default function CoverLetterOutput({
  letter,
  jobTitle,
  companyName,
}: CoverLetterOutputProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(letter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const download = () => {
    const blob = new Blob([letter], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cover-letter-${companyName.replace(/\s+/g, "-").toLowerCase()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-base">
          {jobTitle} @ {companyName}
        </CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={copy}>
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            <span className="ml-1 text-xs">{copied ? "Copied!" : "Copy"}</span>
          </Button>
          <Button variant="outline" size="sm" onClick={download}>
            <Download className="h-3.5 w-3.5" />
            <span className="ml-1 text-xs">Download</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="whitespace-pre-wrap text-sm leading-relaxed bg-muted/30 rounded-lg p-4">
          {letter}
        </div>
      </CardContent>
    </Card>
  );
}
