import React from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";
import * as FaIcons from "react-icons/fa";

const iconOptions = [
  "FaHome",
  "FaStar",
  "FaHeart",
  "FaTrophy",
  "FaAward",
  "FaUser",
  "FaMedal",
  "FaGem",
];

const AddEditModal = ({
  show,
  handleClose,
  formData,
  setFormData,
  onSave,
  modalTitle,
  buttonLabel,
}) => {
  return (
    <Modal show={show} onHide={handleClose} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>{modalTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Award Title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formIcon">
            <Form.Label>Icon</Form.Label>
            <Row>
              {iconOptions.map((iconName) => {
                const IconComponent = FaIcons[iconName];
                return (
                  <Col xs={3} key={iconName} className="mb-2">
                    <div
                      onClick={() =>
                        setFormData({ ...formData, icon: iconName })
                      }
                      style={{
                        cursor: "pointer",
                        border:
                          formData.icon === iconName
                            ? "2px solid #0d6efd"
                            : "1px solid #ddd",
                        borderRadius: "5px",
                        padding: "10px",
                        textAlign: "center",
                      }}
                    >
                      <IconComponent size={24} />
                    </div>
                  </Col>
                );
              })}
            </Row>
          </Form.Group>

          {/* <Form.Group className="mb-3" controlId="formColor">
            <Form.Label>Color</Form.Label>
            <Form.Control
              type="color"
              value={formData.color}
              onChange={(e) =>
                setFormData({ ...formData, color: e.target.value })
              }
            />
          </Form.Group> */}

          <Form.Group className="mb-3" controlId="formDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
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
