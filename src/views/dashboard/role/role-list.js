import React, { useState, useEffect } from "react";
import { Card, Row, Col, Button, Form, Spinner, Table } from "react-bootstrap";
import CreateTwoToneIcon from "@mui/icons-material/CreateTwoTone";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import AddEditModal from "./add-edit-modal";
import DeleteModal from "./delete-modal";
import api from "../../../api/axios";
import { useLocation } from "react-router";
import { toast } from "react-toastify"; // ✅ added toast

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

  const [loading, setLoading] = useState(true);

  // 🔑 PERMISSION CHECK
  const FETCHPERMISSION = async () => {
    try {
      const res = await api.get("/api/v1/admin/rolePermission");

      let data = [];
      if (Array.isArray(res.data)) {
        data = res.data;
      } else if (Array.isArray(res.data.data)) {
        data = res.data.data;
      }

      const roleId = String(sessionStorage.getItem("roleId"));
      const matchedPermission = data.find(
        (perm) =>
          String(perm.role_id) === roleId &&
          perm.route?.toLowerCase() === pathname?.toLowerCase()
      );

      if (matchedPermission) {
        setPermissions({
          view: matchedPermission.view === true || matchedPermission.view === 1,
          add: matchedPermission.add === true || matchedPermission.add === 1,
          edit: matchedPermission.edit === true || matchedPermission.edit === 1,
          del: matchedPermission.del === true || matchedPermission.del === 1,
        });
      } else {
        setPermissions(null);
      }
    } catch (err) {
      console.error("Error fetching roles:", err);
      setPermissions(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
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
        toast.error("Failed to fetch roles");
        setUserlist([]);
      });
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  // Toggle Active/Inactive
  const handleToggleActive = async (id, currentStatus) => {
    const newStatus = Number(currentStatus) === 1 ? false : true; // backend expects boolean
    try {
      await api.put(`/api/v1/admin/role/${id}`, { isActive: newStatus });
      toast.success("Status updated successfully");
      fetchRoles();
    } catch (err) {
      console.error("Update failed:", err);
      toast.error("Failed to update status");
    }
  };

  // Add or Update Role
  const handleAddOrUpdateRole = async () => {
    if (!roleName.trim()) {
      toast.error("Please enter a role name");
      return;
    }

    try {
      if (editId) {
        await api.put(`/api/v1/admin/role/${editId}`, { name: roleName });
        toast.success("Role updated successfully");
      } else {
        await api.post("/api/v1/admin/role", { name: roleName });
        toast.success("Role added successfully");
      }
      fetchRoles();
      resetForm();
    } catch (err) {
      console.error("Error saving role:", err);
      toast.error("Failed to save role");
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
  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/api/v1/admin/role/${deleteId}`);
      toast.success("Role deleted successfully");
      fetchRoles();
      setShowDelete(false);
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Failed to delete role");
    }
  };

  const resetForm = () => {
    setShowAddEdit(false);
    setRoleName("");
    setEditIndex(null);
    setEditId(null);
  };

  if (loading) {
    return (
      <div className="loader-div">
        <Spinner animation="border" className="spinner" />
      </div>
    );
  }
  if (!permissions?.view) {
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
      <Row className="mt-4">
        <Col sm="12">
          <Card>
            <Card.Header
              className="d-flex justify-content-between"
              style={{ padding: "15px 15px 0px 15px" }}
            >
              <h5 className="card-title fw-lighter">Roles</h5>
              {permissions.add && (
                <Button
                  className="btn-primary"
                  onClick={() => setShowAddEdit(true)}
                >
                  + New Role
                </Button>
              )}
            </Card.Header>

            <Card.Body className="px-0 pt-3">
              <div className="table-responsive">
                <Table hover responsive>
                  <thead>
                    <tr className="table-gray">
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
                            {" "}
                            <span
                              className={`status-dot ${
                                item.isActive ? "active" : "inactive"
                              }`}
                            ></span>
                            {Number(item.isActive) === 1
                              ? "Active"
                              : "Inactive"}
                          </td>
                          <td>
                            {item.id !== 1 && (
                              <div className="d-flex align-items-center gap-2">
                                {/* Toggle Switch */}
                                <Form.Check
                                  type="switch"
                                  id={`active-switch-${item.id}`}
                                  checked={item.isActive === 1}
                                  onChange={() =>
                                    handleToggleActive(item.id, item.isActive)
                                  }
                                />
                                {/* Edit */}
                                {permissions.edit && (
                                  <CreateTwoToneIcon
                                    onClick={() => handleEdit(idx)}
                                    color="primary"
                                    style={{ cursor: "pointer" }}
                                  />
                                )}
                                {/* Delete */}
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
                              </div>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
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
        buttonLabel={editId ? "Update" : "Save"}
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
