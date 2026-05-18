/**
 * Genere src/data/duelQcmBank.ts avec une banque etendue SDGN chap. 7.
 * Usage: node scripts/generate-duel-qcm-bank.mjs
 * Apres generation, lancer aussi : npm run accent:duel-qcm (accents FR dans les libelles).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(__dirname, "../src/data/duelQcmBank.ts");

/** @type {{ id: string; diff: string; q: string; c: [string,string,string,string]; b: 0|1|2|3 }[]} */
const rows = [];

function add(id, diff, q, c0, c1, c2, c3, b) {
  rows.push({ id, diff, q, c: [c0, c1, c2, c3], b });
}

// --- Deja valides (01-20) reprises ---
const legacy = [
  ["sdgn7-01","facile","La visioconference sert surtout a :",["Remplacer tout travail sur site","Reunir a distance des collaborateurs et echanger en direct","Supprimer les e-mails internes","Heberger les bases de donnees de l'entreprise"],1],
  ["sdgn7-02","facile","Un outil de messagerie instantanee releve surtout de la famille :",["Stockage","Organisation","Communication","Creation"],2],
  ["sdgn7-03","facile","Un drive partage en equipe illustre surtout la famille d'outils :",["Communication","Organisation","Stockage","Creation"],2],
  ["sdgn7-04","facile","Le travail collaboratif avec le numerique vise notamment a :",["Eliminer toute reunion","Mutualiser les savoir-faire et cooperer, y compris a distance","Interdire le teletravail","Remplacer le management par des algorithmes"],1],
  ["sdgn7-05","moyen","L'e-communication designe surtout :",["Uniquement la publicite tele","La communication de l'organisation sur Internet et les medias sociaux","Les contrats papier signes en mairie","La comptabilite analytique"],1],
  ["sdgn7-06","moyen","Par rapport aux reseaux sociaux personnels, les reseaux sociaux professionnels :",["Sont toujours publics sans moderation","Ciblent la vie privee uniquement","Mettent l'accent sur le reseau, l'emploi et les competences liees au travail","Interdisent tout partage de fichiers"],2],
  ["sdgn7-07","moyen","Une communaute en ligne peut etre utile a l'organisation parce qu'elle :",["Remplace le siege social","Rassemble des acteurs autour d'un theme et produit des echanges d'information","Supprime la hierarchie","Garantit l'anonymat total des clients"],1],
  ["sdgn7-08","facile","Dans le reseau informatique de l'organisation, le serveur joue notamment le role de :",["Remplacer les collaborateurs","Support pour echanger des donnees, stocker l'information et communiquer","Bloquer Internet","Imprimer les factures clients uniquement"],1],
  ["sdgn7-09","moyen","Mettre en place un reseau informatique comporte des risques tels que :",["Uniquement des gains de productivite","Perte de donnees ou interruption des services, entre autres","La disparition du besoin de sauvegarde","L'interdiction legale du teletravail"],1],
  ["sdgn7-10","moyen","Les droits d'acces au reseau sont en general restreints pour :",["Augmenter le nombre de mots de passe oublies","Limiter ce que chacun peut voir ou modifier et renforcer la securite","Supprimer l'intranet","Interdire la visioconference"],1],
  ["sdgn7-11","facile","L'administrateur reseau s'occupe typiquement de :",["Vendre les produits en magasin","La gestion et la securisation de l'infrastructure reseau","Rediger les contrats commerciaux","Definir seul la strategie marketing"],1],
  ["sdgn7-12","moyen","L'intranet, par rapport a Internet :",["Est ouvert a tout le monde sans filtre","Est un reseau interne reserve aux membres de l'organisation","Ne transporte aucune donnee","Remplace toujours l'extranet"],1],
  ["sdgn7-13","moyen","L'extranet prolonge souvent l'intranet pour :",["Publier des contenus grand public sans controle","Donner un acces controle a des partenaires exterieurs autorises","Supprimer les serveurs","Remplacer la comptabilite"],1],
  ["sdgn7-14","facile","Un reseau social d'entreprise (RSE) est en general :",["Ouvert comme un reseau grand public sans identification","Un espace interne destine aux collaborateurs de l'organisation","Reserve exclusivement aux clients finaux","Un logiciel de paie"],1],
  ["sdgn7-15","moyen","Un interet du RSE pour la performance peut etre :",["Supprimer toute communication hierarchique","Fluidifier les echanges entre metiers et accelerer les reponses","Interdire le travail en equipe","Eliminer les projets transverses"],1],
  ["sdgn7-16","facile","L'intelligence collective repose surtout sur :",["Un seul expert qui decide pour tous","Les interactions entre personnes qui mettent en commun leurs idees","La suppression des reunions","Uniquement des robots"],1],
  ["sdgn7-17","moyen","Dans l'exemple des filtres anti-spam du cours, l'IA sert surtout a :",["Remplacer les salaries","Traiter des donnees pour classer ou filtrer automatiquement certains messages","Supprimer Internet","Gerer les salaires"],1],
  ["sdgn7-18","moyen","On parle d'intelligence artificielle parce que :",["Les ordinateurs ont une conscience morale","Des programmes traitent des donnees et peuvent s'ameliorer sans etre une pensee humaine","Les managers ne decident plus","Les donnees ne sont jamais stockees"],1],
  ["sdgn7-19","moyen","Au sein des organisations, IA et intelligence collective peuvent :",["Toujours se substituer l'une a l'autre sans complementarite","Se completer : l'IA peut liberer du temps pour des taches a plus forte valeur","Interdire toute cooperation","Remplacer le reseau informatique"],1],
  ["sdgn7-20","facile","Un agenda partage entre equipes releve plutot de la famille :",["Communication","Organisation","Stockage","Creation"],1],
];
for (const [id, diff, q, c, b] of legacy) add(id, diff, q, c[0], c[1], c[2], c[3], b);

// --- Lots supplementaires (varie bonIndex) ---
const templates = [
  ["facile", "Le partage d'ecran en visioconference permet surtout de :", ["Couper le micro de tout le monde", "Montrer un document ou une application aux participants", "Supprimer l'historique du chat", "Bloquer la camera obligatoirement"], 1],
  ["facile", "Un wiki d'equipe pour documenter les procedures releve surtout :", ["Communication", "Organisation", "Stockage", "Creation"], 3],
  ["moyen", "Un tableau Kanban partage (taches / colonnes) illustre surtout la famille :", ["Communication", "Organisation", "Stockage", "Creation"], 1],
  ["facile", "Une messagerie d'equipe type 'chat' interne releve surtout de :", ["Stockage", "Organisation", "Communication", "Creation"], 2],
  ["moyen", "L'e-communication inclut notamment :", ["Uniquement le courrier postal", "Les actions de communication sur Internet et reseaux sociaux", "La paie des fournisseurs", "La maintenance des ascenseurs"], 1],
  ["facile", "Les technologies numeriques favorisent la collaboration car elles :", ["Suppriment tout besoin humain", "Facilitent echanges et partage de documents a distance", "Interdisent le teletravail", "Remplacent la strategie"], 1],
  ["moyen", "Un risque des communautes en ligne mal cadrees :", ["Trop de clarte", "Diffusion d'informations non fiables ou hors sujet", "Absence totale d'Internet", "Fin automatique du contrat de travail"], 1],
  ["facile", "Le travail collaboratif, c'est :", ["Travailler seul sans outil", "Travailler avec plusieurs personnes vers un resultat commun", "Refuser les reunions", "Archiver uniquement"], 1],
  ["moyen", "Un reseau informatique d'entreprise relie typiquement :", ["Uniquement deux smartphones personnels", "Les postes via des equipements et un serveur", "Les clients B2C sans filtre", "Les distributeurs automatiques"], 1],
  ["facile", "Le serveur dans le reseau sert aussi de support pour :", ["La vente en magasin uniquement", "Stocker et echanger de l'information", "Remplacer le dialogue social", "Supprimer l'intranet"], 1],
  ["moyen", "La securisation du reseau vise notamment a :", ["Publier tous les salaires en ligne", "Reduire les acces non autorises et proteger les donnees", "Supprimer les mots de passe", "Ouvrir l'intranet au monde entier"], 1],
  ["facile", "Internet est :", ["Un reseau interne a une seule entreprise", "Un reseau mondial public reliant de nombreux ordinateurs", "Un logiciel de messagerie", "Un type d'extranet"], 1],
  ["moyen", "L'intranet est accessible en principe a :", ["Tout internaute sans compte", "Les membres de l'organisation (collaborateurs)", "Uniquement les concurrents", "Les robots uniquement"], 1],
  ["moyen", "L'extranet sert souvent a :", ["Remplacer le site vitrine public", "Ouvrir un espace securise vers des partenaires autorises", "Supprimer les serveurs", "Heberger des jeux video"], 1],
  ["facile", "Sur un RSE, les echanges type 'mur' ou fil d'actualite visent :", ["La comptabilite generale", "La communication et la cooperation entre collaborateurs", "La suppression du management", "Le stockage froid uniquement"], 1],
  ["moyen", "Limiter l'acces a certaines infos selon le metier (RH, finance...) traduit :", ["Une absence de reseau", "Une gestion des droits d'acces", "L'interdiction du teletravail", "La fin de l'intelligence collective"], 1],
  ["facile", "L'intelligence collective peut emerger quand :", ["Une seule personne impose sans ecoute", "Plusieurs personnes echangent et combinent leurs idees", "L'ordinateur est eteint", "Les clients ne donnent aucun avis"], 1],
  ["moyen", "L'IA au service des equipes peut :", ["Remplacer toute decision humaine", "Automatiser des taches repetitives pour liberer du temps", "Supprimer le besoin d'information", "Eliminer le reseau social d'entreprise"], 1],
  ["moyen", "Pourquoi l'IA est-elle dite 'artificielle' ?", ["Parce qu'elle imite parfaitement la conscience", "Parce que ce sont des programmes qui traitent des donnees, sans pensee biologique", "Parce qu'elle n'utilise jamais de donnees", "Parce qu'elle est interdite en Europe"], 1],
  ["facile", "Un outil de visioconference appartient a la famille :", ["Stockage", "Organisation", "Communication", "Creation"], 2],
  ["facile", "Un espace cloud partage pour fichiers projet releve surtout :", ["Communication", "Organisation", "Stockage", "Creation"], 2],
  ["moyen", "Les reseaux sociaux professionnels mettent l'accent sur :", ["Les photos de vacances uniquement", "L'emploi, le reseau et les competences liees au travail", "Les recettes de cuisine", "La vente illegale"], 1],
  ["moyen", "Les communautes en ligne d'entreprise peuvent aider a :", ["Supprimer la veille", "Capitaliser des retours d'experience et bonnes pratiques", "Eviter toute moderation", "Remplacer la loi"], 1],
  ["facile", "Le role de l'administrateur reseau inclut :", ["Vendre en caisse", "Configurer et securiser l'infrastructure", "Rediger les statuts juridiques", "Gerer les stocks physiques uniquement"], 1],
  ["moyen", "Un avantage du travail collaboratif numerique :", ["Moins de coordination", "Reactivite accrue et mutualisation des savoirs", "Suppression des projets", "Interdiction du partage"], 1],
  ["moyen", "Un risque du reseau informatique cite dans le cours :", ["Trop de transparence obligatoire", "Perte de donnees ou interruption de service", "Absence de serveur", "Interdiction d'e-mail"], 1],
  ["facile", "L'extranet prolonge l'intranet vers :", ["Tout le web sans filtre", "Des acteurs externes autorises (partenaires)", "Les satellites uniquement", "Les appareils non connectes"], 1],
  ["moyen", "Decathlon (cas du cours) utilise des outils collaboratifs pour :", ["Supprimer les magasins", "Fluidifier le travail entre magasins, logistique et siege", "Interdire la logistique", "Remplacer les collaborateurs par des robots"], 1],
  ["moyen", "Dans le cas Decathlon, les droits d'acces differencies servent a :", ["Publier tous les salaires", "Limiter l'acces selon les metiers et proteger la confidentialite", "Supprimer l'intranet", "Ouvrir tout a Internet"], 1],
  ["moyen", "L'Oréal (cas du cours) echange avec des partenaires via :", ["Une page Facebook sans moderation", "Des plateformes numeriques securisees reservees aux autorises", "Uniquement le courrier cheval", "Des SMS personnels"], 1],
  ["moyen", "L'Oréal utilise aussi l'IA pour :", ["Supprimer les equipes communication", "Automatiser certains tris ou suggestions et liberer du temps", "Interdire les donnees", "Remplacer les clients"], 1],
  ["facile", "Une videoconference 'hybride' melange :", ["Uniquement des robots", "Participants presents et participants a distance", "Deux intranets incompatibles", "Internet et la television analogique"], 1],
  ["moyen", "Le moindre privilege (principe de securite) consiste a :", ["Donner tous les droits a tout le monde", "Donner le minimum de droits necessaires a chaque profil", "Supprimer les administrateurs", "Interdire la sauvegarde"], 1],
  ["facile", "Un forum interne sur le RSE sert surtout a :", ["Payer les fournisseurs", "Discuter et partager autour de sujets de travail", "Heberger des films", "Remplacer le serveur"], 1],
  ["moyen", "La difference clef intranet / Internet :", ["Aucune", "L'intranet est interne a l'organisation, Internet est public mondial", "Internet est plus petit qu'un intranet", "L'intranet n'utilise pas TCP/IP"], 1],
  ["facile", "Un calendrier partage pour planifier des lancements produits releve :", ["Stockage", "Organisation", "Communication seule", "Creation artistique"], 1],
  ["moyen", "L'intelligence collective et l'IA peuvent etre :", ["Toujours identiques", "Complementaires : l'humain garde le sens, l'IA aide sur volume ou repetition", "Interdites ensemble", "Reservees aux RH uniquement"], 1],
  ["facile", "Un outil de co-edition de texte (meme document en direct) releve surtout :", ["Stockage", "Organisation", "Communication", "Creation"], 3],
  ["moyen", "Les communautes en ligne necessitent souvent :", ["Aucune regle", "Un cadre clair (moderation, objectifs, charte)", "La suppression du numerique", "L'absence de moderation"], 1],
  ["facile", "Le reseau social d'entreprise (RSE) vise une communication :", ["Uniquement externe grand public", "Interne entre collaborateurs", "Uniquement gouvernementale", "Sans aucun contenu"], 1],
  ["moyen", "Un 'mur' sur un RSE est proche fonctionnellement de :", ["Un grand livre comptable", "Un fil d'actualite avec publications et reactions", "Un serveur DNS", "Une machine a cafe"], 1],
  ["facile", "La visioconference peut reduire :", ["Toute interaction humaine", "Les contraintes de deplacement pour certaines reunions", "Le besoin de securite", "Les droits d'acces"], 1],
  ["moyen", "Une panne reseau peut impacter :", ["Uniquement les loisirs", "La continuite des services et la collaboration", "La couleur du logo", "Les saisons meteorologiques"], 1],
  ["facile", "Les quatre familles d'outils du chapitre incluent :", ["Achat, vente, stock, paie", "Communication, organisation, stockage, creation", "Marketing, finance, droit, RH", "Internet, intranet, extranet, cloud public"], 1],
  ["moyen", "L'e-communication concerne aussi :", ["Uniquement la radio FM", "La presence sur medias sociaux et canaux en ligne", "La menuiserie", "La vente de timbres"], 1],
  ["facile", "Un partenaire accede a des documents sur un espace dedie :", ["C'est typiquement de l'intranet public", "C'est proche de la logique extranet (acces controle)", "C'est toujours illegal", "C'est sans authentification"], 1],
  ["moyen", "L'IA pour suggestions de contenus (cas type) peut aider a :", ["Supprimer la creation humaine", "Gagner du temps sur le tri ou la preparation", "Eliminer les donnees clients", "Interdire les campagnes"], 1],
  ["facile", "Les droits d'acces restreints cherchent a eviter :", ["La collaboration", "Les fuites ou modifications non autorisees", "Les reunions", "Les projets transverses"], 1],
  ["moyen", "Un espace partage 'projet' avec listes de taches releve surtout :", ["Communication", "Organisation", "Stockage pur", "Creation video"], 1],
  ["facile", "L'intranet peut diffuser :", ["Les memes contenus que n'importe quel site public sans filtre", "Des informations internes (procedure, annuaire, outils)", "Uniquement des publicites externes", "Des virus volontairement"], 1],
  ["moyen", "L'extranet peut servir a partager avec des partenaires :", ["Toutes les donnees sans limite", "Documents et indicateurs selon profils autorises", "Les mots de passe administrateur", "Des contenus personnels des salaries"], 1],
  ["facile", "L'intelligence collective se nourrit de :", ["Le silence total", "Les echanges et la diversite des contributions", "Un seul algorithme", "L'absence d'objectif"], 1],
  ["moyen", "Filtres anti-spam : l'IA traite surtout :", ["Les salaires papier", "Des messages pour les classer / filtrer", "Les contrats de mariage", "La meteorologie"], 1],
  ["facile", "Un outil de sondage rapide apres reunion releve plutot :", ["Stockage", "Organisation", "Communication / retour d'information", "Creation industrielle"], 2],
  ["moyen", "La performance d'une org. numerique depend aussi de :", ["Le numerique seul", "Le cadre, la qualite de l'info et la responsabilite des acteurs", "La suppression des droits", "L'absence de moderation"], 1],
  ["facile", "Teletravail + outils collaboratifs illustrent :", ["La fin du management", "Le travail a distance coordonne par le numerique", "L'interdiction du serveur", "La suppression de l'intranet"], 1],
  ["moyen", "Un risque des RS en entreprise mal pilotes :", ["Trop peu de messages", "Atteinte a l'image ou fuite d'information sensible", "Absence d'Internet", "Croissance automatique des ventes"], 1],
  ["facile", "La famille 'creation' inclut typiquement :", ["Un agenda partage", "Des outils pour produire contenus ou supports (presentation, design)", "Un serveur DNS", "Un pare-feu"], 1],
  ["moyen", "La famille 'organisation' inclut typiquement :", ["Uniquement la TV", "Planning, gestion de taches, coordination de projet", "Un antivirus", "Un routeur seul"], 1],
  ["facile", "La famille 'stockage' sert surtout a :", ["Envoyer des SMS", "Conserver et partager des fichiers ou donnees", "Filtrer le spam", "Gerer la paie"], 1],
  ["moyen", "Un client qui suit une communaute de marque sur RS :", ["Est toujours salarie", "Echange avec l'organisation via canaux publics/semi-publics", "Accede a l'intranet", "Devient administrateur reseau"], 1],
  ["facile", "Le chapitre distingue souvent RS 'personnels' et RS :", ["Satellites", "Professionnels", "Bancaires uniquement", "Medicaux uniquement"], 1],
  ["moyen", "La securite sur reseau d'entreprise inclut souvent :", ["Publier tous les mots de passe", "Authentification, mises a jour, sauvegardes", "Supprimer les logs", "Ouvrir tous les ports"], 1],
  ["facile", "L'administrateur reseau et les droits utilisateurs visent entre autres :", ["Augmenter les risques", "Confidentialite et integrite des donnees", "Supprimer la collaboration", "Interdire l'extranet"], 1],
  ["moyen", "L'IA ne 'comprend' pas comme un humain car :", ["Elle est toujours consciente", "Elle applique des regles et modeles statistiques sur des donnees", "Elle ne traite jamais de donnees", "Elle est uniquement mecanique a roues"], 1],
  ["facile", "Un tunnel VPN entre sites peut s'inscrire dans :", ["La publicite TV", "La logique de reseau securise entre acteurs de l'org.", "La creation musicale", "L'open data obligatoire"], 1],
  ["moyen", "Decathlon : fluidifier entre magasins et siege grace au numerique va dans le sens :", ["De l'intelligence collective et du partage des savoirs", "De la suppression des magasins", "De l'interdiction de la logistique", "Du remplacement des clients"], 1],
  ["moyen", "L'Oréal : communautes en ligne clients servent a :", ["Remplacer le produit", "Dialoguer et partager de l'information avec le public", "Supprimer le marketing", "Heberger les salaires"], 1],
  ["facile", "Un outil de brainstorming en ligne releve surtout :", ["Stockage", "Organisation", "Communication", "Creation / cooperation idees"], 3],
  ["moyen", "La moderation d'une communaute en ligne sert a :", ["Supprimer toute parole", "Encadrer les echanges et limiter les derives", "Remplacer le droit", "Eliminer les donnees"], 1],
  ["facile", "L'intranet n'est en general pas :", ["Reserve aux collaborateurs", "Un reseau interne", "Ouvert a tout le monde comme Internet", "Un outil de communication interne"], 2],
  ["moyen", "L'extranet vs simple site public :", ["C'est identique", "L'extranet implique souvent authentification et partenaires", "L'extranet n'existe pas", "Le site public est toujours secret"], 1],
  ["facile", "Une reunion avec partage d'ecran facilite :", ["La suppression du document", "La comprehension commune d'un meme support visuel", "La perte de donnees", "Le blocage du micro"], 1],
  ["moyen", "L'intelligence collective peut etre favorisee par un RSE car :", ["Il supprime les echanges", "Il rend visibles questions et reponses entre metiers", "Il interdit les projets", "Il remplace la strategie"], 1],
  ["facile", "Un repertoire d'equipe sur l'intranet releve :", ["Uniquement de la creation", "De la communication et/ou organisation des infos internes", "Du stockage froid sans acces", "De l'extranet public"], 1],
  ["moyen", "Automatiser le tri d'informations (IA) peut liberer du temps pour :", ["Ne plus lire", "Des missions a plus forte valeur ajoutee", "Supprimer la securite", "Eliminer les clients"], 1],
  ["facile", "Les outils collaboratifs incitent souvent a :", ["Revenir uniquement au papier", "Revoir les methodes de travail vers plus de cooperation", "Supprimer les managers", "Interdire les documents"], 1],
  ["moyen", "Un risque 'interruption des services' sur reseau signifie :", ["Trop de succes commercial", "Pannes ou indisponibilite des outils critiques", "Trop de moderation", "Absence de clients"], 1],
  ["facile", "L'extranet s'adresse plutot a :", ["Tous les internautes anonymes", "Des partenaires externes autorises", "Les animaux", "Les serveurs uniquement"], 1],
  ["moyen", "La visioconference ne remplace pas toujours :", ["Le besoin de clarifier par echange synchrone", "La necessite de cadre humain (ecoute, decision)", "Le reseau", "Le cloud"], 1],
  ["facile", "Un 'drive' avec droits de lecture seule pour certains profils illustre :", ["Absence de securite", "Des droits d'acces differencies", "L'open data", "L'Internet public"], 1],
  ["moyen", "L'e-communication peut concerner :", ["Uniquement le papier", "Site web, RS, newsletters, contenus en ligne", "La mecanique auto", "La cuisine"], 1],
  ["facile", "La cooperation a distance repose sur :", ["L'absence d'outils", "Des outils numeriques adaptes et des usages clairs", "La suppression du serveur", "L'interdiction de l'intranet"], 1],
  ["moyen", "Un objectif du numerique collaboratif en org. :", ["Supprimer la coordination", "Ameliorer reactivite et partage des connaissances", "Eliminer les equipes", "Interdire la communication"], 1],
  ["facile", "Le filtre anti-spam est un exemple d'usage ou l'IA :", ["Remplace les humains pour tout", "Traite automatiquement un grand volume de messages", "Supprime Internet", "Ecrit les lois"], 1],
  ["moyen", "Choisir un outil d'organisation vs communication :", ["C'est la meme famille toujours", "Un agenda partage = organisation ; chat = communication", "Tout est stockage", "Tout est creation"], 1],
  ["facile", "L'intranet peut heberger :", ["Des procedures internes et outils metier", "Uniquement des jeux publics", "Des secrets concurrents sans controle", "Rien du tout"], 0],
  ["moyen", "La complementarite IA / intelligence collective signifie souvent :", ["L'IA supprime le collectif", "Le collectif apporte le sens, l'IA traite le volume ou l'automatisation", "On ne peut choisir qu'un seul outil", "L'IA interdit les communautes"], 1],
  ["facile", "Un sondage interne sur le RSE sert a :", ["Payer les impots", "Recueillir des retours rapides des collaborateurs", "Supprimer l'intranet", "Bloquer Internet"], 1],
  ["moyen", "La 'performance' avec outils collaboratifs depend aussi :", ["Uniquement du prix du logiciel", "De la qualite de l'information et du cadre (securite, roles)", "De la suppression des droits", "De l'absence de formation"], 1],
  ["facile", "Un wiki interne pour procedures = famille :", ["Communication", "Organisation", "Stockage", "Creation / capitalisation documentaire"], 3],
  ["moyen", "Decathlon : droits geres par administrateur reseau pour :", ["Publier tout sur Internet", "Confidentialite et securite des acces", "Supprimer les magasins", "Remplacer les clients"], 1],
  ["facile", "L'Oréal : espace partenaires = logique proche de :", ["Intranet grand public", "Extranet securise", "Internet sans authentification", "Stockage local sans reseau"], 1],
  ["moyen", "Les communautes en ligne produisent de l'information utile si :", ["Il n'y a aucune regle", "Le cadre et les objectifs sont clairs", "Personne ne participe", "Tout est secret absolu"], 1],
  ["facile", "Un outil de visio avec lever de main releve :", ["Stockage", "Organisation", "Communication / animation de reunion", "Creation 3D"], 2],
  ["moyen", "Reseau informatique : le serveur centralise souvent :", ["Les loisirs uniquement", "Fichiers, services et acces pour les postes clients", "La television", "Les panneaux solaires"], 1],
  ["facile", "L'Internet est accessible :", ["Seulement au siege", "A de tres nombreux utilisateurs dans le monde", "Sans connexion", "Uniquement en intranet"], 1],
  ["moyen", "Un RSE ameliore parfois la performance car il :", ["Supprime les echanges", "Rend visibles questions et reponses entre personnes qui ne se croisent pas", "Interdit la hierarchie", "Remplace la strategie"], 1],
  ["facile", "L'intelligence collective n'est pas :", ["La somme d'echanges et d'idees combinees", "Uniquement un logiciel installe", "Une dynamique humaine", "Une cooperation"], 1],
  ["moyen", "L'IA dans suggestions de contenus : risque a mentionner :", ["Trop de qualite", "Biais, erreurs ou contenus inadaptes si on ne valide pas", "Absence de donnees", "Trop de securite"], 1],
  ["facile", "Un tableur partage en temps reel releve surtout :", ["Communication", "Organisation", "Stockage", "Creation / co-production de donnees"], 3],
  ["moyen", "La difference 'synchrone' (visio) vs 'asynchrone' (forum) :", ["Aucune", "Synchrone = meme temps reel ; asynchrone = messages decales dans le temps", "Forum = toujours synchrone", "Visio = toujours asynchrone"], 1],
  ["facile", "L'extranet peut necessiter :", ["Aucune authentification", "Identifiants et controle des acces", "Suppression du reseau", "Publicite obligatoire"], 1],
  ["moyen", "Securiser le reseau : interet des profils utilisateurs :", ["Donner les memes droits a tous", "Adapter les droits au besoin du poste", "Supprimer l'authentification", "Publier les mots de passe"], 1],
  ["facile", "Un outil de mindmap collaboratif releve :", ["Stockage seul", "Organisation / structuration des idees", "Communication uniquement", "Hebergement DNS"], 1],
  ["moyen", "L'e-communication peut toucher :", ["Uniquement les salaries", "Clients, prospects, partenaires via canaux en ligne", "Personne", "Uniquement les machines"], 1],
  ["facile", "La visioconference necessite generalement :", ["Aucune connexion", "Connexion et equipements audio/video adaptes", "Uniquement un fax", "Papier carbone"], 1],
  ["moyen", "L'IA et l'humain : decision strategique complexe releve souvent :", ["Uniquement de l'IA sans relecture", "Du jugement humain avec aide eventuelle des donnees", "Du hasard", "Des robots uniquement"], 1],
  ["facile", "Un canal 'equipe' dans un outil de messagerie = famille :", ["Stockage", "Organisation", "Communication", "Creation"], 2],
  ["moyen", "Pourquoi limiter l'acces aux infos sensibles (RH, finance) ?", ["Pour interdire le travail", "Pour reduire les risques de fuite ou d'erreur", "Pour supprimer le numerique", "Pour augmenter les fuites"], 1],
  ["facile", "L'intranet peut etre un point d'entree vers :", ["Uniquement Wikipedia publique", "Services internes (notes de frais, annuaire, docs)", "Les comptes clients sans auth", "Rien"], 1],
  ["moyen", "Decathlon : plusieurs sites + outils collaboratifs = enjeu :", ["Supprimer la logistique", "Coordonner et partager l'information entre lieux", "Interdire les magasins", "Remplacer les produits"], 1],
  ["facile", "L'Oréal : IA + equipes = idee du cours :", ["L'IA remplace tout", "L'IA aide sur volume, les equipes sur le sens et la validation", "On supprime les donnees", "On interdit les campagnes"], 1],
  ["moyen", "Communaute en ligne : moderation sert aussi a :", ["Eliminer toute critique", "Garder des echanges constructifs et conformes au cadre", "Publier des secrets", "Supprimer les utilisateurs sans raison"], 1],
  ["facile", "Un outil de reservation de salles releve :", ["Creation", "Organisation", "Stockage froid", "Communication externe uniquement"], 1],
  ["moyen", "Reseau d'entreprise : 'client' designe souvent :", ["Uniquement un client externe", "Le poste utilisateur qui consomme des services du reseau", "Un avocat", "Un fournisseur de lait"], 1],
  ["facile", "L'intelligence collective peut etre enrichie par :", ["Le silence", "La diversite des metiers et retours dans un RSE", "L'absence d'objectif", "Un seul canal"], 1],
  ["moyen", "Fuite d'information sur RS entreprise : prevention inclut :", ["Publier tout", "Formation, charte d'usage et controle des acces", "Supprimer les RS", "Interdire les managers"], 1],
  ["facile", "Un outil de gestion de tickets support releve surtout :", ["Creation artistique", "Organisation du travail et du suivi", "Stockage de films", "Communication satellite"], 1],
  ["moyen", "L'extranet partenaires vs communaute publique :", ["Identique", "Partenaires = acces controle et documents operationnels", "Communaute = toujours secret defense", "Extranet = sans login"], 1],
  ["facile", "La visioconference avec transcription automatique relie :", ["Papier et crayon", "Communication et aide numerique (IA)", "Bilan comptable", "Serveur physique uniquement"], 1],
  ["moyen", "Chapitre 7 : le numerique dans l'org. impose souvent de penser :", ["Uniquement la technique", "Technique + usages + gouvernance (qui voit quoi)", "Uniquement le marketing", "Uniquement la paie"], 1],
];

let n = 21;
for (const [diff, q, c, b] of templates) {
  const id = `sdgn7-${String(n).padStart(2, "0")}`;
  add(id, diff, q, c[0], c[1], c[2], c[3], b);
  n++;
}

const header = `/** Banque Duel : SDGN chapitre 7 - grande banque pour limiter les repetitions (generee par scripts/generate-duel-qcm-bank.mjs). */

export type DuelMatiere = "Management" | "Sciences de Gestion" | "Droit" | "Economie";
export type DuelDifficulte = "facile" | "moyen";

export type DuelQcmSource = {
  id: string;
  matiere: DuelMatiere;
  difficulte: DuelDifficulte;
  question: string;
  choix: [string, string, string, string];
  bonIndex: 0 | 1 | 2 | 3;
};

export const DUEL_QCM_BANK: DuelQcmSource[] = [
`;

const body = rows
  .map(
    (r) => `  {
    id: ${JSON.stringify(r.id)},
    matiere: "Sciences de Gestion",
    difficulte: ${JSON.stringify(r.diff)},
    question: ${JSON.stringify(r.q)},
    choix: [${r.c.map((x) => JSON.stringify(x)).join(", ")}],
    bonIndex: ${r.b},
  },`
  )
  .join("\n");

const footer = `
];

export const DUEL_QUESTIONS_PAR_PARTIE = 8;
/** Temps total chrono (secondes) - assez serre pour limiter la triche. */
export const DUEL_TEMPS_TOTAL_SEC = 72;
`;

fs.writeFileSync(out, header + body + footer, "utf8");
console.log("Written", out, "questions:", rows.length);
