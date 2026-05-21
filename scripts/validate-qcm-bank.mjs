/**
 * Valide la banque QCM Missions avant build : encodage + questions de programme (meta).
 * Usage: node scripts/validate-qcm-bank.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const BANK = path.join(ROOT, "src/data/sdgn/sdgnMissionQcmBank.ts");

const MOJIBAKE = /\u251c|\u2510|\u2524|\u00e2\u20ac|\u00c2[\u00a0-\u00bf]/;
const BAD_I = /rel\u00efve|acc\u00efs|si\u00efge|th\u00efme|r\u00efgle|apr\u00efs|mod\u00efles/;
const R = "\uFFFD";

/** Questions interdites : meta-programme, pas sur la notion elle-meme. */
const META_PATTERNS = [
  /\u00e0 quel chapitre/i,
  /appartient la notion/i,
  /quel intitul\u00e9 correspond/i,
  /quelle affirmation d\u00e9crit une comp\u00e9tence/i,
  /question directrice \(qdg\)/i,
  /quelle est la question directrice/i,
  /chapitre sdgn missions appartient/i,
  /pack missions sdgn \(chapitre/i,
];

function extractStrings(ts) {
  const out = [];
  const re = /"(?:\\.|[^"\\])*"/g;
  let m;
  while ((m = re.exec(ts))) {
    const raw = m[0].slice(1, -1);
    const val = raw.replace(/\\u([0-9a-fA-F]{4})/g, (_, h) =>
      String.fromCharCode(parseInt(h, 16)),
    );
    if (val.length >= 8) out.push(val);
  }
  return out;
}

function isMeta(s) {
  return META_PATTERNS.some((re) => re.test(s));
}

function main() {
  const text = fs.readFileSync(BANK, "utf8");
  const errors = [];

  if (text.includes(R)) errors.push("U+FFFD present dans sdgnMissionQcmBank.ts");
  if (MOJIBAKE.test(text)) errors.push("Mojibake detecte dans sdgnMissionQcmBank.ts");
  if (BAD_I.test(text)) errors.push("Restes rel�ve/acc�s detectes");

  const strings = extractStrings(text);
  for (const s of strings) {
    if (MOJIBAKE.test(s) || BAD_I.test(s) || s.includes(R)) {
      errors.push(`Encodage: "${s.slice(0, 72)}..."`);
      if (errors.length > 8) break;
    }
    if (isMeta(s)) {
      errors.push(`Meta-question: "${s.slice(0, 72)}..."`);
      if (errors.length > 12) break;
    }
  }

  const idCount = (text.match(/id: "sdgn/g) || []).length;
  if (idCount < 50) errors.push(`Banque trop petite (${idCount} entrees ?)`);

  if (errors.length) {
    console.error("QCM bank validation FAILED:\n");
    for (const e of errors) console.error(" -", e);
    console.error("\nLance: npm run fix:qcm-encoding");
    process.exit(1);
  }
  console.log(`OK: banque QCM validee (${idCount} questions, encodage + contenu).`);
}

main();
