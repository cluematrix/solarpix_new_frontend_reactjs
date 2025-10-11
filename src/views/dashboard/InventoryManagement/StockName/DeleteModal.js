import React from "react";
import { Modal, Button } from "react-bootstrap";

const DeleteModal = ({
  show,
  handleClose,
  onConfirm,
  modalTitle,
  modalMessage,
  loading,
}) => {
  return (
    <Modal centered show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{modalTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{modalMessage}</Modal.Body>
      <Modal.Footer>
        <Button variant="danger" disabled={loading} onClick={onConfirm}>
          {loading ? "Deleting..." : "Delete"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteModal;
