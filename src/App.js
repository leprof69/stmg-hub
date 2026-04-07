import { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Login from "./pages/Login";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";

function App() {
  const [utilisateur, setUtilisateur] = useState(null);
  const [profil, setProfil] = useState(null);
  const [chargement, setChargement] = useState(true);

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
  return <Dashboard profil={profil} />;
}

export default App;