import pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";

// ✅ Attach fonts correctly for all environments
if (pdfFonts && pdfFonts.pdfMake && pdfFonts.pdfMake.vfs) {
  pdfMake.vfs = pdfFonts.pdfMake.vfs;
} else if (pdfFonts && pdfFonts.vfs) {
  pdfMake.vfs = pdfFonts.vfs;
} else {
  console.error("⚠️ PDF fonts not loaded properly.");
}

/**
 * Generates a reusable, production-grade PDF for Stock History
 * @param {Object} options
 * @param {Object} options.company - Company details
 * @param {string} options.headingTitle - Title text
 * @param {Array} options.tableData - Array of row data
 * @param {string} [options.startDate] - Start date for filter
 * @param {string} [options.endDate] - End date for filter
 */
export const generateStockHistoryPDF = ({
  company = {},
  headingTitle = "Stock Management History",
  tableData = [],
  startDate,
  endDate,
}) => {
  //   const logo = company?.logo || "https://via.placeholder.com/100x100?text=Logo";

  // Table Body
  const tableBody = [
    [
      { text: "Sr No", style: "tableHeader" },
      { text: "Material", style: "tableHeader" },
      { text: "Particular", style: "tableHeader" },
      { text: "Supplier", style: "tableHeader" },
      { text: "Credit", style: "tableHeader" },
      { text: "Debit", style: "tableHeader" },
      { text: "Balance", style: "tableHeader" },
      { text: "Created At", style: "tableHeader" },
    ],
    ...tableData.map((item, idx) => [
      idx + 1,
      item.material?.material || "--",
      item.particular?.particular || "--",
      item.supplier?.name || "--",
      item.Credit || "--",
      item.Debit || "--",
      item.balance || "--",
      new Date(item.created_at).toLocaleDateString("en-GB"),
    ]),
  ];

  // 🗓️ Date Range Line
  const dateRangeLine =
    startDate && endDate
      ? {
          text: `Date Range: ${new Date(startDate).toLocaleDateString(
            "en-GB"
          )} → ${new Date(endDate).toLocaleDateString("en-GB")}`,
          alignment: "center",
          fontSize: 10,
          italics: true,
          margin: [0, 5, 0, 10],
        }
      : startDate
      ? {
          text: `From: ${new Date(startDate).toLocaleDateString("en-GB")}`,
          alignment: "center",
          fontSize: 10,
          italics: true,
          margin: [0, 5, 0, 10],
        }
      : endDate
      ? {
          text: `Until: ${new Date(endDate).toLocaleDateString("en-GB")}`,
          alignment: "center",
          fontSize: 10,
          italics: true,
          margin: [0, 5, 0, 10],
        }
      : null;

  // 🕒 Generated timestamp
  const now = new Date();
  const formattedGeneratedOn = `${now.toLocaleDateString(
    "en-GB"
  )} ${now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}`;

  const docDefinition = {
    pageSize: "A4",
    pageMargins: [30, 120, 30, 60],
    header: {
      margin: [30, 20, 30, 0],
      table: {
        widths: ["33%", "34%", "33%"],
        body: [
          [
            // Left Column - Company Info
            {
              stack: [
                { text: company?.name || "Company Name", style: "companyName" },
                { text: company?.address || "Company Address", fontSize: 9 },
                {
                  text: `${company?.city || ""}, ${company?.state || ""} - ${
                    company?.pincode || ""
                  }`,
                  fontSize: 9,
                },
                { text: company?.country || "India", fontSize: 9 },
                {
                  text: `Phone: ${company?.mobile1 || "N/A"} ${
                    company?.mobile2 ? `/ ${company?.mobile2}` : ""
                  }`,
                  fontSize: 9,
                },
                { text: `GSTIN: ${company?.GSTno || "N/A"}`, fontSize: 9 },
                { text: `Email: ${company?.email || "N/A"}`, fontSize: 9 },
              ],
              border: [false, false, false, true],
            },
            // Middle Column - Title
            {
              stack: [
                {
                  text: headingTitle,
                  alignment: "center",
                  style: "headingTitle",
                },
                dateRangeLine ? dateRangeLine : { text: "" },
              ],
            },
            // Right Column - Logo
            // {
            //   image: logo,
            //   width: 80,
            //   alignment: "right",
            // },
          ],
        ],
      },
      layout: "noBorders",
    },
    footer: function (currentPage, pageCount) {
      return {
        columns: [
          {
            text: `Generated On: ${formattedGeneratedOn}`,
            alignment: "left",
            fontSize: 9,
            margin: [30, 0],
          },
          {
            text: `Page ${currentPage} of ${pageCount}`,
            alignment: "right",
            fontSize: 9,
            margin: [0, 0, 30, 0],
          },
        ],
      };
    },
    content: [
      {
        style: "tableStyle",
        table: {
          headerRows: 1,
          widths: ["5%", "*", "*", "*", "*", "*", "*", "15%"],
          body: tableBody,
        },
        layout: "lightHorizontalLines",
        dontBreakRows: false, // auto page-break for large tables
      },
    ],
    styles: {
      companyName: {
        fontSize: 12,
        bold: true,
        decoration: "underline",
        marginBottom: 2,
      },
      headingTitle: {
        fontSize: 18,
        bold: true,
        marginBottom: 4,
      },
      tableHeader: {
        bold: true,
        fillColor: "#eeeeee",
      },
    },
    defaultStyle: {
      fontSize: 10,
    },
  };

  pdfMake.createPdf(docDefinition).download(`${headingTitle}.pdf`);
};
