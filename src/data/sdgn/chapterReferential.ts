/** Referentiel SDGN (notions, competences, QdG)  aligne missions et import Firestore. */
export type SdgnChapterReferential = {
  question: string;
  notions: string[];
  competences: string[];
};

export const SDGN_CHAPTER_REFERENTIAL: Record<number, SdgnChapterReferential> = {
  1: {
    question:
      "Comment une action collective organisee devient-elle une organisation, et comment les differents types d'organisation se distinguent-ils ?",
    notions: [
      "action collective organisee",
      "organisation",
      "personne morale",
      "statuts juridiques",
      "objet social",
      "finalite lucrative",
      "finalite non lucrative",
      "entreprise",
      "association",
      "organisation publique",
      "structure de propriete",
      "gouvernement de l'organisation",
      "assemblee generale",
      "controle des dirigeants",
    ],
    competences: [
      "Identifier les caracteristiques d'une action collective organisee et d'une organisation",
      "Distinguer entreprise, association et organisation publique",
      "Analyser la structure de propriete et le gouvernement selon le type d'organisation",
      "Expliquer les modes de controle des dirigeants",
    ],
  },
  2: {
    question:
      "Comment les caracteristiques de l'individu (personnalite, emotions, identite numerique) influencent-elles sa communication professionnelle ?",
    notions: [
      "personnalite",
      "traits de personnalite",
      "emotion",
      "intelligence emotionnelle",
      "communication non verbale",
      "perception",
      "identite numerique",
      "e-reputation",
      "communication professionnelle",
    ],
    competences: [
      "Reperer les traits de personnalite et leurs effets sur le comportement au travail",
      "Analyser l'impact des emotions et des signes non verbaux",
      "Evaluer les risques et atouts de l'identite numerique professionnelle",
    ],
  },
  3: {
    question:
      "Comment l'individu interagit-il dans l'organisation (culture, communication, leadership, influence) ?",
    notions: [
      "culture d'entreprise",
      "valeurs",
      "normes",
      "rituels",
      "communication interne",
      "relations formelles et informelles",
      "note de service",
      "leader",
      "leadership",
      "autorite",
      "stereotype",
      "prejuge",
      "strategies d'influence",
      "conformisme",
      "minorite active",
    ],
    competences: [
      "Expliquer le role de la culture d'entreprise sur le sentiment d'appartenance",
      "Distinguer communication formelle et informelle",
      "Analyser styles de leadership et sources d'autorite",
      "Identifier enjeux et strategies d'influence dans une situation professionnelle",
    ],
  },
  4: {
    question:
      "Comment l'activite de travail mobilise-t-elle les competences de l'individu et comment l'organisation optimise-t-elle les conditions de travail ?",
    notions: [
      "approche par competences",
      "savoirs",
      "savoir-faire",
      "savoir-etre",
      "fiche de poste",
      "profil de competences",
      "qualite de vie au travail",
      "QVCT",
      "teletravail",
      "conditions de travail",
    ],
    competences: [
      "Distinguer savoirs, savoir-faire et savoir-etre",
      "Relier competences, poste de travail et performance",
      "Analyser des leviers de qualite de vie au travail",
    ],
  },
  5: {
    question: "Comment l'organisation evalue et retribue le travail des individus ?",
    notions: [
      "evaluation du travail",
      "entretien professionnel",
      "grille d'evaluation",
      "retribution",
      "salaire",
      "primes",
      "avantages en nature",
      "motivation",
      "equite interne et externe",
    ],
    competences: [
      "Expliquer les finalites de l'evaluation professionnelle",
      "Identifier les composantes de la retribution",
      "Analyser le lien evaluation-retribution-motivation",
    ],
  },
  6: {
    question:
      "Comment les organisations transforment-elles les donnees en information strategique, et quelles limites rencontrent-elles ?",
    notions: [
      "donnee",
      "information",
      "connaissance",
      "Big Data",
      "5V",
      "open data",
      "donnees personnelles",
      "systeme d'information",
      "PGI",
      "CRM",
      "qualite de l'information",
      "RGPD",
    ],
    competences: [
      "Reperer l'origine d'une information et les etapes de sa transformation",
      "Identifier les donnees a caractere personnel et les contraintes d'utilisation",
      "Manipuler des donnees ouvertes pour creer de l'information",
    ],
  },
  7: {
    question:
      "Comment les technologies numeriques transforment-elles le travail collaboratif et la communication dans l'organisation ?",
    notions: [
      "visioconference",
      "outils collaboratifs",
      "travail collaboratif",
      "e-communication",
      "reseaux sociaux professionnels",
      "communaute en ligne",
      "intranet",
      "extranet",
      "intelligence collective",
      "IA generative",
    ],
    competences: [
      "Classer les outils collaboratifs par famille",
      "Analyser l'impact des TIC sur les methodes de travail",
      "Evaluer risques et opportunites des usages numeriques en organisation",
    ],
  },
  8: {
    question:
      "Comment le numerique (processus, PGI, e-commerce, teletravail, IA, cloud) transforme-t-il l'organisation du travail ?",
    notions: [
      "processus de gestion",
      "schema evenement-resultat",
      "evenement declencheur",
      "evenement-resultat",
      "regles d'emission",
      "PGI",
      "e-commerce",
      "m-commerce",
      "site de marche",
      "teletravail",
      "mobilite professionnelle",
      "intelligence artificielle",
      "cloud computing",
      "systeme d'information structurant",
    ],
    competences: [
      "Schematiser un processus de gestion representant l'organisation du travail",
      "Comparer les systemes de gestion (PGI, e-commerce, m-commerce, site de marche)",
      "Analyser les choix numeriques pour une utilisation optimale (teletravail, IA, cloud)",
    ],
  },
  9: {
    question:
      "Comment l'organisation construit-elle et mesure-t-elle la valeur percue aupres des consommateurs ?",
    notions: [
      "valeur percue",
      "avantages attendus",
      "sacrifices consentis",
      "image de marque",
      "notoriete",
      "qualite percue",
      "satisfaction",
      "medias sociaux",
      "communaute en ligne",
      "influenceur",
      "e-reputation",
      "KPI",
      "brand content",
    ],
    competences: [
      "Expliquer la construction de la valeur percue par le consommateur",
      "Analyser l'impact des medias sociaux sur la valeur percue",
      "Choisir et interpreter des indicateurs de mesure de la valeur percue",
    ],
  },
  10: {
    question: "Comment mesurer la valeur financiere et boursiere d'une organisation ?",
    notions: [
      "compte de resultat",
      "bilan",
      "actif",
      "passif",
      "capitaux propres",
      "valeur financiere",
      "valeur boursiere",
      "cours de l'action",
      "valeur ajoutee",
    ],
    competences: [
      "Lire et interpreter un compte de resultat et un bilan simplifies",
      "Distinguer valeur financiere et valeur boursiere",
      "Analyser les facteurs influencant la valeur boursiere",
    ],
  },
  11: {
    question: "Comment se cree et se repartit la valeur ajoutee entre les parties prenantes ?",
    notions: [
      "facteurs de production",
      "chiffre d'affaires",
      "consommations intermediaires",
      "valeur ajoutee",
      "parties prenantes",
      "valeur actionnariale",
      "valeur partenariale",
      "conflits d'interets",
    ],
    competences: [
      "Calculer le chiffre d'affaires et la valeur ajoutee",
      "Repartir la valeur ajoutee entre les acteurs",
      "Analyser les tensions entre logiques actionnariale et partenariale",
    ],
  },
  12: {
    question:
      "Quelle est la relation entre prix, cout et marge, et comment le gestionnaire arbitre-t-il ?",
    notions: [
      "prix de vente",
      "cout de revient",
      "marge commerciale",
      "marge sur cout de revient",
      "qualite",
      "concurrence",
      "saisonnalite",
      "innovation",
      "maitrise des couts",
    ],
    competences: [
      "Calculer et interpreter prix, cout et marge",
      "Analyser l'effet d'une decision de prix sur la performance",
      "Proposer un arbitrage prix-qualite-cout coherent",
    ],
  },
  13: {
    question:
      "Comment analyser la performance commerciale et financiere d'une organisation ?",
    notions: [
      "performance",
      "objectifs",
      "efficacite",
      "efficiente",
      "performance commerciale",
      "chiffre d'affaires",
      "part de marche",
      "fidelite",
      "rentabilite",
      "profitabilite",
      "dividendes",
      "autofinancement",
    ],
    competences: [
      "Identifier des indicateurs pertinents pour apprecier la performance",
      "Effectuer des comparaisons dans le temps et dans l'espace",
      "Reperer contraintes et opportunites liees aux aspirations des acteurs",
      "Percevoir le caractere contradictoire des differents types de performance",
    ],
  },
};

export function getSdgnChapterReferential(chapter: number): SdgnChapterReferential | null {
  return SDGN_CHAPTER_REFERENTIAL[chapter] ?? null;
}
