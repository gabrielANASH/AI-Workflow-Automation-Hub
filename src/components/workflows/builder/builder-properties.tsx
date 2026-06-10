"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Brain, Play, GitBranch, Mail, Bell, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { resolveModel, MODEL_REGISTRY } from "@/lib/ai/models";
import type { WorkflowBlock, BlockType } from "@/components/workflows/workflow-builder";

const iconMap: Record<BlockType, React.ElementType> = {
  trigger: Play,
  ai_action: Brain,
  condition: GitBranch,
  email: Mail,
  notification: Bell,
  delay: Clock,
};

const typeLabels: Record<BlockType, string> = {
  trigger: "Trigger",
  ai_action: "AI Action",
  condition: "Condition",
  email: "Email",
  notification: "Notification",
  delay: "Delay",
};

interface BuilderPropertiesProps {
  block: WorkflowBlock;
  onUpdateConfig: (id: string, config: Record<string, unknown>) => void;
  onClose: () => void;
}

export function BuilderProperties({ block, onUpdateConfig, onClose }: BuilderPropertiesProps) {
  const Icon = iconMap[block.type];
  const [localConfig, setLocalConfig] = useState<Record<string, unknown>>(block.config);

  useEffect(() => {
    setLocalConfig(block.config);
  }, [block.id, block.config]);

  const update = (key: string, value: unknown) => {
    const next = { ...block.config, [key]: value };
    setLocalConfig(next);
    onUpdateConfig(block.id, next);
  };

  return (
    <motion.aside
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: 360, opacity: 1 }}
      exit={{ width: 0, opacity: 0 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="hidden border-l bg-background lg:block"
    >
      <div className="flex h-full w-[360px] flex-col overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-5 py-3.5">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold">{typeLabels[block.type]}</p>
              <p className="text-xs text-muted-foreground">{block.label}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Config form */}
        <div className="flex-1 space-y-5 p-5">
          <div className="space-y-2">
            <Label>Block label</Label>
            <Input
              value={(localConfig.label as string) ?? block.label}
              onChange={(e) => {
                setLocalConfig((prev) => ({ ...prev, label: e.target.value }));
                onUpdateConfig(block.id, { ...block.config, label: e.target.value });
              }}
              placeholder="Name this block"
            />
          </div>

          <Separator />

          {/* Block-specific config */}
          {block.type === "trigger" && (
            <TriggerConfig config={localConfig} onChange={update} />
          )}
          {block.type === "ai_action" && (
            <AIActionConfig config={localConfig} onChange={update} />
          )}
          {block.type === "condition" && (
            <ConditionConfig config={localConfig} onChange={update} />
          )}
          {block.type === "email" && (
            <EmailConfig config={localConfig} onChange={update} />
          )}
          {block.type === "notification" && (
            <NotificationConfig config={localConfig} onChange={update} />
          )}
          {block.type === "delay" && (
            <DelayConfig config={localConfig} onChange={update} />
          )}
        </div>
      </div>
    </motion.aside>
  );
}

/* ─── Per-block config forms ─── */

function TriggerConfig({ config, onChange }: { config: Record<string, unknown>; onChange: (k: string, v: unknown) => void }) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Event type</Label>
        <Select value={(config.eventType as string) ?? "ticket.created"} onValueChange={(v) => onChange("eventType", v)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ticket.created">Ticket created</SelectItem>
            <SelectItem value="form.submitted">Form submitted</SelectItem>
            <SelectItem value="email.received">Email received</SelectItem>
            <SelectItem value="webhook">Webhook</SelectItem>
            <SelectItem value="schedule">Schedule (cron)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Source app</Label>
        <Select value={(config.source as string) ?? "zendesk"} onValueChange={(v) => onChange("source", v)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="zendesk">Zendesk</SelectItem>
            <SelectItem value="gmail">Gmail</SelectItem>
            <SelectItem value="slack">Slack</SelectItem>
            <SelectItem value="hubspot">HubSpot</SelectItem>
            <SelectItem value="webhook">Custom Webhook</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

function AIActionConfig({ config, onChange }: { config: Record<string, unknown>; onChange: (k: string, v: unknown) => void }) {
  const supportedModels = Object.entries(MODEL_REGISTRY).filter(([, info]) => info.supported);
  const displayModel = resolveModel((config.model as string) ?? "gpt-4o");

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Model</Label>
        <Select value={displayModel} onValueChange={(v) => onChange("model", v)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {supportedModels.map(([key, info]) => (
              <SelectItem key={key} value={key}>{info.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Prompt</Label>
        <Textarea
          value={(config.prompt as string) ?? ""}
          onChange={(e) => onChange("prompt", e.target.value)}
          placeholder="Enter the AI instruction..."
          rows={4}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label>Temperature</Label>
          <Input
            type="number"
            min={0}
            max={2}
            step={0.1}
            value={(config.temperature as number) ?? 0.3}
            onChange={(e) => onChange("temperature", parseFloat(e.target.value))}
          />
        </div>
        <div className="space-y-2">
          <Label>Max tokens</Label>
          <Input
            type="number"
            min={1}
            step={100}
            value={(config.maxTokens as number) ?? 500}
            onChange={(e) => onChange("maxTokens", parseInt(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
}

function ConditionConfig({ config, onChange }: { config: Record<string, unknown>; onChange: (k: string, v: unknown) => void }) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Variable</Label>
        <Select value={(config.variable as string) ?? "priority"} onValueChange={(v) => onChange("variable", v)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="priority">Priority</SelectItem>
            <SelectItem value="status">Status</SelectItem>
            <SelectItem value="category">Category</SelectItem>
            <SelectItem value="sentiment">Sentiment</SelectItem>
            <SelectItem value="custom">Custom field</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Operator</Label>
        <Select value={(config.operator as string) ?? "equals"} onValueChange={(v) => onChange("operator", v)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="equals">Equals</SelectItem>
            <SelectItem value="not_equals">Not equals</SelectItem>
            <SelectItem value="contains">Contains</SelectItem>
            <SelectItem value="greater_than">Greater than</SelectItem>
            <SelectItem value="less_than">Less than</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Value</Label>
        <Input
          value={(config.value as string) ?? ""}
          onChange={(e) => onChange("value", e.target.value)}
          placeholder="e.g. high"
        />
      </div>
      <div className="rounded-lg border bg-emerald-500/5 p-3 text-xs text-emerald-600 dark:text-emerald-400">
        <span className="font-medium">Yes branch:</span> Continues to next block
      </div>
      <div className="rounded-lg border bg-red-500/5 p-3 text-xs text-red-600 dark:text-red-400">
        <span className="font-medium">No branch:</span> Skips to block after the condition
      </div>
    </div>
  );
}

function EmailConfig({ config, onChange }: { config: Record<string, unknown>; onChange: (k: string, v: unknown) => void }) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>To</Label>
        <Input
          value={(config.to as string) ?? ""}
          onChange={(e) => onChange("to", e.target.value)}
          placeholder="recipient@example.com"
        />
      </div>
      <div className="space-y-2">
        <Label>Subject</Label>
        <Input
          value={(config.subject as string) ?? ""}
          onChange={(e) => onChange("subject", e.target.value)}
          placeholder="Email subject"
        />
      </div>
      <div className="space-y-2">
        <Label>Body</Label>
        <Textarea
          value={(config.body as string) ?? ""}
          onChange={(e) => onChange("body", e.target.value)}
          placeholder="Email body..."
          rows={5}
        />
      </div>
    </div>
  );
}

function NotificationConfig({ config, onChange }: { config: Record<string, unknown>; onChange: (k: string, v: unknown) => void }) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Channel</Label>
        <Select value={(config.channel as string) ?? "slack"} onValueChange={(v) => onChange("channel", v)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="slack">Slack</SelectItem>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="push">Push notification</SelectItem>
            <SelectItem value="sms">SMS</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Message</Label>
        <Textarea
          value={(config.message as string) ?? ""}
          onChange={(e) => onChange("message", e.target.value)}
          placeholder="Notification message..."
          rows={3}
        />
      </div>
    </div>
  );
}

function DelayConfig({ config, onChange }: { config: Record<string, unknown>; onChange: (k: string, v: unknown) => void }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label>Duration</Label>
          <Input
            type="number"
            min={0}
            value={(config.duration as number) ?? 5}
            onChange={(e) => onChange("duration", parseInt(e.target.value))}
          />
        </div>
        <div className="space-y-2">
          <Label>Unit</Label>
          <Select value={(config.unit as string) ?? "minutes"} onValueChange={(v) => onChange("unit", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="seconds">Seconds</SelectItem>
              <SelectItem value="minutes">Minutes</SelectItem>
              <SelectItem value="hours">Hours</SelectItem>
              <SelectItem value="days">Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
