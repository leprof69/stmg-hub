/**
 * Writes dist/netlify-build-stamp.txt (changes every build).
 * Dotfiles were skipped by some deploy steps -> "0 new file(s) to upload".
 */
const fs = require("fs");
const path = require("path");

const dist = path.join(__dirname, "..", "dist");
const indexHtml = path.join(dist, "index.html");

if (!fs.existsSync(indexHtml)) {
  console.error("Missing dist/index.html after build.");
  process.exit(1);
}

const stamp = path.join(dist, "netlify-build-stamp.txt");
const lines = [
  `time=${new Date().toISOString()}`,
  `commit=${process.env.COMMIT_REF || process.env.HEAD || "unknown"}`,
  `rand=${Math.random().toString(36).slice(2)}`,
  "",
];
fs.writeFileSync(stamp, lines.join("\n"), "utf8");
console.log("Netlify stamp OK:", stamp);
