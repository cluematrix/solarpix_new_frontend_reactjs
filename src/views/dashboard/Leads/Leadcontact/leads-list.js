import React, { useState, useEffect } from "react";
import { Card, Row, Col, Button, Table, Spinner } from "react-bootstrap";
import CreateTwoToneIcon from "@mui/icons-material/CreateTwoTone";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import AddEditModal from "./add-edit-modal";
import DeleteModal from "./delete-modal";
import api from "../../../../api/axios";

const LeadsList = () => {
  const [leadList, setLeadList] = useState([]);
  const [leadSources, setLeadSources] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    salutation: "",
    name: "",
    email: "",
    contact: "",
    leadSource: "",
    addedBy: "",
    leadOwner: "",
    city: "",
    state: "",
    pincode: "",
    description: "",
    address: "",
    isActive: true,
    isDelete: false,
  });

  const [editIndex, setEditIndex] = useState(null);
  const [showAddEdit, setShowAddEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  // ✅ Fetch dropdowns once
  const fetchDropdowns = async () => {
    try {
      const [leadRes, empRes] = await Promise.all([
        api.get("/api/v1/admin/leadSource/active"),
        api.get("/api/v1/admin/employee/active"),
      ]);
      if (leadRes.data?.success) setLeadSources(leadRes.data.data || []);
      if (empRes.data?.success) setEmployees(empRes.data.data || []);
    } catch (err) {
      console.error("Error fetching dropdowns:", err);
    }
  };

  // ✅ Fetch Leads List
  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/v1/admin/lead");
      if (res.data?.success) {
        setLeadList(res.data.data || []);
      }
    } catch (err) {
      console.error("Error fetching leads:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDropdowns();
    fetchLeads();
  }, []);

  const resetForm = () => {
    setFormData({
      salutation: "",
      name: "",
      email: "",
      contact: "",
      leadSource: "",
      addedBy: "",
      leadOwner: "",
      city: "",
      state: "",
      pincode: "",
      description: "",
      address: "",
      isActive: true,
      isDelete: false,
    });
    setEditIndex(null);
  };

  // ✅ Save lead (POST/PUT)
  const handleAddOrUpdateLead = async (data) => {
    const payload = {
      salutation: data.salutation,
      name: data.name,
      email: data.email,
      contact: data.contact,
      lead_source: data.leadSource,
      added_by: data.addedBy,
      lead_owner: data.leadOwner,
      city: data.city,
      state: data.state,
      pincode: data.pincode,
      description: data.description,
      address: data.address,
      isActive: data.isActive,
      isDelete: data.isDelete,
    };

    try {
      if (editIndex !== null) {
        await api.put(`/api/v1/admin/lead/${leadList[editIndex].id}`, payload);
      } else {
        await api.post("/api/v1/admin/lead", payload);
      }
      fetchLeads();
      setShowAddEdit(false);
      resetForm();
    } catch (err) {
      console.error("Error saving lead:", err);
    }
  };

  const handleEdit = (index) => {
    const lead = leadList[index];
    setFormData({
      salutation: lead.salutation,
      name: lead.name,
      email: lead.email,
      contact: lead.contact,
      leadSource: lead.lead_source,
      addedBy: lead.added_by,
      leadOwner: lead.lead_owner,
      city: lead.city,
      state: lead.state,
      pincode: lead.pincode,
      description: lead.description,
      address: lead.address,
      isActive: lead.isActive,
      isDelete: lead.isDelete,
    });
    setEditIndex(index);
    setShowAddEdit(true);
  };

  const handleDeleteConfirm = async () => {
    if (deleteIndex !== null) {
      try {
        await api.delete(`/api/v1/admin/lead/${leadList[deleteIndex].id}`);
        fetchLeads();
      } catch (err) {
        console.error("Error deleting lead:", err);
      }
    }
    setShowDelete(false);
    setDeleteIndex(null);
  };

  return (
    <>
      <Row className="mt-4">
        <Col sm="12">
          <Card>
            <Card.Header className="d-flex justify-content-between">
              <h5 className="card-title fw-lighter">Leads Contact</h5>
              <Button
                className="btn-primary"
                onClick={() => {
                  resetForm();
                  setShowAddEdit(true);
                }}
              >
                + Add Lead
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
                        <th>Name</th>
                        <th>Email</th>
                        <th>Contact</th>
                        <th>Lead Source</th>
                        <th>Added By</th>
                        <th>Lead Owner</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leadList.length === 0 ? (
                        <tr>
                          <td colSpan="8" className="text-center">
                            No leads available
                          </td>
                        </tr>
                      ) : (
                        leadList.map((item, idx) => (
                          <tr key={idx}>
                            <td>{idx + 1}</td>
                            <td>{item.name}</td>
                            <td>{item.email}</td>
                            <td>{item.contact}</td>
                            <td>
                              {leadSources.find(
                                (src) => src.id === item.lead_source
                              )?.lead_source || "-"}
                            </td>
                            <td>
                              {employees.find((emp) => emp.id === item.added_by)
                                ?.name || "-"}
                            </td>
                            <td>
                              {employees.find(
                                (emp) => emp.id === item.lead_owner
                              )?.name || "-"}
                            </td>
                            <td>
                              <CreateTwoToneIcon
                                className="me-2"
                                onClick={() => handleEdit(idx)}
                                color="primary"
                                style={{ cursor: "pointer" }}
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

      {/* Add/Edit Modal */}
      <AddEditModal
        show={showAddEdit}
        handleClose={() => {
          setShowAddEdit(false);
          resetForm();
        }}
        formData={formData}
        setFormData={setFormData}
        onSave={handleAddOrUpdateLead}
        editData={editIndex !== null}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        show={showDelete}
        handleClose={() => {
          setShowDelete(false);
          setDeleteIndex(null);
        }}
        onConfirm={handleDeleteConfirm}
        modalTitle="Delete Lead"
        modalMessage={
          deleteIndex !== null
            ? `Are you sure you want to delete lead "${leadList[deleteIndex].name}"?`
            : ""
        }
      />
    </>
  );
};

export default LeadsList;
