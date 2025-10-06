// Created by sufyan on 16 sep

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
import "react-toastify/dist/ReactToastify.css";
import CreateTwoToneIcon from "@mui/icons-material/CreateTwoTone";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import AddEditModal from "./addStockMaterial";
import DeleteModal from "./DeleteModal";
import api from "../../../../api/axios";
import { useLocation, useNavigate } from "react-router";
import { successToast } from "../../../../components/Toast/successToast";
import { errorToast } from "../../../../components/Toast/errorToast";
import * as Yup from "yup";
import { useFormik } from "formik";
import ViewModal from "./ViewModal"; // Assuming ViewModal.jsx is in the same directory
import VisibilityIcon from "@mui/icons-material/Visibility";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
const StockMaterialList = () => {
  const [userlist, setUserlist] = useState([]);
  const [invCatData, setInvCatData] = useState([]);
  const [editId, setEditId] = useState(null);
  const [showAddEdit, setShowAddEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const { pathname } = useLocation();
  const [permissions, setPermissions] = useState(null);
  const [showView, setShowView] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const navigate = useNavigate();

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentData = userlist.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(userlist.length / rowsPerPage);

  const [loading, setLoading] = useState(true);

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
      setLoading(false); // ✅ Stop loader after API call
    }
  };

  useEffect(() => {
    setLoading(true); // reset loader each time route changes
    FETCHPERMISSION();
  }, [pathname]);

  // Fetch stock material
  const fetchStockMaterial = () => {
    api
      .get("/api/v1/admin/stockMaterial")
      .then((res) => {
        if (Array.isArray(res.data)) {
          setUserlist(res.data);
        } else if (Array.isArray(res.data.data)) {
          setUserlist(res.data.data);
        } else {
          setUserlist([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching stock material:", err);
        setUserlist([]);
      });
  };

  // Fetch inventory category
  const fetchInventoryCategory = () => {
    api
      .get("/api/v1/admin/inventoryCategory")
      .then((res) => {
        if (Array.isArray(res.data)) {
          setInvCatData(res.data);
        } else if (Array.isArray(res.data.data)) {
          setInvCatData(res.data.data);
        } else {
          setInvCatData([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching inventory category:", err);
        setInvCatData([]);
      });
  };

  useEffect(() => {
    fetchStockMaterial();
    fetchInventoryCategory();
  }, []);

  // Toggle Active/Inactive with optimistic update
  const handleToggleActive = (id, currentStatus) => {
    const newStatus = !currentStatus;

    // Optimistic UI update
    setUserlist((prev) =>
      prev.map((dept) =>
        dept.id === id ? { ...dept, isActive: newStatus } : dept
      )
    );

    api
      .put(`/api/v1/admin/stockMaterial/${id}`, { isActive: newStatus })
      .then(() => {
        successToast("Status updated successfully");
      })
      .catch((err) => {
        console.error("Update failed:", err);
        errorToast(err.response?.data?.message || "Failed to update status");
        // Rollback if API fails
        setUserlist((prev) =>
          prev.map((dept) =>
            dept.id === id ? { ...dept, isActive: currentStatus } : dept
          )
        );
      });
  };

  const handleEdit = (id) => {
    navigate(`/update-stock-material-list/${id}`);
  };

  const handleDeleteConfirm = () => {
    if (!deleteId) return;
    setLoadingBtn(true);
    api
      .delete(`/api/v1/admin/stockMaterial/${deleteId}`)
      .then(() => {
        successToast("Stock Material deleted successfully");
        fetchStockMaterial();
        setShowDelete(false);
      })
      .catch((err) => {
        console.error("Error deleting stock material:", err);
        errorToast(
          err.response?.data?.message || "Failed to delete stock material"
        );
      })
      .finally(() => {
        setLoadingBtn(false);
      });
  };

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
              <h5 className="card-title fw-lighter">Stock Material</h5>
              {permissions.add && (
                <Button
                  className="btn-primary"
                  onClick={() => navigate("/add-stock-material-list")}
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
                      <th>Material Name</th>
                      {/* <th>Purchase Rate</th> */}
                      {/* <th>Rate</th> */}
                      {/* <th>HSN/SAC</th> */}
                      {/* <th>Usage Unit</th> */}
                      {/* <th>Inventory Category</th> */}
                      {/* <th>Balance</th> */}
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userlist.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center">
                          No Stock Material Available
                        </td>
                      </tr>
                    ) : (
                      currentData.map((item, idx) => (
                        <tr key={item.id || item._id}>
                          <td>{idx + 1}</td>
                          <td>{item.material}</td>
                          {/* <td>{item?.purchaseRate}</td>
                          <td>{item?.rate}</td>
                          <td>{item?.hsc}</td>
                          <td>{item?.unit}</td> */}
                          {/* <td>{item.category.category}</td> */}
                          {/* <td>{item.balance}</td> */}
                          <td style={{ minWidth: "90px" }}>
                            <span
                              className={`status-dot ${
                                item.isActive ? "active" : "inactive"
                              }`}
                            ></span>
                            {item.isActive ? "Active" : "Inactive"}
                          </td>
                          <td className="d-flex align-items-center">
                            <Form.Check
                              type="switch"
                              id={`active-switch-${item.id}`}
                              checked={item.isActive === true}
                              onChange={() =>
                                handleToggleActive(item.id, item.isActive)
                              }
                            />
                            <VisibilityIcon
                              onClick={() => {
                                setSelectedItem(item);
                                setShowView(true);
                              }}
                              color="primary"
                              style={{
                                cursor: "pointer",
                                marginLeft: "2px",
                              }}
                            />
                            {permissions.edit && (
                              <CreateTwoToneIcon
                                onClick={() => handleEdit(item.id)}
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

                            <FormatListNumberedIcon
                              variant="outline-secondary"
                              size="sm"
                              style={{ marginLeft: "5px" }}
                              onClick={() =>
                                navigate(`/SerialNumberTable/${item.id}`)
                              }
                            />
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </div>

              {/* 🔹 Pagination Controls */}
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
      {/* <AddEditModal
        show={showAddEdit}
        handleClose={handleResetForm}
        onSave={handleSubmit}
        modalTitle={editId ? "Update Stock Material" : "Add New Stock Material"}
        buttonLabel={editId ? "Update" : "Save"}
        loading={loadingBtn}
        formik={formik}
        invCatData={invCatData}
      /> */}
      {/* Delete Confirmation Modal */}
      <DeleteModal
        show={showDelete}
        handleClose={() => {
          setShowDelete(false);
          setDeleteIndex(null);
          setDeleteId(null);
        }}
        onConfirm={handleDeleteConfirm}
        modalTitle="Delete Stock Material"
        modalMessage={
          deleteIndex !== null && userlist[deleteIndex]
            ? `Are you sure you want to delete the stock material" ${userlist[deleteIndex].material}"?`
            : ""
        }
        loading={loadingBtn}
      />

      <ViewModal
        show={showView}
        handleClose={() => setShowView(false)}
        item={selectedItem}
      />
    </>
  );
};

export default StockMaterialList;
