// @ts-nocheck
import { useMemo, useState } from "react";
import { getDoc } from "firebase/firestore";
import { auth } from "../../services/firebase";
import { userDocRef } from "../../services/userProfileService";
import {
  buildDsSdgnClassReportFromStudents,
  type DsSdgnStudentReportRow,
} from "../../lib/adminDsSdgnReport";
import {
  buildPersonalReportFromUserRecord,
  exportDsSdgnClassReportPdf,
  exportDsSdgnPersonalSessionPdf,
} from "../../lib/exportDsSdgnReportPdf";
import {
  DS_SDGN_QCM_EXAM_ID,
  DS_SDGN_TERMINALE_QCM_EXAM_ID,
  readDsTabLastSession,
} from "../../services/dsTabExamService";

const DS_EXPORT_TRACKS = [
  {
    key: "premiere",
    examId: DS_SDGN_QCM_EXAM_ID,
    examLabel: "QCM 1\u00e8re STMG",
    title: "DS SDGN 1\u00e8re",
    pdfLabel: "1\u00e8re",
  },
  {
    key: "terminale",
    examId: DS_SDGN_TERMINALE_QCM_EXAM_ID,
    examLabel: "QCM Terminale STMG",
    title: "DS SDGN Terminale",
    pdfLabel: "Terminale",
  },
];

function adminDisplayName(record) {
  if (!record) return "Admin";
  return (
    record.nomAffiche ||
    [record.prenom, record.nom].filter(Boolean).join(" ") ||
    record.email ||
    "Admin"
  );
}

async function fetchFreshAdminRecord(fallback) {
  const uid = auth.currentUser?.uid;
  if (!uid) return fallback;
  try {
    const snap = await getDoc(userDocRef(uid));
    if (!snap.exists()) return fallback;
    return { id: uid, ...snap.data() };
  } catch {
    return fallback;
  }
}

export default function AdminDsSdgnReport({
  premiereRows,
  terminaleRows,
  adminSelfRecord,
  onBuildExportReport,
  onRefreshStudents,
}) {
  const [exportingPdf, setExportingPdf] = useState(null);
  const [exportingSelfPdf, setExportingSelfPdf] = useState(null);

  const premiereReport = useMemo(
    () => buildDsSdgnClassReportFromStudents(premiereRows),
    [premiereRows],
  );

  const terminaleReport = useMemo(
    () =>
      buildDsSdgnClassReportFromStudents(
        terminaleRows,
        DS_SDGN_TERMINALE_QCM_EXAM_ID,
        "DS SDGN Terminale \u2014 QCM chronom\u00e9tr\u00e9",
      ),
    [terminaleRows],
  );

  const adminSessions = useMemo(() => {
    if (!adminSelfRecord) return [];
    const userRecord = adminSelfRecord as Record<string, unknown>;
    const studentName = adminDisplayName(adminSelfRecord);

    return DS_EXPORT_TRACKS.map((track) => {
      const reportInput = buildPersonalReportFromUserRecord(
        userRecord,
        track.examId,
        track.examLabel,
        studentName,
      );
      const session = readDsTabLastSession(userRecord, track.examId);
      const answered = session?.questionsAnswered ?? session?.answers?.length ?? 0;

      return {
        ...track,
        studentName,
        answered,
        gradeOn20: reportInput?.gradeOn20 ?? 0,
        hasData: Boolean(reportInput),
      };
    }).filter((t) => t.hasData);
  }, [adminSelfRecord]);

  const handleExportClassPdf = async (track) => {
    setExportingPdf(track.key);
    try {
      if (!onBuildExportReport) {
        window.alert("Export indisponible.");
        return;
      }
      const full = await onBuildExportReport(track.examId);
      if (!full.students.length) {
        window.alert(
          `Aucune copie DS ${track.pdfLabel} detectee. Verifie que les eleves ont bien termine le QCM.`,
        );
        return;
      }
      const stamp = new Date().toISOString().slice(0, 10);
      const result = await exportDsSdgnClassReportPdf(
        full,
        `notes-ds-sdgn-${track.key}-${stamp}.pdf`,
      );
      onRefreshStudents?.();
      window.alert(
        `PDF telecharge : ${result.filename}\n\n${result.students} eleve(s) ${track.pdfLabel}.`,
      );
    } catch (err) {
      console.error(err);
      const msg = err instanceof Error ? err.message : String(err);
      window.alert(`Export PDF impossible.\n\n${msg}`);
    } finally {
      setExportingPdf(null);
    }
  };

  const handleExportSelfPdf = async (track) => {
    setExportingSelfPdf(track.key);
    try {
      const fresh = await fetchFreshAdminRecord(adminSelfRecord);
      const studentName = adminDisplayName(fresh ?? adminSelfRecord);
      const reportInput = buildPersonalReportFromUserRecord(
        fresh as Record<string, unknown>,
        track.examId,
        track.examLabel,
        studentName,
      );
      if (!reportInput) {
        window.alert("Aucune session DS. Lance le QCM depuis la page DS, puis reviens ici.");
        return;
      }
      const result = await exportDsSdgnPersonalSessionPdf(reportInput);
      onRefreshStudents?.();
      window.alert(`PDF telecharge : ${result.filename}`);
    } catch (err) {
      console.error(err);
      window.alert("Export PDF impossible. Reessaie dans quelques secondes.");
    } finally {
      setExportingSelfPdf(null);
    }
  };

  const renderTrackBlock = (track, report, rows) => (
    <div
      key={track.key}
      style={{
        marginBottom: 12,
        padding: "12px 14px",
        borderRadius: 10,
        border: "1px solid #6EE7B7",
        background: "rgba(255,255,255,0.75)",
      }}
    >
      <p style={{ margin: "0 0 6px", fontWeight: 900, color: "#065F46", fontSize: "0.88rem" }}>
        {track.title}
      </p>
      <p style={{ margin: "0 0 10px", color: "#64748B", fontSize: "0.78rem" }}>
        {`${rows.length} eleve(s) suivis \u00b7 ${report.completedCount} termine(s) \u00b7 ${report.incompleteCount} en cours ou interrompu(s)`}
      </p>
      <button
        type="button"
        disabled={exportingPdf != null || exportingSelfPdf != null}
        onClick={() => void handleExportClassPdf(track)}
        style={{
          padding: "9px 16px",
          borderRadius: 8,
          border: "none",
          background: "#059669",
          color: "white",
          fontWeight: 800,
          fontSize: "0.82rem",
          cursor: exportingPdf != null || exportingSelfPdf != null ? "wait" : "pointer",
        }}
      >
        {exportingPdf === track.key
          ? "Preparation PDF..."
          : `PDF classe ${track.pdfLabel}`}
      </button>
    </div>
  );

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
      <p
        style={{
          margin: "0 0 4px",
          fontFamily: "'Fredoka One', cursive",
          color: "#047857",
          fontSize: "1rem",
        }}
      >
        {"DS SDGN (1\u00e8re et Terminale)"}
      </p>
      <p style={{ margin: "0 0 14px", color: "#475569", fontSize: "0.82rem", lineHeight: 1.45 }}>
        {
          "Classe : PDF notes. Ton parcours : lance le QCM sur la page DS, puis PDF rapport ici (+1 / -0,5 pt)."
        }
      </p>

      <div
        style={{
          marginBottom: 14,
          padding: "12px 14px",
          borderRadius: 10,
          border: "1px solid #93C5FD",
          background: "rgba(239,246,255,0.9)",
        }}
      >
        <p style={{ margin: "0 0 8px", fontWeight: 900, color: "#1E40AF", fontSize: "0.85rem" }}>
          {"Mon QCM (admin)"}
        </p>
        {adminSessions.length > 0 ? (
          <ul style={{ margin: "0 0 10px", paddingLeft: 18, color: "#334155", fontSize: "0.8rem" }}>
            {adminSessions.map((track) => (
              <li key={track.key} style={{ marginBottom: 4 }}>
                {`${track.examLabel} : ${track.gradeOn20} /20 \u00b7 ${track.answered} rep.`}
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ margin: "0 0 10px", color: "#64748B", fontSize: "0.8rem" }}>
            {"Aucun QCM enregistre. Lance 1\u00e8re ou Terminale depuis la page DS."}
          </p>
        )}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {DS_EXPORT_TRACKS.map((track) => (
            <button
              key={track.key}
              type="button"
              disabled={
                exportingSelfPdf != null ||
                exportingPdf != null ||
                !adminSessions.some((s) => s.key === track.key)
              }
              onClick={() => void handleExportSelfPdf(track)}
              style={{
                padding: "8px 14px",
                borderRadius: 8,
                border: "none",
                background: "#0D9488",
                color: "white",
                fontWeight: 800,
                fontSize: "0.8rem",
                cursor:
                  exportingSelfPdf != null || exportingPdf != null ? "wait" : "pointer",
                opacity: adminSessions.some((s) => s.key === track.key) ? 1 : 0.45,
              }}
            >
              {exportingSelfPdf === track.key
                ? "Preparation PDF..."
                : `Mon PDF ${track.pdfLabel}`}
            </button>
          ))}
        </div>
      </div>

      {renderTrackBlock(DS_EXPORT_TRACKS[0], premiereReport, premiereRows)}
      {renderTrackBlock(DS_EXPORT_TRACKS[1], terminaleReport, terminaleRows)}
    </div>
  );
}
