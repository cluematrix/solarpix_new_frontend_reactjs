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
  const [formData, setFormData] = useState({
    branch_name: "",
    address: "",
    pin_code: "",
    city: "",
    state: "",
    country: "",
  });

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

  // Fetch permissions
  const FETCHPERMISSION = async () => {
    try {
      const res = await api.get("/api/v1/admin/rolePermission");
      let data = Array.isArray(res.data) ? res.data : res.data.data || [];
      const roleId = String(sessionStorage.getItem("roleId"));
      const matched = data.find(
        (perm) =>
          String(perm.role_id) === roleId && perm.display_name === "Branch List"
      );

      if (matched) {
        setPermissions({
          view: matched.view === true || matched.view === 1,
          add: matched.add === true || matched.add === 1,
          edit: matched.edit === true || matched.edit === 1,
          del: matched.del === true || matched.del === 1,
        });
      } else setPermissions(null);
    } catch (err) {
      console.error("Error fetching permissions:", err);
      setPermissions(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    FETCHPERMISSION();
  }, [pathname]);

  // Fetch branches and normalize isActive
  const fetchBranches = () => {
    api
      .get("/api/v1/admin/branch")
      .then((res) => {
        let data = Array.isArray(res.data) ? res.data : res.data.data || [];
        data = data.map((b) => ({
          ...b,
          isActive: b.isActive === 1 || b.isActive === true,
        }));
        setBranchList(data);
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
  const handleToggleActive = async (id) => {
    const branch = branchList.find((b) => b.id === id);
    if (!branch) return;

    const newStatus = !branch.isActive;

    // Optimistic update
    setBranchList((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isActive: newStatus } : b))
    );

    const payload = {
      ...branch,
      isActive: newStatus,
    };

    try {
      await api.put(`/api/v1/admin/branch/${id}`, payload);
      toast.success("Status updated successfully");
    } catch (err) {
      console.error("Update failed:", err);
      toast.error("Failed to update status");
      // Revert on error
      setBranchList((prev) =>
        prev.map((b) => (b.id === id ? { ...b, isActive: branch.isActive } : b))
      );
    }
  };

  // Add or Update branch
  const handleAddOrUpdate = () => {
    if (!formData.branch_name.trim()) {
      toast.warning("Branch Name is required");
      return;
    }

    const payload = {
      branch_name: formData.branch_name,
      address: formData.address || null,
      pin_code: formData.pin_code || null,
      city: formData.city || null,
      state: formData.state || null,
      country: formData.country || null,
    };

    const request = editId
      ? api.put(`/api/v1/admin/branch/${editId}`, payload)
      : api.post("/api/v1/admin/branch", payload);

    request
      .then(() => {
        toast.success(
          editId ? "Branch updated successfully" : "Branch added successfully"
        );
        fetchBranches();
        resetForm();
      })
      .catch((err) => {
        console.error("Branch save error:", err);
        toast.error("Failed to save branch");
      });
  };

  const handleEdit = (index) => {
    const branch = branchList[index];
    setFormData({
      branch_name: branch.branch_name || "",
      address: branch.address || "",
      pin_code: branch.pin_code || "",
      city: branch.city || "",
      state: branch.state || "",
      country: branch.country || "",
    });
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
        console.error("Delete error:", err);
        toast.error("Failed to delete branch");
      });
  };

  const resetForm = () => {
    setShowAddEdit(false);
    setFormData({
      branch_name: "",
      address: "",
      pin_code: "",
      city: "",
      state: "",
      country: "",
    });
    setEditId(null);
  };

  if (loading)
    return (
      <div className="loader-div">
        <Spinner animation="border" />
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
                <Table hover responsive>
                  <thead>
                    <tr className="table-gray">
                      <th>Sr. No.</th>
                      <th>Branch Name</th>
                      <th>City</th>
                      <th>State</th>
                      <th>Country</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {branchList.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center">
                          No branches available
                        </td>
                      </tr>
                    ) : (
                      currentData.map((item, idx) => (
                        <tr key={item.id}>
                          <td>{idx + 1}</td>
                          <td>{item.branch_name}</td>
                          <td>{item.city || "-"}</td>
                          <td>{item.state || "-"}</td>
                          <td>{item.country || "-"}</td>
                          <td>{item.isActive ? "Active" : "Inactive"}</td>
                          <td className="d-flex align-items-center">
                            <Form.Check
                              type="switch"
                              id={`active-switch-${item.id}`}
                              checked={item.isActive}
                              onChange={() => handleToggleActive(item.id)}
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
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Add/Edit Modal */}
      <AddEditModal
        show={showAddEdit}
        handleClose={resetForm}
        formData={formData}
        setFormData={setFormData}
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
