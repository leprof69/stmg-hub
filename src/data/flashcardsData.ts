export const FLASHCARDS_DATA_VERSION = 3;

export type FlashcardProgramme = "management_1ere" | "management_terminale" | "sdgn";

export type FlashcardItem = {
  id: string;
  programme: FlashcardProgramme;
  notion: string;
  question: string;
  reponse: string;
  xp: number;
};

export const FLASHCARDS: FlashcardItem[] = [
  // Management 1ere
  { id: "m1-01", programme: "management_1ere", notion: "Action individuelle", question: "Qu'est-ce qu'une action individuelle ?", reponse: "Une action realisee par une seule personne pour son propre objectif.", xp: 8 },
  { id: "m1-02", programme: "management_1ere", notion: "Action collective", question: "Qu'est-ce qu'une action collective ?", reponse: "Une action menee par plusieurs personnes qui partagent un objectif commun.", xp: 8 },
  { id: "m1-03", programme: "management_1ere", notion: "Organisation", question: "Qu'est-ce qu'une organisation ?", reponse: "Un groupe structure qui agit dans la duree avec des regles, des ressources et un objectif.", xp: 9 },
  { id: "m1-04", programme: "management_1ere", notion: "Personne morale", question: "Qu'est-ce qu'une personne morale ?", reponse: "Une entite juridique distincte des personnes physiques qui la composent.", xp: 9 },
  { id: "m1-05", programme: "management_1ere", notion: "Objet social", question: "Qu'est-ce que l'objet social ?", reponse: "La finalite officielle de l'organisation inscrite juridiquement.", xp: 8 },
  { id: "m1-06", programme: "management_1ere", notion: "Finalite lucrative", question: "Qu'est-ce qu'une finalite lucrative ?", reponse: "Une finalite orientee vers la recherche de profit.", xp: 8 },
  { id: "m1-07", programme: "management_1ere", notion: "Finalite non lucrative", question: "Qu'est-ce qu'une finalite non lucrative ?", reponse: "Une finalite orientee vers l'interet general, social ou culturel, sans distribuer de profit.", xp: 8 },
  { id: "m1-08", programme: "management_1ere", notion: "Ressources humaines", question: "Que sont les ressources humaines ?", reponse: "Les personnes et leurs competences mobilisees par l'organisation.", xp: 8 },
  { id: "m1-09", programme: "management_1ere", notion: "Ressources materielles", question: "Que sont les ressources materielles ?", reponse: "Les moyens physiques: locaux, machines, vehicules, stocks, materiels.", xp: 8 },
  { id: "m1-10", programme: "management_1ere", notion: "Ressources financieres", question: "Que sont les ressources financieres ?", reponse: "Les moyens d'argent: capitaux propres, emprunts, tresorerie.", xp: 8 },
  { id: "m1-11", programme: "management_1ere", notion: "Ressources immaterielles", question: "Que sont les ressources immaterielles ?", reponse: "Les ressources non physiques: marque, brevets, image, savoir-faire, logiciel.", xp: 8 },
  { id: "m1-12", programme: "management_1ere", notion: "Coordination", question: "Pourquoi coordonner les taches ?", reponse: "Pour eviter les doublons et atteindre plus efficacement l'objectif commun.", xp: 8 },
  { id: "m1-13", programme: "management_1ere", notion: "Donnee", question: "Qu'est-ce qu'une donnee ?", reponse: "Un fait brut non encore interprete.", xp: 8 },
  { id: "m1-14", programme: "management_1ere", notion: "Information", question: "Qu'est-ce qu'une information ?", reponse: "Une donnee contextualisee et utile a la decision.", xp: 8 },
  { id: "m1-15", programme: "management_1ere", notion: "Connaissance", question: "Qu'est-ce qu'une connaissance ?", reponse: "Une information comprise et utilisee pour agir.", xp: 8 },
  { id: "m1-16", programme: "management_1ere", notion: "Systeme d'information", question: "Qu'est-ce qu'un systeme d'information ?", reponse: "L'ensemble des moyens humains et techniques qui font circuler l'information.", xp: 9 },
  { id: "m1-17", programme: "management_1ere", notion: "Veille", question: "Qu'est-ce que la veille ?", reponse: "La surveillance de l'environnement pour anticiper risques et opportunites.", xp: 8 },
  { id: "m1-18", programme: "management_1ere", notion: "KPI", question: "Qu'est-ce qu'un KPI ?", reponse: "Un indicateur de performance qui mesure l'atteinte d'un objectif.", xp: 8 },
  { id: "m1-19", programme: "management_1ere", notion: "Management", question: "Qu'est-ce que le management ?", reponse: "L'art de diriger, organiser et motiver pour atteindre des objectifs.", xp: 9 },
  { id: "m1-20", programme: "management_1ere", notion: "Leadership", question: "Qu'est-ce que le leadership ?", reponse: "La capacite a influencer et mobiliser autour d'une vision.", xp: 8 },
  { id: "m1-21", programme: "management_1ere", notion: "Innovation incrementale", question: "Qu'est-ce qu'une innovation incrementale ?", reponse: "Une amelioration progressive d'un produit ou d'un service existant.", xp: 8 },
  { id: "m1-22", programme: "management_1ere", notion: "Innovation radicale", question: "Qu'est-ce qu'une innovation radicale ?", reponse: "Une innovation qui cree une rupture importante sur le marche.", xp: 8 },
  { id: "m1-23", programme: "management_1ere", notion: "Intelligence collective", question: "Qu'est-ce que l'intelligence collective ?", reponse: "La capacite d'un groupe a mieux resoudre qu'un individu seul.", xp: 8 },
  { id: "m1-24", programme: "management_1ere", notion: "Coopetition", question: "Qu'est-ce que la coopetition ?", reponse: "Une cooperation entre concurrents sur certains sujets.", xp: 8 },
  { id: "m1-25", programme: "management_1ere", notion: "QVCT", question: "Qu'est-ce que la QVCT ?", reponse: "La qualite de vie et des conditions de travail des salaries.", xp: 8 },
  { id: "m1-26", programme: "management_1ere", notion: "Segmentation", question: "Qu'est-ce que la segmentation ?", reponse: "Le decoupage d'un marche en groupes de clients homogenes.", xp: 8 },
  { id: "m1-27", programme: "management_1ere", notion: "Mix marketing", question: "Que signifie le mix marketing 4P ?", reponse: "Produit, Prix, Place (distribution), Promotion (communication).", xp: 8 },
  { id: "m1-28", programme: "management_1ere", notion: "Etude de marche", question: "Qu'est-ce qu'une etude de marche ?", reponse: "Une analyse de la demande, des clients et des concurrents avant lancement.", xp: 8 },
  { id: "m1-29", programme: "management_1ere", notion: "GPEC", question: "Qu'est-ce que la GPEC ?", reponse: "La gestion previsionnelle des emplois et competences.", xp: 8 },
  { id: "m1-30", programme: "management_1ere", notion: "Processus de recrutement", question: "Pourquoi un processus de recrutement ?", reponse: "Pour choisir un candidat de facon objective et conforme.", xp: 8 },

  // Management terminale
  { id: "mt-01", programme: "management_terminale", notion: "Strategie", question: "Qu'est-ce qu'une strategie d'entreprise ?", reponse: "Un ensemble de choix a long terme pour atteindre des objectifs.", xp: 9 },
  { id: "mt-02", programme: "management_terminale", notion: "SWOT", question: "Que signifie SWOT ?", reponse: "Forces, Faiblesses, Opportunites, Menaces.", xp: 8 },
  { id: "mt-03", programme: "management_terminale", notion: "Croissance interne", question: "Qu'est-ce que la croissance interne ?", reponse: "Grandir avec ses propres moyens (investissements, developpement).", xp: 8 },
  { id: "mt-04", programme: "management_terminale", notion: "Croissance externe", question: "Qu'est-ce que la croissance externe ?", reponse: "Grandir par fusion, acquisition ou alliance.", xp: 8 },
  { id: "mt-05", programme: "management_terminale", notion: "Alliance strategique", question: "Qu'est-ce qu'une alliance strategique ?", reponse: "Un partenariat entre entreprises pour un objectif commun.", xp: 8 },
  { id: "mt-06", programme: "management_terminale", notion: "Chiffre d'affaires", question: "Qu'est-ce que le chiffre d'affaires (CA) ?", reponse: "Le CA est le total des ventes de biens et services sur une periode. Formule simple: CA = prix de vente unitaire x quantite vendue.", xp: 9 },
  { id: "mt-07", programme: "management_terminale", notion: "Resultat", question: "Qu'est-ce que le resultat d'entreprise ?", reponse: "Le resultat mesure la performance globale. Formule: Resultat = Produits - Charges. Positif = benefice, negatif = perte.", xp: 9 },
  { id: "mt-08", programme: "management_terminale", notion: "Rentabilite", question: "Qu'est-ce que la rentabilite ?", reponse: "La rentabilite montre si l'entreprise gagne de l'argent par rapport aux moyens engages. Exemple: Taux de rentabilite = (Resultat / Capitaux investis) x 100.", xp: 9 },
  { id: "mt-09", programme: "management_terminale", notion: "Tresorerie", question: "Qu'est-ce que la tresorerie ?", reponse: "L'argent disponible a court terme pour payer les depenses immediates.", xp: 8 },
  { id: "mt-10", programme: "management_terminale", notion: "Fonds de roulement", question: "Qu'est-ce que le fonds de roulement (FR) ?", reponse: "Le FR represente les ressources stables restantes apres financement des emplois stables. Formule simplifiee: FR = Ressources stables - Emplois stables.", xp: 9 },
  { id: "mt-11", programme: "management_terminale", notion: "BFR", question: "Qu'est-ce que le besoin en fonds de roulement (BFR) ?", reponse: "Le BFR est le besoin financier lie au cycle d'exploitation. Formule simplifiee: BFR = Stocks + Creances clients - Dettes fournisseurs.", xp: 9 },
  { id: "mt-12", programme: "management_terminale", notion: "Marge brute", question: "Qu'est-ce que la marge brute ?", reponse: "La marge brute mesure ce que l'entreprise garde apres le cout d'achat/production des ventes. Formule courante: Marge brute = CA - Cout des ventes.", xp: 9 },
  { id: "mt-13", programme: "management_terminale", notion: "Seuil de rentabilite", question: "Qu'est-ce que le seuil de rentabilite ?", reponse: "C'est le niveau de CA a partir duquel l'entreprise couvre toutes ses charges. Formule: Seuil = Charges fixes / Taux de marge sur couts variables.", xp: 9 },
  { id: "mt-14", programme: "management_terminale", notion: "RSE", question: "Qu'est-ce que la RSE ?", reponse: "La prise en compte des enjeux sociaux, environnementaux et ethiques dans les decisions de l'entreprise.", xp: 8 },
  { id: "mt-15", programme: "management_terminale", notion: "Parties prenantes", question: "Qu'est-ce qu'une partie prenante ?", reponse: "Un acteur concerne par l'activite de l'entreprise (salaries, clients, fournisseurs, Etat, etc.).", xp: 8 },
  { id: "mt-16", programme: "management_terminale", notion: "Internationalisation", question: "Qu'est-ce que l'internationalisation ?", reponse: "Le developpement des activites de l'entreprise a l'etranger.", xp: 8 },
  { id: "mt-17", programme: "management_terminale", notion: "Transformation numerique", question: "Qu'est-ce que la transformation numerique ?", reponse: "L'integration du digital dans l'organisation, les processus et le modele d'affaires.", xp: 8 },
  { id: "mt-18", programme: "management_terminale", notion: "Modele economique", question: "Qu'est-ce qu'un modele economique ?", reponse: "Le modele economique explique comment l'entreprise cree, delivre et capte de la valeur. Il precise: qui est le client, quelle offre est proposee, comment l'entreprise gagne de l'argent et quels couts elle supporte.", xp: 10 },
  { id: "mt-19", programme: "management_terminale", notion: "Gouvernance", question: "Qu'est-ce que la gouvernance d'entreprise ?", reponse: "La repartition du pouvoir et du controle dans l'entreprise (dirigeants, actionnaires, organes de controle).", xp: 8 },
  { id: "mt-20", programme: "management_terminale", notion: "Avantage concurrentiel", question: "Qu'est-ce qu'un avantage concurrentiel ?", reponse: "Un atout durable qui distingue l'entreprise de ses concurrents (cout, qualite, innovation, marque, service...).", xp: 8 },

  // Cartes formules Management
  { id: "mt-f01", programme: "management_terminale", notion: "Formule CA", question: "Quelle formule de base permet de calculer le CA ?", reponse: "CA = Prix de vente unitaire x Quantite vendue.", xp: 10 },
  { id: "mt-f02", programme: "management_terminale", notion: "Formule resultat", question: "Quelle formule permet de calculer le resultat ?", reponse: "Resultat = Produits - Charges.", xp: 10 },
  { id: "mt-f03", programme: "management_terminale", notion: "Formule marge brute", question: "Quelle formule simple pour la marge brute ?", reponse: "Marge brute = CA - Cout des ventes (ou cout d'achat des marchandises vendues).", xp: 10 },
  { id: "mt-f04", programme: "management_terminale", notion: "Formule taux de marge", question: "Quelle formule du taux de marge ?", reponse: "Taux de marge = (Marge commerciale / Cout d'achat) x 100.", xp: 10 },
  { id: "mt-f05", programme: "management_terminale", notion: "Formule taux de marque", question: "Quelle formule du taux de marque ?", reponse: "Taux de marque = (Marge commerciale / Prix de vente HT) x 100.", xp: 10 },
  { id: "mt-f06", programme: "management_terminale", notion: "Formule BFR", question: "Quelle formule simplifiee du BFR ?", reponse: "BFR = Stocks + Creances clients - Dettes fournisseurs.", xp: 10 },
  { id: "mt-f07", programme: "management_terminale", notion: "Formule FR", question: "Quelle formule simplifiee du FR ?", reponse: "FR = Ressources stables - Emplois stables.", xp: 10 },
  { id: "mt-f08", programme: "management_terminale", notion: "Formule tresorerie nette", question: "Quelle formule de la tresorerie nette ?", reponse: "Tresorerie nette = FR - BFR.", xp: 10 },

  // SDGN
  { id: "sdgn-01", programme: "sdgn", notion: "SI", question: "Qu'est-ce que le SI ?", reponse: "L'ensemble des ressources qui permettent de collecter, traiter, stocker et diffuser l'information.", xp: 8 },
  { id: "sdgn-02", programme: "sdgn", notion: "Flux d'information", question: "Qu'est-ce qu'un flux d'information ?", reponse: "La circulation d'informations entre acteurs, services ou applications.", xp: 8 },
  { id: "sdgn-03", programme: "sdgn", notion: "ERP", question: "Qu'est-ce qu'un ERP ?", reponse: "Un logiciel integre qui relie plusieurs fonctions de l'entreprise dans une base commune.", xp: 8 },
  { id: "sdgn-04", programme: "sdgn", notion: "CRM", question: "Qu'est-ce qu'un CRM ?", reponse: "Un outil qui centralise les donnees clients pour mieux gerer la relation commerciale.", xp: 8 },
  { id: "sdgn-05", programme: "sdgn", notion: "Tableau de bord", question: "Qu'est-ce qu'un tableau de bord ?", reponse: "Un outil qui suit des indicateurs pour piloter l'activite et aider a la decision.", xp: 8 },
  { id: "sdgn-06", programme: "sdgn", notion: "Big data", question: "Qu'est-ce que le big data ?", reponse: "Des donnees tres nombreuses, rapides et variees, exploitees a grande echelle.", xp: 8 },
  { id: "sdgn-07", programme: "sdgn", notion: "Open data", question: "Qu'est-ce que l'open data ?", reponse: "Des donnees publiques accessibles et reutilisables par tous.", xp: 8 },
  { id: "sdgn-08", programme: "sdgn", notion: "Data visualisation", question: "Qu'est-ce que la data visualisation ?", reponse: "La representation graphique des donnees pour mieux comprendre et decider.", xp: 8 },
  { id: "sdgn-09", programme: "sdgn", notion: "Donnee personnelle", question: "Qu'est-ce qu'une donnee personnelle ?", reponse: "Une information qui identifie une personne directement ou indirectement.", xp: 8 },
  { id: "sdgn-10", programme: "sdgn", notion: "RGPD", question: "Qu'est-ce que le RGPD ?", reponse: "Le reglement europeen qui protege les donnees personnelles.", xp: 8 },
  { id: "sdgn-11", programme: "sdgn", notion: "Finalite", question: "Qu'est-ce que la finalite d'un traitement de donnees ?", reponse: "Le but precis pour lequel les donnees sont collectees.", xp: 8 },
  { id: "sdgn-12", programme: "sdgn", notion: "Minimisation", question: "Que signifie le principe de minimisation ?", reponse: "Collecter seulement les donnees necessaires au but annonce.", xp: 8 },
  { id: "sdgn-13", programme: "sdgn", notion: "Consentement", question: "Qu'est-ce qu'un consentement valable ?", reponse: "Un accord libre, eclaire, specifique et clair.", xp: 8 },
  { id: "sdgn-14", programme: "sdgn", notion: "Droit d'acces", question: "Que permet le droit d'acces RGPD ?", reponse: "Voir les donnees detenues sur soi et connaitre leur usage.", xp: 8 },
  { id: "sdgn-15", programme: "sdgn", notion: "Droit de rectification", question: "Que permet le droit de rectification ?", reponse: "Corriger des donnees inexactes ou incompletes.", xp: 8 },
  { id: "sdgn-16", programme: "sdgn", notion: "Droit a l'effacement", question: "Que permet le droit a l'effacement ?", reponse: "Demander la suppression de ses donnees dans certains cas prevus par la loi.", xp: 8 },
  { id: "sdgn-17", programme: "sdgn", notion: "DPO", question: "Qu'est-ce qu'un DPO ?", reponse: "Le responsable de la protection des donnees dans l'organisation.", xp: 8 },
  { id: "sdgn-18", programme: "sdgn", notion: "Violation de donnees", question: "Qu'est-ce qu'une violation de donnees ?", reponse: "Une fuite, perte ou acces non autorise a des donnees personnelles.", xp: 8 },
  { id: "sdgn-19", programme: "sdgn", notion: "CIA", question: "Que signifie la triade CIA ?", reponse: "Confidentialite, Integrite, Disponibilite.", xp: 8 },
  { id: "sdgn-20", programme: "sdgn", notion: "Phishing", question: "Qu'est-ce que le phishing ?", reponse: "Une arnaque qui imite un tiers de confiance pour voler des informations.", xp: 8 },
  { id: "sdgn-21", programme: "sdgn", notion: "Mot de passe robuste", question: "Qu'est-ce qu'un mot de passe robuste ?", reponse: "Un mot de passe long, unique et complexe.", xp: 8 },
  { id: "sdgn-22", programme: "sdgn", notion: "MFA", question: "Qu'est-ce que l'authentification multifacteur (MFA) ?", reponse: "Une connexion qui demande au moins deux preuves d'identite.", xp: 8 },
  { id: "sdgn-23", programme: "sdgn", notion: "Cloud", question: "Qu'est-ce que le cloud computing ?", reponse: "L'usage de services informatiques a distance via Internet.", xp: 8 },
  { id: "sdgn-24", programme: "sdgn", notion: "API", question: "Qu'est-ce qu'une API ?", reponse: "Une interface qui permet a deux applications de communiquer.", xp: 8 },
  { id: "sdgn-25", programme: "sdgn", notion: "Interoperabilite", question: "Qu'est-ce que l'interoperabilite ?", reponse: "La capacite de systemes differents a echanger et utiliser des donnees.", xp: 8 },
  { id: "sdgn-26", programme: "sdgn", notion: "Tracabilite", question: "Qu'est-ce que la tracabilite des donnees ?", reponse: "La possibilite de suivre l'historique d'une information ou d'une action.", xp: 8 },
  { id: "sdgn-27", programme: "sdgn", notion: "Blockchain", question: "Qu'est-ce que la blockchain ?", reponse: "Un registre distribue qui enregistre des transactions de facon securisee et verifiable.", xp: 8 },
  { id: "sdgn-28", programme: "sdgn", notion: "Decision structuree", question: "Qu'est-ce qu'une decision structuree ?", reponse: "Une decision repetee, basee sur des regles claires.", xp: 8 },
  { id: "sdgn-29", programme: "sdgn", notion: "Decision semi-structuree", question: "Qu'est-ce qu'une decision semi-structuree ?", reponse: "Une decision partiellement reglee qui demande aussi du jugement humain.", xp: 8 },
  { id: "sdgn-30", programme: "sdgn", notion: "BYOD", question: "Qu'est-ce que le BYOD ?", reponse: "L'usage d'un appareil personnel pour travailler.", xp: 8 },
];

export const FLASHCARD_PROGRAMME_LABELS: Record<FlashcardProgramme, string> = {
  management_1ere: "Management (1re)",
  management_terminale: "Management (Terminale)",
  sdgn: "SDGN",
};

export function getFlashcardsByProgramme(p: FlashcardProgramme | "tous"): FlashcardItem[] {
  if (p === "tous") return [...FLASHCARDS];
  return FLASHCARDS.filter((c) => c.programme === p);
}
