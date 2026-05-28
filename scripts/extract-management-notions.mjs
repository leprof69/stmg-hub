import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const dir = "src/data/management/chapters";
const notions = new Map();

for (const f of readdirSync(dir).filter((x) => x.endsWith(".ts"))) {
  const ch = Number(f.match(/chap(\d+)/)?.[1] ?? 0);
  const t = readFileSync(join(dir, f), "utf8");
  const re = /notionsCibles:\s*\[([^\]]+)\]/g;
  let m;
  while ((m = re.exec(t))) {
    const arr = [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]);
    for (const n of arr) {
      if (!notions.has(n)) notions.set(n, new Set());
      if (ch) notions.get(n).add(ch);
    }
  }
}

const list = [...notions.entries()].sort((a, b) => a[0].localeCompare(b[0], "fr"));
import { writeFileSync } from "node:fs";
const out = { count: list.length, notions: list.map(([n, chs]) => ({ n, chs: [...chs].sort() })) };
writeFileSync("scripts/_notions-list.json", JSON.stringify(out, null, 2), "utf8");
console.log("count", out.count);
