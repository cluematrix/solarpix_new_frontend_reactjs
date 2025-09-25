// ViewFollowupModal.jsx
import React from "react";
import { Modal, Row, Col } from "react-bootstrap";

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
    <Modal
      show={show}
      onHide={handleClose}
      centered
      backdrop="static"
      size="md"
    >
      <Modal.Header closeButton>
        <Modal.Title className="fw-lighter  fs-5">
          Follow-up Details
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="px-2">
          <Row className="mb-2">
            <Col xs={5} className="fw-semibold text-muted">
              Lead Name:
            </Col>
            <Col xs={7}>{leadName}</Col>
          </Row>

          <Row className="mb-2">
            <Col xs={5} className="fw-semibold text-muted">
              Message:
            </Col>
            <Col xs={7}>{followup.message || "—"}</Col>
          </Row>

          <Row className="mb-2">
            <Col xs={5} className="fw-semibold text-muted">
              Follow-up Date:
            </Col>
            <Col xs={7}>
              {followup.followup_date
                ? new Date(followup.followup_date).toLocaleDateString()
                : "—"}
            </Col>
          </Row>

          <Row className="mb-2">
            <Col xs={5} className="fw-semibold text-muted">
              Scheduled By:
            </Col>
            <Col xs={7}>{scheduledByName}</Col>
          </Row>

          <Row className="mb-2">
            <Col xs={5} className="fw-semibold text-muted">
              Outcome:
            </Col>
            <Col xs={7}>{followup.out_comes || "—"}</Col>
          </Row>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ViewFollowupModal;
