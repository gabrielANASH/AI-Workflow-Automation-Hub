"use client";

import { motion } from "framer-motion";
import {
  Bot,
  Workflow,
  GitBranch,
  Zap,
  BarChart3,
  Shield,
  Blocks,
  Puzzle,
  BrainCircuit,
} from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Bot,
    title: "AI Agents",
    description: "Deploy intelligent agents that understand context, make decisions, and execute tasks autonomously.",
    gradient: "from-violet-500/10 to-violet-500/5",
    iconColor: "text-violet-500",
  },
  {
    icon: Workflow,
    title: "Visual Builder",
    description: "Drag-and-drop interface to design complex multi-step workflows without writing a single line of code.",
    gradient: "from-blue-500/10 to-blue-500/5",
    iconColor: "text-blue-500",
  },
  {
    icon: GitBranch,
    title: "Smart Triggers",
    description: "Trigger workflows from events, schedules, webhooks, or AI predictions for real-time automation.",
    gradient: "from-emerald-500/10 to-emerald-500/5",
    iconColor: "text-emerald-500",
  },
  {
    icon: Blocks,
    title: "Pre-built Templates",
    description: "Start faster with 100+ pre-built workflow templates for common automation scenarios.",
    gradient: "from-amber-500/10 to-amber-500/5",
    iconColor: "text-amber-500",
  },
  {
    icon: BrainCircuit,
    title: "Multi-Model AI",
    description: "Access GPT-4, Claude, Gemini, and custom models. Switch between them within a single workflow.",
    gradient: "from-rose-500/10 to-rose-500/5",
    iconColor: "text-rose-500",
  },
  {
    icon: Puzzle,
    title: "500+ Integrations",
    description: "Connect seamlessly with Slack, Notion, Salesforce, GitHub, and hundreds of other tools.",
    gradient: "from-cyan-500/10 to-cyan-500/5",
    iconColor: "text-cyan-500",
  },
  {
    icon: BarChart3,
    title: "Real-time Analytics",
    description: "Monitor execution, track performance, and optimize your workflows with detailed metrics.",
    gradient: "from-indigo-500/10 to-indigo-500/5",
    iconColor: "text-indigo-500",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "SOC 2 Type II compliant with end-to-end encryption, RBAC, and audit logging.",
    gradient: "from-slate-500/10 to-slate-500/5",
    iconColor: "text-slate-500",
  },
  {
    icon: Zap,
    title: "Real-time Processing",
    description: "Execute thousands of workflows in parallel with sub-second latency and auto-scaling infrastructure.",
    gradient: "from-orange-500/10 to-orange-500/5",
    iconColor: "text-orange-500",
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="mb-4 text-xs font-medium uppercase tracking-widest text-primary">
            Platform features
          </p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Everything you need to automate
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Powerful features that make AI workflow automation simple, flexible, and enterprise-ready.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className={cn(
                "group relative bg-card p-8 transition-all hover:bg-accent/50",
              )}
            >
              <div
                className={cn(
                  "absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100",
                  feature.gradient
                )}
              />
              <div className="relative z-10">
                <div
                  className={cn(
                    "flex h-11 w-11 items-center justify-center rounded-xl border bg-background",
                    feature.iconColor
                  )}
                >
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-base font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
