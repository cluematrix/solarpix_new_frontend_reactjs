import React from "react";
import { Modal, Row, Col } from "react-bootstrap";

const ViewModal = ({ showView, setShowView, viewData }) => {
  return (
    <Modal show={showView} onHide={() => setShowView(false)} centered size="md">
      <Modal.Header closeButton>
        <Modal.Title className="fw-lighter fs-5">Subsidy Details</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="px-2">
          {viewData?.subsidyFields?.length > 0 ? (
            viewData.subsidyFields.map((item, idx) => (
              <Row key={idx} className="mb-2">
                <Col xs={5} className="fw-semibold text-muted">
                  {item.label || "--"}:
                </Col>
                <Col xs={7}>{item.value || "--"}</Col>
              </Row>
            ))
          ) : (
            <div className="text-center text-muted py-3">
              No Subsidy details available.
            </div>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ViewModal;
