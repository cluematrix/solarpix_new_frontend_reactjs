import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Card } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

const UpdateEmployee = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Employee ID from URL

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
    // Mock fetched data with all fields filled
    const fetchedData = {
      employeeId: id || "Solar101",
      salutation: "Mr",
      name: "John Doe",
      gender: "Male",
      address: "123 Sunshine Avenue, Pune, Maharashtra",
      dob: "1990-05-14",
      maritalStatus: "Married",
      probationEndDate: "2025-09-30",
      noticePeriodStartDate: "2025-10-01",
      noticePeriodEndDate: "2025-11-01",
      employmentType: "Full Time",
      loginAllowed: "Yes",
      reportingTo: "Jane Smith",
      profilePic: null, // could be an uploaded file
      mobileNo: "9876543210",
      email: "john.doe@example.com",
      department: "IT",
      designation: "Senior Software Engineer",
      shift: "Morning",
      password: "securePass@123",
    };
    setFormData(fetchedData);
  }, [id]);

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
    console.log("Updated Employee:", formData);
    // API call here
    navigate("/employee-list");
  };

  return (
    <Card>
      <Card.Header>
        <h4>Update Employee</h4>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          {/* Row 1 */}
          <Row>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Employee ID</Form.Label>
                <Form.Control
                  type="text"
                  name="employeeId"
                  value={formData.employeeId}
                  readOnly
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Salutation</Form.Label>
                <Form.Select
                  name="salutation"
                  value={formData.salutation}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option>Mr</option>
                  <option>Mrs</option>
                  <option>Dr</option>
                  <option>Sir</option>
                  <option>Mam</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Row 2 */}
          <Row className="mt-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Gender</Form.Label>
                <Form.Select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Date of Birth</Form.Label>
                <Form.Control
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Marital Status</Form.Label>
                <Form.Select
                  name="maritalStatus"
                  value={formData.maritalStatus}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option>Single</option>
                  <option>Married</option>
                  <option>Divorced</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          {/* Row 3 */}
          <Row className="mt-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Probation End Date</Form.Label>
                <Form.Control
                  type="date"
                  name="probationEndDate"
                  value={formData.probationEndDate}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Notice Period Start Date</Form.Label>
                <Form.Control
                  type="date"
                  name="noticePeriodStartDate"
                  value={formData.noticePeriodStartDate}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Notice Period End Date</Form.Label>
                <Form.Control
                  type="date"
                  name="noticePeriodEndDate"
                  value={formData.noticePeriodEndDate}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Row 4 */}
          <Row className="mt-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Employment Type</Form.Label>
                <Form.Select
                  name="employmentType"
                  value={formData.employmentType}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option>Full Time</option>
                  <option>Part Time</option>
                  <option>Contract</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Login Allowed</Form.Label>
                <Form.Select
                  name="loginAllowed"
                  value={formData.loginAllowed}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option>Yes</option>
                  <option>No</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Reporting To</Form.Label>
                <Form.Control
                  type="text"
                  name="reportingTo"
                  value={formData.reportingTo}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Row 5 */}
          <Row className="mt-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Mobile No</Form.Label>
                <Form.Control
                  type="text"
                  name="mobileNo"
                  value={formData.mobileNo}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Department</Form.Label>
                <Form.Select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option>IT</option>
                  <option>HR</option>
                  <option>Finance</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          {/* Row 6 */}
          <Row className="mt-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Designation</Form.Label>
                <Form.Control
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Shift</Form.Label>
                <Form.Select
                  name="shift"
                  value={formData.shift}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option>Morning</option>
                  <option>Evening</option>
                  <option>Night</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <div className="mt-3 text-end">
            <Button type="submit" variant="primary">
              Update
            </Button>
            <Button
              variant="secondary"
              className="ms-2"
              onClick={() =>
                navigate("/dashboard/Employees/AddEmployee/employee-list")
              }
            >
              Cancel
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default UpdateEmployee;
