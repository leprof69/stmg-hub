/**
 * Regenere motMystereQcmMap.ts : ids depuis la banque, QCM par ordre fixe.
 */
import fs from "node:fs";
import { MOT_MYSTERE_BANK } from "../src/data/motMystereBank.ts";

/** Un QCM SDGN par entree, dans l'ordre de MOT_MYSTERE_BANK. */
const QCM_IDS_IN_BANK_ORDER = [
  "sdgn1-03",
  "sdgn1-02",
  "sdgn1-01",
  "sdgn1-05",
  "sdgn1-08",
  "sdgn1-07",
  "sdgn2-02",
  "sdgn2-03",
  "sdgn2-07",
  "sdgn2-08",
  "sdgn3-01",
  "sdgn3-02",
  "sdgn3-04",
  "sdgn3-07",
  "sdgn3-11",
  "sdgn4-02",
  "sdgn4-03",
  "sdgn4-04",
  "sdgn4-05",
  "sdgn5-01",
  "sdgn5-03",
  "sdgn5-02",
  "sdgn5-05",
  "sdgn6-01",
  "sdgn6-02",
  "sdgn6-06",
  "sdgn6-05",
  "sdgn6-08",
  "sdgn9-01",
  "sdgn9-02",
  "sdgn9-04",
  "sdgn9-11",
  "sdgn9-08",
  "sdgn10-04",
  "sdgn10-05",
  "sdgn10-23",
  "sdgn10-01",
  "sdgn10-03",
  "sdgn11-01",
  "sdgn11-02",
  "sdgn11-03",
  "sdgn11-07",
  "sdgn12-01",
  "sdgn12-02",
  "sdgn13-01",
  "sdgn13-06",
  "sdgn13-05",
  "sdgn13-08",
  "sdgn13-09",
  "sdgn7-01",
  "sdgn7-02",
  "sdgn7-04",
  "sdgn7-03",
  "sdgn7-58",
  "sdgn8-01",
  "sdgn8-02",
  "sdgn8-11",
  "sdgn8-04",
  "sdgn8-13",
];

if (QCM_IDS_IN_BANK_ORDER.length !== MOT_MYSTERE_BANK.length) {
  console.error(
    "count mismatch",
    QCM_IDS_IN_BANK_ORDER.length,
    MOT_MYSTERE_BANK.length,
  );
  process.exit(1);
}

const lines = [
  "/** QCM de cours SDGN lie a chaque entree Mot mystere (mode secours). */",
  "export const MOT_MYSTERE_QCM_BY_ENTRY_ID: Record<string, string> = {",
];

for (let i = 0; i < MOT_MYSTERE_BANK.length; i++) {
  const entry = MOT_MYSTERE_BANK[i];
  lines.push(
    `  ${JSON.stringify(entry.id)}: ${JSON.stringify(QCM_IDS_IN_BANK_ORDER[i])},`,
  );
}
lines.push("};", "");

fs.writeFileSync("src/data/motMystereQcmMap.ts", lines.join("\n"), "utf8");
console.log("ok", MOT_MYSTERE_BANK.length);
