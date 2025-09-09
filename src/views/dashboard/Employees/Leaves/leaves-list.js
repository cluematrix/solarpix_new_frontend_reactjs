import React, { useState, useEffect } from "react";
import { Card, Row, Col, Button, Spinner, Form, Table } from "react-bootstrap";
import CreateTwoToneIcon from "@mui/icons-material/CreateTwoTone";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddEditLeaveModal from "./add-edit-modal";
import ViewLeaveModal from "./view-modal"; // new modal
import api from "../../../../api/axios";
import Select from "react-select";
const LeaveList = () => {
  const [leaveList, setLeaveList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editIndex, setEditIndex] = useState(null);
  const [showAddEdit, setShowAddEdit] = useState(false);

  const [viewData, setViewData] = useState(null); // for view modal

  // 🔹 Fetch leaves from API
  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/v1/admin/employeeLeave");

      // Adjust based on API response structure
      if (Array.isArray(res.data)) {
        setLeaveList(res.data);
      } else if (Array.isArray(res.data.data)) {
        setLeaveList(res.data.data);
      } else {
        setLeaveList([]);
      }
    } catch (error) {
      console.error("Error fetching leaves:", error);
      setLeaveList([]); // prevent crash
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const statusOptions = [
    { value: "pending", label: "⏳ Pending" },
    { value: "approve", label: "✅ Approve" },
    { value: "reject", label: "❌ Reject" },
  ];
  const handleSaveLeave = (data) => {
    if (editIndex !== null) {
      const updatedList = [...leaveList];
      updatedList[editIndex] = data;
      setLeaveList(updatedList);
    } else {
      setLeaveList([...leaveList, data]);
    }
    setEditIndex(null);
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setShowAddEdit(true);
  };

  // 🔹 Delete leave by ID
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this leave request?"
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`/api/v1/admin/employeeLeave/${id}`);
      setLeaveList(leaveList.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting leave:", error);
      alert("Failed to delete leave. Please try again.");
    }
  };

  // 🔹 Update status
  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/api/v1/admin/employeeLeave/${id}`, { status: newStatus });
      setLeaveList((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: newStatus } : item
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status. Please try again.");
    }
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
              <h5 className="card-title fw-lighter">Leave Requests</h5>
              <Button
                className="btn-primary"
                onClick={() => setShowAddEdit(true)}
              >
                + Add Leave
              </Button>
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
                        <th>Employee</th>
                        <th>Leave Type</th>
                        <th>Duration</th>
                        <th>Reason</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaveList.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="text-center ">
                            No leave requests available
                          </td>
                        </tr>
                      ) : (
                        leaveList.map((item, idx) => (
                          <tr key={item.id}>
                            <td>{idx + 1}</td>
                            <td>{item.employee?.name}</td>
                            <td>{item.leaveType?.leave_type}</td>
                            <td>{item.duration}</td>
                            <td>{item.reason}</td>
                            <td>
                              <Form.Select
                                size="sm"
                                className={`status-dropdown text-black ${
                                  item.status === "pending"
                                    ? "status-pending"
                                    : item.status === "approve"
                                    ? "status-approve"
                                    : "status-reject"
                                }`}
                                value={item.status}
                                onChange={(e) =>
                                  handleStatusChange(item.id, e.target.value)
                                }
                              >
                                <option value="pending">⏳ Pending</option>
                                <option value="approve">✅ Approve</option>
                                <option value="reject">❌ Reject</option>
                              </Form.Select>
                            </td>

                            <td>
                              <VisibilityIcon
                                className="me-2"
                                onClick={() => setViewData(item)}
                                color="action"
                                style={{ cursor: "pointer" }}
                              />
                              <CreateTwoToneIcon
                                className="me-2"
                                onClick={() => handleEdit(idx)}
                                color="primary"
                                style={{ cursor: "pointer" }}
                              />
                              <DeleteRoundedIcon
                                onClick={() => handleDelete(item.id)}
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

      {/* Add/Edit Modal */}
      <AddEditLeaveModal
        show={showAddEdit}
        handleClose={() => {
          setShowAddEdit(false);
          setEditIndex(null);
        }}
        onSave={handleSaveLeave}
        editData={editIndex !== null ? leaveList[editIndex] : null}
      />

      {/* View Modal */}
      {viewData && (
        <ViewLeaveModal
          show={!!viewData}
          handleClose={() => setViewData(null)}
          data={viewData}
        />
      )}
    </>
  );
};

export default LeaveList;
