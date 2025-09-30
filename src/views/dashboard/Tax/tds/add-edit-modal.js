import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

const AddEditModal = ({
  show,
  handleClose,
  tdsName,
  setTdsName,
  tdsPercentage,
  setTdsPercentage,
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
          <Form.Group controlId="formTdsName" className="mb-3">
            <Form.Label>TDS Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter TDS Name"
              value={tdsName}
              onChange={(e) => setTdsName(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="formTdsPercentage" className="mb-3">
            <Form.Label>Percentage (%)</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              placeholder="Enter Percentage"
              value={tdsPercentage}
              onChange={(e) => setTdsPercentage(e.target.value)}
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
