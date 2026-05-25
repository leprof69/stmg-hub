# -*- coding: utf-8 -*-
"""Chapitre 11 - Transformations numériques, conduite du changement."""

CHAPTER = 11

EXERCISES = [
    {
        "id": "e1",
        "title": "Parcours client phygital et comportement RO PO",
        "support": (
            "BanqueNord, banque régionale lilloise (CA 95 M€, 650 salariés), observe que 68 % des opérations "
            "courantes passent désormais par son application mobile. Les clients comparent d'abord les taux "
            "et les avis en ligne, visitent parfois une agence pour signer un prêt immobilier, puis suivent "
            "leur dossier sur l'app. Le directeur marketing note un phénomène RO PO (Research Online, "
            "Purchase Offline) : 54 % des demandes de crédit consommation démarrent sur le site, mais 71 % "
            "se concluent en agence. Les étapes de recherche d'information et d'évaluation post-achat sont "
            "devenues multicanales. Le NPS digital est de 41, celui de l'agence de 28. Les conseillers "
            "estiment que le parcours client ne se limite plus à un achat ponctuel mais à une relation "
            "de plusieurs années (compte, épargne, assurance emprunteur)."
        ),
        "consigne": (
            "À partir du support, explique le parcours client digitalisé de BanqueNord. "
            "Mobilise les notions de parcours client, multicanalité et RO PO."
        ),
        "questions": [
            "Quelle différence le cours établit-il entre processus d'achat et parcours client ?",
            "Identifie dans le support les étapes du parcours impactées par le numérique.",
            "En quoi le comportement RO PO modifie-t-il l'organisation des agences BanqueNord ?",
        ],
        "correctionModele": (
            "1) Parcours client vs processus d'achat :\n"
            "Le processus d'achat recouvre les 5 étapes menant à un achat ponctuel. Le parcours client est "
            "plus large : il intègre toutes les interactions sur la durée de la relation (compte, crédit, SAV).\n\n"
            "2) Étapes impactées :\n"
            "- Recherche et évaluation : site, avis, comparateurs en ligne.\n"
            "- Décision d'achat : souvent en agence pour les crédits complexes.\n"
            "- Post-achat : suivi dossier sur l'app, NPS différencié digital/agence.\n\n"
            "3) RO PO et agences :\n"
            "Les agences ne disparaissent pas : elles deviennent des lieux de conclusion et de conseil à "
            "forte valeur ajoutée, pendant que le digital capte les opérations routinières (68 %)."
        ),
        "attendu": "Distinction parcours/achat, RO PO illustré, conséquences pour le réseau.",
    },
    {
        "id": "e2",
        "title": "Traces numériques et vue client à 360°",
        "support": (
            "BanqueNord collecte des traces numériques : parcours sur l'app, clics, requêtes, historique "
            "des connexions, coordonnées mises à jour, évaluations après appel. Ces données sont stockées "
            "dans trois silos : core banking, CRM marketing et centre d'appels. Un projet « client 360 » "
            "vise à créer un référentiel client unique agrégeant transactions, e-mails, appels et enquêtes. "
            "Le DPO rappelle que la finalité de chaque traitement doit être documentée (RGPD). Après "
            "fusion, le taux de complétude du profil passe de 62 % à 89 %. Les conseillers peuvent "
            "anticiper une demande de renégociation de prêt six mois avant l'échéance grâce à l'analyse "
            "comportementale. Le comité digital estime que l'enjeu n'est plus la collecte mais "
            "l'exploitation optimale des données (approche customer-centric)."
        ),
        "consigne": (
            "Explique le passage des traces numériques à la connaissance client. "
            "Mobilise traces numériques, référentiel client unique et approche customer-centric."
        ),
        "questions": [
            "Définis les traces numériques et cite trois exemples du support.",
            "Qu'est-ce qu'une vue client à 360° et pourquoi BanqueNord en a-t-elle besoin ?",
            "Quel lien avec l'approche customer-centric du cours ?",
        ],
        "correctionModele": (
            "1) Traces numériques :\n"
            "Informations enregistrées par un dispositif numérique sur l'activité ou l'identité des "
            "utilisateurs (cookies, logs, interactions). Exemples : parcours app, clics, historique "
            "connexions, évaluations post-appel.\n\n"
            "2) Vue 360° :\n"
            "Agrégation exploitable de toutes les informations sur un client (transactions, CRM, appels, "
            "enquêtes). BanqueNord sort des silos pour personnaliser le conseil et anticiper les besoins.\n\n"
            "3) Customer-centric :\n"
            "L'organisation centre sa stratégie sur le client : mieux connaître pour mieux servir, "
            "au-delà de la seule collecte de données."
        ),
        "attendu": "Définitions précises, silos vs référentiel unique, finalité managériale.",
    },
    {
        "id": "e3",
        "title": "Social listening et tendances de consommation",
        "support": (
            "L'équipe communication de BanqueNord déploie une plateforme de social listening sur "
            "X, LinkedIn, forums Budget et groupes Facebook régionaux. En mars 2025, l'outil détecte "
            "une hausse de 34 % des mentions « banque responsable » et des critiques sur les frais "
            "bancaires cachés. Une tendance émergente - non visible dans les études classiques - "
            "concerne les jeunes actifs demandant des offres « banque sans agence mais avec conseiller "
            "humain à la demande ». BanqueNord ajuste son discours : transparence tarifaire sur le site "
            "et option « conseiller vidéo » en 48 h. Le directeur marketing affirme que le social "
            "listening complète la veille commerciale traditionnelle par une écoute en temps réel "
            "des conversations en ligne."
        ),
        "consigne": (
            "Analyse la stratégie de social listening de BanqueNord. "
            "Distingue-la de la veille marketing classique."
        ),
        "questions": [
            "Définis le social listening selon le cours.",
            "Quels signaux faibles BanqueNord a-t-elle détectés grâce à cet outil ?",
            "Quelles décisions marketing concrètes en découlent dans le support ?",
        ],
        "correctionModele": (
            "1) Social listening :\n"
            "Veille automatisée sur les réseaux sociaux pour comprendre le comportement des "
            "consommateurs à travers leurs prises de parole en ligne et détecter des tendances "
            "non révélées par les études classiques.\n\n"
            "2) Signaux faibles :\n"
            "Hausse des mentions « banque responsable », critique des frais cachés, demande "
            "d'un modèle hybride sans agence mais avec conseiller humain accessible.\n\n"
            "3) Décisions :\n"
            "Transparence tarifaire en ligne, offre conseiller vidéo sous 48 h - adaptation "
            "proactive de l'offre et de la communication."
        ),
        "attendu": "Définition social listening, signaux repérés, lien décisionnel.",
    },
    {
        "id": "e4",
        "title": "CRM et omnicanalité de la relation client",
        "support": (
            "BanqueNord déploie un CRM unifié après migration du core banking vers le cloud. "
            "Les équipes commerciales, marketing et service client partagent les mêmes fiches : "
            "historique des contacts, produits détenus, préférences canal (app, téléphone, agence). "
            "Un client peut commencer une demande d'assurance sur le chatbot, la poursuivre par "
            "téléphone avec le même numéro de dossier, et finaliser en visio avec un conseiller. "
            "Les robots conversationnels traitent 22 % des demandes simples (solde, RIB, opposition). "
            "Le directeur relation client parle d'omnicanalité : interaction 24h/24, cohérence du "
            "message quel que soit le canal. Le taux de résolution au premier contact passe de 61 % "
            "à 78 % en six mois."
        ),
        "consigne": (
            "Explique le rôle du CRM dans l'optimisation de la relation client chez BanqueNord. "
            "Mobilise CRM, omnicanalité et nouveaux canaux numériques."
        ),
        "questions": [
            "Qu'est-ce qu'un CRM et quelle fonction remplit-il ici ?",
            "En quoi le parcours décrit illustre-t-il l'omnicanalité ?",
            "Cite deux avantages et une limite des robots conversationnels pour une banque.",
        ],
        "correctionModele": (
            "1) CRM :\n"
            "Système d'information centralisant données clients/prospects partagées entre équipes "
            "pour développer et optimiser la relation client.\n\n"
            "2) Omnicanalité :\n"
            "Même dossier du chatbot au téléphone puis à la visio : continuité de l'expérience, "
            "pas de ressaisie, cohérence du conseil sur tous les canaux.\n\n"
            "3) Robots :\n"
            "Avantages : disponibilité 24h/24, libération des conseillers pour cas complexes. "
            "Limite : demandes à forte valeur émotionnelle ou réglementaire mal adaptées au seul bot."
        ),
        "attendu": "CRM défini, parcours omnicanal analysé, balance avantages/limites.",
    },
    {
        "id": "e5",
        "title": "Administration électronique et relation usager",
        "support": (
            "BanqueNord collabore avec la préfecture du Nord pour proposer la dématérialisation "
            "de certaines démarches : ouverture de compte avec vérification d'identité en ligne "
            "(France Identité), signature électronique des dossiers de prêt, partage sécurisé "
            "de pièces justificatives. L'administration électronique vise à rendre les services "
            "publics plus accessibles et à améliorer le fonctionnement interne des administrations. "
            "Pour BanqueNord, l'enjeu est double : réduire les délais (dossier prêt passé de "
            "21 à 12 jours) et améliorer la satisfaction usager-client. 18 000 dossiers ont été "
            "traités via le guichet numérique en 2024. Le partenariat impose un registre des "
            "traitements de données partagé et des audits de sécurité communs."
        ),
        "consigne": (
            "Explique l'apport de l'administration électronique à la relation client/usager "
            "dans le partenariat BanqueNord-préfecture."
        ),
        "questions": [
            "Définis l'administration électronique selon le cours.",
            "Quels bénéfices concrets le support attribue-t-il aux usagers et à BanqueNord ?",
            "Pourquoi le partenariat renforce-t-il les exigences de protection des données ?",
        ],
        "correctionModele": (
            "1) Administration électronique :\n"
            "Usage des TIC par les administrations pour rendre les services publics plus accessibles "
            "et améliorer leur fonctionnement interne.\n\n"
            "2) Bénéfices :\n"
            "- Usagers/clients : démarches simplifiées, délais réduits (21 ? 12 jours).\n"
            "- BanqueNord : volume traité (18 000 dossiers), satisfaction accrue, image innovante.\n\n"
            "3) Données :\n"
            "Échange de données entre acteurs public et privé : registre des traitements et audits "
            "pour garantir conformité RGPD et confiance."
        ),
        "attendu": "Définition admin. électronique, bénéfices chiffrés, enjeu données.",
    },
    {
        "id": "e6",
        "title": "Conduite du changement (modèle de Kotter)",
        "support": (
            "Le PDG de BanqueNord lance un plan de transformation digitale sur 24 mois. "
            "Étape 1 : coalition de 12 managers « ambassadeurs digital ». Étape 2 : vision "
            "« Banque de proximité augmentée par le numérique ». Étape 3 : quick wins - "
            "signature électronique généralisée en 90 jours. Étape 4 : communication interne "
            "hebdomadaire (newsletter, webinaires). Étape 5 : formation de 400 h par conseiller. "
            "Étape 6 : célébration des succès (NPS app +8 points). Étape 7 : ancrage culturel "
            "via intégration des compétences digitales dans les entretiens annuels. Le comité "
            "de pilotage suit un tableau de bord Kotter : 7 étapes sur 8 validées à M+18."
        ),
        "consigne": (
            "Analyse le plan de conduite du changement de BanqueNord en mobilisant "
            "les étapes du modèle de Kotter visibles dans le support."
        ),
        "questions": [
            "Pourquoi la conduite du changement est-elle indispensable dans une transformation numérique ?",
            "Repère et nomme au moins cinq étapes de Kotter illustrées dans le support.",
            "Quel rôle jouent les « quick wins » dans ce type de projet ?",
        ],
        "correctionModele": (
            "1) Nécessité :\n"
            "La transformation numérique modifie organisations, métiers et culture ; sans "
            "accompagnement, les résistances bloquent l'adoption des outils.\n\n"
            "2) Étapes Kotter repérées :\n"
            "- Coalition (12 ambassadeurs).\n"
            "- Vision partagée.\n"
            "- Quick wins (signature électronique 90 jours).\n"
            "- Communication interne.\n"
            "- Formation massive.\n"
            "- Ancrage culturel (entretiens annuels).\n\n"
            "3) Quick wins :\n"
            "Résultats visibles rapidement pour crédibiliser le projet et réduire le scepticisme "
            "(35 % de sceptiques en interne)."
        ),
        "attendu": "Kotter appliqué étape par étape, justification des quick wins.",
    },
    {
        "id": "e7",
        "title": "Résistances au changement digital",
        "support": (
            "Une enquête interne BanqueNord révèle que 35 % des conseillers sont sceptiques "
            "face à la fermeture programmée de 12 agences. Les craintes exprimées : obsolescence "
            "du métier, perte du lien humain avec les clients ruraux, charge de formation "
            "supplémentaire sans reconnaissance salariale. Le syndicat FO alerte sur le risque "
            "de PSE. La direction oppose des reconversions internes (objectif 85 % des postes "
            "concernés vers le conseil à distance) et un plan de formation certifiante. "
            "Trois agences pilotes testent le modèle « hub conseil » : un conseiller physique "
            "couple avec un expert digital en visio pour les clients peu à l'aise avec l'app."
        ),
        "consigne": (
            "Identifie les résistances au changement et propose des leviers d'accompagnement "
            "cohérents avec le support."
        ),
        "questions": [
            "Qu'est-ce qu'une résistance au changement ? Distingue peurs rationnelles et symboliques.",
            "Quelles résistances sont visibles chez les conseillers BanqueNord ?",
            "Évalue la pertinence des réponses de la direction (reconversion, hub conseil).",
        ],
        "correctionModele": (
            "1) Résistance :\n"
            "Frein psychologique ou organisationnel face à une modification des pratiques. "
            "Peurs rationnelles (emploi, salaire) et symboliques (perte du métier relationnel).\n\n"
            "2) Résistances repérées :\n"
            "Obsolescence, isolement clients ruraux, surcharge formation, méfiance syndicale (PSE).\n\n"
            "3) Leviers direction :\n"
            "Reconversion 85 % limite le choc social ; hub conseil associe humain et digital ; "
            "formation certifiante renforce les compétences. Manque possible : reconnaissance "
            "salariale explicite pour lever le frein financier."
        ),
        "attendu": "Résistances typées, leviers évalués avec nuance.",
    },
    {
        "id": "e8",
        "title": "Transformation du système d'information bancaire",
        "support": (
            "BanqueNord migre son core banking vers une infrastructure cloud européenne. "
            "Budget SI : 14 M€ sur trois ans. Le DSI structure un comité de gouvernance SI "
            "(CODIR + métiers + DSI) qui priorise le backlog : sécurité, parcours crédit, "
            "reporting réglementaire. Les incidents de production chutent de 47 à 12 par trimestre. "
            "En revanche, la dette technique sur l'ancien module épargne retarde l'intégration CRM. "
            "Le RSSI impose MFA, chiffrement et pentests annuels. Le CSE est consulté sur les "
            "impacts organisationnels des nouveaux outils de suivi d'activité des conseillers "
            "(indicateurs de connexion et de traitement des dossiers)."
        ),
        "consigne": (
            "Analyse la transformation SI de BanqueNord : gouvernance, risques et lien avec "
            "la conduite du changement."
        ),
        "questions": [
            "Quel rôle joue la gouvernance SI décrite dans le support ?",
            "Distingue succès et difficulté du projet de migration.",
            "Pourquoi le CSE doit-il être associé à cette transformation ?",
        ],
        "correctionModele": (
            "1) Gouvernance SI :\n"
            "Comité CODIR+DSI+métiers pour prioriser les investissements selon la stratégie "
            "digitale et les contraintes réglementaires.\n\n"
            "2) Bilan :\n"
            "Succès : incidents divisés par ~4, cloud opérationnel, sécurité renforcée. "
            "Difficulté : dette technique épargne retarde le CRM unifié.\n\n"
            "3) CSE :\n"
            "Les outils de suivi d'activité modifient les conditions de travail : consultation "
            "obligatoire, dialogue social dans la conduite du changement."
        ),
        "attendu": "Gouvernance SI, bilan équilibré, dimension sociale.",
    },
    {
        "id": "e9",
        "title": "Agilité organisationnelle et time-to-market",
        "support": (
            "La direction digitale de BanqueNord organise six squads produit (Scrum, releases "
            "bimensuelles de l'app). Chaque squad réunit développeurs, UX, expert métier banque "
            "et testeur. Le time-to-market d'une nouvelle fonctionnalité « virement instantané » "
            "est passé de 9 à 3 mois. Les agences critiquent toutefois le manque de concertation "
            "en amont : la fonctionnalité a été lancée sans FAQ ni formation terrain. Un sprint "
            "de « co-construction » avec des conseillers est instauré pour les prochaines releases. "
            "Le CODIR mesure l'agilité via vélocité des squads et taux d'adoption à 90 jours."
        ),
        "consigne": (
            "Explique l'agilité organisationnelle déployée et analyse la tension avec le réseau d'agences."
        ),
        "questions": [
            "Qu'est-ce que l'agilité organisationnelle dans ce contexte ?",
            "Quels indicateurs montrent son efficacité et ses limites ?",
            "Pourquoi la co-construction avec les conseillers est-elle nécessaire ?",
        ],
        "correctionModele": (
            "1) Agilité :\n"
            "Organisation en squads autonomes, méthode Scrum, releases fréquentes pour "
            "accélérer l'innovation digitale.\n\n"
            "2) Indicateurs :\n"
            "Efficacité : time-to-market 9 ? 3 mois, releases bimensuelles. "
            "Limite : lancement sans accompagnement terrain, adoption ralentie.\n\n"
            "3) Co-construction :\n"
            "Relier innovation SI et conduite du changement : les utilisateurs internes "
            "(conseillers) sont parties prenantes de la réussite de l'outil."
        ),
        "attendu": "Agilité définie, KPI interprétés, lien avec accompagnement.",
    },
    {
        "id": "e10",
        "title": "Synthèse : transformation numérique et conduite du changement",
        "support": (
            "Bilan M+24 BanqueNord : 68 % opérations digitales, 12 agences fermées, NPS app 41, "
            "coût par agence ?22 %, 85 % reconversions internes réussies, 35 % sceptiques initiaux "
            "passés à 18 %. Prochaine vague : IA générative pour pré-qualifier les demandes de "
            "crédit. Le comité éthique s'inquiète du biais algorithmique et du RGPD. Le PDG "
            "résume : « La technologie n'est rien sans la confiance des conseillers et des clients ». "
            "Le projet IA nécessite une nouvelle coalition, une charte éthique et un plan de "
            "montée en compétences sur le conseil à valeur ajoutée."
        ),
        "consigne": (
            "Rédige une synthèse structurée reliant transformation numérique, SI, relation client "
            "et conduite du changement. Prépare la vague IA."
        ),
        "questions": [
            "Résume en un tableau les résultats de la transformation (4 indicateurs minimum).",
            "Quels acquis de conduite du changement réutiliser pour le projet IA ?",
            "Quels risques nouveaux le support associe-t-il à l'IA et comment les traiter ?",
        ],
        "correctionModele": (
            "1) Tableau synthétique (exemple) :\n"
            "| Indicateur | Résultat |\n"
            "| Opérations digitales | 68 % |\n"
            "| Coût/agence | ?22 % |\n"
            "| Reconversions | 85 % |\n"
            "| Sceptiques | 35 % ? 18 % |\n\n"
            "2) Acquis réutilisables :\n"
            "Coalition, formation, quick wins, communication interne, ancrage culturel.\n\n"
            "3) Risques IA :\n"
            "Biais algorithmique, RGPD ? charte éthique, DPIA, complémentarité IA-conseiller "
            "humain (pas de remplacement pur)."
        ),
        "attendu": "Synthèse chiffrée, continuité Kotter, risques IA identifiés.",
        "minChars": 260,
    },
    {
        "id": "cas1",
        "title": "Étude de cas : Fermeture d'agences et conduite du changement",
        "support": (
            "BanqueNord annonce la fermeture de 12 agences rurales du Nord-Pas-de-Calais d'ici "
            "18 mois : 45 postes concernés, 8 200 clients réorientés vers l'app et un centre de "
            "conseil à distance basé à Lille. La presse régionale titre sur une « banque qui "
            "abandonne les territoires ». L'usage de l'app mobile progresse de +25 % sur les "
            "communes touchées grâce à des ateliers numériques en mairie. Le CSE a obtenu "
            "l'absence de PSE grâce à un plan de reconversion : 38 postes basculent vers le "
            "conseil téléphonique/vidéo, 7 vers d'autres agences. Le maire de Cambrai menace "
            "un boycott. La direction prépare un communiqué, un fonds de transition locale "
            "et des indicateurs : taux de migration digitale, NPS, taux de reconversion."
        ),
        "consigne": (
            "Rédige une réponse type bac : plan de conduite du changement pour la fermeture "
            "des agences. Mobilise vision, résistances, communication interne/externe et indicateurs."
        ),
        "questions": [
            "Diagnostique les parties prenantes et leurs intérêts divergents.",
            "Propose un plan de conduite du changement en cinq actions prioritaires.",
            "Définis trois indicateurs de succès à 18 mois.",
            "Quels risques réputationnels et comment les limiter ?",
            "Synthèse (12-15 lignes) : la fermeture peut-elle être légitime ?",
        ],
        "correctionModele": (
            "1) Parties prenantes :\n"
            "- Direction : réduction coûts, digitalisation.\n"
            "- Conseillers : sécurité emploi, sens du métier.\n"
            "- Clients ruraux : proximité, autonomie numérique.\n"
            "- Élus/citoyens : aménagement du territoire.\n"
            "- CSE : éviter PSE.\n\n"
            "2) Plan (exemple) :\n"
            "Vision « proximité augmentée » ; ateliers numériques mairies ; reconversion 85 % ; "
            "hub conseil vidéo ; communication transparente avec élus ; fonds transition locale.\n\n"
            "3) Indicateurs :\n"
            "Taux migration app, NPS clients touchés, taux reconversion interne.\n\n"
            "4) Risques réputation :\n"
            "Boycott, presse ? dialogue élus, preuves d'accompagnement, pas de fermeture « silencieuse ».\n\n"
            "5) Synthèse :\n"
            "Légitime si accompagnement social et territorial réel ; sinon risque de rupture de confiance."
        ),
        "attendu": "Cas structuré type bac, plan Kotter/communication, synthèse argumentée.",
        "minChars": 400,
    },
    {
        "id": "cas2",
        "title": "Étude de cas : IA, conseillers et éthique",
        "support": (
            "BanqueNord teste un chatbot IA (GPT fine-tuné) qui traite 40 % des demandes simples "
            "et pré-qualifie les dossiers de crédit consommation. Les conseillers craignent "
            "40 % de suppressions de postes d'ici trois ans. Le syndicat dépose un signalement "
            "auprès de l'inspection du travail sur la charge de travail résiduelle (dossiers "
            "complexes concentrés sur moins de monde). Le comité éthique interne exige une "
            "charte : pas de décision automatique de refus, explicabilité des scores, droit "
            "à l'entretien humain. Le DPO lance une DPIA. Un client conteste un refus de crédit "
            "« algorithmique » sur les réseaux sociaux (12 000 partages). Le PDG doit présenter "
            "un plan 24 mois au CODIR et au CSE."
        ),
        "consigne": (
            "Élabore un plan 24 mois intégrant SI/IA, conduite du changement, éthique et RGPD. "
            "L'IA doit assister, pas remplacer les conseillers."
        ),
        "questions": [
            "Analyse les impacts sur l'emploi et la qualité du travail des conseillers.",
            "Quelles mesures éthiques et RGPD imposer avant généralisation ?",
            "Propose un plan de formation et de communication interne.",
            "Comment répondre à la contestation client sur les réseaux sociaux ?",
            "Synthèse (15 lignes) : conditions de réussite de l'IA chez BanqueNord.",
        ],
        "correctionModele": (
            "1) Impacts emploi :\n"
            "Peur de suppression ; concentration des dossiers complexes ; risque burn-out. "
            "Réponse : reclassement vers conseil à haute valeur (patrimoine, immobilier), "
            "pas de licenciements liés directement au bot.\n\n"
            "2) Éthique/RGPD :\n"
            "Charte IA, DPIA, pas de refus automatique, explicabilité, droit entretien humain, "
            "registre traitements mis à jour.\n\n"
            "3) Formation/com :\n"
            "Montée en compétences conseil complexe ; transparence sur les tâches confiées à l'IA ; "
            "co-construction avec conseillers.\n\n"
            "4) Crise réseaux sociaux :\n"
            "Réponse rapide, explication du processus, proposition de réexamen humain du dossier.\n\n"
            "5) Synthèse :\n"
            "Réussite si IA = productivité + meilleur service, avec gouvernance éthique, "
            "dialogue social et conformité RGPD."
        ),
        "attendu": "Plan 24 mois complet, IA assistive, éthique et communication de crise.",
        "minChars": 450,
    },
]
