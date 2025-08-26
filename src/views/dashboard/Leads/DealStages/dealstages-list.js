import React, { useState, useEffect } from "react";
import { Card, Row, Col, Button, Form } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CreateTwoToneIcon from "@mui/icons-material/CreateTwoTone";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import AddEditModal from "./add-edit-modal";
import DeleteModal from "./delete-modal";
import api from "../../../../api/axios"; // adjust path

const DealStagesList = () => {
  const [dealStages, setDealStages] = useState([]);
  const [formData, setFormData] = useState({ deal_stages: "", color: "" });
  const [editId, setEditId] = useState(null);

  const [showAddEdit, setShowAddEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // ✅ Fetch list from API
  const fetchDealStages = async () => {
    try {
      const res = await api.get("/api/v1/admin/dealStages");
      if (Array.isArray(res.data)) {
        setDealStages(res.data);
      } else if (Array.isArray(res.data.data)) {
        setDealStages(res.data.data);
      } else {
        setDealStages([]);
      }
    } catch (err) {
      console.error("Error fetching deal stages", err);
    }
  };

  useEffect(() => {
    fetchDealStages();
  }, []);

  // ✅ Save or Update
  const handleSave = async (data) => {
    try {
      if (editId) {
        await api.put(`/api/v1/admin/dealStages/${editId}`, data);
        toast.success("Deal Stage updated successfully");
      } else {
        await api.post("/api/v1/admin/dealStages", data);
        toast.success("Deal Stage added successfully");
      }
      fetchDealStages();
      setShowAddEdit(false);
      setFormData({ deal_stages: "", color: "" });
      setEditId(null);
    } catch (err) {
      console.error("Error saving deal stage", err);
      toast.error("Failed to save deal stage");
    }
  };

  // ✅ Edit
  const handleEdit = (id) => {
    const stage = dealStages.find((x) => x.id === id);
    setFormData({ deal_stages: stage.deal_stages, color: stage.color });
    setEditId(id);
    setShowAddEdit(true);
  };

  // ✅ Delete
  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/api/v1/admin/dealStages/${deleteId}`);
      toast.success("Deal Stage deleted successfully");
      fetchDealStages();
      setShowDelete(false);
      setDeleteId(null);
    } catch (err) {
      console.error("Error deleting deal stage", err);
      toast.error("Failed to delete deal stage");
    }
  };

  return (
    <>
      <Row>
        <Col sm="12">
          <Card>
            <Card.Header className="d-flex justify-content-between">
              <h4 className="card-title">Deal Stages List</h4>
              <Button
                className="btn-primary"
                onClick={() => {
                  setFormData({ deal_stages: "", color: "" });
                  setEditId(null);
                  setShowAddEdit(true);
                }}
              >
                + Add Deal Stage
              </Button>
            </Card.Header>

            <Card.Body className="px-0">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Sr. No.</th>
                      <th>Deal Stage</th>
                      <th>Color</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dealStages.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center">
                          No Deal Stages Available
                        </td>
                      </tr>
                    ) : (
                      dealStages.map((item, idx) => (
                        <tr key={item.id}>
                          <td>{idx + 1}</td>
                          <td>{item.deal_stages}</td>
                          <td>
                            <span
                              style={{
                                backgroundColor: item.color,
                                padding: "5px 15px",
                                borderRadius: "5px",
                                color: "#fff",
                              }}
                            >
                              {item.color}
                            </span>
                          </td>
                          <td className="d-flex align-items-center">
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
        modalTitle="Delete Deal Stage"
        modalMessage={
          deleteId
            ? `Are you sure you want to delete deal stage "${
                dealStages.find((x) => x.id === deleteId)?.deal_stages
              }"?`
            : ""
        }
      />

      {/* Toast */}
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default DealStagesList;
