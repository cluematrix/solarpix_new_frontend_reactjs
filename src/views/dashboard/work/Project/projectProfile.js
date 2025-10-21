import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Table,
  Badge,
  Container,
  Spinner,
} from "react-bootstrap";
import { useParams } from "react-router-dom";
import api from "../../../../api/axios"; // adjust this import path as per your project
import { IoMdCall } from "react-icons/io";

const ProjectProfile = () => {
  const { id } = useParams();

  const [viewProjectData, setViewProjectData] = useState({});
  const [client, setClient] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch project by ID
  const getProjectById = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/v1/admin/project/${id}`);
      setViewProjectData(res.data.data || {});
    } catch (error) {
      console.error("Fetch Project Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch client categories
  const getClient = async () => {
    try {
      const res = await api.get(`/api/v1/admin/clientCategory`);
      setClient(res.data || []);
    } catch (error) {
      console.error("Fetch Client Error:", error);
    }
  };

  useEffect(() => {
    if (id) {
      getProjectById();
      getClient();
    } else {
      console.warn("ID not found in route params!");
    }
  }, [id]);

  // Filtered client category
  const filteredClientCategory =
    client?.filter(
      (item) => item.id === Number(viewProjectData?.category?.id)
    ) || [];

  // Render dynamic fields table
  const renderDynamicFields = (fields) => {
    if (!fields || Object.keys(fields).length === 0) return <p>—</p>;

    return (
      <Table bordered hover responsive className="mt-2">
        <thead className="table-light">
          <tr>
            <th>Label</th>
            <th>Type</th>
            <th>Value / File</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(fields).map(([key, field]) => (
            <tr key={key}>
              <td>{field.label}</td>
              <td>{field.data_type}</td>
              <td>
                {field.data_type === "text" || field.data_type === "number" ? (
                  field.value || "-"
                ) : field.file_url ? (
                  <a
                    href={field.file_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary fw-semibold"
                  >
                    View File
                  </a>
                ) : (
                  "-"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  };

  // Render team/people lists
  const renderPeopleList = (list) => {
    if (!list || list.length === 0) return <p>—</p>;
    return (
      <div>
        {list.map((person) => (
          <Card key={person.id} className="mb-2 border-0 shadow-sm">
            <Card.Body className="p-2">
              <strong>{person.name}</strong>
              <br />
              <small>{person.email}</small>
              <br />
              <Badge bg="secondary" className="align-items-center">
                {person.contact && <IoMdCall />} {person.contact}
              </Badge>
            </Card.Body>
          </Card>
        ))}
      </div>
    );
  };

  // Show loading spinner
  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (!viewProjectData?.id) {
    return <p className="text-center mt-5">No project data found.</p>;
  }

  return (
    <Container fluid className="py-3">
      {/* ================= Project Overview ================= */}
      <Card className="mb-4 shadow-sm">
        <Card.Header className="fw-bold border pb-2">
          Project Overview
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <p>
                <strong>Project Name:</strong> {viewProjectData.project_name}
              </p>
              <p>
                <strong>Category:</strong>{" "}
                {viewProjectData.category?.category || "-"}
              </p>
              <p>
                <strong>Client:</strong> {viewProjectData.client?.name || "-"}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <Badge bg="info">{viewProjectData.status}</Badge>
              </p>
            </Col>
            <Col md={6}>
              <p>
                <strong>Estimate (₹):</strong> {viewProjectData.estimate}
              </p>
              <p>
                <strong>Start Date:</strong> {viewProjectData.start_date}
              </p>
              <p>
                <strong>End Date:</strong> {viewProjectData.end_date || "-"}
              </p>
              <p>
                <strong>Remarks:</strong>{" "}
                {viewProjectData.project_remarks || "-"}
              </p>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* ================= MSEB Details ================= */}
      <Card className="mb-4 shadow-sm">
        <Card.Header className="fw-bold border pb-2">MSEB Details</Card.Header>
        <Card.Body>
          {renderDynamicFields(viewProjectData.mseb_dynamic_fields)}
        </Card.Body>
      </Card>

      {/* ================= Net Metering Details ================= */}
      <Card className="mb-4 shadow-sm">
        <Card.Header className="fw-bold border pb-2">
          Net Metering Details
        </Card.Header>
        <Card.Body>
          {renderDynamicFields(viewProjectData.net_metering_dynamic_fields)}
        </Card.Body>
      </Card>

      {/* ================= NP Details ================= */}
      <Card className="mb-4 shadow-sm">
        <Card.Header className="fw-bold border pb-2">NP Details</Card.Header>
        <Card.Body>
          {renderDynamicFields(viewProjectData.np_dynamic_fields)}
        </Card.Body>
      </Card>

      {/* ================= Team Details ================= */}
      <Card className="mb-4 shadow-sm">
        <Card.Header className="fw-bold border pb-2">Team Details</Card.Header>
        <Card.Body>
          <Row>
            <Col md={4}>
              <h6>Coordinators</h6>
              {renderPeopleList(viewProjectData.co_ordinate_details)}
            </Col>
            <Col md={4}>
              <h6>Structure Installers</h6>
              {renderPeopleList(viewProjectData.structure_installer_details)}
            </Col>
            <Col md={4}>
              <h6>Panel Wiring Installers</h6>
              {renderPeopleList(viewProjectData.panel_wiring_installer_details)}
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* ================= SEPL Inspection ================= */}
      <Card className="mb-4 shadow-sm">
        <Card.Header className="fw-bold border pb-2">
          SEPL Inspection
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <p>
                <strong>Date:</strong>{" "}
                {viewProjectData.sepl_inspection_date || "-"}
              </p>
              <p>
                <strong>Remarks:</strong>{" "}
                {viewProjectData.sepl_inspection_remarks || "-"}
              </p>
            </Col>
            <Col md={6}>
              <h6>Inspected By</h6>
              {Array.isArray(viewProjectData.sepl_inspection_by) &&
              viewProjectData.sepl_inspection_by.length > 0 ? (
                renderPeopleList(
                  viewProjectData.sepl_inspection_by.map((id, i) => ({
                    id: i,
                    name: `Employee ID: ${id}`,
                    email: "-",
                    contact: "-",
                  }))
                )
              ) : (
                <p>—</p>
              )}
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ProjectProfile;
