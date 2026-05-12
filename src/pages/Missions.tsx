import { useState, useEffect, useMemo } from "react";
import { auth, db } from "../services/firebase";
import { collection, doc, getDoc, getDocs, orderBy, query, updateDoc, where } from "firebase/firestore";
import ProtectedTextarea from "../components/ProtectedTextarea";

const COLORS = {
  S: "#3B82F6",
  H: "#EF4444",
  U: "#F59E0B",
  G: "#10B981",
};

/** Même clé `matiere` que dans Firestore / import Admin ; libellé court à l’écran. */
const MATIERES_MISSIONS = [
  { matiere: "Management", label: "Management" },
  { matiere: "Économie", label: "Économie" },
  { matiere: "Droit", label: "Droit" },
  { matiere: "Sciences de Gestion", label: "SDGN" },
] as const;

type ChapitreRow = {
  id: string;
  ordre?: number;
  titre?: string;
  theme?: string;
  matiere?: string;
  classe?: string;
};

type ProfilLite = {
  classe?: string;
  role?: string;
};

type MissionsProps = {
  profil: ProfilLite;
  onXPGagne?: () => void;
};

type MissionExercise = {
  id: string;
  title: string;
  type: "Exercice" | "Etude de cas";
  difficulty: "Facile" | "Moyen" | "Difficile" | "Tres difficile";
  xp: number;
  consigne: string;
  attendu: string;
  minChars: number;
};

const MISSIONS_PROGRESS_VERSION = 1;

const SDGN_CHAP7_EXERCISES: MissionExercise[] = [
  { id: "sdgn7-e1", title: "QCM notions de base", type: "Exercice", difficulty: "Facile", xp: 120, minChars: 90, consigne: "Definis travail collaboratif, synchrone, asynchrone et TIC avec un exemple simple pour chacun.", attendu: "Definitions justes + au moins un exemple clair de situation professionnelle." },
  { id: "sdgn7-e2", title: "Classer les outils numeriques", type: "Exercice", difficulty: "Facile", xp: 140, minChars: 120, consigne: "Classe des outils (visioconference, agenda partage, wiki, drive, forum, messagerie) en communication, organisation, stockage/partage, creation partagee.", attendu: "Classement coherent des 4 categories avec justification courte." },
  { id: "sdgn7-e3", title: "Synchrone ou asynchrone", type: "Exercice", difficulty: "Facile", xp: 150, minChars: 110, consigne: "Donne 5 situations de travail et indique synchrone ou asynchrone avec une justification.", attendu: "Bon choix de modalite + argument pertinent." },
  { id: "sdgn7-e4", title: "E-communication et communaute en ligne", type: "Exercice", difficulty: "Moyen", xp: 190, minChars: 160, consigne: "Propose 3 actions d'e-communication et explique comment elles construisent une communaute en ligne utile a l'organisation.", attendu: "Actions concretes reliees a la productivite/performance." },
  { id: "sdgn7-e5", title: "Internet / Intranet / Extranet", type: "Exercice", difficulty: "Moyen", xp: 210, minChars: 150, consigne: "Explique les differences entre Internet, Intranet et Extranet puis donne un exemple d'usage pour chacun.", attendu: "Distinction nette des niveaux d'acces et des publics." },
  { id: "sdgn7-e6", title: "RSE avantages et limites", type: "Exercice", difficulty: "Moyen", xp: 230, minChars: 170, consigne: "Analyse un reseau social d'entreprise: 4 avantages, 3 risques, 3 regles de bon usage.", attendu: "Vision equilibree fluidite des echanges / securite." },
  { id: "sdgn7-e7", title: "Droits d'acces et responsabilites", type: "Exercice", difficulty: "Moyen", xp: 260, minChars: 190, consigne: "Construis une mini matrice C/M/D/C (creer, modifier, diffuser, consulter) pour 4 profils differents de l'entreprise.", attendu: "Droits coherents selon metier, utilite de l'information et confidentialite." },
  { id: "sdgn7-e8", title: "Securiser l'acces a l'information", type: "Exercice", difficulty: "Difficile", xp: 320, minChars: 220, consigne: "Suite a une fuite d'information, propose 6 mesures correctives prioritaires (authentification, droits, partages, sensibilisation...).", attendu: "Plan d'action realiste et hierarchise." },
  { id: "sdgn7-e9", title: "Intelligence collective en action", type: "Exercice", difficulty: "Difficile", xp: 360, minChars: 240, consigne: "Concois l'organisation d'un projet collaboratif a distance (outils, roles, regles, suivi) pour faire emerger l'intelligence collective.", attendu: "Lien explicite entre interactions, partage de connaissance et resolution de probleme." },
  { id: "sdgn7-e10", title: "IA et performance organisationnelle", type: "Exercice", difficulty: "Tres difficile", xp: 420, minChars: 260, consigne: "Propose 2 usages IA dans une organisation et analyse effets sur productivite, limites et conditions de reussite humain + machine.", attendu: "Approche critique, pas seulement technocentree." },
  { id: "sdgn7-cas1", title: "Etude de cas Decathlon", type: "Etude de cas", difficulty: "Tres difficile", xp: 560, minChars: 380, consigne: "Analyse le cas Decathlon: outils collaboratifs, synchro/asynchro, droits d'acces, intelligence collective. Termine par une reponse developpee argumentee.", attendu: "Mobilisation complete du chapitre 7 + argumentation structuree type bac." },
  { id: "sdgn7-cas2", title: "Etude de cas L'Oreal", type: "Etude de cas", difficulty: "Tres difficile", xp: 620, minChars: 420, consigne: "Analyse le cas L'Oreal: e-communication, extranet, securite des acces, IA et performance. Termine par une reponse developpee avec esprit critique.", attendu: "Demonstration complete avec nuances sur les limites." },
];

const getTodayKey = () => {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
};

const normalize = (value = "") =>
  String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

export default function Missions({ profil, onXPGagne }: MissionsProps) {
  const niveauxAccessibles = useMemo(
    () => (profil?.classe === "terminale" ? (["premiere", "terminale"] as const) : (["premiere"] as const)),
    [profil?.classe]
  );
  const peutChoisirClasse = profil?.role === "admin" || profil?.classe === "terminale";

  const [niveauSelectionne, setNiveauSelectionne] = useState<"premiere" | "terminale">(
    profil?.classe === "terminale" ? "terminale" : "premiere"
  );
  const [matiereSelectionnee, setMatiereSelectionnee] = useState<string>(MATIERES_MISSIONS[0].matiere);
  const [chapitres, setChapitres] = useState<ChapitreRow[]>([]);
  const [chapitreIdSelectionne, setChapitreIdSelectionne] = useState<string>("");
  const [chargementChapitres, setChargementChapitres] = useState(false);
  const [claims, setClaims] = useState<Record<string, { lastClaimDate?: string; totalClaims?: number }>>({});
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [uiMessage, setUiMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [savingId, setSavingId] = useState("");

  useEffect(() => {
    const def = profil?.classe === "terminale" ? "terminale" : "premiere";
    if (!niveauxAccessibles.includes(niveauSelectionne)) {
      setNiveauSelectionne(def);
    }
  }, [profil?.classe, niveauxAccessibles, niveauSelectionne]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setChargementChapitres(true);
      setChapitreIdSelectionne("");
      try {
        const q = query(
          collection(db, "chapitres"),
          where("matiere", "==", matiereSelectionnee),
          where("classe", "==", niveauSelectionne),
          orderBy("ordre")
        );
        const snap = await getDocs(q);
        const rows: ChapitreRow[] = snap.docs.map((d) => ({ id: d.id, ...d.data() } as ChapitreRow));
        if (!cancelled) {
          setChapitres(rows);
          if (rows.length) setChapitreIdSelectionne(rows[0].id);
        }
      } catch (e) {
        console.error(e);
        if (!cancelled) setChapitres([]);
      } finally {
        if (!cancelled) setChargementChapitres(false);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [matiereSelectionnee, niveauSelectionne]);

  useEffect(() => {
    const loadClaims = async () => {
      const user = auth.currentUser;
      if (!user) return;
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (!snap.exists()) return;
        const raw = snap.data()?.missionsProgress || {};
        const nextClaims = raw?.version === MISSIONS_PROGRESS_VERSION ? (raw.claims || {}) : {};
        setClaims(nextClaims);
      } catch (err) {
        console.error("Chargement progression missions impossible", err);
      }
    };
    void loadClaims();
  }, []);

  const chapitreActif = chapitres.find((c) => c.id === chapitreIdSelectionne) ?? null;
  const isSdgnChap7 = useMemo(() => {
    if (matiereSelectionnee !== "Sciences de Gestion") return false;
    if (!chapitreActif) return false;
    const byOrdre = chapitreActif.ordre === 7;
    const titreNorm = normalize(chapitreActif.titre || "");
    const byTitle = titreNorm.includes("chapitre 7") || titreNorm.startsWith("7");
    return byOrdre || byTitle;
  }, [chapitreActif, matiereSelectionnee]);
  const potentialXP = useMemo(
    () => (isSdgnChap7 ? SDGN_CHAP7_EXERCISES.reduce((sum, ex) => sum + ex.xp, 0) : 0),
    [isSdgnChap7]
  );

  const claimXP = async (exercise: MissionExercise) => {
    const user = auth.currentUser;
    if (!user) {
      setUiMessage({ type: "error", text: "Session expiree. Reconnecte-toi pour valider l'XP." });
      return;
    }
    const text = (answers[exercise.id] || "").trim();
    if (text.length < exercise.minChars) {
      setUiMessage({
        type: "error",
        text: `Reponse trop courte pour ${exercise.title} (${exercise.minChars} caracteres minimum).`,
      });
      return;
    }
    const today = getTodayKey();
    if (claims[exercise.id]?.lastClaimDate === today) {
      setUiMessage({ type: "error", text: "XP deja valides aujourd'hui pour cette mission." });
      return;
    }

    setSavingId(exercise.id);
    try {
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        setUiMessage({ type: "error", text: "Profil introuvable." });
        return;
      }
      const data = snap.data();
      const stored = data.missionsProgress || {};
      const prevClaims = stored?.version === MISSIONS_PROGRESS_VERSION ? (stored.claims || {}) : {};
      if (prevClaims[exercise.id]?.lastClaimDate === today) {
        setUiMessage({ type: "error", text: "XP deja valides aujourd'hui pour cette mission." });
        return;
      }
      const nextClaims = {
        ...prevClaims,
        [exercise.id]: {
          lastClaimDate: today,
          totalClaims: (prevClaims[exercise.id]?.totalClaims || 0) + 1,
        },
      };
      await updateDoc(ref, {
        xp: (data.xp || 0) + exercise.xp,
        missionsProgress: {
          ...(stored || {}),
          version: MISSIONS_PROGRESS_VERSION,
          chapter: "SDGN Chapitre 7",
          claims: nextClaims,
        },
      });
      setClaims(nextClaims);
      setUiMessage({ type: "success", text: `Mission validee: +${exercise.xp} XP.` });
      if (onXPGagne) onXPGagne();
    } catch (err) {
      console.error("Validation XP mission impossible", err);
      setUiMessage({ type: "error", text: "Validation impossible pour le moment." });
    } finally {
      setSavingId("");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F1F5F9", fontFamily: "'Nunito', sans-serif" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "24px 16px" }}>
        <div
          style={{
            background: "linear-gradient(135deg, #0B2447, #0369A1)",
            borderRadius: "24px",
            padding: "28px 32px",
            marginBottom: "24px",
          }}
        >
          <h1 style={{ fontFamily: "'Fredoka One', cursive", fontSize: "2.2rem", color: "white", margin: "0 0 8px" }}>
            Missions
          </h1>
          <p style={{ color: "#BAE6FD", margin: 0, fontSize: "0.9rem" }}>
            Choix du niveau, de la matière puis du chapitre (même arborescence que l’onglet Chapitres).
          </p>
        </div>

        <div style={{ background: "white", borderRadius: "16px", border: "2px solid #E5E7EB", padding: "16px", marginBottom: "20px" }}>
          <p style={{ fontFamily: "'Fredoka One', cursive", color: "#111827", fontSize: "0.95rem", margin: "0 0 14px" }}>
            Filtres
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
            <div style={{ borderRadius: "12px", border: `2px solid ${COLORS.S}30`, padding: "10px 12px" }}>
              <p style={{ fontFamily: "'Fredoka One', cursive", color: COLORS.S, fontSize: "0.78rem", margin: "0 0 6px" }}>
                Niveau
              </p>
              {peutChoisirClasse ? (
                <select
                  value={niveauSelectionne}
                  onChange={(e) => setNiveauSelectionne(e.target.value as "premiere" | "terminale")}
                  style={{
                    width: "100%",
                    border: `2px solid ${COLORS.S}35`,
                    borderRadius: "10px",
                    padding: "8px 10px",
                    fontFamily: "'Nunito', sans-serif",
                    fontWeight: 700,
                    color: "#1F2937",
                    background: "white",
                  }}
                >
                  {niveauxAccessibles.map((nv) => (
                    <option key={nv} value={nv}>
                      {nv === "terminale" ? "Terminale STMG" : "Première STMG"}
                    </option>
                  ))}
                </select>
              ) : (
                <p style={{ margin: 0, fontWeight: 700, color: "#1F2937" }}>Première STMG</p>
              )}
            </div>

            <div style={{ borderRadius: "12px", border: `2px solid ${COLORS.U}30`, padding: "10px 12px" }}>
              <p style={{ fontFamily: "'Fredoka One', cursive", color: COLORS.U, fontSize: "0.78rem", margin: "0 0 6px" }}>
                Matière
              </p>
              <select
                value={matiereSelectionnee}
                onChange={(e) => setMatiereSelectionnee(e.target.value)}
                style={{
                  width: "100%",
                  border: `2px solid ${COLORS.U}35`,
                  borderRadius: "10px",
                  padding: "8px 10px",
                  fontFamily: "'Nunito', sans-serif",
                  fontWeight: 700,
                  color: "#1F2937",
                  background: "white",
                }}
              >
                {MATIERES_MISSIONS.map((m) => (
                  <option key={m.matiere} value={m.matiere}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ borderRadius: "12px", border: `2px solid ${COLORS.G}30`, padding: "10px 12px" }}>
              <p style={{ fontFamily: "'Fredoka One', cursive", color: COLORS.G, fontSize: "0.78rem", margin: "0 0 6px" }}>
                Chapitre
              </p>
              <select
                value={chapitreIdSelectionne}
                onChange={(e) => setChapitreIdSelectionne(e.target.value)}
                disabled={chargementChapitres || chapitres.length === 0}
                style={{
                  width: "100%",
                  border: `2px solid ${COLORS.G}35`,
                  borderRadius: "10px",
                  padding: "8px 10px",
                  fontFamily: "'Nunito', sans-serif",
                  fontWeight: 700,
                  color: "#1F2937",
                  background: "white",
                  opacity: chargementChapitres || chapitres.length === 0 ? 0.6 : 1,
                }}
              >
                {chapitres.length === 0 && !chargementChapitres ? (
                  <option value="">Aucun chapitre pour ce couple niveau / matière</option>
                ) : (
                  chapitres.map((ch) => (
                    <option key={ch.id} value={ch.id}>
                      Chap. {ch.ordre ?? "?"} — {ch.titre || ch.id}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>
        </div>

        <div
          style={{
            textAlign: "center",
            padding: "24px",
            background: "white",
            borderRadius: "24px",
            border: isSdgnChap7 ? "2px solid #C7D2FE" : "2px dashed #CBD5E1",
          }}
        >
          {!isSdgnChap7 ? (
            <>
              <p style={{ fontFamily: "'Fredoka One', cursive", fontSize: "1.35rem", color: "#64748B", margin: "0 0 12px" }}>
                Exercices a venir
              </p>
              <p style={{ color: "#94A3B8", fontSize: "0.95rem", margin: 0, maxWidth: "520px", marginLeft: "auto", marginRight: "auto" }}>
                Selectionne SDGN + chapitre 7 pour afficher les 10 exercices progressifs et 2 etudes de cas avec XP elevee.
              </p>
            </>
          ) : (
            <div style={{ textAlign: "left" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "12px" }}>
                <p style={{ fontFamily: "'Fredoka One', cursive", fontSize: "1.2rem", color: "#1E3A8A", margin: 0 }}>
                  SDGN - Chapitre 7: Missions complete
                </p>
                <span style={{ background: "#DCFCE7", color: "#166534", borderRadius: 999, padding: "6px 10px", fontWeight: 800, fontSize: 12 }}>
                  Potentiel: +{potentialXP} XP
                </span>
              </div>
              <p style={{ color: "#475569", margin: "0 0 12px", fontSize: "0.92rem" }}>
                Anti-triche active sur les zones de reponse (copier/coller, menu contextuel et glisser-deposer bloques).
              </p>
              {uiMessage && (
                <div
                  style={{
                    marginBottom: 12,
                    borderRadius: 10,
                    padding: "10px 12px",
                    fontWeight: 700,
                    border: `1px solid ${uiMessage.type === "success" ? "#86EFAC" : "#FECACA"}`,
                    color: uiMessage.type === "success" ? "#166534" : "#991B1B",
                    background: uiMessage.type === "success" ? "#DCFCE7" : "#FEF2F2",
                  }}
                >
                  {uiMessage.text}
                </div>
              )}
              <div style={{ display: "grid", gap: "12px" }}>
                {SDGN_CHAP7_EXERCISES.map((exercise, index) => {
                  const answer = answers[exercise.id] || "";
                  const alreadyClaimed = claims[exercise.id]?.lastClaimDate === getTodayKey();
                  const canClaim = answer.trim().length >= exercise.minChars && !alreadyClaimed && savingId !== exercise.id;
                  return (
                    <article
                      key={exercise.id}
                      style={{
                        background: "#F8FAFC",
                        border: "1px solid #E2E8F0",
                        borderLeft: `6px solid ${exercise.type === "Etude de cas" ? "#DC2626" : "#2563EB"}`,
                        borderRadius: 12,
                        padding: 12,
                      }}
                    >
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 6 }}>
                        <span style={{ background: "#DBEAFE", color: "#1D4ED8", borderRadius: 999, padding: "4px 9px", fontWeight: 700, fontSize: 12 }}>
                          {index + 1}. {exercise.type}
                        </span>
                        <span style={{ background: "#FEF3C7", color: "#92400E", borderRadius: 999, padding: "4px 9px", fontWeight: 700, fontSize: 12 }}>
                          {exercise.difficulty}
                        </span>
                        <span style={{ background: "#DCFCE7", color: "#166534", borderRadius: 999, padding: "4px 9px", fontWeight: 700, fontSize: 12 }}>
                          +{exercise.xp} XP
                        </span>
                      </div>
                      <p style={{ margin: "0 0 6px", fontWeight: 800, color: "#0F172A" }}>{exercise.title}</p>
                      <p style={{ margin: "0 0 6px", color: "#334155", lineHeight: 1.5 }}>
                        <strong>Consigne:</strong> {exercise.consigne}
                      </p>
                      <p style={{ margin: "0 0 8px", color: "#0F766E", fontSize: 13, lineHeight: 1.5 }}>
                        <strong>Attendu:</strong> {exercise.attendu}
                      </p>
                      <ProtectedTextarea
                        value={answer}
                        onChange={(e) => setAnswers((prev) => ({ ...prev, [exercise.id]: e.target.value }))}
                        placeholder="Ecris ta reponse ici..."
                        enableProtection
                        onBlockedAction={() =>
                          setUiMessage({
                            type: "error",
                            text: "Action bloquee: anti-triche active sur cette zone.",
                          })
                        }
                        style={{
                          width: "100%",
                          minHeight: 120,
                          borderRadius: 10,
                          border: "1px solid #CBD5E1",
                          padding: "10px",
                          resize: "vertical",
                          boxSizing: "border-box",
                          fontFamily: "'Nunito', sans-serif",
                        }}
                      />
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap", marginTop: 8 }}>
                        <p style={{ margin: 0, color: "#64748B", fontSize: 12 }}>
                          {answer.trim().length} caracteres / {exercise.minChars} minimum
                        </p>
                        <button
                          onClick={() => void claimXP(exercise)}
                          disabled={!canClaim}
                          style={{
                            border: "none",
                            borderRadius: 10,
                            padding: "8px 12px",
                            fontWeight: 800,
                            cursor: canClaim ? "pointer" : "not-allowed",
                            background: canClaim ? "#2563EB" : "#CBD5E1",
                            color: "white",
                          }}
                        >
                          {alreadyClaimed ? "XP deja pris aujourd'hui" : savingId === exercise.id ? "Validation..." : `Valider +${exercise.xp} XP`}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
