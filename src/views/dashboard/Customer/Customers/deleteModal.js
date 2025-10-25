import React from "react";
import { Modal, Button } from "react-bootstrap";

const DeleteModal = ({
  show,
  handleClose,
  onConfirm,
  modalTitle,
  modalMessage,
  loadingDlt,
}) => {
  return (
    <Modal centered show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{modalTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{modalMessage}</Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={onConfirm}>
          {loadingDlt ? "Deleting..." : "Delete"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteModal;
