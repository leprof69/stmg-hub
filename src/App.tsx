import { useState, useEffect, useRef, useCallback, lazy, Suspense, type CSSProperties } from "react";
import type { User } from "firebase/auth";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./services/firebase";
import {
  fetchUserProfile,
  trackUserConnection,
  startSessionTracking,
  flushSessionTime,
  endSessionTracking,
  trackNavigation,
  type UserProfile,
} from "./services/userProfileService";
import Login from "./pages/Login";
import Onboarding from "./pages/Onboarding";
import Accueil from "./pages/Accueil";
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Chapitres = lazy(() => import("./pages/Chapitres"));
const Badges = lazy(() => import("./pages/MesBadges"));
const Admin = lazy(() => import("./pages/Admin"));
const Profil = lazy(() => import("./pages/Profil"));
const Missions = lazy(() => import("./pages/Missions"));
const Classement = lazy(() => import("./pages/Classement"));
const Cartes = lazy(() => import("./pages/Cartes"));
const ObjectifBac = lazy(() => import("./pages/ObjectifBac"));
const Flashcards = lazy(() => import("./pages/Flashcards"));
const Duel = lazy(() => import("./pages/Duel"));
const Jeux = lazy(() => import("./pages/Jeux"));
const VisiteSalon = lazy(() => import("./pages/VisiteSalon"));
const DS = lazy(() => import("./pages/DS"));
import { PlatformIntegrityProvider } from "./contexts/PlatformIntegrityContext";
import { DsImmersiveProvider } from "./contexts/DsImmersiveContext";
import "./App.css";

function App() {
  const [utilisateur, setUtilisateur] = useState<User | null>(null);
  const [profil, setProfil] = useState<UserProfile | null>(null);
  const [chargement, setChargement] = useState(true);
  const [erreurChargement, setErreurChargement] = useState("");
  const [page, setPage] = useState("dashboard");
  const [visitedUid, setVisitedUid] = useState<string | null>(null);
  const [afficherLogin, setAfficherLogin] = useState(false);
  const [afficherAccueil, setAfficherAccueil] = useState(false);
  /** Tant que true (défaut), on affiche la page d'accueil publique même si Firebase a une session. */
  const [accueilSiteVisible, setAccueilSiteVisible] = useState(true);
  const [modeLogin, setModeLogin] = useState<"connexion" | "inscription">("connexion");
  const [dsImmersive, setDsImmersive] = useState(false);
  const sessionConnexionMarquee = useRef(false);
  const dernierePageTrackee = useRef("");
  const sessionActive = useRef(false);
  const sessionStartMs = useRef(0);
  const lastSessionFlushMs = useRef(0);
  const chargerProfil = async (user: User) => {
    try {
      setErreurChargement("");
      const p = await fetchUserProfile(user.uid);
      setProfil(p);
    } catch (err) {
      console.error("Chargement profil impossible", err);
      setErreurChargement(
        "Impossible de charger ton profil (connexion ou Firebase). Vérifie internet, réessaie, ou déconnecte-toi.",
      );
      setProfil(null);
    } finally {
      setChargement(false);
    }
  };

  const onAfterPlatformIntegrityViolation = useCallback(() => {
    if (utilisateur) void chargerProfil(utilisateur);
  }, [utilisateur]);

  useEffect(() => {
    const chargementMax = window.setTimeout(() => {
      setChargement((encore) => {
        if (encore) {
          setErreurChargement(
            "Le chargement prend trop de temps. Vérifie ta connexion, que le serveur tourne (npm run dev → http://localhost:3000), puis recharge.",
          );
        }
        return false;
      });
    }, 20000);

    const unsub = onAuthStateChanged(
      auth,
      (user) => {
        setUtilisateur(user);
        if (user) {
          void chargerProfil(user);
        } else {
          setProfil(null);
          setErreurChargement("");
          setChargement(false);
        }
      },
      (err) => {
        console.error("Firebase Auth", err);
        setErreurChargement("Erreur de connexion Firebase Auth. Recharge la page ou réessaie plus tard.");
        setChargement(false);
      },
    );
    return () => {
      window.clearTimeout(chargementMax);
      unsub();
    };
  }, []);

  useEffect(() => {
    if (!utilisateur) return;
    const interval = setInterval(() => chargerProfil(utilisateur), 30000);
    return () => clearInterval(interval);
  }, [utilisateur]);

  useEffect(() => {
    if (!utilisateur) setAfficherLogin(false);
  }, [utilisateur]);

  useEffect(() => {
    if (!utilisateur || !profil || sessionConnexionMarquee.current) return;
    const marquerConnexion = async () => {
      try {
        await trackUserConnection(utilisateur.uid);
      } catch (err) {
        console.error("Tracking connexion impossible", err);
      }
    };
    void marquerConnexion();
    sessionConnexionMarquee.current = true;
  }, [utilisateur, profil]);

  useEffect(() => {
    if (!utilisateur || !profil || sessionActive.current) return;

    const userId = utilisateur.uid;
    const demarrerSession = async () => {
      try {
        const now = Date.now();
        await startSessionTracking(userId);
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
        await flushSessionTime(userId, deltaSec, dayKey);
      } catch (err) {
        console.error("Flush session tracking impossible", err);
      }
    };

    const terminerSession = async () => {
      if (!sessionActive.current) return;
      await flusherSession(true);
      const totalDurationSec = Math.floor((Date.now() - sessionStartMs.current) / 1000);
      try {
        await endSessionTracking(userId, totalDurationSec);
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
        await trackNavigation(utilisateur.uid, page);
      } catch (err) {
        console.error("Tracking navigation impossible", err);
      }
    };
    void marquerNavigation();
    dernierePageTrackee.current = page;
  }, [page, utilisateur, profil]);

  useEffect(() => {
    if (profil?.role !== "admin" && page === "admin") setPage("dashboard");
    if (page === "escape-chap6") setPage("dashboard");
  }, [page, profil]);

  if (chargement) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-white text-xl">Chargement…</p>
        <p className="text-slate-400 text-sm max-w-md">
          STMG HUB — si cet écran reste bloqué, utilise <strong className="text-white">http://localhost:3000</strong>{" "}
          (pas le port 5173) après <code className="text-amber-200">npm run dev</code>.
        </p>
      </div>
    );
  }

  if (erreurChargement && utilisateur) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-red-300 text-lg font-semibold max-w-lg">{erreurChargement}</p>
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            type="button"
            className="rounded-xl bg-sky-600 px-5 py-3 font-bold text-white"
            onClick={() => {
              setChargement(true);
              void chargerProfil(utilisateur);
            }}
          >
            Réessayer
          </button>
          <button
            type="button"
            className="rounded-xl bg-slate-600 px-5 py-3 font-bold text-white"
            onClick={() => void signOut(auth)}
          >
            Se déconnecter
          </button>
        </div>
      </div>
    );
  }

  const montrerAccueilMarketing = !utilisateur || accueilSiteVisible;
  if (montrerAccueilMarketing) {
    if (!utilisateur && afficherLogin) return <Login key={modeLogin} modeInitial={modeLogin} />;
    return (
      <Accueil
        estConnecte={!!utilisateur}
        onDeconnexion={utilisateur ? () => void signOut(auth) : undefined}
        onConnexion={
          utilisateur
            ? () => setAccueilSiteVisible(false)
            : () => {
                setModeLogin("connexion");
                setAfficherLogin(true);
              }
        }
        onInscription={
          utilisateur
            ? () => setAccueilSiteVisible(false)
            : () => {
                setModeLogin("inscription");
                setAfficherLogin(true);
              }
        }
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

  const navBtnClass = (id: string, isAdmin = false) =>
    `nav-btn${page === id ? " active" : ""}${isAdmin ? " admin" : ""}`;

  const NAV_ACCENTS = {
    dashboard: "#0ea5e9",
    chapitres: "#2563eb",
    missions: "#f97316",
    "objectif-bac": "#e11d48",
    classement: "#f59e0b",
    cartes: "#06b6d4",
    flashcards: "#8b5cf6",
    badges: "#14b8a6",
    profil: "#3b82f6",
    duel: "#facc15",
    jeux: "#a78bfa",
    admin: "#ef4444",
    ds: "#64748b",
  };

  return (
    <PlatformIntegrityProvider
      userId={utilisateur?.uid ?? null}
      isAdmin={profil?.role === "admin"}
      xpSuspendedFromProfile={Boolean(profil?.platformIntegrity?.xpSuspended)}
      onAfterViolation={onAfterPlatformIntegrityViolation}
    >
      <DsImmersiveProvider immersive={dsImmersive} setImmersive={setDsImmersive}>
      <div className="app-shell">
      {!dsImmersive && (
      <nav className="top-nav">
        <button onClick={() => setAfficherAccueil(true)} className="nav-brand">
          🎓 STMG HUB
        </button>
        <div className="nav-divider" />
        <button onClick={() => { setPage("dashboard"); chargerProfil(utilisateur); }} className={navBtnClass("dashboard")} style={{ "--nav-accent": NAV_ACCENTS.dashboard } as CSSProperties}>
          🏠 Accueil
        </button>
        <button onClick={() => setPage("flashcards")} className={navBtnClass("flashcards")} style={{ "--nav-accent": NAV_ACCENTS.flashcards } as CSSProperties}>
          🧠 Flashcards
        </button>
        <button onClick={() => setPage("chapitres")} className={navBtnClass("chapitres")} style={{ "--nav-accent": NAV_ACCENTS.chapitres } as CSSProperties}>
          📚 Chapitres
        </button>
        <button onClick={() => setPage("missions")} className={navBtnClass("missions")} style={{ "--nav-accent": NAV_ACCENTS.missions } as CSSProperties}>
          🎯 Missions
        </button>
        <button onClick={() => setPage("ds")} className={navBtnClass("ds")} style={{ "--nav-accent": NAV_ACCENTS.ds } as CSSProperties}>
          📝 DS
        </button>
        <button onClick={() => setPage("jeux")} className={navBtnClass("jeux")} style={{ "--nav-accent": NAV_ACCENTS.jeux } as CSSProperties}>
          🎮 Jeux
        </button>
        <button onClick={() => setPage("objectif-bac")} className={navBtnClass("objectif-bac")} style={{ "--nav-accent": NAV_ACCENTS["objectif-bac"] } as CSSProperties}>
          🎓 Objectif Bac
        </button>
        <button onClick={() => setPage("classement")} className={navBtnClass("classement")} style={{ "--nav-accent": NAV_ACCENTS.classement } as CSSProperties}>
          🏆 Classement
        </button>
        <button onClick={() => setPage("cartes")} className={navBtnClass("cartes")} style={{ "--nav-accent": NAV_ACCENTS.cartes } as CSSProperties}>
          🃏 Cartes
        </button>
        <button onClick={() => setPage("badges")} className={navBtnClass("badges")} style={{ "--nav-accent": NAV_ACCENTS.badges } as CSSProperties}>
          🏅 Badges
        </button>
        <button onClick={() => { setPage("profil"); chargerProfil(utilisateur); }} className={navBtnClass("profil")} style={{ "--nav-accent": NAV_ACCENTS.profil } as CSSProperties}>
          👤 Profil
        </button>
        {profil?.role === "admin" && (
          <button onClick={() => setPage("admin")} className={navBtnClass("admin", true)} style={{ "--nav-accent": NAV_ACCENTS.admin } as CSSProperties}>
            ⚙️ Admin
          </button>
        )}
      </nav>
      )}

      <Suspense
        fallback={
          <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <p className="text-white text-xl">Chargement...</p>
          </div>
        }
      >
        {page === "dashboard" && <Dashboard profil={profil} />}
        {page === "chapitres" && <Chapitres profil={profil} onXPGagne={() => chargerProfil(utilisateur)} />}
        {page === "missions" && <Missions profil={profil} onXPGagne={() => chargerProfil(utilisateur)} />}
        {page === "ds" && (
          <DS
            profil={profil}
            onExamFinished={() => {
              if (utilisateur) void chargerProfil(utilisateur);
            }}
          />
        )}
        {page === "duel" && <Duel profil={profil} onXPGagne={() => chargerProfil(utilisateur)} />}
        {page === "jeux" && <Jeux profil={profil} onXPGagne={() => chargerProfil(utilisateur)} />}
        {page === "objectif-bac" && <ObjectifBac profil={profil} onXPGagne={() => chargerProfil(utilisateur)} />}
        {page === "classement" && <Classement profil={profil} onVisiterProfil={(uid:string)=>{ setVisitedUid(uid); setPage("visite"); }} />}
        {page === "visite" && visitedUid && (
          <VisiteSalon visitedUid={visitedUid} myProfil={profil} onBack={()=>{ setPage("classement"); setVisitedUid(null); }}/>
        )}
        {page === "cartes" && <Cartes profil={profil} onXPGagne={() => chargerProfil(utilisateur)} />}
        {page === "flashcards" && <Flashcards profil={profil} onXPGagne={() => chargerProfil(utilisateur)} />}
        {page === "badges" && <Badges profil={profil} />}
        {page === "profil" && (
          <Profil
            profil={profil}
            onRefaire={() => setProfil(null)}
            onDeconnexion={() => void signOut(auth)}
          />
        )}
        {page === "admin" && <Admin />}
      </Suspense>
      </div>
      </DsImmersiveProvider>
    </PlatformIntegrityProvider>
  );
}

export default App;