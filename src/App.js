import { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Login from "./pages/Login";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Chapitres from "./pages/Chapitres";

function App() {
  const [utilisateur, setUtilisateur] = useState(null);
  const [profil, setProfil] = useState(null);
  const [chargement, setChargement] = useState(true);
  const [page, setPage] = useState("dashboard");

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

  if (!utilisateur) return <Login />;
  if (!profil) return <Onboarding onTermine={() => chargerProfil(utilisateur)} />;

  return (
    <div>
      {/* NAVBAR */}
      <nav className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex gap-4">
        <button
          onClick={() => setPage("dashboard")}
          className={`text-sm font-semibold px-3 py-1 rounded-lg transition-all ${
            page === "dashboard" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
          }`}
        >
          🏠 Accueil
        </button>
        <button
          onClick={() => setPage("chapitres")}
          className={`text-sm font-semibold px-3 py-1 rounded-lg transition-all ${
            page === "chapitres" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
          }`}
        >
          📚 Chapitres
        </button>
      </nav>

      {/* CONTENU */}
      {page === "dashboard" && <Dashboard profil={profil} />}
      {page === "chapitres" && <Chapitres profil={profil} />}
    </div>
  );
}

export default App;