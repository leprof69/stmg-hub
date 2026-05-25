# -*- coding: utf-8 -*-
"""Management chapitre 5 — acteurs reels, un concept par exercice."""

D = "\u2014 "


def I(sid, title, **body):
    return {"sid": sid, "title": title, "body": body}


CH5 = [
    I(
        "e1",
        "Innovation de proc\u00e9d\u00e9s chez Renault",
        support=(
            "Renault investit 420 M\u20ac dans l'usine Maubeuge pour une ligne de soudure "
            "robotis\u00e9e Cl\u00e9on (2024-2025). Innovation de proc\u00e9d\u00e9 : nouvelles "
            "m\u00e9thodes de production sans changer le v\u00e9hicule. Avant : soudure manuelle "
            "14 carrosseries/heure, rebut 3,8 %. Apr\u00e8s : soudure laser robotis\u00e9e "
            "32 carrosseries/heure, rebut 1,2 %. Changements : technique (laser vs arc), "
            "mat\u00e9riel (robots Fanuc), logiciel (programmation trajectoires Siemens NX). "
            "Gain productivit\u00e9 128 %, am\u00e9lioration qualit\u00e9 mesurable."
        ),
        consigne=(
            "D\u00e9finis l'innovation de proc\u00e9d\u00e9 et analyse celle d\u00e9ploy\u00e9e par "
            "Renault. Distingue innovation de produit et innovation de proc\u00e9d\u00e9."
        ),
        questions=[
            "Qu'est-ce qu'une innovation de proc\u00e9d\u00e9 ? Quels changements implique-t-elle ?",
            "Identifie les changements techniques, mat\u00e9riels et logiciels chez Renault.",
            "Quels avantages concurrentiels cette innovation procure-t-elle ?",
        ],
        correction=(
            "1) Innovation de proc\u00e9d\u00e9 :\n"
            "Nouvelle m\u00e9thode de production ou distribution avec changements en techniques, "
            "mat\u00e9riel et/ou logiciel. Diff\u00e8re de l'innovation produit (nouveau v\u00e9hicule).\n\n"
            "2) Changements Renault :\n"
            f"{D}Technique : soudure laser vs arc manuel.\n"
            f"{D}Mat\u00e9riel : robots Fanuc, cellule automatis\u00e9e.\n"
            f"{D}Logiciel : programmation Siemens NX.\n\n"
            "3) Avantages concurrentiels :\n"
            f"{D}Productivit\u00e9 +128 % (14 \u2192 32 carrosseries/h).\n"
            f"{D}Qualit\u00e9 : rebut 3,8 % \u2192 1,2 %.\n"
            f"{D}Avantage co\u00fbt et d\u00e9lais vs concurrents."
        ),
        attendu="Innovation proc\u00e9d\u00e9 d\u00e9finie, changements identifi\u00e9s, avantages chiffr\u00e9s.",
        notions=["innovation de proc\u00e9d\u00e9", "productivit\u00e9", "Schumpeter"],
    ),
    I(
        "e2",
        "Fabrication unitaire vs production en s\u00e9rie chez Safran",
        support=(
            "Safran Aircraft Engines sert deux segments. Segment A (38 % CA) : pi\u00e8ces sur mesure "
            "pour moteurs civils (fabrication unitaire, 1 \u00e0 8 pi\u00e8ces/commande, d\u00e9lai "
            "12 semaines, marge 42 %). Segment B (62 % CA) : composants standard CFM (production "
            "en s\u00e9rie, 500 pi\u00e8ces/lot, d\u00e9lai 18 jours, marge 16 %). Fabrication "
            "unitaire : personnalisation forte, volumes faibles (a\u00e9ronautique, luxe). "
            "Production en s\u00e9rie : grandes quantit\u00e9s identiques, co\u00fbt unitaire r\u00e9duit. "
            "Safran arbitre investissements 2025 : renforcer atelier unitaire ou ligne s\u00e9rie CFM."
        ),
        consigne=(
            "Compare fabrication unitaire et production en s\u00e9rie \u00e0 partir du d\u00e9coupage "
            "de Safran. Explique les crit\u00e8res de choix du mode de production."
        ),
        questions=[
            "Quelles caract\u00e9ristiques de la fabrication unitaire et de la production en s\u00e9rie ?",
            "Comment Safran combine-t-elle les deux modes ? Chiffre les diff\u00e9rences.",
            "Quels crit\u00e8res guideraient le prochain investissement industriel ?",
        ],
        correction=(
            "1) Caract\u00e9ristiques :\n"
            f"{D}Unitaire : pi\u00e8ce par pi\u00e8ce, personnalisation, faibles volumes, forte VA.\n"
            f"{D}S\u00e9rie : volumes \u00e9lev\u00e9s, division du travail, co\u00fbt unitaire bas.\n\n"
            "2) Combinaison Safran :\n"
            f"{D}Segment A : unitaire, marge 42 %, d\u00e9lai 12 semaines.\n"
            f"{D}Segment B : s\u00e9rie 500 pi\u00e8ces/lot, marge 16 %, d\u00e9lai 18 jours.\n\n"
            "3) Crit\u00e8res investissement :\n"
            f"{D}Potentiel croissance par segment, d\u00e9bouch\u00e9s clients.\n"
            f"{D}Retour sur investissement, flexibilit\u00e9 vs productivit\u00e9."
        ),
        attendu="Deux modes compar\u00e9s, application Safran chiffr\u00e9e, crit\u00e8res d'arbitrage.",
        notions=["fabrication unitaire", "production en s\u00e9rie", "organisation de la production"],
    ),
    I(
        "e3",
        "Production continue et discontinue chez ArcelorMittal",
        support=(
            "ArcelorMittal Dunkerque op\u00e8re un haut-fourneau en production continue "
            "(24 h/24, 7 j/7, 8 200 t acier/jour, arr\u00eat technique 72 h/trimestre). "
            "Contraintes : travail post\u00e9 (4 \u00e9quipes), maintenance pr\u00e9ventive stricte, "
            "stocks minerai \u00e9lev\u00e9s. Parall\u00e8lement, l'atelier laminage \u00e0 froid "
            "fonctionne en production discontinue (16 h/jour, 6 j/semaine, interruption entre lots). "
            "Justification continue : demande stable sid\u00e9rurgie (contrats automobiles 2024-2028). "
            "Justification discontinue : commandes variables t\u00f4les sp\u00e9ciales."
        ),
        consigne=(
            "Distingue production continue et discontinue. Analyse les choix d'ArcelorMittal "
            "et leurs contraintes organisationnelles."
        ),
        questions=[
            "Qu'est-ce que la production continue et quand la choisir ?",
            "Qu'est-ce que la production discontinue et quels avantages pour ArcelorMittal ?",
            "Quelles contraintes sociales et organisationnelles pour chaque mode ?",
        ],
        correction=(
            "1) Production continue :\n"
            "Op\u00e9rations successives sans interruption. Justifi\u00e9e si demande stable. "
            "ArcelorMittal : 24 h/7 j, contrats automobiles.\n\n"
            "2) Production discontinue :\n"
            "Processus interruptible avant produit fini. Laminage \u00e0 froid : 16 h/6 j, "
            "commandes variables t\u00f4les sp\u00e9ciales.\n\n"
            "3) Contraintes :\n"
            f"{D}Continue : travail post\u00e9, astreinte, stocks minerai, maintenance.\n"
            f"{D}Discontinue : horaires adaptables, flexibilit\u00e9, moindre usure \u00e9quipes."
        ),
        attendu="Continu/discontinu distingu\u00e9s, application ArcelorMittal, contraintes identifi\u00e9es.",
        notions=["production continue", "production discontinue", "contraintes organisationnelles"],
    ),
    I(
        "e4",
        "Flexibilit\u00e9 productive chez Michelin",
        support=(
            "Michelin renforce sa flexibilit\u00e9 pour r\u00e9pondre aux fluctuations (pneus hiver "
            "+28 % T4, pneus \u00e9lectriques +22 % T1 2025). Dispositifs : polyvalence op\u00e9rateurs "
            "CNC (18 salari\u00e9s form\u00e9s sur 3 machines vs 1), changement de s\u00e9rie acc\u00e9l\u00e9r\u00e9 "
            "(setup 35 min vs 90 min en 2023), 12 int\u00e9rimaires qualifi\u00e9s en pic. "
            "Cellule robotis\u00e9e s'adapte \u00e0 60 r\u00e9f\u00e9rences sans retooling majeur. "
            "Objectif 2025 : taux de charge 84 % (vs 73 % en 2024) sans embauche permanente."
        ),
        consigne=(
            "Explique comment Michelin d\u00e9veloppe sa flexibilit\u00e9 productive. "
            "Lie innovation de proc\u00e9d\u00e9s et flexibilit\u00e9."
        ),
        questions=[
            "Quels avantages la flexibilit\u00e9 conf\u00e8re-t-elle \u00e0 une organisation selon le cours ?",
            "Quels dispositifs Michelin d\u00e9ploie-t-elle pour gagner en flexibilit\u00e9 ?",
            "Comment l'innovation robotis\u00e9e contribue-t-elle \u00e0 cette flexibilit\u00e9 ?",
        ],
        correction=(
            "1) Avantages flexibilit\u00e9 :\n"
            "R\u00e9ponse rapide aux fluctuations demande et \u00e9volutions environnement. "
            "Adaptation sans surinvestissement permanent.\n\n"
            "2) Dispositifs Michelin :\n"
            f"{D}Polyvalence : 18 op\u00e9rateurs sur 3 machines.\n"
            f"{D}Setup r\u00e9duit : 90 min \u2192 35 min.\n"
            f"{D}Int\u00e9rim qualifi\u00e9 : 12 int\u00e9rimaires en pic.\n\n"
            "3) Innovation robotis\u00e9e :\n"
            f"{D}60 r\u00e9f\u00e9rences sans retooling majeur.\n"
            f"{D}Taux de charge cible 84 % sans embauche permanente."
        ),
        attendu="Flexibilit\u00e9 d\u00e9finie, dispositifs identifi\u00e9s, lien innovation expliqu\u00e9.",
        notions=["flexibilit\u00e9", "polyvalence", "innovation de proc\u00e9d\u00e9s"],
    ),
    I(
        "e5",
        "Qualit\u00e9 et taux de rebut chez L'Or\u00e9al",
        support=(
            "L'Or\u00e9al pilote la qualit\u00e9 sur son site Aulnay (cosm\u00e9tiques) via indicateurs SPC. "
            "Segment s\u00e9rie shampoings : rebut 1,4 % (objectif 1,2 %), PPM d\u00e9fauts 820 "
            "(objectif 600). Segment premium parfums : rebut 0,3 %, contr\u00f4le 100 % visuel. "
            "Actions 2025 : certification ISO 9001 renouvel\u00e9e, formation 5 sens \u00e0 220 "
            "op\u00e9rateurs, andon system sur ligne remplissage. Ligne robotis\u00e9e a r\u00e9duit "
            "rebut remplissage de 2,8 % \u00e0 0,9 %. Qualit\u00e9 li\u00e9e au mode : unitaire "
            "permet contr\u00f4le pi\u00e8ce par pi\u00e8ce ; s\u00e9rie exige m\u00e9thodes statistiques."
        ),
        consigne=(
            "Analyse la d\u00e9marche qualit\u00e9 de L'Or\u00e9al. Explique le lien entre mode "
            "de production et exigences qualit\u00e9."
        ),
        questions=[
            "Quels indicateurs qualit\u00e9 L'Or\u00e9al utilise-t-elle ? Interpr\u00e8te-les.",
            "Quelles actions correctives sont d\u00e9ploy\u00e9es en 2025 ?",
            "Comment le mode de production influence-t-il la d\u00e9marche qualit\u00e9 ?",
        ],
        correction=(
            "1) Indicateurs qualit\u00e9 :\n"
            f"{D}Rebut s\u00e9rie 1,4 % (objectif 1,2 %) : \u00e9cart \u00e0 corriger.\n"
            f"{D}PPM 820 (objectif 600) : d\u00e9fauts par million.\n"
            f"{D}Premium rebut 0,3 % : contr\u00f4le 100 %, exigence \u00e9lev\u00e9e.\n\n"
            "2) Actions 2025 :\n"
            f"{D}ISO 9001 renouvel\u00e9e, formation 5 sens, andon system.\n"
            f"{D}Robotisation : rebut remplissage 2,8 % \u2192 0,9 %.\n\n"
            "3) Lien mode production / qualit\u00e9 :\n"
            f"{D}Unitaire (parfums) : contr\u00f4le pi\u00e8ce par pi\u00e8ce.\n"
            f"{D}S\u00e9rie (shampoings) : SPC, m\u00e9thodes statistiques, andon."
        ),
        attendu="Indicateurs interpr\u00e9t\u00e9s, actions identifi\u00e9es, lien mode/qualit\u00e9.",
        notions=["qualit\u00e9", "taux de rebut", "ISO 9001"],
    ),
    I(
        "e6",
        "Flux pouss\u00e9s et flux tendus chez Danone",
        support=(
            "Danone g\u00e8re deux logiques logistiques. Flux pouss\u00e9s (yaourts GMS) : production "
            "planifi\u00e9e selon pr\u00e9visions, stocks finis 4,2 jours de vente en moyenne, "
            "commerciaux \u00e9coulent les stocks. Co\u00fbt stockage entrep\u00f4t Evian : 890 k\u20ac/mois. "
            "Flux tendus (lait infantile Nutricia) : production lanc\u00e9e \u00e0 r\u00e9ception commande "
            "h\u00f4pital/pharmacie, pas de stock fini, d\u00e9lai 72 h. En 2025, Danone teste flux "
            "tendu sur 5 r\u00e9f\u00e9rences yaourts bio (\u221235 % stocks). Supply chain management "
            "optimise flux physiques et informationnels du fournisseur au client."
        ),
        consigne=(
            "Compare flux pouss\u00e9s et flux tendus chez Danone. Analyse l'impact "
            "sur co\u00fbts, d\u00e9lais et qualit\u00e9."
        ),
        questions=[
            "D\u00e9finis production en flux pouss\u00e9s et en flux tendus.",
            "Quelle logique Danone applique-t-elle \u00e0 chaque segment ?",
            "Quels avantages et limites de chaque approche dans ce contexte ?",
        ],
        correction=(
            "1) Flux pouss\u00e9s vs tendus :\n"
            f"{D}Pouss\u00e9s : production/stocks pilot\u00e9s en amont, commerciaux \u00e9coulent.\n"
            f"{D}Tendus : production d\u00e9clench\u00e9e par commande client, pas de stock.\n\n"
            "2) Application Danone :\n"
            f"{D}Yaourts GMS : flux pouss\u00e9s, 4,2 jours stock.\n"
            f"{D}Nutricia : flux tendus, commande \u2192 production \u2192 livraison 72 h.\n\n"
            "3) Avantages et limites :\n"
            f"{D}Pouss\u00e9s : disponibilit\u00e9 imm\u00e9diate, mais co\u00fbt stock 890 k\u20ac/mois.\n"
            f"{D}Tendus : \u00e9conomie stock, fra\u00eecheur, mais d\u00e9lai contraint.\n"
            f"{D}Test 2025 : flux tendu yaourts bio (\u221235 % stocks)."
        ),
        attendu="Flux pouss\u00e9s/tendus d\u00e9finis, application par segment, analyse co\u00fbts/d\u00e9lais.",
        notions=["flux pouss\u00e9s", "flux tendus", "supply chain management"],
    ),
    I(
        "e7",
        "Workflow et automatisation chez Nestl\u00e9 France",
        support=(
            "Nestl\u00e9 France d\u00e9ploie un workflow ERP (SAP Production) sur l'usine Vittel : "
            "commande client \u2192 planification \u2192 lancement fabrication \u2192 contr\u00f4le qualit\u00e9 "
            "\u2192 exp\u00e9dition. Avant : 18 \u00e9changes email/jour, d\u00e9lai dossier 3,2 jours, "
            "erreurs saisie 2,8 %. Apr\u00e8s workflow (mars 2025) : t\u00e2ches automatis\u00e9es, "
            "visualisation temps r\u00e9el, d\u00e9lai 0,9 jour, erreurs 0,5 %. Workflow = outil "
            "informatique automatisant processus et flux d'informations. Investissement 2,4 M\u20ac, "
            "formation 180 salari\u00e9s, r\u00e9sistance 12 % op\u00e9rateurs seniors."
        ),
        consigne=(
            "Explique le r\u00f4le du workflow dans l'organisation de la production Nestl\u00e9 France. "
            "Analyse gains et limites."
        ),
        questions=[
            "Qu'est-ce qu'un workflow et comment am\u00e9liore-t-il la production ?",
            "Quels gains Nestl\u00e9 France a-t-elle obtenus apr\u00e8s d\u00e9ploiement ?",
            "Quelles limites et conditions de r\u00e9ussite identifies-tu ?",
        ],
        correction=(
            "1) Workflow :\n"
            "Outil informatique automatisant processus et flux d'informations entre t\u00e2ches "
            "successives. Visualisation t\u00e2ches et documents pour tous les acteurs.\n\n"
            "2) Gains Nestl\u00e9 France :\n"
            f"{D}D\u00e9lai dossier 3,2 \u2192 0,9 jour.\n"
            f"{D}Erreurs 2,8 % \u2192 0,5 %.\n"
            f"{D}Productivit\u00e9 administrative, tra\u00e7abilit\u00e9 renforc\u00e9e.\n\n"
            "3) Limites :\n"
            f"{D}Investissement 2,4 M\u20ac, formation n\u00e9cessaire.\n"
            f"{D}R\u00e9sistance 12 % seniors : conduite du changement indispensable."
        ),
        attendu="Workflow d\u00e9fini, gains chiffr\u00e9s, limites et conduite changement.",
        notions=["workflow", "automatisation", "productivit\u00e9"],
    ),
    I(
        "e8",
        "Servuction et r\u00f4le du client chez Schneider Electric",
        support=(
            "Schneider Electric lance en 2025 EcoStruxure Consulting : audit \u00e9nerg\u00e9tique "
            "sur site client (servuction : service + production). Processus : le client transmet "
            "plans b\u00e2timent et factures \u00e9nergie \u2192 Schneider propose diagnostic sous "
            "5 jours \u2192 validation client \u2192 d\u00e9ploiement solutions 4 semaines. "
            "Le client participe en fournissant informations et validant les \u00e9tapes. "
            "Service non stockable : cr\u00e9neau consultant perdu n'est pas r\u00e9cup\u00e9rable. "
            "Tarif : 12 000 \u20ac par audit (vs 3 500 \u20ac produit standard). Satisfaction : 4,7/5."
        ),
        consigne=(
            "Analyse le service EcoStruxure Consulting \u00e0 la lumi\u00e8re de la servuction. "
            "Explique le r\u00f4le du client dans la production du service."
        ),
        questions=[
            "Qu'est-ce que la servuction et quelles caract\u00e9ristiques de la production de services ?",
            "Comment le client participe-t-il \u00e0 la servuction chez Schneider Electric ?",
            "Pourquoi le service est-il non stockable et quelles cons\u00e9quences ?",
        ],
        correction=(
            "1) Servuction :\n"
            "Processus de cr\u00e9ation d'un service ; le client est syst\u00e9matiquement impliqu\u00e9. "
            "Caract\u00e9ristiques : immat\u00e9rialit\u00e9, non stockabilit\u00e9, coproduction.\n\n"
            "2) Participation client Schneider :\n"
            f"{D}Fournit plans b\u00e2timent et factures \u00e9nergie.\n"
            f"{D}Valide diagnostic et d\u00e9ploiement solutions.\n"
            f"{D}Coop\u00e9ration indispensable \u00e0 la qualit\u00e9 du service.\n\n"
            "3) Non stockabilit\u00e9 :\n"
            f"{D}Cr\u00e9neau consultant perdu = perte d\u00e9finitive.\n"
            f"{D}N\u00e9cessit\u00e9 de lisser la demande et planifier les ressources."
        ),
        attendu="Servuction d\u00e9finie, r\u00f4le client expliqu\u00e9, non stockabilit\u00e9 analys\u00e9e.",
        notions=["servuction", "production de services", "coproduction"],
    ),
    I(
        "e9",
        "Qualit\u00e9, flexibilit\u00e9, productivit\u00e9 chez Dassault Aviation",
        support=(
            "Dassault Aviation pilote ses ateliers Rafale via le triptyque QFP (Qualit\u00e9, "
            "Flexibilit\u00e9, Productivit\u00e9). Qualit\u00e9 : rebut 0,8 % (objectif 0,6 %), "
            "PPM 420. Flexibilit\u00e9 : setup changement config avion 18 jours (vs 28 en 2022). "
            "Productivit\u00e9 : 2,4 avions/mois (vs 1,8 en 2020). Actions 2025 : cellule "
            "assemblage modulaire, formation polyvalence 85 techniciens, certification EN 9100. "
            "Les trois dimensions sont interd\u00e9pendantes : am\u00e9liorer l'une peut impacter les autres."
        ),
        consigne=(
            "Pr\u00e9sente le triptyque QFP appliqu\u00e9 chez Dassault Aviation. "
            "Montre les liens entre qualit\u00e9, flexibilit\u00e9 et productivit\u00e9."
        ),
        questions=[
            "Qu'est-ce que le triptyque QFP en organisation de la production ?",
            "Analyse les indicateurs QFP de Dassault Aviation d'apr\u00e8s le support.",
            "Comment les trois dimensions s'influencent-elles mutuellement ?",
        ],
        correction=(
            "1) Triptyque QFP :\n"
            "Qualit\u00e9 (conformit\u00e9, rebut), Flexibilit\u00e9 (adaptation demande), "
            "Productivit\u00e9 (output / ressources). Objectifs simultan\u00e9s de performance industrielle.\n\n"
            "2) Indicateurs Dassault :\n"
            f"{D}Qualit\u00e9 : rebut 0,8 %, PPM 420.\n"
            f"{D}Flexibilit\u00e9 : setup 28 \u2192 18 jours.\n"
            f"{D}Productivit\u00e9 : 1,8 \u2192 2,4 avions/mois.\n\n"
            "3) Interd\u00e9pendance :\n"
            f"{D}Assemblage modulaire am\u00e9liore flexibilit\u00e9 ET productivit\u00e9.\n"
            f"{D}Polyvalence acc\u00e9l\u00e8re setup sans d\u00e9grader qualit\u00e9.\n"
            f"{D}EN 9100 structure la d\u00e9marche qualit\u00e9."
        ),
        attendu="QFP d\u00e9fini, indicateurs interpr\u00e9t\u00e9s, interd\u00e9pendance expliqu\u00e9e.",
        notions=["QFP", "qualit\u00e9", "flexibilit\u00e9", "productivit\u00e9"],
    ),
    I(
        "e10",
        "Synth\u00e8se production chez Stellantis",
        support=(
            "R\u00e9capitulatif Stellantis usine Sochaux 2022-2025. Phase 1 : production s\u00e9rie "
            "308/508, flux pouss\u00e9s. Phase 2 : innovation proc\u00e9d\u00e9s soudure robotis\u00e9e, "
            "rebut 3,2 % \u2192 1,4 %. Phase 3 : flexibilit\u00e9 multi-mod\u00e8les (e-208, 308, "
            "DS4 sur m\u00eame ligne), setup 55 min. Indicateurs : productivit\u00e9 +22 %, "
            "taux charge 81 %, PPM 980. Menaces : concurrence chinoise EV, transition \u00e9lectrique. "
            "Le directeur industriel pr\u00e9pare un m\u00e9mo sur l'\u00e9volution des modes de production "
            "et le pilotage QFP."
        ),
        consigne=(
            "R\u00e9dige une synth\u00e8se structur\u00e9e de l'\u00e9volution de la production Stellantis "
            "Sochaux et des indicateurs mobilis\u00e9s."
        ),
        questions=[
            "Retrace les trois phases d'\u00e9volution de la production Sochaux.",
            "Quels indicateurs qualit\u00e9, flexibilit\u00e9 et productivit\u00e9 sont mobilis\u00e9s ?",
            "Quels d\u00e9fis futurs pour l'organisation de la production ?",
        ],
        correction=(
            "1) Trois phases :\n"
            f"{D}2022 : s\u00e9rie classique, flux pouss\u00e9s.\n"
            f"{D}2023-2024 : innovation proc\u00e9d\u00e9s, qualit\u00e9 am\u00e9lior\u00e9e.\n"
            f"{D}2025 : flexibilit\u00e9 multi-mod\u00e8les, setup r\u00e9duit.\n\n"
            "2) Indicateurs :\n"
            f"{D}Qualit\u00e9 : rebut 1,4 %, PPM 980.\n"
            f"{D}Flexibilit\u00e9 : setup 55 min, multi-mod\u00e8les.\n"
            f"{D}Productivit\u00e9 : +22 %, charge 81 %.\n\n"
            "3) D\u00e9fis futurs :\n"
            f"{D}Transition \u00e9lectrique, concurrence chinoise.\n"
            f"{D}N\u00e9cessit\u00e9 flux tendus et QFP renforc\u00e9."
        ),
        attendu="Synth\u00e8se chronologique, indicateurs vari\u00e9s, perspective strat\u00e9gique.",
        notions=["organisation de la production", "QFP", "innovation de proc\u00e9d\u00e9s"],
    ),
    I(
        "cas1",
        "\u00c9tude de cas : \u00c9quipement industriel et INPI",
        support=(
            "Une PME bretonne d\u00e9pose \u00e0 l'INPI un brevet pour cellule d'assemblage automatis\u00e9e "
            "(1,8 M\u20ac). Contexte : s\u00e9rie 800 pi\u00e8ces/jour, rebut 4,5 %, setup 2 h. "
            "Projet : robot collaboratif + vision artificielle ; cibles rebut 1,5 %, setup 25 min. "
            "INPI \u00e9value la nouveaut\u00e9 proc\u00e9d\u00e9 (vs produit). Financement : Bpifrance "
            "420 k\u20ac, cr\u00e9dit-bail 680 k\u20ac, autofinancement 700 k\u20ac. ROI 3,8 ans. "
            "Brevet proc\u00e9d\u00e9 accord\u00e9 sous 60 jours."
        ),
        consigne=(
            "Analyse le projet d'\u00e9quipement industriel. Mobilise : innovation proc\u00e9d\u00e9, "
            "unitaire/s\u00e9rie, qualit\u00e9/rebut, flexibilit\u00e9, financement investissement."
        ),
        questions=[
            "En quoi ce projet rel\u00e8ve-t-il d'une innovation de proc\u00e9d\u00e9 et non de produit ?",
            "Analyse les gains attendus (rebut, setup, productivit\u00e9).",
            "Quel r\u00f4le de l'INPI dans la protection de l'innovation proc\u00e9d\u00e9 ?",
            "Le montage de financement est-il adapt\u00e9 \u00e0 ce type d'investissement ?",
        ],
        correction=(
            "1) Innovation proc\u00e9d\u00e9 :\n"
            f"{D}Changement m\u00e9thode assemblage (robot, vision) sans nouveau produit.\n"
            f"{D}Changements technique, mat\u00e9riel, logiciel significatifs.\n\n"
            "2) Gains attendus :\n"
            f"{D}Rebut 4,5 % \u2192 1,5 % : qualit\u00e9 am\u00e9lior\u00e9e.\n"
            f"{D}Setup 2 h \u2192 25 min : flexibilit\u00e9 accrue.\n"
            f"{D}Production s\u00e9rie maintenue \u00e0 800 pi\u00e8ces/jour minimum.\n\n"
            "3) R\u00f4le INPI :\n"
            f"{D}Brevet proc\u00e9d\u00e9 prot\u00e8ge l'avantage concurrentiel 20 ans.\n"
            f"{D}Distinction claire innovation proc\u00e9d\u00e9 vs produit.\n\n"
            "4) Financement :\n"
            f"{D}Mix autofinancement + Bpifrance + cr\u00e9dit-bail adapt\u00e9 PME.\n"
            f"{D}ROI 3,8 ans : investissement coh\u00e9rent."
        ),
        attendu="Projet \u00e9quipement analys\u00e9, innovation proc\u00e9d\u00e9 et financement justifi\u00e9s.",
        notions=["innovation de proc\u00e9d\u00e9", "brevet", "investissement industriel"],
    ),
    I(
        "cas2",
        "\u00c9tude de cas : Flux tendus et BPI France",
        support=(
            "BPI France finance une PME agroalimentaire normande (CA 18 M\u20ac) en conversion flux "
            "tendus (12 r\u00e9f\u00e9rences frais). Actuel : flux pouss\u00e9s, stocks 9 jours, "
            "stockage 42 k\u20ac/mois, rebut p\u00e9remption 2,1 %. Projet : pr\u00eat 850 k\u20ac "
            "\u00e0 2,1 % + subvention 180 k\u20ac. Objectifs : stocks 2 jours, rebut 0,8 %, "
            "d\u00e9lai 48 h. Investissements ERP workflow, formation 45 salari\u00e9s. Risques : "
            "ruptures, d\u00e9pendance fournisseurs. KPI 2027 : BFR \u2212320 k\u20ac, productivit\u00e9 +18 %."
        ),
        consigne=(
            "Analyse le projet flux tendus financ\u00e9 par BPI France. Mobilise : flux pouss\u00e9s/tendus, "
            "workflow, qualit\u00e9/rebut, BFR, QFP."
        ),
        questions=[
            "Compare la situation actuelle (flux pouss\u00e9s) et le projet (flux tendus).",
            "Quels investissements et changements organisationnels sont n\u00e9cessaires ?",
            "Analyse les risques et conditions de r\u00e9ussite du flux tendu.",
            "Le financement BPI France est-il justifi\u00e9 par les gains attendus ?",
        ],
        correction=(
            "1) Comparaison flux :\n"
            f"{D}Actuel pouss\u00e9s : stocks 9 jours, co\u00fbt 42 k\u20ac/mois, rebut p\u00e9remption 2,1 %.\n"
            f"{D}Projet tendus : stocks 2 jours, d\u00e9lai 48 h, rebut cible 0,8 %.\n\n"
            "2) Investissements :\n"
            f"{D}ERP workflow pour planification temps r\u00e9el.\n"
            f"{D}Formation 45 salari\u00e9s, refonte supply chain.\n"
            f"{D}Pr\u00eat BPI 850 k\u20ac + subvention 180 k\u20ac.\n\n"
            "3) Risques et conditions :\n"
            f"{D}Fournisseurs fiables et d\u00e9lais courts indispensables.\n"
            f"{D}Risque rupture si pic demande impr\u00e9vu.\n"
            f"{D}Pilotage QFP pour \u00e9quilibrer qualit\u00e9 et d\u00e9lais.\n\n"
            "4) Justification financement :\n"
            f"{D}BFR \u2212320 k\u20ac lib\u00e8re de la tr\u00e9sorerie.\n"
            f"{D}\u00c9conomie stock ~30 k\u20ac/mois + rebut r\u00e9duit.\n"
            f"{D}ROI coh\u00e9rent avec enjeu comp\u00e9titivit\u00e9 agroalimentaire frais."
        ),
        attendu="Projet flux tendus analys\u00e9, risques identifi\u00e9s, financement BPI justifi\u00e9.",
        notions=["flux tendus", "BFR", "workflow", "financement"],
    ),
]
