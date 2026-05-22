import type { CSSProperties } from "react";
import {
  DECO_POSITIONS,
  type SalonConfig,
  type SalonDecoPlacement,
} from "./profileCustomization";

export type { SalonDecoPlacement };

export type SalonDecoLayoutMap = Record<string, SalonDecoPlacement>;

const MIN_SCALE = 0.45;
const MAX_SCALE = 2.4;
const DEFAULT_SCALE = 1;

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

function parsePercent(value?: string): number {
  if (!value) return 0;
  return parseFloat(String(value).replace("%", "")) || 0;
}

/** Convertit un slot fixe historique en coordonnees % + echelle. */
export function defaultPlacementFromSlot(index: number): SalonDecoPlacement {
  const pos = DECO_POSITIONS[index];
  if (!pos) {
    const angle = (index * 47) % 360;
    const r = 28 + (index % 4) * 8;
    return {
      x: clamp(50 + Math.cos((angle * Math.PI) / 180) * r, 8, 92),
      y: clamp(42 + Math.sin((angle * Math.PI) / 180) * r, 10, 88),
      scale: DEFAULT_SCALE,
    };
  }
  let x = 50;
  let y = 50;
  if (pos.left != null) x = parsePercent(pos.left);
  else if (pos.right != null) x = 100 - parsePercent(pos.right);
  if (pos.top != null) y = parsePercent(pos.top);
  else if (pos.bottom != null) y = 100 - parsePercent(pos.bottom);
  const rem = parseFloat(String(pos.fontSize || "1.5rem").replace("rem", "")) || 1.5;
  return {
    x: clamp(x, 5, 95),
    y: clamp(y, 5, 95),
    scale: clamp(rem / 1.5, MIN_SCALE, MAX_SCALE),
  };
}

export function getDecoPlacement(
  salon: SalonConfig,
  em: string,
  index: number
): SalonDecoPlacement {
  const saved = salon.decoLayout?.[em];
  if (saved && Number.isFinite(saved.x) && Number.isFinite(saved.y)) {
    return {
      x: clamp(saved.x, 2, 98),
      y: clamp(saved.y, 2, 98),
      scale: clamp(saved.scale ?? DEFAULT_SCALE, MIN_SCALE, MAX_SCALE),
    };
  }
  return defaultPlacementFromSlot(index);
}

export function setDecoPlacement(
  salon: SalonConfig,
  em: string,
  patch: Partial<SalonDecoPlacement>
): SalonConfig {
  const cur = getDecoPlacement(salon, em, salon.deco.indexOf(em));
  const next: SalonDecoPlacement = {
    x: clamp(patch.x ?? cur.x, 2, 98),
    y: clamp(patch.y ?? cur.y, 2, 98),
    scale: clamp(patch.scale ?? cur.scale, MIN_SCALE, MAX_SCALE),
  };
  return {
    ...salon,
    decoLayout: { ...(salon.decoLayout || {}), [em]: next },
  };
}

export function removeDecoFromLayout(salon: SalonConfig, em: string): SalonConfig {
  if (!salon.decoLayout?.[em]) return salon;
  const { [em]: _removed, ...rest } = salon.decoLayout;
  return { ...salon, decoLayout: Object.keys(rest).length ? rest : undefined };
}

/** Garde uniquement les placements des stickers encore poses ; complete les manquants. */
export function normalizeSalonDecoLayout(salon: SalonConfig): SalonConfig {
  const deco = salon.deco || [];
  const layout: SalonDecoLayoutMap = {};
  deco.forEach((em, i) => {
    layout[em] = getDecoPlacement({ ...salon, decoLayout: salon.decoLayout }, em, i);
  });
  return { ...salon, decoLayout: layout };
}

export type DecoAnimSet = "studio" | "profile" | "visit";

const ANIM_BY_SET: Record<DecoAnimSet, string[]> = {
  studio: ["decoFloat0", "decoFloat1", "decoFloat2", "decoFloat3"],
  profile: ["pp-deco-float-0", "pp-deco-float-1", "pp-deco-float-2", "pp-deco-float-3"],
  visit: ["vsDecoFloat", "vsDecoFloat", "vsDecoFloat", "vsDecoFloat"],
};

export function placementToCss(
  placement: SalonDecoPlacement,
  opts?: { animate?: boolean; animIndex?: number; animSet?: DecoAnimSet }
): CSSProperties {
  const animIndex = opts?.animIndex ?? 0;
  const set = opts?.animSet ?? "studio";
  const anims = ANIM_BY_SET[set];
  return {
    position: "absolute",
    left: `${placement.x}%`,
    top: `${placement.y}%`,
    transform: `translate(-50%, -50%) scale(${placement.scale})`,
    transformOrigin: "center center",
    lineHeight: 1,
    zIndex: opts?.animate ? 0 : 2,
    animation: opts?.animate
      ? `${anims[animIndex % anims.length]} ${2.4 + animIndex * 0.35}s ease-in-out ${animIndex * 0.28}s infinite`
      : undefined,
    pointerEvents: "none",
    filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.4))",
  };
}

export function scaleToFontSize(scale: number): string {
  return `${(1.5 * clamp(scale, MIN_SCALE, MAX_SCALE)).toFixed(2)}rem`;
}

export const SALON_DECO_SCALE_MIN = MIN_SCALE;
export const SALON_DECO_SCALE_MAX = MAX_SCALE;
