# -*- coding: utf-8 -*-
"""Management chapitre 9 — acteurs internes, RSE et dialogue social."""

D = "\u2014 "


def I(sid, title, **body):
    return {"sid": sid, "title": title, "body": body}


CH9 = [
    I(
        "e1",
        "Acteurs internes chez Veolia Propret\u00e9",
        support=(
            "Veolia Propret\u00e9 (filiale Veolia, propret\u00e9 urbaine et tertiaire) emploie environ "
            "40 000 personnes en France. En 2024, la direction cartographie les acteurs internes "
            "avant un plan de d\u00e9carbonation des flottes :\n"
            "\u2014 salari\u00e9s de terrain (agents de propret\u00e9, conducteurs) : 78 % des effectifs ;\n"
            "\u2014 encadrement interm\u00e9diaire (chefs d'\u00e9quipe, responsables de secteur) ;\n"
            "\u2014 direction op\u00e9rationnelle et si\u00e8ge (RH, achats, RSE) ;\n"
            "\u2014 CSE (Comit\u00e9 social et \u00e9conomique) et d\u00e9l\u00e9gu\u00e9s syndicaux ;\n"
            "\u2014 actionnaires via le groupe Veolia (CAC 40).\n"
            "Un questionnaire interne montre que 62 % des agents estiment \u00ab mal inform\u00e9s \u00bb "
            "sur la transition \u00e9nerg\u00e9tique, alors que la direction la juge prioritaire."
        ),
        consigne=(
            "\u00c0 partir du support, d\u00e9finis les acteurs internes d'une organisation "
            "et montre comment Veolia Propret\u00e9 les identifie."
        ),
        questions=[
            "Qu'est-ce qu'un acteur interne ?",
            "Cite quatre cat\u00e9gories d'acteurs internes pr\u00e9sentes chez Veolia Propret\u00e9.",
            "Quel probl\u00e8me de communication appara\u00eet dans le support ?",
        ],
        correction=(
            "1) Acteur interne :\n"
            "Personne ou groupe qui agit \u00e0 l'int\u00e9rieur de l'organisation "
            "(salari\u00e9s, managers, repr\u00e9sentants du personnel, actionnaires).\n\n"
            "2) Cat\u00e9gories Veolia Propret\u00e9 :\n"
            f"{D}Agents de terrain et conducteurs (78 %).\n"
            f"{D}Encadrement interm\u00e9diaire.\n"
            f"{D}Direction / si\u00e8ge (RH, achats, RSE).\n"
            f"{D}CSE, d\u00e9l\u00e9gu\u00e9s syndicaux, actionnaires Veolia.\n\n"
            "3) Probl\u00e8me :\n"
            f"{D}62 % des agents se sentent mal inform\u00e9s sur la d\u00e9carbonation "
            f"alors que la direction la consid\u00e8re prioritaire \u2014 d\u00e9calage d'information."
        ),
        attendu="D\u00e9finition, quatre acteurs cit\u00e9s, probl\u00e8me de communication identifi\u00e9.",
        notions=["acteurs internes"],
    ),
    I(
        "e2",
        "Int\u00e9r\u00eats convergents et divergents chez Onet",
        support=(
            "Onet (propret\u00e9, s\u00e9curit\u00e9, accueil \u2014 70 000 salari\u00e9s) ren\u00e9gocie "
            "en 2025 un contrat de 120 M\u20ac avec un a\u00e9roport r\u00e9gional. Trois acteurs :\n"
            "\u2014 la direction Onet veut r\u00e9duire les co\u00fbts de 4 % pour pr\u00e9server la marge ;\n"
            "\u2014 les salari\u00e9s demandent +2,5 % de salaire et la reconnaissance des "
            "comp\u00e9tences s\u00e9curit\u00e9 ;\n"
            "\u2014 le client a\u00e9roport exige z\u00e9ro d\u00e9chet non tri\u00e9 et des badges "
            "100 % conformes sous 6 mois.\n"
            "Int\u00e9r\u00eat convergent : maintenir le contrat (emplois + chiffre d'affaires). "
            "Int\u00e9r\u00eat divergent : r\u00e9partition du gain entre salaires, investissements "
            "RSE et marge."
        ),
        consigne=(
            "Explique la diff\u00e9rence entre int\u00e9r\u00eats convergents et divergents, "
            "puis applique ces notions au cas Onet."
        ),
        questions=[
            "D\u00e9finis int\u00e9r\u00eats convergents et int\u00e9r\u00eats divergents.",
            "Quel int\u00e9r\u00eat convergent partagent direction, salari\u00e9s et client ?",
            "Cite deux int\u00e9r\u00eats divergents visibles dans le support.",
        ],
        correction=(
            "1) D\u00e9finitions :\n"
            "Convergents : objectifs communs entre acteurs.\n"
            "Divergents : objectifs oppos\u00e9s ou en concurrence (r\u00e9partition des ressources).\n\n"
            "2) Convergence :\n"
            f"{D}Conserver le contrat a\u00e9roport (120 M\u20ac) : emplois pour les salari\u00e9s, "
            f"CA pour Onet, service pour le client.\n\n"
            "3) Divergences :\n"
            f"{D}Direction : baisser les co\u00fbts 4 % vs salari\u00e9s : +2,5 % de salaire.\n"
            f"{D}Investissements RSE (tri, badges) vs pr\u00e9servation de la marge."
        ),
        attendu="Deux d\u00e9finitions, convergence sur le contrat, deux divergences cit\u00e9es.",
        notions=["int\u00e9r\u00eats convergents", "int\u00e9r\u00eats divergents"],
    ),
    I(
        "e3",
        "Culture d'organisation chez Suez",
        support=(
            "Suez (eau, d\u00e9chets, 40 000 salari\u00e9s en France) affiche depuis 2020 "
            "la devise \u00ab agir pour la resSourcera \u00bb. Rituels observ\u00e9s :\n"
            "\u2014 r\u00e9unions mensuelles \u00ab retour terrain \u00bb o\u00f9 les techniciens "
            "pr\u00e9sentent un incident r\u00e9solu ;\n"
            "\u2014 charte \u00e9thique sign\u00e9e par chaque nouvel embauch\u00e9 ;\n"
            "\u2014 indicateur interne \u00ab jours sans accident \u00bb affich\u00e9 dans chaque agence.\n"
            "En 2024, une enqu\u00eate interne r\u00e9v\u00e8le : 81 % des salari\u00e9s connaissent "
            "la devise, mais seulement 54 % estiment qu'elle guide les d\u00e9cisions quotidiennes. "
            "Un site en r\u00e9organisation accuse un turnover de 22 % (moyenne groupe : 11 %)."
        ),
        consigne=(
            "D\u00e9finis la culture d'organisation (valeurs, rituels, normes) "
            "et analyse celle de Suez \u00e0 partir du support."
        ),
        questions=[
            "Qu'est-ce que la culture d'organisation ?",
            "Cite deux rituels ou normes Suez et une valeur affich\u00e9e.",
            "Que montrent les chiffres 81 % / 54 % / turnover 22 % ?",
        ],
        correction=(
            "1) Culture d'organisation :\n"
            "Ensemble de valeurs, normes, rituels et repr\u00e9sentations partag\u00e9s "
            "qui orientent le comportement des membres de l'organisation.\n\n"
            "2) \u00c9l\u00e9ments Suez :\n"
            f"{D}Valeur : resSourcera (environnement, \u00e9conomie circulaire).\n"
            f"{D}Rituels : retour terrain mensuel, charte \u00e9thique, affichage s\u00e9curit\u00e9.\n\n"
            "3) Interpr\u00e9tation chiffres :\n"
            f"{D}Culture affich\u00e9e mais peu v\u00e9cue sur un site (54 %).\n"
            f"{D}Turnover 22 % = signe de d\u00e9calage culture / changement non accompagn\u00e9."
        ),
        attendu="D\u00e9finition culture, rituels + valeur, interpr\u00e9tation des \u00e9carts chiffr\u00e9s.",
        notions=["culture d'organisation"],
    ),
    I(
        "e4",
        "Dynamique de groupe chez Accor",
        support=(
            "Accor d\u00e9ploie en 2025 le programme \u00ab Hospitality Lab \u00bb dans 12 h\u00f4tels "
            "Ibis en r\u00e9gion parisienne. Une \u00e9quipe projet de 8 personnes (direction d'h\u00f4tel, "
            "r\u00e9ception, housekeeping, maintenance, marketing digital) travaille 4 mois "
            "sur l'exp\u00e9rience client sans file d'attente.\n"
            "Observations apr\u00e8s 6 semaines :\n"
            "\u2014 r\u00f4le de leader \u00e9mergent : la responsable r\u00e9ception (initiative, "
            "r\u00e9unions quotidiennes) ;\n"
            "\u2014 tension entre housekeeping et maintenance sur les d\u00e9lais d'intervention ;\n"
            "\u2014 coh\u00e9sion mesur\u00e9e \u00e0 7,2/10 (enqu\u00eate interne).\n"
            "R\u00e9sultat pilote : temps d'attente r\u00e9ception \u221235 %, NPS client +8 points."
        ),
        consigne=(
            "Explique ce qu'est la dynamique de groupe et identifie ses dimensions "
            "dans l'\u00e9quipe Accor du support."
        ),
        questions=[
            "Qu'est-ce que la dynamique de groupe ?",
            "Quel r\u00f4le \u00e9merge et quel conflit appara\u00eet dans l'\u00e9quipe ?",
            "Comment interpr\u00e9ter le score de coh\u00e9sion 7,2/10 et le NPS +8 ?",
        ],
        correction=(
            "1) Dynamique de groupe :\n"
            "Ensemble des interactions, r\u00f4les, coh\u00e9sion et conflits au sein d'un groupe "
            "qui influencent sa performance.\n\n"
            "2) Accor Hospitality Lab :\n"
            f"{D}Leader \u00e9mergent : responsable r\u00e9ception.\n"
            f"{D}Conflit : housekeeping vs maintenance (d\u00e9lais).\n\n"
            "3) Interpr\u00e9tation :\n"
            f"{D}Coh\u00e9sion correcte (7,2) malgr\u00e9 une tension \u2014 le groupe produit "
            f"des r\u00e9sultats (NPS +8, attente \u221235 %)."
        ),
        attendu="D\u00e9finition dynamique, r\u00f4le + conflit identifi\u00e9s, lien coh\u00e9sion / performance.",
        notions=["dynamique de groupe"],
    ),
    I(
        "e5",
        "RSE et r\u00e9seaux sociaux chez Secours populaire",
        support=(
            "Secours populaire fran\u00e7ais (association loi 1901, 80 000 b\u00e9n\u00e9voles, "
            "1 000 permanences) m\u00e8ne la campagne \u00ab Vacances pour tous \u00bb en \u00e9t\u00e9 2024.\n"
            "Communication RSE sur les r\u00e9seaux :\n"
            "\u2014 Instagram : 42 000 abonn\u00e9s, vid\u00e9os de colonies de vacances (+28 % d'engagement) ;\n"
            "\u2014 LinkedIn : t\u00e9moignages d'entreprises m\u00e9c\u00e8nes (TotalEnergies, Decathlon) ;\n"
            "\u2014 X (Twitter) : alertes urgence (canicule, pr\u00e9carit\u00e9 \u00e9t\u00e9).\n"
            "En septembre 2024 : 3,2 M\u20ac de dons en ligne (+19 % vs 2023), "
            "mais pol\u00e9mique sur un post mal interpr\u00e9t\u00e9 (12 000 commentaires n\u00e9gatifs en 48 h). "
            "L'association publie un message de clarification sous 24 h."
        ),
        consigne=(
            "D\u00e9finis la RSE et explique comment Secours populaire l'utilise "
            "sur les r\u00e9seaux sociaux, en citant un risque du support."
        ),
        questions=[
            "Qu'est-ce que la RSE (Responsabilit\u00e9 Soci\u00e9tale des Entreprises) ?",
            "Comment Secours populaire communique-t-il sur trois r\u00e9seaux diff\u00e9rents ?",
            "Quel risque les r\u00e9seaux sociaux repr\u00e9sentent-ils ici ?",
        ],
        correction=(
            "1) RSE :\n"
            "Prise en compte par l'organisation de l'impact social, environnemental "
            "et \u00e9thique de ses activit\u00e9s au-del\u00e0 de la seule performance \u00e9conomique.\n\n"
            "2) Communication Secours populaire :\n"
            f"{D}Instagram : humaniser l'action (colonies).\n"
            f"{D}LinkedIn : mobiliser les entreprises m\u00e9c\u00e8nes.\n"
            f"{D}X : alertes sociales en temps r\u00e9el.\n\n"
            "3) Risque :\n"
            f"{D}Bad buzz (12 000 commentaires n\u00e9gatifs) \u2014 n\u00e9cessite veille "
            f"et r\u00e9ponse rapide (clarification sous 24 h)."
        ),
        attendu="D\u00e9finition RSE, trois usages r\u00e9seaux, risque e-r\u00e9putation cit\u00e9.",
        notions=["RSE", "r\u00e9seaux sociaux"],
    ),
    I(
        "e6",
        "Dialogue social et QVT chez Mairie de Nantes",
        support=(
            "La Mairie de Nantes (6 800 agents territoriaux) signe en mars 2024 un accord "
            "QVT (Qualit\u00e9 de Vie au Travail) avec les organisations syndicales "
            "(CFDT, CGT, FO, UNSA) :\n"
            "\u2014 t\u00e9l\u00e9travail : 2 jours/semaine pour les fonctions compatibles "
            "(1 200 agents \u00e9ligibles) ;\n"
            "\u2014 charte anti-harc\u00e8lement et cellule d'\u00e9coute ;\n"
            "\u2014 5 jours de formation QVT/an pour les managers.\n"
            "Instances de dialogue : CHSCT devenu CSE, commission administrative paritaire, "
            "r\u00e9unions mensuelles direction / syndicats.\n"
            "Bilan 12 mois : absent\u00e9isme \u22120,8 point (7,1 % \u2192 6,3 %), "
            "enqu\u00eate interne \u00ab bien-\u00eatre \u00bb : 68 % de satisfaits (contre 59 % avant)."
        ),
        consigne=(
            "D\u00e9finis dialogue social et QVT, puis montre comment la Mairie de Nantes "
            "combine les deux dans le support."
        ),
        questions=[
            "Qu'est-ce que le dialogue social ? Qu'est-ce que la QVT ?",
            "Cite deux mesures QVT de l'accord nantais.",
            "Quels r\u00e9sultats chiffr\u00e9s montrent l'effet de cette d\u00e9marche ?",
        ],
        correction=(
            "1) D\u00e9finitions :\n"
            "Dialogue social : \u00e9changes n\u00e9goci\u00e9s entre employeur et repr\u00e9sentants "
            "du personnel (accords, instances).\n"
            "QVT : d\u00e9marche visant \u00e0 am\u00e9liorer les conditions de travail "
            "et le bien-\u00eatre des salari\u00e9s.\n\n"
            "2) Mesures Nantes :\n"
            f"{D}T\u00e9l\u00e9travail 2 jours/semaine.\n"
            f"{D}Charte anti-harc\u00e8lement, formation managers QVT.\n\n"
            "3) R\u00e9sultats :\n"
            f"{D}Absent\u00e9isme \u22120,8 point ; bien-\u00eatre 59 % \u2192 68 %."
        ),
        attendu="Deux d\u00e9finitions, deux mesures, deux indicateurs interpr\u00e9t\u00e9s.",
        notions=["dialogue social", "QVT"],
    ),
    I(
        "e7",
        "Conflits et m\u00e9diation chez Coop\u00e9rative Scop",
        support=(
            "La Scop TI (coop\u00e9rative de travailleurs, 85 associ\u00e9s-salari\u00e9s, "
            "imprimerie \u00e9co-responsable \u00e0 Lyon) conna\u00eet en 2024 un conflit entre "
            "l'\u00e9quipe production et l'\u00e9quipe commerciale :\n"
            "\u2014 production reproche aux commerciaux d'accepter des d\u00e9lais impossibles ;\n"
            "\u2014 commerciaux estiment que production manque de flexibilit\u00e9.\n"
            "Le conseil d'administration de la Scop mandate une m\u00e9diatrice externe "
            "(Ordre des m\u00e9diateurs) : 3 s\u00e9ances, r\u00e8gles communes sur les d\u00e9lais "
            "(d\u00e9lai minimum 10 jours ouvr\u00e9s), tableau partag\u00e9 de charge.\n"
            "Apr\u00e8s m\u00e9diation : retards \u221240 %, 0 d\u00e9mission en 6 mois "
            "(contre 4 au semestre pr\u00e9c\u00e9dent)."
        ),
        consigne=(
            "D\u00e9finis conflit organisationnel et m\u00e9diation, "
            "puis explique comment la Scop TI les g\u00e8re."
        ),
        questions=[
            "Qu'est-ce qu'un conflit au travail ? Qu'est-ce que la m\u00e9diation ?",
            "Quelles sont les causes du conflit chez Scop TI ?",
            "Quels r\u00e9sultats la m\u00e9diation a-t-elle produits ?",
        ],
        correction=(
            "1) D\u00e9finitions :\n"
            "Conflit : opposition d'int\u00e9r\u00eats ou de points de vue entre acteurs internes.\n"
            "M\u00e9diation : intervention d'un tiers neutre pour faciliter la n\u00e9gociation "
            "et trouver un accord.\n\n"
            "2) Causes Scop TI :\n"
            f"{D}D\u00e9lais commerciaux vs capacit\u00e9 production.\n"
            f"{D}Manque de r\u00e8gles communes et de visibilit\u00e9 sur la charge.\n\n"
            "3) R\u00e9sultats :\n"
            f"{D}Accord sur d\u00e9lai minimum 10 jours, retards \u221240 %, "
            f"stabilisation des effectifs (0 d\u00e9mission)."
        ),
        attendu="Deux d\u00e9finitions, causes identifi\u00e9es, r\u00e9sultats chiffr\u00e9s cit\u00e9s.",
        notions=["conflits", "m\u00e9diation"],
    ),
    I(
        "e8",
        "Communaut\u00e9s de pratique chez Orange",
        support=(
            "Orange (105 000 salari\u00e9s en France) anime depuis 2022 des communaut\u00e9s "
            "de pratique (CoP) sur son intranet \u00ab Plazza \u00bb :\n"
            "\u2014 CoP \u00ab Fibre optique \u00bb : 1 400 techniciens \u00e9changent proc\u00e9dures "
            "de raccordement, 320 fiches bonnes pratiques cr\u00e9\u00e9es ;\n"
            "\u2014 CoP \u00ab Relation client difficile \u00bb : 680 conseillers, "
            "jeux de r\u00f4le mensuels en visio ;\n"
            "\u2014 CoP \u00ab Cybers\u00e9curit\u00e9 \u00bb : experts r\u00e9seau + RH, "
            "partage d'alertes phishing.\n"
            "Indicateurs 2024 : temps de r\u00e9solution incident fibre \u221218 %, "
            "satisfaction interne CoP 8,1/10. Limite : 35 % des salari\u00e9s ne participent jamais."
        ),
        consigne=(
            "Qu'est-ce qu'une communaut\u00e9 de pratique ? "
            "Montre comment Orange en cr\u00e9e et quels effets mesurer."
        ),
        questions=[
            "D\u00e9finis communaut\u00e9 de pratique.",
            "Cite deux CoP Orange et ce qu'elles partagent.",
            "Quels b\u00e9n\u00e9fices et quelle limite le support mentionne-t-il ?",
        ],
        correction=(
            "1) Communaut\u00e9 de pratique :\n"
            "Groupe de personnes partageant un m\u00e9tier ou une expertise, "
            "qui \u00e9changent r\u00e9guli\u00e8rement pour am\u00e9liorer leurs pratiques.\n\n"
            "2) CoP Orange :\n"
            f"{D}Fibre : fiches techniques, raccordement.\n"
            f"{D}Relation client : jeux de r\u00f4le, gestion situations difficiles.\n\n"
            "3) Effets et limite :\n"
            f"{D}R\u00e9solution incidents \u221218 %, satisfaction 8,1/10.\n"
            f"{D}Limite : 35 % des salari\u00e9s exclus (non participants)."
        ),
        attendu="D\u00e9finition CoP, deux exemples, b\u00e9n\u00e9fice + limite.",
        notions=["communaut\u00e9s de pratique"],
    ),
    I(
        "e9",
        "Engagement collaboratif chez Doctolib",
        support=(
            "Doctolib (leader fran\u00e7ais de prise de rendez-vous m\u00e9dicaux, "
            "2 800 salari\u00e9s dont 900 en tech) d\u00e9ploie en 2024 :\n"
            "\u2014 Slack : 340 canaux th\u00e9matiques, 92 % des salari\u00e9s actifs chaque semaine ;\n"
            "\u2014 Notion : base de connaissances produit co-\u00e9dit\u00e9e (4 200 pages) ;\n"
            "\u2014 rituels \u00ab demo day \u00bb bi-mensuel : chaque \u00e9quipe pr\u00e9sente "
            "ses avanc\u00e9es en 15 minutes.\n"
            "Enqu\u00eate Glassdoor interne 2024 : 76 % estiment \u00ab bien inform\u00e9s \u00bb "
            "sur la strat\u00e9gie produit (contre 58 % en 2022). Turnover tech : 14 % "
            "(moyenne secteur SaaS fran\u00e7ais : 19 %)."
        ),
        consigne=(
            "D\u00e9finis l'engagement collaboratif et explique comment les outils "
            "Doctolib le renforcent selon le support."
        ),
        questions=[
            "Qu'est-ce que l'engagement collaboratif ?",
            "Quels outils et rituels Doctolib utilise-t-il ?",
            "Comment interpr\u00e9ter l'\u00e9volution 58 % \u2192 76 % et le turnover 14 % ?",
        ],
        correction=(
            "1) Engagement collaboratif :\n"
            "Implication active des salari\u00e9s dans le travail collectif, "
            "l'\u00e9change d'informations et la co-construction de solutions.\n\n"
            "2) Outils Doctolib :\n"
            f"{D}Slack (canaux th\u00e9matiques), Notion (co-\u00e9dition), demo day.\n\n"
            "3) Interpr\u00e9tation :\n"
            f"{D}Meilleure circulation de l'info strat\u00e9gique (+18 points).\n"
            f"{D}Turnover tech inf\u00e9rieur au secteur = fid\u00e9lisation li\u00e9e "
            f"\u00e0 la collaboration."
        ),
        attendu="D\u00e9finition, outils cit\u00e9s, deux indicateurs interpr\u00e9t\u00e9s.",
        notions=["engagement collaboratif"],
    ),
    I(
        "e10",
        "Synth\u00e8se acteurs et RSE au CHU de Toulouse",
        support=(
            "Le CHU de Toulouse (13 000 salari\u00e9s, 2\u00e8me CHU de France) publie "
            "son rapport RSE 2024. Acteurs mobilis\u00e9s :\n"
            "\u2014 soignants et personnels administratifs (internes) ;\n"
            "\u2014 patients et usagers (externes) ;\n"
            "\u2014 fournisseurs de m\u00e9dicaments et mat\u00e9riel (externes) ;\n"
            "\u2014 collectivit\u00e9s et Agence R\u00e9gionale de Sant\u00e9 (externes).\n"
            "Actions RSE : tri des d\u00e9chets m\u00e9dicaux (\u221212 % d'incin\u00e9ration), "
            "charte achats responsables (38 % du budget fournisseurs), "
            "pr\u00e9vention burn-out (800 managers form\u00e9s).\n"
            "Indicateurs : satisfaction usagers 72/100, \u00e9missions CO\u2082 \u22128 % "
            "sur le scope 1-2, budget RSE : 4,2 M\u20ac."
        ),
        consigne=(
            "Fais la synth\u00e8se : distingue acteurs internes et externes, "
            "puis montre comment le CHU de Toulouse int\u00e8gre la RSE."
        ),
        questions=[
            "Classe les quatre acteurs cit\u00e9s en internes ou externes.",
            "Cite deux actions RSE du CHU et leur effet chiffr\u00e9.",
            "Pourquoi la RSE hospitali\u00e8re concerne-t-elle \u00e0 la fois "
            "des acteurs internes et externes ?",
        ],
        correction=(
            "1) Classification :\n"
            f"{D}Internes : soignants, administratifs.\n"
            f"{D}Externes : patients, fournisseurs, collectivit\u00e9s, ARS.\n\n"
            "2) Actions RSE :\n"
            f"{D}Tri d\u00e9chets m\u00e9dicaux : \u221212 % incin\u00e9ration.\n"
            f"{D}Achats responsables : 38 % du budget fournisseurs.\n\n"
            "3) Double dimension :\n"
            f"{D}Interne : conditions de travail (burn-out).\n"
            f"{D}Externe : impact environnemental et qualit\u00e9 de soins (patients)."
        ),
        attendu="Classification acteurs, deux actions chiffr\u00e9es, double dimension RSE.",
        notions=["acteurs internes", "acteurs externes", "RSE"],
    ),
    I(
        "cas1",
        "\u00c9tude de cas : mouvement social chez Airbus",
        support=(
            "Novembre 2024 : le CSE d'Airbus d\u00e9partement Commercial Aircraft (Toulouse, "
            "46 000 salari\u00e9s en France) appelle \u00e0 une gr\u00e8ve de 24 h le 28 novembre "
            "apr\u00e8s l'\u00e9chec de la n\u00e9gociation salariale.\n"
            "Revendications syndicales (CGT, FO, CFDT) : +5,5 % de salaire, "
            "indexation sur l'inflation 2023-2024, maintien des emplois sur le site A320.\n"
            "Position direction : +3,2 % + prime exceptionnelle 1 500 \u20ac, "
            "arguant de la pression concurrentielle (Boeing, COMAC).\n"
            "Taux de gr\u00e9vistes le 28/11 : 38 % \u00e0 Toulouse. Impact : "
            "retard sur 4 avions en livraison, co\u00fbt estim\u00e9 12 M\u20ac.\n"
            "M\u00e9diation D\u00e9l\u00e9gu\u00e9 g\u00e9n\u00e9ral du travail le 5 d\u00e9cembre. "
            "Options : (A) maintenir l'offre 3,2 % ; (B) monter \u00e0 4,5 % avec clause "
            "productivit\u00e9 ; (C) accord cibl\u00e9 sur les bas salaires ; (D) prolonger "
            "le conflit."
        ),
        consigne=(
            "Analyse ce conflit social : acteurs, int\u00e9r\u00eats divergents, "
            "puis recommande une option (A-D) en argumentant."
        ),
        questions=[
            "Quels acteurs internes sont en conflit et quels sont leurs int\u00e9r\u00eats ?",
            "Quel int\u00e9r\u00eat convergent pourrait rapprocher les parties ?",
            "Que repr\u00e9sentent 38 % de gr\u00e9vistes et 12 M\u20ac de co\u00fbt ?",
            "Quelle option recommandes-tu ? Pourquoi ?",
        ],
        correction=(
            "1) Acteurs et int\u00e9r\u00eats :\n"
            f"{D}Syndicats / salari\u00e9s : pouvoir d'achat (+5,5 %), emplois.\n"
            f"{D}Direction : ma\u00eetrise des co\u00fbts, comp\u00e9titivit\u00e9 internationale.\n\n"
            "2) Convergence possible :\n"
            f"{D}P\u00e9rennit\u00e9 du site A320 et de l'emploi industriel fran\u00e7ais.\n\n"
            "3) Chiffres :\n"
            f"{D}38 % = mobilisation significative mais pas majorit\u00e9 absolue.\n"
            f"{D}12 M\u20ac = co\u00fbt du conflit qui p\u00e8se dans la n\u00e9gociation.\n\n"
            "4) Recommandation :\n"
            f"{D}Option B ou C : compromis (4,5 % + productivit\u00e9 ou ciblage bas salaires) "
            f"plut\u00f4t que D (escalade) ou A (offre initiale insuffisante)."
        ),
        attendu="Acteurs typ\u00e9s, convergence rep\u00e9r\u00e9e, chiffres interpr\u00e9t\u00e9s, option argument\u00e9e.",
        notions=["gr\u00e8ve", "dialogue social", "int\u00e9r\u00eats divergents"],
    ),
    I(
        "cas2",
        "\u00c9tude de cas : appel d'offres RSE \u00e0 la Fondation de France",
        support=(
            "La Fondation de France lance en janvier 2025 un appel d'offres pour "
            "r\u00e9nover l'emballage de 2 millions de kits de collecte \u00ab Don en confiance \u00bb. "
            "Budget : 890 000 \u20ac HT. Crit\u00e8res de notation (100 points) :\n"
            "\u2014 prix : 30 points ;\n"
            "\u2014 qualit\u00e9 technique : 25 points ;\n"
            "\u2014 crit\u00e8res RSE : 45 points (mati\u00e8res recycl\u00e9es, "
            "insertion professionnelle, bilan carbone, conditions de travail sous-traitants).\n"
            "Trois candidats :\n"
            "\u2014 Emballages Durand : offre la moins ch\u00e8re (780 000 \u20ac), "
            "score RSE 28/45 (pas d'insertion) ;\n"
            "\u2014 EcoPack Scop : 850 000 \u20ac, score RSE 42/45 (ESAT partenaire, "
            "80 % mati\u00e8res recycl\u00e9es) ;\n"
            "\u2014 GlobalPrint SA : 810 000 \u20ac, score RSE 35/45.\n"
            "La Fondation rappelle sa mission d'utilit\u00e9 publique et sa charte "
            "d'achats responsables sign\u00e9e en 2023."
        ),
        consigne=(
            "Explique comment les crit\u00e8res RSE s'int\u00e8grent dans un appel d'offres. "
            "Compare les trois offres et recommande un attributaire."
        ),
        questions=[
            "Pourquoi la Fondation accorde 45 % des points aux crit\u00e8res RSE ?",
            "Compare les trois candidats (prix + RSE).",
            "Quel candidat recommandes-tu ? Justifie au regard de la mission de la Fondation.",
            "Quel risque si seul le crit\u00e8re prix \u00e9tait retenu ?",
        ],
        correction=(
            "1) Poids RSE :\n"
            f"{D}Coh\u00e9rence avec la mission d'utilit\u00e9 publique et la charte achats 2023.\n"
            f"{D}L'acheteur int\u00e8gre des parties prenantes (environnement, insertion).\n\n"
            "2) Comparaison :\n"
            f"{D}Durand : moins cher mais RSE faible (28/45).\n"
            f"{D}EcoPack Scop : plus cher mais RSE excellent (42/45).\n"
            f"{D}GlobalPrint : interm\u00e9diaire.\n\n"
            "3) Recommandation :\n"
            f"{D}EcoPack Scop : surco\u00fbt limit\u00e9 (60 000 \u20ac vs Durand) pour "
            f"une coh\u00e9rence forte avec les valeurs de la Fondation.\n\n"
            "4) Risque prix seul :\n"
            f"{D}Greenwashing, d\u00e9gradation de l'image, non-respect de la charte RSE."
        ),
        attendu="Justification crit\u00e8res RSE, comparaison, recommandation EcoPack, risque identifi\u00e9.",
        notions=["RSE", "parties prenantes", "achats responsables"],
    ),
]
