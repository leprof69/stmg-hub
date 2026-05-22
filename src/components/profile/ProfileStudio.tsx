import { useState, useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
import Lottie from "lottie-react";
import { AvatarSVG } from "../../pages/AvatarCreator";
import type { AvatarConfig } from "../../pages/AvatarCreator";
import SalonDecoSticker from "../SalonDecoSticker";
import SalonDecoLayer from "./SalonDecoLayer";
import StickerPlacementCanvas from "./StickerPlacementCanvas";
import {
  type PageStyle,
  type SalonConfig,
  PAGE_BG,
  pageBgCss,
  PAGE_BG_FILTER_CHIPS,
  pageBgMatchesFilter,
  type PageBgFilterId,
  CARD_STYLE,
  NAME_EFFECT,
  VITRINE_FRAME,
  SALON_THEMES,
  DECO_CATS,
  AVATAR_FRAME,
  MAX_SALON_DECOS,
  decoItemPrice,
} from "../../lib/profileCustomization";
import { decoLabel } from "../../lib/profileDecoUtils";
import {
  BASE_PACK_LABEL,
  BASE_PACK_SUMMARY,
  themeShopPrice,
  isThemeOwnedByUser,
  isPageItemOwnedByUser,
  isDecoOwnedByUser,
} from "../../lib/profileBasePack";
import { avatarFrameStyles } from "../../lib/profilTheme";
import {
  normalizeSalonDecoLayout,
  removeDecoFromLayout,
  setDecoPlacement,
  getDecoPlacement,
  SALON_DECO_SCALE_MIN,
  SALON_DECO_SCALE_MAX,
} from "../../lib/salonDecoLayout";
import { resolveLottieFetchUrl } from "../../lib/fluent3dAssets";
import "./profileStudio.css";

function LottieItem({ em, size = 40 }: { em: string; size?: number }) {
  const url = resolveLottieFetchUrl(em);
  const [data, setData] = useState<object | null>(null);
  useEffect(() => {
    fetch(url).then((r) => r.json()).then(setData).catch(() => setData(null));
  }, [url]);
  if (!data) return <span style={{ fontSize: size * 0.5, opacity: 0.35 }}>{"\u2728"}</span>;
  return <Lottie animationData={data} loop autoplay style={{ width: size, height: size }} />;
}

function sectionCardStyle(
  cardStyle: string,
  isDarkPage: boolean,
  accent: string
): React.CSSProperties {
  const cs =
    cardStyle === "defaut" && !isDarkPage
      ? "glass"
      : cardStyle === "defaut" && isDarkPage
        ? "darkglass"
        : cardStyle;
  if (cs === "glass")
    return {
      background: "rgba(255,255,255,0.18)",
      backdropFilter: "blur(14px)",
      WebkitBackdropFilter: "blur(14px)",
      border: "1px solid rgba(255,255,255,0.28)",
    };
  if (cs === "darkglass")
    return {
      background: "rgba(15,23,42,0.55)",
      backdropFilter: "blur(14px)",
      border: "1px solid rgba(255,255,255,0.1)",
    };
  if (cs === "neon")
    return {
      background: "rgba(7,10,18,0.85)",
      border: `1px solid ${accent}55`,
      boxShadow: `0 0 16px ${accent}22`,
    };
  if (cs === "minimal")
    return { background: "rgba(255,255,255,0.95)", border: "1px solid rgba(0,0,0,0.06)" };
  return { background: "white", boxShadow: "0 4px 16px rgba(0,0,0,0.06)" };
}

function StudioPreview({
  pageStyle,
  salon,
  prenom,
  couleurFamille,
  avatarConfig,
  editable = false,
  selectedEm = null,
  onSelectEm,
  onLayoutPatch,
}: {
  pageStyle: PageStyle;
  salon: SalonConfig;
  prenom: string;
  couleurFamille: string;
  avatarConfig: AvatarConfig;
  editable?: boolean;
  selectedEm?: string | null;
  onSelectEm?: (em: string) => void;
  onLayoutPatch?: (em: string, patch: Partial<import("../../lib/profileCustomization").SalonDecoPlacement>) => void;
}) {
  const heroRef = useRef<HTMLDivElement>(null);
  const bgCfg = PAGE_BG[pageStyle.pageBg] || PAGE_BG.defaut;
  const theme = SALON_THEMES[salon.theme] || SALON_THEMES.defaut;
  const neCfg = NAME_EFFECT[pageStyle.nameEffect] || NAME_EFFECT.defaut;
  const vfCfg = VITRINE_FRAME[pageStyle.vitrineFrame] || VITRINE_FRAME.defaut;
  const afKey = pageStyle.avatarFrame || "defaut";
  const afSt = avatarFrameStyles(afKey, couleurFamille);
  const isDark = bgCfg.dark;
  const effCs =
    pageStyle.cardStyle === "defaut" && pageStyle.pageBg !== "defaut"
      ? isDark
        ? "darkglass"
        : "glass"
      : pageStyle.cardStyle;
  const cardSt = sectionCardStyle(effCs, isDark, couleurFamille);
  const textMain = isDark || effCs === "darkglass" || effCs === "neon" ? "#f8fafc" : "#0f172a";
  const vfBorder = vfCfg.border.replace(/{c}/g, couleurFamille);

  return (
    <div className="ps-phone">
      <div className="ps-phone-notch" />
      <div
        style={{
          borderRadius: 22,
          overflow: "hidden",
          background: pageBgCss(bgCfg),
          minHeight: 380,
          padding: 10,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <div
          ref={heroRef}
          className={editable ? "ps-hero-editable" : undefined}
          style={{
            background: theme.gradient,
            borderRadius: 16,
            padding: "18px 14px",
            position: "relative",
            overflow: "hidden",
            textAlign: "center",
          }}
        >
          {editable && (
            <p className="ps-hero-edit-hint">Glisse les stickers · curseur pour la taille</p>
          )}
          <SalonDecoLayer
            salon={salon}
            couleurFamille={couleurFamille}
            heroRef={heroRef}
            editable={editable}
            selectedEm={selectedEm}
            onSelectEm={onSelectEm}
            onLayoutPatch={onLayoutPatch}
            animate={!editable}
          />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
              <div style={afSt.ring}>
                <div style={afSt.inner}>
                  <AvatarSVG config={avatarConfig} size={58} />
                </div>
              </div>
            </div>
            <p
              style={{
                fontFamily: "'Fredoka One', cursive",
                fontSize: "1.05rem",
                margin: "0 0 4px",
                ...neCfg.style,
                color:
                  neCfg.style.color ||
                  (neCfg.style.WebkitTextFillColor ? "transparent" : theme.dark ? "white" : "#0f172a"),
              }}
            >
              {prenom}
            </p>
            {salon.motto && (
              <p
                style={{
                  fontSize: "0.58rem",
                  fontStyle: "italic",
                  margin: 0,
                  color: theme.dark ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.6)",
                }}
              >
                {"\u201C"}
                {salon.motto}
                {"\u201D"}
              </p>
            )}
          </div>
        </div>
        <div style={{ ...cardSt, borderRadius: 12, padding: "8px 10px" }}>
          <p style={{ fontSize: "0.55rem", fontWeight: 800, color: textMain, margin: "0 0 6px" }}>
            {"\u2728 Vitrine"}
          </p>
          <div style={{ display: "flex", gap: 4 }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: 36,
                  borderRadius: 6,
                  background: "rgba(128,128,128,0.15)",
                  border: vfBorder,
                  boxShadow: vfCfg.shadow.replace(/{c}/g, couleurFamille),
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

type Tab = "salon" | "ambiance" | "stickers" | "texte";

export type ProfileStudioProps = {
  prenom: string;
  couleurFamille: string;
  avatarConfig: AvatarConfig;
  pageStyle: PageStyle;
  salon: SalonConfig;
  jetons: number;
  ownedPageItems: string[];
  ownedThemes: string[];
  ownedDecoItems: string[];
  onBuyPageItem: (key: string, price: number) => Promise<boolean>;
  onBuyDecoItem: (em: string, price: number) => Promise<boolean>;
  onBuyTheme: (themeKey: string, price: number) => Promise<boolean>;
  onSave: (pageStyle: PageStyle, salon: SalonConfig) => Promise<void>;
  onClose: () => void;
};

export default function ProfileStudio({
  prenom,
  couleurFamille,
  avatarConfig,
  pageStyle,
  salon,
  jetons,
  ownedPageItems,
  ownedThemes,
  ownedDecoItems,
  onBuyPageItem,
  onBuyDecoItem,
  onBuyTheme,
  onSave,
  onClose,
}: ProfileStudioProps) {
  const [localPage, setLocalPage] = useState<PageStyle>({
    ...pageStyle,
    avatarFrame: pageStyle.avatarFrame || "defaut",
  });
  const [localSalon, setLocalSalon] = useState<SalonConfig>({ ...salon });
  const [tab, setTab] = useState<Tab>("stickers");
  const previewColRef = useRef<HTMLDivElement>(null);
  const [pageSub, setPageSub] = useState<"bg" | "cards" | "name" | "vitrine" | "avatar">("bg");
  const [bgFilter, setBgFilter] = useState<PageBgFilterId>("all");
  const [decoCat, setDecoCat] = useState(DECO_CATS[0].key);
  const [selectedDecoEm, setSelectedDecoEm] = useState<string | null>(null);
  const [buying, setBuying] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const isPageOwned = (key: string) => isPageItemOwnedByUser(key, ownedPageItems);
  const isThemeOwned = (key: string) => isThemeOwnedByUser(key, ownedThemes);

  const buyPage = async (key: string, price: number, cat: keyof PageStyle) => {
    if (buying) return;
    setBuying(key);
    const ok = await onBuyPageItem(key, price);
    if (ok) setLocalPage((p) => ({ ...p, [cat]: key }));
    setBuying(null);
  };

  const buyAndEquipTheme = async (key: string, price: number) => {
    if (buying) return;
    setBuying(key);
    const ok = await onBuyTheme(key, price);
    if (ok) setLocalSalon((s) => ({ ...s, theme: key }));
    setBuying(null);
  };

  const isDecoOwned = (em: string) => isDecoOwnedByUser(em, ownedDecoItems);

  const toggleDeco = async (em: string) => {
    if (em.includes("duotone")) return;
    if (localSalon.deco.includes(em)) {
      setLocalSalon((s) =>
        normalizeSalonDecoLayout(removeDecoFromLayout({ ...s, deco: s.deco.filter((d) => d !== em) }))
      );
      if (selectedDecoEm === em) setSelectedDecoEm(null);
      return;
    }
    const price = decoItemPrice(em);
    if (!isDecoOwned(em)) {
      if (buying) return;
      setBuying(em);
      const ok = await onBuyDecoItem(em, price);
      setBuying(null);
      if (!ok) return;
    }
    setLocalSalon((s) => {
      const nextDeco =
        s.deco.length >= MAX_SALON_DECOS ? [...s.deco.slice(1), em] : [...s.deco, em];
      return normalizeSalonDecoLayout({ ...s, deco: nextDeco });
    });
    setSelectedDecoEm(em);
  };

  const handleSave = async () => {
    setSaving(true);
    await onSave(localPage, normalizeSalonDecoLayout(localSalon));
    setSaving(false);
    onClose();
  };

  const patchDecoLayout = (em: string, patch: Partial<import("../../lib/profileCustomization").SalonDecoPlacement>) => {
    setLocalSalon((s) => setDecoPlacement(s, em, patch));
  };

  useEffect(() => {
    if (tab === "stickers") {
      previewColRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [tab]);

  const renderShopBtn = (
    owned: boolean,
    active: boolean,
    canBuy: boolean,
    price: number,
    key: string,
    onEquip: () => void,
    onBuy: () => void
  ) => {
    if (owned) {
      return (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onEquip();
          }}
          style={{
            padding: "6px 10px",
            borderRadius: 8,
            border: "none",
            fontWeight: 800,
            fontSize: "0.65rem",
            cursor: "pointer",
            background: active ? "rgba(167,139,250,0.35)" : "rgba(74,222,128,0.15)",
            color: active ? "#e9d5ff" : "#4ade80",
          }}
        >
          {active ? "\u2713 Actif" : "Choisir"}
        </button>
      );
    }
    return (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onBuy();
        }}
        disabled={!canBuy || buying === key}
        style={{
          padding: "6px 10px",
          borderRadius: 8,
          border: "none",
          fontWeight: 800,
          fontSize: "0.65rem",
          cursor: canBuy ? "pointer" : "not-allowed",
          background: canBuy ? "rgba(251,191,36,0.18)" : "rgba(255,255,255,0.04)",
          color: canBuy ? "#fbbf24" : "#475569",
        }}
      >
        {buying === key
          ? "\u23F3"
          : canBuy
            ? price === 0
              ? BASE_PACK_LABEL
              : `${price} j`
            : `\u{1F512} ${price === 0 ? BASE_PACK_LABEL : `${price}j`}`}
      </button>
    );
  };

  return (
    <div className="ps-root">
      <div className="ps-mesh" />
      <header className="ps-header">
        <button
          type="button"
          onClick={onClose}
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.12)",
            background: "rgba(255,255,255,0.06)",
            color: "white",
            fontSize: "1.1rem",
            cursor: "pointer",
          }}
          aria-label="Fermer"
        >
          {"\u2715"}
        </button>
        <div style={{ flex: 1, textAlign: "center" }}>
          <div
            style={{
              fontFamily: "'Fredoka One', cursive",
              fontSize: "1.15rem",
              background: "linear-gradient(90deg,#e9d5ff,#f9a8d4,#fde68a)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Studio Profil
          </div>
          <div style={{ fontSize: "0.68rem", color: "#64748b", marginTop: 2 }}>
            Design 2026  aperu en direct
          </div>
        </div>
        <div
          style={{
            padding: "8px 14px",
            borderRadius: 12,
            background: "rgba(251,191,36,0.12)",
            border: "1px solid rgba(251,191,36,0.25)",
            color: "#fbbf24",
            fontWeight: 800,
            fontSize: "0.78rem",
          }}
        >
          {"\u26A1 "}
          {jetons.toLocaleString("fr-FR")}
        </div>
      </header>

      <div className="ps-body">
        <div ref={previewColRef} className="ps-preview-col ps-no-sb">
          <p
            style={{
              fontSize: "0.62rem",
              fontWeight: 800,
              color: "#64748b",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              margin: "0 0 12px",
            }}
          >
            Aperu live
          </p>
          <StudioPreview
            pageStyle={localPage}
            salon={localSalon}
            prenom={prenom}
            couleurFamille={couleurFamille}
            avatarConfig={avatarConfig}
            editable={tab === "stickers"}
            selectedEm={selectedDecoEm}
            onSelectEm={setSelectedDecoEm}
            onLayoutPatch={patchDecoLayout}
          />
        </div>

        <div className="ps-panel">
          <div className="ps-tabs ps-no-sb">
            {(
              [
                ["salon", "\u{1F3A8} Salon"],
                ["ambiance", "\u{1F30A} Ambiance page"],
                ["stickers", "\u2728 Stickers"],
                ["texte", "\u{1F4AC} Texte"],
              ] as [Tab, string][]
            ).map(([t, label]) => (
              <button
                key={t}
                type="button"
                className={`ps-tab${tab === t ? " ps-tab--active" : ""}`}
                onClick={() => setTab(t)}
              >
                {label}
              </button>
            ))}
          </div>

          <div
            style={{
              margin: "0 0 12px",
              padding: "10px 12px",
              borderRadius: 12,
              background: "rgba(74,222,128,0.08)",
              border: "1px solid rgba(74,222,128,0.22)",
              fontSize: "0.68rem",
              color: "#94a3b8",
              lineHeight: 1.45,
            }}
          >
            <strong style={{ color: "#4ade80" }}>{`\u{1F381} ${BASE_PACK_LABEL} : `}</strong>
            {BASE_PACK_SUMMARY}
          </div>

          <div className="ps-scroll ps-no-sb">
            {tab === "salon" && (
              <div className="ps-bento">
                {Object.entries(SALON_THEMES).map(([k, t]) => {
                  const price = themeShopPrice(k);
                  const owned = isThemeOwned(k);
                  const active = localSalon.theme === k;
                  const canBuy = !owned && jetons >= price;
                  return (
                    <div
                      key={k}
                      className={`ps-card${active ? " ps-card--active" : ""}${!owned && !canBuy ? " ps-card--locked" : ""}`}
                      style={{ background: t.gradient, minHeight: 100 }}
                      onClick={() => {
                        if (owned) setLocalSalon((s) => ({ ...s, theme: k }));
                        else if (canBuy) buyAndEquipTheme(k, price);
                      }}
                    >
                      <div
                        style={{
                          padding: 12,
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          height: "100%",
                          minHeight: 100,
                        }}
                      >
                        <span
                          style={{
                            fontSize: "0.75rem",
                            fontWeight: 900,
                            color: t.dark ? "white" : "#0f172a",
                            textShadow: t.dark ? "0 1px 8px rgba(0,0,0,0.5)" : "none",
                          }}
                        >
                          {t.label}
                        </span>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontSize: "0.6rem", color: t.accent, fontWeight: 700 }}>
                            {price === 0 ? BASE_PACK_LABEL : `${price} j`}
                          </span>
                          {renderShopBtn(
                            owned,
                            active,
                            canBuy,
                            price,
                            k,
                            () => setLocalSalon((s) => ({ ...s, theme: k })),
                            () => buyAndEquipTheme(k, price)
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {tab === "ambiance" && (
              <>
                <div className="ps-chip-row">
                  {(
                    [
                      ["bg", "Fonds"],
                      ["cards", "Cartes"],
                      ["name", "Nom"],
                      ["vitrine", "Vitrine"],
                      ["avatar", "Avatar"],
                    ] as const
                  ).map(([k, l]) => (
                    <button
                      key={k}
                      type="button"
                      className={`ps-chip${pageSub === k ? " ps-chip--on" : ""}`}
                      onClick={() => setPageSub(k)}
                    >
                      {l}
                    </button>
                  ))}
                </div>
                {pageSub === "bg" && (
                  <p className="ps-bg-hint">
                    Photos libres de droit (Pexels) : ambiances, cinma, style anim. Pas de personnages
                    Disney / Marvel / anime sous copyright.
                  </p>
                )}
                {pageSub === "bg" && (
                  <div className="ps-chip-row" style={{ marginBottom: 10 }}>
                    {PAGE_BG_FILTER_CHIPS.map((chip) => (
                      <button
                        key={chip.id}
                        type="button"
                        className={`ps-chip${bgFilter === chip.id ? " ps-chip--on" : ""}`}
                        onClick={() => setBgFilter(chip.id)}
                      >
                        {chip.label}
                      </button>
                    ))}
                  </div>
                )}
                <div className="ps-bento">
                  {pageSub === "bg" &&
                    Object.entries(PAGE_BG)
                      .filter(([, it]) => pageBgMatchesFilter(it, bgFilter))
                      .map(([k, it]) => {
                      const owned = isPageOwned(k);
                      const active = localPage.pageBg === k;
                      const canBuy = !owned && jetons >= it.price;
                      const isPhoto = it.kind === "photo" && it.image;
                      return (
                        <div
                          key={k}
                          className={`ps-card${active ? " ps-card--active" : ""}${isPhoto ? " ps-card--photo" : ""}`}
                          style={{
                            background: isPhoto ? undefined : it.bg,
                            minHeight: 96,
                          }}
                          onClick={() => {
                            if (owned) setLocalPage((p) => ({ ...p, pageBg: k }));
                            else if (canBuy) buyPage(k, it.price, "pageBg");
                          }}
                        >
                          {isPhoto && (
                            <img
                              src={it.image}
                              alt=""
                              className="ps-card-photo"
                              loading="lazy"
                            />
                          )}
                          <div style={{ padding: 10, marginTop: "auto", position: "relative", zIndex: 1 }}>
                            <div
                              style={{
                                fontSize: "0.72rem",
                                fontWeight: 800,
                                color: isPhoto || it.dark ? "#fff" : "#0f172a",
                                textShadow: isPhoto ? "0 1px 4px rgba(0,0,0,0.6)" : undefined,
                              }}
                            >
                              {it.label}
                            </div>
                            {it.desc && (
                              <div
                                style={{
                                  fontSize: "0.58rem",
                                  opacity: 0.85,
                                  marginTop: 2,
                                  color: isPhoto || it.dark ? "#e2e8f0" : "#64748b",
                                  textShadow: isPhoto ? "0 1px 3px rgba(0,0,0,0.5)" : undefined,
                                }}
                              >
                                {it.desc}
                              </div>
                            )}
                            {renderShopBtn(
                              owned,
                              active,
                              canBuy,
                              it.price,
                              k,
                              () => setLocalPage((p) => ({ ...p, pageBg: k })),
                              () => buyPage(k, it.price, "pageBg")
                            )}
                          </div>
                        </div>
                      );
                    })}
                  {pageSub === "cards" &&
                    Object.entries(CARD_STYLE).map(([k, it]) => {
                      const owned = isPageOwned(k);
                      const active = localPage.cardStyle === k;
                      const canBuy = !owned && jetons >= it.price;
                      return (
                        <div
                          key={k}
                          className={`ps-card${active ? " ps-card--active" : ""}`}
                          style={{
                            background: "rgba(255,255,255,0.06)",
                            padding: 12,
                            minHeight: 88,
                          }}
                          onClick={() => {
                            if (owned) setLocalPage((p) => ({ ...p, cardStyle: k }));
                            else if (canBuy) buyPage(k, it.price, "cardStyle");
                          }}
                        >
                          <div style={{ fontWeight: 800, fontSize: "0.78rem", color: "#e2e8f0" }}>{it.label}</div>
                          <div style={{ fontSize: "0.62rem", color: "#64748b", marginTop: 4 }}>{it.desc}</div>
                          <div style={{ marginTop: 8 }}>
                            {renderShopBtn(
                              owned,
                              active,
                              canBuy,
                              it.price,
                              k,
                              () => setLocalPage((p) => ({ ...p, cardStyle: k })),
                              () => buyPage(k, it.price, "cardStyle")
                            )}
                          </div>
                        </div>
                      );
                    })}
                  {pageSub === "name" &&
                    Object.entries(NAME_EFFECT).map(([k, it]) => {
                      const owned = isPageOwned(k);
                      const active = localPage.nameEffect === k;
                      const canBuy = !owned && jetons >= it.price;
                      return (
                        <div
                          key={k}
                          className={`ps-card${active ? " ps-card--active" : ""}`}
                          style={{ background: "rgba(0,0,0,0.35)", padding: 14, minHeight: 88 }}
                          onClick={() => {
                            if (owned) setLocalPage((p) => ({ ...p, nameEffect: k }));
                            else if (canBuy) buyPage(k, it.price, "nameEffect");
                          }}
                        >
                          <span
                            style={{
                              fontFamily: "'Fredoka One', cursive",
                              fontSize: "1rem",
                              ...it.style,
                              color:
                                it.style.color ||
                                (it.style.WebkitTextFillColor ? "transparent" : "white"),
                            }}
                          >
                            {prenom}
                          </span>
                          <div style={{ marginTop: 8 }}>
                            {renderShopBtn(
                              owned,
                              active,
                              canBuy,
                              it.price,
                              k,
                              () => setLocalPage((p) => ({ ...p, nameEffect: k })),
                              () => buyPage(k, it.price, "nameEffect")
                            )}
                          </div>
                        </div>
                      );
                    })}
                  {pageSub === "avatar" &&
                    Object.entries(AVATAR_FRAME).map(([k, it]) => {
                      const owned = isPageOwned(k);
                      const active = (localPage.avatarFrame || "defaut") === k;
                      const canBuy = !owned && jetons >= it.price;
                      const preview = avatarFrameStyles(k, couleurFamille);
                      return (
                        <div
                          key={k}
                          className={`ps-card${active ? " ps-card--active" : ""}`}
                          style={{ padding: 12, minHeight: 100, textAlign: "center" }}
                          onClick={() => {
                            if (owned) setLocalPage((p) => ({ ...p, avatarFrame: k }));
                            else if (canBuy) buyPage(k, it.price, "avatarFrame");
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
                            <div style={preview.ring}>
                              <div style={preview.inner}>
                                <AvatarSVG config={avatarConfig} size={40} />
                              </div>
                            </div>
                          </div>
                          <div style={{ fontWeight: 800, fontSize: "0.78rem", color: "#e2e8f0" }}>{it.label}</div>
                          <div style={{ marginTop: 8 }}>
                            {renderShopBtn(
                              owned,
                              active,
                              canBuy,
                              it.price,
                              k,
                              () => setLocalPage((p) => ({ ...p, avatarFrame: k })),
                              () => buyPage(k, it.price, "avatarFrame")
                            )}
                          </div>
                        </div>
                      );
                    })}
                  {pageSub === "vitrine" &&
                    Object.entries(VITRINE_FRAME).map(([k, it]) => {
                      const owned = isPageOwned(k);
                      const active = localPage.vitrineFrame === k;
                      const canBuy = !owned && jetons >= it.price;
                      return (
                        <div
                          key={k}
                          className={`ps-card${active ? " ps-card--active" : ""}`}
                          style={{
                            padding: 12,
                            minHeight: 88,
                            border: it.border.replace("{c}", couleurFamille),
                            boxShadow: it.shadow.replace(/{c}/g, couleurFamille),
                            background: "rgba(100,100,150,0.12)",
                          }}
                          onClick={() => {
                            if (owned) setLocalPage((p) => ({ ...p, vitrineFrame: k }));
                            else if (canBuy) buyPage(k, it.price, "vitrineFrame");
                          }}
                        >
                          <div style={{ fontWeight: 800, fontSize: "0.78rem", color: "#e2e8f0" }}>{it.label}</div>
                          <div style={{ marginTop: 8 }}>
                            {renderShopBtn(
                              owned,
                              active,
                              canBuy,
                              it.price,
                              k,
                              () => setLocalPage((p) => ({ ...p, vitrineFrame: k })),
                              () => buyPage(k, it.price, "vitrineFrame")
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </>
            )}

            {tab === "stickers" && (
              <>
                <div className="ps-howto">
                  <p className="ps-howto-title">Comment placer tes stickers</p>
                  <ol className="ps-howto-steps">
                    <li>
                      <span>1</span> Choisis un sticker dans la grille (en bas)
                    </li>
                    <li>
                      <span>2</span> Glisse-le dans la zone colorée ci-dessous
                    </li>
                    <li>
                      <span>3</span> Ajuste la taille avec le curseur
                    </li>
                    <li>
                      <span>4</span> Clique <strong>Enregistrer</strong> en haut à droite
                    </li>
                  </ol>
                </div>

                <StickerPlacementCanvas
                  salon={localSalon}
                  prenom={prenom}
                  couleurFamille={couleurFamille}
                  avatarConfig={avatarConfig}
                  selectedEm={selectedDecoEm}
                  onSelectEm={setSelectedDecoEm}
                  onLayoutPatch={patchDecoLayout}
                />
                {selectedDecoEm && localSalon.deco.includes(selectedDecoEm) && (
                  <div className="ps-deco-size-bar">
                    <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#c4b5fd" }}>
                      Taille · {decoLabel(selectedDecoEm)}
                    </span>
                    <input
                      type="range"
                      min={Math.round(SALON_DECO_SCALE_MIN * 100)}
                      max={Math.round(SALON_DECO_SCALE_MAX * 100)}
                      value={Math.round(
                        getDecoPlacement(localSalon, selectedDecoEm, localSalon.deco.indexOf(selectedDecoEm)).scale *
                          100
                      )}
                      onChange={(e) =>
                        patchDecoLayout(selectedDecoEm, { scale: Number(e.target.value) / 100 })
                      }
                    />
                  </div>
                )}
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    flexWrap: "wrap",
                    marginBottom: 12,
                    padding: 10,
                    borderRadius: 14,
                    background: "rgba(167,139,250,0.08)",
                    border: "1px dashed rgba(167,139,250,0.25)",
                  }}
                >
                  {localSalon.deco.length === 0 ? (
                    <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                      {`Aucun sticker \u2014 choisis-en ci-dessous (max ${MAX_SALON_DECOS}, payants en jetons)`}
                    </span>
                  ) : (
                    localSalon.deco.map((em) => (
                      <div key={em} style={{ position: "relative" }}>
                        <button
                          type="button"
                          onClick={() => setSelectedDecoEm(em)}
                          title="Sélectionner pour déplacer"
                          style={{
                            width: 52,
                            height: 52,
                            borderRadius: 12,
                            border:
                              selectedDecoEm === em
                                ? "2px solid rgba(251,191,36,0.9)"
                                : "1px solid rgba(167,139,250,0.35)",
                            background:
                              selectedDecoEm === em
                                ? "rgba(251,191,36,0.12)"
                                : "rgba(15,23,42,0.5)",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <SalonDecoSticker em={em} fontSize="1.5rem" accentColor={couleurFamille} />
                        </button>
                        <button
                          type="button"
                          onClick={() => void toggleDeco(em)}
                          title="Retirer"
                          style={{
                            position: "absolute",
                            top: -6,
                            right: -6,
                            width: 20,
                            height: 20,
                            borderRadius: "50%",
                            border: "none",
                            background: "#ef4444",
                            color: "#fff",
                            fontSize: "0.65rem",
                            fontWeight: 900,
                            cursor: "pointer",
                            lineHeight: 1,
                          }}
                        >
                          {"\u00d7"}
                        </button>
                      </div>
                    ))
                  )}
                </div>
                <div className="ps-chip-row">
                  {DECO_CATS.map((cat) => (
                    <button
                      key={cat.key}
                      type="button"
                      className={`ps-chip${decoCat === cat.key ? " ps-chip--on" : ""}`}
                      onClick={() => setDecoCat(cat.key)}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
                <div className="ps-deco-grid">
                  {(DECO_CATS.find((c) => c.key === decoCat)?.items || []).map((em) => {
                    const on = localSalon.deco.includes(em);
                    const price = decoItemPrice(em);
                    const owned = isDecoOwned(em);
                    const canBuy = !owned && jetons >= price;
                    return (
                      <button
                        key={em}
                        type="button"
                        className={`ps-deco-tile${on ? " ps-deco-tile--on" : ""}`}
                        disabled={buying === em}
                        onClick={() => void toggleDeco(em)}
                      >
                        <SalonDecoSticker em={em} fontSize="1.6rem" accentColor={couleurFamille} />
                        <span
                          style={{
                            fontSize: "0.5rem",
                            color: on ? "#c084fc" : "#94a3b8",
                            maxWidth: "100%",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {decoLabel(em)}
                        </span>
                        <span
                          style={{
                            fontSize: "0.48rem",
                            fontWeight: 800,
                            color: owned ? "#4ade80" : canBuy ? "#fbbf24" : "#64748b",
                          }}
                        >
                          {buying === em
                            ? "..."
                            : owned
                              ? on
                                ? "\u2713 Pose"
                                : "Debloque"
                              : `${price} j`}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {tab === "texte" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={{ fontSize: "0.7rem", color: "#94a3b8", fontWeight: 700, display: "block", marginBottom: 8 }}>
                    Nom du salon
                  </label>
                  <input
                    className="ps-input"
                    value={localSalon.titre}
                    maxLength={30}
                    placeholder={`Le Salon de ${prenom}`}
                    onChange={(e) => setLocalSalon((s) => ({ ...s, titre: e.target.value }))}
                  />
                  <div style={{ fontSize: "0.6rem", color: "#475569", textAlign: "right", marginTop: 4 }}>
                    {localSalon.titre.length}/30
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: "0.7rem", color: "#94a3b8", fontWeight: 700, display: "block", marginBottom: 8 }}>
                    Devise / bio
                  </label>
                  <textarea
                    className="ps-input"
                    value={localSalon.motto}
                    maxLength={70}
                    rows={3}
                    placeholder='Ex : "STMG jusqu\u2019au bout \u2728"'
                    onChange={(e) => setLocalSalon((s) => ({ ...s, motto: e.target.value }))}
                    style={{ resize: "none" }}
                  />
                  <div style={{ fontSize: "0.6rem", color: "#475569", textAlign: "right", marginTop: 4 }}>
                    {localSalon.motto.length}/70
                  </div>
                </div>
              </div>
            )}
          </div>

          <footer className="ps-footer">
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "14px 20px",
                borderRadius: 14,
                border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.05)",
                color: "#94a3b8",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Annuler
            </button>
            <button type="button" className="ps-save" onClick={handleSave} disabled={saving}>
              {saving ? "Enregistrement\u2026" : "\u2728 Appliquer mon style"}
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
}
