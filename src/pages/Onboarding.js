import { useState } from "react";
import { db, auth } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

const questions = [
  {
    id: 1,
    question: "En groupe, tu es plutôt...",
    answers: [
      { text: "Celui qui organise et répartit les tâches", famille: "Architecte" },
      { text: "Celui qui propose des idées originales", famille: "Visionnaire" },
      { text: "Celui qui pousse le groupe à aller plus vite", famille: "Challenger" },
      { text: "Celui qui vérifie que tout est cohérent", famille: "Explorateur" },
      { text: "Celui qui motive et soude l'équipe", famille: "Influenceur" },
    ],
  },
  {
    id: 2,
    question: "Face à un problème difficile, ta réaction c'est...",
    answers: [
      { text: "Je fais un plan étape par étape", famille: "Architecte" },
      { text: "Je cherche une solution créative inattendue", famille: "Visionnaire" },
      { text: "Je fonce et j'ajuste en chemin", famille: "Challenger" },
      { text: "J'analyse toutes les options avant d'agir", famille: "Explorateur" },
      { text: "J'en parle avec les autres pour trouver ensemble", famille: "Influenceur" },
    ],
  },
  {
    id: 3,
    question: "Ton pire cauchemar au lycée c'est...",
    answers: [
      { text: "Un projet sans objectif clair", famille: "Architecte" },
      { text: "Faire la même chose que tout le monde", famille: "Visionnaire" },
      { text: "Perdre face à quelqu'un de moins bon", famille: "Challenger" },
      { text: "Rendre un travail sans l'avoir vérifié 10 fois", famille: "Explorateur" },
      { text: "Travailler seul sans pouvoir échanger", famille: "Influenceur" },
    ],
  },
  {
    id: 4,
    question: "Ce qui te motive le plus c'est...",
    answers: [
      { text: "Atteindre un objectif que tu t'es fixé", famille: "Architecte" },
      { text: "Créer quelque chose d'unique", famille: "Visionnaire" },
      { text: "Être le meilleur de ta classe", famille: "Challenger" },
      { text: "Comprendre comment les choses fonctionnent", famille: "Explorateur" },
      { text: "Être apprécié et reconnu par les autres", famille: "Influenceur" },
    ],
  },
  {
    id: 5,
    question: "Sur les réseaux sociaux tu es plutôt...",
    answers: [
      { text: "Tu observes et analyses les tendances", famille: "Architecte" },
      { text: "Tu crées du contenu original", famille: "Visionnaire" },
      { text: "Tu postes tes succès et challenges", famille: "Challenger" },
      { text: "Tu partages des infos et découvertes", famille: "Explorateur" },
      { text: "Tu interagis, commentes, fédères ta communauté", famille: "Influenceur" },
    ],
  },
  {
    id: 6,
    question: "La matière qui te parle le plus c'est...",
    answers: [
      { text: "Management — comprendre comment diriger", famille: "Architecte" },
      { text: "Marketing — créer des campagnes qui marquent", famille: "Visionnaire" },
      { text: "Gestion Finance — optimiser les chiffres", famille: "Challenger" },
      { text: "Économie — analyser comment le monde fonctionne", famille: "Explorateur" },
      { text: "RH — comprendre et gérer les relations humaines", famille: "Influenceur" },
    ],
  },
  {
    id: 7,
    question: "Pour ton BAC, tu préfères...",
    answers: [
      { text: "Préparer une stratégie de révision bien structurée", famille: "Architecte" },
      { text: "Créer des fiches visuelles et originales", famille: "Visionnaire" },
      { text: "Te chronomètrer sur des annales pour battre ton record", famille: "Challenger" },
      { text: "Tout comprendre en profondeur avant de mémoriser", famille: "Explorateur" },
      { text: "Réviser en groupe pour s'expliquer mutuellement", famille: "Influenceur" },
    ],
  },
  {
    id: 8,
    question: "En cours de Management, le prof vous demande d'analyser une entreprise. Tu commences par...",
    answers: [
      { text: "Définir les objectifs et la structure de l'analyse", famille: "Architecte" },
      { text: "Chercher ce qui rend cette entreprise unique", famille: "Visionnaire" },
      { text: "Voir comment elle performe face à ses concurrents", famille: "Challenger" },
      { text: "Éplucher tous les chiffres et données disponibles", famille: "Explorateur" },
      { text: "Comprendre comment elle manage ses équipes", famille: "Influenceur" },
    ],
  },
  {
    id: 9,
    question: "Tu dois créer une entreprise fictive. Tu choisis quel rôle ?",
    answers: [
      { text: "Directeur Général — tu veux tout piloter", famille: "Architecte" },
      { text: "Directeur Marketing — tu veux l'image et la créativité", famille: "Visionnaire" },
      { text: "Directeur Commercial — tu veux les résultats et les ventes", famille: "Challenger" },
      { text: "Directeur Financier — tu veux maîtriser les chiffres", famille: "Explorateur" },
      { text: "DRH — tu veux gérer les équipes et la culture d'entreprise", famille: "Influenceur" },
    ],
  },
  {
    id: 10,
    question: "Ce qui t'intéresse le plus dans le monde pro c'est...",
    answers: [
      { text: "Monter ta propre boîte un jour", famille: "Architecte" },
      { text: "Travailler dans la création, la com ou le design", famille: "Visionnaire" },
      { text: "Évoluer vite et gagner bien ta vie", famille: "Challenger" },
      { text: "Travailler dans la recherche, la data ou la finance", famille: "Explorateur" },
      { text: "Manager une équipe et créer une bonne ambiance", famille: "Influenceur" },
    ],
  },
  {
    id: 11,
    question: "Tu regardes un film. Tu préfères...",
    answers: [
      { text: "Un thriller où un génie résout tout par sa stratégie", famille: "Architecte" },
      { text: "Un film avec une histoire originale qui te surprend", famille: "Visionnaire" },
      { text: "Un film de compétition où le héros surmonte tout", famille: "Challenger" },
      { text: "Un documentaire ou un film qui t'apprend quelque chose", famille: "Explorateur" },
      { text: "Une comédie ou un drame avec de vraies relations humaines", famille: "Influenceur" },
    ],
  },
  {
    id: 12,
    question: "Tu as 100€ à dépenser librement. Tu fais quoi ?",
    answers: [
      { text: "Tu investis ou tu épargnes une partie", famille: "Architecte" },
      { text: "Tu achètes quelque chose de créatif ou d'unique", famille: "Visionnaire" },
      { text: "Tu te fais plaisir avec quelque chose de premium", famille: "Challenger" },
      { text: "Tu cherches le meilleur rapport qualité/prix", famille: "Explorateur" },
      { text: "Tu organises une sortie avec tes amis", famille: "Influenceur" },
    ],
  },
  {
    id: 13,
    question: "Tu rejoins un nouveau groupe. Tu fais quoi en premier ?",
    answers: [
      { text: "Tu observes qui fait quoi et comment le groupe fonctionne", famille: "Architecte" },
      { text: "Tu proposes une idée pour te démarquer", famille: "Visionnaire" },
      { text: "Tu montres ce que tu vaux rapidement", famille: "Challenger" },
      { text: "Tu poses des questions pour comprendre le contexte", famille: "Explorateur" },
      { text: "Tu crées des liens avec un maximum de personnes", famille: "Influenceur" },
    ],
  },
  {
    id: 14,
    question: "On te propose de passer dans une émission TV. Tu choisis laquelle ?",
    answers: [
      { text: "Koh Lanta — stratégie et survie", famille: "Architecte" },
      { text: "The Voice ou une émission créative", famille: "Visionnaire" },
      { text: "Les 12 coups de midi ou un jeu de compétition", famille: "Challenger" },
      { text: "C'est pas sorcier ou une émission de culture", famille: "Explorateur" },
      { text: "Une émission de téléréalité sociale et humaine", famille: "Influenceur" },
    ],
  },
  {
    id: 15,
    question: "La phrase qui te ressemble le plus c'est...",
    answers: [
      { text: "Un bon plan aujourd'hui vaut mieux qu'un plan parfait demain", famille: "Architecte" },
      { text: "La créativité c'est l'intelligence qui s'amuse", famille: "Visionnaire" },
      { text: "La seule façon de faire du bon travail c'est d'aimer ce qu'on fait", famille: "Challenger" },
      { text: "La connaissance c'est le pouvoir", famille: "Explorateur" },
      { text: "Seul on va plus vite, ensemble on va plus loin", famille: "Influenceur" },
    ],
  },
];

const familles = {
  Architecte: { emoji: "🧠", description: "Tu vois tout, tu planifies tout. Tu es le cerveau derrière chaque projet." },
  Visionnaire: { emoji: "🎨", description: "Tu penses hors des cases. Tu es celui qui imagine ce que les autres n'osent pas." },
  Challenger: { emoji: "⚡", description: "Tu veux gagner, toujours. La compétition te donne des ailes." },
  Explorateur: { emoji: "🔬", description: "Tu creuses, tu comprends tout. La connaissance est ton superpouvoir." },
  Influenceur: { emoji: "🔥", description: "Tu fédères, tu rayonnes. Les gens te suivent naturellement." },
};

export default function Onboarding({ onTermine }) {
  const [etape, setEtape] = useState("test");
  const [questionActuelle, setQuestionActuelle] = useState(0);
  const [scores, setScores] = useState({
    Architecte: 0, Visionnaire: 0, Challenger: 0, Explorateur: 0, Influenceur: 0,
  });
  const [famille, setFamille] = useState(null);
  const [prenom, setPrenom] = useState("");
  const [classe, setClasse] = useState("");

  const handleReponse = (familleReponse) => {
    const nouveauxScores = { ...scores, [familleReponse]: scores[familleReponse] + 1 };
    setScores(nouveauxScores);

    if (questionActuelle + 1 < questions.length) {
      setQuestionActuelle(questionActuelle + 1);
    } else {
      const familleTrouvee = Object.keys(nouveauxScores).reduce((a, b) =>
        nouveauxScores[a] > nouveauxScores[b] ? a : b
      );
      setFamille(familleTrouvee);
      setEtape("resultat");
    }
  };

  const handleSauvegarder = async () => {
    if (!prenom || !classe) return;
    const user = auth.currentUser;
    await setDoc(doc(db, "users", user.uid), {
      prenom,
      classe,
      famille,
      xp: 0,
      role: "free",
      badges: [],
      chapitresCompletes: [],
      createdAt: new Date(),
    });
    onTermine();
  };

  if (etape === "test") {
    const q = questions[questionActuelle];
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 p-8 rounded-xl w-full max-w-2xl">
          <div className="flex justify-between items-center mb-6">
            <span className="text-gray-400 text-sm">Question {questionActuelle + 1} / {questions.length}</span>
            <div className="w-48 bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all"
                style={{ width: `${((questionActuelle + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>
          <h2 className="text-white text-xl font-bold mb-6">{q.question}</h2>
          <div className="space-y-3">
            {q.answers.map((answer, index) => (
              <button
                key={index}
                onClick={() => handleReponse(answer.famille)}
                className="w-full text-left bg-gray-700 hover:bg-blue-600 text-white p-4 rounded-lg transition-all"
              >
                {answer.text}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (etape === "resultat") {
    const f = familles[famille];
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 p-8 rounded-xl w-full max-w-md text-center">
          <div className="text-6xl mb-4">{f.emoji}</div>
          <h2 className="text-white text-3xl font-bold mb-2">Tu es {famille === "Architecte" ? "un" : famille === "Influenceur" ? "un" : famille === "Challenger" ? "un" : famille === "Explorateur" ? "un" : "un"} {famille} !</h2>
          <p className="text-gray-400 mb-8">{f.description}</p>
          <div className="text-left space-y-4">
            <input
              type="text"
              placeholder="Ton prénom"
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
              className="w-full bg-gray-700 text-white p-3 rounded-lg outline-none"
            />
            <select
              value={classe}
              onChange={(e) => setClasse(e.target.value)}
              className="w-full bg-gray-700 text-white p-3 rounded-lg outline-none"
            >
              <option value="">Ta classe</option>
              <option value="premiere">Première STMG</option>
              <option value="terminale">Terminale STMG</option>
            </select>
            <button
              onClick={handleSauvegarder}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold p-3 rounded-lg"
            >
              Rejoindre le STMG HUB ! 🚀
            </button>
          </div>
        </div>
      </div>
    );
  }
}