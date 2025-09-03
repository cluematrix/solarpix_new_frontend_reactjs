import React from "react";
import { Modal, Button, Table } from "react-bootstrap";

const ViewLeaveModal = ({ show, handleClose, data }) => {
  if (!data) return null;

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Leave Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Table bordered>
          <tbody>
            <tr>
              <th>Employee</th>
              <td>{data.employee?.name}</td>
            </tr>
            <tr>
              <th>Leave Type</th>
              <td>{data.leaveType?.leave_type}</td>
            </tr>
            <tr>
              <th>Duration</th>
              <td>{data.duration}</td>
            </tr>
            <tr>
              <th>Start Date</th>
              <td>{data.start_date}</td>
            </tr>
            <tr>
              <th>End Date</th>
              <td>{data.end_date}</td>
            </tr>
            <tr>
              <th>Reason</th>
              <td>{data.reason}</td>
            </tr>
            <tr>
              <th>Status</th>
              <strong>
                <td>{data.status}</td>
              </strong>
            </tr>
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ViewLeaveModal;
