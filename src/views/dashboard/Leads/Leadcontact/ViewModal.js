import React from "react";
import { Modal, Row, Col } from "react-bootstrap";

const ViewModal = ({ show, handleClose, lead }) => {
  if (!lead) return null;

  const renderField = (label, value) => (
    <Col md={4} className="mb-3">
      <strong>{label}:</strong>
      <div>{value ?? "-"}</div>
    </Col>
  );

  // Compute display name based on customer type
  const displayName =
    lead.customer_type === "Business"
      ? lead.name // company name
      : [lead.salutation, lead.name].filter(Boolean).join(" "); // Individual: salutation + name

  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="lg"
      centered
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title>Lead Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          {renderField("Enquiry No.", lead.lead_number || lead.enquiry_number)}
          {renderField("Customer Type", lead.customer_type)} {/* New field */}
          {renderField("Name", displayName)}
          {lead.customer_type === "Individual" &&
            renderField("Salutation", lead.salutation)}
          {renderField("Email", lead.email)}
          {renderField("Contact", lead.contact)}
          {renderField(
            "Lead Source",
            lead.lead_source_id?.lead_source ||
              lead.lead_source?.lead_source ||
              lead.leadSource?.lead_source ||
              "-"
          )}
          {renderField(
            "Added By",
            lead.added_by_id?.name ||
              lead.added_by?.name ||
              lead.addedBy?.name ||
              "-"
          )}
          {/* Uncomment if needed
          {renderField(
            "Lead Owner",
            lead.lead_owner_id?.name ||
              lead.lead_owner?.name ||
              lead.leadOwner?.name ||
              "-"
          )}
          {renderField(
            "Requirement Type",
            lead.requirement_type_id?.requirement_type ||
              lead.requirement_type?.requirement_type ||
              lead.requirementType?.requirement_type ||
              "-"
          )} */}
          {renderField("Capacity (kW)", lead.capacity)}
          {/* {renderField("Amount (₹)", lead.amount)} */}
          {renderField("State", lead.state)}
          {renderField("City", lead.city)}
          {renderField("Pincode", lead.pincode)}
          {renderField("Address", lead.address)}
          {/* {renderField("Reference", lead.reference)} */}
          {renderField("Company Remark", lead.company_remark)}
          {renderField("Customer Remark", lead.customer_remark)}
          {renderField(
            "Last Call",
            lead.last_call
              ? new Date(lead.last_call).toLocaleDateString("en-GB") // dd/mm/yyyy
              : ""
          )}
          {renderField("Priority", lead.priority)}
          {/* {renderField("Status", lead.status)} */}
        </Row>
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  );
};

export default ViewModal;
