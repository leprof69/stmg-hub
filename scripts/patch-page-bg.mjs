import fs from "fs";
let s = fs.readFileSync("src/lib/profileCustomization.ts", "utf8");
const start = s.indexOf("type BgDef = { label:string");
const end = s.indexOf("export const CARD_STYLE");
const insert =
  'export type { BgDef } from "./pageBackgrounds";\nexport { PAGE_BG, PAGE_BG_OVERLAY } from "./pageBackgrounds";\n\n';
s = s.slice(0, start) + insert + s.slice(end);
fs.writeFileSync("src/lib/profileCustomization.ts", s, "utf8");
console.log("ok");
