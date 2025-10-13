// Created by Sufyan | Modified by Rishi on 13 Oct 2025

import React, { useRef, useEffect } from "react";
import { Modal, Button, Table, Row, Col } from "react-bootstrap";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import logo from "../../../../assets/images/logo/main_logo.jpg"; // adjust path

const NewQuotationModal = ({ show, handleClose, deal }) => {
  const modalContentRef = useRef(null);

  useEffect(() => {
    if (show) {
      // deal data already passed from parent
    }
  }, [show]);

  if (!deal) return null;

  const assignedEmployee = deal.senderBy || { name: "Admin" };
  const itemDetails = deal?.item_details || {};
  const selectedCategories = itemDetails?.selectedCategories || [];
  const overallGrandTotal = itemDetails?.overallGrandTotal || 0;

  const handleDownload = () => {
    const input = modalContentRef.current;
    html2canvas(input, { scale: 2 })
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const pageWidth = 210;
        const pageHeight = 297;
        const marginX = 10;
        const marginY = 10;
        const usableWidth = pageWidth - marginX * 2;

        const imgHeight = (canvas.height * usableWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = marginY;

        pdf.addImage(imgData, "PNG", marginX, position, usableWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft > 0) {
          position = heightLeft - imgHeight + marginY;
          pdf.addPage();
          pdf.addImage(
            imgData,
            "PNG",
            marginX,
            position,
            usableWidth,
            imgHeight
          );
          heightLeft -= pageHeight;
        }

        pdf.save("quotation.pdf");
      })
      .catch((error) => {
        console.error("Error generating PDF:", error);
        alert("Failed to generate PDF. Please try again.");
      });
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="lg"
      centered
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title>Quotation</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div
          ref={modalContentRef}
          style={{
            fontFamily: "Arial, sans-serif",
            fontSize: "12px",
            color: "#000",
          }}
        >
          {/* HEADER */}
          <Row className="align-items-center border-bottom pb-2 mb-2">
            <Col xs={8}>
              <h6 className="fw-bold">Solarpix Energy Pvt. Ltd.</h6>
              <div>Address: 312, Ratan Apt no 3, Ganeshpeth, Nagpur-440018</div>
              <div>Phone: 9096941011 / 9552383397</div>
              <div>Email: office.solarpix@gmail.com</div>
              <div>GSTIN: 27ABCDE1234F1Z5</div>
              <div>State: Maharashtra</div>
            </Col>
            <Col xs={4} className="text-end">
              <img src={logo} alt="Logo" style={{ maxWidth: "80px" }} />
            </Col>
          </Row>

          {/* QUOTE INFO */}
          <div className="text-center mb-2">
            <strong>Quotation</strong>
          </div>

          <div className="mb-2">
            <div>
              <strong>Quote #:</strong> {deal.quotation_no || "QT-000"}
            </div>
            <div>
              <strong>Quote Date:</strong>{" "}
              {deal.Qt_date
                ? new Date(deal.Qt_date).toLocaleDateString("en-GB")
                : "N/A"}
            </div>
            <div>
              <strong>Place of Supply:</strong> Maharashtra (27)
            </div>
          </div>
          <hr />
          {/* BILL & SHIP TO */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "20px",
            }}
            className="mb-2"
          >
            <div style={{ flex: 1 }}>
              <strong>Bill To:</strong>
              <div>{deal.lead?.name || "N/A"}</div>
              <div>{deal.lead?.billing_address}</div>
              <div>
                {deal.lead?.billing_city}, {deal.lead?.billing_state} -{" "}
                {deal.lead?.billing_pincode}
              </div>
            </div>

            <div style={{ flex: 1, textAlign: "left" }}>
              <strong>Ship To:</strong>
              <div>{deal.lead?.name || "N/A"}</div>
              <div>{deal.lead?.shipping_address}</div>
              <div>
                {deal.lead?.shipping_city}, {deal.lead?.shipping_state} -{" "}
                {deal.lead?.shipping_pincode}
              </div>
            </div>
          </div>
          <hr />
          {/* SUBJECT */}
          <div className="mb-2">
            <strong>Subject:</strong> {deal.description || "Solar Power System"}
          </div>

          {/* ITEMS TABLE */}
          <Table bordered size="sm" className="text-center">
            <thead>
              <tr>
                <th>#</th>
                <th>Item & Description</th>
                <th>Qty</th>
                <th>Rate</th>
                <th>CGST</th>
                <th>SGST / IGST</th>
                <th>Amount</th>
              </tr>
            </thead>

            <tbody>
              {selectedCategories.map((category, index) => {
                const isTaxable = category.taxPreference?.name === "Taxable";
                const cgst = category.cgst || 0; // Direct CGST from response
                const sgst = category.sgst || 0; // Direct SGST from response
                const igst = category.interTax?.inter_per
                  ? (category.grandTotal * category.interTax.inter_per) / 100
                  : 0; // IGST only if interTax exists
                const totalAmount = category.finalAmount || category.grandTotal; // Use finalAmount or grandTotal

                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                      {category.name}
                      <br />
                      <small className="text-muted">
                        ({category.taxPreference?.name || "N/A"})
                      </small>
                      <br />
                      <small className="text-muted">
                        Tax Type:{" "}
                        {isTaxable
                          ? category.intraTax
                            ? "Intra (CGST + SGST)"
                            : "Inter (IGST)"
                          : "Out of Scope"}
                      </small>
                    </td>
                    <td>{category.totalQuantity}</td>
                    <td>
                      ₹{Number(category.items?.[0]?.price || 0).toFixed(2)}
                    </td>
                    {category.intraTax ? (
                      <>
                        <td>₹{Number(cgst).toFixed(2)}</td>
                        <td>₹{Number(sgst).toFixed(2)}</td>
                      </>
                    ) : (
                      <td colSpan="2">₹{Number(igst).toFixed(2)}</td>
                    )}
                    <td>₹{Number(totalAmount).toFixed(2)}</td>
                  </tr>
                );
              })}

              {/* Subtotal */}
              <tr>
                <td colSpan="6" className="text-right">
                  <strong>Sub Total</strong>
                </td>
                <td>₹{deal.sub_total}</td>
              </tr>

              {/* TDS */}
              {deal.TDS && (
                <tr>
                  <td colSpan="6" className="text-right">
                    {deal.TDS.name} ({deal.TDS.percentage}%)
                  </td>
                  <td>-₹{deal.deductionAmount}</td>
                </tr>
              )}

              {/* Adjustment */}
              <tr>
                <td colSpan="6" className="text-right">
                  <strong>Adjustment</strong>
                </td>
                <td>₹{deal.adjustment || 0}</td>
              </tr>

              {/* Total */}
              <tr>
                <td colSpan="6" className="text-right">
                  <strong>Total</strong>
                </td>
                <td>₹{Number(deal.total || 0).toFixed(2)}</td>
              </tr>
            </tbody>
          </Table>

          {/* TOTAL IN WORDS */}
          <div className="mb-2">
            <strong>Total in Words:</strong>{" "}
            {deal.total
              ? `Indian Rupees ${Number(deal.total).toLocaleString(
                  "en-IN"
                )} Only`
              : "N/A"}
          </div>

          {/* NOTES */}
          <div className="mb-2">
            <strong>Notes:</strong>
            <ul>
              <li>Subsidy - ₹78,000/-</li>
              <li>
                Solar Panel Warranty = 12 Years Product, 13 Years Performance
              </li>
              <li>Solar On-Grid Inverter Warranty = 7-10 Years</li>
              <li>Service = 5 Years CMC</li>
              {deal.notes_customer && <li>{deal.notes_customer}</li>}
            </ul>
          </div>

          {/* TERMS AND BANK DETAILS */}
          <div className="mb-2">
            <strong>Terms & Conditions / Bank Details:</strong>
            <div>
              <strong>Bank Name:</strong> {deal.companyBank?.bank_name || "N/A"}
            </div>
            <div>
              <strong>Acc Name:</strong> {deal.companyBank?.acc_name || "N/A"}
            </div>
            <div>
              <strong>Acc No:</strong> {deal.companyBank?.acc_no || "N/A"}
            </div>
            <div>
              <strong>IFSC Code:</strong> {deal.companyBank?.IFSC_code || "N/A"}
            </div>
            <div>
              <strong>Acc Type:</strong> {deal.companyBank?.acc_type || "N/A"}
            </div>
          </div>

          {/* SIGNATURE */}
          <div className="text-right mb-2">
            <div>For Solarpix Energy Pvt. Ltd.</div>
            <div>Authorized Signatory</div>
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

export default NewQuotationModal;
