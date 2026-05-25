import type { MissionExerciseRubric, MissionRubricCriterion } from "../../../lib/missionRubric/types";

const c = (
  id: string,
  libelle: string,
  poids: number,
  termes: string[],
  minHits?: number
): MissionRubricCriterion => ({ id, libelle, poids, termes, minHits });

function rubric(
  exerciseId: string,
  blocks: { q: number; criteres: MissionRubricCriterion[]; reperes: string[] }[]
): MissionExerciseRubric {
  return {
    exerciseId,
    questions: blocks.map((b) => ({ questionIndex: b.q, criteres: b.criteres })),
    reperes: blocks.map((b) => ({ questionIndex: b.q, lignes: b.reperes })),
  };
}

export const MANAGEMENT_CHAP1_RUBRICS: Record<string, MissionExerciseRubric> = {
  "mgt1-e1": rubric("mgt1-e1", [
    {
      q: 0,
      criteres: [
        c("def", "D\u00e9finition de la veille commerciale (march\u00e9 / clients / concurrents)", 2, [
          "veille",
          "marche",
          "clients",
          "concurrents",
          "tendances",
          "surveiller",
        ]),
      ],
      reperes: [
        "Surveiller et analyser le march\u00e9 (clients, concurrents, tendances) pour orienter les d\u00e9cisions.",
      ],
    },
    {
      q: 1,
      criteres: [
        c("sources", "Deux sources ou outils cit\u00e9s dans le support", 2, [
          "google",
          "avis",
          "prix",
          "trends",
          "thiriet",
          "carrefour",
        ], 2),
        c("signal", "Un signal rep\u00e9r\u00e9 (tendance ou concurrent)", 2, ["18", "viande", "veggie", "vegetarien", "thiriet", "recherches"]),
      ],
      reperes: [
        "Sources : avis Google, prix concurrents, Google Trends.",
        "Signal : +18 % recherches \u00ab sans viande \u00bb ou gamme veggie chez Thiriet.",
      ],
    },
    {
      q: 2,
      criteres: [
        c("lien", "Lien entre le signal et le lancement Green Bowl", 2, [
          "green bowl",
          "septembre",
          "lancement",
          "besoin",
          "offre",
          "produit",
        ]),
      ],
      reperes: ["La veille montre un besoin ; Picard pr\u00e9pare une gamme adapt\u00e9e pour septembre 2025."],
    },
  ]),

  "mgt1-e2": rubric("mgt1-e2", [
    {
      q: 0,
      criteres: [
        c("def", "Big data / m\u00e9gadonn\u00e9es en marketing", 2, ["big data", "megadonnees", "donnees", "volumes", "comportements"]),
      ],
      reperes: ["Volumes de donn\u00e9es clients analys\u00e9s pour adapter offre ou communication."],
    },
    {
      q: 1,
      criteres: [
        c("donnees", "Donn\u00e9es utilis\u00e9es par Fnac Darty", 2, ["frequence", "panier", "142", "produits", "familles"]),
        c("segments", "Segments cr\u00e9\u00e9s", 2, ["famille", "express", "classique", "segment"]),
      ],
      reperes: ["Donn\u00e9es : fr\u00e9quence, panier 142 \u20ac, familles de produits.", "Segments : Famille, Express, Classique."],
    },
    {
      q: 2,
      criteres: [c("resultat", "R\u00e9sultat chiffr\u00e9 de la segmentation", 2, ["11", "reachat", "personnalise", "express"])],
      reperes: ["+11 % de r\u00e9achat sur le segment Express gr\u00e2ce aux e-mails personnalis\u00e9s."],
    },
  ]),

  "mgt1-e3": rubric("mgt1-e3", [
    {
      q: 0,
      criteres: [
        c("react", "Approche r\u00e9active d\u00e9finie", 2, ["reactive", "reagit", "concurrent", "demande"]),
        c("anti", "Approche anticipative d\u00e9finie", 2, ["anticipative", "anticipe", "avant", "prepare"]),
      ],
      reperes: [
        "R\u00e9active : r\u00e9agir \u00e0 une action concurrente ou une demande d\u00e9j\u00e0 visible.",
        "Anticipative : pr\u00e9parer l'offre avant le pic de demande.",
      ],
    },
    {
      q: 1,
      criteres: [
        c("lidl", "Lidl = r\u00e9actif", 2, ["lidl", "48", "prix", "aligne"]),
        c("inter", "Intermarch\u00e9 = anticipatif", 2, ["intermarche", "asperges", "six mois", "contrats"]),
      ],
      reperes: ["Lidl aligne ses prix sous 48 h.", "Intermarch\u00e9 signe des contrats six mois avant la saison."],
    },
    {
      q: 2,
      criteres: [
        c("avantage", "Avantage pour Intermarch\u00e9", 2, ["satisfaction", "4,8", "affluence", "differentiation", "avance"]),
      ],
      reperes: ["Forte affluence et satisfaction 4,8/5 avant que les concurrents ne copient."],
    },
  ]),

  "mgt1-e4": rubric("mgt1-e4", [
    {
      q: 0,
      criteres: [
        c("etapes", "Les trois \u00e9tapes de la d\u00e9marche marketing", 3, [
          "marche",
          "besoins",
          "offre",
          "cible",
          "etude",
          "concevoir",
        ], 2),
      ],
      reperes: ["Conna\u00eetre le march\u00e9 ; identifier les besoins / la cible ; concevoir une offre adapt\u00e9e."],
    },
    {
      q: 1,
      criteres: [
        c("e1", "Application \u00e9tape 1 (Innocent)", 2, ["enquete", "800", "veille", "trends", "detox"]),
        c("e2", "Application \u00e9tape 2", 2, ["cible", "25", "40", "urbains"]),
        c("e3", "Application \u00e9tape 3", 2, ["2,90", "recettes", "instagram", "consigne", "promotion"]),
      ],
      reperes: [
        "\u00c9tape 1 : enqu\u00eate, veille, Google Trends.",
        "\u00c9tape 2 : actifs urbains 25-40 ans.",
        "\u00c9tape 3 : prix, recettes, consigne, r\u00e9seaux sociaux.",
      ],
    },
    {
      q: 2,
      criteres: [c("strat", "Dimension strat\u00e9gique du lancement", 2, ["strategique", "investissement", "engage", "mois"])],
      reperes: ["Lancement lourd qui engage l'entreprise sur plusieurs mois."],
    },
  ]),

  "mgt1-e5": rubric("mgt1-e5", [
    {
      q: 0,
      criteres: [
        c("med", "Approche m\u00e9diatrice", 2, ["mediatrice", "mise en relation", "plateforme"]),
        c("pro", "Approche proactive", 2, ["proactive", "creer", "besoin", "marche"]),
      ],
      reperes: [
        "M\u00e9diatrice : met en relation sans produire le bien.",
        "Proactive : cr\u00e9e ou \u00e9largit un march\u00e9.",
      ],
    },
    {
      q: 1,
      criteres: [c("uber", "Uber Eats m\u00e9diatrice", 2, ["uber", "commission", "restaurants", "recommande"])],
      reperes: ["Plateforme, commission, recommandations à ne cuisine pas."],
    },
    {
      q: 2,
      criteres: [c("nespresso", "Nespresso proactive", 2, ["nespresso", "capsules", "marche", "demande", "elargir"])],
      reperes: ["Offre lanc\u00e9e sans demande explicite pour \u00e9largir le march\u00e9."],
    },
  ]),

  "mgt1-e6": rubric("mgt1-e6", [
    {
      q: 0,
      criteres: [c("def", "Innovation de produit", 2, ["innovation", "produit", "ameliore", "nouveau"])],
      reperes: ["Produit nouveau ou nettement am\u00e9lior\u00e9."],
    },
    {
      q: 1,
      criteres: [
        c("amel", "Am\u00e9liorations Zo\u00e9", 2, ["autonomie", "charge", "recycle", "materiaux"], 2),
      ],
      reperes: ["Autonomie, charge rapide, mat\u00e9riaux recycl\u00e9s à m\u00eame mod\u00e8le enrichi."],
    },
    {
      q: 2,
      criteres: [c("chiffre", "Indicateur d'acceptation", 2, ["17", "commandes", "72", "65", "satisfaction"])],
      reperes: ["+17 % de commandes ; satisfaction 72 % > 65 %."],
    },
  ]),

  "mgt1-e7": rubric("mgt1-e7", [
    {
      q: 0,
      criteres: [c("def", "Innovation de proc\u00e9d\u00e9", 2, ["procedure", "procede", "organisation", "logistique"])],
      reperes: ["Nouvelle organisation / logistique sans changer le produit (colis)."],
    },
    {
      q: 1,
      criteres: [
        c("chg", "Changements La Poste", 2, ["tournees", "electrique", "application", "creneau", "optimisation"], 2),
      ],
      reperes: ["Optimisation des tourn\u00e9es, v\u00e9hicules \u00e9lectriques, cr\u00e9neau via l'app."],
    },
    {
      q: 2,
      criteres: [c("res", "Deux r\u00e9sultats chiffr\u00e9s", 2, ["94", "87", "28", "reclamations"], 2)],
      reperes: ["94 % livraisons r\u00e9ussies ; r\u00e9clamations \u221228 %."],
    },
  ]),

  "mgt1-e8": rubric("mgt1-e8", [
    {
      q: 0,
      criteres: [c("plat", "Mod\u00e8le plateforme", 2, ["plateforme", "commission", "relation", "intermediaire"])],
      reperes: ["Mise en relation ; r\u00e9mun\u00e9ration par commission ; pas de stock."],
    },
    {
      q: 1,
      criteres: [c("vinted", "Revenus Vinted", 2, ["vinted", "commission", "8,6", "particuliers"])],
      reperes: ["Pas de stock ; commissions sur les ventes entre particuliers."],
    },
    {
      q: 2,
      criteres: [c("mono", "Monoprix int\u00e9gr\u00e9", 2, ["monoprix", "stocke", "magasin", "34", "qualite", "achete"])],
      reperes: ["Ach\u00e8te, stocke, vend en magasin ; contr\u00f4le qualit\u00e9 et rayon."],
    },
  ]),

  "mgt1-e9": rubric("mgt1-e9", [
    {
      q: 0,
      criteres: [
        c("lc", "Low cost", 2, ["low cost", "prix bas", "action"]),
        c("gr", "Gratuit\u00e9", 2, ["gratuit", "publicite", "spotify"]),
        c("fr", "Freemium", 2, ["freemium", "premium", "deezer", "abonnement"]),
      ],
      reperes: [
        "Low cost : prix bas, options limit\u00e9es.",
        "Gratuit\u00e9 : service gratuit financ\u00e9 autrement (pub).",
        "Freemium : version gratuite + offre payante.",
      ],
    },
    {
      q: 1,
      criteres: [
        c("assoc", "Associations entreprises / mod\u00e8les", 2, ["action", "spotify", "deezer"], 2),
      ],
      reperes: ["Action = low cost ; Spotify = gratuit\u00e9 ; Deezer = freemium."],
    },
    {
      q: 2,
      criteres: [c("deca", "Test Decathlon = freemium", 2, ["freemium", "essai", "contrat", "payant", "b2b"])],
      reperes: ["Essai gratuit puis contrat payant = freemium B2B."],
    },
  ]),

  "mgt1-e10": rubric("mgt1-e10", [
    {
      q: 0,
      criteres: [c("def", "Performance sociale", 2, ["performance sociale", "salaries", "bien etre", "rse"])],
      reperes: ["R\u00e9sultats pour le bien-\u00eatre des salari\u00e9s."],
    },
    {
      q: 1,
      criteres: [
        c("11", "Interpr\u00e9tation 11 % d\u00e9parts", 2, ["11", "depart", "fidelisation", "secteur", "18"]),
        c("42", "Absent\u00e9isme 4,2 %", 2, ["4,2", "absenteisme"]),
        c("78", "78 % valeurs", 2, ["78", "valeurs", "respect"]),
      ],
      reperes: [
        "11 % d\u00e9parts < moyenne secteur : fid\u00e9lisation.",
        "Absent\u00e9isme ma\u00eetris\u00e9.",
        "Forte adh\u00e9sion aux valeurs.",
      ],
    },
    {
      q: 2,
      criteres: [c("mkt", "Lien avec l'image de marque", 2, ["image", "marque", "credibilite", "marketing", "confiance"])],
      reperes: ["Renforce la cr\u00e9dibilit\u00e9 et l'attractivit\u00e9 de la marque."],
    },
  ]),

  "mgt1-cas1": rubric("mgt1-cas1", [
    {
      q: 0,
      criteres: [
        c("conc", "Typologie des concurrents", 2, ["amazon", "leclerc", "lidl", "livraison", "prix", "bio"]),
      ],
      reperes: ["Amazon Fresh (livraison), Leclerc (prix bio), Lidl (guerre des prix)."],
    },
    {
      q: 1,
      criteres: [
        c("att", "Attentes clients Carrefour", 2, ["qualite", "62", "drive", "41", "prix", "23"], 2),
      ],
      reperes: ["Qualit\u00e9 et drive prioritaires ; prix moins d\u00e9terminant pour la client\u00e8le Carrefour."],
    },
    {
      q: 2,
      criteres: [c("kpi", "Lecture croissance et NPS", 2, ["3", "9", "nps", "59", "baisse", "pression"])],
      reperes: ["Croissance ralentit (+3 % vs +9 %) ; NPS 59 = pression concurrentielle."],
    },
    {
      q: 3,
      criteres: [
        c("reco", "Recommandation argument\u00e9e (B, C ou D plut\u00f4t que A)", 3, [
          "b",
          "c",
          "d",
          "app",
          "personnalisation",
          "b2b",
          "amap",
          "qualite",
          "pas",
          "guerre",
          "prix",
        ]),
      ],
      reperes: [
        "Plut\u00f4t B (app / personnalisation) ou C/D que A (guerre des prix), align\u00e9 sur qualit\u00e9 et services.",
      ],
    },
  ]),

  "mgt1-cas2": rubric("mgt1-cas2", [
    {
      q: 0,
      criteres: [
        c("a1", "Axe 1 : veille / big data / d\u00e9marche", 2, ["veille", "big data", "segmentation", "demarche"]),
      ],
      reperes: ["Veille commerciale + segmentation par big data = \u00e9tape 1 de la d\u00e9marche."],
    },
    {
      q: 1,
      criteres: [
        c("a2p", "Innovation produit (emballages)", 2, ["produit", "emballage", "durable"]),
        c("a2r", "Innovation proc\u00e9d\u00e9 (logistique)", 2, ["procedure", "logistique", "carbone", "procede"]),
      ],
      reperes: ["Produit : emballages durables. Proc\u00e9d\u00e9 : logistique bas carbone."],
    },
    {
      q: 2,
      criteres: [
        c("a3", "Freemium B2B et refus pub intrusive", 2, ["freemium", "b2b", "gratuit", "publicite"]),
      ],
      reperes: ["Freemium pour entreprises ; pas de gratuit\u00e9 publicitaire intrusive."],
    },
    {
      q: 3,
      criteres: [
        c("sur", "Surco\u00fbt justifiable (premium / valeur per\u00e7ue)", 2, [
          "premium",
          "qualite",
          "durable",
          "valeur",
          "justif",
          "surcout",
        ]),
      ],
      reperes: ["Surco\u00fbt acceptable si qualit\u00e9 / durable / image premium sont valoris\u00e9s."],
    },
  ]),
};
