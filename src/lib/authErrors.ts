/** Messages Firebase Auth en francais pour l'interface eleve. */
export function messageErreurAuth(code: string): string {
  switch (code) {
    case "auth/invalid-email":
      return "Adresse e-mail invalide.";
    case "auth/user-disabled":
      return "Ce compte est desactive. Contacte ton professeur.";
    case "auth/user-not-found":
    case "auth/invalid-credential":
    case "auth/wrong-password":
      return "E-mail ou mot de passe incorrect.";
    case "auth/email-already-in-use":
      return "Cet e-mail est deja utilise. Connecte-toi ou utilise Mot de passe oublie.";
    case "auth/weak-password":
      return "Mot de passe trop faible (6 caracteres minimum).";
    case "auth/too-many-requests":
      return "Trop de tentatives. Reessaie dans quelques minutes.";
    case "auth/popup-closed-by-user":
      return "Connexion Google annulee.";
    case "auth/network-request-failed":
      return "Probleme de connexion Internet. Reessaie.";
    default:
      return "Une erreur est survenue. Reessaie ou contacte ton professeur.";
  }
}

export function extraireCodeErreurAuth(err: unknown): string {
  if (err && typeof err === "object" && "code" in err && typeof (err as { code: string }).code === "string") {
    return (err as { code: string }).code;
  }
  return "";
}
