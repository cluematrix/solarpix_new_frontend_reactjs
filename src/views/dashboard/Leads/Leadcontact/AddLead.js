import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Button,
  Row,
  Col,
  InputGroup,
  Card,
} from "react-bootstrap";
import api from "../../../../api/axios";
import { successToast } from "../../../../components/Toast/successToast";
import { useNavigate, useParams } from "react-router-dom";
import { errorToast } from "../../../../components/Toast/errorToast";

const AddLead = () => {
  const [leadSources, setLeadSources] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [requirementTypes, setRequirementTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showLeadSourceModal, setShowLeadSourceModal] = useState(false);
  const [newLeadSource, setNewLeadSource] = useState("");
  const [unitData, setUnitData] = useState([]);
  const [storeUnit, setStoreUnit] = useState("");
  const loggedInEmployeeId = sessionStorage.getItem("employee_id");
  const [editIndex, setEditIndex] = useState(null);
  const [loadingAPI, setLoadingAPI] = useState(false);
  const [leadList, setLeadList] = useState([]);
  const [sameAsBilling, setSameAsBilling] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    customerType: "Individual",
    companyName: "",
    salutation: "",
    name: "",
    amount: "",
    email: "",
    contact: "",
    leadSource: "",
    addedBy: "",
    leadOwner: "",
    reference: "",
    requirementType: "",
    capacity: "",
    status: "Progress",
    company_remark: "",
    customer_remark: "",
    last_call: "",
    priority: "",
    requirement_lead_id: "",

    //address billing
    billing_city: "",
    billing_state: "",
    billing_address: "",
    billing_pincode: "",
    shipping_city: "",
    shipping_state: "",
    shipping_address: "",
    shipping_pincode: "",
  });

  const resetForm = () => {
    setFormData({
      customerType: "Individual",
      companyName: "",
      salutation: "",
      name: "",
      amount: "",
      email: "",
      contact: "",
      leadSource: "",
      addedBy: "",
      leadOwner: "",
      city: "",
      state: "",
      pincode: "",
      reference: "",
      address: "",
      requirementType: "",
      capacity: "",
      status: "Progress",
      company_remark: "",
      customer_remark: "",
      last_call: "",
      priority: "",
      requirement_lead_id: "",
      unit_id: "",
    });
    setEditIndex(null);
  };

  // Save lead
  // const handleAddOrUpdateLead = async (e) => {
  //   e.preventDefault();

  //   const data = formData;
  //   console.log("dataEditTime", data);
  //   const payload = {
  //     customer_type: data.customerType,
  //     name: data.name,
  //     company_name: data.customerType === "Business" ? data.companyName : null,
  //     salutation: data.customerType === "Individual" ? data.salutation : null,
  //     email: data.email,
  //     contact: data.contact,
  //     lead_source: Number(data.leadSource),
  //     added_by: Number(data.addedBy),
  //     lead_owner: data.leadOwner ? Number(data.leadOwner) : null,
  //     city: data.city,
  //     state: data.state,
  //     amount: data.amount ? Number(data.amount) : null,
  //     pincode: data.pincode,
  //     reference: data.reference,
  //     address: data.address,
  //     requirement_type_id: Number(data.requirementType) || null,
  //     capacity: data.capacity ? Number(data.capacity) : null,
  //     status: data.status,
  //     company_remark: data.company_remark,
  //     customer_remark: data.customer_remark,
  //     last_call: data.last_call,
  //     priority: data.priority,
  //     requirement_lead_id: data.requirement_lead_id || "",
  //     unit_id: data.unit_id || "",

  //     //address
  //     billing_city: data.billing_city || "",
  //     billing_state: data.billing_state || "",
  //     billing_address: data.billing_address || "",
  //     billing_pincode: data.billing_pincode || "",
  //     shipping_city: data.shipping_city || "",
  //     shipping_state: data.shipping_state || "",
  //     shipping_address: data.shipping_address || "",
  //     shipping_pincode: data.shipping_pincode || "",
  //   };

  //   try {
  //     if (editIndex !== null) {
  //       setLoadingAPI(true);
  //       await api.put(`/api/v1/admin/lead/${leadList[editIndex].id}`, payload);
  //       successToast("Lead updated successfully");
  //     } else {
  //       setLoadingAPI(true);
  //       await api.post("/api/v1/admin/lead", payload);
  //       successToast("Lead created successfully");
  //     }
  //     // fetchLeads();
  //     navigate("/leads-list");
  //     resetForm();
  //   } catch (err) {
  //     setLoadingAPI(false);
  //     console.error("Error saving lead:", err);
  //     errorToast("Error while adding the lead");
  //   } finally {
  //     setLoadingAPI(false);
  //   }
  // };

  // Fetch Lead by ID if Edit Mode
  const fetchLeadById = async () => {
    if (!id) return;
    try {
      setLoadingAPI(true);
      const res = await api.get(`/api/v1/admin/lead/${id}`);
      const lead = res.data?.data || res.data;

      if (!lead) return;

      setFormData({
        customerType: lead.customer_type || "Individual",
        companyName: lead.company_name || "",
        salutation: lead.salutation || "",
        name: lead.name || "",
        email: lead.email || "",
        contact: lead.contact || "",
        amount: lead.amount || "",
        leadSource: lead.lead_source?.id || lead.lead_source || "",
        addedBy: lead.added_by?.id || lead.added_by || "",
        leadOwner: lead.lead_owner?.id || lead.lead_owner || "",
        reference: lead.reference || "",
        requirementType:
          lead.requirement_type_id?.id || lead.requirement_type_id || "",
        capacity: lead.capacity || "",
        status: lead.status || "Progress",
        company_remark: lead.company_remark || "",
        customer_remark: lead.customer_remark || "",
        last_call: lead.last_call ? lead.last_call.split("T")[0] : "",
        priority: lead.priority || "",
        requirement_lead_id: lead.requirement_lead_id || "",
        unit_id: lead.unit_id || "",
        billing_city: lead.billing_city || "",
        billing_state: lead.billing_state || "",
        billing_address: lead.billing_address || "",
        billing_pincode: lead.billing_pincode || "",
        shipping_city: lead.shipping_city || "",
        shipping_state: lead.shipping_state || "",
        shipping_address: lead.shipping_address || "",
        shipping_pincode: lead.shipping_pincode || "",
      });
    } catch (err) {
      console.error("Error fetching lead:", err);
      errorToast("Failed to fetch lead details");
    } finally {
      setLoadingAPI(false);
    }
  };

  //  Handle Submit (Create / Update)
  const handleAddOrUpdateLead = async (e) => {
    e.preventDefault();
    setLoadingAPI(true);

    try {
      const data = formData;
      const payload = {
        customer_type: data.customerType,
        name: data.name,
        company_name:
          data.customerType === "Business" ? data.companyName : null,
        salutation: data.customerType === "Individual" ? data.salutation : null,
        email: data.email,
        contact: data.contact,
        lead_source: Number(data.leadSource),
        added_by: Number(data.addedBy),
        lead_owner: data.leadOwner ? Number(data.leadOwner) : null,
        amount: data.amount ? Number(data.amount) : null,
        reference: data.reference,
        requirement_type_id: Number(data.requirementType) || null,
        capacity: data.capacity ? Number(data.capacity) : null,
        status: data.status,
        company_remark: data.company_remark,
        customer_remark: data.customer_remark,
        last_call: data.last_call,
        priority: data.priority,
        requirement_lead_id: data.requirement_lead_id || "",
        unit_id: data.unit_id || "",
        billing_city: data.billing_city || "",
        billing_state: data.billing_state || "",
        billing_address: data.billing_address || "",
        billing_pincode: data.billing_pincode || "",
        shipping_city: data.shipping_city || "",
        shipping_state: data.shipping_state || "",
        shipping_address: data.shipping_address || "",
        shipping_pincode: data.shipping_pincode || "",
      };

      if (id) {
        await api.put(`/api/v1/admin/lead/${id}`, payload);
        successToast("Lead updated successfully");
      } else {
        await api.post("/api/v1/admin/lead", payload);
        successToast("Lead created successfully");
      }

      navigate("/leads-list");
    } catch (err) {
      console.error("Error saving lead:", err);
      errorToast("Error while saving the lead");
    } finally {
      setLoadingAPI(false);
    }
  };
  // const handleEdit = (index) => {
  //   const lead = leadList[index];
  //   console.log("leadEdit", lead);
  //   setFormData({
  //     customerType: lead.customer_type || "Individual",
  //     companyName: lead.company_name || "",
  //     name: lead.name || "",
  //     salutation:
  //       lead.customer_type === "Individual" ? lead.salutation || "" : "",
  //     amount: lead.amount || "",
  //     email: lead.email || "",
  //     contact: lead.contact || "",
  //     leadSource: lead.lead_source?.id || lead.lead_source || "",
  //     addedBy: lead.added_by?.id || lead.added_by || "",
  //     leadOwner: lead.lead_owner?.id || lead.lead_owner || "",
  //     city: lead.city || "",
  //     state: lead.state || "",
  //     pincode: lead.pincode || "",
  //     reference: lead.reference || "",
  //     address: lead.address || "",
  //     requirementType:
  //       lead.requirement_type_id?.id || lead.requirement_type_id || "",
  //     capacity: lead.capacity || "",
  //     status: lead.status || "",
  //     company_remark: lead.company_remark || "",
  //     customer_remark: lead.customer_remark || "",
  //     last_call: lead.last_call || "",
  //     priority: lead.priority || "",
  //     requirement_lead_id: lead.requirement_lead_id || "",
  //     unit_id: lead.unit_id || "",
  //   });
  //   setEditIndex(index);
  // };

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
    fetchDropdowns();
  }, []);

  useEffect(() => {
    if (id) fetchLeadById();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === "unit_id") {
      const selectedUnit = unitData?.find((u) => u.id.toString() === value);
      setStoreUnit(selectedUnit ? selectedUnit.unit : "");
    }
  };

  console.log("storeUnit", storeUnit);
  // const handleSubmit = (e) => {
  //   onSave(formData);
  // };

  // same as billing address copy

  const handleCheckboxChange = (e) => {
    const checked = e.target.checked;
    setSameAsBilling(checked);
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        shipping_city: prev.billing_city,
        shipping_state: prev.billing_state,
        shipping_address: prev.billing_address,
        shipping_pincode: prev.billing_pincode,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        shipping_city: "",
        shipping_state: "",
        shipping_address: "",
        shipping_pincode: "",
      }));
    }
  };

  return (
    <Card>
      <Card.Header>
        <h5 className="mb-0">Lead</h5>
      </Card.Header>
      <hr />
      <Card.Body className="pt-0">
        <Form onSubmit={handleAddOrUpdateLead}>
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
              </>
            )}
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
                {/* Wrap input in InputGroup */}
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

          {/* ====== Billing Address ====== */}
          <Row className="mb-3">
            {/* right side */}
            <Col md={6}>
              <Col md={12} style={{ marginTop: "26px" }}>
                <h5 className="mb-3">Billing Address</h5>
              </Col>

              <Col md={8} className="mb-1">
                <Form.Group>
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type="text"
                    name="billing_city"
                    value={formData.billing_city}
                    onChange={handleChange}
                    placeholder="Enter City"
                    style={{ color: "black" }}
                  />
                </Form.Group>
              </Col>

              <Col md={8} className="mb-1">
                <Form.Group>
                  <Form.Label>State</Form.Label>
                  <Form.Control
                    type="text"
                    name="billing_state"
                    value={formData.billing_state}
                    onChange={handleChange}
                    placeholder="Enter State"
                    style={{ color: "black" }}
                  />
                </Form.Group>
              </Col>

              <Col md={8} className="mb-1">
                <Form.Group>
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="billing_address"
                    value={formData.billing_address}
                    onChange={handleChange}
                    placeholder="Enter Billing Address"
                    style={{ color: "black" }}
                  />
                </Form.Group>
              </Col>

              <Col md={8} className="mb-1">
                <Form.Group>
                  <Form.Label>Pincode</Form.Label>
                  <Form.Control
                    type="text"
                    name="billing_pincode"
                    value={formData.billing_pincode}
                    onChange={handleChange}
                    placeholder="Enter Pincode"
                    style={{ color: "black" }}
                  />
                </Form.Group>
              </Col>
            </Col>

            {/* left side */}
            <Col md={6}>
              <Col md={12}>
                <Form.Check
                  type="checkbox"
                  label="Same as Billing Address"
                  checked={sameAsBilling}
                  onChange={handleCheckboxChange}
                />
              </Col>
              <Col md={12}>
                <h5 className="mb-3">Shipping Address</h5>
              </Col>

              <Col md={8} className="mb-1">
                <Form.Group>
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type="text"
                    name="shipping_city"
                    value={formData.shipping_city}
                    onChange={handleChange}
                    placeholder="Enter City"
                    style={{ color: "black" }}
                    disabled={sameAsBilling}
                  />
                </Form.Group>
              </Col>

              <Col md={8} className="mb-1">
                <Form.Group>
                  <Form.Label>State</Form.Label>
                  <Form.Control
                    type="text"
                    name="shipping_state"
                    value={formData.shipping_state}
                    onChange={handleChange}
                    placeholder="Enter State"
                    style={{ color: "black" }}
                    disabled={sameAsBilling}
                  />
                </Form.Group>
              </Col>

              <Col md={8} className="mb-1">
                <Form.Group>
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="shipping_address"
                    value={formData.shipping_address}
                    onChange={handleChange}
                    placeholder="Enter Shipping Address"
                    style={{ color: "black" }}
                    disabled={sameAsBilling}
                  />
                </Form.Group>
              </Col>

              <Col md={8} className="mb-1">
                <Form.Group>
                  <Form.Label>Pin Code</Form.Label>
                  <Form.Control
                    type="text"
                    name="shipping_pincode"
                    value={formData.shipping_pincode}
                    onChange={handleChange}
                    placeholder="Enter Pincode"
                    style={{ color: "black" }}
                    disabled={sameAsBilling}
                  />
                </Form.Group>
              </Col>
            </Col>
          </Row>

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
      </Card.Body>
    </Card>
  );
};

export default AddLead;
