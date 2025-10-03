import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

const AddEditModal = ({
  show,
  handleClose,
  methodName,
  setMethodName,
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
          <Form.Group controlId="formMethodName">
            <Form.Label className="custom-form-label">
              Installation Status
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Installation Status"
              value={methodName}
              onChange={(e) => setMethodName(e.target.value)}
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
