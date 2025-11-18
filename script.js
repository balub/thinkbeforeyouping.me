document.getElementById("specForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const form = e.target;
  const data = new FormData(form);

  const text = `
REQUEST SUMMARY
======================

Title:
${data.get("title")}

Requested by:
Name: ${data.get("name")}
Contact: ${data.get("contact")}

---

WHAT DO THEY NEED?
${data.get("what")}

---

WHY DO THEY NEED IT?
${data.get("why") || "Not provided."}

---

WHO IS THIS FOR?
${data.get("who") || "Not specified."}

---

WHAT ARE THEY EXPECTING FROM YOU?
${data.get("expect")}

---

WHAT HAVE THEY ALREADY TRIED?
${data.get("tried") || "Not mentioned."}

---

DEADLINE:
${data.get("deadline") || "No deadline mentioned."}

---
PAYMENT / COMPENSATION:
${data.get("payment") || "Not specified."}

---

LINKS / REFERENCES:
${data.get("links") || "None provided."}

---

THINGS THEY DO NOT WANT:
${data.get("notwant") || "Not specified."}

---

WHAT DOES SUCCESS LOOK LIKE?
${data.get("success") || "Not defined."}

---

Generated via: thinkbeforeyouping.me
"When someone sends you this instead of a vague ping — respect."
`;

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: "pt", format: "a4" });

  const lines = doc.splitTextToSize(text, 540);
  doc.text(lines, 30, 40);

  doc.save("request.pdf");
});
