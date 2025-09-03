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
    e.preventDefault(); // prevent page reload
    onSave();
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static">
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="formRoleName">
            <Form.Label className="custom-form-label">
              Department Name
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Department name"
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
