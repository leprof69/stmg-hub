import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

const FILES = [
  "src/data/sdgn/sdgnMissionQcmBank.ts",
  "src/data/sdgn/sdgnDsPremiereCasEntreprise.ts",
  "src/data/sdgn/sdgnDsPremiereQcm.ts",
  "src/data/sdgn/sdgnDsPremierePureCours.ts",
];

const seen = new Set();
const items = [];

for (const rel of FILES) {
  const text = fs.readFileSync(path.join(ROOT, rel), "utf8");
  const re =
    /id:\s*"(sdgn-ds[^"]+)"[^}]*?chapter:\s*(\d+)[^}]*?question:\s*(?:"((?:\\.|[^"\\])*)"|([\s\S]*?)\n\s*choix:)/g;
  let m;
  while ((m = re.exec(text))) {
    const id = m[1];
    if (seen.has(id)) continue;
    seen.add(id);
    let q = m[3] ?? m[4] ?? "";
    q = q
      .replace(/\\n/g, " ")
      .replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16)))
      .replace(/\\'/g, "'")
      .replace(/\s+/g, " ")
      .trim();
    if (q.startsWith('"')) q = q.slice(1);
    items.push({ id, chapter: Number(m[2]), question: q, file: rel });
  }
}

function sortKey(id) {
  if (id.startsWith("sdgn-ds-cas-")) return 9000 + Number(id.replace("sdgn-ds-cas-", ""));
  return Number(id.replace("sdgn-ds-", "")) || 0;
}

items.sort((a, b) => sortKey(a.id) - sortKey(b.id));

for (const it of items) {
  console.log(`${it.id} (ch.${it.chapter})`);
  console.log(it.question);
  console.log("");
}
console.log(`TOTAL: ${items.length} questions`);
