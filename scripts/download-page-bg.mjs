/**
 * T\u00e9l\u00e9charge les fonds photo (Pexels, licence libre) dans public/page-bg/
 * Usage: node scripts/download-page-bg.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "public", "page-bg");
const W = 1280;

/** [fichier local, id photo Pexels] */
const ITEMS = [
  ["foret.jpg", 144197],
  ["plage.jpg", 457881],
  ["ville-nuit.jpg", 1222271],
  ["cafe.jpg", 302899],
  ["pluie.jpg", 325185],
  ["montagne.jpg", 572897],
  ["biblio.jpg", 256541],
  ["coucher-soleil.jpg", 1032656],
  ["cinema-salle.jpg", 7991579],
  ["popcorn.jpg", 1352274],
  ["pellicule.jpg", 2749379],
  ["rideau-rouge.jpg", 7131980],
  ["pastel.jpg", 1939485],
  ["couleurs.jpg", 7130481],
  ["neon-anim.jpg", 2832034],
  ["encre.jpg", 2866153],
  ["etoiles-anim.jpg", 1252869],
];

async function download(name, id) {
  const url = `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${W}`;
  const dest = path.join(outDir, name);
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`${name} (${id}): HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
  console.log("OK", name, `${(buf.length / 1024).toFixed(0)} KB`);
}

fs.mkdirSync(outDir, { recursive: true });
let ok = 0;
let fail = 0;
for (const [name, id] of ITEMS) {
  try {
    await download(name, id);
    ok++;
  } catch (e) {
    console.error("FAIL", name, e.message);
    fail++;
  }
}
console.log(`Done: ${ok} ok, ${fail} failed -> ${outDir}`);
process.exit(fail > 0 ? 1 : 0);
