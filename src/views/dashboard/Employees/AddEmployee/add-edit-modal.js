import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";

const AddEditModal = ({ show, handleClose, onSave, editData }) => {
  const [formData, setFormData] = useState({
    employeeId: "",
    salutation: "",
    name: "",
    gender: "",
    address: "",
    dob: "",
    maritalStatus: "",
    probationEndDate: "",
    noticePeriodStartDate: "",
    noticePeriodEndDate: "",
    employmentType: "",
    loginAllowed: "",
    reportingTo: "",
    profilePic: null,
    mobileNo: "",
    email: "",
    department: "",
    designation: "",
    shift: "",
    password: "",
  });

  useEffect(() => {
    if (editData) {
      setFormData(editData);
    } else {
      setFormData((prev) => ({
        ...prev,
        employeeId: `Solar${String(Math.floor(Math.random() * 1000)).padStart(
          3,
          "0"
        )}`,
      }));
    }
  }, [editData]);

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
    handleClose();
  };

  return (
    <>
      <style>
        {`
          .custom-form-label {
            color: black !important;
          }
          .custom-form-control {
            color: #6c757d !important;
          }
          .custom-form-control::placeholder {
            color: #6c757d !important;
          }
          .custom-form-control:focus {
            color: black !important;
            border-color: #007bff;
            box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
          }
        `}
      </style>
      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editData ? "Update Employee" : "Add Employee"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            {/* Row 1 */}
            <Row>
              <Col md={4}>
                <Form.Group controlId="employeeId">
                  <Form.Label className="custom-form-label pt-2">
                    Employee ID
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleChange}
                    readOnly
                    className="custom-form-control"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="salutation">
                  <Form.Label className="custom-form-label pt-2">
                    Salutation
                  </Form.Label>
                  <Form.Control
                    as="select"
                    name="salutation"
                    value={formData.salutation}
                    onChange={handleChange}
                    className="custom-form-control"
                  >
                    <option value="">Select</option>
                    <option value="Mr">Mr</option>
                    <option value="Mrs">Mrs</option>
                    <option value="Dr">Dr</option>
                    <option value="Sir">Sir</option>
                    <option value="Mam">Mam</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="name">
                  <Form.Label className="custom-form-label pt-2">
                    Name
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="custom-form-control"
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Row 2 */}
            <Row>
              <Col md={4}>
                <Form.Group controlId="gender">
                  <Form.Label className="custom-form-label pt-2">
                    Gender
                  </Form.Label>
                  <Form.Control
                    as="select"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="custom-form-control"
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="mobileNo">
                  <Form.Label className="custom-form-label pt-2">
                    Mobile Number
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="mobileNo"
                    value={formData.mobileNo}
                    onChange={handleChange}
                    className="custom-form-control"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="email">
                  <Form.Label className="custom-form-label pt-2">
                    Email
                  </Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="custom-form-control"
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Row 3 */}
            <Row>
              <Col md={4}>
                <Form.Group controlId="password">
                  <Form.Label className="custom-form-label pt-2">
                    Password
                  </Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="custom-form-control"
                    placeholder="Enter password"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="address">
                  <Form.Label className="custom-form-label pt-2">
                    Address
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="custom-form-control"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="dob">
                  <Form.Label className="custom-form-label pt-2">
                    Date of Birth
                  </Form.Label>
                  <Form.Control
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    className="custom-form-control"
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Row 4 */}
            <Row>
              <Col md={4}>
                <Form.Group controlId="maritalStatus">
                  <Form.Label className="custom-form-label pt-2">
                    Marital Status
                  </Form.Label>
                  <Form.Control
                    as="select"
                    name="maritalStatus"
                    value={formData.maritalStatus}
                    onChange={handleChange}
                    className="custom-form-control"
                  >
                    <option value="">Select</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="probationEndDate">
                  <Form.Label className="custom-form-label pt-2">
                    Probation End Date
                  </Form.Label>
                  <Form.Control
                    type="date"
                    name="probationEndDate"
                    value={formData.probationEndDate}
                    onChange={handleChange}
                    className="custom-form-control"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="noticePeriodStartDate">
                  <Form.Label className="custom-form-label pt-2">
                    Notice Period Start Date
                  </Form.Label>
                  <Form.Control
                    type="date"
                    name="noticePeriodStartDate"
                    value={formData.noticePeriodStartDate}
                    onChange={handleChange}
                    className="custom-form-control"
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Row 5 */}
            <Row>
              <Col md={4}>
                <Form.Group controlId="noticePeriodEndDate">
                  <Form.Label className="custom-form-label pt-2">
                    Notice Period End Date
                  </Form.Label>
                  <Form.Control
                    type="date"
                    name="noticePeriodEndDate"
                    value={formData.noticePeriodEndDate}
                    onChange={handleChange}
                    className="custom-form-control"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="employmentType">
                  <Form.Label className="custom-form-label pt-2">
                    Employment Type
                  </Form.Label>
                  <Form.Control
                    as="select"
                    name="employmentType"
                    value={formData.employmentType}
                    onChange={handleChange}
                    className="custom-form-control"
                  >
                    <option value="">Select</option>
                    <option value="Full Time">Full Time</option>
                    <option value="Part Time">Part Time</option>
                    <option value="Contract">Contract</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="loginAllowed">
                  <Form.Label className="custom-form-label pt-2">
                    Login Allowed
                  </Form.Label>
                  <Form.Control
                    as="select"
                    name="loginAllowed"
                    value={formData.loginAllowed}
                    onChange={handleChange}
                    className="custom-form-control"
                  >
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>

            {/* Row 6 */}
            <Row>
              <Col md={4}>
                <Form.Group controlId="reportingTo">
                  <Form.Label className="custom-form-label pt-2">
                    Reporting To
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="reportingTo"
                    value={formData.reportingTo}
                    onChange={handleChange}
                    className="custom-form-control"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="department">
                  <Form.Label className="custom-form-label pt-2">
                    Department
                  </Form.Label>
                  <Form.Select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="custom-form-control"
                  >
                    <option value="">Select Department</option>
                    <option value="HRM">Human Resource Management</option>
                    <option value="IT">Information Technology</option>
                    <option value="Finance">Finance</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Operations">Operations</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="designation">
                  <Form.Label className="custom-form-label pt-2">
                    Designation
                  </Form.Label>
                  <Form.Select
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    className="custom-form-control"
                  >
                    <option value="">Select Designation</option>
                    <option value="Manager">Manager</option>
                    <option value="Team Lead">Team Lead</option>
                    <option value="Senior Developer">Senior Developer</option>
                    <option value="Analyst">Analyst</option>
                    <option value="Associate">Associate</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            {/* Row 7 */}
            <Row>
              <Col md={4}>
                <Form.Group controlId="shift">
                  <Form.Label className="custom-form-label pt-2">
                    Shift
                  </Form.Label>
                  <Form.Select
                    name="shift"
                    value={formData.shift}
                    onChange={handleChange}
                    className="custom-form-control"
                  >
                    <option value="">Select Shift</option>
                    <option value="Morning">Morning</option>
                    <option value="Afternoon">Afternoon</option>
                    <option value="Night">Night</option>
                    <option value="Rotational">Rotational</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="profilePic">
                  <Form.Label className="custom-form-label pt-2">
                    Profile Picture
                  </Form.Label>
                  <Form.Control
                    type="file"
                    name="profilePic"
                    accept="image/*"
                    onChange={handleChange}
                    className="custom-form-control"
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
    </>
  );
};

export default AddEditModal;
