import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const file = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "src", "pages", "Flashcards.tsx");
const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);

const start = lines.findIndex(
  (l) => l.includes('display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10')
);
const end = lines.findIndex((l) => l.includes("{banner && <p style={{ marginTop: 10"));

if (start < 0 || end < 0) {
  console.error("markers not found", start, end);
  process.exit(1);
}

const block = `          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 14 }}>
            {(["tous", "management", "droit", "economie", "sciences_gestion", "gestion_finance", "mercatique", "ressources_humaines", "numerique_si"] as DeckCategory[]).map((cat) => {
              const active = category === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  style={{
                    borderRadius: 8,
                    border: active ? "1px solid #4F46E5" : "1px solid #E2E8F0",
                    background: active ? "#EEF2FF" : "#fff",
                    color: active ? "#4338CA" : "#475569",
                    padding: "6px 11px",
                    fontWeight: active ? 700 : 500,
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                >
                  {CATEGORY_LABELS[cat]}
                </button>
              );
            })}
          </motion.div>

          <motion.div style={{ marginTop: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13, color: "#64748B" }}>
              <span>Progression du pack</span>
              <span style={{ fontWeight: 700, color: "#334155" }}>{progressPct}%</span>
            </motion.div>
            <div style={{ height: 8, borderRadius: 999, background: "#E2E8F0", overflow: "hidden" }}>
              <motion.div
                style={{
                  width: \`\${progressPct}%\`,
                  height: "100%",
                  borderRadius: 999,
                  background: "#4F46E5",
                  transition: "width 350ms ease",
                }}
              />
            </motion.div>
          </motion.div>`;

const cleanBlock = block.replaceAll("motion.", "");

const out = [...lines.slice(0, start), ...cleanBlock.split("\n"), ...lines.slice(end)];
let s = out.join("\n");

s = s.replace(
  /background: "linear-gradient\(145deg, rgba\(255,255,255,0\.96\), rgba\(240,249,255,0\.94\)\)", backdropFilter: "blur\(10px\)", borderRadius: 22, border: "1px solid #BFDBFE", padding: 16, boxShadow: "0 18px 45px rgba\(30, 41, 59, 0\.1\)"/,
  'background: "#fff", borderRadius: 16, border: "1px solid #E2E8F0", padding: 16, boxShadow: "0 4px 20px rgba(15, 23, 42, 0.06)"'
);
s = s.replace(
  /background: "radial-gradient\(circle at 15% 10%, #DBEAFE 0%, #EEF2FF 36%, #F8FAFC 100%\)"/,
  'background: "#F1F5F9"'
);
s = s.replace(/\{justUnlockedBadge &&[\s\S]*?\)\}\s*\n/g, "");
s = s.replace(/color: categoryStyle\.text/g, 'color: "#334155"');
s = s.replace(/background: categoryStyle\.bg, color: categoryStyle\.text/g, 'background: "#F1F5F9", color: "#475569"');
s = s.replace(/background: categoryStyle\.bg/g, 'background: "#F8FAFC"');
s = s.replace(/border: `1px solid \$\{categoryStyle\.border\}`/g, 'border: "1px solid #E2E8F0"');
s = s.replace(/boxShadow: `0 8px 24px \$\{categoryStyle\.glow\}`/g, 'boxShadow: "0 4px 16px rgba(15,23,42,0.06)"');
s = s.replace(/background: `linear-gradient\(180deg, #FFFFFF 0%, \$\{categoryStyle\.bg\} 100%\)`/g, 'background: "#FFFFFF"');
s = s.replace(
  /background: `linear-gradient\(180deg, \$\{categoryStyle\.bg\} 0%, #E0F2FE 100%\)`/,
  'background: "#F8FAFC"'
);

fs.writeFileSync(file, s, "utf8");
console.log("done", start, end);
