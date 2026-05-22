// @ts-nocheck
import { useState, useEffect } from "react";
import { auth, db } from "../services/firebase";
import {
  doc, getDoc, runTransaction, collection,
  addDoc, serverTimestamp, query, where, getDocs,
} from "firebase/firestore";
import { COLLECTIONS } from "../services/collectionsData";
import { AvatarSVG, DEFAULT_AVATAR } from "./AvatarCreator";
import type { AvatarConfig } from "./AvatarCreator";
import SalonDecoLayer from "../components/profile/SalonDecoLayer";
import { sanitizeSalonDeco } from "../lib/profileDecoUtils";
import { avatarFrameStyles } from "../lib/profilTheme";

// ?? types ????????????????????????????????????????????????????????????????????
type SalonCfg = { theme:string; titre:string; motto:string; deco:string[] };
const DEF_SALON: SalonCfg = { theme:"defaut", titre:"", motto:"", deco:[] };

const THEMES: Record<string,{gradient:string;dark:boolean}> = {
  defaut: { gradient:"linear-gradient(135deg,#0B2447,#0ea5e9aa)", dark:true  },
  nuit:   { gradient:"linear-gradient(135deg,#0f0c29,#302b63,#24243e)", dark:true  },
  sunset: { gradient:"linear-gradient(135deg,#7f1d1d,#f97316,#fbbf24)", dark:true  },
  ocean:  { gradient:"linear-gradient(135deg,#0369a1,#3b82f6,#38bdf8)", dark:true  },
  sakura: { gradient:"linear-gradient(135deg,#831843,#ec4899,#f9a8d4)", dark:true  },
  galaxy: { gradient:"linear-gradient(135deg,#1e1b4b,#7c3aed,#db2777)", dark:true  },
  brat:   { gradient:"linear-gradient(135deg,#365314,#84cc16,#d9f99d)", dark:false },
  golden: { gradient:"linear-gradient(135deg,#78350f,#d97706,#fef08a)", dark:true  },
  arctic: { gradient:"linear-gradient(135deg,#e0f2fe,#bfdbfe,#a5f3fc)", dark:false },
  foret:  { gradient:"linear-gradient(135deg,#052e16,#166534,#34d399)", dark:true  },
  neon:   { gradient:"linear-gradient(135deg,#0f172a,#1e1b4b,#0f172a)", dark:true  },
  candy:  { gradient:"linear-gradient(135deg,#fce7f3,#f9a8d4,#e879f9)", dark:false },
  desert: { gradient:"linear-gradient(135deg,#7c2d12,#ea580c,#fed7aa)", dark:true  },
  glacier:{ gradient:"linear-gradient(135deg,#0c4a6e,#075985,#38bdf8)", dark:true  },
};

const RARETE_CFG: Record<string,{couleur:string;label:string}> = {
  commune:     { couleur:"#9CA3AF", label:"Commune"     },
  peu_commune: { couleur:"#10B981", label:"Peu commune" },
  rare:        { couleur:"#3B82F6", label:"Rare"        },
  epique:      { couleur:"#0284C7", label:"Épique" },
  legendaire:  { couleur:"#F59E0B", label:"Légendaire" },
  ultra_rare:  { couleur:"#EF4444", label:"Ultra Rare"  },
};

const FAM_COLORS: Record<string,string> = { Architecte:"#3B82F6",Visionnaire:"#0EA5E9",Challenger:"#F97316",Explorateur:"#10B981",Influenceur:"#EF4444" };
const FAM_EMOJIS: Record<string,string> = { Architecte:"??",Visionnaire:"??",Challenger:"?",Explorateur:"??",Influenceur:"??" };

const toutesCartes = COLLECTIONS.flatMap(c => c.cartes);
const PRESTIGE_COST = 50;

const VS_CSS = `
@keyframes vsIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
@keyframes vsDecoFloat{0%,100%{transform:translateY(0) rotate(-5deg)}50%{transform:translateY(-6px) rotate(5deg)}}
@keyframes vsSheetUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
@keyframes vsPulse{0%,100%{box-shadow:0 0 0 0 rgba(192,132,252,0.5)}50%{box-shadow:0 0 0 8px rgba(192,132,252,0)}}
@keyframes avSpin{to{transform:rotate(360deg)}}
.vs-act-btn{transition:all .15s;cursor:pointer;border-radius:14px;padding:14px 12px;display:flex;flex-direction:column;align-items:center;gap:6px;border:none;font-family:system-ui;}
.vs-act-btn:hover{transform:translateY(-2px);filter:brightness(1.1);}
.vs-act-btn:active{transform:scale(0.96);}
.vs-card{transition:all .15s;cursor:pointer;border-radius:12px;overflow:hidden;}
.vs-card:hover{transform:scale(1.04);box-shadow:0 4px 20px rgba(0,0,0,0.3);}
.vs-card:active{transform:scale(0.97);}
.no-sb{scrollbar-width:none}.no-sb::-webkit-scrollbar{display:none}
`;

// ?? AmountSheet ???????????????????????????????????????????????????????????????
function AmountSheet({ label, emoji, maxAmount, description, confirm, onClose }: {
  label:string; emoji:string; maxAmount:number; description?:string;
  confirm:(n:number)=>Promise<void>; onClose:()=>void;
}) {
  const PRESETS = [10,25,50,100,200,500].filter(v=>v<=maxAmount);
  const [val, setVal]   = useState(PRESETS[0]||1);
  const [busy, setBusy] = useState(false);
  const doConfirm = async () => {
    if(busy||val<1||val>maxAmount) return;
    setBusy(true);
    await confirm(val);
    setBusy(false);
  };
  return (
    <div style={{ position:"fixed",inset:0,zIndex:500,display:"flex",flexDirection:"column",justifyContent:"flex-end" }}>
      <div onClick={onClose} style={{ position:"absolute",inset:0,background:"rgba(0,0,0,0.75)" }}/>
      <div style={{ position:"relative",background:"#0f172a",borderRadius:"28px 28px 0 0",padding:"20px 20px 36px",animation:"vsSheetUp .3s cubic-bezier(0.34,1.04,0.64,1)" }}>
        <div style={{ width:"40px",height:"4px",background:"rgba(255,255,255,0.12)",borderRadius:"2px",margin:"0 auto 18px" }}/>
        <div style={{ textAlign:"center",marginBottom:"16px" }}>
          <div style={{ fontSize:"2.5rem",lineHeight:1 }}>{emoji}</div>
          <div style={{ fontFamily:"'Fredoka One',cursive",color:"white",fontSize:"1.2rem",marginTop:"8px" }}>{label}</div>
          {description&&<div style={{ color:"#64748b",fontSize:"0.75rem",marginTop:"4px" }}>{description}</div>}
        </div>
        <div style={{ display:"flex",gap:"8px",flexWrap:"wrap",justifyContent:"center",marginBottom:"14px" }}>
          {PRESETS.map(p=>(
            <button key={p} onClick={()=>setVal(p)}
              style={{ padding:"8px 16px",borderRadius:"10px",border:"none",fontWeight:800,fontSize:"0.9rem",cursor:"pointer",
                background:val===p?"#a78bfa":"rgba(255,255,255,0.08)",color:val===p?"white":"#64748b" }}>
              {p}
            </button>
          ))}
        </div>
        <div style={{ display:"flex",alignItems:"center",gap:"10px",marginBottom:"18px",justifyContent:"center" }}>
          <button onClick={()=>setVal(v=>Math.max(1,v-1))} style={{ width:36,height:36,borderRadius:"50%",border:"none",background:"rgba(255,255,255,0.08)",color:"white",fontSize:"1.2rem",cursor:"pointer" }}>
            {"-"}
          </button>
          <input type="number" min={1} max={maxAmount} value={val}
            onChange={e=>setVal(Math.max(1,Math.min(maxAmount,Number(e.target.value))))}
            style={{ width:"80px",textAlign:"center",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"10px",padding:"8px",color:"white",fontSize:"1.1rem",fontWeight:800,outline:"none" }}/>
          <button onClick={()=>setVal(v=>Math.min(maxAmount,v+1))} style={{ width:36,height:36,borderRadius:"50%",border:"none",background:"rgba(255,255,255,0.08)",color:"white",fontSize:"1.2rem",cursor:"pointer" }}>
            {"+"}
          </button>
        </div>
        <button onClick={doConfirm} disabled={busy||val<1}
          style={{ width:"100%",padding:"15px",borderRadius:"16px",border:"none",fontWeight:900,fontSize:"1rem",cursor:"pointer",
            background:busy||val<1?"rgba(255,255,255,0.06)":"linear-gradient(135deg,#a78bfa,#ec4899)",
            color:busy||val<1?"#1e293b":"white",fontFamily:"'Fredoka One',cursive" }}>
          {busy?"⏳ En cours...":"✨ Confirmer — "+val}
        </button>
      </div>
    </div>
  );
}

// ?? ExchangeSheet ?????????????????????????????????????????????????????????????
function ExchangeSheet({ myCards, theirCards, toPrenom, onPropose, onClose }: {
  myCards:{id:string;nom:string;image:string;rarete:string}[];
  theirCards:{id:string;nom:string;image:string;rarete:string}[];
  toPrenom:string;
  onPropose:(m:{id:string;nom:string;image:string;rarete:string},t:{id:string;nom:string;image:string;rarete:string})=>Promise<void>;
  onClose:()=>void;
}) {
  const [mySel,   setMySel]   = useState<string|null>(null);
  const [theirSel,setTheirSel]= useState<string|null>(null);
  const [busy,    setBusy]    = useState(false);
  const [step,    setStep]    = useState<"mine"|"theirs">("mine");
  const myCard    = myCards.find(c=>c.id===mySel);
  const theirCard = theirCards.find(c=>c.id===theirSel);
  const doPropose = async () => {
    if(!myCard||!theirCard||busy) return;
    setBusy(true);
    await onPropose(myCard,theirCard);
    setBusy(false);
  };
  const cfg = (r:string) => RARETE_CFG[r]||{ couleur:"#9CA3AF",label:"?" };
  return (
    <div style={{ position:"fixed",inset:0,zIndex:500,display:"flex",flexDirection:"column",justifyContent:"flex-end" }}>
      <div onClick={onClose} style={{ position:"absolute",inset:0,background:"rgba(0,0,0,0.75)" }}/>
      <div style={{ position:"relative",background:"#0f172a",borderRadius:"28px 28px 0 0",maxHeight:"85vh",display:"flex",flexDirection:"column",animation:"vsSheetUp .3s cubic-bezier(0.34,1.04,0.64,1)" }}>
        <div style={{ padding:"16px 20px 0",flexShrink:0 }}>
          <div style={{ width:"40px",height:"4px",background:"rgba(255,255,255,0.12)",borderRadius:"2px",margin:"0 auto 12px" }}/>
          <div style={{ textAlign:"center",marginBottom:"10px" }}>
            <div style={{ fontFamily:"'Fredoka One',cursive",color:"white",fontSize:"1.2rem" }}>
              {"🃏 Proposer un échange"}
            </div>
            <div style={{ color:"#64748b",fontSize:"0.75rem",marginTop:"4px" }}>
              {"avec "}{toPrenom}
            </div>
          </div>
          <div style={{ display:"flex",gap:"8px",marginBottom:"12px" }}>
            {[{k:"mine",l:"Ta carte"},{k:"theirs",l:"Sa carte"}].map(({k,l})=>(
              <button key={k} onClick={()=>setStep(k as "mine"|"theirs")}
                style={{ flex:1,padding:"8px",borderRadius:"10px",border:"none",fontWeight:800,fontSize:"0.78rem",cursor:"pointer",
                  background:step===k?"rgba(167,139,250,0.25)":"rgba(255,255,255,0.05)",color:step===k?"#c084fc":"#475569" }}>
                {l}{k==="mine"&&mySel?" ?":""}{k==="theirs"&&theirSel?" ?":""}
              </button>
            ))}
          </div>
        </div>
        <div className="no-sb" style={{ overflowY:"auto",padding:"0 16px 8px",flex:1 }}>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(88px,1fr))",gap:"8px" }}>
            {(step==="mine"?myCards:theirCards).map(c=>{
              const sel = step==="mine"?mySel:theirSel;
              const col = cfg(c.rarete).couleur;
              return(
                <div key={c.id} className="vs-card"
                  onClick={()=>step==="mine"?setMySel(c.id):setTheirSel(c.id)}
                  style={{ border:`2px solid ${sel===c.id?col:col+"40"}`,boxShadow:sel===c.id?`0 0 12px ${col}80`:"none",background:"rgba(255,255,255,0.04)" }}>
                  <img src={c.image} alt={c.nom} style={{ width:"100%",display:"block" }}/>
                  <div style={{ padding:"4px 6px",borderTop:`1px solid ${col}20` }}>
                    <div style={{ fontSize:"0.52rem",fontWeight:700,color:"white",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{c.nom}</div>
                    <div style={{ fontSize:"0.47rem",color:col }}>{cfg(c.rarete).label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div style={{ padding:"12px 16px 28px",borderTop:"1px solid rgba(255,255,255,0.07)",flexShrink:0 }}>
          {myCard&&theirCard?(
            <div style={{ display:"flex",gap:"10px",alignItems:"center",marginBottom:"12px",padding:"10px",background:"rgba(167,139,250,0.08)",borderRadius:"12px",border:"1px solid rgba(167,139,250,0.2)" }}>
              <img src={myCard.image} alt="" style={{ width:"44px",borderRadius:"8px" }}/>
              <div style={{ color:"#a78bfa",fontSize:"1.2rem",fontWeight:900 }}>{"⇄"}</div>
              <img src={theirCard.image} alt="" style={{ width:"44px",borderRadius:"8px" }}/>
              <div style={{ flex:1,fontSize:"0.72rem",color:"#94a3b8" }}>
                <div style={{ fontWeight:700 }}>{myCard.nom}</div>
                <div style={{ color:"#475569" }}>{"contre"}</div>
                <div style={{ fontWeight:700 }}>{theirCard.nom}</div>
              </div>
            </div>
          ):(
            <div style={{ textAlign:"center",color:"#475569",fontSize:"0.78rem",marginBottom:"12px" }}>
              {"Sélectionne ta carte (onglet 1) puis la sienne (onglet 2)"}
            </div>
          )}
          <button onClick={doPropose} disabled={!myCard||!theirCard||busy}
            style={{ width:"100%",padding:"14px",borderRadius:"14px",border:"none",fontWeight:900,fontSize:"0.95rem",
              cursor:myCard&&theirCard?"pointer":"not-allowed",
              background:myCard&&theirCard?"linear-gradient(135deg,#6366f1,#ec4899)":"rgba(255,255,255,0.06)",
              color:myCard&&theirCard?"white":"#1e293b",fontFamily:"'Fredoka One',cursive" }}>
            {busy?"⏳...":"📨 Envoyer la proposition"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ?? MAIN ?????????????????????????????????????????????????????????????????????
export default function VisiteSalon({ visitedUid, myProfil, onBack }: {
  visitedUid: string;
  myProfil: { id: string; xp?: number; prenom?: string; cartes?: Record<string, number> };
  onBack: ()=>void;
}) {
  const [data,    setData]    = useState<Record<string,unknown>|null>(null);
  const [loading, setLoading] = useState(true);
  const [toast,   setToast]   = useState<{msg:string;ok:boolean}|null>(null);
  const [sheet,   setSheet]   = useState<"jetons"|"prestige"|"echange"|null>(null);
  const [myJetons,setMyJetons]= useState(myProfil.xp||0);

  const showToast = (msg:string, ok=true) => {
    setToast({msg,ok});
    setTimeout(()=>setToast(null),3000);
  };

  useEffect(()=>{
    getDoc(doc(db,"users",visitedUid)).then(snap=>{
      if(snap.exists()) setData({ id:snap.id, ...snap.data() });
      setLoading(false);
    }).catch(()=>setLoading(false));
  },[visitedUid]);

  const donnerJetons = async (amount:number) => {
    if(myJetons<amount){ showToast("⚠️ Pas assez de jetons !",false); return; }
    try{
      await runTransaction(db,async tx=>{
        const myRef  = doc(db,"users",auth.currentUser.uid);
        const herRef = doc(db,"users",visitedUid);
        const mySnap = await tx.get(myRef);
        if(!mySnap.exists()) throw new Error();
        if((mySnap.data().xp||0)<amount) throw new Error("Jetons insuffisants");
        const herSnap = await tx.get(herRef);
        tx.update(myRef,  { xp:(mySnap.data().xp||0)-amount });
        tx.update(herRef, { xp:(herSnap.data()?.xp||0)+amount });
      });
      setMyJetons(j=>j-amount);
      showToast(`?? ${amount} jetons envoy—s à ${data?.prenom} !`);
      setSheet(null);
    }catch(e){ showToast((e instanceof Error?e.message:"Erreur lors du don"),false); }
  };

  const donnerPrestige = async (amount:number) => {
    const cost = amount*PRESTIGE_COST;
    if(myJetons<cost){ showToast("⚠️ Pas assez de jetons !",false); return; }
    try{
      await runTransaction(db,async tx=>{
        const myRef  = doc(db,"users",auth.currentUser.uid);
        const herRef = doc(db,"users",visitedUid);
        const mySnap = await tx.get(myRef);
        if(!mySnap.exists()) throw new Error();
        if((mySnap.data().xp||0)<cost) throw new Error("Jetons insuffisants");
        tx.update(myRef, {
          xp: (mySnap.data().xp||0)-cost,
          prestigeDonBonus: ((mySnap.data().prestigeDonBonus)||0)+amount*2,
        });
        const herSnap = await tx.get(herRef);
        tx.update(herRef, {
          prestigeGifted: (Number(herSnap.data()?.prestigeGifted) || 0) + amount,
          lastPrestigeGift: {
            fromUid: auth.currentUser!.uid,
            fromPrenom: myProfil.prenom,
            amount,
            at: Date.now(),
          },
        });
      });
      setMyJetons(j=>j-cost);
      showToast("?? Surprise envoy—e !");
      setSheet(null);
    }catch(e){ showToast((e instanceof Error?e.message:"Erreur"),false); }
  };

  const proposerEchange = async (myCard, theirCard) => {
    try{
      await addDoc(collection(db,"tradeOffers"),{
        fromUid:   auth.currentUser.uid,
        fromPrenom:myProfil.prenom,
        toUid:     visitedUid,
        toPrenom:  data?.prenom,
        fromCard:  myCard,
        toCard:    theirCard,
        status:    "pending",
        createdAt: serverTimestamp(),
      });
      showToast(`?? Proposition envoy—e à ${data?.prenom} !`);
      setSheet(null);
    }catch(e){ showToast("Erreur lors de la proposition",false); }
  };

  if(loading) return(
    <div style={{ minHeight:"100vh",background:"#070a12",display:"flex",alignItems:"center",justifyContent:"center" }}>
      <style>{VS_CSS}</style>
      <div style={{ width:"40px",height:"40px",border:"3px solid rgba(167,139,250,0.3)",borderTopColor:"#a78bfa",borderRadius:"50%",animation:"avSpin 0.8s linear infinite" }}/>
    </div>
  );

  if(!data) return(
    <div style={{ minHeight:"100vh",background:"#070a12",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"16px" }}>
      <style>{VS_CSS}</style>
      <div style={{ fontSize:"3rem",lineHeight:1 }}>{"😕"}</div>
      <div style={{ color:"white",fontFamily:"'Fredoka One',cursive",fontSize:"1.2rem" }}>{"Salon introuvable"}</div>
      <button onClick={onBack} style={{ background:"#a78bfa",color:"white",border:"none",padding:"12px 24px",borderRadius:"14px",fontWeight:800,cursor:"pointer" }}>
        {"← Retour"}
      </button>
    </div>
  );

  const salon: SalonCfg = { ...DEF_SALON, ...(data.salon||{}) };
  const theme = THEMES[salon.theme]||THEMES.defaut;
  const avatarCfg: AvatarConfig = { ...DEFAULT_AVATAR, ...(data.avatar||{}) };
  const couleurFamille = FAM_COLORS[data.famille as string]||"#0EA5E9";
  const avatarFrameKey = ((data.pageStyle as { avatarFrame?: string })?.avatarFrame) || "defaut";
  const afStyles = avatarFrameStyles(avatarFrameKey, couleurFamille);
  const vitrine: {image:string;nom:string;rarete:string}[] = (data.vitrine||[]) as {image:string;nom:string;rarete:string}[];
  const salonTitre = salon.titre || `Le Salon de ${data.prenom}`;
  const myOwnedCards = toutesCartes.filter(c=>(myProfil.cartes||{})[c.id]>0);
  const theirCartes  = (data.cartes||{}) as Record<string,number>;
  const theirCards   = toutesCartes.filter(c=>theirCartes[c.id]>0);
  const canAffordPrestige = myJetons>=PRESTIGE_COST;

  return(
    <div style={{ minHeight:"100vh",background:"#0f172a",fontFamily:"'Nunito',sans-serif" }}>
      <style>{VS_CSS}</style>
      {toast&&(
        <div style={{ position:"fixed",top:"80px",left:"50%",transform:"translateX(-50%)",zIndex:999,
          background:toast.ok?"#16a34a":"#dc2626",color:"white",fontWeight:700,padding:"12px 24px",
          borderRadius:"20px",boxShadow:"0 6px 20px rgba(0,0,0,0.4)",animation:"vsIn 0.2s both",
          whiteSpace:"nowrap",pointerEvents:"none",fontFamily:"'Fredoka One',cursive" }}>
          {toast.msg}
        </div>
      )}

      {/* ?? HEADER ?????????????????????????????????????????????????? */}
      <div style={{ background:"rgba(7,10,18,0.97)",backdropFilter:"blur(16px)",borderBottom:"1px solid rgba(255,255,255,0.07)",padding:"12px 16px",display:"flex",alignItems:"center",gap:"12px",position:"sticky",top:0,zIndex:100 }}>
        <button onClick={onBack} style={{ background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:"10px",padding:"8px 14px",color:"white",fontWeight:700,fontSize:"0.82rem",cursor:"pointer" }}>
          {"← Retour"}
        </button>
        <div style={{ flex:1,fontSize:"0.78rem",color:"#475569",fontWeight:700,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>
          {"Vous visitez le salon de "}
          <span style={{ color:"white" }}>{data.prenom as string}</span>
        </div>
        <div style={{ background:"rgba(251,191,36,0.12)",border:"1px solid rgba(251,191,36,0.25)",borderRadius:"10px",padding:"6px 12px",color:"#fbbf24",fontSize:"0.78rem",fontWeight:800,flexShrink:0 }}>
          {"⚡ "}{myJetons.toLocaleString("fr-FR")}
        </div>
      </div>

      <div style={{ maxWidth:"560px",margin:"0 auto",padding:"16px",display:"flex",flexDirection:"column",gap:"14px" }}>

        {/* ?? SALON CARD ??????????????????????????????????????????? */}
        <div style={{ borderRadius:"24px",overflow:"hidden",boxShadow:"0 12px 40px rgba(0,0,0,0.4)",animation:"vsIn 0.3s both" }}>
          <div style={{ background:theme.gradient,padding:"24px",position:"relative",overflow:"hidden" }}>
            <SalonDecoLayer salon={salon} couleurFamille={couleurFamille} animate animSet="visit" />
            <div style={{ position:"absolute",bottom:"10px",left:"14px",fontSize:"0.58rem",fontWeight:700,color:theme.dark?"rgba(255,255,255,0.35)":"rgba(0,0,0,0.3)",letterSpacing:"0.1em",textTransform:"uppercase" }}>
              {"🏠 "}{salonTitre}
            </div>
            <div style={{ position:"relative",zIndex:1,textAlign:"center",paddingBottom:"14px" }}>
              <div style={{ display:"flex",justifyContent:"center",marginBottom:"12px",filter:"drop-shadow(0 12px 24px rgba(0,0,0,0.35))" }}>
                <div style={afStyles.ring}>
                  <div style={afStyles.inner}>
                    <AvatarSVG config={avatarCfg} size={100}/>
                  </div>
                </div>
              </div>
              <p style={{ fontFamily:"'Fredoka One',cursive",color:theme.dark?"white":"#0f172a",fontSize:"1.6rem",margin:"0 0 6px",textShadow:theme.dark?"0 2px 12px rgba(0,0,0,0.5)":"none" }}>
                {data.prenom as string}
              </p>
              <span style={{ background:couleurFamille+"30",color:theme.dark?"white":"#0f172a",fontFamily:"'Fredoka One',cursive",padding:"3px 14px",borderRadius:"100px",fontSize:"0.8rem",border:`1px solid ${couleurFamille}50` }}>
                {FAM_EMOJIS[data.famille as string]||""} {data.famille as string||""}
              </span>
              {salon.motto&&(
                <div style={{ marginTop:"10px",fontSize:"0.8rem",color:theme.dark?"rgba(255,255,255,0.7)":"rgba(0,0,0,0.6)",fontStyle:"italic" }}>
                  {"“"}{salon.motto}{"”"}
                </div>
              )}
              <div style={{ display:"flex",gap:"10px",justifyContent:"center",marginTop:"12px" }}>
                <div style={{ background:"rgba(0,0,0,0.25)",borderRadius:"10px",padding:"6px 14px",color:theme.dark?"white":"#0f172a",fontSize:"0.85rem",fontFamily:"'Fredoka One',cursive" }}>
                  {"⚡ "}{(data.xp as number||0).toLocaleString("fr-FR")}
                </div>
                <div style={{ background:"rgba(0,0,0,0.25)",borderRadius:"10px",padding:"6px 14px",color:theme.dark?"white":"#0f172a",fontSize:"0.85rem",fontFamily:"'Fredoka One',cursive" }}>
                  {"🃏 "}{theirCards.length}{" cartes"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ?? VITRINE ??????????????????????????????????????????????? */}
        {vitrine.some(Boolean)&&(
          <div style={{ background:"white",borderRadius:"20px",padding:"18px",boxShadow:"0 4px 16px rgba(0,0,0,0.08)" }}>
            <p style={{ fontFamily:"'Fredoka One',cursive",color:"#1A1A2E",fontSize:"1.1rem",margin:"0 0 12px" }}>
              {"✨ Vitrine"}
            </p>
            <div style={{ display:"flex",gap:"10px",justifyContent:"center" }}>
              {[0,1,2].map(i=>{
                const c = vitrine[i];
                if(!c) return(
                  <div key={i} style={{ flex:1,maxWidth:120,borderRadius:"12px",border:"2px dashed #E5E7EB",padding:"24px 0",display:"flex",alignItems:"center",justifyContent:"center",color:"#9CA3AF",fontSize:"0.7rem" }}>
                    {"—"}
                  </div>
                );
                const col = (RARETE_CFG[c.rarete]||{couleur:"#9CA3AF"}).couleur;
                return(
                  <div key={i} style={{ flex:1,maxWidth:120,borderRadius:"12px",overflow:"hidden",border:`2px solid ${col}60`,boxShadow:`0 4px 12px ${col}25` }}>
                    <img src={c.image} alt={c.nom} style={{ width:"100%",display:"block" }}/>
                    <div style={{ padding:"5px 8px",borderTop:`1px solid ${col}20` }}>
                      <p style={{ fontSize:"0.52rem",fontWeight:700,color:"#1A1A2E",margin:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{c.nom}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ?? ACTIONS ??????????????????????????????????????????????? */}
        <div style={{ background:"linear-gradient(135deg,rgba(167,139,250,0.07),rgba(236,72,153,0.07))",borderRadius:"20px",padding:"18px",border:"1px solid rgba(167,139,250,0.18)" }}>
          <p style={{ fontFamily:"'Fredoka One',cursive",color:"white",fontSize:"1.1rem",margin:"0 0 14px" }}>
            {"🤝 Interactions"}
          </p>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"10px" }}>

            <button className="vs-act-btn" onClick={()=>setSheet("jetons")}
              style={{ background:"rgba(251,191,36,0.12)",border:"1px solid rgba(251,191,36,0.28)",color:"white" }}>
              <span style={{ fontSize:"1.8rem",lineHeight:1 }}>{"💰"}</span>
              <span style={{ fontSize:"0.7rem",fontWeight:800,color:"#fbbf24" }}>{"Don jetons"}</span>
              <span style={{ fontSize:"0.58rem",color:"#64748b",textAlign:"center",lineHeight:1.3 }}>{"Offrir des jetons"}</span>
            </button>

            <button className="vs-act-btn" onClick={()=>setSheet("echange")}
              disabled={myOwnedCards.length===0||theirCards.length===0}
              style={{ background:"rgba(99,102,241,0.12)",border:"1px solid rgba(99,102,241,0.28)",color:"white",opacity:myOwnedCards.length===0||theirCards.length===0?0.4:1 }}>
              <span style={{ fontSize:"1.8rem",lineHeight:1 }}>{"🃏"}</span>
              <span style={{ fontSize:"0.7rem",fontWeight:800,color:"#818cf8" }}>{"Troc cartes"}</span>
              <span style={{ fontSize:"0.58rem",color:"#64748b",textAlign:"center",lineHeight:1.3 }}>{"Proposer un échange"}</span>
            </button>

            <button className="vs-act-btn" onClick={()=>setSheet("prestige")}
              disabled={!canAffordPrestige}
              style={{ background:"rgba(192,132,252,0.12)",border:"1px solid rgba(192,132,252,0.28)",color:"white",opacity:canAffordPrestige?1:0.4 }}>
              <span style={{ fontSize:"1.8rem",lineHeight:1 }}>{"🎁"}</span>
              <span style={{ fontSize:"0.7rem",fontWeight:800,color:"#c084fc" }}>{"Surprise"}</span>
              <span style={{ fontSize:"0.58rem",color:"#64748b",textAlign:"center",lineHeight:1.3 }}>{"Offrir une surprise"}</span>
            </button>
          </div>

        </div>

        <p style={{ textAlign:"center",padding:"6px",color:"#1e293b",fontSize:"0.65rem",margin:0 }}>
          {"🔇 Mode visite — aucun message, interactions seulement"}
        </p>
      </div>

      {/* ?? SHEETS ???????????????????????????????????????????????????? */}
      {sheet==="jetons"&&(
        <AmountSheet
          label={`Don à ${data.prenom}`}
          emoji={"💰"}
          maxAmount={myJetons}
          description={`Tu as ${myJetons.toLocaleString("fr-FR")} jetons`}
          confirm={donnerJetons}
          onClose={()=>setSheet(null)}/>
      )}
      {sheet==="prestige"&&(
        <AmountSheet
          label={`Surprise pour ${data.prenom}`}
          emoji={"🎁"}
          maxAmount={Math.max(0,Math.floor(myJetons/PRESTIGE_COST))}
          description={"À toi de choisir l’intensité"}
          confirm={donnerPrestige}
          onClose={()=>setSheet(null)}/>
      )}
      {sheet==="echange"&&(
        <ExchangeSheet
          myCards={myOwnedCards}
          theirCards={theirCards}
          toPrenom={data.prenom as string}
          onPropose={proposerEchange}
          onClose={()=>setSheet(null)}/>
      )}
    </div>
  );
}
