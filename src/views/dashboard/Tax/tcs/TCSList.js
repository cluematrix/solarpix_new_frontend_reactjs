import React, { useState, useEffect } from "react";
import { Card, Row, Col, Button, Form, Spinner, Table } from "react-bootstrap";
import { Slide, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CreateTwoToneIcon from "@mui/icons-material/CreateTwoTone";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import AddEditTCSModal from "./add-edit-modal";
import DeleteModal from "./delete-modal";
import api from "../../../../api/axios";
import { useLocation } from "react-router";

const TCSList = () => {
  const [tcsList, setTcsList] = useState([]);
  const [tcsName, setTcsName] = useState("");
  const [tcsPercentage, setTcsPercentage] = useState("");
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
  const currentData = tcsList.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(tcsList.length / rowsPerPage);

  // Permission Fetch
  const FETCHPERMISSION = async () => {
    try {
      const res = await api.get("/api/v1/admin/rolePermission");

      let data = Array.isArray(res.data) ? res.data : res.data.data || [];

      const roleId = String(sessionStorage.getItem("roleId"));

      const matchedPermission = data.find(
        (perm) =>
          String(perm.role_id) === roleId && perm.display_name === "TCS List"
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

  // Fetch TCS Data
  const fetchTCS = () => {
    api
      .get("/api/v1/admin/TCS")
      .then((res) => {
        if (Array.isArray(res.data)) setTcsList(res.data);
        else if (Array.isArray(res.data.data)) setTcsList(res.data.data);
        else setTcsList([]);
      })
      .catch((err) => {
        console.error("Error fetching TCS:", err);
        setTcsList([]);
      });
  };

  useEffect(() => {
    fetchTCS();
  }, []);

  // Toggle Active/Inactive
  const handleToggleActive = (id, currentStatus) => {
    const newStatus = currentStatus === 1 ? 0 : 1;

    setTcsList((prev) =>
      prev.map((tcs) => (tcs.id === id ? { ...tcs, isActive: newStatus } : tcs))
    );

    api
      .put(`/api/v1/admin/TCS/${id}`, { isActive: newStatus })
      .then(() => toast.success("Status updated successfully"))
      .catch((err) => {
        console.error("Update failed:", err);
        toast.error(err.response?.data?.message || "Failed to update status");
        setTcsList((prev) =>
          prev.map((tcs) =>
            tcs.id === id ? { ...tcs, isActive: currentStatus } : tcs
          )
        );
      });
  };

  // Add / Update TCS
  const handleAddOrUpdate = () => {
    if (!tcsName.trim()) {
      toast.warning("TCS Name is required");
      return;
    }
    if (!tcsPercentage || isNaN(tcsPercentage)) {
      toast.warning("Valid Percentage is required");
      return;
    }

    const payload = { name: tcsName, percentage: tcsPercentage };

    if (editId) {
      api
        .put(`/api/v1/admin/TCS/${editId}`, payload)
        .then(() => {
          toast.success("TCS updated successfully");
          fetchTCS();
          resetForm();
        })
        .catch((err) =>
          toast.error(err.response?.data?.message || "Failed to update TCS")
        );
    } else {
      api
        .post("/api/v1/admin/TCS", payload)
        .then(() => {
          toast.success("TCS added successfully");
          fetchTCS();
          resetForm();
        })
        .catch((err) =>
          toast.error(err.response?.data?.message || "Failed to add TCS")
        );
    }
  };

  const handleEdit = (index) => {
    const tcs = tcsList[index];
    setTcsName(tcs.name);
    setTcsPercentage(tcs.percentage);
    setEditId(tcs.id);
    setShowAddEdit(true);
  };

  const handleDeleteConfirm = () => {
    if (!deleteId) return;
    api
      .delete(`/api/v1/admin/TCS/${deleteId}`)
      .then(() => {
        toast.success("TCS deleted successfully");
        fetchTCS();
        setShowDelete(false);
      })
      .catch((err) => {
        console.error("Error deleting TCS:", err);
        toast.error(err.response?.data?.message || "Failed to delete TCS");
      });
  };

  const resetForm = () => {
    setShowAddEdit(false);
    setTcsName("");
    setTcsPercentage("");
    setEditId(null);
  };

  if (loading)
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
            <Card.Header className="d-flex justify-content-between">
              <h5 className="card-title fw-lighter">TCS</h5>
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
                      <th>Name</th>
                      <th>Percentage (%)</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tcsList.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center">
                          No TCS available
                        </td>
                      </tr>
                    ) : (
                      currentData.map((item, idx) => (
                        <tr key={item.id}>
                          <td>{idx + 1}</td>
                          <td>{item.name}</td>
                          <td>{item.percentage}</td>
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
      <AddEditTCSModal
        show={showAddEdit}
        handleClose={resetForm}
        tcsName={tcsName}
        setTcsName={setTcsName}
        tcsPercentage={tcsPercentage}
        setTcsPercentage={setTcsPercentage}
        onSave={handleAddOrUpdate}
        modalTitle={editId ? "Update TCS" : "Add New TCS"}
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
        modalTitle="Delete TCS"
        modalMessage={
          deleteIndex !== null && tcsList[deleteIndex]
            ? `Are you sure you want to delete "${tcsList[deleteIndex].name}"?`
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

export default TCSList;
