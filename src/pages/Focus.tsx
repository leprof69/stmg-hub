import { useEffect, useMemo, useRef, useState } from "react";
import { auth, db } from "../services/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const COLORS = {
  page: "#F1F5F9",
  card: "#FFFFFF",
  border: "#E2E8F0",
  text: "#0F172A",
  muted: "#64748B",
  blue: "#2563EB",
  green: "#16A34A",
  orange: "#EA580C",
  red: "#DC2626",
  violet: "#7C3AED",
};

const FOCUS_PROGRESS_VERSION = 3;

const STORY = {
  title: "Fil rouge: moderniser le SI du PokéMart de Céladopole",
  context:
    "Tu es assistant de gestion. Le directeur veut mieux exploiter les données (ventes, stocks, clients) tout en respectant le RGPD.",
};

const EXERCISES = [
  {
    id: "focus-6-1",
    chapter: "Chapitre 6",
    matiere: "SDGN",
    theme: "Thème 2",
    difficulty: 1,
    type: "QCM",
    mode: "qcm",
    xp: 40,
    title: "Étape 1 - Comprendre le Big Data",
    contexte: "Le PokéMart reçoit des données de caisse, de stock et de commandes en ligne toutes les minutes.",
    objectif: "Identifier la bonne définition pour poser les bases du chapitre.",
    consigne: "Choisis la proposition la plus juste.",
    attendus: [
      "Repérer les caractéristiques majeures du Big Data.",
      "Justifier ton choix en 1 phrase après correction.",
    ],
    options: [
      "Un faible volume de données",
      "Un volume, une variété et une vélocité élevés",
      "Des données uniquement papier",
      "Des informations sans utilité pour la gestion de l'arène",
    ],
    correctOption: 1,
    correction: "Le Big Data repose sur les 5V, notamment volume, variété et vélocité.",
  },
  {
    id: "focus-6-2",
    chapter: "Chapitre 6",
    matiere: "SDGN",
    theme: "Thème 2",
    difficulty: 2,
    type: "Vrai/Faux",
    mode: "truefalse",
    xp: 50,
    title: "Étape 2 - Distinguer open data et données fermées",
    contexte: "La mairie de Céladopole veut publier des données de transport autour du centre commercial.",
    objectif: "Vérifier que tu distingues bien accès public et restrictions.",
    consigne: "Indique Vrai/Faux pour chaque affirmation.",
    attendus: [
      "Distinguer donnée publique et donnée fermée.",
      "Identifier ce qui peut être réutilisé légalement.",
    ],
    statements: [
      { text: "L'open data permet la réutilisation des données publiques.", expected: true },
      { text: "L'open data interdit toute diffusion.", expected: false },
      { text: "Une ville comme Safrania peut publier des jeux de données sur Internet.", expected: true },
    ],
    correction: "L'open data vise l'accès, la réutilisation et la diffusion des données publiques.",
  },
  {
    id: "focus-6-3",
    chapter: "Chapitre 6",
    matiere: "SDGN",
    theme: "Thème 2",
    difficulty: 3,
    type: "Texte à trous",
    mode: "fill",
    xp: 60,
    title: "Étape 3 - Passer de la donnée à la décision",
    contexte: "Le gérant reçoit des chiffres bruts mais ne sait pas toujours quoi en conclure.",
    objectif: "Remettre dans l'ordre les notions du cours.",
    consigne: "Complète les 3 mots manquants.",
    attendus: [
      "Utiliser le vocabulaire exact du chapitre.",
      "Comprendre le passage vers la décision managériale.",
    ],
    fillSentence: "La ... brute du Pokédex devient une ... grâce au contexte, puis une ... utile à la décision.",
    blanks: ["donnée", "information", "connaissance"],
    correction: "La transformation donnée -> information -> connaissance soutient la décision.",
  },
  {
    id: "focus-6-4",
    chapter: "Chapitre 6",
    matiere: "SDGN",
    theme: "Thème 2",
    difficulty: 4,
    type: "Classement",
    mode: "checklist",
    xp: 70,
    title: "Étape 4 - Trier les données personnelles",
    contexte: "L'application fidélité du PokéMart collecte plusieurs informations à l'inscription.",
    objectif: "Identifier ce qui est réellement une donnée personnelle.",
    consigne: "Coche uniquement les données personnelles.",
    checklist: [
      { label: "Nom et prénom du client", expected: true },
      { label: "Numéro de ticket anonyme", expected: false },
      { label: "Adresse email nominative", expected: true },
      { label: "Météo du jour à Jadielle", expected: false },
      { label: "Numéro de téléphone", expected: true },
    ],
    correction: "Une donnée personnelle permet d'identifier directement ou indirectement une personne.",
  },
  {
    id: "focus-6-5",
    chapter: "Chapitre 6",
    matiere: "SDGN",
    theme: "Thème 2",
    difficulty: 5,
    type: "Mini-cas",
    mode: "redaction",
    xp: 90,
    title: "Étape 5 - Diagnostiquer une erreur de SI",
    contexte: "Une mauvaise référence produit a été saisie dans le logiciel de commande.",
    objectif: "Mesurer les impacts opérationnels et proposer une correction réaliste.",
    consigne:
      "Donne 3 conséquences possibles pour le PokéMart puis propose 1 action corrective concrète.",
    attendus: [
      "Citer 3 impacts précis (client, logistique, coût).",
      "Proposer 1 action de contrôle qualité applicable.",
    ],
    correction:
      "Conséquences possibles: erreur logistique, litige client, coût supplémentaire. Action corrective: contrôle qualité de saisie et validation automatique au moment de la commande.",
    document: {
      type: "Ticket de caisse",
      title: "Extrait caisse PokéMart (12/06)",
      content: "- Hyper Ball x18\n- Potion x42\n- Rappel x6\n- 3 erreurs de référence signalées\n- Temps moyen caisse: 4 min 12",
    },
    expectedKeywords: ["erreur", "commande", "client", "cout", "controle", "qualite", "saisie"],
    expectedNumbers: [3],
  },
  {
    id: "focus-6-6",
    chapter: "Chapitre 6",
    matiere: "SDGN",
    theme: "Thème 2",
    difficulty: 6,
    type: "Application RGPD",
    mode: "redaction",
    xp: 110,
    title: "Étape 6 - Appliquer le RGPD",
    contexte: "Le site e-commerce du PokéMart veut ajouter de nouveaux champs au formulaire de commande.",
    objectif: "Appliquer le principe de minimisation des données.",
    consigne:
      "Distingue les données nécessaires (commande/livraison/paiement) des données non nécessaires, puis justifie brièvement.",
    attendus: [
      "Trier clairement nécessaires / non nécessaires.",
      "Justifier par la finalité RGPD.",
    ],
    correction:
      "Nécessaires: identité, adresse de livraison, paiement, contact. Non nécessaires: informations sans lien avec la finalité de la commande.",
    document: {
      type: "Formulaire web",
      title: "Prototype inscription boutique en ligne",
      content:
        "Champs actuels: nom, prénom, email, adresse, téléphone, date de naissance, Pokémon préféré, couleur favorite, coordonnées bancaires, pseudo réseau social.",
    },
    expectedKeywords: ["rgpd", "finalite", "necessaires", "commande", "livraison", "paiement", "minimisation"],
  },
  {
    id: "focus-6-6b",
    chapter: "Chapitre 6",
    matiere: "SDGN",
    theme: "Thème 2",
    difficulty: 7,
    type: "Liaison",
    mode: "matching",
    xp: 130,
    title: "Étape 6B - Relier notions et définitions",
    contexte: "Le directeur prépare une formation interne pour l'équipe.",
    objectif: "Vérifier la maîtrise du vocabulaire du chapitre.",
    consigne: "Relie chaque notion à sa bonne définition.",
    matchingLeft: ["Donnée", "Information", "Connaissance", "Open data"],
    matchingRight: [
      "Donnée publique accessible, réutilisable et diffusée",
      "Résultat interprété qui guide la décision",
      "Fait brut non encore contextualisé",
      "Donnée contextualisée qui prend du sens",
    ],
    matchingAnswer: [2, 3, 1, 0],
    correction: "Les notions doivent être distinguées précisément pour produire une analyse de gestion fiable.",
  },
  {
    id: "focus-6-7",
    chapter: "Chapitre 6",
    matiere: "SDGN",
    theme: "Thème 2",
    difficulty: 7,
    type: "QCM expert",
    mode: "qcm",
    xp: 120,
    title: "Étape 7 - Modéliser le SI",
    contexte: "Tu dois expliquer simplement le fonctionnement du SI au nouveau manager du magasin.",
    objectif: "Valider la chaîne fonctionnelle du SI.",
    consigne: "Quel enchaînement décrit correctement le rôle du système d'information ?",
    options: [
      "Collecte des données -> stockage -> traitement -> diffusion",
      "Diffusion -> suppression -> stockage -> collecte",
      "Traitement -> collecte -> oubli -> diffusion",
      "Stockage -> copie -> suppression -> décision automatique",
    ],
    correctOption: 0,
    correction: "Le SI suit la logique collecte, stockage, traitement puis diffusion de l'information.",
  },
  {
    id: "focus-6-7b",
    chapter: "Chapitre 6",
    matiere: "SDGN",
    theme: "Thème 2",
    difficulty: 8,
    type: "Memory",
    mode: "memory",
    xp: 140,
    title: "Étape 7B - Memory des notions clés",
    contexte: "Réunion flash avant audit qualité du SI.",
    objectif: "Mémoriser rapidement les concepts et leurs définitions.",
    consigne: "Trouve toutes les paires notion-définition avant de corriger.",
    memoryPairsCount: 4,
    memoryPairs: [
      { a: "Vélocité", b: "Vitesse de production et de circulation des données" },
      { a: "Véracité", b: "Niveau de fiabilité et de qualité des données" },
      { a: "SI", b: "Ressources humaines et techniques qui gèrent l'information" },
      { a: "RGPD", b: "Cadre juridique de protection des données personnelles" },
    ],
    correction: "Un bon niveau de mémorisation accélère l'analyse dans les cas pratiques.",
  },
  {
    id: "focus-6-8",
    chapter: "Chapitre 6",
    matiere: "SDGN",
    theme: "Thème 2",
    difficulty: 8,
    type: "Synthèse",
    mode: "redaction",
    xp: 150,
    title: "Étape 8 - Synthèse finale (cahier de vacances)",
    contexte: "Le directeur te demande un mini-rapport de fin de stage.",
    objectif: "Construire une réponse structurée et cohérente de niveau STMG.",
    consigne:
      "Rédige une synthèse de 12 à 15 lignes expliquant comment la donnée devient une ressource stratégique au PokéMart, avec les limites de qualité, d'accès et de conformité RGPD.",
    correction:
      "La synthèse doit relier Big Data, SI, transformation en connaissance, décision managériale et contraintes juridiques dans le cas de la Ligue/PokéMart.",
    document: {
      type: "Tableau de bord",
      title: "Indicateurs mensuels du PokéMart",
      content:
        "Ventes +18% ; ruptures de stock 14 ; erreurs de saisie 9 ; réclamations clients 27 ; disponibilité SI 92% (objectif 98%).",
    },
    expectedKeywords: ["big data", "si", "donnee", "information", "connaissance", "decision", "qualite", "rgpd"],
    expectedNumbers: [12],
  },
  {
    id: "focus-6-9",
    chapter: "Chapitre 6",
    matiere: "SDGN",
    theme: "Thème 2",
    difficulty: 10,
    type: "Analyse de document",
    mode: "docqa",
    xp: 180,
    title: "Étape 9 - Étude de document multi-questions",
    contexte: "Le directeur du PokéMart prépare un plan d'action trimestriel.",
    objectif: "Exploiter un document chiffré puis argumenter des choix de gestion.",
    consigne: "Réponds aux 4 questions en t'appuyant explicitement sur le document.",
    attendus: [
      "Citer des chiffres du tableau dans chaque réponse.",
      "Hiérarchiser risques et actions de gestion.",
    ],
    document: {
      type: "Tableau de bord trimestriel",
      title: "Performance SI & activité commerciale - T2",
      content:
        "Ventes: 428 000 Pokedollars (+11%)\nDisponibilité SI: 91% (objectif 98%)\nRuptures de stock: 19\nRéclamations clients: 34\nCommandes web: +22%\nErreurs de saisie: 12",
    },
    docQuestions: [
      { prompt: "Identifie deux signaux positifs de performance.", keywords: ["ventes", "11", "commandes", "22", "hausse", "positif"] },
      { prompt: "Identifie deux risques prioritaires pour la gestion.", keywords: ["disponibilite", "91", "objectif", "98", "ruptures", "reclamations", "risque"] },
      { prompt: "Explique le lien entre qualité des données et satisfaction client.", keywords: ["erreurs", "saisie", "qualite", "information", "client", "reclamations"] },
      { prompt: "Propose deux actions concrètes pour le prochain trimestre.", keywords: ["action", "controle", "formation", "stock", "si", "pilotage"] },
    ],
    correction:
      "Une bonne copie repère les signaux, hiérarchise les risques, relie données et expérience client, puis propose des actions réalistes et mesurables.",
  },
  {
    id: "focus-6-10",
    chapter: "Chapitre 6",
    matiere: "SDGN",
    theme: "Thème 2",
    difficulty: 11,
    type: "Mots croisés",
    mode: "crossword",
    xp: 190,
    title: "Étape 10 - Mots croisés des notions",
    contexte: "Révision finale avant le bilan du chapitre.",
    objectif: "Vérifier que le vocabulaire clé est parfaitement maîtrisé.",
    consigne: "Complète la grille: une case = une lettre. Les cases noires sont bloquées.",
    crosswordLayout: {
      rows: 13,
      cols: 11,
      words: [
        { number: 1, direction: "across", row: 1, col: 0, clue: "Donnée contextualisée qui prend du sens (11 lettres)", answer: "information" },
        { number: 2, direction: "down", row: 1, col: 3, clue: "Donnée publique réutilisable (4 lettres)", answer: "open" },
        { number: 3, direction: "across", row: 2, col: 1, clue: "Cadre juridique qui protège les données personnelles (4 lettres)", answer: "rgpd" },
        { number: 4, direction: "across", row: 5, col: 0, clue: "V des 5V lié à la rapidité des flux (8 lettres)", answer: "velocite" },
        { number: 5, direction: "down", row: 5, col: 2, clue: "Ressource du SI qui fait les calculs/traitements (8 lettres)", answer: "logiciel" },
      ],
    },
    correction: "Les mots attendus sont : RGPD, information, open, vélocité, logiciel.",
  },
];

const CHAPTER_CONTENT = {
  "Chapitre 6": {
    heroTitle: "☀️ Cahier de vacances — SDGN 1ère",
    heroText:
      "Parcours guidé avec activités variées reliées entre elles: tu accompagnes le PokéMart de Céladopole pour transformer ses données en décisions utiles.",
    notions: "Notions: donnée, information, SI, Big Data, open data, RGPD",
  },
};

const MODE_UI = {
  qcm: { border: "#2563EB", bg: "#EFF6FF", label: "QCM" },
  truefalse: { border: "#DC2626", bg: "#FEF2F2", label: "Vrai/Faux" },
  fill: { border: "#7C3AED", bg: "#F5F3FF", label: "Texte à trous" },
  checklist: { border: "#0F766E", bg: "#F0FDFA", label: "Tri / Checklist" },
  matching: { border: "#EA580C", bg: "#FFF7ED", label: "Liaison" },
  memory: { border: "#0B2447", bg: "#EFF6FF", label: "Memory" },
  docqa: { border: "#92400E", bg: "#FFFBEB", label: "Analyse doc" },
  redaction: { border: "#475569", bg: "#F8FAFC", label: "Rédaction" },
  crossword: { border: "#BE185D", bg: "#FFF1F2", label: "Mots croisés" },
};

const getTodayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
};

const normalize = (v = "") =>
  String(v).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();

const shuffleArray = (arr = []) => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const extractNumbers = (text = "") => {
  const matches = String(text).match(/-?\d+(?:[.,]\d+)?/g) || [];
  return matches.map((m) => Number(m.replace(",", "."))).filter((n) => Number.isFinite(n));
};

const buildCrosswordMeta = (exercise) => {
  const layout = exercise.crosswordLayout;
  if (!layout || !Array.isArray(layout.words)) return { activeCells: [], activeSet: new Set(), words: [] };
  const activeCells = [];
  const activeSet = new Set();
  const words = layout.words.map((word, idx) => {
    const answer = normalize(word.answer || "").replace(/\s+/g, "");
    const cells = [];
    for (let i = 0; i < answer.length; i += 1) {
      const r = word.direction === "down" ? word.row + i : word.row;
      const c = word.direction === "across" ? word.col + i : word.col;
      const key = `${r}-${c}`;
      cells.push({ r, c, key, expected: answer[i] });
      if (!activeSet.has(key)) {
        activeSet.add(key);
        activeCells.push({ r, c, key });
      }
    }
    return { ...word, answer, cells, number: word.number || idx + 1 };
  });
  return { activeCells, activeSet, words };
};

const evaluateRedaction = (exercise, answer) => {
  const clean = normalize(answer);
  if (!clean) return { score: 0, mention: "À travailler", pointsForts: "Réponse vide.", aAmeliorer: "Rédige une réponse structurée." };
  const expected = (exercise.expectedKeywords || []).map(normalize);
  const found = expected.filter((k) => clean.includes(k));
  const keywordRatio = expected.length ? found.length / expected.length : 0;
  let numberRatio = 1;
  if (exercise.expectedNumbers?.length) {
    const numbers = extractNumbers(answer);
    const matched = exercise.expectedNumbers.filter((e) => numbers.some((n) => Math.abs(n - e) <= Math.max(1, Math.abs(e) * 0.02)));
    numberRatio = matched.length / exercise.expectedNumbers.length;
  }
  const structure = answer.length >= 220 ? 1 : answer.length >= 120 ? 0.8 : answer.length >= 70 ? 0.6 : 0.3;
  const raw = (keywordRatio * 7) + (numberRatio * 2) + structure;
  const score = Math.max(2, Math.min(10, Math.round(raw * 10) / 10));
  return {
    score,
    mention: score >= 8 ? "Très bien" : score >= 6 ? "Bon travail" : score >= 4 ? "Passable" : "À travailler",
    pointsForts: found.length ? `Notions trouvées: ${found.slice(0, 5).join(", ")}.` : "Tu as bien commencé.",
    aAmeliorer: found.length < Math.max(2, Math.floor(expected.length / 2)) ? "Ajoute davantage de vocabulaire du cours et un exemple concret." : "Ajoute une conclusion de gestion claire.",
  };
};

const evaluateInteractive = (exercise, state) => {
  if (exercise.mode === "qcm") {
    const ok = state.selected === exercise.correctOption;
    return { score: ok ? 10 : 3, mention: ok ? "Très bien" : "À retravailler", pointsForts: ok ? "Bonne réponse." : "Tu as répondu.", aAmeliorer: ok ? "Passe à l'exercice suivant." : "Relis la définition associée." };
  }
  if (exercise.mode === "truefalse") {
    const total = exercise.statements.length;
    const good = exercise.statements.filter((s, i) => state.tf[i] === s.expected).length;
    const score = Math.round((good / total) * 10);
    return { score, mention: score >= 8 ? "Très bien" : "Bon travail", pointsForts: `${good}/${total} affirmations correctes.`, aAmeliorer: score < 8 ? "Revois les affirmations fausses et leur justification." : "Excellent rythme." };
  }
  if (exercise.mode === "fill") {
    const good = exercise.blanks.filter((b, i) => normalize(state.blanks[i]) === normalize(b)).length;
    const total = exercise.blanks.length;
    const score = Math.round((good / total) * 10);
    return { score, mention: score >= 8 ? "Très bien" : "Bon travail", pointsForts: `${good}/${total} mots bien placés.`, aAmeliorer: score < 8 ? "Revois le vocabulaire de la chaîne d'information." : "Parfait." };
  }
  if (exercise.mode === "checklist") {
    const total = exercise.checklist.length;
    const good = exercise.checklist.filter((item, i) => Boolean(state.checks[i]) === item.expected).length;
    const score = Math.round((good / total) * 10);
    return { score, mention: score >= 8 ? "Très bien" : "Bon travail", pointsForts: `${good}/${total} choix corrects.`, aAmeliorer: score < 8 ? "Distingue mieux les données personnelles des données neutres." : "Très bon tri." };
  }
  if (exercise.mode === "matching") {
    const total = exercise.matchingLeft.length;
    const good = exercise.matchingLeft.filter((_, i) => Number(state.matches[i]) === Number(exercise.matchingAnswer[i])).length;
    const score = Math.round((good / total) * 10);
    return {
      score,
      mention: score >= 8 ? "Très bien" : score >= 6 ? "Bon travail" : "À retravailler",
      pointsForts: `${good}/${total} liaisons correctes.`,
      aAmeliorer: score < 8 ? "Revois les définitions du chapitre pour sécuriser chaque association." : "Associations solides.",
    };
  }
  if (exercise.mode === "memory") {
    const solved = Number(state.memorySolved || 0);
    const total = Number(exercise.memoryPairsCount || 1);
    const turns = Math.max(1, Number(state.memoryTurns || 1));
    const base = Math.round((solved / total) * 8);
    const bonus = turns <= total + 2 ? 2 : turns <= total + 5 ? 1 : 0;
    const score = Math.min(10, base + bonus);
    return {
      score,
      mention: score >= 8 ? "Très bien" : score >= 6 ? "Bon travail" : "À retravailler",
      pointsForts: `${solved}/${total} paires trouvées.`,
      aAmeliorer: turns > total + 4 ? "Essaie d'observer plus finement le document avant de retourner les cartes." : "Bonne mémorisation des notions.",
    };
  }
  if (exercise.mode === "docqa") {
    const answers = exercise.docQuestions || [];
    const scoreParts = answers.map((q, i) => {
      const ans = normalize((state.docAnswers && state.docAnswers[i]) || "");
      if (!ans) return 0;
      const expected = (q.keywords || []).map(normalize);
      const hits = expected.filter((k) => ans.includes(k)).length;
      const ratio = expected.length ? hits / expected.length : 0;
      return Math.min(1, ratio + (ans.length >= 70 ? 0.2 : 0));
    });
    const avg = scoreParts.length ? scoreParts.reduce((a, b) => a + b, 0) / scoreParts.length : 0;
    const score = Math.max(2, Math.min(10, Math.round(avg * 10)));
    return {
      score,
      mention: score >= 8 ? "Très bien" : score >= 6 ? "Bon travail" : "À retravailler",
      pointsForts: `${scoreParts.filter((p) => p >= 0.6).length}/${scoreParts.length} réponses bien argumentées.`,
      aAmeliorer: score < 8 ? "Appuie davantage chaque réponse sur le document et le vocabulaire du cours." : "Analyse solide et structurée.",
    };
  }
  if (exercise.mode === "crossword") {
    const meta = buildCrosswordMeta(exercise);
    const words = meta.words || [];
    const good = words.filter((word) => {
      const proposed = word.cells.map((cell) => normalize((state.crosswordCells && state.crosswordCells[cell.key]) || "").charAt(0)).join("");
      return proposed === word.answer;
    }).length;
    const total = words.length || 1;
    const score = Math.round((good / total) * 10);
    return {
      score,
      mention: score >= 8 ? "Très bien" : score >= 6 ? "Bon travail" : "À retravailler",
      pointsForts: `${good}/${total} mots corrects.`,
      aAmeliorer: score < 8 ? "Reprends les définitions du vocabulaire du chapitre." : "Vocabulaire bien maîtrisé.",
    };
  }
  return evaluateRedaction(exercise, state.text || "");
};

function FocusCard({ exercise, claim, onClaimXP, index, total }) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [locked, setLocked] = useState(false);
  const [localInfo, setLocalInfo] = useState("");
  const [selected, setSelected] = useState(null);
  const [tf, setTf] = useState({});
  const [blanks, setBlanks] = useState({});
  const [checks, setChecks] = useState({});
  const [matches, setMatches] = useState({});
  const [memoryDeck, setMemoryDeck] = useState([]);
  const [memoryFlipped, setMemoryFlipped] = useState([]);
  const [memorySolved, setMemorySolved] = useState({});
  const [memoryTurns, setMemoryTurns] = useState(0);
  const [docAnswers, setDocAnswers] = useState({});
  const [crosswordCells, setCrosswordCells] = useState({});
  const [activeCrosswordWord, setActiveCrosswordWord] = useState(null);
  const [text, setText] = useState("");
  const crosswordMeta = useMemo(() => buildCrosswordMeta(exercise), [exercise]);
  const crosswordInputRefs = useRef({});

  useEffect(() => {
    if (exercise.mode !== "memory") return;
    const cards = [];
    (exercise.memoryPairs || []).forEach((pair, pairIndex) => {
      cards.push({ id: `${exercise.id}-a-${pairIndex}`, text: pair.a, pairKey: `p-${pairIndex}` });
      cards.push({ id: `${exercise.id}-b-${pairIndex}`, text: pair.b, pairKey: `p-${pairIndex}` });
    });
    setMemoryDeck(shuffleArray(cards));
    setMemoryFlipped([]);
    setMemorySolved({});
    setMemoryTurns(0);
  }, [exercise.id, exercise.mode, exercise.memoryPairs]);

  const today = getTodayKey();
  const alreadyClaimed = claim?.lastClaimDate === today;
  const canClaim = !alreadyClaimed && result && result.score >= 5;
  const canEvaluate =
    !locked &&
    ((exercise.mode === "qcm" && selected !== null) ||
      (exercise.mode === "truefalse" && exercise.statements.every((_, i) => tf[i] !== undefined)) ||
      (exercise.mode === "fill" && exercise.blanks.every((_, i) => (blanks[i] || "").trim().length > 0)) ||
      (exercise.mode === "checklist" && Object.keys(checks).length === exercise.checklist.length) ||
      (exercise.mode === "matching" && exercise.matchingLeft.every((_, i) => matches[i] !== undefined && matches[i] !== "")) ||
      (exercise.mode === "memory" && Object.keys(memorySolved).length === (exercise.memoryPairsCount || 0)) ||
      (exercise.mode === "docqa" && (exercise.docQuestions || []).every((_, i) => (docAnswers[i] || "").trim().length >= 12)) ||
      (exercise.mode === "crossword" && crosswordMeta.activeCells.every((cell) => (crosswordCells[cell.key] || "").trim().length >= 1)) ||
      (exercise.mode === "redaction" && text.trim().length >= 40));

  const validate = () => {
    const next = evaluateInteractive(exercise, {
      selected, tf, blanks, checks, matches, text,
      docAnswers,
      crosswordCells,
      memorySolved: Object.keys(memorySolved).length,
      memoryTurns,
    });
    setResult(next);
    setLocked(true);
  };

  const handleMemoryFlip = (idx) => {
    if (locked || exercise.mode !== "memory") return;
    const card = memoryDeck[idx];
    if (!card) return;
    if (memorySolved[card.pairKey]) return;
    if (memoryFlipped.includes(idx)) return;
    if (memoryFlipped.length >= 2) return;
    const nextFlipped = [...memoryFlipped, idx];
    setMemoryFlipped(nextFlipped);
    if (nextFlipped.length === 2) {
      setMemoryTurns((v) => v + 1);
      const [i1, i2] = nextFlipped;
      const c1 = memoryDeck[i1];
      const c2 = memoryDeck[i2];
      if (c1 && c2 && c1.pairKey === c2.pairKey) {
        setMemorySolved((prev) => ({ ...prev, [c1.pairKey]: true }));
        setTimeout(() => setMemoryFlipped([]), 250);
      } else {
        setTimeout(() => setMemoryFlipped([]), 700);
      }
    }
  };

  const claimXp = async () => {
    if (!canClaim) return;
    setLoading(true);
    try {
      const ok = await onClaimXP(exercise.id, exercise.xp);
      if (!ok) setLocalInfo("Échec de validation. Réessaie.");
    } finally {
      setLoading(false);
    }
  };

  const modeStyle = MODE_UI[exercise.mode] || MODE_UI.redaction;
  const crosswordRows = exercise.crosswordLayout?.rows || 0;
  const crosswordCols = exercise.crosswordLayout?.cols || 0;
  const crosswordNumbers = useMemo(() => {
    const map = {};
    crosswordMeta.words.forEach((word) => {
      const key = `${word.row}-${word.col}`;
      if (!map[key]) map[key] = [];
      map[key].push(word.number);
    });
    return map;
  }, [crosswordMeta.words]);
  const activeCellSet = useMemo(() => {
    if (!activeCrosswordWord || !Array.isArray(activeCrosswordWord.cells)) return new Set();
    return new Set(activeCrosswordWord.cells.map((cell) => cell.key));
  }, [activeCrosswordWord]);
  const getActiveWordForCell = (cellKey) => {
    if (activeCrosswordWord?.cells?.some((cell) => cell.key === cellKey)) return activeCrosswordWord;
    return crosswordMeta.words.find((word) => word.cells.some((cell) => cell.key === cellKey)) || null;
  };
  const focusCrosswordCell = (cellKey) => {
    const ref = crosswordInputRefs.current[cellKey];
    if (ref) ref.focus();
  };
  const moveCrosswordFocus = (cellKey, direction = 1) => {
    const word = getActiveWordForCell(cellKey);
    if (!word) return;
    const index = word.cells.findIndex((cell) => cell.key === cellKey);
    if (index === -1) return;
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= word.cells.length) return;
    focusCrosswordCell(word.cells[nextIndex].key);
  };
  const clearActiveWord = () => {
    if (!activeCrosswordWord?.cells?.length) return;
    setCrosswordCells((prev) => {
      const next = { ...prev };
      activeCrosswordWord.cells.forEach((cell) => {
        next[cell.key] = "";
      });
      return next;
    });
    focusCrosswordCell(activeCrosswordWord.cells[0].key);
  };

  return (
    <div style={{ background: COLORS.card, border: `2px solid ${modeStyle.border}55`, borderLeft: `8px solid ${modeStyle.border}`, borderRadius: 18, padding: 18, boxShadow: "0 6px 24px rgba(15,23,42,0.05)" }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
        <span style={{ borderRadius: 999, padding: "4px 10px", background: "#EEF2FF", color: COLORS.violet, fontWeight: 700, fontSize: 12 }}>Activité {index + 1}/{total}</span>
        <span style={{ borderRadius: 999, padding: "4px 10px", background: "#DBEAFE", color: "#1D4ED8", fontWeight: 700, fontSize: 12 }}>Niveau {exercise.difficulty}</span>
        <span style={{ borderRadius: 999, padding: "4px 10px", background: modeStyle.bg, color: modeStyle.border, fontWeight: 800, fontSize: 12 }}>{modeStyle.label}</span>
        <span style={{ borderRadius: 999, padding: "4px 10px", background: "#DCFCE7", color: "#166534", fontWeight: 700, fontSize: 12 }}>+{exercise.xp} XP</span>
      </div>
      <h3 style={{ margin: "0 0 8px", color: COLORS.text }}>{exercise.title}</h3>
      {exercise.contexte && (
        <p style={{ margin: "0 0 6px", color: "#334155", lineHeight: 1.5 }}>
          <strong>Contexte :</strong> {exercise.contexte}
        </p>
      )}
      {exercise.objectif && (
        <p style={{ margin: "0 0 6px", color: "#0F766E", lineHeight: 1.5 }}>
          <strong>Objectif :</strong> {exercise.objectif}
        </p>
      )}
      <p style={{ margin: "0 0 10px", color: COLORS.muted, lineHeight: 1.5 }}>
        <strong>Consigne :</strong> {exercise.consigne}
      </p>
      {Array.isArray(exercise.attendus) && exercise.attendus.length > 0 && (
        <div style={{ marginBottom: 10, background: "#F8FAFC", border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 10 }}>
          <p style={{ margin: "0 0 6px", color: "#0F766E", fontWeight: 800 }}>✅ Ce qui est attendu</p>
          <ul style={{ margin: 0, paddingLeft: 18, color: "#334155", fontSize: 14, lineHeight: 1.5 }}>
            {exercise.attendus.map((item, idx) => (
              <li key={`${exercise.id}-attendu-${idx}`}>{item}</li>
            ))}
          </ul>
        </div>
      )}
      {exercise.document && (
        <div style={{ marginBottom: 10, background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 10, padding: 10 }}>
          <p style={{ margin: "0 0 4px", color: "#92400E", fontWeight: 800 }}>
            📄 Document ({exercise.document.type}) : {exercise.document.title}
          </p>
          <p style={{ margin: 0, color: "#78350F", fontSize: 14, whiteSpace: "pre-line" }}>{exercise.document.content}</p>
        </div>
      )}

      {exercise.mode === "qcm" && (
        <div style={{ display: "grid", gap: 8 }}>
          {exercise.options.map((opt, idx) => (
            <button key={opt} disabled={locked} onClick={() => setSelected(idx)} style={{ textAlign: "left", borderRadius: 10, border: `1px solid ${selected === idx ? COLORS.blue : COLORS.border}`, background: selected === idx ? "#EFF6FF" : "white", padding: "10px 12px", cursor: locked ? "default" : "pointer" }}>
              {String.fromCharCode(65 + idx)}. {opt}
            </button>
          ))}
        </div>
      )}

      {exercise.mode === "truefalse" && (
        <div style={{ display: "grid", gap: 8 }}>
          {exercise.statements.map((row, i) => (
            <div key={row.text} style={{ border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 10 }}>
              <p style={{ margin: "0 0 8px", color: COLORS.text }}>{row.text}</p>
              <div style={{ display: "flex", gap: 8 }}>
                <button disabled={locked} onClick={() => setTf((p) => ({ ...p, [i]: true }))} style={{ borderRadius: 8, border: "none", padding: "6px 10px", background: tf[i] === true ? COLORS.green : "#E2E8F0", color: tf[i] === true ? "white" : "#334155" }}>Vrai</button>
                <button disabled={locked} onClick={() => setTf((p) => ({ ...p, [i]: false }))} style={{ borderRadius: 8, border: "none", padding: "6px 10px", background: tf[i] === false ? COLORS.red : "#E2E8F0", color: tf[i] === false ? "white" : "#334155" }}>Faux</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {exercise.mode === "fill" && (
        <div style={{ display: "grid", gap: 8 }}>
          <p style={{ margin: 0, color: "#334155" }}>{exercise.fillSentence}</p>
          {exercise.blanks.map((_, i) => (
            <input key={i} disabled={locked} value={blanks[i] || ""} onChange={(e) => setBlanks((p) => ({ ...p, [i]: e.target.value }))} placeholder={`Mot ${i + 1}`} style={{ borderRadius: 10, border: `1px solid ${COLORS.border}`, padding: "10px" }} />
          ))}
        </div>
      )}

      {exercise.mode === "checklist" && (
        <div style={{ display: "grid", gap: 6 }}>
          {exercise.checklist.map((item, i) => (
            <label key={item.label} style={{ display: "flex", gap: 8, alignItems: "center", background: "#F8FAFC", border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "8px 10px" }}>
              <input type="checkbox" disabled={locked} checked={Boolean(checks[i])} onChange={(e) => setChecks((p) => ({ ...p, [i]: e.target.checked }))} />
              <span>{item.label}</span>
            </label>
          ))}
        </div>
      )}

      {exercise.mode === "matching" && (
        <div style={{ display: "grid", gap: 8 }}>
          {exercise.matchingLeft.map((leftItem, i) => (
            <div key={`${leftItem}-${i}`} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, alignItems: "center" }}>
              <p style={{ margin: 0, color: "#1F2937", fontWeight: 700 }}>{leftItem}</p>
              <select
                disabled={locked}
                value={matches[i] ?? ""}
                onChange={(e) => setMatches((p) => ({ ...p, [i]: e.target.value }))}
                style={{ borderRadius: 8, border: `1px solid ${COLORS.border}`, padding: "8px" }}
              >
                <option value="">Choisir une définition...</option>
                {exercise.matchingRight.map((rightItem, rightIdx) => (
                  <option key={`${rightItem}-${rightIdx}`} value={rightIdx}>{rightItem}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}

      {exercise.mode === "memory" && (
        <div>
          <p style={{ margin: "0 0 8px", color: "#334155", fontSize: 13 }}>
            Retourne les cartes pour associer chaque notion à sa définition. Tours joués : {memoryTurns}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 8 }}>
            {memoryDeck.map((card, idx) => {
              const isOpen = memoryFlipped.includes(idx) || memorySolved[card.pairKey];
              return (
                <button
                  key={card.id}
                  onClick={() => handleMemoryFlip(idx)}
                  disabled={locked || memorySolved[card.pairKey]}
                  style={{
                    minHeight: 74,
                    borderRadius: 10,
                    border: `1px solid ${isOpen ? "#93C5FD" : COLORS.border}`,
                    background: isOpen ? "#EFF6FF" : "#0B2447",
                    color: isOpen ? "#1E3A8A" : "#BFDBFE",
                    padding: 8,
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {isOpen ? card.text : "🃏 Mémo"}
                </button>
              );
            })}
          </div>
          <p style={{ margin: "8px 0 0", color: "#64748B", fontSize: 12 }}>
            Paires trouvées : {Object.keys(memorySolved).length}/{exercise.memoryPairsCount || 0}
          </p>
        </div>
      )}

      {exercise.mode === "redaction" && (
        <>
          <textarea
            value={text}
            onChange={(e) => {
              if (!locked) setText(e.target.value);
            }}
            readOnly={locked}
            placeholder="Rédige ta réponse..."
            style={{ width: "100%", minHeight: 130, marginTop: 6, borderRadius: 10, border: `1px solid ${COLORS.border}`, padding: 10, resize: "vertical", boxSizing: "border-box" }}
          />
          <p style={{ margin: "6px 0 0", color: "#64748B", fontSize: 12 }}>Minimum conseillé: 40 caractères.</p>
        </>
      )}

      {exercise.mode === "docqa" && (
        <div style={{ display: "grid", gap: 10 }}>
          {(exercise.docQuestions || []).map((q, i) => (
            <div key={`${exercise.id}-q-${i}`} style={{ border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 10, background: "#F8FAFC" }}>
              <p style={{ margin: "0 0 6px", color: "#0F172A", fontWeight: 700 }}>
                Question {i + 1} : {q.prompt}
              </p>
              <textarea
                value={docAnswers[i] || ""}
                onChange={(e) => {
                  if (!locked) setDocAnswers((prev) => ({ ...prev, [i]: e.target.value }));
                }}
                readOnly={locked}
                placeholder="Réponse argumentée à partir du document..."
                style={{ width: "100%", minHeight: 78, borderRadius: 8, border: `1px solid ${COLORS.border}`, padding: 8, boxSizing: "border-box" }}
              />
            </div>
          ))}
          <p style={{ margin: "2px 0 0", color: "#64748B", fontSize: 12 }}>
            Conseil: cite au moins un élément chiffré ou factuel du document dans chaque réponse.
          </p>
        </div>
      )}

      {exercise.mode === "crossword" && (
        <div style={{ display: "grid", gap: 10 }}>
          <div style={{ overflowX: "auto", borderRadius: 10, border: "1px solid #FBCFE8", background: "#FFF1F2", padding: 10 }}>
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${crosswordCols}, 34px)`, gap: 2, justifyContent: "start" }}>
              {Array.from({ length: crosswordRows }).map((_, r) =>
                Array.from({ length: crosswordCols }).map((__, c) => {
                  const key = `${r}-${c}`;
                  const isActive = crosswordMeta.activeSet.has(key);
                  const val = crosswordCells[key] || "";
                  const nums = crosswordNumbers[key] || [];
                  return (
                    <div
                      key={key}
                      style={{
                        width: 34,
                        height: 34,
                        position: "relative",
                        borderRadius: 4,
                        background: !isActive ? "#334155" : activeCellSet.has(key) ? "#FFE4E6" : "white",
                        border: !isActive ? "1px solid #334155" : activeCellSet.has(key) ? "1px solid #F472B6" : "1px solid #F9A8D4",
                      }}
                    >
                      {isActive && nums.length > 0 && (
                        <span style={{ position: "absolute", top: 1, left: 3, fontSize: 9, color: "#9D174D", fontWeight: 700 }}>
                          {nums.join(",")}
                        </span>
                      )}
                      {isActive && (
                        <input
                          ref={(el) => {
                            if (el) crosswordInputRefs.current[key] = el;
                          }}
                          value={val}
                          onChange={(e) => {
                            if (locked) return;
                            const next = normalize(e.target.value).slice(0, 1).toUpperCase();
                            setCrosswordCells((prev) => ({ ...prev, [key]: next }));
                            if (next) {
                              setTimeout(() => moveCrosswordFocus(key, 1), 0);
                            }
                          }}
                          onFocus={() => {
                            const word = getActiveWordForCell(key);
                            if (word) setActiveCrosswordWord(word);
                          }}
                          onKeyDown={(e) => {
                            if (locked) return;
                            if (e.key === "Backspace") {
                              if ((crosswordCells[key] || "").length > 0) {
                                setCrosswordCells((prev) => ({ ...prev, [key]: "" }));
                              } else {
                                moveCrosswordFocus(key, -1);
                              }
                              e.preventDefault();
                            }
                            if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                              moveCrosswordFocus(key, 1);
                              e.preventDefault();
                            }
                            if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                              moveCrosswordFocus(key, -1);
                              e.preventDefault();
                            }
                          }}
                          readOnly={locked}
                          style={{ width: "100%", height: "100%", border: "none", outline: "none", textAlign: "center", background: "transparent", color: "#9D174D", fontWeight: 800, fontSize: 15, textTransform: "uppercase", paddingTop: 4 }}
                        />
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={clearActiveWord}
              disabled={locked || !activeCrosswordWord}
              style={{
                border: "1px solid #F9A8D4",
                borderRadius: 8,
                padding: "7px 10px",
                fontSize: 12,
                fontWeight: 700,
                color: "#9D174D",
                background: locked || !activeCrosswordWord ? "#F8FAFC" : "white",
                cursor: locked || !activeCrosswordWord ? "not-allowed" : "pointer",
              }}
            >
              Effacer le mot actif
            </button>
          </div>
          <div style={{ display: "grid", gap: 6 }}>
            {crosswordMeta.words.map((word) => (
              <button
                key={`${exercise.id}-cw-${word.number}`}
                type="button"
                onClick={() => {
                  setActiveCrosswordWord(word);
                  const firstCell = word.cells?.[0];
                  if (firstCell) {
                    const firstRef = crosswordInputRefs.current[firstCell.key];
                    if (firstRef) firstRef.focus();
                  }
                }}
                style={{
                  border: `1px solid ${activeCrosswordWord?.number === word.number ? "#EC4899" : COLORS.border}`,
                  borderRadius: 10,
                  padding: 10,
                  background: activeCrosswordWord?.number === word.number ? "#FCE7F3" : "#FFF1F2",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <p style={{ margin: 0, color: "#9D174D", fontWeight: 700 }}>
                  {word.number}. ({word.direction === "across" ? "Horizontal" : "Vertical"}) {word.clue}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
        <button onClick={validate} disabled={!canEvaluate} style={{ border: "none", borderRadius: 10, padding: "9px 12px", fontWeight: 700, background: canEvaluate ? COLORS.blue : "#CBD5E1", color: "white", cursor: canEvaluate ? "pointer" : "not-allowed" }}>
          Corriger
        </button>
        <button onClick={claimXp} disabled={!canClaim || loading} style={{ border: "none", borderRadius: 10, padding: "9px 12px", fontWeight: 700, background: canClaim ? COLORS.green : "#CBD5E1", color: "white", cursor: canClaim ? "pointer" : "not-allowed" }}>
          {alreadyClaimed ? "XP déjà pris" : loading ? "Validation..." : `Valider +${exercise.xp} XP`}
        </button>
      </div>
      {(localInfo || (alreadyClaimed && "XP déjà validés aujourd'hui pour cet exercice.")) && (
        <p style={{ margin: "6px 0 0", color: "#64748B", fontSize: 12 }}>{localInfo || "XP déjà validés aujourd'hui pour cet exercice."}</p>
      )}

      {result && (
        <div style={{ marginTop: 10, borderRadius: 10, border: "1px solid #BFDBFE", background: "#EFF6FF", padding: 10 }}>
          <p style={{ margin: 0, color: "#1E3A8A", fontWeight: 800 }}>Score: {result.score}/10 — {result.mention}</p>
          <p style={{ margin: "6px 0 0", color: "#166534" }}><strong>Points forts:</strong> {result.pointsForts}</p>
          <p style={{ margin: "6px 0 0", color: "#9A3412" }}><strong>À améliorer:</strong> {result.aAmeliorer}</p>
          <p style={{ margin: "8px 0 0", color: "#92400E", background: "#FFFBEB", border: "1px solid #FCD34D", borderRadius: 8, padding: 8 }}>
            <strong>Correction attendue:</strong> {exercise.correction}
          </p>
        </div>
      )}
    </div>
  );
}

export default function Focus({ onXPGagne }) {
  const [claims, setClaims] = useState({});
  const [banner, setBanner] = useState(null);
  const [chapitreSelectionne, setChapitreSelectionne] = useState("Chapitre 6");
  const exercicesFiltres = useMemo(() => EXERCISES.filter((e) => e.chapter === chapitreSelectionne).sort((a, b) => a.difficulty - b.difficulty), [chapitreSelectionne]);
  const chapterUI = CHAPTER_CONTENT[chapitreSelectionne] || CHAPTER_CONTENT["Chapitre 6"];
  const xpPotential = useMemo(() => exercicesFiltres.reduce((sum, ex) => sum + ex.xp, 0), [exercicesFiltres]);
  const total = exercicesFiltres.length;
  const done = exercicesFiltres.filter((ex) => claims[ex.id]?.lastClaimDate).length;
  const progress = total ? Math.round((done / total) * 100) : 0;

  useEffect(() => {
    const load = async () => {
      const user = auth.currentUser;
      if (!user) return;
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (!snap.exists()) return;
        const progressData = snap.data()?.focusProgress || {};
        const isCurrent = progressData?.version === FOCUS_PROGRESS_VERSION;
        setClaims(isCurrent ? progressData.claims || {} : {});
      } catch (err) {
        console.error("Chargement focus impossible", err);
      }
    };
    load();
  }, []);

  const handleClaimXP = async (exerciseId, xp) => {
    const user = auth.currentUser;
    if (!user) {
      setBanner({ type: "error", text: "Session expirée. Reconnecte-toi." });
      return false;
    }
    try {
      const today = getTodayKey();
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      if (!snap.exists()) return false;
      const data = snap.data();
      const stored = data.focusProgress || {};
      const prev = stored?.version === FOCUS_PROGRESS_VERSION ? (stored.claims || {}) : {};
      if (prev[exerciseId]?.lastClaimDate === today) {
        setBanner({ type: "error", text: "XP déjà validés aujourd'hui pour cet exercice." });
        return false;
      }
      const nextClaims = { ...prev, [exerciseId]: { lastClaimDate: today, totalClaims: (prev[exerciseId]?.totalClaims || 0) + 1 } };
      await updateDoc(ref, {
        xp: (data.xp || 0) + xp,
        focusProgress: { ...(stored || {}), version: FOCUS_PROGRESS_VERSION, chapter: `SDGN 1ère - ${chapitreSelectionne}`, claims: nextClaims },
      });
      setClaims(nextClaims);
      setBanner({ type: "success", text: `+${xp} XP gagnés sur le cahier de vacances.` });
      if (onXPGagne) onXPGagne();
      return true;
    } catch (err) {
      console.error("Validation XP Focus impossible", err);
      setBanner({ type: "error", text: "Validation impossible pour le moment." });
      return false;
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: COLORS.page, padding: "22px 14px 28px", color: COLORS.text }}>
      <div style={{ maxWidth: 980, margin: "0 auto", display: "grid", gap: 14 }}>
        {banner && (
          <div style={{ background: banner.type === "success" ? "#DCFCE7" : "#FEE2E2", color: banner.type === "success" ? "#166534" : COLORS.red, border: `1px solid ${banner.type === "success" ? "#86EFAC" : "#FECACA"}`, borderRadius: 12, padding: "10px 12px", fontWeight: 700 }}>
            {banner.text}
          </div>
        )}

        <section style={{ background: "linear-gradient(135deg, #0B2447, #1D4ED8)", borderRadius: 22, padding: 22, color: "white" }}>
          <h1 style={{ margin: "0 0 6px", fontSize: "2rem" }}>{chapterUI.heroTitle}</h1>
          <p style={{ margin: "0 0 10px", color: "#DBEAFE", lineHeight: 1.5 }}>{chapterUI.heroText}</p>
          <div style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(191,219,254,0.45)", borderRadius: 12, padding: "10px 12px", marginBottom: 10 }}>
            <p style={{ margin: "0 0 4px", fontWeight: 800, color: "#E0F2FE" }}>{STORY.title}</p>
            <p style={{ margin: 0, color: "#BFDBFE", fontSize: 14 }}>{STORY.context}</p>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <span style={{ background: "rgba(255,255,255,0.16)", borderRadius: 999, padding: "6px 12px", fontWeight: 700 }}>{chapterUI.notions}</span>
            <span style={{ background: "rgba(16,185,129,0.25)", borderRadius: 999, padding: "6px 12px", fontWeight: 700 }}>XP potentiel: +{xpPotential}</span>
            <span style={{ background: "rgba(124,58,237,0.25)", borderRadius: 999, padding: "6px 12px", fontWeight: 700 }}>{total} activités</span>
          </div>
          <div style={{ marginTop: 12, background: "rgba(255,255,255,0.2)", borderRadius: 999, height: 10 }}>
            <div style={{ width: `${progress}%`, height: "100%", borderRadius: 999, background: "linear-gradient(90deg, #22C55E, #84CC16)" }} />
          </div>
          <p style={{ margin: "6px 0 0", color: "#BFDBFE", fontSize: 13 }}>Progression du cahier: {done}/{total} ({progress}%)</p>
          <div style={{ marginTop: 10 }}>
            <select value={chapitreSelectionne} onChange={(e) => setChapitreSelectionne(e.target.value)} style={{ borderRadius: 10, border: "1px solid #93C5FD", padding: "8px 10px", fontWeight: 700 }}>
              <option value="Chapitre 6">Chapitre 6 - Information numérique</option>
            </select>
          </div>
        </section>

        <section style={{ display: "grid", gap: 10 }}>
          {exercicesFiltres.map((exercise, index) => (
            <FocusCard key={exercise.id} exercise={exercise} claim={claims[exercise.id]} onClaimXP={handleClaimXP} index={index} total={exercicesFiltres.length} />
          ))}
        </section>
      </div>
    </div>
  );
}

