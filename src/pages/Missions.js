import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, updateDoc, getDoc, collection, getDocs } from "firebase/firestore";

const COLORS = {
  S: "#3B82F6",
  T: "#7C3AED",
  M: "#F97316",
  G: "#10B981",
  H: "#EF4444",
  U: "#F59E0B",
  B: "#06B6D4",
};

// Obtenir la date du jour en string
const getDateJour = () => {
  const today = new Date();
  return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
};

const getNumSemaine = () => {
  const today = new Date();
  const start = new Date(today.getFullYear(), 0, 1);
  return Math.ceil(((today - start) / 86400000 + start.getDay() + 1) / 7);
};

const getMois = () => {
  const today = new Date();
  return `${today.getFullYear()}-${today.getMonth() + 1}`;
};

// Vérifier si une mission a déjà été faite aujourd'hui/cette semaine/ce mois
const missionDejaFaite = (profil, missionId, type) => {
  const historique = profil.missionsHistorique || {};
  const entree = historique[missionId];
  if (!entree) return false;
  if (type === "quotidienne") return entree.date === getDateJour();
  if (type === "hebdomadaire") return entree.semaine === String(getNumSemaine());
  if (type === "mensuelle") return entree.mois === getMois();
  return false;
};

// Appel Groq avec détection de triche
const corrigerAvecGroq = async (mission, reponseEleve) => {
  const prompt = `Tu es un professeur de STMG bienveillant et pédagogue. Tu dois corriger la réponse d'un élève de lycée (15-18 ans).

MISSION : ${mission.titre}
MATIÈRE : ${mission.matiere}
CONTEXTE : ${mission.contexte}
QUESTION : ${mission.question}
MOTS-CLÉS ATTENDUS : ${mission.mots_cles ? mission.mots_cles.join(", ") : ""}

RÉPONSE DE L'ÉLÈVE : ${reponseEleve}

INSTRUCTIONS IMPORTANTES :
1. Si la réponse est copiée-collée d'une IA (vocabulaire trop soutenu, structure trop parfaite, expressions non scolaires comme "Il convient de noter que", "En outre", "Il est primordial") → score = 0 et indique la triche détectée.
2. Si la réponse est trop courte (moins de 3 phrases) → score maximum 4/10.
3. Si la réponse est hors sujet → score maximum 2/10.
4. Évalue de façon bienveillante comme un prof STMG. Un élève qui fait des efforts mérite au moins 3/10.
5. Réponds UNIQUEMENT en JSON sans aucun texte avant ou après.

Format JSON exact :
{"score": 7, "feedback": "Très bonne analyse en 2-3 phrases max", "points_forts": "Ce que l'élève a bien fait en 1-2 phrases", "a_ameliorer": "Ce qui manque en 1-2 phrases", "triche_detectee": false}`;

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.REACT_APP_GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 400,
    }),
  });

  const data = await response.json();
  const content = data.choices[0].message.content;
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (jsonMatch) return JSON.parse(jsonMatch[0]);
  return { score: 5, feedback: "Réponse reçue !", points_forts: "Tu as répondu !", a_ameliorer: "Continue à approfondir.", triche_detectee: false };
};

// ============================================
// COMPOSANT CARTE MISSION
// ============================================
const CarteMission = ({ mission, profil, onMissionComplete }) => {
  const [reponse, setReponse] = useState("");
  const [correction, setCorrection] = useState(null);
  const [chargement, setChargement] = useState(false);
  const [dejaFaite] = useState(missionDejaFaite(profil, mission.id, mission.type));

  const typeColors = {
    quotidienne: COLORS.S,
    hebdomadaire: COLORS.T,
    mensuelle: COLORS.U,
  };

  const typeLabels = {
    quotidienne: "⚡ Quotidienne",
    hebdomadaire: "📅 Hebdomadaire",
    mensuelle: "🏆 Mensuelle",
  };

  const couleur = typeColors[mission.type] || COLORS.S;

  const soumettre = async () => {
    if (!reponse.trim() || reponse.length < 20) return;
    setChargement(true);
    try {
      const result = await corrigerAvecGroq(mission, reponse);

      // Sauvegarde dans Firestore avec date
      const user = auth.currentUser;
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const userData = userDoc.data();
      const xpGagne = result.triche_detectee ? 0 : Math.round((result.score / 10) * mission.xp);
      const newXP = (userData.xp || 0) + xpGagne;

      // Historique avec date/semaine/mois
      const historique = userData.missionsHistorique || {};
      historique[mission.id] = {
        date: getDateJour(),
        semaine: String(getNumSemaine()),
        mois: getMois(),
        score: result.score,
        xpGagne,
      };

      await updateDoc(doc(db, "users", user.uid), {
        xp: newXP,
        missionsHistorique: historique,
      });

      setCorrection({ ...result, xpGagne });
      onMissionComplete(xpGagne);
    } catch (err) {
      console.error(err);
      setCorrection({ score: 0, feedback: "Erreur de connexion à l'IA. Réessaie !", points_forts: "", a_ameliorer: "", triche_detectee: false, xpGagne: 0 });
    }
    setChargement(false);
  };

  return (
    <div style={{
      background: "white", borderRadius: "24px", padding: "28px",
      border: `2px solid ${couleur}20`,
      boxShadow: `0 4px 20px ${couleur}15`,
      marginBottom: "20px",
    }}>
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px", flexWrap: "wrap", gap: "8px" }}>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <span style={{ background: couleur, color: "white", fontFamily: "'Fredoka One', cursive", padding: "4px 16px", borderRadius: "100px", fontSize: "0.85rem" }}>
            {typeLabels[mission.type]}
          </span>
          <span style={{ background: couleur + "15", color: couleur, fontFamily: "'Fredoka One', cursive", padding: "4px 16px", borderRadius: "100px", fontSize: "0.85rem", border: `1px solid ${couleur}30` }}>
            +{mission.xp} XP
          </span>
        </div>
        <span style={{ fontSize: "0.85rem", color: "#9CA3AF", fontWeight: 600 }}>{mission.matiere}</span>
      </div>

      <div style={{ display: "flex", gap: "12px", alignItems: "flex-start", marginBottom: "16px" }}>
        <span style={{ fontSize: "2.5rem", flexShrink: 0 }}>{mission.emoji || "🎯"}</span>
        <div>
          <h3 style={{ fontFamily: "'Fredoka One', cursive", fontSize: "1.3rem", color: "#1A1A2E", marginBottom: "4px" }}>{mission.titre}</h3>
          <p style={{ color: "#6B7280", fontSize: "0.9rem", lineHeight: 1.6 }}>{mission.contexte}</p>
        </div>
      </div>

      <div style={{ background: couleur + "10", borderRadius: "16px", padding: "16px", marginBottom: "16px", border: `1px solid ${couleur}20` }}>
        <p style={{ fontFamily: "'Fredoka One', cursive", color: couleur, marginBottom: "4px", fontSize: "0.9rem" }}>❓ Question</p>
        <p style={{ color: "#374151", lineHeight: 1.7 }}>{mission.question}</p>
      </div>

      {dejaFaite && !correction ? (
        <div style={{ background: COLORS.G + "15", borderRadius: "16px", padding: "16px", border: `1px solid ${COLORS.G}30`, textAlign: "center" }}>
          <p style={{ fontFamily: "'Fredoka One', cursive", color: COLORS.G, fontSize: "1.1rem" }}>✅ Mission déjà complétée !</p>
          <p style={{ color: "#6B7280", fontSize: "0.85rem", marginTop: "4px" }}>Reviens demain pour de nouvelles missions 🔥</p>
        </div>
      ) : !correction ? (
        <div>
          <textarea
            value={reponse}
            onChange={e => setReponse(e.target.value)}
            placeholder="Écris ta réponse ici avec tes propres mots... (minimum 20 caractères)"
            style={{
              width: "100%", minHeight: "120px", padding: "16px",
              borderRadius: "16px", border: `2px solid ${couleur}30`,
              fontFamily: "'Nunito', sans-serif", fontSize: "0.95rem",
              lineHeight: 1.6, resize: "vertical", outline: "none",
              boxSizing: "border-box", color: "#374151",
            }}
            onFocus={e => e.target.style.borderColor = couleur}
            onBlur={e => e.target.style.borderColor = couleur + "30"}
          />
          <p style={{ color: "#9CA3AF", fontSize: "0.8rem", marginTop: "8px" }}>
            ⚠️ Réponds avec tes propres mots — l'IA détecte les réponses copiées !
          </p>
          <button
            onClick={soumettre}
            disabled={chargement || reponse.length < 20}
            style={{
              marginTop: "12px", width: "100%",
              background: reponse.length >= 20 ? couleur : "#E5E7EB",
              color: reponse.length >= 20 ? "white" : "#9CA3AF",
              border: "none", fontFamily: "'Fredoka One', cursive",
              fontSize: "1.1rem", padding: "14px",
              borderRadius: "16px", cursor: reponse.length >= 20 ? "pointer" : "not-allowed",
              transition: "all 0.2s",
            }}>
            {chargement ? "⏳ L'IA corrige ta réponse..." : "🚀 Soumettre ma réponse"}
          </button>
        </div>
      ) : (
        <div>
          {correction.triche_detectee ? (
            <div style={{ background: COLORS.H + "15", borderRadius: "16px", padding: "20px", border: `2px solid ${COLORS.H}`, textAlign: "center" }}>
              <p style={{ fontSize: "2rem", marginBottom: "8px" }}>🚨</p>
              <p style={{ fontFamily: "'Fredoka One', cursive", color: COLORS.H, fontSize: "1.2rem", marginBottom: "8px" }}>Triche détectée !</p>
              <p style={{ color: "#374151", fontSize: "0.9rem", lineHeight: 1.6 }}>
                Ta réponse semble avoir été générée par une IA. Réponds avec tes propres mots pour gagner de l'XP !
              </p>
              <p style={{ fontFamily: "'Fredoka One', cursive", color: COLORS.H, marginTop: "12px" }}>0 XP gagnés</p>
            </div>
          ) : (
            <div style={{ background: "#F8F9FA", borderRadius: "16px", padding: "20px", border: "2px solid #E5E7EB" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <p style={{ fontFamily: "'Fredoka One', cursive", color: "#1A1A2E", fontSize: "1.1rem" }}>📝 Correction de l'IA</p>
                <div style={{
                  background: correction.score >= 7 ? COLORS.G : correction.score >= 5 ? COLORS.U : COLORS.H,
                  color: "white", fontFamily: "'Fredoka One', cursive",
                  padding: "8px 20px", borderRadius: "100px", fontSize: "1.2rem",
                }}>
                  {correction.score}/10
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ background: COLORS.G + "15", borderRadius: "12px", padding: "14px", border: `1px solid ${COLORS.G}30` }}>
                  <p style={{ fontFamily: "'Fredoka One', cursive", color: COLORS.G, fontSize: "0.9rem", marginBottom: "4px" }}>✅ Points forts</p>
                  <p style={{ color: "#374151", fontSize: "0.9rem", lineHeight: 1.6 }}>{correction.points_forts}</p>
                </div>
                <div style={{ background: COLORS.U + "15", borderRadius: "12px", padding: "14px", border: `1px solid ${COLORS.U}30` }}>
                  <p style={{ fontFamily: "'Fredoka One', cursive", color: COLORS.U, fontSize: "0.9rem", marginBottom: "4px" }}>💡 À améliorer</p>
                  <p style={{ color: "#374151", fontSize: "0.9rem", lineHeight: 1.6 }}>{correction.a_ameliorer}</p>
                </div>
                <div style={{ background: couleur + "10", borderRadius: "12px", padding: "14px", border: `1px solid ${couleur}20` }}>
                  <p style={{ fontFamily: "'Fredoka One', cursive", color: couleur, fontSize: "0.9rem", marginBottom: "4px" }}>💬 Feedback général</p>
                  <p style={{ color: "#374151", fontSize: "0.9rem", lineHeight: 1.6 }}>{correction.feedback}</p>
                </div>
              </div>
              <div style={{ textAlign: "center", marginTop: "16px", padding: "16px", background: "white", borderRadius: "12px", border: "1px solid #E5E7EB" }}>
                <p style={{ fontFamily: "'Fredoka One', cursive", color: COLORS.U, fontSize: "1.3rem" }}>
                  🌟 +{correction.xpGagne} XP gagnés !
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ============================================
// PAGE MISSIONS
// ============================================
export default function Missions({ profil }) {
  const [onglet, setOnglet] = useState("quotidiennes");
  const [xpGagne, setXpGagne] = useState(0);
  const [showNotif, setShowNotif] = useState(false);
  const [missions, setMissions] = useState({ quotidiennes: [], hebdomadaire: null, mensuelle: null });
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800;900&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    chargerMissions();
  }, []);

  const chargerMissions = async () => {
    try {
      const snapshot = await getDocs(collection(db, "missions"));
      const toutes = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));

      const quotidiennes = toutes.filter(m => m.type === "quotidienne");
      const hebdomadaires = toutes.filter(m => m.type === "hebdomadaire");
      const mensuelles = toutes.filter(m => m.type === "mensuelle");

      // Rotation par date
      const dayIndex = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
      const weekIndex = Math.floor(Date.now() / (1000 * 60 * 60 * 24 * 7));
      const monthIndex = new Date().getMonth();

      const missionsJour = quotidiennes.length >= 3
        ? [0, 1, 2].map(i => quotidiennes[(dayIndex + i) % quotidiennes.length])
        : quotidiennes.slice(0, 3);

      const missionHebdo = hebdomadaires.length > 0
        ? hebdomadaires[weekIndex % hebdomadaires.length]
        : null;

      const missionMensuelle = mensuelles.length > 0
        ? mensuelles[monthIndex % mensuelles.length]
        : null;

      setMissions({ quotidiennes: missionsJour, hebdomadaire: missionHebdo, mensuelle: missionMensuelle });
    } catch (err) {
      console.error(err);
    }
    setChargement(false);
  };

  const handleMissionComplete = (xp) => {
    setXpGagne(xp);
    setShowNotif(true);
    setTimeout(() => setShowNotif(false), 3000);
  };

  const missionsHistorique = profil.missionsHistorique || {};
  const quotidiennesCompletes = missions.quotidiennes.filter(m =>
    m && missionDejaFaite(profil, m.id, "quotidienne")
  ).length;

  return (
    <div style={{ minHeight: "100vh", background: "#F8F9FA", fontFamily: "'Nunito', sans-serif" }}>

      {/* NOTIF XP */}
      {showNotif && (
        <div style={{
          position: "fixed", top: "80px", right: "24px", zIndex: 100,
          background: COLORS.U, color: "white",
          fontFamily: "'Fredoka One', cursive", fontSize: "1.2rem",
          padding: "16px 24px", borderRadius: "20px",
          boxShadow: `0 8px 30px ${COLORS.U}50`,
        }}>
          🌟 +{xpGagne} XP gagnés !
        </div>
      )}

      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "24px 16px" }}>

        {/* HEADER */}
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontFamily: "'Fredoka One', cursive", fontSize: "2.5rem", color: "#1A1A2E", marginBottom: "8px" }}>
            🎯 Mes Missions
          </h1>
          <p style={{ color: "#6B7280", fontSize: "1rem" }}>
            Des situations réelles à analyser avec les notions du cours STMG !
          </p>
        </div>

        {/* PROGRESS QUOTIDIEN */}
        <div style={{
          background: "white", borderRadius: "20px", padding: "20px",
          marginBottom: "24px", border: `2px solid ${COLORS.S}20`,
          display: "flex", alignItems: "center", gap: "20px",
        }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: "'Fredoka One', cursive", color: "#1A1A2E", marginBottom: "8px" }}>
              ⚡ Missions quotidiennes — {quotidiennesCompletes}/3 complétées
            </p>
            <div style={{ background: "#F3F4F6", borderRadius: "100px", height: "10px" }}>
              <div style={{
                height: "100%", borderRadius: "100px", background: COLORS.S,
                width: `${(quotidiennesCompletes / 3) * 100}%`, transition: "width 0.5s",
              }} />
            </div>
          </div>
          <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: "1.8rem", color: COLORS.U }}>
            {quotidiennesCompletes === 3 ? "🏆" : `${quotidiennesCompletes}/3`}
          </div>
        </div>

        {/* ONGLETS */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
          {[
            { id: "quotidiennes", label: "⚡ Quotidiennes", couleur: COLORS.S },
            { id: "hebdomadaire", label: "📅 Hebdomadaire", couleur: COLORS.T },
            { id: "mensuelle", label: "🏆 Mensuelle", couleur: COLORS.U },
          ].map(tab => (
            <button key={tab.id} onClick={() => setOnglet(tab.id)}
              style={{
                background: onglet === tab.id ? tab.couleur : "white",
                color: onglet === tab.id ? "white" : tab.couleur,
                border: `2px solid ${tab.couleur}`,
                fontFamily: "'Fredoka One', cursive", fontSize: "1rem",
                padding: "10px 20px", borderRadius: "14px", cursor: "pointer",
                transition: "all 0.2s",
                boxShadow: onglet === tab.id ? `0 4px 15px ${tab.couleur}40` : "none",
              }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* CONTENU */}
        {chargement ? (
          <div style={{ textAlign: "center", padding: "60px", color: "#6B7280" }}>
            <p style={{ fontFamily: "'Fredoka One', cursive", fontSize: "1.5rem" }}>⏳ Chargement des missions...</p>
          </div>
        ) : (
          <>
            {onglet === "quotidiennes" && (
              <div>
                <p style={{ color: "#9CA3AF", fontSize: "0.85rem", marginBottom: "20px" }}>
                  🔄 Ces missions changent chaque jour à minuit
                </p>
                {missions.quotidiennes.length === 0 ? (
                  <p style={{ textAlign: "center", color: "#9CA3AF", padding: "40px" }}>Aucune mission disponible pour le moment 🎯</p>
                ) : (
                  missions.quotidiennes.map((mission, i) => (
                    <CarteMission key={mission.id} mission={mission} profil={profil} onMissionComplete={handleMissionComplete} />
                  ))
                )}
              </div>
            )}

            {onglet === "hebdomadaire" && (
              <div>
                <p style={{ color: "#9CA3AF", fontSize: "0.85rem", marginBottom: "20px" }}>
                  🔄 Cette mission change chaque lundi
                </p>
                {missions.hebdomadaire ? (
                  <CarteMission mission={missions.hebdomadaire} profil={profil} onMissionComplete={handleMissionComplete} />
                ) : (
                  <p style={{ textAlign: "center", color: "#9CA3AF", padding: "40px" }}>Aucune mission hebdomadaire disponible 📅</p>
                )}
              </div>
            )}

            {onglet === "mensuelle" && (
              <div>
                <p style={{ color: "#9CA3AF", fontSize: "0.85rem", marginBottom: "20px" }}>
                  🔄 Cette mission change le 1er de chaque mois
                </p>
                {missions.mensuelle ? (
                  <CarteMission mission={missions.mensuelle} profil={profil} onMissionComplete={handleMissionComplete} />
                ) : (
                  <p style={{ textAlign: "center", color: "#9CA3AF", padding: "40px" }}>Aucune mission mensuelle disponible 🏆</p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}