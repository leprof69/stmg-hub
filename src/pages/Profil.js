import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { COLLECTIONS } from "../data/collections";

const RARETE_CONFIG = {
  commune:     { label: "Commune",     couleur: "#9CA3AF", emoji: "⚪" },
  peu_commune: { label: "Peu Commune", couleur: "#10B981", emoji: "🟢" },
  rare:        { label: "Rare",        couleur: "#3B82F6", emoji: "🔵" },
  epique:      { label: "Épique",      couleur: "#0284C7", emoji: "🔷" },
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
  Architecte: "#3B82F6", Visionnaire: "#0EA5E9",
  Challenger: "#F97316", Explorateur: "#10B981", Influenceur: "#EF4444",
};

const toutesCartes = COLLECTIONS.flatMap(c => c.cartes);
export default function Profil({ profil, onRefaire, onDeconnexion }) {
  const [showCGU, setShowCGU] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showJoker, setShowJoker] = useState(false);
  const [jokerUtilise, setJokerUtilise] = useState(false);
  const [chargement, setChargement] = useState(false);
  const [maCollection, setMaCollection] = useState({});
  const [vitrine, setVitrine] = useState([null, null, null]);
  const [modeChoixVitrine, setModeChoixVitrine] = useState(null); // index slot en cours
  const [message, setMessage] = useState(null);

  const jokerDisponible = !profil.jokerUtilise && !jokerUtilise;
  const couleurFamille = familleColors[profil.famille] || "#0EA5E9";

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
  };

  const afficherMessage = (texte, type = "success") => {
    setMessage({ texte, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const cartesPossedees = toutesCartes.filter(c => (maCollection[c.id] || 0) > 0);

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
        <div style={{ background: `linear-gradient(135deg, #0B2447, ${couleurFamille}80)`, borderRadius: "24px", padding: "28px 24px", textAlign: "center" }}>
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
              <button onClick={() => setShowCGU(false)} style={{ width: "100%", background: "linear-gradient(135deg, #0EA5E9, #2563EB)", color: "white", border: "none", fontFamily: "'Fredoka One', cursive", fontSize: "1rem", padding: "12px", borderRadius: "12px", cursor: "pointer" }}>Fermer</button>
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
            <button onClick={() => setShowContact(false)} style={{ width: "100%", background: "linear-gradient(135deg, #0EA5E9, #2563EB)", color: "white", border: "none", fontFamily: "'Fredoka One', cursive", fontSize: "1rem", padding: "12px", borderRadius: "12px", cursor: "pointer", marginTop: "8px" }}>Fermer</button>
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