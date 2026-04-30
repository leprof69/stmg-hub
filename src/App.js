import { useState, useEffect, useRef } from "react";
import { auth, db } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc, serverTimestamp, increment } from "firebase/firestore";
import Login from "./pages/Login";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Chapitres from "./pages/Chapitres";
import Badges from "./pages/MesBadges";
import Admin from "./pages/Admin";
import Profil from "./pages/Profil";
import Accueil from "./pages/Accueil";
import Missions from "./pages/Missions";
import Classement from "./pages/Classement";
import Cartes from "./pages/Cartes";
import ObjectifBac from "./pages/ObjectifBac";
import Focus from "./pages/Focus";
import "./App.css";

function App() {
  const [utilisateur, setUtilisateur] = useState(null);
  const [profil, setProfil] = useState(null);
  const [chargement, setChargement] = useState(true);
  const [page, setPage] = useState("dashboard");
  const [afficherLogin, setAfficherLogin] = useState(false);
  const [afficherAccueil, setAfficherAccueil] = useState(false);
  const [modeLogin, setModeLogin] = useState("connexion");
  const [showReleaseAlert, setShowReleaseAlert] = useState(false);
  const sessionConnexionMarquee = useRef(false);
  const dernierePageTrackee = useRef("");
  const sessionActive = useRef(false);
  const sessionStartMs = useRef(0);
  const lastSessionFlushMs = useRef(0);

  const chargerProfil = async (user) => {
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      setProfil({ id: user.uid, ...data });
    } else {
      setProfil(null);
    }
    setChargement(false);
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUtilisateur(user);
      if (user) {
        chargerProfil(user);
      } else {
        setProfil(null);
        setChargement(false);
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!utilisateur) return;
    const interval = setInterval(() => chargerProfil(utilisateur), 30000);
    return () => clearInterval(interval);
  }, [utilisateur]);

  useEffect(() => {
    if (!utilisateur || !profil || sessionConnexionMarquee.current) return;
    const marquerConnexion = async () => {
      try {
        const today = new Date();
        const dayKey = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
        await updateDoc(doc(db, "users", utilisateur.uid), {
          lastConnectionAt: serverTimestamp(),
          lastConnectionDay: dayKey,
          connexionCount: increment(1),
          lastActionType: "connexion",
          lastActionPage: "dashboard",
          lastActionAt: serverTimestamp(),
        });
      } catch (err) {
        console.error("Tracking connexion impossible", err);
      }
    };
    marquerConnexion();
    sessionConnexionMarquee.current = true;
  }, [utilisateur, profil]);

  useEffect(() => {
    if (!utilisateur || !profil || sessionActive.current) return;

    const userId = utilisateur.uid;
    const demarrerSession = async () => {
      try {
        const now = Date.now();
        const today = new Date();
        const dayKey = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
        await updateDoc(doc(db, "users", userId), {
          sessionCount: increment(1),
          lastSessionStartAt: serverTimestamp(),
          lastSessionDay: dayKey,
        });
        sessionActive.current = true;
        sessionStartMs.current = now;
        lastSessionFlushMs.current = now;
      } catch (err) {
        console.error("Démarrage session tracking impossible", err);
      }
    };

    const flusherSession = async (force = false) => {
      if (!sessionActive.current) return;
      const now = Date.now();
      const deltaMs = Math.max(0, now - (lastSessionFlushMs.current || now));
      const deltaSec = Math.floor(deltaMs / 1000);
      if (!force && deltaSec < 30) return;
      if (deltaSec <= 0) return;

      const today = new Date();
      const dayKey = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
      lastSessionFlushMs.current = now;
      try {
        await updateDoc(doc(db, "users", userId), {
          sessionTimeTotalSec: increment(deltaSec),
          [`sessionTimeToday.${dayKey}`]: increment(deltaSec),
          lastSessionSeenAt: serverTimestamp(),
        });
      } catch (err) {
        console.error("Flush session tracking impossible", err);
      }
    };

    const terminerSession = async () => {
      if (!sessionActive.current) return;
      await flusherSession(true);
      const totalDurationSec = Math.floor((Date.now() - sessionStartMs.current) / 1000);
      try {
        await updateDoc(doc(db, "users", userId), {
          lastSessionDurationSec: Math.max(0, totalDurationSec),
          lastSessionEndAt: serverTimestamp(),
        });
      } catch (err) {
        console.error("Fin session tracking impossible", err);
      }
      sessionActive.current = false;
      sessionStartMs.current = 0;
      lastSessionFlushMs.current = 0;
    };

    const handleVisibility = () => {
      if (document.hidden) {
        flusherSession(true);
      } else {
        lastSessionFlushMs.current = Date.now();
      }
    };

    demarrerSession();
    const interval = setInterval(() => {
      if (!document.hidden) flusherSession(false);
    }, 30000);
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("beforeunload", handleVisibility);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("beforeunload", handleVisibility);
      terminerSession();
    };
  }, [utilisateur, profil]);

  useEffect(() => {
    if (!utilisateur || !profil || page === dernierePageTrackee.current) return;
    const marquerNavigation = async () => {
      try {
        await updateDoc(doc(db, "users", utilisateur.uid), {
          lastActionType: "navigation",
          lastActionPage: page,
          lastActionAt: serverTimestamp(),
          [`activityCounters.${page}`]: increment(1),
        });
      } catch (err) {
        console.error("Tracking navigation impossible", err);
      }
    };
    marquerNavigation();
    dernierePageTrackee.current = page;
  }, [page, utilisateur, profil]);

  useEffect(() => {
    if (!utilisateur || !profil) return;
    const releaseKey = "stmg.release.2026-04-focus-silph-prestige";
    const alreadySeen = window.localStorage.getItem(releaseKey);
    if (!alreadySeen) setShowReleaseAlert(true);
  }, [utilisateur, profil]);

  const closeReleaseAlert = () => {
    const releaseKey = "stmg.release.2026-04-focus-silph-prestige";
    window.localStorage.setItem(releaseKey, "seen");
    setShowReleaseAlert(false);
  };

  if (chargement) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-white text-xl">Chargement...</p>
      </div>
    );
  }

  if (!utilisateur) {
    if (afficherLogin) return <Login modeInitial={modeLogin} />;
    return (
      <Accueil
        onConnexion={() => { setModeLogin("connexion"); setAfficherLogin(true); }}
        onInscription={() => { setModeLogin("inscription"); setAfficherLogin(true); }}
      />
    );
  }

  if (!profil) {
    return <Onboarding onTermine={() => chargerProfil(utilisateur)} />;
  }

  if (afficherAccueil) {
    return (
      <>
        <nav className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex gap-2 overflow-x-auto">
          <button onClick={() => setAfficherAccueil(false)}
            className="text-sm font-semibold px-3 py-1 rounded-lg transition-all whitespace-nowrap text-gray-400 hover:text-white">
            ← Retour à l'app
          </button>
        </nav>
        <Accueil
          onConnexion={() => setAfficherAccueil(false)}
          onInscription={() => setAfficherAccueil(false)}
          estConnecte={true}
        />
      </>
    );
  }

  const navBtnClass = (id, isAdmin = false) =>
    `nav-btn${page === id ? " active" : ""}${isAdmin ? " admin" : ""}`;

  const NAV_ACCENTS = {
    dashboard: "#0ea5e9",
    chapitres: "#2563eb",
    missions: "#f97316",
    "objectif-bac": "#e11d48",
    focus: "#10b981",
    classement: "#f59e0b",
    cartes: "#06b6d4",
    badges: "#14b8a6",
    profil: "#3b82f6",
    admin: "#ef4444",
  };

  return (
    <div className="app-shell">
      {showReleaseAlert && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.55)", zIndex: 1200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ width: "min(700px, 96vw)", background: "white", borderRadius: 18, border: "2px solid #C7D2FE", boxShadow: "0 18px 48px rgba(15, 23, 42, 0.28)", padding: 20 }}>
            <h2 style={{ margin: "0 0 8px", color: "#1E1B4B", fontSize: "1.35rem" }}>📢 Nouveautés STMG HUB</h2>
            <p style={{ margin: "0 0 10px", color: "#334155", lineHeight: 1.55 }}>
              Des mises à jour importantes sont en ligne pour les élèves :
            </p>
            <ul style={{ margin: "0 0 12px", paddingLeft: 18, color: "#334155", lineHeight: 1.6 }}>
              <li>🎯 Nouveau cas difficile <strong>CAS SILPH</strong> dans la page Missions.</li>
              <li>🧩 Nouvelle page <strong>Focus</strong> avec activités interactives (dont mots croisés en grille).</li>
              <li>🏆 Classement basé sur le <strong>prestige</strong> (gagné quand on dépense des XP en packs).</li>
            </ul>
            <p style={{ margin: "0 0 14px", color: "#475569", fontSize: "0.9rem" }}>
              Astuce élève : ouvrir des packs ne fait plus perdre son rang global, car le prestige continue de monter.
            </p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button onClick={() => { setPage("missions"); closeReleaseAlert(); }} style={{ border: "none", borderRadius: 10, padding: "9px 12px", cursor: "pointer", background: "#EA580C", color: "white", fontWeight: 700 }}>
                Aller au cas Silph
              </button>
              <button onClick={() => { setPage("focus"); closeReleaseAlert(); }} style={{ border: "none", borderRadius: 10, padding: "9px 12px", cursor: "pointer", background: "#0EA5E9", color: "white", fontWeight: 700 }}>
                Aller à Focus
              </button>
              <button onClick={() => { setPage("classement"); closeReleaseAlert(); }} style={{ border: "none", borderRadius: 10, padding: "9px 12px", cursor: "pointer", background: "#A855F7", color: "white", fontWeight: 700 }}>
                Voir le classement prestige
              </button>
              <button onClick={closeReleaseAlert} style={{ borderRadius: 10, padding: "9px 12px", cursor: "pointer", background: "white", color: "#334155", fontWeight: 700, border: "1px solid #CBD5E1" }}>
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
      <nav className="top-nav">
        <button onClick={() => setAfficherAccueil(true)} className="nav-brand">
          🎓 STMG HUB
        </button>
        <div className="nav-divider" />
        <button onClick={() => { setPage("dashboard"); chargerProfil(utilisateur); }} className={navBtnClass("dashboard")} style={{ "--nav-accent": NAV_ACCENTS.dashboard }}>
          🏠 Accueil
        </button>
        <button onClick={() => setPage("chapitres")} className={navBtnClass("chapitres")} style={{ "--nav-accent": NAV_ACCENTS.chapitres }}>
          📚 Chapitres
        </button>
        <button onClick={() => setPage("missions")} className={navBtnClass("missions")} style={{ "--nav-accent": NAV_ACCENTS.missions }}>
          🎯 Missions
        </button>
        <button onClick={() => setPage("objectif-bac")} className={navBtnClass("objectif-bac")} style={{ "--nav-accent": NAV_ACCENTS["objectif-bac"] }}>
          🎓 Objectif Bac
        </button>
        <button onClick={() => setPage("focus")} className={navBtnClass("focus")} style={{ "--nav-accent": NAV_ACCENTS.focus }}>
          🎯 Focus
        </button>
        <button onClick={() => setPage("classement")} className={navBtnClass("classement")} style={{ "--nav-accent": NAV_ACCENTS.classement }}>
          🏆 Classement
        </button>
        <button onClick={() => setPage("cartes")} className={navBtnClass("cartes")} style={{ "--nav-accent": NAV_ACCENTS.cartes }}>
          🃏 Cartes
        </button>
        <button onClick={() => setPage("badges")} className={navBtnClass("badges")} style={{ "--nav-accent": NAV_ACCENTS.badges }}>
          🏅 Badges
        </button>
        <button onClick={() => { setPage("profil"); chargerProfil(utilisateur); }} className={navBtnClass("profil")} style={{ "--nav-accent": NAV_ACCENTS.profil }}>
          👤 Profil
        </button>
        {profil.role === "admin" && (
          <button onClick={() => setPage("admin")} className={navBtnClass("admin", true)} style={{ "--nav-accent": NAV_ACCENTS.admin }}>
            ⚙️ Admin
          </button>
        )}
      </nav>

      {page === "dashboard" && <Dashboard profil={profil} onXPGagne={() => chargerProfil(utilisateur)} />}
      {page === "chapitres" && <Chapitres profil={profil} onXPGagne={() => chargerProfil(utilisateur)} />}
      {page === "missions" && <Missions profil={profil} onXPGagne={() => chargerProfil(utilisateur)} />}
      {page === "objectif-bac" && <ObjectifBac profil={profil} onXPGagne={() => chargerProfil(utilisateur)} />}
      {page === "focus" && <Focus profil={profil} onXPGagne={() => chargerProfil(utilisateur)} />}
      {page === "classement" && <Classement profil={profil} />}
      {page === "cartes" && <Cartes profil={profil} onXPGagne={() => chargerProfil(utilisateur)} />}
      {page === "badges" && <Badges profil={profil} />}
      {page === "profil" && (
        <Profil
          profil={profil}
          onRefaire={() => setProfil(null)}
          onDeconnexion={() => auth.signOut()}
        />
      )}
      {page === "admin" && <Admin />}
    </div>
  );
}

export default App;