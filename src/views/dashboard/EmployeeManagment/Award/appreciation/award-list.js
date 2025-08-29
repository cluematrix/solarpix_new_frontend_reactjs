import React, { useState, useEffect } from "react";
import { Card, Row, Col, Button, Form, Pagination } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CreateTwoToneIcon from "@mui/icons-material/CreateTwoTone";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import AddEditModal from "./add-edit-modal";
import DeleteModal from "./delete-modal";
import api from "../../../../../api/axios";
import { useLocation } from "react-router";

const AwardList = () => {
  const [awards, setAwards] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    icon: "",
    color: "#000000",
    description: "",
  });
  const [editId, setEditId] = useState(null);

  const [showAddEdit, setShowAddEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const { pathname } = useLocation();
  const [permissions, setPermissions] = useState(null);

  // 🔑 Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Permission check
  const FETCHPERMISSION = async () => {
    try {
      const res = await api.get("/api/v1/admin/rolePermission");
      let data = Array.isArray(res.data) ? res.data : res.data.data;
      const matchedPermission = data.find((perm) => perm.route === pathname);
      setPermissions(matchedPermission || null);
    } catch (err) {
      console.error(err);
      setPermissions(null);
    }
  };

  useEffect(() => {
    FETCHPERMISSION();
  }, [pathname]);

  // Fetch Awards
  const fetchAwards = () => {
    api
      .get("/api/v1/admin/award")
      .then((res) => {
        const data = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.data)
          ? res.data.data
          : [];
        setAwards(data);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to fetch awards");
        setAwards([]);
      });
  };

  useEffect(() => {
    fetchAwards();
  }, []);

  // Toggle Active/Inactive
  const handleToggleActive = (id, currentStatus) => {
    const newStatus = !currentStatus;
    setAwards((prev) =>
      prev.map((award) =>
        award.id === id ? { ...award, isActive: newStatus } : award
      )
    );
    api
      .put(`/api/v1/admin/award/${id}`, { isActive: newStatus })
      .then(() => toast.success("Status updated successfully"))
      .catch((err) => {
        toast.error(err.response?.data?.message || "Failed to update status");
        setAwards((prev) =>
          prev.map((award) =>
            award.id === id ? { ...award, isActive: currentStatus } : award
          )
        );
      });
  };

  // Add or Update Award
  const handleAddOrUpdateAward = () => {
    if (!formData.title.trim()) {
      toast.warning("Award title is required");
      return;
    }

    if (editId) {
      api
        .put(`/api/v1/admin/award/${editId}`, formData)
        .then(() => {
          toast.success("Award updated successfully");
          fetchAwards();
          resetForm();
        })
        .catch((err) =>
          toast.error(err.response?.data?.message || "Failed to update award")
        );
    } else {
      api
        .post("/api/v1/admin/award", formData)
        .then(() => {
          toast.success("Award added successfully");
          fetchAwards();
          resetForm();
        })
        .catch((err) =>
          toast.error(err.response?.data?.message || "Failed to add award")
        );
    }
  };

  // Edit Award
  const handleEdit = (index) => {
    const award = awards[index];
    setFormData({
      title: award.title,
      icon: award.icon,
      color: award.color || "#000000",
      description: award.description || "",
    });
    setEditId(award.id || award._id);
    setShowAddEdit(true);
  };

  // Delete Award
  const handleDeleteConfirm = () => {
    if (!deleteId) return;
    api
      .delete(`/api/v1/admin/award/${deleteId}`)
      .then(() => {
        toast.success("Award deleted successfully");
        fetchAwards();
        setShowDelete(false);
      })
      .catch((err) =>
        toast.error(err.response?.data?.message || "Failed to delete award")
      );
  };

  // Reset form
  const resetForm = () => {
    setShowAddEdit(false);
    setFormData({ title: "", icon: "", color: "#000000", description: "" });
    setEditId(null);
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAwards = awards.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(awards.length / itemsPerPage);

  // Permission block
  if (!permissions)
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "70vh" }}
      >
        <h4>Loading permissions...</h4>
      </div>
    );
  if (!permissions.view)
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
      <Row>
        <Col sm="12">
          <Card>
            <Card.Header className="d-flex justify-content-between">
              <h4 className="card-title">Award List</h4>
              {permissions.add && (
                <Button
                  className="btn-primary"
                  onClick={() => setShowAddEdit(true)}
                >
                  + New Award
                </Button>
              )}
            </Card.Header>
            <Card.Body className="px-0">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr className="ligth">
                      <th>Sr. No.</th>
                      <th>Title</th>
                      <th>Icon</th>
                      <th>Color</th>
                      <th>Description</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentAwards.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center">
                          No awards available
                        </td>
                      </tr>
                    ) : (
                      currentAwards.map((item, idx) => (
                        <tr key={item.id || item._id}>
                          <td>{indexOfFirstItem + idx + 1}</td>
                          <td>{item.title}</td>
                          <td>{item.icon}</td>
                          <td>
                            <div
                              style={{
                                width: "20px",
                                height: "20px",
                                backgroundColor: item.color || "#000",
                                borderRadius: "50%",
                              }}
                            ></div>
                          </td>
                          <td>{item.description}</td>
                          <td>{item.isActive ? "Active" : "Inactive"}</td>
                          <td className="d-flex align-items-center">
                            <Form.Check
                              type="switch"
                              id={`active-switch-${item.id}`}
                              checked={item.isActive}
                              onChange={() =>
                                handleToggleActive(item.id, item.isActive)
                              }
                              className="me-3"
                            />
                            {permissions.edit && (
                              <CreateTwoToneIcon
                                className="me-2"
                                onClick={() =>
                                  handleEdit(indexOfFirstItem + idx)
                                }
                                color="primary"
                                style={{ cursor: "pointer" }}
                              />
                            )}
                            {permissions.del && (
                              <DeleteRoundedIcon
                                onClick={() => {
                                  setDeleteIndex(indexOfFirstItem + idx);
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

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-3">
                  <Pagination>
                    <Pagination.Prev
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                    />
                    {[...Array(totalPages)].map((_, idx) => (
                      <Pagination.Item
                        key={idx + 1}
                        active={idx + 1 === currentPage}
                        onClick={() => setCurrentPage(idx + 1)}
                      >
                        {idx + 1}
                      </Pagination.Item>
                    ))}
                    <Pagination.Next
                      onClick={() =>
                        setCurrentPage((prev) =>
                          Math.min(prev + 1, totalPages)
                        )
                      }
                      disabled={currentPage === totalPages}
                    />
                  </Pagination>
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
        formData={formData}
        setFormData={setFormData}
        onSave={handleAddOrUpdateAward}
        modalTitle={editId ? "Update Award" : "Add Award"}
        buttonLabel={editId ? "Update" : "Submit"}
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
        modalTitle="Delete Award"
        modalMessage={
          deleteIndex !== null && awards[deleteIndex]
            ? `Are you sure you want to delete the award "${awards[deleteIndex].title}"?`
            : ""
        }
      />

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default AwardList;
