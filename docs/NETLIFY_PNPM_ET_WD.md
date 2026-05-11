# Si Netlify parle de « pnpm » ou du paquet « wd »

Le projet **STMG HUB** sur ton PC utilise **`npm`** et un fichier **`package-lock.json`**. Il n'utilise **pas** `pnpm` et il n'y a **pas** le paquet `wd` dans les dependances.

Si le log Netlify dit **`pnpm install`** et une erreur sur **`wd`** :

## 1. Verifier le bon depot GitHub

Sur Netlify : **Site configuration ? Build & deploy ? Continuous deployment**.

Le depot relie doit etre **`stmg-hub`** (React + Vite), pas un autre projet Vue ou ancien site.

## 2. Retirer un fichier `pnpm-lock.yaml` par erreur

Si quelqu'un a ajoute **`pnpm-lock.yaml`** sur GitHub, Netlify bascule en **pnpm**.

- Ouvre ton depot sur **github.com** : regarde a la racine.
- Si tu vois **`pnpm-lock.yaml`**, supprime-le (sur GitHub ou depuis ton PC puis `push`).
- Garde uniquement **`package-lock.json`**.

## 3. Forcer l'installation avec npm dans Netlify

Dans Netlify : **Site configuration ? Build & deploy ? Build settings ? Edit settings**.

- **Install command** : `npm ci`
- **Build command** : laisse ce que dit le depot (`netlify.toml`) ou en general :  
  `npm ci && npm run build && node scripts/netlify-postbuild.cjs`

Enregistre, puis **Deploys ? Trigger deploy ? Clear cache and deploy**.

## 4. Erreur reseau / TLS (« downloadFailed »)

Parfois le registre npm est temporairement injoignable.

- Relance simplement le deploiement (**Retry**).
- Si ca persiste plusieurs fois : reessaie plus tard ou change de reseau (box / 4G).

## 5. Build Netlify annule (« Command was cancelled ») alors que le build Vite a reussi

Souvent : **deux deploiements en meme temps** (push Git + deploiement manuel, ou deux webhooks, ou build Netlify + autre outil). Netlify peut **annuler** le premier sans message detaille.

**Option fiable (recommandee)** : deploiement avec **GitHub Actions** comme en local (`netlify deploy --prod --dir=dist`), fichier **`.github/workflows/deploy-netlify.yml`**.

1. Sur **GitHub** (depot `stmg-hub`) : **Settings ? Secrets and variables ? Actions**
   - `NETLIFY_AUTH_TOKEN` : Netlify ? **User settings ? Applications ? Personal access tokens**
   - `NETLIFY_SITE_ID` : **Site settings ? Site details ? Site ID**
2. Pousse sur **`main`** : l'onglet **Actions** doit montrer le workflow **Deploy Netlify (production)** en vert.
3. Pour eviter les doubles deploiements : sur **Netlify**, **Deploys ? Pause builds** (ou une seule source : soit le build Netlify depuis Git, soit ce workflow — pas les deux en concurrence).

## 6. Alternative sans Netlify : Firebase Hosting

Si Netlify continue a poser probleme :

1. Sur ton PC : `npm run build`
2. `firebase login` puis `firebase use` (choisir ton projet)
3. `firebase deploy --only hosting`

Le site sera sur **`https://<ton-projet>.web.app`** (deja configure dans `firebase.json` avec le dossier **`dist`**).
