document.getElementById("specForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const form = e.target;
  const data = new FormData(form);

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: "pt", format: "a4" });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 50;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const checkPageBreak = (neededSpace = 80) => {
    if (y + neededSpace > pageHeight - 50) {
      doc.addPage();
      y = margin;
    }
  };

  // Helper: Add section heading
  const sectionHeading = (title) => {
    checkPageBreak(60);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(20, 20, 20);
    doc.text(title, margin, y);
    y += 20;
  };

  // Helper: Add paragraph text (wrapped)
  const paragraph = (text) => {
    checkPageBreak(40);
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(40, 40, 40);
    const lines = doc.splitTextToSize(text, contentWidth);
    doc.text(lines, margin, y);
    y += lines.length * 15 + 8;
  };

  // Helper: Add bullet list
  const bulletList = (items) => {
    checkPageBreak(50);
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(40, 40, 40);

    items.forEach((item) => {
      const bulletWidth = contentWidth - 15;
      const lines = doc.splitTextToSize(item, bulletWidth);
      doc.text("•", margin, y);
      doc.text(lines, margin + 12, y);
      y += Math.max(lines.length * 15, 15) + 2;
    });
    y += 5;
  };

  // Main title (no subtitle)
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(28);
  doc.setTextColor(20, 20, 20);
  const titleLines = doc.splitTextToSize(data.get("title"), contentWidth);
  doc.text(titleLines, margin, y);
  y += titleLines.length * 32 + 15;

  // Requester info (small)
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Requested by ${data.get("name")} • ${data.get("contact")}`, margin, y);
  y += 25;

  // Overview section
  if (data.get("what")) {
    sectionHeading("Overview");
    paragraph(data.get("what"));
  }

  // Context section
  if (data.get("why")) {
    sectionHeading("Context");
    paragraph(data.get("why"));
  }

  // Details section
  if (data.get("who") || data.get("deadline") || data.get("payment")) {
    sectionHeading("Details");

    const details = [];
    if (data.get("who")) {
      details.push(`For: ${data.get("who")}`);
    }
    if (data.get("deadline")) {
      details.push(`Timeline: ${data.get("deadline")}`);
    }
    if (data.get("payment")) {
      details.push(`Budget: ${data.get("payment")}`);
    }

    bulletList(details);
  }

  // Expectations section
  if (data.get("expect")) {
    sectionHeading("What You're Asking For");
    paragraph(data.get("expect"));
  }

  // What's been tried section
  if (data.get("tried")) {
    sectionHeading("What You've Already Tried");
    paragraph(data.get("tried"));
  }

  // Success criteria section
  if (data.get("success")) {
    sectionHeading("Success Criteria");
    paragraph(data.get("success"));
  }

  // Constraints section
  if (data.get("notwant")) {
    sectionHeading("Constraints & Preferences");
    paragraph(data.get("notwant"));
  }

  // References section
  if (data.get("links")) {
    sectionHeading("References & Resources");
    const linkLines = data.get("links").split("\n").filter(l => l.trim());
    bulletList(linkLines);
  }

  // Add footer to all pages
  const addFooter = () => {
    const totalPages = doc.internal.pages.length - 1;
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);

      const timestamp = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

      doc.text(`Generated via`, margin, pageHeight - 20);
      doc.setTextColor(70, 150, 180);
      doc.textWithLink("thinkbeforeyouping.me", margin + 66, pageHeight - 20, {
        pageNumber: undefined,
        pageNumberUndefined: undefined,
        url: "https://thinkbeforeyouping.me",
      });

      doc.setTextColor(150, 150, 150);
      doc.text(` on ${timestamp}`, margin + 158, pageHeight - 20);

      doc.setTextColor(70, 150, 180);
      doc.textWithLink("Star this project on GitHub", margin, pageHeight - 12, {
        pageNumber: undefined,
        pageNumberUndefined: undefined,
        url: "https://github.com/balub/thinkbeforeyouping.me",
      });
    }
  };

  addFooter();
  doc.save("request.pdf");
});
