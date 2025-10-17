import React from "react";
import { Modal, Button } from "react-bootstrap";

const DeleteModal = ({
  show,
  handleClose,
  onConfirm,
  modalTitle,
  modalMessage,
  loadingBtn,
}) => {
  return (
    <Modal centered show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{modalTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{modalMessage}</Modal.Body>
      <Modal.Footer>
        <Button disabled={loadingBtn} variant="danger" onClick={onConfirm}>
          {loadingBtn ? "Loading..." : "Delete"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteModal;
