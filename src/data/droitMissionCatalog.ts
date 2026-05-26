/** Genere par scripts/generate_droit_missions.py */
export const DROIT_MISSIONS_PROGRESS_VERSION = 1 as const;
export type DroitMissionMeta = { title: string; chapter: string; xpMax: number };
export const DROIT_MISSION_BY_ID: Record<string, DroitMissionMeta> = {
  "drt1-e1": { title: "Le contrat au quotidien", chapter: "Droit Chapitre 1", xpMax: 120 },
  "drt1-e2": { title: "Libert\u00e9 contractuelle", chapter: "Droit Chapitre 1", xpMax: 130 },
  "drt1-e3": { title: "Obligations de donner, faire et ne pas faire", chapter: "Droit Chapitre 1", xpMax: 140 },
  "drt1-e4": { title: "Obligation de moyens ou de r\u00e9sultat", chapter: "Droit Chapitre 1", xpMax: 180 },
  "drt1-e5": { title: "Contrat de consommation et information", chapter: "Droit Chapitre 1", xpMax: 190 },
  "drt1-e6": { title: "Droit de r\u00e9tractation en ligne", chapter: "Droit Chapitre 1", xpMax: 210 },
  "drt1-e7": { title: "Offre et acceptation", chapter: "Droit Chapitre 1", xpMax: 230 },
  "drt1-e8": { title: "Vices du consentement", chapter: "Droit Chapitre 1", xpMax: 260 },
  "drt1-e9": { title: "Capacit\u00e9 et nullit\u00e9", chapter: "Droit Chapitre 1", xpMax: 280 },
  "drt1-e10": { title: "Objet et cause du contrat", chapter: "Droit Chapitre 1", xpMax: 360 },
  "drt1-cas1": { title: "\u00c9tude de cas : achat de smartphone en ligne", chapter: "Droit Chapitre 1", xpMax: 560 },
  "drt1-cas2": { title: "\u00c9tude de cas : signature sous pression", chapter: "Droit Chapitre 1", xpMax: 620 },
  "drt2-e1": { title: "Force obligatoire du contrat", chapter: "Droit Chapitre 2", xpMax: 120 },
  "drt2-e2": { title: "Bonne foi dans l'ex\u00e9cution", chapter: "Droit Chapitre 2", xpMax: 130 },
  "drt2-e3": { title: "Effet relatif et stipulation pour autrui", chapter: "Droit Chapitre 2", xpMax: 140 },
  "drt2-e4": { title: "Exception d'inex\u00e9cution", chapter: "Droit Chapitre 2", xpMax: 180 },
  "drt2-e5": { title: "Mise en demeure", chapter: "Droit Chapitre 2", xpMax: 190 },
  "drt2-e6": { title: "Ex\u00e9cution forc\u00e9e : saisie et astreinte", chapter: "Droit Chapitre 2", xpMax: 210 },
  "drt2-e7": { title: "Clause r\u00e9solutoire et clause p\u00e9nale", chapter: "Droit Chapitre 2", xpMax: 230 },
  "drt2-e8": { title: "Clauses abusives", chapter: "Droit Chapitre 2", xpMax: 260 },
  "drt2-e9": { title: "R\u00e9solution et r\u00e9siliation", chapter: "Droit Chapitre 2", xpMax: 280 },
  "drt2-e10": { title: "Synth\u00e8se ex\u00e9cution et bonne foi", chapter: "Droit Chapitre 2", xpMax: 360 },
  "drt2-cas1": { title: "\u00c9tude de cas : livraison retard\u00e9e B2B", chapter: "Droit Chapitre 2", xpMax: 560 },
  "drt2-cas2": { title: "\u00c9tude de cas : forfait mobile r\u00e9sili\u00e9", chapter: "Droit Chapitre 2", xpMax: 620 },
  "drt3-e1": { title: "Responsabilit\u00e9 civile et p\u00e9nale", chapter: "Droit Chapitre 3", xpMax: 120 },
  "drt3-e2": { title: "Dommages mat\u00e9riel, corporel et moral", chapter: "Droit Chapitre 3", xpMax: 130 },
  "drt3-e3": { title: "Caract\u00e8res du dommage r\u00e9parable", chapter: "Droit Chapitre 3", xpMax: 140 },
  "drt3-e4": { title: "R\u00e9paration int\u00e9grale", chapter: "Droit Chapitre 3", xpMax: 180 },
  "drt3-e5": { title: "Assurance responsabilit\u00e9 civile", chapter: "Droit Chapitre 3", xpMax: 190 },
  "drt3-e6": { title: "FGAO et victimes non assur\u00e9es", chapter: "Droit Chapitre 3", xpMax: 210 },
  "drt3-e7": { title: "Pr\u00e9judice \u00e9cologique", chapter: "Droit Chapitre 3", xpMax: 230 },
  "drt3-e8": { title: "Assurance de biens et de personnes", chapter: "Droit Chapitre 3", xpMax: 260 },
  "drt3-e9": { title: "FGTI et solidarit\u00e9", chapter: "Droit Chapitre 3", xpMax: 280 },
  "drt3-e10": { title: "Synth\u00e8se dommage et assurance", chapter: "Droit Chapitre 3", xpMax: 360 },
  "drt3-cas1": { title: "\u00c9tude de cas : accident de voiture", chapter: "Droit Chapitre 3", xpMax: 560 },
  "drt3-cas2": { title: "\u00c9tude de cas : pollution rivi\u00e8re", chapter: "Droit Chapitre 3", xpMax: 620 },
  "drt4-e1": { title: "Contractuelle et extracontractuelle", chapter: "Droit Chapitre 4", xpMax: 120 },
  "drt4-e2": { title: "Trois \u00e9l\u00e9ments de la responsabilit\u00e9", chapter: "Droit Chapitre 4", xpMax: 130 },
  "drt4-e3": { title: "Responsabilit\u00e9 du fait personnel", chapter: "Droit Chapitre 4", xpMax: 140 },
  "drt4-e4": { title: "Responsabilit\u00e9 du fait d'autrui", chapter: "Droit Chapitre 4", xpMax: 180 },
  "drt4-e5": { title: "Responsabilit\u00e9 du fait des choses", chapter: "Droit Chapitre 4", xpMax: 190 },
  "drt4-e6": { title: "Loi Badinter", chapter: "Droit Chapitre 4", xpMax: 210 },
  "drt4-e7": { title: "Produits d\u00e9fectueux", chapter: "Droit Chapitre 4", xpMax: 230 },
  "drt4-e8": { title: "Accident du travail", chapter: "Droit Chapitre 4", xpMax: 260 },
  "drt4-e9": { title: "Obligation de moyens vs r\u00e9sultat en responsabilit\u00e9", chapter: "Droit Chapitre 4", xpMax: 280 },
  "drt4-e10": { title: "Faute et responsabilit\u00e9 sans faute", chapter: "Droit Chapitre 4", xpMax: 360 },
  "drt4-cas1": { title: "\u00c9tude de cas : collision et Badinter", chapter: "Droit Chapitre 4", xpMax: 560 },
  "drt4-cas2": { title: "\u00c9tude de cas : produit d\u00e9fectueux", chapter: "Droit Chapitre 4", xpMax: 620 },
  "drt5-e1": { title: "Clause d'exon\u00e9ration de responsabilit\u00e9", chapter: "Droit Chapitre 5", xpMax: 120 },
  "drt5-e2": { title: "Cause \u00e9trang\u00e8re", chapter: "Droit Chapitre 5", xpMax: 130 },
  "drt5-e3": { title: "Force majeure", chapter: "Droit Chapitre 5", xpMax: 140 },
  "drt5-e4": { title: "Fait d'un tiers", chapter: "Droit Chapitre 5", xpMax: 180 },
  "drt5-e5": { title: "Fait de la victime", chapter: "Droit Chapitre 5", xpMax: 190 },
  "drt5-e6": { title: "Clause abusive et exon\u00e9ration", chapter: "Droit Chapitre 5", xpMax: 210 },
  "drt5-e7": { title: "Faute lourde et clause", chapter: "Droit Chapitre 5", xpMax: 230 },
  "drt5-e8": { title: "Cumul contractuel / extracontractuel", chapter: "Droit Chapitre 5", xpMax: 260 },
  "drt5-e9": { title: "Temp\u00eate et chantier", chapter: "Droit Chapitre 5", xpMax: 280 },
  "drt5-e10": { title: "Synth\u00e8se exon\u00e9ration", chapter: "Droit Chapitre 5", xpMax: 360 },
  "drt5-cas1": { title: "\u00c9tude de cas : livraison et temp\u00eate", chapter: "Droit Chapitre 5", xpMax: 560 },
  "drt5-cas2": { title: "\u00c9tude de cas : ski et faute victime", chapter: "Droit Chapitre 5", xpMax: 620 },
};

const ORDER_INDEX: Record<string, number> = Object.fromEntries(Object.keys(DROIT_MISSION_BY_ID).map((id, i) => [id, i]));
export function getDroitMissionMeta(exerciseId: string): DroitMissionMeta {
  return DROIT_MISSION_BY_ID[exerciseId] ?? { title: exerciseId, chapter: "Mission Droit", xpMax: 0 };
}
export function compareDroitExerciseIds(a: string, b: string): number {
  const ia = ORDER_INDEX[a] ?? 99999;
  const ib = ORDER_INDEX[b] ?? 99999;
  if (ia !== ib) return ia - ib;
  return a.localeCompare(b, "fr");
}