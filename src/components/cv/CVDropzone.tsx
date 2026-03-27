"use client";

import { useRef, useState, DragEvent, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileText, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface CVDropzoneProps {
  onAnalyze: (file: File) => void;
  loading: boolean;
}

export default function CVDropzone({ onAnalyze, loading }: CVDropzoneProps) {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped?.type === "application/pdf") setFile(dropped);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) setFile(selected);
  };

  return (
    <div className="space-y-4">
      <div
        onClick={() => !file && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "border-2 border-dashed rounded-xl p-10 text-center transition-colors cursor-pointer",
          dragging ? "border-primary bg-primary/5" : "border-muted-foreground/30 hover:border-primary/50",
          file && "border-green-500 bg-green-50 dark:bg-green-950/20"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={handleChange}
        />
        {file ? (
          <div className="flex flex-col items-center gap-2">
            <FileText className="h-10 w-10 text-green-600" />
            <p className="font-medium">{file.name}</p>
            <p className="text-sm text-muted-foreground">
              {(file.size / 1024).toFixed(1)} KB
            </p>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setFile(null); }}
              className="text-muted-foreground hover:text-destructive mt-1"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Upload className="h-10 w-10" />
            <p className="font-medium">Drop your CV here or click to browse</p>
            <p className="text-sm">PDF only, max 10MB</p>
          </div>
        )}
      </div>

      <Button
        disabled={!file || loading}
        onClick={() => file && onAnalyze(file)}
        className="w-full"
        size="lg"
      >
        {loading ? "Analyzing..." : "Analyze CV"}
      </Button>
    </div>
  );
}
