import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";

const AddEditLeaveModal = ({ show, handleClose, onSave, editData }) => {
  const [formData, setFormData] = useState({
    employeeName: "",
    leaveType: "",
    duration: "",
    date: "",
    reason: "",
  });

  useEffect(() => {
    if (editData) {
      setFormData(editData);
    } else {
      setFormData({
        employeeName: "",
        leaveType: "",
        duration: "",
        date: "",
        reason: "",
      });
    }
  }, [editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.employeeName || !formData.leaveType || !formData.reason) {
      alert("Please fill all required fields.");
      return;
    }
    onSave(formData);
    handleClose();
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editData ? "Update Leave Request" : "Add Leave Request"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="pt-4">Employee Name *</Form.Label>
                  <Form.Select
                    name="employeeName"
                    value={formData.employeeName}
                    onChange={handleChange}
                  >
                    <option value="">Select Employee</option>
                    <option value="John Doe">Medha</option>
                    <option value="Jane Smith">Rishi</option>
                    <option value="Alex Brown">Mujahid</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="pt-4">Leave Type *</Form.Label>
                  <Form.Select
                    name="leaveType"
                    value={formData.leaveType}
                    onChange={handleChange}
                  >
                    <option value="">Select Leave Type</option>
                    <option value="Casual">Casual</option>
                    <option value="Sick">Sick</option>
                    <option value="Earned">Earned</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="pt-4">Duration</Form.Label>
                  <Form.Select
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                  >
                    <option value="">Select Duration</option>
                    <option value="Full Day">Full Day</option>
                    <option value="First Half">First Half</option>
                    <option value="Second Half">Second Half</option>
                    <option value="Multiple Days">Multiple Days</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              {formData.duration === "Multiple Days" ? (
                <>
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label className="pt-4">From Date</Form.Label>
                      <Form.Control
                        type="date"
                        name="fromDate"
                        value={formData.fromDate || ""}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label className="pt-4">To Date</Form.Label>
                      <Form.Control
                        type="date"
                        name="toDate"
                        value={formData.toDate || ""}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </>
              ) : (
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="pt-4">Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              )}
            </Row>

            <Row className="mt-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="pt-4">Reason for Absence *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    placeholder="Enter reason"
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="mt-3 text-end">
              <Button type="submit" variant="primary">
                Save
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AddEditLeaveModal;
