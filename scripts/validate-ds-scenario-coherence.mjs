/**
 * Verifie les 3 types DS : cas / calcul / cours.
 */
import { readFileSync } from "node:fs";
import { loadDsQcmFromSources } from "./ds-toolbox/parseSdgnQcmFromTs.mjs";
import {
  finalizeDsQuestion,
  getDsQuestionKind,
  isDsPureCoursBankId,
} from "./ds-toolbox/integrateDsQuestion.mjs";

const raw = loadDsQcmFromSources({
  bankPath: "src/data/sdgn/sdgnMissionQcmBank.ts",
  extraPath: "src/data/sdgn/sdgnDsPremiereQcm.ts",
  purePath: "src/data/sdgn/sdgnDsPremierePureCours.ts",
  casPath: "src/data/sdgn/sdgnDsPremiereCasEntreprise.ts",
});
const questions = raw.map(finalizeDsQuestion);

const kinds = { cas: 0, calcul: 0, cours: 0 };
let notDifficile = 0;

for (const q of questions) {
  kinds[getDsQuestionKind(q)] += 1;
  if (q.difficulte !== "difficile") notDifficile += 1;
  if (isDsPureCoursBankId(q.id) && getDsQuestionKind(q) !== "cours") {
    console.error("ERREUR: cours pur mal classe", q.id);
    process.exit(1);
  }
}

if (notDifficile > 0) {
  console.error(`Echec: ${notDifficile} questions pas en difficile`);
  process.exit(1);
}

console.log(
  `OK: ${questions.length} questions difficiles — cas ${kinds.cas}, calcul ${kinds.calcul}, cours ${kinds.cours}`,
);
