/**
 * Diagnostic Firestore : ou sont les notes DS SDGN ?
 * Usage: node scripts/diagnose-ds-grades.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const DS_EXAM = "sdgn_premiere_qcm_v1";

const firebaseConfig = {
  apiKey: "AIzaSyDYkmxm99cMZBp553EQM3rH_7H1sjzHGvg",
  authDomain: "stmg-hub.firebaseapp.com",
  projectId: "stmg-hub",
  storageBucket: "stmg-hub.firebasestorage.app",
  messagingSenderId: "270987336613",
  appId: "1:270987336613:web:822d940bc5365e0646664c",
};

function loadEnv() {
  const path = join(process.cwd(), ".env");
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!m || process.env[m[1]]) continue;
    process.env[m[1]] = m[2].replace(/^["']|["']$/g, "").trim();
  }
}

function num(v) {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const n = Number(v.trim().replace(",", "."));
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function readDsTab(user) {
  const dsTab = user.dsTab;
  if (!dsTab || typeof dsTab !== "object") return null;
  const direct = dsTab[DS_EXAM];
  if (direct && typeof direct === "object") return direct;
  if (num(dsTab.gradeOn20) != null || dsTab.lastSession || dsTab.attemptStarted) return dsTab;
  for (const v of Object.values(dsTab)) {
    if (v && typeof v === "object" && (v.lastSession || v.attemptStarted || num(v.gradeOn20) != null)) {
      return v;
    }
  }
  return null;
}

function computeGrade(score, total) {
  if (!total || total <= 0) return 0;
  const max = total * 4;
  return Math.round(Math.max(0, Math.min(20, (score / max) * 20)) * 10) / 10;
}

function resolveGrade(user, tab) {
  const grades = [];
  if (!tab) return 0;
  const walk = (o, d) => {
    if (!o || typeof o !== "object" || d > 20) return;
    if (Array.isArray(o)) return o.forEach((x) => walk(x, d + 1));
    for (const k of ["gradeOn20", "gradeOn20Provisional"]) {
      const n = num(o[k]);
      if (n != null && n > 0) grades.push(n);
    }
    Object.values(o).forEach((x) => walk(x, d + 1));
  };
  walk(tab, 0);
  const score = num(tab.score);
  const total = num(tab.total);
  if (score != null && total != null && total > 0) grades.push(computeGrade(score, total));
  const ls = tab.lastSession;
  if (ls && typeof ls === "object") {
    const a = Array.isArray(ls.answers) ? ls.answers.length : 0;
    const t = num(ls.totalQuestions) ?? a;
    const s = num(ls.scorePoints) ?? 0;
    if (t > 0) grades.push(computeGrade(s, t));
  }
  return grades.length ? Math.max(...grades) : 0;
}

loadEnv();
const email = process.env.FIREBASE_ADMIN_EMAIL || process.env.VITE_FIREBASE_ADMIN_EMAIL;
const password = process.env.FIREBASE_ADMIN_PASSWORD;

if (!email || !password) {
  console.error("Manque FIREBASE_ADMIN_EMAIL / FIREBASE_ADMIN_PASSWORD dans .env");
  process.exit(1);
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
await signInWithEmailAndPassword(auth, email, password);
const db = getFirestore(app);

const usersSnap = await getDocs(collection(db, "users"));
const resultsSnap = await getDocs(collection(db, "dsSdgnResults"));

const users = usersSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
const results = resultsSnap.docs.map((d) => ({ uid: d.id, ...d.data() }));

let withTab = 0;
let withGrade = 0;
let withScoreOnly = 0;
let withAnswers = 0;
const samples = [];

for (const u of users) {
  if (u.role === "admin") continue;
  const tab = readDsTab(u);
  if (!tab) continue;
  withTab++;
  const g = resolveGrade(u, tab);
  const score = num(tab.score);
  const total = num(tab.total);
  const ls = tab.lastSession;
  const ans = ls && typeof ls === "object" && Array.isArray(ls.answers) ? ls.answers.length : 0;
  if (ans > 0) withAnswers++;
  if (g > 0) withGrade++;
  else if (score != null && score > 0) withScoreOnly++;

  if (samples.length < 8 && (g > 0 || tab.attemptStarted || ans > 0)) {
    samples.push({
      name: u.prenom || u.nom || u.email || u.id.slice(0, 8),
      gradeStored: num(tab.gradeOn20),
      score,
      total,
      answers: ans,
      resolved: g,
      forcedZero: tab.forcedZero,
      status: ls?.status,
    });
  }
}

let resWithGrade = 0;
for (const r of results) {
  if (num(r.gradeOn20) > 0) resWithGrade++;
}

console.log("=== DIAGNOSTIC DS SDGN ===");
console.log(`Users total: ${users.length}`);
console.log(`dsSdgnResults docs: ${results.length}`);
console.log(`Users avec dsTab detecte: ${withTab}`);
console.log(`  -> avec note resolue > 0: ${withGrade}`);
console.log(`  -> score>0 mais grade resolu 0: ${withScoreOnly}`);
console.log(`  -> lastSession.answers > 0: ${withAnswers}`);
console.log(`dsSdgnResults gradeOn20 > 0: ${resWithGrade}`);
console.log("\nEchantillon:");
for (const s of samples) {
  console.log(JSON.stringify(s));
}

// Keys on first user with dsTab
const first = users.find((u) => readDsTab(u));
if (first) {
  const tab = readDsTab(first);
  console.log("\nCles dsTab (1er eleve):", Object.keys(tab).join(", "));
  if (tab.lastSession && typeof tab.lastSession === "object") {
    console.log("Cles lastSession:", Object.keys(tab.lastSession).join(", "));
  }
}
