// @ts-nocheck
import { Fragment } from "react";
import { PARTICIPATION_BARME, participationNiveau, participationNoteSur20 } from "../../lib/adminParticipation";
import { formatJetons } from "../../lib/jetons";
import { scoreToMissionLetterGrade } from "../../lib/missionGrades";
import { getPrestigeTotal } from "../../services/userProfileService";

const thStyle = {
  padding: "10px 12px",
  fontWeight: 800,
  fontSize: "0.72rem",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  color: "#475569",
  background: "#F8FAFC",
  borderBottom: "2px solid #E2E8F0",
  whiteSpace: "nowrap",
};

export default function AdminReportingEleves({
  rows,
  maxParticipation,
  triReporting,
  onTriChange,
  detailId,
  onToggleDetail,
  quickJetons,
  onQuickJetonsChange,
  sdgnExpanded,
  onToggleSdgn,
  recompenseEnCours,
  resetPwdUserId,
  onAjouterJetons,
  onRetirerJetons,
  onResetMdp,
  onRetablirJetons,
  formatDateFr,
  formatDuration,
}) {
  if (!rows.length) {
    return (
      <p style={{ margin: 0, color: "#64748B", fontSize: "0.92rem" }}>
        {"Aucun \u00e9l\u00e8ve ne correspond aux filtres."}
      </p>
    );
  }

  return (
    <div>
      <div
        style={{
          marginBottom: 12,
          padding: "12px 14px",
          borderRadius: 12,
          background: "linear-gradient(135deg,#FFFBEB,#FEF3C7)",
          border: "1px solid #FDE68A",
        }}
      >
        <p style={{ margin: "0 0 6px", fontFamily: "'Fredoka One', cursive", color: "#92400E", fontSize: "0.88rem" }}>
          {"\u2605 Note de participation (collection cartes)"}
        </p>
        <p style={{ margin: "0 0 8px", color: "#78350F", fontSize: "0.78rem", lineHeight: 1.45 }}>
          {"Chaque carte "}
          <strong>{"Rare ou plus"}</strong>
          {
            " poss\u00e9d\u00e9e ajoute des points (une fois par type de carte, pas par doublon). La note "
          }
          <strong>{"/20"}</strong>
          {" est relative au meilleur score du groupe filtr\u00e9."}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {PARTICIPATION_BARME.map((b) => (
            <span
              key={b.rarete}
              style={{
                background: "white",
                border: "1px solid #FDE68A",
                borderRadius: 8,
                padding: "4px 8px",
                fontSize: "0.72rem",
                fontWeight: 700,
                color: "#92400E",
              }}
            >
              {b.rarete} +{b.pts} pt
            </span>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", marginBottom: 10 }}>
        <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#475569" }}>{"Trier par"}</label>
        <select
          value={triReporting}
          onChange={(e) => onTriChange(e.target.value)}
          style={{ padding: "8px 10px", borderRadius: 10, border: "1px solid #CBD5E1", fontSize: "0.85rem" }}
        >
          <option value="activite">{"Derni\u00e8re activit\u00e9"}</option>
          <option value="participation">{"Participation (points)"}</option>
          <option value="participation_note">{"Note participation /20"}</option>
          <option value="nom">{"Pr\u00e9nom A \u2192 Z"}</option>
          <option value="sdgn">{"Missions SDGN"}</option>
          <option value="jetons">{"Solde jetons"}</option>
        </select>
        <span style={{ fontSize: "0.78rem", color: "#64748B" }}>
          {rows.length}
          {" \u00e9l\u00e8ve(s) affich\u00e9(s)"}
        </span>
      </div>

      <div style={{ overflowX: "auto", borderRadius: 14, border: "1px solid #E2E8F0", background: "white" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem", minWidth: 920 }}>
          <thead>
            <tr>
              <th style={{ ...thStyle, textAlign: "left" }}>{"\u00c9l\u00e8ve"}</th>
              <th style={thStyle}>Participation</th>
              <th style={thStyle}>{"Note /20"}</th>
              <th style={thStyle}>Cartes</th>
              <th style={thStyle}>SDGN</th>
              <th style={thStyle}>Focus</th>
              <th style={thStyle}>{"Temps jour"}</th>
              <th style={thStyle}>Jetons</th>
              <th style={thStyle}>{"Activit\u00e9"}</th>
              <th style={{ ...thStyle, width: 48 }} />
            </tr>
          </thead>
          <tbody>
            {rows.map((eleve) => {
              const pts = Number(eleve.participationPoints) || 0;
              const niveau = participationNiveau(pts);
              const note20 = participationNoteSur20(pts, maxParticipation);
              const open = detailId === eleve.id;
              const actif =
                eleve.joursSansActivite === 0
                  ? { label: "Aujourd'hui", color: "#059669" }
                  : eleve.joursSansActivite !== null && eleve.joursSansActivite <= 7
                    ? { label: `${eleve.joursSansActivite}j`, color: "#0284C7" }
                    : {
                        label: eleve.joursSansActivite === null ? "?" : `${eleve.joursSansActivite}j`,
                        color: "#DC2626",
                      };

              return (
                <Fragment key={eleve.id}>
                  <tr
                    style={{
                      borderTop: "1px solid #F1F5F9",
                      background: open
                        ? "#F8FAFC"
                        : eleve.platformIntegrity?.xpSuspended
                          ? "#FFF1F2"
                          : "white",
                      cursor: "pointer",
                    }}
                    onClick={() => onToggleDetail(eleve.id)}
                  >
                    <td style={{ padding: "10px 12px", verticalAlign: "middle" }}>
                      <p style={{ margin: 0, fontWeight: 800, color: "#0F172A" }}>{eleve.nomAffiche}</p>
                      <p style={{ margin: "2px 0 0", fontSize: "0.72rem", color: "#64748B" }}>
                        {eleve.classe === "premiere"
                          ? "1\u00e8re"
                          : eleve.classe === "terminale"
                            ? "Tle"
                            : eleve.classe || "\u2014"}
                        {" \u00b7 "}
                        {eleve.lycee || "\u2014"}
                      </p>
                    </td>
                    <td style={{ padding: "10px 12px", textAlign: "center", verticalAlign: "middle" }}>
                      <span
                        style={{
                          display: "inline-block",
                          borderRadius: 999,
                          padding: "4px 10px",
                          fontWeight: 800,
                          fontSize: "0.8rem",
                          color: niveau.color,
                          background: niveau.bg,
                          border: `1px solid ${niveau.color}33`,
                        }}
                      >
                        {pts.toFixed(1)} pt
                      </span>
                      <p style={{ margin: "3px 0 0", fontSize: "0.68rem", color: niveau.color, fontWeight: 700 }}>
                        {niveau.label}
                      </p>
                    </td>
                    <td
                      style={{
                        padding: "10px 12px",
                        textAlign: "center",
                        verticalAlign: "middle",
                        fontWeight: 900,
                        color: "#B45309",
                        fontSize: "1rem",
                      }}
                    >
                      {note20}/20
                    </td>
                    <td style={{ padding: "10px 12px", textAlign: "center", verticalAlign: "middle" }}>
                      {eleve.cartesUniques}{" "}
                      <span style={{ color: "#94A3B8", fontSize: "0.72rem" }}>({eleve.cartesTotal})</span>
                    </td>
                    <td style={{ padding: "10px 12px", textAlign: "center", verticalAlign: "middle" }}>
                      {eleve.sdgnExerciseCount || 0}
                      {eleve.sdgnClaimsToday > 0 ? (
                        <span style={{ display: "block", fontSize: "0.68rem", color: "#6D28D9", fontWeight: 700 }}>
                          +{eleve.sdgnClaimsToday} j.
                        </span>
                      ) : null}
                    </td>
                    <td style={{ padding: "10px 12px", textAlign: "center", verticalAlign: "middle" }}>
                      {eleve.focusTotal || 0}
                    </td>
                    <td style={{ padding: "10px 12px", textAlign: "center", verticalAlign: "middle", whiteSpace: "nowrap" }}>
                      {formatDuration(eleve.sessionTodaySec)}
                    </td>
                    <td
                      style={{
                        padding: "10px 12px",
                        textAlign: "center",
                        verticalAlign: "middle",
                        fontWeight: 800,
                        color: eleve.platformIntegrity?.xpSuspended ? "#B45309" : "#1D4ED8",
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {formatJetons(eleve.xp || 0)}
                      {eleve.platformIntegrity?.xpSuspended ? (
                        <button
                          type="button"
                          onClick={() => onRetablirJetons(eleve)}
                          style={{
                            display: "block",
                            margin: "4px auto 0",
                            padding: "3px 8px",
                            borderRadius: 8,
                            border: "none",
                            background: "#D97706",
                            color: "white",
                            fontSize: "0.65rem",
                            fontWeight: 800,
                            cursor: "pointer",
                          }}
                        >
                          {"R\u00e9tablir jetons"}
                        </button>
                      ) : null}
                    </td>
                    <td style={{ padding: "10px 12px", textAlign: "center", verticalAlign: "middle" }}>
                      <span style={{ color: actif.color, fontWeight: 800, fontSize: "0.78rem" }}>{actif.label}</span>
                    </td>
                    <td style={{ padding: "10px 8px", textAlign: "center", verticalAlign: "middle", color: "#64748B", fontSize: "0.9rem" }}>
                      {open ? "\u25bc" : "\u25b6"}
                    </td>
                  </tr>
                  {open ? (
                    <tr key={`${eleve.id}-detail`}>
                      <td colSpan={10} style={{ padding: 0, background: "#F8FAFC", borderTop: "1px dashed #CBD5E1" }}>
                        <div style={{ padding: "14px 16px 16px" }} onClick={(e) => e.stopPropagation()}>
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                              gap: 10,
                              marginBottom: 12,
                            }}
                          >
                            <MetricBox
                              label="Prestige (classement)"
                              value={`${getPrestigeTotal(eleve).toLocaleString("fr-FR")}`}
                              accent="#7C3AED"
                            />
                            <MetricBox
                              label="Participation"
                              value={`${pts.toFixed(1)} pts \u00b7 ${niveau.label}`}
                              accent="#B45309"
                            />
                            <MetricBox label="Note participation" value={`${note20} / 20`} accent="#D97706" />
                            <MetricBox label={"Derni\u00e8re activit\u00e9"} value={formatDateFr(eleve.lastActivity)} accent="#0369A1" />
                          </div>

                          <p style={{ margin: "0 0 6px", fontSize: "0.75rem", color: "#64748B", fontWeight: 700 }}>
                            {"Aujourd'hui"}
                          </p>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
                            {eleve.actionsToday.map((action, ai) => (
                              <span
                                key={ai}
                                style={{
                                  background: action === "Aucune action d\u00e9tect\u00e9e" ? "#F1F5F9" : "#DBEAFE",
                                  color: action === "Aucune action d\u00e9tect\u00e9e" ? "#64748B" : "#1D4ED8",
                                  borderRadius: 999,
                                  padding: "4px 10px",
                                  fontSize: "0.74rem",
                                  fontWeight: 700,
                                }}
                              >
                                {action}
                              </span>
                            ))}
                          </div>

                          {eleve.missionInsights?.exerciseCount ? (
                            <div style={{ marginBottom: 12 }}>
                              <div
                                style={{
                                  display: "grid",
                                  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                                  gap: 10,
                                  marginBottom: 10,
                                }}
                              >
                                <MissionProfileList
                                  title={"\u2605 Points forts (synth\u00e8se)"}
                                  items={eleve.missionInsights.pointsForts}
                                  emptyHint={
                                    eleve.missionInsights.hasFeedback
                                      ? "Synth\u00e8se en cours \u2014 relance une correction r\u00e9cente."
                                      : "Disponible apr\u00e8s la prochaine correction d'exercice."
                                  }
                                  accent="#059669"
                                  bg="#ECFDF5"
                                  border="#A7F3D0"
                                />
                                <MissionProfileList
                                  title={"\u26a0 Lacunes \u00e0 travailler"}
                                  items={eleve.missionInsights.pointsFaibles}
                                  emptyHint={
                                    eleve.missionInsights.hasFeedback
                                      ? "Aucune lacune r\u00e9currente d\u00e9tect\u00e9e pour l'instant."
                                      : "Disponible apr\u00e8s la prochaine correction d'exercice."
                                  }
                                  accent="#B45309"
                                  bg="#FFFBEB"
                                  border="#FDE68A"
                                />
                              </div>

                              <button
                                type="button"
                                onClick={() => onToggleSdgn(eleve.id)}
                                style={{
                                  background: "#F5F3FF",
                                  border: "1px solid #C4B5FD",
                                  borderRadius: 10,
                                  padding: "8px 12px",
                                  fontWeight: 800,
                                  fontSize: "0.78rem",
                                  cursor: "pointer",
                                  fontFamily: "'Fredoka One', cursive",
                                  color: "#5B21B6",
                                }}
                              >
                                {sdgnExpanded[eleve.id]
                                  ? "\u25bc Masquer le d\u00e9tail missions"
                                  : `\u25b6 Missions : ${eleve.missionInsights.exerciseCount} exercice(s) (SDGN + Management)`}
                              </button>
                              {sdgnExpanded[eleve.id] ? (
                                <div style={{ marginTop: 8, overflowX: "auto", borderRadius: 10, border: "1px solid #EDE9FE" }}>
                                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.72rem", minWidth: 720 }}>
                                    <thead>
                                      <tr style={{ background: "#F5F3FF", color: "#4C1D95" }}>
                                        <th style={{ padding: 8, textAlign: "left" }}>Mati\u00e8re</th>
                                        <th style={{ padding: 8, textAlign: "left" }}>Ch.</th>
                                        <th style={{ padding: 8, textAlign: "left" }}>Exercice</th>
                                        <th style={{ padding: 8 }}>Note</th>
                                        <th style={{ padding: 8 }}>%</th>
                                        <th style={{ padding: 8, textAlign: "left", minWidth: 160 }}>Points forts</th>
                                        <th style={{ padding: 8, textAlign: "left", minWidth: 160 }}>Lacunes</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {eleve.missionInsights.rows.map((row) => (
                                        <tr key={row.exerciseId} style={{ borderTop: "1px solid #EDE9FE", verticalAlign: "top" }}>
                                          <td style={{ padding: 8, whiteSpace: "nowrap", fontWeight: 700 }}>{row.matiere}</td>
                                          <td style={{ padding: 8, whiteSpace: "nowrap" }}>
                                            {row.chapter.replace(/^(SDGN|Management)\s+/i, "")}
                                          </td>
                                          <td style={{ padding: 8, maxWidth: 200 }}>{row.title}</td>
                                          <td style={{ padding: 8, textAlign: "center", whiteSpace: "nowrap" }}>
                                            {row.lastScore != null ? scoreToMissionLetterGrade(row.lastScore) : "\u2014"}
                                          </td>
                                          <td style={{ padding: 8, textAlign: "center", whiteSpace: "nowrap" }}>
                                            {row.lastPercent != null ? `${row.lastPercent}%` : "\u2014"}
                                          </td>
                                          <td style={{ padding: 8, color: "#166534", lineHeight: 1.4 }}>
                                            {row.pointsForts ? (
                                              <MissionFeedbackSnippet text={row.pointsForts} />
                                            ) : (
                                              <span style={{ color: "#94A3B8" }}>{"\u2014"}</span>
                                            )}
                                          </td>
                                          <td style={{ padding: 8, color: "#9A3412", lineHeight: 1.4 }}>
                                            {row.pointsFaibles ? (
                                              <MissionFeedbackSnippet text={row.pointsFaibles} />
                                            ) : (
                                              <span style={{ color: "#94A3B8" }}>{"\u2014"}</span>
                                            )}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              ) : null}
                            </div>
                          ) : (
                            <p style={{ margin: "0 0 12px", color: "#94A3B8", fontSize: "0.8rem" }}>
                              {"Aucun exercice Missions compl\u00e9t\u00e9."}
                            </p>
                          )}

                          <div
                            style={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: 10,
                              alignItems: "center",
                              padding: 12,
                              background: "white",
                              borderRadius: 12,
                              border: "1px solid #E2E8F0",
                            }}
                          >
                            <input
                              type="number"
                              min={0}
                              placeholder="Jetons"
                              value={quickJetons[eleve.id] ?? ""}
                              onChange={(e) => onQuickJetonsChange(eleve.id, e.target.value)}
                              style={{
                                width: 88,
                                padding: "8px 10px",
                                borderRadius: 10,
                                border: "1px solid #CBD5E1",
                                textAlign: "center",
                              }}
                            />
                            <ActionBtn label="+ Ajouter" color="#059669" disabled={recompenseEnCours} onClick={() => onAjouterJetons(eleve)} />
                            <ActionBtn label="- Retirer" color="#DC2626" disabled={recompenseEnCours} onClick={() => onRetirerJetons(eleve)} />
                            <ActionBtn
                              label={resetPwdUserId === eleve.id ? "Envoi..." : "Lien MDP"}
                              color="#2563EB"
                              disabled={resetPwdUserId === eleve.id}
                              onClick={() => onResetMdp(eleve)}
                            />
                            {eleve.platformIntegrity?.xpSuspended ? (
                              <ActionBtn
                                label={"R\u00e9tablir jetons (anti-triche onglet)"}
                                color="#047857"
                                onClick={() => onRetablirJetons(eleve)}
                              />
                            ) : null}
                            <span style={{ fontSize: "0.72rem", color: "#94A3B8", marginLeft: "auto" }}>
                              {eleve.email || "email non renseign\u00e9"}
                            </span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : null}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MissionProfileList({ title, items, emptyHint, accent, bg, border }) {
  return (
    <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: 12, padding: "10px 12px" }}>
      <p style={{ margin: "0 0 8px", fontWeight: 800, fontSize: "0.78rem", color: accent, fontFamily: "'Fredoka One', cursive" }}>
        {title}
      </p>
      {items?.length ? (
        <ul style={{ margin: 0, paddingLeft: 18, color: "#334155", fontSize: "0.76rem", lineHeight: 1.45 }}>
          {items.map((item, i) => (
            <li key={i} style={{ marginBottom: 4 }}>
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ margin: 0, fontSize: "0.74rem", color: "#64748B", fontStyle: "italic" }}>{emptyHint}</p>
      )}
    </div>
  );
}

function MissionFeedbackSnippet({ text }) {
  const short = text.length > 220 ? `${text.slice(0, 217).trim()}...` : text;
  return <span title={text}>{short}</span>;
}

function MetricBox({ label, value, accent }) {
  return (
    <div style={{ background: "white", borderRadius: 10, padding: "10px 12px", border: `1px solid ${accent}33` }}>
      <p style={{ margin: 0, fontSize: "0.68rem", fontWeight: 700, color: "#64748B", textTransform: "uppercase" }}>{label}</p>
      <p style={{ margin: "4px 0 0", fontWeight: 800, color: accent, fontSize: "0.9rem" }}>{value}</p>
    </div>
  );
}

function ActionBtn({ label, color, disabled, onClick }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      style={{
        border: "none",
        borderRadius: 10,
        padding: "8px 12px",
        fontWeight: 800,
        fontSize: "0.78rem",
        cursor: disabled ? "not-allowed" : "pointer",
        background: disabled ? "#E2E8F0" : color,
        color: disabled ? "#94A3B8" : "white",
        fontFamily: "'Fredoka One', cursive",
      }}
    >
      {label}
    </button>
  );
}
