// @ts-nocheck
import { useEffect, useMemo, useState } from "react";
import {
  buildDsSdgnClassReportFromStudents,
  buildExportReportForAdmin,
  countUsersWithDsSdgnExamData,
  formatDsDisplayStatusLabel,
  formatDsGradeForReport,
} from "../../lib/adminDsSdgnReport";
import { exportDsSdgnClassReportPdf } from "../../lib/exportDsSdgnReportPdf";
import { exportDsSdgnClassReportXlsx } from "../../lib/exportDsSdgnReportXlsx";
import { DS_SDGN_TOPIC_LABELS, DS_SDGN_TOPIC_ORDER } from "../../lib/dsSdgnQcmTopics";
import {
  closeDsSdgnPremiereExamForAll,
  reopenDsSdgnPremiereExam,
  subscribeDsSdgnExamConfig,
} from "../../services/dsSdgnExamConfigService";
import {
  grantDsSdgnExamResume,
  resetDsSdgnTabExamForUser,
} from "../../services/dsTabExamService";

export default function AdminDsSdgnReport({
  premiereRows,
  usersAll = [],
  dsSdgnSummaries = [],
  onSyncDsResults,
  onAfterReset,
}) {
  const [recherche, setRecherche] = useState("");
  const [exporting, setExporting] = useState(false);
  const [exportingPdf, setExportingPdf] = useState(false);
  const [syncingResults, setSyncingResults] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [resettingId, setResettingId] = useState(null);
  const [restoringId, setRestoringId] = useState(null);
  const [closingExam, setClosingExam] = useState(false);
  const [reopeningExam, setReopeningExam] = useState(false);
  const [examConfig, setExamConfig] = useState({ closed: false, closedAt: null });

  useEffect(() => {
    return subscribeDsSdgnExamConfig(setExamConfig);
  }, []);

  const filteredRows = useMemo(() => {
    const q = recherche.trim().toLowerCase();
    return premiereRows.filter((eleve) => {
      if (!q) return true;
      const hay = `${eleve.studentName || ""} ${eleve.email || ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [premiereRows, recherche]);

  const report = useMemo(
    () => buildDsSdgnClassReportFromStudents(filteredRows),
    [filteredRows],
  );

  const dsTabDetectedTotal = useMemo(
    () => Math.max(countUsersWithDsSdgnExamData(usersAll), dsSdgnSummaries.length),
    [usersAll, dsSdgnSummaries.length],
  );

  const buildFullExportReport = () => buildExportReportForAdmin(premiereRows, usersAll);

  const handleExport = () => {
    setExporting(true);
    try {
      const full = buildFullExportReport();
      if (!full.students.length) {
        window.alert(
          "Aucune copie DS d\u00e9tect\u00e9e dans Firebase. Rafra\u00eechis la liste \u00e9l\u00e8ves puis r\u00e9essaie.",
        );
        return;
      }
      exportDsSdgnClassReportXlsx(full);
    } catch (err) {
      console.error(err);
      window.alert("Export Excel impossible pour le moment.");
    } finally {
      setExporting(false);
    }
  };

  const handleExportPdf = async () => {
    setExportingPdf(true);
    try {
      const full = buildFullExportReport();
      if (!full.students.length) {
        window.alert(
          "Aucune copie DS d\u00e9tect\u00e9e dans Firebase. Rafra\u00eechis la liste \u00e9l\u00e8ves puis r\u00e9essaie.",
        );
        return;
      }
      const result = await exportDsSdgnClassReportPdf(full);
      window.alert(
        `PDF telecharge : ${result.filename}\n\n` +
          `${result.students} eleve(s)\n` +
          `${result.answers} reponses detaillees dans le PDF\n\n` +
          `(Section 1 = notes /20 de chaque eleve)`,
      );
    } catch (err) {
      console.error(err);
      const msg = err instanceof Error ? err.message : String(err);
      window.alert(`Export PDF impossible.\n\n${msg}`);
    } finally {
      setExportingPdf(false);
    }
  };

  const canGrantResume = (row) => {
    const sess = row.session;
    if (!sess) return false;
    const answered = sess.answers?.length ?? sess.questionsAnswered ?? 0;
    const total = sess.totalQuestions ?? sess.questionIds?.length ?? 0;
    if (answered <= 0) return false;
    if (total > 0 && answered >= total) return false;
    const stoppable =
      row.displayStatus === "disqualified" ||
      row.displayStatus === "incomplete" ||
      Boolean(sess.forcedZero);
    return stoppable;
  };

  const handleGrantResume = async (row) => {
    const sess = row.session;
    const answers = sess?.answers ?? [];
    const total = sess?.totalQuestions ?? answers.length;
    const label = row.studentName || row.studentId;
    if (!canGrantResume(row)) {
      window.alert(
        "Reprise impossible : pas assez de donn\u00e9es (r\u00e9ponses ou liste de questions manquante). Utilise \u00ab Repasse QCM \u00bb pour tout recommencer.",
      );
      return;
    }
    if (
      !window.confirm(
        `Autoriser ${label} \u00e0 reprendre son DS ?\n\n${answers.length}/${total} questions d\u00e9j\u00e0 faites \u2014 score et historique conserv\u00e9s.\nL\u2019\u00e9l\u00e8ve clique \u00ab Continuer le DS \u00bb sur la page DS.`,
      )
    ) {
      return;
    }
    setRestoringId(row.studentId);
    try {
      const result = await grantDsSdgnExamResume(row.studentId);
      if (!result) {
        window.alert("Reprise impossible (session introuvable ou DS d\u00e9j\u00e0 termin\u00e9).");
        return;
      }
      window.alert(
        `Reprise autoris\u00e9e pour ${label}. Il peut continuer \u00e0 la question ${result.questionsAnswered + 1}/${result.totalQuestions} (${result.gradeOn20Provisional}/20 prov.).`,
      );
      onAfterReset?.();
    } catch (err) {
      console.error(err);
      window.alert("Erreur lors de l\u2019autorisation de reprise.");
    } finally {
      setRestoringId(null);
    }
  };

  const handleResetOneStudent = async (row) => {
    const label = row.studentName || row.studentId;
    if (
      !window.confirm(
        `Repasse exceptionnelle du QCM SDGN pour ${label} ?\n\nCela efface la tentative enregistr\u00e9e (note, anti-triche DS).\nPour r\u00e9tablir uniquement les jetons (onglet / missions), utilise \u00ab R\u00e9tablir jetons \u00bb dans le tableau \u00e9l\u00e8ves.`,
      )
    ) {
      return;
    }
    setResettingId(row.studentId);
    try {
      await resetDsSdgnTabExamForUser(row.studentId);
      onAfterReset?.();
    } catch (err) {
      console.error(err);
      window.alert("Erreur lors de la r\u00e9initialisation.");
    } finally {
      setResettingId(null);
    }
  };

  const inProgressCount = useMemo(
    () =>
      premiereRows.filter(
        (row) => row.displayStatus === "incomplete" || row.displayStatus === "disqualified",
      ).length,
    [premiereRows],
  );

  const handleCloseExamForAll = async () => {
    const ids = premiereRows.map((r) => r.studentId);
    const msg =
      `Cl\u00f4turer le DS SDGN pour toute la Premi\u00e8re ?\n\n` +
      `\u2022 ${inProgressCount} session(s) en cours seront coup\u00e9es (note sur les r\u00e9ponses d\u00e9j\u00e0 faites)\n` +
      `\u2022 Personne ne pourra lancer ou reprendre le QCM\n` +
      `\u2022 Les notes d\u00e9j\u00e0 termin\u00e9es (ex. 14,9) sont conserv\u00e9es`;
    if (!window.confirm(msg)) return;
    setClosingExam(true);
    try {
      const result = await closeDsSdgnPremiereExamForAll(ids);
      window.alert(
        `DS cl\u00f4tur\u00e9.\n${result.finalized} session(s) finalis\u00e9e(s).\n${result.skipped} compte(s) sans changement (d\u00e9j\u00e0 termin\u00e9 ou jamais commenc\u00e9).`,
      );
      onAfterReset?.();
    } catch (err) {
      console.error(err);
      window.alert("Impossible de cl\u00f4turer le DS (droits Firestore ou connexion).");
    } finally {
      setClosingExam(false);
    }
  };

  const handleReopenExam = async () => {
    if (
      !window.confirm(
        "Rouvrir le DS pour la classe ?\n\nLes \u00e9l\u00e8ves qui ont d\u00e9j\u00e0 une note ne pourront toujours pas recommencer sans \u00ab Repasse QCM \u00bb.",
      )
    ) {
      return;
    }
    setReopeningExam(true);
    try {
      await reopenDsSdgnPremiereExam();
      window.alert("DS rouvert : les \u00e9l\u00e8ves sans note peuvent lancer le QCM.");
    } catch (err) {
      console.error(err);
      window.alert("Impossible de rouvrir le DS.");
    } finally {
      setReopeningExam(false);
    }
  };

  const handleResetAttempts = async () => {
    const targets = filteredRows.filter((row) => row.displayStatus !== "not_started");
    if (!targets.length) {
      window.alert("Aucun \u00e9l\u00e8ve avec une tentative DS \u00e0 r\u00e9initialiser (filtre actuel).");
      return;
    }
    const msg = `R\u00e9initialiser le QCM SDGN pour ${targets.length} \u00e9l\u00e8ve(s) ? Ils pourront repasser le DS.`;
    if (!window.confirm(msg)) return;
    setResetting(true);
    try {
      await Promise.all(targets.map((row) => resetDsSdgnTabExamForUser(row.studentId)));
      window.alert(`QCM SDGN r\u00e9initialis\u00e9 pour ${targets.length} \u00e9l\u00e8ve(s).`);
      onAfterReset?.();
    } catch (err) {
      console.error(err);
      window.alert("Erreur lors de la r\u00e9initialisation.");
    } finally {
      setResetting(false);
    }
  };

  const statusColor = (status) => {
    if (status === "completed") return "#059669";
    if (status === "incomplete") return "#D97706";
    if (status === "disqualified") return "#DC2626";
    return "#94A3B8";
  };

  return (
    <div
      style={{
        marginBottom: 20,
        padding: "16px 18px",
        borderRadius: 14,
        border: "1px solid #A7F3D0",
        background: "linear-gradient(135deg,#ECFDF5,#F8FAFC)",
      }}
    >
      <p style={{ margin: "0 0 4px", fontFamily: "'Fredoka One', cursive", color: "#047857", fontSize: "1rem" }}>
        {"Rapport DS SDGN Premi\u00e8re"}
      </p>
      <p style={{ margin: "0 0 8px", color: "#475569", fontSize: "0.82rem", lineHeight: 1.45 }}>
        {
          "Export de toute la classe : termines, non termines et jamais commences. Note /20, acquis par notion, detail des reponses."
        }
      </p>
      <p style={{ margin: "0 0 8px", color: "#0369A1", fontSize: "0.78rem", lineHeight: 1.45 }}>
        {`${dsSdgnSummaries.length} copie(s) dans dsSdgnResults \u00b7 ${dsTabDetectedTotal} detectee(s) dans users.dsTab \u00b7 ${report.withDsDataCount} ligne(s) ci-dessous.`}
      </p>
      <div style={{ marginBottom: 12 }}>
        <button
          type="button"
          disabled={syncingResults}
          onClick={async () => {
            if (!onSyncDsResults) return;
            setSyncingResults(true);
            try {
              const r = await onSyncDsResults();
              if (r.total === 0 && r.candidates === 0) {
                window.alert(
                  "Aucune copie DS trouvee dans users.dsTab.\n\nVerifie dans Firebase Console : users / un eleve / dsTab / sdgn_premiere_qcm_v1 / gradeOn20",
                );
                return;
              }
              window.alert(
                `Synchronisation OK.\n` +
                  `${r.total} copie(s) dans dsSdgnResults\n` +
                  `${r.candidates} detectee(s) dans users.dsTab\n` +
                  `${r.written} ecrite(s), ${r.skipped} deja a jour` +
                  (r.errors?.length
                    ? `\n\nAvertissements :\n${r.errors.slice(0, 3).join("\n")}`
                    : ""),
              );
              onAfterReset?.();
            } catch (err) {
              const msg = err instanceof Error ? err.message : String(err);
              window.alert(
                `Echec sync.\n\n${msg}\n\nSi "permission-denied" : reconnecte-toi en compte admin, ou redeploie les regles Firestore.`,
              );
            } finally {
              setSyncingResults(false);
            }
          }}
          style={{
            padding: "8px 14px",
            borderRadius: 10,
            border: "1px solid #0284C7",
            background: "white",
            color: "#0369A1",
            fontWeight: 800,
            fontSize: "0.82rem",
            cursor: syncingResults ? "wait" : "pointer",
          }}
        >
          {syncingResults ? "Sync..." : "Synchroniser copies DS depuis Firebase"}
        </button>
      </div>
      <p style={{ margin: "0 0 14px", color: "#B45309", fontSize: "0.78rem", lineHeight: 1.45, fontWeight: 700 }}>
        {
          "Anti-triche accidentel : \u00ab Autoriser reprise \u00bb laisse l\u2019\u00e9l\u00e8ve continuer le DS (score + r\u00e9ponses conserv\u00e9s). \u00ab Repasse QCM \u00bb efface tout."
        }
      </p>

      <div
        style={{
          marginBottom: 14,
          padding: "12px 14px",
          borderRadius: 12,
          border: examConfig.closed ? "1px solid #FCA5A5" : "1px solid #86EFAC",
          background: examConfig.closed ? "#FEF2F2" : "#F0FDF4",
        }}
      >
        <p style={{ margin: "0 0 8px", fontWeight: 800, color: examConfig.closed ? "#B91C1C" : "#047857", fontSize: "0.88rem" }}>
          {examConfig.closed ? "DS ferm\u00e9 pour la classe" : "DS ouvert (lancement QCM autoris\u00e9)"}
        </p>
        {examConfig.closed && examConfig.closedAt && (
          <p style={{ margin: "0 0 10px", fontSize: "0.78rem", color: "#7F1D1D" }}>
            {`Cl\u00f4tur\u00e9 le ${new Date(examConfig.closedAt).toLocaleString("fr-FR")}`}
          </p>
        )}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          <button
            type="button"
            disabled={closingExam || examConfig.closed}
            onClick={() => void handleCloseExamForAll()}
            style={{
              padding: "9px 16px",
              borderRadius: 10,
              border: "none",
              background: examConfig.closed ? "#94A3B8" : "#DC2626",
              color: "white",
              fontWeight: 800,
              fontSize: "0.85rem",
              cursor: examConfig.closed ? "not-allowed" : "pointer",
            }}
          >
            {closingExam ? "Cl\u00f4ture..." : "Cl\u00f4turer le DS (toute Premi\u00e8re)"}
          </button>
          {examConfig.closed && (
            <button
              type="button"
              disabled={reopeningExam}
              onClick={() => void handleReopenExam()}
              style={{
                padding: "9px 16px",
                borderRadius: 10,
                border: "1px solid #059669",
                background: "white",
                color: "#047857",
                fontWeight: 800,
                fontSize: "0.85rem",
                cursor: reopeningExam ? "wait" : "pointer",
              }}
            >
              {reopeningExam ? "..." : "Rouvrir le DS"}
            </button>
          )}
        </div>
        <p style={{ margin: "10px 0 0", fontSize: "0.75rem", color: "#64748B", lineHeight: 1.45 }}>
          {
            "Coupe imm\u00e9diatement les \u00e9l\u00e8ves en plein QCM (leur navigateur enregistre la copie) et bloque tout nouveau lancement."
          }
        </p>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center", marginBottom: 14 }}>
        <input
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
          placeholder="Filtrer un \u00e9l\u00e8ve..."
          style={{
            minWidth: 200,
            flex: 1,
            padding: "8px 10px",
            borderRadius: 10,
            border: "1px solid #CBD5E1",
            fontSize: "0.85rem",
          }}
        />
        <span style={{ fontSize: "0.78rem", color: "#64748B" }}>
          {`${report.withDsDataCount} avec DS enregistr\u00e9 \u00b7 ${report.completedCount} termin\u00e9(s) \u00b7 ${report.incompleteCount} en cours / interrompu \u00b7 ${report.students.filter((s) => s.displayStatus === "not_started").length} jamais commenc\u00e9(s)`}
        </span>
        <button
          type="button"
          disabled={exporting || exportingPdf || dsTabDetectedTotal === 0}
          onClick={handleExport}
          style={{
            padding: "9px 16px",
            borderRadius: 10,
            border: "none",
            background: dsTabDetectedTotal > 0 ? "#059669" : "#94A3B8",
            color: "white",
            fontWeight: 800,
            fontSize: "0.85rem",
            cursor: dsTabDetectedTotal > 0 ? "pointer" : "not-allowed",
          }}
        >
          {exporting ? "Export..." : "Exporter Excel (copies DS)"}
        </button>
        <button
          type="button"
          disabled={exporting || exportingPdf || dsTabDetectedTotal === 0}
          onClick={() => void handleExportPdf()}
          style={{
            padding: "9px 16px",
            borderRadius: 10,
            border: "none",
            background: dsTabDetectedTotal > 0 ? "#0F766E" : "#94A3B8",
            color: "white",
            fontWeight: 800,
            fontSize: "0.85rem",
            cursor: dsTabDetectedTotal > 0 ? "pointer" : "not-allowed",
          }}
        >
          {exportingPdf ? "PDF..." : "Exporter PDF (rapport complet)"}
        </button>
        <button
          type="button"
          disabled={resetting || !filteredRows.some((r) => r.displayStatus !== "not_started")}
          onClick={handleResetAttempts}
          style={{
            padding: "9px 16px",
            borderRadius: 10,
            border: "1px solid #F59E0B",
            background: "white",
            color: "#B45309",
            fontWeight: 800,
            fontSize: "0.85rem",
            cursor: resetting ? "wait" : "pointer",
          }}
        >
          {resetting ? "Reset..." : "Repasse QCM (toute la classe filtr\u00e9e)"}
        </button>
      </div>

      {!report.students.length ? (
        <p style={{ margin: 0, color: "#64748B", fontSize: "0.88rem" }}>
          {"Aucun \u00e9l\u00e8ve de Premi\u00e8re avec les filtres actuels."}
        </p>
      ) : (
        <div style={{ overflowX: "auto", background: "white", borderRadius: 12, border: "1px solid #E2E8F0" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.78rem" }}>
            <thead>
              <tr style={{ background: "#F1F5F9", textAlign: "left" }}>
                <th style={{ padding: "8px 10px" }}>{"\u00c9l\u00e8ve"}</th>
                <th style={{ padding: "8px 10px" }}>{"Statut"}</th>
                <th style={{ padding: "8px 10px" }}>{"Prog."}</th>
                <th style={{ padding: "8px 10px" }}>{"Note /20"}</th>
                {DS_SDGN_TOPIC_ORDER.map((topic) => (
                  <th key={topic} style={{ padding: "8px 10px", whiteSpace: "nowrap" }}>
                    {DS_SDGN_TOPIC_LABELS[topic]}
                  </th>
                ))}
                <th style={{ padding: "8px 10px" }}>{"Actions"}</th>
              </tr>
            </thead>
            <tbody>
              {report.students.map((row) => {
                const sess = row.session;
                const answered = sess?.questionsAnswered ?? sess?.answers?.length ?? 0;
                const planned = sess?.totalQuestions;
                const prog =
                  planned != null && planned > 0
                    ? `${answered}/${planned}`
                    : row.displayStatus === "not_started"
                      ? "\u2014"
                      : answered > 0
                        ? `${answered}/?`
                        : "\u2014";
                return (
                  <tr key={row.studentId} style={{ borderTop: "1px solid #E2E8F0" }}>
                    <td style={{ padding: "8px 10px", fontWeight: 700 }}>{row.studentName}</td>
                    <td
                      style={{
                        padding: "8px 10px",
                        fontWeight: 700,
                        color: statusColor(row.displayStatus),
                      }}
                    >
                      {formatDsDisplayStatusLabel(row.displayStatus)}
                    </td>
                    <td style={{ padding: "8px 10px" }}>{prog}</td>
                    <td style={{ padding: "8px 10px", fontWeight: 800, color: "#0F766E" }}>
                      {formatDsGradeForReport(row)}
                    </td>
                    {DS_SDGN_TOPIC_ORDER.map((topic) => {
                      const stat = sess?.topicStats?.[topic];
                      const label =
                        row.displayStatus === "not_started"
                          ? "\u2014"
                          : !stat || stat.total <= 0
                            ? "N/E"
                            : stat.acquis
                              ? "Acquis"
                              : "Non acquis";
                      const color =
                        label === "Acquis"
                          ? "#059669"
                          : label === "Non acquis"
                            ? "#DC2626"
                            : "#94A3B8";
                      return (
                        <td key={topic} style={{ padding: "8px 10px", color, fontWeight: 700 }}>
                          {label}
                        </td>
                      );
                    })}
                    <td style={{ padding: "8px 10px", whiteSpace: "nowrap" }}>
                      {row.displayStatus === "not_started" ? (
                        <span style={{ color: "#94A3B8" }}>{"\u2014"}</span>
                      ) : (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                          {canGrantResume(row) && (
                            <button
                              type="button"
                              disabled={Boolean(restoringId) || Boolean(resettingId) || resetting}
                              onClick={() => handleGrantResume(row)}
                              style={{
                                padding: "5px 10px",
                                borderRadius: 8,
                                border: "1px solid #059669",
                                background: "#ECFDF5",
                                color: "#047857",
                                fontWeight: 800,
                                fontSize: "0.72rem",
                                cursor: restoringId || resettingId || resetting ? "wait" : "pointer",
                              }}
                            >
                              {restoringId === row.studentId ? "..." : "Autoriser reprise"}
                            </button>
                          )}
                          <button
                            type="button"
                            disabled={Boolean(resettingId) || Boolean(restoringId) || resetting}
                            onClick={() => handleResetOneStudent(row)}
                            style={{
                              padding: "5px 10px",
                              borderRadius: 8,
                              border:
                                row.displayStatus === "disqualified"
                                  ? "1px solid #F87171"
                                  : "1px solid #F59E0B",
                              background: "white",
                              color: row.displayStatus === "disqualified" ? "#B91C1C" : "#B45309",
                              fontWeight: 800,
                              fontSize: "0.72rem",
                              cursor: resettingId || restoringId || resetting ? "wait" : "pointer",
                            }}
                          >
                            {resettingId === row.studentId ? "..." : "Repasse QCM"}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
