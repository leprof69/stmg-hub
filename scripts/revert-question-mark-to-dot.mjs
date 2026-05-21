/**
 * Annule le remplacement global ? ? · (erreur du fix encodage).
 * Puis réapplique · uniquement dans les libellés UI connus.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "src");
const DOT = "\u00b7";

const UI_MIDDLE_DOT = [
  "Avatar : Jeux · Mon Avatar",
  "Flashcards Bac · Entraînement actif",
  "} · {m} cartes",
  "} · jetons potentiels",
];

function walk(dir, files = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) {
      if (!["node_modules", "dist"].includes(name)) walk(p, files);
    } else if (/\.(tsx?|ts)$/.test(name)) files.push(p);
  }
  return files;
}

let changed = 0;
for (const file of walk(ROOT)) {
  let c = fs.readFileSync(file, "utf8");
  if (!c.includes(DOT)) continue;
  const before = c;
  c = c.split(DOT).join("?");
  for (const phrase of UI_MIDDLE_DOT) {
    const withDot = phrase.replace(/\?/g, DOT);
    if (c.includes(phrase)) c = c.split(phrase).join(withDot);
  }
  if (c !== before) {
    fs.writeFileSync(file, c, "utf8");
    console.log("fixed:", path.relative(ROOT, file));
    changed++;
  }
}
console.log("done,", changed, "file(s)");
