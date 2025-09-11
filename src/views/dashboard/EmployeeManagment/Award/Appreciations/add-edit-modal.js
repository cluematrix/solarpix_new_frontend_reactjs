import React, { useEffect, useState } from "react";
import Select from "react-select";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import api from "../../../../../api/axios";
import * as FaIcons from "react-icons/fa";

const AddEditModal = ({
  show,
  handleClose,
  formData,
  setFormData,
  onSave,
  modalTitle,
  buttonLabel,
}) => {
  const [awards, setAwards] = useState([]);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    api.get("/api/v1/admin/award/active").then((res) => {
      setAwards(res.data.data || res.data || []);
    });
    api.get("/api/v1/admin/employee/active").then((res) => {
      setEmployees(res.data.data || []);
    });
  }, []);

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{modalTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row>
            {/* Award Dropdown */}
            <Col md={6}>
              <Form.Group>
                <Form.Label className="pt-2">Award</Form.Label>
                <Select
                  name="award_id"
                  value={
                    awards.find((a) => a.id === formData.award_id)
                      ? {
                          value: formData.award_id,
                          label: (
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              {FaIcons[
                                awards.find((a) => a.id === formData.award_id)
                                  .icon
                              ] &&
                                React.createElement(
                                  FaIcons[
                                    awards.find(
                                      (a) => a.id === formData.award_id
                                    ).icon
                                  ],
                                  { style: { marginRight: 8 } }
                                )}
                              {
                                awards.find((a) => a.id === formData.award_id)
                                  .title
                              }
                            </div>
                          ),
                        }
                      : null
                  }
                  onChange={(selected) =>
                    setFormData({ ...formData, award_id: selected?.value })
                  }
                  options={awards.map((a) => {
                    const IconComp = FaIcons[a.icon] || null;
                    return {
                      value: a.id,
                      label: (
                        <div style={{ display: "flex", alignItems: "center" }}>
                          {IconComp && <IconComp style={{ marginRight: 8 }} />}
                          {a.title}
                        </div>
                      ),
                    };
                  })}
                  placeholder="Select Award"
                />
              </Form.Group>
            </Col>

            {/* Employee Dropdown */}
            <Col md={6}>
              <Form.Group>
                <Form.Label className="pt-2">Employee</Form.Label>
                <Form.Select
                  name="employee_id"
                  value={formData.employee_id || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, employee_id: e.target.value })
                  }
                >
                  <option value="">Select Employee</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          {/* Date */}
          <Row>
            <Col md={6}>
              <Form.Group className="pt-3">
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  value={formData.date || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Description */}
          <Form.Group className="pt-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter Description"
              value={formData.description || ""}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </Form.Group>

          {/* Photo Upload + Preview */}
          <Form.Group className="pt-3">
            <Form.Label>Photo</Form.Label>
            <Form.Control
              type="file"
              onChange={(e) =>
                setFormData({ ...formData, photo: e.target.files[0] })
              }
            />

            {/* Show existing photo if available */}
            {formData.existingPhoto && !formData.photo && (
              <div className="mt-2 text-center">
                <img
                  src={formData.existingPhoto}
                  alt="Existing"
                  style={{
                    width: "120px",
                    height: "120px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
                <div>
                  <Button
                    size="sm"
                    variant="outline-danger"
                    className="mt-2"
                    onClick={() =>
                      setFormData({ ...formData, existingPhoto: null })
                    }
                  >
                    Remove
                  </Button>
                </div>
              </div>
            )}

            {/* Show new preview if uploading */}
            {formData.photo && (
              <div className="mt-2 text-center">
                <p className="small text-muted">New Photo Preview:</p>
                <img
                  src={URL.createObjectURL(formData.photo)}
                  alt="Preview"
                  style={{
                    width: "120px",
                    height: "120px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
              </div>
            )}
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onSave}>
          {buttonLabel}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddEditModal;
