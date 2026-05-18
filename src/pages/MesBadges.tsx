import { useState, useEffect } from "react";
import { db } from "../services/firebase";
import { collection, getDocs } from "firebase/firestore";
import { formatJetons } from "../lib/jetons";
import { getXpTotalePourNiveau } from "../services/userProfileService";

const rareteColors = {
  "Commun": "#9ca3af",
  "Peu commun": "#4ade80",
  "Rare": "#60a5fa",
  "Épique": "#0ea5e9",
  "Légendaire": "#fbbf24",
};

const rareteOrder = ["Commun", "Peu commun", "Rare", "Épique", "Légendaire"];

const verifierCondition = (badge, profil) => {
  const jetonsCumules = getXpTotalePourNiveau(profil);
  const chapitres = (profil.chapitresCompletes || []).length;
  const missions = (profil.missionsCompletes || []).length;
  const connexions = profil.connexions_consecutives || 0;

  switch (badge.condition_type) {
    case "xp": return jetonsCumules >= badge.condition_valeur;
    case "chapitres": return chapitres >= badge.condition_valeur;
    case "missions": return missions >= badge.condition_valeur;
    case "connexions": return connexions >= badge.condition_valeur;
    case "classement": return false; // Phase 8
    default: return false;
  }
};

const getConditionTexte = (badge) => {
  switch (badge.condition_type) {
    case "xp": return `Atteindre ${badge.condition_valeur} jetons cumulés (boutique comprise)`;
    case "chapitres": return `Compléter ${badge.condition_valeur} chapitre${badge.condition_valeur > 1 ? "s" : ""}`;
    case "missions": return `Compléter ${badge.condition_valeur} mission${badge.condition_valeur > 1 ? "s" : ""}`;
    case "connexions": return `Se connecter ${badge.condition_valeur} jours de suite`;
    case "classement": return `Être dans le top ${badge.condition_valeur} national`;
    default: return badge.description;
  }
};

export default function MesBadges({ profil }) {
  const [badges, setBadges] = useState([]);
  const [badgeSelectionne, setBadgeSelectionne] = useState(null);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    const chargerBadges = async () => {
      const snapshot = await getDocs(collection(db, "badges"));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBadges(data);
      setChargement(false);
    };
    chargerBadges();
  }, []);

  const universes = [...new Set(badges.map(b => b.univers))];
  const totalDebloques = badges.filter(b => verifierCondition(b, profil)).length;

  if (chargement) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(180deg, #F8FAFF 0%, #F1F5F9 100%)" }}>
        <p style={{ color: "#334155", fontFamily: "'Fredoka One', cursive" }}>Chargement des badges...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4" style={{ background: "linear-gradient(180deg, #F8FAFF 0%, #F1F5F9 100%)", color: "#0f172a" }}>
      <div className="max-w-4xl mx-auto">

        <div className="mb-6">
          <h1 className="text-3xl font-bold" style={{ fontFamily: "'Fredoka One', cursive" }}>🏅 Mes Badges</h1>
          <p className="mt-1" style={{ color: "#64748b" }}>{totalDebloques} / {badges.length} badges débloqués</p>
          <div className="w-full rounded-full h-2 mt-2" style={{ background: "#e2e8f0" }}>
            <div
              className="h-2 rounded-full transition-all"
              style={{ background: "linear-gradient(90deg, #f59e0b, #f97316)", width: badges.length > 0 ? `${(totalDebloques / badges.length) * 100}%` : "0%" }}
            />
          </div>
        </div>

        {universes.map((univers) => {
          const badgesUnivers = badges
            .filter(b => b.univers === univers)
            .sort((a, b) => rareteOrder.indexOf(a.rarete) - rareteOrder.indexOf(b.rarete));

          const debloquesUnivers = badgesUnivers.filter(b => verifierCondition(b, profil)).length;

          return (
            <div key={univers} className="rounded-xl p-5 mb-6 border border-slate-200 shadow-sm bg-white">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold" style={{ fontFamily: "'Fredoka One', cursive" }}>🐾 Univers {univers}</h2>
                <span className="text-sm" style={{ color: "#64748b" }}>{debloquesUnivers} / {badgesUnivers.length}</span>
              </div>

              <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                {badgesUnivers.map((badge) => {
                  const debloque = verifierCondition(badge, profil);
                  return (
                    <div
                      key={badge.id}
                      onClick={() => setBadgeSelectionne(badge)}
                      className="cursor-pointer text-center p-3 rounded-xl transition-all"
                      style={{ background: "#f8fafc" }}
                    >
                      <div className="relative w-16 h-16 mx-auto mb-2">
                        <img
                          src={badge.image_url}
                          alt={badge.nom}
                          className="w-16 h-16 object-contain"
                          style={{ filter: debloque ? "none" : "grayscale(100%) brightness(25%)" }}
                        />
                        {!debloque && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xl">🔒</span>
                          </div>
                        )}
                      </div>
                      <p className="text-xs font-bold leading-tight" style={{ color: debloque ? rareteColors[badge.rarete] : "#4b5563" }}>
                        {badge.nom}
                      </p>
                      <p className="text-xs mt-1" style={{ color: debloque ? "#64748b" : "#94a3b8" }}>
                        {badge.rarete}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {badgeSelectionne && (
          <div
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            style={{ background: "rgba(2, 6, 23, 0.76)" }}
            onClick={() => setBadgeSelectionne(null)}
          >
            <div
              className="rounded-2xl p-6 max-w-sm w-full text-center border border-slate-200"
              style={{ background: "#ffffff" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-24 h-24 mx-auto mb-4">
                <img
                  src={badgeSelectionne.image_url}
                  alt={badgeSelectionne.nom}
                  className="w-24 h-24 object-contain"
                  style={{ filter: verifierCondition(badgeSelectionne, profil) ? "none" : "grayscale(100%) brightness(25%)" }}
                />
                {!verifierCondition(badgeSelectionne, profil) && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl">🔒</span>
                  </div>
                )}
              </div>

              <h3 className="text-xl font-bold mb-1" style={{ color: "#0f172a" }}>{badgeSelectionne.nom}</h3>
              <p className="text-sm font-semibold mb-1" style={{ color: rareteColors[badgeSelectionne.rarete] }}>
                {badgeSelectionne.rarete}
              </p>
              <p className="text-sm mb-4" style={{ color: "#64748b" }}>Univers {badgeSelectionne.univers}</p>

              {verifierCondition(badgeSelectionne, profil) ? (
                <div className="rounded-lg p-3" style={{ background: "#dcfce7" }}>
                  <p className="font-bold" style={{ color: "#15803d" }}>✅ Badge débloqué !</p>
                </div>
              ) : (
                <div className="rounded-lg p-3 border border-slate-200" style={{ background: "#f8fafc" }}>
                  <p className="text-sm mb-1" style={{ color: "#64748b" }}>🎯 Pour débloquer :</p>
                  <p className="font-semibold" style={{ color: "#0f172a" }}>{getConditionTexte(badgeSelectionne)}</p>
                  {badgeSelectionne.condition_type === "xp" && (
                    <p className="text-sm mt-2" style={{ color: "#d97706" }}>
                      Tu as cumulé {formatJetons(getXpTotalePourNiveau(profil))} — encore{" "}
                      {formatJetons(Math.max(0, badgeSelectionne.condition_valeur - getXpTotalePourNiveau(profil)))} !
                    </p>
                  )}
                  {badgeSelectionne.condition_type === "chapitres" && (
                    <p className="text-sm mt-2" style={{ color: "#0369a1" }}>
                      Tu as complété {(profil.chapitresCompletes || []).length} chapitres — encore {badgeSelectionne.condition_valeur - (profil.chapitresCompletes || []).length} !
                    </p>
                  )}
                  {badgeSelectionne.condition_type === "missions" && (
                    <p className="text-sm mt-2" style={{ color: "#0284c7" }}>
                      Tu as complété {(profil.missionsCompletes || []).length} missions — encore {badgeSelectionne.condition_valeur - (profil.missionsCompletes || []).length} !
                    </p>
                  )}
                  {badgeSelectionne.condition_type === "connexions" && (
                    <p className="text-orange-400 text-sm mt-2">
                      Tu as {profil.connexions_consecutives || 0} jours de suite — encore {badgeSelectionne.condition_valeur - (profil.connexions_consecutives || 0)} !
                    </p>
                  )}
                </div>
              )}

              <button
                onClick={() => setBadgeSelectionne(null)}
                className="mt-4 text-white px-6 py-2 rounded-lg"
                style={{ background: "linear-gradient(135deg, #0ea5e9, #2563eb)" }}
              >
                Fermer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}