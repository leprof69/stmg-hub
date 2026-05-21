import type { CSSProperties } from "react";
import type { BgDef } from "./pageBgTypes";
import { isPhotoPageBg } from "./pageBgUtils";
import { AVATAR_FRAME } from "./profileCustomization";

/** Contraste garanti : fond clair = texte sombre, fond sombre/photo = texte clair. */
export type ProfilSurface = "light" | "dark";

export function getProfilSurface(pageBg: BgDef): ProfilSurface {
  return isPhotoPageBg(pageBg) || pageBg.dark ? "dark" : "light";
}

export function profilThemeVars(surface: ProfilSurface, accent: string): CSSProperties {
  if (surface === "dark") {
    return {
      "--p-surface": "#0f172a",
      "--p-surface-2": "#1e293b",
      "--p-surface-inset": "#334155",
      "--p-text": "#f8fafc",
      "--p-text-muted": "#94a3b8",
      "--p-text-faint": "#64748b",
      "--p-border": "rgba(255, 255, 255, 0.12)",
      "--p-accent": accent,
      "--p-hero-band": "transparent",
      "--p-vitrine-empty": "rgba(51, 65, 85, 0.6)",
      "--p-vitrine-card": "#ffffff",
      "--p-vitrine-card-text": "#0f172a",
    } as CSSProperties;
  }
  return {
    "--p-surface": "#ffffff",
    "--p-surface-2": "#f8fafc",
    "--p-surface-inset": "#f1f5f9",
    "--p-text": "#0f172a",
    "--p-text-muted": "#64748b",
    "--p-text-faint": "#94a3b8",
    "--p-border": "rgba(15, 23, 42, 0.08)",
    "--p-accent": accent,
    "--p-hero-band": "transparent",
    "--p-vitrine-empty": "#f1f5f9",
    "--p-vitrine-card": "#ffffff",
    "--p-vitrine-card-text": "#0f172a",
  } as CSSProperties;
}

/** Texte des panneaux sous le hero (contraste garanti). Passer le style effectif (effCard). */
export function profilPanelTextColors(
  surface: ProfilSurface,
  effCardStyle: string
): { main: string; muted: string } {
  if (effCardStyle === "glass" || effCardStyle === "minimal") {
    return { main: "#0f172a", muted: "#475569" };
  }
  if (effCardStyle === "darkglass" || effCardStyle === "neon") {
    return { main: "#f8fafc", muted: "#cbd5e1" };
  }
  return surface === "light"
    ? { main: "#0f172a", muted: "#64748b" }
    : { main: "#f8fafc", muted: "#94a3b8" };
}

/** Effet nom sur le hero (toujours lisible). */
export function profilHeroNameStyle(
  heroDark: boolean,
  effectKey: string,
  effectStyle: CSSProperties
): CSSProperties {
  const base: CSSProperties = heroDark ? { color: "#f8fafc" } : { color: "#0f172a" };
  if (effectKey === "defaut") return base;
  if (effectKey === "gradient" || effectKey === "gold") return effectStyle;
  if (effectKey === "neon") {
    return heroDark
      ? effectStyle
      : { color: "#0891b2", textShadow: "0 0 12px rgba(6,182,212,0.45)" };
  }
  if (effectKey === "shadow") {
    return heroDark
      ? { ...base, textShadow: "0 2px 16px rgba(0,0,0,0.85)" }
      : { ...base, textShadow: "0 2px 8px rgba(0,0,0,0.25)" };
  }
  return base;
}

/** @deprecated Utiliser profilHeroNameStyle sur le hero. */
export function profilNameStyle(
  surface: ProfilSurface,
  effectKey: string,
  effectStyle: CSSProperties
): CSSProperties {
  return profilHeroNameStyle(surface === "dark", effectKey, effectStyle);
}

/** Style des panneaux (verre, neon, etc.) selon la personnalisation. */
export function profilPanelStyle(
  cardStyle: string,
  isDarkPage: boolean,
  accent: string
): CSSProperties {
  const cs =
    cardStyle === "defaut" && !isDarkPage
      ? "glass"
      : cardStyle === "defaut" && isDarkPage
        ? "darkglass"
        : cardStyle;
  if (cs === "glass")
    return {
      background: "rgba(255,255,255,0.72)",
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      border: "1px solid rgba(255,255,255,0.85)",
      boxShadow: "0 8px 32px rgba(15,23,42,0.08)",
    };
  if (cs === "darkglass")
    return {
      background: "rgba(15,23,42,0.72)",
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      border: "1px solid rgba(255,255,255,0.12)",
      boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
    };
  if (cs === "neon")
    return {
      background: "rgba(7,10,18,0.88)",
      border: `1px solid ${accent}55`,
      boxShadow: `0 0 20px ${accent}22`,
    };
  if (cs === "minimal")
    return {
      background: "rgba(255,255,255,0.96)",
      border: "1px solid rgba(0,0,0,0.06)",
      boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
    };
  return {
    background: "#ffffff",
    boxShadow: "0 8px 28px rgba(15,23,42,0.1)",
    border: "1px solid rgba(15,23,42,0.06)",
  };
}

export function avatarFrameStyles(
  frameKey: string,
  accent: string
): { ring: CSSProperties; inner: CSSProperties } {
  const f = AVATAR_FRAME[frameKey] || AVATAR_FRAME.defaut;
  const rep = (s: string) => s.replace(/{c}/g, accent);
  return {
    ring: {
      display: "inline-block",
      padding: f.pad,
      borderRadius: 22,
      background: rep(f.ring),
      boxShadow: rep(f.glow),
    },
    inner: {
      borderRadius: 18,
      padding: 3,
      background: f.inner,
      lineHeight: 0,
    },
  };
}
