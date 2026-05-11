# Si Netlify parle de « pnpm » ou du paquet « wd »

Le projet **STMG HUB** utilise **`npm`** et **`package-lock.json`**. Pas de `pnpm`, pas de paquet `wd`.

## 1. Verifier le bon depot GitHub

Netlify : **Site configuration ? Build & deploy ? Continuous deployment**. Le depot doit etre **stmg-hub** (Vite + React).

## 2. Retirer `pnpm-lock.yaml` si present

S'il existe a la racine sur GitHub, Netlify peut passer en pnpm. Garde seulement **`package-lock.json`**.

## 3. Installer avec npm sur Netlify

**Site configuration ? Build & deploy ? Build settings** :

- **Install command** : `npm ci` (ou laisser vide si Netlify detecte le lockfile)
- **Build command** : celui du depot (`netlify.toml`) : `npm run build && node scripts/netlify-postbuild.cjs`

Puis **Deploys ? Trigger deploy ? Clear cache and deploy** si besoin.

## 4. Reseau / TLS (« downloadFailed »)

Reessaie **Retry** sur le deploy, ou plus tard.

## 5. « Command was cancelled » alors que Vite a reussi dans le log

Ca ne veut pas dire qu'il faut des **secrets GitHub** : le deploiement **normal** reste **Netlify relie au repo + push sur la branche de production** — **aucun** secret dans GitHub **Settings ? Actions** n'est requis pour ca.

Souvent Netlify annule un build si **un autre deploy** demarre pour le meme site (deux push rapproches, redeploy manuel, etc.). Regarde la liste **Deploys**.

En secours depuis ton PC : `npm run build` puis `npx netlify-cli deploy --prod --dir=dist`.

## 6. Alternative : Firebase Hosting

`npm run build` puis `firebase deploy --only hosting` (dossier `dist` dans `firebase.json`).
