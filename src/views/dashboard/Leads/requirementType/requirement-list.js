import React, { useState, useEffect } from "react";
import { Card, Row, Col, Button, Form, Spinner, Table } from "react-bootstrap";
import { Slide, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CreateTwoToneIcon from "@mui/icons-material/CreateTwoTone";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import AddEditModal from "../requirementType/add-edit-modal";
import DeleteModal from "../requirementType/delete-modal";
import api from "../../../../api/axios";
import { useLocation } from "react-router";

const RequirementList = () => {
  const [requirementList, setRequirementList] = useState([]);
  const [requirementType, setRequirementType] = useState("");
  const [editId, setEditId] = useState(null);

  const [showAddEdit, setShowAddEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const { pathname } = useLocation();
  const [permissions, setPermissions] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentData = requirementList.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(requirementList.length / rowsPerPage);

  const [loading, setLoading] = useState(true);

  // Fetch Permissions
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

  // Fetch Requirement Types
  const fetchRequirementTypes = () => {
    api
      .get("/api/v1/admin/requirementType")
      .then((res) => {
        if (Array.isArray(res.data)) {
          setRequirementList(res.data);
        } else if (Array.isArray(res.data.data)) {
          setRequirementList(res.data.data);
        } else {
          setRequirementList([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching requirement types:", err);
        setRequirementList([]);
      });
  };

  useEffect(() => {
    fetchRequirementTypes();
  }, []);

  // Toggle Active/Inactive
  const handleToggleActive = (id, currentStatus) => {
    const newStatus = currentStatus === 1 ? 0 : 1;

    setRequirementList((prev) =>
      prev.map((req) => (req.id === id ? { ...req, isActive: newStatus } : req))
    );

    api
      .put(`/api/v1/admin/requirementType/${id}`, { isActive: newStatus })
      .then(() => {
        toast.success("Status updated successfully");
      })
      .catch((err) => {
        console.error("Update failed:", err);
        toast.error(err.response?.data?.message || "Failed to update status");
        setRequirementList((prev) =>
          prev.map((req) =>
            req.id === id ? { ...req, isActive: currentStatus } : req
          )
        );
      });
  };

  // Add or Update RequirementType
  const handleAddOrUpdateRequirement = () => {
    if (!requirementType.trim()) {
      toast.warning("Requirement Type is required");
      return;
    }

    if (editId) {
      api
        .put(`/api/v1/admin/requirementType/${editId}`, {
          requirement_type: requirementType,
        })
        .then(() => {
          toast.success("Requirement Type updated successfully");
          fetchRequirementTypes();
          resetForm();
        })
        .catch((err) => {
          console.error("Error updating requirement type:", err);
          toast.error(
            err.response?.data?.message || "Failed to update requirement type"
          );
        });
    } else {
      api
        .post("/api/v1/admin/requirementType/", {
          requirement_type: requirementType,
        })
        .then(() => {
          toast.success("Requirement Type added successfully");
          fetchRequirementTypes();
          resetForm();
        })
        .catch((err) => {
          console.error("Error adding requirement type:", err);
          toast.error(
            err.response?.data?.message || "Failed to add requirement type"
          );
        });
    }
  };

  const handleEdit = (index) => {
    const req = requirementList[index];
    setRequirementType(req.requirement_type);
    setEditId(req.id || req._id);
    setShowAddEdit(true);
  };

  const handleDeleteConfirm = () => {
    if (!deleteId) return;
    api
      .delete(`/api/v1/admin/requirementType/${deleteId}`)
      .then(() => {
        toast.success("Requirement Type deleted successfully");
        fetchRequirementTypes();
        setShowDelete(false);
      })
      .catch((err) => {
        console.error("Error deleting requirement type:", err);
        toast.error(
          err.response?.data?.message || "Failed to delete requirement type"
        );
      });
  };

  const resetForm = () => {
    setShowAddEdit(false);
    setRequirementType("");
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
              <h5 className="card-title fw-lighter">Requirement Types</h5>
              {permissions.add && (
                <Button
                  className="btn-primary"
                  onClick={() => setShowAddEdit(true)}
                >
                  + New Requirement Type
                </Button>
              )}
            </Card.Header>

            <Card.Body className="px-0 pt-3">
              <div className="table-responsive">
                <Table hover responsive className="table">
                  <thead>
                    <tr className="table-gray">
                      <th>Sr. No.</th>
                      <th>Requirement Type</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requirementList.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center">
                          No Requirement Type available
                        </td>
                      </tr>
                    ) : (
                      currentData.map((item, idx) => (
                        <tr key={item.id || item._id}>
                          <td>{idx + 1}</td>
                          <td>{item.requirement_type}</td>
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

      <AddEditModal
        show={showAddEdit}
        handleClose={resetForm}
        roleName={requirementType}
        setRoleName={setRequirementType}
        onSave={handleAddOrUpdateRequirement}
        modalTitle={
          editId ? "Update Requirement Type" : "Add New Requirement Type"
        }
        buttonLabel={editId ? "Update" : "Save"}
      />

      <DeleteModal
        show={showDelete}
        handleClose={() => {
          setShowDelete(false);
          setDeleteIndex(null);
          setDeleteId(null);
        }}
        onConfirm={handleDeleteConfirm}
        modalTitle="Delete Requirement Type"
        modalMessage={
          deleteIndex !== null && requirementList[deleteIndex]
            ? `Are you sure you want to delete the requirement type "${requirementList[deleteIndex].requirement_type}"?`
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

export default RequirementList;
