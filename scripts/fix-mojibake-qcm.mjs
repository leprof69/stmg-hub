/**
 * Repare UTF-8 mal lu en Latin-1 (ex. coop\u251c\u00a9ration -> cooperation accentee).
 * Usage: node scripts/fix-mojibake-qcm.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const FILES = [
  path.join(ROOT, "src/data/sdgn/sdgnMissionQcmBank.ts"),
  path.join(ROOT, "scripts/duelQcmBank.legacy.ts"),
];

const MOJIBAKE = /\u251c|\u2510|\u2524|\u00e2\u20ac|\u00c2[\u00a0-\u00bf]/;

function fixMojibake(str) {
  if (!MOJIBAKE.test(str)) return str;
  try {
    const fixed = Buffer.from(str, "latin1").toString("utf8");
    if (!MOJIBAKE.test(fixed)) return fixed;
  } catch {
    /* ignore */
  }
  return str;
}

function fixFile(filePath) {
  const lines = fs.readFileSync(filePath, "utf8").split("\n");
  let fixes = 0;
  const out = lines.map((line) => {
    if (!MOJIBAKE.test(line)) return line;
    const fixed = fixMojibake(line);
    if (fixed !== line) fixes++;
    return fixed;
  });
  fs.writeFileSync(filePath, out.join("\n"), "utf8");
  const after = (out.join("\n").match(MOJIBAKE) || []).length;
  console.log(path.relative(ROOT, filePath), "lines fixed:", fixes, "mojibake left:", after);
}

for (const f of FILES) fixFile(f);
