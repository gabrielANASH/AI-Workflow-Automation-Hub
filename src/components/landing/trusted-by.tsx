"use client";

import { motion } from "framer-motion";

const logos = [
  { name: "Acme Corp", symbol: "A" },
  { name: "TechHub", symbol: "T" },
  { name: "DataFlow", symbol: "D" },
  { name: "CloudScale", symbol: "C" },
  { name: "Nexus", symbol: "N" },
  { name: "Apex AI", symbol: "A" },
  { name: "Vortex", symbol: "V" },
  { name: "Pulse", symbol: "P" },
];

export function TrustedBy() {
  return (
    <section className="border-y py-12">
      <div className="mx-auto max-w-7xl px-6">
        <p className="mb-8 text-center text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Trusted by teams at
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {logos.map((logo, i) => (
            <motion.div
              key={logo.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group flex items-center gap-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border bg-card text-sm font-bold text-muted-foreground transition-colors group-hover:border-primary/50 group-hover:text-foreground">
                {logo.symbol}
              </div>
              <span className="text-sm font-medium text-muted-foreground transition-colors group-hover:text-foreground">
                {logo.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
