import React, { useState, useEffect } from "react";
import { Card, Row, Col, Button, Form } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CreateTwoToneIcon from "@mui/icons-material/CreateTwoTone";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import AddEditModal from "./add-edit-modal";
import DeleteModal from "./delete-modal";
import api from "../../../../api/axios"; // adjust path

const LeadSourceList = () => {
  const [leadSources, setLeadSources] = useState([]);
  const [formData, setFormData] = useState({ lead_source: "" });
  const [editId, setEditId] = useState(null);

  const [showAddEdit, setShowAddEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // ✅ Fetch list from API
  const fetchLeadSources = async () => {
    try {
      const res = await api.get("/api/v1/admin/leadSource"); // GET API
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

  // ✅ Save or Update
  const handleSave = async (data) => {
    try {
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
  const handleToggleActive = (id, currentStatus) => {
    const newStatus = currentStatus === 1 ? 0 : 1;

    // Optimistic UI update
    setLeadSources((prev) =>
      prev.map((src) => (src.id === id ? { ...src, isActive: newStatus } : src))
    );

    api
      .put(`/api/v1/admin/leadSource/${id}`, { isActive: newStatus })
      .then(() => {
        toast.success("Status updated successfully");
      })
      .catch((err) => {
        console.error("Update failed:", err);
        toast.error("Failed to update status");
        // Rollback if API fails
        setLeadSources((prev) =>
          prev.map((src) =>
            src.id === id ? { ...src, isActive: currentStatus } : src
          )
        );
      });
  };

  return (
    <>
      <Row>
        <Col sm="12">
          <Card>
            <Card.Header className="d-flex justify-content-between">
              <h4 className="card-title">Lead Source List</h4>
              <Button
                className="btn-primary"
                onClick={() => {
                  setFormData({ lead_source: "" });
                  setEditId(null);
                  setShowAddEdit(true);
                }}
              >
                + Add Lead Source
              </Button>
            </Card.Header>

            <Card.Body className="px-0">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Sr. No.</th>
                      <th>Lead Source</th>
                      <th>Status</th>
                      {/* <th>Created At</th> */}
                      {/* <th>Updated At</th> */}
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leadSources.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center">
                          No Lead Sources Available
                        </td>
                      </tr>
                    ) : (
                      leadSources.map((item, idx) => (
                        <tr key={item.id}>
                          <td>{idx + 1}</td>
                          <td>{item.lead_source}</td>
                          <td>{item.isActive ? "Active" : "Inactive"}</td>
                          {/* <td>{new Date(item.created_at).toLocaleString()}</td> */}
                          {/* <td>{new Date(item.updated_at).toLocaleString()}</td> */}
                          <td className="d-flex align-items-center">
                            <Form.Check
                              type="switch"
                              id={`active-switch-${item.id}`}
                              checked={
                                item.isActive === 1 || item.isActive === true
                              } // ✅ works with 1 or true
                              onChange={() =>
                                handleToggleActive(item.id, item.isActive)
                              }
                              className="me-3"
                            />
                            <CreateTwoToneIcon
                              className="me-2"
                              onClick={() => handleEdit(item.id)}
                              color="primary"
                              style={{ cursor: "pointer" }}
                            />
                            <DeleteRoundedIcon
                              onClick={() => {
                                setDeleteId(item.id);
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
                </table>
              </div>
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
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default LeadSourceList;
