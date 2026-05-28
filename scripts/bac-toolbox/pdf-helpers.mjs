/** Utilitaires PDF A4 (jsPDF) pour la boite a outils Bac Management. */

export function createPdfWriter() {
  return import("jspdf").then(({ jsPDF }) => {
    const doc = new jsPDF({ unit: "pt", format: "a4", orientation: "portrait" });
    const page = { left: 48, right: 547, top: 52, bottom: 780, w: 499 };
    let y = page.top;
    let pageNum = 1;

    const api = {
      doc,
      page,
      getY: () => y,
      setY: (v) => {
        y = v;
      },
      newPage() {
        api.footer();
        doc.addPage();
        pageNum += 1;
        y = page.top;
      },
      footer() {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(120, 120, 120);
        doc.text(`STMG HUB \u2014 Bo\u00eete \u00e0 outils Bac Management \u2014 p. ${pageNum}`, page.left, 820);
        doc.setTextColor(20, 20, 20);
      },
      ensure(h = 18) {
        if (y + h > page.bottom) api.newPage();
      },
      write(text, opts = {}) {
        const {
          size = 11,
          bold = false,
          color = [30, 41, 59],
          lineHeight = 14,
          indent = 0,
        } = opts;
        doc.setFont("helvetica", bold ? "bold" : "normal");
        doc.setFontSize(size);
        doc.setTextColor(color[0], color[1], color[2]);
        const lines = doc.splitTextToSize(String(text || ""), page.w - indent);
        api.ensure(lines.length * lineHeight + 4);
        doc.text(lines, page.left + indent, y);
        y += lines.length * lineHeight;
        doc.setTextColor(30, 41, 59);
      },
      heading(text, level = 1) {
        if (level === 1) {
          api.ensure(36);
          api.write(text, { size: 18, bold: true, color: [15, 76, 129], lineHeight: 22 });
          y += 4;
        } else {
          api.ensure(24);
          api.write(text, { size: 13, bold: true, color: [30, 64, 175], lineHeight: 17 });
          y += 2;
        }
      },
      rule() {
        api.ensure(10);
        doc.setDrawColor(203, 213, 225);
        doc.line(page.left, y, page.right, y);
        y += 10;
      },
      save(path) {
        api.footer();
        doc.save(path);
      },
      drawTable(columns, rows, opts = {}) {
        const { colWidths, headerFill = [241, 245, 249], fontSize = 9, rowH = 16 } = opts;
        const totalW = colWidths.reduce((a, b) => a + b, 0);
        let x0 = page.left;
        if (page.left + totalW > page.right) x0 = page.left;

        const drawRow = (cells, isHeader) => {
          api.ensure(rowH + 6);
          let x = x0;
          if (isHeader) {
            doc.setFillColor(headerFill[0], headerFill[1], headerFill[2]);
            doc.rect(x0, y - 12, totalW, rowH, "F");
          }
          doc.setFont("helvetica", isHeader ? "bold" : "normal");
          doc.setFontSize(fontSize);
          doc.setTextColor(30, 41, 59);
          for (let i = 0; i < cells.length; i++) {
            const txt = doc.splitTextToSize(String(cells[i] ?? ""), colWidths[i] - 6);
            doc.text(txt.slice(0, 2), x + 3, y);
            x += colWidths[i];
          }
          doc.setDrawColor(226, 232, 240);
          doc.rect(x0, y - 12, totalW, rowH);
          y += rowH;
        };

        drawRow(columns, true);
        for (const row of rows) drawRow(row, false);
        y += 6;
      },
    };
    return api;
  });
}

export function slugify(name) {
  return String(name)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

export function titleCase(str) {
  return String(str)
    .split(/[\s-]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
