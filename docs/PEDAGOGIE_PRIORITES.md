# Feuille de route pédagogique — STMG HUB

Document de référence pour reprendre les priorités **point par point** avec le product owner.
Dernière mise à jour : décisions du 23 mai 2026.

---

## Priorité 1 — Cohérence UI / Défis (en cours)

### Décisions validées

| Sujet | Décision |
|--------|----------|
| Ancienne page **Focus** | Renommée conceptuellement en **Défis** (fichier `Focus.tsx` ? à renommer / router quand la page sera livrée) |
| Objectif **Défis** | Proposer à l'élève de valider des objectifs liés au **programme STMG** : du défi quotidien très simple au défi très complexe |
| Dashboard — routine quotidienne | **Supprimée** (plus de 3/3, plus de « Focus validée », plus de « 1 mission soumise ») |
| Dashboard — mission de la semaine | **Supprimée** (remplacée à terme par l'accès **Défis**, pas par une « mission hebdo ») |

### À faire ensuite (point 1, suite)

- [ ] Créer la page **Défis** dans la navigation (`App.tsx`)
- [ ] Migrer / réécrire le contenu actuel de `Focus.tsx` vers le modèle « défis » (quotidien ? complexe)
- [ ] Firestore : décider si `focusProgress` devient `defisProgress` (migration ou alias)
- [ ] Admin reporting : colonne / filtres « Focus » ? « Défis »

### Fait (UI Dashboard)

- [x] Retrait bloc « Routine quotidienne »
- [x] Retrait bloc « Mission de la semaine »

---

## Priorité 2 — Contenu matières & Missions / QCM

### Décisions validées

- Le PO **ajoute progressivement les cours** de toutes les matières STMG.
- Objectif technique : alimenter **Missions** (exercices rédigés) et **banques QCM** (jeux, Mot mystère, etc.) au fil des imports.
- Pas d'obligation d'afficher toutes les matières comme « complètes » avant livraison : croissance par paliers.

### À faire ensuite (point 2)

- [ ] Pipeline d'import cours ? notions ? exercices (par matière)
- [ ] Étendre `missionPack` / registries au-delà de SDGN + Management
- [ ] Étendre `gameQcmPool` (Management Terminale, puis autres matières)

---

## Priorité 3 — Dashboard & engagement

### Décisions validées

- Plus de **mission de la semaine** sur le Dashboard.
- L'engagement quotidien passera par **Défis** (priorité 1), pas par une routine 3/3.

### Fait

- [x] Bloc mission de la semaine retiré

---

## Priorité 4 — Chapitres vs Missions

### Décision validée (clarification PO)

- **Deux univers séparés à l'UI** : OK.
  - **Chapitres** : ressources, liens, fiches, applications.
  - **Missions** : entraînement rédigé, correction, notes en lettres.
- **Cohérence données** : même référentiel matières / chapitres / notions (Firestore `chapitres` + packs TS alignés sur `ordre`).
- Ce n'est **pas** un problème produit tant que les métadonnées restent alignées ; pas de fusion forcée des pages.

### À faire ensuite (optionnel, pas bloquant)

- [ ] Deep links Chapitre N ? Missions ch. N (confort navigation, pas fusion)

---

## Priorités 5 à 8 — À traiter plus tard

Référence analyse initiale ; ordre et périmètre à revalider avec le PO :

| # | Thème | Rappel |
|---|--------|--------|
| 5 | Évaluation | Grille avant envoi, modèle par question, feedback par notion |
| 6 | Parcours | Déblocage moins bloquant, page « À retravailler », lien Objectif Bac |
| 7 | Prof / classe | Assignations, exports, vue classe par chapitre |
| 8 | Accessibilité | Taille police, brouillon sauvegardé, etc. |

---

## Fichiers liés

| Fichier | Rôle |
|---------|------|
| `src/pages/Dashboard.tsx` | Accueil élève (routine / mission hebdo retirés) |
| `src/pages/Focus.tsx` | Ancien Focus ? future page **Défis** |
| `src/pages/Missions.tsx` | Exercices rédigés |
| `src/pages/Chapitres.tsx` | Ressources par chapitre |
| `src/App.tsx` | Navigation (ajouter Défis) |
