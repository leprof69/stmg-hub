# -*- coding: utf-8 -*-
"""Generate rich Management chapters 6-10 (SDGN chap1 quality)."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "src/data/management/chapters"
HDR = 'import type { ManagementMissionExercise } from "../types";\n\n'
DIFFS = ["Facile"] * 3 + ["Moyen"] * 4 + ["Difficile"] * 2 + ["Tres difficile"]
XPS = [120, 130, 140, 180, 190, 210, 230, 260, 280, 360]


def ts(value: str) -> str:
    return json.dumps(value, ensure_ascii=True)


def ex(ch, sid, title, diff, xp, mc, support, consigne, questions, correction, attendu, etude=False):
    typ = "Etude de cas" if etude else "Exercice"
    ql = ",\n      ".join(ts(q) for q in questions)
    return f"""  {{
    id: "mgt{ch}-{sid}",
    title: {ts(title)},
    type: "{typ}",
    difficulty: "{diff}",
    xp: {xp},
    minChars: {mc},
    support: {ts(support)},
    consigne: {ts(consigne)},
    questions: [
      {ql}
    ],
    correctionModele: {ts(correction)},
    attendu: {ts(attendu)},
  }},"""


def write_ch(ch, items):
    lines = [f"export const MANAGEMENT_CHAP{ch}_EXERCISES: ManagementMissionExercise[] = ["]
    mc = [120, 140, 150, 160, 180, 180, 200, 220, 240, 260]
    for i, it in enumerate(items[:10]):
        lines.append(ex(ch, it["sid"], it["title"], DIFFS[i], XPS[i], mc[i], **{k: it[k] for k in ("support", "consigne", "questions", "correction", "attendu")}))
    for j, it in enumerate(items[10:12]):
        diff = "Difficile" if j == 0 else "Tres difficile"
        xp = 560 if j == 0 else 620
        mc2 = 400 if j == 0 else 450
        lines.append(ex(ch, it["sid"], it["title"], diff, xp, mc2, etude=True, **{k: it[k] for k in ("support", "consigne", "questions", "correction", "attendu")}))
    lines.append("];")
    (OUT / f"chap{ch}.ts").write_text(HDR + "\n".join(lines) + "\n", encoding="utf-8")
    print(f"chap{ch}.ts ({len(items)} exercises)")


CH6 = [
    dict(
        sid="e1", title="Co\u00fbts fixes et co\u00fbts variables",
        support="Le restaurant Caf\u00e9Rouge, situ\u00e9 sur les quais \u00e0 Bordeaux, r\u00e9alise un chiffre d'affaires annuel de 2,4 M\u20ac pour 38 salari\u00e9s. Le directeur financier classe ses charges : loyer mensuel de 8 500 \u20ac (contrat ferme), assurance et abonnements 1 200 \u20ac/mois, amortissement \u00e9quipement cuisine 45 000 \u20ac/an. Les charges variables repr\u00e9sentent 28 % du CA pour les mati\u00e8res premi\u00e8res et 32 % pour la masse salariale variable (heures suppl\u00e9mentaires, extras week-end). En octobre 2025, malgr\u00e9 une hausse du nombre de couverts (+6 %), le r\u00e9sultat baisse car les co\u00fbts fixes (loyer r\u00e9vis\u00e9 +4 %) augmentent alors que l'activit\u00e9 reste sous le seuil de rentabilit\u00e9.",
        consigne="\u00c0 partir du support, distingue charges fixes et charges variables et explique pourquoi cette classification est utile au contr\u00f4le des co\u00fbts.",
        questions=[
            "D\u00e9finis charges fixes et charges variables selon le cours.",
            "Classe au moins cinq charges du support en fixes ou variables.",
            "Pourquoi une hausse d'activit\u00e9 n'am\u00e9liore-t-elle pas toujours le r\u00e9sultat ?",
        ],
        correction="1) Charges fixes : support\u00e9es quelle que soit l'activit\u00e9 (loyer, assurance, amortissements). Charges variables : \u00e9voluent avec les volumes (mati\u00e8res, heures sup).\n\n2) Fixes : loyer 8 500 \u20ac/mois, assurance 1 200 \u20ac/mois, amortissement 45 000 \u20ac/an. Variables : mati\u00e8res 28 % CA, masse variable 32 % CA (extras, week-end).\n\n3) Tant que le CA reste sous le seuil de rentabilit\u00e9, les charges fixes ne sont pas couvertes. Une hausse mod\u00e9r\u00e9e du CA (+6 % couverts) peut \u00eatre insuffisante si les co\u00fbts fixes augmentent (+4 % loyer) et que la marge sur co\u00fbts variables ne compense pas.",
        attendu="D\u00e9finitions pr\u00e9cises, classification chiffr\u00e9e, lien activit\u00e9/r\u00e9sultat.",
    ),
    dict(
        sid="e2", title="Seuil de rentabilit\u00e9 (SR)",
        support="Pour Caf\u00e9Rouge, les charges fixes annuelles s'\u00e9l\u00e8vent \u00e0 180 000 \u20ac (loyer, assurances, amortissements, charges de structure). Le taux de marge sur co\u00fbts variables est de 42 % : sur 100 \u20ac de CA, 58 \u20ac couvrent les co\u00fbts variables et 42 \u20ac contribuent \u00e0 couvrir les charges fixes. La formule SR = CF / taux de marge donne 180 000 / 0,42 \u2248 428 571 \u20ac de CA annuel. En 2025, le CA r\u00e9alis\u00e9 est de 2 400 000 \u20ac, soit largement au-dessus du SR. Pourtant le r\u00e9sultat net est n\u00e9gatif (-12 000 \u20ac) en raison d'\u00e9carts sur charges non int\u00e9gr\u00e9s au calcul (p\u00e9nalit\u00e9s, gaspillage).",
        consigne="Explique la notion de seuil de rentabilit\u00e9 et calcule-le \u00e0 partir du support. Pr\u00e9cise ses limites.",
        questions=[
            "Qu'est-ce que le seuil de rentabilit\u00e9 ? \u00c0 quoi sert-il ?",
            "Calcule et interpr\u00e8te le SR de Caf\u00e9Rouge.",
            "Pourquoi le CA d\u00e9passe-t-il le SR mais le r\u00e9sultat reste-t-il n\u00e9gatif ?",
        ],
        correction="1) Le SR est le niveau de CA o\u00f9 le r\u00e9sultat est nul : les charges variables et fixes sont exactement couvertes. Outil d'aide \u00e0 la d\u00e9cision (viabilit\u00e9, objectifs commerciaux).\n\n2) SR = 180 000 / 0,42 \u2248 428 571 \u20ac. Caf\u00e9Rouge d\u00e9passe ce seuil (2,4 M\u20ac), donc la structure th\u00e9orique est rentable.\n\n3) Le SR suppose des co\u00fbts bien class\u00e9s et stables. Ici, \u00e9carts (gaspillage, p\u00e9nalit\u00e9s) et charges non pr\u00e9vues d\u00e9gradent le r\u00e9sultat r\u00e9el malgr\u00e9 un CA \u00e9lev\u00e9.",
        attendu="Formule SR, calcul, interpr\u00e9tation et limites de l'outil.",
    ),
    dict(
        sid="e3", title="Marge sur co\u00fbts variables",
        support="Caf\u00e9Rouge analyse son menu du midi : ticket moyen 22 \u20ac, co\u00fbt variable unitaire (mati\u00e8res + main-d'\u0153uvre variable) de 12,80 \u20ac. La marge unitaire sur co\u00fbts variables est donc de 9,20 \u20ac (22 \u2212 12,80). Sur le menu du soir (ticket moyen 38 \u20ac, co\u00fbt variable 15,40 \u20ac), la marge unitaire atteint 22,60 \u20ac. Le directeur souhaite promouvoir le menu du soir pour am\u00e9liorer la couverture des charges fixes, car chaque couvert suppl\u00e9mentaire apporte davantage \u00e0 la marge globale.",
        consigne="Mobilise la m\u00e9thode des co\u00fbts sp\u00e9cifiques et la marge sur co\u00fbts variables pour analyser la rentabilit\u00e9 des deux menus.",
        questions=[
            "D\u00e9finis marge sur co\u00fbts variables (MCV) et taux de marge.",
            "Compare la MCV des menus midi et soir du support.",
            "Quelle strat\u00e9gie commerciale en d\u00e9duis-tu pour Caf\u00e9Rouge ?",
        ],
        correction="1) MCV = CA \u2212 co\u00fbts variables. Taux de marge = MCV / CA. Elle mesure la contribution de chaque vente \u00e0 la couverture des charges fixes.\n\n2) Midi : marge 9,20 \u20ac (taux 41,8 %). Soir : marge 22,60 \u20ac (taux 59,5 %). Chaque couvert du soir contribue 2,5\u00d7 plus \u00e0 couvrir les CF.\n\n3) Promouvoir le service du soir (formules, \u00e9v\u00e9nements) pour augmenter la MCV globale et r\u00e9duire le nombre de couverts n\u00e9cessaires au SR.",
        attendu="Calcul MCV, comparaison chiffr\u00e9e, recommandation argument\u00e9e.",
    ),
    dict(
        sid="e4", title="Point mort en couverts",
        support="Avec un SR de 428 571 \u20ac et un ticket moyen de 22 \u20ac (menu midi dominant), Caf\u00e9Rouge doit servir environ 19 480 couverts par an pour atteindre le point mort, soit 53 couverts par jour ouvr\u00e9 (365 jours). En r\u00e9alit\u00e9, le ticket moyen pond\u00e9r\u00e9 est de 28 \u20ac (mix midi/soir). Le point mort recalcul\u00e9 tombe \u00e0 15 306 couverts/an, soit 42 couverts/jour. Le restaurant sert en moyenne 78 couverts/jour mais conna\u00eet une forte saisonnalit\u00e9 : 45/jour en janvier, 110/jour en juillet.",
        consigne="Traduis le seuil de rentabilit\u00e9 en point mort (unit\u00e9s physiques) et analyse la saisonnalit\u00e9.",
        questions=[
            "Qu'est-ce que le point mort ? Comment le calcule-t-on ?",
            "Calcule le point mort en couverts avec les deux tickets moyens.",
            "Comment la saisonnalit\u00e9 affecte-t-elle la gestion du point mort ?",
        ],
        correction="1) Point mort = SR / marge unitaire ou SR / ticket moyen (si taux marge constant). Nombre d'unit\u00e9s \u00e0 vendre pour \u00eatre \u00e0 l'\u00e9quilibre.\n\n2) Ticket 22 \u20ac : 428 571/22 \u2248 19 480 couverts (53/jour). Ticket pond\u00e9r\u00e9 28 \u20ac : \u2248 15 306 couverts (42/jour).\n\n3) En basse saison (45/jour < 42/jour th\u00e9orique), le mois est d\u00e9ficitaire. La haute saison compense. Il faut anticiper tr\u00e9sorerie et ajuster effectifs variables.",
        attendu="Calcul point mort, deux sc\u00e9narios, analyse saisonnalit\u00e9.",
    ),
    dict(
        sid="e5", title="Effet de levier op\u00e9rationnel",
        support="L'analyste financier de Caf\u00e9Rouge observe qu'une hausse de 10 % du CA au-dessus du SR entra\u00eene une progression de 25 % du r\u00e9sultat d'exploitation. Ce ph\u00e9nom\u00e8ne s'explique par la structure de co\u00fbts : les charges fixes (180 000 \u20ac) restent stables tandis que seuls les co\u00fbts variables augmentent proportionnellement au CA. \u00c0 l'inverse, une baisse de 10 % du CA sous le SR provoque une d\u00e9gradation amplifi\u00e9e du r\u00e9sultat. Le directeur en d\u00e9duit qu'il doit absolument maintenir le CA au-dessus du SR pour b\u00e9n\u00e9ficier de cet effet de levier positif.",
        consigne="Explique l'effet de levier op\u00e9rationnel \u00e0 partir du support et de la structure co\u00fbts fixes/variables.",
        questions=[
            "Qu'est-ce que l'effet de levier op\u00e9rationnel ?",
            "Pourquoi +10 % CA entra\u00eene +25 % r\u00e9sultat chez Caf\u00e9Rouge ?",
            "Quels risques si le CA chute durablement sous le SR ?",
        ],
        correction="1) L'effet de levier : les CF \u00e9tant fixes, toute variation du CA au-del\u00e0 du SR impacte fortement le r\u00e9sultat ( \u00e0 la hausse ou \u00e0 la baisse).\n\n2) Au-dessus du SR, l'augmentation du CA ne g\u00e9n\u00e8re que des CV suppl\u00e9mentaires. La quasi-totalit\u00e9 de la hausse alimente la marge et le r\u00e9sultat (+25 %).\n\n3) Sous le SR, les CF restent dus mais la MCV ne suffit plus : pertes amplifi\u00e9es, risque tr\u00e9sorerie, impossibilit\u00e9 de couvrir l'investissement.",
        attendu="D\u00e9finition levier, m\u00e9canisme chiffr\u00e9, analyse du risque.",
    ),
    dict(
        sid="e6", title="Contr\u00f4le des co\u00fbts alimentaires",
        support="Caf\u00e9Rouge fixe un ratio mati\u00e8res cible de 28 % du CA. Un tableau de bord hebdomadaire compare le ratio r\u00e9alis\u00e9 au budget. En septembre 2025, le ratio passe \u00e0 31,2 % (alerte > 30 %). L'inventaire r\u00e9v\u00e8le : surconsommation fromages (+420 \u20ac), pertes sur produits frais non vendus (+280 \u20ac), erreurs de commande (+150 \u20ac). Le chef met en place des fiches techniques standardis\u00e9es, un inventaire hebdomadaire et une formation portionnage. Objectif : revenir sous 28 % d'ici deux mois.",
        consigne="Analyse le dispositif de contr\u00f4le des co\u00fbts alimentaires et le r\u00f4le du contr\u00f4le de gestion dans la performance.",
        questions=[
            "Pourquoi contr\u00f4ler les co\u00fbts participe-t-il \u00e0 la performance de l'entreprise ?",
            "Identifie les \u00e9carts rep\u00e9r\u00e9s et leurs causes dans le support.",
            "Pr\u00e9sente les actions correctives et leurs effets attendus sur le SR.",
        ],
        correction="1) Le contr\u00f4le des co\u00fbts mesure la rentabilit\u00e9, d\u00e9tecte les d\u00e9rives, aide \u00e0 la d\u00e9cision (prix, portions, fournisseurs). Compl\u00e9mentaire \u00e0 la comptabilit\u00e9 g\u00e9n\u00e9rale.\n\n2) \u00c9cart d\u00e9favorable +3,2 pts de ratio (31,2 % vs 28 %). Causes : surconsommation, gaspillage, erreurs commande (850 \u20ac identifi\u00e9s).\n\n3) Fiches techniques, inventaires, formation \u2192 ma\u00eetrise portions et gaspillage \u2192 baisse CV \u2192 am\u00e9lioration taux marge \u2192 SR plus bas ou marge sup\u00e9rieure au-del\u00e0 du SR.",
        attendu="Lien contr\u00f4le/performance, \u00e9carts chiffr\u00e9s, plan d'action coh\u00e9rent.",
    ),
    dict(
        sid="e7", title="Analyse des \u00e9carts",
        support="Le budget pr\u00e9visionnel d'octobre pr\u00e9voyait une masse salariale variable de 62 000 \u20ac pour un CA de 210 000 \u20ac. Le r\u00e9alis\u00e9 affiche 66 200 \u20ac de masse pour 205 000 \u20ac de CA : \u00e9cart d\u00e9favorable de 4 200 \u20ac sur la masse, combin\u00e9 \u00e0 un \u00e9cart d\u00e9favorable de CA (-5 000 \u20ac). L'analyse d\u00e9taill\u00e9e montre 180 heures suppl\u00e9mentaires non budg\u00e9t\u00e9es lors d'un \u00e9v\u00e9nement priv\u00e9 mal anticip\u00e9. Le contr\u00f4leur de gestion recommande un plafond d'heures sup et une meilleure planification \u00e9v\u00e9nementielle.",
        consigne="R\u00e9alise une analyse des \u00e9carts pr\u00e9vision/r\u00e9alis\u00e9 sur la masse salariale et le CA.",
        questions=[
            "Qu'est-ce qu'un \u00e9cart en contr\u00f4le de gestion ? Distingue \u00e9cart favorable et d\u00e9favorable.",
            "Calcule et interpr\u00e8te les \u00e9carts sur masse et CA d'octobre.",
            "Quelles d\u00e9cisions de management tirer de cette analyse ?",
        ],
        correction="1) \u00c9cart = R\u00e9alis\u00e9 \u2212 Pr\u00e9vision. D\u00e9favorable si co\u00fbt sup\u00e9rieur ou recette inf\u00e9rieure au budget.\n\n2) Masse : +4 200 \u20ac d\u00e9favorable (66 200 vs 62 000). CA : \u22125 000 \u20ac d\u00e9favorable (205 000 vs 210 000). Double effet n\u00e9gatif sur le r\u00e9sultat.\n\n3) Plafond heures sup, planning \u00e9v\u00e9nements, recrutement extras ponctuels. Mise en place d'un suivi mensuel des \u00e9carts pour d\u00e9cisions rapides.",
        attendu="\u00c9carts calcul\u00e9s, causes identifi\u00e9es, mesures de correction.",
    ),
    dict(
        sid="e8", title="SR et d\u00e9cision d'extension",
        support="Caf\u00e9Rouge envisage un second \u00e9tablissement aux Chartrons (loyer 9 200 \u20ac/mois, charges fixes additionnelles 95 000 \u20ac/an). CA pr\u00e9visionnel ann\u00e9e 1 : 980 000 \u20ac, taux marge 42 % (identique au site 1). SR site 2 = 95 000 / 0,42 \u2248 226 190 \u20ac. Le CA pr\u00e9vu repr\u00e9sente 433 % du SR, ce qui semble favorable. Investissement am\u00e9nagement : 120 000 \u20ac. Tr\u00e9sorerie disponible groupe : 85 000 \u20ac. Le dirigeant doit arbitrer ouverture imm\u00e9diate, report ou abandon.",
        consigne="\u00c9value la d\u00e9cision d'ouverture du second site \u00e0 l'aide du seuil de rentabilit\u00e9 et d'autres crit\u00e8res pertinents.",
        questions=[
            "Calcule le SR du site 2 et compare-le au CA pr\u00e9visionnel.",
            "Quels autres crit\u00e8res que le SR faut-il int\u00e9grer ?",
            "Quelle recommandation : go, report ou no-go ? Argumente.",
        ],
        correction="1) SR site 2 \u2248 226 190 \u20ac. CA pr\u00e9vu 980 000 \u20ac >> SR (marge de s\u00e9curit\u00e9 confortable).\n\n2) Tr\u00e9sorerie (85 000 \u20ac < 120 000 \u20ac investissement), d\u00e9lai retour, cannibalisation site 1, concurrence food trucks, sc\u00e9nario pessimiste (-20 % CA).\n\n3) Report ou financement compl\u00e9mentaire : SR th\u00e9orique favorable mais tr\u00e9sorerie insuffisante. Go conditionnel si emprunt ou apport associ\u00e9 et CA \u00e0 \u226585 % pr\u00e9vision.",
        attendu="SR site 2 calcul\u00e9, crit\u00e8res multiples, recommandation argument\u00e9e.",
    ),
    dict(
        sid="e9", title="Tableau de bord des co\u00fbts",
        support="Le directeur de Caf\u00e9Rouge consulte chaque lundi un dashboard : CA hebdo vs objectif, ratio mati\u00e8res, ratio masse, marge sur co\u00fbts variables, taux d'atteinte du SR cumul\u00e9. En octobre 2025, le SR cumul\u00e9 est atteint \u00e0 94 % (retard saisonnier). Le ratio mati\u00e8res est vert (< 28 %), la masse est orange (31 % vs cible 30 %). Un indicateur \u00ab couverts/jour \u00bb compare 72 r\u00e9alis\u00e9 vs 78 budget. Le tableau permet des r\u00e9unions flash avec le chef et le responsable salle chaque semaine.",
        consigne="Explique le r\u00f4le d'un tableau de bord dans le contr\u00f4le des co\u00fbts et interpr\u00e8te les indicateurs du support.",
        questions=[
            "Qu'est-ce qu'un tableau de bord de gestion ? Quels principes ( synth\u00e8se, alerte, action) ?",
            "Interpr\u00e8te chaque indicateur d'octobre (SR 94 %, mati\u00e8res, masse, couverts).",
            "Comment le tableau de bord am\u00e9liore-t-il la prise de d\u00e9cision ?",
        ],
        correction="1) Tableau de bord : synth\u00e8se visuelle d'indicateurs cl\u00e9s, seuils d'alerte, pilotage en temps r\u00e9el. Compl\u00e9mentaire \u00e0 la comptabilit\u00e9 (prospective vs historique).\n\n2) SR 94 % : retard \u00e0 combler. Mati\u00e8res vert : ma\u00eetrise OK. Masse orange : d\u00e9rive \u00e0 surveiller. Couverts 72/78 : sous-performance commerciale.\n\n3) R\u00e9unions hebdo, actions cibl\u00e9es (promo, plafond heures), anticipation avant fin de mois.",
        attendu="Principes tableau de bord, lecture indicateurs, lien d\u00e9cision.",
    ),
    dict(
        sid="e10", title="Synth\u00e8se contr\u00f4le des co\u00fbts",
        support="L'inflation des mati\u00e8res premi\u00e8res (+8 % en 2025) pousse Caf\u00e9Rouge \u00e0 arbitrer : augmenter les prix de 6 % (risque baisse fr\u00e9quentation estim\u00e9e \u22124 % couverts), r\u00e9duire les portions (\u00e9conomie 2,5 pts de ratio mati\u00e8res, risque image), ou lancer une gamme \u00ab local zero dechet \u00bb (mati\u00e8res +5 % mais ticket moyen +12 %, conforme d\u00e9veloppement durable). Le contr\u00f4leur simule l'impact sur le taux de marge (42 % \u2192 39 % si rien n'est fait) et sur le SR (+15 000 \u20ac de CF si certification environnementale).",
        consigne="Compare les trois options \u00e0 la lumi\u00e8re du contr\u00f4le des co\u00fbts, du SR et du d\u00e9veloppement durable.",
        questions=[
            "Quel impact de l'inflation si Caf\u00e9Rouge ne r\u00e9agit pas ?",
            "Compare les trois options (prix, portions, gamme durable) sur marge et SR.",
            "Quelle strat\u00e9gie recommandes-tu ? Int\u00e8gre le co\u00fbt du d\u00e9veloppement durable.",
        ],
        correction="1) Sans action : taux marge 42 % \u2192 39 %, SR augmente, r\u00e9sultat d\u00e9grad\u00e9 malgr\u00e9 CA stable.\n\n2) Prix +6 % : marge pr\u00e9serv\u00e9e mais \u22124 % couverts. Portions : gain co\u00fbt mais risque satisfaction. Gamme durable : ticket +12 %, co\u00fbt mati\u00e8res +5 %, diff\u00e9renciation RSE.\n\n3) Recommandation mixte : gamme durable (alignement DD, ticket moyen) + ajustement prix mod\u00e9r\u00e9. \u00c9viter r\u00e9duction portions seule (image). Piloter SR mensuel.",
        attendu="Simulation chiffr\u00e9e, comparaison structur\u00e9e, recommandation DD int\u00e9gr\u00e9e.",
    ),
    dict(
        sid="cas1", title="\u00c9tude de cas : Rentabilit\u00e9 Caf\u00e9Rouge",
        support="Caf\u00e9Rouge (Bordeaux, 2,4 M\u20ac CA, 38 salari\u00e9s) affiche un r\u00e9sultat net de \u221212 000 \u20ac en 2025 malgr\u00e9 un CA sup\u00e9rieur au SR th\u00e9orique. Contexte : loyer quais +6 %, concurrence food trucks (\u22128 % couverts midi), ratio mati\u00e8res d\u00e9rap\u00e9 31 % en \u00e9t\u00e9, 420 heures sup non budg\u00e9t\u00e9es. Charges fixes 180 000 \u20ac, taux marge cible 42 %, ticket moyen 28 \u20ac, 82 couverts/jour en moyenne. Le groupe familial exige un retour \u00e0 l'\u00e9quilibre sous 6 mois.",
        consigne="R\u00e9dige un diagnostic complet et un plan d'action chiffr\u00e9 mobilisant co\u00fbts fixes/variables, SR, \u00e9carts et tableau de bord.",
        questions=[
            "Classifie les charges et calcule le SR actualis\u00e9.",
            "Analyse les \u00e9carts expliquant le r\u00e9sultat n\u00e9gatif.",
            "Propose au moins quatre leviers de rentabilit\u00e9 chiffr\u00e9s.",
            "D\u00e9finis un tableau de bord mensuel (5 indicateurs minimum).",
            "Plan d'action 6 mois avec objectifs chiffr\u00e9s.",
        ],
        correction="1) CF 180 000 \u20ac (+loyer), CV \u224858 % CA. SR \u2248 428 571 \u20ac (stable si marge 42 %).\n\n2) \u00c9carts : mati\u00e8res +3 pts (\u00e9t\u00e9), masse +420 h sup, CA midi \u22128 %, loyer +6 %.\n\n3) Leviers : ratio mati\u00e8res \u2192 28 % (\u00e9conomie \u224872 000 \u20ac/an), promo soir (+ticket), plafond heures sup, partenariat \u00e9v\u00e9nementiel.\n\n4) Dashboard : CA, ratio mati\u00e8res, masse, SR cumul\u00e9, couverts/jour.\n\n5) Mois 1-2 : fiches techniques + dashboard. Mois 3-4 : promo soir. Mois 5-6 : objectif r\u00e9sultat \u2265 0.",
        attendu="Diagnostic complet chapitre 6, plan chiffr\u00e9 6 mois.",
    ),
    dict(
        sid="cas2", title="\u00c9tude de cas : Ouverture second site",
        support="Projet Chartrons : loyer 9 200 \u20ac/mois, CF additionnels 95 000 \u20ac/an, investissement 120 000 \u20ac, CA pr\u00e9vu 980 000 \u20ac an 1, marge 42 %. Sc\u00e9nario pessimiste CA \u221220 % (784 000 \u20ac). Tr\u00e9sorerie 85 000 \u20ac, emprunt possible 80 000 \u20ac \u00e0 5 % sur 5 ans. Concurrence : 3 restaurants similaires dans 500 m. Site 1 pourrait perdre 5 % CA (cannibalisation). Point mort site 2 : 42 couverts/jour \u00e0 ticket 28 \u20ac.",
        consigne="D\u00e9cision d'investissement via SR, sc\u00e9narios et crit\u00e8res financiers. R\u00e9dige une note go/no-go.",
        questions=[
            "Calcule SR et marge de s\u00e9curit\u00e9 (base et pessimiste).",
            "Estime le d\u00e9lai de retour sur investissement (120 000 \u20ac).",
            "Identifie les risques (tr\u00e9sorerie, cannibalisation, concurrence).",
            "Sc\u00e9nario pessimiste : le site 2 est-il viable ?",
            "Recommandation finale go/no-go argument\u00e9e.",
        ],
        correction="1) SR \u2248 226 190 \u20ac. Marge s\u00e9curit\u00e9 base : 753 810 \u20ac (333 %). Pessimiste : 784 000 \u20ac, marge s\u00e9curit\u00e9 557 810 \u20ac (247 %).\n\n2) R\u00e9sultat estim\u00e9 base : (980 000 \u00d7 0,42) \u2212 95 000 \u2248 316 600 \u20ac. Payback \u2248 120 000/316 600 < 1 an op\u00e9rationnel.\n\n3) Tr\u00e9sorerie insuffisante, cannibalisation 5 % site 1, concurrence locale.\n\n4) Pessimiste reste au-dessus SR : viable mais marge r\u00e9duite.\n\n5) Go conditionnel : emprunt 80 000 \u20ac + apport, clause revue CA \u00e0 6 mois, pas d'ouverture si site 1 non r\u00e9\u00e9quilibr\u00e9.",
        attendu="Note d'investissement chiffr\u00e9e, sc\u00e9narios, d\u00e9cision argument\u00e9e.",
    ),
]

CH7 = [
    dict(
        sid="e1", title="SI de production (ERP/MES)",
        support="Plastiform, PME st\u00e9phanoise de plasturgie (CA 22 M\u20ac, 210 salari\u00e9s), a d\u00e9ploy\u00e9 un ERP SAP couvrant achats, stocks, comptabilit\u00e9 et un MES (Manufacturing Execution System) en atelier. Le MES trace chaque lot en temps r\u00e9el : temps de cycle, param\u00e8tres injection, op\u00e9rateur. L'ERP coordonne la commande client \u2192 ordre de fabrication \u2192 approvisionnement \u2192 livraison. Avant l'int\u00e9gration, les silos d'information causaient 12 % de retards. Apr\u00e8s 18 mois, le taux de service client passe de 91 % \u00e0 97 %.",
        consigne="Explique le r\u00f4le central des syst\u00e8mes d'information (ERP, MES) dans la digitalisation des processus de production.",
        questions=[
            "Qu'est-ce qu'un ERP et un MES ? Quelle diff\u00e9rence ?",
            "Comment Plastiform illustre-t-elle la continuit\u00e9 num\u00e9rique du cours ?",
            "Quels avantages et limites de l'int\u00e9gration ERP/MES ?",
        ],
        correction="1) ERP (PGI) : chef d'orchestre gestion (achats, stocks, compta). MES : pilotage atelier temps r\u00e9el (tra\u00e7abilit\u00e9, cycles).\n\n2) Flux num\u00e9rique de la commande \u00e0 la livraison, \u00e9limination silos, tra\u00e7abilit\u00e9 lots.\n\n3) Avantages : r\u00e9activit\u00e9, taux service +6 pts. Limites : co\u00fbt, d\u00e9ploiement 18 mois, formation, d\u00e9pendance SI.",
        attendu="D\u00e9finitions ERP/MES, application Plastiform, analyse critique.",
    ),
    dict(
        sid="e2", title="Automatisation et robots",
        support="Plastiform a investi 2,8 M\u20ac dans 12 robots d'injection. Cadence +22 %, rebuts \u221218 %, p\u00e9nibilit\u00e9 r\u00e9duite (postes manutention \u00e9limin\u00e9s). Effectifs production : \u22128 % r\u00e9affect\u00e9s en maintenance et qualit\u00e9. L'automatisation repose sur ordinateurs reli\u00e9s aux machines (automobile, \u00e9lectronique, plasturgie). Airbus illustre la g\u00e9n\u00e9ralisation \u00e0 l'a\u00e9ronautique. Le CSE a n\u00e9goci\u00e9 un plan de formation et de reclassement.",
        consigne="Analyse l'automatisation industrielle \u00e0 partir du support : d\u00e9finition, impacts productivit\u00e9/emploi/qualit\u00e9.",
        questions=[
            "D\u00e9finis l'automatisation industrielle selon le cours.",
            "Quels impacts positifs et n\u00e9gatifs chez Plastiform ?",
            "Pourquoi la dimension sociale (CSE, formation) est-elle importante ?",
        ],
        correction="1) Int\u00e9gration machines/robots/ordinateurs pour t\u00e2ches autrefois manuelles. R\u00e9duit co\u00fbts, am\u00e9liore productivit\u00e9 et qualit\u00e9, diminue p\u00e9nibilit\u00e9.\n\n2) Positifs : cadence +22 %, rebuts \u221218 %, qualit\u00e9. N\u00e9gatifs : \u22128 % effectifs production (r\u00e9affectation n\u00e9cessaire).\n\n3) Automatisation transforme emplois : formation maintenance/qualit\u00e9, dialogue social, acceptabilit\u00e9 du projet.",
        attendu="D\u00e9finition, impacts chiffr\u00e9s, dimension RH.",
    ),
    dict(
        sid="e3", title="RPA en gestion administrative",
        support="Plastiform d\u00e9ploie la RPA (Robotic Process Automation) sur le traitement des factures fournisseurs : 2 400 factures/mois saisies automatiquement, rapprochement bon de commande, validation comptable. Erreurs de saisie \u221290 %, d\u00e9lai traitement 5 j \u2192 8 h, 1,5 ETP r\u00e9affect\u00e9 au contr\u00f4le de gestion. BNP Paribas utilise aussi la RPA en banque/assurance. La RPA lib\u00e8re les employ\u00e9s de t\u00e2ches r\u00e9p\u00e9titives pour des missions \u00e0 plus forte valeur ajout\u00e9e.",
        consigne="Pr\u00e9sente la RPA, ses avantages et ses diff\u00e9rences avec l'automatisation industrielle.",
        questions=[
            "Qu'est-ce que la RPA ? Dans quels secteurs est-elle utilis\u00e9e ?",
            "Analyse les r\u00e9sultats du d\u00e9ploiement RPA chez Plastiform.",
            "Compare RPA (services) et automatisation industrielle (robots).",
        ],
        correction="1) RPA : automatisation de t\u00e2ches r\u00e9p\u00e9titives administratives via robots logiciels. Comptabilit\u00e9, banque (BNP), RH, assurances.\n\n2) 2 400 factures/mois, erreurs \u221290 %, d\u00e9lai \u00f715, 1,5 ETP \u2192 contr\u00f4le de gestion (valeur ajout\u00e9e).\n\n3) RPA = logiciel, t\u00e2ches bureau. Automatisation industrielle = machines/robots en atelier. M\u00eame logique : productivit\u00e9, conformit\u00e9, d\u00e9charge humaine.",
        attendu="D\u00e9finition RPA, r\u00e9sultats chiffr\u00e9s, comparaison avec automatisation.",
    ),
    dict(
        sid="e4", title="D\u00e9mat\u00e9rialisation documentaire",
        support="Plastiform remplace les bons de production papier par des tablettes en atelier : saisie temps, param\u00e8tres, photos d\u00e9fauts. Archivage cloud certifi\u00e9 ISO 27001. Gains : r\u00e9activit\u00e9 (+delais), r\u00e9duction co\u00fbts papier/archivage (\u221232 000 \u20ac/an), tra\u00e7abilit\u00e9 am\u00e9lior\u00e9e, d\u00e9marche z\u00e9ro papier (RSE). Les flux documentaires (commandes, BL, certificats mati\u00e8res) circulent d\u00e9sormais num\u00e9riquement entre fournisseurs, production et clients.",
        consigne="Explique la d\u00e9mat\u00e9rialisation des processus de production et ses enjeux pour Plastiform.",
        questions=[
            "D\u00e9finis d\u00e9mat\u00e9rialisation et digitalisation selon le cours.",
            "Quels enjeux rep\u00e8res-tu dans le support (d\u00e9lais, co\u00fbts, tra\u00e7abilit\u00e9, RSE) ?",
            "Quelles limites ou risques de la d\u00e9mat\u00e9rialisation ?",
        ],
        correction="1) D\u00e9mat\u00e9rialisation : remplacer supports mat\u00e9riels par num\u00e9riques. Digitalisation des flux documentaires.\n\n2) R\u00e9activit\u00e9, \u221232 000 \u20ac/an, tra\u00e7abilit\u00e9 lots, z\u00e9ro papier, partage avec parties prenantes.\n\n3) Cybers\u00e9curit\u00e9 (ISO 27001 n\u00e9cessaire), d\u00e9pendance connexion, formation op\u00e9rateurs, co\u00fbt initial tablettes.",
        attendu="D\u00e9finitions, quatre enjeux identifi\u00e9s, limites argument\u00e9es.",
    ),
    dict(
        sid="e5", title="BPM et flux de travail",
        support="Plastiform cartographie ses processus m\u00e9tiers (diagrammes de flux, workflows) avant d'adopter un logiciel BPM (Business Process Management). Exemple : processus \u00ab non-conformit\u00e9 qualit\u00e9 \u00bb \u2014 d\u00e9tection MES \u2192 alerte responsable qualit\u00e9 \u2192 analyse \u2192 d\u00e9cision \u2192 tra\u00e7abilit\u00e9 ERP. D\u00e9lai moyen de traitement : 48 h \u2192 6 h. Le BPM est au c\u0153ur de la transformation num\u00e9rique : mod\u00e9liser, optimiser, automatiser.",
        consigne="Mobilise les notions de workflow, diagramme de flux et BPM pour analyser l'optimisation du processus qualit\u00e9.",
        questions=[
            "Qu'est-ce qu'un workflow et un diagramme de flux de donn\u00e9es ?",
            "Quel r\u00f4le joue le BPM dans la transformation num\u00e9rique ?",
            "Analyse l'am\u00e9lioration du processus non-conformit\u00e9 chez Plastiform.",
        ],
        correction="1) Workflow : mod\u00e9lisation des t\u00e2ches et acteurs d'un processus. Diagramme de flux : circulation des donn\u00e9es dans les SI.\n\n2) BPM : mod\u00e9liser, optimiser, automatiser processus m\u00e9tiers. C\u0153ur de la transformation digitale.\n\n3) Cha\u00eene MES\u2192qualit\u00e9\u2192ERP automatis\u00e9e, d\u00e9lai 48 h \u2192 6 h (\u00f78), tra\u00e7abilit\u00e9 renforc\u00e9e.",
        attendu="D\u00e9finitions BPM/workflow, application processus qualit\u00e9.",
    ),
    dict(
        sid="e6", title="Industrie 4.0 et IoT",
        support="Plastiform \u00e9quipe ses presses de capteurs IoT (temp\u00e9rature, pression, vibrations). Donn\u00e9es transmises en temps r\u00e9el vers une plateforme cloud. Maintenance pr\u00e9dictive : d\u00e9tection signaux faibles de d\u00e9faillance, changement composant avant panne. R\u00e9sultats : pannes \u221215 %, dur\u00e9e de vie \u00e9quipements +8 %, arr\u00eats non planifi\u00e9s \u221240 h/an. L'IIoT (Internet industriel des objets) connecte capteurs, machines et d\u00e9cideurs.",
        consigne="Explique le r\u00f4le des objets connect\u00e9s (IoT/IIoT) dans l'am\u00e9lioration des processus de production.",
        questions=[
            "Qu'est-ce que l'IoT industriel (IIoT) ?",
            "Comment les capteurs am\u00e9liorent-ils qualit\u00e9, productivit\u00e9 et s\u00e9curit\u00e9 ?",
            "Pr\u00e9sente la maintenance pr\u00e9dictive \u00e0 partir du support.",
        ],
        correction="1) IIoT : objets connect\u00e9s en cha\u00eene de production, capteurs \u2192 donn\u00e9es temps r\u00e9el \u2192 big data.\n\n2) Surveillance continue, d\u00e9cisions op\u00e9rateurs et dirigeants inform\u00e9es, qualit\u00e9 et s\u00e9curit\u00e9 renforc\u00e9es.\n\n3) Analyse \u00e9tat r\u00e9el \u00e9quipement, signaux faibles, changement pr\u00e9ventif : pannes \u221215 %, \u221240 h arr\u00eat, dur\u00e9e vie +8 %.",
        attendu="D\u00e9finition IIoT, impacts, maintenance pr\u00e9dictive expliqu\u00e9e.",
    ),
    dict(
        sid="e7", title="Cloud computing en production",
        support="Plastiform stocke et analyse les donn\u00e9es IoT sur un cloud Azure : maintenance \u00e0 distance 24h/24, mises \u00e0 jour logicielles MES \u00e0 distance, configuration presses \u00e0 distance. Avantages : donn\u00e9es accessibles partout, gain de place, \u00e9nergie. Inconv\u00e9nients identifi\u00e9s : panne serveur mars 2025 (4 h d'interruption), n\u00e9cessit\u00e9 connexion performante. Le cloud s'appuie sur la d\u00e9mat\u00e9rialisation et permet l'IA (analyse pr\u00e9dictive).",
        consigne="Pr\u00e9sente le cloud computing, ses apports et ses limites pour les processus de production.",
        questions=[
            "D\u00e9finis cloud computing et son lien avec IoT et IA.",
            "Cite trois avantages et deux inconv\u00e9nients illustr\u00e9s par Plastiform.",
            "Comment s\u00e9curiser un usage cloud en environnement industriel ?",
        ],
        correction="1) Cloud : serveurs distants via Internet pour stocker/exploiter donn\u00e9es. Base pour IoT, IA, d\u00e9mat\u00e9rialisation.\n\n2) Avantages : acc\u00e8s distant, maintenance 24/7, mises \u00e0 jour, gain place/\u00e9nergie. Inconv\u00e9nients : panne serveur (4 h), d\u00e9pendance connexion.\n\n3) Sauvegardes, plan continuit\u00e9, redondance, s\u00e9curisation acc\u00e8s, segmentation OT/IT.",
        attendu="D\u00e9finition cloud, avantages/inconv\u00e9nients, s\u00e9curisation.",
    ),
    dict(
        sid="e8", title="Intelligence artificielle et maintenance pr\u00e9dictive",
        support="Plastiform utilise des algorithmes de machine learning sur 18 mois de donn\u00e9es capteurs pour pr\u00e9dire les d\u00e9faillances de moules. L'IA analyse des quantit\u00e9s massives de donn\u00e9es, d\u00e9tecte des patterns invisibles \u00e0 l'humain, propose les meilleures d\u00e9cisions rapidement. Taux de pr\u00e9diction correcte : 87 %. L'IA compl\u00e8te la maintenance pr\u00e9dictive traditionnelle en enrichissant l'analyse de l'\u00e9tat r\u00e9el des \u00e9quipements.",
        consigne="Explique l'intelligence artificielle et son application \u00e0 la maintenance pr\u00e9dictive chez Plastiform.",
        questions=[
            "D\u00e9finis intelligence artificielle et machine learning.",
            "Comment l'IA am\u00e9liore-t-elle la maintenance pr\u00e9dictive ?",
            "Quelles limites de l'IA en production industrielle ?",
        ],
        correction="1) IA : machines accomplissant t\u00e2ches humaines via algorithmes. Machine learning : apprentissage sur donn\u00e9es massives.\n\n2) Analyse 18 mois donn\u00e9es, d\u00e9tection patterns, pr\u00e9diction d\u00e9faillances 87 %, d\u00e9cision rapide changement composant.\n\n3) Qualit\u00e9 donn\u00e9es, co\u00fbt, n\u00e9cessit\u00e9 expertise humaine, erreurs possibles (13 %), d\u00e9pendance SI.",
        attendu="D\u00e9finitions IA/ML, application maintenance, limites.",
    ),
    dict(
        sid="e9", title="ROI des investissements num\u00e9riques",
        support="Projet IoT Plastiform : investissement 380 000 \u20ac (capteurs, plateforme, int\u00e9gration). Gains annuels estim\u00e9s : maintenance \u221295 000 \u20ac, rebuts \u221248 000 \u20ac, arr\u00eats \u221232 000 \u20ac. Total gains 175 000 \u20ac/an. Payback : 380 000 / 175 000 \u2248 2,2 ans. Le comit\u00e9 d'investissement exige ROI > 15 % et payback < 4 ans. Projet valid\u00e9. Formation : 120 h/an/op\u00e9rateur, budget 180 000 \u20ac sur 3 ans.",
        consigne="Calcule le retour sur investissement du projet IoT et pr\u00e9sente les crit\u00e8res de d\u00e9cision d'investissement num\u00e9rique.",
        questions=[
            "Calcule le payback et le gain annuel du projet IoT.",
            "Quels crit\u00e8res au-del\u00e0 du ROI financier faut-il consid\u00e9rer ?",
            "Le projet est-il valid\u00e9 selon les crit\u00e8res du comit\u00e9 ?",
        ],
        correction="1) Gains 175 000 \u20ac/an. Payback 2,2 ans (< 4 ans). ROI annuel \u2248 175 000/380 000 \u2248 46 % (> 15 %).\n\n2) Formation (180 000 \u20ac), conduite changement, cybers\u00e9curit\u00e9, d\u00e9pendance fournisseur cloud.\n\n3) Oui : payback et ROI d\u00e9passent les seuils. Formation int\u00e9gr\u00e9e au plan.",
        attendu="Calcul payback/ROI, crit\u00e8res multiples, d\u00e9cision justifi\u00e9e.",
    ),
    dict(
        sid="e10", title="Synth\u00e8se SI production",
        support="Feuille de route num\u00e9rique Plastiform 2025-2028 (budget 1,2 M\u20ac) : (1) IoT capteurs 380 k\u20ac, (2) RPA comptabilit\u00e9 120 k\u20ac, (3) Cobots emballage 290 k\u20ac, (4) Module qualit\u00e9 ERP 410 k\u20ac. Priorisation n\u00e9cessaire. Quick wins : RPA (payback < 1 an). Cobots : TMS \u221225 %, ergonomie. IoT : maintenance. ERP qualit\u00e9 : d\u00e9lai 24 mois. Conduite changement : 120 h formation/an, communication interne.",
        consigne="Priorise les quatre projets de la feuille de route en mobilisant SI, automatisation, ROI et conduite du changement.",
        questions=[
            "Pr\u00e9sente les quatre projets et leurs apports respectifs.",
            "Propose un ordre de priorit\u00e9 argument\u00e9 (ROI, risques, quick wins).",
            "Quels facteurs de conduite du changement int\u00e9grer ?",
        ],
        correction="1) IoT (maintenance), RPA (admin), cobots (ergonomie/productivit\u00e9), ERP qualit\u00e9 (tra\u00e7abilit\u00e9 long terme).\n\n2) Priorit\u00e9 : (1) RPA quick win, (2) cobots s\u00e9curit\u00e9/TMS, (3) IoT, (4) ERP qualit\u00e9 phase 2.\n\n3) Formation 120 h/an, communication, implication CSE, pilotes avant d\u00e9ploiement global.",
        attendu="Comparaison projets, prioritisation argument\u00e9e, conduite changement.",
    ),
    dict(
        sid="cas1", title="\u00c9tude de cas : Feuille de route Industrie 4.0",
        support="Plastiform (22 M\u20ac CA, 210 salari\u00e9s) dispose de 1,2 M\u20ac sur 3 ans pour : IoT (380 k\u20ac, payback 2,2 ans), RPA (120 k\u20ac, payback 0,8 an), cobots (290 k\u20ac, TMS \u221225 %), ERP qualit\u00e9 (410 k\u20ac, d\u00e9lai 24 mois). Tr\u00e9sorerie limit\u00e9e : max 500 k\u20ac/an. Client automotive exige tra\u00e7abilit\u00e9 renforc\u00e9e d'ici 18 mois. CSE vigilant sur emploi. \u00c9quipe SI : 4 personnes.",
        consigne="R\u00e9dige une feuille de route prioris\u00e9e avec crit\u00e8res, ROI, planning et conduite du changement.",
        questions=[
            "Quels crit\u00e8res de priorit\u00e9 retenir (ROI, client, RH, capacit\u00e9 SI) ?",
            "Analyse chaque projet (co\u00fbt, b\u00e9n\u00e9fices, risques, d\u00e9lai).",
            "Propose un planning 2025-2028 respectant tr\u00e9sorerie 500 k\u20ac/an.",
            "Plan conduite du changement (formation, communication, CSE).",
            "Synth\u00e8se : roadmap argument\u00e9e en 10 lignes.",
        ],
        correction="1) ROI, exigence client automotive 18 mois, impact emploi, capacit\u00e9 SI 4 pers.\n\n2) RPA : quick win. Cobots : ergonomie. IoT : maintenance. ERP qualit\u00e9 : exigence client mais long.\n\n3) An 1 : RPA + d\u00e9but cobots (420 k\u20ac). An 2 : fin cobots + IoT (500 k\u20ac). An 3 : ERP qualit\u00e9 (410 k\u20ac).\n\n4) Formation, r\u00e9unions CSE, pilotes atelier, communication r\u00e9ussites.\n\n5) Roadmap : quick wins d'abord, qualit\u00e9 client en parall\u00e8le, IoT maintenance, ERP en phase 2.",
        attendu="Roadmap compl\u00e8te chapitre 7, planning tr\u00e9sorerie respect\u00e9.",
    ),
    dict(
        sid="cas2", title="\u00c9tude de cas : Cyberattaque MES",
        support="Ransomware paralyse le MES Plastiform 36 h : production arr\u00eat\u00e9e, 180 000 \u20ac CA perdu, 3 clients automotive alert\u00e9s. Cause : phishing email comptabilit\u00e9, r\u00e9seau OT/IT non segment\u00e9. Sauvegardes cloud compromises. PRA (plan reprise activit\u00e9) jamais test\u00e9. Restauration manuelle 36 h. Apr\u00e8s crise : segmentation OT/IT, sauvegardes offline, PRA test trimestriel, formation cyber.",
        consigne="Analyse la crise SI production et propose un plan pr\u00e9ventif (cybers\u00e9curit\u00e9 industrielle).",
        questions=[
            "Identifie les vuln\u00e9rabilit\u00e9s ayant permis l'attaque.",
            "Quantifie les cons\u00e9quences \u00e9conomiques et relationnelles.",
            "Pr\u00e9sente un plan de reprise d'activit\u00e9 (PRA) adapt\u00e9.",
            "Mesures pr\u00e9ventives \u00e0 d\u00e9ployer (OT/IT, sauvegardes, formation).",
            "Communication clients automotive : que dire et quand ?",
        ],
        correction="1) Phishing, OT/IT non segment\u00e9, sauvegardes compromises, PRA non test\u00e9.\n\n2) 180 000 \u20ac CA, 36 h arr\u00eat, 3 clients alert\u00e9s (risque contrat).\n\n3) PRA : restauration MES < 4 h, sauvegardes offline, proc\u00e9dure manuelle temporaire.\n\n4) Segmentation, MFA, sauvegardes air-gapped, tests trimestriels, sensibilisation phishing.\n\n5) Transparence rapide, plan correction, audit s\u00e9curit\u00e9, reporting hebdo jusqu'\u00e0 r\u00e9solution.",
        attendu="Analyse cyber compl\u00e8te, PRA et pr\u00e9vention structur\u00e9s.",
    ),
]

CH8 = [
    dict(
        sid="e1", title="Organisation rigide et taylorisme",
        support="Mobili\u00e8re Plus (Laval, 35 M\u20ac CA, 220 salari\u00e9s) produit des meubles en s\u00e9rie standardis\u00e9e. L'organisation repose sur une division horizontale forte (d\u00e9coupe, assemblage, finition, exp\u00e9dition) et une division verticale marqu\u00e9e (encadrement s\u00e9par\u00e9 de l'ex\u00e9cution). T\u00e2ches r\u00e9p\u00e9titives, salaire au rendement sur l'atelier d\u00e9coupe. Environnement stable, demande pr\u00e9visible. Productivit\u00e9 \u00e9lev\u00e9e mais turnover 16 % sur postes r\u00e9p\u00e9titifs.",
        consigne="Pr\u00e9sente les caract\u00e9ristiques d'une organisation rigide (OST/Taylor) \u00e0 partir du support.",
        questions=[
            "Quels sont les trois principes de l'organisation rigide selon le cours ?",
            "Identifie division horizontale et verticale chez Mobili\u00e8re Plus.",
            "Pourquoi ce mod\u00e8le convient-il \u00e0 un environnement stable ?",
        ],
        correction="1) Division horizontale (sp\u00e9cialisation), division verticale (encadrement/ex\u00e9cution), salaire au rendement.\n\n2) Horizontale : 4 ateliers sp\u00e9cialis\u00e9s. Verticale : hi\u00e9rarchie encadrement/ex\u00e9cutants. Rendement d\u00e9coupe.\n\n3) Environnement stable, s\u00e9rie standardis\u00e9e : gains productivit\u00e9, co\u00fbts comp\u00e9titifs. Limite : turnover 16 % (perte de sens).",
        attendu="Trois principes OST, application support, ad\u00e9quation environnement.",
    ),
    dict(
        sid="e2", title="Flux tendus et kanban",
        support="Mobili\u00e8re Plus r\u00e9duit ses stocks composants de 28 \u00e0 11 jours via kanban : 120 r\u00e9f\u00e9rences, \u00e9tiquettes d\u00e9clenchent r\u00e9approvisionnement, livraisons fournisseurs 2\u00d7/semaine. Principe \u00ab juste \u00e0 temps \u00bb : les stocks sont inutiles (toyotisme). BFR lib\u00e9r\u00e9 : 420 000 \u20ac. Risque : rupture approvisionnement panneaux nov 2025 (retard 3 clients).",
        consigne="Explique le flux tendu et le syst\u00e8me kanban. Analyse avantages et risques.",
        questions=[
            "D\u00e9finis flux tendu et kanban selon le cours.",
            "Quels gains Mobili\u00e8re Plus tire-t-elle du flux tendu ?",
            "Quelles limites la panne de nov 2025 r\u00e9v\u00e8le-t-elle ?",
        ],
        correction="1) Flux tendu : production \u00e0 la demande, stocks minimis\u00e9s. Kanban : \u00e9tiquetage d\u00e9clenchant r\u00e9appro.\n\n2) Stocks 28\u219211 jours, BFR \u2212420 000 \u20ac, livraisons synchronis\u00e9es.\n\n3) Vuln\u00e9rabilit\u00e9 ruptures, d\u00e9pendance fournisseurs fiables, n\u00e9cessit\u00e9 stock s\u00e9curit\u00e9 minimal.",
        attendu="D\u00e9finitions, gains chiffr\u00e9s, limites flux tendu.",
    ),
    dict(
        sid="e3", title="Lean manufacturing et VSM",
        support="Mobili\u00e8re Plus r\u00e9alise une Value Stream Mapping (VSM) : lead time total 18 jours (commande \u2192 livraison), dont 6 jours valeur ajout\u00e9e et 12 jours gaspillages (attentes, stocks, reprises). Apr\u00e8s lean : lead time 12 jours (\u221233 %), 5S d\u00e9ploy\u00e9, 80 projets kaizen/an. Lean = r\u00e9duction gaspillages (muda) + am\u00e9lioration continue.",
        consigne="Pr\u00e9sente le lean management et analyse la VSM de Mobili\u00e8re Plus.",
        questions=[
            "Qu'est-ce que le lean management ? Cite muda, 5S, kaizen.",
            "Analyse la VSM : o\u00f9 sont les gaspillages ?",
            "Comment le lead time a-t-il \u00e9t\u00e9 r\u00e9duit de 33 % ?",
        ],
        correction="1) Lean : \u00e9liminer gaspillages, am\u00e9lioration continue. 5S (ranger), kaizen (petites am\u00e9liorations), muda (gaspillages).\n\n2) 12 jours non valeur ajout\u00e9e : attentes, stocks interm\u00e9diaires, reprises qualit\u00e9.\n\n3) 5S, kaizen (80 projets/an), flux tendu, r\u00e9duction attentes \u2192 18\u219212 jours.",
        attendu="D\u00e9finitions lean, analyse VSM, r\u00e9sultats chiffr\u00e9s.",
    ),
    dict(
        sid="e4", title="M\u00e9canismes de coordination Mintzberg",
        support="Mobili\u00e8re Plus combine plusieurs m\u00e9canismes d'ajustement : supervision directe en atelier (chef d'\u00e9quipe), standardisation des proc\u00e9d\u00e9s (fiches op\u00e9ratoires d\u00e9coupe), standardisation des r\u00e9sultats (objectif OTD 95 %), ajustement mutuel en cellule premium (communication informelle). Mintzberg : plus l'environnement est complexe, plus on s'\u00e9loigne de la supervision directe vers standardisation des objectifs et culture commune.",
        consigne="Pr\u00e9sente les m\u00e9canismes de coordination de Mintzberg illustr\u00e9s par Mobili\u00e8re Plus.",
        questions=[
            "Cite et d\u00e9finis au moins quatre m\u00e9canismes d'ajustement Mintzberg.",
            "Quel m\u00e9canisme pour chaque situation du support ?",
            "Pourquoi la cellule premium utilise-t-elle l'ajustement mutuel ?",
        ],
        correction="1) Supervision directe, standardisation proc\u00e9d\u00e9s/r\u00e9sultats/qualifications/normes, ajustement mutuel.\n\n2) Atelier : supervision + proc\u00e9d\u00e9s. OTD : r\u00e9sultats. Premium : ajustement mutuel (complexit\u00e9, autonomie).\n\n3) Environnement complexe (produits diff\u00e9renci\u00e9s) : coordination informelle plus adapt\u00e9e que proc\u00e9dures rigides.",
        attendu="Quatre m\u00e9canismes d\u00e9finis, application au support.",
    ),
    dict(
        sid="e5", title="Toyotisme et am\u00e9lioration continue",
        support="Inspir\u00e9 du toyotisme, Mobili\u00e8re Plus d\u00e9ploie : autonomisation machines (arr\u00eat si d\u00e9faut), kaizen continu (pas de r\u00e9volution), cercles qualit\u00e9 ouvriers/cadres, remont\u00e9e information base\u2192haut. Polyvalence op\u00e9rateurs : 3 postes ma\u00eetris\u00e9s minimum. Contrairement au taylorisme : information remonte, pas seulement ordres qui descendent.",
        consigne="Compare toyotisme et taylorisme \u00e0 partir des pratiques de Mobili\u00e8re Plus.",
        questions=[
            "Cite les principes du toyotisme (juste \u00e0 temps, kaizen, kanban, cercles qualit\u00e9).",
            "En quoi Mobili\u00e8re Plus s'\u00e9loigne-t-elle du taylorisme pur ?",
            "Quel r\u00f4le de la polyvalence et de la remont\u00e9e d'information ?",
        ],
        correction="1) Juste \u00e0 temps, kaizen, kanban, autonomisation machines, cercles qualit\u00e9, polyvalence.\n\n2) Remont\u00e9e info base\u2192haut, polyvalence (vs sp\u00e9cialisation), am\u00e9lioration continue participative.\n\n3) Polyvalence = flexibilit\u00e9. Remont\u00e9e info = d\u00e9tection probl\u00e8mes terrain, innovation, motivation.",
        attendu="Principes toyotisme, comparaison Taylor, polyvalence.",
    ),
    dict(
        sid="e6", title="Organisation souple et lean occidental",
        support="Le lean management occidental chez Mobili\u00e8re Plus vise r\u00e9duction gaspillages et participation salari\u00e9s. Risques identifi\u00e9s : stress sur cadences (+12 % productivit\u00e9 en 2 ans), image n\u00e9gative (lean = plans sociaux). Le CSE a obtenu des pauses suppl\u00e9mentaires et un comit\u00e9 ergonomie. D\u00e9centralisation du pouvoir : op\u00e9rateurs peuvent arr\u00eater la ligne.",
        consigne="Pr\u00e9sente le lean management occidental, ses b\u00e9n\u00e9fices et ses risques sociaux.",
        questions=[
            "Qu'est-ce que le lean management occidental ?",
            "Quels b\u00e9n\u00e9fices et risques chez Mobili\u00e8re Plus ?",
            "Comment concilier lean et conditions de travail ?",
        ],
        correction="1) Adaptation toyotisme : r\u00e9duction gaspillages, participation salari\u00e9s, am\u00e9lioration continue.\n\n2) B\u00e9n\u00e9fices : productivit\u00e9 +12 %. Risques : stress, fatigue, image plans sociaux.\n\n3) Comit\u00e9 ergonomie, pauses, droit arr\u00eat ligne, dialogue CSE, d\u00e9centralisation pouvoir.",
        attendu="D\u00e9finition lean occidental, b\u00e9n\u00e9fices/risques, conciliation sociale.",
    ),
    dict(
        sid="e7", title="Goulots d'\u00e9tranglement (TOC)",
        support="La VSM r\u00e9v\u00e8le l'atelier finition comme goulot : 100 % des pi\u00e8ces y passent, capacit\u00e9 850 pi\u00e8ces/j vs 920 demand\u00e9es. Mobili\u00e8re Plus applique la Theory of Constraints : buffer de 50 pi\u00e8ces avant finition, heures modulables, sous-traitance ponctuelle finition. OTD passe de 87 % \u00e0 94 % en 3 mois.",
        consigne="Applique la th\u00e9orie des contraintes (TOC) au goulet finition.",
        questions=[
            "Qu'est-ce qu'un goulot d'\u00e9tranglement en production ?",
            "Pourquoi l'atelier finition est-il le goulot ?",
            "Quelles actions TOC Mobili\u00e8re Plus met-elle en \u0153uvre ?",
        ],
        correction="1) Goulot : \u00e9tape limitant le d\u00e9bit global (100 % flux, capacit\u00e9 < demande).\n\n2) 920 demand\u00e9es vs 850 capacit\u00e9/j, toutes pi\u00e8ces passent par finition.\n\n3) Buffer 50 pi\u00e8ces, heures modulables, sous-traitance ponctuelle \u2192 OTD 87\u219294 %.",
        attendu="D\u00e9finition goulot, identification, actions TOC chiffr\u00e9es.",
    ),
    dict(
        sid="e8", title="Cellules flexibles et polyvalence",
        support="Mobili\u00e8re Plus cr\u00e9e des cellules en U pour la gamme premium (produits diff\u00e9renci\u00e9s, petites s\u00e9ries) et conserve une ligne flow pour le standard (grandes s\u00e9ries). Op\u00e9rateurs cellules : polyvalents (3-4 comp\u00e9tences), autonomes, responsables qualit\u00e9. Ligne standard : sp\u00e9cialisation, supervision directe. Choix adapt\u00e9 \u00e0 la complexit\u00e9 produit.",
        consigne="Explique l'adaptation de l'organisation du travail au mode de production (s\u00e9rie vs diff\u00e9renci\u00e9).",
        questions=[
            "Compare cellules U (premium) et ligne flow (standard).",
            "Quel lien entre polyvalence et organisation souple ?",
            "Pourquoi deux modes coexistent chez Mobili\u00e8re Plus ?",
        ],
        correction="1) Cellules U : petites s\u00e9ries, polyvalence, autonomie. Ligne flow : grande s\u00e9rie, sp\u00e9cialisation, productivit\u00e9.\n\n2) Polyvalence = flexibilit\u00e9, adaptation demande, motivation (enrichissement t\u00e2ches).\n\n3) Environnement mixte : standard (stable, co\u00fbt) + premium (diff\u00e9renciation, qualit\u00e9).",
        attendu="Comparaison modes, polyvalence, coh\u00e9rence strat\u00e9gique.",
    ),
    dict(
        sid="e9", title="Indicateurs de pilotage production",
        support="Tableau de bord Mobili\u00e8re Plus : OTD (On Time Delivery) 94 %, WIP (Work In Progress) r\u00e9duit de 20 %, productivit\u00e9 +7 %, lead time 12 jours, taux rebuts 1,2 %. Objectifs 2026 : OTD 97 %, WIP \u221230 %, rebuts < 1 %. Reporting hebdomadaire atelier + mensuel direction.",
        consigne="Pr\u00e9sente les indicateurs de pilotage de la production et interpr\u00e8te les r\u00e9sultats.",
        questions=[
            "D\u00e9finis OTD, WIP, lead time et productivit\u00e9.",
            "Interpr\u00e8te les r\u00e9sultats actuels et les objectifs 2026.",
            "Quel r\u00f4le du reporting hebdomadaire vs mensuel ?",
        ],
        correction="1) OTD : livraisons \u00e0 temps. WIP : encours production. Lead time : d\u00e9lai total. Productivit\u00e9 : output/input.\n\n2) OTD 94 % (cible 97 %), WIP \u221220 % (cible \u221230 %), productivit\u00e9 +7 %, rebuts 1,2 % (cible < 1 %).\n\n3) Hebdo : actions rapides atelier. Mensuel : strat\u00e9gie direction, tendances.",
        attendu="D\u00e9finitions indicateurs, interpr\u00e9tation, r\u00f4le reporting.",
    ),
    dict(
        sid="e10", title="Synth\u00e8se pilotage production",
        support="Black Friday +30 % commandes pr\u00e9vues. Mobili\u00e8re Plus doit arbitrer : heures sup (co\u00fbt +85 000 \u20ac), sous-traitance finition (120 000 \u20ac, d\u00e9lai +2 j), stock temporaire composants (+180 000 \u20ac BFR), refus commandes (perte CA 400 000 \u20ac). Capacit\u00e9 finition goulet : 850/j, pic demand\u00e9 1 100/j pendant 10 jours.",
        consigne="Propose un plan de capacit\u00e9 temporaire mobilisant lean, flux tendu et TOC.",
        questions=[
            "Calcule le d\u00e9ficit de capacit\u00e9 finition sur 10 jours.",
            "Compare les quatre options (heures sup, sous-traitance, stock, refus).",
            "Quelle strat\u00e9gie mixte recommandes-tu ?",
        ],
        correction="1) D\u00e9ficit : (1 100 \u2212 850) \u00d7 10 = 2 500 pi\u00e8ces.\n\n2) Heures sup : 85 k\u20ac. Sous-traitance : 120 k\u20ac, +2 j d\u00e9lai. Stock : +180 k\u20ac BFR. Refus : \u2212400 k\u20ac CA.\n\n3) Mixte : heures sup + sous-traitance partielle (1 500 pi\u00e8ces), stock s\u00e9curit\u00e9 minimal. \u00c9viter refus. Lisser avec pr\u00e9commandes.",
        attendu="Calcul d\u00e9ficit, comparaison options, strat\u00e9gie mixte.",
    ),
    dict(
        sid="cas1", title="\u00c9tude de cas : Retards livraison",
        support="OTD Mobili\u00e8re Plus tombe \u00e0 87 % (cible 95 %). Clients enseigne d\u00e9senchant\u00e9s, p\u00e9nalit\u00e9s contractuelles 120 000 \u20ac. Diagnostic : goulot finition, kanban insuffisant avant goulot, absence buffer, planification charge d\u00e9s\u00e9quilibr\u00e9e (92 % th\u00e9orique mais pics non liss\u00e9s). Lead time 14 jours vs 12 promis.",
        consigne="R\u00e9alise un diagnostic lean complet et un plan d'action 90 jours.",
        questions=[
            "Cartographie le flux (VSM simplifi\u00e9e) et identifie le goulot.",
            "Analyse les causes des retards (kanban, buffer, planification).",
            "Propose au moins quatre actions lean chiffr\u00e9es.",
            "D\u00e9finis des indicateurs cibles \u00e0 90 jours.",
            "Plan de communication clients enseigne.",
        ],
        correction="1) Flux d\u00e9coupe\u2192assemblage\u2192finition\u2192exp\u00e9. Goulot : finition (850/j vs 920+ demand\u00e9).\n\n2) Pas de buffer, kanban ne prot\u00e8ge pas le goulot, pics non anticip\u00e9s.\n\n3) Buffer 50 pi\u00e8ces, heures modulables finition, kanban d\u00e9di\u00e9 goulot, lissage charge.\n\n4) OTD cible 95 %, lead time 12 j, WIP \u221210 %.\n\n5) Transparence d\u00e9lais, plan rattrapage, compensation p\u00e9nalit\u00e9s partielle.",
        attendu="Diagnostic OTD complet, plan 90 jours chiffr\u00e9.",
    ),
    dict(
        sid="cas2", title="\u00c9tude de cas : Nouvelle usine agile",
        support="Investissement usine 8 M\u20ac (Laval 2) : concept usine 4.0 lean, MES int\u00e9gr\u00e9, cellules flexibles, effectif \u22125 % mais mont\u00e9e comp\u00e9tences (+120 h formation/salari\u00e9). CSE inquiet (plans sociaux). Client exige OTD 97 % et tra\u00e7abilit\u00e9. Capacit\u00e9 +40 % vs site actuel. D\u00e9lai mise en service : 24 mois.",
        consigne="Con\u00e7ois l'organisation de la nouvelle usine (lean, SI, RH, KPI).",
        questions=[
            "Quels principes lean et toyotisme int\u00e9grer ?",
            "Quel SI de pilotage (MES, ERP, IoT) ?",
            "Plan formation et accompagnement social (CSE).",
            "Risques du projet et mesures de mitigation.",
            "KPI cibles \u00e0 24 mois.",
        ],
        correction="1) Flux tendu, cellules flexibles, kaizen, kanban, 5S, polyvalence.\n\n2) MES temps r\u00e9el, ERP int\u00e9gr\u00e9, capteurs IoT maintenance pr\u00e9dictive.\n\n3) 120 h formation, reclassement \u22125 % n\u00e9goci\u00e9 CSE, comit\u00e9s ergonomie.\n\n4) Risques : social, d\u00e9passement budget, retard. Mitigation : dialogue CSE, phasage, pilotes.\n\n5) OTD 97 %, lead time 10 j, productivit\u00e9 +15 %, rebuts < 0,8 %.",
        attendu="Projet usine 4.0 lean structur\u00e9, dimension sociale int\u00e9gr\u00e9e.",
    ),
]

CH9 = [
    dict(
        sid="e1", title="Acteurs internes de l'organisation",
        support="CleanEco (Montpellier, nettoyage professionnel, 9 M\u20ac CA, 320 agents) compte : direction familiale (2 actionnaires), 25 encadrants, 320 agents de propret\u00e9, CSE 11 membres \u00e9lus, d\u00e9l\u00e9gu\u00e9s syndicaux (CGT, CFDT). Chaque acteur a un r\u00f4le et des attentes sp\u00e9cifiques : dirigeants fixent strat\u00e9gie et rentabilit\u00e9, cadres organisent et contr\u00f4lent, agents fabriquent la prestation, repr\u00e9sentants salari\u00e9s d\u00e9fendent conditions de travail.",
        consigne="Identifie les acteurs internes de CleanEco et pr\u00e9sente leurs r\u00f4les et attentes respectifs.",
        questions=[
            "Quels sont les principaux acteurs internes d'une organisation ?",
            "Pr\u00e9sente le r\u00f4le et les attentes de chaque acteur chez CleanEco.",
            "Pourquoi le management doit-il prendre en compte toutes ces attentes ?",
        ],
        correction="1) Dirigeants/actionnaires, cadres, salari\u00e9s, repr\u00e9sentants (CSE, syndicats).\n\n2) Direction : strat\u00e9gie, b\u00e9n\u00e9fices. Cadres : organisation, performance \u00e9quipes. Agents : bonnes conditions, salaire. CSE/syndicats : Code du travail, int\u00e9r\u00eats salari\u00e9s.\n\n3) Ignorer une cat\u00e9gorie = conflits, turnover, baisse performance, risques juridiques.",
        attendu="Quatre cat\u00e9gories acteurs, r\u00f4les/attentes pr\u00e9cis, justification management.",
    ),
    dict(
        sid="e2", title="Int\u00e9r\u00eats convergents et divergents",
        support="CleanEco : la direction vise +2 pts de marge (objectif actionnaires), les agents r\u00e9clament +4 % salaire (NAO), les clients publics exigent prix stables et qualit\u00e9. Int\u00e9r\u00eats divergents : gr\u00e8ve 2 jours site a\u00e9roport (prime nuit refus\u00e9e). Int\u00e9r\u00eats convergents : accord QVT 2024 (salles repos, formation) \u2192 absent\u00e9isme \u22123 pts, satisfaction clients +5 pts.",
        consigne="Distingue int\u00e9r\u00eats convergents et divergents \u00e0 partir des exemples CleanEco et du cours (McDonald's Marseille, Air France).",
        questions=[
            "D\u00e9finis int\u00e9r\u00eats convergents et divergents.",
            "Classe les situations CleanEco en convergents ou divergents.",
            "Comment passer de la divergence \u00e0 la convergence ?",
        ],
        correction="1) Convergents : int\u00e9r\u00eats communs, relations partenariales. Divergents : int\u00e9r\u00eats oppos\u00e9s, conflits.\n\n2) Divergents : marge vs salaire, gr\u00e8ve prime nuit. Convergents : QVT \u2192 absent\u00e9isme \u22123 pts, satisfaction +5 pts (comme Air France).\n\n3) Dialogue, n\u00e9gociation, m\u00e9diation, recherche win-win (QVT b\u00e9n\u00e9ficie les deux parties).",
        attendu="D\u00e9finitions, classification support, solutions convergence.",
    ),
    dict(
        sid="e3", title="Culture d'organisation",
        support="CleanEco affiche des valeurs : respect, fiabilit\u00e9, \u00e9cologie. Rituel mensuel \u00ab CleanEco d'Or \u00bb r\u00e9compense le meilleur agent. Mythe fondateur : cr\u00e9ation par un ancien agent de propret\u00e9 devenu entrepreneur. Pourtant turnover 22 %, enqu\u00eate interne : 45 % des agents estiment que les valeurs ne se traduisent pas sur le terrain (cadences \u00e9lev\u00e9es, mat\u00e9riel v\u00e9tuste). \u00c9cart discours/pratique.",
        consigne="D\u00e9finis la culture d'organisation et analyse celle de CleanEco (valeurs, mythes, rituels, symboles).",
        questions=[
            "Qu'est-ce que la culture d'organisation ?",
            "Identifie valeurs, mythes, rituels et symboles chez CleanEco.",
            "Explique l'\u00e9cart entre culture affich\u00e9e et v\u00e9cue (turnover 22 %).",
        ],
        correction="1) Ensemble valeurs, mythes, rituels, symboles assurant coh\u00e9rence et adh\u00e9sion (ex. Apple, Think different).\n\n2) Valeurs : respect, fiabilit\u00e9, \u00e9cologie. Mythe : fondateur ancien agent. Rituel : CleanEco d'Or. Symboles : label \u00e9cologique.\n\n3) \u00c9cart discours/pratique : cadences, mat\u00e9riel \u2192 turnover 22 %, 45 % sceptiques. Culture d\u00e9clarative vs v\u00e9cue.",
        attendu="D\u00e9finition culture, \u00e9l\u00e9ments identifi\u00e9s, analyse \u00e9cart.",
    ),
    dict(
        sid="e4", title="Dynamique de groupe",
        support="\u00c9quipe de 12 agents sur un immeuble tertiaire Montpellier : conflit sur r\u00e9partition des zones (A/B/C). Deux sous-groupes, communication tendue, absent\u00e9isme +40 % sur le site. La RH organise une m\u00e9diation : r\u00e9union collective, r\u00e9partition transparente bas\u00e9e sur crit\u00e8res objectifs (surface, \u00e9tages). Kurt Lewin : dynamique = interd\u00e9pendance, coh\u00e9sion, sentiment appartenance. Leadership du chef d'\u00e9quipe essentiel.",
        consigne="Analyse la dynamique de groupe de l'\u00e9quipe tertiaire et le r\u00f4le du leadership.",
        questions=[
            "D\u00e9finis dynamique de groupe (Lewin) et coh\u00e9sion.",
            "Quels sympt\u00f4mes de dysfonctionnement sur le site tertiaire ?",
            "Comment la m\u00e9diation RH restaure-t-elle la coop\u00e9ration ?",
        ],
        correction="1) Dynamique : interd\u00e9pendance membres, coh\u00e9sion, appartenance, \u00e9changes, d\u00e9cisions groupe. Leadership f\u00e9d\u00e8re.\n\n2) Sous-groupes, conflit zones, communication tendue, absent\u00e9isme +40 %.\n\n3) M\u00e9diation : r\u00e9union, crit\u00e8res objectifs, transparence \u2192 confiance, coh\u00e9sion restaur\u00e9e.",
        attendu="D\u00e9finition Lewin, sympt\u00f4mes, m\u00e9diation expliqu\u00e9e.",
    ),
    dict(
        sid="e5", title="RSE et r\u00e9seaux sociaux d'entreprise",
        support="CleanEco d\u00e9ploie un RSE interne (R\u00e9seau Social d'Entreprise) : 280 inscrits, forum bonnes pratiques, annuaire comp\u00e9tences, chat inter-sites. Agents \u00e9loign\u00e9s g\u00e9ographiquement se connectent. Efficacit\u00e9 : recherche info \u221260 % temps. Parall\u00e8lement, RSE au sens Responsabilit\u00e9 Soci\u00e9tale : produits \u00e9colabel, 8 % contrats insertion, charte fournisseurs.",
        consigne="Distingue RSE (r\u00e9seau social d'entreprise) et RSE (responsabilit\u00e9 soci\u00e9tale). Analyse leurs apports.",
        questions=[
            "Qu'est-ce qu'un r\u00e9seau social d'entreprise (RSE interne) ?",
            "Quels apports pour CleanEco (communication, efficacit\u00e9, coh\u00e9sion) ?",
            "Comment la RSE soci\u00e9tale renforce-t-elle la coh\u00e9rence des acteurs ?",
        ],
        correction="1) RSE interne : espace communautaire salari\u00e9s (forum, chat, partage info), comme r\u00e9seau social priv\u00e9.\n\n2) 280 inscrits, bonnes pratiques, \u221260 % temps recherche info, rapprochement g\u00e9ographique.\n\n3) RSE soci\u00e9tale : \u00e9colabel, insertion 8 %, charte fournisseurs \u2192 valeurs partag\u00e9es, fiert\u00e9, attractivit\u00e9.",
        attendu="Distinction deux RSE, apports chiffr\u00e9s, coh\u00e9rence acteurs.",
    ),
    dict(
        sid="e6", title="Dialogue social et QVT",
        support="CleanEco m\u00e8ne la NAO annuelle (N\u00e9gociation Annuelle Obligatoire) : 2024 aboutit \u00e0 +2,8 % salaire + participation + accord QVT (salles repos, 2 j formations/an). CSE consult\u00e9 sur restructuration site N\u00eemes. D\u00e9l\u00e9gu\u00e9s syndicaux CGT/CFDT pr\u00e9sents. Le dialogue social structure les relations direction/repr\u00e9sentants salari\u00e9s.",
        consigne="Pr\u00e9sente le dialogue social et son r\u00f4le dans la prise en compte des attentes salari\u00e9s.",
        questions=[
            "Quel r\u00f4le des repr\u00e9sentants du personnel (CSE, syndicats) ?",
            "Analyse la NAO 2024 et l'accord QVT.",
            "Pourquoi consulter le CSE sur la restructuration N\u00eemes ?",
        ],
        correction="1) CSE/syndicats : transmettre r\u00e9clamations, repr\u00e9senter int\u00e9r\u00eats salari\u00e9s, n\u00e9gocier accords.\n\n2) NAO : +2,8 % + participation + QVT (repos, formation) = int\u00e9r\u00eats convergents partiels.\n\n3) Obligation l\u00e9gale (Code travail), anticipation conflits, qualit\u00e9 d\u00e9cision.",
        attendu="R\u00f4le repr\u00e9sentants, NAO analys\u00e9e, consultation l\u00e9gale.",
    ),
    dict(
        sid="e7", title="Conflits et m\u00e9diation",
        support="Gr\u00e8ve 2 jours site a\u00e9roport Montpellier : 40 agents, demande prime nuit (+180 \u20ac/mois). M\u00e9dia local, client (a\u00e9roport) menace r\u00e9siliation contrat 1,2 M\u20ac/an. M\u00e9diation aboutit : prime partielle 90 \u20ac, r\u00e9organisation horaires, 4 semaines d'essai. Rappel McDonald's Marseille : gr\u00e8ve longue pour conditions de travail (int\u00e9r\u00eats divergents).",
        consigne="Analyse le conflit collectif et la m\u00e9diation. Compare avec l'exemple McDonald's du cours.",
        questions=[
            "Qu'est-ce qu'un conflit d'int\u00e9r\u00eats divergents ?",
            "Quels enjeux pour CleanEco (agents, direction, client) ?",
            "La m\u00e9diation est-elle une solution durable ?",
        ],
        correction="1) Acteurs aux int\u00e9r\u00eats oppos\u00e9s, relations conflictuelles (gr\u00e8ve, revendications).\n\n2) Agents : prime. Direction : co\u00fbt, image. Client : continuit\u00e9 service, menace 1,2 M\u20ac.\n\n3) Compromis (90 \u20ac vs 180 \u20ac), essai 4 sem. Durable si suivi QVT et dialogue continu.",
        attendu="Conflit analys\u00e9, enjeux triples, \u00e9valuation m\u00e9diation.",
    ),
    dict(
        sid="e8", title="Communaut\u00e9s de pratique et coop\u00e9ration",
        support="CleanEco lance une communaut\u00e9 de pratique \u00ab techniques eco-nettoyage \u00bb : 35 agents experts \u00e9changent savoir-faire, fiches m\u00e9thodes, retours terrain. R\u00e9sultats : uniformisation qualit\u00e9 (+8 % satisfaction clients), mont\u00e9e comp\u00e9tences, sentiment reconnaissance. Mode projet d\u00e9ploy\u00e9 pour appel d'offres h\u00f4pital : \u00e9quipe pluridisciplinaire, d\u00e9lai 6 semaines.",
        consigne="Explique communaut\u00e9s de pratique et organisation en mode projet pour la coop\u00e9ration.",
        questions=[
            "D\u00e9finis communaut\u00e9 de pratique et mode projet.",
            "Quels r\u00e9sultats la communaut\u00e9 eco-nettoyage produit-elle ?",
            "Quels outils num\u00e9riques peuvent renforcer la coop\u00e9ration ?",
        ],
        correction="1) CoP : groupe partageant expertise, \u00e9change savoir-faire. Mode projet : \u00e9quipe pluridisciplinaire, d\u00e9lai/budget d\u00e9finis.\n\n2) Qualit\u00e9 +8 %, comp\u00e9tences, reconnaissance. Projet h\u00f4pital : 6 semaines.\n\n3) RSE interne, outils gestion projet (Trello), chat, visioconf\u00e9rence.",
        attendu="D\u00e9finitions, r\u00e9sultats chiffr\u00e9s, outils num\u00e9riques.",
    ),
    dict(
        sid="e9", title="Engagement et outils collaboratifs",
        support="Enqu\u00eate engagement CleanEco : score 62/100. Leviers identifi\u00e9s : reconnaissance (CleanEco d'Or), formation (2 j/an), outils collaboratifs (Microsoft Teams d\u00e9ploy\u00e9, 78 % adoption). Plan action 2025 : mentorat, feedback trimestriel, RSE interne enrichi. Objectif score 75/100.",
        consigne="Pr\u00e9sente les leviers d'engagement et le r\u00f4le des outils collaboratifs num\u00e9riques.",
        questions=[
            "Qu'est-ce que l'engagement des salari\u00e9s ?",
            "Analyse le score 62/100 et les leviers propos\u00e9s.",
            "Quel r\u00f4le de Teams et du RSE interne dans l'engagement ?",
        ],
        correction="1) Engagement : implication, adh\u00e9sion aux objectifs, motivation durable.\n\n2) Score 62/100 = moyen. Leviers : reconnaissance, formation, mentorat, feedback.\n\n3) Teams (78 % adoption) : communication fluide. RSE interne : partage, appartenance \u2192 objectif 75/100.",
        attendu="D\u00e9finition engagement, diagnostic score, outils num\u00e9riques.",
    ),
    dict(
        sid="e10", title="Synth\u00e8se acteurs et RSE",
        support="Appel d'offres h\u00f4pital Montpellier : 2 M\u20ac/an, crit\u00e8res RSE 25 % de la note (produits \u00e9colabel, insertion, QVT, CO\u2082). CleanEco doit prouver coh\u00e9rence culture + RSE + performance sociale. Concurrent suspect\u00e9 greenwashing (all\u00e9gations non v\u00e9rifiables). CleanEco : 8 % insertion, \u00e9colabel, charte fournisseurs, mais turnover 22 % affaiblit l'argument QVT.",
        consigne="Pr\u00e9pare l'argumentaire CleanEco pour l'appel d'offres en mobilisant acteurs, culture, RSE.",
        questions=[
            "Quels crit\u00e8res RSE p\u00e8seront dans la note (25 %) ?",
            "Quels points forts et faibles de CleanEco ?",
            "Comment r\u00e9pondre au risque greenwashing du concurrent ?",
        ],
        correction="1) \u00c9colabel, insertion, QVT, empreinte CO\u2082 (25 % note).\n\n2) Forces : \u00e9colabel, 8 % insertion, charte. Faiblesse : turnover 22 %, \u00e9cart culture.\n\n3) Preuves factuelles (audits, certifications), transparence, ne pas d\u00e9nigrer mais diff\u00e9rencier par tra\u00e7abilit\u00e9.",
        attendu="Crit\u00e8res AO, SWOT CleanEco, strat\u00e9gie anti-greenwashing.",
    ),
    dict(
        sid="cas1", title="\u00c9tude de cas : Gr\u00e8ve et n\u00e9gociation",
        support="Gr\u00e8ve site a\u00e9roport : 40 agents, 2 jours, prime nuit, m\u00e9dia local, client menace r\u00e9siliation 1,2 M\u20ac/an. Direction propose +2 % g\u00e9n\u00e9ral vs +4 % demand\u00e9. CSE mobilis\u00e9. Turnover secteur 25 %. CleanEco a d\u00e9j\u00e0 perdu 1 contrat mairie en 2024 (retards).",
        consigne="R\u00e9dige une strat\u00e9gie de gestion du conflit : acteurs, n\u00e9gociation, communication, accord durable.",
        questions=[
            "Cartographie les acteurs et leurs int\u00e9r\u00eats.",
            "Analyse les int\u00e9r\u00eats divergents et convergents possibles.",
            "Propose une strat\u00e9gie de n\u00e9gociation (mandat, concessions, calendrier).",
            "Plan de communication (agents, client, m\u00e9dias).",
            "Accord durable : clauses de suivi et QVT.",
        ],
        correction="1) Agents (prime), direction (co\u00fbt/marge), client (continuit\u00e9), CSE (m\u00e9diation), m\u00e9dias (image).\n\n2) Divergents : prime, co\u00fbt. Convergents : QVT \u2192 r\u00e9tention, qualit\u00e9 service client.\n\n3) Mandat n\u00e9gociateur, prime partielle 90 \u20ac, +2,8 % g\u00e9n\u00e9ral, essai 4 sem.\n\n4) Transparence client, communiqu\u00e9 presse, r\u00e9union agents.\n\n5) Comit\u00e9 suivi trimestriel, indicateurs absent\u00e9isme, revue horaires.",
        attendu="Gestion conflit compl\u00e8te chapitre 9, accord durable.",
    ),
    dict(
        sid="cas2", title="\u00c9tude de cas : RSE et appel d'offres",
        support="March\u00e9 h\u00f4pital 2 M\u20ac/an, RSE 25 % note. CleanEco : \u00e9colabel, 8 % insertion, charte fournisseurs, QVT partielle. Concurrent EcoClean : discours vert agressif, 0 preuve audit. Jury : directeur achats + responsable RSE h\u00f4pital + usager repr\u00e9sentant. Dossier limit\u00e9 40 pages.",
        consigne="R\u00e9dige l'argumentaire diff\u00e9renciant CleanEco et identifie le risque greenwashing concurrent.",
        questions=[
            "Preuves RSE v\u00e9rifiables de CleanEco (indicateurs, certifications).",
            "Analyse risque greenwashing EcoClean.",
            "Argumentaire diff\u00e9renciant structur\u00e9 (4 axes minimum).",
            "Indicateurs de performance sociale \u00e0 pr\u00e9senter.",
            "Recommandation commerciale finale.",
        ],
        correction="1) \u00c9colabel certifi\u00e9, 8 % insertion (contrats nominatifs), charte fournisseurs audit\u00e9e, CO\u2082 mesur\u00e9.\n\n2) EcoClean : all\u00e9gations sans audit, risque r\u00e9putationnel si d\u00e9nonc\u00e9.\n\n3) Axes : produits (\u00e9colabel), social (insertion chiffr\u00e9e), QVT (accords sign\u00e9s), gouvernance (transparence).\n\n4) Turnover, absent\u00e9isme, heures formation, satisfaction agents.\n\n5) Miser sur preuves > discours, proposer audit conjoint, corriger turnover avant soutenance.",
        attendu="Argumentaire RSE cr\u00e9dible, greenwashing identifi\u00e9, recommandation.",
    ),
]

CH10 = [
    dict(
        sid="e1", title="Styles de direction Likert",
        support="ServicePlus (Paris, services B2B, 15 M\u20ac CA, 180 salari\u00e9s) : le bureau d'\u00e9tudes fonctionne en style consultatif (r\u00e9unions hebdo, avis sollicit\u00e9s). L'astreinte 24/7 est en style autoritaire (consignes strictes, proc\u00e9dures). Le PDG tend vers le participatif pour les projets innovants (budget d\u00e9l\u00e9gu\u00e9). Likert : autoritaire, paternaliste, consultatif, participatif. Plus le style est participatif, moins le pouvoir est concentr\u00e9.",
        consigne="Pr\u00e9sente les quatre styles Likert et identifie ceux utilis\u00e9s chez ServicePlus.",
        questions=[
            "Cite et d\u00e9finis les quatre styles de direction Likert.",
            "Quel style pour chaque situation ServicePlus ? Justifie.",
            "Pourquoi un m\u00eame dirigeant adapte-t-il son style selon le contexte ?",
        ],
        correction="1) Autoritaire (ordres, peur), paternaliste (autorit\u00e9 + r\u00e9compenses), consultatif (avis sollicit\u00e9s), participatif (d\u00e9cisions collectives).\n\n2) Bureau d'\u00e9tudes : consultatif. Astreinte : autoritaire (s\u00e9curit\u00e9). Projets innovants : participatif.\n\n3) Contexte (urgence, comp\u00e9tence, enjeu) n\u00e9cessite styles diff\u00e9rents. Start-ups favorisent participatif (innovation).",
        attendu="Quatre styles d\u00e9finis, application ServicePlus, adaptation contextuelle.",
    ),
    dict(
        sid="e2", title="Motivation intrins\u00e8que et extrins\u00e8que",
        support="Enqu\u00eate ServicePlus : 58 % motiv\u00e9s par reconnaissance (intrins\u00e8que), 42 % par r\u00e9mun\u00e9ration variable (extrins\u00e8que). Herzberg : facteurs moteurs (internes) vs hygi\u00e8ne (externes). Maslow : de besoins physiologiques \u00e0 accomplissement. Un salari\u00e9 bureau d'\u00e9tudes cite \u00ab fiert\u00e9 de voir mon projet d\u00e9ploy\u00e9 \u00bb (intrins\u00e8que). Commercial : \u00ab bonus trimestriel \u00bb (extrins\u00e8que).",
        consigne="Distingue motivation intrins\u00e8que et extrins\u00e8que. Mobilise Herzberg et Maslow.",
        questions=[
            "D\u00e9finis motivations intrins\u00e8ques et extrins\u00e8ques.",
            "Classe les exemples ServicePlus selon Herzberg (moteurs vs hygi\u00e8ne).",
            "Quelles limites de la pyramide Maslow en organisation ?",
        ],
        correction="1) Intrins\u00e8que : plaisir activit\u00e9, accomplissement. Extrins\u00e8que : r\u00e9compense externe (salaire, reconnaissance).\n\n2) Moteurs : fiert\u00e9 projet, reconnaissance. Hygi\u00e8ne : r\u00e9mun\u00e9ration variable (absence = insatisfaction, pr\u00e9sence \u2260 motivation durable).\n\n3) Maslow individuel, peu collectif. N'explique pas dynamique groupe ni culture.",
        attendu="D\u00e9finitions, classification Herzberg, limites Maslow.",
    ),
    dict(
        sid="e3", title="R\u00e9mun\u00e9ration fixe et variable",
        support="Commerciaux ServicePlus : fixe 38 k\u20ac + variable 15 % CA individuel (plafond 22 k\u20ac). Prime collective QVT 800 \u20ac max/an si absent\u00e9isme < 3 %. Perception d'in\u00e9quit\u00e9 : top performer 58 k\u20ac vs junior 41 k\u20ac. Turnover commerciaux 24 %. NAO 2025 : +2,8 % fixe + participation, CSE demandait +4 %.",
        consigne="Analyse la politique de r\u00e9mun\u00e9ration et son impact motivation/\u00e9quit\u00e9.",
        questions=[
            "Compare r\u00e9mun\u00e9ration fixe et variable. Quels objectifs ?",
            "Analyse l'in\u00e9quit\u00e9 per\u00e7ue et le turnover 24 %.",
            "La NAO 2025 r\u00e9pond-elle aux attentes salariales ?",
        ],
        correction="1) Fixe : s\u00e9curit\u00e9, attraction. Variable : performance, effort. Risque : concurrence interne, in\u00e9quit\u00e9.\n\n2) \u00c9cart 58 k\u20ac vs 41 k\u20ac = frustration juniors. Turnover 24 % = co\u00fbt, perte clients.\n\n3) +2,8 % < +4 % demand\u00e9. Participation compense partiellement. Insatisfaction possible.",
        attendu="Fixe/variable analys\u00e9s, in\u00e9quit\u00e9 et turnover, \u00e9valuation NAO.",
    ),
    dict(
        sid="e4", title="Mobilisation des ressources humaines",
        support="Programme ambassadeurs clients ServicePlus : 24 volontaires form\u00e9s, t\u00e9moignages clients, satisfaction +12 pts NPS. Mobilisation = rassembler \u00e9nergies pour objectifs performance. ServicePlus combine : communication interne (newsletter), reconnaissance (peer bonus 200 \u20ac), projets participatifs. Enqu\u00eate : 71 % se sentent mobilis\u00e9s sur projets ambassadeurs vs 48 % sur t\u00e2ches routini\u00e8res.",
        consigne="D\u00e9finis mobilisation des RH et analyse le programme ambassadeurs.",
        questions=[
            "Qu'est-ce que la mobilisation des ressources humaines ?",
            "Pourquoi les ambassadeurs sont-ils plus mobilis\u00e9s (71 % vs 48 %) ?",
            "Quels autres leviers de mobilisation chez ServicePlus ?",
        ],
        correction="1) Mobilisation : conjuguer \u00e9nergies des membres pour atteindre objectifs performance.\n\n2) Projet valorisant, autonomie, reconnaissance, lien client direct = motivation intrins\u00e8que.\n\n3) Newsletter, peer bonus, projets participatifs, style consultatif.",
        attendu="D\u00e9finition mobilisation, analyse 71/48 %, leviers identifi\u00e9s.",
    ),
    dict(
        sid="e5", title="Management participatif",
        support="ServicePlus lance des comit\u00e9s projet autonomes : budget d\u00e9l\u00e9gu\u00e9 50 000 \u20ac/projet, \u00e9quipes pluridisciplinaires, reporting mensuel seulement. Projet \u00ab onboarding client digital \u00bb : 4 mois, satisfaction onboarding +18 pts. Style participatif Likert : salari\u00e9s impliqu\u00e9s dans d\u00e9cisions et gestion. Start-ups favorisent ce mode (libre expression, bien-\u00eatre, innovation).",
        consigne="Pr\u00e9sente le management participatif et son application chez ServicePlus.",
        questions=[
            "Quelles caract\u00e9ristiques du style participatif Likert ?",
            "Analyse le projet onboarding (budget, autonomie, r\u00e9sultats).",
            "Quels pr\u00e9requis pour le management participatif ?",
        ],
        correction="1) Implication d\u00e9cisions, gestion partag\u00e9e, int\u00e9r\u00eat aux r\u00e9sultats, pouvoir d\u00e9centralis\u00e9.\n\n2) 50 k\u20ac d\u00e9l\u00e9gu\u00e9s, 4 mois, +18 pts satisfaction. Autonomie + responsabilit\u00e9.\n\n3) Comp\u00e9tences, confiance, culture ouverte, dirigeants form\u00e9s d\u00e9l\u00e9gation.",
        attendu="Participatif d\u00e9fini, projet analys\u00e9, pr\u00e9requis list\u00e9s.",
    ),
    dict(
        sid="e6", title="Feedback et reconnaissance",
        support="ServicePlus revoit entretiens annuels : feedback continu via app Peakon (pulse mensuel), entretiens semestriels. Peer bonus 200 \u20ac pour collaboration exemplaire. R\u00e9sultats : engagement +9 pts, 63 % salari\u00e9s satisfaits reconnaissance (vs 41 % avant). Herzberg : reconnaissance = facteur moteur intrins\u00e8que.",
        consigne="Explique le r\u00f4le du feedback et de la reconnaissance dans la motivation.",
        questions=[
            "Quelle diff\u00e9rence entre entretien annuel et feedback continu ?",
            "Analyse les r\u00e9sultats Peakon et peer bonus.",
            "Pourquoi la reconnaissance est-elle un facteur moteur Herzberg ?",
        ],
        correction="1) Feedback continu : ajustement rapide, dialogue permanent. Annuel seul = tardif, d\u00e9connect\u00e9 du quotidien.\n\n2) Engagement +9 pts, reconnaissance 41\u219263 %. Peakon + peer bonus efficaces.\n\n3) Reconnaissance = accomplissement, estime (Maslow), facteur interne durable (Herzberg).",
        attendu="Feedback continu vs annuel, r\u00e9sultats chiffr\u00e9s, Herzberg.",
    ),
    dict(
        sid="e7", title="D\u00e9l\u00e9gation et responsabilisation",
        support="Managers ServicePlus form\u00e9s d\u00e9l\u00e9gation (2 jours, 45 managers). N-1 pilote 3 KPI autonomes (d\u00e9lai r\u00e9ponse, satisfaction, taux r\u00e9solution). R\u00e9sultats : d\u00e9lai r\u00e9ponse 4h\u21922h, satisfaction +11 pts. D\u00e9l\u00e9gation = confiance + responsabilit\u00e9 + contr\u00f4le par r\u00e9sultats (standardisation r\u00e9sultats Mintzberg).",
        consigne="Pr\u00e9sente la d\u00e9l\u00e9gation comme levier de motivation et de performance.",
        questions=[
            "Qu'est-ce que la d\u00e9l\u00e9gation ? Quels b\u00e9n\u00e9fices pour le manager et le N-1 ?",
            "Analyse les r\u00e9sultats KPI autonomes du support.",
            "Lien d\u00e9l\u00e9gation / standardisation des r\u00e9sultats (Mintzberg) ?",
        ],
        correction="1) D\u00e9l\u00e9gation : confier t\u00e2ches/d\u00e9cisions avec responsabilit\u00e9. Manager : focus strat\u00e9gique. N-1 : autonomie, motivation.\n\n2) D\u00e9lai 4h\u21922h, satisfaction +11 pts. Responsabilisation efficace.\n\n3) Fixer objectifs (KPI), laisser autonomie moyens = standardisation r\u00e9sultats Mintzberg.",
        attendu="D\u00e9l\u00e9gation d\u00e9finie, KPI analys\u00e9s, lien Mintzberg.",
    ),
    dict(
        sid="e8", title="Co\u00fbt de la d\u00e9motivation",
        support="Turnover cadres ServicePlus : 19 % (secteur 14 %). Co\u00fbt remplacement cadre : 45 000 \u20ac (recrutement, formation, perte productivit\u00e9 6 mois). 12 d\u00e9parts 2024 = 540 000 \u20ac. Causes enqu\u00eate d\u00e9part : variable per\u00e7ue in\u00e9quitable (38 %), manque reconnaissance (31 %), surcharge (22 %). Absent\u00e9isme +1,8 pt.",
        consigne="Quantifie le co\u00fbt de la d\u00e9motivation et identifie les causes.",
        questions=[
            "Calcule le co\u00fbt total turnover cadres 2024.",
            "Identifie les trois causes principales de d\u00e9part.",
            "Quelles actions prioritaires pour r\u00e9duire turnover \u00e0 12 % ?",
        ],
        correction="1) 12 \u00d7 45 000 \u20ac = 540 000 \u20ac.\n\n2) Variable in\u00e9quitable (38 %), reconnaissance (31 %), surcharge (22 %).\n\n3) R\u00e9forme variable transparente, feedback/reconnaissance, r\u00e9partition charge, objectif 12 %.",
        attendu="Co\u00fbt 540 k\u20ac, causes identifi\u00e9es, plan action prioris\u00e9.",
    ),
    dict(
        sid="e9", title="N\u00e9gociation salariale (NAO)",
        support="NAO 2025 ServicePlus : direction propose +2,8 % fixe + participation 1,2 mois salaire. CSE demande +4 % + prime inflation 500 \u20ac. R\u00e9sultat : +2,8 % + participation + prime 250 \u20ac one-shot. Inflation 2,1 %. Agents satisfaits \u00e0 52 %. Dialogue social : n\u00e9gociation obligatoire, recherche compromis.",
        consigne="Analyse la NAO 2025 comme processus de mobilisation et prise en compte des attentes.",
        questions=[
            "Quel r\u00f4le de la NAO dans le dialogue social ?",
            "Compare propositions direction, CSE et accord final.",
            "Pourquoi seulement 52 % satisfaits ? Que proposer ?",
        ],
        correction="1) NAO : n\u00e9gociation annuelle obligatoire salaires, participation, temps travail.\n\n2) Direction +2,8 %, CSE +4 % + 500 \u20ac. Accord : +2,8 % + participation + 250 \u20ac (compromis).\n\n3) +2,8 % > inflation mais < +4 % demand\u00e9. Communication transparente, plan reconnaissance non salariale.",
        attendu="NAO d\u00e9finie, compromis analys\u00e9, satisfaction expliqu\u00e9e.",
    ),
    dict(
        sid="e10", title="Synth\u00e8se direction et motivation",
        support="Fusion ServicePlus + NexCare (800 salari\u00e9s) : ServicePlus consultatif/participatif, NexCare autocratique (fondateur d\u00e9cide tout). Gr\u00e8ve symbolique 1 jour NexCare. Turnover post-fusion pr\u00e9vu +5 pts. Plan harmonisation : charte management, formation Likert 3 jours/manager, co-construction KPI, comit\u00e9s fusion parit\u00e9.",
        consigne="Propose un plan d'harmonisation des styles de direction post-fusion.",
        questions=[
            "Cartographie les styles ServicePlus vs NexCare.",
            "Identifie r\u00e9sistances et risques (gr\u00e8ve, turnover).",
            "Plan conduite changement sur 12 mois.",
            "Indicateurs de succ\u00e8s fusion manag\u00e9riale.",
        ],
        correction="1) ServicePlus : consultatif/participatif. NexCare : autocratique, pouvoir concentr\u00e9.\n\n2) R\u00e9sistance NexCare (habitudes), gr\u00e8ve symbolique, turnover +5 pts.\n\n3) Mois 1-3 : charte co-construite. 4-6 : formation Likert. 7-12 : KPI partag\u00e9s, \u00e9valuation.\n\n4) Turnover stabilis\u00e9, engagement enqu\u00eate, style participatif 60 % managers.",
        attendu="Styles contrast\u00e9s, plan 12 mois, KPI fusion.",
    ),
    dict(
        sid="cas1", title="\u00c9tude de cas : Turnover cadres commerciaux",
        support="Turnover commerciaux ServicePlus 24 % (12 d\u00e9parts/50). Variable per\u00e7ue in\u00e9quitable, top 58 k\u20ac vs junior 41 k\u20ac. Clients perdus : 3 comptes = 420 k\u20ac CA. Co\u00fbt remplacement 45 k\u20ac/cadre. Direction veut style consultatif mais managers astreinte restent autoritaires. Peakon : reconnaissance 41 % satisfaits.",
        consigne="R\u00e9dige un plan motivation/r\u00e9mun\u00e9ration sur 12 mois.",
        questions=[
            "Diagnostic motivation (Herzberg, Likert, r\u00e9mun\u00e9ration).",
            "Style direction adapt\u00e9 aux commerciaux.",
            "R\u00e9forme variable transparente (propositions chiffr\u00e9es).",
            "Plan reconnaissance et feedback.",
            "KPI cibles 12 mois (turnover, NPS, CA).",
        ],
        correction="1) Hygi\u00e8ne : variable in\u00e9quitable. Moteurs : reconnaissance insuffisante. Style mixte consultatif.\n\n2) Consultatif pour prospection, objectifs co-construits.\n\n3) Variable : 70 % CA collectif / 30 % individuel, plafond progressif, grille transparente.\n\n4) Peakon mensuel, peer bonus, entretiens semestriels.\n\n5) Turnover cible 12 %, NPS +10 pts, r\u00e9tention top 3 comptes.",
        attendu="Plan RH complet chapitre 10, KPI 12 mois.",
    ),
    dict(
        sid="cas2", title="\u00c9tude de cas : Fusion et styles Likert",
        support="Fusion ServicePlus (participatif) + NexCare (autocratique, 620 salari\u00e9s). Gr\u00e8ve symbolique NexCare jour J fusion. 45 managers \u00e0 former. Budget formation 180 k\u20ac. Alphabet/Google exemple : 20 % temps cr\u00e9ativit\u00e9. Klaxoon d\u00e9ploy\u00e9 pour ateliers co-construction.",
        consigne="Harmonise styles de direction et f\u00e9d\u00e8re les acteurs post-fusion.",
        questions=[
            "Cartographie styles et r\u00e9sistances par entit\u00e9.",
            "Plan conduite changement (formation, communication, outils).",
            "Charte management participatif progressif (contenu).",
            "R\u00f4le outils collaboratifs (Klaxoon, RSE interne).",
            "Indicateurs fusion \u00e0 18 mois.",
        ],
        correction="1) ServicePlus participatif/consultatif. NexCare autocratique. R\u00e9sistance changement, peur perte statut managers NexCare.\n\n2) Formation Likert 3 j, Klaxoon ateliers, communication PDG, co-construction charte.\n\n3) D\u00e9cisions consult\u00e9es, budget d\u00e9l\u00e9gu\u00e9 projets, feedback trimestriel, droit alerte.\n\n4) Klaxoon co-construction, RSE interne fusion, groupes projet parit\u00e9.\n\n5) Engagement +15 pts, turnover < 15 %, 70 % managers style consultatif+.",
        attendu="Fusion manag\u00e9riale structur\u00e9e, charte et outils, KPI 18 mois.",
    ),
]

CHAPTERS = {6: CH6, 7: CH7, 8: CH8, 9: CH9, 10: CH10}

if __name__ == "__main__":
    for ch, items in CHAPTERS.items():
        write_ch(ch, items)
