/**
 * Fails if U+FFFD replacement characters remain under src/.
 * Usage: node scripts/check-encoding.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "src");
const R = "\uFFFD";

function walk(dir, hits = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) {
      if (!["node_modules", "dist"].includes(name)) walk(p, hits);
    } else if (/\.(tsx?|ts|css|json)$/.test(name)) {
      const c = fs.readFileSync(p, "utf8");
      const n = c.split(R).length - 1;
      if (n) hits.push({ file: path.relative(ROOT, p), n });
    }
  }
  return hits;
}

const hits = walk(ROOT);
if (hits.length) {
  console.error("Broken encoding (U+FFFD) in src/:");
  for (const h of hits.sort((a, b) => b.n - a.n)) {
    console.error(`  ${h.n}  ${h.file}`);
  }
  process.exit(1);
}
console.log("OK: no U+FFFD in src/");
