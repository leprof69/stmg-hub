import React, { useState, useEffect, useRef } from "react";
import { auth, db } from "../services/firebase";
import { doc, updateDoc, getDoc, collection, query, where, getDocs, runTransaction, serverTimestamp } from "firebase/firestore";
import { COLLECTIONS } from "../services/collectionsData";
import { formatJetons } from "../lib/jetons";
import { AvatarSVG, DEFAULT_AVATAR } from "./AvatarCreator";
import type { AvatarConfig } from "./AvatarCreator";
import ProfileStudio from "../components/profile/ProfileStudio";
import { sanitizeSalonDeco } from "../lib/profileDecoUtils";
import {
  isBasePackTheme,
  isBasePackPageKey,
  isBasePackSticker,
  clampPageStyleToOwned,
  clampSalonToOwned,
} from "../lib/profileBasePack";
import { decoItemPrice } from "../lib/profileCustomization";
import {
  type PageStyle,
  type SalonConfig,
  DEFAULT_PAGE_STYLE,
  DEFAULT_SALON,
  PAGE_BG,
  SALON_THEMES,
} from "../lib/profileCustomization";
import ProfilPageView from "../components/profile/ProfilPageView";

export type { PageStyle } from "../lib/profileCustomization";
export { DEFAULT_PAGE_STYLE } from "../lib/profileCustomization";


const PROFIL_CSS = `
@keyframes decoFloat0{0%,100%{transform:translateY(0) rotate(-5deg)}50%{transform:translateY(-7px) rotate(5deg)}}
@keyframes decoFloat1{0%,100%{transform:translateY(0) rotate(8deg)}50%{transform:translateY(-9px) rotate(-4deg)}}
@keyframes decoFloat2{0%,100%{transform:translateY(0) rotate(-8deg)}50%{transform:translateY(-6px) rotate(6deg)}}
@keyframes decoFloat3{0%,100%{transform:translateY(0) rotate(5deg)}50%{transform:translateY(-8px) rotate(-7deg)}}
@keyframes salonIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}
@keyframes sheetUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
@keyframes msgIn{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:none}}
@keyframes twinkle{0%,100%{opacity:.15;transform:scale(.7)}45%{opacity:.9;transform:scale(1.3)}55%{opacity:.9;transform:scale(1.3)}}
@keyframes orbitFloat{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(40px,-28px) scale(1.1)}66%{transform:translate(-28px,18px) scale(.9)}}
.deco-chip{transition:all .15s;cursor:pointer;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1.4rem;width:72px;height:72px;border:2px solid transparent;}
.deco-chip:hover{transform:scale(1.18);border-color:rgba(255,255,255,0.3);}
.deco-chip:active{transform:scale(0.92);}
.deco-card{transition:transform .15s,box-shadow .15s;cursor:pointer;border-radius:12px;padding:8px 4px 6px;display:flex;flex-direction:column;align-items:center;gap:4px;position:relative;border:2px solid transparent;}
.deco-card:hover{transform:scale(1.1);}
.deco-card:active{transform:scale(0.92);}
.deco-sel-item{transition:all .12s;cursor:pointer;border-radius:10px;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;}
.deco-sel-item .rm-x{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(239,68,68,0.82);border-radius:9px;opacity:0;transition:opacity .12s;font-size:1.4rem;color:white;font-weight:900;}
.deco-sel-item:hover .rm-x{opacity:1;}
.theme-btn{transition:all .15s;cursor:pointer;border-radius:14px;padding:10px 8px;text-align:center;border:2px solid transparent;}
.theme-btn:hover{transform:scale(1.04);}
.theme-btn:active{transform:scale(0.96);}
.tab-btn{transition:all .15s;cursor:pointer;padding:10px 16px;border:none;font-weight:800;font-size:0.85rem;border-radius:10px;}
`;


// ---------------------------------------------------------------------------
// Existing constants
// ---------------------------------------------------------------------------
const RARETE_CONFIG = {
  commune:     { label:"Commune",     couleur:"#9CA3AF", emoji:"\u26AA" },
  peu_commune: { label:"Peu Commune", couleur:"#10B981", emoji:"\u{1F7E2}" },
  rare:        { label:"Rare",        couleur:"#3B82F6", emoji:"\u{1F535}" },
  epique:      { label:"\u00c9pique", couleur:"#0284C7", emoji:"\u{1F537}" },
  legendaire:  { label:"L\u00e9gendaire",couleur:"#F59E0B",emoji:"\u2B50" },
  ultra_rare:  { label:"Ultra Rare",  couleur:"#EF4444", emoji:"\u{1F48E}" },
};

const CGU_TEXTE = `CONDITIONS GÉNÉRALES D'UTILISATION — STMG HUB
Dernière mise à jour : avril 2025

1. QUI SOMMES-NOUS ?
STMG HUB est une plateforme éducative gamifiée destinée aux élèves de la série STMG. Elle est éditée par Khalifa SOUCI, enseignant en Management.
Contact : lelaboduprof69@gmail.com

2. DONNÉES COLLECTÉES
Dans le cadre de votre inscription, nous collectons :
- Prénom, âge, classe, spécialité, nom du lycée
- Adresse email (via Firebase Authentication)
- Résultats au quiz de personnalité et Triple Totem
- Progression pédagogique (chapitres, jetons, badges, missions)

3. POURQUOI CES DONNÉES ?
Ces données sont utilisées exclusivement pour :
- Personnaliser votre expérience sur la plateforme
- Suivre votre progression pédagogique
- Établir un classement entre élèves du même lycée
- Améliorer les contenus proposés
Vos données ne sont jamais vendues ni transmises à des tiers.

4. DURÉE DE CONSERVATION
Vos données sont conservées pendant toute la durée de votre utilisation. Vous pouvez demander leur suppression à tout moment en contactant : lelaboduprof69@gmail.com

5. VOS DROITS (RGPD)
Conformément au RGPD, vous disposez des droits suivants :
- Droit d'accès, de rectification, d'effacement
- Droit à la portabilité et d'opposition
Pour exercer ces droits : lelaboduprof69@gmail.com

6. MINEURS
L'accès à STMG HUB est réservé aux personnes âgées d'au moins 13 ans.

7. HÉBERGEMENT ET SÉCURITÉ
Les données sont hébergées sur Firebase (Google Cloud), conforme aux normes européennes. Les connexions sont sécurisées par HTTPS.

8. CONTACT
Khalifa SOUCI — lelaboduprof69@gmail.com`;

const familleEmojis: Record<string,string> = {
  Architecte:"🧠", Visionnaire:"🎨",
  Challenger:"⚡", Explorateur:"🔬", Influenceur:"🔥",
};
const familleColors: Record<string,string> = {
  Architecte:"#3B82F6", Visionnaire:"#0EA5E9",
  Challenger:"#F97316", Explorateur:"#10B981", Influenceur:"#EF4444",
};
const toutesCartes = COLLECTIONS.flatMap(c => c.cartes);


// ---------------------------------------------------------------------------
// MAIN
// ---------------------------------------------------------------------------
export default function Profil({ profil, onRefaire, onDeconnexion }: { profil: Record<string,unknown>; onRefaire:()=>void; onDeconnexion:()=>void }) {
  const [showCGU, setShowCGU]         = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showJoker, setShowJoker]     = useState(false);
  const [jokerUtilise, setJokerUtilise] = useState(false);
  const [chargement, setChargement]   = useState(false);
  const [maCollection, setMaCollection] = useState<Record<string,number>>({});
  const [vitrine, setVitrine]         = useState<(null|{id:string;nom:string;image:string;rarete:string})[]>([null,null,null]);
  const [modeChoixVitrine, setModeChoixVitrine] = useState<number|null>(null);
  const [message, setMessage]         = useState<{texte:string;type:string}|null>(null);
  const [avatarConfig, setAvatarConfig] = useState<AvatarConfig>(DEFAULT_AVATAR);
  const [salon, setSalon]             = useState<SalonConfig>(DEFAULT_SALON);
  const [showStudio, setShowStudio] = useState(false);
  const [ownedThemes, setOwnedThemes] = useState<string[]>([]);
  const [jetonsCurrent, setJetonsCurrent] = useState<number>(0);
  const [tradeOffers, setTradeOffers] = useState<unknown[]>([]);
  const [acceptingTrade, setAcceptingTrade] = useState<string|null>(null);
  const [pageStyle, setPageStyle] = useState<PageStyle>(DEFAULT_PAGE_STYLE);
  const [ownedPageItems, setOwnedPageItems] = useState<string[]>([]);
  const [ownedDecoItems, setOwnedDecoItems] = useState<string[]>([]);

  const jokerDisponible = !(profil.jokerUtilise as boolean) && !jokerUtilise;
  const couleurFamille = familleColors[profil.famille as string] || "#0EA5E9";
  const theme = SALON_THEMES[salon.theme] || SALON_THEMES.defaut;

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800;900&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    chargerDonnees();
  }, []);

  const chargerDonnees = async () => {
    if (!auth.currentUser) return;
    const snap = await getDoc(doc(db, "users", auth.currentUser.uid));
    if (!snap.exists()) return;
    const data = snap.data();
    setMaCollection(data.cartes || {});
    setVitrine(data.vitrine || [null,null,null]);
    if (data.avatar) setAvatarConfig({ ...DEFAULT_AVATAR, ...data.avatar });
    const ownedThemesList = (data.salonThemes as string[]) || [];
    const ownedPageList = (data.pageItems as string[]) || [];
    const ownedDecoList = (data.decoItems as string[]) || [];
    setOwnedThemes(ownedThemesList);
    setOwnedPageItems(ownedPageList);
    setOwnedDecoItems(ownedDecoList);
    if (typeof data.xp === "number") setJetonsCurrent(data.xp);

    const rawSalon = data.salon
      ? ({ ...DEFAULT_SALON, ...(data.salon as SalonConfig) } as SalonConfig)
      : { ...DEFAULT_SALON };
    setSalon(clampSalonToOwned(rawSalon, ownedThemesList, ownedDecoList));

    const rawPs = data.pageStyle
      ? ({
          ...DEFAULT_PAGE_STYLE,
          ...(data.pageStyle as PageStyle),
          avatarFrame: (data.pageStyle as PageStyle).avatarFrame || "defaut",
        } as PageStyle)
      : { ...DEFAULT_PAGE_STYLE };
    setPageStyle(clampPageStyleToOwned(rawPs, ownedPageList));
    // Load pending trade offers (sent TO me)
    if (auth.currentUser) {
      try {
        const q = query(collection(db,"tradeOffers"), where("toUid","==",auth.currentUser.uid), where("status","==","pending"));
        const snap = await getDocs(q);
        setTradeOffers(snap.docs.map(d=>({ id:d.id, ...d.data() })));
      } catch { /* ignore if rules not set */ }
    }
  };

  const afficherMessage = (texte: string, type="success") => {
    setMessage({ texte, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const buyTheme = async (themeKey: string, price: number): Promise<boolean> => {
    if (!auth.currentUser) return false;
    if (isBasePackTheme(themeKey)) return true;
    try {
      await runTransaction(db, async tx => {
        const ref = doc(db,"users",auth.currentUser!.uid);
        const snap = await tx.get(ref);
        if (!snap.exists()) throw new Error();
        const d = snap.data();
        if ((d.xp||0) < price) throw new Error("Pas assez de jetons");
        const themes = [...(d.salonThemes||[]), themeKey];
        tx.update(ref, { xp:(d.xp||0)-price, salonThemes:themes });
      });
      setOwnedThemes(t=>[...t,themeKey]);
      setJetonsCurrent(j=>j-price);
      afficherMessage(`🎨 Thème "${SALON_THEMES[themeKey].label}" débloqué !`);
      return true;
    } catch { afficherMessage("Jetons insuffisants","error"); return false; }
  };

  const acceptTrade = async (offer: Record<string,unknown>) => {
    if (!auth.currentUser || acceptingTrade) return;
    setAcceptingTrade(offer.id as string);
    try {
      await runTransaction(db, async tx => {
        const myRef   = doc(db,"users",auth.currentUser!.uid);
        const fromRef = doc(db,"users",offer.fromUid as string);
        const offerRef = doc(db,"tradeOffers",offer.id as string);
        const mySnap   = await tx.get(myRef);
        const fromSnap = await tx.get(fromRef);
        const myCartes   = mySnap.data()?.cartes || {};
        const fromCartes = fromSnap.data()?.cartes || {};
        const myCard   = offer.toCard as { id:string };
        const fromCard = offer.fromCard as { id:string };
        if ((myCartes[myCard.id]||0) < 1) throw new Error("Tu ne possèdes plus cette carte");
        if ((fromCartes[fromCard.id]||0) < 1) throw new Error("L'autre joueur ne possède plus cette carte");
        // Swap cards
        tx.update(myRef, { [`cartes.${myCard.id}`]:(myCartes[myCard.id]||1)-1, [`cartes.${fromCard.id}`]:(myCartes[fromCard.id]||0)+1 });
        tx.update(fromRef, { [`cartes.${fromCard.id}`]:(fromCartes[fromCard.id]||1)-1, [`cartes.${myCard.id}`]:(fromCartes[myCard.id]||0)+1 });
        tx.update(offerRef, { status:"accepted" });
      });
      setTradeOffers(t=>t.filter((o:unknown)=>(o as {id:string}).id!==offer.id));
      afficherMessage(`✅ Échange accepté avec ${offer.fromPrenom} !`);
    } catch(e) { afficherMessage(e instanceof Error?e.message:"Erreur","error"); }
    setAcceptingTrade(null);
  };

  const declineTrade = async (offer: Record<string,unknown>) => {
    if (!auth.currentUser) return;
    try {
      await updateDoc(doc(db,"tradeOffers",offer.id as string), { status:"declined" });
      setTradeOffers(t=>t.filter((o:unknown)=>(o as {id:string}).id!==offer.id));
      afficherMessage("❌ Échange refusé.");
    } catch { afficherMessage("Erreur","error"); }
  };

  const buyDecoItem = async (em: string, price: number): Promise<boolean> => {
    if (!auth.currentUser) return false;
    if (isBasePackSticker(em)) return true;
    try {
      await runTransaction(db, async (tx) => {
        const ref = doc(db, "users", auth.currentUser!.uid);
        const snap = await tx.get(ref);
        if (!snap.exists()) throw new Error();
        const d = snap.data();
        if ((d.xp || 0) < price) throw new Error("Pas assez de jetons");
        const items = [...(d.decoItems || [])];
        if (!items.includes(em)) items.push(em);
        tx.update(ref, { xp: (d.xp || 0) - price, decoItems: items });
      });
      setOwnedDecoItems((t) => (t.includes(em) ? t : [...t, em]));
      setJetonsCurrent((j) => j - price);
      afficherMessage(`\u2728 Sticker d\u00e9bloqu\u00e9 !`);
      return true;
    } catch {
      afficherMessage("Jetons insuffisants", "error");
      return false;
    }
  };

  const buyPageItem = async (itemKey:string, price:number): Promise<boolean> => {
    if (!auth.currentUser) return false;
    if (isBasePackPageKey(itemKey)) return true;
    try {
      await runTransaction(db, async tx => {
        const ref = doc(db,"users",auth.currentUser!.uid);
        const snap = await tx.get(ref);
        if (!snap.exists()) throw new Error();
        const d = snap.data();
        if ((d.xp||0) < price) throw new Error("Pas assez de jetons");
        tx.update(ref, { xp:(d.xp||0)-price, pageItems:[...(d.pageItems||[]), itemKey] });
      });
      setOwnedPageItems(t=>[...t, itemKey]);
      setJetonsCurrent(j=>j-price);
      return true;
    } catch { afficherMessage("Jetons insuffisants","error"); return false; }
  };

  const saveStudio = async (ps: PageStyle, newSalon: SalonConfig) => {
    const cleanSalon = clampSalonToOwned(
      { ...newSalon, deco: sanitizeSalonDeco(newSalon.deco) },
      ownedThemes,
      ownedDecoItems
    );
    const cleanPs = clampPageStyleToOwned(
      { ...DEFAULT_PAGE_STYLE, ...ps, avatarFrame: ps.avatarFrame || "defaut" },
      ownedPageItems
    );
    setPageStyle(cleanPs);
    setSalon(cleanSalon);
    if (!auth.currentUser) return;
    await updateDoc(doc(db, "users", auth.currentUser.uid), {
      pageStyle: cleanPs,
      salon: cleanSalon,
    });
    afficherMessage("\u2728 Profil personnalis\u00e9 !");
  };

  const cartesPossedees = toutesCartes.filter(c => (maCollection[c.id]||0) > 0);

  const choisirCarteVitrine = async (carte: {id:string;nom:string;image:string;rarete:string}) => {
    if (modeChoixVitrine === null) return;
    const nouvelleVitrine = [...vitrine];
    const existeIdx = nouvelleVitrine.findIndex(v => v?.id === carte.id);
    if (existeIdx !== -1) nouvelleVitrine[existeIdx] = null;
    nouvelleVitrine[modeChoixVitrine] = { id:carte.id, nom:carte.nom, image:carte.image, rarete:carte.rarete };
    setVitrine(nouvelleVitrine);
    setModeChoixVitrine(null);
    await updateDoc(doc(db,"users",auth.currentUser!.uid), { vitrine: nouvelleVitrine });
    afficherMessage("✅ Vitrine mise à jour !");
  };

  const utiliserJoker = async () => {
    setChargement(true);
    await updateDoc(doc(db,"users",auth.currentUser!.uid), {
      jokerUtilise:true, famille:null, animalTotem:null, objetTotem:null, starTotem:null,
    });
    setJokerUtilise(true);
    setChargement(false);
    setShowJoker(false);
    onRefaire();
  };

  const familleNom = (profil.famille as string)
    ? `${familleEmojis[profil.famille as string]} ${
        profil.famille==="Architecte"?"L'Architecte":
        profil.famille==="Visionnaire"?"Le Visionnaire":
        profil.famille==="Challenger"?"Le Challenger":
        profil.famille==="Explorateur"?"L'Explorateur":"L'Influenceur"}`
    : "Non défini";

  const salonTitre = salon.titre || `Le Salon de ${profil.prenom as string}`;

  const pageBgCfg = PAGE_BG[pageStyle.pageBg] || PAGE_BG.defaut;

  return (
    <>
      <style>{PROFIL_CSS}</style>
      {message && (
        <div
          className="fixed left-4 right-4 top-20 z-50 mx-auto max-w-md rounded-2xl px-5 py-3 text-center font-['Fredoka_One'] text-white shadow-lg"
          style={{ background: message.type === "error" ? "#EF4444" : "#10B981" }}
        >
          {message.texte}
        </div>
      )}

      <ProfilPageView
        profil={profil}
        salon={salon}
        pageStyle={pageStyle}
        pageBgCfg={pageBgCfg}
        couleurFamille={couleurFamille}
        avatarConfig={avatarConfig}
        salonTitre={salonTitre}
        familleNom={familleNom}
        vitrine={vitrine}
        cartesCount={cartesPossedees.length}
        jetonsLabel={formatJetons((profil.xp as number) || 0)}
        tradeOffers={tradeOffers as Record<string, unknown>[]}
        acceptingTrade={acceptingTrade}
        jokerDisponible={jokerDisponible}
        onPersonalize={() => setShowStudio(true)}
        onPickVitrineSlot={setModeChoixVitrine}
        onAcceptTrade={acceptTrade}
        onDeclineTrade={declineTrade}
        onJoker={() => setShowJoker(true)}
        onCGU={() => setShowCGU(true)}
        onContact={() => setShowContact(true)}
        onLogout={onDeconnexion}
      />

      {showStudio&&(
        <ProfileStudio
          prenom={profil.prenom as string}
          couleurFamille={couleurFamille}
          avatarConfig={avatarConfig}
          pageStyle={pageStyle}
          salon={salon}
          jetons={jetonsCurrent}
          ownedPageItems={ownedPageItems}
          ownedThemes={ownedThemes}
          ownedDecoItems={ownedDecoItems}
          onBuyPageItem={buyPageItem}
          onBuyDecoItem={buyDecoItem}
          onBuyTheme={buyTheme}
          onSave={saveStudio}
          onClose={()=>setShowStudio(false)}
        />
      )}

      {/* POPUP CHOIX VITRINE */}
      {modeChoixVitrine!==null&&(
        <div onClick={()=>setModeChoixVitrine(null)} style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.9)",zIndex:2000,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"flex-start",padding:"20px",overflowY:"auto" }}>
          <div onClick={e=>e.stopPropagation()} style={{ width:"100%",maxWidth:"600px" }}>
            <p style={{ fontFamily:"'Fredoka One',cursive",color:"white",fontSize:"1.5rem",textAlign:"center",margin:"0 0 8px" }}>
              {"\u2728 Choisir une carte pour le slot"} {modeChoixVitrine+1}
            </p>
            <p style={{ color:"#9CA3AF",fontSize:"0.85rem",textAlign:"center",margin:"0 0 20px" }}>{cartesPossedees.length} cartes disponibles</p>
            {cartesPossedees.length===0 ? (
              <div style={{ textAlign:"center",padding:"40px",background:"rgba(255,255,255,0.05)",borderRadius:"20px" }}>
                <p style={{ fontFamily:"'Fredoka One',cursive",color:"#9CA3AF",fontSize:"1.1rem" }}>Tu n'as pas encore de cartes !</p>
              </div>
            ) : (
              <div style={{ display:"flex",flexWrap:"wrap",gap:"10px",justifyContent:"center" }}>
                {cartesPossedees.map(carte => {
                  const config = RARETE_CONFIG[carte.rarete as keyof typeof RARETE_CONFIG];
                  const estDansVitrine = vitrine.some(v=>v?.id===carte.id);
                  return (
                    <div key={carte.id} onClick={()=>choisirCarteVitrine(carte)}
                      style={{ width:"100px",borderRadius:"12px",overflow:"hidden",border:`3px solid ${estDansVitrine?config.couleur:config.couleur+"60"}`,boxShadow:estDansVitrine?`0 0 15px ${config.couleur}80`:"none",cursor:"pointer",background:"white",transition:"all 0.2s",opacity:estDansVitrine?0.6:1 }}>
                      <img src={carte.image} alt={carte.nom} style={{ width:"100%",display:"block" }}/>
                      <div style={{ padding:"4px 6px",borderTop:`1px solid ${config.couleur}20` }}>
                        <p style={{ fontSize:"0.5rem",fontWeight:"700",color:"#1A1A2E",margin:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{carte.nom}</p>
                        <p style={{ fontSize:"0.48rem",color:config.couleur,margin:"1px 0 0" }}>{config.emoji} {config.label}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            <div style={{ textAlign:"center",marginTop:"20px" }}>
              <button onClick={()=>setModeChoixVitrine(null)} style={{ background:"rgba(239,68,68,0.2)",color:"#EF4444",border:"2px solid rgba(239,68,68,0.4)",fontFamily:"'Fredoka One',cursive",fontSize:"1rem",padding:"12px 28px",borderRadius:"14px",cursor:"pointer" }}>
                {"✕ Annuler"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP CGU */}
      {showCGU&&(
        <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",zIndex:2000,display:"flex",alignItems:"center",justifyContent:"center",padding:"16px" }}>
          <div style={{ background:"white",borderRadius:"24px",maxWidth:"500px",width:"100%",maxHeight:"80vh",display:"flex",flexDirection:"column" }}>
            <div style={{ padding:"20px 24px",borderBottom:"1px solid #E5E7EB",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
              <p style={{ fontFamily:"'Fredoka One',cursive",color:"#1A1A2E",fontSize:"1.1rem",margin:0 }}>{"\u{1F4CB} CGU & RGPD"}</p>
              <button onClick={()=>setShowCGU(false)} style={{ background:"none",border:"none",fontSize:"1.5rem",cursor:"pointer",color:"#9CA3AF" }}>{"×"}</button>
            </div>
            <div style={{ padding:"20px 24px",overflowY:"auto",flex:1 }}>
              <pre style={{ color:"#374151",fontSize:"0.75rem",whiteSpace:"pre-wrap",lineHeight:1.8,fontFamily:"'Nunito',sans-serif" }}>{CGU_TEXTE}</pre>
            </div>
            <div style={{ padding:"16px 24px",borderTop:"1px solid #E5E7EB" }}>
              <button onClick={()=>setShowCGU(false)} style={{ width:"100%",background:"linear-gradient(135deg,#0EA5E9,#2563EB)",color:"white",border:"none",fontFamily:"'Fredoka One',cursive",fontSize:"1rem",padding:"12px",borderRadius:"12px",cursor:"pointer" }}>Fermer</button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP CONTACT */}
      {showContact&&(
        <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",zIndex:2000,display:"flex",alignItems:"center",justifyContent:"center",padding:"16px" }}>
          <div style={{ background:"white",borderRadius:"24px",maxWidth:"400px",width:"100%",padding:"28px" }}>
            <p style={{ fontFamily:"'Fredoka One',cursive",color:"#1A1A2E",fontSize:"1.3rem",margin:"0 0 20px" }}>{"\u{1F4E7} Nous contacter"}</p>
            {[
              { label:"Responsable", valeur:"Khalifa SOUCI" },
              { label:"Email",       valeur:"lelaboduprof69@gmail.com" },
            ].map((item,i)=>(
              <div key={i} style={{ background:"#F8FAFC",borderRadius:"14px",padding:"14px 16px",marginBottom:"10px" }}>
                <p style={{ color:"#9CA3AF",fontSize:"0.8rem",margin:"0 0 4px" }}>{item.label}</p>
                <p style={{ color:"#1A1A2E",fontWeight:"700",fontSize:"0.95rem",margin:0 }}>{item.valeur}</p>
              </div>
            ))}
            <button onClick={()=>setShowContact(false)} style={{ width:"100%",background:"linear-gradient(135deg,#0EA5E9,#2563EB)",color:"white",border:"none",fontFamily:"'Fredoka One',cursive",fontSize:"1rem",padding:"12px",borderRadius:"12px",cursor:"pointer",marginTop:"8px" }}>Fermer</button>
          </div>
        </div>
      )}

      {/* POPUP JOKER */}
      {showJoker&&(
        <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",zIndex:2000,display:"flex",alignItems:"center",justifyContent:"center",padding:"16px" }}>
          <div style={{ background:"white",borderRadius:"24px",maxWidth:"380px",width:"100%",padding:"32px",textAlign:"center" }}>
            <p style={{ fontSize:"4rem",margin:"0 0 12px" }}>{"\u{1F0CF}"}</p>
            <p style={{ fontFamily:"'Fredoka One',cursive",color:"#1A1A2E",fontSize:"1.4rem",margin:"0 0 8px" }}>Utiliser ton Joker ?</p>
            <p style={{ color:"#9CA3AF",fontSize:"0.85rem",margin:"0 0 24px",lineHeight:1.8 }}>
              {"\u2705 Jetons conserv\u00e9s\n\u2705 Badges conserv\u00e9s\n\u2705 Chapitres conserv\u00e9s\n\u2705 Cartes conserv\u00e9es\n\u26A0\ufe0f Famille et Totems r\u00e9initialis\u00e9s\n\u26A0\ufe0f Joker non r\u00e9cup\u00e9rable"}
            </p>
            <div style={{ display:"flex",gap:"12px" }}>
              <button onClick={()=>setShowJoker(false)} style={{ flex:1,background:"#F3F4F6",color:"#374151",border:"none",fontFamily:"'Fredoka One',cursive",fontSize:"1rem",padding:"14px",borderRadius:"14px",cursor:"pointer" }}>Annuler</button>
              <button onClick={utiliserJoker} disabled={chargement} style={{ flex:1,background:"linear-gradient(135deg,#F59E0B,#B45309)",color:"white",border:"none",fontFamily:"'Fredoka One',cursive",fontSize:"1rem",padding:"14px",borderRadius:"14px",cursor:"pointer" }}>
                {chargement?"\u23F3...":"\u{1F0CF} Confirmer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
