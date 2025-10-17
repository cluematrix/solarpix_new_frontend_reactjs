import React, { useEffect, useState } from "react";
import { Modal, Form, Button, Spinner } from "react-bootstrap";
import api from "../../../../api/axios";

const AddEditModal = ({
  show,
  handleClose,
  roleName,
  setRoleName,
  onSave,
  modalTitle,
  buttonLabel,
  departmentId,
  setDepartmentId,
}) => {
  const [departments, setDepartments] = useState([]);
  const [loadingDept, setLoadingDept] = useState(true);

  // Fetch departments when modal opens
  useEffect(() => {
    if (show) {
      setLoadingDept(true);
      api
        .get("/api/v1/admin/department")
        .then((res) => {
          if (Array.isArray(res.data)) setDepartments(res.data);
          else if (Array.isArray(res.data.data)) setDepartments(res.data.data);
          else setDepartments([]);
        })
        .catch((err) => {
          console.error("Error fetching departments:", err);
          setDepartments([]);
        })
        .finally(() => setLoadingDept(false));
    }
  }, [show]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave();
  };

  return (
    <Modal centered show={show} onHide={handleClose} backdrop="static">
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {/* Department Dropdown */}
          <Form.Group controlId="formDepartment">
            <Form.Label className="custom-form-label">
              Select Department
            </Form.Label>
            {loadingDept ? (
              <div className="d-flex align-items-center">
                <Spinner size="sm" className="me-2" /> Loading departments...
              </div>
            ) : (
              <Form.Select
                value={departmentId || ""}
                onChange={(e) => setDepartmentId(e.target.value)}
                className="custom-form-control"
                required
              >
                <option value="">-- Select Department --</option>
                {departments.map((dept) => (
                  <option key={dept.id || dept._id} value={dept.id || dept._id}>
                    {dept.name}
                  </option>
                ))}
              </Form.Select>
            )}
          </Form.Group>

          {/* Designation Name */}
          <Form.Group controlId="formRoleName" className="mt-3">
            <Form.Label className="custom-form-label">
              Designation Name
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter designation name"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              className="custom-form-control"
              required
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="primary" type="submit">
            {buttonLabel}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddEditModal;
