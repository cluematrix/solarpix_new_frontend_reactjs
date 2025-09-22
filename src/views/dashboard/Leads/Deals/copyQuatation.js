import React, { useRef, useEffect, useState } from "react";
import { Modal, Button, Row, Col, Table } from "react-bootstrap";
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
        const imgWidth = 210;
        const pageHeight = 297;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
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
        <Modal.Title className="fw-bold">Quotation Details</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div
          className="p-3 border rounded bg-white"
          ref={modalContentRef}
          style={{
            fontFamily: "Arial, sans-serif",
            color: "#333",
          }}
        >
          {/* Header Section */}
          <Row className="align-items-start ">
            <div className="d-flex justify-content-end ">
              <img
                src={logo}
                alt="Logo"
                className="img-fluid mb-2"
                style={{ maxWidth: "50px", height: "auto" }}
              />
            </div>
            <div className="d-flex justify-content-between ">
              <Col xs={12} md={6}>
                <div className="">
                  <strong>Quotation No:</strong> {deal.quotation_no || "N/A"}
                </div>
                {/* <div className=" mt-2">
                <strong>Deal Name:</strong> {deal.deal_name || "N/A"}
              </div> */}
                <div className="">
                  <strong>Name:</strong> {deal.lead?.name || "N/A"}
                </div>
                <div className="">
                  <strong>Address:</strong>{" "}
                  {`${deal.lead?.address || "N/A"}, ${
                    deal.lead?.city || "N/A"
                  }, ${deal.lead?.state || "N/A"} - ${
                    deal.lead?.pincode || "N/A"
                  }`}
                </div>

                <div className="">
                  <strong>Contact No:</strong> {deal.lead?.contact || "N/A"}
                </div>
                <div className="">
                  <strong>Email:</strong> {deal.lead?.email || "N/A"}
                </div>
                {/* <div className="">
                <strong>Site Visit Date:</strong>{" "}
                {deal.site_visit_date
                  ? new Date(deal.site_visit_date)
                      .toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })
                      .replace("am", "AM")
                      .replace("pm", "PM")
                  : ""}
              </div> */}
                {/* <div className="">
                <strong>Assign To:</strong>{" "}
                {assignedEmployee ? `${assignedEmployee.name}` : "N/A"}
              </div> */}
              </Col>

              <Col xs={12} md={6} className="text-md-end text-center">
                <h6 className="fw-bold mb-1">Solarpix Energy Pvt Ltd</h6>
                <small className="d-block">
                  312, Ratan Apt no 3, Ganeshpeth Nagpur-440018 <br />
                  In front of Paper mill office, Chamorshi Road,
                  Gadchiroli-442605
                  <br />
                  <span className="d-block">
                    Contact No: 9096941011 / 9552383397
                  </span>
                  <span className="d-block">
                    Email: office.solarpix@gmail.com
                  </span>
                </small>
              </Col>
            </div>
          </Row>

          {/* Solar Panel Table */}
          <h6 className="fw-bold mt-3">Solar Panel Details</h6>
          <div className="table-responsive">
            <Table bordered size="sm" className="align-middle text-center">
              <thead className="table-light">
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
          </div>

          {/* Inverter Table */}
          <h6 className="fw-bold mt-3">Inverter Details</h6>
          <div className="table-responsive">
            <Table bordered size="sm" className="align-middle text-center">
              <thead className="table-light">
                <tr>
                  <th>Seller</th>
                  <th>Capacity</th>
                  <th>Rate</th>
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
                  <td>₹{deal.inv_amt || 0}</td>
                </tr>
              </tbody>
            </Table>
          </div>

          {/* Total Amount */}
          <Row className="mt-3">
            <Col className="text-md-end text-center">
              <h6 className="fw-bold">
                Total Amount: ₹{totalAmount.toLocaleString()}
              </h6>
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

      <Modal.Footer className="d-flex flex-wrap justify-content-between gap-2">
        <Button
          variant="primary"
          onClick={handleDownload}
          className="w-100 w-sm-auto"
        >
          Download Invoice
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default QuotationModal;
