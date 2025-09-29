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
import { Slide, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CreateTwoToneIcon from "@mui/icons-material/CreateTwoTone";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import AddEditModal from "./add-edit-modal";
import DeleteModal from "./delete-modal";
import api from "../../../../api/axios";

const UnitList = () => {
  const { pathname } = useLocation();
  const [permissions, setPermissions] = useState(null);

  const [units, setUnits] = useState([]);
  const [formData, setFormData] = useState({ unit: "" });
  const [editId, setEditId] = useState(null);

  const [showAddEdit, setShowAddEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [loading, setLoading] = useState(true);

  // Fetch Permission
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
      const matchedPermission = data.find(
        (perm) =>
          String(perm.role_id) === roleId &&
          perm.display_name === "Unit List"
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
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    FETCHPERMISSION();
  }, []);

  // Fetch list
  const fetchUnits = async () => {
    try {
      const res = await api.get("/api/v1/admin/unit");
      if (Array.isArray(res.data)) {
        setUnits(res.data);
      } else if (Array.isArray(res.data.data)) {
        setUnits(res.data.data);
      } else {
        setUnits([]);
      }
    } catch (err) {
      console.error("Error fetching units", err);
    }
  };

  useEffect(() => {
    fetchUnits();
  }, []);

  // Save
  const handleSave = async (data) => {
    try {
      // Duplicate check
      const isDuplicate = units.some(
        (item) =>
          item.unit.toLowerCase().trim() === data.unit.toLowerCase().trim() &&
          item.id !== editId
      );
      if (isDuplicate) {
        toast.error("Unit already exists!");
        return;
      }

      if (editId) {
        await api.put(`/api/v1/admin/unit/${editId}`, data);
        toast.success("Unit updated successfully");
      } else {
        await api.post("/api/v1/admin/unit", data);
        toast.success("Unit added successfully");
      }

      fetchUnits();
      setShowAddEdit(false);
      setFormData({ unit: "" });
      setEditId(null);
    } catch (err) {
      console.error("Error saving unit", err);
      toast.error("Failed to save unit");
    }
  };

  // Edit
  const handleEdit = (id) => {
    const req = units.find((x) => x.id === id);
    setFormData({ unit: req.unit });
    setEditId(id);
    setShowAddEdit(true);
  };

  // Delete
  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/api/v1/admin/unit/${deleteId}`);
      toast.success("Unit deleted successfully");
      fetchUnits();
      setShowDelete(false);
      setDeleteId(null);
    } catch (err) {
      console.error("Error deleting unit", err);
      toast.error("Failed to delete unit");
    }
  };

  // Toggle Active/Inactive
  const handleToggleActive = async (id, currentStatus) => {
    const newStatus = Number(currentStatus) === 1 ? false : true;

    try {
      await api.put(`/api/v1/admin/unit/${id}`, {
        isActive: newStatus,
      });
      toast.success("Status updated successfully");
      fetchUnits();
    } catch (err) {
      console.error("Update failed:", err);
      toast.error("Failed to update status");
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = units.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(units.length / itemsPerPage);

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
              <h5 className="card-title">Units</h5>
              {permissions.add && (
                <Button
                  className="btn-primary"
                  onClick={() => {
                    setFormData({ unit: "" });
                    setEditId(null);
                    setShowAddEdit(true);
                  }}
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
                      <th>Unit</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center">
                          No Units Available
                        </td>
                      </tr>
                    ) : (
                      currentItems.map((item, idx) => (
                        <tr key={item.id}>
                          <td>{indexOfFirstItem + idx + 1}</td>
                          <td>{item.unit}</td>
                          <td style={{ minWidth: "50px" }}>
                            <span
                              className={`status-dot ${
                                item.isActive ? "active" : "inactive"
                              }`}
                              style={{ marginRight: "6px" }}
                            ></span>
                            <span
                              style={{ display: "inline-block", width: "60px" }}
                            >
                              {Number(item.isActive) === 1
                                ? "Active"
                                : "Inactive"}
                            </span>
                          </td>
                          <td className="d-flex align-items-center">
                            <Form.Check
                              type="switch"
                              id={`active-switch-${item.id}`}
                              checked={Number(item.isActive) === 1}
                              onChange={() =>
                                handleToggleActive(item.id, item.isActive)
                              }
                            />
                            {permissions.edit && (
                              <CreateTwoToneIcon
                                className="ms-2"
                                onClick={() => handleEdit(item.id)}
                                color="primary"
                                style={{ cursor: "pointer" }}
                              />
                            )}
                            {permissions.del && (
                              <DeleteRoundedIcon
                                className="ms-2"
                                onClick={() => {
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
        handleClose={() => setShowAddEdit(false)}
        formData={formData}
        setFormData={setFormData}
        onSave={handleSave}
        editData={!!editId}
      />

      {/* Delete Modal */}
      <DeleteModal
        show={showDelete}
        handleClose={() => setShowDelete(false)}
        onConfirm={handleDeleteConfirm}
        modalTitle="Delete Unit"
        modalMessage={
          deleteId
            ? `Are you sure you want to delete unit "${
                units.find((x) => x.id === deleteId)?.unit
              }"?`
            : ""
        }
      />

      <ToastContainer
        position="top-right"
        transition={Slide}
        autoClose={3000}
      />
    </>
  );
};

export default UnitList;
