# STMG HUB

Application **React 19** + **Vite 6** + **TypeScript** + **Tailwind**.

## Prérequis

Créez un fichier `.env` à partir de `.env.example` et renseignez les variables **`VITE_FIREBASE_*`** (obligatoires au chargement).

## Scripts

- `npm run dev` — serveur de développement (http://localhost:3000)
- `npm run build` — vérifie l’encodage UTF-8 puis bundle de production dans `dist/`
- `npm run preview` — prévisualisation du build
- `npm run typecheck` — encodage + vérification TypeScript
- `npm run check:encoding` — refuse les caractères cassés (U+FFFD) dans `src/`
- `npm run fix:encoding` — réparation automatique des accents (à contrôler après coup)

### Encodage français

Les fichiers source doivent rester en **UTF-8** (accents corrects, pas de symboles ``).
Consignes détaillées pour les agents : **`AGENTS.md`** et **`.cursor/rules/encoding-francais-utf8.mdc`**.

## Déploiement Firebase Hosting

La cible configurée dans `firebase.json` est **`dist`** (`npm run build` puis `firebase deploy`).

Guide pas à pas (Netlify, variables, Firebase) pour non-développeurs : **`docs/GUIDE_DEPLOIEMENT_SITE.md`**.  
Si Netlify affiche **pnpm** ou **wd** : **`docs/NETLIFY_PNPM_ET_WD.md`**.

## Contenus (workflow actuel)

- Import **chapitres** et **missions** depuis deux fichiers **Excel (.xlsx)** via l’onglet Admin « Imports ».
- Médias cartes sous **`public/cartes/`** ; autres visuels manuel sous **`public/manuel/`**.
