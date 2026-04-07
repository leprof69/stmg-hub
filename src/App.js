import { useState, useEffect } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import Login from "./pages/Login";

function App() {
  const [utilisateur, setUtilisateur] = useState(null);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUtilisateur(user);
      setChargement(false);
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
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-white text-3xl font-bold">Bienvenue sur STMG HUB !</h1>
        <p className="text-gray-400 mt-2">Connecté : {utilisateur.email}</p>
        <button
          onClick={() => auth.signOut()}
          className="mt-4 bg-red-600 hover:bg-red-700 text-white font-bold p-3 rounded-lg"
        >
          Se déconnecter
        </button>
      </div>
    </div>
  );
}

export default App;