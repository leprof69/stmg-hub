import { useEffect, useMemo, useRef, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../services/firebase";
import { getPetMoodLabel, normalizePet } from "../services/familiarPet";
import { formatJetons } from "../lib/jetons";
import AnimatedFamiliar2D from "./AnimatedFamiliar2D";

const MOOD_EMOJI = {
  heureux: "😊",
  neutre: "😌",
  triste: "😢",
  colere: "😠",
};

const STAGE_LABEL = {
  oeuf: "Oeuf",
  bebe: "Bebe",
  ado: "Ado",
  adulte: "Adulte",
};

const updatePetInDb = async (nextPet) => {
  const user = auth.currentUser;
  if (!user) return;
  await updateDoc(doc(db, "users", user.uid), { pet: nextPet });
};

export default function FamiliarCompanion({ profil }) {
  const [nurseryOpen, setNurseryOpen] = useState(false);
  const [eventOpen, setEventOpen] = useState(false);
  const [position, setPosition] = useState({ x: 28, y: 140 });
  const [velocity, setVelocity] = useState({ vx: 1, vy: 1 });
  const [expression, setExpression] = useState("😌");
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef({ active: false, pointerId: null, startX: 0, startY: 0, moved: false, offsetX: 0, offsetY: 0 });
  const preventClickRef = useRef(false);
  const pet = useMemo(() => normalizePet(profil?.pet, profil), [profil]);

  useEffect(() => {
    setExpression(MOOD_EMOJI[pet.mood] || "😌");
  }, [pet.mood]);

  useEffect(() => {
    if (!pet.pendingEvent && pet.introSeen) return;
    setEventOpen(true);
  }, [pet.pendingEvent, pet.introSeen]);

  useEffect(() => {
    if (!pet.isRoaming || isDragging) return undefined;
    const id = setInterval(() => {
      setPosition((prev) => {
        const width = Math.max(320, window.innerWidth);
        const height = Math.max(420, window.innerHeight);
        let nextX = prev.x + velocity.vx * 14;
        let nextY = prev.y + velocity.vy * 11;
        let nextVx = velocity.vx;
        let nextVy = velocity.vy;

        if (nextX <= 10 || nextX >= width - 110) nextVx *= -1;
        if (nextY <= 90 || nextY >= height - 190) nextVy *= -1;

        if (nextVx !== velocity.vx || nextVy !== velocity.vy) {
          setVelocity({ vx: nextVx, vy: nextVy });
        }

        nextX = Math.max(10, Math.min(width - 110, nextX));
        nextY = Math.max(90, Math.min(height - 190, nextY));
        return { x: nextX, y: nextY };
      });
    }, 900);
    return () => clearInterval(id);
  }, [pet.isRoaming, velocity.vx, velocity.vy, isDragging]);

  useEffect(() => {
    const id = setInterval(() => {
      const list = [MOOD_EMOJI[pet.mood] || "😌", "✨", "😴", "💫"];
      setExpression(list[Math.floor(Math.random() * list.length)]);
    }, 3600);
    return () => clearInterval(id);
  }, [pet.mood]);

  const handleToggleRoaming = async () => {
    const nextPet = { ...pet, isRoaming: !pet.isRoaming };
    await updatePetInDb(nextPet);
  };

  const handleCloseEvent = async () => {
    const nextPet = { ...pet, introSeen: true, pendingEvent: null };
    setEventOpen(false);
    await updatePetInDb(nextPet);
  };

  const clampPosition = (x, y) => {
    const width = Math.max(320, window.innerWidth);
    const height = Math.max(420, window.innerHeight);
    return {
      x: Math.max(8, Math.min(width - 130, x)),
      y: Math.max(70, Math.min(height - 130, y)),
    };
  };

  const handlePointerDown = (e) => {
    const pointerX = e.clientX ?? e.touches?.[0]?.clientX;
    const pointerY = e.clientY ?? e.touches?.[0]?.clientY;
    if (typeof pointerX !== "number" || typeof pointerY !== "number") return;
    if (!pet.isRoaming) {
      updatePetInDb({ ...pet, isRoaming: true });
    }
    const start = clampPosition(position.x, position.y);
    setPosition(start);
    dragRef.current = {
      active: true,
      pointerId: e.pointerId ?? null,
      startX: pointerX,
      startY: pointerY,
      moved: false,
      offsetX: pointerX - start.x,
      offsetY: pointerY - start.y,
    };
    setIsDragging(true);
    if (typeof e.currentTarget.setPointerCapture === "function" && typeof e.pointerId === "number") {
      e.currentTarget.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e) => {
    if (!dragRef.current.active) return;
    const pointerX = e.clientX ?? e.touches?.[0]?.clientX;
    const pointerY = e.clientY ?? e.touches?.[0]?.clientY;
    if (typeof pointerX !== "number" || typeof pointerY !== "number") return;
    const next = clampPosition(pointerX - dragRef.current.offsetX, pointerY - dragRef.current.offsetY);
    const movedDist = Math.hypot(pointerX - dragRef.current.startX, pointerY - dragRef.current.startY);
    if (movedDist > 6) dragRef.current.moved = true;
    setPosition(next);
  };

  const handlePointerUp = (e) => {
    if (!dragRef.current.active) return;
    if (dragRef.current.moved) {
      preventClickRef.current = true;
    }
    dragRef.current.active = false;
    if (typeof e.currentTarget.releasePointerCapture === "function" && typeof dragRef.current.pointerId === "number") {
      e.currentTarget.releasePointerCapture(dragRef.current.pointerId);
    }
    setIsDragging(false);
  };

  const handleOpenNursery = () => {
    if (preventClickRef.current) {
      preventClickRef.current = false;
      return;
    }
    setNurseryOpen((v) => !v);
  };

  return (
    <>
      <style>{`
        @keyframes familiarBob {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0px); }
        }
        @keyframes familiarPulse {
          0% { transform: scale(1); opacity: 0.95; }
          50% { transform: scale(1.06); opacity: 1; }
          100% { transform: scale(1); opacity: 0.95; }
        }
      `}</style>

      {eventOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 2500, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
          <div style={{ background: "white", maxWidth: "460px", width: "100%", borderRadius: "22px", padding: "24px", textAlign: "center", boxShadow: "0 15px 40px rgba(0,0,0,0.3)" }}>
            <div style={{ fontSize: "4rem", marginBottom: "10px", animation: "familiarPulse 1.8s infinite" }}>
              {pet.stage === "oeuf" ? "🥚" : pet.emoji}
            </div>
            <p style={{ fontFamily: "'Fredoka One', cursive", fontSize: "1.4rem", margin: "0 0 8px", color: "#1A1A2E" }}>
              Actualite de ta nurserie
            </p>
            <p style={{ color: "#4B5563", lineHeight: 1.6, margin: "0 0 18px" }}>
              {pet.pendingEvent?.message || `Bienvenue ! Ton ${pet.nom} est pret a vivre l'aventure avec toi.`}
            </p>
            <button onClick={handleCloseEvent} style={{ border: "none", borderRadius: "12px", padding: "12px 22px", background: "linear-gradient(135deg, #3B82F6, #7C3AED)", color: "white", fontFamily: "'Fredoka One', cursive", cursor: "pointer" }}>
              Trop bien, continuer
            </button>
          </div>
        </div>
      )}

      <div
        style={{
          position: "fixed",
          zIndex: 1900,
          left: pet.isRoaming ? `${position.x}px` : "20px",
          bottom: pet.isRoaming ? "auto" : "20px",
          top: pet.isRoaming ? `${position.y}px` : "auto",
          transition: isDragging ? "none" : "left 0.7s linear, top 0.7s linear",
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <button
          onClick={handleOpenNursery}
          style={{
            border: "none",
            borderRadius: "20px",
            background: "transparent",
            color: "#111827",
            padding: "6px 10px 6px 8px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            boxShadow: "none",
            cursor: "grab",
          }}
        >
          <div style={{ animation: "familiarBob 2s infinite ease-in-out", filter: "drop-shadow(0 8px 10px rgba(0,0,0,0.25))" }}>
            <AnimatedFamiliar2D pet={pet} compact />
          </div>
          <span style={{ fontSize: "1rem", textShadow: "0 2px 6px rgba(255,255,255,0.8)" }}>{expression}</span>
        </button>
      </div>

      {nurseryOpen && (
        <div style={{ position: "fixed", right: "16px", bottom: "16px", zIndex: 2100, width: "320px", borderRadius: "20px", background: "white", boxShadow: "0 20px 40px rgba(0,0,0,0.2)", border: "1px solid #E5E7EB", overflow: "hidden" }}>
          <div style={{ background: "linear-gradient(135deg, #1F2937, #4B5563)", color: "white", padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ margin: 0, fontFamily: "'Fredoka One', cursive", fontSize: "1rem" }}>Nurserie Mythique</p>
              <p style={{ margin: 0, fontSize: "0.75rem", opacity: 0.8 }}>{pet.emoji} {pet.nom}</p>
            </div>
            <button onClick={() => setNurseryOpen(false)} style={{ border: "none", background: "transparent", color: "white", fontSize: "1.2rem", cursor: "pointer" }}>×</button>
          </div>
          <div style={{ padding: "14px 16px", display: "grid", gap: "10px" }}>
            <div style={{ background: "#F9FAFB", borderRadius: "12px", padding: "10px", border: "1px solid #E5E7EB", display: "flex", justifyContent: "center" }}>
              <AnimatedFamiliar2D pet={pet} />
            </div>
            <div style={{ background: "#F9FAFB", borderRadius: "12px", padding: "10px 12px", border: "1px solid #E5E7EB" }}>
              <p style={{ margin: "0 0 3px", color: "#6B7280", fontSize: "0.75rem" }}>Stade</p>
              <p style={{ margin: 0, fontWeight: 800, color: "#111827" }}>{STAGE_LABEL[pet.stage]} ? {getPetMoodLabel(pet.mood)}</p>
            </div>
            <div style={{ background: "#F9FAFB", borderRadius: "12px", padding: "10px 12px", border: "1px solid #E5E7EB" }}>
              <p style={{ margin: "0 0 3px", color: "#6B7280", fontSize: "0.75rem" }}>Bonheur</p>
              <div style={{ width: "100%", height: "8px", borderRadius: "999px", background: "#E5E7EB", overflow: "hidden" }}>
                <div style={{ width: `${pet.happiness}%`, height: "8px", borderRadius: "999px", background: pet.happiness >= 50 ? "#10B981" : "#EF4444", transition: "width 0.3s ease" }} />
              </div>
              <p style={{ margin: "6px 0 0", color: "#374151", fontSize: "0.75rem" }}>
                {pet.happiness}% ? {pet.mood === "triste" || pet.mood === "colere" ? "Malus jetons actif" : "Bonus jetons actif"}
              </p>
            </div>
            <div style={{ background: "#F9FAFB", borderRadius: "12px", padding: "10px 12px", border: "1px solid #E5E7EB" }}>
              <p style={{ margin: "0 0 3px", color: "#6B7280", fontSize: "0.75rem" }}>Age et progression</p>
              <p style={{ margin: 0, color: "#111827", fontWeight: 700 }}>
                {pet.ageDays} jour(s) ? missions : {formatJetons(pet.totalXpFromMissions)}
              </p>
            </div>
            <button
              onClick={handleToggleRoaming}
              style={{
                border: "none",
                borderRadius: "12px",
                padding: "11px 14px",
                color: "white",
                fontFamily: "'Fredoka One', cursive",
                cursor: "pointer",
                background: pet.isRoaming ? "linear-gradient(135deg, #F97316, #DC2626)" : "linear-gradient(135deg, #10B981, #059669)",
              }}
            >
              {pet.isRoaming ? "Rentrer a la nurserie" : "Sortir se balader"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

