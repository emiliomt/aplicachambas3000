"use client";

import { useState } from "react";
import { JobRecord, JobStatus } from "@/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, DollarSign, ExternalLink, FileText, Trash2 } from "lucide-react";

const statusColors: Record<JobStatus, string> = {
  saved: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  applied: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  interviewing: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  offer: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  rejected: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
};

const statuses: JobStatus[] = ["saved", "applied", "interviewing", "offer", "rejected"];

interface JobCardProps {
  job: JobRecord;
  onStatusChange: (id: string, status: JobStatus) => void;
  onNotesChange: (id: string, notes: string) => void;
  onDelete: (id: string) => void;
}

export default function JobCard({
  job,
  onStatusChange,
  onNotesChange,
  onDelete,
}: JobCardProps) {
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState(job.notes || "");
  const [saving, setSaving] = useState(false);

  const saveNotes = async () => {
    setSaving(true);
    await onNotesChange(job.id, notes);
    setSaving(false);
  };

  return (
    <>
      <Card
        className="cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => setOpen(true)}
      >
        <CardHeader className="pb-2 space-y-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="font-semibold text-sm leading-snug truncate">
                {job.title || "Untitled Position"}
              </p>
              <p className="text-sm text-muted-foreground truncate">
                {job.company || "Unknown Company"}
              </p>
            </div>
            <Badge
              className={`shrink-0 text-xs border-0 ${statusColors[job.status as JobStatus] || statusColors.saved}`}
            >
              {job.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-1.5 pt-0">
          {job.location && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {job.location}
            </div>
          )}
          {job.salaryRange && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <DollarSign className="h-3 w-3" />
              {job.salaryRange}
            </div>
          )}
          {job.notes && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <FileText className="h-3 w-3" />
              Has notes
            </div>
          )}
          <p className="text-xs text-muted-foreground pt-1">
            Added {new Date(job.createdAt).toLocaleDateString()}
          </p>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{job.title || "Job Details"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2 text-sm">
              {job.company && <span className="font-medium">{job.company}</span>}
              {job.location && (
                <span className="text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" /> {job.location}
                </span>
              )}
              {job.salaryRange && (
                <span className="text-muted-foreground">{job.salaryRange}</span>
              )}
              {job.jobType && <Badge variant="secondary">{job.jobType}</Badge>}
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium">Status:</span>
              {statuses.map((s) => (
                <button
                  key={s}
                  onClick={() => onStatusChange(job.id, s)}
                  className={`px-2 py-0.5 rounded text-xs border transition-colors ${
                    job.status === s
                      ? statusColors[s] + " border-transparent"
                      : "border-input hover:bg-muted"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            {job.description && (
              <div>
                <p className="text-sm font-medium mb-1">Description</p>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto bg-muted/30 rounded p-3">
                  {job.description}
                </p>
              </div>
            )}

            {job.requirements && (
              <div>
                <p className="text-sm font-medium mb-1">Requirements</p>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto bg-muted/30 rounded p-3">
                  {job.requirements}
                </p>
              </div>
            )}

            <div>
              <p className="text-sm font-medium mb-1">Notes</p>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add your notes here..."
                rows={3}
              />
              <Button
                size="sm"
                variant="outline"
                className="mt-2"
                onClick={saveNotes}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Notes"}
              </Button>
            </div>

            <div className="flex justify-between items-center pt-2 border-t">
              <a
                href={job.applicationUrl || job.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline flex items-center gap-1"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                View Original Listing
              </a>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  onDelete(job.id);
                  setOpen(false);
                }}
              >
                <Trash2 className="h-3.5 w-3.5 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
