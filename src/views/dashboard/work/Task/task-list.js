// Created by: Rishiraj | Permission-integrated Task List | 23 Oct 2025

import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Table,
  Spinner,
  Form,
  Pagination,
} from "react-bootstrap";
import CreateTwoToneIcon from "@mui/icons-material/CreateTwoTone";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddEditTaskModal from "./add-edit-modal";
import DeleteModal from "./delete-modal";
import api from "../../../../api/axios";
import { successToast } from "../../../../components/Toast/successToast";
import { errorToast } from "../../../../components/Toast/errorToast";
import { statusOptions, taskTypeOptions } from "../../../../mockData";
import { useNavigate, useLocation } from "react-router-dom";
import ViewTaskModal from "./ViewTaskModal";
import { useFormik } from "formik";
import CustomSelect from "../../../../components/Form/CustomSelect";

const TaskList = () => {
  const [taskList, setTaskList] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔐 Permissions
  const [permissions, setPermissions] = useState(null);
  const [permLoading, setPermLoading] = useState(true);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // Modal states
  const [showAddEdit, setShowAddEdit] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteTask, setDeleteTask] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Form data
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Medium",
    task_type: "",
    start_date: new Date().toISOString().split("T")[0],
    end_date: "",
    assign_by: "",
    assign_to: [],
    task_category_id: "",
    status: "Incomplete",
    project_id: "",
  });

  const initialValues = {
    task_type: "",
  };

  const formik = useFormik({
    initialValues,
  });

  const { values, handleBlur, handleChange } = formik;

  //  Fetch role-based permissions
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

  //  Fetch tasks with permission filtering
  const fetchTasks = async (page = 1) => {
    try {
      setLoading(true);
      const roleId = String(sessionStorage.getItem("roleId"));
      const empId = String(sessionStorage.getItem("employee_id"));

      let url = `/api/v1/admin/task/pagination?page=${page}&limit=${itemsPerPage}`;
      if (values.task_type) {
        url = `/api/v1/admin/task/${values.task_type}/pagination?page=${page}&limit=${itemsPerPage}`;
      }

      const res = await api.get(url);
      const allTasks = res.data?.data || [];

      // Extract pagination info
      const pagination = res.data?.pagination;
      if (pagination) {
        setTotalPages(pagination.totalPages || 1);
      }

      // Super Admin — sees all
      if (roleId === "1") {
        setTaskList(allTasks);
      }
      //  If any_one = true → show all
      else if (permissions?.any_one) {
        setTaskList(allTasks);
      }
      // Otherwise, show only own tasks
      else {
        const filtered = allTasks.filter(
          (task) => String(task.assign_by) === empId
        );
        setTaskList(filtered);
      }
    } catch (err) {
      console.error("Error fetching tasks:", err);
      errorToast("Failed to fetch tasks");
      setTaskList([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch permissions first
  useEffect(() => {
    FETCHPERMISSION();
  }, [pathname]);

  // Then fetch tasks when permissions are ready
  useEffect(() => {
    if (!permLoading && permissions?.view) {
      fetchTasks(currentPage);
    }
  }, [permLoading, permissions, currentPage, values.task_type]);

  // Add/Edit task handler
  const handleAddOrUpdateTask = async (data) => {
    try {
      const loggedInUser = sessionStorage.getItem("employee_id");
      const payload = {
        ...data,
        assign_by: loggedInUser,
        end_date: data.withoutDueDate ? null : data.end_date,
      };

      if (editTask) {
        await api.put(`/api/v1/admin/task/${editTask.id}`, payload);
        successToast("Task updated successfully");
      } else {
        await api.post("/api/v1/admin/task", payload);
        successToast("Task created successfully");
      }

      fetchTasks();
    } catch (err) {
      console.error(err);
      errorToast("Failed to save task");
    } finally {
      setShowAddEdit(false);
      setEditTask(null);
    }
  };

  // Update status
  const handleUpdateStatus = async (task, newStatus) => {
    try {
      await api.put(`/api/v1/admin/task/${task.id}`, {
        ...task,
        status: newStatus,
      });
      successToast("Status updated successfully");
      fetchTasks();
    } catch (err) {
      console.error(err);
      errorToast("Failed to update status");
    }
  };

  // Edit
  const handleEdit = (task) => {
    if (!permissions?.edit) {
      errorToast("You don't have permission to edit");
      return;
    }

    setFormData({
      title: task.title || "",
      description: task.description || "",
      priority: task.priority || "Medium",
      task_type: task.task_type || "",
      start_date: task.start_date?.split("T")[0] || "",
      end_date: task.end_date?.split("T")[0] || "",
      assign_by: task.assign_by || "",
      assign_to: task.assign_to || [],
      task_category_id: task.task_category_id || "",
      status: task.status || "Incomplete",
      project_id: task.project_id || "",
    });
    setEditTask(task);
    setShowAddEdit(true);
  };

  // Delete
  const handleDeleteConfirm = async () => {
    if (!deleteTask) return;
    try {
      await api.delete(`/api/v1/admin/task/${deleteTask.id}`);
      fetchTasks();
      successToast("Task deleted successfully");
    } catch (err) {
      console.error(err);
      errorToast("Failed to delete task");
    } finally {
      setShowDelete(false);
      setDeleteTask(null);
    }
  };

  // 🌀 Loader while checking permissions
  if (permLoading) {
    return (
      <div className="loader-div">
        <Spinner animation="border" className="spinner" />
      </div>
    );
  }

  //  No view permission
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

  //  Main render
  return (
    <>
      <Row className="mt-4">
        <Col sm="12">
          <Card>
            <Card.Header className="d-flex justify-content-between">
              <h5 className="card-title fw-lighter">Tasks</h5>
              <div className="d-flex gap-3">
                <CustomSelect
                  // label="Select Warehouse"
                  name="task_type"
                  value={values.task_type}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  options={taskTypeOptions}
                  placeholder="--Select Task Type--"
                  lableName="name"
                  lableKey="name"
                />
                {permissions?.add && (
                  <>
                    <Button
                      className="btn-primary"
                      onClick={() => {
                        setFormData({
                          title: "",
                          description: "",
                          priority: "Medium",
                          task_type: "",
                          start_date: "",
                          end_date: "",
                          assign_by: "",
                          assign_to: [],
                          task_category_id: "",
                          status: "Incomplete",
                          project_id: "",
                        });
                        setEditTask(null);
                        setShowAddEdit(true);
                      }}
                    >
                      + New
                    </Button>
                  </>
                )}
              </div>
            </Card.Header>
            <Card.Body className="px-0 pt-3">
              {loading ? (
                <div className="loader-div">
                  <Spinner animation="border" className="spinner" />
                </div>
              ) : (
                <>
                  <div className="table-responsive">
                    <Table hover responsive>
                      <thead>
                        <tr className="table-gray">
                          <th>Sr. No.</th>
                          <th>Title</th>
                          <th>Project</th>
                          <th>Task Type</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {taskList.length === 0 ? (
                          <tr>
                            <td colSpan="6" className="text-center">
                              No tasks available
                            </td>
                          </tr>
                        ) : (
                          taskList.map((task, idx) => (
                            <tr key={task.id}>
                              <td>{idx + 1}</td>
                              <td>{task.title}</td>
                              <td>{task.project?.project_name || "-"}</td>
                              <td>{task.task_type || "-"}</td>
                              <td>
                                <Form.Select
                                  size="sm"
                                  value={task.status}
                                  onChange={(e) =>
                                    handleUpdateStatus(task, e.target.value)
                                  }
                                >
                                  {statusOptions.map((s) => (
                                    <option key={s.name} value={s.name}>
                                      {s.icon} {s.name}
                                    </option>
                                  ))}
                                </Form.Select>
                              </td>
                              <td>
                                <VisibilityIcon
                                  color="primary"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => setSelectedTask(task)}
                                />
                                {permissions?.edit && (
                                  <CreateTwoToneIcon
                                    color="primary"
                                    onClick={() => handleEdit(task)}
                                    style={{ cursor: "pointer" }}
                                  />
                                )}
                                {permissions?.del && (
                                  <DeleteRoundedIcon
                                    color="error"
                                    onClick={() => {
                                      setDeleteTask(task);
                                      setShowDelete(true);
                                    }}
                                    style={{ cursor: "pointer" }}
                                  />
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </Table>
                  </div>
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
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Add/Edit Modal */}
      <AddEditTaskModal
        show={showAddEdit}
        handleClose={() => setShowAddEdit(false)}
        formData={formData}
        setFormData={setFormData}
        onSave={handleAddOrUpdateTask}
        editData={!!editTask}
      />

      {/* Delete Modal */}
      <DeleteModal
        show={showDelete}
        handleClose={() => setShowDelete(false)}
        onConfirm={handleDeleteConfirm}
        modalTitle="Delete Task"
        modalMessage={
          deleteTask
            ? `Are you sure you want to delete "${deleteTask.title}"?`
            : ""
        }
      />

      {/* View Modal */}
      <ViewTaskModal
        show={!!selectedTask}
        handleClose={() => setSelectedTask(null)}
        task={selectedTask}
      />
    </>
  );
};

export default TaskList;
