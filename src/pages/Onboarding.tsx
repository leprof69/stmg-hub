import { useState } from "react";
import { auth, db } from "../services/firebase";
import { doc, setDoc } from "firebase/firestore";

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
Vos données sont conservées pendant toute la durée de votre utilisation.
Vous pouvez demander leur suppression : lelaboduprof69@gmail.com

5. VOS DROITS (RGPD)
Conformément au RGPD, vous disposez des droits suivants :
- Droit d'accès, de rectification, d'effacement
- Droit à la portabilité et d'opposition
Pour exercer ces droits : lelaboduprof69@gmail.com

6. MINEURS
L'accès à STMG HUB est réservé aux personnes âgées d'au moins 13 ans.

7. HÉBERGEMENT ET SÉCURITÉ
Les données sont hébergées sur Firebase (Google Cloud), conforme aux normes européennes RGPD.

8. CONTACT
Khalifa SOUCI — lelaboduprof69@gmail.com`;

const familles = {
  Architecte: {
    nom: "L'Architecte", emoji: "🧠",
    description: "Tu analyses, tu structures, tu comprends avant d'agir. Ton cerveau est ta plus grande arme.",
    animaux: [
      { emoji: "🦉", nom: "Hibou" }, { emoji: "🦊", nom: "Renard" }, { emoji: "🐬", nom: "Dauphin" },
      { emoji: "🦅", nom: "Aigle" }, { emoji: "🐘", nom: "Éléphant" }, { emoji: "🦔", nom: "Hérisson" },
    ],
    objets: [
      { emoji: "📚", nom: "Livre ancien" }, { emoji: "🔭", nom: "Télescope magique" }, { emoji: "🧩", nom: "Puzzle infini" },
      { emoji: "⚗️", nom: "Fiole de sagesse" }, { emoji: "🗺️", nom: "Carte des secrets" }, { emoji: "🔬", nom: "Cristal de vérité" },
    ],
    stars: [
      { emoji: "🕵️", nom: "Sherlock Holmes" }, { emoji: "🤖", nom: "Tony Stark" }, { emoji: "🧙", nom: "Hermione Granger" },
      { emoji: "👩‍💻", nom: "Ada Lovelace" }, { emoji: "🧑‍🔬", nom: "Albert Einstein" }, { emoji: "🎮", nom: "Light Yagami" },
      { emoji: "🚀", nom: "Elon Musk" }, { emoji: "🧑‍💻", nom: "Mark Zuckerberg" }, { emoji: "🎯", nom: "Bill Gates" },
      { emoji: "🎮", nom: "L (Death Note)" }, { emoji: "🧙", nom: "Dumbledore" }, { emoji: "🤖", nom: "HAL 9000" },
    ],
  },
  Visionnaire: {
    nom: "Le Visionnaire", emoji: "🎨",
    description: "Tu vois le monde autrement. Créatif, intuitif, tu imagines ce que les autres ne voient pas encore.",
    animaux: [
      { emoji: "🦋", nom: "Papillon" }, { emoji: "🦚", nom: "Paon" }, { emoji: "🐙", nom: "Pieuvre" },
      { emoji: "🦜", nom: "Perroquet" }, { emoji: "🐈", nom: "Chat" }, { emoji: "🦩", nom: "Flamant" },
    ],
    objets: [
      { emoji: "🎨", nom: "Pinceau enchanté" }, { emoji: "🔮", nom: "Boule de cristal" }, { emoji: "🪄", nom: "Baguette créatrice" },
      { emoji: "🌈", nom: "Prisme arc-en-ciel" }, { emoji: "🎭", nom: "Masque des rêves" }, { emoji: "📿", nom: "Collier des visions" },
    ],
    stars: [
      { emoji: "🎤", nom: "Beyoncé" }, { emoji: "🎬", nom: "Tim Burton" }, { emoji: "🎵", nom: "Billie Eilish" },
      { emoji: "🖌️", nom: "Frida Kahlo" }, { emoji: "🧝", nom: "Legolas" }, { emoji: "🎪", nom: "Willy Wonka" },
      { emoji: "🎵", nom: "Tyler the Creator" }, { emoji: "🎬", nom: "Spike Lee" }, { emoji: "🎤", nom: "Childish Gambino" },
      { emoji: "🎮", nom: "Hayao Miyazaki" }, { emoji: "👗", nom: "Virgil Abloh" }, { emoji: "🎪", nom: "Lady Gaga" },
    ],
  },
  Challenger: {
    nom: "Le Challenger", emoji: "⚡",
    description: "Tu repousses tes limites chaque jour. Compétitif, déterminé, tu transformes chaque obstacle en tremplin.",
    animaux: [
      { emoji: "🐺", nom: "Loup" }, { emoji: "🐯", nom: "Tigre" }, { emoji: "🦁", nom: "Lion" },
      { emoji: "🦈", nom: "Requin" }, { emoji: "🐉", nom: "Dragon" }, { emoji: "🦊", nom: "Renard noir" },
    ],
    objets: [
      { emoji: "⚔️", nom: "Épée légendaire" }, { emoji: "🛡️", nom: "Bouclier indestructible" }, { emoji: "🏹", nom: "Arc du destin" },
      { emoji: "⚡", nom: "Foudre de Zeus" }, { emoji: "🥊", nom: "Gants de champion" }, { emoji: "🎯", nom: "Flèche de précision" },
    ],
    stars: [
      { emoji: "🍃", nom: "Naruto" }, { emoji: "⚽", nom: "Kylian Mbappé" }, { emoji: "🏋️", nom: "Simone Biles" },
      { emoji: "🦸", nom: "Goku" }, { emoji: "👊", nom: "Rocky Balboa" }, { emoji: "🎮", nom: "Kratos" },
      { emoji: "🏀", nom: "LeBron James" }, { emoji: "🎾", nom: "Serena Williams" }, { emoji: "🥊", nom: "Mohamed Ali" },
      { emoji: "🎮", nom: "Vegeta" }, { emoji: "🦸", nom: "Deadpool" }, { emoji: "⚽", nom: "Cristiano Ronaldo" },
    ],
  },
  Explorateur: {
    nom: "L'Explorateur", emoji: "🔬",
    description: "Tu questionnes, tu découvres, tu explores. Chaque nouvelle connaissance est une aventure pour toi.",
    animaux: [
      { emoji: "🦎", nom: "Caméléon" }, { emoji: "🦅", nom: "Faucon" }, { emoji: "🐺", nom: "Loup solitaire" },
      { emoji: "🦀", nom: "Crabe" }, { emoji: "🐍", nom: "Serpent" }, { emoji: "🦇", nom: "Chauve-souris" },
    ],
    objets: [
      { emoji: "🧭", nom: "Boussole magique" }, { emoji: "🗺️", nom: "Carte au trésor" }, { emoji: "🔭", nom: "Lunette d'explorateur" },
      { emoji: "⚗️", nom: "Potion de découverte" }, { emoji: "🪬", nom: "Amulette ancienne" }, { emoji: "📜", nom: "Parchemin secret" },
    ],
    stars: [
      { emoji: "🤠", nom: "Indiana Jones" }, { emoji: "🧭", nom: "Marco Polo" }, { emoji: "🕵️", nom: "Lara Croft" },
      { emoji: "🎮", nom: "Link (Zelda)" }, { emoji: "🧑‍🚀", nom: "Neil Armstrong" }, { emoji: "🧙", nom: "Hermione Granger" },
      { emoji: "🚀", nom: "Elon Musk" }, { emoji: "🧬", nom: "Marie Curie" }, { emoji: "🌊", nom: "Jacques Cousteau" },
      { emoji: "🕵️", nom: "Lupin III" }, { emoji: "🧑‍🚀", nom: "Thomas Pesquet" }, { emoji: "🧙", nom: "Gandalf" },
    ],
  },
  Influenceur: {
    nom: "L'Influenceur", emoji: "🔥",
    description: "Tu fédères, tu inspires, tu entraînes les autres. Ton énergie est contagieuse et ta présence irrésistible.",
    animaux: [
      { emoji: "🦁", nom: "Lion royal" }, { emoji: "🦋", nom: "Papillon doré" }, { emoji: "🐬", nom: "Dauphin" },
      { emoji: "🦊", nom: "Renard" }, { emoji: "🐆", nom: "Guépard" }, { emoji: "🦅", nom: "Aigle royal" },
    ],
    objets: [
      { emoji: "🎤", nom: "Micro d'or" }, { emoji: "👑", nom: "Couronne du peuple" }, { emoji: "💎", nom: "Diamant de charisme" },
      { emoji: "🌟", nom: "Étoile filante" }, { emoji: "🪄", nom: "Baguette d'influence" }, { emoji: "📱", nom: "Téléphone légendaire" },
    ],
    stars: [
      { emoji: "🎤", nom: "Stromae" }, { emoji: "🌍", nom: "Malala Yousafzai" }, { emoji: "🎬", nom: "Issa Rae" },
      { emoji: "👸", nom: "Reine des Neiges" }, { emoji: "🦸", nom: "Black Panther" }, { emoji: "🎵", nom: "Bruno Mars" },
      { emoji: "🎤", nom: "Rihanna" }, { emoji: "🎵", nom: "Aya Nakamura" }, { emoji: "👑", nom: "Oprah Winfrey" },
      { emoji: "🎤", nom: "Kendrick Lamar" }, { emoji: "🌍", nom: "Barack Obama" }, { emoji: "🎵", nom: "Drake" },
    ],
  },
};

const questions = [
  { question: "Tu dois rendre un projet en groupe. Quel est ton rôle naturel ?", reponses: [
    { texte: "J'organise tout et je crée le plan", famille: "Architecte" },
    { texte: "J'apporte des idées originales", famille: "Visionnaire" },
    { texte: "Je motive l'équipe à donner le max", famille: "Challenger" },
    { texte: "Je cherche des infos que personne n'a trouvées", famille: "Explorateur" },
    { texte: "Je gère la communication et l'ambiance", famille: "Influenceur" },
  ]},
  { question: "Quel type de jeu vidéo préfères-tu ?", reponses: [
    { texte: "Stratégie et réflexion (Civilization, échecs)", famille: "Architecte" },
    { texte: "Créatif et artistique (Minecraft, Les Sims)", famille: "Visionnaire" },
    { texte: "Combat et compétition (FIFA, Fortnite)", famille: "Challenger" },
    { texte: "Aventure et exploration (Zelda, Skyrim)", famille: "Explorateur" },
    { texte: "Multijoueur et social (Among Us, Rocket League)", famille: "Influenceur" },
  ]},
  { question: "On te donne 1000 € libres. Tu fais quoi ?", reponses: [
    { texte: "Je les investis ou je les épargne intelligemment", famille: "Architecte" },
    { texte: "Je finance un projet créatif personnel", famille: "Visionnaire" },
    { texte: "J'achète du matériel pour progresser dans mon sport/hobby", famille: "Challenger" },
    { texte: "Je pars en voyage découvrir un endroit inconnu", famille: "Explorateur" },
    { texte: "Je les dépense avec mes amis pour créer des souvenirs", famille: "Influenceur" },
  ]},
  { question: "Quelle matière scolaire préfères-tu ?", reponses: [
    { texte: "Maths ou sciences — j'aime résoudre des problèmes", famille: "Architecte" },
    { texte: "Arts plastiques ou musique — j'aime créer", famille: "Visionnaire" },
    { texte: "EPS — j'aime me dépasser physiquement", famille: "Challenger" },
    { texte: "Histoire-Géo — j'aime comprendre le monde", famille: "Explorateur" },
    { texte: "Français — j'aime m'exprimer et convaincre", famille: "Influenceur" },
  ]},
  { question: "Tu dois prendre une décision importante. Tu fais quoi ?", reponses: [
    { texte: "Je liste tous les pour et les contre", famille: "Architecte" },
    { texte: "Je fais confiance à mon intuition", famille: "Visionnaire" },
    { texte: "Je décide vite et j'assume", famille: "Challenger" },
    { texte: "Je recherche le maximum d'informations", famille: "Explorateur" },
    { texte: "Je demande l'avis de mes proches", famille: "Influenceur" },
  ]},
  { question: "En management, quelle décision te ressemble le plus ?", reponses: [
    { texte: "Mettre en place un tableau de bord précis", famille: "Architecte" },
    { texte: "Lancer un nouveau produit innovant", famille: "Visionnaire" },
    { texte: "Fixer des objectifs ambitieux à l'équipe", famille: "Challenger" },
    { texte: "Analyser le marché avant tout", famille: "Explorateur" },
    { texte: "Fédérer l'équipe autour d'une vision commune", famille: "Influenceur" },
  ]},
  { question: "Un entrepreneur dit : 'Échoue vite pour réussir plus vite'. Tu réagis comment ?", reponses: [
    { texte: "Je préfère bien préparer pour éviter les erreurs", famille: "Architecte" },
    { texte: "Ça m'inspire — l'échec fait partie du processus créatif", famille: "Visionnaire" },
    { texte: "Je suis d'accord — il faut oser !", famille: "Challenger" },
    { texte: "Intéressant — j'analyse les échecs des autres pour apprendre", famille: "Explorateur" },
    { texte: "Je partage cette citation à tous mes amis !", famille: "Influenceur" },
  ]},
  { question: "Quelle organisation te correspond le mieux ?", reponses: [
    { texte: "Une grande entreprise bien structurée", famille: "Architecte" },
    { texte: "Une startup créative et innovante", famille: "Visionnaire" },
    { texte: "Une équipe sportive de haut niveau", famille: "Challenger" },
    { texte: "Un laboratoire de recherche", famille: "Explorateur" },
    { texte: "Une ONG qui change le monde", famille: "Influenceur" },
  ]},
  { question: "Tu dois présenter un exposé devant la classe. Tu te sens comment ?", reponses: [
    { texte: "Prêt — j'ai tout préparé et structuré", famille: "Architecte" },
    { texte: "Excité — c'est l'occasion d'être original", famille: "Visionnaire" },
    { texte: "Motivé — je veux les impressionner", famille: "Challenger" },
    { texte: "Concentré — j'ai cherché des infos rares", famille: "Explorateur" },
    { texte: "Dans mon élément — j'adore parler en public", famille: "Influenceur" },
  ]},
  { question: "En économie, quel sujet t'intéresse le plus ?", reponses: [
    { texte: "Les modèles économiques et les théories", famille: "Architecte" },
    { texte: "Les nouvelles formes d'économie (collaborative, circulaire)", famille: "Visionnaire" },
    { texte: "La croissance et la compétitivité des entreprises", famille: "Challenger" },
    { texte: "Le commerce international et la mondialisation", famille: "Explorateur" },
    { texte: "Les politiques sociales et l'impact sur les gens", famille: "Influenceur" },
  ]},
  { question: "Ton ami a un problème. Tu fais quoi ?", reponses: [
    { texte: "Je lui propose un plan d'action concret", famille: "Architecte" },
    { texte: "Je lui donne une perspective nouvelle et originale", famille: "Visionnaire" },
    { texte: "Je le motive à ne pas lâcher", famille: "Challenger" },
    { texte: "Je cherche des solutions qu'il n'a pas envisagées", famille: "Explorateur" },
    { texte: "Je l'écoute et je lui remonte le moral", famille: "Influenceur" },
  ]},
  { question: "Quel film ou quelle série préfères-tu ?", reponses: [
    { texte: "Thriller ou polar — j'aime les intrigues complexes", famille: "Architecte" },
    { texte: "Film d'animation ou fantastique — j'aime l'imaginaire", famille: "Visionnaire" },
    { texte: "Film de sport ou d'action — j'aime la montée d'adrénaline", famille: "Challenger" },
    { texte: "Documentaire ou film historique — j'aime apprendre", famille: "Explorateur" },
    { texte: "Comédie ou drame — j'aime les émotions humaines", famille: "Influenceur" },
  ]},
  { question: "En droit, quel sujet te parle le plus ?", reponses: [
    { texte: "Les contrats et les règles précises", famille: "Architecte" },
    { texte: "Les droits fondamentaux et les libertés", famille: "Visionnaire" },
    { texte: "La responsabilité et les sanctions", famille: "Challenger" },
    { texte: "Les sources du droit et leur évolution historique", famille: "Explorateur" },
    { texte: "Le droit du travail et la protection des salariés", famille: "Influenceur" },
  ]},
  { question: "Comment apprends-tu le mieux ?", reponses: [
    { texte: "Avec des schémas, des plans, des fiches structurées", famille: "Architecte" },
    { texte: "En créant quelque chose — dessin, carte mentale", famille: "Visionnaire" },
    { texte: "En me fixant des défis et des objectifs", famille: "Challenger" },
    { texte: "En lisant et en cherchant des exemples concrets", famille: "Explorateur" },
    { texte: "En discutant et en expliquant aux autres", famille: "Influenceur" },
  ]},
  { question: "Dans 10 ans, comment te vois-tu ?", reponses: [
    { texte: "Directeur financier ou consultant stratégique", famille: "Architecte" },
    { texte: "Entrepreneur créatif ou directeur artistique", famille: "Visionnaire" },
    { texte: "Chef d'entreprise ou sportif de haut niveau", famille: "Challenger" },
    { texte: "Chercheur, journaliste ou expert international", famille: "Explorateur" },
    { texte: "Leader associatif, politique ou influenceur", famille: "Influenceur" },
  ]},
];

const couleursBoutons = {
  Architecte: "bg-blue-600 hover:bg-blue-700",
  Visionnaire: "bg-cyan-600 hover:bg-cyan-700",
  Challenger: "bg-orange-600 hover:bg-orange-700",
  Explorateur: "bg-green-600 hover:bg-green-700",
  Influenceur: "bg-red-600 hover:bg-red-700",
};

const couleursTheme = {
  Architecte: { bg: "from-blue-50 to-slate-100", accent: "text-blue-700", border: "border-blue-300", badge: "bg-blue-600" },
  Visionnaire: { bg: "from-cyan-50 to-slate-100", accent: "text-cyan-700", border: "border-cyan-300", badge: "bg-cyan-600" },
  Challenger: { bg: "from-orange-50 to-slate-100", accent: "text-orange-700", border: "border-orange-300", badge: "bg-orange-600" },
  Explorateur: { bg: "from-green-50 to-slate-100", accent: "text-green-700", border: "border-green-300", badge: "bg-green-600" },
  Influenceur: { bg: "from-red-50 to-slate-100", accent: "text-red-700", border: "border-red-300", badge: "bg-red-600" },
};

export default function Onboarding({ onTermine }) {
  const [etape, setEtape] = useState(1);
  const [showCGU, setShowCGU] = useState(false);

  // Infos perso
  const [prenom, setPrenom] = useState("");
  const [age, setAge] = useState("");
  const [classe, setClasse] = useState("");
  const [lycee, setLycee] = useState("");
  const [lyceeCode, setLyceeCode] = useState("");
  const [lyceeVille, setLyceeVille] = useState("");
  const [specialite, setSpecialite] = useState("");
  const [rgpd, setRgpd] = useState(false);
  const [majeur13, setMajeur13] = useState(false);

  // Recherche lycée
  const [rechercheLycee, setRechercheLycee] = useState("");
  const [resultatsLycee, setResultatsLycee] = useState([]);
  const [chargementLycee, setChargementLycee] = useState(false);

  // Quiz
  const [questionActuelle, setQuestionActuelle] = useState(0);
  const [scores, setScores] = useState({ Architecte: 0, Visionnaire: 0, Challenger: 0, Explorateur: 0, Influenceur: 0 });

  // Totems
  const [famille, setFamille] = useState(null);
  const [sousEtapeTotem, setSousEtapeTotem] = useState(0);
  const [animalChoisi, setAnimalChoisi] = useState(null);
  const [objetChoisi, setObjetChoisi] = useState(null);
  const [starChoisie, setStarChoisie] = useState(null);
  const [chargement, setChargement] = useState(false);

  const theme = famille ? couleursTheme[famille] : couleursTheme.Architecte;
  const donneesTotem = famille ? familles[famille] : null;

  // ---- RECHERCHE LYCÉE API ----
  const rechercherLycee = async (texte) => {
    setRechercheLycee(texte);
    setLycee("");
    setLyceeCode("");
    setLyceeVille("");
    if (texte.length < 3) { setResultatsLycee([]); return; }
    setChargementLycee(true);
    try {
      const res = await fetch(
        `https://data.education.gouv.fr/api/explore/v2.1/catalog/datasets/fr-en-annuaire-education/records?where=libelle_nature%20like%20%22LYCEE%22%20and%20search(nom_etablissement%2C%20%22${encodeURIComponent(texte)}%22)&limit=8&select=nom_etablissement%2Cnom_commune%2Ccode_departement%2Cidentifiant_de_l_etablissement`
      );
      const data = await res.json();
      const resultats = (data.results || []).map(r => ({
        nom: r.nom_etablissement,
        ville: r.nom_commune,
        departement: r.code_departement,
        code: r.identifiant_de_l_etablissement,
      }));
      setResultatsLycee(resultats);
    } catch (err) {
      console.error(err);
      setResultatsLycee([]);
    }
    setChargementLycee(false);
  };

  // ---- INFOS PERSO ----
  const validerInfos = () => {
    if (!prenom || !age || !classe || !lycee || !rgpd || !majeur13) return;
    setEtape(2);
  };

  // ---- QUIZ ----
  const repondre = (familleReponse) => {
    const newScores = { ...scores, [familleReponse]: scores[familleReponse] + 1 };
    setScores(newScores);
    if (questionActuelle + 1 >= questions.length) {
      const familleDominante = Object.entries(newScores).sort((a, b) => b[1] - a[1])[0][0];
      setFamille(familleDominante);
      setEtape(3);
      setSousEtapeTotem(0);
    } else {
      setQuestionActuelle(questionActuelle + 1);
    }
  };

  // ---- SAUVEGARDE FINALE ----
  const terminer = async () => {
    setChargement(true);
    const user = auth.currentUser;
    await setDoc(doc(db, "users", user.uid), {
      prenom,
      age: parseInt(age),
      classe,
      lycee,
      lyceeCode,
      lyceeVille,
      specialite: specialite || "",
      famille,
      animalTotem: animalChoisi,
      objetTotem: objetChoisi,
      starTotem: starChoisie,
      xp: 0,
      niveau: 1,
      role: "free",
      jokerUtilise: false,
      badges: [],
      chapitresCompletes: [],
      missionsCompletes: [],
      connexions_consecutives: 1,
      evenements: [],
      createdAt: new Date(),
    });
    setChargement(false);
    onTermine();
  };

  // ============================================
  // ÉTAPE 1 — INFOS PERSO
  // ============================================
  if (etape === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center p-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 max-w-md w-full shadow-xl">
          <div className="text-center mb-8">
            <p className="text-5xl mb-3">🎓</p>
            <h1 className="text-2xl font-bold text-slate-900">Bienvenue sur STMG HUB !</h1>
            <p className="text-slate-500 mt-2 text-sm">Crée ton profil pour commencer l'aventure</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-slate-500 text-sm">Prénom *</label>
              <input type="text" value={prenom} onChange={e => setPrenom(e.target.value)}
                placeholder="Ton prénom"
                className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-4 py-3 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div>
              <label className="text-slate-500 text-sm">Âge *</label>
              <input type="number" value={age} onChange={e => setAge(e.target.value)}
                placeholder="Ton âge" min="13" max="20"
                className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-4 py-3 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div>
              <label className="text-slate-500 text-sm">Classe *</label>
              <select value={classe} onChange={e => setClasse(e.target.value)}
                className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-4 py-3 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Sélectionne ta classe</option>
                <option value="premiere">Première STMG</option>
                <option value="terminale">Terminale STMG</option>
              </select>
            </div>

            {classe === "terminale" && (
              <div>
                <label className="text-slate-500 text-sm">Spécialité *</label>
                <select value={specialite} onChange={e => setSpecialite(e.target.value)}
                  className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-4 py-3 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Sélectionne ta spécialité</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Ressources Humaines">Ressources Humaines</option>
                  <option value="Gestion Finance">Gestion Finance</option>
                  <option value="SIG">Systèmes d'Information de Gestion</option>
                </select>
              </div>
            )}

            <div>
              <label className="text-slate-500 text-sm">Nom de ton lycée *</label>
              <input
                type="text"
                value={rechercheLycee}
                onChange={e => rechercherLycee(e.target.value)}
                placeholder="Tape le nom de ta ville ou ton lycée..."
                className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-4 py-3 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {chargementLycee && (
                <p className="text-slate-500 text-xs mt-1">🔍 Recherche en cours...</p>
              )}
              {resultatsLycee.length > 0 && !lycee && (
                <div className="bg-white rounded-lg mt-1 max-h-48 overflow-y-auto border border-slate-300">
                  {resultatsLycee.map((etablissement, i) => (
                    <button key={i}
                      onClick={() => {
                        setLycee(etablissement.nom);
                        setLyceeCode(etablissement.code);
                        setLyceeVille(etablissement.ville);
                        setRechercheLycee(etablissement.nom + " — " + etablissement.ville);
                        setResultatsLycee([]);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-slate-100 border-b border-slate-200 last:border-0 transition-all"
                    >
                      <p className="text-slate-900 text-sm font-semibold">{etablissement.nom}</p>
                      <p className="text-slate-500 text-xs">{etablissement.ville} ({etablissement.departement})</p>
                    </button>
                  ))}
                </div>
              )}
              {lycee && (
                <p className="text-green-400 text-xs mt-1 font-semibold">✅ {lycee} sélectionné</p>
              )}
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={majeur13} onChange={e => setMajeur13(e.target.checked)}
                  className="mt-1 w-4 h-4 accent-blue-500" />
                <span className="text-slate-700 text-sm">J'ai au moins 13 ans *</span>
              </label>
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={rgpd} onChange={e => setRgpd(e.target.checked)}
                  className="mt-1 w-4 h-4 accent-blue-500" />
                <span className="text-slate-700 text-sm">
                  J'accepte les{" "}
                  <button onClick={() => setShowCGU(true)} className="text-blue-400 underline hover:text-blue-300">
                    Conditions Générales d'Utilisation
                  </button>
                  {" "}et la politique RGPD *
                </span>
              </label>
            </div>

            <button onClick={validerInfos}
              disabled={!prenom || !age || !classe || !lycee || !rgpd || !majeur13}
              className={`w-full font-bold py-4 rounded-xl text-white transition-all text-lg ${
                prenom && age && classe && lycee && rgpd && majeur13
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-600 cursor-not-allowed opacity-50"
              }`}>
              Commencer le quiz 🧠
            </button>
          </div>
        </div>

        {/* POPUP CGU */}
        {showCGU && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full max-h-screen overflow-hidden flex flex-col border border-slate-200">
              <div className="p-5 border-b border-slate-200 flex justify-between items-center">
                <h3 className="text-slate-900 font-bold text-lg">📋 CGU & RGPD — STMG HUB</h3>
                <button onClick={() => setShowCGU(false)} className="text-slate-500 hover:text-slate-900 text-2xl">×</button>
              </div>
              <div className="p-5 overflow-y-auto flex-1">
                <pre className="text-slate-700 text-xs whitespace-pre-wrap leading-relaxed font-sans">{CGU_TEXTE}</pre>
              </div>
              <div className="p-4 border-t border-slate-200 flex gap-3">
                <button onClick={() => setShowCGU(false)}
                  className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold py-3 rounded-xl">
                  Fermer
                </button>
                <button onClick={() => { setRgpd(true); setShowCGU(false); }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl">
                  ✅ J'accepte
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ============================================
  // ÉTAPE 2 — QUIZ
  // ============================================
  if (etape === 2) {
    const q = questions[questionActuelle];
    const progression = (questionActuelle / questions.length) * 100;
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center p-4">
        <div className="max-w-lg w-full">
          <div className="mb-6">
            <div className="flex justify-between text-slate-500 text-sm mb-2">
              <span>Question {questionActuelle + 1} / {questions.length}</span>
              <span>{Math.round(progression)}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full transition-all duration-500" style={{ width: `${progression}%` }} />
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xl">
            <p className="text-slate-900 font-bold text-xl mb-6 text-center leading-relaxed">{q.question}</p>
            <div className="space-y-3">
              {q.reponses.map((rep, i) => (
                <button key={i} onClick={() => repondre(rep.famille)}
                  className={`w-full text-left px-4 py-4 rounded-xl text-white font-semibold transition-all ${couleursBoutons[rep.famille]}`}>
                  {rep.texte}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // ÉTAPE 3 — TOTEMS
  // ============================================
  if (etape === 3 && donneesTotem) {

    // Révélation famille
    if (sousEtapeTotem === 0) {
      return (
        <div className={`min-h-screen bg-gradient-to-br ${theme.bg} flex items-center justify-center p-4`}>
          <div className="text-center max-w-md">
            <div className="text-8xl mb-6 animate-bounce">{donneesTotem.emoji}</div>
            <h2 className="text-4xl font-bold text-slate-900 mb-3">Tu es...</h2>
            <h1 className={`text-5xl font-bold mb-4 ${theme.accent}`}>{donneesTotem.nom} !</h1>
            <p className="text-slate-600 text-lg mb-8 leading-relaxed">{donneesTotem.description}</p>
            <button onClick={() => setSousEtapeTotem(1)}
              className={`${theme.badge} text-white font-bold px-8 py-4 rounded-xl text-lg hover:opacity-90 transition-all`}>
              Découvrir mon Triple Totem 🔮
            </button>
          </div>
        </div>
      );
    }

    // Choix Animal
    if (sousEtapeTotem === 1) {
      return (
        <div className={`min-h-screen bg-gradient-to-br ${theme.bg} flex items-center justify-center p-4`}>
          <div className="max-w-lg w-full">
            <div className="text-center mb-6">
              <p className={`${theme.accent} font-bold text-sm mb-1`}>TOTEM 1/3</p>
              <h2 className="text-3xl font-bold text-slate-900">🐾 Choisis ton Animal Totem</h2>
              <p className="text-slate-500 mt-2">Lequel te représente le mieux ?</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {donneesTotem.animaux.map((animal, i) => (
                <button key={i}
                  onClick={() => { setAnimalChoisi(animal); setSousEtapeTotem(2); }}
                  className={`bg-white border-2 ${theme.border} rounded-xl p-5 text-center hover:opacity-90 transition-all hover:scale-105`}>
                  <div className="text-5xl mb-2">{animal.emoji}</div>
                  <p className="text-slate-900 font-bold">{animal.nom}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // Choix Objet
    if (sousEtapeTotem === 2) {
      return (
        <div className={`min-h-screen bg-gradient-to-br ${theme.bg} flex items-center justify-center p-4`}>
          <div className="max-w-lg w-full">
            <div className="text-center mb-6">
              <p className={`${theme.accent} font-bold text-sm mb-1`}>TOTEM 2/3</p>
              <h2 className="text-3xl font-bold text-slate-900">⚔️ Choisis ton Objet Mythique</h2>
              <p className="text-slate-500 mt-2">Quelle est ton arme secrète ?</p>
              <div className="mt-3 inline-flex items-center gap-2 bg-white border border-slate-200 rounded-full px-3 py-1">
                <span className="text-2xl">{animalChoisi?.emoji}</span>
                <span className="text-slate-600 text-xs">{animalChoisi?.nom} ✅</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {donneesTotem.objets.map((objet, i) => (
                <button key={i}
                  onClick={() => { setObjetChoisi(objet); setSousEtapeTotem(3); }}
                  className={`bg-white border-2 ${theme.border} rounded-xl p-5 text-center hover:opacity-90 transition-all hover:scale-105`}>
                  <div className="text-5xl mb-2">{objet.emoji}</div>
                  <p className="text-slate-900 font-bold">{objet.nom}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // Choix Star
    if (sousEtapeTotem === 3) {
      return (
        <div className={`min-h-screen bg-gradient-to-br ${theme.bg} flex items-center justify-center p-4`}>
          <div className="max-w-lg w-full">
            <div className="text-center mb-6">
              <p className={`${theme.accent} font-bold text-sm mb-1`}>TOTEM 3/3</p>
              <h2 className="text-3xl font-bold text-slate-900">⭐ Choisis ta Star / Personnage</h2>
              <p className="text-slate-500 mt-2">Qui t'inspire le plus ?</p>
              <div className="mt-3 inline-flex items-center gap-2 bg-white border border-slate-200 rounded-full px-3 py-1">
                <span className="text-xl">{animalChoisi?.emoji}</span>
                <span className="text-slate-600 text-xs">{animalChoisi?.nom} ✅</span>
                <span className="text-xl ml-1">{objetChoisi?.emoji}</span>
                <span className="text-slate-600 text-xs">{objetChoisi?.nom} ✅</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto pb-2">
              {donneesTotem.stars.map((star, i) => (
                <button key={i}
                  onClick={() => { setStarChoisie(star); setSousEtapeTotem(4); }}
                  className={`bg-white border-2 ${theme.border} rounded-xl p-5 text-center hover:opacity-90 transition-all hover:scale-105`}>
                  <div className="text-5xl mb-2">{star.emoji}</div>
                  <p className="text-slate-900 font-bold text-sm">{star.nom}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // Révélation Triple Totem
    if (sousEtapeTotem === 4 && animalChoisi && objetChoisi && starChoisie) {
      return (
        <div className={`min-h-screen bg-gradient-to-br ${theme.bg} flex items-center justify-center p-4`}>
          <div className="max-w-md w-full text-center">
            <div className="text-5xl mb-4 animate-bounce">✨</div>
            <h2 className="text-3xl font-bold text-slate-900 mb-1">Ton Triple Totem !</h2>
            <p className={`${theme.accent} font-bold text-lg mb-8`}>{donneesTotem.emoji} {donneesTotem.nom}</p>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className={`bg-white border-2 ${theme.border} rounded-xl p-4`}>
                <div className="text-4xl mb-2">{animalChoisi.emoji}</div>
                <p className="text-slate-500 text-xs mb-1">🐾 Animal</p>
                <p className="text-slate-900 font-bold text-sm">{animalChoisi.nom}</p>
              </div>
              <div className={`bg-white border-2 ${theme.border} rounded-xl p-4`}>
                <div className="text-4xl mb-2">{objetChoisi.emoji}</div>
                <p className="text-slate-500 text-xs mb-1">⚔️ Objet</p>
                <p className="text-slate-900 font-bold text-sm">{objetChoisi.nom}</p>
              </div>
              <div className={`bg-white border-2 ${theme.border} rounded-xl p-4`}>
                <div className="text-4xl mb-2">{starChoisie.emoji}</div>
                <p className="text-slate-500 text-xs mb-1">⭐ Star</p>
                <p className="text-slate-900 font-bold text-sm">{starChoisie.nom}</p>
              </div>
            </div>

            <p className="text-slate-600 mb-8 leading-relaxed">
              Ton profil unique est prêt !<br />
              Commence ton aventure sur STMG HUB 🚀
            </p>

            <button onClick={terminer} disabled={chargement}
              className={`w-full ${theme.badge} text-white font-bold py-4 rounded-xl text-lg hover:opacity-90 transition-all`}>
              {chargement ? "⏳ Création du profil..." : "Lancer l'aventure 🚀"}
            </button>
          </div>
        </div>
      );
    }
  }

  return null;
}