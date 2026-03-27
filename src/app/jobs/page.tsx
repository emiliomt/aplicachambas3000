"use client";

import { useState, useEffect, useCallback } from "react";
import JobURLInput from "@/components/jobs/JobURLInput";
import JobCard from "@/components/jobs/JobCard";
import { JobRecord, JobStatus } from "@/types";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Briefcase } from "lucide-react";

const filters: { label: string; value: string }[] = [
  { label: "All", value: "all" },
  { label: "Saved", value: "saved" },
  { label: "Applied", value: "applied" },
  { label: "Interviewing", value: "interviewing" },
  { label: "Offer", value: "offer" },
  { label: "Rejected", value: "rejected" },
];

export default function JobsPage() {
  const [jobs, setJobs] = useState<JobRecord[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const fetchJobs = useCallback(async () => {
    const res = await fetch("/api/jobs");
    const data = await res.json();
    setJobs(data);
    setInitialLoading(false);
  }, []);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  const addJob = async (url: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      if (!res.ok) throw new Error();
      const job = await res.json();
      setJobs((prev) => [job, ...prev]);
      toast.success("Job tracked!", {
        description: job.title || "Job saved successfully",
      });
    } catch {
      toast.error("Failed to track job");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: JobStatus) => {
    await fetch(`/api/jobs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setJobs((prev) =>
      prev.map((j) => (j.id === id ? { ...j, status } : j))
    );
    toast.success(`Status updated to "${status}"`);
  };

  const handleNotesChange = async (id: string, notes: string) => {
    await fetch(`/api/jobs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes }),
    });
    setJobs((prev) =>
      prev.map((j) => (j.id === id ? { ...j, notes } : j))
    );
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/jobs/${id}`, { method: "DELETE" });
    setJobs((prev) => prev.filter((j) => j.id !== id));
    toast.success("Job removed");
  };

  const filtered =
    filter === "all" ? jobs : jobs.filter((j) => j.status === filter);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Job Tracker</h1>
        <p className="text-muted-foreground mt-1">
          Save job listings and track your application progress.
        </p>
      </div>

      <JobURLInput onAdd={addJob} loading={loading} />

      <div className="flex gap-2 flex-wrap">
        {filters.map((f) => {
          const count = f.value === "all"
            ? jobs.length
            : jobs.filter((j) => j.status === f.value).length;
          return (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                filter === f.value
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-input hover:bg-muted"
              }`}
            >
              {f.label}
              {count > 0 && (
                <span className="ml-1.5 text-xs opacity-70">({count})</span>
              )}
            </button>
          );
        })}
      </div>

      {initialLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-36 rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Briefcase className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>
            {filter === "all"
              ? "No jobs tracked yet. Paste a job URL above to get started."
              : `No jobs with status "${filter}".`}
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onStatusChange={handleStatusChange}
              onNotesChange={handleNotesChange}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
