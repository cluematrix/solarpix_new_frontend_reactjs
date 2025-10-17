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
  loadingBtn,
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
              placeholder="Enter Employee Type"
              value={empType}
              onChange={(e) => setEmpType(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button disabled={loadingBtn} variant="primary" onClick={onSave}>
          {loadingBtn ? "Loading..." : buttonLabel}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddEditModal;
