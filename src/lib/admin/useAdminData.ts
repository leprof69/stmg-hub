// @ts-nocheck
import { useState, useEffect, useMemo } from "react";
import { auth, db } from "../../services/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { doc, setDoc, collection, getDocs, deleteDoc, updateDoc, deleteField } from "firebase/firestore";
import * as XLSX from "xlsx";
import { formatJetons, formatJetonsDelta } from "../jetons";
import { getPrestigeTotal } from "../../services/userProfileService";
import { formatDsDisplayStatusLabel } from "../adminDsSdgnReport";
import { buildReportingRows } from "./buildReportingRows";
import {
  ADMIN_COLORS,
  ADMIN_SECTIONS,
  EMOJI_PAR_MATIERE,
  FAMILLE_COLORS,
  FAMILLE_EMOJIS,
  RECOMPENSES_INDIVIDUEL,
  RECOMPENSES_FAMILLE,
} from "./adminConstants";
import { DS_EXAM_ID, DS_LOCK_TYPE, DS_EXERCISES, DS_EXERCISE_BY_ID } from "./adminDsConstants";
import { col, splitMotsCles, toDayKey, formatDuration, formatDateFr } from "./adminUtils";

export function useAdminData() {
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
  const [sectionActif, setSectionActif] = useState("overview");
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
    if (
      !window.confirm(
        `Rétablir les jetons pour ${nomAffiche} ?\n\nL'élève pourra à nouveau gagner des jetons (Missions, jeux, etc.).\nCela ne modifie pas la note du DS QCM si il a été disqualifié.`,
      )
    ) {
      return;
    }
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
  const reportingRows = useMemo(() => buildReportingRows(eleves, todayKey), [eleves, todayKey]);

  const terminaleReportingRows = useMemo(
    () => reportingRows.filter((eleve) => eleve.classe === "terminale"),
    [reportingRows]
  );

  const premiereReportingRows = useMemo(
    () =>
      reportingRows
        .filter((eleve) => eleve.classe === "premiere" && eleve.dsSdgnRow)
        .map((eleve) => eleve.dsSdgnRow),
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
      if (filtreActivite === "jetons_suspendus") okActivite = Boolean(eleve.platformIntegrity?.xpSuspended);

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
        `Réinitialiser les copies DS Objectif Bac pour ${targets.length} élève(s) ?\n\nLe QCM SDGN Première n'est pas effacé ici (utilise le bloc Rapport DS SDGN pour une repasse QCM).`,
      )
    ) {
      return;
    }

    setResetDsLoading(true);
    try {
      await Promise.all(
        targets.map((user) =>
          updateDoc(doc(db, "users", user.id), {
            [`objectifBacDs.${DS_EXAM_ID}`]: deleteField(),
          }),
        ),
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

  const elevesJetonsSuspendus = useMemo(
    () =>
      reportingRows
        .filter((e) => Boolean(e.platformIntegrity?.xpSuspended))
        .sort((a, b) => String(a.nomAffiche).localeCompare(String(b.nomAffiche), "fr")),
    [reportingRows],
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


  return {
    COLORS: ADMIN_COLORS,
    ADMIN_SECTIONS,
    familleColors: FAMILLE_COLORS,
    familleEmojis: FAMILLE_EMOJIS,
    RECOMPENSES_INDIVIDUEL,
    RECOMPENSES_FAMILLE,
    DS_EXAM_ID,
    DS_LOCK_TYPE,
    DS_EXERCISES,
    formatDsDisplayStatusLabel,
    formatDateFr,
    formatDuration,
    toDayKey,
    fichierChapitres,
    setFichierChapitres,
    importChapitres,
    fichierMissions,
    setFichierMissions,
    importMissions,
    eleves,
    usersAll,
    chargementEleves,
    erreurEleves,
    recompenseEnCours,
    messagesRecompense,
    setMessagesRecompense,
    xpCustom,
    setXpCustom,
    famillesClassement,
    filtreClasse,
    setFiltreClasse,
    filtreLycee,
    setFiltreLycee,
    sectionActif,
    setSectionActif,
    recompensesVoirTous,
    setRecompensesVoirTous,
    filtreActivite,
    setFiltreActivite,
    rechercheEleve,
    setRechercheEleve,
    resetDsLoading,
    sdgnExpanded,
    setSdgnExpanded,
    resetPwdUserId,
    flashReporting,
    setFlashReporting,
    quickJetons,
    setQuickJetons,
    triReporting,
    setTriReporting,
    reportingDetailId,
    setReportingDetailId,
    chargerEleves,
    envoyerLienResetMdp,
    retablirJetonsAntiTriche,
    distribuerXPIndividuel,
    retirerXPIndividuel,
    distribuerXPFamille,
    distribuerTopIndividuel,
    distribuerTopFamilles,
    classesDispo,
    lyceesDispo,
    elevesFiltres,
    topElevesClassement,
    topFamillesClassement,
    statsParClasse,
    statsParLycee,
    reportingRows,
    terminaleReportingRows,
    premiereReportingRows,
    reportingFiltres,
    maxParticipationReporting,
    dashboardStats,
    dsCopiesRows,
    exportAllDsCopiesPdf,
    resetDsLocksForFilteredStudents,
    elevesSuspects,
    elevesJetonsSuspendus,
    importerChapitres,
    importerMissions,
    resetMissions,
    getPrestigeTotal,
    formatJetons,
    formatJetonsDelta,
  };
}
