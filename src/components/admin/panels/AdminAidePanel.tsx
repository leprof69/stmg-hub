import { useAdmin } from "../AdminContext";

const AIDE_ITEMS = [
  {
    emoji: "\ud83d\udcca",
    titre: "Vue d\u2019ensemble",
    texte: "Indicateurs du jour : activit\u00e9, temps connect\u00e9. Alertes jetons suspendus.",
    couleurKey: "B" as const,
  },
  {
    emoji: "\ud83d\udc65",
    titre: "\u00c9l\u00e8ves",
    texte:
      "Tableau d\u00e9taill\u00e9 : activit\u00e9, cartes, ajustement jetons, reset mot de passe, r\u00e9tablir jetons si suspendus.",
    couleurKey: "S" as const,
  },
  {
    emoji: "\ud83c\udfc6",
    titre: "Jetons",
    texte:
      "Podium prestige : distribution de jetons bonus top 5 \u00e9l\u00e8ves et familles. Zone dangereuse : reset de saison, nettoyage des anciennes fonctionnalit\u00e9s.",
    couleurKey: "U" as const,
  },
  {
    emoji: "\ud83d\udce5",
    titre: "Imports",
    texte: "Chapitres depuis Excel.",
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
              <td style={{ padding: "8px 10px" }}>{"L\u2019\u00e9l\u00e8ve regagne des jetons (jeux, cartes)"}</td>
              <td style={{ padding: "8px 10px", fontFamily: "monospace", fontSize: "0.78rem" }}>
                platformIntegrity.xpSuspended = false
              </td>
            </tr>
            <tr>
              <td style={{ padding: "8px 10px", fontWeight: 800, color: "#B91C1C" }}>{"R\u00e9initialiser la saison (Jetons)"}</td>
              <td style={{ padding: "8px 10px" }}>
                {"TOUS les \u00e9l\u00e8ves repartent \u00e0 0 : jetons, prestige, cartes, chapitres/missions, s\u00e9ries de connexion, classe. Lyc\u00e9e conserv\u00e9. Comptes conserv\u00e9s. Irr\u00e9versible."}
              </td>
              <td style={{ padding: "8px 10px", fontFamily: "monospace", fontSize: "0.78rem" }}>
                xp, xpDepensee, prestige*, cartes, chapitresCompletes, missionsCompletes, missionsProgress, missionsHistorique, connexions_consecutives, classe
              </td>
            </tr>
            <tr>
              <td style={{ padding: "8px 10px", fontWeight: 800, color: "#B91C1C" }}>{"Nettoyer anciennes fonctionnalit\u00e9s (Jetons)"}</td>
              <td style={{ padding: "8px 10px" }}>
                {"Supprime les donn\u00e9es orphelines des fonctionnalit\u00e9s retir\u00e9es (DS, Missions, Objectif Bac, Focus). Comptes \u00e9l\u00e8ves non affect\u00e9s autrement. Irr\u00e9versible."}
              </td>
              <td style={{ padding: "8px 10px", fontFamily: "monospace", fontSize: "0.78rem" }}>
                dsTab, objectifBacDs, objectifBacProgress, focusProgress + collections dsSdgnResults, dsSdgnNotes, missions, examConfig
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
