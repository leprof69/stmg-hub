# Guide pas à pas — faire fonctionner le site sur Internet (Netlify)

Ce document est pour quelqu’un qui **n’est pas développeur**. L’idée : ton site marche **sur ton ordinateur**, et tu veux la **même chose visible par tout le monde** via une adresse du type `quelque-chose.netlify.app`.

Les mots un peu techniques sont expliqués **entre parenthèses** la première fois.

---

## Avant de commencer — deux idées à retenir

1. **Ton fichier `.env` sur le PC**  
   Il contient des **clés secrètes** (mot de passe technique pour Firebase, Groq, etc.).  
   Il **ne doit jamais** être envoyé sur GitHub : il reste **uniquement sur ton ordinateur**.

2. **Le site « distant » (sur Internet)**  
   Netlify va **fabriquer** ton site à partir du code sur GitHub. Au moment où elle fabrique (`build`), elle doit **connaître les mêmes informations** que ton `.env`, mais **copiées dans son tableau de bord** (pas dans un fichier dans le projet).

Si cette copie manque ou est fausse, le site en ligne peut être **blanc**, **orange avec un message**, ou **cassé**, alors qu’en local tout va bien.

---

## Étape 1 — Vérifier que ça marche chez toi

1. Ouvre un **terminal** dans le dossier du projet `stmg-hub`.
2. Lance : `npm run dev`
3. Ouvre le lien affiché (souvent `http://localhost:3000` ou `5173`).
4. Si tu peux te connecter et utiliser l’app **sans erreur**, tu passes à l’étape 2.

Si ça ne marche pas en local, corrige d’abord ça (`.env` rempli, etc.) avant de déployer.

---

## Étape 2 — Avoir le code sur GitHub

1. Ton projet doit être sur **GitHub** (compte `leprof69` / dépôt `stmg-hub` ou équivalent).
2. Quand tu modifies le site et que tu veux le mettre en ligne, l’habitude est : **envoyer les changements sur GitHub** (`push`).  
   Netlify peut être réglée pour **reconstruire le site automatiquement** à chaque envoi sur la branche `main`.

*(Si tu ne fais pas les `push` toi-même, la personne qui s’occupe du code doit le faire.)*

---

## Étape 3 — Lier Netlify à GitHub (une fois)

1. Va sur [netlify.com](https://www.netlify.com) et connecte-toi.
2. **Add new site** ? **Import an existing project**.
3. Choisis **GitHub** et autorise Netlify à voir tes dépôts.
4. Sélectionne le dépôt **stmg-hub** (ou le bon nom).
5. Netlify te propose des réglages de **build** (construction du site). Configure comme suit :

| Réglage | Valeur à mettre |
|--------|------------------|
| **Build command** | `npm run build` |
| **Publish directory** (répertoire à publier) | `dist` |

**Important :** ce n’est **pas** le dossier `build`. Pour ce projet, le bon dossier est **`dist`** (c’est ce que l’outil **Vite** produit).

6. Valide pour créer le site.

---

## Étape 4 — Mettre les « variables d’environnement » sur Netlify

C’est **l’étape la plus importante** pour éviter la page blanche ou un message d’erreur.

1. Sur Netlify : ouvre **ton site** ? **Site configuration** (ou **Project configuration**).
2. Va dans **Environment variables** (variables d’environnement).
3. Pour **chaque ligne** de ton fichier `.env` local qui commence par **`VITE_`**, crée une variable **avec exactement le même nom** et **la même valeur** que sur ton PC.

Exemple de noms (à reprendre depuis ton `.env` réel, pas ce fichier) :

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- et si tu les utilises : `VITE_GROQ_API_KEY`, `VITE_GEMINI_API_KEY`, `VITE_DS_ACCESS_CODE`

4. Si Netlify demande **pour quels usages** la variable s’applique, assure-toi que **Build** (construction) est inclus — sans ça, le site fabriqué n’a pas les clés.

5. Enregistre.

**À ne pas faire :** ne pas utiliser de vieux noms du type `REACT_APP_...` pour ce projet : ici tout passe par **`VITE_`**.

---

## Étape 5 — Utiliser une version récente de Node sur Netlify

Le projet utilise **Vite 6**, qui demande **Node 18 au minimum** (souvent **Node 20** sur Netlify).

Si le déploiement échoue avec un message du type *Node.js v18 or higher is required* :

1. Dans **Site configuration** ? **Environment variables**, ajoute :
   - **Clé :** `NODE_VERSION`  
   - **Valeur :** `20`
2. Ou, si un fichier `.nvmrc` avec `20` existe à la racine du projet sur GitHub, Netlify peut s’en servir aussi.

---

## Étape 6 — Autoriser ton adresse Netlify dans Firebase

Sinon la **connexion** (Google, email) peut refuser sur le site en ligne.

1. Va sur [Firebase Console](https://console.firebase.google.com).
2. Sélectionne **ton projet** (le même que dans ton `.env`).
3. Menu **Authentication** ? **Settings** (Paramètres) ? **Authorized domains**.
4. Ajoute ton domaine Netlify, par exemple : `ton-site.netlify.app`  
   (remplace par **ton** sous-domaine exact).

---

## Étape 7 — Lancer un déploiement propre

1. Dans Netlify : **Deploys**.
2. **Trigger deploy** ? **Deploy project without cache** (déployer **sans cache**), surtout **la première fois** après avoir ajouté les variables.

Attends que le statut soit **Published** (publié) ou équivalent **succès**.

3. Ouvre l’URL du site (bouton **Open production deploy** ou l’adresse `https://…netlify.app`).

---

## Étape 8 — Si ça ne marche toujours pas

1. Ouvre le site en **navigation privée** ou fais un rechargement forcé (**Ctrl+F5**) pour éviter d’afficher une vieille version.
2. Dans Netlify, ouvre le **dernier déploiement** ? **Deploy log**. Descends **tout en bas** : les lignes **rouges** ou le mot **Error** indiquent souvent la cause (mauvais dossier, Node trop vieux, build qui échoue, etc.).
3. Vérifie encore une fois : **Publish directory = `dist`**, variables **`VITE_`** présentes pour le **build**, **NODE_VERSION 20** si besoin, domaine Netlify dans **Firebase**.

---

## Les variables sont sur Netlify mais la page dit encore « configuration incomplète » / Firebase vide

Souvent ce n’est pas ta faute : le code doit lire les variables en **`import.meta.env.VITE_…` écrites en toutes lettres** dans le fichier (pas `import.meta.env[uneVariable]`). Sinon, au moment du build sur Netlify, Vite ne peut pas les injecter dans le site — résultat : écran bizarre alors que les variables existent dans le tableau Netlify. Le fichier `src/services/firebase.ts` du dépôt est réglé pour ça ; après un **redeploy sans cache**, ça doit matcher.

---

## Erreur Netlify « Secrets scanning » + `VITE_FIREBASE_PROJECT_ID`

Si le log dit que la valeur est aussi dans `package.json` : c’est souvent parce que le **nom du projet Firebase** est le même que le nom du paquet npm (`"name": "stmg-hub"`). Ce n’est pas une vraie fuite. Le fichier **`netlify.toml`** à la racine du dépôt contient une ligne pour ignorer ce faux positif — il faut **pousser ce fichier sur GitHub** pour que Netlify l’utilise.

---

## Rappel ultra court (liste de contrôle)

- [ ] Ça marche en local (`npm run dev`).
- [ ] Code à jour sur GitHub.
- [ ] Netlify : `npm run build` + publier **`dist`**.
- [ ] Netlify : toutes les variables **`VITE_...`** comme dans ton `.env`, utilisables au **build**.
- [ ] Netlify : **Node 20** si le log le demande.
- [ ] Firebase : domaine **`xxx.netlify.app`** autorisé.
- [ ] Redéploiement **sans cache** après changement des variables.

---

## Alternative (si Netlify te prend trop la tête)

Tu peux publier le même dossier **`dist`** avec **Firebase Hosting** (commande `firebase deploy --only hosting` après `npm run build`), si ton projet Firebase est déjà configuré. Ce n’est pas obligatoire si Netlify fonctionne.

---

*Document rédigé pour être lu étape par étape. Tu peux l’imprimer ou le garder ouvert pendant que tu cliques dans Netlify et Firebase.*
