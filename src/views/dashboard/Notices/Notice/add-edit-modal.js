import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Row, Col, Spinner } from "react-bootstrap";
import api from "../../../../api/axios";
import { toast } from "react-toastify";
import { successToast } from "../../../../components/Toast/successToast";

const AddEditModal = ({ show, handleClose, editData, refetchNotice }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    notice_type: "specific",
    priority: "high",
  });

  const [loading, setLoading] = useState(false);

  // Employees, Departments, Designations
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);

  // Selections
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [selectedDesignations, setSelectedDesignations] = useState([]);
  const [selectAllEmployees, setSelectAllEmployees] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (editData) {
      setFormData({
        title: editData.title || "",
        description: editData.description || "",
        notice_type: editData.notice_type || "specific",
        priority: editData.priority || "high",
      });

      setSelectedEmployees(editData.employee_ids || []);
      setSelectAllEmployees(editData.employee_ids?.length === employees.length);
    } else {
      setFormData({
        title: "",
        description: "",
        notice_type: "specific",
        priority: "high",
      });
      setSelectedEmployees([]);
      setSelectAllEmployees(false);
    }
  }, [editData, employees]);

  const fetchInitialData = async () => {
    try {
      const [empRes, deptRes, desigRes] = await Promise.all([
        api.get("/api/v1/admin/employee/active"),
        api.get("/api/v1/admin/department/active"),
        api.get("/api/v1/admin/designation/active"),
      ]);
      setEmployees(empRes.data.data || []);
      setDepartments(deptRes.data.data || deptRes.data || []);
      setDesignations(desigRes.data.data || desigRes.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch initial data");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmployeeSelect = (id) => {
    setSelectedEmployees((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectAllEmployees) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(employees.map((e) => e.id));
    }
    setSelectAllEmployees(!selectAllEmployees);
  };

  const handleDepartmentSelect = (deptId) => {
    setSelectedDepartments((prev) =>
      prev.includes(deptId)
        ? prev.filter((id) => id !== deptId)
        : [...prev, deptId]
    );
  };

  const handleDesignationSelect = (desigId) => {
    setSelectedDesignations((prev) =>
      prev.includes(desigId)
        ? prev.filter((id) => id !== desigId)
        : [...prev, desigId]
    );
  };

  const filteredEmployees = employees.filter((emp) => {
    let deptMatch =
      selectedDepartments.length === 0 ||
      selectedDepartments.includes(emp.department_id);
    let desigMatch =
      selectedDesignations.length === 0 ||
      selectedDesignations.includes(emp.designation_id);

    // If both department and designation selected, show employees that match both
    return deptMatch && desigMatch;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const loggedInUserId = sessionStorage.getItem("employee_id");
      if (!loggedInUserId) {
        toast.error("Logged-in employee ID not found.");
        setLoading(false);
        return;
      }

      let employee_ids = [];
      if (formData.notice_type === "specific") {
        employee_ids = selectedEmployees;
      } else {
        employee_ids = filteredEmployees.map((e) => e.id);
      }

      const payload = {
        title: formData.title,
        description: formData.description,
        notice_type: "specific",
        priority: formData.priority,
        employee_ids,
        created_by: parseInt(loggedInUserId),
      };

      if (editData) {
        const res = await api.put(
          `/api/v1/admin/notice/${editData.id}`,
          payload
        );
        refetchNotice(res.data.data);
        successToast("Notice updated successfully");
      } else {
        const res = await api.post("/api/v1/admin/notice", payload);
        refetchNotice(res.data.data);
        successToast("Notice added successfully");
      }

      handleClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save notice");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop="static"
      centered
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>{editData ? "Edit Notice" : "Add Notice"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={12} className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </Col>

            <Col md={12} className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </Col>

            <Col md={6} className="mb-3">
              <Form.Label>Notice Type</Form.Label>
              <Form.Select
                name="notice_type"
                value={formData.notice_type}
                onChange={handleChange}
              >
                <option value="specific">Specific Employees</option>
                <option value="department">By Department/Designation</option>
              </Form.Select>
            </Col>

            <Col md={6} className="mb-3">
              <Form.Label>Priority</Form.Label>
              <Form.Select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </Form.Select>
            </Col>

            {formData.notice_type === "specific" && (
              <Col md={12} className="mb-3">
                <Form.Label>Employees</Form.Label>
                <div>
                  <Form.Check
                    type="checkbox"
                    label="Select All"
                    checked={selectAllEmployees}
                    onChange={handleSelectAll}
                  />
                  {employees.map((emp) => (
                    <Form.Check
                      key={emp.id}
                      type="checkbox"
                      label={emp.name}
                      checked={selectedEmployees.includes(emp.id)}
                      onChange={() => handleEmployeeSelect(emp.id)}
                    />
                  ))}
                </div>
              </Col>
            )}

            {formData.notice_type === "department" && (
              <>
                <Col md={6} className="mb-3">
                  <Form.Label>Departments</Form.Label>
                  {departments.map((dept) => (
                    <Form.Check
                      key={dept.id}
                      type="checkbox"
                      label={dept.name}
                      checked={selectedDepartments.includes(dept.id)}
                      onChange={() => handleDepartmentSelect(dept.id)}
                    />
                  ))}
                </Col>

                <Col md={6} className="mb-3">
                  <Form.Label>Designations</Form.Label>
                  {designations
                    .filter((d) =>
                      selectedDepartments.length === 0
                        ? true
                        : selectedDepartments.includes(d.department_id)
                    )
                    .map((desig) => (
                      <Form.Check
                        key={desig.id}
                        type="checkbox"
                        label={desig.name}
                        checked={selectedDesignations.includes(desig.id)}
                        onChange={() => handleDesignationSelect(desig.id)}
                      />
                    ))}
                </Col>

                <Col md={12} className="mb-3">
                  <Form.Label>Employees</Form.Label>
                  <div>
                    {filteredEmployees.length === 0 ? (
                      <p>
                        No employees found for selected department/designation.
                      </p>
                    ) : (
                      <>
                        <Form.Check
                          type="checkbox"
                          label="Select All"
                          checked={
                            filteredEmployees.every((e) =>
                              selectedEmployees.includes(e.id)
                            ) && filteredEmployees.length > 0
                          }
                          onChange={() => {
                            const allIds = filteredEmployees.map((e) => e.id);
                            const allSelected = allIds.every((id) =>
                              selectedEmployees.includes(id)
                            );
                            if (allSelected) {
                              setSelectedEmployees((prev) =>
                                prev.filter((id) => !allIds.includes(id))
                              );
                            } else {
                              setSelectedEmployees((prev) => [
                                ...new Set([...prev, ...allIds]),
                              ]);
                            }
                          }}
                        />
                        {filteredEmployees.map((emp) => (
                          <Form.Check
                            key={emp.id}
                            type="checkbox"
                            label={emp.name}
                            checked={selectedEmployees.includes(emp.id)}
                            onChange={() => handleEmployeeSelect(emp.id)}
                          />
                        ))}
                      </>
                    )}
                  </div>
                </Col>
              </>
            )}
          </Row>

          <div className="d-flex justify-content-end">
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? <Spinner size="sm" animation="border" /> : "Save"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddEditModal;
