export const FLASHCARDS_DATA_VERSION = 5;

export type FlashcardProgramme =
  | "management"
  | "droit"
  | "economie"
  | "sciences_gestion"
  | "gestion_finance"
  | "mercatique"
  | "ressources_humaines"
  | "numerique_si";

export type FlashcardItem = {
  id: string;
  programme: FlashcardProgramme;
  notion: string;
  question: string;
  reponse: string;
  xp: number;
};

export const FLASHCARDS: FlashcardItem[] = [

  // ─── MANAGEMENT ─────────────────────────────────────────────────────────────
  {
    id: "mgt-01", programme: "management", notion: "Management",
    question: "Qu'est-ce que le management ?",
    reponse: "Le management est l'ensemble des techniques permettant de diriger, organiser, coordonner et motiver les membres d'une organisation afin d'atteindre des objectifs définis.",
    xp: 9,
  },
  {
    id: "mgt-02", programme: "management", notion: "Organisation",
    question: "Qu'est-ce qu'une organisation ?",
    reponse: "Une organisation est un groupe structuré de personnes qui coopèrent pour atteindre un objectif commun, avec des ressources, des règles et une certaine durabilité (entreprise, association, État...).",
    xp: 9,
  },
  {
    id: "mgt-03", programme: "management", notion: "Finalité",
    question: "Qu'est-ce que la finalité d'une organisation ?",
    reponse: "La finalité est la raison d'être profonde de l'organisation. Elle peut être lucrative (recherche de profit) ou non lucrative (intérêt général, social, culturel). Elle guide toutes les décisions stratégiques.",
    xp: 8,
  },
  {
    id: "mgt-04", programme: "management", notion: "Parties prenantes",
    question: "Qu'est-ce qu'une partie prenante ?",
    reponse: "Une partie prenante est tout acteur (interne ou externe) ayant un intérêt dans l'activité de l'organisation : salariés, actionnaires, clients, fournisseurs, État, riverains, associations...",
    xp: 8,
  },
  {
    id: "mgt-05", programme: "management", notion: "RSE",
    question: "Qu'est-ce que la RSE ?",
    reponse: "La Responsabilité Sociétale des Entreprises (RSE) désigne l'intégration volontaire par les entreprises de préoccupations sociales et environnementales dans leurs activités et leurs relations avec leurs parties prenantes.",
    xp: 9,
  },
  {
    id: "mgt-06", programme: "management", notion: "Décision",
    question: "Quels sont les trois niveaux de décision dans une entreprise ?",
    reponse: "Les trois niveaux sont : (1) stratégique (direction générale, long terme), (2) tactique (managers intermédiaires, moyen terme) et (3) opérationnel (exécution quotidienne, court terme).",
    xp: 9,
  },
  {
    id: "mgt-07", programme: "management", notion: "Gouvernance",
    question: "Qu'est-ce que la gouvernance d'entreprise ?",
    reponse: "La gouvernance d'entreprise désigne l'ensemble des règles, organes et mécanismes qui organisent la répartition du pouvoir et du contrôle entre les dirigeants, les actionnaires et les autres parties prenantes.",
    xp: 9,
  },
  {
    id: "mgt-08", programme: "management", notion: "Structure organisationnelle",
    question: "Qu'est-ce que la structure organisationnelle ?",
    reponse: "La structure organisationnelle est la façon dont une organisation répartit les tâches, les responsabilités et les relations hiérarchiques entre ses membres. Elle peut être fonctionnelle, divisionnelle ou matricielle.",
    xp: 8,
  },
  {
    id: "mgt-09", programme: "management", notion: "Structure fonctionnelle",
    question: "Qu'est-ce qu'une structure fonctionnelle ?",
    reponse: "Une structure fonctionnelle organise l'entreprise par grandes fonctions (production, vente, finance, RH...). Elle favorise la spécialisation mais peut créer des cloisonnements entre services.",
    xp: 8,
  },
  {
    id: "mgt-10", programme: "management", notion: "Structure divisionnelle",
    question: "Qu'est-ce qu'une structure divisionnelle ?",
    reponse: "Une structure divisionnelle organise l'entreprise par divisions autonomes (produits, zones géographiques, marchés). Chaque division dispose de ses propres fonctions et responsabilités.",
    xp: 8,
  },
  {
    id: "mgt-11", programme: "management", notion: "Stratégie d'entreprise",
    question: "Qu'est-ce qu'une stratégie d'entreprise ?",
    reponse: "La stratégie d'entreprise est l'ensemble des choix à long terme qui définissent comment l'organisation va atteindre ses objectifs et créer un avantage concurrentiel durable sur son marché.",
    xp: 9,
  },
  {
    id: "mgt-12", programme: "management", notion: "SWOT",
    question: "Que signifie l'analyse SWOT et à quoi sert-elle ?",
    reponse: "SWOT signifie Forces (Strengths), Faiblesses (Weaknesses), Opportunités (Opportunities), Menaces (Threats). C'est un outil de diagnostic qui évalue les atouts internes et les facteurs environnementaux d'une organisation.",
    xp: 9,
  },
  {
    id: "mgt-13", programme: "management", notion: "Croissance interne",
    question: "Qu'est-ce que la croissance interne ?",
    reponse: "La croissance interne (ou organique) consiste pour une entreprise à se développer en utilisant ses propres ressources : investissement en équipements, embauche, développement de nouveaux produits.",
    xp: 8,
  },
  {
    id: "mgt-14", programme: "management", notion: "Croissance externe",
    question: "Qu'est-ce que la croissance externe ?",
    reponse: "La croissance externe consiste à se développer par des acquisitions, fusions ou alliances avec d'autres entreprises. Elle permet de gagner rapidement des parts de marché, des compétences ou des actifs.",
    xp: 8,
  },
  {
    id: "mgt-15", programme: "management", notion: "Avantage concurrentiel",
    question: "Qu'est-ce qu'un avantage concurrentiel ?",
    reponse: "L'avantage concurrentiel est un atout durable qui différencie l'entreprise de ses concurrents aux yeux des clients. Il peut reposer sur les coûts (domination par les coûts), la différenciation ou la spécialisation.",
    xp: 9,
  },
  {
    id: "mgt-16", programme: "management", notion: "Modèle économique",
    question: "Qu'est-ce qu'un modèle économique (business model) ?",
    reponse: "Le modèle économique décrit comment une organisation crée, délivre et capture de la valeur. Il précise qui est le client cible, quelle offre est proposée, quelles sont les sources de revenus et les coûts principaux.",
    xp: 10,
  },
  {
    id: "mgt-17", programme: "management", notion: "Transformation numérique",
    question: "Qu'est-ce que la transformation numérique d'une organisation ?",
    reponse: "La transformation numérique est l'intégration des technologies digitales dans tous les aspects de l'organisation (processus, offre, relation client, culture d'entreprise) pour améliorer la performance et créer de la valeur.",
    xp: 8,
  },
  {
    id: "mgt-18", programme: "management", notion: "Innovation",
    question: "Quelle est la différence entre innovation incrémentale et innovation radicale ?",
    reponse: "L'innovation incrémentale améliore progressivement un produit ou service existant. L'innovation radicale crée une rupture majeure sur le marché en introduisant quelque chose de totalement nouveau (ex. : smartphone, streaming).",
    xp: 8,
  },

  // ─── DROIT ──────────────────────────────────────────────────────────────────
  {
    id: "drt-01", programme: "droit", notion: "Contrat",
    question: "Qu'est-ce qu'un contrat en droit ?",
    reponse: "Un contrat est un accord de volontés entre deux ou plusieurs personnes qui crée des obligations juridiquement contraignantes. Chaque partie s'engage à faire, ne pas faire ou donner quelque chose.",
    xp: 9,
  },
  {
    id: "drt-02", programme: "droit", notion: "Conditions de validité",
    question: "Quelles sont les conditions de validité d'un contrat ?",
    reponse: "Un contrat est valide si : (1) le consentement est libre et éclairé (sans vice), (2) les parties ont la capacité juridique, (3) le contenu est licite et certain. Sans ces conditions, le contrat peut être annulé.",
    xp: 9,
  },
  {
    id: "drt-03", programme: "droit", notion: "Responsabilité civile",
    question: "Qu'est-ce que la responsabilité civile ?",
    reponse: "La responsabilité civile oblige une personne ayant causé un dommage à autrui à le réparer (indemnisation). Elle peut être contractuelle (inexécution d'un contrat) ou délictuelle (faute sans contrat préalable).",
    xp: 9,
  },
  {
    id: "drt-04", programme: "droit", notion: "Responsabilité pénale",
    question: "Qu'est-ce que la responsabilité pénale ?",
    reponse: "La responsabilité pénale engage une personne ayant commis une infraction (crime, délit, contravention). La sanction est prononcée par un tribunal pénal et peut être une peine d'emprisonnement ou une amende.",
    xp: 9,
  },
  {
    id: "drt-05", programme: "droit", notion: "Sources du droit",
    question: "Quelles sont les sources du droit français, par ordre hiérarchique ?",
    reponse: "Les sources du droit, de la plus haute à la plus basse : la Constitution, les traités internationaux et le droit européen, la loi (votée par le Parlement), les règlements (décrets, arrêtés), et la jurisprudence.",
    xp: 10,
  },
  {
    id: "drt-06", programme: "droit", notion: "Contrat de travail CDI",
    question: "Qu'est-ce qu'un contrat à durée indéterminée (CDI) ?",
    reponse: "Le CDI est le contrat de travail de droit commun, sans terme fixé. Il offre la plus grande stabilité au salarié. Il peut être rompu par démission, licenciement ou rupture conventionnelle.",
    xp: 8,
  },
  {
    id: "drt-07", programme: "droit", notion: "Contrat de travail CDD",
    question: "Qu'est-ce qu'un contrat à durée déterminée (CDD) ?",
    reponse: "Le CDD est un contrat de travail avec une date de fin déterminée. Il ne peut être conclu que pour des cas précis prévus par la loi (remplacement, surcroît d'activité...). Sa durée maximale est généralement de 18 mois.",
    xp: 8,
  },
  {
    id: "drt-08", programme: "droit", notion: "Licenciement",
    question: "Quelles sont les conditions d'un licenciement légal ?",
    reponse: "Un licenciement est légal si l'employeur dispose d'une cause réelle et sérieuse (personnelle ou économique) et suit la procédure : convocation, entretien préalable, notification écrite, respect des délais de préavis.",
    xp: 9,
  },
  {
    id: "drt-09", programme: "droit", notion: "Convention collective",
    question: "Qu'est-ce qu'une convention collective ?",
    reponse: "Une convention collective est un accord négocié entre syndicats de salariés et organisations patronales d'une branche. Elle précise les conditions de travail et d'emploi (salaires, congés, primes...) souvent plus favorables que la loi.",
    xp: 8,
  },
  {
    id: "drt-10", programme: "droit", notion: "SMIC",
    question: "Qu'est-ce que le SMIC ?",
    reponse: "Le SMIC (Salaire Minimum Interprofessionnel de Croissance) est le salaire horaire légal minimum en France, en dessous duquel aucun salarié ne peut être rémunéré. Il est réévalué chaque année au 1er janvier.",
    xp: 8,
  },
  {
    id: "drt-11", programme: "droit", notion: "Société anonyme",
    question: "Qu'est-ce qu'une société anonyme (SA) ?",
    reponse: "La SA est une société de capitaux dont le capital est divisé en actions. La responsabilité des actionnaires est limitée à leurs apports. Elle est dirigée par un conseil d'administration et convient aux grandes entreprises.",
    xp: 8,
  },
  {
    id: "drt-12", programme: "droit", notion: "SARL",
    question: "Qu'est-ce qu'une SARL ?",
    reponse: "La SARL (Société À Responsabilité Limitée) est une société dont les associés ont leur responsabilité limitée à leurs apports. C'est la forme juridique la plus répandue en France pour les PME.",
    xp: 8,
  },
  {
    id: "drt-13", programme: "droit", notion: "Personne morale",
    question: "Qu'est-ce qu'une personne morale ?",
    reponse: "Une personne morale est une entité juridique distincte des personnes physiques qui la composent (société, association, État...). Elle a des droits et des obligations : elle peut contracter, ester en justice, posséder des biens.",
    xp: 8,
  },
  {
    id: "drt-14", programme: "droit", notion: "Droit de la consommation",
    question: "À quoi sert le droit de la consommation ?",
    reponse: "Le droit de la consommation protège les consommateurs face aux professionnels. Il encadre notamment la publicité, les clauses abusives, le droit de rétractation (14 jours pour un achat en ligne) et les garanties légales.",
    xp: 8,
  },
  {
    id: "drt-15", programme: "droit", notion: "Rupture conventionnelle",
    question: "Qu'est-ce qu'une rupture conventionnelle ?",
    reponse: "La rupture conventionnelle est un mode amiable de rupture du CDI, d'un commun accord entre l'employeur et le salarié. Elle donne droit aux allocations chômage et à une indemnité spécifique de rupture.",
    xp: 8,
  },
  {
    id: "drt-16", programme: "droit", notion: "Vice du consentement",
    question: "Quels sont les vices du consentement qui rendent un contrat annulable ?",
    reponse: "Les trois vices du consentement sont : l'erreur (croyance fausse sur un élément essentiel), le dol (tromperie intentionnelle) et la violence (contrainte physique ou morale). Ils permettent de demander l'annulation du contrat.",
    xp: 9,
  },

  // ─── ÉCONOMIE ───────────────────────────────────────────────────────────────
  {
    id: "eco-01", programme: "economie", notion: "PIB",
    question: "Qu'est-ce que le PIB ?",
    reponse: "Le Produit Intérieur Brut (PIB) mesure la valeur totale des biens et services produits sur le territoire d'un pays pendant une période donnée (généralement une année). C'est le principal indicateur de la richesse créée.",
    xp: 10,
  },
  {
    id: "eco-02", programme: "economie", notion: "Croissance économique",
    question: "Qu'est-ce que la croissance économique ?",
    reponse: "La croissance économique est l'augmentation durable du PIB réel d'un pays. Elle est mesurée par le taux de croissance du PIB. Une croissance positive signifie que l'économie produit davantage de richesses.",
    xp: 9,
  },
  {
    id: "eco-03", programme: "economie", notion: "Chômage",
    question: "Qu'est-ce que le chômage et comment est-il mesuré ?",
    reponse: "Le chômage désigne la situation des personnes sans emploi, disponibles pour travailler et à la recherche active d'un emploi. Le taux de chômage est mesuré par l'INSEE selon les critères du BIT (Bureau International du Travail).",
    xp: 9,
  },
  {
    id: "eco-04", programme: "economie", notion: "Inflation",
    question: "Qu'est-ce que l'inflation ?",
    reponse: "L'inflation est la hausse générale et durable des prix. Elle réduit le pouvoir d'achat des ménages. Elle est mesurée par l'indice des prix à la consommation (IPC). Une inflation modérée (~2%) est considérée comme saine.",
    xp: 9,
  },
  {
    id: "eco-05", programme: "economie", notion: "Mondialisation",
    question: "Qu'est-ce que la mondialisation ?",
    reponse: "La mondialisation est le processus d'intégration croissante des économies mondiales à travers les échanges de biens, services, capitaux, personnes et informations. Elle crée des interdépendances entre les pays.",
    xp: 9,
  },
  {
    id: "eco-06", programme: "economie", notion: "Politique budgétaire",
    question: "Qu'est-ce que la politique budgétaire ?",
    reponse: "La politique budgétaire est l'utilisation des dépenses publiques et de la fiscalité par l'État pour influencer l'activité économique. Une politique expansionniste augmente les dépenses ou réduit les impôts pour stimuler la croissance.",
    xp: 9,
  },
  {
    id: "eco-07", programme: "economie", notion: "Politique monétaire",
    question: "Qu'est-ce que la politique monétaire ?",
    reponse: "La politique monétaire est l'action d'une banque centrale (comme la BCE) sur la quantité de monnaie en circulation et les taux d'intérêt pour contrôler l'inflation et soutenir la croissance économique.",
    xp: 9,
  },
  {
    id: "eco-08", programme: "economie", notion: "Marché",
    question: "Qu'est-ce qu'un marché en économie ?",
    reponse: "Un marché est le lieu (physique ou virtuel) de rencontre entre l'offre (vendeurs) et la demande (acheteurs). L'interaction entre l'offre et la demande détermine le prix d'équilibre et les quantités échangées.",
    xp: 8,
  },
  {
    id: "eco-09", programme: "economie", notion: "Concurrence parfaite",
    question: "Qu'est-ce que la concurrence pure et parfaite ?",
    reponse: "La concurrence pure et parfaite est un modèle théorique de marché avec de nombreux offreurs et demandeurs, des produits homogènes, une libre entrée/sortie du marché, et une information parfaite. Les prix s'y forment librement.",
    xp: 8,
  },
  {
    id: "eco-10", programme: "economie", notion: "Monopole",
    question: "Qu'est-ce qu'un monopole ?",
    reponse: "Un monopole est une structure de marché dans laquelle un seul vendeur fait face à de nombreux acheteurs. Le monopoleur fixe lui-même son prix sans concurrence. Les monopoles peuvent être naturels, légaux ou de fait.",
    xp: 8,
  },
  {
    id: "eco-11", programme: "economie", notion: "Déficit public",
    question: "Qu'est-ce que le déficit public ?",
    reponse: "Le déficit public correspond à la situation où les dépenses de l'État (et des administrations publiques) sont supérieures à ses recettes fiscales. Il est financé par l'emprunt, ce qui augmente la dette publique.",
    xp: 8,
  },
  {
    id: "eco-12", programme: "economie", notion: "Balance commerciale",
    question: "Qu'est-ce que la balance commerciale ?",
    reponse: "La balance commerciale enregistre la différence entre les exportations et les importations de biens d'un pays. Un solde positif (excédent) signifie que le pays exporte plus qu'il n'importe ; un solde négatif est un déficit.",
    xp: 8,
  },
  {
    id: "eco-13", programme: "economie", notion: "Pouvoir d'achat",
    question: "Qu'est-ce que le pouvoir d'achat ?",
    reponse: "Le pouvoir d'achat représente la quantité de biens et services qu'un revenu permet d'acheter. Il diminue en cas d'inflation supérieure à la hausse des revenus, et augmente quand les revenus progressent plus vite que les prix.",
    xp: 8,
  },
  {
    id: "eco-14", programme: "economie", notion: "Développement durable",
    question: "Qu'est-ce que le développement durable ?",
    reponse: "Le développement durable est un développement qui répond aux besoins du présent sans compromettre la capacité des générations futures à répondre aux leurs. Il repose sur trois piliers : économique, social et environnemental.",
    xp: 9,
  },
  {
    id: "eco-15", programme: "economie", notion: "Inégalités",
    question: "Comment mesure-t-on les inégalités économiques ?",
    reponse: "Les inégalités se mesurent notamment avec le coefficient de Gini (0 = égalité parfaite, 1 = inégalité maximale) et les déciles de revenus. Les inégalités peuvent être de revenus, de patrimoine ou d'accès aux services.",
    xp: 8,
  },
  {
    id: "eco-16", programme: "economie", notion: "Politique de l'emploi",
    question: "Quels sont les types de politiques de l'emploi ?",
    reponse: "Les politiques de l'emploi se distinguent en politiques actives (aide à la recherche d'emploi, formation, subventions à l'embauche) et politiques passives (allocations chômage, retraite anticipée qui réduisent l'offre de travail).",
    xp: 9,
  },

  // ─── SCIENCES DE GESTION ET NUMÉRIQUE ───────────────────────────────────────
  {
    id: "sgn-01", programme: "sciences_gestion", notion: "Système d'information",
    question: "Qu'est-ce qu'un système d'information (SI) ?",
    reponse: "Un système d'information est l'ensemble des ressources humaines, techniques et organisationnelles qui permettent de collecter, stocker, traiter et diffuser l'information utile à la prise de décision dans une organisation.",
    xp: 9,
  },
  {
    id: "sgn-02", programme: "sciences_gestion", notion: "Flux d'information",
    question: "Qu'est-ce qu'un flux d'information ?",
    reponse: "Un flux d'information est la circulation d'informations entre des acteurs, des services ou des applications. Il peut être entrant (reçu), sortant (émis) ou interne à l'organisation. Sa qualité conditionne la prise de décision.",
    xp: 8,
  },
  {
    id: "sgn-03", programme: "sciences_gestion", notion: "Donnée – Information – Connaissance",
    question: "Quelle est la différence entre donnée, information et connaissance ?",
    reponse: "Une donnée est un fait brut non interprété (ex. : « 42 »). Une information est une donnée mise en contexte et utile à la décision (ex. : « 42 ventes en mars »). Une connaissance est une information assimilée et exploitable pour agir.",
    xp: 9,
  },
  {
    id: "sgn-04", programme: "sciences_gestion", notion: "ERP",
    question: "Qu'est-ce qu'un ERP ?",
    reponse: "Un ERP (Enterprise Resource Planning, ou PGI en français) est un logiciel intégré qui centralise toutes les fonctions de gestion de l'entreprise (comptabilité, stocks, ventes, RH...) dans une base de données commune.",
    xp: 8,
  },
  {
    id: "sgn-05", programme: "sciences_gestion", notion: "CRM",
    question: "Qu'est-ce qu'un CRM ?",
    reponse: "Un CRM (Customer Relationship Management, ou GRC) est un outil qui centralise les données clients pour gérer et améliorer la relation commerciale : historique des achats, contacts, réclamations, fidélisation.",
    xp: 8,
  },
  {
    id: "sgn-06", programme: "sciences_gestion", notion: "Projet informatique",
    question: "Qu'est-ce qu'un projet informatique et quelles en sont les phases ?",
    reponse: "Un projet informatique vise à concevoir ou à faire évoluer un SI. Ses grandes phases sont : cadrage, analyse des besoins, conception, développement/paramétrage, tests, déploiement et maintenance.",
    xp: 8,
  },
  {
    id: "sgn-07", programme: "sciences_gestion", notion: "Méthode agile",
    question: "Qu'est-ce qu'une méthode de gestion de projet agile ?",
    reponse: "Une méthode agile décompose le projet en itérations courtes (sprints) avec des livraisons régulières. Elle privilégie la collaboration, l'adaptation au changement et la satisfaction du client plutôt que le suivi rigide d'un plan.",
    xp: 8,
  },
  {
    id: "sgn-08", programme: "sciences_gestion", notion: "Tableau de bord",
    question: "Qu'est-ce qu'un tableau de bord de gestion ?",
    reponse: "Un tableau de bord est un outil de pilotage qui présente de façon synthétique les indicateurs clés de performance (KPI) permettant de suivre l'activité et d'identifier les écarts par rapport aux objectifs fixés.",
    xp: 8,
  },
  {
    id: "sgn-09", programme: "sciences_gestion", notion: "Veille informationnelle",
    question: "Qu'est-ce que la veille informationnelle ?",
    reponse: "La veille informationnelle est la surveillance continue de l'environnement (concurrents, technologie, réglementation, marché) pour anticiper les risques et les opportunités, et ainsi mieux prendre des décisions stratégiques.",
    xp: 8,
  },
  {
    id: "sgn-10", programme: "sciences_gestion", notion: "Communication numérique",
    question: "Qu'est-ce que la communication numérique en entreprise ?",
    reponse: "La communication numérique en entreprise regroupe tous les échanges d'informations via des outils digitaux : messagerie électronique, intranet, réseaux sociaux d'entreprise, visioconférence, outils collaboratifs en ligne.",
    xp: 8,
  },
  {
    id: "sgn-11", programme: "sciences_gestion", notion: "Travail collaboratif",
    question: "Qu'est-ce que le travail collaboratif numérique ?",
    reponse: "Le travail collaboratif numérique permet à plusieurs personnes de travailler ensemble sur des documents ou des projets partagés grâce à des outils en ligne (Google Workspace, Microsoft 365...), même à distance.",
    xp: 8,
  },
  {
    id: "sgn-12", programme: "sciences_gestion", notion: "Décision structurée",
    question: "Quelle est la différence entre une décision structurée et une décision non structurée ?",
    reponse: "Une décision structurée est répétitive et suit des règles précises, souvent automatisable (ex. : réapprovisionnement automatique). Une décision non structurée est unique, complexe, et nécessite jugement et créativité (ex. : lancement d'un nouveau marché).",
    xp: 9,
  },
  {
    id: "sgn-13", programme: "sciences_gestion", notion: "Base de données",
    question: "Qu'est-ce qu'une base de données ?",
    reponse: "Une base de données est un ensemble organisé d'informations structurées, stockées et gérées par un SGBD (Système de Gestion de Bases de Données). Elle permet de stocker, rechercher, modifier et partager des données efficacement.",
    xp: 8,
  },
  {
    id: "sgn-14", programme: "sciences_gestion", notion: "KPI",
    question: "Qu'est-ce qu'un KPI (indicateur clé de performance) ?",
    reponse: "Un KPI (Key Performance Indicator) est une mesure quantitative ou qualitative qui permet d'évaluer l'atteinte d'un objectif. Un bon KPI est spécifique, mesurable, pertinent et suivi dans le temps (lié à un objectif SMART).",
    xp: 8,
  },
  {
    id: "sgn-15", programme: "sciences_gestion", notion: "Processus",
    question: "Qu'est-ce qu'un processus en gestion ?",
    reponse: "Un processus est une suite d'activités organisées qui transforment des ressources (entrées) en résultats (sorties) pour créer de la valeur. La modélisation des processus aide à optimiser l'organisation et à détecter les dysfonctionnements.",
    xp: 8,
  },
  {
    id: "sgn-16", programme: "sciences_gestion", notion: "Interopérabilité",
    question: "Qu'est-ce que l'interopérabilité des systèmes d'information ?",
    reponse: "L'interopérabilité est la capacité de différents systèmes ou applications à échanger des données et à fonctionner ensemble sans effort particulier. Elle est essentielle pour éviter les « silos » d'information dans une organisation.",
    xp: 8,
  },

  // ─── GESTION & FINANCE ───────────────────────────────────────────────────────
  {
    id: "gf-01", programme: "gestion_finance", notion: "Bilan",
    question: "Qu'est-ce que le bilan comptable ?",
    reponse: "Le bilan est un document comptable qui photographie la situation financière de l'entreprise à une date donnée. Il présente à l'actif ce que l'entreprise possède (biens, créances) et au passif ce qu'elle doit (capitaux propres + dettes).",
    xp: 10,
  },
  {
    id: "gf-02", programme: "gestion_finance", notion: "Compte de résultat",
    question: "Qu'est-ce que le compte de résultat ?",
    reponse: "Le compte de résultat retrace l'ensemble des produits (recettes) et des charges (dépenses) d'une entreprise sur un exercice. Il permet de calculer le résultat net : Résultat = Produits − Charges. Un résultat positif est un bénéfice.",
    xp: 10,
  },
  {
    id: "gf-03", programme: "gestion_finance", notion: "Chiffre d'affaires",
    question: "Comment calcule-t-on le chiffre d'affaires (CA) ?",
    reponse: "Le chiffre d'affaires est le total des ventes réalisées sur une période. Formule : CA = Prix de vente unitaire HT × Quantité vendue. C'est un indicateur de l'activité commerciale mais pas de la rentabilité.",
    xp: 9,
  },
  {
    id: "gf-04", programme: "gestion_finance", notion: "Marge commerciale",
    question: "Qu'est-ce que la marge commerciale et comment la calcule-t-on ?",
    reponse: "La marge commerciale est la différence entre le prix de vente HT et le coût d'achat HT des marchandises vendues. Formule : Marge commerciale = Ventes de marchandises − Coût d'achat des marchandises vendues.",
    xp: 9,
  },
  {
    id: "gf-05", programme: "gestion_finance", notion: "Seuil de rentabilité",
    question: "Qu'est-ce que le seuil de rentabilité (SR) ?",
    reponse: "Le seuil de rentabilité (ou chiffre d'affaires critique) est le niveau de CA à partir duquel l'entreprise couvre la totalité de ses charges et commence à réaliser un bénéfice. Formule : SR = Charges fixes / Taux de marge sur coûts variables.",
    xp: 10,
  },
  {
    id: "gf-06", programme: "gestion_finance", notion: "Charges fixes et variables",
    question: "Quelle est la différence entre charges fixes et charges variables ?",
    reponse: "Les charges fixes ne varient pas avec le niveau de production (loyer, assurance, salaires fixes). Les charges variables évoluent proportionnellement à l'activité (matières premières, commissions...). Cette distinction est fondamentale pour le calcul du seuil de rentabilité.",
    xp: 9,
  },
  {
    id: "gf-07", programme: "gestion_finance", notion: "Trésorerie",
    question: "Qu'est-ce que la trésorerie d'une entreprise ?",
    reponse: "La trésorerie est l'ensemble des liquidités disponibles à court terme (caisse + comptes bancaires). Elle mesure la capacité à payer les dépenses immédiates. Formule : Trésorerie nette = Fonds de roulement − Besoin en fonds de roulement.",
    xp: 9,
  },
  {
    id: "gf-08", programme: "gestion_finance", notion: "Fonds de roulement",
    question: "Qu'est-ce que le fonds de roulement (FR) ?",
    reponse: "Le fonds de roulement représente la partie des ressources stables (capitaux propres + dettes à long terme) qui finance les besoins du cycle d'exploitation. Formule : FR = Ressources stables − Emplois stables (actif immobilisé).",
    xp: 9,
  },
  {
    id: "gf-09", programme: "gestion_finance", notion: "Besoin en fonds de roulement",
    question: "Qu'est-ce que le besoin en fonds de roulement (BFR) ?",
    reponse: "Le BFR est le besoin de financement créé par le décalage entre les encaissements et les décaissements du cycle d'exploitation. Formule : BFR = Stocks + Créances clients − Dettes fournisseurs.",
    xp: 9,
  },
  {
    id: "gf-10", programme: "gestion_finance", notion: "Taux de marge",
    question: "Comment calcule-t-on le taux de marge ?",
    reponse: "Le taux de marge mesure la rentabilité par rapport au coût d'achat. Formule : Taux de marge = (Marge commerciale / Coût d'achat HT) × 100. Exemple : si le coût est 80 € et la marge 20 €, le taux de marge est de 25 %.",
    xp: 9,
  },
  {
    id: "gf-11", programme: "gestion_finance", notion: "Taux de marque",
    question: "Comment calcule-t-on le taux de marque ?",
    reponse: "Le taux de marque mesure la part de la marge dans le prix de vente. Formule : Taux de marque = (Marge commerciale / Prix de vente HT) × 100. C'est l'indicateur utilisé dans la grande distribution.",
    xp: 9,
  },
  {
    id: "gf-12", programme: "gestion_finance", notion: "Capacité d'autofinancement",
    question: "Qu'est-ce que la capacité d'autofinancement (CAF) ?",
    reponse: "La CAF est la ressource financière interne générée par l'activité de l'entreprise. Elle représente le flux de trésorerie potentiel dégagé sur l'exercice. Une CAF positive permet de financer les investissements, rembourser les dettes ou distribuer des dividendes.",
    xp: 9,
  },
  {
    id: "gf-13", programme: "gestion_finance", notion: "Amortissement",
    question: "Qu'est-ce que l'amortissement en comptabilité ?",
    reponse: "L'amortissement est la constatation comptable de la perte de valeur d'un bien durable (immobilisation) liée à l'usure ou au temps. Il est étalé sur la durée de vie du bien et constitue une charge qui diminue le résultat.",
    xp: 8,
  },
  {
    id: "gf-14", programme: "gestion_finance", notion: "Investissement",
    question: "Qu'est-ce qu'un investissement pour une entreprise ?",
    reponse: "Un investissement est une dépense à long terme destinée à augmenter la capacité productive ou la valeur de l'entreprise (achat de machines, logiciels, immeubles...). On distingue les investissements matériels, immatériels et financiers.",
    xp: 8,
  },
  {
    id: "gf-15", programme: "gestion_finance", notion: "Ratio de liquidité",
    question: "Qu'est-ce que le ratio de liquidité générale ?",
    reponse: "Le ratio de liquidité générale mesure la capacité de l'entreprise à rembourser ses dettes à court terme avec ses actifs circulants. Formule : Ratio = Actif circulant / Dettes à court terme. Un ratio > 1 est rassurant.",
    xp: 9,
  },
  {
    id: "gf-16", programme: "gestion_finance", notion: "Point mort",
    question: "Qu'est-ce que le point mort (date du seuil de rentabilité) ?",
    reponse: "Le point mort est la date à laquelle l'entreprise atteint son seuil de rentabilité dans l'année. Formule : Point mort (en jours) = (Seuil de rentabilité / CA annuel) × 360. Avant cette date, l'entreprise est en perte.",
    xp: 9,
  },

  // ─── MERCATIQUE ──────────────────────────────────────────────────────────────
  {
    id: "mkt-01", programme: "mercatique", notion: "Mercatique",
    question: "Qu'est-ce que la mercatique (marketing) ?",
    reponse: "La mercatique est l'ensemble des actions et techniques permettant à une organisation d'identifier les besoins des clients, de créer une offre adaptée et de la faire connaître, afin d'atteindre ses objectifs commerciaux.",
    xp: 9,
  },
  {
    id: "mkt-02", programme: "mercatique", notion: "Segmentation",
    question: "Qu'est-ce que la segmentation de marché ?",
    reponse: "La segmentation consiste à diviser le marché en groupes de consommateurs homogènes (segments) partageant des caractéristiques communes (âge, revenus, comportements...). Elle permet d'adapter l'offre à chaque groupe.",
    xp: 9,
  },
  {
    id: "mkt-03", programme: "mercatique", notion: "Ciblage",
    question: "Qu'est-ce que le ciblage en mercatique ?",
    reponse: "Le ciblage est le choix du ou des segments de marché que l'entreprise décide de viser. Il s'effectue après la segmentation. On distingue le ciblage de masse (indifférencié), concentré (une niche) ou différencié (plusieurs segments).",
    xp: 9,
  },
  {
    id: "mkt-04", programme: "mercatique", notion: "Positionnement",
    question: "Qu'est-ce que le positionnement d'une marque ou d'un produit ?",
    reponse: "Le positionnement est la place qu'occupe une offre dans l'esprit du consommateur par rapport aux concurrents. Il se définit par deux axes clés (ex. : qualité/prix) et doit être crédible, distinctif et attractif.",
    xp: 9,
  },
  {
    id: "mkt-05", programme: "mercatique", notion: "Mix marketing 4P",
    question: "Qu'est-ce que le mix marketing 4P ?",
    reponse: "Le mix marketing regroupe les 4 leviers d'action : Produit (caractéristiques, gamme), Prix (tarification, remises), Place (distribution, réseau de vente) et Promotion (communication, publicité). Ces 4P doivent être cohérents entre eux.",
    xp: 9,
  },
  {
    id: "mkt-06", programme: "mercatique", notion: "Politique de produit",
    question: "Qu'est-ce que la politique de produit ?",
    reponse: "La politique de produit définit les caractéristiques de l'offre : qualité, design, marque, conditionnement, gamme, services associés et cycle de vie. L'objectif est de répondre aux attentes des clients ciblés.",
    xp: 8,
  },
  {
    id: "mkt-07", programme: "mercatique", notion: "Politique de prix",
    question: "Quelles sont les stratégies de prix possibles ?",
    reponse: "Les stratégies de prix incluent : l'écrémage (prix élevé pour cibler les clients haut de gamme), la pénétration (prix bas pour conquérir rapidement un marché), l'alignement (suivre les prix concurrents) et la discrimination (prix différents selon les segments).",
    xp: 9,
  },
  {
    id: "mkt-08", programme: "mercatique", notion: "Politique de distribution",
    question: "Qu'est-ce que la politique de distribution ?",
    reponse: "La politique de distribution définit comment l'offre parvient au client : choix des canaux (direct, indirect, multicanal), de la couverture géographique (intensive, sélective, exclusive) et de la logistique associée.",
    xp: 8,
  },
  {
    id: "mkt-09", programme: "mercatique", notion: "Communication commerciale",
    question: "Qu'est-ce que la politique de communication commerciale ?",
    reponse: "La politique de communication vise à informer, séduire et fidéliser les clients. Elle utilise différents outils : publicité, promotion des ventes, relations publiques, communication digitale (réseaux sociaux, e-mailing).",
    xp: 8,
  },
  {
    id: "mkt-10", programme: "mercatique", notion: "E-mercatique",
    question: "Qu'est-ce que la e-mercatique ?",
    reponse: "La e-mercatique regroupe toutes les actions mercatiques réalisées sur Internet : site web, SEO, réseaux sociaux, publicité en ligne (SEA), e-mailing, affiliation. Elle permet de cibler précisément et de mesurer les résultats en temps réel.",
    xp: 8,
  },
  {
    id: "mkt-11", programme: "mercatique", notion: "Étude de marché",
    question: "Qu'est-ce qu'une étude de marché ?",
    reponse: "Une étude de marché est une démarche d'analyse de la demande (qui sont les clients, quels sont leurs besoins), de l'offre (concurrents) et de l'environnement. Elle se base sur des études quantitatives (sondages) et qualitatives (entretiens).",
    xp: 8,
  },
  {
    id: "mkt-12", programme: "mercatique", notion: "Fidélisation",
    question: "Qu'est-ce que la fidélisation client ?",
    reponse: "La fidélisation regroupe les actions visant à conserver durablement les clients en renforçant leur satisfaction et leur attachement à la marque. Les outils incluent les programmes de fidélité, les offres personnalisées et le service après-vente.",
    xp: 8,
  },
  {
    id: "mkt-13", programme: "mercatique", notion: "Demande solvable",
    question: "Qu'est-ce que la demande solvable ?",
    reponse: "La demande solvable est la partie de la demande potentielle qui dispose réellement des moyens financiers pour acheter le produit ou service. C'est la demande effective sur laquelle l'entreprise peut réellement compter.",
    xp: 8,
  },
  {
    id: "mkt-14", programme: "mercatique", notion: "E-réputation",
    question: "Qu'est-ce que l'e-réputation d'une marque ?",
    reponse: "L'e-réputation est l'image d'une organisation ou d'une marque telle qu'elle est perçue sur Internet (avis clients, réseaux sociaux, forums, blogs). Une mauvaise e-réputation peut gravement nuire aux ventes.",
    xp: 8,
  },
  {
    id: "mkt-15", programme: "mercatique", notion: "Cycle de vie du produit",
    question: "Quelles sont les phases du cycle de vie d'un produit ?",
    reponse: "Le cycle de vie d'un produit comporte 4 phases : (1) lancement (ventes faibles, investissements élevés), (2) croissance (ventes en forte hausse), (3) maturité (ventes au maximum, concurrence intense), (4) déclin (ventes en baisse).",
    xp: 9,
  },
  {
    id: "mkt-16", programme: "mercatique", notion: "Mercatique relationnelle",
    question: "Qu'est-ce que la mercatique relationnelle ?",
    reponse: "La mercatique relationnelle vise à construire une relation durable et personnalisée avec chaque client, plutôt que de chercher uniquement à conclure une vente ponctuelle. Elle s'appuie sur les données clients (CRM) et la personnalisation.",
    xp: 8,
  },

  // ─── RESSOURCES HUMAINES ─────────────────────────────────────────────────────
  {
    id: "rh-01", programme: "ressources_humaines", notion: "GRH",
    question: "Qu'est-ce que la gestion des ressources humaines (GRH) ?",
    reponse: "La GRH est l'ensemble des pratiques permettant à l'organisation de gérer ses ressources humaines : recrutement, formation, évaluation, rémunération, gestion des carrières et des relations sociales. Elle vise à concilier les besoins de l'organisation et les attentes des salariés.",
    xp: 9,
  },
  {
    id: "rh-02", programme: "ressources_humaines", notion: "Recrutement",
    question: "Quelles sont les étapes d'un processus de recrutement ?",
    reponse: "Les étapes du recrutement sont : (1) définition du poste et du profil recherché, (2) diffusion de l'offre, (3) sélection des candidatures (CV, lettre), (4) entretiens, (5) choix du candidat, (6) intégration (onboarding).",
    xp: 9,
  },
  {
    id: "rh-03", programme: "ressources_humaines", notion: "GPEC",
    question: "Qu'est-ce que la GPEC ?",
    reponse: "La GPEC (Gestion Prévisionnelle des Emplois et des Compétences) est une démarche qui anticipe les besoins en compétences à moyen terme pour adapter les ressources humaines aux évolutions de l'organisation. Elle implique formation, mobilité et gestion des départs.",
    xp: 9,
  },
  {
    id: "rh-04", programme: "ressources_humaines", notion: "Motivation",
    question: "Quelles sont les principales théories de la motivation au travail ?",
    reponse: "Parmi les théories clés : la pyramide des besoins de Maslow (besoins physiologiques à l'accomplissement), la théorie bifactorielle de Herzberg (facteurs d'hygiène vs facteurs de motivation) et la théorie X/Y de McGregor (vision négative vs positive du salarié).",
    xp: 9,
  },
  {
    id: "rh-05", programme: "ressources_humaines", notion: "Rémunération",
    question: "Quels sont les composantes de la rémunération d'un salarié ?",
    reponse: "La rémunération globale comprend : le salaire de base, les primes (objectifs, ancienneté, intéressement, participation), les avantages en nature (voiture, téléphone), et la protection sociale (mutuelle, prévoyance). Elle doit être au moins égale au SMIC.",
    xp: 8,
  },
  {
    id: "rh-06", programme: "ressources_humaines", notion: "Formation professionnelle",
    question: "Pourquoi la formation professionnelle est-elle importante ?",
    reponse: "La formation professionnelle permet aux salariés de maintenir et développer leurs compétences pour s'adapter aux évolutions du marché. Pour l'entreprise, c'est un levier de performance et de fidélisation. Elle est cofinancée via le CPF (Compte Personnel de Formation).",
    xp: 8,
  },
  {
    id: "rh-07", programme: "ressources_humaines", notion: "Conflit social",
    question: "Qu'est-ce qu'un conflit social en entreprise ?",
    reponse: "Un conflit social est une opposition entre salariés (ou syndicats) et employeur sur des questions de travail (salaires, conditions, emploi). Il peut se manifester par une grève, un débrayage ou des négociations. Il peut être résolu par la médiation ou la négociation.",
    xp: 8,
  },
  {
    id: "rh-08", programme: "ressources_humaines", notion: "Négociation collective",
    question: "Qu'est-ce que la négociation collective ?",
    reponse: "La négociation collective est le dialogue entre représentants des salariés (syndicats) et de l'employeur pour conclure des accords collectifs (conventions collectives, accords d'entreprise) sur les conditions de travail, les salaires ou l'emploi.",
    xp: 8,
  },
  {
    id: "rh-09", programme: "ressources_humaines", notion: "Droit syndical",
    question: "Qu'est-ce que le droit syndical en France ?",
    reponse: "Le droit syndical est le droit pour les salariés de créer ou adhérer à un syndicat pour défendre leurs intérêts collectifs. Les délégués syndicaux ont des heures de délégation payées et une protection contre le licenciement.",
    xp: 8,
  },
  {
    id: "rh-10", programme: "ressources_humaines", notion: "QVCT",
    question: "Qu'est-ce que la QVCT ?",
    reponse: "La Qualité de Vie et des Conditions de Travail (QVCT) désigne l'ensemble des actions qui visent à améliorer le bien-être des salariés : ergonomie des postes, management bienveillant, conciliation vie pro/personnelle, prévention des risques psychosociaux.",
    xp: 8,
  },
  {
    id: "rh-11", programme: "ressources_humaines", notion: "Temps de travail",
    question: "Quelle est la durée légale du travail en France ?",
    reponse: "La durée légale du travail est de 35 heures par semaine. Au-delà, les heures supplémentaires sont majorées (25 % pour les 8 premières, 50 % au-delà). Des conventions collectives peuvent prévoir des aménagements différents.",
    xp: 8,
  },
  {
    id: "rh-12", programme: "ressources_humaines", notion: "Télétravail",
    question: "Qu'est-ce que le télétravail et quels en sont les enjeux ?",
    reponse: "Le télétravail est une forme d'organisation du travail effectuée hors des locaux de l'employeur, via des outils numériques. Ses avantages : flexibilité, gain de temps. Ses risques : isolement, difficultés à séparer vie privée et professionnelle.",
    xp: 8,
  },
  {
    id: "rh-13", programme: "ressources_humaines", notion: "Discrimination à l'embauche",
    question: "Qu'est-ce que la discrimination à l'embauche ?",
    reponse: "La discrimination à l'embauche consiste à refuser un candidat en raison d'un critère non professionnel (sexe, âge, origine, religion, handicap...). Elle est illégale en France et peut être sanctionnée pénalement.",
    xp: 8,
  },
  {
    id: "rh-14", programme: "ressources_humaines", notion: "Évaluation des performances",
    question: "À quoi sert l'entretien annuel d'évaluation ?",
    reponse: "L'entretien annuel permet de faire le bilan des réalisations du salarié par rapport aux objectifs fixés, d'identifier les besoins en formation et de fixer de nouveaux objectifs. Il est un outil clé de gestion des carrières.",
    xp: 8,
  },
  {
    id: "rh-15", programme: "ressources_humaines", notion: "Contrat d'apprentissage",
    question: "Qu'est-ce qu'un contrat d'apprentissage ?",
    reponse: "Le contrat d'apprentissage est un contrat de travail combinant formation pratique en entreprise (chez un maître d'apprentissage) et formation théorique en CFA (Centre de Formation d'Apprentis). Il prépare à un diplôme allant du CAP jusqu'au BAC+5.",
    xp: 8,
  },
  {
    id: "rh-16", programme: "ressources_humaines", notion: "Intégration",
    question: "Pourquoi l'intégration (onboarding) d'un nouveau salarié est-elle importante ?",
    reponse: "L'intégration (ou onboarding) est la période d'accueil et d'accompagnement d'un nouveau salarié. Une bonne intégration favorise la montée en compétences, la fidélisation et la réduction du turnover. Elle inclut la présentation de l'équipe, des processus et de la culture d'entreprise.",
    xp: 8,
  },

  // ─── NUMÉRIQUE & SI ──────────────────────────────────────────────────────────
  {
    id: "num-01", programme: "numerique_si", notion: "RGPD",
    question: "Qu'est-ce que le RGPD et à quoi s'applique-t-il ?",
    reponse: "Le RGPD (Règlement Général sur la Protection des Données) est un règlement européen entré en vigueur en 2018. Il protège les données personnelles des citoyens européens et impose des obligations aux organisations qui les traitent, sous peine de lourdes sanctions.",
    xp: 9,
  },
  {
    id: "num-02", programme: "numerique_si", notion: "Donnée personnelle",
    question: "Qu'est-ce qu'une donnée personnelle au sens du RGPD ?",
    reponse: "Une donnée personnelle est toute information permettant d'identifier une personne physique, directement (nom, prénom) ou indirectement (adresse IP, numéro de téléphone, données de localisation, cookie...).",
    xp: 9,
  },
  {
    id: "num-03", programme: "numerique_si", notion: "Triade CIA",
    question: "Que signifie la triade CIA en sécurité informatique ?",
    reponse: "La triade CIA regroupe les trois piliers de la sécurité informatique : Confidentialité (seules les personnes autorisées accèdent aux données), Intégrité (les données ne sont pas altérées) et Disponibilité (les systèmes sont accessibles quand on en a besoin).",
    xp: 9,
  },
  {
    id: "num-04", programme: "numerique_si", notion: "Cloud computing",
    question: "Qu'est-ce que le cloud computing ?",
    reponse: "Le cloud computing est l'accès à des ressources informatiques (stockage, puissance de calcul, applications) via Internet, sans les posséder physiquement. On distingue les modèles SaaS (logiciel), PaaS (plateforme) et IaaS (infrastructure).",
    xp: 8,
  },
  {
    id: "num-05", programme: "numerique_si", notion: "Cybersécurité",
    question: "Qu'est-ce que la cybersécurité ?",
    reponse: "La cybersécurité est l'ensemble des pratiques, technologies et processus visant à protéger les systèmes informatiques, réseaux et données contre les attaques, les accès non autorisés et les dommages.",
    xp: 8,
  },
  {
    id: "num-06", programme: "numerique_si", notion: "Phishing",
    question: "Qu'est-ce qu'une attaque de phishing ?",
    reponse: "Le phishing (hameçonnage) est une technique de fraude qui consiste à envoyer un message (e-mail, SMS) imitant un organisme de confiance (banque, administration) pour inciter la victime à divulguer ses identifiants ou données bancaires.",
    xp: 8,
  },
  {
    id: "num-07", programme: "numerique_si", notion: "MFA",
    question: "Qu'est-ce que l'authentification multifacteur (MFA) ?",
    reponse: "L'authentification multifacteur exige au moins deux preuves d'identité distinctes pour se connecter : quelque chose que l'on sait (mot de passe), que l'on possède (téléphone, token) ou ce que l'on est (empreinte digitale). Elle renforce considérablement la sécurité.",
    xp: 8,
  },
  {
    id: "num-08", programme: "numerique_si", notion: "RGPD – Droits des personnes",
    question: "Quels sont les principaux droits des individus accordés par le RGPD ?",
    reponse: "Le RGPD accorde : le droit d'accès (voir ses données), le droit de rectification (corriger), le droit à l'effacement (« droit à l'oubli »), le droit d'opposition (refuser certains traitements) et le droit à la portabilité des données.",
    xp: 9,
  },
  {
    id: "num-09", programme: "numerique_si", notion: "DPO",
    question: "Quel est le rôle du DPO (Délégué à la Protection des Données) ?",
    reponse: "Le DPO est le responsable de la conformité au RGPD au sein d'une organisation. Il conseille, sensibilise et contrôle le respect des règles de protection des données. Sa nomination est obligatoire pour certaines organisations.",
    xp: 8,
  },
  {
    id: "num-10", programme: "numerique_si", notion: "Big data",
    question: "Qu'est-ce que le big data ?",
    reponse: "Le big data désigne des ensembles de données caractérisés par les 3V : Volume (très grande quantité), Vélocité (traitement en temps réel) et Variété (formats divers : textes, images, vidéos, données structurées...). Il nécessite des outils d'analyse spécifiques.",
    xp: 8,
  },
  {
    id: "num-11", programme: "numerique_si", notion: "API",
    question: "Qu'est-ce qu'une API ?",
    reponse: "Une API (Application Programming Interface) est une interface qui permet à deux applications de communiquer et d'échanger des données. Elle définit les règles d'échange. Les APIs sont au cœur de l'interconnexion des services numériques modernes.",
    xp: 8,
  },
  {
    id: "num-12", programme: "numerique_si", notion: "Réseau informatique",
    question: "Qu'est-ce qu'un réseau informatique ?",
    reponse: "Un réseau informatique est un ensemble d'équipements (ordinateurs, serveurs, routeurs...) connectés entre eux pour partager des données et des ressources. On distingue les réseaux locaux (LAN), étendus (WAN) et Internet.",
    xp: 8,
  },
  {
    id: "num-13", programme: "numerique_si", notion: "Pare-feu",
    question: "Qu'est-ce qu'un pare-feu (firewall) ?",
    reponse: "Un pare-feu est un dispositif de sécurité (logiciel ou matériel) qui filtre le trafic réseau entrant et sortant selon des règles définies, afin de bloquer les accès non autorisés tout en permettant les communications légitimes.",
    xp: 8,
  },
  {
    id: "num-14", programme: "numerique_si", notion: "Sauvegarde",
    question: "Pourquoi les sauvegardes régulières sont-elles essentielles ?",
    reponse: "Les sauvegardes permettent de restaurer les données en cas de panne, d'attaque (ransomware), d'erreur humaine ou de sinistre. La règle 3-2-1 recommande : 3 copies, sur 2 supports différents, dont 1 hors site.",
    xp: 8,
  },
  {
    id: "num-15", programme: "numerique_si", notion: "Blockchain",
    question: "Qu'est-ce que la blockchain ?",
    reponse: "La blockchain est un registre numérique distribué qui enregistre des transactions de façon transparente, sécurisée et infalsifiable. Chaque « bloc » de données est chaîné au précédent. Elle est utilisée pour les cryptomonnaies, les contrats intelligents et la traçabilité.",
    xp: 8,
  },
  {
    id: "num-16", programme: "numerique_si", notion: "Intelligence artificielle",
    question: "Qu'est-ce que l'intelligence artificielle (IA) et quelles sont ses applications en entreprise ?",
    reponse: "L'IA désigne la simulation de capacités cognitives humaines par des algorithmes. En entreprise, elle s'applique à la détection de fraudes, aux recommandations clients, à l'automatisation des tâches répétitives, aux chatbots et à l'analyse prédictive.",
    xp: 9,
  },
];

export const FLASHCARD_PROGRAMME_LABELS: Record<FlashcardProgramme, string> = {
  management: "Management",
  droit: "Droit",
  economie: "Économie",
  sciences_gestion: "Sciences de Gestion",
  gestion_finance: "Gestion & Finance",
  mercatique: "Mercatique",
  ressources_humaines: "Ressources Humaines",
  numerique_si: "Numérique & SI",
};

export function getFlashcardsByProgramme(p: FlashcardProgramme | "tous"): FlashcardItem[] {
  if (p === "tous") return [...FLASHCARDS];
  return FLASHCARDS.filter((c) => c.programme === p);
}
