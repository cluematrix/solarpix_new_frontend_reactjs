import React from "react";
import { Modal, Row, Col } from "react-bootstrap";

const ViewModal = ({ show, handleClose, lead }) => {
  if (!lead) return null;

  // Compute display name based on customer type
  const displayName =
    lead.customer_type === "Business"
      ? lead.name // company name
      : [lead.salutation, lead.name].filter(Boolean).join(" "); // Individual: salutation + name

  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="md"
      centered
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title className="fw-lighter fs-5">Lead Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="px-2">
          <Row className="mb-2">
            <Col xs={5} className="fw-semibold text-muted">
              Enquiry No.:
            </Col>
            <Col xs={7}>{lead.lead_number || lead.enquiry_number || "—"}</Col>
          </Row>

          <Row className="mb-2">
            <Col xs={5} className="fw-semibold text-muted">
              Customer Type:
            </Col>
            <Col xs={7}>{lead.customer_type || "—"}</Col>
          </Row>

          <Row className="mb-2">
            <Col xs={5} className="fw-semibold text-muted">
              Name:
            </Col>
            <Col xs={7}>{displayName || "—"}</Col>
          </Row>

          {lead.customer_type === "Individual" && (
            <Row className="mb-2">
              <Col xs={5} className="fw-semibold text-muted">
                Salutation:
              </Col>
              <Col xs={7}>{lead.salutation || "—"}</Col>
            </Row>
          )}

          <Row className="mb-2">
            <Col xs={5} className="fw-semibold text-muted">
              Email:
            </Col>
            <Col xs={7}>{lead.email || "—"}</Col>
          </Row>

          <Row className="mb-2">
            <Col xs={5} className="fw-semibold text-muted">
              Contact:
            </Col>
            <Col xs={7}>{lead.contact || "—"}</Col>
          </Row>

          <Row className="mb-2">
            <Col xs={5} className="fw-semibold text-muted">
              Lead Source:
            </Col>
            <Col xs={7}>
              {lead.lead_source_id?.lead_source ||
                lead.lead_source?.lead_source ||
                lead.leadSource?.lead_source ||
                "—"}
            </Col>
          </Row>

          <Row className="mb-2">
            <Col xs={5} className="fw-semibold text-muted">
              Added By:
            </Col>
            <Col xs={7}>
              {lead.added_by_id?.name ||
                lead.added_by?.name ||
                lead.addedBy?.name ||
                "—"}
            </Col>
          </Row>

          <Row className="mb-2">
            <Col xs={5} className="fw-semibold text-muted">
              Capacity (kW):
            </Col>
            <Col xs={7}>{lead.capacity || "—"}</Col>
          </Row>

          <Row className="mb-2">
            <Col xs={5} className="fw-semibold text-muted">
              State:
            </Col>
            <Col xs={7}>{lead.state || "—"}</Col>
          </Row>

          <Row className="mb-2">
            <Col xs={5} className="fw-semibold text-muted">
              City:
            </Col>
            <Col xs={7}>{lead.city || "—"}</Col>
          </Row>

          <Row className="mb-2">
            <Col xs={5} className="fw-semibold text-muted">
              Pincode:
            </Col>
            <Col xs={7}>{lead.pincode || "—"}</Col>
          </Row>

          <Row className="mb-2">
            <Col xs={5} className="fw-semibold text-muted">
              Address:
            </Col>
            <Col xs={7}>{lead.address || "—"}</Col>
          </Row>

          <Row className="mb-2">
            <Col xs={5} className="fw-semibold text-muted">
              Company Remark:
            </Col>
            <Col xs={7}>{lead.company_remark || "—"}</Col>
          </Row>

          <Row className="mb-2">
            <Col xs={5} className="fw-semibold text-muted">
              Customer Remark:
            </Col>
            <Col xs={7}>{lead.customer_remark || "—"}</Col>
          </Row>

          <Row className="mb-2">
            <Col xs={5} className="fw-semibold text-muted">
              Last Call:
            </Col>
            <Col xs={7}>
              {lead.last_call
                ? new Date(lead.last_call).toLocaleDateString("en-GB") // dd/mm/yyyy
                : "—"}
            </Col>
          </Row>

          <Row className="mb-2">
            <Col xs={5} className="fw-semibold text-muted">
              Priority:
            </Col>
            <Col xs={7}>{lead.priority || "—"}</Col>
          </Row>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ViewModal;
