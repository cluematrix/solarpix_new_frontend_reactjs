import React, { useState, useEffect } from "react";
import { Card, Row, Col, Button, Form, Spinner, Table } from "react-bootstrap";
import { Slide, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CreateTwoToneIcon from "@mui/icons-material/CreateTwoTone";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import AddEditModal from "./add-edit-modal";
import DeleteModal from "./delete-modal";
import api from "../../../../api/axios";
import { useLocation } from "react-router";

const BranchList = () => {
  const [branchList, setBranchList] = useState([]);
  const [branchName, setBranchName] = useState("");
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
  const currentData = branchList.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(branchList.length / rowsPerPage);

  // 🔑 Permission Check
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
          String(perm.role_id) === roleId && perm.display_name === "Branch List"
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

  // Fetch Branches
  const fetchBranches = () => {
    api
      .get("/api/v1/admin/branch")
      .then((res) => {
        if (Array.isArray(res.data)) {
          setBranchList(res.data);
        } else if (Array.isArray(res.data.data)) {
          setBranchList(res.data.data);
        } else {
          setBranchList([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching branches:", err);
        setBranchList([]);
      });
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  // Toggle Active/Inactive
  const handleToggleActive = (id, currentStatus) => {
    const newStatus = currentStatus === 1 ? 0 : 1;

    setBranchList((prev) =>
      prev.map((branch) =>
        branch.id === id ? { ...branch, isActive: newStatus } : branch
      )
    );

    api
      .put(`/api/v1/admin/branch/${id}`, { isActive: newStatus })
      .then(() => {
        toast.success("Status updated successfully");
      })
      .catch((err) => {
        console.error("Update failed:", err);
        toast.error(err.response?.data?.message || "Failed to update status");
        setBranchList((prev) =>
          prev.map((branch) =>
            branch.id === id ? { ...branch, isActive: currentStatus } : branch
          )
        );
      });
  };

  // Add / Update Branch
  const handleAddOrUpdate = () => {
    if (!branchName.trim()) {
      toast.warning("Branch Name is required");
      return;
    }

    if (editId) {
      api
        .put(`/api/v1/admin/branch/${editId}`, {
          branch_name: branchName,
        })
        .then(() => {
          toast.success("Branch updated successfully");
          fetchBranches();
          resetForm();
        })
        .catch((err) => {
          console.error("Error updating branch:", err);
          toast.error(err.response?.data?.message || "Failed to update branch");
        });
    } else {
      api
        .post("/api/v1/admin/branch", {
          branch_name: branchName,
        })
        .then(() => {
          toast.success("Branch added successfully");
          fetchBranches();
          resetForm();
        })
        .catch((err) => {
          console.error("Error adding branch:", err);
          toast.error(err.response?.data?.message || "Failed to add branch");
        });
    }
  };

  const handleEdit = (index) => {
    const branch = branchList[index];
    setBranchName(branch.branch_name);
    setEditId(branch.id);
    setShowAddEdit(true);
  };

  const handleDeleteConfirm = () => {
    if (!deleteId) return;
    api
      .delete(`/api/v1/admin/branch/${deleteId}`)
      .then(() => {
        toast.success("Branch deleted successfully");
        fetchBranches();
        setShowDelete(false);
      })
      .catch((err) => {
        console.error("Error deleting branch:", err);
        toast.error(err.response?.data?.message || "Failed to delete branch");
      });
  };

  const resetForm = () => {
    setShowAddEdit(false);
    setBranchName("");
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
            <Card.Header className="d-flex justify-content-between">
              <h5 className="card-title fw-lighter">Branch</h5>
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
                      <th>Branch Name</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {branchList.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center">
                          No branches available
                        </td>
                      </tr>
                    ) : (
                      currentData.map((item, idx) => (
                        <tr key={item.id}>
                          <td>{idx + 1}</td>
                          <td>{item.branch_name}</td>
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
        branchName={branchName}
        setBranchName={setBranchName}
        onSave={handleAddOrUpdate}
        modalTitle={editId ? "Update Branch" : "Add New Branch"}
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
        modalTitle="Delete Branch"
        modalMessage={
          deleteIndex !== null && branchList[deleteIndex]
            ? `Are you sure you want to delete "${branchList[deleteIndex].branch_name}"?`
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

export default BranchList;
