import React, { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import api from "../../../../api/axios";

const AddEditModal = ({
  show,
  handleClose,
  onSave,
  formData,
  setFormData,
  editData,
  leads,
}) => {
  const [employees, setEmployees] = useState([]);

  const loggedInEmployeeId = sessionStorage.getItem("employee_id");

  // Fetch active employees for "Schedule By"
  const fetchEmployees = async () => {
    try {
      const res = await api.get("/api/v1/admin/employee/active");
      if (Array.isArray(res.data?.data)) setEmployees(res.data.data);
    } catch (err) {
      console.error("Error fetching employees:", err);
    }
  };

  useEffect(() => {
    if (show) {
      fetchEmployees();

      // Set default followup_date to today if adding new
      if (!editData && !formData.followup_date) {
        const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
        setFormData((prev) => ({ ...prev, followup_date: today }));
      }
    }
  }, [show, editData, formData.followup_date, setFormData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalData = {
      ...formData,
      schedule_by_id: formData.schedule_by_id || loggedInEmployeeId,
    };
    onSave(finalData);
  };

  const selectedLead = leads.find(
    (lead) => lead.id === parseInt(formData.lead_id)
  );

  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="md"
      centered
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {editData ? "Edit Follow-up" : "Add Follow-up"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {/* Lead Selection */}
          {!editData && (
            <Form.Group className="mb-3">
              <Form.Label>
                Lead <span className="text-danger">*</span>
              </Form.Label>
              <Form.Select
                name="lead_id"
                value={formData.lead_id}
                onChange={handleChange}
                required
              >
                <option value="">Select Lead</option>
                {leads.map((lead) => (
                  <option key={lead.id} value={lead.id}>
                    {lead.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          )}

          {/* Mobile Number */}
          {selectedLead && (
            <Form.Group className="mb-3">
              <Form.Label>Mobile Number</Form.Label>
              <Form.Control
                type="text"
                value={selectedLead.contact || ""}
                readOnly
              />
            </Form.Group>
          )}

          {/* Follow-up Message */}
          <Form.Group className="mb-3">
            <Form.Label>
              Message <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* Follow-up Date */}
          {/* Follow-up DateTime */}
          <Form.Group className="mb-3">
            <Form.Label>
              Follow-up Date & Time <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="datetime-local"
              name="followup_date"
              value={formData.followup_date || ""}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* Schedule By */}
          <Form.Group className="mb-3">
            <Form.Label>
              Schedule By <span className="text-danger">*</span>
            </Form.Label>
            <Form.Select
              name="schedule_by_id"
              value={formData.schedule_by_id || loggedInEmployeeId || ""}
              onChange={handleChange}
              required
            >
              <option value="">Select Employee</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          {/* Action Buttons */}
          <div className="text-end">
            <Button type="submit" variant="primary" className="ms-2">
              Submit
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddEditModal;
