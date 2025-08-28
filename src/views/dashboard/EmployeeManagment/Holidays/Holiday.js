import React, { useState, useEffect } from "react";
import { Card, Row, Col, Button, Form } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CreateTwoToneIcon from "@mui/icons-material/CreateTwoTone";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import AddEditModal from "./add-edit-modal";
import DeleteModal from "./delete-modal";
import api from "../../../../api/axios";
import { useLocation } from "react-router";

const Holiday = () => {
  const [holidayList, setHolidayList] = useState([]);
  const [formData, setFormData] = useState({ date: "", occasion: "" });
  const [editId, setEditId] = useState(null);

  const [showAddEdit, setShowAddEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const { pathname } = useLocation();
  const [permissions, setPermissions] = useState(null);

  // 🔑 Fetch Role Permissions
  const FETCHPERMISSION = async () => {
    try {
      const res = await api.get("/api/v1/admin/rolePermission");
      const data = Array.isArray(res.data) ? res.data : res.data.data || [];
      const matchedPermission = data.find((perm) => perm.route === pathname);
      setPermissions(matchedPermission || {});
    } catch (err) {
      console.error("Error fetching roles:", err);
      setPermissions({});
    }
  };

  useEffect(() => {
    FETCHPERMISSION();
  }, [pathname]);

  // 🔄 Fetch Holidays
  const fetchHolidays = () => {
    api
      .get("/api/v1/admin/holiday")
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data.data || [];
        setHolidayList(data);
      })
      .catch((err) => {
        console.error("Error fetching holidays:", err);
        toast.error("Failed to fetch holidays");
        setHolidayList([]);
      });
  };

  useEffect(() => {
    fetchHolidays();
  }, []);

  // ✅ Add or Update Holiday
  const handleAddOrUpdate = () => {
    if (!formData.date.trim() || !formData.occasion.trim()) {
      toast.warning("Date and Occasion are required");
      return;
    }

    if (editId) {
      api
        .put(`/api/v1/admin/holiday/${editId}`, formData)
        .then(() => {
          toast.success("Holiday updated successfully");
          fetchHolidays();
          resetForm();
        })
        .catch((err) => {
          console.error("Error updating holiday:", err);
          toast.error(
            err.response?.data?.message || "Failed to update holiday"
          );
        });
    } else {
      api
        .post("/api/v1/admin/holiday", formData)
        .then(() => {
          toast.success("Holiday added successfully");
          fetchHolidays();
          resetForm();
        })
        .catch((err) => {
          console.error("Error adding holiday:", err);
          toast.error(err.response?.data?.message || "Failed to add holiday");
        });
    }
  };

  const handleEdit = (index) => {
    const holiday = holidayList[index];
    setFormData({ date: holiday.date, occasion: holiday.occasion });
    setEditId(holiday.id);
    setShowAddEdit(true);
  };

  // ✅ Delete Holiday
  const handleDeleteConfirm = () => {
    if (!deleteId) return;
    api
      .delete(`/api/v1/admin/holiday/${deleteId}`)
      .then(() => {
        toast.success("Holiday deleted successfully");
        fetchHolidays();
        setShowDelete(false);
      })
      .catch((err) => {
        console.error("Error deleting holiday:", err);
        toast.error(err.response?.data?.message || "Failed to delete holiday");
      });
  };

  const resetForm = () => {
    setShowAddEdit(false);
    setFormData({ date: "", occasion: "" });
    setEditId(null);
  };

  // 🚫 Permission Handling
  if (!permissions) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "70vh" }}
      >
        <h4>Loading permissions...</h4>
      </div>
    );
  }

  if (!permissions.view) {
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
      <Row>
        <Col sm="12">
          <Card>
            <Card.Header className="d-flex justify-content-between">
              <h4 className="card-title">Holiday List</h4>
              {permissions.add && (
                <Button
                  className="btn-primary"
                  onClick={() => setShowAddEdit(true)}
                >
                  + Add Holiday
                </Button>
              )}
            </Card.Header>

            <Card.Body className="px-0">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Sr. No.</th>
                      <th>Date</th>
                      <th>Occasion</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {holidayList.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center">
                          No Holiday available
                        </td>
                      </tr>
                    ) : (
                      holidayList.map((item, idx) => (
                        <tr key={item.id}>
                          <td>{idx + 1}</td>
                          <td>{item.date}</td>
                          <td>{item.occasion}</td>
                          <td className="d-flex align-items-center">
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
                                onClick={() => {
                                  setDeleteIndex(idx);
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
        formData={formData}
        setFormData={setFormData}
        onSave={handleAddOrUpdate}
        modalTitle={editId ? "Update Holiday" : "Add New Holiday"}
        buttonLabel={editId ? "Update" : "Submit"}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        show={showDelete}
        handleClose={() => {
          setShowDelete(false);
          setDeleteIndex(null);
          setDeleteId(null);
        }}
        onConfirm={handleDeleteConfirm}
        modalTitle="Delete Holiday"
        modalMessage={
          deleteIndex !== null && holidayList[deleteIndex]
            ? `Are you sure you want to delete "${holidayList[deleteIndex].occasion}"?`
            : ""
        }
      />

      {/* Toast container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default Holiday;
