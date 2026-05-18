import { useState, useEffect, useMemo, type CSSProperties } from "react";
import { auth, db } from "../services/firebase";
import {
  buildMissionsAIPrompt,
  buildReliableMissionsEvaluation,
  callGeminiCorrection,
  callGroqCorrection,
  localCorrectionMissions,
} from "../services/correctionIA";
import type { ExerciseSupportTable } from "../services/correctionIA";
import { collection, doc, getDoc, getDocs, orderBy, query, updateDoc, where } from "firebase/firestore";
import ProtectedTextarea from "../components/ProtectedTextarea";
import { formatJetons, formatJetonsDelta } from "../lib/jetons";
import { PLATFORM_XP_BLOCKED_MESSAGE, usePlatformIntegrity } from "../contexts/PlatformIntegrityContext";

/** Même clé `matiere` que dans Firestore / import Admin ; libellé court à l'écran. */
const MATIERES_MISSIONS = [
  { matiere: "Management", label: "Management" },
  { matiere: "Économie", label: "Économie" },
  { matiere: "Droit", label: "Droit" },
  { matiere: "Sciences de Gestion", label: "SDGN" },
] as const;

type ChapitreRow = {
  id: string;
  ordre?: number;
  titre?: string;
  theme?: string;
  matiere?: string;
  classe?: string;
  notions?: string[];
  competences?: string[];
  question?: string;
};

type ProfilLite = {
  classe?: string;
  role?: string;
};

type MissionsProps = {
  profil: ProfilLite;
  onXPGagne?: () => void;
};

type MissionExercise = {
  id: string;
  title: string;
  type: "Exercice" | "Etude de cas";
  difficulty: "Facile" | "Moyen" | "Difficile" | "Tres difficile";
  xp: number;
  consigne: string;
  attendu: string;
  minChars: number;
  support?: string;
  /** Tableaux mis en forme (compte de résultat, bilan…) — affichés sous le texte du support. */
  supportTables?: ExerciseSupportTable[];
  questions?: string[];
  correctionModele?: string;
};

function MissionSupportTables({ tables }: { tables: ExerciseSupportTable[] }) {
  const cell: CSSProperties = {
    border: "1px solid #fbbf24",
    padding: "8px 10px",
    verticalAlign: "top",
    fontSize: "0.88rem",
    lineHeight: 1.45,
    color: "#1e293b",
  };
  const th: CSSProperties = {
    ...cell,
    background: "linear-gradient(180deg, #fef3c7 0%, #fde68a 100%)",
    fontWeight: 800,
    color: "#92400e",
    whiteSpace: "nowrap",
  };
  return (
    <div style={{ marginTop: 10, overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
      {tables.map((tbl, ti) => (
        <div key={ti} style={{ marginBottom: ti < tables.length - 1 ? 14 : 0 }}>
          {tbl.title ? (
            <p style={{ margin: "0 0 6px", fontWeight: 800, fontSize: "0.84rem", color: "#78350f", letterSpacing: "0.02em" }}>
              {tbl.title}
            </p>
          ) : null}
          <table
            style={{
              width: "100%",
              minWidth: 260,
              borderCollapse: "collapse",
              background: "#fffbeb",
              borderRadius: 8,
              overflow: "hidden",
              boxShadow: "inset 0 0 0 1px rgba(217,119,6,0.22)",
            }}
          >
            <thead>
              <tr>
                {tbl.columns.map((c, ci) => (
                  <th key={ci} style={th}>
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tbl.rows.map((row, ri) => (
                <tr key={ri} style={{ background: ri % 2 === 0 ? "#fffbeb" : "#fef9c3" }}>
                  {row.map((cellText, ci) => (
                    <td key={ci} style={{ ...cell, fontWeight: tbl.columns.length > 1 && ci === 0 ? 650 : 500 }}>
                      {cellText}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

type MissionEvalResult = {
  score: number;
  pourcentageXP: number;
  xpAccordee: number;
  feedback: string;
  analyseDeveloppee: string;
  pointsForts: string;
  pointsFaibles: string;
  conseilsProgression: string;
  propositionReponse: string;
  source: "ai" | "local";
  entrainementSansXp: boolean;
};

const MISSIONS_PROGRESS_VERSION = 1;

const SDGN_CHAP7_EXERCISES: MissionExercise[] = [
  {
    id: "sdgn7-e1",
    title: "Visioconférence et travail collaboratif",
    type: "Exercice",
    difficulty: "Facile",
    xp: 120,
    minChars: 120,
    support:
      "Chez Renault, les équipes de conception travaillent en simultané depuis Boulogne-Billancourt, Barcelone et Séoul. Depuis 2022, Renault a déployé Microsoft Teams pour l'ensemble de ses 40 000 salariés. Les ingénieurs peuvent partager des maquettes 3D en temps réel, annoter des plans et prendre des décisions sans attendre les réunions physiques mensuelles. La direction estime que le temps de validation d'un prototype a été réduit de 30 %.",
    consigne: "Réponds aux questions dans l'ordre en t'appuyant sur le support.",
    questions: [
      "Rappelle la fonctionnalité de la visioconférence dans le travail professionnel.",
      "Identifie l'intérêt des technologies numériques dans le cadre du travail collaboratif, en t'appuyant sur l'exemple Renault.",
    ],
    correctionModele:
      "1) Fonctionnalité de la visioconférence :\n" +
      "La visioconférence permet à des collaborateurs situés dans des lieux différents de se voir, se parler et travailler ensemble en temps réel. " +
      "Elle sert à organiser des réunions à distance, à partager des informations (documents, plans, maquettes) et à maintenir la coordination entre sites sans déplacement physique.\n\n" +
      "2) Intérêt des technologies numériques pour le travail collaboratif :\n" +
      "Chez Renault, Microsoft Teams permet à des équipes réparties sur trois continents de travailler simultanément sur les mêmes projets. " +
      "Les outils numériques font gagner du temps (validation des prototypes réduite de 30 %), améliorent la réactivité des équipes et permettent de coopérer malgré la distance géographique. " +
      "Ils réduisent aussi les coûts liés aux déplacements professionnels.",
    attendu: "Réponses claires, vocabulaire du chapitre, appui sur le support.",
  },
  {
    id: "sdgn7-e2",
    title: "Familles d'outils collaboratifs",
    type: "Exercice",
    difficulty: "Facile",
    xp: 130,
    minChars: 140,
    support:
      "De nombreuses entreprises ont adopté des suites d'outils numériques pour structurer leur travail quotidien. Slack et Microsoft Teams couvrent la messagerie instantanée et la visioconférence. Trello et Notion permettent de planifier les projets et de suivre les tâches. Google Drive et Dropbox assurent le stockage et le partage de fichiers dans le cloud. Google Docs, Microsoft 365 et Notion permettent de créer et co-rédiger des documents à plusieurs en simultané.",
    consigne: "Pour chaque famille d'outils collaboratifs, donne au moins un exemple tiré du support et explique en une phrase ce que cet outil permet de faire.",
    questions: [
      "Famille « communication » (messagerie, visioconférence) :",
      "Famille « organisation » (gestion de projet, agenda) :",
      "Famille « stockage » (cloud, serveur) :",
      "Famille « création » (suite bureautique en ligne, co-rédaction) :",
    ],
    correctionModele:
      "Famille « communication » :\n" +
      "Slack ou Microsoft Teams — ces outils permettent d'envoyer des messages instantanés, d'organiser des visioconférences et de partager des fichiers entre collaborateurs, même à distance.\n\n" +
      "Famille « organisation » :\n" +
      "Trello ou Notion — ces outils permettent de planifier les tâches d'un projet, d'attribuer des responsabilités et de suivre l'avancement en temps réel grâce à des tableaux partagés.\n\n" +
      "Famille « stockage » :\n" +
      "Google Drive ou Dropbox — ces solutions de stockage dans le cloud permettent de conserver des fichiers en ligne, d'y accéder depuis n'importe quel appareil et de les partager avec des collaborateurs autorisés.\n\n" +
      "Famille « création » :\n" +
      "Google Docs ou Microsoft 365 — ces suites bureautiques en ligne permettent à plusieurs personnes de rédiger, modifier et commenter un même document simultanément, sans s'envoyer de versions par e-mail.",
    attendu: "Exemples variés tirés du support et justification courte et précise par famille.",
  },
  {
    id: "sdgn7-e3",
    title: "Comprendre le travail collaboratif",
    type: "Exercice",
    difficulty: "Facile",
    xp: 140,
    minChars: 150,
    support:
      "« Chez Airbus, la conception de l'A320neo a mobilisé simultanément des équipes en France, en Allemagne, en Espagne et au Royaume-Uni. Grâce aux outils numériques collaboratifs, chaque équipe a travaillé sur une partie du projet tout en restant synchronisée avec les autres. Les méthodes de travail ont profondément évolué : la réunion physique hebdomadaire a cédé la place à des espaces de travail partagés accessibles 24h/24. L'objectif est de mutualiser les compétences pour obtenir un résultat commun plus rapidement. »",
    consigne: "Appuie-toi sur l'extrait et sur ton cours pour répondre aux deux questions.",
    questions: [
      "Explique avec tes propres mots comment les méthodes de travail ont évolué chez Airbus d'après le texte.",
      "Liste au moins trois avantages concrets de la mise en place d'outils collaboratifs numériques pour une organisation comme Airbus.",
    ],
    correctionModele:
      "1) Évolution des méthodes de travail :\n" +
      "D'après le texte, Airbus a remplacé les réunions physiques hebdomadaires par des espaces de travail partagés accessibles en permanence. " +
      "Les équipes, réparties dans quatre pays, ne doivent plus attendre de se retrouver au même endroit pour avancer : chacun travaille sur sa partie en restant connecté aux autres en temps réel. " +
      "Le travail collaboratif a donc remplacé le travail séquentiel traditionnel.\n\n" +
      "2) Avantages des outils collaboratifs numériques :\n" +
      "— Réduction des délais : les équipes travaillent simultanément, ce qui accélère la livraison du projet.\n" +
      "— Mutualisation des compétences : chaque équipe apporte son expertise, quelle que soit sa localisation.\n" +
      "— Disponibilité permanente : les espaces partagés sont accessibles 24h/24, sans contrainte géographique.\n" +
      "— Réduction des coûts de déplacement : moins de voyages inter-sites nécessaires.\n" +
      "— Meilleure coordination : tous les collaborateurs disposent de la même version des documents en temps réel.",
    attendu: "Compréhension du texte et argumentation structurée sur les avantages.",
  },
  {
    id: "sdgn7-e4",
    title: "E-communication et réseaux sociaux",
    type: "Exercice",
    difficulty: "Moyen",
    xp: 180,
    minChars: 180,
    support:
      "Air France utilise LinkedIn pour diffuser ses offres d'emploi et valoriser sa marque employeur auprès de 2 millions d'abonnés. Sur Instagram, la compagnie publie des contenus visuels destinés au grand public pour renforcer son image de marque. En interne, les équipes RH et communication échangent sur Microsoft Teams. Lors du recrutement, les candidats sont parfois évalués sur leur présence en ligne — un profil LinkedIn soigné est considéré comme un atout professionnel.",
    consigne: "Réponds de façon structurée en t'appuyant sur le support (un paragraphe par question).",
    questions: [
      "Explique en quoi les réseaux sociaux utilisés par Air France sont des outils d'e-communication.",
      "Distingue les réseaux sociaux personnels des réseaux sociaux professionnels : donne les caractéristiques de chacun et des exemples tirés du support ou du cours.",
      "Explique en quoi les réseaux sociaux sont aussi des outils de partage de l'information pour l'organisation.",
    ],
    correctionModele:
      "1) Les réseaux sociaux comme outils d'e-communication :\n" +
      "L'e-communication regroupe toutes les actions de communication menées sur Internet. Air France utilise LinkedIn et Instagram pour communiquer avec des publics ciblés (candidats, grand public). " +
      "Ces plateformes permettent de diffuser des messages, des images et des offres à grande échelle, de manière interactive : les abonnés peuvent réagir, partager ou commenter.\n\n" +
      "2) Réseaux sociaux personnels vs professionnels :\n" +
      "Les réseaux sociaux personnels (ex. : Instagram, Snapchat, TikTok) sont destinés à la vie privée et aux relations amicales ; le contenu y est généralement informel. " +
      "Les réseaux sociaux professionnels (ex. : LinkedIn) sont orientés vers le monde du travail : ils servent à présenter son parcours, à publier des offres d'emploi et à développer son réseau professionnel. " +
      "Air France utilise LinkedIn à des fins professionnelles (recrutement, marque employeur) et Instagram pour une communication plus grand public.\n\n" +
      "3) Les réseaux sociaux comme outils de partage de l'information :\n" +
      "Air France diffuse ses offres d'emploi sur LinkedIn, informant ainsi des milliers de candidats potentiels en un seul post. " +
      "En interne, Teams permet de partager des informations entre les équipes RH et communication. " +
      "Les réseaux sociaux accélèrent la circulation de l'information et permettent à l'organisation de toucher ses différentes parties prenantes.",
    attendu: "Distinction nette perso/pro, lien avec l'e-communication et le partage d'information.",
  },
  {
    id: "sdgn7-e5",
    title: "Communautés en ligne",
    type: "Exercice",
    difficulty: "Moyen",
    xp: 190,
    minChars: 160,
    support:
      "Salesforce, éditeur américain de logiciels, anime une communauté en ligne appelée « Trailblazer Community » qui rassemble plus de 17 millions de membres (développeurs, administrateurs, clients, partenaires). Les membres posent des questions, partagent des tutoriels et s'entraident pour résoudre des problèmes techniques. Les contributions les plus utiles sont mises en avant par un système de votes. Salesforce utilise les échanges de la communauté pour identifier les besoins des utilisateurs et améliorer ses produits.",
    consigne: "Réponds aux trois questions en t'appuyant sur le support et sur ton cours.",
    questions: [
      "Qu'est-ce qu'une communauté en ligne ? Donne la définition du cours, puis illustre-la avec l'exemple de Salesforce.",
      "Montre, à partir du support, comment les échanges au sein de la communauté produisent de l'information utile pour l'organisation.",
      "Explique en quoi une communauté en ligne peut être un avantage concurrentiel pour une entreprise comme Salesforce.",
    ],
    correctionModele:
      "1) Définition et illustration :\n" +
      "Une communauté en ligne rassemble des personnes autour d'un thème ou d'un projet commun ; les échanges y sont publics ou semi-publics. " +
      "La Trailblazer Community de Salesforce illustre cette définition : 17 millions de membres issus de profils variés (développeurs, clients, partenaires) se retrouvent sur une plateforme commune pour partager connaissances et solutions.\n\n" +
      "2) Production d'information utile :\n" +
      "Les membres posent des questions et partagent des tutoriels : chaque échange crée une base de connaissances accessible à tous. " +
      "Le système de votes met en avant les contributions les plus pertinentes, améliorant la qualité de l'information disponible. " +
      "Salesforce récupère ces données pour identifier les besoins réels de ses utilisateurs et orienter le développement de ses produits.\n\n" +
      "3) Avantage concurrentiel :\n" +
      "La communauté réduit les coûts de support client : les membres s'entraident, ce qui diminue le nombre de demandes adressées au service technique. " +
      "Elle fidélise les utilisateurs en créant un sentiment d'appartenance. " +
      "Enfin, elle constitue une source d'intelligence collective : les remontées terrain permettent à Salesforce d'innover plus rapidement que ses concurrents.",
    attendu: "Définition + lien communauté/information + argumentation sur la performance.",
  },
  {
    id: "sdgn7-e6",
    title: "Réseau informatique de l'organisation",
    type: "Exercice",
    difficulty: "Moyen",
    xp: 210,
    minChars: 180,
    support:
      "La chaîne hôtelière B&B Hotels gère 700 établissements en Europe. Chaque hôtel est connecté au réseau interne du groupe via un VPN sécurisé. Le service RH peut consulter les plannings de tous les hôtels, tandis que chaque directeur d'établissement n'accède qu'à son propre site. Un administrateur réseau basé au siège gère les droits d'accès et surveille les connexions suspectes. En 2023, une tentative d'intrusion a été bloquée en moins de 20 minutes grâce aux alertes automatiques.",
    consigne: "Réponds en t'appuyant sur le document.",
    questions: [
      "Identifie dans le texte ce qui correspond au support de stockage et de partage de l'information au sein du réseau de B&B Hotels (cite ou reformule précisément).",
      "Présente les avantages et les risques de la mise en place d'un réseau informatique pour B&B Hotels (deux parties clairement titrées, au moins deux éléments par partie).",
    ],
    correctionModele:
      "1) Support de stockage et de partage de l'information :\n" +
      "Dans le texte, le réseau interne du groupe connecté via un VPN sécurisé constitue le support de stockage et d'échange de données. " +
      "C'est ce réseau qui permet au service RH de consulter les plannings de tous les établissements depuis un point centralisé.\n\n" +
      "2) Avantages et risques :\n" +
      "AVANTAGES :\n" +
      "— Centralisation de l'information : le siège peut accéder aux données de 700 hôtels depuis un point unique.\n" +
      "— Gain de temps et de coordination : les plannings sont consultables en temps réel sans échanges de fichiers manuels.\n" +
      "— Sécurité renforcée : le VPN et les alertes automatiques permettent de détecter rapidement les intrusions (blocage en 20 minutes).\n\n" +
      "RISQUES :\n" +
      "— Risque de cyberattaque : une tentative d'intrusion a eu lieu en 2023, ce qui montre la vulnérabilité du réseau face à des attaquants externes.\n" +
      "— Dépendance au réseau : une panne ou une interruption peut bloquer l'accès aux données pour tous les établissements simultanément.\n" +
      "— Fuite de données sensibles si les droits d'accès sont mal configurés.",
    attendu: "Repérage dans le texte + avantages et risques clairement distingués et argumentés.",
  },
  {
    id: "sdgn7-e7",
    title: "Sécurisation, administrateur réseau et droits d'accès",
    type: "Exercice",
    difficulty: "Moyen",
    xp: 230,
    minChars: 200,
    support:
      "Le groupe pharmaceutique Sanofi emploie 100 000 personnes dans 60 pays. Son système d'information contient des données de recherche confidentielles, des informations RH et des données financières. Chaque salarié dispose d'un profil d'accès défini selon son métier : un chercheur accède aux bases de données scientifiques mais pas aux données de paie ; un responsable RH voit les dossiers du personnel mais pas les formules chimiques des médicaments. Un service dédié d'administrateurs réseau surveille en permanence les accès, détecte les comportements anormaux et met à jour les droits en cas de changement de poste.",
    consigne: "Réponds en trois développements structurés en t'appuyant sur le support.",
    questions: [
      "Précise le rôle du réseau informatique dans une organisation comme Sanofi.",
      "Identifie la fonction de l'administrateur réseau d'après le support et complète avec les éléments du cours.",
      "Explique pourquoi les droits d'accès au réseau sont restreints et différenciés selon les profils chez Sanofi.",
    ],
    correctionModele:
      "1) Rôle du réseau informatique :\n" +
      "Le réseau informatique de Sanofi relie l'ensemble des postes de travail des 100 000 salariés présents dans 60 pays. " +
      "Il permet de stocker, partager et accéder aux données de l'organisation (recherche, RH, finance), de communiquer à distance et de coordonner les activités entre sites.\n\n" +
      "2) Fonction de l'administrateur réseau :\n" +
      "D'après le support, l'administrateur réseau surveille les accès en permanence, détecte les comportements anormaux et met à jour les droits d'accès lors des changements de poste. " +
      "Plus généralement, son rôle est de garantir la disponibilité, l'intégrité et la sécurité du système d'information : il installe les équipements, gère les comptes utilisateurs et réagit en cas d'incident.\n\n" +
      "3) Pourquoi les droits sont restreints et différenciés :\n" +
      "Les données de Sanofi sont très sensibles (formules de médicaments, données personnelles, informations financières). " +
      "Si chaque salarié avait accès à tout, le risque de fuite, de modification non autorisée ou d'espionnage industriel serait élevé. " +
      "Les droits différenciés appliquent le principe du moindre privilège : chacun n'accède qu'aux informations nécessaires à son travail, ce qui réduit les risques internes et externes.",
    attendu: "Rôles et enjeux de sécurité bien articulés, appui sur le support.",
  },
  {
    id: "sdgn7-e8",
    title: "Internet, intranet et extranet",
    type: "Exercice",
    difficulty: "Difficile",
    xp: 260,
    minChars: 200,
    support:
      "Le groupe Carrefour opère sur trois niveaux de réseau. Son site carrefour.fr est accessible à tous les internautes dans le monde : c'est la vitrine publique du groupe. Le réseau interne du groupe, accessible uniquement depuis les postes des salariés, permet de consulter les procédures internes, les résultats de ventes et les plannings. Un espace sécurisé supplémentaire est réservé aux fournisseurs référencés : ils peuvent y consulter les commandes passées, les conditions logistiques et les factures validées, mais ne voient pas les données internes au groupe.",
    consigne: "Réponds aux deux questions en t'appuyant sur le support et sur les notions du cours.",
    questions: [
      "Identifie les trois types de réseaux présents dans le texte. Pour chacun, précise son nom technique (internet, intranet ou extranet), qui y a accès et quel est son rôle chez Carrefour.",
      "Compare les trois réseaux en expliquant ce qui les distingue fondamentalement : public cible, niveau de confidentialité et exemples d'usages.",
    ],
    correctionModele:
      "1) Identification des trois réseaux chez Carrefour :\n" +
      "— Internet : carrefour.fr, accessible à tous les internautes. Rôle : vitrine publique, communication avec les clients.\n" +
      "— Intranet : réseau interne accessible uniquement aux salariés depuis les postes de travail. Rôle : partage des procédures, résultats de ventes, plannings — informations strictement internes.\n" +
      "— Extranet : espace sécurisé réservé aux fournisseurs référencés. Rôle : partager des informations commerciales et logistiques avec des partenaires extérieurs autorisés, sans leur donner accès aux données internes du groupe.\n\n" +
      "2) Comparaison des trois réseaux :\n" +
      "PUBLIC CIBLE : Internet s'adresse à tout le monde (clients, grand public) ; l'intranet est exclusivement réservé aux salariés ; l'extranet est ouvert à des partenaires extérieurs sélectionnés.\n" +
      "NIVEAU DE CONFIDENTIALITÉ : Internet = données publiques ; intranet = données confidentielles internes ; extranet = données partagées de façon contrôlée avec des tiers de confiance.\n" +
      "EXEMPLES D'USAGES : Internet = site e-commerce, communication de marque ; intranet = consultation des procédures RH, partage de résultats ; extranet = transmission de commandes aux fournisseurs, suivi logistique.",
    attendu: "Distinction précise des trois réseaux, exemples cohérents, comparaison structurée.",
  },
  {
    id: "sdgn7-e9",
    title: "Le réseau social interne",
    type: "Exercice",
    difficulty: "Difficile",
    xp: 280,
    minChars: 220,
    support:
      "AXA, groupe d'assurance présent dans 51 pays, a déployé Viva Engage (anciennement Yammer) pour 150 000 collaborateurs. Cet outil de réseau social interne permet à chaque salarié de publier des actualités, de rejoindre des groupes thématiques (innovation, bien-être, métiers spécifiques) et d'interagir directement avec des collègues de n'importe quel pays, sans passer par la hiérarchie. Le groupe estime que cet outil a renforcé le sentiment d'appartenance et facilité le partage de bonnes pratiques entre filiales. L'accès est strictement réservé aux salariés disposant d'une adresse e-mail professionnelle AXA.",
    consigne: "Réponds aux trois questions en t'appuyant sur le support.",
    questions: [
      "Qu'est-ce qu'un réseau social interne ? Donne la définition, puis identifie dans le texte les éléments qui correspondent à cette définition.",
      "Montre, à partir du support, en quoi le réseau social interne d'AXA améliore la communication au sein de l'organisation.",
      "Explique pourquoi l'accès à cet outil est réservé aux seuls salariés AXA et quels risques cela évite.",
    ],
    correctionModele:
      "1) Définition et identification dans le texte :\n" +
      "Un réseau social interne est une plateforme numérique de communication réservée aux salariés d'une organisation, fonctionnant sur le modèle des réseaux sociaux grand public mais dans un cadre professionnel fermé. " +
      "Dans le texte : Viva Engage correspond à cette définition — il permet de publier des actualités, rejoindre des groupes et interagir avec des collègues, mais l'accès est limité aux salariés AXA.\n\n" +
      "2) Amélioration de la communication :\n" +
      "— Transversalité : les salariés de 51 pays peuvent communiquer directement sans passer par la hiérarchie, ce qui accélère les échanges.\n" +
      "— Partage de bonnes pratiques : les groupes thématiques permettent aux filiales de partager leurs expériences et d'éviter de « réinventer la roue ».\n" +
      "— Sentiment d'appartenance : le fait de pouvoir interagir avec des collègues du monde entier renforce la cohésion du groupe malgré la dispersion géographique.\n\n" +
      "3) Pourquoi l'accès est réservé aux salariés :\n" +
      "Un réseau social interne contient des informations sensibles sur l'organisation (projets en cours, résultats, pratiques internes). " +
      "Ouvrir l'accès à des personnes extérieures (concurrents, clients, anciens salariés) risquerait de provoquer des fuites d'informations confidentielles. " +
      "Restreindre l'accès aux adresses e-mail professionnelles garantit que seules les personnes habilitées participent aux échanges.",
    attendu: "Définition précise, lien avec la performance, argumentation sur la sécurité et la confidentialité.",
  },
  {
    id: "sdgn7-e10",
    title: "Intelligence collective et intelligence artificielle",
    type: "Exercice",
    difficulty: "Tres difficile",
    xp: 360,
    minChars: 280,
    support:
      "Dans le cadre de son programme d'innovation ouverte, le groupe SNCF a mis en place une plateforme collaborative permettant à ses 150 000 salariés de soumettre des idées d'amélioration. En 2023, plus de 12 000 suggestions ont été déposées ; les équipes ont retenu et testé 340 d'entre elles. En parallèle, la SNCF utilise des algorithmes d'intelligence artificielle pour analyser les données de trafic en temps réel, prédire les retards et optimiser les rotations de matériel roulant. Une enquête interne révèle que 78 % des salariés estiment que les outils numériques proposés par leur employeur influencent leur satisfaction au travail. La direction considère que l'IA et la contribution collective ne s'opposent pas : l'IA traite les données massives, tandis que les salariés apportent leur expertise terrain.",
    consigne:
      "Réponds aux quatre questions dans l'ordre, en citant des éléments précis du support.",
    questions: [
      "Explique ce qu'est l'intelligence collective et montre, en t'appuyant sur le support, comment la SNCF la met en œuvre.",
      "Précise le rôle de l'intelligence artificielle chez la SNCF en donnant deux exemples concrets tirés du texte.",
      "Cite la phrase du support qui illustre le lien entre outils numériques et satisfaction des salariés, puis explique ce qu'elle signifie.",
      "Explique pourquoi l'intelligence artificielle et l'intelligence collective sont présentées comme complémentaires dans le support. Donne ton point de vue argumenté.",
    ],
    correctionModele:
      "1) Intelligence collective à la SNCF :\n" +
      "L'intelligence collective naît des interactions entre individus qui mettent en commun leurs idées et compétences pour produire un résultat supérieur à ce que chacun aurait obtenu seul. " +
      "La SNCF la met en œuvre via sa plateforme collaborative : 12 000 idées soumises par 150 000 salariés, dont 340 testées. " +
      "Chaque salarié contribue avec son expérience terrain, créant une base d'innovations que la direction seule n'aurait pas pu générer.\n\n" +
      "2) Rôle de l'intelligence artificielle :\n" +
      "L'IA à la SNCF est utilisée pour analyser les données de trafic en temps réel et prédire les retards, ainsi que pour optimiser les rotations du matériel roulant. " +
      "Ces tâches impliquent le traitement de volumes massifs de données impossibles à analyser manuellement — l'IA y apporte rapidité et précision.\n\n" +
      "3) Outils numériques et satisfaction :\n" +
      "Phrase citée : « 78 % des salariés estiment que les outils numériques proposés par leur employeur influencent leur satisfaction au travail. » " +
      "Cette phrase signifie que la qualité des outils mis à disposition par l'employeur est un facteur de bien-être professionnel : de bons outils rendent le travail plus efficace, moins frustrant et plus valorisant.\n\n" +
      "4) IA et intelligence collective — complémentarité :\n" +
      "Dans le support, la SNCF considère que les deux ne s'opposent pas : l'IA traite les données massives (tâche quantitative) tandis que les salariés apportent leur expertise terrain (tâche qualitative et créative). " +
      "L'IA libère les salariés des tâches répétitives, ce qui leur laisse davantage de temps pour contribuer à l'intelligence collective. " +
      "On peut argumenter que cette complémentarité est bénéfique, à condition que l'IA reste un outil au service des humains et non un substitut à leur jugement.",
    attendu: "Synthèse maîtrisée du support, définitions précises, point de vue argumenté.",
  },
  {
    id: "sdgn7-cas1",
    title: "Étude de cas : Decathlon",
    type: "Etude de cas",
    difficulty: "Tres difficile",
    xp: 560,
    minChars: 580,
    support:
      "Decathlon, enseigne mondiale de sport présente dans 60 pays, a déployé un écosystème numérique complet pour coordonner ses 100 000 collaborateurs. Les équipes utilisent Microsoft Teams pour les réunions à distance et la messagerie instantanée, Trello pour le suivi des projets de lancement produit, et SharePoint pour le stockage et le partage des documents entre les magasins, la logistique et le siège. Chaque collaborateur dispose d'un profil d'accès défini par son métier : un responsable de rayon accède aux données de ventes de son magasin, mais pas aux bilans financiers consolidés du groupe — ces informations sont réservées au contrôle de gestion. Un administrateur réseau central gère ces droits et audite régulièrement les accès. Decathlon anime également une communauté interne baptisée « Sporting Ideas » où les employés de terrain peuvent soumettre des suggestions d'amélioration, qui sont ensuite évaluées par les équipes produit. La direction estime que cette approche permet de mieux capter l'intelligence collective des équipes en contact direct avec les clients.",
    consigne:
      "Lis le support attentivement, puis rédige une réponse structurée en nommant les notions du chapitre que tu mobilises.",
    questions: [
      "Quels éléments du texte montrent que des personnes travaillant sur plusieurs sites collaborent ensemble ? Identifie et nomme au moins quatre outils ou pratiques.",
      "Montre que les échanges ne se déroulent pas tous de la même façon : distingue les échanges synchrones (en temps réel) des échanges asynchrones (en différé) à partir du support.",
      "Pourquoi tous les collaborateurs de Decathlon n'ont-ils pas accès aux mêmes informations ? Explique le principe des droits d'accès et son enjeu pour l'organisation.",
      "Comment la plateforme « Sporting Ideas » favorise-t-elle l'intelligence collective au sein de Decathlon ?",
      "Synthèse (10 à 15 lignes) : les outils numériques suffisent-ils à eux seuls à rendre une organisation plus performante ? Argumente en t'appuyant sur l'exemple Decathlon.",
    ],
    correctionModele:
      "1) Outils et pratiques de collaboration multi-sites :\n" +
      "— Microsoft Teams : réunions à distance et messagerie instantanée entre sites.\n" +
      "— Trello : suivi partagé des projets de lancement produit entre équipes distantes.\n" +
      "— SharePoint : stockage et partage de documents entre magasins, logistique et siège.\n" +
      "— Communauté « Sporting Ideas » : espace collaboratif permettant aux employés de terrain de contribuer aux décisions produit.\n\n" +
      "2) Échanges synchrones et asynchrones :\n" +
      "Échanges synchrones (en temps réel) : les réunions sur Microsoft Teams, où tous les participants sont connectés simultanément.\n" +
      "Échanges asynchrones (en différé) : la messagerie instantanée Teams, le suivi de tâches sur Trello et le dépôt de suggestions sur « Sporting Ideas » — chacun contribue à son propre rythme, sans nécessiter la présence simultanée de tous.\n\n" +
      "3) Droits d'accès et enjeux :\n" +
      "Le principe des droits d'accès consiste à définir, pour chaque utilisateur, les données et fonctions auxquelles il peut accéder en fonction de son rôle. " +
      "Chez Decathlon, un responsable de rayon n'accède qu'aux données de son magasin, tandis que les bilans financiers consolidés sont réservés au contrôle de gestion. " +
      "Cela protège la confidentialité des données sensibles, réduit les risques d'erreur ou de malveillance interne, et garantit que chacun travaille dans un périmètre maîtrisé.\n\n" +
      "4) Intelligence collective via « Sporting Ideas » :\n" +
      "La plateforme « Sporting Ideas » permet à des milliers d'employés de terrain — qui connaissent les attentes des clients au quotidien — de partager leurs idées avec les équipes produit au siège. " +
      "En agrégeant des suggestions venant de partout, Decathlon accède à une forme d'intelligence collective : le groupe sait plus que chaque individu pris séparément. " +
      "Cela permet d'innover de façon plus pertinente et inclusive.\n\n" +
      "5) Synthèse — le numérique suffit-il seul ?\n" +
      "Les outils numériques sont indispensables : sans Teams, Trello ou SharePoint, la coordination de 100 000 collaborateurs dans 60 pays serait impossible. " +
      "Mais ils ne suffisent pas à eux seuls. Il faut aussi une culture de la collaboration (accepter de partager l'information), une gouvernance claire (droits d'accès, rôle de l'administrateur), " +
      "une formation des utilisateurs et une animation des outils (comme « Sporting Ideas »). " +
      "L'outil numérique est un levier de performance, mais c'est l'organisation qui le met en œuvre qui détermine son efficacité réelle.",
    attendu: "Mobilisation complète du chapitre 7, appui sur le texte, argumentation structurée et nuancée.",
  },
  {
    id: "sdgn7-cas2",
    title: "Étude de cas : L'Oréal",
    type: "Etude de cas",
    difficulty: "Tres difficile",
    xp: 620,
    minChars: 620,
    support:
      "L'Oréal, premier groupe cosmétique mondial, coordonne ses activités avec ses partenaires externes (agences de communication, distributeurs, fournisseurs d'ingrédients) via un extranet sécurisé. Sur cet espace dédié, les agences déposent les maquettes de campagnes, les distributeurs consultent les calendriers de lancement et les fournisseurs transmettent leurs bons de livraison — sans jamais avoir accès aux données internes du groupe. En parallèle, les équipes communication du groupe animent des communautés en ligne sur Instagram, YouTube et TikTok pour dialoguer avec 250 millions d'abonnés dans le monde. L'Oréal utilise également une solution d'intelligence artificielle pour analyser les conversations sur les réseaux sociaux en temps réel, détecter les tendances beauté émergentes et personnaliser les recommandations produits sur son site e-commerce. Cette transformation numérique s'accompagne d'un cadre exigeant : charte de l'usage des données, rôles précis des administrateurs, et audits de sécurité deux fois par an. La direction numérique reconnaît que l'IA accélère certaines tâches d'analyse, mais que la créativité humaine reste indispensable pour concevoir des campagnes qui résonnent avec les clients.",
    consigne:
      "Rédige une réponse structurée de type bac. Identifie les trois grands thèmes du texte (communication publique, collaboration avec les partenaires, automatisation et IA) et mobilise les notions du cours.",
    questions: [
      "Qu'est-ce qui relève, dans le texte, de la communication avec le grand public par le numérique ? Identifie les outils et expliquez leur rôle.",
      "Pourquoi l'espace réservé aux partenaires fonctionne-t-il différemment d'un site internet classique ? Quelle notion du cours cela illustre-t-il ?",
      "Comment L'Oréal encadre-t-il qui peut voir quoi dans son système d'information ? Quel est l'enjeu pour l'organisation ?",
      "En quoi l'intelligence artificielle soulage-t-elle certaines tâches chez L'Oréal ? Quelles limites ou risques faut-il mentionner ?",
      "Synthèse (12 à 18 lignes) : confier une partie du travail à des systèmes automatiques suffit-il à assurer une performance durable ? Appuie-toi sur l'exemple L'Oréal et sur ton cours.",
    ],
    correctionModele:
      "1) Communication avec le grand public :\n" +
      "L'Oréal anime des communautés en ligne sur Instagram, YouTube et TikTok, touchant 250 millions d'abonnés. " +
      "Ces plateformes sont des outils d'e-communication : elles permettent au groupe de diffuser ses messages, de dialoguer avec ses clients et de construire sa notoriété à l'échelle mondiale. " +
      "Ce sont des réseaux sociaux à destination du grand public, accessibles à tous.\n\n" +
      "2) L'extranet vs le site internet classique :\n" +
      "Un site internet classique est accessible à tous les internautes (internet = réseau public). L'espace réservé aux partenaires de L'Oréal est un extranet : il n'est accessible qu'aux partenaires autorisés (agences, distributeurs, fournisseurs). " +
      "Chacun y accède selon ses droits : une agence voit les briefs créatifs, un fournisseur consulte ses bons de livraison, mais aucun n'accède aux données internes du groupe. " +
      "Cela illustre la notion d'extranet : prolongement de l'intranet vers des partenaires extérieurs de confiance.\n\n" +
      "3) Gestion des droits d'accès et enjeux :\n" +
      "L'Oréal encadre les accès via une charte d'usage des données, des rôles précis pour les administrateurs réseau et des audits de sécurité biannuels. " +
      "Les droits d'accès définissent ce que chaque acteur peut consulter, modifier ou déposer, selon son rôle. " +
      "L'enjeu est double : protéger la confidentialité des données stratégiques (formules, plans de lancement) et garantir la conformité réglementaire (protection des données personnelles).\n\n" +
      "4) Intelligence artificielle — apports et limites :\n" +
      "L'IA analyse les conversations sur les réseaux sociaux en temps réel, détecte les tendances beauté et personnalise les recommandations produits. " +
      "Elle libère les équipes des tâches d'analyse répétitives et accélère la prise de décision. " +
      "Limites et risques : la direction reconnaît que la créativité humaine reste indispensable pour concevoir des campagnes efficaces. " +
      "De plus, une dépendance excessive à l'IA peut exposer l'organisation à des risques algorithmiques (biais, erreurs d'interprétation) ou à des problèmes éthiques liés à la collecte de données.\n\n" +
      "5) Synthèse — automatisation et performance durable :\n" +
      "L'automatisation apporte des gains réels : analyse plus rapide, personnalisation à grande échelle, réduction des tâches à faible valeur ajoutée. " +
      "Mais elle ne suffit pas à garantir une performance durable. Chez L'Oréal, l'IA analyse les tendances, mais c'est l'équipe créative humaine qui conçoit les campagnes. " +
      "Par ailleurs, la performance durable repose aussi sur la sécurité du SI (audits, charte), sur la qualité de la gouvernance (droits d'accès, rôles définis) et sur la confiance des partenaires. " +
      "L'automatisation est un outil puissant, mais c'est l'organisation qui en fait un usage intelligent et responsable qui détermine si elle contribue réellement à la performance.",
    attendu: "Démonstration complète avec esprit critique, mobilisation des notions du chapitre, exemples précis et nuances.",
  },
];

const SDGN_CHAP10_EXERCISES: MissionExercise[] = [
  {
    id: "sdgn10-e1",
    title: "Lire un compte de résultat simplifié",
    type: "Exercice",
    difficulty: "Facile",
    xp: 120,
    minChars: 120,
    support:
      "Extrait du compte de résultat simplifié de Fnac Darty (exercice N, montants en millions d'euros). Lis les tableaux ci-dessous.",
    supportTables: [
      {
        title: "Produits d'exploitation",
        columns: ["Poste", "Montant (M€)"],
        rows: [
          ["Ventes de marchandises", "7 850"],
          ["Prestations de services", "420"],
          ["Autres produits d'exploitation", "80"],
          ["Total produits d'exploitation", "8 350"],
        ],
      },
      {
        title: "Charges d'exploitation",
        columns: ["Poste", "Montant (M€)"],
        rows: [
          ["Achats de marchandises", "5 600"],
          ["Salaires et charges sociales", "1 350"],
          ["Loyers et charges locatives", "480"],
          ["Amortissements", "210"],
          ["Autres charges d'exploitation", "320"],
          ["Total charges d'exploitation", "7 960"],
        ],
      },
      {
        title: "Synthèse",
        columns: ["Indicateur", "Montant (M€)"],
        rows: [["Résultat d'exploitation (produits − charges)", "390"]],
      },
    ],
    consigne: "Réponds aux trois questions en t'appuyant sur le support.",
    questions: [
      "Identifie deux charges d'exploitation de Fnac Darty et explique en une phrase ce qu'elles représentent.",
      "Identifie deux produits d'exploitation et explique leur origine.",
      "Calcule le résultat d'exploitation en appliquant la formule du cours. Vérifie que tu retrouves le chiffre du support.",
    ],
    correctionModele:
      "1) Deux charges d'exploitation :\n" +
      "— Salaires et charges sociales (1 350 M€) : ce sont les rémunérations versées aux salariés ainsi que les cotisations patronales. Elles représentent le coût du travail.\n" +
      "— Achats de marchandises (5 600 M€) : ce sont les coûts d'achat des produits revendus en magasin et sur le site. Il s'agit du principal poste de charges pour un distributeur.\n\n" +
      "2) Deux produits d'exploitation :\n" +
      "— Ventes de marchandises (7 850 M€) : il s'agit du chiffre d'affaires réalisé par la vente de produits (high-tech, électroménager, livres…). C'est la ressource principale de l'entreprise.\n" +
      "— Prestations de services (420 M€) : revenus issus des services proposés (contrats d'entretien, garanties étendues, abonnements Fnac+…).\n\n" +
      "3) Calcul du résultat d'exploitation :\n" +
      "Résultat d'exploitation = Total produits d'exploitation − Total charges d'exploitation\n" +
      "= 8 350 M€ − 7 960 M€ = 390 M€ ✓\n" +
      "Le résultat est positif : Fnac Darty dégage un bénéfice d'exploitation de 390 millions d'euros.",
    attendu: "Identification correcte des postes, application de la formule, résultat juste et commenté.",
  },
  {
    id: "sdgn10-e2",
    title: "Charges et produits : classer",
    type: "Exercice",
    difficulty: "Facile",
    xp: 130,
    minChars: 140,
    support:
      "Liste des opérations réalisées par Boulanger SA durant l'exercice. À classer pour chaque ligne.",
    supportTables: [
      {
        title: "Opérations à analyser",
        columns: ["N°", "Opération", "Montant (€)"],
        rows: [
          ["1", "Versement des salaires du mois de mars", "280 000"],
          ["2", "Vente de réfrigérateurs à des clients particuliers", "1 200 000"],
          ["3", "Intérêts versés à la banque sur un emprunt en cours", "45 000"],
          ["4", "Loyer des entrepôts de stockage", "96 000"],
          ["5", "Subvention d'exploitation reçue de la région", "30 000"],
          ["6", "Dotation aux amortissements d'un chariot élévateur", "18 000"],
          ["7", "Dividendes reçus d'une filiale étrangère", "22 000"],
          ["8", "Amende pour infraction au droit de la concurrence", "15 000"],
        ],
      },
    ],
    consigne: "Pour chacune des 8 opérations, précise s'il s'agit d'une charge ou d'un produit, puis indique sa nature : exploitation, financière ou exceptionnelle.",
    questions: [
      "Opérations 1 à 4 : charge ou produit ? Exploitation, financière ou exceptionnelle ?",
      "Opérations 5 à 8 : charge ou produit ? Exploitation, financière ou exceptionnelle ?",
    ],
    correctionModele:
      "Opérations 1 à 4 :\n" +
      "1. Salaires → Charge d'exploitation (coût lié à l'activité courante de l'entreprise).\n" +
      "2. Ventes de réfrigérateurs → Produit d'exploitation (recette principale de l'activité commerciale).\n" +
      "3. Intérêts bancaires → Charge financière (coût lié au financement par emprunt).\n" +
      "4. Loyer des entrepôts → Charge d'exploitation (dépense nécessaire à l'activité courante).\n\n" +
      "Opérations 5 à 8 :\n" +
      "5. Subvention d'exploitation → Produit d'exploitation (aide reçue dans le cadre de l'activité normale).\n" +
      "6. Dotation aux amortissements → Charge d'exploitation (constatation comptable de la perte de valeur d'un bien).\n" +
      "7. Dividendes reçus → Produit financier (revenu issu d'une participation dans une autre société).\n" +
      "8. Amende concurrence → Charge exceptionnelle (opération inhabituelle, hors exploitation courante).",
    attendu: "Classement correct des 8 opérations avec nature précisée et justification courte.",
  },
  {
    id: "sdgn10-e3",
    title: "Résultat net : bénéfice ou perte ?",
    type: "Exercice",
    difficulty: "Facile",
    xp: 140,
    minChars: 120,
    support:
      "Données simplifiées du compte de résultat de Renault SA (exercice N, milliards d'euros).",
    supportTables: [
      {
        title: "Synthèse du compte de résultat",
        columns: ["Rubrique", "Montant (Md€)"],
        rows: [
          ["Produits d'exploitation", "44,8"],
          ["Produits financiers", "1,1"],
          ["Produits exceptionnels", "0,5"],
          ["Total des produits", "46,4"],
          ["Charges d'exploitation", "42,5"],
          ["Charges financières", "1,8"],
          ["Charges exceptionnelles", "0,6"],
          ["Total des charges", "44,9"],
          ["Impôt sur les bénéfices", "0,4"],
        ],
      },
    ],
    consigne: "Réponds aux trois questions en montrant tes calculs.",
    questions: [
      "Calcule le résultat avant impôt (résultat = total produits − total charges).",
      "Calcule le résultat net (après impôt). S'agit-il d'un bénéfice ou d'une perte ? Justifie.",
      "Explique en deux phrases ce que ce résultat signifie concrètement pour Renault et ses actionnaires.",
    ],
    correctionModele:
      "1) Résultat avant impôt :\n" +
      "Résultat avant impôt = Total produits − Total charges\n" +
      "= 46,4 − 44,9 = 1,5 Md€\n\n" +
      "2) Résultat net :\n" +
      "Résultat net = Résultat avant impôt − Impôt sur les bénéfices\n" +
      "= 1,5 − 0,4 = 1,1 Md€\n" +
      "Le résultat est positif : il s'agit d'un bénéfice. Renault a créé de la richesse sur cet exercice.\n\n" +
      "3) Signification pour Renault et ses actionnaires :\n" +
      "Un bénéfice de 1,1 Md€ signifie que Renault a vendu plus qu'il n'a dépensé : l'entreprise est rentable. " +
      "Pour les actionnaires, cela peut se traduire par le versement de dividendes ou par le renforcement des capitaux propres, qui sécurisent l'avenir financier du groupe.",
    attendu: "Calculs détaillés, distinction bénéfice/perte, commentaire économique pertinent.",
  },
  {
    id: "sdgn10-e4",
    title: "L'actif du bilan",
    type: "Exercice",
    difficulty: "Moyen",
    xp: 180,
    minChars: 180,
    support:
      "Extrait de l'actif du bilan de Carrefour SA au 31 décembre N (montants en millions d'euros).",
    supportTables: [
      {
        title: "Actif immobilisé",
        columns: ["Poste", "Catégorie", "Montant (M€)"],
        rows: [
          ["Fonds de commerce et marques", "Immobilisations incorporelles", "3 200"],
          ["Brevets et logiciels", "Immobilisations incorporelles", "480"],
          ["Terrains et constructions", "Immobilisations corporelles", "8 600"],
          ["Matériels et outillages", "Immobilisations corporelles", "2 100"],
          ["Participations dans des filiales", "Immobilisations financières", "5 400"],
        ],
      },
      {
        title: "Actif circulant",
        columns: ["Poste", "Montant (M€)"],
        rows: [
          ["Stocks de marchandises", "3 800"],
          ["Créances clients", "920"],
          ["Disponibilités (banque + caisse)", "1 450"],
        ],
      },
      {
        title: "Total",
        columns: ["", "Montant (M€)"],
        rows: [["TOTAL ACTIF", "25 950"]],
      },
    ],
    consigne: "Réponds aux questions en identifiant précisément les lignes du bilan.",
    questions: [
      "Identifie les immobilisations corporelles de Carrefour et donne leur montant total.",
      "Quel montant représentent les disponibilités ? Qu'est-ce que cela signifie pour la trésorerie de l'entreprise ?",
      "Relève les créances clients : qui doit cet argent à Carrefour, et pourquoi ce poste existe-t-il au bilan ?",
      "Explique pourquoi les brevets et logiciels figurent à l'actif du bilan plutôt qu'en charges.",
    ],
    correctionModele:
      "1) Immobilisations corporelles :\n" +
      "Terrains et constructions (8 600 M€) + Matériels et outillages (2 100 M€) = 10 700 M€.\n" +
      "Ce sont des biens physiques durables utilisés pour exploiter les magasins.\n\n" +
      "2) Disponibilités :\n" +
      "1 450 M€ → c'est la trésorerie immédiatement disponible (soldes bancaires + caisse). " +
      "Cela signifie que Carrefour dispose de liquidités importantes pour faire face à ses dépenses courantes et rembourser ses dettes à court terme.\n\n" +
      "3) Créances clients :\n" +
      "920 M€ → ce sont des sommes que des clients (entreprises, franchisés, fournisseurs en compte courant) doivent encore à Carrefour pour des marchandises ou services déjà livrés. " +
      "Ce poste existe car les transactions ne sont pas toujours réglées immédiatement : un délai de paiement est accordé.\n\n" +
      "4) Pourquoi les brevets figurent à l'actif :\n" +
      "Un brevet ou un logiciel est un actif incorporel : il a une valeur économique durable pour l'entreprise (protection d'une innovation, utilisation sur plusieurs exercices). " +
      "Il est inscrit à l'actif car il continuera à générer des avantages économiques futurs, contrairement à une dépense ponctuelle passée en charges.",
    attendu: "Identification précise des postes, calculs corrects, explications conceptuelles claires.",
  },
  {
    id: "sdgn10-e5",
    title: "Le passif et les capitaux propres",
    type: "Exercice",
    difficulty: "Moyen",
    xp: 190,
    minChars: 170,
    support:
      "Extrait du passif du bilan d'Atelier du Lin SAS (PME textile) au 31 décembre N (milliers d'euros).",
    supportTables: [
      {
        title: "Capitaux propres",
        columns: ["Poste", "Montant (K€)"],
        rows: [
          ["Capital social", "800"],
          ["Réserves", "340"],
          ["Résultat de l'exercice", "95"],
          ["Sous-total capitaux propres", "1 235"],
        ],
      },
      {
        title: "Dettes",
        columns: ["Poste", "Montant (K€)"],
        rows: [
          ["Emprunt bancaire à long terme", "620"],
          ["Dettes fournisseurs", "280"],
          ["Dettes fiscales et sociales", "115"],
          ["Concours bancaires courants", "60"],
          ["Sous-total dettes", "1 075"],
        ],
      },
      {
        title: "Total passif",
        columns: ["", "Montant (K€)"],
        rows: [["TOTAL PASSIF", "2 310"]],
      },
    ],
    consigne: "Réponds aux questions en t'appuyant sur les données chiffrées du support.",
    questions: [
      "Identifie les capitaux propres et leur montant total. Explique ce qu'ils représentent.",
      "Identifie les dettes fournisseurs. Qui sont-ils pour cette PME, et à quoi correspond cette dette ?",
      "Calcule la valeur financière (patrimoine) de la PME en appliquant la formule du cours.",
    ],
    correctionModele:
      "1) Capitaux propres :\n" +
      "Capitaux propres = Capital social (800 K€) + Réserves (340 K€) + Résultat (95 K€) = 1 235 K€.\n" +
      "Ils représentent les ressources apportées ou accumulées par les associés : le capital investi au départ, les bénéfices non distribués (réserves) et le résultat de l'exercice en cours. " +
      "C'est la « richesse propre » de l'entreprise, sans dette.\n\n" +
      "2) Dettes fournisseurs :\n" +
      "280 K€ → ce sont les sommes encore dues aux fournisseurs de matières premières (lin, tissu…) qui ont livré mais n'ont pas encore été payés. " +
      "Ce délai de paiement (souvent 30 à 60 jours) est une pratique commerciale normale.\n\n" +
      "3) Valeur financière (patrimoine) :\n" +
      "Valeur financière = Total actif − Total dettes\n" +
      "= 2 310 K€ − 1 075 K€ = 1 235 K€\n" +
      "On retrouve bien le montant des capitaux propres : patrimoine = capitaux propres. " +
      "La PME possède plus qu'elle ne doit, ce qui est un signe de solidité financière.",
    attendu: "Calcul exact du patrimoine, compréhension des capitaux propres, lien avec la formule du cours.",
  },
  {
    id: "sdgn10-e6",
    title: "Valeur financière fondée sur le patrimoine",
    type: "Exercice",
    difficulty: "Moyen",
    xp: 210,
    minChars: 180,
    support:
      "Bilan simplifié de la Boulangerie Artisanale Dupont au 31/12/N (entreprise individuelle, montants en euros).",
    supportTables: [
      {
        title: "Actif",
        columns: ["Poste", "Montant (€)"],
        rows: [
          ["Four et matériel professionnel", "48 000"],
          ["Véhicule de livraison", "12 000"],
          ["Stock de matières premières (farine, beurre…)", "3 500"],
          ["Créances clients (restaurants livrés)", "4 200"],
          ["Disponibilités", "6 800"],
          ["TOTAL ACTIF", "74 500"],
        ],
      },
      {
        title: "Passif (dettes)",
        columns: ["Poste", "Montant (€)"],
        rows: [
          ["Emprunt bancaire pour le four", "22 000"],
          ["Dettes fournisseurs", "3 800"],
          ["Dettes fiscales", "1 200"],
          ["TOTAL DETTES", "27 000"],
        ],
      },
    ],
    consigne: "Analyse la situation financière de la boulangerie en répondant aux deux questions.",
    questions: [
      "Calcule les capitaux propres (valeur financière patrimoniale) de la boulangerie en appliquant la formule : Total actif − Total dettes.",
      "Interprète ce résultat du point de vue d'un banquier qui envisage d'accorder un prêt supplémentaire pour financer une extension du local.",
    ],
    correctionModele:
      "1) Calcul des capitaux propres :\n" +
      "Capitaux propres = Total actif − Total dettes\n" +
      "= 74 500 € − 27 000 € = 47 500 €\n" +
      "La valeur financière (patrimoine net) de la boulangerie est de 47 500 €.\n\n" +
      "2) Interprétation du point de vue du banquier :\n" +
      "Le banquier analyse le bilan pour évaluer la solvabilité de l'emprunteur. " +
      "Avec 47 500 € de capitaux propres pour 27 000 € de dettes, la boulangerie a plus de ressources propres que de dettes : c'est un signe de bonne santé financière. " +
      "Le ratio dettes/capitaux propres est inférieur à 1, ce qui rassure le prêteur. " +
      "Toutefois, le banquier étudiera aussi la capacité de remboursement (bénéfice annuel) et la valeur des garanties (le four, le local) avant d'accorder un nouveau crédit.",
    attendu: "Calcul exact, interprétation réaliste du point de vue bancaire, lien avec les notions de solvabilité.",
  },
  {
    id: "sdgn10-e7",
    title: "La Bourse et le cours de l'action",
    type: "Exercice",
    difficulty: "Moyen",
    xp: 230,
    minChars: 200,
    support:
      "Article de presse (extrait, source fictive, données illustratives) — Décembre N :\n" +
      "« LVMH (Moët Hennessy Louis Vuitton) est le premier groupe mondial du luxe, coté sur Euronext Paris. " +
      "Au 15 décembre N, le cours de l'action LVMH s'établit à 740 €. Le groupe dispose de 502 millions d'actions en circulation. " +
      "En début d'année, le cours était de 680 €. " +
      "Après la publication de résultats semestriels solides (chiffre d'affaires +8 %, résultat net +6 %), " +
      "plusieurs analystes ont relevé leur objectif de cours, contribuant à la hausse observée. " +
      "Les investisseurs institutionnels (fonds de pension, assureurs) détiennent environ 60 % du capital. »",
    consigne: "Réponds aux trois questions en t'appuyant sur le support et sur ton cours.",
    questions: [
      "Explique avec tes propres mots ce qu'est le cours d'une action et comment il se forme.",
      "Calcule la valeur boursière de LVMH au 15 décembre N.",
      "Identifie dans le support au moins deux facteurs qui expliquent la hausse du cours de l'action depuis le début de l'année.",
    ],
    correctionModele:
      "1) Le cours d'une action :\n" +
      "Le cours d'une action est le prix auquel une action s'échange en Bourse à un instant donné. " +
      "Il résulte de la confrontation entre l'offre (vendeurs d'actions) et la demande (acheteurs d'actions). " +
      "Si beaucoup d'investisseurs veulent acheter une action, le cours monte ; si beaucoup veulent vendre, il baisse. " +
      "Le cours fluctue en permanence en fonction des informations disponibles sur l'entreprise et son environnement.\n\n" +
      "2) Valeur boursière de LVMH :\n" +
      "Valeur boursière = Nombre d'actions × Cours de l'action\n" +
      "= 502 000 000 × 740 € = 371 480 000 000 € ≈ 371,5 milliards d'euros\n\n" +
      "3) Facteurs expliquant la hausse :\n" +
      "— Publication de résultats solides (CA +8 %, résultat net +6 %) : les investisseurs anticipent une performance durable et achètent davantage d'actions.\n" +
      "— Relèvement des objectifs de cours par les analystes financiers : cela incite d'autres investisseurs à acheter, créant une pression haussière sur le cours.",
    attendu: "Définition claire du cours, calcul correct de la valeur boursière, facteurs bien identifiés.",
  },
  {
    id: "sdgn10-e8",
    title: "Facteurs influençant la valeur boursière",
    type: "Exercice",
    difficulty: "Difficile",
    xp: 260,
    minChars: 230,
    support:
      "Dépêche financière (extrait, données fictives illustratives) — Résultats semestriels Air France-KLM :\n" +
      "« Air France-KLM a publié ses résultats du premier semestre N. Le chiffre d'affaires progresse de +7 % à 14,2 Md€, porté par la reprise du trafic long-courrier. " +
      "Cependant, le résultat net s'établit à seulement 180 M€, en retrait de 35 % par rapport au S1 N-1, en raison de la hausse du prix du kérosène (+22 %) et des coûts de maintenance d'une flotte vieillissante. " +
      "Les analystes attendaient un résultat de 310 M€. Suite à cette publication, le cours de l'action Air France-KLM a chuté de 8,4 % en une séance, passant de 12,80 € à 11,72 €. " +
      "Le PDG a évoqué un plan de réduction des coûts, mais les investisseurs restent prudents face aux incertitudes sur le prix du carburant. »",
    consigne: "Réponds aux questions en mobilisant les notions du cours sur la valeur boursière.",
    questions: [
      "Identifie dans le texte au moins trois facteurs qui ont contribué à la baisse du cours de l'action Air France-KLM.",
      "Explique le lien entre le résultat net et la valeur boursière d'une société cotée.",
      "Identifie deux catégories d'acteurs qui surveillent attentivement la valeur boursière d'Air France-KLM et explique pourquoi elle les intéresse.",
    ],
    correctionModele:
      "1) Facteurs expliquant la baisse du cours :\n" +
      "— Résultat net décevant (180 M€ au lieu des 310 M€ attendus) : les investisseurs révisent à la baisse leurs anticipations de rentabilité.\n" +
      "— Hausse du prix du kérosène (+22 %) : coût non maîtrisable qui pèse sur les marges futures.\n" +
      "— Coûts de maintenance élevés liés à une flotte vieillissante : signal d'un besoin d'investissement important à venir.\n" +
      "— Incertitudes sur les perspectives (prix du carburant) : l'incertitude pousse les investisseurs à vendre.\n\n" +
      "2) Lien résultat net / valeur boursière :\n" +
      "Le résultat net mesure ce que l'entreprise a gagné après toutes les charges et impôts. " +
      "Un résultat élevé signifie que l'entreprise est rentable et peut distribuer des dividendes ou investir. " +
      "Les investisseurs achètent des actions en espérant en tirer un revenu (dividende) ou une plus-value. " +
      "Si le résultat déçoit, la demande d'actions baisse → le cours diminue → la valeur boursière recule.\n\n" +
      "3) Acteurs qui surveillent la valeur boursière :\n" +
      "— Les actionnaires (institutionnels et particuliers) : la valeur de leurs titres dépend directement du cours ; une baisse réduit leur patrimoine.\n" +
      "— Les dirigeants d'Air France-KLM : une valorisation boursière basse fragilise l'entreprise (risque d'OPA, difficulté à lever des fonds, signal négatif pour les partenaires).",
    attendu: "Analyse complète des facteurs, lien résultat/cours bien expliqué, acteurs et enjeux identifiés.",
  },
  {
    id: "sdgn10-e9",
    title: "Comparer valeur financière et valeur boursière",
    type: "Exercice",
    difficulty: "Difficile",
    xp: 280,
    minChars: 250,
    support:
      "Données Tesla Inc. (exercice N, chiffres illustratifs simplifiés). Tesla est cotée au NASDAQ. Les ventes de véhicules électriques ont progressé de +40 % sur 3 ans ; les investisseurs anticipent une forte croissance du marché de l'électrique et une diversification (énergie solaire, batteries). La concurrence s'intensifie (BYD, Volkswagen, Renault).",
    supportTables: [
      {
        title: "Extrait de bilan (Md$)",
        columns: ["Poste", "Montant"],
        rows: [
          ["Total actif", "92"],
          ["Total dettes", "62"],
          ["Capitaux propres", "30"],
        ],
      },
      {
        title: "Données boursières",
        columns: ["Indicateur", "Valeur"],
        rows: [
          ["Nombre d'actions en circulation", "3,2 milliards"],
          ["Cours de l'action", "210 $"],
        ],
      },
    ],
    consigne: "Compare les deux formes de valeur en mobilisant les notions du cours.",
    questions: [
      "Calcule la valeur financière (patrimoine) de Tesla à partir des données du bilan.",
      "Calcule la valeur boursière de Tesla.",
      "Compare les deux valeurs. Que constates-tu ? Explique pourquoi elles peuvent différer autant.",
    ],
    correctionModele:
      "1) Valeur financière (patrimoine) :\n" +
      "Valeur financière = Total actif − Total dettes\n" +
      "= 92 Md$ − 62 Md$ = 30 Md$\n" +
      "(On retrouve bien les capitaux propres.)\n\n" +
      "2) Valeur boursière :\n" +
      "Valeur boursière = Nombre d'actions × Cours de l'action\n" +
      "= 3 200 000 000 × 210 $ = 672 000 000 000 $ = 672 Md$\n\n" +
      "3) Comparaison et explication :\n" +
      "La valeur boursière (672 Md$) est 22 fois supérieure à la valeur financière patrimoniale (30 Md$). Cet écart est considérable.\n" +
      "Explications :\n" +
      "— La Bourse ne valorise pas seulement ce que l'entreprise possède aujourd'hui, mais ce qu'elle est susceptible de gagner demain. Les investisseurs anticipent une croissance forte du marché électrique.\n" +
      "— La notoriété de la marque Tesla, le leadership technologique et les perspectives de diversification (solaire, batteries) sont des actifs immatériels non comptabilisés au bilan.\n" +
      "— La valeur boursière reflète la confiance des investisseurs et leurs anticipations de bénéfices futurs, alors que la valeur financière ne mesure que le patrimoine actuel.\n" +
      "— Risque : si les résultats déçoivent ou si la concurrence s'intensifie, la valeur boursière peut chuter brutalement.",
    attendu: "Deux calculs corrects, analyse lucide de l'écart, notions de patrimoine vs anticipations bien articulées.",
  },
  {
    id: "sdgn10-e10",
    title: "Répartition de la valeur ajoutée",
    type: "Exercice",
    difficulty: "Tres difficile",
    xp: 360,
    minChars: 300,
    support:
      "Rapport annuel simplifié — Bonval SA (groupe agro-alimentaire fictif, inspiré du secteur Danone). Les montants sont en millions d'euros.",
    supportTables: [
      {
        title: "Calcul de la valeur ajoutée",
        columns: ["Poste", "Montant (M€)"],
        rows: [
          ["Chiffre d'affaires", "8 600"],
          ["Achats de matières premières consommées", "3 900"],
          ["Services externes", "800"],
          ["Valeur ajoutée (CA − achats − services)", "3 900"],
        ],
      },
      {
        title: "Répartition de la valeur ajoutée",
        columns: ["Acteur / poste", "Montant (M€)", "% de la VA"],
        rows: [
          ["Salaires et charges sociales (salariés)", "1 850", "47,4 %"],
          ["Impôts et taxes (État)", "320", "8,2 %"],
          ["Intérêts des emprunts (établissements de crédit)", "210", "5,4 %"],
          ["Amortissements (outil de production)", "480", "12,3 %"],
          ["Résultat net (dont dividendes actionnaires 300 M€)", "1 040", "26,7 %"],
          ["Total réparti", "3 900", "100 %"],
        ],
      },
    ],
    consigne: "Analyse la répartition de la valeur ajoutée en mobilisant les notions du cours.",
    questions: [
      "Rappelle la définition de la valeur ajoutée et vérifie le calcul à partir du support.",
      "Identifie les acteurs qui se partagent la valeur ajoutée et indique la part reçue par chacun (en M€ et en %).",
      "Explique pourquoi la répartition de la valeur ajoutée peut être source de tensions entre les parties prenantes.",
      "Quel lien peut-on établir entre valeur ajoutée, résultat net et valeur financière ou boursière de l'entreprise ?",
    ],
    correctionModele:
      "1) Définition et vérification :\n" +
      "La valeur ajoutée (VA) mesure la richesse créée par l'entreprise. Elle se calcule ainsi :\n" +
      "VA = Chiffre d'affaires − Consommations intermédiaires (achats + services externes)\n" +
      "= 8 600 − (3 900 + 800) = 8 600 − 4 700 = 3 900 M€ ✓\n\n" +
      "2) Répartition de la VA :\n" +
      "Total VA = 3 900 M€\n" +
      "— Salariés (salaires + charges) : 1 850 M€ → 47,4 %\n" +
      "— État (impôts et taxes) : 320 M€ → 8,2 %\n" +
      "— Établissements de crédit (intérêts) : 210 M€ → 5,4 %\n" +
      "— Entreprise elle-même (amortissements) : 480 M€ → 12,3 %\n" +
      "— Actionnaires + réserves (résultat net) : 1 040 M€ → 26,7 %\n\n" +
      "3) Sources de tensions :\n" +
      "La VA est limitée : ce qu'un acteur reçoit de plus, c'est potentiellement moins pour les autres. " +
      "Les salariés peuvent demander des augmentations (syndicats, négociations collectives) au détriment du résultat distribué aux actionnaires. " +
      "Les actionnaires peuvent exiger de meilleurs rendements, ce qui pousse les dirigeants à comprimer les salaires ou délocaliser. " +
      "L'État peut augmenter les impôts, réduisant la part disponible pour les autres acteurs. " +
      "Ces arbitrages définissent la « valeur sociale » de l'entreprise.\n\n" +
      "4) Lien VA / résultat / valeur financière ou boursière :\n" +
      "Le résultat net (1 040 M€) est la part de VA qui reste après rémunération de tous les autres acteurs. " +
      "S'il est mis en réserve, il accroît les capitaux propres → la valeur financière patrimoniale augmente. " +
      "Sur les marchés financiers, un résultat net élevé et régulier attire les investisseurs → le cours de l'action monte → la valeur boursière progresse. " +
      "La VA est donc à l'origine de toutes les formes de valeur de l'entreprise.",
    attendu: "Calcul de VA, tableau de répartition complet, analyse des tensions, synthèse sur les liens entre les formes de valeur.",
  },
  {
    id: "sdgn10-cas1",
    title: "Étude de cas : Orange SA",
    type: "Etude de cas",
    difficulty: "Tres difficile",
    xp: 560,
    minChars: 560,
    support:
      "Orange SA — opérateur historique de télécommunications en France, coté sur Euronext Paris. Environ 137 000 salariés dans le monde, activité dans 26 pays (mobile, Internet, TV, B2B). Données ci-dessous pour l'exercice N.",
    supportTables: [
      {
        title: "Compte de résultat simplifié (Md€)",
        columns: ["Rubrique", "Montant"],
        rows: [
          ["Produits d'exploitation", "43,0"],
          ["Charges d'exploitation", "38,0"],
          ["Charges financières (intérêts emprunts)", "1,2"],
          ["Produits financiers", "0,3"],
          ["Résultat exceptionnel", "−0,2"],
          ["Impôt sur les bénéfices", "1,1"],
        ],
      },
      {
        title: "Bilan au 31/12/N (Md€)",
        columns: ["Rubrique", "Montant"],
        rows: [
          ["Total actif", "53,0"],
          ["Total dettes", "29,0"],
          ["Capitaux propres", "24,0"],
        ],
      },
      {
        title: "Données boursières au 31/12/N",
        columns: ["Indicateur", "Valeur"],
        rows: [
          ["Nombre d'actions en circulation", "2,66 milliards"],
          ["Cours de l'action", "10,00 €"],
        ],
      },
    ],
    consigne:
      "Rédige une réponse structurée et complète en répondant à chaque question dans l'ordre. Mobilise les notions du chapitre 10.",
    questions: [
      "Calcule le résultat d'exploitation, puis le résultat avant impôt, puis le résultat net. Montre tes calculs.",
      "Identifie dans le compte de résultat un exemple de charge d'exploitation, une charge financière et un résultat exceptionnel. Précise la nature (exploitation / financière / exceptionnelle) de chaque élément.",
      "Calcule la valeur financière patrimoniale d'Orange à partir du bilan.",
      "Calcule la valeur boursière d'Orange au 31/12/N.",
      "Compare les deux valeurs. Laquelle est la plus élevée ? Propose une explication économique.",
      "Qui est intéressé par ces informations financières ? Cite au moins trois catégories d'acteurs et explique pourquoi chacun surveille ces données.",
    ],
    correctionModele:
      "1) Calculs des résultats :\n" +
      "Résultat d'exploitation = Produits d'exploitation − Charges d'exploitation\n" +
      "= 43,0 − 38,0 = 5,0 Md€\n\n" +
      "Résultat avant impôt = Résultat d'exploitation + Résultat financier + Résultat exceptionnel\n" +
      "Résultat financier = Produits financiers − Charges financières = 0,3 − 1,2 = −0,9 Md€\n" +
      "Résultat avant impôt = 5,0 + (−0,9) + (−0,2) = 3,9 Md€\n\n" +
      "Résultat net = Résultat avant impôt − Impôt sur les bénéfices\n" +
      "= 3,9 − 1,1 = 2,8 Md€ (bénéfice)\n\n" +
      "2) Nature des éléments :\n" +
      "— Charges d'exploitation (38,0 Md€) : nature exploitation — dépenses liées à l'activité courante (réseaux, salaires, marketing…).\n" +
      "— Charges financières (1,2 Md€) : nature financière — intérêts versés aux banques pour le remboursement des emprunts contractés pour financer l'infrastructure.\n" +
      "— Résultat exceptionnel (−0,2 Md€) : nature exceptionnelle — opération inhabituelle (par exemple, coût d'une restructuration ou d'un litige).\n\n" +
      "3) Valeur financière patrimoniale :\n" +
      "Valeur financière = Total actif − Total dettes\n" +
      "= 53,0 − 29,0 = 24,0 Md€\n" +
      "(Correspond aux capitaux propres indiqués au bilan.)\n\n" +
      "4) Valeur boursière :\n" +
      "Valeur boursière = Nombre d'actions × Cours de l'action\n" +
      "= 2 660 000 000 × 10,00 € = 26 600 000 000 € = 26,6 Md€\n\n" +
      "5) Comparaison :\n" +
      "Valeur boursière (26,6 Md€) > Valeur financière patrimoniale (24,0 Md€)\n" +
      "La valeur boursière est légèrement supérieure. La Bourse valorise Orange au-delà de ses seuls capitaux propres car les investisseurs anticipent des flux de trésorerie futurs (abonnements récurrents, réseau 5G en déploiement). " +
      "Cet écart reste modéré : dans le secteur des télécoms, les actifs sont très capitalistiques et l'endettement important, ce qui limite la prime boursière par rapport à d'autres secteurs (tech, luxe).\n\n" +
      "6) Acteurs intéressés par ces informations :\n" +
      "— Actionnaires : ils surveillent le résultat net (dividendes potentiels) et la valeur boursière (évolution de leur patrimoine).\n" +
      "— Banques et créanciers : ils analysent les capitaux propres et les dettes pour évaluer la solvabilité d'Orange avant d'accorder un nouveau crédit.\n" +
      "— Salariés et syndicats : un résultat net élevé peut justifier des demandes de revalorisation salariale ou de partage de la valeur ajoutée.\n" +
      "— Investisseurs institutionnels (fonds de pension, assureurs) : ils arbitrent entre acheter et vendre des actions en fonction de la valeur boursière et des perspectives.\n" +
      "— État : en tant qu'actionnaire (il détient ~23 % du capital), mais aussi pour le rendement fiscal (impôt sur les bénéfices).",
    attendu:
      "Calculs complets et détaillés, identification des natures, comparaison des deux valeurs argumentée, au moins trois acteurs avec justifications précises.",
  },
  {
    id: "sdgn10-cas2",
    title: "Étude de cas : Doctolib, une start-up non cotée",
    type: "Etude de cas",
    difficulty: "Tres difficile",
    xp: 620,
    minChars: 620,
    support:
      "Doctolib — start-up française (prise de rendez-vous médicaux en ligne). Plus de 80 000 professionnels partenaires et 60 millions de patients utilisateurs. Non cotée en Bourse. Contexte : forte croissance du marché de la santé numérique (estimé à 660 Md$ en 2030, source illustrative McKinsey).",
    supportTables: [
      {
        title: "Bilan simplifié (exercice N)",
        columns: ["Poste", "Montant (M€)"],
        rows: [
          ["Total actif", "420"],
          ["Total dettes", "240"],
          ["Capitaux propres", "180"],
        ],
      },
      {
        title: "Compte de résultat (extrait)",
        columns: ["Poste", "Montant (M€)"],
        rows: [["Résultat net de l'exercice", "−35"]],
      },
      {
        title: "Valorisation levée de fonds (série E)",
        columns: ["Donnée", "Valeur"],
        rows: [
          ["Valorisation retenue par les investisseurs", "5 800 M€"],
          ["Investisseurs cités (illustratif)", "General Atlantic, Eurazeo…"],
        ],
      },
    ],
    consigne:
      "Rédige une analyse structurée et argumentée de la situation de Doctolib en répondant à chaque question. Mobilise les notions du cours.",
    questions: [
      "Calcule la valeur financière patrimoniale de Doctolib. Que représente-t-elle concrètement ?",
      "Doctolib n'est pas cotée en Bourse. Comment les investisseurs ont-ils quand même déterminé une valeur pour l'entreprise ? Explique la différence entre valeur comptable et valeur de marché.",
      "Pourquoi des investisseurs acceptent-ils de valoriser Doctolib à 5 800 M€ alors que ses capitaux propres ne s'élèvent qu'à 180 M€ ? Identifie au moins trois raisons.",
      "Doctolib affiche une perte de 35 M€ cette année. Est-ce nécessairement un mauvais signe ? Explique.",
      "Quels sont les enjeux de la valeur de Doctolib pour ses différentes parties prenantes (fondateurs, investisseurs, salariés, patients, État) ?",
    ],
    correctionModele:
      "1) Valeur financière patrimoniale :\n" +
      "Valeur financière = Total actif − Total dettes\n" +
      "= 420 M€ − 240 M€ = 180 M€\n" +
      "Elle représente ce que l'entreprise « vaut » sur la base de son patrimoine actuel : la richesse accumulée par les apports des associés et les bénéfices passés mis en réserve. " +
      "C'est une mesure comptable, fondée sur ce qui est dans le bilan aujourd'hui.\n\n" +
      "2) Valeur de marché vs valeur comptable :\n" +
      "La valeur comptable (180 M€) repose sur les données historiques du bilan. " +
      "La valeur de marché (5 800 M€) est le prix qu'un investisseur est prêt à payer pour entrer au capital, estimé lors d'une levée de fonds. " +
      "Pour une entreprise non cotée, il n'y a pas de cours boursier : la valorisation est négociée entre l'entreprise et les investisseurs, en s'appuyant sur des méthodes de projection (multiples de chiffre d'affaires, flux de trésorerie futurs actualisés). " +
      "La différence entre les deux reflète la prime payée pour les perspectives de croissance future.\n\n" +
      "3) Pourquoi 5 800 M€ pour 180 M€ de capitaux propres :\n" +
      "— Marché à très forte croissance : le marché de la santé numérique vaut potentiellement 660 Md$ en 2030 ; être en position de leader aujourd'hui ouvre des revenus futurs considérables.\n" +
      "— Actifs immatériels non comptabilisés : la base de 80 000 professionnels partenaires, la marque Doctolib, les données de santé agrégées (dans le respect du RGPD), les algorithmes d'IA représentent une valeur réelle non inscrite au bilan.\n" +
      "— Modèle économique récurrent : les abonnements mensuels des professionnels de santé génèrent des revenus stables et prévisibles, très appréciés des investisseurs.\n" +
      "— Barrières à l'entrée élevées : recréer un réseau de 80 000 médecins et 60 millions de patients prendrait des années à un concurrent.\n" +
      "— Perspectives d'introduction en Bourse (IPO) : les investisseurs anticipent une sortie valorisante dans 2-3 ans.\n\n" +
      "4) La perte de 35 M€ : bon ou mauvais signe ?\n" +
      "Ce n'est pas nécessairement un mauvais signe dans ce contexte. " +
      "Doctolib réinvestit massivement ses revenus en R&D (IA, nouvelles fonctionnalités) et en expansion internationale (Allemagne, Italie). " +
      "Pour une start-up en hypercroissance, accepter des pertes à court terme pour conquérir des parts de marché est une stratégie délibérée (stratégie « blitzscaling »). " +
      "Les investisseurs évaluent la trajectoire de croissance plutôt que le résultat immédiat. " +
      "En revanche, si les pertes persistent trop longtemps sans croissance du chiffre d'affaires, cela deviendrait préoccupant.\n\n" +
      "5) Enjeux pour les parties prenantes :\n" +
      "— Fondateurs : une valorisation élevée préserve leur part du capital et leur influence dans les décisions stratégiques.\n" +
      "— Investisseurs : ils espèrent une plus-value lors de l'IPO ou d'une revente ; la valorisation actuelle sécurise leur mise.\n" +
      "— Salariés : la valorisation de l'entreprise peut se traduire par des stock-options attractives ; l'avenir de leurs emplois dépend de la viabilité financière.\n" +
      "— Patients : une Doctolib financièrement solide garantit la continuité et l'amélioration du service de prise de rendez-vous.\n" +
      "— État : une licorne française représente un enjeu de souveraineté numérique (données de santé), de fiscalité future et d'emplois qualifiés.",
    attendu:
      "Calcul de valeur financière, distinction comptable/marché claire, au moins trois raisons argumentées pour l'écart de valorisation, analyse nuancée de la perte, parties prenantes toutes traitées avec enjeux précis.",
  },
];

/** Chapitre 11 — Valeur ajoutée et valeur partenariale (manuel 1re STMG). */
const SDGN_CHAP11_EXERCISES: MissionExercise[] = [
  {
    id: "sdgn11-e1",
    title: "Les facteurs de production",
    type: "Exercice",
    difficulty: "Facile",
    xp: 120,
    minChars: 120,
    support:
      "La PME BioPain fabrique du pain bio dans son atelier. Elle emploie 12 boulangers et une responsable administrative. Elle utilise de la farine, du levain, un four professionnel, de l'électricité et des emballages recyclables.",
    consigne: "Réponds en t'appuyant sur le cours et sur le support.",
    questions: [
      "Distingue les facteurs de production « travail » et « capital » dans cet exemple (donne au moins deux exemples pour chaque catégorie).",
      "Explique en une phrase pourquoi le chiffre d'affaires ne revient pas intégralement à l'entreprise.",
    ],
    correctionModele:
      "1) Travail : les 12 boulangers et la responsable administrative mobilisent la force de travail (fabrication, organisation du laboratoire).\n" +
      "Capital : le four professionnel relève du capital technique / équipements productifs ; farine, levain, emballages et électricité sont des biens et énergies incorporés ou consommés pour produire — dans la grille « travail / capital » du cours, ils complètent les moyens matériels mis en œuvre par l'entreprise.\n\n" +
      "2) Le CA correspond aux ventes aux clients, mais l'entreprise doit ensuite payer ou engager des décaissements pour ses achats (farine, énergie…), les salaires et charges sociales, les impôts, etc. : tout le CA ne reste donc pas disponible sous forme de profit.",
    attendu: "Distinction travail / capital correcte, lien CA et paiements des tiers.",
  },
  {
    id: "sdgn11-e2",
    title: "Le chiffre d'affaires",
    type: "Exercice",
    difficulty: "Facile",
    xp: 130,
    minChars: 130,
    support:
      "Le chiffre d'affaires est la somme des ventes réalisées avec des tiers dans le cadre de l'activité normale de l'entreprise. Il peut être exprimé hors taxes (HT) ou toutes taxes comprises (TTC).",
    consigne: "Définis et illustre brièvement.",
    questions: [
      "Définis le chiffre d'affaires avec tes mots.",
      "Pourquoi le programme impose souvent de raisonner en HT pour calculer la valeur ajoutée et les consommations intermédiaires ?",
    ],
    correctionModele:
      "1) Le chiffre d'affaires mesure le montant total des ventes de biens ou de services réalisées par l'entreprise sur une période donnée : c'est la somme facturée aux clients pour l'activité courante.\n\n" +
      "2) La TVA collectée sur les ventes est reversée à l'État : elle ne constitue pas une richesse pour l'entreprise. Raisonner en HT permet de comparer ce que l'entreprise produit réellement comme valeur marchande avec les achats HT rémunérant les fournisseurs.",
    attendu: "Définition claire, justification HT cohérente.",
  },
  {
    id: "sdgn11-e3",
    title: "Calculer la valeur ajoutée",
    type: "Exercice",
    difficulty: "Facile",
    xp: 140,
    minChars: 130,
    support: "Données exercice N — CosméBio SAS (milliers d'euros HT).",
    supportTables: [
      {
        title: "Éléments pour le calcul",
        columns: ["Rubrique", "Montant (K€ HT)"],
        rows: [
          ["Chiffre d'affaires (ventes)", "4 200"],
          ["Achats de matières premières", "1 100"],
          ["Énergie (électricité, gaz)", "180"],
          ["Prestations externes (publicité, audit)", "420"],
          ["Consommations intermédiaires (total)", "1 700"],
        ],
      },
    ],
    consigne: "Applique la formule du cours et montre ton calcul.",
    questions: [
      "Calcule la valeur ajoutée : VA = CA − consommations intermédiaires.",
      "Explique ce que représente économiquement la valeur ajoutée pour CosméBio.",
    ],
    correctionModele:
      "1) VA = CA − CI = 4 200 − 1 700 = 2 500 K€.\n\n" +
      "2) La valeur ajoutée mesure la richesse créée par l'entreprise : ce que le marché paie (CA) diminué de ce qui a été acheté et consommé « en entrée » pour fabriquer ou distribuer (matières, énergie, services externes). C'est le supplément de valeur produit par CosméBio sur les produits qu'elle vend.",
    attendu: "Formule correcte, résultat exact, interprétation en termes de richesse créée.",
  },
  {
    id: "sdgn11-e4",
    title: "CA = quantités × prix unitaire HT",
    type: "Exercice",
    difficulty: "Moyen",
    xp: 180,
    minChars: 160,
    support: "La biscuiterie Armor Biscuits vend deux gammes au même exercice (prix HT).",
    supportTables: [
      {
        title: "Ventes de l'exercice",
        columns: ["Gamme", "Quantité vendue", "Prix unitaire HT"],
        rows: [
          ["Palets bretons", "120 000 boîtes", "2,80 €"],
          ["Sablés premium", "35 000 boîtes", "6,50 €"],
        ],
      },
    ],
    consigne: "Calcule puis synthétise.",
    questions: [
      "Calcule le chiffre d'affaires HT total en appliquant CA = Σ (quantités × prix unitaire HT).",
      "Indique le pourcentage du CA représenté par la gamme premium (arrondi à une décimale).",
    ],
    correctionModele:
      "1) CA palets = 120 000 × 2,80 € = 336 000 €.\n" +
      "CA sablés = 35 000 × 6,50 € = 227 500 €.\n" +
      "CA total HT = 563 500 €.\n\n" +
      "2) Part premium = 227 500 / 563 500 ≈ 40,4 %.\n" +
      "La gamme premium pèse environ deux cinquièmes du CA malgré des volumes inférieurs : elle tire la valeur vers le haut.",
    attendu: "Calculs détaillés, pourcentage correct.",
  },
  {
    id: "sdgn11-e5",
    title: "Consommations intermédiaires",
    type: "Exercice",
    difficulty: "Moyen",
    xp: 190,
    minChars: 170,
    support:
      "Les consommations intermédiaires regroupent les achats de biens et services nécessaires au processus de production et absorbés pendant l'exercice (HT).",
    supportTables: [
      {
        title: "À qualifier pour Armor Biscuits",
        columns: ["Opération", "Entrer dans les CI ?"],
        rows: [
          ["Achat de beurre pour la pâte", "…"],
          ["Salaires des opérateurs de ligne", "…"],
          ["Loyer de l'usine", "…"],
          ["Dividendes versés aux associés", "…"],
          ["Électricité de production", "…"],
        ],
      },
    ],
    consigne:
      "Pour chaque ligne du tableau, réponds par « Oui (entre dans les CI) » ou « Non » et justifie en une courte phrase.",
    questions: ["Complète la colonne « justification » pour les cinq opérations."],
    correctionModele:
      "Beurre : Oui — matière transformée dans le produit.\n" +
      "Salaires : Non — la rémunération du travail entre dans la répartition de la valeur ajoutée, pas dans les CI.\n" +
      "Loyer : Oui — charge externe de fonctionnement nécessaire à la production.\n" +
      "Dividendes : Non — rémunération des actionnaires sur le résultat, pas un achat consommé pour fabriquer.\n" +
      "Électricité : Oui — énergie consommée pour faire tourner les lignes.",
    attendu: "Distinction CI / charges de répartition ou financier maîtrisée.",
  },
  {
    id: "sdgn11-e6",
    title: "Répartir la valeur ajoutée entre les acteurs",
    type: "Exercice",
    difficulty: "Moyen",
    xp: 210,
    minChars: 190,
    support:
      "Les acteurs bénéficiaires de la valeur ajoutée sont notamment : les salariés, l'État et organismes sociaux, les banques, l'entreprise elle-même (autofinancement, réserves), les actionnaires.",
    supportTables: [
      {
        title: "Répartition de la VA — Manufacture Delta (M€)",
        columns: ["Bénéficiaire", "Montant (M€)"],
        rows: [
          ["Salaires nets et charges sociales (ensemble)", "42"],
          ["Impôts et taxes (État)", "8"],
          ["Intérêts d'emprunts (banques)", "3"],
          ["Dotations aux amortissements et réserves (entreprise)", "15"],
          ["Résultat distribuable incluant dividendes (actionnaires)", "12"],
          ["Total VA", "80"],
        ],
      },
    ],
    consigne: "Analyse la répartition.",
    questions: [
      "Vérifie que la somme des montants égale bien la valeur ajoutée totale.",
      "Identifie qui reçoit la part la plus importante et ce que cela traduit sur le plan économique.",
      "Cite deux contreparties concrètes versées aux actionnaires et aux salariés selon le cours.",
    ],
    correctionModele:
      "42 + 8 + 3 + 15 + 12 = 80 M€ : la répartition couvre bien la VA.\n\n" +
      "La part la plus importante va aux salariés (42 M€) : la valeur créée rémunère avant tout le travail dans cette entreprise industrielle.\n\n" +
      "Actionnaires : dividendes et hausse potentielle de la valeur des actions.\n" +
      "Salariés : salaires et cotisations sociales couvrant protection sociale.",
    attendu: "Calcul de cohérence, lecture du tableau, contreparties du cours.",
  },
  {
    id: "sdgn11-e7",
    title: "Décisions de gestion et risque de conflit",
    type: "Exercice",
    difficulty: "Moyen",
    xp: 230,
    minChars: 200,
    support:
      "Le comité d'entreprise d'OptiLog conteste le projet de la direction d'augmenter le dividende de 12 % alors que la prime exceptionnelle aux salariés est gelée. Les actionnaires institutionnels souhaitent un rendement minimum pour rester investis.",
    consigne: "Mobilise la notion de dilemme du cours.",
    questions: [
      "Formule le dilemme entre rémunération des actionnaires et rémunération des salariés.",
      "Propose un arbitrage réaliste (sans chercher « la » bonne réponse unique) qui nomme explicitement les parties prenantes.",
    ],
    correctionModele:
      "1) Dilemme : augmenter les dividendes pour fidéliser les actionnaires et financer l'entreprise par capitaux propres risque de mécontenter les salariés et le CE ; augmenter les salaires ou primes améliore la motivation mais peut refroidir les investisseurs qui compareraient le rendement avec d'autres titres.\n\n" +
      "2) Exemple d'arbitrage : verser une partie modeste de la hausse de résultat en prime exceptionnelle limitée + maintenir une augmentation de dividende modérée (pas 12 %) ; communiquer sur un plan d'investissement équipement sécurisant l'emploi. On cherche un équilibre entre actionnaires, salariés et pérennité de l'entreprise.",
    attendu: "Dilemme bien posé, arbitrage argumenté et multicritère.",
  },
  {
    id: "sdgn11-e8",
    title: "Salariés actionnaires",
    type: "Exercice",
    difficulty: "Difficile",
    xp: 260,
    minChars: 220,
    support:
      "Daher Aero mise sur l'actionnariat salarial : les salariés peuvent souscrire à des actions à prix préférentiel. La direction espère renforcer l'adhésion aux objectifs de productivité.",
    consigne: "Explique le lien avec la répartition de la valeur et les conflits possibles.",
    questions: [
      "En quoi le fait de devenir actionnaire peut-il modifier la position des salariés dans la répartition de la valeur ajoutée ?",
      "Quel risque ou limite peux-tu mentionner si la valeur de l'action baisse fortement ?",
    ],
    correctionModele:
      "1) Le salarié cumule rémunération du travail (salaire) et rémunération du capital investi (dividendes, plus-value sur les actions). Il est à la fois partie prenante dans la négociation salariale et dans la logique de valeur actionnariale.\n\n" +
      "2) Si le cours s'effondre, le salarié peut voir son épargne salariale perdre de la valeur alors même que son emploi soit fragile : concentration du risque sur une même entité (double exposition).",
    attendu: "Double statut salarié/actionnaire, risque de concentration.",
  },
  {
    id: "sdgn11-e9",
    title: "Valeur actionnariale et valeur partenariale",
    type: "Exercice",
    difficulty: "Difficile",
    xp: 280,
    minChars: 240,
    support:
      "Le mode de gouvernance correspond aux règles qui déterminent comment l'entreprise est gérée et contrôlée. Selon ces règles, la valeur créée peut être interprétée prioritairement comme valeur actionnariale ou élargie en valeur partenariale.",
    consigne: "Définis et compares.",
    questions: [
      "Définis la valeur actionnariale et la valeur partenariale.",
      "Donne un exemple concret de geste qui illustre une logique « partenariale » avec un fournisseur (au-delà du simple paiement de facture).",
    ],
    correctionModele:
      "1) Valeur actionnariale : la valeur créée est pensée d'abord au service des actionnaires (dividendes, valorisation boursière, réinvestissement au service du rendement financier).\n" +
      "Valeur partenariale : la valeur résulte de la coopération de l'ensemble des parties prenantes (société, salariés, clients, fournisseurs, actionnaires) avec des relations durables et la confiance.\n\n" +
      "2) Exemple : co-conception d'un composant avec échange de données de production en temps réel, formation croisée des équipes, contrat long terme avec clause de partage des gains de productivité — va au-delà de l'échange marchand ponctuel.",
    attendu: "Définitions fidèles au cours, exemple partenarial précis.",
  },
  {
    id: "sdgn11-e10",
    title: "Concilier les deux logiques de valeur",
    type: "Exercice",
    difficulty: "Tres difficile",
    xp: 360,
    minChars: 300,
    support:
      "GreenGlass recycle le verre avec ses collectivités locales et ses clients industriels. Les actionnaires exigent une marge minimale ; les salariés demandent des investissements de sécurité coûteux ; les municipalités veulent des prix bas.",
    consigne: "Synthèse argumentée.",
    questions: [
      "Montre en quoi les attentes des différentes parties prenantes peuvent entrer en tension sur la répartition de la valeur créée.",
      "Explique comment une gouvernance « plus partenariale » (information, participation des salariés aux décisions) peut aussi servir la valeur actionnariale à moyen terme.",
    ],
    correctionModele:
      "1) Pression sur les prix publics vs besoin de marge pour les actionnaires vs coût des investissements sécurité pour les salariés : la VA à répartir est contrainte ; accorder une partie à un acteur en limite une autre.\n\n" +
      "2) Impliquer les salariés sur les décisions d'investissement peut réduire les conflits sociaux, améliorer la productivité et la qualité, diminuer l'absentéisme : ce sont des leviers de performance durable qui peuvent augmenter le résultat et la valorisation pour les actionnaires à horizon de quelques années.",
    attendu: "Tensions identifiables, lien participation / performance / valeur actionnariale.",
  },
  {
    id: "sdgn11-cas1",
    title: "Étude de cas : VertLift et la répartition de la VA",
    type: "Etude de cas",
    difficulty: "Tres difficile",
    xp: 560,
    minChars: 560,
    support:
      "VertLift conçoit des ascenseurs basse consommation. Exercice N : la direction annonce une forte hausse du résultat grâce aux aides publiques à la rénovation énergétique. Le syndicat réclame une redistribution massive via les salaires ; les fonds pensionnaires minoritaires menacent de vendre leur participation si le dividende ne croît pas.",
    supportTables: [
      {
        title: "Synthèse valeur ajoutée et répartition (M€)",
        columns: ["Rubrique", "Montant"],
        rows: [
          ["Chiffre d'affaires HT", "410"],
          ["Consommations intermédiaires", "235"],
          ["Valeur ajoutée", "175"],
          ["Salaires + charges sociales", "88"],
          ["Impôts et taxes", "15"],
          ["Intérêts bancaires", "7"],
          ["Autofinancement (amortissements, réserves)", "35"],
          ["Bénéfice net avant dividendes décidés", "30"],
        ],
      },
    ],
    consigne:
      "Rédige une copie structurée type dossier : définitions, calculs, analyse des conflits et proposition d'arbitrage réaliste.",
    questions: [
      "Vérifie le calcul de la valeur ajoutée à partir du tableau.",
      "Calcule la part relative des salaires dans la VA (en %, arrondi à une décimale).",
      "Identifie trois tensions distinctes entre parties prenantes à partir du texte et du tableau.",
      "Propose un plan d'arbitrage en deux ans qui associe progression salariale modérée et dividende minimum acceptable.",
      "Dis si cette situation relève davantage, à court terme, d'une logique de valeur actionnariale ou partenariale dans les annonces actuelles ; argumente.",
    ],
    correctionModele:
      "1) VA = 410 − 235 = 175 M€ ✓ (cohérent avec la ligne VA du tableau).\n\n" +
      "2) Part salaires dans VA = 88 / 175 ≈ 50,3 %.\n\n" +
      "3) Tensions : rémunération du travail (revendications syndicales) vs exigence de dividendes des investisseurs ; arbitrage entre garder des marges pour autofinancement / investissements (35 M€) et augmenter salaires ou dividendes ; enjeu avec l'État si les aides publiques sont liées au maintien des emplois ou à des contreparties.\n\n" +
      "4) Exemple : année 1 — prime exceptionnelle limitée + dividende symbolique en hausse modérée ; année 2 — clause salaire indexée sur productivité si objectifs atteints + engagement public sur l'emploi pour rassurer les aides.\n\n" +
      "5) À court terme les annonces font primer la performance financière (résultat, dividendes attendus par fonds) : logique proche de la valeur actionnariale ; pour autant la présence syndicale et les aides publiques appellent une légitimité partenariale sur la répartition.",
    attendu: "Calculs exacts, trois tensions claires, arbitrage crédible, distinction des deux valeurs argumentée.",
  },
  {
    id: "sdgn11-cas2",
    title: "Étude de cas : Alliance Fromagerie × Grande distribution",
    type: "Etude de cas",
    difficulty: "Tres difficile",
    xp: 620,
    minChars: 620,
    support:
      "La fromagerie Les Alpages et l'enseigne Carrefour Bio (fictif) signent un accord-cadre trois ans : prévisions de volumes partagées, logiciel commun de traçabilité, réunions mensuelles conjointes pour ajuster les promotions. Les agriculteurs fournisseurs de lait sont informés en amont des volumes prévus.",
    consigne: "Mobilise valeur partenariale, parties prenantes et lien avec la création de valeur.",
    questions: [
      "Explique en quoi cet accord dépasse une simple relation acheteur-vendeur ponctuelle.",
      "Identifie au moins quatre parties prenantes concernées et ce qu'elles y gagnent potentiellement.",
      "Analyse un risque résiduel pour la fromagerie si la grande distribution impose brutalement une baisse de prix.",
      "Montre comment une meilleure coordination peut augmenter la valeur ajoutée globale de la chaîne (sans calcul numérique obligatoire).",
      "Propose une mesure de gouvernance interne (chez Les Alpages) qui rapproche valeur partenariale et intérêt des actionnaires familiaux.",
    ],
    correctionModele:
      "1) Au-delà du prix et de la quantité, il y a partage d'informations (prévisions, traçabilité), coordination temporelle et objectifs communs sur plusieurs exercices : caractéristiques du partenariat.\n\n" +
      "2) Fromagerie : volumes réguliers ; Grande distribution : réassort fiable et image qualité ; Agriculteurs : visibilité sur la collecte ; Consommateurs : disponibilité et traçabilité ; Actionnaires familiaux : réduction du risque commercial.\n\n" +
      "3) Risque : dépendance au distributeur, pression sur les prix sans contrepartie si la balance de pouvoir est déséquilibrée ; effacement de la marge qui réduit la VA distribuable côté producteur.\n\n" +
      "4) Moins de ruptures, moins de stocks invendus, meilleure planification : les CI et pertes peuvent baisser pour la chaîne, ce qui augmente la richesse créée pour un même prix final ou permet des prix plus attractifs tout en préservant les marges.\n\n" +
      "5) Exemple : instance paritaire interne (salariés + famille actionnaire) sur les volumes et prix acceptés dans les accords-cadre ; transparence sur la marge pour éviter les conflits internes lors des négociations commerciales.",
    attendu: "Analyse partenariale riche, quatre parties prenantes minimum, risque et création de valeur chaîne, mesure de gouvernance réaliste.",
  },
];

const getTodayKey = () => {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
};

const normalize = (value = "") =>
  String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

const getScoreMood = (score: number) => {
  if (score >= 9) return { emoji: "🤯", text: "Niveau génie", color: "#166534" };
  if (score >= 8) return { emoji: "🔥", text: "Excellent", color: "#166534" };
  if (score >= 7) return { emoji: "😎", text: "Très solide", color: "#1D4ED8" };
  if (score >= 6) return { emoji: "🙂", text: "Bon travail", color: "#0369A1" };
  if (score >= 5) return { emoji: "🧐", text: "Correct mais perfectible", color: "#B45309" };
  if (score >= 3) return { emoji: "😅", text: "On continue, tu progresses", color: "#B45309" };
  return { emoji: "💪", text: "Ne rien lâcher", color: "#B91C1C" };
};

const formatDifficultyLabel = (d: MissionExercise["difficulty"]) => (d === "Tres difficile" ? "Très difficile" : d);

const DIFFICULTY_STYLE: Record<
  MissionExercise["difficulty"],
  { stripe: string; headerBg: string; badgeBg: string; badgeText: string }
> = {
  Facile: { stripe: "#059669", headerBg: "#ecfdf5", badgeBg: "#d1fae5", badgeText: "#064e3b" },
  Moyen: { stripe: "#ca8a04", headerBg: "#fffbeb", badgeBg: "#fef3c7", badgeText: "#78350f" },
  Difficile: { stripe: "#e11d48", headerBg: "#fff1f2", badgeBg: "#fecdd3", badgeText: "#881337" },
  "Tres difficile": { stripe: "#6366f1", headerBg: "#eef2ff", badgeBg: "#e0e7ff", badgeText: "#312e81" },
};

const formatExerciseTypeLabel = (t: MissionExercise["type"]) => (t === "Etude de cas" ? "Étude de cas" : t);

export default function Missions({ profil, onXPGagne }: MissionsProps) {
  const { xpRewardsSuspended } = usePlatformIntegrity();
  const niveauxAccessibles = useMemo(
    () => (profil?.classe === "terminale" ? (["premiere", "terminale"] as const) : (["premiere"] as const)),
    [profil?.classe]
  );
  const peutChoisirClasse = profil?.role === "admin" || profil?.classe === "terminale";

  const [niveauSelectionne, setNiveauSelectionne] = useState<"premiere" | "terminale">(
    profil?.classe === "terminale" ? "terminale" : "premiere"
  );
  const [matiereSelectionnee, setMatiereSelectionnee] = useState<string>(MATIERES_MISSIONS[0].matiere);
  const [chapitres, setChapitres] = useState<ChapitreRow[]>([]);
  const [chapitreIdSelectionne, setChapitreIdSelectionne] = useState<string>("");
  const [chargementChapitres, setChargementChapitres] = useState(false);
  const [claims, setClaims] = useState<Record<string, { lastClaimDate?: string; totalClaims?: number }>>({});
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [evaluations, setEvaluations] = useState<Record<string, MissionEvalResult>>({});
  const [uiMessage, setUiMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [savingId, setSavingId] = useState("");

  useEffect(() => {
    const def = profil?.classe === "terminale" ? "terminale" : "premiere";
    if (!niveauxAccessibles.includes(niveauSelectionne)) {
      setNiveauSelectionne(def);
    }
  }, [profil?.classe, niveauxAccessibles, niveauSelectionne]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setChargementChapitres(true);
      setChapitreIdSelectionne("");
      try {
        const q = query(
          collection(db, "chapitres"),
          where("matiere", "==", matiereSelectionnee),
          where("classe", "==", niveauSelectionne),
          orderBy("ordre")
        );
        const snap = await getDocs(q);
        const rows: ChapitreRow[] = snap.docs.map((d) => ({ id: d.id, ...d.data() } as ChapitreRow));
        if (!cancelled) {
          setChapitres(rows);
          if (rows.length) setChapitreIdSelectionne(rows[0].id);
        }
      } catch (e) {
        console.error(e);
        if (!cancelled) setChapitres([]);
      } finally {
        if (!cancelled) setChargementChapitres(false);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [matiereSelectionnee, niveauSelectionne]);

  useEffect(() => {
    const loadClaims = async () => {
      const user = auth.currentUser;
      if (!user) return;
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (!snap.exists()) return;
        const raw = snap.data()?.missionsProgress || {};
        const nextClaims = raw?.version === MISSIONS_PROGRESS_VERSION ? (raw.claims || {}) : {};
        setClaims(nextClaims);
      } catch (err) {
        console.error("Chargement progression missions impossible", err);
      }
    };
    void loadClaims();
  }, []);

  const chapitreActif = chapitres.find((c) => c.id === chapitreIdSelectionne) ?? null;
  const isSdgnChap7 = useMemo(() => {
    if (matiereSelectionnee !== "Sciences de Gestion") return false;
    if (!chapitreActif) return false;
    const byOrdre = chapitreActif.ordre === 7;
    const titreNorm = normalize(chapitreActif.titre || "");
    const byTitle = titreNorm.includes("chapitre 7") || titreNorm.startsWith("7");
    return byOrdre || byTitle;
  }, [chapitreActif, matiereSelectionnee]);
  const isSdgnChap10 = useMemo(() => {
    if (matiereSelectionnee !== "Sciences de Gestion") return false;
    if (!chapitreActif) return false;
    const byOrdre = chapitreActif.ordre === 10;
    const titreNorm = normalize(chapitreActif.titre || "");
    const byTitle = titreNorm.includes("chapitre 10") || titreNorm.startsWith("10");
    return byOrdre || byTitle;
  }, [chapitreActif, matiereSelectionnee]);
  const isSdgnChap11 = useMemo(() => {
    if (matiereSelectionnee !== "Sciences de Gestion") return false;
    if (!chapitreActif) return false;
    const byOrdre = chapitreActif.ordre === 11;
    const titreNorm = normalize(chapitreActif.titre || "");
    const byTitle = titreNorm.includes("chapitre 11") || titreNorm.startsWith("11");
    return byOrdre || byTitle;
  }, [chapitreActif, matiereSelectionnee]);
  const hasSdgnMissionPack = isSdgnChap7 || isSdgnChap10 || isSdgnChap11;
  const sdgnProgressChapterLabel = useMemo(() => {
    if (isSdgnChap7) return "SDGN Chapitre 7";
    if (isSdgnChap10) return "SDGN Chapitre 10";
    if (isSdgnChap11) return "SDGN Chapitre 11";
    return "SDGN";
  }, [isSdgnChap7, isSdgnChap10, isSdgnChap11]);
  const sdgnPackExercises = useMemo(() => {
    if (isSdgnChap7) return SDGN_CHAP7_EXERCISES;
    if (isSdgnChap10) return SDGN_CHAP10_EXERCISES;
    if (isSdgnChap11) return SDGN_CHAP11_EXERCISES;
    return [];
  }, [isSdgnChap7, isSdgnChap10, isSdgnChap11]);
  const potentialXP = useMemo(() => sdgnPackExercises.reduce((sum, ex) => sum + ex.xp, 0), [sdgnPackExercises]);

  const evaluateAndClaimXP = async (exercise: MissionExercise) => {
    const user = auth.currentUser;
    if (!user) {
      setUiMessage({ type: "error", text: "Session expirée. Reconnecte-toi pour valider tes jetons." });
      return;
    }
    const text = (answers[exercise.id] || "").trim();
    if (text.length < exercise.minChars) {
      setUiMessage({
        type: "error",
        text: `Réponse trop courte pour « ${exercise.title} » (${exercise.minChars} caractères minimum).`,
      });
      return;
    }
    if (xpRewardsSuspended) {
      setUiMessage({ type: "error", text: PLATFORM_XP_BLOCKED_MESSAGE });
      return;
    }

    setSavingId(exercise.id);
    try {
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        setUiMessage({ type: "error", text: "Profil introuvable." });
        return;
      }
      const data = snap.data();
      const stored = data.missionsProgress || {};
      const prevClaims = stored?.version === MISSIONS_PROGRESS_VERSION ? (stored.claims || {}) : {};
      const prevEntry = prevClaims[exercise.id];
      const entrainementSansXp = (prevEntry?.totalClaims ?? 0) >= 1;
      const today = getTodayKey();

      const local = localCorrectionMissions(exercise, text);
      const prompt = buildMissionsAIPrompt(exercise, text);
      let ai = null;
      try {
        ai = await callGeminiCorrection(prompt);
        if (!ai) ai = await callGroqCorrection(prompt);
      } catch {
        ai = null;
      }
      const reliable = buildReliableMissionsEvaluation(local, ai, exercise);
      const score = reliable.score;
      const pourcentageBrute = Math.max(0, Math.min(100, Math.round(score * 10)));
      const xpBrute = Math.round((exercise.xp * pourcentageBrute) / 100);
      const xpAccordee = entrainementSansXp ? 0 : xpBrute;
      const pourcentageXP = entrainementSansXp ? 0 : pourcentageBrute;

      const nextClaims = {
        ...prevClaims,
        [exercise.id]: {
          lastClaimDate: today,
          totalClaims: (prevEntry?.totalClaims || 0) + 1,
        },
      };
      await updateDoc(ref, {
        xp: (data.xp || 0) + xpAccordee,
        missionsProgress: {
          ...(stored || {}),
          version: MISSIONS_PROGRESS_VERSION,
          chapter: sdgnProgressChapterLabel,
          claims: {
            ...nextClaims,
            [exercise.id]: {
              ...(nextClaims[exercise.id] || {}),
              lastScore: score,
              lastPercent: pourcentageBrute,
              lastXpAwarded: xpAccordee,
            },
          },
        },
      });
      setClaims(nextClaims);
      setEvaluations((prev) => ({
        ...prev,
        [exercise.id]: {
          score,
          pourcentageXP,
          xpAccordee,
          feedback: reliable.feedback,
          analyseDeveloppee: reliable.analyseDeveloppee,
          pointsForts: reliable.pointsForts,
          pointsFaibles: reliable.pointsFaibles,
          conseilsProgression: reliable.conseilsProgression,
          propositionReponse: reliable.propositionReponse,
          source: reliable.source,
          entrainementSansXp,
        },
      }));
      setUiMessage({
        type: "success",
        text: entrainementSansXp
          ? `Correction terminée : ${score}/10. Entraînement : les jetons ne sont comptés qu'une fois par exercice (${formatJetons(0)} cette fois).`
          : `Correction terminée : ${score}/10 → ${pourcentageBrute}% de la récompense mission, soit ${formatJetonsDelta(xpAccordee)}.`,
      });
      if (onXPGagne && xpAccordee > 0) onXPGagne();
    } catch (err) {
      console.error("Validation jetons mission impossible", err);
      setUiMessage({ type: "error", text: "Validation impossible pour le moment." });
    } finally {
      setSavingId("");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#0b1220 0%,#111827 40%,#1e293b 100%)", fontFamily: "'Nunito', sans-serif" }}>
      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "24px 16px 48px" }}>
        <div
          style={{
            background: "linear-gradient(145deg,#0f172a 0%,#1e293b 55%,#334155 100%)",
            borderRadius: "16px",
            padding: "24px 26px",
            marginBottom: "22px",
            border: "1px solid #475569",
            boxShadow: "0 4px 24px rgba(15,23,42,0.35)",
          }}
        >
          <h1 style={{ fontFamily: "'Fredoka One', cursive", fontSize: "2.1rem", color: "#f8fafc", margin: "0 0 8px", letterSpacing: "0.02em" }}>
            Missions
          </h1>
          <p style={{ color: "#cbd5e1", margin: 0, fontSize: "0.95rem", fontWeight: 600, lineHeight: 1.5 }}>
            Choisis le niveau, la matière puis le chapitre (même arborescence que l'onglet Chapitres).
          </p>
        </div>

        <div
          style={{
            background: "#ffffff",
            borderRadius: "14px",
            border: "1px solid #e2e8f0",
            padding: "16px",
            marginBottom: "18px",
            boxShadow: "0 1px 3px rgba(15,23,42,0.06)",
          }}
        >
          <p style={{ fontFamily: "'Fredoka One', cursive", color: "#0f172a", fontSize: "1.05rem", margin: "0 0 14px" }}>Filtres</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
            <div style={{ borderRadius: "12px", border: "1px solid #e2e8f0", padding: "10px 12px", background: "#f8fafc" }}>
              <p style={{ fontFamily: "'Fredoka One', cursive", color: "#0369a1", fontSize: "0.78rem", margin: "0 0 6px" }}>
                Niveau
              </p>
              {peutChoisirClasse ? (
                <select
                  value={niveauSelectionne}
                  onChange={(e) => setNiveauSelectionne(e.target.value as "premiere" | "terminale")}
                  style={{
                    width: "100%",
                    border: "1px solid #cbd5e1",
                    borderRadius: "10px",
                    padding: "8px 10px",
                    fontFamily: "'Nunito', sans-serif",
                    fontWeight: 700,
                    color: "#0f172a",
                    background: "white",
                  }}
                >
                  {niveauxAccessibles.map((nv) => (
                    <option key={nv} value={nv}>
                      {nv === "terminale" ? "Terminale STMG" : "Première STMG"}
                    </option>
                  ))}
                </select>
              ) : (
                <p style={{ margin: 0, fontWeight: 700, color: "#1F2937" }}>Première STMG</p>
              )}
            </div>

            <div style={{ borderRadius: "12px", border: "1px solid #e2e8f0", padding: "10px 12px", background: "#f8fafc" }}>
              <p style={{ fontFamily: "'Fredoka One', cursive", color: "#475569", fontSize: "0.78rem", margin: "0 0 6px" }}>
                Matière
              </p>
              <select
                value={matiereSelectionnee}
                onChange={(e) => setMatiereSelectionnee(e.target.value)}
                style={{
                  width: "100%",
                  border: "1px solid #cbd5e1",
                  borderRadius: "10px",
                  padding: "8px 10px",
                  fontFamily: "'Nunito', sans-serif",
                  fontWeight: 700,
                  color: "#0f172a",
                  background: "white",
                }}
              >
                {MATIERES_MISSIONS.map((m) => (
                  <option key={m.matiere} value={m.matiere}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ borderRadius: "12px", border: "1px solid #e2e8f0", padding: "10px 12px", background: "#f8fafc" }}>
              <p style={{ fontFamily: "'Fredoka One', cursive", color: "#15803d", fontSize: "0.78rem", margin: "0 0 6px" }}>
                Chapitre
              </p>
              <select
                value={chapitreIdSelectionne}
                onChange={(e) => setChapitreIdSelectionne(e.target.value)}
                disabled={chargementChapitres || chapitres.length === 0}
                style={{
                  width: "100%",
                  border: "1px solid #cbd5e1",
                  borderRadius: "10px",
                  padding: "8px 10px",
                  fontFamily: "'Nunito', sans-serif",
                  fontWeight: 700,
                  color: "#0f172a",
                  background: "white",
                  opacity: chargementChapitres || chapitres.length === 0 ? 0.6 : 1,
                }}
              >
                {chapitres.length === 0 && !chargementChapitres ? (
                  <option value="">Aucun chapitre pour ce couple niveau / matière</option>
                ) : (
                  chapitres.map((ch) => (
                    <option key={ch.id} value={ch.id}>
                      Chap. {ch.ordre ?? "?"} — {ch.titre || ch.id}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>
        </div>

        <div
          style={{
            textAlign: "center",
            padding: "22px",
            background: "#ffffff",
            borderRadius: "14px",
            border: hasSdgnMissionPack ? "1px solid #cbd5e1" : "1px dashed #94a3b8",
            boxShadow: hasSdgnMissionPack ? "0 1px 3px rgba(15,23,42,0.06)" : "none",
          }}
        >
          {!hasSdgnMissionPack ? (
            <>
              <p style={{ fontFamily: "'Fredoka One', cursive", fontSize: "1.4rem", color: "#0f172a", margin: "0 0 12px" }}>
                Exercices à venir
              </p>
              <p
                style={{
                  color: "#334155",
                  fontSize: "0.98rem",
                  margin: 0,
                  maxWidth: "560px",
                  marginLeft: "auto",
                  marginRight: "auto",
                  fontWeight: 600,
                  lineHeight: 1.55,
                }}
              >
                Sélectionne SDGN et le chapitre 7, 10 ou 11 pour afficher les 10 exercices progressifs et 2 études de cas à fort potentiel de jetons.
              </p>
            </>
          ) : (
            <div style={{ textAlign: "left" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px", flexWrap: "wrap", marginBottom: "8px" }}>
                <p style={{ fontFamily: "'Fredoka One', cursive", fontSize: "1.35rem", color: "#0f172a", margin: 0, letterSpacing: "0.02em" }}>
                  {isSdgnChap7
                    ? "SDGN — Chapitre 7 : missions complètes"
                    : isSdgnChap10
                      ? "SDGN — Chapitre 10 : missions complètes"
                      : "SDGN — Chapitre 11 : missions complètes"}
                </p>
                <span
                  style={{
                    background: "#f1f5f9",
                    color: "#0f172a",
                    borderRadius: 999,
                    padding: "7px 12px",
                    fontWeight: 800,
                    fontSize: 13,
                    border: "1px solid #cbd5e1",
                  }}
                >
                  Potentiel : {formatJetonsDelta(potentialXP)}
                </span>
              </div>
              <p style={{ margin: "0 0 14px", fontSize: "0.88rem", color: "#64748b", fontWeight: 600, lineHeight: 1.45 }}>
                {isSdgnChap7
                  ? "Progression en trois blocs : collaboration avec le numérique, environnement numérique en organisation, intelligence collective et IA."
                  : isSdgnChap10
                    ? "Progression en trois blocs : compte de résultat, bilan et valeur patrimoniale, valeur boursière et répartition de la valeur."
                    : "Progression en trois blocs : facteurs de production et chiffre d'affaires, valeur ajoutée et répartition, valeur actionnariale et valeur partenariale."}
              </p>
              <p style={{ color: "#475569", margin: "0 0 14px", fontSize: "0.94rem", fontWeight: 600 }}>
                Anti-triche : copier-coller, menu contextuel et glisser-déposer bloqués sur les réponses ; changer
                d&apos;onglet ou mettre une autre fenêtre au premier plan bloque les jetons jusqu&apos;à ce que ton professeur
                rétablisse ton accès depuis l&apos;admin (un simple rechargement ne suffit pas). Rester sur cet onglet sans
                rien faire ne compte pas comme triche.
              </p>
              {chapitreActif && (
                <div
                  style={{
                    marginBottom: 16,
                    borderRadius: 12,
                    padding: "14px 16px",
                    border: "1px solid #cbd5e1",
                    background: "#f8fafc",
                    color: "#0f172a",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "'Fredoka One', cursive",
                      fontSize: "1rem",
                      margin: "0 0 12px",
                      color: "#0f172a",
                      borderLeft: "4px solid #0d9488",
                      paddingLeft: 10,
                    }}
                  >
                    Référentiel du chapitre (commun à toutes les missions)
                  </p>
                  {chapitreActif.question?.trim() ? (
                    <div style={{ marginBottom: 12 }}>
                      <p style={{ fontFamily: "'Fredoka One', cursive", margin: "0 0 6px", fontWeight: 700, color: "#0f766e", fontSize: "0.88rem" }}>
                        Question de gestion
                      </p>
                      <p style={{ margin: 0, fontWeight: 600, lineHeight: 1.55, fontSize: "0.95rem", color: "#334155" }}>{chapitreActif.question.trim()}</p>
                    </div>
                  ) : null}
                  {chapitreActif.competences && chapitreActif.competences.length > 0 ? (
                    <div style={{ marginBottom: 12 }}>
                      <p style={{ fontFamily: "'Fredoka One', cursive", margin: "0 0 6px", fontWeight: 700, color: "#0f766e", fontSize: "0.88rem" }}>
                        Compétences (à articuler avec la QdG)
                      </p>
                      <ul style={{ margin: 0, paddingLeft: 22, fontWeight: 600, lineHeight: 1.5, color: "#334155", fontSize: "0.93rem" }}>
                        {chapitreActif.competences.map((c, i) => (
                          <li key={`${chapitreActif.id}-c-${i}`}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  {chapitreActif.notions && chapitreActif.notions.length > 0 ? (
                    <div>
                      <p style={{ fontFamily: "'Fredoka One', cursive", margin: "0 0 6px", fontWeight: 700, color: "#0f766e", fontSize: "0.88rem" }}>
                        Notions
                      </p>
                      <p style={{ margin: 0, fontWeight: 600, lineHeight: 1.55, fontSize: "0.93rem", color: "#334155" }}>
                        {chapitreActif.notions.join(" · ")}
                      </p>
                    </div>
                  ) : (
                    <p style={{ margin: 0, fontWeight: 600, color: "#64748b", fontSize: "0.92rem" }}>
                      Aucune notion ou compétence importée sur ce chapitre dans Firestore : complète l'import côté admin pour enrichir le référentiel.
                    </p>
                  )}
                </div>
              )}
              {uiMessage && (
                <div
                  style={{
                    marginBottom: 12,
                    borderRadius: 10,
                    padding: "10px 12px",
                    fontWeight: 800,
                    border: `1px solid ${uiMessage.type === "success" ? "#86efac" : "#fca5a5"}`,
                    color: uiMessage.type === "success" ? "#14532d" : "#991b1b",
                    background: uiMessage.type === "success" ? "#ecfdf5" : "#fef2f2",
                  }}
                >
                  {uiMessage.text}
                </div>
              )}
              <div style={{ display: "grid", gap: "16px" }}>
                {sdgnPackExercises.map((exercise, index) => {
                  const answer = answers[exercise.id] || "";
                  const evalResult = evaluations[exercise.id];
                  const mood = evalResult ? getScoreMood(evalResult.score) : null;
                  const xpDejaAccorde = (claims[exercise.id]?.totalClaims ?? 0) > 0;
                  const canClaim = answer.trim().length >= exercise.minChars && savingId !== exercise.id;
                  const diffStyle = DIFFICULTY_STYLE[exercise.difficulty];
                  const isCas = exercise.type === "Etude de cas";
                  return (
                    <article
                      key={exercise.id}
                      style={{
                        background: "#ffffff",
                        border: "1px solid #e2e8f0",
                        borderLeft: `4px solid ${diffStyle.stripe}`,
                        borderRadius: 12,
                        padding: 0,
                        overflow: "hidden",
                        boxShadow: "0 1px 3px rgba(15,23,42,0.08)",
                      }}
                    >
                      <div
                        style={{
                          background: diffStyle.headerBg,
                          padding: "10px 14px",
                          borderBottom: "1px solid #e2e8f0",
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 8,
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
                          <span
                            style={{
                              background: "#ffffff",
                              color: "#0f172a",
                              borderRadius: 8,
                              padding: "5px 10px",
                              fontWeight: 800,
                              fontSize: 12,
                              fontFamily: "'Fredoka One', cursive",
                              border: "1px solid #cbd5e1",
                            }}
                          >
                            {index + 1}. {formatExerciseTypeLabel(exercise.type)}
                          </span>
                          <span
                            style={{
                              background: diffStyle.badgeBg,
                              color: diffStyle.badgeText,
                              borderRadius: 8,
                              padding: "5px 10px",
                              fontWeight: 800,
                              fontSize: 12,
                              border: "1px solid rgba(15,23,42,0.12)",
                            }}
                          >
                            {formatDifficultyLabel(exercise.difficulty)}
                          </span>
                          <span
                            style={{
                              background: isCas ? "#ffe4e6" : "#f1f5f9",
                              color: "#334155",
                              borderRadius: 8,
                              padding: "5px 10px",
                              fontWeight: 800,
                              fontSize: 12,
                              border: "1px solid #cbd5e1",
                            }}
                          >
                            {formatJetonsDelta(exercise.xp)}
                          </span>
                        </div>
                      </div>
                      <div style={{ padding: "16px 16px 18px" }}>
                        <p style={{ margin: "0 0 12px", fontWeight: 800, color: "#0f172a", fontSize: "1.05rem", fontFamily: "'Fredoka One', cursive", lineHeight: 1.35 }}>
                          {exercise.title}
                        </p>
                        <div style={{ margin: "0 0 14px" }}>
                          <p style={{ margin: "0 0 6px", fontFamily: "'Fredoka One', cursive", fontWeight: 700, color: "#475569", fontSize: "0.82rem", letterSpacing: "0.03em" }}>
                            CONSIGNE
                          </p>
                          <p style={{ margin: 0, color: "#1e293b", lineHeight: 1.6, fontWeight: 500, fontSize: "0.98rem" }}>{exercise.consigne}</p>
                        </div>
                        {(exercise.support || (exercise.supportTables && exercise.supportTables.length > 0)) && (
                          <div
                            style={{
                              margin: "0 0 14px",
                              color: "#1e293b",
                              lineHeight: 1.6,
                              background: "#fffbeb",
                              border: "1px solid #fcd34d",
                              borderRadius: 10,
                              padding: "12px 14px",
                            }}
                          >
                            <p style={{ margin: "0 0 6px", fontFamily: "'Fredoka One', cursive", fontWeight: 700, color: "#b45309", fontSize: "0.82rem" }}>SUPPORT</p>
                            {exercise.support ? (
                              <p style={{ margin: 0, fontWeight: 500, fontSize: "0.96rem", whiteSpace: "pre-wrap" }}>{exercise.support}</p>
                            ) : null}
                            {exercise.supportTables && exercise.supportTables.length > 0 ? (
                              <MissionSupportTables tables={exercise.supportTables} />
                            ) : null}
                          </div>
                        )}
                        {exercise.questions && exercise.questions.length > 0 && (
                          <div style={{ margin: "0 0 14px" }}>
                            <p
                              style={{
                                margin: "0 0 10px",
                                fontFamily: "'Fredoka One', cursive",
                                fontWeight: 700,
                                fontSize: "0.95rem",
                                color: "#0f172a",
                              }}
                            >
                              Questions à traiter
                            </p>
                            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                              {exercise.questions.map((question, qi) => (
                                <div
                                  key={`${exercise.id}-q-${qi}`}
                                  style={{
                                    background: "#ffffff",
                                    border: "1px solid #e2e8f0",
                                    borderRadius: 10,
                                    padding: "12px 14px",
                                    borderLeft: "4px solid #0d9488",
                                    boxShadow: "0 1px 2px rgba(15,23,42,0.04)",
                                  }}
                                >
                                  <p
                                    style={{
                                      margin: 0,
                                      fontSize: "0.78rem",
                                      fontWeight: 800,
                                      color: "#0f766e",
                                      letterSpacing: "0.04em",
                                      textTransform: "uppercase",
                                    }}
                                  >
                                    Question {qi + 1}
                                  </p>
                                  <p style={{ margin: "8px 0 0", fontWeight: 500, fontSize: "0.97rem", color: "#1e293b", lineHeight: 1.55 }}>
                                    {question}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        <p
                          style={{
                            margin: "0 0 10px",
                            padding: "10px 12px",
                            borderRadius: 10,
                            border: "1px solid #99f6e4",
                            background: "linear-gradient(135deg, #f0fdfa 0%, #ecfeff 100%)",
                            color: "#115e59",
                            fontSize: "0.88rem",
                            fontWeight: 600,
                            lineHeight: 1.5,
                          }}
                        >
                          <span style={{ fontFamily: "'Fredoka One', cursive", fontWeight: 700, color: "#0f766e" }}>Rédaction</span>
                          {" — "}
                          Nomme les notions du cours (valeur ajoutée, consommations intermédiaires, parties prenantes, etc.) et relie les chiffres à ton raisonnement :
                          comme sur une copie papier ou au bac, quelques phrases claires valent mieux qu’un bloc de chiffres seuls — et la correction automatique
                          suit mieux ton travail.
                        </p>
                        <ProtectedTextarea
                          value={answer}
                          onChange={(e) => setAnswers((prev) => ({ ...prev, [exercise.id]: e.target.value }))}
                          placeholder="Écris ta réponse ici…"
                          enableProtection
                          onBlockedAction={() =>
                            setUiMessage({
                              type: "error",
                              text: "Action bloquée : anti-triche active sur cette zone.",
                            })
                          }
                          style={{
                            width: "100%",
                            minHeight: 130,
                            borderRadius: 10,
                            border: "1px solid #cbd5e1",
                            padding: "12px",
                            resize: "vertical",
                            boxSizing: "border-box",
                            fontFamily: "'Nunito', sans-serif",
                            fontWeight: 500,
                            fontSize: "0.98rem",
                            lineHeight: 1.55,
                          }}
                        />
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
                          <p style={{ margin: 0, color: "#64748b", fontSize: 12, fontWeight: 600 }}>
                            {answer.trim().length} caractères / {exercise.minChars} minimum
                          </p>
                          <button
                            type="button"
                            onClick={() => void evaluateAndClaimXP(exercise)}
                            disabled={!canClaim}
                            style={{
                              border: "1px solid #0f766e",
                              borderRadius: 10,
                              padding: "10px 16px",
                              fontWeight: 800,
                              cursor: canClaim ? "pointer" : "not-allowed",
                              background: canClaim ? "#0d9488" : "#cbd5e1",
                              color: canClaim ? "#ffffff" : "#64748b",
                              fontFamily: "'Nunito', sans-serif",
                              fontSize: "0.95rem",
                            }}
                          >
                            {savingId === exercise.id
                              ? "Correction…"
                              : xpDejaAccorde
                                ? "Corriger (sans jetons)"
                                : "Corriger et valider les jetons"}
                          </button>
                        </div>
                        {xpDejaAccorde && (
                          <p style={{ margin: "10px 0 0", fontSize: 12, fontWeight: 600, color: "#64748b" }}>
                            Tu as déjà obtenu les jetons pour cet exercice : chaque nouvelle correction compte comme entraînement ({formatJetons(0)}).
                          </p>
                        )}
                        {evalResult && (
                          <div
                            style={{
                              marginTop: 14,
                              background: "#f8fafc",
                              border: "1px solid #cbd5e1",
                              borderLeft: "4px solid #0d9488",
                              borderRadius: 10,
                              padding: 14,
                            }}
                          >
                            <p style={{ margin: "0 0 6px", color: "#0f172a", fontWeight: 800, fontFamily: "'Fredoka One', cursive", fontSize: "0.98rem" }}>
                              Résultat : {evalResult.score}/10
                              {evalResult.entrainementSansXp
                                ? ` — entraînement (${formatJetons(0)})`
                                : ` — ${Math.max(0, Math.min(100, Math.round(evalResult.score * 10)))}% de la récompense mission → ${formatJetonsDelta(evalResult.xpAccordee)}`}
                            </p>
                            {mood && (
                              <p style={{ margin: "0 0 8px", color: mood.color, fontWeight: 800, fontSize: "1.2rem" }}>
                                {mood.emoji} {mood.text}
                              </p>
                            )}
                            <p style={{ margin: "0 0 6px", color: "#166534", fontWeight: 600 }}>
                              <strong>Points + :</strong> {evalResult.pointsForts}
                            </p>
                            <p style={{ margin: "0 0 6px", color: "#b45309", fontWeight: 600 }}>
                              <strong>Points − :</strong> {evalResult.pointsFaibles}
                            </p>
                            <p style={{ margin: "0 0 8px", color: "#334155", fontWeight: 500, lineHeight: 1.55 }}>
                              <strong>Synthèse :</strong> {evalResult.feedback}
                            </p>
                            {evalResult.analyseDeveloppee ? (
                              <p style={{ margin: "0 0 8px", color: "#334155", whiteSpace: "pre-wrap", lineHeight: 1.55, fontWeight: 500 }}>
                                <strong style={{ fontFamily: "'Fredoka One', cursive", color: "#0f172a" }}>Analyse détaillée</strong>
                                {"\n"}
                                {evalResult.analyseDeveloppee}
                              </p>
                            ) : null}
                            {evalResult.conseilsProgression ? (
                              <p style={{ margin: "0 0 10px", color: "#334155", whiteSpace: "pre-wrap", lineHeight: 1.55, fontWeight: 500 }}>
                                <strong style={{ fontFamily: "'Fredoka One', cursive", color: "#0f172a" }}>Conseils</strong>
                                {"\n"}
                                {evalResult.conseilsProgression}
                              </p>
                            ) : null}
                            <div style={{ background: "#ecfdf5", border: "1px solid #86efac", borderRadius: 8, padding: 12 }}>
                              <p style={{ margin: "0 0 6px", color: "#14532d", fontWeight: 800, fontFamily: "'Fredoka One', cursive", fontSize: "0.9rem" }}>
                                Réponse proposée (à noter au cahier)
                              </p>
                              <p style={{ margin: 0, color: "#166534", whiteSpace: "pre-wrap", lineHeight: 1.55, fontWeight: 500 }}>
                                {evalResult.propositionReponse}
                              </p>
                            </div>
                            <p style={{ margin: "8px 0 0", fontSize: 12, color: "#64748b", fontWeight: 600 }}>
                              Source : {evalResult.source === "ai" ? "IA + garde-fous locaux" : "Correction locale"}
                            </p>
                          </div>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
