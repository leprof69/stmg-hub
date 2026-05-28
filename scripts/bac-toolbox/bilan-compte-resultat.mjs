/** Contenu pedagogique : bilan + compte de resultat (exemple TechnoVert SAS). */

export const EXEMPLE_ENTREPRISE = "TechnoVert SAS";
export const EXERCICE = "2024";

/** Bilan simplifie (en milliers d'euros). */
export const BILAN_ACTIF = [
  ["Immobilisations incorporelles (logiciels, marques)", "420"],
  ["Immobilisations corporelles (b\u00e2timents, machines)", "2 850"],
  ["Immobilisations financi\u00e8res", "120"],
  ["Stocks de marchandises", "680"],
  ["Cr\u00e9ances clients", "540"],
  ["Disponibilit\u00e9s (banque, caisse)", "310"],
  ["TOTAL ACTIF", "4 920"],
];

export const BILAN_PASSIF = [
  ["Capital social", "800"],
  ["R\u00e9serves et r\u00e9sultat de l'exercice", "1 120"],
  ["Emprunts bancaires long terme", "1 400"],
  ["Dettes fournisseurs", "620"],
  ["Dettes fiscales et sociales", "480"],
  ["Concours bancaires court terme", "500"],
  ["TOTAL PASSIF", "4 920"],
];

/** Compte de resultat simplifie (en milliers d'euros). */
export const COMPTE_RESULTAT = [
  ["Chiffre d'affaires (ventes)", "8 200"],
  ["Consommations interm\u00e9diaires (achats, sous-traitance)", "\u2212 3 450"],
  ["VALEUR AJOUT\u00c9E", "4 750"],
  ["Charges de personnel", "\u2212 2 180"],
  ["Imp\u00f4ts et taxes", "\u2212 95"],
  ["Autres charges d'exploitation", "\u2212 420"],
  ["Dotations aux amortissements", "\u2212 280"],
  ["R\u00c9SULTAT D'EXPLOITATION", "1 775"],
  ["Charges financi\u00e8res", "\u2212 165"],
  ["Produits financiers", "12"],
  ["R\u00c9SULTAT COURANT AVANT IMP\u00d4TS", "1 622"],
  ["Imp\u00f4ts sur les b\u00e9n\u00e9fices", "\u2212 405"],
  ["R\u00c9SULTAT NET DE L'EXERCICE", "1 217"],
];

export function writeBilanPedagogique(pdf) {
  pdf.heading("Le bilan comptable", 1);
  pdf.write(
    "Le bilan est une photographie du patrimoine de l'entreprise \u00e0 une date donn\u00e9e (souvent le 31/12). Il r\u00e9pond \u00e0 la question : \u00ab Que poss\u00e8de l'entreprise et comment est-ce financ\u00e9 ? \u00bb",
    { size: 11 },
  );
  ySpacer(pdf, 6);
  pdf.heading("Structure en deux colonnes", 2);
  pdf.write(
    "\u2022 ACTIF (\u00e0 gauche) = ce que l'entreprise poss\u00e8de et utilise (emplois).\n\u2022 PASSIF (\u00e0 droite) = d'o\u00f9 vient l'argent (ressources) : capitaux propres + dettes.",
  );
  ySpacer(pdf, 8);
  pdf.heading("R\u00e8gle fondamentale", 2);
  pdf.write("TOTAL ACTIF = TOTAL PASSIF (\u00e9quilibre comptable).", { bold: true });
  ySpacer(pdf, 10);
  pdf.heading(`Exemple : bilan au 31/12/${EXERCICE} \u2014 ${EXEMPLE_ENTREPRISE}`, 2);
  pdf.write("(Montants en milliers d'euros)", { size: 9, color: [100, 116, 139] });
  ySpacer(pdf, 4);

  pdf.write("ACTIF", { bold: true, size: 10 });
  pdf.drawTable(["Poste", "Montant (k\u20ac)"], BILAN_ACTIF, {
    colWidths: [340, 159],
    fontSize: 9,
    rowH: 15,
  });
  ySpacer(pdf, 8);
  pdf.write("PASSIF", { bold: true, size: 10 });
  pdf.drawTable(["Poste", "Montant (k\u20ac)"], BILAN_PASSIF, {
    colWidths: [340, 159],
    fontSize: 9,
    rowH: 15,
  });

  ySpacer(pdf, 10);
  pdf.heading("Comment lire le bilan au Bac ?", 2);
  pdf.write(
    "\u2022 Actif immobilis\u00e9 = \u00e9quipements durables (machines, b\u00e2timents).\n\u2022 Actif circulant = stocks + cr\u00e9ances clients + banque (court terme).\n\u2022 Capitaux propres = apports des actionnaires + b\u00e9n\u00e9fices accumul\u00e9s.\n\u2022 Dettes = ce que l'entreprise doit aux banques, fournisseurs, \u00c9tat.\n\u2022 Capitaux propres = Actif \u2212 Dettes (patrimoine net). Ici : 4 920 \u2212 (620+480+500+1 400) ou directement 800+1 120 = 1 920 k\u20ac.",
  );
  ySpacer(pdf, 8);
  pdf.heading("Pi\u00e8ges fr\u00e9quents", 2);
  pdf.write(
    "\u2022 Ne pas confondre actif et passif.\n\u2022 Les capitaux propres sont au PASSIF, pas \u00e0 l'actif.\n\u2022 Le r\u00e9sultat de l'exercice s'ajoute aux r\u00e9serves au passif.",
  );
}

export function writeCompteResultatPedagogique(pdf) {
  pdf.newPage();
  pdf.heading("Le compte de r\u00e9sultat", 1);
  pdf.write(
    "Le compte de r\u00e9sultat mesure la performance sur une p\u00e9riode (souvent 1 an). Il r\u00e9pond \u00e0 : \u00ab L'activit\u00e9 a-t-elle \u00e9t\u00e9 rentable ? \u00bb",
    { size: 11 },
  );
  ySpacer(pdf, 6);
  pdf.heading("Logique en cascade", 2);
  pdf.write(
    "On part du chiffre d'affaires, on soustrait les charges, on obtient des soldes interm\u00e9diaires (valeur ajout\u00e9e, r\u00e9sultat d'exploitation\u2026), jusqu'au r\u00e9sultat net.",
  );
  ySpacer(pdf, 8);
  pdf.heading("Formules essentielles Bac", 2);
  pdf.write(
    "Valeur ajout\u00e9e (VA) = Chiffre d'affaires \u2212 Consommations interm\u00e9diaires (CI)\n\nR\u00e9sultat d'exploitation = VA \u2212 charges de personnel \u2212 autres charges d'exploitation \u2212 amortissements\n\nR\u00e9sultat net = b\u00e9n\u00e9fice ou perte finale apr\u00e8s imp\u00f4ts",
    { bold: false },
  );
  ySpacer(pdf, 10);
  pdf.heading(`Exemple : compte de r\u00e9sultat ${EXERCICE} \u2014 ${EXEMPLE_ENTREPRISE}`, 2);
  pdf.write("(Montants en milliers d'euros)", { size: 9, color: [100, 116, 139] });
  ySpacer(pdf, 4);
  pdf.drawTable(["Poste", "Montant (k\u20ac)"], COMPTE_RESULTAT, {
    colWidths: [340, 159],
    fontSize: 9,
    rowH: 15,
  });

  ySpacer(pdf, 10);
  pdf.heading("Lien bilan / compte de r\u00e9sultat", 2);
  pdf.write(
    "Le r\u00e9sultat net de l'exercice (1 217 k\u20ac) augmente les capitaux propres au bilan (r\u00e9serves). Le bilan montre le stock, le compte de r\u00e9sultat montre le flux de l'ann\u00e9e.",
  );
  ySpacer(pdf, 8);
  pdf.heading("Pi\u00e8ges fr\u00e9quents", 2);
  pdf.write(
    "\u2022 Ne pas additionner CA + CI : on soustrait pour la VA.\n\u2022 Distinguer r\u00e9sultat d'exploitation (activit\u00e9) et r\u00e9sultat net (apr\u00e8s imp\u00f4ts).\n\u2022 Les amortissements sont une charge, pas une sortie de tr\u00e9sorerie imm\u00e9diate.",
  );
}

function ySpacer(pdf, n) {
  pdf.setY(pdf.getY() + n);
}
