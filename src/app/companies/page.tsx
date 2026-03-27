"use client";

import { useState, useEffect, useCallback } from "react";
import CompanySearchForm from "@/components/companies/CompanySearchForm";
import CompanyResearchCard from "@/components/companies/CompanyResearchCard";
import { CompanyResearchRecord } from "@/types";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2 } from "lucide-react";

export default function CompaniesPage() {
  const [history, setHistory] = useState<CompanyResearchRecord[]>([]);
  const [selected, setSelected] = useState<CompanyResearchRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);

  const fetchHistory = useCallback(async () => {
    const res = await fetch("/api/companies/research");
    const data = await res.json();
    setHistory(data);
    setHistoryLoading(false);
  }, []);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  const search = async (data: { companyName: string; websiteUrl?: string }) => {
    setLoading(true);
    try {
      const res = await fetch("/api/companies/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      const record: CompanyResearchRecord = await res.json();
      setSelected(record);
      setHistory((prev) => [record, ...prev]);
      toast.success(`Research complete for ${data.companyName}`);
    } catch {
      toast.error("Failed to research company");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Company Research</h1>
        <p className="text-muted-foreground mt-1">
          Learn everything about a company before you apply or interview.
        </p>
      </div>

      <CompanySearchForm onSearch={search} loading={loading} />

      {loading && (
        <div className="space-y-4">
          <Skeleton className="h-32 rounded-xl" />
          <div className="grid md:grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-36 rounded-xl" />
            ))}
          </div>
        </div>
      )}

      {!loading && selected && (
        <CompanyResearchCard
          companyName={selected.companyName}
          research={selected.research}
        />
      )}

      {!historyLoading && history.length > 0 && (
        <div className="space-y-2 pt-4 border-t">
          <h2 className="font-semibold text-sm text-muted-foreground">Research History</h2>
          {history.map((record) => (
            <Card
              key={record.id}
              className={`cursor-pointer transition-colors ${
                selected?.id === record.id
                  ? "border-primary"
                  : "hover:border-muted-foreground/50"
              }`}
              onClick={() => setSelected(record)}
            >
              <CardHeader className="py-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  {record.companyName}
                  <span className="text-muted-foreground font-normal text-xs">
                    {new Date(record.createdAt).toLocaleDateString()}
                  </span>
                </CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
