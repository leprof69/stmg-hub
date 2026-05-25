/** Decoupe un texte long en blocs courts (lecture confortable, style dys). */
export function splitReadableParagraphs(text: string): string[] {
  const raw = text.trim();
  if (!raw) return [];

  const chunks: string[] = [];

  for (const block of raw.split(/\n+/)) {
    const line = block.trim();
    if (!line) continue;

    if (line.includes("\u2014")) {
      const dashParts = line.split(/\s*\u2014\s+/).map((p) => p.trim()).filter(Boolean);
      if (dashParts.length <= 1) {
        chunks.push(line);
        continue;
      }
      const [intro, ...items] = dashParts;
      if (intro.length > 24 && !intro.endsWith(":")) {
        chunks.push(intro);
      } else if (intro.endsWith(":") || intro.length <= 48) {
        chunks.push(intro);
      }
      for (const item of items) {
        chunks.push(item.startsWith("\u2014") ? item : `\u2014 ${item}`);
      }
      continue;
    }

    if (line.length > 160) {
      const sentences = line
        .split(/(?<=[.!?])\s+(?=[A-Z\u00C0-\u00D6\u00D8-\u00DE0-9\u00AB])/)
        .map((s) => s.trim())
        .filter(Boolean);
      if (sentences.length > 1) {
        chunks.push(...sentences);
        continue;
      }
    }

    chunks.push(line);
  }

  return chunks;
}
