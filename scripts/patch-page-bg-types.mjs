import fs from "fs";
let s = fs.readFileSync("src/lib/pageBackgrounds.ts", "utf8");
const old = `/** Fonds de page profil \ufffd mesh modernes uniquement (pas de motifs r\ufffdtro). */\nexport type BgDef = { label: string; bg: string; price: number; dark: boolean; desc?: string };\n\nconst mesh`;
const neu = `import { PAGE_BG_PHOTOS } from "./pagePhotoBackgrounds";\nexport type { BgDef, BgKind, BgCategory } from "./pageBgTypes";\n\nconst mesh`;
if (!s.includes("export type BgDef = { label: string")) {
  console.log("already patched or format changed");
  process.exit(0);
}
s = s.replace(old, neu);
fs.writeFileSync("src/lib/pageBackgrounds.ts", s, "utf8");
console.log("ok");
