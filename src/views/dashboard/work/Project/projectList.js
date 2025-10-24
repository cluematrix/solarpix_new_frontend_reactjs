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
import avatarPic from "../../../../assets/images/avatars/avatar-pic.jpg";
import "../../../../styles/hoverMembersImg.css";
import { useNavigate, useLocation } from "react-router-dom";

const ProjectList = ({ onActiveTab = () => {} }) => {
  const [projectData, setProjectData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [permissions, setPermissions] = useState(null);
  const [permLoading, setPermLoading] = useState(true);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Modals
  const [deleteId, setDeleteId] = useState(null);
  const [showAddEdit, setShowAddEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  // Installation Status
  const [instStatus, setInstStatus] = useState([]);

  // 🧠 Fetch role-based permissions
  const FETCHPERMISSION = async () => {
    setPermLoading(true);
    try {
      const res = await api.get("/api/v1/admin/rolePermission");

      let data = [];
      if (Array.isArray(res.data)) data = res.data;
      else if (Array.isArray(res.data.data)) data = res.data.data;

      const roleId = String(sessionStorage.getItem("roleId"));

      // 👑 Super Admin — full access
      if (roleId === "1") {
        setPermissions({
          view: true,
          add: true,
          edit: true,
          del: true,
          any_one: true,
        });
        return;
      }

      // Match permission by route
      const matchedPermission = data.find(
        (perm) =>
          String(perm.role_id) === roleId &&
          perm.route?.toLowerCase() === pathname?.toLowerCase()
      );

      if (matchedPermission) {
        setPermissions({
          view: matchedPermission.view === true || matchedPermission.view === 1,
          add: matchedPermission.add === true || matchedPermission.add === 1,
          edit: matchedPermission.edit === true || matchedPermission.edit === 1,
          del: matchedPermission.del === true || matchedPermission.del === 1,
          any_one:
            matchedPermission.any_one === true ||
            matchedPermission.any_one === 1,
        });
      } else {
        setPermissions(null);
      }
    } catch (err) {
      console.error("Error fetching permissions:", err);
      setPermissions(null);
    } finally {
      setPermLoading(false);
    }
  };

  // 🧩 Fetch Project List (with permission logic)
  const fetchProject = async (page = 1) => {
    try {
      setLoading(true);
      const roleId = String(sessionStorage.getItem("roleId"));
      const empId = String(sessionStorage.getItem("employee_id"));

      let url = `/api/v1/admin/project/active/pagination?page=${page}&limit=${itemsPerPage}`;
      const res = await api.get(url);
      const allProjects = res.data?.data || [];

      // 👑 Admin shows all
      if (roleId === "1") {
        setProjectData(allProjects);
      }
      // 🌍 If permission.any_one = true → show all
      else if (permissions?.any_one) {
        setProjectData(allProjects);
      }
      // 👤 Otherwise → show only own projects
      else {
        const filtered = allProjects.filter(
          (proj) => String(proj.added_by) === empId
        );
        setProjectData(filtered);
      }

      const pagination = res.data?.pagination;
      if (pagination) setTotalPages(pagination.totalPages || 1);
    } catch (err) {
      console.error("Error fetching projects:", err);
      errorToast("Failed to fetch projects");
      setProjectData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    FETCHPERMISSION();
  }, [pathname]);

  useEffect(() => {
    if (!permLoading && permissions?.view) {
      fetchProject(currentPage);
      fetchInstStatus();
    }
  }, [permLoading, permissions, currentPage]);

  // 🔹 Fetch installation status list
  const fetchInstStatus = async () => {
    try {
      const res = await api.get("/api/v1/admin/installationStatus/active");
      if (res.data?.data) setInstStatus(res.data.data);
      else if (Array.isArray(res.data)) setInstStatus(res.data);
      else setInstStatus([]);
    } catch (err) {
      console.error("Error fetching installation status:", err);
    }
  };

  // 🔹 Update Installation Status (Only for role_id = 1)
  const handleInstallationChange = async (item, newStatusId) => {
    const roleId = String(sessionStorage.getItem("roleId"));
    if (roleId !== "1") {
      errorToast("You are not allowed to change installation status");
      return;
    }

    try {
      await api.put(`/api/v1/admin/project/${item.id}`, {
        installationStatus_id: newStatusId,
      });

      successToast("Installation status updated successfully");
      fetchProject(currentPage);
    } catch (err) {
      console.error("Error updating installation status:", err);
      errorToast("Failed to update installation status");
    }
  };

  // 🔹 Delete Project
  const handleDeleteConfirm = () => {
    if (!deleteId) return;
    api
      .delete(`/api/v1/admin/project/${deleteId}`)
      .then(() => {
        successToast("Project deleted successfully");
        setProjectData((prev) => prev.filter((p) => p.id !== deleteId));
      })
      .catch((err) => {
        console.error("Error deleting project:", err);
        errorToast(err.response?.data?.message || "Failed to delete project");
      })
      .finally(() => {
        setShowDelete(false);
        setDeleteId(null);
      });
  };

  // 🌀 Loader while checking permissions
  if (permLoading) {
    return (
      <div className="loader-div">
        <Spinner animation="border" className="spinner" />
      </div>
    );
  }

  // 🚫 No view permission
  if (!permissions?.view) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "70vh" }}
      >
        <h4>You don’t have permission to view this page.</h4>
      </div>
    );
  }

  // ✅ Main Render
  return (
    <>
      <Row className="mt-4">
        <Col sm="12">
          <Card>
            <Card.Header
              className="d-flex justify-content-between"
              style={{ padding: "15px 15px 0px 15px" }}
            >
              <h5 className="card-title fw-lighter">Projects</h5>
              {permissions.add && (
                <Button
                  className="btn-primary"
                  onClick={() => navigate("/add-project")}
                >
                  + New
                </Button>
              )}
            </Card.Header>

            <Card.Body className="px-0 pt-3">
              {loading ? (
                <div className="text-center p-4">
                  <Spinner animation="border" />
                </div>
              ) : (
                <div className="table-responsive">
                  <Table hover responsive className="table">
                    <thead>
                      <tr className="table-gray">
                        <th>Sr. No.</th>
                        <th>Short Code</th>
                        <th>Project Name</th>
                        <th>Start Date</th>
                        <th>As per sales order</th>
                        <th>Installation Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projectData.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="text-center">
                            No projects available
                          </td>
                        </tr>
                      ) : (
                        projectData.map((item, idx) => (
                          <tr key={idx}>
                            <td>{idx + 1}</td>
                            <td>{item.short_code || "--"}</td>
                            <td>{item.project_name || "--"}</td>
                            <td>{item.start_date || "--"}</td>
                            <td>₹{item.estimate || "--"}</td>
                            <td>
                              <Form.Select
                                size="sm"
                                value={item.installationStatus?.id || ""}
                                onChange={(e) =>
                                  handleInstallationChange(item, e.target.value)
                                }
                              >
                                <option disabled value="">
                                  --
                                </option>
                                {instStatus.map((option) => (
                                  <option key={option.id} value={option.id}>
                                    {option.installationStatus}
                                  </option>
                                ))}
                              </Form.Select>
                            </td>
                            <td className="d-flex align-items-center gap-2">
                              <CreateTwoToneIcon
                                onClick={() =>
                                  navigate(
                                    `/project-list/edit-project/${item.id}`
                                  )
                                }
                                color="primary"
                                style={{ cursor: "pointer" }}
                              />
                              {permissions.del && (
                                <DeleteRoundedIcon
                                  onClick={() => {
                                    setDeleteId(item.id);
                                    setDeleteIndex(idx);
                                    setShowDelete(true);
                                  }}
                                  color="error"
                                  style={{ cursor: "pointer" }}
                                />
                              )}
                              <VisibilityIcon
                                onClick={() =>
                                  navigate(
                                    `/project-list/view-project/${item.id}`
                                  )
                                }
                                color="primary"
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

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination className="justify-content-center mt-3">
                  <Pagination.First
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                  />
                  {[...Array(totalPages)].map((_, i) => (
                    <Pagination.Item
                      key={i + 1}
                      active={i + 1 === currentPage}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </Pagination.Item>
                  ))}
                  <Pagination.Last
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                  />
                </Pagination>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        show={showDelete}
        handleClose={() => setShowDelete(false)}
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
