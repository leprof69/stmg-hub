# Checklist UI Missions (élève)

À appliquer **avant** de considérer une tâche Missions terminée.

1. **Texte** : accents UTF-8 réels ; jamais `\u00xx` visible dans le texte entre balises JSX.
2. **Textareas** : styles partagés `.mission-answer` et `.mission-answer-block` ; `rows` suffisant (? 8 par question).
3. **Pas de messages dev** : pas de « pilote », pas de « Source : IA/grille » côté élève pour la rubrique.
4. **`npm run check:encoding`** après toute chaîne française.

Règle Cursor : `.cursor/rules/missions-eleve-ui.mdc`
