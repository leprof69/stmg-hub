/**
 * Fails if U+FFFD replacement characters remain under src/.
 * Usage: node scripts/check-encoding.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "src");
const R = "\uFFFD";
const MOJIBAKE = /\u251c|\u2510|\u2524|\u00e2\u20ac|\u00c2[\u00a0-\u00bf]/;
/** Broken euro: U+0080 (Latin-1) or U+00A4 (currency sign) in string literals */
const BAD_EURO = /\\u0080|\\u00a4|\u0080|\u00a4/;
const BAD_GRAMMAR = /concern\u00e9\s*:|r\u00e9alis\u00e9r|pred\?|d\\u00e9connecter|Se d\\u00e9connecter/;

function walk(dir, hits = [], moji = [], euros = [], grammar = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) {
      if (!["node_modules", "dist"].includes(name)) walk(p, hits, moji, euros, grammar);
    } else if (/\.(tsx?|ts|css|json)$/.test(name)) {
      const c = fs.readFileSync(p, "utf8");
      const n = c.split(R).length - 1;
      if (n) hits.push({ file: path.relative(ROOT, p), n });
      const m = c.match(MOJIBAKE);
      if (m?.length) moji.push({ file: path.relative(ROOT, p), n: m.length });
      const e = c.match(BAD_EURO);
      if (e?.length) euros.push({ file: path.relative(ROOT, p), n: e.length });
      const g = c.match(BAD_GRAMMAR);
      if (g?.length) grammar.push({ file: path.relative(ROOT, p), n: g.length });
    }
  }
  return { hits, moji, euros, grammar };
}

const { hits, moji, euros, grammar } = walk(ROOT);
let failed = false;
if (hits.length) {
  failed = true;
  console.error("Broken encoding (U+FFFD) in src/:");
  for (const h of hits.sort((a, b) => b.n - a.n)) {
    console.error(`  ${h.n}  ${h.file}`);
  }
}
if (moji.length) {
  failed = true;
  console.error("Mojibake UTF-8/Latin-1 in src/:");
  for (const h of moji.sort((a, b) => b.n - a.n)) {
    console.error(`  ${h.n}  ${h.file}`);
  }
}
if (euros.length) {
  failed = true;
  console.error("Broken euro (\\u0080 or \\u00a4) in src/:");
  for (const h of euros.sort((a, b) => b.n - a.n)) {
    console.error(`  ${h.n}  ${h.file}`);
  }
}
if (grammar.length) {
  failed = true;
  console.error("French accent/grammar issues in src/:");
  for (const h of grammar.sort((a, b) => b.n - a.n)) {
    console.error(`  ${h.n}  ${h.file}`);
  }
}
if (failed) process.exit(1);
console.log("OK: no U+FFFD or mojibake in src/");
