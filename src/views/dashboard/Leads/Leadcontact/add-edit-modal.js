import React, { useEffect, useState } from "react";
import { Modal, Form, Button, Row, Col, Spinner } from "react-bootstrap";
import api from "../../../../api/axios";

const AddEditModal = ({
  show,
  handleClose,
  onSave,
  formData,
  setFormData,
  editData,
}) => {
  const [leadSources, setLeadSources] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [requirementTypes, setRequirementTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showLeadSourceModal, setShowLeadSourceModal] = useState(false);
  const [newLeadSource, setNewLeadSource] = useState("");

  const loggedInEmployeeId = sessionStorage.getItem("employee_id");

  const fetchDropdowns = async () => {
    try {
      setLoading(true);
      const [leadRes, empRes, reqRes] = await Promise.all([
        api.get("/api/v1/admin/leadSource/active"),
        api.get("/api/v1/admin/employee/active"),
        api.get("/api/v1/admin/requirementType/active"),
      ]);
      setLeadSources(leadRes.data || []);
      if (Array.isArray(empRes.data?.data)) setEmployees(empRes.data.data);
      if (Array.isArray(reqRes.data)) setRequirementTypes(reqRes.data);

      if (!formData.addedBy && loggedInEmployeeId) {
        setFormData((prev) => ({ ...prev, addedBy: loggedInEmployeeId }));
      }
    } catch (err) {
      console.error("Error fetching dropdown data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (show) fetchDropdowns();
  }, [show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>{editData ? "Edit Lead" : "Add Lead"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="text-center py-3">
            <Spinner animation="border" />
          </div>
        ) : (
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Enquiry Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="enquiry_number"
                    value={formData.enquiry_number}
                    readOnly
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label>Customer Type</Form.Label>
                  <div>
                    <Form.Check
                      inline
                      label="Individual"
                      id="Individual"
                      type="radio"
                      name="customerType"
                      value="Individual"
                      checked={formData.customerType === "Individual"}
                      onChange={handleChange}
                    />
                    <Form.Check
                      inline
                      label="Business"
                      id="Business"
                      type="radio"
                      name="customerType"
                      value="Business"
                      checked={formData.customerType === "Business"}
                      onChange={handleChange}
                    />
                  </div>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              {formData.customerType === "Business" ? (
                <>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Company Name <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        required
                        placeholder="Enter company name"
                      />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Contact Person Name{" "}
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Enter name"
                      />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Priority</Form.Label>
                      <Form.Select
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                      >
                        <option value="">Select Priority</option>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </>
              ) : (
                <>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Salutation</Form.Label>
                      <Form.Select
                        name="salutation"
                        value={formData.salutation}
                        onChange={handleChange}
                      >
                        <option value="">Select</option>
                        <option value="Mr.">Mr.</option>
                        <option value="Mrs.">Mrs.</option>
                        <option value="Ms.">Ms.</option>
                        <option value="Dr.">Dr.</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Name <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Enter name"
                      />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Priority</Form.Label>
                      <Form.Select
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                      >
                        <option value="">Select Priority</option>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </>
              )}
            </Row>

            <Row className="mb-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email will be used to send proposals"
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label>Contact</Form.Label>
                  <Form.Control
                    type="text"
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    required
                    placeholder="Enter contact number"
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label>Lead Source</Form.Label>
                  <Form.Select
                    name="leadSource"
                    value={formData.leadSource}
                    onChange={(e) =>
                      e.target.value === "add_new"
                        ? setShowLeadSourceModal(true)
                        : handleChange(e)
                    }
                  >
                    <option value="">Select Lead Source</option>
                    {leadSources.map((src) => (
                      <option key={src.id} value={src.id}>
                        {src.lead_source}
                      </option>
                    ))}
                    <option
                      value="add_new"
                      style={{ fontWeight: "bold", color: "#3a57e8" }}
                    >
                      + Add Lead
                    </option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Added By</Form.Label>
                  <Form.Select
                    name="addedBy"
                    value={formData.addedBy || ""}
                    onChange={handleChange}
                  >
                    <option value="">Select Employee</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label>Approximate Capacity (kW)</Form.Label>
                  <Form.Control
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    placeholder="Enter capacity in kW"
                    min="0"
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label>State</Form.Label>
                  <Form.Control
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Enter state"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter city"
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter address"
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label>Pincode</Form.Label>
                  <Form.Control
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="Enter pin code"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Company Remark</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="company_remark"
                    value={formData.company_remark}
                    onChange={handleChange}
                    placeholder="Enter company remark"
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label>Customer Remark</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="customer_remark"
                    value={formData.customer_remark}
                    onChange={handleChange}
                    placeholder="Enter customer remark"
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label>Last Call</Form.Label>
                  <Form.Control
                    type="date"
                    name="last_call"
                    value={formData.last_call}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3"></Row>

            {/* Lead Source Modal */}
            <Modal
              show={showLeadSourceModal}
              onHide={() => setShowLeadSourceModal(false)}
              centered
            >
              <Modal.Header closeButton>
                <Modal.Title>Add New Lead Source</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form.Group>
                  <Form.Label>Lead Source Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter lead source"
                    value={newLeadSource}
                    onChange={(e) => setNewLeadSource(e.target.value)}
                  />
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={() => setShowLeadSourceModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={async () => {
                    try {
                      const res = await api.post("/api/v1/admin/leadSource", {
                        lead_source: newLeadSource,
                        isActive: true,
                      });
                      if (res.data) {
                        const updatedRes = await api.get(
                          "/api/v1/admin/leadSource/active"
                        );
                        setLeadSources(updatedRes.data || []);
                      }
                      setNewLeadSource("");
                      setShowLeadSourceModal(false);
                    } catch (err) {
                      console.error("Error adding lead source:", err);
                    }
                  }}
                >
                  Save
                </Button>
              </Modal.Footer>
            </Modal>

            <div className="text-end mt-3">
              <Button variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" className="ms-2">
                Submit
              </Button>
            </div>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default AddEditModal;
