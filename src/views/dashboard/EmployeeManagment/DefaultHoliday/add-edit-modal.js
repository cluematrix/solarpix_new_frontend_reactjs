import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

const AddEditModal = ({
  show,
  handleClose,
  formData,
  setFormData,
  onSave,
  modalTitle,
  buttonLabel,
}) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{modalTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Day</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter day (e.g., Monday)"
              value={formData.day}
              onChange={(e) =>
                setFormData({ ...formData, day: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Occasion</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter occasion"
              value={formData.occasion}
              onChange={(e) =>
                setFormData({ ...formData, occasion: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Year</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter year (e.g., 2025)"
              value={formData.year}
              onChange={(e) =>
                setFormData({ ...formData, year: e.target.value })
              }
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={onSave}>
          {buttonLabel}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddEditModal;
