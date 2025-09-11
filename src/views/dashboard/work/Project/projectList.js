// Created by: Sufyan 03 Sep 2025

import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Spinner,
  Form,
  Table,
  Pagination,
} from "react-bootstrap";
import CreateTwoToneIcon from "@mui/icons-material/CreateTwoTone";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import AddEditModal from "./add-edit-modal";
import DeleteModal from "./delete-modal";
import api from "../../../../api/axios";
import { successToast } from "../../../../components/Toast/successToast";
import { errorToast } from "../../../../components/Toast/errorToast";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ProjectProfile from "./projectProfile";
import avatarPic from "../../../../assets/images/avatars/avatar-pic.jpg";
import "../../../../styles/hoverMembersImg.css";
import { useNavigate } from "react-router-dom";

const ProjectList = ({ onActiveTab = () => {} }) => {
  const [projectData, setProjectData] = useState([]);
  const [navigateId, setNavigateId] = useState(false);
  const navigate = useNavigate();

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const rolesPerPage = 10;
  const indexOfLastRole = currentPage * rolesPerPage;
  const indexOfFirstRole = indexOfLastRole - rolesPerPage;
  const totalPages = Math.ceil(projectData.length / rolesPerPage);
  const currentProject = projectData.slice(indexOfFirstRole, indexOfLastRole);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(false);

  // fetch project
  const fetchProject = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/v1/admin/project");
      console.log("Project List API Response:", res.data.data);
      setProjectData(res.data.data || []);
    } catch (err) {
      console.error("Error fetching employee:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, []);

  const [formData, setFormData] = useState({
    short_code: "",
    project_name: "",
    is_deadline: false,
    start_date: "",
    end_date: "",
    project_category_id: "",
    client_id: "",
    project_summary: "",
    project_budget: "",
    hour_estimate: "",
    added_by: [],
    projectMembers: "", // single member id
  });
  const [editIndex, setEditIndex] = useState(null);
  const [showAddEdit, setShowAddEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [openEditModalData, setOpenEditModalData] = useState(false);
  const [viewProjectData, setViewProjectData] = useState(null);
  const handleAddOrUpdateProject = (data) => {
    if (!data.projectName.trim()) return; // basic validation

    if (editIndex !== null) {
      const updatedList = [...projectData];
      updatedList[editIndex] = data;
      setProjectData(updatedList);
    } else {
      setProjectData([...projectData, data]);
    }
    setShowAddEdit(false);
  };

  const handleEdit = (index, item) => {
    setFormData(item);
    setEditIndex(index);
    setShowAddEdit(true);
    setOpenEditModalData(true);
  };

  // delete modal
  const openDeleteModal = (id, idx) => {
    setDeleteIndex(idx);
    setShowDelete(true);
    setDeleteId(id);
  };

  const handleDeleteConfirm = () => {
    if (!deleteId) return;
    api
      .delete(`/api/v1/admin/project/${deleteId}`)
      .then(() => {
        successToast("Project Deleted Successfully");
        setProjectData((prev) => prev.filter((p) => p.id !== deleteId));
        setShowDelete(false);
      })
      .catch((err) => {
        console.error("Error deleting project:", err);
        errorToast(err.response?.data?.message || "Failed to delete project");
      });

    if (deleteIndex !== null) {
      setProjectData(projectData.filter((_, i) => i !== deleteIndex));
    }
    setShowDelete(false);
    setDeleteIndex(null);
  };

  console.log("Current Project for Pagination:", currentProject);

  const handleToggleActive = async (id, status) => {
    const newStatus = !status;
    try {
      const res = await api.put(`/api/v1/admin/project/${id}`, {
        isActive: newStatus,
      });
      console.log("resUpdatedPro", res);
      if (res.status === 200) {
        console.log("enter", res.status);
        successToast("Project updated successfully");
        setProjectData((prev) =>
          prev.map((emp) =>
            emp.id === id ? { ...emp, isActive: newStatus } : emp
          )
        );
      }
    } catch (err) {
      console.error("Error project status:", err);
      errorToast(
        err.response?.data?.message || "Failed to update project status"
      );
    }
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // navigate to view page
  const handleView = (item) => {
    setNavigateId(!navigateId);
    setViewProjectData(item);
  };

  // navigate to employee profile tab
  const handleNavigateToProfile = (item) => {
    navigate(`/view-employee/${item.id}`);
    console.log("itemEmp", item);
  };

  return (
    <>
      {navigateId ? (
        <ProjectProfile viewProjectData={viewProjectData} />
      ) : (
        <Row className="mt-4">
          <Col sm="12">
            <Card>
              <Card.Header
                className="d-flex justify-content-between"
                style={{ padding: "15px 15px 0px 15px" }}
              >
                <h5 className="card-title fw-lighter">Projects</h5>
                <Button
                  className="btn-primary"
                  onClick={() => {
                    setShowAddEdit(true);
                    setOpenEditModalData(false);
                  }}
                >
                  + Add Project
                </Button>
              </Card.Header>

              <Card.Body className="px-0 pt-3">
                {loading ? (
                  <div className="loader-div">
                    <Spinner animation="border" className="spinner" />
                  </div>
                ) : (
                  <div className="table-responsive">
                    <Table hover responsive className="table">
                      <thead>
                        <tr className="table-gray">
                          <th>Sr. No.</th>
                          <th>Short Code</th>
                          <th>Project Name</th>
                          <th>Member</th>
                          <th>Start Date</th>
                          <th>End Date</th>
                          <th>Deadline</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {projectData.length === 0 ? (
                          <tr>
                            <td colSpan="8" className="text-center">
                              No projects available
                            </td>
                          </tr>
                        ) : (
                          projectData.map((item, idx) => (
                            <tr key={idx}>
                              <td>{idx + 1}</td>
                              <td>{item.short_code || "--"}</td>
                              <td>{item.project_name || "--"}</td>
                              {/* <td>
                                {item.assign_to_details.map(
                                  (ass) => ass.name
                                ) || "--"}
                              </td> */}
                              <td>
                                <div className="d-flex align-items-center justify-content-center">
                                  {item.assign_to_details
                                    .slice(0, 3)
                                    .map((ass, index) => (
                                      <img
                                        key={index}
                                        src={ass.photo || avatarPic}
                                        alt={ass.name}
                                        title={ass.name}
                                        className="rounded-circle me-1 avatar-hover"
                                        style={{
                                          width: "25px",
                                          height: "25px",
                                          objectFit: "cover",
                                          border: "1px solid #ccc",
                                          cursor: "pointer",
                                          zIndex: 10 - index,
                                          marginLeft: "-15px",
                                        }}
                                        onClick={() =>
                                          handleNavigateToProfile(ass)
                                        }
                                      />
                                    ))}

                                  {item.assign_to_details.length > 3 && (
                                    <div
                                      className="rounded-circle d-flex align-items-center justify-content-center bg-light text-dark member-avatar"
                                      style={{
                                        width: "25px",
                                        height: "25px",
                                        fontSize: "12px",
                                        border: "1px solid #ccc",
                                        cursor: "pointer",
                                      }}
                                      onClick={() =>
                                        handleNavigateToProfile(
                                          item.assign_to_details
                                        )
                                      }
                                    >
                                      +{item.assign_to_details.length - 3}
                                    </div>
                                  )}
                                </div>
                              </td>

                              <td>{item.start_date || "--"}</td>
                              <td>{item.end_date || "--"}</td>
                              <td className="text-center">
                                {item.is_deadline || "--"}
                              </td>
                              <td>
                                <span
                                  className={`status-dot ${
                                    item.isActive ? "active" : "inactive"
                                  }`}
                                ></span>
                                {item.isActive ? "Active" : "Inactive"}
                              </td>
                              <td className="d-flex align-items-center">
                                <Form.Check
                                  type="switch"
                                  id={`active-switch-${item.id}`}
                                  checked={item.isActive}
                                  onChange={() =>
                                    handleToggleActive(item.id, item.isActive)
                                  }
                                />
                                <CreateTwoToneIcon
                                  className="me-1"
                                  onClick={() => handleEdit(idx, item)}
                                  color="primary"
                                  style={{ cursor: "pointer" }}
                                />
                                <DeleteRoundedIcon
                                  onClick={() => openDeleteModal(item.id, idx)}
                                  color="error"
                                  style={{ cursor: "pointer" }}
                                />
                                <VisibilityIcon
                                  onClick={() => handleView(item)}
                                  color="primary"
                                  style={{
                                    cursor: "pointer",
                                    margin: "0px 5px",
                                  }}
                                />
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </Table>
                  </div>
                )}
                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <Pagination className="justify-content-center mt-3">
                    <Pagination.Prev
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    />
                    {[...Array(totalPages)].map((_, i) => (
                      <Pagination.Item
                        key={i + 1}
                        active={i + 1 === currentPage}
                        onClick={() => handlePageChange(i + 1)}
                      >
                        {i + 1}
                      </Pagination.Item>
                    ))}
                    <Pagination.Next
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    />
                  </Pagination>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Add/Edit Modal */}
      <AddEditModal
        show={showAddEdit}
        handleClose={() => {
          setShowAddEdit(false);
        }}
        formData={formData}
        setFormData={setFormData}
        onSave={handleAddOrUpdateProject}
        editData={editIndex !== null}
        openEditModal={openEditModalData} // selected item data
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
            ? `Are you sure you want to delete project "${projectData[deleteIndex].project_name}"?`
            : ""
        }
      />
    </>
  );
};

export default ProjectList;
