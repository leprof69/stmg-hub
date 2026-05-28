/** Parse les blocs QCM { id, chapter, question, choix, bonIndex } depuis un fichier .ts. */

export function decodeTsString(raw) {
  if (!raw) return "";
  return raw
    .replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\r")
    .replace(/\\t/g, "\t")
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, "\\");
}

function parseBlock(block) {
  const id = block.match(/id:\s*"([^"]+)"/)?.[1];
  if (!id) return null;
  const chapter = Number(block.match(/chapter:\s*(\d+)/)?.[1] ?? 0);
  const difficulte = block.match(/difficulte:\s*"([^"]+)"/)?.[1] ?? "difficile";
  const qm = block.match(/question:\s*"((?:\\.|[^"\\])*)"/);
  const question = decodeTsString(qm?.[1] ?? "");
  const bonIndex = Number(block.match(/bonIndex:\s*(\d)/)?.[1] ?? 0);
  const choixMatch = block.match(/choix:\s*\[([\s\S]*?)\]/);
  const choix = [];
  if (choixMatch) {
    const choixRe = /"((?:\\.|[^"\\])*)"/g;
    let cm;
    while ((cm = choixRe.exec(choixMatch[1]))) choix.push(decodeTsString(cm[1]));
  }
  if (!question || choix.length < 2) return null;
  return { id, chapter, difficulte, question, choix, bonIndex };
}

function extractBlocks(content, idPrefix) {
  const results = [];
  const idRe = new RegExp(`id:\\s*"(${idPrefix.replace(/-/g, "\\-")}[\\w-]+)"`, "g");
  let m;
  while ((m = idRe.exec(content))) {
    const start = content.lastIndexOf("{", m.index);
    if (start < 0) continue;
    let depth = 0;
    let end = start;
    for (let i = start; i < content.length; i++) {
      if (content[i] === "{") depth++;
      if (content[i] === "}") {
        depth--;
        if (depth === 0) {
          end = i + 1;
          break;
        }
      }
    }
    const item = parseBlock(content.slice(start, end));
    if (item) results.push(item);
  }
  return results;
}

import { readFileSync } from "node:fs";

export function loadDsQcmFromSources({ bankPath, extraPath, purePath }) {
  const bank = readFileSync(bankPath, "utf8");
  const fromBank = extractBlocks(bank, "sdgn-ds-");

  const extraFile = readFileSync(extraPath, "utf8");
  const extraStart = extraFile.indexOf("const SDGN_DS_EXTRA_RAW");
  const extraSlice =
    extraStart >= 0
      ? extraFile.slice(extraStart, extraFile.indexOf("const FROM_CURATED"))
      : extraFile;
  const fromExtra = extractBlocks(extraSlice, "sdgn-ds-");

  let fromPure = [];
  if (purePath) {
    const pureFile = readFileSync(purePath, "utf8");
    const pureStart = pureFile.indexOf("export const SDGN_DS_PURE_COURS");
    const pureSlice = pureStart >= 0 ? pureFile.slice(pureStart) : pureFile;
    fromPure = extractBlocks(pureSlice, "sdgn-ds-");
  }

  const byId = new Map();
  for (const q of [...fromBank, ...fromExtra, ...fromPure]) {
    byId.set(q.id, q);
  }

  return [...byId.values()].sort((a, b) => {
    const na = Number(a.id.replace(/\D/g, "")) || 0;
    const nb = Number(b.id.replace(/\D/g, "")) || 0;
    return na - nb;
  });
}
