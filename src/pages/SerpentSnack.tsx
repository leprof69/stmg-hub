import { useCallback, useEffect, useRef, useState } from "react";
import { auth, db } from "../services/firebase";
import { doc, runTransaction } from "firebase/firestore";
import { formatJetonsDelta } from "../lib/jetons";
import { PLATFORM_XP_BLOCKED_MESSAGE, usePlatformIntegrity } from "../contexts/PlatformIntegrityContext";
import { pickRandomGameQcm } from "../lib/gameQcmPool";

type Props = { profil: { prenom?: string }; onXPGagne?: () => void };

// ?? GAME TYPES ?????????????????????????????????????????????????????????????
const GRID_W = 18;
const GRID_H = 14;
const SUB_MS = 50;
const ENERGY_MAX = 100;
const ENERGY_DRAIN_PER_SUB = 0.085;

const EMOJI_NOMS = [
  String.fromCodePoint(0x1f355), String.fromCodePoint(0x1f3af),
  String.fromCodePoint(0x1f984), String.fromCodePoint(0x1f3ae),
  String.fromCodePoint(0x1f32f), String.fromCodePoint(0x1f369),
  String.fromCodePoint(0x1f419), String.fromCodePoint(0x2728),
  String.fromCodePoint(0x1f3b8), String.fromCodePoint(0x1f48e),
  String.fromCodePoint(0x1f9cb), String.fromCodePoint(0x1f37f),
  String.fromCodePoint(0x1f6fc), String.fromCodePoint(0x1faa5),
];

type Cell = { x: number; y: number };
type PowerId = "wrap" | "magnet" | "shield";
type Food = Cell & {
  emoji: string; kind: "normal" | "super" | "power";
  mult?: number; comboMoves?: number; power?: PowerId;
};
type QuizQ = { q: string; choices: [string, string, string, string]; ok: 0 | 1 | 2 | 3 };
type GameModel = {
  snake: Cell[]; foods: Food[];
  energy: number; score: number; manges: number; superManges: number;
  totalMoves: number; comboMul: number; comboMovesLeft: number;
  wrapMovesLeft: number; magnetMovesLeft: number; biteShields: number;
};

// ?? VISUAL TYPES ???????????????????????????????????????????????????????????
type Particle = { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; r: number; color: string };
type Star = { x: number; y: number; r: number; a: number; twink: number };
type EatSignal = { gx: number; gy: number; kind: Food["kind"]; mult?: number };

const STORAGE_KEY = "serpentSnackMeta";
const DAILY_XP_CAP = 140;

// ?? GAME LOGIC ?????????????????????????????????????????????????????????????
function todayKey() { const d = new Date(); return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`; }
function pickQuizBatch(): QuizQ[] {
  return pickRandomGameQcm(3).map(({ q, choices, ok }) => ({ q, choices, ok }));
}

function randomEmptyCell(snake: Cell[], foods: Food[]): Cell {
  for (let k = 0; k < 400; k++) {
    const x = Math.floor(Math.random() * GRID_W);
    const y = Math.floor(Math.random() * GRID_H);
    if (snake.some(s => s.x === x && s.y === y)) continue;
    if (foods.some(f => f.x === x && f.y === y)) continue;
    return { x, y };
  }
  return { x: 1, y: 1 };
}

function randomFood(snake: Cell[], foods: Food[]): Food {
  const cell = randomEmptyCell(snake, foods);
  const r = Math.random();
  if (r < 0.045) return { ...cell, emoji: String.fromCodePoint(0x1f680), kind: "super", mult: 3, comboMoves: 6 };
  if (r < 0.11)  return { ...cell, emoji: String.fromCodePoint(0x1f31f), kind: "super", mult: 2.5, comboMoves: 10 };
  if (r < 0.24)  return { ...cell, emoji: String.fromCodePoint(0x1f4ab), kind: "super", mult: 2, comboMoves: 14 };
  const pr = Math.random();
  if (pr < 0.038) return { ...cell, emoji: String.fromCodePoint(0x1f300), kind: "power", power: "wrap" };
  if (pr < 0.076) return { ...cell, emoji: String.fromCodePoint(0x1f9f2), kind: "power", power: "magnet" };
  if (pr < 0.11)  return { ...cell, emoji: String.fromCodePoint(0x1f6e1), kind: "power", power: "shield" };
  return { ...cell, emoji: EMOJI_NOMS[Math.floor(Math.random() * EMOJI_NOMS.length)], kind: "normal" };
}

function applyMagnetFoods(foods: Food[], snake: Cell[]): Food[] {
  const head = snake[0]; if (!head) return foods;
  return foods.map(f => {
    const dx = Math.sign(head.x - f.x), dy = Math.sign(head.y - f.y);
    if (dx === 0 && dy === 0) return f;
    let nx = f.x, ny = f.y;
    if (Math.abs(head.x - f.x) >= Math.abs(head.y - f.y)) { if (dx !== 0) nx += dx; }
    else if (dy !== 0) { ny += dy; } else return f;
    const occ = snake.some(s => s.x === nx && s.y === ny) || foods.some(o => o !== f && o.x === nx && o.y === ny);
    return occ ? f : { ...f, x: nx, y: ny };
  });
}

function initialGame(): GameModel {
  const snake: Cell[] = [{ x: 5, y: 7 }, { x: 4, y: 7 }, { x: 3, y: 7 }];
  const f0 = randomFood(snake, []), f1 = randomFood(snake, [f0]), f2 = randomFood(snake, [f0, f1]);
  return { snake, foods: [f0, f1, f2], energy: ENERGY_MAX, score: 0, manges: 0, superManges: 0, totalMoves: 0, comboMul: 1, comboMovesLeft: 0, wrapMovesLeft: 0, magnetMovesLeft: 0, biteShields: 0 };
}

function computeXpGain(s: number) { return Math.max(8, Math.min(95, 12 + Math.floor(s / 6))); }

function ticksPerMove(totalMoves: number): number {
  let n = 17;
  if (totalMoves >= 40) n = 15;
  if (totalMoves >= 90) n = 13;
  if (totalMoves >= 150) n = 12;
  if (totalMoves >= 220) n = 11;
  if (totalMoves >= 300) n = 10;
  return Math.max(9, n);
}

// ?? VISUAL HELPERS ?????????????????????????????????????????????????????????

type Pt = { x: number; y: number };

function buildSmoothPath(ctx: CanvasRenderingContext2D, pts: Pt[]) {
  if (pts.length < 2) { ctx.beginPath(); ctx.arc(pts[0].x, pts[0].y, 4, 0, Math.PI * 2); return; }
  ctx.beginPath();
  ctx.moveTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
  for (let i = pts.length - 2; i >= 1; i--) {
    const mx = (pts[i].x + pts[i - 1].x) / 2;
    const my = (pts[i].y + pts[i - 1].y) / 2;
    ctx.quadraticCurveTo(pts[i].x, pts[i].y, mx, my);
  }
  ctx.lineTo(pts[0].x, pts[0].y);
}

function drawSnakeBody(ctx: CanvasRenderingContext2D, pts: Pt[], cw: number, ts: number, shields: number, wrap: number, magnet: number) {
  if (pts.length === 0) return;
  const golden = shields > 0;
  const tealLow = "#0d9488", tealMid = "#14b8a6", tealHi = "#5eead4";
  const goldLow = "#92400e", goldMid = "#d97706", goldHi = "#fde68a";

  // ?? 1. Outer neon glow ?????????????????????????????????????????????????
  ctx.save();
  ctx.lineCap = "round"; ctx.lineJoin = "round";
  buildSmoothPath(ctx, pts);
  ctx.shadowBlur = cw * 0.8;
  ctx.shadowColor = golden ? "rgba(251,191,36,0.9)" : magnet > 0 ? "rgba(56,189,248,0.8)" : "rgba(45,212,191,0.85)";
  ctx.strokeStyle = golden ? goldMid : magnet > 0 ? "#38bdf8" : tealMid;
  ctx.lineWidth = cw * 0.58;
  ctx.globalAlpha = 0.18;
  ctx.stroke();
  ctx.shadowBlur = 0; ctx.globalAlpha = 1;
  ctx.restore();

  // ?? 2. Scale shapes (tail ? head, overlapping like real scales) ????????
  ctx.save();
  const n = pts.length;
  for (let i = n - 1; i >= 0; i--) {
    const px = pts[i].x, py = pts[i].y;
    const nx2 = i > 0 ? pts[i - 1].x : px + (i > 0 ? 0 : 1);
    const ny2 = i > 0 ? pts[i - 1].y : py;
    const angle = Math.atan2(ny2 - py, nx2 - px);
    const progress = 1 - i / n; // 0=tail, 1=head
    const sz = cw * (0.40 + progress * 0.06);

    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(angle);

    // Scale outline (slightly larger, dark)
    ctx.beginPath();
    ctx.moveTo(sz, 0);
    ctx.bezierCurveTo(sz * 0.5, -sz * 0.52, -sz * 0.75, -sz * 0.42, -sz * 0.88, 0);
    ctx.bezierCurveTo(-sz * 0.75, sz * 0.42, sz * 0.5, sz * 0.52, sz, 0);
    ctx.closePath();
    ctx.fillStyle = golden ? "rgba(92,40,14,0.55)" : "rgba(8,50,46,0.55)";
    ctx.fill();

    // Scale fill with radial gradient
    const sg = ctx.createRadialGradient(-sz * 0.15, -sz * 0.2, 0, -sz * 0.1, 0, sz * 1.05);
    if (golden) {
      sg.addColorStop(0, `hsl(${38 + progress * 8}, 95%, ${65 + progress * 12}%)`);
      sg.addColorStop(0.6, `hsl(${32 + progress * 5}, 85%, ${40 + progress * 10}%)`);
      sg.addColorStop(1, goldLow);
    } else if (magnet > 0) {
      sg.addColorStop(0, `hsl(${198 + progress * 8}, 95%, ${68 + progress * 10}%)`);
      sg.addColorStop(0.6, `hsl(${200 + progress * 5}, 85%, ${42 + progress * 10}%)`);
      sg.addColorStop(1, "#0c4a6e");
    } else {
      sg.addColorStop(0, `hsl(${174 - progress * 10}, 80%, ${60 + progress * 14}%)`);
      sg.addColorStop(0.55, `hsl(${172 - progress * 8}, 75%, ${36 + progress * 12}%)`);
      sg.addColorStop(1, tealLow);
    }
    ctx.beginPath();
    ctx.moveTo(sz, 0);
    ctx.bezierCurveTo(sz * 0.5, -sz * 0.52, -sz * 0.75, -sz * 0.42, -sz * 0.88, 0);
    ctx.bezierCurveTo(-sz * 0.75, sz * 0.42, sz * 0.5, sz * 0.52, sz, 0);
    ctx.closePath();
    ctx.fillStyle = sg;
    ctx.fill();

    // Sheen line on scale
    ctx.strokeStyle = golden ? "rgba(254,243,199,0.35)" : magnet > 0 ? "rgba(224,242,254,0.35)" : "rgba(204,251,241,0.3)";
    ctx.lineWidth = Math.max(0.8, cw * 0.035);
    ctx.beginPath();
    ctx.moveTo(sz * 0.15, -sz * 0.28);
    ctx.quadraticCurveTo(-sz * 0.25, -sz * 0.15, -sz * 0.6, 0);
    ctx.stroke();

    ctx.restore();
  }
  ctx.restore();

  // ?? 3. Belly highlight along spine ????????????????????????????????????
  ctx.save();
  ctx.lineCap = "round"; ctx.lineJoin = "round";
  buildSmoothPath(ctx, pts);
  ctx.strokeStyle = golden ? "rgba(254,243,199,0.2)" : magnet > 0 ? "rgba(186,230,253,0.2)" : "rgba(204,251,241,0.18)";
  ctx.lineWidth = cw * 0.14;
  ctx.stroke();
  ctx.restore();

  // ?? 4. Shield ring ?????????????????????????????????????????????????????
  if (shields > 0) {
    const ring = cw * 0.52 + Math.sin(ts * 0.005) * cw * 0.06;
    ctx.save();
    ctx.beginPath();
    ctx.arc(pts[0].x, pts[0].y, ring, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(251,191,36,${0.35 + shields * 0.18})`;
    ctx.lineWidth = 2.5;
    ctx.shadowColor = "#fbbf24";
    ctx.shadowBlur = 10;
    ctx.stroke();
    ctx.restore();
  }

  // ?? 5. Wrap tunnel border ??????????????????????????????????????????????
  if (wrap > 0) {
    ctx.save();
    ctx.lineCap = "round"; ctx.lineJoin = "round";
    buildSmoothPath(ctx, pts);
    ctx.strokeStyle = "rgba(139,92,246,0.22)";
    ctx.lineWidth = cw * 0.7;
    ctx.stroke();
    ctx.restore();
  }
}

function drawHead(ctx: CanvasRenderingContext2D, pts: Pt[], cw: number, headDir: Cell, ts: number, shields: number) {
  if (pts.length === 0) return;
  const hx = pts[0].x, hy = pts[0].y;
  let angle: number;
  if (pts.length >= 2) angle = Math.atan2(pts[0].y - pts[1].y, pts[0].x - pts[1].x);
  else angle = Math.atan2(headDir.y, headDir.x);

  const wobble = Math.sin(ts * 0.0032) * 0.055;
  const golden = shields > 0;

  ctx.save();
  ctx.translate(hx, hy);
  ctx.rotate(angle + wobble);

  const rx = cw * 0.42, ry = cw * 0.37;

  // Head neon glow
  ctx.save();
  ctx.shadowBlur = cw * 0.6;
  ctx.shadowColor = golden ? "#fbbf24" : "#14b8a6";
  ctx.beginPath();
  ctx.ellipse(cw * 0.05, 0, rx * 0.9, ry * 0.9, 0, 0, Math.PI * 2);
  ctx.fillStyle = "transparent";
  ctx.strokeStyle = golden ? "#fbbf24" : "#2dd4bf";
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.restore();

  // Head base
  const hg = ctx.createRadialGradient(-rx * 0.28, -ry * 0.38, 0, cw * 0.04, 0, rx * 1.25);
  if (golden) {
    hg.addColorStop(0, "#fef3c7"); hg.addColorStop(0.22, "#fde68a");
    hg.addColorStop(0.6, "#d97706"); hg.addColorStop(1, "#92400e");
  } else {
    hg.addColorStop(0, "#ccfbf1"); hg.addColorStop(0.22, "#5eead4");
    hg.addColorStop(0.6, "#14b8a6"); hg.addColorStop(1, "#0f766e");
  }
  ctx.fillStyle = hg;
  ctx.beginPath();
  ctx.ellipse(cw * 0.05, 0, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();

  // Head outline
  ctx.strokeStyle = golden ? "rgba(92,40,14,0.65)" : "rgba(5,55,50,0.65)";
  ctx.lineWidth = cw * 0.06;
  ctx.stroke();

  // Scale marks on head
  ctx.fillStyle = golden ? "rgba(146,64,14,0.28)" : "rgba(13,148,136,0.28)";
  ctx.beginPath();
  ctx.arc(0, ry * 0.52, cw * 0.07, 0, Math.PI * 2);
  ctx.arc(rx * 0.18, -ry * 0.56, cw * 0.06, 0, Math.PI * 2);
  ctx.arc(-rx * 0.2, -ry * 0.32, cw * 0.05, 0, Math.PI * 2);
  ctx.fill();

  // Eyes
  const eXo = cw * 0.135, eY = -cw * 0.068;
  ctx.fillStyle = "#f1f5f9";
  ctx.beginPath();
  ctx.ellipse(eXo, eY, cw * 0.105, cw * 0.12, 0.1, 0, Math.PI * 2);
  ctx.ellipse(-eXo, eY, cw * 0.105, cw * 0.12, -0.1, 0, Math.PI * 2);
  ctx.fill();

  // Iris
  ctx.fillStyle = golden ? "#451a03" : "#1e293b";
  const eyeShine = Math.sin(ts * 0.0018) * cw * 0.012;
  ctx.save(); ctx.translate(eXo + eyeShine, eY + cw * 0.022); ctx.scale(0.32, 1);
  ctx.beginPath(); ctx.arc(0, 0, cw * 0.078, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  ctx.save(); ctx.translate(-eXo + eyeShine, eY + cw * 0.022); ctx.scale(0.32, 1);
  ctx.beginPath(); ctx.arc(0, 0, cw * 0.078, 0, Math.PI * 2); ctx.fill(); ctx.restore();

  // Eye highlights
  ctx.fillStyle = "rgba(255,255,255,0.82)";
  ctx.beginPath();
  ctx.arc(eXo + cw * 0.032, eY - cw * 0.04, cw * 0.026, 0, Math.PI * 2);
  ctx.arc(-eXo + cw * 0.032, eY - cw * 0.04, cw * 0.026, 0, Math.PI * 2);
  ctx.fill();

  // Tongue
  const flick = Math.sin(ts * 0.009) * cw * 0.055;
  const tStart = rx * 0.62, tMid = rx + cw * 0.09, tEnd = rx + cw * 0.22;
  ctx.strokeStyle = "#fb7185"; ctx.lineWidth = Math.max(1.4, cw * 0.042); ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(tStart, flick * 0.28);
  ctx.quadraticCurveTo(tMid, flick, tEnd, -cw * 0.068 + flick);
  ctx.moveTo(tStart, flick * 0.28);
  ctx.quadraticCurveTo(tMid, flick, tEnd, cw * 0.068 + flick);
  ctx.stroke();

  // Nostrils
  ctx.fillStyle = golden ? "rgba(92,40,14,0.55)" : "rgba(5,55,50,0.55)";
  ctx.beginPath();
  ctx.arc(rx * 0.8, -cw * 0.09, cw * 0.022, 0, Math.PI * 2);
  ctx.arc(rx * 0.8, cw * 0.09, cw * 0.022, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawBoard(ctx: CanvasRenderingContext2D, cssW: number, cssH: number, cw: number, ts: number, stars: Star[]) {
  ctx.fillStyle = "#03070e";
  ctx.fillRect(0, 0, cssW, cssH);

  // Nebula 1
  const n1 = ctx.createRadialGradient(cssW * 0.12, cssH * 0.22, 0, cssW * 0.12, cssH * 0.22, cssW * 0.52);
  n1.addColorStop(0, "rgba(99,102,241,0.16)"); n1.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = n1; ctx.fillRect(0, 0, cssW, cssH);

  const n2 = ctx.createRadialGradient(cssW * 0.88, cssH * 0.72, 0, cssW * 0.88, cssH * 0.72, cssW * 0.44);
  n2.addColorStop(0, "rgba(20,184,166,0.13)"); n2.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = n2; ctx.fillRect(0, 0, cssW, cssH);

  const n3 = ctx.createRadialGradient(cssW * 0.52, cssH * 0.48, 0, cssW * 0.52, cssH * 0.48, cssW * 0.28);
  n3.addColorStop(0, "rgba(244,114,182,0.05)"); n3.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = n3; ctx.fillRect(0, 0, cssW, cssH);

  // Stars
  for (const s of stars) {
    const tw = 0.45 + 0.55 * Math.sin(ts * 0.001 + s.twink);
    ctx.fillStyle = `rgba(255,255,255,${s.a * tw})`;
    ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
  }

  // Dot grid at intersections
  ctx.fillStyle = "rgba(148,163,184,0.13)";
  for (let x = 0; x <= GRID_W; x++) for (let y = 0; y <= GRID_H; y++) {
    ctx.beginPath(); ctx.arc(x * cw, y * cw, 1.15, 0, Math.PI * 2); ctx.fill();
  }

  // Very subtle cell lines
  ctx.strokeStyle = "rgba(148,163,184,0.04)";
  ctx.lineWidth = 0.5;
  for (let x = 0; x <= GRID_W; x++) {
    ctx.beginPath(); ctx.moveTo(x * cw, 0); ctx.lineTo(x * cw, cssH); ctx.stroke();
  }
  for (let y = 0; y <= GRID_H; y++) {
    ctx.beginPath(); ctx.moveTo(0, y * cw); ctx.lineTo(cssW, y * cw); ctx.stroke();
  }

  // Vignette
  const vig = ctx.createRadialGradient(cssW / 2, cssH / 2, cssH * 0.28, cssW / 2, cssH / 2, cssW * 0.78);
  vig.addColorStop(0, "rgba(0,0,0,0)"); vig.addColorStop(1, "rgba(0,0,0,0.4)");
  ctx.fillStyle = vig; ctx.fillRect(0, 0, cssW, cssH);
}

function drawFoodItem(ctx: CanvasRenderingContext2D, f: Food, cw: number, ts: number) {
  const cx = f.x * cw + cw / 2, cy = f.y * cw + cw / 2;
  const pa = 0.55 + 0.45 * Math.sin(ts * 0.004);
  const pb = 0.55 + 0.45 * Math.sin(ts * 0.004 + Math.PI * 0.7);

  if (f.kind === "super") {
    const isGold = f.mult && f.mult >= 3;
    const col = isGold ? "rgba(251,191,36,X)" : "rgba(167,139,250,X)";
    // Outer glow
    ctx.save();
    ctx.shadowColor = isGold ? "#fbbf24" : "#a78bfa"; ctx.shadowBlur = 20 * pa;
    ctx.beginPath(); ctx.arc(cx, cy, cw * 0.44 * pa, 0, Math.PI * 2);
    ctx.fillStyle = col.replace("X", "0.1"); ctx.fill(); ctx.restore();
    // Spinning sparkle dots
    const nDots = 5; const angOff = ts * 0.0035;
    for (let i = 0; i < nDots; i++) {
      const a = angOff + (i / nDots) * Math.PI * 2;
      const rr = cw * (0.46 + 0.06 * Math.sin(ts * 0.006 + i));
      const alpha = 0.35 + 0.35 * Math.sin(a + ts * 0.004);
      ctx.fillStyle = isGold ? `rgba(251,191,36,${alpha})` : `rgba(196,181,253,${alpha})`;
      ctx.beginPath(); ctx.arc(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr, 2.2, 0, Math.PI * 2); ctx.fill();
    }
  }

  if (f.kind === "power") {
    // Spinning hexagon border
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(ts * 0.002);
    const hexR = cw * 0.44;
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2 - Math.PI / 6;
      i === 0 ? ctx.moveTo(Math.cos(a) * hexR, Math.sin(a) * hexR) : ctx.lineTo(Math.cos(a) * hexR, Math.sin(a) * hexR);
    }
    ctx.closePath();
    ctx.strokeStyle = `rgba(56,189,248,${0.38 + 0.3 * pb})`; ctx.lineWidth = 1.8;
    ctx.shadowColor = "#38bdf8"; ctx.shadowBlur = 10 * pb;
    ctx.stroke(); ctx.restore();
  }

  // Normal food: subtle pulsing ring
  if (f.kind === "normal") {
    ctx.save();
    ctx.beginPath(); ctx.arc(cx, cy, cw * 0.38 * pa, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255,255,255,0.06)"; ctx.lineWidth = 1.5; ctx.stroke(); ctx.restore();
  }

  // Emoji
  ctx.font = `${Math.floor(cw * 0.67)}px system-ui,Segoe UI Emoji,Apple Color Emoji`;
  ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.fillText(f.emoji, cx, cy);

  // Labels
  if (f.kind === "super" && f.mult) {
    ctx.font = `700 ${Math.max(8, Math.floor(cw * 0.17))}px ui-sans-serif,system-ui,sans-serif`;
    ctx.fillStyle = f.mult >= 3 ? "rgba(251,191,36,0.95)" : "rgba(196,181,253,0.95)";
    ctx.fillText(`×${f.mult}`, cx, cy + cw * 0.33);
  }
  if (f.kind === "power" && f.power) {
    const tags: Record<PowerId, string> = { wrap: "TUN", magnet: "AIM", shield: "BOU" };
    ctx.font = `700 ${Math.max(7, Math.floor(cw * 0.14))}px ui-sans-serif,system-ui,sans-serif`;
    ctx.fillStyle = "rgba(125,211,252,0.95)";
    ctx.fillText(tags[f.power], cx, cy + cw * 0.34);
  }
}

function drawParticles(ctx: CanvasRenderingContext2D, particles: Particle[]) {
  for (const p of particles) {
    const alpha = p.life / p.maxLife;
    ctx.save(); ctx.globalAlpha = alpha * alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath(); ctx.arc(p.x, p.y, p.r * (0.3 + 0.7 * alpha), 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
}

function spawnParticles(ref: { current: Particle[] }, px: number, py: number, kind: Food["kind"], mult?: number) {
  const count = kind === "super" ? 18 : kind === "power" ? 14 : 9;
  const palette = kind === "super" && mult && mult >= 3
    ? ["#fbbf24","#f59e0b","#fde68a","#fff7ed"]
    : kind === "super"
    ? ["#a78bfa","#c4b5fd","#ddd6fe","#f5f3ff"]
    : kind === "power"
    ? ["#38bdf8","#7dd3fc","#bae6fd","#e0f2fe"]
    : ["#2dd4bf","#5eead4","#99f6e4","#f0fdfa"];
  const newP: Particle[] = Array.from({ length: count }, (_, i) => {
    const a = (i / count) * Math.PI * 2 + Math.random() * 0.6;
    const sp = 1.8 + Math.random() * 3.2;
    return { x: px, y: py, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 1.8,
             life: 28 + Math.floor(Math.random() * 22), maxLife: 50,
             r: 2.2 + Math.random() * 2.8, color: palette[Math.floor(Math.random() * palette.length)] };
  });
  ref.current = [...ref.current, ...newP];
}

// ?? COMPONENT ??????????????????????????????????????????????????????????????
export default function SerpentSnack({ profil, onXPGagne }: Props) {
  const { xpRewardsSuspended } = usePlatformIntegrity();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dirRef = useRef<Cell>({ x: 1, y: 0 });
  const pendingDirRef = useRef<Cell | null>(null);
  const activeIntervalRef = useRef<number | null>(null);
  const payoutDoneRef = useRef(false);
  const miniTickRef = useRef(0);
  // RAF refs
  const gameRef = useRef<GameModel>(initialGame());
  const cwRef = useRef(0);
  const particlesRef = useRef<Particle[]>([]);
  const eatSignalRef = useRef<EatSignal | null>(null);
  const starsRef = useRef<Star[]>([]);

  const [phase, setPhase] = useState<"accueil" | "jeu" | "quiz" | "fin">("accueil");
  const [game, setGame] = useState<GameModel>(() => initialGame());
  const [quiz, setQuiz] = useState<QuizQ[]>([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizCorrect, setQuizCorrect] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  const [gainAffiche, setGainAffiche] = useState(0);
  const [busy, setBusy] = useState(false);

  useEffect(() => { gameRef.current = game; }, [game]);

  // ?? Canvas resize setup ??
  useEffect(() => {
    const setup = () => {
      const canvas = canvasRef.current; if (!canvas) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const cssW = Math.min(580, Math.floor(window.innerWidth - 24));
      const cell = Math.floor(cssW / GRID_W);
      const cssH = cell * GRID_H;
      canvas.style.width = `${cssW}px`; canvas.style.height = `${cssH}px`;
      canvas.width = Math.floor(cssW * dpr); canvas.height = Math.floor(cssH * dpr);
      cwRef.current = cell;
      if (starsRef.current.length === 0) {
        starsRef.current = Array.from({ length: 45 }, () => ({
          x: Math.random() * cssW, y: Math.random() * cssH,
          r: Math.random() * 1.1 + 0.25,
          a: Math.random() * 0.38 + 0.07,
          twink: Math.random() * Math.PI * 2,
        }));
      }
    };
    setup();
    window.addEventListener("resize", setup);
    return () => window.removeEventListener("resize", setup);
  }, []);

  // ?? RAF render loop ??
  useEffect(() => {
    let rafId = 0;
    const loop = (ts: number) => {
      const canvas = canvasRef.current;
      if (!canvas) { rafId = requestAnimationFrame(loop); return; }
      const ctx = canvas.getContext("2d");
      if (!ctx) { rafId = requestAnimationFrame(loop); return; }
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const cw = cwRef.current; if (cw === 0) { rafId = requestAnimationFrame(loop); return; }
      const cssW = canvas.width / dpr, cssH = canvas.height / dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Process eat signal ? particles
      const sig = eatSignalRef.current;
      if (sig) {
        eatSignalRef.current = null;
        spawnParticles(particlesRef, sig.gx * cw + cw / 2, sig.gy * cw + cw / 2, sig.kind, sig.mult);
      }
      // Tick particles
      particlesRef.current = particlesRef.current
        .map(p => ({ ...p, x: p.x + p.vx, y: p.y + p.vy, vy: p.vy + 0.14, life: p.life - 1 }))
        .filter(p => p.life > 0);

      const g = gameRef.current;
      drawBoard(ctx, cssW, cssH, cw, ts, starsRef.current);
      for (const f of g.foods) drawFoodItem(ctx, f, cw, ts);
      if (g.snake.length > 0) {
        const pts = g.snake.map(s => ({ x: s.x * cw + cw / 2, y: s.y * cw + cw / 2 }));
        drawSnakeBody(ctx, pts, cw, ts, g.biteShields, g.wrapMovesLeft, g.magnetMovesLeft);
        drawHead(ctx, pts, cw, dirRef.current, ts, g.biteShields);
      }
      drawParticles(ctx, particlesRef.current);

      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, []);

  // ?? Keyboard ??
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (phase !== "jeu") return;
      const cur = dirRef.current; let nx = cur.x, ny = cur.y;
      if (e.key === "ArrowRight") { nx = 1; ny = 0; }
      else if (e.key === "ArrowLeft") { nx = -1; ny = 0; }
      else if (e.key === "ArrowUp") { nx = 0; ny = -1; }
      else if (e.key === "ArrowDown") { nx = 0; ny = 1; }
      else return;
      if (nx === -cur.x && ny === -cur.y) return;
      pendingDirRef.current = { x: nx, y: ny }; e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase]);

  // ?? Game tick ??
  useEffect(() => {
    if (phase !== "jeu") return;
    const stopTick = () => {
      if (activeIntervalRef.current != null) { window.clearInterval(activeIntervalRef.current); activeIntervalRef.current = null; }
    };
    const id = window.setInterval(() => {
      setGame(g => {
        const energy = Math.max(0, g.energy - ENERGY_DRAIN_PER_SUB);
        if (energy <= 0) {
          stopTick(); setQuiz(pickQuizBatch()); setQuizIndex(0); setQuizCorrect(0); setPhase("quiz");
          miniTickRef.current = 0; return { ...g, energy: 0 };
        }
        const need = ticksPerMove(g.totalMoves);
        miniTickRef.current += 1;
        if (miniTickRef.current < need) return { ...g, energy };
        miniTickRef.current = 0;

        if (pendingDirRef.current) { dirRef.current = pendingDirRef.current; pendingDirRef.current = null; }

        let comboMul = g.comboMul, comboMovesLeft = g.comboMovesLeft;
        let wrapMovesLeft = g.wrapMovesLeft, magnetMovesLeft = g.magnetMovesLeft, biteShields = g.biteShields;

        const foodsLive = magnetMovesLeft > 0 ? applyMagnetFoods(g.foods, g.snake) : g.foods;
        const head = g.snake[0], d = dirRef.current;
        let nh = { x: head.x + d.x, y: head.y + d.y };

        if (wrapMovesLeft > 0) {
          nh = { x: ((nh.x % GRID_W) + GRID_W) % GRID_W, y: ((nh.y % GRID_H) + GRID_H) % GRID_H };
        } else if (nh.x < 0 || nh.x >= GRID_W || nh.y < 0 || nh.y >= GRID_H) {
          stopTick(); setPhase("fin"); return { ...g, energy };
        }

        const ate = foodsLive.find(f => f.x === nh.x && f.y === nh.y);
        const bodyForHit = ate ? g.snake : g.snake.slice(0, -1);
        const hitBody = bodyForHit.some(s => s.x === nh.x && s.y === nh.y);

        const tickCombo = () => { if (comboMovesLeft > 0) { comboMovesLeft--; if (comboMovesLeft <= 0) { comboMul = 1; comboMovesLeft = 0; } } };

        if (hitBody) {
          if (biteShields > 0) {
            biteShields--;
            let ns: Cell[] = [nh, ...g.snake];
            while (ns.length > 1 && ns.slice(1).some(s => s.x === ns[0].x && s.y === ns[0].y)) ns = ns.slice(0, -1);
            tickCombo();
            if (wrapMovesLeft > 0) wrapMovesLeft--; if (magnetMovesLeft > 0) magnetMovesLeft--;
            return { ...g, snake: ns, foods: foodsLive, energy, score: g.score + Math.round(2 * comboMul), totalMoves: g.totalMoves + 1, comboMul, comboMovesLeft, wrapMovesLeft, magnetMovesLeft, biteShields };
          }
          stopTick(); setPhase("fin"); return { ...g, energy };
        }

        let foods = foodsLive, snake = g.snake, score = g.score, manges = g.manges, superManges = g.superManges;
        const totalMoves = g.totalMoves + 1;

        if (ate) {
          eatSignalRef.current = { gx: nh.x, gy: nh.y, kind: ate.kind, mult: ate.mult };
          const rest = foods.filter(f => f !== ate);
          foods = [...rest, randomFood([nh, ...g.snake], rest)];
          snake = [nh, ...g.snake];
          const base = 18 + Math.min(22, snake.length * 2);
          if (ate.kind === "super") {
            superManges++; const m = ate.mult ?? 2; score += Math.round(base * m); comboMul = m; comboMovesLeft = ate.comboMoves ?? 12;
          } else if (ate.kind === "power") {
            score += Math.round(14 * comboMul); tickCombo();
            if (ate.power === "wrap") wrapMovesLeft = Math.max(wrapMovesLeft, 24);
            if (ate.power === "magnet") magnetMovesLeft = Math.max(magnetMovesLeft, 18);
            if (ate.power === "shield") biteShields = Math.min(2, biteShields + 1);
          } else { score += Math.round(base * comboMul); tickCombo(); }
          manges++;
        } else {
          snake = [nh, ...g.snake.slice(0, -1)]; score += Math.round(1 * comboMul); tickCombo();
        }

        const skipPT = ate && ate.kind === "power" && (ate.power === "wrap" || ate.power === "magnet");
        if (!skipPT) { if (wrapMovesLeft > 0) wrapMovesLeft--; if (magnetMovesLeft > 0) magnetMovesLeft--; }

        return { snake, foods, energy, score, manges, superManges, totalMoves, comboMul, comboMovesLeft, wrapMovesLeft, magnetMovesLeft, biteShields };
      });
    }, SUB_MS);
    activeIntervalRef.current = id;
    return () => stopTick();
  }, [phase]);

  const terminerEtCrediter = useCallback(async (scoreFinal: number) => {
    const user = auth.currentUser;
    if (!user) { setMessage("Connecte-toi pour récupérer tes jetons."); return; }
    if (xpRewardsSuspended) {
      setMessage(PLATFORM_XP_BLOCKED_MESSAGE);
      setGainAffiche(0);
      return;
    }
    const raw = computeXpGain(scoreFinal); setBusy(true);
    try {
      const ref = doc(db, "users", user.uid), day = todayKey();
      const xpAdd = await runTransaction(db, async tx => {
        const snap = await tx.get(ref); if (!snap.exists()) return 0;
        const data = snap.data() as Record<string, unknown>;
        const meta = (data[STORAGE_KEY] as { day?: string; xpToday?: number }) || {};
        const xpToday = meta.day === day ? Number(meta.xpToday || 0) : 0;
        const add = Math.max(0, Math.min(raw, DAILY_XP_CAP - xpToday));
        if (add <= 0) return 0;
        tx.update(ref, { xp: Number(data.xp || 0) + add, [STORAGE_KEY]: { version: 1, day, xpToday: xpToday + add, lastScore: scoreFinal, updatedAt: Date.now() } });
        return add;
      });
      setGainAffiche(xpAdd);
      if (xpAdd === 0) setMessage(`Plafond du jour atteint \u2014 rejoue demain !`);
      else if (xpAdd < raw) setMessage(`Plafond atteint (${DAILY_XP_CAP} max) : tu gagnes quand m\u00eame ${formatJetonsDelta(xpAdd)}.`);
      else setMessage(`Bravo\u00a0! ${formatJetonsDelta(xpAdd)} ajout\u00e9s \u00e0 ton solde.`);
      onXPGagne?.();
    } catch (e) { console.error(e); setMessage("Impossible d'enregistrer les jetons."); }
    finally { setBusy(false); }
  }, [onXPGagne, xpRewardsSuspended]);

  useEffect(() => {
    if (phase !== "fin" || payoutDoneRef.current) return;
    payoutDoneRef.current = true;
    void terminerEtCrediter(game.score);
  }, [phase, game.score, terminerEtCrediter]);

  const resetRun = useCallback(() => {
    dirRef.current = { x: 1, y: 0 }; pendingDirRef.current = null; miniTickRef.current = 0;
    particlesRef.current = []; eatSignalRef.current = null;
    setGame(initialGame()); setQuiz([]); setQuizIndex(0); setQuizCorrect(0); setGainAffiche(0); setMessage(null);
  }, []);

  const demarrer = () => { payoutDoneRef.current = false; resetRun(); setPhase("jeu"); };

  const repondreQuiz = (idx: 0 | 1 | 2 | 3) => {
    const q = quiz[quizIndex]; if (!q) return;
    const right = idx === q.ok ? 1 : 0, isLast = quizIndex >= 2;
    if (isLast) {
      const total = quizCorrect + right;
      const refill = total === 1 ? 40 : total === 2 ? 68 : total === 3 ? ENERGY_MAX : 14;
      setGame(g => ({ ...g, energy: Math.min(ENERGY_MAX, refill), score: g.score + Math.round(total * 14 * Math.max(1, g.comboMul)) }));
      setQuizCorrect(total); setPhase("jeu"); miniTickRef.current = 0; return;
    }
    setQuizCorrect(c => c + right); setQuizIndex(i => i + 1);
  };

  const setDirBtn = (nx: number, ny: number) => {
    if (phase !== "jeu") return;
    const cur = dirRef.current;
    if (nx === -cur.x && ny === -cur.y) return;
    pendingDirRef.current = { x: nx, y: ny };
  };

  const prenom = profil?.prenom || "toi";
  const rhythmMs = ticksPerMove(game.totalMoves) * SUB_MS;
  const showCombo = phase === "jeu" && game.comboMul > 1 && game.comboMovesLeft > 0;
  const energyPct = game.energy;
  const energyColor = energyPct > 50 ? "from-emerald-400 via-teal-400 to-cyan-400" : energyPct > 25 ? "from-amber-400 via-orange-400 to-yellow-400" : "from-rose-500 via-red-500 to-orange-500";

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#03070e] pb-28 text-slate-100">
      {/* Ambient bg */}
      <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 40% at 15% 0%, rgba(99,102,241,0.28) 0%, transparent 60%), radial-gradient(ellipse 60% 35% at 90% 5%, rgba(20,184,166,0.18) 0%, transparent 55%), radial-gradient(ellipse 50% 30% at 50% 100%, rgba(244,114,182,0.10) 0%, transparent 50%)" }} />

      <div className="relative z-10 mx-auto max-w-lg px-3 pt-7 sm:pt-10" style={{ overscrollBehavior: "contain" }}>

        {/* ?? Header ????????????????????????????????????????????????? */}
        <header className="mb-6 text-center">
          <div className="mb-3 inline-flex items-center gap-2">
            <span className="rounded-full border border-teal-400/25 bg-teal-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-teal-200/90">Arcade révisions</span>
            <span className="rounded-full border border-violet-400/25 bg-violet-400/10 px-2.5 py-1 text-[10px] font-semibold text-violet-200/80">v4</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl" style={{ background: "linear-gradient(135deg, #5eead4 0%, #22d3ee 35%, #818cf8 70%, #c084fc 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Snack Serpent
          </h1>
          <p className="mt-2.5 text-sm leading-relaxed text-slate-400">
            Salut <span className="font-semibold text-teal-300">{prenom}</span> à mange des snacks, gère ton{" "}
            <span className="font-semibold text-amber-300">—nergie</span>, chope des{" "}
            <span className="font-semibold text-violet-300">super snacks</span> et des{" "}
            <span className="font-semibold text-cyan-300">pouvoirs</span>. Max {DAILY_XP_CAP} jetons/jour.
          </p>
        </header>

        {/* ?? HUD ???????????????????????????????????????????????????? */}
        <div className="mb-4 grid grid-cols-2 gap-3">
          {/* Energy */}
          <div className="rounded-2xl border border-white/8 bg-white/[0.045] p-3.5 backdrop-blur-xl">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">—nergie</span>
              <span className="font-mono text-xs font-semibold text-white/75">{Math.round(energyPct)}%</span>
            </div>
            <div className="relative h-3 overflow-hidden rounded-full bg-black/50 ring-1 ring-white/8">
              <div className={`h-full rounded-full bg-gradient-to-r ${energyColor} transition-[width] duration-100`} style={{ width: `${energyPct}%` }} />
              <div className="absolute inset-0 rounded-full" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.12) 0%, transparent 60%)" }} />
            </div>
          </div>
          {/* Score */}
          <div className="rounded-2xl border border-white/8 bg-white/[0.045] p-3.5 text-right backdrop-blur-xl">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Score</p>
            <p className="mt-0.5 text-3xl font-black tabular-nums tracking-tight text-white">{game.score}</p>
            <p className="mt-0.5 text-xs text-slate-500">{game.manges} snacks{game.superManges > 0 ? <><span className="text-violet-400"> à {game.superManges}</span> super</> : null}</p>
          </div>
        </div>

        {/* ?? Combo + Speed ??????????????????????????????????????????? */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-2.5 backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Rythme</span>
            <span className="rounded-md border border-white/10 bg-black/30 px-2 py-0.5 font-mono text-[11px] text-teal-300">~{rhythmMs} ms</span>
          </div>
          {showCombo ? (
            <div className="flex items-center gap-1.5 rounded-full border border-fuchsia-400/40 bg-fuchsia-500/15 px-3 py-1 text-xs font-bold text-fuchsia-100" style={{ boxShadow: "0 0 20px rgba(217,70,239,0.3)" }}>
              <span className="opacity-80">Combo</span>
              <span className="tabular-nums">—{game.comboMul}</span>
              <span className="font-normal opacity-60">({game.comboMovesLeft})</span>
            </div>
          ) : (
            <span className="text-[11px] text-slate-600">pas de combo actif</span>
          )}
        </div>

        {/* ?? Powers ?????????????????????????????????????????????????? */}
        {phase === "jeu" && (
          <div className="mb-4 flex flex-wrap gap-2 rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-2.5 backdrop-blur-xl">
            <span className="w-full text-[10px] font-bold uppercase tracking-wider text-slate-600">Pouvoirs</span>
            {[
              { emoji: "\u{1F300}", label: "Tunnel", val: game.wrapMovesLeft, col: "border-violet-400/40 bg-violet-500/12 text-violet-200" },
              { emoji: "\u{1F9F2}", label: "Aimant", val: game.magnetMovesLeft, col: "border-cyan-400/40 bg-cyan-500/12 text-cyan-200" },
              { emoji: "\u{1F6E1}", label: `Bouclier ${game.biteShields}/2`, val: game.biteShields, col: "border-amber-400/40 bg-amber-500/12 text-amber-200" },
            ].map(({ emoji, label, val, col }) => (
              <span key={label} className={`rounded-xl border px-2.5 py-1 text-[11px] font-semibold tabular-nums transition-all ${val > 0 ? col : "border-white/8 bg-black/20 text-slate-600"}`}>
                {emoji} {label}{typeof val === "number" && label !== `Bouclier ${game.biteShields}/2` ? (val > 0 ? ` à ${val}` : " —") : ""}
              </span>
            ))}
          </div>
        )}

        {/* ?? Canvas ?????????????????????????????????????????????????? */}
        <div className="mb-5 flex justify-center">
          <div className="relative w-full" style={{ borderRadius: "1.25rem", padding: "3px", background: "linear-gradient(135deg, rgba(94,234,212,0.55) 0%, rgba(129,140,248,0.45) 50%, rgba(192,132,252,0.4) 100%)", boxShadow: "0 0 0 1px rgba(255,255,255,0.06) inset, 0 24px 80px -20px rgba(20,184,166,0.35), 0 0 120px -40px rgba(99,102,241,0.4)" }}>
            <div className="overflow-hidden rounded-[calc(1.25rem-3px)]">
              <canvas ref={canvasRef} className="block" aria-label="Aire de jeu serpent" />
            </div>
          </div>
        </div>

        {/* ?? Welcome ????????????????????????????????????????????????? */}
        {phase === "accueil" && (
          <div className="flex flex-col gap-4">
            <button type="button" onClick={demarrer}
              className="group relative w-full overflow-hidden rounded-2xl py-4 text-[15px] font-black tracking-wider text-slate-950 transition active:scale-[0.98]"
              style={{ boxShadow: "0 16px 50px -12px rgba(94,234,212,0.65), 0 0 0 1px rgba(255,255,255,0.1) inset" }}>
              <span className="absolute inset-0 bg-gradient-to-r from-teal-300 via-cyan-300 to-violet-400 transition-all group-hover:brightness-110" />
              <span className="relative flex items-center justify-center gap-2">
                <span>Lancer la partie</span>
                <span className="text-lg">{String.fromCodePoint(0x1f40d)}</span>
              </span>
            </button>
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-center text-xs leading-relaxed text-slate-500">
              <p>Fl’ches clavier ou pad tactile ci-dessous</p>
              <p className="mt-1">{String.fromCodePoint(0x1f300)} tunnel à {String.fromCodePoint(0x1f9f2)} aimant à {String.fromCodePoint(0x1f6e1)} bouclier à {String.fromCodePoint(0x1f31f)} combo</p>
            </div>
          </div>
        )}

        {/* ?? D-pad ??????????????????????????????????????????????????? */}
        {phase === "jeu" && (
          <div className="mx-auto grid w-full max-w-[260px] grid-cols-3 gap-2.5 touch-manipulation">
            <span /><PadBtn onClick={() => setDirBtn(0, -1)} label="?" /><span />
            <PadBtn onClick={() => setDirBtn(-1, 0)} label="?" />
            <div className="flex min-h-[3.5rem] items-center justify-center text-[9px] font-bold uppercase tracking-widest text-slate-700 rounded-xl border border-dashed border-white/10">PAD</div>
            <PadBtn onClick={() => setDirBtn(1, 0)} label="?" />
            <span /><PadBtn className="col-span-3" onClick={() => setDirBtn(0, 1)} label="?" /><span />
          </div>
        )}

        {/* ?? Quiz ???????????????????????????????????????????????????? */}
        {phase === "quiz" && quiz[quizIndex] && (
          <div className="rounded-[1.35rem] border border-amber-400/30 p-5 backdrop-blur-2xl sm:p-6"
            style={{ background: "linear-gradient(135deg, rgba(251,191,36,0.12) 0%, rgba(15,23,42,0.88) 50%, rgba(3,7,14,0.92) 100%)", boxShadow: "0 0 60px -20px rgba(251,191,36,0.4)" }}>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-200/85">Recharge —nergie à question {quizIndex + 1}/3</p>
            <p className="mt-4 text-base font-semibold leading-snug text-white sm:text-lg">{quiz[quizIndex].q}</p>
            <div className="mt-4 grid gap-2.5">
              {quiz[quizIndex].choices.map((c, i) => (
                <button key={i} type="button" onClick={() => repondreQuiz(i as 0|1|2|3)}
                  className="rounded-xl border border-white/10 bg-white/[0.055] px-4 py-3 text-left text-sm font-medium text-slate-100 transition hover:border-teal-400/40 hover:bg-teal-500/10 hover:text-white active:scale-[0.99]">
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ?? Game Over ??????????????????????????????????????????????? */}
        {phase === "fin" && (
          <div className="rounded-[1.35rem] border border-rose-400/30 p-6 text-center backdrop-blur-2xl"
            style={{ background: "linear-gradient(135deg, rgba(244,63,94,0.13) 0%, rgba(15,23,42,0.88) 50%, rgba(3,7,14,0.92) 100%)", boxShadow: "0 0 60px -22px rgba(244,63,94,0.5)" }}>
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-rose-300/80">Game over</p>
            <p className="mt-2 text-5xl font-black tabular-nums tracking-tight text-white">{game.score}</p>
            <p className="mt-2 text-sm text-slate-500">{game.manges} snacks{game.superManges > 0 ? ` \u2014 ${game.superManges} super` : ""}</p>
            {busy ? <p className="mt-5 text-slate-400">Enregistrement...</p>
              : <p className="mt-5 text-lg font-bold" style={{ background: "linear-gradient(90deg, #34d399, #5eead4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  {gainAffiche > 0 ? formatJetonsDelta(gainAffiche) : "0 jetons"}
                </p>}
            {message && <p className="mt-3 text-sm leading-relaxed text-slate-400">{message}</p>}
            <button type="button" disabled={busy} onClick={() => { payoutDoneRef.current = false; setPhase("accueil"); resetRun(); setMessage(null); }}
              className="mt-6 w-full rounded-2xl border border-white/10 bg-white/[0.08] py-3.5 text-sm font-bold text-white transition hover:bg-white/[0.14] disabled:opacity-40">
              Rejouer {String.fromCodePoint(0x1f504)}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function PadBtn({ label, onClick, className = "" }: { label: string; onClick: () => void; className?: string }) {
  return (
    <button type="button" onClick={onClick} style={{ touchAction: "manipulation" }}
      className={`min-h-[3.5rem] select-none rounded-xl border border-white/10 bg-white/[0.06] text-2xl font-bold text-white backdrop-blur-sm transition hover:border-teal-400/30 hover:bg-teal-500/10 active:scale-95 active:bg-teal-500/18 ${className}`}>
      {label}
    </button>
  );
}
