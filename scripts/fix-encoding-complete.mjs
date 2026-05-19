/**
 * Correction encodage : decode \\u dans JSX + mojibake Latin-1 courant.
 * Usage: node scripts/fix-encoding-complete.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "src");

function decodeEscapes(s) {
  return s
    .replace(/\\u\{([0-9a-fA-F]+)\}/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/\\u([0-9a-fA-F]{4})/gi, (_, h) => String.fromCharCode(parseInt(h, 16)));
}

/** UTF-8 lu comme Latin-1 (mojibake) */
const MOJIBAKE = [
  ["\u00c3\u00a9", "\u00e9"],
  ["\u00c3\u00a8", "\u00e8"],
  ["\u00c3\u00aa", "\u00ea"],
  ["\u00c3\u00ab", "\u00eb"],
  ["\u00c3\u00a0", "\u00e0"],
  ["\u00c3\u00b9", "\u00f9"],
  ["\u00c3\u00bc", "\u00fc"],
  ["\u00c3\u00b4", "\u00f4"],
  ["\u00c3\u00a7", "\u00e7"],
  ["\u00c3\u0089", "\u00c9"],
  ["\u00c3\u0088", "\u00c8"],
  ["\u00c3\u0094", "\u00d4"],
  ["\u00c2\u00ab", "\u00ab"],
  ["\u00c2\u00bb", "\u00bb"],
  ["\u00e2\u20ac\u201d", "\u2014"],
  ["\u00e2\u20ac\u201c", "\u2013"],
  ["\u00e2\u20ac\u2122", "\u2019"],
  ["\u00e2\u20ac\u0153", "\u0153"],
  ["\u00e2\u20ac\u00a6", "\u2026"],
  ["\u00e2\u2020\u2018", "\u2190"],
  ["\u00e2\u2020\u2019", "\u2191"],
  ["\u00e2\u2020\u2019", "\u2192"],
  ["\u00e2\u2020\u201c", "\u2193"],
];

/** Flashcards / fichiers avec ? a la place des accents (ordre: plus long d'abord) */
const QUESTION_MARK_FIXES = [
  ["Ma?tris?es", "Maîtrisées"],
  ["ma?tris?es", "maîtrisées"],
  ["R?initialisation locale effectu?e", "Réinitialisation locale effectuée"],
  ["Progression du pack r?initialis?e", "Progression du pack réinitialisée"],
  ["R?ponse insuffisante : carte renvoy?e ? revoir ? l'?tape suivante", "Réponse insuffisante : carte renvoyée à revoir à l'étape suivante"],
  ["R?ponse accept?e : carte valid?e ? l'?tape suivante", "Réponse acceptée : carte validée à l'étape suivante"],
  ["La validation est automatique apr?s v?rification de la r?ponse", "La validation est automatique après vérification de la réponse"],
  ["R?ponds d'abord puis clique sur 'V?rifier ma r?ponse' pour voir la correction", "Réponds d'abord puis clique sur « Vérifier ma réponse » pour voir la correction"],
  ["R?ponse insuffisante : lis la correction puis clique sur Continuer", "Réponse insuffisante : lis la correction puis clique sur Continuer"],
  ["Bonne r?ponse : lis la correction puis clique sur Continuer", "Bonne réponse : lis la correction puis clique sur Continuer"],
  ["?cris ta r?ponse puis clique sur ? V?rifier ma r?ponse ?. Tu vois la correction, puis ? Continuer ? applique la d?cision automatique", "Écris ta réponse puis clique sur « Vérifier ma réponse ». Tu vois la correction, puis « Continuer » applique la décision automatique"],
  ["placeholder=\"?cris une d?finition courte avec les mots cl?s...", "placeholder=\"Écris une définition courte avec les mots clés..."],
  ["V?rifier ma r?ponse", "Vérifier ma réponse"],
  ["Ta r?ponse (zone sous la carte)", "Ta réponse (zone sous la carte)"],
  ["Nouveau badge d?bloqu? :", "Nouveau badge débloqué :"],
  ["Badge verrouill?", "Badge verrouillé"],
  ["Badge d?bloqu?", "Badge débloqué"],
  ["Flashcards Bac ? Entra?nement actif", "Flashcards Bac · Entraînement actif"],
  ["R?initialiser le pack", "Réinitialiser le pack"],
  ["Tu as valid? toutes les cartes du pack", "Tu as validé toutes les cartes du pack"],
  ["? revoir :", "À revoir :"],
  ["} ? {m} cartes", "} · {m} cartes"],
  ["} ? jetons potentiels", "} · jetons potentiels"],
  ["Strat?giste Junior", "Stratégiste Junior"],
  ["Pilote de Donn?es", "Pilote de Données"],
  ["Ma?tre R?vision", "Maître Révision"],
  ["Toutes les mati?res", "Toutes les matières"],
  ["?conomie", "Économie"],
  ["Num?rique & SI", "Numérique & SI"],
  ["Tes d?cos", "Tes décos"],
  ["pi?ce", "pièce"],
  ["Aucune d?co s?lectionn?e", "Aucune déco sélectionnée"],
  ["Tu as d?j? utilis?", "Tu as déjà utilisé"],
];

function fixContent(content, filepath) {
  let out = content;

  for (const [bad, good] of MOJIBAKE) {
    if (out.includes(bad)) out = out.split(bad).join(good);
  }

  if (filepath.includes("Flashcards") || filepath.includes("Profil") || filepath.includes("CasinoSlots")) {
    for (const [bad, good] of QUESTION_MARK_FIXES) {
      if (out.includes(bad)) out = out.split(bad).join(good);
    }
  }

  // Attributs JSX label="\\u2191"
  out = out.replace(/(\s)([a-zA-Z][\w-]*)=(["'])([^"']*\\u[0-9a-fA-F]{4}[^"']*)\3/g, (m, sp, attr, q, val) => {
    const decoded = decodeEscapes(val);
    const escaped = decoded.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
    return `${sp}${attr}="${escaped}"`;
  });

  // Texte entre balises (hors accolades)
  out = out.replace(/>([^<>{}]*\\u[0-9a-fA-F]{4}[^<>{}]*)</g, (m, text) => {
    if (text.includes("{")) return m;
    return `>${decodeEscapes(text)}<`;
  });

  // Texte JSX avec \\u melange (ex: Salut ... \u2014 ...)
  out = out.replace(/>([^<]*\\u[0-9a-fA-F]{4}[^<]*)</g, (m, text) => {
    if (text.trim().startsWith("{")) return m;
    return `>${decodeEscapes(text)}<`;
  });

  return out;
}

function walk(dir, files = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, files);
    else if (/\.(tsx|ts)$/.test(name)) files.push(p);
  }
  return files;
}

let changed = 0;
for (const file of walk(ROOT)) {
  const raw = fs.readFileSync(file, "utf8");
  const fixed = fixContent(raw, file);
  if (fixed !== raw) {
    fs.writeFileSync(file, fixed, "utf8");
    console.log("fixed:", path.relative(ROOT, file));
    changed++;
  }
}
console.log("done,", changed, "file(s)");
