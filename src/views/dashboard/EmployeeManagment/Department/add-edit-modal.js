import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

const AddEditModal = ({
  show,
  handleClose,
  roleName,
  setRoleName,
  onSave,
  modalTitle,
  buttonLabel,
}) => {
  return (
    <>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formRoleName">
              <Form.Label className="custom-form-label">
                Department Name
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Department name"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                className="custom-form-control"
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
    </>
  );
};

export default AddEditModal;
