import { useState } from "react";
import { auth } from "../services/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

type LoginProps = { modeInitial?: "connexion" | "inscription" };

export default function Login({ modeInitial = "connexion" }: LoginProps) {
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [estInscription, setEstInscription] = useState(modeInitial === "inscription");
  const [erreur, setErreur] = useState("");

  const handleEmailAuth = async () => {
    try {
      if (estInscription) {
        await createUserWithEmailAndPassword(auth, email, motDePasse);
      } else {
        await signInWithEmailAndPassword(auth, email, motDePasse);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setErreur("Erreur : " + msg);
    }
  };

  const handleGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setErreur("Erreur : " + msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(180deg, #F8FAFF 0%, #F1F5F9 100%)" }}>
      <div className="bg-white border border-slate-200 p-8 rounded-2xl w-full max-w-md shadow-xl">
        <h1 className="text-slate-900 text-3xl font-bold text-center mb-2" style={{ fontFamily: "'Fredoka One', cursive" }}>STMG HUB</h1>
        <p className="text-slate-500 text-center mb-6">
          {estInscription ? "Crée ton compte" : "Connecte-toi"}
        </p>

        {erreur && <p className="text-red-600 text-center mb-4">{erreur}</p>}

        <input
          type="email"
          placeholder="Ton email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-white border border-slate-300 text-slate-900 p-3 rounded-lg mb-3 outline-none"
        />
        <input
          type="password"
          placeholder="Ton mot de passe"
          value={motDePasse}
          onChange={(e) => setMotDePasse(e.target.value)}
          className="w-full bg-white border border-slate-300 text-slate-900 p-3 rounded-lg mb-4 outline-none"
        />

        <button
          onClick={handleEmailAuth}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold p-3 rounded-lg mb-3 shadow-sm"
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
          className="text-slate-500 text-center cursor-pointer hover:text-slate-900"
        >
          {estInscription ? "Déjà un compte ? Connecte-toi" : "Pas de compte ? Inscris-toi"}
        </p>
      </div>
    </div>
  );
}