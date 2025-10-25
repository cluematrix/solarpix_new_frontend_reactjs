// modify by sufyan on 24 oct 2025

import React, { useEffect, useState } from "react";
import { Modal, Form, Button, Row, Col, InputGroup } from "react-bootstrap";
import api from "../../../../api/axios";
import { Formik, Form as FormikForm, ErrorMessage } from "formik";
import * as Yup from "yup";
import { salutationData } from "../../../../mockData";

// Validation Schema
const leadValidationSchema = Yup.object().shape({
  salutation: Yup.string().required("Please select salutation"),
  customerType: Yup.string().required("Please select customer type"),
  companyName: Yup.string().when("customerType", {
    is: "Business",
    then: (schema) =>
      schema.required("Company name is required for business customers"),
    otherwise: (schema) => schema.notRequired(),
  }),
  name: Yup.string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters"),
  email: Yup.string()
    .email("Invalid email address")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/,
      "Please enter a valid email address"
    )
    .required("Email is required"),

  contact: Yup.string()
    .required("Contact number is required")
    .matches(/^[6-9]\d{9}$/, "Enter valid 10-digit number"),
  priority: Yup.string().required("Please select priority"),
  leadSource: Yup.string().required("Please select lead source"),
  addedBy: Yup.string().required("Please select who added this lead"),
  requirement_lead_id: Yup.string().required("Please select requirement type"),
  unit_id: Yup.string().required("Please select unit"),
  capacity: Yup.number()
    .required("Please enter capacity")
    .positive("Capacity must be positive"),
  state: Yup.string().required("State is required"),
  city: Yup.string().required("City is required"),
  pincode: Yup.string()
    .required("Pincode is required")
    .matches(/^\d{6}$/, "Enter valid 6-digit pincode"),
  address: Yup.string().required("Address is required"),
  last_call: Yup.date().required("Please select last call date"),
  gender: Yup.string().required("Please select gender"),
});

const AddEditModal = ({
  show,
  handleClose,
  onSave,
  formData,
  setFormData,
  editData,
  loadingAPI,
}) => {
  console.log("formData", formData);
  const [leadSources, setLeadSources] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [requirementTypes, setRequirementTypes] = useState([]);
  const [unitData, setUnitData] = useState([]);
  const [showLeadSourceModal, setShowLeadSourceModal] = useState(false);
  const [newLeadSource, setNewLeadSource] = useState("");
  const [storeUnit, setStoreUnit] = useState("");
  const loggedInEmployeeId = sessionStorage.getItem("employee_id");

  // Fetch Dropdown Data
  const fetchDropdowns = async () => {
    try {
      const [leadRes, empRes, reqRes, unitRes] = await Promise.all([
        api.get("/api/v1/admin/leadSource/active"),
        api.get("/api/v1/admin/employee/active"),
        api.get("/api/v1/admin/requirementLead/active"),
        api.get("/api/v1/admin/unit/active"),
      ]);
      setLeadSources(leadRes.data || []);
      setUnitData(unitRes.data.data || []);
      setEmployees(empRes.data?.data || []);
      setRequirementTypes(reqRes.data.data || []);

      if (!formData.addedBy && loggedInEmployeeId) {
        setFormData((prev) => ({ ...prev, addedBy: loggedInEmployeeId }));
      }
    } catch (err) {
      console.error("Error fetching dropdown data:", err);
    }
  };

  useEffect(() => {
    if (show) fetchDropdowns();
  }, [show]);

  return (
    <Modal show={show} onHide={handleClose} size="lg" backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>{editData ? "Edit Lead" : "Add Lead"}</Modal.Title>
      </Modal.Header>

      <Formik
        initialValues={formData}
        enableReinitialize
        validationSchema={leadValidationSchema}
        onSubmit={(values) => onSave(values)}
      >
        {({
          values,
          handleChange,
          handleSubmit,
          errors,
          touched,
          isSubmitting,
        }) => {
          console.log(errors);

          return (
            <FormikForm onSubmit={handleSubmit}>
              <Modal.Body>
                {/* ================= Customer Type / Gender ================= */}
                <Row className="mb-3">
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Customer Type</Form.Label>
                      <div>
                        {["Individual", "Business"].map((type) => (
                          <Form.Check
                            inline
                            key={type}
                            label={type}
                            id={type}
                            type="radio"
                            name="customerType"
                            value={type}
                            checked={values.customerType === type}
                            onChange={handleChange}
                            isInvalid={
                              touched.customerType && !!errors.customerType
                            }
                          />
                        ))}
                      </div>
                      <ErrorMessage
                        name="customerType"
                        component="div"
                        className="text-danger small errors-text"
                      />
                    </Form.Group>
                  </Col>

                  <Col>
                    <Form.Group>
                      <Form.Label>Gender</Form.Label>
                      <div>
                        {["Male", "Female"].map((g) => (
                          <Form.Check
                            inline
                            key={g}
                            label={g}
                            type="radio"
                            name="gender"
                            value={g}
                            checked={values.gender === g}
                            onChange={handleChange}
                            isInvalid={touched.gender && !!errors.gender}
                          />
                        ))}
                      </div>
                      <ErrorMessage
                        name="gender"
                        component="div"
                        className="text-danger small errors-text"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {/* ================= Name / Email / Company ================= */}
                <Row className="mb-3">
                  {values.customerType === "Business" && (
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>
                          Company Name <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="companyName"
                          value={values.companyName}
                          onChange={handleChange}
                          isInvalid={
                            touched.companyName && !!errors.companyName
                          }
                          placeholder="Enter Company Name"
                        />
                        <ErrorMessage
                          name="companyName"
                          component="div"
                          className="text-danger small errors-text"
                        />
                      </Form.Group>
                    </Col>
                  )}
                  <Col md={4}>
                    {" "}
                    <Form.Group className="mb-3">
                      {" "}
                      <Form.Label>
                        Salutation <span className="text-danger">*</span>
                      </Form.Label>{" "}
                      <Form.Select
                        name="salutation"
                        value={values.salutation}
                        onChange={handleChange}
                        isInvalid={touched.priority && !!errors.priority}
                      >
                        {" "}
                        <option disabled value="">
                          {" "}
                          --{" "}
                        </option>{" "}
                        {salutationData?.map((option) => (
                          <option key={option.value} value={option.salutation}>
                            {" "}
                            {option.salutation}{" "}
                          </option>
                        ))}{" "}
                      </Form.Select>{" "}
                      <ErrorMessage
                        name="salutation"
                        component="div"
                        className="text-danger small errors-text"
                      />
                    </Form.Group>{" "}
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>
                        Name <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={values.name}
                        onChange={handleChange}
                        isInvalid={touched.name && !!errors.name}
                        placeholder="Enter Name"
                      />
                      <ErrorMessage
                        name="name"
                        component="div"
                        className="text-danger small errors-text"
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
                        value={values.email}
                        onChange={handleChange}
                        isInvalid={touched.email && !!errors.email}
                        placeholder="Enter Email"
                      />
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="text-danger small errors-text"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {/* ================= Contact / Priority / Lead Source ================= */}
                <Row className="mb-3">
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>
                        Contact <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="contact"
                        value={values.contact}
                        onChange={handleChange}
                        isInvalid={touched.contact && !!errors.contact}
                        placeholder="Enter Contact Number"
                      />
                      <ErrorMessage
                        name="contact"
                        component="div"
                        className="text-danger small errors-text"
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
                        value={values.priority}
                        onChange={handleChange}
                        isInvalid={touched.priority && !!errors.priority}
                      >
                        <option value="">--</option>
                        <option value="Low">🔴 Low</option>
                        <option value="Medium">🟡 Medium</option>
                        <option value="High">🟢 High</option>
                      </Form.Select>
                      <ErrorMessage
                        name="priority"
                        component="div"
                        className="text-danger small errors-text"
                      />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>
                        Lead Source <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Select
                        name="leadSource"
                        value={values.leadSource}
                        onChange={(e) =>
                          e.target.value === "add_new"
                            ? setShowLeadSourceModal(true)
                            : handleChange(e)
                        }
                        isInvalid={touched.leadSource && !!errors.leadSource}
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
                          {" "}
                          + Add Lead{" "}
                        </option>
                      </Form.Select>
                      <ErrorMessage
                        name="leadSource"
                        component="div"
                        className="text-danger small errors-text"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {/* ================= AddedBy / Requirement / Unit ================= */}
                <Row className="mb-3">
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>
                        Added By <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Select
                        name="addedBy"
                        value={values.addedBy || ""}
                        onChange={handleChange}
                        isInvalid={touched.addedBy && !!errors.addedBy}
                      >
                        <option value="">--</option>
                        {employees.map((emp) => (
                          <option key={emp.id} value={emp.id}>
                            {emp.name}
                          </option>
                        ))}
                      </Form.Select>
                      <ErrorMessage
                        name="addedBy"
                        component="div"
                        className="text-danger small errors-text"
                      />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>
                        Requirement Type <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Select
                        name="requirement_lead_id"
                        value={values.requirement_lead_id || ""}
                        onChange={handleChange}
                        isInvalid={
                          touched.requirement_lead_id &&
                          !!errors.requirement_lead_id
                        }
                      >
                        <option value="">--</option>
                        {requirementTypes?.map((req) => (
                          <option key={req.id} value={req.id}>
                            {req.requirement_name}
                          </option>
                        ))}
                      </Form.Select>
                      <ErrorMessage
                        name="requirement_lead_id"
                        component="div"
                        className="text-danger small errors-text"
                      />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>
                        Unit <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Select
                        name="unit_id"
                        value={values.unit_id || ""}
                        onChange={(e) => {
                          handleChange(e);
                          const selected = unitData.find(
                            (u) => u.id.toString() === e.target.value
                          );
                          setStoreUnit(selected ? selected.unit : "");
                        }}
                        isInvalid={touched.unit_id && !!errors.unit_id}
                      >
                        <option value="">--</option>
                        {unitData?.map((u) => (
                          <option key={u.id} value={u.id}>
                            {u.unit}
                          </option>
                        ))}
                      </Form.Select>
                      <ErrorMessage
                        name="unit_id"
                        component="div"
                        className="text-danger small errors-text"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {/* ================= Capacity / State / City ================= */}
                <Row className="mb-3">
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>
                        Approx. Capacity <span className="text-danger">*</span>
                      </Form.Label>
                      <InputGroup>
                        <Form.Control
                          type="number"
                          name="capacity"
                          value={values.capacity}
                          onChange={handleChange}
                          isInvalid={touched.capacity && !!errors.capacity}
                          placeholder="Enter Capacity"
                        />
                        {storeUnit && (
                          <InputGroup.Text>{storeUnit}</InputGroup.Text>
                        )}
                      </InputGroup>
                      <ErrorMessage
                        name="capacity"
                        component="div"
                        className="text-danger small errors-text"
                      />
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
                        value={values.state}
                        onChange={handleChange}
                        isInvalid={touched.state && !!errors.state}
                        placeholder="Enter State"
                      />
                      <ErrorMessage
                        name="state"
                        component="div"
                        className="text-danger small errors-text"
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
                        value={values.city}
                        onChange={handleChange}
                        isInvalid={touched.city && !!errors.city}
                        placeholder="Enter City"
                      />
                      <ErrorMessage
                        name="city"
                        component="div"
                        className="text-danger small errors-text"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {/* ================= Pincode / Last Call ================= */}
                <Row className="mb-3">
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>
                        Pin Code <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="pincode"
                        value={values.pincode}
                        onChange={handleChange}
                        isInvalid={touched.pincode && !!errors.pincode}
                        placeholder="Enter Pincode"
                      />
                      <ErrorMessage
                        name="pincode"
                        component="div"
                        className="text-danger small errors-text"
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
                        value={values.last_call}
                        onChange={handleChange}
                        isInvalid={touched.last_call && !!errors.last_call}
                        max={new Date().toISOString().split("T")[0]}
                      />
                      <ErrorMessage
                        name="last_call"
                        component="div"
                        className="text-danger small errors-text"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {/* ================= Address / Remarks ================= */}
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
                        value={values.address}
                        onChange={handleChange}
                        isInvalid={touched.address && !!errors.address}
                        placeholder="Enter Address"
                        style={{ color: "black" }}
                      />
                      <ErrorMessage
                        name="address"
                        component="div"
                        className="text-danger small errors-text"
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
                        value={values.company_remark}
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
                        value={values.customer_remark}
                        onChange={handleChange}
                        placeholder="Enter Customer Remark"
                        style={{ color: "black" }}
                      />
                    </Form.Group>
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
                          const res = await api.post(
                            "/api/v1/admin/leadSource",
                            {
                              lead_source: newLeadSource,
                              isActive: true,
                            }
                          );
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

                {/* ================= Submit Button ================= */}
                <div className="text-end mt-3">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Saving..." : "Save"}
                  </Button>
                </div>
              </Modal.Body>
            </FormikForm>
          );
        }}
      </Formik>
    </Modal>
  );
};

export default AddEditModal;
