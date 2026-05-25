import type { SdgnMissionExercise } from "../types";


export const SDGN_CHAP12_EXERCISES: SdgnMissionExercise[] = [
  {
    id: "sdgn12-e1",
    title: "Prix, coût et marge : formule de base",
    type: "Exercice",
    difficulty: "Facile",
    xp: 120,
    minChars: 120,
    support: "Le magasin Intersport revend des chaussures de running achetées 52 € HT au fournisseur et affichées 89 € HT en rayon. Le vendeur explique au client que la différence finance le magasin, le conseil et le SAV. Le manuel retient la simplification : Prix − Coût = Marge.",
    supportTables: [
      { title: "Chaussures running — Intersport (HT)", columns: ["Poste", "Montant (€)"], rows: [["Prix d'achat fournisseur", "52"], ["Prix de vente client", "89"], ["Marge commerciale (à calculer)", "37"]] },
    ],    consigne: "Applique la relation Prix − Coût = Marge. Calcule la marge commerciale unitaire et vérifie que le prix est supérieur au coût.",
    questions: [
      "Quelle est la formule simplifiée du cours ?",
      "Calcule la marge commerciale unitaire sur une paire de chaussures.",
      "Pourquoi le gestionnaire doit-il fixer un prix supérieur au coût ?"
    ],
    correctionModele: "1) Formule :\nPrix de vente − coût (d'achat ou de revient) = marge commerciale.\n\n2) Calcul :\nMarge commerciale unitaire = 89   − 52 = 37 € HT.\nLe prix (89 €) est bien supérieur au coût d'achat (52 €).\n\n3) Prix > coût :\nPour dégager un résultat et couvrir charges du magasin (loyer, salaires, marketing), le prix doit excéder le coût. Sinon, chaque vente appauvrit l'entreprise.",
    attendu: "Formule appliquée, marge 37 €, justification économique.",
    notionsCibles: ["Formule appliquée", "marge 37 €", "justification économique."],
  },
  {
    id: "sdgn12-e2",
    title: "Marge commerciale et taux de marge",
    type: "Exercice",
    difficulty: "Facile",
    xp: 130,
    minChars: 140,
    support: "Le grossiste « ProSnack » achète des barres énergétiques 0,85 € HT et les revend 1,36 € HT aux détaillants. Le responsable commercial suit le taux de marge commerciale (rapport marge / coût d'achat) pour comparer ses références.",
    supportTables: [
      { title: "Barres énergétiques — ProSnack (HT)", columns: ["Indicateur", "Valeur (€)"], rows: [["Prix d'achat HT", "0,85"], ["Prix de vente HT", "1,36"], ["Marge commerciale HT", "0,51"], ["Taux de marge (%)", "60"]] },
    ],    consigne: "Calcule la marge commerciale unitaire puis le taux de marge commerciale en %. Interprète le résultat pour le gestionnaire.",
    questions: [
      "Calcule la marge commerciale unitaire.",
      "Calcule le taux de marge commerciale (marge / coût d'achat × 100).",
      "Que signifie ce taux pour la négociation avec les fournisseurs ?"
    ],
    correctionModele: "1) Marge unitaire :\n1,36   − 0,85 = 0,51 € HT.\n\n2) Taux de marge :\n0,51 / 0,85 × 100 ≈ 60 %.\nSur chaque euro d'achat, ProSnack dégage 0,60 € de marge commerciale.\n\n3) Interprétation :\nUn taux élevé offre une marge de manœuvre pour baisser le prix en promotion ou absorber une hausse du coût fournisseur sans devenir déficitaire sur le produit.",
    attendu: "Marge 0,51 €, taux ≈ 60 %, interprétation gestion.",
    notionsCibles: ["Marge 0", "51 €", "taux ≈ 60 %"],
  },
  {
    id: "sdgn12-e3",
    title: "Coût de revient et marge nette (industrie)",
    type: "Exercice",
    difficulty: "Facile",
    xp: 140,
    minChars: 150,
    support: "L'entreprise industrielle « Lumina LED » fabrique des ampoules connectées. Comptabilité de gestion pour un lot de 10 000 unités : matières 42 000 €, main-d'œuvre directe 28 000 €, énergie atelier 6 000 €, amortissement machines 8 000 €, frais logistique usine 4 000 €. Le prix de vente HT retenu est 18 € par ampoule.",
    supportTables: [
      { title: "Coût de revient — ampoule Lumina LED (lot 10 000)", columns: ["Charge", "Montant (€)"], rows: [["Matières premières", "42 000"], ["Main-d'œuvre directe", "28 000"], ["Énergie atelier", "6 000"], ["Amortissement machines", "8 000"], ["Logistique usine", "4 000"], ["Coût de revient total", "88 000"], ["Coût unitaire (÷ 10 000)", "8,80"], ["Prix de vente unitaire HT", "18,00"]] },
    ],    consigne: "Calcule le coût de revient total puis unitaire. Déduis la marge nette (résultat analytique) unitaire et totale sur le lot.",
    questions: [
      "Qu'est-ce que le coût de revient d'un produit ?",
      "Calcule le coût de revient total et unitaire (10 000 unités).",
      "Calcule la marge nette unitaire et la marge nette totale."
    ],
    correctionModele: "1) Coût de revient :\nSomme des charges affectées à la production du produit (matières, MO, énergie, etc.).\n\n2) Coût total et unitaire :\nTotal = 42 000 + 28 000 + 6 000 + 8 000 + 4 000 = 88 000 €.\nCoût unitaire = 88 000 / 10 000 = 8,80 € HT.\n\n3) Marge nette :\nMarge unitaire = 18   − 8,80 = 9,20 €.\nMarge totale = 9,20 × 10 000 = 92 000 € (ou 180 000   − 88 000).",
    attendu: "Coût revient 88 000 € / 8,80 € unité, marge nette calculée.",
    notionsCibles: ["Coût revient 88 000 € / 8", "80 € unité", "marge nette calculée."],
  },
  {
    id: "sdgn12-e4",
    title: "Baisse des prix et concurrence (cas 1)",
    type: "Exercice",
    difficulty: "Moyen",
    xp: 180,
    minChars: 170,
    support: "Face à un concurrent low-cost, le distributeur « ElectroPlus » baisse de 10 % le prix HT de ses téléviseurs 55 pouces, passant de 600 € à 540 €, tout en maintenant son prix d'achat à 420 €. Les ventes mensuelles passent de 800 à 1 150 unités. La direction se demande si la performance financière s'améliore malgré la baisse de marge unitaire.",
    supportTables: [
      { title: "Téléviseurs 55'' — ElectroPlus", columns: ["Scénario", "Prix vente HT (€)", "Coût achat (€)", "Marge unitaire (€)", "Quantités", "Marge totale (€)"], rows: [["Avant", "600", "420", "180", "800", "144 000"], ["Après −10 %", "540", "420", "120", "1 150", "138 000"]] },
    ],    consigne: "Analyse le cas 1 du manuel : baisse des prix, coûts maintenus. Calcule marge unitaire avant/après et marge totale avant/après. Conclus sur la performance financière.",
    questions: [
      "Calcule la marge commerciale unitaire avant et après la baisse de prix.",
      "Calcule la marge totale mensuelle avant et après (quantités du support).",
      "La performance financière progresse-t-elle ? Discute le risque du manuel."
    ],
    correctionModele: "1) Marge unitaire :\nAvant : 600   − 420 = 180 €. Après : 540   − 420 = 120 € (−60 € par unité).\n\n2) Marge totale :\nAvant : 180 × 800 = 144 000 €.\nAprès : 120 × 1 150 = 138 000 €.\n\n3) Conclusion :\nMalgré +350 ventes, la marge totale baisse de 6 000 € : la hausse des volumes ne compense pas assez la chute de marge unitaire. Performance commerciale ↑ (parts de marché), performance financière ↓ (risque du manuel si volumes n'explosent pas).",
    attendu: "Calculs avant/après, distinction performance commerciale vs financière.",
    notionsCibles: ["Calculs avant/après"],
  },
  {
    id: "sdgn12-e5",
    title: "Qualité, coût et arbitrage",
    type: "Exercice",
    difficulty: "Moyen",
    xp: 190,
    minChars: 180,
    support: "La fromagerie artisanale « Brie du Val » peut choisir entre lait standard (coût de revient 2,40 €/unité) et lait AOP (3,10 €/unité). Le prix de vente envisagé est 6,50 €. Une étude qualité montre que le lait AOP augmente la satisfaction clients de 18 points. Le concurrent industriel vend à 4,90 € avec un coût de 2,10 €.",
    supportTables: [
      { title: "Fromage unitaire — Brie du Val (HT)", columns: ["Option", "Coût revient (€)", "Prix vente (€)", "Marge nette (€)"], rows: [["Lait standard", "2,40", "6,50", "4,10"], ["Lait AOP", "3,10", "6,50", "3,40"], ["Concurrent industriel", "2,10", "4,90", "2,80"]] },
    ],    consigne: "Mobilise la relation Qualité ↑ ⇒ Coût ↑. Calcule les marges nettes unitaires pour les deux options et propose un arbitrage prix-qualité-coût.",
    questions: [
      "Quel lien le manuel établit-il entre qualité et coût ?",
      "Calcule la marge nette unitaire avec lait standard puis avec lait AOP.",
      "Quel arbitrage recommandes-tu face au concurrent à 4,90 € ?"
    ],
    correctionModele: "1) Lien qualité / coût :\nEn simplification : hausse de la qualité entraîne hausse du coût (matières, temps, finitions).\n\n2) Marges unitaires :\nStandard : 6,50   − 2,40 = 4,10 €.\nAOP : 6,50   − 3,10 = 3,40 € (marge unitaire plus faible).\n\n3) Arbitrage :\nImpossible d'avoir prix bas, qualité maximale et marge élevée simultanément. Stratégie premium : justifier 6,50 € par label AOP et satisfaction (+18), communication sur la qualité. Sinon baisser le prix ou accepter une marge réduite pour gagner des volumes.",
    attendu: "Lien qualité-coût, deux marges calculées, arbitrage cohérent.",
    notionsCibles: ["Lien qualité-coût", "deux marges calculées", "arbitrage cohérent."],
  },
  {
    id: "sdgn12-e6",
    title: "Déterminants du prix : concurrence et innovation",
    type: "Exercice",
    difficulty: "Moyen",
    xp: 210,
    minChars: 190,
    support: "Sur le marché des smartphones, Samsung aligne parfois ses prix sur Apple pour des gammes comparables (concurrence). Apple, grâce à l'innovation (puce propriétaire, écosystème iOS), pratique des prix supérieurs tout en vendant des volumes élevés. EasyJet modifie ses tarifs selon la saison (demande estivale forte) : un vol Paris-Nice peut passer de 49 € à 189 € selon la période.",
    consigne: "Illustre trois déterminants de la fixation du prix : concurrence, saisonnalité, innovation. Explique l'effet sur la marge.",
    questions: [
      "Comment la concurrence contraint-elle Samsung ?",
      "Quel rôle de la saisonnalité chez EasyJet ?",
      "Pourquoi Apple peut-elle pratiquer un prix élevé avec de fortes quantités ?"
    ],
    correctionModele: "1) Concurrence :\nProduits homogènes : un prix trop élevé fait fuir les clients vers des offres similaires moins chères : Samsung aligne ses prix.\n\n2) Saisonnalité :\nDemande variable : tarifs dynamiques pour maximiser le profit (prix élevés quand demande forte, bas pour remplir avions hors pic).\n\n3) Innovation :\nProduit différencié : Apple fixe un prix premium justifié par l'innovation ; volumes élevés grâce à l'avantage concurrentiel : marge unitaire élevée × quantités → performance financière.",
    attendu: "Trois déterminants illustrés, effet sur prix et marge expliqué.",
    notionsCibles: ["Trois déterminants illustrés", "effet sur prix et marge expliqué."],
  },
  {
    id: "sdgn12-e7",
    title: "Coût de revient et marge fixe",
    type: "Exercice",
    difficulty: "Moyen",
    xp: 230,
    minChars: 160,
    support: "La PME « Menuiseries Dupont » applique une marge forfaitaire de 35 % sur le coût de revient pour fixer ses prix HT. Pour une porte sur mesure, le coût de revient est 420 € (bois, MO, finition). Un concurrent local vend une porte équivalente 580 € HT. Dupont constate une perte de devis sur deux chantiers du trimestre.",
    supportTables: [
      { title: "Porte sur mesure — Menuiseries Dupont", columns: ["Élément", "Montant (€ HT)"], rows: [["Coût de revient", "420"], ["Taux marge appliqué", "35 %"], ["Prix de vente calculé (CR × 1,35)", "567"], ["Prix concurrent", "580"]] },
    ],    consigne: "Calcule le prix de vente par la méthode coût de revient + marge fixe. Compare au concurrent et analyse le risque du manuel (décalage avec la concurrence).",
    questions: [
      "Calcule le prix HT avec une marge de 35 % sur coût de revient (Prix = CR × 1,35).",
      "Compare avec le prix du concurrent (580 €).",
      "Quel risque si le coût de revient est élevé et la concurrence basse ?"
    ],
    correctionModele: "1) Prix Dupont :\n420 × 1,35 = 567 € HT.\n\n2) Comparaison :\n567 € < 580 € : prix théoriquement compétitif, mais devis perdus : autres critères (délai, réputation) ou coût réel supérieur au CR calculé.\n\n3) Risque marge fixe :\nSi le CR est sous-estimé ou la concurrence baisse ses prix, la marge forfaitaire peut produire un prix trop élevé et faire perdre des volumes — d'où l'intérêt d'intégrer concurrence et attentes clients, pas seulement le CR.",
    attendu: "Prix 567 € calculé, comparaison concurrent, risque identifié.",
    notionsCibles: ["Prix 567 € calculé", "comparaison concurrent", "risque identifié."],
  },
  {
    id: "sdgn12-e8",
    title: "Maîtrise des coûts et charges contraintes",
    type: "Exercice",
    difficulty: "Difficile",
    xp: 260,
    minChars: 200,
    support: "L'entreprise de transport « RapidoColis » voit son coût de revient par colis passer de 3,80 € à 4,45 € : carburant (+0,40 €), masse salariale stable, loyer entrepôt (+0,15 €), emballages (-0,05 € après renégociation). Le directeur peut réduire les intérimaires mais pas le carburant. Il hésite entre augmenter le prix client (actuellement 7,20 €) ou accepter une marge réduite.",
    supportTables: [
      { title: "Coût de revient par colis — RapidoColis", columns: ["Poste", "Avant (€)", "Après (€)", "Écart"], rows: [["Carburant", "1,20", "1,60", "+0,40"], ["Masse salariale", "1,50", "1,50", "0"], ["Loyer entrepôt", "0,55", "0,70", "+0,15"], ["Emballages", "0,55", "0,50", "−0,05"], ["Autres", "0,00", "0,15", "+0,15"], ["Coût de revient total", "3,80", "4,45", "+0,65"]] },
    ],    consigne: "Analyse la maîtrise des coûts : quelles charges sont ajustables ? Calcule la marge avant et après hausse du coût de revient.",
    questions: [
      "Calcule la marge unitaire avant (CR 3,80 €) et après (CR 4,45 €) au prix 7,20 €.",
      "Quelles charges sont plus ou moins maîtrisables selon le support ?",
      "Quels leviers pour le gestionnaire (prix, coûts, volumes) ?"
    ],
    correctionModele: "1) Marges :\nAvant : 7,20   − 3,80 = 3,40 €.\nAprès : 7,20   − 4,45 = 2,75 € (−0,65 € par colis).\n\n2) Maîtrise des charges :\n— Carburant : contrainte externe, peu maîtrisable.\n— Intérimaires : ajustable (sureffectif).\n— Loyer : partiellement maîtrisable (renégociation).\n— Emballages : action corrective réussie (−0,05 €).\n\n3) Leviers :\nAugmenter le prix (risque volumes), réduire coûts maîtrisables, ou compenser par hausse des quantités livrées. Arbitrage selon concurrence et attentes clients.",
    attendu: "Marges calculées, charges classées, leviers identifiés.",
    notionsCibles: ["Marges calculées", "charges classées", "leviers identifiés."],
  },
  {
    id: "sdgn12-e9",
    title: "Marge unitaire vs marge totale",
    type: "Exercice",
    difficulty: "Difficile",
    xp: 280,
    minChars: 210,
    support: "La marque de café en capsules « Arôma » augmente son prix unitaire de 4,20 € à 4,80 € (coût de revient stable à 1,90 €). Les ventes mensuelles passent de 50 000 à 38 000 boîtes. Le directeur financier argue que « la hausse de prix améliore toujours la performance » ; le responsable commercial conteste.",
    supportTables: [
      { title: "Capsules Arôma — comparatif", columns: ["Scénario", "Prix (€)", "CR (€)", "Marge unitaire (€)", "Quantités", "Marge totale (€)"], rows: [["Avant", "4,20", "1,90", "2,30", "50 000", "115 000"], ["Après hausse prix", "4,80", "1,90", "2,90", "38 000", "110 200"]] },
    ],    consigne: "Calcule marge unitaire et marge totale avant/après. Montre pourquoi l'analyse de la marge totale est plus pertinente pour le suivi de performance.",
    questions: [
      "Calcule la marge unitaire avant et après.",
      "Calcule la marge totale mensuelle avant et après.",
      "Qui a raison entre directeur financier et responsable commercial ?"
    ],
    correctionModele: "1) Marge unitaire :\nAvant : 4,20   − 1,90 = 2,30 €. Après : 4,80   − 1,90 = 2,90 € (+0,60 €).\n\n2) Marge totale :\nAvant : 2,30 × 50 000 = 115 000 €.\nAprès : 2,90 × 38 000 = 110 200 €.\n\n3) Conclusion :\nLe responsable commercial a raison : marge unitaire ↑ mais marge totale ↓ de 4 800 €. Hausse de prix sans tenir compte des quantités peut dégrader la performance globale — d'où l'intérêt de suivre la marge totale.",
    attendu: "Calculs unitaire et total, conclusion contre l'argument simpliste.",
    notionsCibles: ["Calculs unitaire et total", "conclusion contre l'argument simpliste."],
  },
  {
    id: "sdgn12-e10",
    title: "Simulation et arbitrage gestionnaire",
    type: "Exercice",
    difficulty: "Tres difficile",
    xp: 360,
    minChars: 240,
    support: "Le gestionnaire de « GreenBike » envisage trois scénarios pour un vélo électrique (coût de revient 720 €) : (A) prix 999 €, ventes 1 200 ; (B) prix 899 €, ventes 1 550 ; (C) amélioration qualité batterie, CR 780 €, prix 1 049 €, ventes 1 100.",
    supportTables: [
      { title: "Simulation — vélo GreenBike", columns: ["Scénario", "CR (€)", "Prix (€)", "Marge unitaire (€)", "Quantités", "Marge totale (€)"], rows: [["A — prix haut", "720", "999", "279", "1 200", "334 800"], ["B — prix bas", "720", "899", "179", "1 550", "277 450"], ["C — qualité ↑", "780", "1 049", "269", "1 100", "295 900"]] },
    ],    consigne: "Pour chaque scénario, calcule la marge unitaire et la marge totale. Recommande un arbitrage en précisant l'objectif prioritaire (marge, volume, qualité).",
    questions: [
      "Remplis le tableau : marge unitaire et marge totale pour A, B et C.",
      "Quel scénario maximise la marge totale ?",
      "Si la priorité est la part de marché, quel scénario choisir ? Justifie."
    ],
    correctionModele: "1) Tableau :\nA : marge unitaire 279 €, totale 334 800 €.\nB : marge unitaire 179 €, totale 277 450 €.\nC : marge unitaire 269 €, totale 295 900 €.\n\n2) Maximisation marge totale :\nScénario A (334 800 €).\n\n3) Priorité part de marché :\nScénario B : prix le plus bas, volumes les plus élevés (1 550) — performance commerciale ↑, mais marge totale plus faible. Arbitrage nécessaire selon objectif défini.",
    attendu: "Trois scénarios calculés, recommandation liée à l'objectif.",
    notionsCibles: ["Trois scénarios calculés", "recommandation liée à l'objectif."],
  },
  {
    id: "sdgn12-cas1",
    title: "Étude de cas : Carrefour et la guerre des prix",
    type: "Etude de cas",
    difficulty: "Difficile",
    xp: 560,
    minChars: 400,
    support: "Carrefour lance une campagne « prix bas garantis » sur 500 références alimentaires. Exemple yaourts nature : prix d'achat 0,42 €, prix avant 0,89 €, prix promo 0,69 €, ventes hebdomadaires passent de 12 000 à 19 500 pots. Sur le rayon entier, la marge totale hebdomadaire baisse de 8 % mais le trafic magasin progresse de 4 %. Un concurrent hard-discount pratique 0,65 €. Carrefour doit arbitrer entre marge, volume et image prix.",
    supportTables: [
      { title: "Yaourt nature — Carrefour (semaine)", columns: ["Indicateur", "Avant promo", "Promo"], rows: [["Prix d'achat (€)", "0,42", "0,42"], ["Prix de vente (€)", "0,89", "0,69"], ["Marge unitaire (€)", "0,47", "0,27"], ["Quantités vendues", "12 000", "19 500"], ["Marge totale (€)", "5 640", "5 265"], ["Prix concurrent (€)", "—", "0,65"]] },
    ],    consigne: "Analyse complète : marge commerciale, effet baisse de prix, concurrence, performance commerciale vs financière. Propose une recommandation argumentée.",
    questions: [
      "Calcule marge unitaire et marge totale yaourt avant/après promo.",
      "Compare au concurrent à 0,65 € : Carrefour est-il compétitif ?",
      "Interprète la baisse de marge totale du rayon (−8 %) et la hausse de trafic (+4 %).",
      "Quels déterminants du prix mobilises-tu (concurrence, coût, attentes) ?",
      "Synthèse (12-15 lignes) : quel arbitrage pour le gestionnaire ?"
    ],
    correctionModele: "1) Yaourt :\nAvant : 0,89   − 0,42 = 0,47 € ; totale 0,47 × 12 000 = 5 640 €.\nAprès : 0,69   − 0,42 = 0,27 € ; totale 0,27 × 19 500 = 5 265 €.\nMarge unitaire ↓, marge totale ↓ malgré volumes ↓.\n\n2) Concurrence :\n0,69 € > 0,65 € : Carrefour reste légèrement plus cher ; l'image « garantie » doit compenser.\n\n3) Performances :\nCommerciale ↑ (trafic, volumes). Financière rayon ↓. Effet panier global possible.\n\n4) Déterminants :\nConcurrence hard-discount, coût d'achat maintenu, attentes clients prix bas.\n\n5) Synthèse :\nLe gestionnaire ne peut pas optimiser prix, marge et qualité simultanément. Promo = sacrifice de marge pour parts de marché et trafic. Il doit simuler l'impact sur le CA total magasin et éviter une guerre des prix sans fin.",
    attendu: "Cas distributeur complet, calculs, arbitrage prix/marge/volume.",
    notionsCibles: ["Cas distributeur complet", "calculs", "arbitrage prix/marge/volume."],
  },
  {
    id: "sdgn12-cas2",
    title: "Étude de cas : Renault, qualité et coût de revient",
    type: "Etude de cas",
    difficulty: "Tres difficile",
    xp: 620,
    minChars: 450,
    support: "Renault lance une motorisation hybride : coût de revient estimé 14 200 € par véhicule (batterie + R&D), prix catalogue 28 900 €. La marge nette unitaire cible est supérieure à la version thermique (CR 11 800 €, prix 24 500 €, marge 12 700 €). Les charges R&D ne sont pas toutes maîtrisables à court terme. Toyota propose un modèle hybride à 27 400 €. Les clients exigent une garantie batterie 8 ans (qualité perçue). Renault simule une baisse de prix à 27 500 € : volumes +15 % mais marge unitaire en baisse.",
    supportTables: [
      { title: "Motorisations Renault — comparatif", columns: ["Version", "CR (€)", "Prix catalogue (€)", "Marge nette (€)"], rows: [["Thermique", "11 800", "24 500", "12 700"], ["Hybride", "14 200", "28 900", "14 700"], ["Hybride (simulation)", "14 200", "27 500", "13 300"], ["Toyota hybride concurrent", "—", "27 400", "—"]] },
    ],    consigne: "Étude type bac : coût de revient, marge nette, qualité, concurrence, maîtrise des coûts, arbitrage. Calcule et compare thermique vs hybride.",
    questions: [
      "Calcule la marge nette unitaire thermique et hybride (prix catalogue).",
      "Pourquoi le coût de revient hybride est-il plus élevé ? Est-ce une « mauvaise maîtrise » ?",
      "Analyse l'effet de la simulation à 27 500 € sur marge unitaire et performance.",
      "Quel rôle de l'innovation et de la concurrence (Toyota) dans la fixation du prix ?",
      "Synthèse (15 lignes) : arbitrage prix-qualité-coût pour Renault."
    ],
    correctionModele: "1) Marges catalogue :\nThermique : 24 500   − 11 800 = 12 700 €.\nHybride : 28 900   − 14 200 = 14 700 €.\n\n2) Coût hybride :\nHausse liée à qualité/innovation (batterie, R&D), pas seulement inefficience. Charges R&D contraintes à court terme, amorties sur volumes futurs.\n\n3) Simulation 27 500 € :\nMarge unitaire = 27 500   − 14 200 = 13 300 € (< 14 700 €). Volumes +15 % : performance commerciale ↑, marge totale à simuler selon quantités de base.\n\n4) Innovation et concurrence :\nInnovation justifie prix premium ; Toyota à 27 400 € impose contrainte concurrentielle.\n\n5) Synthèse :\nRenault arbitre entre différenciation qualité (garantie 8 ans), coût élevé et pression prix. Baisser le prix sans réduire le CR fragilise la marge ; améliorer la qualité sans prix adapté détruit la performance financière. Simulation et objectifs (marge vs parts de marché) sont indispensables.",
    attendu: "Cas industriel, marges calculées, qualité/coût/concurrence articulés.",
    notionsCibles: ["Cas industriel", "marges calculées", "qualité/coût/concurrence articulés."],
  },
];
