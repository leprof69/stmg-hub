import { initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

/**
 * Config Web Firebase du projet stmg-hub (identique à l’ancien firebase.js avant Vite).
 * Ces valeurs sont publiques côté client (comme dans la console Firebase) ; la sécurité
 * repose sur les règles Firestore / Auth, pas sur le secret de ce fichier.
 *
 * On ne lit pas import.meta.env ici : un build Netlify sans variables VITE_* injectait
 * une clé vide / erronée → connexion Google impossible (auth/api-key-not-valid).
 */
const firebaseConfig = {
  apiKey: "AIzaSyDYkmxm99cMZBp553EQM3rH_7H1sjzHGvg",
  authDomain: "stmg-hub.firebaseapp.com",
  projectId: "stmg-hub",
  storageBucket: "stmg-hub.firebasestorage.app",
  messagingSenderId: "270987336613",
  appId: "1:270987336613:web:822d940bc5365e0646664c",
};

const app: FirebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(app);
auth.languageCode = "fr";
export const db = getFirestore(app);
