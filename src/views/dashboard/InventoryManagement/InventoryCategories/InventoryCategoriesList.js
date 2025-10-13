// Created by Sufyan on 13 Sep — Updated by Rishi on 13 Oct

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
import InvCatAddEditModal from "./InvCatAddEditModal";
import DeleteModal from "./DeleteModal";
import api from "../../../../api/axios";
import { useLocation } from "react-router";
import { successToast } from "../../../../components/Toast/successToast";
import { errorToast } from "../../../../components/Toast/errorToast";

const InventoryCategoriesList = () => {
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
  const [loading, setLoading] = useState(true);

  // GST dropdown data
  const [intraList, setIntraList] = useState([]);
  const [interList, setInterList] = useState([]);
  const [selectedIntraId, setSelectedIntraId] = useState("");
  const [selectedInterId, setSelectedInterId] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentData = userlist.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(userlist.length / rowsPerPage);

  // Fetch permissions
  const FETCHPERMISSION = async () => {
    try {
      const res = await api.get("/api/v1/admin/rolePermission");
      let data = Array.isArray(res.data) ? res.data : res.data?.data || [];

      const roleId = String(sessionStorage.getItem("roleId"));
      const matchedPermission = data.find(
        (perm) =>
          String(perm.role_id) === roleId &&
          perm.display_name === "inventory-categories-list"
      );

      if (matchedPermission) {
        setPermissions({
          view: matchedPermission.view === true || matchedPermission.view === 1,
          add: matchedPermission.add === true || matchedPermission.add === 1,
          edit: matchedPermission.edit === true || matchedPermission.edit === 1,
          del: matchedPermission.del === true || matchedPermission.del === 1,
        });
      } else setPermissions(null);
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

  // Fetch inventory categories
  const fetchInventoryCategory = () => {
    api
      .get("/api/v1/admin/inventoryCategory")
      .then((res) => {
        const data = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.data)
          ? res.data.data
          : [];
        setUserlist(data);
      })
      .catch((err) => {
        console.error("Error fetching inventory category:", err);
        setUserlist([]);
      });
  };

  useEffect(() => {
    fetchInventoryCategory();
  }, []);

  // Fetch GST dropdown data
  const fetchGSTLists = async () => {
    try {
      const [intraRes, interRes] = await Promise.all([
        api.get("/api/v1/admin/intraTax"),
        api.get("/api/v1/admin/interTax"),
      ]);

      setIntraList(intraRes.data?.data || []);
      setInterList(interRes.data?.data || []);
    } catch (err) {
      console.error("Error fetching GST lists:", err);
      errorToast("Failed to load GST dropdowns");
    }
  };

  useEffect(() => {
    fetchGSTLists();
  }, []);

  // Toggle active/inactive
  const handleToggleActive = (id, currentStatus) => {
    const newStatus = !currentStatus;

    // Optimistic UI update
    setUserlist((prev) =>
      prev.map((dept) =>
        dept.id === id ? { ...dept, isActive: newStatus } : dept
      )
    );

    api
      .put(`/api/v1/admin/inventoryCategory/${id}`, { isActive: newStatus })
      .then(() => successToast("Status updated successfully"))
      .catch((err) => {
        console.error("Update failed:", err);
        errorToast(err.response?.data?.message || "Failed to update status");
        // rollback
        setUserlist((prev) =>
          prev.map((dept) =>
            dept.id === id ? { ...dept, isActive: currentStatus } : dept
          )
        );
      });
  };

  // Add or Update inventory
  const handleAddOrUpdateRole = (payload) => {
    setLoadingBtn(true);

    const apiCall = editId
      ? api.put(`/api/v1/admin/inventoryCategory/${editId}`, payload)
      : api.post("/api/v1/admin/inventoryCategory", payload);

    apiCall
      .then(() => {
        successToast(
          editId
            ? "Inventory updated successfully"
            : "Inventory added successfully"
        );
        fetchInventoryCategory();
        resetForm();
      })
      .catch((err) => {
        console.error("Error saving inventory:", err);
        errorToast(err.response?.data?.message || "Failed to save inventory");
      })
      .finally(() => setLoadingBtn(false));
  };

  const handleEdit = (index) => {
    const inventory = userlist[index];
    setRoleName(inventory.category);
    setSelectedIntraId(inventory.intra_id || "");
    setSelectedInterId(inventory.inter_id || "");
    setEditId(inventory.id || inventory._id);
    setShowAddEdit(true);
  };

  const handleDeleteConfirm = () => {
    if (!deleteId) return;
    setLoadingBtn(true);
    api
      .delete(`/api/v1/admin/inventoryCategory/${deleteId}`)
      .then(() => {
        successToast("Inventory category deleted successfully");
        fetchInventoryCategory();
        setShowDelete(false);
      })
      .catch((err) => {
        console.error("Error deleting inventory:", err);
        errorToast(err.response?.data?.message || "Failed to delete inventory");
      })
      .finally(() => setLoadingBtn(false));
  };

  const resetForm = () => {
    setShowAddEdit(false);
    setRoleName("");
    setEditId(null);
    setErrors(null);
    setSelectedIntraId("");
    setSelectedInterId("");
  };

  // Loader while checking permissions
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
              <h5 className="card-title fw-lighter">Inventory Categories</h5>
              {permissions.add && (
                <Button
                  className="btn-primary"
                  onClick={() => setShowAddEdit(true)}
                >
                  + New Inventory
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
                          No Inventory Categories Available
                        </td>
                      </tr>
                    ) : (
                      currentData.map((item, idx) => (
                        <tr key={item.id || item._id}>
                          <td>{idx + 1}</td>
                          <td>{item.category}</td>
                          <td>
                            <span
                              className={`status-dot ${
                                item.isActive ? "active" : "inactive"
                              }`}
                            ></span>
                            {item.isActive ? "Active" : "Inactive"}
                          </td>
                          <td className="d-flex align-items-center gap-2">
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

              {/* Pagination */}
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
      <InvCatAddEditModal
        show={showAddEdit}
        handleClose={resetForm}
        roleName={roleName}
        setRoleName={setRoleName}
        errors={errors}
        onSave={handleAddOrUpdateRole}
        modalTitle={
          editId ? "Update Inventory Category" : "Add New Inventory Category"
        }
        buttonLabel={editId ? "Update" : "Save"}
        loading={loadingBtn}
        intraList={intraList}
        interList={interList}
        selectedIntraId={selectedIntraId}
        setSelectedIntraId={setSelectedIntraId}
        selectedInterId={selectedInterId}
        setSelectedInterId={setSelectedInterId}
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
        modalTitle="Delete Inventory Category"
        modalMessage={
          deleteIndex !== null && userlist[deleteIndex]
            ? `Are you sure you want to delete "${userlist[deleteIndex].category}"?`
            : ""
        }
        loading={loadingBtn}
      />
    </>
  );
};

export default InventoryCategoriesList;
