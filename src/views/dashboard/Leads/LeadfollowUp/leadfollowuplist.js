import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Table,
  Spinner,
  Modal,
  Form,
} from "react-bootstrap";
import CreateTwoToneIcon from "@mui/icons-material/CreateTwoTone";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import AddEditModal from "./add-edit-modal";
import DeleteModal from "./delete-modal";
import api from "../../../../api/axios";
import EditNoteIcon from "@mui/icons-material/EditNote";
import ViewFollowupModal from "./ViewFollowupModal";
import VisibilityIcon from "@mui/icons-material/Visibility";

const LeadFollowupList = () => {
  const [followups, setFollowups] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    lead_id: "",
    message: "",
    followup_date: "",
    schedule_by_id: "",
  });

  const [editIndex, setEditIndex] = useState(null);
  const [showAddEdit, setShowAddEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const [showOutcome, setShowOutcome] = useState(false);
  const [outcomeData, setOutcomeData] = useState({
    followup_id: "",
    out_comes: "",
  });

  const loggedInEmployeeId = sessionStorage.getItem("employee_id");
  const [showView, setShowView] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [employees, setEmployees] = useState([]);

  // Filter states
  const [filterLead, setFilterLead] = useState("");
  const [filterFromDate, setFilterFromDate] = useState("");
  const [filterToDate, setFilterToDate] = useState("");
  const [filteredFollowups, setFilteredFollowups] = useState([]);

  // Fetch leads
  const fetchLeads = async () => {
    try {
      const res = await api.get("/api/v1/admin/lead/active");
      setLeads(Array.isArray(res.data?.data) ? res.data.data : res.data || []);
    } catch (err) {
      console.error("Error fetching leads:", err);
    }
  };

  // Fetch followups
  const fetchFollowups = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/v1/admin/followUp");
      const data = Array.isArray(res.data?.data)
        ? res.data.data
        : res.data || [];
      setFollowups(data);
      setFilteredFollowups(data);
    } catch (err) {
      console.error("Error fetching followups:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
    fetchFollowups();
  }, []);

  // Reset Add/Edit Form
  const resetForm = () => {
    setFormData({
      lead_id: "",
      message: "",
      followup_date: "",
      schedule_by_id: "",
    });
    setEditIndex(null);
  };

  // Filter followups
  useEffect(() => {
    let filtered = [...followups];

    if (filterLead) {
      filtered = filtered.filter((f) => {
        const leadName = leads.find((l) => l.id === f.lead_id)?.name || "";
        return leadName.toLowerCase().includes(filterLead.toLowerCase());
      });
    }

    if (filterFromDate) {
      filtered = filtered.filter((f) => f.followup_date >= filterFromDate);
    }

    if (filterToDate) {
      filtered = filtered.filter((f) => f.followup_date <= filterToDate);
    }

    setFilteredFollowups(filtered);
  }, [filterLead, filterFromDate, filterToDate, followups, leads]);

  // Open View Modal
  const openViewModal = (followup) => {
    setViewData(followup);
    setShowView(true);
  };

  // Handle Add/Edit
  const handleAddOrUpdate = async (data) => {
    try {
      if (!data.schedule_by_id && loggedInEmployeeId) {
        data.schedule_by_id = loggedInEmployeeId;
      }

      if (editIndex !== null) {
        await api.put(
          `/api/v1/admin/followUp/${followups[editIndex].id}`,
          data
        );
      } else {
        await api.post("/api/v1/admin/followUp", data);
      }
      fetchFollowups();
      setShowAddEdit(false);
      resetForm();
    } catch (err) {
      console.error("Error saving followup:", err);
    }
  };

  const handleEdit = (index) => {
    const f = followups[index];
    setFormData({
      lead_id: f.lead_id?.id || f.lead_id || "",
      message: f.message || "",
      followup_date: f.followup_date || "",
      schedule_by_id: f.schedule_by_id || "",
    });
    setEditIndex(index);
    setShowAddEdit(true);
  };

  const handleDeleteConfirm = async () => {
    if (deleteIndex !== null) {
      try {
        const item = followups[deleteIndex];
        await api.delete(`/api/v1/admin/followUp/${item.id}`);
        setFollowups(followups.filter((_, i) => i !== deleteIndex));
      } catch (err) {
        console.error("Error deleting followup:", err.response || err.message);
      }
    }
    setShowDelete(false);
    setDeleteIndex(null);
  };

  // Open Outcome modal
  const openOutcomeModal = (followup) => {
    setOutcomeData({
      followup_id: followup.id,
      out_comes: followup.out_comes || "",
    });
    setShowOutcome(true);
  };

  // Save Outcome
  const handleOutcomeSave = async () => {
    try {
      await api.put(`/api/v1/admin/followUp/${outcomeData.followup_id}`, {
        out_comes: outcomeData.out_comes,
      });
      fetchFollowups();
      setShowOutcome(false);
    } catch (err) {
      console.error("Error saving outcome:", err);
    }
  };

  return (
    <>
      {/* Filters */}
      <Row className="mb-3">
        <Col md={4}>
          <Form.Control
            type="text"
            placeholder="Search by Lead Name"
            value={filterLead}
            onChange={(e) => setFilterLead(e.target.value)}
          />
        </Col>
        <Col md={2}>
          <Form.Control
            type="date"
            placeholder="From Date"
            value={filterFromDate}
            onChange={(e) => setFilterFromDate(e.target.value)}
          />
        </Col>
        <Col md={2}>
          <Form.Control
            type="date"
            placeholder="To Date"
            value={filterToDate}
            onChange={(e) => setFilterToDate(e.target.value)}
          />
        </Col>
        <Col md={3}>
          <Button
            variant="primary"
            className=" mt-1"
            style={{ width: "90px" }} // Set width to 60px
            onClick={() => {
              setFilterLead("");
              setFilterFromDate("");
              setFilterToDate("");
            }}
          >
            Reset
          </Button>
        </Col>
      </Row>

      <Row className="mt-2">
        <Col sm="12">
          <Card>
            <Card.Header className="d-flex justify-content-between">
              <h5 className="card-title fw-lighter">Lead Follow-ups</h5>
              <Button
                className="btn-primary"
                onClick={() => {
                  resetForm();
                  setShowAddEdit(true);
                }}
              >
                + Add Follow-up
              </Button>
            </Card.Header>

            <Card.Body className="px-0">
              {loading ? (
                <div className="text-center py-3">
                  <Spinner animation="border" />
                </div>
              ) : (
                <div className="table-responsive">
                  <Table hover responsive className="table">
                    <thead>
                      <tr className="table-gray">
                        <th>Sr. No.</th>
                        <th>Lead Name</th>
                        <th>Message</th>
                        <th>FollowUp Date</th>
                        <th>Outcome</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredFollowups.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="text-center">
                            No follow-ups available
                          </td>
                        </tr>
                      ) : (
                        filteredFollowups.map((item, idx) => (
                          <tr key={item.id}>
                            <td>{idx + 1}</td>
                            <td>
                              {item.lead_id?.name ||
                                leads.find((l) => l.id === item.lead_id)
                                  ?.name ||
                                "—"}
                            </td>
                            <td>{item.message}</td>
                            <td>{item.followup_date}</td>
                            <td>{item.out_comes || "—"}</td>
                            <td>
                              <VisibilityIcon
                                color="info"
                                size="sm"
                                className="me-2"
                                onClick={() => openViewModal(item)}
                              />
                              <CreateTwoToneIcon
                                className="me-2"
                                onClick={() => handleEdit(idx)}
                                color="primary"
                                style={{ cursor: "pointer" }}
                              />
                              <EditNoteIcon
                                variant="info"
                                size="sm"
                                className="me-2"
                                onClick={() => openOutcomeModal(item)}
                              />
                              <DeleteRoundedIcon
                                onClick={() => {
                                  setDeleteIndex(idx);
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
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modals */}
      <AddEditModal
        show={showAddEdit}
        handleClose={() => {
          setShowAddEdit(false);
          resetForm();
        }}
        formData={formData}
        setFormData={setFormData}
        onSave={handleAddOrUpdate}
        editData={editIndex !== null}
        leads={leads}
      />

      <DeleteModal
        show={showDelete}
        handleClose={() => {
          setShowDelete(false);
          setDeleteIndex(null);
        }}
        onConfirm={handleDeleteConfirm}
        modalTitle="Delete Follow-up"
        modalMessage={
          deleteIndex !== null
            ? `Are you sure you want to delete follow-up "${followups[deleteIndex].message}"?`
            : ""
        }
      />

      <ViewFollowupModal
        show={showView}
        handleClose={() => setShowView(false)}
        followup={viewData}
        leads={leads}
        employees={employees}
      />

      <Modal
        show={showOutcome}
        onHide={() => setShowOutcome(false)}
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Follow-up Outcome</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Lead Name</Form.Label>
            <Form.Control
              type="text"
              value={
                leads.find(
                  (l) =>
                    l.id ===
                    followups.find((f) => f.id === outcomeData.followup_id)
                      ?.lead_id
                )?.name || "—"
              }
              readOnly
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Outcome</Form.Label>
            <Form.Control
              type="text"
              value={outcomeData.out_comes}
              onChange={(e) =>
                setOutcomeData({ ...outcomeData, out_comes: e.target.value })
              }
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleOutcomeSave}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default LeadFollowupList;
