import { DECO_CATS } from "./profileDecoCatalog";
import { isBasePackSticker } from "./profileBasePack";

export const MAX_SALON_DECOS = 10;

/** Prix par categorie de sticker (jetons). */
const CAT_PRICE: Record<string, number> = {
  fluent: 90,
  nature: 35,
  vibes: 35,
  sport: 40,
  food: 35,
  music: 40,
  space: 45,
  school: 50,
  expressions: 45,
};

const itemToCategory = new Map<string, string>();
for (const cat of DECO_CATS) {
  for (const em of cat.items) {
    itemToCategory.set(em, cat.key);
  }
}

/** Prix d'un sticker en jetons (0 = pack de base uniquement). */
export function decoItemPrice(em: string): number {
  if (isBasePackSticker(em)) return 0;
  if (em.startsWith("gif:")) return 160;
  if (em.startsWith("lottie:")) return 120;
  if (em.includes("solar:") || em.includes("duotone")) return 999;
  const cat = itemToCategory.get(em);
  if (cat && CAT_PRICE[cat] != null) return CAT_PRICE[cat];
  if (em.startsWith("fluent3d:")) return 90;
  if (em.startsWith("icon:")) return 35;
  if (em.startsWith("emoji:")) return 25;
  return 40;
}

export function isDecoShopItem(em: string): boolean {
  return decoItemPrice(em) > 0 && !em.includes("duotone");
}

export const ALL_DECO_SHOP_ITEMS = DECO_CATS.flatMap((c) => c.items).filter(isDecoShopItem);
