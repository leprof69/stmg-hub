import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import Lottie from "lottie-react";
import { resolveLottieFetchUrl } from "../lib/fluent3dAssets";

function iconStyleForId(iconId: string, accentColor?: string): React.CSSProperties {
  if (iconId.startsWith("solar:") || iconId.startsWith("line-md:")) {
    return { color: accentColor || "#a78bfa" };
  }
  return {};
}

function LottieItem({ em, size = 40 }: { em: string; size?: number }) {
  const url = resolveLottieFetchUrl(em);
  const [data, setData] = useState<object | null>(null);
  useEffect(() => {
    fetch(url)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setData)
      .catch(() => setData(null));
  }, [url]);
  if (!data) return <span style={{ fontSize: size * 0.6, opacity: 0.35 }}>{"\u2728"}</span>;
  return <Lottie animationData={data} loop autoplay style={{ width: size, height: size }} />;
}

type Props = {
  em: string;
  fontSize?: string;
  accentColor?: string;
};

/** Affiche une déco salon (fluent3d:, lottie:, icon:, gif:, emoji: legacy) */
export default function SalonDecoSticker({ em, fontSize = "1.9rem", accentColor }: Props) {
  const px = Math.round(parseFloat(fontSize) * 16) || 30;

  if (em.startsWith("fluent3d:")) {
    return (
      <img
        src={em.slice(9)}
        alt=""
        loading="lazy"
        draggable={false}
        style={{
          width: px + 14,
          height: px + 14,
          objectFit: "contain",
          filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.35))",
        }}
      />
    );
  }
  if (em.startsWith("lottie:")) {
    const m = em.match(/\/Animated\/([^/?#.]+)\.json/i);
    if (m) {
      const id = decodeURIComponent(m[1]);
      return (
        <img
          src={`/fluent-3d/${id}.png`}
          alt=""
          loading="lazy"
          draggable={false}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
          style={{
            width: px + 14,
            height: px + 14,
            objectFit: "contain",
            filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.35))",
          }}
        />
      );
    }
    return <LottieItem em={em} size={px + 12} />;
  }
  if (em.startsWith("gif:")) {
    return (
      <img
        src={em.slice(4)}
        alt=""
        loading="lazy"
        style={{ width: px + 14, height: px + 14, objectFit: "contain", borderRadius: 4 }}
      />
    );
  }
  if (em.startsWith("icon:")) {
    return (
      <Icon
        icon={em.slice(5)}
        width={px}
        height={px}
        style={{ display: "block", ...iconStyleForId(em.slice(5), accentColor) }}
      />
    );
  }
  if (em.startsWith("emoji:")) {
    return <span style={{ fontSize }}>{em.slice(6)}</span>;
  }
  return <span style={{ fontSize }}>{em}</span>;
}
