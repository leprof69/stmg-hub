import { useState, useEffect } from "react";

const COLORS = {
  S: "#3B82F6",
  T: "#0EA5E9",
  M: "#F97316",
  G: "#10B981",
  H: "#EF4444",
  U: "#F59E0B",
  B: "#06B6D4",
};

const COLOR_LIST = [COLORS.S, COLORS.T, COLORS.M, COLORS.G, COLORS.H, COLORS.U, COLORS.B];
const MotColore = ({ mot, startIndex = 0 }) => (
  <span style={{ display: "inline-flex", alignItems: "baseline", gap: "0px" }}>
    {mot.split("").map((lettre, i) => (
      <span key={i} style={{
        color: COLOR_LIST[(startIndex + i) % COLOR_LIST.length],
        display: "inline-block",
        fontFamily: "'Nunito', sans-serif",
        fontWeight: 900,
        letterSpacing: "0.01em",
        lineHeight: 1,
      }}>
        {lettre}
      </span>
    ))}
  </span>
);

const LogoLetters = [
  { char: "S", color: COLORS.S },
  { char: "T", color: COLORS.T },
  { char: "M", color: COLORS.M },
  { char: "G", color: COLORS.G },
  { char: "H", color: COLORS.H },
  { char: "U", color: COLORS.U },
  { char: "B", color: COLORS.B },
];

const Logo = ({ size = "normal" }) => {
  const fontSize = size === "big" ? "5rem" : size === "medium" ? "2.5rem" : "1.8rem";
  const gap = size === "big" ? "6px" : "3px";
  return (
    <div style={{ display: "flex", alignItems: "center", gap, fontFamily: "'Nunito', sans-serif" }}>
      {LogoLetters.map((l, i) => (
        <span key={i} style={{
          fontSize, fontWeight: 900, color: l.color,
          display: "inline-block", lineHeight: 1,
          letterSpacing: "0.02em",
          ...(i === 3 && { marginRight: size === "big" ? "16px" : "8px" }),
        }}>
          {l.char}
        </span>
      ))}
    </div>
  );
};

const familles = [
  { nom: "L'Architecte", emoji: "🧠", couleur: COLORS.S, bg: "#EFF6FF", description: "Analytique, structuré, stratège. Tu planifies tout avant d'agir.", traits: ["Stratégie", "Logique", "Précision"] },
  { nom: "Le Visionnaire", emoji: "🎨", couleur: COLORS.T, bg: "#ECFEFF", description: "Créatif, intuitif, innovant. Tu imagines ce que les autres ne voient pas.", traits: ["Créativité", "Innovation", "Vision"] },
  { nom: "Le Challenger", emoji: "⚡", couleur: COLORS.M, bg: "#FFF7ED", description: "Compétitif, déterminé, ambitieux. Tu transformes chaque obstacle en tremplin.", traits: ["Compétition", "Dépassement", "Ambition"] },
  { nom: "L'Explorateur", emoji: "🔬", couleur: COLORS.G, bg: "#ECFDF5", description: "Curieux, analytique, aventurier. Tu questionnes tout pour mieux comprendre.", traits: ["Curiosité", "Analyse", "Découverte"] },
  { nom: "L'Influenceur", emoji: "🔥", couleur: COLORS.H, bg: "#FEF2F2", description: "Charismatique, fédérateur, inspirant. Tu entraînes les autres vers le sommet.", traits: ["Leadership", "Charisme", "Impact"] },
];

const badges = [
  { emoji: "🐱", nom: "Le Chat", rarete: "Commun", couleur: "#9CA3AF" },
  { emoji: "🐬", nom: "Le Dauphin", rarete: "Peu commun", couleur: COLORS.G },
  { emoji: "🦁", nom: "Le Lion", rarete: "Rare", couleur: COLORS.S },
  { emoji: "🐺", nom: "Le Loup", rarete: "Épique", couleur: COLORS.T },
  { emoji: "🐯", nom: "Le Tigre", rarete: "Légendaire", couleur: COLORS.U },
];

const Btn = ({ children, onClick, color, outline = false, big = false }) => (
  <button onClick={onClick} className="btn-anim"
    style={{
      background: outline ? "white" : color,
      color: outline ? color : "white",
      border: `2px solid ${color}`,
      fontFamily: "'Nunito', sans-serif",
      fontWeight: 800,
      fontSize: big ? "1.05rem" : "0.95rem",
      padding: big ? "14px 30px" : "10px 20px",
      borderRadius: "12px", cursor: "pointer",
      boxShadow: outline ? "none" : `0 8px 20px ${color}30`,
      display: "inline-flex", alignItems: "center", gap: "8px",
    }}>
    {children}
  </button>
);

const SectionTag = ({ children, color }) => (
  <div style={{
    display: "inline-flex", alignItems: "center", gap: "8px",
    background: color + "12", color,
    border: `1px solid ${color}60`,
    borderRadius: "100px", padding: "8px 20px",
    fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: "0.88rem",
    marginBottom: "16px",
  }}>
    {children}
  </div>
);

const CardEmoji = ({ emoji, couleur, bg, titre, desc, tag }) => {
  const [hov, setHov] = useState(false);
  return (
    <div className="card-hover"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ background: bg, borderRadius: "18px", padding: "28px", border: `1px solid ${couleur}30`, cursor: "pointer" }}>
      <div style={{ fontSize: "2.6rem", marginBottom: "16px", display: "inline-block", animation: hov ? "bounce 0.3s ease infinite alternate" : "none" }}>
        {emoji}
      </div>
      <h3 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: "1.3rem", color: "#111827", marginBottom: "10px" }}>{titre}</h3>
      <p style={{ color: "#6B7280", lineHeight: 1.7, marginBottom: "20px" }}>{desc}</p>
      <span style={{ background: couleur, color: "white", fontFamily: "'Nunito', sans-serif", fontWeight: 800, padding: "7px 14px", borderRadius: "999px", fontSize: "0.8rem" }}>
        {tag}
      </span>
    </div>
  );
};

const CardChiffre = ({ emoji, valeur, label, couleur }) => {
  const [hov, setHov] = useState(false);
  return (
    <div className="card-hover"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ background: "white", borderRadius: "16px", padding: "18px", boxShadow: `0 8px 24px ${couleur}18`, border: `1px solid ${couleur}28`, cursor: "pointer" }}>
      <div style={{ fontSize: "2rem", marginBottom: "8px", display: "inline-block", animation: hov ? "bounce 0.4s ease infinite alternate" : "none" }}>
        {emoji}
      </div>
      <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: "2.3rem", color: couleur }}>{valeur}</div>
      <div style={{ fontSize: "0.85rem", color: "#6B7280", fontWeight: 700 }}>{label}</div>
    </div>
  );
};

const CardEtape = ({ num, emoji, titre, desc, couleur }) => {
  const [hov, setHov] = useState(false);
  return (
    <div className="card-hover"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ background: "rgba(255,255,255,0.04)", borderRadius: "18px", padding: "28px", border: `1px solid ${couleur}60`, cursor: "pointer" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
        <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: "2.1rem", color: couleur }}>{num}</span>
        <span style={{ fontSize: "3rem", display: "inline-block", animation: hov ? "bounce 0.4s ease infinite alternate" : "none" }}>
          {emoji}
        </span>
      </div>
      <h3 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: "1.25rem", color: "white", marginBottom: "10px" }}>{titre}</h3>
      <p style={{ color: "#D1D5DB", lineHeight: 1.7 }}>{desc}</p>
    </div>
  );
};

const CardCompet = ({ emoji, titre, desc, couleur }) => {
  const [hov, setHov] = useState(false);
  return (
    <div className="card-hover"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ display: "flex", alignItems: "flex-start", gap: "16px", padding: "16px", borderRadius: "14px", background: couleur + "08", border: `1px solid ${couleur}25`, cursor: "pointer" }}>
      <span style={{ fontSize: "2rem", display: "inline-block", animation: hov ? "bounce 0.4s ease infinite alternate" : "none" }}>
        {emoji}
      </span>
      <div>
        <p style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: "1.05rem", color: "#111827" }}>{titre}</p>
        <p style={{ fontSize: "0.9rem", color: "#6B7280" }}>{desc}</p>
      </div>
    </div>
  );
};

const CardBadge = ({ emoji, nom, rarete, couleur }) => {
  const [hov, setHov] = useState(false);
  return (
    <div className="card-hover-sm"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ textAlign: "center", padding: "20px 14px", borderRadius: "16px", border: `1px solid ${couleur}90`, background: couleur + "10", boxShadow: `0 8px 20px ${couleur}20`, cursor: "pointer" }}>
      <div style={{ fontSize: "3rem", marginBottom: "12px", display: "inline-block", animation: hov ? "bounce 0.4s ease infinite alternate" : "none" }}>
        {emoji}
      </div>
      <p style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, color: "#111827", fontSize: "0.95rem" }}>{nom}</p>
      <p style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, color: couleur, fontSize: "0.8rem", marginTop: "4px" }}>{rarete}</p>
    </div>
  );
};

const CardRecompense = ({ emoji, titre, desc, couleur }) => {
  const [hov, setHov] = useState(false);
  return (
    <div className="card-hover"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ textAlign: "center", padding: "24px 18px", borderRadius: "16px", background: couleur + "10", border: `1px solid ${couleur}30`, cursor: "pointer" }}>
      <div style={{ fontSize: "3rem", marginBottom: "12px", display: "inline-block", animation: hov ? "bounce 0.4s ease infinite alternate" : "none" }}>
        {emoji}
      </div>
      <p style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: "1.1rem", color: "#111827", marginBottom: "8px" }}>{titre}</p>
      <p style={{ fontSize: "0.9rem", color: "#6B7280", lineHeight: 1.6 }}>{desc}</p>
    </div>
  );
};

const CardMaj = ({ emoji, texte, couleur }) => {
  const [hov, setHov] = useState(false);
  return (
    <div className="card-hover-sm"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ padding: "14px", borderRadius: "14px", background: couleur + "14", color: couleur, fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: "0.9rem", cursor: "pointer" }}>
      <div style={{ fontSize: "2rem", marginBottom: "8px", display: "inline-block", animation: hov ? "bounce 0.4s ease infinite alternate" : "none" }}>
        {emoji}
      </div>
      <div>{texte}</div>
    </div>
  );
};

export default function Accueil({
  onConnexion,
  onInscription,
  estConnecte = false,
  onDeconnexion,
}: {
  onConnexion: () => void;
  onInscription: () => void;
  estConnecte?: boolean;
  onDeconnexion?: () => void;
}) {
  const [familleActive, setFamilleActive] = useState(0);
  const [menuOuvert, setMenuOuvert] = useState(false);

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800;900&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes bounce {
        from { transform: translateY(0px) scale(1); }
        to   { transform: translateY(-4px) scale(1.06); }
      }
    `;
    document.head.appendChild(style);
  }, []);

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif", background: "#F8FAFC", minHeight: "100vh" }}>

      {/* ===== NAVBAR ===== */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        background: "rgba(255,255,255,0.95)", borderBottom: "1px solid #E5E7EB", backdropFilter: "blur(8px)",
        padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <Logo size="normal" />
        <div className="hidden md:flex" style={{ gap: "12px", alignItems: "center" }}>
          {estConnecte ? (
            <>
              <Btn onClick={onConnexion} color={COLORS.S}>Accéder à la plateforme</Btn>
              {onDeconnexion && (
                <Btn onClick={onDeconnexion} color={COLORS.T} outline>Me déconnecter</Btn>
              )}
            </>
          ) : (
            <>
              <Btn onClick={onConnexion} color={COLORS.S} outline>Se connecter</Btn>
              <Btn onClick={onInscription} color={COLORS.T}>C'est parti ! 🚀</Btn>
            </>
          )}
        </div>
        <button onClick={() => setMenuOuvert(!menuOuvert)} className="md:hidden"
          style={{ fontSize: "1.5rem", background: "none", border: "none", cursor: "pointer" }}>☰</button>
      </nav>

      {menuOuvert && (
        <div style={{ position: "fixed", top: "64px", left: 0, right: 0, zIndex: 49, background: "white", borderBottom: "2px solid #F3F4F6", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
          {estConnecte ? (
            <>
              <Btn onClick={() => { onConnexion(); setMenuOuvert(false); }} color={COLORS.S}>Accéder à la plateforme</Btn>
              {onDeconnexion && (
                <Btn onClick={() => { onDeconnexion(); setMenuOuvert(false); }} color={COLORS.T} outline>Me déconnecter</Btn>
              )}
            </>
          ) : (
            <>
              <Btn onClick={() => { onConnexion(); setMenuOuvert(false); }} color={COLORS.S} outline>Se connecter</Btn>
              <Btn onClick={() => { onInscription(); setMenuOuvert(false); }} color={COLORS.T}>C'est parti ! 🚀</Btn>
            </>
          )}
        </div>
      )}

      {/* ===== HERO ===== */}
      <section style={{ paddingTop: "130px", paddingBottom: "80px", paddingLeft: "24px", paddingRight: "24px", background: "linear-gradient(180deg, #EEF2FF 0%, #F8FAFC 70%)", textAlign: "center", position: "relative", overflow: "hidden" }}>
        {[
          { color: COLORS.T, top: "60px", left: "5%", size: "200px" },
          { color: COLORS.M, top: "100px", right: "5%", size: "180px" },
          { color: COLORS.G, bottom: "20px", left: "35%", size: "150px" },
          { color: COLORS.S, bottom: "40px", right: "20%", size: "120px" },
        ].map((b, i) => (
          <div key={i} style={{ position: "absolute", top: b.top, left: b.left, right: b.right, bottom: b.bottom, width: b.size, height: b.size, borderRadius: "50%", background: b.color, opacity: 0.08, filter: "blur(40px)", pointerEvents: "none" }} />
        ))}

        <div style={{ maxWidth: "900px", margin: "0 auto", position: "relative" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "32px" }}>
            <Logo size="big" />
          </div>

          <SectionTag color={COLORS.M}>🔥 La plateforme qui fait kiffer les révisions STMG</SectionTag>

          {/* HERO TITRE avec lettres colorées */}
          <h1 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: "clamp(2.7rem, 8vw, 5.4rem)", lineHeight: 1.1, marginBottom: "24px", color: "#111827", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "16px", alignItems: "baseline" }}>
            <MotColore mot="Révise." startIndex={0} />
            <MotColore mot="Gagne." startIndex={2} />
            <MotColore mot="Domine." startIndex={4} />
            <span style={{ fontSize: "0.8em" }}>🔥</span>
          </h1>

          <p style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: "clamp(1.05rem, 2.4vw, 1.35rem)", color: "#475569", marginBottom: "12px" }}>
            Révisions STMG modernisées, sans blabla.
          </p>
          <p style={{ fontSize: "1.1rem", color: "#9CA3AF", maxWidth: "600px", margin: "0 auto 40px", lineHeight: 1.8 }}>
            Des applications gamifiées pour chaque chapitre STMG, des badges à débloquer, un classement national et une famille qui te ressemble !
          </p>

          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap", marginBottom: "64px" }}>
            {estConnecte ? (
              <Btn onClick={onConnexion} color={COLORS.S} big>Accéder à la plateforme →</Btn>
            ) : (
              <>
                <Btn onClick={onConnexion} color={COLORS.S} big>J'ai déjà un compte →</Btn>
                <Btn onClick={onInscription} color={COLORS.T} outline big>Je veux tester ! 🎮</Btn>
              </>
            )}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "16px" }}>
            <CardChiffre emoji="📚" valeur="86" label="Chapitres gamifiés" couleur={COLORS.S} />
            <CardChiffre emoji="🧬" valeur="5" label="Familles uniques" couleur={COLORS.T} />
            <CardChiffre emoji="🏅" valeur="∞" label="Badges & défis" couleur={COLORS.U} />
            <CardChiffre emoji="📖" valeur="4+" label="Matières STMG" couleur={COLORS.G} />
          </div>
        </div>
      </section>

      {/* ===== RÉVISE AUTREMENT ===== */}
      <section style={{ padding: "80px 24px", background: "white" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <SectionTag color={COLORS.T}>🎮 La méthode STMG HUB</SectionTag>
            <h2 style={{ fontFamily: "'Fredoka One', cursive", fontSize: "clamp(2rem, 5vw, 3.2rem)", lineHeight: 1.2, marginBottom: "16px", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "12px", alignItems: "baseline" }}>
              <span style={{ color: "#1A1A2E" }}>Finies les heures à fixer ton</span>
              <MotColore mot="cahier" startIndex={0} />
              <span style={{ fontSize: "0.9em" }}>😴</span>
            </h2>
            <p style={{ fontSize: "1.1rem", color: "#6B7280", maxWidth: "600px", margin: "0 auto" }}>
              Chaque chapitre du programme STMG devient une expérience interactive. Tu joues, tu apprends, tu gagnes de l'XP !
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
            <CardEmoji emoji="🎮" couleur={COLORS.T} bg="#F5F3FF" titre="Applications gamifiées" desc="Chaque chapitre a sa propre appli interactive. Tu apprends en faisant, pas en lisant. Et tu gagnes de l'XP à chaque session !" tag="+50 XP par chapitre" />
            <CardEmoji emoji="🗺️" couleur={COLORS.S} bg="#EFF6FF" titre="Cartes mentales interactives" desc="Visualise les notions clés avec des cartes mentales dynamiques. Les connexions entre concepts deviennent évidentes et mémorables !" tag="Mémorisation x3 🧠" />
            <CardEmoji emoji="📄" couleur={COLORS.G} bg="#ECFDF5" titre="Fiches clés en main" desc="Des fiches synthétiques pour chaque chapitre. Notions, compétences, questions de gestion — tout en un coup d'œil avant l'exam !" tag="100% programme officiel ✅" />
          </div>
        </div>
      </section>

      {/* ===== COMMENT ÇA MARCHE ===== */}
      <section style={{ padding: "80px 24px", background: "linear-gradient(140deg, #0F172A, #0B2447)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <SectionTag color={COLORS.U}>⚡ Simple comme bonjour</SectionTag>
            <h2 style={{ fontFamily: "'Fredoka One', cursive", fontSize: "clamp(2rem, 5vw, 3.2rem)", lineHeight: 1.2, marginBottom: "16px", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "12px", alignItems: "baseline" }}>
              <span style={{ color: "white" }}>3 étapes pour devenir une</span>
              <MotColore mot="légende" startIndex={1} />
              <span style={{ fontSize: "0.9em" }}>🏆</span>
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
            <CardEtape num="01" emoji="🧬" titre="Découvre ta famille" desc="Quiz de personnalité → ta famille révélée → ton Triple Totem unique créé. Tout ça en 5 minutes !" couleur={COLORS.T} />
            <CardEtape num="02" emoji="🎮" titre="Apprends en jouant" desc="Lance les apps gamifiées, explore les cartes mentales, consulte les fiches. Tu gagnes de l'XP à chaque action !" couleur={COLORS.S} />
            <CardEtape num="03" emoji="🚀" titre="Monte en puissance" desc="Débloque des badges, grimpe dans le classement et propulse ton lycée N°1 de France. Des nouveaux défis chaque mois !" couleur={COLORS.M} />
          </div>
        </div>
      </section>

      {/* ===== COMPÉTITION ===== */}
      <section style={{ padding: "80px 24px", background: "white" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "64px", alignItems: "center" }} className="block md:grid">
            <div>
              <SectionTag color={COLORS.M}>🏆 Classement national</SectionTag>
              <h2 style={{ fontFamily: "'Fredoka One', cursive", fontSize: "clamp(2rem, 5vw, 3rem)", lineHeight: 1.2, marginBottom: "16px", display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "baseline" }}>
                <span style={{ color: "#1A1A2E" }}>Ton lycée</span>
                <MotColore mot="N°1" startIndex={0} />
                <span style={{ color: "#1A1A2E" }}>de France 🇫🇷</span>
              </h2>
              <p style={{ fontSize: "1.1rem", color: "#6B7280", marginBottom: "32px", lineHeight: 1.8 }}>
                Chaque XP que tu gagnes compte pour ton lycée dans le classement national. Plus tu bosses, plus ton lycée monte. C'est du sport collectif version STMG ! 💪
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <CardCompet emoji="📊" titre="Classement en temps réel" desc="La position de ton lycée parmi tous les lycées STMG de France" couleur={COLORS.S} />
                <CardCompet emoji="🥇" titre="Champion du mois" desc="Le lycée avec le plus d'XP chaque mois remporte le titre" couleur={COLORS.U} />
                <CardCompet emoji="⚡" titre="Nouveaux défis réguliers" desc="Des défis et challenges ajoutés chaque mois pour garder la flamme 🔥" couleur={COLORS.M} />
                <CardCompet emoji="🎖️" titre="Badges de champion" desc="Des badges exclusifs pour les meilleurs du classement national" couleur={COLORS.T} />
              </div>
            </div>

            <div className="card-hover" style={{ background: "#FFF7ED", borderRadius: "28px", padding: "32px", border: `2px solid ${COLORS.M}20`, boxShadow: `0 10px 40px ${COLORS.M}15` }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
                <span style={{ fontSize: "2rem" }}>🏆</span>
                <h3 style={{ fontFamily: "'Fredoka One', cursive", fontSize: "1.3rem", color: "#1A1A2E" }}>Classement national</h3>
              </div>
              {[
                { rang: "🥇", lycee: "Lycée Jean Moulin", ville: "Lyon", xp: "12 450" },
                { rang: "🥈", lycee: "Lycée Victor Hugo", ville: "Paris", xp: "11 200" },
                { rang: "🥉", lycee: "Lycée Voltaire", ville: "Marseille", xp: "9 800" },
                { rang: "#4", lycee: "Lycée Pasteur", ville: "Bordeaux", xp: "8 500" },
                { rang: "#5", lycee: "Lycée Molière", ville: "Toulouse", xp: "7 200" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 0", borderBottom: i < 4 ? "1px solid #FED7AA" : "none" }}>
                  <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: "1.3rem", width: "40px" }}>{item.rang}</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: "'Fredoka One', cursive", color: "#1A1A2E", fontSize: "0.95rem" }}>{item.lycee}</p>
                    <p style={{ fontSize: "0.8rem", color: "#9CA3AF" }}>{item.ville}</p>
                  </div>
                  <div style={{ fontFamily: "'Fredoka One', cursive", color: COLORS.M, fontSize: "0.95rem" }}>{item.xp} XP</div>
                </div>
              ))}
              <p style={{ textAlign: "center", color: "#9CA3AF", fontSize: "0.75rem", marginTop: "12px", fontStyle: "italic" }}>
                Exemple de classement — rejoins pour y figurer !
              </p>
              <div style={{ marginTop: "20px" }}>
                <Btn onClick={estConnecte ? onConnexion : onInscription} color={COLORS.M} big>
                  {estConnecte ? "Accéder à la plateforme →" : "Rejoindre la compétition 🔥"}
                </Btn>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== LES 5 FAMILLES ===== */}
      <section style={{ padding: "80px 24px", background: "#FAFAFA" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <SectionTag color={COLORS.T}>🧬 Qui es-tu vraiment ?</SectionTag>
            <h2 style={{ fontFamily: "'Fredoka One', cursive", fontSize: "clamp(2rem, 5vw, 3.2rem)", lineHeight: 1.2, marginBottom: "16px", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "12px", alignItems: "baseline" }}>
              <span style={{ color: "#1A1A2E" }}>Trouve ta</span>
              <MotColore mot="famille" startIndex={0} />
              <span style={{ fontSize: "0.9em" }}>🐾</span>
            </h2>
            <p style={{ fontSize: "1.1rem", color: "#6B7280", maxWidth: "600px", margin: "0 auto" }}>
              Un quiz de 15 questions te révèle ta famille et ton Triple Totem unique. Animal, Objet Mythique, Star qui t'inspire — ton profil comme nulle part ailleurs !
            </p>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "center", marginBottom: "32px" }}>
            {familles.map((f, i) => (
              <button key={i} onClick={() => setFamilleActive(i)} className="btn-anim"
                style={{
                  background: familleActive === i ? f.couleur : "white",
                  color: familleActive === i ? "white" : f.couleur,
                  border: `2px solid ${f.couleur}`,
                  borderRadius: "16px", padding: "12px 20px",
                  fontFamily: "'Fredoka One', cursive", fontSize: "1rem", cursor: "pointer",
                  boxShadow: familleActive === i ? `0 6px 20px ${f.couleur}40` : "none",
                  transform: familleActive === i ? "scale(1.05)" : "scale(1)",
                  transition: "all 0.2s",
                }}>
                {f.emoji} {f.nom}
              </button>
            ))}
          </div>

          <div style={{ background: familles[familleActive].bg, borderRadius: "28px", padding: "40px", border: `3px solid ${familles[familleActive].couleur}30`, boxShadow: `0 10px 40px ${familles[familleActive].couleur}15`, transition: "all 0.3s" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", alignItems: "center" }} className="block md:grid">
              <div>
                <div style={{ fontSize: "5rem", marginBottom: "16px" }}>{familles[familleActive].emoji}</div>
                <h3 style={{ fontFamily: "'Fredoka One', cursive", fontSize: "2.5rem", color: familles[familleActive].couleur, marginBottom: "12px" }}>{familles[familleActive].nom}</h3>
                <p style={{ fontSize: "1.2rem", color: "#6B7280", lineHeight: 1.7, marginBottom: "24px" }}>{familles[familleActive].description}</p>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {familles[familleActive].traits.map((t, i) => (
                    <span key={i} style={{ background: familles[familleActive].couleur, color: "white", fontFamily: "'Fredoka One', cursive", padding: "8px 20px", borderRadius: "100px", fontSize: "0.95rem" }}>{t}</span>
                  ))}
                </div>
              </div>
              <div style={{ background: "white", borderRadius: "24px", padding: "28px", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
                <p style={{ fontFamily: "'Fredoka One', cursive", fontSize: "1.2rem", color: "#1A1A2E", marginBottom: "20px" }}>🔮 Ton Triple Totem</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "24px" }}>
                  {[{ emoji: "🐾", label: "Animal" }, { emoji: "⚔️", label: "Objet" }, { emoji: "⭐", label: "Star" }].map((t, i) => (
                    <div key={i} className="card-hover-sm" style={{ textAlign: "center", padding: "20px 12px", borderRadius: "20px", background: familles[familleActive].bg, border: `2px solid ${familles[familleActive].couleur}30` }}>
                      <div style={{ fontSize: "2.5rem", marginBottom: "8px" }}>{t.emoji}</div>
                      <p style={{ fontSize: "0.8rem", color: "#9CA3AF", fontWeight: 700 }}>{t.label}</p>
                      <p style={{ fontSize: "0.8rem", fontFamily: "'Fredoka One', cursive", color: familles[familleActive].couleur, marginTop: "4px" }}>À découvrir !</p>
                    </div>
                  ))}
                </div>
                <Btn onClick={estConnecte ? onConnexion : onInscription} color={familles[familleActive].couleur} big>
                  {estConnecte ? "Accéder à la plateforme →" : "Faire le quiz →"}
                </Btn>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== BADGES ===== */}
      <section style={{ padding: "80px 24px", background: "white" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <SectionTag color={COLORS.U}>🏅 Système de récompenses</SectionTag>
            <h2 style={{ fontFamily: "'Fredoka One', cursive", fontSize: "clamp(2rem, 5vw, 3.2rem)", lineHeight: 1.2, marginBottom: "16px", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "12px", alignItems: "baseline" }}>
              <span style={{ color: "#1A1A2E" }}>Des</span>
              <MotColore mot="badges" startIndex={2} />
              <span style={{ color: "#1A1A2E" }}>ultra rares à collectionner 👀</span>
            </h2>
            <p style={{ fontSize: "1.1rem", color: "#6B7280", maxWidth: "600px", margin: "0 auto", lineHeight: 1.8 }}>
              Des animaux animés, des raretés de Commun à Légendaire. De nouveaux badges et défis sont ajoutés régulièrement 🔥 Certains sont presque impossibles à obtenir. Tu relèves le défi ?
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "16px", marginBottom: "48px" }}>
            {badges.map((badge, i) => (
              <CardBadge key={i} emoji={badge.emoji} nom={badge.nom} rarete={badge.rarete} couleur={badge.couleur} />
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px" }}>
            <CardRecompense emoji="⭐" titre="XP" desc="Gagne de l'XP en complétant des chapitres et des missions" couleur={COLORS.U} />
            <CardRecompense emoji="📚" titre="Chapitres" desc="Complète des chapitres pour débloquer des badges exclusifs" couleur={COLORS.S} />
            <CardRecompense emoji="🔥" titre="Streak" desc="Connecte-toi plusieurs jours de suite pour les badges de fidélité" couleur={COLORS.H} />
            <CardRecompense emoji="🏆" titre="Classement" desc="Les badges les plus rares sont réservés aux meilleurs nationaux" couleur={COLORS.T} />
          </div>
        </div>
      </section>

      {/* ===== MAJ RÉGULIÈRES ===== */}
      <section style={{ padding: "64px 24px", background: "#FAFAFA" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div className="card-hover" style={{ background: "white", borderRadius: "28px", padding: "48px", boxShadow: "0 10px 40px rgba(0,0,0,0.06)", border: `2px solid ${COLORS.B}20`, textAlign: "center" }}>
            <div style={{ fontSize: "4rem", marginBottom: "16px" }}>🔄</div>
            <h2 style={{ fontFamily: "'Fredoka One', cursive", fontSize: "clamp(2rem, 5vw, 3.2rem)", lineHeight: 1.2, marginBottom: "16px", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "8px", alignItems: "baseline" }}>
              <span style={{ color: "#1A1A2E" }}>Toujours du</span>
              <MotColore mot="nouveau" startIndex={3} />
              <span>!</span>
            </h2>
            <p style={{ fontSize: "1.1rem", color: "#6B7280", marginBottom: "32px", lineHeight: 1.8, maxWidth: "500px", margin: "0 auto 32px" }}>
              STMG HUB évolue constamment. Nouveaux chapitres, nouveaux badges, nouveaux défis, nouvelles fonctionnalités — la plateforme grandit avec toi tout au long de l'année ! 🚀
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px", maxWidth: "400px", margin: "0 auto" }}>
              <CardMaj emoji="📚" texte="Nouveaux chapitres" couleur={COLORS.S} />
              <CardMaj emoji="🏅" texte="Nouveaux badges" couleur={COLORS.U} />
              <CardMaj emoji="⚡" texte="Nouveaux défis" couleur={COLORS.M} />
              <CardMaj emoji="🎮" texte="Nouvelles apps" couleur={COLORS.T} />
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA FINAL ===== */}
      <section style={{ padding: "96px 24px", background: "linear-gradient(140deg, #111827, #0B2447)", textAlign: "center", position: "relative", overflow: "hidden" }}>
        {[
          { color: COLORS.T, top: "20px", left: "5%" },
          { color: COLORS.M, bottom: "20px", right: "5%" },
          { color: COLORS.S, top: "50%", left: "50%", transform: "translate(-50%, -50%)" },
        ].map((b, i) => (
          <div key={i} style={{ position: "absolute", top: b.top, left: b.left, right: b.right, bottom: b.bottom, width: "200px", height: "200px", borderRadius: "50%", background: b.color, opacity: 0.15, filter: "blur(50px)", transform: b.transform, pointerEvents: "none" }} />
        ))}
        <div style={{ maxWidth: "700px", margin: "0 auto", position: "relative" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "32px" }}>
            <Logo size="medium" />
          </div>
          <h2 style={{ fontFamily: "'Fredoka One', cursive", fontSize: "clamp(2.5rem, 7vw, 5rem)", color: "white", marginBottom: "24px", lineHeight: 1.1, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "16px", alignItems: "baseline" }}>
            <span style={{ color: "white" }}>T'attends</span>
            <MotColore mot="quoi" startIndex={0} />
            <span style={{ color: "white" }}>? 😏</span>
          </h2>
          <p style={{ fontSize: "1.2rem", color: "#6B7280", marginBottom: "40px", lineHeight: 1.8 }}>
            {estConnecte
              ? "Tu es connecté : entre sur la plateforme pour reprendre tes révisions."
              : "Rejoins STMG HUB, c'est gratuit et ça prend 2 minutes. Ton aventure commence maintenant !"}
          </p>
          <Btn onClick={estConnecte ? onConnexion : onInscription} color={COLORS.T} big>
            {estConnecte ? "Accéder à la plateforme 🎓" : "Rejoindre STMG HUB 🎓"}
          </Btn>
          {!estConnecte && (
            <p style={{ color: "#4B5563", fontSize: "0.9rem", marginTop: "20px" }}>
              Gratuit • Sans carte bancaire • 2 min pour créer ton profil
            </p>
          )}
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer style={{ background: "#111827", padding: "40px 24px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "24px" }}>
          <Logo size="normal" />
          <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
            {["📋 CGU & RGPD", "📧 Contact", "🔒 Confidentialité"].map((item, i) => (
              <span key={i} style={{ color: "#6B7280", fontSize: "0.9rem", cursor: "pointer", fontFamily: "'Nunito', sans-serif", fontWeight: 600, transition: "color 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.color = "white"}
                onMouseLeave={e => e.currentTarget.style.color = "#6B7280"}>
                {item}
              </span>
            ))}
          </div>
          <p style={{ color: "#4B5563", fontSize: "0.9rem", fontFamily: "'Nunito', sans-serif" }}>© 2025 STMG HUB — Khalifa SOUCI</p>
        </div>
      </footer>

    </div>
  );
}