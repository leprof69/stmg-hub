import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const file = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "src", "pages", "Flashcards.tsx");
let s = fs.readFileSync(file, "utf8");

const pairs = [
  ["Strat?giste Junior", "Strat\u00e9giste Junior"],
  ["Pilote de Donn?es", "Pilote de Donn\u00e9es"],
  ["Ma?tre R?vision", "Ma\u00eetre R\u00e9vision"],
  ['tous: "Toutes les mati?res"', 'tous: "Toutes les mati\u00e8res"'],
  ['economie: "?conomie"', 'economie: "\u00c9conomie"'],
  ['numerique_si: "Num?rique & SI"', 'numerique_si: "Num\u00e9rique & SI"'],
  ["Bonne r?ponse :", "Bonne r\u00e9ponse :"],
  ["R?ponse insuffisante :", "R\u00e9ponse insuffisante :"],
  [
    "R?ponds d'abord puis clique sur ? V?rifier ma r?ponse ? pour voir la correction.",
    "R\u00e9ponds d'abord puis clique sur \u00ab V\u00e9rifier ma r\u00e9ponse \u00bb pour voir la correction.",
  ],
  ["Progression du pack r?initialis?e.", "Progression du pack r\u00e9initialis\u00e9e."],
  ["R?initialisation locale effectu?e.", "R\u00e9initialisation locale effectu\u00e9e."],
  [
    "La validation est automatique apr?s v?rification de la r?ponse.",
    "La validation est automatique apr\u00e8s v\u00e9rification de la r\u00e9ponse.",
  ],
  ["Flashcards Bac ? Entra?nement actif", "Flashcards Bac \u00b7 Entra\u00eenement actif"],
  ["R?initialiser le pack", "R\u00e9initialiser le pack"],
  ["} ? jetons potentiels", "} \u00b7 jetons potentiels"],
  ["Ma?tris?es :", "Ma\u00eetris\u00e9es :"],
  ["S?rie :", "S\u00e9rie :"],
  [">? revoir :", ">\u00c0 revoir :"],
  ['"Badge d?bloqu?"', '"Badge d\u00e9bloqu\u00e9"'],
  ['"Badge verrouill?"', '"Badge verrouill\u00e9"'],
  ["} ? {m} cartes", "} \u00b7 {m} cartes"],
  ["Nouveau badge d?bloqu? :", "Nouveau badge d\u00e9bloqu\u00e9 :"],
  ["cartes ma?tris?es !", "cartes ma\u00eetris\u00e9es !"],
  ["Tu as valid? toutes", "Tu as valid\u00e9 toutes"],
  ["Ta r?ponse (zone", "Ta r\u00e9ponse (zone"],
  [
    'placeholder="?cris une d?finition courte avec les mots cl?s..."',
    'placeholder="\u00c9cris une d\u00e9finition courte avec les mots cl\u00e9s..."',
  ],
  ["V?rifier ma r?ponse", "V\u00e9rifier ma r\u00e9ponse"],
  [
    "R?ponse accept?e : carte valid?e ? l'?tape suivante.",
    "R\u00e9ponse accept\u00e9e : carte valid\u00e9e \u00e0 l'\u00e9tape suivante.",
  ],
  [
    "R?ponse insuffisante : carte renvoy?e ? revoir ? l'?tape suivante.",
    "R\u00e9ponse insuffisante : carte renvoy\u00e9e \u00e0 revoir \u00e0 l'\u00e9tape suivante.",
  ],
  ["Carte maitrisee", "Carte ma\u00eetrisee"],
];

const retryMsg =
  "R\u00e9ponse insuffisante : carte renvoy\u00e9e \u00e0 revoir \u00e0 l'\u00e9tape suivante.";
if (s.includes("renvoy?e")) {
  s = s.replace(
    /R\u00e9ponse insuffisante : carte renvoy\?e \? revoir \? l'\?tape suivante\./,
    retryMsg
  );
}
const helpLine =
  "              \u00c9cris ta r\u00e9ponse puis clique sur \u00ab V\u00e9rifier ma r\u00e9ponse \u00bb. Tu vois la correction, puis \u00ab Continuer \u00bb applique la d\u00e9cision automatique.\n";
s = s.replace(
  /<p style=\{\{ margin: "10px 0 0", color: "#64748B", fontSize: 13 \}\}>[\s\S]*?<\/p>/,
  `<p style={{ margin: "10px 0 0", color: "#64748B", fontSize: 13 }}>\n${helpLine}            </p>`
);

let n = 0;
for (const [from, to] of pairs) {
  if (from instanceof RegExp) {
    if (from.test(s)) {
      s = s.replace(from, (m) => m.replace(/>\s*[^<]+</, `>${to}<`));
      n++;
    }
  } else if (s.includes(from)) {
    s = s.split(from).join(to);
    n++;
  } else {
    console.warn("skip (not found):", from.slice?.(0, 50) ?? from);
  }
}

fs.writeFileSync(file, s, "utf8");
console.log("Flashcards.tsx updated,", n, "replacements");
