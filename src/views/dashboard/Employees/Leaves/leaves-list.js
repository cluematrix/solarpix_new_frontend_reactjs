import React, { useState, useEffect } from "react";
import { Card, Row, Col, Button, Spinner, Form, Table } from "react-bootstrap";
import CreateTwoToneIcon from "@mui/icons-material/CreateTwoTone";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddEditLeaveModal from "./add-edit-modal";
import ViewLeaveModal from "./view-modal";
import api from "../../../../api/axios";
import { useLocation } from "react-router-dom";
import { successToast } from "../../../../components/Toast/successToast";
import { errorToast } from "../../../../components/Toast/errorToast";

const LeaveList = () => {
  const [leaveList, setLeaveList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [permissions, setPermissions] = useState(null);
  const [permLoading, setPermLoading] = useState(true);

  const [editIndex, setEditIndex] = useState(null);
  const [showAddEdit, setShowAddEdit] = useState(false);
  const [viewData, setViewData] = useState(null);

  const { pathname } = useLocation();

  // 🔹 Fetch role permissions
  const FETCHPERMISSION = async () => {
    setPermLoading(true);
    try {
      const res = await api.get("/api/v1/admin/rolePermission");

      let data = [];
      if (Array.isArray(res.data)) {
        data = res.data;
      } else if (Array.isArray(res.data.data)) {
        data = res.data.data;
      }

      const roleId = String(sessionStorage.getItem("roleId"));

      // ✅ Super Admin gets full access
      if (roleId === "1") {
        setPermissions({
          view: true,
          add: true,
          edit: true,
          del: true,
          any_one: true, // admin has implicit full access
        });
        return;
      }

      // ✅ Find permission based on current route
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
            matchedPermission.any_one === 1, // ✅ added this
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

  useEffect(() => {
    FETCHPERMISSION();
  }, [pathname]);

  // 🔹 Fetch leaves (with any_one logic)
  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const roleId = String(sessionStorage.getItem("roleId"));
      const empId = String(sessionStorage.getItem("employee_id"));
      const res = await api.get("/api/v1/admin/employeeLeave");

      const allLeaves = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data.data)
        ? res.data.data
        : [];

      // 🧠 Logic based on role + permission.any_one
      if (roleId === "1") {
        // 👑 Super Admin - show all
        setLeaveList(allLeaves);
      } else if (permissions?.any_one) {
        // 🌍 Role with any_one access - show all
        setLeaveList(allLeaves);
      } else {
        // 👤 Normal Employee - show only their leaves
        const filtered = allLeaves.filter(
          (leave) => String(leave.employee_id) === empId
        );
        setLeaveList(filtered);
      }
    } catch (error) {
      console.error("Error fetching leaves:", error);
      errorToast("Failed to fetch leave requests");
      setLeaveList([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch leave data only after permissions are loaded
  useEffect(() => {
    if (!permLoading && permissions?.view) {
      fetchLeaves();
    }
  }, [permLoading, permissions]);

  // 🔹 Save leave locally after modal submit
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
      successToast("Leave deleted successfully");
      setLeaveList(leaveList.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting leave:", error);
      errorToast("Failed to delete leave");
    }
  };

  // 🔹 Update leave status
  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/api/v1/admin/employeeLeave/${id}`, { status: newStatus });
      successToast("Leave status updated");
      setLeaveList((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: newStatus } : item
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
      errorToast("Failed to update status");
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
              {permissions.add && (
                <Button
                  className="btn-primary"
                  onClick={() => setShowAddEdit(true)}
                >
                  + Add Leave
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
                          <td colSpan="7" className="text-center">
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
                              {permissions.edit ? (
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
                                  disabled={
                                    String(sessionStorage.getItem("roleId")) !==
                                    "1"
                                  } // 🔒 disable for non-admins
                                  onChange={(e) =>
                                    handleStatusChange(item.id, e.target.value)
                                  }
                                >
                                  <option value="pending">⏳ Pending</option>
                                  <option value="approve">✅ Approve</option>
                                  <option value="reject">❌ Reject</option>
                                </Form.Select>
                              ) : (
                                <span>{item.status}</span>
                              )}
                            </td>
                            <td>
                              <VisibilityIcon
                                className="me-2"
                                onClick={() => setViewData(item)}
                                color="action"
                                style={{ cursor: "pointer" }}
                              />
                              {permissions.edit && (
                                <CreateTwoToneIcon
                                  className="me-2"
                                  onClick={() => handleEdit(idx)}
                                  color="primary"
                                  style={{ cursor: "pointer" }}
                                />
                              )}
                              {permissions.del && (
                                <DeleteRoundedIcon
                                  onClick={() => handleDelete(item.id)}
                                  color="error"
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
