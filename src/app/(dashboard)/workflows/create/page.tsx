"use client";

import { useState } from "react";
import { WorkflowBuilder } from "@/components/workflows/workflow-builder";
import { TemplateGallery } from "@/components/templates/template-gallery";

export default function CreateWorkflowPage() {
  const [mode, setMode] = useState<"select" | "build">("select");

  if (mode === "build") {
    return <WorkflowBuilder />;
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-3xl">
          <TemplateGallery
            onSelect={() => setMode("build")}
            onStartBlank={() => setMode("build")}
          />
        </div>
      </div>
    </div>
  );
}
