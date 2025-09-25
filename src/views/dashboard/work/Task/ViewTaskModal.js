import React from "react";
import { Modal, Row, Col } from "react-bootstrap";
import avatarPic from "../../../../assets/images/avatars/avatar-pic.jpg";

const ViewTaskModal = ({ show, handleClose, task }) => {
  if (!task) return null;

  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="md"
      centered
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title className="fw-lighter  fs-5">Task Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="px-2">
          <Row className="mb-2">
            <Col xs={5} className="fw-semibold text-muted">
              Title:
            </Col>
            <Col xs={7}>{task.title || "-"}</Col>
          </Row>

          <Row className="mb-2">
            <Col xs={5} className="fw-semibold text-muted">
              Project:
            </Col>
            <Col xs={7}>{task.project?.project_name || "-"}</Col>
          </Row>

          <Row className="mb-2">
            <Col xs={5} className="fw-semibold text-muted">
              Priority:
            </Col>
            <Col xs={7}>{task.priority || "-"}</Col>
          </Row>

          <Row className="mb-2">
            <Col xs={5} className="fw-semibold text-muted">
              Status:
            </Col>
            <Col xs={7}>{task.status || "-"}</Col>
          </Row>

          <Row className="mb-2">
            <Col xs={5} className="fw-semibold text-muted">
              Start Date:
            </Col>
            <Col xs={7}>
              {task.start_date
                ? new Date(task.start_date).toLocaleDateString()
                : "-"}
            </Col>
          </Row>

          <Row className="mb-2">
            <Col xs={5} className="fw-semibold text-muted">
              End Date:
            </Col>
            <Col xs={7}>
              {task.end_date
                ? new Date(task.end_date).toLocaleDateString()
                : "No Due Date"}
            </Col>
          </Row>

          <Row className="mb-2">
            <Col xs={5} className="fw-semibold text-muted">
              Description:
            </Col>
            <Col xs={7}>{task.description || "No description provided."}</Col>
          </Row>

          <Row className="mb-2">
            <Col xs={5} className="fw-semibold text-muted">
              Assigned To:
            </Col>
            <Col xs={7}>
              <div className="d-flex flex-wrap">
                {task.assign_to_details?.length > 0 ? (
                  task.assign_to_details.map((m, i) => (
                    <div
                      key={i}
                      className="d-flex align-items-center me-3 mb-2"
                    >
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
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ViewTaskModal;
