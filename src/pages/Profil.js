import { useState } from "react";
import { auth, db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";

const CGU_TEXTE = `CONDITIONS GÉNÉRALES D'UTILISATION — STMG HUB
Dernière mise à jour : avril 2025

1. QUI SOMMES-NOUS ?
STMG HUB est une plateforme éducative gamifiée destinée aux élèves de la série STMG. Elle est éditée par Khalifa SOUCI, enseignant en Management.
Contact : lelaboduprof69@gmail.com

2. DONNÉES COLLECTÉES
Dans le cadre de votre inscription, nous collectons :
- Prénom, âge, classe, spécialité, nom du lycée
- Adresse email (via Firebase Authentication)
- Résultats au quiz de personnalité et Triple Totem
- Progression pédagogique (chapitres, XP, badges, missions)

3. POURQUOI CES DONNÉES ?
Ces données sont utilisées exclusivement pour :
- Personnaliser votre expérience sur la plateforme
- Suivre votre progression pédagogique
- Établir un classement entre élèves du même lycée
- Améliorer les contenus proposés
Vos données ne sont jamais vendues ni transmises à des tiers.

4. DURÉE DE CONSERVATION
Vos données sont conservées pendant toute la durée de votre utilisation. Vous pouvez demander leur suppression à tout moment en contactant : lelaboduprof69@gmail.com

5. VOS DROITS (RGPD)
Conformément au RGPD, vous disposez des droits suivants :
- Droit d'accès, de rectification, d'effacement
- Droit à la portabilité et d'opposition
Pour exercer ces droits : lelaboduprof69@gmail.com

6. MINEURS
L'accès à STMG HUB est réservé aux personnes âgées d'au moins 13 ans.

7. HÉBERGEMENT ET SÉCURITÉ
Les données sont hébergées sur Firebase (Google Cloud), conforme aux normes européennes. Les connexions sont sécurisées par HTTPS.

8. CONTACT
Khalifa SOUCI — lelaboduprof69@gmail.com`;

const familleEmojis = {
  Architecte: "🧠",
  Visionnaire: "🎨",
  Challenger: "⚡",
  Explorateur: "🔬",
  Influenceur: "🔥",
};

const familleColors = {
  Architecte: "bg-blue-600",
  Visionnaire: "bg-purple-600",
  Challenger: "bg-orange-600",
  Explorateur: "bg-green-600",
  Influenceur: "bg-red-600",
};

export default function Profil({ profil, onRefaire, onDeconnexion, onMiseAJour }) {
  const [showCGU, setShowCGU] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showJoker, setShowJoker] = useState(false);
  const [jokerUtilise, setJokerUtilise] = useState(false);
  const [chargement, setChargement] = useState(false);
  

  const jokerDisponible = !profil.jokerUtilise && !jokerUtilise;

  const utiliserJoker = async () => {
    setChargement(true);
    const user = auth.currentUser;
    await updateDoc(doc(db, "users", user.uid), {
      jokerUtilise: true,
      famille: null,
      animalTotem: null,
      objetTotem: null,
      starTotem: null,
    });
    setJokerUtilise(true);
    setChargement(false);
    setShowJoker(false);
    onRefaire();
  };

  const familleNom = profil.famille ? `${familleEmojis[profil.famille]} ${profil.famille === "Architecte" ? "L'Architecte" : profil.famille === "Visionnaire" ? "Le Visionnaire" : profil.famille === "Challenger" ? "Le Challenger" : profil.famille === "Explorateur" ? "L'Explorateur" : "L'Influenceur"}` : "Non défini";

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-lg mx-auto">

        <h1 className="text-3xl font-bold mb-6">👤 Mon Profil</h1>

        {/* INFOS */}
        <div className="bg-gray-800 rounded-xl p-5 mb-4">
          <h2 className="text-lg font-bold mb-4 text-gray-300">📋 Mes informations</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Prénom</span>
              <span className="text-white font-semibold">{profil.prenom}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Âge</span>
              <span className="text-white font-semibold">{profil.age} ans</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Classe</span>
              <span className="text-white font-semibold">{profil.classe === "premiere" ? "Première STMG" : "Terminale STMG"}</span>
            </div>
            {profil.specialite && (
              <div className="flex justify-between">
                <span className="text-gray-400">Spécialité</span>
                <span className="text-white font-semibold">{profil.specialite}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-400">Lycée</span>
              <span className="text-white font-semibold text-right max-w-xs">{profil.lycee}</span>
            </div>
          </div>
        </div>

        {/* TRIPLE TOTEM */}
        <div className="bg-gray-800 rounded-xl p-5 mb-4">
          <h2 className="text-lg font-bold mb-4 text-gray-300">🔮 Mon Triple Totem</h2>
          <div className="mb-3">
            <span className={`${familleColors[profil.famille]} text-white text-sm font-bold px-3 py-1 rounded-full`}>
              {familleNom}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="bg-gray-700 rounded-xl p-3 text-center">
              <div className="text-3xl mb-1">{profil.animalTotem?.emoji || "❓"}</div>
              <p className="text-gray-400 text-xs">🐾 Animal</p>
              <p className="text-white text-xs font-bold mt-1">{profil.animalTotem?.nom || "—"}</p>
            </div>
            <div className="bg-gray-700 rounded-xl p-3 text-center">
              <div className="text-3xl mb-1">{profil.objetTotem?.emoji || "❓"}</div>
              <p className="text-gray-400 text-xs">⚔️ Objet</p>
              <p className="text-white text-xs font-bold mt-1">{profil.objetTotem?.nom || "—"}</p>
            </div>
            <div className="bg-gray-700 rounded-xl p-3 text-center">
              <div className="text-3xl mb-1">{profil.starTotem?.emoji || "❓"}</div>
              <p className="text-gray-400 text-xs">⭐ Star</p>
              <p className="text-white text-xs font-bold mt-1">{profil.starTotem?.nom || "—"}</p>
            </div>
          </div>
        </div>

        {/* JOKER */}
        <div className="bg-gray-800 rounded-xl p-5 mb-4">
          <h2 className="text-lg font-bold mb-2 text-gray-300">🃏 Joker — Refaire le quiz</h2>
          {jokerDisponible ? (
            <>
              <p className="text-gray-400 text-sm mb-4">Tu as 1 joker disponible. Tu peux refaire le quiz de personnalité pour changer de famille et recréer ton Triple Totem. Ton XP, tes badges et ta progression sont conservés !</p>
              <button
                onClick={() => setShowJoker(true)}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-6 py-3 rounded-xl transition-all"
              >
                🃏 Utiliser mon Joker
              </button>
            </>
          ) : (
            <p className="text-gray-500 text-sm">Tu as déjà utilisé ton joker. Plus disponible !</p>
          )}
        </div>

        {/* CGU */}
        <div className="bg-gray-800 rounded-xl p-5 mb-4">
          <h2 className="text-lg font-bold mb-2 text-gray-300">📋 Légal</h2>
          <button
            onClick={() => setShowCGU(true)}
            className="w-full text-left bg-gray-700 hover:bg-gray-600 px-4 py-3 rounded-lg text-gray-300 transition-all mb-2"
          >
            📄 Conditions Générales d'Utilisation & RGPD
          </button>
          <button
            onClick={() => setShowContact(true)}
            className="w-full text-left bg-gray-700 hover:bg-gray-600 px-4 py-3 rounded-lg text-gray-300 transition-all"
          >
            📧 Nous contacter
          </button>
        </div>

        {/* DÉCONNEXION */}
        <button
          onClick={onDeconnexion}
          className="w-full bg-red-700 hover:bg-red-800 text-white font-bold py-4 rounded-xl transition-all"
        >
          🚪 Se déconnecter
        </button>

        {/* POPUP CGU */}
        {showCGU && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-2xl max-w-lg w-full max-h-screen overflow-hidden flex flex-col">
              <div className="p-5 border-b border-gray-700 flex justify-between items-center">
                <h3 className="text-white font-bold text-lg">📋 CGU & RGPD</h3>
                <button onClick={() => setShowCGU(false)} className="text-gray-400 hover:text-white text-2xl">×</button>
              </div>
              <div className="p-5 overflow-y-auto flex-1">
                <pre className="text-gray-300 text-xs whitespace-pre-wrap leading-relaxed font-sans">{CGU_TEXTE}</pre>
              </div>
              <div className="p-4 border-t border-gray-700">
                <button onClick={() => setShowCGU(false)} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl">
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* POPUP CONTACT */}
        {showContact && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-2xl max-w-sm w-full p-6">
              <h3 className="text-white font-bold text-xl mb-4">📧 Nous contacter</h3>
              <div className="space-y-4">
                <div className="bg-gray-700 rounded-xl p-4">
                  <p className="text-gray-400 text-sm mb-1">Responsable de la plateforme</p>
                  <p className="text-white font-bold">Khalifa SOUCI</p>
                </div>
                <div className="bg-gray-700 rounded-xl p-4">
                  <p className="text-gray-400 text-sm mb-1">Email</p>
                  <p className="text-blue-400 font-bold">lelaboduprof69@gmail.com</p>
                </div>
                <div className="bg-gray-700 rounded-xl p-4">
                  <p className="text-gray-400 text-sm mb-1">Objet de contact possible</p>
                  <ul className="text-gray-300 text-sm space-y-1 mt-1">
                    <li>→ Problème technique</li>
                    <li>→ Demande de suppression de données</li>
                    <li>→ Question sur la plateforme</li>
                    <li>→ Signalement d'un contenu</li>
                  </ul>
                </div>
              </div>
              <button onClick={() => setShowContact(false)} className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl">
                Fermer
              </button>
            </div>
          </div>
        )}

        {/* POPUP JOKER */}
        {showJoker && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-2xl max-w-sm w-full p-6 text-center">
              <div className="text-6xl mb-4">🃏</div>
              <h3 className="text-white font-bold text-xl mb-2">Utiliser ton Joker ?</h3>
              <p className="text-gray-400 text-sm mb-6">
                Tu vas refaire le quiz de personnalité et recréer ton Triple Totem.<br /><br />
                ✅ XP conservé<br />
                ✅ Badges conservés<br />
                ✅ Chapitres conservés<br />
                ⚠️ Famille et Totems réinitialisés<br />
                ⚠️ Joker non récupérable
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowJoker(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-xl"
                >
                  Annuler
                </button>
                <button
                  onClick={utiliserJoker}
                  disabled={chargement}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 rounded-xl"
                >
                  {chargement ? "⏳..." : "🃏 Confirmer"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}