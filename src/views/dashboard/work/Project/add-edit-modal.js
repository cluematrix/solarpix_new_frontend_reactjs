import React, { useEffect, useState } from "react";
import { Modal, Form, Button, Row, Col, Badge } from "react-bootstrap";
import AddProject from "./addProject";

const AddEditProjectModal = ({
  show,
  handleClose,
  onSave,
  formData,
  setFormData,
  editData,
}) => {
  const [showMembersModal, setShowMembersModal] = useState(false);

  const departmentOptions = [
    { value: "HRM", label: "Human Resource Management" },
    { value: "IT", label: "Information Technology" },
    { value: "Finance", label: "Finance" },
    { value: "Marketing", label: "Marketing" },
    { value: "Operations", label: "Operations" },
  ];

  const membersList = [
    { id: "Rohit Sharma", name: "Rohit Sharma" },
    { id: "Priya Singh", name: "Priya Singh" },
    { id: "Amit Verma", name: "Amit Verma" },
    { id: "Neha Gupta", name: "Neha Gupta" },
  ];

  // const currencyOptions = ["USD", "EUR", "INR", "GBP"];

  useEffect(() => {
    if (!editData) {
      setFormData((prev) => ({ ...prev, file: null, projectMembers: [] }));
    }
  }, [editData, setFormData]);

  // const handleChange = (e) => {
  //   const { name, value, files } = e.target;
  //   if (files) {
  //     setFormData({ ...formData, [name]: files[0] });
  //   } else {
  //     setFormData({ ...formData, [name]: value });
  //   }
  // };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   onSave(formData);
  // };

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

  return (
    <>
      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton className="mb-4">
          <Modal.Title>{editData ? "Edit Project" : "Add Project"}</Modal.Title>
        </Modal.Header>
        <AddProject
          setShowMembersModal={setShowMembersModal}
          formData={formData}
        />
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
