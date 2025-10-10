import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

const AddEditModal = ({
  show,
  handleClose,
  tcsName,
  setTcsName,
  tcsPercentage,
  setTcsPercentage,
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
          <Form.Group controlId="formTcsName" className="mb-3">
            <Form.Label>TCS Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter TCS Name"
              value={tcsName}
              onChange={(e) => setTcsName(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="formTcsPercentage" className="mb-3">
            <Form.Label>Percentage (%)</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              placeholder="Enter Percentage"
              value={tcsPercentage}
              onChange={(e) => setTcsPercentage(e.target.value)}
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
