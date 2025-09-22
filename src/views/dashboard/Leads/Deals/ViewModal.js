import React from "react";
import { Modal, Row, Col, Table, Button } from "react-bootstrap";
import logo from "../../../../assets/images/logo/main_logo.jpg"; // adjust path

const ViewModal = ({ show, handleClose, viewData }) => {
  if (!viewData) return null; // safeguard

  // Total Amount calculation
  const totalAmount =
    (Number(viewData.sol_amt || 0) || 0) + (Number(viewData.inv_amt || 0) || 0);

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      backdrop="static"
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>Quotation Details</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* Header Section */}
        <Row className="mb-4 pe-2">
          <Col md={6}>
            <h5 className="fw-lighter mb-2">Lead Details</h5>
            <p className="mb-1">
              <strong>Deal Name:</strong>{" "}
              <span className="text-muted">{viewData.deal_name || "N/A"}</span>
            </p>
            <p className="mb-1">
              <strong>Lead Name:</strong>{" "}
              <span className="text-muted">{viewData.lead?.name || "N/A"}</span>
            </p>
            <p className="mb-1">
              <strong>Lead Address:</strong>{" "}
              <span className="text-muted">
                {viewData.lead?.address || "N/A"}
              </span>
            </p>
            <p className="mb-1">
              <strong>Site Visit Date:</strong>{" "}
              <span className="text-muted">
                {viewData.site_visit_date
                  ? new Date(viewData.site_visit_date).toLocaleDateString(
                      "en-GB"
                    )
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
            <h5 className="fw-bold mb-1">Solarpix Energy Pvt Ltd</h5>
            <small className="text-muted" style={{ lineHeight: "1.4" }}>
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
                {viewData.invSeller?.name
                  ? `${viewData.invSeller.name} (${viewData.invSeller.company_name})`
                  : "N/A"}
              </td>
              <td>{viewData.inv_cap || "N/A"}</td>
              <td>₹{viewData.inv_rate || 0}</td>
              <td>{viewData.inv_qty || 0}</td>
              <td>₹{viewData.inv_amt || 0}</td>
            </tr>
          </tbody>
        </Table>

        {/* Total Amount */}
        <Row className="mt-3">
          <Col className="text-end">
            <h6>Total Amount: ₹{totalAmount.toLocaleString()}</h6>
          </Col>
        </Row>

        {/* Remarks / Description */}
        <Row className="mt-3">
          <Col>
            <strong>Remarks:</strong> {viewData.description || "N/A"}
          </Col>
        </Row>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ViewModal;
