import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

const rareteColors = {
  "Commun": "#9ca3af",
  "Peu commun": "#4ade80",
  "Rare": "#60a5fa",
  "Épique": "#c084fc",
  "Légendaire": "#fbbf24",
};

const rareteOrder = ["Commun", "Peu commun", "Rare", "Épique", "Légendaire"];

const verifierCondition = (badge, profil) => {
  const xp = profil.xp || 0;
  const chapitres = (profil.chapitresCompletes || []).length;
  const missions = (profil.missionsCompletes || []).length;
  const connexions = profil.connexions_consecutives || 0;

  switch (badge.condition_type) {
    case "xp": return xp >= badge.condition_valeur;
    case "chapitres": return chapitres >= badge.condition_valeur;
    case "missions": return missions >= badge.condition_valeur;
    case "connexions": return connexions >= badge.condition_valeur;
    case "classement": return false; // Phase 8
    default: return false;
  }
};

const getConditionTexte = (badge) => {
  switch (badge.condition_type) {
    case "xp": return `Atteindre ${badge.condition_valeur} XP`;
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
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-white">Chargement des badges...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-4xl mx-auto">

        <div className="mb-6">
          <h1 className="text-3xl font-bold">🏅 Mes Badges</h1>
          <p className="text-gray-400 mt-1">{totalDebloques} / {badges.length} badges débloqués</p>
          <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
            <div
              className="bg-yellow-400 h-2 rounded-full transition-all"
              style={{ width: badges.length > 0 ? `${(totalDebloques / badges.length) * 100}%` : "0%" }}
            />
          </div>
        </div>

        {universes.map((univers) => {
          const badgesUnivers = badges
            .filter(b => b.univers === univers)
            .sort((a, b) => rareteOrder.indexOf(a.rarete) - rareteOrder.indexOf(b.rarete));

          const debloquesUnivers = badgesUnivers.filter(b => verifierCondition(b, profil)).length;

          return (
            <div key={univers} className="bg-gray-800 rounded-xl p-5 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">🐾 Univers {univers}</h2>
                <span className="text-gray-400 text-sm">{debloquesUnivers} / {badgesUnivers.length}</span>
              </div>

              <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                {badgesUnivers.map((badge) => {
                  const debloque = verifierCondition(badge, profil);
                  return (
                    <div
                      key={badge.id}
                      onClick={() => setBadgeSelectionne(badge)}
                      className="cursor-pointer text-center p-3 rounded-xl transition-all hover:bg-gray-700"
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
                      <p className="text-xs mt-1" style={{ color: debloque ? "#6b7280" : "#374151" }}>
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
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
            onClick={() => setBadgeSelectionne(null)}
          >
            <div
              className="bg-gray-800 rounded-2xl p-6 max-w-sm w-full text-center"
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

              <h3 className="text-xl font-bold mb-1">{badgeSelectionne.nom}</h3>
              <p className="text-sm font-semibold mb-1" style={{ color: rareteColors[badgeSelectionne.rarete] }}>
                {badgeSelectionne.rarete}
              </p>
              <p className="text-gray-400 text-sm mb-4">Univers {badgeSelectionne.univers}</p>

              {verifierCondition(badgeSelectionne, profil) ? (
                <div className="bg-green-900 rounded-lg p-3">
                  <p className="text-green-400 font-bold">✅ Badge débloqué !</p>
                </div>
              ) : (
                <div className="bg-gray-700 rounded-lg p-3">
                  <p className="text-gray-400 text-sm mb-1">🎯 Pour débloquer :</p>
                  <p className="text-white font-semibold">{getConditionTexte(badgeSelectionne)}</p>
                  {badgeSelectionne.condition_type === "xp" && (
                    <p className="text-yellow-400 text-sm mt-2">
                      Tu as {profil.xp || 0} XP — encore {badgeSelectionne.condition_valeur - (profil.xp || 0)} XP !
                    </p>
                  )}
                  {badgeSelectionne.condition_type === "chapitres" && (
                    <p className="text-blue-400 text-sm mt-2">
                      Tu as complété {(profil.chapitresCompletes || []).length} chapitres — encore {badgeSelectionne.condition_valeur - (profil.chapitresCompletes || []).length} !
                    </p>
                  )}
                  {badgeSelectionne.condition_type === "missions" && (
                    <p className="text-purple-400 text-sm mt-2">
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
                className="mt-4 bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg"
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