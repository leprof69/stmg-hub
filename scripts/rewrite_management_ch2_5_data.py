# -*- coding: utf-8 -*-
"""Exercise data for Management chapters 2-5 (SDGN quality)."""
D = "\u2014 "


def I(sid, title, **body):
    return {"sid": sid, "title": title, "body": body}

CH2 = [
    I(
        "e1",
        "Les trois composantes du mod\u00e8le \u00e9conomique d'Artisana",
        support=(
            "Artisana est une marketplace fran\u00e7aise d'artisanat cr\u00e9\u00e9e en 2022 \u00e0 Lyon par "
            "Cl\u00e9mence Roux et Mehdi Benali. La plateforme met en relation 2 400 artisans ind\u00e9pendants "
            "(c\u00e9ramistes, maroquiniers, \u00e9b\u00e9nistes) et 186 000 acheteurs actifs fin 2024. "
            "La proposition de valeur repose sur la d\u00e9couverte d'objets uniques, la tra\u00e7abilit\u00e9 "
            "de l'artisan et une livraison soign\u00e9e sous cinq jours. Artisana pr\u00e9l\u00e8ve une "
            "commission de 15 % sur chaque vente et propose l'abonnement \u00ab Vitrine Pro \u00bb \u00e0 "
            "39 \u20ac par mois (photos professionnelles, r\u00e9f\u00e9rencement prioritaire, statistiques "
            "de vente). Pour produire cette offre, la soci\u00e9t\u00e9 mobilise 28 salari\u00e9s (d\u00e9veloppeurs, "
            "mod\u00e9ration, logistique partenaire), un algorithme de recommandation et des partenaires "
            "externes (photographes, transporteurs DPD). En 2024, le chiffre d'affaires atteint 4,8 M\u20ac "
            "pour un r\u00e9sultat d'exploitation pr\u00e9visionnel de 620 000 \u20ac. Les fondateurs pr\u00e9parent "
            "une lev\u00e9e de fonds en pr\u00e9sentant leur business model \u00e0 des investisseurs parisiens "
            "en mars 2025."
        ),
        consigne=(
            "Analyse le mod\u00e8le \u00e9conomique (business model) d'Artisana en mobilisant les trois "
            "composantes du cours : proposition de valeur, m\u00e9canisme de cr\u00e9ation de valeur, "
            "mode de g\u00e9n\u00e9ration des revenus."
        ),
        questions=[
            "Qu'est-ce qu'un mod\u00e8le \u00e9conomique ? Pr\u00e9sente les trois composantes \u00e0 distinguer.",
            "Identifie dans le support la proposition de valeur d'Artisana (qui ? quoi ? \u00e0 quel prix ?).",
            "D\u00e9cris le m\u00e9canisme de cr\u00e9ation de valeur et les sources de revenus de la plateforme.",
        ],
        correction=(
            "1) Mod\u00e8le \u00e9conomique :\n"
            "Le business model d\u00e9crit comment une organisation fonctionne et gagne de l'argent. "
            "Il comprend trois composantes : la proposition de valeur (offre, clients, prix), "
            "le m\u00e9canisme de cr\u00e9ation de valeur (activit\u00e9s, ressources, partenaires) "
            "et la rentabilit\u00e9 (revenus, co\u00fbts, profit).\n\n"
            "2) Proposition de valeur Artisana :\n"
            f"{D}Clients : acheteurs recherchant de l'artisanat authentique et artisans ind\u00e9pendants.\n"
            f"{D}Offre : marketplace, tra\u00e7abilit\u00e9, livraison soign\u00e9e, visibilit\u00e9 digitale.\n"
            f"{D}Prix : commission 15 % sur ventes + abonnement Vitrine Pro 39 \u20ac/mois.\n\n"
            "3) M\u00e9canisme et revenus :\n"
            f"{D}Ressources internes : plateforme, algorithmes, \u00e9quipe de 28 salari\u00e9s.\n"
            f"{D}Partenaires externes : photographes, DPD (r\u00e9seau de valeur).\n"
            f"{D}Revenus diversifi\u00e9s : commissions transactionnelles + abonnements r\u00e9currents.\n"
            f"{D}Rentabilit\u00e9 vis\u00e9e : r\u00e9sultat d'exploitation 620 000 \u20ac pour 4,8 M\u20ac de CA."
        ),
        attendu="Trois composantes du BM identifi\u00e9es et illustr\u00e9es avec pr\u00e9cision sur Artisana.",
        notions=["mod\u00e8le \u00e9conomique", "proposition de valeur", "business model"],
    ),
    I(
        "e2",
        "Cr\u00e9ation de valeur pour le client sur la marketplace",
        support=(
            "En octobre 2024, l'artisan c\u00e9ramiste \u00ab Atelier Lune \u00bb (Dr\u00f4me) vend un vase "
            "en gr\u00e8s \u00e9maill\u00e9 via Artisana au prix public de 85 \u20ac. L'artisan per\u00e7oit "
            "68 \u20ac apr\u00e8s commission ; Artisana encaisse 12,75 \u20ac et finance la prise de vue, "
            "l'assurance colis et le SAV. L'acheteuse, \u00c9lodie Martin (Bordeaux), explique son achat : "
            "l'objet est unique, l'histoire de l'artisan est visible sur la fiche produit, la livraison "
            "emball\u00e9e main renforce le sentiment de cadeau premium, et elle souhaite soutenir "
            "l'\u00e9conomie locale. Un vase similaire industriel co\u00fbte 35 \u20ac sur une grande "
            "surface, mais sans personnalisation ni lien avec le cr\u00e9ateur. Artisana mesure la "
            "satisfaction post-achat : note moyenne 4,7/5 sur cette cat\u00e9gorie, taux de r\u00e9achat "
            "de 38 % \u00e0 douze mois. Le directeur marketing estime que la valeur per\u00e7ue d\u00e9passe "
            "le prix pay\u00e9 gr\u00e2ce \u00e0 la raret\u00e9, au storytelling et au service."
        ),
        consigne=(
            "Explique en quoi la transaction cr\u00e9e de la valeur pour le client et pour Artisana. "
            "Distingue valeur cr\u00e9\u00e9e et valeur capt\u00e9e."
        ),
        questions=[
            "D\u00e9finis la cr\u00e9ation de valeur dans une relation commerciale.",
            "Quels \u00e9l\u00e9ments du support augmentent la valeur per\u00e7ue pour \u00c9lodie Martin ?",
            "Comment Artisana capture une partie de la valeur cr\u00e9\u00e9e ? Compare avec l'offre industrielle.",
        ],
        correction=(
            "1) Cr\u00e9ation de valeur :\n"
            "Cr\u00e9er de la valeur, c'est proposer un produit ou service susceptible de r\u00e9pondre "
            "aux besoins du client/usager en g\u00e9n\u00e9rant des flux permettant la rentabilit\u00e9 "
            "ou la couverture des co\u00fbts.\n\n"
            "2) Valeur per\u00e7ue par le client :\n"
            f"{D}Unicit\u00e9 et raret\u00e9 de l'objet artisanal.\n"
            f"{D}Storytelling : visibilit\u00e9 de l'artisan et lien \u00e9motionnel.\n"
            f"{D}Service premium : emballage soign\u00e9, livraison, SAV.\n"
            f"{D}Dimension \u00e9thique : soutien \u00e0 l'\u00e9conomie locale.\n"
            "Le client paie 85 \u20ac alors qu'un substitut industriel co\u00fbte 35 \u20ac : "
            "l'\u00e9cart traduit la valeur ajout\u00e9e per\u00e7ue.\n\n"
            "3) Capture de valeur par Artisana :\n"
            f"{D}Commission 12,75 \u20ac + services associ\u00e9s (photo, assurance).\n"
            f"{D}L'artisan capture 68 \u20ac ; la plateforme mon\u00e9tise son r\u00f4le d'interm\u00e9diaire.\n"
            f"{D}L'offre industrielle cr\u00e9e moins de valeur relationnelle et symbolique."
        ),
        attendu="Distinction valeur cr\u00e9\u00e9e / capt\u00e9e, \u00e9l\u00e9ments du support exploit\u00e9s.",
        notions=["cr\u00e9ation de valeur", "valeur per\u00e7ue", "valeur capt\u00e9e"],
    ),
    I(
        "e3",
        "Innovation produit : l'offre Sur mesure Artisana",
        support=(
            "En janvier 2025, Artisana lance \u00ab Sur mesure \u00bb : l'acheteur choisit gravure, "
            "couleurs et dimensions sur 120 r\u00e9f\u00e9rences \u00e9ligibles (maroquinerie, bijoux, "
            "d\u00e9coration). L'artisan valide faisabilit\u00e9 sous 48 h via l'interface. R\u00e9sultats "
            "apr\u00e8s six mois : panier moyen en hausse de 28 % (de 62 \u20ac \u00e0 79 \u20ac), "
            "taux de marge artisanale stable, d\u00e9lai moyen de fabrication port\u00e9 \u00e0 12 jours "
            "(contre 5 en catalogue standard). L'investissement SI (configurateur 3D, workflow de "
            "validation) s'\u00e9l\u00e8ve \u00e0 95 000 \u20ac, amorti sur trois ans. 340 artisans "
            "ont adh\u00e9r\u00e9 ; 18 % des ventes T2 2025 passent par cette offre. Les concurrents "
            "Etsy et Amazon Handmade proposent la personnalisation mais sans configurateur int\u00e9gr\u00e9 "
            "ni validation artisan syst\u00e9matique. La direction qualifie cette \u00e9volution d'innovation "
            "produit inc\u00e9mentale enrichissant l'offre existante sans rupture radicale."
        ),
        consigne=(
            "Analyse l'innovation produit d\u00e9ploy\u00e9e par Artisana. Distingue innovation de "
            "nouveaux produits, am\u00e9lioration de produits existants et int\u00e9gration de services."
        ),
        questions=[
            "Qu'est-ce qu'une innovation de produit ? Pr\u00e9sente les formes distingu\u00e9es dans le cours.",
            "De quel type d'innovation produit rel\u00e8ve l'offre Sur mesure ? Justifie.",
            "Quels effets sur la performance commerciale et quelles limites identifies-tu ?",
        ],
        correction=(
            "1) Innovation de produit :\n"
            "L'innovation peut porter sur le bien ou le service : nouveau produit, am\u00e9lioration "
            "d'un produit existant, ou int\u00e9gration de services \u00e0 l'offre de biens.\n\n"
            "2) Type d'innovation Sur mesure :\n"
            f"{D}Am\u00e9lioration inc\u00e9mentale du catalogue (pas un produit totalement nouveau).\n"
            f"{D}Int\u00e9gration de services : configurateur, validation artisan, suivi d\u00e9lai.\n"
            f"{D}Enrichissement des caract\u00e9ristiques sans remettre en cause la marketplace.\n\n"
            "3) Effets et limites :\n"
            f"{D}Effets positifs : panier moyen +28 %, diff\u00e9renciation vs Etsy/Amazon.\n"
            f"{D}Limites : d\u00e9lai allong\u00e9 (12 jours), investissement SI 95 000 \u20ac, "
            "adoption partielle (18 % des ventes, 340/2 400 artisans)."
        ),
        attendu="Typologie innovation produit ma\u00eetrisee, jugement argument\u00e9 sur Sur mesure.",
        notions=["innovation produit", "innovation incr\u00e9mentale", "int\u00e9gration de services"],
    ),
    I(
        "e4",
        "Innovation de mod\u00e8le \u00e9conomique : diversification des revenus",
        support=(
            "Face \u00e0 la saturation du march\u00e9 fran\u00e7ais, Artisana teste depuis septembre 2024 "
            "deux relais de croissance. Premi\u00e8re piste : \u00ab Artisana Atelier \u00bb, abonnement "
            "B2B \u00e0 890 \u20ac/an pour les boutiques concept (s\u00e9lection curatoriale de 50 pi\u00e8ces, "
            "mise \u00e0 jour trimestrielle) \u2014 45 contrats sign\u00e9s, CA annuel 40 050 \u20ac. "
            "Deuxi\u00e8me piste : marketplace \u00ab seconde main artisanale \u00bb (revente entre "
            "particuliers, commission 10 %) lanc\u00e9e en d\u00e9cembre 2024, 2 100 transactions en "
            "Q1 2025. Le BM historique (commission 15 % sur ventes neuves) reste dominant (82 % du CA). "
            "La direction compare son approche \u00e0 celle d'Air France qui combine activit\u00e9 "
            "traditionnelle et low cost Hop pour diversifier. Les investisseurs questionnent la "
            "coh\u00e9rence : risque de cannibalisation et complexit\u00e9 op\u00e9rationnelle. Le comit\u00e9 "
            "strat\u00e9gique de f\u00e9vrier 2025 retient le principe de plusieurs mod\u00e8les \u00e9conomiques "
            "compl\u00e9mentaires ciblant des segments diff\u00e9rents."
        ),
        consigne=(
            "Explique l'int\u00e9r\u00eat et les limites de la diversification des mod\u00e8les \u00e9conomiques "
            "pour Artisana. Mobilise la notion d'innovation de mod\u00e8le \u00e9conomique."
        ),
        questions=[
            "Qu'est-ce qu'une innovation de mod\u00e8le \u00e9conomique ?",
            "Identifie les diff\u00e9rents mod\u00e8les \u00e9conomiques coexistent chez Artisana et leurs cibles.",
            "Quels avantages et limites de cette diversification, en t'inspirant de l'exemple Air France/Hop ?",
        ],
        correction=(
            "1) Innovation de mod\u00e8le \u00e9conomique :\n"
            "Adapter le mod\u00e8le en le pr\u00e9sentant diff\u00e9remment, en le proposant \u00e0 "
            "un autre public ou en d\u00e9mocratisant son acc\u00e8s (freemium, plateforme, low-cost\u2026).\n\n"
            "2) Mod\u00e8les coexistent :\n"
            f"{D}Commission marketplace neuve (15 %, cible artisans/acheteurs grand public).\n"
            f"{D}Abonnement Vitrine Pro (39 \u20ac/mois, artisans premium).\n"
            f"{D}Artisana Atelier B2B (890 \u20ac/an, boutiques concept).\n"
            f"{D}Seconde main (commission 10 %, particuliers).\n\n"
            "3) Avantages et limites :\n"
            f"{D}Avantages : relais de croissance, diversification des revenus, cibles diff\u00e9rentes.\n"
            f"{D}Limites : complexit\u00e9 op\u00e9rationnelle, risque de cannibalisation, BM historique "
            "encore dominant (82 %).\n"
            f"{D}Comme Air France/Hop : plusieurs BM peuvent coexister si les segments sont distincts."
        ),
        attendu="Innovation de BM d\u00e9finie, cartographie des revenus, analyse avantages/limites.",
        notions=["innovation de mod\u00e8le \u00e9conomique", "diversification", "sources de revenus"],
    ),
    I(
        "e5",
        "Mod\u00e8le freemium et acquisition d'utilisateurs",
        support=(
            "Artisana propose depuis 2023 un parcours freemium pour les artisans. L'inscription est "
            "gratuite : fiche produit basique, commission 15 %, visibilit\u00e9 standard dans les "
            "r\u00e9sultats de recherche. L'offre payante Vitrine Pro (39 \u20ac/mois) d\u00e9bloque "
            "photos professionnelles, badge \u00ab Artisan v\u00e9rifi\u00e9 \u00bb, statistiques avanc\u00e9es "
            "et positionnement prioritaire. Fin 2024 : 2 400 artisans inscrits dont 480 abonn\u00e9s "
            "Pro (taux de conversion 20 %). Le co\u00fbt d'acquisition d'un artisan gratuit est estim\u00e9 "
            "\u00e0 45 \u20ac (publicit\u00e9 Meta, salons m\u00e9tiers) ; la lifetime value d'un Pro "
            "sur 24 mois atteint 936 \u20ac (39 \u00d7 24) hors commissions. Le mod\u00e8le freemium "
            "n\u00e9cessite un volume important d'utilisateurs gratuits pour alimenter le catalogue "
            "et attirer les acheteurs : effet de r\u00e9seau. Le Bon Coin et certaines applications "
            "de jeux utilisent la m\u00eame logique mi-gratuit mi-payant. La direction surveille le "
            "taux de conversion car un BM freemium est contraint \u00e0 attirer un tr\u00e8s grand "
            "nombre d'utilisateurs pour \u00eatre performant."
        ),
        consigne=(
            "Analyse le mod\u00e8le freemium d'Artisana : logique de gratuit\u00e9, transformation "
            "en clients payants, ad\u00e9quation avec la transformation num\u00e9rique."
        ),
        questions=[
            "D\u00e9finis le mod\u00e8le \u00e9conomique freemium et ses contraintes.",
            "Comment Artisana transforme-t-elle les artisans gratuits en abonn\u00e9s Pro ?",
            "Pourquoi ce mod\u00e8le est-il adapt\u00e9 \u00e0 une plateforme num\u00e9rique selon le cours ?",
        ],
        correction=(
            "1) Mod\u00e8le freemium :\n"
            "Produit gratuit pour attirer un grand nombre d'utilisateurs, puis transformation "
            "en clients via une offre payante enrichie. Contrainte : volume d'utilisateurs n\u00e9cessaire.\n\n"
            "2) Transformation Artisana :\n"
            f"{D}Gratuit : inscription, fiche basique, commission standard.\n"
            f"{D}Payant Pro : photos pro, badge, stats, r\u00e9f\u00e9rencement prioritaire.\n"
            f"{D}Taux de conversion 20 % (480/2 400) ; LTV Pro 936 \u20ac vs CAC 45 \u20ac.\n\n"
            "3) Ad\u00e9quation num\u00e9rique :\n"
            f"{D}Effet de r\u00e9seau : catalogue gratuit attire acheteurs, qui attirent artisans.\n"
            f"{D}Co\u00fbt marginal faible de l'inscription gratuite en ligne.\n"
            f"{D}Comme Le Bon Coin ou apps de jeux : grand volume d'utilisateurs requis."
        ),
        attendu="Freemium d\u00e9fini, m\u00e9canisme de conversion illustr\u00e9, lien avec le num\u00e9rique.",
        notions=["freemium", "mod\u00e8le \u00e9conomique num\u00e9rique", "effet de r\u00e9seau"],
    ),
    I(
        "e6",
        "Mod\u00e8le plateforme et commission transactionnelle",
        support=(
            "Artisana incarne un mod\u00e8le \u00e9conomique de plateforme comparable \u00e0 Uber, "
            "Airbnb ou Vinted : elle ne produit pas les objets artisanaux mais met en relation "
            "offreurs (artisans) et demandeurs (acheteurs). Chaque transaction de 100 \u20ac g\u00e9n\u00e8re "
            "15 \u20ac de commission ; en 2024, 320 000 transactions ont \u00e9t\u00e9 enregistr\u00e9es "
            "pour un volume d'affaires total de 32 M\u20ac (GMV). La transformation num\u00e9rique "
            "facilite cette mise en relation \u00e0 grande \u00e9chelle sans stock ni atelier propre. "
            "Les co\u00fbts fixes (SI, salaires, marketing) s'\u00e9l\u00e8vent \u00e0 3,4 M\u20ac ; "
            "la marge sur commission permet un r\u00e9sultat positif si le volume est suffisant. "
            "Le risque identifi\u00e9 en 2025 : la d\u00e9pendance \u00e0 la commission unique "
            "(82 % du CA) et la concurrence de Vinted artisanat qui pr\u00e9l\u00e8ve 12 %. "
            "Les fondateurs \u00e9tudient une baisse cibl\u00e9e \u00e0 13 % sur les cat\u00e9gories "
            "strat\u00e9giques pour fid\u00e9liser les artisans les plus actifs."
        ),
        consigne=(
            "Caract\u00e9rise le mod\u00e8le \u00e9conomique de plateforme d'Artisana. Explique comment "
            "la transformation num\u00e9rique a permis son d\u00e9veloppement."
        ),
        questions=[
            "Qu'est-ce qu'un mod\u00e8le \u00e9conomique de plateforme ?",
            "Comment Artisana g\u00e9n\u00e8re-t-elle ses revenus sans produire les biens vendus ?",
            "Quels avantages et risques de ce mod\u00e8le dans le contexte du support ?",
        ],
        correction=(
            "1) Mod\u00e8le plateforme :\n"
            "Mettre en relation acheteurs et vendeurs et se r\u00e9mun\u00e9rer via une commission "
            "sur les transactions. La plateforme ne d\u00e9tient pas le stock ni ne fabrique le produit.\n\n"
            "2) G\u00e9n\u00e9ration de revenus :\n"
            f"{D}Commission 15 % sur 32 M\u20ac de GMV = revenus transactionnels.\n"
            f"{D}320 000 transactions en 2024 ; pas de co\u00fbt de production des objets.\n"
            f"{D}Co\u00fbts fixes SI/salaires/marketing \u00e0 couvrir par le volume.\n\n"
            "3) Avantages et risques :\n"
            f"{D}Avantages : scalabilit\u00e9, pas de stock, effet de r\u00e9seau num\u00e9rique.\n"
            f"{D}Risques : d\u00e9pendance \u00e0 la commission, concurrence Vinted (12 %), "
            "n\u00e9cessit\u00e9 d'un volume \u00e9lev\u00e9 de transactions."
        ),
        attendu="Mod\u00e8le plateforme caract\u00e9ris\u00e9, m\u00e9canisme commission expliqu\u00e9.",
        notions=["plateforme", "commission", "transformation num\u00e9rique"],
    ),
    I(
        "e7",
        "Mesurer la cr\u00e9ation de valeur : valeur ajout\u00e9e et r\u00e9sultat",
        support=(
            "Le contr\u00f4leur de gestion d'Artisana \u00e9tablit le compte de r\u00e9sultat pr\u00e9visionnel "
            "2025 pour la lev\u00e9e de fonds. Chiffre d'affaires pr\u00e9vu : 5,6 M\u20ac. Consommations "
            "interm\u00e9diaires (h\u00e9bergement cloud, sous-traitance photo, commissions de paiement "
            "Stripe) : 1,9 M\u20ac. Masse salariale et charges sociales : 1,8 M\u20ac. Autres charges "
            "d'exploitation (marketing, loyers, assurances) : 980 000 \u20ac. Dotations aux amortissements "
            "(configurateur Sur mesure) : 32 000 \u20ac. R\u00e9sultat financier net : \u221218 000 \u20ac "
            "(int\u00e9r\u00eats d'emprunt). R\u00e9sultat exceptionnel : 0 \u20ac. Imp\u00f4t sur les "
            "soci\u00e9t\u00e9 (15 % sur tranche PME) : calcul\u00e9 sur le r\u00e9sultat imposable. "
            "Les investisseurs demandent la valeur ajout\u00e9e (VA) et le r\u00e9sultat d'exploitation "
            "comme indicateurs de cr\u00e9ation de valeur. Le directeur financier rappelle que la VA "
            "mesure le suppl\u00e9ment de richesse apport\u00e9 par l'activit\u00e9 et que le compte "
            "de r\u00e9sultat pr\u00e9visionnel repose sur des hypoth\u00e8ses incertaines (taux de "
            "croissance du GMV, taux de conversion Pro)."
        ),
        consigne=(
            "Calcule la valeur ajout\u00e9e et le r\u00e9sultat d'exploitation pr\u00e9visionnels d'Artisana. "
            "Explique ce que mesurent ces indicateurs de cr\u00e9ation de valeur."
        ),
        questions=[
            "Qu'est-ce que la valeur ajout\u00e9e et comment la calcule-t-on ?",
            "Calcule la VA et le r\u00e9sultat d'exploitation d'Artisana \u00e0 partir des donn\u00e9es.",
            "Pourquoi la cr\u00e9ation de valeur estim\u00e9e reste-t-elle incertaine selon le cours ?",
        ],
        correction=(
            "1) Valeur ajout\u00e9e :\n"
            "VA = Production de l'exercice \u2212 Consommations en provenance des tiers "
            "(ou CA \u2212 consommations interm\u00e9diaires pour simplifier). "
            "Elle mesure le suppl\u00e9ment de richesse cr\u00e9\u00e9 par l'entreprise.\n\n"
            "2) Calculs Artisana 2025 :\n"
            f"{D}VA = 5 600 000 \u2212 1 900 000 = 3 700 000 \u20ac.\n"
            f"{D}R\u00e9sultat d'exploitation = VA \u2212 charges de personnel \u2212 autres charges "
            "\u2212 dotations = 3 700 000 \u2212 1 800 000 \u2212 980 000 \u2212 32 000 = 888 000 \u20ac.\n\n"
            "3) Incertitude :\n"
            f"{D}Compte de r\u00e9sultat pr\u00e9visionnel bas\u00e9 sur des hypoth\u00e8ses.\n"
            f"{D}Risque de mauvaise \u00e9valuation des ventes ou des charges.\n"
            f"{D}La cr\u00e9ation de valeur d\u00e9pend de la capacit\u00e9 \u00e0 d\u00e9tecter les besoins clients."
        ),
        attendu="Formules correctes, calculs justifi\u00e9s, incertitude des pr\u00e9visions expliqu\u00e9e.",
        notions=["valeur ajout\u00e9e", "r\u00e9sultat d'exploitation", "compte de r\u00e9sultat pr\u00e9visionnel"],
    ),
    I(
        "e8",
        "Indicateurs de performance : rentabilit\u00e9 \u00e9conomique et valeur patrimoniale",
        support=(
            "Au 31 d\u00e9cembre 2024, le bilan simplifi\u00e9 d'Artisana (SAS) pr\u00e9sente : actif "
            "total 2,4 M\u20ac (immobilisations incorporelles 420 000 \u20ac, tr\u00e9sorerie 380 000 \u20ac, "
            "cr\u00e9ances 520 000 \u20ac, autres actifs 1 080 000 \u20ac) ; dettes totales 980 000 \u20ac "
            "(emprunt bancaire 450 000 \u20ac, dettes fournisseurs 530 000 \u20ac). Capitaux propres : "
            "1 420 000 \u20ac. R\u00e9sultat d'exploitation 2024 : 620 000 \u20ac. Capitaux propres + "
            "endettement financier net : 1 420 000 + 450 000 = 1 870 000 \u20ac engag\u00e9s. "
            "Le board demande deux ratios extraits du bilan et du compte de r\u00e9sultat : la valeur "
            "patrimoniale (actif \u2212 dettes) et la rentabilit\u00e9 \u00e9conomique "
            "(r\u00e9sultat d'exploitation / capitaux engag\u00e9s). Ces indicateurs compl\u00e8tent "
            "la VA pour \u00e9valuer si Artisana cr\u00e9e de la valeur durablement. Un concurrent "
            "analyse obtient une rentabilit\u00e9 \u00e9conomique de 28 % ; Artisana doit comparer "
            "sa performance relative."
        ),
        consigne=(
            "Calcule et interpr\u00e8te la valeur patrimoniale et la rentabilit\u00e9 \u00e9conomique "
            "d'Artisana. Explique leur r\u00f4le dans la mesure de la cr\u00e9ation de valeur."
        ),
        questions=[
            "Comment calcule-t-on la valeur patrimoniale et que repr\u00e9sente-t-elle ?",
            "Calcule la rentabilit\u00e9 \u00e9conomique d'Artisana et interpr\u00e8te le r\u00e9sultat.",
            "Quels autres indicateurs de cr\u00e9ation de valeur compl\u00e8tent cette analyse ?",
        ],
        correction=(
            "1) Valeur patrimoniale :\n"
            "Valeur patrimoniale = Actif \u2212 Dettes = 2 400 000 \u2212 980 000 = 1 420 000 \u20ac. "
            "Elle correspond aux capitaux propres : valeur financi\u00e8re nette de l'entreprise.\n\n"
            "2) Rentabilit\u00e9 \u00e9conomique :\n"
            f"{D}RE = R\u00e9sultat d'exploitation / Capitaux engag\u00e9s.\n"
            f"{D}RE = 620 000 / 1 870 000 = 33,2 %.\n"
            f"{D}Artisana performe mieux que le concurrent (28 %) : bonne utilisation des capitaux.\n\n"
            "3) Autres indicateurs :\n"
            f"{D}Valeur ajout\u00e9e (richesse cr\u00e9\u00e9e par l'activit\u00e9).\n"
            f"{D}R\u00e9sultat net comptable (performance globale).\n"
            f"{D}Indicateurs qualitatifs : satisfaction clients 4,7/5, taux de r\u00e9achat."
        ),
        attendu="Calculs exacts, interpr\u00e9tation \u00e9conomique, compl\u00e9mentarit\u00e9 des indicateurs.",
        notions=["valeur patrimoniale", "rentabilit\u00e9 \u00e9conomique", "indicateurs financiers"],
    ),
    I(
        "e9",
        "Comparaison des mod\u00e8les \u00e9conomiques num\u00e9riques",
        support=(
            "Le comit\u00e9 strat\u00e9gique d'Artisana compare quatre mod\u00e8les \u00e9conomiques "
            "num\u00e9riques pour orienter les investissements 2026. Mod\u00e8le gratuit\u00e9/publicit\u00e9 "
            "(type Facebook) : contenu gratuit, revenus publicitaires et mon\u00e9tisation des donn\u00e9es ; "
            "n\u00e9cessite des millions d'utilisateurs. Mod\u00e8le freemium (type Le Bon Coin, Yuka) : "
            "offre gratuite + premium payant ; Artisana y est d\u00e9j\u00e0 positionn\u00e9e. Mod\u00e8le "
            "low-cost (type Electro D\u00e9p\u00f4t) : offre \u00e9pur\u00e9e, co\u00fbts r\u00e9duits, "
            "prix bas ; peu adapt\u00e9 \u00e0 l'artisanat premium. Mod\u00e8le plateforme (type Uber, "
            "Vinted) : commission sur transactions ; c'est le c\u0153ur du BM Artisana. En 2025, "
            "Artisana refuse la publicit\u00e9 intrusive (risque pour l'image premium) mais teste "
            "un partenariat data anonymis\u00e9e avec un institut de tendances d\u00e9co (15 000 \u20ac/an). "
            "Les fondateurs estiment que le BM doit \u00e9voluer sans se figer, l'innovation \u00e9tant "
            "primordiale pour s'adapter \u00e0 un environnement impr\u00e9visible."
        ),
        consigne=(
            "Compare les quatre mod\u00e8les \u00e9conomiques num\u00e9riques du cours et \u00e9value "
            "la pertinence de chacun pour Artisana."
        ),
        questions=[
            "Pr\u00e9sente les quatre mod\u00e8les \u00e9conomiques li\u00e9s \u00e0 la transformation num\u00e9rique.",
            "Pourquoi Artisana rejette-t-elle le mod\u00e8le gratuit\u00e9/publicit\u00e9 ?",
            "Quel mod\u00e8le domine et comment Artisana peut-elle faire \u00e9voluer son BM ?",
        ],
        correction=(
            "1) Quatre mod\u00e8les num\u00e9riques :\n"
            f"{D}Gratuit\u00e9/publicit\u00e9 : contenu gratuit, revenus pub et donn\u00e9es (Facebook, Google).\n"
            f"{D}Freemium : gratuit + premium (Le Bon Coin, Yuka).\n"
            f"{D}Low-cost : offre standardis\u00e9e, co\u00fbts r\u00e9duits (EasyJet, Electro D\u00e9p\u00f4t).\n"
            f"{D}Plateforme : mise en relation, commission (Uber, Vinted).\n\n"
            "2) Rejet publicit\u00e9 Artisana :\n"
            f"{D}Risque pour l'image premium et l'exp\u00e9rience utilisateur.\n"
            f"{D}N\u00e9cessite un volume massif d'utilisateurs.\n"
            f"{D}Test limit\u00e9 : data anonymis\u00e9e B2B (15 000 \u20ac), pas de pub intrusive.\n\n"
            "3) \u00c9volution du BM :\n"
            f"{D}Mod\u00e8le dominant : plateforme + freemium (Vitrine Pro).\n"
            f"{D}BM non fig\u00e9 : diversification B2B, seconde main.\n"
            f"{D}Innovation permanente pour s'adapter \u00e0 l'environnement."
        ),
        attendu="Quatre mod\u00e8les pr\u00e9sent\u00e9s, choix Artisana justifi\u00e9, \u00e9volution argument\u00e9e.",
        notions=["gratuit\u00e9", "freemium", "low-cost", "plateforme"],
    ),
    I(
        "e10",
        "Synth\u00e8se : \u00e9volution du business model et mesure de performance",
        support=(
            "R\u00e9capitulatif strat\u00e9gique Artisana 2022-2025. Phase 1 (2022-2023) : lancement "
            "marketplace pure, commission 15 %, objectif acquisition artisans et acheteurs. "
            "Phase 2 (2024) : innovation produit Sur mesure, freemium Vitrine Pro, CA 4,8 M\u20ac, "
            "VA 2,1 M\u20ac, RE 33 %. Phase 3 (2025) : diversification BM (B2B Atelier, seconde main), "
            "lev\u00e9e de fonds 1,5 M\u20ac vis\u00e9e, expansion Belgique/Suisse. Indicateurs cl\u00e9s : "
            "GMV 32 M\u20ac, 186 000 acheteurs, NPS 62, taux de conversion Pro 20 %. Menaces : "
            "Vinted artisanat, Etsy Europe, r\u00e9gulation commission plateformes. Le directeur "
            "g\u00e9n\u00e9ral pr\u00e9pare un m\u00e9mo au board sur l'\u00e9volution du BM et la "
            "mesure de la cr\u00e9ation de valeur \u00e0 court et moyen terme. Il doit montrer "
            "que le BM n'est pas fig\u00e9 et que l'innovation (produit et mod\u00e8le) est le moteur "
            "de la croissance, tout en justifiant les indicateurs financiers et qualitatifs retenus."
        ),
        consigne=(
            "R\u00e9dige une synth\u00e8se structur\u00e9e de l'\u00e9volution du business model d'Artisana "
            "et des indicateurs de cr\u00e9ation de valeur mobilis\u00e9s."
        ),
        questions=[
            "Retrace les trois phases d'\u00e9volution du BM d'Artisana (2022-2025).",
            "Quels indicateurs financiers et qualitatifs mesurent la cr\u00e9ation de valeur ?",
            "Quels d\u00e9fis futurs et quelle place pour l'innovation dans le BM ?",
        ],
        correction=(
            "1) Trois phases :\n"
            f"{D}2022-2023 : BM plateforme pur, commission, acquisition r\u00e9seau.\n"
            f"{D}2024 : innovation produit (Sur mesure), freemium Pro, performance financi\u00e8re solide.\n"
            f"{D}2025 : diversification BM, international, lev\u00e9e de fonds.\n\n"
            "2) Indicateurs de cr\u00e9ation de valeur :\n"
            f"{D}Financiers : VA (2,1 M\u20ac), RE (33 %), r\u00e9sultat d'exploitation, CA.\n"
            f"{D}Qualitatifs : NPS 62, satisfaction 4,7/5, taux de r\u00e9achat, taux conversion Pro.\n\n"
            "3) D\u00e9fis et innovation :\n"
            f"{D}Menaces concurrentielles (Vinted, Etsy) et r\u00e9gulation.\n"
            f"{D}BM \u00e9volutif : innovation produit ET mod\u00e8le comme moteur de croissance.\n"
            f"{D}N\u00e9cessit\u00e9 de combiner indicateurs financiers et sociaux pour piloter."
        ),
        attendu="Synth\u00e8se chronologique, indicateurs vari\u00e9s, perspective strat\u00e9gique.",
        notions=["business model", "cr\u00e9ation de valeur", "innovation", "indicateurs de performance"],
    ),
    I(
        "cas1",
        "\u00c9tude de cas : Artisana face \u00e0 la concurrence de Vinted",
        support=(
            "En avril 2025, Vinted lance une section \u00ab Artisanat & Cr\u00e9ateurs \u00bb en France "
            "avec commission 12 % (contre 15 % chez Artisana), 8 millions d'utilisateurs existants "
            "et algorithmes de recommandation \u00e9prouv\u00e9s. Artisana r\u00e9agit en trois mois : "
            "baisse cibl\u00e9e \u00e0 13 % sur maroquinerie et bijoux, renforcement du service "
            "(garantie authenticit\u00e9, hotline artisan en 24 h), campagne \u00ab Made in France "
            "v\u00e9rifi\u00e9 \u00bb. R\u00e9sultats T2 2025 : croissance GMV Artisana +6 % (vs +22 % "
            "en T1), 120 artisans migr\u00e9s vers Vinted, 85 nouveaux artisans Pro. Le CA reste "
            "\u00e0 1,35 M\u20ac au trimestre. Le board doit trancher : poursuivre la guerre des "
            "commissions, accentuer l'innovation produit (Sur mesure v2 avec IA), ou fusionner "
            "avec un acteur europ\u00e9en. Donn\u00e9es financi\u00e8res : VA trimestrielle 580 000 \u20ac, "
            "RE 29 %, tr\u00e9sorerie 380 000 \u20ac. NPS passe de 62 \u00e0 58. Les fondateurs "
            "rappellent qu'un BM n'est pas fig\u00e9 et que la proposition de valeur doit rester "
            "diff\u00e9renciante au-del\u00e0 du prix."
        ),
        consigne=(
            "R\u00e9dige une r\u00e9ponse type bac analysant la situation concurrentielle d'Artisana. "
            "Mobilise : business model, proposition de valeur, innovation produit/mod\u00e8le, "
            "indicateurs de cr\u00e9ation de valeur."
        ),
        questions=[
            "Analyse la menace Vinted sur le business model d'Artisana (commission, effet de r\u00e9seau).",
            "\u00c9value la r\u00e9ponse strat\u00e9gique d'Artisana : commission, service, communication.",
            "Interpr\u00e8te l'\u00e9volution des indicateurs (GMV, NPS, RE, migration artisans).",
            "Quelle strat\u00e9gie recommandes-tu au board ? Argumente avec les notions du chapitre.",
            "Synth\u00e8se (12-15 lignes) : comment une plateforme de niche d\u00e9fend-elle sa cr\u00e9ation de valeur ?",
        ],
        correction=(
            "1) Menace Vinted :\n"
            f"{D}Commission inf\u00e9rieure (12 % vs 15 %) attire les artisans sensibles au co\u00fbt.\n"
            f"{D}Effet de r\u00e9seau massif (8 M users) : visibilit\u00e9 sup\u00e9rieure.\n"
            f"{D}Risque de commoditisation du BM plateforme artisanat.\n\n"
            "2) R\u00e9ponse Artisana :\n"
            f"{D}Baisse cibl\u00e9e commission (13 %) sur cat\u00e9gories strat\u00e9giques.\n"
            f"{D}Diff\u00e9renciation service : authenticit\u00e9, hotline, label France v\u00e9rifi\u00e9.\n"
            f"{D}Renforcement Pro : 85 nouveaux abonn\u00e9s malgr\u00e9 la pression.\n\n"
            "3) Indicateurs :\n"
            f"{D}GMV +6 % (ralentissement vs T1) : concurrence p\u00e8se.\n"
            f"{D}NPS 62\u219258 : satisfaction en baisse, vigilance.\n"
            f"{D}RE 29 % (vs 33 %) : rentabilit\u00e9 encore solide.\n"
            f"{D}120 artisans partis : fuite mod\u00e9r\u00e9e mais significative.\n\n"
            "4) Recommandation :\n"
            "Poursuivre diff\u00e9renciation par la proposition de valeur (Sur mesure, service premium, "
            "freemium Pro) plut\u00f4t que guerre des prix seule. Innovation produit v2 (IA) pour "
            "renforcer la valeur per\u00e7ue. \u00c9viter fusion pr\u00e9cipit\u00e9e : pr\u00e9server identit\u00e9 niche.\n\n"
            "5) Synth\u00e8se :\n"
            "Une plateforme de niche d\u00e9fend sa cr\u00e9ation de valeur en combinant BM \u00e9volutif, "
            "innovation produit/service et indicateurs qualitatifs (NPS, fid\u00e9lit\u00e9 Pro), "
            "sans sacrifier uniquement sur la commission."
        ),
        attendu="Analyse concurrentielle compl\u00e8te, indicateurs interpr\u00e9t\u00e9s, recommandation argument\u00e9e.",
        notions=["business model", "plateforme", "cr\u00e9ation de valeur", "innovation"],
    ),
    I(
        "cas2",
        "\u00c9tude de cas : Lev\u00e9e de fonds et valorisation d'Artisana",
        support=(
            "En juin 2025, Artisana pr\u00e9sente sa lev\u00e9e de fonds s\u00e9rie A (1,5 M\u20ac) "
            "aux fonds d'investissement. Dossier remis : BM \u00e0 trois composantes d\u00e9taill\u00e9 "
            "(proposition de valeur premium artisanat fran\u00e7ais, m\u00e9canisme plateforme + freemium, "
            "rentabilit\u00e9 RE 33 % en 2024). Compte de r\u00e9sultat pr\u00e9visionnel 2025-2027 : "
            "CA 5,6 M\u20ac \u2192 9,2 M\u20ac \u2192 14 M\u20ac ; VA 3,7 M\u20ac \u2192 6,1 M\u20ac \u2192 9,5 M\u20ac ; "
            "r\u00e9sultat net 520 000 \u20ac \u2192 980 000 \u20ac \u2192 1,6 M\u20ac. Bilan 2024 : "
            "valeur patrimoniale 1,42 M\u20ac. Valorisation pr\u00e9-money n\u00e9goci\u00e9e : 8 M\u20ac "
            "(multiple 4,7\u00d7 CA 2025). Investisseurs sceptiques sur : d\u00e9pendance commission "
            "(82 %), concurrence Vinted, incertitude pr\u00e9visions. Artisana met en avant : "
            "diversification BM (B2B, seconde main), innovation Sur mesure, NPS 62, taux conversion "
            "Pro 20 %, march\u00e9 artisanat en ligne +18 %/an ( Xerfi 2024). Les fondateurs doivent "
            "convaincre que la cr\u00e9ation de valeur est mesurable, durable et que le BM \u00e9volue "
            "avec l'innovation."
        ),
        consigne=(
            "Analyse le dossier de lev\u00e9e de fonds d'Artisana en mobilisant toutes les notions "
            "du chapitre 2 : BM, cr\u00e9ation de valeur, indicateurs financiers, innovation, "
            "mod\u00e8les \u00e9conomiques num\u00e9riques."
        ),
        questions=[
            "Pr\u00e9sente le business model d'Artisana selon les trois composantes du cours.",
            "Analyse les indicateurs de cr\u00e9ation de valeur (VA, RE, valeur patrimoniale, r\u00e9sultat net pr\u00e9visionnel).",
            "Quels arguments sur l'innovation produit et de mod\u00e8le pour rassurer les investisseurs ?",
            "Quels risques et incertitudes les investisseurs soul\u00e8vent-ils ?",
            "Synth\u00e8se (15-18 lignes) : Artisana cr\u00e9e-t-elle de la valeur durable selon toi ?",
        ],
        correction=(
            "1) Business model :\n"
            f"{D}Proposition de valeur : artisanat premium fran\u00e7ais, tra\u00e7abilit\u00e9, service.\n"
            f"{D}M\u00e9canisme : plateforme num\u00e9rique, freemium, partenaires logistiques/photo.\n"
            f"{D}Rentabilit\u00e9 : commissions + abonnements, RE 33 %, croissance CA pr\u00e9vue.\n\n"
            "2) Indicateurs cr\u00e9ation de valeur :\n"
            f"{D}VA croissante (3,7 \u2192 9,5 M\u20ac sur 3 ans) : richesse cr\u00e9\u00e9e en hausse.\n"
            f"{D}RE 33 % : bonne performance \u00e9conomique.\n"
            f"{D}Valeur patrimoniale 1,42 M\u20ac : base solide.\n"
            f"{D}R\u00e9sultat net pr\u00e9visionnel positif et croissant.\n\n"
            "3) Arguments innovation :\n"
            f"{D}Sur mesure : panier moyen +28 %, diff\u00e9renciation.\n"
            f"{D}Diversification BM : B2B Atelier, seconde main.\n"
            f"{D}BM \u00e9volutif, pas fig\u00e9 : capacit\u00e9 d'adaptation.\n\n"
            "4) Risques investisseurs :\n"
            f"{D}D\u00e9pendance commission 82 %.\n"
            f"{D}Concurrence Vinted/Etsy.\n"
            f"{D}Pr\u00e9visions incertaines (compte pr\u00e9visionnel).\n\n"
            "5) Synth\u00e8se :\n"
            "Artisana cr\u00e9e de la valeur mesurable (VA, RE, r\u00e9sultat) avec des atouts "
            "qualitatifs (NPS, conversion Pro). La durabilit\u00e9 d\u00e9pend de la capacit\u00e9 "
            "\u00e0 diversifier le BM, innover et maintenir une proposition de valeur diff\u00e9renci\u00e9e "
            "face aux plateformes g\u00e9n\u00e9ralistes."
        ),
        attendu="Dossier lev\u00e9e analys\u00e9 avec toutes les notions chapitre 2, synth\u00e8se argument\u00e9e.",
        notions=["business model", "valeur ajout\u00e9e", "rentabilit\u00e9 \u00e9conomique", "lev\u00e9e de fonds"],
    ),
]

CH3 = [
    I(
        "e1",
        "Autofinancement et \u00e9pargne de l'entreprise",
        support=(
            "Lumina \u00c9clairage, PME toulousaine sp\u00e9cialis\u00e9e en luminaires LED professionnels "
            "(bureaux, entrep\u00f4ts, commerces), affiche en 2024 un r\u00e9sultat net de 340 000 \u20ac "
            "sur un CA de 6,2 M\u20ac. La direction, pilot\u00e9e par Nathalie Costa, d\u00e9cide de ne "
            "distribuer que 80 000 \u20ac de dividendes aux deux associ\u00e9s fondateurs et de conserver "
            "260 000 \u20ac en r\u00e9serve l\u00e9gale et report \u00e0 nouveau pour autofinancer un "
            "projet d'extension de la ligne d'assemblage automatis\u00e9e (budget 420 000 \u20ac, "
            "mise en service pr\u00e9vue septembre 2025). Le directeur financier rappelle que "
            "l'autofinancement provient de l'\u00e9pargne de l'entreprise et ne g\u00e9n\u00e8re aucune "
            "charge financi\u00e8re, contrairement \u00e0 un emprunt. Cependant, le solde disponible "
            "ne suffit pas : un compl\u00e9ment de financement devra \u00eatre arbitr\u00e9 entre "
            "emprunt bancaire, cr\u00e9dit-bail ou subvention r\u00e9gionale Occitanie."
        ),
        consigne=(
            "Explique le principe de l'autofinancement et son r\u00f4le dans le projet d'investissement "
            "de Lumina. Pr\u00e9sente ses avantages et ses limites."
        ),
        questions=[
            "Qu'est-ce que l'autofinancement et d'o\u00f9 provient-il ?",
            "Comment Lumina mobilise-t-elle l'autofinancement pour son projet d'extension ?",
            "Pourquoi l'autofinancement seul ne suffit-il pas ici ? Quel arbitrage reste \u00e0 faire ?",
        ],
        correction=(
            "1) Autofinancement :\n"
            "Part des r\u00e9sultats conserv\u00e9e par l'entreprise pour financer ses investissements "
            "futurs. Il provient de l'\u00e9pargne de l'entreprise (r\u00e9sultat non distribu\u00e9).\n\n"
            "2) Mobilisation Lumina :\n"
            f"{D}R\u00e9sultat net 2024 : 340 000 \u20ac.\n"
            f"{D}Dividendes limit\u00e9s \u00e0 80 000 \u20ac ; 260 000 \u20ac conserv\u00e9s.\n"
            f"{D}Projet extension : 420 000 \u20ac ; autofinancement couvre 62 % du besoin.\n\n"
            "3) Limites et arbitrage :\n"
            f"{D}Avantage : gratuit\u00e9, pas de charge d'int\u00e9r\u00eat.\n"
            f"{D}Limite : montant insuffisant (260 000 vs 420 000 \u20ac).\n"
            f"{D}Compl\u00e9ment n\u00e9cessaire : emprunt, cr\u00e9dit-bail ou subvention."
        ),
        attendu="Autofinancement d\u00e9fini, application chiffr\u00e9e, limites identifi\u00e9es.",
        notions=["autofinancement", "financement interne", "r\u00e9serve"],
    ),
    I(
        "e2",
        "Emprunt bancaire et co\u00fbt du financement externe",
        support=(
            "Pour compl\u00e9ter l'autofinancement, Lumina sollicite la Banque Occitane en mars 2025. "
            "Proposition : emprunt de 180 000 \u20ac sur cinq ans, taux fixe 4,2 %, remboursement "
            "par annuit\u00e9s constantes de 40 680 \u20ac (capital + int\u00e9r\u00eats). L'emprunt "
            "correspond \u00e0 un engagement entre la banque (pr\u00eateuse) et Lumina (emprunteuse) : "
            "remboursement du capital emprunt\u00e9 plus int\u00e9r\u00eats, r\u00e9mun\u00e9ration du "
            "pr\u00eateur. Le directeur financier calcule le co\u00fbt total des int\u00e9r\u00eats "
            "\u00e0 23 400 \u20ac sur la dur\u00e9e. La banque exige une garantie personnelle des "
            "associ\u00e9s et un endettement financier net inf\u00e9rieur \u00e0 35 % des capitaux "
            "propres (actuellement 28 %). Lumina compare cette option \u00e0 l'autofinancement pur "
            "et note que le financement externe par emprunt g\u00e9n\u00e8re une charge financi\u00e8re "
            "r\u00e9currente mais pr\u00e9serve la propri\u00e9t\u00e9 du capital social."
        ),
        consigne=(
            "Analyse l'emprunt bancaire propos\u00e9 \u00e0 Lumina. D\u00e9finis le financement externe "
            "par emprunt et compare-le \u00e0 l'autofinancement."
        ),
        questions=[
            "Qu'est-ce qu'un emprunt bancaire et comment se r\u00e9mun\u00e8re le pr\u00eateur ?",
            "Calcule le co\u00fbt total de l'emprunt Lumina (int\u00e9r\u00eats + annuit\u00e9s).",
            "Quels avantages et inconv\u00e9nients de l'emprunt par rapport \u00e0 l'autofinancement ?",
        ],
        correction=(
            "1) Emprunt bancaire :\n"
            "Engagement entre banque et entreprise : la banque pr\u00eate une somme, l'entreprise "
            "rembourse capital + int\u00e9r\u00eats. L'int\u00e9r\u00eat est le revenu du pr\u00eateur.\n\n"
            "2) Co\u00fbt Lumina :\n"
            f"{D}Emprunt 180 000 \u20ac, 5 ans, 4,2 %.\n"
            f"{D}Annuit\u00e9s : 5 \u00d7 40 680 = 203 400 \u20ac.\n"
            f"{D}Int\u00e9r\u00eats totaux : 203 400 \u2212 180 000 = 23 400 \u20ac.\n\n"
            "3) Comparaison :\n"
            f"{D}Avantages emprunt : pr\u00e9serve le capital, acc\u00e9l\u00e8re l'investissement.\n"
            f"{D}Inconv\u00e9nients : charge financi\u00e8re 23 400 \u20ac, garanties exig\u00e9es.\n"
            f"{D}Autofinancement gratuit mais limit\u00e9 et plus lent \u00e0 constituer."
        ),
        attendu="Emprunt d\u00e9fini, calculs corrects, comparaison avec autofinancement.",
        notions=["emprunt bancaire", "financement externe", "int\u00e9r\u00eats"],
    ),
    I(
        "e3",
        "Cr\u00e9dit-bail et acquisition d'\u00e9quipement",
        support=(
            "Parall\u00e8lement \u00e0 l'emprunt, la soci\u00e9t\u00e9 de cr\u00e9dit-bail \u00ab ProLease "
            "Sud \u00bb propose \u00e0 Lumina un contrat pour la ligne d'assemblage robotis\u00e9e : "
            "mise \u00e0 disposition du mat\u00e9riel pour 48 mois, redevance trimestrielle de "
            "12 500 \u20ac (soit 50 000 \u20ac/an). Au terme du contrat, Lumina pourra restituer "
            "le bien, l'acqu\u00e9rir pour 45 000 \u20ac (valeur r\u00e9siduelle) ou renouveler. "
            "Le cr\u00e9dit-bailleur reste propri\u00e9taire du bien pendant la dur\u00e9e du contrat. "
            "Avantage identifi\u00e9 : pas d'immobilisation comptable imm\u00e9diate, flexibilit\u00e9 "
            "en cas d'\u00e9volution technologique des LED. Inconv\u00e9nient : co\u00fbt total sur "
            "4 ans = 200 000 \u20ac de redevances + 45 000 \u20ac d'acquisition \u00e9ventuelle, "
            "soit 245 000 \u20ac si Lumina rach\u00e8te. Le directeur financier compare avec l'achat "
            "direct (420 000 \u20ac amorti sur 8 ans) et l'emprunt bancaire (180 000 \u20ac)."
        ),
        consigne=(
            "Analyse le contrat de cr\u00e9dit-bail propos\u00e9 \u00e0 Lumina. Pr\u00e9sente le "
            "fonctionnement du cr\u00e9dit-bail et ses options en fin de contrat."
        ),
        questions=[
            "Qu'est-ce qu'un cr\u00e9dit-bail et quelles sont les parties au contrat ?",
            "Quelles options Lumina aura-t-elle au terme des 48 mois ?",
            "Compare le co\u00fbt du cr\u00e9dit-bail avec l'achat direct et l'emprunt pour ce projet.",
        ],
        correction=(
            "1) Cr\u00e9dit-bail :\n"
            "Contrat entre soci\u00e9t\u00e9 financi\u00e8re (cr\u00e9dit-bailleur) et entreprise : "
            "mise \u00e0 disposition d'un bien moyennant redevances p\u00e9riodiques. "
            "Le cr\u00e9dit-bailleur reste propri\u00e9taire pendant le contrat.\n\n"
            "2) Options fin de contrat :\n"
            f"{D}Restituer le bien au cr\u00e9dit-bailleur.\n"
            f"{D}Acqu\u00e9rir pour 45 000 \u20ac (valeur r\u00e9siduelle).\n"
            f"{D}Renouveler le contrat.\n\n"
            "3) Comparaison co\u00fbts :\n"
            f"{D}Cr\u00e9dit-bail : 200 000 \u20ac redevances + 45 000 \u20ac acquisition = 245 000 \u20ac.\n"
            f"{D}Achat direct : 420 000 \u20ac immobilis\u00e9s, amortis sur 8 ans.\n"
            f"{D}Emprunt : 180 000 \u20ac + 23 400 \u20ac int\u00e9r\u00eats.\n"
            f"{D}Cr\u00e9dit-bail : flexibilit\u00e9 mais co\u00fbt \u00e9lev\u00e9 si acquisition finale."
        ),
        attendu="Cr\u00e9dit-bail d\u00e9fini, options identifi\u00e9es, comparaison chiffr\u00e9e.",
        notions=["cr\u00e9dit-bail", "redevance", "financement externe"],
    ),
    I(
        "e4",
        "Subventions et aides publiques au financement",
        support=(
            "La R\u00e9gion Occitanie lance en f\u00e9vrier 2025 l'aide \u00ab Industrie Verte \u00bb : "
            "subvention de 15 % du montant des investissements en efficacit\u00e9 \u00e9nerg\u00e9tique, "
            "plafonn\u00e9e \u00e0 80 000 \u20ac. Lumina d\u00e9pose un dossier pour la ligne LED basse "
            "consommation (420 000 \u20ac) : subvention potentielle 63 000 \u20ac (15 % \u00d7 420 000). "
            "Une subvention est une aide financi\u00e8re r\u00e9elle, ni pr\u00eat ni avance, accord\u00e9e "
            "par l'\u00c9tat ou une collectivit\u00e9 pour favoriser le d\u00e9veloppement d'une activit\u00e9. "
            "Elle ne n\u00e9cessite pas de remboursement mais impose des obligations (maintien emplois "
            "18 mois, bilan carbone annuel). Lumina compl\u00e8te avec une aide Bpifrance \u00ab Pr\u00eat "
            "Industrie \u00bb de 100 000 \u20ac \u00e0 taux bonifi\u00e9 1,8 %. Le montage final : "
            "autofinancement 260 000 \u20ac + subvention 63 000 \u20ac + pr\u00eat Bpifrance 100 000 \u20ac "
            "+ emprunt bancaire 57 000 \u20ac = 480 000 \u20ac (dont 60 000 \u20ac de BFR associ\u00e9)."
        ),
        consigne=(
            "Explique le r\u00f4le des subventions dans le montage de financement de Lumina. "
            "Distingue subvention, emprunt et autofinancement."
        ),
        questions=[
            "Qu'est-ce qu'une subvention et en quoi diff\u00e8re-t-elle d'un emprunt ?",
            "Calcule la subvention r\u00e9gionale obtenue par Lumina et ses conditions.",
            "Pr\u00e9sente le montage de financement global retenu (4 sources).",
        ],
        correction=(
            "1) Subvention :\n"
            "Aide financi\u00e8re r\u00e9elle, sans remboursement, accord\u00e9e par l'\u00c9tat ou "
            "collectivit\u00e9 pour favoriser une activit\u00e9. Diff\u00e8re de l'emprunt (remboursable + int\u00e9r\u00eats).\n\n"
            "2) Subvention Lumina :\n"
            f"{D}15 % \u00d7 420 000 = 63 000 \u20ac (plafond 80 000 non atteint).\n"
            f"{D}Conditions : maintien emplois 18 mois, bilan carbone.\n"
            f"{D}R\u00e9duit le besoin de financement externe co\u00fbteux.\n\n"
            "3) Montage global :\n"
            f"{D}Autofinancement : 260 000 \u20ac (financement interne).\n"
            f"{D}Subvention Occitanie : 63 000 \u20ac (financement externe gratuit).\n"
            f"{D}Pr\u00eat Bpifrance : 100 000 \u20ac (financement externe bonifi\u00e9).\n"
            f"{D}Emprunt bancaire : 57 000 \u20ac (financement externe classique)."
        ),
        attendu="Subvention d\u00e9finie, calcul correct, montage \u00e9quilibr\u00e9 pr\u00e9sent\u00e9.",
        notions=["subvention", "financement externe", "aides publiques"],
    ),
    I(
        "e5",
        "Arbitrage entre financement interne et externe",
        support=(
            "Le comit\u00e9 de direction de Lumina r\u00e9unit le 15 mars 2025 pour arbitrer le "
            "financement du projet extension. Trois profils d'actionnaires : Nathalie Costa (DG, "
            "55 % du capital) privil\u00e9gie l'autofinancement et la prudence ; le fonds "
            "\u00ab Green Invest \u00bb (25 %) souhaite un levier bancaire pour acc\u00e9l\u00e9rer ; "
            "l'ing\u00e9nieur associ\u00e9 Thomas Leroy (20 %) pr\u00e9f\u00e8re le cr\u00e9dit-bail "
            "pour la flexibilit\u00e9 technologique. Contexte : taux directeurs BCE \u00e0 3,5 %, "
            "inflation mati\u00e8res premi\u00e8res +8 %, concurrence asiatique sur les LED bas de "
            "gamme. Le financement interne (autofinancement + r\u00e9serve) repr\u00e9sente 54 % "
            "du montage retenu ; le financement externe (subvention + pr\u00eats + emprunt) 46 %. "
            "La direction rappelle que le choix d\u00e9pend de la forme juridique (SARL), de la "
            "taille (PME, 78 salari\u00e9s) et de la maturit\u00e9 bancaire (relation 12 ans avec "
            "la Banque Occitane)."
        ),
        consigne=(
            "Analyse l'arbitrage entre financement interne et externe chez Lumina. "
            "Mobilise les crit\u00e8res du cours (forme, taille, maturit\u00e9, environnement)."
        ),
        questions=[
            "Distingue financement interne et financement externe avec exemples Lumina.",
            "Quels crit\u00e8res influencent le choix de financement selon le cours ?",
            "Quel montage Lumina retient-il et pourquoi est-il \u00e9quilibr\u00e9 ?",
        ],
        correction=(
            "1) Financement interne vs externe :\n"
            f"{D}Interne : autofinancement (260 000 \u20ac), \u00e9pargne entreprise, gratuit.\n"
            f"{D}Externe : emprunt, cr\u00e9dit-bail, subvention, pr\u00eat Bpifrance.\n\n"
            "2) Crit\u00e8res de choix :\n"
            f"{D}Forme juridique (SARL) et taille (PME 78 salari\u00e9s).\n"
            f"{D}Maturit\u00e9 bancaire (12 ans Banque Occitane).\n"
            f"{D}Environnement \u00e9conomique (taux, inflation, concurrence).\n"
            f"{D}Politiques publiques (subventions PME vertes).\n\n"
            "3) Montage retenu :\n"
            f"{D}Mix 54 % interne / 46 % externe : prudence + acc\u00e9l\u00e9ration.\n"
            f"{D}Subvention r\u00e9duit le co\u00fbt ; emprunt limit\u00e9 \u00e0 57 000 \u20ac.\n"
            f"{D}Compromis entre les trois profils d'actionnaires."
        ),
        attendu="Distinction interne/externe, crit\u00e8res mobilis\u00e9s, montage justifi\u00e9.",
        notions=["financement interne", "financement externe", "arbitrage"],
    ),
    I(
        "e6",
        "Bilan fonctionnel : ressources stables et emplois stables",
        support=(
            "Le contr\u00f4leur de gestion de Lumina pr\u00e9sente le bilan fonctionnel simplifi\u00e9 "
            "au 31/12/2024 (en k\u20ac) : Ressources stables = Capitaux propres 1 850 + Dettes LT 620 "
            "= 2 470. Emplois stables = Immobilisations nettes 2 180. Ressources CT = Passif circulant "
            "exploitation 890 + Passif circulant hors exploitation 120 = 1 010. Emplois CT = Actif "
            "circulant exploitation 1 420 + Actif circulant hors exploitation 80 = 1 500. Tr\u00e9sorerie "
            "active 180 ; Tr\u00e9sorerie passive 0. Le bilan fonctionnel rattache les op\u00e9rations "
            "\u00e0 l'exploitation, aux flux ou aux investissements pour analyser l'origine et "
            "l'utilisation des flux financiers. Lumina pr\u00e9pare l'extension de 420 000 \u20ac qui "
            "augmentera les emplois stables (immobilisations). Le directeur financier doit v\u00e9rifier "
            "si les ressources stables actuelles suffiront ou si un financement externe est n\u00e9cessaire."
        ),
        consigne=(
            "Explique la structure du bilan fonctionnel de Lumina. Pr\u00e9sente ressources stables, "
            "emplois stables, actif/passif circulant."
        ),
        questions=[
            "Qu'est-ce que le bilan fonctionnel et \u00e0 quoi sert-il ?",
            "Pr\u00e9sente les ressources et emplois stables de Lumina \u00e0 partir des donn\u00e9es.",
            "Comment l'investissement pr\u00e9vu de 420 000 \u20ac impactera-t-il le bilan fonctionnel ?",
        ],
        correction=(
            "1) Bilan fonctionnel :\n"
            "Analyse du bilan comptable par origine et utilisation des flux financiers. "
            "Rattache op\u00e9rations \u00e0 exploitation, flux ou investissements.\n\n"
            "2) Structure Lumina :\n"
            f"{D}Ressources stables : 2 470 k\u20ac (CP 1 850 + dettes LT 620).\n"
            f"{D}Emplois stables : 2 180 k\u20ac (immobilisations nettes).\n"
            f"{D}Exc\u00e9dent ressources stables : 290 k\u20ac avant investissement.\n"
            f"{D}Actif circulant (1 500) > Passif circulant (1 010) : BFR positif.\n\n"
            "3) Impact investissement :\n"
            f"{D}Emplois stables passent \u00e0 ~2 600 k\u20ac (+420).\n"
            f"{D}Ressources stables insuffisantes : financement externe n\u00e9cessaire.\n"
            f"{D}Montage autofinancement + subvention + emprunts justifi\u00e9."
        ),
        attendu="Bilan fonctionnel expliqu\u00e9, donn\u00e9es structur\u00e9es, impact investissement.",
        notions=["bilan fonctionnel", "ressources stables", "emplois stables"],
    ),
    I(
        "e7",
        "Fonds de roulement net global (FR)",
        support=(
            "A partir du bilan fonctionnel Lumina 2024, le contr\u00f4leur calcule le Fonds de "
            "roulement net global : FR = Ressources stables \u2212 Emplois stables = 2 470 \u2212 "
            "2 180 = 290 k\u20ac (positif). Interpr\u00e9tation : les ressources stables suffisent "
            "\u00e0 financer les emplois stables, l'exc\u00e9dent (290 k\u20ac) peut contribuer "
            "\u00e0 financer les d\u00e9penses courantes d'exploitation (actif circulant). Apr\u00e8s "
            "l'investissement de 420 k\u20ac (financ\u00e9 par le montage mixte), les emplois stables "
            "passent \u00e0 2 600 k\u20ac. Si les ressources stables augmentent de 220 k\u20ac "
            "(emprunt LT + subvention), le FR redevient : 2 690 \u2212 2 600 = 90 k\u20ac (positif "
            "mais r\u00e9duit). Le directeur financier surveille ce ratio car un FR n\u00e9gatif "
            "obligerait l'entreprise \u00e0 recourir \u00e0 des d\u00e9couverts ou allonger les d\u00e9lais "
            "fournisseurs."
        ),
        consigne=(
            "Calcule et interpr\u00e8te le fonds de roulement de Lumina avant et apr\u00e8s investissement. "
            "Pr\u00e9sente les cons\u00e9quences d'un FR n\u00e9gatif."
        ),
        questions=[
            "Quelle est la formule du fonds de roulement net global ?",
            "Calcule le FR de Lumina avant et apr\u00e8s l'investissement.",
            "Que faire si le FR est n\u00e9gatif selon le cours ?",
        ],
        correction=(
            "1) Formule FR :\n"
            "FR = Ressources stables \u2212 Emplois stables.\n\n"
            "2) Calculs Lumina :\n"
            f"{D}Avant investissement : FR = 2 470 \u2212 2 180 = +290 k\u20ac (positif, \u00e9quilibr\u00e9).\n"
            f"{D}Apr\u00e8s investissement : FR = 2 690 \u2212 2 600 = +90 k\u20ac (positif mais r\u00e9duit).\n\n"
            "3) FR n\u00e9gatif :\n"
            f"{D}Ressources stables insuffisantes pour emplois stables.\n"
            f"{D}Solutions : d\u00e9couverts, allongement d\u00e9lais fournisseurs, r\u00e9duction d\u00e9lais clients, "
            "comptes courants associ\u00e9s.\n"
            f"{D}Mix de solutions souvent n\u00e9cessaire."
        ),
        attendu="Formule correcte, calculs avant/apr\u00e8s, cons\u00e9quences FR n\u00e9gatif.",
        notions=["fonds de roulement", "FR", "bilan fonctionnel"],
    ),
    I(
        "e8",
        "Besoin en fonds de roulement (BFR)",
        support=(
            "Lumina pr\u00e9sente un BFR positif en 2024 : BFR = Actif circulant \u2212 Passif circulant "
            "= 1 500 \u2212 1 010 = 490 k\u20ac. Cela signifie que les ressources \u00e0 court terme "
            "ne couvrent pas les emplois \u00e0 court terme : Lumina doit financer ce d\u00e9calage. "
            "Composition actif circulant : stocks composants LED 620 k\u20ac, cr\u00e9ances clients "
            "680 k\u20ac (d\u00e9lai moyen 52 jours), autres 200 k\u20ac. Passif circulant : dettes "
            "fournisseurs 540 k\u20ac (d\u00e9lai 38 jours), charges sociales et fiscales 350 k\u20ac, "
            "autres 120 k\u20ac. Le cycle d'exploitation (achat mati\u00e8res \u2192 production \u2192 "
            "vente \u2192 encaissement) dure environ 65 jours, bloquant du capital. Avec l'extension "
            "de production pr\u00e9vue en 2025, le BFR pourrait passer \u00e0 620 k\u20ac (+ stocks et "
            "cr\u00e9ances). Le FR positif (290 k\u20ac) ne couvre que partiellement ce BFR."
        ),
        consigne=(
            "Calcule et interpr\u00e8te le BFR de Lumina. Explique le lien entre cycle d'exploitation "
            "et besoin de financement \u00e0 court terme."
        ),
        questions=[
            "Quelle est la formule du BFR et que signifie un BFR positif ?",
            "Calcule le BFR de Lumina et identifie les postes qui le composent.",
            "Comment le cycle d'exploitation de 65 jours explique-t-il le BFR positif ?",
        ],
        correction=(
            "1) Formule BFR :\n"
            "BFR = Actif circulant \u2212 Passif circulant. BFR positif : ressources CT insuffisantes "
            "pour couvrir emplois CT, d\u00e9calage \u00e0 financer.\n\n"
            "2) Calcul Lumina :\n"
            f"{D}BFR = 1 500 \u2212 1 010 = 490 k\u20ac (positif).\n"
            f"{D}Actif : stocks 620 + cr\u00e9ances 680 + autres.\n"
            f"{D}Passif : fournisseurs 540 + charges 350 + autres.\n\n"
            "3) Cycle d'exploitation :\n"
            f"{D}65 jours entre achat et encaissement = capital bloqu\u00e9.\n"
            f"{D}Stocks et cr\u00e9ances clients gonflent le BFR.\n"
            f"{D}Extension 2025 : BFR pr\u00e9vu 620 k\u20ac, financement CT n\u00e9cessaire."
        ),
        attendu="BFR calcul\u00e9, composants identifi\u00e9s, lien cycle d'exploitation expliqu\u00e9.",
        notions=["besoin en fonds de roulement", "BFR", "cycle d'exploitation"],
    ),
    I(
        "e9",
        "Tr\u00e9sorerie nette et \u00e9quilibre financier",
        support=(
            "Pour Lumina au 31/12/2024 : Tr\u00e9sorerie nette = FR \u2212 BFR = 290 \u2212 490 = "
            "\u2212200 k\u20ac (n\u00e9gative). La tr\u00e9sorerie nette n\u00e9gative constitue un "
            "emploi CT : Lumina finance 200 k\u20ac par des liquidit\u00e9s emprunt\u00e9es "
            "(d\u00e9couvert bancaire autoris\u00e9 250 k\u20ac \u00e0 7,5 %). Tr\u00e9sorerie active "
            "comptable : 180 k\u20ac (placements CT). Le directeur financier utilise aussi l'affacturage "
            "sur 40 % des cr\u00e9ances clients (frais 2,1 %) pour acc\u00e9l\u00e9rer les encaissements. "
            "Formule compl\u00e8te : Tr\u00e9sorerie = FR \u2212 BFR. Si positive : ressource CT "
            "(liquidit\u00e9s propres). Si n\u00e9gative : emploi CT (d\u00e9couverts). Lumina doit "
            "surveiller cet \u00e9quilibre car l'extension pr\u00e9vue augmentera le BFR sans augmenter "
            "le FR proportionnellement."
        ),
        consigne=(
            "Calcule la tr\u00e9sorerie nette de Lumina et analyse son \u00e9quilibre financier. "
            "Pr\u00e9sente les solutions de financement du cycle d'exploitation mobilis\u00e9es."
        ),
        questions=[
            "Quelle est la relation entre FR, BFR et tr\u00e9sorerie nette ?",
            "Calcule la tr\u00e9sorerie nette de Lumina et interpr\u00e8te le signe n\u00e9gatif.",
            "Quelles solutions Lumina utilise-t-elle pour financer son cycle d'exploitation ?",
        ],
        correction=(
            "1) Relation FR/BFR/Tr\u00e9sorerie :\n"
            "Tr\u00e9sorerie nette = FR \u2212 BFR. Mesure les liquidit\u00e9s disponibles ou emprunt\u00e9es.\n\n"
            "2) Calcul Lumina :\n"
            f"{D}Tr\u00e9sorerie = 290 \u2212 490 = \u2212200 k\u20ac (n\u00e9gative).\n"
            f"{D}Emploi CT : 200 k\u20ac financ\u00e9s par d\u00e9couvert bancaire.\n"
            f"{D}Tr\u00e9sorerie active 180 k\u20ac insuffisante \u00e0 couvrir le d\u00e9ficit.\n\n"
            "3) Solutions cycle d'exploitation :\n"
            f"{D}D\u00e9couvert bancaire 250 k\u20ac autoris\u00e9 (facilit\u00e9 de caisse).\n"
            f"{D}Affacturage 40 % cr\u00e9ances (financement anticip\u00e9 factures).\n"
            f"{D}Objectif : r\u00e9duire le d\u00e9calage cycle 65 jours."
        ),
        attendu="Formule tr\u00e9sorerie, calcul correct, solutions CT identifi\u00e9es.",
        notions=["tr\u00e9sorerie nette", "FR", "BFR", "affacturage"],
    ),
    I(
        "e10",
        "Synth\u00e8se : montage de financement et \u00e9quilibre financier",
        support=(
            "Synth\u00e8se financi\u00e8re Lumina mars 2025. Projet extension : 420 000 \u20ac + BFR "
            "additionnel 130 k\u20ac. Montage retenu : autofinancement 260 000 \u20ac, subvention "
            "Occitanie 63 000 \u20ac, pr\u00eat Bpifrance 100 000 \u20ac, emprunt Banque Occitane "
            "57 000 \u20ac, cr\u00e9dit-bail rejet\u00e9 (co\u00fbt trop \u00e9lev\u00e9). Apr\u00e8s "
            "investissement : FR 90 k\u20ac, BFR 620 k\u20ac, tr\u00e9sorerie \u2212530 k\u20ac. "
            "Plan d'action tr\u00e9sorerie : affacturage \u00e9tendu \u00e0 60 % cr\u00e9ances, "
            "n\u00e9gociation d\u00e9lai fournisseurs 45 \u2192 50 jours, d\u00e9couverts 400 k\u20ac. "
            "Indicateurs cibles 2026 : FR > 150 k\u20ac, BFR stabilis\u00e9 580 k\u20ac, tr\u00e9sorerie "
            "positive. Le directeur financier pr\u00e9pare un m\u00e9mo au board sur l'arbitrage "
            "financement interne/externe et l'\u00e9quilibre FR/BFR/tr\u00e9sorerie."
        ),
        consigne=(
            "R\u00e9dige une synth\u00e8se du montage de financement et de l'\u00e9quilibre financier "
            "de Lumina. Mobilise toutes les modalit\u00e9s de financement et les trois ratios."
        ),
        questions=[
            "Pr\u00e9sente le montage de financement retenu et justifie le rejet du cr\u00e9dit-bail.",
            "Analyse l'\u00e9quilibre FR/BFR/tr\u00e9sorerie apr\u00e8s investissement.",
            "Quelles mesures pour r\u00e9tablir une tr\u00e9sorerie positive d'ici 2026 ?",
        ],
        correction=(
            "1) Montage financement :\n"
            f"{D}Interne : autofinancement 260 000 \u20ac (62 %).\n"
            f"{D}Externe : subvention 63 000 + Bpifrance 100 000 + emprunt 57 000 \u20ac.\n"
            f"{D}Cr\u00e9dit-bail rejet\u00e9 : 245 000 \u20ac total vs achat+emprunt moins cher.\n\n"
            "2) \u00c9quilibre financier :\n"
            f"{D}FR +90 k\u20ac : positif mais faible.\n"
            f"{D}BFR 620 k\u20ac : d\u00e9calage CT important.\n"
            f"{D}Tr\u00e9sorerie \u2212530 k\u20ac : d\u00e9s\u00e9quilibre, d\u00e9pendance d\u00e9couverts.\n\n"
            "3) Mesures 2026 :\n"
            f"{D}Affacturage \u00e9tendu (60 % cr\u00e9ances).\n"
            f"{D}Allongement d\u00e9lai fournisseurs.\n"
            f"{D}D\u00e9couverts 400 k\u20ac en attendant retour tr\u00e9sorerie positive."
        ),
        attendu="Synth\u00e8se compl\u00e8te financement + ratios, mesures coh\u00e9rentes.",
        notions=["financement", "FR", "BFR", "tr\u00e9sorerie"],
    ),
    I(
        "cas1",
        "\u00c9tude de cas : Lumina finance son extension LED",
        support=(
            "Dossier complet Lumina \u00c9clairage (Toulouse, 78 salari\u00e9s, CA 6,2 M\u20ac). "
            "Projet : ligne d'assemblage LED basse consommation, 420 000 \u20ac, ROI pr\u00e9vu 4,2 ans. "
            "Bilan fonctionnel 2024 : FR +290 k\u20ac, BFR +490 k\u20ac, tr\u00e9sorerie \u2212200 k\u20ac. "
            "Options \u00e9tudi\u00e9es : (A) autofinancement seul \u2014 impossible, 160 000 \u20ac manquants ; "
            "(B) emprunt 180 000 \u20ac \u00e0 4,2 % ; (C) cr\u00e9dit-bail 245 000 \u20ac total ; "
            "(D) montage mixte retenu. Subvention Occitanie 63 000 \u20ac obtenue. Concurrence : "
            "Signify et leds.fr sur le segment pro. D\u00e9lai d\u00e9cision : 30 mars 2025. "
            "Le board doit valider le montage et le plan de tr\u00e9sorerie post-investissement."
        ),
        consigne=(
            "R\u00e9dige une r\u00e9ponse type bac sur le financement du projet Lumina. Mobilise : "
            "financement interne/externe, autofinancement, emprunt, cr\u00e9dit-bail, subvention, "
            "FR/BFR/tr\u00e9sorerie."
        ),
        questions=[
            "Pr\u00e9sente les options de financement \u00e9tudi\u00e9es et le montage retenu.",
            "Analyse le bilan fonctionnel avant investissement (FR, BFR, tr\u00e9sorerie).",
            "Compare emprunt, cr\u00e9dit-bail et subvention dans ce contexte.",
            "Quel plan de tr\u00e9sorerie post-investissement recommandes-tu ?",
            "Synth\u00e8se (12-15 lignes) : Lumina a-t-elle fait les bons arbitrages financiers ?",
        ],
        correction=(
            "1) Options et montage :\n"
            f"{D}(A) Autofinancement seul : insuffisant (260 vs 420 k\u20ac).\n"
            f"{D}(B) Emprunt seul : possible mais charge financi\u00e8re \u00e9lev\u00e9e.\n"
            f"{D}(C) Cr\u00e9dit-bail : flexible mais 245 k\u20ac total, rejet\u00e9.\n"
            f"{D}(D) Mixte retenu : autofinancement + subvention + Bpifrance + emprunt.\n\n"
            "2) Bilan fonctionnel avant :\n"
            f"{D}FR +290 k\u20ac : \u00e9quilibre structurel correct.\n"
            f"{D}BFR +490 k\u20ac : cycle d'exploitation gourmand.\n"
            f"{D}Tr\u00e9sorerie \u2212200 k\u20ac : d\u00e9j\u00e0 tendue.\n\n"
            "3) Comparaison modalit\u00e9s :\n"
            f"{D}Subvention : 63 k\u20ac gratuits, conditions emploi/carbone.\n"
            f"{D}Emprunt : 57 k\u20ac, charge int\u00e9r\u00eats mod\u00e9r\u00e9e.\n"
            f"{D}Cr\u00e9dit-bail : rejet\u00e9, co\u00fbt et perte propri\u00e9t\u00e9 temporaire.\n\n"
            "4) Plan tr\u00e9sorerie :\n"
            f"{D}Affacturage 60 %, d\u00e9lais fournisseurs, d\u00e9couverts 400 k\u20ac.\n"
            f"{D}Objectif tr\u00e9sorerie positive 2026.\n\n"
            "5) Synth\u00e8se :\n"
            "Lumina a fait des arbitrages pertinents : mix interne/externe, subvention maximis\u00e9e, "
            "cr\u00e9dit-bail \u00e9cart\u00e9. Vigilance sur tr\u00e9sorerie post-investissement."
        ),
        attendu="Cas Lumina analys\u00e9 avec toutes les notions chapitre 3, synth\u00e8se argument\u00e9e.",
        notions=["financement interne", "financement externe", "FR", "BFR"],
    ),
    I(
        "cas2",
        "\u00c9tude de cas : Gestion de tr\u00e9sorerie et cycle d'exploitation",
        support=(
            "Trois mois apr\u00e8s le d\u00e9marrage du projet, Lumina fait face \u00e0 une tension de "
            "tr\u00e9sorerie (septembre 2025). CA trimestriel 1,72 M\u20ac (+8 %), mais stocks composants "
            "LED +22 % (approvisionnement anticip\u00e9), cr\u00e9ances clients 780 k\u20ac (d\u00e9lai "
            "58 jours, en hausse), dettes fournisseurs 610 k\u20ac. BFR trimestriel : 680 k\u20ac. "
            "FR : 85 k\u20ac. Tr\u00e9sorerie : \u2212595 k\u20ac. Banque Occitane menace de r\u00e9duire "
            "le d\u00e9couvert autoris\u00e9 (400 \u2192 300 k\u20ac) si non r\u00e9gularisation sous "
            "60 jours. Solutions \u00e0 l'\u00e9tude : affacturage int\u00e9gral (frais 2,3 %), "
            "relance clients grands comptes, escompte fournisseurs (\u22122 % pour paiement 15 jours), "
            "report investissement secondaire 80 k\u20ac. Le directeur financier pr\u00e9pare une "
            "n\u00e9gociation bancaire en pr\u00e9sentant le cycle d'exploitation et le plan de retour "
            "\u00e0 l'\u00e9quilibre."
        ),
        consigne=(
            "Analyse la crise de tr\u00e9sorerie de Lumina et propose un plan de redressement. "
            "Mobilise cycle d'exploitation, BFR, FR, tr\u00e9sorerie et solutions de financement CT."
        ),
        questions=[
            "Explique les causes de la d\u00e9gradation du BFR et de la tr\u00e9sorerie.",
            "Calcule l'impact de chaque solution propos\u00e9e sur la tr\u00e9sorerie.",
            "Quels arguments pr\u00e9senter \u00e0 la banque pour maintenir le d\u00e9couvert ?",
            "Compare affacturage et escompte fournisseurs comme outils de gestion CT.",
            "Synth\u00e8se (15-18 lignes) : comment Lumina doit-elle piloter son cycle d'exploitation ?",
        ],
        correction=(
            "1) Causes d\u00e9gradation :\n"
            f"{D}Stocks +22 % : capital bloqu\u00e9 en composants.\n"
            f"{D}D\u00e9lai clients 58 jours (vs 52) : cr\u00e9ances en hausse.\n"
            f"{D}BFR 680 k\u20ac vs FR 85 k\u20ac : d\u00e9s\u00e9quilibre majeur.\n\n"
            "2) Impact solutions :\n"
            f"{D}Affacturage int\u00e9gral : lib\u00e8re ~780 k\u20ac \u2212 2,3 % frais.\n"
            f"{D}Relance clients : r\u00e9duction d\u00e9lai encaissement.\n"
            f"{D}Escompte fournisseurs : acc\u00e9l\u00e8re paiements mais \u22122 % marge.\n"
            f"{D}Report investissement 80 k\u20ac : r\u00e9duit pression imm\u00e9diate.\n\n"
            "3) Arguments banque :\n"
            f"{D}CA en croissance (+8 %), projet structurant, subvention obtenue.\n"
            f"{D}Plan affacturage + relance clients = retour \u00e9quilibre 60 jours.\n\n"
            "4) Affacturage vs escompte :\n"
            f"{D}Affacturage : acc\u00e9l\u00e8re encaissements (actif).\n"
            f"{D}Escompte : acc\u00e9l\u00e8re d\u00e9caissements (passif).\n\n"
            "5) Synth\u00e8se :\n"
            "Lumina doit piloter son cycle d'exploitation en raccourcissant le d\u00e9calage "
            "65 jours, combinant affacturage, n\u00e9gociation d\u00e9lais et contr\u00f4le stocks."
        ),
        attendu="Crise tr\u00e9sorerie analys\u00e9e, solutions chiffr\u00e9es, pilotage cycle d'exploitation.",
        notions=["BFR", "tr\u00e9sorerie", "cycle d'exploitation", "affacturage"],
    ),
]

from rewrite_management_ch4_5_data import CH4, CH5  # noqa: E402
