#!/usr/bin/env python3
"""Genere src/data/droit/chapters/*.ts, registry.ts et droitMissionCatalog.ts."""

from __future__ import annotations
import json
import os
import re

ROOT = os.path.join(os.path.dirname(__file__), "..", "src", "data", "droit")
CHAPTERS_DIR = os.path.join(ROOT, "chapters")

CHAPTER_LABELS = {
    1: "La formation du contrat",
    2: "L'ex\u00e9cution du contrat",
    3: "Le dommage r\u00e9parable",
    4: "Les diff\u00e9rents r\u00e9gimes de responsabilit\u00e9s",
    5: "Les moyens d'exon\u00e9ration de la responsabilit\u00e9",
}

# (id_suffix, title, difficulty, xp, minChars, type, support, consigne, questions, correctionModele, attendu, notions)
def ex(
    suffix, title, diff, xp, min_c, typ, support, consigne, questions, corr, attendu, notions
):
    return {
        "suffix": suffix,
        "title": title,
        "difficulty": diff,
        "xp": xp,
        "minChars": min_c,
        "type": typ,
        "support": support,
        "consigne": consigne,
        "questions": questions,
        "correctionModele": corr,
        "attendu": attendu,
        "notionsCibles": notions,
    }


CHAPTERS: dict[int, list] = {}

CHAPTERS[1] = [
    ex(
        "e1",
        "Le contrat au quotidien",
        "Facile",
        120,
        120,
        "Exercice",
        "L\u00e9a prend le bus pour aller au lyc\u00e9e : elle ach\u00e8te un ticket. \u00c0 la cantine, elle conclut un contrat de vente pour son repas. Le soir, elle signe un abonnement streaming en ligne.\nArticle 1101 du Code civil : le contrat est un accord de volont\u00e9s entre deux ou plusieurs personnes destin\u00e9 \u00e0 cr\u00e9er, modifier, transmettre ou \u00e9teindre des obligations.",
        "\u00c0 partir du support, d\u00e9finis le contrat et illustre avec deux exemples de la journ\u00e9e de L\u00e9a.",
        [
            "Quelle est la d\u00e9finition juridique du contrat (art. 1101) ?",
            "Cite deux contrats conclus par L\u00e9a dans la journ\u00e9e.",
            "Quelle obligation g\u00e9n\u00e8rent ces contrats pour chaque partie ?",
        ],
        "1) Contrat : accord de volont\u00e9s cr\u00e9ant des obligations.\n\n2) Exemples : transport (ticket), vente (repas), prestation de services (streaming).\n\n3) Chaque partie doit ex\u00e9cuter ce qu'elle a promis (payer, transporter, fournir l'acc\u00e8s).",
        "D\u00e9finition art. 1101, deux exemples, id\u00e9e d'obligation.",
        ["contrat", "accord de volont\u00e9s", "obligations"],
    ),
    ex(
        "e2",
        "Libert\u00e9 contractuelle",
        "Facile",
        130,
        130,
        "Exercice",
        "Article 1102 : chacun est libre de contracter ou non, de choisir son cocontractant et de d\u00e9terminer le contenu et la forme du contrat dans les limites fix\u00e9es par la loi.\nLimites cit\u00e9es dans le cours : assurance obligatoire, clauses abusives interdites, contrat d'adh\u00e9sion (CDI, vente avec un professionnel).",
        "Explique la libert\u00e9 contractuelle et donne une limite pr\u00e9vue par le cours.",
        [
            "Que signifie la libert\u00e9 contractuelle (art. 1102) ?",
            "Donne un exemple de limite impos\u00e9e par la loi.",
            "Qu'est-ce qu'un contrat d'adh\u00e9sion ?",
        ],
        "1) Libert\u00e9 : choix de contracter, du partenaire et du contenu (dans la loi).\n\n2) Limite : assurance obligatoire ou interdiction de clauses abusives.\n\n3) Adh\u00e9sion : une partie impose un contrat type, peu de n\u00e9gociation.",
        "Trois libert\u00e9s, une limite, notion d'adh\u00e9sion.",
        ["libert\u00e9 contractuelle", "contrat d'adh\u00e9sion"],
    ),
    ex(
        "e3",
        "Obligations de donner, faire et ne pas faire",
        "Facile",
        140,
        140,
        "Exercice",
        "Contrat de vente d'un v\u00e9lo : le vendeur doit transf\u00e9rer la propri\u00e9t\u00e9 (obligation de donner). Contrat de transport VTC : le chauffeur doit conduire le client (obligation de faire). Vente d'un fonds de commerce : le c\u00e9dant peut s'engager \u00e0 ne pas rouvrir un commerce concurrent \u00e0 proximit\u00e9 (obligation de ne pas faire).",
        "D\u00e9finis les trois types d'obligations et associe chaque exemple du support.",
        [
            "D\u00e9finis obligation de donner, de faire et de ne pas faire.",
            "Quel type pour la vente du v\u00e9lo ? Pour le VTC ?",
            "Quel type pour la clause de non-concurrence ?",
        ],
        "1) Donner = transf\u00e9rer un bien/droit ; faire = accomplir un acte ; ne pas faire = s'abstenir.\n\n2) V\u00e9lo = donner ; VTC = faire.\n\n3) Non-concurrence = ne pas faire.",
        "Trois d\u00e9finitions, trois exemples class\u00e9s.",
        ["obligation de donner", "obligation de faire", "obligation de ne pas faire"],
    ),
    ex(
        "e4",
        "Obligation de moyens ou de r\u00e9sultat",
        "Moyen",
        180,
        160,
        "Exercice",
        "Un m\u00e9decin doit mettre en \u0153uvre les traitements adapt\u00e9s mais n'est pas tenu de gu\u00e9rir (obligation de moyens). Dans une vente, le vendeur doit livrer le bien et l'acheteur doit payer (obligations de r\u00e9sultat).",
        "Distingue obligation de moyens et de r\u00e9sultat \u00e0 l'aide des exemples du cours.",
        [
            "D\u00e9finis obligation de moyens et de r\u00e9sultat.",
            "Pourquoi le m\u00e9decin est-il en obligation de moyens ?",
            "Pourquoi la vente est-elle en obligation de r\u00e9sultat ?",
        ],
        "1) Moyens = tout mettre en \u0153uvre sans garantir le but ; r\u00e9sultat = atteindre le r\u00e9sultat pr\u00e9vu.\n\n2) M\u00e9decin : gu\u00e9rison incertaine.\n\n3) Vente : transfert et paiement exigibles.",
        "Deux d\u00e9finitions, deux justifications.",
        ["obligation de moyens", "obligation de r\u00e9sultat"],
    ),
    ex(
        "e5",
        "Contrat de consommation et information",
        "Moyen",
        190,
        170,
        "Exercice",
        "Sur un site e-commerce, le prix doit \u00eatre annonc\u00e9 TTC en euros. Avant la commande, le professionnel doit communiquer les caract\u00e9ristiques essentielles du bien (art. L111-1 Code de la consommation).",
        "Explique ce qu'est un contrat de consommation et l'obligation d'information du professionnel.",
        [
            "Quand parle-t-on de contrat de consommation ?",
            "Que doit annoncer le professionnel sur le prix ?",
            "Quelles informations essentielles sur le produit ?",
        ],
        "1) Professionnel + consommateur (hors activit\u00e9 pro du client).\n\n2) Prix TTC, en euros, pas de modification apr\u00e8s acceptation.\n\n3) Caract\u00e9ristiques essentielles, s\u00e9curit\u00e9, mode d'emploi, etc.",
        "D\u00e9finition, r\u00e8gles prix et information.",
        ["contrat de consommation", "obligation d'information"],
    ),
    ex(
        "e6",
        "Droit de r\u00e9tractation en ligne",
        "Moyen",
        210,
        180,
        "Exercice",
        "Achat sur internet : d\u00e9lai de r\u00e9tractation de 14 jours (biens). D\u00e9marchage \u00e0 domicile : 14 jours. Assurance-vie : 30 jours. Le consommateur peut rompre unilat\u00e9ralement son contrat pendant ce d\u00e9lai (art. 1122 C. civ.).",
        "D\u00e9finis le droit de r\u00e9tractation et applique-le \u00e0 un achat en ligne annul\u00e9 sous 10 jours.",
        [
            "Qu'est-ce que le droit de r\u00e9tractation ?",
            "Quel d\u00e9lai pour un achat sur internet ?",
            "Que se passe-t-il si le client se r\u00e9tracte \u00e0 J+10 ?",
        ],
        "1) D\u00e9lai pour revenir sur son consentement (repentir).\n\n2) 14 jours pour achat de biens en ligne.\n\n3) Contrat rompu ; remboursement des sommes (frais de retour souvent \u00e0 la charge du client sauf r\u00e8gles sp\u00e9cifiques).",
        "D\u00e9finition, d\u00e9lai 14 j, cons\u00e9quence.",
        ["droit de r\u00e9tractation", "cyberconsommateur"],
    ),
    ex(
        "e7",
        "Offre et acceptation",
        "Moyen",
        230,
        190,
        "Exercice",
        "Un annonce immobili\u00e8re pr\u00e9cise prix et surface : offre ferme. Le candidat locataire envoie un dossier acceptant : acceptation. Le contrat est conclu quand l'offreur a connaissance de l'acceptation. L'offre est r\u00e9vocable tant qu'elle n'est pas accept\u00e9e.",
        "Explique la formation du contrat par offre et acceptation avec l'exemple locatif.",
        [
            "Qu'est-ce qu'une offre ?",
            "Qu'est-ce que l'acceptation ?",
            "Quand le contrat est-il form\u00e9 ?",
        ],
        "1) Offre = proposition de conclure (ferme, pr\u00e9cise).\n\n2) Acceptation = accord \u00e0 l'offre.\n\n3) \u00c0 la connaissance de l'acceptation par l'offreur ; obligations naissent.",
        "Offre, acceptation, moment de formation.",
        ["offre", "acceptation", "formation du contrat"],
    ),
    ex(
        "e8",
        "Vices du consentement",
        "Moyen",
        260,
        200,
        "Exercice",
        "Article 1130 : erreur, dol et violence vicient le consentement. Erreur = fausse repr\u00e9sentation (nature ou objet du contrat). Dol = man\u0153uvres ou mensonges. Violence = contrainte physique ou morale (art. 1140). Cons\u00e9quence : nullit\u00e9 relative (art. 1131).",
        "D\u00e9finis erreur, dol et violence et indique la sanction.",
        [
            "D\u00e9finis erreur, dol et violence.",
            "Donne un exemple pour chaque vice.",
            "Quelle sanction pour un contrat vici\u00e9 ?",
        ],
        "1) Erreur = se tromper ; dol = tromper autrui ; violence = contraindre.\n\n2) Ex. erreur sur l'objet ; dol sur un vice cach\u00e9 ; violence par menace.\n\n3) Nullit\u00e9 relative.",
        "Trois vices, exemples, nullit\u00e9 relative.",
        ["erreur", "dol", "violence", "nullit\u00e9 relative"],
    ),
    ex(
        "e9",
        "Capacit\u00e9 et nullit\u00e9",
        "Difficile",
        280,
        220,
        "Exercice",
        "Article 1145 : toute personne physique peut contracter sauf incapacit\u00e9 (mineur non \u00e9mancip\u00e9, majeur sous tutelle). Un mineur signe seul un cr\u00e9dit \u00e0 la consommation : contrat frapp\u00e9 de nullit\u00e9 relative.",
        "Explique la capacit\u00e9 \u00e0 contracter et la cons\u00e9quence pour le mineur du support.",
        [
            "Qu'est-ce que la capacit\u00e9 \u00e0 contracter ?",
            "Pourquoi le mineur est-il souvent incapable ?",
            "Quelle nullit\u00e9 pour ce contrat ?",
        ],
        "1) Aptitude juridique \u00e0 s'engager seul.\n\n2) Protection des mineurs.\n\n3) Nullit\u00e9 relative (int\u00e9r\u00eat des parties).",
        "Capacit\u00e9, incapacit\u00e9 mineur, nullit\u00e9 relative.",
        ["capacit\u00e9", "nullit\u00e9 relative"],
    ),
    ex(
        "e10",
        "Objet et cause du contrat",
        "Tres difficile",
        360,
        260,
        "Exercice",
        "L'objet doit exister, \u00eatre licite, d\u00e9termin\u00e9, possible et dans le commerce. La cause doit \u00eatre licite et morale. Vente de stup\u00e9fiants : objet illicite \u2192 nullit\u00e9 absolue. Achat d'un local pour ouvrir un tripot clandestin : cause illicite.",
        "Pr\u00e9sente les conditions d'objet et de cause et le type de nullit\u00e9 si elles manquent.",
        [
            "Cite trois conditions de l'objet du contrat.",
            "Qu'est-ce que la cause ?",
            "Quelle nullit\u00e9 si objet ou cause illicite ?",
        ],
        "1) Ex. licite, d\u00e9termin\u00e9, possible.\n\n2) Cause = motif licite du contrat.\n\n3) Nullit\u00e9 absolue (ordre public).",
        "Objet, cause, nullit\u00e9 absolue.",
        ["objet du contrat", "cause", "nullit\u00e9 absolue"],
    ),
    ex(
        "cas1",
        "\u00c9tude de cas : achat de smartphone en ligne",
        "Difficile",
        560,
        400,
        "Etude de cas",
        "Enora commande un smartphone 899 \u20ac TTC sur TechZone. Elle re\u00e7oit le colis \u00e0 J+3. \u00c0 J+8, elle se r\u00e9tracte (d\u00e9lai 14 jours). Le vendeur refuse le remboursement en invoquant une clause \u00ab pas de retour sur produits ouverts \u00bb en petits caract\u00e8res. Enora est \u00e9tudiante, 19 ans, sans autorisation parentale pour un cr\u00e9dit optionnel refus\u00e9.",
        "Structure : (1) contrat de consommation ? (2) droit de r\u00e9tractation ? (3) clause abusive ? (4) que conseiller \u00e0 Enora ?",
        [
            "S'agit-il d'un contrat de consommation ?",
            "Enora peut-elle encore se r\u00e9tracter \u00e0 J+8 ?",
            "La clause d'exclusion de retour est-elle valable ?",
            "Quels recours pour Enora ?",
        ],
        "1) Oui : pro + consommateur.\n\n2) Oui : 14 j pour achat en ligne.\n\n3) Clause probablement abusive (d\u00e9s\u00e9quilibre).\n\n4) R\u00e9tractation, signalement DGCCRF, m\u00e9diation consommation.",
        "Consommation, 14 j, clause abusive, recours.",
        ["contrat de consommation", "r\u00e9tractation", "clause abusive"],
    ),
    ex(
        "cas2",
        "\u00c9tude de cas : signature sous pression",
        "Tres difficile",
        620,
        450,
        "Etude de cas",
        "Marc signe un contrat de franchise caf\u00e9. Le franchisor avait laiss\u00e9 entendre que sans signature imm\u00e9diate, l'emplacement serait donn\u00e9 \u00e0 un concurrent et que sa famille \u00ab perdrait sa cr\u00e9dibilit\u00e9 \u00bb. Marc d\u00e9couvre ensuite des redevances cach\u00e9es non mentionn\u00e9es \u00e0 l'oral.\nArticles 1137 (dol) et 1140 (violence) du Code civil.",
        "Analyse les vices du consentement possibles et la sanction. Le contrat peut-il \u00eatre annul\u00e9 ?",
        [
            "Y a-t-il une violence morale (art. 1140) ?",
            "Y a-t-il un dol (art. 1137) ?",
            "Quelle nullit\u00e9 ?",
            "Que peut demander Marc au juge ?",
        ],
        "1) Pression morale possible (crainte, contrainte morale).\n\n2) Dol : dissimulation d'informations d\u00e9terminantes.\n\n3) Nullit\u00e9 relative.\n\n4) Annulation ou dommages selon preuves.",
        "Violence/dol analys\u00e9s, nullit\u00e9, demandes au juge.",
        ["dol", "violence", "nullit\u00e9 relative"],
    ),
]

# Chapters 2-5: abbreviated generation in same file - I'll add full content
CHAPTERS[2] = [
    ex("e1", "Force obligatoire du contrat", "Facile", 120, 120, "Exercice",
       "Article 1103 : les contrats l\u00e9galement form\u00e9s tiennent lieu de loi \u00e0 ceux qui les ont faits. Un salari\u00e9 ne peut pas modifier seul ses horaires sans accord de l'employeur.",
       "Explique la force obligatoire et illustre avec l'exemple du salari\u00e9.",
       ["Qu'est-ce que la force obligatoire ?", "Peut-on modifier un contrat seul (art. 1193) ?", "Exemple du salari\u00e9 ?"],
       "1) Contrat = loi des parties.\n\n2) Modification/r\u00e9vocation seulement par accord mutuel ou causes l\u00e9gales.\n\n3) Horaires : modification unilat\u00e9rale interdite.",
       "Force obligatoire, art. 1193, exemple.", ["force obligatoire"]),
    ex("e2", "Bonne foi dans l'ex\u00e9cution", "Facile", 130, 130, "Exercice",
       "Article 1104 : les contrats doivent \u00eatre n\u00e9goci\u00e9s, form\u00e9s et ex\u00e9cut\u00e9s de bonne foi. Un comptable qui refuse d'utiliser les outils informatiques de l'entreprise ex\u00e9cute mal son contrat.",
       "D\u00e9finis la bonne foi contractuelle et applique-la au comptable.",
       ["Que signifie ex\u00e9cuter de bonne foi ?", "Le comptable est-il de mauvaise foi ?", "Quelles qualit\u00e9s attendues ?"],
       "1) Honn\u00eatet\u00e9, loyaut\u00e9, coop\u00e9ration.\n\n2) Oui : entrave volontaire \u00e0 l'ex\u00e9cution.\n\n3) Faciliter le travail de l'autre partie.",
       "D\u00e9finition, application comptable.", ["bonne foi"]),
    ex("e3", "Effet relatif et stipulation pour autrui", "Facile", 140, 140, "Exercice",
       "Article 1165 : les conventions n'ont d'effet qu'entre les parties. Exception art. 1205 : stipulation pour autrui (assurance-vie : b\u00e9n\u00e9ficiaire tiers).",
       "Distingue effet relatif et stipulation pour autrui.",
       ["Qu'est-ce que l'effet relatif ?", "Pourquoi l'\u00e9pouse ne peut remplacer le mari malade au travail ?", "Exemple stipulation pour autrui ?"],
       "1) Contrat lie seulement les signataires.\n\n2) Madame Dupont n'est pas partie au contrat de travail.\n\n3) Assurance-vie : b\u00e9n\u00e9ficiaire cr\u00e9ancier sans avoir sign\u00e9.",
       "Effet relatif, exception assurance.", ["effet relatif", "stipulation pour autrui"]),
    ex("e4", "Exception d'inex\u00e9cution", "Moyen", 180, 160, "Exercice",
       "Contrat synallagmatique : M. Z. absent sans nouvelles ; l'entreprise peut suspendre le paiement des salaires tant qu'il n'ex\u00e9cute pas sa prestation.",
       "Explique l'exception d'inex\u00e9cution dans ce cas.",
       ["Qu'est-ce qu'un contrat synallagmatique ?", "Pourquoi suspendre les salaires ?", "Que doit prouver l'employeur ?"],
       "1) Prestations r\u00e9ciproques.\n\n2) Refuser sa propre prestation tant que l'autre n'a pas ex\u00e9cut\u00e9.\n\n3) Inex\u00e9cution du salari\u00e9.",
       "Synallagmatique, exception, preuve.", ["exception d'inex\u00e9cution"]),
    ex("e5", "Mise en demeure", "Moyen", 190, 170, "Exercice",
       "La mise en demeure est l'acte du cr\u00e9ancier pour exiger l'ex\u00e9cution (lettre recommand\u00e9e, huissier). Elle constate le retard et ouvre la voie \u00e0 l'ex\u00e9cution forc\u00e9e.",
       "D\u00e9finis la mise en demeure et son r\u00f4le avant l'action en justice.",
       ["Qu'est-ce qu'une mise en demeure ?", "Quelles formes possibles ?", "Quel lien avec l'ex\u00e9cution forc\u00e9e ?"],
       "1) Demande formelle d'ex\u00e9cuter.\n\n2) LRAR, mail, citation, huissier.\n\n3) \u00c9tape pr\u00e9alable \u00e0 contraindre le d\u00e9biteur.",
       "D\u00e9finition, formes, lien ex\u00e9cution forc\u00e9e.", ["mise en demeure"]),
    ex("e6", "Ex\u00e9cution forc\u00e9e : saisie et astreinte", "Moyen", 210, 180, "Exercice",
       "Saisie : biens vendus aux ench\u00e8res pour payer le cr\u00e9ancier (obligation de donner). Astreinte : somme par jour de retard (obligation de faire encore possible).",
       "Compare saisie et astreinte selon le type d'obligation.",
       ["Quand une saisie ?", "Qu'est-ce qu'une astreinte ?", "Ex\u00e9cution par \u00e9quivalent si ?"],
       "1) Obligation de donner.\n\n2) Sanction p\u00e9cuniaire quotidienne.\n\n3) Obligation de faire/de ne pas faire impossible.",
       "Saisie, astreinte, dommages-int\u00e9r\u00eats.", ["ex\u00e9cution forc\u00e9e", "astreinte"]),
    ex("e7", "Clause r\u00e9solutoire et clause p\u00e9nale", "Moyen", 230, 190, "Exercice",
       "Clause r\u00e9solutoire : r\u00e9solution si une partie n'ex\u00e9cute pas (retour au statu quo). Clause p\u00e9nale : dommages pr\u00e9vus d'avance en cas d'inex\u00e9cution.",
       "Distingue clause r\u00e9solutoire et clause p\u00e9nale.",
       ["Effet clause r\u00e9solutoire ?", "Effet clause p\u00e9nale ?", "Pourquoi les pr\u00e9voir \u00e0 l'avance ?"],
       "1) Fin du contrat, restitutions.\n\n2) Indemnit\u00e9 forfaitaire.\n\n3) Anticiper les litiges.",
       "Deux clauses compar\u00e9es.", ["clause r\u00e9solutoire", "clause p\u00e9nale"]),
    ex("e8", "Clauses abusives", "Moyen", 260, 200, "Exercice",
       "Art. L212-1 : clause abusive = d\u00e9s\u00e9quilibre significatif au d\u00e9triment du consommateur. Ex. : seul le pro peut attester la conformit\u00e9 du produit.",
       "D\u00e9finis clause abusive et donne un exemple. Quelle sanction ?",
       ["D\u00e9finition clause abusive ?", "Exemple dans un contrat de consommation ?", "Le contrat dispara\u00eet-il enti\u00e8rement ?"],
       "1) D\u00e9s\u00e9quilibre significatif.\n\n2) Ex. attestation unilat\u00e9rale de qualit\u00e9.\n\n3) Clause r\u00e9put\u00e9e non \u00e9crite, contrat subsiste.",
       "D\u00e9finition, exemple, non \u00e9crit.", ["clause abusive"]),
    ex("e9", "R\u00e9solution et r\u00e9siliation", "Difficile", 280, 220, "Exercice",
       "R\u00e9solution : an\u00e9antissement r\u00e9troactif (ex. vente : ordinateur non livr\u00e9 \u2192 remboursement). R\u00e9siliation : fin \u00e0 une date pour contrat \u00e0 ex\u00e9cution successive (forfait mobile).",
       "Ne confonds pas r\u00e9solution et r\u00e9siliation avec deux exemples.",
       ["R\u00e9solution : quand et effet ?", "R\u00e9siliation : quand et effet ?", "Exemple de chaque ?"],
       "1) Inex\u00e9cution, retour en arri\u00e8re.\n\n2) Contrat successif, fin simple.\n\n3) Vente vs abonnement t\u00e9l\u00e9com.",
       "Deux notions, deux exemples.", ["r\u00e9solution", "r\u00e9siliation"]),
    ex("e10", "Synth\u00e8se ex\u00e9cution et bonne foi", "Tres difficile", 360, 260, "Exercice",
       "Un loueur refuse d'effectuer une r\u00e9paration urgente (chaudi\u00e8re) pr\u00e9vue au bail. Le locataire envoie une mise en demeure puis fait r\u00e9parer par un tiers. Articles 1103, 1104, 1231-1 (inex\u00e9cution).",
       "Analyse : force obligatoire, bonne foi, mise en demeure, recours du locataire.",
       ["Quelle obligation du bailleur ?", "Mise en demeure utile ?", "Recours possible ?"],
       "1) Ex\u00e9cuter les engagements (chauffage).\n\n2) Oui, constate retard.\n\n3) R\u00e9paration, dommages, r\u00e9duction de loyer selon cas.",
       "Obligations, mise en demeure, recours.", ["force obligatoire", "mise en demeure"]),
    ex("cas1", "\u00c9tude de cas : livraison retard\u00e9e B2B", "Difficile", 560, 400, "Etude de cas",
       "StartUp commande 200 \u00e9crans \u00e0 LogiPro pour livraison au 15 mars. Livraison au 2 avril. P\u00e9nalit\u00e9 de retard pr\u00e9vue : 0,5 % du prix par jour. LogiPro invoque une gr\u00e8ve transporteur.",
       "Analyse force obligatoire, clause p\u00e9nale, exception possible (faute tiers ?).",
       ["Contrat tenait lieu de loi ?", "Clause p\u00e9nale applicable ?", "Gr\u00e8ve transport = exon\u00e9ration ?"],
       "1) Oui art. 1103.\n\n2) Oui si pr\u00e9vue.\n\n3) D\u00e9bat : tiers possible mais pas automatique en contractuel.",
       "Force obligatoire, p\u00e9nale, tiers.", ["clause p\u00e9nale", "inex\u00e9cution"]),
    ex("cas2", "\u00c9tude de cas : forfait mobile r\u00e9sili\u00e9", "Tres difficile", 620, 450, "Etude de cas",
       "Cl\u00e9mence r\u00e9silie son forfait \u00e0 l'\u00e9ch\u00e9ance. L'op\u00e9rateur pr\u00e9l\u00e8ve encore deux mois en invoquant une clause \u00ab reconduction tacite 24 mois \u00bb en petits caract\u00e8res. Cl\u00e9mence est consommatrice.",
       "R\u00e9siliation, clause abusive possible, information pr\u00e9contractuelle.",
       ["R\u00e9siliation ou r\u00e9solution ?", "Clause 24 mois abusive ?", "Recours Cl\u00e9mence ?"],
       "1) R\u00e9siliation (ex\u00e9cution successive).\n\n2) Probablement abusive (d\u00e9s\u00e9quilibre).\n\n3) M\u00e9diation, r\u00e9clamation, DGCCRF.",
       "R\u00e9siliation, abus, recours.", ["r\u00e9siliation", "clause abusive"]),
]

CHAPTERS[3] = [
    ex("e1", "Responsabilit\u00e9 civile et p\u00e9nale", "Facile", 120, 120, "Exercice",
       "Responsabilit\u00e9 civile (art. 1240) : r\u00e9parer le dommage. Responsabilit\u00e9 p\u00e9nale : sanctionner l'infraction (Code p\u00e9nal), prot\u00e9ger la soci\u00e9t\u00e9.",
       "Distingue responsabilit\u00e9 civile et p\u00e9nale (but et sanction).",
       ["But de la responsabilit\u00e9 civile ?", "But de la responsabilit\u00e9 p\u00e9nale ?", "Exemple pour chaque ?"],
       "1) R\u00e9parer le pr\u00e9judice priv\u00e9.\n\n2) Punir, prot\u00e9ger l'ordre public.\n\n3) Civ. : indemnisation ; p\u00e9n. : amende/prison.",
       "Deux responsabilit\u00e9s compar\u00e9es.", ["responsabilit\u00e9 civile", "responsabilit\u00e9 p\u00e9nale"]),
    ex("e2", "Dommages mat\u00e9riel, corporel et moral", "Facile", 130, 130, "Exercice",
       "Mat\u00e9riel : atteinte aux biens. Corporel : int\u00e9grit\u00e9 physique. Moral : pr\u00e9judice d'affection, atteinte \u00e0 l'honneur.",
       "Classe trois dommages avec un exemple chacun.",
       ["D\u00e9finis dommage mat\u00e9riel, corporel, moral.", "Un exemple pour chaque ?", "Pr\u00e9judice patrimonial vs extrapatrimonial ?"],
       "1) Biens / corps / souffrance immat\u00e9rielle.\n\n2) Ex. voiture cass\u00e9e ; fracture ; deuil.\n\n3) Patrimonial = biens ; extra = corps/honneur.",
       "Trois types, exemples, distinction.", ["dommage mat\u00e9riel", "dommage corporel", "dommage moral"]),
    ex("e3", "Caract\u00e8res du dommage r\u00e9parable", "Facile", 140, 140, "Exercice",
       "Dommage r\u00e9parable : certain, personnel, l\u00e9gitime, direct. Gain ill\u00e9gal vol\u00e9 : dommage ill\u00e9gitime non r\u00e9parable.",
       "Cite les quatre caract\u00e8res et applique au vol d'argent issu d'un trafic.",
       ["Quatre caract\u00e8res ?", "Dommage \u00e9ventuel r\u00e9parable ?", "Pourquoi l'argent du trafic non indemnis\u00e9 ?"],
       "1) Certain, personnel, l\u00e9gitime, direct.\n\n2) Futur possible si certain.\n\n3) Ill\u00e9gitime.",
       "Quatre caract\u00e8res, ill\u00e9gitimit\u00e9.", ["dommage r\u00e9parable"]),
    ex("e4", "R\u00e9paration int\u00e9grale", "Moyen", 180, 160, "Exercice",
       "Principe : r\u00e9paration int\u00e9grale sans perte ni profit. En nature : remise en \u00e9tat. Par \u00e9quivalent : dommages-int\u00e9r\u00eats.",
       "Explique r\u00e9paration en nature et par \u00e9quivalent.",
       ["Principe de r\u00e9paration int\u00e9grale ?", "En nature ?", "Par \u00e9quivalent ?"],
       "1) Tout le pr\u00e9judice, ni plus ni moins.\n\n2) Supprimer le dommage (r\u00e9parer, remplacer).\n\n3) Indemnit\u00e9 p\u00e9cuniaire.",
       "Int\u00e9grale, nature, \u00e9quivalent.", ["r\u00e9paration int\u00e9grale"]),
    ex("e5", "Assurance responsabilit\u00e9 civile", "Moyen", 190, 170, "Exercice",
       "L'assureur se substitue au responsable et indemnise la victime (RC auto, RC vie priv\u00e9e). Clauses d'exclusion possibles (faute volontaire).",
       "R\u00f4le de l'assurance RC et limite par exclusion.",
       ["R\u00f4le de l'assureur ?", "RC automobile obligatoire ?", "Exclusion de garantie ?"],
       "1) Indemniser \u00e0 la place du responsable.\n\n2) Oui, assurance de personnes.\n\n3) Cas o\u00f9 l'assureur ne paie pas (faute volontaire pr\u00e9vue).",
       "Assurance RC, obligation, exclusion.", ["assurance RC"]),
    ex("e6", "FGAO et victimes non assur\u00e9es", "Moyen", 210, 180, "Exercice",
       "FGAO (1951) : indemniser victimes d'accidents de circulation par conducteur non assur\u00e9 ou non identifi\u00e9.",
       "Pourquoi le FGAO existe-t-il ?",
       ["Probl\u00e8me sans FGAO ?", "Quels accidents couverts ?", "Lien avec assurance ?"],
       "1) Victime sans interlocuteur solvable.\n\n2) Circulation, non assur\u00e9/inconnu.\n\n3) Compl\u00e8te le m\u00e9canisme d'assurance.",
       "FGAO, r\u00f4le, lien assurance.", ["FGAO"]),
    ex("e7", "Pr\u00e9judice \u00e9cologique", "Moyen", 230, 190, "Exercice",
       "Art. 1249 : pr\u00e9judice \u00e9cologique = atteinte aux \u00e9cosyst\u00e8mes. R\u00e9paration en priorit\u00e9 en nature (remise en \u00e9tat), sinon indemnit\u00e9 pour l'environnement.",
       "D\u00e9finis pr\u00e9judice \u00e9cologique et mode de r\u00e9paration.",
       ["D\u00e9finition ?", "Victime = personne ou nature ?", "R\u00e9paration prioritaire ?"],
       "1) D\u00e9gradation environnement.\n\n2) Atteinte \u00e0 l'environnement collectif.\n\n3) Remise en \u00e9tat du milieu.",
       "D\u00e9finition, r\u00e9paration nature.", ["pr\u00e9judice \u00e9cologique"]),
    ex("e8", "Assurance de biens et de personnes", "Moyen", 260, 200, "Exercice",
       "Biens : incendie, vol (dommages subis). Personnes : RC, auto, chasse (dommages caus\u00e9s aux autres). Cotisation selon le risque.",
       "Compare assurance de biens et de personnes.",
       ["Assurance de biens ?", "Assurance de personnes ?", "Pourquoi prime plus \u00e9lev\u00e9e pour jeune conducteur ?"],
       "1) Prot\u00e8ge son patrimoine.\n\n2) Couvre dommages caus\u00e9s aux tiers.\n\n3) Risque statistiquement plus grand.",
       "Deux types, prime risque.", ["assurance de biens", "assurance de personnes"]),
    ex("e9", "FGTI et solidarit\u00e9", "Difficile", 280, 220, "Exercice",
       "FGTI : victimes terrorisme et infractions ; mission \u00e9tendue aux victimes d'infractions de droit commun. Mutualisation des risques.",
       "R\u00f4le du FGTI et logique de solidarit\u00e9 nationale.",
       ["Mission initiale FGTI ?", "Extension ?", "Lien avec mutualisation ?"],
       "1) Actes de terrorisme.\n\n2) Infractions droit commun.\n\n3) Fonds publics, risque partag\u00e9.",
       "FGTI, solidarit\u00e9.", ["FGTI", "mutualisation"]),
    ex("e10", "Synth\u00e8se dommage et assurance", "Tres difficile", 360, 260, "Exercice",
       "Accident de chien non tenu en laisse : dommage corporel et mat\u00e9riel. Propri\u00e9taire assur\u00e9 RC. Victime : certitude, lien causalit\u00e9, pr\u00e9judices m\u00e9dicaux et mat\u00e9riels.",
       "Encha\u00eene types de dommages, caract\u00e8res, r\u00e9paration, assurance.",
       ["Types de dommages ?", "Caract\u00e8res v\u00e9rifi\u00e9s ?", "Qui indemnise ?"],
       "1) Corporel + mat\u00e9riel (+ moral possible).\n\n2) Certains, personnels, l\u00e9gitimes, directs.\n\n3) Assureur RC du propri\u00e9taire.",
       "Types, caract\u00e8res, assurance.", ["dommage corporel", "assurance RC"]),
    ex("cas1", "\u00c9tude de cas : accident de voiture", "Difficile", 560, 400, "Etude de cas",
       "Conducteur distrait percute un pi\u00e9ton : fracture, v\u00e9lo d\u00e9truit, arr\u00eat de travail 6 semaines. Assurance auto en jeu. Conducteur reconnu en partie responsable.",
       "Qualifie dommages, caract\u00e8res, r\u00e9paration, r\u00f4le assureur.",
       ["Dommages subis ?", "R\u00e9paration int\u00e9grale ?", "Assureur remplace qui ?"],
       "1) Corporel, mat\u00e9riel, moral possible.\n\n2) Frais m\u00e9dicaux, remplacement v\u00e9lo, perte de revenus.\n\n3) Assureur indemnise victime.",
       "Dommages, r\u00e9paration, assurance.", ["dommage corporel", "assurance automobile"]),
    ex("cas2", "\u00c9tude de cas : pollution rivi\u00e8re", "Tres difficile", 620, 450, "Etude de cas",
       "Usine rejette des produits chimiques dans une rivi\u00e8re : poissons morts, baignade interdite. Association environnement et commune agissent. Art. 1249.",
       "Pr\u00e9judice \u00e9cologique, r\u00e9paration en nature, qui peut agir ?",
       ["Pr\u00e9judice \u00e9cologique ?", "R\u00e9paration ?", "Int\u00e9r\u00eat \u00e0 agir association ?"],
       "1) Oui, atteinte \u00e9cosyst\u00e8me.\n\n2) Nettoyage rivi\u00e8re, dommages si impossible.\n\n3) Oui si objet statuts / territoire concern\u00e9.",
       "Ecologique, nature, action.", ["pr\u00e9judice \u00e9cologique"]),
]

CHAPTERS[4] = [
    ex("e1", "Contractuelle et extracontractuelle", "Facile", 120, 120, "Exercice",
       "Responsabilit\u00e9 contractuelle : inex\u00e9cution d'une obligation du contrat. Extracontractuelle (d\u00e9lictuelle) : dommage hors contrat (accident).",
       "Distingue les deux avec un exemple.",
       ["Responsabilit\u00e9 contractuelle ?", "Extracontractuelle ?", "Exemple accident sans contrat pr\u00e9alable ?"],
       "1) Lien contrat non respect\u00e9.\n\n2) Fait juridique ind\u00e9pendant.\n\n3) Choc de voitures inconnus.",
       "Deux r\u00e9gimes, exemples.", ["responsabilit\u00e9 contractuelle", "responsabilit\u00e9 extracontractuelle"]),
    ex("e2", "Trois \u00e9l\u00e9ments de la responsabilit\u00e9", "Facile", 130, 130, "Exercice",
       "Dommage (certain, personnel, l\u00e9gitime, direct) + fait g\u00e9n\u00e9rateur + lien de causalit\u00e9. Victime doit prouver (sauf pr\u00e9somptions).",
       "Cite les trois \u00e9l\u00e9ments constitutifs.",
       ["Les trois \u00e9l\u00e9ments ?", "Fait g\u00e9n\u00e9rateur en contractuel ?", "Lien de causalit\u00e9 ?"],
       "1) Dommage, fait, causalit\u00e9.\n\n2) Inex\u00e9cution obligation.\n\n3) Fait a caus\u00e9 le dommage.",
       "Trois \u00e9l\u00e9ments expliqu\u00e9s.", ["fait g\u00e9n\u00e9rateur", "lien de causalit\u00e9"]),
    ex("e3", "Responsabilit\u00e9 du fait personnel", "Facile", 140, 140, "Exercice",
       "Art. 1240-1241 : faute personnelle (intentionnelle ou imprudence). Victime prouve dommage, faute, causalit\u00e9.",
       "D\u00e9finis responsabilit\u00e9 pour faute et r\u00e8gle de preuve.",
       ["Base l\u00e9gale ?", "Imprudence ?", "Preuve \u00e0 qui ?"],
       "1) Art. 1240 et suivants.\n\n2) Comportement d'un homme raisonnable non respect\u00e9.\n\n3) Victime en principe.",
       "Faute, imprudence, preuve.", ["faute", "art. 1240"]),
    ex("e4", "Responsabilit\u00e9 du fait d'autrui", "Moyen", 180, 160, "Exercice",
       "Art. 1242 : parents pour enfants mineurs ; employeur (commettant) pour salari\u00e9 (pr\u00e9pos\u00e9) dans le travail. Pr\u00e9somption : victime prouve surtout causalit\u00e9.",
       "Compare responsabilit\u00e9 parentale et employeur.",
       ["Parents / enfants ?", "Employeur / salari\u00e9 ?", "Preuve all\u00e9g\u00e9e ?"],
       "1) Dommages caus\u00e9s par enfant mineur au foyer.\n\n2) Dommage dans fonctions et temps de travail.\n\n3) Oui, pr\u00e9somption de responsabilit\u00e9.",
       "1242, deux cas, preuve.", ["responsabilit\u00e9 du fait d'autrui", "pr\u00e9pos\u00e9"]),
    ex("e5", "Responsabilit\u00e9 du fait des choses", "Moyen", 190, 170, "Exercice",
       "Chose en mouvement : pr\u00e9somption r\u00f4le actif. Chose immobile : victime prouve vice ou anomalie. Gardien de la chose responsable.",
       "Explique responsabilit\u00e9 du fait des choses.",
       ["Qui est le gardien ?", "Chose en mouvement ?", "Chose immobile ?"],
       "1) Celui qui a la garde.\n\n2) Pr\u00e9somption, preuve causalit\u00e9 suffit souvent.\n\n3) Preuve du fait actif de la chose.",
       "Gardien, mouvement, immobile.", ["responsabilit\u00e9 du fait des choses"]),
    ex("e6", "Loi Badinter", "Moyen", 210, 180, "Exercice",
       "Accident circulation, v\u00e9hicule terrestre \u00e0 moteur, dommage li\u00e9 : r\u00e9gime sp\u00e9cial. Victime indemnis\u00e9e ; force majeure difficilement opposable. Faute inexcusable victime rare en corporel.",
       "Conditions d'application loi Badinter.",
       ["Trois conditions cumulatives ?", "Avantage victime ?", "Faute victime corporel ?"],
       "1) Accident circulation, VTM, dommage li\u00e9.\n\n2) Indemnisation facilit\u00e9e.\n\n3) Volontaire ou inexcusable exceptionnelle.",
       "Badinter, conditions, protection.", ["loi Badinter"]),
    ex("e7", "Produits d\u00e9fectueux", "Moyen", 230, 190, "Exercice",
       "Art. 1245 : responsabilit\u00e9 de plein droit du producteur. Victime prouve d\u00e9faut de s\u00e9curit\u00e9, dommage, causalit\u00e9 (pas la faute).",
       "R\u00e9gime produit d\u00e9fectueux.",
       ["Contre qui agir ?", "D\u00e9faut de s\u00e9curit\u00e9 ?", "Exon\u00e9rations producteur ?"],
       "1) Producteur, importateur ou vendeur \u00e0 d\u00e9faut.\n\n2) Produit dangereux vs attente normale.\n\n3) Art. 1245-10 (non mise en circulation, etc.).",
       "1245, preuves victime, exon\u00e9rations.", ["produit d\u00e9fectueux"]),
    ex("e8", "Accident du travail", "Moyen", 260, 200, "Exercice",
       "Loi 1898 : accident au temps/lieu du travail ou trajet = origine professionnelle sauf preuve contraire. Pas besoin de prouver faute employeur.",
       "Sp\u00e9cificit\u00e9 accident du travail.",
       ["Crit\u00e8res ?", "Avantage salari\u00e9 ?", "Prestations ?"],
       "1) Soudainet\u00e9, l\u00e9sion, lien professionnel.\n\n2) Pr\u00e9somption origine pro.\n\n3) Frais m\u00e9dicaux, indemnit\u00e9s, rente.",
       "AT, pr\u00e9somption, prestations.", ["accident du travail"]),
    ex("e9", "Obligation de moyens vs r\u00e9sultat en responsabilit\u00e9", "Difficile", 280, 220, "Exercice",
       "Obligation de r\u00e9sultat : pas atteint = responsabilit\u00e9 sans prouver faute. Obligation de moyens : faute ou moyens insuffisants \u00e0 prouver.",
       "Applique \u00e0 m\u00e9decin (moyens) et vendeur (r\u00e9sultat).",
       ["M\u00e9decin ?", "Vendeur non livr\u00e9 ?", "S\u00e9curit\u00e9 souvent obligation de r\u00e9sultat ?"],
       "1) Moyens : pas garantie gu\u00e9rison.\n\n2) R\u00e9sultat : livraison due.\n\n3) Jurisprudence souvent r\u00e9sultat pour s\u00e9curit\u00e9.",
       "Moyens/r\u00e9sultat en responsabilit\u00e9.", ["obligation de moyens", "obligation de r\u00e9sultat"]),
    ex("e10", "Faute et responsabilit\u00e9 sans faute", "Tres difficile", 360, 260, "Exercice",
       "R\u00e9gime classique : faute (art. 1240). \u00c9volution : responsabilit\u00e9 du risque (cr\u00e9er un risque, en assumer les cons\u00e9quences).",
       "Compare responsabilit\u00e9 pour faute et pour risque.",
       ["R\u00e9gime faute ?", "R\u00e9gime risque ?", "Exemple risque ?"],
       "1) Prouver comportement fautif.\n\n2) Cr\u00e9ation de risque suffit.\n\n3) Activit\u00e9 dangereuse, produits, etc.",
       "Faute vs risque.", ["responsabilit\u00e9 pour faute", "responsabilit\u00e9 du risque"]),
    ex("cas1", "\u00c9tude de cas : collision et Badinter", "Difficile", 560, 400, "Etude de cas",
       "Deux voitures sur route publique : bless\u00e9 l\u00e9ger, voiture r\u00e9parable. Conducteur B non assur\u00e9. Conditions Badinter ? FGAO ?",
       "Applique la loi Badinter et le FGAO.",
       ["Badinter applicable ?", "Qui indemnise corporel ?", "Dommage mat\u00e9riel victime ?"],
       "1) Oui si VTM + accident + dommage.\n\n2) FGAO si non assur\u00e9.\n\n3) Faute victime peut limiter mat\u00e9riel.",
       "Badinter, FGAO, faute.", ["loi Badinter", "FGAO"]),
    ex("cas2", "\u00c9tude de cas : produit d\u00e9fectueux", "Tres difficile", 620, 450, "Etude de cas",
       "Trottinette \u00e9lectrique : frein d\u00e9fectueux, chute, fracture. Notice sans avertissement risque. Producteur identifi\u00e9.",
       "Analyse le r\u00e9gime des produits d\u00e9fectueux (art. 1245).",
       ["R\u00e9gime applicable ?", "Preuves victime ?", "Exon\u00e9ration possible ?"],
       "1) Art. 1245 si d\u00e9faut s\u00e9curit\u00e9.\n\n2) D\u00e9faut, dommage, lien.\n\n3) Producteur peut prouver absence d\u00e9faut \u00e0 la mise en circulation.",
       "Produit d\u00e9fectueux complet.", ["produit d\u00e9fectueux", "d\u00e9faut de s\u00e9curit\u00e9"]),
]

CHAPTERS[5] = [
    ex("e1", "Clause d'exon\u00e9ration de responsabilit\u00e9", "Facile", 120, 120, "Exercice",
       "Clause par laquelle un professionnel limite ou exclut sa responsabilit\u00e9 contractuelle \u00e0 l'avance. Interdite ou limit\u00e9e en consommation, faute lourde, d\u00e9s\u00e9quilibre.",
       "D\u00e9finis clause d'exon\u00e9ration et limites.",
       ["D\u00e9finition ?", "Valable en contrat de consommation ?", "Faute lourde ?"],
       "1) Limitation/exclusion responsabilit\u00e9 pr\u00e9vue.\n\n2) Non si abusive.\n\n3) Clause inefficace.",
       "Clause, limites.", ["clause d'exon\u00e9ration"]),
    ex("e2", "Cause \u00e9trang\u00e8re", "Facile", 130, 130, "Exercice",
       "Cause \u00e9trang\u00e8re rompt le lien de causalit\u00e9 : force majeure, fait d'un tiers, fait de la victime.",
       "D\u00e9finis cause \u00e9trang\u00e8re et les trois types.",
       ["D\u00e9finition ?", "Trois causes ?", "Effet sur responsabilit\u00e9 ?"],
       "1) \u00c9v\u00e9nement ext\u00e9rieur \u00e0 l'auteur.\n\n2) Force majeure, tiers, victime.\n\n3) Exon\u00e9ration totale ou partielle.",
       "Cause \u00e9trang\u00e8re, trois types.", ["cause \u00e9trang\u00e8re"]),
    ex("e3", "Force majeure", "Facile", 140, 140, "Exercice",
       "Force majeure : \u00e9v\u00e9nement impr\u00e9visible, irr\u00e9sistible, ext\u00e9rieur. Ex. tuile arrach\u00e9e par temp\u00eate violente endommage voisin.",
       "D\u00e9finis force majeure et applique \u00e0 la temp\u00eate.",
       ["Trois crit\u00e8res ?", "Exemple tuile ?", "En contractuel et Badinter ?"],
       "1) Impr\u00e9visible, irr\u00e9sistible, ext\u00e9rieur.\n\n2) Propri\u00e9taire peut s'exon\u00e9rer.\n\n3) Difficile en circulation (Badinter).",
       "Force majeure, exemple.", ["force majeure"]),
    ex("e4", "Fait d'un tiers", "Moyen", 180, 160, "Exercice",
       "Si dommage caus\u00e9 par un tiers sans faute du d\u00e9fendeur, responsabilit\u00e9 du tiers. Ex. fournisseur livre produit d\u00e9fectueux : producteur peut \u00eatre seul responsable.",
       "Explique exon\u00e9ration par fait d'un tiers.",
       ["Quand invoquer ?", "Qui indemnise la victime ?", "Lien avec produit d\u00e9fectueux ?"],
       "1) Tiers cause exclusive.\n\n2) Le tiers responsable.\n\n3) Producteur en 1245.",
       "Fait tiers, application.", ["fait d'un tiers"]),
    ex("e5", "Fait de la victime", "Moyen", 190, 170, "Exercice",
       "Faute de la victime peut exon\u00e9rer totalement ou partiellement (part de responsabilit\u00e9). En mat\u00e9riel Badinter : peut r\u00e9duire indemnisation.",
       "R\u00f4le de la faute de la victime.",
       ["Exon\u00e9ration totale ?", "Partielle ?", "Badinter mat\u00e9riel ?"],
       "1) Si cause exclusive.\n\n2) Partage indemnisation.\n\n3) Juge appr\u00e9cie r\u00e9duction.",
       "Faute victime, partielle.", ["fait de la victime"]),
    ex("e6", "Clause abusive et exon\u00e9ration", "Moyen", 210, 180, "Exercice",
       "Clause excluant toute responsabilit\u00e9 du pro en consommation = souvent abusive (L212-1). R\u00e9put\u00e9e non \u00e9crite.",
       "Lien clause exon\u00e9ration et protection consommateur.",
       ["Pourquoi interdire en B2C ?", "D\u00e9s\u00e9quilibre ?", "Effet si abusive ?"],
       "1) Pro fort / consommateur faible.\n\n2) Oui, significatif.\n\n3) Non \u00e9crite.",
       "Abus, consommation.", ["clause abusive", "clause d'exon\u00e9ration"]),
    ex("e7", "Faute lourde et clause", "Moyen", 230, 190, "Exercice",
       "M\u00eame avec clause d'exon\u00e9ration, faute lourde du professionnel peut engager sa responsabilit\u00e9.",
       "Pourquoi la faute lourde emp\u00eache l'exon\u00e9ration ?",
       ["Qu'est-ce que faute lourde ?", "Clause valable alors ?", "Exemple ?"],
       "1) Faute tr\u00e8s grave, conscience du dommage.\n\n2) Non pour cette faute.\n\n3) Mise en danger d\u00e9lib\u00e9r\u00e9e.",
       "Faute lourde, clause.", ["faute lourde"]),
    ex("e8", "Cumul contractuel / extracontractuel", "Moyen", 260, 200, "Exercice",
       "Victime choisit souvent le r\u00e9gime le plus favorable. Cause \u00e9trang\u00e8re conteste le lien causal dans les deux cas.",
       "Compare moyens d'exon\u00e9ration selon les r\u00e9gimes.",
       ["M\u00eame causes \u00e9trang\u00e8res ?", "Choix de la victime ?", "Force majeure partout ?"],
       "1) Oui en principe.\n\n2) Oui, r\u00e9gime favorable.\n\n3) Appr\u00e9ciation selon contexte.",
       "Cumul, choix victime.", ["cause \u00e9trang\u00e8re"]),
    ex("e9", "Temp\u00eate et chantier", "Difficile", 280, 220, "Exercice",
       "Entreprise de BTP retarde livraison : invoquera-t-elle temp\u00eate ? Victime invoquera mauvaise organisation. Juge tranche causalit\u00e9.",
       "Analyse force majeure contest\u00e9e.",
       ["Temp\u00eate = force majeure auto ?", "Preuve ?", "Clause p\u00e9nale + FM ?"],
       "1) Si impr\u00e9visible et irr\u00e9sistible.\n\n2) \u00c0 d\u00e9montrer.\n\n3) P\u00e9nale peut s'appliquer si retard imputable.",
       "FM contestable.", ["force majeure"]),
    ex("e10", "Synth\u00e8se exon\u00e9ration", "Tres difficile", 360, 260, "Exercice",
       "Spectacle annul\u00e9 : organisateur invoque gr\u00e8ve techniciens (tiers ?). Spectateurs demandent remboursement. Clauses limitatives sur billetterie.",
       "Clauses, causes \u00e9trang\u00e8res, consommateurs.",
       ["Gr\u00e8ve = FM ?", "Clause limitative valable ?", "Remboursement ?"],
       "1) Tiers possible, pas toujours FM.\n\n2) V\u00e9rifier abus B2C.\n\n3) Oui si inex\u00e9cution sans exon\u00e9ration valide.",
       "Synth\u00e8se exon\u00e9ration.", ["force majeure", "fait d'un tiers", "clause abusive"]),
    ex("cas1", "\u00c9tude de cas : livraison et temp\u00eate", "Difficile", 560, 400, "Etude de cas",
       "Entreprise promet livraison mat\u00e9riel \u00e9v\u00e9nement. Temp\u00eate officielle. Clause FM dans contrat B2B. Client professionnel.",
       "Analyse force majeure et clause contractuelle.",
       ["FM retenue ?", "Clause FM B2B ?", "Dommages-int\u00e9r\u00eats ?"],
       "1) Si crit\u00e8res r\u00e9unis et lien rompu.\n\n2) Valable si pas abusive entre pros.\n\n3) Si pas exon\u00e9r\u00e9, p\u00e9nalit\u00e9s ou D-I.",
       "FM B2B, clause.", ["force majeure", "clause d'exon\u00e9ration"]),
    ex("cas2", "\u00c9tude de cas : ski et faute victime", "Tres difficile", 620, 450, "Etude de cas",
       "Skieur hors piste, panneau interdit ignor\u00e9, collision. Station invoque faute victime. Victime aussi en imprudence.",
       "Analyse fait de la victime et partage de responsabilit\u00e9.",
       ["Fait victime exclusif ?", "Responsabilit\u00e9 station ?", "Partage ?"],
       "1) Si cause exclusive imprudence majeure.\n\n2) Si d\u00e9faut signalisation ou entretien.\n\n3) Partage indemnisation possible.",
       "Fait victime, partage.", ["fait de la victime", "faute"]),
]


def ts_string(s: str) -> str:
    """Escape for TS double-quoted string."""
    return json.dumps(s, ensure_ascii=True)


def emit_exercise(ch: int, data: dict) -> str:
    eid = f"drt{ch}-{data['suffix']}"
    lines = [
        "  {",
        f"    id: {ts_string(eid)},",
        f"    title: {ts_string(data['title'])},",
        f"    type: {ts_string(data['type'])},",
        f"    difficulty: {ts_string(data['difficulty'])},",
        f"    xp: {data['xp']},",
        f"    minChars: {data['minChars']},",
        f"    support: {ts_string(data['support'])},",
        f"    consigne: {ts_string(data['consigne'])},",
        "    questions: [",
    ]
    for q in data["questions"]:
        lines.append(f"      {ts_string(q)},")
    lines.append("    ],")
    lines.append(f"    correctionModele: {ts_string(data['correctionModele'])},")
    lines.append(f"    attendu: {ts_string(data['attendu'])},")
    notions = ", ".join(ts_string(n) for n in data["notionsCibles"])
    lines.append(f"    notionsCibles: [{notions}],")
    lines.append("  },")
    return "\n".join(lines)


def emit_chapter_file(ch: int, exercises: list) -> None:
    const = f"DROIT_CHAP{ch}_EXERCISES"
    parts = [
        'import type { DroitMissionExercise } from "../types";',
        "",
        f"export const {const}: DroitMissionExercise[] = [",
    ]
    for ex_data in exercises:
        parts.append(emit_exercise(ch, ex_data))
    parts.append("];")
    parts.append("")
    path = os.path.join(CHAPTERS_DIR, f"chap{ch}.ts")
    os.makedirs(CHAPTERS_DIR, exist_ok=True)
    with open(path, "w", encoding="utf-8", newline="\n") as f:
        f.write("\n".join(parts))


def emit_registry() -> None:
    imports = []
    entries = []
    labels = []
    for ch in sorted(CHAPTERS.keys()):
        imports.append(f'import {{ DROIT_CHAP{ch}_EXERCISES }} from "./chapters/chap{ch}";')
        entries.append(f"  {ch}: DROIT_CHAP{ch}_EXERCISES,")
        labels.append(f"  {ch}: {ts_string(CHAPTER_LABELS[ch])},")

    bo_map = "export const DROIT_BO_ORDRE_TO_CHAPTER: Record<number, DroitMissionChapter> = {\n  84: 1,\n  85: 2,\n  86: 3,\n  88: 4,\n  89: 5,\n};\n"

    content = f'''import type {{ DroitMissionChapter, DroitMissionExercise }} from "./types";

{chr(10).join(imports)}

export const DROIT_MATIERE = "Droit" as const;

export const DROIT_EXERCISES_BY_CHAPTER: Record<DroitMissionChapter, DroitMissionExercise[]> = {{
{chr(10).join(entries)}
}};

export const DROIT_CHAPTER_LABELS: Record<DroitMissionChapter, string> = {{
{chr(10).join(labels)}
}};

{bo_map}

export function getDroitMissionChapterNumbers(): number[] {{
  return Object.keys(DROIT_EXERCISES_BY_CHAPTER)
    .map((k) => Number(k))
    .filter((n) => Number.isFinite(n) && (DROIT_EXERCISES_BY_CHAPTER[n]?.length ?? 0) > 0)
    .sort((a, b) => a - b);
}}

export function isDroitMissionChapter(chapter: number): chapter is DroitMissionChapter {{
  return String(chapter) in DROIT_EXERCISES_BY_CHAPTER && (DROIT_EXERCISES_BY_CHAPTER[chapter]?.length ?? 0) > 0;
}}

function normalizeChapterTitle(value = ""): string {{
  return String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\\u0300-\\u036f]/g, "")
    .trim();
}}

export function detectDroitChapterNumber(
  chapitre: {{ ordre?: number; titre?: string }} | null,
  matiere: string,
): DroitMissionChapter | null {{
  if (matiere !== DROIT_MATIERE || !chapitre) return null;
  const ordre = chapitre.ordre;
  if (ordre != null) {{
    if (isDroitMissionChapter(ordre)) return ordre;
    const mapped = DROIT_BO_ORDRE_TO_CHAPTER[ordre];
    if (mapped != null) return mapped;
  }}
  const t = normalizeChapterTitle(chapitre.titre || "");
  for (const n of getDroitMissionChapterNumbers()) {{
    if (t.includes(`chapitre ${{n}}`) || t.startsWith(`${{n}} `) || t.startsWith(`${{n}}.`)) return n;
  }}
  return null;
}}

export function getDroitExercises(chapter: DroitMissionChapter): DroitMissionExercise[] {{
  return DROIT_EXERCISES_BY_CHAPTER[chapter] ?? [];
}}

export function getDroitProgressLabel(chapter: DroitMissionChapter): string {{
  return `Droit Chapitre ${{chapter}}`;
}}

export function getDroitChapterBlurb(chapter: DroitMissionChapter): string {{
  const label = DROIT_CHAPTER_LABELS[chapter];
  return label
    ? `Pack Terminale : 10 exercices progressifs + 2 etudes de cas - ${{label}}.`
    : "Pack Droit Terminale en preparation.";
}}

export function compareDroitExerciseIds(a: string, b: string): number {{
  const ma = a.match(/^drt(\\d+)-(e\\d+|cas\\d+)$/);
  const mb = b.match(/^drt(\\d+)-(e\\d+|cas\\d+)$/);
  if (!ma || !mb) return a.localeCompare(b, "fr");
  const ca = Number(ma[1]);
  const cb = Number(mb[1]);
  if (ca !== cb) return ca - cb;
  const rank = (s: string) => (s.startsWith("e") ? Number(s.slice(1)) : 100 + Number(s.slice(3)));
  return rank(ma[2]) - rank(mb[2]);
}}
'''
    with open(os.path.join(ROOT, "registry.ts"), "w", encoding="utf-8", newline="\n") as f:
        f.write(content)


def emit_catalog() -> None:
    lines = [
        "/** Genere par scripts/generate_droit_missions.py */",
        "export const DROIT_MISSIONS_PROGRESS_VERSION = 1 as const;",
        "export type DroitMissionMeta = { title: string; chapter: string; xpMax: number };",
        "export const DROIT_MISSION_BY_ID: Record<string, DroitMissionMeta> = {",
    ]
    for ch, exercises in sorted(CHAPTERS.items()):
        for data in exercises:
            eid = f"drt{ch}-{data['suffix']}"
            chapter_label = f"Droit Chapitre {ch}"
            lines.append(
                f"  {ts_string(eid)}: {{ title: {ts_string(data['title'])}, chapter: {ts_string(chapter_label)}, xpMax: {data['xp']} }},"
            )
    lines.append("};")
    lines.append("")
    lines.append(
        "const ORDER_INDEX: Record<string, number> = Object.fromEntries(Object.keys(DROIT_MISSION_BY_ID).map((id, i) => [id, i]));"
    )
    lines.append("export function getDroitMissionMeta(exerciseId: string): DroitMissionMeta {")
    lines.append(
        '  return DROIT_MISSION_BY_ID[exerciseId] ?? { title: exerciseId, chapter: "Mission Droit", xpMax: 0 };'
    )
    lines.append("}")
    lines.append("export function compareDroitExerciseIds(a: string, b: string): number {")
    lines.append('  const ia = ORDER_INDEX[a] ?? 99999;')
    lines.append('  const ib = ORDER_INDEX[b] ?? 99999;')
    lines.append("  if (ia !== ib) return ia - ib;")
    lines.append('  return a.localeCompare(b, "fr");')
    lines.append("}")
    path = os.path.join(os.path.dirname(ROOT), "droitMissionCatalog.ts")
    with open(path, "w", encoding="utf-8", newline="\n") as f:
        f.write("\n".join(lines))


def main() -> None:
    for ch, exercises in CHAPTERS.items():
        emit_chapter_file(ch, exercises)
    emit_registry()
    emit_catalog()
    total = sum(len(v) for v in CHAPTERS.values())
    print(f"OK: {len(CHAPTERS)} chapters, {total} exercises")


if __name__ == "__main__":
    main()
