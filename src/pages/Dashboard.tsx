// @ts-nocheck
import { useState } from "react";
import { auth, db } from "../services/firebase";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import {
  getPrestigePourNiveau,
  getPrestigeTotal,
  PRESTIGE_PAR_NIVEAU,
} from "../services/userProfileService";
import { formatJetons } from "../lib/jetons";

const motivations = {
  Architecte: "Chaque grand projet commence par un plan. Tu es celui qui transforme le chaos en stratégie. Continue à construire.",
  Visionnaire: "Les plus grandes révolutions ont commencé dans la tête d'un seul individu. Cette tête, c'est la tienne.",
  Challenger: "Tu ne joues pas pour participer. Tu joues pour gagner. Chaque jeton gagné est une victoire de plus.",
  Explorateur: "La connaissance est la seule richesse qu'on ne peut pas te voler. Continue à explorer.",
  Influenceur: "Ton énergie est contagieuse. Les grands leaders ne naissent pas, ils se forment. Tu es en train de te former.",
};

const emojis = {
  Architecte: "🧠",
  Visionnaire: "🎨",
  Challenger: "⚡",
  Explorateur: "🔬",
  Influenceur: "🔥",
};

const matieres = [
  { nom: "Management", emoji: "🏢", couleur: "blue" },
  { nom: "Économie", emoji: "📈", couleur: "green" },
  { nom: "Droit", emoji: "⚖️", couleur: "purple" },
  { nom: "Sciences de Gestion", emoji: "💻", couleur: "yellow" },
  { nom: "Marketing", emoji: "🎯", couleur: "red" },
  { nom: "Ressources Humaines", emoji: "👥", couleur: "pink" },
  { nom: "Gestion Finance", emoji: "💰", couleur: "orange" },
];

const getTodayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
};

export default function Dashboard({ profil }) {
  const [nouvelEvenement, setNouvelEvenement] = useState("");
  const [dateEvenement, setDateEvenement] = useState("");
  const [ajoutVisible, setAjoutVisible] = useState(false);

  const xpWallet = profil.xp || 0;
  const prestigeClassement = getPrestigeTotal(profil);
  const prestigeNiveau = getPrestigePourNiveau(profil);
  const niveau = Math.floor(prestigeNiveau / PRESTIGE_PAR_NIVEAU) + 1;
  const palierBas = (niveau - 1) * PRESTIGE_PAR_NIVEAU;
  const palierHaut = niveau * PRESTIGE_PAR_NIVEAU;
  const progression =
    palierHaut > palierBas ? ((prestigeNiveau - palierBas) / (palierHaut - palierBas)) * 100 : 0;
  const pointsVersPalier = Math.max(0, palierHaut - prestigeNiveau);
  const todayKey = getTodayKey();
  const hasConnectedToday = profil?.lastConnectionDay === todayKey;
  const hasFocusToday = Boolean(
    Object.values(profil?.focusProgress?.claims || {}).find((c) => c?.lastClaimDate === todayKey)
  );
  const hasMissionToday = Boolean(
    Object.values(profil?.missionsHistorique || {}).find((h) => h?.date === todayKey)
  );
  const dailyDoneCount = [hasConnectedToday, hasFocusToday, hasMissionToday].filter(Boolean).length;
  const dailyProgress = Math.round((dailyDoneCount / 3) * 100);

  const ajouterEvenement = async () => {
    if (!nouvelEvenement || !dateEvenement) return;
    const user = auth.currentUser;
    await updateDoc(doc(db, "users", user.uid), {
      evenements: arrayUnion({ titre: nouvelEvenement, date: dateEvenement }),
    });
    setNouvelEvenement("");
    setDateEvenement("");
    setAjoutVisible(false);
  };

  return (
    <div className="min-h-screen p-4" style={{ background: "linear-gradient(180deg, #F8FAFF 0%, #F1F5F9 100%)", color: "#0F172A" }}>

      {/* HEADER */}
      <div className="max-w-4xl mx-auto">

        {/* IDENTITE */}
        <div className="rounded-2xl p-6 mb-4 border border-slate-200 shadow-sm bg-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-4xl">{emojis[profil.famille]}</span>
                <div>
                  <h1 className="text-2xl font-bold">{profil.prenom}</h1>
                  <p className="font-semibold" style={{ color: "#0369A1" }}>{profil.famille}</p>
                  <p className="text-slate-500 text-sm">
                    {profil.classe === "premiere" ? "Première STMG" : "Terminale STMG"}
                    {profil.lycee ? ` — ${profil.lycee}` : ""}
                  </p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-slate-500 text-sm">Niveau</p>
              <p className="text-3xl font-bold" style={{ color: "#F59E0B" }}>{niveau}</p>
              <p className="text-slate-500 text-sm">👑 {prestigeClassement.toLocaleString()} prestige</p>
              <p className="text-slate-400 text-xs mt-0.5">{formatJetons(xpWallet)} en poche (boutique)</p>
            </div>
          </div>

          {/* Barre : niveau = prestige ; sans pack, progression ≈ jetons gagnés / 10 */}
          <div className="mt-4">
            <p className="text-slate-400 text-xs mb-1 text-center">Progression (prestige — même logique que le classement)</p>
            <div className="flex justify-between text-sm text-slate-500 mb-1">
              <span>{palierBas.toLocaleString()} pts</span>
              <span>{palierHaut.toLocaleString()} pts</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div
                className="h-3 rounded-full transition-all"
                style={{ background: "linear-gradient(90deg, #A855F7, #7C3AED)", width: `${progression}%` }}
              />
            </div>
            <p className="text-slate-500 text-sm mt-1 text-center">
              Encore {pointsVersPalier} pt{pointsVersPalier === 1 ? "" : "s"} pour le niveau {niveau + 1}
            </p>
          </div>
          {(() => {
            const g = profil?.lastPrestigeGift as { fromPrenom?: string; amount?: number } | undefined;
            if (!g?.fromPrenom || !g?.amount) return null;
            return (
              <p className="text-center text-sm mt-3 py-2 px-3 rounded-xl border border-violet-200 bg-violet-50 text-violet-900">
                {"\u{1F451} "}
                <strong>{g.fromPrenom}</strong>
                {" t'a offert "}
                {g.amount}
                {" point"}
                {g.amount > 1 ? "s" : ""}
                {" de prestige !"}
              </p>
            );
          })()}
        </div>

        {/* MESSAGE MOTIVATION */}
        <div className="rounded-2xl p-4 mb-4 border" style={{ background: "linear-gradient(135deg, #EFF6FF, #ECFEFF)", borderColor: "#BFDBFE" }}>
          <p className="text-center italic" style={{ color: "#0F172A" }}>
            💬 "{motivations[profil.famille]}"
          </p>
        </div>

        {/* ENGAGEMENT QUOTIDIEN */}
        <div className="rounded-2xl p-4 mb-4 border border-slate-200 shadow-sm bg-white">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-bold">🔥 Routine quotidienne</h2>
            <span className="text-sm font-semibold" style={{ color: dailyDoneCount === 3 ? "#16A34A" : "#0284C7" }}>
              {dailyDoneCount}/3
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2.5 mb-3">
            <div
              className="h-2.5 rounded-full transition-all"
              style={{ width: `${dailyProgress}%`, background: "linear-gradient(90deg, #22C55E, #16A34A)" }}
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center bg-slate-50 border border-slate-200 rounded-lg p-2.5">
              <span className="text-sm text-slate-700">Connexion du jour</span>
              <span>{hasConnectedToday ? "✅" : "⬜"}</span>
            </div>
            <div className="flex justify-between items-center bg-slate-50 border border-slate-200 rounded-lg p-2.5">
              <span className="text-sm text-slate-700">1 activité Focus validée</span>
              <span>{hasFocusToday ? "✅" : "⬜"}</span>
            </div>
            <div className="flex justify-between items-center bg-slate-50 border border-slate-200 rounded-lg p-2.5">
              <span className="text-sm text-slate-700">1 mission soumise</span>
              <span>{hasMissionToday ? "✅" : "⬜"}</span>
            </div>
          </div>
          <p className="text-xs mt-3" style={{ color: "#64748B" }}>
            Objectif: compléter le 3/3 chaque jour pour ancrer les révisions.
          </p>
        </div>

        {/* GRILLE PRINCIPALE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

          {/* CLASSEMENT */}
          <div className="rounded-2xl p-4 border border-slate-200 shadow-sm bg-white">
            <h2 className="text-lg font-bold mb-3">🏆 Classement National</h2>
            <div className="space-y-2">
              <div className="flex justify-between items-center bg-slate-50 border border-slate-200 rounded-lg p-3">
                <span className="text-slate-600">👤 Ta position</span>
                <span className="font-bold" style={{ color: "#D97706" }}>— ème</span>
              </div>
              <div className="flex justify-between items-center bg-slate-50 border border-slate-200 rounded-lg p-3">
                <span className="text-slate-600">🏫 Ton lycée</span>
                <span className="font-bold" style={{ color: "#0284C7" }}>— ème</span>
              </div>
              <div className="flex justify-between items-center bg-slate-50 border border-slate-200 rounded-lg p-3">
                <span className="text-slate-600">{emojis[profil.famille]} Famille {profil.famille}</span>
                <span className="font-bold" style={{ color: "#16A34A" }}>— ème</span>
              </div>
            </div>
          </div>

          {/* MISSION ACTIVE */}
          <div className="rounded-2xl p-4 border border-slate-200 shadow-sm bg-white">
            <h2 className="text-lg font-bold mb-3">🎯 Mission de la semaine</h2>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-center">
              <p className="text-slate-500 text-sm">Aucune mission active pour l'instant</p>
              <p className="text-slate-400 text-xs mt-1">Les missions arrivent bientôt !</p>
            </div>
          </div>
        </div>

        {/* PROGRESSION MATIERES */}
        <div className="rounded-2xl p-4 mb-4 border border-slate-200 shadow-sm bg-white">
          <h2 className="text-lg font-bold mb-3">📚 Mes Matières</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {matieres.map((matiere) => (
              <div key={matiere.nom} className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
                <div className="text-2xl mb-1">{matiere.emoji}</div>
                <p className="text-xs text-slate-700 font-semibold">{matiere.nom}</p>
                <p className="text-xs text-slate-400 mt-1">0% complété</p>
              </div>
            ))}
          </div>
        </div>

        {/* BADGES RECENTS */}
        <div className="rounded-2xl p-4 mb-4 border border-slate-200 shadow-sm bg-white">
          <h2 className="text-lg font-bold mb-3">🏅 Badges Récents</h2>
          <div className="flex gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-center flex-1">
                <div className="text-3xl mb-1">🔒</div>
                <p className="text-xs text-slate-400">À débloquer</p>
              </div>
            ))}
          </div>
        </div>

        {/* CALENDRIER EVALUATIONS */}
        <div className="rounded-2xl p-4 mb-4 border border-slate-200 shadow-sm bg-white">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold">📅 Mes Évaluations</h2>
            <button
              onClick={() => setAjoutVisible(!ajoutVisible)}
              className="text-white text-sm px-3 py-1 rounded-lg"
              style={{ background: "linear-gradient(135deg, #0EA5E9, #2563EB)" }}
            >
              + Ajouter
            </button>
          </div>

          {ajoutVisible && (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 mb-3 space-y-2">
              <input
                type="text"
                placeholder="Nom de l'évaluation (ex: Contrôle Management)"
                value={nouvelEvenement}
                onChange={(e) => setNouvelEvenement(e.target.value)}
                className="w-full bg-white border border-slate-300 text-slate-800 p-2 rounded-lg text-sm outline-none"
              />
              <input
                type="date"
                value={dateEvenement}
                onChange={(e) => setDateEvenement(e.target.value)}
                className="w-full bg-white border border-slate-300 text-slate-800 p-2 rounded-lg text-sm outline-none"
              />
              <button
                onClick={ajouterEvenement}
                className="w-full text-white text-sm p-2 rounded-lg"
                style={{ background: "linear-gradient(135deg, #0EA5E9, #2563EB)" }}
              >
                Enregistrer
              </button>
            </div>
          )}

          {profil.evenements && profil.evenements.length > 0 ? (
            <div className="space-y-2">
              {profil.evenements
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .map((ev, index) => (
                  <div key={index} className="flex justify-between items-center bg-slate-50 border border-slate-200 rounded-lg p-3">
                    <span className="text-slate-700 text-sm">{ev.titre}</span>
                    <span className="text-sm font-semibold" style={{ color: "#0369A1" }}>
                      {new Date(ev.date).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-slate-400 text-sm text-center">Aucune évaluation planifiée</p>
          )}
        </div>

        {/* DECONNEXION */}
        <button
          onClick={() => auth.signOut()}
          className="w-full text-white font-bold p-3 rounded-xl mb-4 shadow-sm"
          style={{ background: "linear-gradient(135deg, #ef4444, #b91c1c)" }}
        >
          Se déconnecter
        </button>

      </div>
    </div>
  );
}