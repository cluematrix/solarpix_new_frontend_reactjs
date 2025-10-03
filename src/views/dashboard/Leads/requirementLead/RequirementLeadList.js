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

const RequirementLeadList = () => {
  const { pathname } = useLocation();
  const [permissions, setPermissions] = useState(null);

  const [requirementLeads, setRequirementLeads] = useState([]);
  const [formData, setFormData] = useState({ requirement_name: "" });
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
          perm.display_name === "Requirement Lead List"
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
  const fetchRequirementLeads = async () => {
    try {
      const res = await api.get("/api/v1/admin/requirementLead");
      if (Array.isArray(res.data)) {
        setRequirementLeads(res.data);
      } else if (Array.isArray(res.data.data)) {
        setRequirementLeads(res.data.data);
      } else {
        setRequirementLeads([]);
      }
    } catch (err) {
      console.error("Error fetching requirement leads", err);
    }
  };

  useEffect(() => {
    fetchRequirementLeads();
  }, []);

  // Save
  const handleSave = async (data) => {
    try {
      // Duplicate check
      const isDuplicate = requirementLeads.some(
        (item) =>
          item.requirement_name.toLowerCase().trim() ===
            data.requirement_name.toLowerCase().trim() && item.id !== editId
      );
      if (isDuplicate) {
        toast.error("Requirement Lead already exists!");
        return;
      }

      if (editId) {
        await api.put(`/api/v1/admin/requirementLead/${editId}`, data);
        toast.success("Requirement Lead updated successfully");
      } else {
        await api.post("/api/v1/admin/requirementLead", data);
        toast.success("Requirement Lead added successfully");
      }

      fetchRequirementLeads();
      setShowAddEdit(false);
      setFormData({ requirement_name: "" });
      setEditId(null);
    } catch (err) {
      console.error("Error saving requirement lead", err);
      toast.error("Failed to save requirement lead");
    }
  };

  // Edit
  const handleEdit = (id) => {
    const req = requirementLeads.find((x) => x.id === id);
    setFormData({ requirement_name: req.requirement_name });
    setEditId(id);
    setShowAddEdit(true);
  };

  // Delete
  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/api/v1/admin/requirementLead/${deleteId}`);
      toast.success("Requirement Lead deleted successfully");
      fetchRequirementLeads();
      setShowDelete(false);
      setDeleteId(null);
    } catch (err) {
      console.error("Error deleting requirement lead", err);
      toast.error("Failed to delete requirement lead");
    }
  };

  // Toggle Active/Inactive
  const handleToggleActive = async (id, currentStatus) => {
    const newStatus = Number(currentStatus) === 1 ? false : true;

    try {
      await api.put(`/api/v1/admin/requirementLead/${id}`, {
        isActive: newStatus,
      });
      toast.success("Status updated successfully");
      fetchRequirementLeads();
    } catch (err) {
      console.error("Update failed:", err);
      toast.error("Failed to update status");
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = requirementLeads.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(requirementLeads.length / itemsPerPage);

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
              <h5 className="card-title">Requirement</h5>
              {permissions.add && (
                <Button
                  className="btn-primary"
                  onClick={() => {
                    setFormData({ requirement_name: "" });
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
                      <th>Requirement Lead</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center">
                          No Requirement Leads Available
                        </td>
                      </tr>
                    ) : (
                      currentItems.map((item, idx) => (
                        <tr key={item.id}>
                          <td>{indexOfFirstItem + idx + 1}</td>
                          <td>{item.requirement_name}</td>
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
        modalTitle="Delete Requirement Lead"
        modalMessage={
          deleteId
            ? `Are you sure you want to delete requirement lead "${
                requirementLeads.find((x) => x.id === deleteId)
                  ?.requirement_name
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

export default RequirementLeadList;
