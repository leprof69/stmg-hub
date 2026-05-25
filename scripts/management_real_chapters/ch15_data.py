# -*- coding: utf-8 -*-
"""Management chapitre 15 — acteurs reels, un concept par exercice."""

D = "\u2014 "


def I(sid, title, **body):
    return {"sid": sid, "title": title, "body": body}


CH15 = [
    I(
        "e1",
        "RGPD principes fondateurs chez Orange Cyberdefense",
        support=(
            "Orange Cyberdefense tient \u00e0 jour un registre de 34 traitements (SOC, logs clients, "
            "formation phishing). DPO d\u00e9sign\u00e9 : M\u00e9lanie R.\n"
            "Exemple traitement \u00ab Monitoring SI client \u00bb :\n"
            "\u2014 finalit\u00e9 : d\u00e9tecter intrusions ;\n"
            "\u2014 base l\u00e9gale : ex\u00e9cution contrat ;\n"
            "\u2014 dur\u00e9e conservation logs : 12 mois ;\n"
            "\u2014 minimisation : pas de donn\u00e9es RH clients.\n"
            "Audit interne 2025 : 100 % des traitements document\u00e9s (contre 76 % en 2023)."
        ),
        consigne=(
            "Rappelle les principes fondateurs du RGPD et montre comment Orange Cyberdefense les applique."
        ),
        questions=[
            "Cite quatre principes fondateurs du RGPD.",
            "Comment le registre des traitements illustre ces principes ?",
            "Quel progr\u00e8s chiffr\u00e9 en 2025 ?",
        ],
        correction=(
            "1) Principes RGPD :\n"
            "Lic\u00e9it\u00e9, loyaut\u00e9, transparence ; limitation des finalit\u00e9s ; minimisation ; "
            "exactitude ; limitation conservation ; int\u00e9grit\u00e9/confidentialit\u00e9 ; responsabilit\u00e9.\n\n"
            "2) Registre Orange Cyberdefense :\n"
            f"{D}Finalit\u00e9, base l\u00e9gale, dur\u00e9e 12 mois, minimisation (pas de RH clients).\n\n"
            "3) Progr\u00e8s :\n"
            f"{D}100 % traitements document\u00e9s (76 % en 2023)."
        ),
        attendu="Quatre principes, application registre, chiffre 2025.",
        notions=["RGPD", "principes fondateurs", "registre des traitements"],
    ),
    I(
        "e2",
        "CNIL et sanctions chez Microsoft France",
        support=(
            "En mars 2024, la CNIL contr\u00f4le Microsoft France sur le suivi publicitaire du compte Microsoft "
            "(cr\u00e9ation compte Windows sans consentement cookies clair).\n"
            "Mise en demeure 90 jours : recueillir consentement explicite, simplifier refus, "
            "documenter finalit\u00e9s publicitaires.\n"
            "Microsoft corrige en juin 2024. Pas d'amende (premi\u00e8re infraction, coop\u00e9ration). "
            "Rappel : amende max RGPD = 4 % CA mondial ou 20 M\u20ac."
        ),
        consigne=(
            "Pr\u00e9sente le r\u00f4le de la CNIL et analyse le contr\u00f4le Microsoft France."
        ),
        questions=[
            "Quel est le r\u00f4le de la CNIL ?",
            "Quelle infraction est vis\u00e9e dans le support ?",
            "Pourquoi Microsoft \u00e9vite-t-elle une amende ici ?",
        ],
        correction=(
            "1) R\u00f4le CNIL :\n"
            "Autorit\u00e9 fran\u00e7aise de protection des donn\u00e9es : contr\u00f4le, sanctions, "
            "accompagnement conformit\u00e9 RGPD.\n\n"
            "2) Infraction :\n"
            f"{D}Consentement cookies publicitaires insuffisant \u00e0 la cr\u00e9ation compte Windows.\n\n"
            "3) Pas d'amende :\n"
            f"{D}Premi\u00e8re infraction, mise en demeure respect\u00e9e sous 90 jours, coop\u00e9ration."
        ),
        attendu="R\u00f4le CNIL, infraction identifi\u00e9e, explication absence amende.",
        notions=["CNIL", "sanctions", "mise en demeure"],
    ),
    I(
        "e3",
        "Droits des personnes chez Google France",
        support=(
            "Google France traite en 2024 via son formulaire \u00ab Mes donn\u00e9es Google \u00bb :\n"
            "\u2014 128 000 demandes d'acc\u00e8s ;\n"
            "\u2014 42 000 rectifications ;\n"
            "\u2014 18 500 effacements (\u00ab droit \u00e0 l'oubli \u00bb recherche) ;\n"
            "\u2014 9 200 portabilit\u00e9s (export Takeout).\n"
            "D\u00e9lai moyen de r\u00e9ponse : 28 jours (objectif RGPD : 1 mois). "
            "Taux refus motiv\u00e9s : 12 % (donn\u00e9es l\u00e9galement conserv\u00e9es)."
        ),
        consigne=(
            "Cite les droits des personnes au RGPD et illustre avec Google France."
        ),
        questions=[
            "Quels droits des personnes le RGPD garantit-il ?",
            "Quels volumes Google traite-t-il pour chaque droit cit\u00e9 ?",
            "Peut-on refuser une demande ? Dans quel cas selon le support ?",
        ],
        correction=(
            "1) Droits personnes :\n"
            "Acc\u00e8s, rectification, effacement, limitation, portabilit\u00e9, opposition, "
            "retrait consentement, directives post-mortem.\n\n"
            "2) Volumes Google :\n"
            f"{D}Acc\u00e8s 128 000 ; rectification 42 000 ; effacement 18 500 ; portabilit\u00e9 9 200.\n\n"
            "3) Refus :\n"
            f"{D}Oui si motiv\u00e9 (12 % refus) : donn\u00e9es l\u00e9galement conserv\u00e9es."
        ),
        attendu="Droits list\u00e9s, volumes Google, refus motiv\u00e9.",
        notions=["droits des personnes", "acc\u00e8s", "effacement", "portabilit\u00e9"],
    ),
    I(
        "e4",
        "Cybers\u00e9curit\u00e9 chez Doctolib",
        support=(
            "Doctolib h\u00e9berge rendez-vous m\u00e9dicaux (donn\u00e9es de sant\u00e9 sensibles). "
            "Mesures 2025 :\n"
            "\u2014 chiffrement AES-256 au repos et TLS 1.3 en transit ;\n"
            "\u2014 MFA obligatoire pour 100 % des comptes pro ;\n"
            "\u2014 pentest externe semestriel ;\n"
            "\u2014 certification HDS (h\u00e9bergeur donn\u00e9es de sant\u00e9).\n"
            "Incidents tentatives intrusion bloqu\u00e9es : 1 240 en 2024 (0 fuite confirm\u00e9e)."
        ),
        consigne=(
            "Explique le lien cybers\u00e9curit\u00e9 / protection des donn\u00e9es et pr\u00e9sente Doctolib."
        ),
        questions=[
            "Pourquoi cybers\u00e9curit\u00e9 et RGPD sont-ils li\u00e9s ?",
            "Quelles mesures techniques Doctolib d\u00e9ploie-t-elle ?",
            "Que signifie la certification HDS ?",
        ],
        correction=(
            "1) Lien cybers\u00e9curit\u00e9/RGPD :\n"
            "Le principe d'int\u00e9grit\u00e9 et confidentialit\u00e9 exige de prot\u00e9ger les donn\u00e9es "
            "contre acc\u00e8s non autoris\u00e9s (article 32 RGPD).\n\n"
            "2) Mesures Doctolib :\n"
            f"{D}Chiffrement, MFA 100 %, pentests, HDS.\n\n"
            "3) HDS :\n"
            f"{D}Certification h\u00e9bergement donn\u00e9es de sant\u00e9 en France, exigence l\u00e9gale renforc\u00e9e."
        ),
        attendu="Lien RGPD/cyber, mesures Doctolib, HDS expliqu\u00e9.",
        notions=["cybers\u00e9curit\u00e9", "MFA", "donn\u00e9es de sant\u00e9"],
    ),
    I(
        "e5",
        "Violation de donn\u00e9es chez La Quadrature du Net",
        support=(
            "Octobre 2024 : faille sur le serveur mailing La Quadrature du Net : "
            "12 400 adresses e-mail et noms de militants expos\u00e9s 36 h avant correction.\n"
            "Proc\u00e9dure activ\u00e9e :\n"
            "\u2014 H+4 : containment et patch ;\n"
            "\u2014 H+18 : notification CNIL (d\u00e9lai 72 h RGPD) ;\n"
            "\u2014 H+24 : e-mail aux personnes concern\u00e9es avec mesures (changement MDP, vigilance phishing).\n"
            "Gravit\u00e9 \u00e9valu\u00e9e : risque mod\u00e9r\u00e9 (pas de mots de passe ni donn\u00e9es sensibles)."
        ),
        consigne=(
            "D\u00e9finis une violation de donn\u00e9es et analyse la r\u00e9ponse La Quadrature du Net."
        ),
        questions=[
            "Qu'est-ce qu'une violation de donn\u00e9es (data breach) ?",
            "Quelles \u00e9tapes de notification le support d\u00e9crit-il ?",
            "Dans quel d\u00e9lai la CNIL doit-elle \u00eatre inform\u00e9e ?",
        ],
        correction=(
            "1) Violation de donn\u00e9es :\n"
            "Atteinte \u00e0 la s\u00e9curit\u00e9 entra\u00eenant destruction, perte, alt\u00e9ration "
            "ou divulgation non autoris\u00e9e de donn\u00e9es personnelles.\n\n"
            "2) \u00c9tapes :\n"
            f"{D}Containment H+4 ; notification CNIL H+18 ; information personnes H+24.\n\n"
            "3) D\u00e9lai CNIL :\n"
            f"{D}72 heures maximum apr\u00e8s prise de connaissance (article 33 RGPD)."
        ),
        attendu="D\u00e9finition violation, \u00e9tapes notification, d\u00e9lai 72 h.",
        notions=["violation de donn\u00e9es", "notification CNIL", "72 heures"],
    ),
    I(
        "e6",
        "Blockchain logs chez CNIL",
        support=(
            "La CNIL teste en 2025 un POC blockchain pour journaliser les acc\u00e8s "
            "\u00e0 une base de donn\u00e9es de plaintes (2 400 dossiers/an).\n"
            "Chaque acc\u00e8s agent cr\u00e9e un hash horodat\u00e9 immuable (qui, quand, quelle fiche). "
            "Objectif : prouver l'int\u00e9grit\u00e9 des logs en cas de contr\u00f4le ou litige.\n"
            "Limite identifi\u00e9e : blockchain \u2260 anonymisation ; RGPD exige minimisation en amont.\n"
            "R\u00e9sultat pilote : temps audit acc\u00e8s \u221260 %."
        ),
        consigne=(
            "Explique l'int\u00e9r\u00eat et les limites RGPD de la blockchain pour les logs."
        ),
        questions=[
            "Quel probl\u00e8me la journalisation blockchain r\u00e9sout-elle ?",
            "Comment fonctionne le POC CNIL ?",
            "Quelle limite RGPD rappeler ?",
        ],
        correction=(
            "1) Probl\u00e8me r\u00e9solu :\n"
            "Tra\u00e7abilit\u00e9 et preuve d'int\u00e9grit\u00e9 des acc\u00e8s (anti-falsification logs).\n\n"
            "2) POC CNIL :\n"
            f"{D}Hash horodat\u00e9 par acc\u00e8s agent ; audit \u221260 %.\n\n"
            "3) Limite RGPD :\n"
            f"{D}Blockchain ne remplace pas minimisation ni droits des personnes ; donn\u00e9es en amont doivent rester conformes."
        ),
        attendu="Int\u00e9r\u00eat tra\u00e7abilit\u00e9, fonctionnement POC, limite RGPD.",
        notions=["blockchain", "tra\u00e7abilit\u00e9", "journalisation"],
    ),
    I(
        "e7",
        "Privacy by design chez Wikimedia France",
        support=(
            "Wikimedia France d\u00e9veloppe l'app \u00ab WikiAtelier \u00bb (ateliers \u00e9ducation libre). "
            "Privacy by design d\u00e8s la conception (2024) :\n"
            "\u2014 collecte minimale : pr\u00e9nom + e-mail uniquement ;\n"
            "\u2014 pas de g\u00e9olocalisation ;\n"
            "\u2014 consentement \u00e9clair\u00e9 pour newsletter (case non pr\u00e9-coch\u00e9e) ;\n"
            "\u2014 suppression auto comptes inactifs 24 mois.\n"
            "DPO associatif valide la DPIA simplifi\u00e9e avant lancement."
        ),
        consigne=(
            "D\u00e9finis le privacy by design et montre l'application Wikimedia France."
        ),
        questions=[
            "Qu'est-ce que le privacy by design (article 25 RGPD) ?",
            "Quelles mesures WikiAtelier int\u00e8gre-t-elle d\u00e8s la conception ?",
            "Quel r\u00f4le du DPO avant lancement ?",
        ],
        correction=(
            "1) Privacy by design :\n"
            "Int\u00e9grer la protection des donn\u00e9es d\u00e8s la conception du produit/service "
            "et par d\u00e9faut (minimisation, s\u00e9curit\u00e9, transparence).\n\n"
            "2) Mesures WikiAtelier :\n"
            f"{D}Minimisation champs, pas g\u00e9oloc, consentement non pr\u00e9-coch\u00e9, suppression 24 mois.\n\n"
            "3) DPO :\n"
            f"{D}Valide DPIA simplifi\u00e9e avant mise en production."
        ),
        attendu="D\u00e9finition privacy by design, mesures WikiAtelier, r\u00f4le DPO.",
        notions=["privacy by design", "minimisation", "DPO"],
    ),
    I(
        "e8",
        "Sous-traitants art. 28 chez Amazon Web Services",
        support=(
            "AWS agit comme sous-traitant RGPD pour des milliers de clients EU (article 28). "
            "Contrat DPA (Data Processing Agreement) standard :\n"
            "\u2014 AWS traite uniquement sur instruction du client (responsable de traitement) ;\n"
            "\u2014 sous-traitants ult\u00e9rieurs list\u00e9s ;\n"
            "\u2014 mesures s\u00e9curit\u00e9 ISO 27001, chiffrement ;\n"
            "\u2014 assistance violations et droits des personnes.\n"
            "Client type : startup fran\u00e7aise h\u00e9bergeant app SaaS sur region eu-west-3 (Paris)."
        ),
        consigne=(
            "Explique le r\u00e9gime des sous-traitants RGPD et le r\u00f4le d'AWS."
        ),
        questions=[
            "Quelle diff\u00e9rence responsable de traitement / sous-traitant ?",
            "Quelles clauses obligatoires du contrat art. 28 cites-tu chez AWS ?",
            "Pourquoi choisir la r\u00e9gion Paris (eu-west-3) ?",
        ],
        correction=(
            "1) Diff\u00e9rence :\n"
            "Responsable de traitement d\u00e9termine finalit\u00e9s et moyens ; "
            "sous-traitant traite pour le compte du responsable.\n\n"
            "2) Clauses AWS :\n"
            f"{D}Instructions client, sous-traitants list\u00e9s, s\u00e9curit\u00e9 ISO 27001, assistance violations/droits.\n\n"
            "3) R\u00e9gion Paris :\n"
            f"{D}Localisation UE, facilit\u00e9 conformit\u00e9 transferts et latence clients fran\u00e7ais."
        ),
        attendu="Distinction responsable/sous-traitant, clauses DPA, int\u00e9r\u00eat region EU.",
        notions=["sous-traitant RGPD", "DPA", "article 28"],
    ),
    I(
        "e9",
        "Sensibilisation phishing chez ANSSI",
        support=(
            "L'ANSSI d\u00e9ploie en 2024-2025 \u00ab SecNumAcad\u00e9mie \u00bb aux agents de l'\u00c9tat : "
            "modules e-learning + campagnes phishing simul\u00e9es trimestrielles.\n"
            "R\u00e9sultats minist\u00e8res pilotes : taux de clic phishing simul\u00e9 4,2 % "
            "(contre 18,7 % avant formation) ; signalements incidents +340 %.\n"
            "R\u00e8gle ANSSI : MFA sur comptes sensibles + formation annuelle obligatoire."
        ),
        consigne=(
            "D\u00e9finis le phishing et pr\u00e9sente la campagne de sensibilisation ANSSI."
        ),
        questions=[
            "Qu'est-ce que le phishing ?",
            "Quels dispositifs ANSSI d\u00e9ploie-t-elle ?",
            "Quels r\u00e9sultats chiffr\u00e9s montrent l'efficacit\u00e9 ?",
        ],
        correction=(
            "1) Phishing :\n"
            "Escroquerie par e-mail/site imitant un service de confiance pour voler identifiants ou donn\u00e9es.\n\n"
            "2) Dispositifs ANSSI :\n"
            f"{D}SecNumAcad\u00e9mie, phishing simul\u00e9 trimestriel, MFA comptes sensibles.\n\n"
            "3) R\u00e9sultats :\n"
            f"{D}Clics phishing 4,2 % (18,7 % avant) ; signalements +340 %."
        ),
        attendu="D\u00e9finition phishing, dispositifs ANSSI, r\u00e9sultats chiffr\u00e9s.",
        notions=["phishing", "sensibilisation", "culture s\u00e9curit\u00e9"],
    ),
    I(
        "e10",
        "Synth\u00e8se IA et DPIA chez Comit\u00e9 d'\u00e9thique Orange",
        support=(
            "Orange teste en 2025 \u00ab SmartCare \u00bb : IA de priorisation des tickets support client "
            "(analyse historique appels, sentiment, urgence).\n"
            "Comit\u00e9 d'\u00e9thique Orange + DPO lancent une DPIA (Analyse d'Impact relative \u00e0 la Protection des Donn\u00e9es) :\n"
            "\u2014 risques : profilage, biais algorithmique, d\u00e9cision automatis\u00e9e ;\n"
            "\u2014 mesures : supervision humaine obligatoire, audit biais trimestriel, "
            "information client art. 22 RGPD.\n"
            "D\u00e9cision : d\u00e9ploiement limit\u00e9 au pilote 5 000 clients avant g\u00e9n\u00e9ralisation."
        ),
        consigne=(
            "D\u00e9finis la DPIA et explique pourquoi elle est n\u00e9cessaire pour SmartCare."
        ),
        questions=[
            "Qu'est-ce qu'une DPIA ? Quand est-elle obligatoire ?",
            "Quels risques SmartCare identifie-t-elle ?",
            "Quelles mesures le comit\u00e9 d'\u00e9thique impose-t-il ?",
        ],
        correction=(
            "1) DPIA :\n"
            "Analyse des risques pour droits et libert\u00e9s avant traitement \u00e0 risque "
            "(profilage, donn\u00e9es sensibles, IA \u00e0 grande \u00e9chelle). Obligatoire si risque \u00e9lev\u00e9.\n\n"
            "2) Risques SmartCare :\n"
            f"{D}Profilage, biais IA, d\u00e9cisions automatis\u00e9es sans garanties.\n\n"
            "3) Mesures :\n"
            f"{D}Supervision humaine, audit biais, information client, pilote limit\u00e9 5 000 clients."
        ),
        attendu="D\u00e9finition DPIA, risques IA, mesures comit\u00e9 \u00e9thique.",
        notions=["DPIA", "intelligence artificielle", "profilage"],
    ),
    I(
        "cas1",
        "\u00c9tude de cas : contr\u00f4le CNIL \u2014 Universit\u00e9 Paris-Saclay",
        support=(
            "Mai 2024 : la CNIL contr\u00f4le Universit\u00e9 Paris-Saclay sur gestion donn\u00e9es \u00e9tudiants "
            "(ENT, cam\u00e9ras campus, recherche). Manquements : registre incomplet (62 % traitements), "
            "dur\u00e9es conservation cam\u00e9ras non justifi\u00e9es (90 jours vs 30 recommand\u00e9s), "
            "consentement recherche flou.\n"
            "Mise en demeure 6 mois. Plan conformit\u00e9 2024-2025 : DPO renforc\u00e9, "
            "registre 100 %, charte cam\u00e9ras, formation 2 400 enseignants-chercheurs.\n"
            "Co\u00fbt : 380 000 \u20ac. Cl\u00f4ture contr\u00f4le favorable d\u00e9cembre 2025."
        ),
        consigne=(
            "Analyse les manquements CNIL et le plan de mise en conformit\u00e9."
        ),
        questions=[
            "Quels trois manquements la CNIL identifie-t-elle ?",
            "Quelles mesures correctives Universit\u00e9 Paris-Saclay d\u00e9ploie-t-elle ?",
            "Pourquoi un registre complet est-il central au RGPD ?",
            "Le plan est-il coh\u00e9rent ? Justifie.",
        ],
        correction=(
            "1) Manquements :\n"
            f"{D}Registre 62 %, conservation cam\u00e9ras excessive, consentement recherche flou.\n\n"
            "2) Mesures :\n"
            f"{D}DPO renforc\u00e9, registre 100 %, charte cam\u00e9ras, formation 2 400 personnes.\n\n"
            "3) Registre central :\n"
            f"{D}Documente finalit\u00e9s, bases l\u00e9gales, dur\u00e9es ; base de la responsabilit\u00e9 (accountability).\n\n"
            "4) Coh\u00e9rence :\n"
            f"{D}Plan global structurel ; cl\u00f4ture favorable CNIL d\u00e9cembre 2025."
        ),
        attendu="Manquements list\u00e9s, mesures, r\u00f4le registre, coh\u00e9rence plan.",
        notions=["contr\u00f4le CNIL", "mise en conformit\u00e9", "registre des traitements"],
    ),
    I(
        "cas2",
        "\u00c9tude de cas : ransomware \u2014 Commission europ\u00e9enne (RGPD)",
        support=(
            "14 mars 2025 : ran\u00e7ongiciel frappe un prestataire IT de la Commission europ\u00e9enne "
            "(donn\u00e9es de 890 candidatures stages : noms, e-mails, CV).\n"
            "Chronologie :\n"
            "\u2014 J0 : chiffrement serveurs prestataire ;\n"
            "\u2014 J+1 : activation cellule crise cyber + DPO ; notification CNIL et autorit\u00e9s EU ;\n"
            "\u2014 J+2 : information 890 personnes ; hotline d\u00e9di\u00e9e ;\n"
            "\u2014 J+7 : restauration backup (PRA), refus paiement ran\u00e7on.\n"
            "Impact : service stages suspendu 12 jours ; amende \u00e9vit\u00e9e si preuve mesures art. 32.\n"
            "Options post-crise : (A) silence ; (B) revue contrats prestataires + MFA + tests PRA annuels ; "
            "(C) payer ran\u00e7on ; (D) stopper tout traitement de donn\u00e9es."
        ),
        consigne=(
            "Analyse la crise ransomware sous l'angle RGPD et recommande un plan post-crise."
        ),
        questions=[
            "S'agit-il d'une violation de donn\u00e9es \u00e0 notifier ? Justifie.",
            "Pourquoi refuser la ran\u00e7on (option C) ?",
            "Quelles obligations RGPD articles 33-34 sont respect\u00e9es ?",
            "Quelle option recommandes-tu ? Justifie.",
        ],
        correction=(
            "1) Violation \u00e0 notifier :\n"
            f"{D}Oui : acc\u00e8s non autoris\u00e9/chiffrement donn\u00e9es personnelles (890 candidats).\n\n"
            "2) Refus ran\u00e7on :\n"
            f"{D}Alimente cybercriminalit\u00e9, aucune garantie restitution, ill\u00e9galit\u00e9 possible.\n\n"
            "3) Obligations respect\u00e9es :\n"
            f"{D}Art. 33 notification autorit\u00e9 ; art. 34 information personnes si risque \u00e9lev\u00e9.\n\n"
            "4) Recommandation B :\n"
            f"{D}Renforcer art. 32 s\u00e9curit\u00e9, contrats art. 28 prestataires, MFA, PRA test\u00e9."
        ),
        attendu="Violation justifi\u00e9e, refus ran\u00e7on, articles 33-34, option B argument\u00e9e.",
        notions=["ransomware", "PRA", "notification violation"],
    ),
]
