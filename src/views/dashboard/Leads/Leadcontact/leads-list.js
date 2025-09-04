import React, { useState } from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import CreateTwoToneIcon from "@mui/icons-material/CreateTwoTone";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import AddEditModal from "./add-edit-modal";
import DeleteModal from "./delete-modal";

const LeadsList = () => {
  const [leadList, setLeadList] = useState([
    {
      salutation: "Mr.",
      name: "John Doe",
      email: "john@example.com",
      leadSource: "Website",
      addedBy: "Admin",
      leadOwner: "Rohit Sharma",
      dealName: "Website Redesign",
      pipeline: "Sales Pipeline",
      dealStage: "Negotiation",
      dealValue: "5000",
      closeDate: "2025-09-11",
      dealCategory: "Software",
      dealAgent: "Priya Singh",
      products: "Web Development",
      dealWatcher: "Amit Verma",
    },
  ]);

  const [formData, setFormData] = useState({
    salutation: "",
    name: "",
    email: "",
    leadSource: "",
    addedBy: "",
    leadOwner: "",
    dealName: "",
    pipeline: "",
    dealStage: "",
    dealValue: "",
    closeDate: "",
    dealCategory: "",
    dealAgent: "",
    products: "",
    dealWatcher: "",
  });

  const [editIndex, setEditIndex] = useState(null);
  const [showAddEdit, setShowAddEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const resetForm = () => {
    setFormData({
      salutation: "",
      name: "",
      email: "",
      leadSource: "",
      addedBy: "",
      leadOwner: "",
      dealName: "",
      pipeline: "",
      dealStage: "",
      dealValue: "",
      closeDate: "",
      dealCategory: "",
      dealAgent: "",
      products: "",
      dealWatcher: "",
    });
    setEditIndex(null);
  };

  const handleAddOrUpdateLead = (data) => {
    if (!data.name.trim()) return;

    if (editIndex !== null) {
      const updatedList = [...leadList];
      updatedList[editIndex] = data;
      setLeadList(updatedList);
    } else {
      setLeadList([...leadList, data]);
    }

    setShowAddEdit(false);
    resetForm();
  };

  const handleEdit = (index) => {
    setFormData(leadList[index]);
    setEditIndex(index);
    setShowAddEdit(true);
  };

  const handleDeleteConfirm = () => {
    if (deleteIndex !== null) {
      setLeadList(leadList.filter((_, i) => i !== deleteIndex));
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
              <h4 className="card-title fw-bold">Leads Contact </h4>
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
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Sr. No.</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Lead Source</th>
                      <th>Deal Name</th>
                      <th>Deal Stage</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leadList.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center">
                          No leads available
                        </td>
                      </tr>
                    ) : (
                      leadList.map((item, idx) => (
                        <tr key={idx}>
                          <td>{idx + 1}</td>
                          <td>{item.name}</td>
                          <td>{item.email}</td>
                          <td>{item.leadSource}</td>
                          <td>{item.dealName}</td>
                          <td>{item.dealStage}</td>
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
                </table>
              </div>
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
