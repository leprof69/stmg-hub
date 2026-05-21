import type { SdgnMissionExercise } from "../types";

export const SDGN_CHAP7_EXERCISES: SdgnMissionExercise[] = [
  {
    id: "sdgn7-e1",
    title: "Visioconférence et travail collaboratif",
    type: "Exercice",
    difficulty: "Facile",
    xp: 120,
    minChars: 120,
    support:
      "Chez Renault, les équipes de conception travaillent en simultané depuis Boulogne-Billancourt, Barcelone et Séoul. Depuis 2022, Renault a déployé Microsoft Teams pour l'ensemble de ses 40 000 salariés. Les ingénieurs peuvent partager des maquettes 3D en temps réel, annoter des plans et prendre des décisions sans attendre les réunions physiques mensuelles. La direction estime que le temps de validation d'un prototype a été réduit de 30 %.",
    consigne: "Réponds aux questions dans l'ordre en t'appuyant sur le support.",
    questions: [
      "Rappelle la fonctionnalité de la visioconférence dans le travail professionnel.",
      "Identifie l'intérêt des technologies numériques dans le cadre du travail collaboratif, en t'appuyant sur l'exemple Renault.",
    ],
    correctionModele:
      "1) Fonctionnalité de la visioconférence :\n" +
      "La visioconférence permet à des collaborateurs situés dans des lieux différents de se voir, se parler et travailler ensemble en temps réel. " +
      "Elle sert à organiser des réunions à distance, à partager des informations (documents, plans, maquettes) et à maintenir la coordination entre sites sans déplacement physique.\n\n" +
      "2) Intérêt des technologies numériques pour le travail collaboratif :\n" +
      "Chez Renault, Microsoft Teams permet à des équipes réparties sur trois continents de travailler simultanément sur les mêmes projets. " +
      "Les outils numériques font gagner du temps (validation des prototypes réduite de 30 %), améliorent la réactivité des équipes et permettent de coopérer malgré la distance géographique. " +
      "Ils réduisent aussi les coûts liés aux déplacements professionnels.",
    attendu: "Réponses claires, vocabulaire du chapitre, appui sur le support.",
  },
  {
    id: "sdgn7-e2",
    title: "Familles d'outils collaboratifs",
    type: "Exercice",
    difficulty: "Facile",
    xp: 130,
    minChars: 140,
    support:
      "De nombreuses entreprises ont adopté des suites d'outils numériques pour structurer leur travail quotidien. Slack et Microsoft Teams couvrent la messagerie instantanée et la visioconférence. Trello et Notion permettent de planifier les projets et de suivre les tâches. Google Drive et Dropbox assurent le stockage et le partage de fichiers dans le cloud. Google Docs, Microsoft 365 et Notion permettent de créer et co-rédiger des documents à plusieurs en simultané.",
    consigne: "Pour chaque famille d'outils collaboratifs, donne au moins un exemple tiré du support et explique en une phrase ce que cet outil permet de faire.",
    questions: [
      "Famille « communication » (messagerie, visioconférence) :",
      "Famille « organisation » (gestion de projet, agenda) :",
      "Famille « stockage » (cloud, serveur) :",
      "Famille « création » (suite bureautique en ligne, co-rédaction) :",
    ],
    correctionModele:
      "Famille « communication » :\n" +
      "Slack ou Microsoft Teams — ces outils permettent d'envoyer des messages instantanés, d'organiser des visioconférences et de partager des fichiers entre collaborateurs, même à distance.\n\n" +
      "Famille « organisation » :\n" +
      "Trello ou Notion — ces outils permettent de planifier les tâches d'un projet, d'attribuer des responsabilités et de suivre l'avancement en temps réel grâce à des tableaux partagés.\n\n" +
      "Famille « stockage » :\n" +
      "Google Drive ou Dropbox — ces solutions de stockage dans le cloud permettent de conserver des fichiers en ligne, d'y accéder depuis n'importe quel appareil et de les partager avec des collaborateurs autorisés.\n\n" +
      "Famille « création » :\n" +
      "Google Docs ou Microsoft 365 — ces suites bureautiques en ligne permettent à plusieurs personnes de rédiger, modifier et commenter un même document simultanément, sans s'envoyer de versions par e-mail.",
    attendu: "Exemples variés tirés du support et justification courte et précise par famille.",
  },
  {
    id: "sdgn7-e3",
    title: "Comprendre le travail collaboratif",
    type: "Exercice",
    difficulty: "Facile",
    xp: 140,
    minChars: 150,
    support:
      "« Chez Airbus, la conception de l'A320neo a mobilisé simultanément des équipes en France, en Allemagne, en Espagne et au Royaume-Uni. Grâce aux outils numériques collaboratifs, chaque équipe a travaillé sur une partie du projet tout en restant synchronisée avec les autres. Les méthodes de travail ont profondément évolué : la réunion physique hebdomadaire a cédé la place à des espaces de travail partagés accessibles 24h/24. L'objectif est de mutualiser les compétences pour obtenir un résultat commun plus rapidement. »",
    consigne: "Appuie-toi sur l'extrait et sur ton cours pour répondre aux deux questions.",
    questions: [
      "Explique avec tes propres mots comment les méthodes de travail ont évolué chez Airbus d'après le texte.",
      "Liste au moins trois avantages concrets de la mise en place d'outils collaboratifs numériques pour une organisation comme Airbus.",
    ],
    correctionModele:
      "1) Évolution des méthodes de travail :\n" +
      "D'après le texte, Airbus a remplacé les réunions physiques hebdomadaires par des espaces de travail partagés accessibles en permanence. " +
      "Les équipes, réparties dans quatre pays, ne doivent plus attendre de se retrouver au même endroit pour avancer : chacun travaille sur sa partie en restant connecté aux autres en temps réel. " +
      "Le travail collaboratif a donc remplacé le travail séquentiel traditionnel.\n\n" +
      "2) Avantages des outils collaboratifs numériques :\n" +
      "— Réduction des délais : les équipes travaillent simultanément, ce qui accélère la livraison du projet.\n" +
      "— Mutualisation des compétences : chaque équipe apporte son expertise, quelle que soit sa localisation.\n" +
      "— Disponibilité permanente : les espaces partagés sont accessibles 24h/24, sans contrainte géographique.\n" +
      "— Réduction des coûts de déplacement : moins de voyages inter-sites nécessaires.\n" +
      "— Meilleure coordination : tous les collaborateurs disposent de la même version des documents en temps réel.",
    attendu: "Compréhension du texte et argumentation structurée sur les avantages.",
  },
  {
    id: "sdgn7-e4",
    title: "E-communication et réseaux sociaux",
    type: "Exercice",
    difficulty: "Moyen",
    xp: 180,
    minChars: 180,
    support:
      "Air France utilise LinkedIn pour diffuser ses offres d'emploi et valoriser sa marque employeur auprès de 2 millions d'abonnés. Sur Instagram, la compagnie publie des contenus visuels destinés au grand public pour renforcer son image de marque. En interne, les équipes RH et communication échangent sur Microsoft Teams. Lors du recrutement, les candidats sont parfois évalués sur leur présence en ligne — un profil LinkedIn soigné est considéré comme un atout professionnel.",
    consigne: "Réponds de façon structurée en t'appuyant sur le support (un paragraphe par question).",
    questions: [
      "Explique en quoi les réseaux sociaux utilisés par Air France sont des outils d'e-communication.",
      "Distingue les réseaux sociaux personnels des réseaux sociaux professionnels : donne les caractéristiques de chacun et des exemples tirés du support ou du cours.",
      "Explique en quoi les réseaux sociaux sont aussi des outils de partage de l'information pour l'organisation.",
    ],
    correctionModele:
      "1) Les réseaux sociaux comme outils d'e-communication :\n" +
      "L'e-communication regroupe toutes les actions de communication menées sur Internet. Air France utilise LinkedIn et Instagram pour communiquer avec des publics ciblés (candidats, grand public). " +
      "Ces plateformes permettent de diffuser des messages, des images et des offres à grande échelle, de manière interactive : les abonnés peuvent réagir, partager ou commenter.\n\n" +
      "2) Réseaux sociaux personnels vs professionnels :\n" +
      "Les réseaux sociaux personnels (ex. : Instagram, Snapchat, TikTok) sont destinés à la vie privée et aux relations amicales ; le contenu y est généralement informel. " +
      "Les réseaux sociaux professionnels (ex. : LinkedIn) sont orientés vers le monde du travail : ils servent à présenter son parcours, à publier des offres d'emploi et à développer son réseau professionnel. " +
      "Air France utilise LinkedIn à des fins professionnelles (recrutement, marque employeur) et Instagram pour une communication plus grand public.\n\n" +
      "3) Les réseaux sociaux comme outils de partage de l'information :\n" +
      "Air France diffuse ses offres d'emploi sur LinkedIn, informant ainsi des milliers de candidats potentiels en un seul post. " +
      "En interne, Teams permet de partager des informations entre les équipes RH et communication. " +
      "Les réseaux sociaux accélèrent la circulation de l'information et permettent à l'organisation de toucher ses différentes parties prenantes.",
    attendu: "Distinction nette perso/pro, lien avec l'e-communication et le partage d'information.",
  },
  {
    id: "sdgn7-e5",
    title: "Communautés en ligne",
    type: "Exercice",
    difficulty: "Moyen",
    xp: 190,
    minChars: 160,
    support:
      "Salesforce, éditeur américain de logiciels, anime une communauté en ligne appelée « Trailblazer Community » qui rassemble plus de 17 millions de membres (développeurs, administrateurs, clients, partenaires). Les membres posent des questions, partagent des tutoriels et s'entraident pour résoudre des problèmes techniques. Les contributions les plus utiles sont mises en avant par un système de votes. Salesforce utilise les échanges de la communauté pour identifier les besoins des utilisateurs et améliorer ses produits.",
    consigne: "Réponds aux trois questions en t'appuyant sur le support et sur ton cours.",
    questions: [
      "Qu'est-ce qu'une communauté en ligne ? Donne la définition du cours, puis illustre-la avec l'exemple de Salesforce.",
      "Montre, à partir du support, comment les échanges au sein de la communauté produisent de l'information utile pour l'organisation.",
      "Explique en quoi une communauté en ligne peut être un avantage concurrentiel pour une entreprise comme Salesforce.",
    ],
    correctionModele:
      "1) Définition et illustration :\n" +
      "Une communauté en ligne rassemble des personnes autour d'un thème ou d'un projet commun ; les échanges y sont publics ou semi-publics. " +
      "La Trailblazer Community de Salesforce illustre cette définition : 17 millions de membres issus de profils variés (développeurs, clients, partenaires) se retrouvent sur une plateforme commune pour partager connaissances et solutions.\n\n" +
      "2) Production d'information utile :\n" +
      "Les membres posent des questions et partagent des tutoriels : chaque échange crée une base de connaissances accessible à tous. " +
      "Le système de votes met en avant les contributions les plus pertinentes, améliorant la qualité de l'information disponible. " +
      "Salesforce récupère ces données pour identifier les besoins réels de ses utilisateurs et orienter le développement de ses produits.\n\n" +
      "3) Avantage concurrentiel :\n" +
      "La communauté réduit les coûts de support client : les membres s'entraident, ce qui diminue le nombre de demandes adressées au service technique. " +
      "Elle fidélise les utilisateurs en créant un sentiment d'appartenance. " +
      "Enfin, elle constitue une source d'intelligence collective : les remontées terrain permettent à Salesforce d'innover plus rapidement que ses concurrents.",
    attendu: "Définition + lien communauté/information + argumentation sur la performance.",
  },
  {
    id: "sdgn7-e6",
    title: "Réseau informatique de l'organisation",
    type: "Exercice",
    difficulty: "Moyen",
    xp: 210,
    minChars: 180,
    support:
      "La chaîne hôtelière B&B Hotels gère 700 établissements en Europe. Chaque hôtel est connecté au réseau interne du groupe via un VPN sécurisé. Le service RH peut consulter les plannings de tous les hôtels, tandis que chaque directeur d'établissement n'accède qu'à son propre site. Un administrateur réseau basé au siège gère les droits d'accès et surveille les connexions suspectes. En 2023, une tentative d'intrusion a été bloquée en moins de 20 minutes grâce aux alertes automatiques.",
    consigne: "Réponds en t'appuyant sur le document.",
    questions: [
      "Identifie dans le texte ce qui correspond au support de stockage et de partage de l'information au sein du réseau de B&B Hotels (cite ou reformule précisément).",
      "Présente les avantages et les risques de la mise en place d'un réseau informatique pour B&B Hotels (deux parties clairement titrées, au moins deux éléments par partie).",
    ],
    correctionModele:
      "1) Support de stockage et de partage de l'information :\n" +
      "Dans le texte, le réseau interne du groupe connecté via un VPN sécurisé constitue le support de stockage et d'échange de données. " +
      "C'est ce réseau qui permet au service RH de consulter les plannings de tous les établissements depuis un point centralisé.\n\n" +
      "2) Avantages et risques :\n" +
      "AVANTAGES :\n" +
      "— Centralisation de l'information : le siège peut accéder aux données de 700 hôtels depuis un point unique.\n" +
      "— Gain de temps et de coordination : les plannings sont consultables en temps réel sans échanges de fichiers manuels.\n" +
      "— Sécurité renforcée : le VPN et les alertes automatiques permettent de détecter rapidement les intrusions (blocage en 20 minutes).\n\n" +
      "RISQUES :\n" +
      "— Risque de cyberattaque : une tentative d'intrusion a eu lieu en 2023, ce qui montre la vulnérabilité du réseau face à des attaquants externes.\n" +
      "— Dépendance au réseau : une panne ou une interruption peut bloquer l'accès aux données pour tous les établissements simultanément.\n" +
      "— Fuite de données sensibles si les droits d'accès sont mal configurés.",
    attendu: "Repérage dans le texte + avantages et risques clairement distingués et argumentés.",
  },
  {
    id: "sdgn7-e7",
    title: "Sécurisation, administrateur réseau et droits d'accès",
    type: "Exercice",
    difficulty: "Moyen",
    xp: 230,
    minChars: 200,
    support:
      "Le groupe pharmaceutique Sanofi emploie 100 000 personnes dans 60 pays. Son système d'information contient des données de recherche confidentielles, des informations RH et des données financières. Chaque salarié dispose d'un profil d'accès défini selon son métier : un chercheur accède aux bases de données scientifiques mais pas aux données de paie ; un responsable RH voit les dossiers du personnel mais pas les formules chimiques des médicaments. Un service dédié d'administrateurs réseau surveille en permanence les accès, détecte les comportements anormaux et met à jour les droits en cas de changement de poste.",
    consigne: "Réponds en trois développements structurés en t'appuyant sur le support.",
    questions: [
      "Précise le rôle du réseau informatique dans une organisation comme Sanofi.",
      "Identifie la fonction de l'administrateur réseau d'après le support et complète avec les éléments du cours.",
      "Explique pourquoi les droits d'accès au réseau sont restreints et différenciés selon les profils chez Sanofi.",
    ],
    correctionModele:
      "1) Rôle du réseau informatique :\n" +
      "Le réseau informatique de Sanofi relie l'ensemble des postes de travail des 100 000 salariés présents dans 60 pays. " +
      "Il permet de stocker, partager et accéder aux données de l'organisation (recherche, RH, finance), de communiquer à distance et de coordonner les activités entre sites.\n\n" +
      "2) Fonction de l'administrateur réseau :\n" +
      "D'après le support, l'administrateur réseau surveille les accès en permanence, détecte les comportements anormaux et met à jour les droits d'accès lors des changements de poste. " +
      "Plus généralement, son rôle est de garantir la disponibilité, l'intégrité et la sécurité du système d'information : il installe les équipements, gère les comptes utilisateurs et réagit en cas d'incident.\n\n" +
      "3) Pourquoi les droits sont restreints et différenciés :\n" +
      "Les données de Sanofi sont très sensibles (formules de médicaments, données personnelles, informations financières). " +
      "Si chaque salarié avait accès à tout, le risque de fuite, de modification non autorisée ou d'espionnage industriel serait élevé. " +
      "Les droits différenciés appliquent le principe du moindre privilège : chacun n'accède qu'aux informations nécessaires à son travail, ce qui réduit les risques internes et externes.",
    attendu: "Rôles et enjeux de sécurité bien articulés, appui sur le support.",
  },
  {
    id: "sdgn7-e8",
    title: "Internet, intranet et extranet",
    type: "Exercice",
    difficulty: "Difficile",
    xp: 260,
    minChars: 200,
    support:
      "Le groupe Carrefour opère sur trois niveaux de réseau. Son site carrefour.fr est accessible à tous les internautes dans le monde : c'est la vitrine publique du groupe. Le réseau interne du groupe, accessible uniquement depuis les postes des salariés, permet de consulter les procédures internes, les résultats de ventes et les plannings. Un espace sécurisé supplémentaire est réservé aux fournisseurs référencés : ils peuvent y consulter les commandes passées, les conditions logistiques et les factures validées, mais ne voient pas les données internes au groupe.",
    consigne: "Réponds aux deux questions en t'appuyant sur le support et sur les notions du cours.",
    questions: [
      "Identifie les trois types de réseaux présents dans le texte. Pour chacun, précise son nom technique (internet, intranet ou extranet), qui y a accès et quel est son rôle chez Carrefour.",
      "Compare les trois réseaux en expliquant ce qui les distingue fondamentalement : public cible, niveau de confidentialité et exemples d'usages.",
    ],
    correctionModele:
      "1) Identification des trois réseaux chez Carrefour :\n" +
      "— Internet : carrefour.fr, accessible à tous les internautes. Rôle : vitrine publique, communication avec les clients.\n" +
      "— Intranet : réseau interne accessible uniquement aux salariés depuis les postes de travail. Rôle : partage des procédures, résultats de ventes, plannings — informations strictement internes.\n" +
      "— Extranet : espace sécurisé réservé aux fournisseurs référencés. Rôle : partager des informations commerciales et logistiques avec des partenaires extérieurs autorisés, sans leur donner accès aux données internes du groupe.\n\n" +
      "2) Comparaison des trois réseaux :\n" +
      "PUBLIC CIBLE : Internet s'adresse à tout le monde (clients, grand public) ; l'intranet est exclusivement réservé aux salariés ; l'extranet est ouvert à des partenaires extérieurs sélectionnés.\n" +
      "NIVEAU DE CONFIDENTIALITÉ : Internet = données publiques ; intranet = données confidentielles internes ; extranet = données partagées de façon contrôlée avec des tiers de confiance.\n" +
      "EXEMPLES D'USAGES : Internet = site e-commerce, communication de marque ; intranet = consultation des procédures RH, partage de résultats ; extranet = transmission de commandes aux fournisseurs, suivi logistique.",
    attendu: "Distinction précise des trois réseaux, exemples cohérents, comparaison structurée.",
  },
  {
    id: "sdgn7-e9",
    title: "Le réseau social interne",
    type: "Exercice",
    difficulty: "Difficile",
    xp: 280,
    minChars: 220,
    support:
      "AXA, groupe d'assurance présent dans 51 pays, a déployé Viva Engage (anciennement Yammer) pour 150 000 collaborateurs. Cet outil de réseau social interne permet à chaque salarié de publier des actualités, de rejoindre des groupes thématiques (innovation, bien-être, métiers spécifiques) et d'interagir directement avec des collègues de n'importe quel pays, sans passer par la hiérarchie. Le groupe estime que cet outil a renforcé le sentiment d'appartenance et facilité le partage de bonnes pratiques entre filiales. L'accès est strictement réservé aux salariés disposant d'une adresse e-mail professionnelle AXA.",
    consigne: "Réponds aux trois questions en t'appuyant sur le support.",
    questions: [
      "Qu'est-ce qu'un réseau social interne ? Donne la définition, puis identifie dans le texte les éléments qui correspondent à cette définition.",
      "Montre, à partir du support, en quoi le réseau social interne d'AXA améliore la communication au sein de l'organisation.",
      "Explique pourquoi l'accès à cet outil est réservé aux seuls salariés AXA et quels risques cela évite.",
    ],
    correctionModele:
      "1) Définition et identification dans le texte :\n" +
      "Un réseau social interne est une plateforme numérique de communication réservée aux salariés d'une organisation, fonctionnant sur le modèle des réseaux sociaux grand public mais dans un cadre professionnel fermé. " +
      "Dans le texte : Viva Engage correspond à cette définition — il permet de publier des actualités, rejoindre des groupes et interagir avec des collègues, mais l'accès est limité aux salariés AXA.\n\n" +
      "2) Amélioration de la communication :\n" +
      "— Transversalité : les salariés de 51 pays peuvent communiquer directement sans passer par la hiérarchie, ce qui accélère les échanges.\n" +
      "— Partage de bonnes pratiques : les groupes thématiques permettent aux filiales de partager leurs expériences et d'éviter de « réinventer la roue ».\n" +
      "— Sentiment d'appartenance : le fait de pouvoir interagir avec des collègues du monde entier renforce la cohésion du groupe malgré la dispersion géographique.\n\n" +
      "3) Pourquoi l'accès est réservé aux salariés :\n" +
      "Un réseau social interne contient des informations sensibles sur l'organisation (projets en cours, résultats, pratiques internes). " +
      "Ouvrir l'accès à des personnes extérieures (concurrents, clients, anciens salariés) risquerait de provoquer des fuites d'informations confidentielles. " +
      "Restreindre l'accès aux adresses e-mail professionnelles garantit que seules les personnes habilitées participent aux échanges.",
    attendu: "Définition précise, lien avec la performance, argumentation sur la sécurité et la confidentialité.",
  },
  {
    id: "sdgn7-e10",
    title: "Intelligence collective et intelligence artificielle",
    type: "Exercice",
    difficulty: "Tres difficile",
    xp: 360,
    minChars: 280,
    support:
      "Dans le cadre de son programme d'innovation ouverte, le groupe SNCF a mis en place une plateforme collaborative permettant à ses 150 000 salariés de soumettre des idées d'amélioration. En 2023, plus de 12 000 suggestions ont été déposées ; les équipes ont retenu et testé 340 d'entre elles. En parallèle, la SNCF utilise des algorithmes d'intelligence artificielle pour analyser les données de trafic en temps réel, prédire les retards et optimiser les rotations de matériel roulant. Une enquête interne révèle que 78 % des salariés estiment que les outils numériques proposés par leur employeur influencent leur satisfaction au travail. La direction considère que l'IA et la contribution collective ne s'opposent pas : l'IA traite les données massives, tandis que les salariés apportent leur expertise terrain.",
    consigne:
      "Réponds aux quatre questions dans l'ordre, en citant des éléments précis du support.",
    questions: [
      "Explique ce qu'est l'intelligence collective et montre, en t'appuyant sur le support, comment la SNCF la met en œuvre.",
      "Précise le rôle de l'intelligence artificielle chez la SNCF en donnant deux exemples concrets tirés du texte.",
      "Cite la phrase du support qui illustre le lien entre outils numériques et satisfaction des salariés, puis explique ce qu'elle signifie.",
      "Explique pourquoi l'intelligence artificielle et l'intelligence collective sont présentées comme complémentaires dans le support. Donne ton point de vue argumenté.",
    ],
    correctionModele:
      "1) Intelligence collective à la SNCF :\n" +
      "L'intelligence collective naît des interactions entre individus qui mettent en commun leurs idées et compétences pour produire un résultat supérieur à ce que chacun aurait obtenu seul. " +
      "La SNCF la met en œuvre via sa plateforme collaborative : 12 000 idées soumises par 150 000 salariés, dont 340 testées. " +
      "Chaque salarié contribue avec son expérience terrain, créant une base d'innovations que la direction seule n'aurait pas pu générer.\n\n" +
      "2) Rôle de l'intelligence artificielle :\n" +
      "L'IA à la SNCF est utilisée pour analyser les données de trafic en temps réel et prédire les retards, ainsi que pour optimiser les rotations du matériel roulant. " +
      "Ces tâches impliquent le traitement de volumes massifs de données impossibles à analyser manuellement — l'IA y apporte rapidité et précision.\n\n" +
      "3) Outils numériques et satisfaction :\n" +
      "Phrase citée : « 78 % des salariés estiment que les outils numériques proposés par leur employeur influencent leur satisfaction au travail. » " +
      "Cette phrase signifie que la qualité des outils mis à disposition par l'employeur est un facteur de bien-être professionnel : de bons outils rendent le travail plus efficace, moins frustrant et plus valorisant.\n\n" +
      "4) IA et intelligence collective — complémentarité :\n" +
      "Dans le support, la SNCF considère que les deux ne s'opposent pas : l'IA traite les données massives (tâche quantitative) tandis que les salariés apportent leur expertise terrain (tâche qualitative et créative). " +
      "L'IA libère les salariés des tâches répétitives, ce qui leur laisse davantage de temps pour contribuer à l'intelligence collective. " +
      "On peut argumenter que cette complémentarité est bénéfique, à condition que l'IA reste un outil au service des humains et non un substitut à leur jugement.",
    attendu: "Synthèse maîtrisée du support, définitions précises, point de vue argumenté.",
  },
  {
    id: "sdgn7-cas1",
    title: "Étude de cas : Decathlon",
    type: "Etude de cas",
    difficulty: "Tres difficile",
    xp: 560,
    minChars: 580,
    support:
      "Decathlon, enseigne mondiale de sport présente dans 60 pays, a déployé un écosystème numérique complet pour coordonner ses 100 000 collaborateurs. Les équipes utilisent Microsoft Teams pour les réunions à distance et la messagerie instantanée, Trello pour le suivi des projets de lancement produit, et SharePoint pour le stockage et le partage des documents entre les magasins, la logistique et le siège. Chaque collaborateur dispose d'un profil d'accès défini par son métier : un responsable de rayon accède aux données de ventes de son magasin, mais pas aux bilans financiers consolidés du groupe — ces informations sont réservées au contrôle de gestion. Un administrateur réseau central gère ces droits et audite régulièrement les accès. Decathlon anime également une communauté interne baptisée « Sporting Ideas » où les employés de terrain peuvent soumettre des suggestions d'amélioration, qui sont ensuite évaluées par les équipes produit. La direction estime que cette approche permet de mieux capter l'intelligence collective des équipes en contact direct avec les clients.",
    consigne:
      "Lis le support attentivement, puis rédige une réponse structurée en nommant les notions du chapitre que tu mobilises.",
    questions: [
      "Quels éléments du texte montrent que des personnes travaillant sur plusieurs sites collaborent ensemble ? Identifie et nomme au moins quatre outils ou pratiques.",
      "Montre que les échanges ne se déroulent pas tous de la même façon : distingue les échanges synchrones (en temps réel) des échanges asynchrones (en différé) à partir du support.",
      "Pourquoi tous les collaborateurs de Decathlon n'ont-ils pas accès aux mêmes informations ? Explique le principe des droits d'accès et son enjeu pour l'organisation.",
      "Comment la plateforme « Sporting Ideas » favorise-t-elle l'intelligence collective au sein de Decathlon ?",
      "Synthèse (10 à 15 lignes) : les outils numériques suffisent-ils à eux seuls à rendre une organisation plus performante ? Argumente en t'appuyant sur l'exemple Decathlon.",
    ],
    correctionModele:
      "1) Outils et pratiques de collaboration multi-sites :\n" +
      "— Microsoft Teams : réunions à distance et messagerie instantanée entre sites.\n" +
      "— Trello : suivi partagé des projets de lancement produit entre équipes distantes.\n" +
      "— SharePoint : stockage et partage de documents entre magasins, logistique et siège.\n" +
      "— Communauté « Sporting Ideas » : espace collaboratif permettant aux employés de terrain de contribuer aux décisions produit.\n\n" +
      "2) Échanges synchrones et asynchrones :\n" +
      "Échanges synchrones (en temps réel) : les réunions sur Microsoft Teams, où tous les participants sont connectés simultanément.\n" +
      "Échanges asynchrones (en différé) : la messagerie instantanée Teams, le suivi de tâches sur Trello et le dépôt de suggestions sur « Sporting Ideas » — chacun contribue à son propre rythme, sans nécessiter la présence simultanée de tous.\n\n" +
      "3) Droits d'accès et enjeux :\n" +
      "Le principe des droits d'accès consiste à définir, pour chaque utilisateur, les données et fonctions auxquelles il peut accéder en fonction de son rôle. " +
      "Chez Decathlon, un responsable de rayon n'accède qu'aux données de son magasin, tandis que les bilans financiers consolidés sont réservés au contrôle de gestion. " +
      "Cela protège la confidentialité des données sensibles, réduit les risques d'erreur ou de malveillance interne, et garantit que chacun travaille dans un périmètre maîtrisé.\n\n" +
      "4) Intelligence collective via « Sporting Ideas » :\n" +
      "La plateforme « Sporting Ideas » permet à des milliers d'employés de terrain — qui connaissent les attentes des clients au quotidien — de partager leurs idées avec les équipes produit au siège. " +
      "En agrégeant des suggestions venant de partout, Decathlon accède à une forme d'intelligence collective : le groupe sait plus que chaque individu pris séparément. " +
      "Cela permet d'innover de façon plus pertinente et inclusive.\n\n" +
      "5) Synthèse — le numérique suffit-il seul ?\n" +
      "Les outils numériques sont indispensables : sans Teams, Trello ou SharePoint, la coordination de 100 000 collaborateurs dans 60 pays serait impossible. " +
      "Mais ils ne suffisent pas à eux seuls. Il faut aussi une culture de la collaboration (accepter de partager l'information), une gouvernance claire (droits d'accès, rôle de l'administrateur), " +
      "une formation des utilisateurs et une animation des outils (comme « Sporting Ideas »). " +
      "L'outil numérique est un levier de performance, mais c'est l'organisation qui le met en œuvre qui détermine son efficacité réelle.",
    attendu: "Mobilisation complète du chapitre 7, appui sur le texte, argumentation structurée et nuancée.",
  },
  {
    id: "sdgn7-cas2",
    title: "Étude de cas : L'Oréal",
    type: "Etude de cas",
    difficulty: "Tres difficile",
    xp: 620,
    minChars: 620,
    support:
      "L'Oréal, premier groupe cosmétique mondial, coordonne ses activités avec ses partenaires externes (agences de communication, distributeurs, fournisseurs d'ingrédients) via un extranet sécurisé. Sur cet espace dédié, les agences déposent les maquettes de campagnes, les distributeurs consultent les calendriers de lancement et les fournisseurs transmettent leurs bons de livraison — sans jamais avoir accès aux données internes du groupe. En parallèle, les équipes communication du groupe animent des communautés en ligne sur Instagram, YouTube et TikTok pour dialoguer avec 250 millions d'abonnés dans le monde. L'Oréal utilise également une solution d'intelligence artificielle pour analyser les conversations sur les réseaux sociaux en temps réel, détecter les tendances beauté émergentes et personnaliser les recommandations produits sur son site e-commerce. Cette transformation numérique s'accompagne d'un cadre exigeant : charte de l'usage des données, rôles précis des administrateurs, et audits de sécurité deux fois par an. La direction numérique reconnaît que l'IA accélère certaines tâches d'analyse, mais que la créativité humaine reste indispensable pour concevoir des campagnes qui résonnent avec les clients.",
    consigne:
      "Rédige une réponse structurée de type bac. Identifie les trois grands thèmes du texte (communication publique, collaboration avec les partenaires, automatisation et IA) et mobilise les notions du cours.",
    questions: [
      "Qu'est-ce qui relève, dans le texte, de la communication avec le grand public par le numérique ? Identifie les outils et expliquez leur rôle.",
      "Pourquoi l'espace réservé aux partenaires fonctionne-t-il différemment d'un site internet classique ? Quelle notion du cours cela illustre-t-il ?",
      "Comment L'Oréal encadre-t-il qui peut voir quoi dans son système d'information ? Quel est l'enjeu pour l'organisation ?",
      "En quoi l'intelligence artificielle soulage-t-elle certaines tâches chez L'Oréal ? Quelles limites ou risques faut-il mentionner ?",
      "Synthèse (12 à 18 lignes) : confier une partie du travail à des systèmes automatiques suffit-il à assurer une performance durable ? Appuie-toi sur l'exemple L'Oréal et sur ton cours.",
    ],
    correctionModele:
      "1) Communication avec le grand public :\n" +
      "L'Oréal anime des communautés en ligne sur Instagram, YouTube et TikTok, touchant 250 millions d'abonnés. " +
      "Ces plateformes sont des outils d'e-communication : elles permettent au groupe de diffuser ses messages, de dialoguer avec ses clients et de construire sa notoriété à l'échelle mondiale. " +
      "Ce sont des réseaux sociaux à destination du grand public, accessibles à tous.\n\n" +
      "2) L'extranet vs le site internet classique :\n" +
      "Un site internet classique est accessible à tous les internautes (internet = réseau public). L'espace réservé aux partenaires de L'Oréal est un extranet : il n'est accessible qu'aux partenaires autorisés (agences, distributeurs, fournisseurs). " +
      "Chacun y accède selon ses droits : une agence voit les briefs créatifs, un fournisseur consulte ses bons de livraison, mais aucun n'accède aux données internes du groupe. " +
      "Cela illustre la notion d'extranet : prolongement de l'intranet vers des partenaires extérieurs de confiance.\n\n" +
      "3) Gestion des droits d'accès et enjeux :\n" +
      "L'Oréal encadre les accès via une charte d'usage des données, des rôles précis pour les administrateurs réseau et des audits de sécurité biannuels. " +
      "Les droits d'accès définissent ce que chaque acteur peut consulter, modifier ou déposer, selon son rôle. " +
      "L'enjeu est double : protéger la confidentialité des données stratégiques (formules, plans de lancement) et garantir la conformité réglementaire (protection des données personnelles).\n\n" +
      "4) Intelligence artificielle — apports et limites :\n" +
      "L'IA analyse les conversations sur les réseaux sociaux en temps réel, détecte les tendances beauté et personnalise les recommandations produits. " +
      "Elle libère les équipes des tâches d'analyse répétitives et accélère la prise de décision. " +
      "Limites et risques : la direction reconnaît que la créativité humaine reste indispensable pour concevoir des campagnes efficaces. " +
      "De plus, une dépendance excessive à l'IA peut exposer l'organisation à des risques algorithmiques (biais, erreurs d'interprétation) ou à des problèmes éthiques liés à la collecte de données.\n\n" +
      "5) Synthèse — automatisation et performance durable :\n" +
      "L'automatisation apporte des gains réels : analyse plus rapide, personnalisation à grande échelle, réduction des tâches à faible valeur ajoutée. " +
      "Mais elle ne suffit pas à garantir une performance durable. Chez L'Oréal, l'IA analyse les tendances, mais c'est l'équipe créative humaine qui conçoit les campagnes. " +
      "Par ailleurs, la performance durable repose aussi sur la sécurité du SI (audits, charte), sur la qualité de la gouvernance (droits d'accès, rôles définis) et sur la confiance des partenaires. " +
      "L'automatisation est un outil puissant, mais c'est l'organisation qui en fait un usage intelligent et responsable qui détermine si elle contribue réellement à la performance.",
    attendu: "Démonstration complète avec esprit critique, mobilisation des notions du chapitre, exemples précis et nuances.",
  },
];
