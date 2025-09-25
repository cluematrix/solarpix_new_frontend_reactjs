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

  const priorityOptions = ["Low", "Medium", "High", "Critical"];
  const taskTypeOptions = [
    "Survey",
    "Procurement",
    "Installation",
    "Testing",
    "Inspection",
    "Docs",
  ];

  useEffect(() => {
    if (show) fetchDropdownData();
  }, [show]);

  const fetchDropdownData = async () => {
    try {
      setLoading(true);
      const catRes = await api.get("/api/v1/admin/taskCategory/active");
      setCategoryOptions(catRes.data || []);

      const projRes = await api.get("/api/v1/admin/project/active");
      setProjectOptions(projRes.data.data || []);

      const empRes = await api.get("/api/v1/admin/employee/active");
      setMembersList(empRes.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const toggleMember = (id) => {
    setFormData((prev) => ({
      ...prev,
      assign_to: prev.assign_to?.includes(id)
        ? prev.assign_to.filter((m) => m !== id)
        : [...(prev.assign_to || []), id],
    }));
  };

  const selectedMemberNames = membersList
    .filter((m) => formData.assign_to?.includes(m.id))
    .map((m) => m.name);

  const handleSubmit = (e) => {
    e.preventDefault();
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
            <Spinner animation="border" />
          ) : (
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Title *</Form.Label>
                    <Form.Control
                      name="title"
                      value={formData.title || ""}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Category *</Form.Label>
                    <Form.Select
                      name="task_category_id"
                      value={formData.task_category_id || ""}
                      onChange={handleChange}
                    >
                      <option value="">Select Category</option>
                      {categoryOptions.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.category}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mt-2">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Project *</Form.Label>
                    <Form.Select
                      name="project_id"
                      value={formData.project_id || ""}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Project</option>
                      {projectOptions.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.project_name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Start Date *</Form.Label>
                    <Form.Control
                      type="date"
                      name="start_date"
                      value={formData.start_date || ""}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Due Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="end_date"
                      value={formData.end_date || ""}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mt-2">
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Status *</Form.Label>
                    <Form.Select
                      name="status"
                      value={formData.status || "pending"}
                      onChange={handleChange}
                    >
                      {statusOptions.map((s) => (
                        <option key={s.name} value={s.name}>
                          {s.icon} {s.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Priority *</Form.Label>
                    <Form.Select
                      name="priority"
                      value={formData.priority || "Medium"}
                      onChange={handleChange}
                    >
                      {priorityOptions.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Task Type *</Form.Label>
                    <Form.Select
                      name="task_type"
                      value={formData.task_type || ""}
                      onChange={handleChange}
                    >
                      <option value="">Select Type</option>
                      {taskTypeOptions.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mt-2">
                {/* <Col md={6}>
                  <Form.Group>
                    <Form.Label>Assigned By *</Form.Label>
                    <Form.Control
                      type="text"
                      name="assign_by"
                      value={formData.assign_by || ""}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col> */}
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Assigned To *</Form.Label>
                    <div className="d-flex">
                      <Form.Control
                        type="text"
                        value={
                          selectedMemberNames.join(", ") ||
                          "No members selected"
                        }
                        readOnly
                        required
                      />
                      <Button
                        className="ms-2"
                        onClick={() => setShowMembersModal(true)}
                      >
                        Select
                      </Button>
                    </div>
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mt-2">
                <Col md={12}>
                  <Form.Group>
                    <Form.Label>Description *</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="description"
                      value={formData.description || ""}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <div className="text-end mt-3">
                {/* <Button variant="secondary" onClick={handleClose}>
                  Cancel
                </Button> */}
                <Button variant="primary" type="submit" className="ms-2">
                  Save
                </Button>
              </div>
            </Form>
          )}
        </Modal.Body>
      </Modal>

      {/* Members Modal */}
      <Modal show={showMembersModal} onHide={() => setShowMembersModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Select Members</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {membersList.map((m) => (
            <Form.Check
              key={m.id}
              type="checkbox"
              label={m.name}
              checked={formData.assign_to?.includes(m.id)}
              onChange={() => toggleMember(m.id)}
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
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddEditTaskModal;
