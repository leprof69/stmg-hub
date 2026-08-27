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
  const [email, setEmail]         = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [vue, setVue]             = useState<Vue>(modeInitial === "inscription" ? "inscription" : "connexion");
  const [erreur, setErreur]       = useState("");
  const [info, setInfo]           = useState("");
  const [envoiReset, setEnvoiReset] = useState(false);

  useEffect(() => {
    setVue(modeInitial === "inscription" ? "inscription" : "connexion");
    setErreur(""); setInfo(""); setEnvoiReset(false);
  }, [modeInitial]);

  const emailTrim = email.trim();

  const handleErreur = (err: unknown) => {
    const code = extraireCodeErreurAuth(err);
    setErreur(messageErreurAuth(code));
  };

  const handleEmailAuth = async () => {
    setErreur(""); setInfo("");
    if (!emailTrim) { setErreur("Indique ton adresse e-mail."); return; }
    try {
      if (vue === "inscription") {
        if (motDePasse.length < 6) { setErreur("Choisis un mot de passe d'au moins 6 caractères."); return; }
        await createUserWithEmailAndPassword(auth, emailTrim, motDePasse);
      } else {
        await signInWithEmailAndPassword(auth, emailTrim, motDePasse);
      }
    } catch (err) { handleErreur(err); }
  };

  const handleGoogle = async () => {
    setErreur(""); setInfo("");
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) { handleErreur(err); }
  };

  const handleResetPassword = async () => {
    setErreur(""); setInfo("");
    if (!emailTrim) { setErreur("Indique l'e-mail utilisé lors de ton inscription."); return; }
    setEnvoiReset(true);
    try {
      await sendPasswordResetEmail(auth, emailTrim, { url: `${window.location.origin}/`, handleCodeInApp: false });
      setInfo("Si cet e-mail correspond à un compte STMG HUB, tu vas recevoir un lien. Vérifie les spams.");
    } catch (err) { handleErreur(err); }
    finally { setEnvoiReset(false); }
  };

  const titre = vue === "inscription" ? "Crée ton compte" : vue === "reset" ? "Mot de passe oublié" : "Connecte-toi";

  const input: React.CSSProperties = {
    width: "100%",
    background: "rgba(13,27,53,0.8)",
    border: "1px solid rgba(30,53,96,0.9)",
    color: "#F1F5F9",
    padding: "13px 16px",
    borderRadius: "12px",
    fontSize: "0.95rem",
    fontFamily: "'Nunito',sans-serif",
    fontWeight: 700,
    outline: "none",
    marginBottom: "10px",
    transition: "border-color 0.18s ease",
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      background: "radial-gradient(ellipse at 20% 0%, rgba(37,99,235,0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 90%, rgba(6,182,212,0.10) 0%, transparent 45%), #040D1C",
    }}>
      {/* Glow orb */}
      <div style={{ position:"fixed", top:"-120px", left:"50%", transform:"translateX(-50%)", width:"500px", height:"300px", background:"radial-gradient(ellipse,rgba(37,99,235,0.14),transparent 70%)", pointerEvents:"none" }} />

      <div style={{
        background: "rgba(13,27,53,0.85)",
        border: "1px solid rgba(30,53,96,0.9)",
        borderRadius: "24px",
        padding: "40px 36px",
        width: "100%",
        maxWidth: "420px",
        backdropFilter: "blur(20px)",
        boxShadow: "0 24px 64px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)",
        position: "relative",
        zIndex: 1,
      }}>
        {/* Logo */}
        <div style={{ textAlign:"center", marginBottom:"28px" }}>
          <div style={{
            display:"inline-flex", alignItems:"center", gap:"8px",
            background:"linear-gradient(135deg,rgba(37,99,235,0.2),rgba(6,182,212,0.12))",
            border:"1px solid rgba(37,99,235,0.4)", borderRadius:"999px",
            padding:"8px 18px", marginBottom:"16px",
          }}>
            <span style={{ fontSize:"1.1rem" }}>🎓</span>
            <span style={{ fontFamily:"'Nunito',sans-serif", fontWeight:900, fontSize:"1rem", color:"#60A5FA", letterSpacing:"0.02em" }}>STMG HUB</span>
          </div>
          <h1 style={{ fontFamily:"'Nunito',sans-serif", fontWeight:900, fontSize:"1.6rem", color:"#F1F5F9", margin:"0 0 6px" }}>{titre}</h1>
          {vue === "reset" && (
            <p style={{ color:"#94A3B8", fontSize:"0.85rem", lineHeight:1.6, margin:0 }}>
              Saisis l'e-mail de ton compte pour recevoir un lien de réinitialisation.
            </p>
          )}
        </div>

        {erreur && (
          <div style={{ background:"rgba(239,68,68,0.12)", border:"1px solid rgba(239,68,68,0.3)", borderRadius:"12px", padding:"10px 14px", marginBottom:"14px", color:"#FCA5A5", fontSize:"0.88rem", fontWeight:700, textAlign:"center" }}>
            {erreur}
          </div>
        )}
        {info && (
          <div style={{ background:"rgba(16,185,129,0.12)", border:"1px solid rgba(16,185,129,0.3)", borderRadius:"12px", padding:"10px 14px", marginBottom:"14px", color:"#6EE7B7", fontSize:"0.85rem", fontWeight:700, textAlign:"center", lineHeight:1.6 }}>
            {info}
          </div>
        )}

        <input
          type="email"
          autoComplete="email"
          placeholder="Ton e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={input}
          onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(37,99,235,0.7)"; }}
          onBlur={(e)  => { e.currentTarget.style.borderColor = "rgba(30,53,96,0.9)"; }}
        />

        {vue !== "reset" && (
          <input
            type="password"
            autoComplete={vue === "inscription" ? "new-password" : "current-password"}
            placeholder="Ton mot de passe"
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            style={input}
            onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(37,99,235,0.7)"; }}
            onBlur={(e)  => { e.currentTarget.style.borderColor = "rgba(30,53,96,0.9)"; }}
          />
        )}

        {vue === "connexion" && (
          <div style={{ textAlign:"right", marginBottom:"14px" }}>
            <button type="button" onClick={() => { setVue("reset"); setErreur(""); setInfo(""); }}
              style={{ background:"none", border:"none", color:"#60A5FA", fontSize:"0.83rem", fontWeight:800, cursor:"pointer", fontFamily:"'Nunito',sans-serif" }}>
              Mot de passe oublié ?
            </button>
          </div>
        )}

        {vue === "reset" ? (
          <button type="button" onClick={handleResetPassword} disabled={envoiReset}
            style={{ width:"100%", background:"linear-gradient(135deg,#2563EB,#0EA5E9)", border:"none", color:"white", fontFamily:"'Nunito',sans-serif", fontWeight:900, fontSize:"1rem", padding:"14px", borderRadius:"14px", cursor:"pointer", marginBottom:"10px", opacity:envoiReset?0.6:1 }}>
            {envoiReset ? "Envoi en cours…" : "Envoyer le lien par e-mail"}
          </button>
        ) : (
          <button type="button" onClick={handleEmailAuth}
            style={{ width:"100%", background:"linear-gradient(135deg,#2563EB,#0EA5E9)", border:"none", color:"white", fontFamily:"'Nunito',sans-serif", fontWeight:900, fontSize:"1rem", padding:"14px", borderRadius:"14px", cursor:"pointer", marginBottom:"10px", boxShadow:"0 8px 24px rgba(37,99,235,0.35)" }}>
            {vue === "inscription" ? "Créer mon compte" : "Se connecter"}
          </button>
        )}

        {vue !== "reset" && (
          <button type="button" onClick={handleGoogle}
            style={{ width:"100%", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(30,53,96,0.9)", color:"#CBD5E1", fontFamily:"'Nunito',sans-serif", fontWeight:800, fontSize:"0.95rem", padding:"13px", borderRadius:"14px", cursor:"pointer", marginBottom:"20px" }}>
            Continuer avec Google
          </button>
        )}

        <div style={{ textAlign:"center" }}>
          {vue === "reset" ? (
            <button type="button" onClick={() => { setVue("connexion"); setErreur(""); setInfo(""); }}
              style={{ background:"none", border:"none", color:"#60A5FA", fontSize:"0.88rem", fontWeight:800, cursor:"pointer", fontFamily:"'Nunito',sans-serif" }}>
              ← Retour à la connexion
            </button>
          ) : vue === "inscription" ? (
            <button type="button" onClick={() => { setVue("connexion"); setErreur(""); setInfo(""); }}
              style={{ background:"none", border:"none", color:"#60A5FA", fontSize:"0.88rem", fontWeight:800, cursor:"pointer", fontFamily:"'Nunito',sans-serif" }}>
              Déjà un compte ? Connecte-toi
            </button>
          ) : (
            <button type="button" onClick={() => { setVue("inscription"); setErreur(""); setInfo(""); }}
              style={{ background:"none", border:"none", color:"#60A5FA", fontSize:"0.88rem", fontWeight:800, cursor:"pointer", fontFamily:"'Nunito',sans-serif" }}>
              Pas de compte ? Inscris-toi
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
