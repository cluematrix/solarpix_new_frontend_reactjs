import React, { useEffect, useState } from "react";
import { Modal, Form, Button, Row, Col, Badge } from "react-bootstrap";

const AddEditProjectModal = ({
  show,
  handleClose,
  onSave,
  formData,
  setFormData,
  editData,
}) => {
  const [showMembersModal, setShowMembersModal] = useState(false);

  const departmentOptions = [
    { value: "HRM", label: "Human Resource Management" },
    { value: "IT", label: "Information Technology" },
    { value: "Finance", label: "Finance" },
    { value: "Marketing", label: "Marketing" },
    { value: "Operations", label: "Operations" },
  ];

  const membersList = [
    { id: "Rohit Sharma", name: "Rohit Sharma" },
    { id: "Priya Singh", name: "Priya Singh" },
    { id: "Amit Verma", name: "Amit Verma" },
    { id: "Neha Gupta", name: "Neha Gupta" },
  ];

  // const currencyOptions = ["USD", "EUR", "INR", "GBP"];

  useEffect(() => {
    if (!editData) {
      setFormData((prev) => ({ ...prev, file: null, projectMembers: [] }));
    }
  }, [editData, setFormData]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const toggleMemberSelection = (id) => {
    setFormData((prev) => {
      const alreadySelected = prev.projectMembers.includes(id);
      return {
        ...prev,
        projectMembers: alreadySelected
          ? prev.projectMembers.filter((m) => m !== id) // remove if already selected
          : [...prev.projectMembers, id], // add new
      };
    });
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editData ? "Edit Project" : "Add Project"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            {/* Row 1 */}
            <Row>
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="pt-4">Short Code</Form.Label>
                  <Form.Control
                    type="text"
                    name="shortCode"
                    value={formData.shortCode}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="pt-4">
                    Project Name <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="projectName"
                    value={formData.projectName}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="pt-4">Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Row 2 */}
            <Row className="mt-2">
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="pt-4">Deadline</Form.Label>
                  <Form.Control
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="pt-4">Department</Form.Label>
                  <Form.Select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                  >
                    <option value="">Select Department</option>
                    {departmentOptions.map((dept) => (
                      <option key={dept.value} value={dept.value}>
                        {dept.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="pt-4">Customer</Form.Label>
                  <Form.Control
                    type="text"
                    name="customer"
                    value={formData.customer}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Row 3 */}
            <Row className="mt-2">
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="pt-4">Project Summary</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="projectSummary"
                    value={formData.projectSummary}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Row 4 - Members */}
            <Row className="mt-2">
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="pt-4">Project Members</Form.Label>
                  <div>
                    {formData.projectMembers?.length > 0 ? (
                      formData.projectMembers.map((m) => (
                        <Badge bg="info" text="dark" className="me-2" key={m}>
                          {m}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-muted">No members selected</p>
                    )}
                  </div>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="mt-2"
                    onClick={() => setShowMembersModal(true)}
                  >
                    Select Members
                  </Button>
                </Form.Group>
              </Col>
            </Row>

            {/* Row 5 */}
            <Row className="mt-2">
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="pt-4">Add File</Form.Label>
                  <Form.Control
                    type="file"
                    name="file"
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              {/* <Col md={4}>
                <Form.Group>
                  <Form.Label className="pt-4">Currency</Form.Label>
                  <Form.Select
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                  >
                    <option value="">Select Currency</option>
                    {currencyOptions.map((curr) => (
                      <option key={curr} value={curr}>
                        {curr}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col> */}
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="pt-4">Project Budget</Form.Label>
                  <Form.Control
                    type="number"
                    name="projectBudget"
                    value={formData.projectBudget}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Row 6 */}
            <Row className="mt-2">
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="pt-4">Hours Estimate</Form.Label>
                  <Form.Control
                    type="number"
                    name="hoursEstimate"
                    value={formData.hoursEstimate}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="text-end mt-3">
              <Button variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" className="ms-2">
                Save Project
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Members Selection Modal */}
      <Modal show={showMembersModal} onHide={() => setShowMembersModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Select Project Members</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {membersList.map((member) => (
            <Form.Check
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

export default AddEditProjectModal;
