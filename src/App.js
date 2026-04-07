import { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Login from "./pages/Login";
import Onboarding from "./pages/Onboarding";

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
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <p className="text-4xl mb-4">
          {profil.famille === "Architecte" ? "🧠" :
           profil.famille === "Visionnaire" ? "🎨" :
           profil.famille === "Challenger" ? "⚡" :
           profil.famille === "Explorateur" ? "🔬" : "🔥"}
        </p>
        <h1 className="text-white text-3xl font-bold">
          Bienvenue {profil.prenom} !
        </h1>
        <p className="text-blue-400 text-xl mt-2">{profil.famille}</p>
        <p className="text-gray-400 mt-1">{profil.classe === "premiere" ? "Première STMG" : "Terminale STMG"}</p>
        <button
          onClick={() => auth.signOut()}
          className="mt-6 bg-red-600 hover:bg-red-700 text-white font-bold p-3 rounded-lg"
        >
          Se déconnecter
        </button>
      </div>
    </div>
  );
}

export default App;