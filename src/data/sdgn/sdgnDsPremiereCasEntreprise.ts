import type { SdgnMissionQcm } from "./sdgnMissionQcmBank";

/**
 * QCM DS avec mise en situation entreprise explicite (niveau DS).
 */
export const SDGN_DS_CAS_ENTREPRISE: SdgnMissionQcm[] = [
  {
    id: "sdgn-ds-cas-01",
    chapter: 7,
    difficulte: "difficile",
    question:
      "DataFlow (400 salari\u00e9s) d\u00e9ploie un RSE sur l'intranet. Apr\u00e8s trois mois, les \u00e9quipes signalent des fuites d'information via des captures d'\u00e9cran. Quelle mesure est la plus adapt\u00e9e en priorit\u00e9 ?",
    choix: [
      "Supprimer le RSE",
      "Renforcer la charte, la formation et les droits d'acc\u00e8s",
      "Publier toutes les discussions en open data",
      "Interdire le t\u00e9l\u00e9travail",
    ],
    bonIndex: 1,
  },
  {
    id: "sdgn-ds-cas-02",
    chapter: 4,
    difficulte: "difficile",
    question:
      "NovaRetail : le comit\u00e9 QVCT constate un taux d'absent\u00e9isme de 14 % en r\u00e9serve (objectif : 8 %). Quel indicateur de performance est principalement en cause ?",
    choix: ["Commerciale", "Sociale", "Boursi\u00e8re", "Environnementale"],
    bonIndex: 1,
  },
  {
    id: "sdgn-ds-cas-03",
    chapter: 5,
    difficulte: "difficile",
    question:
      "NovaRetail compare le salaire d'une vendeuse (1 850 \u20ac) \u00e0 la grille interne (1 900 \u20ac) et au march\u00e9 (2 000 \u20ac). Quels principes d'\u00e9quit\u00e9 sont en jeu ?",
    choix: [
      "\u00c9quit\u00e9 interne et externe",
      "Uniquement la profitabilit\u00e9",
      "La valeur boursi\u00e8re",
      "L'open data",
    ],
    bonIndex: 0,
  },
  {
    id: "sdgn-ds-cas-04",
    chapter: 11,
    difficulte: "difficile",
    question:
      "GreenWave : CA 920 000 \u20ac, consommations interm\u00e9diaires 598 000 \u20ac. La valeur ajout\u00e9e est :",
    choix: ["322 000 \u20ac", "1 518 000 \u20ac", "598 000 \u20ac", "322 %"],
    bonIndex: 0,
  },
  {
    id: "sdgn-ds-cas-05",
    chapter: 12,
    difficulte: "difficile",
    question:
      "Prix & Marge : un produit est achet\u00e9 48 \u20ac HT et revendu 79 \u20ac HT. La marge commerciale unitaire est :",
    choix: ["31 \u20ac", "127 \u20ac", "48 \u20ac", "1,65 \u20ac"],
    bonIndex: 0,
  },
  {
    id: "sdgn-ds-cas-06",
    chapter: 13,
    difficulte: "difficile",
    question:
      "Helios a d\u00e9pass\u00e9 son objectif de CA (+12 %) mais sa marge a baiss\u00e9 de 4 points. L'entreprise est surtout :",
    choix: [
      "Efficace et efficiente",
      "Efficace mais peu efficiente",
      "Efficiente mais peu efficace",
      "Ni efficace ni efficiente",
    ],
    bonIndex: 1,
  },
  {
    id: "sdgn-ds-cas-07",
    chapter: 6,
    difficulte: "difficile",
    question:
      "DataFlow stocke e-mails clients et historiques d'achats sans base l\u00e9gale. Le DPO alerte. Quel cadre est le plus directement concern\u00e9 ?",
    choix: ["Open data", "RGPD (donn\u00e9es personnelles)", "Code de commerce sur la VA", "Note de service"],
    bonIndex: 1,
  },
  {
    id: "sdgn-ds-cas-08",
    chapter: 3,
    difficulte: "difficile",
    question:
      "Chez NovaRetail, un manager consulte l'\u00e9quipe puis d\u00e9cide seul sur les horaires. Quel style de management correspond le mieux ?",
    choix: ["Autocratique pur", "Consultatif", "Participatif", "\u00c9vitement"],
    bonIndex: 1,
  },
  {
    id: "sdgn-ds-cas-09",
    chapter: 9,
    difficulte: "difficile",
    question:
      "GreenWave subit un bad buzz sur les r\u00e9seaux : les ventes chutent de 18 % en deux semaines. Quel concept explique le mieux cette r\u00e9action ?",
    choix: [
      "Rentabilit\u00e9 financi\u00e8re",
      "Valeur per\u00e7ue et image de marque",
      "Consommations interm\u00e9diaires",
      "Capital social",
    ],
    bonIndex: 1,
  },
  {
    id: "sdgn-ds-cas-10",
    chapter: 1,
    difficulte: "difficile",
    question:
      "SportSolidaire (association) d\u00e9gage un exc\u00e9dent. Des adh\u00e9rents demandent une r\u00e9partition type dividendes. Cette demande est-elle conforme au principe associatif habituel ?",
    choix: [
      "Oui, comme en SA",
      "Non : l'exc\u00e9dent sert l'objet social",
      "Oui, si l'AG vote",
      "Oui, via le cours de Bourse",
    ],
    bonIndex: 1,
  },
];
