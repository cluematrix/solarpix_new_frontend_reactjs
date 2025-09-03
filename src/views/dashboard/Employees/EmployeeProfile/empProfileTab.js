import React, { useState } from "react";
import EmployeeProfile from "../AddEmployee/employeeProfile";
import { Card, Container, Nav } from "react-bootstrap";
import ProjectProfile from "../../work/Project/projectProfile";

const EmpProfileTab = () => {
  // Track active tab
  const [activeTab, setActiveTab] = useState("profile");

  // Tab content render function
  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return <EmployeeProfile />;
      case "projects":
        return <ProjectProfile />;
      case "tasks":
        return (
          <Card>
            <Card.Body>
              <h5>Tasks</h5>
              <p>Tasks screen content here...</p>
            </Card.Body>
          </Card>
        );
      case "attendance":
        return (
          <Card>
            <Card.Body>
              <h5>Attendance</h5>
              <p>Attendance screen content here...</p>
            </Card.Body>
          </Card>
        );
      case "leaves":
        return (
          <Card>
            <Card.Body>
              <h5>Leaves</h5>
              <p>Leaves screen content here...</p>
            </Card.Body>
          </Card>
        );
      case "leavesQuota":
        return (
          <Card>
            <Card.Body>
              <h5>Leaves Quota</h5>
              <p>Leaves Quota screen content here...</p>
            </Card.Body>
          </Card>
        );
      case "timesheet":
        return (
          <Card>
            <Card.Body>
              <h5>Timesheet</h5>

              <p>Timesheet screen content here...</p>
            </Card.Body>
          </Card>
        );
      case "documents":
        return (
          <Card>
            <Card.Body>
              <h5>Documents</h5>
              <p>Documents screen content here...</p>
            </Card.Body>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <Container fluid className="p-0 mt-3 z-3">
      {/* Top Navigation Tabs */}
      <Nav
        variant="tabs"
        className="mb-4"
        onSelect={(key) => setActiveTab(key)}
      >
        <Nav.Item>
          <Nav.Link
            active={activeTab === "profile"}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            active={activeTab === "projects"}
            onClick={() => setActiveTab("projects")}
          >
            Projects
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            active={activeTab === "tasks"}
            onClick={() => setActiveTab("tasks")}
          >
            Tasks
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            active={activeTab === "attendance"}
            onClick={() => setActiveTab("attendance")}
          >
            Attendance
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            active={activeTab === "leaves"}
            onClick={() => setActiveTab("leaves")}
          >
            Leaves
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            active={activeTab === "leavesQuota"}
            onClick={() => setActiveTab("leavesQuota")}
          >
            Leaves Quota
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            active={activeTab === "timesheet"}
            onClick={() => setActiveTab("timesheet")}
          >
            Timesheet
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            active={activeTab === "documents"}
            onClick={() => setActiveTab("documents")}
          >
            Documents
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link>More</Nav.Link>
        </Nav.Item>
      </Nav>

      {/* Tab Content */}
      {renderTabContent()}
    </Container>
  );
};

export default EmpProfileTab;
