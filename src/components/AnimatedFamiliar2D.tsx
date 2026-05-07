import { useMemo, type CSSProperties } from "react";

const STAGE_SCALE = {
  oeuf: 0.9,
  bebe: 1,
  ado: 1.08,
  adulte: 1.16,
};

const MOOD_FACE = {
  heureux: "😊",
  neutre: "😌",
  triste: "😢",
  colere: "😠",
};

const MOOD_FILTER = {
  heureux: "saturate(1.1) brightness(1.04)",
  neutre: "saturate(1)",
  triste: "saturate(0.88) brightness(0.92)",
  colere: "saturate(1.18) hue-rotate(-10deg)",
};

const buildFallback = (pet) => {
  if (pet?.stage === "oeuf") return "🥚";
  return pet?.emoji || "🐾";
};

export default function AnimatedFamiliar2D({
  pet,
  compact = false,
}) {
  const face = MOOD_FACE[pet?.mood] || "😌";
  const scale = STAGE_SCALE[pet?.stage] || 1;
  const filter = MOOD_FILTER[pet?.mood] || MOOD_FILTER.neutre;
  const customImage = pet?.assets?.idle || pet?.image2d || "";

  const size = useMemo(() => {
    if (compact) return 88;
    return 220;
  }, [compact]);

  const baseStyle: CSSProperties = {
    width: `${size}px`,
    height: `${size}px`,
    position: "relative",
    transform: `scale(${scale})`,
    transformOrigin: "center bottom",
  };

  return (
    <div style={baseStyle}>
      <style>{`
        @keyframes familiar2DBob {
          0% { transform: translateY(0px) rotate(0deg); }
          40% { transform: translateY(-6px) rotate(-1deg); }
          80% { transform: translateY(0px) rotate(1deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        @keyframes familiar2DGlow {
          0% { filter: drop-shadow(0 4px 8px rgba(0,0,0,0.22)); }
          50% { filter: drop-shadow(0 8px 14px rgba(0,0,0,0.26)); }
          100% { filter: drop-shadow(0 4px 8px rgba(0,0,0,0.22)); }
        }
      `}</style>

      <div
        style={{
          position: "absolute",
          inset: 0,
          animation: "familiar2DBob 2.2s infinite ease-in-out, familiar2DGlow 2.4s infinite ease-in-out",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {customImage ? (
          <img
            src={customImage}
            alt={pet?.nom || "Familier"}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              imageRendering: "auto",
              filter,
              userSelect: "none",
              pointerEvents: "none",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              background: "radial-gradient(circle at 35% 30%, #FDE68A, #F59E0B 68%, #D97706)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: compact ? "2.1rem" : "5rem",
              filter,
              userSelect: "none",
              pointerEvents: "none",
            }}
          >
            {buildFallback(pet)}
          </div>
        )}
      </div>

      <div
        style={{
          position: "absolute",
          right: compact ? "-2px" : "4px",
          top: compact ? "0px" : "10px",
          fontSize: compact ? "1rem" : "1.4rem",
          textShadow: "0 2px 6px rgba(255,255,255,0.85)",
          pointerEvents: "none",
        }}
      >
        {face}
      </div>
    </div>
  );
}

