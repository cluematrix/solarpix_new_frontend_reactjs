import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

const AddEditModal = ({
  show,
  handleClose,
  roleName,
  setRoleName,
  onSave,
  modalTitle,
  buttonLabel,
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave();
  };

  return (
    <Modal centered show={show} onHide={handleClose} backdrop="static">
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="formRequirementType">
            <Form.Label className="custom-form-label">
              Requirement Type
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Requirement Type"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              className="custom-form-control"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" type="submit">
            {buttonLabel}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddEditModal;
