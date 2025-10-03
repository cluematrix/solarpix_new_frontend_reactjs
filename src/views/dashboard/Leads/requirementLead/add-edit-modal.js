import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

const AddEditModal = ({
  show,
  handleClose,
  formData,
  setFormData,
  onSave,
  editData,
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal centered show={show} onHide={handleClose} backdrop="static">
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editData ? "Update Requirement Lead" : "Add Requirement Lead"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="formRequirementLead">
            <Form.Label>Requirement Lead</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Requirement Lead"
              value={formData.requirement_name}
              onChange={(e) =>
                setFormData({ ...formData, requirement_name: e.target.value })
              }
              required
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            {editData ? "Update" : "Save"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddEditModal;
