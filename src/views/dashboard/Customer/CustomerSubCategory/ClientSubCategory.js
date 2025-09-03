import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Form,
  Pagination,
  Spinner,
} from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CreateTwoToneIcon from "@mui/icons-material/CreateTwoTone";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import AddEditModal from "./add-edit-modal";
import DeleteModal from "./delete-modal";
import api from "../../../../api/axios";
import { useLocation } from "react-router";

const ClientSubCategory = () => {
  const [subCategoryList, setSubCategoryList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [editId, setEditId] = useState(null);

  const [showAddEdit, setShowAddEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const { pathname } = useLocation();
  const [permissions, setPermissions] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [loading, setLoading] = useState(true);

  // 🔑 Fetch Permissions
  const FETCHPERMISSION = async () => {
    try {
      const res = await api.get("/api/v1/admin/rolePermission");
      let data = Array.isArray(res.data) ? res.data : res.data.data || [];
      const roleId = String(sessionStorage.getItem("roleId"));
      const matched = data.find(
        (perm) =>
          String(perm.role_id) === roleId &&
          perm.route?.toLowerCase() === pathname?.toLowerCase()
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
      console.error("Permission error:", err);
      setPermissions(null);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    setLoading(true);
    FETCHPERMISSION();
  }, [pathname]);

  // 🔄 Fetch Categories
  const fetchClientCategories = async () => {
    try {
      const res = await api.get("/api/v1/admin/clientCategory");
      const data = Array.isArray(res.data) ? res.data : res.data.data || [];
      setCategoryList(data);
    } catch (err) {
      console.error("Category fetch error:", err);
      toast.error("Failed to fetch categories");
    }
  };

  // 🔄 Fetch Sub Categories
  const fetchSubCategories = async () => {
    try {
      const res = await api.get("/api/v1/admin/clientSubCategory");
      const data = Array.isArray(res.data) ? res.data : res.data.data || [];
      setSubCategoryList(data);
    } catch (err) {
      console.error("SubCategory fetch error:", err);
      toast.error("Failed to fetch sub categories");
    }
  };

  useEffect(() => {
    fetchClientCategories();
    fetchSubCategories();
  }, []);

  // ✅ Toggle Active/Inactive
  const handleToggleActive = (id, currentStatus) => {
    const newStatus = currentStatus ? 0 : 1;
    setSubCategoryList((prev) =>
      prev.map((sc) => (sc.id === id ? { ...sc, isActive: newStatus } : sc))
    );
    api
      .put(`/api/v1/admin/clientSubCategory/${id}`, { isActive: newStatus })
      .then(() => toast.success("Status updated successfully"))
      .catch((err) => {
        console.error("Update failed:", err);
        toast.error("Failed to update status");
        setSubCategoryList((prev) =>
          prev.map((sc) =>
            sc.id === id ? { ...sc, isActive: currentStatus } : sc
          )
        );
      });
  };

  // ✅ Add or Update
  const handleAddOrUpdate = () => {
    if (!selectedCategory) {
      toast.warning("Please select a category");
      return;
    }
    if (!subCategory.trim()) {
      toast.warning("Sub category name is required");
      return;
    }

    const payload = {
      client_category_id: selectedCategory,
      sub_category: subCategory,
    };

    if (editId) {
      api
        .put(`/api/v1/admin/clientSubCategory/${editId}`, payload)
        .then(() => {
          toast.success("Sub category updated successfully");
          fetchSubCategories();
          resetForm();
        })
        .catch(() => toast.error("Failed to update sub category"));
    } else {
      api
        .post("/api/v1/admin/clientSubCategory", payload)
        .then(() => {
          toast.success("Sub category added successfully");
          fetchSubCategories();
          resetForm();
        })
        .catch(() => toast.error("Failed to add sub category"));
    }
  };

  const handleEdit = (index) => {
    const sc = subCategoryList[index];
    setSelectedCategory(sc.client_category_id);
    setSubCategory(sc.sub_category);
    setEditId(sc.id);
    setShowAddEdit(true);
  };

  // ✅ Delete
  const handleDeleteConfirm = () => {
    if (!deleteId) return;
    api
      .delete(`/api/v1/admin/clientSubCategory/${deleteId}`)
      .then(() => {
        toast.success("Sub category deleted successfully");
        fetchSubCategories();
        setShowDelete(false);
      })
      .catch(() => toast.error("Failed to delete sub category"));
  };

  const resetForm = () => {
    setShowAddEdit(false);
    setSelectedCategory("");
    setSubCategory("");
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

  // Pagination logic
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = subCategoryList.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(subCategoryList.length / itemsPerPage);

  return (
    <>
      <Row>
        <Col sm="12">
          <Card>
            <Card.Header className="d-flex justify-content-between">
              <h4 className="card-title">Customer Sub Category List</h4>
              {permissions.add && (
                <Button
                  className="btn-primary"
                  onClick={() => setShowAddEdit(true)}
                >
                  + Add Sub Category
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
                      <th>Sub Category</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center">
                          No Sub Category available
                        </td>
                      </tr>
                    ) : (
                      currentItems.map((item, idx) => {
                        const parentCategory = categoryList.find(
                          (cat) => cat.id === item.client_category_id
                        );
                        return (
                          <tr key={item.id}>
                            <td>{indexOfFirst + idx + 1}</td>
                            <td>{parentCategory?.category || "-"}</td>
                            <td>{item.sub_category}</td>
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
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination className="justify-content-center mt-3">
                  <Pagination.First
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                  />
                  <Pagination.Prev
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                  />
                  {Array.from({ length: totalPages }, (_, i) => (
                    <Pagination.Item
                      key={i + 1}
                      active={i + 1 === currentPage}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </Pagination.Item>
                  ))}
                  <Pagination.Next
                    onClick={() =>
                      setCurrentPage((p) => Math.min(p + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                  />
                  <Pagination.Last
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                  />
                </Pagination>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Add/Edit Modal */}
      <AddEditModal
        show={showAddEdit}
        handleClose={resetForm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categoryList={categoryList}
        value={subCategory}
        setValue={setSubCategory}
        onSave={handleAddOrUpdate}
        modalTitle={editId ? "Update Sub Category" : "Add New Sub Category"}
        buttonLabel={editId ? "Update" : "Submit"}
        fieldLabel="Sub Category"
        placeholder="Enter sub category"
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
        modalTitle="Delete Sub Category"
        modalMessage={
          deleteIndex !== null && subCategoryList[deleteIndex]
            ? `Are you sure you want to delete "${subCategoryList[deleteIndex].sub_category}"?`
            : ""
        }
      />

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default ClientSubCategory;
