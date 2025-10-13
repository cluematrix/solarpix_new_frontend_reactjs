import React from "react";
import { Modal, Row, Col, Form, Badge } from "react-bootstrap";

const ViewModal = ({ show, handleClose, item }) => {
  if (!item) return null;

  const formatCurrency = (value) =>
    value !== undefined && value !== null ? `₹ ${value}` : "-";

  const formatPercentage = (value) =>
    value !== undefined && value !== null ? `${value}%` : "-";

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered scrollable>
      <Modal.Header closeButton>
        <Modal.Title>View Item</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row className="mb-3">
          <Col md={4}>
            <Form.Label>Type</Form.Label>
            <Form.Control plaintext readOnly defaultValue={item.type || "-"} />
          </Col>
          <Col md={4}>
            <Form.Label>Item Name</Form.Label>
            <Form.Control
              plaintext
              readOnly
              defaultValue={item.stockName?.name || "-"}
            />
          </Col>
          <Col md={4}>
            <Form.Label>Make</Form.Label>
            <Form.Control
              plaintext
              readOnly
              defaultValue={item.brand?.brand_name || "-"}
            />
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={4}>
            <Form.Label>
              {item.type === "Goods" ? "HSN Code" : "SAC Code"}
            </Form.Label>
            <Form.Control
              plaintext
              readOnly
              defaultValue={item.hsc_code || item.sac || "-"}
            />
          </Col>
          <Col md={4}>
            <Form.Label>Unit</Form.Label>
            <Form.Control readOnly defaultValue={item.unit?.unit || "-"} />
          </Col>
          {/* <Col md={4}>
            <Form.Label>Tax Preference</Form.Label>
            <div>
              <Badge
                bg={
                  item.taxPreference?.name?.toLowerCase() === "non-taxable"
                    ? "secondary"
                    : "success"
                }
              >
                {item.taxPreference?.name || "-"}
              </Badge>
            </div>
          </Col> */}
        </Row>

        {item.taxPreference?.name?.toLowerCase() === "non-taxable" && (
          <Row className="mb-3">
            <Col md={6}>
              <Form.Label>Exemption Reason</Form.Label>
              <Form.Control
                plaintext
                readOnly
                defaultValue={item.exemption_reason || "-"}
              />
            </Col>
          </Row>
        )}

        <Row className="mb-3">
          <Col md={6}>
            <Form.Label>Selling Price</Form.Label>
            <Form.Control
              plaintext
              readOnly
              defaultValue={
                item.type_sales_info
                  ? formatCurrency(item.sales_info_selling_price)
                  : "-"
              }
            />
          </Col>
          <Col md={6}>
            <Form.Label>Cost Price</Form.Label>
            <Form.Control
              plaintext
              readOnly
              defaultValue={
                item.type_purchase_info
                  ? formatCurrency(item.purchase_info_cost_price)
                  : "-"
              }
            />
          </Col>
        </Row>

        {item.type_purchase_info && (
          <Row className="mb-3">
            <Col md={6}>
              <Form.Label>Preferred Vendor</Form.Label>
              <Form.Control
                plaintext
                readOnly
                defaultValue={item.SupplierManagement?.name || "-"}
              />
            </Col>
          </Row>
        )}

        {/* {item.taxPreference?.name?.toLowerCase() !== "non-taxable" && (
          <Row className="mb-3">
            <Col md={6}>
              <Form.Label>Intra State Tax Rate</Form.Label>
              <Form.Control
                plaintext
                readOnly
                defaultValue={formatPercentage(item.IntraTax?.intra_per)}
              />
            </Col>
            <Col md={6}>
              <Form.Label>Inter State Tax Rate</Form.Label>
              <Form.Control
                plaintext
                readOnly
                defaultValue={formatPercentage(item.InterTax?.inter_per)}
              />
            </Col>
          </Row>
        )} */}
      </Modal.Body>
    </Modal>
  );
};

export default ViewModal;
