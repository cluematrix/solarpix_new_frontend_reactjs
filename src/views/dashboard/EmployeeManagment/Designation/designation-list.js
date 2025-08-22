import React, { useState, useEffect } from "react";
import { Card, Row, Col, Button, Form } from "react-bootstrap";
import CreateTwoToneIcon from "@mui/icons-material/CreateTwoTone";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import AddEditModal from "../Designation/add-edit-modal";
import DeleteModal from "../Designation/delete-modal";
import api from "../../../../api/axios";
import { useLocation } from "react-router";

const RoleList = () => {
  const [userlist, setUserlist] = useState([]);
  const [roleName, setRoleName] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editId, setEditId] = useState(null); // Store ID for editing

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

  // Fetch designations
  const fetchDesignations = () => {
    api
      .get("/api/v1/admin/designation")
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
        console.error("Error fetching data:", err);
        setUserlist([]);
      });
  };

  useEffect(() => {
    fetchDesignations();
  }, []);

  // Toggle Active/Inactive with optimistic update
  const handleToggleActive = (id, currentStatus) => {
    // Toggle value (0 → 1, 1 → 0)
    const newStatus = currentStatus === 1 ? 0 : 1;

    console.log("Sending update:", { isActive: newStatus });

    // Optimistic UI update
    setUserlist((prev) =>
      prev.map((dept) =>
        dept.id === id ? { ...dept, isActive: newStatus } : dept
      )
    );

    // API call
    api
      .put(`/api/v1/admin/designation/${id}`, { isActive: newStatus })
      .then((res) => {
        console.log("Update success:", res.data);
      })
      .catch((err) => {
        console.error("Update failed:", err);
        // Rollback if API fails
        setUserlist((prev) =>
          prev.map((dept) =>
            dept.id === id ? { ...dept, isActive: currentStatus } : dept
          )
        );
      });
  };

  // Add or Update Designation
  const handleAddOrUpdateRole = () => {
    if (!roleName.trim()) return;

    if (editId) {
      // Update
      api
        .put(`/api/v1/admin/designation/${editId}`, { name: roleName })
        .then(() => {
          fetchDesignations();
          resetForm();
        })
        .catch((err) => console.error("Error updating designation:", err));
    } else {
      // Add
      api
        .post("/api/v1/admin/designation", { name: roleName })
        .then(() => {
          fetchDesignations();
          resetForm();
        })
        .catch((err) => console.error("Error adding designation:", err));
    }
  };

  // Edit
  const handleEdit = (index) => {
    const designation = userlist[index];
    setRoleName(designation.name);
    setEditIndex(index);
    setEditId(designation.id || designation._id); // support both id and _id
    setShowAddEdit(true);
  };

  // Delete
  const handleDeleteConfirm = () => {
    if (!deleteId) return;
    api
      .delete(`/api/v1/admin/designation/${deleteId}`)
      .then(() => {
        fetchDesignations();
        setShowDelete(false);
      })
      .catch((err) => console.error("Error deleting designation:", err));
  };

  // Reset form
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
              <h4 className="card-title">Designation List</h4>
              {permissions.add && (
                <Button
                  className="btn-primary"
                  onClick={() => setShowAddEdit(true)}
                >
                  + New Designation
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
                        <td colSpan="3" className="text-center">
                          No Designation available
                        </td>
                      </tr>
                    ) : (
                      userlist.map((item, idx) => (
                        <tr key={item.id || item._id}>
                          <td>{idx + 1}</td>
                          <td>{item.name}</td>
                          <td>{item.isActive ? "Active" : "Inactive"}</td>

                          <td className="d-flex align-items-center">
                            <Form.Check
                              type="switch"
                              id={`active-switch-${item.id}`}
                              checked={item.isActive === 1}
                              onChange={() =>
                                handleToggleActive(item.id, item.isActive)
                              }
                              className="me-3"
                            />

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
        modalTitle={editId ? "Update Designation" : "Add Designation"}
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
        modalTitle="Delete Department"
        modalMessage={
          deleteIndex !== null && userlist[deleteIndex]
            ? `Are you sure you want to delete the department "${userlist[deleteIndex].name}"?`
            : ""
        }
      />
    </>
  );
};

export default RoleList;
