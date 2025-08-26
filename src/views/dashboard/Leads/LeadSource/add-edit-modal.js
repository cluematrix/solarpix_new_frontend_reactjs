import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

const AddEditModal = ({ show, handleClose, onSave, formData, setFormData, editData }) => {
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{editData ? "Edit Lead Source" : "Add Lead Source"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Lead Source</Form.Label>
            <Form.Control
              type="text"
              name="lead_source"
              value={formData.lead_source}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <div className="text-end mt-3">
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="ms-2">
              {editData ? "Update" : "Submit"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddEditModal;
