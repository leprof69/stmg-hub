/** Remplace U+FFFD par les bonnes lettres dans correctionIA.ts */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const target = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "src/services/correctionIA.ts");
let c = fs.readFileSync(target, "utf8");

const pairs = [
  ["harmonis\u00e9e", /\uFFFD/g], // fallback last
];

// Word-level fixes for common broken patterns (file used U+FFFD for accented chars)
const replacements = [
  ["harmonis\u00e9e", "harmonis\uFFFDe"],
  ["Priorit\u00e9", "Priorit\uFFFD"],
  ["id\u00e9es", "id\uFFFDes"],
  ["s\u00e9mantique", "s\uFFFDmantique"],
  ["l\u00e9ger", "l\uFFFDger"],
  ["affich\u00e9s", "affich\uFFFDs"],
  ["r\u00e9sultat", "r\uFFFDsultat"],
  ["R\u00e9sum\u00e9", "R\uFFFDsum\uFFFD"],
  ["p\u00e9dagogique", "p\uFFFDagogique"],
  ["peut \u00eatre", "peut \uFFFDtre"],
  ["Donn\u00e9es", "Donn\uFFFDes"],
  ["structur\u00e9es", "structur\uFFFDes"],
  ["inject\u00e9es", "inject\uFFFDes"],
  ["assimil\u00e9s", "assimil\uFFFDs"],
  ["R\u00e9ponse", "R\uFFFDponse"],
  ["d\u00e9taill\u00e9e", "d\uFFFDtaill\uFFFDe"],
  ["mod\u00e8le", "mod\uFFFDle"],
  ["Rep\u00e8res", "Rep\uFFFDres"],
  ["\u00e0 conserver", "\uFFFD conserver"],
  ["l'\u00e9l\u00e8ve", "l'\uFFFDl\uFFFDve"],
  ["\u00c9valuation", "\uFFFDvaluation"],
  ["r\u00e9ponse", "r\uFFFDponse"],
  ["\u00e9l\u00e9ments", "\uFFFDl\uFFFDments"],
  ["pr\u00e9sente", "pr\uFFFDsente"],
  ["pr\u00e9sents", "pr\uFFFDsents"],
  ["appara\u00eet", "appara\u00eet".replace("î", "\uFFFD")],
  ["\u00e9loign\u00e9e", "\uFFFDloign\uFFFDe"],
  ["priorit\u00e9", "priorit\uFFFD"],
  ["d'\u00e9valuer", "d'\uFFFDvaluer"],
  ["premi\u00e8re", "premi\uFFFDre"],
  ["\u00e9l\u00e8ve", "\uFFFDl\uFFFDve"],
  ["commenc\u00e9", "commenc\uFFFD"],
  ["\u00e0 d\u00e9velopper", "\uFFFD d\uFFFDvelopper"],
  ["d\u00e9velopp\u00e9s", "d\uFFFDvelopp\uFFFDs"],
  ["rep\u00e9r\u00e9s", "rep\uFFFDr\uFFFDs"],
  ["structur\u00e9e", "structur\uFFFDe"],
  ["Id\u00e9e", "Id\uFFFDe"],
  ["align\u00e9e", "align\uFFFDe"],
  ["d\u00e9j\u00e0", "d\uFFFDj\uFFFD"],
  ["abord\u00e9es", "abord\uFFFDes"],
  ["crit\u00e8res", "crit\uFFFDres"],
  ["R\u00e8gles", "R\uFFFDgles"],
  ["\u00c9value", "\uFFFDvalue"],
  ["\u00e9 mobilis\u00e9es", "\uFFFD mobilis\uFFFDes"],
  ["p\u00e9nalise", "p\uFFFDnalise"],
  ["pr\u00e9cis", "pr\uFFFDcis"],
  ["d\u00e9cimal", "d\uFFFDcimal"],
  ["synth\u00e8se", "synth\uFFFDse"],
  ["compl\u00e8te", "compl\uFFFDte"],
  ["r\u00e9f\u00e9rence", "r\uFFFDf\uFFFDrence"],
  ["orient\u00e9s", "orient\uFFFDs"],
  ["\u00e0 6", "\uFFFD 6"],
  ["\u00e9crans", "\uFFFDcrans"],
  ["\u2014", "\uFFFD"], // em dash mistaken
];

for (const [good, bad] of replacements) {
  if (c.includes(bad)) c = c.split(bad).join(good);
}

fs.writeFileSync(target, c, "utf8");
const ok = c.includes("R\u00e9ponse trop \u00e9loign\u00e9e") && !c.includes("\uFFFD");
console.log(ok ? "OK" : "still broken", "fffd count:", (c.match(/\uFFFD/g) || []).length);
