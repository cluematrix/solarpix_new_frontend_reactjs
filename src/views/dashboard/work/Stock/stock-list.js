import React, { useState, useEffect } from "react";
import { useLocation } from "react-router";
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
import AddEditStockModal from "./add-edit-modal";
import DeleteModal from "./delete-modal";
import api from "../../../../api/axios";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";

const StockList = () => {
  const { pathname } = useLocation(); // ✅ moved inside component
  const [permissions, setPermissions] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔑 Fetch Permission
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

  const [stockList, setStockList] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    item_name: "",
    price: "",
    purchase_date: "",
    stock: "",
    description: "",
    attachment: null,
    isActive: true,
  });
  const [editData, setEditData] = useState(null);
  const [showAddEdit, setShowAddEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    fetchStockList();
  }, []);

  const fetchStockList = async () => {
    try {
      const res = await api.get("/api/v1/admin/stock");
      let stocks = [];

      if (Array.isArray(res.data.data)) stocks = res.data.data;
      else if (res.data.data) stocks = [res.data.data];
      else if (Array.isArray(res.data)) stocks = res.data;
      else if (res.data) stocks = [res.data];

      setStockList(stocks);
    } catch (error) {
      console.error("Error fetching stock:", error);
      toast.error("Failed to fetch stock list");
    }
  };

  const resetForm = () => {
    setFormData({
      id: "",
      item_name: "",
      price: "",
      purchase_date: "",
      stock: "",
      description: "",
      attachment: null,
      isActive: true,
    });
    setEditData(null);
  };

  const handleSave = async (data) => {
    if (!data.item_name || !data.price) {
      toast.warning("Item Name and Price are required");
      return;
    }

    try {
      const formDataToSend = new FormData();

      for (const key in data) {
        if (data[key] !== null && data[key] !== undefined) {
          if (key === "attachment" && data[key] instanceof File) {
            formDataToSend.append(key, data[key], data[key].name);
          } else {
            formDataToSend.append(key, data[key]);
          }
        }
      }

      if (editData) {
        await api.put(`/api/v1/admin/stock/${data.id}`, formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Stock updated successfully");
      } else {
        await api.post("/api/v1/admin/stock", formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Stock added successfully");
      }

      fetchStockList();
      setShowAddEdit(false);
      resetForm();
    } catch (error) {
      console.error("Error saving stock:", error.response?.data || error);
      toast.error(error.response?.data?.message || "Failed to save stock");
    }
  };

  const handleEdit = (index) => {
    const item = stockList[index];
    setFormData({ ...item, attachment: null }); // reset file when editing
    setEditData(item);
    setShowAddEdit(true);
  };

  const handleToggleActive = async (id, currentStatus) => {
    const newStatus = !currentStatus;

    setStockList((prev) =>
      prev.map((stock) =>
        stock.id === id ? { ...stock, isActive: newStatus } : stock
      )
    );

    try {
      await api.put(`/api/v1/admin/stock/${id}`, { isActive: newStatus });
      toast.success("Status updated successfully");
    } catch (err) {
      console.error("Update failed:", err);
      toast.error(err.response?.data?.message || "Failed to update status");

      setStockList((prev) =>
        prev.map((stock) =>
          stock.id === id ? { ...stock, isActive: currentStatus } : stock
        )
      );
    }
  };

  const handleDeleteConfirm = async () => {
    if (deleteIndex !== null) {
      try {
        const id = stockList[deleteIndex].id;
        await api.delete(`/api/v1/admin/stock/${id}`);
        toast.success("Stock deleted successfully");
        fetchStockList();
      } catch (error) {
        console.error("Error deleting stock:", error);
        toast.error(error.response?.data?.message || "Failed to delete stock");
      }
    }
    setShowDelete(false);
    setDeleteIndex(null);
  };

  // Pagination
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentData = stockList.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(stockList.length / rowsPerPage);

  //  Loader while checking permissions
  if (loading) {
    return (
      <div className="loader-div">
        <Spinner animation="border" className="spinner" />
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

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <>
      <Row className="mt-4">
        <Col sm="12">
          <Card>
            <Card.Header className="d-flex justify-content-between">
              <h5 className="card-title fw-lighter">Stocks</h5>
              {permissions.add && (
                <Button
                  className="btn-primary"
                  onClick={() => {
                    resetForm();
                    setShowAddEdit(true);
                  }}
                >
                  + Add Stock
                </Button>
              )}
            </Card.Header>

            <Card.Body className="px-0">
              <div className="table-responsive">
                <Table hover responsive className="table">
                  <thead>
                    <tr className="table-gray">
                      <th>Sr. No.</th>
                      <th>Item Name</th>
                      <th>Price</th>
                      <th>Purchase Date</th>
                      <th>Stock</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="text-center">
                          No stock available
                        </td>
                      </tr>
                    ) : (
                      currentData.map((item, idx) => (
                        <tr key={item.id}>
                          <td>{indexOfFirst + idx + 1}</td>
                          <td>{item.item_name}</td>
                          <td>{item.price}</td>
                          <td>{item.purchase_date}</td>
                          <td>{item.stock}</td>
                          <td>
                            {item.isActive ? (
                              <span className="badge bg-success">Active</span>
                            ) : (
                              <span className="badge bg-danger">Inactive</span>
                            )}
                          </td>
                          <td className="d-flex align-items-center">
                            {item.attachment ? (
                              <RemoveRedEyeIcon
                                className="me-2"
                                onClick={() =>
                                  window.open(item.attachment, "_blank")
                                }
                                style={{ cursor: "pointer", color: "#0d6efd" }}
                              />
                            ) : (
                              "-"
                            )}
                            <Form.Check
                              type="switch"
                              id={`active-switch-${item.id}`}
                              checked={item.isActive}
                              onChange={() =>
                                handleToggleActive(item.id, item.isActive)
                              }
                            />

                            <CreateTwoToneIcon
                              className="me-2"
                              onClick={() => handleEdit(indexOfFirst + idx)}
                              color="primary"
                              style={{ cursor: "pointer" }}
                            />
                            <DeleteRoundedIcon
                              onClick={() => {
                                setDeleteIndex(indexOfFirst + idx);
                                setShowDelete(true);
                              }}
                              color="error"
                              style={{ cursor: "pointer" }}
                            />
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination className="justify-content-center mt-3">
                  <Pagination.Prev
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  />
                  {[...Array(totalPages)].map((_, i) => (
                    <Pagination.Item
                      key={i + 1}
                      active={i + 1 === currentPage}
                      onClick={() => handlePageChange(i + 1)}
                    >
                      {i + 1}
                    </Pagination.Item>
                  ))}
                  <Pagination.Next
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  />
                </Pagination>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Add/Edit Modal */}
      <AddEditStockModal
        show={showAddEdit}
        handleClose={() => {
          setShowAddEdit(false);
          resetForm();
        }}
        formData={formData}
        setFormData={setFormData}
        onSave={handleSave}
        editData={!!editData}
      />

      {/* Delete Modal */}
      <DeleteModal
        show={showDelete}
        handleClose={() => {
          setShowDelete(false);
          setDeleteIndex(null);
        }}
        onConfirm={handleDeleteConfirm}
        modalTitle="Delete Stock"
        modalMessage={
          deleteIndex !== null
            ? `Are you sure you want to delete "${stockList[deleteIndex].item_name}"?`
            : ""
        }
      />

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default StockList;
