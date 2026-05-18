/** Aligné sur les missions SDGN (page Missions) — pour le reporting admin sans importer la page. */
export const SDGN_MISSIONS_PROGRESS_VERSION = 1 as const;

export type SdgnMissionMeta = {
  title: string;
  chapter: string;
  xpMax: number;
};

const CH7 = "SDGN Chapitre 7";
const CH10 = "SDGN Chapitre 10";
const CH11 = "SDGN Chapitre 11";

export const SDGN_MISSION_BY_ID: Record<string, SdgnMissionMeta> = {
  "sdgn7-e1": { title: "Visioconférence et travail collaboratif", chapter: CH7, xpMax: 120 },
  "sdgn7-e2": { title: "Familles d'outils collaboratifs", chapter: CH7, xpMax: 130 },
  "sdgn7-e3": { title: "Comprendre le travail collaboratif", chapter: CH7, xpMax: 140 },
  "sdgn7-e4": { title: "E-communication et réseaux sociaux", chapter: CH7, xpMax: 180 },
  "sdgn7-e5": { title: "Communautés en ligne", chapter: CH7, xpMax: 190 },
  "sdgn7-e6": { title: "Réseau informatique de l'organisation", chapter: CH7, xpMax: 210 },
  "sdgn7-e7": { title: "Sécurisation, administrateur réseau et droits d'accès", chapter: CH7, xpMax: 230 },
  "sdgn7-e8": { title: "Internet, intranet et extranet", chapter: CH7, xpMax: 260 },
  "sdgn7-e9": { title: "Le réseau social interne", chapter: CH7, xpMax: 280 },
  "sdgn7-e10": { title: "Intelligence collective et intelligence artificielle", chapter: CH7, xpMax: 360 },
  "sdgn7-cas1": { title: "Étude de cas : Decathlon", chapter: CH7, xpMax: 560 },
  "sdgn7-cas2": { title: "Étude de cas : L'Oréal", chapter: CH7, xpMax: 620 },

  "sdgn10-e1": { title: "Lire un compte de résultat simplifié", chapter: CH10, xpMax: 120 },
  "sdgn10-e2": { title: "Charges et produits : classer", chapter: CH10, xpMax: 130 },
  "sdgn10-e3": { title: "Résultat net : bénéfice ou perte ?", chapter: CH10, xpMax: 140 },
  "sdgn10-e4": { title: "L'actif du bilan", chapter: CH10, xpMax: 180 },
  "sdgn10-e5": { title: "Le passif et les capitaux propres", chapter: CH10, xpMax: 190 },
  "sdgn10-e6": { title: "Valeur financière fondée sur le patrimoine", chapter: CH10, xpMax: 210 },
  "sdgn10-e7": { title: "La Bourse et le cours de l'action", chapter: CH10, xpMax: 230 },
  "sdgn10-e8": { title: "Facteurs influençant la valeur boursière", chapter: CH10, xpMax: 260 },
  "sdgn10-e9": { title: "Comparer valeur financière et valeur boursière", chapter: CH10, xpMax: 280 },
  "sdgn10-e10": { title: "Répartition de la valeur ajoutée", chapter: CH10, xpMax: 360 },
  "sdgn10-cas1": { title: "Étude de cas : Orange SA", chapter: CH10, xpMax: 560 },
  "sdgn10-cas2": { title: "Étude de cas : Doctolib, une start-up non cotée", chapter: CH10, xpMax: 620 },

  "sdgn11-e1": { title: "Les facteurs de production", chapter: CH11, xpMax: 120 },
  "sdgn11-e2": { title: "Le chiffre d'affaires", chapter: CH11, xpMax: 130 },
  "sdgn11-e3": { title: "Calculer la valeur ajoutée", chapter: CH11, xpMax: 140 },
  "sdgn11-e4": { title: "CA = quantités × prix unitaire HT", chapter: CH11, xpMax: 180 },
  "sdgn11-e5": { title: "Consommations intermédiaires", chapter: CH11, xpMax: 190 },
  "sdgn11-e6": { title: "Répartir la valeur ajoutée entre les acteurs", chapter: CH11, xpMax: 210 },
  "sdgn11-e7": { title: "Décisions de gestion et risque de conflit", chapter: CH11, xpMax: 230 },
  "sdgn11-e8": { title: "Salariés actionnaires", chapter: CH11, xpMax: 260 },
  "sdgn11-e9": { title: "Valeur actionnariale et valeur partenariale", chapter: CH11, xpMax: 280 },
  "sdgn11-e10": { title: "Concilier les deux logiques de valeur", chapter: CH11, xpMax: 360 },
  "sdgn11-cas1": { title: "Étude de cas : VertLift et la répartition de la VA", chapter: CH11, xpMax: 560 },
  "sdgn11-cas2": { title: "Étude de cas : Alliance Fromagerie × Grande distribution", chapter: CH11, xpMax: 620 },
};

const ORDER_INDEX: Record<string, number> = Object.fromEntries(
  Object.keys(SDGN_MISSION_BY_ID).map((id, i) => [id, i])
);

export function getSdgnMissionMeta(exerciseId: string): SdgnMissionMeta {
  return (
    SDGN_MISSION_BY_ID[exerciseId] ?? {
      title: exerciseId,
      chapter: "Mission SDGN",
      xpMax: 0,
    }
  );
}

export function compareSdgnExerciseIds(a: string, b: string): number {
  return (ORDER_INDEX[a] ?? 9999) - (ORDER_INDEX[b] ?? 9999);
}
