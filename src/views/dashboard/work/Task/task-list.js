import React, { useEffect, useState } from "react";
import { Card, Row, Col, Button, Table, Spinner, Modal } from "react-bootstrap";
import CreateTwoToneIcon from "@mui/icons-material/CreateTwoTone";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import VisibilityIcon from "@mui/icons-material/Visibility"; // 👁 eye icon
import AddEditTaskModal from "./add-edit-modal";
import DeleteModal from "./delete-modal";
import api from "../../../../api/axios";

const TaskList = () => {
  const [taskList, setTaskList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    project: "",
    startDate: "",
    dueDate: "",
    withoutDueDate: false,
    status: "Incomplete",
    projectMembers: [],
    description: "",
  });

  const [editTask, setEditTask] = useState(null);
  const [showAddEdit, setShowAddEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteTask, setDeleteTask] = useState(null);

  const [showTaskDetails, setShowTaskDetails] = useState(false);
  const [showMembersOnly, setShowMembersOnly] = useState(false);

  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedMembers, setSelectedMembers] = useState([]);

  // Fetch tasks from API
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

  // Add or Update Task
  const handleAddOrUpdateTask = async (data) => {
    try {
      const loggedInUser = JSON.parse(sessionStorage.getItem("employee_id"));
      alert(loggedInUser);
      const assignById = loggedInUser;

      const payload = {
        title: data.title,
        description: data.description,
        start_date: data.startDate,
        end_date: data.withoutDueDate ? null : data.dueDate,
        project_id: data.project,
        category_id: data.category,
        status: data.status,
        assign_to: data.projectMembers,
        assign_by: assignById,
      };

      if (editTask) {
        await api.put(`/api/v1/admin/task/${editTask.id}`, payload);
      } else {
        await api.post("/api/v1/admin/task", payload);
      }

      fetchTasks();
    } catch (err) {
      console.error("Error saving task:", err.response?.data || err);
    } finally {
      setShowAddEdit(false);
      setEditTask(null);
    }
  };

  // Edit Task
  const handleEdit = (task) => {
    setFormData({
      title: task.title,
      category: task.category?.id || "",
      project: task.project?.id || "",
      startDate: task.start_date?.split("T")[0] || "",
      dueDate: task.end_date?.split("T")[0] || "",
      withoutDueDate: !task.end_date,
      status: task.status,
      projectMembers: task.assign_to || [],
      description: task.description,
    });
    setEditTask(task);
    setShowAddEdit(true);
  };

  // Delete Task
  const handleDeleteConfirm = async () => {
    if (deleteTask) {
      try {
        await api.delete(`/api/v1/admin/task/${deleteTask.id}`);
        fetchTasks();
      } catch (err) {
        console.error("Error deleting task:", err);
      }
    }
    setShowDelete(false);
    setDeleteTask(null);
  };

  // Open Task Details modal
  const handleViewTask = (task) => {
    setSelectedTask(task);
    setShowTaskDetails(true);
  };

  // Open Members Only modal
  const handleShowMembers = (members) => {
    setSelectedMembers(members || []);
    setShowMembersOnly(true);
  };

  return (
    <>
      <Row className="mt-4">
        <Col sm="12">
          <Card>
            <Card.Header
              className="d-flex justify-content-between"
              style={{ padding: "15px 15px 0px 15px" }}
            >
              <h5 className="card-title fw-lighter">Tasks</h5>
              <Button
                className="btn-primary"
                onClick={() => {
                  setFormData({
                    title: "",
                    category: "",
                    project: "",
                    startDate: "",
                    dueDate: "",
                    withoutDueDate: false,
                    status: "Incomplete",
                    projectMembers: [],
                    description: "",
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
                  <Table hover responsive className="table">
                    <thead>
                      <tr className="table-gray">
                        <th>Sr. No.</th>
                        <th>Title</th>
                        <th>Project</th>
                        {/* <th>Category</th> */}
                        <th>Status</th>
                        <th>Assigned To</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {taskList.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="text-center">
                            No tasks available
                          </td>
                        </tr>
                      ) : (
                        taskList.map((item, idx) => (
                          <tr key={item.id}>
                            <td>{idx + 1}</td>
                            <td>{item.title}</td>
                            <td>{item.project?.project_name || "-"}</td>
                            {/* <td>{item.category?.category || "-"}</td> */}
                            <td>{item.status}</td>
                            <td>
                              {item.assign_to_details?.length > 0 ? (
                                <VisibilityIcon
                                  style={{ cursor: "pointer" }}
                                  color="primary"
                                  onClick={() =>
                                    handleShowMembers(item.assign_to_details)
                                  }
                                />
                              ) : (
                                "-"
                              )}
                            </td>
                            <td>
                              {item.assign_to_details?.length > 0 ? (
                                <VisibilityIcon
                                  style={{ cursor: "pointer" }}
                                  color="primary"
                                  onClick={() => handleViewTask(item)}
                                  className="me-2"
                                />
                              ) : (
                                "-"
                              )}
                              <CreateTwoToneIcon
                                className="me-2"
                                onClick={() => handleEdit(item)}
                                color="primary"
                                style={{ cursor: "pointer" }}
                              />
                              <DeleteRoundedIcon
                                onClick={() => {
                                  setDeleteTask(item);
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

      {/* Task Details Modal */}
      <Modal
        show={showTaskDetails}
        onHide={() => setShowTaskDetails(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Task Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTask ? (
            <div>
              <p>
                <strong>Title:</strong> {selectedTask.title}
              </p>
              <p>
                <strong>Project:</strong>{" "}
                {selectedTask.project?.project_name || "-"}
              </p>
              <p>
                <strong>Category:</strong>{" "}
                {selectedTask.category?.category || "-"}
              </p>
              <p>
                <strong>Status:</strong> {selectedTask.status}
              </p>
              <p>
                <strong>Start Date:</strong>{" "}
                {selectedTask.start_date?.split("T")[0] || "-"}
              </p>
              <p>
                <strong>Due Date:</strong>{" "}
                {selectedTask.end_date?.split("T")[0] || "No Due Date"}
              </p>
              <p>
                <strong>Description:</strong> {selectedTask.description || "-"}
              </p>

              <hr />
              <h6>Assigned Members</h6>
              {selectedTask.assign_to_details?.length > 0 ? (
                <ul>
                  {selectedTask.assign_to_details.map((m) => (
                    <li key={m.id}>{m.name}</li>
                  ))}
                </ul>
              ) : (
                <p>No members assigned.</p>
              )}
            </div>
          ) : (
            <p>No task details available.</p>
          )}
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>

      {/* Members Only Modal */}
      <Modal show={showMembersOnly} onHide={() => setShowMembersOnly(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Assigned Members</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedMembers.length > 0 ? (
            <ul>
              {selectedMembers.map((m) => (
                <li key={m.id}>
                  <strong>{m.name}</strong>
                </li>
              ))}
            </ul>
          ) : (
            <p>No members assigned.</p>
          )}
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>

      {/* Add/Edit Task Modal */}
      <AddEditTaskModal
        show={showAddEdit}
        handleClose={() => {
          setShowAddEdit(false);
          setEditTask(null);
        }}
        formData={formData}
        setFormData={setFormData}
        onSave={handleAddOrUpdateTask}
        editData={!!editTask}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        show={showDelete}
        handleClose={() => {
          setShowDelete(false);
          setDeleteTask(null);
        }}
        onConfirm={handleDeleteConfirm}
        modalTitle="Delete Task"
        modalMessage={
          deleteTask
            ? `Are you sure you want to delete "${deleteTask.title}"?`
            : ""
        }
      />
    </>
  );
};

export default TaskList;
