import { useState, useEffect } from "react";
import { auth, db } from "../services/firebase";
import { collection, query, where, getDocs, orderBy, doc, getDoc, updateDoc } from "firebase/firestore";

const matieres = [
  { nom: "Management", emoji: "🏢" },
  { nom: "Sciences de Gestion", emoji: "💻" },
  { nom: "Économie", emoji: "📈" },
  { nom: "Droit", emoji: "⚖️" },
  { nom: "Marketing", emoji: "🎯" },
  { nom: "Ressources Humaines", emoji: "👥" },
  { nom: "Gestion Finance", emoji: "💰" },
];

export default function Chapitres({ profil, onXPGagne }) {
  const XP_PAR_ACTION = { application: 12, fiche: 8 };
  const [matiereSelectionnee, setMatiereSelectionnee] = useState("Management");
  const [classeSelectionnee, setClasseSelectionnee] = useState(profil.classe);
  const [chapitres, setChapitres] = useState([]);
  const [chargement, setChargement] = useState(false);
  const [chapitreOuvert, setChapitreOuvert] = useState(null);
  const [notifXP, setNotifXP] = useState(null);
  const peutChoisirClasse = profil.role === "admin" || profil.classe === "terminale";

  useEffect(() => {
    const chargerChapitres = async () => {
      setChargement(true);
      setChapitreOuvert(null);
      try {
        const q = query(
          collection(db, "chapitres"),
          where("matiere", "==", matiereSelectionnee),
          where("classe", "==", classeSelectionnee),
          orderBy("ordre")
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setChapitres(data);
      } catch (err) {
        console.error(err);
      }
      setChargement(false);
    };
    chargerChapitres();
  }, [matiereSelectionnee, classeSelectionnee]);

  const ouvrirAppEtGagnerXP = async (url, actionType) => {
    if (!url) return;
    window.open(url, "_blank");

    try {
      const user = auth.currentUser;
      if (!user) return;
      const xpGain = XP_PAR_ACTION[actionType] || 5;
      const userRef = doc(db, "users", user.uid);
      const snap = await getDoc(userRef);
      if (!snap.exists()) return;
      const data = snap.data();
      await updateDoc(userRef, { xp: (data.xp || 0) + xpGain });
      setNotifXP(`⚡ +${xpGain} XP gagnés !`);
      if (onXPGagne) onXPGagne();
      setTimeout(() => setNotifXP(null), 2200);
    } catch (err) {
      console.error(err);
      setNotifXP("❌ Ressource ouverte, mais XP non attribués.");
      setTimeout(() => setNotifXP(null), 2200);
    }
  };

  return (
    <div className="min-h-screen p-4" style={{ background: "linear-gradient(180deg, #F8FAFF 0%, #F1F5F9 100%)", color: "#0f172a" }}>
      {notifXP && (
        <div className="fixed top-20 right-6 z-50 bg-amber-500 text-white font-bold px-5 py-3 rounded-xl shadow-xl">
          {notifXP}
        </div>
      )}
      <div className="max-w-4xl mx-auto">

        <div className="mb-6">
          <h1 className="text-3xl font-bold" style={{ fontFamily: "'Fredoka One', cursive" }}>📚 Mes Chapitres</h1>
        </div>

        {/* SÉLECTEUR DE CLASSE — admin + terminale (révisions première) */}
        {peutChoisirClasse && (
          <div className="flex gap-3 mb-4">
            <button
              onClick={() => setClasseSelectionnee("premiere")}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${classeSelectionnee === "premiere" ? "bg-green-600 text-white" : "bg-white border border-slate-300 text-slate-600 hover:bg-slate-100"}`}
            >
              📗 Première STMG
            </button>
            <button
              onClick={() => setClasseSelectionnee("terminale")}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${classeSelectionnee === "terminale" ? "bg-blue-600 text-white" : "bg-white border border-slate-300 text-slate-600 hover:bg-slate-100"}`}
            >
              📘 Terminale STMG
            </button>
          </div>
        )}

        {/* ONGLETS MATIÈRES */}
        <div className="flex flex-wrap gap-2 mb-6">
          {matieres.map((matiere) => (
            <button
              key={matiere.nom}
              onClick={() => setMatiereSelectionnee(matiere.nom)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${matiereSelectionnee === matiere.nom ? "bg-blue-600 text-white" : "bg-white border border-slate-300 text-slate-600 hover:bg-slate-100"}`}
            >
              {matiere.emoji} {matiere.nom}
            </button>
          ))}
        </div>

        {/* LISTE CHAPITRES */}
        {chargement ? (
          <p className="text-center text-slate-500 py-8">Chargement...</p>
        ) : chapitres.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center shadow-sm">
            <p className="text-4xl mb-3">🔒</p>
            <p className="text-slate-500">Aucun chapitre disponible pour l'instant</p>
            <p className="text-slate-400 text-sm mt-1">Le contenu arrive bientôt !</p>
          </div>
        ) : (
          <div className="space-y-3">
            {chapitres.map((chapitre) => {
              const estOuvert = chapitreOuvert === chapitre.id;
              return (
                <div key={chapitre.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">

                  {/* EN-TÊTE CLIQUABLE */}
                  <div
                    className="p-5 cursor-pointer hover:bg-slate-50 transition-all"
                    onClick={() => setChapitreOuvert(estOuvert ? null : chapitre.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-bold whitespace-nowrap">
                          Chap. {chapitre.ordre}
                        </span>
                        <span className="text-yellow-400 text-xs font-semibold">+{chapitre.xp} XP</span>
                      </div>
                      <span className="text-slate-400 text-lg">{estOuvert ? "▲" : "▼"}</span>
                    </div>
                    <h3 className="text-slate-900 font-bold text-lg mt-2">{chapitre.titre}</h3>
                    {chapitre.theme && (
                      <p className="text-cyan-700 text-xs mt-1 font-semibold">{chapitre.theme}</p>
                    )}
                  </div>

                  {/* DÉTAIL — visible si ouvert */}
                  {estOuvert && (
                    <div className="px-5 pb-5 border-t border-slate-200 pt-4">

                      {/* Question de gestion */}
                      {chapitre.question && (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                          <p className="text-yellow-400 text-xs font-bold mb-1">❓ Question de gestion</p>
                          <p className="text-slate-900 text-sm italic">{chapitre.question}</p>
                        </div>
                      )}

                      {/* Notions */}
                      {chapitre.notions && chapitre.notions.length > 0 && (
                        <div className="mb-4">
                          <p className="text-blue-400 text-xs font-bold mb-2">📖 Notions à maîtriser ({chapitre.notions.length})</p>
                          <div className="flex flex-wrap gap-2">
                            {chapitre.notions.map((notion, i) => (
                              <span key={i} className="bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full border border-blue-200">
                                {notion}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Compétences */}
                      {chapitre.competences && chapitre.competences.length > 0 && (
                        <div className="mb-4">
                          <p className="text-green-400 text-xs font-bold mb-2">✅ Compétences visées ({chapitre.competences.length})</p>
                          <ul className="space-y-1">
                            {chapitre.competences.map((comp, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                                <span className="text-green-400 mt-0.5 shrink-0">→</span>
                                {comp}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Boutons */}
                      <div className="flex gap-3 mt-4">
                        <button
                          onClick={() => ouvrirAppEtGagnerXP(chapitre.url_app, "application")}
                          className={`flex-1 font-bold py-3 px-4 rounded-lg transition-all ${chapitre.url_app ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-gray-700 text-gray-500 cursor-not-allowed"}`}
                        >
                          🎮 {chapitre.url_app ? "Lancer l'application (+12 XP)" : "Bientôt disponible"}
                        </button>
                        <button
                          onClick={() => ouvrirAppEtGagnerXP(chapitre.url_fiche, "fiche")}
                          className={`flex-1 font-bold py-3 px-4 rounded-lg transition-all ${chapitre.url_fiche ? "bg-cyan-600 hover:bg-cyan-700 text-white" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}
                        >
                          📄 {chapitre.url_fiche ? "Carte mentale / fiche (+8 XP)" : "Bientôt disponible"}
                        </button>
                      </div>
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