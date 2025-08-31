import React from "react";
import { Modal, Button } from "react-bootstrap";

const DeleteModal = ({
  show,
  handleClose,
  onConfirm,
  modalTitle,
  modalMessage,
}) => {
  console.log("modalMessage",modalMessage)
  return (
    <Modal centered show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{modalTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{modalMessage}</Modal.Body>
      <Modal.Footer>
        {/* <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button> */}
        <Button variant="danger" onClick={onConfirm}>
          Yes, Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteModal;
