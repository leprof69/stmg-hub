import { useState } from "react";
import AdminBtn from "../AdminBtn";
import { useAdmin } from "../AdminContext";

export default function AdminJetonsPanel() {
  const a = useAdmin();
  const [confirmationSaison, setConfirmationSaison] = useState("");
  const [confirmationNettoyage, setConfirmationNettoyage] = useState("");

  return (
    <div
      style={{
        background: "white",
        borderRadius: 24,
        padding: 24,
        border: `2px solid ${a.COLORS.U}20`,
        boxShadow: `0 4px 20px ${a.COLORS.U}10`,
      }}
    >
      <h2 style={{ fontFamily: "'Fredoka One', cursive", fontSize: "1.4rem", color: a.COLORS.U, marginBottom: 8 }}>
        {"Jetons & r\u00e9compenses du jour"}
      </h2>
      <p style={{ color: "#6B7280", fontSize: "0.9rem", marginBottom: 18 }}>
        {
          "Classement par prestige (d\u00e9penses boutique cartes). Les boutons ajoutent des jetons bonus, pas du prestige."
        }
      </p>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
        <div style={{ background: a.COLORS.U + "15", border: `1px solid ${a.COLORS.U}30`, borderRadius: 12, padding: "8px 14px" }}>
          <p style={{ fontFamily: "'Fredoka One', cursive", color: a.COLORS.U, margin: 0, fontSize: "0.85rem" }}>
            {`\ud83d\udc65 \u00c9l\u00e8ves : ${a.eleves.length}`}
          </p>
        </div>
        <div style={{ background: a.COLORS.S + "15", border: `1px solid ${a.COLORS.S}30`, borderRadius: 12, padding: "8px 14px" }}>
          <p style={{ fontFamily: "'Fredoka One', cursive", color: a.COLORS.S, margin: 0, fontSize: "0.85rem" }}>
            {`\ud83d\udc51 Prestige total : ${a.eleves.reduce((sum, e) => sum + a.getPrestigeTotal(e), 0).toLocaleString("fr-FR")}`}
          </p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14, marginBottom: 22 }}>
        <div
          style={{
            background: `linear-gradient(135deg, ${a.COLORS.U}18, ${a.COLORS.U}08)`,
            border: `2px solid ${a.COLORS.U}35`,
            borderRadius: 18,
            padding: 18,
          }}
        >
          <p style={{ fontFamily: "'Fredoka One', cursive", color: a.COLORS.U, margin: "0 0 6px", fontSize: "1.05rem" }}>
            {"Top 5 \u00e9l\u00e8ves"}
          </p>
          <p style={{ color: "#64748B", fontSize: "0.82rem", margin: "0 0 12px" }}>200 \u00b7 150 \u00b7 100 \u00b7 75 \u00b7 50 jetons</p>
          <AdminBtn
            onClick={() => void a.distribuerTopIndividuel()}
            color={a.COLORS.U}
            disabled={a.recompenseEnCours || !a.topElevesClassement.length}
          >
            {a.recompenseEnCours ? "\u23f3 Distribution\u2026" : "Distribuer aux 5 premiers"}
          </AdminBtn>
        </div>
        <div
          style={{
            background: `linear-gradient(135deg, ${a.COLORS.T}18, ${a.COLORS.T}08)`,
            border: `2px solid ${a.COLORS.T}35`,
            borderRadius: 18,
            padding: 18,
          }}
        >
          <p style={{ fontFamily: "'Fredoka One', cursive", color: a.COLORS.T, margin: "0 0 6px", fontSize: "1.05rem" }}>
            {"Top 5 familles"}
          </p>
          <p style={{ color: "#64748B", fontSize: "0.82rem", margin: "0 0 12px" }}>150 \u00b7 100 \u00b7 75 \u00b7 50 \u00b7 25 / membre</p>
          <AdminBtn
            onClick={() => void a.distribuerTopFamilles()}
            color={a.COLORS.T}
            disabled={a.recompenseEnCours || !a.topFamillesClassement.length}
          >
            {a.recompenseEnCours ? "\u23f3 Distribution\u2026" : "Distribuer aux 5 familles"}
          </AdminBtn>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16, marginBottom: 20 }}>
        <div>
          <p style={{ fontFamily: "'Fredoka One', cursive", color: "#1A1A2E", fontSize: "1rem", margin: "0 0 10px" }}>
            {"Podium \u00e9l\u00e8ves"}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {a.topElevesClassement.map((eleve, i) => {
              const recompense = a.RECOMPENSES_INDIVIDUEL[i];
              const couleurFamille = a.familleColors[eleve.famille] || a.COLORS.S;
              return (
                <div
                  key={eleve.id}
                  style={{
                    background: i < 3 ? a.COLORS.U + "08" : "#F8FAFC",
                    borderRadius: 14,
                    padding: "10px 12px",
                    border: i < 3 ? `2px solid ${a.COLORS.U}30` : "1px solid #E5E7EB",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    flexWrap: "wrap",
                  }}
                >
                  <span style={{ width: 32, textAlign: "center", fontSize: i < 3 ? "1.2rem" : "0.9rem" }}>
                    {i === 0 ? "\ud83e\udd47" : i === 1 ? "\ud83e\udd48" : i === 2 ? "\ud83e\udd49" : `#${i + 1}`}
                  </span>
                  <div style={{ flex: 1, minWidth: 120 }}>
                    <p style={{ margin: 0, fontFamily: "'Fredoka One', cursive", fontSize: "0.92rem" }}>
                      {eleve.prenom || eleve.nom || `\u00c9l\u00e8ve ${eleve.id.slice(0, 6)}`}
                    </p>
                    <p style={{ margin: "2px 0 0", color: "#9CA3AF", fontSize: "0.75rem" }}>
                      {`\ud83d\udc51 ${a.getPrestigeTotal(eleve).toLocaleString("fr-FR")} prestige \u00b7 ${a.formatJetons(eleve.xp || 0)} jetons`}
                    </p>
                  </div>
                  <input
                    type="number"
                    value={a.xpCustom[eleve.id] ?? (recompense?.xp || 0)}
                    onChange={(e) =>
                      a.setXpCustom((prev) => ({ ...prev, [eleve.id]: parseInt(e.target.value, 10) || 0 }))
                    }
                    style={{
                      width: 72,
                      padding: "6px 8px",
                      borderRadius: 10,
                      border: `2px solid ${couleurFamille}40`,
                      fontFamily: "'Fredoka One', cursive",
                      fontSize: "0.85rem",
                      textAlign: "center",
                    }}
                  />
                  <AdminBtn
                    onClick={() =>
                      void a.distribuerXPIndividuel(eleve.id, a.xpCustom[eleve.id] ?? recompense?.xp, eleve.prenom)
                    }
                    color={recompense?.couleur || a.COLORS.S}
                    disabled={a.recompenseEnCours}
                    small
                  >
                    {recompense?.label || "+jetons"}
                  </AdminBtn>
                </div>
              );
            })}
            {!a.topElevesClassement.length && (
              <p style={{ color: "#94A3B8", fontSize: "0.85rem" }}>{"Aucun \u00e9l\u00e8ve charg\u00e9."}</p>
            )}
          </div>
        </div>
        <div>
          <p style={{ fontFamily: "'Fredoka One', cursive", color: "#1A1A2E", fontSize: "1rem", margin: "0 0 10px" }}>
            {"Podium familles"}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {a.topFamillesClassement.map((famille, i) => {
              const recompense = a.RECOMPENSES_FAMILLE[i];
              const couleur = a.familleColors[famille.nom] || a.COLORS.S;
              return (
                <div
                  key={famille.nom}
                  style={{
                    background: i < 3 ? couleur + "08" : "#F8FAFC",
                    borderRadius: 14,
                    padding: "10px 12px",
                    border: i < 3 ? `2px solid ${couleur}30` : "1px solid #E5E7EB",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    flexWrap: "wrap",
                  }}
                >
                  <span style={{ width: 32, textAlign: "center" }}>
                    {i === 0 ? "\ud83e\udd47" : i === 1 ? "\ud83e\udd48" : i === 2 ? "\ud83e\udd49" : `#${i + 1}`}
                  </span>
                  <span style={{ fontSize: "1.2rem" }}>{a.familleEmojis[famille.nom]}</span>
                  <div style={{ flex: 1, minWidth: 100 }}>
                    <p style={{ margin: 0, fontFamily: "'Fredoka One', cursive", color: couleur, fontSize: "0.92rem" }}>
                      {famille.nom}
                    </p>
                    <p style={{ margin: "2px 0 0", color: "#9CA3AF", fontSize: "0.75rem" }}>
                      {`${famille.membres} membres \u00b7 ${famille.prestige.toLocaleString("fr-FR")} prestige`}
                    </p>
                  </div>
                  <span style={{ fontFamily: "'Fredoka One', cursive", fontSize: "0.8rem", color: couleur }}>
                    {a.formatJetonsDelta(recompense?.xp || 0)}/pers.
                  </span>
                  <AdminBtn
                    onClick={() => void a.distribuerXPFamille(famille.nom, recompense?.xp || 0)}
                    color={couleur}
                    disabled={a.recompenseEnCours}
                    small
                  >
                    {recompense?.label || "+jetons"}
                  </AdminBtn>
                </div>
              );
            })}
            {!a.topFamillesClassement.length && (
              <p style={{ color: "#94A3B8", fontSize: "0.85rem" }}>{"Aucune famille."}</p>
            )}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => a.setRecompensesVoirTous((v) => !v)}
        style={{
          width: "100%",
          marginBottom: 14,
          padding: "10px 14px",
          borderRadius: 12,
          border: "1px dashed #CBD5E1",
          background: "#F8FAFC",
          fontFamily: "'Fredoka One', cursive",
          color: "#475569",
          cursor: "pointer",
          fontSize: "0.88rem",
        }}
      >
        {a.recompensesVoirTous ? "\u25b2 Masquer la liste compl\u00e8te" : "\u25bc Voir tous les \u00e9l\u00e8ves"}
      </button>

      {a.recompensesVoirTous && (
        <div style={{ marginBottom: 20, maxHeight: 420, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
          {a.eleves.map((eleve, i) => {
            const recompense = a.RECOMPENSES_INDIVIDUEL[i];
            return (
              <div
                key={eleve.id}
                style={{
                  background: "#F8FAFC",
                  borderRadius: 12,
                  padding: "10px 12px",
                  border: "1px solid #E5E7EB",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  flexWrap: "wrap",
                }}
              >
                <span style={{ width: 36, textAlign: "center", fontSize: "0.8rem", color: "#64748B" }}>#{i + 1}</span>
                <div style={{ flex: 1, minWidth: 120 }}>
                  <p style={{ margin: 0, fontFamily: "'Fredoka One', cursive", fontSize: "0.88rem" }}>
                    {eleve.prenom || eleve.nom || `\u00c9l\u00e8ve ${eleve.id.slice(0, 6)}`}
                  </p>
                </div>
                <input
                  type="number"
                  value={a.xpCustom[eleve.id] ?? (recompense?.xp || 0)}
                  onChange={(e) =>
                    a.setXpCustom((prev) => ({ ...prev, [eleve.id]: parseInt(e.target.value, 10) || 0 }))
                  }
                  style={{
                    width: 72,
                    padding: "6px 8px",
                    borderRadius: 10,
                    border: `2px solid ${a.COLORS.U}30`,
                    fontFamily: "'Fredoka One', cursive",
                    fontSize: "0.85rem",
                    textAlign: "center",
                  }}
                />
                <AdminBtn
                  onClick={() =>
                    void a.distribuerXPIndividuel(eleve.id, a.xpCustom[eleve.id] ?? recompense?.xp, eleve.prenom)
                  }
                  color={recompense?.couleur || a.COLORS.S}
                  disabled={a.recompenseEnCours}
                  small
                >
                  +jetons
                </AdminBtn>
                <AdminBtn
                  onClick={() =>
                    void a.retirerXPIndividuel(eleve.id, a.xpCustom[eleve.id] ?? recompense?.xp, eleve.prenom)
                  }
                  color={a.COLORS.H}
                  disabled={a.recompenseEnCours}
                  small
                >
                  Retirer
                </AdminBtn>
              </div>
            );
          })}
        </div>
      )}

      <div
        style={{
          background: `linear-gradient(135deg, ${a.COLORS.H}12, ${a.COLORS.H}05)`,
          border: `2px solid ${a.COLORS.H}40`,
          borderRadius: 18,
          padding: 18,
          marginBottom: 20,
        }}
      >
        <p style={{ fontFamily: "'Fredoka One', cursive", color: a.COLORS.H, margin: "0 0 6px", fontSize: "1.05rem" }}>
          {"⚠️ Nouvelle saison — zone dangereuse"}
        </p>
        <p style={{ color: "#7F1D1D", fontSize: "0.85rem", margin: "0 0 14px", lineHeight: 1.5 }}>
          {
            "Remet à 0 pour TOUS les élèves (comptes conservés) : jetons, jetons dépensés, prestige, collection de cartes, chapitres/missions complétés, séries de connexion, classe (lycée conservé). Irréversible."
          }
        </p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <input
            type="text"
            value={confirmationSaison}
            onChange={(e) => setConfirmationSaison(e.target.value)}
            placeholder='Tape "RESET" pour confirmer'
            style={{
              padding: "8px 12px",
              borderRadius: 10,
              border: `2px solid ${a.COLORS.H}40`,
              fontFamily: "'Fredoka One', cursive",
              fontSize: "0.85rem",
            }}
          />
          <AdminBtn
            onClick={() => {
              void a.resetSaisonComplete();
              setConfirmationSaison("");
            }}
            color={a.COLORS.H}
            disabled={a.resetSaisonLoading || confirmationSaison.trim().toUpperCase() !== "RESET"}
          >
            {a.resetSaisonLoading ? "⏳ Réinitialisation…" : "Réinitialiser la saison"}
          </AdminBtn>
        </div>
      </div>

      <div
        style={{
          background: `linear-gradient(135deg, ${a.COLORS.H}12, ${a.COLORS.H}05)`,
          border: `2px solid ${a.COLORS.H}40`,
          borderRadius: 18,
          padding: 18,
          marginBottom: 20,
        }}
      >
        <p style={{ fontFamily: "'Fredoka One', cursive", color: a.COLORS.H, margin: "0 0 6px", fontSize: "1.05rem" }}>
          {"🧹 Nettoyer les anciennes fonctionnalités"}
        </p>
        <p style={{ color: "#7F1D1D", fontSize: "0.85rem", margin: "0 0 14px", lineHeight: 1.5 }}>
          {
            "Supprime les données orphelines laissées par DS, Missions, Objectif Bac et Focus (champs sur les comptes + collections Firestore dédiées). N'affecte ni comptes, ni jetons/prestige/cartes. Irréversible."
          }
        </p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <input
            type="text"
            value={confirmationNettoyage}
            onChange={(e) => setConfirmationNettoyage(e.target.value)}
            placeholder='Tape "NETTOYER" pour confirmer'
            style={{
              padding: "8px 12px",
              borderRadius: 10,
              border: `2px solid ${a.COLORS.H}40`,
              fontFamily: "'Fredoka One', cursive",
              fontSize: "0.85rem",
            }}
          />
          <AdminBtn
            onClick={() => {
              void a.nettoyerAnciennesFonctionnalites();
              setConfirmationNettoyage("");
            }}
            color={a.COLORS.H}
            disabled={a.nettoyageLoading || confirmationNettoyage.trim().toUpperCase() !== "NETTOYER"}
          >
            {a.nettoyageLoading ? "⏳ Nettoyage…" : "Nettoyer les données orphelines"}
          </AdminBtn>
        </div>
      </div>

      {a.messagesRecompense.length > 0 && (
        <div style={{ background: "#F0FDF4", borderRadius: 16, padding: 16, border: "1px solid #BBF7D0" }}>
          <p style={{ fontFamily: "'Fredoka One', cursive", color: a.COLORS.G, marginBottom: 8 }}>{"Journal"}</p>
          {a.messagesRecompense.map((m, i) => (
            <p key={i} style={{ color: "#374151", fontSize: "0.85rem", margin: "2px 0" }}>
              {m}
            </p>
          ))}
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <AdminBtn onClick={() => void a.chargerEleves()} color={a.COLORS.G} small>
              {"Actualiser"}
            </AdminBtn>
            <AdminBtn onClick={() => a.setMessagesRecompense([])} color={a.COLORS.H} small>
              {"Effacer"}
            </AdminBtn>
          </div>
        </div>
      )}
    </div>
  );
}
