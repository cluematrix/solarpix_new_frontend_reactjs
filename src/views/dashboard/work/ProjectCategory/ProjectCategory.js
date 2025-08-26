import React, { useState, useEffect } from "react";
import { Card, Row, Col, Button, Form } from "react-bootstrap";
import CreateTwoToneIcon from "@mui/icons-material/CreateTwoTone";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import AddEditModal from "./add-edit-modal";
import DeleteModal from "./delete-modal";
import api from "../../../../api/axios";
import { useLocation } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProjectCategory = () => {
  const [categoryList, setCategoryList] = useState([]);
  const [category, setCategory] = useState("");
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
    }
  };

  useEffect(() => {
    FETCHPERMISSION();
  }, [pathname]);

  // 🔄 Fetch Project Categories
  const fetchProjectCategories = () => {
    api
      .get("/api/v1/admin/projectCategory")
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data.data || [];
        setCategoryList(data);
      })
      .catch((err) => {
        console.error("Error fetching project categories:", err);
        setCategoryList([]);
      });
  };

  useEffect(() => {
    fetchProjectCategories();
  }, []);

  // ✅ Toggle Active/Inactive
  const handleToggleActive = (id, currentStatus) => {
    const newStatus = currentStatus ? 0 : 1;

    setCategoryList((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, isActive: newStatus } : cat))
    );

    api
      .put(`/api/v1/admin/projectCategory/${id}`, { isActive: newStatus })
      .then(() => {
        toast.success("Status updated successfully!");
      })
      .catch((err) => {
        console.error("Update failed:", err);
        toast.error("Failed to update status!");
        // rollback
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
      toast.error("Category name is required!");
      return;
    }

    if (editId) {
      api
        .put(`/api/v1/admin/projectCategory/${editId}`, { category })
        .then(() => {
          toast.success("Project category updated successfully!");
          fetchProjectCategories();
          resetForm();
        })
        .catch((err) => {
          console.error("Error updating project category:", err);
          toast.error("Failed to update project category!");
        });
    } else {
      api
        .post("/api/v1/admin/projectCategory", { category })
        .then(() => {
          toast.success("Project category added successfully!");
          fetchProjectCategories();
          resetForm();
        })
        .catch((err) => {
          console.error("Error adding project category:", err);
          toast.error("Failed to add project category!");
        });
    }
  };

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
      .delete(`/api/v1/admin/projectCategory/${deleteId}`)
      .then(() => {
        toast.success("Project category deleted successfully!");
        fetchProjectCategories();
        setShowDelete(false);
      })
      .catch((err) => {
        console.error("Error deleting project category:", err);
        toast.error("Failed to delete project category!");
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
              <h4 className="card-title">Project Category List</h4>
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
                    {categoryList.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center">
                          No Project Category available
                        </td>
                      </tr>
                    ) : (
                      categoryList.map((item, idx) => (
                        <tr key={item.id}>
                          <td>{idx + 1}</td>
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
        value={category}
        setValue={setCategory}
        onSave={handleAddOrUpdate}
        modalTitle={
          editId ? "Update Project Category" : "Add New Project Category"
        }
        buttonLabel={editId ? "Update" : "Submit"}
        fieldLabel="Project Category"
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
        modalTitle="Delete Project Category"
        modalMessage={
          deleteIndex !== null && categoryList[deleteIndex]
            ? `Are you sure you want to delete "${categoryList[deleteIndex].category}"?`
            : ""
        }
      />

      {/* ✅ Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default ProjectCategory;
