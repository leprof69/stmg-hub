import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "public", "fluent-3d");
const GH = "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets";

const ITEMS = [
  ["Fire", "fire_3d.png", "fire"],
  ["Sparkles", "sparkles_3d.png", "sparkles"],
  ["Crown", "crown_3d.png", "crown"],
  ["Rocket", "rocket_3d.png", "rocket"],
  ["Rainbow", "rainbow_3d.png", "rainbow"],
  ["Star-struck", "star-struck_3d.png", "star-struck"],
  ["Party popper", "party_popper_3d.png", "party_popper"],
  ["Heart on fire", "heart_on_fire_3d.png", "heart_on_fire"],
  ["Diamond with a dot", "diamond_with_a_dot_3d.png", "diamond_with_a_dot"],
  ["High voltage", "high_voltage_3d.png", "high_voltage"],
  ["Unicorn", "unicorn_3d.png", "unicorn"],
  ["Dragon", "dragon_3d.png", "dragon"],
  ["Ghost", "ghost_3d.png", "ghost"],
  ["Alien monster", "alien_monster_3d.png", "alien_monster"],
  ["Cat with tears of joy", "cat_with_tears_of_joy_3d.png", "cat_with_tears_of_joy"],
  ["Hundred points", "hundred_points_3d.png", "hundred_points"],
  ["Snowflake", "snowflake_3d.png", "snowflake"],
  ["Sun", "sun_3d.png", "sun"],
  ["Full moon face", "full_moon_face_3d.png", "moon_face"],
  ["Cherry blossom", "cherry_blossom_3d.png", "cherry_blossom"],
  ["Tada", "tada_3d.png", "tada"],
  ["Trophy", "trophy_3d.png", "trophy"],
  ["Money bag", "money_bag_3d.png", "money_bag"],
  ["Gem stone", "gem_stone_3d.png", "gem_stone"],
  ["Graduation cap", "graduation_cap_3d.png", "graduation_cap"],
  ["Flexed biceps", "flexed_biceps_3d.png", "flexed_biceps"],
  ["Bullseye", "bullseye_3d.png", "bullseye"],
  ["Brain", "brain_3d.png", "brain"],
  ["Shooting star", "shooting_star_3d.png", "shooting_star"],
  ["Tornado", "tornado_3d.png", "tornado"],
  ["Nerd face", "nerd_face_3d.png", "nerd_face"],
  ["Smiling face with sunglasses", "smiling_face_with_sunglasses_3d.png", "smiling_face_with_sunglasses"],
  ["Red heart", "red_heart_3d.png", "red_heart"],
  ["Blue heart", "blue_heart_3d.png", "blue_heart"],
  ["Purple heart", "purple_heart_3d.png", "purple_heart"],
  ["Clapping hands", "clapping_hands_3d.png", "clapping_hands"],
  ["Thumbs up", "thumbs_up_3d.png", "thumbs_up"],
  ["Partying face", "partying_face_3d.png", "partying_face"],
  ["Butterfly", "butterfly_3d.png", "butterfly"],
  ["Hot beverage", "hot_beverage_3d.png", "hot_beverage"],
  ["Pizza", "pizza_3d.png", "pizza"],
  ["Books", "books_3d.png", "books"],
  ["Musical notes", "musical_notes_3d.png", "musical_notes"],
  ["Soccer ball", "soccer_ball_3d.png", "soccer_ball"],
  ["Basketball", "basketball_3d.png", "basketball"],
  ["Wrapped gift", "wrapped_gift_3d.png", "wrapped_gift"],
  ["Birthday cake", "birthday_cake_3d.png", "birthday_cake"],
  ["Candle", "candle_3d.png", "candle"],
  ["Dog", "dog_3d.png", "dog"],
  ["Cat", "cat_3d.png", "cat"],
  ["Penguin", "penguin_3d.png", "penguin"],
  ["Owl", "owl_3d.png", "owl"],
  ["Red apple", "red_apple_3d.png", "red_apple"],
  ["Avocado", "avocado_3d.png", "avocado"],
  ["Balloon", "balloon_3d.png", "balloon"],
  ["Megaphone", "megaphone_3d.png", "megaphone"],
  ["Microphone", "microphone_3d.png", "microphone"],
  ["Camera with flash", "camera_with_flash_3d.png", "camera_with_flash"],
  ["Comet", "comet_3d.png", "comet"],
  ["Ringed planet", "ringed_planet_3d.png", "ringed_planet"],
  ["Zany face", "zany_face_3d.png", "zany_face"],
  ["Melting face", "melting_face_3d.png", "melting_face"],
  ["Saluting face", "saluting_face_3d.png", "saluting_face"],
  ["Glowing star", "glowing_star_3d.png", "glowing_star"],
  ["Collision", "collision_3d.png", "collision"],
  ["Telescope", "telescope_3d.png", "telescope"],
  ["Artist palette", "artist_palette_3d.png", "artist_palette"],
];

fs.mkdirSync(outDir, { recursive: true });
let ok = 0;
let fail = 0;

for (const [folder, file, id] of ITEMS) {
  const url = `${GH}/${encodeURIComponent(folder)}/3D/${file}`;
  const dest = path.join(outDir, `${id}.png`);
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.warn("SKIP", id, res.status, file);
      fail++;
      continue;
    }
    fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
    console.log("OK", id);
    ok++;
  } catch (e) {
    console.warn("ERR", id, e.message);
    fail++;
  }
}

console.log(`Done: ${ok} ok, ${fail} fail`);
