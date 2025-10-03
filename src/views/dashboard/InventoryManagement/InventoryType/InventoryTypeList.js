// Created by sufyan on 01 Oct

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
import AddEditModal from "./AddEditModal";
import DeleteModal from "./DeleteModal";
import api from "../../../../api/axios";
import { useLocation } from "react-router";
import { successToast } from "../../../../components/Toast/successToast";
import { errorToast } from "../../../../components/Toast/errorToast";

const InventoryTypeList = () => {
  const [userlist, setUserlist] = useState([]);
  const [roleName, setRoleName] = useState("");
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState(null);
  const [showAddEdit, setShowAddEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const { pathname } = useLocation();
  const [permissions, setPermissions] = useState(null);

  // Pagination
  // 🔹 Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // same as backend limit
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);

  // const getrole = sessionStorage.getItem("roleId");
  //  PERMISSION CHECK

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

  // Fetch inventory type
  const fetchInvType = async (page = 1) => {
    try {
      setLoading(true);
      const res = await api.get(
        `/api/v1/admin/inventoryType/active/pagination?page=${page}&limit=${itemsPerPage}`
      );

      // ✅ Adjust this based on your backend response
      setUserlist(res.data?.data || []);
      setTotalPages(res.data?.totalPages || 1);
      // calculate totalCount from itemPerPage
      if (res.data?.pagination.total) {
        console.log("totalPageFun", res?.data?.pagination?.total);
        setTotalPages(Math.ceil(res?.data?.pagination?.total / itemsPerPage));
      }
    } catch (err) {
      console.error("Error fetching leads:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvType();
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
      .put(`/api/v1/admin/inventoryType/${id}`, { isActive: newStatus })
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

  // Add or Update inventory type
  const handleAddOrUpdateRole = () => {
    if (!roleName.trim()) {
      setErrors("Inventory name is required");
      return;
    }

    if (editId) {
      // Update
      setLoadingBtn(true);
      api
        .put(`/api/v1/admin/inventoryType/${editId}`, {
          type: roleName,
        })
        .then(() => {
          successToast("Inventory updated successfully");
          fetchInvType();
          resetForm();
          setErrors(null);
        })
        .catch((err) => {
          console.error("Error updating inventory:", err);
          errorToast(
            err.response?.data?.message || "Failed to update inventory"
          );
        })
        .finally(() => {
          setLoadingBtn(false);
        });
    } else {
      // Add
      setLoadingBtn(true);
      api
        .post("/api/v1/admin/inventoryType", { type: roleName })
        .then(() => {
          successToast("Inventory added successfully");
          fetchInvType();
          resetForm();
          setErrors(null);
        })
        .catch((err) => {
          console.error("Error adding inventory:", err);
          errorToast(err.response?.data?.message || "Failed to add inventory");
        })
        .finally(() => {
          setLoadingBtn(false);
        });
    }
  };

  const handleEdit = (index) => {
    const inventory = userlist[index];
    setRoleName(inventory.type);
    setEditId(inventory.id || inventory._id);
    setShowAddEdit(true);
  };

  const handleDeleteConfirm = () => {
    if (!deleteId) return;
    setLoadingBtn(true);
    api
      .delete(`/api/v1/admin/inventoryType/${deleteId}`)
      .then(() => {
        successToast("Inventory type deleted successfully");
        fetchInvType();
        setShowDelete(false);
      })
      .catch((err) => {
        console.error("Error deleting inventory:", err);
        errorToast(err.response?.data?.message || "Failed to delete inventory");
      })
      .finally(() => {
        setLoadingBtn(false);
      });
  };

  const resetForm = () => {
    setShowAddEdit(false);
    setRoleName("");
    setEditId(null);
    setErrors(null);
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
              <h5 className="card-title fw-lighter">Inventory Type</h5>
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
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userlist.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center">
                          No Inventory Type Available
                        </td>
                      </tr>
                    ) : (
                      userlist?.map((item, idx) => (
                        <tr key={item.id || item._id}>
                          <td>{idx + 1}</td>
                          <td>{item?.type}</td>
                          <td style={{ minWidth: "70px" }}>
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

                            {permissions.edit && (
                              <CreateTwoToneIcon
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

              {/* 🔹 Pagination Controls */}
              {totalPages > 1 && (
                <Pagination className="justify-content-center mt-3">
                  <Pagination.First
                    onClick={() => setCurrentPage(1)}
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
        roleName={roleName}
        setRoleName={setRoleName}
        errors={errors}
        onSave={handleAddOrUpdateRole}
        modalTitle={editId ? "Update Inventory Type" : "Add New Inventory Type"}
        buttonLabel={editId ? "Update" : "Save"}
        loading={loadingBtn}
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
        modalTitle="Delete Inventory Type"
        modalMessage={
          deleteIndex !== null && userlist[deleteIndex]
            ? `Are you sure you want to delete the inventory type "${userlist[deleteIndex].type}"?`
            : ""
        }
        loading={loadingBtn}
      />
    </>
  );
};

export default InventoryTypeList;
