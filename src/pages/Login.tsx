import { useState, useEffect } from "react";
import { auth } from "../services/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  fetchSignInMethodsForEmail,
} from "firebase/auth";

type LoginProps = { modeInitial?: "connexion" | "inscription" };

function authCode(err: unknown): string {
  if (typeof err === "object" && err !== null && "code" in err && typeof (err as { code: unknown }).code === "string") {
    return (err as { code: string }).code;
  }
  return "";
}

async function messageErreurAuth(err: unknown, emailTrim: string, inscription: boolean): Promise<string> {
  const code = authCode(err);
  if (code === "auth/email-already-in-use" && inscription) {
    let hint = "";
    try {
      const methods = await fetchSignInMethodsForEmail(auth, emailTrim);
      if (methods.includes("google.com") && methods.includes("password")) {
        hint = " Ce compte accepte Google ou un mot de passe.";
      } else if (methods.includes("google.com")) {
        hint = " Ce compte a été créé avec Google : utilise « Continuer avec Google ».";
      } else if (methods.includes("password")) {
        hint = " Un mot de passe existe déjà : passe en mode connexion ci-dessous.";
      }
    } catch {
      /* ignore */
    }
    return (
      "Cette adresse est déjà enregistrée sur STMG HUB (même si tu ne t'en souviens pas : test, autre appareil, ou Google avec le même mail)." +
      hint +
      " Utilise « Déjà un compte ? Connecte-toi » ou le bouton ci-dessous."
    );
  }
  switch (code) {
    case "auth/invalid-email":
      return "Adresse e-mail invalide.";
    case "auth/weak-password":
      return "Mot de passe trop faible (au moins 6 caractères).";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "E-mail ou mot de passe incorrect.";
    case "auth/too-many-requests":
      return "Trop de tentatives. Réessaie dans quelques minutes.";
    case "auth/network-request-failed":
      return "Problème de connexion réseau. Réessaie.";
    case "auth/popup-closed-by-user":
      return "Connexion Google annulée.";
    case "auth/account-exists-with-different-credential":
      return "Cet e-mail est déjà lié à une autre méthode (ex. mot de passe). Connecte-toi avec la bonne méthode.";
    default: {
      const msg = err instanceof Error ? err.message : String(err);
      return msg || "Une erreur est survenue.";
    }
  }
}

export default function Login({ modeInitial = "connexion" }: LoginProps) {
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [estInscription, setEstInscription] = useState(modeInitial === "inscription");
  const [erreur, setErreur] = useState("");
  const [codeErreur, setCodeErreur] = useState("");

  useEffect(() => {
    setEstInscription(modeInitial === "inscription");
  }, [modeInitial]);

  const clearErreur = () => {
    setErreur("");
    setCodeErreur("");
  };

  const handleEmailAuth = async () => {
    clearErreur();
    const emailTrim = email.trim();
    if (!emailTrim) {
      setErreur("Indique ton e-mail.");
      return;
    }
    try {
      if (estInscription) {
        await createUserWithEmailAndPassword(auth, emailTrim, motDePasse);
      } else {
        await signInWithEmailAndPassword(auth, emailTrim, motDePasse);
      }
    } catch (err) {
      const code = authCode(err);
      setCodeErreur(code);
      setErreur(await messageErreurAuth(err, emailTrim, estInscription));
    }
  };

  const handleGoogle = async () => {
    clearErreur();
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      const code = authCode(err);
      setCodeErreur(code);
      setErreur(await messageErreurAuth(err, email.trim(), false));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(180deg, #F8FAFF 0%, #F1F5F9 100%)" }}>
      <div className="bg-white border border-slate-200 p-8 rounded-2xl w-full max-w-md shadow-xl">
        <h1 className="text-slate-900 text-3xl font-bold text-center mb-2" style={{ fontFamily: "'Fredoka One', cursive" }}>STMG HUB</h1>
        <p className="text-slate-500 text-center mb-6">
          {estInscription ? "Crée ton compte" : "Connecte-toi"}
        </p>

        {erreur && (
          <div className="mb-4 space-y-2">
            <p className="text-red-600 text-center text-sm">{erreur}</p>
            {codeErreur === "auth/email-already-in-use" && estInscription && (
              <button
                type="button"
                onClick={() => {
                  setEstInscription(false);
                  clearErreur();
                }}
                className="w-full text-sm font-semibold text-blue-700 hover:text-blue-900 underline"
              >
                Me connecter avec cet e-mail
              </button>
            )}
          </div>
        )}

        <input
          type="email"
          placeholder="Ton email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            clearErreur();
          }}
          className="w-full bg-white border border-slate-300 text-slate-900 p-3 rounded-lg mb-3 outline-none"
        />
        <input
          type="password"
          placeholder="Ton mot de passe"
          value={motDePasse}
          onChange={(e) => {
            setMotDePasse(e.target.value);
            clearErreur();
          }}
          className="w-full bg-white border border-slate-300 text-slate-900 p-3 rounded-lg mb-4 outline-none"
        />

        <button
          onClick={() => void handleEmailAuth()}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold p-3 rounded-lg mb-3 shadow-sm"
        >
          {estInscription ? "S'inscrire" : "Se connecter"}
        </button>

        <button
          onClick={() => void handleGoogle()}
          className="w-full bg-white hover:bg-gray-100 text-gray-800 font-bold p-3 rounded-lg mb-4"
        >
          Continuer avec Google
        </button>

        <p
          onClick={() => {
            setEstInscription(!estInscription);
            clearErreur();
          }}
          className="text-slate-500 text-center cursor-pointer hover:text-slate-900"
        >
          {estInscription ? "Déjà un compte ? Connecte-toi" : "Pas de compte ? Inscris-toi"}
        </p>
      </div>
    </div>
  );
}
