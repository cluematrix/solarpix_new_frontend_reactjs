import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../../../../api/axios"; // axios instance

const AddEmployee = () => {
  const navigate = useNavigate();

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
    city: "",
    state: "",
    pincode: "",
    skill: "",
  });

  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [shift, setShift] = useState([]);
  const [employee, setemployee] = useState([]);
  // Generate random Employee ID
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      employeeId: `Solar${String(Math.floor(Math.random() * 1000)).padStart(
        3,
        "0"
      )}`,
    }));
  }, []);

  // Fetch departments and designations
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await api.get("/api/v1/admin/department");
        if (res.data && Array.isArray(res.data)) {
          const activeDepartments = res.data.filter(
            (item) => item.isActive === true || item.isActive === 1
          );
          setDepartments(activeDepartments);
        }
      } catch (err) {
        console.error("Error fetching departments:", err);
      }
    };


    // fetch employee
    const fetchEmployee = async () => {
      try {
        const res = await api.get("/api/v1/admin/employee");
        if (res.data && Array.isArray(res.data)) {
          console.log(res.data);
          const activeEmployee = res.data.filter(
            (item) => item.isActive === true || item.isActive === 1
          );
          setemployee(activeEmployee);
        }
      } catch (err) {
        console.error("Error fetching departments:", err);
      }
    };

    const fetchShift = async () => {
      try {
        const res = await api.get("/api/v1/admin/shift");
        if (res.data && Array.isArray(res.data)) {
          // console.log(res.data)
          const activeShift = res.data.filter(
            (item) => item.isActive === true || item.isActive === 1
          );
          setShift(activeShift);
        }
      } catch (err) {
        console.error("Error fetching Shift:", err);
      }
    };
    const fetchDesignations = async () => {
      try {
        const res = await api.get("/api/v1/admin/designation");
        if (res.data && Array.isArray(res.data)) {
          const activeDesignations = res.data.filter(
            (item) => item.isActive === true || item.isActive === 1
          );
          setDesignations(activeDesignations);
        }
      } catch (err) {
        console.error("Error fetching designations:", err);
      }
    };

    fetchDepartments();
    fetchDesignations();
    fetchShift();
    fetchEmployee();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Employee Added:", formData);
    navigate("/employee-list");
  };

  return (
    <Card>
      <Card.Header>
        <h4 className="mb-0">Add Employee</h4>
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
                  <option value="Mr">Mr</option>
                  <option value="Mrs">Mrs</option>
                  <option value="Dr">Dr</option>
                  <option value="Sir">Sir</option>
                  <option value="Mam">Mam</option>
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
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Mobile Number</Form.Label>
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
                  placeholder="Enter email"
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Row 3 */}
          <Row className="mt-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
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
                />
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
          </Row>

          {/* Row 4 */}
          <Row className="mt-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>State</Form.Label>
                <Form.Control
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>City</Form.Label>
                <Form.Control
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Pin Code</Form.Label>
                <Form.Control
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Row 5 */}
          <Row className="mt-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Marital Status</Form.Label>
                <Form.Select
                  name="maritalStatus"
                  value={formData.maritalStatus}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                </Form.Select>
              </Form.Group>
            </Col>
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
          </Row>

          {/* Row 6 */}
          <Row className="mt-3">
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
            <Col md={4}>
              <Form.Group>
                <Form.Label>Employment Type</Form.Label>
                <Form.Select
                  name="employmentType"
                  value={formData.employmentType}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option value="Full Time">Full Time</option>
                  <option value="Part Time">Part Time</option>
                  <option value="Contract">Contract</option>
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

          {/* Row 7 */}
          <Row className="mt-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Department</Form.Label>
                <Form.Select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Designation</Form.Label>
                <Form.Select
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  {designations.map((desig) => (
                    <option key={desig.id} value={desig.id}>
                      {desig.name}
                    </option>
                  ))}
                </Form.Select>
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
                  {shift.map((shifts) => (
                    <option key={shifts.id} value={shifts.id}>
                      {shifts.shift_name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          {/* Row 8 */}
          <Row className="mt-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Profile Picture</Form.Label>
                <Form.Control
                  type="file"
                  name="profilePic"
                  accept="image/*"
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Skill</Form.Label>
                <Form.Control
                  type="text"
                  name="skill"
                  value={formData.skill}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Submit + Cancel */}
          <div className="mt-4 text-end">
            <Button type="submit" variant="primary">
              Save
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

export default AddEmployee;
