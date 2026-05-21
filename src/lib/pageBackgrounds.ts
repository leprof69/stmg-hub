import { PAGE_BG_PHOTOS } from "./pagePhotoBackgrounds";
import type { BgDef } from "./pageBgTypes";
export type { BgDef, BgKind, BgCategory } from "./pageBgTypes";

const mesh = (...layers: string[]) => layers.join(", ");

export const PAGE_BG: Record<string, BgDef> = {
  defaut: {
    label: "Clair",
    price: 0,
    dark: false,
    desc: "Neutre lumineux",
    bg: mesh(
      "radial-gradient(ellipse 120% 80% at 50% -20%, rgba(99,102,241,0.08) 0%, transparent 55%)",
      "radial-gradient(ellipse 90% 60% at 100% 50%, rgba(14,165,233,0.06) 0%, transparent 50%)",
      "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 48%, #eef2ff 100%)"
    ),
  },
  linen: {
    label: "Lin",
    price: 50,
    dark: false,
    desc: "Blanc cassà chaleureux",
    bg: mesh(
      "radial-gradient(ellipse 100% 70% at 80% 0%, rgba(251,191,36,0.07) 0%, transparent 50%)",
      "radial-gradient(ellipse 80% 50% at 0% 100%, rgba(244,114,182,0.05) 0%, transparent 45%)",
      "linear-gradient(165deg, #fafaf9 0%, #f5f5f4 50%, #fafafa 100%)"
    ),
  },
  mist: {
    label: "Brume",
    price: 80,
    dark: false,
    desc: "Gris-bleu doux",
    bg: mesh(
      "radial-gradient(ellipse 90% 60% at 30% 0%, rgba(148,163,184,0.12) 0%, transparent 55%)",
      "radial-gradient(ellipse 70% 50% at 90% 80%, rgba(56,189,248,0.08) 0%, transparent 50%)",
      "linear-gradient(180deg, #f1f5f9 0%, #e2e8f0 100%)"
    ),
  },
  blush: {
    label: "Rose poudr—",
    price: 80,
    dark: false,
    desc: "Lavande très l’gère",
    bg: mesh(
      "radial-gradient(ellipse 100% 80% at 20% 0%, rgba(244,114,182,0.1) 0%, transparent 55%)",
      "radial-gradient(ellipse 80% 60% at 100% 60%, rgba(167,139,250,0.08) 0%, transparent 50%)",
      "linear-gradient(180deg, #fdf2f8 0%, #faf5ff 50%, #f8fafc 100%)"
    ),
  },
  frost: {
    label: "Givre",
    price: 100,
    dark: false,
    desc: "Bleu glacier minimal",
    bg: mesh(
      "radial-gradient(ellipse 90% 70% at 50% 0%, rgba(186,230,253,0.35) 0%, transparent 60%)",
      "linear-gradient(180deg, #f0f9ff 0%, #e0f2fe 45%, #f8fafc 100%)"
    ),
  },
  candy: {
    label: "P—che",
    price: 50,
    dark: false,
    desc: "Pastel doux",
    bg: mesh(
      "radial-gradient(ellipse 80% 60% at 0% 50%, rgba(253,186,116,0.1) 0%, transparent 50%)",
      "radial-gradient(ellipse 80% 60% at 100% 0%, rgba(196,181,253,0.1) 0%, transparent 50%)",
      "linear-gradient(160deg, #fffbeb 0%, #fff7ed 50%, #faf5ff 100%)"
    ),
  },
  sakura: {
    label: "Cerise",
    price: 80,
    dark: false,
    desc: "Rose crème",
    bg: mesh(
      "radial-gradient(ellipse 100% 70% at 60% 10%, rgba(251,113,133,0.09) 0%, transparent 55%)",
      "linear-gradient(180deg, #fff1f2 0%, #fff7ed 100%)"
    ),
  },
  holographic: {
    label: "Perle",
    price: 200,
    dark: false,
    desc: "Irisà très subtil",
    bg: mesh(
      "radial-gradient(ellipse 80% 50% at 0% 0%, rgba(167,139,250,0.12) 0%, transparent 50%)",
      "radial-gradient(ellipse 80% 50% at 100% 100%, rgba(56,189,248,0.1) 0%, transparent 50%)",
      "linear-gradient(135deg, #fafafa 0%, #f5f3ff 50%, #f0fdfa 100%)"
    ),
  },
  crystal: {
    label: "Ivoire",
    price: 180,
    dark: false,
    desc: "Lumière studio",
    bg: mesh(
      "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(255,255,255,0.9) 0%, transparent 70%)",
      "radial-gradient(ellipse 60% 40% at 80% 90%, rgba(199,210,254,0.15) 0%, transparent 55%)",
      "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)"
    ),
  },
  topography: {
    label: "Sable",
    price: 100,
    dark: false,
    desc: "Beige minimal",
    bg: mesh(
      "radial-gradient(ellipse 100% 80% at 50% 100%, rgba(120,113,108,0.08) 0%, transparent 55%)",
      "linear-gradient(180deg, #fafaf9 0%, #f5f5f4 100%)"
    ),
  },
  honeycomb: {
    label: "Nuage",
    price: 100,
    dark: false,
    desc: "Blanc bleut—",
    bg: mesh(
      "radial-gradient(ellipse 90% 60% at 50% 30%, rgba(255,255,255,0.95) 0%, transparent 65%)",
      "linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)"
    ),
  },
  bubbles: {
    label: "Ciel",
    price: 90,
    dark: false,
    desc: "Bleu ciel léger",
    bg: mesh(
      "radial-gradient(ellipse 70% 50% at 20% 20%, rgba(125,211,252,0.2) 0%, transparent 55%)",
      "radial-gradient(ellipse 60% 45% at 85% 70%, rgba(167,139,250,0.12) 0%, transparent 50%)",
      "linear-gradient(180deg, #f0f9ff 0%, #f8fafc 100%)"
    ),
  },
  confetti: {
    label: "Vanille",
    price: 120,
    dark: false,
    desc: "Crème uni",
    bg: "linear-gradient(180deg, #fffef7 0%, #fafaf9 100%)",
  },
  midnight: {
    label: "Minuit",
    price: 100,
    dark: true,
    desc: "Bleu nuit profond",
    bg: mesh(
      "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(99,102,241,0.2) 0%, transparent 55%)",
      "radial-gradient(ellipse 60% 40% at 100% 80%, rgba(30,58,138,0.35) 0%, transparent 50%)",
      "linear-gradient(180deg, #020617 0%, #0f172a 55%, #020617 100%)"
    ),
  },
  aurore: {
    label: "Aurore",
    price: 100,
    dark: true,
    desc: "Lueurs borçales",
    bg: mesh(
      "radial-gradient(ellipse 70% 45% at 15% 60%, rgba(52,211,153,0.15) 0%, transparent 60%)",
      "radial-gradient(ellipse 60% 50% at 85% 25%, rgba(139,92,246,0.18) 0%, transparent 55%)",
      "radial-gradient(ellipse 50% 40% at 50% 100%, rgba(56,189,248,0.12) 0%, transparent 50%)",
      "linear-gradient(165deg, #0c0a14 0%, #12101f 50%, #0a0f1a 100%)"
    ),
  },
  cosmos: {
    label: "Nuit",
    price: 120,
    dark: true,
    desc: "Noir —toilà discret",
    bg: mesh(
      "radial-gradient(ellipse 100% 60% at 50% -10%, rgba(67,56,202,0.25) 0%, transparent 50%)",
      "linear-gradient(180deg, #030712 0%, #0f172a 50%, #020617 100%)"
    ),
  },
  sunset: {
    label: "Cr—puscule",
    price: 110,
    dark: true,
    desc: "Orange doux en bas",
    bg: mesh(
      "radial-gradient(ellipse 90% 45% at 50% 110%, rgba(249,115,22,0.22) 0%, transparent 55%)",
      "radial-gradient(ellipse 60% 40% at 20% 30%, rgba(139,92,246,0.1) 0%, transparent 50%)",
      "linear-gradient(180deg, #0f0a0a 0%, #1c1917 60%, #292524 100%)"
    ),
  },
  tropical: {
    label: "For—t",
    price: 120,
    dark: true,
    desc: "Vert profond",
    bg: mesh(
      "radial-gradient(ellipse 70% 50% at 0% 100%, rgba(22,163,74,0.2) 0%, transparent 55%)",
      "radial-gradient(ellipse 60% 45% at 100% 0%, rgba(6,78,59,0.25) 0%, transparent 50%)",
      "linear-gradient(165deg, #022c22 0%, #052e16 50%, #0f172a 100%)"
    ),
  },
  bokeh: {
    label: "Glow",
    price: 150,
    dark: true,
    desc: "Taches lumineuses floues",
    bg: mesh(
      "radial-gradient(circle 45% at 20% 30%, rgba(139,92,246,0.2) 0%, transparent 100%)",
      "radial-gradient(circle 40% at 80% 20%, rgba(236,72,153,0.15) 0%, transparent 100%)",
      "radial-gradient(circle 35% at 60% 75%, rgba(59,130,246,0.15) 0%, transparent 100%)",
      "linear-gradient(180deg, #09090b 0%, #18181b 100%)"
    ),
  },
  wave: {
    label: "Ardoise",
    price: 130,
    dark: true,
    desc: "Bleu ardoise",
    bg: mesh(
      "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(71,85,105,0.3) 0%, transparent 55%)",
      "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)"
    ),
  },
  matrix: {
    label: "Charbon",
    price: 150,
    dark: true,
    desc: "Gris anthracite",
    bg: mesh(
      "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(34,197,94,0.06) 0%, transparent 55%)",
      "linear-gradient(180deg, #0a0a0a 0%, #171717 100%)"
    ),
  },
  neonCity: {
    label: "Nçon",
    price: 180,
    dark: true,
    desc: "Violet —lectrique",
    bg: mesh(
      "radial-gradient(ellipse 80% 50% at 50% 100%, rgba(139,92,246,0.35) 0%, transparent 55%)",
      "radial-gradient(ellipse 50% 40% at 0% 0%, rgba(34,211,238,0.12) 0%, transparent 50%)",
      "linear-gradient(180deg, #030014 0%, #0f0520 50%, #000000 100%)"
    ),
  },
  vaporwave: {
    label: "Synth",
    price: 170,
    dark: true,
    desc: "Rose & bleu nuit",
    bg: mesh(
      "radial-gradient(ellipse 60% 40% at 50% 35%, rgba(236,72,153,0.15) 0%, transparent 55%)",
      "radial-gradient(ellipse 70% 50% at 50% 100%, rgba(59,130,246,0.2) 0%, transparent 55%)",
      "linear-gradient(180deg, #1a0a1f 0%, #0f172a 100%)"
    ),
  },
  deepOcean: {
    label: "Abysses",
    price: 140,
    dark: true,
    desc: "Bleu ocçan",
    bg: mesh(
      "radial-gradient(ellipse 70% 45% at 30% 80%, rgba(8,145,178,0.25) 0%, transparent 55%)",
      "linear-gradient(180deg, #042f2e 0%, #0c4a6e 50%, #020617 100%)"
    ),
  },
  fireworks: {
    label: "Velours",
    price: 200,
    dark: true,
    desc: "Noir velours",
    bg: mesh(
      "radial-gradient(ellipse 50% 35% at 70% 20%, rgba(168,85,247,0.12) 0%, transparent 55%)",
      "radial-gradient(ellipse 45% 30% at 20% 60%, rgba(59,130,246,0.1) 0%, transparent 50%)",
      "#09090b"
    ),
  },
  synthwave: {
    label: "Sunset dark",
    price: 180,
    dark: true,
    desc: "Coucher sombre",
    bg: mesh(
      "radial-gradient(ellipse 70% 35% at 50% 95%, rgba(234,88,12,0.25) 0%, transparent 55%)",
      "linear-gradient(180deg, #1a0a12 0%, #2d1b2e 50%, #0f0a0f 100%)"
    ),
  },
  circuit: {
    label: "Graphite",
    price: 120,
    dark: true,
    desc: "Tech sobre",
    bg: mesh(
      "radial-gradient(ellipse 60% 40% at 100% 0%, rgba(99,102,241,0.15) 0%, transparent 50%)",
      "linear-gradient(160deg, #111827 0%, #1f2937 100%)"
    ),
  },
  ...PAGE_BG_PHOTOS,
};

/** Cl’s qui d’clenchent une animation overlay très l’gère */
export const PAGE_BG_OVERLAY: Record<string, "stars" | "aurora" | "none"> = {
  cosmos: "stars",
  midnight: "stars",
  fireworks: "stars",
  aurore: "aurora",
  bokeh: "aurora",
  neonCity: "aurora",
};
