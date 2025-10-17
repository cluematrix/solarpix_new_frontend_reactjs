import React, { useState, useEffect } from "react";
import { Card, Row, Col, Button, Form, Spinner, Table } from "react-bootstrap";
import { Slide, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CreateTwoToneIcon from "@mui/icons-material/CreateTwoTone";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import AddEditModal from "./add-edit-modal";
import DeleteModal from "../Department/delete-modal";
import api from "../../../../api/axios";
import { useLocation } from "react-router";

const DesignationList = () => {
  const [userlist, setUserlist] = useState([]);
  const [roleName, setRoleName] = useState("");
  const [editId, setEditId] = useState(null);
  const [departmentId, setDepartmentId] = useState("");

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
  const currentData = userlist.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(userlist.length / rowsPerPage);

  // 🔑 Fetch Permission
  const FETCHPERMISSION = async () => {
    try {
      const res = await api.get("/api/v1/admin/rolePermission");

      let data = [];
      if (Array.isArray(res.data)) data = res.data;
      else if (Array.isArray(res.data.data)) data = res.data.data;

      const roleId = String(sessionStorage.getItem("roleId"));
      const matchedPermission = data.find(
        (perm) =>
          String(perm.role_id) === roleId &&
          perm.display_name === "Designation List"
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

  // 🔹 Fetch Designations
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
        console.error("Error fetching designations:", err);
        setUserlist([]);
      });
  };

  useEffect(() => {
    fetchDesignations();
  }, []);

  // 🔹 Toggle Active/Inactive
  const handleToggleActive = (id, currentStatus) => {
    const newStatus = currentStatus === 1 ? 0 : 1;

    setUserlist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isActive: newStatus } : item
      )
    );

    api
      .put(`/api/v1/admin/designation/${id}`, { isActive: newStatus })
      .then(() => {
        toast.success("Status updated successfully");
      })
      .catch((err) => {
        console.error("Update failed:", err);
        toast.error(err.response?.data?.message || "Failed to update status");
        setUserlist((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, isActive: currentStatus } : item
          )
        );
      });
  };

  // 🔹 Add or Update Designation
  const handleAddOrUpdateRole = () => {
    if (!roleName.trim()) {
      toast.warning("Designation name is required");
      return;
    }

    if (!departmentId) {
      toast.warning("Please select a department");
      return;
    }

    const payload = {
      name: roleName,
      department_id: departmentId,
    };

    if (editId) {
      api
        .put(`/api/v1/admin/designation/${editId}`, payload)
        .then(() => {
          toast.success("Designation updated successfully");
          fetchDesignations();
          resetForm();
        })
        .catch((err) => {
          console.error("Error updating designation:", err);
          toast.error(
            err.response?.data?.message || "Failed to update designation"
          );
        });
    } else {
      api
        .post("/api/v1/admin/designation", payload)
        .then(() => {
          toast.success("Designation added successfully");
          fetchDesignations();
          resetForm();
        })
        .catch((err) => {
          console.error("Error adding designation:", err);
          toast.error(
            err.response?.data?.message || "Failed to add designation"
          );
        });
    }
  };

  // 🔹 Edit
  const handleEdit = (index) => {
    const item = userlist[index];
    setRoleName(item.name);
    setEditId(item.id || item._id);
    setDepartmentId(item.department_id || "");
    setShowAddEdit(true);
  };

  // 🔹 Delete
  const handleDeleteConfirm = () => {
    if (!deleteId) return;
    api
      .delete(`/api/v1/admin/designation/${deleteId}`)
      .then(() => {
        toast.success("Designation deleted successfully");
        fetchDesignations();
        setShowDelete(false);
      })
      .catch((err) => {
        console.error("Error deleting designation:", err);
        toast.error(
          err.response?.data?.message || "Failed to delete designation"
        );
      });
  };

  // 🔹 Reset
  const resetForm = () => {
    setShowAddEdit(false);
    setRoleName("");
    setEditId(null);
    setDepartmentId("");
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
              <h5 className="card-title fw-lighter">Designations</h5>
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
                      <th>Department</th>
                      <th>Designation</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userlist.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center">
                          No Designation available
                        </td>
                      </tr>
                    ) : (
                      currentData.map((item, idx) => (
                        <tr key={item.id || item._id}>
                          <td>{idx + 1}</td>
                          <td>{item.departments.name || "—"}</td>
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
                </Table>
              </div>

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
        roleName={roleName}
        setRoleName={setRoleName}
        onSave={handleAddOrUpdateRole}
        modalTitle={editId ? "Update Designation" : "Add New Designation"}
        buttonLabel={editId ? "Update" : "Save"}
        departmentId={departmentId}
        setDepartmentId={setDepartmentId}
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
        modalTitle="Delete Designation"
        modalMessage={
          deleteIndex !== null && userlist[deleteIndex]
            ? `Are you sure you want to delete the designation "${userlist[deleteIndex].name}"?`
            : ""
        }
      />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        transition={Slide}
      />
    </>
  );
};

export default DesignationList;
