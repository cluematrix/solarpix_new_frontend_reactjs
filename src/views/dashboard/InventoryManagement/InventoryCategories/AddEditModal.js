import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

const AddEditModal = ({
  show,
  handleClose,
  roleName,
  setRoleName,
  errors,
  onSave,
  modalTitle,
  buttonLabel,
  loading,
}) => {
  const handleSubmit = (e) => {
    e.preventDefault(); // prevent page reload
    onSave();
  };

  return (
    <Modal centered show={show} onHide={handleClose} backdrop="static">
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="formRoleName">
            <Form.Label className="custom-form-label">
              Inventory Name
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter inventory name"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              className="custom-form-control"
            />
            {errors && <p className="errors-text">{errors}</p>}
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button disabled={loading} variant="primary" type="submit">
            {loading ? "Saving..." : buttonLabel}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddEditModal;
