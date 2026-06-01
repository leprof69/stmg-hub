import AdminBacRevisionReport from "../AdminBacRevisionReport";
import AdminDsSdgnReport from "../AdminDsSdgnReport";
import AdminBtn from "../AdminBtn";
import AdminFiltersBar from "../AdminFiltersBar";
import { useAdmin } from "../AdminContext";

export default function AdminExamensPanel() {
  const a = useAdmin();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div
        style={{
          background: "#F0FDF4",
          border: "1px solid #86EFAC",
          borderRadius: 14,
          padding: "14px 16px",
        }}
      >
        <p style={{ margin: "0 0 6px", fontFamily: "'Fredoka One', cursive", color: "#166534", fontSize: "0.92rem" }}>
          {"Examens"}
        </p>
        <p style={{ margin: 0, color: "#14532D", fontSize: "0.84rem", lineHeight: 1.5 }}>
          {
            "Objectif Bac : copies surveillees. DS SDGN : export PDF classe (1\u00e8re et Terminale) depuis cet onglet."
          }
        </p>
      </div>

      <div style={{ background: "white", borderRadius: 20, padding: 18, border: "1px solid #E2E8F0" }}>
        <AdminFiltersBar />

        <div
          style={{
            marginBottom: 14,
            background: "#EFF6FF",
            border: "1px solid #BFDBFE",
            borderRadius: 12,
            padding: "12px 14px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <div>
            <p style={{ margin: 0, color: "#1E3A8A", fontFamily: "'Fredoka One', cursive", fontSize: "0.88rem" }}>
              {"Copies DS Objectif Bac"}
            </p>
            <p style={{ margin: "4px 0 0", color: "#1E40AF", fontSize: "0.8rem" }}>
              {`${a.dsCopiesRows.length} \u00e9l\u00e8ve(s) avec copie pour \u00ab ${a.DS_LOCK_TYPE} \u00bb (filtres actifs).`}
            </p>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <AdminBtn onClick={() => void a.exportAllDsCopiesPdf()} color={a.COLORS.S} small disabled={!a.dsCopiesRows.length}>
              {"Exporter copies (PDF)"}
            </AdminBtn>
            <AdminBtn
              onClick={() => void a.resetDsLocksForFilteredStudents()}
              color={a.COLORS.H}
              small
              disabled={a.resetDsLoading}
            >
              {a.resetDsLoading ? "\u23f3 Reset\u2026" : "Reset copies DS Bac (filtr\u00e9s)"}
            </AdminBtn>
          </div>
        </div>

        <AdminDsSdgnReport
          premiereRows={a.premiereReportingRows}
          terminaleRows={a.terminaleDsReportingRows}
          adminSelfRecord={a.adminSelfRecord}
          onBuildExportReport={a.buildDsSdgnExportReport}
          onRefreshStudents={a.chargerEleves}
        />

        <AdminBacRevisionReport terminaleRows={a.terminaleReportingRows} />
      </div>
    </div>
  );
}
