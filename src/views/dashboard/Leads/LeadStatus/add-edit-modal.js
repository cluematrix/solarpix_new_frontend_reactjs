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
          <Modal.Title>{editData ? "Update Lead Status" : "Add Lead Status"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="formLeadStatus">
            <Form.Label>Lead Status</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Lead Status (e.g. Won, Loss, Medium)"
              value={formData.leadStatus_name}
              onChange={(e) =>
                setFormData({ ...formData, leadStatus_name: e.target.value })
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
