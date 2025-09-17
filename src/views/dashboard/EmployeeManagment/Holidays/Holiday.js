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

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [loading, setLoading] = useState(true);

  // 🔑 Fetch Role Permissions
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

  // Pagination logic
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentHolidays = holidayList.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(holidayList.length / itemsPerPage);

  return (
    <>
      <Row className="mt-4">
        <Col sm="12">
          <Card>
            <Card.Header
              className="d-flex justify-content-between"
              style={{ padding: "15px 15px 0px 15px" }}
            >
              <h5 className="card-title fw-fw-lighter">Holidays</h5>
              {permissions.add && (
                <Button
                  className="btn-primary"
                  onClick={() => setShowAddEdit(true)}
                >
                  + Add Holiday
                </Button>
              )}
            </Card.Header>

            <Card.Body className="px-0 pt-3">
              <div className="table-responsive">
                <Table hover responsive className="table">
                  <thead>
                    <tr className="table-gray">
                      <th>Sr. No.</th>
                      <th>Date</th>
                      <th>Occasion</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentHolidays.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center">
                          No Holiday available
                        </td>
                      </tr>
                    ) : (
                      currentHolidays.map((item, idx) => (
                        <tr key={item.id}>
                          <td>{indexOfFirst + idx + 1}</td>
                          <td>{item.date}</td>
                          <td>{item.occasion}</td>
                          <td className="d-flex align-items-center">
                            {permissions.edit && (
                              <CreateTwoToneIcon
                                className="me-2"
                                onClick={() => handleEdit(indexOfFirst + idx)}
                                color="primary"
                                style={{ cursor: "pointer" }}
                              />
                            )}

                            {permissions.del && (
                              <DeleteRoundedIcon
                                onClick={() => {
                                  setDeleteIndex(indexOfFirst + idx);
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

              {/* Pagination */}
              {holidayList.length > itemsPerPage && (
                <div className="d-flex justify-content-between align-items-center px-3">
                  <span>
                    Page {currentPage} of {totalPages}
                  </span>
                  <div>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      className="me-2"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(currentPage + 1)}
                    >
                      Next
                    </Button>
                  </div>
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
