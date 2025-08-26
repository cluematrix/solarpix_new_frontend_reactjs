import React, { useState, useEffect } from "react";
import { Card, Row, Col, Button, Form } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CreateTwoToneIcon from "@mui/icons-material/CreateTwoTone";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import AddEditModal from "./add-edit-modal";
import DeleteModal from "./delete-modal";
import api from "../../../../api/axios";
import { useLocation } from "react-router";

const ContractType = () => {
  const [typeList, setTypeList] = useState([]);
  const [type, setType] = useState("");
  const [editId, setEditId] = useState(null);

  const [showAddEdit, setShowAddEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const { pathname } = useLocation();
  const [permissions, setPermissions] = useState(null);

  // 🔑 Fetch Role Permissions
  const FETCHPERMISSION = async () => {
    try {
      const res = await api.get("/api/v1/admin/rolePermission");
      const data = Array.isArray(res.data) ? res.data : res.data.data || [];
      const matchedPermission = data.find((perm) => perm.route === pathname);
      setPermissions(matchedPermission || {});
    } catch (err) {
      console.error("Error fetching roles:", err);
      setPermissions({});
      toast.error("Failed to fetch permissions");
    }
  };

  useEffect(() => {
    FETCHPERMISSION();
  }, [pathname]);

  // 🔄 Fetch Contract Types
  const fetchContractTypes = () => {
    api
      .get("/api/v1/admin/contractType")
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data.data || [];
        setTypeList(data);
      })
      .catch((err) => {
        console.error("Error fetching contract types:", err);
        setTypeList([]);
        toast.error("Failed to fetch contract types");
      });
  };

  useEffect(() => {
    fetchContractTypes();
  }, []);

  // ✅ Toggle Active/Inactive
  const handleToggleActive = (id, currentStatus) => {
    const newStatus = currentStatus ? 0 : 1;

    // Optimistic UI update
    setTypeList((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isActive: newStatus } : t))
    );

    api
      .put(`/api/v1/admin/contractType/${id}`, { isActive: newStatus })
      .then(() => {
        toast.success("Status updated successfully");
      })
      .catch((err) => {
        console.error("Update failed:", err);
        toast.error(err.response?.data?.message || "Failed to update status");
        // Rollback
        setTypeList((prev) =>
          prev.map((t) => (t.id === id ? { ...t, isActive: currentStatus } : t))
        );
      });
  };

  // ✅ Add or Update
  const handleAddOrUpdate = () => {
    if (!type.trim()) {
      toast.warning("Contract type is required");
      return;
    }

    if (editId) {
      api
        .put(`/api/v1/admin/contractType/${editId}`, { type })
        .then(() => {
          toast.success("Contract type updated successfully");
          fetchContractTypes();
          resetForm();
        })
        .catch((err) => {
          console.error("Error updating contract type:", err);
          toast.error(
            err.response?.data?.message || "Failed to update contract type"
          );
        });
    } else {
      api
        .post("/api/v1/admin/contractType", { type })
        .then(() => {
          toast.success("Contract type added successfully");
          fetchContractTypes();
          resetForm();
        })
        .catch((err) => {
          console.error("Error adding contract type:", err);
          toast.error(
            err.response?.data?.message || "Failed to add contract type"
          );
        });
    }
  };

  const handleEdit = (index) => {
    const t = typeList[index];
    setType(t.type);
    setEditId(t.id);
    setShowAddEdit(true);
  };

  // ✅ Delete
  const handleDeleteConfirm = () => {
    if (!deleteId) return;
    api
      .delete(`/api/v1/admin/contractType/${deleteId}`)
      .then(() => {
        toast.success("Contract type deleted successfully");
        fetchContractTypes();
        setShowDelete(false);
      })
      .catch((err) => {
        console.error("Error deleting contract type:", err);
        toast.error(
          err.response?.data?.message || "Failed to delete contract type"
        );
      });
  };

  const resetForm = () => {
    setShowAddEdit(false);
    setType("");
    setEditId(null);
  };

  // 🚫 Permission Handling
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
              <h4 className="card-title">Contract Type List</h4>
              {permissions.add && (
                <Button
                  className="btn-primary"
                  onClick={() => setShowAddEdit(true)}
                >
                  + Add Contract Type
                </Button>
              )}
            </Card.Header>

            <Card.Body className="px-0">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Sr. No.</th>
                      <th>Type</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {typeList.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center">
                          No Contract Types available
                        </td>
                      </tr>
                    ) : (
                      typeList.map((item, idx) => (
                        <tr key={item.id}>
                          <td>{idx + 1}</td>
                          <td>{item.type}</td>
                          <td>{item.isActive ? "Active" : "Inactive"}</td>
                          <td className="d-flex align-items-center">
                            <Form.Check
                              type="switch"
                              id={`active-switch-${item.id}`}
                              checked={
                                item.isActive === 1 || item.isActive === true
                              }
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
                                  setDeleteId(item.id);
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
        value={type}
        setValue={setType}
        onSave={handleAddOrUpdate}
        modalTitle={editId ? "Update Contract Type" : "Add New Contract Type"}
        buttonLabel={editId ? "Update" : "Submit"}
        fieldLabel="Contract Type"
        placeholder="Enter contract type"
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
        modalTitle="Delete Contract Type"
        modalMessage={
          deleteIndex !== null && typeList[deleteIndex]
            ? `Are you sure you want to delete "${typeList[deleteIndex].type}"?`
            : ""
        }
      />

      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default ContractType;
