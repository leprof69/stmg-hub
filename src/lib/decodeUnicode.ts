/** D—code les s—quences litt—rales \\uXXXX et \\u{...} (souvent visibles si mal plac—es en JSX). */
export function decodeUnicodeEscapes(value = ""): string {
  let s = String(value);
  if (!/\\u/i.test(s)) return s;
  s = s.replace(/\\u\{([0-9a-fA-F]+)\}/gi, (_, hex) => {
    const cp = parseInt(hex, 16);
    return Number.isFinite(cp) ? String.fromCodePoint(cp) : _;
  });
  s = s.replace(/\\u([0-9a-fA-F]{4})/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
  return s;
}

/** Texte affiché à l'écran (feedback IA, libell’s, etc.). */
export function fixDisplayText(value: unknown): string {
  return decodeUnicodeEscapes(String(value ?? ""));
}
