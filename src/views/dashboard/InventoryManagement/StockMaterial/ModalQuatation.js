// src/views/dashboard/InventoryManagement/StockMaterial/ViewModal.js
import React, { useRef, useEffect, useState } from "react";
import { Modal, Button, Row, Col, Table, Spinner } from "react-bootstrap";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { toWords } from "number-to-words";
import api from "../../../../api/axios";

const ModalQuotation = ({ show, handleClose, item }) => {
  const modalContentRef = useRef(null);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCompanyData = async () => {
    try {
      setLoading(true);
      const res = await api.get("api/v1/admin/companyMaster");
      if (res.data?.success && res.data?.data?.length > 0) {
        setCompany(res.data.data[0]);
      }
    } catch (err) {
      console.error("Error fetching company data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (show) fetchCompanyData();
  }, [show]);

  if (!item) return null;

  const isWarehouse = item.direct_send === "Warehouse";
  const headingTitle = isWarehouse ? "TAX INVOICE" : "QUOTATION";

  const gst1 = item.IntraTax?.intra_per || 0;
  const gst2 = item.InterTax?.inter_per || 0;
  const basePrice = parseFloat(item.sales_info_selling_price || 0);
  const cgst = (basePrice * gst1) / 100;
  const sgst = (basePrice * gst2) / 100;
  const total = basePrice + cgst + sgst;
  const totalInWords = toWords(Math.floor(total));
  const paise = Math.round((total - Math.floor(total)) * 100);

  const handleDownload = () => {
    const input = modalContentRef.current;
    html2canvas(input, { scale: 2, useCORS: true }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = 210;
      const margin = 5;
      const usableWidth = pageWidth - margin * 2;
      const imgHeight = (canvas.height * usableWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", margin, margin, usableWidth, imgHeight);
      pdf.save(isWarehouse ? "Tax_Invoice.pdf" : "Quotation.pdf");
    });
  };

  return (
    <Modal show={show} onHide={handleClose} size="xl" centered>
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold">{headingTitle}</Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ backgroundColor: "#f8f9fa" }}>
        {loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" /> Loading company details...
          </div>
        ) : (
          <div
            ref={modalContentRef}
            style={{
              fontFamily: "Arial, sans-serif",
              fontSize: "12px",
              color: "#000",
              backgroundColor: "#fff",
              border: "3px solid #000",
              padding: "0",
            }}
          >
            {/* ===== HEADER SECTION ===== */}
            <Row
              style={{
                margin: 0,
                borderBottom: "2px solid #000",
                alignItems: "center",
                textAlign: "center",
                padding: "10px 0",
              }}
            >
              {/* COMPANY DETAILS */}
              <Col xs={4} style={{ padding: "10px", textAlign: "left" }}>
                <h5
                  style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    textDecoration: "underline",
                    marginBottom: "5px",
                  }}
                >
                  {company?.name || "Company Name"}
                </h5>
                <div style={{ lineHeight: "1.5", fontSize: "13px" }}>
                  <div>{company?.address || "Company Address"}</div>
                  <div>
                    {company?.city}, {company?.state} - {company?.pincode}
                  </div>
                  <div>{company?.country || "India"}</div>
                  <div style={{ marginTop: "3px" }}>
                    Phone: {company?.mobile1 || "N/A"}
                    {company?.mobile2 && ` / ${company.mobile2}`}
                  </div>
                  <div>GSTIN: {company?.GSTno || "N/A"}</div>
                  <div>Email: {company?.email || "N/A"}</div>
                </div>
              </Col>

              {/* HEADING */}
              <Col
                xs={4}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <h2
                  style={{
                    fontWeight: "bold",
                    fontSize: "20px",
                    margin: 0,
                    textAlign: "center",
                    marginBottom: "90px",
                  }}
                >
                  {headingTitle}
                </h2>
              </Col>

              {/* LOGO */}
              <Col xs={4} style={{ padding: "10px", textAlign: "right" }}>
                <img
                  src={
                    company?.logo ||
                    "https://via.placeholder.com/100x100?text=Logo"
                  }
                  alt="Company Logo"
                  style={{
                    maxWidth: "100px",
                    maxHeight: "100px",
                    objectFit: "contain",
                  }}
                />
              </Col>
            </Row>

            {/* ===== INVOICE DETAILS ===== */}
            <Row
              style={{
                margin: 0,
                borderBottom: "2px solid #000",
                fontSize: "12px",
              }}
            >
              <Col xs={8} style={{ borderRight: "2px solid #000", padding: 0 }}>
                <table style={{ width: "100%", fontSize: "13px" }}>
                  <tbody>
                    <tr>
                      <td
                        style={{
                          padding: "6px 10px",
                          borderBottom: "1px solid #000",
                          width: "30%",
                        }}
                      >
                        <strong>Invoice#</strong>
                      </td>
                      <td
                        style={{
                          padding: "6px 10px",
                          borderBottom: "1px solid #000",
                          borderLeft: "1px solid #000",
                        }}
                      >
                        : {item.short_code || "N/A"}
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          padding: "6px 10px",
                          borderBottom: "1px solid #000",
                        }}
                      >
                        <strong>Invoice Date</strong>
                      </td>
                      <td
                        style={{
                          padding: "6px 10px",
                          borderBottom: "1px solid #000",
                          borderLeft: "1px solid #000",
                        }}
                      >
                        : {new Date(item.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          padding: "6px 10px",
                          borderBottom: "1px solid #000",
                        }}
                      >
                        <strong>Terms</strong>
                      </td>
                      <td
                        style={{
                          padding: "6px 10px",
                          borderBottom: "1px solid #000",
                          borderLeft: "1px solid #000",
                        }}
                      >
                        : Due On Receipt
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: "6px 10px" }}>
                        <strong>Due Date</strong>
                      </td>
                      <td
                        style={{
                          padding: "6px 10px",
                          borderLeft: "1px solid #000",
                        }}
                      >
                        : {new Date(item.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </Col>
              <Col xs={4} style={{ padding: 0 }}>
                <table style={{ width: "100%", fontSize: "13px" }}>
                  <tbody>
                    <tr>
                      <td
                        style={{
                          padding: "6px 10px",
                          borderBottom: "1px solid #000",
                        }}
                      >
                        <strong>Place of Supply</strong>
                      </td>
                      <td
                        style={{
                          padding: "6px 10px",
                          borderBottom: "1px solid #000",
                          borderLeft: "1px solid #000",
                        }}
                      >
                        : {company?.state || "N/A"} (27)
                      </td>
                    </tr>
                    <tr>
                      <td
                        colSpan="2"
                        style={{ padding: "6px 10px", height: "75px" }}
                      ></td>
                    </tr>
                  </tbody>
                </table>
              </Col>
            </Row>

            {/* ===== BILL TO / SHIP TO ===== */}
            <Row
              style={{
                margin: 0,
                borderBottom: "2px solid #000",
                fontSize: "14px",
              }}
            >
              <Col
                xs={6}
                style={{ borderRight: "2px solid #000", padding: "12px" }}
              >
                <div
                  style={{
                    fontWeight: "bold",
                    marginBottom: "8px",
                    fontSize: "14px",
                  }}
                >
                  Bill To:
                </div>
                <div style={{ lineHeight: "1.6", fontSize: "14px" }}>
                  <div style={{ fontWeight: "bold", fontSize: "14px" }}>
                    {isWarehouse
                      ? item.branch?.branch_name || "N/A"
                      : item.client?.name || "N/A"}
                  </div>
                  <div>
                    {isWarehouse
                      ? item.branch?.address || "N/A"
                      : item.client?.address || "N/A"}
                  </div>
                  <div>
                    {isWarehouse ? item.branch?.city : item.client?.city || ""}
                  </div>
                  <div>
                    {isWarehouse
                      ? item.branch?.state
                      : item.client?.state || ""}
                  </div>
                  <div>India</div>
                </div>
              </Col>

              <Col xs={6} style={{ padding: "12px" }}>
                <div
                  style={{
                    fontWeight: "bold",
                    marginBottom: "8px",
                    fontSize: "14px",
                  }}
                >
                  Ship To:
                </div>
                <div style={{ lineHeight: "1.6", fontSize: "14px" }}>
                  <div style={{ fontWeight: "bold", fontSize: "14px" }}>
                    {isWarehouse
                      ? item.branch?.branch_name || "N/A"
                      : item.client?.name || "N/A"}
                  </div>
                  <div>
                    {isWarehouse ? item.branch?.city : item.client?.city || ""}
                  </div>
                  <div>
                    {isWarehouse
                      ? item.branch?.state
                      : item.client?.state || ""}
                  </div>
                  <div>India</div>
                </div>
              </Col>
            </Row>

            {/* ===== SUBJECT ===== */}
            <div
              style={{
                padding: "8px 12px",
                borderBottom: "2px solid #000",
                fontSize: "14px",
              }}
            >
              <strong>Subject:</strong> {item.material || "N/A"}
            </div>

            {/* ===== ITEM TABLE ===== */}
            <Table
              bordered
              size="sm"
              style={{ margin: 0, fontSize: "12px", border: "none" }}
            >
              <thead style={{ backgroundColor: "#fff" }}>
                <tr>
                  <th
                    rowSpan="2"
                    style={{
                      textAlign: "center",
                      verticalAlign: "middle",
                      border: "1px solid #000",
                      padding: "5px",
                    }}
                  >
                    #
                  </th>
                  <th
                    rowSpan="2"
                    style={{
                      textAlign: "center",
                      verticalAlign: "middle",
                      border: "1px solid #000",
                      padding: "5px",
                    }}
                  >
                    Item & Description
                  </th>
                  <th
                    rowSpan="2"
                    style={{
                      textAlign: "center",
                      verticalAlign: "middle",
                      border: "1px solid #000",
                      padding: "5px",
                    }}
                  >
                    HSN
                  </th>
                  <th
                    rowSpan="2"
                    style={{
                      textAlign: "center",
                      verticalAlign: "middle",
                      border: "1px solid #000",
                      padding: "5px",
                    }}
                  >
                    Qty
                  </th>
                  <th
                    rowSpan="2"
                    style={{
                      textAlign: "center",
                      verticalAlign: "middle",
                      border: "1px solid #000",
                      padding: "5px",
                    }}
                  >
                    Rate
                  </th>
                  <th
                    rowSpan="2"
                    style={{
                      textAlign: "center",
                      verticalAlign: "middle",
                      border: "1px solid #000",
                      padding: "5px",
                    }}
                  >
                    Amount
                  </th>
                  <th
                    rowSpan="2"
                    style={{
                      textAlign: "center",
                      verticalAlign: "middle",
                      border: "1px solid #000",
                      padding: "5px",
                    }}
                  >
                    Taxable Amount
                  </th>
                  <th
                    colSpan="2"
                    style={{
                      textAlign: "center",
                      border: "1px solid #000",
                      padding: "5px",
                    }}
                  >
                    CGST
                  </th>
                  <th
                    colSpan="2"
                    style={{
                      textAlign: "center",
                      border: "1px solid #000",
                      padding: "5px",
                    }}
                  >
                    SGST
                  </th>
                </tr>
                <tr>
                  <th
                    style={{
                      textAlign: "center",
                      border: "1px solid #000",
                      padding: "3px",
                    }}
                  >
                    %
                  </th>
                  <th
                    style={{
                      textAlign: "center",
                      border: "1px solid #000",
                      padding: "3px",
                    }}
                  >
                    Amt
                  </th>
                  <th
                    style={{
                      textAlign: "center",
                      border: "1px solid #000",
                      padding: "3px",
                    }}
                  >
                    %
                  </th>
                  <th
                    style={{
                      textAlign: "center",
                      border: "1px solid #000",
                      padding: "3px",
                    }}
                  >
                    Amt
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    style={{
                      textAlign: "center",
                      padding: "8px 4px",
                      border: "1px solid #000",
                    }}
                  >
                    1
                  </td>
                  <td
                    style={{
                      textAlign: "left",
                      padding: "8px",
                      border: "1px solid #000",
                    }}
                  >
                    <strong>{item.material}</strong>
                    <br />
                    <div style={{ fontSize: "13px", marginTop: "3px" }}>
                      Make: {item.brand?.brand_name || "N/A"}
                      <br />
                      Unit: {item.unit?.unit || "N/A"}
                    </div>
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                      padding: "8px 4px",
                      border: "1px solid #000",
                    }}
                  >
                    {item.hsc_code || item.sac || "N/A"}
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                      padding: "8px 4px",
                      border: "1px solid #000",
                    }}
                  >
                    1
                  </td>
                  <td
                    style={{
                      textAlign: "right",
                      padding: "8px",
                      border: "1px solid #000",
                    }}
                  >
                    {basePrice.toFixed(2)}
                  </td>
                  <td
                    style={{
                      textAlign: "right",
                      padding: "8px",
                      border: "1px solid #000",
                    }}
                  >
                    {basePrice.toFixed(2)}
                  </td>
                  <td
                    style={{
                      textAlign: "right",
                      padding: "8px",
                      border: "1px solid #000",
                    }}
                  >
                    {basePrice.toFixed(2)}
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                      padding: "8px 4px",
                      border: "1px solid #000",
                    }}
                  >
                    {gst1}
                  </td>
                  <td
                    style={{
                      textAlign: "right",
                      padding: "8px",
                      border: "1px solid #000",
                    }}
                  >
                    {cgst.toFixed(2)}
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                      padding: "8px 4px",
                      border: "1px solid #000",
                    }}
                  >
                    {gst2}
                  </td>
                  <td
                    style={{
                      textAlign: "right",
                      padding: "8px",
                      border: "1px solid #000",
                    }}
                  >
                    {sgst.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </Table>

            {/* ===== TOTAL SECTION ===== */}
            <Row
              style={{
                margin: 0,
                borderTop: "2px solid #000",
                fontSize: "12px",
              }}
            >
              <Col
                xs={7}
                style={{ borderRight: "2px solid #000", padding: "12px" }}
              >
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: "bold",
                    marginBottom: "5px",
                  }}
                >
                  Total: ₹ {total.toFixed(2)} Only
                </div>
                <div style={{ lineHeight: "1.5", fontSize: "13px" }}>
                  <strong>In Words:</strong>
                  <br />
                  <span style={{ textTransform: "capitalize" }}>
                    {totalInWords} Rupees{" "}
                    {paise > 0 ? `and ${toWords(paise)} Paise` : ""} Only
                  </span>
                </div>
              </Col>
              <Col xs={5} style={{ padding: 0 }}>
                <table style={{ width: "100%", fontSize: "13px" }}>
                  <tbody>
                    <tr>
                      <td
                        style={{
                          padding: "6px 10px",
                          borderBottom: "1px solid #000",
                        }}
                      >
                        <strong>Sub Total</strong>
                      </td>
                      <td
                        style={{
                          padding: "6px 10px",
                          borderBottom: "1px solid #000",
                          borderLeft: "1px solid #000",
                          textAlign: "right",
                        }}
                      >
                        ₹ {basePrice.toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          padding: "6px 10px",
                          borderBottom: "1px solid #000",
                        }}
                      >
                        <strong>CGST ({gst1}%)</strong>
                      </td>
                      <td
                        style={{
                          padding: "6px 10px",
                          borderBottom: "1px solid #000",
                          borderLeft: "1px solid #000",
                          textAlign: "right",
                        }}
                      >
                        ₹ {cgst.toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          padding: "6px 10px",
                          borderBottom: "1px solid #000",
                        }}
                      >
                        <strong>SGST ({gst2}%)</strong>
                      </td>
                      <td
                        style={{
                          padding: "6px 10px",
                          borderBottom: "1px solid #000",
                          borderLeft: "1px solid #000",
                          textAlign: "right",
                        }}
                      >
                        ₹ {sgst.toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          padding: "8px 10px",
                          borderBottom: "2px solid #000",
                        }}
                      >
                        <strong>Total</strong>
                      </td>
                      <td
                        style={{
                          padding: "8px 10px",
                          borderBottom: "2px solid #000",
                          borderLeft: "1px solid #000",
                          textAlign: "right",
                          fontWeight: "bold",
                        }}
                      >
                        ₹ {total.toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </Col>
            </Row>

            {/* ===== FOOTER / SIGNATURE ===== */}
            <div
              style={{
                padding: "15px",
                minHeight: "80px",
                borderTop: "2px solid #000",
                fontSize: "13px",
              }}
            >
              <div style={{ float: "right", textAlign: "center" }}>
                <div style={{ marginTop: "35px" }}>Authorised Signatory</div>
              </div>
            </div>
          </div>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleDownload}>
          Download PDF
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalQuotation;
