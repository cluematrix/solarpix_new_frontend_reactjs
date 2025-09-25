import React from "react";
import { Modal, Button, Row, Col } from "react-bootstrap";
import avatarPic from "../../../../assets/images/avatars/avatar-pic.jpg";

const ViewTaskModal = ({ show, handleClose, task }) => {
  if (!task) return null;

  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="lg"
      centered
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title>Task Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row className="mb-3">
          <Col md={6}>
            <strong>Title:</strong>
            <div>{task.title || "-"}</div>
          </Col>
          <Col md={6}>
            <strong>Project:</strong>
            <div>{task.project?.project_name || "-"}</div>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <strong>Priority:</strong>
            <div>{task.priority || "-"}</div>
          </Col>
          <Col md={6}>
            <strong>Status:</strong>
            <div>{task.status || "-"}</div>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <strong>Start Date:</strong>
            <div>
              {task.start_date
                ? new Date(task.start_date).toLocaleDateString()
                : "-"}
            </div>
          </Col>
          <Col md={6}>
            <strong>End Date:</strong>
            <div>
              {task.end_date
                ? new Date(task.end_date).toLocaleDateString()
                : "No Due Date"}
            </div>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col>
            <strong>Description:</strong>
            <div>{task.description || "No description provided."}</div>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col>
            <strong>Assigned To:</strong>
            <div className="d-flex flex-wrap">
              {task.assign_to_details?.length > 0 ? (
                task.assign_to_details.map((m, i) => (
                  <div key={i} className="d-flex align-items-center me-3 mb-2">
                    <img
                      src={m.photo || avatarPic}
                      alt={m.name}
                      className="rounded-circle me-2"
                      style={{
                        width: "30px",
                        height: "30px",
                        objectFit: "cover",
                      }}
                    />
                    <span>{m.name}</span>
                  </div>
                ))
              ) : (
                <span>-</span>
              )}
            </div>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        {/* <Button variant="secondary" onClick={handleClose}>
          Close
        </Button> */}
      </Modal.Footer>
    </Modal>
  );
};

export default ViewTaskModal;
