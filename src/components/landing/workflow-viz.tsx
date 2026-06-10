"use client";

import { motion } from "framer-motion";
import { ArrowDown, Bot, Brain, Workflow, Database, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  { icon: Brain, label: "Trigger", desc: "Event, schedule, or webhook", color: "from-violet-500 to-purple-600" },
  { icon: Bot, label: "AI Agent", desc: "Process with LLM", color: "from-blue-500 to-indigo-600" },
  { icon: Database, label: "Transform", desc: "Map & enrich data", color: "from-emerald-500 to-teal-600" },
  { icon: Workflow, label: "Action", desc: "Execute & integrate", color: "from-amber-500 to-orange-600" },
  { icon: BarChart3, label: "Output", desc: "Result & analytics", color: "from-rose-500 to-pink-600" },
];

export function WorkflowViz() {
  return (
    <section className="border-t py-20 lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="mb-4 text-xs font-medium uppercase tracking-widest text-primary">
            How it works
          </p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            From idea to automation in minutes
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Design workflows visually. Each step is a building block you connect, configure, and deploy.
          </p>
        </motion.div>

        {/* Desktop: horizontal flow */}
        <div className="mt-16 hidden grid-cols-5 items-start gap-0 lg:grid">
          {steps.map((step, i) => (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative flex flex-col items-center text-center"
            >
              <div
                className={cn(
                  "flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br shadow-lg",
                  step.color
                )}
              >
                <step.icon className="h-7 w-7 text-white" />
              </div>
              <h3 className="mt-4 text-sm font-semibold">{step.label}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{step.desc}</p>
              {i < steps.length - 1 && (
                <div className="absolute left-full top-8 flex -translate-x-3 items-center">
                  <div className="h-px w-8 bg-gradient-to-r from-border to-border" />
                  <ArrowDown className="hidden h-4 w-4 -rotate-90 text-muted-foreground" />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Mobile: vertical flow */}
        <div className="mt-16 space-y-0 lg:hidden">
          {steps.map((step, i) => (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="relative flex items-start gap-4 pb-8 pl-8"
            >
              {i < steps.length - 1 && (
                <div className="absolute left-[23px] top-12 h-full w-px bg-gradient-to-b from-border to-border" />
              )}
              <div
                className={cn(
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg",
                  step.color
                )}
              >
                <step.icon className="h-5 w-5 text-white" />
              </div>
              <div className="pt-1">
                <h3 className="text-sm font-semibold">{step.label}</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Code snippet */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mx-auto mt-16 max-w-2xl"
        >
          <div className="overflow-hidden rounded-xl border bg-card">
            <div className="flex items-center gap-1.5 border-b px-4 py-2.5">
              <div className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
              <div className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
              <span className="ml-3 text-xs text-muted-foreground">workflow.yaml</span>
            </div>
            <div className="overflow-x-auto p-4 text-xs leading-relaxed">
              <pre className="text-muted-foreground">
                <span className="text-primary">workflow</span>:{" "}
                <span className="text-amber-500">{'"Customer Support Pipeline"'}</span>
                {"\n"}
                <span className="text-primary">trigger</span>:
                {"\n"}  <span className="text-primary">type</span>:{" "}
                <span className="text-amber-500">ticket.created</span>
                {"\n"}  <span className="text-primary">source</span>:{" "}
                <span className="text-amber-500">zendesk</span>
                {"\n"}
                <span className="text-primary">steps</span>:
                {"\n"}  - <span className="text-primary">agent</span>:{" "}
                <span className="text-amber-500">text-analyzer</span>
                {"\n"}    <span className="text-primary">task</span>:{" "}
                <span className="text-amber-500">classify_ticket</span>
                {"\n"}  - <span className="text-primary">action</span>:{" "}
                <span className="text-amber-500">send_reply</span>
                {"\n"}    <span className="text-primary">channel</span>:{" "}
                <span className="text-amber-500">email</span>
              </pre>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
