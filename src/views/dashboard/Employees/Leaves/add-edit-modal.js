import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";
import api from "../../../../api/axios"; // adjust path if needed

const AddEditLeaveModal = ({ show, handleClose, onSave, editData }) => {
  const [employees, setEmployees] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);

  const [formData, setFormData] = useState({
    employeeId: "",
    leaveTypeId: "",
    duration: "",
    date: "",
    fromDate: "",
    toDate: "",
    reason: "",
  });

  // Fetch employees & leave types when modal opens
  useEffect(() => {
    const fetchData = async () => {
      try {
        const empRes = await api.get("/api/v1/admin/employee/active");
        const empList = Array.isArray(empRes.data)
          ? empRes.data
          : empRes.data.data;
        setEmployees(empList || []);

        const leaveRes = await api.get("/api/v1/admin/leaveType/active");
        const leaveList = Array.isArray(leaveRes.data)
          ? leaveRes.data
          : leaveRes.data.data;
        setLeaveTypes(leaveList || []);
      } catch (error) {
        console.error("Error fetching dropdown data", error);
      }
    };

    if (show) fetchData();
  }, [show]);

  // Prefill when editing
  useEffect(() => {
    if (editData) {
      setFormData(editData);
    } else {
      setFormData({
        employeeId: "",
        leaveTypeId: "",
        duration: "",
        date: "",
        fromDate: "",
        toDate: "",
        reason: "",
      });
    }
  }, [editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.employeeId || !formData.leaveTypeId || !formData.reason) {
      alert("Please fill all required fields.");
      return;
    }

    // Normalize dates
    let startDate = formData.fromDate || formData.date || null;
    let endDate =
      formData.duration === "Multiple Days"
        ? formData.toDate
        : formData.date || null;

    const payload = {
      employee_id: Number(formData.employeeId),
      leave_type_id: Number(formData.leaveTypeId),
      duration: formData.duration,
      status: "Pending",
      status_change_emp_id: 1, // replace with logged-in emp id
      reason: formData.reason,
      start_date: startDate,
      end_date: endDate,
    };

    try {
      let response;
      if (editData) {
        response = await api.put(
          `/api/v1/admin/employeeLeave/${editData.id}`,
          payload
        );
      } else {
        response = await api.post("/api/v1/admin/employeeLeave", payload);
      }

      // API returns saved leave (without relations sometimes)
      let savedLeave = response.data.data || response.data;

      // 🔹 Enrich with employee & leaveType objects so UI shows name without refresh
      const employeeObj = employees.find(
        (emp) => emp.id === Number(formData.employeeId)
      );
      const leaveTypeObj = leaveTypes.find(
        (lt) => lt.id === Number(formData.leaveTypeId)
      );

      savedLeave = {
        ...savedLeave,
        employee: employeeObj || savedLeave.employee,
        leaveType: leaveTypeObj || savedLeave.leaveType,
      };

      onSave(savedLeave);
      handleClose();
    } catch (error) {
      console.error("Error saving leave", error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          {editData ? "Update Leave Request" : "Add Leave Request"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Row>
            {/* Employee Dropdown */}
            <Col md={6}>
              <Form.Group>
                <Form.Label className="pt-4">Employee *</Form.Label>
                <Form.Select
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleChange}
                >
                  <option value="">Select Employee</option>
                  {(employees || []).map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            {/* Leave Type Dropdown */}
            <Col md={6}>
              <Form.Group>
                <Form.Label className="pt-4">Leave Type *</Form.Label>
                <Form.Select
                  name="leaveTypeId"
                  value={formData.leaveTypeId}
                  onChange={handleChange}
                >
                  <option value="">Select Leave Type</option>
                  {(leaveTypes || []).map((lt) => (
                    <option key={lt.id} value={lt.id}>
                      {lt.leave_type}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          {/* Duration + Dates */}
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

          {/* Reason */}
          <Row className="mt-3">
            <Col md={12}>
              <Form.Group>
                <Form.Label className="pt-4">Reason *</Form.Label>
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
  );
};

export default AddEditLeaveModal;
