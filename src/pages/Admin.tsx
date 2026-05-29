// @ts-nocheck
import { useState, useEffect, useMemo } from "react";
import AdminBacRevisionReport from "../components/admin/AdminBacRevisionReport";
import AdminDsSdgnReport from "../components/admin/AdminDsSdgnReport";
import AdminReportingEleves from "../components/admin/AdminReportingEleves";
import { auth, db } from "../services/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { doc, setDoc, collection, getDocs, deleteDoc, updateDoc, deleteField } from "firebase/firestore";
import * as XLSX from "xlsx";
import { DS_EXAM_ID, DS_LOCK_TYPE, DS_EXERCISES } from "../services/devoirSurveilleExamData";
import { COLLECTIONS } from "../services/collectionsData";
import { formatJetons, formatJetonsDelta } from "../lib/jetons";
import { getPrestigeTotal } from "../services/userProfileService";
import { buildStudentMissionInsights } from "../lib/adminMissionInsights";
import { readMissionClaims } from "../lib/missionsProgress";
import { buildDsSdgnStudentRow, formatDsDisplayStatusLabel } from "../lib/adminDsSdgnReport";
import { resetDsSdgnTabExamForUser } from "../services/dsTabExamService";

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
  { id: "recompenses", label: "🏆 Récompenses jetons" },
  { id: "reporting", label: "📊 Reporting élèves" },
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
  const [ongletActif, setOngletActif] = useState("recompenses");
  const [recompensesVoirTous, setRecompensesVoirTous] = useState(false);
  const [filtreActivite, setFiltreActivite] = useState("tous");
  const [rechercheEleve, setRechercheEleve] = useState("");
  const [resetDsLoading, setResetDsLoading] = useState(false);
  const [sdgnExpanded, setSdgnExpanded] = useState({});
  const [resetPwdUserId, setResetPwdUserId] = useState(null);
  const [flashReporting, setFlashReporting] = useState("");
  const [quickJetons, setQuickJetons] = useState({});
  const [triReporting, setTriReporting] = useState("activite");
  const [reportingDetailId, setReportingDetailId] = useState(null);

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
        .sort((a, b) => getPrestigeTotal(b) - getPrestigeTotal(a));
      setEleves(users);
      const famillesMap = {};
      users.forEach(u => {
        if (!u.famille) return;
        if (!famillesMap[u.famille]) famillesMap[u.famille] = { nom: u.famille, prestige: 0, membres: 0 };
        famillesMap[u.famille].prestige += getPrestigeTotal(u);
        famillesMap[u.famille].membres += 1;
      });
      setFamillesClassement(Object.values(famillesMap).sort((a, b) => b.prestige - a.prestige));
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

  /** Classement global (tous élèves) — utilisé pour les récompenses, pas les filtres reporting. */
  const topElevesClassement = eleves.slice(0, 5);
  const topFamillesClassement = famillesClassement.slice(0, 5);

  const statsParClasse = classesDispo.map(cl => {
    const membres = eleves.filter(e => e.classe === cl);
    return {
      classe: cl,
      eleves: membres.length,
      prestige: membres.reduce((sum, e) => sum + getPrestigeTotal(e), 0),
    };
  }).sort((a, b) => b.prestige - a.prestige);

  const statsParLycee = lyceesDispo.map(ly => {
    const membres = eleves.filter(e => e.lycee === ly);
    return {
      lycee: ly,
      ville: membres[0]?.lyceeVille || "",
      eleves: membres.length,
      prestige: membres.reduce((sum, e) => sum + getPrestigeTotal(e), 0),
    };
  }).sort((a, b) => b.prestige - a.prestige);

  const todayKey = toDayKey();
  const reportingRows = useMemo(() => {
    return eleves.map((eleve) => {
      const missionsHistorique = eleve.missionsHistorique || {};
      const missionEntries = Object.values(missionsHistorique);
      const missionsToday = missionEntries.filter((m) => m?.date === todayKey).length;

      const mp = eleve.missionsProgress || {};
      const mpClaims = readMissionClaims(mp);
      const sdgnClaimEntries = Object.entries(mpClaims).filter(([id]) => String(id).startsWith("sdgn"));
      const sdgnClaimsToday = sdgnClaimEntries.filter(([, c]) => c?.lastClaimDate === todayKey).length;
      const sdgnExerciseCount = sdgnClaimEntries.length;
      const sdgnTotalAttempts = sdgnClaimEntries.reduce((sum, [, c]) => sum + (Number(c?.totalClaims) || 0), 0);
      const sdgnLastXpSum = sdgnClaimEntries.reduce((sum, [, c]) => sum + (Number(c?.lastXpAwarded) || 0), 0);
      const missionInsights = buildStudentMissionInsights(mpClaims);
      const sdgnRows = missionInsights.rows
        .filter((r) => r.matiere === "SDGN")
        .map((r) => ({
          exerciseId: r.exerciseId,
          title: r.title,
          chapter: r.chapter,
          lastClaimDate: r.lastClaimDate,
          totalClaims: r.totalClaims,
          lastScore: r.lastScore,
          lastPercent: r.lastPercent,
          lastXpAwarded: r.lastXpAwarded,
          pointsForts: r.pointsForts,
          pointsFaibles: r.pointsFaibles,
        }));
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
      const dsSdgnRow =
        eleve.classe === "premiere" ? buildDsSdgnStudentRow({ ...eleve, nomAffiche: nom }) : null;
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
        missionInsights,
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
        dsSdgnRow,
      };
    });
  }, [eleves, todayKey]);

  const terminaleReportingRows = useMemo(
    () => reportingRows.filter((eleve) => eleve.classe === "terminale"),
    [reportingRows]
  );

  const premiereReportingRows = useMemo(
    () => reportingRows.filter((eleve) => eleve.classe === "premiere"),
    [reportingRows],
  );

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
      if (filtreActivite === "participation") okActivite = (eleve.participationPoints || 0) >= 1;
      if (filtreActivite === "sans_participation") okActivite = (eleve.participationPoints || 0) <= 0;

      return okClasse && okLycee && okRecherche && okActivite;
    }).sort((a, b) => {
      if (triReporting === "nom") {
        return String(a.nomAffiche).localeCompare(String(b.nomAffiche), "fr");
      }
      if (triReporting === "participation" || triReporting === "participation_note") {
        return (b.participationPoints || 0) - (a.participationPoints || 0);
      }
      if (triReporting === "sdgn") {
        return (b.sdgnExerciseCount || 0) - (a.sdgnExerciseCount || 0);
      }
      if (triReporting === "jetons") {
        return (b.xp || 0) - (a.xp || 0);
      }
      const da = a.lastActivity ? a.lastActivity.getTime() : 0;
      const db = b.lastActivity ? b.lastActivity.getTime() : 0;
      return db - da;
    });
  }, [reportingRows, filtreClasse, filtreLycee, filtreActivite, rechercheEleve, triReporting]);

  const maxParticipationReporting = useMemo(() => {
    if (!reportingFiltres.length) return 0;
    return Math.max(...reportingFiltres.map((e) => Number(e.participationPoints) || 0));
  }, [reportingFiltres]);

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
    if (
      !window.confirm(
        `Réinitialiser les DS pour ${targets.length} élève(s) ?\n- Copies Objectif Bac (ancien DS)\n- QCM SDGN Première (dsTab, anti-triche inclus)`,
      )
    ) {
      return;
    }

    setResetDsLoading(true);
    try {
      await Promise.all(
        targets.map(async (user) => {
          await updateDoc(doc(db, "users", user.id), {
            [`objectifBacDs.${DS_EXAM_ID}`]: deleteField(),
          });
          if (user.classe === "premiere") {
            await resetDsSdgnTabExamForUser(user.id);
          }
        }),
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
            <div style={{ marginBottom: 14, background: COLORS.U + "12", border: `1px solid ${COLORS.U}35`, borderRadius: 14, padding: "12px 16px", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
              <p style={{ margin: 0, color: "#92400E", fontSize: "0.88rem", fontWeight: 700 }}>
                🏆 Classement = <strong>prestige</strong> (jetons dépensés en cartes). Récompenses bonus : onglet <strong>Récompenses jetons</strong>.
              </p>
              <button
                type="button"
                onClick={() => setOngletActif("recompenses")}
                style={{ border: "none", borderRadius: 10, padding: "8px 14px", background: COLORS.U, color: "white", fontFamily: "'Fredoka One', cursive", cursor: "pointer", fontSize: "0.82rem" }}
              >
                Aller aux récompenses →
              </button>
            </div>
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
                    {resetDsLoading ? "⏳ Reset DS..." : "♻️ Reset DS filtrés (Bac + QCM SDGN)"}
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
                  <option value="participation">Participation cartes (&ge; 1 pt)</option>
                  <option value="sans_participation">Sans participation (0 pt)</option>
                </select>
              </div>

              <AdminDsSdgnReport premiereRows={premiereReportingRows} onAfterReset={chargerEleves} />

              <AdminBacRevisionReport terminaleRows={terminaleReportingRows} />

              <AdminReportingEleves
                rows={reportingFiltres}
                maxParticipation={maxParticipationReporting}
                triReporting={triReporting}
                onTriChange={setTriReporting}
                detailId={reportingDetailId}
                onToggleDetail={(id) => setReportingDetailId((cur) => (cur === id ? null : id))}
                quickJetons={quickJetons}
                onQuickJetonsChange={(id, val) => setQuickJetons((prev) => ({ ...prev, [id]: val }))}
                sdgnExpanded={sdgnExpanded}
                onToggleSdgn={(id) => setSdgnExpanded((prev) => ({ ...prev, [id]: !prev[id] }))}
                recompenseEnCours={recompenseEnCours}
                resetPwdUserId={resetPwdUserId}
                onAjouterJetons={(eleve) => {
                  const amt = parseInt(String(quickJetons[eleve.id] ?? "").trim(), 10) || 0;
                  if (!amt) return;
                  void distribuerXPIndividuel(eleve.id, amt, eleve.prenom || eleve.nomAffiche);
                }}
                onRetirerJetons={(eleve) => {
                  const amt = parseInt(String(quickJetons[eleve.id] ?? "").trim(), 10) || 0;
                  if (!amt) return;
                  void retirerXPIndividuel(eleve.id, amt, eleve.prenom || eleve.nomAffiche);
                }}
                onResetMdp={(eleve) => void envoyerLienResetMdp(eleve)}
                onRetablirJetons={(eleve) => void retablirJetonsAntiTriche(eleve.id, eleve.nomAffiche)}
                onResetDsSdgn={async (eleve) => {
                  if (!eleve.dsSdgnRow?.hasDsData) return;
                  const hint =
                    eleve.dsSdgnRow.displayStatus === "disqualified"
                      ? " (anti-triche)"
                      : "";
                  if (
                    !window.confirm(
                      `Réinitialiser le QCM SDGN pour ${eleve.nomAffiche} ?${hint} L'élève pourra repasser le DS.`,
                    )
                  ) {
                    return;
                  }
                  try {
                    await resetDsSdgnTabExamForUser(eleve.id);
                    await chargerEleves();
                  } catch (err) {
                    console.error(err);
                    alert("Erreur reset DS SDGN.");
                  }
                }}
                formatDsDisplayStatusLabel={formatDsDisplayStatusLabel}
                formatDateFr={formatDateFr}
                formatDuration={formatDuration}
              />
            </div>
          </>
        )}

        {ongletActif === "recompenses" && (
          <div style={{ background: "white", borderRadius: "24px", padding: "24px", border: `2px solid ${COLORS.U}20`, boxShadow: `0 4px 20px ${COLORS.U}10` }}>
            <h2 style={{ fontFamily: "'Fredoka One', cursive", fontSize: "1.4rem", color: COLORS.U, marginBottom: "8px" }}>🏆 Récompenses du jour</h2>
            <p style={{ color: "#6B7280", fontSize: "0.9rem", marginBottom: "18px" }}>
              Classement par <strong>prestige</strong> (dépenses boutique cartes + bonus sociaux), comme le classement national élèves.
              Les boutons ci-dessous ajoutent des <strong>jetons</strong> bonus, pas du prestige.
            </p>

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "16px" }}>
              <div style={{ background: COLORS.U + "15", border: `1px solid ${COLORS.U}30`, borderRadius: "12px", padding: "8px 14px" }}>
                <p style={{ fontFamily: "'Fredoka One', cursive", color: COLORS.U, margin: 0, fontSize: "0.85rem" }}>👥 Élèves : {eleves.length}</p>
              </div>
              <div style={{ background: COLORS.S + "15", border: `1px solid ${COLORS.S}30`, borderRadius: "12px", padding: "8px 14px" }}>
                <p style={{ fontFamily: "'Fredoka One', cursive", color: COLORS.S, margin: 0, fontSize: "0.85rem" }}>
                  👑 Prestige total classe : {eleves.reduce((sum, e) => sum + getPrestigeTotal(e), 0).toLocaleString("fr-FR")}
                </p>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14, marginBottom: 22 }}>
              <div style={{ background: `linear-gradient(135deg, ${COLORS.U}18, ${COLORS.U}08)`, border: `2px solid ${COLORS.U}35`, borderRadius: 18, padding: 18 }}>
                <p style={{ fontFamily: "'Fredoka One', cursive", color: COLORS.U, margin: "0 0 6px", fontSize: "1.05rem" }}>👤 Top 5 élèves</p>
                <p style={{ color: "#64748B", fontSize: "0.82rem", margin: "0 0 12px" }}>
                  200 · 150 · 100 · 75 · 50 jetons (modifiables ci-dessous)
                </p>
                <Btn onClick={distribuerTopIndividuel} color={COLORS.U} disabled={recompenseEnCours || !topElevesClassement.length}>
                  {recompenseEnCours ? "⏳ Distribution…" : "🚀 Distribuer aux 5 premiers"}
                </Btn>
              </div>
              <div style={{ background: `linear-gradient(135deg, ${COLORS.T}18, ${COLORS.T}08)`, border: `2px solid ${COLORS.T}35`, borderRadius: 18, padding: 18 }}>
                <p style={{ fontFamily: "'Fredoka One', cursive", color: COLORS.T, margin: "0 0 6px", fontSize: "1.05rem" }}>🧬 Top 5 familles</p>
                <p style={{ color: "#64748B", fontSize: "0.82rem", margin: "0 0 12px" }}>
                  150 · 100 · 75 · 50 · 25 jetons par membre de la famille
                </p>
                <Btn onClick={distribuerTopFamilles} color={COLORS.T} disabled={recompenseEnCours || !topFamillesClassement.length}>
                  {recompenseEnCours ? "⏳ Distribution…" : "🚀 Distribuer aux 5 familles"}
                </Btn>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16, marginBottom: 20 }}>
              <div>
                <p style={{ fontFamily: "'Fredoka One', cursive", color: "#1A1A2E", fontSize: "1rem", margin: "0 0 10px" }}>Podium élèves</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {topElevesClassement.map((eleve, i) => {
                    const recompense = RECOMPENSES_INDIVIDUEL[i];
                    const couleurFamille = familleColors[eleve.famille] || COLORS.S;
                    return (
                      <div key={eleve.id} style={{ background: i < 3 ? COLORS.U + "08" : "#F8FAFC", borderRadius: 14, padding: "10px 12px", border: i < 3 ? `2px solid ${COLORS.U}30` : "1px solid #E5E7EB", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <span style={{ width: 32, textAlign: "center", fontSize: i < 3 ? "1.2rem" : "0.9rem" }}>{i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}</span>
                        <div style={{ flex: 1, minWidth: 120 }}>
                          <p style={{ margin: 0, fontFamily: "'Fredoka One', cursive", fontSize: "0.92rem" }}>{eleve.prenom || eleve.nom || `Élève ${eleve.id.slice(0, 6)}`}</p>
                          <p style={{ margin: "2px 0 0", color: "#9CA3AF", fontSize: "0.75rem" }}>
                            👑 {getPrestigeTotal(eleve).toLocaleString("fr-FR")} prestige · {formatJetons(eleve.xp || 0)} jetons · {familleEmojis[eleve.famille]} {eleve.famille || "—"}
                          </p>
                        </div>
                        <input type="number" value={xpCustom[eleve.id] ?? (recompense?.xp || 0)} onChange={e => setXpCustom(prev => ({ ...prev, [eleve.id]: parseInt(e.target.value, 10) || 0 }))} style={{ width: 72, padding: "6px 8px", borderRadius: 10, border: `2px solid ${couleurFamille}40`, fontFamily: "'Fredoka One', cursive", fontSize: "0.85rem", textAlign: "center" }} />
                        <Btn onClick={() => distribuerXPIndividuel(eleve.id, xpCustom[eleve.id] ?? recompense?.xp, eleve.prenom)} color={recompense?.couleur || COLORS.S} disabled={recompenseEnCours} small>{recompense?.label || "+jetons"}</Btn>
                      </div>
                    );
                  })}
                  {!topElevesClassement.length && <p style={{ color: "#94A3B8", fontSize: "0.85rem" }}>Aucun élève chargé.</p>}
                </div>
              </div>
              <div>
                <p style={{ fontFamily: "'Fredoka One', cursive", color: "#1A1A2E", fontSize: "1rem", margin: "0 0 10px" }}>Podium familles</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {topFamillesClassement.map((famille, i) => {
                    const recompense = RECOMPENSES_FAMILLE[i];
                    const couleur = familleColors[famille.nom] || COLORS.S;
                    return (
                      <div key={famille.nom} style={{ background: i < 3 ? couleur + "08" : "#F8FAFC", borderRadius: 14, padding: "10px 12px", border: i < 3 ? `2px solid ${couleur}30` : "1px solid #E5E7EB", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <span style={{ width: 32, textAlign: "center" }}>{i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}</span>
                        <span style={{ fontSize: "1.2rem" }}>{familleEmojis[famille.nom]}</span>
                        <div style={{ flex: 1, minWidth: 100 }}>
                          <p style={{ margin: 0, fontFamily: "'Fredoka One', cursive", color: couleur, fontSize: "0.92rem" }}>{famille.nom}</p>
                          <p style={{ margin: "2px 0 0", color: "#9CA3AF", fontSize: "0.75rem" }}>{famille.membres} membres · {famille.prestige.toLocaleString("fr-FR")} prestige</p>
                        </div>
                        <span style={{ fontFamily: "'Fredoka One', cursive", fontSize: "0.8rem", color: couleur }}>{formatJetonsDelta(recompense?.xp || 0)}/pers.</span>
                        <Btn onClick={() => distribuerXPFamille(famille.nom, recompense?.xp || 0)} color={couleur} disabled={recompenseEnCours} small>{recompense?.label || "+jetons"}</Btn>
                      </div>
                    );
                  })}
                  {!topFamillesClassement.length && <p style={{ color: "#94A3B8", fontSize: "0.85rem" }}>Aucune famille.</p>}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setRecompensesVoirTous((v) => !v)}
              style={{
                width: "100%",
                marginBottom: 14,
                padding: "10px 14px",
                borderRadius: 12,
                border: "1px dashed #CBD5E1",
                background: "#F8FAFC",
                fontFamily: "'Fredoka One', cursive",
                color: "#475569",
                cursor: "pointer",
                fontSize: "0.88rem",
              }}
            >
              {recompensesVoirTous ? "▲ Masquer la liste complète" : "▼ Voir tous les élèves (ajustement individuel)"}
            </button>

            {recompensesVoirTous && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 420, overflowY: "auto" }}>
                  {eleves.map((eleve, i) => {
                    const recompense = RECOMPENSES_INDIVIDUEL[i];
                    const couleurFamille = familleColors[eleve.famille] || COLORS.S;
                    return (
                      <div key={eleve.id} style={{ background: "#F8FAFC", borderRadius: 12, padding: "10px 12px", border: "1px solid #E5E7EB", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <span style={{ width: 36, textAlign: "center", fontSize: "0.8rem", color: "#64748B" }}>#{i + 1}</span>
                        <div style={{ flex: 1, minWidth: 120 }}>
                          <p style={{ margin: 0, fontFamily: "'Fredoka One', cursive", fontSize: "0.88rem" }}>{eleve.prenom || eleve.nom || `Élève ${eleve.id.slice(0, 6)}`}</p>
                          <p style={{ margin: "2px 0 0", color: "#9CA3AF", fontSize: "0.72rem" }}>👑 {getPrestigeTotal(eleve).toLocaleString("fr-FR")} prestige</p>
                        </div>
                        <input type="number" value={xpCustom[eleve.id] ?? (recompense?.xp || 0)} onChange={e => setXpCustom(prev => ({ ...prev, [eleve.id]: parseInt(e.target.value, 10) || 0 }))} style={{ width: 72, padding: "6px 8px", borderRadius: 10, border: `2px solid ${COLORS.U}30`, fontFamily: "'Fredoka One', cursive", fontSize: "0.85rem", textAlign: "center" }} />
                        <Btn onClick={() => distribuerXPIndividuel(eleve.id, xpCustom[eleve.id] ?? recompense?.xp, eleve.prenom)} color={recompense?.couleur || COLORS.S} disabled={recompenseEnCours} small>+jetons</Btn>
                        <Btn onClick={() => retirerXPIndividuel(eleve.id, xpCustom[eleve.id] ?? recompense?.xp, eleve.prenom)} color={COLORS.H} disabled={recompenseEnCours} small>Retirer</Btn>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

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
                { emoji: "📊", texte: "Reporting \u00e9l\u00e8ves : temps de connexion, profil missions (points forts et lacunes par \u00e9l\u00e8ve), d\u00e9tail SDGN/Management, Objectif Bac, Focus, cartes, anti-triche, ajustement jetons.", couleur: COLORS.B },
                { emoji: "🏆", texte: "Récompenses : classement par prestige (cartes) ; distribution de jetons bonus en 1 clic.", couleur: COLORS.U },
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