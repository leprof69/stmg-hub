import { useState, useEffect, useCallback } from "react";
import { Icon } from "@iconify/react";
import { auth, db } from "../services/firebase";
import { doc, getDoc, runTransaction } from "firebase/firestore";
import type { UserProfile } from "../services/userProfileService";

// ---------------------------------------------------------------------------
// TYPES
// ---------------------------------------------------------------------------
export type AvatarConfig = {
  skinColor:string; top:string; hairColor:string;
  accessories:string; facialHair:string; clothing:string;
  clothesColor:string; eyes:string; eyebrows:string; mouth:string;
  bgColor:string; bgType:string; frame:string;
  nose:string; sticker:string;
};
export const DEFAULT_AVATAR: AvatarConfig = {
  skinColor:"edb98a",top:"shortFlat",hairColor:"724133",
  accessories:"none",facialHair:"none",clothing:"shirtCrewNeck",
  clothesColor:"5199e4",eyes:"default",eyebrows:"default",mouth:"smile",
  bgColor:"b6e3f4",bgType:"solid",frame:"none",nose:"none",sticker:"none",
};

// ---------------------------------------------------------------------------
// FRAMES
// ---------------------------------------------------------------------------
export const FRAME_CFG: Record<string,{conic:string;speed:string;glow?:string}> = {
  none:    {conic:"#a78bfa,#ec4899,#22d3ee,#a78bfa",speed:"4s"},
  neon:    {conic:"#00f5ff,#a78bfa,#00f5ff,#22d3ee",speed:"2s",  glow:"0 0 18px #00f5ff88"},
  fire:    {conic:"#ff6b00,#ff0000,#ffb300,#ff4500,#ff6b00",speed:"1.5s",glow:"0 0 18px #ff6b0088"},
  ice:     {conic:"#a8edea,#007cf0,#ffffff,#007cf0,#a8edea",speed:"3s",  glow:"0 0 18px #007cf088"},
  galaxy:  {conic:"#667eea,#764ba2,#ec4899,#667eea",speed:"2.5s",glow:"0 0 18px #764ba288"},
  gold:    {conic:"#f7971e,#ffd200,#f7971e,#c8860a",speed:"2s",  glow:"0 0 18px #ffd20088"},
  spring:  {conic:"#56ab2f,#f093fb,#ffb347,#a8e063,#56ab2f",speed:"4s",glow:"0 0 14px #56ab2f88"},
  brat:    {conic:"#8cc63f,#aaff00,#c8ff00,#8cc63f",speed:"1.5s",glow:"0 0 18px #aaff0088"},
  rainbow: {conic:"#ff0000,#ff7f00,#ffff00,#00ff00,#0000ff,#8b00ff,#ff0000",speed:"1.5s",glow:"0 0 18px #ffffff55"},
  prestige:{conic:"#ffd700,#ffffff,#ffd700,#fffacd,#ffd700",speed:"2s",glow:"0 0 24px #ffd70099"},
};

// ---------------------------------------------------------------------------
// JOUES
// ---------------------------------------------------------------------------
type CheekCfg={leftBg?:string;rightBg?:string;text?:string;textTop?:string};
const CHEEK_MAP:Record<string,CheekCfg>={
  none:{},
  blushRose: {leftBg:"rgba(255,100,130,0.40)",rightBg:"rgba(255,100,130,0.40)"},
  blushPeach:{leftBg:"rgba(255,160,80,0.44)", rightBg:"rgba(255,160,80,0.44)"},
  blushLilac:{leftBg:"rgba(180,100,255,0.38)",rightBg:"rgba(180,100,255,0.38)"},
  blushBlue: {leftBg:"rgba(80,160,255,0.38)", rightBg:"rgba(80,160,255,0.38)"},
  freckles:  {text:"?  ?  ?",textTop:"54%"},
  beautyMark:{text:"•",textTop:"62%"},
  sparkle:   {text:"✨",textTop:"56%"},
  star:      {text:"⭐",textTop:"56%"},
  diamond:   {text:"💎",textTop:"56%"},
};

// ---------------------------------------------------------------------------
// STICKERS à Iconify (Solar Duotone + Noto Google)
// ---------------------------------------------------------------------------
type StickerDef={icon:string;top:string;left:string;sz:number;rotation?:string;color?:string};
const STICKER_CFG:Record<string,StickerDef|null>={
  none:null,
  headphones:    {icon:"solar:headphones-round-bold-duotone",top:"0%", left:"52%",sz:0.30,rotation:"-6deg", color:"#a78bfa"},
  controller:    {icon:"solar:gamepad-bold-duotone",         top:"68%",left:"55%",sz:0.27,rotation:"8deg",  color:"#60a5fa"},
  micro:         {icon:"solar:microphone-3-bold-duotone",    top:"58%",left:"62%",sz:0.26,rotation:"12deg", color:"#f472b6"},
  wifi:          {icon:"solar:wi-fi-bold-duotone",           top:"2%", left:"60%",sz:0.24,rotation:"0deg",  color:"#4ade80"},
  crown:         {icon:"solar:crown-bold-duotone",           top:"-1%",left:"24%",sz:0.34,rotation:"0deg",  color:"#fbbf24"},
  sunglasses:    {icon:"solar:sun-glasses-bold-duotone",     top:"30%",left:"-5%",sz:0.28,rotation:"-5deg", color:"#94a3b8"},
  music:         {icon:"solar:music-notes-bold-duotone",     top:"6%", left:"64%",sz:0.24,rotation:"12deg", color:"#34d399"},
  medal:         {icon:"solar:medal-star-bold-duotone",      top:"62%",left:"62%",sz:0.28,rotation:"8deg",  color:"#fbbf24"},
  diploma:       {icon:"solar:diploma-bold-duotone",         top:"66%",left:"-2%",sz:0.26,rotation:"-8deg", color:"#a78bfa"},
  planet:        {icon:"solar:planet-bold-duotone",          top:"2%", left:"56%",sz:0.28,rotation:"0deg",  color:"#60a5fa"},
  sakura:        {icon:"noto:cherry-blossom",                top:"3%", left:"60%",sz:0.26,rotation:"8deg"},
  butterfly:     {icon:"noto:butterfly",                     top:"1%", left:"54%",sz:0.28,rotation:"5deg"},
  sunflower:     {icon:"noto:sunflower",                     top:"68%",left:"1%", sz:0.27,rotation:"-12deg"},
  hibiscus:      {icon:"noto:hibiscus",                      top:"68%",left:"60%",sz:0.25,rotation:"10deg"},
  leaf:          {icon:"noto:leaf-fluttering-in-wind",       top:"65%",left:"62%",sz:0.24,rotation:"15deg"},
  fire:          {icon:"noto:fire",                          top:"64%",left:"-2%",sz:0.28,rotation:"-8deg"},
  lightning:     {icon:"noto:high-voltage",                  top:"62%",left:"64%",sz:0.25,rotation:"5deg"},
  rainbow:       {icon:"noto:rainbow",                       top:"2%", left:"4%", sz:0.30,rotation:"0deg"},
  shooting_star: {icon:"noto:shooting-star",                 top:"2%", left:"58%",sz:0.27,rotation:"-10deg"},
  moon:          {icon:"noto:crescent-moon",                 top:"4%", left:"62%",sz:0.24,rotation:"15deg"},
  snowflake:     {icon:"noto:snowflake",                     top:"4%", left:"2%", sz:0.24,rotation:"-10deg"},
  gem:           {icon:"noto:gem-stone",                     top:"5%", left:"1%", sz:0.24,rotation:"-10deg"},
  sparkling_heart:{icon:"noto:sparkling-heart",              top:"4%", left:"64%",sz:0.22,rotation:"10deg"},
  glowing_star:  {icon:"noto:glowing-star",                  top:"5%", left:"62%",sz:0.22,rotation:"8deg"},
  trophy:        {icon:"noto:trophy",                        top:"68%",left:"58%",sz:0.26,rotation:"5deg"},
  pizza:         {icon:"noto:pizza",                         top:"68%",left:"-2%",sz:0.25,rotation:"-8deg"},
  ice_cream:     {icon:"noto:soft-ice-cream",                top:"4%", left:"62%",sz:0.24,rotation:"5deg"},
  halo:          {icon:"noto:baby-angel",                    top:"-2%",left:"25%",sz:0.32,rotation:"0deg"},
  alien:         {icon:"noto:alien",                         top:"-2%",left:"46%",sz:0.32,rotation:"0deg"},
  cat:           {icon:"noto:cat-face",                      top:"-2%",left:"44%",sz:0.32,rotation:"0deg"},
  unicorn:       {icon:"noto:unicorn",                       top:"-2%",left:"42%",sz:0.34,rotation:"0deg"},
  dragon:        {icon:"noto:dragon",                        top:"-3%",left:"40%",sz:0.36,rotation:"0deg"},
  robot:         {icon:"noto:robot",                         top:"-2%",left:"44%",sz:0.32,rotation:"0deg"},
};

// Particules fond (Noto SVG)
const BG_PARTICLES:Record<string,string[]>={
  "56ab2f":["noto:cherry-blossom","noto:cherry-blossom","noto:blossom","noto:cherry-blossom"],
  "a8e063":["noto:tulip","noto:sunflower","noto:hibiscus","noto:bouquet"],
  "d4fc79":["noto:leaf-fluttering-in-wind","noto:four-leaf-clover","noto:herb","noto:seedling"],
  "f43f5e":["noto:rainbow","noto:sun","noto:cloud-with-sun","noto:sparkles"],
  "3b82f6":["noto:water-wave","noto:snowflake","noto:fish","noto:water-wave"],
  "a78bfa":["noto:sparkles","noto:shooting-star","noto:milky-way","noto:sparkles"],
  "1e1b4b":["noto:glowing-star","noto:sparkles","noto:night-with-stars","noto:glowing-star"],
  "fbbf24":["noto:sun","noto:sparkles","noto:sun-with-face","noto:sun"],
};
const PPOS=[{top:"6%",left:"5%"},{top:"6%",right:"5%",left:"auto"},{top:"73%",left:"5%"},{top:"73%",right:"5%",left:"auto"}] as const;

// ---------------------------------------------------------------------------
// VALIDATION
// ---------------------------------------------------------------------------
const HEX6=/^[a-fA-F0-9]{6}$/;
const VALID_TOP=new Set(["shortFlat","shortRound","shortCurly","shortWaved","sides","theCaesar","theCaesarAndSidePart","frizzle","shaggy","shaggyMullet","dreads01","dreads02","straight01","straight02","straightAndStrand","bob","bun","longButNotTooLong","curly","curvy","fro","froBand","bigHair","dreads","miaWallace","shavedSides","frida","hat","winterHat1","winterHat02","winterHat03","winterHat04","none"]);
const VALID_CLOTH=new Set(["shirtCrewNeck","hoodie","shirtScoopNeck","shirtVNeck","collarAndSweater","graphicShirt","overall","blazerAndShirt","blazerAndSweater"]);
const VALID_EYES=new Set(["default","happy","surprised","squint","wink","side","eyeRoll","xDizzy","cry","hearts","winkWacky","closed"]);
const VALID_BROWS=new Set(["default","defaultNatural","raisedExcited","raisedExcitedNatural","angry","angryNatural","sadConcerned","sadConcernedNatural","upDown","upDownNatural","unibrowNatural","flatNatural","frownNatural"]);
const VALID_MOUTH=new Set(["smile","default","serious","tongue","twinkle","screamOpen","grimace","sad","disbelief","vomit","eating","concerned"]);
const VALID_ACC=new Set(["none","prescription01","prescription02","round","sunglasses","kurt","eyepatch","wayfarers"]);
const VALID_FH=new Set(["none","moustacheFancy","moustacheMagnum","beardLight","beardMedium","beardMajestic"]);
const VALID_FRAMES=new Set(Object.keys(FRAME_CFG));
const VALID_NOSE=new Set(Object.keys(CHEEK_MAP));
const VALID_STICKER=new Set(Object.keys(STICKER_CFG));

function sanitize(cfg:AvatarConfig):AvatarConfig{
  const d=DEFAULT_AVATAR;
  return{
    skinColor:   HEX6.test(cfg.skinColor)       ?cfg.skinColor   :d.skinColor,
    top:         VALID_TOP.has(cfg.top)          ?cfg.top         :d.top,
    hairColor:   HEX6.test(cfg.hairColor)        ?cfg.hairColor   :d.hairColor,
    accessories: VALID_ACC.has(cfg.accessories)  ?cfg.accessories :d.accessories,
    facialHair:  VALID_FH.has(cfg.facialHair)    ?cfg.facialHair  :d.facialHair,
    clothing:    VALID_CLOTH.has(cfg.clothing)   ?cfg.clothing    :d.clothing,
    clothesColor:HEX6.test(cfg.clothesColor)     ?cfg.clothesColor:d.clothesColor,
    eyes:        VALID_EYES.has(cfg.eyes)        ?cfg.eyes        :d.eyes,
    eyebrows:    VALID_BROWS.has(cfg.eyebrows)   ?cfg.eyebrows    :d.eyebrows,
    mouth:       VALID_MOUTH.has(cfg.mouth)      ?cfg.mouth       :d.mouth,
    bgColor:     cfg.bgColor||d.bgColor,
    bgType:      (cfg.bgType==="gradientLinear"||cfg.bgType==="solid")?cfg.bgType:d.bgType,
    frame:       VALID_FRAMES.has(cfg.frame)     ?cfg.frame       :d.frame,
    nose:        VALID_NOSE.has(cfg.nose)        ?cfg.nose        :d.nose,
    sticker:     VALID_STICKER.has(cfg.sticker)  ?cfg.sticker     :d.sticker,
  };
}

// ---------------------------------------------------------------------------
// DICEBEAR URL
// ---------------------------------------------------------------------------
export function buildDiceBearUrl(cfg:AvatarConfig,size=256):string{
  const s=sanitize(cfg);const p:string[]=[];
  const a=(k:string,v:string|number)=>p.push(`${k}=${encodeURIComponent(String(v))}`);
  const raw=(k:string,v:string)=>p.push(`${k}=${v}`);
  a("skinColor",s.skinColor);
  if(s.top==="none"){a("topProbability",0);}
  else{a("top",s.top);a("topProbability",100);a("hairColor",s.hairColor);}
  if(s.accessories==="none"){a("accessoriesProbability",0);}
  else{a("accessories",s.accessories);a("accessoriesProbability",100);}
  if(s.facialHair==="none"){a("facialHairProbability",0);}
  else{a("facialHair",s.facialHair);a("facialHairProbability",100);}
  a("clothing",s.clothing);a("clothesColor",s.clothesColor);
  a("eyes",s.eyes);a("eyebrows",s.eyebrows);a("mouth",s.mouth);
  if(s.bgType==="gradientLinear"){raw("backgroundColor",s.bgColor);a("backgroundType","gradientLinear");}
  else{a("backgroundColor",s.bgColor);a("backgroundType","solid");}
  a("size",size);
  return `https://api.dicebear.com/9.x/avataaars/svg?${p.join("&")}`;
}

// ---------------------------------------------------------------------------
// ITEM TYPES
// ---------------------------------------------------------------------------
export type Category="skinColor"|"top"|"hairColor"|"clothing"|"clothesColor"|"eyes"|"eyebrows"|"nose"|"mouth"|"accessories"|"facialHair"|"bg"|"sticker";
export type Rarity="gratuit"|"commun"|"rare"|"epique"|"legendaire"|"prestige";
export type ShopItem={
  id:string;category:Category;name:string;price:number;rarity:Rarity;
  previewColor?:string;previewEmoji?:string;stickerIcon?:string;
  seasonal?:boolean;minPrestige?:number;
};

function applyItem(cfg:AvatarConfig,item:ShopItem):AvatarConfig{
  if(item.category==="bg"){const[c,t]=item.id.split("|");return{...cfg,bgColor:c,bgType:t};}
  return{...cfg,[item.category]:item.id};
}

const MINI_CATS=new Set<Category>(["eyes","eyebrows","mouth"]);
const BASE_MINI:AvatarConfig={skinColor:"edb98a",top:"shortFlat",hairColor:"724133",accessories:"none",facialHair:"none",clothing:"shirtCrewNeck",clothesColor:"5199e4",eyes:"default",eyebrows:"defaultNatural",mouth:"smile",bgColor:"e0f2fe",bgType:"solid",frame:"none",nose:"none",sticker:"none"};

// ---------------------------------------------------------------------------
// AVATAR SVG
// ---------------------------------------------------------------------------
export function AvatarSVG({config,size=200}:{config:AvatarConfig;size?:number}){
  const[loaded,setLoaded]=useState(false);
  const[errored,setErrored]=useState(false);
  const url=buildDiceBearUrl(config,Math.round(size*2));
  const fc=FRAME_CFG[config.frame||"none"]||FRAME_CFG.none;
  const cheek=CHEEK_MAP[config.nose||"none"]||{};
  const stk=STICKER_CFG[config.sticker||"none"];
  const bgKey=(config.bgColor||"").split(",")[0].toLowerCase();
  const particles=BG_PARTICLES[bgKey]||null;
  const PAD=4,FULL=size+PAD*2;
  const cW=size*0.20,cH=size*0.11,cT=size*0.61,cX=size*0.10;
  const tFz=Math.max(7,size*0.10),pSz=Math.max(10,size*0.14);
  const sPx=stk?Math.round(size*stk.sz):0;
  return(
    <div style={{position:"relative",width:FULL,height:FULL,display:"inline-flex",flexShrink:0,borderRadius:size*0.10,overflow:"hidden"}}>
      <div style={{position:"absolute",width:FULL*2,height:FULL*2,top:-FULL/2,left:-FULL/2,background:`conic-gradient(from 0deg,${fc.conic})`,animation:`frameRotate ${fc.speed} linear infinite`,boxShadow:fc.glow||"none"}}/>
      <div style={{position:"absolute",inset:PAD,borderRadius:size*0.08,overflow:"hidden",background:"linear-gradient(135deg,#e0f2fe,#ddd6fe)",display:"flex",alignItems:"center",justifyContent:"center"}}>
        {particles&&particles.map((ic,i)=>(
          <div key={i} style={{position:"absolute",top:PPOS[i].top,left:PPOS[i].left,right:(PPOS[i] as {right?:string}).right,width:pSz,height:pSz,zIndex:0,pointerEvents:"none",animation:`particleFloat ${2+i*0.5}s ease-in-out ${i*0.3}s infinite alternate`}}>
            <Icon icon={ic} width={pSz} height={pSz}/>
          </div>
        ))}
        {(!loaded&&!errored)&&<div style={{fontSize:size>80?"2rem":"1.3rem"}}>{"🧑"}</div>}
        {errored&&<div style={{fontSize:size>80?"2rem":"1.3rem"}}>{"🧑"}</div>}
        <img src={url} width={size} height={size} alt="Avatar" draggable={false}
          onLoad={()=>{setLoaded(true);setErrored(false);}}
          onError={()=>{setErrored(true);setLoaded(false);}}
          style={{display:loaded?"block":"none",position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",zIndex:1}}/>
        {loaded&&cheek.leftBg&&<>
          <div style={{position:"absolute",left:cX,top:cT,width:cW,height:cH,background:cheek.leftBg,borderRadius:"50%",filter:"blur(5px)",pointerEvents:"none",transform:"rotate(-10deg)",zIndex:2}}/>
          <div style={{position:"absolute",right:cX,top:cT,width:cW,height:cH,background:cheek.rightBg,borderRadius:"50%",filter:"blur(5px)",pointerEvents:"none",transform:"rotate(10deg)",zIndex:2}}/>
        </>}
        {loaded&&cheek.text&&<div style={{position:"absolute",left:"50%",top:cheek.textTop||"56%",transform:"translate(-50%,-50%)",fontSize:tFz,lineHeight:1,pointerEvents:"none",userSelect:"none",zIndex:2,filter:"drop-shadow(0 1px 2px rgba(0,0,0,0.3))"}}>{cheek.text}</div>}
        {loaded&&stk&&<div style={{position:"absolute",top:stk.top,left:stk.left,width:sPx,height:sPx,zIndex:3,pointerEvents:"none",transform:`rotate(${stk.rotation||"0deg"})`,filter:"drop-shadow(0 2px 5px rgba(0,0,0,0.45))",animation:"stickerBounce 3s ease-in-out infinite"}}>
          <Icon icon={stk.icon} width={sPx} height={sPx} color={stk.color||undefined}/>
        </div>}
      </div>
    </div>
  );
}

function MiniPreview({item}:{item:ShopItem}){
  const url=buildDiceBearUrl(applyItem(BASE_MINI,item),80);
  return <img src={url} alt="" loading="lazy" style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:"6px",display:"block"}}/>;
}

// ---------------------------------------------------------------------------
// CSS
// ---------------------------------------------------------------------------
const AV_CSS=`
@keyframes avIn       {from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
@keyframes avSpin     {to{transform:rotate(360deg)}}
@keyframes avToast    {0%{opacity:0;transform:translateX(10px)}10%{opacity:1;transform:none}85%{opacity:1}100%{opacity:0}}
@keyframes frameRotate{to{transform:rotate(1turn)}}
@keyframes chestShake {0%,100%{transform:rotate(0)}20%{transform:rotate(-8deg)}40%{transform:rotate(8deg)}60%{transform:rotate(-5deg)}80%{transform:rotate(5deg)}}
@keyframes chestReveal{from{opacity:0;transform:scale(0.5) rotate(-10deg)}to{opacity:1;transform:scale(1) rotate(0)}}
@keyframes particleFloat{from{transform:translateY(0) scale(1)}to{transform:translateY(-7px) scale(1.18)}}
@keyframes stickerBounce{0%,100%{transform:rotate(var(--r,0deg)) scale(1)}50%{transform:rotate(var(--r,0deg)) scale(1.12)}}
@keyframes slideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}
.av-item{transition:transform .12s,box-shadow .12s;cursor:pointer;-webkit-tap-highlight-color:transparent}
.av-item:hover{transform:scale(1.04)}
.av-item:active{transform:scale(0.96)}
.av-tab{transition:all .15s;-webkit-tap-highlight-color:transparent}
.av-preset{transition:all .12s;cursor:pointer;-webkit-tap-highlight-color:transparent}
.av-preset:hover{transform:scale(1.05);filter:brightness(1.1)}
.av-preset:active{transform:scale(0.96)}
.no-sb{scrollbar-width:none}
.no-sb::-webkit-scrollbar{display:none}
`;

const RS:Record<Rarity,{text:string;border:string;bg:string;label:string}>={
  gratuit:  {text:"#64748b",border:"rgba(100,116,139,0.2)", bg:"rgba(100,116,139,0.06)",label:"Gratuit"},
  commun:   {text:"#4ade80",border:"rgba(34,197,94,0.22)",  bg:"rgba(34,197,94,0.07)",  label:"Commun"},
  rare:     {text:"#60a5fa",border:"rgba(59,130,246,0.22)", bg:"rgba(59,130,246,0.07)", label:"Rare"},
  epique:   {text:"#c084fc",border:"rgba(168,85,247,0.25)", bg:"rgba(168,85,247,0.08)", label:"Épique"},
  legendaire:{text:"#fbbf24",border:"rgba(251,191,36,0.3)", bg:"rgba(251,191,36,0.08)", label:"Légendaire"},
  prestige: {text:"#ffd700",border:"rgba(255,215,0,0.35)",  bg:"rgba(255,215,0,0.10)",  label:"Prestige 👑"},
};

type CatMeta={label:string;icon:string};
const CAT_META:Record<Category,CatMeta>={
  skinColor:   {label:"Peau",     icon:"solar:user-bold-duotone"},
  top:         {label:"Coiffure", icon:"solar:scissor-bold-duotone"},
  hairColor:   {label:"Cheveux",  icon:"solar:palette-bold-duotone"},
  clothing:    {label:"Tenue",    icon:"solar:t-shirt-bold-duotone"},
  clothesColor:{label:"Couleur",  icon:"solar:droplet-bold-duotone"},
  eyes:        {label:"Yeux",     icon:"solar:eye-bold-duotone"},
  eyebrows:    {label:"Sourcils", icon:"solar:pen-bold-duotone"},
  nose:        {label:"Joues",    icon:"solar:heart-bold-duotone"},
  mouth:       {label:"Bouche",   icon:"solar:face-scan-circle-bold-duotone"},
  accessories: {label:"Lunettes", icon:"solar:sun-glasses-bold-duotone"},
  facialHair:  {label:"Barbe",    icon:"solar:user-bold-duotone"},
  bg:          {label:"Fond",     icon:"solar:gallery-bold-duotone"},
  sticker:     {label:"Stickers", icon:"solar:sticker-smile-circle-bold-duotone"},
};
const CAT_ORDER:Category[]=["skinColor","top","hairColor","clothing","clothesColor","eyes","eyebrows","nose","mouth","accessories","facialHair","bg","sticker"];

// ---------------------------------------------------------------------------
// PRESETS
// ---------------------------------------------------------------------------
type Preset={emoji:string;name:string;tag?:string;cfg:AvatarConfig};
const PRESETS:Preset[]=[
  {emoji:"🌸",name:"Féminin",   cfg:{skinColor:"edb98a",top:"longButNotTooLong",hairColor:"b58143",accessories:"none",       facialHair:"none",      clothing:"shirtScoopNeck",   clothesColor:"ff488e",eyes:"happy",   eyebrows:"raisedExcitedNatural",mouth:"smile",   bgColor:"ffd5dc",bgType:"solid",        frame:"none",  nose:"blushRose",   sticker:"none"}},
  {emoji:"💪",name:"Masculin",       cfg:{skinColor:"d08b5b",top:"shortFlat",        hairColor:"2c1b18",accessories:"none",       facialHair:"none",      clothing:"shirtVNeck",        clothesColor:"25557c",eyes:"default", eyebrows:"default",             mouth:"serious", bgColor:"b1e2ff",bgType:"solid",        frame:"none",  nose:"none",        sticker:"none"}},
  {emoji:"🦋",name:"Y2K",tag:"📅",cfg:{skinColor:"edb98a",top:"bun",         hairColor:"f59797",accessories:"prescription01",facialHair:"none",    clothing:"blazerAndSweater",  clothesColor:"ffafb9",eyes:"wink",    eyebrows:"raisedExcited",       mouth:"smile",   bgColor:"c0aede",bgType:"solid",        frame:"neon",  nose:"blushRose",   sticker:"butterfly"}},
  {emoji:"🍏",name:"Brat",tag:"🔥",cfg:{skinColor:"ffdbb4",top:"straightAndStrand",hairColor:"2c1b18",accessories:"none",  facialHair:"none",      clothing:"graphicShirt",      clothesColor:"8cc63f",eyes:"squint",  eyebrows:"angry",               mouth:"grimace", bgColor:"8cc63f",bgType:"solid",        frame:"brat",  nose:"none",        sticker:"lightning"}},
  {emoji:"🌿",name:"Clean Girl",     cfg:{skinColor:"edb98a",top:"bun",              hairColor:"b58143",accessories:"none",       facialHair:"none",      clothing:"collarAndSweater",  clothesColor:"e6e6e6",eyes:"default", eyebrows:"defaultNatural",      mouth:"smile",   bgColor:"f8fafc",bgType:"solid",        frame:"none",  nose:"blushPeach",  sticker:"none"}},
  {emoji:"📚",name:"Dark Academia", cfg:{skinColor:"ae5d29",top:"straight01",       hairColor:"4a312c",accessories:"prescription01",facialHair:"none",   clothing:"blazerAndSweater",  clothesColor:"3c4f5c",eyes:"default", eyebrows:"angryNatural",        mouth:"serious", bgColor:"0f172a",bgType:"solid",        frame:"galaxy",nose:"none",        sticker:"diploma"}},
  {emoji:"🤖",name:"Cyber",tag:"💥",cfg:{skinColor:"ffdbb4",top:"shortCurly",hairColor:"f59797",accessories:"prescription02",facialHair:"none",  clothing:"graphicShirt",      clothesColor:"65c9ff",eyes:"winkWacky",eyebrows:"raisedExcited",      mouth:"twinkle", bgColor:"1e1b4b",bgType:"solid",        frame:"neon",  nose:"sparkle",     sticker:"controller"}},
  {emoji:"🎸",name:"Rock",           cfg:{skinColor:"ffdbb4",top:"shaggyMullet",    hairColor:"2c1b18",accessories:"sunglasses",   facialHair:"beardLight",clothing:"graphicShirt",     clothesColor:"262e33",eyes:"squint",  eyebrows:"angry",               mouth:"grimace", bgColor:"1e1b4b",bgType:"solid",        frame:"fire",  nose:"none",        sticker:"micro"}},
  {emoji:"🌊",name:"Surf",           cfg:{skinColor:"fd9841",top:"dreads01",         hairColor:"d6b370",accessories:"sunglasses",   facialHair:"none",      clothing:"hoodie",            clothesColor:"65c9ff",eyes:"squint",  eyebrows:"raisedExcited",       mouth:"twinkle", bgColor:"3b82f6,22d3ee",bgType:"gradientLinear",frame:"ice",nose:"blushPeach",sticker:"none"}},
  {emoji:"✨",   name:"Glam",           cfg:{skinColor:"edb98a",top:"curly",            hairColor:"f59797",accessories:"wayfarers",    facialHair:"none",      clothing:"blazerAndSweater",  clothesColor:"ff488e",eyes:"wink",    eyebrows:"raisedExcited",       mouth:"smile",   bgColor:"a78bfa,ec4899",bgType:"gradientLinear",frame:"rainbow",nose:"blushRose",sticker:"crown"}},
  {emoji:"🌸",name:"Printemps",tag:"🍀",cfg:{skinColor:"edb98a",top:"frida",  hairColor:"a55728",accessories:"none",        facialHair:"none",      clothing:"shirtScoopNeck",    clothesColor:"a7ffc4",eyes:"happy",   eyebrows:"raisedExcitedNatural",mouth:"twinkle", bgColor:"56ab2f,f093fb",bgType:"gradientLinear",frame:"spring",nose:"blushRose",sticker:"sakura"}},
  {emoji:"🧑",name:"Afro King",      cfg:{skinColor:"614335",top:"fro",              hairColor:"2c1b18",accessories:"wayfarers",    facialHair:"beardMedium",clothing:"blazerAndShirt",  clothesColor:"f7971e",eyes:"default", eyebrows:"raisedExcited",       mouth:"smile",   bgColor:"fbbf24,f97316",bgType:"gradientLinear",frame:"gold",nose:"none",       sticker:"medal"}},
];

const SPRING_PRESETS:Preset[]=[
  {emoji:"🌸",name:"Sakura",          cfg:{skinColor:"edb98a",top:"froBand",hairColor:"a55728",accessories:"none",facialHair:"none",clothing:"shirtScoopNeck",  clothesColor:"ffafb9",eyes:"happy",  eyebrows:"raisedExcitedNatural",mouth:"smile",  bgColor:"56ab2f,f093fb",bgType:"gradientLinear",frame:"spring",nose:"blushRose", sticker:"sakura"}},
  {emoji:"🌷",name:"Champ de fleurs", cfg:{skinColor:"fd9841",top:"frida",   hairColor:"b58143",accessories:"none",facialHair:"none",clothing:"shirtScoopNeck",  clothesColor:"a7ffc4",eyes:"happy",  eyebrows:"defaultNatural",      mouth:"twinkle",bgColor:"a8e063,f7971e",bgType:"gradientLinear",frame:"spring",nose:"blushPeach",sticker:"sunflower"}},
  {emoji:"🌿",name:"Herbe fraîche",cfg:{skinColor:"d08b5b",top:"curly",hairColor:"4a312c",accessories:"none",facialHair:"none",clothing:"hoodie",           clothesColor:"bbf7d0",eyes:"default",eyebrows:"defaultNatural",     mouth:"smile",  bgColor:"d4fc79,96e6a1",bgType:"gradientLinear",frame:"spring",nose:"blushPeach",sticker:"leaf"}},
];

// ---------------------------------------------------------------------------
// MYSTERY CHESTS
// ---------------------------------------------------------------------------
const CHESTS=[
  {id:"common",   emoji:"📦",name:"Coffre Commun",       price:50, color:"#4ade80",weights:{gratuit:5,commun:55,rare:35,epique:5,legendaire:0,prestige:0}},
  {id:"epic",     emoji:"🟪",name:"Coffre Épique",   price:150,color:"#c084fc",weights:{gratuit:0,commun:20,rare:40,epique:35,legendaire:5,prestige:0}},
  {id:"legendary",emoji:"🥇",name:"Coffre Légendaire",price:300,color:"#fbbf24",weights:{gratuit:0,commun:0,rare:20,epique:60,legendaire:18,prestige:2}},
];
function pickRandom(weights:Record<Rarity,number>,owned:string[],profil:UserProfile):ShopItem|null{
  const pool=ALL_ITEMS.filter(i=>{
    if(i.seasonal)return false;
    if(i.minPrestige&&(profil.prestige||0)<i.minPrestige)return false;
    if(owned.includes(`${i.category}::${i.id}`))return false;
    return(weights[i.rarity]||0)>0;
  });
  if(!pool.length)return null;
  const w=pool.flatMap(it=>Array(weights[it.rarity]).fill(it));
  return w[Math.floor(Math.random()*w.length)] as ShopItem;
}

// ---------------------------------------------------------------------------
// CATALOG
// ---------------------------------------------------------------------------
export const ALL_ITEMS:ShopItem[]=[
  // PEAU
  {id:"614335",category:"skinColor",name:"Ébène",          price:0, rarity:"gratuit",previewColor:"#614335"},
  {id:"ae5d29",category:"skinColor",name:"Brun foncé",           price:0, rarity:"gratuit",previewColor:"#ae5d29"},
  {id:"d08b5b",category:"skinColor",name:"Brun",                      price:0, rarity:"gratuit",previewColor:"#d08b5b"},
  {id:"edb98a",category:"skinColor",name:"Beige",                     price:0, rarity:"gratuit",previewColor:"#edb98a"},
  {id:"f8d25c",category:"skinColor",name:"Doré",                 price:0, rarity:"gratuit",previewColor:"#f8d25c"},
  {id:"fd9841",category:"skinColor",name:"Halé",                 price:0, rarity:"gratuit",previewColor:"#fd9841"},
  {id:"ffdbb4",category:"skinColor",name:"Clair",                     price:0, rarity:"gratuit",previewColor:"#ffdbb4"},
  // COIFFURES (laicite : hijab et turban retires)
  {id:"shortFlat",           category:"top",name:"Court plat",          price:0, rarity:"gratuit",previewEmoji:"✂️"},
  {id:"shortRound",          category:"top",name:"Court arrondi",        price:0, rarity:"gratuit",previewEmoji:"👦"},
  {id:"shortCurly",          category:"top",name:"Bouclé court",    price:0, rarity:"gratuit",previewEmoji:"🌟"},
  {id:"sides",               category:"top",name:"Côtés",     price:0, rarity:"gratuit",previewEmoji:"🧑"},
  {id:"none",                category:"top",name:"Chauve",               price:0, rarity:"gratuit",previewEmoji:"🥚"},
  {id:"longButNotTooLong",   category:"top",name:"Mi-long",              price:0, rarity:"gratuit",previewEmoji:"👧"},
  {id:"straight01",          category:"top",name:"Long lisse",           price:0, rarity:"gratuit",previewEmoji:"🧏"},
  {id:"bob",                 category:"top",name:"Bob trendy",           price:10,rarity:"commun", previewEmoji:"👩"},
  {id:"bun",                 category:"top",name:"Bun élégant",price:12,rarity:"commun", previewEmoji:"💁"},
  {id:"shortWaved",          category:"top",name:"Wavy court",           price:10,rarity:"commun", previewEmoji:"💫"},
  {id:"straightAndStrand",   category:"top",name:"Long + mèche",   price:15,rarity:"commun", previewEmoji:"👩"},
  {id:"straight02",          category:"top",name:"Long structuré",  price:10,rarity:"commun", previewEmoji:"🧖"},
  {id:"theCaesar",           category:"top",name:"César cut",       price:15,rarity:"commun", previewEmoji:"🏛️"},
  {id:"theCaesarAndSidePart",category:"top",name:"César + raie",   price:18,rarity:"commun", previewEmoji:"🏛️"},
  {id:"frizzle",             category:"top",name:"Frisé texturé",price:15,rarity:"commun",previewEmoji:"⚡"},
  {id:"shaggy",              category:"top",name:"Shaggy 70s",           price:15,rarity:"commun", previewEmoji:"🎸"},
  {id:"hat",                 category:"top",name:"Bucket hat",           price:15,rarity:"commun", previewEmoji:"🎩"},
  {id:"winterHat1",          category:"top",name:"Bonnet",               price:12,rarity:"commun", previewEmoji:"🧣"},
  {id:"winterHat02",         category:"top",name:"Bonnet pompom",        price:18,rarity:"rare",   previewEmoji:"❄️"},
  {id:"winterHat03",         category:"top",name:"Beanie skate",         price:18,rarity:"rare",   previewEmoji:"❄️"},
  {id:"shaggyMullet",        category:"top",name:"Mulet Y2K",            price:20,rarity:"rare",   previewEmoji:"🤘"},
  {id:"dreads01",            category:"top",name:"Dreads courts",         price:25,rarity:"rare",   previewEmoji:"🎵"},
  {id:"dreads02",            category:"top",name:"Dreads torsadés", price:25,rarity:"rare",   previewEmoji:"🎶"},
  {id:"curly",               category:"top",name:"Curly fro",             price:25,rarity:"rare",   previewEmoji:"🌿"},
  {id:"curvy",               category:"top",name:"Ondulé beach",    price:22,rarity:"rare",   previewEmoji:"🌊"},
  {id:"fro",                 category:"top",name:"Afro naturel",          price:20,rarity:"rare",   previewEmoji:"💥"},
  {id:"froBand",             category:"top",name:"Afro + bandeau",        price:30,rarity:"epique", previewEmoji:"🌞"},
  {id:"bigHair",             category:"top",name:"Big Volume",            price:30,rarity:"epique", previewEmoji:"💥"},
  {id:"dreads",              category:"top",name:"Dreads longs",          price:30,rarity:"epique", previewEmoji:"🦁"},
  {id:"miaWallace",          category:"top",name:"Mia Wallace",           price:38,rarity:"epique", previewEmoji:"🎬"},
  {id:"shavedSides",         category:"top",name:"Undercut",              price:32,rarity:"epique", previewEmoji:"🗡️"},
  {id:"frida",               category:"top",name:"Couronne de fleurs",    price:20,rarity:"rare",   previewEmoji:"🌸"},
  // CHEVEUX
  {id:"2c1b18",category:"hairColor",name:"Noir profond",    price:0, rarity:"gratuit",    previewColor:"#2c1b18"},
  {id:"4a312c",category:"hairColor",name:"Brun foncé", price:0, rarity:"gratuit",    previewColor:"#4a312c"},
  {id:"724133",category:"hairColor",name:"Brun naturel",    price:0, rarity:"gratuit",    previewColor:"#724133"},
  {id:"a55728",category:"hairColor",name:"Auburn",          price:8, rarity:"commun",     previewColor:"#a55728"},
  {id:"b58143",category:"hairColor",name:"Blond sable",     price:8, rarity:"commun",     previewColor:"#b58143"},
  {id:"d6b370",category:"hairColor",name:"Blond platin",    price:12,rarity:"commun",     previewColor:"#d6b370"},
  {id:"c93305",category:"hairColor",name:"Roux feu",        price:12,rarity:"rare",       previewColor:"#c93305"},
  {id:"f59797",category:"hairColor",name:"Rose Y2K",        price:18,rarity:"rare",       previewColor:"#f59797"},
  {id:"ecdcbf",category:"hairColor",name:"Platine glam",    price:22,rarity:"epique",     previewColor:"#ecdcbf"},
  {id:"e8e1e1",category:"hairColor",name:"Gris acier",      price:28,rarity:"legendaire", previewColor:"#e8e1e1"},
  // TENUES
  {id:"shirtCrewNeck",   category:"clothing",name:"T-shirt basic",       price:0, rarity:"gratuit",previewEmoji:"👕"},
  {id:"hoodie",          category:"clothing",name:"Hoodie oversized",    price:0, rarity:"gratuit",previewEmoji:"🧥"},
  {id:"shirtScoopNeck",  category:"clothing",name:"Décolleté", price:0, rarity:"gratuit",previewEmoji:"👗"},
  {id:"shirtVNeck",      category:"clothing",name:"Col V slim",          price:12,rarity:"commun", previewEmoji:"👔"},
  {id:"collarAndSweater",category:"clothing",name:"Pull Preppy",         price:18,rarity:"commun", previewEmoji:"🧶"},
  {id:"graphicShirt",    category:"clothing",name:"T-shirt graphique",   price:22,rarity:"commun", previewEmoji:"🎨"},
  {id:"overall",         category:"clothing",name:"Salopette",           price:28,rarity:"rare",   previewEmoji:"👕"},
  {id:"blazerAndShirt",  category:"clothing",name:"Blazer chemise",      price:32,rarity:"epique", previewEmoji:"🕶️"},
  {id:"blazerAndSweater",category:"clothing",name:"Blazer pull",         price:38,rarity:"epique", previewEmoji:"💼"},
  // COULEURS TENUE
  {id:"3c4f5c",category:"clothesColor",name:"Noir",         price:0, rarity:"gratuit",previewColor:"#3c4f5c"},
  {id:"262e33",category:"clothesColor",name:"Noir mat",     price:0, rarity:"gratuit",previewColor:"#262e33"},
  {id:"929598",category:"clothesColor",name:"Gris",         price:0, rarity:"gratuit",previewColor:"#929598"},
  {id:"ffffff",category:"clothesColor",name:"Blanc",        price:0, rarity:"gratuit",previewColor:"#ffffff"},
  {id:"5199e4",category:"clothesColor",name:"Bleu",         price:5, rarity:"gratuit",previewColor:"#5199e4"},
  {id:"25557c",category:"clothesColor",name:"Marine",       price:5, rarity:"gratuit",previewColor:"#25557c"},
  {id:"65c9ff",category:"clothesColor",name:"Ciel",         price:8, rarity:"commun", previewColor:"#65c9ff"},
  {id:"ff5c5c",category:"clothesColor",name:"Rouge",        price:8, rarity:"commun", previewColor:"#ff5c5c"},
  {id:"ff488e",category:"clothesColor",name:"Rose vif",     price:8, rarity:"commun", previewColor:"#ff488e"},
  {id:"e6e6e6",category:"clothesColor",name:"Chiné",  price:8, rarity:"commun", previewColor:"#e6e6e6"},
  {id:"b1e2ff",category:"clothesColor",name:"Bleu pastel",  price:8, rarity:"commun", previewColor:"#b1e2ff"},
  {id:"a7ffc4",category:"clothesColor",name:"Vert pastel",  price:8, rarity:"commun", previewColor:"#a7ffc4"},
  {id:"ffdeb5",category:"clothesColor",name:"Pêche",  price:8, rarity:"commun", previewColor:"#ffdeb5"},
  {id:"ffafb9",category:"clothesColor",name:"Rose tendre",  price:8, rarity:"commun", previewColor:"#ffafb9"},
  {id:"ffffb1",category:"clothesColor",name:"Jaune doux",   price:8, rarity:"commun", previewColor:"#ffffb1"},
  {id:"8cc63f",category:"clothesColor",name:"Brat green",   price:18,rarity:"rare",   previewColor:"#8cc63f"},
  {id:"bbf7d0",category:"clothesColor",name:"Menthe",       price:8, rarity:"commun", previewColor:"#bbf7d0"},
  {id:"f7971e",category:"clothesColor",name:"Orange",       price:8, rarity:"commun", previewColor:"#f7971e"},
  {id:"c084fc",category:"clothesColor",name:"Violet",       price:12,rarity:"rare",   previewColor:"#c084fc"},
  // YEUX
  {id:"default",  category:"eyes",name:"Naturel",          price:0, rarity:"gratuit"},
  {id:"happy",    category:"eyes",name:"Joyeux",           price:0, rarity:"gratuit"},
  {id:"surprised",category:"eyes",name:"Surpris",          price:8, rarity:"commun"},
  {id:"squint",   category:"eyes",name:"Plissés",     price:10,rarity:"commun"},
  {id:"wink",     category:"eyes",name:"Clin d'œil",  price:12,rarity:"commun"},
  {id:"side",     category:"eyes",name:"De côté",price:8, rarity:"commun"},
  {id:"eyeRoll",  category:"eyes",name:"Levés",       price:12,rarity:"rare"},
  {id:"xDizzy",   category:"eyes",name:"Étourdis",    price:15,rarity:"rare"},
  {id:"cry",      category:"eyes",name:"Larmes",           price:15,rarity:"rare"},
  {id:"hearts",   category:"eyes",name:"Amoureux",         price:20,rarity:"epique"},
  {id:"winkWacky",category:"eyes",name:"Loufoque",         price:20,rarity:"epique"},
  {id:"closed",   category:"eyes",name:"Fermés",      price:12,rarity:"rare"},
  // SOURCILS
  {id:"default",             category:"eyebrows",name:"Naturels",         price:0, rarity:"gratuit"},
  {id:"defaultNatural",      category:"eyebrows",name:"Doux",             price:0, rarity:"gratuit"},
  {id:"raisedExcited",       category:"eyebrows",name:"Levés",       price:8, rarity:"commun"},
  {id:"raisedExcitedNatural",category:"eyebrows",name:"Levés doux",  price:8, rarity:"commun"},
  {id:"angry",               category:"eyebrows",name:"Colère",      price:8, rarity:"commun"},
  {id:"angryNatural",        category:"eyebrows",name:"Colère doux", price:8, rarity:"commun"},
  {id:"sadConcerned",        category:"eyebrows",name:"Inquiet",          price:8, rarity:"commun"},
  {id:"sadConcernedNatural", category:"eyebrows",name:"Inquiet doux",     price:8, rarity:"commun"},
  {id:"upDown",              category:"eyebrows",name:"En vague",         price:12,rarity:"rare"},
  {id:"upDownNatural",       category:"eyebrows",name:"Vague douce",      price:12,rarity:"rare"},
  {id:"unibrowNatural",      category:"eyebrows",name:"Monobrow",         price:18,rarity:"rare"},
  {id:"flatNatural",         category:"eyebrows",name:"Plats",            price:8, rarity:"commun"},
  {id:"frownNatural",        category:"eyebrows",name:"Froncés",     price:12,rarity:"rare"},
  // JOUES
  {id:"none",       category:"nose",name:"Naturel",             price:0, rarity:"gratuit",   previewColor:"transparent"},
  {id:"blushRose",  category:"nose",name:"Joues rosées",   price:0, rarity:"gratuit",   previewColor:"#ff6482"},
  {id:"blushPeach", category:"nose",name:"Joues pêches",   price:0, rarity:"gratuit",   previewColor:"#ffa050"},
  {id:"blushLilac", category:"nose",name:"Joues lilas",         price:8, rarity:"commun",    previewColor:"#b464ff"},
  {id:"blushBlue",  category:"nose",name:"Joues bleues",        price:8, rarity:"commun",    previewColor:"#5096ff"},
  {id:"freckles",   category:"nose",name:"Taches de rousseur",  price:12,rarity:"commun",    previewEmoji:"???"},
  {id:"beautyMark", category:"nose",name:"Beauty mark",         price:15,rarity:"rare",      previewEmoji:"•"},
  {id:"sparkle",    category:"nose",name:"Paillettes",          price:18,rarity:"rare",      previewEmoji:"✨"},
  {id:"star",       category:"nose",name:"Étoile",         price:20,rarity:"rare",      previewEmoji:"⭐"},
  {id:"diamond",    category:"nose",name:"Diamant",             price:30,rarity:"epique",    previewEmoji:"💎"},
  // BOUCHE
  {id:"smile",     category:"mouth",name:"Sourire",         price:0, rarity:"gratuit"},
  {id:"default",   category:"mouth",name:"Neutre",          price:0, rarity:"gratuit"},
  {id:"serious",   category:"mouth",name:"Sérieux",    price:0, rarity:"gratuit"},
  {id:"tongue",    category:"mouth",name:"Langue",          price:8, rarity:"commun"},
  {id:"twinkle",   category:"mouth",name:"Éclatant",   price:12,rarity:"commun"},
  {id:"screamOpen",category:"mouth",name:"Cri",             price:12,rarity:"rare"},
  {id:"grimace",   category:"mouth",name:"Grimace",         price:8, rarity:"commun"},
  {id:"sad",       category:"mouth",name:"Triste",          price:8, rarity:"commun"},
  {id:"disbelief", category:"mouth",name:"Incrédule",  price:8, rarity:"commun"},
  {id:"vomit",     category:"mouth",name:"Malade",          price:20,rarity:"epique"},
  {id:"eating",    category:"mouth",name:"Miam",            price:8, rarity:"commun"},
  {id:"concerned", category:"mouth",name:"Inquiet",         price:8, rarity:"commun"},
  // LUNETTES
  {id:"none",          category:"accessories",name:"Aucune",        price:0, rarity:"gratuit",previewEmoji:"❌"},
  {id:"prescription01",category:"accessories",name:"Rondes",        price:12,rarity:"commun", previewEmoji:"👓"},
  {id:"prescription02",category:"accessories",name:"Rectangle",     price:12,rarity:"commun", previewEmoji:"👓"},
  {id:"round",         category:"accessories",name:"Thin frame",    price:18,rarity:"rare",   previewEmoji:"🧐"},
  {id:"sunglasses",    category:"accessories",name:"Cat eye",       price:22,rarity:"rare",   previewEmoji:"🕶️"},
  {id:"kurt",          category:"accessories",name:"Kurt Cobain",   price:28,rarity:"epique", previewEmoji:"🎸"},
  {id:"eyepatch",      category:"accessories",name:"Patch pirate",  price:30,rarity:"epique", previewEmoji:"🏴"},
  {id:"wayfarers",     category:"accessories",name:"Wayfarers",     price:32,rarity:"epique", previewEmoji:"😎"},
  // PILOSITE
  {id:"none",           category:"facialHair",name:"Aucune",        price:0, rarity:"gratuit",previewEmoji:"❌"},
  {id:"moustacheFancy", category:"facialHair",name:"Moustache",     price:18,rarity:"commun", previewEmoji:"🦸"},
  {id:"moustacheMagnum",category:"facialHair",name:"Magnum",        price:18,rarity:"commun", previewEmoji:"🕵️"},
  {id:"beardLight",     category:"facialHair",name:"Barbe 3 jours", price:22,rarity:"rare",   previewEmoji:"🧔"},
  {id:"beardMedium",    category:"facialHair",name:"Barbe",         price:22,rarity:"rare",   previewEmoji:"🧔"},
  {id:"beardMajestic",  category:"facialHair",name:"Barbe viking",  price:38,rarity:"epique", previewEmoji:"👑"},
  // FONDS
  {id:"f8fafc|solid",                category:"bg",name:"Blanc pur",         price:0, rarity:"gratuit",   previewColor:"#f8fafc"},
  {id:"e0f2fe|solid",                category:"bg",name:"Ciel",              price:0, rarity:"gratuit",   previewColor:"#e0f2fe"},
  {id:"b6e3f4|solid",                category:"bg",name:"Bleu doux",         price:0, rarity:"gratuit",   previewColor:"#b6e3f4"},
  {id:"c0aede|solid",                category:"bg",name:"Lavande",           price:0, rarity:"gratuit",   previewColor:"#c0aede"},
  {id:"ffd5dc|solid",                category:"bg",name:"Rose tendre",       price:0, rarity:"gratuit",   previewColor:"#ffd5dc"},
  {id:"fde68a|solid",                category:"bg",name:"Miel",              price:8, rarity:"commun",    previewColor:"#fde68a"},
  {id:"bbf7d0|solid",                category:"bg",name:"Menthe",            price:8, rarity:"commun",    previewColor:"#bbf7d0"},
  {id:"0f172a|solid",                category:"bg",name:"Nuit noire",        price:18,rarity:"commun",    previewColor:"#0f172a"},
  {id:"1e1b4b|solid",                category:"bg",name:"Violet nuit",       price:22,rarity:"commun",    previewColor:"#1e1b4b"},
  {id:"4f46e5|solid",                category:"bg",name:"Indigo",            price:28,rarity:"rare",      previewColor:"#4f46e5"},
  {id:"ec4899|solid",                category:"bg",name:"Rose choc",         price:28,rarity:"rare",      previewColor:"#ec4899"},
  {id:"8cc63f|solid",                category:"bg",name:"Brat green",        price:20,rarity:"rare",      previewColor:"#8cc63f"},
  {id:"f43f5e,f97316|gradientLinear",category:"bg",name:"Coucher soleil",    price:30,rarity:"epique",    previewColor:"#f97316"},
  {id:"3b82f6,22d3ee|gradientLinear",category:"bg",name:"Ocean",             price:30,rarity:"epique",    previewColor:"#3b82f6"},
  {id:"a78bfa,ec4899|gradientLinear",category:"bg",name:"Aurore",            price:35,rarity:"epique",    previewColor:"#a78bfa"},
  {id:"fbbf24,f97316|gradientLinear",category:"bg",name:"Golden hour",       price:50,rarity:"legendaire",previewColor:"#fbbf24"},
  {id:"56ab2f,f093fb|gradientLinear",category:"bg",name:"Sakura",            price:0, rarity:"gratuit",   previewColor:"#f093fb",seasonal:true},
  {id:"a8e063,f7971e|gradientLinear",category:"bg",name:"Champ de fleurs",   price:0, rarity:"commun",    previewColor:"#a8e063",seasonal:true},
  {id:"d4fc79,96e6a1|gradientLinear",category:"bg",name:"Herbe fraîche",price:0,rarity:"commun",    previewColor:"#d4fc79",seasonal:true},
  // STICKERS
  {id:"none",          category:"sticker",name:"Aucun",                price:0, rarity:"gratuit",   stickerIcon:"solar:close-circle-bold"},
  {id:"headphones",    category:"sticker",name:"Casque audio",         price:0, rarity:"gratuit",   stickerIcon:"solar:headphones-round-bold-duotone"},
  {id:"controller",    category:"sticker",name:"Manette de jeu",       price:0, rarity:"gratuit",   stickerIcon:"solar:gamepad-bold-duotone"},
  {id:"micro",         category:"sticker",name:"Micro",                price:0, rarity:"gratuit",   stickerIcon:"solar:microphone-3-bold-duotone"},
  {id:"sakura",        category:"sticker",name:"Sakura",               price:0, rarity:"gratuit",   stickerIcon:"noto:cherry-blossom",seasonal:true},
  {id:"leaf",          category:"sticker",name:"Feuille",              price:0, rarity:"gratuit",   stickerIcon:"noto:leaf-fluttering-in-wind",seasonal:true},
  {id:"crown",         category:"sticker",name:"Couronne",             price:12,rarity:"commun",    stickerIcon:"solar:crown-bold-duotone"},
  {id:"music",         category:"sticker",name:"Notes de musique",     price:8, rarity:"commun",    stickerIcon:"solar:music-notes-bold-duotone"},
  {id:"wifi",          category:"sticker",name:"Wi-Fi",                price:8, rarity:"commun",    stickerIcon:"solar:wi-fi-bold-duotone"},
  {id:"sunglasses",    category:"sticker",name:"Lunettes de soleil",   price:12,rarity:"commun",    stickerIcon:"solar:sun-glasses-bold-duotone"},
  {id:"medal",         category:"sticker",name:"Médaille",        price:15,rarity:"commun",    stickerIcon:"solar:medal-star-bold-duotone"},
  {id:"planet",        category:"sticker",name:"Planète",         price:15,rarity:"commun",    stickerIcon:"solar:planet-bold-duotone"},
  {id:"butterfly",     category:"sticker",name:"Papillon",             price:12,rarity:"commun",    stickerIcon:"noto:butterfly"},
  {id:"sunflower",     category:"sticker",name:"Tournesol",            price:10,rarity:"commun",    stickerIcon:"noto:sunflower"},
  {id:"hibiscus",      category:"sticker",name:"Hibiscus",             price:10,rarity:"commun",    stickerIcon:"noto:hibiscus"},
  {id:"moon",          category:"sticker",name:"Lune",                 price:12,rarity:"commun",    stickerIcon:"noto:crescent-moon"},
  {id:"sparkling_heart",category:"sticker",name:"Cœur",          price:12,rarity:"commun",    stickerIcon:"noto:sparkling-heart"},
  {id:"fire",          category:"sticker",name:"Flammes",              price:15,rarity:"rare",      stickerIcon:"noto:fire"},
  {id:"lightning",     category:"sticker",name:"Éclair",          price:15,rarity:"rare",      stickerIcon:"noto:high-voltage"},
  {id:"rainbow",       category:"sticker",name:"Arc-en-ciel",          price:18,rarity:"rare",      stickerIcon:"noto:rainbow"},
  {id:"shooting_star", category:"sticker",name:"Étoile filante",  price:18,rarity:"rare",      stickerIcon:"noto:shooting-star"},
  {id:"snowflake",     category:"sticker",name:"Flocon",               price:15,rarity:"rare",      stickerIcon:"noto:snowflake"},
  {id:"trophy",        category:"sticker",name:"Trophée",         price:20,rarity:"rare",      stickerIcon:"noto:trophy"},
  {id:"pizza",         category:"sticker",name:"Pizza",                price:12,rarity:"commun",    stickerIcon:"noto:pizza"},
  {id:"ice_cream",     category:"sticker",name:"Glace",                price:10,rarity:"commun",    stickerIcon:"noto:soft-ice-cream"},
  {id:"glowing_star",  category:"sticker",name:"Étoile",          price:15,rarity:"rare",      stickerIcon:"noto:glowing-star"},
  {id:"diploma",       category:"sticker",name:"Diplôme",         price:20,rarity:"rare",      stickerIcon:"solar:diploma-bold-duotone"},
  {id:"gem",           category:"sticker",name:"Diamant",              price:25,rarity:"epique",    stickerIcon:"noto:gem-stone"},
  {id:"halo",          category:"sticker",name:"Auréole",         price:20,rarity:"epique",    stickerIcon:"noto:baby-angel"},
  {id:"cat",           category:"sticker",name:"Chat mignon",          price:20,rarity:"epique",    stickerIcon:"noto:cat-face"},
  {id:"alien",         category:"sticker",name:"Alien",                price:28,rarity:"epique",    stickerIcon:"noto:alien"},
  {id:"robot",         category:"sticker",name:"Robot",                price:25,rarity:"epique",    stickerIcon:"noto:robot"},
  {id:"unicorn",       category:"sticker",name:"Licorne",              price:35,rarity:"legendaire",stickerIcon:"noto:unicorn"},
  {id:"dragon",        category:"sticker",name:"Dragon",               price:40,rarity:"legendaire",stickerIcon:"noto:dragon"},
];

const rand=<T,>(a:T[])=>a[Math.floor(Math.random()*a.length)];
const FREE=(cat:Category)=>ALL_ITEMS.filter(i=>i.category===cat&&i.price===0).map(i=>i.id);

function randomAvatar():AvatarConfig{
  const bgRaw=rand(FREE("bg"));const[bgColor,bgType]=bgRaw.split("|");
  return{skinColor:rand(FREE("skinColor")),top:rand(ALL_ITEMS.filter(i=>i.category==="top").map(i=>i.id)),hairColor:rand(ALL_ITEMS.filter(i=>i.category==="hairColor").map(i=>i.id)),accessories:rand(ALL_ITEMS.filter(i=>i.category==="accessories").map(i=>i.id)),facialHair:rand(ALL_ITEMS.filter(i=>i.category==="facialHair").map(i=>i.id)),clothing:rand(FREE("clothing")),clothesColor:rand(ALL_ITEMS.filter(i=>i.category==="clothesColor").map(i=>i.id)),eyes:rand(ALL_ITEMS.filter(i=>i.category==="eyes").map(i=>i.id)),eyebrows:rand(ALL_ITEMS.filter(i=>i.category==="eyebrows").map(i=>i.id)),mouth:rand(ALL_ITEMS.filter(i=>i.category==="mouth").map(i=>i.id)),bgColor,bgType,frame:"none",nose:rand(FREE("nose")),sticker:rand(FREE("sticker"))};
}

// ---------------------------------------------------------------------------
// MAIN COMPONENT à layout mobile-first avec bottom nav
// ---------------------------------------------------------------------------
type Props={profil:UserProfile;onXPGagne:()=>void};
export default function AvatarCreator({profil,onXPGagne}:Props){
  const[avatar,setAvatar]           =useState<AvatarConfig>(DEFAULT_AVATAR);
  const[hovered,setHovered]         =useState<ShopItem|null>(null);
  const[owned,setOwned]             =useState<string[]>([]);
  const[jetons,setJetons]           =useState<number>(profil.xp||0);
  const[activeTab,setActiveTab]     =useState<Category>("skinColor");
  const[buying,setBuying]           =useState<string|null>(null);
  const[saving,setSaving]           =useState(false);
  const[saved,setSaved]             =useState(false);
  const[toast,setToast]             =useState<{msg:string;ok:boolean}|null>(null);
  const[loading,setLoading]         =useState(true);
  const[previewKey,setPreviewKey]   =useState(0);
  const[showChest,setShowChest]     =useState(false);
  const[openingChest,setOpeningChest]=useState<string|null>(null);
  const[chestResult,setChestResult] =useState<ShopItem|null>(null);
  const[showSpring,setShowSpring]   =useState(true);

  const showToast=(msg:string,ok=true)=>{setToast({msg,ok});setTimeout(()=>setToast(null),2800);};

  useEffect(()=>{
    const uid=auth.currentUser?.uid;
    if(!uid){setLoading(false);return;}
    getDoc(doc(db,"users",uid)).then(snap=>{
      if(!snap.exists()){setLoading(false);return;}
      const d=snap.data();
      if(d.avatar)setAvatar({...DEFAULT_AVATAR,...d.avatar});
      if(d.avatarItems)setOwned(d.avatarItems as string[]);
      if(typeof d.xp==="number")setJetons(d.xp);
      setLoading(false);
    }).catch(()=>setLoading(false));
  },[]);

  const itemKey=(item:ShopItem)=>`${item.category}::${item.id}`;
  const isOwned=useCallback((item:ShopItem)=>item.price===0||owned.includes(itemKey(item)),[owned]);
  const isEquipped=(item:ShopItem)=>{
    if(item.category==="bg"){const[c,t]=item.id.split("|");return avatar.bgColor===c&&avatar.bgType===t;}
    return(avatar as Record<string,string>)[item.category]===item.id;
  };
  const equip=(item:ShopItem)=>{setAvatar(a=>applyItem(a,item));setPreviewKey(k=>k+1);};
  const applyPreset=(p:Preset)=>{setAvatar(p.cfg);setPreviewKey(k=>k+1);};

  const buy=async(item:ShopItem)=>{
    const key=itemKey(item);
    if(isOwned(item)||buying)return;
    if(jetons<item.price){showToast("⚠️ Pas assez de jetons !",false);return;}
    setBuying(key);
    try{
      const uid=auth.currentUser?.uid;if(!uid)throw new Error();
      await runTransaction(db,async tx=>{
        const ref=doc(db,"users",uid);const snap=await tx.get(ref);
        if(!snap.exists())throw new Error();const d=snap.data();
        if((d.xp||0)<item.price)throw new Error("Jetons insuffisants");
        tx.update(ref,{xp:(d.xp||0)-item.price,avatarItems:[...(d.avatarItems||[]),key]});
      });
      setOwned(o=>[...o,key]);setJetons(j=>j-item.price);equip(item);
      showToast(`✨ ${item.name} acheté !`);onXPGagne();
    }catch(e:unknown){showToast((e instanceof Error?e.message:"Erreur"),false);}
    finally{setBuying(null);}
  };

  const openChest=async(chest:typeof CHESTS[0])=>{
    if(jetons<chest.price){showToast("⚠️ Pas assez de jetons !",false);return;}
    if(openingChest)return;
    const item=pickRandom(chest.weights as Record<Rarity,number>,owned,profil);
    if(!item){showToast("Tous les items sont débloqués !",true);return;}
    setOpeningChest(chest.id);
    await new Promise(r=>setTimeout(r,900));
    const key=itemKey(item);
    try{
      const uid=auth.currentUser?.uid;if(!uid)throw new Error();
      await runTransaction(db,async tx=>{
        const ref=doc(db,"users",uid);const snap=await tx.get(ref);
        if(!snap.exists())throw new Error();const d=snap.data();
        if((d.xp||0)<chest.price)throw new Error("Jetons insuffisants");
        tx.update(ref,{xp:(d.xp||0)-chest.price,avatarItems:[...(d.avatarItems||[]),key]});
      });
      setOwned(o=>[...o,key]);setJetons(j=>j-chest.price);
      setChestResult(item);setOpeningChest(null);onXPGagne();
    }catch(e:unknown){showToast((e instanceof Error?e.message:"Erreur"),false);setOpeningChest(null);}
  };

  const saveAvatar=async()=>{
    const uid=auth.currentUser?.uid;if(!uid||saving)return;setSaving(true);
    try{
      await runTransaction(db,async tx=>{tx.update(doc(db,"users",uid),{avatar});});
      setSaved(true);showToast("✅ Avatar sauvegardé !");setTimeout(()=>setSaved(false),3500);
    }catch{showToast("Erreur de sauvegarde",false);}finally{setSaving(false);}
  };

  const displayConfig=hovered?applyItem(avatar,hovered):avatar;
  const tabItems=ALL_ITEMS.filter(i=>i.category===activeTab);
  const totalOwned=ALL_ITEMS.filter(isOwned).length;
  const BOTTOM_H=72;

  if(loading)return(
    <div style={{minHeight:"100vh",background:"#070a12",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <style>{AV_CSS}</style>
      <div style={{width:"40px",height:"40px",border:"3px solid rgba(167,139,250,0.3)",borderTopColor:"#a78bfa",borderRadius:"50%",animation:"avSpin 0.8s linear infinite"}}/>
    </div>
  );

  return(
    <div style={{minHeight:"100vh",background:"#070a12",fontFamily:"system-ui,sans-serif",color:"white"}}>
      <style>{AV_CSS}</style>

      {/* TOAST */}
      {toast&&<div style={{position:"fixed",top:"14px",left:"50%",transform:"translateX(-50%)",zIndex:500,background:toast.ok?"#16a34a":"#dc2626",color:"white",fontWeight:700,fontSize:"0.85rem",padding:"10px 20px",borderRadius:"20px",boxShadow:"0 8px 24px rgba(0,0,0,0.5)",animation:"avToast 2.8s forwards",pointerEvents:"none",whiteSpace:"nowrap"}}>{toast.msg}</div>}

      {/* CHEST RESULT MODAL */}
      {chestResult&&(
        <div style={{position:"fixed",inset:0,zIndex:400,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"center",justifyContent:"center",padding:"20px"}} onClick={()=>setChestResult(null)}>
          <div style={{background:"linear-gradient(135deg,#0f172a,#1e1b4b)",border:`2px solid ${RS[chestResult.rarity].border}`,borderRadius:"28px",padding:"36px 28px",textAlign:"center",maxWidth:"300px",width:"100%",animation:"chestReveal 0.4s cubic-bezier(0.34,1.56,0.64,1) both",boxShadow:`0 0 60px ${RS[chestResult.rarity].border}`}}>
            <div style={{marginBottom:"16px",display:"flex",justifyContent:"center"}}>
              {chestResult.stickerIcon?<Icon icon={chestResult.stickerIcon} width={72} height={72}/>:<span style={{fontSize:"4rem"}}>{chestResult.previewEmoji||"📦"}</span>}
            </div>
            <div style={{fontSize:"0.65rem",color:RS[chestResult.rarity].text,fontWeight:800,textTransform:"uppercase",letterSpacing:"0.15em",marginBottom:"8px"}}>{RS[chestResult.rarity].label}</div>
            <div style={{fontSize:"1.3rem",fontWeight:900,color:"white",marginBottom:"22px"}}>{chestResult.name}</div>
            <button onClick={()=>{equip(chestResult);setChestResult(null);}} style={{width:"100%",padding:"14px",borderRadius:"14px",background:`linear-gradient(135deg,${RS[chestResult.rarity].text},#a78bfa)`,color:"white",fontWeight:800,fontSize:"1rem",border:"none",cursor:"pointer"}}>{"💡 Equiper !"}</button>
            <div style={{marginTop:"12px",fontSize:"0.72rem",color:"#475569"}}>Tap pour fermer</div>
          </div>
        </div>
      )}

      {/* SCROLLABLE CONTENT */}
      <div style={{paddingBottom:BOTTOM_H+8,overflowX:"hidden"}}>

        {/* ?? TOP HEADER */}
        <div style={{background:"rgba(7,10,18,0.96)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(255,255,255,0.07)",padding:"10px 16px",display:"flex",alignItems:"center",gap:"10px",position:"sticky",top:0,zIndex:100}}>
          <div style={{flex:1}}>
            <div style={{fontSize:"0.58rem",color:"#475569",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.12em"}}>{"Créateur d’avatar"}</div>
            <div style={{fontSize:"0.95rem",fontWeight:900,background:"linear-gradient(90deg,#a78bfa,#ec4899)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{"🎨 Mon Avatar"}</div>
          </div>
          <button onClick={()=>setShowChest(v=>!v)} style={{background:"rgba(251,191,36,0.12)",border:"1px solid rgba(251,191,36,0.3)",borderRadius:"10px",padding:"7px 12px",color:"#fbbf24",fontSize:"0.78rem",fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:"5px"}}>
            <span style={{fontSize:"1rem"}}>{"📦"}</span>
          </button>
          <div style={{background:"rgba(251,191,36,0.12)",border:"1px solid rgba(251,191,36,0.3)",borderRadius:"10px",padding:"7px 12px",color:"#fbbf24",fontSize:"0.82rem",fontWeight:800}}>
            {"💰"} {jetons.toLocaleString("fr-FR")}
          </div>
          <button onClick={saveAvatar} disabled={saving} style={{background:saved?"linear-gradient(135deg,#16a34a,#15803d)":"linear-gradient(135deg,#a78bfa,#818cf8)",color:"white",fontWeight:800,fontSize:"0.8rem",padding:"8px 14px",borderRadius:"10px",border:"none",cursor:"pointer",whiteSpace:"nowrap"}}>
            {saving?"⏳":saved?"✅ OK":"💾 Sauver"}
          </button>
        </div>

        {/* ?? COFFRES PANEL */}
        {showChest&&(
          <div style={{background:"linear-gradient(135deg,rgba(251,191,36,0.06),rgba(168,85,247,0.06))",borderBottom:"1px solid rgba(251,191,36,0.15)",padding:"14px 16px",animation:"slideUp 0.2s both"}}>
            <div style={{fontSize:"0.65rem",color:"#fbbf24",fontWeight:800,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:"12px"}}>{"📦 Coffres mystères"}</div>
            <div style={{display:"flex",gap:"10px",overflowX:"auto"}} className="no-sb">
              {CHESTS.map(c=>(
                <button key={c.id} onClick={()=>openChest(c)} disabled={!!openingChest||jetons<c.price}
                  style={{flexShrink:0,background:`${c.color}0f`,border:`1.5px solid ${c.color}55`,borderRadius:"16px",padding:"14px 16px",textAlign:"center",cursor:jetons>=c.price?"pointer":"not-allowed",opacity:jetons<c.price?0.4:1,minWidth:"120px"}}>
                  <div style={{fontSize:"2.2rem",animation:openingChest===c.id?"chestShake 0.8s ease infinite":"none"}}>{c.emoji}</div>
                  <div style={{fontSize:"0.75rem",fontWeight:800,color:"white",margin:"6px 0 4px"}}>{c.name}</div>
                  <div style={{fontSize:"0.72rem",color:c.color,fontWeight:700}}>{c.price} jetons</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ?? SPRING BANNER (collapsible) */}
        {showSpring&&(
          <div style={{background:"linear-gradient(90deg,rgba(86,171,47,0.1),rgba(240,147,251,0.1))",borderBottom:"1px solid rgba(86,171,47,0.18)",padding:"8px 16px",display:"flex",alignItems:"center",gap:"8px"}}>
            <span style={{fontSize:"0.6rem",color:"#a8e063",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",flex:1}}>{"🌸 Collection Printemps 2026"}</span>
            {SPRING_PRESETS.map(p=>(
              <button key={p.name} className="av-preset" onClick={()=>applyPreset(p)} style={{flexShrink:0,background:"rgba(86,171,47,0.1)",border:"1px solid rgba(86,171,47,0.3)",borderRadius:"8px",padding:"5px 10px",cursor:"pointer",color:"white",fontSize:"0.72rem",fontWeight:700,display:"flex",alignItems:"center",gap:"4px"}}>
                <span style={{fontSize:"0.9rem"}}>{p.emoji}</span><span>{p.name}</span>
              </button>
            ))}
            <button onClick={()=>setShowSpring(false)} style={{background:"none",border:"none",color:"#334155",fontSize:"0.9rem",cursor:"pointer",padding:"0 4px",lineHeight:1}}>{"—"}</button>
          </div>
        )}

        {/* ?? AVATAR + PRESETS */}
        <div style={{padding:"16px",background:"linear-gradient(180deg,rgba(167,139,250,0.04),transparent)"}}>
          <div style={{display:"flex",gap:"14px",alignItems:"flex-start"}}>
            {/* Avatar */}
            <div style={{flexShrink:0,display:"flex",flexDirection:"column",alignItems:"center",gap:"6px"}}>
              <AvatarSVG key={`p${previewKey}${JSON.stringify(displayConfig)}`} config={displayConfig} size={140}/>
              {hovered&&<div style={{background:"rgba(167,139,250,0.9)",color:"white",fontSize:"0.6rem",fontWeight:700,padding:"3px 10px",borderRadius:"20px",whiteSpace:"nowrap",textAlign:"center",maxWidth:"148px",overflow:"hidden",textOverflow:"ellipsis"}}>
                {"▶ "}{hovered.name}
              </div>}
              {/* Progress bar */}
              <div style={{width:"148px",display:"flex",alignItems:"center",gap:"6px"}}>
                <div style={{flex:1,height:"3px",background:"rgba(255,255,255,0.07)",borderRadius:"2px",overflow:"hidden"}}>
                  <div style={{height:"100%",background:"linear-gradient(90deg,#a78bfa,#ec4899)",width:`${totalOwned/ALL_ITEMS.length*100}%`,transition:"width 0.5s"}}/>
                </div>
                <span style={{color:"#334155",fontSize:"0.58rem",flexShrink:0}}>{totalOwned}/{ALL_ITEMS.length}</span>
              </div>
            </div>

            {/* Presets + actions */}
            <div style={{flex:1,minWidth:0,display:"flex",flexDirection:"column",gap:"8px"}}>
              <div style={{fontSize:"0.58rem",color:"#475569",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em"}}>Styles rapides</div>
              <div className="no-sb" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"5px"}}>
                {PRESETS.slice(0,8).map(p=>(
                  <button key={p.name} className="av-preset" onClick={()=>applyPreset(p)}
                    style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.09)",borderRadius:"10px",padding:"6px 4px",color:"white",display:"flex",flexDirection:"column",alignItems:"center",gap:"2px",position:"relative"}}>
                    {p.tag&&<span style={{position:"absolute",top:"-4px",right:"-4px",fontSize:"0.5rem",background:"#f59e0b",color:"black",borderRadius:"3px",padding:"1px 3px",fontWeight:900,lineHeight:1}}>{p.tag}</span>}
                    <span style={{fontSize:"1.1rem"}}>{p.emoji}</span>
                    <span style={{fontSize:"0.52rem",color:"#94a3b8",textAlign:"center",lineHeight:1.1}}>{p.name}</span>
                  </button>
                ))}
              </div>
              <div className="no-sb" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"5px"}}>
                {PRESETS.slice(8).map(p=>(
                  <button key={p.name} className="av-preset" onClick={()=>applyPreset(p)}
                    style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.09)",borderRadius:"10px",padding:"6px 4px",color:"white",display:"flex",flexDirection:"column",alignItems:"center",gap:"2px",position:"relative"}}>
                    {p.tag&&<span style={{position:"absolute",top:"-4px",right:"-4px",fontSize:"0.5rem",background:"#f59e0b",color:"black",borderRadius:"3px",padding:"1px 3px",fontWeight:900,lineHeight:1}}>{p.tag}</span>}
                    <span style={{fontSize:"1.1rem"}}>{p.emoji}</span>
                    <span style={{fontSize:"0.52rem",color:"#94a3b8",textAlign:"center",lineHeight:1.1}}>{p.name}</span>
                  </button>
                ))}
                <button onClick={()=>{setAvatar(randomAvatar());setPreviewKey(k=>k+1);}} style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.09)",borderRadius:"10px",padding:"6px 4px",color:"#475569",display:"flex",flexDirection:"column",alignItems:"center",gap:"2px",cursor:"pointer"}}>
                  <span style={{fontSize:"1.1rem"}}>{"🎲"}</span>
                  <span style={{fontSize:"0.52rem",color:"#475569",textAlign:"center",lineHeight:1.1}}>Aléa</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ?? COLOR PICKER pour tenue/fond */}
        {(activeTab==="clothesColor"||activeTab==="bg")&&(
          <div style={{padding:"8px 16px",background:"rgba(255,255,255,0.02)",borderBottom:"1px solid rgba(255,255,255,0.05)",display:"flex",alignItems:"center",gap:"10px"}}>
            <span style={{fontSize:"0.7rem",color:"#64748b",fontWeight:700}}>{"🎨"}</span>
            <input type="color"
              defaultValue={activeTab==="clothesColor"?"#"+avatar.clothesColor:"#"+avatar.bgColor}
              onChange={e=>{const hex=e.target.value.slice(1);
                if(activeTab==="clothesColor")setAvatar(a=>({...a,clothesColor:hex}));
                else setAvatar(a=>({...a,bgColor:hex,bgType:"solid"}));
                setPreviewKey(k=>k+1);}}
              style={{width:"40px",height:"36px",border:"2px solid rgba(255,255,255,0.1)",borderRadius:"8px",cursor:"pointer",padding:0}}/>
            <span style={{fontSize:"0.68rem",color:"#334155"}}>Couleur libre</span>
          </div>
        )}

        {/* ?? ITEMS GRID */}
        <div style={{padding:"8px 12px 16px"}}>
          <div style={{display:"grid",gridTemplateColumns:`repeat(auto-fill,minmax(${MINI_CATS.has(activeTab)||activeTab==="sticker"?"105px":"90px"},1fr))`,gap:"8px"}}>
            {tabItems.map(item=>{
              const own=isOwned(item);const eq=isEquipped(item);
              const rs=RS[item.rarity];const key=itemKey(item);
              const bying=buying===key;const afford=jetons>=item.price;
              const locked=!!item.minPrestige&&(profil.prestige||0)<item.minPrestige;
              const useMini=MINI_CATS.has(item.category);
              const stkDef=item.category==="sticker"?STICKER_CFG[item.id]:null;
              return(
                <div key={key} className="av-item"
                  onMouseEnter={()=>setHovered(item)}
                  onMouseLeave={()=>setHovered(null)}
                  onClick={()=>{if(own&&!locked)equip(item);}}
                  style={{background:eq?"rgba(167,139,250,0.16)":rs.bg,
                    border:`1.5px solid ${eq?"rgba(167,139,250,0.55)":rs.border}`,
                    borderRadius:"14px",padding:"10px 8px 8px",textAlign:"center",
                    cursor:own&&!locked?"pointer":"default",
                    boxShadow:eq?"0 0 16px rgba(167,139,250,0.25)":"none",
                    animation:"avIn 0.18s both",opacity:locked?0.5:1}}>
                  {/* Preview */}
                  <div style={{width:"44px",height:"44px",borderRadius:"10px",margin:"0 auto 7px",overflow:"hidden",
                    background:item.previewColor&&item.previewColor!=="transparent"?item.previewColor:"rgba(255,255,255,0.06)",
                    border:"1px solid rgba(255,255,255,0.1)",
                    display:"flex",alignItems:"center",justifyContent:"center"}}>
                    {locked?<span style={{fontSize:"1.3rem"}}>{"🔒"}</span>
                    :useMini?<MiniPreview item={item}/>
                    :item.stickerIcon?<Icon icon={item.stickerIcon} width={30} height={30} color={stkDef?.color||undefined}/>
                    :item.previewEmoji?<span style={{fontSize:"1.35rem"}}>{item.previewEmoji}</span>
                    :null}
                  </div>
                  <div style={{fontSize:"0.68rem",fontWeight:700,color:"#e2e8f0",marginBottom:"2px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.name}</div>
                  <div style={{fontSize:"0.52rem",fontWeight:700,textTransform:"uppercase",color:rs.text,marginBottom:"6px",letterSpacing:"0.05em"}}>{rs.label}</div>
                  {locked?(
                    <div style={{padding:"4px",borderRadius:"7px",background:"rgba(255,215,0,0.1)",color:"#ffd700",fontSize:"0.6rem",fontWeight:700}}>{`👑${item.minPrestige}`}</div>
                  ):eq?(
                    <div style={{padding:"4px",borderRadius:"7px",background:"rgba(167,139,250,0.2)",color:"#a78bfa",fontSize:"0.62rem",fontWeight:700}}>{"✓ Équipé"}</div>
                  ):own?(
                    <button onClick={e=>{e.stopPropagation();equip(item);}} style={{width:"100%",padding:"5px",borderRadius:"7px",background:"rgba(74,222,128,0.12)",color:"#4ade80",border:"1px solid rgba(74,222,128,0.25)",fontSize:"0.62rem",fontWeight:700,cursor:"pointer"}}>
                      {item.price===0?"🌸 Gratuit":"💡 Équiper"}
                    </button>
                  ):(
                    <button onClick={e=>{e.stopPropagation();buy(item);}} disabled={bying} style={{width:"100%",padding:"5px",borderRadius:"7px",fontSize:"0.62rem",fontWeight:700,cursor:afford?"pointer":"not-allowed",border:"none",background:afford?`${rs.text}28`:"rgba(255,255,255,0.04)",color:afford?rs.text:"#1e293b"}}>
                      {bying?"⏳":`💰 ${item.price}j`}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ?? BOTTOM TAB BAR (fixe, style app mobile) */}
      <div className="no-sb" style={{position:"fixed",bottom:0,left:0,right:0,zIndex:200,background:"rgba(7,10,18,0.97)",backdropFilter:"blur(24px)",borderTop:"1px solid rgba(255,255,255,0.08)",display:"flex",overflowX:"auto",height:BOTTOM_H,padding:"0 4px",alignItems:"center",gap:"2px",boxShadow:"0 -4px 30px rgba(0,0,0,0.5)"}}>
        {CAT_ORDER.map(cat=>{
          const m=CAT_META[cat];const active=activeTab===cat;
          return(
            <button key={cat} className="av-tab" onClick={()=>setActiveTab(cat)}
              style={{flexShrink:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"3px",padding:"6px 10px",minWidth:"52px",height:"56px",borderRadius:"12px",border:"none",cursor:"pointer",
                background:active?"rgba(167,139,250,0.18)":"transparent",
                transition:"all 0.15s"}}>
              <div style={{width:"24px",height:"24px",display:"flex",alignItems:"center",justifyContent:"center"}}>
                <Icon icon={m.icon} width={active?22:18} height={active?22:18}
                  color={active?"#c084fc":"#334155"}/>
              </div>
              <span style={{fontSize:"0.52rem",fontWeight:700,color:active?"#c084fc":"#334155",lineHeight:1,textAlign:"center",letterSpacing:"0.01em"}}>{m.label}</span>
              {active&&<div style={{width:"4px",height:"4px",borderRadius:"50%",background:"#c084fc",position:"absolute",bottom:"6px"}}/>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
