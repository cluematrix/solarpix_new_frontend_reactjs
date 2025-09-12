import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";

const AddEditModal = ({
  show,
  handleClose,
  onSave,
  editData,
  dealStages,
  leads,
  clients,
}) => {
  const [formData, setFormData] = useState({
    deal_name: "",
    client_id: "",
    deal_value: "",
    deal_stage_id: "",
    lead_id: "",
    description: "",
    site_visit_date: "",
    status: "",
    capacity: "",
    attachment: null,
    negotiable: "",
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
        site_visit_date: "",
        status: "",
        capacity: "",
        attachment: null,
        negotiable: "",
      });
    }
  }, [editData]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "attachment") {
      setFormData((prev) => ({
        ...prev,
        attachment: files[0], // only one PDF
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      backdrop="static"
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>{editData ? "Edit Deal" : "Add Deal"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            {/* Deal Name */}
            <Col md={4}>
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

            {/* Lead */}
            <Col md={4}>
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

            {/* Stage */}
            <Col md={4}>
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
            {/* Amount */}
            <Col md={4}>
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

            {/* Capacity */}
            <Col md={4}>
              <Form.Group>
                <Form.Label className="pt-2">Capacity</Form.Label>
                <Form.Control
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>

            {/* Site Visit Date */}
            <Col md={4}>
              <Form.Group>
                <Form.Label className="pt-2">Site Visit Date</Form.Label>
                <Form.Control
                  type="date"
                  name="site_visit_date"
                  value={formData.site_visit_date}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            {/* Negotiable */}
            <Col md={4}>
              <Form.Group>
                <Form.Label className="pt-2">Negotiable</Form.Label>
                <Form.Select
                  name="negotiable"
                  value={formData.negotiable}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option value="YES">YES</option>
                  <option value="NO">NO</option>
                </Form.Select>
              </Form.Group>
            </Col>

            {/* Status */}
            <Col md={4}>
              <Form.Group>
                <Form.Label className="pt-2">Status</Form.Label>
                <Form.Select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </Form.Select>
              </Form.Group>
            </Col>

            {/* Attachment */}
            <Col md={4}>
              <Form.Group>
                <Form.Label className="pt-2">Attachment (PDF only)</Form.Label>
                <Form.Control
                  type="file"
                  name="attachment"
                  accept="application/pdf"
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            {/* Description full width */}
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

          {/* Buttons */}
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
