import type { PageStyle, SalonConfig } from "./profileCustomization";
import { DEFAULT_PAGE_STYLE, THEME_PRICES } from "./profileCustomization";
import { normalizeSalonDecoLayout } from "./salonDecoLayout";
import { sanitizeSalonDeco } from "./profileDecoUtils";

/** Libellà affiché pour les Éléments inclus dans le pack de base (tout le reste = jetons). */
export const BASE_PACK_LABEL = "Pack base";

/**
 * Pack de base gratuit :
 * - Thème salon Original
 * - Fond Clair, cartes / nom / vitrine / cadre avatar à Standard —
 * - 3 stickers de d’marrage
 */
export const BASE_PACK_STICKERS: readonly string[] = [
  "icon:noto:star",
  "icon:noto:red-heart",
  "icon:noto:four-leaf-clover",
];

export function isBasePackTheme(themeKey: string): boolean {
  return themeKey === "defaut";
}

/** Tous les styles page à defaut à font partie du pack. */
export function isBasePackPageKey(itemKey: string): boolean {
  return itemKey === "defaut";
}

export function isBasePackSticker(em: string): boolean {
  return BASE_PACK_STICKERS.includes(em);
}

export function themeShopPrice(themeKey: string): number {
  return isBasePackTheme(themeKey) ? 0 : THEME_PRICES[themeKey] ?? 80;
}

export function isThemeOwnedByUser(themeKey: string, ownedThemes: string[]): boolean {
  return isBasePackTheme(themeKey) || ownedThemes.includes(themeKey);
}

export function isPageItemOwnedByUser(itemKey: string, ownedPageItems: string[]): boolean {
  return isBasePackPageKey(itemKey) || ownedPageItems.includes(itemKey);
}

export function isDecoOwnedByUser(em: string, ownedDecoItems: string[]): boolean {
  return isBasePackSticker(em) || ownedDecoItems.includes(em);
}

export function clampPageStyleToOwned(ps: PageStyle, ownedPageItems: string[]): PageStyle {
  const out: PageStyle = {
    ...DEFAULT_PAGE_STYLE,
    ...ps,
    avatarFrame: ps.avatarFrame || "defaut",
  };
  if (!isPageItemOwnedByUser(out.pageBg, ownedPageItems)) out.pageBg = "defaut";
  if (!isPageItemOwnedByUser(out.cardStyle, ownedPageItems)) out.cardStyle = "defaut";
  if (!isPageItemOwnedByUser(out.nameEffect, ownedPageItems)) out.nameEffect = "defaut";
  if (!isPageItemOwnedByUser(out.vitrineFrame, ownedPageItems)) out.vitrineFrame = "defaut";
  if (!isPageItemOwnedByUser(out.avatarFrame, ownedPageItems)) out.avatarFrame = "defaut";
  return out;
}

export function clampSalonToOwned(
  salon: SalonConfig,
  ownedThemes: string[],
  ownedDecoItems: string[]
): SalonConfig {
  const theme = isThemeOwnedByUser(salon.theme, ownedThemes) ? salon.theme : "defaut";
  const deco = sanitizeSalonDeco(salon.deco).filter((em) =>
    isDecoOwnedByUser(em, ownedDecoItems)
  );
  return normalizeSalonDecoLayout({ ...salon, theme, deco });
}

/** Résumé court pour l’UI du studio. */
export const BASE_PACK_SUMMARY =
  "Original, fond Clair, styles Standard, 3 stickers (etoile, coeur, trefle). Tout le reste = jetons.";
