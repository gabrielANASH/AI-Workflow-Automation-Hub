"use client";

import { Reorder } from "framer-motion";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BuilderBlock } from "@/components/workflows/builder/builder-block";
import type { WorkflowBlock } from "@/components/workflows/workflow-builder";

interface BuilderCanvasProps {
  blocks: WorkflowBlock[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onReorder: (blocks: WorkflowBlock[]) => void;
  onRemove: (id: string) => void;
  onAddBlock: () => void;
}

export function BuilderCanvas({
  blocks,
  selectedId,
  onSelect,
  onReorder,
  onRemove,
  onAddBlock,
}: BuilderCanvasProps) {
  return (
    <div className="flex min-h-full flex-col items-center py-8">
      <div className="w-full max-w-2xl px-4">
        {/* Start indicator */}
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/10">
            <div className="h-2 w-2 rounded-full bg-emerald-500" />
          </div>
          <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Start</span>
          <div className="flex-1 border-t border-dashed border-border" />
        </div>

        {/* Draggable block list */}
        <Reorder.Group
          axis="y"
          values={blocks}
          onReorder={onReorder}
          className="space-y-0"
        >
          {blocks.map((block, i) => (
            <div key={block.id} className="relative">
              {/* Connector line */}
              {i > 0 && (
                <div className="flex justify-center py-1">
                  <svg width="16" height="20" viewBox="0 0 16 20" className="text-muted-foreground/40">
                    <path
                      d="M8 0 L8 16 M8 16 L2 10 M8 16 L14 10"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}

              <Reorder.Item
                value={block}
                id={block.id}
                className="cursor-grab active:cursor-grabbing"
                whileDrag={{
                  scale: 1.02,
                  boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                  zIndex: 50,
                }}
                onDragEnd={() => {
                  /* Reorder handles it */
                }}
              >
                <div onClick={() => onSelect(block.id)}>
                  <BuilderBlock
                    block={block}
                    index={i}
                    isSelected={selectedId === block.id}
                    onRemove={() => onRemove(block.id)}
                  />
                </div>
              </Reorder.Item>

              {/* Condition branches */}
              {block.type === "condition" && i < blocks.length - 1 && (
                <div className="my-2 flex justify-center gap-8">
                  <div className="flex items-center gap-1.5 rounded-full border bg-emerald-500/5 px-3 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Yes
                  </div>
                  <div className="flex items-center gap-1.5 rounded-full border bg-red-500/5 px-3 py-0.5 text-[10px] font-medium text-red-600 dark:text-red-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                    No
                  </div>
                </div>
              )}
            </div>
          ))}
        </Reorder.Group>

        {/* Add block button */}
        <div className="mt-4 flex justify-center">
          <div className="relative">
            <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-dashed border-border bg-background">
                <svg width="8" height="8" viewBox="0 0 8 8" className="text-muted-foreground">
                  <circle cx="4" cy="4" r="1.5" fill="currentColor" />
                </svg>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onAddBlock}
              className="h-9 gap-1.5 border-dashed text-xs text-muted-foreground hover:text-foreground"
            >
              <Plus className="h-3.5 w-3.5" />
              Add block
            </Button>
          </div>
        </div>

        {/* End indicator */}
        <div className="mt-6 flex items-center gap-3">
          <div className="flex-1 border-t border-dashed border-border" />
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted">
            <div className="h-2 w-2 rounded-full bg-muted-foreground/50" />
          </div>
          <span className="text-xs font-medium text-muted-foreground">End</span>
        </div>
      </div>
    </div>
  );
}
