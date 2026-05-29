import { useAdmin } from "../AdminContext";

const AIDE_ITEMS = [
  {
    emoji: "\ud83d\udcca",
    titre: "Vue d\u2019ensemble",
    texte:
      "Indicateurs du jour : activit\u00e9, SDGN, anti-triche, temps connect\u00e9. Alertes jetons suspendus et signalements missions.",
    couleurKey: "B" as const,
  },
  {
    emoji: "\ud83d\udc65",
    titre: "\u00c9l\u00e8ves",
    texte:
      "Tableau d\u00e9taill\u00e9 : missions, Focus, cartes, ajustement jetons, reset mot de passe, r\u00e9tablir jetons si suspendus.",
    couleurKey: "S" as const,
  },
  {
    emoji: "\ud83d\udcdd",
    titre: "Examens & DS",
    texte:
      "Export PDF copies Bac, reset copies Bac (filtr\u00e9s), rapport QCM SDGN Premi\u00e8re (repasse QCM), r\u00e9visions Bac Terminale.",
    couleurKey: "G" as const,
  },
  {
    emoji: "\ud83c\udfc6",
    titre: "Jetons",
    texte: "Podium prestige : distribution de jetons bonus top 5 \u00e9l\u00e8ves et familles.",
    couleurKey: "U" as const,
  },
  {
    emoji: "\ud83d\udce5",
    titre: "Imports",
    texte: "Chapitres et missions depuis Excel ; colonne correction pour l\u2019IA Missions.",
    couleurKey: "T" as const,
  },
];

export default function AdminAidePanel() {
  const a = useAdmin();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div
        style={{
          background: "#FEF2F2",
          border: "1px solid #FECACA",
          borderRadius: 16,
          padding: 18,
        }}
      >
        <p style={{ margin: "0 0 10px", fontFamily: "'Fredoka One', cursive", color: "#991B1B", fontSize: "1rem" }}>
          {"Actions sensibles \u2014 bien les distinguer"}
        </p>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.84rem" }}>
          <thead>
            <tr style={{ background: "#FEE2E2", textAlign: "left" }}>
              <th style={{ padding: "8px 10px", borderBottom: "1px solid #FECACA" }}>{"Action"}</th>
              <th style={{ padding: "8px 10px", borderBottom: "1px solid #FECACA" }}>{"Effet"}</th>
              <th style={{ padding: "8px 10px", borderBottom: "1px solid #FECACA" }}>{"Firestore"}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: "8px 10px", fontWeight: 800 }}>{"R\u00e9tablir jetons"}</td>
              <td style={{ padding: "8px 10px" }}>{"L\u2019\u00e9l\u00e8ve regagne des jetons (Missions, jeux)"}</td>
              <td style={{ padding: "8px 10px", fontFamily: "monospace", fontSize: "0.78rem" }}>
                platformIntegrity.xpSuspended = false
              </td>
            </tr>
            <tr style={{ background: "#FFF7ED" }}>
              <td style={{ padding: "8px 10px", fontWeight: 800 }}>{"Repasse QCM"}</td>
              <td style={{ padding: "8px 10px" }}>{"Efface la tentative DS SDGN, peut refaire le QCM"}</td>
              <td style={{ padding: "8px 10px", fontFamily: "monospace", fontSize: "0.78rem" }}>
                dsTab.sdgn_premiere_qcm_v1 supprim\u00e9
              </td>
            </tr>
            <tr>
              <td style={{ padding: "8px 10px", fontWeight: 800 }}>{"Reset copies DS Bac"}</td>
              <td style={{ padding: "8px 10px" }}>{"Efface les r\u00e9ponses Objectif Bac (pas le QCM SDGN)"}</td>
              <td style={{ padding: "8px 10px", fontFamily: "monospace", fontSize: "0.78rem" }}>
                objectifBacDs.{a.DS_EXAM_ID}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{ background: "white", borderRadius: 24, padding: 24, border: `2px solid ${a.COLORS.G}20` }}>
        <h2 style={{ fontFamily: "'Fredoka One', cursive", fontSize: "1.35rem", color: a.COLORS.G, marginBottom: 16 }}>
          {"Guide des sections"}
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {AIDE_ITEMS.map((item) => {
            const c = a.COLORS[item.couleurKey];
            return (
              <div
                key={item.titre}
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "flex-start",
                  padding: "12px 16px",
                  borderRadius: 14,
                  background: c + "10",
                  border: `1px solid ${c}20`,
                }}
              >
                <span style={{ fontSize: "1.3rem" }}>{item.emoji}</span>
                <div>
                  <p style={{ margin: "0 0 4px", fontFamily: "'Fredoka One', cursive", color: c, fontSize: "0.9rem" }}>
                    {item.titre}
                  </p>
                  <p style={{ color: "#374151", fontSize: "0.92rem", margin: 0, lineHeight: 1.45 }}>{item.texte}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
