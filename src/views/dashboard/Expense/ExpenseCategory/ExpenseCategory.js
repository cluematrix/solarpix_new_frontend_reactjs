import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Form,
  Spinner,
  Table,
  Pagination,
} from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CreateTwoToneIcon from "@mui/icons-material/CreateTwoTone";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import AddEditModal from "./add-edit-modal";
import DeleteModal from "./delete-modal";
import api from "../../../../api/axios";
import { useLocation } from "react-router";

const ExpenseCategory = () => {
  const [categoryList, setCategoryList] = useState([]);
  const [category, setCategory] = useState("");
  const [editId, setEditId] = useState(null);

  const [showAddEdit, setShowAddEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  // 🔹 Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const { pathname } = useLocation();
  const [permissions, setPermissions] = useState(null);

  const [loading, setLoading] = useState(true);

  // 🔑 Fetch Role Permissions
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
      console.log(roleId, "roleId from sessionStorage");
      console.log(pathname, "current pathname");

      // ✅ Match current role + route
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
      setLoading(false); //  Stop loader after API call
    }
  };
  useEffect(() => {
    setLoading(true);

    FETCHPERMISSION();
  }, [pathname]);

  // 🔄 Fetch Expense Categories
  const fetchExpenseCategories = () => {
    api
      .get("/api/v1/admin/expenseCategory")
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data.data || [];
        setCategoryList(data);
      })
      .catch((err) => {
        console.error("Error fetching expense categories:", err);
        toast.error("Failed to fetch expense categories");
        setCategoryList([]);
      });
  };

  useEffect(() => {
    fetchExpenseCategories();
  }, []);

  // ✅ Toggle Active/Inactive
  const handleToggleActive = (id, currentStatus) => {
    const newStatus = currentStatus ? 0 : 1;

    setCategoryList((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, isActive: newStatus } : cat))
    );

    api
      .put(`/api/v1/admin/expenseCategory/${id}`, { isActive: newStatus })
      .then(() => {
        toast.success("Status updated successfully");
      })
      .catch((err) => {
        console.error("Update failed:", err);
        toast.error(err.response?.data?.message || "Failed to update status");
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
      toast.warning("Category name is required");
      return;
    }

    if (editId) {
      api
        .put(`/api/v1/admin/expenseCategory/${editId}`, { category })
        .then(() => {
          toast.success("Category updated successfully");
          fetchExpenseCategories();
          resetForm();
        })
        .catch((err) => {
          console.error("Error updating category:", err);
          toast.error(
            err.response?.data?.message || "Failed to update category"
          );
        });
    } else {
      api
        .post("/api/v1/admin/expenseCategory", { category })
        .then(() => {
          toast.success("Category added successfully");
          fetchExpenseCategories();
          resetForm();
        })
        .catch((err) => {
          console.error("Error adding category:", err);
          toast.error(err.response?.data?.message || "Failed to add category");
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
      .delete(`/api/v1/admin/expenseCategory/${deleteId}`)
      .then(() => {
        toast.success("Category deleted successfully");
        fetchExpenseCategories();
        setShowDelete(false);
      })
      .catch((err) => {
        console.error("Error deleting category:", err);
        toast.error(err.response?.data?.message || "Failed to delete category");
      });
  };

  const resetForm = () => {
    setShowAddEdit(false);
    setCategory("");
    setEditId(null);
  };

  // 🔹 Pagination Logic
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentData = categoryList.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(categoryList.length / rowsPerPage);

  //  Loader while checking permissions
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
              <h5 className="card-title fw-lighter">Expense Categories</h5>
              {permissions.add && (
                <Button
                  className="btn-primary"
                  onClick={() => setShowAddEdit(true)}
                >
                  + Add Category
                </Button>
              )}
            </Card.Header>

            <Card.Body className="px-0 pt-3">
              <div className="table-responsive">
                <Table hover responsive className="table">
                  <thead>
                    <tr className="table-gray">
                      <th>Sr. No.</th>
                      <th>Category</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center">
                          No Expense Categories available
                        </td>
                      </tr>
                    ) : (
                      currentData.map((item, idx) => (
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

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <Pagination className="justify-content-center mt-3">
                  <Pagination.First
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                  />
                  <Pagination.Prev
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                  />
                  {[...Array(totalPages)].map((_, i) => (
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
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
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
        value={category}
        setValue={setCategory}
        onSave={handleAddOrUpdate}
        modalTitle={
          editId ? "Update Expense Category" : "Add New Expense Category"
        }
        buttonLabel={editId ? "Update" : "Submit"}
        fieldLabel="Expense Category"
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
        modalTitle="Delete Expense Category"
        modalMessage={
          deleteIndex !== null && categoryList[deleteIndex]
            ? `Are you sure you want to delete "${categoryList[deleteIndex].category}"?`
            : ""
        }
      />

      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default ExpenseCategory;
