const fs = require("fs");
const path = require("path");
const { jsPDF } = require("jspdf");

const root = path.resolve(__dirname, "..");
const inputPath = path.join(root, "exports", "retours_personnalises_ds_chap13_2026_detaille.md");
const outputPath = path.join(root, "exports", "retours_personnalises_ds_chap13_2026_detaille_couleur_accents_v2.pdf");

const markdown = fs.readFileSync(inputPath, "utf8");
const markdownTitle = markdown.match(/^#\s+(.+)$/m)?.[1] || "Retours personnaliss dtaills - DS Chapitre 13";
const markdownLegend = markdown
  .split(/\r?\n/)
  .filter((line) => line.startsWith("- ") && line.includes(" : "))
  .slice(0, 4)
  .map((line) => {
    const clean = line.replace(/^- /, "");
    const [label, ...rest] = clean.split(" : ");
    return [label, rest.join(" : ")];
  });

function parseDocument(text) {
  const students = [];
  let currentVersion = "";
  let currentStudent = null;

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();

    if (line.startsWith("## ")) {
      currentVersion = line.replace(/^##\s+/, "");
      continue;
    }

    if (line.startsWith("### ")) {
      if (currentStudent) students.push(currentStudent);
      currentStudent = {
        version: currentVersion,
        name: line.replace(/^###\s+/, ""),
        questions: [],
        plus: "",
        minus: "",
      };
      continue;
    }

    if (!currentStudent) continue;

    const qMatch = line.match(/^- (Q[^:]+)\s*:\s*([^.]+)\.\s*(.*)$/);
    if (qMatch) {
      currentStudent.questions.push({
        label: qMatch[1],
        status: qMatch[2],
        text: qMatch[3],
      });
      continue;
    }

    if (line.startsWith("Bilan + :")) {
      currentStudent.plus = line.replace(/^Bilan \+ :\s*/, "");
      continue;
    }

    if (line.startsWith("Bilan - :")) {
      currentStudent.minus = line.replace(/^Bilan - :\s*/, "");
    }
  }

  if (currentStudent) students.push(currentStudent);
  return students;
}

const students = parseDocument(markdown);

const doc = new jsPDF({
  orientation: "portrait",
  unit: "mm",
  format: "a4",
});

const page = {
  width: 210,
  height: 297,
  marginX: 14,
  marginTop: 14,
  marginBottom: 14,
};

const colors = {
  ink: [31, 41, 55],
  muted: [107, 114, 128],
  line: [229, 231, 235],
  blue: [37, 99, 235],
  blueLight: [219, 234, 254],
  purple: [124, 58, 237],
  purpleLight: [237, 233, 254],
  green: [22, 163, 74],
  greenLight: [220, 252, 231],
  orange: [217, 119, 6],
  orangeLight: [254, 243, 199],
  red: [220, 38, 38],
  redLight: [254, 226, 226],
  gray: [75, 85, 99],
  grayLight: [243, 244, 246],
};

function setText(rgb) {
  doc.setTextColor(rgb[0], rgb[1], rgb[2]);
}

function setFill(rgb) {
  doc.setFillColor(rgb[0], rgb[1], rgb[2]);
}

function statusStyle(status) {
  const s = status.toLowerCase();
  if (s.includes("non trait\u00e9")) return { fill: colors.grayLight, text: colors.gray, label: status };
  if (s.includes("\u00e0 revoir")) return { fill: colors.redLight, text: colors.red, label: status };
  if (s.includes("partiel")) return { fill: colors.orangeLight, text: colors.orange, label: status };
  if (s.includes("acquis")) return { fill: colors.greenLight, text: colors.green, label: status };
  return { fill: colors.grayLight, text: colors.gray, label: status };
}

function versionStyle(version) {
  if (version.toUpperCase().includes("POULPE")) {
    return { fill: colors.purple, light: colors.purpleLight };
  }
  return { fill: colors.blue, light: colors.blueLight };
}

function drawRoundedRect(x, y, w, h, fill, stroke = null) {
  setFill(fill);
  if (stroke) {
    doc.setDrawColor(stroke[0], stroke[1], stroke[2]);
    doc.roundedRect(x, y, w, h, 2.5, 2.5, "FD");
  } else {
    doc.roundedRect(x, y, w, h, 2.5, 2.5, "F");
  }
}

function addCover() {
  setFill(colors.blue);
  doc.rect(0, 0, page.width, 74, "F");
  setText([255, 255, 255]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.text(markdownTitle.replace(" - DS Chapitre 13", ""), page.marginX, 30);
  doc.setFontSize(15);
  doc.text("DS Chapitre 13 - VIVAALGERIE + POULPE", page.marginX, 42);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text("Correction question par question avec code couleur", page.marginX, 56);

  let y = 95;
  setText(colors.ink);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Code couleur", page.marginX, y);
  y += 12;

  const legend = [
    [markdownLegend[0]?.[0] || "Acquis", markdownLegend[0]?.[1] || "Reponse juste ou presque juste.", colors.greenLight, colors.green],
    [markdownLegend[1]?.[0] || "Partiel", markdownLegend[1]?.[1] || "Reponse partielle.", colors.orangeLight, colors.orange],
    [markdownLegend[2]?.[0] || "A revoir", markdownLegend[2]?.[1] || "Methode incorrecte.", colors.redLight, colors.red],
    [markdownLegend[3]?.[0] || "Non traite", markdownLegend[3]?.[1] || "Reponse vide.", colors.grayLight, colors.gray],
  ];

  for (const [label, desc, fill, text] of legend) {
    drawRoundedRect(page.marginX, y - 6, 34, 9, fill);
    setText(text);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text(label, page.marginX + 4, y);
    setText(colors.ink);
    doc.setFont("helvetica", "normal");
    doc.text(desc, page.marginX + 42, y);
    y += 14;
  }

  y += 8;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("Contenu", page.marginX, y);
  y += 8;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  const lines = doc.splitTextToSize(
    `${students.length} \u00e9l\u00e8ves au total. Chaque page \u00e9l\u00e8ve contient les remarques Q1-Q15, puis un bilan + et un bilan -.`,
    170
  );
  doc.text(lines, page.marginX, y);
}

function drawHeader(student, index) {
  const style = versionStyle(student.version);
  setFill(style.fill);
  doc.rect(0, 0, page.width, 22, "F");
  setText([255, 255, 255]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text(student.version, page.marginX, 9);
  doc.setFontSize(16);
  doc.text(student.name, page.marginX, 17);
  doc.setFontSize(9);
  doc.text(`Copie ${index + 1}/${students.length}`, page.width - page.marginX - 28, 9);
}

function drawQuestion(q, y) {
  const style = statusStyle(q.status);
  const x = page.marginX;
  const w = page.width - page.marginX * 2;

  drawRoundedRect(x, y, w, 9, [249, 250, 251], colors.line);
  setText(colors.ink);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.6);
  doc.text(q.label, x + 3, y + 6);

  drawRoundedRect(x + 18, y + 1.8, 28, 5.8, style.fill);
  setText(style.text);
  doc.setFontSize(6.8);
  doc.text(style.label, x + 20, y + 5.8);

  setText(colors.ink);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.4);
  const wrapped = doc.splitTextToSize(q.text, w - 52);
  doc.text(wrapped.slice(0, 2), x + 50, y + 4.3);

  return y + Math.max(9.8, wrapped.length > 1 ? 12 : 9.8);
}

function drawBilan(student, y) {
  const x = page.marginX;
  const w = page.width - page.marginX * 2;
  const plusLines = doc.splitTextToSize(student.plus || "Non renseign.", w - 18);
  const minusLines = doc.splitTextToSize(student.minus || "Non renseign.", w - 18);
  const h = 15 + plusLines.length * 4 + minusLines.length * 4;

  drawRoundedRect(x, y, w, h, [255, 255, 255], colors.line);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");

  setText(colors.green);
  doc.text("Bilan +", x + 4, y + 7);
  setText(colors.ink);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.2);
  doc.text(plusLines, x + 20, y + 7);

  const minusY = y + 9 + plusLines.length * 4;
  setText(colors.red);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("Bilan -", x + 4, minusY);
  setText(colors.ink);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.2);
  doc.text(minusLines, x + 20, minusY);
}

function addStudentPage(student, index) {
  doc.addPage();
  drawHeader(student, index);

  let y = 33;
  const style = versionStyle(student.version);
  drawRoundedRect(page.marginX, y - 6, page.width - page.marginX * 2, 10, style.light);
  setText(style.fill);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("Correction question par question", page.marginX + 4, y);
  y += 9;

  for (const q of student.questions) {
    if (y > page.height - 42) {
      doc.addPage();
      drawHeader(student, index);
      y = 32;
    }
    y = drawQuestion(q, y);
  }

  y += 4;
  if (y > page.height - 42) {
    doc.addPage();
    drawHeader(student, index);
    y = 32;
  }
  drawBilan(student, y);
}

addCover();
students.forEach(addStudentPage);

const pageCount = doc.getNumberOfPages();
for (let i = 1; i <= pageCount; i += 1) {
  doc.setPage(i);
  setText(colors.muted);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(`Page ${i}/${pageCount}`, page.width - page.marginX - 22, page.height - 8);
}

doc.save(outputPath);
console.log(`PDF gnr : ${outputPath}`);
