"use client";

import { useEffect, useState } from "react";
import { WorkflowCard } from "@/components/workflows/workflow-card";
import { Inbox, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingState } from "@/components/shared/loading-state";
import Link from "next/link";

export type WorkflowItem = {
  id: string;
  name: string;
  description: string | null;
  status: string;
  runs: number;
  lastRun: string | null;
  createdAt: string;
  updatedAt: string;
  trigger: string | null;
  steps: number;
};

interface WorkflowListProps {
  filter?: string;
}

export function WorkflowList({ filter = "all" }: WorkflowListProps) {
  const [workflows, setWorkflows] = useState<WorkflowItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWorkflows() {
      try {
        const res = await fetch("/api/workflows");
        if (!res.ok) throw new Error("Failed to fetch workflows");
        const data = await res.json();
        setWorkflows(data.workflows);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
    fetchWorkflows();
  }, []);

  function handleDelete(id: string) {
    setWorkflows((prev) => prev.filter((w) => w.id !== id));
  }

  if (loading) return <LoadingState count={4} />;

  if (error) {
    return (
      <EmptyState
        icon={Inbox}
        title="Failed to load workflows"
        description={error}
        action={
          <Button onClick={() => window.location.reload()}>Try again</Button>
        }
      />
    );
  }

  let filtered = workflows;
  if (filter !== "all") {
    filtered = workflows.filter((w) => w.status === filter);
  }

  if (filtered.length === 0) {
    return (
      <EmptyState
        icon={Inbox}
        title="No workflows found"
        description={
          filter !== "all"
            ? `No workflows with status "${filter}".`
            : "Create your first workflow to automate your work."
        }
        action={
          <Button asChild>
            <Link href="/workflows/create">
              <Plus className="mr-2 h-4 w-4" /> Create workflow
            </Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {filtered.map((wf, i) => (
        <WorkflowCard key={wf.id} workflow={wf} index={i} onDelete={handleDelete} />
      ))}
    </div>
  );
}
