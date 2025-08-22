import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";

const AddEditModal = ({ show, handleClose, onSave, editData }) => {
  const [formData, setFormData] = useState({
    shift_name: "",
    start_time: "",
    end_time: "",
    is_active: true, // default Active
  });
  console.log(formData);

  useEffect(() => {
    if (editData) {
      setFormData({
        shift_name: editData.shift_name || "",
        start_time: editData.start_time?.slice(0, 5) || "",
        end_time: editData.end_time?.slice(0, 5) || "",
        is_active: editData.is_active ?? 1,
      });
    } else {
      setFormData({
        shift_name: "",
        start_time: "",
        end_time: "",
        is_active: 1,
      });
    }
  }, [editData]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation: End time must be after start time
    const [sh, sm] = formData.start_time.split(":");
    const [eh, em] = formData.end_time.split(":");

    const startMinutes = parseInt(sh) * 60 + parseInt(sm);
    const endMinutes = parseInt(eh) * 60 + parseInt(em);

    if (endMinutes <= startMinutes) {
      alert("End time must be later than start time.");
      return;
    }

    // Ensure proper TIME format with seconds
    const payload = {
      ...formData,
      is_active: Number(formData.is_active), // always 0 or 1
      start_time:
        formData.start_time.length === 5
          ? formData.start_time + ":00"
          : formData.start_time,
      end_time:
        formData.end_time.length === 5
          ? formData.end_time + ":00"
          : formData.end_time,
    };

    onSave(payload);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{editData ? "Update Shift" : "Add Shift"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={12}>
              <Form.Group>
                <Form.Label className="pt-4">Shift Name</Form.Label>
                <Form.Control
                  type="text"
                  name="shift_name"
                  value={formData.shift_name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label className="pt-4">Start Time</Form.Label>
                <Form.Control
                  type="time"
                  name="start_time"
                  value={formData.start_time}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label className="pt-4">End Time</Form.Label>
                <Form.Control
                  type="time"
                  name="end_time"
                  value={formData.end_time}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            {/* <Col md={12}>
              <Form.Group>
                <Form.Label className="pt-4">Status</Form.Label>
                <Form.Select
                  name="is_active"
                  value={formData.is_active}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      is_active: Number(e.target.value), // convert string → number
                    }))
                  }
                >
                  <option value={1}>Active</option>
                  <option value={0}>Inactive</option>
                </Form.Select>
              </Form.Group>
            </Col> */}
          </Row>

          <div className="text-end mt-3">
            <Button type="submit" variant="primary">
              Save
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddEditModal;
