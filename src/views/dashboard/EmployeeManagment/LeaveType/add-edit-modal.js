// add-edit-modal.js
import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

const AddEditModal = ({
  show,
  handleClose,
  leaveData,
  setLeaveData,
  onSave,
  modalTitle,
  buttonLabel,
}) => {
  return (
    <Modal centered show={show} onHide={handleClose} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>{modalTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formLeaveType">
            <Form.Label>Leave Type</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter leave type"
              value={leaveData.leave_type}
              onChange={(e) =>
                setLeaveData({ ...leaveData, leave_type: e.target.value })
              }
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formNoOfLeave">
            <Form.Label>No. of Leaves</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter no. of leaves"
              value={leaveData.no_of_leave}
              onChange={(e) =>
                setLeaveData({ ...leaveData, no_of_leave: e.target.value })
              }
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPaidStatus">
            <Form.Label>Paid Status</Form.Label>
            <Form.Select
              value={leaveData.leave_paid_status}
              onChange={(e) =>
                setLeaveData({
                  ...leaveData,
                  leave_paid_status: e.target.value,
                })
              }
            >
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formColor">
            <Form.Label>Color</Form.Label>
            <Form.Control
              type="color"
              value={leaveData.color}
              onChange={(e) =>
                setLeaveData({ ...leaveData, color: e.target.value })
              }
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
  );
};

export default AddEditModal;
