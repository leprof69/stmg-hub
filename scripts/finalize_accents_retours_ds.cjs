const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const files = [
  path.join(root, "exports", "retours_personnalises_ds_chap13_2026.md"),
  path.join(root, "exports", "retours_personnalises_ds_chap13_2026_detaille.md"),
  path.join(root, "scripts", "generate_retours_ds_pdf.cjs"),
];

const replacements = [
  ["elements", "\u00e9l\u00e9ments"],
  ["Elements", "\u00c9l\u00e9ments"],
  ["rentabilite", "rentabilit\u00e9"],
  ["Rentabilite", "Rentabilit\u00e9"],
  ["profitabilite", "profitabilit\u00e9"],
  ["Profitabilite", "Profitabilit\u00e9"],
  ["definis", "d\u00e9finis"],
  ["definit", "d\u00e9finit"],
  ["definir", "d\u00e9finir"],
  ["etapes", "\u00e9tapes"],
  ["Etapes", "\u00c9tapes"],
  ["formulees", "formul\u00e9es"],
  ["formulee", "formul\u00e9e"],
  ["difference", "diff\u00e9rence"],
  ["Difference", "Diff\u00e9rence"],
  ["calculee", "calcul\u00e9e"],
  ["calculees", "calcul\u00e9es"],
  ["calcule", "calcul\u00e9"],
  ["delai", "d\u00e9lai"],
  ["delais", "d\u00e9lais"],
  ["etaient", "\u00e9taient"],
  ["eloigne", "\u00e9loign\u00e9"],
  ["eloignee", "\u00e9loign\u00e9e"],
  ["eloignees", "\u00e9loign\u00e9es"],
  ["gener\u00e9", "g\u00e9n\u00e9r\u00e9"],
  ["utilisees", "utilis\u00e9es"],
  ["utilises", "utilis\u00e9s"],
  ["utilisee", "utilis\u00e9e"],
  ["utilise", "utilis\u00e9"],
  ["traitees", "trait\u00e9es"],
  ["traitee", "trait\u00e9e"],
  ["faible", "faible"],
  ["ecrire", "\u00e9crire"],
  ["choisis", "choisis"],
  ["presque", "presque"],
  ["repondre", "r\u00e9pondre"],
  ["reponds", "r\u00e9ponds"],
  ["repond", "r\u00e9pond"],
  ["ecart", "\u00e9cart"],
  ["ecarts", "\u00e9carts"],
  ["theorique", "th\u00e9orique"],
  ["departs", "d\u00e9parts"],
  ["prepare", "pr\u00e9pare"],
  ["preparee", "pr\u00e9par\u00e9e"],
  ["presque", "presque"],
  ["g\u00e9n\u00e9rales", "g\u00e9n\u00e9rales"],
];

function replaceWord(text, from, to) {
  return text.replace(new RegExp(`\\b${from}\\b`, "g"), to);
}

for (const file of files) {
  let text = fs.readFileSync(file, "utf8");
  for (const [from, to] of replacements) {
    text = replaceWord(text, from, to);
  }

  text = text
    .replace(/elle augment\u00e9/g, "elle augmente")
    .replace(/ils augment\u00e9/g, "ils augmentent")
    .replace(/elles augment\u00e9/g, "elles augmentent")
    .replace(/les indicateurs progressent/g, "les indicateurs progressent")
    .replace(/trop peu trait\u00e9s/g, "trop peu trait\u00e9s")
    .replace(/trop peu trait\u00e9es/g, "trop peu trait\u00e9es")
    .replace(/des exercices chiffr\u00e9s/g, "des exercices chiffr\u00e9s")
    .replace(/exercices chiffr\u00e9s/g, "exercices chiffr\u00e9s");

  fs.writeFileSync(file, text, "utf8");
  console.log(`Finition accents : ${file}`);
}
