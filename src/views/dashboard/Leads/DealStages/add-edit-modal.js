import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

const AddEditModal = ({
  show,
  handleClose,
  onSave,
  formData,
  setFormData,
  editData,
}) => {
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal centered show={show} onHide={handleClose} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>
          {editData ? "Edit Deal Stage" : "Add Deal Stage"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Deal Stage</Form.Label>
            <Form.Control
              type="text"
              name="deal_stages"
              value={formData.deal_stages}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>Color</Form.Label>
            <Form.Control
              type="color"
              name="color"
              value={formData.color}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <div className="text-end mt-3">
            <Button type="submit" variant="primary" className="ms-2">
              {editData ? "Update" : "Save"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddEditModal;
