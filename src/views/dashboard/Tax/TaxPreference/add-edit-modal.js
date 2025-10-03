import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

const AddEditModal = ({
  show,
  handleClose,
  taxName,
  setTaxName,
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
          <Form.Group controlId="formTaxName" className="mb-3">
            <Form.Label>Tax Preference Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Tax Preference Name"
              value={taxName}
              onChange={(e) => setTaxName(e.target.value)}
              required
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            {buttonLabel}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddEditModal;
