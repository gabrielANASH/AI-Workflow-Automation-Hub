"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import { BuilderHeader } from "@/components/workflows/builder/builder-header";
import { BuilderCanvas } from "@/components/workflows/builder/builder-canvas";
import { BuilderSidebar } from "@/components/workflows/builder/builder-sidebar";
import { BuilderProperties } from "@/components/workflows/builder/builder-properties";
import { cn } from "@/lib/utils";

export type BlockType = "trigger" | "ai_action" | "condition" | "email" | "notification" | "delay";

export interface WorkflowBlock {
  id: string;
  type: BlockType;
  label: string;
  config: Record<string, unknown>;
}

let idCounter = 5;
function generateId() {
  return `block_${++idCounter}`;
}

export const defaultBlocks: WorkflowBlock[] = [
  {
    id: "block_1",
    type: "trigger",
    label: "New ticket created",
    config: { eventType: "ticket.created", source: "zendesk" },
  },
  {
    id: "block_2",
    type: "ai_action",
    label: "Classify and analyze",
    config: { model: "gpt-4o", prompt: "Analyze this ticket:\n{{block_1.ticket}}\n\nReturn ONLY JSON:\n{\n\"priority\":\"high\"\n}", temperature: 0.3, maxTokens: 500 },
  },
  {
    id: "block_3",
    type: "condition",
    label: "High priority?",
    config: { variable: "priority", operator: "equals", value: "high" },
  },
  {
    id: "block_4",
    type: "email",
    label: "Send urgent response",
    config: { to: "{{ticket.contact_email}}", subject: "Re: {{ticket.subject}}", body: "We've escalated your issue." },
  },
  {
    id: "block_5",
    type: "notification",
    label: "Notify support team",
    config: { channel: "slack", message: "New high-priority ticket from {{ticket.contact_name}}" },
  },
];

interface WorkflowBuilderProps {
  workflowId?: string;
  initialName?: string;
  initialBlocks?: WorkflowBlock[];
}

export function WorkflowBuilder({ workflowId, initialName, initialBlocks }: WorkflowBuilderProps) {
  const router = useRouter();
  const isMobile = useMobile();
  const [blocks, setBlocks] = useState<WorkflowBlock[]>(initialBlocks ?? defaultBlocks);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [workflowName, setWorkflowName] = useState(initialName ?? "Customer Support Pipeline");
  const [saving, setSaving] = useState(false);
  const [running, setRunning] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [propertiesOpen, setPropertiesOpen] = useState(false);

  const selectedBlock = blocks.find((b) => b.id === selectedId) ?? null;

  const handleSelect = useCallback((id: string | null) => {
    setSelectedId(id);
    if (id) setPropertiesOpen(true);
  }, []);

  const handleAddBlock = useCallback(
    (type: BlockType, label: string) => {
      const newBlock: WorkflowBlock = {
        id: generateId(),
        type,
        label,
        config: type === "ai_action" ? { model: "gpt-4o" } : {},
      };
      const idx = selectedId ? blocks.findIndex((b) => b.id === selectedId) : blocks.length - 1;
      const insertAt = idx >= 0 ? idx + 1 : blocks.length;
      const next = [...blocks];
      next.splice(insertAt, 0, newBlock);
      setBlocks(next);
      setSelectedId(newBlock.id);
      setPropertiesOpen(true);
      setSidebarOpen(false);
    },
    [blocks, selectedId]
  );

  const handleRemoveBlock = useCallback(
    (id: string) => {
      setBlocks((prev) => prev.filter((b) => b.id !== id));
      if (selectedId === id) {
        setSelectedId(null);
        setPropertiesOpen(false);
      }
    },
    [selectedId]
  );

  const handleReorder = useCallback((reordered: WorkflowBlock[]) => {
    setBlocks(reordered);
  }, []);

  const handleUpdateConfig = useCallback((id: string, config: Record<string, unknown>) => {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, config } : b)));
  }, []);

  const handleSave = useCallback(async () => {
    setSaving(true);

    try {
      const url = workflowId ? `/api/workflows/${workflowId}` : "/api/workflows";
      const method = workflowId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: workflowName,
          steps: blocks,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save workflow");
      }

      setLastSaved(new Date());

      if (!workflowId) {
        const data = await res.json();
        router.push(`/workflows`);
        router.refresh();
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save workflow");
    } finally {
      setSaving(false);
    }
  }, [workflowId, workflowName, blocks, router]);

  const handleRun = useCallback(async () => {
    if (!workflowId) return;
    setRunning(true);
    try {
      const res = await fetch(`/api/workflows/${workflowId}/runs`, { method: "POST" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Request failed (${res.status})`);
      }
      const data = await res.json();
      const runId: string | undefined = data?.run?.id;
      toast.success("Workflow execution started");
      if (runId) router.push(`/runs/${runId}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to run workflow");
    } finally {
      setRunning(false);
    }
  }, [workflowId, router]);

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col">
      <BuilderHeader
        workflowName={workflowName}
        onNameChange={setWorkflowName}
        onSave={handleSave}
        saving={saving}
        lastSaved={lastSaved}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        sidebarOpen={sidebarOpen}
        onRun={workflowId ? handleRun : undefined}
        running={running}
        workflowHasSteps={blocks.length > 0}
      />

      <div className="relative flex flex-1 overflow-hidden">
        {sidebarOpen && isMobile && (
          <div className="absolute inset-0 z-20 bg-background/80 backdrop-blur-sm">
            <BuilderSidebar
              onAddBlock={handleAddBlock}
              onClose={() => setSidebarOpen(false)}
            />
          </div>
        )}

        <div
          className={cn(
            "hidden border-r bg-muted/20 lg:flex lg:w-60 xl:w-72",
            sidebarOpen && "lg:flex"
          )}
        >
          <BuilderSidebar onAddBlock={handleAddBlock} onClose={() => setSidebarOpen(false)} />
        </div>

        <div className="flex-1 overflow-y-auto">
          <BuilderCanvas
            blocks={blocks}
            selectedId={selectedId}
            onSelect={handleSelect}
            onReorder={handleReorder}
            onRemove={handleRemoveBlock}
            onAddBlock={() => setSidebarOpen(true)}
          />
        </div>

        {propertiesOpen && selectedBlock && (
          <BuilderProperties
            block={selectedBlock}
            onUpdateConfig={handleUpdateConfig}
            onClose={() => {
              setPropertiesOpen(false);
              setSelectedId(null);
            }}
          />
        )}
      </div>
    </div>
  );
}
