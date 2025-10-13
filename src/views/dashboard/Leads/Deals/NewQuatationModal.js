import React, { useRef, useEffect } from "react";
import { Modal, Button, Table, Row, Col } from "react-bootstrap";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import logo from "../../../../assets/images/logo/main_logo.jpg"; // Adjust path

const NewQuotationModal = ({ show, handleClose, deal }) => {
  const modalContentRef = useRef(null);

  useEffect(() => {
    if (show) {
      // No API call needed as per your request, assuming deal is provided
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
          {/* HEADER WITH LOGO */}
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

          {/* TITLE AND INFO */}
          <div className="text-center mb-2">
            <strong>Quotation</strong>
          </div>
          <div className="mb-2">
            <div>
              <strong>Quote #:</strong> {deal.quotation_no || "QT-037"}
            </div>
            <div>
              <strong>Quote Date:</strong>{" "}
              {deal.Qt_date
                ? new Date(deal.Qt_date).toLocaleDateString("en-GB")
                : "04/10/2024"}
            </div>
            <div>
              <strong>Place of Supply:</strong> Maharashtra (27)
            </div>
          </div>

          {/* BILL TO AND SHIP TO */}
          <div className="mb-2">
            <div>
              <strong>Bill To:</strong>
            </div>
            <div>{deal.lead?.name || "Mr. Shankar Zade"}</div>
            <div>
              {deal.lead?.billing_address ||
                "At. Mahagaon Ta. Aheri, Dist. Gadchiroli"}
            </div>
            <div>{deal.lead?.billing_city || "442705"} Maharashtra, India</div>
          </div>
          <div className="mb-2">
            <div>
              <strong>Ship To:</strong>
            </div>
            <div>{deal.lead?.name || "Mr. Shankar Zade"}</div>
            <div>
              {deal.lead?.billing_address ||
                "At. Mahagaon Ta. Aheri, Dist. Gadchiroli"}
            </div>
            <div>{deal.lead?.billing_city || "442705"} Maharashtra, India</div>
          </div>

          {/* SUBJECT */}
          <div className="mb-2">
            <strong>Subject:</strong> 3.8KW Solar Power Generating System
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
                <th>SGST</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {selectedCategories.map((category, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{category.name}</td>
                  <td>{category.totalQuantity}</td>
                  <td>₹{category.grandTotal / category.totalQuantity}</td>
                  <td>₹{(category.grandTotal * 0.06).toFixed(2)}</td>
                  <td>₹{(category.grandTotal * 0.06).toFixed(2)}</td>
                  <td>₹{category.grandTotal}</td>
                </tr>
              ))}
              <tr>
                <td colSpan="6" className="text-right">
                  <strong>Sub Total</strong>
                </td>
                <td>₹{overallGrandTotal}</td>
              </tr>
              {deal.TDS && (
                <tr>
                  <td colSpan="6" className="text-right">
                    {deal.TDS.name} ({deal.TDS.percentage}%)
                  </td>
                  <td>
                    -₹
                    {((deal.TDS.percentage / 100) * overallGrandTotal).toFixed(
                      2
                    )}
                  </td>
                </tr>
              )}
              <tr>
                <td colSpan="6" className="text-right">
                  <strong>Adjustment</strong>
                </td>
                <td>₹{deal.adjustment || 0}</td>
              </tr>
              <tr>
                <td colSpan="6" className="text-right">
                  <strong>Total</strong>
                </td>
                <td>₹{deal.total || overallGrandTotal}</td>
              </tr>
            </tbody>
          </Table>

          {/* TOTAL IN WORDS */}
          <div className="mb-2">
            <strong>Total in Words:</strong>{" "}
            {deal.total
              ? `Indian Rupee ${deal.total
                  .toLocaleString("en-IN", {
                    style: "currency",
                    currency: "INR",
                  })
                  .replace("₹", "")
                  .trim()} Only`
              : "N/A"}
          </div>

          {/* NOTES */}
          <div className="mb-2">
            <strong>Notes:</strong>
            <ul>
              <li>Subsidy - 78000/-</li>
              <li>
                Solar Panel Warranty = 12 Year Product, 13 Year Performance
              </li>
              <li>Solar On-Grid Inverter Warranty = 7-10 Years</li>
              <li>Service = 5 Year CMC</li>
            </ul>
          </div>

          {/* TERMS AND BANK DETAILS */}
          <div className="mb-2">
            <strong>Terms & Conditions / Bank Details:</strong>
            <div>
              <strong>Bank Name:</strong>{" "}
              {deal.companyBank?.bank_name || "HDFC Bank"}
            </div>
            <div>
              <strong>Acc Name:</strong>{" "}
              {deal.companyBank?.acc_name || "Solarpix Enterprises"}
            </div>
            <div>
              <strong>Acc No:</strong>{" "}
              {deal.companyBank?.acc_no || "50200044383342"}
            </div>
            <div>
              <strong>IFSC Code:</strong>{" "}
              {deal.companyBank?.IFSC_code || "HDFC0005409"}
            </div>
            <div>
              <strong>Acc Type:</strong>{" "}
              {deal.companyBank?.acc_type || "Current"}
            </div>
          </div>

          {/* SIGNATURE */}
          <div className="text-right mb-2">
            <div>For Solarpix Enterprises 24-25</div>
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
