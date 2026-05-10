/**
 * Force au moins un fichier nouveau dans dist/ à chaque build (évite souvent
 * "0 new file(s) to upload" et des étapes Deploy qui restent bizarres sur Netlify).
 */
const fs = require("fs");
const path = require("path");

const dist = path.join(__dirname, "..", "dist");
const indexHtml = path.join(dist, "index.html");

if (!fs.existsSync(indexHtml)) {
  console.error("dist/index.html introuvable après le build.");
  process.exit(1);
}

const stamp = path.join(dist, ".netlify-build-stamp.txt");
const lines = [
  `time=${new Date().toISOString()}`,
  `commit=${process.env.COMMIT_REF || process.env.HEAD || "unknown"}`,
  `rand=${Math.random().toString(36).slice(2)}`,
  "",
];
fs.writeFileSync(stamp, lines.join("\n"), "utf8");
console.log("Netlify stamp écrit :", stamp);
