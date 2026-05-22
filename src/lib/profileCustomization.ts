import type { CSSProperties } from "react";

export type PageStyle = {
  pageBg: string;
  cardStyle: string;
  nameEffect: string;
  vitrineFrame: string;
  avatarFrame: string;
};

export const DEFAULT_PAGE_STYLE: PageStyle = {
  pageBg: "defaut",
  cardStyle: "defaut",
  nameEffect: "defaut",
  vitrineFrame: "defaut",
  avatarFrame: "defaut",
};

export type SalonDecoPlacement = {
  x: number;
  y: number;
  scale: number;
};

export type SalonConfig = {
  theme: string;
  titre: string;
  motto: string;
  deco: string[];
  /** Position et taille libres par id de sticker (cle = em). */
  decoLayout?: Record<string, SalonDecoPlacement>;
};
export const DEFAULT_SALON: SalonConfig = { theme:"defaut", titre:"", motto:"", deco:[] };

export const SALON_THEMES: Record<string,{label:string;gradient:string;accent:string;dark:boolean}> = {
  defaut:  { label:"🏠 Original",    gradient:"linear-gradient(135deg,#0B2447,#0ea5e9aa)",accent:"#22d3ee",dark:true  },
  nuit:    { label:"🌄 Nuit",         gradient:"linear-gradient(135deg,#0f0c29,#302b63,#24243e)",accent:"#a78bfa",dark:true  },
  sunset:  { label:"🌅 Sunset",       gradient:"linear-gradient(135deg,#7f1d1d,#f97316,#fbbf24)",accent:"#fbbf24",dark:true  },
  ocean:   { label:"🌊 Ocean",         gradient:"linear-gradient(135deg,#0369a1,#3b82f6,#38bdf8)",accent:"#7dd3fc",dark:true  },
  sakura:  { label:"🌸 Sakura",        gradient:"linear-gradient(135deg,#831843,#ec4899,#f9a8d4)",accent:"#fbcfe8",dark:true  },
  galaxy:  { label:"✨ Galaxie",          gradient:"linear-gradient(135deg,#1e1b4b,#7c3aed,#db2777)",accent:"#c084fc",dark:true  },
  brat:    { label:"🍏 Brat",          gradient:"linear-gradient(135deg,#365314,#84cc16,#d9f99d)",accent:"#a3e635",dark:false },
  golden:  { label:"🌟 Golden",        gradient:"linear-gradient(135deg,#78350f,#d97706,#fef08a)",accent:"#fde68a",dark:true  },
  arctic:  { label:"❄️ Arctic",     gradient:"linear-gradient(135deg,#e0f2fe,#bfdbfe,#a5f3fc)",accent:"#0369a1",dark:false },
  foret:   { label:"🌳 Forêt",    gradient:"linear-gradient(135deg,#052e16,#166534,#34d399)",accent:"#6ee7b7",dark:true  },
  neon:    { label:"💡 Néon",     gradient:"linear-gradient(135deg,#0f172a,#1e1b4b,#0f172a)",accent:"#00f5ff",dark:true  },
  candy:   { label:"🍬 Candy",         gradient:"linear-gradient(135deg,#fce7f3,#f9a8d4,#e879f9)",accent:"#c026d3",dark:false },
  desert:  { label:"🏜️ Désert",gradient:"linear-gradient(135deg,#7c2d12,#ea580c,#fed7aa)",accent:"#fb923c",dark:true  },
  glacier: { label:"🥶 Glacier",        gradient:"linear-gradient(135deg,#0c4a6e,#075985,#38bdf8)",accent:"#bae6fd",dark:true  },
};

// ── PAGE STYLE ────────────────────────────────────────────────────────────────
export type { BgDef, BgKind, BgCategory } from "./pageBgTypes";
export { PAGE_BG, PAGE_BG_OVERLAY } from "./pageBackgrounds";
export { PAGE_BG_PHOTOS } from "./pagePhotoBackgrounds";
export {
  pageBgCss,
  pageBgFullScreen,
  isPhotoPageBg,
  PAGE_BG_FILTER_CHIPS,
  pageBgMatchesFilter,
} from "./pageBgUtils";
export type { PageBgFilterId } from "./pageBgUtils";

export const CARD_STYLE: Record<string,{label:string;price:number;desc:string}> = {
  defaut:    { label:"Standard",        price:0,   desc:"Cartes blanches classiques" },
  glass:     { label:"🌀 Verre",   price:120, desc:"Effet verre givré" },
  darkglass: { label:"🖤 Dark glass",price:150,desc:"Verre fumé sombre" },
  neon:      { label:"💡 Néon", price:200, desc:"Bords lumineux colorés" },
  minimal:   { label:"📋 Minimal",  price:80,  desc:"Bords arrondis ultra-fins" },
};

export const NAME_EFFECT: Record<string,{label:string;price:number;style:CSSProperties}> = {
  defaut:   { label:"Normal",           price:0,   style:{} },
  gradient: { label:"🌈 Dégradé",price:100, style:{background:"linear-gradient(90deg,#a78bfa,#ec4899,#f59e0b)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"} },
  neon:     { label:"💡 Néon",  price:150, style:{color:"#00f5ff",textShadow:"0 0 20px #00f5ff,0 0 40px #00f5ff88"} },
  gold:     { label:"🌟 Or",         price:120, style:{background:"linear-gradient(90deg,#f59e0b,#fef08a,#d97706)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"} },
  shadow:   { label:"🖤 Shadow",     price:80,  style:{textShadow:"0 4px 16px rgba(0,0,0,0.7),0 0 40px rgba(0,0,0,0.4)"} },
};

export const VITRINE_FRAME: Record<string,{label:string;price:number;border:string;shadow:string}> = {
  defaut:    { label:"Standard",         price:0,   border:"2px dashed {c}",     shadow:"none" },
  glow:      { label:"✨ Lueur",       price:100, border:"2px solid {c}",      shadow:"0 0 16px {c}88" },
  prismatic: { label:"🌈 Prismatique",price:250,border:"3px solid transparent",shadow:"0 0 20px rgba(167,139,250,0.6)" },
  gold:      { label:"🥇 Or",        price:200, border:"2px solid #fbbf24",  shadow:"0 0 18px #fbbf2488" },
  neon:      { label:"💡 Néon", price:180, border:"2px solid #00f5ff",  shadow:"0 0 14px #00f5ff88" },
};

// Prix des thèmes salon (jetons) — "defaut" = pack de base (0), voir profileBasePack.ts
export const THEME_PRICES: Record<string, number> = {
  defaut: 0,
  nuit: 60,
  ocean: 60,
  sunset: 80,
  sakura: 100,
  galaxy: 120,
  brat: 60,
  golden: 150,
  arctic: 80,
  foret: 80,
  neon: 200,
  candy: 60,
  desert: 100,
  glacier: 120,
};

export const AVATAR_FRAME: Record<
  string,
  { label: string; price: number; ring: string; glow: string; pad: number; inner: string }
> = {
  defaut: {
    label: "Classique",
    price: 0,
    ring: "linear-gradient(135deg, {c}, #a78bfa 45%, #22d3ee)",
    glow: "0 12px 36px {c}44, 0 0 0 1px rgba(255,255,255,0.15)",
    pad: 4,
    inner: "rgba(15,23,42,0.88)",
  },
  halo: {
    label: "\u2728 Halo",
    price: 120,
    ring: "linear-gradient(135deg, #fff, {c} 40%, #ec4899)",
    glow: "0 0 28px {c}66, 0 0 48px rgba(167,139,250,0.35)",
    pad: 5,
    inner: "rgba(15,23,42,0.92)",
  },
  gold: {
    label: "\u{1F947} Or",
    price: 180,
    ring: "linear-gradient(135deg, #fde68a, #f59e0b 50%, #b45309)",
    glow: "0 0 24px rgba(251,191,36,0.55), 0 8px 28px rgba(0,0,0,0.35)",
    pad: 5,
    inner: "linear-gradient(145deg, #1c1917, #0f172a)",
  },
  neon: {
    label: "\u{1F4A1} Neon",
    price: 200,
    ring: "linear-gradient(135deg, #00f5ff, {c}, #a78bfa)",
    glow: "0 0 22px #00f5ff88, 0 0 40px {c}44",
    pad: 4,
    inner: "rgba(7,10,18,0.95)",
  },
  prismatic: {
    label: "\u{1F308} Prisme",
    price: 250,
    ring: "conic-gradient(from 200deg, #f472b6, #a78bfa, #38bdf8, #4ade80, #fbbf24, #f472b6)",
    glow: "0 0 32px rgba(167,139,250,0.5), 0 12px 32px rgba(0,0,0,0.3)",
    pad: 6,
    inner: "rgba(15,23,42,0.9)",
  },
  crown: {
    label: "\u{1F451} Royal",
    price: 220,
    ring: "linear-gradient(135deg, {c} 0%, #fbbf24 35%, {c} 70%, #a78bfa 100%)",
    glow: "0 0 0 3px rgba(251,191,36,0.35), 0 14px 40px rgba(0,0,0,0.4)",
    pad: 5,
    inner: "radial-gradient(circle at 50% 30%, #334155 0%, #0f172a 70%)",
  },
  soft: {
    label: "\u{1F49C} Doux",
    price: 90,
    ring: "linear-gradient(135deg, rgba(255,255,255,0.9), {c}88)",
    glow: "0 16px 40px rgba(0,0,0,0.25)",
    pad: 3,
    inner: "rgba(255,255,255,0.12)",
  },
};

export { MAX_SALON_DECOS, decoItemPrice } from "./profileDecoPrices";

// Stickers déco — voir profileDecoCatalog.ts (Noto, Solar, Fluent local)
export { DECO_CATS } from "./profileDecoCatalog";

// Positions des decos dans le hero (max 10)
export const DECO_POSITIONS = [
  { top: "8%", left: "3%", fontSize: "1.75rem", animation: "decoFloat0" },
  { top: "5%", right: "3%", fontSize: "1.65rem", animation: "decoFloat1" },
  { top: "20%", left: "1%", fontSize: "1.45rem", animation: "decoFloat2" },
  { top: "17%", right: "1%", fontSize: "1.5rem", animation: "decoFloat3" },
  { bottom: "24%", left: "2%", fontSize: "1.55rem", animation: "decoFloat0" },
  { bottom: "22%", right: "2%", fontSize: "1.7rem", animation: "decoFloat1" },
  { bottom: "10%", left: "14%", fontSize: "1.4rem", animation: "decoFloat2" },
  { bottom: "12%", right: "14%", fontSize: "1.45rem", animation: "decoFloat3" },
  { top: "36%", left: "6%", fontSize: "1.35rem", animation: "decoFloat0" },
  { top: "34%", right: "6%", fontSize: "1.35rem", animation: "decoFloat1" },
];

