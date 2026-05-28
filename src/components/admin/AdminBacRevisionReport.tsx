// @ts-nocheck
import { useMemo, useState } from "react";
import { buildStudentBacRevisionReport, normalizeDayKey } from "../../lib/adminBacRevisionReport";
import { exportStudentBacRevisionPdf } from "../../lib/exportBacRevisionPdf";

function toInputDateValue(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function AdminBacRevisionReport({ terminaleRows }) {
  const [reportSince, setReportSince] = useState(() => toInputDateValue());
  const [exportingId, setExportingId] = useState(null);
  const [recherche, setRecherche] = useState("");

  const sinceKey = normalizeDayKey(reportSince) ?? toInputDateValue();

  const rowsWithReports = useMemo(() => {
    const q = recherche.trim().toLowerCase();
    return terminaleRows
      .filter((eleve) => {
        if (!q) return true;
        const hay = `${eleve.nomAffiche || ""} ${eleve.email || ""}`.toLowerCase();
        return hay.includes(q);
      })
      .map((eleve) => {
        const report = buildStudentBacRevisionReport({
          studentId: eleve.id,
          studentName: eleve.nomAffiche,
          classe: eleve.classe,
          lycee: eleve.lycee,
          reportSince: sinceKey,
          missionsProgress: eleve.missionsProgress,
        });
        return { eleve, report };
      })
      .sort((a, b) => (a.eleve.nomAffiche || "").localeCompare(b.eleve.nomAffiche || "", "fr"));
  }, [terminaleRows, sinceKey, recherche]);

  const classementMissions = useMemo(() => {
    return rowsWithReports
      .filter(({ report }) => report.hasData)
      .map(({ eleve, report }) => {
        const totalScore = report.exerciseRows.reduce((sum, row) => sum + (Number(row.score) || 0), 0);
        const moyenne = report.exerciseRows.length ? totalScore / report.exerciseRows.length : 0;
        return {
          id: eleve.id,
          nom: eleve.nomAffiche,
          exos: report.exerciseRows.length,
          moyenne,
          urgent: report.notionsUrgent.length,
          ok: report.notionsOk.length,
        };
      })
      .sort((a, b) => {
        if (b.exos !== a.exos) return b.exos - a.exos;
        if (a.urgent !== b.urgent) return a.urgent - b.urgent;
        if (b.moyenne !== a.moyenne) return b.moyenne - a.moyenne;
        return (a.nom || "").localeCompare(b.nom || "", "fr");
      });
  }, [rowsWithReports]);

  const handleExport = async (row) => {
    setExportingId(row.eleve.id);
    try {
      await exportStudentBacRevisionPdf(row.report);
    } catch (err) {
      console.error(err);
      alert("Export PDF impossible pour le moment.");
    } finally {
      setExportingId(null);
    }
  };

  return (
    <div
      style={{
        marginBottom: 20,
        padding: "16px 18px",
        borderRadius: 14,
        border: "1px solid #BFDBFE",
        background: "linear-gradient(135deg,#EFF6FF,#F8FAFC)",
      }}
    >
      <p style={{ margin: "0 0 4px", fontFamily: "'Fredoka One', cursive", color: "#1E40AF", fontSize: "1rem" }}>
        {"Rapport Bac \u2014 Terminale (1re tentative)"}
      </p>
      <p style={{ margin: "0 0 14px", color: "#475569", fontSize: "0.82rem", lineHeight: 1.45 }}>
        {
          "Management Terminale + SDGN Premi\u00e8re. Notions OK (B ou mieux), \u00e0 consolider (sous B), urgence Bac (C/D/E). Export PDF par \u00e9l\u00e8ve."
        }
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center", marginBottom: 14 }}>
        <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#334155" }}>
          {"Depuis le"}
          <input
            type="date"
            value={reportSince}
            onChange={(e) => setReportSince(e.target.value)}
            style={{
              marginLeft: 8,
              padding: "8px 10px",
              borderRadius: 10,
              border: "1px solid #CBD5E1",
              fontSize: "0.85rem",
            }}
          />
        </label>
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
          {rowsWithReports.length}
          {" \u00e9l\u00e8ve(s) Terminale"}
        </span>
      </div>

      {!rowsWithReports.length ? (
        <p style={{ margin: 0, color: "#64748B", fontSize: "0.88rem" }}>
          {"Aucun \u00e9l\u00e8ve de Terminale avec les filtres actuels."}
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {classementMissions.length ? (
            <div
              style={{
                background: "white",
                border: "1px solid #E2E8F0",
                borderRadius: 12,
                padding: "10px 12px",
                marginBottom: 6,
              }}
            >
              <p style={{ margin: "0 0 8px", color: "#0F172A", fontWeight: 800, fontSize: "0.82rem" }}>
                {"Classement automatique Missions (eleves actifs sur la periode)"}
              </p>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.78rem", minWidth: 520 }}>
                  <thead>
                    <tr style={{ background: "#F8FAFC", color: "#475569" }}>
                      <th style={th}>Rang</th>
                      <th style={{ ...th, textAlign: "left" }}>Eleve</th>
                      <th style={th}>Exercices</th>
                      <th style={th}>Moyenne /10</th>
                      <th style={th}>Notions OK</th>
                      <th style={th}>Urgence Bac</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classementMissions.map((row, idx) => (
                      <tr key={row.id} style={{ borderTop: "1px solid #F1F5F9" }}>
                        <td style={{ ...td, fontWeight: 800 }}>
                          {idx === 0 ? "??" : idx === 1 ? "??" : idx === 2 ? "??" : `#${idx + 1}`}
                        </td>
                        <td style={{ ...td, textAlign: "left", fontWeight: 700 }}>{row.nom}</td>
                        <td style={td}>{row.exos}</td>
                        <td style={td}>{row.moyenne.toFixed(2)}</td>
                        <td style={td}>{row.ok}</td>
                        <td style={{ ...td, color: row.urgent > 0 ? "#B91C1C" : "#059669", fontWeight: 800 }}>{row.urgent}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}
          {rowsWithReports.map(({ eleve, report }) => (
            <div
              key={eleve.id}
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
                alignItems: "center",
                padding: "12px 14px",
                borderRadius: 12,
                background: "white",
                border: "1px solid #E2E8F0",
              }}
            >
              <div style={{ flex: 1, minWidth: 200 }}>
                <p style={{ margin: 0, fontWeight: 800, color: "#0F172A" }}>{eleve.nomAffiche}</p>
                <p style={{ margin: "4px 0 0", fontSize: "0.75rem", color: "#64748B" }}>
                  {report.hasData
                    ? `${report.exerciseRows.length} exo. \u00b7 OK ${report.notionsOk.length} \u00b7 \u00c0 consolider ${report.notionsPasOk.length} \u00b7 Urgence ${report.notionsUrgent.length}`
                    : "Aucune 1re tentative sur la p\u00e9riode"}
                </p>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                <CountPill label="OK" value={report.notionsOk.length} color="#059669" bg="#ECFDF5" />
                <CountPill label="Sous B" value={report.notionsPasOk.length} color="#B45309" bg="#FFFBEB" />
                <CountPill label="Urgence" value={report.notionsUrgent.length} color="#DC2626" bg="#FEF2F2" />
              </div>
              <button
                type="button"
                disabled={!report.hasData || exportingId === eleve.id}
                onClick={() => void handleExport({ eleve, report })}
                style={{
                  padding: "8px 14px",
                  borderRadius: 10,
                  border: "none",
                  background: report.hasData ? "#2563EB" : "#CBD5E1",
                  color: "white",
                  fontWeight: 800,
                  fontSize: "0.8rem",
                  cursor: report.hasData ? "pointer" : "not-allowed",
                  fontFamily: "'Fredoka One', cursive",
                }}
              >
                {exportingId === eleve.id ? "PDF..." : "Export PDF"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CountPill({ label, value, color, bg }) {
  return (
    <span
      style={{
        borderRadius: 999,
        padding: "4px 10px",
        fontSize: "0.72rem",
        fontWeight: 800,
        color,
        background: bg,
        border: `1px solid ${color}33`,
      }}
    >
      {label} {value}
    </span>
  );
}

const th = {
  padding: "7px 8px",
  textAlign: "center",
  fontWeight: 800,
  borderBottom: "1px solid #E2E8F0",
};

const td = {
  padding: "7px 8px",
  textAlign: "center",
};
