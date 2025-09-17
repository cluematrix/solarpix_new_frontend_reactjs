import React, { useState, useEffect } from "react";
import { Card, Row, Col, Button, Spinner, Table } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import CreateTwoToneIcon from "@mui/icons-material/CreateTwoTone";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import AddEditModal from "./add-edit-modal";
import DeleteModal from "./delete-modal";
import api from "../../../../api/axios";
import { useLocation } from "react-router";

const LeaveType = () => {
  const [leaveList, setLeaveList] = useState([]);
  const [leaveData, setLeaveData] = useState({
    leave_type: "",
    no_of_leave: "",
    leave_paid_status: "paid",
    color: "#000000",
  });
  const [editId, setEditId] = useState(null);

  const [showAddEdit, setShowAddEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const { pathname } = useLocation();
  const [permissions, setPermissions] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = leaveList.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(leaveList.length / itemsPerPage);

  const [loading, setLoading] = useState(true);

  // 🔑 Fetch Permissions
  const FETCHPERMISSION = async () => {
    try {
      const res = await api.get("/api/v1/admin/rolePermission");

      let data = [];
      if (Array.isArray(res.data)) {
        data = res.data;
      } else if (Array.isArray(res.data.data)) {
        data = res.data.data;
      }

      const roleId = String(sessionStorage.getItem("roleId"));
      console.log(roleId, "roleId from sessionStorage");
      console.log(pathname, "current pathname");

      // ✅ Match current role + route
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
        });
      } else {
        setPermissions(null);
      }
    } catch (err) {
      console.error("Error fetching roles:", err);
      setPermissions(null);
    } finally {
      setLoading(false); //  Stop loader after API call
    }
  };
  useEffect(() => {
    setLoading(true);

    FETCHPERMISSION();
  }, [pathname]);

  // 🔄 Fetch Leave Types
  const fetchLeaveTypes = () => {
    api
      .get("/api/v1/admin/leaveType")
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data.data || [];
        setLeaveList(data);
      })
      .catch((err) => {
        console.error("Error fetching leave types:", err);
        toast.error("Failed to fetch leave types");
        setLeaveList([]);
      });
  };

  useEffect(() => {
    fetchLeaveTypes();
  }, []);

  // ✅ Add or Update
  const handleAddOrUpdate = () => {
    if (!leaveData.leave_type.trim()) {
      toast.warning("Leave type is required");
      return;
    }

    if (editId) {
      api
        .put(`/api/v1/admin/leaveType/${editId}`, leaveData)
        .then(() => {
          toast.success("Leave Type updated successfully");
          fetchLeaveTypes();
          resetForm();
        })
        .catch((err) => {
          console.error("Error updating leave type:", err);
          toast.error(
            err.response?.data?.message || "Failed to update leave type"
          );
        });
    } else {
      api
        .post("/api/v1/admin/leaveType", leaveData)
        .then(() => {
          toast.success("Leave Type added successfully");
          fetchLeaveTypes();
          resetForm();
        })
        .catch((err) => {
          console.error("Error adding leave type:", err);
          toast.error(
            err.response?.data?.message || "Failed to add leave type"
          );
        });
    }
  };

  // ✅ Edit
  const handleEdit = (index) => {
    const leave = leaveList[index];
    setLeaveData({
      leave_type: leave.leave_type,
      no_of_leave: leave.no_of_leave,
      leave_paid_status: leave.leave_paid_status,
      color: leave.color || "#000000",
    });
    setEditId(leave.id);
    setShowAddEdit(true);
  };

  // ✅ Delete
  const handleDeleteConfirm = () => {
    if (!deleteId) return;
    api
      .delete(`/api/v1/admin/leaveType/${deleteId}`)
      .then(() => {
        toast.success("Leave Type deleted successfully");
        fetchLeaveTypes();
        setShowDelete(false);
      })
      .catch((err) => {
        console.error("Error deleting leave type:", err);
        toast.error(
          err.response?.data?.message || "Failed to delete leave type"
        );
      });
  };

  const resetForm = () => {
    setShowAddEdit(false);
    setLeaveData({
      leave_type: "",
      no_of_leave: "",
      leave_paid_status: "paid",
      color: "#000000",
    });
    setEditId(null);
  };

  //  Loader while checking permissions
  if (loading) {
    return (
      <div className="loader-div">
        <Spinner animation="border" className="spinner" />
      </div>
    );
  }
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
              <h5 className="card-title fw-lighter">Leave Type</h5>
              {permissions.add && (
                <Button
                  className="btn-primary"
                  onClick={() => setShowAddEdit(true)}
                >
                  + Add Leave Type
                </Button>
              )}
            </Card.Header>

            <Card.Body className="px-0 pt-3">
              <div className="table-responsive">
                <Table hover responsive className="table">
                  <thead>
                    <tr className="table-gray">
                      <th>Sr. No.</th>
                      <th>Leave Type</th>
                      <th>No. of Leaves</th>
                      <th>Paid Status</th>
                      <th>Color</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center">
                          No Leave Type available
                        </td>
                      </tr>
                    ) : (
                      currentItems.map((item, idx) => (
                        <tr key={item.id}>
                          <td>{indexOfFirstItem + idx + 1}</td>
                          <td>{item.leave_type}</td>
                          <td>{item.no_of_leave}</td>
                          <td>{item.leave_paid_status}</td>
                          <td>
                            <span
                              style={{
                                display: "inline-block",
                                width: "20px",
                                height: "20px",
                                backgroundColor: item.color,
                                borderRadius: "50%",
                              }}
                            ></span>
                          </td>
                          <td className="d-flex align-items-center">
                            {permissions.edit && (
                              <CreateTwoToneIcon
                                className="me-2"
                                onClick={() =>
                                  handleEdit(indexOfFirstItem + idx)
                                }
                                color="primary"
                                style={{ cursor: "pointer" }}
                              />
                            )}
                            {permissions.del && (
                              <DeleteRoundedIcon
                                onClick={() => {
                                  setDeleteIndex(indexOfFirstItem + idx);
                                  setDeleteId(item.id);
                                  setShowDelete(true);
                                }}
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
        handleClose={resetForm}
        leaveData={leaveData}
        setLeaveData={setLeaveData}
        onSave={handleAddOrUpdate}
        modalTitle={editId ? "Update Leave Type" : "Add New Leave Type"}
        buttonLabel={editId ? "Update" : "Submit"}
      />

      {/* Delete Modal */}
      <DeleteModal
        show={showDelete}
        handleClose={() => {
          setShowDelete(false);
          setDeleteIndex(null);
          setDeleteId(null);
        }}
        onConfirm={handleDeleteConfirm}
        modalTitle="Delete Leave Type"
        modalMessage={
          deleteIndex !== null && leaveList[deleteIndex]
            ? `Are you sure you want to delete "${leaveList[deleteIndex].leave_type}"?`
            : ""
        }
      />

      {/* ✅ Toast */}
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default LeaveType;
