import type { SdgnMissionExercise } from "../types";


export const SDGN_CHAP9_EXERCISES: SdgnMissionExercise[] = [
  {
    id: "sdgn9-e1",
    title: "Valeur perçue et arbitrage du consommateur",
    type: "Exercice",
    difficulty: "Facile",
    xp: 120,
    minChars: 120,
    support: "Sur le site de la marque de sport Decathlon, Léa, lycéenne de 17 ans, hésite entre deux chaussures de running à 89 € et 129 €. La paire à 129 € promet une semelle amortissante testée en laboratoire (élément objectif) et arbore le logo « Kiprun Pro » associé aux marathoniens (élément subjectif). Léa estime que la paire chère « vaut le coup » car elle court trois fois par semaine et veut éviter les blessures, mais elle doit aussi sacrifier de l'argent de poche et du temps pour comparer les avis en ligne. Elle retient finalement le modèle à 129 € : c'est le prix maximal qu'elle accepte de payer pour ce bénéfice perçu.",
    consigne: "À partir du support, définis la valeur perçue et explique le processus d'arbitrage entre avantages attendus et sacrifices consentis, sans la confondre avec la valeur réelle.",
    questions: [
      "Qu'est-ce que la valeur perçue selon le cours ?",
      "Identifie dans le texte au moins deux avantages attendus et deux sacrifices consentis.",
      "Pourquoi la valeur perçue de Léa n'est-elle pas forcément égale à la valeur réelle (coût de production) du produit ?"
    ],
    correctionModele: "1) Définition de la valeur perçue :\nLa valeur perçue est la valeur qu'un bien ou un service revêt dans l'esprit du consommateur. Elle correspond au prix maximal que le consommateur est prêt à payer. Elle résulte d'un arbitrage entre les avantages attendus et les sacrifices consentis.\n\n2) Avantages et sacrifices repérés :\nAvantages : amorti du pied (performance objective), image « Kiprun Pro » / appartenance aux coureurs (subjectif), réduction du risque de blessure.\nSacrifices : prix 129 € (sacrifice monétaire), temps passé à lire les avis, effort de comparaison entre modèles.\n\n3) Distinction valeur perçue / valeur réelle :\nLa valeur réelle (économique) reflète le coût de fabrication et la fonction utilitaire objective. La valeur perçue est subjective : Léa intègre des critères personnels (fréquence de course, crainte des blessures, image de marque). Deux consommateurs peuvent payer des prix différents pour le même produit selon leur arbitrage.",
    attendu: "Définition exacte, repérage avantages/sacrifices, distinction perçue/réelle.",
  },
  {
    id: "sdgn9-e2",
    title: "Éléments objectifs et subjectifs",
    type: "Exercice",
    difficulty: "Facile",
    xp: 130,
    minChars: 140,
    support: "La marque Nespresso met en avant la pression de la machine (19 bars), la température exacte de l'eau et le recyclage des capsules (éléments objectifs). Parallèlement, George Clooney incarne l'élégance du rituel café, les boutiques design et le club fidélité renforcent le sentiment d'exclusivité (éléments subjectifs). Un concurrent discount propose des dosettes compatibles à moitié prix : composition chimique similaire selon un test laboratoire indépendant, mais sans storytelling ni service après-vente premium.",
    consigne: "Distingue éléments objectifs et subjectifs dans la construction de la valeur perçue. Explique comment Nespresso peut influencer l'arbitrage du consommateur.",
    questions: [
      "Quels éléments objectifs Nespresso met-elle en avant dans le support ?",
      "Quels éléments subjectifs renforcent la valeur perçue ?",
      "Pourquoi le concurrent discount peut-il échouer malgré une performance objective comparable ?"
    ],
    correctionModele: "1) Éléments objectifs :\nPression 19 bars, température contrôlée, recyclage des capsules — caractéristiques mesurables du produit et du service.\n\n2) Éléments subjectifs :\nImage de marque portée par George Clooney, boutiques design, club fidélité, rituel d'exclusivité — représentations mentales et émotionnelles.\n\n3) Échec possible du discount :\nLe consommateur n'arbitre pas uniquement sur la composition : il intègre l'image, la confiance, le SAV. Nespresso agit sur le design, la publicité, l'expérience boutique pour élever les avantages perçus et justifier un prix supérieur.",
    attendu: "Classification objectif/subjectif correcte, lien avec stratégie marketing.",
  },
  {
    id: "sdgn9-e3",
    title: "Image de marque",
    type: "Exercice",
    difficulty: "Facile",
    xp: 140,
    minChars: 150,
    support: "Après un documentaire diffusé sur une plateforme de streaming, l'image de la marque de mode « FastTrend » bascule : les réseaux associent la marque à la surconsommation textile et au travail précaire. Les ventes en magasin chutent de 9 % en un trimestre. La direction lance une collection « seconde vie » avec étiquetage transparent des ateliers et partenariat avec une ONG. Six mois plus tard, une enquête qualité montre que 42 % des sondés perçoivent une image « en progrès », contre 18 % avant la crise.",
    consigne: "Définis l'image de marque et analyse comment une image négative puis positive influence la valeur perçue et les ventes.",
    questions: [
      "Qu'est-ce que l'image de marque ?",
      "Comment la diffusion du documentaire a-t-elle modifié l'image de FastTrend ?",
      "En quoi la collection « seconde vie » est-elle une action pour reconstruire la valeur perçue ?"
    ],
    correctionModele: "1) Image de marque :\nEnsemble des représentations mentales, positives ou négatives, associées à une marque ou une organisation. Une image positive attire des clients ; une image négative les éloigne.\n\n2) Impact du documentaire :\nL'image devient négative (surconsommation, précarité) : la valeur perçue baisse, les consommateurs ne sont plus prêts à payer le même prix : chute des ventes (-9 %).\n\n3) Action « seconde vie » :\nTransparence, partenariat ONG : l'entreprise agit sur les éléments subjectifs et objectifs de l'arbitrage (éthique, traçabilité). L'enquête montre une amélioration de l'image perçue (42 %), ce qui peut restaurer la valeur perçue et les performances commerciales.",
    attendu: "Définition image de marque, enchaînement crise / action / reprise.",
  },
  {
    id: "sdgn9-e4",
    title: "Notoriété assistée, spontanée et top of mind",
    type: "Exercice",
    difficulty: "Moyen",
    xp: 180,
    minChars: 160,
    support: "Un institut de sondage interroge 1 000 Français sur les marques de yaourt. Résultats : notoriété assistée (liste de marques proposée) — Danone 94 %, Yoplait 91 %, Andros 78 %. Notoriété spontanée (sans liste) — Danone 62 %, Yoplait 48 %, Andros 12 %. Top of mind (première marque citée) — Danone 38 %, Yoplait 22 %, Andros 3 %. Andros investit dans des spots TV et des échantillons en grande distribution pour augmenter sa notoriété spontanée avant un lancement de gamme végétale.",
    supportTables: [
      { title: "Notoriété des marques de yaourt (sondage n = 1 000)", columns: ["Marque", "Assistée (%)", "Spontanée (%)", "Top of mind (%)"], rows: [["Danone", "94", "62", "38"], ["Yoplait", "91", "48", "22"], ["Andros", "78", "12", "3"]] },
    ],    consigne: "Définis la notoriété et les trois indicateurs du manuel. Interprète les écarts entre Danone, Yoplait et Andros.",
    questions: [
      "Qu'est-ce que la notoriété d'une marque ?",
      "Définis et compare les trois taux pour Andros.",
      "Pourquoi Andros cible-t-il la notoriété spontanée plutôt que l'assistée ?"
    ],
    correctionModele: "1) Notoriété :\nDegré de connaissance de la marque par les consommateurs, mesuré par sondages.\n\n2) Trois indicateurs pour Andros :\n— Assistée 78 % : citée quand on la propose — bonne reconnaissance aidée.\n— Spontanée 12 % : peu citée sans aide — faible présence dans l'esprit.\n— Top of mind 3 % : rarement première marque — faible domination mentale.\nÉcart assistée/spontanée = marque connue si rappelée, mais pas leader naturel.\n\n3) Cible spontanée :\nPour un lancement, il faut que les consommateurs pensent à Andros sans liste : la publicité et les échantillons renforcent le rappel spontané et le top of mind.",
    attendu: "Trois indicateurs définis, interprétation des écarts, stratégie Andros justifiée.",
  },
  {
    id: "sdgn9-e5",
    title: "Qualité perçue et satisfaction",
    type: "Exercice",
    difficulty: "Moyen",
    xp: 190,
    minChars: 170,
    support: "Free propose une box internet avec installation sous 48 h, application de suivi de panne et hotline 24h/7j (services associés augmentant la qualité perçue). Après six mois, un client note 4/5 sur le débit mais 2/5 sur l'accueil téléphonique : ses attentes initiales (résolution en un appel) n'ont pas été satisfaites. Il menace de résilier malgré un prix attractif. Free lui offre un mois gratuit et un rappel prioritaire : la note globale passe à 4/5 et il renouvelle son abonnement.",
    consigne: "Distingue qualité perçue et satisfaction. Explique le lien entre satisfaction et fidélisation.",
    questions: [
      "Qu'est-ce que la qualité perçue dans cet exemple ?",
      "Pourquoi le client n'est-il pas satisfait malgré un bon débit ?",
      "Comment l'action de Free illustre-t-elle le rôle de la satisfaction pour la fidélisation ?"
    ],
    correctionModele: "1) Qualité perçue :\nCaractéristiques du service (débit, délai installation, hotline, appli) permettant de satisfaire les besoins. Les services associés (48 h, 24h/7j) renforcent la qualité perçue.\n\n2) Insatisfaction :\nLa satisfaction naît de la comparaison attentes / expérience vécue. Attente : résolution en un appel. Expérience : accueil 2/5 : écart négatif malgré qualité technique correcte.\n\n3) Fidélisation :\nFree corrige l'expérience (mois offert, rappel prioritaire) pour réduire l'écart. Note 4/5 et renouvellement : la satisfaction est un préalable à la fidélisation ; sans elle, le prix seul ne suffit pas.",
    attendu: "Qualité vs satisfaction distinguées, mécanisme attentes/expérience.",
  },
  {
    id: "sdgn9-e6",
    title: "Médias sociaux et communautés en ligne",
    type: "Exercice",
    difficulty: "Moyen",
    xp: 210,
    minChars: 180,
    support: "La marque cosmétique « GlowLab » anime une page Instagram (2,4 M d'abonnés), une chaîne YouTube de tutoriels maquillage et un hashtag #GlowLabChallenge. Les internautes partagent photos avant/après ; une communauté de 180 000 membres échange des routines « peau sensible ». GlowLab diffuse du brand content (diaporamas « journée avec une maquilleuse pro ») sans publicité TV traditionnelle. Les ventes e-commerce progressent de 22 % sur l'année.",
    consigne: "Explique comment les médias sociaux permettent d'agir sur la valeur perçue. Mobilise communauté en ligne, partage de contenus et brand content.",
    questions: [
      "Qu'est-ce qu'un média social selon le cours ?",
      "Identifie trois usages de GlowLab sur les médias sociaux.",
      "En quoi le brand content renforce-t-il la valeur perçue ?"
    ],
    correctionModele: "1) Médias sociaux :\nPlateformes digitales (réseaux, blogs…) permettant d'établir des réseaux et de partager des contenus (infos produits, photos, vidéos, avis).\n\n2) Usages GlowLab :\n— Diffusion d'informations et tutoriels (Instagram, YouTube).\n— Avis et contenus générés par les utilisateurs (#GlowLabChallenge).\n— Communauté en ligne autour du thème « peau sensible ».\n\n3) Brand content :\nContenus de marque (expérience maquilleuse pro) créant une relation personnalisée et une expérience privilégiée. Cela élève les avantages perçus (apprentissage, appartenance) sans baisser le prix : valeur perçue et ventes en hausse.",
    attendu: "Définition médias sociaux, usages repérés, brand content relié à la valeur perçue.",
  },
  {
    id: "sdgn9-e7",
    title: "Influenceurs et e-réputation",
    type: "Exercice",
    difficulty: "Moyen",
    xp: 230,
    minChars: 190,
    support: "La start-up française « LoopBottle » (gourde réutilisable) s'associe à une youtubeuse éco-responsable (1,2 M d'abonnés) pour un test en live. Le jour J, un tweet viral accuse la gourde de contenir du plastique non recyclé ; le hashtag #LoopBottleScam dépasse 50 000 mentions en 6 h. Le community manager publie une analyse laboratoire indépendante sous 3 h et propose un échange gratuit aux clients mécontents. La e-réputation se stabilise après 48 h, mais les ventes du week-end chutent de 35 %.",
    consigne: "Définis influenceur et e-réputation. Analyse l'intérêt et les risques des médias sociaux pour une marque.",
    questions: [
      "Qu'est-ce qu'un influenceur ? Comment peut-il agir sur la valeur perçue ?",
      "Qu'est-ce que l'e-réputation et que s'est-il passé pour LoopBottle ?",
      "Quel rôle du community manager dans la gestion de crise ?"
    ],
    correctionModele: "1) Influenceur :\nIndividu dont le statut, la position ou l'exposition médiatique peut influencer les comportements d'achat. Ici, la youtubeuse renforce positivement la valeur perçue éco-responsable.\n\n2) E-réputation :\nEnsemble de ce qui se dit sur la marque via les médias digitaux. Le « mauvais buzz » dégrade l'image et la valeur perçue (suspicion sur le plastique) : chute des ventes.\n\n3) Community manager :\nVeille et réaction rapide : preuve laboratoire, échange clients. Objectif : limiter la détérioration de l'image, restaurer la confiance. Négliger les avis négatifs aurait aggravé la performance globale.",
    attendu: "Influenceur et e-réputation définis, crise et réaction analysées.",
  },
  {
    id: "sdgn9-e8",
    title: "KPI quantitatifs des médias sociaux",
    type: "Exercice",
    difficulty: "Difficile",
    xp: 260,
    minChars: 200,
    support: "L'Oréal France suit mensuellement sa campagne TikTok #BeautyForAll. Données du mois de mars : followers +12 000, publications 18, mentions de marque 45 600, interactions (likes, partages, commentaires) 892 000, utilisateurs engagés 124 000. Le taux d'engagement = interactions / followers moyens du mois. Le directeur marketing compare ces KPI à ceux de L'Oréal Allemagne pour ajuster le calendrier éditorial.",
    supportTables: [
      { title: "KPI TikTok — L'Oréal France (mars)", columns: ["Indicateur", "Valeur"], rows: [["Nouveaux followers", "12 000"], ["Publications", "18"], ["Mentions de marque", "45 600"], ["Interactions", "892 000"], ["Utilisateurs engagés", "124 000"], ["Followers (fin de mois, estim.)", "2 100 000"]] },
    ],    consigne: "Présente les KPI comme indicateurs clés de performance sur les médias sociaux. Calcule le taux d'engagement et interprète les chiffres.",
    questions: [
      "Qu'est-ce qu'un KPI dans le contexte digital ?",
      "Cite quatre indicateurs quantitatifs présents dans le support.",
      "Calcule le taux d'engagement (interactions / followers fin de mois estimés à 2,1 M) et commente."
    ],
    correctionModele: "1) KPI :\nKey Performance Indicators : indicateurs mesurant l'efficacité de la présence digitale et des campagnes social media.\n\n2) Indicateurs quantitatifs :\nNombre de followers, publications, mentions, interactions, utilisateurs engagés.\n\n3) Calcul et interprétation :\nTaux d'engagement = 892 000 / 2 100 000 ≈ 42,5 % (ordre de grandeur selon méthode retenue). Volume d'interactions élevé : contenu mobilise la communauté. Comparaison internationale permet d'optimiser la stratégie en temps réel.",
    attendu: "KPI définis, indicateurs quantitatifs listés, calcul d'engagement commenté.",
  },
  {
    id: "sdgn9-e9",
    title: "KPI qualitatifs et décisions marketing",
    type: "Exercice",
    difficulty: "Difficile",
    xp: 280,
    minChars: 210,
    support: "Avant de lancer un parfum sur le marché adolescent, Chanel analyse les KPI qualitatifs de sa communauté Discord : profil des membres (72 % 15-24 ans, 58 % femmes), influenceurs les plus cités (trois créateurs mode), tonalité des mentions (78 % positives sur les flacons, 34 % négatives sur le prix). Les posts avec démonstration « unboxing » génèrent le plus de commentaires enthousiastes. La direction décide un format mini-flacon à 39 € et un programme ambassadeurs lycéens.",
    consigne: "Explique les indicateurs qualitatifs et montre comment ils orientent les décisions marketing (cible, prix, contenu).",
    questions: [
      "Quels KPI qualitatifs Chanel utilise-t-elle ?",
      "Quelles décisions marketing en découlent ?",
      "Pourquoi la mesure de la valeur perçue influence-t-elle la performance de l'organisation ?"
    ],
    correctionModele: "1) KPI qualitatifs :\nProfil des utilisateurs, influenceurs clés, contenu des mentions (positif/négatif sur prix et produit), types de posts les plus commentés positivement.\n\n2) Décisions :\n— Mini-flacon à 39 € : réponse aux critiques prix, adaptation à la cible jeune.\n— Ambassadeurs lycéens : s'appuyer sur les créateurs mode et le format unboxing performant.\n\n3) Lien performance :\nMesurer la valeur perçue (image, satisfaction, notoriété digitale) permet de gagner en notoriété, fidéliser, repositionner l'offre et augmenter les ventes — amélioration globale des performances.",
    attendu: "KPI qualitatifs identifiés, décisions cohérentes, lien avec performance.",
  },
  {
    id: "sdgn9-e10",
    title: "Synthèse : quatre piliers de la valeur perçue",
    type: "Exercice",
    difficulty: "Tres difficile",
    xp: 360,
    minChars: 240,
    support: "Tableau de bord trimestriel de la marque de boissons « Limonade du Sud » :\n— Image : 67 % d'opinions favorables (+5 points).\n— Notoriété spontanée : 41 % (+8 points après campagne influenceurs).\n— Qualité perçue (goût, ingrédients naturels) : note 4,2/5.\n— Satisfaction clients e-commerce : 76 % recommanderaient la marque.\nKPI social media : +28 % d'interactions, e-réputation stabilisée après une rumeur sur le sucre (réponse sous 2 h par le community manager).",
    supportTables: [
      { title: "Tableau de bord valeur perçue — Limonade du Sud (T2)", columns: ["Pilier / KPI", "Indicateur", "Évolution"], rows: [["Image favorable", "67 %", "+5 pts"], ["Notoriété spontanée", "41 %", "+8 pts"], ["Qualité perçue", "4,2 / 5", "stable"], ["Satisfaction (NPS simplifié)", "76 %", "+4 pts"], ["Interactions réseaux sociaux", "base 100", "+28 %"]] },
    ],    consigne: "Synthétise les quatre éléments constitutifs de la valeur perçue et le rôle des médias sociaux / KPI. Propose une priorité d'action pour le trimestre suivant.",
    questions: [
      "Rappelle les quatre éléments constitutifs de la valeur perçue et illustre-les avec le support.",
      "Quel rôle des médias sociaux et des KPI dans ce tableau de bord ?",
      "Quelle priorité marketing recommanderais-tu ? Justifie."
    ],
    correctionModele: "1) Quatre éléments :\n— Image : 67 % favorable.\n— Notoriété : spontanée 41 %, en hausse.\n— Qualité perçue : 4,2/5 sur goût et naturel.\n— Satisfaction : 76 % de recommandation.\n\n2) Médias sociaux et KPI :\nCampagne influenceurs → notoriété. KPI quanti (+28 % interactions). Veille e-réputation (rumeur sucre) → réaction rapide, stabilisation image.\n\n3) Priorité conseillée :\nConsolider la notoriété spontanée et la qualité perçue (ingrédients) via brand content et transparence nutritionnelle, car la satisfaction et l'image progressent déjà — éviter une nouvelle crise e-réputation.",
    attendu: "Quatre piliers mobilisés, KPI intégrés, priorité argumentée.",
  },
  {
    id: "sdgn9-cas1",
    title: "Étude de cas : Michelin et la valeur perçue premium",
    type: "Etude de cas",
    difficulty: "Difficile",
    xp: 560,
    minChars: 400,
    support: "Michelin commercialise des pneus haut de gamme avec garantie kilométrique, service mobilité (dépannage) et campagne « Guide Michelin » renforçant l'excellence. Sur Instagram, la marque partage tests sécurité routière (objectif) et histoires de pilotes (subjectif). Notoriété spontanée pneus : 71 %. Un influenceur automobile critique un modèle ; Michelin répond avec données d'usure réelles. KPI : 1,8 M de followers, 240 000 interactions/mois, 92 % de mentions positives après crise. Prix moyen 25 % supérieur au concurrent générique ; les clients professionnels renouvellent à 88 %.",
    consigne: "Rédige une réponse type bac : valeur perçue, arbitrage, image, notoriété, qualité, satisfaction, médias sociaux, influenceur, e-réputation, KPI. Nomme chaque notion.",
    questions: [
      "Explique la construction de la valeur perçue chez Michelin (avantages/sacrifices, objectif/subjectif).",
      "Analyse image de marque, notoriété et qualité perçue d'après le support.",
      "Quel rôle des médias sociaux, de l'influenceur et de la gestion de l'e-réputation ?",
      "Présente des KPI quantitatifs et qualitatifs et leur utilité pour la direction.",
      "Synthèse (12-15 lignes) : pourquoi Michelin peut pratiquer un prix supérieur ?"
    ],
    correctionModele: "1) Construction valeur perçue :\nArbitrage favorable : avantages (sécurité, garantie, service, prestige Guide) vs sacrifices (prix +25 %, recherche d'info). Éléments objectifs (tests) et subjectifs (pilotes, image premium).\n\n2) Image, notoriété, qualité :\nImage d'excellence et sécurité. Notoriété spontanée 71 %. Qualité perçue via garantie et services associés. Satisfaction mesurée par renouvellement 88 %.\n\n3) Médias sociaux et e-réputation :\nBrand content sécurité ; influenceur = risque mais aussi portée. Réponse data → veille active, limitation du mauvais buzz, 92 % mentions positives.\n\n4) KPI :\nQuanti : followers, interactions. Quali : tonalité mentions. Pilotage campagnes et comparaison concurrentielle.\n\n5) Synthèse :\nMichelin transforme une valeur réelle (technologie pneu) en valeur perçue élevée grâce aux quatre piliers et au digital. Le consommateur accepte un prix supérieur car l'arbitrage lui paraît gagnant — performance commerciale et fidélisation en découlent.",
    attendu: "Cas complet avec toutes les notions du chapitre 9, synthèse argumentée.",
  },
  {
    id: "sdgn9-cas2",
    title: "Étude de cas : Shein, e-réputation et KPI",
    type: "Etude de cas",
    difficulty: "Tres difficile",
    xp: 620,
    minChars: 450,
    support: "Shein, e-commerçant mode fast-fashion, cible les 18-25 ans via TikTok et micro-influenceurs (hauls, codes promo). KPI mars : 34 M de followers TikTok, 2,1 Md d'interactions annuelles, taux d'engagement 8 %. En parallèle, enquêtes qualitatives relèvent 41 % de mentions négatives sur conditions de travail et impact environnemental. Notoriété spontanée France : 58 %. Satisfaction prix : 4,5/5 ; satisfaction éthique : 2,1/5. Une pétition en ligne dépasse 2 M de signatures ; le community manager annonce un rapport fournisseurs mais les ventes Europe ralentissent de 6 %.",
    consigne: "Analyse les contradictions entre KPI quantitatifs brillants et valeur perçue éthique dégradée. Propose trois actions pour restaurer la performance.",
    questions: [
      "Contraste les KPI quantitatifs et les indicateurs qualitatifs/négatifs.",
      "En quoi l'e-réputation et l'image de marque menacent-elles la performance malgré le prix bas ?",
      "Quel rôle des influenceurs dans cette configuration ?",
      "Trois actions concrètes (communication, produit, gouvernance) pour améliorer la valeur perçue.",
      "Synthèse (15 lignes) : peut-on être performant avec une valeur perçue divisée ?"
    ],
    correctionModele: "1) Contraste KPI :\nQuanti : audience et engagement élevés. Quali : mentions négatives éthique, satisfaction éthique 2,1/5 vs prix 4,5/5 — valeur perçue scindée.\n\n2) E-réputation et image :\nMauvaise buzz, pétition : image négative, notoriété « pour de mauvaises raisons ». Arbitrage des clients sensibles : avantage prix insuffisant face au sacrifice moral : ralentissement ventes.\n\n3) Influenceurs :\nRenforcent la notoriété et les ventes court terme, mais peuvent amplifier les critiques si la marque n'est pas crédible sur l'éthique.\n\n4) Actions :\n— Transparence supply chain (rapport public, labels).\n— Brand content RSE et produits « eco-line ».\n— Veille permanente et réponse rapide aux signalements (community manager + cellule crise).\n\n5) Synthèse :\nPerformance durable exige cohérence entre prix, image et satisfaction globale. Des KPI sociaux élevés ne compensent pas une valeur perçue éthique effondrée : l'organisation doit arbitrer entre volume et réputation.",
    attendu: "Contradiction KPI/éthique analysée, actions réalistes, synthèse performance.",
  },
];
