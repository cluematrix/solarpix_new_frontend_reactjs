import React from "react";
import { Modal, Row, Col } from "react-bootstrap";

const ViewModal = ({ showView, setShowView, viewData }) => {
  return (
    <Modal show={showView} onHide={() => setShowView(false)} centered size="md">
      <Modal.Header closeButton>
        <Modal.Title className="fw-lighter fs-5">
          Stock Management Details
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="px-2">
          <Row className="mb-2">
            <Col xs={5} className="fw-semibold text-muted">
              Credit:
            </Col>
            <Col xs={7}>{viewData?.Credit || "--"}</Col>
          </Row>
          <Row className="mb-2">
            <Col xs={5} className="fw-semibold text-muted">
              Debit:
            </Col>
            <Col xs={7}>{viewData?.Debit || "--"}</Col>
          </Row>
          <Row className="mb-2">
            <Col xs={5} className="fw-semibold text-muted">
              Balance:
            </Col>
            <Col xs={7}>{viewData?.balance || "--"}</Col>
          </Row>
          <Row className="mb-2">
            <Col xs={5} className="fw-semibold text-muted">
              Material:
            </Col>
            <Col xs={7}>{viewData?.material?.material || "--"}</Col>
          </Row>
          <Row className="mb-2">
            <Col xs={5} className="fw-semibold text-muted">
              Particular:
            </Col>
            <Col xs={7}>{viewData?.particular?.particular || "--"}</Col>
          </Row>
          <Row className="mb-2">
            <Col xs={5} className="fw-semibold text-muted">
              Supplier:
            </Col>
            <Col xs={7}>{viewData?.supplier?.name || "--"}</Col>
          </Row>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ViewModal;
