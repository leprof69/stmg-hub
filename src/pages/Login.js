import { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [estInscription, setEstInscription] = useState(false);
  const [erreur, setErreur] = useState("");

  const handleEmailAuth = async () => {
    try {
      if (estInscription) {
        await createUserWithEmailAndPassword(auth, email, motDePasse);
      } else {
        await signInWithEmailAndPassword(auth, email, motDePasse);
      }
    } catch (err) {
      setErreur("Erreur : " + err.message);
    }
  };

  const handleGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      setErreur("Erreur : " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-xl w-full max-w-md">
        <h1 className="text-white text-3xl font-bold text-center mb-2">STMG HUB</h1>
        <p className="text-gray-400 text-center mb-6">
          {estInscription ? "Crée ton compte" : "Connecte-toi"}
        </p>

        {erreur && <p className="text-red-400 text-center mb-4">{erreur}</p>}

        <input
          type="email"
          placeholder="Ton email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-gray-700 text-white p-3 rounded-lg mb-3 outline-none"
        />
        <input
          type="password"
          placeholder="Ton mot de passe"
          value={motDePasse}
          onChange={(e) => setMotDePasse(e.target.value)}
          className="w-full bg-gray-700 text-white p-3 rounded-lg mb-4 outline-none"
        />

        <button
          onClick={handleEmailAuth}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold p-3 rounded-lg mb-3"
        >
          {estInscription ? "S'inscrire" : "Se connecter"}
        </button>

        <button
          onClick={handleGoogle}
          className="w-full bg-white hover:bg-gray-100 text-gray-800 font-bold p-3 rounded-lg mb-4"
        >
          Continuer avec Google
        </button>

        <p
          onClick={() => setEstInscription(!estInscription)}
          className="text-gray-400 text-center cursor-pointer hover:text-white"
        >
          {estInscription ? "Déjà un compte ? Connecte-toi" : "Pas de compte ? Inscris-toi"}
        </p>
      </div>
    </div>
  );
}