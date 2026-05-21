/**
 * Remplace les sequences \uXXXX et \u{XXXX} par les vrais caracteres UTF-8.
 * Corrige l'affichage litteral "s\u00E9curis\u00E9es" dans le JSX (texte entre balises).
 * Usage: node scripts/decode-unicode-escapes.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

const TARGETS = [path.join(ROOT, "src/pages"), path.join(ROOT, "src/data/sdgn/sdgnMissionQcmBank.ts")];

const SKIP = new Set(["qcmEncoding.ts"]);

function decodeEscapes(text) {
  return text
    .replace(/\\u\{([0-9a-fA-F]+)\}/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16)));
}

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (/\.(tsx?|jsx?)$/.test(name) && !SKIP.has(name)) out.push(p);
  }
  return out;
}

const files = new Set();
for (const t of TARGETS) {
  if (!fs.existsSync(t)) continue;
  if (fs.statSync(t).isDirectory()) walk(t).forEach((f) => files.add(f));
  else files.add(t);
}

let changed = 0;
for (const file of files) {
  const raw = fs.readFileSync(file, "utf8");
  if (!/\\u[0-9a-fA-F{]/.test(raw)) continue;
  const next = decodeEscapes(raw);
  if (next !== raw) {
    fs.writeFileSync(file, next, "utf8");
    changed++;
    console.log("decoded:", path.relative(ROOT, file));
  }
}
console.log(changed ? `Done: ${changed} file(s).` : "No \\u escapes found.");
