import { useState, useEffect, useMemo } from "react";
import { auth, db } from "../firebase";
import { doc, updateDoc, getDoc, collection, getDocs } from "firebase/firestore";

const COLORS = {
  S: "#3B82F6", T: "#0284C7", M: "#F97316",
  G: "#10B981", H: "#EF4444", U: "#F59E0B", B: "#06B6D4",
};
const MISSION_ENGINE_VERSION = "strict-v7-2026-04-22";
const MISSION_XP_MULTIPLIER = 1.35;
const MISSION_XP_MIN = { quotidienne: 200, hebdomadaire: 300, mensuelle: 500 };
const MISSION_CAS_SILPH_ID = "mission-etude-cas-silph-sarl";

const getDateJour = () => {
  const today = new Date();
  return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
};

const missionDejaFaite = (profil, missionId) => {
  const historique = profil.missionsHistorique || {};
  const entree = historique[missionId];
  return Boolean(entree);
};

const getMissionXPBase = (mission) => {
  const xpSource = Number(mission?.xp) || 0;
  const minimum = MISSION_XP_MIN[mission?.type] || 0;
  return Math.max(xpSource, minimum);
};

const getCategorieDifficulte = (mission) => {
  const difficulte = Math.max(1, Math.min(5, Number(mission?.difficulte) || 1));
  return difficulte <= 2 ? "facile" : "difficile";
};

const MISSION_CAS_SILPH = {
  id: MISSION_CAS_SILPH_ID,
  titre: "Étude de cas - SI de la Silph SARL",
  emoji: "🏢",
  niveau: "premiere",
  matiere: "CAS SILPH",
  theme: "Système d'information",
  chapitre: "Chapitre 6 - L'information numérique",
  difficulte: 5,
  ordre: 1,
  type: "mensuelle",
  xp: 7407,
  xp_max: 10000,
  contexte: `Contexte : La révolution Silph-Scanner
La Silph SARL, joyau technologique de la ville de Safrania, fait face à une menace sans précédent. La Team Rocket a lancé sa propre application "Rocket-Map", capturant les données des dresseurs de manière illégale pour dominer le marché.
Pour répliquer, la Silph SARL déploie Silph-Scanner. Ce Système d'Information (SI) nouvelle génération doit transformer une masse de données brutes (Big Data) en un avantage concurrentiel décisif tout en garantissant l'éthique et la sécurité. En tant qu'assistant de gestion, vous devez évaluer la performance de ce système.`,
  question: `Consigne générale :
- Lis toutes les annexes ci-dessous.
- Rédige une réponse structurée par dossiers.
- Justifie chaque réponse en citant des éléments précis des annexes (chiffres, faits, comparaisons).`,
  annexes: [
    {
      id: "A1",
      titre: "ANNEXE 1 - Rapport d'activité Data (DSI)",
      contexte: "Cette annexe présente la croissance des flux et des volumes pour évaluer le caractère Big Data du SI Silph-Scanner.",
      explication: "Observe à la fois la diversité des sources (GPS, audio, image, vidéo) et l'accélération des volumes stockés.",
      bullets: [
        "Flux traités : 120 000 signaux GPS/sec",
        "Flux audio : 15 000 cris de Pokémon",
        "Données images HD de combats",
        "Intégration vidéo prévue en 2026 (besoins de stockage x3)",
      ],
      table: {
        headers: ["Année", "Volume de données", "Lecture visuelle"],
        rows: [
          ["2023", "0,4 To", "███"],
          ["2025", "1,5 To", "███████████"],
          ["2026 (prévision)", "4,5 To", "█████████████████████████████████"],
        ],
      },
    },
    {
      id: "A2",
      titre: "ANNEXE 2 - Tableau de bord Qualité SI (T1 2026)",
      contexte: "Cette annexe mesure la qualité opérationnelle du SI selon les critères de fiabilité, actualité, accessibilité et pertinence.",
      explication: "Repère l'indicateur le plus éloigné de l'objectif et relie-le à une conséquence concrète pour les utilisateurs.",
      table: {
        headers: ["Indicateur", "Réalisé", "Objectif", "État"],
        rows: [
          ["Fiabilité (Exactitude)", "84%", "99%", "Attention"],
          ["Actualité (Météo)", "96%", "95%", "Conforme"],
          ["Accessibilité (Serveur)", "78%", "98%", "Critique"],
          ["Pertinence (Conseils)", "92%", "95%", "Conforme"],
        ],
      },
      note: "Commentaire DSI : saturation du SI sous le poids de données non triées ; incidents d'indisponibilité en pics d'usage.",
    },
    {
      id: "A3",
      titre: "ANNEXE 3 - Note RH (organisation SI)",
      contexte: "Cette annexe décrit les ressources humaines mobilisées pour faire fonctionner le SI.",
      explication: "Utilise ces éléments pour relier les ressources humaines aux ressources matérielles et logicielles du système.",
      bullets: [
        "Pôle Infrastructure : 12 techniciens réseau (serveurs cloud, terminaux Pokédex)",
        "Pôle Data Science : 5 analystes (algorithme de combat)",
        "Pôle Conformité : 1 DPO (registre CNIL, protection des données)",
        "Rôle opérationnel attendu : coordination entre pôles pour garantir performance + conformité",
      ],
    },
    {
      id: "A4",
      titre: "ANNEXE 4 - Comparatif stratégique Silph vs Rocket",
      contexte: "Cette annexe compare deux modèles de SI concurrents sur les dimensions techniques, juridiques et marketing.",
      explication: "Appuie-toi dessus pour montrer en quoi la stratégie data de Silph renforce durablement sa réputation.",
      bullets: [
        "Source des données : Silph (capteurs certifiés, données collaboratives) / Rocket (hacking, interception)",
        "Éthique : Silph (respect RGPD) / Rocket (revente de données)",
        "Modèle : Silph (open data partiel) / Rocket (opaque, tout payant)",
        "Enjeu d'image : confiance, fidélisation et réputation de marque",
      ],
    },
    {
      id: "A5",
      titre: "ANNEXE 5 - Mentions légales (extrait)",
      contexte: "Cette annexe rassemble les obligations de conformité RGPD liées aux traitements de données personnelles.",
      explication: "Exploite ces obligations pour justifier le rôle du DPO et les droits mobilisables par les utilisateurs.",
      bullets: [
        "Collecte : nom, géolocalisation, IP",
        "Droits utilisateurs : accès, rectification, effacement",
        "Contact DPO pour suppression de compte",
        "Exigence de traçabilité : preuve de conformité et gestion des demandes utilisateurs",
      ],
    },
  ],
  travailAFaire: [
    {
      titre: "Dossier 1 - La donnée comme matière première (6 pts)",
      questions: [
        "1) En t'appuyant sur l'annexe 1, démontre que Silph gère du Big Data en mobilisant au moins 2 des 5V. (3 pts)",
        "2) Avec l'annexe 4, explique pourquoi l'open data est une décision stratégique pour l'image de marque de Silph. (3 pts)",
      ],
    },
    {
      titre: "Dossier 2 - Composantes et qualité du SI (7 pts)",
      questions: [
        "3) À l'aide de l'annexe 3, identifie les 3 types de ressources du SI (humaines, matérielles, logicielles) avec un exemple pour chacune. (3 pts)",
        "4) Analyse l'annexe 2 : quel indicateur est le plus critique et quelle conséquence pour l'utilisateur final ? (2 pts)",
        "5) Explique le passage Donnée -> Information -> Connaissance à partir de l'exemple du cri Pokémon. (2 pts)",
      ],
    },
    {
      titre: "Dossier 3 - Responsabilité et stratégie (7 pts)",
      questions: [
        "6) Quel est le rôle du DPO (annexes 3 et 5) et pourquoi sa présence est-elle obligatoire ? (2 pts)",
        "7) Un dresseur refuse la géolocalisation : quel droit exerce-t-il et pourquoi la géolocalisation est-elle une donnée personnelle ? (2 pts)",
        "8) Synthèse argumentée : en quoi un SI performant et éthique permet-il à Silph de se différencier durablement de la Team Rocket ? (3 pts)",
      ],
    },
  ],
  mots_cles: [
    "big data", "volume", "variété", "vélocité", "open data", "transparence",
    "ressources humaines", "ressources matérielles", "ressources logicielles",
    "accessibilité", "donnée", "information", "connaissance", "dpo", "rgpd",
    "droit d'opposition", "droit à l'effacement", "éthique", "performance"
  ],
  correction: `Correction attendue (repères) :

Dossier 1 - Big Data et stratégie
- Big Data : montrer au moins 2 dimensions parmi Volume, Variété, Vélocité (annexe 1).
  Exemples solides : hausse du volume (~0,4 To -> ~4,5 To), formats hétérogènes (GPS, image, audio, vidéo), flux temps réel (120 000 signaux/sec).
- Open Data (annexe 4) : levier de transparence, confiance, image de marque et fidélisation ; différenciation face à Rocket-Map.

Dossier 2 - Architecture et qualité SI
- Ressources (annexe 3) :
  * Humaines : techniciens, analystes, DPO
  * Matérielles : serveurs cloud, terminaux Pokédex
  * Logicielles : algorithme de combat
- Indicateur critique (annexe 2) : accessibilité 78% (objectif 98%) ; conséquence : indisponibilités du SI, perte d'avantage utilisateur en situation de combat.
- Chaîne de valeur informationnelle : donnée brute (cri) -> information (identification Pokémon) -> connaissance/action (choix tactique).

Dossier 3 - RGPD et stratégie
- Rôle du DPO (annexes 3 et 5) : conformité RGPD, registre CNIL, gestion des droits, réduction du risque juridique ; fonction nécessaire en cas de traitement massif de données personnelles.
- Géolocalisation : donnée personnelle car traçage des habitudes ; droits mobilisables : opposition, effacement, accès, rectification.
- Synthèse : avantage concurrentiel durable = performance technique du SI + cadre éthique/RGPD ; Silph est perçue comme partenaire fiable, Rocket comme acteur risqué.`,
};

const normalizeTexte = (texte = "") => String(texte)
  .toLowerCase()
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .replace(/[^a-z0-9\s]/g, " ")
  .replace(/\s+/g, " ")
  .trim();

const extraireTokens = (texte = "") => {
  const stopWords = new Set(["le", "la", "les", "de", "des", "du", "un", "une", "et", "ou", "en", "dans", "sur", "pour", "avec", "que", "qui", "au", "aux", "par"]);
  return normalizeTexte(texte)
    .split(" ")
    .filter(t => t.length >= 3 && !stopWords.has(t));
};

const detecterReponseBrouillon = (texte = "") => {
  const propre = normalizeTexte(texte);
  if (!propre || propre.length < 20) return true;
  const tokens = propre.split(" ").filter(Boolean);
  if (tokens.length < 5) return true;
  const uniques = new Set(tokens).size;
  return uniques <= Math.max(2, Math.floor(tokens.length * 0.3));
};

const detecterStyleArtificiel = (texte = "") => {
  const t = normalizeTexte(texte);
  if (!t) return { suspect: false, score: 0, raisons: [] };
  const patrons = [
    "il convient de noter",
    "en outre",
    "par ailleurs",
    "dans un premier temps",
    "dans un second temps",
    "force est de constater",
    "au regard de",
    "il ressort que",
    "de ce fait",
    "en definitive",
  ];
  let score = 0;
  const raisons = [];
  for (const p of patrons) {
    if (t.includes(p)) {
      score += 1;
      raisons.push(`Formulation stéréotypée: "${p}"`);
    }
  }
  const mots = t.split(" ").filter(Boolean);
  const longueurMoyenne = mots.length ? mots.reduce((s, m) => s + m.length, 0) / mots.length : 0;
  if (longueurMoyenne > 6.3) {
    score += 1;
    raisons.push("Vocabulaire anormalement soutenu.");
  }
  const ponct = (texte.match(/[;:]/g) || []).length;
  if (ponct >= 5) {
    score += 1;
    raisons.push("Ponctuation académique très dense.");
  }
  return { suspect: score >= 3, score, raisons };
};

const evaluerPertinenceLocale = (mission, reponseEleve) => {
  const reponseTokens = extraireTokens(reponseEleve);
  if (reponseTokens.length === 0) return { ratio: 0, motsCommuns: 0 };

  const motsCles = Array.isArray(mission.mots_cles) ? mission.mots_cles.join(" ") : (mission.mots_cles || "");
  const reference = `${mission.correction || ""} ${motsCles}`;
  const referenceSet = new Set(extraireTokens(reference));
  if (referenceSet.size === 0) return { ratio: 1, motsCommuns: 0 };

  let communs = 0;
  for (const token of new Set(reponseTokens)) {
    if (referenceSet.has(token)) communs++;
  }
  return { ratio: communs / referenceSet.size, motsCommuns: communs };
};

const contientTexteTemplate = (texte = "") => {
  const t = normalizeTexte(texte);
  return [
    "analyse precise de sa reponse comparee a la correction en 2 phrases",
    "analyse precise en 2 phrases",
    "ce quil a bien fait en 1 phrase",
    "ce quil a bien fait par rapport a la correction en 1 phrase",
    "ce qui manque en 1 phrase",
    "ce qui manque precisement par rapport a la correction en 1 phrase",
  ].some(pattern => t.includes(pattern));
};

const compterMotsClesTrouves = (mission, reponseEleve) => {
  const reponseNormalisee = normalizeTexte(reponseEleve);
  const mots = Array.isArray(mission.mots_cles) ? mission.mots_cles : [];
  let trouves = 0;
  for (const motCle of mots) {
    const m = normalizeTexte(motCle);
    if (m && reponseNormalisee.includes(m)) trouves++;
  }
  return trouves;
};

const scoreMaxLocal = (mission, reponseEleve) => {
  const repTokens = new Set(extraireTokens(reponseEleve));
  if (repTokens.size < 5) return 3;

  const motsCles = Array.isArray(mission.mots_cles) ? mission.mots_cles.join(" ") : (mission.mots_cles || "");
  const referenceGlobale = `${mission.correction || ""} ${mission.question || ""} ${mission.contexte || ""} ${motsCles}`;
  const corrTokens = new Set(extraireTokens(referenceGlobale));
  const questionTokens = new Set(extraireTokens(mission.question || ""));

  let communCorrection = 0;
  for (const t of repTokens) {
    if (corrTokens.has(t)) communCorrection++;
  }

  let communQuestion = 0;
  for (const t of repTokens) {
    if (questionTokens.has(t)) communQuestion++;
  }

  const motsClesTrouves = compterMotsClesTrouves(mission, reponseEleve);

  if (communCorrection === 0 && communQuestion === 0 && motsClesTrouves === 0) return 3;
  if (communCorrection <= 1 && motsClesTrouves === 0) return 5;
  if (communCorrection <= 2 && motsClesTrouves <= 1) return 7;
  if (communCorrection <= 4 && motsClesTrouves <= 1) return 9;
  return 10;
};

const equilibrerScore = ({ scoreIA, scoreLocal, maxLocal }) => {
  const ia = Number(scoreIA);
  const local = Number(scoreLocal);
  if (!Number.isFinite(ia) && !Number.isFinite(local)) return 2;
  if (!Number.isFinite(ia)) return Math.max(2, Math.min(maxLocal, local));
  if (!Number.isFinite(local)) return Math.max(2, Math.min(maxLocal, ia));

  let score = Math.round((ia * 0.65) + (local * 0.35));
  if (Math.abs(ia - local) >= 4) {
    score = Math.round((ia + local) / 2);
  }

  return Math.max(2, Math.min(maxLocal, score));
};

const extraireElementsCorrection = (mission, limite = 3) => {
  const texte = String(mission?.correction || "").replace(/\s+/g, " ").trim();
  const elements = [];

  if (Array.isArray(mission?.mots_cles) && mission.mots_cles.length) {
    elements.push(`Notions a mobiliser : ${mission.mots_cles.slice(0, 5).join(", ")}.`);
  } else if (typeof mission?.mots_cles === "string" && mission.mots_cles.trim()) {
    elements.push(`Notions a mobiliser : ${mission.mots_cles.split(",").map(m => m.trim()).filter(Boolean).slice(0, 5).join(", ")}.`);
  }

  if (texte) {
    const phrases = texte
      .split(/(?<=[.!?])\s+/)
      .map(p => p.trim())
      .filter(p => p.length >= 40 && p.length <= 220);
    for (const phrase of phrases) {
      if (elements.length >= limite) break;
      if (!elements.includes(phrase)) elements.push(phrase);
    }
  }

  return elements.slice(0, limite);
};

const feedbackSembleHallucine = (feedback, reponseEleve) => {
  const fb = normalizeTexte(feedback);
  const rep = normalizeTexte(reponseEleve);
  const feedbackParleCalcul = /(calcul|resultat|valeur ajoutee|autofinancement|repartition)/.test(fb);
  const reponseAElements = /(calcul|valeur|ajoutee|autofinancement|repartition)/.test(rep) || /\d/.test(reponseEleve);
  return feedbackParleCalcul && !reponseAElements;
};

const contientFragmentNormalise = (source = "", fragment = "") => {
  const s = normalizeTexte(source);
  const f = normalizeTexte(fragment);
  return f.length >= 4 && s.includes(f);
};

const preuveSemantiquementLiee = (source = "", fragment = "") => {
  const sourceTokens = new Set(extraireTokens(source));
  const fragTokens = extraireTokens(fragment);
  if (!sourceTokens.size || !fragTokens.length) return false;
  let communs = 0;
  for (const t of new Set(fragTokens)) {
    if (sourceTokens.has(t)) communs++;
  }
  return communs >= 2;
};

const preuvesValides = (preuves, source) => Array.isArray(preuves)
  && preuves.some((p) => typeof p === "string"
    && (contientFragmentNormalise(source, p) || preuveSemantiquementLiee(source, p)));

const calculerScoreLocal = (mission, reponseEleve) => {
  const propre = normalizeTexte(reponseEleve);
  if (!propre || detecterReponseBrouillon(reponseEleve)) {
    return {
      score: 0,
      feedback: "Ta réponse est trop courte ou hors sujet pour être évaluée correctement.",
      points_forts: "Tu as tenté de répondre.",
      a_ameliorer: "Ajoute les notions du cours et un raisonnement clair.",
      triche_detectee: false,
    };
  }

  const { ratio, motsCommuns } = evaluerPertinenceLocale(mission, reponseEleve);
  const motsClesTrouves = compterMotsClesTrouves(mission, reponseEleve);
  const base = Math.round((ratio * 10) + Math.min(2, motsClesTrouves * 0.5) + Math.min(2, motsCommuns * 0.2));
  const score = Math.max(1, Math.min(10, base));
  const scoreAjuste = score <= 2 ? 2 : score;

  return {
    score: scoreAjuste,
    feedback: "Correction locale appliquée : comparaison avec la correction de référence effectuée même sans IA.",
    points_forts: "Tu as soumis une réponse exploitable.",
    a_ameliorer: "Rends ta réponse plus précise et connectée aux notions attendues.",
    triche_detectee: false,
  };
};

const normaliserTexteCourt = (texte = "", max = 180) => {
  const brut = String(texte || "").replace(/\s+/g, " ").trim();
  if (brut.length <= max) return brut;
  return `${brut.slice(0, max - 1)}…`;
};

const construireFallbackLocal = (mission, reponseEleve, raison = "") => {
  const local = calculerScoreLocal(mission, reponseEleve);
  return {
    ...local,
    feedback: raison
      ? `Mode secours activé (${raison}) : ${local.feedback}`
      : `Mode secours activé : ${local.feedback}`,
    points_forts: local.points_forts || "Tu as soumis une réponse exploitable.",
    a_ameliorer: local.a_ameliorer || "Rends ta réponse plus précise sur les notions attendues.",
  };
};

const extraireCorrectionJson = (content = "") => {
  if (!content) return null;
  const contenuSansFence = String(content).replace(/```json|```/gi, "").trim();
  const debut = contenuSansFence.indexOf("{");
  const fin = contenuSansFence.lastIndexOf("}");
  if (debut === -1 || fin === -1 || fin <= debut) return null;
  try {
    return JSON.parse(contenuSansFence.slice(debut, fin + 1));
  } catch {
    return null;
  }
};

const pause = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const appelerGeminiAvecRetry = async (apiKey, prompt) => {
  const essaisMax = 3;
  for (let tentative = 1; tentative <= essaisMax; tentative++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 22000);
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 650,
            responseMimeType: "application/json",
          },
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const data = await response.json();
      if (!response.ok) {
        const estRetriable = response.status === 429 || response.status >= 500;
        const erreurApi = data?.error?.message || "Erreur API Gemini.";
        if (estRetriable && tentative < essaisMax) {
          await pause(500 * tentative);
          continue;
        }
        throw new Error(erreurApi);
      }
      return data;
    } catch (err) {
      const estDernierEssai = tentative >= essaisMax;
      if (!estDernierEssai) {
        await pause(500 * tentative);
        continue;
      }
      throw err;
    }
  }
  throw new Error("Impossible de joindre Gemini après plusieurs essais.");
};

const appelerGroqAvecRetry = async (apiKey, prompt) => {
  const essaisMax = 3;
  for (let tentative = 1; tentative <= essaisMax; tentative++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 22000);
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.1,
          max_tokens: 550,
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const data = await response.json();
      if (!response.ok) {
        const estRetriable = response.status === 429 || response.status >= 500;
        const erreurApi = data?.error?.message || "Erreur API Groq.";
        if (estRetriable && tentative < essaisMax) {
          await pause(500 * tentative);
          continue;
        }
        throw new Error(erreurApi);
      }
      return data;
    } catch (err) {
      const estDernierEssai = tentative >= essaisMax;
      if (!estDernierEssai) {
        await pause(500 * tentative);
        continue;
      }
      throw err;
    }
  }
  throw new Error("Impossible de joindre Groq après plusieurs essais.");
};

const extraireTexteGemini = (data) => {
  const parts = data?.candidates?.[0]?.content?.parts;
  if (!Array.isArray(parts)) return "";
  return parts.map((p) => (typeof p?.text === "string" ? p.text : "")).join("\n").trim();
};

const reparerJsonCorrection = async ({ geminiKey, groqKey, contenuBrut }) => {
  const prompt = `Tu transformes une correction brute en JSON strict.
Tu dois retourner UNIQUEMENT un objet JSON valide avec ces clés exactes :
{"score": number, "feedback": string, "points_forts": string, "a_ameliorer": string, "triche_detectee": boolean, "hors_sujet": boolean, "preuves_eleve": string[], "preuves_correction": string[]}

Règles :
- score entre 0 et 10 (entier)
- si un champ manque, complète avec une valeur prudente et utile
- ne mets aucun texte hors JSON

Correction brute à convertir :
${normaliserTexteCourt(contenuBrut, 3500)}`;

  if (geminiKey) {
    try {
      const dataGemini = await appelerGeminiAvecRetry(geminiKey, prompt);
      const jsonGemini = extraireCorrectionJson(extraireTexteGemini(dataGemini));
      if (jsonGemini) return jsonGemini;
    } catch {
      // ignore and fallback to groq if available
    }
  }

  if (groqKey) {
    const dataGroq = await appelerGroqAvecRetry(groqKey, prompt);
    return extraireCorrectionJson(dataGroq?.choices?.[0]?.message?.content || "");
  }

  return null;
};

// ✅ CORRECTION BASÉE SUR LA CORRECTION DE RÉFÉRENCE DU PROF
const corrigerAvecGroq = async (mission, reponseEleve) => {
  const aCorrection = mission.correction && mission.correction.trim().length > 10;
  if (!aCorrection) {
    return {
      score: 0,
      feedback: "Cette mission n'a pas de correction de référence valide côté professeur.",
      points_forts: "Tu as soumis une réponse.",
      a_ameliorer: "Demande au professeur de réimporter les missions avec la colonne correction remplie.",
      triche_detectee: false,
    };
  }

  const prompt = `Tu es un professeur de Sciences de Gestion STMG bienveillant mais exigeant.
Ta mission est de corriger UNIQUEMENT en comparant la réponse élève à la correction de référence du professeur.
INTERDICTION d'inventer des calculs ou des éléments qui ne sont pas présents dans la réponse élève.

MISSION : ${mission.titre}
NIVEAU : ${mission.niveau || ""}
DIFFICULTÉ : ${mission.difficulte || ""}
MATIÈRE : ${mission.matiere}
CONTEXTE : ${mission.contexte}
QUESTION : ${mission.question}
MOTS-CLÉS ATTENDUS : ${mission.mots_cles ? (Array.isArray(mission.mots_cles) ? mission.mots_cles.join(", ") : mission.mots_cles) : ""}

CORRECTION DE RÉFÉRENCE DU PROFESSEUR :
${mission.correction}

RÉPONSE DE L'ÉLÈVE :
${reponseEleve}

BARÈME DE CORRECTION :
- 0/10 : Réponse vide, hors sujet total, lettres aléatoires, ou triche IA détectée
- 2/10 : Quelques mots sans raisonnement, aucune notion du cours
- 4/10 : Idée vague, 1 notion correcte mais résultat faux ou incomplet
- 5/10 : Réponse partielle, calculs partiellement corrects, manque plusieurs éléments clés
- 6/10 : Bonne compréhension, calculs corrects mais analyse insuffisante
- 7/10 : Réponse correcte avec les bonnes notions, calculs justes, manque juste une précision
- 8/10 : Réponse complète, calculs corrects, bonne analyse
- 9-10/10 : Réponse excellente, calculs justes, analyse complète, raisonnement clair

RÈGLES IMPORTANTES :
1. Base-toi UNIQUEMENT sur la correction de référence pour évaluer — c'est la référence du prof
2. Si la réponse élève est hors sujet ou sans lien clair avec la correction => score maximum 2/10 et hors_sujet=true
3. Tu dois fournir des indices de comparaison tirés de la réponse élève ET de la correction (citations ou reformulations fidèles)
4. Une bonne réponse reformulée doit être acceptée même si elle n'utilise pas exactement les mêmes mots que la correction
5. Si la réponse semble générée par une IA (style trop soutenu, "Il convient de noter", "En outre") => score = 0, triche_detectee = true
6. Feedback PERSONNALISÉ : explique précisément ce qui correspond/ne correspond pas à la correction

Réponds UNIQUEMENT en JSON sans aucun texte avant ou après.
Format JSON exact :
{"score": number, "feedback": "Texte personnalisé", "points_forts": "Texte personnalisé", "a_ameliorer": "Texte personnalisé", "triche_detectee": boolean, "hors_sujet": boolean, "preuves_eleve": ["citation exacte élève"], "preuves_correction": ["citation exacte correction"]}`;

  const geminiKey = process.env.REACT_APP_GEMINI_API_KEY;
  const groqKey = process.env.REACT_APP_GROQ_API_KEY;
  if (!geminiKey && !groqKey) {
    return construireFallbackLocal(mission, reponseEleve, "aucune clé IA configurée");
  }

  let content = "";
  if (geminiKey) {
    try {
      const geminiData = await appelerGeminiAvecRetry(geminiKey, prompt);
      content = extraireTexteGemini(geminiData);
    } catch {
      content = "";
    }
  }

  if (!content && groqKey) {
    try {
      const groqData = await appelerGroqAvecRetry(groqKey, prompt);
      content = groqData?.choices?.[0]?.message?.content || "";
    } catch {
      content = "";
    }
  }

  if (!content) {
    return construireFallbackLocal(mission, reponseEleve, "IA indisponible");
  }

  let correction = extraireCorrectionJson(content);
  if (!correction) {
    try {
      correction = await reparerJsonCorrection({ geminiKey, groqKey, contenuBrut: content });
    } catch {
      correction = null;
    }
  }
  if (!correction) {
    return construireFallbackLocal(mission, reponseEleve, "format IA invalide");
  }

  const scoreBrut = Number(correction?.score);
  const scoreNormalise = Number.isFinite(scoreBrut) ? Math.max(0, Math.min(10, Math.round(scoreBrut))) : 1;
  const preuvesEleve = Array.isArray(correction?.preuves_eleve) ? correction.preuves_eleve.filter(p => typeof p === "string") : [];
  const preuvesCorrection = Array.isArray(correction?.preuves_correction) ? correction.preuves_correction.filter(p => typeof p === "string") : [];
  const resultat = {
    score: scoreNormalise,
    feedback: String(correction?.feedback || "Correction reçue."),
    points_forts: String(correction?.points_forts || "Tu as fait un effort de réponse."),
    a_ameliorer: String(correction?.a_ameliorer || "Ajoute plus de notions du cours."),
    triche_detectee: Boolean(correction?.triche_detectee),
  };

  const scoreLocalSecours = calculerScoreLocal(mission, reponseEleve);
  const champsGeneriques = contientTexteTemplate(resultat.feedback)
    || contientTexteTemplate(resultat.points_forts)
    || contientTexteTemplate(resultat.a_ameliorer);
  if (champsGeneriques) {
    resultat.score = Math.min(resultat.score, scoreLocalSecours.score);
    resultat.feedback = `Correction IA trop générique : ${scoreLocalSecours.feedback}`;
    resultat.points_forts = scoreLocalSecours.points_forts;
    resultat.a_ameliorer = scoreLocalSecours.a_ameliorer;
  }

  const preuvesEleveOk = preuvesValides(preuvesEleve, reponseEleve);
  const preuvesCorrectionOk = preuvesValides(preuvesCorrection, mission.correction || "");
  if (!preuvesEleveOk || !preuvesCorrectionOk) {
    // On reste prudent mais on n'écrase pas une bonne réponse.
    resultat.score = Math.min(resultat.score, 8);
    if (!resultat.feedback || contientTexteTemplate(resultat.feedback)) {
      resultat.feedback = "Correction reçue sans preuves textuelles détaillées, évaluation prudente appliquée.";
      resultat.points_forts = "Tu as soumis une réponse structurée.";
      resultat.a_ameliorer = "Ajoute des éléments explicites de la correction pour sécuriser la note maximale.";
    }
  }

  if (Boolean(correction?.hors_sujet)) {
    resultat.score = Math.min(resultat.score, 3);
  }

  if (detecterReponseBrouillon(reponseEleve)) {
    resultat.score = 0;
    resultat.feedback = "Ta réponse est trop courte ou incohérente pour être évaluée correctement.";
    resultat.points_forts = "Tu as essayé de répondre.";
    resultat.a_ameliorer = "Rédige une réponse complète avec des notions du cours.";
    resultat.triche_detectee = false;
    return resultat;
  }

  const maxLocal = scoreMaxLocal(mission, reponseEleve);
  resultat.score = equilibrerScore({
    scoreIA: resultat.score,
    scoreLocal: scoreLocalSecours.score,
    maxLocal,
  });

  if (feedbackSembleHallucine(resultat.feedback, reponseEleve)) {
    resultat.score = Math.min(resultat.score, 2);
    resultat.feedback = "La correction semble incohérente avec ta réponse réelle.";
    resultat.points_forts = "Tu as soumis ta réponse.";
    resultat.a_ameliorer = "Rédige une réponse liée à la question et aux notions attendues.";
  }

  const { ratio, motsCommuns } = evaluerPertinenceLocale(mission, reponseEleve);
  const motsClesTrouves = compterMotsClesTrouves(mission, reponseEleve);
  if (ratio < 0.025 && motsCommuns < 1 && motsClesTrouves === 0) {
    resultat.score = Math.min(resultat.score, 5);
    resultat.feedback = "Ta réponse semble hors sujet par rapport à la correction de référence du professeur.";
    resultat.points_forts = "Tu as soumis une réponse.";
    resultat.a_ameliorer = "Reprends les notions et mots-clés attendus dans la mission.";
  }

  return resultat;
};

// ===== CARTE MISSION =====
const CarteMission = ({ mission, profil, onMissionComplete }) => {
  const [reponse, setReponse] = useState("");
  const [correction, setCorrection] = useState(null);
  const [chargement, setChargement] = useState(false);
  const [sortieEcranDetectee, setSortieEcranDetectee] = useState(false);
  const [attemptStartedAt, setAttemptStartedAt] = useState(null);
  const [dejaFaite] = useState(missionDejaFaite(profil, mission.id));
  const longueurReponse = reponse.trim().length;
  const difficulte = Math.max(1, Math.min(5, Number(mission.difficulte) || 1));
  const niveau = (mission.niveau || "premiere").toLowerCase();
  const couleur = difficulte >= 4 ? COLORS.H : difficulte >= 3 ? COLORS.U : COLORS.S;
  const niveauLabel = niveau === "terminale" ? "📘 Terminale" : "📗 Première";
  const estCasSilph = mission.id === MISSION_CAS_SILPH_ID;

  useEffect(() => {
    if (correction || chargement) return undefined;
    const surveillerSortie = () => {
      if (longueurReponse >= 20) setSortieEcranDetectee(true);
    };
    const onVisibility = () => {
      if (document.hidden) surveillerSortie();
    };
    window.addEventListener("blur", surveillerSortie);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("blur", surveillerSortie);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [correction, chargement, longueurReponse]);

  const soumettre = async () => {
    if (!reponse.trim() || longueurReponse < 20) return;
    setChargement(true);
    try {
      const result = await corrigerAvecGroq(mission, reponse);
      let resultFinal = detecterReponseBrouillon(reponse)
        ? {
          ...result,
          score: 0,
          feedback: "Réponse trop courte ou hors sujet : note automatiquement plafonnée.",
          points_forts: "Tu as essayé de répondre.",
          a_ameliorer: "Rédige une réponse complète en lien direct avec la correction de référence.",
          triche_detectee: false,
        }
        : result;

      const elapsedSec = attemptStartedAt ? Math.max(1, Math.round((Date.now() - attemptStartedAt) / 1000)) : 1;
      const collageMassif = false;
      const tempsIrrealiste = reponse.trim().length >= 400 && elapsedSec <= 15;
      const styleArtificiel = detecterStyleArtificiel(reponse);

      if (sortieEcranDetectee) {
        resultFinal = {
          ...resultFinal,
          triche_detectee: true,
          score: 0,
          feedback: "Sortie de l’onglet détectée pendant la rédaction.",
          points_forts: "Tu as soumis une réponse.",
          a_ameliorer: "Reste sur l’onglet Missions pendant toute la tentative pour débloquer l’XP.",
        };
      }
      if (!sortieEcranDetectee && (collageMassif || tempsIrrealiste)) {
        resultFinal = {
          ...resultFinal,
          triche_detectee: true,
          score: 0,
          feedback: `${collageMassif ? "Collage massif détecté." : ""} ${tempsIrrealiste ? "Temps de rédaction irréaliste pour la longueur soumise." : ""}`.trim(),
          points_forts: "Tu as soumis une réponse.",
          a_ameliorer: "Rédige progressivement avec tes propres mots pour débloquer l'XP.",
        };
      }
      if (!resultFinal.triche_detectee && styleArtificiel.suspect) {
        resultFinal = {
          ...resultFinal,
          score: Math.min(resultFinal.score || 0, 4),
          feedback: "Style artificiel détecté. Réécris de façon plus simple et personnelle.",
          a_ameliorer: `Simplifie la formulation et ancre ta réponse dans le cas. ${styleArtificiel.raisons.slice(0, 2).join(" ")}`,
        };
      }
      const user = auth.currentUser;
      if (!user) throw new Error("Utilisateur non connecté.");
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) throw new Error("Profil utilisateur introuvable.");
      const userData = userDoc.data();
      const xpBase = getMissionXPBase(mission);
      const xpMissionBoostee = Math.round(xpBase * MISSION_XP_MULTIPLIER);
      const xpBrut = (dejaFaite || resultFinal.triche_detectee) ? 0 : Math.round((resultFinal.score / 10) * xpMissionBoostee);
      const xpCapStyle = styleArtificiel.suspect ? Math.round(xpMissionBoostee * 0.2) : xpMissionBoostee;
      const xpMaxMission = Number.isFinite(Number(mission?.xp_max)) ? Number(mission.xp_max) : Infinity;
      const xpGagne = Math.max(0, Math.min(xpBrut, xpCapStyle, xpMaxMission));
      const newXP = (userData.xp || 0) + xpGagne;
      const historique = userData.missionsHistorique || {};
      const antiCheatFlags = {
        sortieEcranDetectee: Boolean(sortieEcranDetectee),
        collageMassif: Boolean(collageMassif),
        tempsIrrealiste: Boolean(tempsIrrealiste),
        styleArtificiel: Boolean(styleArtificiel.suspect),
        tricheDetectee: Boolean(resultFinal.triche_detectee),
        elapsedSec,
      };
      historique[mission.id] = {
        date: getDateJour(),
        score: resultFinal.score,
        xpGagne,
        antiCheatFlags,
      };
      await updateDoc(doc(db, "users", user.uid), { xp: newXP, missionsHistorique: historique });
      const xpDetail = "Modificateur familier: desactive";
      const elementsCorrection = extraireElementsCorrection(mission);
      setCorrection({ ...resultFinal, xpGagne, xpDetail, elementsCorrection });
      onMissionComplete(xpGagne);
    } catch (err) {
      console.error(err);
      setCorrection({ score: 0, feedback: "Erreur de connexion à l'IA. Réessaie !", points_forts: "", a_ameliorer: "", triche_detectee: false, xpGagne: 0, elementsCorrection: [] });
    } finally {
      setChargement(false);
    }
  };

  return (
    <div style={{ background: "white", borderRadius: "24px", padding: "28px", border: `2px solid ${couleur}20`, boxShadow: `0 4px 20px ${couleur}15`, marginBottom: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px", flexWrap: "wrap", gap: "8px" }}>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <span style={{ background: couleur, color: "white", fontFamily: "'Fredoka One', cursive", padding: "4px 16px", borderRadius: "100px", fontSize: "0.85rem" }}>
            {niveauLabel}
          </span>
          <span style={{ background: "#111827", color: "white", fontFamily: "'Fredoka One', cursive", padding: "4px 16px", borderRadius: "100px", fontSize: "0.85rem" }}>
            {"⭐".repeat(difficulte)} D{difficulte}
          </span>
          <span style={{ background: couleur + "15", color: couleur, fontFamily: "'Fredoka One', cursive", padding: "4px 16px", borderRadius: "100px", fontSize: "0.85rem", border: `1px solid ${couleur}30` }}>
            +{Math.round(getMissionXPBase(mission) * MISSION_XP_MULTIPLIER)} XP
          </span>
          {dejaFaite && !correction && (
            <span style={{ background: COLORS.G + "15", color: COLORS.G, fontFamily: "'Fredoka One', cursive", padding: "4px 16px", borderRadius: "100px", fontSize: "0.85rem", border: `1px solid ${COLORS.G}30` }}>
              ✅ Déjà faite
            </span>
          )}
        </div>
        <span style={{ fontSize: "0.85rem", color: "#9CA3AF", fontWeight: 600 }}>{mission.matiere}</span>
      </div>

      <div style={{ display: "flex", gap: "12px", alignItems: "flex-start", marginBottom: "16px" }}>
        <span style={{ fontSize: "2.5rem", flexShrink: 0 }}>{mission.emoji || "🎯"}</span>
        <div>
          <h3 style={{ fontFamily: "'Fredoka One', cursive", fontSize: "1.3rem", color: "#1A1A2E", marginBottom: "4px" }}>{mission.titre}</h3>
          {(mission.theme || mission.chapitre) && (
            <p style={{ color: "#6B7280", fontSize: "0.82rem", marginBottom: "4px" }}>
              {mission.theme ? `Thème : ${mission.theme}` : ""}{mission.theme && mission.chapitre ? " · " : ""}{mission.chapitre ? `Chapitre : ${mission.chapitre}` : ""}
            </p>
          )}
          <p style={{ color: "#6B7280", fontSize: "0.9rem", lineHeight: 1.6 }}>{mission.contexte}</p>
        </div>
      </div>

      <div style={{ background: couleur + "10", borderRadius: "16px", padding: "16px", marginBottom: "16px", border: `1px solid ${couleur}20` }}>
        <p style={{ fontFamily: "'Fredoka One', cursive", color: couleur, marginBottom: "8px", fontSize: "0.9rem" }}>❓ Question</p>
        <p style={{ color: "#374151", lineHeight: 1.8, whiteSpace: "pre-line" }}>{mission.question}</p>
      </div>
      {estCasSilph && Array.isArray(mission.annexes) && mission.annexes.length > 0 && (
        <div style={{ display: "grid", gap: "12px", marginBottom: "16px" }}>
          {mission.annexes.map((annexe, idx) => (
            <div key={annexe.id || idx} style={{ background: "#F8FAFC", borderRadius: "14px", border: "1px solid #E2E8F0", padding: "14px" }}>
              <p style={{ margin: "0 0 6px", color: "#1E293B", fontWeight: 800 }}>
                📎 {annexe.titre}
              </p>
              {annexe.contexte && (
                <p style={{ margin: "0 0 6px", color: "#334155", fontSize: "0.88rem", lineHeight: 1.55 }}>
                  <strong>Contexte :</strong> {annexe.contexte}
                </p>
              )}
              {annexe.explication && (
                <p style={{ margin: "0 0 10px", color: "#0F766E", fontSize: "0.88rem", lineHeight: 1.55 }}>
                  <strong>À exploiter :</strong> {annexe.explication}
                </p>
              )}
              {Array.isArray(annexe.bullets) && annexe.bullets.length > 0 && (
                <ul style={{ margin: "0 0 8px", paddingLeft: "18px", color: "#334155", fontSize: "0.88rem", lineHeight: 1.55 }}>
                  {annexe.bullets.map((item, itemIdx) => (
                    <li key={`${annexe.id}-bullet-${itemIdx}`}>{item}</li>
                  ))}
                </ul>
              )}
              {annexe.table && Array.isArray(annexe.table.headers) && Array.isArray(annexe.table.rows) && (
                <div style={{ overflowX: "auto", marginTop: "8px" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem", background: "white" }}>
                    <thead>
                      <tr>
                        {annexe.table.headers.map((h) => (
                          <th key={`${annexe.id}-h-${h}`} style={{ textAlign: "left", border: "1px solid #CBD5E1", padding: "8px", background: "#E2E8F0", color: "#0F172A" }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {annexe.table.rows.map((row, rowIdx) => (
                        <tr key={`${annexe.id}-row-${rowIdx}`}>
                          {row.map((cell, cellIdx) => (
                            <td key={`${annexe.id}-cell-${rowIdx}-${cellIdx}`} style={{ border: "1px solid #CBD5E1", padding: "8px", color: "#1F2937" }}>
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {annexe.note && (
                <p style={{ margin: "8px 0 0", color: "#92400E", background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: "8px", padding: "8px", fontSize: "0.83rem", lineHeight: 1.5 }}>
                  {annexe.note}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
      {estCasSilph && Array.isArray(mission.travailAFaire) && mission.travailAFaire.length > 0 && (
        <div style={{ background: "#FEF3C7", border: "1px solid #FCD34D", borderRadius: "14px", padding: "14px", marginBottom: "16px" }}>
          <p style={{ margin: "0 0 10px", color: "#92400E", fontWeight: 800 }}>
            🧭 Travail à faire (barème 20 points)
          </p>
          <div style={{ display: "grid", gap: "8px" }}>
            {mission.travailAFaire.map((dossier, idx) => (
              <div key={`dossier-${idx}`} style={{ background: "white", border: "1px solid #FDE68A", borderRadius: "10px", padding: "10px" }}>
                <p style={{ margin: "0 0 6px", color: "#78350F", fontWeight: 800 }}>{dossier.titre}</p>
                <ul style={{ margin: 0, paddingLeft: "18px", color: "#374151", fontSize: "0.86rem", lineHeight: 1.55 }}>
                  {(dossier.questions || []).map((q, qIdx) => (
                    <li key={`dossier-${idx}-q-${qIdx}`}>{q}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {!correction ? (
        <div>
          <textarea
            value={reponse}
            onChange={e => {
              if (!attemptStartedAt) setAttemptStartedAt(Date.now());
              setReponse(e.target.value);
            }}
            onPaste={(e) => e.preventDefault()}
            onCopy={(e) => e.preventDefault()}
            onCut={(e) => e.preventDefault()}
            onDrop={(e) => e.preventDefault()}
            onContextMenu={(e) => e.preventDefault()}
            onKeyDown={(e) => {
              const key = String(e.key || "").toLowerCase();
              if ((e.ctrlKey || e.metaKey) && (key === "v" || key === "c" || key === "x" || key === "insert")) {
                e.preventDefault();
              }
              if (e.shiftKey && key === "insert") e.preventDefault();
            }}
            placeholder="Écris ta réponse ici avec tes propres mots... (minimum 20 caractères)"
            style={{
              width: "100%", minHeight: "140px", padding: "16px",
              borderRadius: "16px", border: `2px solid ${couleur}30`,
              fontFamily: "'Nunito', sans-serif", fontSize: "0.95rem",
              lineHeight: 1.6, resize: "vertical", outline: "none",
              boxSizing: "border-box", color: "#374151",
              opacity: dejaFaite ? 0.7 : 1,
            }}
            onFocus={e => e.target.style.borderColor = couleur}
            onBlur={e => e.target.style.borderColor = couleur + "30"}
          />
          {dejaFaite && (
            <div style={{ background: COLORS.G + "10", borderRadius: "12px", padding: "12px 16px", marginTop: "8px", border: `1px solid ${COLORS.G}30` }}>
              <p style={{ color: COLORS.G, fontSize: "0.85rem", fontFamily: "'Fredoka One', cursive", margin: 0 }}>
                ✅ Tu as déjà complété cette mission ! Tu peux la refaire pour t'entraîner mais tu ne gagneras plus d'XP.
              </p>
            </div>
          )}
          {sortieEcranDetectee && (
            <div style={{ background: COLORS.H + "10", borderRadius: "12px", padding: "12px 16px", marginTop: "8px", border: `1px solid ${COLORS.H}35` }}>
              <p style={{ color: COLORS.H, fontSize: "0.83rem", fontFamily: "'Fredoka One', cursive", margin: 0 }}>
                ⚠️ Sortie d'écran détectée: cette tentative sera notée mais ne donnera pas d'XP.
              </p>
            </div>
          )}
          <p style={{ color: "#9CA3AF", fontSize: "0.8rem", marginTop: "8px" }}>
            ⚠️ Copier/coller désactivé sur cette zone : réponse personnelle obligatoire.
          </p>
          <button onClick={soumettre} disabled={chargement || longueurReponse < 20}
            style={{
              marginTop: "12px", width: "100%",
              background: longueurReponse >= 20 ? couleur : "#E5E7EB",
              color: longueurReponse >= 20 ? "white" : "#9CA3AF",
              border: "none", fontFamily: "'Fredoka One', cursive",
              fontSize: "1.1rem", padding: "14px",
              borderRadius: "16px", cursor: longueurReponse >= 20 ? "pointer" : "not-allowed",
              transition: "all 0.2s",
            }}>
            {chargement ? "⏳ L'IA corrige ta réponse..." : "🚀 Soumettre ma réponse"}
          </button>
        </div>
      ) : (
        <div>
          {correction.triche_detectee ? (
            <div style={{ background: COLORS.H + "15", borderRadius: "16px", padding: "20px", border: `2px solid ${COLORS.H}`, textAlign: "center" }}>
              <p style={{ fontSize: "2rem", marginBottom: "8px" }}>🚨</p>
              <p style={{ fontFamily: "'Fredoka One', cursive", color: COLORS.H, fontSize: "1.2rem", marginBottom: "8px" }}>Triche détectée !</p>
              <p style={{ color: "#374151", fontSize: "0.9rem", lineHeight: 1.6 }}>
                Ta réponse semble avoir été générée par une IA. Réponds avec tes propres mots pour gagner de l'XP !
              </p>
              <p style={{ fontFamily: "'Fredoka One', cursive", color: COLORS.H, marginTop: "12px" }}>0 XP gagnés</p>
            </div>
          ) : (
            <div style={{ background: "#F8F9FA", borderRadius: "16px", padding: "20px", border: "2px solid #E5E7EB" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <p style={{ fontFamily: "'Fredoka One', cursive", color: "#1A1A2E", fontSize: "1.1rem" }}>📝 Correction de l'IA</p>
                <div style={{
                  background: correction.score >= 7 ? COLORS.G : correction.score >= 5 ? COLORS.U : COLORS.H,
                  color: "white", fontFamily: "'Fredoka One', cursive",
                  padding: "8px 20px", borderRadius: "100px", fontSize: "1.2rem",
                }}>
                  {correction.score}/10
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ background: COLORS.G + "15", borderRadius: "12px", padding: "14px", border: `1px solid ${COLORS.G}30` }}>
                  <p style={{ fontFamily: "'Fredoka One', cursive", color: COLORS.G, fontSize: "0.9rem", marginBottom: "4px" }}>✅ Points forts</p>
                  <p style={{ color: "#374151", fontSize: "0.9rem", lineHeight: 1.6 }}>{correction.points_forts}</p>
                </div>
                <div style={{ background: COLORS.U + "15", borderRadius: "12px", padding: "14px", border: `1px solid ${COLORS.U}30` }}>
                  <p style={{ fontFamily: "'Fredoka One', cursive", color: COLORS.U, fontSize: "0.9rem", marginBottom: "4px" }}>💡 À améliorer</p>
                  <p style={{ color: "#374151", fontSize: "0.9rem", lineHeight: 1.6 }}>{correction.a_ameliorer}</p>
                </div>
                <div style={{ background: couleur + "10", borderRadius: "12px", padding: "14px", border: `1px solid ${couleur}20` }}>
                  <p style={{ fontFamily: "'Fredoka One', cursive", color: couleur, fontSize: "0.9rem", marginBottom: "4px" }}>💬 Feedback général</p>
                  <p style={{ color: "#374151", fontSize: "0.9rem", lineHeight: 1.6 }}>{correction.feedback}</p>
                </div>
                {Array.isArray(correction.elementsCorrection) && correction.elementsCorrection.length > 0 && (
                  <div style={{ background: "#EFF6FF", borderRadius: "12px", padding: "14px", border: "1px solid #BFDBFE" }}>
                    <p style={{ fontFamily: "'Fredoka One', cursive", color: "#1D4ED8", fontSize: "0.9rem", marginBottom: "6px" }}>
                      🔎 Éléments de correction (repères)
                    </p>
                    <ul style={{ margin: 0, paddingLeft: "18px", color: "#1F2937", fontSize: "0.88rem", lineHeight: 1.6 }}>
                      {correction.elementsCorrection.map((element, index) => (
                        <li key={`${index}-${element}`}>{element}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div style={{ textAlign: "center", marginTop: "16px", padding: "16px", background: "white", borderRadius: "12px", border: "1px solid #E5E7EB" }}>
                <p style={{ fontFamily: "'Fredoka One', cursive", color: COLORS.U, fontSize: "1.3rem" }}>
                  🌟 +{correction.xpGagne} XP gagnés !
                </p>
                <p style={{ color: "#6B7280", fontSize: "0.78rem", marginTop: "6px" }}>
                  🐾 {correction.xpDetail || "Modificateur familier: 0%"}
                </p>
                <p style={{ color: "#9CA3AF", fontSize: "0.75rem", marginTop: "6px" }}>
                  Moteur de correction : {MISSION_ENGINE_VERSION}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ===== COMPOSANT PRINCIPAL =====
export default function Missions({ profil, onXPGagne }) {
  const niveauxAccessibles = useMemo(
    () => (profil?.classe === "terminale" ? ["premiere", "terminale"] : ["premiere"]),
    [profil?.classe]
  );
  const [niveauSelectionne, setNiveauSelectionne] = useState(profil?.classe === "terminale" ? "terminale" : "premiere");
  const [matiereSelectionnee, setMatiereSelectionnee] = useState("");
  const [themeSelectionne, setThemeSelectionne] = useState("");
  const [difficulteSelectionnee, setDifficulteSelectionnee] = useState("facile");
  const [xpGagne, setXpGagne] = useState(0);
  const [showNotif, setShowNotif] = useState(false);
  const [missions, setMissions] = useState([]);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800;900&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    chargerMissions();
    return () => {
      if (document.head.contains(link)) document.head.removeChild(link);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const niveauParDefaut = profil?.classe === "terminale" ? "terminale" : "premiere";
    if (!niveauxAccessibles.includes(niveauSelectionne)) {
      setNiveauSelectionne(niveauParDefaut);
    }
  }, [profil?.classe, niveauxAccessibles, niveauSelectionne]);

  const chargerMissions = async () => {
    try {
      const snapshot = await getDocs(collection(db, "missions"));
      const toutes = snapshot.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .sort((a, b) => {
          const diffA = Number(a.difficulte) || 1;
          const diffB = Number(b.difficulte) || 1;
          if (diffA !== diffB) return diffA - diffB;
          return (Number(a.ordre) || 999) - (Number(b.ordre) || 999);
        });
      const sansDoublonSilph = toutes.filter((mission) => mission.id !== MISSION_CAS_SILPH_ID);
      setMissions([...sansDoublonSilph, MISSION_CAS_SILPH]);
    } catch (err) { console.error(err); }
    setChargement(false);
  };

  const handleMissionComplete = (xp) => {
    setXpGagne(xp);
    setShowNotif(true);
    setTimeout(() => setShowNotif(false), 3000);
    if (onXPGagne) onXPGagne();
  };

  const matieresDisponibles = Array.from(new Set(
    missions
      .filter(m => (m.niveau || "premiere").toLowerCase() === niveauSelectionne)
      .filter(m => !difficulteSelectionnee || getCategorieDifficulte(m) === difficulteSelectionnee)
      .map(m => m.matiere)
      .filter(Boolean)
  )).sort();

  const themesDisponibles = Array.from(new Set(
    missions
      .filter(m => (m.niveau || "premiere").toLowerCase() === niveauSelectionne)
      .filter(m => !difficulteSelectionnee || getCategorieDifficulte(m) === difficulteSelectionnee)
      .filter(m => !matiereSelectionnee || m.matiere === matiereSelectionnee)
      .map(m => m.theme)
      .filter(Boolean)
  )).sort();

  useEffect(() => {
    if (!matieresDisponibles.length) {
      setMatiereSelectionnee("");
      return;
    }
    if (!matiereSelectionnee || !matieresDisponibles.includes(matiereSelectionnee)) {
      setMatiereSelectionnee(matieresDisponibles[0]);
    }
  }, [niveauSelectionne, difficulteSelectionnee, missions, matieresDisponibles, matiereSelectionnee]);

  useEffect(() => {
    if (!themesDisponibles.length) {
      setThemeSelectionne("");
      return;
    }
    if (!themeSelectionne || !themesDisponibles.includes(themeSelectionne)) {
      setThemeSelectionne(themesDisponibles[0]);
    }
  }, [niveauSelectionne, difficulteSelectionnee, matiereSelectionnee, missions, themesDisponibles, themeSelectionne]);

  const missionsFiltrees = missions.filter(m =>
    niveauxAccessibles.includes((m.niveau || "premiere").toLowerCase()) &&
    (m.niveau || "premiere").toLowerCase() === niveauSelectionne &&
    (!difficulteSelectionnee || getCategorieDifficulte(m) === difficulteSelectionnee) &&
    (!matiereSelectionnee || m.matiere === matiereSelectionnee) &&
    (!themeSelectionne || m.theme === themeSelectionne)
  );

  const missionsCompletes = missionsFiltrees.filter(m => missionDejaFaite(profil, m.id)).length;
  const totalMissions = missionsFiltrees.length;

  return (
    <div style={{ minHeight: "100vh", background: "#F1F5F9", fontFamily: "'Nunito', sans-serif" }}>
      {showNotif && (
        <div style={{
          position: "fixed", top: "80px", right: "24px", zIndex: 100,
          background: "linear-gradient(135deg, #F59E0B, #B45309)",
          color: "white", fontFamily: "'Fredoka One', cursive", fontSize: "1.2rem",
          padding: "16px 24px", borderRadius: "20px", boxShadow: "0 8px 30px #F59E0B50",
        }}>
          🌟 +{xpGagne} XP gagnés !
        </div>
      )}

      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "24px 16px" }}>

        <div style={{ background: "linear-gradient(135deg, #0B2447, #0369A1)", borderRadius: "24px", padding: "28px 32px", marginBottom: "24px" }}>
          <h1 style={{ fontFamily: "'Fredoka One', cursive", fontSize: "2.2rem", color: "white", margin: "0 0 4px" }}>🎯 Mes Missions</h1>
          <p style={{ color: "#BAE6FD", margin: "0 0 20px", fontSize: "0.9rem" }}>Missions classées par niveau, matière et difficulté.</p>
          <p style={{ color: "#E0F2FE", margin: "0 0 14px", fontSize: "0.75rem" }}>
            Version correction : {MISSION_ENGINE_VERSION}
          </p>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ background: "#3B82F625", border: "1px solid #3B82F650", borderRadius: "14px", padding: "8px 18px" }}>
              <p style={{ fontFamily: "'Fredoka One', cursive", color: "white", fontSize: "0.85rem", margin: 0 }}>
                Progression : {missionsCompletes}/{totalMissions}
              </p>
            </div>
            {profil?.classe === "terminale" && (
              <div style={{ background: "#10B98125", border: "1px solid #10B98150", borderRadius: "14px", padding: "8px 18px" }}>
                <p style={{ fontFamily: "'Fredoka One', cursive", color: "white", fontSize: "0.85rem", margin: 0 }}>
                  ✅ Accès Terminale + Première
                </p>
              </div>
            )}
          </div>
        </div>

        <div style={{ background: "white", borderRadius: "16px", border: "2px solid #E5E7EB", padding: "14px", marginBottom: "20px" }}>
          <p style={{ fontFamily: "'Fredoka One', cursive", color: "#111827", fontSize: "0.9rem", margin: "0 0 10px" }}>
            Filtres des missions
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "10px" }}>
            <div style={{ borderRadius: "12px", border: `2px solid ${COLORS.S}30`, padding: "10px 12px" }}>
              <p style={{ fontFamily: "'Fredoka One', cursive", color: COLORS.S, fontSize: "0.78rem", margin: "0 0 6px" }}>
                Niveau
              </p>
              <select
                value={niveauSelectionne}
                onChange={(e) => setNiveauSelectionne(e.target.value)}
                style={{
                  width: "100%",
                  border: `2px solid ${COLORS.S}35`,
                  borderRadius: "10px",
                  padding: "8px 10px",
                  fontFamily: "'Nunito', sans-serif",
                  fontWeight: 700,
                  color: "#1F2937",
                  background: "white",
                }}
              >
                {niveauxAccessibles.map(nv => (
                  <option key={nv} value={nv}>
                    {nv === "terminale" ? "Terminale" : "Première"}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ borderRadius: "12px", border: `2px solid ${COLORS.H}30`, padding: "10px 12px" }}>
              <p style={{ fontFamily: "'Fredoka One', cursive", color: COLORS.H, fontSize: "0.78rem", margin: "0 0 6px" }}>
                Difficulté
              </p>
              <select
                value={difficulteSelectionnee}
                onChange={(e) => setDifficulteSelectionnee(e.target.value)}
                style={{
                  width: "100%",
                  border: `2px solid ${COLORS.H}35`,
                  borderRadius: "10px",
                  padding: "8px 10px",
                  fontFamily: "'Nunito', sans-serif",
                  fontWeight: 700,
                  color: "#1F2937",
                  background: "white",
                }}
              >
                <option value="facile">FACILE (⭐ 1-2)</option>
                <option value="difficile">DIFFICILE (⭐ 3-5)</option>
              </select>
            </div>
            <div style={{ borderRadius: "12px", border: `2px solid ${COLORS.U}30`, padding: "10px 12px" }}>
              <p style={{ fontFamily: "'Fredoka One', cursive", color: COLORS.U, fontSize: "0.78rem", margin: "0 0 6px" }}>
                Matière
              </p>
              <select
                value={matiereSelectionnee}
                onChange={(e) => setMatiereSelectionnee(e.target.value)}
                style={{
                  width: "100%",
                  border: `2px solid ${COLORS.U}35`,
                  borderRadius: "10px",
                  padding: "8px 10px",
                  fontFamily: "'Nunito', sans-serif",
                  fontWeight: 700,
                  color: "#1F2937",
                  background: "white",
                }}
              >
                {matieresDisponibles.map(mat => (
                  <option key={mat} value={mat}>{mat}</option>
                ))}
              </select>
            </div>
            <div style={{ borderRadius: "12px", border: `2px solid ${COLORS.G}30`, padding: "10px 12px" }}>
              <p style={{ fontFamily: "'Fredoka One', cursive", color: COLORS.G, fontSize: "0.78rem", margin: "0 0 6px" }}>
                Thème
              </p>
              <select
                value={themeSelectionne}
                onChange={(e) => setThemeSelectionne(e.target.value)}
                style={{
                  width: "100%",
                  border: `2px solid ${COLORS.G}35`,
                  borderRadius: "10px",
                  padding: "8px 10px",
                  fontFamily: "'Nunito', sans-serif",
                  fontWeight: 700,
                  color: "#1F2937",
                  background: "white",
                }}
              >
                {themesDisponibles.map(theme => (
                  <option key={theme} value={theme}>{theme}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {chargement ? (
          <div style={{ textAlign: "center", padding: "60px", background: "white", borderRadius: "24px" }}>
            <p style={{ fontFamily: "'Fredoka One', cursive", fontSize: "1.5rem", color: "#6B7280" }}>⏳ Chargement des missions...</p>
          </div>
        ) : (
          <>
            <div>
              <p style={{ color: "#9CA3AF", fontSize: "0.85rem", marginBottom: "20px" }}>
                📚 {totalMissions} missions — {missionsCompletes} déjà complétées
              </p>
              {missionsFiltrees.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px", background: "white", borderRadius: "24px" }}>
                  <p style={{ fontFamily: "'Fredoka One', cursive", color: "#9CA3AF", fontSize: "1.2rem" }}>Aucune mission disponible pour ce filtre 🎯</p>
                </div>
              ) : missionsFiltrees.map(mission => (
                <CarteMission key={mission.id} mission={mission} profil={profil} onMissionComplete={handleMissionComplete} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}