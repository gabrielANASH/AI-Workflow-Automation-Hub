"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

const testimonials = [
  {
    quote: "FlowMind AI transformed our customer support. We went from 4-hour response times to under 2 minutes. The AI agents handle 70% of tickets autonomously.",
    author: "Sarah Chen",
    role: "CTO",
    company: "TechVentures",
    rating: 5,
  },
  {
    quote: "The visual workflow builder is a game-changer. Our non-technical team members are now building automations without any engineering help.",
    author: "Marcus Rivera",
    role: "Engineering Lead",
    company: "DataPro Systems",
    rating: 5,
  },
  {
    quote: "We replaced five separate automation tools with FlowMind AI. Our workflow complexity dropped by 60% and reliability went up significantly.",
    author: "Emily Nakamura",
    role: "VP of Product",
    company: "CloudScale Inc",
    rating: 5,
  },
  {
    quote: "The AI agent accuracy surprised us. After fine-tuning on our data, sentiment analysis hit 96% accuracy. The ROI was immediate.",
    author: "David Kim",
    role: "Head of AI",
    company: "Nexus Labs",
    rating: 5,
  },
  {
    quote: "Deploying AI workflows used to take weeks. With FlowMind, we went from concept to production in under 2 hours. Incredible product.",
    author: "Priya Patel",
    role: "Director of Engineering",
    company: "Apex AI",
    rating: 5,
  },
  {
    quote: "Enterprise security was our biggest concern. FlowMind's SOC 2 compliance and audit logging gave us the confidence to migrate our critical workflows.",
    author: "James Wilson",
    role: "CISO",
    company: "Vortex Financial",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="border-t py-20 lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="mb-4 text-xs font-medium uppercase tracking-widest text-primary">
            Testimonials
          </p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Loved by teams worldwide
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            See why thousands of companies trust FlowMind AI for their automation needs.
          </p>
        </motion.div>

        <div className="mt-16 columns-1 gap-4 sm:columns-2 lg:columns-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="mb-4 break-inside-avoid"
            >
              <div className="rounded-xl border bg-card p-6 transition-shadow hover:shadow-md">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-4 flex items-center gap-3 border-t pt-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {t.author.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{t.author}</p>
                    <p className="text-xs text-muted-foreground">
                      {t.role}, {t.company}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
