import React, { useState, useEffect } from "react";
import { useLocation } from "react-router";
import {
  Card,
  Row,
  Col,
  Button,
  Form,
  Pagination,
  Spinner,
  Table,
} from "react-bootstrap";
import { Slide, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CreateTwoToneIcon from "@mui/icons-material/CreateTwoTone";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import AddEditModal from "./add-edit-modal";
import DeleteModal from "./delete-modal";
import api from "../../../../api/axios"; // adjust path
import AddIcon from "@mui/icons-material/Add";

const LeadSourceList = () => {
  const { pathname } = useLocation();
  const [permissions, setPermissions] = useState(null);

  const [leadSources, setLeadSources] = useState([]);
  const [formData, setFormData] = useState({ lead_source: "" });
  const [editId, setEditId] = useState(null);

  const [showAddEdit, setShowAddEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // 🔹 Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

      console.log("data", data);
      const matchedPermission = data.find(
        (perm) =>
          String(perm.role_id) === roleId &&
          perm.display_name === "Lead Source List"
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

  // ✅ Fetch list from API
  const fetchLeadSources = async () => {
    try {
      const res = await api.get("/api/v1/admin/leadSource");
      if (Array.isArray(res.data)) {
        setLeadSources(res.data);
      } else if (Array.isArray(res.data.data)) {
        setLeadSources(res.data.data);
      } else {
        setLeadSources([]);
      }
    } catch (err) {
      console.error("Error fetching lead sources", err);
    }
  };

  useEffect(() => {
    fetchLeadSources();
  }, []);

  const handleSave = async (data) => {
    try {
      // 🔹 Check if lead_source already exists (case-insensitive)
      const isDuplicate = leadSources.some(
        (item) =>
          item.lead_source.toLowerCase().trim() ===
            data.lead_source.toLowerCase().trim() && item.id !== editId // allow same name for the one being edited
      );

      if (isDuplicate) {
        toast.error("Lead Source already exists!");
        return;
      }

      if (editId) {
        await api.put(`/api/v1/admin/leadSource/${editId}`, data);
        toast.success("Lead Source updated successfully");
      } else {
        await api.post("/api/v1/admin/leadSource", data);
        toast.success("Lead Source added successfully");
      }

      fetchLeadSources();
      setShowAddEdit(false);
      setFormData({ lead_source: "" });
      setEditId(null);
    } catch (err) {
      console.error("Error saving lead source", err);
      toast.error("Failed to save lead source");
    }
  };

  // ✅ Edit
  const handleEdit = (id) => {
    const source = leadSources.find((x) => x.id === id);
    setFormData({ lead_source: source.lead_source });
    setEditId(id);
    setShowAddEdit(true);
  };

  // ✅ Delete
  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/api/v1/admin/leadSource/${deleteId}`);
      toast.success("Lead Source deleted successfully");
      fetchLeadSources();
      setShowDelete(false);
      setDeleteId(null);
    } catch (err) {
      console.error("Error deleting lead source", err);
      toast.error("Failed to delete lead source");
    }
  };

  // ✅ Toggle Active/Inactive
  const handleToggleActive = async (id, currentStatus) => {
    const newStatus = Number(currentStatus) === 1 ? false : true; // send boolean

    try {
      await api.put(`/api/v1/admin/leadSource/${id}`, { isActive: newStatus });
      toast.success("Status updated successfully");
      fetchLeadSources();
    } catch (err) {
      console.error("Update failed:", err);
      toast.error("Failed to update status");
    }
  };

  // 🔹 Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = leadSources.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(leadSources.length / itemsPerPage);

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
              <h5 className="card-title">Lead Sources </h5>
              {permissions.add && (
                <Button
                  className="btn-primary"
                  onClick={() => {
                    setFormData({ lead_source: "" });
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
                      <th>Lead Source</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center">
                          No Lead Sources Available
                        </td>
                      </tr>
                    ) : (
                      currentItems.map((item, idx) => (
                        <tr key={item.id}>
                          <td>{indexOfFirstItem + idx + 1}</td>
                          <td>{item.lead_source}</td>
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
                                className=""
                                onClick={() => handleEdit(item.id)}
                                color="primary"
                                style={{ cursor: "pointer" }}
                              />
                            )}
                            {permissions.del && (
                              <DeleteRoundedIcon
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
        modalTitle="Delete Lead Source"
        modalMessage={
          deleteId
            ? `Are you sure you want to delete lead source "${
                leadSources.find((x) => x.id === deleteId)?.lead_source
              }"?`
            : ""
        }
      />

      {/* Toast */}
      <ToastContainer
        position="top-right"
        transition={Slide}
        autoClose={3000}
      />
    </>
  );
};

export default LeadSourceList;
