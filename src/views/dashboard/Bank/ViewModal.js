import React from "react";
import { Modal, Row, Col } from "react-bootstrap";

const ViewModal = ({ showView, setShowView, viewData }) => {
  return (
    <Modal show={showView} onHide={() => setShowView(false)} centered size="md">
      <Modal.Header closeButton>
        <Modal.Title className="fw-lighter fs-5">Bank Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="px-2">
          <Row className="mb-2">
            <Col xs={5} className="fw-semibold text-muted">
              Bank Name:
            </Col>
            <Col xs={7}>{viewData?.bank_name || "--"}</Col>
          </Row>
          <Row className="mb-2">
            <Col xs={5} className="fw-semibold text-muted">
              Account Name:
            </Col>
            <Col xs={7}>{viewData?.acc_name || "--"}</Col>
          </Row>
          <Row className="mb-2">
            <Col xs={5} className="fw-semibold text-muted">
              Account No:
            </Col>
            <Col xs={7}>{viewData?.acc_no || "--"}</Col>
          </Row>
          <Row className="mb-2">
            <Col xs={5} className="fw-semibold text-muted">
              IFSC Code:
            </Col>
            <Col xs={7}>{viewData?.IFSC_code || "--"}</Col>
          </Row>
          <Row className="mb-2">
            <Col xs={5} className="fw-semibold text-muted">
              Account Type:
            </Col>
            <Col xs={7}>{viewData?.acc_type || "--"}</Col>
          </Row>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ViewModal;
