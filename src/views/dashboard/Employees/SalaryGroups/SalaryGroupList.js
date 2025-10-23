import React, { useState, useEffect } from "react";
import { Card, Row, Col, Button, Spinner, Table, Modal } from "react-bootstrap";
import CreateTwoToneIcon from "@mui/icons-material/CreateTwoTone";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import VisibilityIcon from "@mui/icons-material/Visibility";
import api from "../../../../api/axios";
import { successToast } from "../../../../components/Toast/successToast";
import { errorToast } from "../../../../components/Toast/errorToast";
import { useLocation } from "react-router-dom";
import AddEditSalaryGroup from "./AddEditSalaryGroup";

const SalaryGroupList = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [permissions, setPermissions] = useState(null);
  const [permLoading, setPermLoading] = useState(true);
  const [showAddEdit, setShowAddEdit] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentGroup, setCurrentGroup] = useState(null);
  const { pathname } = useLocation();

  // Fetch permissions
  // Fetch permissions by display_name instead of route
  const FETCHPERMISSION = async () => {
    setPermLoading(true);
    try {
      const res = await api.get("/api/v1/admin/rolePermission");
      const data = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data.data)
        ? res.data.data
        : [];

      const roleId = String(sessionStorage.getItem("roleId"));
      if (roleId === "1") {
        setPermissions({
          view: true,
          add: true,
          edit: true,
          del: true,
          any_one: true,
        });
        return;
      }

      const displayName = "Salary Group"; // Set dynamically if needed
      const matched = data.find(
        (perm) =>
          String(perm.role_id) === roleId &&
          perm.display_name?.toLowerCase() === displayName.toLowerCase()
      );

      if (matched) {
        setPermissions({
          view: matched.view === true || matched.view === 1,
          add: matched.add === true || matched.add === 1,
          edit: matched.edit === true || matched.edit === 1,
          del: matched.del === true || matched.del === 1,
          any_one: matched.any_one === true || matched.any_one === 1,
        });
      } else {
        setPermissions(null);
      }
    } catch (err) {
      console.error("Error fetching permissions:", err);
      setPermissions(null);
    } finally {
      setPermLoading(false);
    }
  };

  // Fetch Salary Groups
  const fetchSalaryGroups = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/v1/admin/salaryGroup");
      const list = Array.isArray(res.data.data) ? res.data.data : [];
      setGroups(list);
    } catch (err) {
      console.error("Error fetching salary groups:", err);
      errorToast("Failed to fetch salary groups");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    FETCHPERMISSION();
  }, [pathname]);

  useEffect(() => {
    if (!permLoading && permissions?.view) {
      fetchSalaryGroups();
    }
  }, [permLoading, permissions]);

  // Save after add/edit
  const handleSave = (data) => {
    if (editIndex !== null) {
      const updated = [...groups];
      updated[editIndex] = data;
      setGroups(updated);
    } else {
      setGroups([...groups, data]);
    }
    setEditIndex(null);
  };

  // Edit
  const handleEdit = (index) => {
    setEditIndex(index);
    setShowAddEdit(true);
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this Salary Group?"))
      return;
    try {
      await api.delete(`/api/v1/admin/salaryGroup/${id}`);
      successToast("Salary group deleted successfully");
      setGroups(groups.filter((g) => g.id !== id));
    } catch (err) {
      console.error(err);
      errorToast("Failed to delete salary group");
    }
  };

  // View
  const handleView = (index) => {
    setCurrentGroup(groups[index]);
    setShowViewModal(true);
  };

  if (permLoading)
    return (
      <div className="loader-div">
        <Spinner animation="border" className="spinner" />
      </div>
    );
  if (!permissions?.view)
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "70vh" }}
      >
        <h4>You don’t have permission to view this page.</h4>
      </div>
    );

  return (
    <>
      <Row className="mt-4">
        <Col sm="12">
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="card-title fw-lighter">Salary Group Master</h5>
              {permissions.add && (
                <Button onClick={() => setShowAddEdit(true)}>+ New</Button>
              )}
            </Card.Header>
            <Card.Body>
              {loading ? (
                <div className="text-center">
                  <Spinner animation="border" />
                </div>
              ) : (
                <Table hover responsive>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Group Name</th>
                      <th>Components</th>
                      <th className="text-center">Employees</th>
                      {(permissions.edit || permissions.del) && <th>Action</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {groups.length === 0 ? (
                      <tr>
                        <td
                          colSpan={permissions.edit || permissions.del ? 5 : 4}
                          className="text-center"
                        >
                          No salary groups available
                        </td>
                      </tr>
                    ) : (
                      groups.map((group, idx) => (
                        <tr key={group.id}>
                          <td>{idx + 1}</td>
                          <td>{group.name}</td>
                          <td>
                            {group.components?.length > 0 ? (
                              <ul style={{ paddingLeft: "20px", margin: 0 }}>
                                {group.components.map((c, index) => (
                                  <li key={index}>{c.salary_components}</li>
                                ))}
                              </ul>
                            ) : (
                              "No components"
                            )}
                          </td>
                          <td className="text-center">
                            {group.employees?.length || 0}
                          </td>
                          {(permissions.edit || permissions.del) && (
                            <td>
                              <VisibilityIcon
                                style={{
                                  cursor: "pointer",
                                  marginRight: "10px",
                                }}
                                color="action"
                                onClick={() => handleView(idx)}
                              />
                              {permissions.edit && (
                                <CreateTwoToneIcon
                                  className="me-2"
                                  style={{ cursor: "pointer" }}
                                  color="primary"
                                  onClick={() => handleEdit(idx)}
                                />
                              )}
                              {permissions.del && (
                                <DeleteRoundedIcon
                                  style={{ cursor: "pointer" }}
                                  color="error"
                                  onClick={() => handleDelete(group.id)}
                                />
                              )}
                            </td>
                          )}
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Add/Edit Modal */}
      <AddEditSalaryGroup
        show={showAddEdit}
        handleClose={() => {
          setShowAddEdit(false);
          setEditIndex(null);
        }}
        onSave={handleSave}
        editData={editIndex !== null ? groups[editIndex] : null}
      />

      {/* View Modal */}
      <Modal
        show={showViewModal}
        onHide={() => setShowViewModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {currentGroup?.name || "Salary Group"} - Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentGroup ? (
            <Row>
              <Col md={6}>
                <h6>Components</h6>
                {currentGroup.components?.length === 0 ? (
                  <p>No components assigned.</p>
                ) : (
                  <ul>
                    {currentGroup.components.map((comp) => (
                      <li key={comp.id}>
                        <strong>{comp.salary_components}</strong>
                      </li>
                    ))}
                  </ul>
                )}
              </Col>
              <Col md={6}>
                <h6>Employees</h6>
                {currentGroup.employees?.length === 0 ? (
                  <p>No employees assigned.</p>
                ) : (
                  <ul>
                    {currentGroup.employees.map((emp) => (
                      <li key={emp.id}>
                        {emp.name} ({emp.emp_id || "N/A"})
                      </li>
                    ))}
                  </ul>
                )}
              </Col>
            </Row>
          ) : (
            <div className="text-center p-3">
              <Spinner animation="border" />
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default SalaryGroupList;
