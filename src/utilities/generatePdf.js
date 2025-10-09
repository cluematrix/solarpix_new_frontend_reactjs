// 📄 src/utils/pdfExport.js
import jsPDF from "jspdf";
import "jspdf-autotable";

/**
 * Generate a reusable styled PDF with company header and table
 * @param {Object} options
 * @param {string} options.title - Main heading (center heading)
 * @param {Array<string>} options.columns - Table headers
 * @param {Array<Array<any>>} options.rows - Table rows
 * @param {Object} [options.company] - Company info for header
 * @param {string} [options.fileName] - PDF filename
 * @param {string} [options.subtitle] - Optional subtitle under title
 */
export const generatePDF = ({
  title,
  subtitle,
  columns,
  rows,
  company = {},
  fileName = "report.pdf",
}) => {
  const doc = new jsPDF("p", "mm", "a4");
  const pageWidth = doc.internal.pageSize.width;

  // === 📌 Header Section ===
  const headerY = 10;

  // ✅ Company Name
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(company?.name || "Company Name", 14, headerY);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(company?.address || "Company Address", 14, headerY + 5);
  doc.text(
    `${company?.city || ""}, ${company?.state || ""} - ${
      company?.pincode || ""
    }`,
    14,
    headerY + 10
  );
  doc.text(company?.country || "India", 14, headerY + 15);
  doc.text(
    `Phone: ${company?.mobile1 || "N/A"}${
      company?.mobile2 ? " / " + company.mobile2 : ""
    }`,
    14,
    headerY + 20
  );
  doc.text(`GSTIN: ${company?.GSTno || "N/A"}`, 14, headerY + 25);
  doc.text(`Email: ${company?.email || "N/A"}`, 14, headerY + 30);

  // ✅ Center Heading
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(title, pageWidth / 2, headerY + 15, { align: "center" });

  // ✅ Logo (optional)
  if (company?.logo) {
    try {
      doc.addImage(company.logo, "PNG", pageWidth - 60, headerY - 5, 40, 40);
    } catch (e) {
      console.warn("⚠️ Logo not added - check base64 format or CORS:", e);
    }
  }

  // === 📌 Optional Subtitle ===
  if (subtitle) {
    doc.setFontSize(11);
    doc.setFont("helvetica", "italic");
    doc.text(subtitle, 14, headerY + 45);
  }

  // === 📊 Table ===
  doc.autoTable({
    head: [columns],
    body: rows,
    startY: subtitle ? headerY + 50 : headerY + 45,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [41, 128, 185] },
    theme: "grid",
  });

  // === 📌 Footer ===
  const pageCount = doc.internal.getNumberOfPages();
  doc.setFontSize(9);
  doc.text(
    `Generated on: ${new Date().toLocaleString()}`,
    14,
    doc.internal.pageSize.height - 10
  );
  doc.text(
    `Page 1 of ${pageCount}`,
    pageWidth - 40,
    doc.internal.pageSize.height - 10
  );

  doc.save(fileName);
};
