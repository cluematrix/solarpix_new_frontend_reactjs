import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Image,
  Badge,
  Spinner,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../../api/axios";
import avatarImg from "../../../../assets/images/avatars/avatar-pic.jpg";

const EmployeeProfile = ({ empProfileId }) => {
  console.log("outer empProfileId", empProfileId);
  const { id } = useParams(); // Get ID from URL
  const [emp, setEmp] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  console.log("Component Mounted, ID:", id);

  useEffect(() => {
    // if empProfileId is available and its different from current Id then navigate
    if (empProfileId && empProfileId !== id) {
      navigate(`/view-employee/${empProfileId}`, { replace: true });
    }
  }, [empProfileId, id, navigate]);

  const fetchEmpById = async () => {
    console.log("fetchEmpById called with ID:", id);
    try {
      setLoading(true);
      const apiId = empProfileId ? empProfileId : id;
      console.log("apiId", apiId);
      const res = await api.get(`/api/v1/admin/employee/${apiId}`);
      console.log("API Response:", res);
      setEmp(res.data.data || []);
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("useEffect running...");
    if (id || empProfileId) {
      fetchEmpById();
    } else {
      console.warn("ID is missing, cannot fetch");
    }
  }, [empProfileId, id]);

  if (loading) {
    return (
      <div className="loader-div">
        <Spinner animation="border" className="spinner" />
      </div>
    );
  }
  console.log("Employee Data:", emp);

  return (
    <Container fluid className="p-0">
      <Row className="mt-4">
        {/* Left Section */}
        <Col md={8}>
          {/* Profile Card */}
          <Card className="mb-4">
            <Card.Body className="d-flex align-items-center flex-wrap">
              <Image
                src={emp?.photo || avatarImg}
                roundedCircle
                width={80}
                height={80}
                className="me-3"
              />
              <div>
                <div className="mb-3">
                  <h5>{emp?.name || "--"}</h5>
                  <p className="mb-1 small">
                    {emp?.designation?.name || "--"} •{" "}
                    {emp?.department?.name || "--"} | User Role:{" "}
                    {emp?.role?.name || "--"}
                  </p>
                  <small className="text-muted">
                    Last login: {emp?.lastLogin || "--"}
                  </small>
                </div>
                <div className="d-flex gap-4 text-center">
                  <div>
                    <h6>{emp?.openTasks || "--"}</h6>
                    <small>Open Tasks</small>
                  </div>
                  <div>
                    <h6>{emp?.projects || "--"}</h6>
                    <small>Projects</small>
                  </div>
                  <div>
                    <h6>{emp?.hoursLogged || "--"}</h6>
                    <small>Hours Logged</small>
                  </div>
                  <div>
                    <h6>{emp?.tickets || "--"}</h6>
                    <small>Tickets</small>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* About Section */}
          <Card className="mb-4">
            <Card.Body>
              <h5>About</h5>
              <p>{emp?.about || "No description available"}</p>
            </Card.Body>
          </Card>

          {/* Profile Info Section */}
          <Card>
            <Card.Body>
              <h5>Profile Info</h5>
              <Table borderless className="mt-3">
                <tbody>
                  <tr>
                    <td>Employee ID</td>
                    <td>{emp?.emp_id || "--"}</td>
                  </tr>
                  <tr>
                    <td>Full Name</td>
                    <td>
                      {emp?.salutation}. {emp?.name || "--"}
                    </td>
                  </tr>
                  <tr>
                    <td>Email</td>
                    <td>{emp?.email || "--"}</td>
                  </tr>
                  <tr>
                    <td>Mobile</td>
                    <td>{emp?.contact || "--"}</td>
                  </tr>
                  <tr>
                    <td>Designation</td>
                    <td>{emp?.designation?.name || "--"}</td>
                  </tr>
                  <tr>
                    <td>Department</td>
                    <td>{emp?.department?.name || "--"}</td>
                  </tr>
                  <tr>
                    <td>Gender</td>
                    <td>{emp?.gender || "--"}</td>
                  </tr>
                  {/* <tr>
                    <td>Work Anniversary</td>
                    <td>{emp?.workAnniversary || "--"}</td>
                  </tr> */}
                  <tr>
                    <td>Date of Birth</td>
                    <td>{emp?.dob?.split("T")[0] || "--"}</td>
                  </tr>
                  <tr>
                    <td>Address</td>
                    <td>
                      {emp?.address}, {emp?.city}, {emp?.state}
                    </td>
                  </tr>
                  <tr>
                    <td>Skills</td>
                    <td>{emp?.skill || "--"}</td>
                  </tr>
                  <tr>
                    <td>Language</td>
                    <td>{emp?.language || "English"}</td>
                  </tr>
                  <tr>
                    <td>Probation End Date</td>
                    <td>{emp?.probation_end_date?.split("T")[0] || "--"}</td>
                  </tr>
                  <tr>
                    <td>Notice Period Start Date</td>
                    <td>{emp?.notice_start_date?.split("T")[0] || "--"}</td>
                  </tr>
                  <tr>
                    <td>Notice Period End Date</td>
                    <td>{emp?.notice_end_date?.split("T")[0] || "--"}</td>
                  </tr>
                  <tr>
                    <td>Marital Status</td>
                    <td>{emp?.maritial_status || "--"}</td>
                  </tr>
                  <tr>
                    <td>Employment Type</td>
                    <td>{emp?.employmentType?.emp_type || "--"}</td>
                  </tr>
                  <tr>
                    <td>Joining Date</td>
                    <td>{emp?.joining_date?.split("T")[0] || "--"}</td>
                  </tr>
                  <tr>
                    <td>Exit Date</td>
                    <td>{emp?.notice_end_date?.split("T")[0] || "--"}</td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        {/* Right Section */}
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <h6>Appreciation</h6>
              <div className="text-center">
                <Badge bg="secondary" pill>
                  0
                </Badge>
              </div>
            </Card.Body>
          </Card>

          <Card className="mb-4">
            <Card.Body>
              <p>
                <strong>Reporting To:</strong> {emp?.manager?.name || "--"}
              </p>
              <p>
                <strong>Reporting Team:</strong> --
              </p>
            </Card.Body>
          </Card>

          <Row className="mb-4">
            <Col>
              <Card>
                <Card.Body className="text-center">
                  <p>Late Attendance</p>
                  <h5>0</h5>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card>
                <Card.Body className="text-center">
                  <p>Leaves Taken</p>
                  <h5>0</h5>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Tasks Pie Chart (Placeholder for now) */}
          <Card className="mb-4">
            <Card.Body>
              <h6>Tasks</h6>
              <div
                style={{
                  width: "100%",
                  height: "200px",
                  background: "#f4f4f4",
                }}
                className="d-flex justify-content-center align-items-center"
              >
                <p>Pie Chart Here</p>
              </div>
            </Card.Body>
          </Card>

          <Card>
            <Card.Body className="text-center">
              <p>Tickets</p>
              <p>- Not enough data -</p>
            </Card.Body>
          </Card>

          <Card>
            <Card.Body className="">
              <h6>Bank Details</h6>
              <Table borderless className="mt-3">
                <tbody>
                  <tr>
                    <td className="ps-0">Bank Name</td>
                    <td className="ps-0">{emp?.bank_name || "--"}</td>
                  </tr>
                  <tr>
                    <td className="ps-0">Account No</td>
                    <td className="ps-0">{emp?.account_no || "--"}</td>
                  </tr>
                  <tr>
                    <td className="ps-0">IFSC Code</td>
                    <td className="ps-0">{emp?.ifsc_code || "--"}</td>
                  </tr>
                  <tr>
                    <td className="ps-0">Branch Name</td>
                    <td className="ps-0">{emp?.branch_name || "--"}</td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default EmployeeProfile;
