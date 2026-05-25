/**
 * Repare motMystereBank.ts / motMystereQcmMap.ts apres fix-all-fffd (tirets � -> accents).
 */
import fs from "node:fs";

const FILES = ["src/data/motMystereBank.ts", "src/data/motMystereQcmMap.ts"];

const REPLACEMENTS = [
  ["mm-assembl'e-g\u00e9n\u00e9rale", "mm-assembl\u00e9e-g\u00e9n\u00e9rale"],
  ["assembl'e g\u00e9n\u00e9rale", "assembl\u00e9e g\u00e9n\u00e9rale"],
  ["mm-coop\u2014rative", "mm-coop\u00e9rative"],
  ["mm-e-r\u2014putation", "mm-e-r\u00e9putation"],
  ["mm-st\u2014r\u2014otype", "mm-st\u00e9r\u00e9otype"],
  ["mm-\u2014valuation-professionnelle", "mm-\u00e9valuation-professionnelle"],
  ["mm-r\u2014tribution", "mm-r\u00e9tribution"],
  ["mm-valeur-per\u2014ue", "mm-valeur-per\u00e7ue"],
  ["mm-valeur-financi\u2014re", "mm-valeur-financi\u00e8re"],
  ["mm-valeur-boursi\u2014re", "mm-valeur-boursi\u00e8re"],
  ["mm-compte-de-r\u2014sultat", "mm-compte-de-r\u00e9sultat"],
  ["mm-valeur-ajout\u2014e", "mm-valeur-ajout\u00e9e"],
  ["mm-consommations-interm\u2014diaires", "mm-consommations-interm\u00e9diaires"],
  ["mm-co\u2014t-de-revient", "mm-co\u00fbt-de-revient"],
  ["mm-rentabilit\u2014", "mm-rentabilit\u00e9"],
  ["mm-part-de-march\u2014", "mm-part-de-march\u00e9"],
  ["mm-messagerie-instantan\u2014e", "mm-messagerie-instantan\u00e9e"],
  ["mm-co-r\u2014daction", "mm-co-r\u00e9daction"],
  ["mm-\u2014v\u2014nement-d\u2019clencheur", "mm-\u00e9v\u00e9nement-d\u00e9clencheur"],
  ["mm-\u2014v\u2014nement-r\u2014sultat", "mm-\u00e9v\u00e9nement-r\u00e9sultat"],
  ["\u2014v\u2014nement", "\u00e9v\u00e9nement"],
  ["d\u2019clencheur", "d\u00e9clencheur"],
  ["d\u2019marre", "d\u00e9marre"],
  ["d\u2019clencher", "d\u00e9clencher"],
  ["d\u2019placements", "d\u00e9placements"],
  ["int\u2014gr\u2014", "int\u00e9gr\u00e9"],
  ["entrep\u2014t", "entrep\u00f4t"],
  ["informatis\u2014", "informatis\u00e9"],
  ["contr\u2014le", "contr\u00f4le"],
  ["r\u2014sultat", "r\u00e9sultat"],
  ["r\u2014el", "r\u00e9el"],
  ["r\u2014duit", "r\u00e9duit"],
  ["r\u2014diger", "r\u00e9diger"],
  ["r\u2014daction", "r\u00e9daction"],
  ["coop\u2014ration", "coop\u00e9ration"],
  ["reli\u2014s", "reli\u00e9s"],
  ["automatis\u2014", "automatis\u00e9"],
  ["organis\u2014", "organis\u00e9"],
  ["compl\u2014mentaires", "compl\u00e9mentaires"],
  ["diff\u2014rents", "diff\u00e9rents"],
  ["sch\u2014ma", "sch\u00e9ma"],
  ["simultan\u2014", "simultan\u00e9"],
  ["m\u2014me", "m\u00eame"],
  ["Encha\u2014nement", "Encha\u00eenement"],
  ["R\u2014union", "R\u00e9union"],
  ["r\u2014approvisionnement", "r\u00e9approvisionnement"],
  ["Utilis\u00e0", "Utilis\u00e9"],
  ["cit\u00e0", "cit\u00e9"],
  ["li\u00e0", "li\u00e9"],
  ["entr\u2014e", "entr\u00e9e"],
  ["Exemple cit\u00e9 : Microsoft Teams chez Renault.", "Outil de communication \u00e0 distance en temps r\u00e9el."],
  ["Exemple chez Express Nord.", "Pilotage des stocks et pr\u00e9paration des commandes en entrep\u00f4t."],
];

const TAIL_BLOCK = `  {
    id: "mm-e-commerce",
    term: "e-commerce",
    chapter: 8,
    hints: [
      "Transactions commerciales r\u00e9alis\u00e9es sur Internet.",
      "Permet la vente en ligne sans magasin physique obligatoire.",
      "Composante du commerce \u00e9lectronique.",
      "Deux mots anglais : commerce en ligne.",
    ],
  },
  {
    id: "mm-wms",
    term: "WMS",
    aliases: ["warehouse management system"],
    chapter: 8,
    hints: [
      "Sigle anglais : Warehouse Management System.",
      "Logiciel de gestion d'entrep\u00f4t (stocks, emplacements).",
      "Automatise la pr\u00e9paration et le suivi des commandes.",
      "Trois lettres : entrep\u00f4t informatis\u00e9.",
    ],
  },
];`;

for (const file of FILES) {
  let s = fs.readFileSync(file, "utf8");
  for (const [from, to] of REPLACEMENTS) {
    s = s.split(from).join(to);
  }
  if (file.includes("motMystereBank")) {
    s = s.replace(
      /  \{\s*id: "mm-pgi",\s*term: "PGI",\s*chapter: 8,[\s\S]*?\},\s*\{\s*id: "mm-wms",[\s\S]*?\},\s*\];/,
      TAIL_BLOCK,
    );
  }
  fs.writeFileSync(file, s, "utf8");
  const dash = [...s].filter((c) => c === "\u2014").length;
  const fffd = [...s].filter((c) => c === "\uFFFD").length;
  console.log(file, "em-dash:", dash, "fffd:", fffd);
}

// Passe 2 : tirets � restants -> accent aigu, puis corrections ciblees
const bankPath = "src/data/motMystereBank.ts";
let bank = fs.readFileSync(bankPath, "utf8");
bank = bank.replace(/\u2014/g, "\u00e9");
const POST = [
  ["entrep\u00e9t", "entrep\u00f4t"],
  ["int\u00e9gr\u00e0", "int\u00e8gre"],
  ["associ\u00e0", "associ\u00e9"],
  ["finalit\u00e0", "finalit\u00e9"],
  ["vari\u00c9t\u00e9", "vari\u00e9t\u00e9"],
  ["coop\u00e9rative", "coop\u00e9rative"],
  ["mm-coop\u00e9rative", "mm-coop\u00e9rative"],
  ["term: \"coop\u00e9rative\"", "term: \"coop\u00e9rative\""],
  ["t\u00e9l\u2019travail", "t\u00e9l\u00e9travail"],
  ["\u2019", "'"],
];
for (const [a, b] of POST) bank = bank.split(a).join(b);
fs.writeFileSync(bankPath, bank, "utf8");
console.log(
  "pass2 em-dash",
  [...bank].filter((c) => c === "\u2014").length,
);
