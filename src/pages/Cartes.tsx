// @ts-nocheck
import { useState, useEffect, useMemo, useRef } from "react";
import { Icon } from "@iconify/react";
import { db, auth } from "../services/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { COLLECTIONS } from "../services/collectionsData";
import { getPrestigeTotal } from "../services/userProfileService";
import { formatJetons, formatJetonsDelta } from "../lib/jetons";
import { PLATFORM_XP_BLOCKED_MESSAGE, usePlatformIntegrity } from "../contexts/PlatformIntegrityContext";

// ─── CSS keyframes injected once ───────────────────────────────────────────────
const CSS_KEYFRAMES = `
@keyframes packFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
@keyframes packShake { 0%,100%{transform:rotate(0deg) scale(1)} 20%{transform:rotate(-4deg) scale(1.02)} 40%{transform:rotate(4deg) scale(1.02)} 60%{transform:rotate(-3deg) scale(1.01)} 80%{transform:rotate(3deg) scale(1.01)} }
@keyframes cardReveal { from{opacity:0;transform:translateY(50px) scale(0.7)} to{opacity:1;transform:translateY(0) scale(1)} }
@keyframes cardFlip { 0%{transform:rotateY(0deg)} 40%{transform:rotateY(90deg)} 100%{transform:rotateY(0deg)} }
@keyframes particleExplode { from{opacity:1;transform:translate(0,0) scale(1)} to{opacity:0;transform:translate(var(--tx),var(--ty)) scale(0)} }
@keyframes shimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
@keyframes legendaryGlow { 0%,100%{box-shadow:0 0 20px #d97706aa,0 0 40px #d9770644} 50%{box-shadow:0 0 50px #fbbf24cc,0 0 80px #d97706aa,0 0 120px #d9770644} }
@keyframes prismaticShift { 0%{filter:hue-rotate(0deg) brightness(1.1)} 100%{filter:hue-rotate(360deg) brightness(1.1)} }
@keyframes goldParticle { 0%{opacity:1;transform:translate(0,0) scale(1)} 100%{opacity:0;transform:translate(var(--dx),var(--dy)) scale(0)} }
@keyframes flashIn { 0%{opacity:0} 30%{opacity:1} 100%{opacity:0} }
@keyframes titlePulse { 0%,100%{transform:scale(1);text-shadow:0 0 20px #FFD70080} 50%{transform:scale(1.04);text-shadow:0 0 40px #FFD700cc,0 0 80px #FFD70066} }
@keyframes floatBg { 0%,100%{transform:translateY(0) rotate(0deg)} 33%{transform:translateY(-8px) rotate(1deg)} 66%{transform:translateY(4px) rotate(-1deg)} }
@keyframes holoPrism { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
@keyframes arrowR { 0%,100%{transform:translateX(0);opacity:.4} 50%{transform:translateX(7px);opacity:.95} }
@keyframes arrowL { 0%,100%{transform:translateX(0);opacity:.4} 50%{transform:translateX(-7px);opacity:.95} }
@keyframes rainbowBurst { 0%{opacity:0;transform:scale(0.3)} 18%{opacity:1} 70%{opacity:0.85} 100%{opacity:0;transform:scale(3.2)} }
@keyframes rainbowFlow { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
@keyframes tearPulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.03)} }
@keyframes packShakeHard { 0%,100%{transform:translate(0,0)} 10%{transform:translate(-6px,3px)} 20%{transform:translate(6px,-3px)} 30%{transform:translate(-5px,2px)} 40%{transform:translate(5px,-2px)} 50%{transform:translate(-4px,1px)} 60%{transform:translate(4px,-1px)} 70%{transform:translate(-3px,0)} 80%{transform:translate(3px,0)} 90%{transform:translate(-1px,0)} }
@keyframes crackPulse { 0%,100%{opacity:.8;box-shadow:0 0 10px #fff,0 0 22px #F472B6} 50%{opacity:1;box-shadow:0 0 20px #fff,0 0 44px #F472B6,0 0 70px rgba(244,114,182,.5)} }
@keyframes halfFlyLeft { 0%{transform:translateX(-4px)} 100%{transform:translateX(-380px) rotate(-22deg) translateY(-35px);opacity:0} }
@keyframes halfFlyRight { 0%{transform:translateX(4px)} 100%{transform:translateX(380px) rotate(22deg) translateY(-35px);opacity:0} }
`;

// ─── Rarity config ──────────────────────────────────────────────────────────────
const RARETE_CONFIG = {
  commune:     { label: "Commune",     couleur: "#94A3B8", emoji: "⚪", bonus: 0,   gradient: "linear-gradient(135deg, #1e293b 0%, #334155 100%)", glow: "#94A3B8", icon: "noto:card-index" },
  peu_commune: { label: "Peu Commune", couleur: "#10B981", emoji: "🟢", bonus: 0,   gradient: "linear-gradient(135deg, #052e16 0%, #064e3b 50%, #065f46 100%)", glow: "#10B981", icon: "noto:green-circle" },
  rare:        { label: "Rare",        couleur: "#60A5FA", emoji: "🔵", bonus: 0.5, gradient: "linear-gradient(135deg, #1e3a5f 0%, #1e40af 50%, #4c1d95 100%)", glow: "#60A5FA", icon: "noto:blue-circle" },
  epique:      { label: "Épique",      couleur: "#C084FC", emoji: "💜", bonus: 1,   gradient: "linear-gradient(135deg, #4c1d95 0%, #7e22ce 50%, #9d174d 100%)", glow: "#C084FC", icon: "noto:purple-heart" },
  legendaire:  { label: "Légendaire",  couleur: "#FBBF24", emoji: "⭐", bonus: 2,   gradient: "linear-gradient(135deg, #78350f 0%, #b45309 50%, #d97706 100%)", glow: "#FBBF24", icon: "noto:star", animated: "legendaryGlow" },
  ultra_rare:  { label: "Ultra Rare",  couleur: "#F472B6", emoji: "🌈", bonus: 3,   gradient: "linear-gradient(135deg, #7c3aed 0%, #be185d 50%, #0369a1 100%)", glow: "#F472B6", icon: "noto:rainbow", animated: "prismaticShift" },
};

const PACKS = [
  { id: "basique",    nom: "Pack Basique",         emoji: "🎴", cout: 20,  nbCartes: 3, couleur: "#6B7280", gradient: "linear-gradient(135deg, #6B7280, #374151)", description: "3 cartes • 80% communes • 20% peu communes", prob: { commune: 0.79, peu_commune: 0.20, rare: 0, epique: 0, legendaire: 0, ultra_rare: 0.01 } },
  { id: "avance",     nom: "Pack Avancé",           emoji: "✨", cout: 55,  nbCartes: 3, couleur: "#3B82F6", gradient: "linear-gradient(135deg, #3B82F6, #1D4ED8)", description: "3 cartes • Chance d'obtenir des rares !", prob: { commune: 0.59, peu_commune: 0.30, rare: 0.10, epique: 0, legendaire: 0, ultra_rare: 0.01 } },
  { id: "legendaire", nom: "Pack Légendaire",       emoji: "👑", cout: 140, nbCartes: 3, couleur: "#F59E0B", gradient: "linear-gradient(135deg, #F59E0B, #B45309)", description: "3 cartes • Épiques et légendaires possibles !", prob: { commune: 0.39, peu_commune: 0.40, rare: 0.15, epique: 0.04, legendaire: 0.01, ultra_rare: 0.01 } },
  { id: "mystere",    nom: "Pack Mystère 🎲",       emoji: "🎲", cout: 0,   nbCartes: 3, couleur: "#EC4899", gradient: "linear-gradient(135deg, #EC4899, #9D174D)", description: "Gratuit • 1 fois par semaine • Probabilités inconnues !", prob: { commune: 0.40, peu_commune: 0.30, rare: 0.18, epique: 0.08, legendaire: 0.03, ultra_rare: 0.01 } },
];

const SPECIAL_COLLECTION_IDS = new Set(["special_drop1"]);
const PRESTIGE_XP_RATIO = 10;

const isSpecialCollection = (col) => SPECIAL_COLLECTION_IDS.has(col?.id);
const getNonSpecialCollections = (cols = []) => cols.filter(c => !isSpecialCollection(c));
const getCollectionMatiere = (col) => col.matiere || "SDGN";
const getCollectionTheme = (col) => col.theme || "Sans thème";
const getPacksForCollection = (col) => isSpecialCollection(col) ? [] : PACKS.filter(p => p.id !== "mystere");

const getDebutSemaine = () => { const d = new Date(); const j = d.getDay(); const diff = d.getDate() - j + (j === 0 ? -6 : 1); const l = new Date(d.setDate(diff)); return `${l.getFullYear()}-${l.getMonth()}-${l.getDate()}`; };
const getAujourdhui = () => { const d = new Date(); return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`; };

const tirerCarte = (pack, collection) => {
  const rand = Math.random(); let cumul = 0; let rarete = "commune";
  for (const [r, p] of Object.entries(pack.prob)) { cumul += p; if (rand < cumul) { rarete = r; break; } }
  const dispo = collection.cartes.filter(c => c.rarete === rarete);
  return dispo.length ? dispo[Math.floor(Math.random() * dispo.length)] : collection.cartes[Math.floor(Math.random() * collection.cartes.length)];
};

// ─── ParticleExplosion ──────────────────────────────────────────────────────────
const PARTICLE_COLORS = ["#FFD700", "#FFA500", "#FF6B35", "#7C3AED", "#06B6D4", "#EC4899", "#FBBF24", "#C084FC"];
const ParticleExplosion = ({ active }) => {
  const particles = useMemo(() => Array.from({ length: 24 }, (_, i) => {
    const angle = (i / 24) * 360 + Math.random() * 15;
    const dist = 80 + Math.random() * 140;
    const rad = (angle * Math.PI) / 180;
    return {
      dx: `${Math.cos(rad) * dist}px`,
      dy: `${Math.sin(rad) * dist}px`,
      color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
      size: 4 + Math.random() * 7,
      delay: Math.random() * 0.25,
      duration: 0.7 + Math.random() * 0.4,
    };
  }), []);
  if (!active) return null;
  return (
    <div style={{ position: "absolute", top: "50%", left: "50%", pointerEvents: "none", zIndex: 10 }}>
      {particles.map((p, i) => (
        <div key={i} style={{
          position: "absolute", width: p.size, height: p.size,
          borderRadius: "50%", background: p.color,
          "--dx": p.dx, "--dy": p.dy,
          animation: `goldParticle ${p.duration}s ease-out ${p.delay}s forwards`,
          transform: "translate(-50%, -50%)",
        }} />
      ))}
    </div>
  );
};

// ─── AnimationOuverture (TCG — déchirer + locked + split + arc-en-ciel) ───────
const AnimationOuverture = ({ cartes, onVoirCollection, onOuvrirAutrePack }) => {
  // phases: idle → locked → tearing → flash → revealing → done
  const [phase, setPhase] = useState("idle");
  const [visibleCount, setVisibleCount] = useState(0);
  const [showParticles, setShowParticles] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [tearDir, setTearDir] = useState(1);
  const [rainbowBurstActive, setRainbowBurstActive] = useState(false);

  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const dragXRef = useRef(0);
  const didTrigger = useRef(false);

  // Seuil plus élevé = crack bien visible avant de déclencher
  const TEAR_THRESHOLD = 125;

  const triggerTear = (dir) => {
    if (didTrigger.current) return;
    didTrigger.current = true;
    isDraggingRef.current = false;
    setIsDragging(false);
    dragXRef.current = 0;
    setDragX(0);
    setTearDir(dir);
    // Phase 1 : pack fissuré + vibration intense (700ms)
    setPhase("locked");

    setTimeout(() => {
      // Phase 2 : les 2 moitiés s'envolent (700ms CSS transition)
      setPhase("tearing");
      setShowParticles(true);

      // Phase 3 : flash pendant que les moitiés volent encore (après 350ms)
      setTimeout(() => {
        setPhase("flash");
        // Phase 4 : révélation des cartes (après 500ms)
        setTimeout(() => {
          setPhase("revealing");
          let count = 0;
          const revealNext = () => {
            count++;
            setVisibleCount(count);
            const card = cartes[count - 1];
            if (card && ["rare", "epique", "legendaire", "ultra_rare"].includes(card.rarete)) {
              setRainbowBurstActive(true);
              setTimeout(() => setRainbowBurstActive(false), 1600);
            }
            if (count < cartes.length) setTimeout(revealNext, 750);
            else setTimeout(() => setPhase("done"), 1000);
          };
          revealNext();
        }, 500);
      }, 350);
    }, 700);
  };

  const onStart = (clientX, clientY) => {
    if (phase !== "idle" || didTrigger.current) return;
    isDraggingRef.current = true;
    startXRef.current = clientX;
    startYRef.current = clientY;
    dragXRef.current = 0;
    setDragX(0);
    setIsDragging(true);
  };

  const onMove = (clientX, clientY) => {
    if (!isDraggingRef.current || phase !== "idle") return;
    const dx = clientX - startXRef.current;
    const dy = clientY - (startYRef.current || 0);
    // Ignorer si le mouvement est surtout vertical (défilement mobile)
    if (Math.abs(dx) < Math.abs(dy) * 1.2) return;
    dragXRef.current = dx;
    setDragX(dx);
    if (Math.abs(dx) >= TEAR_THRESHOLD) {
      isDraggingRef.current = false;
      setIsDragging(false);
      triggerTear(dx > 0 ? 1 : -1);
    }
  };

  const onEnd = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDragging(false);
    const dx = dragXRef.current;
    if (Math.abs(dx) >= TEAR_THRESHOLD * 0.7) {
      triggerTear(dx > 0 ? 1 : -1);
    } else {
      dragXRef.current = 0;
      setDragX(0);
    }
  };

  const progress = Math.min(Math.abs(dragX) / TEAR_THRESHOLD, 1);
  const allDone = phase === "done";

  // ─── Contenu intérieur du pack (partagé entre les 2 moitiés) ───────────────
  const packBg = "linear-gradient(135deg, #0f0521 0%, #1e0a45 40%, #2d1054 70%, #4c1d95 100%)";

  const renderPackFace = (showDragFx = false) => (
    <>
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,.13) 50%, transparent 70%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 2.5s linear infinite",
      }} />
      {showDragFx && isDragging && (
        <div style={{
          position: "absolute", top: "6px", bottom: "6px", left: "50%",
          transform: "translateX(-50%)",
          width: `${1.5 + progress * 5}px`,
          background: `linear-gradient(to bottom, transparent, rgba(255,255,255,${.4 + progress * .6}) 50%, transparent)`,
          boxShadow: `0 0 ${4 + progress * 24}px rgba(255,255,255,${.5 + progress * .5}), 0 0 ${8 + progress * 48}px rgba(244,114,182,${progress})`,
          borderRadius: "3px", zIndex: 10, pointerEvents: "none",
        }} />
      )}
      {showDragFx && isDragging && progress > 0.45 && (
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none", zIndex: 5,
          background: `radial-gradient(ellipse at center, rgba(244,114,182,${(progress - .45) * .75}) 0%, transparent 70%)`,
        }} />
      )}
      <span style={{ fontSize: "3rem", filter: `drop-shadow(0 0 ${10 + progress * 12}px #7C3AED)`, position: "relative", zIndex: 3 }}>🎓</span>
      <p style={{ fontFamily: "'Fredoka One', cursive", color: "#FFD700", fontSize: "1.1rem", margin: 0, letterSpacing: ".05em", textShadow: "0 0 20px #FFD70080", position: "relative", zIndex: 3 }}>STMG HUB</p>
      <div style={{ background: "rgba(255,215,0,.15)", border: "1px solid #FFD70040", borderRadius: "100px", padding: "3px 14px", color: "#FFD700", fontFamily: "'Fredoka One', cursive", fontSize: ".75rem", position: "relative", zIndex: 3 }}>
        {cartes.length} {cartes.length > 1 ? "cartes" : "carte"}
      </div>
      {["top:8px;left:10px", "top:8px;right:10px", "bottom:8px;left:10px", "bottom:8px;right:10px"].map((pos, j) => (
        <span key={j} style={{ position: "absolute", fontSize: ".7rem", opacity: .38, ...Object.fromEntries(pos.split(";").map(p => p.split(":"))) }}>✦</span>
      ))}
    </>
  );

  // Style commun du pack (plein 180×252)
  const packFullStyle = {
    width: "180px", height: "252px",
    borderRadius: "20px",
    background: packBg,
    position: "relative", overflow: "hidden",
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px",
  };

  return (
    <div
      onMouseMove={e => onMove(e.clientX, e.clientY)}
      onMouseUp={onEnd}
      onMouseLeave={onEnd}
      style={{
        position: "fixed", inset: 0, zIndex: 2000,
        background: "radial-gradient(ellipse at 30% 20%, #1a0533 0%, #0a0a0f 60%, #000 100%)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        gap: "28px", padding: "20px", overflow: "hidden",
        userSelect: "none",
      }}
    >
      {/* Burst arc-en-ciel sur carte rare */}
      {rainbowBurstActive && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 8, pointerEvents: "none",
          background: "radial-gradient(ellipse at center, rgba(255,255,255,.95) 0%, rgba(244,114,182,.72) 18%, rgba(124,58,237,.55) 36%, rgba(6,182,212,.35) 56%, transparent 76%)",
          animation: "rainbowBurst 1.4s ease-out forwards",
        }} />
      )}

      {/* Particules ambiantes */}
      {[...Array(12)].map((_, i) => (
        <div key={i} style={{
          position: "absolute",
          width: 2 + (i % 3), height: 2 + (i % 3),
          borderRadius: "50%",
          background: i % 3 === 0 ? "#FFD700" : i % 3 === 1 ? "#F472B6" : "#06B6D4",
          opacity: 0.18 + (i % 4) * 0.1,
          top: `${5 + i * 8}%`, left: `${5 + (i * 17) % 90}%`,
          animation: `floatBg ${3 + i * 0.7}s ease-in-out ${i * 0.4}s infinite`,
          pointerEvents: "none",
        }} />
      ))}

      {/* Flash blanc */}
      {phase === "flash" && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 20,
          background: "radial-gradient(ellipse at center, #ffffff 0%, #FFD70080 40%, transparent 70%)",
          animation: "flashIn 0.5s ease-out forwards",
          pointerEvents: "none",
        }} />
      )}

      {/* Titre */}
      <div style={{ textAlign: "center", zIndex: 5 }}>
        <h2 style={{
          fontFamily: "'Fredoka One', cursive", margin: "0 0 6px",
          fontSize: "clamp(1.5rem, 4vw, 2.4rem)", color: "#FFD700",
          animation: allDone ? "titlePulse 2s ease-in-out infinite" : phase === "locked" ? "titlePulse .4s ease-in-out infinite" : "none",
          textShadow: allDone ? "0 0 30px #FFD700aa" : "0 0 20px #FFD70040",
        }}>
          {allDone ? "✨ Nouvelles cartes !" : phase === "idle" ? "🎁 Ton pack t'attend" : phase === "locked" ? "⚡ Ça va craquer..." : phase === "tearing" ? "💥 DÉCHIRÉ !" : "🌟 Révélation..."}
        </h2>
        {phase === "idle" && (
          <p style={{ color: "#94A3B8", fontFamily: "'Nunito', sans-serif", margin: 0, fontSize: ".88rem", fontWeight: 700 }}>
            Glisse le pack à gauche ou à droite pour le déchirer
          </p>
        )}
        {phase === "locked" && (
          <p style={{ color: "#F472B6", fontFamily: "'Nunito', sans-serif", margin: 0, fontSize: ".85rem", fontWeight: 900, textShadow: "0 0 14px #F472B680" }}>
            Prêt à exploser ! 💥
          </p>
        )}
      </div>

      {/* Zone du pack */}
      {["idle", "locked", "tearing"].includes(phase) && (
        <div style={{ position: "relative", zIndex: 5, display: "flex", flexDirection: "column", alignItems: "center", gap: "18px" }}>
          <ParticleExplosion active={showParticles} />

          {/* ── IDLE : pack entier draggable ── */}
          {phase === "idle" && (
            <div
              onMouseDown={e => { e.preventDefault(); onStart(e.clientX, e.clientY); }}
              onTouchStart={e => onStart(e.touches[0].clientX, e.touches[0].clientY)}
              onTouchMove={e => { e.preventDefault(); onMove(e.touches[0].clientX, e.touches[0].clientY); }}
              onTouchEnd={onEnd}
              style={{
                ...packFullStyle,
                touchAction: "none",
                border: `2px solid ${isDragging && progress > 0.55 ? "#F472B6" : "#7C3AED"}`,
                boxShadow: isDragging
                  ? `0 0 ${20 + progress * 72}px ${progress > 0.55 ? "#F472B660" : "#7C3AED55"}, 0 20px 60px rgba(0,0,0,.6)`
                  : "0 0 40px #7C3AED60, 0 20px 60px rgba(0,0,0,.6)",
                cursor: isDragging ? "grabbing" : "grab",
                transform: isDragging
                  ? `translateX(${dragX * 0.55}px) rotate(${dragX * 0.12}deg) scale(${1 + progress * 0.08})`
                  : "none",
                transition: isDragging ? "none" : "transform .32s cubic-bezier(0.34,1.56,0.64,1), box-shadow .2s, border-color .2s",
                animation: !isDragging ? "packFloat 3s ease-in-out infinite" : "none",
              }}
            >
              {renderPackFace(true)}
            </div>
          )}

          {/* ── LOCKED + TEARING : 2 moitiés ── */}
          {(phase === "locked" || phase === "tearing") && (
            <div style={{
              position: "relative", width: "180px", height: "252px",
              // Vibration intense pendant locked
              animation: phase === "locked" ? "packShakeHard .12s linear infinite" : "none",
            }}>
              {/* Moitié GAUCHE */}
              <div style={{
                position: "absolute", inset: 0,
                clipPath: "polygon(0 0, 50% 0, 50% 100%, 0 100%)",
                animation: phase === "tearing" ? "halfFlyLeft .72s ease-in forwards" : "none",
              }}>
                <div style={{
                  ...packFullStyle,
                  border: "2px solid #F472B6",
                  boxShadow: "0 0 65px #F472B680, 0 20px 60px rgba(0,0,0,.7)",
                }}>
                  {renderPackFace(false)}
                </div>
              </div>

              {/* Moitié DROITE */}
              <div style={{
                position: "absolute", inset: 0,
                clipPath: "polygon(50% 0, 100% 0, 100% 100%, 50% 100%)",
                animation: phase === "tearing" ? "halfFlyRight .72s ease-in forwards" : "none",
              }}>
                <div style={{
                  ...packFullStyle,
                  border: "2px solid #F472B6",
                  boxShadow: "0 0 65px #F472B680, 0 20px 60px rgba(0,0,0,.7)",
                }}>
                  {renderPackFace(false)}
                </div>
              </div>

              {/* Ligne de crack lumineuse entre les 2 moitiés (visible pendant locked) */}
              {phase === "locked" && (
                <div style={{
                  position: "absolute", top: 0, bottom: 0, left: "50%",
                  transform: "translateX(-50%)",
                  width: "5px",
                  background: "linear-gradient(to bottom, transparent 0%, #fff 18%, #F472B6 50%, #fff 82%, transparent 100%)",
                  animation: "crackPulse .3s ease-in-out infinite",
                  zIndex: 30, pointerEvents: "none",
                }} />
              )}
            </div>
          )}

          {/* Barre de progression + flèches (phase idle seulement) */}
          {phase === "idle" && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "180px", height: "5px", background: "rgba(255,255,255,.07)", borderRadius: "100px", overflow: "hidden" }}>
                <div style={{
                  height: "100%",
                  width: `${progress * 100}%`,
                  background: progress > 0.6
                    ? "linear-gradient(90deg, #7C3AED, #F472B6, #FBBF24)"
                    : "linear-gradient(90deg, #7C3AED, #06B6D4)",
                  borderRadius: "100px",
                  boxShadow: progress > 0.1 ? `0 0 ${4 + progress * 14}px rgba(244,114,182,.85)` : "none",
                  transition: isDragging ? "none" : "width .3s ease",
                }} />
              </div>
              {!isDragging && (
                <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "rgba(255,255,255,.38)", fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: ".82rem" }}>
                  <span style={{ display: "inline-block", animation: "arrowL 1.3s ease-in-out infinite" }}>←</span>
                  <span>tire pour déchirer</span>
                  <span style={{ display: "inline-block", animation: "arrowR 1.3s ease-in-out .65s infinite" }}>→</span>
                </div>
              )}
              {isDragging && progress >= 0.58 && (
                <p style={{ color: "#F472B6", fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: ".8rem", margin: 0, textShadow: "0 0 10px #F472B680", animation: "tearPulse .5s ease-in-out infinite" }}>
                  Encore un peu... 🔥
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Grille de cartes révélées */}
      {(phase === "revealing" || phase === "done") && (
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center", zIndex: 5, padding: "0 10px" }}>
          {cartes.map((carte, i) => {
            const cfg = RARETE_CONFIG[carte.rarete] || RARETE_CONFIG.commune;
            const visible = i < visibleCount;
            const isLegendary = carte.rarete === "legendaire";
            const isPrismatic = carte.rarete === "ultra_rare";
            const isRarePlus = ["rare", "epique", "legendaire", "ultra_rare"].includes(carte.rarete);
            return (
              <div key={i} style={{
                width: "clamp(120px, 22vw, 165px)",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0) scale(1)" : "translateY(55px) scale(0.65)",
                transition: "opacity .5s ease, transform .5s cubic-bezier(0.34,1.56,0.64,1)",
              }}>
                <div style={{
                  borderRadius: "16px",
                  background: cfg.gradient,
                  border: `2px solid ${cfg.glow}60`,
                  boxShadow: isRarePlus && visible
                    ? `0 0 40px ${cfg.glow}70, 0 8px 30px rgba(0,0,0,.5)`
                    : `0 0 25px ${cfg.glow}40, 0 8px 25px rgba(0,0,0,.5)`,
                  overflow: "hidden",
                  animation: isLegendary ? "legendaryGlow 2s ease-in-out infinite" : isPrismatic ? "prismaticShift 3s linear infinite" : "none",
                  display: "flex", flexDirection: "column",
                  position: "relative",
                }}>
                  {/* Shimmer arc-en-ciel pour les cartes rare+ */}
                  {isRarePlus && visible && (
                    <div style={{
                      position: "absolute", inset: 0, zIndex: 10, pointerEvents: "none",
                      background: "linear-gradient(135deg, rgba(244,114,182,.32), rgba(124,58,237,.32), rgba(6,182,212,.32), rgba(16,185,129,.32), rgba(251,191,36,.32))",
                      backgroundSize: "300% 300%",
                      animation: "rainbowFlow 2.5s linear infinite",
                      mixBlendMode: "screen",
                      borderRadius: "14px",
                    }} />
                  )}
                  <div style={{ padding: "8px 10px 4px", display: "flex", alignItems: "center", gap: "5px", position: "relative", zIndex: 11 }}>
                    <span style={{
                      background: `${cfg.glow}25`, border: `1px solid ${cfg.glow}50`,
                      borderRadius: "100px", padding: "2px 9px",
                      fontFamily: "'Fredoka One', cursive", fontSize: ".65rem",
                      color: cfg.glow, whiteSpace: "nowrap",
                    }}>
                      {cfg.emoji} {cfg.label}
                    </span>
                  </div>
                  <div style={{ position: "relative", aspectRatio: "3/4", overflow: "hidden" }}>
                    <img src={carte.image} alt={carte.nom}
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                      onError={e => { e.currentTarget.style.display = "none"; }}
                    />
                    <div style={{
                      position: "absolute", inset: 0, pointerEvents: "none",
                      background: "linear-gradient(135deg, transparent 30%, rgba(255,255,255,.07) 50%, transparent 70%)",
                      backgroundSize: "200% 100%",
                      animation: "shimmer 3s linear infinite",
                    }} />
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: .3 }}>
                      <Icon icon={cfg.icon} width={40} />
                    </div>
                  </div>
                  <div style={{ padding: "8px 10px 10px", textAlign: "center", position: "relative", zIndex: 11 }}>
                    <p style={{ fontFamily: "'Fredoka One', cursive", color: "white", fontSize: ".75rem", margin: "0 0 2px", lineHeight: 1.2 }}>
                      {carte.nom}
                    </p>
                    {cfg.bonus > 0 && (
                      <p style={{ color: "#FFD700", fontSize: ".6rem", margin: 0, fontFamily: "'Nunito', sans-serif", fontWeight: 700 }}>
                        ⭐ +{cfg.bonus} pt participation
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Boutons post-révélation */}
      {allDone && (
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center", zIndex: 5 }}>
          <button onClick={onVoirCollection} style={{
            background: "linear-gradient(135deg, #7C3AED, #2563EB)",
            color: "white", border: "none",
            fontFamily: "'Fredoka One', cursive", fontSize: "1rem",
            padding: "14px 28px", borderRadius: "100px", cursor: "pointer",
            boxShadow: "0 0 25px #7C3AED60, 0 6px 20px rgba(0,0,0,.4)",
          }}>
            🃏 Voir ma collection
          </button>
          <button onClick={onOuvrirAutrePack} style={{
            background: "transparent",
            color: "#FFD700", border: "2px solid #FFD70060",
            fontFamily: "'Fredoka One', cursive", fontSize: "1rem",
            padding: "13px 28px", borderRadius: "100px", cursor: "pointer",
            boxShadow: "0 0 15px #FFD70030",
          }}>
            🎁 Ouvrir un autre pack
          </button>
        </div>
      )}
    </div>
  );
};

// ─── CarteMini avec hover holographique ────────────────────────────────────────
const CarteMini = ({ carte, onClick }) => {
  const cfg = RARETE_CONFIG[carte.rarete] || RARETE_CONFIG.commune;
  const [hovered, setHovered] = useState(false);
  const isLegendary = carte.rarete === "legendaire";
  const isPrismatic = carte.rarete === "ultra_rare";
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: "100px", borderRadius: "12px", overflow: "hidden",
        border: `2px solid ${hovered ? cfg.glow : cfg.glow + "40"}`,
        boxShadow: hovered
          ? `0 0 20px ${cfg.glow}70, 0 8px 25px rgba(0,0,0,0.5)`
          : `0 2px 10px rgba(0,0,0,0.3)`,
        cursor: "pointer", flexShrink: 0,
        background: cfg.gradient,
        transform: hovered ? "translateY(-5px) scale(1.05)" : "none",
        transition: "all 0.2s ease",
        animation: isLegendary && hovered ? "legendaryGlow 1.5s ease-in-out infinite" : isPrismatic && hovered ? "prismaticShift 2s linear infinite" : "none",
        position: "relative",
      }}
    >
      {/* Holographic overlay on hover */}
      {hovered && (
        <div style={{
          position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none",
          background: "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 40%, rgba(255,255,255,0.08) 60%, transparent 100%)",
          backgroundSize: "200% 200%",
          animation: "holoPrism 1.5s linear infinite",
        }} />
      )}
      <img src={carte.image} alt={carte.nom} style={{ width: "100%", aspectRatio: "2/3", objectFit: "cover", display: "block" }} />
      <div style={{ padding: "5px 7px", background: "rgba(0,0,0,0.5)", borderTop: `1px solid ${cfg.glow}25` }}>
        <p style={{ fontSize: "0.5rem", fontWeight: "700", color: "white", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{carte.nom}</p>
        <p style={{ fontSize: "0.48rem", color: cfg.glow, margin: "1px 0 0", fontWeight: "600" }}>
          {cfg.emoji} {cfg.label}{cfg.bonus > 0 ? ` +${cfg.bonus}pt` : ""}
        </p>
      </div>
    </div>
  );
};

// ─── Visionneuse ───────────────────────────────────────────────────────────────
const Visionneuse = ({ carte, cartesPossedees, indexDansPossedees, onFermer, onPrecedent, onSuivant }) => {
  const cfg = RARETE_CONFIG[carte.rarete] || RARETE_CONFIG.commune;
  useEffect(() => {
    const h = (e) => { if (e.key === "ArrowLeft") onPrecedent(); else if (e.key === "ArrowRight") onSuivant(); else if (e.key === "Escape") onFermer(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [indexDansPossedees, onFermer, onPrecedent, onSuivant]);

  return (
    <div onClick={onFermer} style={{ position: "fixed", inset: 0, zIndex: 3000, background: "rgba(0,0,0,0.97)", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "20px", overflowY: "auto" }}>
      <div onClick={e => e.stopPropagation()} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", maxWidth: "380px", width: "100%", paddingBottom: "20px" }}>
        <p style={{ color: "#94A3B8", fontFamily: "'Fredoka One', cursive", fontSize: "0.9rem", margin: 0 }}>
          {indexDansPossedees + 1} / {cartesPossedees.length}
        </p>
        <div style={{ width: "100%", borderRadius: "20px", overflow: "hidden", border: `3px solid ${cfg.glow}`, boxShadow: `0 0 60px ${cfg.glow}80` }}>
          <img src={carte.image} alt={carte.nom} style={{ width: "100%", display: "block" }} />
        </div>
        <div style={{ textAlign: "center", gap: "8px", display: "flex", flexDirection: "column" }}>
          <p style={{ fontFamily: "'Fredoka One', cursive", color: "white", fontSize: "1.3rem", margin: 0 }}>{carte.nom}</p>
          <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
            <span style={{ background: cfg.glow + "30", border: `1px solid ${cfg.glow}60`, color: cfg.glow, fontFamily: "'Fredoka One', cursive", padding: "6px 18px", borderRadius: "100px", fontSize: "0.85rem" }}>
              {cfg.emoji} {cfg.label}
            </span>
            {cfg.bonus > 0 && (
              <span style={{ background: "#FEF3C730", color: "#FBBF24", border: "1px solid #FBBF2460", fontFamily: "'Fredoka One', cursive", padding: "6px 18px", borderRadius: "100px", fontSize: "0.85rem" }}>
                ⭐ +{cfg.bonus} pt participation
              </span>
            )}
          </div>
        </div>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <button onClick={onPrecedent} style={{ background: "rgba(255,255,255,0.08)", color: "white", border: "1px solid rgba(255,255,255,0.15)", fontFamily: "'Fredoka One', cursive", fontSize: "1.1rem", padding: "12px 24px", borderRadius: "14px", cursor: "pointer" }}>← Préc.</button>
          <button onClick={onFermer} style={{ background: "rgba(239,68,68,0.15)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.3)", fontFamily: "'Fredoka One', cursive", fontSize: "1rem", padding: "12px 20px", borderRadius: "14px", cursor: "pointer" }}>✕</button>
          <button onClick={onSuivant} style={{ background: "rgba(255,255,255,0.08)", color: "white", border: "1px solid rgba(255,255,255,0.15)", fontFamily: "'Fredoka One', cursive", fontSize: "1.1rem", padding: "12px 24px", borderRadius: "14px", cursor: "pointer" }}>Suiv. →</button>
        </div>
        <p style={{ color: "#4B5563", fontSize: "0.75rem", margin: 0 }}>← → pour naviguer • Échap pour fermer</p>
      </div>
    </div>
  );
};

// ─── RecapRegles ───────────────────────────────────────────────────────────────
const RecapRegles = () => {
  const [ouvert, setOuvert] = useState(false);
  return (
    <div style={{ background: "#0f0f1a", border: "1px solid #1e1b4b", borderRadius: "20px", marginBottom: "20px", overflow: "hidden" }}>
      <div onClick={() => setOuvert(!ouvert)} style={{ padding: "16px 24px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", background: "linear-gradient(135deg, #0f0521, #1e0a45)" }}>
        <p style={{ fontFamily: "'Fredoka One', cursive", color: "#FFD700", fontSize: "1.05rem", margin: 0 }}>📖 Comment ça marche ?</p>
        <span style={{ color: "#7C3AED", fontSize: "1rem" }}>{ouvert ? "▲" : "▼"}</span>
      </div>
      {ouvert && (
        <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: "10px" }}>
          {[
            { emoji: "⚡", titre: "Gagne des jetons", texte: "Complète des chapitres et des missions pour gagner des jetons.", couleur: "#60A5FA" },
            { emoji: "🎴", titre: "Ouvre des packs", texte: "Utilise tes jetons pour ouvrir des packs et obtenir des cartes.", couleur: "#C084FC" },
            { emoji: "🎲", titre: "Pack Mystère gratuit", texte: "Un pack mystère GRATUIT est disponible chaque semaine !", couleur: "#EC4899" },
            { emoji: "🎁", titre: "Carte du lundi", texte: "Chaque lundi matin une carte aléatoire t'est offerte gratuitement !", couleur: "#10B981" },
            { emoji: "⭐", titre: "Bonus participation", texte: "Les cartes Rares et + te donnent des points de participation bonus en cours !", couleur: "#FBBF24" },
            { emoji: "♻️", titre: "Recycle tes doublons", texte: "Tu as des doublons ? Recycle-les contre 10 jetons chacun !", couleur: "#10B981" },
            { emoji: "🏆", titre: "Complète les drops", texte: "Complète un drop à 100% pour gagner 500 jetons bonus !", couleur: "#EF4444" },
            { emoji: "⚪🟢🔵💜⭐🌈", titre: "Raretés", texte: "Commune • Peu Commune • Rare +0.5pt • Épique +1pt • Légendaire +2pts • Ultra Rare +3pts", couleur: "#94A3B8" },
          ].map((r, i) => (
            <div key={i} style={{ display: "flex", gap: "14px", alignItems: "flex-start", padding: "10px 14px", borderRadius: "12px", background: r.couleur + "0d", border: `1px solid ${r.couleur}20` }}>
              <span style={{ fontSize: "1.3rem", flexShrink: 0 }}>{r.emoji}</span>
              <div>
                <p style={{ fontFamily: "'Fredoka One', cursive", color: r.couleur, fontSize: "0.9rem", margin: "0 0 2px" }}>{r.titre}</p>
                <p style={{ color: "#64748B", fontSize: "0.8rem", margin: 0 }}>{r.texte}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Composant principal ────────────────────────────────────────────────────────
export default function Cartes({ profil, onXPGagne }) {
  const { xpRewardsSuspended } = usePlatformIntegrity();
  const [onglet, setOnglet] = useState("boutique");
  const [matiereSelectionnee, setMatiereSelectionnee] = useState("Toutes");
  const [themeSelectionne, setThemeSelectionne] = useState("Tous");
  const [collectionOuverte, setCollectionOuverte] = useState(null);
  const [cartesAnimation, setCartesAnimation] = useState(null);
  const [maCollection, setMaCollection] = useState({});
  const [chargement, setChargement] = useState(false);
  const [message, setMessage] = useState(null);
  const [visionneuse, setVisionneuse] = useState(null);
  const [streak, setStreak] = useState(0);
  const [packMystereDisponible, setPackMystereDisponible] = useState(false);
  const [carteJourDispo, setCarteJourDispo] = useState(false);
  const cssInjected = useRef(false);

  useEffect(() => {
    if (!cssInjected.current) {
      const style = document.createElement("style");
      style.innerHTML = CSS_KEYFRAMES;
      document.head.appendChild(style);
      cssInjected.current = true;
    }
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800;900&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    chargerCollection();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const chargerCollection = async () => {
    if (!auth.currentUser) return;
    const snap = await getDoc(doc(db, "users", auth.currentUser.uid));
    if (!snap.exists()) return;
    const data = snap.data();
    setMaCollection(data.cartes || {});

    const today = getAujourdhui();
    const lastVisit = data.lastVisit || "";
    const currentStreak = data.streak || 0;
    const yesterday = (() => { const d = new Date(); d.setDate(d.getDate() - 1); return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`; })();
    let newStreak = currentStreak;
    if (lastVisit !== today) {
      newStreak = lastVisit === yesterday ? currentStreak + 1 : 1;
      await updateDoc(doc(db, "users", auth.currentUser.uid), { lastVisit: today, streak: newStreak });
    }
    setStreak(newStreak);
    const semaine = getDebutSemaine();
    setPackMystereDisponible((data.dernierPackMystere || "") !== semaine);
    const now = new Date();
    setCarteJourDispo(now.getDay() === 1 && (data.derniereCarteJour || "") !== today);
  };

  const afficherMessage = (texte, type = "success") => {
    setMessage({ texte, type });
    setTimeout(() => setMessage(null), 3500);
  };

  const ouvrirPack = async (pack, collection) => {
    if (isSpecialCollection(collection)) { afficherMessage("Le drop 1STMG2 est terminé.", "error"); return; }
    if (pack.id !== "mystere" && (profil?.xp || 0) < pack.cout) { afficherMessage(`Il te faut ${pack.cout} jetons pour ce pack !`, "error"); return; }
    if (pack.id === "mystere" && !packMystereDisponible) { afficherMessage("Ton pack mystère a déjà été ouvert cette semaine !", "error"); return; }
    setChargement(true);
    try {
      const snap = await getDoc(doc(db, "users", auth.currentUser.uid));
      const data = snap.data();
      const nouvelles = Array.from({ length: pack.nbCartes }, () => tirerCarte(pack, collection));
      const cartes = { ...(data.cartes || {}) };
      nouvelles.forEach(c => { cartes[c.id] = (cartes[c.id] || 0) + 1; });

      const xpDepenseeActuelle = data.xpDepensee || 0;
      const nouvelleXpDepensee = xpDepenseeActuelle + pack.cout;
      const hasPrestigeBase = Number.isFinite(Number(data.prestigeBase));
      const prestigeBase = hasPrestigeBase ? (Number(data.prestigeBase) || 0) : Math.floor((data.xp || 0) / PRESTIGE_XP_RATIO);
      const prestigeActuel = data.prestige || 0;
      const gainPrestige = Math.floor(nouvelleXpDepensee / PRESTIGE_XP_RATIO) - Math.floor(xpDepenseeActuelle / PRESTIGE_XP_RATIO);
      const updates: any = {
        cartes, xp: (data.xp || 0) - pack.cout,
        xpDepensee: nouvelleXpDepensee,
        prestige: prestigeActuel + Math.max(0, gainPrestige),
      };
      if (!hasPrestigeBase) updates.prestigeBase = prestigeBase;
      if (pack.id === "mystere") { updates.dernierPackMystere = getDebutSemaine(); setPackMystereDisponible(false); }

      const dropComplete = collection.cartes.every(c => (cartes[c.id] || 0) > 0);
      const dropAvantOuverture = collection.cartes.every(c => (data.cartes?.[c.id] || 0) > 0);
      if (dropComplete && !dropAvantOuverture) {
        if (!xpRewardsSuspended) {
          updates.xp = (updates.xp || 0) + 500;
          afficherMessage(`🏆 Drop complet ! ${formatJetonsDelta(500)} bonus !`);
        } else {
          afficherMessage(
            "🏆 Drop complet ! Bonus jetons non attribué : session sans jetons après changement d’onglet — recharge la page (F5).",
            "error",
          );
        }
      }

      await updateDoc(doc(db, "users", auth.currentUser.uid), updates);
      setMaCollection(cartes);
      setCartesAnimation(nouvelles);
      if (gainPrestige > 0) afficherMessage(`✨ +${gainPrestige} prestige (grâce à ${formatJetons(pack.cout)} dépensés)`);
      if (onXPGagne) onXPGagne();
    } catch { afficherMessage("Erreur lors de l'ouverture du pack.", "error"); }
    setChargement(false);
  };

  const recevoirCarteJour = async () => {
    if (!carteJourDispo) return;
    try {
      const snap = await getDoc(doc(db, "users", auth.currentUser.uid));
      const data = snap.data();
      const toutesCartes = getNonSpecialCollections(COLLECTIONS).flatMap(c => c.cartes);
      if (!toutesCartes.length) { afficherMessage("Aucune carte disponible.", "error"); return; }
      const carte = toutesCartes[Math.floor(Math.random() * toutesCartes.length)];
      const cartes = { ...(data.cartes || {}) };
      cartes[carte.id] = (cartes[carte.id] || 0) + 1;
      await updateDoc(doc(db, "users", auth.currentUser.uid), { cartes, derniereCarteJour: getAujourdhui() });
      setMaCollection(cartes);
      setCarteJourDispo(false);
      setCartesAnimation([carte]);
      if (onXPGagne) onXPGagne();
    } catch { afficherMessage("Erreur.", "error"); }
  };

  const recyclerDoublon = async (carte) => {
    if (xpRewardsSuspended) {
      afficherMessage(PLATFORM_XP_BLOCKED_MESSAGE, "error");
      return;
    }
    try {
      const snap = await getDoc(doc(db, "users", auth.currentUser.uid));
      const data = snap.data();
      const cartes = { ...(data.cartes || {}) };
      if ((cartes[carte.id] || 0) <= 1) return;
      cartes[carte.id] -= 1;
      await updateDoc(doc(db, "users", auth.currentUser.uid), { xp: (data.xp || 0) + 10, cartes });
      setMaCollection(cartes);
      afficherMessage(`♻️ Carte recyclée ! ${formatJetonsDelta(10)}`);
      if (onXPGagne) onXPGagne();
    } catch { afficherMessage("Erreur lors du recyclage.", "error"); }
  };

  const totalCartes = Object.values(maCollection).reduce((a: number, b: any) => a + b, 0);
  const totalUniques = COLLECTIONS.flatMap(c => c.cartes).filter(c => maCollection[c.id] > 0).length;
  const totalDispo = COLLECTIONS.flatMap(c => c.cartes).length;
  const bonusTotal = COLLECTIONS.flatMap(c => c.cartes).filter(c => maCollection[c.id] > 0).reduce((s, c) => s + (RARETE_CONFIG[c.rarete]?.bonus || 0), 0);
  const progGlobal = Math.round((totalUniques / totalDispo) * 100);

  const matieresDisponibles = useMemo(() => ["Toutes", ...Array.from(new Set(COLLECTIONS.map(c => getCollectionMatiere(c))))], []);
  const collectionsParMatiere = useMemo(() => COLLECTIONS.filter(c => matiereSelectionnee === "Toutes" || getCollectionMatiere(c) === matiereSelectionnee), [matiereSelectionnee]);
  const themesDisponibles = useMemo(() => ["Tous", ...Array.from(new Set(collectionsParMatiere.map(c => getCollectionTheme(c))))], [collectionsParMatiere]);
  const collectionsFiltrees = useMemo(() => COLLECTIONS.filter(c => (matiereSelectionnee === "Toutes" || getCollectionMatiere(c) === matiereSelectionnee) && (themeSelectionne === "Tous" || getCollectionTheme(c) === themeSelectionne)), [matiereSelectionnee, themeSelectionne]);
  const collectionsFiltreesBoutique = useMemo(() => getNonSpecialCollections(collectionsFiltrees), [collectionsFiltrees]);

  useEffect(() => {
    if (!themesDisponibles.includes(themeSelectionne)) setThemeSelectionne("Tous");
  }, [matiereSelectionnee, themeSelectionne, themesDisponibles]);

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", fontFamily: "'Nunito', sans-serif" }}>

      {/* Overlays */}
      {visionneuse && (() => {
        const col = visionneuse.collection;
        const cartesPossedees = col.cartes.filter(c => maCollection[c.id] > 0);
        const idx = visionneuse.indexDansPossedees;
        return (
          <Visionneuse
            carte={cartesPossedees[idx]} cartesPossedees={cartesPossedees} indexDansPossedees={idx}
            onFermer={() => setVisionneuse(null)}
            onPrecedent={() => setVisionneuse({ ...visionneuse, indexDansPossedees: (idx - 1 + cartesPossedees.length) % cartesPossedees.length })}
            onSuivant={() => setVisionneuse({ ...visionneuse, indexDansPossedees: (idx + 1) % cartesPossedees.length })}
          />
        );
      })()}

      {cartesAnimation && (
        <AnimationOuverture
          cartes={cartesAnimation}
          onVoirCollection={() => { setCartesAnimation(null); setOnglet("collection"); }}
          onOuvrirAutrePack={() => { setCartesAnimation(null); setOnglet("boutique"); }}
        />
      )}

      {message && (
        <div style={{
          position: "fixed", top: "80px", right: "24px", zIndex: 100,
          background: message.type === "error" ? "linear-gradient(135deg, #EF4444, #DC2626)" : "linear-gradient(135deg, #059669, #10B981)",
          color: "white", fontFamily: "'Fredoka One', cursive",
          padding: "14px 28px", borderRadius: "16px", boxShadow: "0 8px 25px rgba(0,0,0,0.4)",
        }}>{message.texte}</div>
      )}

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "24px 16px" }}>

        {/* Header */}
        <div style={{ background: "linear-gradient(135deg, #0f0521 0%, #1e0a45 50%, #16213e 100%)", border: "1px solid #2d1054", borderRadius: "24px", padding: "28px 32px", marginBottom: "24px", boxShadow: "0 4px 40px rgba(124,58,237,0.2)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", marginBottom: "20px" }}>
            <div>
              <h1 style={{ fontFamily: "'Fredoka One', cursive", fontSize: "2.2rem", color: "#FFD700", margin: "0 0 4px", textShadow: "0 0 30px #FFD70050" }}>🃏 Mes Cartes</h1>
              <p style={{ color: "#7C3AED", margin: 0, fontSize: "0.9rem" }}>Collectionne ? Révise ? Progresse</p>
            </div>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <div style={{ background: "#F59E0B15", border: "1px solid #F59E0B30", borderRadius: "12px", padding: "7px 16px", fontFamily: "'Fredoka One', cursive", color: "#FBBF24", fontSize: "0.9rem" }}>🔥 {streak} jour{streak > 1 ? "s" : ""}</div>
              {[
                { label: `${totalCartes} cartes`, color: "#06B6D4", emoji: "🃏" },
                { label: `+${bonusTotal.toFixed(1)} pts`, color: "#FBBF24", emoji: "⭐" },
                { label: formatJetons(profil?.xp || 0), color: "#60A5FA", emoji: "⚡" },
                { label: `${getPrestigeTotal(profil)} prestige`, color: "#C084FC", emoji: "👑" },
              ].map((s, i) => (
                <div key={i} style={{ background: s.color + "15", border: `1px solid ${s.color}30`, borderRadius: "12px", padding: "7px 16px", fontFamily: "'Fredoka One', cursive", color: s.color, fontSize: "0.9rem" }}>{s.emoji} {s.label}</div>
              ))}
            </div>
          </div>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <p style={{ color: "#7C3AED", fontSize: "0.85rem", margin: 0, fontFamily: "'Fredoka One', cursive" }}>📊 Collection globale</p>
              <p style={{ color: "#FFD700", fontSize: "0.85rem", margin: 0, fontFamily: "'Fredoka One', cursive" }}>{totalUniques} / {totalDispo} — {progGlobal}%</p>
            </div>
            <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: "100px", height: "8px" }}>
              <div style={{ height: "100%", borderRadius: "100px", background: "linear-gradient(90deg, #7C3AED, #06B6D4)", width: `${progGlobal}%`, transition: "width 0.5s ease", boxShadow: "0 0 10px #7C3AED80" }} />
            </div>
          </div>
        </div>

        {/* Carte du lundi */}
        {carteJourDispo && (
          <div style={{ background: "linear-gradient(135deg, #052e16, #065f46)", border: "1px solid #10B98140", borderRadius: "20px", padding: "20px 24px", marginBottom: "14px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <p style={{ fontFamily: "'Fredoka One', cursive", color: "#34D399", fontSize: "1.15rem", margin: 0 }}>🎁 Carte du lundi disponible !</p>
              <p style={{ color: "rgba(52,211,153,0.7)", fontSize: "0.85rem", margin: "4px 0 0" }}>Une carte gratuite t'attend chaque lundi !</p>
            </div>
            <button onClick={recevoirCarteJour} style={{ background: "linear-gradient(135deg, #10B981, #059669)", color: "white", border: "none", fontFamily: "'Fredoka One', cursive", fontSize: "1rem", padding: "12px 24px", borderRadius: "100px", cursor: "pointer", boxShadow: "0 4px 20px #10B98140" }}>
              🎁 Récupérer !
            </button>
          </div>
        )}

        {/* Pack mystère */}
        {packMystereDisponible && (
          <div style={{ background: "linear-gradient(135deg, #4a044e, #831843)", border: "1px solid #EC489940", borderRadius: "20px", padding: "20px 24px", marginBottom: "14px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <p style={{ fontFamily: "'Fredoka One', cursive", color: "#F9A8D4", fontSize: "1.15rem", margin: 0 }}>🎲 Pack Mystère disponible !</p>
              <p style={{ color: "rgba(249,168,212,0.7)", fontSize: "0.85rem", margin: "4px 0 0" }}>Ton pack gratuit de la semaine — probabilités inconnues !</p>
            </div>
            <button
              onClick={() => {
                const base = collectionsFiltreesBoutique.length ? collectionsFiltreesBoutique : getNonSpecialCollections(COLLECTIONS);
                if (!base.length) { afficherMessage("Aucune collection disponible.", "error"); return; }
                ouvrirPack(PACKS[3], base[Math.floor(Math.random() * base.length)]);
              }}
              style={{ background: "linear-gradient(135deg, #EC4899, #9D174D)", color: "white", border: "none", fontFamily: "'Fredoka One', cursive", fontSize: "1rem", padding: "12px 24px", borderRadius: "100px", cursor: "pointer", boxShadow: "0 4px 20px #EC489940" }}
            >
              🎲 Ouvrir !
            </button>
          </div>
        )}

        <RecapRegles />

        {/* Onglets */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
          {[{ id: "boutique", label: "🛒 Boutique Packs" }, { id: "collection", label: "📚 Ma Collection" }].map(t => (
            <button key={t.id} onClick={() => setOnglet(t.id)} style={{
              background: onglet === t.id ? "linear-gradient(135deg, #7C3AED, #06B6D4)" : "transparent",
              color: onglet === t.id ? "white" : "#64748B",
              border: onglet === t.id ? "none" : "1px solid #1e293b",
              fontFamily: "'Fredoka One', cursive", fontSize: "1rem",
              padding: "12px 28px", borderRadius: "100px", cursor: "pointer",
              boxShadow: onglet === t.id ? "0 4px 20px #7C3AED40" : "none",
              transition: "all 0.2s",
            }}>{t.label}</button>
          ))}
        </div>

        {/* Filtres */}
        <div style={{ background: "#0f0f1a", border: "1px solid #1e1b4b", borderRadius: "16px", padding: "14px", marginBottom: "20px" }}>
          <p style={{ fontFamily: "'Fredoka One', cursive", color: "#7C3AED", fontSize: "0.9rem", margin: "0 0 10px" }}>Filtres des drops</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            {[
              { label: "Matière", couleur: "#7C3AED", value: matiereSelectionnee, onChange: setMatiereSelectionnee, options: matieresDisponibles },
              { label: "Thème", couleur: "#06B6D4", value: themeSelectionne, onChange: setThemeSelectionne, options: themesDisponibles },
            ].map((f, i) => (
              <div key={i} style={{ borderRadius: "12px", border: `1px solid ${f.couleur}20`, padding: "10px 12px" }}>
                <p style={{ fontFamily: "'Fredoka One', cursive", color: f.couleur, fontSize: "0.78rem", margin: "0 0 6px" }}>{f.label}</p>
                <select value={f.value} onChange={e => f.onChange(e.target.value)} style={{ width: "100%", border: `1px solid ${f.couleur}25`, borderRadius: "10px", padding: "8px 10px", fontFamily: "'Nunito', sans-serif", fontWeight: 700, color: "white", background: "#0a0a0f" }}>
                  {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            ))}
          </div>
        </div>

        {/* Boutique */}
        {onglet === "boutique" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {collectionsFiltreesBoutique.length === 0 && (
              <div style={{ textAlign: "center", padding: "50px 20px", background: "#0f0f1a", border: "1px solid #1e1b4b", borderRadius: "20px", color: "#475569", fontFamily: "'Fredoka One', cursive" }}>
                Aucun drop disponible avec ces filtres.
              </div>
            )}
            {collectionsFiltreesBoutique.map(col => {
              const obtenues = col.cartes.filter(c => maCollection[c.id] > 0).length;
              return (
                <div key={col.id} style={{ background: "#0f0f1a", border: "1px solid #1e1b4b", borderRadius: "24px", overflow: "hidden" }}>
                  <div style={{ background: col.gradient || "linear-gradient(135deg, #0f0521, #1e0a45)", padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
                    <div>
                      <p style={{ fontFamily: "'Fredoka One', cursive", color: "white", fontSize: "1.25rem", margin: 0 }}>{col.emoji || "🃏"} {col.nom}</p>
                      <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.82rem", margin: "2px 0 0" }}>{getCollectionMatiere(col)} ? {getCollectionTheme(col)} ? {col.description || ""}</p>
                    </div>
                    <span style={{ background: "rgba(255,255,255,0.15)", color: "white", fontFamily: "'Fredoka One', cursive", padding: "6px 16px", borderRadius: "100px", fontSize: "0.85rem" }}>
                      {obtenues}/{col.cartes.length} obtenues
                    </span>
                  </div>
                  <div style={{ padding: "20px 24px", display: "flex", gap: "14px", flexWrap: "wrap" }}>
                    {getPacksForCollection(col).map(pack => {
                      const peutOuvrir = (profil?.xp || 0) >= pack.cout;
                      return (
                        <div key={pack.id} style={{ flex: 1, minWidth: "150px", background: peutOuvrir ? "#0a0a0f" : "#0d0d14", border: `1px solid ${peutOuvrir ? pack.couleur + "40" : "#1e293b"}`, borderRadius: "18px", padding: "18px 16px", textAlign: "center" }}>
                          <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: peutOuvrir ? pack.gradient : "#1e293b", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.8rem", margin: "0 auto 10px", boxShadow: peutOuvrir ? `0 4px 20px ${pack.couleur}50` : "none" }}>{pack.emoji}</div>
                          <p style={{ fontFamily: "'Fredoka One', cursive", color: peutOuvrir ? pack.couleur : "#475569", margin: "0 0 4px", fontSize: "1rem" }}>{pack.nom}</p>
                          <p style={{ fontSize: "0.68rem", color: "#475569", margin: "0 0 14px", lineHeight: 1.4 }}>{pack.description}</p>
                          <button onClick={() => ouvrirPack(pack, col)} disabled={!peutOuvrir || chargement}
                            style={{ width: "100%", background: peutOuvrir ? pack.gradient : "#1e293b", color: peutOuvrir ? "white" : "#475569", border: "none", fontFamily: "'Fredoka One', cursive", fontSize: "1rem", padding: "11px", borderRadius: "12px", cursor: peutOuvrir ? "pointer" : "not-allowed", boxShadow: peutOuvrir ? `0 4px 15px ${pack.couleur}40` : "none" }}>
                            {chargement ? "⏳" : `${pack.emoji} ${formatJetons(pack.cout)}`}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Collection */}
        {onglet === "collection" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {collectionsFiltrees.length === 0 && (
              <div style={{ textAlign: "center", padding: "50px 20px", background: "#0f0f1a", border: "1px solid #1e1b4b", borderRadius: "20px", color: "#475569", fontFamily: "'Fredoka One', cursive" }}>
                Aucune collection avec ces filtres.
              </div>
            )}
            {collectionsFiltrees.map(col => {
              const cartesPossedees = col.cartes.filter(c => maCollection[c.id] > 0);
              const prog = Math.round((cartesPossedees.length / col.cartes.length) * 100);
              const ouverte = collectionOuverte === col.id;
              const statsRarete = Object.entries(RARETE_CONFIG).map(([key, cfg]) => ({ key, ...cfg, count: cartesPossedees.filter(c => c.rarete === key).length })).filter(s => s.count > 0);
              return (
                <div key={col.id} style={{ background: "#0f0f1a", border: "1px solid #1e1b4b", borderRadius: "20px", overflow: "hidden" }}>
                  <div onClick={() => setCollectionOuverte(ouverte ? null : col.id)}
                    style={{ background: ouverte ? (col.gradient || "linear-gradient(135deg, #0f0521, #1e0a45)") : "transparent", padding: "18px 24px", cursor: "pointer", transition: "all 0.3s" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                        <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: ouverte ? "rgba(255,255,255,0.15)" : (col.couleur || "#7C3AED") + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}>{col.emoji || "🃏"}</div>
                        <div>
                          <p style={{ fontFamily: "'Fredoka One', cursive", color: ouverte ? "white" : (col.couleur || "#FFD700"), fontSize: "1.15rem", margin: 0 }}>{col.nom}</p>
                          <p style={{ color: ouverte ? "rgba(255,255,255,0.6)" : "#475569", fontSize: "0.8rem", margin: "2px 0 0" }}>
                            {getCollectionMatiere(col)} ? {getCollectionTheme(col)} ? {cartesPossedees.length}/{col.cartes.length} cartes
                          </p>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                        {prog === 100 && <span style={{ fontSize: "1.3rem" }}>🏆</span>}
                        <div style={{ background: ouverte ? "rgba(255,255,255,0.2)" : "#1e1b4b", borderRadius: "100px", padding: "5px 14px", fontFamily: "'Fredoka One', cursive", color: ouverte ? "white" : (col.couleur || "#FFD700"), fontSize: "0.88rem" }}>{prog}%</div>
                        <span style={{ color: ouverte ? "white" : "#475569", fontSize: "1rem" }}>{ouverte ? "▲" : "▼"}</span>
                      </div>
                    </div>
                    <div style={{ marginTop: "12px", background: ouverte ? "rgba(255,255,255,0.15)" : "#1e1b4b", borderRadius: "100px", height: "5px" }}>
                      <div style={{ height: "100%", borderRadius: "100px", background: ouverte ? "white" : (col.gradient || "linear-gradient(90deg, #7C3AED, #06B6D4)"), width: `${prog}%`, transition: "width 0.5s ease" }} />
                    </div>
                  </div>

                  {ouverte && (
                    <div style={{ padding: "22px 24px", borderTop: "1px solid #1e1b4b" }}>
                      {statsRarete.length > 0 && (
                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "18px" }}>
                          {statsRarete.map(s => (
                            <span key={s.key} style={{ background: s.glow + "15", color: s.glow, border: `1px solid ${s.glow}30`, fontFamily: "'Fredoka One', cursive", padding: "3px 12px", borderRadius: "100px", fontSize: "0.78rem" }}>
                              {s.emoji} {s.count} {s.label}{s.count > 1 ? "s" : ""}
                            </span>
                          ))}
                        </div>
                      )}
                      {cartesPossedees.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "40px 20px", background: "#0a0a0f", borderRadius: "14px", border: "1px dashed #1e293b" }}>
                          <p style={{ fontSize: "2.5rem", margin: "0 0 10px" }}>🎴</p>
                          <p style={{ fontFamily: "'Fredoka One', cursive", color: "#475569", fontSize: "1.05rem", margin: 0 }}>Aucune carte encore !</p>
                          <p style={{ color: "#334155", fontSize: "0.82rem", margin: "5px 0 0" }}>Ouvre des packs dans la boutique pour démarrer ta collection.</p>
                        </div>
                      ) : (
                        <>
                          <p style={{ color: "#475569", fontSize: "0.78rem", margin: "0 0 14px" }}>💡 Clique pour agrandir ? ♻️ Doublons recyclables contre 10 jetons</p>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                            {cartesPossedees.map((carte, idx) => {
                              const nb = maCollection[carte.id] || 0;
                              return (
                                <div key={carte.id} style={{ position: "relative" }}>
                                  <CarteMini carte={carte} onClick={() => setVisionneuse({ collection: col, indexDansPossedees: idx })} />
                                  {nb > 1 && (
                                    <>
                                      <div style={{ position: "absolute", top: "-6px", right: "-6px", background: "#7C3AED", color: "white", borderRadius: "100px", width: "22px", height: "22px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6rem", fontWeight: "700", boxShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>x{nb}</div>
                                      <button onClick={e => { e.stopPropagation(); recyclerDoublon(carte); }} title="Recycler contre 10 jetons"
                                        style={{ position: "absolute", bottom: "28px", right: "-6px", background: "#10B981", color: "white", border: "none", borderRadius: "100px", width: "22px", height: "22px", fontSize: "0.7rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.4)" }}>♻</button>
                                    </>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
