"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CompanySearchFormProps {
  onSearch: (data: { companyName: string; websiteUrl?: string }) => void;
  loading: boolean;
}

export default function CompanySearchForm({ onSearch, loading }: CompanySearchFormProps) {
  const [companyName, setCompanyName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) return;
    onSearch({ companyName, websiteUrl: websiteUrl || undefined });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="companyName">Company Name</Label>
        <Input
          id="companyName"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="e.g. Google, Stripe, Linear..."
          required
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="websiteUrl">Website URL (optional)</Label>
        <Input
          id="websiteUrl"
          type="url"
          value={websiteUrl}
          onChange={(e) => setWebsiteUrl(e.target.value)}
          placeholder="https://company.com"
        />
        <p className="text-xs text-muted-foreground">
          Providing the website lets us scrape the About/Careers page for more accurate info.
        </p>
      </div>
      <Button type="submit" disabled={loading} className="w-full" size="lg">
        {loading ? "Researching..." : "Research Company"}
      </Button>
    </form>
  );
}
