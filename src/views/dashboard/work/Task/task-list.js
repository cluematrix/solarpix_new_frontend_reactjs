import React, { useState } from "react";
import { Card, Row, Col, Button, Table } from "react-bootstrap";
import CreateTwoToneIcon from "@mui/icons-material/CreateTwoTone";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import AddEditTaskModal from "./add-edit-modal";
import DeleteModal from "./delete-modal";

const TaskList = () => {
  const [taskList, setTaskList] = useState([
    {
      title: "Design Homepage",
      category: "UI/UX",
      project: "Website Redesign",
      startDate: "2025-08-12",
      dueDate: "2025-08-20",
      withoutDueDate: false,
      status: "Incomplete",
      assignedTo: "Rohit Sharma",
      description: "Create homepage mockups and prototypes.",
    },
  ]);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    project: "",
    startDate: "",
    dueDate: "",
    withoutDueDate: false,
    status: "Incomplete",
    assignedTo: "",
    description: "",
  });

  const [editIndex, setEditIndex] = useState(null);
  const [showAddEdit, setShowAddEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const resetForm = () => {
    setFormData({
      title: "",
      category: "",
      project: "",
      startDate: "",
      dueDate: "",
      withoutDueDate: false,
      status: "Incomplete",
      assignedTo: "",
      description: "",
    });
    setEditIndex(null);
  };

  const handleAddOrUpdateTask = (data) => {
    if (!data.title.trim()) return;

    if (editIndex !== null) {
      const updatedList = [...taskList];
      updatedList[editIndex] = data;
      setTaskList(updatedList);
    } else {
      setTaskList([...taskList, data]);
    }

    setShowAddEdit(false);
    resetForm();
  };

  const handleEdit = (index) => {
    setFormData(taskList[index]);
    setEditIndex(index);
    setShowAddEdit(true);
  };

  const handleDeleteConfirm = () => {
    if (deleteIndex !== null) {
      setTaskList(taskList.filter((_, i) => i !== deleteIndex));
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
              <h5 className="card-title fw-lighter">Tasks</h5>
              <Button
                className="btn-primary"
                onClick={() => {
                  resetForm();
                  setShowAddEdit(true);
                }}
              >
                + Add Task
              </Button>
            </Card.Header>

            <Card.Body className="px-0">
              <div className="table-responsive">
                <Table className="table">
                  <thead>
                    <tr className="table-gray">
                      <th>Sr. No.</th>
                      <th>Title</th>
                      <th>Project</th>
                      <th>Category</th>
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
                        <tr key={idx}>
                          <td>{idx + 1}</td>
                          <td>{item.title}</td>
                          <td>{item.project}</td>
                          <td>{item.category}</td>
                          <td>{item.status}</td>
                          <td>{item.assignedTo}</td>
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
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Add/Edit Modal */}
      <AddEditTaskModal
        show={showAddEdit}
        handleClose={() => {
          setShowAddEdit(false);
          resetForm();
        }}
        formData={formData}
        setFormData={setFormData}
        onSave={handleAddOrUpdateTask}
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
        modalTitle="Delete Task"
        modalMessage={
          deleteIndex !== null
            ? `Are you sure you want to delete task "${taskList[deleteIndex].title}"?`
            : ""
        }
      />
    </>
  );
};

export default TaskList;
