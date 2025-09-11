import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";

const AddEditModal = ({
  show,
  handleClose,
  onSave,
  editData,
  dealStages,
  leads,
  clients, // 👈 new prop
}) => {
  const [formData, setFormData] = useState({
    deal_name: "",
    client_id: "", // 👈 use client_id instead of deal_contact
    deal_value: "",
    deal_stage_id: "",
    lead_id: "",
    description: "",
  });

  useEffect(() => {
    if (editData) {
      setFormData(editData);
    } else {
      setFormData({
        deal_name: "",
        client_id: "",
        deal_value: "",
        deal_stage_id: "",
        lead_id: "",
        description: "",
      });
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
    <Modal show={show} onHide={handleClose} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>{editData ? "Edit Deal" : "Add Deal"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col md={12}>
              <Form.Group>
                <Form.Label className="pt-2">Deal Name *</Form.Label>
                <Form.Control
                  type="text"
                  name="deal_name"
                  value={formData.deal_name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          {/* <Row className="mb-3">
            <Col md={12}>
              <Form.Group>
                <Form.Label className="pt-2">Customer *</Form.Label>
                <Form.Select
                  name="client_id"
                  value={formData.client_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Client</option>
                  {Array.isArray(clients) &&
                    clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.name}
                      </option>
                    ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row> */}

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label className="pt-2">Lead *</Form.Label>
                <Form.Select
                  name="lead_id"
                  value={formData.lead_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Lead</option>
                  {leads.map((lead) => (
                    <option key={lead.id} value={lead.id}>
                      {lead.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label className="pt-2">Stage *</Form.Label>
                <Form.Select
                  name="deal_stage_id"
                  value={formData.deal_stage_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Stage</option>
                  {dealStages.map((stage) => (
                    <option key={stage.id} value={stage.id}>
                      {stage.deal_stages}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label className="pt-2">Amount (₹) *</Form.Label>
                <Form.Control
                  type="number"
                  name="deal_value"
                  value={formData.deal_value}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <Form.Group>
                <Form.Label className="pt-2">Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <div className="text-end mt-3">
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
  );
};

export default AddEditModal;
