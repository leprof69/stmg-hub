import { AdminProvider, useAdmin } from "./AdminContext";
import AdminBtn from "./AdminBtn";
import AdminOverviewPanel from "./panels/AdminOverviewPanel";
import AdminElevesPanel from "./panels/AdminElevesPanel";
import AdminExamensPanel from "./panels/AdminExamensPanel";
import AdminJetonsPanel from "./panels/AdminJetonsPanel";
import AdminImportsPanel from "./panels/AdminImportsPanel";
import AdminAidePanel from "./panels/AdminAidePanel";

function AdminShell() {
  const a = useAdmin();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F1F5F9",
        fontFamily: "'Nunito', sans-serif",
        padding: "24px 16px",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div
          style={{
            background: "linear-gradient(135deg, #1E293B, #0F172A)",
            borderRadius: 24,
            padding: "26px 30px",
            marginBottom: 18,
          }}
        >
          <h1 style={{ fontFamily: "'Fredoka One', cursive", fontSize: "2rem", color: "white", margin: "0 0 4px" }}>
            {"Administration STMG HUB"}
          </h1>
          <p style={{ color: "#93C5FD", margin: 0, fontSize: "0.92rem" }}>
            {"Pilotage \u00e9l\u00e8ves, examens, jetons et contenus \u2014 interface structur\u00e9e par t\u00e2che."}
          </p>
        </div>

        <nav
          style={{
            background: "white",
            borderRadius: 16,
            border: "1px solid #E2E8F0",
            padding: 8,
            display: "flex",
            gap: 6,
            flexWrap: "wrap",
            marginBottom: 18,
            alignItems: "center",
          }}
          aria-label={"\u00c9dition admin"}
        >
          {a.ADMIN_SECTIONS.map((section) => (
            <button
              key={section.id}
              type="button"
              onClick={() => a.setSectionActif(section.id)}
              style={{
                border: "none",
                borderRadius: 999,
                padding: "8px 14px",
                cursor: "pointer",
                fontFamily: "'Nunito', sans-serif",
                fontWeight: a.sectionActif === section.id ? 800 : 600,
                fontSize: "0.84rem",
                background: a.sectionActif === section.id ? a.COLORS.S : "#F1F5F9",
                color: a.sectionActif === section.id ? "white" : "#334155",
              }}
            >
              {section.label}
            </button>
          ))}
          <AdminBtn onClick={() => void a.chargerEleves()} color={a.COLORS.G} small disabled={a.chargementEleves}>
            {a.chargementEleves ? "\u23f3 Chargement\u2026" : "Actualiser"}
          </AdminBtn>
        </nav>

        {a.erreurEleves ? (
          <div
            style={{
              marginBottom: 16,
              background: a.COLORS.H + "12",
              border: `1px solid ${a.COLORS.H}30`,
              borderRadius: 12,
              padding: "10px 14px",
            }}
          >
            <p style={{ margin: 0, color: a.COLORS.H, fontFamily: "'Fredoka One', cursive", fontSize: "0.85rem" }}>
              {a.erreurEleves}
            </p>
          </div>
        ) : null}

        {a.sectionActif === "overview" && <AdminOverviewPanel />}
        {a.sectionActif === "eleves" && <AdminElevesPanel />}
        {a.sectionActif === "examens" && <AdminExamensPanel />}
        {a.sectionActif === "jetons" && <AdminJetonsPanel />}
        {a.sectionActif === "contenus" && <AdminImportsPanel />}
        {a.sectionActif === "aide" && <AdminAidePanel />}
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <AdminProvider>
      <AdminShell />
    </AdminProvider>
  );
}
