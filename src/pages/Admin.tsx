// @ts-nocheck
import { useState, useEffect, useMemo } from "react";
import { auth, db } from "../services/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { doc, setDoc, collection, getDocs, deleteDoc, updateDoc, deleteField } from "firebase/firestore";
import * as XLSX from "xlsx";
import { DS_EXAM_ID, DS_LOCK_TYPE, DS_EXERCISES } from "../services/devoirSurveilleExamData";
import { COLLECTIONS } from "../services/collectionsData";
import { formatJetons, formatJetonsDelta } from "../lib/jetons";
import {
  SDGN_MISSIONS_PROGRESS_VERSION,
  compareSdgnExerciseIds,
  getSdgnMissionMeta,
} from "../data/sdgnMissionCatalog";

const COLORS = {
  S: "#3B82F6", T: "#7C3AED", M: "#F97316",
  G: "#10B981", H: "#EF4444", U: "#F59E0B", B: "#06B6D4",
};

const EMOJI_PAR_MATIERE = {
  "Management": "🏪", "Droit": "⚖️", "Economie": "📊",
  "Sciences de Gestion": "💻", "Marketing": "📣",
  "Ressources Humaines": "👥", "Gestion Finance": "💰",
};

const familleColors = {
  Architecte: "#3B82F6", Visionnaire: "#7C3AED",
  Challenger: "#F97316", Explorateur: "#10B981", Influenceur: "#EF4444",
};

const familleEmojis = {
  Architecte: "🧠", Visionnaire: "🎨",
  Challenger: "⚡", Explorateur: "🔬", Influenceur: "🔥",
};

const RECOMPENSES_INDIVIDUEL = [
  { rang: 1, label: "🥇 1er", xp: 200, couleur: "#F59E0B" },
  { rang: 2, label: "🥈 2ème", xp: 150, couleur: "#9CA3AF" },
  { rang: 3, label: "🥉 3ème", xp: 100, couleur: "#CD7F32" },
  { rang: 4, label: "4ème", xp: 75, couleur: "#3B82F6" },
  { rang: 5, label: "5ème", xp: 50, couleur: "#3B82F6" },
];

const RECOMPENSES_FAMILLE = [
  { rang: 1, label: "🥇 1ère", xp: 150, couleur: "#F59E0B" },
  { rang: 2, label: "🥈 2ème", xp: 100, couleur: "#9CA3AF" },
  { rang: 3, label: "🥉 3ème", xp: 75, couleur: "#CD7F32" },
  { rang: 4, label: "4ème", xp: 50, couleur: "#3B82F6" },
  { rang: 5, label: "5ème", xp: 25, couleur: "#3B82F6" },
];

const ONGLET_ADMIN = [
  { id: "reporting", label: "📊 Reporting élèves" },
  { id: "recompenses", label: "🏆 Récompenses jetons" },
  { id: "imports", label: "📥 Imports & maintenance" },
  { id: "infos", label: "💡 Infos" },
];
const DS_EXERCISE_BY_ID = Object.fromEntries(DS_EXERCISES.map((exercise) => [exercise.id, exercise]));
const RARETE_PARTICIPATION = {
  commune: 0,
  peu_commune: 0,
  rare: 0.5,
  epique: 1,
  legendaire: 2,
  ultra_rare: 3,
};
const CARD_BONUS_BY_ID = (() => {
  const map = {};
  COLLECTIONS.forEach((colSet) => {
    (colSet.cartes || []).forEach((card) => {
      map[card.id] = RARETE_PARTICIPATION[card.rarete] || 0;
    });
  });
  return map;
})();

const col = (row, ...keys) => {
  for (const k of keys) {
    if (row[k] !== undefined && row[k] !== null && row[k] !== "") return row[k];
  }
  return "";
};

const splitMotsCles = (valeur) => {
  if (!valeur) return [];
  return String(valeur)
    .split(/[|,;/]/)
    .map(m => m.trim())
    .filter(Boolean);
};

const compterCartesTotal = (cartes = {}) => Object.values(cartes).reduce((sum, n) => sum + (Number(n) || 0), 0);
const compterCartesUniques = (cartes = {}) => Object.values(cartes).filter(n => (Number(n) || 0) > 0).length;

const toDate = (value) => {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value?.toDate === "function") return value.toDate();
  if (typeof value === "number") return new Date(value);
  if (typeof value === "string") {
    const asDate = new Date(value);
    return Number.isNaN(asDate.getTime()) ? null : asDate;
  }
  return null;
};

const parseDayKey = (value) => {
  if (!value || typeof value !== "string") return null;
  const parts = value.split("-").map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) return null;
  const [y, m, d] = parts;
  return new Date(y, m - 1, d, 12, 0, 0, 0);
};

const toDayKey = (date = new Date()) => `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

const joursEcoules = (date) => {
  if (!date) return null;
  const now = new Date();
  const a = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const b = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.floor((a - b) / (1000 * 60 * 60 * 24));
};

const formatDateFr = (date) => {
  if (!date) return "Jamais";
  return date.toLocaleString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
};

const formatDuration = (seconds = 0) => {
  const total = Math.max(0, Math.floor(Number(seconds) || 0));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (h > 0) return `${h}h ${String(m).padStart(2, "0")}m`;
  if (m > 0) return `${m}m ${String(s).padStart(2, "0")}s`;
  return `${s}s`;
};

export default function Admin() {
  const [fichierChapitres, setFichierChapitres] = useState(null);
  const [importChapitres, setImportChapitres] = useState({ loading: false, succes: 0, erreurs: 0, message: "" });
  const [fichierMissions, setFichierMissions] = useState(null);
  const [importMissions, setImportMissions] = useState({ loading: false, succes: 0, erreurs: 0, message: "" });
  const [eleves, setEleves] = useState([]);
  const [usersAll, setUsersAll] = useState([]);
  const [chargementEleves, setChargementEleves] = useState(false);
  const [recompenseEnCours, setRecompenseEnCours] = useState(false);
  const [messagesRecompense, setMessagesRecompense] = useState([]);
  const [xpCustom, setXpCustom] = useState({});
  const [famillesClassement, setFamillesClassement] = useState([]);
  const [erreurEleves, setErreurEleves] = useState("");
  const [filtreClasse, setFiltreClasse] = useState("toutes");
  const [filtreLycee, setFiltreLycee] = useState("tous");
  const [ongletActif, setOngletActif] = useState("reporting");
  const [filtreActivite, setFiltreActivite] = useState("tous");
  const [rechercheEleve, setRechercheEleve] = useState("");
  const [resetDsLoading, setResetDsLoading] = useState(false);
  const [sdgnExpanded, setSdgnExpanded] = useState({});
  const [resetPwdUserId, setResetPwdUserId] = useState(null);
  const [flashReporting, setFlashReporting] = useState("");
  const [quickJetons, setQuickJetons] = useState({});

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800;900&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    chargerEleves();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const chargerEleves = async () => {
    setChargementEleves(true);
    setErreurEleves("");
    try {
      const snapshot = await getDocs(collection(db, "users"));
      const allUsers = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setUsersAll(allUsers);
      const users = allUsers
        .filter(u => u.role !== "admin")
        .sort((a, b) => (b.xp || 0) - (a.xp || 0));
      setEleves(users);
      const famillesMap = {};
      users.forEach(u => {
        if (!u.famille) return;
        if (!famillesMap[u.famille]) famillesMap[u.famille] = { nom: u.famille, xp: 0, membres: 0 };
        famillesMap[u.famille].xp += (u.xp || 0);
        famillesMap[u.famille].membres += 1;
      });
      setFamillesClassement(Object.values(famillesMap).sort((a, b) => b.xp - a.xp));
      const initXp = {};
      users.forEach((u, i) => { initXp[u.id] = RECOMPENSES_INDIVIDUEL[i]?.xp || 0; });
      setXpCustom(initXp);
    } catch (err) {
      console.error(err);
      setErreurEleves("Impossible de charger les élèves (droits Firestore ou connexion).");
    }
    setChargementEleves(false);
  };

  const envoyerLienResetMdp = async (eleve) => {
    let email = String(eleve.email || "").trim();
    if (!email) {
      const saisi = window.prompt(
        `Aucun e-mail enregistré pour ${eleve.nomAffiche}.\n\n` +
          `Saisis l'e-mail du compte Firebase Auth (UID ${eleve.id}) :`,
      );
      if (!saisi) return;
      email = saisi.trim();
    }
    if (!email) return;
    if (
      !window.confirm(
        `Envoyer un lien « mot de passe oublié » à :\n\n${email}\n(${eleve.nomAffiche})\n\nL'élève doit vérifier sa boîte mail (et les spams).`,
      )
    ) {
      return;
    }
    setResetPwdUserId(eleve.id);
    setFlashReporting("");
    try {
      await sendPasswordResetEmail(auth, email, {
        url: `${window.location.origin}/`,
        handleCodeInApp: false,
      });
      setFlashReporting(`Lien de réinitialisation envoyé à ${email} (${eleve.nomAffiche}). Demande à l'élève de vérifier les spams.`);
      if (!eleve.email) {
        await updateDoc(doc(db, "users", eleve.id), { email });
        await chargerEleves();
      }
    } catch (err) {
      console.error(err);
      const code = err && typeof err === "object" && "code" in err ? err.code : "";
      let msg = "échec d'envoi";
      if (code === "auth/invalid-email") msg = "e-mail invalide";
      if (code === "auth/too-many-requests") msg = "trop de demandes, réessaie plus tard";
      setFlashReporting(`Erreur envoi reset MDP pour ${eleve.nomAffiche} : ${msg}.`);
    } finally {
      setResetPwdUserId(null);
    }
  };

  const retablirJetonsAntiTriche = async (userId, nomAffiche) => {
    if (!window.confirm(`Rétablir les jetons pour ${nomAffiche} ? (lève la suspension « changement d’onglet »)`)) return;
    try {
      await updateDoc(doc(db, "users", userId), {
        "platformIntegrity.xpSuspended": false,
        "platformIntegrity.clearedAt": new Date().toISOString(),
        "platformIntegrity.clearedByAdmin": true,
      });
      await chargerEleves();
    } catch (err) {
      console.error(err);
      window.alert("Échec : vérifie la connexion et que les règles Firestore sont déployées.");
    }
  };

  const distribuerXPIndividuel = async (userId, xp, prenom) => {
    if (!xp || xp <= 0) return;
    setRecompenseEnCours(true);
    try {
      const snap = await getDocs(collection(db, "users"));
      const user = snap.docs.find(d => d.id === userId);
      if (!user) return;
      await updateDoc(doc(db, "users", userId), { xp: (user.data().xp || 0) + xp });
      setMessagesRecompense(prev => [...prev, `✅ ${formatJetonsDelta(xp)} → ${prenom}`]);
      await chargerEleves();
    } catch { setMessagesRecompense(prev => [...prev, `❌ Erreur pour ${prenom}`]); }
    setRecompenseEnCours(false);
  };

  const retirerXPIndividuel = async (userId, xp, prenom) => {
    if (!xp || xp <= 0) return;
    if (!window.confirm(`Retirer ${formatJetons(xp)} à ${prenom || "cet élève"} ?`)) return;
    setRecompenseEnCours(true);
    try {
      const snap = await getDocs(collection(db, "users"));
      const user = snap.docs.find(d => d.id === userId);
      if (!user) return;
      const xpActuel = user.data().xp || 0;
      const nouveauXP = Math.max(0, xpActuel - xp);
      await updateDoc(doc(db, "users", userId), { xp: nouveauXP });
      setMessagesRecompense(prev => [...prev, `⚠️ ${formatJetonsDelta(-xp)} → ${prenom || "Élève"} (${formatJetons(xpActuel)} → ${formatJetons(nouveauXP)})`]);
      await chargerEleves();
    } catch {
      setMessagesRecompense(prev => [...prev, `❌ Erreur retrait jetons pour ${prenom || "Élève"}`]);
    }
    setRecompenseEnCours(false);
  };

  const distribuerXPFamille = async (famille, xpParMembre) => {
    if (!xpParMembre || xpParMembre <= 0) return;
    setRecompenseEnCours(true);
    try {
      const snapshot = await getDocs(collection(db, "users"));
      const membres = snapshot.docs.filter(d => d.data().famille === famille);
      for (const membre of membres) {
        await updateDoc(doc(db, "users", membre.id), { xp: (membre.data().xp || 0) + xpParMembre });
      }
      setMessagesRecompense(prev => [...prev, `✅ ${formatJetonsDelta(xpParMembre)} × ${membres.length} membres → Famille ${famille}`]);
      await chargerEleves();
    } catch { setMessagesRecompense(prev => [...prev, `❌ Erreur famille ${famille}`]); }
    setRecompenseEnCours(false);
  };

  const distribuerTopIndividuel = async () => {
    if (!window.confirm("Distribuer les jetons bonus aux 5 premiers élèves ?")) return;
    setMessagesRecompense([]);
    for (let i = 0; i < Math.min(5, eleves.length); i++) {
      await distribuerXPIndividuel(eleves[i].id, xpCustom[eleves[i].id] ?? RECOMPENSES_INDIVIDUEL[i].xp, eleves[i].prenom);
    }
  };

  const distribuerTopFamilles = async () => {
    if (!window.confirm("Distribuer les jetons bonus aux familles ?")) return;
    setMessagesRecompense([]);
    for (let i = 0; i < Math.min(5, famillesClassement.length); i++) {
      await distribuerXPFamille(famillesClassement[i].nom, RECOMPENSES_FAMILLE[i].xp);
    }
  };

  const classesDispo = Array.from(new Set(eleves.map(e => e.classe).filter(Boolean))).sort();
  const lyceesDispo = Array.from(new Set(eleves.map(e => e.lycee).filter(Boolean))).sort();
  const elevesFiltres = eleves.filter(e =>
    (filtreClasse === "toutes" || e.classe === filtreClasse) &&
    (filtreLycee === "tous" || e.lycee === filtreLycee)
  );

  const statsParClasse = classesDispo.map(cl => {
    const membres = eleves.filter(e => e.classe === cl);
    return {
      classe: cl,
      eleves: membres.length,
      xp: membres.reduce((sum, e) => sum + (e.xp || 0), 0),
    };
  }).sort((a, b) => b.xp - a.xp);

  const statsParLycee = lyceesDispo.map(ly => {
    const membres = eleves.filter(e => e.lycee === ly);
    return {
      lycee: ly,
      ville: membres[0]?.lyceeVille || "",
      eleves: membres.length,
      xp: membres.reduce((sum, e) => sum + (e.xp || 0), 0),
    };
  }).sort((a, b) => b.xp - a.xp);

  const todayKey = toDayKey();
  const reportingRows = useMemo(() => {
    return eleves.map((eleve) => {
      const missionsHistorique = eleve.missionsHistorique || {};
      const missionEntries = Object.values(missionsHistorique);
      const missionsToday = missionEntries.filter((m) => m?.date === todayKey).length;

      const mp = eleve.missionsProgress || {};
      const mpClaims = mp.version === SDGN_MISSIONS_PROGRESS_VERSION ? (mp.claims || {}) : {};
      const sdgnClaimEntries = Object.entries(mpClaims).filter(([id]) => String(id).startsWith("sdgn"));
      const sdgnClaimsToday = sdgnClaimEntries.filter(([, c]) => c?.lastClaimDate === todayKey).length;
      const sdgnExerciseCount = sdgnClaimEntries.length;
      const sdgnTotalAttempts = sdgnClaimEntries.reduce((sum, [, c]) => sum + (Number(c?.totalClaims) || 0), 0);
      const sdgnLastXpSum = sdgnClaimEntries.reduce((sum, [, c]) => sum + (Number(c?.lastXpAwarded) || 0), 0);
      const sdgnRows = sdgnClaimEntries
        .map(([exerciseId, c]) => {
          const meta = getSdgnMissionMeta(exerciseId);
          return {
            exerciseId,
            title: meta.title,
            chapter: meta.chapter,
            xpMax: meta.xpMax,
            lastClaimDate: c?.lastClaimDate,
            totalClaims: Number(c?.totalClaims) || 0,
            lastScore: c?.lastScore,
            lastPercent: c?.lastPercent,
            lastXpAwarded: Number(c?.lastXpAwarded) || 0,
          };
        })
        .sort((a, b) => compareSdgnExerciseIds(a.exerciseId, b.exerciseId));
      const antiCheatEvents = missionEntries.filter((m) => m?.antiCheatFlags?.tricheDetectee);
      const antiCheatToday = missionEntries.filter((m) => m?.date === todayKey && m?.antiCheatFlags?.tricheDetectee).length;
      const lastMissionDate = missionEntries
        .map((m) => parseDayKey(m?.date))
        .filter(Boolean)
        .sort((a, b) => b - a)[0] || null;

      const claims = eleve.objectifBacProgress?.claims || {};
      const claimEntries = Object.values(claims);
      const objectifToday = claimEntries.filter((c) => c?.lastClaimDate === todayKey).length;
      const objectifTotal = claimEntries.reduce((sum, c) => sum + (c?.totalClaims || 0), 0);
      const lastObjectifDate = claimEntries
        .map((c) => parseDayKey(c?.lastClaimDate))
        .filter(Boolean)
        .sort((a, b) => b - a)[0] || null;
      const focusClaims = eleve.focusProgress?.claims || {};
      const focusEntries = Object.values(focusClaims);
      const focusToday = focusEntries.filter((f) => f?.lastClaimDate === todayKey).length;
      const focusTotal = focusEntries.reduce((sum, f) => sum + (f?.totalClaims || 0), 0);
      const lastFocusDate = focusEntries
        .map((f) => parseDayKey(f?.lastClaimDate))
        .filter(Boolean)
        .sort((a, b) => b - a)[0] || null;

      const lastConnectionAt = toDate(eleve.lastConnectionAt);
      const lastConnectionDay = parseDayKey(eleve.lastConnectionDay);
      const lastCartesDay = parseDayKey(eleve.lastVisit);
      const createdAt = toDate(eleve.createdAt);

      const lastSdgnDates = sdgnRows.map((r) => parseDayKey(r.lastClaimDate)).filter(Boolean);
      const allDates = [lastConnectionAt, lastConnectionDay, lastCartesDay, lastMissionDate, lastObjectifDate, lastFocusDate, createdAt, ...lastSdgnDates].filter(Boolean);
      const lastActivity = allDates.sort((a, b) => b - a)[0] || null;
      const joursSansActivite = joursEcoules(lastActivity);

      const cartesTotal = compterCartesTotal(eleve.cartes || {});
      const cartesUniques = compterCartesUniques(eleve.cartes || {});
      const participationPoints = Object.entries(eleve.cartes || {}).reduce((sum, [cardId, qty]) => {
        if ((Number(qty) || 0) <= 0) return sum;
        return sum + (CARD_BONUS_BY_ID[cardId] || 0);
      }, 0);
      const aFaitCartesToday = eleve.lastVisit === todayKey;

      const actionsToday = [];
      if (lastConnectionDay && toDayKey(lastConnectionDay) === todayKey) actionsToday.push("Connexion");
      if (sdgnClaimsToday > 0) actionsToday.push(`${sdgnClaimsToday} exo. SDGN`);
      if (missionsToday > 0) actionsToday.push(`${missionsToday} mission(s) historique`);
      if (objectifToday > 0) actionsToday.push(`${objectifToday} entraînement(s) bac`);
      if (aFaitCartesToday) actionsToday.push("Cartes");
      if (!actionsToday.length) actionsToday.push("Aucune action détectée");

      const nom = eleve.prenom || eleve.nom || eleve.email || `Élève ${eleve.id.slice(0, 6)}`;
      const sessionTotalSec = Number(eleve.sessionTimeTotalSec) || 0;
      const sessionTodaySec = Number(eleve.sessionTimeToday?.[todayKey]) || 0;
      const sessionCount = Number(eleve.sessionCount) || 0;
      const lastSessionDurationSec = Number(eleve.lastSessionDurationSec) || 0;

      return {
        ...eleve,
        nomAffiche: nom,
        cartesTotal,
        cartesUniques,
        participationPoints,
        missionsToday,
        missionsTotal: missionEntries.length,
        missionsProgressChapter: mp.chapter || "",
        sdgnClaimsToday,
        sdgnExerciseCount,
        sdgnTotalAttempts,
        sdgnLastXpSum,
        sdgnRows,
        antiCheatEvents: antiCheatEvents.length,
        antiCheatToday,
        objectifToday,
        objectifTotal,
        focusToday,
        focusTotal,
        lastActivity,
        joursSansActivite,
        actionsToday,
        estActifAujourdhui: actionsToday[0] !== "Aucune action détectée",
        sessionTotalSec,
        sessionTodaySec,
        sessionCount,
        lastSessionDurationSec,
      };
    });
  }, [eleves, todayKey]);

  const reportingFiltres = useMemo(() => {
    return reportingRows.filter((eleve) => {
      const okClasse = filtreClasse === "toutes" || eleve.classe === filtreClasse;
      const okLycee = filtreLycee === "tous" || eleve.lycee === filtreLycee;
      const okRecherche = !rechercheEleve.trim() || eleve.nomAffiche.toLowerCase().includes(rechercheEleve.toLowerCase()) || String(eleve.email || "").toLowerCase().includes(rechercheEleve.toLowerCase());

      let okActivite = true;
      if (filtreActivite === "aujourdhui") okActivite = eleve.estActifAujourdhui;
      if (filtreActivite === "7jours") okActivite = eleve.joursSansActivite !== null && eleve.joursSansActivite <= 7;
      if (filtreActivite === "inactifs") okActivite = eleve.joursSansActivite !== null && eleve.joursSansActivite > 7;
      if (filtreActivite === "focus") okActivite = (eleve.focusTotal || 0) > 0;
      if (filtreActivite === "pas_focus") okActivite = (eleve.focusTotal || 0) === 0;
      if (filtreActivite === "sdgn") okActivite = (eleve.sdgnExerciseCount || 0) > 0;

      return okClasse && okLycee && okRecherche && okActivite;
    }).sort((a, b) => {
      const da = a.lastActivity ? a.lastActivity.getTime() : 0;
      const db = b.lastActivity ? b.lastActivity.getTime() : 0;
      return db - da;
    });
  }, [reportingRows, filtreClasse, filtreLycee, filtreActivite, rechercheEleve]);

  const dashboardStats = useMemo(() => {
    const total = reportingRows.length;
    const actifsAujourdhui = reportingRows.filter((e) => e.estActifAujourdhui).length;
    const actifs7j = reportingRows.filter((e) => e.joursSansActivite !== null && e.joursSansActivite <= 7).length;
    const inactifs7j = reportingRows.filter((e) => e.joursSansActivite !== null && e.joursSansActivite > 7).length;
    const actionsToday = reportingRows.reduce(
      (sum, e) =>
        sum +
        e.missionsToday +
        (e.sdgnClaimsToday || 0) +
        e.objectifToday +
        e.focusToday +
        (e.lastVisit === todayKey ? 1 : 0),
      0
    );
    const sdgnValidationsToday = reportingRows.reduce((sum, e) => sum + (e.sdgnClaimsToday || 0), 0);
    const suspicions = reportingRows.reduce((sum, e) => sum + (e.antiCheatEvents || 0), 0);
    const sessionTodaySec = reportingRows.reduce((sum, e) => sum + (e.sessionTodaySec || 0), 0);
    const participationTotal = reportingRows.reduce((sum, e) => sum + (Number(e.participationPoints) || 0), 0);
    const elevesFocus = reportingRows.filter((e) => (e.focusTotal || 0) > 0).length;
    const focusTodayTotal = reportingRows.reduce((sum, e) => sum + (e.focusToday || 0), 0);
    return {
      total,
      actifsAujourdhui,
      actifs7j,
      inactifs7j,
      actionsToday,
      sdgnValidationsToday,
      suspicions,
      sessionTodaySec,
      participationTotal,
      elevesFocus,
      focusTodayTotal,
    };
  }, [reportingRows, todayKey]);

  const dsCopiesRows = useMemo(() => {
    return usersAll
      .filter((user) => {
        const okClasse = filtreClasse === "toutes" || user.classe === filtreClasse;
        const okLycee = filtreLycee === "tous" || user.lycee === filtreLycee;
        const haystack = `${user.prenom || ""} ${user.nom || ""} ${user.email || ""}`.toLowerCase();
        const okRecherche = !rechercheEleve.trim() || haystack.includes(rechercheEleve.toLowerCase());
        return okClasse && okLycee && okRecherche;
      })
      .map((eleve) => {
        const exam = eleve.objectifBacDs?.[DS_EXAM_ID];
        if (!exam) return null;
        const submissions = exam.submissions || {};
        const answersCount = Object.values(submissions).reduce((sum, item) => {
          if (item?.answer) return sum + 1;
          const questionMap = item?.questions || {};
          return sum + Object.values(questionMap).filter((q) => q?.answer).length;
        }, 0);
        return {
          ...eleve,
          nomAffiche: eleve.prenom || eleve.nom || eleve.email || `Élève ${eleve.id.slice(0, 6)}`,
          dsExam: exam,
          answersCount,
        };
      })
      .filter(Boolean)
      .sort((a, b) => (a.nomAffiche || "").localeCompare(b.nomAffiche || "", "fr"));
  }, [usersAll, filtreClasse, filtreLycee, rechercheEleve]);

  const exportAllDsCopiesPdf = async () => {
    if (!dsCopiesRows.length) {
      alert("Aucune copie DS trouvée avec les filtres actuels.");
      return;
    }
    const { jsPDF } = await import("jspdf");
    const docPdf = new jsPDF({ unit: "pt", format: "a4" });
    const page = { left: 40, right: 555, top: 42, bottom: 800 };
    const contentWidth = page.right - page.left;
    let y = page.top;
    let pageNumber = 1;

    const drawFooter = () => {
      docPdf.setFont("helvetica", "normal");
      docPdf.setFontSize(9);
      docPdf.setTextColor(100, 116, 139);
      docPdf.text(`Page ${pageNumber}`, page.right, 825, { align: "right" });
      docPdf.setTextColor(15, 23, 42);
    };

    const newPage = () => {
      drawFooter();
      docPdf.addPage();
      pageNumber += 1;
      y = page.top;
    };

    const ensureSpace = (neededHeight = 20) => {
      if (y + neededHeight > page.bottom) {
        newPage();
      }
    };

    const writeText = (text, opts = {}) => {
      const {
        size = 10.5,
        bold = false,
        color = [15, 23, 42],
        lineHeight = 14,
        indent = 0,
      } = opts;
      docPdf.setFont("helvetica", bold ? "bold" : "normal");
      docPdf.setFontSize(size);
      docPdf.setTextColor(color[0], color[1], color[2]);
      const width = contentWidth - indent;
      const lines = docPdf.splitTextToSize(String(text || ""), width);
      ensureSpace(lines.length * lineHeight + 2);
      docPdf.text(lines, page.left + indent, y);
      y += lines.length * lineHeight;
      docPdf.setTextColor(15, 23, 42);
    };

    const writeSectionTitle = (title, tone = "default") => {
      const palette = tone === "danger"
        ? { fill: [254, 226, 226], border: [248, 113, 113], text: [153, 27, 27] }
        : tone === "info"
          ? { fill: [219, 234, 254], border: [96, 165, 250], text: [30, 64, 175] }
          : { fill: [241, 245, 249], border: [148, 163, 184], text: [30, 41, 59] };

      ensureSpace(28);
      docPdf.setFillColor(palette.fill[0], palette.fill[1], palette.fill[2]);
      docPdf.setDrawColor(palette.border[0], palette.border[1], palette.border[2]);
      docPdf.roundedRect(page.left, y, contentWidth, 22, 4, 4, "FD");
      docPdf.setFont("helvetica", "bold");
      docPdf.setFontSize(11);
      docPdf.setTextColor(palette.text[0], palette.text[1], palette.text[2]);
      docPdf.text(String(title), page.left + 8, y + 15);
      docPdf.setTextColor(15, 23, 42);
      y += 28;
    };

    writeText("STMG HUB - Export global copies DS", { size: 16, bold: true, lineHeight: 18 });
    writeText(`Sujet : ${DS_LOCK_TYPE}`, { size: 11, bold: true });
    writeText(`Date export : ${new Date().toLocaleString("fr-FR")} | Élèves exportés : ${dsCopiesRows.length}`, { size: 10 });
    y += 6;

    dsCopiesRows.forEach((row, idx) => {
      if (idx > 0) newPage();
      const submissions = row.dsExam?.submissions || {};
      const submissionEntries = Object.entries(submissions).sort(([a], [b]) => a.localeCompare(b, "fr"));
      const isDisqualified = Boolean(row.dsExam?.forcedZero);
      const antiCheatLabel = isDisqualified ? "DISQUALIFIÉ (sortie de page => 0)" : "Conforme";

      writeSectionTitle(`Copie ${idx + 1} - ${row.nomAffiche}`, isDisqualified ? "danger" : "info");
      writeText(`Classe : ${row.classe || "-"} | Lycée : ${row.lycee || "-"}`, { size: 10 });
      writeText(`Email : ${row.email || "non renseigné"}`, { size: 10 });
      writeText(`Statut anti-triche : ${antiCheatLabel}`, { size: 10.5, bold: true, color: isDisqualified ? [153, 27, 27] : [22, 101, 52] });
      writeText(`Exercices rendus : ${submissionEntries.length}/${DS_EXERCISES.length}`, { size: 10, bold: true });
      y += 6;

      if (!submissionEntries.length) {
        writeText("Aucune réponse enregistrée pour cet élève.", { size: 10.5, color: [71, 85, 105] });
        return;
      }

      submissionEntries.forEach(([exerciseId, submission], sIdx) => {
        const refExercise = DS_EXERCISE_BY_ID[exerciseId];
        const exerciceBareme = (refExercise?.questions || []).reduce((sum, question) => sum + (Number(question.points) || 0), 0);
        writeSectionTitle(
          `Exercice ${sIdx + 1} - ${submission?.title || refExercise?.title || "Sans titre"} ${exerciceBareme ? `(barème /${exerciceBareme})` : ""}`
        );

        if (submission?.answer) {
          writeText(`Heure de rendu : ${submission?.submittedAt ? new Date(submission.submittedAt).toLocaleString("fr-FR") : "non renseignée"}`, { size: 9.5, color: [71, 85, 105] });
          writeText("Réponse élève :", { size: 10, bold: true });
          writeText(submission?.answer || "(vide)", { size: 10, indent: 10 });
          y += 4;
          return;
        }

        const questionEntries = Object.entries(submission?.questions || {});
        if (!questionEntries.length) {
          writeText("Aucune réponse enregistrée pour cet exercice.", { size: 10.5, color: [71, 85, 105] });
          y += 4;
          return;
        }

        questionEntries.forEach(([qId, qData], qIdx) => {
          const refQuestion = refExercise?.questions?.find((question) => question.id === qId);
          const points = Number(refQuestion?.points) || 0;
          writeText(`Q${qIdx + 1} ${points ? `- Barème /${points}` : ""}`, { size: 10.5, bold: true, color: [30, 64, 175] });
          writeText(`Énoncé : ${qData?.prompt || refQuestion?.prompt || "non renseigné"}`, { size: 9.8, color: [30, 41, 59], indent: 8 });
          writeText(`Réponse élève : ${qData?.answer || "(vide)"}`, { size: 10, indent: 8 });
          writeText(`Correction attendue : ${refQuestion?.expected || "Correction non renseignée."}`, { size: 9.8, indent: 8, color: [71, 85, 105] });
          writeText(`Validation : ${qData?.validatedAt ? new Date(qData.validatedAt).toLocaleString("fr-FR") : "non renseignée"}`, { size: 9.2, indent: 8, color: [100, 116, 139] });
          y += 4;
        });
      });
    });

    drawFooter();
    docPdf.save(`copies-ds-${DS_EXAM_ID}.pdf`);
  };

  const resetDsLocksForFilteredStudents = async () => {
    const targets = usersAll.filter((user) => {
      const okClasse = filtreClasse === "toutes" || user.classe === filtreClasse;
      const okLycee = filtreLycee === "tous" || user.lycee === filtreLycee;
      const haystack = `${user.prenom || ""} ${user.nom || ""} ${user.email || ""}`.toLowerCase();
      const okRecherche = !rechercheEleve.trim() || haystack.includes(rechercheEleve.toLowerCase());
      return okClasse && okLycee && okRecherche;
    });
    if (!targets.length) {
      alert("Aucun élève ciblé avec les filtres actuels.");
      return;
    }
    if (!window.confirm(`Réinitialiser le DS (blocages + copies) pour ${targets.length} élève(s) ?`)) return;

    setResetDsLoading(true);
    try {
      await Promise.all(
        targets.map((user) =>
          updateDoc(doc(db, "users", user.id), {
            [`objectifBacDs.${DS_EXAM_ID}`]: deleteField(),
          })
        )
      );
      await chargerEleves();
      alert(`DS réinitialisé pour ${targets.length} élève(s).`);
    } catch (err) {
      console.error("Reset DS global impossible", err);
      alert("Erreur lors du reset DS global.");
    } finally {
      setResetDsLoading(false);
    }
  };

  const elevesSuspects = useMemo(
    () => [...reportingRows].filter((e) => (e.antiCheatEvents || 0) > 0).sort((a, b) => (b.antiCheatEvents || 0) - (a.antiCheatEvents || 0)).slice(0, 8),
    [reportingRows]
  );

  const importerChapitres = async () => {
    if (!fichierChapitres) return;
    setImportChapitres({ loading: true, succes: 0, erreurs: 0, message: "⏳ Import en cours..." });
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet);
        let succes = 0, erreurs = 0;
        for (const row of rows) {
          try {
            const id = col(row, "ID", "id") ||
              `${col(row, "Matière", "matiere")}-${col(row, "Classe", "classe")}-chap${col(row, "Ordre", "ordre")}`.toLowerCase().replace(/\s/g, "-");
            const notionsRaw = col(row, "Notions (séparées par |)", "notions");
            const competencesRaw = col(row, "Compétences (séparées par |)", "competences");
            await setDoc(doc(db, "chapitres", id), {
              matiere: col(row, "Matière", "matiere"),
              classe: col(row, "Classe", "classe"),
              ordre: parseInt(col(row, "Ordre", "ordre")) || 0,
              theme: col(row, "Thème", "theme"),
              titre: col(row, "Titre du chapitre", "titre"),
              question: col(row, "Question de gestion", "question"),
              notions: notionsRaw ? String(notionsRaw).split("|").map(n => n.trim()).filter(Boolean) : [],
              competences: competencesRaw ? String(competencesRaw).split("|").map(c => c.trim()).filter(Boolean) : [],
              url_app: col(row, "URL Application", "url_app"),
              url_fiche: col(row, "URL Fiche de révision", "url_fiche"),
              xp: parseInt(col(row, "XP", "xp")) || 50,
            });
            succes++;
          } catch (err) { erreurs++; }
        }
        setImportChapitres({ loading: false, succes, erreurs, message: `✅ ${succes} chapitres importés !` });
      } catch {
        setImportChapitres({ loading: false, succes: 0, erreurs: 1, message: "❌ Erreur de lecture du fichier" });
      }
    };
    reader.readAsArrayBuffer(fichierChapitres);
  };

  // ✅ IMPORT MISSIONS — lit aussi la colonne "correction"
  const importerMissions = async () => {
    if (!fichierMissions) return;
    setImportMissions({ loading: true, succes: 0, erreurs: 0, message: "⏳ Import en cours..." });
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet);
        let succes = 0, erreurs = 0;
        for (const row of rows) {
          try {
            const id = String(col(row, "id", "ID", "Id")).trim();
            const type = String(col(row, "type", "Type")).trim().toLowerCase();
            const niveau = String(col(row, "niveau", "Niveau", "classe", "Classe") || (type === "mensuelle" || type === "hebdomadaire" ? "terminale" : "premiere")).trim().toLowerCase();
            const difficulte = Math.max(1, Math.min(5, parseInt(col(row, "difficulte", "Difficulté", "difficulty")) || 1));
            const titre = String(col(row, "titre", "Titre", "titre mission", "Titre mission")).trim();
            if (!id || !titre) { erreurs++; continue; }
            const matiere = String(col(row, "matiere", "Matière", "Matiere")).trim();
            const correction = String(col(row, "correction", "Correction", "correction_reference", "Correction référence", "Correction de référence")).trim();
            const theme = String(col(row, "theme", "Theme", "thème", "Thème")).trim();
            const chapitre = String(col(row, "chapitre", "Chapitre")).trim();
            const ordre = parseInt(col(row, "ordre", "Ordre")) || 0;
            const motsClesRaw = col(row, "mots_cles", "mots-clés", "Mots-clés", "mots cles", "Mots clés");
            await setDoc(doc(db, "missions", id), {
              id, type, niveau, difficulte, matiere,
              emoji: EMOJI_PAR_MATIERE[matiere] || "🎯",
              theme,
              chapitre,
              ordre,
              titre,
              contexte: String(col(row, "contexte", "Contexte")).trim(),
              question: String(col(row, "question", "Question")).trim(),
              mots_cles: splitMotsCles(motsClesRaw),
              correction,
              xp: parseInt(col(row, "xp", "XP")) || 25,
            });
            succes++;
          } catch { erreurs++; }
        }
        setImportMissions({ loading: false, succes, erreurs, message: `✅ ${succes} missions importées !` });
      } catch {
        setImportMissions({ loading: false, succes: 0, erreurs: 1, message: "❌ Erreur de lecture du fichier" });
      }
    };
    reader.readAsArrayBuffer(fichierMissions);
  };

  const resetMissions = async () => {
    if (!window.confirm("Supprimer toutes les missions existantes ?")) return;
    const snapshot = await getDocs(collection(db, "missions"));
    for (const d of snapshot.docs) await deleteDoc(doc(db, "missions", d.id));
    alert("✅ Toutes les missions supprimées !");
  };

  const Btn = ({ children, onClick, color, disabled = false, small = false }) => (
    <button onClick={onClick} disabled={disabled} style={{
      background: disabled ? "#E5E7EB" : color,
      color: disabled ? "#9CA3AF" : "white",
      border: "none", fontFamily: "'Fredoka One', cursive",
      fontSize: small ? "0.85rem" : "1rem",
      padding: small ? "8px 16px" : "12px 24px",
      borderRadius: "14px", cursor: disabled ? "not-allowed" : "pointer",
      boxShadow: disabled ? "none" : `0 4px 15px ${color}40`,
      whiteSpace: "nowrap",
    }}>{children}</button>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#F1F5F9", fontFamily: "'Nunito', sans-serif", padding: "24px 16px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ background: "linear-gradient(135deg, #1E293B, #0F172A)", borderRadius: "24px", padding: "26px 30px", marginBottom: "18px" }}>
          <h1 style={{ fontFamily: "'Fredoka One', cursive", fontSize: "2rem", color: "white", margin: "0 0 4px" }}>⚙️ Administration STMG HUB</h1>
          <p style={{ color: "#93C5FD", margin: 0, fontSize: "0.92rem" }}>Reporting pédagogique, pilotage des récompenses et maintenance des contenus.</p>
        </div>

        <div style={{ background: "white", borderRadius: 16, border: "1px solid #E2E8F0", padding: 8, display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
          {ONGLET_ADMIN.map((onglet) => (
            <button
              key={onglet.id}
              onClick={() => setOngletActif(onglet.id)}
              style={{
                border: "none",
                borderRadius: 999,
                padding: "8px 14px",
                cursor: "pointer",
                fontFamily: "'Fredoka One', cursive",
                fontSize: "0.84rem",
                background: ongletActif === onglet.id ? COLORS.S : "#E2E8F0",
                color: ongletActif === onglet.id ? "white" : "#334155",
              }}
            >
              {onglet.label}
            </button>
          ))}
          <Btn onClick={chargerEleves} color={COLORS.G} small disabled={chargementEleves}>
            {chargementEleves ? "⏳ Chargement..." : "🔄 Actualiser"}
          </Btn>
        </div>

        {erreurEleves && (
          <div style={{ marginBottom: 16, background: COLORS.H + "12", border: `1px solid ${COLORS.H}30`, borderRadius: "12px", padding: "10px 14px" }}>
            <p style={{ margin: 0, color: COLORS.H, fontFamily: "'Fredoka One', cursive", fontSize: "0.85rem" }}>{erreurEleves}</p>
          </div>
        )}

        {ongletActif === "reporting" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 10, marginBottom: 14 }}>
              <div style={{ background: "white", borderRadius: 14, padding: 14, border: "1px solid #DBEAFE" }}>
                <p style={{ margin: 0, color: "#1D4ED8", fontFamily: "'Fredoka One', cursive", fontSize: "0.85rem" }}>Élèves suivis</p>
                <p style={{ margin: "4px 0 0", fontSize: "1.7rem", fontWeight: 900, color: "#0F172A" }}>{dashboardStats.total}</p>
              </div>
              <div style={{ background: "white", borderRadius: 14, padding: 14, border: "1px solid #A7F3D0" }}>
                <p style={{ margin: 0, color: "#059669", fontFamily: "'Fredoka One', cursive", fontSize: "0.85rem" }}>Actifs aujourd’hui</p>
                <p style={{ margin: "4px 0 0", fontSize: "1.7rem", fontWeight: 900, color: "#0F172A" }}>{dashboardStats.actifsAujourdhui}</p>
              </div>
              <div style={{ background: "white", borderRadius: 14, padding: 14, border: "1px solid #BFDBFE" }}>
                <p style={{ margin: 0, color: "#0284C7", fontFamily: "'Fredoka One', cursive", fontSize: "0.85rem" }}>Actifs 7 derniers jours</p>
                <p style={{ margin: "4px 0 0", fontSize: "1.7rem", fontWeight: 900, color: "#0F172A" }}>{dashboardStats.actifs7j}</p>
              </div>
              <div style={{ background: "white", borderRadius: 14, padding: 14, border: "1px solid #FECACA" }}>
                <p style={{ margin: 0, color: "#DC2626", fontFamily: "'Fredoka One', cursive", fontSize: "0.85rem" }}>Inactifs (+7j)</p>
                <p style={{ margin: "4px 0 0", fontSize: "1.7rem", fontWeight: 900, color: "#0F172A" }}>{dashboardStats.inactifs7j}</p>
              </div>
              <div style={{ background: "white", borderRadius: 14, padding: 14, border: "1px solid #FDE68A" }}>
                <p style={{ margin: 0, color: "#D97706", fontFamily: "'Fredoka One', cursive", fontSize: "0.85rem" }}>Actions détectées aujourd’hui</p>
                <p style={{ margin: "4px 0 0", fontSize: "1.7rem", fontWeight: 900, color: "#0F172A" }}>{dashboardStats.actionsToday}</p>
              </div>
              <div style={{ background: "white", borderRadius: 14, padding: 14, border: "1px solid #FCA5A5" }}>
                <p style={{ margin: 0, color: "#BE123C", fontFamily: "'Fredoka One', cursive", fontSize: "0.85rem" }}>Signaux anti-triche (historique)</p>
                <p style={{ margin: "4px 0 0", fontSize: "1.7rem", fontWeight: 900, color: "#0F172A" }}>{dashboardStats.suspicions}</p>
              </div>
              <div style={{ background: "white", borderRadius: 14, padding: 14, border: "1px solid #DDD6FE" }}>
                <p style={{ margin: 0, color: "#6D28D9", fontFamily: "'Fredoka One', cursive", fontSize: "0.85rem" }}>Validations SDGN (jour)</p>
                <p style={{ margin: "4px 0 0", fontSize: "1.7rem", fontWeight: 900, color: "#0F172A" }}>{dashboardStats.sdgnValidationsToday}</p>
                <p style={{ margin: "2px 0 0", color: "#5B21B6", fontSize: "0.75rem", fontWeight: 700 }}>exercices corrigés aujourd’hui (tous élèves)</p>
              </div>
              <div style={{ background: "white", borderRadius: 14, padding: 14, border: "1px solid #BAE6FD" }}>
                <p style={{ margin: 0, color: "#0369A1", fontFamily: "'Fredoka One', cursive", fontSize: "0.85rem" }}>Temps connecté aujourd’hui</p>
                <p style={{ margin: "4px 0 0", fontSize: "1.7rem", fontWeight: 900, color: "#0F172A" }}>{formatDuration(dashboardStats.sessionTodaySec)}</p>
              </div>
              <div style={{ background: "white", borderRadius: 14, padding: 14, border: "1px solid #FDE68A" }}>
                <p style={{ margin: 0, color: "#B45309", fontFamily: "'Fredoka One', cursive", fontSize: "0.85rem" }}>Points participation (cartes rares)</p>
                <p style={{ margin: "4px 0 0", fontSize: "1.7rem", fontWeight: 900, color: "#0F172A" }}>
                  {Number(dashboardStats.participationTotal || 0).toFixed(1)} pts
                </p>
              </div>
              <div style={{ background: "white", borderRadius: 14, padding: 14, border: "1px solid #BBF7D0" }}>
                <p style={{ margin: 0, color: "#15803D", fontFamily: "'Fredoka One', cursive", fontSize: "0.85rem" }}>Élèves ayant fait Focus</p>
                <p style={{ margin: "4px 0 0", fontSize: "1.7rem", fontWeight: 900, color: "#0F172A" }}>
                  {dashboardStats.elevesFocus}
                </p>
                <p style={{ margin: "2px 0 0", color: "#166534", fontSize: "0.75rem", fontWeight: 700 }}>
                  {dashboardStats.focusTodayTotal} activité(s) Focus aujourd’hui
                </p>
              </div>
            </div>

            <div style={{ background: "white", borderRadius: "20px", padding: "18px", marginBottom: "14px", border: "1px solid #E2E8F0" }}>
              <div style={{ marginBottom: 12, background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 12, padding: "10px 12px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <div>
                  <p style={{ margin: 0, color: "#1E3A8A", fontFamily: "'Fredoka One', cursive", fontSize: "0.88rem" }}>📝 Copies DS disponibles</p>
                  <p style={{ margin: "2px 0 0", color: "#1E40AF", fontSize: "0.8rem" }}>
                    {dsCopiesRows.length} élève(s) avec copie enregistrée pour « {DS_LOCK_TYPE} ».
                  </p>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <Btn onClick={exportAllDsCopiesPdf} color={COLORS.S} small disabled={!dsCopiesRows.length}>
                    📄 Exporter toutes les copies DS (PDF)
                  </Btn>
                  <Btn onClick={resetDsLocksForFilteredStudents} color={COLORS.H} small disabled={resetDsLoading}>
                    {resetDsLoading ? "⏳ Reset DS..." : "♻️ Reset DS (élèves filtrés)"}
                  </Btn>
                </div>
              </div>

              {elevesSuspects.length > 0 && (
                <div style={{ marginBottom: 12, background: "#FFF1F2", border: "1px solid #FDA4AF", borderRadius: 12, padding: "10px 12px" }}>
                  <p style={{ margin: "0 0 6px", color: "#9F1239", fontFamily: "'Fredoka One', cursive", fontSize: "0.85rem" }}>🚨 Élèves à surveiller (missions)</p>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {elevesSuspects.map((e) => (
                      <span key={`suspect-${e.id}`} style={{ background: "#BE123C", color: "white", borderRadius: 999, padding: "4px 9px", fontSize: "0.75rem", fontWeight: 700 }}>
                        {e.nomAffiche} ? {e.antiCheatEvents} signalement(s)
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {flashReporting ? (
                <div
                  style={{
                    marginBottom: 12,
                    padding: "10px 14px",
                    borderRadius: 12,
                    background: flashReporting.startsWith("Erreur") ? "#FEE2E2" : "#DCFCE7",
                    border: `1px solid ${flashReporting.startsWith("Erreur") ? "#FECACA" : "#86EFAC"}`,
                    color: flashReporting.startsWith("Erreur") ? "#991B1B" : "#166534",
                    fontSize: "0.88rem",
                    fontWeight: 700,
                  }}
                >
                  {flashReporting}
                </div>
              ) : null}

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
                <input
                  value={rechercheEleve}
                  onChange={(e) => setRechercheEleve(e.target.value)}
                  placeholder="Recherche prénom ou email..."
                  style={{ minWidth: 220, flex: 1, padding: "9px 12px", borderRadius: 10, border: "1px solid #CBD5E1", fontSize: "0.9rem" }}
                />
                <select value={filtreClasse} onChange={(e) => setFiltreClasse(e.target.value)} style={{ padding: "9px 10px", borderRadius: 10, border: "1px solid #CBD5E1", fontSize: "0.88rem" }}>
                  <option value="toutes">Toutes les classes</option>
                  {classesDispo.map(c => <option key={c} value={c}>{c === "premiere" ? "Première STMG" : c === "terminale" ? "Terminale STMG" : c}</option>)}
                </select>
                <select value={filtreLycee} onChange={(e) => setFiltreLycee(e.target.value)} style={{ padding: "9px 10px", borderRadius: 10, border: "1px solid #CBD5E1", fontSize: "0.88rem", maxWidth: 260 }}>
                  <option value="tous">Tous les lycées</option>
                  {lyceesDispo.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
                <select value={filtreActivite} onChange={(e) => setFiltreActivite(e.target.value)} style={{ padding: "9px 10px", borderRadius: 10, border: "1px solid #CBD5E1", fontSize: "0.88rem" }}>
                  <option value="tous">Toutes activités</option>
                  <option value="aujourdhui">Actifs aujourd’hui</option>
                  <option value="7jours">Actifs 7 jours</option>
                  <option value="inactifs">Inactifs +7 jours</option>
                  <option value="focus">Ont fait Focus</option>
                  <option value="pas_focus">N’ont pas fait Focus</option>
                  <option value="sdgn">Au moins une mission SDGN</option>
                </select>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {reportingFiltres.map((eleve) => (
                  <div
                    key={eleve.id}
                    style={{
                      border: "1px solid #E2E8F0",
                      borderRadius: 16,
                      overflow: "hidden",
                      background: "#FAFBFC",
                      boxShadow: "0 1px 2px rgba(15,23,42,0.04)",
                    }}
                  >
                    <div
                      style={{
                        padding: "14px 16px",
                        background: "linear-gradient(90deg,#FFFFFF,#F1F5F9)",
                        borderBottom: "1px solid #E2E8F0",
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 12,
                        flexWrap: "wrap",
                        alignItems: "flex-start",
                      }}
                    >
                      <div style={{ flex: "1 1 220px", minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                          <p style={{ margin: 0, fontFamily: "'Fredoka One', cursive", color: "#0F172A", fontSize: "1.02rem" }}>{eleve.nomAffiche}</p>
                          {(eleve.sdgnExerciseCount || 0) > 0 ? (
                            <span
                              style={{
                                borderRadius: 999,
                                padding: "3px 10px",
                                fontSize: "0.72rem",
                                fontWeight: 800,
                                background: "#EDE9FE",
                                color: "#5B21B6",
                                border: "1px solid #C4B5FD",
                              }}
                            >
                              SDGN {eleve.sdgnExerciseCount} exo.
                            </span>
                          ) : null}
                          {eleve.platformIntegrity?.xpSuspended ? (
                            <span
                              title="Suspension jetons après changement d'onglet — bouton « Rétablir » ci-dessous"
                              style={{
                                borderRadius: 999,
                                padding: "3px 10px",
                                fontSize: "0.72rem",
                                fontWeight: 800,
                                background: "#FEE2E2",
                                color: "#991B1B",
                                border: "1px solid #FECACA",
                              }}
                            >
                              Jetons suspendus (onglet)
                            </span>
                          ) : null}
                        </div>
                        <p style={{ margin: "6px 0 0", color: "#64748B", fontSize: "0.82rem" }}>
                          {eleve.classe || "-"} ? {eleve.lycee || "-"} ? {eleve.email || "email non renseigné"}
                        </p>
                        <p style={{ margin: "4px 0 0", color: eleve.joursSansActivite !== null && eleve.joursSansActivite > 7 ? "#DC2626" : "#16A34A", fontSize: "0.78rem", fontWeight: 700 }}>
                          {eleve.joursSansActivite === null
                            ? "Aucune activité datée"
                            : eleve.joursSansActivite === 0
                              ? "Actif aujourd'hui"
                              : `${eleve.joursSansActivite} jour(s) sans activité`}
                          {" ? "}
                          Dernière activité : <strong>{formatDateFr(eleve.lastActivity)}</strong>
                        </p>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, flex: "0 0 auto" }}>
                        <div style={{ textAlign: "right" }}>
                          <p style={{ margin: 0, color: "#64748B", fontSize: "0.72rem", fontWeight: 700 }}>Solde jetons</p>
                          <p style={{ margin: "2px 0 0", color: "#1D4ED8", fontWeight: 900, fontSize: "1.15rem" }}>{formatJetons(eleve.xp || 0)}</p>
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "flex-end", alignItems: "center" }}>
                          <input
                            type="number"
                            min={0}
                            placeholder="Montant"
                            value={quickJetons[eleve.id] ?? ""}
                            onChange={(e) => setQuickJetons((prev) => ({ ...prev, [eleve.id]: e.target.value }))}
                            style={{
                              width: 88,
                              padding: "6px 8px",
                              borderRadius: 10,
                              border: "1px solid #CBD5E1",
                              fontSize: "0.88rem",
                              textAlign: "center",
                            }}
                          />
                          <Btn
                            onClick={() => {
                              const amt = parseInt(String(quickJetons[eleve.id] ?? "").trim(), 10) || 0;
                              if (!amt) return;
                              void distribuerXPIndividuel(eleve.id, amt, eleve.prenom || eleve.nomAffiche);
                            }}
                            color={COLORS.G}
                            small
                            disabled={recompenseEnCours}
                          >
                            + Ajouter
                          </Btn>
                          <Btn
                            onClick={() => {
                              const amt = parseInt(String(quickJetons[eleve.id] ?? "").trim(), 10) || 0;
                              if (!amt) return;
                              void retirerXPIndividuel(eleve.id, amt, eleve.prenom || eleve.nomAffiche);
                            }}
                            color={COLORS.H}
                            small
                            disabled={recompenseEnCours}
                          >
                            − Retirer
                          </Btn>
                        </div>
                      </div>
                    </div>

                    <div style={{ padding: "10px 16px 12px", display: "flex", gap: 8, flexWrap: "wrap", background: "#FFFFFF", borderBottom: "1px solid #F1F5F9" }}>
                      {eleve.actionsToday.map((action, ai) => (
                        <span
                          key={`${eleve.id}-a-${ai}`}
                          style={{
                            background: action === "Aucune action détectée" ? "#F1F5F9" : "#DBEAFE",
                            color: action === "Aucune action détectée" ? "#64748B" : "#1D4ED8",
                            borderRadius: 999,
                            padding: "4px 10px",
                            fontSize: "0.76rem",
                            fontWeight: 700,
                          }}
                        >
                          {action}
                        </span>
                      ))}
                    </div>

                    <div style={{ padding: "14px 16px 16px", display: "flex", flexDirection: "column", gap: 12 }}>
                      <div style={{ background: "#FFFFFF", borderRadius: 12, padding: 12, border: "1px solid #E2E8F0" }}>
                        <p style={{ margin: "0 0 8px", fontFamily: "'Fredoka One', cursive", fontSize: "0.82rem", color: "#0369A1" }}>Temps de connexion</p>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(155px, 1fr))", gap: 8 }}>
                          <p style={{ margin: 0, color: "#334155", fontSize: "0.8rem" }}>
                            Aujourd'hui : <strong>{formatDuration(eleve.sessionTodaySec)}</strong>
                          </p>
                          <p style={{ margin: 0, color: "#334155", fontSize: "0.8rem" }}>
                            Cumulé : <strong>{formatDuration(eleve.sessionTotalSec)}</strong> ({eleve.sessionCount || 0} session(s))
                          </p>
                          <p style={{ margin: 0, color: "#334155", fontSize: "0.8rem" }}>
                            Dernière session : <strong>{formatDuration(eleve.lastSessionDurationSec)}</strong>
                          </p>
                        </div>
                      </div>

                      <div style={{ background: "#FFFFFF", borderRadius: 12, padding: 12, border: "1px solid #DDD6FE" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                          <div>
                            <p style={{ margin: 0, fontFamily: "'Fredoka One', cursive", fontSize: "0.82rem", color: "#5B21B6" }}>Missions SDGN (page Missions)</p>
                            <p style={{ margin: "4px 0 0", color: "#64748B", fontSize: "0.78rem" }}>
                              Champ{" "}
                              <span style={{ fontFamily: "ui-monospace, monospace", fontSize: "0.72rem", color: "#475569" }}>missionsProgress</span>
                              {" ? "}Dernière rubrique enregistrée : <strong>{eleve.missionsProgressChapter || "—"}</strong>
                            </p>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <p style={{ margin: 0, fontSize: "0.8rem", color: "#334155" }}>
                              <strong>{eleve.sdgnExerciseCount || 0}</strong> exercice(s) ? <strong>{eleve.sdgnTotalAttempts || 0}</strong> tentative(s)
                            </p>
                            <p style={{ margin: "4px 0 0", fontSize: "0.78rem", color: "#6D28D9", fontWeight: 700 }}>
                              Somme des derniers jetons par exo. : {formatJetons(eleve.sdgnLastXpSum || 0)}
                            </p>
                            <p style={{ margin: "2px 0 0", fontSize: "0.72rem", color: "#64748B" }}>
                              Validations aujourd'hui : {eleve.sdgnClaimsToday || 0}
                            </p>
                          </div>
                        </div>
                        {eleve.sdgnRows?.length ? (
                          <>
                            <button
                              type="button"
                              onClick={() => setSdgnExpanded((prev) => ({ ...prev, [eleve.id]: !prev[eleve.id] }))}
                              style={{
                                marginTop: 10,
                                background: "#F5F3FF",
                                border: "1px solid #C4B5FD",
                                borderRadius: 10,
                                padding: "8px 12px",
                                fontWeight: 800,
                                fontSize: "0.78rem",
                                cursor: "pointer",
                                fontFamily: "'Fredoka One', cursive",
                                color: "#5B21B6",
                              }}
                            >
                              {sdgnExpanded[eleve.id] ? "▲ Masquer le détail par exercice" : `▼ Détail des ${eleve.sdgnRows.length} exercice(s)`}
                            </button>
                            {sdgnExpanded[eleve.id] ? (
                              <div style={{ marginTop: 10, overflowX: "auto", borderRadius: 10, border: "1px solid #EDE9FE" }}>
                                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.76rem" }}>
                                  <thead>
                                    <tr style={{ background: "#F5F3FF", color: "#4C1D95", textAlign: "left" }}>
                                      <th style={{ padding: "8px 10px", fontWeight: 800 }}>Chapitre</th>
                                      <th style={{ padding: "8px 10px", fontWeight: 800 }}>Exercice</th>
                                      <th style={{ padding: "8px 10px", fontWeight: 800 }}>Note</th>
                                      <th style={{ padding: "8px 10px", fontWeight: 800 }}>%</th>
                                      <th style={{ padding: "8px 10px", fontWeight: 800 }}>Jetons</th>
                                      <th style={{ padding: "8px 10px", fontWeight: 800 }}>Tent.</th>
                                      <th style={{ padding: "8px 10px", fontWeight: 800 }}>Dernière fois</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {eleve.sdgnRows.map((row) => (
                                      <tr key={row.exerciseId} style={{ borderTop: "1px solid #EDE9FE", background: "#FFFFFF" }}>
                                        <td style={{ padding: "8px 10px", color: "#475569", verticalAlign: "top", whiteSpace: "nowrap" }}>
                                          {row.chapter.replace(/^SDGN\s+/i, "")}
                                        </td>
                                        <td style={{ padding: "8px 10px", color: "#0F172A", verticalAlign: "top" }}>
                                          <span style={{ fontWeight: 700 }}>{row.title}</span>
                                          <span style={{ display: "block", color: "#94A3B8", fontSize: "0.7rem", marginTop: 2 }}>{row.exerciseId}</span>
                                        </td>
                                        <td style={{ padding: "8px 10px", whiteSpace: "nowrap" }}>
                                          {row.lastScore !== undefined && row.lastScore !== null ? `${row.lastScore}/10` : "—"}
                                        </td>
                                        <td style={{ padding: "8px 10px", whiteSpace: "nowrap" }}>
                                          {row.lastPercent !== undefined && row.lastPercent !== null ? `${row.lastPercent}%` : "—"}
                                        </td>
                                        <td style={{ padding: "8px 10px", whiteSpace: "nowrap", fontWeight: 800 }}>
                                          {formatJetons(row.lastXpAwarded || 0)}
                                          {row.xpMax ? (
                                            <span style={{ color: "#64748B", fontWeight: 600, fontSize: "0.72rem" }}> / {formatJetons(row.xpMax)}</span>
                                          ) : null}
                                        </td>
                                        <td style={{ padding: "8px 10px", whiteSpace: "nowrap" }}>{row.totalClaims || 0}</td>
                                        <td style={{ padding: "8px 10px", whiteSpace: "nowrap", color: "#475569" }}>{row.lastClaimDate || "—"}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            ) : null}
                          </>
                        ) : (
                          <p style={{ margin: "10px 0 0", color: "#94A3B8", fontSize: "0.8rem" }}>Aucune mission SDGN validée pour cet élève.</p>
                        )}
                      </div>

                      <div style={{ background: "#FFFFFF", borderRadius: 12, padding: 12, border: "1px solid #E2E8F0" }}>
                        <p style={{ margin: "0 0 8px", fontFamily: "'Fredoka One', cursive", fontSize: "0.82rem", color: "#0F172A" }}>Autres activités</p>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 8 }}>
                          <p style={{ margin: 0, color: "#334155", fontSize: "0.8rem" }}>
                            Missions (historique) : <strong>{eleve.missionsTotal}</strong> (aujourd'hui {eleve.missionsToday})
                          </p>
                          <p style={{ margin: 0, color: (eleve.antiCheatEvents || 0) > 0 ? "#BE123C" : "#334155", fontSize: "0.8rem", fontWeight: (eleve.antiCheatEvents || 0) > 0 ? 700 : 400 }}>
                            Anti-triche (historique) : <strong>{eleve.antiCheatEvents || 0}</strong> (aujourd'hui {eleve.antiCheatToday || 0})
                          </p>
                          <p style={{ margin: 0, color: "#334155", fontSize: "0.8rem" }}>
                            Objectif Bac : <strong>{eleve.objectifTotal}</strong> (aujourd'hui {eleve.objectifToday})
                          </p>
                          <p style={{ margin: 0, color: "#334155", fontSize: "0.8rem" }}>
                            Cartes : <strong>{eleve.cartesTotal}</strong> ({eleve.cartesUniques} uniques)
                          </p>
                        </div>
                      </div>

                      <div
                        style={{
                          background: "#F8FAFC",
                          borderRadius: 12,
                          padding: 12,
                          border: "1px solid #E2E8F0",
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 10,
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <div>
                          <p style={{ margin: "0 0 4px", fontFamily: "'Fredoka One', cursive", fontSize: "0.82rem", color: "#0F172A" }}>
                            Compte / connexion
                          </p>
                          <p style={{ margin: 0, color: "#64748B", fontSize: "0.78rem" }}>
                            E-mail : <strong>{eleve.email || "non renseigné dans Firestore"}</strong>
                            {" · "}UID : <code style={{ fontSize: "0.72rem" }}>{eleve.id}</code>
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => void envoyerLienResetMdp(eleve)}
                          disabled={resetPwdUserId === eleve.id}
                          style={{
                            background: "linear-gradient(135deg, #2563EB, #1D4ED8)",
                            color: "white",
                            border: "none",
                            borderRadius: 10,
                            padding: "8px 14px",
                            fontWeight: 800,
                            fontSize: "0.82rem",
                            cursor: resetPwdUserId !== eleve.id ? "pointer" : "not-allowed",
                            fontFamily: "'Fredoka One', cursive",
                          }}
                        >
                          {resetPwdUserId === eleve.id ? "Envoi en cours…" : "Envoyer lien mot de passe oublié"}
                        </button>
                      </div>

                      {eleve.platformIntegrity?.xpSuspended ? (
                        <div>
                          <button
                            type="button"
                            onClick={() => void retablirJetonsAntiTriche(eleve.id, eleve.nomAffiche)}
                            style={{
                              background: "linear-gradient(135deg, #059669, #047857)",
                              color: "white",
                              border: "none",
                              borderRadius: 10,
                              padding: "8px 14px",
                              fontWeight: 800,
                              fontSize: "0.82rem",
                              cursor: "pointer",
                              fontFamily: "'Fredoka One', cursive",
                            }}
                          >
                            Rétablir les jetons (annuler anti-onglet)
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                ))}
                {!reportingFiltres.length && (
                  <p style={{ margin: 0, color: "#64748B", fontSize: "0.92rem" }}>Aucun élève ne correspond aux filtres.</p>
                )}
              </div>
            </div>
          </>
        )}

        {ongletActif === "recompenses" && (
          <div style={{ background: "white", borderRadius: "24px", padding: "24px", border: `2px solid ${COLORS.U}20`, boxShadow: `0 4px 20px ${COLORS.U}10` }}>
            <h2 style={{ fontFamily: "'Fredoka One', cursive", fontSize: "1.4rem", color: COLORS.U, marginBottom: "8px" }}>🏆 Récompenses du jour</h2>
            <p style={{ color: "#6B7280", fontSize: "0.9rem", marginBottom: "18px" }}>Distribue des jetons bonus aux meilleurs élèves et familles.</p>

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "16px" }}>
              <div style={{ background: COLORS.U + "15", border: `1px solid ${COLORS.U}30`, borderRadius: "12px", padding: "8px 14px" }}>
                <p style={{ fontFamily: "'Fredoka One', cursive", color: COLORS.U, margin: 0, fontSize: "0.85rem" }}>👥 Élèves inscrits : {eleves.length}</p>
              </div>
              <div style={{ background: COLORS.S + "15", border: `1px solid ${COLORS.S}30`, borderRadius: "12px", padding: "8px 14px" }}>
                <p style={{ fontFamily: "'Fredoka One', cursive", color: COLORS.S, margin: 0, fontSize: "0.85rem" }}>⚡ Jetons total : {formatJetons(eleves.reduce((sum, e) => sum + (e.xp || 0), 0))}</p>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "18px" }}>
              <div style={{ background: "white", border: `1px solid ${COLORS.S}25`, borderRadius: "12px", padding: "10px 12px" }}>
                <p style={{ margin: "0 0 6px", fontFamily: "'Fredoka One', cursive", color: COLORS.S, fontSize: "0.85rem" }}>📚 Par classe</p>
                {statsParClasse.slice(0, 4).map(item => (
                  <p key={item.classe} style={{ margin: "2px 0", color: "#6B7280", fontSize: "0.78rem" }}>
                    {item.classe === "premiere" ? "Première" : item.classe === "terminale" ? "Terminale" : item.classe} ? {item.eleves} élève(s) ? {formatJetons(item.xp)}
                  </p>
                ))}
              </div>
              <div style={{ background: "white", border: `1px solid ${COLORS.T}25`, borderRadius: "12px", padding: "10px 12px" }}>
                <p style={{ margin: "0 0 6px", fontFamily: "'Fredoka One', cursive", color: COLORS.T, fontSize: "0.85rem" }}>🏫 Par lycée</p>
                {statsParLycee.slice(0, 4).map(item => (
                  <p key={item.lycee} style={{ margin: "2px 0", color: "#6B7280", fontSize: "0.78rem" }}>
                    {item.lycee} {item.ville ? `(${item.ville})` : ""} ? {item.eleves} élève(s) ? {formatJetons(item.xp)}
                  </p>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", flexWrap: "wrap", gap: "8px" }}>
                <p style={{ fontFamily: "'Fredoka One', cursive", color: "#1A1A2E", fontSize: "1.05rem", margin: 0 }}>👤 Élèves (jetons + cartes)</p>
                <Btn onClick={distribuerTopIndividuel} color={COLORS.U} disabled={recompenseEnCours} small>🚀 Distribuer Top 5</Btn>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {elevesFiltres.map((eleve, i) => {
                  const recompense = RECOMPENSES_INDIVIDUEL[i];
                  const couleurFamille = familleColors[eleve.famille] || COLORS.S;
                  const cartesTotal = compterCartesTotal(eleve.cartes || {});
                  const cartesUniques = compterCartesUniques(eleve.cartes || {});
                  return (
                    <div key={eleve.id} style={{ background: i < 3 ? COLORS.U + "08" : "#F8FAFC", borderRadius: "14px", padding: "12px 14px", border: i < 3 ? `2px solid ${COLORS.U}30` : "1px solid #E5E7EB", display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                      <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: i < 3 ? "1.4rem" : "0.95rem", width: "36px", textAlign: "center" }}>
                        {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                          <p style={{ fontFamily: "'Fredoka One', cursive", color: "#1A1A2E", fontSize: "0.98rem", margin: 0 }}>{eleve.prenom || eleve.nom || eleve.email || `Élève ${eleve.id.slice(0, 6)}`}</p>
                          <span style={{ background: couleurFamille + "20", color: couleurFamille, fontFamily: "'Fredoka One', cursive", padding: "1px 10px", borderRadius: "100px", fontSize: "0.68rem" }}>{familleEmojis[eleve.famille]} {eleve.famille}</span>
                        </div>
                        <p style={{ color: "#9CA3AF", fontSize: "0.78rem", margin: "2px 0 0" }}>{formatJetons(eleve.xp || 0)} ? 🃏 {cartesTotal} cartes ({cartesUniques} uniques)</p>
                      </div>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <input type="number" value={xpCustom[eleve.id] ?? (recompense?.xp || 0)} onChange={e => setXpCustom(prev => ({ ...prev, [eleve.id]: parseInt(e.target.value) || 0 }))} style={{ width: "80px", padding: "6px 10px", borderRadius: "10px", border: `2px solid ${COLORS.U}30`, fontFamily: "'Fredoka One', cursive", fontSize: "0.9rem", textAlign: "center", outline: "none" }} />
                        <Btn onClick={() => distribuerXPIndividuel(eleve.id, xpCustom[eleve.id] ?? recompense?.xp, eleve.prenom)} color={recompense ? recompense.couleur : COLORS.S} disabled={recompenseEnCours} small>{recompense ? recompense.label : "+jetons"}</Btn>
                        <Btn onClick={() => retirerXPIndividuel(eleve.id, xpCustom[eleve.id] ?? recompense?.xp, eleve.prenom)} color={COLORS.H} disabled={recompenseEnCours} small>Retirer</Btn>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", flexWrap: "wrap", gap: "8px" }}>
                <p style={{ fontFamily: "'Fredoka One', cursive", color: "#1A1A2E", fontSize: "1.05rem", margin: 0 }}>🧬 Classement Familles</p>
                <Btn onClick={distribuerTopFamilles} color={COLORS.T} disabled={recompenseEnCours} small>🚀 Distribuer Top 5 familles</Btn>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {famillesClassement.map((famille, i) => {
                  const recompense = RECOMPENSES_FAMILLE[i];
                  const couleur = familleColors[famille.nom] || COLORS.S;
                  return (
                    <div key={famille.nom} style={{ background: i < 3 ? couleur + "08" : "#F8FAFC", borderRadius: "16px", padding: "12px 14px", border: i < 3 ? `2px solid ${couleur}30` : "1px solid #E5E7EB", display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                      <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: i < 3 ? "1.4rem" : "0.95rem", width: "36px", textAlign: "center" }}>{i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}</div>
                      <span style={{ fontSize: "1.45rem" }}>{familleEmojis[famille.nom]}</span>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontFamily: "'Fredoka One', cursive", color: couleur, fontSize: "0.98rem", margin: 0 }}>{famille.nom}</p>
                        <p style={{ color: "#9CA3AF", fontSize: "0.78rem", margin: "2px 0 0" }}>{famille.membres} membres ? {formatJetons(famille.xp)} total</p>
                      </div>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <span style={{ fontFamily: "'Fredoka One', cursive", color: couleur, fontSize: "0.86rem" }}>{formatJetonsDelta(recompense?.xp || 0)}/membre</span>
                        <Btn onClick={() => distribuerXPFamille(famille.nom, recompense?.xp || 0)} color={couleur} disabled={recompenseEnCours} small>{recompense ? recompense.label : "+jetons"}</Btn>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {messagesRecompense.length > 0 && (
              <div style={{ background: "#F0FDF4", borderRadius: "16px", padding: "16px", border: "1px solid #BBF7D0" }}>
                <p style={{ fontFamily: "'Fredoka One', cursive", color: COLORS.G, marginBottom: "8px" }}>📋 Journal</p>
                {messagesRecompense.map((m, i) => (
                  <p key={i} style={{ color: "#374151", fontSize: "0.85rem", margin: "2px 0" }}>{m}</p>
                ))}
                <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                  <Btn onClick={chargerEleves} color={COLORS.G} small>🔄 Actualiser</Btn>
                  <Btn onClick={() => setMessagesRecompense([])} color={COLORS.H} small>🗑️ Effacer</Btn>
                </div>
              </div>
            )}
          </div>
        )}

        {ongletActif === "imports" && (
          <>
            <div style={{ background: "white", borderRadius: "24px", padding: "24px", marginBottom: "16px", border: `2px solid ${COLORS.S}20` }}>
              <h2 style={{ fontFamily: "'Fredoka One', cursive", fontSize: "1.35rem", color: COLORS.S, marginBottom: "8px" }}>📚 Importer les chapitres</h2>
              <p style={{ color: "#9CA3AF", fontSize: "0.8rem", marginBottom: "16px" }}>Colonnes : ID, Matière, Classe, Ordre, Thème, Titre, Question, Notions, Compétences, URL app, URL fiche, xp (jetons côté élève).</p>
              <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
                <input type="file" accept=".xlsx" onChange={e => setFichierChapitres(e.target.files[0])} style={{ flex: 1, padding: "10px 14px", borderRadius: "12px", border: `2px solid ${COLORS.S}30`, fontFamily: "'Nunito', sans-serif", fontSize: "0.9rem" }} />
                <Btn onClick={importerChapitres} color={COLORS.S} disabled={!fichierChapitres || importChapitres.loading}>{importChapitres.loading ? "⏳ Import..." : "📥 Importer"}</Btn>
              </div>
              {importChapitres.message && (
                <div style={{ marginTop: "12px", padding: "12px", borderRadius: "12px", background: importChapitres.erreurs > 0 ? COLORS.H + "15" : COLORS.G + "15" }}>
                  <p style={{ fontFamily: "'Fredoka One', cursive", color: importChapitres.erreurs > 0 ? COLORS.H : COLORS.G, margin: 0 }}>{importChapitres.message}</p>
                </div>
              )}
            </div>

            <div style={{ background: "white", borderRadius: "24px", padding: "24px", border: `2px solid ${COLORS.T}20` }}>
              <h2 style={{ fontFamily: "'Fredoka One', cursive", fontSize: "1.35rem", color: COLORS.T, marginBottom: "8px" }}>🎯 Importer les missions</h2>
              <p style={{ color: "#9CA3AF", fontSize: "0.8rem", marginBottom: "16px" }}>Colonnes : id, niveau, difficulte, matiere, theme, chapitre, ordre, titre, contexte, question, mots_cles, correction, xp (récompense en jetons).</p>
              <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
                <input type="file" accept=".xlsx" onChange={e => setFichierMissions(e.target.files[0])} style={{ flex: 1, padding: "10px 14px", borderRadius: "12px", border: `2px solid ${COLORS.T}30`, fontFamily: "'Nunito', sans-serif", fontSize: "0.9rem" }} />
                <Btn onClick={importerMissions} color={COLORS.T} disabled={!fichierMissions || importMissions.loading}>{importMissions.loading ? "⏳ Import..." : "📥 Importer"}</Btn>
              </div>
              {importMissions.message && (
                <div style={{ marginTop: "12px", padding: "12px", borderRadius: "12px", background: importMissions.erreurs > 0 ? COLORS.H + "15" : COLORS.G + "15" }}>
                  <p style={{ fontFamily: "'Fredoka One', cursive", color: importMissions.erreurs > 0 ? COLORS.H : COLORS.G, margin: 0 }}>{importMissions.message}</p>
                </div>
              )}
              <div style={{ marginTop: "12px" }}>
                <button onClick={resetMissions} style={{ background: "none", border: `1px solid ${COLORS.H}`, color: COLORS.H, fontFamily: "'Fredoka One', cursive", fontSize: "0.85rem", padding: "8px 20px", borderRadius: "12px", cursor: "pointer" }}>🗑️ Supprimer toutes les missions</button>
              </div>
            </div>
          </>
        )}

        {ongletActif === "infos" && (
          <div style={{ background: "white", borderRadius: "24px", padding: "24px", border: `2px solid ${COLORS.G}20` }}>
            <h2 style={{ fontFamily: "'Fredoka One', cursive", fontSize: "1.35rem", color: COLORS.G, marginBottom: "16px" }}>💡 Informations</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {[
                { emoji: "📊", texte: "Reporting élèves : temps de connexion, missions SDGN (notes, %, jetons par exercice), Objectif Bac, Focus, cartes, anti-triche historique, ajustement jetons.", couleur: COLORS.B },
                { emoji: "🏆", texte: "Récompenses : charge le classement puis distribue les jetons bonus en 1 clic.", couleur: COLORS.U },
                { emoji: "📚", texte: "Chapitres : supporte les colonnes françaises avec URL Application et URL Fiche.", couleur: COLORS.S },
                { emoji: "🎯", texte: "Missions : la colonne correction sert de référence à la correction IA.", couleur: COLORS.T },
                { emoji: "🔒", texte: "Cette page reste réservée aux comptes admin.", couleur: COLORS.H },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: "12px", alignItems: "center", padding: "12px 16px", borderRadius: "14px", background: item.couleur + "10", border: `1px solid ${item.couleur}20` }}>
                  <span style={{ fontSize: "1.3rem" }}>{item.emoji}</span>
                  <p style={{ color: "#374151", fontSize: "0.92rem", margin: 0 }}>{item.texte}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}