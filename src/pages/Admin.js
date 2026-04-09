import { useState } from "react";
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

const badgesAImporter = [
  { id: "animaux-cat", nom: "Le Chat", univers: "Animaux", description: "Obtenir ses premiers points XP !", rarete: "Commun", condition_type: "xp", condition_valeur: 1, image_url: "/badges/Cat.gif" },
  { id: "animaux-chipmunk", nom: "L'Écureuil", univers: "Animaux", description: "Compléter 5 chapitres !", rarete: "Commun", condition_type: "chapitres", condition_valeur: 5, image_url: "/badges/Chipmunk.gif" },
  { id: "animaux-cowface", nom: "La Vache", univers: "Animaux", description: "Atteindre 50 XP !", rarete: "Commun", condition_type: "xp", condition_valeur: 50, image_url: "/badges/Cow face.gif" },
  { id: "animaux-dogface", nom: "Le Chien", univers: "Animaux", description: "Se connecter 3 jours de suite !", rarete: "Commun", condition_type: "connexions", condition_valeur: 3, image_url: "/badges/Dog face.gif" },
  { id: "animaux-dog", nom: "Le Chien Majestueux", univers: "Animaux", description: "Compléter son premier chapitre !", rarete: "Commun", condition_type: "chapitres", condition_valeur: 1, image_url: "/badges/Dog.gif" },
  { id: "animaux-dolphin", nom: "Le Dauphin", univers: "Animaux", description: "Atteindre 100 XP !", rarete: "Peu commun", condition_type: "xp", condition_valeur: 100, image_url: "/badges/Dolphin.gif" },
  { id: "animaux-elephant", nom: "L'Éléphant", univers: "Animaux", description: "Se connecter 7 jours de suite !", rarete: "Peu commun", condition_type: "connexions", condition_valeur: 7, image_url: "/badges/Elephant.gif" },
  { id: "animaux-fox", nom: "Le Renard", univers: "Animaux", description: "Compléter 3 missions !", rarete: "Peu commun", condition_type: "missions", condition_valeur: 3, image_url: "/badges/Fox.gif" },
  { id: "animaux-frog", nom: "La Grenouille", univers: "Animaux", description: "Atteindre 200 XP !", rarete: "Peu commun", condition_type: "xp", condition_valeur: 200, image_url: "/badges/Frog.gif" },
  { id: "animaux-giraffe", nom: "La Girafe", univers: "Animaux", description: "Compléter 5 fiches de révision !", rarete: "Peu commun", condition_type: "chapitres", condition_valeur: 5, image_url: "/badges/Giraffe.gif" },
  { id: "animaux-gorilla", nom: "Le Gorille", univers: "Animaux", description: "Atteindre 500 XP !", rarete: "Rare", condition_type: "xp", condition_valeur: 500, image_url: "/badges/Gorilla.gif" },
  { id: "animaux-hippo", nom: "L'Hippopotame", univers: "Animaux", description: "Être dans le top 200 national !", rarete: "Rare", condition_type: "classement", condition_valeur: 200, image_url: "/badges/Hippopotamus.gif" },
  { id: "animaux-horse", nom: "Le Cheval", univers: "Animaux", description: "Compléter 10 chapitres !", rarete: "Rare", condition_type: "chapitres", condition_valeur: 10, image_url: "/badges/Horse.gif" },
  { id: "animaux-lion", nom: "Le Lion", univers: "Animaux", description: "Atteindre 750 XP !", rarete: "Rare", condition_type: "xp", condition_valeur: 750, image_url: "/badges/Lion.gif" },
  { id: "animaux-monkeyface", nom: "Le Singe", univers: "Animaux", description: "Se connecter 15 jours de suite !", rarete: "Rare", condition_type: "connexions", condition_valeur: 15, image_url: "/badges/Monkey face.gif" },
  { id: "animaux-monkey", nom: "Le Singe Sauvage", univers: "Animaux", description: "Atteindre 1000 XP !", rarete: "Épique", condition_type: "xp", condition_valeur: 1000, image_url: "/badges/Monkey.gif" },
  { id: "animaux-moose", nom: "L'Élan", univers: "Animaux", description: "Être dans le top 100 national !", rarete: "Épique", condition_type: "classement", condition_valeur: 100, image_url: "/badges/Moose.gif" },
  { id: "animaux-mouseface", nom: "La Souris", univers: "Animaux", description: "Compléter 20 chapitres !", rarete: "Épique", condition_type: "chapitres", condition_valeur: 20, image_url: "/badges/Mouse face.gif" },
  { id: "animaux-owl", nom: "Le Hibou", univers: "Animaux", description: "Compléter 15 missions !", rarete: "Épique", condition_type: "missions", condition_valeur: 15, image_url: "/badges/Owl.gif" },
  { id: "animaux-parrot", nom: "Le Perroquet", univers: "Animaux", description: "Atteindre 1500 XP !", rarete: "Épique", condition_type: "xp", condition_valeur: 1500, image_url: "/badges/Parrot.gif" },
  { id: "animaux-penguin", nom: "Le Pingouin", univers: "Animaux", description: "Atteindre 2000 XP !", rarete: "Légendaire", condition_type: "xp", condition_valeur: 2000, image_url: "/badges/Penguin.gif" },
  { id: "animaux-pigface", nom: "Le Cochon", univers: "Animaux", description: "Être dans le top 50 national !", rarete: "Légendaire", condition_type: "classement", condition_valeur: 50, image_url: "/badges/Pig face.gif" },
  { id: "animaux-pig", nom: "Le Cochon Sauvage", univers: "Animaux", description: "Compléter 10 missions !", rarete: "Rare", condition_type: "missions", condition_valeur: 10, image_url: "/badges/Pig.gif" },
  { id: "animaux-rabbitface", nom: "Le Lapin", univers: "Animaux", description: "Se connecter 30 jours de suite !", rarete: "Légendaire", condition_type: "connexions", condition_valeur: 30, image_url: "/badges/Rabbit face.gif" },
  { id: "animaux-rabbit", nom: "Le Lapin Sauvage", univers: "Animaux", description: "Compléter 25 chapitres !", rarete: "Épique", condition_type: "chapitres", condition_valeur: 25, image_url: "/badges/Rabbit.gif" },
  { id: "animaux-raccoon", nom: "Le Raton Laveur", univers: "Animaux", description: "Compléter 30 chapitres !", rarete: "Légendaire", condition_type: "chapitres", condition_valeur: 30, image_url: "/badges/Raccoon.gif" },
  { id: "animaux-tigerface", nom: "Le Tigre", univers: "Animaux", description: "Être dans le top 10 national !", rarete: "Légendaire", condition_type: "classement", condition_valeur: 10, image_url: "/badges/Tiger face.gif" },
  { id: "animaux-tiger", nom: "Le Tigre Sauvage", univers: "Animaux", description: "Atteindre 5000 XP !", rarete: "Légendaire", condition_type: "xp", condition_valeur: 5000, image_url: "/badges/Tiger.gif" },
  { id: "animaux-wolf", nom: "Le Loup", univers: "Animaux", description: "Être dans le top 10 national !", rarete: "Légendaire", condition_type: "classement", condition_valeur: 10, image_url: "/badges/Wolf.gif" },
];

const rareteColors = {
  "Commun": "#9ca3af",
  "Peu commun": "#4ade80",
  "Rare": "#60a5fa",
  "Épique": "#c084fc",
  "Légendaire": "#fbbf24",
};

export default function Admin() {
  const [importing, setImporting] = useState(false);
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState(0);

  const importerBadges = async () => {
    setImporting(true);
    setDone(false);
    for (let i = 0; i < badgesAImporter.length; i++) {
      const badge = badgesAImporter[i];
      await setDoc(doc(db, "badges", badge.id), {
        nom: badge.nom,
        univers: badge.univers,
        description: badge.description,
        rarete: badge.rarete,
        condition_type: badge.condition_type,
        condition_valeur: badge.condition_valeur,
        image_url: badge.image_url,
      });
      setProgress(i + 1);
    }
    setImporting(false);
    setDone(true);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">⚙️ Admin</h1>
        <p className="text-gray-400 mb-8">Panneau d'administration STMG HUB</p>

        <div className="bg-gray-800 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-2">🏅 Import des badges</h2>
          <p className="text-gray-400 mb-4">{badgesAImporter.length} badges à importer</p>
          {done ? (
            <p className="text-green-400 font-bold">✅ {badgesAImporter.length} badges importés !</p>
          ) : importing ? (
            <div>
              <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
                <div className="bg-blue-500 h-3 rounded-full transition-all" style={{ width: `${(progress / badgesAImporter.length) * 100}%` }} />
              </div>
              <p className="text-gray-400 text-sm">{progress} / {badgesAImporter.length} importés...</p>
            </div>
          ) : (
            <button onClick={importerBadges} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-lg">
              🚀 Importer tous les badges
            </button>
          )}
        </div>

        <div className="bg-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">Aperçu des badges</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {badgesAImporter.map((badge) => (
              <div key={badge.id} className="bg-gray-700 rounded-xl p-3 text-center">
                <img src={badge.image_url} alt={badge.nom} className="w-14 h-14 mx-auto mb-2" onError={(e) => { e.target.style.display = "none"; }} />
                <p className="text-white text-xs font-bold leading-tight">{badge.nom}</p>
                <p className="text-xs mt-1" style={{ color: rareteColors[badge.rarete] }}>{badge.rarete}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}