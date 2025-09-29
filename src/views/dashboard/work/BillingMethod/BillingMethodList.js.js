import React, { useState, useEffect } from "react";
import { Card, Row, Col, Button, Form, Spinner, Table } from "react-bootstrap";
import { Slide, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CreateTwoToneIcon from "@mui/icons-material/CreateTwoTone";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import AddEditModal from "./add-edit-modal";
import DeleteModal from "../BillingMethod/delete-modal";
import api from "../../../../api/axios";
import { useLocation } from "react-router";

const BillingMethodList = () => {
  const [billingMethods, setBillingMethods] = useState([]);
  const [methodName, setMethodName] = useState("");
  const [editId, setEditId] = useState(null);

  const [showAddEdit, setShowAddEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const { pathname } = useLocation();
  const [permissions, setPermissions] = useState(null);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentData = billingMethods.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(billingMethods.length / rowsPerPage);

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
          perm.display_name === "Billing Method List" // 👈 match with DB
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

  // Fetch Billing Methods
  const fetchBillingMethods = () => {
    api
      .get("/api/v1/admin/billingMethod/")
      .then((res) => {
        if (Array.isArray(res.data)) {
          setBillingMethods(res.data);
        } else if (Array.isArray(res.data.data)) {
          setBillingMethods(res.data.data);
        } else {
          setBillingMethods([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching billing methods:", err);
        setBillingMethods([]);
      });
  };

  useEffect(() => {
    fetchBillingMethods();
  }, []);

  // Toggle Active/Inactive
  const handleToggleActive = (id, currentStatus) => {
    const newStatus = currentStatus === 1 ? 0 : 1;

    // Optimistic update
    setBillingMethods((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isActive: newStatus } : m))
    );

    api
      .put(`/api/v1/admin/billingMethod/${id}`, { isActive: newStatus })
      .then(() => {
        toast.success("Status updated successfully");
      })
      .catch((err) => {
        console.error("Update failed:", err);
        toast.error(err.response?.data?.message || "Failed to update status");
        // Rollback
        setBillingMethods((prev) =>
          prev.map((m) => (m.id === id ? { ...m, isActive: currentStatus } : m))
        );
      });
  };

  // Add / Update Billing Method
  const handleAddOrUpdate = () => {
    if (!methodName.trim()) {
      toast.warning("Billing Method name is required");
      return;
    }

    if (editId) {
      api
        .put(`/api/v1/admin/billingMethod/${editId}`, {
          billing_method: methodName,
        })
        .then(() => {
          toast.success("Billing Method updated successfully");
          fetchBillingMethods();
          resetForm();
        })
        .catch((err) => {
          console.error("Error updating billing method:", err);
          toast.error(
            err.response?.data?.message || "Failed to update billing method"
          );
        });
    } else {
      api
        .post("/api/v1/admin/billingMethod/", { billing_method: methodName })
        .then(() => {
          toast.success("Billing Method added successfully");
          fetchBillingMethods();
          resetForm();
        })
        .catch((err) => {
          console.error("Error adding billing method:", err);
          toast.error(
            err.response?.data?.message || "Failed to add billing method"
          );
        });
    }
  };

  const handleEdit = (index) => {
    const method = billingMethods[index];
    setMethodName(method.billing_method);
    setEditId(method.id);
    setShowAddEdit(true);
  };

  const handleDeleteConfirm = () => {
    if (!deleteId) return;
    api
      .delete(`/api/v1/admin/billingMethod/${deleteId}`)
      .then(() => {
        toast.success("Billing Method deleted successfully");
        fetchBillingMethods();
        setShowDelete(false);
      })
      .catch((err) => {
        console.error("Error deleting billing method:", err);
        toast.error(
          err.response?.data?.message || "Failed to delete billing method"
        );
      });
  };

  const resetForm = () => {
    setShowAddEdit(false);
    setMethodName("");
    setEditId(null);
  };

  // Loader
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
            <Card.Header className="d-flex justify-content-between">
              <h5 className="card-title fw-lighter">Billing Methods</h5>
              {permissions.add && (
                <Button
                  className="btn-primary"
                  onClick={() => setShowAddEdit(true)}
                >
                  + New
                </Button>
              )}
            </Card.Header>

            <Card.Body className="px-0 pt-3">
              <div className="table-responsive">
                <Table hover responsive className="table">
                  <thead>
                    <tr className="table-gray">
                      <th>Sr. No.</th>
                      <th>Billing Method</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {billingMethods.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center">
                          No Billing Method available
                        </td>
                      </tr>
                    ) : (
                      currentData.map((item, idx) => (
                        <tr key={item.id}>
                          <td>{idx + 1}</td>
                          <td>{item.billing_method}</td>
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
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-end mt-3 me-3">
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                  >
                    Previous
                  </Button>
                  {[...Array(totalPages)].map((_, i) => (
                    <Button
                      key={i}
                      variant={currentPage === i + 1 ? "primary" : "light"}
                      size="sm"
                      className="mx-1"
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </Button>
                  ))}
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Add/Edit Modal */}
      <AddEditModal
        show={showAddEdit}
        handleClose={resetForm}
        methodName={methodName}
        setMethodName={setMethodName}
        onSave={handleAddOrUpdate}
        modalTitle={editId ? "Update Billing Method" : "Add New Billing Method"}
        buttonLabel={editId ? "Update" : "Save"}
      />

      {/* Delete Modal */}
      <DeleteModal
        show={showDelete}
        handleClose={() => {
          setShowDelete(false);
          setDeleteIndex(null);
          setDeleteId(null);
        }}
        onConfirm={handleDeleteConfirm}
        modalTitle="Delete Billing Method"
        modalMessage={
          deleteIndex !== null && billingMethods[deleteIndex]
            ? `Are you sure you want to delete "${billingMethods[deleteIndex].billing_method}"?`
            : ""
        }
      />

      {/* Toast */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        transition={Slide}
      />
    </>
  );
};

export default BillingMethodList;
