import type { CSSProperties, ReactNode } from "react";
import { AvatarSVG } from "../../pages/AvatarCreator";
import type { AvatarConfig } from "../../pages/AvatarCreator";
import SalonDecoLayer from "./SalonDecoLayer";
import ProfilePageBgOverlay from "./ProfilePageBgOverlay";
import type { BgDef } from "../../lib/pageBgTypes";
import type { PageStyle, SalonConfig } from "../../lib/profileCustomization";
import { NAME_EFFECT, SALON_THEMES, VITRINE_FRAME } from "../../lib/profileCustomization";
import { isPhotoPageBg, pageBgFocal, pageBgFullScreen } from "../../lib/pageBgUtils";
import {
  avatarFrameStyles,
  getProfilSurface,
  profilHeroNameStyle,
  profilPanelStyle,
  profilPanelTextColors,
  profilThemeVars,
} from "../../lib/profilTheme";
import "./profilPage.css";

type VitrineCard = { id: string; nom: string; image: string; rarete: string } | null;
type TradeOffer = Record<string, unknown>;

const RARETE: Record<string, { label: string; couleur: string; emoji: string }> = {
  commune: { label: "Commune", couleur: "#9CA3AF", emoji: "\u26AA" },
  peu_commune: { label: "Peu commune", couleur: "#10B981", emoji: "\u{1F7E2}" },
  rare: { label: "Rare", couleur: "#3B82F6", emoji: "\u{1F535}" },
  epique: { label: "\u00c9pique", couleur: "#0284C7", emoji: "\u{1F537}" },
  legendaire: { label: "L\u00e9gendaire", couleur: "#F59E0B", emoji: "\u2B50" },
  ultra_rare: { label: "Ultra Rare", couleur: "#EF4444", emoji: "\u{1F48E}" },
};

export type ProfilPageViewProps = {
  profil: Record<string, unknown>;
  salon: SalonConfig;
  pageStyle: PageStyle;
  pageBgCfg: BgDef;
  couleurFamille: string;
  avatarConfig: AvatarConfig;
  salonTitre: string;
  familleNom: string;
  vitrine: VitrineCard[];
  cartesCount: number;
  jetonsLabel: string;
  tradeOffers: TradeOffer[];
  acceptingTrade: string | null;
  jokerDisponible: boolean;
  onPersonalize: () => void;
  onPickVitrineSlot: (i: number) => void;
  onAcceptTrade: (o: TradeOffer) => void;
  onDeclineTrade: (o: TradeOffer) => void;
  onJoker: () => void;
  onCGU: () => void;
  onContact: () => void;
  onLogout: () => void;
};

function Panel({
  title,
  subtitle,
  badge,
  panelStyle,
  textColor,
  mutedColor,
  children,
  delay = 0,
}: {
  title: string;
  subtitle?: string;
  badge?: ReactNode;
  panelStyle: CSSProperties;
  textColor: string;
  mutedColor: string;
  children: ReactNode;
  delay?: number;
}) {
  return (
    <section
      className="pp-panel"
      style={{ ...panelStyle, color: textColor, animationDelay: `${delay}ms` }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
        <div>
          <h2 className="pp-panel-title" style={{ color: textColor }}>
            {title}
          </h2>
          {subtitle && (
            <p className="pp-panel-sub" style={{ color: mutedColor }}>
              {subtitle}
            </p>
          )}
        </div>
        {badge}
      </div>
      {children}
    </section>
  );
}

export default function ProfilPageView({
  profil,
  salon,
  pageStyle,
  pageBgCfg,
  couleurFamille,
  avatarConfig,
  salonTitre,
  familleNom,
  vitrine,
  cartesCount,
  jetonsLabel,
  tradeOffers,
  acceptingTrade,
  jokerDisponible,
  onPersonalize,
  onPickVitrineSlot,
  onAcceptTrade,
  onDeclineTrade,
  onJoker,
  onCGU,
  onContact,
  onLogout,
}: ProfilPageViewProps) {
  const surface = getProfilSurface(pageBgCfg);
  const isPhoto = isPhotoPageBg(pageBgCfg);
  const theme = SALON_THEMES[salon.theme] || SALON_THEMES.defaut;
  const nameFx = NAME_EFFECT[pageStyle.nameEffect] || NAME_EFFECT.defaut;
  const vfCfg = VITRINE_FRAME[pageStyle.vitrineFrame] || VITRINE_FRAME.defaut;

  const isDarkPage = surface === "dark";
  const heroDark = isPhoto ? pageBgCfg.dark : theme.dark;
  const heroText = heroDark ? "#f8fafc" : "#0f172a";
  const heroMuted = heroDark ? "rgba(248,250,252,0.72)" : "rgba(15,23,42,0.65)";

  const effCard =
    pageStyle.cardStyle === "defaut" && pageStyle.pageBg !== "defaut"
      ? isDarkPage
        ? "darkglass"
        : "glass"
      : pageStyle.cardStyle;
  const panelSt = profilPanelStyle(effCard, isDarkPage, couleurFamille);
  const { main: textMain, muted: textMuted } = profilPanelTextColors(surface, effCard);
  const avatarFrameKey = pageStyle.avatarFrame || "defaut";
  const afStyles = avatarFrameStyles(avatarFrameKey, couleurFamille);

  const photoFocal = pageBgFocal(pageBgCfg);
  const photoSrc = isPhoto ? pageBgCfg.image! : "";

  const gifDecos = salon.deco.filter((d) => d.startsWith("gif:"));

  return (
    <div className="pp-root" style={profilThemeVars(surface, couleurFamille)}>
      {isPhoto ? (
        <>
          <div className="pp-bg-fixed pp-bg-photo-blur" aria-hidden>
            <img src={photoSrc} alt="" style={{ objectPosition: photoFocal }} />
          </div>
          <div className="pp-bg-photo-dim" aria-hidden />
        </>
      ) : (
        <div className="pp-bg-fixed" style={{ background: pageBgFullScreen(pageBgCfg) }} />
      )}
      <ProfilePageBgOverlay bgKey={pageStyle.pageBg} />

      <div className="pp-scroll">
        <header className="pp-hero">
          {isPhoto ? (
            <div className="pp-hero-media" aria-hidden>
              <img
                className="pp-hero-photo"
                src={photoSrc}
                alt=""
                decoding="async"
                fetchPriority="high"
                style={{ objectPosition: photoFocal }}
              />
            </div>
          ) : (
            <div className="pp-hero-gradient" style={{ background: theme.gradient }} aria-hidden />
          )}
          <div className={`pp-hero-scrim${isPhoto ? "" : " pp-hero-scrim--mesh"}`} aria-hidden />
          <SalonDecoLayer salon={salon} couleurFamille={couleurFamille} animate animSet="profile" />

          <button type="button" className="pp-edit-btn" onClick={onPersonalize}>
            <span>{"\u2728"}</span>
            <span>Personnaliser</span>
          </button>

          <div className="pp-hero-inner">
            <p className="pp-salon-label" style={{ color: heroMuted }}>
              {"\u{1F3E0} "}
              {salonTitre}
            </p>
            <div className="pp-avatar-stage">
              <div className="pp-avatar-ring" style={afStyles.ring}>
                <div className="pp-avatar-inner" style={afStyles.inner}>
                  <AvatarSVG config={avatarConfig} size={120} />
                </div>
              </div>
            </div>
            <h1
              className="pp-name"
              style={profilHeroNameStyle(heroDark, pageStyle.nameEffect, nameFx.style)}
            >
              {profil.prenom as string}
            </h1>
            <span
              className="pp-famille"
              style={{
                color: heroText,
                background: `${couleurFamille}40`,
                border: `1px solid ${couleurFamille}66`,
              }}
            >
              {familleNom}
            </span>
            {salon.motto && (
              <p className="pp-motto" style={{ color: heroMuted }}>
                &ldquo;{salon.motto}&rdquo;
              </p>
            )}
            <div className="pp-stats">
              <span className="pp-stat" style={{ color: heroText }}>
                {"\u26A1 "}
                {jetonsLabel}
              </span>
              <span className="pp-stat" style={{ color: heroText }}>
                {"\u{1F0CF} "}
                {cartesCount} cartes
              </span>
            </div>
            <p className="pp-hero-hint" style={{ color: heroMuted }}>
              {"Avatar : Jeux \u00b7 Mon Avatar"}
            </p>
          </div>
        </header>

        <div className="pp-body">
          <Panel
            title={"\u2728 Ma vitrine"}
            subtitle={"3 cartes mises en avant sur ton profil public."}
            panelStyle={panelSt}
            textColor={textMain}
            mutedColor={textMuted}
            delay={60}
          >
            <div className="pp-vitrine-grid">
              {[0, 1, 2].map((i) => {
                const carte = vitrine[i];
                const cfg = carte ? RARETE[carte.rarete] : null;
                const border = carte
                  ? vfCfg.border.replace(/{c}/g, cfg?.couleur ?? couleurFamille)
                  : `2px dashed ${isDarkPage ? "rgba(255,255,255,0.2)" : "#cbd5e1"}`;
                const shadow = carte && vfCfg.shadow !== "none"
                  ? vfCfg.shadow.replace(/{c}/g, cfg?.couleur ?? couleurFamille)
                  : undefined;
                return (
                  <button
                    key={i}
                    type="button"
                    className="pp-vitrine-slot"
                    style={{ border, boxShadow: shadow }}
                    onClick={() => onPickVitrineSlot(i)}
                  >
                    {carte && cfg ? (
                      <>
                        <div className="pp-vitrine-media">
                          <img src={carte.image} alt={carte.nom} loading="lazy" decoding="async" />
                          <div className="pp-vitrine-shine" aria-hidden />
                        </div>
                        <div style={{ padding: "6px 8px", borderTop: `1px solid ${cfg.couleur}25` }}>
                          <p style={{ margin: 0, fontSize: "0.58rem", fontWeight: 800, color: textMain, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {carte.nom}
                          </p>
                          <p style={{ margin: "2px 0 0", fontSize: "0.52rem", fontWeight: 700, color: cfg.couleur }}>
                            {cfg.emoji} {cfg.label}
                          </p>
                        </div>
                      </>
                    ) : (
                      <div className="pp-vitrine-empty" style={{ color: textMuted }}>
                        <span style={{ fontSize: "1.75rem", lineHeight: 1 }}>+</span>
                        <span>Ajouter</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </Panel>

          {gifDecos.length > 0 && (
            <Panel title={"Ambiance GIF"} panelStyle={panelSt} textColor={textMain} mutedColor={textMuted} delay={90}>
              <div className="pp-gif-row">
                {gifDecos.map((gif, i) => (
                  <div key={i} className="pp-gif-thumb">
                    <img src={gif.slice(4)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" />
                  </div>
                ))}
              </div>
            </Panel>
          )}

          {tradeOffers.length > 0 && (
            <Panel
              title={"\u00c9changes en attente"}
              subtitle={"Des camarades veulent \u00e9changer avec toi."}
              panelStyle={panelSt}
              textColor={textMain}
              mutedColor={textMuted}
              badge={<span className="pp-badge-count">{tradeOffers.length}</span>}
              delay={120}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {tradeOffers.map((offer) => (
                  <div key={offer.id as string} className="pp-trade-card">
                    <p style={{ margin: "0 0 8px", fontWeight: 800, fontSize: "0.88rem", color: textMain }}>
                      {offer.fromPrenom as string}
                      <span style={{ fontWeight: 500, color: textMuted }}> propose</span>
                    </p>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 10 }}>
                      <TradeMini card={offer.fromCard as { image: string; nom: string }} label="Il donne" color="#059669" textColor={textMain} />
                      <span style={{ fontSize: "1.25rem", fontWeight: 900, color: "#0EA5E9" }}>{"\u21C4"}</span>
                      <TradeMini card={offer.toCard as { image: string; nom: string }} label="Tu donnes" color="#dc2626" textColor={textMain} />
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button type="button" className="pp-btn-ghost" onClick={() => onDeclineTrade(offer)}>
                        Refuser
                      </button>
                      <button
                        type="button"
                        className="pp-btn-primary"
                        style={{ background: "#2563EB", color: "#fff" }}
                        disabled={acceptingTrade === offer.id}
                        onClick={() => onAcceptTrade(offer)}
                      >
                        {acceptingTrade === offer.id ? "..." : "Accepter"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Panel>
          )}

          <div className="pp-bento">
            <Panel title={"Mes infos"} panelStyle={panelSt} textColor={textMain} mutedColor={textMuted} delay={150}>
              <InfoRow label={"Pr\u00e9nom"} value={String(profil.prenom)} muted={textMuted} main={textMain} />
              <InfoRow label={"\u00c2ge"} value={`${profil.age} ans`} muted={textMuted} main={textMain} />
              <InfoRow
                label="Classe"
                value={
                  profil.classe === "premiere"
                    ? "Premi\u00e8re STMG"
                    : profil.classe === "terminale"
                    ? "Terminale STMG"
                    : "Non renseign\u00e9e"
                }
                muted={textMuted}
                main={textMain}
              />
              {profil.specialite && (
                <InfoRow label={"Sp\u00e9cialit\u00e9"} value={String(profil.specialite)} muted={textMuted} main={textMain} />
              )}
              <InfoRow label={"Lyc\u00e9e"} value={String(profil.lycee)} muted={textMuted} main={textMain} />
            </Panel>

            <Panel title={"Triple totem"} panelStyle={panelSt} textColor={textMain} mutedColor={textMuted} delay={180}>
              <div className="pp-totem-grid">
                {[
                  { label: "Animal", data: profil.animalTotem },
                  { label: "Objet", data: profil.objetTotem },
                  { label: "Star", data: profil.starTotem },
                ].map((t, i) => (
                  <div key={i} className="pp-totem-cell">
                    <div style={{ fontSize: "1.5rem", lineHeight: 1 }}>
                      {(t.data as { emoji?: string })?.emoji || "\u2014"}
                    </div>
                    <div style={{ fontSize: "0.58rem", color: textMuted, marginTop: 4 }}>{t.label}</div>
                    <div
                      style={{
                        fontFamily: "'Fredoka One', cursive",
                        fontSize: "0.62rem",
                        color: couleurFamille,
                        marginTop: 2,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {(t.data as { nom?: string })?.nom || "\u2014"}
                    </div>
                  </div>
                ))}
              </div>
            </Panel>
          </div>

          <Panel
            title={"\u{1F0CF} Joker"}
            subtitle={"Refaire le quiz une fois sans tout perdre."}
            panelStyle={panelSt}
            textColor={textMain}
            mutedColor={textMuted}
            delay={210}
          >
            {jokerDisponible ? (
              <>
                <p style={{ margin: "0 0 12px", fontSize: "0.88rem", color: textMuted, lineHeight: 1.55 }}>
                  Tu as encore 1 joker : jetons, badges et cartes sont conserv\u00e9s.
                </p>
                <button type="button" className="pp-joker-btn" onClick={onJoker}>
                  Utiliser mon joker
                </button>
              </>
            ) : (
              <p style={{ margin: 0, fontSize: "0.88rem", color: textMuted }}>Joker d\u00e9j\u00e0 utilis\u00e9.</p>
            )}
          </Panel>

          <Panel title={"\u{1F4CB} L\u00e9gal"} panelStyle={panelSt} textColor={textMain} mutedColor={textMuted} delay={240}>
            <button type="button" className="pp-legal-btn" style={{ color: textMain }} onClick={onCGU}>
              CGU & RGPD
            </button>
            <button type="button" className="pp-legal-btn" style={{ color: textMain }} onClick={onContact}>
              Nous contacter
            </button>
          </Panel>

          <button type="button" className="pp-logout" onClick={onLogout}>
            {"Se \u00e9connecter"}
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  label,
  value,
  muted,
  main,
}: {
  label: string;
  value: string;
  muted: string;
  main: string;
}) {
  return (
    <div className="pp-info-row">
      <span style={{ color: muted }}>{label}</span>
      <span style={{ color: main, fontWeight: 800, textAlign: "right", maxWidth: "58%" }}>{value}</span>
    </div>
  );
}

function TradeMini({
  card,
  label,
  color,
  textColor,
}: {
  card: { image: string; nom: string };
  label: string;
  color: string;
  textColor: string;
}) {
  return (
    <div style={{ flex: 1, minWidth: 0, textAlign: "center" }}>
      <img src={card.image} alt={card.nom} className="pp-trade-img" loading="lazy" decoding="async" />
      <p style={{ margin: "4px 0 0", fontSize: "0.58rem", fontWeight: 800, color: textColor, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {card.nom}
      </p>
      <p style={{ margin: 0, fontSize: "0.52rem", fontWeight: 700, color }}>{label}</p>
    </div>
  );
}
