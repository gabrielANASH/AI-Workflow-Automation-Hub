"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "What is FlowMind AI?",
    a: "FlowMind AI is an AI-powered workflow automation platform that lets you design, deploy, and scale intelligent automation pipelines. Our visual builder combines AI agents with traditional automation to handle everything from simple tasks to complex business processes.",
  },
  {
    q: "How does the AI workflow automation work?",
    a: "You design workflows using our drag-and-drop visual builder. Each workflow consists of triggers, AI processing steps, data transformations, and actions. The AI agents use large language models to understand context, make decisions, and execute tasks. You can preview, test, and deploy workflows with one click.",
  },
  {
    q: "Do I need coding experience?",
    a: "Not at all. FlowMind AI is designed for both technical and non-technical users. The visual builder lets you create complex workflows without writing code. For advanced users, we provide a YAML API and SDK for programmatic control.",
  },
  {
    q: "Which AI models are supported?",
    a: "We support GPT-4, GPT-4o, Claude 3.5, Gemini Pro, and open-source models like Llama 3 and Mistral. You can even bring your own fine-tuned models. Switch between models within a single workflow to optimize for cost and performance.",
  },
  {
    q: "How secure is my data?",
    a: "Security is our top priority. FlowMind AI is SOC 2 Type II compliant with end-to-end encryption in transit and at rest. We offer role-based access control, audit logging, SSO integration, and data residency options. Your data never leaves your chosen region without explicit permission.",
  },
  {
    q: "Can I integrate with my existing tools?",
    a: "Absolutely. We offer 500+ pre-built integrations including Slack, Notion, Salesforce, HubSpot, GitHub, Zendesk, Shopify, and more. For custom integrations, use our webhooks or REST API.",
  },
  {
    q: "What happens if a workflow fails?",
    a: "FlowMind AI provides automatic retry with configurable policies, detailed error logs, and real-time alerts. You can set up fallback actions and error-handling branches directly in the visual builder. Our SLA guarantees 99.99% uptime for enterprise plans.",
  },
  {
    q: "Can I cancel my subscription anytime?",
    a: "Yes, you can cancel anytime with no penalties. If you're on a paid plan, you'll retain access until the end of your billing period. All your workflows and data are preserved for 30 days after cancellation.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="border-t py-20 lg:py-32">
      <div className="mx-auto max-w-3xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="mb-4 text-xs font-medium uppercase tracking-widest text-primary">
            FAQ
          </p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Frequently asked questions
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Everything you need to know about FlowMind AI.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 space-y-2"
        >
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={cn(
                "overflow-hidden rounded-xl border transition-colors",
                openIndex === i ? "border-primary/30 bg-accent/30" : "hover:bg-muted/50"
              )}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex w-full items-center justify-between px-6 py-4 text-left"
                aria-expanded={openIndex === i}
              >
                <span className="text-sm font-medium pr-4">{faq.q}</span>
                <span className="shrink-0 text-muted-foreground transition-transform duration-200">
                  {openIndex === i ? (
                    <Minus className="h-4 w-4" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                </span>
              </button>
              <AnimatePresence initial={false}>
                {openIndex === i && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{
                      height: "auto",
                      opacity: 1,
                      transition: { height: { duration: 0.3 }, opacity: { duration: 0.25, delay: 0.05 } },
                    }}
                    exit={{
                      height: 0,
                      opacity: 0,
                      transition: { height: { duration: 0.3 }, opacity: { duration: 0.15 } },
                    }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-4 pt-0">
                      <p className="text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
