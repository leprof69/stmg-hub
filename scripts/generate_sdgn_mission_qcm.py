# -*- coding: utf-8 -*-

"""

Genere src/data/sdgn/sdgnMissionQcmBank.ts - QCM issus UNIQUEMENT des chapitres SDGN missions (1-13).

Reprend la banque Duel chap. 7 existante + QCM des autres chapitres missions.

Usage: python scripts/generate_sdgn_mission_qcm.py

"""

import json

import re

from pathlib import Path



ROOT = Path(__file__).resolve().parents[1]

DUEL_TS = ROOT / "scripts/duelQcmBank.legacy.ts"

OUT = ROOT / "src/data/sdgn/sdgnMissionQcmBank.ts"



# (num, diff, question, [c0,c1,c2,c3], bon_index)

def block(ch: int, items):

    out = []

    for num, diff, q, c, b in items:

        out.append(

            {

                "id": f"sdgn{ch}-{num:02d}",

                "chapter": ch,

                "difficulte": diff,

                "question": q,

                "choix": c,

                "bonIndex": b,

            }

        )

    return out





CH1 = block(

    1,

    [

        (1, "facile", "Une action collective organisee suppose notamment :", ["Un seul decideur sans objectif", "Des objectifs communs et une coordination des taches", "L'absence de regles", "Une personne morale obligatoire"], 1),

        (2, "facile", "Une organisation se distingue d'une action collective car elle :", ["Dure une seule journee", "Possede une personne morale et des statuts", "N'a pas d'objectifs", "Interdit toute coordination"], 1),

        (3, "facile", "L'objet social d'une organisation :", ["Fixe les salaires du marche", "Declare la finalite et les activites autorisees", "Remplace les statuts", "Supprime le controle"], 1),

        (4, "moyen", "Une entreprise est une organisation :", ["A but non lucratif obligatoire", "A finalite lucrative", "Sans existence juridique", "Publique par definition"], 1),

        (5, "moyen", "Une association a pour but principal :", ["Maximiser le profit distribuable", "Satisfaire un interet general ou celui de ses adherents sans recherche du profit", "Gerer l'Etat", "Remplacer les entreprises"], 1),

        (6, "moyen", "Une organisation publique est propriete :", ["Des actionnaires prives", "De l'Etat ou des collectivites", "Des clients uniquement", "Des syndicats"], 1),

        (7, "moyen", "La structure de propriete designe :", ["Le logo de l'entreprise", "La repartition du pouvoir entre proprietaires", "Le nombre de clients", "Le chiffre d'affaires"], 1),

        (8, "moyen", "L'assemblee generale des actionnaires :", ["Nomme et controle les dirigeants", "Remplace le code du travail", "Supprime les statuts", "Interdit le controle"], 0),

        (9, "facile", "Le controle des dirigeants vise a :", ["Supprimer les proprietaires", "Verifier que la politique defend les interets des proprietaires", "Eliminer les assemblees", "Interdire les comptes"], 1),

        (10, "moyen", "LVMH illustre une organisation :", ["Publique", "A but lucratif (entreprise)", "Sans personne morale", "Exclusivement associative"], 1),

        (11, "facile", "Les Restos du Coeur illustrent :", ["Une SA cotee", "Une association a but non lucratif", "Un hopital public", "Une cooperative obligatoire"], 1),

        (12, "moyen", "La Cour des comptes controle surtout :", ["Les entreprises privees", "La bonne utilisation de l'argent public", "Les associations sportives lyceennes", "Les ventes e-commerce"], 1),

    ],

)



CH2 = block(

    2,

    [

        (1, "facile", "La personnalite d'un individu :", ["Change chaque semaine", "Designe l'ensemble des traits de caractere relativement stables", "Remplace l'emotion", "Supprime la communication"], 1),

        (2, "facile", "Un introverti au travail tend a :", ["Parler avant de reflechir en grand groupe", "Observer avant d'agir et preferer certains travaux solitaires", "Refuser toute ecriture", "Eliminer les reunions"], 1),

        (3, "moyen", "L'intelligence emotionnelle permet de :", ["Supprimer les emotions", "Mieux gerer ses emotions et celles des autres", "Interdire la communication non verbale", "Remplacer la personnalite"], 1),

        (4, "moyen", "La communication non verbale inclut :", ["Uniquement les e-mails", "Gestes, regard, posture, ton de voix", "Les comptes annuels", "Le RGPD"], 1),

        (5, "facile", "La perception en communication :", ["Est toujours objective", "Depend de l'interpretation de chacun", "Supprime les stereotypes", "Remplace l'identite"], 1),

        (6, "moyen", "L'identite numerique professionnelle :", ["Doit etre ignoree", "Peut devenir un atout ou un risque pour l'emploi", "Remplace le CV papier obligatoirement", "Interdit LinkedIn"], 1),

        (7, "facile", "L'e-reputation concerne :", ["Uniquement les logos", "Ce qui se dit en ligne sur une personne ou une marque", "Le stock physique", "Les amortissements"], 1),

        (8, "moyen", "Un stereotype en organisation peut :", ["Toujours valoriser l'individu", "Conduire a des prejuges positifs ou negatifs", "Supprimer la culture", "Remplacer les normes"], 1),

        (9, "facile", "Un extraverti en equipe :", ["Refuse toute interaction", "S'exprime facilement et aime les activites de groupe", "Supprime la hierarchie", "Interdit l'oral"], 1),

        (10, "moyen", "Pour une equipe efficace, le manuel conseille :", ["Un seul profil identique", "Combiner des traits complementaires", "Supprimer la diversite", "Eviter toute emotion"], 1),

        (11, "facile", "Les signes non verbaux peuvent :", ["Remplacer tout message oral", "Renforcer ou contredire le message oral", "Supprimer la perception", "Eliminer la personnalite"], 1),

        (12, "moyen", "Soigner son profil LinkedIn releve de :", ["La comptabilite", "La gestion de l'identite numerique professionnelle", "Le droit penal seul", "La logistique"], 1),

    ],

)



CH3 = block(

    3,

    [

        (1, "facile", "La culture d'entreprise regroupe :", ["Uniquement le dress code", "Valeurs, normes et rituels partages", "Le bilan comptable", "Les dividendes"], 1),

        (2, "moyen", "La communication verticale descendante :", ["Va du salarie vers la direction", "Va de la direction vers le salarie", "N'existe pas", "Remplace l'intranet"], 1),

        (3, "moyen", "La communication laterale se fait :", ["Uniquement avec la direction generale", "Entre personnes de meme statut", "Sans message", "Uniquement par courrier"], 1),

        (4, "facile", "Une note de service est :", ["Un document externe publicitaire", "Un document interne imperatif descendant", "Un contrat commercial", "Un bilan"], 1),

        (5, "moyen", "Les relations informelles :", ["Sont toujours ecrites officiellement", "Circulent souvent a l'oral et peuvent diffuser vite", "Remplacent la loi", "Suppriment la hierarchie"], 1),

        (6, "facile", "Un leader de fait tire son autorite :", ["Uniquement du statut juridique", "De la competence et/ou de la personnalite reconnue par le groupe", "De la tradition seule", "Du hasard"], 1),

        (7, "moyen", "Le leadership participatif :", ["Exclut les salaries des decisions", "Delegue ou associe la base a la decision", "Supprime le leader", "Interdit les reunions"], 1),

        (8, "moyen", "Un stereotype peut mener a :", ["Toujours une promotion", "Un prejuge defavorable (discrimination)", "La suppression des normes", "L'open data"], 1),

        (9, "facile", "Les enjeux identitaires en communication visent a :", ["Baisser les prix", "S'affirmer individuellement ou en groupe", "Supprimer l'information", "Calculer la VA"], 1),

        (10, "moyen", "La strategie de cooperation en influence :", ["Ferme l'echange", "Cherche un compromis donnant-donnant", "Evite tout dialogue", "Remplace l'argumentation"], 1),

        (11, "facile", "Le conformisme :", ["Renforce toujours la creativite", "Pousse a se conformer aux normes du groupe", "Supprime le groupe", "Interdit la communication"], 1),

        (12, "moyen", "Un reseau social d'entreprise favorise :", ["La vente en magasin uniquement", "La communication interne et le sentiment d'appartenance", "La suppression du numerique", "L'absence de moderation"], 1),

    ],

)



CH4 = block(

    4,

    [

        (1, "facile", "Les savoirs en approche par competences :", ["Sont des attitudes", "Sont des connaissances theoriques acquises", "Remplacent le savoir-faire", "Designent le management seul"], 1),

        (2, "facile", "Le savoir-faire correspond a :", ["Une croyance", "La capacite a realiser une tache", "Un diplome sans pratique", "Un dividende"], 1),

        (3, "moyen", "Le savoir-etre concerne :", ["Les lois comptables", "Les attitudes et comportements professionnels", "Les machines", "Le cours de bourse"], 1),

        (4, "moyen", "Une fiche de poste decrit :", ["Le bilan de l'entreprise", "Les missions et responsabilites d'un emploi", "Le marche boursier", "Les open data"], 1),

        (5, "facile", "La qualite de vie au travail (QVCT) vise :", ["Supprimer les salaries", "Ameliorer les conditions de travail et le bien-etre", "Augmenter uniquement les stocks", "Eliminer la formation"], 1),

        (6, "moyen", "Le teletravail peut etre un levier de QVCT car il :", ["Supprime toute communication", "Offre flexibilite et autonomie", "Interdit le numerique", "Remplace le PGI"], 1),

        (7, "facile", "Mobiliser des competences sur un poste sert a :", ["Remplacer l'organisation", "Bien occuper le poste et performer", "Supprimer la formation", "Eliminer l'evaluation"], 1),

        (8, "moyen", "Un profil de competences precise :", ["Le prix du produit", "Les savoirs, savoir-faire et savoir-etre requis", "La part de marche", "Les dividendes"], 1),

        (9, "facile", "L'approche par competences relie :", ["Uniquement la finance et le droit", "Individu, poste et performance de l'organisation", "Marketing et publicite seulement", "Supprime le travail"], 1),

        (10, "moyen", "Amenager des locaux lumineux releve de :", ["La comptabilite analytique", "L'optimisation des conditions de travail", "La valeur boursiere", "L'open data"], 1),

        (11, "facile", "Former un salarie developpe surtout :", ["Uniquement son savoir-etre", "Ses savoirs et savoir-faire", "Le cours de l'action", "La notoriete"], 1),

        (12, "moyen", "Des conditions de travail degradees peuvent :", ["Augmenter toujours la productivite", "Nuire a la performance et a la motivation", "Supprimer les competences", "Eliminer le PGI"], 1),

    ],

)



CH5 = block(

    5,

    [

        (1, "facile", "L'evaluation professionnelle sert a :", ["Punir systematiquement", "Mesurer et ameliorer la performance du salarie", "Remplacer le salaire", "Supprimer l'entretien"], 1),

        (2, "moyen", "L'entretien professionnel permet :", ["De supprimer les objectifs", "Un dialogue sur les resultats et les perspectives", "D'eviter toute evaluation", "De fixer seul le prix de vente"], 1),

        (3, "facile", "La retribution inclut :", ["Uniquement les vacances", "Salaire, primes et avantages", "Le bilan", "La part de marche"], 1),

        (4, "moyen", "L'equite interne en remuneration signifie :", ["Payer tout le monde identiquement sans critere", "Une coherence des salaires au sein de l'organisation", "Supprimer les primes", "Payer les concurrents"], 1),

        (5, "facile", "Une prime peut remunerer :", ["Uniquement la presence", "Une performance ou un resultat", "Les stocks", "L'open data"], 1),

        (6, "moyen", "Lier evaluation et retribution peut :", ["Toujours demotiver", "Motiver si le lien est percu comme juste", "Supprimer le dialogue", "Eliminer les objectifs"], 1),

        (7, "facile", "Une grille d'evaluation :", ["Remplace les statuts", "Precise des criteres et des niveaux de performance", "Supprime l'entretien", "Calcule la VA"], 1),

        (8, "moyen", "Les avantages en nature sont :", ["Toujours illegaux", "Des elements de retribution non monetaires (voiture, logement...)", "Des charges fixes", "Des dividendes"], 1),

        (9, "facile", "L'evaluation peut identifier :", ["Uniquement des fautes", "Des besoins de formation", "Le cours de bourse", "La notoriete assistee"], 1),

        (10, "moyen", "L'equite externe compare les salaires :", ["Aux stocks en magasin", "A ceux pratiques sur le marche du travail", "Au bilan uniquement", "Aux KPI Instagram"], 1),

        (11, "facile", "Motiver par la retribution suppose :", ["Des salaires aleatoires", "Un lien clair entre effort, resultats et remuneration", "L'absence d'objectifs", "La suppression des primes"], 1),

        (12, "moyen", "Un entretien annuel mal prepare risque :", ["D'augmenter toujours la motivation", "De etre percu comme injuste ou inutile", "De supprimer le salaire", "De remplacer le PGI"], 1),

    ],

)



CH6 = block(

    6,

    [

        (1, "facile", "Le Big Data se caracterise notamment par :", ["Un faible volume", "Volume, variete et velocite eleves (5V)", "L'absence de donnees numeriques", "Uniquement du papier"], 1),

        (2, "facile", "L'open data designe des donnees :", ["Secretes", "Publiques, reutilisables et diffusibles", "Personnelles sans consentement", "Commerciales fermees"], 1),

        (3, "moyen", "Donnee -> information -> connaissance signifie :", ["Tout est identique", "La donnee prend du sens puis guide la decision", "On supprime la decision", "On interdit le SI"], 1),

        (4, "moyen", "Une donnee personnelle permet :", ["De vendre plus cher", "D'identifier une personne directement ou indirectement", "De supprimer le RGPD", "De remplacer le PGI"], 1),

        (5, "facile", "Un systeme d'information (SI) sert a :", ["Decorer les bureaux", "Collecter, traiter et diffuser l'information", "Supprimer les donnees", "Remplacer les salaries"], 1),

        (6, "moyen", "Le RGPD impose notamment :", ["De publier tous les mots de passe", "D'informer les personnes et de securiser les donnees", "D'interdire Internet", "De supprimer les registres"], 1),

        (7, "facile", "La qualite de l'information exige qu'elle soit :", ["Toujours ancienne", "Pertinente, fiable, objective et accessible", "Secrete pour tous", "Sans lien avec la decision"], 1),

        (8, "moyen", "Un PGI dans le SI regroupe :", ["Uniquement la paie", "Plusieurs applications metiers sur une base commune", "Les reseaux sociaux personnels", "Les encheres en ligne"], 1),

        (9, "facile", "La velocite dans les 5V concerne :", ["La couleur du logo", "La rapidite de disponibilite de l'information", "Le nombre d'actionnaires", "La marge commerciale"], 1),

        (10, "moyen", "Exploiter des donnees pour un tableau de bord aide :", ["A supprimer la comptabilite", "A la prise de decision", "A interdire le marketing", "A eliminer les clients"], 1),

        (11, "facile", "Un CRM est surtout lie a :", ["La gestion de la relation client", "La maintenance des ascenseurs", "Le droit penal", "Les encheres"], 1),

        (12, "moyen", "Sans autorisation, une organisation ne peut pas exploiter librement :", ["Des donnees anonymes agregees", "Des donnees personnelles identifiantes", "Des donnees ouvertes publiques", "Des statistiques officielles"], 1),

    ],

)



CH8 = block(

    8,

    [

        (1, "facile", "Un processus de gestion est :", ["Un logiciel de paie", "Un enchainement d'activites pour atteindre un resultat", "Un type de contrat", "Une sanction"], 1),

        (2, "facile", "Un evenement declencheur dans un schema :", ["Est toujours le resultat final", "Lance une activite du processus", "Supprime les regles d'emission", "Remplace le PGI"], 1),

        (3, "moyen", "Un PGI permet notamment :", ["Des saisies multiples des memes donnees", "Une saisie unique mise a jour en temps reel", "L'absence de base de donnees", "La suppression du reseau"], 1),

        (4, "moyen", "Le e-commerce correspond a :", ["Des ventes uniquement en magasin", "Des transactions commerciales en ligne", "Un intranet", "Une note de service"], 1),

        (5, "facile", "Le m-commerce est :", ["Un magasin physique", "Du e-commerce via un terminal mobile", "Un type d'association", "Un controle des dirigeants"], 1),

        (6, "moyen", "Un site de marche par encheres :", ["Fixe un prix unique sans concurrence", "Attribue le bien au plus offrant a la cloture", "Supprime Internet", "Remplace l'AGO"], 1),

        (7, "facile", "Le teletravail permet :", ["De ne jamais utiliser le numerique", "De travailler a distance avec un SI adapte", "D'eliminer le contrat de travail", "De supprimer la securite"], 1),

        (8, "moyen", "Le cloud computing consiste a :", ["Stocker sur le disque local uniquement", "Stocker et traiter sur des serveurs distants via Internet", "Supprimer les donnees", "Interdire le PGI"], 1),

        (9, "facile", "Deployer un PGI peut etre contraint car :", ["C'est toujours gratuit", "Le cout et la reorganisation des processus sont lourds", "Il supprime les droits d'acces", "Il interdit le e-commerce"], 1),

        (10, "moyen", "Un SI structurant peut :", ["Rendre l'organisation totalement flexible sans regle", "Modeliser et rigidifier certains enchainements de travail", "Supprimer les acteurs", "Eliminer l'information"], 1),

        (11, "facile", "Les regles d'emission relient :", ["Un evenement declencheur a une activite sans issue", "Une activite a ses issues possibles", "Le bilan au compte de resultat", "La VA au CA"], 1),

        (12, "moyen", "L'IA dans les logiciels professionnels sert souvent a :", ["Remplacer toute strategie", "Traiter de grands volumes et automatiser des taches", "Supprimer le cloud", "Interdire la mobilite"], 1),

    ],

)



CH9 = block(

    9,

    [

        (1, "facile", "La valeur percue depend :", ["Uniquement du cout comptable", "De l'arbitrage avantages attendus / sacrifices", "Du nombre de salaries", "Du statut juridique"], 1),

        (2, "moyen", "L'image de marque correspond :", ["Au prix de revient", "Aux representations mentales associees a la marque", "Au seul logo", "Aux amortissements"], 1),

        (3, "facile", "La notoriete assistee se mesure :", ["Sans aucune liste de marques", "En citant une marque a partir d'une liste proposee", "Uniquement en magasin", "Par le bilan"], 1),

        (4, "moyen", "La satisfaction client resulte :", ["Du prix le plus bas uniquement", "De la comparaison attentes / experience vecue", "De la suppression de la pub", "Du dividende"], 1),

        (5, "facile", "Un influenceur peut agir sur :", ["Le code du travail", "La valeur percue par son audience", "Le passif du bilan", "L'AGO"], 1),

        (6, "moyen", "L'e-reputation designe :", ["Les ventes en magasin", "Ce qui se dit sur la marque sur les medias digitaux", "Les stocks", "La marge brute"], 1),

        (7, "facile", "Un KPI sur les reseaux sociaux peut etre :", ["Le nombre de followers ou d'interactions", "Le capital social", "L'objet social", "Le seuil de rentabilite"], 0),

        (8, "moyen", "Le brand content vise a :", ["Supprimer la publicite", "Creer une experience de marque via des contenus", "Remplacer le PGI", "Eliminer les clients"], 1),

        (9, "facile", "La qualite percue peut augmenter si :", ["On supprime le SAV", "On ajoute services associes (hotline, garantie)", "On cache le produit", "On supprime la pub"], 1),

        (10, "moyen", "Un bad buzz peut :", ["Augmenter toujours les ventes", "Degrader l'image et la valeur percue", "Supprimer la concurrence", "Remplacer le RGPD"], 1),

        (11, "facile", "Le top of mind mesure :", ["Les stocks", "La marque citee en premier spontanement", "Le resultat net", "La VA"], 1),

        (12, "moyen", "Une communaute de marque en ligne permet :", ["D'eviter tout echange", "De rapprocher clients et marque", "De supprimer le marketing", "D'eliminer les KPI"], 1),

    ],

)



CH10 = block(

    10,

    [

        (1, "facile", "Le compte de resultat presente :", ["Actif et passif", "Produits et charges sur une periode", "Uniquement les stocks", "La part de marche"], 1),

        (2, "facile", "L'actif du bilan regroupe :", ["Les dettes uniquement", "Les emplois de l'organisation", "Le chiffre d'affaires", "Les dividendes"], 1),

        (3, "moyen", "Les capitaux propres au passif :", ["Sont des dettes fournisseurs", "Representent les ressources propres de l'entreprise", "Remplacent le resultat", "Designent les stocks"], 1),

        (4, "moyen", "La valeur financiere s'appuie surtout sur :", ["Le cours de bourse du jour", "Le patrimoine et la rentabilite (comptabilite)", "La notoriete seule", "Le nombre de likes"], 1),

        (5, "facile", "La valeur boursiere depend :", ["Uniquement du bilan", "Des anticipations des investisseurs sur le cours", "Du teletravail", "De l'objet social"], 1),

        (6, "moyen", "Resultat d'exploitation =", ["Actif - passif", "Produits d'exploitation - charges d'exploitation", "CA - consommations intermediaires", "Dividendes - impots"], 1),

        (7, "facile", "Un ecart valeur boursiere / valeur financiere peut s'expliquer par :", ["L'absence d'investisseurs", "Les anticipations du marche", "La suppression du bilan", "L'open data"], 1),

        (8, "moyen", "Les charges de personnel sont :", ["Des produits", "Des charges d'exploitation", "Des capitaux propres", "Des actifs incorporels"], 1),

        (9, "facile", "Le passif du bilan indique :", ["Les emplois", "Les ressources (dettes et capitaux propres)", "Le CA", "La marge"], 1),

        (10, "moyen", "Une entreprise cotee en Bourse :", ["N'a pas de comptabilite", "A un cours d'action observable sur le marche", "N'a pas de valeur boursiere", "Supprime le bilan"], 1),

        (11, "facile", "Les produits d'exploitation incluent :", ["Les achats de marchandises (charges)", "Ventes et prestations", "Les amortissements seuls", "Les impots"], 1),

        (12, "moyen", "Analyser le patrimoine aide a :", ["Fixer le prix du menu", "Evaluer la solvabilite et la valeur financiere", "Mesurer la notoriete", "Calculer les stereotypes"], 1),

    ],

)



CH11 = block(

    11,

    [

        (1, "facile", "Le chiffre d'affaires (CA) mesure :", ["Les stocks", "Le montant des ventes", "Les capitaux propres", "La satisfaction"], 1),

        (2, "facile", "La valeur ajoutee (VA) =", ["CA + charges", "CA - consommations intermediaires", "Passif - actif", "Dividendes x actions"], 1),

        (3, "moyen", "Les consommations intermediaires sont :", ["Les salaires", "Les achats consommes pour produire", "Les impots sur les societes", "Les dividendes"], 1),

        (4, "moyen", "La VA se repartit entre :", ["Uniquement l'Etat", "Salaries, actionnaires, Etat, organismes financiers...", "Les clients uniquement", "Les fournisseurs seuls"], 1),

        (5, "facile", "Les facteurs de production incluent :", ["Uniquement le capital", "Travail, capital, matieres...", "Le logo", "La notoriete"], 1),

        (6, "moyen", "La valeur actionnariale privilegie :", ["Uniquement les salaries", "La logique de rentabilite pour les actionnaires", "La suppression des impots", "L'open data"], 1),

        (7, "facile", "La valeur partenariale met l'accent sur :", ["Le profit court terme seul", "L'equilibre entre parties prenantes", "La suppression des salaires", "Le bad buzz"], 1),

        (8, "moyen", "Un conflit d'interets peut opposer :", ["Deux clients", "Actionnaires et salaries sur la repartition de la VA", "Deux logos", "Deux intranets"], 1),

        (9, "facile", "CA = quantites x prix unitaire HT lorsque :", ["On vend un seul service gratuit", "On vend des produits ou prestations quantifiables", "On n'a pas de clients", "On supprime la TVA"], 1),

        (10, "moyen", "Augmenter les salaires dans la VA peut :", ["Toujours baisser la motivation", "Reduire la part d'autres acteurs ou la marge", "Supprimer l'Etat", "Eliminer le CA"], 1),

        (11, "facile", "Les parties prenantes sont :", ["Uniquement les banques", "Les acteurs impactes par l'activite (salaries, actionnaires...)", "Les robots", "Les serveurs DNS"], 1),

        (12, "moyen", "Concilier logiques actionnariale et partenariale suppose :", ["Ignorer les salaries", "Negocier une repartition equilibree de la VA", "Supprimer les impots", "Eliminer le CA"], 1),

    ],

)



CH12 = block(

    12,

    [

        (1, "facile", "Marge commerciale (entreprise commerciale) =", ["CA - consommations intermediaires", "Prix de vente - prix d'achat", "Actif - passif", "CA x quantite"], 1),

        (2, "facile", "Le cout de revient sert a :", ["Fixer le prix de vente en connaissant le cout", "Calculer la notoriete", "Mesurer la satisfaction", "Remplacer le PGI"], 1),

        (3, "moyen", "Prix de vente = cout + marge signifie :", ["Le cout est ignore", "La marge est le ecart entre prix et cout", "La marge est toujours nulle", "Le prix est fixe par l'Etat"], 1),

        (4, "moyen", "Baisser les prix sans baisser les couts :", ["Augmente toujours la marge unitaire", "Reduit generalement la marge", "Supprime la concurrence", "Augmente la VA automatiquement"], 1),

        (5, "facile", "Qualite elevee implique souvent :", ["Cout plus faible toujours", "Cout plus eleve", "Absence de marge", "Prix nul"], 1),

        (6, "moyen", "La concurrence homogene pousse :", ["A augmenter les prix sans limite", "A rester competitif sur les prix", "A supprimer les clients", "A eliminer les couts"], 1),

        (7, "facile", "La saisonnalite peut justifier :", ["Un prix constant toute l'annee", "Des prix variables selon la periode", "L'absence de ventes", "La suppression de la marge"], 1),

        (8, "moyen", "La marge totale depend :", ["Uniquement du prix unitaire", "Du prix unitaire ET des quantites vendues", "Du bilan seul", "De la notoriete"], 1),

        (9, "facile", "Maitriser les couts signifie :", ["Augmenter toutes les charges", "Optimiser les charges maetrisables", "Supprimer la qualite", "Interdire l'innovation"], 1),

        (10, "moyen", "Une guerre des prix risque :", ["D'augmenter toujours la marge", "De reduire la marge si les couts sont constants", "De supprimer la concurrence par definition", "D'eliminer le cout de revient"], 1),

        (11, "facile", "Innovation premium (ex. Apple) :", ["Prix bas et marge nulle", "Prix eleve et differentiation", "Absence de concurrence", "Cout zero"], 1),

        (12, "moyen", "Arbitrer prix / qualite / cout revient a :", ["Choisir uniquement le prix le plus bas", "Equilibrer trois dimensions liees", "Supprimer la marge", "Ignorer la concurrence"], 1),

    ],

)



CH13 = block(

    13,

    [

        (1, "facile", "La performance d'une organisation est :", ["Un stock en magasin", "L'atteinte d'objectifs pred?finis", "Un stereotype", "Un processus"], 1),

        (2, "facile", "Efficience signifie :", ["Des ressources non optimisees", "Des moyens optimises pour atteindre l'objectif", "L'echec systematique", "L'absence d'objectifs"], 1),

        (3, "moyen", "Un objectif de performance doit etre :", ["Flou et impossible a mesurer", "Mesurable et limite dans le temps", "Secret pour tous", "Sans indicateur"], 1),

        (4, "moyen", "La performance commerciale se mesure notamment par :", ["Le nombre de serveurs", "Le CA, la part de marche, la fidelite", "L'objet social", "Le RGPD"], 1),

        (5, "facile", "La part de marche =", ["CA entreprise / CA total marche (en %)", "Prix - cout", "Actif / passif", "VA - CI"], 0),

        (6, "moyen", "La rentabilite mesure :", ["Le volume de ventes seul", "La capacite a generer du profit par rapport aux capitaux", "La notoriete", "Le teletravail"], 1),

        (7, "facile", "La profitabilite concerne :", ["Uniquement la Bourse", "Le profit genere par l'activite", "Les stocks", "La culture d'entreprise"], 1),

        (8, "moyen", "Les dividendes sont :", ["Des charges d'exploitation", "Des sommes versees aux actionnaires", "Des impots", "Des stocks"], 1),

        (9, "facile", "L'autofinancement permet :", ["De supprimer les investissements", "De financer des projets avec des ressources internes", "D'eliminer le resultat", "De supprimer le CA"], 1),

        (10, "moyen", "Comparer la performance dans le temps permet :", ["D'ignorer l'evolution", "De voir si l'on progresse ou recule", "De supprimer les indicateurs", "D'eliminer la concurrence"], 1),

        (11, "facile", "Performance commerciale et financiere peuvent etre :", ["Toujours identiques", "Contradictoires (ex. volume up, marge down)", "Sans lien", "Illegal"], 1),

        (12, "moyen", "La fidelite client contribue a :", ["Reduire les ventes", "Stabiliser et augmenter le CA", "Supprimer la pub", "Eliminer la part de marche"], 1),

    ],

)



EXTRA = CH1 + CH2 + CH3 + CH4 + CH5 + CH6 + CH8 + CH9 + CH10 + CH11 + CH12 + CH13





def parse_duel_bank():

    text = DUEL_TS.read_text(encoding="utf-8")

    blocks = re.findall(

        r'id:\s*"([^"]+)"[\s\S]*?question:\s*("(?:\\.|[^"\\])*")[\s\S]*?choix:\s*\[([^\]]+)\][\s\S]*?bonIndex:\s*(\d)',

        text,

    )

    out = []

    for id_, q_json, choix_raw, bon in blocks:

        q = json.loads(q_json)

        choix_parts = re.findall(r'"((?:\\.|[^"\\])*)"', choix_raw)

        choix = [json.loads(f'"{p}"') for p in choix_parts]

        if len(choix) != 4:

            continue

        m = re.match(r"sdgn(\d+)-", id_)

        ch = int(m.group(1)) if m else 7

        out.append(

            {

                "id": id_,

                "chapter": ch,

                "difficulte": "facile" if "facile" in id_ else "moyen",

                "question": q,

                "choix": choix,

                "bonIndex": int(bon),

            }

        )

    # fix diff from source

    for item in out:

        m = re.search(

            rf'id:\s*"{re.escape(item["id"])}"[\s\S]*?difficulte:\s*"([^"]+)"',

            text,

        )

        if m:

            item["difficulte"] = m.group(1)

    return out





def main():

    duel = parse_duel_bank()

    by_id = {x["id"]: x for x in duel}

    for x in EXTRA:

        by_id[x["id"]] = x

    # Re-assign chapter 7 duel items explicitly

    for x in by_id.values():

        m = re.match(r"sdgn(\d+)-", x["id"])

        if m:

            x["chapter"] = int(m.group(1))

    rows = sorted(by_id.values(), key=lambda r: (r["chapter"], r["id"]))

    lines = [

        "/** QCM curùs (complùment) ù fusion avec gùnùration Missions dans sdgnMissionQcmPool.ts. */",

        "",

        'export type SdgnMissionQcmDifficulte = "facile" | "moyen";',

        "",

        "export type SdgnMissionQcm = {",

        '  id: string;',

        "  chapter: number;",

        '  difficulte: SdgnMissionQcmDifficulte;',

        "  question: string;",

        '  choix: [string, string, string, string];',

        "  bonIndex: 0 | 1 | 2 | 3;",

        "};",

        "",

        "export const SDGN_MISSION_QCM_CURATED: SdgnMissionQcm[] = [",

    ]

    for r in rows:

        choix_js = ", ".join(json.dumps(c, ensure_ascii=False) for c in r["choix"])

        lines.append(

            f'  {{ id: {json.dumps(r["id"])}, chapter: {r["chapter"]}, difficulte: {json.dumps(r["difficulte"])}, '

            f"question: {json.dumps(r['question'], ensure_ascii=False)}, "

            f"choix: [{choix_js}] as [string, string, string, string], bonIndex: {r['bonIndex']} }},"

        )

    lines.append("];")

    lines.append("")

    lines.append("export const DUEL_QUESTIONS_PAR_PARTIE = 8;")

    lines.append("export const DUEL_TEMPS_TOTAL_SEC = 72;")

    OUT.write_text("\n".join(lines) + "\n", encoding="utf-8")

    print("Written", OUT, "questions:", len(rows))





if __name__ == "__main__":

    main()

