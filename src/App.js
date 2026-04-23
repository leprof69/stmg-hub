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

function App() {
  const [utilisateur, setUtilisateur] = useState(null);
  const [profil, setProfil] = useState(null);
  const [chargement, setChargement] = useState(true);
  const [page, setPage] = useState("dashboard");
  const [afficherLogin, setAfficherLogin] = useState(false);
  const [afficherAccueil, setAfficherAccueil] = useState(false);
  const [modeLogin, setModeLogin] = useState("connexion");
  const sessionConnexionMarquee = useRef(false);
  const dernierePageTrackee = useRef("");

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

  return (
    <div>
      <nav className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex gap-2 overflow-x-auto">
        <button onClick={() => setAfficherAccueil(true)}
          className="text-sm font-semibold px-3 py-1 rounded-lg transition-all whitespace-nowrap text-purple-400 hover:text-purple-300 font-black">
          🎓 STMG HUB
        </button>
        <div className="w-px bg-gray-600 mx-1" />
        <button onClick={() => { setPage("dashboard"); chargerProfil(utilisateur); }}
          className={`text-sm font-semibold px-3 py-1 rounded-lg transition-all whitespace-nowrap ${page === "dashboard" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"}`}>
          🏠 Accueil
        </button>
        <button onClick={() => setPage("chapitres")}
          className={`text-sm font-semibold px-3 py-1 rounded-lg transition-all whitespace-nowrap ${page === "chapitres" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"}`}>
          📚 Chapitres
        </button>
        <button onClick={() => setPage("missions")}
          className={`text-sm font-semibold px-3 py-1 rounded-lg transition-all whitespace-nowrap ${page === "missions" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"}`}>
          🎯 Missions
        </button>
        <button onClick={() => setPage("objectif-bac")}
          className={`text-sm font-semibold px-3 py-1 rounded-lg transition-all whitespace-nowrap ${page === "objectif-bac" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"}`}>
          🎓 Objectif Bac
        </button>
        <button onClick={() => setPage("classement")}
          className={`text-sm font-semibold px-3 py-1 rounded-lg transition-all whitespace-nowrap ${page === "classement" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"}`}>
          🏆 Classement
        </button>
        <button onClick={() => setPage("cartes")}
          className={`text-sm font-semibold px-3 py-1 rounded-lg transition-all whitespace-nowrap ${page === "cartes" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"}`}>
          🃏 Cartes
        </button>
        <button onClick={() => setPage("badges")}
          className={`text-sm font-semibold px-3 py-1 rounded-lg transition-all whitespace-nowrap ${page === "badges" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"}`}>
          🏅 Badges
        </button>
        <button onClick={() => { setPage("profil"); chargerProfil(utilisateur); }}
          className={`text-sm font-semibold px-3 py-1 rounded-lg transition-all whitespace-nowrap ${page === "profil" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"}`}>
          👤 Profil
        </button>
        {profil.role === "admin" && (
          <button onClick={() => setPage("admin")}
            className={`text-sm font-semibold px-3 py-1 rounded-lg transition-all whitespace-nowrap ${page === "admin" ? "bg-red-600 text-white" : "text-gray-400 hover:text-white"}`}>
            ⚙️ Admin
          </button>
        )}
      </nav>

      {page === "dashboard" && <Dashboard profil={profil} onXPGagne={() => chargerProfil(utilisateur)} />}
      {page === "chapitres" && <Chapitres profil={profil} onXPGagne={() => chargerProfil(utilisateur)} />}
      {page === "missions" && <Missions profil={profil} onXPGagne={() => chargerProfil(utilisateur)} />}
      {page === "objectif-bac" && <ObjectifBac profil={profil} onXPGagne={() => chargerProfil(utilisateur)} />}
      {page === "classement" && <Classement profil={profil} />}
      {page === "cartes" && <Cartes profil={profil} onXPGagne={() => chargerProfil(utilisateur)} />}
      {page === "badges" && <Badges profil={profil} />}
      {page === "profil" && (
        <Profil
          profil={profil}
          onRefaire={() => setProfil(null)}
          onDeconnexion={() => auth.signOut()}
          onMiseAJour={() => chargerProfil(utilisateur)}
        />
      )}
      {page === "admin" && <Admin />}
    </div>
  );
}

export default App;