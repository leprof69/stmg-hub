import * as XLSX from "xlsx";
import {
  buildDsSdgnClassReport,
  formatDsDisplayStatusLabel,
  formatDsGradeForReport,
  formatDsTopicAcquisLabel,
  type DsSdgnClassReport,
} from "./adminDsSdgnReport";
import { DS_SDGN_TOPIC_LABELS, DS_SDGN_TOPIC_ORDER } from "./dsSdgnQcmTopics";

function formatFrDate(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function topicCol(topic: (typeof DS_SDGN_TOPIC_ORDER)[number], suffix: string): string {
  return `${DS_SDGN_TOPIC_LABELS[topic]} \u2014 ${suffix}`;
}

function progressionLabel(
  s: DsSdgnClassReport["students"][number],
  answered: number,
  planned: number | "",
  dash: string,
): string {
  if (planned !== "" && typeof planned === "number") {
    return `${answered}/${planned} questions`;
  }
  if (s.displayStatus === "not_started") {
    return `0/${dash}`;
  }
  return dash;
}

export function exportDsSdgnClassReportXlsx(report: DsSdgnClassReport, filename?: string): void {
  const wb = XLSX.utils.book_new();
  const dash = "\u2014";

  const syntheseRows = report.students.map((s) => {
    const sess = s.session;
    const answered = sess?.questionsAnswered ?? sess?.answers?.length ?? 0;
    const planned = sess?.totalQuestions ?? "";
    const base: Record<string, string | number> = {
      Eleve: s.studentName,
      Classe: s.classe,
      Lycee: s.lycee || "",
      Email: s.email || "",
      "Statut session": formatDsDisplayStatusLabel(s.displayStatus),
      "Date fin / abandon": formatFrDate(sess?.finishedAt),
      Progression: progressionLabel(s, answered, planned, dash),
      "Note /20": formatDsGradeForReport(s),
      Points: sess ? (sess.forcedZero ? 0 : sess.scorePoints) : "",
      "Bonnes reponses": sess?.correctCount ?? "",
      "Erreurs / timeouts": sess?.wrongCount ?? "",
      "Anti-triche (0)": sess?.forcedZero ? "Oui" : "Non",
    };
    for (const topic of DS_SDGN_TOPIC_ORDER) {
      const stat = sess?.topicStats?.[topic];
      if (stat && stat.total > 0) {
        base[topicCol(topic, "acquis")] = formatDsTopicAcquisLabel(stat.acquis, stat.total);
        base[topicCol(topic, "score")] = `${stat.correct}/${stat.total}`;
      } else if (s.displayStatus === "not_started") {
        base[topicCol(topic, "acquis")] = "Non commence";
        base[topicCol(topic, "score")] = dash;
      } else {
        base[topicCol(topic, "acquis")] = "Non evalue";
        base[topicCol(topic, "score")] = dash;
      }
    }
    return base;
  });

  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(syntheseRows), "Synthese");

  const notionsRows = report.students.flatMap((s) => {
    const sess = s.session;
    return DS_SDGN_TOPIC_ORDER.map((topic) => {
      const stat = sess?.topicStats?.[topic];
      if (stat && stat.total > 0) {
        return {
          Eleve: s.studentName,
          "Statut session": formatDsDisplayStatusLabel(s.displayStatus),
          Notion: DS_SDGN_TOPIC_LABELS[topic],
          "Bonnes / Total": `${stat.correct}/${stat.total}`,
          "Taux %": `${Math.round((stat.correct / stat.total) * 100)} %`,
          Statut: formatDsTopicAcquisLabel(stat.acquis, stat.total),
        };
      }
      return {
        Eleve: s.studentName,
        "Statut session": formatDsDisplayStatusLabel(s.displayStatus),
        Notion: DS_SDGN_TOPIC_LABELS[topic],
        "Bonnes / Total": dash,
        "Taux %": dash,
        Statut: s.displayStatus === "not_started" ? "Non commence" : "Non evalue",
      };
    });
  });
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(notionsRows), "Acquis par notion");

  const detailRows = report.answerDetails.map((row) => ({
    Eleve: row.studentName,
    "No": row.index,
    Notion: row.topicLabel,
    Chapitre: row.chapterLabel
      ? `Ch. ${row.chapter} ${dash} ${row.chapterLabel}`
      : String(row.chapter),
    "Mini cas": row.scenarioTitle,
    Contexte: row.scenarioText,
    Question: row.question,
    "Reponse eleve": row.pickedChoice,
    "Bonne reponse": row.correctChoice,
    Resultat: row.outcomeLabel,
    "Acquis question": row.acquisQuestion,
    "Id question": row.sourceId,
  }));

  const sansReponseRows = report.students
    .filter((s) => s.displayStatus === "not_started")
    .map((s) => ({
      Eleve: s.studentName,
      Message: "Aucune reponse enregistree (DS non commence ou aucune sauvegarde)",
    }));
  const detailCombined =
    detailRows.length > 0
      ? [...detailRows, ...sansReponseRows]
      : sansReponseRows.length > 0
        ? sansReponseRows
        : [{ Eleve: dash, Message: "Aucune reponse enregistree dans la classe" }];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(detailCombined), "Detail reponses");

  const meta = [
    { Champ: "Examen", Valeur: report.examLabel },
    { Champ: "Genere le", Valeur: formatFrDate(report.generatedAt) },
    { Champ: "Eleves listes", Valeur: report.students.length },
    { Champ: "Avec activite DS", Valeur: report.withDsDataCount },
    { Champ: "Termines", Valeur: report.completedCount },
    { Champ: "Non termines / anti-triche", Valeur: report.incompleteCount },
    {
      Champ: "Jamais commences",
      Valeur: report.students.filter((s) => s.displayStatus === "not_started").length,
    },
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(meta), "Infos");

  const stamp = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(wb, filename || `rapport-ds-sdgn-${stamp}.xlsx`);
}

export function buildAndExportDsSdgnPremiereReport(
  eleves: Parameters<typeof buildDsSdgnClassReport>[0],
  filename?: string,
): DsSdgnClassReport {
  const report = buildDsSdgnClassReport(eleves);
  exportDsSdgnClassReportXlsx(report, filename);
  return report;
}
