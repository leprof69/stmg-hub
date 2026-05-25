# -*- coding: utf-8 -*-
"""Management chapitre 2 — acteurs reels, un concept par exercice."""

D = "\u2014 "


def I(sid, title, **body):
    return {"sid": sid, "title": title, "body": body}


CH2 = [
    I(
        "e1",
        "Les trois composantes du mod\u00e8le \u00e9conomique chez Etsy",
        support=(
            "Etsy, marketplace mondiale d'artisanat (90 M d'acheteurs actifs en 2024), pr\u00e9sente "
            "son business model. Proposition de valeur : objets uniques, lien cr\u00e9ateur, paiement "
            "s\u00e9curis\u00e9. M\u00e9canisme : plateforme num\u00e9rique, 2 300 salari\u00e9s, "
            "partenaires logistiques. Revenus : commission 6,5 % + listing 0,20 \u20ac + Etsy Plus "
            "10 \u20ac/mois. En 2024 : GMV 13,2 Md€, CA 2,75 Md€, r\u00e9sultat d'exploitation "
            "450 M€. Expansion Europe de l'Est pr\u00e9vue 2026."
        ),
        consigne=(
            "Analyse le mod\u00e8le \u00e9conomique d'Etsy en mobilisant les trois composantes du cours : "
            "proposition de valeur, m\u00e9canisme de cr\u00e9ation de valeur, mode de g\u00e9n\u00e9ration des revenus."
        ),
        questions=[
            "Qu'est-ce qu'un mod\u00e8le \u00e9conomique ? Pr\u00e9sente ses trois composantes.",
            "Identifie la proposition de valeur d'Etsy (clients, offre, prix).",
            "D\u00e9cris le m\u00e9canisme de cr\u00e9ation de valeur et les sources de revenus de la plateforme.",
        ],
        correction=(
            "1) Mod\u00e8le \u00e9conomique :\n"
            "Description de la fa\u00e7on dont l'entreprise fonctionne et gagne de l'argent. "
            "Trois composantes : proposition de valeur, m\u00e9canisme de cr\u00e9ation de valeur, rentabilit\u00e9.\n\n"
            "2) Proposition de valeur Etsy :\n"
            f"{D}Clients : acheteurs recherchant l'artisanat unique et vendeurs cr\u00e9ateurs.\n"
            f"{D}Offre : marketplace, tra\u00e7abilit\u00e9, paiement s\u00e9curis\u00e9.\n"
            f"{D}Prix : commission 6,5 %, frais listing, abonnement Etsy Plus 10 \u20ac/mois.\n\n"
            "3) M\u00e9canisme et revenus :\n"
            f"{D}Ressources : plateforme, algorithmes, 2 300 salari\u00e9s.\n"
            f"{D}Partenaires : transporteurs, prestataires paiement.\n"
            f"{D}Revenus diversifi\u00e9s : commissions + abonnements ; CA 2,75 Md€ en 2024."
        ),
        attendu="Trois composantes identifi\u00e9es et illustr\u00e9es pr\u00e9cis\u00e9ment sur Etsy.",
        notions=["mod\u00e8le \u00e9conomique", "proposition de valeur", "business model"],
    ),
    I(
        "e2",
        "Cr\u00e9ation de valeur pour le client chez Vinted",
        support=(
            "En mars 2025, une vendeuse parisienne propose un manteau Sandro sur Vinted \u00e0 95 \u20ac "
            "(neuf 320 \u20ac). L'acheteuse paie 95 \u20ac + 4,85 \u20ac protection. Vinted pr\u00e9l\u00e8ve "
            "une commission ; la vendeuse re\u00e7oit 82 \u20ac. L'acheteuse valorise : \u00e9conomie "
            "225 \u20ac, mode circulaire, livraison relais sous 4 jours. Note 4,9/5. R\u00e9achat mode "
            "42 % \u00e0 12 mois. La valeur per\u00e7ue d\u00e9passe le prix (raret\u00e9, simplicit\u00e9, "
            "impact environnemental)."
        ),
        consigne=(
            "Explique en quoi la transaction cr\u00e9e de la valeur pour le client et pour Vinted. "
            "Distingue valeur cr\u00e9\u00e9e et valeur capt\u00e9e."
        ),
        questions=[
            "D\u00e9finis la cr\u00e9ation de valeur dans une relation commerciale.",
            "Quels \u00e9l\u00e9ments du support augmentent la valeur per\u00e7ue pour l'acheteuse ?",
            "Comment Vinted capture une partie de la valeur cr\u00e9\u00e9e ?",
        ],
        correction=(
            "1) Cr\u00e9ation de valeur :\n"
            "Proposer un produit ou service r\u00e9pondant aux besoins du client tout en g\u00e9n\u00e9rant "
            "des flux permettant la rentabilit\u00e9 de l'entreprise.\n\n"
            "2) Valeur per\u00e7ue par le client :\n"
            f"{D}\u00c9conomie : 320 \u20ac neuf vs 95 \u20ac occasion.\n"
            f"{D}Mode circulaire et impact environnemental.\n"
            f"{D}Service : protection acheteur, livraison relais, simplicit\u00e9.\n\n"
            "3) Capture de valeur par Vinted :\n"
            f"{D}Commission et frais protection sur la transaction.\n"
            f"{D}La vendeuse capture 82 \u20ac ; Vinted mon\u00e9tise son r\u00f4le d'interm\u00e9diaire.\n"
            f"{D}Effet volume : 42 % de r\u00e9achat alimente le mod\u00e8le."
        ),
        attendu="Distinction valeur cr\u00e9\u00e9e / capt\u00e9e, \u00e9l\u00e9ments du support exploit\u00e9s.",
        notions=["cr\u00e9ation de valeur", "valeur per\u00e7ue", "valeur capt\u00e9e"],
    ),
    I(
        "e3",
        "Innovation produit : Amazon Echo Show",
        support=(
            "Amazon lance en 2025 la nouvelle g\u00e9n\u00e9ration Echo Show : \u00e9cran tactile 10 pouces, "
            "assistant Alexa am\u00e9lior\u00e9, reconnaissance gestuelle, hub domotique int\u00e9gr\u00e9. "
            "Prix : 169 \u20ac (contre 139 \u20ac pour l'ancien mod\u00e8le). Apr\u00e8s six mois : "
            "+22 % de ventes sur la gamme Echo en Europe, satisfaction 4,6/5. L'investissement R&D "
            "s'\u00e9l\u00e8ve \u00e0 180 M€. Amazon qualifie cette \u00e9volution d'innovation "
            "produit inc\u00e9mentale : m\u00eame famille de produits enrichie de nouvelles fonctionnalit\u00e9s "
            "sans rupture radicale du concept enceinte connect\u00e9e."
        ),
        consigne=(
            "Analyse l'innovation produit d\u00e9ploy\u00e9e par Amazon. Distingue innovation de "
            "nouveaux produits et am\u00e9lioration de produits existants."
        ),
        questions=[
            "Qu'est-ce qu'une innovation de produit ? Pr\u00e9sente les formes distingu\u00e9es dans le cours.",
            "De quel type d'innovation rel\u00e8ve le nouvel Echo Show ? Justifie.",
            "Quels effets sur la performance commerciale identifies-tu ?",
        ],
        correction=(
            "1) Innovation de produit :\n"
            "Nouveau produit, am\u00e9lioration d'un produit existant ou int\u00e9gration de services "
            "\u00e0 l'offre de biens.\n\n"
            "2) Type d'innovation Echo Show :\n"
            f"{D}Am\u00e9lioration inc\u00e9mentale : m\u00eame gamme Echo, fonctionnalit\u00e9s enrichies.\n"
            f"{D}Int\u00e9gration de services : Alexa, domotique, reconnaissance gestuelle.\n"
            f"{D}Pas un produit totalement nouveau mais offre nettement am\u00e9lior\u00e9e.\n\n"
            "3) Effets commerciaux :\n"
            f"{D}+22 % de ventes Echo en Europe.\n"
            f"{D}Satisfaction 4,6/5 ; prix premium accept\u00e9 (169 vs 139 \u20ac).\n"
            f"{D}Investissement R&D 180 M€ amorti par le volume."
        ),
        attendu="Typologie innovation produit ma\u00eetrisee, jugement argument\u00e9 sur Echo Show.",
        notions=["innovation produit", "innovation incr\u00e9mentale", "R&D"],
    ),
    I(
        "e4",
        "Innovation de mod\u00e8le \u00e9conomique chez Blablacar",
        support=(
            "Blablacar diversifie son mod\u00e8le depuis 2023. Activit\u00e9 historique : commission "
            "covoiturage (12 %). Nouveaut\u00e9s : BlaBlaCar Daily (navettes B2B, abonnement entreprises), "
            "Blablacar Bus (lignes r\u00e9guli\u00e8res, commission billet). En 2024 : covoiturage 68 % "
            "du CA, Daily 22 %, Bus 10 %. Comparaison avec Air France/Transavia : plusieurs BM "
            "coexistent pour segments diff\u00e9rents. Investisseurs questionnent coh\u00e9rence B2C/B2B."
        ),
        consigne=(
            "Explique l'int\u00e9r\u00eat et les limites de la diversification des mod\u00e8les \u00e9conomiques "
            "pour Blablacar. Mobilise la notion d'innovation de mod\u00e8le \u00e9conomique."
        ),
        questions=[
            "Qu'est-ce qu'une innovation de mod\u00e8le \u00e9conomique ?",
            "Identifie les diff\u00e9rents mod\u00e8les \u00e9conomiques coexistent chez Blablacar.",
            "Quels avantages et limites de cette diversification ?",
        ],
        correction=(
            "1) Innovation de mod\u00e8le \u00e9conomique :\n"
            "Adapter le mod\u00e8le en le proposant \u00e0 un autre public, en le pr\u00e9sentant "
            "diff\u00e9remment ou en d\u00e9mocratisant son acc\u00e8s.\n\n"
            "2) Mod\u00e8les coexistent :\n"
            f"{D}Covoiturage B2C : commission 12 % sur trajets particuliers.\n"
            f"{D}Daily B2B : abonnement entreprises navettes.\n"
            f"{D}Bus : commission sur lignes r\u00e9guli\u00e8res partenaires.\n\n"
            "3) Avantages et limites :\n"
            f"{D}Avantages : relais de croissance, cibles diff\u00e9rentes, revenus diversifi\u00e9s.\n"
            f"{D}Limites : complexit\u00e9 op\u00e9rationnelle, BM historique encore dominant (68 %).\n"
            f"{D}Risque de cannibalisation entre covoiturage et bus."
        ),
        attendu="Innovation de BM d\u00e9finie, cartographie des revenus, analyse avantages/limites.",
        notions=["innovation de mod\u00e8le \u00e9conomique", "diversification", "sources de revenus"],
    ),
    I(
        "e5",
        "Mod\u00e8le freemium chez Airbnb",
        support=(
            "Airbnb propose un parcours freemium pour les h\u00f4tes depuis 2024. Gratuit : annonce "
            "basique, commission 3 % h\u00f4te + 14 % voyageur. Payant Airbnb Plus (49 \u20ac/mois) : "
            "photos pro, badge qualit\u00e9, stats avanc\u00e9es, priorit\u00e9. Fin 2024 : 7,7 M h\u00f4tes, "
            "420 000 Plus (conversion 5,5 %). CAC h\u00f4te gratuit 38 \u20ac ; LTV Plus 24 mois "
            "1 176 \u20ac hors commissions. Effet de r\u00e9seau : volume massif d'annonces gratuites "
            "n\u00e9cessaire pour attirer voyageurs."
        ),
        consigne=(
            "Analyse le mod\u00e8le freemium d'Airbnb : logique de gratuit\u00e9, transformation "
            "en clients payants, ad\u00e9quation avec la transformation num\u00e9rique."
        ),
        questions=[
            "D\u00e9finis le mod\u00e8le \u00e9conomique freemium et ses contraintes.",
            "Comment Airbnb transforme-t-elle les h\u00f4tes gratuits en abonn\u00e9s Plus ?",
            "Pourquoi ce mod\u00e8le est-il adapt\u00e9 \u00e0 une plateforme num\u00e9rique ?",
        ],
        correction=(
            "1) Mod\u00e8le freemium :\n"
            "Produit gratuit pour attirer un grand nombre d'utilisateurs, puis transformation "
            "en clients via une offre payante enrichie. Contrainte : volume d'utilisateurs n\u00e9cessaire.\n\n"
            "2) Transformation Airbnb :\n"
            f"{D}Gratuit : inscription, annonce basique, commission standard.\n"
            f"{D}Payant Plus : photos pro, badge, stats, r\u00e9f\u00e9rencement prioritaire.\n"
            f"{D}Conversion 5,5 % ; LTV Plus 1 176 \u20ac vs CAC 38 \u20ac.\n\n"
            "3) Ad\u00e9quation num\u00e9rique :\n"
            f"{D}Effet de r\u00e9seau : annonces gratuites attirent voyageurs.\n"
            f"{D}Co\u00fbt marginal faible de l'inscription en ligne.\n"
            f"{D}Grand volume requis (7,7 M h\u00f4tes) pour performance du mod\u00e8le."
        ),
        attendu="Freemium d\u00e9fini, m\u00e9canisme de conversion illustr\u00e9, lien avec le num\u00e9rique.",
        notions=["freemium", "mod\u00e8le \u00e9conomique num\u00e9rique", "effet de r\u00e9seau"],
    ),
    I(
        "e6",
        "Mod\u00e8le plateforme et commission transactionnelle chez Booking.com",
        support=(
            "Booking.com incarne un mod\u00e8le \u00e9conomique de plateforme : elle ne poss\u00e8de pas "
            "d'h\u00f4tels mais met en relation voyageurs et \u00e9tablissements (plus de 28 millions "
            "de listings). Chaque r\u00e9servation g\u00e9n\u00e8re une commission de 10 \u00e0 25 % "
            "pay\u00e9e par l'h\u00f4telier. En 2024 : 1,1 Md de nuit\u00e9es r\u00e9serv\u00e9es, "
            "CA 17,1 Md€. Co\u00fbts fixes : marketing digital, SI, 22 000 salari\u00e9s. "
            "La transformation num\u00e9rique permet la mise en relation \u00e0 grande \u00e9chelle "
            "sans immobilier h\u00f4telier. Risque 2025 : d\u00e9pendance aux commissions et "
            "r\u00e9gulation europ\u00e9enne sur les plateformes."
        ),
        consigne=(
            "Caract\u00e9rise le mod\u00e8le \u00e9conomique de plateforme de Booking.com. Explique comment "
            "la transformation num\u00e9rique a permis son d\u00e9veloppement."
        ),
        questions=[
            "Qu'est-ce qu'un mod\u00e8le \u00e9conomique de plateforme ?",
            "Comment Booking.com g\u00e9n\u00e8re-t-elle ses revenus sans poss\u00e9der d'h\u00f4tels ?",
            "Quels avantages et risques de ce mod\u00e8le dans le contexte du support ?",
        ],
        correction=(
            "1) Mod\u00e8le plateforme :\n"
            "Mise en relation acheteurs et vendeurs ; r\u00e9mun\u00e9ration par commission "
            "sur les transactions. Pas de d\u00e9tention du stock ni de production du service.\n\n"
            "2) G\u00e9n\u00e9ration de revenus :\n"
            f"{D}Commission 10-25 % sur 1,1 Md de nuit\u00e9es.\n"
            f"{D}CA 17,1 Md€ sans co\u00fbt d'immobilier h\u00f4telier.\n"
            f"{D}Co\u00fbts fixes marketing/SI/salaires \u00e0 couvrir par le volume.\n\n"
            "3) Avantages et risques :\n"
            f"{D}Avantages : scalabilit\u00e9, effet de r\u00e9seau, pas de stock.\n"
            f"{D}Risques : d\u00e9pendance commission, r\u00e9gulation UE, concurrence directe h\u00f4teliers."
        ),
        attendu="Mod\u00e8le plateforme caract\u00e9ris\u00e9, m\u00e9canisme commission expliqu\u00e9.",
        notions=["plateforme", "commission", "transformation num\u00e9rique"],
    ),
    I(
        "e7",
        "Mesurer la cr\u00e9ation de valeur : VA et r\u00e9sultat chez SNCF Connect",
        support=(
            "SNCF Connect (application de r\u00e9servation SNCF Voyageurs) publie son compte de r\u00e9sultat "
            "2024 simplifi\u00e9. Chiffre d'affaires : 890 M\u20ac (commissions, services digitaux, "
            "partenariats). Consommations interm\u00e9diaires (h\u00e9bergement cloud, paiement, API) : "
            "210 M\u20ac. Masse salariale : 320 M\u20ac. Autres charges d'exploitation : 185 M\u20ac. "
            "Dotations amortissements : 45 M\u20ac. R\u00e9sultat d'exploitation : 130 M\u20ac. "
            "Les investisseurs demandent la valeur ajout\u00e9e comme indicateur de richesse cr\u00e9\u00e9e "
            "par l'activit\u00e9 digitale du groupe ferroviaire."
        ),
        consigne=(
            "Calcule la valeur ajout\u00e9e et le r\u00e9sultat d'exploitation de SNCF Connect. "
            "Explique ce que mesurent ces indicateurs de cr\u00e9ation de valeur."
        ),
        questions=[
            "Qu'est-ce que la valeur ajout\u00e9e et comment la calcule-t-on ?",
            "Calcule la VA et v\u00e9rifie le r\u00e9sultat d'exploitation \u00e0 partir des donn\u00e9es.",
            "Que montre le r\u00e9sultat d'exploitation positif pour SNCF Connect ?",
        ],
        correction=(
            "1) Valeur ajout\u00e9e :\n"
            "VA = CA \u2212 consommations interm\u00e9diaires. Mesure le suppl\u00e9ment de richesse "
            "cr\u00e9\u00e9 par l'activit\u00e9 de l'entreprise.\n\n"
            "2) Calculs SNCF Connect :\n"
            f"{D}VA = 890 \u2212 210 = 680 M\u20ac.\n"
            f"{D}R\u00e9sultat d'exploitation = 680 \u2212 320 \u2212 185 \u2212 45 = 130 M\u20ac (v\u00e9rifi\u00e9).\n\n"
            "3) Interpr\u00e9tation :\n"
            f"{D}VA positive : activit\u00e9 digitale cr\u00e9e de la richesse.\n"
            f"{D}R\u00e9sultat d'exploitation 130 M\u20ac : activit\u00e9 rentable avant charges financi\u00e8res.\n"
            f"{D}Compl\u00e9te l'analyse du BM num\u00e9rique du groupe SNCF."
        ),
        attendu="Formules correctes, calculs justifi\u00e9s, interpr\u00e9tation \u00e9conomique.",
        notions=["valeur ajout\u00e9e", "r\u00e9sultat d'exploitation", "compte de r\u00e9sultat"],
    ),
    I(
        "e8",
        "Rentabilit\u00e9 \u00e9conomique et valeur patrimoniale chez Uber",
        support=(
            "Uber Technologies publie au 31/12/2024 : actif total 38,2 Md€, dettes 22,1 Md€, "
            "capitaux propres 16,1 Md€. R\u00e9sultat d'exploitation 2024 : 2,8 Md€. "
            "Endettement financier net : 8,4 Md€. Capitaux engag\u00e9s : 16,1 + 8,4 = 24,5 Md€. "
            "Valeur patrimoniale = actif \u2212 dettes = 16,1 Md€. Rentabilit\u00e9 \u00e9conomique "
            "= r\u00e9sultat d'exploitation / capitaux engag\u00e9s = 11,4 %. Le board compare "
            "avec Lyft (RE 4,2 %) pour \u00e9valuer la performance relative du mod\u00e8le plateforme "
            "mobilit\u00e9 + livraison."
        ),
        consigne=(
            "Calcule et interpr\u00e8te la valeur patrimoniale et la rentabilit\u00e9 \u00e9conomique "
            "d'Uber. Explique leur r\u00f4le dans la mesure de la cr\u00e9ation de valeur."
        ),
        questions=[
            "Comment calcule-t-on la valeur patrimoniale et que repr\u00e9sente-t-elle ?",
            "Calcule la rentabilit\u00e9 \u00e9conomique d'Uber et interpr\u00e8te le r\u00e9sultat.",
            "Pourquoi Uber performe-t-elle mieux que Lyft selon le support ?",
        ],
        correction=(
            "1) Valeur patrimoniale :\n"
            "VP = Actif \u2212 Dettes = 38,2 \u2212 22,1 = 16,1 Md€. Valeur financi\u00e8re nette "
            "de l'entreprise (capitaux propres).\n\n"
            "2) Rentabilit\u00e9 \u00e9conomique :\n"
            f"{D}RE = 2,8 / 24,5 = 11,4 %.\n"
            f"{D}Uber cr\u00e9e de la valeur : chaque euro investi g\u00e9n\u00e8re 11,4 centimes.\n\n"
            "3) Comparaison Lyft :\n"
            f"{D}Uber RE 11,4 % > Lyft 4,2 % : meilleure utilisation des capitaux.\n"
            f"{D}Effet d'\u00e9chelle plateforme (mobilit\u00e9 + Uber Eats) renforce la rentabilit\u00e9."
        ),
        attendu="Calculs exacts, interpr\u00e9tation \u00e9conomique, comparaison concurrentielle.",
        notions=["valeur patrimoniale", "rentabilit\u00e9 \u00e9conomique", "indicateurs financiers"],
    ),
    I(
        "e9",
        "Comparaison des mod\u00e8les \u00e9conomiques num\u00e9riques chez Doctolib",
        support=(
            "Doctolib compare quatre mod\u00e8les num\u00e9riques pour ses services 2026. Gratuit\u00e9/publicit\u00e9 "
            "(type Google) : refus\u00e9 (image m\u00e9dicale). Freemium : agenda gratuit pour m\u00e9decins, "
            "abonnement Doctolib Pro 129 \u20ac/mois (t\u00e9l\u00e9consultation, stats). Low-cost : "
            "peu adapt\u00e9 \u00e0 la sant\u00e9. Plateforme : commission sur t\u00e9l\u00e9consultations "
            "partenaires (8 %). En 2024 : 80 % du CA via abonnements Pro, 20 % services compl\u00e9mentaires. "
            "90 millions de patients, 340 000 praticiens. Doctolib teste un partenariat data anonymis\u00e9e "
            "recherche m\u00e9dicale (2 M\u20ac/an) sans publicit\u00e9 patient."
        ),
        consigne=(
            "Compare les quatre mod\u00e8les \u00e9conomiques num\u00e9riques du cours et \u00e9value "
            "la pertinence de chacun pour Doctolib."
        ),
        questions=[
            "Pr\u00e9sente les quatre mod\u00e8les \u00e9conomiques li\u00e9s \u00e0 la transformation num\u00e9rique.",
            "Pourquoi Doctolib rejette-t-elle le mod\u00e8le gratuit\u00e9/publicit\u00e9 ?",
            "Quel mod\u00e8le domine et comment Doctolib peut-elle faire \u00e9voluer son BM ?",
        ],
        correction=(
            "1) Quatre mod\u00e8les num\u00e9riques :\n"
            f"{D}Gratuit\u00e9/publicit\u00e9 : contenu gratuit, revenus pub et donn\u00e9es.\n"
            f"{D}Freemium : gratuit + premium payant.\n"
            f"{D}Low-cost : offre \u00e9pur\u00e9e, prix bas.\n"
            f"{D}Plateforme : mise en relation, commission.\n\n"
            "2) Rejet publicit\u00e9 Doctolib :\n"
            f"{D}Image m\u00e9dicale et confiance patient incompatible avec la pub.\n"
            f"{D}Test limit\u00e9 : data anonymis\u00e9e recherche (2 M\u20ac), pas de pub patient.\n\n"
            "3) \u00c9volution du BM :\n"
            f"{D}Dominant : freemium Pro (80 % CA) + plateforme t\u00e9l\u00e9consultation.\n"
            f"{D}BM \u00e9volutif : services compl\u00e9mentaires sans figer le mod\u00e8le."
        ),
        attendu="Quatre mod\u00e8les pr\u00e9sent\u00e9s, choix Doctolib justifi\u00e9, \u00e9volution argument\u00e9e.",
        notions=["gratuit\u00e9", "freemium", "low-cost", "plateforme"],
    ),
    I(
        "e10",
        "Synth\u00e8se : \u00e9volution du business model chez Stripe",
        support=(
            "R\u00e9capitulatif Stripe 2011-2025. Phase 1 : API paiement en ligne pour startups "
            "(commission 2,9 % + 0,30 \u20ac/transaction). Phase 2 : Stripe Connect (marketplaces), "
            "Stripe Billing (abonnements), CA 14 Md€ en 2023. Phase 3 (2024-2025) : Stripe Treasury "
            "(comptes entreprises), Stripe Issuing (cartes), diversification B2B. Indicateurs : "
            "GMV 1 400 Md€, NPS d\u00e9veloppeurs 72, RE estim\u00e9e 18 %. Menaces : PayPal, "
            "Adyen, r\u00e9gulation fintech. Le BM n'est pas fig\u00e9 : innovation produit ET "
            "mod\u00e8le comme moteur de croissance."
        ),
        consigne=(
            "R\u00e9dige une synth\u00e8se structur\u00e9e de l'\u00e9volution du business model de Stripe "
            "et des indicateurs de cr\u00e9ation de valeur mobilis\u00e9s."
        ),
        questions=[
            "Retrace les trois phases d'\u00e9volution du BM de Stripe.",
            "Quels indicateurs financiers et qualitatifs mesurent la cr\u00e9ation de valeur ?",
            "Quels d\u00e9fis futurs et quelle place pour l'innovation dans le BM ?",
        ],
        correction=(
            "1) Trois phases :\n"
            f"{D}2011-2016 : BM plateforme paiement pur, commission transactionnelle.\n"
            f"{D}2017-2023 : diversification Connect/Billing, CA 14 Md€.\n"
            f"{D}2024-2025 : services financiers B2B (Treasury, Issuing).\n\n"
            "2) Indicateurs cr\u00e9ation de valeur :\n"
            f"{D}Financiers : CA, RE 18 %, GMV 1 400 Md€.\n"
            f"{D}Qualitatifs : NPS d\u00e9veloppeurs 72, adoption API.\n\n"
            "3) D\u00e9fis et innovation :\n"
            f"{D}Concurrence PayPal/Adyen, r\u00e9gulation fintech.\n"
            f"{D}BM \u00e9volutif : innovation produit et mod\u00e8le indispensable."
        ),
        attendu="Synth\u00e8se chronologique, indicateurs vari\u00e9s, perspective strat\u00e9gique.",
        notions=["business model", "cr\u00e9ation de valeur", "innovation", "indicateurs de performance"],
    ),
    I(
        "cas1",
        "\u00c9tude de cas : Accor face \u00e0 la concurrence digitale",
        support=(
            "Juin 2025 : Booking.com augmente sa commission sur h\u00f4tels Accor (+2 points). Airbnb "
            "d\u00e9veloppe s\u00e9jours longue dur\u00e9e. Expedia propose -15 % en direct. Accor "
            "ne peut pas mener une guerre des prix OTA. Veille : 58 % clients choisissent Accor pour "
            "qualit\u00e9, 44 % fid\u00e9lit\u00e9 ALL, 19 % prix. T2 2025 : RevPAR +2 % (vs +8 % T1), "
            "NPS 61. Options : (A) baisser tarifs ; (B) app ALL + direct ; (C) B2B ; (D) partenariats. "
            "VA trim. 890 M\u20ac, RE 9,2 %."
        ),
        consigne=(
            "Tu conseilles Accor. Structure : (1) menace concurrentielle, (2) attentes clients, "
            "(3) chiffres, (4) option recommand\u00e9e (A-D)."
        ),
        questions=[
            "Analyse la menace des OTA (Booking, Airbnb, Expedia) sur le BM d'Accor.",
            "\u00c9value la r\u00e9ponse strat\u00e9gique possible d'Accor face \u00e0 cette pression.",
            "Interpr\u00e8te l'\u00e9volution du RevPAR et du NPS au T2 2025.",
            "Quelle option recommandes-tu ? Pourquoi ?",
        ],
        correction=(
            "1) Menace OTA :\n"
            f"{D}Commissions Booking en hausse r\u00e9duisent la marge h\u00f4teli\u00e8re.\n"
            f"{D}Airbnb et Expedia captent des segments diff\u00e9rents.\n"
            f"{D}Risque de d\u00e9pendance aux plateformes tierces.\n\n"
            "2) R\u00e9ponse strat\u00e9gique :\n"
            f"{D}Diff\u00e9renciation service et fid\u00e9lit\u00e9 ALL plut\u00f4t que guerre des prix.\n"
            f"{D}R\u00e9servation directe via app pour r\u00e9duire commissions.\n\n"
            "3) Indicateurs T2 :\n"
            f"{D}RevPAR +2 % vs +8 % T1 : ralentissement, pression concurrentielle.\n"
            f"{D}NPS 61 : satisfaction correcte mais vigilance.\n\n"
            "4) Recommandation :\n"
            "Option B (app ALL + direct) compl\u00e9t\u00e9e de C (B2B). \u00c9viter guerre des prix (A). "
            "Renforcer proposition de valeur au-del\u00e0 du prix."
        ),
        attendu="Concurrence typ\u00e9e, attentes clients, indicateurs lus, choix argument\u00e9.",
        notions=["business model", "plateforme", "cr\u00e9ation de valeur", "concurrence"],
    ),
    I(
        "cas2",
        "\u00c9tude de cas : Valorisation et BM chez Michelin",
        support=(
            "Michelin pr\u00e9sente \u00ab Beyond Tyres \u00bb aux investisseurs 2025. BM : pneus premium "
            "(s\u00e9curit\u00e9/durabilit\u00e9), services mobilit\u00e9 Fleet (commission + abonnement). "
            "Pr\u00e9visions 2025-2027 : CA 28,5 \u2192 32,1 Md€ ; VA 9,8 \u2192 11,2 Md€ ; "
            "r\u00e9sultat net 2,1 \u2192 2,7 Md€. VP 18,4 Md€, RE 12,8 %. Scepticisme : "
            "d\u00e9pendance pneus (72 % CA), concurrence chinoise. Atouts : innovation proc\u00e9d\u00e9s, "
            "NPS fleet 68, mobilit\u00e9 durable +12 %/an."
        ),
        consigne=(
            "Analyse le dossier Michelin en mobilisant les notions du chapitre 2 : BM, cr\u00e9ation "
            "de valeur, indicateurs financiers, innovation de mod\u00e8le."
        ),
        questions=[
            "Pr\u00e9sente le business model de Michelin selon les trois composantes du cours.",
            "Analyse les indicateurs de cr\u00e9ation de valeur (VA, RE, valeur patrimoniale).",
            "Quels arguments sur l'innovation de mod\u00e8le \u00ab Beyond Tyres \u00bb ?",
            "Michelin cr\u00e9e-t-elle de la valeur durable selon toi ? Argumente.",
        ],
        correction=(
            "1) Business model :\n"
            f"{D}Proposition de valeur : pneus premium s\u00e9curit\u00e9/durabilit\u00e9 + services fleet.\n"
            f"{D}M\u00e9canisme : usines, R&D, r\u00e9seau distribution, plateformes digitales.\n"
            f"{D}Rentabilit\u00e9 : ventes pneus + abonnements services, RE 12,8 %.\n\n"
            "2) Indicateurs :\n"
            f"{D}VA croissante (9,8 \u2192 11,2 Md€) : richesse cr\u00e9\u00e9e en hausse.\n"
            f"{D}RE 12,8 % : bonne performance \u00e9conomique.\n"
            f"{D}VP 18,4 Md€ : base patrimoniale solide.\n\n"
            "3) Innovation BM Beyond Tyres :\n"
            f"{D}Diversification services mobilit\u00e9 r\u00e9duit d\u00e9pendance pneus.\n"
            f"{D}Mod\u00e8le mixte produit + service + commission.\n\n"
            "4) Synth\u00e8se valorisation :\n"
            "Cr\u00e9ation de valeur mesurable et durable si diversification r\u00e9ussie. "
            "Risque : concurrence low-cost et lenteur transition services (28 % CA hors pneus vis\u00e9)."
        ),
        attendu="Dossier analys\u00e9 avec notions chapitre 2, synth\u00e8se valorisation argument\u00e9e.",
        notions=["business model", "valeur ajout\u00e9e", "rentabilit\u00e9 \u00e9conomique", "valorisation"],
    ),
]
