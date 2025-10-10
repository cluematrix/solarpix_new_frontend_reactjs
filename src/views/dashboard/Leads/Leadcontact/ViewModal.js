import React from "react";
import { Modal, Row, Col, Card } from "react-bootstrap";

const ViewModal = ({ show, handleClose, lead }) => {
  if (!lead) return null;

  const displayName =
    lead.customer_type === "Business"
      ? lead.name
      : [lead.salutation, lead.name].filter(Boolean).join(" ");

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString("en-GB") : "—";

  const renderField = (label, value) => (
    <Row className="mb-2">
      <Col xs={5} className="fw-semibold text-muted">
        {label}:
      </Col>
      <Col xs={7}>{value || "—"}</Col>
    </Row>
  );

  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="lg"
      centered
      backdrop="static"
      scrollable
    >
      <Modal.Header closeButton className="border-bottom-0">
        <Modal.Title className="fw-semibold fs-5 text-primary">
          Lead Details
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="px-4 py-3">
        {/* ========== Lead Information Section ========== */}
        <h6 className="fw-bold text-uppercase text-secondary mb-3">
          Basic Information
        </h6>
        <Card className="shadow-sm border-0 mb-4">
          <Card.Body>
            {renderField(
              "Enquiry No.",
              lead.lead_number || lead.enquiry_number
            )}
            {renderField("Customer Type", lead.customer_type)}
            {renderField("Name", displayName)}
            {renderField("Email", lead.email)}
            {renderField("Contact", lead.contact)}
            {renderField(
              "Lead Source",
              lead.lead_source_id?.lead_source ||
                lead.lead_source?.lead_source ||
                lead.leadSource?.lead_source
            )}
            {renderField(
              "Added By",
              lead.added_by_id?.name ||
                lead.added_by?.name ||
                lead.addedBy?.name
            )}
            {renderField(`Capacity (${lead?.Unit?.unit || ""})`, lead.capacity)}
            {renderField("Priority", lead.priority)}
            {renderField("Status", lead.status)}
            {renderField("Last Call", formatDate(lead.last_call))}
          </Card.Body>
        </Card>

        {/* ========== Address Section ========== */}
        <h6 className="fw-bold text-uppercase text-secondary mb-3">
          Address Details
        </h6>
        <Row>
          {/* Billing Address */}
          <Col md={6}>
            <Card className="border-0 shadow-sm mb-3 h-100">
              <Card.Header className="bg-light fw-semibold text-muted py-2">
                Billing Address
              </Card.Header>
              <Card.Body>
                {renderField("City", lead.billing_city)}
                {renderField("State", lead.billing_state)}
                {renderField("Address", lead.billing_address)}
                {renderField("Pincode", lead.billing_pincode)}
              </Card.Body>
            </Card>
          </Col>

          {/* Shipping Address */}
          <Col md={6}>
            <Card className="border-0 shadow-sm mb-3 h-100">
              <Card.Header className="bg-light fw-semibold text-muted py-2">
                Shipping Address
              </Card.Header>
              <Card.Body>
                {renderField("City", lead.shipping_city)}
                {renderField("State", lead.shipping_state)}
                {renderField("Address", lead.shipping_address)}
                {renderField("Pincode", lead.shipping_pincode)}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* ========== Remarks Section ========== */}
        <h6 className="fw-bold text-uppercase text-secondary mb-3 mt-3">
          Remarks
        </h6>
        <Card className="shadow-sm border-0">
          <Card.Body>
            {renderField("Company Remark", lead.company_remark)}
            {renderField("Customer Remark", lead.customer_remark)}
          </Card.Body>
        </Card>
      </Modal.Body>
    </Modal>
  );
};

export default ViewModal;
