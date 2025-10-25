import React, { useEffect, useState } from "react";
import { Modal, Form, Button, Row, Col, InputGroup } from "react-bootstrap";
import api from "../../../../api/axios";
import { salutationData } from "../../../../mockData";

const AddEditModal = ({
  show,
  handleClose,
  onSave,
  formData,
  setFormData,
  editData,
  loadingAPI,
}) => {
  const [leadSources, setLeadSources] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [requirementTypes, setRequirementTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showLeadSourceModal, setShowLeadSourceModal] = useState(false);
  const [newLeadSource, setNewLeadSource] = useState("");
  const [unitData, setUnitData] = useState([]);
  const [storeUnit, setStoreUnit] = useState("");
  const loggedInEmployeeId = sessionStorage.getItem("employee_id");

  const fetchDropdowns = async () => {
    try {
      setLoading(true);
      const [leadRes, empRes, reqRes, unitRes] = await Promise.all([
        api.get("/api/v1/admin/leadSource/active"),
        api.get("/api/v1/admin/employee/active"),
        api.get("/api/v1/admin/requirementLead/active"),
        api.get("/api/v1/admin/unit/active"),
      ]);
      setLeadSources(leadRes.data || []);
      setUnitData(unitRes.data.data || []);
      if (Array.isArray(empRes.data?.data)) setEmployees(empRes.data.data);
      setRequirementTypes(reqRes.data.data);

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
    if (name === "unit_id") {
      const selectedUnit = unitData?.find((u) => u.id.toString() === value);
      setStoreUnit(selectedUnit ? selectedUnit.unit : "");
    }
  };

  console.log("storeUnit", storeUnit);
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  console.log("requirementTypes", requirementTypes);
  return (
    <Modal show={show} onHide={handleClose} size="lg" backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>{editData ? "Edit Lead" : "Add Lead"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
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
            <Col>
              <Form.Group>
                <Form.Label>Gender</Form.Label>
                <div>
                  <Form.Check
                    inline
                    label="Male"
                    id="Male"
                    type="radio"
                    name="gender"
                    value="Male"
                    checked={formData.gender === "Male"}
                    onChange={handleChange}
                  />
                  <Form.Check
                    inline
                    label="Female"
                    id="Female"
                    type="radio"
                    name="gender"
                    value="Female"
                    checked={formData.gender === "Female"}
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
                    <Form.Label>Salutation</Form.Label>
                    <Form.Select
                      name="salutation"
                      value={formData.salutation}
                      onChange={handleChange}
                    >
                      <option disabled value="">
                        --
                      </option>
                      {salutationData?.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.salutation}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
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
                      placeholder="Enter Company Name"
                    />
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Your Name <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter Your Name"
                    />
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
                      <option value="">--</option>
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
                      placeholder="Enter Name"
                    />
                  </Form.Group>
                </Col>
              </>
            )}

            <Col md={4}>
              <Form.Group>
                <Form.Label>
                  Email <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter Email"
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>
                  Contact <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  required
                  placeholder="Enter Contact Number"
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>
                  Priority <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  required
                >
                  <option value="">--</option>
                  <option value="Low">🔴 Low</option>
                  <option value="Medium">🟡 Medium</option>
                  <option value="High">🟢 High</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label>
                  Lead Source <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  name="leadSource"
                  value={formData.leadSource}
                  required
                  onChange={(e) =>
                    e.target.value === "add_new"
                      ? setShowLeadSourceModal(true)
                      : handleChange(e)
                  }
                >
                  <option value="">--</option>
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
                <Form.Label>
                  Added By <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  name="addedBy"
                  value={formData.addedBy || ""}
                  onChange={handleChange}
                  required
                >
                  <option value="">--</option>
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
                <Form.Label>
                  Requirement Type <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  name="requirement_lead_id"
                  value={formData.requirement_lead_id || ""}
                  onChange={handleChange}
                  required
                >
                  <option value="">--</option>
                  {requirementTypes?.map((req) => (
                    <option key={req.id} value={req.id}>
                      {req.requirement_name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label>
                  Unit <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  name="unit_id"
                  value={formData.unit_id || ""}
                  onChange={handleChange}
                  required
                >
                  <option value="">--</option>
                  {unitData?.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.unit}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>
                  Approximate Capacity <span className="text-danger">*</span>
                </Form.Label>
                {/* ✅ Wrap input in InputGroup */}
                <InputGroup>
                  <Form.Control
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    placeholder="Enter Capacity"
                    min="0"
                    required
                  />
                  {/* {storeUnit && (
                    <small className="text-muted">
                      Capacity in <strong>{storeUnit}</strong>
                    </small>
                  )} */}
                  {/* Right Icon */}
                  {storeUnit && (
                    <InputGroup.Text style={{ padding: "0rem .7rem" }}>
                      <>{storeUnit}</>
                    </InputGroup.Text>
                  )}
                </InputGroup>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label>
                  State <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Enter State"
                  required
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label>
                  City <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Enter City"
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>
                  Pin Code <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="Enter Pin Code"
                  required
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label>
                  Last Call <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="date"
                  name="last_call"
                  value={formData.last_call}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={12}>
              <Form.Group>
                <Form.Label>
                  Address <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter Address"
                  required
                  style={{ color: "black" }}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={12}>
              <Form.Group>
                <Form.Label>Company Remark</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="company_remark"
                  value={formData.company_remark}
                  onChange={handleChange}
                  placeholder="Enter Company Remark"
                  style={{ color: "black" }}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={12}>
              <Form.Group>
                <Form.Label>Customer Remark</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="customer_remark"
                  value={formData.customer_remark}
                  onChange={handleChange}
                  placeholder="Enter Customer Remark"
                  style={{ color: "black" }}
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
                variant="primary"
                disabled={loadingAPI}
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
                {loadingAPI ? "Loading..." : "Save"}
              </Button>
            </Modal.Footer>
          </Modal>

          <div className="text-end mt-3">
            <Button
              type="submit"
              variant="primary"
              className="ms-2"
              disabled={loadingAPI}
            >
              {loadingAPI ? "Loading..." : "Save"}
            </Button>
          </div>
        </Form>
        {/* )} */}
      </Modal.Body>
    </Modal>
  );
};

export default AddEditModal;
