import type { SdgnMissionQcm } from "../data/sdgn/sdgnMissionQcmBank";
import { isDsSdgnCalculationQuestion } from "./dsSdgnQuestionTiming";

function normalizeDsText(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['']/g, "'");
}

/** Cas align\u00e9s sur le libell\u00e9 (priorit\u00e9 d\u00e9croissante). */
const THEMED_SITUATIONS: { match: (text: string) => boolean; situation: string }[] = [
  {
    match: (t) => /reseau social d'entreprise|\brse\b/.test(t),
    situation:
      "DataFlow d\u00e9ploie un r\u00e9seau social d'entreprise (RSE) sur son intranet : groupes par m\u00e9tier, fil du PDG, charte d'utilisation. Le DRH \u00e9value l'effet sur la communication interne.",
  },
  {
    match: (t) => /outil collaboratif|cloud collaboratif|communication interne/.test(t),
    situation:
      "DataFlow met en place un intranet et des espaces collaboratifs pour 400 salari\u00e9s sur deux sites.",
  },
  {
    match: (t) => /\bintranet\b/.test(t) && !/reseau social/.test(t),
    situation:
      "DataFlow met en place un intranet et des espaces collaboratifs pour 400 salari\u00e9s sur deux sites.",
  },
  {
    match: (t) => /big data|donnee massives/.test(t),
    situation:
      "DataFlow exploite de grands volumes de donn\u00e9es clients pour affiner sa logistique et ses campagnes.",
  },
  {
    match: (t) =>
      /intelligence artificielle|\bia\b|automatise|automatisation/.test(t) &&
      !/reseau social/.test(t),
    situation:
      "DataFlow teste l'automatisation du tri des demandes SAV par IA et chiffre les risques num\u00e9riques avant g\u00e9n\u00e9ralisation.",
  },
  {
    match: (t) => /rgpd|donnee personnelle|consentement/.test(t),
    situation:
      "DataFlow stocke des e-mails clients nominatifs ; le DPO alerte sur le consentement et la conformit\u00e9 RGPD.",
  },
  {
    match: (t) => /open data|data\.gouv/.test(t),
    situation:
      "DataFlow compare des jeux open data publics et des donn\u00e9es clients pour un projet d'\u00e9tude.",
  },
  {
    match: (t) =>
      /\bpgi\b|\berp\b|evenement declencheur|evenement-resultat|processus (logistique|commande|metier)/.test(
        t,
      ),
    situation:
      "DataFlow mod\u00e9lise son processus commande, pr\u00e9paration et exp\u00e9dition dans un PGI.",
  },
  {
    match: (t) => /identite numerique|e-reputation|linkedin|bad buzz/.test(t),
    situation:
      "Un recruteur de DataFlow consulte le profil public d'un candidat et rep\u00e8re une publication sensible.",
  },
  {
    match: (t) => /valeur ajoutee|consommations intermediaires/.test(t),
    situation:
      "GreenWave publie son compte de r\u00e9sultat et doit analyser la valeur ajout\u00e9e \u00e0 partir du CA et des CI.",
  },
  {
    match: (t) => /marge commerciale|prix d'achat|prix de vente|cout de revient|taux de marge/.test(t),
    situation:
      "Prix & Marge compare en rayon le prix d'achat, le prix de vente et la marge unitaire d'une r\u00e9f\u00e9rence.",
  },
  {
    match: (t) => /prix ttc|prix ht|\bttc\b|\bht\b|tva/.test(t),
    situation:
      "La comptabilit\u00e9 de Prix & Marge re\u00e7oit un prix TTC (TVA 20 %) et doit retrouver le HT.",
  },
  {
    match: (t) => /rentabilite financiere|profitabilite|part de marche|resultat net/.test(t),
    situation:
      "Helios communique ses r\u00e9sultats : le comit\u00e9 compare rentabilit\u00e9, profitabilit\u00e9 et part de march\u00e9.",
  },
  {
    match: (t) => /efficacite|efficience|performance globale|indicateur de performance/.test(t),
    situation:
      "Helios arbitre entre objectifs commerciaux, financiers, sociaux et environnementaux (performance globale).",
  },
  {
    match: (t) => /qvct|qualite de vie|conditions de travail|teletravail|ergonomie|eclairage/.test(t),
    situation:
      "NovaRetail organise un comit\u00e9 QVCT apr\u00e8s des signalements sur la p\u00e9nibilit\u00e9 en r\u00e9serve.",
  },
  {
    match: (t) => /equite interne|equite externe|remuneration|prime|grille d'evaluation/.test(t),
    situation:
      "NovaRetail compare salaires internes et r\u00e9mun\u00e9rations du march\u00e9 pour un m\u00eame poste.",
  },
  {
    match: (t) => /style de management|autocratique|consultatif|participatif|influence|manipulation/.test(t),
    situation:
      "Chez NovaRetail, un manager doit trancher sur son mode de d\u00e9cision et d'influence.",
  },
  {
    match: (t) =>
      /\bassociation\b|objet social|dividende|actionnaire|\bcse\b|\bago\b|\bpdg\b|forme juridique/.test(
        t,
      ),
    situation:
      "Une organisation revoit sa gouvernance : r\u00f4le des actionnaires, du personnel \u00e9lu et des parties prenantes.",
  },
  {
    match: (t) => /absenteisme|penibilite|bruit en reserve/.test(t),
    situation:
      "NovaRetail organise un comit\u00e9 QVCT apr\u00e8s des signalements sur la p\u00e9nibilit\u00e9 en r\u00e9serve.",
  },
  {
    match: (t) => /maslow|besoin d'appartenance|pyramide des besoins/.test(t),
    situation:
      "Un candidat et un recruteur de DataFlow \u00e9changent sur la motivation et le comportement professionnel.",
  },
  {
    match: (t) => /empreinte numerique|comportement professionnel/.test(t),
    situation:
      "Un recruteur de DataFlow consulte le profil public d'un candidat et rep\u00e8re une publication sensible.",
  },
  {
    match: (t) => /culture d'entreprise|valeurs partagees|rituels/.test(t),
    situation:
      "NovaRetail lance un projet pour renforcer valeurs, normes et rituels en magasin.",
  },
  {
    match: (t) => /fiche de poste|competence professionnelle|savoir-etre/.test(t),
    situation:
      "NovaRetail met \u00e0 jour une fiche de poste et la grille de comp\u00e9tences pour les vendeurs.",
  },
  {
    match: (t) => /co2|emission|environnementale/.test(t),
    situation:
      "Helios fixe des objectifs de r\u00e9duction des \u00e9missions de CO\u2082 dans son rapport RSE.",
  },
  {
    match: (t) => /bilan|actif du bilan|passif du bilan/.test(t),
    situation:
      "GreenWave pr\u00e9pare son bilan : r\u00e9partition entre actif et passif, dont les capitaux propres.",
  },
  {
    match: (t) => /\bva\b|valeur ajoutee|repartition de la va/.test(t),
    situation:
      "GreenWave publie son compte de r\u00e9sultat et doit analyser la valeur ajout\u00e9e \u00e0 partir du CA et des CI.",
  },
  {
    match: (t) => /valeur percue|influenceur|image de marque/.test(t),
    situation:
      "GreenWave subit une critique virale sur les r\u00e9seaux ; l'\u00e9quipe marketing analyse la valeur per\u00e7ue.",
  },
  {
    match: (t) => /valeur boursiere|cours action|capitaux propres/.test(t) && !/actif du bilan/.test(t),
    situation:
      "GreenWave suit l'\u00e9volution de sa valeur boursi\u00e8re et de ses capitaux propres en Bourse.",
  },
  {
    match: (t) => /capitaux propres.*actif|actif.*capitaux propres/.test(t),
    situation:
      "En cours de STMG, un \u00e9l\u00e8ve pr\u00e9sente un bilan o\u00f9 les capitaux propres sont \u00e0 l'actif.",
  },
];

export type DsQuestionKind = "cas" | "calcul" | "cours";

export const DS_QUESTION_KIND_LABEL: Record<DsQuestionKind, string> = {
  cas: "Cas entreprise",
  calcul: "Calcul",
  cours: "Cours",
};

/** Question qui contient déjà un contexte d'entreprise ou des données chiffrées. */
export function isDsQuestionWithEmbeddedCase(q: string): boolean {
  if (q.length >= 100) return true;
  if (/\d/.test(q) && /(\u20ac|EUR|%)/.test(q)) return true;
  if (/^(Entreprise|NovaRetail|DataFlow|GreenWave|Helios|Prix & Marge|SportSolidaire)/i.test(q)) {
    return true;
  }
  return false;
}

function pickThemedSituation(item: SdgnMissionQcm): string | null {
  const text = normalizeDsText(item.question);
  for (const themed of THEMED_SITUATIONS) {
    if (themed.match(text)) return themed.situation;
  }
  return null;
}

/** Trois types uniquement : cas entreprise, calcul simple, cours pur. */
export function getDsQuestionKind(item: SdgnMissionQcm): DsQuestionKind {
  if (isDsPureCoursBankId(item.id)) return "cours";
  if (isDsSdgnCalculationQuestion(item.question, item.choix)) return "calcul";
  if (
    item.id.startsWith("sdgn-ds-cas-") ||
    item.id.startsWith("sdgn-t-ds-") ||
    item.id.startsWith("sdgn-p-ds-")
  ) {
    return "cas";
  }
  if (isDsQuestionWithEmbeddedCase(item.question)) return "cas";
  if (pickThemedSituation(item)) return "cas";
  return "cours";
}

export function isDsPureCoursBankId(id: string): boolean {
  const n = Number(id.replace(/^sdgn-ds-/, ""));
  return Number.isFinite(n) && n >= 77;
}

/** \u00c9nonc\u00e9 DS unique : cas + question dans un seul paragraphe. */
export function buildIntegratedDsQuestionText(item: SdgnMissionQcm): string {
  if (isDsQuestionWithEmbeddedCase(item.question)) {
    return item.question;
  }
  const situation = pickThemedSituation(item);
  if (!situation) return item.question;
  const q = item.question.trim();
  const needsBridge = !/^(quelle|quel|quelles|le |la |l'|comment|pourquoi|combien|dans ce|apr\u00e8s|face \u00e0)/i.test(q);
  const bridge = needsBridge ? " : " : " ";
  return `${situation}${bridge}${q}`.replace(/\s+/g, " ").trim();
}

/** Texte affich\u00e9 \u00e0 l'\u00e9l\u00e8ve (un seul bloc, pas de cas s\u00e9par\u00e9). */
export function buildDsDisplayEnonce(item: SdgnMissionQcm): string {
  if (item.id.startsWith("sdgn-p-ds-") || item.id.startsWith("sdgn-t-ds-")) {
    return item.question;
  }
  const kind = getDsQuestionKind(item);
  if (kind === "cas" && pickThemedSituation(item) && !isDsQuestionWithEmbeddedCase(item.question)) {
    return buildIntegratedDsQuestionText(item);
  }
  return item.question;
}

/** @deprecated Utiliser buildDsDisplayEnonce (plus de bloc cas s\u00e9par\u00e9). */
export function buildDsScenarioText(item: SdgnMissionQcm): string | null {
  return null;
}

export function hasCoherentDsScenario(item: SdgnMissionQcm): boolean {
  return getDsQuestionKind(item) === "cas";
}

export function isDsBankQuestionEligible(item: SdgnMissionQcm): boolean {
  return item.difficulte === "difficile";
}
