import { useState, useEffect } from "react";
import { auth } from "../services/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import { extraireCodeErreurAuth, messageErreurAuth } from "../lib/authErrors";

type LoginProps = { modeInitial?: "connexion" | "inscription" };

type Vue = "connexion" | "inscription" | "reset";

export default function Login({ modeInitial = "connexion" }: LoginProps) {
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [vue, setVue] = useState<Vue>(modeInitial === "inscription" ? "inscription" : "connexion");
  const [erreur, setErreur] = useState("");
  const [info, setInfo] = useState("");
  const [envoiReset, setEnvoiReset] = useState(false);

  useEffect(() => {
    setVue(modeInitial === "inscription" ? "inscription" : "connexion");
    setErreur("");
    setInfo("");
    setEnvoiReset(false);
  }, [modeInitial]);

  const emailTrim = email.trim();

  const handleErreur = (err: unknown) => {
    const code = extraireCodeErreurAuth(err);
    setErreur(messageErreurAuth(code));
  };

  const handleEmailAuth = async () => {
    setErreur("");
    setInfo("");
    if (!emailTrim) {
      setErreur("Indique ton adresse e-mail.");
      return;
    }
    try {
      if (vue === "inscription") {
        if (motDePasse.length < 6) {
          setErreur("Choisis un mot de passe d'au moins 6 caractères.");
          return;
        }
        await createUserWithEmailAndPassword(auth, emailTrim, motDePasse);
      } else {
        await signInWithEmailAndPassword(auth, emailTrim, motDePasse);
      }
    } catch (err) {
      handleErreur(err);
    }
  };

  const handleGoogle = async () => {
    setErreur("");
    setInfo("");
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      handleErreur(err);
    }
  };

  const handleResetPassword = async () => {
    setErreur("");
    setInfo("");
    if (!emailTrim) {
      setErreur("Indique l'e-mail utilisé lors de ton inscription.");
      return;
    }
    setEnvoiReset(true);
    try {
      await sendPasswordResetEmail(auth, emailTrim, {
        url: `${window.location.origin}/`,
        handleCodeInApp: false,
      });
      setInfo(
        "Si cet e-mail correspond à un compte STMG HUB, tu vas recevoir un lien pour choisir un nouveau mot de passe. Pense à vérifier les spams / courriers indésirables.",
      );
    } catch (err) {
      handleErreur(err);
    } finally {
      setEnvoiReset(false);
    }
  };

  const titre =
    vue === "inscription" ? "Crée ton compte" : vue === "reset" ? "Mot de passe oublié" : "Connecte-toi";

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "linear-gradient(180deg, #F8FAFF 0%, #F1F5F9 100%)" }}
    >
      <div className="bg-white border border-slate-200 p-8 rounded-2xl w-full max-w-md shadow-xl">
        <h1
          className="text-slate-900 text-3xl font-bold text-center mb-2"
          style={{ fontFamily: "'Fredoka One', cursive" }}
        >
          STMG HUB
        </h1>
        <p className="text-slate-500 text-center mb-6">{titre}</p>

        {vue === "reset" && (
          <p className="text-slate-600 text-sm text-center mb-4 leading-relaxed">
            Le mot de passe n&apos;est pas stocké dans Firestore : seul Firebase Authentication le gère. Saisis
            l&apos;<strong>e-mail de ton compte</strong> (celui de l&apos;inscription) pour recevoir un lien de
            réinitialisation.
          </p>
        )}

        {erreur && (
          <p className="text-red-600 text-center mb-4 text-sm font-semibold" role="alert">
            {erreur}
          </p>
        )}
        {info && (
          <p
            className="text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-center mb-4 text-sm leading-relaxed"
            role="status"
          >
            {info}
          </p>
        )}

        <input
          type="email"
          autoComplete="email"
          placeholder="Ton e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-white border border-slate-300 text-slate-900 p-3 rounded-lg mb-3 outline-none focus:ring-2 focus:ring-blue-500"
        />

        {vue !== "reset" && (
          <input
            type="password"
            autoComplete={vue === "inscription" ? "new-password" : "current-password"}
            placeholder="Ton mot de passe"
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            className="w-full bg-white border border-slate-300 text-slate-900 p-3 rounded-lg mb-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
        )}

        {vue === "connexion" && (
          <button
            type="button"
            onClick={() => {
              setVue("reset");
              setErreur("");
              setInfo("");
            }}
            className="block w-full text-right text-sm text-blue-600 hover:text-blue-800 font-semibold mb-4"
          >
            Mot de passe oublié ?
          </button>
        )}

        {vue === "reset" ? (
          <button
            type="button"
            onClick={handleResetPassword}
            disabled={envoiReset}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold p-3 rounded-lg mb-3 shadow-sm"
          >
            {envoiReset ? "Envoi en cours…" : "Envoyer le lien par e-mail"}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleEmailAuth}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold p-3 rounded-lg mb-3 shadow-sm"
          >
            {vue === "inscription" ? "S'inscrire" : "Se connecter"}
          </button>
        )}

        {vue !== "reset" && (
          <button
            type="button"
            onClick={handleGoogle}
            className="w-full bg-white hover:bg-gray-100 text-gray-800 font-bold p-3 rounded-lg mb-4 border border-slate-200"
          >
            Continuer avec Google
          </button>
        )}

        <p className="text-slate-500 text-center text-sm">
          {vue === "reset" ? (
            <button
              type="button"
              onClick={() => {
                setVue("connexion");
                setErreur("");
                setInfo("");
              }}
              className="text-blue-600 hover:text-blue-800 font-semibold underline-offset-2 hover:underline"
            >
              Retour à la connexion
            </button>
          ) : vue === "inscription" ? (
            <button
              type="button"
              onClick={() => {
                setVue("connexion");
                setErreur("");
                setInfo("");
              }}
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              Déjà un compte ? Connecte-toi
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setVue("inscription");
                setErreur("");
                setInfo("");
              }}
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              Pas de compte ? Inscris-toi
            </button>
          )}
        </p>
      </div>
    </div>
  );
}
