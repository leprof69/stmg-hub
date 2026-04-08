import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";

const matieres = [
  { nom: "Management", emoji: "🏢" },
  { nom: "Économie", emoji: "📈" },
  { nom: "Droit", emoji: "⚖️" },
  { nom: "Sciences de Gestion", emoji: "💻" },
  { nom: "Marketing", emoji: "🎯" },
  { nom: "Ressources Humaines", emoji: "👥" },
  { nom: "Gestion Finance", emoji: "💰" },
];

export default function Chapitres({ profil }) {
  const [matiereSelectionnee, setMatiereSelectionnee] = useState("Management");
  const [chapitres, setChapitres] = useState([]);
  const [chargement, setChargement] = useState(false);

  useEffect(() => {
    const chargerChapitres = async () => {
      setChargement(true);
      try {
        const q = query(
          collection(db, "chapitres"),
          where("matiere", "==", matiereSelectionnee),
          where("classe", "==", profil.classe),
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
  }, [matiereSelectionnee, profil.classe]);

  const ouvrirApp = (url) => {
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-4xl mx-auto">

        <div className="mb-6">
          <h1 className="text-3xl font-bold">📚 Mes Chapitres</h1>
          <p className="text-gray-400 mt-1">
            {profil.classe === "premiere" ? "Première STMG" : "Terminale STMG"}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {matieres.map((matiere) => (
            <button
              key={matiere.nom}
              onClick={() => setMatiereSelectionnee(matiere.nom)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                matiereSelectionnee === matiere.nom
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {matiere.emoji} {matiere.nom}
            </button>
          ))}
        </div>

        {chargement ? (
          <p className="text-center text-gray-400">Chargement...</p>
        ) : chapitres.length === 0 ? (
          <div className="bg-gray-800 rounded-xl p-8 text-center">
            <p className="text-4xl mb-3">🔒</p>
            <p className="text-gray-400">Aucun chapitre disponible pour l'instant</p>
          </div>
        ) : (
          <div className="space-y-4">
            {chapitres.map((chapitre) => (
              <div key={chapitre.id} className="bg-gray-800 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                    Chapitre {chapitre.ordre}
                  </span>
                  <span className="text-yellow-400 text-xs font-semibold">
                    +{chapitre.xp} XP
                  </span>
                </div>
                <h3 className="text-white font-bold text-lg">{chapitre.titre}</h3>
                <p className="text-gray-400 text-sm mt-1 italic">
                  ❓ {chapitre.question}
                </p>
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => ouvrirApp(chapitre.url_app)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
                  >
                    🎮 Lancer l'application
                  </button>
                  <button
  onClick={() => ouvrirApp(chapitre.url_fiche)}
  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg"
>
  📄 Fiche de révision
</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}