import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
 apiKey: "AIzaSyDYkmxm99cMZBp553EQM3rH_7H1sjzHGvg",
  authDomain: "stmg-hub.firebaseapp.com",
  projectId: "stmg-hub",
  storageBucket: "stmg-hub.firebasestorage.app",
  messagingSenderId: "270987336613",
  appId: "1:270987336613:web:822d940bc5365e0646664c"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);