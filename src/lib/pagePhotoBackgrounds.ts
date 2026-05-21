import type { BgDef } from "./pageBgTypes";

/** Photos Pexels (licence libre), sans personnages ni logos proteges. */
function photo(
  file: string,
  opts: {
    label: string;
    category: "ambiance" | "cinema" | "animation";
    price: number;
    dark: boolean;
    desc: string;
    credit?: string;
    focal?: string;
  }
): BgDef {
  return {
    kind: "photo",
    image: `/page-bg/${file}`,
    focal: opts.focal ?? "center 38%",
    category: opts.category,
    label: opts.label,
    price: opts.price,
    dark: opts.dark,
    desc: opts.desc,
    credit: opts.credit ?? "Pexels",
    bg: "",
  };
}

export const PAGE_BG_PHOTOS: Record<string, BgDef> = {
  // ?? Ambiances ?????????????????????????????????????????????????????????????
  ph_foret: photo("foret.jpg", {
    label: "For\u00eat",
    category: "ambiance",
    price: 60,
    dark: true,
    desc: "Sous-bois calme",
    focal: "center 42%",
  }),
  ph_plage: photo("plage.jpg", {
    label: "Plage",
    category: "ambiance",
    price: 60,
    dark: false,
    desc: "Mer & sable",
    focal: "center 55%",
  }),
  ph_ville: photo("ville-nuit.jpg", {
    label: "Ville la nuit",
    category: "ambiance",
    price: 80,
    dark: true,
    desc: "Skyline urbain",
    focal: "center 28%",
  }),
  ph_cafe: photo("cafe.jpg", {
    label: "Caf\u00e9 cosy",
    category: "ambiance",
    price: 50,
    dark: false,
    desc: "Chaleur & bois",
  }),
  ph_pluie: photo("pluie.jpg", {
    label: "Pluie",
    category: "ambiance",
    price: 70,
    dark: true,
    desc: "Fen\u00eatre sous la pluie",
  }),
  ph_montagne: photo("montagne.jpg", {
    label: "Montagne",
    category: "ambiance",
    price: 70,
    dark: false,
    desc: "Lac & sommets",
  }),
  ph_biblio: photo("biblio.jpg", {
    label: "Biblioth\u00e8que",
    category: "ambiance",
    price: 80,
    dark: true,
    desc: "Coin lecture",
  }),
  ph_coucher: photo("coucher-soleil.jpg", {
    label: "Coucher de soleil",
    category: "ambiance",
    price: 60,
    dark: false,
    desc: "Champ dor\u00e9",
    focal: "center 45%",
  }),
  // ?? Cin\u00e9ma (ambiances, pas d\u2019affiches sous copyright) ???????????????
  ph_salle: photo("cinema-salle.jpg", {
    label: "Salle de cin\u00e9",
    category: "cinema",
    price: 90,
    dark: true,
    desc: "Si\u00e8ges & projecteur",
    focal: "center 40%",
  }),
  ph_popcorn: photo("popcorn.jpg", {
    label: "Pop-corn",
    category: "cinema",
    price: 50,
    dark: false,
    desc: "Snack de s\u00e9ance",
  }),
  ph_pellicule: photo("pellicule.jpg", {
    label: "Pellicule",
    category: "cinema",
    price: 70,
    dark: true,
    desc: "Esprit 7e art",
  }),
  ph_rideau: photo("rideau-rouge.jpg", {
    label: "Rideau rouge",
    category: "cinema",
    price: 80,
    dark: true,
    desc: "Sc\u00e8ne & spectacle",
  }),
  // ?? Style anim\u00e9 (couleurs / univers, sans IP) ???????????????????????????
  ph_pastel: photo("pastel.jpg", {
    label: "Nuages pastel",
    category: "animation",
    price: 60,
    dark: false,
    desc: "Ciel illustr\u00e9",
  }),
  ph_couleurs: photo("couleurs.jpg", {
    label: "Explosion couleurs",
    category: "animation",
    price: 80,
    dark: false,
    desc: "\u00c9nergie cartoon",
  }),
  ph_neon_anim: photo("neon-anim.jpg", {
    label: "N\u00e9on cartoon",
    category: "animation",
    price: 90,
    dark: true,
    desc: "Ville stylis\u00e9e",
  }),
  ph_ink: photo("encre.jpg", {
    label: "Encre & traits",
    category: "animation",
    price: 70,
    dark: true,
    desc: "Style manga abstrait",
  }),
  ph_stars_anim: photo("etoiles-anim.jpg", {
    label: "Ciel magique",
    category: "animation",
    price: 60,
    dark: true,
    desc: "Nuit \u00e9toil\u00e9e",
  }),
};
