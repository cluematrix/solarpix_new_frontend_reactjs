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

const TaskCategory = () => {
  const [categoryList, setCategoryList] = useState([]);
  const [category, setCategory] = useState("");
  const [editId, setEditId] = useState(null);

  const [showAddEdit, setShowAddEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const { pathname } = useLocation();
  const [permissions, setPermissions] = useState(null);

  // 🔹 Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const categoriesPerPage = 10;

  const indexOfLast = currentPage * categoriesPerPage;
  const indexOfFirst = indexOfLast - categoriesPerPage;
  const currentCategories = categoryList.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(categoryList.length / categoriesPerPage);

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
    }
  };

  useEffect(() => {
    FETCHPERMISSION();
  }, [pathname]);

  // 🔄 Fetch Task Categories
  const fetchTaskCategories = () => {
    api
      .get("/api/v1/admin/taskCategory")
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data.data || [];
        setCategoryList(data);
      })
      .catch((err) => {
        console.error("Error fetching task categories:", err);
        toast.error("Failed to fetch categories");
        setCategoryList([]);
      });
  };

  useEffect(() => {
    fetchTaskCategories();
  }, []);

  // ✅ Toggle Active/Inactive
  const handleToggleActive = (id, currentStatus) => {
    const newStatus = currentStatus ? 0 : 1;
    setCategoryList((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, isActive: newStatus } : cat))
    );

    api
      .put(`/api/v1/admin/taskCategory/${id}`, { isActive: newStatus })
      .then(() => toast.success("Status updated successfully"))
      .catch((err) => {
        console.error("Update failed:", err);
        toast.error("Failed to update status");
        setCategoryList((prev) =>
          prev.map((cat) =>
            cat.id === id ? { ...cat, isActive: currentStatus } : cat
          )
        );
      });
  };

  // ✅ Add or Update
  const handleAddOrUpdate = () => {
    if (!category.trim()) {
      toast.error("Category name is required");
      return;
    }

    if (editId) {
      api
        .put(`/api/v1/admin/taskCategory/${editId}`, { category })
        .then(() => {
          toast.success("Task category updated successfully");
          fetchTaskCategories();
          resetForm();
        })
        .catch((err) => {
          console.error("Error updating task category:", err);
          toast.error("Failed to update category");
        });
    } else {
      api
        .post("/api/v1/admin/taskCategory", { category })
        .then(() => {
          toast.success("Task category added successfully");
          fetchTaskCategories();
          resetForm();
        })
        .catch((err) => {
          console.error("Error adding task category:", err);
          if (err.response?.data?.message) {
            toast.error(err.response.data.message);
          } else {
            toast.error("Failed to add category");
          }
        });
    }
  };

  // ✅ Edit
  const handleEdit = (index) => {
    const cat = categoryList[index];
    setCategory(cat.category);
    setEditId(cat.id);
    setShowAddEdit(true);
  };

  // ✅ Delete
  const handleDeleteConfirm = () => {
    if (!deleteId) return;
    api
      .delete(`/api/v1/admin/taskCategory/${deleteId}`)
      .then(() => {
        toast.success("Task category deleted successfully");
        fetchTaskCategories();
        setShowDelete(false);
      })
      .catch((err) => {
        console.error("Error deleting task category:", err);
        toast.error("Failed to delete category");
      });
  };

  const resetForm = () => {
    setShowAddEdit(false);
    setCategory("");
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
              <h4 className="card-title">Task Category List</h4>
              {permissions.add && (
                <Button
                  className="btn-primary"
                  onClick={() => setShowAddEdit(true)}
                >
                  + Add Category
                </Button>
              )}
            </Card.Header>

            <Card.Body className="px-0">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Sr. No.</th>
                      <th>Category</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentCategories.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center">
                          No Task Category available
                        </td>
                      </tr>
                    ) : (
                      currentCategories.map((item, idx) => (
                        <tr key={item.id}>
                          <td>{indexOfFirst + idx + 1}</td>
                          <td>{item.category}</td>
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
                                onClick={() => handleEdit(indexOfFirst + idx)}
                                color="primary"
                                style={{ cursor: "pointer" }}
                              />
                            )}

                            {permissions.del && (
                              <DeleteRoundedIcon
                                onClick={() => {
                                  setDeleteIndex(indexOfFirst + idx);
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

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-end mt-3 me-3">
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
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
                    onClick={() => setCurrentPage((prev) => prev + 1)}
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
        value={category}
        setValue={setCategory}
        onSave={handleAddOrUpdate}
        modalTitle={editId ? "Update Task Category" : "Add New Task Category"}
        buttonLabel={editId ? "Update" : "Submit"}
        fieldLabel="Task Category"
        placeholder="Enter category"
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
        modalTitle="Delete Task Category"
        modalMessage={
          deleteIndex !== null && categoryList[deleteIndex]
            ? `Are you sure you want to delete "${categoryList[deleteIndex].category}"?`
            : ""
        }
      />

      {/* ✅ Toast */}
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default TaskCategory;
