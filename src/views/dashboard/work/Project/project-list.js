import React, { useState } from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import CreateTwoToneIcon from "@mui/icons-material/CreateTwoTone";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import AddEditModal from "./add-edit-modal";
import DeleteModal from "./delete-modal";

const ProjectList = () => {
  const [projectList, setProjectList] = useState([
    {
      shortCode: "PRJ001",
      projectName: "Website Redesign",
      startDate: "2025-08-01",
      deadline: "2025-09-15",
      department: "Design",
      customer: "ABC Corp",
      projectSummary: "Complete overhaul of the company website",
      projectMembers: "John Doe",
      file: null,
      currency: "USD",
      projectBudget: "5000",
      hoursEstimate: "120",
      status: "In Progress",
    },
    {
      shortCode: "PRJ002",
      projectName: "Mobile App Development",
      startDate: "2025-07-15",
      deadline: "2025-11-30",
      department: "Development",
      customer: "XYZ Ltd",
      projectSummary: "Building a cross-platform mobile application",
      projectMembers: "Jane Smith",
      file: null,
      currency: "USD",
      projectBudget: "10000",
      hoursEstimate: "300",
      status: "Pending",
    },
    {
      shortCode: "PRJ003",
      projectName: "Marketing Campaign",
      startDate: "2025-08-05",
      deadline: "2025-08-30",
      department: "Marketing",
      customer: "Global Tech",
      projectSummary: "Social media and email marketing campaign",
      projectMembers: "David Johnson",
      file: null,
      currency: "USD",
      projectBudget: "2000",
      hoursEstimate: "60",
      status: "Completed",
    },
  ]);

  const [formData, setFormData] = useState({
    shortCode: "",
    projectName: "",
    startDate: "",
    deadline: "",
    department: "",
    customer: "",
    projectSummary: "",
    projectMembers: "", // single member id
    file: null,
    currency: "",
    projectBudget: "",
    hoursEstimate: "",
    status: "",
  });

  const [editIndex, setEditIndex] = useState(null);
  const [showAddEdit, setShowAddEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const rolesPerPage = 10;
  const indexOfLastRole = currentPage * rolesPerPage;
  const indexOfFirstRole = indexOfLastRole - rolesPerPage;
  const currentRoles = projectList.slice(indexOfFirstRole, indexOfLastRole);
  const totalPages = Math.ceil(projectList.length / rolesPerPage);
  const resetForm = () => {
    setFormData({
      shortCode: "",
      projectName: "",
      startDate: "",
      deadline: "",
      department: "",
      customer: "",
      projectSummary: "",
      projectMembers: "",
      file: null,
      currency: "",
      projectBudget: "",
      hoursEstimate: "",
      status: "",
    });
    setEditIndex(null);
  };

  const handleAddOrUpdateProject = (data) => {
    if (!data.projectName.trim()) return; // basic validation

    if (editIndex !== null) {
      const updatedList = [...projectList];
      updatedList[editIndex] = data;
      setProjectList(updatedList);
    } else {
      setProjectList([...projectList, data]);
    }

    setShowAddEdit(false);
    resetForm();
  };

  const handleEdit = (index) => {
    setFormData(projectList[index]);
    setEditIndex(index);
    setShowAddEdit(true);
  };

  const handleDeleteConfirm = () => {
    if (deleteIndex !== null) {
      setProjectList(projectList.filter((_, i) => i !== deleteIndex));
    }
    setShowDelete(false);
    setDeleteIndex(null);
  };

  return (
    <>
      <Row>
        <Col sm="12">
          <Card>
            <Card.Header className="d-flex justify-content-between">
              <h4 className="card-title">Project List</h4>
              <Button
                className="btn-primary"
                onClick={() => {
                  resetForm();
                  setShowAddEdit(true);
                }}
              >
                + Add Project
              </Button>
            </Card.Header>

            <Card.Body className="px-0">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Sr. No.</th>
                      <th>Short Code</th>
                      <th>Project Name</th>
                      {/* <th>Status</th> */}
                      <th>Customer</th>
                      <th>Project Member</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projectList.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center">
                          No projects available
                        </td>
                      </tr>
                    ) : (
                      projectList.map((item, idx) => (
                        <tr key={idx}>
                          <td>{idx + 1}</td>
                          <td>{item.shortCode}</td>
                          <td>{item.projectName}</td>
                          {/* <td>{item.status}</td> */}
                          <td>{item.customer}</td>
                          <td>{item.projectMembers}</td>
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

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-end mt-3 me-3">
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                  >
                    Previous
                  </Button>
                  {[...Array(totalPages)].map((_, i) => (
                    <Button
                      key={i}
                      variant={currentPage === i + 1 ? "primary" : "light"}
                      size="sm"
                      className="mx-1"
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </Button>
                  ))}
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                  >
                    Next
                  </Button>
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
        onSave={handleAddOrUpdateProject}
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
        modalTitle="Delete Project"
        modalMessage={
          deleteIndex !== null
            ? `Are you sure you want to delete project "${projectList[deleteIndex].projectName}"?`
            : ""
        }
      />
    </>
  );
};

export default ProjectList;
