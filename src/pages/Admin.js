import { useState } from "react";
import { db } from "../firebase";
import { doc, setDoc, collection, getDocs, deleteDoc } from "firebase/firestore";
import * as XLSX from "xlsx";

const COLORS = {
  S: "#3B82F6",
  T: "#7C3AED",
  M: "#F97316",
  G: "#10B981",
  H: "#EF4444",
  U: "#F59E0B",
  B: "#06B6D4",
};

const EMOJI_PAR_MATIERE = {
  "Management": "🏪",
  "Droit": "⚖️",
  "Economie": "📊",
  "Sciences de Gestion": "💻",
  "Marketing": "📣",
  "Ressources Humaines": "👥",
  "Gestion Finance": "💰",
};

export default function Admin() {
  const [fichierChapitres, setFichierChapitres] = useState(null);
  const [importChapitres, setImportChapitres] = useState({ loading: false, succes: 0, erreurs: 0, message: "" });
  const [fichierMissions, setFichierMissions] = useState(null);
  const [importMissions, setImportMissions] = useState({ loading: false, succes: 0, erreurs: 0, message: "" });

  const importerChapitres = async () => {
    if (!fichierChapitres) return;
    setImportChapitres({ loading: true, succes: 0, erreurs: 0, message: "⏳ Import en cours..." });
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet);
        let succes = 0, erreurs = 0;
        for (const row of rows) {
          try {
            const id = row.id || `${row.matiere}-${row.classe}-chap${row.ordre}`.toLowerCase().replace(/\s/g, "-");
            await setDoc(doc(db, "chapitres", id), {
              matiere: row.matiere || "",
              classe: row.classe || "",
              ordre: parseInt(row.ordre) || 0,
              theme: row.theme || "",
              titre: row.titre || "",
              question: row.question || "",
              notions: row.notions ? String(row.notions).split(",").map(n => n.trim()) : [],
              competences: row.competences ? String(row.competences).split(",").map(c => c.trim()) : [],
              url_app: row.url_app || "",
              url_fiche: row.url_fiche || "",
              xp: parseInt(row.xp) || 50,
            });
            succes++;
          } catch (err) {
            erreurs++;
          }
        }
        setImportChapitres({ loading: false, succes, erreurs, message: `✅ ${succes} chapitres importés !` });
      } catch (err) {
        setImportChapitres({ loading: false, succes: 0, erreurs: 1, message: "❌ Erreur de lecture du fichier" });
      }
    };
    reader.readAsArrayBuffer(fichierChapitres);
  };

  const importerMissions = async () => {
    if (!fichierMissions) return;
    setImportMissions({ loading: true, succes: 0, erreurs: 0, message: "⏳ Import en cours..." });
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet);

        console.log("Nombre de lignes lues :", rows.length);
        console.log("Première ligne :", JSON.stringify(rows[0]));

        let succes = 0, erreurs = 0;
        for (const row of rows) {
          try {
            console.log("Ligne :", JSON.stringify(row));
            const id = String(row.id || "").trim();
            const type = String(row.type || "").trim();
            const titre = String(row.titre || "").trim();

            if (!id || !type || !titre) {
              console.log("Ligne ignorée - champs manquants:", { id, type, titre });
              erreurs++;
              continue;
            }

            const matiere = String(row.matiere || "").trim();
            const emoji = EMOJI_PAR_MATIERE[matiere] || "🎯";

            await setDoc(doc(db, "missions", id), {
              id,
              type,
              matiere,
              emoji,
              titre,
              contexte: String(row.contexte || "").trim(),
              question: String(row.question || "").trim(),
              mots_cles: row.mots_cles ? String(row.mots_cles).split(",").map(m => m.trim()) : [],
              xp: parseInt(row.xp) || 25,
            });
            succes++;
          } catch (err) {
            console.error("Erreur ligne :", err);
            erreurs++;
          }
        }
        setImportMissions({ loading: false, succes, erreurs, message: `✅ ${succes} missions importées !` });
      } catch (err) {
        console.error("Erreur générale :", err);
        setImportMissions({ loading: false, succes: 0, erreurs: 1, message: "❌ Erreur de lecture du fichier" });
      }
    };
    reader.readAsArrayBuffer(fichierMissions);
  };

  const resetMissions = async () => {
    if (!window.confirm("Supprimer toutes les missions existantes ?")) return;
    const snapshot = await getDocs(collection(db, "missions"));
    for (const d of snapshot.docs) await deleteDoc(doc(db, "missions", d.id));
    alert("✅ Toutes les missions supprimées !");
  };

  const Btn = ({ children, onClick, color, disabled = false }) => (
    <button onClick={onClick} disabled={disabled} style={{
      background: disabled ? "#E5E7EB" : color,
      color: disabled ? "#9CA3AF" : "white",
      border: "none", fontFamily: "'Fredoka One', cursive",
      fontSize: "1rem", padding: "12px 24px",
      borderRadius: "14px", cursor: disabled ? "not-allowed" : "pointer",
      boxShadow: disabled ? "none" : `0 4px 15px ${color}40`,
    }}>
      {children}
    </button>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#F8F9FA", fontFamily: "'Nunito', sans-serif", padding: "24px 16px" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>

        <h1 style={{ fontFamily: "'Fredoka One', cursive", fontSize: "2.5rem", color: "#1A1A2E", marginBottom: "8px" }}>
          ⚙️ Administration
        </h1>
        <p style={{ color: "#6B7280", marginBottom: "32px" }}>
          Panneau d'administration STMG HUB — réservé au professeur
        </p>

        {/* CHAPITRES */}
        <div style={{ background: "white", borderRadius: "24px", padding: "28px", marginBottom: "24px", border: `2px solid ${COLORS.S}20`, boxShadow: `0 4px 20px ${COLORS.S}10` }}>
          <h2 style={{ fontFamily: "'Fredoka One', cursive", fontSize: "1.5rem", color: COLORS.S, marginBottom: "8px" }}>
            📚 Importer les chapitres
          </h2>
          <p style={{ color: "#6B7280", fontSize: "0.9rem", marginBottom: "20px" }}>
            Importe le fichier Excel des chapitres dans Firestore.
          </p>
          <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
            <input type="file" accept=".xlsx" onChange={e => setFichierChapitres(e.target.files[0])}
              style={{ flex: 1, padding: "10px 14px", borderRadius: "12px", border: `2px solid ${COLORS.S}30`, fontFamily: "'Nunito', sans-serif", fontSize: "0.9rem" }} />
            <Btn onClick={importerChapitres} color={COLORS.S} disabled={!fichierChapitres || importChapitres.loading}>
              {importChapitres.loading ? "⏳ Import..." : "📥 Importer"}
            </Btn>
          </div>
          {importChapitres.message && (
            <div style={{ marginTop: "16px", padding: "14px", borderRadius: "14px", background: importChapitres.erreurs > 0 ? COLORS.H + "15" : COLORS.G + "15", border: `1px solid ${importChapitres.erreurs > 0 ? COLORS.H : COLORS.G}30` }}>
              <p style={{ fontFamily: "'Fredoka One', cursive", color: importChapitres.erreurs > 0 ? COLORS.H : COLORS.G }}>{importChapitres.message}</p>
              {importChapitres.erreurs > 0 && <p style={{ color: "#6B7280", fontSize: "0.85rem", marginTop: "4px" }}>{importChapitres.erreurs} erreur(s)</p>}
            </div>
          )}
        </div>

        {/* MISSIONS */}
        <div style={{ background: "white", borderRadius: "24px", padding: "28px", marginBottom: "24px", border: `2px solid ${COLORS.T}20`, boxShadow: `0 4px 20px ${COLORS.T}10` }}>
          <h2 style={{ fontFamily: "'Fredoka One', cursive", fontSize: "1.5rem", color: COLORS.T, marginBottom: "8px" }}>
            🎯 Importer les missions
          </h2>
          <p style={{ color: "#6B7280", fontSize: "0.9rem", marginBottom: "20px" }}>
            Importe le fichier Excel des missions dans Firestore.
          </p>
          <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
            <input type="file" accept=".xlsx" onChange={e => setFichierMissions(e.target.files[0])}
              style={{ flex: 1, padding: "10px 14px", borderRadius: "12px", border: `2px solid ${COLORS.T}30`, fontFamily: "'Nunito', sans-serif", fontSize: "0.9rem" }} />
            <Btn onClick={importerMissions} color={COLORS.T} disabled={!fichierMissions || importMissions.loading}>
              {importMissions.loading ? "⏳ Import..." : "📥 Importer"}
            </Btn>
          </div>
          {importMissions.message && (
            <div style={{ marginTop: "16px", padding: "14px", borderRadius: "14px", background: importMissions.erreurs > 0 ? COLORS.H + "15" : COLORS.G + "15", border: `1px solid ${importMissions.erreurs > 0 ? COLORS.H : COLORS.G}30` }}>
              <p style={{ fontFamily: "'Fredoka One', cursive", color: importMissions.erreurs > 0 ? COLORS.H : COLORS.G }}>{importMissions.message}</p>
              {importMissions.erreurs > 0 && <p style={{ color: "#6B7280", fontSize: "0.85rem", marginTop: "4px" }}>{importMissions.erreurs} erreur(s)</p>}
            </div>
          )}
          <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid #F3F4F6" }}>
            <button onClick={resetMissions} style={{ background: "none", border: `1px solid ${COLORS.H}`, color: COLORS.H, fontFamily: "'Fredoka One', cursive", fontSize: "0.9rem", padding: "8px 20px", borderRadius: "12px", cursor: "pointer" }}>
              🗑️ Supprimer toutes les missions
            </button>
          </div>
        </div>

        {/* INFOS */}
        <div style={{ background: "white", borderRadius: "24px", padding: "28px", border: `2px solid ${COLORS.G}20` }}>
          <h2 style={{ fontFamily: "'Fredoka One', cursive", fontSize: "1.5rem", color: COLORS.G, marginBottom: "16px" }}>
            💡 Informations
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[
              { emoji: "📚", texte: "Chapitres : modifier le fichier Excel → réimporter", couleur: COLORS.S },
              { emoji: "🎯", texte: "Missions : modifier le fichier Excel → réimporter", couleur: COLORS.T },
              { emoji: "🔄", texte: "Les missions changent automatiquement par rotation", couleur: COLORS.M },
              { emoji: "🏅", texte: "Les badges se débloquent automatiquement selon l'XP", couleur: COLORS.U },
              { emoji: "🔒", texte: "Cette page est réservée aux comptes admin", couleur: COLORS.H },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: "12px", alignItems: "center", padding: "12px 16px", borderRadius: "14px", background: item.couleur + "10", border: `1px solid ${item.couleur}20` }}>
                <span style={{ fontSize: "1.5rem" }}>{item.emoji}</span>
                <p style={{ color: "#374151", fontSize: "0.95rem" }}>{item.texte}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}