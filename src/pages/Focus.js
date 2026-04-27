import { useEffect, useMemo, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const COLORS = {
  page: "#F8FAFC",
  card: "#FFFFFF",
  border: "#E2E8F0",
  text: "#0F172A",
  muted: "#475569",
  blue: "#2563EB",
  green: "#16A34A",
  orange: "#EA580C",
  red: "#DC2626",
};

const FOCUS_PROGRESS_VERSION = 2;

const EXERCISES = [
  {
    id: "focus-13-1",
    matiere: "SDGN",
    theme: "Thème 3",
    difficulty: 1,
    type: "Définition",
    xp: 40,
    title: "Définir la performance",
    consigne: "Définis la performance dans une organisation et cite les 3 étapes de la démarche de performance.",
    correction:
      "La performance correspond à l’atteinte d’objectifs prédéfinis. La démarche suit 3 étapes : définition des objectifs, détermination/utilisation des moyens, atteinte du résultat.",
    expectedKeywords: ["performance", "objectifs", "definition", "moyens", "resultat", "atteinte"],
    expectedNumbers: [3],
  },
  {
    id: "focus-13-2",
    matiere: "SDGN",
    theme: "Thème 3",
    difficulty: 2,
    type: "Définition",
    xp: 55,
    title: "Rentabilité vs profitabilité",
    consigne: "Explique la différence entre rentabilité et profitabilité en une réponse structurée.",
    correction:
      "La rentabilité mesure la capacité à générer des profits à partir des moyens investis (capitaux). La profitabilité mesure la capacité à dégager du profit à partir de l’activité (souvent le chiffre d’affaires).",
    expectedKeywords: ["rentabilite", "profitabilite", "profits", "capitaux", "activite", "chiffre"],
  },
  {
    id: "focus-13-3",
    matiere: "SDGN",
    theme: "Thème 3",
    difficulty: 3,
    type: "Analyse",
    xp: 65,
    title: "Objectifs bien formulés",
    consigne: "Pourquoi des objectifs doivent-ils être compréhensibles, mesurables, réalisables et limités dans le temps ?",
    correction:
      "Des objectifs clairs permettent aux acteurs d’agir correctement. Ils doivent être mesurables pour vérifier l’atteinte, réalisables pour rester motivants, et limités dans le temps pour piloter l’action.",
    expectedKeywords: ["comprehensibles", "mesurables", "realisables", "temps", "indicateurs", "atteinte"],
  },
  {
    id: "focus-13-4",
    matiere: "SDGN",
    theme: "Thème 3",
    difficulty: 4,
    type: "Calcul",
    xp: 80,
    title: "Évolution du chiffre d’affaires",
    consigne:
      "Une entreprise passe de 180 000 € de CA à 225 000 €. Calcule l’évolution en valeur et en pourcentage, puis interprète.",
    correction:
      "Évolution en valeur = 225 000 - 180 000 = +45 000 €. Évolution en % = 45 000 / 180 000 = 25 %. L’entreprise améliore sa performance commerciale.",
    expectedKeywords: ["evolution", "valeur", "pourcentage", "performance", "commerciale", "analyse", "interprete"],
    expectedNumbers: [45000, 25],
  },
  {
    id: "focus-13-5",
    matiere: "SDGN",
    theme: "Thème 3",
    difficulty: 5,
    type: "Calcul",
    xp: 90,
    title: "Part de marché",
    consigne:
      "Le CA de l’entreprise est 300 000 €. Le CA total du marché est 1 200 000 €. Calcule la part de marché puis analyse ce que cela signifie face aux concurrents.",
    correction:
      "Part de marché = 300 000 / 1 200 000 = 0,25 soit 25 %. L’entreprise réalise un quart des ventes du marché.",
    expectedKeywords: ["part", "marche", "pourcentage", "concurrents", "ventes", "analyse", "interprete"],
    expectedNumbers: [25],
  },
  {
    id: "focus-13-6",
    matiere: "SDGN",
    theme: "Thème 3",
    difficulty: 6,
    type: "Calcul",
    xp: 100,
    title: "Rentabilité financière",
    consigne:
      "Bénéfice net = 48 000 €. Capitaux propres = 240 000 €. Calcule la rentabilité (en %) et interprète le résultat.",
    correction:
      "Rentabilité = bénéfice net / capitaux propres = 48 000 / 240 000 = 0,20 soit 20 %. Chaque euro investi en capitaux propres génère 0,20 € de bénéfice.",
    expectedKeywords: ["rentabilite", "benefice", "capitaux", "pourcentage", "interprete", "analyse"],
    expectedNumbers: [20],
  },
  {
    id: "focus-13-6b",
    matiere: "SDGN",
    theme: "Thème 3",
    difficulty: 7,
    type: "Calcul",
    xp: 115,
    title: "Profitabilité de l’activité",
    consigne:
      "Résultat net = 36 000 € et chiffre d’affaires = 450 000 €. Calcule la profitabilité (en %) puis analyse ce résultat pour l’activité.",
    correction:
      "Profitabilité = résultat net / chiffre d’affaires = 36 000 / 450 000 = 0,08 soit 8 %. L’organisation transforme 8 % de son CA en résultat net, ce qui mesure l’efficacité de l’activité.",
    expectedKeywords: ["profitabilite", "resultat", "chiffre", "affaires", "pourcentage", "analyse", "activite"],
    expectedNumbers: [8],
  },
  {
    id: "focus-13-6c",
    matiere: "SDGN",
    theme: "Thème 3",
    difficulty: 8,
    type: "Calcul",
    xp: 125,
    title: "Comparer rentabilité et profitabilité",
    consigne:
      "Entreprise A : bénéfice 50 000 €, capitaux 250 000 €, CA 1 000 000 €. Calcule rentabilité et profitabilité, puis analyse l’écart entre les deux indicateurs.",
    correction:
      "Rentabilité = 50 000 / 250 000 = 20 %. Profitabilité = 50 000 / 1 000 000 = 5 %. L’entreprise est rentable pour ses capitaux mais sa marge sur activité reste limitée.",
    expectedKeywords: ["rentabilite", "profitabilite", "capitaux", "activite", "ecart", "analyse"],
    expectedNumbers: [20, 5],
  },
  {
    id: "focus-13-7",
    matiere: "SDGN",
    theme: "Thème 3",
    difficulty: 9,
    type: "Tableau de bord",
    xp: 120,
    title: "Construire un mini tableau de bord",
    consigne:
      "Propose un mini tableau de bord (5 indicateurs) pour suivre la performance commerciale et financière d’une organisation.",
    correction:
      "Exemples pertinents : chiffre d’affaires, évolution du CA, part de marché, taux de fidélité, marge/profit, rentabilité. Il faut préciser l’unité et la périodicité.",
    expectedKeywords: ["tableau", "bord", "indicateurs", "chiffre", "part", "fidelite", "rentabilite", "periodicite"],
    expectedNumbers: [5],
  },
  {
    id: "focus-13-8",
    matiere: "SDGN",
    theme: "Thème 3",
    difficulty: 10,
    type: "Comparaison",
    xp: 140,
    title: "Comparer les performances dans le temps",
    consigne:
      "Année N : CA 520 000 €, part de marché 18 %, rentabilité 12 %. Année N+1 : CA 560 000 €, part de marché 17 %, rentabilité 10 %. Analyse la performance globale.",
    correction:
      "Le CA progresse (+40 000 €), mais part de marché et rentabilité reculent. La performance est contrastée : volume en hausse, efficacité concurrentielle et financière en baisse.",
    expectedKeywords: ["comparaison", "temps", "hausse", "baisse", "part", "rentabilite", "globale", "analyse"],
    expectedNumbers: [40000],
  },
  {
    id: "focus-13-9",
    matiere: "SDGN",
    theme: "Thème 3",
    difficulty: 11,
    type: "Calcul",
    xp: 150,
    title: "Profitabilité année N",
    consigne:
      "Une organisation réalise un résultat net de 28 000 € pour un chiffre d’affaires de 350 000 €. Calcule la profitabilité (en %) puis analyse ce que cela indique.",
    correction:
      "Profitabilité = résultat net / chiffre d’affaires = 28 000 / 350 000 = 0,08 soit 8 %. L’activité transforme 8 % de son CA en résultat net.",
    expectedKeywords: ["profitabilite", "resultat", "chiffre", "affaires", "analyse", "activite", "pourcentage"],
    expectedNumbers: [8],
  },
  {
    id: "focus-13-10",
    matiere: "SDGN",
    theme: "Thème 3",
    difficulty: 12,
    type: "Calcul",
    xp: 160,
    title: "Rentabilité année N",
    consigne:
      "Bénéfice net = 54 000 €, capitaux propres = 300 000 €. Calcule la rentabilité (en %) puis interprète le résultat pour les investisseurs.",
    correction:
      "Rentabilité = 54 000 / 300 000 = 0,18 soit 18 %. Les capitaux propres dégagent 18 % de bénéfice sur la période.",
    expectedKeywords: ["rentabilite", "benefice", "capitaux", "investisseurs", "interprete", "analyse", "pourcentage"],
    expectedNumbers: [18],
  },
  {
    id: "focus-13-11",
    matiere: "SDGN",
    theme: "Thème 3",
    difficulty: 13,
    type: "Comparaison",
    xp: 170,
    title: "Comparer 2 entreprises",
    consigne:
      "Entreprise A : bénéfice 40 000 €, capitaux 200 000 €, CA 800 000 €. Entreprise B : bénéfice 45 000 €, capitaux 300 000 €, CA 600 000 €. Compare rentabilité et profitabilité puis conclus.",
    correction:
      "A : rentabilité 20 %, profitabilité 5 %. B : rentabilité 15 %, profitabilité 7,5 %. A rémunère mieux les capitaux, B transforme mieux son activité en profit.",
    expectedKeywords: ["comparer", "rentabilite", "profitabilite", "conclusion", "capitaux", "activite", "analyse"],
    expectedNumbers: [20, 5, 15, 7.5],
  },
  {
    id: "focus-13-12",
    matiere: "SDGN",
    theme: "Thème 3",
    difficulty: 14,
    type: "Calcul",
    xp: 180,
    title: "Évolution de la rentabilité",
    consigne:
      "Rentabilité N = 10 % et rentabilité N+1 = 13 %. Calcule l’évolution en points et en pourcentage, puis explique le sens managérial.",
    correction:
      "Évolution en points = +3 points. Évolution relative = 3 / 10 = +30 %. L’organisation améliore sa capacité à rémunérer les capitaux investis.",
    expectedKeywords: ["evolution", "points", "pourcentage", "rentabilite", "analyse", "managerial"],
    expectedNumbers: [3, 30],
  },
  {
    id: "focus-13-13",
    matiere: "SDGN",
    theme: "Thème 3",
    difficulty: 15,
    type: "Tableau de bord",
    xp: 200,
    title: "Tableau de bord final chap 13",
    consigne:
      "Conçois un tableau de bord final (au moins 6 indicateurs) pour piloter performance commerciale ET financière, avec périodicité et seuil d’alerte.",
    correction:
      "Exemples attendus : CA, évolution CA, part de marché, taux de fidélité, rentabilité, profitabilité. Ajouter unité, fréquence (mensuel/trimestriel) et seuil d’alerte.",
    expectedKeywords: ["tableau", "bord", "indicateurs", "commerciale", "financiere", "periodicite", "seuil", "alerte"],
    expectedNumbers: [6],
  },
  {
    id: "focus-6-1",
    matiere: "SDGN",
    theme: "Thème 2",
    difficulty: 1,
    type: "Définition",
    xp: 40,
    title: "Donnée, information, connaissance",
    consigne: "Définis les notions de donnée, information et connaissance.",
    correction:
      "La donnée est un élément brut. L’information est une donnée traitée et contextualisée. La connaissance est l’information interprétée et mobilisable pour agir.",
    expectedKeywords: ["donnee", "information", "connaissance", "brut", "contextualisee", "interpretee"],
  },
  {
    id: "focus-6-2",
    matiere: "SDGN",
    theme: "Thème 2",
    difficulty: 2,
    type: "Définition",
    xp: 50,
    title: "Définir le Big Data",
    consigne: "Explique ce qu’est le Big Data et pourquoi il représente un enjeu pour les organisations.",
    correction:
      "Le Big Data correspond à des masses très importantes de données numériques. L’enjeu principal est de pouvoir les collecter, trier et exploiter pour piloter l’activité et la décision.",
    expectedKeywords: ["big", "data", "masses", "donnees", "enjeu", "organisation", "decision"],
  },
  {
    id: "focus-6-3",
    matiere: "SDGN",
    theme: "Thème 2",
    difficulty: 3,
    type: "Notions",
    xp: 60,
    title: "Les 5V du Big Data",
    consigne: "Cite et définis les 5V du Big Data.",
    correction:
      "Volume (quantité), Vélocité (vitesse de traitement), Variété (hétérogénéité), Véracité (fiabilité), Valeur (utilité/retour).",
    expectedKeywords: ["volume", "velocite", "variete", "veracite", "valeur", "5v"],
    expectedNumbers: [5],
  },
  {
    id: "focus-6-4",
    matiere: "SDGN",
    theme: "Thème 2",
    difficulty: 4,
    type: "Définition",
    xp: 70,
    title: "Open Data",
    consigne: "Définis l’open data et donne deux caractéristiques essentielles.",
    correction:
      "L’open data regroupe des données accessibles à tous, réutilisables et redistribuables sans restriction forte. Les caractéristiques attendues : accès public, réutilisation, diffusion.",
    expectedKeywords: ["open", "data", "accessible", "reutilisable", "distribuable", "public"],
    expectedNumbers: [2],
  },
  {
    id: "focus-6-5",
    matiere: "SDGN",
    theme: "Thème 2",
    difficulty: 5,
    type: "Réglementation",
    xp: 80,
    title: "Loi République numérique",
    consigne: "Quelle obligation d’open data concerne les collectivités de plus de 3 500 habitants ?",
    correction:
      "Elles doivent publier leurs données sur Internet pour les rendre visibles et réutilisables, afin d’améliorer la transparence de l’action publique.",
    expectedKeywords: ["collectivites", "3500", "publier", "donnees", "internet", "reutilisables", "transparence"],
    expectedNumbers: [3500],
  },
  {
    id: "focus-6-6",
    matiere: "SDGN",
    theme: "Thème 2",
    difficulty: 6,
    type: "Définition",
    xp: 90,
    title: "Données personnelles",
    consigne: "Définis une donnée personnelle et explique la contrainte principale pour son utilisation.",
    correction:
      "Une donnée personnelle permet d’identifier directement ou indirectement une personne. Son utilisation exige un cadre légal et le respect des droits des individus.",
    expectedKeywords: ["donnees", "personnelles", "identifier", "indirectement", "cadre", "legal", "droits"],
  },
  {
    id: "focus-6-7",
    matiere: "SDGN",
    theme: "Thème 2",
    difficulty: 7,
    type: "Application",
    xp: 100,
    title: "Usages opérationnels des données",
    consigne: "Donne 3 exemples d’opérations de gestion courante rendues possibles par les données numériques.",
    correction:
      "Exemples : bon de commande, facturation, suivi de livraison, gestion des stocks, suivi client. Les données soutiennent les processus quotidiens.",
    expectedKeywords: ["commande", "facture", "livraison", "stocks", "gestion", "courante"],
    expectedNumbers: [3],
  },
  {
    id: "focus-6-8",
    matiere: "SDGN",
    theme: "Thème 2",
    difficulty: 8,
    type: "Application",
    xp: 110,
    title: "Données et décision",
    consigne: "Explique comment les données numériques aident la prise de décision managériale.",
    correction:
      "Elles permettent de produire des tableaux de bord et indicateurs, d’analyser la situation, puis de décider (aménagement, offre, fidélisation, allocation des ressources).",
    expectedKeywords: ["tableau", "bord", "indicateurs", "analyse", "decision", "manageriale"],
  },
  {
    id: "focus-6-9",
    matiere: "SDGN",
    theme: "Thème 2",
    difficulty: 9,
    type: "Système d'information",
    xp: 120,
    title: "Rôle du système d’information",
    consigne: "Décris le rôle du SI dans la transformation des données en information utile.",
    correction:
      "Le SI collecte, stocke, traite et diffuse les données. Il articule ressources humaines, logicielles et matérielles pour transformer la donnée brute en information exploitable.",
    expectedKeywords: ["si", "collecter", "stocker", "traiter", "diffuser", "ressources", "logiciels", "materielles"],
  },
  {
    id: "focus-6-10",
    matiere: "SDGN",
    theme: "Thème 2",
    difficulty: 10,
    type: "Qualité",
    xp: 130,
    title: "Qualité de l’information",
    consigne: "Cite et explique 4 critères de qualité de l’information.",
    correction:
      "Critères possibles : pertinence, fiabilité, objectivité, actualité, accessibilité rapide, rentabilité. Une information de qualité doit être utile et exploitable.",
    expectedKeywords: ["pertinente", "fiable", "objective", "actualite", "accessible", "rentable"],
    expectedNumbers: [4],
  },
  {
    id: "focus-6-11",
    matiere: "SDGN",
    theme: "Thème 2",
    difficulty: 11,
    type: "Réglementation",
    xp: 145,
    title: "RGPD - obligations",
    consigne: "Présente 4 obligations majeures imposées par le RGPD aux organisations.",
    correction:
      "Exemples attendus : registre des traitements, finalité explicite, tri/minimisation, information des personnes, sécurisation des données, durée de conservation encadrée.",
    expectedKeywords: ["rgpd", "registre", "finalite", "tri", "information", "securisation", "conservation"],
    expectedNumbers: [4],
  },
  {
    id: "focus-6-12",
    matiere: "SDGN",
    theme: "Thème 2",
    difficulty: 12,
    type: "Étude de cas",
    xp: 160,
    title: "Audit RGPD rapide",
    consigne:
      "Une boutique en ligne collecte email, nom, historique d’achat, géolocalisation et conserve tout sans limite. Identifie au moins 3 non-conformités RGPD et propose une correction pour chacune.",
    correction:
      "Non-conformités possibles : absence de durée de conservation, collecte excessive sans finalité claire, manque d’information des personnes, sécurisation insuffisante. Chaque écart doit être relié à une action corrective.",
    expectedKeywords: ["non", "conformite", "rgpd", "duree", "conservation", "finalite", "information", "securisation", "correction"],
    expectedNumbers: [3],
  },
  {
    id: "focus-6-13",
    matiere: "SDGN",
    theme: "Thème 2",
    difficulty: 13,
    type: "Conception",
    xp: 175,
    title: "Chaîne de transformation",
    consigne: "Construis un schéma texte de la chaîne donnée → information → connaissance appliqué à un exemple d’organisation.",
    correction:
      "Réponse attendue : données collectées, traitement/contextualisation, information produite, interprétation par un acteur, décision/action. L’exemple doit être cohérent.",
    expectedKeywords: ["donnee", "information", "connaissance", "traitement", "interpretation", "decision", "action"],
  },
  {
    id: "focus-6-14",
    matiere: "SDGN",
    theme: "Thème 2",
    difficulty: 14,
    type: "Tableau de bord",
    xp: 190,
    title: "Piloter un projet Open Data",
    consigne:
      "Propose un mini tableau de bord (5 indicateurs) pour suivre la réussite d’un projet open data d’une collectivité.",
    correction:
      "Indicateurs pertinents : nombre de jeux publiés, taux de réutilisation, fréquence de mise à jour, taux de qualité/fiabilité, satisfaction usagers, délai d’accès.",
    expectedKeywords: ["tableau", "bord", "open", "data", "indicateurs", "reutilisation", "qualite", "mise", "jour"],
    expectedNumbers: [5],
  },
  {
    id: "focus-6-15",
    matiere: "SDGN",
    theme: "Thème 2",
    difficulty: 15,
    type: "Synthèse",
    xp: 210,
    title: "Synthèse chap 6",
    consigne:
      "Rédige une synthèse argumentée (15 lignes) : montre que les technologies transforment l’information en ressource stratégique, tout en créant des contraintes juridiques et organisationnelles.",
    correction:
      "Attendu : articulation Big Data / SI / décision / qualité de l’information / RGPD. La synthèse doit montrer les apports (pilotage, efficacité, transparence) et les limites (protection des données, conformité, qualité).",
    expectedKeywords: ["technologies", "information", "ressource", "strategique", "si", "big", "data", "rgpd", "contraintes", "organisationnelles"],
    expectedNumbers: [15],
  },
];

const normalize = (v = "") =>
  String(v)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s%€]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const SYNONYM_GROUPS = [
  ["definir", "fixer", "determiner", "etablir", "preciser"],
  ["objectif", "objectifs", "but", "cible", "finalite"],
  ["resultat", "resultats", "issue", "issues"],
  ["atteinte", "realisation", "accomplissement"],
  ["analyse", "analyser", "interprete", "interpreter", "interpretation", "conclure", "conclusion"],
  ["chiffre", "ca", "chiffre affaires", "chiffre d affaires"],
  ["rentabilite", "rendement"],
  ["profitabilite", "marge nette"],
  ["indicateur", "indicateurs", "kpi", "kpis"],
];

const canonicalize = (text = "") => {
  let out = normalize(text);
  SYNONYM_GROUPS.forEach((group) => {
    const canonical = group[0];
    group.forEach((variant) => {
      const escaped = normalize(variant).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      out = out.replace(new RegExp(`\\b${escaped}\\b`, "g"), canonical);
    });
  });
  return out;
};

const getTodayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
};

const extractNumbers = (text = "") => {
  const matches = String(text).match(/-?\d+(?:[.,]\d+)?/g) || [];
  return matches.map((m) => Number(m.replace(",", "."))).filter((n) => Number.isFinite(n));
};

const evaluate = (exercise, answer) => {
  const clean = canonicalize(answer);
  if (!clean) {
    return {
      score: 0,
      pointsForts: "Réponse vide.",
      aAmeliorer: "Rédige une première version structurée.",
      reperes: [],
      mention: "À travailler",
    };
  }

  const expectedNormalized = exercise.expectedKeywords.map((k) => canonicalize(k));
  const foundKeywords = expectedNormalized.filter((k) => clean.includes(k));
  const keywordRatio = expectedNormalized.length ? foundKeywords.length / expectedNormalized.length : 0;

  let numberRatio = 1;
  let missingNumbers = [];
  if (exercise.expectedNumbers?.length) {
    const responseNumbers = extractNumbers(answer);
    const matched = exercise.expectedNumbers.filter((expected) =>
      responseNumbers.some((n) => Math.abs(n - expected) <= Math.max(0.5, Math.abs(expected) * 0.02))
    );
    numberRatio = matched.length / exercise.expectedNumbers.length;
    missingNumbers = exercise.expectedNumbers.filter((n) => !matched.includes(n));
  }

  const hasAnalysis = /(analyse|interpre|cela signifie|on peut conclure|donc|ce resultat|impact|montre que|indique que)/i.test(clean);
  const structureBonus = answer.length >= 120 ? 1.2 : answer.length >= 80 ? 0.9 : answer.length >= 40 ? 0.6 : 0.3;
  const analysisBonus = exercise.type === "Calcul" ? (hasAnalysis ? 1.2 : 0.5) : hasAnalysis ? 0.8 : 0.5;
  const rawScore = (keywordRatio * 5.2) + (numberRatio * 2.8) + structureBonus + analysisBonus;
  const tentativeFloor = answer.trim().length >= 35 ? 2 : 0;
  const partialCoverage = Math.max(keywordRatio, numberRatio);
  const partialFloor = partialCoverage >= 0.66 ? 6 : partialCoverage >= 0.33 ? 4 : 0;
  const score = Math.max(tentativeFloor, partialFloor, Math.min(10, Math.round(rawScore * 10) / 10));

  const mention = score >= 8 ? "Très bien" : score >= 6 ? "Bon travail" : score >= 4 ? "Passable" : "À travailler";
  const missingKeywords = expectedNormalized.filter((k) => !foundKeywords.includes(k)).slice(0, 4);

  return {
    score,
    mention,
    pointsForts: foundKeywords.length ? `Notions repérées : ${foundKeywords.slice(0, 5).join(", ")}.` : "Tu as tenté de répondre.",
    aAmeliorer:
      missingKeywords.length || missingNumbers.length
        ? `À ajouter : ${[
            missingKeywords.length ? `mots-clés (${missingKeywords.join(", ")})` : "",
            missingNumbers.length ? `résultats numériques (${missingNumbers.join(", ")})` : "",
          ]
            .filter(Boolean)
            .join(" ; ")}.`
        : "Réponse complète et bien orientée.",
    reperes: foundKeywords.slice(0, 5),
  };
};

function FocusCard({ exercise, claim, onClaimXP }) {
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [localInfo, setLocalInfo] = useState("");
  const [answerLocked, setAnswerLocked] = useState(false);

  const canEvaluate = answer.trim().length >= 25 && !answerLocked;
  const today = getTodayKey();
  const alreadyClaimed = claim?.lastClaimDate === today;
  const canClaim = !alreadyClaimed && result && result.score >= 5;
  const claimHint = alreadyClaimed
    ? "XP déjà validés aujourd’hui pour cet exercice."
    : !result
      ? "Corrige d’abord ta réponse."
      : result.score < 5
        ? "Score minimum requis : 5/10 pour valider l’XP."
        : "";

  const validate = () => {
    const next = evaluate(exercise, answer);
    setResult(next);
    setAnswerLocked(true);
  };

  const claimXp = async () => {
    if (!canClaim) {
      setLocalInfo(claimHint || "Validation impossible pour le moment.");
      return;
    }
    setLoading(true);
    try {
      const ok = await onClaimXP(exercise.id, exercise.xp);
      if (!ok) setLocalInfo("Échec de validation. Vérifie la connexion et réessaie.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="focus-card" style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: 16 }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
        <span style={{ borderRadius: 999, padding: "4px 10px", background: "#DBEAFE", color: "#1D4ED8", fontWeight: 700, fontSize: 12 }}>
          Niveau {exercise.difficulty}
        </span>
        <span style={{ borderRadius: 999, padding: "4px 10px", background: "#F3E8FF", color: "#6D28D9", fontWeight: 700, fontSize: 12 }}>
          {exercise.type}
        </span>
        <span style={{ borderRadius: 999, padding: "4px 10px", background: "#DCFCE7", color: "#166534", fontWeight: 700, fontSize: 12 }}>
          +{exercise.xp} XP
        </span>
      </div>

      <h3 className="focus-title" style={{ margin: "0 0 6px", color: COLORS.text }}>{exercise.title}</h3>
      <p style={{ margin: 0, color: COLORS.muted, lineHeight: 1.5 }}>{exercise.consigne}</p>

      <textarea
        value={answer}
        onChange={(e) => {
          if (answerLocked) return;
          setAnswer(e.target.value);
        }}
        readOnly={answerLocked}
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
        placeholder="Rédige ta réponse..."
        style={{
          width: "100%",
          marginTop: 10,
          minHeight: 115,
          borderRadius: 10,
          border: `1px solid ${COLORS.border}`,
          padding: 10,
          fontSize: 14,
          color: COLORS.text,
          boxSizing: "border-box",
        }}
      />
      <p style={{ margin: "6px 0 0", color: "#64748B", fontSize: 12 }}>
        Copier/coller désactivé sur cette zone de réponse.
      </p>
      {answerLocked && (
        <p style={{ margin: "6px 0 0", color: "#9F1239", fontSize: 12, fontWeight: 700 }}>
          Réponse verrouillée après correction : modification impossible.
        </p>
      )}

      <div className="focus-actions" style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
        <button
          className="focus-btn"
          onClick={validate}
          disabled={!canEvaluate}
          style={{
            border: "none",
            borderRadius: 10,
            padding: "8px 11px",
            fontWeight: 700,
            cursor: canEvaluate ? "pointer" : "not-allowed",
            background: canEvaluate ? COLORS.blue : "#CBD5E1",
            color: "white",
          }}
        >
          Corriger ma réponse
        </button>
        <button
          className="focus-btn"
          onClick={claimXp}
          disabled={!canClaim || loading}
          style={{
            border: "none",
            borderRadius: 10,
            padding: "8px 11px",
            fontWeight: 700,
            cursor: canClaim && !loading ? "pointer" : "not-allowed",
            background: canClaim ? COLORS.green : "#CBD5E1",
            color: "white",
          }}
        >
          {alreadyClaimed ? "XP déjà gagné aujourd’hui" : loading ? "Validation..." : `Valider +${exercise.xp} XP`}
        </button>
      </div>
      {(claimHint || localInfo) && (
        <p style={{ margin: "6px 0 0", color: "#64748B", fontSize: 12 }}>
          {localInfo || claimHint}
        </p>
      )}

      {result && (
        <div style={{ marginTop: 10, borderRadius: 10, border: "1px solid #BFDBFE", background: "#EFF6FF", padding: 10 }}>
          <p style={{ margin: 0, color: "#1E3A8A", fontWeight: 800 }}>Score: {result.score}/10 — {result.mention}</p>
          <p style={{ margin: "6px 0 0", color: "#166534" }}><strong>Points forts:</strong> {result.pointsForts}</p>
          <p style={{ margin: "6px 0 0", color: "#9A3412" }}><strong>À améliorer:</strong> {result.aAmeliorer}</p>
          <div style={{ marginTop: 8, borderRadius: 10, border: "1px solid #FCD34D", background: "#FFFBEB", padding: 10 }}>
            <p style={{ margin: 0, color: "#92400E" }}><strong>Correction attendue:</strong> {exercise.correction}</p>
            <p style={{ margin: "6px 0 0", color: "#7C2D12", fontSize: 13 }}>
              <strong>Explication simple:</strong> compare toujours ton résultat à la question posée, puis termine par une phrase d’interprétation ("ce que cela veut dire pour l’organisation").
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Focus({ profil, onXPGagne }) {
  const [claims, setClaims] = useState({});
  const [banner, setBanner] = useState(null);
  const [matiereSelectionnee, setMatiereSelectionnee] = useState("SDGN");
  const [themeSelectionne, setThemeSelectionne] = useState("Thème 3");

  const matieres = useMemo(() => Array.from(new Set(EXERCISES.map((ex) => ex.matiere || "SDGN"))), []);
  const themes = useMemo(
    () => Array.from(new Set(EXERCISES.filter((ex) => (ex.matiere || "SDGN") === matiereSelectionnee).map((ex) => ex.theme || "Sans thème"))),
    [matiereSelectionnee]
  );
  const exercicesFiltres = useMemo(
    () =>
      EXERCISES
        .filter((ex) => (ex.matiere || "SDGN") === matiereSelectionnee && (ex.theme || "Sans thème") === themeSelectionne)
        .sort((a, b) => a.difficulty - b.difficulty),
    [matiereSelectionnee, themeSelectionne]
  );
  const xpPotential = useMemo(() => exercicesFiltres.reduce((sum, ex) => sum + ex.xp, 0), [exercicesFiltres]);

  useEffect(() => {
    if (!themes.includes(themeSelectionne)) {
      setThemeSelectionne(themes[0] || "Thème 3");
    }
  }, [themes, themeSelectionne]);

  useEffect(() => {
    const load = async () => {
      const user = auth.currentUser;
      if (!user) return;
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (!snap.exists()) return;
        const progress = snap.data()?.focusProgress || {};
        const isCurrent = progress?.version === FOCUS_PROGRESS_VERSION;
        setClaims(isCurrent ? progress.claims || {} : {});
      } catch (err) {
        console.error("Chargement focus impossible", err);
      }
    };
    load();
  }, []);

  const handleClaimXP = async (exerciseId, xp) => {
    const user = auth.currentUser;
    if (!user) {
      setBanner({ type: "error", text: "Session expirée. Reconnecte-toi pour valider l’XP." });
      return false;
    }
    try {
      const today = getTodayKey();
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        setBanner({ type: "error", text: "Profil introuvable. Recharge la page." });
        return false;
      }
      const data = snap.data();
      const storedProgress = data.focusProgress || {};
      const prevClaims = storedProgress?.version === FOCUS_PROGRESS_VERSION ? (storedProgress.claims || {}) : {};
      if (prevClaims[exerciseId]?.lastClaimDate === today) {
        setBanner({ type: "error", text: "XP déjà validés aujourd’hui pour cet exercice." });
        return false;
      }

      const nextClaims = {
        ...prevClaims,
        [exerciseId]: {
          lastClaimDate: today,
          totalClaims: (prevClaims[exerciseId]?.totalClaims || 0) + 1,
        },
      };

      await updateDoc(ref, {
        xp: (data.xp || 0) + xp,
        focusProgress: {
          ...(storedProgress || {}),
          version: FOCUS_PROGRESS_VERSION,
          chapter: "SDGN 1ère - Chapitre 13",
          claims: nextClaims,
        },
      });

      setClaims(nextClaims);
      setBanner({ type: "success", text: `+${xp} XP gagnés sur Focus.` });
      if (onXPGagne) onXPGagne();
      return true;
    } catch (err) {
      console.error("Validation XP Focus impossible", err);
      setBanner({ type: "error", text: "Validation impossible pour le moment. Vérifie la connexion puis réessaie." });
      return false;
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: COLORS.page, padding: "20px 14px 28px", color: COLORS.text }}>
      <style>
        {`
          .focus-card { padding: 16px; }
          .focus-title { font-size: 1.12rem; line-height: 1.35; }
          .focus-actions .focus-btn { min-height: 42px; }
          @media (max-width: 640px) {
            .focus-card { padding: 13px; border-radius: 14px; }
            .focus-title { font-size: 1rem; }
            .focus-hero { padding: 14px; border-radius: 14px; }
            .focus-hero-title { font-size: 1.25rem; line-height: 1.3; }
            .focus-hero-text { font-size: 0.92rem; }
            .focus-badges span { width: 100%; text-align: center; }
            .focus-actions { width: 100%; }
            .focus-actions .focus-btn { width: 100%; }
          }
          @media (max-width: 420px) {
            .focus-title { font-size: 0.96rem; }
            .focus-hero-title { font-size: 1.12rem; }
          }
        `}
      </style>
      <div style={{ maxWidth: 980, margin: "0 auto", display: "flex", flexDirection: "column", gap: 14 }}>
        {banner && (
          <div style={{ background: banner.type === "success" ? "#DCFCE7" : "#FEE2E2", color: banner.type === "success" ? "#166534" : COLORS.red, border: `1px solid ${banner.type === "success" ? "#86EFAC" : "#FECACA"}`, borderRadius: 12, padding: "9px 12px", fontWeight: 700 }}>
            {banner.text}
          </div>
        )}

        <section className="focus-hero" style={{ background: "#FFFFFF", border: `1px solid ${COLORS.border}`, borderRadius: 18, padding: 18 }}>
          <h1 className="focus-hero-title" style={{ margin: "0 0 6px", color: "#1E3A8A" }}>🎯 Focus — SDGN 1ère · Chapitre 13</h1>
          <p className="focus-hero-text" style={{ margin: 0, color: COLORS.muted, lineHeight: 1.55 }}>
            Révision ciblée sur l’analyse des performances commerciale et financière. Progression en difficulté croissante: définitions, analyses, calculs et tableau de bord.
          </p>
          <div className="focus-badges" style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <span style={{ background: "#DBEAFE", color: "#1D4ED8", borderRadius: 999, padding: "5px 11px", fontWeight: 700 }}>Notions: performance, rentabilité, profitabilité, indicateurs</span>
            <span style={{ background: "#DCFCE7", color: "#166534", borderRadius: 999, padding: "5px 11px", fontWeight: 700 }}>XP potentiel/jour: +{xpPotential}</span>
            <span style={{ background: "#FEF3C7", color: "#92400E", borderRadius: 999, padding: "5px 11px", fontWeight: 700 }}>15 exercices progressifs</span>
            <span style={{ background: "#FFE4E6", color: "#9F1239", borderRadius: 999, padding: "5px 11px", fontWeight: 700 }}>Mode correction équilibré v{FOCUS_PROGRESS_VERSION}</span>
          </div>

          <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div style={{ borderRadius: 12, border: "1px solid #BFDBFE", padding: "9px 10px", background: "#EFF6FF" }}>
              <p style={{ margin: "0 0 5px", color: "#1D4ED8", fontWeight: 700, fontSize: 12 }}>Matière</p>
              <select
                value={matiereSelectionnee}
                onChange={(e) => setMatiereSelectionnee(e.target.value)}
                style={{ width: "100%", borderRadius: 8, border: "1px solid #93C5FD", padding: "7px 9px", fontWeight: 700, color: "#1E3A8A", background: "white" }}
              >
                {matieres.map((matiere) => (
                  <option key={matiere} value={matiere}>{matiere}</option>
                ))}
              </select>
            </div>
            <div style={{ borderRadius: 12, border: "1px solid #FBCFE8", padding: "9px 10px", background: "#FFF1F2" }}>
              <p style={{ margin: "0 0 5px", color: "#BE185D", fontWeight: 700, fontSize: 12 }}>Thème</p>
              <select
                value={themeSelectionne}
                onChange={(e) => setThemeSelectionne(e.target.value)}
                style={{ width: "100%", borderRadius: 8, border: "1px solid #FDA4AF", padding: "7px 9px", fontWeight: 700, color: "#9F1239", background: "white" }}
              >
                {themes.map((theme) => (
                  <option key={theme} value={theme}>{theme}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <section style={{ display: "grid", gap: 10 }}>
          {exercicesFiltres.map((exercise) => (
            <FocusCard key={exercise.id} exercise={exercise} claim={claims[exercise.id]} onClaimXP={handleClaimXP} />
          ))}
          {!exercicesFiltres.length && (
            <div style={{ background: "#FFFFFF", border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: 14, color: COLORS.muted }}>
              Aucun exercice disponible pour ce filtre.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

