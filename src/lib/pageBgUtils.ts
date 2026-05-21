import type { BgDef } from "./pageBgTypes";

export function isPhotoPageBg(def: BgDef): boolean {
  return def.kind === "photo" && !!def.image;
}

export function pageBgFocal(def: BgDef): string {
  if (isPhotoPageBg(def) && def.focal) return def.focal;
  return "center 38%";
}

/** Fond plein \u00e9cran (sans voile) pour la page profil. */
export function pageBgFullScreen(def: BgDef): string {
  if (isPhotoPageBg(def)) return `url(${def.image}) center/cover no-repeat`;
  return def.bg;
}

/** CSS `background` pour mesh ou vignette studio (voile l\u00e9ger sur photo). */
export function pageBgCss(def: BgDef): string {
  if (isPhotoPageBg(def)) {
    const top = def.dark ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.06)";
    const bot = def.dark ? "rgba(0,0,0,0.45)" : "rgba(0,0,0,0.22)";
    return [
      `linear-gradient(180deg, ${top} 0%, ${bot} 100%)`,
      `url(${def.image}) center/cover no-repeat`,
    ].join(", ");
  }
  return def.bg;
}

export const PAGE_BG_FILTER_CHIPS = [
  { id: "all", label: "Tout" },
  { id: "mesh", label: "D\u00e9grad\u00e9s" },
  { id: "ambiance", label: "Ambiances" },
  { id: "cinema", label: "Cin\u00e9ma" },
  { id: "animation", label: "Style anim\u00e9" },
] as const;

export type PageBgFilterId = (typeof PAGE_BG_FILTER_CHIPS)[number]["id"];

export function pageBgMatchesFilter(def: BgDef, filter: PageBgFilterId): boolean {
  if (filter === "all") return true;
  if (filter === "mesh") return def.kind !== "photo";
  return def.category === filter;
}
