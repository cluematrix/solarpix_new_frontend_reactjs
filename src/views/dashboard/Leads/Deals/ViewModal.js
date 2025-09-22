import React, { useEffect, useState } from "react";
import { Modal, Row, Col, Table, Button } from "react-bootstrap";
import logo from "../../../../assets/images/logo/main_logo.jpg"; // adjust path
import api from "../../../../api/axios"; // adjust path to your api wrapper

const ViewModal = ({ show, handleClose, viewData }) => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    if (show) {
      api
        .get("/api/v1/admin/employee/active")
        .then((res) => {
          setEmployees(res.data.data || []);
        })
        .catch((err) => console.error("Error fetching employees:", err));
    }
  }, [show]);

  if (!viewData) return null;

  // Calculate Total Amount
  const totalAmount =
    (Number(viewData.sol_amt || 0) || 0) + (Number(viewData.inv_amt || 0) || 0);

  // Find assigned employee
  const assignedEmployee = employees.find(
    (emp) => emp.id === viewData.sender_by_id
  );

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold">Quotation Details</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div
          className="p-3 border rounded bg-white"
          style={{
            fontFamily: "Arial, sans-serif",
            color: "#333",
          }}
        >
          {/* Header Section */}
          <Row className="align-items-start">
            <Col xs={12} md={6} className="mb-3">
              <div className="mb-1 mt-2">
                <strong>Deal Name:</strong> {viewData.deal_name || "N/A"}
              </div>
              <div className="mb-1">
                <strong>Lead Name:</strong> {viewData.lead?.name || "N/A"}
              </div>
              <div className="mb-1">
                <strong>Lead Address:</strong> {viewData.lead?.address || "N/A"}
              </div>
              <div className="mb-1">
                <strong>Site Visit Date:</strong>{" "}
                {viewData.site_visit_date
                  ? new Date(viewData.site_visit_date)
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
              </div>
              <div className="mb-1">
                <strong>Assign To:</strong>{" "}
                {assignedEmployee ? `${assignedEmployee.name}` : "N/A"}
              </div>
            </Col>

            <Col xs={12} md={6} className="text-md-end text-center">
              <img
                src={logo}
                alt="Logo"
                className="img-fluid mb-2"
                style={{ maxWidth: "80px", height: "auto" }}
              />
              <h6 className="fw-bold mb-1">Solarpix Energy Pvt Ltd</h6>
              <small className="d-block">
                312, Ratan Apt no 3, Ganeshpeth Nagpur-440018 <br />
                In front of Paper mill office, Chamorshi Road, Gadchiroli-442605
                <br />
                <span className="d-block">
                  Contact: 9096941011 / 9552383397
                </span>
                <span className="d-block">
                  Email: office.solarpix@gmail.com
                </span>
              </small>
            </Col>
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
                    {viewData.solSeller?.name
                      ? `${viewData.solSeller.name} (${viewData.solSeller.company_name})`
                      : "N/A"}
                  </td>
                  <td>{viewData.sol_cap || "N/A"}</td>
                  <td>₹{viewData.sol_rate || 0}</td>
                  <td>{viewData.sol_qty || 0}</td>
                  <td>₹{viewData.sol_amt || 0}</td>
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
                    {viewData.invSeller?.name
                      ? `${viewData.invSeller.name} (${viewData.invSeller.company_name})`
                      : "N/A"}
                  </td>
                  <td>{viewData.inv_cap || "N/A"}</td>
                  <td>₹{viewData.inv_rate || 0}</td>
                  <td>₹{viewData.inv_amt || 0}</td>
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
              <strong>Remarks:</strong> {viewData.description || "N/A"}
            </Col>
          </Row>
        </div>
      </Modal.Body>

      <Modal.Footer className="d-flex flex-wrap justify-content-between gap-2">
        <Button
          variant="secondary"
          onClick={handleClose}
          className="w-100 w-sm-auto"
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ViewModal;
