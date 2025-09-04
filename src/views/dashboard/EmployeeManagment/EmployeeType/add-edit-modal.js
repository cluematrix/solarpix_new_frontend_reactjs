import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

const AddEditModal = ({
  show,
  handleClose,
  empType,
  setEmpType,
  onSave,
  modalTitle,
  buttonLabel,
}) => {
  return (
    <Modal centered show={show} onHide={handleClose} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>{modalTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formEmpType">
            <Form.Label>Employee Type</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter employee type"
              value={empType}
              onChange={(e) => setEmpType(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        {/* <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button> */}
        <Button variant="primary" onClick={onSave}>
          {buttonLabel}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddEditModal;
