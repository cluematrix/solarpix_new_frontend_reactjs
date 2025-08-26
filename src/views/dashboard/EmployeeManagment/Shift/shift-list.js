import React, { useState, useEffect } from "react";
import { Card, Row, Col, Button, Badge, Form } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CreateTwoToneIcon from "@mui/icons-material/CreateTwoTone";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import AddEditModal from "../Shift/add-edit-modal";
import DeleteModal from "../Shift/delete-modal";
import api from "../../../../api/axios";

const ShiftList = () => {
  const [shiftList, setShiftList] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editId, setEditId] = useState(null);
  const [showAddEdit, setShowAddEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  // Fetch Shifts
  const fetchShifts = () => {
    api
      .get("/api/v1/admin/shift")
      .then((res) => {
        if (Array.isArray(res.data)) {
          setShiftList(res.data);
        } else if (Array.isArray(res.data.data)) {
          setShiftList(res.data.data);
        } else {
          setShiftList([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching shifts:", err);
        toast.error("Failed to fetch shifts");
        setShiftList([]);
      });
  };

  useEffect(() => {
    fetchShifts();
  }, []);

  // Add or Update Shift
  const handleAddOrUpdateShift = (data) => {
    if (!data.shift_name.trim()) {
      toast.warning("Shift name is required");
      return;
    }

    const payload = {
      ...data,
      is_active: Number(data.is_active), // ensure 0 or 1
    };

    if (editId) {
      // update
      api
        .put(`/api/v1/admin/shift/${editId}`, payload)
        .then(() => {
          toast.success("Shift updated successfully");
          fetchShifts();
          resetForm();
        })
        .catch((err) => {
          console.error("Error updating shift:", err);
          toast.error(err.response?.data?.message || "Failed to update shift");
        });
    } else {
      // add
      api
        .post("/api/v1/admin/shift", payload)
        .then(() => {
          toast.success("Shift added successfully");
          fetchShifts();
          resetForm();
        })
        .catch((err) => {
          console.error("Error adding shift:", err);
          toast.error(err.response?.data?.message || "Failed to add shift");
        });
    }
  };

  // Toggle status directly
  const handleToggleStatus = (id, currentStatus) => {
    const newStatus = currentStatus === 1 ? 0 : 1;

    // Optimistic update
    setShiftList((prev) =>
      prev.map((shift) =>
        shift.id === id ? { ...shift, is_active: newStatus } : shift
      )
    );

    // API update
    api
      .put(`/api/v1/admin/shift/${id}`, { is_active: newStatus })
      .then(() => {
        toast.success("Status updated successfully");
      })
      .catch((err) => {
        console.error("Status update failed:", err);
        toast.error(err.response?.data?.message || "Failed to update status");
        // rollback
        setShiftList((prev) =>
          prev.map((shift) =>
            shift.id === id ? { ...shift, is_active: currentStatus } : shift
          )
        );
      });
  };

  // Edit
  const handleEdit = (index) => {
    const shift = shiftList[index];
    setEditIndex(index);
    setEditId(shift.id || shift._id);
    setShowAddEdit(true);
  };

  // Delete
  const handleDeleteConfirm = () => {
    if (!deleteId) return;
    api
      .delete(`/api/v1/admin/shift/${deleteId}`)
      .then(() => {
        toast.success("Shift deleted successfully");
        fetchShifts();
        setShowDelete(false);
      })
      .catch((err) => {
        console.error("Error deleting shift:", err);
        toast.error(err.response?.data?.message || "Failed to delete shift");
      });
  };

  const resetForm = () => {
    setShowAddEdit(false);
    setEditIndex(null);
    setEditId(null);
  };

  const formatTime12Hour = (timeString) => {
    if (!timeString) return "";
    const [h, m] = timeString.split(":");
    let hours = parseInt(h, 10);
    const minutes = m.padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours.toString().padStart(2, "0")}:${minutes} ${ampm}`;
  };

  return (
    <>
      <Row>
        <Col sm="12">
          <Card>
            <Card.Header className="d-flex justify-content-between">
              <h4 className="card-title">Shift</h4>
              <Button onClick={() => setShowAddEdit(true)}>+ Add Shift</Button>
            </Card.Header>
            <Card.Body className="px-0">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Sr. No.</th>
                      <th>Shift Name</th>
                      <th>Start Time</th>
                      <th>End Time</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shiftList.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center">
                          No Shift Found
                        </td>
                      </tr>
                    ) : (
                      shiftList.map((item, idx) => (
                        <tr key={item.id || item._id}>
                          <td>{idx + 1}</td>
                          <td>{item.shift_name}</td>
                          <td>{formatTime12Hour(item.start_time)}</td>
                          <td>{formatTime12Hour(item.end_time)}</td>

                          {/* ✅ Status column shows badge */}
                          <td>
                            {item.is_active === 1 ? (
                              <Badge bg="success">Active</Badge>
                            ) : (
                              <Badge bg="danger">Inactive</Badge>
                            )}
                          </td>

                          {/* ✅ Action column: toggle + edit + delete */}
                          <td className="d-flex align-items-center">
                            <Form.Check
                              type="switch"
                              id={`status-switch-${item.id}`}
                              checked={item.is_active === 1}
                              onChange={() =>
                                handleToggleStatus(item.id, item.is_active)
                              }
                              className="me-3"
                            />

                            <CreateTwoToneIcon
                              className="me-2"
                              onClick={() => handleEdit(idx)}
                              color="primary"
                              style={{ cursor: "pointer" }}
                            />
                            <DeleteRoundedIcon
                              onClick={() => {
                                setDeleteIndex(idx);
                                setDeleteId(item.id || item._id);
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
                </table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Add/Edit Modal */}
      <AddEditModal
        show={showAddEdit}
        handleClose={resetForm}
        onSave={handleAddOrUpdateShift}
        editData={editIndex !== null ? shiftList[editIndex] : null}
      />

      {/* Delete Confirmation */}
      <DeleteModal
        show={showDelete}
        handleClose={() => {
          setShowDelete(false);
          setDeleteIndex(null);
          setDeleteId(null);
        }}
        onConfirm={handleDeleteConfirm}
        modalTitle="Delete Shift"
        modalMessage={
          deleteIndex !== null && shiftList[deleteIndex]
            ? `Are you sure you want to delete "${shiftList[deleteIndex].shift_name}"?`
            : ""
        }
      />

      {/* Toast container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default ShiftList;
