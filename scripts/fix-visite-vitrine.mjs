import fs from "fs";
const p = "src/pages/VisiteSalon.tsx";
const lines = fs.readFileSync(p, "utf8").split(/\r?\n/);
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("2px dashed #E5E7EB") && i + 1 < lines.length) {
    lines[i + 1] = '                    {"\\u2014"}';
    break;
  }
}
fs.writeFileSync(p, lines.join("\n"), "utf8");
console.log("ok");
