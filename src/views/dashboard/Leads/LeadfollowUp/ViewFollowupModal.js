// ViewFollowupModal.jsx
import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

const ViewFollowupModal = ({
  show,
  handleClose,
  followup,
  leads,
  employees,
}) => {
  if (!followup) return null;

  const leadName = leads.find((l) => l.id === followup.lead_id)?.name || "—";

  const scheduledByName =
    employees.find((e) => e.id === followup.schedule_by_id)?.name || "—";

  return (
    <Modal show={show} onHide={handleClose} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>View Follow-up Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Label>Lead Name</Form.Label>
          <Form.Control type="text" value={leadName} readOnly />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Message</Form.Label>
          <Form.Control type="text" value={followup.message || "—"} readOnly />
        </Form.Group>

        {/* <Form.Group className="mb-3">
          <Form.Label>Follow-up Date</Form.Label>
          <Form.Control type="text" value={followup.followup_date || "—"} readOnly />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Scheduled By</Form.Label>
          <Form.Control type="text" value={scheduledByName} readOnly />
        </Form.Group> */}

        <Form.Group className="mb-3">
          <Form.Label>Outcome</Form.Label>
          <Form.Control
            type="text"
            value={followup.out_comes || "—"}
            readOnly
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ViewFollowupModal;
