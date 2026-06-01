import { useState } from "react";
import AdminReportingEleves from "../AdminReportingEleves";
import AdminFiltersBar from "../AdminFiltersBar";
import { useAdmin } from "../AdminContext";
import {
  exportParticipationPremiereCsv,
  exportParticipationPremierePdf,
} from "../../../lib/exportParticipationPremiere";

export default function AdminElevesPanel() {
  const a = useAdmin();
  const [exportingParticipation, setExportingParticipation] = useState<"csv" | "pdf" | null>(null);

  const premiereExport = {
    exporting: exportingParticipation,
    onCsv: () => {
      setExportingParticipation("csv");
      try {
        const result = exportParticipationPremiereCsv(a.reportingRows);
        a.setFlashReporting(
          `CSV t\u00e9l\u00e9charg\u00e9 : ${result.filename} (${result.count} \u00e9l\u00e8ve(s) de 1\u00e8re).`,
        );
      } catch (err) {
        console.error(err);
        a.setFlashReporting("Export CSV impossible.");
      } finally {
        setExportingParticipation(null);
      }
    },
    onPdf: () => {
      setExportingParticipation("pdf");
      void exportParticipationPremierePdf(a.reportingRows)
        .then((result) => {
          a.setFlashReporting(
            `PDF t\u00e9l\u00e9charg\u00e9 : ${result.filename} (${result.count} \u00e9l\u00e8ve(s) de 1\u00e8re).`,
          );
        })
        .catch((err) => {
          console.error(err);
          a.setFlashReporting("Export PDF impossible.");
        })
        .finally(() => setExportingParticipation(null));
    },
  };

  return (
    <div style={{ background: "white", borderRadius: 20, padding: 18, border: "1px solid #E2E8F0" }}>
      <div
        style={{
          marginBottom: 12,
          background: a.COLORS.U + "12",
          border: `1px solid ${a.COLORS.U}35`,
          borderRadius: 12,
          padding: "10px 12px",
        }}
      >
        <p style={{ margin: 0, color: "#92400E", fontSize: "0.86rem", fontWeight: 700, lineHeight: 1.45 }}>
          {
            "Tableau de suivi : activit\u00e9, missions, Focus, cartes, jetons. Actions par ligne : ajouter/retirer jetons, reset MDP, r\u00e9tablir jetons si suspendus."
          }
        </p>
      </div>

      {a.flashReporting ? (
        <div
          style={{
            marginBottom: 12,
            padding: "10px 14px",
            borderRadius: 12,
            background: a.flashReporting.startsWith("Erreur") ? "#FEE2E2" : "#DCFCE7",
            border: `1px solid ${a.flashReporting.startsWith("Erreur") ? "#FECACA" : "#86EFAC"}`,
            color: a.flashReporting.startsWith("Erreur") ? "#991B1B" : "#166534",
            fontSize: "0.88rem",
            fontWeight: 700,
          }}
        >
          {a.flashReporting}
        </div>
      ) : null}

      <AdminFiltersBar />

      <AdminReportingEleves
        rows={a.reportingFiltres}
        maxParticipation={a.maxParticipationReporting}
        triReporting={a.triReporting}
        onTriChange={a.setTriReporting}
        detailId={a.reportingDetailId}
        onToggleDetail={(id) => a.setReportingDetailId((cur) => (cur === id ? null : id))}
        quickJetons={a.quickJetons}
        onQuickJetonsChange={(id, val) => a.setQuickJetons((prev) => ({ ...prev, [id]: val }))}
        sdgnExpanded={a.sdgnExpanded}
        onToggleSdgn={(id) => a.setSdgnExpanded((prev) => ({ ...prev, [id]: !prev[id] }))}
        recompenseEnCours={a.recompenseEnCours}
        resetPwdUserId={a.resetPwdUserId}
        onAjouterJetons={(eleve) => {
          const amt = parseInt(String(a.quickJetons[eleve.id] ?? "").trim(), 10) || 0;
          if (!amt) return;
          void a.distribuerXPIndividuel(eleve.id, amt, eleve.prenom || eleve.nomAffiche);
        }}
        onRetirerJetons={(eleve) => {
          const amt = parseInt(String(a.quickJetons[eleve.id] ?? "").trim(), 10) || 0;
          if (!amt) return;
          void a.retirerXPIndividuel(eleve.id, amt, eleve.prenom || eleve.nomAffiche);
        }}
        onResetMdp={(eleve) => void a.envoyerLienResetMdp(eleve)}
        onRetablirJetons={(eleve) => void a.retablirJetonsAntiTriche(eleve.id, eleve.nomAffiche)}
        formatDateFr={a.formatDateFr}
        formatDuration={a.formatDuration}
        premiereExport={premiereExport}
      />
    </div>
  );
}
