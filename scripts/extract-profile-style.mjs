import fs from "fs";
const src = fs.readFileSync("src/pages/Profil.tsx", "utf8");
const start = src.indexOf("type SalonConfig");
const end = src.indexOf("// Returns color style for Iconify");
if (start < 0 || end < 0) throw new Error(`markers not found: ${start} ${end}`);
const chunk = src.slice(start, end);
const header = `import type { CSSProperties } from "react";

export type PageStyle = {
  pageBg: string;
  cardStyle: string;
  nameEffect: string;
  vitrineFrame: string;
};

`;
let body = chunk
  .replace(/^type SalonConfig/gm, "export type SalonConfig")
  .replace(/^const DEFAULT_SALON/gm, "export const DEFAULT_SALON")
  .replace(/^const SALON_THEMES/gm, "export const SALON_THEMES")
  .replace(/^const DEFAULT_PAGE_STYLE/gm, "export const DEFAULT_PAGE_STYLE")
  .replace(/^type PageStyle[\s\S]*?};\r?\n\r?\nexport const DEFAULT_PAGE_STYLE/gm, "export const DEFAULT_PAGE_STYLE")
  .replace(/^export type PageStyle[\s\S]*?};\r?\n\r?\n/gm, "");
// Remove duplicate PageStyle if we added in header
body = body.replace(/^export type PageStyle = \{[\s\S]*?\};\r?\n\r?\n/gm, "");
const exports = header + body
  .replace(/^const PAGE_BG/gm, "export const PAGE_BG")
  .replace(/^const CARD_STYLE/gm, "export const CARD_STYLE")
  .replace(/^const NAME_EFFECT/gm, "export const NAME_EFFECT")
  .replace(/^const VITRINE_FRAME/gm, "export const VITRINE_FRAME")
  .replace(/^const THEME_PRICES/gm, "export const THEME_PRICES")
  .replace(/^const DECO_CATS/gm, "export const DECO_CATS")
  .replace(/^const DECO_POSITIONS/gm, "export const DECO_POSITIONS");
fs.writeFileSync("src/lib/profileCustomization.ts", exports, "utf8");
console.log("ok", exports.length);
