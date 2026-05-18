import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pBank = path.join(__dirname, "../src/data/duelQcmBank.ts");
const pGen = path.join(__dirname, "generate-duel-qcm-bank.mjs");
for (const p of [pBank, pGen]) {
  let s = fs.readFileSync(p, "utf8");
  const before = (s.match(/\uFFFD/g) || []).length;
  s = s.replace(/L'Or\uFFFDal/g, "L'Or\u00e9al");
  fs.writeFileSync(p, s);
  console.log(path.basename(p), "U+FFFD before:", before, "after:", (s.match(/\uFFFD/g) || []).length);
}
