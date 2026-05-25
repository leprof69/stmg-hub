/**
 * Repare les U+FFFD introduits par un mauvais encodage (e, e, a, c, etc.).
 */
import fs from "node:fs";

const FILES = [
  "src/data/motMystereBank.ts",
  "src/pages/MotMystere.tsx",
];

function repair(text) {
  let s = text;
  // Ordre specifique avant regles generiques
  s = s.replace(/1 \uFFFD 13/g, "1 \u00e0 13");
  s = s.replace(/myst\uFFFDr\u00e9/gi, "myst\u00e8re");
  s = s.replace(/myst\uFFFDre/gi, "myst\u00e8re");
  s = s.replace(/Premi\uFFFDr\u00e9/g, "Premi\u00e8re");
  s = s.replace(/Premi\uFFFDre/g, "Premi\u00e8re");
  s = s.replace(/(\w)i\uFFFDr\u00e9/g, "$1i\u00e8re");
  s = s.replace(/(\w)i\uFFFDre\b/g, "$1i\u00e8re");
  s = s.replace(/(\w)\uFFFDes\b/g, "$1\u00e9es");
  s = s.replace(/(\w)\uFFFDee\b/g, "$1\u00e9e");
  s = s.replace(/(\w)\uFFFDue\b/g, "$1\u00e7ue");
  s = s.replace(/per\uFFFDue/g, "per\u00e7ue");
  s = s.replace(/(\w)\uFFFDr\u00e9union/g, "$1\u00e9union");
  s = s.replace(/r\uFFFDunion/g, "r\u00e9union");
  s = s.replace(/g\uFFFDn\uFFFDrale/g, "g\u00e9n\u00e9rale");
  s = s.replace(/g\uFFFDn\uFFFDral/g, "g\u00e9n\u00e9ral");
  s = s.replace(/coop\uFFFDrative/g, "coop\u00e9rative");
  s = s.replace(/r\uFFFDputation/g, "r\u00e9putation");
  s = s.replace(/st\uFFFDr\uotype/g, "st\u00e9r\u00e9otype");
  s = s.replace(/int\uFFFDgr\uFFFDe/g, "int\u00e9gr\u00e9");
  s = s.replace(/int\uFFFDgr\u00e9/g, "int\u00e9gr\u00e9");
  s = s.replace(/donn\uFFFDes/g, "donn\u00e9es");
  s = s.replace(/proc\uFFFDdures/g, "proc\u00e9dures");
  s = s.replace(/associ\uFFFDe/g, "associ\u00e9e");
  s = s.replace(/organis\uFFFDe/g, "organis\u00e9e");
  s = s.replace(/assembl\uFFFDe/g, "assembl\u00e9e");
  s = s.replace(/contr\uFFFDle/g, "contr\u00f4le");
  s = s.replace(/diffus\uFFFDe/g, "diffus\u00e9e");
  s = s.replace(/r\uFFFDseaux/g, "r\u00e9seaux");
  s = s.replace(/mesur\uFFFDe/g, "mesur\u00e9e");
  s = s.replace(/d\uFFFDgrad\uFFFDe/g, "d\u00e9grad\u00e9e");
  s = s.replace(/exp\uFFFDrience/g, "exp\u00e9rience");
  s = s.replace(/notori\uFFFDt\uFFFD/g, "notori\u00e9t\u00e9");
  s = s.replace(/spontan\uFFFDment/g, "spontan\u00e9ment");
  s = s.replace(/cit\uFFFDe/g, "cit\u00e9e");
  s = s.replace(/r\uFFFDsultat/g, "r\u00e9sultat");
  s = s.replace(/pr\uFFFDd\uFFFDfinis/g, "pr\u00e9d\u00e9finis");
  s = s.replace(/co\uFFFDt/g, "co\u00fbt");
  s = s.replace(/revient/g, "revient");
  s = s.replace(/visioconf\uFFFDrence/g, "visioconf\u00e9rence");
  s = s.replace(/instantan\uFFFDe/g, "instantan\u00e9e");
  s = s.replace(/co-r\uFFFDdaction/g, "co-r\u00e9daction");
  s = s.replace(/\uFFFDv\uFFFDnement/g, "\u00e9v\u00e9nement");
  s = s.replace(/d\uFFFDclencheur/g, "d\u00e9clencheur");
  s = s.replace(/r\uFFFDapprovisionnement/g, "r\u00e9approvisionnement");
  s = s.replace(/ \uFFFD /g, " \u00e0 ");
  s = s.replace(/ \uFFFD\u00b7 /g, " \u00b7 ");
  s = s.replace(/qualit\uFFFD\b/g, "qualit\u00e9");
  s = s.replace(/finalit\uFFFD\b/g, "finalit\u00e9");
  s = s.replace(/activit\uFFFD/g, "activit\u00e9");
  s = s.replace(/autoris\uFFFD/g, "autoris\u00e9");
  s = s.replace(/financi\uFFFD/g, "financi\u00e8");
  s = s.replace(/(\w)\uFFFDre\b/g, "$1\u00e8re");
  s = s.replace(/\uFFFD/g, "\u00e9");
  return s;
}

for (const file of FILES) {
  const raw = fs.readFileSync(file, "utf8");
  const fixed = repair(raw);
  const n = [...fixed].filter((c) => c === "\uFFFD").length;
  fs.writeFileSync(file, fixed, "utf8");
  console.log(file, "remaining fffd:", n);
}
