// @ts-nocheck
import { useState, useEffect, useMemo } from "react";
import { db, auth } from "../services/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { COLLECTIONS } from "../services/collectionsData";

const getCollectionMatiere = (collection) => collection.matiere || "SDGN";
const getCollectionTheme = (collection) => collection.theme || "Sans thème";
const PRESTIGE_XP_RATIO = 10;
const SPECIAL_COLLECTION_IDS = new Set(["special_drop1"]);

const isSpecialCollection = (collection) => SPECIAL_COLLECTION_IDS.has(collection?.id);
const getNonSpecialCollections = (collections = []) => collections.filter((collection) => !isSpecialCollection(collection));

const RARETE_CONFIG = {
  commune:     { label: "Commune",     couleur: "#9CA3AF", bg: "#F3F4F6", emoji: "⚪", bonus: 0 },
  peu_commune: { label: "Peu Commune", couleur: "#10B981", bg: "#ECFDF5", emoji: "🟢", bonus: 0 },
  rare:        { label: "Rare",        couleur: "#3B82F6", bg: "#EFF6FF", emoji: "🔵", bonus: 0.5 },
  epique:      { label: "Épique",      couleur: "#0284C7", bg: "#ECFEFF", emoji: "🔷", bonus: 1 },
  legendaire:  { label: "Légendaire",  couleur: "#F59E0B", bg: "#FFFBEB", emoji: "⭐", bonus: 2 },
  ultra_rare:  { label: "Ultra Rare",  couleur: "#EF4444", bg: "#FEF2F2", emoji: "💎", bonus: 3 },
};

const PACKS = [
  {
    id: "basique", nom: "Pack Basique", emoji: "🎴", cout: 20, nbCartes: 3,
    couleur: "#6B7280", gradient: "linear-gradient(135deg, #6B7280, #374151)",
    description: "3 cartes • 80% communes • 20% peu communes",
    prob: { commune: 0.79, peu_commune: 0.20, rare: 0, epique: 0, legendaire: 0, ultra_rare: 0.01 }
  },
  {
    id: "avance", nom: "Pack Avancé", emoji: "✨", cout: 55, nbCartes: 3,
    couleur: "#3B82F6", gradient: "linear-gradient(135deg, #3B82F6, #1D4ED8)",
    description: "3 cartes • Chance d'obtenir des rares !",
    prob: { commune: 0.59, peu_commune: 0.30, rare: 0.10, epique: 0, legendaire: 0, ultra_rare: 0.01 }
  },
  {
    id: "legendaire", nom: "Pack Légendaire", emoji: "👑", cout: 140, nbCartes: 3,
    couleur: "#F59E0B", gradient: "linear-gradient(135deg, #F59E0B, #B45309)",
    description: "3 cartes • Épiques et légendaires possibles !",
    prob: { commune: 0.39, peu_commune: 0.40, rare: 0.15, epique: 0.04, legendaire: 0.01, ultra_rare: 0.01 }
  },
  {
    id: "mystere", nom: "Pack Mystère 🎲", emoji: "🎲", cout: 0, nbCartes: 3,
    couleur: "#EC4899", gradient: "linear-gradient(135deg, #EC4899, #9D174D)",
    description: "Gratuit • 1 fois par semaine • Probabilités inconnues !",
    prob: { commune: 0.40, peu_commune: 0.30, rare: 0.18, epique: 0.08, legendaire: 0.03, ultra_rare: 0.01 }
  },
];

const getPacksForCollection = (collection) => {
  if (isSpecialCollection(collection)) return [];
  return PACKS.filter((p) => p.id !== "mystere");
};

const tirerCarte = (pack, collection) => {
  const rand = Math.random();
  let cumul = 0;
  let rareteChoisie = "commune";
  for (const [rarete, prob] of Object.entries(pack.prob)) {
    cumul += prob;
    if (rand < cumul) { rareteChoisie = rarete; break; }
  }
  const dispo = collection.cartes.filter(c => c.rarete === rareteChoisie);
  if (dispo.length === 0) return collection.cartes[Math.floor(Math.random() * collection.cartes.length)];
  return dispo[Math.floor(Math.random() * dispo.length)];
};

const getDebutSemaine = () => {
  const now = new Date();
  const jour = now.getDay();
  const diff = now.getDate() - jour + (jour === 0 ? -6 : 1);
  const lundi = new Date(now.setDate(diff));
  return `${lundi.getFullYear()}-${lundi.getMonth()}-${lundi.getDate()}`;
};

const getAujourdhui = () => {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
};

const getPrestigeTotal = (data = {}) => (Number(data.prestigeBase) || 0) + (Number(data.prestige) || 0);

// ===== VISIONNEUSE =====
const Visionneuse = ({ carte, cartesPossedees, indexDansPossedees, onFermer, onPrecedent, onSuivant }) => {
  const config = RARETE_CONFIG[carte.rarete] || RARETE_CONFIG.commune;

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowLeft") onPrecedent();
      if (e.key === "ArrowRight") onSuivant();
      if (e.key === "Escape") onFermer();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [indexDansPossedees, onFermer, onPrecedent, onSuivant]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div onClick={onFermer} style={{
      position: "fixed", inset: 0, zIndex: 3000,
      background: "rgba(0,0,0,0.95)",
      display: "flex", alignItems: "flex-start", justifyContent: "center",
      padding: "20px", overflowY: "auto",
    }}>
      <div onClick={e => e.stopPropagation()}
        style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", maxWidth: "380px", width: "100%", paddingBottom: "20px" }}>
        <p style={{ color: "#9CA3AF", fontFamily: "'Fredoka One', cursive", fontSize: "0.9rem", margin: 0 }}>
          {indexDansPossedees + 1} / {cartesPossedees.length}
        </p>
        <div style={{ width: "100%", borderRadius: "20px", overflow: "hidden", border: `4px solid ${config.couleur}`, boxShadow: `0 0 60px ${config.couleur}80` }}>
          <img src={carte.image} alt={carte.nom} style={{ width: "100%", display: "block" }} />
        </div>
        <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "8px" }}>
          <p style={{ fontFamily: "'Fredoka One', cursive", color: "white", fontSize: "1.3rem", margin: 0 }}>{carte.nom}</p>
          <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
            <span style={{ background: config.couleur, color: "white", fontFamily: "'Fredoka One', cursive", padding: "6px 18px", borderRadius: "100px", fontSize: "0.85rem" }}>
              {config.emoji} {config.label}
            </span>
            {config.bonus > 0 && (
              <span style={{ background: "#FEF3C7", color: "#D97706", fontFamily: "'Fredoka One', cursive", padding: "6px 18px", borderRadius: "100px", fontSize: "0.85rem" }}>
                ⭐ +{config.bonus} pt participation
              </span>
            )}
          </div>
        </div>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <button onClick={onPrecedent} style={{ background: "rgba(255,255,255,0.1)", color: "white", border: "2px solid rgba(255,255,255,0.2)", fontFamily: "'Fredoka One', cursive", fontSize: "1.1rem", padding: "12px 24px", borderRadius: "14px", cursor: "pointer" }}>← Préc.</button>
          <button onClick={onFermer} style={{ background: "rgba(239,68,68,0.2)", color: "#EF4444", border: "2px solid rgba(239,68,68,0.4)", fontFamily: "'Fredoka One', cursive", fontSize: "1rem", padding: "12px 20px", borderRadius: "14px", cursor: "pointer" }}>✕</button>
          <button onClick={onSuivant} style={{ background: "rgba(255,255,255,0.1)", color: "white", border: "2px solid rgba(255,255,255,0.2)", fontFamily: "'Fredoka One', cursive", fontSize: "1.1rem", padding: "12px 24px", borderRadius: "14px", cursor: "pointer" }}>Suiv. →</button>
        </div>
        <p style={{ color: "#4B5563", fontSize: "0.75rem", margin: 0 }}>← → pour naviguer • Échap pour fermer</p>
      </div>
    </div>
  );
};

// ===== CARTE MINIATURE =====
const CarteMini = ({ carte, onClick }) => {
  const config = RARETE_CONFIG[carte.rarete] || RARETE_CONFIG.commune;
  const [hovered, setHovered] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        width: "100px", borderRadius: "12px", overflow: "hidden",
        border: `3px solid ${hovered ? config.couleur : config.couleur + "60"}`,
        boxShadow: hovered ? `0 8px 25px ${config.couleur}60` : `0 2px 8px ${config.couleur}20`,
        cursor: "pointer", flexShrink: 0, background: "white",
        transform: hovered ? "translateY(-4px) scale(1.04)" : "none",
        transition: "all 0.2s ease",
      }}>
      <img src={carte.image} alt={carte.nom} style={{ width: "100%", aspectRatio: "2/3", objectFit: "cover", display: "block" }} />
      <div style={{ padding: "4px 6px", background: `linear-gradient(${config.couleur}15, ${config.couleur}05)`, borderTop: `1px solid ${config.couleur}20` }}>
        <p style={{ fontSize: "0.5rem", fontWeight: "700", color: "#1A1A2E", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{carte.nom}</p>
        <p style={{ fontSize: "0.48rem", color: config.couleur, margin: "1px 0 0", fontWeight: "600" }}>
          {config.emoji} {config.label}{config.bonus > 0 && ` +${config.bonus}pt`}
        </p>
      </div>
    </div>
  );
};

// ===== ANIMATION OUVERTURE =====
const AnimationOuverture = ({ cartes, onTermine }) => {
  const [etape, setEtape] = useState("intro");
  const [retournees, setRetournees] = useState([false, false, false]);
  useEffect(() => { setTimeout(() => setEtape("reveal"), 800); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const retourner = (i) => { if (retournees[i]) return; const n = [...retournees]; n[i] = true; setRetournees(n); };
  const toutesRetournees = retournees.every(Boolean);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 2000, background: "radial-gradient(ellipse at center, #0B2447 0%, #020617 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "32px" }}>
      <div style={{ textAlign: "center" }}>
        <p style={{ fontFamily: "'Fredoka One', cursive", fontSize: "2rem", color: "white", margin: 0, opacity: etape === "intro" ? 0 : 1, transition: "opacity 0.5s" }}>✨ Tes nouvelles cartes !</p>
        {!toutesRetournees && <p style={{ color: "#9CA3AF", fontSize: "0.9rem", margin: "8px 0 0", opacity: etape === "intro" ? 0 : 1, transition: "opacity 0.5s 0.3s" }}>Clique sur chaque carte pour la révéler</p>}
      </div>
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", justifyContent: "center" }}>
        {cartes.map((carte, i) => {
          const config = RARETE_CONFIG[carte.rarete] || RARETE_CONFIG.commune;
          const est = retournees[i];
          return (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
              <div onClick={() => retourner(i)} style={{ width: "140px", cursor: est ? "default" : "pointer", transform: etape === "intro" ? "translateY(40px)" : "translateY(0)", opacity: etape === "intro" ? 0 : 1, transition: `all 0.5s ease ${i * 0.15}s` }}>
                {!est ? (
                  <div style={{ width: "100%", aspectRatio: "2/3", background: "linear-gradient(135deg, #0B2447, #0284C7, #0B2447)", borderRadius: "16px", border: "3px solid #0EA5E9", boxShadow: "0 0 30px #0EA5E980", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "8px" }}>
                    <span style={{ fontSize: "2.5rem" }}>🃏</span>
                    <p style={{ color: "#BAE6FD", fontFamily: "'Fredoka One', cursive", fontSize: "0.8rem", margin: 0 }}>Clique !</p>
                  </div>
                ) : (
                  <div style={{ borderRadius: "16px", overflow: "hidden", border: `3px solid ${config.couleur}`, boxShadow: `0 0 40px ${config.couleur}80` }}>
                    <img src={carte.image} alt={carte.nom} style={{ width: "100%", display: "block" }} />
                  </div>
                )}
              </div>
              {est && (
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontFamily: "'Fredoka One', cursive", color: config.couleur, fontSize: "0.85rem", margin: 0 }}>{config.emoji} {carte.nom}</p>
                  {config.bonus > 0 && <p style={{ color: "#F59E0B", fontSize: "0.75rem", margin: "2px 0 0" }}>+{config.bonus} pt participation ⭐</p>}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: "12px", opacity: etape === "intro" ? 0 : 1, transition: "opacity 0.5s 0.5s" }}>
        {!toutesRetournees && <button onClick={() => setRetournees([true, true, true])} style={{ background: "rgba(14,165,233,0.25)", color: "#BAE6FD", border: "2px solid #0EA5E9", fontFamily: "'Fredoka One', cursive", fontSize: "1rem", padding: "12px 28px", borderRadius: "14px", cursor: "pointer" }}>Tout révéler →</button>}
        {toutesRetournees && <button onClick={onTermine} style={{ background: "linear-gradient(135deg, #10B981, #059669)", color: "white", border: "none", fontFamily: "'Fredoka One', cursive", fontSize: "1.1rem", padding: "14px 36px", borderRadius: "16px", cursor: "pointer", boxShadow: "0 4px 20px #10B98160" }}>🎉 Voir ma collection !</button>}
      </div>
    </div>
  );
};

// ===== RECAP REGLES =====
const RecapRegles = () => {
  const [ouvert, setOuvert] = useState(false);
  return (
    <div style={{ background: "white", borderRadius: "20px", marginBottom: "20px", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
      <div onClick={() => setOuvert(!ouvert)} style={{ padding: "16px 24px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", background: "linear-gradient(135deg, #0B2447, #0369A1)" }}>
        <p style={{ fontFamily: "'Fredoka One', cursive", color: "white", fontSize: "1.1rem", margin: 0 }}>📖 Comment ça marche ?</p>
        <span style={{ color: "#BAE6FD", fontSize: "1.2rem" }}>{ouvert ? "▲" : "▼"}</span>
      </div>
      {ouvert && (
        <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: "12px" }}>
          {[
            { emoji: "⚡", titre: "Gagne de l'XP", texte: "Complète des chapitres et des missions pour gagner de l'XP.", couleur: "#3B82F6" },
            { emoji: "🎴", titre: "Ouvre des packs", texte: "Utilise ton XP pour ouvrir des packs et obtenir des cartes.", couleur: "#0284C7" },
            { emoji: "🎲", titre: "Pack Mystère gratuit", texte: "Un pack mystère GRATUIT est disponible chaque semaine ! Probabilités inconnues...", couleur: "#EC4899" },
            { emoji: "🎁", titre: "Carte du lundi", texte: "Chaque lundi matin une carte aléatoire t'est offerte gratuitement !", couleur: "#10B981" },
            { emoji: "⭐", titre: "Bonus participation", texte: "Les cartes Rares et + te donnent des points de participation bonus en cours !", couleur: "#F59E0B" },
            { emoji: "♻️", titre: "Recycle tes doublons", texte: "Tu as des doublons ? Recycle-les contre 10 XP chacun !", couleur: "#10B981" },
            { emoji: "🏆", titre: "Complète les drops", texte: "Complète un drop à 100% pour gagner 500 XP bonus !", couleur: "#EF4444" },
            { emoji: "⚪🟢🔵🟣⭐💎", titre: "Raretés", texte: "Commune • Peu Commune • Rare +0.5pt • Épique +1pt • Légendaire +2pts • Ultra Rare +3pts", couleur: "#9CA3AF" },
          ].map((r, i) => (
            <div key={i} style={{ display: "flex", gap: "14px", alignItems: "flex-start", padding: "12px 16px", borderRadius: "14px", background: r.couleur + "08", border: `1px solid ${r.couleur}20` }}>
              <span style={{ fontSize: "1.4rem", flexShrink: 0 }}>{r.emoji}</span>
              <div>
                <p style={{ fontFamily: "'Fredoka One', cursive", color: r.couleur, fontSize: "0.95rem", margin: "0 0 2px" }}>{r.titre}</p>
                <p style={{ color: "#6B7280", fontSize: "0.82rem", margin: 0 }}>{r.texte}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ===== COMPOSANT PRINCIPAL =====
export default function Cartes({ profil, onXPGagne }) {
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

  useEffect(() => {
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
    const estLundi = now.getDay() === 1;
    setCarteJourDispo(estLundi && (data.derniereCarteJour || "") !== today);
  };

  const afficherMessage = (texte, type = "success") => {
    setMessage({ texte, type });
    setTimeout(() => setMessage(null), 3500);
  };

  const ouvrirPack = async (pack, collection) => {
    if (isSpecialCollection(collection)) {
      afficherMessage("Le drop 1STMG2 est terminé.", "error");
      return;
    }
    if (pack.id !== "mystere" && (profil?.xp || 0) < pack.cout) {
      afficherMessage(`Il te faut ${pack.cout} XP pour ce pack !`, "error");
      return;
    }
    if (pack.id === "mystere" && !packMystereDisponible) {
      afficherMessage("Ton pack mystère a déjà été ouvert cette semaine !", "error");
      return;
    }
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
      const updates = {
        cartes,
        xp: (data.xp || 0) - pack.cout,
        xpDepensee: nouvelleXpDepensee,
        prestige: prestigeActuel + Math.max(0, gainPrestige),
      };
      if (!hasPrestigeBase) updates.prestigeBase = prestigeBase;
      if (pack.id === "mystere") {
        updates.dernierPackMystere = getDebutSemaine();
        setPackMystereDisponible(false);
      }

      const dropComplete = collection.cartes.every(c => (cartes[c.id] || 0) > 0);
      const dropAvantOuverture = collection.cartes.every(c => (data.cartes?.[c.id] || 0) > 0);
      if (dropComplete && !dropAvantOuverture) {
        updates.xp = (updates.xp || 0) + 500;
        afficherMessage(`🏆 Drop complet ! +500 XP bonus !`);
      }

      await updateDoc(doc(db, "users", auth.currentUser.uid), updates);
      setMaCollection(cartes);
      setCartesAnimation(nouvelles);
      if (gainPrestige > 0) {
        afficherMessage(`✨ +${gainPrestige} prestige (grace a ${pack.cout} XP depenses)`);
      }
      if (onXPGagne) onXPGagne();
    } catch (err) {
      afficherMessage("Erreur lors de l'ouverture du pack.", "error");
    }
    setChargement(false);
  };

  const recevoirCarteJour = async () => {
    if (!carteJourDispo) return;
    try {
      const snap = await getDoc(doc(db, "users", auth.currentUser.uid));
      const data = snap.data();
      const toutesCartes = getNonSpecialCollections(COLLECTIONS).flatMap(c => c.cartes);
      if (!toutesCartes.length) {
        afficherMessage("Aucune carte disponible pour la carte du lundi.", "error");
        return;
      }
      const carte = toutesCartes[Math.floor(Math.random() * toutesCartes.length)];
      const cartes = { ...(data.cartes || {}) };
      cartes[carte.id] = (cartes[carte.id] || 0) + 1;
      await updateDoc(doc(db, "users", auth.currentUser.uid), { cartes, derniereCarteJour: getAujourdhui() });
      setMaCollection(cartes);
      setCarteJourDispo(false);
      setCartesAnimation([carte]);
      if (onXPGagne) onXPGagne();
    } catch (err) {
      afficherMessage("Erreur.", "error");
    }
  };

  const recyclerDoublon = async (carte) => {
    try {
      const snap = await getDoc(doc(db, "users", auth.currentUser.uid));
      const data = snap.data();
      const cartes = { ...(data.cartes || {}) };
      if ((cartes[carte.id] || 0) <= 1) return;
      cartes[carte.id] -= 1;
      await updateDoc(doc(db, "users", auth.currentUser.uid), { xp: (data.xp || 0) + 10, cartes });
      setMaCollection(cartes);
      afficherMessage("♻️ Carte recyclée ! +10 XP");
      if (onXPGagne) onXPGagne();
    } catch (err) {
      afficherMessage("Erreur lors du recyclage.", "error");
    }
  };

  const totalCartes = Object.values(maCollection).reduce((a, b) => a + b, 0);
  const totalUniques = COLLECTIONS.flatMap(c => c.cartes).filter(c => maCollection[c.id] > 0).length;
  const totalDispo = COLLECTIONS.flatMap(c => c.cartes).length;
  const bonusTotal = COLLECTIONS.flatMap(c => c.cartes).filter(c => maCollection[c.id] > 0).reduce((sum, c) => sum + (RARETE_CONFIG[c.rarete]?.bonus || 0), 0);
  const progGlobal = Math.round((totalUniques / totalDispo) * 100);

  const matieresDisponibles = useMemo(
    () => ["Toutes", ...Array.from(new Set(COLLECTIONS.map(c => getCollectionMatiere(c))))],
    []
  );
  const collectionsParMatiere = useMemo(
    () => COLLECTIONS.filter(c => matiereSelectionnee === "Toutes" || getCollectionMatiere(c) === matiereSelectionnee),
    [matiereSelectionnee]
  );
  const themesDisponibles = useMemo(
    () => ["Tous", ...Array.from(new Set(collectionsParMatiere.map(c => getCollectionTheme(c))))],
    [collectionsParMatiere]
  );
  const collectionsFiltrees = useMemo(
    () => COLLECTIONS.filter(c =>
      (matiereSelectionnee === "Toutes" || getCollectionMatiere(c) === matiereSelectionnee) &&
      (themeSelectionne === "Tous" || getCollectionTheme(c) === themeSelectionne)
    ),
    [matiereSelectionnee, themeSelectionne]
  );
  const collectionsFiltreesBoutique = useMemo(
    () => getNonSpecialCollections(collectionsFiltrees),
    [collectionsFiltrees]
  );

  useEffect(() => {
    if (!themesDisponibles.includes(themeSelectionne)) {
      setThemeSelectionne("Tous");
    }
  }, [matiereSelectionnee, themeSelectionne, themesDisponibles]);

  return (
    <div style={{ minHeight: "100vh", background: "#F1F5F9", fontFamily: "'Nunito', sans-serif" }}>

      {visionneuse && (() => {
        const col = visionneuse.collection;
        const cartesPossedees = col.cartes.filter(c => maCollection[c.id] > 0);
        const idx = visionneuse.indexDansPossedees;
        return (
          <Visionneuse
            carte={cartesPossedees[idx]}
            cartesPossedees={cartesPossedees}
            indexDansPossedees={idx}
            onFermer={() => setVisionneuse(null)}
            onPrecedent={() => setVisionneuse({ ...visionneuse, indexDansPossedees: (idx - 1 + cartesPossedees.length) % cartesPossedees.length })}
            onSuivant={() => setVisionneuse({ ...visionneuse, indexDansPossedees: (idx + 1) % cartesPossedees.length })}
          />
        );
      })()}

      {cartesAnimation && (
        <AnimationOuverture cartes={cartesAnimation} onTermine={() => { setCartesAnimation(null); setOnglet("collection"); }} />
      )}

      {message && (
        <div style={{ position: "fixed", top: "80px", right: "24px", zIndex: 100, background: message.type === "error" ? "linear-gradient(135deg, #EF4444, #DC2626)" : "linear-gradient(135deg, #10B981, #059669)", color: "white", fontFamily: "'Fredoka One', cursive", padding: "14px 28px", borderRadius: "16px", boxShadow: "0 8px 25px rgba(0,0,0,0.3)" }}>{message.texte}</div>
      )}

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "24px 16px" }}>

        <div style={{ background: "linear-gradient(135deg, #0B2447, #0369A1)", borderRadius: "24px", padding: "28px 32px", marginBottom: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", marginBottom: "20px" }}>
            <div>
              <h1 style={{ fontFamily: "'Fredoka One', cursive", fontSize: "2.2rem", color: "white", margin: "0 0 4px" }}>🃏 Mes Cartes</h1>
              <p style={{ color: "#BAE6FD", margin: 0, fontSize: "0.9rem" }}>Collectionne, révise, progresse !</p>
            </div>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <div style={{ background: "#F59E0B30", border: "1px solid #F59E0B50", borderRadius: "14px", padding: "8px 18px", fontFamily: "'Fredoka One', cursive", color: "white", fontSize: "0.95rem" }}>
                🔥 {streak} jour{streak > 1 ? "s" : ""} de streak
              </div>
              {[
                { label: `${totalCartes} cartes`, bg: "#0284C7", emoji: "🃏" },
                { label: `+${bonusTotal.toFixed(1)} pts`, bg: "#F59E0B", emoji: "⭐" },
                { label: `${profil?.xp || 0} XP`, bg: "#3B82F6", emoji: "⚡" },
                { label: `${getPrestigeTotal(profil)} prestige`, bg: "#A855F7", emoji: "👑" },
              ].map((stat, i) => (
                <div key={i} style={{ background: stat.bg + "30", border: `1px solid ${stat.bg}50`, borderRadius: "14px", padding: "8px 18px", fontFamily: "'Fredoka One', cursive", color: "white", fontSize: "0.95rem" }}>{stat.emoji} {stat.label}</div>
              ))}
            </div>
          </div>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <p style={{ color: "#BAE6FD", fontSize: "0.85rem", margin: 0, fontFamily: "'Fredoka One', cursive" }}>📊 Collection globale</p>
              <p style={{ color: "white", fontSize: "0.85rem", margin: 0, fontFamily: "'Fredoka One', cursive" }}>{totalUniques} / {totalDispo} cartes — {progGlobal}%</p>
            </div>
            <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: "100px", height: "10px" }}>
              <div style={{ height: "100%", borderRadius: "100px", background: "linear-gradient(90deg, #38BDF8, #0284C7)", width: `${progGlobal}%`, transition: "width 0.5s ease" }} />
            </div>
          </div>
        </div>

        {carteJourDispo && (
          <div style={{ background: "linear-gradient(135deg, #10B981, #059669)", borderRadius: "20px", padding: "20px 24px", marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <p style={{ fontFamily: "'Fredoka One', cursive", color: "white", fontSize: "1.2rem", margin: 0 }}>🎁 Carte du lundi disponible !</p>
              <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.85rem", margin: "4px 0 0" }}>Une carte gratuite t'attend chaque lundi !</p>
            </div>
            <button onClick={recevoirCarteJour} style={{ background: "white", color: "#10B981", border: "none", fontFamily: "'Fredoka One', cursive", fontSize: "1rem", padding: "12px 24px", borderRadius: "14px", cursor: "pointer" }}>
              🎁 Récupérer !
            </button>
          </div>
        )}

        {packMystereDisponible && (
          <div style={{ background: "linear-gradient(135deg, #EC4899, #9D174D)", borderRadius: "20px", padding: "20px 24px", marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <p style={{ fontFamily: "'Fredoka One', cursive", color: "white", fontSize: "1.2rem", margin: 0 }}>🎲 Pack Mystère disponible !</p>
              <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.85rem", margin: "4px 0 0" }}>Ton pack gratuit de la semaine t'attend — probabilités inconnues !</p>
            </div>
            <button
              onClick={() => {
                const baseFiltre = collectionsFiltreesBoutique.length ? collectionsFiltreesBoutique : getNonSpecialCollections(COLLECTIONS);
                if (!baseFiltre.length) {
                  afficherMessage("Le drop 1STMG2 est terminé.", "error");
                  return;
                }
                ouvrirPack(PACKS[3], baseFiltre[Math.floor(Math.random() * baseFiltre.length)]);
              }}
              style={{ background: "white", color: "#EC4899", border: "none", fontFamily: "'Fredoka One', cursive", fontSize: "1rem", padding: "12px 24px", borderRadius: "14px", cursor: "pointer" }}
            >
              🎲 Ouvrir !
            </button>
          </div>
        )}

        <RecapRegles />

        <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
          {[{ id: "boutique", label: "🛒 Boutique Packs" }, { id: "collection", label: "📚 Ma Collection" }].map(t => (
            <button key={t.id} onClick={() => setOnglet(t.id)} style={{
              background: onglet === t.id ? "linear-gradient(135deg, #0EA5E9, #0369A1)" : "white",
              color: onglet === t.id ? "white" : "#0284C7",
              border: onglet === t.id ? "none" : "2px solid #0284C7",
              fontFamily: "'Fredoka One', cursive", fontSize: "1rem",
              padding: "12px 28px", borderRadius: "14px", cursor: "pointer",
              boxShadow: onglet === t.id ? "0 4px 15px #0284C750" : "none",
              transition: "all 0.2s",
            }}>{t.label}</button>
          ))}
        </div>

        <div style={{ background: "white", borderRadius: "16px", border: "2px solid #E5E7EB", padding: "14px", marginBottom: "20px" }}>
          <p style={{ fontFamily: "'Fredoka One', cursive", color: "#111827", fontSize: "0.9rem", margin: "0 0 10px" }}>
            Filtres des drops
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <div style={{ borderRadius: "12px", border: "2px solid #0EA5E930", padding: "10px 12px" }}>
              <p style={{ fontFamily: "'Fredoka One', cursive", color: "#0284C7", fontSize: "0.78rem", margin: "0 0 6px" }}>
                Matière
              </p>
              <select
                value={matiereSelectionnee}
                onChange={(e) => setMatiereSelectionnee(e.target.value)}
                style={{
                  width: "100%",
                  border: "2px solid #0EA5E935",
                  borderRadius: "10px",
                  padding: "8px 10px",
                  fontFamily: "'Nunito', sans-serif",
                  fontWeight: 700,
                  color: "#1F2937",
                  background: "white",
                }}
              >
                {matieresDisponibles.map((matiere) => (
                  <option key={matiere} value={matiere}>{matiere}</option>
                ))}
              </select>
            </div>

            <div style={{ borderRadius: "12px", border: "2px solid #3B82F630", padding: "10px 12px" }}>
              <p style={{ fontFamily: "'Fredoka One', cursive", color: "#3B82F6", fontSize: "0.78rem", margin: "0 0 6px" }}>
                Thème
              </p>
              <select
                value={themeSelectionne}
                onChange={(e) => setThemeSelectionne(e.target.value)}
                style={{
                  width: "100%",
                  border: "2px solid #3B82F635",
                  borderRadius: "10px",
                  padding: "8px 10px",
                  fontFamily: "'Nunito', sans-serif",
                  fontWeight: 700,
                  color: "#1F2937",
                  background: "white",
                }}
              >
                {themesDisponibles.map((theme) => (
                  <option key={theme} value={theme}>{theme}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {onglet === "boutique" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {collectionsFiltreesBoutique.length === 0 && (
              <div style={{ textAlign: "center", padding: "50px 20px", background: "white", borderRadius: "20px", color: "#9CA3AF", fontFamily: "'Fredoka One', cursive" }}>
                Aucun drop disponible avec ces filtres.
              </div>
            )}
            {collectionsFiltreesBoutique.map(col => {
              const obtenues = col.cartes.filter(c => maCollection[c.id] > 0).length;
              return (
                <div key={col.id} style={{ background: "white", borderRadius: "24px", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
                  <div style={{ background: col.gradient || "linear-gradient(135deg, #0B2447, #0369A1)", padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
                    <div>
                      <p style={{ fontFamily: "'Fredoka One', cursive", color: "white", fontSize: "1.3rem", margin: 0 }}>{col.emoji || "🃏"} {col.nom}</p>
                      <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.82rem", margin: "2px 0 0" }}>
                        {getCollectionMatiere(col)} · {getCollectionTheme(col)} · {col.description || ""}
                      </p>
                    </div>
                    <span style={{ background: "rgba(255,255,255,0.2)", color: "white", fontFamily: "'Fredoka One', cursive", padding: "6px 16px", borderRadius: "100px", fontSize: "0.85rem" }}>
                      {obtenues}/{col.cartes.length} obtenues
                    </span>
                  </div>
                  <div style={{ padding: "20px 24px", display: "flex", gap: "14px", flexWrap: "wrap" }}>
                    {getPacksForCollection(col).map(pack => {
                      const peutOuvrir = (profil?.xp || 0) >= pack.cout;
                      return (
                        <div key={pack.id} style={{ flex: 1, minWidth: "150px", background: peutOuvrir ? "#FAFAFA" : "#F9FAFB", border: `2px solid ${peutOuvrir ? pack.couleur + "40" : "#E5E7EB"}`, borderRadius: "18px", padding: "18px 16px", textAlign: "center" }}>
                          <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: peutOuvrir ? pack.gradient : "#E5E7EB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.8rem", margin: "0 auto 10px", boxShadow: peutOuvrir ? `0 4px 15px ${pack.couleur}40` : "none" }}>{pack.emoji}</div>
                          <p style={{ fontFamily: "'Fredoka One', cursive", color: peutOuvrir ? pack.couleur : "#9CA3AF", margin: "0 0 4px", fontSize: "1rem" }}>{pack.nom}</p>
                          <p style={{ fontSize: "0.68rem", color: "#9CA3AF", margin: "0 0 14px", lineHeight: 1.4 }}>{pack.description}</p>
                          <button onClick={() => ouvrirPack(pack, col)} disabled={!peutOuvrir || chargement}
                            style={{ width: "100%", background: peutOuvrir ? pack.gradient : "#E5E7EB", color: peutOuvrir ? "white" : "#9CA3AF", border: "none", fontFamily: "'Fredoka One', cursive", fontSize: "1rem", padding: "11px", borderRadius: "12px", cursor: peutOuvrir ? "pointer" : "not-allowed", boxShadow: peutOuvrir ? `0 4px 12px ${pack.couleur}40` : "none" }}>
                            {chargement ? "⏳" : `${pack.emoji} ${pack.cout} XP`}
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

        {onglet === "collection" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {collectionsFiltrees.length === 0 && (
              <div style={{ textAlign: "center", padding: "50px 20px", background: "white", borderRadius: "20px", color: "#9CA3AF", fontFamily: "'Fredoka One', cursive" }}>
                Aucune collection avec ces filtres.
              </div>
            )}
            {collectionsFiltrees.map(col => {
              const cartesPossedees = col.cartes.filter(c => maCollection[c.id] > 0);
              const prog = Math.round((cartesPossedees.length / col.cartes.length) * 100);
              const ouverte = collectionOuverte === col.id;
              const statsRarete = Object.entries(RARETE_CONFIG).map(([key, cfg]) => ({ key, ...cfg, count: cartesPossedees.filter(c => c.rarete === key).length })).filter(s => s.count > 0);

              return (
                <div key={col.id} style={{ background: "white", borderRadius: "24px", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
                  <div onClick={() => setCollectionOuverte(ouverte ? null : col.id)}
                    style={{ background: ouverte ? (col.gradient || "linear-gradient(135deg, #0B2447, #0369A1)") : "white", padding: "20px 24px", cursor: "pointer", borderBottom: ouverte ? "none" : "1px solid #F3F4F6", transition: "all 0.3s" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                        <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: ouverte ? "rgba(255,255,255,0.2)" : (col.couleur || "#0284C7") + "15", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.6rem" }}>{col.emoji || "🃏"}</div>
                        <div>
                          <p style={{ fontFamily: "'Fredoka One', cursive", color: ouverte ? "white" : (col.couleur || "#0284C7"), fontSize: "1.2rem", margin: 0 }}>{col.nom}</p>
                          <p style={{ color: ouverte ? "rgba(255,255,255,0.7)" : "#9CA3AF", fontSize: "0.8rem", margin: "2px 0 0" }}>
                            {getCollectionMatiere(col)} · {getCollectionTheme(col)} · {cartesPossedees.length} / {col.cartes.length} cartes
                          </p>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                        {prog === 100 && <span style={{ fontSize: "1.4rem" }}>🏆</span>}
                        <div style={{ background: ouverte ? "rgba(255,255,255,0.2)" : (col.couleur || "#0284C7") + "15", borderRadius: "100px", padding: "6px 16px", fontFamily: "'Fredoka One', cursive", color: ouverte ? "white" : (col.couleur || "#0284C7"), fontSize: "0.9rem" }}>{prog}%</div>
                        <span style={{ color: ouverte ? "white" : (col.couleur || "#0284C7"), fontSize: "1.2rem" }}>{ouverte ? "▲" : "▼"}</span>
                      </div>
                    </div>
                    <div style={{ marginTop: "14px", background: ouverte ? "rgba(255,255,255,0.2)" : "#E5E7EB", borderRadius: "100px", height: "6px" }}>
                      <div style={{ height: "100%", borderRadius: "100px", background: ouverte ? "white" : (col.gradient || "linear-gradient(135deg, #0EA5E9, #0369A1)"), width: `${prog}%`, transition: "width 0.5s ease" }} />
                    </div>
                  </div>

                  {ouverte && (
                    <div style={{ padding: "24px" }}>
                      {statsRarete.length > 0 && (
                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "20px" }}>
                          {statsRarete.map(s => (
                            <span key={s.key} style={{ background: s.couleur + "15", color: s.couleur, border: `1px solid ${s.couleur}30`, fontFamily: "'Fredoka One', cursive", padding: "4px 12px", borderRadius: "100px", fontSize: "0.8rem" }}>
                              {s.emoji} {s.count} {s.label}{s.count > 1 ? "s" : ""}
                            </span>
                          ))}
                        </div>
                      )}
                      {cartesPossedees.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "48px 20px", background: "#F8FAFC", borderRadius: "16px", border: "2px dashed #E2E8F0" }}>
                          <p style={{ fontSize: "2.5rem", margin: "0 0 12px" }}>🎴</p>
                          <p style={{ fontFamily: "'Fredoka One', cursive", color: "#94A3B8", fontSize: "1.1rem", margin: 0 }}>Aucune carte encore !</p>
                          <p style={{ color: "#CBD5E1", fontSize: "0.85rem", margin: "6px 0 0" }}>Ouvre des packs dans la boutique pour démarrer ta collection.</p>
                        </div>
                      ) : (
                        <>
                          <p style={{ color: "#94A3B8", fontSize: "0.8rem", margin: "0 0 14px" }}>💡 Clique pour agrandir • ♻️ Les doublons peuvent être recyclés contre 10 XP</p>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                            {cartesPossedees.map((carte, idx) => {
                              const nb = maCollection[carte.id] || 0;
                              return (
                                <div key={carte.id} style={{ position: "relative" }}>
                                  <CarteMini carte={carte} onClick={() => setVisionneuse({ collection: col, indexDansPossedees: idx })} />
                                  {nb > 1 && (
                                    <>
                                      <div style={{ position: "absolute", top: "-6px", right: "-6px", background: "#0284C7", color: "white", borderRadius: "100px", width: "22px", height: "22px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6rem", fontWeight: "700", boxShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>x{nb}</div>
                                      <button onClick={(e) => { e.stopPropagation(); recyclerDoublon(carte); }} title="Recycler contre 10 XP"
                                        style={{ position: "absolute", bottom: "28px", right: "-6px", background: "#10B981", color: "white", border: "none", borderRadius: "100px", width: "22px", height: "22px", fontSize: "0.7rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>♻</button>
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