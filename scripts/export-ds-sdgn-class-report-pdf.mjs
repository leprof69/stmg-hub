/**
 * Export PDF rapport DS SDGN depuis Firestore (toutes les copies detectees).
 *
 * Usage :
 *   FIREBASE_ADMIN_EMAIL=prof@... FIREBASE_ADMIN_PASSWORD=... node scripts/export-ds-sdgn-class-report-pdf.mjs
 *
 * Sortie : docs/rapport-ds-sdgn-classe-AAAA-MM-JJ.pdf
 */
import { mkdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { createPdfWriter } from "./bac-toolbox/pdf-helpers.mjs";
import { buildStudentRow, hasDsTabExamData } from "./ds-report-toolbox/dsTabRead.mjs";

const OUT_DIR = "docs";
const firebaseConfig = {
  apiKey: "AIzaSyDYkmxm99cMZBp553EQM3rH_7H1sjzHGvg",
  authDomain: "stmg-hub.firebaseapp.com",
  projectId: "stmg-hub",
  storageBucket: "stmg-hub.firebasestorage.app",
  messagingSenderId: "270987336613",
  appId: "1:270987336613:web:822d940bc5365e0646664c",
};

const TOPIC_LABELS = {
  conditions_travail: "Conditions de travail",
  numerique: "Numerique",
  valeurs_creation: "Creation de valeurs",
  performance_globale: "Performance globale",
  prix_couts_marges: "Prix, couts et marges",
};
const TOPIC_ORDER = Object.keys(TOPIC_LABELS);

function loadEnvFile() {
  const path = join(process.cwd(), ".env");
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!m || process.env[m[1]]) continue;
    process.env[m[1]] = m[2].replace(/^["']|["']$/g, "").trim();
  }
}

function formatGrade(row) {
  const sess = row.session;
  if (!sess && row.examRootGrade > 0) return String(row.examRootGrade);
  if (!sess) return "\u2014";
  if (sess.forcedZero || row.displayStatus === "disqualified") {
    const p = sess.gradeOn20Provisional ?? row.examRootGrade ?? sess.gradeOn20;
    return p > 0 ? `${p} (prov.)` : "0";
  }
  if (row.displayStatus === "incomplete") {
    const p = sess.gradeOn20Provisional ?? row.examRootGrade ?? sess.gradeOn20;
    return `${p} (prov.)`;
  }
  const g = sess.gradeOn20 > 0 ? sess.gradeOn20 : row.examRootGrade ?? 0;
  return g > 0 ? String(g) : "0";
}

function statusLabel(st) {
  const map = {
    not_started: "Jamais commence",
    incomplete: "Non termine",
    completed: "Termine",
    disqualified: "Anti-triche (0)",
  };
  return map[st] || st;
}

async function fetchUsers() {
  const email = process.env.FIREBASE_ADMIN_EMAIL;
  const password = process.env.FIREBASE_ADMIN_PASSWORD;
  if (!email || !password) {
    console.error(
      "Definis FIREBASE_ADMIN_EMAIL et FIREBASE_ADMIN_PASSWORD (ou .env) pour lire Firestore.",
    );
    process.exit(1);
  }
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  await signInWithEmailAndPassword(auth, email, password);
  const db = getFirestore(app);
  const snap = await getDocs(collection(db, "users"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

async function writePdf(students, outPath) {
  const pdf = await createPdfWriter();
  const { doc, page } = pdf;
  const stamp = new Date().toISOString().slice(0, 10);

  pdf.heading("STMG HUB \u2014 Rapport DS SDGN Premiere (export Firestore)", 1);
  pdf.write(`Genere le ${new Date().toLocaleString("fr-FR")}`, { size: 10, color: [71, 85, 105] });
  pdf.write(
    `${students.length} eleve(s) avec copie DS \u00b7 ` +
      `${students.filter((s) => s.displayStatus === "completed").length} termine(s)`,
    { size: 10, color: [71, 85, 105] },
  );
  pdf.rule();

  pdf.heading("1. Synthese", 2);
  const cols = ["Eleve", "Statut", "Note", ...TOPIC_ORDER.map((t) => TOPIC_LABELS[t].slice(0, 12))];
  const colWidths = [130, 70, 45, ...TOPIC_ORDER.map(() => 50)];
  const rows = students.map((s) => {
    const sess = s.session;
    const topics = TOPIC_ORDER.map((topic) => {
      const stat = sess?.topicStats?.[topic];
      if (!stat || stat.total <= 0) return "N/E";
      return stat.acquis ? "Acquis" : "Non";
    });
    return [s.studentName, statusLabel(s.displayStatus), formatGrade(s), ...topics];
  });
  pdf.drawTable(cols, rows, { colWidths, fontSize: 8, rowH: 14 });

  pdf.heading("2. Detail des reponses", 2);
  for (const s of students) {
    pdf.heading(`${s.studentName} \u2014 ${formatGrade(s)}`, 2);
    const answers = s.session?.answers ?? [];
    if (!answers.length) {
      pdf.write("Pas de detail reponses enregistre (note racine uniquement).", {
        size: 9,
        color: [100, 116, 139],
      });
      continue;
    }
    answers.forEach((a, idx) => {
      pdf.write(
        `Q${idx + 1} \u00b7 ${a.topic || "?"} \u00b7 ${a.outcome === 1 ? "Correct" : "Incorrect"}`,
        { size: 9, indent: 8 },
      );
    });
    pdf.rule();
  }

  pdf.save(outPath);
  console.log(`PDF ecrit : ${outPath}`);
}

async function main() {
  loadEnvFile();
  mkdirSync(OUT_DIR, { recursive: true });
  const users = await fetchUsers();
  const students = users
    .filter((u) => u.role !== "admin")
    .filter((u) => hasDsTabExamData(u))
    .map(buildStudentRow)
    .sort((a, b) => a.studentName.localeCompare(b.studentName, "fr"));

  if (!students.length) {
    console.error("Aucune copie DS detectee dans users/* / dsTab / sdgn_premiere_qcm_v1");
    process.exit(1);
  }

  const outPath = join(OUT_DIR, `rapport-ds-sdgn-classe-${new Date().toISOString().slice(0, 10)}.pdf`);
  await writePdf(students, outPath);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
