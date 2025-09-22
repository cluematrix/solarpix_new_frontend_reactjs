import React, { useRef } from "react";
import { Modal, Button, Row, Col, Table } from "react-bootstrap";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import logo from "../../../../assets/images/logo/main_logo.jpg"; // Adjust path

const QuotationModal = ({ show, handleClose, deal }) => {
  const modalContentRef = useRef(null);

  if (!deal) return null;

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

  // Calculate Total Amount dynamically
  const totalAmount =
    (Number(deal.sol_amt || 0) || 0) + (Number(deal.inv_amt || 0) || 0);

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Quotation Details</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="p-2 border rounded bg-white" ref={modalContentRef}>
          {/* Header Section */}
          <Row className="mb-3">
            <Col md={6}>
              <h5 className="fw-lighter mb-2">Lead Details</h5>
              <p className="mb-1">
                <strong>Deal Name:</strong>{" "}
                <span className="text-muted"> {deal.deal_name || "N/A"}</span>
              </p>
              <p className="mb-1">
                <strong>Lead Name:</strong>
                <span className="text-muted">{deal.lead?.name || "N/A"}</span>
              </p>
              <p className="mb-1">
                <strong>Lead Address:</strong>
                <span className="text-muted">
                  {deal.lead?.address || "N/A"}
                </span>
              </p>
              <p className="mb-1">
                <strong>Site Visit Date:</strong>{" "}
                <span className="text-muted">
                  {deal.site_visit_date
                    ? new Date(deal.site_visit_date).toLocaleDateString("en-GB")
                    : "N/A"}
                </span>
              </p>
            </Col>

            <Col md={6} className="text-end">
              <img
                src={logo}
                alt="Logo"
                style={{
                  maxWidth: "100px",
                  height: "auto",
                  marginBottom: "10px",
                }}
              />
              <h5>Solarpix Energy Pvt Ltd</h5>
              <small>
                312, Ratan Apt no 3, Ganeshpeth Nagpur-440018 <br />
                In front of Paper mill office, Chamorshi Road, Gadchiroli-442605{" "}
                <br />
                Contact: 9096941011 / 9552383397 <br />
                Email: office.solarpix@gmail.com
              </small>
            </Col>
          </Row>

          {/* Solar Panel Table */}
          <h6 className="mt-3 mb-1">Solar Panel Details</h6>
          <Table bordered size="sm">
            <thead>
              <tr>
                <th>Seller</th>
                <th>Capacity</th>
                <th>Rate</th>
                <th>Quantity</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  {deal.solSeller?.name
                    ? `${deal.solSeller.name} (${deal.solSeller.company_name})`
                    : "N/A"}
                </td>
                <td>{deal.sol_cap || "N/A"}</td>
                <td>₹{deal.sol_rate || 0}</td>
                <td>{deal.sol_qty || 0}</td>
                <td>₹{deal.sol_amt || 0}</td>
              </tr>
            </tbody>
          </Table>

          {/* Inverter Table */}
          <h6 className="mt-3 mb-1">Inverter Details</h6>
          <Table bordered size="sm">
            <thead>
              <tr>
                <th>Seller</th>
                <th>Capacity</th>
                <th>Rate</th>
                <th>Quantity</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  {deal.invSeller?.name
                    ? `${deal.invSeller.name} (${deal.invSeller.company_name})`
                    : "N/A"}
                </td>
                <td>{deal.inv_cap || "N/A"}</td>
                <td>₹{deal.inv_rate || 0}</td>
                <td>{deal.inv_qty || 0}</td>
                <td>₹{deal.inv_amt || 0}</td>
              </tr>
            </tbody>
          </Table>

          {/* Total Amount */}
          <Row className="mt-3">
            <Col className="text-end">
              <h6>Total Amount: ₹{totalAmount.toLocaleString()}</h6>
            </Col>
          </Row>

          {/* Remarks */}
          <Row className="mt-3">
            <Col>
              <strong>Remarks:</strong> {deal.description || "N/A"}
            </Col>
          </Row>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleDownload}>
          Download Invoice
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default QuotationModal;
