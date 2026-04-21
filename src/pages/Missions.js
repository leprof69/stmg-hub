import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, updateDoc, getDoc, collection, getDocs } from "firebase/firestore";

const COLORS = {
  S: "#3B82F6", T: "#7C3AED", M: "#F97316",
  G: "#10B981", H: "#EF4444", U: "#F59E0B", B: "#06B6D4",
};
const MISSION_ENGINE_VERSION = "strict-v5-2026-04-21";
const MISSION_XP_MULTIPLIER = 1.35;
const MISSION_XP_MIN = { quotidienne: 200, hebdomadaire: 300, mensuelle: 500 };

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
  if (repTokens.size < 5) return 2;

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

  if (communCorrection === 0 && communQuestion <= 1 && motsClesTrouves === 0) return 2;
  if (communCorrection <= 1 && motsClesTrouves === 0) return 3;
  if (communCorrection <= 2 && motsClesTrouves <= 1) return 4;
  if (communCorrection <= 4 && motsClesTrouves <= 1) return 6;
  return 10;
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

const preuvesValides = (preuves, source) => Array.isArray(preuves)
  && preuves.some(p => typeof p === "string" && contientFragmentNormalise(source, p));

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

const pause = (ms) => new Promise(resolve => setTimeout(resolve, ms));

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
3. Tu dois fournir des preuves textuelles exactes de la réponse élève ET de la correction
4. Si tu ne peux pas citer au moins une preuve exacte côté élève, alors hors_sujet=true et score <= 2
5. Si la réponse semble générée par une IA (style trop soutenu, "Il convient de noter", "En outre") => score = 0, triche_detectee = true
6. Feedback PERSONNALISÉ : explique précisément ce qui correspond/ne correspond pas à la correction

Réponds UNIQUEMENT en JSON sans aucun texte avant ou après.
Format JSON exact :
{"score": number, "feedback": "Texte personnalisé", "points_forts": "Texte personnalisé", "a_ameliorer": "Texte personnalisé", "triche_detectee": boolean, "hors_sujet": boolean, "preuves_eleve": ["citation exacte élève"], "preuves_correction": ["citation exacte correction"]}`;

  const apiKey = process.env.REACT_APP_GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("Clé Groq manquante (REACT_APP_GROQ_API_KEY).");
  }

  let data = null;
  try {
    data = await appelerGroqAvecRetry(apiKey, prompt);
  } catch {
    return calculerScoreLocal(mission, reponseEleve);
  }

  const content = data?.choices?.[0]?.message?.content || "";
  if (!content) {
    throw new Error("Réponse vide du modèle.");
  }

  const contenuSansFence = content.replace(/```json|```/gi, "").trim();
  const debut = contenuSansFence.indexOf("{");
  const fin = contenuSansFence.lastIndexOf("}");
  if (debut === -1 || fin === -1 || fin <= debut) {
    return {
      score: 1,
      feedback: "Je ne peux pas corriger précisément pour l'instant : réponse IA invalide.",
      points_forts: "Tu as essayé de répondre.",
      a_ameliorer: "Réessaie dans quelques secondes.",
      triche_detectee: false,
    };
  }

  let correction = null;
  try {
    correction = JSON.parse(contenuSansFence.slice(debut, fin + 1));
  } catch {
    return {
      score: 1,
      feedback: "Je n'ai pas pu lire la correction IA (format invalide).",
      points_forts: "Tu as répondu à la mission.",
      a_ameliorer: "Réessaie pour obtenir une correction fiable.",
      triche_detectee: false,
    };
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

  const champsGeneriques = contientTexteTemplate(resultat.feedback)
    || contientTexteTemplate(resultat.points_forts)
    || contientTexteTemplate(resultat.a_ameliorer);
  if (champsGeneriques) {
    resultat.score = Math.min(resultat.score, 2);
    resultat.feedback = "La correction IA reçue est trop générique pour être fiable.";
    resultat.points_forts = "Tu as soumis ta réponse.";
    resultat.a_ameliorer = "Réessaie avec une réponse structurée liée aux notions du chapitre.";
  }

  const preuvesEleveOk = preuvesValides(preuvesEleve, reponseEleve);
  const preuvesCorrectionOk = preuvesValides(preuvesCorrection, mission.correction || "");
  if (!preuvesEleveOk || !preuvesCorrectionOk) {
    // On reste prudent mais on n'écrase pas une bonne réponse.
    resultat.score = Math.min(resultat.score, 7);
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
  resultat.score = Math.min(resultat.score, maxLocal);

  if (feedbackSembleHallucine(resultat.feedback, reponseEleve)) {
    resultat.score = Math.min(resultat.score, 2);
    resultat.feedback = "La correction semble incohérente avec ta réponse réelle.";
    resultat.points_forts = "Tu as soumis ta réponse.";
    resultat.a_ameliorer = "Rédige une réponse liée à la question et aux notions attendues.";
  }

  const { ratio, motsCommuns } = evaluerPertinenceLocale(mission, reponseEleve);
  if (ratio < 0.06 || motsCommuns < 2) {
    resultat.score = Math.min(resultat.score, 4);
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
  const [dejaFaite] = useState(missionDejaFaite(profil, mission.id));
  const difficulte = Math.max(1, Math.min(5, Number(mission.difficulte) || 1));
  const niveau = (mission.niveau || "premiere").toLowerCase();
  const couleur = difficulte >= 4 ? COLORS.H : difficulte >= 3 ? COLORS.U : COLORS.S;
  const niveauLabel = niveau === "terminale" ? "📘 Terminale" : "📗 Première";

  const soumettre = async () => {
    if (!reponse.trim() || reponse.length < 20) return;
    setChargement(true);
    try {
      const result = await corrigerAvecGroq(mission, reponse);
      const resultFinal = detecterReponseBrouillon(reponse)
        ? {
          ...result,
          score: 0,
          feedback: "Réponse trop courte ou hors sujet : note automatiquement plafonnée.",
          points_forts: "Tu as essayé de répondre.",
          a_ameliorer: "Rédige une réponse complète en lien direct avec la correction de référence.",
          triche_detectee: false,
        }
        : result;
      const user = auth.currentUser;
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const userData = userDoc.data();
      const xpBase = getMissionXPBase(mission);
      const xpMissionBoostee = Math.round(xpBase * MISSION_XP_MULTIPLIER);
      const xpGagne = (dejaFaite || resultFinal.triche_detectee) ? 0 : Math.round((resultFinal.score / 10) * xpMissionBoostee);
      const newXP = (userData.xp || 0) + xpGagne;
      const historique = userData.missionsHistorique || {};
      historique[mission.id] = {
        date: getDateJour(),
        score: resultFinal.score,
        xpGagne,
      };
      await updateDoc(doc(db, "users", user.uid), { xp: newXP, missionsHistorique: historique });
      setCorrection({ ...resultFinal, xpGagne });
      onMissionComplete(xpGagne);
    } catch (err) {
      console.error(err);
      setCorrection({ score: 0, feedback: "Erreur de connexion à l'IA. Réessaie !", points_forts: "", a_ameliorer: "", triche_detectee: false, xpGagne: 0 });
    }
    setChargement(false);
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
          <p style={{ color: "#6B7280", fontSize: "0.9rem", lineHeight: 1.6 }}>{mission.contexte}</p>
        </div>
      </div>

      <div style={{ background: couleur + "10", borderRadius: "16px", padding: "16px", marginBottom: "16px", border: `1px solid ${couleur}20` }}>
        <p style={{ fontFamily: "'Fredoka One', cursive", color: couleur, marginBottom: "8px", fontSize: "0.9rem" }}>❓ Question</p>
        <p style={{ color: "#374151", lineHeight: 1.8, whiteSpace: "pre-line" }}>{mission.question}</p>
      </div>

      {!correction ? (
        <div>
          <textarea
            value={reponse}
            onChange={e => setReponse(e.target.value)}
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
          <p style={{ color: "#9CA3AF", fontSize: "0.8rem", marginTop: "8px" }}>
            ⚠️ Réponds avec tes propres mots — l'IA détecte les réponses copiées !
          </p>
          <button onClick={soumettre} disabled={chargement || reponse.length < 20}
            style={{
              marginTop: "12px", width: "100%",
              background: reponse.length >= 20 ? couleur : "#E5E7EB",
              color: reponse.length >= 20 ? "white" : "#9CA3AF",
              border: "none", fontFamily: "'Fredoka One', cursive",
              fontSize: "1.1rem", padding: "14px",
              borderRadius: "16px", cursor: reponse.length >= 20 ? "pointer" : "not-allowed",
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
              </div>
              <div style={{ textAlign: "center", marginTop: "16px", padding: "16px", background: "white", borderRadius: "12px", border: "1px solid #E5E7EB" }}>
                <p style={{ fontFamily: "'Fredoka One', cursive", color: COLORS.U, fontSize: "1.3rem" }}>
                  🌟 +{correction.xpGagne} XP gagnés !
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
  const niveauxAccessibles = profil?.classe === "terminale" ? ["premiere", "terminale"] : ["premiere"];
  const [niveauSelectionne, setNiveauSelectionne] = useState(profil?.classe === "terminale" ? "terminale" : "premiere");
  const [matiereSelectionnee, setMatiereSelectionnee] = useState("Toutes");
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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const chargerMissions = async () => {
    try {
      const snapshot = await getDocs(collection(db, "missions"));
      const toutes = snapshot.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(m => niveauxAccessibles.includes(String(m.niveau || "").toLowerCase()))
        .sort((a, b) => {
          const diffA = Number(a.difficulte) || 1;
          const diffB = Number(b.difficulte) || 1;
          if (diffA !== diffB) return diffA - diffB;
          return (Number(a.ordre) || 999) - (Number(b.ordre) || 999);
        });
      setMissions(toutes);
    } catch (err) { console.error(err); }
    setChargement(false);
  };

  const handleMissionComplete = (xp) => {
    setXpGagne(xp);
    setShowNotif(true);
    setTimeout(() => setShowNotif(false), 3000);
    if (onXPGagne) onXPGagne();
  };

  const matieresDisponibles = ["Toutes", ...Array.from(new Set(
    missions
      .filter(m => (m.niveau || "premiere").toLowerCase() === niveauSelectionne)
      .map(m => m.matiere)
      .filter(Boolean)
  )).sort()];

  const missionsFiltrees = missions.filter(m =>
    (m.niveau || "premiere").toLowerCase() === niveauSelectionne &&
    (matiereSelectionnee === "Toutes" || m.matiere === matiereSelectionnee)
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

        <div style={{ background: "linear-gradient(135deg, #1A1A2E, #2D1B69)", borderRadius: "24px", padding: "28px 32px", marginBottom: "24px" }}>
          <h1 style={{ fontFamily: "'Fredoka One', cursive", fontSize: "2.2rem", color: "white", margin: "0 0 4px" }}>🎯 Mes Missions</h1>
          <p style={{ color: "#A78BFA", margin: "0 0 20px", fontSize: "0.9rem" }}>Missions classées par niveau, matière et difficulté.</p>
          <p style={{ color: "#C4B5FD", margin: "0 0 14px", fontSize: "0.75rem" }}>
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

        <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
          {niveauxAccessibles.map(nv => (
            <button key={nv} onClick={() => setNiveauSelectionne(nv)}
              style={{
                background: niveauSelectionne === nv ? (nv === "terminale" ? COLORS.T : COLORS.S) : "white",
                color: niveauSelectionne === nv ? "white" : (nv === "terminale" ? COLORS.T : COLORS.S),
                border: `2px solid ${nv === "terminale" ? COLORS.T : COLORS.S}`,
                fontFamily: "'Fredoka One', cursive", fontSize: "1rem",
                padding: "10px 20px", borderRadius: "14px", cursor: "pointer",
              }}>
              {nv === "terminale" ? "📘 Terminale" : "📗 Première"}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
          {matieresDisponibles.map(mat => (
            <button key={mat} onClick={() => setMatiereSelectionnee(mat)}
              style={{
                background: matiereSelectionnee === mat ? COLORS.U : "white",
                color: matiereSelectionnee === mat ? "white" : COLORS.U,
                border: `2px solid ${COLORS.U}`,
                fontFamily: "'Fredoka One', cursive", fontSize: "0.92rem",
                padding: "8px 16px", borderRadius: "14px", cursor: "pointer",
              }}>
              {mat}
            </button>
          ))}
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