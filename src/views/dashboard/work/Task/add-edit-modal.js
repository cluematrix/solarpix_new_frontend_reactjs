import React, { useEffect, useState } from "react";
import { Modal, Form, Button, Row, Col, Spinner } from "react-bootstrap";
import api from "../../../../api/axios";
import { statusOptions } from "../../../../mockData";

const AddEditTaskModal = ({
  show,
  handleClose,
  onSave,
  formData,
  setFormData,
  editData,
}) => {
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [projectOptions, setProjectOptions] = useState([]);
  const [membersList, setMembersList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);

  // ✅ Fetch dropdown data when modal opens
  useEffect(() => {
    if (show) fetchData();
  }, [show]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Categories
      // Fetch Task Categories
      const categoryRes = await api.get("/api/v1/admin/taskCategory/active");

      // If backend returns array directly
      if (Array.isArray(categoryRes.data)) {
        setCategoryOptions(categoryRes.data);
      }
      // If backend wraps in { success, data }
      else if (categoryRes.data.success) {
        setCategoryOptions(categoryRes.data.data || categoryRes.data || []);
      }

      // Projects
      const projectRes = await api.get("/api/v1/admin/project/active");
      if (projectRes.data.success) {
        setProjectOptions(projectRes.data.data || []);
      }

      // Employees
      const empRes = await api.get("/api/v1/admin/employee/active");
      if (empRes.data.success) {
        setMembersList(empRes.data.data || []);
      }
    } catch (err) {
      console.error("Error fetching dropdowns:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Form field change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // ✅ Toggle member selection (multi select)
  const toggleMemberSelection = (id) => {
    setFormData((prev) => {
      const alreadySelected = prev.projectMembers?.includes(id);
      return {
        ...prev,
        projectMembers: alreadySelected
          ? prev.projectMembers.filter((m) => m !== id) // remove
          : [...(prev.projectMembers || []), id], // add
      };
    });
  };

  // ✅ Show selected member names
  const selectedMemberNames = membersList
    .filter((m) => formData.projectMembers?.includes(m.id))
    .map((m) => m.name);

  // ✅ Submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    // send to parent (TaskList)
    onSave(formData);
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editData ? "Edit Task" : "Add Task"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loading ? (
            <div className="text-center my-5">
              <Spinner animation="border" />
            </div>
          ) : (
            <Form onSubmit={handleSubmit}>
              <Row>
                {/* Title */}
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="pt-4">
                      Title <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="title"
                      value={formData.title || ""}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>

                {/* Category */}
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="pt-4">
                      Task Category <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Select
                      name="category"
                      value={formData.category || ""}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Category</option>
                      {categoryOptions.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.category}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mt-2">
                {/* Project */}
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="pt-4">
                      Project <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Select
                      name="project"
                      value={formData.project || ""}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Project</option>
                      {projectOptions.map((proj) => (
                        <option key={proj.id} value={proj.id}>
                          {proj.project_name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>

                {/* Start Date */}
                <Col md={3}>
                  <Form.Group>
                    <Form.Label className="pt-4">
                      Start Date <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="date"
                      name="startDate"
                      value={formData.startDate || ""}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>

                {/* Due Date */}
                <Col md={3}>
                  <Form.Group>
                    <Form.Label className="pt-4">Due Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="dueDate"
                      value={formData.dueDate || ""}
                      onChange={handleChange}
                      disabled={formData.withoutDueDate}
                      required
                    />
                    <Form.Check
                      className="mt-1"
                      type="checkbox"
                      label="Without Due Date"
                      name="withoutDueDate"
                      checked={formData.withoutDueDate || false}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mt-2">
                {/* Status */}
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="pt-4">
                      Status <span className="text-danger">*</span>
                    </Form.Label>

                    <Form.Select
                      name="status"
                      value={formData.status || ""}
                      onChange={handleChange}
                      required
                    >
                      {statusOptions.map((status) => (
                        <option key={status.name} value={status.name}>
                          {status.icon} {status.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="pt-4">
                      Assigned To <span className="text-danger">*</span>
                    </Form.Label>
                    <div className="d-flex align-items-center">
                      <Form.Control
                        type="text"
                        value={
                          selectedMemberNames.length > 0
                            ? selectedMemberNames.join(", ")
                            : "No members selected"
                        }
                        readOnly
                        required
                      />
                      <Button
                        variant="outline-primary"
                        className="ms-2"
                        onClick={() => setShowMembersModal(true)}
                      >
                        Select
                      </Button>
                    </div>
                  </Form.Group>
                </Col>
              </Row>

              {/* Description */}
              <Row className="mt-2">
                <Col md={12}>
                  <Form.Group>
                    <Form.Label className="pt-4">
                      Description <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="description"
                      value={formData.description || ""}
                      onChange={handleChange}
                      required
                      style={{ color: "black" }}
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* Buttons */}
              <div className="text-end mt-3">
                <Button variant="secondary" onClick={handleClose}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" className="ms-2">
                  Save Task
                </Button>
              </div>
            </Form>
          )}
        </Modal.Body>
      </Modal>

      {/* ✅ Members Selection Modal */}
      <Modal show={showMembersModal} onHide={() => setShowMembersModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Select Project Members</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {membersList.map((member) => (
            <Form.Check
              id={member.id}
              key={member.id}
              type="checkbox"
              label={member.name}
              checked={formData.projectMembers?.includes(member.id)}
              onChange={() => toggleMemberSelection(member.id)}
            />
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowMembersModal(false)}
          >
            Close
          </Button>
          <Button variant="primary" onClick={() => setShowMembersModal(false)}>
            Save Selection
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddEditTaskModal;
