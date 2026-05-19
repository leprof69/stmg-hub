import React, { useState, useEffect, useRef } from "react";
import { auth, db } from "../services/firebase";
import { doc, updateDoc, getDoc, collection, query, where, getDocs, runTransaction, serverTimestamp } from "firebase/firestore";
import { COLLECTIONS } from "../services/collectionsData";
import { formatJetons } from "../lib/jetons";
import { AvatarSVG, DEFAULT_AVATAR } from "./AvatarCreator";
import type { AvatarConfig } from "./AvatarCreator";
import { Icon } from "@iconify/react";
import Lottie from "lottie-react";

// ---------------------------------------------------------------------------
// SALON
// ---------------------------------------------------------------------------
type SalonConfig = {
  theme: string;
  titre: string;
  motto: string;
  deco: string[];
};
const DEFAULT_SALON: SalonConfig = { theme:"defaut", titre:"", motto:"", deco:[] };

const SALON_THEMES: Record<string,{label:string;gradient:string;accent:string;dark:boolean}> = {
  defaut:  { label:"\u{1F3E0} Original",    gradient:"linear-gradient(135deg,#0B2447,#0ea5e9aa)",accent:"#22d3ee",dark:true  },
  nuit:    { label:"\u{1F304} Nuit",         gradient:"linear-gradient(135deg,#0f0c29,#302b63,#24243e)",accent:"#a78bfa",dark:true  },
  sunset:  { label:"\u{1F305} Sunset",       gradient:"linear-gradient(135deg,#7f1d1d,#f97316,#fbbf24)",accent:"#fbbf24",dark:true  },
  ocean:   { label:"\u{1F30A} Ocean",         gradient:"linear-gradient(135deg,#0369a1,#3b82f6,#38bdf8)",accent:"#7dd3fc",dark:true  },
  sakura:  { label:"\u{1F338} Sakura",        gradient:"linear-gradient(135deg,#831843,#ec4899,#f9a8d4)",accent:"#fbcfe8",dark:true  },
  galaxy:  { label:"\u2728 Galaxie",          gradient:"linear-gradient(135deg,#1e1b4b,#7c3aed,#db2777)",accent:"#c084fc",dark:true  },
  brat:    { label:"\u{1F34F} Brat",          gradient:"linear-gradient(135deg,#365314,#84cc16,#d9f99d)",accent:"#a3e635",dark:false },
  golden:  { label:"\u{1F31F} Golden",        gradient:"linear-gradient(135deg,#78350f,#d97706,#fef08a)",accent:"#fde68a",dark:true  },
  arctic:  { label:"\u2744\ufe0f Arctic",     gradient:"linear-gradient(135deg,#e0f2fe,#bfdbfe,#a5f3fc)",accent:"#0369a1",dark:false },
  foret:   { label:"\u{1F333} For\u00eat",    gradient:"linear-gradient(135deg,#052e16,#166534,#34d399)",accent:"#6ee7b7",dark:true  },
  neon:    { label:"\u{1F4A1} N\u00e9on",     gradient:"linear-gradient(135deg,#0f172a,#1e1b4b,#0f172a)",accent:"#00f5ff",dark:true  },
  candy:   { label:"\u{1F36C} Candy",         gradient:"linear-gradient(135deg,#fce7f3,#f9a8d4,#e879f9)",accent:"#c026d3",dark:false },
  desert:  { label:"\u{1F3DC}\ufe0f D\u00e9sert",gradient:"linear-gradient(135deg,#7c2d12,#ea580c,#fed7aa)",accent:"#fb923c",dark:true  },
  glacier: { label:"\u{1F976} Glacier",        gradient:"linear-gradient(135deg,#0c4a6e,#075985,#38bdf8)",accent:"#bae6fd",dark:true  },
};

// ── PAGE STYLE ────────────────────────────────────────────────────────────────
export type PageStyle = {
  pageBg:     string;   // fond de toute la page
  cardStyle:  string;   // style des sections (cartes blanches)
  nameEffect: string;   // effet sur le nom
  vitrineFrame:string;  // cadre vitrine
};
export const DEFAULT_PAGE_STYLE: PageStyle = {
  pageBg:"defaut", cardStyle:"defaut", nameEffect:"defaut", vitrineFrame:"defaut",
};

type BgDef = { label:string; bg:string; price:number; dark:boolean; desc?:string };
const PAGE_BG: Record<string,BgDef> = {
  defaut: {
    label:"Classique", price:0, dark:false,
    bg:"linear-gradient(135deg,#eef2ff 0%,#e0e7ff 40%,#f5f3ff 100%)",
  },
  candy: {
    label:"\u{1F36C} Candy", price:0, dark:false, desc:"Pois color\u00e9s pastel",
    bg:[
      "radial-gradient(circle,#f9a8d455 2px,transparent 2px) 0 0/22px 22px",
      "radial-gradient(circle,#c4b5fd45 2.5px,transparent 2.5px) 11px 11px/33px 33px",
      "radial-gradient(circle,#fb923c35 1.5px,transparent 1.5px) 6px 18px/18px 18px",
      "radial-gradient(circle,#86efac40 2px,transparent 2px) 20px 5px/28px 28px",
      "linear-gradient(160deg,#fdf4ff 0%,#fce7f3 50%,#eff6ff 100%)",
    ].join(","),
  },
  sakura: {
    label:"\u{1F338} Sakura", price:80, dark:false, desc:"P\u00e9tales de cerisier",
    bg:[
      "radial-gradient(circle,#fda4af60 2.5px,transparent 2.5px) 0 0/38px 38px",
      "radial-gradient(circle,#fb718550 2px,transparent 2px) 19px 22px/46px 46px",
      "radial-gradient(circle,#f9a8d445 1.5px,transparent 1.5px) 8px 32px/28px 28px",
      "radial-gradient(ellipse 8px 5px,#fecdd355 0%,transparent 100%) 25px 10px/50px 50px",
      "linear-gradient(160deg,#fff0f6 0%,#fce7f3 50%,#fff7ed 100%)",
    ].join(","),
  },
  aurore: {
    label:"\u{1F300} Aurore", price:100, dark:true, desc:"Lumi\u00e8res bor\u00e9ales",
    bg:[
      "radial-gradient(ellipse 80% 40% at 20% 60%,rgba(74,222,128,0.22) 0%,transparent 70%)",
      "radial-gradient(ellipse 60% 50% at 80% 30%,rgba(167,139,250,0.30) 0%,transparent 70%)",
      "radial-gradient(ellipse 70% 35% at 50% 80%,rgba(56,189,248,0.18) 0%,transparent 70%)",
      "radial-gradient(ellipse 50% 60% at 10% 20%,rgba(52,211,153,0.15) 0%,transparent 70%)",
      "linear-gradient(160deg,#0f172a 0%,#312e81 40%,#1e1b4b 100%)",
    ].join(","),
  },
  cosmos: {
    label:"\u2728 Cosmos", price:150, dark:true, desc:"Champ d\u2019\u00e9toiles",
    bg:[
      "radial-gradient(circle,rgba(255,255,255,0.9) 1px,transparent 1px) 0 0/45px 45px",
      "radial-gradient(circle,rgba(255,255,255,0.6) 0.5px,transparent 0.5px) 15px 25px/30px 30px",
      "radial-gradient(circle,rgba(167,139,250,0.8) 1.5px,transparent 1.5px) 8px 40px/70px 70px",
      "radial-gradient(circle,rgba(96,165,250,0.7) 1px,transparent 1px) 35px 10px/55px 55px",
      "radial-gradient(circle,rgba(255,255,255,0.4) 0.8px,transparent 0.8px) 28px 50px/38px 38px",
      "linear-gradient(160deg,#020617 0%,#1e1b4b 50%,#0f172a 100%)",
    ].join(","),
  },
  sunset: {
    label:"\u{1F305} Sunset", price:130, dark:true, desc:"Ciel en feu",
    bg:[
      "radial-gradient(ellipse 70% 50% at 50% 100%,rgba(251,191,36,0.35) 0%,transparent 70%)",
      "radial-gradient(ellipse 40% 30% at 25% 80%,rgba(239,68,68,0.20) 0%,transparent 60%)",
      "radial-gradient(ellipse 40% 30% at 75% 75%,rgba(249,115,22,0.22) 0%,transparent 60%)",
      "linear-gradient(160deg,#1c1917 0%,#7c2d12 40%,#92400e 100%)",
    ].join(","),
  },
  tropical: {
    label:"\u{1F334} Tropical", price:150, dark:true, desc:"For\u00eat tropicale",
    bg:[
      "radial-gradient(ellipse 14px 28px at 12% 18%,rgba(74,222,128,0.18) 0%,transparent 100%)",
      "radial-gradient(ellipse 18px 35px at 70% 10%,rgba(34,197,94,0.14) 0%,transparent 100%) 0 0/110px 110px",
      "radial-gradient(ellipse 12px 24px at 40% 65%,rgba(74,222,128,0.12) 0%,transparent 100%) 55px 55px/110px 110px",
      "radial-gradient(ellipse 20px 38px at 85% 55%,rgba(22,163,74,0.16) 0%,transparent 100%) 0 0/130px 130px",
      "linear-gradient(160deg,#052e16 0%,#14532d 40%,#0c4a6e 100%)",
    ].join(","),
  },
  bokeh: {
    label:"\u{1F4A1} Boh\u00e8me", price:200, dark:true, desc:"Lumi\u00e8res flottantes",
    bg:[
      "radial-gradient(circle 35px at 15% 25%,rgba(167,139,250,0.3) 0%,transparent 70%)",
      "radial-gradient(circle 50px at 80% 15%,rgba(244,114,182,0.25) 0%,transparent 70%)",
      "radial-gradient(circle 28px at 55% 60%,rgba(96,165,250,0.28) 0%,transparent 70%)",
      "radial-gradient(circle 42px at 20% 75%,rgba(52,211,153,0.22) 0%,transparent 70%)",
      "radial-gradient(circle 38px at 90% 70%,rgba(251,191,36,0.20) 0%,transparent 70%)",
      "radial-gradient(circle 22px at 45% 15%,rgba(167,139,250,0.25) 0%,transparent 70%)",
      "linear-gradient(135deg,#0f172a 0%,#1e1b4b 100%)",
    ].join(","),
  },
  confetti: {
    label:"\u{1F389} Conf\u00e9tti", price:160, dark:false, desc:"Petits carr\u00e9s color\u00e9s",
    bg:[
      "linear-gradient(45deg,#f472b655 0%,#f472b655 25%,transparent 25%) 0 0/12px 12px",
      "linear-gradient(-45deg,transparent 75%,#60a5fa55 75%) 0 0/12px 12px",
      "linear-gradient(45deg,transparent 75%,#4ade8055 75%) 6px 6px/12px 12px",
      "linear-gradient(-45deg,#fbbf2455 0%,#fbbf2455 25%,transparent 25%) 6px 6px/12px 12px",
      "linear-gradient(160deg,#fff 0%,#f8fafc 50%,#f0fdf4 100%)",
    ].join(","),
  },
  wave: {
    label:"\u{1F30A} Vague", price:180, dark:true, desc:"Motif g\u00e9om\u00e9trique",
    bg:[
      "repeating-linear-gradient(60deg,rgba(96,165,250,0.08) 0px,rgba(96,165,250,0.08) 1px,transparent 1px,transparent 30px)",
      "repeating-linear-gradient(-60deg,rgba(167,139,250,0.08) 0px,rgba(167,139,250,0.08) 1px,transparent 1px,transparent 30px)",
      "repeating-linear-gradient(0deg,rgba(56,189,248,0.06) 0px,rgba(56,189,248,0.06) 1px,transparent 1px,transparent 30px)",
      "linear-gradient(160deg,#0c4a6e 0%,#1e3a5f 50%,#0f172a 100%)",
    ].join(","),
  },
  matrix: {
    label:"\u{1F4BB} Matrix", price:220, dark:true, desc:"Code vert style hacker",
    bg:[
      "repeating-linear-gradient(90deg,rgba(0,255,65,0.04) 0px,rgba(0,255,65,0.04) 1px,transparent 1px,transparent 20px)",
      "repeating-linear-gradient(0deg,rgba(0,255,65,0.04) 0px,rgba(0,255,65,0.04) 1px,transparent 1px,transparent 20px)",
      "radial-gradient(ellipse at 50% 0%,rgba(0,255,65,0.12) 0%,transparent 60%)",
      "linear-gradient(160deg,#000 0%,#001a00 50%,#000d00 100%)",
    ].join(","),
  },
  holographic: {
    label:"\u{1F308} Holographique", price:300, dark:false, desc:"Arc-en-ciel iridescent",
    bg:[
      "repeating-linear-gradient(45deg,rgba(255,0,128,0.06) 0px,rgba(255,165,0,0.06) 10px,rgba(0,255,128,0.06) 20px,rgba(0,128,255,0.06) 30px,rgba(128,0,255,0.06) 40px,rgba(255,0,128,0.06) 50px)",
      "radial-gradient(ellipse at 30% 40%,rgba(167,139,250,0.15) 0%,transparent 60%)",
      "radial-gradient(ellipse at 70% 60%,rgba(244,114,182,0.12) 0%,transparent 60%)",
      "linear-gradient(135deg,#f8fafc 0%,#fef9ff 50%,#f0f9ff 100%)",
    ].join(","),
  },
  // ── FONDS ULTRA-VISUELS ──────────────────────────────────────────────────────
  neonCity: {
    label:"\u{1F3D9}\uFE0F N\u00e9on City", price:250, dark:true, desc:"Grille futuriste n\u00e9on",
    bg:[
      "linear-gradient(rgba(139,92,246,0.18) 1px,transparent 1px) 0 0/40px 40px",
      "linear-gradient(90deg,rgba(139,92,246,0.18) 1px,transparent 1px) 0 0/40px 40px",
      "radial-gradient(ellipse at 50% 100%,rgba(139,92,246,0.55) 0%,transparent 60%)",
      "radial-gradient(ellipse at 20% 50%,rgba(0,245,255,0.18) 0%,transparent 40%)",
      "radial-gradient(ellipse at 80% 30%,rgba(236,72,153,0.12) 0%,transparent 40%)",
      "linear-gradient(180deg,#000 0%,#050010 60%,#0d0019 100%)",
    ].join(","),
  },
  vaporwave: {
    label:"\u{1F305} Vaporwave", price:240, dark:true, desc:"Esth\u00e9tique r\u00e9tro-futuriste",
    bg:[
      "linear-gradient(rgba(255,0,200,0.12) 1px,transparent 1px) 0 0/30px 30px",
      "linear-gradient(90deg,rgba(0,200,255,0.12) 1px,transparent 1px) 0 0/30px 30px",
      "radial-gradient(circle at 50% 30%,rgba(255,200,0,0.38) 0%,rgba(255,80,200,0.22) 22%,transparent 48%)",
      "radial-gradient(ellipse at 0% 100%,rgba(100,0,200,0.35) 0%,transparent 50%)",
      "radial-gradient(ellipse at 100% 100%,rgba(0,200,255,0.22) 0%,transparent 50%)",
      "linear-gradient(160deg,#1a0033 0%,#2d0054 35%,#0d1a33 70%,#000 100%)",
    ].join(","),
  },
  deepOcean: {
    label:"\u{1F30A} Oc\u00e9an Profond", price:200, dark:true, desc:"Abysses illumin\u00e9s",
    bg:[
      "radial-gradient(circle,rgba(0,255,255,0.18) 1px,transparent 1px) 0 0/32px 32px",
      "radial-gradient(circle,rgba(0,200,255,0.12) 1px,transparent 1px) 16px 16px/48px 48px",
      "radial-gradient(ellipse at 30% 70%,rgba(0,200,255,0.28) 0%,transparent 50%)",
      "radial-gradient(ellipse at 70% 20%,rgba(0,255,200,0.22) 0%,transparent 50%)",
      "radial-gradient(ellipse at 50% 50%,rgba(56,189,248,0.12) 0%,transparent 60%)",
      "linear-gradient(160deg,#000d1a 0%,#001a2e 40%,#002244 70%,#00141e 100%)",
    ].join(","),
  },
  fireworks: {
    label:"\u{1F386} Feu d\u2019Artifice", price:280, dark:true, desc:"Explosions de couleurs",
    bg:[
      "radial-gradient(circle at 20% 30%,rgba(255,100,0,0.38) 0%,transparent 30%)",
      "radial-gradient(circle at 80% 20%,rgba(255,0,100,0.32) 0%,transparent 25%)",
      "radial-gradient(circle at 50% 60%,rgba(120,0,255,0.28) 0%,transparent 35%)",
      "radial-gradient(circle at 10% 80%,rgba(0,200,255,0.28) 0%,transparent 30%)",
      "radial-gradient(circle at 90% 70%,rgba(0,255,100,0.22) 0%,transparent 30%)",
      "radial-gradient(circle at 60% 10%,rgba(255,220,0,0.22) 0%,transparent 25%)",
      "radial-gradient(circle at 35% 50%,rgba(255,50,150,0.18) 0%,transparent 35%)",
      "#000",
    ].join(","),
  },
  crystal: {
    label:"\u{1F48E} Cristal", price:220, dark:false, desc:"G\u00e9om\u00e9trie lumineuse",
    bg:[
      "linear-gradient(60deg,rgba(139,92,246,0.09) 25%,transparent 25%) 0 0/24px 42px",
      "linear-gradient(-60deg,rgba(59,130,246,0.09) 25%,transparent 25%) 0 0/24px 42px",
      "linear-gradient(60deg,transparent 75%,rgba(236,72,153,0.07) 75%) 12px 21px/24px 42px",
      "linear-gradient(-60deg,transparent 75%,rgba(6,182,212,0.08) 75%) 12px 21px/24px 42px",
      "radial-gradient(ellipse at 20% 30%,rgba(139,92,246,0.18) 0%,transparent 50%)",
      "radial-gradient(ellipse at 80% 70%,rgba(59,130,246,0.14) 0%,transparent 50%)",
      "radial-gradient(ellipse at 60% 10%,rgba(236,72,153,0.10) 0%,transparent 40%)",
      "linear-gradient(135deg,#ffffff 0%,#f0f4ff 40%,#faf5ff 70%,#f0f9ff 100%)",
    ].join(","),
  },
  synthwave: {
    label:"\u{1F304} Synthwave", price:260, dark:true, desc:"Coucher de soleil dramatique",
    bg:[
      "repeating-linear-gradient(0deg,rgba(255,100,200,0.05) 0px,rgba(255,100,200,0.05) 1px,transparent 1px,transparent 24px)",
      "radial-gradient(circle at 50% 42%,rgba(255,180,0,0.55) 0%,rgba(255,80,0,0.32) 15%,transparent 42%)",
      "radial-gradient(ellipse at 50% 0%,rgba(255,50,150,0.45) 0%,transparent 50%)",
      "radial-gradient(ellipse at 0% 100%,rgba(100,0,200,0.38) 0%,transparent 60%)",
      "radial-gradient(ellipse at 100% 100%,rgba(0,100,255,0.28) 0%,transparent 60%)",
      "linear-gradient(160deg,#0a0010 0%,#1a0028 25%,#2d0050 50%,#0f0020 75%,#000 100%)",
    ].join(","),
  },
  topography: {
    label:"\u{1F5FA}\uFE0F Topographie", price:120, dark:false, desc:"Lignes de niveau douces",
    bg:[
      `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cpath d='M100 20 Q130 50 100 80 Q70 110 100 140 Q130 170 100 200' fill='none' stroke='%236366f120' stroke-width='2'/%3E%3Cpath d='M60 20 Q90 50 60 80 Q30 110 60 140 Q90 170 60 200' fill='none' stroke='%236366f115' stroke-width='1.5'/%3E%3Cpath d='M140 20 Q170 50 140 80 Q110 110 140 140 Q170 170 140 200' fill='none' stroke='%236366f115' stroke-width='1.5'/%3E%3Cpath d='M0 60 Q40 40 80 60 Q120 80 160 60 Q180 50 200 60' fill='none' stroke='%236366f110' stroke-width='1'/%3E%3Cpath d='M0 120 Q40 100 80 120 Q120 140 160 120 Q180 110 200 120' fill='none' stroke='%236366f110' stroke-width='1'/%3E%3C/svg%3E") 0 0 / 200px 200px`,
      "linear-gradient(160deg,#f0f9ff 0%,#e0f2fe 50%,#f0fdf4 100%)",
    ].join(","),
  },
  circuit: {
    label:"\u26A1 Circuit", price:140, dark:true, desc:"Circuit imprim\u00e9 tech",
    bg:[
      `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect x='8' y='8' width='64' height='64' fill='none' stroke='%238b5cf640' stroke-width='1'/%3E%3Ccircle cx='8' cy='8' r='2.5' fill='%238b5cf680'/%3E%3Ccircle cx='72' cy='8' r='2.5' fill='%238b5cf680'/%3E%3Ccircle cx='8' cy='72' r='2.5' fill='%238b5cf680'/%3E%3Ccircle cx='72' cy='72' r='2.5' fill='%238b5cf680'/%3E%3Ccircle cx='40' cy='40' r='3' fill='%2306b6d480'/%3E%3Cpath d='M8 40h16M56 40h16M40 8v16M40 56v16' stroke='%238b5cf650' stroke-width='1'/%3E%3Cpath d='M24 24h8v8h-8zM48 48h8v8h-8z' fill='none' stroke='%2306b6d430' stroke-width='1'/%3E%3C/svg%3E") 0 0 / 80px 80px`,
      "linear-gradient(160deg,#0f0c29 0%,#1e1b4b 50%,#0f172a 100%)",
    ].join(","),
  },
  honeycomb: {
    label:"\u{1F36F} Honeycomb", price:130, dark:false, desc:"Hexagones g\u00e9om\u00e9triques",
    bg:[
      `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100'%3E%3Cpath d='M28 3 L53 18 L53 48 L28 63 L3 48 L3 18 Z' fill='none' stroke='%236366f125' stroke-width='1.5'/%3E%3Cpath d='M28 53 L53 68 L53 98 L28 113 L3 98 L3 68 Z' fill='none' stroke='%236366f120' stroke-width='1.5'/%3E%3C/svg%3E") 0 0 / 56px 100px`,
      "linear-gradient(160deg,#fafafa 0%,#f0f4ff 50%,#fdf4ff 100%)",
    ].join(","),
  },
  bubbles: {
    label:"\u{1FAE7} Bulles", price:110, dark:false, desc:"Cercles color\u00e9s flottants",
    bg:[
      "radial-gradient(circle 32px at 18% 22%,rgba(167,139,250,0.18) 0%,transparent 70%)",
      "radial-gradient(circle 22px at 78% 14%,rgba(244,114,182,0.16) 0%,transparent 70%)",
      "radial-gradient(circle 28px at 58% 54%,rgba(96,165,250,0.15) 0%,transparent 70%)",
      "radial-gradient(circle 18px at 8% 68%,rgba(52,211,153,0.14) 0%,transparent 70%)",
      "radial-gradient(circle 26px at 88% 72%,rgba(251,191,36,0.15) 0%,transparent 70%)",
      "radial-gradient(circle 20px at 42% 88%,rgba(167,139,250,0.13) 0%,transparent 70%)",
      "radial-gradient(circle 16px at 28% 42%,rgba(244,114,182,0.14) 0%,transparent 70%)",
      "radial-gradient(circle 24px at 65% 30%,rgba(96,165,250,0.12) 0%,transparent 70%)",
      "linear-gradient(160deg,#fafbff 0%,#f5f0ff 40%,#fff0f7 70%,#f0fff8 100%)",
    ].join(","),
  },
};

const CARD_STYLE: Record<string,{label:string;price:number;desc:string}> = {
  defaut:    { label:"Standard",        price:0,   desc:"Cartes blanches classiques" },
  glass:     { label:"\u{1F300} Verre",   price:120, desc:"Effet verre givre\u0301" },
  darkglass: { label:"\u{1F5A4} Dark glass",price:150,desc:"Verre fum\u00e9 sombre" },
  neon:      { label:"\u{1F4A1} N\u00e9on", price:200, desc:"Bords lumineux color\u00e9s" },
  minimal:   { label:"\u{1F4CB} Minimal",  price:80,  desc:"Bords arrondis ultra-fins" },
};

const NAME_EFFECT: Record<string,{label:string;price:number;style:React.CSSProperties}> = {
  defaut:   { label:"Normal",           price:0,   style:{} },
  gradient: { label:"\u{1F308} Dgrad\u00e9",price:100, style:{background:"linear-gradient(90deg,#a78bfa,#ec4899,#f59e0b)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"} },
  neon:     { label:"\u{1F4A1} N\u00e9on",  price:150, style:{color:"#00f5ff",textShadow:"0 0 20px #00f5ff,0 0 40px #00f5ff88"} },
  gold:     { label:"\u{1F31F} Or",         price:120, style:{background:"linear-gradient(90deg,#f59e0b,#fef08a,#d97706)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"} },
  shadow:   { label:"\u{1F5A4} Shadow",     price:80,  style:{textShadow:"0 4px 16px rgba(0,0,0,0.7),0 0 40px rgba(0,0,0,0.4)"} },
};

const VITRINE_FRAME: Record<string,{label:string;price:number;border:string;shadow:string}> = {
  defaut:    { label:"Standard",         price:0,   border:"2px dashed {c}",     shadow:"none" },
  glow:      { label:"\u2728 Lueur",       price:100, border:"2px solid {c}",      shadow:"0 0 16px {c}88" },
  prismatic: { label:"\u{1F308} Prismatique",price:250,border:"3px solid transparent",shadow:"0 0 20px rgba(167,139,250,0.6)" },
  gold:      { label:"\u{1F947} Or",        price:200, border:"2px solid #fbbf24",  shadow:"0 0 18px #fbbf2488" },
  neon:      { label:"\u{1F4A1} N\u00e9on", price:180, border:"2px solid #00f5ff",  shadow:"0 0 14px #00f5ff88" },
};

// Prix des thèmes du salon (0 = gratuit)
const THEME_PRICES: Record<string,number> = {
  defaut:0, nuit:0, ocean:0,
  sunset:80, sakura:100, galaxy:120, brat:60, golden:150,
  arctic:80, foret:80, neon:200, candy:60, desert:100, glacier:120,
};

// Stickers déco — préfixes: "lottie:URL" = Fluent animé, "icon:SET:ID" = Iconify, "emoji:X" = emoji classique, "gif:URL" = GIF
const DECO_CATS: { key: string; label: string; items: string[] }[] = [
  {
    key: "fluent1",
    label: "✨ Microsoft Animé",
    items: [
      "lottie:https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Fire/Animated/fire.json",
      "lottie:https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Sparkles/Animated/sparkles.json",
      "lottie:https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Crown/Animated/crown.json",
      "lottie:https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Rocket/Animated/rocket.json",
      "lottie:https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Rainbow/Animated/rainbow.json",
      "lottie:https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Star-struck/Animated/star-struck.json",
      "lottie:https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Party%20popper/Animated/party_popper.json",
      "lottie:https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Heart%20on%20fire/Animated/heart_on_fire.json",
      "lottie:https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Diamond%20with%20a%20dot/Animated/diamond_with_a_dot.json",
      "lottie:https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Lightning/Animated/lightning.json",
      "lottie:https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Unicorn/Animated/unicorn.json",
      "lottie:https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Dragon/Animated/dragon.json",
    ]
  },
  {
    key: "fluent2",
    label: "🐾 Créatures Animées",
    items: [
      "lottie:https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Ghost/Animated/ghost.json",
      "lottie:https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Alien%20monster/Animated/alien_monster.json",
      "lottie:https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Cat%20with%20tears%20of%20joy/Animated/cat_with_tears_of_joy.json",
      "lottie:https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Hundred%20points/Animated/hundred_points.json",
      "lottie:https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Snowflake/Animated/snowflake.json",
      "lottie:https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Sun/Animated/sun.json",
      "lottie:https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Moon%20face/Animated/moon_face.json",
      "lottie:https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Cherry%20blossom/Animated/cherry_blossom.json",
      "lottie:https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Unicorn/Animated/unicorn.json",
      "lottie:https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Dragon/Animated/dragon.json",
      "lottie:https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Ghost/Animated/ghost.json",
      "lottie:https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Alien%20monster/Animated/alien_monster.json",
    ]
  },
  {
    key: "nature",
    label: "🌿 Nature",
    items: ["emoji:🌸","emoji:🌺","emoji:🌻","emoji:🍀","emoji:🌙","emoji:⭐","emoji:🌈","emoji:❄️","emoji:🔥","emoji:💧","emoji:🍃","emoji:🌊"]
  },
  {
    key: "vibes",
    label: "💜 Vibes",
    items: ["emoji:💜","emoji:💛","emoji:🧡","emoji:❤️","emoji:💙","emoji:🖤","emoji:🤍","emoji:💚","emoji:💗","emoji:✨","emoji:🌟","emoji:⚡"]
  },
  {
    key: "sport",
    label: "🏆 Sport & Gaming",
    items: ["icon:noto:trophy","icon:noto:sports-medal","icon:noto:soccer-ball","icon:noto:basketball","icon:noto:tennis","icon:noto:video-game","icon:noto:game-die","icon:noto:joystick","icon:noto:dart","icon:noto:bullseye","icon:noto:bowling","icon:noto:8-ball"]
  },
  {
    key: "food",
    label: "🍕 Food",
    items: ["emoji:🍕","emoji:🍔","emoji:🍜","emoji:🍣","emoji:🍩","emoji:🧁","emoji:🍦","emoji:🍓","emoji:🥑","emoji:🧃","emoji:🍫","emoji:🥞"]
  },
  {
    key: "music",
    label: "🎵 Musique",
    items: ["icon:noto:musical-notes","icon:noto:headphone","icon:noto:microphone","icon:noto:guitar","icon:noto:piano","icon:noto:drum","icon:noto:saxophone","icon:noto:trumpet","icon:noto:violin","icon:noto:radio","icon:noto:speaker-high-volume","icon:noto:musical-note"]
  },
  {
    key: "space",
    label: "🚀 Space",
    items: ["icon:noto:rocket","icon:noto:ringed-planet","icon:noto:flying-saucer","icon:noto:star","icon:noto:shooting-star","icon:noto:comet","icon:noto:milky-way","icon:noto:telescope","icon:noto:moon","icon:noto:sun","icon:noto:globe-showing-europe-africa","icon:noto:satellite"]
  },
  {
    key: "reussite",
    label: "🏆 Réussite",
    items: [
      "lottie:https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Tada/Animated/tada.json",
      "lottie:https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Trophy/Animated/trophy.json",
      "lottie:https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Money%20bag/Animated/money_bag.json",
      "lottie:https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Gem%20stone/Animated/gem_stone.json",
      "lottie:https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Graduation%20cap/Animated/graduation_cap.json",
      "lottie:https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Flexed%20biceps/Animated/flexed_biceps.json",
      "lottie:https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Bullseye/Animated/bullseye.json",
      "lottie:https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Brain/Animated/brain.json",
      "lottie:https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Shooting%20star/Animated/shooting_star.json",
      "lottie:https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Tornado/Animated/tornado.json",
      "emoji:🎓","emoji:📚",
    ]
  },
  {
    key: "expressions",
    label: "🎭 Expressions",
    items: [
      "lottie:https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Nerd%20face/Animated/nerd_face.json",
      "lottie:https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Smiling%20face%20with%20sunglasses/Animated/smiling_face_with_sunglasses.json",
      "lottie:https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Star-struck/Animated/star-struck.json",
      "lottie:https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Cat%20with%20tears%20of%20joy/Animated/cat_with_tears_of_joy.json",
      "emoji:😍","emoji:🤩","emoji:😎","emoji:🥳","emoji:🤓","emoji:😤","emoji:🥵","emoji:🤯",
      "emoji:😈","emoji:👾","emoji:🤖","emoji:👻",
    ]
  },
];

// Positions des déco dans la carte
const DECO_POSITIONS = [
  { top:"12%",  left:"6%",   fontSize:"1.9rem", animation:"decoFloat0" },
  { top:"8%",   right:"6%",  fontSize:"1.7rem", animation:"decoFloat1" },
  { bottom:"18%",left:"5%",  fontSize:"1.6rem", animation:"decoFloat2" },
  { bottom:"16%",right:"5%", fontSize:"1.8rem", animation:"decoFloat3" },
  { top:"6%",   left:"42%",  fontSize:"1.5rem", animation:"decoFloat0" },
];

// Returns color style for Iconify icons depending on their pack
// noto/twemoji/fluent-emoji/openmoji are naturally colored — no color prop needed
// solar/line-md need an explicit color
function iconStyleForId(iconId: string, accentColor?: string): React.CSSProperties {
  if (iconId.startsWith("solar:") || iconId.startsWith("line-md:")) {
    return { color: accentColor || "#a78bfa" };
  }
  return {};
}

function LottieItem({ url, size = 40 }: { url: string; size?: number }) {
  const [data, setData] = React.useState<object | null>(null);
  React.useEffect(() => {
    fetch(url).then(r => r.json()).then(setData).catch(() => setData(null));
  }, [url]);
  if (!data) return <span style={{ fontSize: size * 0.6 + "px", opacity: 0.3 }}>✨</span>;
  return <Lottie animationData={data} loop autoplay style={{ width: size, height: size }} />;
}

function decoLabel(em: string): string {
  if (em.startsWith("lottie:")) {
    const m = em.match(/assets\/([^/]+)\/Animated\//);
    if (m) {
      const name = decodeURIComponent(m[1]).replace(/_/g, " ");
      const words = name.split(" ");
      return words.length > 2 ? words.slice(0, 2).join(" ") : name;
    }
    return "Animé";
  }
  if (em.startsWith("icon:")) {
    const parts = em.slice(5).split(":");
    const raw = (parts[parts.length - 1] || "").replace(/-/g, " ");
    const words = raw.split(" ");
    return words.slice(0, 2).join(" ");
  }
  if (em.startsWith("emoji:")) return em.slice(6);
  if (em.startsWith("gif:")) return "GIF";
  return em.slice(0, 8);
}

const PROFIL_CSS = `
@keyframes decoFloat0{0%,100%{transform:translateY(0) rotate(-5deg)}50%{transform:translateY(-7px) rotate(5deg)}}
@keyframes decoFloat1{0%,100%{transform:translateY(0) rotate(8deg)}50%{transform:translateY(-9px) rotate(-4deg)}}
@keyframes decoFloat2{0%,100%{transform:translateY(0) rotate(-8deg)}50%{transform:translateY(-6px) rotate(6deg)}}
@keyframes decoFloat3{0%,100%{transform:translateY(0) rotate(5deg)}50%{transform:translateY(-8px) rotate(-7deg)}}
@keyframes salonIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}
@keyframes sheetUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
@keyframes msgIn{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:none}}
@keyframes twinkle{0%,100%{opacity:.15;transform:scale(.7)}45%{opacity:.9;transform:scale(1.3)}55%{opacity:.9;transform:scale(1.3)}}
@keyframes orbitFloat{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(40px,-28px) scale(1.1)}66%{transform:translate(-28px,18px) scale(.9)}}
@keyframes bokehPulse{0%,100%{transform:scale(1);opacity:.25}50%{transform:scale(1.6);opacity:.55}}
@keyframes confettiFall{from{transform:translateY(-30px) rotate(0deg) scaleX(1);opacity:1}to{transform:translateY(100vh) rotate(540deg) scaleX(-1);opacity:0}}
@keyframes matrixDrop{0%{transform:translateY(-120%);opacity:1}80%{opacity:.8}100%{transform:translateY(110vh);opacity:0}}
@keyframes holoPulse{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
@keyframes sakuraSpin{0%,100%{transform:rotate(-10deg) scale(1)}50%{transform:rotate(20deg) scale(1.15)}}
.deco-chip{transition:all .15s;cursor:pointer;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1.4rem;width:72px;height:72px;border:2px solid transparent;}
.deco-chip:hover{transform:scale(1.18);border-color:rgba(255,255,255,0.3);}
.deco-chip:active{transform:scale(0.92);}
.deco-card{transition:transform .15s,box-shadow .15s;cursor:pointer;border-radius:12px;padding:8px 4px 6px;display:flex;flex-direction:column;align-items:center;gap:4px;position:relative;border:2px solid transparent;}
.deco-card:hover{transform:scale(1.1);}
.deco-card:active{transform:scale(0.92);}
.deco-sel-item{transition:all .12s;cursor:pointer;border-radius:10px;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;}
.deco-sel-item .rm-x{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(239,68,68,0.82);border-radius:9px;opacity:0;transition:opacity .12s;font-size:1.4rem;color:white;font-weight:900;}
.deco-sel-item:hover .rm-x{opacity:1;}
.theme-btn{transition:all .15s;cursor:pointer;border-radius:14px;padding:10px 8px;text-align:center;border:2px solid transparent;}
.theme-btn:hover{transform:scale(1.04);}
.theme-btn:active{transform:scale(0.96);}
.tab-btn{transition:all .15s;cursor:pointer;padding:10px 16px;border:none;font-weight:800;font-size:0.85rem;border-radius:10px;}
`;

// ---------------------------------------------------------------------------
// Animated background overlay for premium themes
// ---------------------------------------------------------------------------
const BG_PARTICLES: Record<string, React.ReactNode> = {};

function AnimatedBgOverlay({ bgKey }: { bgKey: string }) {
  if (bgKey === "cosmos") return (
    <div style={{ position:"fixed",inset:0,pointerEvents:"none",zIndex:0,overflow:"hidden" }}>
      {Array.from({length:14},(_, i)=>{
        const size  = 2+Math.random()*3;
        const top   = (i*7.3+13)%100;
        const left  = (i*11.7+5)%100;
        const delay = (i*0.37)%3.5;
        const dur   = 1.8+((i*1.23)%2.4);
        return (
          <div key={i} style={{
            position:"absolute",top:`${top}%`,left:`${left}%`,
            width:`${size}px`,height:`${size}px`,borderRadius:"50%",
            background:"white",animation:`twinkle ${dur}s ease-in-out ${delay}s infinite`
          }}/>
        );
      })}
    </div>
  );

  if (bgKey === "aurore") return (
    <div style={{ position:"fixed",inset:0,pointerEvents:"none",zIndex:0,overflow:"hidden" }}>
      {[{c:"rgba(74,222,128,0.18)",x:"15%",y:"55%",r:"300px",d:"0s"},{c:"rgba(167,139,250,0.22)",x:"80%",y:"25%",r:"280px",d:"1.2s"},{c:"rgba(56,189,248,0.15)",x:"50%",y:"80%",r:"320px",d:"2.4s"}].map((o,i)=>(
        <div key={i} style={{
          position:"absolute",left:o.x,top:o.y,
          width:o.r,height:o.r,marginLeft:`calc(-${o.r}/2)`,marginTop:`calc(-${o.r}/2)`,
          borderRadius:"50%",background:o.c,filter:"blur(40px)",
          animation:`orbitFloat ${6+i*2}s ease-in-out ${o.d} infinite`
        }}/>
      ))}
    </div>
  );

  if (bgKey === "bokeh") return (
    <div style={{ position:"fixed",inset:0,pointerEvents:"none",zIndex:0,overflow:"hidden" }}>
      {[
        {c:"rgba(167,139,250,0.35)",x:"18%",y:"22%",r:"70px",d:"0s"},
        {c:"rgba(244,114,182,0.30)",x:"78%",y:"12%",r:"90px",d:"0.8s"},
        {c:"rgba(96,165,250,0.32)",x:"52%",y:"58%",r:"75px",d:"1.6s"},
        {c:"rgba(52,211,153,0.28)",x:"22%",y:"72%",r:"60px",d:"2.4s"},
        {c:"rgba(251,191,36,0.25)",x:"88%",y:"68%",r:"85px",d:"3.2s"},
      ].map((o,i)=>(
        <div key={i} style={{
          position:"absolute",left:o.x,top:o.y,
          width:o.r,height:o.r,marginLeft:`calc(-${o.r}/2)`,marginTop:`calc(-${o.r}/2)`,
          borderRadius:"50%",background:o.c,filter:"blur(18px)",
          animation:`bokehPulse ${2.5+i*0.6}s ease-in-out ${o.d} infinite`
        }}/>
      ))}
    </div>
  );

  if (bgKey === "confetti") return (
    <div style={{ position:"fixed",inset:0,pointerEvents:"none",zIndex:0,overflow:"hidden" }}>
      {Array.from({length:12},(_,i)=>{
        const colors=["#f472b6","#60a5fa","#4ade80","#fbbf24","#a78bfa","#fb923c"];
        const c=colors[i%colors.length];
        const left=(i*8.3+3)%100;
        const size=6+((i*3)%10);
        const dur=3.5+((i*0.7)%3);
        const delay=(i*0.45)%4;
        return (
          <div key={i} style={{
            position:"absolute",left:`${left}%`,top:"-20px",
            width:`${size}px`,height:`${size}px`,borderRadius:"2px",background:c,
            animation:`confettiFall ${dur}s linear ${delay}s infinite`
          }}/>
        );
      })}
    </div>
  );

  if (bgKey === "matrix") return (
    <div style={{ position:"fixed",inset:0,pointerEvents:"none",zIndex:0,overflow:"hidden" }}>
      {Array.from({length:8},(_,i)=>{
        const left=(i*12.5+2)%100;
        const dur=2.5+((i*0.4)%2);
        const delay=(i*0.6)%3.5;
        return (
          <div key={i} style={{
            position:"absolute",left:`${left}%`,top:0,
            width:"1px",height:"80px",
            background:"linear-gradient(to bottom,transparent,rgba(0,255,65,0.8),transparent)",
            animation:`matrixDrop ${dur}s linear ${delay}s infinite`
          }}/>
        );
      })}
    </div>
  );

  if (bgKey === "sakura") return (
    <div style={{ position:"fixed",inset:0,pointerEvents:"none",zIndex:0,overflow:"hidden" }}>
      {Array.from({length:9},(_,i)=>{
        const left=(i*11+5)%100;
        const top=(i*9+8)%100;
        const size=8+((i*4)%12);
        const delay=(i*0.55)%4;
        return (
          <div key={i} style={{
            position:"absolute",left:`${left}%`,top:`${top}%`,fontSize:`${size}px`,opacity:.5,
            animation:`sakuraSpin ${2.8+(i*0.4)%2}s ease-in-out ${delay}s infinite`
          }}>{"\u{1F338}"}</div>
        );
      })}
    </div>
  );

  if (bgKey === "holographic") return (
    <div style={{ position:"fixed",inset:0,pointerEvents:"none",zIndex:0,overflow:"hidden" }}>
      <div style={{
        position:"absolute",inset:0,opacity:.4,
        background:"linear-gradient(90deg,#ff008855,#ff800055,#ffff0055,#00ff8055,#0080ff55,#8000ff55,#ff008855)",
        backgroundSize:"300% 100%",animation:"holoPulse 4s ease-in-out infinite"
      }}/>
    </div>
  );

  if (bgKey === "neonCity") return (
    <div style={{ position:"fixed",inset:0,pointerEvents:"none",zIndex:0,overflow:"hidden" }}>
      {Array.from({length:6},(_,i)=>{
        const dur   = 3+i*0.7;
        const delay = i*0.8;
        const left  = (i*16+4)+'%';
        const color = i%2===0?"rgba(139,92,246,0.55)":"rgba(0,245,255,0.45)";
        return (
          <div key={i} style={{
            position:"absolute",left,top:0,width:"1px",bottom:0,
            background:`linear-gradient(to bottom,transparent,${color},transparent)`,
            animation:`matrixDrop ${dur}s linear ${delay}s infinite`
          }}/>
        );
      })}
    </div>
  );

  if (bgKey === "deepOcean") return (
    <div style={{ position:"fixed",inset:0,pointerEvents:"none",zIndex:0,overflow:"hidden" }}>
      {[
        {c:"rgba(0,255,255,0.22)",x:"18%",y:"30%",r:"60px",d:"0s"},
        {c:"rgba(0,200,255,0.18)",x:"75%",y:"20%",r:"80px",d:"1.1s"},
        {c:"rgba(0,255,200,0.20)",x:"45%",y:"65%",r:"70px",d:"2.2s"},
        {c:"rgba(56,189,248,0.18)",x:"15%",y:"70%",r:"55px",d:"3.3s"},
        {c:"rgba(0,245,255,0.15)",x:"85%",y:"55%",r:"65px",d:"1.8s"},
      ].map((o,i)=>(
        <div key={i} style={{
          position:"absolute",left:o.x,top:o.y,
          width:o.r,height:o.r,marginLeft:`calc(-${o.r}/2)`,marginTop:`calc(-${o.r}/2)`,
          borderRadius:"50%",background:o.c,filter:"blur(16px)",
          animation:`bokehPulse ${2.8+i*0.5}s ease-in-out ${o.d} infinite`
        }}/>
      ))}
    </div>
  );

  if (bgKey === "fireworks") return (
    <div style={{ position:"fixed",inset:0,pointerEvents:"none",zIndex:0,overflow:"hidden" }}>
      {Array.from({length:16},(_,i)=>{
        const colors=["#ff6400","#ff0064","#7800ff","#00c8ff","#00ff64","#ffdc00","#ff3296"];
        const c=colors[i%colors.length];
        const size=2+((i*1.7)%3);
        const top=(i*7+8)%100;
        const left=(i*13+3)%100;
        const dur=1.8+((i*0.4)%2.5);
        const delay=(i*0.35)%4;
        return (
          <div key={i} style={{
            position:"absolute",left:`${left}%`,top:`${top}%`,
            width:`${size}px`,height:`${size}px`,borderRadius:"50%",background:c,
            boxShadow:`0 0 ${size*3}px ${c}`,
            animation:`twinkle ${dur}s ease-in-out ${delay}s infinite`
          }}/>
        );
      })}
    </div>
  );

  if (bgKey === "synthwave") return (
    <div style={{ position:"fixed",inset:0,pointerEvents:"none",zIndex:0,overflow:"hidden" }}>
      <div style={{
        position:"absolute",left:"50%",transform:"translateX(-50%)",top:"33%",
        width:"320px",height:"320px",borderRadius:"50%",
        background:"radial-gradient(circle,rgba(255,180,0,0.28) 0%,rgba(255,0,100,0.14) 45%,transparent 72%)",
        animation:`bokehPulse 3.5s ease-in-out infinite`
      }}/>
      {Array.from({length:8},(_,i)=>(
        <div key={i} style={{
          position:"absolute",left:`${(i*13+4)%95}%`,top:`${(i*11+15)%75}%`,
          width:`${1.5+i%3}px`,height:`${1.5+i%3}px`,borderRadius:"50%",
          background:"white",opacity:0.55,
          animation:`twinkle ${1.6+i*0.45}s ease-in-out ${i*0.38}s infinite`
        }}/>
      ))}
    </div>
  );

  void BG_PARTICLES; // suppress unused
  return null;
}

// ---------------------------------------------------------------------------
// Existing constants
// ---------------------------------------------------------------------------
const RARETE_CONFIG = {
  commune:     { label:"Commune",     couleur:"#9CA3AF", emoji:"\u26AA" },
  peu_commune: { label:"Peu Commune", couleur:"#10B981", emoji:"\u{1F7E2}" },
  rare:        { label:"Rare",        couleur:"#3B82F6", emoji:"\u{1F535}" },
  epique:      { label:"\u00c9pique", couleur:"#0284C7", emoji:"\u{1F537}" },
  legendaire:  { label:"L\u00e9gendaire",couleur:"#F59E0B",emoji:"\u2B50" },
  ultra_rare:  { label:"Ultra Rare",  couleur:"#EF4444", emoji:"\u{1F48E}" },
};

const CGU_TEXTE = `CONDITIONS GÉNÉRALES D'UTILISATION — STMG HUB
Dernière mise à jour : avril 2025

1. QUI SOMMES-NOUS ?
STMG HUB est une plateforme éducative gamifiée destinée aux élèves de la série STMG. Elle est éditée par Khalifa SOUCI, enseignant en Management.
Contact : lelaboduprof69@gmail.com

2. DONNÉES COLLECTÉES
Dans le cadre de votre inscription, nous collectons :
- Prénom, âge, classe, spécialité, nom du lycée
- Adresse email (via Firebase Authentication)
- Résultats au quiz de personnalité et Triple Totem
- Progression pédagogique (chapitres, jetons, badges, missions)

3. POURQUOI CES DONNÉES ?
Ces données sont utilisées exclusivement pour :
- Personnaliser votre expérience sur la plateforme
- Suivre votre progression pédagogique
- Établir un classement entre élèves du même lycée
- Améliorer les contenus proposés
Vos données ne sont jamais vendues ni transmises à des tiers.

4. DURÉE DE CONSERVATION
Vos données sont conservées pendant toute la durée de votre utilisation. Vous pouvez demander leur suppression à tout moment en contactant : lelaboduprof69@gmail.com

5. VOS DROITS (RGPD)
Conformément au RGPD, vous disposez des droits suivants :
- Droit d'accès, de rectification, d'effacement
- Droit à la portabilité et d'opposition
Pour exercer ces droits : lelaboduprof69@gmail.com

6. MINEURS
L'accès à STMG HUB est réservé aux personnes âgées d'au moins 13 ans.

7. HÉBERGEMENT ET SÉCURITÉ
Les données sont hébergées sur Firebase (Google Cloud), conforme aux normes européennes. Les connexions sont sécurisées par HTTPS.

8. CONTACT
Khalifa SOUCI — lelaboduprof69@gmail.com`;

const familleEmojis: Record<string,string> = {
  Architecte:"\u{1F9E0}", Visionnaire:"\u{1F3A8}",
  Challenger:"\u26A1", Explorateur:"\u{1F52C}", Influenceur:"\u{1F525}",
};
const familleColors: Record<string,string> = {
  Architecte:"#3B82F6", Visionnaire:"#0EA5E9",
  Challenger:"#F97316", Explorateur:"#10B981", Influenceur:"#EF4444",
};
const toutesCartes = COLLECTIONS.flatMap(c => c.cartes);

// ---------------------------------------------------------------------------
// COMPOSANT PAGE EDITOR (bottom sheet)
// ---------------------------------------------------------------------------
function MiniPagePreview({ local, couleurFamille, prenom }: { local:PageStyle; couleurFamille:string; prenom:string }) {
  const bgCfg   = PAGE_BG[local.pageBg]   ||PAGE_BG.defaut;
  const neCfg   = NAME_EFFECT[local.nameEffect]||NAME_EFFECT.defaut;
  const vfCfg   = VITRINE_FRAME[local.vitrineFrame]||VITRINE_FRAME.defaut;
  const isDark  = bgCfg.dark;
  const effCs   = local.cardStyle==="defaut"&&local.pageBg!=="defaut"?(isDark?"darkglass":"glass"):local.cardStyle;

  const cardSty = (): React.CSSProperties => {
    const cs=effCs;
    if(cs==="glass")     return { background:"rgba(255,255,255,0.18)",backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)",border:"1px solid rgba(255,255,255,0.3)" };
    if(cs==="darkglass") return { background:"rgba(15,23,42,0.55)",backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)",border:"1px solid rgba(255,255,255,0.12)" };
    if(cs==="neon")      return { background:"rgba(7,10,18,0.85)",border:`1px solid ${couleurFamille}60`,boxShadow:`0 0 12px ${couleurFamille}25` };
    if(cs==="minimal")   return { background:"rgba(255,255,255,0.95)",border:"1px solid rgba(0,0,0,0.06)" };
    return { background:"white" };
  };

  const vfBorder = vfCfg.border.replace("{c}",couleurFamille);
  const vfShadow = vfCfg.shadow.replace(/{c}/g,couleurFamille);

  const textColor = (isDark||effCs==="darkglass"||effCs==="neon")?"white":"#1A1A2E";
  const subColor  = (isDark||effCs==="darkglass"||effCs==="neon")?"#94a3b8":"#9CA3AF";

  return(
    <div style={{ borderRadius:"14px",overflow:"hidden",border:"1px solid rgba(255,255,255,0.12)",flexShrink:0 }}>
      {/* Page bg */}
      <div style={{ background:bgCfg.bg,padding:"10px",display:"flex",flexDirection:"column",gap:"6px",minHeight:"180px" }}>
        {/* Mini salon card */}
        <div style={{ background:"linear-gradient(135deg,#0B2447,#0ea5e9aa)",borderRadius:"10px",padding:"10px",textAlign:"center",position:"relative",overflow:"hidden" }}>
          {/* Avatar placeholder */}
          <div style={{ width:"32px",height:"32px",borderRadius:"8px",background:"rgba(255,255,255,0.2)",margin:"0 auto 5px",border:"2px solid rgba(255,255,255,0.3)" }}/>
          {/* Name with effect */}
          <div style={{ fontFamily:"'Fredoka One',cursive",fontSize:"0.72rem",marginBottom:"3px",...neCfg.style,color:neCfg.style.color||(neCfg.style.WebkitTextFillColor?"transparent":"white") }}>
            {prenom}
          </div>
          <div style={{ background:couleurFamille+"30",borderRadius:"100px",padding:"1px 8px",display:"inline-block",fontSize:"0.52rem",color:"white",border:`1px solid ${couleurFamille}50` }}>
            {"L'Explorateur"}
          </div>
        </div>
        {/* Mini vitrine card */}
        <div style={{ ...cardSty(),borderRadius:"8px",padding:"7px 8px" }}>
          <div style={{ fontSize:"0.55rem",fontWeight:800,color:textColor,marginBottom:"5px" }}>{"\u2728 Ma Vitrine"}</div>
          <div style={{ display:"flex",gap:"4px" }}>
            {[couleurFamille,"#F59E0B","#EF4444"].map((col,i)=>(
              <div key={i} style={{ flex:1,height:"32px",borderRadius:"5px",background:"rgba(150,150,150,0.2)",
                border:vfBorder,boxShadow:vfShadow }}/>
            ))}
          </div>
        </div>
        {/* Mini info card */}
        <div style={{ ...cardSty(),borderRadius:"8px",padding:"7px 8px" }}>
          <div style={{ fontSize:"0.55rem",fontWeight:800,color:textColor,marginBottom:"4px" }}>{"\u{1F4CB} Infos"}</div>
          {[0,1].map(i=>(
            <div key={i} style={{ display:"flex",justifyContent:"space-between",padding:"2px 0",borderBottom:"1px solid rgba(128,128,128,0.12)" }}>
              <div style={{ width:"40%",height:"5px",borderRadius:"3px",background:"rgba(128,128,128,0.25)" }}/>
              <div style={{ width:"30%",height:"5px",borderRadius:"3px",background:"rgba(128,128,128,0.15)" }}/>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PageEditor({ pageStyle, jetons, ownedItems, onBuyItem, onSave, onClose, couleurFamille, prenom }: {
  pageStyle: PageStyle; jetons: number; ownedItems: string[];
  onBuyItem:(key:string,price:number)=>Promise<boolean>;
  onSave:(ps:PageStyle)=>Promise<void>; onClose:()=>void;
  couleurFamille: string; prenom: string;
}) {
  const [local, setLocal] = useState<PageStyle>({ ...pageStyle });
  const [tab,   setTab]   = useState<"bg"|"cards"|"name"|"vitrine">("bg");
  const [buying,setBuying]= useState<string|null>(null);
  const [saving, setSaving]= useState(false);
  const isOwned = (key:string, price:number) => price===0||ownedItems.includes(key);
  const handleBuy = async (key:string, price:number) => {
    if(buying) return;
    setBuying(key);
    const ok = await onBuyItem(key,price);
    if(ok) setLocal(l=>{ const copy={...l}; if(tab==="bg") copy.pageBg=key; else if(tab==="cards") copy.cardStyle=key; else if(tab==="name") copy.nameEffect=key; else copy.vitrineFrame=key; return copy; });
    setBusy(null);
  };
  const setBusy=(v:string|null)=>setBuying(v);
  const handleSave = async () => { setSaving(true); await onSave(local); setSaving(false); onClose(); };

  // preview shows hovered item applied, or current local selection
  const [hovered, setHovered] = useState<{key:string;catKey:keyof PageStyle}|null>(null);
  const previewLocal: PageStyle = hovered
    ? { ...local, [hovered.catKey]: hovered.key }
    : local;

  const Section = ({ items, catKey }: { items:Record<string,{label:string;price:number;[k:string]:unknown}>; catKey:keyof PageStyle }) => (
    <div style={{ display:"flex",flexDirection:"column",gap:"7px",paddingBottom:"8px" }}>
      <div style={{ fontSize:"0.6rem",color:"#475569",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:"2px" }}>
        {"\u{1F4B0} Jetons : "}<span style={{ color:"#fbbf24" }}>{jetons.toLocaleString("fr-FR")}</span>
      </div>
      {Object.entries(items).map(([k,it])=>{
        const owned  = isOwned(k, it.price);
        const active = local[catKey]===k;
        const canBuy = !owned&&jetons>=it.price;
        const bg     = catKey==="pageBg"?(PAGE_BG[k]?.bg||"#F1F5F9"):undefined;
        const isHov  = hovered?.key===k&&hovered?.catKey===catKey;
        return(
          <div key={k}
            onMouseEnter={()=>setHovered({key:k,catKey})}
            onMouseLeave={()=>setHovered(null)}
            onTouchStart={()=>setHovered({key:k,catKey})}
            style={{ display:"flex",alignItems:"center",gap:"10px",background:isHov?"rgba(167,139,250,0.1)":"rgba(255,255,255,0.04)",borderRadius:"12px",padding:"10px 12px",
              border:`1.5px solid ${active?"rgba(167,139,250,0.5)":isHov?"rgba(167,139,250,0.2)":"rgba(255,255,255,0.07)"}`,
              transition:"all 0.12s",cursor:"pointer" }}>
            {/* Swatch/thumbnail */}
            {catKey==="pageBg"&&bg&&(
              <div style={{ width:"80px",height:"40px",borderRadius:"8px",background:bg,flexShrink:0,border:"1px solid rgba(255,255,255,0.12)",overflow:"hidden" }}/>
            )}
            {catKey==="cardStyle"&&(
              <div style={{ width:"80px",height:"40px",borderRadius:"8px",flexShrink:0,border:"1px solid rgba(255,255,255,0.1)",display:"flex",alignItems:"center",justifyContent:"center",gap:"4px",overflow:"hidden",
                ...(k==="glass"?{background:"rgba(255,255,255,0.15)",backdropFilter:"blur(4px)"}:k==="darkglass"?{background:"rgba(15,23,42,0.7)"}:k==="neon"?{background:"rgba(7,10,18,0.9)",boxShadow:"0 0 8px #a78bfa55",border:"1px solid #a78bfa55"}:k==="minimal"?{background:"rgba(255,255,255,0.95)",border:"1px solid rgba(0,0,0,0.08)"}:{background:"white"})
              }}>
                {[couleurFamille,"#f472b6","#4ade80"].map((c,i)=>(
                  <div key={i} style={{ width:"16px",height:"20px",borderRadius:"4px",background:c+"30",border:`1px solid ${c}50` }}/>
                ))}
              </div>
            )}
            {catKey==="nameEffect"&&(
              <div style={{ width:"80px",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",height:"40px",borderRadius:"8px",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)" }}>
                <span style={{ fontFamily:"'Fredoka One',cursive",fontSize:"0.75rem",...(NAME_EFFECT[k]?.style||{}),color:NAME_EFFECT[k]?.style?.color||(NAME_EFFECT[k]?.style?.WebkitTextFillColor?"transparent":"white") }}>
                  {prenom||"Nom"}
                </span>
              </div>
            )}
            {catKey==="vitrineFrame"&&(
              <div style={{ width:"80px",height:"40px",borderRadius:"8px",flexShrink:0,background:"rgba(100,100,150,0.15)",display:"flex",alignItems:"center",justifyContent:"center",gap:"4px",
                border:VITRINE_FRAME[k]?.border.replace("{c}",couleurFamille),
                boxShadow:VITRINE_FRAME[k]?.shadow.replace(/{c}/g,couleurFamille) }}>
                {[0,1,2].map(i=>(
                  <div key={i} style={{ width:"16px",height:"24px",borderRadius:"4px",background:"rgba(150,150,200,0.2)" }}/>
                ))}
              </div>
            )}
            <div style={{ flex:1,minWidth:0 }}>
              <div style={{ fontSize:"0.78rem",fontWeight:800,color:isHov?"white":"rgba(255,255,255,0.85)" }}>{it.label}</div>
              {(it as {desc?:string}).desc&&<div style={{ fontSize:"0.6rem",color:"#475569",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{(it as {desc?:string}).desc}</div>}
              <div style={{ fontSize:"0.6rem",color:it.price===0?"#4ade80":"#f59e0b",marginTop:"1px" }}>{it.price===0?"Gratuit ✓":it.price+"j"}</div>
            </div>
            {owned?(
              <button onClick={()=>setLocal(l=>({...l,[catKey]:k}))}
                style={{ padding:"6px 12px",borderRadius:"8px",border:"none",fontWeight:700,fontSize:"0.68rem",cursor:"pointer",flexShrink:0,
                  background:active?"rgba(167,139,250,0.25)":"rgba(74,222,128,0.12)",
                  color:active?"#c084fc":"#4ade80" }}>
                {active?"\u2713 Actif":"Choisir"}
              </button>
            ):(
              <button onClick={()=>handleBuy(k,it.price)} disabled={!canBuy||buying===k}
                style={{ padding:"6px 12px",borderRadius:"8px",border:"none",fontWeight:700,fontSize:"0.68rem",cursor:canBuy?"pointer":"not-allowed",flexShrink:0,
                  background:canBuy?"rgba(251,191,36,0.15)":"rgba(255,255,255,0.04)",
                  color:canBuy?"#fbbf24":"#1e293b" }}>
                {buying===k?"\u23F3":canBuy?"\u{1F4B0} "+it.price+"j":"\u{1F512} "+it.price+"j"}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );

  return(
    <div style={{ position:"fixed",inset:0,zIndex:3000,display:"flex",flexDirection:"column",justifyContent:"flex-end" }}>
      <div onClick={onClose} style={{ position:"absolute",inset:0,background:"rgba(0,0,0,0.72)",backdropFilter:"blur(4px)" }}/>
      <div style={{ position:"relative",background:"#0f172a",borderRadius:"28px 28px 0 0",maxHeight:"92vh",display:"flex",flexDirection:"column",animation:"sheetUp 0.35s cubic-bezier(0.34,1.04,0.64,1) both",boxShadow:"0 -8px 60px rgba(0,0,0,0.7)" }}>
        {/* Drag handle */}
        <div style={{ display:"flex",justifyContent:"center",padding:"10px" }}>
          <div style={{ width:"40px",height:"4px",borderRadius:"2px",background:"rgba(255,255,255,0.15)" }}/>
        </div>

        {/* ── LIVE PREVIEW + Header side by side ── */}
        <div style={{ padding:"0 16px 12px",flexShrink:0,display:"flex",gap:"12px",alignItems:"flex-start" }}>
          {/* Preview */}
          <div style={{ flexShrink:0,width:"130px" }}>
            <div style={{ fontSize:"0.55rem",color:"#475569",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:"5px",textAlign:"center" }}>
              {hovered?"\u{1F440} Aper\u00e7u":"Aper\u00e7u"}
            </div>
            <MiniPagePreview local={previewLocal} couleurFamille={couleurFamille} prenom={prenom||"Nom"}/>
          </div>
          {/* Title + Tabs */}
          <div style={{ flex:1,minWidth:0,display:"flex",flexDirection:"column",gap:"8px" }}>
            <div style={{ fontFamily:"'Fredoka One',cursive",color:"white",fontSize:"1rem" }}>
              {"\u{1F5BC}\uFE0F Ma Page"}
            </div>
            <div style={{ fontSize:"0.62rem",color:"#475569" }}>
              {hovered
                ? `\u{1F440} ${(PAGE_BG[hovered.key]||CARD_STYLE[hovered.key]||NAME_EFFECT[hovered.key]||VITRINE_FRAME[hovered.key])?.label||hovered.key}`
                : "Survole un item pour pr\u00e9visualiser"}
            </div>
            <div style={{ display:"flex",gap:"4px",flexWrap:"wrap" }}>
              {([["bg","\u{1F3DE}\uFE0F Fond"],["cards","\u{1F4C4} Cartes"],["name","\u2728 Nom"],["vitrine","\u{1F3AF} Vitrine"]] as [string,string][]).map(([t,l])=>(
                <button key={t} className="tab-btn" onClick={()=>setTab(t as "bg"|"cards"|"name"|"vitrine")}
                  style={{ flexShrink:0,background:tab===t?"rgba(167,139,250,0.2)":"rgba(255,255,255,0.04)",color:tab===t?"#c084fc":"#475569",border:tab===t?"1px solid rgba(167,139,250,0.4)":"1px solid rgba(255,255,255,0.06)",fontFamily:"system-ui",padding:"6px 10px",fontSize:"0.72rem" }}>
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Items list ── */}
        <div style={{ overflowY:"auto",padding:"0 16px 8px",flex:1 }}>
          {tab==="bg"     &&<Section items={PAGE_BG}       catKey="pageBg"/>}
          {tab==="cards"  &&<Section items={CARD_STYLE}    catKey="cardStyle"/>}
          {tab==="name"   &&<Section items={NAME_EFFECT}   catKey="nameEffect"/>}
          {tab==="vitrine"&&<Section items={VITRINE_FRAME} catKey="vitrineFrame"/>}
        </div>

        {/* Save / Cancel */}
        <div style={{ padding:"10px 16px 20px",borderTop:"1px solid rgba(255,255,255,0.07)",flexShrink:0,display:"flex",gap:"10px" }}>
          <button onClick={onClose} style={{ padding:"13px 18px",borderRadius:"14px",background:"rgba(255,255,255,0.05)",color:"#475569",border:"1px solid rgba(255,255,255,0.08)",fontWeight:700,fontSize:"0.82rem",cursor:"pointer" }}>Annuler</button>
          <button onClick={handleSave} disabled={saving}
            style={{ flex:1,padding:"13px",borderRadius:"14px",background:"linear-gradient(135deg,#a78bfa,#ec4899)",color:"white",border:"none",fontWeight:900,fontSize:"0.92rem",cursor:"pointer",boxShadow:"0 4px 20px rgba(167,139,250,0.35)",fontFamily:"'Fredoka One',cursive" }}>
            {saving?"\u23F3 Sauvegarde...":"\u{1F4BE} Appliquer"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// COMPOSANT SALON EDITOR (bottom sheet)
// ---------------------------------------------------------------------------
function SalonEditor({
  salon, avatar, profil, couleurFamille, familleNom, avatarConfig,
  onSave, onClose, ownedThemes, jetons, onBuyTheme,
}: {
  salon: SalonConfig;
  avatar: AvatarConfig;
  profil: Record<string,unknown>;
  couleurFamille: string;
  familleNom: string;
  avatarConfig: AvatarConfig;
  onSave: (s: SalonConfig) => void | Promise<void>;
  onClose: () => void;
  ownedThemes: string[];
  jetons: number;
  onBuyTheme: (themeKey:string, price:number) => Promise<boolean>;
}) {
  const [local, setLocal] = useState<SalonConfig>({ ...salon });
  const [tab, setTab] = useState<"theme"|"deco"|"texte"|"shop">("theme");
  const [buyingTheme, setBuyingTheme] = useState<string|null>(null);
  const [decoTab, setDecoTab] = useState(DECO_CATS[0].key);
  const [saving, setSaving] = useState(false);
  const theme = SALON_THEMES[local.theme] || SALON_THEMES.defaut;
  const dark = theme.dark;

  const toggleDeco = (em: string) => {
    setLocal(s => {
      if (s.deco.includes(em)) return { ...s, deco: s.deco.filter(d => d !== em) };
      if (s.deco.length >= 5) return { ...s, deco: [...s.deco.slice(1), em] };
      return { ...s, deco: [...s.deco, em] };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    await onSave(local);
    setSaving(false);
    onClose();
  };

  return (
    <div style={{ position:"fixed",inset:0,zIndex:3000,display:"flex",flexDirection:"column",justifyContent:"flex-end" }}>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position:"absolute",inset:0,background:"rgba(0,0,0,0.7)",backdropFilter:"blur(4px)" }}/>
      {/* Sheet */}
      <div style={{ position:"relative",background:"#0f172a",borderRadius:"28px 28px 0 0",maxHeight:"92vh",display:"flex",flexDirection:"column",animation:"sheetUp 0.35s cubic-bezier(0.34,1.04,0.64,1) both",boxShadow:"0 -8px 60px rgba(0,0,0,0.7)" }}>
        {/* Handle */}
        <div style={{ display:"flex",justifyContent:"center",padding:"12px" }}>
          <div style={{ width:"40px",height:"4px",borderRadius:"2px",background:"rgba(255,255,255,0.15)" }}/>
        </div>

        {/* Preview mini du salon */}
        <div style={{ margin:"0 16px 12px",borderRadius:"20px",overflow:"hidden",flexShrink:0 }}>
          <div style={{ background:SALON_THEMES[local.theme]?.gradient||SALON_THEMES.defaut.gradient,padding:"16px",position:"relative",minHeight:"160px",display:"flex",alignItems:"center",gap:"12px" }}>
            {local.deco.slice(0,5).map((em,i)=>{
              const posStyle = Object.fromEntries(Object.entries(DECO_POSITIONS[i]).filter(([k])=>k!=="animation"&&k!=="fontSize"));
              return (
                <div key={i} style={{ position:"absolute",...posStyle,pointerEvents:"none",lineHeight:1 }}>
                  {em.startsWith("lottie:")
                    ? <LottieItem url={em.slice(7)} size={52}/>
                    : em.startsWith("gif:")
                    ? <img src={em.slice(4)} style={{width:"52px",height:"52px",objectFit:"contain",borderRadius:"4px"}} loading="lazy" alt=""/>
                    : em.startsWith("icon:")
                    ? <Icon icon={em.slice(5)} width={44} height={44} style={{display:"block",...iconStyleForId(em.slice(5),couleurFamille)}}/>
                    : em.startsWith("emoji:")
                    ? <span style={{fontSize:"36px"}}>{em.slice(6)}</span>
                    : <span style={{fontSize:"36px"}}>{em}</span>}
                </div>
              );
            })}
            <div style={{ position:"relative",zIndex:1,flexShrink:0 }}>
              <AvatarSVG config={avatarConfig} size={60}/>
            </div>
            <div style={{ flex:1,zIndex:1,minWidth:0 }}>
              <div style={{ fontSize:"0.78rem",fontWeight:900,color:dark?"white":"#0f172a",fontFamily:"'Fredoka One',cursive",textShadow:dark?"0 1px 8px rgba(0,0,0,0.5)":"none" }}>
                {local.titre||`Le Salon de ${profil.prenom}`}
              </div>
              {local.motto&&<div style={{ fontSize:"0.65rem",color:dark?"rgba(255,255,255,0.7)":"rgba(0,0,0,0.6)",marginTop:"3px",fontStyle:"italic",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{"\u201C"}{local.motto}{"\u201D"}</div>}
              <div style={{ fontSize:"0.6rem",color:SALON_THEMES[local.theme]?.accent||"#22d3ee",fontWeight:700,marginTop:"4px" }}>{SALON_THEMES[local.theme]?.label}</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display:"flex",gap:"4px",padding:"0 16px 10px",flexShrink:0,overflowX:"auto" }} className="no-sb">
          {([["theme","🎨 Thème"],["deco","✨ Déco"],["texte","💬 Texte"],["shop","🛒 Boutique"]] as [string,string][]).map(([t,l])=>(
            <button key={t} className="tab-btn" onClick={()=>setTab(t as "theme"|"deco"|"texte"|"shop")}
              style={{ flexShrink:0,background:tab===t?"rgba(167,139,250,0.2)":"rgba(255,255,255,0.04)",color:tab===t?"#c084fc":"#475569",border:tab===t?"1px solid rgba(167,139,250,0.4)":"1px solid rgba(255,255,255,0.06)",fontFamily:"system-ui" }}>
              {l}
            </button>
          ))}
        </div>

        {/* Tab content (scrollable) */}
        <div style={{ overflowY:"auto",padding:"0 16px 8px",flex:1 }}>

          {/* ── THÈME */}
          {tab==="theme"&&(
            <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"8px",paddingBottom:"8px" }}>
              {Object.entries(SALON_THEMES).map(([k,t])=>(
                <div key={k} className="theme-btn" onClick={()=>setLocal(s=>({...s,theme:k}))}
                  style={{ background:t.gradient,border:`2px solid ${local.theme===k?"#a78bfa":"transparent"}`,boxShadow:local.theme===k?"0 0 14px #a78bfa88":"none" }}>
                  <div style={{ fontSize:"0.7rem",fontWeight:800,color:t.dark?"white":"#0f172a",textShadow:t.dark?"0 1px 6px rgba(0,0,0,0.6)":"none",lineHeight:1.2 }}>{t.label}</div>
                  {local.theme===k&&<div style={{ fontSize:"0.6rem",color:t.accent,fontWeight:700,marginTop:"4px" }}>{"\u2713 Actif"}</div>}
                </div>
              ))}
            </div>
          )}

          {/* ── DÉCO */}
          {tab==="deco"&&(
            <div>
              {/* Help banner */}
              <div style={{ fontSize:"0.72rem",color:"#a78bfa",fontWeight:700,marginBottom:"12px",padding:"7px 12px",background:"rgba(167,139,250,0.08)",borderRadius:"10px",border:"1px solid rgba(167,139,250,0.18)",letterSpacing:"0.01em" }}>
                {"\u2728 S\u00e9lectionne jusqu\u2019\u00e0 5 d\u00e9cos pour ton salon"}
              </div>

              {/* ── Sélection actuelle */}
              <div style={{ marginBottom:"14px" }}>
                <div style={{ display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:"7px" }}>
                  <span style={{ fontSize:"0.78rem",color:"white",fontWeight:800 }}>Tes d\u00e9cos ({local.deco.length}/5)</span>
                  <span style={{ fontSize:"0.62rem",color:"#64748b" }}>Clique pour retirer</span>
                </div>
                {local.deco.length===0 ? (
                  <div style={{ background:"rgba(255,255,255,0.03)",borderRadius:"12px",padding:"16px 12px",border:"1px dashed rgba(255,255,255,0.1)",textAlign:"center" }}>
                    <span style={{ fontSize:"0.72rem",color:"#334155" }}>Aucune déco sélectionnée — choisis des stickers ci-dessous !</span>
                  </div>
                ) : (
                  <div style={{ display:"flex",gap:"8px",flexWrap:"wrap",background:"rgba(255,255,255,0.03)",borderRadius:"12px",padding:"8px",border:"1px dashed rgba(255,255,255,0.08)" }}>
                    {local.deco.map((em,i)=>(
                      <div key={i} className="deco-sel-item" onClick={()=>toggleDeco(em)} title="Retirer"
                        style={{ width:"64px",height:"64px",background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.22)" }}>
                        {em.startsWith("lottie:")
                          ? <LottieItem url={em.slice(7)} size={44}/>
                          : em.startsWith("gif:")
                          ? <img src={em.slice(4)} style={{width:"44px",height:"44px",objectFit:"contain",borderRadius:"3px"}} loading="lazy" alt=""/>
                          : em.startsWith("icon:")
                          ? <Icon icon={em.slice(5)} width={38} height={38} style={{display:"block",...iconStyleForId(em.slice(5),couleurFamille)}}/>
                          : em.startsWith("emoji:")
                          ? <span style={{fontSize:"30px"}}>{em.slice(6)}</span>
                          : <span style={{fontSize:"30px"}}>{em}</span>}
                        <div className="rm-x">{"\u00D7"}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ── Onglets catégories en grille 2×N */}
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"6px",marginBottom:"12px" }}>
                {DECO_CATS.map(cat=>(
                  <button key={cat.key} onClick={()=>setDecoTab(cat.key)}
                    style={{ padding:"8px 6px",borderRadius:"10px",border:`1px solid ${decoTab===cat.key?"rgba(167,139,250,0.5)":"rgba(255,255,255,0.06)"}`,cursor:"pointer",fontSize:"0.73rem",fontWeight:700,background:decoTab===cat.key?"rgba(167,139,250,0.22)":"rgba(255,255,255,0.05)",color:decoTab===cat.key?"#c084fc":"#64748b",textAlign:"center",transition:"all .12s",fontFamily:"system-ui",backdropFilter:"blur(4px)" }}>
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* ── Grille des items avec nom */}
              <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"8px",paddingBottom:"8px" }}>
                {(DECO_CATS.find(c=>c.key===decoTab)?.items||[]).map(em=>{
                  const selected = local.deco.includes(em);
                  return (
                    <div key={em} className="deco-card" onClick={()=>toggleDeco(em)}
                      style={{ background:selected?"rgba(167,139,250,0.18)":"rgba(255,255,255,0.04)",borderColor:selected?"rgba(167,139,250,0.7)":"rgba(255,255,255,0.06)",boxShadow:selected?"0 0 12px rgba(167,139,250,0.35)":"none" }}>
                      {/* Checkmark vert si sélectionné */}
                      {selected&&(
                        <div style={{ position:"absolute",top:"4px",right:"4px",width:"16px",height:"16px",borderRadius:"50%",background:"#4ade80",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"10px",color:"white",fontWeight:900,boxShadow:"0 1px 4px rgba(0,0,0,0.35)",zIndex:1,lineHeight:1 }}>
                          {"\u2713"}
                        </div>
                      )}
                      {/* Sticker centré */}
                      <div style={{ display:"flex",alignItems:"center",justifyContent:"center",width:"56px",height:"56px" }}>
                        {em.startsWith("lottie:")
                          ? <LottieItem url={em.slice(7)} size={50}/>
                          : em.startsWith("gif:")
                          ? <img src={em.slice(4)} style={{width:"50px",height:"50px",objectFit:"contain",borderRadius:"4px"}} loading="lazy" alt=""/>
                          : em.startsWith("icon:")
                          ? <Icon icon={em.slice(5)} width={46} height={46} style={{display:"block",...iconStyleForId(em.slice(5),couleurFamille)}}/>
                          : em.startsWith("emoji:")
                          ? <span style={{fontSize:"38px",lineHeight:1}}>{em.slice(6)}</span>
                          : <span style={{fontSize:"38px",lineHeight:1}}>{em}</span>}
                      </div>
                      {/* Nom court */}
                      <div style={{ fontSize:"0.54rem",color:selected?"#c084fc":"#64748b",textAlign:"center",lineHeight:1.2,maxWidth:"76px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",fontWeight:selected?700:600 }}>
                        {decoLabel(em)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── BOUTIQUE THÈMES */}
          {tab==="shop"&&(
            <div style={{ display:"flex",flexDirection:"column",gap:"8px",paddingBottom:"8px" }}>
              <div style={{ fontSize:"0.62rem",color:"#475569",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:"4px" }}>
                {"💰 Mes jetons : "}<span style={{ color:"#fbbf24" }}>{jetons.toLocaleString("fr-FR")}</span>
              </div>
              {Object.entries(SALON_THEMES).map(([k,t])=>{
                const price = THEME_PRICES[k]||0;
                const owned = price===0||ownedThemes.includes(k);
                const canBuy = !owned&&jetons>=price;
                const isBuying = buyingTheme===k;
                return(
                  <div key={k} style={{ display:"flex",alignItems:"center",gap:"10px",background:"rgba(255,255,255,0.04)",borderRadius:"12px",padding:"10px 12px",border:`1px solid ${owned?"rgba(74,222,128,0.2)":"rgba(255,255,255,0.07)"}` }}>
                    <div style={{ width:"44px",height:"30px",borderRadius:"8px",background:t.gradient,flexShrink:0 }}/>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:"0.78rem",fontWeight:800,color:"white" }}>{t.label}</div>
                      <div style={{ fontSize:"0.62rem",color:price===0?"#4ade80":"#f59e0b" }}>{price===0?"Gratuit":price+"j"}</div>
                    </div>
                    {owned?(
                      <button onClick={()=>setLocal(s=>({...s,theme:k}))}
                        style={{ padding:"6px 12px",borderRadius:"8px",border:"none",fontWeight:700,fontSize:"0.68rem",cursor:"pointer",
                          background:local.theme===k?"rgba(167,139,250,0.25)":"rgba(74,222,128,0.12)",
                          color:local.theme===k?"#c084fc":"#4ade80" }}>
                        {local.theme===k?"✓ Actif":"Équiper"}
                      </button>
                    ):(
                      <button onClick={async()=>{
                        if(!canBuy||isBuying) return;
                        setBuyingTheme(k);
                        const ok = await onBuyTheme(k,price);
                        if(ok&&local) setLocal(s=>({...s,theme:k}));
                        setBuyingTheme(null);
                      }} disabled={!canBuy||isBuying}
                        style={{ padding:"6px 12px",borderRadius:"8px",border:"none",fontWeight:700,fontSize:"0.68rem",cursor:canBuy?"pointer":"not-allowed",
                          background:canBuy?"rgba(251,191,36,0.15)":"rgba(255,255,255,0.04)",color:canBuy?"#fbbf24":"#1e293b" }}>
                        {isBuying?"⏳":canBuy?"💰 Acheter":"🔒 "+price+"j"}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* ── TEXTE */}
          {tab==="texte"&&(
            <div style={{ display:"flex",flexDirection:"column",gap:"16px" }}>
              <div>
                <label style={{ fontSize:"0.7rem",color:"#475569",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",display:"block",marginBottom:"6px" }}>{"Nom du salon"}</label>
                <input value={local.titre} maxLength={30} placeholder={`Le Salon de ${profil.prenom as string}`}
                  onChange={e=>setLocal(s=>({...s,titre:e.target.value}))}
                  style={{ width:"100%",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"12px",padding:"12px 14px",color:"white",fontSize:"0.9rem",fontFamily:"system-ui",boxSizing:"border-box",outline:"none" }}/>
                <div style={{ fontSize:"0.6rem",color:"#1e293b",marginTop:"4px",textAlign:"right" }}>{local.titre.length}/30</div>
              </div>
              <div>
                <label style={{ fontSize:"0.7rem",color:"#475569",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",display:"block",marginBottom:"6px" }}>{"Devise / Bio"}</label>
                <textarea value={local.motto} maxLength={70} rows={2} placeholder={`Ex : "Je code donc je suis" ✨`}
                  onChange={e=>setLocal(s=>({...s,motto:e.target.value}))}
                  style={{ width:"100%",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"12px",padding:"12px 14px",color:"white",fontSize:"0.88rem",fontFamily:"system-ui",resize:"none",boxSizing:"border-box",outline:"none" }}/>
                <div style={{ fontSize:"0.6rem",color:"#1e293b",marginTop:"4px",textAlign:"right" }}>{local.motto.length}/70</div>
              </div>
              <button onClick={()=>setLocal(s=>({...s,titre:"",motto:"",deco:[]}))}
                style={{ background:"rgba(239,68,68,0.1)",color:"#f87171",border:"1px solid rgba(239,68,68,0.2)",borderRadius:"10px",padding:"10px",fontSize:"0.8rem",fontWeight:700,cursor:"pointer" }}>
                {"\u{1F5D1}\ufe0f R\u00e9initialiser tout"}
              </button>
            </div>
          )}
        </div>

        {/* Save button */}
        <div style={{ padding:"12px 16px 20px",borderTop:"1px solid rgba(255,255,255,0.07)",flexShrink:0,display:"flex",gap:"10px" }}>
          <button onClick={onClose} style={{ padding:"14px 20px",borderRadius:"14px",background:"rgba(255,255,255,0.05)",color:"#475569",border:"1px solid rgba(255,255,255,0.08)",fontWeight:700,fontSize:"0.85rem",cursor:"pointer" }}>Annuler</button>
          <button onClick={handleSave} disabled={saving}
            style={{ flex:1,padding:"14px",borderRadius:"14px",background:"linear-gradient(135deg,#a78bfa,#ec4899)",color:"white",border:"none",fontWeight:900,fontSize:"0.95rem",cursor:"pointer",boxShadow:"0 4px 20px rgba(167,139,250,0.4)" }}>
            {saving?"\u23F3 Sauvegarde...":"\u{1F4BE} Sauvegarder le salon"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// MAIN
// ---------------------------------------------------------------------------
export default function Profil({ profil, onRefaire, onDeconnexion }: { profil: Record<string,unknown>; onRefaire:()=>void; onDeconnexion:()=>void }) {
  const [showCGU, setShowCGU]         = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showJoker, setShowJoker]     = useState(false);
  const [jokerUtilise, setJokerUtilise] = useState(false);
  const [chargement, setChargement]   = useState(false);
  const [maCollection, setMaCollection] = useState<Record<string,number>>({});
  const [vitrine, setVitrine]         = useState<(null|{id:string;nom:string;image:string;rarete:string})[]>([null,null,null]);
  const [modeChoixVitrine, setModeChoixVitrine] = useState<number|null>(null);
  const [message, setMessage]         = useState<{texte:string;type:string}|null>(null);
  const [avatarConfig, setAvatarConfig] = useState<AvatarConfig>(DEFAULT_AVATAR);
  const [salon, setSalon]             = useState<SalonConfig>(DEFAULT_SALON);
  const [showSalonEditor, setShowSalonEditor] = useState(false);
  const [ownedThemes, setOwnedThemes] = useState<string[]>([]);
  const [jetonsCurrent, setJetonsCurrent] = useState<number>(0);
  const [tradeOffers, setTradeOffers] = useState<unknown[]>([]);
  const [acceptingTrade, setAcceptingTrade] = useState<string|null>(null);
  const [pageStyle, setPageStyle] = useState<PageStyle>(DEFAULT_PAGE_STYLE);
  const [showPageEditor, setShowPageEditor] = useState(false);
  const [ownedPageItems, setOwnedPageItems] = useState<string[]>([]);

  const jokerDisponible = !(profil.jokerUtilise as boolean) && !jokerUtilise;
  const couleurFamille = familleColors[profil.famille as string] || "#0EA5E9";
  const theme = SALON_THEMES[salon.theme] || SALON_THEMES.defaut;

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800;900&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    chargerDonnees();
  }, []);

  const chargerDonnees = async () => {
    if (!auth.currentUser) return;
    const snap = await getDoc(doc(db, "users", auth.currentUser.uid));
    if (!snap.exists()) return;
    const data = snap.data();
    setMaCollection(data.cartes || {});
    setVitrine(data.vitrine || [null,null,null]);
    if (data.avatar) setAvatarConfig({ ...DEFAULT_AVATAR, ...data.avatar });
    if (data.salon)  setSalon({ ...DEFAULT_SALON, ...data.salon });
    if (data.salonThemes) setOwnedThemes(data.salonThemes as string[]);
    if (typeof data.xp === "number") setJetonsCurrent(data.xp);
    if (data.pageStyle)  setPageStyle({ ...DEFAULT_PAGE_STYLE, ...(data.pageStyle as PageStyle) });
    if (data.pageItems)  setOwnedPageItems(data.pageItems as string[]);
    // Load pending trade offers (sent TO me)
    if (auth.currentUser) {
      try {
        const q = query(collection(db,"tradeOffers"), where("toUid","==",auth.currentUser.uid), where("status","==","pending"));
        const snap = await getDocs(q);
        setTradeOffers(snap.docs.map(d=>({ id:d.id, ...d.data() })));
      } catch { /* ignore if rules not set */ }
    }
  };

  const afficherMessage = (texte: string, type="success") => {
    setMessage({ texte, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const buyTheme = async (themeKey: string, price: number): Promise<boolean> => {
    if (!auth.currentUser) return false;
    try {
      await runTransaction(db, async tx => {
        const ref = doc(db,"users",auth.currentUser!.uid);
        const snap = await tx.get(ref);
        if (!snap.exists()) throw new Error();
        const d = snap.data();
        if ((d.xp||0) < price) throw new Error("Pas assez de jetons");
        const themes = [...(d.salonThemes||[]), themeKey];
        tx.update(ref, { xp:(d.xp||0)-price, salonThemes:themes });
      });
      setOwnedThemes(t=>[...t,themeKey]);
      setJetonsCurrent(j=>j-price);
      afficherMessage(`🎨 Thème "${SALON_THEMES[themeKey].label}" débloqué !`);
      return true;
    } catch { afficherMessage("Jetons insuffisants","error"); return false; }
  };

  const acceptTrade = async (offer: Record<string,unknown>) => {
    if (!auth.currentUser || acceptingTrade) return;
    setAcceptingTrade(offer.id as string);
    try {
      await runTransaction(db, async tx => {
        const myRef   = doc(db,"users",auth.currentUser!.uid);
        const fromRef = doc(db,"users",offer.fromUid as string);
        const offerRef = doc(db,"tradeOffers",offer.id as string);
        const mySnap   = await tx.get(myRef);
        const fromSnap = await tx.get(fromRef);
        const myCartes   = mySnap.data()?.cartes || {};
        const fromCartes = fromSnap.data()?.cartes || {};
        const myCard   = offer.toCard as { id:string };
        const fromCard = offer.fromCard as { id:string };
        if ((myCartes[myCard.id]||0) < 1) throw new Error("Tu ne possèdes plus cette carte");
        if ((fromCartes[fromCard.id]||0) < 1) throw new Error("L'autre joueur ne possède plus cette carte");
        // Swap cards
        tx.update(myRef, { [`cartes.${myCard.id}`]:(myCartes[myCard.id]||1)-1, [`cartes.${fromCard.id}`]:(myCartes[fromCard.id]||0)+1 });
        tx.update(fromRef, { [`cartes.${fromCard.id}`]:(fromCartes[fromCard.id]||1)-1, [`cartes.${myCard.id}`]:(fromCartes[myCard.id]||0)+1 });
        tx.update(offerRef, { status:"accepted" });
      });
      setTradeOffers(t=>t.filter((o:unknown)=>(o as {id:string}).id!==offer.id));
      afficherMessage(`✅ Échange accepté avec ${offer.fromPrenom} !`);
    } catch(e) { afficherMessage(e instanceof Error?e.message:"Erreur","error"); }
    setAcceptingTrade(null);
  };

  const declineTrade = async (offer: Record<string,unknown>) => {
    if (!auth.currentUser) return;
    try {
      await updateDoc(doc(db,"tradeOffers",offer.id as string), { status:"declined" });
      setTradeOffers(t=>t.filter((o:unknown)=>(o as {id:string}).id!==offer.id));
      afficherMessage("❌ Échange refusé.");
    } catch { afficherMessage("Erreur","error"); }
  };

  const buyPageItem = async (itemKey:string, price:number): Promise<boolean> => {
    if (!auth.currentUser) return false;
    try {
      await runTransaction(db, async tx => {
        const ref = doc(db,"users",auth.currentUser!.uid);
        const snap = await tx.get(ref);
        if (!snap.exists()) throw new Error();
        const d = snap.data();
        if ((d.xp||0) < price) throw new Error("Pas assez de jetons");
        tx.update(ref, { xp:(d.xp||0)-price, pageItems:[...(d.pageItems||[]), itemKey] });
      });
      setOwnedPageItems(t=>[...t, itemKey]);
      setJetonsCurrent(j=>j-price);
      return true;
    } catch { afficherMessage("Jetons insuffisants","error"); return false; }
  };

  const savePageStyle = async (ps: PageStyle) => {
    setPageStyle(ps);
    if (!auth.currentUser) return;
    await updateDoc(doc(db,"users",auth.currentUser.uid), { pageStyle: ps });
    afficherMessage("\u{1F3A8} Style de page sauvegard\u00e9 !");
  };

  const saveSalon = async (newSalon: SalonConfig) => {
    setSalon(newSalon);
    if (!auth.currentUser) return;
    await updateDoc(doc(db,"users",auth.currentUser.uid), { salon: newSalon });
    afficherMessage("\u{1F3E0} Salon mis \u00e0 jour !");
  };

  const cartesPossedees = toutesCartes.filter(c => (maCollection[c.id]||0) > 0);

  const choisirCarteVitrine = async (carte: {id:string;nom:string;image:string;rarete:string}) => {
    if (modeChoixVitrine === null) return;
    const nouvelleVitrine = [...vitrine];
    const existeIdx = nouvelleVitrine.findIndex(v => v?.id === carte.id);
    if (existeIdx !== -1) nouvelleVitrine[existeIdx] = null;
    nouvelleVitrine[modeChoixVitrine] = { id:carte.id, nom:carte.nom, image:carte.image, rarete:carte.rarete };
    setVitrine(nouvelleVitrine);
    setModeChoixVitrine(null);
    await updateDoc(doc(db,"users",auth.currentUser!.uid), { vitrine: nouvelleVitrine });
    afficherMessage("\u2705 Vitrine mise \u00e0 jour !");
  };

  const utiliserJoker = async () => {
    setChargement(true);
    await updateDoc(doc(db,"users",auth.currentUser!.uid), {
      jokerUtilise:true, famille:null, animalTotem:null, objetTotem:null, starTotem:null,
    });
    setJokerUtilise(true);
    setChargement(false);
    setShowJoker(false);
    onRefaire();
  };

  const familleNom = (profil.famille as string)
    ? `${familleEmojis[profil.famille as string]} ${
        profil.famille==="Architecte"?"L'Architecte":
        profil.famille==="Visionnaire"?"Le Visionnaire":
        profil.famille==="Challenger"?"Le Challenger":
        profil.famille==="Explorateur"?"L'Explorateur":"L'Influenceur"}`
    : "Non d\u00e9fini";

  const salonTitre = salon.titre || `Le Salon de ${profil.prenom as string}`;

  const pageBgCfg      = PAGE_BG[pageStyle.pageBg]||PAGE_BG.defaut;
  const cardStyleCfg   = CARD_STYLE[pageStyle.cardStyle]||CARD_STYLE.defaut;
  const nameEffectCfg  = NAME_EFFECT[pageStyle.nameEffect]||NAME_EFFECT.defaut;
  const vitrineFrameCfg= VITRINE_FRAME[pageStyle.vitrineFrame]||VITRINE_FRAME.defaut;

  const isDarkPage = pageBgCfg.dark;
  // If user didn't pick a card style, auto-pick based on bg darkness
  const effectiveCardStyle = pageStyle.cardStyle==="defaut" && pageStyle.pageBg!=="defaut"
    ? (isDarkPage ? "darkglass" : "glass")
    : pageStyle.cardStyle;

  const sectionCardStyle = (accent?:string): React.CSSProperties => {
    const cs = effectiveCardStyle;
    if(cs==="glass")     return { background:"rgba(255,255,255,0.18)",backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",border:"1px solid rgba(255,255,255,0.3)",boxShadow:"0 8px 32px rgba(0,0,0,0.12)" };
    if(cs==="darkglass") return { background:"rgba(15,23,42,0.55)",backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",border:"1px solid rgba(255,255,255,0.1)",boxShadow:"0 8px 32px rgba(0,0,0,0.4)" };
    if(cs==="neon")      return { background:"rgba(7,10,18,0.8)",border:`1px solid ${accent||"#a78bfa"}55`,boxShadow:`0 0 24px ${accent||"#a78bfa"}22`,backdropFilter:"blur(8px)" };
    if(cs==="minimal")   return { background:"rgba(255,255,255,0.95)",border:"1px solid rgba(0,0,0,0.05)",boxShadow:"0 2px 8px rgba(0,0,0,0.04)" };
    return { background:"white",boxShadow:"0 4px 20px rgba(0,0,0,0.06)" };
  };
  const sectionTextColor = (isDarkPage||effectiveCardStyle==="darkglass"||effectiveCardStyle==="neon") ? "white" : "#1A1A2E";
  const sectionSubColor  = (isDarkPage||effectiveCardStyle==="darkglass"||effectiveCardStyle==="neon") ? "#94a3b8" : "#9CA3AF";

  return (
    <div style={{ minHeight:"100vh",background:pageBgCfg.bg,fontFamily:"'Nunito',sans-serif",position:"relative" }}>
      <style>{PROFIL_CSS}</style>
      <AnimatedBgOverlay bgKey={pageStyle.pageBg}/>

      {/* TOAST */}
      {message && (
        <div style={{ position:"fixed",top:"80px",right:"24px",zIndex:100,background:message.type==="error"?"#EF4444":"#10B981",color:"white",fontFamily:"'Fredoka One',cursive",padding:"14px 28px",borderRadius:"16px",boxShadow:"0 8px 25px rgba(0,0,0,0.3)",animation:"msgIn 0.2s both" }}>
          {message.texte}
        </div>
      )}

      <div style={{ maxWidth:"600px",margin:"0 auto",padding:"24px 16px",display:"flex",flexDirection:"column",gap:"16px",position:"relative",zIndex:1 }}>

        {/* ══ LE SALON ══════════════════════════════════════════════════════ */}
        <div style={{ borderRadius:"24px",overflow:"hidden",boxShadow:"0 12px 40px rgba(0,0,0,0.25)",position:"relative",animation:"salonIn 0.4s both" }}>
          {/* Fond dégradé */}
          <div style={{ background:theme.gradient,padding:"28px 24px",position:"relative",overflow:"hidden" }}>

            {/* Décorations flottantes */}
            {salon.deco.filter(d=>!d.startsWith("gif:")).map((em, i) => {
              const pos = DECO_POSITIONS[i];
              const posStyle = Object.fromEntries(Object.entries(pos).filter(([k])=>k!=="animation"&&k!=="fontSize"));
              const anim = `${(pos as {animation:string}).animation} ${2.5+i*0.4}s ease-in-out ${i*0.3}s infinite`;
              return (
                <div key={i} style={{ position:"absolute",pointerEvents:"none",lineHeight:1,...posStyle,animation:anim,filter:"drop-shadow(0 2px 8px rgba(0,0,0,0.35))",zIndex:0 }}>
                  {em.startsWith("lottie:")
                    ? <LottieItem url={em.slice(7)} size={52}/>
                    : em.startsWith("icon:")
                    ? <Icon icon={em.slice(5)} width={44} height={44} style={{display:"block",...iconStyleForId(em.slice(5),couleurFamille)}}/>
                    : em.startsWith("emoji:")
                    ? <span style={{fontSize:"36px"}}>{em.slice(6)}</span>
                    : <span style={{fontSize:"1.9rem"}}>{em}</span>}
                </div>
              );
            })}

            {/* Bouton Ma Page */}
            <button onClick={()=>setShowPageEditor(true)}
              style={{ position:"absolute",top:"14px",left:"14px",background:"rgba(0,0,0,0.35)",backdropFilter:"blur(8px)",border:"1px solid rgba(255,255,255,0.2)",borderRadius:"10px",padding:"6px 10px",color:"white",fontSize:"0.7rem",fontWeight:800,cursor:"pointer",display:"flex",alignItems:"center",gap:"4px",zIndex:2 }}>
              <span>{"\u{1F5BC}\uFE0F"}</span><span>{"Ma Page"}</span>
            </button>

            {/* Bouton décorer */}
            <button onClick={()=>setShowSalonEditor(true)}
              style={{ position:"absolute",top:"14px",right:"14px",background:"rgba(0,0,0,0.35)",backdropFilter:"blur(8px)",border:"1px solid rgba(255,255,255,0.2)",borderRadius:"10px",padding:"6px 12px",color:"white",fontSize:"0.72rem",fontWeight:800,cursor:"pointer",display:"flex",alignItems:"center",gap:"5px",zIndex:2 }}>
              <span>{"\u{1F3A8}"}</span><span>{"D\u00e9corer"}</span>
            </button>

            {/* Label salon */}
            <div style={{ position:"absolute",bottom:"12px",left:"14px",fontSize:"0.6rem",fontWeight:700,color:theme.dark?"rgba(255,255,255,0.4)":"rgba(0,0,0,0.35)",letterSpacing:"0.1em",textTransform:"uppercase",zIndex:1 }}>
              {"\u{1F3E0}"} {salonTitre}
            </div>

            {/* Corps */}
            <div style={{ position:"relative",zIndex:1,textAlign:"center",paddingBottom:"18px" }}>
              {/* Avatar */}
              <div style={{ display:"flex",justifyContent:"center",marginBottom:"14px" }}>
                <div style={{ position:"relative",display:"inline-block" }}>
                  <div style={{ position:"absolute",inset:"-3px",borderRadius:"19px",background:`linear-gradient(135deg,${couleurFamille},#a78bfa,#22d3ee)`,padding:"3px",zIndex:0 }}>
                    <div style={{ background:"rgba(0,0,0,0.4)",borderRadius:"16px",width:"100%",height:"100%" }}/>
                  </div>
                  <div style={{ position:"relative",zIndex:1 }}>
                    <AvatarSVG config={avatarConfig} size={110}/>
                  </div>
                </div>
              </div>

              {/* Nom */}
              <p style={{ fontFamily:"'Fredoka One',cursive",color:theme.dark?"white":"#0f172a",fontSize:"1.8rem",margin:"0 0 6px",...nameEffectCfg.style }}>
                {profil.prenom as string}
              </p>

              {/* Badge famille */}
              <span style={{ background:couleurFamille+"30",color:theme.dark?"white":"#0f172a",fontFamily:"'Fredoka One',cursive",padding:"4px 16px",borderRadius:"100px",fontSize:"0.85rem",backdropFilter:"blur(4px)",border:`1px solid ${couleurFamille}50` }}>
                {familleNom}
              </span>

              {/* Devise */}
              {salon.motto&&(
                <div style={{ marginTop:"10px",fontSize:"0.8rem",color:theme.dark?"rgba(255,255,255,0.75)":"rgba(0,0,0,0.65)",fontStyle:"italic",maxWidth:"280px",marginLeft:"auto",marginRight:"auto",lineHeight:1.4 }}>
                  {"\u201C"}{salon.motto}{"\u201D"}
                </div>
              )}

              {/* Stats */}
              <div style={{ display:"flex",gap:"10px",justifyContent:"center",marginTop:"14px",flexWrap:"wrap" }}>
                <div style={{ background:"rgba(0,0,0,0.25)",backdropFilter:"blur(6px)",borderRadius:"12px",padding:"8px 16px",fontFamily:"'Fredoka One',cursive",color:theme.dark?"white":"#0f172a",fontSize:"0.9rem",border:"1px solid rgba(255,255,255,0.1)" }}>
                  {"\u26A1"} {formatJetons(profil.xp as number || 0)}
                </div>
                <div style={{ background:"rgba(0,0,0,0.25)",backdropFilter:"blur(6px)",borderRadius:"12px",padding:"8px 16px",fontFamily:"'Fredoka One',cursive",color:theme.dark?"white":"#0f172a",fontSize:"0.9rem",border:"1px solid rgba(255,255,255,0.1)" }}>
                  {"\u{1F0CF}"} {cartesPossedees.length} cartes
                </div>
              </div>

              <p style={{ color:theme.dark?"rgba(255,255,255,0.35)":"rgba(0,0,0,0.3)",fontSize:"0.68rem",marginTop:"10px",marginBottom:0 }}>
                {"Personnalise ton avatar dans"} {"\u{1F3AE}"} {"Jeux \u2192 Mon Avatar"}
              </p>
            </div>
          </div>
        </div>

        {/* ✨ GALERIE AMBIANCE (GIFs sélectionnés) */}
        {salon.deco.some(d=>d.startsWith("gif:"))&&(
          <div style={{ borderRadius:"24px",padding:"20px",...sectionCardStyle() }}>
            <p style={{ fontFamily:"'Fredoka One',cursive",color:sectionTextColor,fontSize:"1.1rem",margin:"0 0 14px" }}>
              {"\u2728 Ambiance"}
            </p>
            <div style={{ display:"flex",gap:"14px",overflowX:"auto",paddingBottom:"6px" }} className="no-sb">
              {salon.deco.filter(d=>d.startsWith("gif:")).map((gif,i)=>(
                <div key={i} style={{
                  flexShrink:0,borderRadius:"18px",overflow:"hidden",
                  border:`2px solid ${couleurFamille}45`,
                  boxShadow:`0 0 20px ${couleurFamille}35,0 6px 18px rgba(0,0,0,0.18)`
                }}>
                  <img
                    src={gif.slice(4)}
                    style={{width:"120px",height:"120px",objectFit:"cover",display:"block"}}
                    loading="lazy"
                    alt=""
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VITRINE */}
        <div style={{ borderRadius:"24px",padding:"24px",...sectionCardStyle(couleurFamille) }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"16px" }}>
            <div>
              <p style={{ fontFamily:"'Fredoka One',cursive",color:sectionTextColor,fontSize:"1.2rem",margin:0 }}>{"\u2728 Ma Vitrine"}</p>
              <p style={{ color:sectionSubColor,fontSize:"0.8rem",margin:"2px 0 0" }}>{"Tes 3 cartes pr\u00e9f\u00e9r\u00e9es \u2014 visibles par tous"}</p>
            </div>
          </div>
          <div style={{ display:"flex",gap:"12px",justifyContent:"center" }}>
            {[0,1,2].map(i => {
              const carte = vitrine[i];
              const config = carte ? RARETE_CONFIG[carte.rarete as keyof typeof RARETE_CONFIG] : null;
              const frameC  = config?.couleur ?? couleurFamille;
              const vfBorder = vitrineFrameCfg.border.replace(/{c}/g, frameC);
              const vfShadow = vitrineFrameCfg.shadow === "none"
                ? (carte && config ? `0 4px 15px ${config.couleur}30` : "none")
                : vitrineFrameCfg.shadow.replace(/{c}/g, frameC);
              return (
                <div key={i} onClick={()=>setModeChoixVitrine(i)}
                  style={{ flex:1,maxWidth:"140px",borderRadius:"14px",overflow:"hidden",border:vfBorder,cursor:"pointer",background:carte?"white":"#F8FAFC",transition:"all 0.2s",boxShadow:vfShadow }}>
                  {carte&&config ? (
                    <>
                      <img src={carte.image} alt={carte.nom} style={{ width:"100%",display:"block" }}/>
                      <div style={{ padding:"6px 8px",borderTop:`1px solid ${config.couleur}20` }}>
                        <p style={{ fontSize:"0.55rem",fontWeight:"700",color:"#1A1A2E",margin:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{carte.nom}</p>
                        <p style={{ fontSize:"0.5rem",color:config.couleur,margin:"1px 0 0" }}>{config.emoji} {config.label}</p>
                      </div>
                    </>
                  ) : (
                    <div style={{ padding:"32px 8px",textAlign:"center" }}>
                      <p style={{ fontSize:"1.5rem",margin:"0 0 4px" }}>{"\u2795"}</p>
                      <p style={{ color:"#9CA3AF",fontSize:"0.65rem",fontFamily:"'Fredoka One',cursive" }}>Choisir</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <p style={{ color:"#9CA3AF",fontSize:"0.75rem",textAlign:"center",margin:"12px 0 0" }}>Clique sur un slot pour changer la carte</p>
        </div>

        {/* ÉCHANGES EN ATTENTE */}
        {tradeOffers.length>0&&(
          <div style={{ background:"white",borderRadius:"24px",padding:"24px",boxShadow:"0 4px 20px rgba(99,102,241,0.12)",border:"2px solid rgba(99,102,241,0.2)" }}>
            <p style={{ fontFamily:"'Fredoka One',cursive",color:"#1A1A2E",fontSize:"1.1rem",margin:"0 0 4px" }}>
              {"🃏 Échanges en attente"}
              <span style={{ marginLeft:"8px",background:"#6366f1",color:"white",borderRadius:"100px",padding:"1px 10px",fontSize:"0.72rem" }}>{tradeOffers.length}</span>
            </p>
            <p style={{ color:"#9CA3AF",fontSize:"0.78rem",margin:"0 0 14px" }}>Des camarades veulent échanger des cartes avec toi !</p>
            <div style={{ display:"flex",flexDirection:"column",gap:"10px" }}>
              {(tradeOffers as Record<string,unknown>[]).map((offer)=>(
                <div key={offer.id as string} style={{ background:"#F8FAFC",borderRadius:"14px",padding:"12px",border:"1px solid #E5E7EB" }}>
                  <div style={{ display:"flex",alignItems:"center",gap:"8px",marginBottom:"10px" }}>
                    <span style={{ fontWeight:800,color:"#1A1A2E",fontSize:"0.85rem" }}>{offer.fromPrenom as string}</span>
                    <span style={{ color:"#9CA3AF",fontSize:"0.78rem" }}>{"propose :"}</span>
                  </div>
                  <div style={{ display:"flex",gap:"12px",alignItems:"center",marginBottom:"12px" }}>
                    <div style={{ textAlign:"center" }}>
                      <img src={(offer.fromCard as {image:string}).image} alt="" style={{ width:"60px",borderRadius:"8px",display:"block",margin:"0 auto 4px" }}/>
                      <div style={{ fontSize:"0.58rem",fontWeight:700,color:"#1A1A2E",maxWidth:"64px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{(offer.fromCard as {nom:string}).nom}</div>
                      <div style={{ fontSize:"0.52rem",color:"#10B981" }}>{"Il donne"}</div>
                    </div>
                    <div style={{ color:"#6366f1",fontSize:"1.5rem",fontWeight:900 }}>{"⇄"}</div>
                    <div style={{ textAlign:"center" }}>
                      <img src={(offer.toCard as {image:string}).image} alt="" style={{ width:"60px",borderRadius:"8px",display:"block",margin:"0 auto 4px" }}/>
                      <div style={{ fontSize:"0.58rem",fontWeight:700,color:"#1A1A2E",maxWidth:"64px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{(offer.toCard as {nom:string}).nom}</div>
                      <div style={{ fontSize:"0.52rem",color:"#EF4444" }}>{"Tu donnes"}</div>
                    </div>
                  </div>
                  <div style={{ display:"flex",gap:"8px" }}>
                    <button onClick={()=>declineTrade(offer)}
                      style={{ flex:1,padding:"8px",borderRadius:"10px",background:"rgba(239,68,68,0.1)",color:"#EF4444",border:"1px solid rgba(239,68,68,0.2)",fontWeight:700,fontSize:"0.78rem",cursor:"pointer" }}>
                      {"✕ Refuser"}
                    </button>
                    <button onClick={()=>acceptTrade(offer)} disabled={acceptingTrade===offer.id}
                      style={{ flex:1,padding:"8px",borderRadius:"10px",background:"linear-gradient(135deg,#6366f1,#4f46e5)",color:"white",border:"none",fontWeight:700,fontSize:"0.78rem",cursor:"pointer" }}>
                      {acceptingTrade===offer.id?"⏳...":"✓ Accepter"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* INFOS */}
        <div style={{ borderRadius:"24px",padding:"24px",...sectionCardStyle() }}>
          <p style={{ fontFamily:"'Fredoka One',cursive",color:sectionTextColor,fontSize:"1.2rem",margin:"0 0 16px" }}>{"\u{1F4CB} Mes informations"}</p>
          {([
            { label:"Pr\u00e9nom",   valeur:profil.prenom },
            { label:"\u00c2ge",      valeur:`${profil.age} ans` },
            { label:"Classe",        valeur:profil.classe==="premiere"?"Premi\u00e8re STMG":"Terminale STMG" },
            profil.specialite&&{ label:"Sp\u00e9cialit\u00e9", valeur:profil.specialite },
            { label:"Lyc\u00e9e",    valeur:profil.lycee },
          ] as ({label:string;valeur:unknown}|null|false)[]).filter(Boolean).map((item,i) => (
            <div key={i} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:"1px solid #F3F4F6" }}>
              <span style={{ color:"#9CA3AF",fontSize:"0.9rem" }}>{(item as {label:string;valeur:unknown}).label}</span>
              <span style={{ color:"#1A1A2E",fontWeight:"700",fontSize:"0.9rem",textAlign:"right",maxWidth:"60%" }}>{String((item as {label:string;valeur:unknown}).valeur)}</span>
            </div>
          ))}
        </div>

        {/* TRIPLE TOTEM */}
        <div style={{ borderRadius:"24px",padding:"24px",...sectionCardStyle(couleurFamille) }}>
          <p style={{ fontFamily:"'Fredoka One',cursive",color:sectionTextColor,fontSize:"1.2rem",margin:"0 0 16px" }}>{"\u{1F52E} Mon Triple Totem"}</p>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"12px" }}>
            {[
              { label:"\u{1F43E} Animal", data:profil.animalTotem },
              { label:"\u2694\ufe0f Objet",   data:profil.objetTotem  },
              { label:"\u2B50 Star",      data:profil.starTotem   },
            ].map((t,i) => (
              <div key={i} style={{ background:couleurFamille+"10",borderRadius:"16px",padding:"16px",textAlign:"center",border:`1px solid ${couleurFamille}20` }}>
                <p style={{ fontSize:"2rem",margin:"0 0 4px" }}>{(t.data as {emoji?:string})?.emoji||"\u2753"}</p>
                <p style={{ color:"#9CA3AF",fontSize:"0.7rem",margin:"0 0 4px" }}>{t.label}</p>
                <p style={{ color:couleurFamille,fontFamily:"'Fredoka One',cursive",fontSize:"0.8rem",margin:0 }}>{(t.data as {nom?:string})?.nom||"\u2014"}</p>
              </div>
            ))}
          </div>
        </div>

        {/* JOKER */}
        <div style={{ borderRadius:"24px",padding:"24px",...sectionCardStyle() }}>
          <p style={{ fontFamily:"'Fredoka One',cursive",color:sectionTextColor,fontSize:"1.2rem",margin:"0 0 8px" }}>{"\u{1F0CF} Joker \u2014 Refaire le quiz"}</p>
          {jokerDisponible ? (
            <>
              <p style={{ color:"#9CA3AF",fontSize:"0.85rem",margin:"0 0 16px" }}>Tu as 1 joker disponible. Refais le quiz sans perdre tes jetons ni tes badges !</p>
              <button onClick={()=>setShowJoker(true)} style={{ background:"linear-gradient(135deg,#F59E0B,#B45309)",color:"white",border:"none",fontFamily:"'Fredoka One',cursive",fontSize:"1rem",padding:"12px 28px",borderRadius:"14px",cursor:"pointer" }}>
                {"\u{1F0CF} Utiliser mon Joker"}
              </button>
            </>
          ) : (
            <p style={{ color:"#9CA3AF",fontSize:"0.85rem" }}>Tu as déjà utilisé ton joker. Plus disponible !</p>
          )}
        </div>

        {/* LEGAL */}
        <div style={{ borderRadius:"24px",padding:"24px",...sectionCardStyle() }}>
          <p style={{ fontFamily:"'Fredoka One',cursive",color:sectionTextColor,fontSize:"1.2rem",margin:"0 0 12px" }}>{"\u{1F4CB} L\u00e9gal"}</p>
          {[
            { label:"\u{1F4C4} CGU & RGPD",      action:()=>setShowCGU(true) },
            { label:"\u{1F4E7} Nous contacter",   action:()=>setShowContact(true) },
          ].map((b,i) => (
            <button key={i} onClick={b.action} style={{ width:"100%",textAlign:"left",background:"#F8FAFC",border:"1px solid #E5E7EB",color:"#374151",fontFamily:"'Nunito',sans-serif",fontSize:"0.9rem",padding:"12px 16px",borderRadius:"12px",cursor:"pointer",marginBottom:"8px" }}>
              {b.label}
            </button>
          ))}
        </div>

        {/* DÉCONNEXION */}
        <button onClick={onDeconnexion} style={{ width:"100%",background:"linear-gradient(135deg,#EF4444,#DC2626)",color:"white",border:"none",fontFamily:"'Fredoka One',cursive",fontSize:"1.1rem",padding:"16px",borderRadius:"18px",cursor:"pointer",boxShadow:"0 4px 15px #EF444440" }}>
          {"\u{1F6AA} Se d\u00e9connecter"}
        </button>
      </div>

      {/* ══ PAGE EDITOR ══ */}
      {showPageEditor&&(
        <PageEditor
          pageStyle={pageStyle} jetons={jetonsCurrent}
          ownedItems={ownedPageItems}
          onBuyItem={buyPageItem}
          onSave={savePageStyle}
          onClose={()=>setShowPageEditor(false)}
          couleurFamille={couleurFamille}
          prenom={profil.prenom as string}/>
      )}

      {/* ══ SALON EDITOR ══ */}
      {showSalonEditor&&(
        <SalonEditor
          salon={salon} avatar={avatarConfig} profil={profil}
          couleurFamille={couleurFamille} familleNom={familleNom}
          avatarConfig={avatarConfig}
          onSave={saveSalon} onClose={()=>setShowSalonEditor(false)}
          ownedThemes={ownedThemes} jetons={jetonsCurrent} onBuyTheme={buyTheme}/>
      )}

      {/* POPUP CHOIX VITRINE */}
      {modeChoixVitrine!==null&&(
        <div onClick={()=>setModeChoixVitrine(null)} style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.9)",zIndex:2000,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"flex-start",padding:"20px",overflowY:"auto" }}>
          <div onClick={e=>e.stopPropagation()} style={{ width:"100%",maxWidth:"600px" }}>
            <p style={{ fontFamily:"'Fredoka One',cursive",color:"white",fontSize:"1.5rem",textAlign:"center",margin:"0 0 8px" }}>
              {"\u2728 Choisir une carte pour le slot"} {modeChoixVitrine+1}
            </p>
            <p style={{ color:"#9CA3AF",fontSize:"0.85rem",textAlign:"center",margin:"0 0 20px" }}>{cartesPossedees.length} cartes disponibles</p>
            {cartesPossedees.length===0 ? (
              <div style={{ textAlign:"center",padding:"40px",background:"rgba(255,255,255,0.05)",borderRadius:"20px" }}>
                <p style={{ fontFamily:"'Fredoka One',cursive",color:"#9CA3AF",fontSize:"1.1rem" }}>Tu n'as pas encore de cartes !</p>
              </div>
            ) : (
              <div style={{ display:"flex",flexWrap:"wrap",gap:"10px",justifyContent:"center" }}>
                {cartesPossedees.map(carte => {
                  const config = RARETE_CONFIG[carte.rarete as keyof typeof RARETE_CONFIG];
                  const estDansVitrine = vitrine.some(v=>v?.id===carte.id);
                  return (
                    <div key={carte.id} onClick={()=>choisirCarteVitrine(carte)}
                      style={{ width:"100px",borderRadius:"12px",overflow:"hidden",border:`3px solid ${estDansVitrine?config.couleur:config.couleur+"60"}`,boxShadow:estDansVitrine?`0 0 15px ${config.couleur}80`:"none",cursor:"pointer",background:"white",transition:"all 0.2s",opacity:estDansVitrine?0.6:1 }}>
                      <img src={carte.image} alt={carte.nom} style={{ width:"100%",display:"block" }}/>
                      <div style={{ padding:"4px 6px",borderTop:`1px solid ${config.couleur}20` }}>
                        <p style={{ fontSize:"0.5rem",fontWeight:"700",color:"#1A1A2E",margin:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{carte.nom}</p>
                        <p style={{ fontSize:"0.48rem",color:config.couleur,margin:"1px 0 0" }}>{config.emoji} {config.label}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            <div style={{ textAlign:"center",marginTop:"20px" }}>
              <button onClick={()=>setModeChoixVitrine(null)} style={{ background:"rgba(239,68,68,0.2)",color:"#EF4444",border:"2px solid rgba(239,68,68,0.4)",fontFamily:"'Fredoka One',cursive",fontSize:"1rem",padding:"12px 28px",borderRadius:"14px",cursor:"pointer" }}>
                {"\u2715 Annuler"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP CGU */}
      {showCGU&&(
        <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",zIndex:2000,display:"flex",alignItems:"center",justifyContent:"center",padding:"16px" }}>
          <div style={{ background:"white",borderRadius:"24px",maxWidth:"500px",width:"100%",maxHeight:"80vh",display:"flex",flexDirection:"column" }}>
            <div style={{ padding:"20px 24px",borderBottom:"1px solid #E5E7EB",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
              <p style={{ fontFamily:"'Fredoka One',cursive",color:"#1A1A2E",fontSize:"1.1rem",margin:0 }}>{"\u{1F4CB} CGU & RGPD"}</p>
              <button onClick={()=>setShowCGU(false)} style={{ background:"none",border:"none",fontSize:"1.5rem",cursor:"pointer",color:"#9CA3AF" }}>{"×"}</button>
            </div>
            <div style={{ padding:"20px 24px",overflowY:"auto",flex:1 }}>
              <pre style={{ color:"#374151",fontSize:"0.75rem",whiteSpace:"pre-wrap",lineHeight:1.8,fontFamily:"'Nunito',sans-serif" }}>{CGU_TEXTE}</pre>
            </div>
            <div style={{ padding:"16px 24px",borderTop:"1px solid #E5E7EB" }}>
              <button onClick={()=>setShowCGU(false)} style={{ width:"100%",background:"linear-gradient(135deg,#0EA5E9,#2563EB)",color:"white",border:"none",fontFamily:"'Fredoka One',cursive",fontSize:"1rem",padding:"12px",borderRadius:"12px",cursor:"pointer" }}>Fermer</button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP CONTACT */}
      {showContact&&(
        <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",zIndex:2000,display:"flex",alignItems:"center",justifyContent:"center",padding:"16px" }}>
          <div style={{ background:"white",borderRadius:"24px",maxWidth:"400px",width:"100%",padding:"28px" }}>
            <p style={{ fontFamily:"'Fredoka One',cursive",color:"#1A1A2E",fontSize:"1.3rem",margin:"0 0 20px" }}>{"\u{1F4E7} Nous contacter"}</p>
            {[
              { label:"Responsable", valeur:"Khalifa SOUCI" },
              { label:"Email",       valeur:"lelaboduprof69@gmail.com" },
            ].map((item,i)=>(
              <div key={i} style={{ background:"#F8FAFC",borderRadius:"14px",padding:"14px 16px",marginBottom:"10px" }}>
                <p style={{ color:"#9CA3AF",fontSize:"0.8rem",margin:"0 0 4px" }}>{item.label}</p>
                <p style={{ color:"#1A1A2E",fontWeight:"700",fontSize:"0.95rem",margin:0 }}>{item.valeur}</p>
              </div>
            ))}
            <button onClick={()=>setShowContact(false)} style={{ width:"100%",background:"linear-gradient(135deg,#0EA5E9,#2563EB)",color:"white",border:"none",fontFamily:"'Fredoka One',cursive",fontSize:"1rem",padding:"12px",borderRadius:"12px",cursor:"pointer",marginTop:"8px" }}>Fermer</button>
          </div>
        </div>
      )}

      {/* POPUP JOKER */}
      {showJoker&&(
        <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",zIndex:2000,display:"flex",alignItems:"center",justifyContent:"center",padding:"16px" }}>
          <div style={{ background:"white",borderRadius:"24px",maxWidth:"380px",width:"100%",padding:"32px",textAlign:"center" }}>
            <p style={{ fontSize:"4rem",margin:"0 0 12px" }}>{"\u{1F0CF}"}</p>
            <p style={{ fontFamily:"'Fredoka One',cursive",color:"#1A1A2E",fontSize:"1.4rem",margin:"0 0 8px" }}>Utiliser ton Joker ?</p>
            <p style={{ color:"#9CA3AF",fontSize:"0.85rem",margin:"0 0 24px",lineHeight:1.8 }}>
              {"\u2705 Jetons conserv\u00e9s\n\u2705 Badges conserv\u00e9s\n\u2705 Chapitres conserv\u00e9s\n\u2705 Cartes conserv\u00e9es\n\u26A0\ufe0f Famille et Totems r\u00e9initialis\u00e9s\n\u26A0\ufe0f Joker non r\u00e9cup\u00e9rable"}
            </p>
            <div style={{ display:"flex",gap:"12px" }}>
              <button onClick={()=>setShowJoker(false)} style={{ flex:1,background:"#F3F4F6",color:"#374151",border:"none",fontFamily:"'Fredoka One',cursive",fontSize:"1rem",padding:"14px",borderRadius:"14px",cursor:"pointer" }}>Annuler</button>
              <button onClick={utiliserJoker} disabled={chargement} style={{ flex:1,background:"linear-gradient(135deg,#F59E0B,#B45309)",color:"white",border:"none",fontFamily:"'Fredoka One',cursive",fontSize:"1rem",padding:"14px",borderRadius:"14px",cursor:"pointer" }}>
                {chargement?"\u23F3...":"\u{1F0CF} Confirmer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
