import { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Login from "./pages/Login";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Chapitres from "./pages/Chapitres";
import Badges from "./pages/MesBadges";
import Admin from "./pages/Admin";
import Profil from "./pages/Profil";
import Accueil from "./pages/Accueil";
import Missions from "./pages/Missions";

function App() {
  const [utilisateur, setUtilisateur] = useState(null);
  const [profil, setProfil] = useState(null);
  const [chargement, setChargement] = useState(true);
  const [page, setPage] = useState("dashboard");
  const [afficherLogin, setAfficherLogin] = useState(false);
  const [afficherAccueil, setAfficherAccueil] = useState(false);
  const [modeLogin, setModeLogin] = useState("connexion");

  const chargerProfil = async (user) => {
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setProfil(docSnap.data());
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

  if (chargement) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-white text-xl">Chargement...</p>
      </div>
    );
  }

  if (!utilisateur) {
    if (afficherLogin) {
      return <Login modeInitial={modeLogin} />;
    }
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
          <button
            onClick={() => setAfficherAccueil(false)}
            className="text-sm font-semibold px-3 py-1 rounded-lg transition-all whitespace-nowrap text-gray-400 hover:text-white"
          >
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
        <button
          onClick={() => setAfficherAccueil(true)}
          className="text-sm font-semibold px-3 py-1 rounded-lg transition-all whitespace-nowrap text-purple-400 hover:text-purple-300 font-black"
        >
          🎓 STMG HUB
        </button>
        <div className="w-px bg-gray-600 mx-1" />
        <button
          onClick={() => setPage("dashboard")}
          className={`text-sm font-semibold px-3 py-1 rounded-lg transition-all whitespace-nowrap ${page === "dashboard" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"}`}
        >
          🏠 Accueil
        </button>
        <button
          onClick={() => setPage("chapitres")}
          className={`text-sm font-semibold px-3 py-1 rounded-lg transition-all whitespace-nowrap ${page === "chapitres" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"}`}
        >
          📚 Chapitres
        </button>
        <button
          onClick={() => setPage("missions")}
          className={`text-sm font-semibold px-3 py-1 rounded-lg transition-all whitespace-nowrap ${page === "missions" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"}`}
        >
          🎯 Missions
        </button>
        <button
          onClick={() => setPage("badges")}
          className={`text-sm font-semibold px-3 py-1 rounded-lg transition-all whitespace-nowrap ${page === "badges" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"}`}
        >
          🏅 Badges
        </button>
        <button
          onClick={() => setPage("profil")}
          className={`text-sm font-semibold px-3 py-1 rounded-lg transition-all whitespace-nowrap ${page === "profil" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"}`}
        >
          👤 Profil
        </button>
        {profil.role === "admin" && (
          <button
            onClick={() => setPage("admin")}
            className={`text-sm font-semibold px-3 py-1 rounded-lg transition-all whitespace-nowrap ${page === "admin" ? "bg-red-600 text-white" : "text-gray-400 hover:text-white"}`}
          >
            ⚙️ Admin
          </button>
        )}
      </nav>

      {page === "dashboard" && <Dashboard profil={profil} />}
      {page === "chapitres" && <Chapitres profil={profil} />}
      {page === "missions" && <Missions profil={profil} />}
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