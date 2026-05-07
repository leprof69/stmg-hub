const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const files = [
  path.join(root, "exports", "retours_personnalises_ds_chap13_2026.md"),
  path.join(root, "exports", "retours_personnalises_ds_chap13_2026_detaille.md"),
  path.join(root, "scripts", "generate_retours_ds_pdf.cjs"),
];

// ASCII source file on purpose: accented output is written with Unicode escapes.
const replacements = [
  ["personnalises", "personnalis\u00e9s"],
  ["personnalisee", "personnalis\u00e9e"],
  ["detaille", "d\u00e9taill\u00e9"],
  ["detailles", "d\u00e9taill\u00e9s"],
  ["Legende", "L\u00e9gende"],
  ["utilisee", "utilis\u00e9e"],
  ["rediger", "r\u00e9diger"],
  ["redige", "r\u00e9dig\u00e9"],
  ["reponse", "r\u00e9ponse"],
  ["reponses", "r\u00e9ponses"],
  ["Reponse", "R\u00e9ponse"],
  ["idee", "id\u00e9e"],
  ["idees", "id\u00e9es"],
  ["presente", "pr\u00e9sente"],
  ["precision", "pr\u00e9cision"],
  ["precis", "pr\u00e9cis"],
  ["precise", "pr\u00e9cise"],
  ["precises", "pr\u00e9cises"],
  ["definition", "d\u00e9finition"],
  ["definitions", "d\u00e9finitions"],
  ["incomplete", "incompl\u00e8te"],
  ["incompletes", "incompl\u00e8tes"],
  ["methode", "m\u00e9thode"],
  ["verifiable", "v\u00e9rifiable"],
  ["eleve", "\u00e9l\u00e8ve"],
  ["eleves", "\u00e9l\u00e8ves"],
  ["Eleve", "\u00c9l\u00e8ve"],
  ["evolution", "\u00e9volution"],
  ["Evolution", "\u00c9volution"],
  ["arrivee", "arriv\u00e9e"],
  ["depart", "d\u00e9part"],
  ["generale", "g\u00e9n\u00e9rale"],
  ["generales", "g\u00e9n\u00e9rales"],
  ["efficacite", "efficacit\u00e9"],
  ["Efficacite", "Efficacit\u00e9"],
  ["reussis", "r\u00e9ussis"],
  ["reussi", "r\u00e9ussi"],
  ["reussie", "r\u00e9ussie"],
  ["resultat", "r\u00e9sultat"],
  ["resultats", "r\u00e9sultats"],
  ["numerique", "num\u00e9rique"],
  ["interpretation", "interpr\u00e9tation"],
  ["interpretations", "interpr\u00e9tations"],
  ["etre", "\u00eatre"],
  ["interessants", "int\u00e9ressants"],
  ["interessant", "int\u00e9ressant"],
  ["differents", "diff\u00e9rents"],
  ["different", "diff\u00e9rent"],
  ["differente", "diff\u00e9rente"],
  ["differentes", "diff\u00e9rentes"],
  ["reflexes", "r\u00e9flexes"],
  ["plutot", "plut\u00f4t"],
  ["marche", "march\u00e9"],
  ["fidelisation", "fid\u00e9lisation"],
  ["demarche", "d\u00e9marche"],
  ["demarches", "d\u00e9marches"],
  ["ecrives", "\u00e9crives"],
  ["systematiquement", "syst\u00e9matiquement"],
  ["eviter", "\u00e9viter"],
  ["meme", "m\u00eame"],
  ["traitee", "trait\u00e9e"],
  ["traitees", "trait\u00e9es"],
  ["traite", "trait\u00e9"],
  ["donnees", "donn\u00e9es"],
  ["difficulte", "difficult\u00e9"],
  ["chiffres", "chiffr\u00e9s"],
  ["augmente", "augment\u00e9"],
  ["penalise", "p\u00e9nalise"],
  ["penalisee", "p\u00e9nalis\u00e9e"],
  ["deja", "d\u00e9j\u00e0"],
  ["disqualifiee", "disqualifi\u00e9e"],
  ["apparait", "appara\u00eet"],
  ["entrainer", "entra\u00eener"],
  ["entraine", "entra\u00eene"],
  ["priorite", "priorit\u00e9"],
  ["Priorite", "Priorit\u00e9"],
  ["concretes", "concr\u00e8tes"],
  ["concrete", "concr\u00e8te"],
  ["superieur", "sup\u00e9rieur"],
  ["inferieur", "inf\u00e9rieur"],
  ["couts", "co\u00fbts"],
  ["tente", "tent\u00e9"],
  ["tentee", "tent\u00e9e"],
  ["debut", "d\u00e9but"],
  ["apres", "apr\u00e8s"],
  ["tres", "tr\u00e8s"],
  ["ameliorer", "am\u00e9liorer"],
  ["amelioration", "am\u00e9lioration"],
  ["securiser", "s\u00e9curiser"],
  ["financiere", "financi\u00e8re"],
  ["financieres", "financi\u00e8res"],
  ["benefice", "b\u00e9n\u00e9fice"],
  ["laissees", "laiss\u00e9es"],
  ["laisses", "laiss\u00e9s"],
  ["fixes", "fix\u00e9s"],
  ["annees", "ann\u00e9es"],
  ["melanger", "m\u00e9langer"],
  ["completer", "compl\u00e9ter"],
  ["completes", "compl\u00e8tes"],
  ["maitrises", "ma\u00eetrises"],
  ["maitrise", "ma\u00eetrise"],
  ["generer", "g\u00e9n\u00e9rer"],
  ["grace", "gr\u00e2ce"],
  ["activite", "activit\u00e9"],
  ["renseigne", "renseign\u00e9"],
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
    .replace(/Correction detaillee question par question/g, "Correction d\u00e9taill\u00e9e question par question")
    .replace(/Correction question par question/g, "Correction question par question")
    .replace(/Chaque page eleve contient/g, "Chaque page \u00e9l\u00e8ve contient")
    .replace(/Reponse juste ou presque juste/g, "R\u00e9ponse juste ou presque juste")
    .replace(/Idee presente mais/g, "Id\u00e9e pr\u00e9sente mais")
    .replace(/Non traite/g, "Non trait\u00e9")
    .replace(/A revoir/g, "\u00c0 revoir")
    .replace(/a revoir/g, "\u00e0 revoir")
    .replace(/Chapitre 13 - VIVAALGERIE \+ POULPE/g, "Chapitre 13 - VIVAALGERIE + POULPE")
    .replace(/PDF genere/g, "PDF g\u00e9n\u00e9r\u00e9")
    .replace(/Accents restaures/g, "Accents restaur\u00e9s");

  fs.writeFileSync(file, text, "utf8");
  console.log(`Accents restaur\u00e9s : ${file}`);
}
