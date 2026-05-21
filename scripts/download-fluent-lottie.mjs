import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outDir = path.join(root, "public", "lottie", "fluent");

const FLUENT_GH =
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets";

const FOLDER_TO_FILE = {
  fire: "fire",
  sparkles: "sparkles",
  crown: "crown",
  rocket: "rocket",
  rainbow: "rainbow",
  "star-struck": "star-struck",
  "party popper": "party_popper",
  "heart on fire": "heart_on_fire",
  "diamond with a dot": "diamond_with_a_dot",
  lightning: "lightning",
  unicorn: "unicorn",
  dragon: "dragon",
  ghost: "ghost",
  "alien monster": "alien_monster",
  "cat with tears of joy": "cat_with_tears_of_joy",
  "hundred points": "hundred_points",
  snowflake: "snowflake",
  sun: "sun",
  "moon face": "moon_face",
  "cherry blossom": "cherry_blossom",
  tada: "tada",
  trophy: "trophy",
  "money bag": "money_bag",
  "gem stone": "gem_stone",
  "graduation cap": "graduation_cap",
  "flexed biceps": "flexed_biceps",
  bullseye: "bullseye",
  brain: "brain",
  "shooting star": "shooting_star",
  tornado: "tornado",
  "nerd face": "nerd_face",
  "smiling face with sunglasses": "smiling_face_with_sunglasses",
  "red heart": "red_heart",
  "blue heart": "blue_heart",
  "purple heart": "purple_heart",
  "clapping hands": "clapping_hands",
  "thumbs up": "thumbs_up",
  "partying face": "partying_face",
  butterfly: "butterfly",
  "hot beverage": "hot_beverage",
  pizza: "pizza",
  "stack of books": "stack_of_books",
  "musical notes": "musical_notes",
  "soccer ball": "soccer_ball",
  basketball: "basketball",
  "wrapped gift": "wrapped_gift",
  "birthday cake": "birthday_cake",
  candle: "candle",
  dog: "dog",
  cat: "cat",
  penguin: "penguin",
  owl: "owl",
  "red apple": "red_apple",
  avocado: "avocado",
  balloon: "balloon",
  megaphone: "megaphone",
  microphone: "microphone",
  "camera with flash": "camera_with_flash",
  comet: "comet",
  "ringed planet": "ringed_planet",
  "zany face": "zany_face",
  "melting face": "melting_face",
  "saluting face": "saluting_face",
  star: "star",
  "glowing star": "glowing_star",
  collision: "collision",
  telescope: "telescope",
  books: "books",
  "artist palette": "artist_palette",
};

fs.mkdirSync(outDir, { recursive: true });

let ok = 0;
let fail = 0;

for (const [folder, file] of Object.entries(FOLDER_TO_FILE)) {
  const url = `${FLUENT_GH}/${encodeURIComponent(folder)}/Animated/${file}.json`;
  const dest = path.join(outDir, `${file}.json`);
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.warn("SKIP", file, res.status);
      fail++;
      continue;
    }
    const json = await res.text();
    fs.writeFileSync(dest, json, "utf8");
    console.log("OK", file);
    ok++;
  } catch (e) {
    console.warn("ERR", file, e.message);
    fail++;
  }
}

console.log(`Done: ${ok} ok, ${fail} failed -> ${outDir}`);
