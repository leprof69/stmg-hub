import ObjectifBac from "./ObjectifBac";

/** Accès direct aux entraînements Objectif Bac (dont le DS chapitre 13). */
export default function DevoirSurTable({ profil, onXPGagne }) {
  return <ObjectifBac profil={profil} onXPGagne={onXPGagne} initialActiveTab="entrainements" />;
}
