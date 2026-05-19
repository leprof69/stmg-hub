/**
 * Corrige les \\uXXXX affichs tels quels dans le JSX (texte entre balises et attributs).
 * Usage: node scripts/fix-jsx-unicode.mjs
 */
import fs from "fs";
import path from "path";

import { fileURLToPath } from "url";
const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "src");

function decodeEscapes(s) {
  return s
    .replace(/\\u\{([0-9a-fA-F]+)\}/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/\\u([0-9a-fA-F]{4})/gi, (_, h) => String.fromCharCode(parseInt(h, 16)));
}

function fixContent(content) {
  let out = content;

  // Attributs JSX : label="\u2191" ? label="?"
  out = out.replace(/(\s)([a-zA-Z][\w-]*)=(["'])([^"']*\\u[0-9a-fA-F]{4}[^"']*)\3/g, (m, sp, attr, q, val) => {
    const decoded = decodeEscapes(val);
    const escaped = decoded.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
    return `${sp}${attr}="${escaped}"`;
  });

  // Texte entre balises (hors {expressions})
  out = out.replace(/>([^<>{}]*\\u[0-9a-fA-F]{4}[^<>{}]*)</g, (m, text) => {
    if (text.includes("{")) return m;
    return `>${decodeEscapes(text)}<`;
  });

  return out;
}

function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p);
    else if (/\.(tsx|jsx)$/.test(name)) {
      const raw = fs.readFileSync(p, "utf8");
      const fixed = fixContent(raw);
      if (fixed !== raw) {
        fs.writeFileSync(p, fixed, "utf8");
        console.log("fixed:", path.relative(ROOT, p));
      }
    }
  }
}

walk(ROOT);
