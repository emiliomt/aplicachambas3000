"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

interface JobURLInputProps {
  onAdd: (url: string) => void;
  loading: boolean;
}

export default function JobURLInput({ onAdd, loading }: JobURLInputProps) {
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    onAdd(url.trim());
    setUrl("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Paste a job listing URL (LinkedIn, Greenhouse, Lever, etc.)"
        required
        className="flex-1"
      />
      <Button type="submit" disabled={loading} className="shrink-0">
        <Plus className="h-4 w-4 mr-1" />
        {loading ? "Saving..." : "Track Job"}
      </Button>
    </form>
  );
}
