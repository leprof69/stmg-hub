/** PNG 3D Microsoft Fluent UI Emoji à /public/fluent-3d/ (MIT) */
export const FLUENT_3D_ITEMS: { folder: string; file: string; id: string }[] = [
  { folder: "Fire", file: "fire_3d.png", id: "fire" },
  { folder: "Sparkles", file: "sparkles_3d.png", id: "sparkles" },
  { folder: "Crown", file: "crown_3d.png", id: "crown" },
  { folder: "Rocket", file: "rocket_3d.png", id: "rocket" },
  { folder: "Rainbow", file: "rainbow_3d.png", id: "rainbow" },
  { folder: "Star-struck", file: "star-struck_3d.png", id: "star-struck" },
  { folder: "Party popper", file: "party_popper_3d.png", id: "party_popper" },
  { folder: "Heart on fire", file: "heart_on_fire_3d.png", id: "heart_on_fire" },
  { folder: "Diamond with a dot", file: "diamond_with_a_dot_3d.png", id: "diamond_with_a_dot" },
  { folder: "High voltage", file: "high_voltage_3d.png", id: "high_voltage" },
  { folder: "Unicorn", file: "unicorn_3d.png", id: "unicorn" },
  { folder: "Dragon", file: "dragon_3d.png", id: "dragon" },
  { folder: "Ghost", file: "ghost_3d.png", id: "ghost" },
  { folder: "Alien monster", file: "alien_monster_3d.png", id: "alien_monster" },
  { folder: "Cat with tears of joy", file: "cat_with_tears_of_joy_3d.png", id: "cat_with_tears_of_joy" },
  { folder: "Hundred points", file: "hundred_points_3d.png", id: "hundred_points" },
  { folder: "Snowflake", file: "snowflake_3d.png", id: "snowflake" },
  { folder: "Sun", file: "sun_3d.png", id: "sun" },
  { folder: "Full moon face", file: "full_moon_face_3d.png", id: "moon_face" },
  { folder: "Cherry blossom", file: "cherry_blossom_3d.png", id: "cherry_blossom" },
  { folder: "Trophy", file: "trophy_3d.png", id: "trophy" },
  { folder: "Money bag", file: "money_bag_3d.png", id: "money_bag" },
  { folder: "Gem stone", file: "gem_stone_3d.png", id: "gem_stone" },
  { folder: "Graduation cap", file: "graduation_cap_3d.png", id: "graduation_cap" },
  { folder: "Bullseye", file: "bullseye_3d.png", id: "bullseye" },
  { folder: "Brain", file: "brain_3d.png", id: "brain" },
  { folder: "Shooting star", file: "shooting_star_3d.png", id: "shooting_star" },
  { folder: "Tornado", file: "tornado_3d.png", id: "tornado" },
  { folder: "Nerd face", file: "nerd_face_3d.png", id: "nerd_face" },
  { folder: "Smiling face with sunglasses", file: "smiling_face_with_sunglasses_3d.png", id: "smiling_face_with_sunglasses" },
  { folder: "Red heart", file: "red_heart_3d.png", id: "red_heart" },
  { folder: "Blue heart", file: "blue_heart_3d.png", id: "blue_heart" },
  { folder: "Purple heart", file: "purple_heart_3d.png", id: "purple_heart" },
  { folder: "Partying face", file: "partying_face_3d.png", id: "partying_face" },
  { folder: "Butterfly", file: "butterfly_3d.png", id: "butterfly" },
  { folder: "Hot beverage", file: "hot_beverage_3d.png", id: "hot_beverage" },
  { folder: "Pizza", file: "pizza_3d.png", id: "pizza" },
  { folder: "Books", file: "books_3d.png", id: "books" },
  { folder: "Musical notes", file: "musical_notes_3d.png", id: "musical_notes" },
  { folder: "Soccer ball", file: "soccer_ball_3d.png", id: "soccer_ball" },
  { folder: "Basketball", file: "basketball_3d.png", id: "basketball" },
  { folder: "Wrapped gift", file: "wrapped_gift_3d.png", id: "wrapped_gift" },
  { folder: "Birthday cake", file: "birthday_cake_3d.png", id: "birthday_cake" },
  { folder: "Candle", file: "candle_3d.png", id: "candle" },
  { folder: "Dog", file: "dog_3d.png", id: "dog" },
  { folder: "Cat", file: "cat_3d.png", id: "cat" },
  { folder: "Penguin", file: "penguin_3d.png", id: "penguin" },
  { folder: "Owl", file: "owl_3d.png", id: "owl" },
  { folder: "Red apple", file: "red_apple_3d.png", id: "red_apple" },
  { folder: "Avocado", file: "avocado_3d.png", id: "avocado" },
  { folder: "Balloon", file: "balloon_3d.png", id: "balloon" },
  { folder: "Megaphone", file: "megaphone_3d.png", id: "megaphone" },
  { folder: "Microphone", file: "microphone_3d.png", id: "microphone" },
  { folder: "Camera with flash", file: "camera_with_flash_3d.png", id: "camera_with_flash" },
  { folder: "Comet", file: "comet_3d.png", id: "comet" },
  { folder: "Ringed planet", file: "ringed_planet_3d.png", id: "ringed_planet" },
  { folder: "Zany face", file: "zany_face_3d.png", id: "zany_face" },
  { folder: "Melting face", file: "melting_face_3d.png", id: "melting_face" },
  { folder: "Saluting face", file: "saluting_face_3d.png", id: "saluting_face" },
  { folder: "Glowing star", file: "glowing_star_3d.png", id: "glowing_star" },
  { folder: "Collision", file: "collision_3d.png", id: "collision" },
  { folder: "Telescope", file: "telescope_3d.png", id: "telescope" },
  { folder: "Artist palette", file: "artist_palette_3d.png", id: "artist_palette" },
];

export function fluent3d(id: string): string {
  return `fluent3d:/fluent-3d/${id}.png`;
}

/** Anciennes sauvegardes : lottie GitHub ou lottie local */
export function resolveLottieFetchUrl(em: string): string {
  const u = em.startsWith("lottie:") ? em.slice(7) : em;
  if (u.startsWith("/")) return u;
  const m = u.match(/\/Animated\/([^/?#.]+)\.json/i);
  if (m) {
    const id = decodeURIComponent(m[1]);
    return `/lottie/fluent/${id}.json`;
  }
  return u;
}

export function resolveDecoMediaUrl(em: string): { type: "lottie" | "fluent3d" | "gif" | "icon" | "emoji" | "raw"; src: string } {
  if (em.startsWith("fluent3d:")) return { type: "fluent3d", src: em.slice(9) };
  if (em.startsWith("lottie:")) return { type: "lottie", src: resolveLottieFetchUrl(em) };
  if (em.startsWith("gif:")) return { type: "gif", src: em.slice(4) };
  if (em.startsWith("icon:")) return { type: "icon", src: em.slice(5) };
  if (em.startsWith("emoji:")) return { type: "emoji", src: em.slice(6) };
  return { type: "raw", src: em };
}
