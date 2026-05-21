import fs from "fs";

const p = "src/lib/profileDecoCatalog.ts";
let c = fs.readFileSync(p, "utf8");
const start = c.indexOf('  {\n    key: "solar"');
const end = c.indexOf('  {\n    key: "nature"');
if (start < 0 || end < 0) {
  console.error("markers not found", start, end);
  process.exit(1);
}
c = c.slice(0, start) + c.slice(end);
c = c.replace(/Solar duotone/i, "sans duotone");
fs.writeFileSync(p, c, "utf8");
console.log("removed solar category");
