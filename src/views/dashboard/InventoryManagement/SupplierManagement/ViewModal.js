import React from "react";
import { Modal, Row, Col } from "react-bootstrap";

const ViewModal = ({ showView, setShowView, viewData }) => {
  return (
    <Modal show={showView} onHide={() => setShowView(false)} centered size="md">
      <Modal.Header closeButton className="bg-light">
        <Modal.Title className="fw-lighter text-primary fs-5">
          Supplier Management Details
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="px-2">
          <Row className="mb-2">
            <Col xs={5} className="fw-semibold text-muted">
              Name:
            </Col>
            <Col xs={7}>{viewData.name}</Col>
          </Row>
          <Row className="mb-2">
            <Col xs={5} className="fw-semibold text-muted">
              Company Name:
            </Col>
            <Col xs={7}>{viewData.company_name}</Col>
          </Row>
          <Row className="mb-2">
            <Col xs={5} className="fw-semibold text-muted">
              Display Name:
            </Col>
            <Col xs={7}>{viewData.display_name}</Col>
          </Row>
          <Row className="mb-2">
            <Col xs={5} className="fw-semibold text-muted">
              Email:
            </Col>
            <Col xs={7}>{viewData.email}</Col>
          </Row>
          <Row className="mb-2">
            <Col xs={5} className="fw-semibold text-muted">
              Phone:
            </Col>
            <Col xs={7}>{viewData.phone}</Col>
          </Row>
          <Row className="mb-2">
            <Col xs={5} className="fw-semibold text-muted">
              Address:
            </Col>
            <Col xs={7}>{viewData.Address}</Col>
          </Row>
          <Row className="mb-2">
            <Col xs={5} className="fw-semibold text-muted">
              GST:
            </Col>
            <Col xs={7}>{viewData.GST}</Col>
          </Row>
          <Row className="mb-2">
            <Col xs={5} className="fw-semibold text-muted">
              PAN:
            </Col>
            <Col xs={7}>{viewData.PAN}</Col>
          </Row>
          <Row className="mb-2">
            <Col xs={5} className="fw-semibold text-muted">
              TDS:
            </Col>
            <Col xs={7}>{viewData.TDS}</Col>
          </Row>
          <Row className="mb-2">
            <Col xs={5} className="fw-semibold text-muted">
              Payment Term:
            </Col>
            <Col xs={7}>{viewData.paymentTerm.payment_term}</Col>
          </Row>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ViewModal;
