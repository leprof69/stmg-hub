# -*- coding: utf-8 -*-

"""Generate SDGN mission packs (chapters 1-7, 9-13) and wire Missions.tsx."""

import json

import re

from pathlib import Path



ROOT = Path(__file__).resolve().parents[1]

MISSIONS = ROOT / "src/pages/Missions.tsx"

OUT = ROOT / "src/data/sdgn/chapters"

OUT.mkdir(parents=True, exist_ok=True)

HDR = 'import type { SdgnMissionExercise } from "../types";\n\n'





def ex(ch, sid, title, diff, xp, mc, support, qs, model, etude=False):

    typ = "Etude de cas" if etude else "Exercice"

    ql = ",\n      ".join(json.dumps(q, ensure_ascii=True) for q in qs)

    return f"""  {{

    id: "sdgn{ch}-{sid}",

    title: {json.dumps(title, ensure_ascii=True)},

    type: "{typ}",

    difficulty: "{diff}",

    xp: {xp},

    minChars: {mc},

    support: {json.dumps(support, ensure_ascii=True)},

    consigne: "Reponds aux questions dans l'ordre en t'appuyant sur le support et le cours.",

    questions: [{ql}],

    correctionModele: {json.dumps(model, ensure_ascii=True)},

    attendu: "Reponses structurees, vocabulaire du chapitre, exemples tires du support.",

  }},"""





def pack(ch, items):

    diffs = ["Facile"] * 3 + ["Moyen"] * 4 + ["Difficile"] * 2 + ["Tres difficile"]

    xps = [120, 130, 140, 180, 190, 210, 230, 260, 280, 360]

    lines = [f"export const SDGN_CHAP{ch}_EXERCISES: SdgnMissionExercise[] = ["]

    for i, (sid, title, sup, qs, model) in enumerate(items[:10]):

        lines.append(ex(ch, sid, title, diffs[i], xps[i], 120 + i * 15, sup, qs, model))

    for j, (sid, title, sup, qs, model) in enumerate(items[10:12]):

        d = "Difficile" if j == 0 else "Tres difficile"

        xp = 560 if j == 0 else 620

        lines.append(ex(ch, sid, title, d, xp, 380 + j * 40, sup, qs, model, etude=True))

    lines.append("];")

    (OUT / f"chap{ch}.ts").write_text(HDR + "\n".join(lines) + "\n", encoding="utf-8")

    print("chap", ch)





def extract_7_10_11():

    lines = MISSIONS.read_text(encoding="utf-8").splitlines(keepends=True)

    for n, a, b in [(7, 140, 508), (10, 509, 1167), (11, 1167, 1483)]:

        c = "".join(lines[a:b]).replace("const SDGN_CHAP", "export const SDGN_CHAP").replace(

            ": MissionExercise[]", ": SdgnMissionExercise[]"

        )

        (OUT / f"chap{n}.ts").write_text(HDR + c, encoding="utf-8")

        print("extracted", n)





DATA = {

    1: [

        ("e1", "Action collective et organisation", "Lyceens : association sportive, statuts, numero RNA.", ["Qu'est-ce qu'une action collective organisee ?", "Pourquoi constituer une organisation ?"], "Objectifs communs, coordination, personne morale, statuts."),

        ("e2", "Finalite lucrative et non lucrative", "LVMH, Restos du Coeur, hopital public.", ["Distingue entreprise, association, organisation publique.", "But non lucratif possible pour une entreprise ?"], "Lucratif / non lucratif / service public."),

        ("e3", "Objet social", "Declaration de finalite juridique.", ["Definis objet social.", "Pourquoi le preciser ?"], "Oriente les activites autorisees."),

        ("e4", "Structure de propriete", "SA : actionnaires et AG.", ["Structure de propriete ?", "Gouvernement entreprise vs association."], "Repartition du pouvoir."),

        ("e5", "Controle dirigeants entreprise", "AG, CSE, cours de Bourse.", ["Trois modes de controle.", "Role des clients ?"], "AGO, audit, marche, CSE, achats."),

        ("e6", "Controle asso et public", "AG adherents, Cour des comptes.", ["Controle association ?", "Controle public ?"], "Membres, elus, Cour des comptes."),

        ("e7", "Personne morale", "SARL distincte du gerant.", ["Personne morale ?", "Avantage et obligation."], "Entite juridique, contrats, conformite."),

        ("e8", "Comparatif organisations", "Entreprise, asso, public.", ["Tableau but / gouvernance / controle.", "Fondation : quel type ?"], "Synthese des trois formes."),

        ("e9", "Choix du statut", "Asso loi 1901 ou SAS.", ["Criteres de choix.", "Risques d'un mauvais choix."], "Profit, gouvernance, financement."),

        ("e10", "Synthese gouvernance", "Conflit dirigeants / actionnaires.", ["Pourquoi le controle ?", "Exemple de conflit resolu."], "Alignement des interets."),

        ("cas1", "Cas : cooperative", "Cooperative agricole, AG adherents.", ["Type d'organisation ?", "Controle ?", "Avantage membres ?"], "Cooperative, AG, negociation collective."),

        ("cas2", "Cas : asso ou SAS", "App educative gratuite.", ["Comparer les formes.", "Recommandation.", "Financement et controle."], "Asso = impact social, SAS = croissance."),

    ],

    2: [

        ("e1", "Traits de personnalite", "Extraverti vs introverti.", ["Deux traits et effets.", "Trait ideal ?"], "Complementarite."),

        ("e2", "Stable vs instable", "Habitude vs changement.", ["Compare.", "Risque equipe 100% instable ?"], "Process vs innovation."),

        ("e3", "Logique vs affectif", "Tete vs coeur.", ["Quand logique en reunion ?", "Risque 100% affectif ?"], "Impulsivite."),

        ("e4", "Autonome vs soumis", "Decide seul vs suit les regles.", ["Avantage autonome.", "Role du soumis."], "Initiative vs execution."),

        ("e5", "Perception", "Mail neutre interprete differemment.", ["Perception ?", "Reduire quiproquos ?"], "Feedback, clarification."),

        ("e6", "Identite numerique", "Profil LinkedIn du candidat.", ["Identite numerique ?", "Soigner en recherche emploi ?"], "Reputation en ligne."),

        ("e7", "Emotions", "Stress avant oral client.", ["Emotion et non-verbal.", "Gerer stress ?"], "Preparation, respiration."),

        ("e8", "Stereotypes et prejuges", "Stereotype metier excluant un profil.", ["Stereotype vs prejuge.", "Consequence RH ?"], "Discrimination."),

        ("e9", "Equipe complementaire", "Planificateur + createur + communicateur.", ["Mixer personnalites ?", "Tous autonomes : risque ?"], "Roles complementaires."),

        ("e10", "Synthese", "Manager adapte son style.", ["Trois facteurs communication.", "Regle d'or manager."], "Ecouter, clarifier."),

        ("cas1", "Cas : equipe hybride", "Start-up tensions de rythme.", ["Diagnostic.", "Actions manager."], "Charte, roles, mediation."),

        ("cas2", "Cas : profil en ligne", "Stagiaire photos contestables.", ["Enjeu identite numerique.", "Conseils."], "Prive/pro, visibilite."),

    ],

    3: [

        ("e1", "Culture d'entreprise", "Valeurs et rituels partages.", ["Culture d'entreprise ?", "Risque non-integration ?"], "Quiproquos, rejet."),

        ("e2", "Communication verticale", "Note de service descendante.", ["Ascendante vs descendante.", "Note de service."], "Ordre, ecrit, impersonnel."),

        ("e3", "Communication laterale", "Deux chefs de projet meme niveau.", ["Laterale ?", "Interet."], "Coordination rapide."),

        ("e4", "Formelle vs informelle", "Rumeur avant annonce officielle.", ["Compare.", "Risque informelle."], "Rapidite vs deformation."),

        ("e5", "Numerique interne", "Intranet et RSE.", ["Role du numerique.", "Deux conditions de reussite."], "Culture, formation, charte."),

        ("e6", "Leader droit et fait", "Chef nomme vs expert respecte.", ["Droit vs fait.", "Sources autorite."], "Statut, competence, charisme."),

        ("e7", "Styles leadership", "Autocratique vs participatif.", ["Deux styles chacun.", "Quand participatif ?"], "Centralisation vs delegation."),

        ("e8", "Strategies influence", "Opposition, evitement, influence, cooperation.", ["Quatre strategies.", "Accord durable ?"], "Cooperation."),

        ("e9", "Manipulation", "Pub mensongere.", ["Manipulation vs influence.", "Exemple ethique."], "Argumentation libre."),

        ("e10", "Conformisme", "Pression du groupe.", ["Conformisme ?", "Minorite active."], "Unite vs creativite."),

        ("cas1", "Cas : rumeur usine", "Rumeur fermeture.", ["Analyse.", "Plan manager."], "Communication officielle."),

        ("cas2", "Cas : nouveau leader", "Style autocratique.", ["Effets motivation.", "Conseils salaries."], "Dialogue, CSE."),

    ],

    4: [

        ("e1", "Savoirs savoir-faire savoir-etre", "Charge clientele banque.", ["Trois composantes.", "Exemple poste."], "Connaissances, gestes, attitudes."),

        ("e2", "Approche competences", "Formation continue.", ["Trois interets organisation.", "Lien GPEC."], "Anticipation, performance."),

        ("e3", "Qualification", "Bac+5 et experience RH.", ["Competence vs qualification.", "Impact remuneration."], "Diplomes, experience."),

        ("e4", "Fiche de poste", "Communication : taches, Photoshop.", ["Role fiche de poste.", "Quatre rubriques."], "Intitule, taches, competences."),

        ("e5", "Profil de competences", "Salarie veut anglais commercial.", ["Interet salarie.", "Interet employeur."], "Projet pro, adequation poste."),

        ("e6", "Conditions de travail", "Article L4121.", ["Conditions de travail.", "Obligation employeur."], "Securite, sante."),

        ("e7", "Facteurs influence", "Nuit, bruit, stress.", ["Trois familles facteurs.", "Observer ensemble ?"], "Physiques, orga, psycho."),

        ("e8", "Acteurs QVT", "Employeur, CSE, medecine travail.", ["Role CSE.", "Medecine travail."], "Prevention, sante."),

        ("e9", "Auto-entrepreneur", "Activite complementaire.", ["Contraintes.", "Avantages."], "Isolement, flexibilite."),

        ("e10", "Conflits", "Mediation entre services.", ["Conflit au travail.", "Deux resolutions."], "Mediation, negociation."),

        ("cas1", "Cas : fiche de poste", "Recrutement commercial.", ["Rubriques.", "Competences cles."], "Fiche complete."),

        ("cas2", "Cas : burn-out", "Stress et absences.", ["Facteurs.", "Actions QVT."], "Charge, management, prevention."),

    ],

    5: [

        ("e1", "Entretien annuel", "Bilan et objectifs.", ["Quatre objectifs evaluation.", "Pourquoi stressant ?"], "Bilan, evolution, formation, QVT."),

        ("e2", "Auto-evaluation", "Salarie note ses resultats.", ["Interet.", "Limite."], "Reflexion, biais."),

        ("e3", "Tableau de bord", "CA, delais, retours.", ["Role tableau de bord.", "Indicateur activite."], "Pilotage."),

        ("e4", "Productivite horaire", "1200 unites / 400 h.", ["Formule.", "Interet manager."], "Production / heures."),

        ("e5", "Brut et net", "Brut, cotisations, net.", ["Brut vs net.", "Cout employeur."], "Charges patronales."),

        ("e6", "Primes", "Rendement, tickets resto.", ["Deux complements.", "Objectif primes."], "Motivation."),

        ("e7", "Participation interessement", "Entreprise >50 sal.", ["Difference.", "Effet collectif."], "Partage resultats."),

        ("e8", "Absentùisme", "Formule taux.", ["Absentùisme.", "Consequences."], "Couts, charge."),

        ("e9", "Turn-over", "Departs nombreux.", ["Turn-over.", "Causes."], "Fuite competences."),

        ("e10", "Cout total travail", "Recrutement, TMS.", ["Salaire seul cout ?", "Prevention."], "Couts caches."),

        ("cas1", "Cas : entretien tendu", "Objectifs non atteints.", ["Preparation manager.", "Feedback."], "Ecoute, plan."),

        ("cas2", "Cas : absentùisme", "Entrepot taux en hausse.", ["Causes.", "Indicateurs."], "Ergonomie, management."),

    ],

    6: [

        ("e1", "Big Data 5V", "Volume, velocite, variete, veracite, valeur.", ["Cite 5V.", "Defi principal."], "Traiter volume et fiabilite."),

        ("e2", "Open data", "Metropole publie transports.", ["Open data ?", "Interet."], "Transparence, reutilisation."),

        ("e3", "Donnees personnelles", "Email + IP.", ["Definis.", "Pourquoi proteger."], "Vie privee."),

        ("e4", "Donnee information connaissance", "Chiffre -> tableau de bord -> decision.", ["Trois etapes.", "Role SI."], "SI transforme la donnee."),

        ("e5", "PGI CRM", "ERP et CRM.", ["Gestion courante.", "Aide decision."], "Commandes, clients."),

        ("e6", "Qualite information", "Stock obsolete.", ["Trois caracteristiques.", "Risque."], "Pertinence, fiabilite, actualite."),

        ("e7", "RGPD", "Registre, consentement, securite.", ["Trois obligations.", "Si fuite."], "Amendes, confiance."),

        ("e8", "Finalite traitement", "Newsletter marketing.", ["Finalite ?", "Duree conservation."], "Limiter l'usage."),

        ("e9", "SI performance", "CRM cible clients.", ["Lien SI performance.", "Limite."], "Qualite donnees."),

        ("e10", "Ethique donnees", "Scoring opaque.", ["Risque ethique.", "Bonnes pratiques."], "Transparence."),

        ("cas1", "Cas : fuite RGPD", "Base clients exposee.", ["Violations.", "Plan crise."], "Notification, securite."),

        ("cas2", "Cas : open data", "Ville mobilite, startup app.", ["Chaine valeur.", "Benefice territoire."], "Innovation locale."),

    ],

    9: [

        ("e1", "Valeur percue", "Client pret a payer plus.", ["Definis.", "Vs valeur reelle."], "Subjectif."),

        ("e2", "Avantages sacrifices", "Livraison 24h vs prix.", ["Avantage et sacrifice.", "Arbitrage."], "Benefices vs couts."),

        ("e3", "Image de marque", "Scandale baisse ventes.", ["Image de marque.", "Lien performance."], "Representations mentales."),

        ("e4", "Notoriete", "Top of mind.", ["Trois indicateurs.", "Interet."], "Assistee, spontanee."),

        ("e5", "Qualite percue", "Hotline, garantie.", ["Qualite percue vs objective.", "Service associe."], "Ressenti."),

        ("e6", "Satisfaction", "Attentes vs vecu.", ["Lien fidelite.", "Si decevant ?"], "Churn."),

        ("e7", "Medias sociaux", "Communaute Instagram bio.", ["Role medias sociaux.", "Communaute."], "Proximite."),

        ("e8", "Influenceurs", "YouTubeur test produit.", ["Influenceur.", "Risque."], "Audience, bad buzz."),

        ("e9", "E-reputation", "Avis negatifs.", ["E-reputation.", "Veille."], "Reponse rapide."),

        ("e10", "KPI social", "Followers, engagement.", ["KPI quanti vs quali.", "Decision marketing."], "Ajuster campagne."),

        ("cas1", "Cas : bad buzz", "Video virale negative.", ["Impact valeur percue.", "Plan com."], "Reponse, SAV."),

        ("cas2", "Cas : repositionnement", "Marque jeune -> seniors.", ["Leviers.", "Indicateurs."], "Design, preuve qualite."),

    ],

    12: [

        ("e1", "Prix cout marge", "PV 100, cout 60, marge 40.", ["Formule.", "Prix > cout ?"], "Marge = PV - cout."),

        ("e2", "Marge commerciale", "Negociant achat revente.", ["Marge commerciale.", "Taux marge."], "PV - PA."),

        ("e3", "Cout de revient", "Charges affectees au produit.", ["Cout de revient.", "Interet."], "Fixer prix."),

        ("e4", "Baisse des prix", "Concurrence -10%, couts constants.", ["Effet marge.", "Performance financiere ?"], "Marge baisse, volumes."),

        ("e5", "Qualite et cout", "Qualite elevee = cout eleve.", ["Lien qualite cout.", "Arbitrage."], "Pas tout avoir."),

        ("e6", "Concurrence", "Produits homogenes.", ["Role concurrence.", "Prix trop haut ?"], "Clients partent."),

        ("e7", "Saisonnalite", "Billets avion ete.", ["Saisonnalite.", "Strategie prix."], "Prix dynamiques."),

        ("e8", "Innovation Apple", "Prix premium.", ["Strategie innovation.", "Marge et volume."], "Differentiation."),

        ("e9", "Maitrise couts", "Hausse energie.", ["Maitrisables vs contraintes.", "Action."], "Optimiser process."),

        ("e10", "Marge totale", "Prix up, volumes down.", ["Unitaire vs totale.", "Piege."], "Surveiller quantites."),

        ("cas1", "Cas : guerre prix", "Concurrent -15%.", ["Suivre ?", "Qualite ?"], "Part de marche vs marge."),

        ("cas2", "Cas : nouveau produit", "Cout 45, concurrence 79.", ["Fourchette prix.", "Marge cible."], "Entre cout et marche."),

    ],

    13: [

        ("e1", "Definition performance", "Atteinte objectifs.", ["Performance ?", "Efficient vs efficace."], "Objectifs, ressources."),

        ("e2", "Objectifs mesurables", "CA +5% en 12 mois.", ["Qualites objectif.", "Exemple quanti."], "Mesurable, temporel."),

        ("e3", "Performance commerciale", "Unites, CA, part marche.", ["Trois indicateurs.", "Part de marche."], "Quantites, CA."),

        ("e4", "Evolution CA", "2,1M vs 1,9M.", ["Calcul evolution.", "Conclusion."], "+10,5%."),

        ("e5", "Fidelite", "Carte fidelite.", ["Fidelite.", "Lien com."], "Rachats."),

        ("e6", "Rentabilite", "Profit / capitaux propres.", ["Rentabilite.", "Actionnaires."], "Rendement investis."),

        ("e7", "Profitabilite", "Resultat / CA.", ["Rentabilite vs profitabilite.", "Axe."], "Activite vs fonds."),

        ("e8", "Dividendes autofinancement", "Benefice reparti.", ["Dividendes.", "Autofinancement."], "Actionnaires, investissement."),

        ("e9", "Performances contradictoires", "Marge up, satisfaction down.", ["Contradictions ?", "Arbitrage."], "Priorites strategiques."),

        ("e10", "Comparaison espace-temps", "Benchmark et 3 ans.", ["Espace.", "Temps."], "Concurrents, tendance."),

        ("cas1", "Cas : tableau de bord", "CA up, part marche down.", ["Interpretation.", "Decision."], "Marche croit plus vite."),

        ("cas2", "Cas : objectifs acteurs", "Dividendes vs hausses salaires.", ["Contraintes.", "Compromis."], "Negociation repartition."),

    ],

}





def patch_missions():

    lines = MISSIONS.read_text(encoding="utf-8").splitlines(keepends=True)

    insert = [

        'import type { SdgnMissionExercise } from "../data/sdgn/types";\n',

        'import {\n',

        '  detectSdgnChapterNumber,\n',

        '  getSdgnChapterBlurb,\n',

        '  getSdgnExercises,\n',

        '  getSdgnProgressLabel,\n',

        '} from "../data/sdgn/registry";\n',

        '\n',

        'type MissionExercise = SdgnMissionExercise;\n',

        '\n',

    ]

    new = lines[:140] + insert + lines[1483:]

    MISSIONS.write_text("".join(new), encoding="utf-8")

    print("patched Missions.tsx")





def write_registry():

    reg = '''import type { SdgnMissionChapter, SdgnMissionExercise } from "./types";

import { SDGN_CHAP1_EXERCISES } from "./chapters/chap1";

import { SDGN_CHAP2_EXERCISES } from "./chapters/chap2";

import { SDGN_CHAP3_EXERCISES } from "./chapters/chap3";

import { SDGN_CHAP4_EXERCISES } from "./chapters/chap4";

import { SDGN_CHAP5_EXERCISES } from "./chapters/chap5";

import { SDGN_CHAP6_EXERCISES } from "./chapters/chap6";

import { SDGN_CHAP7_EXERCISES } from "./chapters/chap7";

import { SDGN_CHAP9_EXERCISES } from "./chapters/chap9";

import { SDGN_CHAP10_EXERCISES } from "./chapters/chap10";

import { SDGN_CHAP11_EXERCISES } from "./chapters/chap11";

import { SDGN_CHAP12_EXERCISES } from "./chapters/chap12";

import { SDGN_CHAP13_EXERCISES } from "./chapters/chap13";



export const SDGN_EXERCISES_BY_CHAPTER: Record<SdgnMissionChapter, SdgnMissionExercise[]> = {

  1: SDGN_CHAP1_EXERCISES,

  2: SDGN_CHAP2_EXERCISES,

  3: SDGN_CHAP3_EXERCISES,

  4: SDGN_CHAP4_EXERCISES,

  5: SDGN_CHAP5_EXERCISES,

  6: SDGN_CHAP6_EXERCISES,

  7: SDGN_CHAP7_EXERCISES,

  9: SDGN_CHAP9_EXERCISES,

  10: SDGN_CHAP10_EXERCISES,

  11: SDGN_CHAP11_EXERCISES,

  12: SDGN_CHAP12_EXERCISES,

  13: SDGN_CHAP13_EXERCISES,

};



export const SDGN_CHAPTER_LABELS: Record<SdgnMissionChapter, string> = {

  1: "Types d'organisation",

  2: "Identite et fonctionnement de l'individu",

  3: "Individu dans l'organisation",

  4: "Activite de travail",

  5: "Evaluation et retribution",

  6: "Technologies et information",

  7: "Technologies numeriques collaboratives",

  9: "Valeur percue",

  10: "Valeur financiere et boursiere",

  11: "Valeur ajoutee et partenariale",

  12: "Prix, cout et marge",

  13: "Performance commerciale et financiere",

};



export function normalizeChapterTitle(value = ""): string {

  return String(value)

    .toLowerCase()

    .normalize("NFD")

    .replace(/[\\u0300-\\u036f]/g, "")

    .trim();

}



const SUPPORTED: SdgnMissionChapter[] = [1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13];



export function detectSdgnChapterNumber(

  chapitre: { ordre?: number; titre?: string } | null,

  matiere: string

): SdgnMissionChapter | null {

  if (matiere !== "Sciences de Gestion" || !chapitre) return null;

  const ordre = chapitre.ordre;

  if (ordre != null && ordre in SDGN_EXERCISES_BY_CHAPTER) return ordre as SdgnMissionChapter;

  const t = normalizeChapterTitle(chapitre.titre || "");

  for (const n of SUPPORTED) {

    if (t.includes(`chapitre ${n}`) || t.startsWith(`${n} `) || t.startsWith(`${n}.`)) return n;

  }

  return null;

}



export function getSdgnExercises(chapter: SdgnMissionChapter): SdgnMissionExercise[] {

  return SDGN_EXERCISES_BY_CHAPTER[chapter] ?? [];

}



export function getSdgnProgressLabel(chapter: SdgnMissionChapter): string {

  return `SDGN Chapitre ${chapter}`;

}



export function getSdgnChapterBlurb(chapter: SdgnMissionChapter): string {

  return `Pack complet : 10 exercices progressifs + 2 etudes de cas ù ${SDGN_CHAPTER_LABELS[chapter]}.`;

}

'''

    (ROOT / "src/data/sdgn/registry.ts").write_text(reg, encoding="utf-8")

    print("registry")





def write_catalog():
    title_re = re.compile(
        r'id: "(sdgn\d+-(?:e\d+|cas\d+))"[\s\S]*?title: ("(?:\\.|[^"\\])*")[\s\S]*?xp: (\d+)'
    )
    entries = []
    for ch in [1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13]:
        text = (OUT / f"chap{ch}.ts").read_text(encoding="utf-8")
        for m in title_re.finditer(text):
            tid, tit, xp = m.group(1), json.loads(m.group(2)), int(m.group(3))
            entries.append((tid, tit, xp, ch))

    lines = [

        "/** Genere par scripts/generate_sdgn_missions.py */",

        "export const SDGN_MISSIONS_PROGRESS_VERSION = 1 as const;",

        "export type SdgnMissionMeta = { title: string; chapter: string; xpMax: number };",

        "export const SDGN_MISSION_BY_ID: Record<string, SdgnMissionMeta> = {",

    ]

    for tid, tit, xp, ch in entries:
        lines.append(
            f'  "{tid}": {{ title: {json.dumps(tit, ensure_ascii=True)}, '
            f'chapter: "SDGN Chapitre {ch}", xpMax: {xp} }},'
        )

    lines += [

        "};",

        "const ORDER_INDEX: Record<string, number> = Object.fromEntries(Object.keys(SDGN_MISSION_BY_ID).map((id, i) => [id, i]));",

        "export function getSdgnMissionMeta(exerciseId: string): SdgnMissionMeta {",

        '  return SDGN_MISSION_BY_ID[exerciseId] ?? { title: exerciseId, chapter: "Mission SDGN", xpMax: 0 };',

        "}",

        "export function compareSdgnExerciseIds(a: string, b: string): number {",

        "  return (ORDER_INDEX[a] ?? 9999) - (ORDER_INDEX[b] ?? 9999);",

        "}",

    ]

    (ROOT / "src/data/sdgnMissionCatalog.ts").write_text("\n".join(lines) + "\n", encoding="utf-8")

    print("catalog", len(entries))





def main():

    extract_7_10_11()

    for ch, items in DATA.items():

        pack(ch, items)

    write_registry()

    patch_missions()

    write_catalog()





if __name__ == "__main__":

    main()

