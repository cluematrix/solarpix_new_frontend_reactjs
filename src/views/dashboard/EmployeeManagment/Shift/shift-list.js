// modify by sufyan on 16/10/2025

import React, { useState, useEffect } from "react";
import { Card, Row, Col, Pagination, Spinner, Table } from "react-bootstrap";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CreateTwoToneIcon from "@mui/icons-material/CreateTwoTone";
import AddEditModal from "../Shift/add-edit-modal";
import DeleteModal from "../Shift/delete-modal";
import api from "../../../../api/axios";
import { useLocation } from "react-router";

const ShiftList = () => {
  const [shiftList, setShiftList] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editId, setEditId] = useState(null);
  const [showAddEdit, setShowAddEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const { pathname } = useLocation();
  const [permissions, setPermissions] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [loading, setLoading] = useState(true);

  // Fetch Permission
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

      const matchedPermission = data.find(
        (perm) =>
          String(perm.role_id) === roleId && perm.display_name === "Office Time" // 👈 change this string as per your DB config
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

  // Add / Update Shift
  const handleAddOrUpdateShift = (data) => {
    if (!data.shift_name.trim()) {
      toast.warning("Shift name is required");
      return;
    }

    const payload = {
      ...data,
      is_active: Number(data.is_active),
    };

    if (editId) {
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

  // 🔄 Toggle Status
  const handleToggleStatus = (id, currentStatus) => {
    const newStatus = currentStatus === 1 ? 0 : 1;
    setShiftList((prev) =>
      prev.map((shift) =>
        shift.id === id ? { ...shift, is_active: newStatus } : shift
      )
    );

    api
      .put(`/api/v1/admin/shift/${id}`, { is_active: newStatus })
      .then(() => {
        toast.success("Status updated successfully");
      })
      .catch((err) => {
        console.error("Status update failed:", err);
        toast.error(err.response?.data?.message || "Failed to update status");
        setShiftList((prev) =>
          prev.map((shift) =>
            shift.id === id ? { ...shift, is_active: currentStatus } : shift
          )
        );
      });
  };

  //  Edit
  const handleEdit = (index) => {
    const shift = shiftList[index];
    setEditIndex(index);
    setEditId(shift.id || shift._id);
    setShowAddEdit(true);
  };

  //  Delete
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

  //  Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = shiftList.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(shiftList.length / itemsPerPage);

  return (
    <>
      <Row className="mt-4">
        <Col sm="12">
          <Card>
            <Card.Header
              className="d-flex justify-content-between"
              style={{ padding: "15px 15px 0px 15px" }}
            >
              <h5 className="card-title fw-lighter">Office Time</h5>
            </Card.Header>
            <Card.Body className="px-0 pt-3">
              <div className="table-responsive">
                <Table hover responsive className="table">
                  <thead>
                    <tr className="table-gray">
                      <th>Sr. No.</th>
                      <th>Start Time</th>
                      <th>End Time</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center">
                          No Shift Found
                        </td>
                      </tr>
                    ) : (
                      currentItems.map((item, idx) => (
                        <tr key={item.id || item._id}>
                          <td>{indexOfFirstItem + idx + 1}</td>
                          <td>{formatTime12Hour(item.start_time)}</td>
                          <td>{formatTime12Hour(item.end_time)}</td>
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
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <Pagination className="justify-content-center">
                  <Pagination.Prev
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                  />
                  {Array.from({ length: totalPages }, (_, i) => (
                    <Pagination.Item
                      key={i + 1}
                      active={i + 1 === currentPage}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </Pagination.Item>
                  ))}
                  <Pagination.Next
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                  />
                </Pagination>
              )}
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

      <ToastContainer
        position="top-right"
        autoClose={3000}
        transition={Slide}
      />
    </>
  );
};

export default ShiftList;
