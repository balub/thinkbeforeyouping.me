document.getElementById("specForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const form = e.target;
  const data = new FormData(form);

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: "pt", format: "a4" });

  let y = 50;

  const heading = (emoji, title) => {
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(16);
    doc.text(`${emoji} ${title}`, 30, y);
    y += 18;

    doc.setDrawColor(180);
    doc.setLineWidth(1);
    doc.line(30, y, 550, y);
    y += 15;

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(12);
  };

  const addTextBlock = (label, value) => {
    const block = `${label}\n${value}\n\n`;
    const lines = doc.splitTextToSize(block, 520);
    doc.text(lines, 30, y);
    y += lines.length * 14 + 10;
  };

  heading("📝", "Request Summary");
  addTextBlock("Title:", data.get("title"));
  addTextBlock("Requested by:", `Name: ${data.get("name")}\nContact: ${data.get("contact")}`);

  heading("🤔", "What They Need");
  addTextBlock("", data.get("what"));

  heading("🎯", "Purpose");
  addTextBlock("", data.get("why") || "Not provided.");

  heading("👥", "Who Is This For?");
  addTextBlock("", data.get("who") || "Not specified.");

  heading("📌", "Expectations");
  addTextBlock("", data.get("expect"));

  heading("🧪", "What They've Tried");
  addTextBlock("", data.get("tried") || "Not mentioned.");

  heading("⏳", "Deadline");
  addTextBlock("", data.get("deadline") || "No deadline mentioned.");

  heading("💰", "Payment / Compensation");
  addTextBlock("", data.get("payment") || "Not specified.");

  heading("🚫", "Things They Do NOT Want");
  addTextBlock("", data.get("notwant") || "Not specified.");

  heading("✅", "Success Looks Like");
  addTextBlock("", data.get("success") || "Not defined.");

  heading("🔗", "Links / References");
  addTextBlock("", data.get("links") || "None provided.");

  doc.setFontSize(11);
  doc.setTextColor(120);
  y += 20;
  doc.text("Generated via thinkbeforeyouping.me", 30, y);
  y += 14;
  doc.text("GitHub: github.com/balub • Website: balubabu.dev • Twitter: @AskBaluBabu", 30, y);

  doc.save("request.pdf");
});
