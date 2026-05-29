/**
 * Genere la liste redigee des 116 QCM DS Premiere (enonce + choix + corrige).
 * Usage: node scripts/generate-ds-premiere-redige.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "docs/DS-SDGN-Premiere-Liste-questions.md");

const CHAPTER_LABELS = {
  1: "Types d'organisation",
  2: "Identit\u00e9 et fonctionnement de l'individu",
  3: "Individu dans l'organisation",
  4: "Activit\u00e9 de travail",
  5: "\u00c9valuation et r\u00e9tribution",
  6: "Technologies et information",
  7: "Technologies num\u00e9riques collaboratives",
  8: "Impact du num\u00e9rique sur l'organisation",
  9: "Valeur per\u00e7ue et image de marque",
  10: "Valeur financi\u00e8re et boursi\u00e8re",
  11: "Cr\u00e9ation et mesure de la valeur",
  12: "Prix, co\u00fbts et marges",
  13: "Performance globale",
};

const FILES = [
  "src/data/sdgn/sdgnMissionQcmBank.ts",
  "src/data/sdgn/sdgnDsPremiereCasEntreprise.ts",
  "src/data/sdgn/sdgnDsPremiereQcm.ts",
  "src/data/sdgn/sdgnDsPremierePureCours.ts",
];

function decodeStr(raw) {
  return raw
    .replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/\\n/g, " ")
    .replace(/\\'/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function parseChoix(block) {
  const choix = [];
  const re = /"((?:\\.|[^"\\])*)"/g;
  let m;
  while ((m = re.exec(block))) {
    choix.push(decodeStr(m[1]));
  }
  return choix.slice(0, 4);
}

function extractQuestions(filePath) {
  const text = fs.readFileSync(path.join(ROOT, filePath), "utf8");
  const items = [];

  const inlineRe =
    /\{\s*id:\s*"(sdgn-ds[^"]+)"\s*,\s*chapter:\s*(\d+)\s*,\s*difficulte:\s*"([^"]+)"\s*,\s*question:\s*"((?:\\.|[^"\\])*)"\s*,\s*choix:\s*\[([^\]]+)\]\s*as\s*\[[^\]]*\]\s*,\s*bonIndex:\s*(\d+)\s*\}/g;
  let m;
  while ((m = inlineRe.exec(text))) {
    items.push({
      id: m[1],
      chapter: Number(m[2]),
      difficulte: m[3],
      question: decodeStr(m[4]),
      choix: parseChoix(m[5]),
      bonIndex: Number(m[6]),
    });
  }

  const blockRe = /\{\s*id:\s*"(sdgn-ds[^"]+)"([\s\S]*?)\n\s*\},/g;
  while ((m = blockRe.exec(text))) {
    const id = m[1];
    const body = m[2];
    const ch = body.match(/chapter:\s*(\d+)/);
    const diff = body.match(/difficulte:\s*"([^"]+)"/);
    let question = "";
    const q1 = body.match(/question:\s*"((?:\\.|[^"\\])*)"/);
    const q2 = body.match(/question:\s*\n\s*"((?:\\.|[^"\\])*)"/);
    const q3 = body.match(/question:\s*\n\s*([\s\S]*?)\n\s*choix:/);
    if (q1) question = decodeStr(q1[1]);
    else if (q2) question = decodeStr(q2[1]);
    else if (q3) question = decodeStr(q3[1].replace(/"\s*\+/g, "").replace(/"/g, ""));
    const choixBlock = body.match(/choix:\s*\[([\s\S]*?)\](?:\s*as\s*\[[^\]]*\])?/);
    const choix = choixBlock ? parseChoix(choixBlock[1]) : [];
    const bon = body.match(/bonIndex:\s*(\d)/);
    items.push({
      id,
      chapter: ch ? Number(ch[1]) : 0,
      difficulte: diff ? diff[1] : "difficile",
      question,
      choix,
      bonIndex: bon ? Number(bon[1]) : 0,
    });
  }
  return items;
}

function normalizeDsText(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['']/g, "'");
}

const THEMED_SITUATIONS = [
  {
    match: (t) => /reseau social d'entreprise|\brse\b/.test(t),
    situation:
      "DataFlow d\u00e9ploie un r\u00e9seau social d'entreprise (RSE) sur son intranet : groupes par m\u00e9tier, fil du PDG, charte d'utilisation. Le DRH \u00e9value l'effet sur la communication interne.",
  },
  {
    match: (t) => /outil collaboratif|cloud collaboratif|communication interne/.test(t),
    situation:
      "DataFlow met en place un intranet et des espaces collaboratifs pour 400 salari\u00e9s sur deux sites.",
  },
  {
    match: (t) => /\bintranet\b/.test(t) && !/reseau social/.test(t),
    situation:
      "DataFlow met en place un intranet et des espaces collaboratifs pour 400 salari\u00e9s sur deux sites.",
  },
  {
    match: (t) => /big data|donnee massives/.test(t),
    situation:
      "DataFlow exploite de grands volumes de donn\u00e9es clients pour affiner sa logistique et ses campagnes.",
  },
  {
    match: (t) => /intelligence artificielle|\bia\b|automatise|automatisation/.test(t) && !/reseau social/.test(t),
    situation:
      "DataFlow teste l'automatisation du tri des demandes SAV par IA et chiffre les risques num\u00e9riques avant g\u00e9n\u00e9ralisation.",
  },
  {
    match: (t) => /rgpd|donnee personnelle|consentement/.test(t),
    situation:
      "DataFlow stocke des e-mails clients nominatifs ; le DPO alerte sur le consentement et la conformit\u00e9 RGPD.",
  },
  {
    match: (t) => /open data|data\.gouv/.test(t),
    situation:
      "DataFlow compare des jeux open data publics et des donn\u00e9es clients pour un projet d'\u00e9tude.",
  },
  {
    match: (t) =>
      /\bpgi\b|\berp\b|evenement declencheur|evenement-resultat|processus (logistique|commande|metier)/.test(t),
    situation:
      "DataFlow mod\u00e9lise son processus commande, pr\u00e9paration et exp\u00e9dition dans un PGI.",
  },
  {
    match: (t) => /identite numerique|e-reputation|linkedin|bad buzz/.test(t),
    situation:
      "Un recruteur de DataFlow consulte le profil public d'un candidat et rep\u00e8re une publication sensible.",
  },
  {
    match: (t) => /valeur ajoutee|consommations intermediaires|\bva\b|repartition de la va/.test(t),
    situation:
      "GreenWave publie son compte de r\u00e9sultat et doit analyser la valeur ajout\u00e9e \u00e0 partir du CA et des CI.",
  },
  {
    match: (t) => /marge commerciale|prix d'achat|prix de vente|cout de revient|taux de marge/.test(t),
    situation:
      "Prix & Marge compare en rayon le prix d'achat, le prix de vente et la marge unitaire d'une r\u00e9f\u00e9rence.",
  },
  {
    match: (t) => /prix ttc|prix ht|\bttc\b|\bht\b|tva/.test(t),
    situation:
      "La comptabilit\u00e9 de Prix & Marge re\u00e7oit un prix TTC (TVA 20 %) et doit retrouver le HT.",
  },
  {
    match: (t) => /rentabilite financiere|profitabilite|part de marche|resultat net/.test(t),
    situation:
      "Helios communique ses r\u00e9sultats : le comit\u00e9 compare rentabilit\u00e9, profitabilit\u00e9 et part de march\u00e9.",
  },
  {
    match: (t) => /efficacite|efficience|performance globale|indicateur de performance/.test(t),
    situation:
      "Helios arbitre entre objectifs commerciaux, financiers, sociaux et environnementaux (performance globale).",
  },
  {
    match: (t) => /qvct|qualite de vie|conditions de travail|teletravail|ergonomie|eclairage|bruit en reserve|penibilite/.test(t),
    situation:
      "NovaRetail organise un comit\u00e9 QVCT apr\u00e8s des signalements sur la p\u00e9nibilit\u00e9 en r\u00e9serve.",
  },
  {
    match: (t) => /equite interne|equite externe|remuneration|prime|grille d'evaluation/.test(t),
    situation:
      "NovaRetail compare salaires internes et r\u00e9mun\u00e9rations du march\u00e9 pour un m\u00eame poste.",
  },
  {
    match: (t) => /style de management|autocratique|consultatif|participatif|influence|manipulation/.test(t),
    situation: "Chez NovaRetail, un manager doit trancher sur son mode de d\u00e9cision et d'influence.",
  },
  {
    match: (t) =>
      /\bassociation\b|objet social|dividende|actionnaire|\bcse\b|\bago\b|\bpdg\b|forme juridique/.test(t),
    situation:
      "Une organisation revoit sa gouvernance : r\u00f4le des actionnaires, du personnel \u00e9lu et des parties prenantes.",
  },
  {
    match: (t) => /valeur percue|influenceur|image de marque/.test(t),
    situation:
      "GreenWave subit une critique virale sur les r\u00e9seaux ; l'\u00e9quipe marketing analyse la valeur per\u00e7ue.",
  },
  {
    match: (t) => /valeur boursiere|cours action|capitaux propres/.test(t) && !/actif du bilan/.test(t),
    situation:
      "GreenWave suit l'\u00e9volution de sa valeur boursi\u00e8re et de ses capitaux propres en Bourse.",
  },
  {
    match: (t) => /capitaux propres.*actif|actif.*capitaux propres|schema de bilan|bilan/.test(t),
    situation:
      "GreenWave pr\u00e9pare son bilan : r\u00e9partition entre actif et passif, dont les capitaux propres.",
  },
  {
    match: (t) => /maslow|besoin d'appartenance|pyramide des besoins/.test(t),
    situation:
      "Un candidat et un recruteur de DataFlow \u00e9changent sur la motivation et le comportement professionnel.",
  },
  {
    match: (t) => /empreinte numerique|comportement professionnel/.test(t),
    situation:
      "Un recruteur de DataFlow consulte le profil public d'un candidat et rep\u00e8re une publication sensible.",
  },
  {
    match: (t) => /culture d'entreprise|valeurs partagees|rituels/.test(t),
    situation: "NovaRetail lance un projet pour renforcer valeurs, normes et rituels en magasin.",
  },
  {
    match: (t) => /fiche de poste|competence professionnelle|savoir-etre/.test(t),
    situation:
      "NovaRetail met \u00e0 jour une fiche de poste et la grille de comp\u00e9tences pour les vendeurs.",
  },
  {
    match: (t) => /co2|emission|environnementale/.test(t),
    situation: "Helios fixe des objectifs de r\u00e9duction des \u00e9missions de CO\u2082 dans son rapport RSE.",
  },
];

function isDsPureCoursBankId(id) {
  const n = Number(id.replace(/^sdgn-ds-/, ""));
  return Number.isFinite(n) && n >= 77 && !id.includes("cas");
}

function isEmbeddedCase(q) {
  if (q.length >= 100) return true;
  if (/\d/.test(q) && /(\u20ac|€|%|EUR)/i.test(q)) return true;
  if (/^(Entreprise|NovaRetail|DataFlow|GreenWave|Helios|Prix & Marge|SportSolidaire)/i.test(q)) return true;
  return false;
}

function pickScenario(item) {
  if (isDsPureCoursBankId(item.id) || isEmbeddedCase(item.question)) return null;
  const text = normalizeDsText(item.question);
  for (const themed of THEMED_SITUATIONS) {
    if (themed.match(text)) return themed.situation;
  }
  return null;
}

function typeLabel(item) {
  if (isDsPureCoursBankId(item.id)) return "Cours pur (definition / formule)";
  if (item.id.includes("cas")) return "Cas d'entreprise integre a l'enonce";
  if (isEmbeddedCase(item.question)) return "Mise en situation chiffree";
  if (pickScenario(item)) return "Cas d'entreprise + question";
  return "Question de cours";
}

function sortKey(id) {
  if (id.startsWith("sdgn-ds-cas-")) return 9000 + Number(id.replace("sdgn-ds-cas-", ""));
  return Number(id.replace("sdgn-ds-", "")) || 0;
}

const seen = new Set();
const all = [];
for (const f of FILES) {
  for (const q of extractQuestions(f)) {
    if (seen.has(q.id)) continue;
    seen.add(q.id);
    all.push(q);
  }
}
all.sort((a, b) => sortKey(a.id) - sortKey(b.id));

const letters = ["A", "B", "C", "D"];
let md = `# DS SDGN Premi\u00e8re STMG \u2014 banque r\u00e9dig\u00e9e (116 questions)

Document de r\u00e9f\u00e9rence professeur. Chaque item reprend l\u2019\u00e9nonc\u00e9 tel qu\u2019il est lu par l\u2019\u00e9l\u00e8ve (mini cas \u00e9ventuel, puis question), les quatre r\u00e9ponses possibles et la correction.

**Session \u00e9l\u00e8ve :** 50 minutes \u00b7 tirage al\u00e9atoire \u00b7 bar\u00e8me +1 / \u22120,5 pt.

---

`;

let n = 0;
for (const item of all) {
  n += 1;
  const scenario = pickScenario(item);
  const chLabel = CHAPTER_LABELS[item.chapter] || `Chapitre ${item.chapter}`;
  const type = typeLabel(item);

  md += `## Question ${n} \u2014 ${chLabel}\n\n`;
  md += `**R\u00e9f\u00e9rence :** \`${item.id}\` \u00b7 **Type :** ${type}\n\n`;
  md += `### \u00c9nonc\u00e9 \u00e0 lire\n\n`;

  if (scenario) {
    md += `${scenario}\n\n`;
  }

  const q = item.question.trim();
  const needsLead =
    scenario && !q.match(/^(Entreprise|NovaRetail|DataFlow|GreenWave|Helios|Prix|SportSolidaire|Une |Le |La |L'|Apr)/i);
  if (needsLead) {
    md += `**Dans ce contexte :** ${q}\n\n`;
  } else {
    md += `${q}\n\n`;
  }

  if (item.choix.length === 4) {
    md += `### R\u00e9ponses possibles\n\n`;
    item.choix.forEach((c, i) => {
      const mark = i === item.bonIndex ? " **(\u2713 bonne r\u00e9ponse)**" : "";
      md += `- **${letters[i]}.** ${c}${mark}\n`;
    });
    md += `\n`;
  }

  md += `---\n\n`;
}

md += `*Fin de la banque \u2014 ${n} questions. G\u00e9n\u00e9r\u00e9 le ${new Date().toISOString().slice(0, 10)} via \`node scripts/generate-ds-premiere-redige.mjs\`.*\n`;

fs.writeFileSync(OUT, md, "utf8");
console.log(`OK: ${OUT} (${n} questions)`);
