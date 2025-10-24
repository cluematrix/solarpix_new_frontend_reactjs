import React from "react";
import { Modal, Row, Col } from "react-bootstrap";
import { FaEye } from "react-icons/fa";

const ViewModal = ({ showView, setShowView, viewData }) => {
  return (
    <Modal show={showView} onHide={() => setShowView(false)} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title className="fw-lighter fs-5">
          Supplier Management Details
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="px-2">
          {/* Row 1: Name, Company Name, Display Name */}
          <Row className="mb-3">
            <Col md={4} className="mb-2">
              <div className="fw-semibold text-muted">Name:</div>
              <div>{viewData.name || "N/A"}</div>
            </Col>
            <Col md={4} className="mb-2">
              <div className="fw-semibold text-muted">Company Name:</div>
              <div>{viewData.company_name || "N/A"}</div>
            </Col>
            <Col md={4} className="mb-2">
              <div className="fw-semibold text-muted">Display Name:</div>
              <div>{viewData.display_name || "N/A"}</div>
            </Col>
          </Row>

          {/* Row 2: Email, Phone, GST */}
          <Row className="mb-3">
            <Col md={4} className="mb-2">
              <div className="fw-semibold text-muted">Email:</div>
              <div>{viewData.email || "N/A"}</div>
            </Col>
            <Col md={4} className="mb-2">
              <div className="fw-semibold text-muted">Phone:</div>
              <div>{viewData.phone || "N/A"}</div>
            </Col>
            <Col md={4} className="mb-2">
              <div className="fw-semibold text-muted">GST:</div>
              <div>{viewData.GST || "N/A"}</div>
            </Col>
          </Row>

          {/* Row 3: PAN, GST Treatment, TDS */}
          <Row className="mb-3">
            <Col md={4} className="mb-2">
              <div className="fw-semibold text-muted">PAN:</div>
              <div>{viewData.PAN || "N/A"}</div>
            </Col>
            <Col md={4} className="mb-2">
              <div className="fw-semibold text-muted">GST Treatment:</div>
              <div>{viewData.GST_treatment?.GST_name || "N/A"}</div>
            </Col>
            <Col md={4} className="mb-2">
              <div className="fw-semibold text-muted">TDS:</div>
              <div>{viewData.Tds?.name || "N/A"}</div>
            </Col>
          </Row>

          {/* Row 4: Payment Term, Opening Balance, Source of Supply */}
          <Row className="mb-3">
            <Col md={4} className="mb-2">
              <div className="fw-semibold text-muted">Payment Term:</div>
              <div>{viewData.paymentTerm?.payment_term || "N/A"}</div>
            </Col>
            <Col md={4} className="mb-2">
              <div className="fw-semibold text-muted">Opening Balance:</div>
              <div>{viewData.opening_balance || "0"}</div>
            </Col>
            <Col md={4} className="mb-2">
              <div className="fw-semibold text-muted">Source of Supply:</div>
              <div>{viewData.source_of_supply || "N/A"}</div>
            </Col>
          </Row>

          {/* Row 5: Document, Billing Address, Shipping Address */}
          <Row className="mb-3">
            <Col md={4} className="mb-2">
              <div className="fw-semibold text-muted">Document:</div>
              <div>
                {viewData?.document ? (
                  <a
                    href={viewData?.document}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaEye />
                  </a>
                ) : (
                  "N/A"
                )}
              </div>
            </Col>
            <Col md={4} className="mb-2">
              <div className="fw-semibold text-muted">Billing Address:</div>
              <div>
                {viewData.billing_address
                  ? `${viewData.billing_address}, ${
                      viewData.billing_city || ""
                    }, ${viewData.billing_state || ""}, ${
                      viewData.billing_pincode || ""
                    }`
                  : "N/A"}
              </div>
            </Col>
            <Col md={4} className="mb-2">
              <div className="fw-semibold text-muted">Billing Phone:</div>
              <div>{viewData.billing_phone || "N/A"}</div>
            </Col>
          </Row>

          {/* Row 6: Billing Phone, Shipping Phone, Bank Details */}
          <Row className="mb-3">
            <Col md={4} className="mb-2">
              <div className="fw-semibold text-muted">Shipping Address:</div>
              <div>
                {viewData.shipping_address
                  ? `${viewData.shipping_address}, ${
                      viewData.shipping_city || ""
                    }, ${viewData.shipping_state || ""}, ${
                      viewData.shipping_pincode || ""
                    }`
                  : "N/A"}
              </div>
            </Col>
            <Col md={4} className="mb-2">
              <div className="fw-semibold text-muted">Shipping Phone:</div>
              <div>{viewData.shipping_phone || "N/A"}</div>
            </Col>
            <Col md={4} className="mb-2">
              <div className="fw-semibold text-muted">Bank Details:</div>
              <div>
                {viewData.account_holder_name
                  ? `${viewData.account_holder_name}, ${
                      viewData.bank_name || ""
                    }, Acct: ${viewData.account_number || ""}, IFSC: ${
                      viewData.ifsc_code || ""
                    }`
                  : "N/A"}
              </div>
            </Col>
          </Row>

          {/* Row 7: Remark, Status */}
          <Row className="mb-3">
            <Col md={4} className="mb-2">
              <div className="fw-semibold text-muted">Remark:</div>
              <div>{viewData.remark || "N/A"}</div>
            </Col>
            <Col md={4} className="mb-2">
              <div className="fw-semibold text-muted">Status:</div>
              <div>{viewData.isActive ? "Active" : "Inactive"}</div>
            </Col>
            <Col md={4} className="mb-2"></Col>{" "}
            {/* Empty column for 3x3 alignment */}
          </Row>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ViewModal;
