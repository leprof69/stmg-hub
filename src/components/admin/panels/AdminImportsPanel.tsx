import AdminBtn from "../AdminBtn";
import { useAdmin } from "../AdminContext";

export default function AdminImportsPanel() {
  const a = useAdmin();

  return (
    <>
      <div
        style={{
          background: "white",
          borderRadius: 24,
          padding: 24,
          marginBottom: 16,
          border: `2px solid ${a.COLORS.S}20`,
        }}
      >
        <h2 style={{ fontFamily: "'Fredoka One', cursive", fontSize: "1.35rem", color: a.COLORS.S, marginBottom: 8 }}>
          {"Importer les chapitres"}
        </h2>
        <p style={{ color: "#9CA3AF", fontSize: "0.8rem", marginBottom: 16 }}>
          {"Colonnes : ID, Mati\u00e8re, Classe, Ordre, Th\u00e8me, Titre, Question, Notions, Comp\u00e9tences, URL app, URL fiche, xp."}
        </p>
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <input
            type="file"
            accept=".xlsx"
            onChange={(e) => a.setFichierChapitres(e.target.files?.[0] ?? null)}
            style={{
              flex: 1,
              padding: "10px 14px",
              borderRadius: 12,
              border: `2px solid ${a.COLORS.S}30`,
              fontFamily: "'Nunito', sans-serif",
              fontSize: "0.9rem",
            }}
          />
          <AdminBtn
            onClick={() => void a.importerChapitres()}
            color={a.COLORS.S}
            disabled={!a.fichierChapitres || a.importChapitres.loading}
          >
            {a.importChapitres.loading ? "\u23f3 Import\u2026" : "Importer"}
          </AdminBtn>
        </div>
        {a.importChapitres.message ? (
          <div
            style={{
              marginTop: 12,
              padding: 12,
              borderRadius: 12,
              background: a.importChapitres.erreurs > 0 ? a.COLORS.H + "15" : a.COLORS.G + "15",
            }}
          >
            <p
              style={{
                fontFamily: "'Fredoka One', cursive",
                color: a.importChapitres.erreurs > 0 ? a.COLORS.H : a.COLORS.G,
                margin: 0,
              }}
            >
              {a.importChapitres.message}
            </p>
          </div>
        ) : null}
      </div>
    </>
  );
}
