import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const file = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "src", "pages", "Flashcards.tsx");
let s = fs.readFileSync(file, "utf8");

s = s.replace(
  /R\u00e9ponse insuffisante : carte renvoy\?e \? revoir \? l'\?tape suivante\./,
  "R\u00e9ponse insuffisante : carte renvoy\u00e9e \u00e0 revoir \u00e0 l'\u00e9tape suivante."
);
s = s.replace(/! Carte ma.trisee`/, "! Carte ma\u00eetris\u00e9e`");
s = s.replace(
  "setBanner(\"R?ponds d'abord puis clique sur 'V\u00e9rifier ma r\u00e9ponse' pour voir la correction.\")",
  "setBanner(\"R\u00e9ponds d'abord puis clique sur \u00ab V\u00e9rifier ma r\u00e9ponse \u00bb pour voir la correction.\")"
);

fs.writeFileSync(file, s, "utf8");
console.log("tail fixes done");
