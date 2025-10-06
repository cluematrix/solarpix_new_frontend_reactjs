import React from "react";
import { Modal } from "react-bootstrap";

const SerialNoModal = ({ show, handleClose, modalTitle }) => {
  return (
    <Modal
      centered
      show={show}
      onHide={handleClose}
      backdrop="static"
      size="lg"
    >
      <Modal.Body>this is table</Modal.Body>
      <Modal.Header closeButton>
        <Modal.Title>{modalTitle}</Modal.Title>
      </Modal.Header>
    </Modal>
  );
};

export default SerialNoModal;
