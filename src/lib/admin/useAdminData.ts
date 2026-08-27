// @ts-nocheck
import { useState, useEffect, useMemo } from "react";
import { auth, db } from "../../services/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { doc, setDoc, collection, getDocs, deleteDoc, updateDoc, deleteField } from "firebase/firestore";
import * as XLSX from "xlsx";
import { formatJetons, formatJetonsDelta } from "../jetons";
import { getPrestigeTotal } from "../../services/userProfileService";
import { buildReportingRows } from "./buildReportingRows";
import {
  ADMIN_COLORS,
  ADMIN_SECTIONS,
  FAMILLE_COLORS,
  FAMILLE_EMOJIS,
  RECOMPENSES_INDIVIDUEL,
  RECOMPENSES_FAMILLE,
} from "./adminConstants";
import { col, toDayKey, formatDuration, formatDateFr } from "./adminUtils";

export function useAdminData() {
  const [fichierChapitres, setFichierChapitres] = useState(null);
  const [importChapitres, setImportChapitres] = useState({ loading: false, succes: 0, erreurs: 0, message: "" });
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
  const [resetSaisonLoading, setResetSaisonLoading] = useState(false);
  const [nettoyageLoading, setNettoyageLoading] = useState(false);
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
        `Rétablir les jetons pour ${nomAffiche} ?\n\nL'élève pourra à nouveau gagner des jetons (jeux, cartes, etc.).`,
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

  const adminSelfRecord = useMemo(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return null;
    return usersAll.find((u) => u.id === uid) ?? null;
  }, [usersAll]);

  const reportingFiltres = useMemo(() => {
    return reportingRows.filter((eleve) => {
      const okClasse = filtreClasse === "toutes" || eleve.classe === filtreClasse;
      const okLycee = filtreLycee === "tous" || eleve.lycee === filtreLycee;
      const okRecherche = !rechercheEleve.trim() || eleve.nomAffiche.toLowerCase().includes(rechercheEleve.toLowerCase()) || String(eleve.email || "").toLowerCase().includes(rechercheEleve.toLowerCase());

      let okActivite = true;
      if (filtreActivite === "aujourdhui") okActivite = eleve.estActifAujourdhui;
      if (filtreActivite === "7jours") okActivite = eleve.joursSansActivite !== null && eleve.joursSansActivite <= 7;
      if (filtreActivite === "inactifs") okActivite = eleve.joursSansActivite !== null && eleve.joursSansActivite > 7;
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
      (sum, e) => sum + (e.lastVisit === todayKey ? 1 : 0),
      0
    );
    const sessionTodaySec = reportingRows.reduce((sum, e) => sum + (e.sessionTodaySec || 0), 0);
    const participationTotal = reportingRows.reduce((sum, e) => sum + (Number(e.participationPoints) || 0), 0);
    return {
      total,
      actifsAujourdhui,
      actifs7j,
      inactifs7j,
      actionsToday,
      sessionTodaySec,
      participationTotal,
    };
  }, [reportingRows, todayKey]);

  /**
   * Nouvelle saison : remet à 0 le classement (jetons, prestige, collection de cartes,
   * chapitres/missions complétés, séries de connexion, classe) pour TOUS les élèves, quels que
   * soient les filtres actifs. Les comptes eux-mêmes (identité, rôle, lycée...) ne sont
   * pas touchés. Irréversible — double confirmation gérée côté UI + ici.
   */
  const resetSaisonComplete = async () => {
    const targets = usersAll.filter((user) => user.role !== "admin");
    if (!targets.length) {
      alert("Aucun élève à réinitialiser.");
      return;
    }
    if (
      !window.confirm(
        `Réinitialiser la saison pour ${targets.length} élève(s) ?\n\n` +
          "Remis à 0 pour tout le monde : jetons, jetons dépensés, prestige, " +
          "collection de cartes, chapitres/missions complétés, séries de connexion, classe.\n" +
          "Le lycée est conservé. Les comptes élèves ne sont PAS supprimés.\n\n" +
          "Cette action est IRRÉVERSIBLE. Continuer ?",
      )
    ) {
      return;
    }
    setResetSaisonLoading(true);
    try {
      await Promise.all(
        targets.map((user) =>
          updateDoc(doc(db, "users", user.id), {
            xp: 0,
            xpDepensee: 0,
            prestige: 0,
            prestigeBase: 0,
            prestigeGifted: 0,
            prestigeDonBonus: 0,
            niveau: 1,
            badges: [],
            cartes: {},
            chapitresCompletes: [],
            missionsCompletes: [],
            connexions_consecutives: 0,
            classe: "",
            missionsHistorique: deleteField(),
            missionsProgress: deleteField(),
            dernierPackMystere: deleteField(),
          }),
        ),
      );
      await chargerEleves();
      alert(`Saison réinitialisée pour ${targets.length} élève(s).`);
    } catch (err) {
      console.error("Reset saison impossible", err);
      alert("Erreur lors du reset de saison. Vérifie la console.");
    } finally {
      setResetSaisonLoading(false);
    }
  };

  /**
   * Nettoyage unique après la suppression des fonctionnalités DS / Missions / Objectif Bac / Focus :
   * efface les champs devenus orphelins sur tous les comptes, ainsi que les collections Firestore
   * dédiées à ces fonctionnalités. N'affecte ni l'identité des comptes, ni jetons/prestige/cartes.
   */
  const nettoyerAnciennesFonctionnalites = async () => {
    if (
      !window.confirm(
        "Nettoyer les données des fonctionnalités supprimées (DS, Missions, Objectif Bac, Focus) ?\n\n" +
          "Efface sur tous les comptes : dsTab, objectifBacDs, objectifBacProgress, focusProgress.\n" +
          "Supprime aussi les collections Firestore : dsSdgnResults, dsSdgnNotes, missions, examConfig.\n\n" +
          "N'affecte ni les comptes, ni jetons/prestige/cartes. Cette action est IRRÉVERSIBLE. Continuer ?",
      )
    ) {
      return;
    }
    setNettoyageLoading(true);
    try {
      await Promise.all(
        usersAll.map((user) =>
          updateDoc(doc(db, "users", user.id), {
            dsTab: deleteField(),
            objectifBacDs: deleteField(),
            objectifBacProgress: deleteField(),
            focusProgress: deleteField(),
          }),
        ),
      );

      const collectionsAEffacer = ["dsSdgnResults", "dsSdgnNotes", "missions"];
      for (const nomCollection of collectionsAEffacer) {
        const snapshot = await getDocs(collection(db, nomCollection));
        await Promise.all(snapshot.docs.map((d) => deleteDoc(doc(db, nomCollection, d.id))));
      }
      await deleteDoc(doc(db, "examConfig", "ds_sdgn_premiere_qcm_v1"));

      await chargerEleves();
      alert("Nettoyage terminé.");
    } catch (err) {
      console.error("Nettoyage anciennes fonctionnalités impossible", err);
      alert("Erreur lors du nettoyage. Vérifie la console.");
    } finally {
      setNettoyageLoading(false);
    }
  };

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

  return {
    COLORS: ADMIN_COLORS,
    ADMIN_SECTIONS,
    familleColors: FAMILLE_COLORS,
    familleEmojis: FAMILLE_EMOJIS,
    RECOMPENSES_INDIVIDUEL,
    RECOMPENSES_FAMILLE,
    formatDateFr,
    formatDuration,
    toDayKey,
    fichierChapitres,
    setFichierChapitres,
    importChapitres,
    eleves,
    usersAll,
    adminSelfRecord,
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
    reportingFiltres,
    maxParticipationReporting,
    dashboardStats,
    resetSaisonComplete,
    resetSaisonLoading,
    nettoyerAnciennesFonctionnalites,
    nettoyageLoading,
    elevesJetonsSuspendus,
    importerChapitres,
    getPrestigeTotal,
    formatJetons,
    formatJetonsDelta,
  };
}
