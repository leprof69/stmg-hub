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
        <p style={{ margin: "0 0 8px", fontFamily: "'Fredoka One', cursive", color: "#166534", fontSize: "0.92rem" }}>
          {"Trois actions diff\u00e9rentes \u2014 ne pas confondre"}
        </p>
        <ul style={{ margin: 0, paddingLeft: 18, color: "#14532D", fontSize: "0.84rem", lineHeight: 1.55 }}>
          <li>
            <strong>{"R\u00e9tablir jetons"}</strong>
            {" : l\u2019\u00e9l\u00e8ve peut \u00e0 nouveau gagner des jetons (Missions, jeux). Ne modifie pas une note DS."}
          </li>
          <li>
            <strong>{"Autoriser reprise"}</strong>
            {" (SDGN Premi\u00e8re) : l\u2019\u00e9l\u00e8ve continue le DS (score + r\u00e9ponses conserv\u00e9s)."}
          </li>
          <li>
            <strong>{"Cl\u00f4turer le DS"}</strong>
            {" : coupe tout le monde en cours et ferme le QCM pour la classe (notes d\u00e9j\u00e0 finies conserv\u00e9es)."}
          </li>
          <li>
            <strong>{"Repasse QCM"}</strong>
            {" : efface tout et recommence le DS \u00e0 z\u00e9ro."}
          </li>
          <li>
            <strong>{"Reset copies DS Bac"}</strong>
            {" : efface les r\u00e9ponses Objectif Bac (\u00e9preuve surveill\u00e9e), pas le QCM SDGN."}
          </li>
        </ul>
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
          usersAll={a.usersAll}
          onAfterReset={a.chargerEleves}
        />

        <AdminBacRevisionReport terminaleRows={a.terminaleReportingRows} />
      </div>
    </div>
  );
}
