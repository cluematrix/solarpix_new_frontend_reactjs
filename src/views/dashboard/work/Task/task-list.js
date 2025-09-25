import React, { useEffect, useState } from "react";
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
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddEditTaskModal from "./add-edit-modal";
import DeleteModal from "./delete-modal";
import api from "../../../../api/axios";
import avatarPic from "../../../../assets/images/avatars/avatar-pic.jpg";
import { successToast } from "../../../../components/Toast/successToast";
import { errorToast } from "../../../../components/Toast/errorToast";
import { statusOptions } from "../../../../mockData";
import { useNavigate } from "react-router-dom";
import ViewTaskModal from "./ViewTaskModal";

const TaskList = () => {
  const [taskList, setTaskList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddEdit, setShowAddEdit] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteTask, setDeleteTask] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const navigate = useNavigate();

  // Form defaults
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Medium",
    task_type: "",
    start_date: "",
    end_date: "",
    assign_by: "",
    assign_to: [],
    task_category_id: "",
    status: "To Do",
    project_id: "",
  });

  // Fetch all tasks
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/v1/admin/task");
      if (res.data.success) {
        setTaskList(res.data.data || []);
      }
    } catch (err) {
      console.error("Error fetching tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Add/Edit task handler
  const handleAddOrUpdateTask = async (data) => {
    try {
      const loggedInUser = JSON.parse(sessionStorage.getItem("employee_id"));
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

  // Edit task
  const handleEdit = (task) => {
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

  // Delete task
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

  return (
    <>
      <Row className="mt-4">
        <Col sm="12">
          <Card>
            <Card.Header
              className="d-flex justify-content-between"
              style={{ padding: "15px" }}
            >
              <h5 className="card-title fw-lighter">Tasks</h5>
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
                    status: "To Do",
                    project_id: "",
                  });
                  setEditTask(null);
                  setShowAddEdit(true);
                }}
              >
                + Add Task
              </Button>
            </Card.Header>
            <Card.Body className="px-0 pt-3">
              {loading ? (
                <div className="text-center my-4">
                  <Spinner animation="border" />
                </div>
              ) : (
                <div className="table-responsive">
                  <Table hover responsive>
                    <thead>
                      <tr className="table-gray">
                        <th>Sr. No.</th>
                        <th>Title</th>
                        <th>Project</th>
                        <th>Assigned To</th>
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
                            <td className="text-center">
                              <div className="d-flex justify-content-center">
                                {task.assign_to_details
                                  ?.slice(0, 3)
                                  .map((m, i) => (
                                    <img
                                      key={i}
                                      src={m.photo || avatarPic}
                                      title={m.name}
                                      className="rounded-circle me-1"
                                      style={{
                                        width: "25px",
                                        height: "25px",
                                        objectFit: "cover",
                                        cursor: "pointer",
                                        zIndex: 10 - i,
                                        marginLeft: "-15px",
                                      }}
                                      onClick={() =>
                                        navigate(`/view-employee/${m.id}`)
                                      }
                                    />
                                  ))}
                                {task.assign_to_details?.length > 3 && (
                                  <div
                                    className="rounded-circle d-flex align-items-center justify-content-center bg-light text-dark"
                                    style={{
                                      width: "25px",
                                      height: "25px",
                                      fontSize: "12px",
                                      border: "1px solid #ccc",
                                      cursor: "pointer",
                                    }}
                                  >
                                    +{task.assign_to_details.length - 3}
                                  </div>
                                )}
                              </div>
                            </td>
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
                                color="primary" // grayish tone
                                style={{ cursor: "pointer" }}
                                onClick={() => setSelectedTask(task)}
                                className="me-2"
                              />

                              <CreateTwoToneIcon
                                color="primary" // blue
                                onClick={() => handleEdit(task)}
                                style={{ cursor: "pointer" }}
                                className="me-2"
                              />

                              <DeleteRoundedIcon
                                color="error" // red
                                onClick={() => {
                                  setDeleteTask(task);
                                  setShowDelete(true);
                                }}
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
