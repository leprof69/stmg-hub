import React from "react";
import { PAGE_BG, PAGE_BG_OVERLAY } from "../../lib/pageBackgrounds";

const wrap: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  pointerEvents: "none",
  zIndex: 0,
  overflow: "hidden",
};

/** Overlay tr\u00e8s l\u00e9ger (pas de confettis / matrix / emojis). */
export default function ProfilePageBgOverlay({ bgKey }: { bgKey: string }) {
  const def = PAGE_BG[bgKey];
  if (def?.kind === "photo") return null;
  const mode = PAGE_BG_OVERLAY[bgKey];
  if (!mode || mode === "none") return null;

  if (mode === "stars") {
    return (
      <div style={wrap}>
        {Array.from({ length: 10 }, (_, i) => {
          const size = 1.5 + (i % 3) * 0.5;
          const top = (i * 9.7 + 11) % 92;
          const left = (i * 14.3 + 7) % 94;
          const delay = (i * 0.42) % 3;
          const dur = 2.2 + (i % 4) * 0.35;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                top: `${top}%`,
                left: `${left}%`,
                width: size,
                height: size,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.75)",
                animation: `twinkle ${dur}s ease-in-out ${delay}s infinite`,
              }}
            />
          );
        })}
      </div>
    );
  }

  return (
    <div style={wrap}>
      {[
        { c: "rgba(37,99,235,0.12)", x: "18%", y: "48%", r: "min(42vw, 280px)", d: "0s" },
        { c: "rgba(56,189,248,0.1)", x: "82%", y: "28%", r: "min(38vw, 240px)", d: "1.4s" },
        { c: "rgba(14,165,233,0.10)", x: "52%", y: "78%", r: "min(40vw, 260px)", d: "2.8s" },
      ].map((o, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: o.x,
            top: o.y,
            width: o.r,
            height: o.r,
            marginLeft: `calc(-${o.r} / 2)`,
            marginTop: `calc(-${o.r} / 2)`,
            borderRadius: "50%",
            background: o.c,
            filter: "blur(48px)",
            animation: `orbitFloat ${7 + i * 1.5}s ease-in-out ${o.d} infinite`,
          }}
        />
      ))}
    </div>
  );
}
