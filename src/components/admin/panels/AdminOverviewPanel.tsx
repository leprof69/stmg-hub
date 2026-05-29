import AdminBtn from "../AdminBtn";
import { useAdmin } from "../AdminContext";

function StatCard({
  label,
  value,
  sub,
  border,
  color,
}: {
  label: string;
  value: string | number;
  sub?: string;
  border: string;
  color: string;
}) {
  return (
    <div style={{ background: "white", borderRadius: 14, padding: 14, border: `1px solid ${border}` }}>
      <p style={{ margin: 0, color, fontFamily: "'Fredoka One', cursive", fontSize: "0.85rem" }}>{label}</p>
      <p style={{ margin: "4px 0 0", fontSize: "1.7rem", fontWeight: 900, color: "#0F172A" }}>{value}</p>
      {sub ? (
        <p style={{ margin: "2px 0 0", color, fontSize: "0.75rem", fontWeight: 700, opacity: 0.85 }}>{sub}</p>
      ) : null}
    </div>
  );
}

export default function AdminOverviewPanel() {
  const a = useAdmin();
  const s = a.dashboardStats;

  return (
    <>
      <div
        style={{
          marginBottom: 14,
          background: "#EFF6FF",
          border: "1px solid #BFDBFE",
          borderRadius: 14,
          padding: "14px 16px",
        }}
      >
        <p style={{ margin: "0 0 8px", fontFamily: "'Fredoka One', cursive", color: "#1E3A8A", fontSize: "0.95rem" }}>
          {"Pilotage rapide"}
        </p>
        <p style={{ margin: 0, color: "#334155", fontSize: "0.86rem", lineHeight: 1.5 }}>
          {
            "Utilise les sections du menu : \u00c9l\u00e8ves (suivi d\u00e9taill\u00e9), Examens & DS (copies Bac + QCM SDGN), Jetons (r\u00e9compenses du jour). Les filtres classe / lyc\u00e9e s\u2019appliquent partout."
          }
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
          <AdminBtn onClick={() => a.setSectionActif("eleves")} color={a.COLORS.S} small>
            {"\u2192 \u00c9l\u00e8ves"}
          </AdminBtn>
          <AdminBtn onClick={() => a.setSectionActif("examens")} color={a.COLORS.B} small>
            {"\u2192 Examens & DS"}
          </AdminBtn>
          <AdminBtn onClick={() => a.setSectionActif("jetons")} color={a.COLORS.U} small>
            {"\u2192 Jetons"}
          </AdminBtn>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
          gap: 10,
          marginBottom: 14,
        }}
      >
        <StatCard label={"\u00c9l\u00e8ves suivis"} value={s.total} border="#DBEAFE" color="#1D4ED8" />
        <StatCard label={"Actifs aujourd\u2019hui"} value={s.actifsAujourdhui} border="#A7F3D0" color="#059669" />
        <StatCard label={"Actifs 7 derniers jours"} value={s.actifs7j} border="#BFDBFE" color="#0284C7" />
        <StatCard label={"Inactifs (+7j)"} value={s.inactifs7j} border="#FECACA" color="#DC2626" />
        <StatCard label={"Actions d\u00e9tect\u00e9es aujourd\u2019hui"} value={s.actionsToday} border="#FDE68A" color="#D97706" />
        <StatCard label={"Signaux anti-triche (historique)"} value={s.suspicions} border="#FCA5A5" color="#BE123C" />
        <StatCard
          label={"Validations SDGN (jour)"}
          value={s.sdgnValidationsToday}
          sub={"exercices corrig\u00e9s aujourd\u2019hui"}
          border="#DDD6FE"
          color="#6D28D9"
        />
        <StatCard
          label={"Temps connect\u00e9 aujourd\u2019hui"}
          value={a.formatDuration(s.sessionTodaySec)}
          border="#BAE6FD"
          color="#0369A1"
        />
        <StatCard
          label={"Points participation (cartes)"}
          value={`${Number(s.participationTotal || 0).toFixed(1)} pts`}
          border="#FDE68A"
          color="#B45309"
        />
        <StatCard
          label={"\u00c9l\u00e8ves ayant fait Focus"}
          value={s.elevesFocus}
          sub={`${s.focusTodayTotal} activit\u00e9(s) Focus aujourd\u2019hui`}
          border="#BBF7D0"
          color="#15803D"
        />
      </div>

      {a.elevesJetonsSuspendus.length > 0 && (
        <div
          style={{
            marginBottom: 12,
            background: "#FFFBEB",
            border: "1px solid #FCD34D",
            borderRadius: 12,
            padding: "12px 14px",
          }}
        >
          <p style={{ margin: "0 0 6px", color: "#92400E", fontFamily: "'Fredoka One', cursive", fontSize: "0.88rem" }}>
            {"\u26a0 Jetons suspendus"}
          </p>
          <p style={{ margin: "0 0 8px", color: "#78350F", fontSize: "0.78rem", lineHeight: 1.4 }}>
            {
              "Ces \u00e9l\u00e8ves ne gagnent plus de jetons (sortie d\u2019onglet, etc.). \u00ab R\u00e9tablir jetons \u00bb ne change pas une note DS d\u00e9j\u00e0 disqualifi\u00e9e."
            }
          </p>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {a.elevesJetonsSuspendus.map((e) => (
              <button
                key={`ov-jetons-${e.id}`}
                type="button"
                onClick={() => void a.retablirJetonsAntiTriche(e.id, e.nomAffiche)}
                style={{
                  background: "#D97706",
                  color: "white",
                  border: "none",
                  borderRadius: 999,
                  padding: "6px 12px",
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                {`${e.nomAffiche} \u2014 R\u00e9tablir`}
              </button>
            ))}
          </div>
        </div>
      )}

      {a.elevesSuspects.length > 0 && (
        <div
          style={{
            marginBottom: 12,
            background: "#FFF1F2",
            border: "1px solid #FDA4AF",
            borderRadius: 12,
            padding: "12px 14px",
          }}
        >
          <p style={{ margin: "0 0 6px", color: "#9F1239", fontFamily: "'Fredoka One', cursive", fontSize: "0.88rem" }}>
            {"Signalements missions (historique)"}
          </p>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {a.elevesSuspects.map((e) => (
              <span
                key={`ov-suspect-${e.id}`}
                style={{
                  background: "#BE123C",
                  color: "white",
                  borderRadius: 999,
                  padding: "4px 9px",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                }}
              >
                {`${e.nomAffiche} \u00b7 ${e.antiCheatEvents} signalement(s)`}
              </span>
            ))}
          </div>
        </div>
      )}

      {a.statsParClasse.length > 0 && (
        <div style={{ background: "white", borderRadius: 16, padding: 16, border: "1px solid #E2E8F0", marginBottom: 12 }}>
          <p style={{ margin: "0 0 10px", fontFamily: "'Fredoka One', cursive", color: "#334155", fontSize: "0.9rem" }}>
            {"Prestige par classe"}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {a.statsParClasse.slice(0, 6).map((row) => (
              <div key={row.classe} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
                <span style={{ fontWeight: 700 }}>{row.classe}</span>
                <span style={{ color: "#64748B" }}>
                  {row.eleves} {"\u00e9l."} {"\u00b7"} {row.prestige.toLocaleString("fr-FR")} prestige
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
