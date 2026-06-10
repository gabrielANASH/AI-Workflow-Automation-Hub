export function normalizeAiOutput(content: unknown): Record<string, unknown> | null {
  if (typeof content !== "string") return null;

  const trimmed = content.trim();

  const clean = trimmed.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?```\s*$/i, "");

  try {
    const parsed = JSON.parse(clean);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>;
    }
  } catch {
    /* not valid JSON */
  }

  return null;
}
