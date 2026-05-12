import { useState, useEffect, useMemo } from "react";
import { db } from "../services/firebase";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";

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

export default function Missions({ profil }: MissionsProps) {
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

  const chapitreActif = chapitres.find((c) => c.id === chapitreIdSelectionne) ?? null;

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
            padding: "48px 24px",
            background: "white",
            borderRadius: "24px",
            border: "2px dashed #CBD5E1",
          }}
        >
          <p style={{ fontFamily: "'Fredoka One', cursive", fontSize: "1.35rem", color: "#64748B", margin: "0 0 12px" }}>
            Exercices à venir
          </p>
          <p style={{ color: "#94A3B8", fontSize: "0.95rem", margin: 0, maxWidth: "420px", marginLeft: "auto", marginRight: "auto" }}>
            Les missions détaillées seront branchées ici sur cette sélection
            {chapitreActif ? ` (« ${chapitreActif.titre || chapitreActif.id} »)` : ""}. Le contenu précédent a été retiré pour repartir sur de nouveaux exercices.
          </p>
        </div>
      </div>
    </div>
  );
}
