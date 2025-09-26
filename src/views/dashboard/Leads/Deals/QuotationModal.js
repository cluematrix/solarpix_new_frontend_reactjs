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
    (emp) => emp.id === deal.sender_by_id
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
  const subtotal =
    (Number(deal.sol_amt || 0) || 0) + (Number(deal.inv_amt || 0) || 0);

  const total = subtotal;
  const advance = Number(deal.advance || 0);
  const balance = total - advance;

  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="xl"
      centered
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold">Quotation</Modal.Title>
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
                {`${deal.lead?.address || "N/A"}, ${
                  deal.lead?.city || "N/A"
                }, ${deal.lead?.state || "N/A"} - ${
                  deal.lead?.pincode || "N/A"
                }`}
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
                <strong>Invoice No.:</strong> {deal.quotation_no || "N/A"}
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

              {/* <div>
                <strong>GSTIN No.:</strong> {deal.gstin || "N/A"}
              </div> */}
              {/* <div>
                <strong>State:</strong> {deal.lead?.state || "N/A"}
              </div> */}
            </Col>
          </Row>

          {/* Items Table */}
          <Table bordered size="sm" className="align-middle text-center">
            <thead className="table-light">
              <tr>
                <th>Sr No</th>
                <th>Items</th>
                <th>Capacity</th>
                <th>Qty</th>
                {/* <th>Unit</th> */}
                <th>Rate</th>
                {/* <th>GST</th> */}
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Solar Panel</td>
                <td>{deal.sol_cap || "N/A"}</td>
                <td>{deal.sol_qty || 0}</td>
                {/* <td>Nos</td> */}
                <td>{deal.sol_rate || 0}</td>
                {/* <td>5%</td> */}
                <td>₹{deal.sol_amt || 0}</td>
              </tr>
              <tr>
                <td>2</td>
                <td>Inverter</td>
                <td>{deal.inv_cap || "N/A"}</td>
                <td></td>
                {/* <td>Nos</td> */}
                <td>{deal.inv_rate || 0}</td>
                {/* <td>5%</td> */}
                <td>₹{deal.inv_amt || 0}</td>
              </tr>
              {/* Add more rows if needed */}
            </tbody>
          </Table>

          {/* Totals Section */}
          <Row className="justify-content-end">
            <Col xs={6}>
              <Table bordered size="sm">
                <tbody>
                  {/* <tr>
                    <td>
                      <strong>Sub Total</strong>
                    </td>
                    <td className="text-end">{subtotal.toFixed(2)}</td>
                  </tr> */}
                  {/* <tr>
                    <td>SGST (2.5%)</td>
                    <td className="text-end">{sgst.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>CGST (2.5%)</td>
                    <td className="text-end">{cgst.toFixed(2)}</td>
                  </tr> */}
                  <tr className="table-light">
                    <td>
                      <strong>Total</strong>
                    </td>
                    <td className="text-end fw-bold">₹{total.toFixed(2)}</td>
                  </tr>
                  {/* <tr>
                    <td>Advance</td>
                    <td className="text-end">{advance.toFixed(2)}</td>
                  </tr> */}
                  {/* <tr>
                    <td>
                      <strong>Balance</strong>
                    </td>
                    <td className="text-end fw-bold">{balance.toFixed(2)}</td>
                  </tr> */}
                </tbody>
              </Table>
            </Col>
          </Row>

          {/* Amount in words */}
          <div className="mt-2">
            <strong>Amount in words:</strong> (Rupees {Math.round(total)} only)
          </div>

          {/* Terms & Conditions */}
          <div className="mt-3">
            <h6 className="fw-bold">Terms & Conditions</h6>
            <p style={{ fontSize: "13px" }}>
              1. Prices are inclusive of GST. <br />
              2. Quotation valid for 30 days from issue date. <br />
              3. Payment terms as discussed. <br />
              4. Installation charges extra if applicable.
            </p>
          </div>

          {/* Footer */}
          <Row className="mt-4">
            <Col className="text-end">
              <div className="fw-bold">For Company Name</div>
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
