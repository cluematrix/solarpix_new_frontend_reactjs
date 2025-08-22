import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";

const AddEditModal = ({ show, handleClose, onSave, editData }) => {
  const [formData, setFormData] = useState({
    dealName: "",
    client: "",
    amount: "",
    stage: "",
  });

  useEffect(() => {
    if (editData) {
      setFormData(editData);
    } else {
      setFormData({ dealName: "", client: "", amount: "", stage: "" });
    }
  }, [editData]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editData ? "Edit Deal" : "Add Deal"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="pt-4">Deal Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="dealName"
                    value={formData.dealName}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="pt-4">Client *</Form.Label>
                  <Form.Control
                    type="text"
                    name="client"
                    value={formData.client}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="pt-4">Amount ($) *</Form.Label>
                  <Form.Control
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="pt-4">Stage *</Form.Label>
                  <Form.Select
                    name="stage"
                    value={formData.stage}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Stage</option>
                    <option value="Lead">Lead</option>
                    <option value="Proposal">Proposal</option>
                    <option value="Negotiation">Negotiation</option>
                    <option value="Closed Won">Closed Won</option>
                    <option value="Closed Lost">Closed Lost</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <div className="text-end">
              <Button variant="secondary" onClick={handleClose}>
                Cancel
              </Button>{" "}
              <Button variant="primary" type="submit">
                {editData ? "Update" : "Save"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AddEditModal;
