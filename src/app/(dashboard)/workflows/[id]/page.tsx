"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { WorkflowBuilder } from "@/components/workflows/workflow-builder";
import { LoadingState } from "@/components/shared/loading-state";
import { EmptyState } from "@/components/shared/empty-state";
import { Inbox } from "lucide-react";
import type { WorkflowBlock } from "@/components/workflows/workflow-builder";

export default function EditWorkflowPage() {
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [workflowData, setWorkflowData] = useState<{
    name: string;
    blocks: WorkflowBlock[];
  } | null>(null);

  useEffect(() => {
    if (!params.id) return;

    fetch(`/api/workflows/${params.id}`)
      .then(async (res) => {
        if (res.status === 404) {
          setNotFound(true);
          return null;
        }
        if (!res.ok) throw new Error("Failed to load workflow");
        return res.json();
      })
      .then((data) => {
        if (!data) return;
        const wf = data.workflow;
        const blocks = Array.isArray(wf.steps) ? (wf.steps as WorkflowBlock[]) : [];
        setWorkflowData({ name: wf.name, blocks });
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) return <LoadingState count={3} />;

  if (notFound) {
    return (
      <div className="flex h-[calc(100vh-3.5rem)] items-center justify-center">
        <EmptyState
          icon={Inbox}
          title="Workflow not found"
          description="The workflow you are looking for does not exist or has been deleted."
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[calc(100vh-3.5rem)] items-center justify-center">
        <EmptyState
          icon={Inbox}
          title="Error loading workflow"
          description={error}
        />
      </div>
    );
  }

  return (
    <WorkflowBuilder
      workflowId={params.id as string}
      initialName={workflowData?.name}
      initialBlocks={workflowData?.blocks}
    />
  );
}
