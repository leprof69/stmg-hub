# -*- coding: utf-8 -*-
"""Chapitre 15 - RGPD, CNIL, données personnelles, blockchain, cybersécurité."""

CHAPTER = 15

EXERCISES = [
    {
        "id": "e1",
        "title": "RGPD et principes fondateurs",
        "support": (
            "DataSecure, PME sophipoise de cybersécurité (CA 8 M€, 62 salariés), traite les logs "
            "et données clients de 340 PME. Le registre des traitements recense 28 activités "
            "(SOC, sauvegarde, analyse incidents). Chaque traitement a une base légale documentée : "
            "contrat, intérêt légitime, consentement. Le DPO interne valide les finalités avant "
            "tout nouveau module SaaS. En 2024, un client a refusé un traitement « profilage marketing » "
            "sans base légale claire - DataSecure a retiré la fonction. Le RGPD (applicable depuis "
            "mai 2018 dans l'UE) impose licéité, loyauté, transparence, limitation des finalités, "
            "minimisation, exactitude, limitation conservation, intégrité/confidentialité, responsabilité."
        ),
        "consigne": (
            "Explique comment DataSecure applique les principes fondateurs du RGPD. "
            "Illustre avec le registre et le cas profilage."
        ),
        "questions": [
            "Cite quatre principes fondateurs du RGPD et explique-les brièvement.",
            "Comment le registre des traitements aide-t-il à la conformité ?",
            "Pourquoi DataSecure a-t-elle retiré le module profilage marketing ?",
        ],
        "correctionModele": (
            "1) Principes (exemples) :\n"
            "- Licéité : base légale par traitement.\n"
            "- Limitation finalités : pas de détournement.\n"
            "- Minimisation : données strictement nécessaires.\n"
            "- Responsabilité : DPO, registre, preuves.\n\n"
            "2) Registre :\n"
            "Documente finalités, bases, durées - démonstration de conformité.\n\n"
            "3) Profilage retiré :\n"
            "Absence de base légale claire = risque sanction CNIL et perte confiance client."
        ),
        "attendu": "Principes RGPD cités, registre, cas profilage.",
    },
    {
        "id": "e2",
        "title": "Rôle de la CNIL et sanctions",
        "support": (
            "En mars 2024, la CNIL contrôle DataSecure suite à une plainte d'un ancien client. "
            "Recommandations : réduire la conservation des logs de 36 à 12 mois, améliorer le "
            "délai de réponse aux demandes d'accès (passé de 45 à 22 jours en 90 jours), compléter "
            "la notice information. Pas d'amende mais mise en demeure 90 jours. Le DPO rappelle "
            "que les sanctions peuvent atteindre 20 M€ ou 4 % du CA mondial. Google et d'autres "
            "géants ont été sanctionnés. La formation restreinte CNIL peut : rappel à l'ordre, "
            "mise en conformité sous astreinte, limitation traitement, amende."
        ),
        "consigne": (
            "Analyse le contrôle CNIL de DataSecure. "
            "Présente les pouvoirs de la CNIL et les enjeux pour une PME."
        ),
        "questions": [
            "Quel rôle la CNIL joue-t-elle en France dans le RGPD ?",
            "Quelles recommandations le contrôle a-t-il formulées ?",
            "Pourquoi la conformité est-elle stratégique même sans amende initiale ?",
        ],
        "correctionModele": (
            "1) CNIL :\n"
            "Autorité de contrôle française ; veille au respect du RGPD ; pouvoirs d'investigation et sanction.\n\n"
            "2) Recommandations :\n"
            "Durée conservation, délais droits personnes, notices information.\n\n"
            "3) Enjeu PME :\n"
            "Réputation, contrats clients exigeants, risque amende future si non-conformité persistante."
        ),
        "attendu": "CNIL définie, contrôle analysé, enjeux PME.",
    },
    {
        "id": "e3",
        "title": "Droits des personnes (accès, effacement, portabilité)",
        "support": (
            "DataSecure déploie un portail self-service : demande d'accès, rectification, effacement, "
            "portabilité sous 30 jours (objectif 22 après contrôle CNIL). En 2025, 124 demandes "
            "dont 18 effacements (clients résiliés). Un cas complexe : un salarié d'un client demande "
            "l'effacement de logs de connexion nécessaires à une enquête incident en cours - "
            "DataSecure refuse avec justification (obligation légale de conservation temporaire, "
            "article 17 RGPD exceptions). Le DPO documente chaque réponse. Les droits renforcés "
            "exigent des procédures claires et traçables."
        ),
        "consigne": (
            "Explique les droits des personnes et l'arbitrage DataSecure sur le cas effacement/logs."
        ),
        "questions": [
            "Quels droits des personnes le cours et le RGPD prévoient-ils ?",
            "Comment DataSecure organise-t-elle les délais et la traçabilité ?",
            "Justifie le refus d'effacement pendant l'enquête incident.",
        ],
        "correctionModele": (
            "1) Droits :\n"
            "Accès, rectification, effacement, limitation, portabilité, opposition.\n\n"
            "2) Organisation :\n"
            "Portail, DPO, délais 30 jours, documentation.\n\n"
            "3) Refus effacement :\n"
            "Exception : nécessité pour constatation, exercice ou défense de droits en justice / "
            "obligation légale temporaire - logs indispensable à l'incident."
        ),
        "attendu": "Droits listés, procédure DataSecure, exception art. 17.",
    },
    {
        "id": "e4",
        "title": "Cybersécurité et protection des données",
        "support": (
            "DataSecure chiffre les données au repos (AES-256) et en transit (TLS 1.3), impose MFA "
            "à tous les collaborateurs et clients admin, réalise des pentests annuels et un SOC "
            "24/7. Le RSSI cite l'ANSSI : formation, mises à jour, sauvegardes externes, mots de passe "
            "longs et uniques. Les données stratégiques (« information indispensable à la pérennité ») "
            "incluent clés de chiffrement, codes clients, journaux d'incidents. Un déficit de sécurité "
            "entraîne perte de clients, amendes CNIL et prime d'assurance cyber plus élevée."
        ),
        "consigne": (
            "Lie cybersécurité et protection des données stratégiques chez DataSecure. "
            "Mobilise ANSSI et données stratégiques."
        ),
        "questions": [
            "Qu'est-ce qu'une donnée stratégique selon le cours ?",
            "Quelles mesures techniques DataSecure déploie-t-elle ?",
            "Quelles conséquences d'un déficit de sécurité ?",
        ],
        "correctionModele": (
            "1) Donnée stratégique :\n"
            "Information indispensable à la pérennité de l'organisation.\n\n"
            "2) Mesures :\n"
            "Chiffrement, MFA, pentests, SOC, recommandations ANSSI.\n\n"
            "3) Conséquences :\n"
            "Perte clients, amendes, assurance, image - particulièrement grave pour une société de cyber."
        ),
        "attendu": "Données stratégiques, mesures sécurité, conséquences.",
    },
    {
        "id": "e5",
        "title": "Violation de données et notification",
        "support": (
            "Incident 2023 : erreur configuration S3, 1 200 e-mails clients exposés 6 heures. "
            "DataSecure détecte via monitoring, corrige en 4 h, notifie la CNIL sous 72 h et informe "
            "les clients concernés (contenu : nature violation, mesures prises, contact DPO). "
            "Registre des violations mis à jour. Pas d'amende CNIL grâce à réactivité et historique "
            "conforme. Le cours impose notification CNIL sous 72 h si risque pour les droits. "
            "Le PRA (plan de reprise) est testé trimestriellement depuis l'incident."
        ),
        "consigne": (
            "Analyse la gestion de la violation de données 2023. "
            "Chronologie, obligations RGPD, leçons."
        ),
        "questions": [
            "Qu'est-ce qu'une violation de données au sens RGPD ?",
            "Reconstitue la chronologie de réponse DataSecure.",
            "Quelles obligations de notification et quels critères de succès ?",
        ],
        "correctionModele": (
            "1) Violation :\n"
            "Brèche entraînant destruction, perte, altération ou divulgation non autorisée de données personnelles.\n\n"
            "2) Chronologie :\n"
            "Exposition 6 h ? détection ? correction 4 h ? notification CNIL 72 h ? clients informés.\n\n"
            "3) Obligations :\n"
            "Notification CNIL si risque ; information personnes si risque élevé ; PRA renforcé."
        ),
        "attendu": "Violation définie, chronologie, obligations notification.",
    },
    {
        "id": "e6",
        "title": "Blockchain et traçabilité des accès",
        "support": (
            "DataSecure teste un POC blockchain pour horodater les logs d'accès aux données clients : "
            "chaîne immuable, vérification par les clients. Avantages annoncés : traçabilité, transparence. "
            "Limites : consommation énergétique, RGPD (droit à l'effacement vs immutabilité), "
            "scalabilité. Le cours présente la blockchain comme stockage/transmission fiable et "
            "sécurisé ; applications : transferts d'actifs, traçabilité produits, smart contracts. "
            "Le DPO exige une DPIA avant production."
        ),
        "consigne": (
            "Évalue le POC blockchain de DataSecure pour les logs d'accès. "
            "Opportunités et limites (RGPD, technique)."
        ),
        "questions": [
            "Définis la blockchain et cite deux usages du cours.",
            "Quels avantages pour l'audit trail des accès ?",
            "Quelles limites RGPD et techniques au POC ?",
        ],
        "correctionModele": (
            "1) Blockchain :\n"
            "Registre distribué, horodaté, cryptographique ; usages : actifs, traçabilité, contrats auto.\n\n"
            "2) Avantages logs :\n"
            "Preuve d'intégrité, vérification client, anti-falsification.\n\n"
            "3) Limites :\n"
            "Effacement RGPD vs immutabilité ; coût ; DPIA obligatoire."
        ),
        "attendu": "Blockchain définie, POC évalué, tension RGPD.",
    },
    {
        "id": "e7",
        "title": "Privacy by design et minimisation",
        "support": (
            "Nouveau module SaaS DataSecure « ShieldAnalytics » : anonymisation par défaut des IP, "
            "agrégation des statistiques, paramètres vie privée granulaires (opt-in pour toute "
            "donnée identifiante). Les développeurs appliquent privacy by design dès la conception. "
            "Minimisation : seuls 4 champs obligatoires à l'inscription client. Tests d'intrusion "
            "avant mise en production. Le RGPD exige que les systèmes garantissent la protection "
            "des données par défaut (privacy by design) et ne collectent que le nécessaire."
        ),
        "consigne": (
            "Explique privacy by design et minimisation dans ShieldAnalytics."
        ),
        "questions": [
            "Qu'est-ce que le privacy by design ?",
            "Comment ShieldAnalytics applique-t-il la minimisation ?",
            "Pourquoi tester avant production ?",
        ],
        "correctionModele": (
            "1) Privacy by design :\n"
            "Intégrer la protection des données dès la conception du produit/service.\n\n"
            "2) Minimisation ShieldAnalytics :\n"
            "Anonymisation défaut, 4 champs obligatoires, opt-in données identifiantes.\n\n"
            "3) Tests :\n"
            "Réduire vulnérabilités avant exposition des données clients - responsabilité proactive."
        ),
        "attendu": "Privacy by design et minimisation appliqués.",
    },
    {
        "id": "e8",
        "title": "Sous-traitants RGPD (AWS, hébergeur)",
        "support": (
            "DataSecure héberge sur AWS eu-west-3 (Paris). Contrats incluent clauses RGPD art. 28 : "
            "instructions documentées, sous-traitants ultérieurs, aide conformité, suppression en fin "
            "de contrat, audits. Audit triennal des sous-traitants : AWS conforme, hébergeur backup "
            "allemand obtenu certification ISO 27001. Un client exige le registre des sous-traitants "
            "et refuse tout transfert hors UE sans garanties (CCT). Responsable de traitement = client "
            "PME ; DataSecure = sous-traitant pour les logs qu'elle traite pour eux."
        ),
        "consigne": (
            "Clarifie les rôles responsable/sous-traitant et les clauses art. 28 chez DataSecure."
        ),
        "questions": [
            "Différence responsable de traitement et sous-traitant ?",
            "Quelles obligations des clauses art. 28 dans le support ?",
            "Pourquoi le client exige-t-il registre et garanties hors UE ?",
        ],
        "correctionModele": (
            "1) Rôles :\n"
            "- Responsable : détermine finalités (client PME).\n"
            "- Sous-traitant : traite pour le compte de DataSecure/client (DataSecure pour logs).\n\n"
            "2) Clauses art. 28 :\n"
            "Instructions, audits, suppression, aide droits personnes.\n\n"
            "3) Transferts hors UE :\n"
            "RGPD chapitre V - CCT ou décision adéquation requises."
        ),
        "attendu": "Rôles RGPD, clauses sous-traitance, transferts.",
    },
    {
        "id": "e9",
        "title": "Sensibilisation et culture sécurité",
        "support": (
            "DataSecure simule du phishing mensuel : taux de clic 4 % vs 18 % avant programme "
            "formation (12 mois). Modules : RGPD 2 h, cyber 3 h, quiz obligatoire. Les collaborateurs "
            "signalent les e-mails suspects via bouton dédié. Un clic sur faux lien déclenche "
            "formation immédiate renforcée, pas sanction la première fois. L'ANSSI recommande la "
            "formation régulière. Pour une société de cyber, l'image exige l'exemplarité interne."
        ),
        "consigne": (
            "Évalue le programme de sensibilisation. "
            "Relie formation, phishing et culture sécurité."
        ),
        "questions": [
            "Pourquoi la sensibilisation est-elle un maillon de la cybersécurité ?",
            "Interprète l'évolution du taux de clic phishing.",
            "Quelle approche pédagogique (formation vs sanction) ?",
        ],
        "correctionModele": (
            "1) Sensibilisation :\n"
            "Les humains sont souvent le maillon faible (phishing, mots de passe).\n\n"
            "2) Taux 18 % ? 4 % :\n"
            "Programme efficace ; preuve ROI formation.\n\n"
            "3) Pédagogie :\n"
            "Formation renforcée plutôt que sanction immédiate - culture apprentissage."
        ),
        "attendu": "Sensibilisation justifiée, KPI phishing, pédagogie.",
    },
    {
        "id": "e10",
        "title": "Synthèse : IA, DPIA et responsabilité numérique",
        "support": (
            "DataSecure lance « ShieldAI » : analyse automatique des logs pour détecter anomalies. "
            "Risques : profilage, décision automatisée, biais. Le DPO exige une DPIA (analyse d'impact "
            "sur la protection des données) avant commercialisation. Le module IA doit rester "
            "assistif (alerte humaine valide). Transparence algorithmes : notice client. "
            "Le cours lie responsabilité numérique, RGPD et transparence des traitements. "
            "Concurrence : un client a quitté un fournisseur sanctionné 40 M€ par la CNIL."
        ),
        "consigne": (
            "Synthèse : conditions de mise en conformité de ShieldAI (DPIA, RGPD, éthique, transparence)."
        ),
        "questions": [
            "Qu'est-ce qu'une DPIA et quand est-elle requise ?",
            "Quels risques ShieldAI pour les personnes ?",
            "Quelles garanties imposer avant commercialisation ?",
            "En quoi la responsabilité numérique dépasse le RGPD ?",
        ],
        "correctionModele": (
            "1) DPIA :\n"
            "Analyse d'impact si traitement à risque (profilage, données sensibles, IA à grande échelle).\n\n"
            "2) Risques :\n"
            "Profilage, fausses alertes, biais, décisions sans intervention humaine.\n\n"
            "3) Garanties :\n"
            "DPIA validée, humain dans la boucle, notice, minimisation, registre mis à jour.\n\n"
            "4) Responsabilité numérique :\n"
            "Éthique, transparence, confiance - au-delà de la simple conformité légale."
        ),
        "attendu": "DPIA, risques IA, garanties, responsabilité numérique.",
        "minChars": 260,
    },
    {
        "id": "cas1",
        "title": "Étude de cas : Contrôle CNIL et mise en conformité",
        "support": (
            "Contrôle CNIL 2025 approfondi : conservation excessive logs (36 mois), DPIA absente "
            "pour ShieldAI, délai accès parfois > 30 jours, mentions information incomplètes sur "
            "module legacy. Mise en demeure 90 jours, risque amende 4 % CA (320 k€ max théorique). "
            "Le CODIR nomme un plan : DPO pilote, RSSI technique, juriste externe. Budget 120 k€. "
            "Clients enterprise menacent résiliation si non-conformité. Communication clients prévue J+30."
        ),
        "consigne": (
            "Élabore un plan de mise en conformité RGPD 90 jours : écarts, actions, gouvernance, communication."
        ),
        "questions": [
            "Liste les écarts et leur gravité.",
            "Plan d'actions priorisé (90 jours).",
            "Gouvernance DPO/RSSI/CODIR.",
            "Communication clients transparente.",
            "Mesures anti-récidive.",
        ],
        "correctionModele": (
            "1) Écarts :\n"
            "Conservation, DPIA IA, délais droits, notices - gravité élevée sur DPIA et délais.\n\n"
            "2) Plan 90 j :\n"
            "M1 conservation+notices ; M2 DPIA ShieldAI ; M3 portail droits ; M3 audit complet.\n\n"
            "3) Gouvernance :\n"
            "Comité hebdo DPO+RSSI, reporting CODIR.\n\n"
            "4) Communication :\n"
            "Courrier clients : faits, plan, calendrier - pas de minimisation.\n\n"
            "5) Anti-récidive :\n"
            "Audit annuel, revue registre à chaque release."
        ),
        "attendu": "Plan conformité 90 j structuré, communication clients.",
        "minChars": 400,
    },
    {
        "id": "cas2",
        "title": "Étude de cas : Ransomware et crise RGPD-cyber",
        "support": (
            "Ransomware chiffre serveurs production et backup partiel : fuite possible de 50 000 "
            "dossiers clients PME (e-mails, logs, configs). Groupe criminel réclame 200 BTC. "
            "DataSecure isole le réseau, active PRA, notifie CNIL à H+48. Question : payer ou non ? "
            "Le PDG refuse la rançon (position ANSSI). Restauration backup 7 jours, service dégradé. "
            "Clients exigent transparence. MFA déployé urgence, SOC renforcé. Communication presse "
            "spécialisée cyber. Un client intente action responsabilité civile."
        ),
        "consigne": (
            "Gère la crise ransomware : chronologie, obligations RGPD/CNIL, PRA, communication, leçons."
        ),
        "questions": [
            "Chronologie idéale de réponse (H+0 à J+30).",
            "Obligations CNIL et information des personnes concernées.",
            "Faut-il payer la rançon ? Argumente.",
            "Plan PRA et renforcement sécurité post-crise.",
            "Leçons conformité et responsabilité numérique.",
        ],
        "correctionModele": (
            "1) Chronologie :\n"
            "H+0 isolement ? H+4 PRA ? H+72 CNIL ? J+7 restauration ? J+30 bilan.\n\n"
            "2) Obligations :\n"
            "Notification CNIL 72 h ; informer personnes si risque élevé ; documenter violation.\n\n"
            "3) Rançon :\n"
            "Ne pas payer (ANSSI) : finance criminalité, pas de garantie déchiffrement.\n\n"
            "4) PRA :\n"
            "Backup hors ligne, tests trimestriels, MFA, segmentation réseau.\n\n"
            "5) Leçons :\n"
            "Cyber et RGPD indissociables ; transparence ; DPIA et sous-traitants revus."
        ),
        "attendu": "Crise ransomware maîtrisée, RGPD et PRA intégrés.",
        "minChars": 450,
    },
]
