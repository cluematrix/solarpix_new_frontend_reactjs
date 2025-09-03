import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

const AddEditModal = ({
  show,
  handleClose,
  value,
  setValue,
  onSave,
  modalTitle,
  buttonLabel,
  fieldLabel,
  placeholder,
}) => {
  return (
    <Modal show={show} onHide={handleClose} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>{modalTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formCategory">
            <Form.Label>{fieldLabel}</Form.Label>
            <Form.Control
              type="text"
              placeholder={placeholder}
              value={value}
              onChange={(e) => setValue(e.target.value)}
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
