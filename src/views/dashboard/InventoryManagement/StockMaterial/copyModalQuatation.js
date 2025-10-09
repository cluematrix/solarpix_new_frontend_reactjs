// src/views/dashboard/InventoryManagement/StockMaterial/ViewModal.js
import React, { useRef } from "react";
import { Modal, Button, Row, Col, Table } from "react-bootstrap";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import logo from "../../../../assets/images/logo/main_logo.jpg";
import { toWords } from "number-to-words";

const ModalQuotation = ({ show, handleClose, item }) => {
  const modalContentRef = useRef(null);
  if (!item) return null;

  const isWarehouse = item.direct_send === "Warehouse";
  const headingTitle = isWarehouse ? "INVOICE" : "QUOTATION";

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
      pdf.save(isWarehouse ? "Invoice.pdf" : "Quotation.pdf");
    });
  };

  return (
    <Modal show={show} onHide={handleClose} size="xl" centered>
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold">{headingTitle}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div
          ref={modalContentRef}
          style={{
            fontFamily: "Arial, sans-serif",
            fontSize: "13px",
            color: "#000",
            backgroundColor: "#fff",
            border: "2px solid #000",
            padding: "20px",
          }}
        >
          {/* Header */}
          <Row
            style={{
              borderBottom: "2px solid #000",
              paddingBottom: "10px",
              marginBottom: "10px",
            }}
          >
            <Col xs={8}>
              <h6 className="fw-bold">Solarpix Energy Pvt. Ltd.</h6>
              <div>Ratan Apt 3, Ganeshpeth, Nagpur-440018</div>
              <div>Phone: 9096941011 Maharashtra, India</div>
              <div>GSTIN: 27DIXPK6784F1ZD</div>
              <div>Email: office.solarpix@gmail.com</div>
            </Col>
            <Col xs={4} className="text-end">
              <img src={logo} alt="logo" style={{ maxWidth: "90px" }} />
              <h5
                style={{
                  fontWeight: "bold",
                  marginTop: "10px",
                  border: "2px solid #000",
                  padding: "5px",
                  display: "inline-block",
                }}
              >
                {headingTitle}
              </h5>
            </Col>
          </Row>

          {/* Invoice Details */}
          <Table
            bordered
            size="sm"
            style={{ border: "1px solid #000", marginBottom: "0" }}
          >
            <tbody>
              <tr>
                <td style={{ width: "33%" }}>
                  <strong>Invoice # :</strong> {item.short_code || "N/A"}
                </td>
                <td style={{ width: "33%" }}>
                  <strong>Invoice Date :</strong>{" "}
                  {new Date(item.created_at).toLocaleDateString()}
                </td>
                <td style={{ width: "33%" }}>
                  <strong>Place Of Supply :</strong> Maharashtra (27)
                </td>
              </tr>
              <tr>
                <td>
                  <strong>Terms :</strong> Due On Receipt
                </td>
                <td>
                  <strong>Due Date :</strong>{" "}
                  {new Date(item.created_at).toLocaleDateString()}
                </td>
                <td></td>
              </tr>
            </tbody>
          </Table>

          {/* Bill / Ship Section */}
          <Row style={{ margin: 0 }}>
            {/* Bill To */}
            <Col
              xs={6}
              style={{
                border: "1px solid #000",
                borderTop: "none",
                padding: "6px 8px",
              }}
            >
              <div
                className="fw-bold border-bottom"
                style={{
                  paddingBottom: "4px",
                  marginBottom: "4px",
                  borderBottom: "1px solid #000",
                }}
              >
                Bill To
              </div>
              <div>
                <strong>
                  {isWarehouse
                    ? item.branch?.branch_name || "N/A"
                    : item.client?.name || "N/A"}
                </strong>
                <div>
                  {isWarehouse
                    ? item.branch?.address || "N/A"
                    : item.client?.address || "N/A"}
                </div>
                <div>
                  {isWarehouse
                    ? item.branch?.city || ""
                    : item.client?.city || ""}
                  {isWarehouse && item.branch?.state
                    ? `, ${item.branch.state}`
                    : ""}
                  {!isWarehouse && item.client?.state
                    ? `, ${item.client.state}`
                    : ""}
                  <br></br>
                  {isWarehouse
                    ? item.branch?.pin_code || ""
                    : item.client?.pincode || ""}
                </div>
              </div>
            </Col>

            {/* Ship To */}
            <Col
              xs={6}
              style={{
                border: "1px solid #000",
                borderTop: "none",
                borderLeft: "none",
                padding: "6px 8px",
              }}
            >
              <div
                className="fw-bold border-bottom"
                style={{
                  paddingBottom: "4px",
                  marginBottom: "4px",
                  borderBottom: "1px solid #000",
                }}
              >
                Ship To
              </div>
              <div>
                <strong>
                  {isWarehouse
                    ? item.branch?.branch_name || "N/A"
                    : item.client?.name || "N/A"}
                </strong>
                <div>
                  {isWarehouse
                    ? item.branch?.address || "N/A"
                    : item.client?.address || "N/A"}
                </div>
                <div>
                  {isWarehouse
                    ? item.branch?.city || ""
                    : item.client?.city || ""}
                  {isWarehouse && item.branch?.state
                    ? `, ${item.branch.state}`
                    : ""}
                  {!isWarehouse && item.client?.state
                    ? `, ${item.client.state}`
                    : ""}
                  <br></br>
                  {isWarehouse
                    ? item.branch?.pin_code || ""
                    : item.client?.pincode || ""}
                </div>
              </div>
            </Col>
          </Row>

          {/* Subject */}
          <div
            style={{
              border: "1px solid #000",
              borderTop: "none",
              padding: "6px 8px",
              fontWeight: "bold",
            }}
          >
            Subject : {item.material || "N/A"}
          </div>

          {/* Item Table */}
          <Table
            bordered
            size="sm"
            style={{
              marginTop: "0",
              border: "1px solid #000",
              textAlign: "center",
              verticalAlign: "middle",
            }}
          >
            <thead
              style={{
                backgroundColor: "#f4f4f4",
                fontWeight: "bold",
                border: "1px solid #000",
              }}
            >
              <tr>
                <th style={{ width: "4%" }}>#</th>
                <th style={{ width: "35%" }}>Item & Description</th>
                <th style={{ width: "8%" }}>HSN</th>
                <th style={{ width: "6%" }}>Qty</th>
                <th style={{ width: "8%" }}>Rate</th>
                <th style={{ width: "10%" }}>Amount</th>
                <th style={{ width: "10%" }}>Taxable</th>
                <th style={{ width: "8%" }}>CGST</th>
                <th style={{ width: "8%" }}>SGST</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td style={{ textAlign: "left" }}>
                  <strong>{item.material}</strong>
                  <br />
                  Make: {item.brand?.brand_name || "N/A"}
                  <br />
                  Unit: {item.unit?.unit || "N/A"}
                </td>
                <td>{item.hsc_code || item.sac || "N/A"}</td>
                <td>1</td>
                <td>{basePrice.toFixed(2)}</td>
                <td>{basePrice.toFixed(2)}</td>
                <td>{basePrice.toFixed(2)}</td>
                <td>
                  {gst1}% <br /> {cgst.toFixed(2)}
                </td>
                <td>
                  {gst2}% <br /> {sgst.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </Table>

          {/* Totals */}
          <Row style={{ margin: 0 }}>
            <Col
              xs={6}
              style={{
                border: "1px solid #000",
                borderTop: "none",
                padding: "8px",
              }}
            >
              <div>
                <strong>Total:</strong> ₹ {total.toFixed(2)} Only <br />
                <strong>In Words:</strong> {totalInWords} Rupees{" "}
                {paise > 0 ? `and ${toWords(paise)} Paise` : ""} Only
              </div>
            </Col>
            <Col xs={6} style={{ padding: 1 }}>
              <Table
                bordered
                size="sm"
                style={{
                  border: "1px solid #000",
                  marginBottom: 0,
                  color: "#000",
                  fontWeight: "bold",
                }}
              >
                <tbody>
                  <tr>
                    <th>Sub Total</th>
                    <td style={{ textAlign: "right", paddingRight: "10px" }}>
                      ₹ {basePrice.toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <th>CGST ({gst1}%)</th>
                    <td style={{ textAlign: "right", paddingRight: "10px" }}>
                      ₹ {cgst.toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <th>SGST ({gst2}%)</th>
                    <td style={{ textAlign: "right", paddingRight: "10px" }}>
                      ₹ {sgst.toFixed(2)}
                    </td>
                  </tr>
                  <tr
                    style={{
                      backgroundColor: "#fff",
                      borderTop: "2px solid #000",
                    }}
                  >
                    <th style={{ fontSize: "14px", paddingRight: "10px" }}>
                      Total
                    </th>
                    <td
                      style={{
                        textAlign: "right",
                        fontSize: "14px",
                        paddingRight: "10px",
                      }}
                    >
                      ₹ {total.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </Row>

          {/* Footer */}
          <div
            className="text-end fw-bold mt-4"
            style={{ marginRight: "20px" }}
          >
            For Solarpix Energy Pvt. Ltd.
            <div style={{ marginTop: "50px" }}>Authorized Signatory</div>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="primary" onClick={handleDownload}>
          Download PDF
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalQuotation;
