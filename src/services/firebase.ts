import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? "AIzaSyDYkmxm99cMZBp553EQM3rH_7H1sjzHGvg",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? "stmg-hub.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? "stmg-hub",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? "stmg-hub.firebasestorage.app",
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? "270987336613",
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? "1:270987336613:web:822d940bc5365e0646664c",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
