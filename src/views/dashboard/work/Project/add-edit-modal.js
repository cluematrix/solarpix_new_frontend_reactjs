import React, { useEffect, useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import AddProject from "./addProject";
import UpdateProjectForm from "./updateProjectForm";
import api from "../../../../api/axios";

const AddEditProjectModal = ({
  show,
  handleClose,
  onSave,
  formData,
  setFormData,
  editData,
  openEditModal,
}) => {
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [employee, setEmployee] = useState([]);

  // fetch employee
  const fetchEmployee = async () => {
    try {
      const res = await api.get("/api/v1/admin/employee");
      console.log(res.data, "test");
      setEmployee(res.data.data || []);
    } catch (err) {
      console.error("Error fetching employee:", err);
    }
  };

  // const currencyOptions = ["USD", "EUR", "INR", "GBP"];

  useEffect(() => {
    fetchEmployee();
  }, []);
  useEffect(() => {
    if (!editData) {
      setFormData((prev) => ({ ...prev, file: null, projectMembers: [] }));
    }
  }, [editData, setFormData]);

  const toggleMemberSelection = (id) => {
    setFormData((prev) => {
      const alreadySelected = prev.projectMembers.includes(id);
      return {
        ...prev,
        projectMembers: alreadySelected
          ? prev.projectMembers.filter((m) => m !== id) // remove if already selected
          : [...prev.projectMembers, id], // add new
      };
    });
  };

  console.log("openEditModal", openEditModal);
  console.log("formData.projectMembersModal", formData.projectMembers);

  // Helper to get selected member names
  const selectedMemberNames = employee
    .filter((member) => formData.projectMembers?.includes(member.id))
    .map((member) => member.name);

  console.log("Selected Members:", selectedMemberNames);
  return (
    <>
      <Modal show={show} onHide={handleClose} size="lg" backdrop="static">
        <Modal.Header closeButton className="mb-4">
          <Modal.Title>
            {openEditModal ? "Edit Project" : "Add Project"}
          </Modal.Title>
        </Modal.Header>
        {openEditModal ? (
          <UpdateProjectForm
            setShowMembersModal={setShowMembersModal}
            formData={formData}
            handleClose={handleClose}
            selectedMemberNames={selectedMemberNames}
          />
        ) : (
          <AddProject
            setShowMembersModal={setShowMembersModal}
            formData={formData}
            handleClose={handleClose}
            selectedMemberNames={selectedMemberNames}
          />
        )}
      </Modal>

      {/* Members Selection Modal */}
      <Modal show={showMembersModal} onHide={() => setShowMembersModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Select Project Members</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {employee.map((member) => (
            <Form.Check
              key={member.id}
              type="checkbox"
              label={member.name}
              checked={formData.projectMembers?.includes(member.id)}
              onChange={() => toggleMemberSelection(member.id)}
            />
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowMembersModal(false)}
          >
            Close
          </Button>
          <Button variant="primary" onClick={() => setShowMembersModal(false)}>
            Save Selection
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddEditProjectModal;
