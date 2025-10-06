import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

const AddEditModal = ({
  show,
  handleClose,
  name,
  setName,
  interPer,
  setInterPer,
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
          <Form.Group controlId="formName" className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formInterPer">
            <Form.Label>Inter Tax %</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter Inter Tax %"
              value={interPer}
              onChange={(e) => setInterPer(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" type="submit">{buttonLabel}</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddEditModal;
