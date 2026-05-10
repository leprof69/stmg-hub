# Si Netlify parle de « pnpm » ou du paquet « wd »

Le projet **STMG HUB** sur ton PC utilise **`npm`** et un fichier **`package-lock.json`**. Il n’utilise **pas** `pnpm` et il n’y a **pas** le paquet `wd` dans les dépendances.

Si le log Netlify dit **`pnpm install`** et une erreur sur **`wd`** :

## 1. Vérifier le bon dépôt GitHub

Sur Netlify : **Site configuration ? Build & deploy ? Continuous deployment**.

Le dépôt relié doit être **`stmg-hub`** (React + Vite), pas un autre projet Vue ou ancien site.

## 2. Retirer un fichier `pnpm-lock.yaml` par erreur

Si quelqu’un a ajouté **`pnpm-lock.yaml`** sur GitHub, Netlify bascule en **pnpm**.

- Ouvre ton dépôt sur **github.com** ? regarde à la racine.
- Si tu vois **`pnpm-lock.yaml`**, supprime-le (sur GitHub ou depuis ton PC puis `push`).
- Garde uniquement **`package-lock.json`**.

## 3. Forcer l’installation avec npm dans Netlify

Dans Netlify : **Site configuration ? Build & deploy ? Build settings ? Edit settings**.

- **Install command** (commande d’installation) :  
  `npm ci`
- **Build command** : laisse ce que dit le dépôt (souvent déjà dans `netlify.toml`) ou en général :  
  `npm run build && node scripts/netlify-postbuild.cjs`

Enregistre, puis **Deploys ? Trigger deploy ? Clear cache and deploy**.

## 4. Erreur réseau / TLS (« downloadFailed »)

Parfois le registre npm est temporairement injoignable.

- Relance simplement le déploiement (**Retry**).
- Si ça persiste plusieurs fois : réessaie plus tard ou change de réseau (box / 4G).

## 5. Alternative sans Netlify : Firebase Hosting

Si Netlify continue à poser problème :

1. Sur ton PC : `npm run build`
2. `firebase login` puis `firebase use` (choisir ton projet)
3. `firebase deploy --only hosting`

Le site sera sur **`https://<ton-projet>.web.app`** (déjà configuré dans `firebase.json` avec le dossier **`dist`**).
