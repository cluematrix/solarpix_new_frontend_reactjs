import React, { useState, useEffect } from "react";
import { Card, Row, Col, Button, Form } from "react-bootstrap";
import CreateTwoToneIcon from "@mui/icons-material/CreateTwoTone";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import AddEditModal from "./add-edit-modal";
import DeleteModal from "./delete-modal";
import api from "../../../api/axios";
import { useLocation } from "react-router";

const RoleList = () => {
  const [userlist, setUserlist] = useState([]);
  const [roleName, setRoleName] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editId, setEditId] = useState(null);

  const [showAddEdit, setShowAddEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const [deleteIndex, setDeleteIndex] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const { pathname } = useLocation();
  const [permissions, setPermissions] = useState(null);

  // 🔑 PERMISSION CHECK
  const FETCHPERMISSION = async () => {
    try {
      const res = await api.get("/api/v1/admin/rolePermission");

      let data = [];
      if (Array.isArray(res.data)) {
        console.log(res.data);
        data = res.data;
      } else if (Array.isArray(res.data.data)) {
        data = res.data.data;
      }

      // Match current route
      const matchedPermission = data.find((perm) => perm.route === pathname);
      console.log("Matched Permission:", matchedPermission);
      setPermissions(matchedPermission || null);
    } catch (err) {
      console.error("Error fetching roles:", err);
      setPermissions(null);
    }
  };

  useEffect(() => {
    FETCHPERMISSION();
  }, [pathname]);

  // Fetch roles
  const fetchRoles = () => {
    api
      .get("/api/v1/admin/role")
      .then((res) => {
        if (Array.isArray(res.data)) {
          setUserlist(res.data);
        } else if (Array.isArray(res.data.data)) {
          setUserlist(res.data.data);
        } else {
          setUserlist([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching roles:", err);
        setUserlist([]);
      });
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  // Toggle Active/Inactive
  const handleToggleActive = (id, currentStatus) => {
    const newStatus = currentStatus === 1 ? 0 : 1;
    setUserlist((prev) =>
      prev.map((dept) =>
        dept.id === id ? { ...dept, isActive: newStatus } : dept
      )
    );
    api.put(`/api/v1/admin/role/${id}`, { isActive: newStatus }).catch(() => {
      // rollback if fails
      setUserlist((prev) =>
        prev.map((dept) =>
          dept.id === id ? { ...dept, isActive: currentStatus } : dept
        )
      );
    });
  };

  // Add or Update Role
  const handleAddOrUpdateRole = () => {
    if (!roleName.trim()) return;

    if (editId) {
      api.put(`/api/v1/admin/role/${editId}`, { name: roleName }).then(() => {
        fetchRoles();
        resetForm();
      });
    } else {
      api.post("/api/v1/admin/role", { name: roleName }).then(() => {
        fetchRoles();
        resetForm();
      });
    }
  };

  // Edit
  const handleEdit = (index) => {
    const role = userlist[index];
    setRoleName(role.name);
    setEditIndex(index);
    setEditId(role.id || role._id);
    setShowAddEdit(true);
  };

  // Delete
  const handleDeleteConfirm = () => {
    if (!deleteId) return;
    api.delete(`/api/v1/admin/role/${deleteId}`).then(() => {
      fetchRoles();
      setShowDelete(false);
    });
  };

  const resetForm = () => {
    setShowAddEdit(false);
    setRoleName("");
    setEditIndex(null);
    setEditId(null);
  };

  // 🚫 Block page if no permission
  if (!permissions) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "70vh" }}
      >
        <h4>Loading permissions...</h4>
      </div>
    );
  }

  if (!permissions.view) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "70vh" }}
      >
        <h4>You don’t have permission to view this page.</h4>
      </div>
    );
  }

  return (
    <>
      <Row>
        <Col sm="12">
          <Card>
            <Card.Header className="d-flex justify-content-between">
              <h4 className="card-title">Role List</h4>
              {permissions.add && (
                <Button
                  className="btn-primary"
                  onClick={() => setShowAddEdit(true)}
                >
                  + New Role
                </Button>
              )}
            </Card.Header>

            <Card.Body className="px-0">
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr className="ligth">
                      <th>Sr. No.</th>
                      <th>Name</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userlist.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center">
                          No Role available
                        </td>
                      </tr>
                    ) : (
                      userlist.map((item, idx) => (
                        <tr key={item.id || item._id}>
                          <td>{idx + 1}</td>
                          <td>{item.name}</td>
                          <td>
                            {item.id === 1 ? (
                              <span className="badge bg-success">Active</span> // 🚫 no toggle for Admin
                            ) : (
                              <Form.Check
                                type="switch"
                                id={`active-switch-${item.id}`}
                                checked={item.isActive === 1}
                                onChange={() =>
                                  handleToggleActive(item.id, item.isActive)
                                }
                                label={item.isActive ? "Active" : "Inactive"}
                              />
                            )}
                          </td>
                          <td>
                            {item.id !== 1 && (
                              <>
                                {permissions.edit && (
                                  <CreateTwoToneIcon
                                    className="me-2"
                                    onClick={() => handleEdit(idx)}
                                    color="primary"
                                    style={{ cursor: "pointer" }}
                                  />
                                )}
                                {permissions.del && (
                                  <DeleteRoundedIcon
                                    onClick={() => {
                                      setDeleteIndex(idx);
                                      setDeleteId(item.id || item._id);
                                      setShowDelete(true);
                                    }}
                                    color="error"
                                    style={{ cursor: "pointer" }}
                                  />
                                )}
                              </>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Add/Edit Modal */}
      <AddEditModal
        show={showAddEdit}
        handleClose={resetForm}
        roleName={roleName}
        setRoleName={setRoleName}
        onSave={handleAddOrUpdateRole}
        modalTitle={editId ? "Update Role" : "Add Role"}
        buttonLabel={editId ? "Update" : "Submit"}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        show={showDelete}
        handleClose={() => {
          setShowDelete(false);
          setDeleteIndex(null);
          setDeleteId(null);
        }}
        onConfirm={handleDeleteConfirm}
        modalTitle="Delete Role"
        modalMessage={
          deleteIndex !== null && userlist[deleteIndex]
            ? `Are you sure you want to delete the role "${userlist[deleteIndex].name}"?`
            : ""
        }
      />
    </>
  );
};

export default RoleList;
