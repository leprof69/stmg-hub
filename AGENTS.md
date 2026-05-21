# Consignes agents — STMG HUB

## Encodage UTF-8 (prioritaire)

Le projet a déjà eu des textes français **cassés** (symbole de remplacement U+FFFD affiché comme ``). **Ne jamais réintroduire ce problème.**

### Règles

1. Tous les fichiers sous `src/` sont en **UTF-8**.
2. **Interdit** : caractère U+FFFD, chaînes du type `Prnom` / `Rponse`, scripts qui remplacent **tous** les `?` du dépôt.
3. Après modification de libellés ou messages en français :
   - `npm run check:encoding`
4. Si échec : `npm run fix:encoding` puis `npm run check:encoding` et relecture des `?:` / ternaires TypeScript.
5. Préférer `\u00e9`, `\u00c9`, `\u00e8`, etc. pour le texte UI critique si l’encodage du fichier est incertain.

### Scripts

| Commande | Rôle |
|----------|------|
| `npm run check:encoding` | Échoue si U+FFFD dans `src/` |
| `npm run fix:encoding` | Réparation automatique (à valider ensuite) |

Le **build** et le **typecheck** exécutent `check:encoding` automatiquement.

### UI

- Langue interface : **français** avec accents corrects.
- Ne pas confondre point médian UI (`·`) et opérateur `?` du code.
