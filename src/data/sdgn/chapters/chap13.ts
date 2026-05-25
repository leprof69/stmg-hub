import type { SdgnMissionExercise } from "../types";


export const SDGN_CHAP13_EXERCISES: SdgnMissionExercise[] = [
  {
    id: "sdgn13-e1",
    title: "Performance : définition et étapes",
    type: "Exercice",
    difficulty: "Facile",
    xp: 120,
    minChars: 120,
    support: "Le club de handball « HBC Nantes » fixe pour la saison 2025-2026 l'objectif d'atteindre les demi-finales de championnat (résultat sportif) avec un budget salarial plafonné (moyens). En mars, l'équipe est éliminée en quarts : l'objectif n'est pas atteint : échec. La saison précédente, avec le même budget mais une préparation optimisée (moyens contraints), le club avait atteint les demies : on parle alors d'atteinte efficiente des objectifs.",
    consigne: "Définis la performance et décompose la démarche en trois étapes du manuel. Distingue échec, performance et atteinte efficiente.",
    questions: [
      "Qu'est-ce que la performance selon le cours ?",
      "Applique les trois étapes (objectifs, moyens, résultat) au HBC Nantes.",
      "Quelle différence entre efficacité et efficiente dans le support ?"
    ],
    correctionModele: "1) Performance :\nAtteinte d'objectifs prédéfinis. Une fois l'objectif atteint, il devient performance ; sinon, échec.\n\n2) Trois étapes :\n— Objectifs : demi-finales, budget plafonné.\n— Moyens : effectif, préparation, entraînements.\n— Résultat : élimination quarts (2025-26) = échec ; demies saison précédente = performance.\n\n3) Efficacité vs efficiente :\nEfficiente : objectif atteint avec ressources contraintes/optimales (saison précédente). Efficacité : ressources non optimisées malgré des efforts — ici échec 2025-26 malgré budget maîtrisé, il manquait l'atteinte du résultat.",
    attendu: "Définition performance, trois étapes, distinction efficiente/efficacité.",
    notionsCibles: ["performance", "trois étapes", "efficiente/efficacité."],
  },
  {
    id: "sdgn13-e2",
    title: "Objectifs mesurables et SMART",
    type: "Exercice",
    difficulty: "Facile",
    xp: 130,
    minChars: 140,
    support: "La directrice de « Beauté & Co » fixe : « augmenter le chiffre d'affaires e-commerce de 8 % sur 12 mois », « porter le taux de satisfaction client à 85 % d'ici juin », « réduire le délai de livraison moyen à 48 h maximum ». Le comité de direction refuse l'objectif « améliorer l'ambiance au travail » tant qu'il n'est pas accompagné d'indicateurs (enquête trimestrielle, taux d'absentéisme).",
    consigne: "Explique les qualités des objectifs (compréhensibles, mesurables, réalisables, limités dans le temps). Classe les objectifs du support en quantitatifs ou qualitatifs.",
    questions: [
      "Quelles qualités doit respecter un bon objectif ?",
      "Classe chaque objectif de Beauté & Co (quantitatif / qualitatif) et justifie.",
      "Pourquoi l'objectif « ambiance » doit-il être précisé ?"
    ],
    correctionModele: "1) Qualités des objectifs :\nCompréhensibles (vocabulaire commun), mesurables (indicateurs), réalisables, limités dans le temps.\n\n2) Classification :\n— CA +8 % / 12 mois : quantitatif (euros, %).\n— Satisfaction 85 % : qualitatif rendu mesurable par enquête.\n— Délai 48 h max : quantitatif (temps).\n— Ambiance : qualitatif tant qu'indicateurs absents.\n\n3) Précision nécessaire :\nSans indicateurs (enquête, absentéisme), on ne peut pas savoir si l'objectif est atteint — la performance n'est pas vérifiable.",
    attendu: "Qualités rappelées, classification correcte, ambiance à indicateurs.",
    notionsCibles: ["Qualités rappelées", "classification correcte", "ambiance à indicateurs."],
  },
  {
    id: "sdgn13-e3",
    title: "Efficacité et efficiente dans l'entreprise",
    type: "Exercice",
    difficulty: "Facile",
    xp: 140,
    minChars: 150,
    support: "La logisticienne « Express Nord » livre 98 % des colis en 24 h avec 120 salariés (année N). En N+1, elle investit dans un tri automatisé : 99 % en 24 h avec 95 salariés. Même objectif qualité, moins de ressources humaines → atteinte plus efficiente. Une filiale teste 99,5 % en 24 h mais avec 140 salariés et heures supplémentaires : résultat légèrement supérieur mais non efficient (ressources non optimisées).",
    consigne: "Illustre performance, efficacité et atteinte efficiente avec les deux filiales.",
    questions: [
      "Quel scénario correspond à une atteinte efficiente ?",
      "Pourquoi la filiale test n'est-elle pas efficiente malgré un meilleur taux ?",
      "Quel lien avec la recherche de performance de l'organisation ?"
    ],
    correctionModele: "1) Atteinte efficiente :\nN+1 Express Nord : objectif atteint (99 % en 24 h) avec moins de salariés — ressources optimisées.\n\n2) Filiale test :\nPerformance légèrement supérieure (99,5 %) mais surconsommation de moyens (140 salariés, heures sup.) → efficacité limitée, pas d'efficiente.\n\n3) Lien organisation :\nLa performance ne se résume pas au résultat : il faut évaluer le rapport résultat / ressources pour piloter durablement.",
    attendu: "Efficiente vs efficacité illustrés, lien pilotage.",
    notionsCibles: ["Efficiente vs efficacité illustrés", "lien pilotage."],
  },
  {
    id: "sdgn13-e4",
    title: "Performance commerciale : quantités vendues",
    type: "Exercice",
    difficulty: "Moyen",
    xp: 180,
    minChars: 160,
    support: "Le fabricant « BrushClean » vend des brosses à dents électriques. En 2024 : 420 000 unités. En 2025 : 465 000 unités (+10,7 %). Le directeur commercial affirme que la performance commerciale progresse car la capacité à vendre augmente. Le marketing rappelle que le marché total a crû de 15 % : la part de marché pourrait malgré tout baisser.",
    supportTables: [
      { title: "Ventes BrushClean (unités)", columns: ["Année", "Quantités", "Évolution"], rows: [["2024", "420 000", "—"], ["2025", "465 000", "+10,7 %"], ["Croissance marché", "—", "+15 %"]] },
    ],    consigne: "Définis la performance commerciale et explique le rôle des quantités vendues. Introduis la limite de l'indicateur seul.",
    questions: [
      "Qu'est-ce que la performance commerciale ?",
      "Calcule et commente l'évolution des quantités vendues.",
      "Pourquoi faut-il compléter par d'autres indicateurs (CA, part de marché) ?"
    ],
    correctionModele: "1) Performance commerciale :\nNiveau d'atteinte des objectifs du domaine commercial, apprécié notamment par les quantités vendues (unités).\n\n2) Évolution quantités :\n465 000 vs 420 000 = +45 000 unités, soit +10,7 %. Capacité à vendre en hausse.\n\n3) Limite :\nSi le marché croît plus vite (+15 %), BrushClean peut perdre des parts malgré des volumes en hausse — d'où le CA et la part de marché indispensables.",
    attendu: "Définition, calcul +10,7 %, limite de l'indicateur volumes.",
    notionsCibles: ["Définition", "+10", "limite de l'indicateur volumes."],
  },
  {
    id: "sdgn13-e5",
    title: "Chiffre d'affaires et évolution",
    type: "Exercice",
    difficulty: "Moyen",
    xp: 190,
    minChars: 150,
    support: "Le groupe Decathlon publie pour le rayon cycle (France) : CA 2023 = 892 M€, CA 2024 = 934 M€. Le directeur financier calcule l'évolution en valeur et en pourcentage. Le rayon piscine, lui, passe de 210 M€ à 198 M€ sur la même période.",
    supportTables: [
      { title: "CA par rayon — Decathlon France (M€)", columns: ["Rayon", "2023", "2024", "Évolution (M€)", "Évolution (%)"], rows: [["Cycle", "892", "934", "+42", "+4,7 %"], ["Piscine", "210", "198", "?12", "?5,7 %"]] },
    ],    consigne: "Calcule l'évolution du CA du rayon cycle (valeur et %). Interprète la performance commerciale. Compare avec le rayon piscine.",
    questions: [
      "Calcule l'évolution du CA cycle entre 2023 et 2024 (€ et %).",
      "La performance commerciale du rayon cycle progresse-t-elle ?",
      "Interprète l'évolution du rayon piscine."
    ],
    correctionModele: "1) Évolution cycle :\n934  − 892 = +42 M€.\n+42 / 892 × 100 ≈ +4,7 %.\n\n2) Performance cycle :\nCA en hausse : performance commerciale positive sur la période (ventes en valeur augmentent).\n\n3) Rayon piscine :\n198  − 210 = −12 M€, soit environ ?5,7 %. Performance commerciale en baisse — analyse par nature d'activité nécessaire (saisonnalité, concurrence).",
    attendu: "Calcul +4,7 %, interprétation hausse/baisse par rayon.",
    notionsCibles: ["+4", "interprétation hausse/baisse par rayon."],
  },
  {
    id: "sdgn13-e6",
    title: "Part de marché",
    type: "Exercice",
    difficulty: "Moyen",
    xp: 210,
    minChars: 170,
    support: "Sur le marché français des pizzas surgelées, les CA 2024 sont : Picard 186 M€, Marie 124 M€, Marque distributeur 298 M€, autres 92 M€. Total marché 700 M€. Marie passe de 118 M€ (2023) à 124 M€ (2024) mais son PDG s'inquiète : la part de marché recule selon les derniers panels.",
    supportTables: [
      { title: "Marché pizzas surgelées (M€)", columns: ["Acteur", "CA 2024", "Part 2024 (%)"], rows: [["Marque distributeur", "298", "42,6"], ["Picard", "186", "26,6"], ["Marie", "124", "17,7"], ["Autres", "92", "13,1"], ["Total marché", "700", "100"]] },
      { title: "Marie — évolution", columns: ["Année", "CA Marie (M€)", "Marché total (M€)", "Part Marie (%)"], rows: [["2023", "118", "680", "17,4"], ["2024", "124", "750", "16,5"]] },
    ],    consigne: "Calcule la part de marché de Marie en 2023 et 2024 (en supposant marché total 2023 = 680 M€). Explique comment le CA peut augmenter alors que la part de marché baisse.",
    questions: [
      "Calcule la part de marché de Marie en 2023 et 2024.",
      "Pourquoi Marie peut-elle voir son CA augmenter et sa part de marché diminuer ?",
      "Quel objectif stratégique si Marie veut accroître sa performance commerciale ?"
    ],
    correctionModele: "1) Parts de marché Marie :\n2023 : 118 / 680 × 100  − 17,4 %.\n2024 : 124 / 700 × 100  − 17,7 % (si marché 700 M€, légère hausse — le support suggère une baisse si le marché a crû plus vite ; avec marché 2024 à 750 M€ par ex. : 124/750 = 16,5 %).\nExemple cohérent avec énoncé « part recule » : marché 2024 = 750 M€ → 16,5 % < 17,4 %.\n\n2) CA ↑ et part ↓ :\nLe marché global croît plus vite que les ventes de Marie : elle vend plus en valeur mais moins vite que le secteur.\n\n3) Objectif :\nVendre davantage que les concurrents pour gagner des parts — pas seulement augmenter le CA.",
    attendu: "Formule part de marché, paradoxe CA/part expliqué.",
    notionsCibles: ["Formule part de marché", "paradoxe CA/part expliqué."],
  },
  {
    id: "sdgn13-e7",
    title: "Fidélité et performance commerciale",
    type: "Exercice",
    difficulty: "Moyen",
    xp: 230,
    minChars: 180,
    support: "Sephora France compte 4,2 millions de membres du programme Beauty Insider. Le taux de réachat sous 90 jours est de 64 % (contre 51 % chez un concurrent sans programme). Les clients fidèles dépensent en moyenne 186 €/an contre 72 € pour les acheteurs occasionnels. Une campagne e-mail ciblée augmente le réachat de 4 points en trimestre.",
    supportTables: [
      { title: "Fidélité — Sephora France", columns: ["Indicateur", "Sephora", "Concurrent"], rows: [["Membres programme", "4,2 M", "—"], ["Taux réachat < 90 jours", "64 %", "51 %"], ["Dépense annuelle fidèle (€)", "186", "—"], ["Dépense annuelle occasionnel (€)", "72", "—"]] },
    ],    consigne: "Explique le rôle de la fidélité comme indicateur de performance commerciale. Analyse les chiffres Sephora.",
    questions: [
      "Pourquoi la fidélité est-elle un indicateur de performance commerciale ?",
      "Compare les dépenses fidèles / occasionnels et le taux de réachat.",
      "Quel effet de la campagne e-mail sur la performance ?"
    ],
    correctionModele: "1) Fidélité :\nLes clients satisfaits rachètent : la fidélité stimule les ventes récurrentes et réduit la dépendance à l'acquisition de nouveaux clients.\n\n2) Chiffres Sephora :\nRéachat 64 % > 51 % concurrent : meilleure rétention. Panier annuel fidèle 186 € vs 72 € : la fidélité multiplie la valeur client.\n\n3) Campagne e-mail :\n+4 points de réachat : action de communication améliore la performance commerciale mesurable sur l'indicateur fidélité.",
    attendu: "Fidélité définie, chiffres interprétés, lien campagne/performance.",
    notionsCibles: ["Fidélité définie", "chiffres interprétés", "lien campagne/performance."],
  },
  {
    id: "sdgn13-e8",
    title: "Rentabilité et profitabilité",
    type: "Exercice",
    difficulty: "Difficile",
    xp: 260,
    minChars: 190,
    support: "L'entreprise « TechPrint » affiche en 2024 : résultat net 2,4 M€, capitaux propres 18 M€, chiffre d'affaires 32 M€. Le concurrent « Imprim’Rapide » : résultat net 1,1 M€, capitaux propres 6 M€, CA 14 M€. Le directeur de TechPrint présente sa « rentabilité » aux banquiers ; l'analyste parle de « profitabilité » face au CA.",
    supportTables: [
      { title: "Données 2024 (M€)", columns: ["Entreprise", "Résultat net", "Capitaux propres", "CA"], rows: [["TechPrint", "2,4", "18", "32"], ["Imprim'Rapide", "1,1", "6", "14"]] },
      { title: "Ratios calculés (%)", columns: ["Entreprise", "Rentabilité CP", "Profitabilité (RN/CA)"], rows: [["TechPrint", "13,3", "7,5"], ["Imprim'Rapide", "18,3", "7,9"]] },
    ],    consigne: "Distingue rentabilité (rapport au capital) et profitabilité (rapport à l'activité). Calcule les deux ratios pour TechPrint et Imprim'Rapide.",
    questions: [
      "Définis rentabilité et profitabilité.",
      "Calcule la rentabilité des capitaux propres (Résultat net / Capitaux propres × 100) pour les deux.",
      "Calcule la profitabilité (Résultat net / CA × 100) et compare."
    ],
    correctionModele: "1) Définitions :\n— Rentabilité : capacité à générer des profits à partir des capitaux investis (capitaux propres).\n— Profitabilité : capacité à générer du profit à partir de l'activité (CA).\n\n2) Rentabilité :\nTechPrint : 2,4 / 18 × 100  − 13,3 %.\nImprim'Rapide : 1,1 / 6 × 100  − 18,3 %.\n\n3) Profitabilité :\nTechPrint : 2,4 / 32 × 100 = 7,5 %.\nImprim'Rapide : 1,1 / 14 × 100  − 7,9 %.\nImprim'Rapide est plus rentable en capital ; profitabilité proche sur le CA.",
    attendu: "Deux notions distinguées, ratios calculés et comparés.",
    notionsCibles: ["Deux notions distinguées", "ratios calculés et comparés."],
  },
  {
    id: "sdgn13-e9",
    title: "Dividendes et autofinancement",
    type: "Exercice",
    difficulty: "Difficile",
    xp: 280,
    minChars: 200,
    support: "TotalEnergies annonce pour 2024 un bénéfice net de 21,4 Md€. L'assemblée générale vote 8,4 Md€ de dividendes distribués aux actionnaires. Le solde (autofinancement) renforce les réserves pour financer la transition énergétique (investissements verts). Un petit actionnaire compare le dividende par action (3,34 €) au cours de Bourse (62 €).",
    supportTables: [
      { title: "Répartition du bénéfice — TotalEnergies 2024 (Md€)", columns: ["Poste", "Montant", "% du RN"], rows: [["Résultat net", "21,4", "100"], ["Dividendes", "8,4", "39"], ["Autofinancement (réserves)", "13,0", "61"]] },
    ],    consigne: "Explique dividendes et autofinancement. Calcule la part distribuée et la part autofinancée.",
    questions: [
      "Qu'est-ce qu'un dividende et qu'est-ce que l'autofinancement ?",
      "Calcule le montant autofinancé et les pourcentages distribué / reinvesti.",
      "Pourquoi un actionnaire suit-il le dividende par action ?"
    ],
    correctionModele: "1) Dividendes et autofinancement :\n— Dividendes : part du profit versée aux actionnaires.\n— Autofinancement : bénéfice non distribué, en réserves, pour financer des investissements internes.\n\n2) Calculs :\nAutofinancement = 21,4  − 8,4 = 13 Md€.\nDistribué : 8,4 / 21,4  − 39 %. Autofinancé : ≈ 61 %.\n\n3) Dividende par action :\nRendement = 3,34 / 62  − 5,4 % : indicateur de performance financière pour l'actionnaire.",
    attendu: "Définitions, répartition 39/61 %, lien actionnaire.",
    notionsCibles: ["Définitions", "répartition 39/61 %", "lien actionnaire."],
  },
  {
    id: "sdgn13-e10",
    title: "Performances contradictoires",
    type: "Exercice",
    difficulty: "Tres difficile",
    xp: 360,
    minChars: 240,
    support: "Uber Eats France en 2024 : CA +22 %, part de marché livraison repas 38 % (+2 pts), marge unitaire par commande −0,40 €, résultat net groupe mondial négatif, satisfaction livreurs 2,8/5, satisfaction clients 4,1/5. Les actionnaires exigent rentabilité ; les restaurants partenaires veulent des commissions plus basses ; les livreurs réclament de meilleures conditions.",
    supportTables: [
      { title: "Tableau de bord Uber Eats France 2024", columns: ["Type", "Indicateur", "Valeur", "Lecture"], rows: [["Commerciale", "Évolution CA", "+22 %", "Positive"], ["Commerciale", "Part de marché", "38 %", "Positive"], ["Financière", "Marge unitaire", "−0,40 €", "Négative"], ["Financière", "RN groupe", "Négatif", "Échec financier"], ["Sociale", "Satisfaction livreurs", "2,8 / 5", "Risque"], ["Qualité", "Satisfaction clients", "4,1 / 5", "Positive"]] },
    ],    consigne: "Montre le caractère contradictoire des performances (commerciale, financière, sociale). Repère contraintes et opportunités des acteurs.",
    questions: [
      "Quels indicateurs montrent une bonne performance commerciale ?",
      "Quels indicateurs montrent une performance financière fragile ?",
      "Quels conflits entre aspirations des acteurs (actionnaires, partenaires, livreurs, clients) ?"
    ],
    correctionModele: "1) Performance commerciale positive :\nCA +22 %, part de marché 38 % en hausse — objectifs commerciaux atteints ou dépassés.\n\n2) Performance financière fragile :\nMarge unitaire en baisse, résultat net groupe négatif — profitabilité/rentabilité insuffisantes.\n\n3) Conflits d'acteurs :\n— Actionnaires : rentabilité vs stratégie de croissance.\n— Restaurants : commissions vs volumes Uber.\n— Livreurs : conditions de travail vs satisfaction client élevée.\nPerformance globale contradictoire : impossible de maximiser tous les indicateurs simultanément.",
    attendu: "Contradictions repérées, acteurs et tensions nommés.",
    notionsCibles: ["Contradictions repérées", "acteurs et tensions nommés."],
  },
  {
    id: "sdgn13-cas1",
    title: "Étude de cas : Michel et Augustin, PME agroalimentaire",
    type: "Etude de cas",
    difficulty: "Difficile",
    xp: 560,
    minChars: 400,
    support: "La PME « Michel et Augustin » réalise en 2024 un CA de 98 M€ (+12 % vs 2023). Sur le marché français des cookies premium (total 420 M€), sa part est 23 %. Le taux de réachat e-commerce est 58 %. Résultat net : 4,2 M€ ; capitaux propres 28 M€. Dividendes votés : 0 € (réinvestissement total). Objectif 2025 : part de marché 26 % et RN 5 M€. Le fondateur refuse une grande distribution discount qui ferait croître le CA mais abîmerait l'image premium.",
    supportTables: [
      { title: "Michel et Augustin — indicateurs clés", columns: ["Indicateur", "2023", "2024"], rows: [["CA (M€)", "87,5", "98"], ["Part de marché cookies premium (%)", "21", "23"], ["Réachat e-commerce (%)", "54", "58"], ["Résultat net (M€)", "3,6", "4,2"], ["Capitaux propres (M€)", "26", "28"]] },
    ],    consigne: "Analyse performance commerciale et financière : CA, part de marché, fidélité, rentabilité, profitabilité, autofinancement. Arbitrage entre acteurs.",
    questions: [
      "Calcule la profitabilité et la rentabilité 2024. Interprète.",
      "La performance commerciale progresse-t-elle sur tous les indicateurs du support ?",
      "Pourquoi le fondateur refuse-t-il le discount (performance contradictoire) ?",
      "Quels objectifs 2025 et indicateurs de suivi proposerais-tu ?",
      "Synthèse (12-15 lignes) : bilan performance Michel et Augustin."
    ],
    correctionModele: "1) Ratios 2024 :\nProfitabilité = 4,2 / 98  − 4,3 %.\nRentabilité CP = 4,2 / 28 = 15 %.\nPerformance financière correcte pour une PME en croissance.\n\n2) Performance commerciale :\nCA +12 %, part 23 %, réachat 58 % : progression commerciale solide.\n\n3) Refus discount :\nCA pourrait monter mais image premium et valeur perçue risquent de baisser — performance commerciale à court terme vs qualité de marque à long terme.\n\n4) Objectifs 2025 :\nPart 26 %, RN 5 M€ — suivre CA, parts, fidélité, RN, rentabilité.\n\n5) Synthèse :\nPME performante commercialement, autofinancement total (0 dividende) pour investir. Tensions possibles entre croissance volume et positionnement premium — pilotage multi-indicateurs indispensable.",
    attendu: "Cas PME complet, ratios, arbitrage image/CA, synthèse.",
    notionsCibles: ["Cas PME complet", "ratios", "arbitrage image/CA"],
  },
  {
    id: "sdgn13-cas2",
    title: "Étude de cas : Airbus, comparaisons dans le temps et l'espace",
    type: "Etude de cas",
    difficulty: "Tres difficile",
    xp: 620,
    minChars: 450,
    support: "Airbus Livraisons 2023 : 735 avions, CA 65,4 Md€, résultat net 4,8 Md€. 2024 : 766 avions, CA 69,2 Md€, RN 5,2 Md€. Boeing (concurrent) CA aviation commerciale 2024 : 55,6 Md€. Dividendes Airbus 2024 : 1,8 Md€ ; autofinancement pour R&D. Rentabilité des capitaux propres 2024 : 11 %. Les salariés demandent revalorisation salariale ; les États actionnaires surveillent l'emploi ; les compagnies aériennes négocient des prix d'achat bas.",
    supportTables: [
      { title: "Airbus — évolution (Md€ sauf livraisons)", columns: ["Indicateur", "2023", "2024", "Évolution (%)"], rows: [["Livraisons (nombre)", "735", "766", "+4,2"], ["Chiffre d'affaires", "65,4", "69,2", "+5,8"], ["Résultat net", "4,8", "5,2", "+8,3"], ["Dividendes versés", "1,6", "1,8", "+12,5"]] },
      { title: "Comparaison spatiale 2024 (Md€)", columns: ["Groupe", "CA aviation commerciale"], rows: [["Airbus", "69,2"], ["Boeing", "55,6"], ["Total", "124,8"]] },
    ],    consigne: "Effectue des comparaisons dans le temps (Airbus 2023-2024) et dans l'espace (vs Boeing). Analyse performances commerciale et financière, contradictions, acteurs.",
    questions: [
      "Calcule l'évolution du CA et du RN d'Airbus en % entre 2023 et 2024.",
      "Estime la part de marché d'Airbus sur le CA combiné Airbus+Boeing (ordre de grandeur).",
      "Analyse rentabilité, dividendes et autofinancement — que cherchent les actionnaires ?",
      "Cite trois tensions entre acteurs et leurs effets sur la performance.",
      "Synthèse (15-18 lignes) : Airbus est-il performant ?"
    ],
    correctionModele: "1) Évolution temporelle :\nCA : (69,2  − 65,4) / 65,4 ≈ +5,8 %.\nRN : (5,2  − 4,8) / 4,8 ≈ +8,3 %.\nLivraisons : +4,2 %. Performance commerciale et financière en progression.\n\n2) Comparaison spatiale :\nPart CA ≈ 69,2 / (69,2 + 55,6) ≈ 55,4 % vs Boeing — leadership commercial.\n\n3) Financier :\nRentabilité CP 11 %, dividendes 1,8 Md€, reste en autofinancement R&D — actionnaires rémunérés tout en finançant l'innovation.\n\n4) Tensions :\n— Salariés vs marge : pression sur coûts.\n— Clients compagnies vs prix de vente : menace sur profitabilité.\n— États vs dividendes/emploi : contraintes politiques.\n\n5) Synthèse :\nAirbus est globalement performant (objectifs commerciaux et financiers atteints, efficiente sur livraisons). Mais les performances restent contradictoires : prix bas pour clients, R&D coûteuse, tensions sociales. L'analyse exige comparaisons temps/espace et lecture multi-acteurs.",
    attendu: "Comparaisons calculées, parts de marché, tensions, synthèse nuancée.",
    notionsCibles: ["Comparaisons calculées", "parts de marché", "tensions"],
  },
];
