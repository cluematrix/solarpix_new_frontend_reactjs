import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

const EditModalSrNo = ({
  show,
  handleClose,
  roleName,
  setRoleName,
  onSave,
  modalTitle,
  buttonLabel,
  loadingBtn,
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
            <Form.Label className="custom-form-label">Sr No.</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Sr No."
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              className="custom-form-control"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" type="submit" disabled={loadingBtn}>
            {loadingBtn ? "Loading..." : buttonLabel}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default EditModalSrNo;
