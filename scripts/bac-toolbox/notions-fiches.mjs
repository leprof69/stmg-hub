/** Contenu des fiches notions Management Terminale (programme officiel). */

export const CHAPTER_LABELS = {
  1: "Quels produits ou services pour quels besoins ?",
  2: "Comment cr\u00e9er de la valeur et la mesurer ?",
  3: "Quelles ressources financi\u00e8res pour produire ?",
  4: "Quelles ressources humaines pour produire ?",
  5: "Quels choix d'organisation de la production (qualit\u00e9 et flexibilit\u00e9) ?",
  6: "Pourquoi contr\u00f4ler les co\u00fbts ?",
  7: "Quel est le r\u00f4le des technologies num\u00e9riques dans la production ?",
  8: "Comment organiser et piloter la production ?",
  9: "Comment le management prend-il en compte les attentes des acteurs ?",
  10: "Comment f\u00e9d\u00e9rer les acteurs de l'organisation ?",
  11: "Les transformations num\u00e9riques dans l'organisation",
  12: "Comment une organisation communique-t-elle avec ses acteurs ?",
  13: "Quels enjeux \u00e9thiques dans l'activit\u00e9 des organisations ?",
  14: "Comment les organisations prennent-elles en compte les changements des modes de vie ?",
  15: "Quelles responsabilit\u00e9s le num\u00e9rique cr\u00e9e-t-il pour les organisations ?",
};

/** Contenu enrichi pour les notions les plus tombees au Bac. */
export const MANUAL_FICHES = {
  "valeur ajoutee": {
    enUnePhrase:
      "La richesse creee par l'entreprise grace a son activite, avant de payer les salaries et l'Etat.",
    retenir: [
      "VA = Chiffre d'affaires \u2212 Consommations intermediaires (CI).",
      "Les CI = achats de matieres, sous-traitance, fournitures liees a la production.",
      "La VA se repartit entre salaries, actionnaires, banques, Etat, reinvestissement.",
    ],
    formules: "VA = CA \u2212 CI",
    exemple:
      "CA 8,2 M\u20ac et CI 3,45 M\u20ac \u21d2 VA = 4,75 M\u20ac. L'entreprise a cree 4,75 M\u20ac de richesse avant de payer le personnel.",
    piege: "Ne jamais faire CA + CI. La VA n'est pas le resultat net.",
  },
  "compte de resultat": {
    enUnePhrase: "Document qui resume les produits et charges de l'annee pour mesurer la rentabilite.",
    retenir: [
      "Il couvre une periode (flux), contrairement au bilan (stock a une date).",
      "Soldes intermediaires : VA, resultat d'exploitation, resultat net.",
      "Lien avec le bilan : le resultat net augmente les capitaux propres.",
    ],
    formules: "Voir fiche d\u00e9di\u00e9e \u00ab Compte de r\u00e9sultat \u00bb (PDF 02)",
    exemple: "Apres la VA, on deduit salaires, impots, amortissements pour obtenir le resultat d'exploitation.",
    piege: "Confondre bilan et compte de resultat.",
  },
  "resultat d'exploitation": {
    enUnePhrase: "Performance de l'activite principale avant les charges financieres et impots.",
    retenir: [
      "Mesure si le coeur d'activite est rentable.",
      "S'obtient apres la VA et les charges d'exploitation.",
      "Compare souvent entre entreprises du meme secteur.",
    ],
    formules: "RE = VA \u2212 charges de personnel \u2212 autres charges d'exploitation \u2212 dotations",
    exemple: "VA 4,75 M\u20ac \u2212 charges exploitation \u21d2 RE 1,775 M\u20ac : activite saine.",
    piege: "Ne pas confondre avec le resultat net (apres impots).",
  },
  "bilan fonctionnel": {
    enUnePhrase: "Lecture du bilan par emplois stables, actif circulant et ressources a court/long terme.",
    retenir: [
      "Emplois stables = immobilisations.",
      "Actif circulant = stocks + creances + disponibilites.",
      "Ressources stables = capitaux propres + dettes long terme.",
    ],
    formules: "FR = Ressources stables \u2212 Emplois stables",
    exemple: "Sert a calculer le fonds de roulement et analyser l'equilibre financier.",
    piege: "Oublier que le bilan fonctionnel reorganise le bilan comptable.",
  },
  "fonds de roulement": {
    enUnePhrase: "Marge de securite financiere pour financer le cycle d'exploitation.",
    retenir: [
      "FR = Ressources stables \u2212 Emplois stables.",
      "FR positif : ressources durables couvrent les immobilisations + une partie du circulant.",
      "Se compare au BFR pour juger l'equilibre.",
    ],
    formules: "FR = Ressources stables \u2212 Emplois stables",
    exemple: "FR > BFR : l'entreprise finance son cycle et garde de la tresorerie.",
    piege: "Confondre FR (structure) et tresorerie (disponible immediate).",
  },
  "besoin en fonds de roulement": {
    enUnePhrase: "Argent immobilise dans le cycle d'exploitation (stocks + clients \u2212 fournisseurs).",
    retenir: [
      "BFR = stocks + creances clients \u2212 dettes fournisseurs (formule simplifiee).",
      "BFR eleve si clients paient tard ou stocks importants.",
      "Un BFR qui augmente consomme de la tresorerie.",
    ],
    formules: "BFR = Actif circulant d'exploitation \u2212 Passif circulant d'exploitation",
    exemple: "Hausse des ventes a credit \u21d2 creances clients \u21d2 BFR augmente.",
    piege: "Penser que le BFR est toujours negatif (c'est rare en croissance).",
  },
  "seuil de rentabilite": {
    enUnePhrase: "Niveau d'activite minimum pour ne plus perdre d'argent.",
    retenir: [
      "SR = Charges fixes / Taux de marge sur couts variables.",
      "Au-dessus du SR, l'entreprise degage un benefice.",
      "Marge de securite = ecart entre activite reelle et SR.",
    ],
    formules: "SR (en \u20ac) = CF / Taux de marge ; SR (en qte) = SR \u20ac / prix unitaire",
    exemple: "CF 200 k\u20ac, taux marge 40 % \u21d2 SR = 500 k\u20ac de CA.",
    piege: "Utiliser les charges variables au lieu du taux de marge.",
  },
  "marge sur couts variables": {
    enUnePhrase: "Part du chiffre d'affaires qui couvre les charges fixes et le profit.",
    retenir: [
      "MCV = CA \u2212 couts variables totaux.",
      "Taux de marge = MCV / CA.",
      "Outil central pour le seuil de rentabilite.",
    ],
    formules: "MCV = CA \u2212 CV ; Taux = MCV / CA",
    exemple: "Prix 10 \u20ac, cout variable 6 \u20ac \u21d2 marge unitaire 4 \u20ac (40 %).",
    piege: "Inclure les charges fixes dans les couts variables.",
  },
  "business model": {
    enUnePhrase: "Logique qui explique comment l'entreprise cree et capture de la valeur.",
    retenir: [
      "3 composantes : proposition de valeur, mecanisme de creation, mode de revenus.",
      "Peut evoluer (freemium, plateforme, abonnement).",
      "Lie a la transformation numerique.",
    ],
    formules: "Pas de formule unique \u2014 grille d'analyse en 3 blocs",
    exemple: "Spotify : musique illimitee / plateforme / abonnements + publicite.",
    piege: "Confondre business model et strategie marketing seule.",
  },
  GPEC: {
    enUnePhrase: "Anticiper les besoins en competences et effectifs pour atteindre les objectifs.",
    retenir: [
      "Diagnostic quantitatif (combien) et qualitatif (qui, quelles competences).",
      "Plans d'action : recrutement, formation, mobilite.",
      "Lie aux performances de l'organisation.",
    ],
    formules: "Ecart = effectif prevu \u2212 effectif actuel",
    exemple: "Ouverture magasin \u21d2 prevoir 12 vendeurs + 1 manager + formation.",
    piege: "Reduire la GPEC au seul recrutement.",
  },
  RSE: {
    enUnePhrase: "Prise en compte des impacts sociaux, environnementaux et societaux de l'activite.",
    retenir: [
      "Parties prenantes : salaries, clients, fournisseurs, territoires.",
      "Reporting, transparence, prevention du greenwashing.",
      "Peut ameliorer image et performance long terme.",
    ],
    formules: "Indicateurs (CO2, diversite, accidents du travail...)",
    exemple: "Reduction empreinte carbone + charte fournisseurs + dialogue social.",
    piege: "Confondre RSE (Responsabilite societale) et RSE (Reseau social entreprise).",
  },
};

export function buildFicheContent(notion, chapterNums) {
  const key = notion.toLowerCase().trim();
  const manual = MANUAL_FICHES[key] || MANUAL_FICHES[notion];
  if (manual) {
    return {
      notion,
      chapters: chapterNums,
      ...manual,
    };
  }

  const chLabel =
    chapterNums.length > 0
      ? chapterNums.map((c) => `Ch. ${c} \u2014 ${CHAPTER_LABELS[c] || ""}`).join("\n")
      : "Programme Management Terminale";

  return {
    notion,
    chapters: chapterNums,
    enUnePhrase: `Notion du programme Management STMG (Terminale) : ${notion}. A maitriser pour analyser des documents, des etudes de cas et repondre aux questions du Bac.`,
    retenir: [
      `Definition : ${notion} \u2014 vocabulaire a utiliser dans vos copies.`,
      "Mobilisez un exemple d'entreprise reelle citee en cours.",
      "Reliez la notion aux acteurs, a la performance et aux choix de gestion.",
      `Chapitre(s) : ${chapterNums.join(", ") || "a reviser"}.`,
    ],
    formules: "Consulter votre cours et la fiche Bilan / Compte de resultat si la notion est financiere.",
    exemple:
      "Au Bac : identifiez la notion dans le dossier, definissez-la en une phrase, illustrez avec le cas + chiffre.",
    piege: "Ne pas definir trop vite : posez le contexte entreprise avant la notion.",
    chapitresLabel: chLabel,
  };
}

export function writeNotionFiche(pdf, fiche) {
  const chLines =
    fiche.chapitresLabel ||
    fiche.chapters.map((c) => `Chapitre ${c} \u2014 ${CHAPTER_LABELS[c] || ""}`).join("\n");

  pdf.heading(fiche.notion.charAt(0).toUpperCase() + fiche.notion.slice(1), 1);
  pdf.write("Management STMG \u2014 Terminale \u2014 Boite a outils Bac", {
    size: 9,
    color: [100, 116, 139],
  });
  pdf.rule();
  pdf.heading("Chapitre(s) du programme officiel", 2);
  pdf.write(chLines, { size: 10 });
  pdf.heading("En une phrase", 2);
  pdf.write(fiche.enUnePhrase);
  pdf.heading("A retenir", 2);
  pdf.write(fiche.retenir.map((r) => `\u2022 ${r}`).join("\n"));
  if (fiche.formules) {
    pdf.heading("Formules / outils", 2);
    pdf.write(fiche.formules, { bold: true });
  }
  pdf.heading("Exemple type Bac", 2);
  pdf.write(fiche.exemple);
  pdf.heading("Piege a eviter", 2);
  pdf.write(fiche.piege, { color: [185, 28, 28] });
}
