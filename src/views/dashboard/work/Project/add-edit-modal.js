import React, { useEffect, useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import AddProject from "./addProject";
import UpdateProjectForm from "./updateProjectForm";

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

  const membersList = [
    { id: "1", name: "Rohit Sharma" },
    { id: "2", name: "Priya Singh" },
    { id: "3", name: "Amit Verma" },
    { id: "4", name: "Neha Gupta" },
  ];

  // const currencyOptions = ["USD", "EUR", "INR", "GBP"];

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
  const selectedMemberNames = membersList
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
          {membersList.map((member) => (
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
