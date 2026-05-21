import type { CSSProperties } from "react";
import { MAX_SALON_DECOS } from "./profileDecoPrices";

export function decoLabel(em: string): string {
  if (em.startsWith("lottie:")) {
    const m = em.match(/assets\/([^/]+)\/Animated\//);
    if (m) {
      const name = decodeURIComponent(m[1]).replace(/_/g, " ");
      const words = name.split(" ");
      return words.length > 2 ? words.slice(0, 2).join(" ") : name;
    }
    return "Anim\u00e9";
  }
  if (em.startsWith("icon:")) {
    const parts = em.slice(5).split(":");
    const raw = (parts[parts.length - 1] || "").replace(/-/g, " ");
    const words = raw.split(" ");
    return words.slice(0, 2).join(" ");
  }
  if (em.startsWith("fluent3d:")) {
    const id = em.slice(9).split("/").pop()?.replace(".png", "") || "";
    return id.replace(/_/g, " ").slice(0, 12);
  }
  if (em.startsWith("emoji:")) return em.slice(6);
  if (em.startsWith("gif:")) return "GIF";
  return em.slice(0, 8);
}

export function sanitizeSalonDeco(deco: string[] | undefined): string[] {
  if (!deco?.length) return [];
  return deco.filter((d) => !d.includes("duotone")).slice(0, MAX_SALON_DECOS);
}

export function iconStyleForId(iconId: string, accentColor?: string): CSSProperties {
  if (iconId.startsWith("solar:") || iconId.startsWith("line-md:")) {
    return { color: accentColor || "#a78bfa" };
  }
  return {};
}
