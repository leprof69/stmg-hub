import fs from "node:fs";

const transcript =
  "C:/Users/BUREAU/.cursor/projects/c-Users-BUREAU-Desktop-stmg-hub/agent-transcripts/41315359-0e3a-4ada-a75a-e4bddb5f351c/41315359-0e3a-4ada-a75a-e4bddb5f351c.jsonl";

const sizes = [];
for (const line of fs.readFileSync(transcript, "utf8").split("\n")) {
  if (!line.includes("motMystereBank.ts")) continue;
  let o;
  try {
    o = JSON.parse(line);
  } catch {
    continue;
  }
  for (const part of o.message?.content ?? []) {
    const c = part.input?.contents;
    if (part.input?.path?.includes("motMystereBank") && c) {
      sizes.push({ len: c.length, fffd: [...c].filter((x) => x === "\uFFFD").length });
    }
  }
}
sizes.sort((a, b) => b.len - a.len);
console.log(sizes.slice(0, 8));
