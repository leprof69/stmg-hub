/** Plein \u00e9cran navigateur (Fullscreen API) pour le DS. */

export function isFullscreenActive(): boolean {
  return Boolean(document.fullscreenElement);
}

export async function enterDsFullscreen(): Promise<void> {
  const el = document.documentElement;
  if (document.fullscreenElement === el) return;
  try {
    await el.requestFullscreen();
  } catch (err) {
    console.warn("Plein ecran indisponible", err);
  }
}

export async function exitDsFullscreen(): Promise<void> {
  if (!document.fullscreenElement) return;
  try {
    await document.exitFullscreen();
  } catch (err) {
    console.warn("Sortie plein ecran impossible", err);
  }
}
