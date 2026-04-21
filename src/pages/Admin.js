import { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { doc, setDoc, collection, getDocs, deleteDoc, updateDoc } from "firebase/firestore";
import * as XLSX from "xlsx";

const COLORS = {
  S: "#3B82F6", T: "#7C3AED", M: "#F97316",
  G: "#10B981", H: "#EF4444", U: "#F59E0B", B: "#06B6D4",
};

const EMOJI_PAR_MATIERE = {
  "Management": "🏪", "Droit": "⚖️", "Economie": "📊",
  "Sciences de Gestion": "💻", "Marketing": "📣",
  "Ressources Humaines": "👥", "Gestion Finance": "💰",
};

const familleColors = {
  Architecte: "#3B82F6", Visionnaire: "#7C3AED",
  Challenger: "#F97316", Explorateur: "#10B981", Influenceur: "#EF4444",
};

const familleEmojis = {
  Architecte: "🧠", Visionnaire: "🎨",
  Challenger: "⚡", Explorateur: "🔬", Influenceur: "🔥",
};

const RECOMPENSES_INDIVIDUEL = [
  { rang: 1, label: "🥇 1er", xp: 200, couleur: "#F59E0B" },
  { rang: 2, label: "🥈 2ème", xp: 150, couleur: "#9CA3AF" },
  { rang: 3, label: "🥉 3ème", xp: 100, couleur: "#CD7F32" },
  { rang: 4, label: "4ème", xp: 75, couleur: "#3B82F6" },
  { rang: 5, label: "5ème", xp: 50, couleur: "#3B82F6" },
];

const RECOMPENSES_FAMILLE = [
  { rang: 1, label: "🥇 1ère", xp: 150, couleur: "#F59E0B" },
  { rang: 2, label: "🥈 2ème", xp: 100, couleur: "#9CA3AF" },
  { rang: 3, label: "🥉 3ème", xp: 75, couleur: "#CD7F32" },
  { rang: 4, label: "4ème", xp: 50, couleur: "#3B82F6" },
  { rang: 5, label: "5ème", xp: 25, couleur: "#3B82F6" },
];

const col = (row, ...keys) => {
  for (const k of keys) {
    if (row[k] !== undefined && row[k] !== null && row[k] !== "") return row[k];
  }
  return "";
};

const splitMotsCles = (valeur) => {
  if (!valeur) return [];
  return String(valeur)
    .split(/[|,;/]/)
    .map(m => m.trim())
    .filter(Boolean);
};

const compterCartesTotal = (cartes = {}) => Object.values(cartes).reduce((sum, n) => sum + (Number(n) || 0), 0);
const compterCartesUniques = (cartes = {}) => Object.values(cartes).filter(n => (Number(n) || 0) > 0).length;

export default function Admin() {
  const [fichierChapitres, setFichierChapitres] = useState(null);
  const [importChapitres, setImportChapitres] = useState({ loading: false, succes: 0, erreurs: 0, message: "" });
  const [fichierMissions, setFichierMissions] = useState(null);
  const [importMissions, setImportMissions] = useState({ loading: false, succes: 0, erreurs: 0, message: "" });
  const [xpMessage, setXpMessage] = useState("");
  const [eleves, setEleves] = useState([]);
  const [chargementEleves, setChargementEleves] = useState(false);
  const [recompenseEnCours, setRecompenseEnCours] = useState(false);
  const [messagesRecompense, setMessagesRecompense] = useState([]);
  const [xpCustom, setXpCustom] = useState({});
  const [famillesClassement, setFamillesClassement] = useState([]);
  const [erreurEleves, setErreurEleves] = useState("");

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800;900&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    chargerEleves();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const chargerEleves = async () => {
    setChargementEleves(true);
    setErreurEleves("");
    try {
      const snapshot = await getDocs(collection(db, "users"));
      const users = snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
        .filter(u => u.role !== "admin")
        .sort((a, b) => (b.xp || 0) - (a.xp || 0));
      setEleves(users);
      const famillesMap = {};
      users.forEach(u => {
        if (!u.famille) return;
        if (!famillesMap[u.famille]) famillesMap[u.famille] = { nom: u.famille, xp: 0, membres: 0 };
        famillesMap[u.famille].xp += (u.xp || 0);
        famillesMap[u.famille].membres += 1;
      });
      setFamillesClassement(Object.values(famillesMap).sort((a, b) => b.xp - a.xp));
      const initXp = {};
      users.forEach((u, i) => { initXp[u.id] = RECOMPENSES_INDIVIDUEL[i]?.xp || 0; });
      setXpCustom(initXp);
    } catch (err) {
      console.error(err);
      setErreurEleves("Impossible de charger les élèves (droits Firestore ou connexion).");
    }
    setChargementEleves(false);
  };

  const distribuerXPIndividuel = async (userId, xp, prenom) => {
    if (!xp || xp <= 0) return;
    setRecompenseEnCours(true);
    try {
      const snap = await getDocs(collection(db, "users"));
      const user = snap.docs.find(d => d.id === userId);
      if (!user) return;
      await updateDoc(doc(db, "users", userId), { xp: (user.data().xp || 0) + xp });
      setMessagesRecompense(prev => [...prev, `✅ +${xp} XP → ${prenom}`]);
      await chargerEleves();
    } catch { setMessagesRecompense(prev => [...prev, `❌ Erreur pour ${prenom}`]); }
    setRecompenseEnCours(false);
  };

  const distribuerXPFamille = async (famille, xpParMembre) => {
    if (!xpParMembre || xpParMembre <= 0) return;
    setRecompenseEnCours(true);
    try {
      const snapshot = await getDocs(collection(db, "users"));
      const membres = snapshot.docs.filter(d => d.data().famille === famille);
      for (const membre of membres) {
        await updateDoc(doc(db, "users", membre.id), { xp: (membre.data().xp || 0) + xpParMembre });
      }
      setMessagesRecompense(prev => [...prev, `✅ +${xpParMembre} XP × ${membres.length} membres → Famille ${famille}`]);
      await chargerEleves();
    } catch { setMessagesRecompense(prev => [...prev, `❌ Erreur famille ${famille}`]); }
    setRecompenseEnCours(false);
  };

  const distribuerTopIndividuel = async () => {
    if (!window.confirm("Distribuer les XP bonus aux 5 premiers élèves ?")) return;
    setMessagesRecompense([]);
    for (let i = 0; i < Math.min(5, eleves.length); i++) {
      await distribuerXPIndividuel(eleves[i].id, xpCustom[eleves[i].id] ?? RECOMPENSES_INDIVIDUEL[i].xp, eleves[i].prenom);
    }
  };

  const distribuerTopFamilles = async () => {
    if (!window.confirm("Distribuer les XP bonus aux familles ?")) return;
    setMessagesRecompense([]);
    for (let i = 0; i < Math.min(5, famillesClassement.length); i++) {
      await distribuerXPFamille(famillesClassement[i].nom, RECOMPENSES_FAMILLE[i].xp);
    }
  };

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
            const id = col(row, "ID", "id") ||
              `${col(row, "Matière", "matiere")}-${col(row, "Classe", "classe")}-chap${col(row, "Ordre", "ordre")}`.toLowerCase().replace(/\s/g, "-");
            const notionsRaw = col(row, "Notions (séparées par |)", "notions");
            const competencesRaw = col(row, "Compétences (séparées par |)", "competences");
            await setDoc(doc(db, "chapitres", id), {
              matiere: col(row, "Matière", "matiere"),
              classe: col(row, "Classe", "classe"),
              ordre: parseInt(col(row, "Ordre", "ordre")) || 0,
              theme: col(row, "Thème", "theme"),
              titre: col(row, "Titre du chapitre", "titre"),
              question: col(row, "Question de gestion", "question"),
              notions: notionsRaw ? String(notionsRaw).split("|").map(n => n.trim()).filter(Boolean) : [],
              competences: competencesRaw ? String(competencesRaw).split("|").map(c => c.trim()).filter(Boolean) : [],
              url_app: col(row, "URL Application", "url_app"),
              url_fiche: col(row, "URL Fiche de révision", "url_fiche"),
              xp: parseInt(col(row, "XP", "xp")) || 50,
            });
            succes++;
          } catch (err) { erreurs++; }
        }
        setImportChapitres({ loading: false, succes, erreurs, message: `✅ ${succes} chapitres importés !` });
      } catch {
        setImportChapitres({ loading: false, succes: 0, erreurs: 1, message: "❌ Erreur de lecture du fichier" });
      }
    };
    reader.readAsArrayBuffer(fichierChapitres);
  };

  // ✅ IMPORT MISSIONS — lit aussi la colonne "correction"
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
        let succes = 0, erreurs = 0;
        for (const row of rows) {
          try {
            const id = String(col(row, "id", "ID", "Id")).trim();
            const type = String(col(row, "type", "Type")).trim().toLowerCase();
            const titre = String(col(row, "titre", "Titre", "titre mission", "Titre mission")).trim();
            if (!id || !type || !titre) { erreurs++; continue; }
            const matiere = String(col(row, "matiere", "Matière", "Matiere")).trim();
            const correction = String(col(row, "correction", "Correction", "correction_reference", "Correction référence", "Correction de référence")).trim();
            const motsClesRaw = col(row, "mots_cles", "mots-clés", "Mots-clés", "mots cles", "Mots clés");
            await setDoc(doc(db, "missions", id), {
              id, type, matiere,
              emoji: EMOJI_PAR_MATIERE[matiere] || "🎯",
              titre,
              contexte: String(col(row, "contexte", "Contexte")).trim(),
              question: String(col(row, "question", "Question")).trim(),
              mots_cles: splitMotsCles(motsClesRaw),
              correction,
              xp: parseInt(col(row, "xp", "XP")) || 25,
            });
            succes++;
          } catch { erreurs++; }
        }
        setImportMissions({ loading: false, succes, erreurs, message: `✅ ${succes} missions importées !` });
      } catch {
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

  const donnerXPMax = async () => {
    try {
      await updateDoc(doc(db, "users", auth.currentUser.uid), { xp: 99999 });
      setXpMessage("✅ 99 999 XP ajoutés ! Actualise la page.");
      setTimeout(() => setXpMessage(""), 4000);
    } catch {
      setXpMessage("❌ Erreur.");
      setTimeout(() => setXpMessage(""), 4000);
    }
  };

  const Btn = ({ children, onClick, color, disabled = false, small = false }) => (
    <button onClick={onClick} disabled={disabled} style={{
      background: disabled ? "#E5E7EB" : color,
      color: disabled ? "#9CA3AF" : "white",
      border: "none", fontFamily: "'Fredoka One', cursive",
      fontSize: small ? "0.85rem" : "1rem",
      padding: small ? "8px 16px" : "12px 24px",
      borderRadius: "14px", cursor: disabled ? "not-allowed" : "pointer",
      boxShadow: disabled ? "none" : `0 4px 15px ${color}40`,
      whiteSpace: "nowrap",
    }}>{children}</button>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#F1F5F9", fontFamily: "'Nunito', sans-serif", padding: "24px 16px" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>

        <div style={{ background: "linear-gradient(135deg, #1A1A2E, #2D1B69)", borderRadius: "24px", padding: "28px 32px", marginBottom: "32px" }}>
          <h1 style={{ fontFamily: "'Fredoka One', cursive", fontSize: "2.2rem", color: "white", margin: "0 0 4px" }}>⚙️ Administration</h1>
          <p style={{ color: "#A78BFA", margin: 0, fontSize: "0.9rem" }}>Panneau réservé au professeur — STMG HUB</p>
        </div>

        {/* RÉCOMPENSES */}
        <div style={{ background: "white", borderRadius: "24px", padding: "28px", marginBottom: "24px", border: `2px solid ${COLORS.U}20`, boxShadow: `0 4px 20px ${COLORS.U}10` }}>
          <h2 style={{ fontFamily: "'Fredoka One', cursive", fontSize: "1.5rem", color: COLORS.U, marginBottom: "8px" }}>🏆 Récompenses du jour</h2>
          <p style={{ color: "#6B7280", fontSize: "0.9rem", marginBottom: "20px" }}>Distribue des XP bonus aux meilleurs élèves et familles.</p>

          {eleves.length === 0 ? (
            <Btn onClick={chargerEleves} color={COLORS.U} disabled={chargementEleves}>
              {chargementEleves ? "⏳ Chargement..." : "📊 Charger le classement"}
            </Btn>
          ) : (
            <div>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "16px" }}>
                <div style={{ background: COLORS.U + "15", border: `1px solid ${COLORS.U}30`, borderRadius: "12px", padding: "8px 14px" }}>
                  <p style={{ fontFamily: "'Fredoka One', cursive", color: COLORS.U, margin: 0, fontSize: "0.85rem" }}>👥 Élèves inscrits : {eleves.length}</p>
                </div>
                <div style={{ background: COLORS.S + "15", border: `1px solid ${COLORS.S}30`, borderRadius: "12px", padding: "8px 14px" }}>
                  <p style={{ fontFamily: "'Fredoka One', cursive", color: COLORS.S, margin: 0, fontSize: "0.85rem" }}>
                    ⚡ XP total classe : {eleves.reduce((sum, e) => sum + (e.xp || 0), 0).toLocaleString()}
                  </p>
                </div>
                <Btn onClick={chargerEleves} color={COLORS.G} small>🔄 Actualiser les élèves</Btn>
              </div>

              <div style={{ marginBottom: "28px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "8px" }}>
                  <p style={{ fontFamily: "'Fredoka One', cursive", color: "#1A1A2E", fontSize: "1.1rem", margin: 0 }}>👤 Élèves (XP + cartes)</p>
                  <Btn onClick={distribuerTopIndividuel} color={COLORS.U} disabled={recompenseEnCours} small>🚀 Distribuer Top 5</Btn>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {eleves.map((eleve, i) => {
                    const recompense = RECOMPENSES_INDIVIDUEL[i];
                    const couleurFamille = familleColors[eleve.famille] || COLORS.S;
                    const cartesTotal = compterCartesTotal(eleve.cartes || {});
                    const cartesUniques = compterCartesUniques(eleve.cartes || {});
                    return (
                      <div key={eleve.id} style={{ background: i < 3 ? COLORS.U + "08" : "#F8FAFC", borderRadius: "16px", padding: "14px 16px", border: i < 3 ? `2px solid ${COLORS.U}30` : "2px solid #E5E7EB", display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                        <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: i < 3 ? "1.6rem" : "1rem", width: "40px", textAlign: "center" }}>
                          {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                            <p style={{ fontFamily: "'Fredoka One', cursive", color: "#1A1A2E", fontSize: "1rem", margin: 0 }}>
                              {eleve.prenom || eleve.nom || eleve.email || `Élève ${eleve.id.slice(0, 6)}`}
                            </p>
                            <span style={{ background: couleurFamille + "20", color: couleurFamille, fontFamily: "'Fredoka One', cursive", padding: "1px 10px", borderRadius: "100px", fontSize: "0.7rem" }}>
                              {familleEmojis[eleve.famille]} {eleve.famille}
                            </span>
                          </div>
                          <p style={{ color: "#9CA3AF", fontSize: "0.8rem", margin: "2px 0 0" }}>
                            {(eleve.xp || 0).toLocaleString()} XP · 🃏 {cartesTotal} cartes ({cartesUniques} uniques)
                          </p>
                        </div>
                        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                          <input type="number" value={xpCustom[eleve.id] ?? (recompense?.xp || 0)} onChange={e => setXpCustom(prev => ({ ...prev, [eleve.id]: parseInt(e.target.value) || 0 }))}
                            style={{ width: "80px", padding: "6px 10px", borderRadius: "10px", border: `2px solid ${COLORS.U}30`, fontFamily: "'Fredoka One', cursive", fontSize: "0.9rem", textAlign: "center", outline: "none" }} />
                          <span style={{ color: "#9CA3AF", fontSize: "0.8rem" }}>XP</span>
                          <Btn onClick={() => distribuerXPIndividuel(eleve.id, xpCustom[eleve.id] ?? recompense?.xp, eleve.prenom)} color={recompense ? recompense.couleur : COLORS.S} disabled={recompenseEnCours} small>
                            {recompense ? recompense.label : "+XP"}
                          </Btn>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "8px" }}>
                  <p style={{ fontFamily: "'Fredoka One', cursive", color: "#1A1A2E", fontSize: "1.1rem", margin: 0 }}>🧬 Classement Familles</p>
                  <Btn onClick={distribuerTopFamilles} color={COLORS.T} disabled={recompenseEnCours} small>🚀 Distribuer Top 5 familles</Btn>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {famillesClassement.map((famille, i) => {
                    const recompense = RECOMPENSES_FAMILLE[i];
                    const couleur = familleColors[famille.nom] || COLORS.S;
                    return (
                      <div key={famille.nom} style={{ background: i < 3 ? couleur + "08" : "#F8FAFC", borderRadius: "16px", padding: "14px 16px", border: i < 3 ? `2px solid ${couleur}30` : "2px solid #E5E7EB", display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                        <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: i < 3 ? "1.6rem" : "1rem", width: "40px", textAlign: "center" }}>
                          {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
                        </div>
                        <span style={{ fontSize: "1.6rem" }}>{familleEmojis[famille.nom]}</span>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontFamily: "'Fredoka One', cursive", color: couleur, fontSize: "1rem", margin: 0 }}>{famille.nom}</p>
                          <p style={{ color: "#9CA3AF", fontSize: "0.8rem", margin: "2px 0 0" }}>{famille.membres} membres · {famille.xp.toLocaleString()} XP total</p>
                        </div>
                        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                          <span style={{ fontFamily: "'Fredoka One', cursive", color: couleur, fontSize: "0.9rem" }}>+{recompense?.xp || 0} XP/membre</span>
                          <Btn onClick={() => distribuerXPFamille(famille.nom, recompense?.xp || 0)} color={couleur} disabled={recompenseEnCours} small>
                            {recompense ? recompense.label : "+XP"}
                          </Btn>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {messagesRecompense.length > 0 && (
                <div style={{ background: "#F0FDF4", borderRadius: "16px", padding: "16px", border: "1px solid #BBF7D0" }}>
                  <p style={{ fontFamily: "'Fredoka One', cursive", color: COLORS.G, marginBottom: "8px" }}>📋 Journal</p>
                  {messagesRecompense.map((m, i) => (
                    <p key={i} style={{ color: "#374151", fontSize: "0.85rem", margin: "2px 0" }}>{m}</p>
                  ))}
                  <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                    <Btn onClick={chargerEleves} color={COLORS.G} small>🔄 Actualiser</Btn>
                    <Btn onClick={() => setMessagesRecompense([])} color={COLORS.H} small>🗑️ Effacer</Btn>
                  </div>
                </div>
              )}
            </div>
          )}

          {erreurEleves && (
            <div style={{ marginTop: "14px", background: COLORS.H + "12", border: `1px solid ${COLORS.H}30`, borderRadius: "12px", padding: "10px 14px" }}>
              <p style={{ margin: 0, color: COLORS.H, fontFamily: "'Fredoka One', cursive", fontSize: "0.85rem" }}>{erreurEleves}</p>
            </div>
          )}
        </div>

        {/* TEST XP */}
        <div style={{ background: "white", borderRadius: "24px", padding: "28px", marginBottom: "24px", border: `2px solid ${COLORS.U}20` }}>
          <h2 style={{ fontFamily: "'Fredoka One', cursive", fontSize: "1.5rem", color: COLORS.U, marginBottom: "8px" }}>⚡ Test — XP Maximum</h2>
          <p style={{ color: "#6B7280", fontSize: "0.9rem", marginBottom: "20px" }}>Donne 99 999 XP à ton compte pour tester.</p>
          <Btn onClick={donnerXPMax} color={COLORS.U}>🚀 Donner 99 999 XP (test)</Btn>
          {xpMessage && (
            <div style={{ marginTop: "16px", padding: "14px", borderRadius: "14px", background: xpMessage.includes("✅") ? COLORS.G + "15" : COLORS.H + "15" }}>
              <p style={{ fontFamily: "'Fredoka One', cursive", color: xpMessage.includes("✅") ? COLORS.G : COLORS.H }}>{xpMessage}</p>
            </div>
          )}
        </div>

        {/* CHAPITRES */}
        <div style={{ background: "white", borderRadius: "24px", padding: "28px", marginBottom: "24px", border: `2px solid ${COLORS.S}20` }}>
          <h2 style={{ fontFamily: "'Fredoka One', cursive", fontSize: "1.5rem", color: COLORS.S, marginBottom: "8px" }}>📚 Importer les chapitres</h2>
          <p style={{ color: "#9CA3AF", fontSize: "0.8rem", marginBottom: "20px" }}>
            Colonnes : <strong>ID</strong>, <strong>Matière</strong>, <strong>Classe</strong>, <strong>Ordre</strong>, <strong>Thème</strong>, <strong>Titre du chapitre</strong>, <strong>Question de gestion</strong>, <strong>Notions (séparées par |)</strong>, <strong>Compétences (séparées par |)</strong>, <strong>URL Application</strong>, <strong>URL Fiche de révision</strong>, <strong>XP</strong>
          </p>
          <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
            <input type="file" accept=".xlsx" onChange={e => setFichierChapitres(e.target.files[0])}
              style={{ flex: 1, padding: "10px 14px", borderRadius: "12px", border: `2px solid ${COLORS.S}30`, fontFamily: "'Nunito', sans-serif", fontSize: "0.9rem" }} />
            <Btn onClick={importerChapitres} color={COLORS.S} disabled={!fichierChapitres || importChapitres.loading}>
              {importChapitres.loading ? "⏳ Import..." : "📥 Importer"}
            </Btn>
          </div>
          {importChapitres.message && (
            <div style={{ marginTop: "16px", padding: "14px", borderRadius: "14px", background: importChapitres.erreurs > 0 ? COLORS.H + "15" : COLORS.G + "15" }}>
              <p style={{ fontFamily: "'Fredoka One', cursive", color: importChapitres.erreurs > 0 ? COLORS.H : COLORS.G }}>{importChapitres.message}</p>
            </div>
          )}
        </div>

        {/* MISSIONS */}
        <div style={{ background: "white", borderRadius: "24px", padding: "28px", marginBottom: "24px", border: `2px solid ${COLORS.T}20` }}>
          <h2 style={{ fontFamily: "'Fredoka One', cursive", fontSize: "1.5rem", color: COLORS.T, marginBottom: "8px" }}>🎯 Importer les missions</h2>
          <p style={{ color: "#9CA3AF", fontSize: "0.8rem", marginBottom: "20px" }}>
            Colonnes : <strong>id</strong>, <strong>type</strong>, <strong>matiere</strong>, <strong>titre</strong>, <strong>contexte</strong>, <strong>question</strong>, <strong>mots_cles</strong>, <strong>correction</strong>, <strong>xp</strong>
          </p>
          <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
            <input type="file" accept=".xlsx" onChange={e => setFichierMissions(e.target.files[0])}
              style={{ flex: 1, padding: "10px 14px", borderRadius: "12px", border: `2px solid ${COLORS.T}30`, fontFamily: "'Nunito', sans-serif", fontSize: "0.9rem" }} />
            <Btn onClick={importerMissions} color={COLORS.T} disabled={!fichierMissions || importMissions.loading}>
              {importMissions.loading ? "⏳ Import..." : "📥 Importer"}
            </Btn>
          </div>
          {importMissions.message && (
            <div style={{ marginTop: "16px", padding: "14px", borderRadius: "14px", background: importMissions.erreurs > 0 ? COLORS.H + "15" : COLORS.G + "15" }}>
              <p style={{ fontFamily: "'Fredoka One', cursive", color: importMissions.erreurs > 0 ? COLORS.H : COLORS.G }}>{importMissions.message}</p>
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
          <h2 style={{ fontFamily: "'Fredoka One', cursive", fontSize: "1.5rem", color: COLORS.G, marginBottom: "16px" }}>💡 Informations</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[
              { emoji: "🏆", texte: "Récompenses : charge le classement → distribue les XP bonus en 1 clic", couleur: COLORS.U },
              { emoji: "📚", texte: "Chapitres : supporte les colonnes françaises avec URL Application et URL Fiche", couleur: COLORS.S },
              { emoji: "🎯", texte: "Missions : la colonne 'correction' permet à l'IA de comparer avec ta réponse de référence", couleur: COLORS.T },
              { emoji: "🏅", texte: "Les badges se débloquent automatiquement selon l'XP", couleur: COLORS.U },
              { emoji: "🃏", texte: "Les cartes sont obtenues en ouvrant des packs avec l'XP", couleur: COLORS.B },
              { emoji: "🔒", texte: "Cette page est réservée aux comptes admin", couleur: COLORS.H },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: "12px", alignItems: "center", padding: "12px 16px", borderRadius: "14px", background: item.couleur + "10", border: `1px solid ${item.couleur}20` }}>
                <span style={{ fontSize: "1.5rem" }}>{item.emoji}</span>
                <p style={{ color: "#374151", fontSize: "0.95rem", margin: 0 }}>{item.texte}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}