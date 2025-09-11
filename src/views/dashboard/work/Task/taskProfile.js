import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Card,
  Spinner,
  Button,
  Table,
  Pagination,
} from "react-bootstrap";
import { useParams } from "react-router-dom";
import api from "../../../../api/axios";
import AddEditTaskModal from "./add-edit-modal";

const TaskProfile = () => {
  const { id } = useParams(); // Get ID from URL
  const [task, setTask] = useState({});
  const [loading, setLoading] = useState(false);
  const [showAddEdit, setShowAddEdit] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const rolesPerPage = 10;
  const indexOfLastRole = currentPage * rolesPerPage;
  const indexOfFirstRole = indexOfLastRole - rolesPerPage;
  const totalPages = Math.ceil(task.length / rolesPerPage);
  const currentTask = task
    ? task?.slice(indexOfFirstRole, indexOfLastRole)
    : [];

  console.log("Component Mounted, ID:", id);

  const taskEmpById = async () => {
    console.log("taskEmpById called with ID:", id);
    try {
      // setLoading(true);
      const res = await api.get(`/api/v1/admin/task/${id}`);
      console.log("API Response:", res);
      setTask(res.data.data || []);
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("useEffect running...");
    if (id) {
      taskEmpById();
    } else {
      console.warn("ID is missing, cannot fetch");
    }
  }, [id]);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }

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
                onClick={() => setShowAddEdit(true)}
              >
                + Add Task
              </Button>
            </Card.Header>

            <Card.Body className="px-0 pt-3">
              {loading ? (
                <div className="loader-div">
                  <Spinner className="spinner" animation="border" />
                </div>
              ) : (
                <div className="table-responsive">
                  <Table hover responsive className="table">
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
                      {currentTask.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="text-center">
                            No tasks available
                          </td>
                        </tr>
                      ) : (
                        currentTask.map((item, idx) => (
                          <tr key={idx}>
                            <td>{idx + 1}</td>
                            <td>{item.title}</td>
                            <td>{item.project}</td>
                            <td>{item.category}</td>
                            <td>{item.status}</td>
                            <td>{item.assignedTo}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </Table>
                </div>
              )}
              {totalPages > 1 && (
                <Pagination className="justify-content-center mt-3">
                  <Pagination.First
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                  />
                  <Pagination.Prev
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
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
                  <Pagination.Next
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                  />
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
      {/* Add/Edit Modal */}
      <AddEditTaskModal show={showAddEdit} />
    </>
  );
};

export default TaskProfile;
