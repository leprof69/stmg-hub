import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import Lottie from "lottie-react";

function iconStyleForId(iconId: string, accentColor?: string): React.CSSProperties {
  if (iconId.startsWith("solar:") || iconId.startsWith("line-md:")) {
    return { color: accentColor || "#a78bfa" };
  }
  return {};
}

function LottieItem({ url, size = 40 }: { url: string; size?: number }) {
  const [data, setData] = useState<object | null>(null);
  useEffect(() => {
    fetch(url).then((r) => r.json()).then(setData).catch(() => setData(null));
  }, [url]);
  if (!data) return <span style={{ fontSize: size * 0.6, opacity: 0.3 }}>{"\u2728"}</span>;
  return <Lottie animationData={data} loop autoplay style={{ width: size, height: size }} />;
}

type Props = {
  em: string;
  fontSize?: string;
  accentColor?: string;
};

/** Affiche une déco salon (emoji:, lottie:, icon:, gif:) comme sur le profil. */
export default function SalonDecoSticker({ em, fontSize = "1.9rem", accentColor }: Props) {
  const px = Math.round(parseFloat(fontSize) * 16) || 30;

  if (em.startsWith("lottie:")) {
    return <LottieItem url={em.slice(7)} size={px + 12} />;
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
