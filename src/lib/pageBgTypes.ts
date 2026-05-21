export type BgKind = "mesh" | "photo";
export type BgCategory = "mesh" | "ambiance" | "cinema" | "animation";

export type BgDef = {
  label: string;
  bg: string;
  price: number;
  dark: boolean;
  desc?: string;
  kind?: BgKind;
  image?: string;
  /** Point de focalisation CSS object-position (ex: "center 35%") */
  focal?: string;
  category?: BgCategory;
  credit?: string;
};
