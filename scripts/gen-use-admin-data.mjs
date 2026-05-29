import fs from "fs";

const src = fs.readFileSync("src/lib/admin/useAdminData.source.bak.tsx", "utf8");
const start = src.indexOf("export default function Admin()");
const end = src.indexOf("  const Btn =");
let body = src.slice(start + "export default function Admin()".length, end);

body = body.replace(
  'const [ongletActif, setOngletActif] = useState("recompenses")',
  'const [sectionActif, setSectionActif] = useState("overview")',
);

const repStart = body.indexOf("const reportingRows = useMemo(() => {");
const repEndMarker = "}, [eleves, todayKey]);";
const repEnd = body.indexOf(repEndMarker, repStart);
if (repStart >= 0 && repEnd > repStart) {
  body =
    body.slice(0, repStart) +
    "const reportingRows = useMemo(() => buildReportingRows(eleves, todayKey), [eleves, todayKey]);" +
    body.slice(repEnd + repEndMarker.length);
}

const header = `// @ts-nocheck
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
`;

const footer = `
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
`;

fs.writeFileSync("src/lib/admin/useAdminData.ts", header + body + footer);
console.log("OK", header.length + body.length + footer.length);
