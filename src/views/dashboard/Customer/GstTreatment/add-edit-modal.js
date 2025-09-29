import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

const AddEditModal = ({
  show,
  handleClose,
  gstName,
  setGstName,
  gstDesc,
  setGstDesc,
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
          <Form.Group controlId="formGstName" className="mb-3">
            <Form.Label>GST Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter GST Name"
              value={gstName}
              onChange={(e) => setGstName(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formGstDesc">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              placeholder="Enter Description"
              value={gstDesc}
              onChange={(e) => setGstDesc(e.target.value)}
              rows={3}
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
