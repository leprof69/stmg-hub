import { useState, useEffect, useRef } from "react";
import { auth, db } from "../firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { COLLECTIONS } from "../data/collections";

const RARETE_CONFIG = {
  commune:     { label: "Commune",     couleur: "#9CA3AF", emoji: "⚪" },
  peu_commune: { label: "Peu Commune", couleur: "#10B981", emoji: "🟢" },
  rare:        { label: "Rare",        couleur: "#3B82F6", emoji: "🔵" },
  epique:      { label: "Épique",      couleur: "#7C3AED", emoji: "🟣" },
  legendaire:  { label: "Légendaire",  couleur: "#F59E0B", emoji: "⭐" },
  ultra_rare:  { label: "Ultra Rare",  couleur: "#EF4444", emoji: "💎" },
};

const CGU_TEXTE = `CONDITIONS GÉNÉRALES D'UTILISATION — STMG HUB
Dernière mise à jour : avril 2025

1. QUI SOMMES-NOUS ?
STMG HUB est une plateforme éducative gamifiée destinée aux élèves de la série STMG. Elle est éditée par Khalifa SOUCI, enseignant en Management.
Contact : lelaboduprof69@gmail.com

2. DONNÉES COLLECTÉES
Dans le cadre de votre inscription, nous collectons :
- Prénom, âge, classe, spécialité, nom du lycée
- Adresse email (via Firebase Authentication)
- Résultats au quiz de personnalité et Triple Totem
- Progression pédagogique (chapitres, XP, badges, missions)

3. POURQUOI CES DONNÉES ?
Ces données sont utilisées exclusivement pour :
- Personnaliser votre expérience sur la plateforme
- Suivre votre progression pédagogique
- Établir un classement entre élèves du même lycée
- Améliorer les contenus proposés
Vos données ne sont jamais vendues ni transmises à des tiers.

4. DURÉE DE CONSERVATION
Vos données sont conservées pendant toute la durée de votre utilisation. Vous pouvez demander leur suppression à tout moment en contactant : lelaboduprof69@gmail.com

5. VOS DROITS (RGPD)
Conformément au RGPD, vous disposez des droits suivants :
- Droit d'accès, de rectification, d'effacement
- Droit à la portabilité et d'opposition
Pour exercer ces droits : lelaboduprof69@gmail.com

6. MINEURS
L'accès à STMG HUB est réservé aux personnes âgées d'au moins 13 ans.

7. HÉBERGEMENT ET SÉCURITÉ
Les données sont hébergées sur Firebase (Google Cloud), conforme aux normes européennes. Les connexions sont sécurisées par HTTPS.

8. CONTACT
Khalifa SOUCI — lelaboduprof69@gmail.com`;

const familleEmojis = {
  Architecte: "🧠", Visionnaire: "🎨",
  Challenger: "⚡", Explorateur: "🔬", Influenceur: "🔥",
};

const familleColors = {
  Architecte: "#3B82F6", Visionnaire: "#7C3AED",
  Challenger: "#F97316", Explorateur: "#10B981", Influenceur: "#EF4444",
};

const toutesCartes = COLLECTIONS.flatMap(c => c.cartes);
const cartesLegendaires = toutesCartes.filter((c) => c.rarete === "legendaire");
const DAILY_TICKET_VERSION = 3;
const SCRATCH_GRID_X = 20;
const SCRATCH_GRID_Y = 10;
const SCRATCH_TOTAL_CELLS = SCRATCH_GRID_X * SCRATCH_GRID_Y;
const SCRATCH_REVEAL_RATIO = 0.68;

const getAujourdhui = () => {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
};

const randomItem = (arr = []) => arr[Math.floor(Math.random() * arr.length)];

export default function Profil({ profil, onRefaire, onDeconnexion, onMiseAJour }) {
  const [showCGU, setShowCGU] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showJoker, setShowJoker] = useState(false);
  const [jokerUtilise, setJokerUtilise] = useState(false);
  const [chargement, setChargement] = useState(false);
  const [maCollection, setMaCollection] = useState({});
  const [vitrine, setVitrine] = useState([null, null, null]);
  const [modeChoixVitrine, setModeChoixVitrine] = useState(null); // index slot en cours
  const [message, setMessage] = useState(null);
  const [ticketJour, setTicketJour] = useState(null);
  const [revealedTicket, setRevealedTicket] = useState(false);
  const [loadingTicket, setLoadingTicket] = useState(false);
  const [scratchProgress, setScratchProgress] = useState(0);
  const canvasRef = useRef(null);
  const scratchAreaRef = useRef(null);
  const isScratchingRef = useRef(false);
  const touchedBucketsRef = useRef(new Set());

  const jokerDisponible = !profil.jokerUtilise && !jokerUtilise;
  const couleurFamille = familleColors[profil.famille] || "#7C3AED";

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800;900&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    chargerDonnees();
  }, []);

  const chargerDonnees = async () => {
    if (!auth.currentUser) return;
    const snap = await getDoc(doc(db, "users", auth.currentUser.uid));
    if (!snap.exists()) return;
    const data = snap.data();
    setMaCollection(data.cartes || {});
    setVitrine(data.vitrine || [null, null, null]);
    const today = getAujourdhui();
    const stored = data.dailyScratchTicket || null;
    if (stored && stored.date === today && stored.version === DAILY_TICKET_VERSION) {
      setTicketJour(stored);
      setRevealedTicket(Boolean(stored.claimed));
      setScratchProgress(0);
      touchedBucketsRef.current = new Set();
    } else {
      setTicketJour(null);
      setRevealedTicket(false);
      setScratchProgress(0);
      touchedBucketsRef.current = new Set();
    }
  };

  const afficherMessage = (texte, type = "success") => {
    setMessage({ texte, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const cartesPossedees = toutesCartes.filter(c => (maCollection[c.id] || 0) > 0);
  const scratchedPercent = Math.round(scratchProgress * 100);
  const ticketDisponible = !ticketJour;

  const getTicketRewardLabel = (reward) => {
    if (!reward) return "";
    if (reward.type === "xp") return `⚡ ${reward.xp} XP`;
    const carte = toutesCartes.find((c) => c.id === reward.cardId);
    if (!carte) return "🃏 Carte bonus";
    const rarete = RARETE_CONFIG[carte.rarete];
    return `${rarete?.emoji || "🃏"} ${carte.nom} (${rarete?.label || carte.rarete})`;
  };

  const genererRewardTicket = () => {
    const roll = Math.random();
    if (roll < 0.6) {
      const xpPool = [1000, 1200, 1500, 1800, 2200, 3000];
      return { type: "xp", xp: randomItem(xpPool) };
    }
    if (roll < 0.3) {
    const carteLegendaire = randomItem(cartesLegendaires);
    if (carteLegendaire) return { type: "card", cardId: carteLegendaire.id };
    }
    return { type: "xp", xp: 1500 };
  };

  const creerTicketDuJour = async () => {
    if (!auth.currentUser || loadingTicket || ticketJour) return;
    setLoadingTicket(true);
    try {
      const today = getAujourdhui();
      const snap = await getDoc(doc(db, "users", auth.currentUser.uid));
      if (!snap.exists()) return;
      const data = snap.data();
      const stored = data.dailyScratchTicket;
      if (stored && stored.date === today && stored.version === DAILY_TICKET_VERSION) {
        setTicketJour(stored);
        setRevealedTicket(Boolean(stored.claimed));
        afficherMessage("🎟️ Ticket déjà disponible aujourd’hui.");
        return;
      }
      const reward = genererRewardTicket();
      const nextTicket = { date: today, version: DAILY_TICKET_VERSION, reward, claimed: false };
      await updateDoc(doc(db, "users", auth.currentUser.uid), { dailyScratchTicket: nextTicket });
      setTicketJour(nextTicket);
      setScratchProgress(0);
      touchedBucketsRef.current = new Set();
      setRevealedTicket(false);
      afficherMessage("🎟️ Ticket du jour ajouté !");
    } catch (err) {
      afficherMessage("Erreur lors de la création du ticket.", "error");
    } finally {
      setLoadingTicket(false);
    }
  };

  const revelerTicket = async () => {
    if (!ticketJour || ticketJour.claimed || !auth.currentUser) return;
    setLoadingTicket(true);
    try {
      const ref = doc(db, "users", auth.currentUser.uid);
      const snap = await getDoc(ref);
      if (!snap.exists()) return;
      const data = snap.data();
      const currentTicket = data.dailyScratchTicket;
      if (!currentTicket || currentTicket.date !== getAujourdhui() || currentTicket.version !== DAILY_TICKET_VERSION || currentTicket.claimed) {
        setTicketJour(currentTicket || null);
        setRevealedTicket(Boolean(currentTicket?.claimed));
        return;
      }

      const reward = currentTicket.reward;
      const updates = {
        dailyScratchTicket: { ...currentTicket, claimed: true },
      };

      if (reward?.type === "xp") {
        updates.xp = (data.xp || 0) + (reward.xp || 0);
      } else if (reward?.type === "card") {
        const cartes = { ...(data.cartes || {}) };
        cartes[reward.cardId] = (cartes[reward.cardId] || 0) + 1;
        updates.cartes = cartes;
        setMaCollection(cartes);
      }

      await updateDoc(ref, updates);
      setTicketJour({ ...currentTicket, claimed: true });
      setRevealedTicket(true);
      afficherMessage(`🎉 Récompense débloquée: ${getTicketRewardLabel(reward)}`);
      if (onMiseAJour) onMiseAJour();
    } catch (err) {
      afficherMessage("Erreur lors de l'ouverture du ticket.", "error");
    } finally {
      setLoadingTicket(false);
    }
  };

  const drawScratch = (clientX, clientY) => {
    if (!canvasRef.current || !scratchAreaRef.current || !ticketJour || revealedTicket || ticketJour.claimed) return;
    const rect = scratchAreaRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    if (x < 0 || y < 0 || x > rect.width || y > rect.height) return;

    const ctx = canvasRef.current.getContext("2d");
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, Math.PI * 2);
    ctx.fill();

    const bucketX = Math.floor((x / rect.width) * SCRATCH_GRID_X);
    const bucketY = Math.floor((y / rect.height) * SCRATCH_GRID_Y);
    const key = `${bucketX}-${bucketY}`;
    if (!touchedBucketsRef.current.has(key)) {
      touchedBucketsRef.current.add(key);
      setScratchProgress(Math.min(1, touchedBucketsRef.current.size / SCRATCH_TOTAL_CELLS));
    }
  };

  useEffect(() => {
    if (!ticketJour || revealedTicket || ticketJour.claimed) return;
    if (scratchProgress >= SCRATCH_REVEAL_RATIO) {
      revelerTicket();
    }
  }, [scratchProgress, ticketJour, revealedTicket]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!canvasRef.current || !ticketJour || revealedTicket || ticketJour.claimed) return;
    const canvas = canvasRef.current;
    const rect = scratchAreaRef.current?.getBoundingClientRect();
    const width = Math.max(280, Math.floor(rect?.width || 600));
    const height = Math.max(100, Math.floor(rect?.height || 160));
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#D1D5DB");
    gradient.addColorStop(0.5, "#9CA3AF");
    gradient.addColorStop(1, "#6B7280");
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    for (let i = 0; i < 420; i++) {
      const px = Math.random() * width;
      const py = Math.random() * height;
      const alpha = 0.08 + (Math.random() * 0.22);
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.fillRect(px, py, 1.8, 1.8);
    }
  }, [ticketJour, revealedTicket]);

  const choisirCarteVitrine = async (carte) => {
    if (modeChoixVitrine === null) return;
    const nouvelleVitrine = [...vitrine];
    // Si déjà dans vitrine → on swap
    const existeIdx = nouvelleVitrine.findIndex(v => v?.id === carte.id);
    if (existeIdx !== -1) nouvelleVitrine[existeIdx] = null;
    nouvelleVitrine[modeChoixVitrine] = { id: carte.id, nom: carte.nom, image: carte.image, rarete: carte.rarete };
    setVitrine(nouvelleVitrine);
    setModeChoixVitrine(null);
    await updateDoc(doc(db, "users", auth.currentUser.uid), { vitrine: nouvelleVitrine });
    afficherMessage("✅ Vitrine mise à jour !");
  };

  const utiliserJoker = async () => {
    setChargement(true);
    await updateDoc(doc(db, "users", auth.currentUser.uid), {
      jokerUtilise: true, famille: null,
      animalTotem: null, objetTotem: null, starTotem: null,
    });
    setJokerUtilise(true);
    setChargement(false);
    setShowJoker(false);
    onRefaire();
  };

  const familleNom = profil.famille
    ? `${familleEmojis[profil.famille]} ${profil.famille === "Architecte" ? "L'Architecte" : profil.famille === "Visionnaire" ? "Le Visionnaire" : profil.famille === "Challenger" ? "Le Challenger" : profil.famille === "Explorateur" ? "L'Explorateur" : "L'Influenceur"}`
    : "Non défini";

  return (
    <div style={{ minHeight: "100vh", background: "#F1F5F9", fontFamily: "'Nunito', sans-serif" }}>

      {message && (
        <div style={{ position: "fixed", top: "80px", right: "24px", zIndex: 100, background: message.type === "error" ? "#EF4444" : "#10B981", color: "white", fontFamily: "'Fredoka One', cursive", padding: "14px 28px", borderRadius: "16px", boxShadow: "0 8px 25px rgba(0,0,0,0.3)" }}>
          {message.texte}
        </div>
      )}

      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "24px 16px", display: "flex", flexDirection: "column", gap: "16px" }}>

        {/* HEADER */}
        <div style={{ background: `linear-gradient(135deg, #1A1A2E, ${couleurFamille}80)`, borderRadius: "24px", padding: "28px 24px", textAlign: "center" }}>
          <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: couleurFamille + "30", border: `3px solid ${couleurFamille}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.5rem", margin: "0 auto 12px" }}>
            {familleEmojis[profil.famille] || "👤"}
          </div>
          <p style={{ fontFamily: "'Fredoka One', cursive", color: "white", fontSize: "1.8rem", margin: "0 0 4px" }}>{profil.prenom}</p>
          <span style={{ background: couleurFamille + "30", color: "white", fontFamily: "'Fredoka One', cursive", padding: "4px 16px", borderRadius: "100px", fontSize: "0.85rem" }}>
            {familleNom}
          </span>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginTop: "16px", flexWrap: "wrap" }}>
            <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: "12px", padding: "8px 16px", fontFamily: "'Fredoka One', cursive", color: "white", fontSize: "0.9rem" }}>
              ⚡ {(profil.xp || 0).toLocaleString()} XP
            </div>
            <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: "12px", padding: "8px 16px", fontFamily: "'Fredoka One', cursive", color: "white", fontSize: "0.9rem" }}>
              🃏 {cartesPossedees.length} cartes
            </div>
          </div>
        </div>

        {/* VITRINE DE CARTES */}
        <div style={{ background: "white", borderRadius: "24px", padding: "24px", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div>
              <p style={{ fontFamily: "'Fredoka One', cursive", color: "#1A1A2E", fontSize: "1.2rem", margin: 0 }}>✨ Ma Vitrine</p>
              <p style={{ color: "#9CA3AF", fontSize: "0.8rem", margin: "2px 0 0" }}>Tes 3 cartes préférées — visibles par tous</p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
            {[0, 1, 2].map(i => {
              const carte = vitrine[i];
              const config = carte ? RARETE_CONFIG[carte.rarete] : null;
              return (
                <div key={i} onClick={() => setModeChoixVitrine(i)}
                  style={{
                    flex: 1, maxWidth: "140px", borderRadius: "14px", overflow: "hidden",
                    border: `2px dashed ${carte ? config.couleur : "#E5E7EB"}`,
                    cursor: "pointer", background: carte ? "white" : "#F8FAFC",
                    transition: "all 0.2s",
                    boxShadow: carte ? `0 4px 15px ${config.couleur}30` : "none",
                  }}>
                  {carte ? (
                    <>
                      <img src={carte.image} alt={carte.nom} style={{ width: "100%", display: "block" }} />
                      <div style={{ padding: "6px 8px", borderTop: `1px solid ${config.couleur}20` }}>
                        <p style={{ fontSize: "0.55rem", fontWeight: "700", color: "#1A1A2E", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{carte.nom}</p>
                        <p style={{ fontSize: "0.5rem", color: config.couleur, margin: "1px 0 0" }}>{config.emoji} {config.label}</p>
                      </div>
                    </>
                  ) : (
                    <div style={{ padding: "32px 8px", textAlign: "center" }}>
                      <p style={{ fontSize: "1.5rem", margin: "0 0 4px" }}>➕</p>
                      <p style={{ color: "#9CA3AF", fontSize: "0.65rem", fontFamily: "'Fredoka One', cursive" }}>Choisir</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <p style={{ color: "#9CA3AF", fontSize: "0.75rem", textAlign: "center", margin: "12px 0 0" }}>
            Clique sur un slot pour changer la carte
          </p>
        </div>

        {/* TICKET À GRATTER DU JOUR */}
        <div style={{ background: "white", borderRadius: "24px", padding: "24px", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
          <style>
            {`
              .gold-ticket {
                position: relative;
                background: linear-gradient(135deg, #FEF3C7 0%, #F59E0B 40%, #B45309 100%);
                border: 2px solid #B45309;
                box-shadow: 0 10px 30px rgba(180, 83, 9, 0.35), inset 0 2px 0 rgba(255,255,255,0.45);
                overflow: hidden;
              }
              .gold-ticket::before {
                content: "";
                position: absolute;
                top: -50%;
                left: -30%;
                width: 60%;
                height: 220%;
                background: linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.45), rgba(255,255,255,0));
                transform: rotate(22deg);
                animation: shineTicket 3.2s linear infinite;
                pointer-events: none;
              }
              @keyframes shineTicket {
                0% { left: -45%; }
                100% { left: 120%; }
              }
              .gold-pill {
                background: linear-gradient(135deg, #FDE68A, #F59E0B);
                color: #7C2D12;
                border: 1px solid #B45309;
                box-shadow: inset 0 1px 0 rgba(255,255,255,0.5);
              }
              .scratch-canvas {
                position: absolute;
                inset: 0;
                width: 100%;
                height: 100%;
                touch-action: none;
                cursor: crosshair;
              }
            `}
          </style>
          <p style={{ fontFamily: "'Fredoka One', cursive", color: "#1A1A2E", fontSize: "1.2rem", margin: "0 0 6px" }}>🎟️ Ticket à gratter quotidien</p>
          <p style={{ color: "#9CA3AF", fontSize: "0.82rem", margin: "0 0 14px" }}>
            1 ticket offert par jour. Récompense possible: gros XP (1000+) ou carte Légendaire.
          </p>

          {ticketDisponible ? (
            <button
              onClick={creerTicketDuJour}
              disabled={loadingTicket}
              style={{
                width: "100%",
                background: "linear-gradient(135deg, #2563EB, #1D4ED8)",
                color: "white",
                border: "none",
                fontFamily: "'Fredoka One', cursive",
                fontSize: "0.95rem",
                padding: "12px 16px",
                borderRadius: "12px",
                cursor: loadingTicket ? "not-allowed" : "pointer",
              }}
            >
              {loadingTicket ? "⏳ Création..." : "🎟️ Récupérer mon ticket du jour"}
            </button>
          ) : (
            <div>
              <div
                className="gold-ticket"
                ref={scratchAreaRef}
                style={{
                  position: "relative",
                  borderRadius: "16px",
                  overflow: "hidden",
                  padding: "14px",
                  minHeight: "170px",
                }}
              >
                <div style={{ textAlign: "center", marginBottom: 8 }}>
                  <p style={{ color: "#7C2D12", fontFamily: "'Fredoka One', cursive", margin: 0, fontSize: "0.85rem", position: "relative", zIndex: 2 }}>
                    {revealedTicket || ticketJour?.claimed ? "Récompense du jour" : "Gratte le ticket"}
                  </p>
                  <p style={{ color: "#1F2937", fontFamily: "'Fredoka One', cursive", margin: "5px 0 0", fontSize: "1.08rem", position: "relative", zIndex: 2 }}>
                    {revealedTicket || ticketJour?.claimed ? getTicketRewardLabel(ticketJour?.reward) : "?????"}
                  </p>
                </div>

                <div
                  style={{
                    marginTop: "10px",
                    borderRadius: "10px",
                    overflow: "hidden",
                    height: "115px",
                    position: "relative",
                    zIndex: 2,
                    border: "1px dashed rgba(255,255,255,0.35)",
                  }}
                >
                  {!(revealedTicket || ticketJour?.claimed) && (
                    <canvas
                      ref={canvasRef}
                      className="scratch-canvas"
                      onPointerDown={(e) => {
                        e.preventDefault();
                        isScratchingRef.current = true;
                        e.currentTarget.setPointerCapture?.(e.pointerId);
                        drawScratch(e.clientX, e.clientY);
                      }}
                      onPointerMove={(e) => {
                        if (!isScratchingRef.current) return;
                        drawScratch(e.clientX, e.clientY);
                      }}
                      onPointerUp={() => { isScratchingRef.current = false; }}
                      onPointerCancel={() => { isScratchingRef.current = false; }}
                    />
                  )}
                </div>
              </div>
              <p className="gold-pill" style={{ borderRadius: 999, padding: "6px 10px", color: "#6B7280", fontSize: "0.75rem", margin: "10px auto 0", textAlign: "center", width: "fit-content", fontFamily: "'Fredoka One', cursive" }}>
                Progression grattage: {scratchedPercent}% · Révélation à {Math.round(SCRATCH_REVEAL_RATIO * 100)}%
              </p>
            </div>
          )}
        </div>

        {/* INFOS */}
        <div style={{ background: "white", borderRadius: "24px", padding: "24px", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
          <p style={{ fontFamily: "'Fredoka One', cursive", color: "#1A1A2E", fontSize: "1.2rem", margin: "0 0 16px" }}>📋 Mes informations</p>
          {[
            { label: "Prénom", valeur: profil.prenom },
            { label: "Âge", valeur: `${profil.age} ans` },
            { label: "Classe", valeur: profil.classe === "premiere" ? "Première STMG" : "Terminale STMG" },
            profil.specialite && { label: "Spécialité", valeur: profil.specialite },
            { label: "Lycée", valeur: profil.lycee },
          ].filter(Boolean).map((item, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #F3F4F6" }}>
              <span style={{ color: "#9CA3AF", fontSize: "0.9rem" }}>{item.label}</span>
              <span style={{ color: "#1A1A2E", fontWeight: "700", fontSize: "0.9rem", textAlign: "right", maxWidth: "60%" }}>{item.valeur}</span>
            </div>
          ))}
        </div>

        {/* TRIPLE TOTEM */}
        <div style={{ background: "white", borderRadius: "24px", padding: "24px", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
          <p style={{ fontFamily: "'Fredoka One', cursive", color: "#1A1A2E", fontSize: "1.2rem", margin: "0 0 16px" }}>🔮 Mon Triple Totem</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
            {[
              { label: "🐾 Animal", data: profil.animalTotem },
              { label: "⚔️ Objet", data: profil.objetTotem },
              { label: "⭐ Star", data: profil.starTotem },
            ].map((t, i) => (
              <div key={i} style={{ background: couleurFamille + "10", borderRadius: "16px", padding: "16px", textAlign: "center", border: `1px solid ${couleurFamille}20` }}>
                <p style={{ fontSize: "2rem", margin: "0 0 4px" }}>{t.data?.emoji || "❓"}</p>
                <p style={{ color: "#9CA3AF", fontSize: "0.7rem", margin: "0 0 4px" }}>{t.label}</p>
                <p style={{ color: couleurFamille, fontFamily: "'Fredoka One', cursive", fontSize: "0.8rem", margin: 0 }}>{t.data?.nom || "—"}</p>
              </div>
            ))}
          </div>
        </div>

        {/* JOKER */}
        <div style={{ background: "white", borderRadius: "24px", padding: "24px", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
          <p style={{ fontFamily: "'Fredoka One', cursive", color: "#1A1A2E", fontSize: "1.2rem", margin: "0 0 8px" }}>🃏 Joker — Refaire le quiz</p>
          {jokerDisponible ? (
            <>
              <p style={{ color: "#9CA3AF", fontSize: "0.85rem", margin: "0 0 16px" }}>Tu as 1 joker disponible. Refais le quiz sans perdre ton XP ni tes badges !</p>
              <button onClick={() => setShowJoker(true)} style={{ background: "linear-gradient(135deg, #F59E0B, #B45309)", color: "white", border: "none", fontFamily: "'Fredoka One', cursive", fontSize: "1rem", padding: "12px 28px", borderRadius: "14px", cursor: "pointer" }}>
                🃏 Utiliser mon Joker
              </button>
            </>
          ) : (
            <p style={{ color: "#9CA3AF", fontSize: "0.85rem" }}>Tu as déjà utilisé ton joker. Plus disponible !</p>
          )}
        </div>

        {/* LEGAL */}
        <div style={{ background: "white", borderRadius: "24px", padding: "24px", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
          <p style={{ fontFamily: "'Fredoka One', cursive", color: "#1A1A2E", fontSize: "1.2rem", margin: "0 0 12px" }}>📋 Légal</p>
          {[
            { label: "📄 CGU & RGPD", action: () => setShowCGU(true) },
            { label: "📧 Nous contacter", action: () => setShowContact(true) },
          ].map((b, i) => (
            <button key={i} onClick={b.action} style={{ width: "100%", textAlign: "left", background: "#F8FAFC", border: "1px solid #E5E7EB", color: "#374151", fontFamily: "'Nunito', sans-serif", fontSize: "0.9rem", padding: "12px 16px", borderRadius: "12px", cursor: "pointer", marginBottom: "8px" }}>
              {b.label}
            </button>
          ))}
        </div>

        {/* DECONNEXION */}
        <button onClick={onDeconnexion} style={{ width: "100%", background: "linear-gradient(135deg, #EF4444, #DC2626)", color: "white", border: "none", fontFamily: "'Fredoka One', cursive", fontSize: "1.1rem", padding: "16px", borderRadius: "18px", cursor: "pointer", boxShadow: "0 4px 15px #EF444440" }}>
          🚪 Se déconnecter
        </button>
      </div>

      {/* POPUP CHOIX VITRINE */}
      {modeChoixVitrine !== null && (
        <div onClick={() => setModeChoixVitrine(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)", zIndex: 2000, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", padding: "20px", overflowY: "auto" }}>
          <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: "600px" }}>
            <p style={{ fontFamily: "'Fredoka One', cursive", color: "white", fontSize: "1.5rem", textAlign: "center", margin: "0 0 8px" }}>
              ✨ Choisir une carte pour le slot {modeChoixVitrine + 1}
            </p>
            <p style={{ color: "#9CA3AF", fontSize: "0.85rem", textAlign: "center", margin: "0 0 20px" }}>
              {cartesPossedees.length} cartes disponibles
            </p>
            {cartesPossedees.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px", background: "rgba(255,255,255,0.05)", borderRadius: "20px" }}>
                <p style={{ fontFamily: "'Fredoka One', cursive", color: "#9CA3AF", fontSize: "1.1rem" }}>Tu n'as pas encore de cartes !</p>
                <p style={{ color: "#6B7280", fontSize: "0.85rem" }}>Ouvre des packs dans la boutique.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center" }}>
                {cartesPossedees.map(carte => {
                  const config = RARETE_CONFIG[carte.rarete];
                  const estDansVitrine = vitrine.some(v => v?.id === carte.id);
                  return (
                    <div key={carte.id} onClick={() => choisirCarteVitrine(carte)}
                      style={{
                        width: "100px", borderRadius: "12px", overflow: "hidden",
                        border: `3px solid ${estDansVitrine ? config.couleur : config.couleur + "60"}`,
                        boxShadow: estDansVitrine ? `0 0 15px ${config.couleur}80` : "none",
                        cursor: "pointer", background: "white", transition: "all 0.2s",
                        opacity: estDansVitrine ? 0.6 : 1,
                      }}>
                      <img src={carte.image} alt={carte.nom} style={{ width: "100%", display: "block" }} />
                      <div style={{ padding: "4px 6px", borderTop: `1px solid ${config.couleur}20` }}>
                        <p style={{ fontSize: "0.5rem", fontWeight: "700", color: "#1A1A2E", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{carte.nom}</p>
                        <p style={{ fontSize: "0.48rem", color: config.couleur, margin: "1px 0 0" }}>{config.emoji} {config.label}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <button onClick={() => setModeChoixVitrine(null)} style={{ background: "rgba(239,68,68,0.2)", color: "#EF4444", border: "2px solid rgba(239,68,68,0.4)", fontFamily: "'Fredoka One', cursive", fontSize: "1rem", padding: "12px 28px", borderRadius: "14px", cursor: "pointer" }}>
                ✕ Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP CGU */}
      {showCGU && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
          <div style={{ background: "white", borderRadius: "24px", maxWidth: "500px", width: "100%", maxHeight: "80vh", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid #E5E7EB", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p style={{ fontFamily: "'Fredoka One', cursive", color: "#1A1A2E", fontSize: "1.1rem", margin: 0 }}>📋 CGU & RGPD</p>
              <button onClick={() => setShowCGU(false)} style={{ background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer", color: "#9CA3AF" }}>×</button>
            </div>
            <div style={{ padding: "20px 24px", overflowY: "auto", flex: 1 }}>
              <pre style={{ color: "#374151", fontSize: "0.75rem", whiteSpace: "pre-wrap", lineHeight: 1.8, fontFamily: "'Nunito', sans-serif" }}>{CGU_TEXTE}</pre>
            </div>
            <div style={{ padding: "16px 24px", borderTop: "1px solid #E5E7EB" }}>
              <button onClick={() => setShowCGU(false)} style={{ width: "100%", background: "#3B82F6", color: "white", border: "none", fontFamily: "'Fredoka One', cursive", fontSize: "1rem", padding: "12px", borderRadius: "12px", cursor: "pointer" }}>Fermer</button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP CONTACT */}
      {showContact && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
          <div style={{ background: "white", borderRadius: "24px", maxWidth: "400px", width: "100%", padding: "28px" }}>
            <p style={{ fontFamily: "'Fredoka One', cursive", color: "#1A1A2E", fontSize: "1.3rem", margin: "0 0 20px" }}>📧 Nous contacter</p>
            {[
              { label: "Responsable", valeur: "Khalifa SOUCI" },
              { label: "Email", valeur: "lelaboduprof69@gmail.com" },
            ].map((item, i) => (
              <div key={i} style={{ background: "#F8FAFC", borderRadius: "14px", padding: "14px 16px", marginBottom: "10px" }}>
                <p style={{ color: "#9CA3AF", fontSize: "0.8rem", margin: "0 0 4px" }}>{item.label}</p>
                <p style={{ color: "#1A1A2E", fontWeight: "700", fontSize: "0.95rem", margin: 0 }}>{item.valeur}</p>
              </div>
            ))}
            <button onClick={() => setShowContact(false)} style={{ width: "100%", background: "#3B82F6", color: "white", border: "none", fontFamily: "'Fredoka One', cursive", fontSize: "1rem", padding: "12px", borderRadius: "12px", cursor: "pointer", marginTop: "8px" }}>Fermer</button>
          </div>
        </div>
      )}

      {/* POPUP JOKER */}
      {showJoker && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
          <div style={{ background: "white", borderRadius: "24px", maxWidth: "380px", width: "100%", padding: "32px", textAlign: "center" }}>
            <p style={{ fontSize: "4rem", margin: "0 0 12px" }}>🃏</p>
            <p style={{ fontFamily: "'Fredoka One', cursive", color: "#1A1A2E", fontSize: "1.4rem", margin: "0 0 8px" }}>Utiliser ton Joker ?</p>
            <p style={{ color: "#9CA3AF", fontSize: "0.85rem", margin: "0 0 24px", lineHeight: 1.8 }}>
              ✅ XP conservé<br />✅ Badges conservés<br />✅ Chapitres conservés<br />✅ Cartes conservées<br />⚠️ Famille et Totems réinitialisés<br />⚠️ Joker non récupérable
            </p>
            <div style={{ display: "flex", gap: "12px" }}>
              <button onClick={() => setShowJoker(false)} style={{ flex: 1, background: "#F3F4F6", color: "#374151", border: "none", fontFamily: "'Fredoka One', cursive", fontSize: "1rem", padding: "14px", borderRadius: "14px", cursor: "pointer" }}>Annuler</button>
              <button onClick={utiliserJoker} disabled={chargement} style={{ flex: 1, background: "linear-gradient(135deg, #F59E0B, #B45309)", color: "white", border: "none", fontFamily: "'Fredoka One', cursive", fontSize: "1rem", padding: "14px", borderRadius: "14px", cursor: "pointer" }}>
                {chargement ? "⏳..." : "🃏 Confirmer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}