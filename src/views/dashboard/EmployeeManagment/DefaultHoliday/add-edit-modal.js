import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
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
  const handleDayChange = (day) => {
    const selectedDays = formData.day || [];

    if (selectedDays.includes(day)) {
      setFormData({
        ...formData,
        day: selectedDays.filter((d) => d !== day),
      });
    } else {
      setFormData({
        ...formData,
        day: [...selectedDays, day],
      });
    }
  };

  return (
    <Modal centered show={show} onHide={handleClose} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>{modalTitle}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          {/* ✅ Days */}
          <Form.Group className="mb-3">
            <Form.Label>Select Days</Form.Label>
            <div className="d-flex flex-wrap gap-3">
              {DAYS_OF_WEEK.map((day) => (
                <Form.Check
                  key={day}
                  type="checkbox"
                  label={day}
                  checked={formData.day?.includes(day) || false}
                  onChange={() => handleDayChange(day)}
                />
              ))}
            </div>
          </Form.Group>

          {/* ✅ Occasion */}
          <Form.Group className="mb-3">
            <Form.Label>Occasion</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter occasion (e.g., Weekly Off)"
              value={formData.occasion || ""}
              onChange={(e) =>
                setFormData({ ...formData, occasion: e.target.value })
              }
            />
          </Form.Group>

          {/* ✅ Year */}
          <Form.Group>
            <Form.Label>Year</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter year (e.g., 2025)"
              value={formData.year || ""}
              onChange={(e) =>
                setFormData({ ...formData, year: e.target.value })
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
