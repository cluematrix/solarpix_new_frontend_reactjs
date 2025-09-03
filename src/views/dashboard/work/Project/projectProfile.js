import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import { useParams } from "react-router-dom";
import api from "../../../../api/axios";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { GrStorage } from "react-icons/gr";
import { FaClock } from "react-icons/fa";

const ProjectProfile = () => {
  const { id } = useParams(); // Get ID from URL
  const [project, setProject] = useState({});
  const [loading, setLoading] = useState(false);

  console.log("Component Mounted, ID:", id);

  const projectEmpById = async () => {
    console.log("projectEmpById called with ID:", id);
    try {
      // setLoading(true);
      const res = await api.get(`/api/v1/admin/project/${id}`);
      console.log("API Response:", res);
      setProject(res.data.data || []);
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("useEffect running...");
    if (id) {
      projectEmpById();
    } else {
      console.warn("ID is missing, cannot fetch");
    }
  }, [id]);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }
  console.log("Project Data:", project);
  const COLORS = ["#28a745", "#ffc107", "#dc3545"];

  const taskData = [
    { name: "Completed", value: 60 },
    { name: "In Progress", value: 20 },
    { name: "Pending", value: 20 },
  ];

  const hoursData = [
    { name: "Planned", value: 0 },
    { name: "Actual", value: 5 },
  ];

  const budgetData = [
    { name: "Planned", value: 0 },
    { name: "Actual", value: 0 },
  ];

  return (
    <Container fluid className="p-3">
      {/* Top Row */}
      <Row className="mb-3">
        <Col md={6}>
          <Card className="pt-3 pb-0 px-3">
            <h5>Project Progress</h5>
            <div className="text-center d-flex  p-3 justify-content-between align-items-center w-100">
              <h4 className="w-25" style={{ color: "#28a745" }}>
                97%
              </h4>

              <div className="d-flex w-75 justify-content-around mt-2">
                <div>
                  <p>Start Date:</p>
                  <p> {project.start_date || "--"}</p>
                </div>
                <div>
                  <p>End Date:</p>
                  <p> {project.end_date || "--"}</p>
                </div>
              </div>
            </div>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="p-3">
            <h5>Client</h5>
            <div className="d-flex align-items-center">
              <img
                src="https://via.placeholder.com/50"
                alt="Client"
                className="rounded-circle me-3"
              />
              <div>
                <h6>Myrtis O’Keefe</h6>
                <p className="mb-0">Barton PLC</p>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Middle Row */}
      <Row className="mb-3">
        <Col md={6}>
          <Card className="p-3">
            <h5>Tasks</h5>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={taskData} dataKey="value" outerRadius={70} label>
                  {taskData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col md={6}>
          <h5 className="mb-3">Statistics</h5>
          <Row>
            <Col xs={6} className="mb-1">
              <Card className="p-0">
                <Card.Body className="pt-3 pb-0">
                  <p className="text-black">Project Budget</p>
                  <div className="d-flex justify-content-between align-items-baseline">
                    <p className="text-primary">
                      ${project.project_budget || "--"}
                    </p>
                    <GrStorage />
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={6} className="mb-1">
              <Card className="p-0">
                <Card.Body className="pt-3 pb-0">
                  <p className="text-black">Hours Logged</p>
                  <div className="d-flex justify-content-between align-items-baseline">
                    <p className="text-primary">5 Hours</p>
                    <FaClock />
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={6} className="mb-1">
              <Card className="p-0">
                <Card.Body className="pt-3 pb-0">
                  <p className="text-black">Earnings</p>
                  <div className="d-flex justify-content-between align-items-baseline">
                    <p className="text-primary">$0.00</p>
                    <GrStorage />
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={6} className="mb-1">
              <Card>
                <Card.Body className="pt-3 pb-0">
                  <p className="text-black">E Expenses</p>
                  <div className="d-flex justify-content-between align-items-baseline">
                    <p className="text-primary">$0.00</p>
                    <GrStorage />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* Charts */}
      <Row className="mb-3">
        <Col md={6}>
          <Card className="p-3">
            <h5>Hours Logged</h5>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={hoursData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#dc3545" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="p-3">
            <h5>Project Budget</h5>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={budgetData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#28a745" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Project Details */}
      <Row>
        <Col>
          <Card className="p-3">
            <h5>Project Details</h5>
            <p>{project.project_summary || "No summary available."}</p>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProjectProfile;
