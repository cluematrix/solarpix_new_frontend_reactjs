import React, { useRef, useEffect, useState } from "react";
import { Modal, Button, Table, Row, Col } from "react-bootstrap";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import logo from "../../../../assets/images/logo/main_logo.jpg"; // Adjust path
import api from "../../../../api/axios"; // Adjust path

const QuotationModal = ({ show, handleClose, deal }) => {
  const modalContentRef = useRef(null);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    if (show) {
      api
        .get("/api/v1/admin/employee/active")
        .then((res) => setEmployees(res.data.data || []))
        .catch((err) => console.error("Error fetching employees:", err));
    }
  }, [show]);

  if (!deal) return null;

  // Find assigned employee
  const assignedEmployee = employees.find(
    (emp) => emp.id === deal.assign_to_emp_id
  );

  // Download Modal Snapshot as PDF
  const handleDownload = () => {
    const input = modalContentRef.current;
    html2canvas(input, { scale: 2, useCORS: true })
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");

        const pageWidth = 210; // A4 width mm
        const pageHeight = 297; // A4 height mm
        const marginX = 10; // left/right margin
        const marginY = 10; // top margin
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

  // Amount calculations
  const subtotal = Number(deal.sub_total || 0);
  const deduction = Number(deal.deductionAmount || 0);
  const total = Number(deal.total || 0);

  // Convert number to words (simplified, can be enhanced)
  const numberToWords = (num) => {
    const units = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
    ];
    if (num === 0) return "Zero";
    return units[Math.round(num)] || Math.round(num).toString();
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="xl"
      centered
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold">Sales Quotation</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div
          className="p-3 border bg-white"
          ref={modalContentRef}
          style={{
            fontFamily: "Arial, sans-serif",
            fontSize: "14px",
            color: "#333",
          }}
        >
          {/* Header */}
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

          {/* Quotation title */}
          <div className="bg-primary text-white text-center fw-bold py-1 mb-3">
            Quotation
          </div>

          {/* Bill To + Invoice Info */}
          <Row className="mb-3">
            <Col xs={6}>
              <h6 className="fw-bold">Bill To:</h6>
              <div>
                <strong>Name:</strong> {deal.lead?.name || "N/A"}
              </div>
              <div>
                <strong>Address:</strong>{" "}
                {deal.lead?.address
                  ? `${deal.lead.address}, ${deal.lead.city || "N/A"}, ${
                      deal.lead.state || "N/A"
                    } - ${deal.lead.pincode || "N/A"}`
                  : "N/A"}
              </div>
              <div>
                <strong>Contact:</strong> {deal.lead?.contact || "N/A"}
              </div>
              <div>
                <strong>Email:</strong> {deal.lead?.email || "N/A"}
              </div>
            </Col>
            <Col xs={6} className="text-end">
              <div>
                <strong>Sales Order No.:</strong> {deal.sales_order_no || "N/A"}
              </div>
              <div>
                <strong>Date:</strong>{" "}
                {deal.created_at
                  ? new Date(deal.created_at).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                  : "DD/MM/YYYY"}
              </div>
              <div>
                <strong>Payment Terms:</strong>{" "}
                {deal.paymentTerm?.payment_term || "N/A"}
              </div>
              <div>
                <strong>Assigned To:</strong>{" "}
                {assignedEmployee?.name || deal.AssignToEmp?.name || "N/A"}
              </div>
            </Col>
          </Row>

          {/* Items Table */}
          <Table bordered size="sm" className="align-middle text-center">
            <thead className="table-light">
              <tr>
                <th>Sr No</th>
                <th>Category</th>
                <th>Item</th>
                <th>Quantity</th>
                <th>Rate</th>
                <th>Tax</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {deal.item_details?.selectedCategories?.map((category, index) =>
                category.items.map((item, itemIndex) => (
                  <tr key={`${category.id}-${item.id}`}>
                    <td>{index + itemIndex + 1}</td>
                    <td>{category.name}</td>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>₹{Number(item.price).toFixed(2)}</td>
                    <td>
                      {category.taxPreference?.name === "Taxable"
                        ? category.intraTax
                          ? `GST ${category.intraTax.intra_per}%`
                          : category.interTax
                          ? `GST ${category.interTax.inter_per}%`
                          : "N/A"
                        : category.taxPreference?.name || "N/A"}
                    </td>
                    <td>₹{Number(item.total).toFixed(2)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>

          {/* Totals Section */}
          <Row className="justify-content-end">
            <Col xs={6}>
              <Table bordered size="sm">
                <tbody>
                  <tr>
                    <td>
                      <strong>Sub Total</strong>
                    </td>
                    <td className="text-end">₹{subtotal.toFixed(2)}</td>
                  </tr>
                  {deal.TDS && (
                    <tr>
                      <td>{deal.TDS.name}</td>
                      <td className="text-end">₹{deduction.toFixed(2)}</td>
                    </tr>
                  )}
                  <tr className="table-light">
                    <td>
                      <strong>Total</strong>
                    </td>
                    <td className="text-end fw-bold">₹{total.toFixed(2)}</td>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </Row>

          {/* Amount in words */}
          <div className="mt-2">
            <strong>Amount in words:</strong> (Rupees {numberToWords(total)}{" "}
            only)
          </div>

          {/* Bank Details */}
          <div className="mt-3">
            <h6 className="fw-bold">Bank Details</h6>
            <div>
              <strong>Bank Name:</strong> {deal.companyBank?.bank_name || "N/A"}
            </div>
            <div>
              <strong>Account Name:</strong>{" "}
              {deal.companyBank?.acc_name || "N/A"}
            </div>
            <div>
              <strong>Account Number:</strong>{" "}
              {deal.companyBank?.acc_no || "N/A"}
            </div>
            <div>
              <strong>IFSC Code:</strong> {deal.companyBank?.IFSC_code || "N/A"}
            </div>
            <div>
              <strong>Account Type:</strong>{" "}
              {deal.companyBank?.acc_type || "N/A"}
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="mt-3">
            <h6 className="fw-bold">Terms & Conditions</h6>
            <p style={{ fontSize: "13px" }}>
              1. Prices are inclusive of GST unless specified otherwise. <br />
              2. Quotation valid for 30 days from issue date. <br />
              3. Payment terms: {deal.paymentTerm?.payment_term || "N/A"}.{" "}
              <br />
              4. Installation charges extra if applicable. <br />
              5. {deal.notes_customer || "No additional notes."}
            </p>
          </div>

          {/* Footer */}
          <Row className="mt-4">
            <Col className="text-end">
              <div className="fw-bold">For Solarpix Energy Pvt. Ltd.</div>
              <div style={{ marginTop: "50px" }}>Authorized Signatory</div>
            </Col>
          </Row>
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

export default QuotationModal;
