import { useRef } from "react";
import { AvatarSVG } from "../../pages/AvatarCreator";
import type { AvatarConfig } from "../../pages/AvatarCreator";
import type { SalonConfig } from "../../lib/profileCustomization";
import { SALON_THEMES } from "../../lib/profileCustomization";
import type { SalonDecoPlacement } from "../../lib/profileCustomization";
import SalonDecoLayer from "./SalonDecoLayer";

type Props = {
  salon: SalonConfig;
  prenom: string;
  couleurFamille: string;
  avatarConfig: AvatarConfig;
  selectedEm: string | null;
  onSelectEm: (em: string) => void;
  onLayoutPatch: (em: string, patch: Partial<SalonDecoPlacement>) => void;
};

/** Zone visible dans l'onglet Stickers pour placer et redimensionner les decos. */
export default function StickerPlacementCanvas({
  salon,
  prenom,
  couleurFamille,
  avatarConfig,
  selectedEm,
  onSelectEm,
  onLayoutPatch,
}: Props) {
  const heroRef = useRef<HTMLDivElement>(null);
  const theme = SALON_THEMES[salon.theme] || SALON_THEMES.defaut;

  return (
    <div className="ps-placement-wrap">
      <p className="ps-placement-title">Zone de placement</p>
      <p className="ps-placement-sub">
        Clique un sticker en bas, puis <strong>glisse-le ici</strong> avec la souris ou le doigt.
      </p>
      <div
        ref={heroRef}
        className="ps-placement-hero ps-hero-editable"
        style={{ background: theme.gradient }}
      >
        <SalonDecoLayer
          salon={salon}
          couleurFamille={couleurFamille}
          heroRef={heroRef}
          editable
          selectedEm={selectedEm}
          onSelectEm={onSelectEm}
          onLayoutPatch={onLayoutPatch}
          animate={false}
        />
        <div className="ps-placement-hero-inner">
          <AvatarSVG config={avatarConfig} size={48} />
          <span className="ps-placement-name">{prenom}</span>
        </div>
      </div>
    </div>
  );
}
