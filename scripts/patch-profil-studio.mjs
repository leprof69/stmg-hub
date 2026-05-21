import fs from "fs";
let lines = fs.readFileSync("src/pages/Profil.tsx", "utf8").split(/\r?\n/);

// Keep imports (0-28), skip duplicate constants (29-429), keep utilities+main helpers (430-755), skip editors (756-1259), keep main (1260+)
let out = [
  ...lines.slice(0, 29),
  ...lines.slice(429, 756),
  ...lines.slice(1260),
];

let s = out.join("\n");

// Remove duplicate decoLabel function body (imported from lib)
s = s.replace(/function decoLabel\(em: string\): string \{[\s\S]*?\}\r?\n\r?\nconst PROFIL_CSS/, "const PROFIL_CSS");

// Remove unused LottieItem if only in removed editors - check main view
// Keep LottieItem for now in case gif uses it

// Fix buttons
s = s.replace(
  /<button onClick=\{\(\)=>setShowPageEditor\(true\)\}[\s\S]*?<\/button>\s*\n\s*\{\/\* Bouton décorer \*\/\}\s*\n\s*<button onClick=\{\(\)=>setShowSalonEditor\(true\)\}[\s\S]*?<\/button>/,
  `<button onClick={()=>setShowStudio(true)}
              style={{ position:"absolute",top:"14px",right:"14px",background:"linear-gradient(135deg,rgba(139,92,246,0.55),rgba(236,72,153,0.45))",backdropFilter:"blur(14px)",border:"1px solid rgba(255,255,255,0.35)",borderRadius:"14px",padding:"8px 16px",color:"white",fontSize:"0.78rem",fontWeight:800,cursor:"pointer",display:"flex",alignItems:"center",gap:"6px",zIndex:2,boxShadow:"0 4px 24px rgba(139,92,246,0.4)" }}>
              <span>{"\\u2728"}</span><span>{"Personnaliser"}</span>
            </button>`
);

s = s.replace(
  /\{showPageEditor&&\([\s\S]*?\)\}\s*\n\s*\{showSalonEditor&&\([\s\S]*?\)\}/,
  `{showStudio&&(
        <ProfileStudio
          prenom={profil.prenom as string}
          couleurFamille={couleurFamille}
          avatarConfig={avatarConfig}
          pageStyle={pageStyle}
          salon={salon}
          jetons={jetonsCurrent}
          ownedPageItems={ownedPageItems}
          ownedThemes={ownedThemes}
          onBuyPageItem={buyPageItem}
          onBuyTheme={buyTheme}
          onSave={saveStudio}
          onClose={()=>setShowStudio(false)}
        />
      )}`
);

// Salon deco on profile view
s = s.replace(
  /\{em\.startsWith\("lottie:"\)\s*\? <LottieItem url=\{em\.slice\(7\)\} size=\{52\}\/>\s*: em\.startsWith\("icon:"\)\s*\? <Icon icon=\{em\.slice\(5\)\} width=\{44\} height=\{44\} style=\{\{display:"block",\.\.\.iconStyleForId\(em\.slice\(5\),couleurFamille\)\}\}\/>\s*: em\.startsWith\("emoji:"\)\s*\? <span style=\{\{fontSize:"36px"\}\}>\{em\.slice\(6\)\}<\/span>\s*: <span style=\{\{fontSize:"1\.9rem"\}\}>\{em\}<\/span>\}/,
  `<SalonDecoSticker em={em} fontSize={(pos as {fontSize:string}).fontSize} accentColor={couleurFamille}/>`
);

fs.writeFileSync("src/pages/Profil.tsx", s, "utf8");
console.log("lines out", out.length);
