import React, { useState, useEffect } from "react";
import { Card, Row, Col, Button, Spinner } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CreateTwoToneIcon from "@mui/icons-material/CreateTwoTone";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import AddEditModal from "./add-edit-modal";
import DeleteModal from "./delete-modal";
import api from "../../../../api/axios";
import { useLocation } from "react-router";

const DefaultHoliday = () => {
  const [holidayList, setHolidayList] = useState([]);
  const [formData, setFormData] = useState({ day: "", occasion: "", year: "" });
  const [editId, setEditId] = useState(null);

  const [showAddEdit, setShowAddEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  // 🔑 Permission
  const { pathname } = useLocation();
  const [permissions, setPermissions] = useState(null);

  // 🔄 Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

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

  // 🔄 Fetch Default Holidays
  const fetchHolidays = () => {
    api
      .get("/api/v1/admin/defaultHoliday")
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data.data || [];
        setHolidayList(data);
      })
      .catch((err) => {
        console.error("Error fetching default holidays:", err);
        toast.error("Failed to fetch default holidays");
        setHolidayList([]);
      });
  };

  useEffect(() => {
    fetchHolidays();
  }, []);

  // ✅ Add or Update
  const handleAddOrUpdate = () => {
    if (
      !formData.day.trim() ||
      !formData.occasion.trim() ||
      !formData.year.trim()
    ) {
      toast.warning("Day, Occasion and Year are required");
      return;
    }

    if (editId) {
      api
        .put(`/api/v1/admin/defaultHoliday/${editId}`, formData)
        .then(() => {
          toast.success("Default holiday updated successfully");
          fetchHolidays();
          resetForm();
        })
        .catch((err) => {
          console.error("Error updating default holiday:", err);
          toast.error(
            err.response?.data?.message || "Failed to update default holiday"
          );
        });
    } else {
      api
        .post("/api/v1/admin/defaultHoliday", formData)
        .then(() => {
          toast.success("Default holiday added successfully");
          fetchHolidays();
          resetForm();
        })
        .catch((err) => {
          console.error("Error adding default holiday:", err);
          toast.error(
            err.response?.data?.message || "Failed to add default holiday"
          );
        });
    }
  };

  const handleEdit = (index) => {
    const holiday = holidayList[index];
    setFormData({
      day: holiday.day,
      occasion: holiday.occasion,
      year: holiday.year,
    });
    setEditId(holiday.id);
    setShowAddEdit(true);
  };

  // ✅ Delete
  const handleDeleteConfirm = () => {
    if (!deleteId) return;
    api
      .delete(`/api/v1/admin/defaultHoliday/${deleteId}`)
      .then(() => {
        toast.success("Default holiday deleted successfully");
        fetchHolidays();
        setShowDelete(false);
      })
      .catch((err) => {
        console.error("Error deleting default holiday:", err);
        toast.error(
          err.response?.data?.message || "Failed to delete default holiday"
        );
      });
  };

  const resetForm = () => {
    setShowAddEdit(false);
    setFormData({ day: "", occasion: "", year: "" });
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

  // 🔄 Pagination Logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = holidayList.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );
  const totalPages = Math.ceil(holidayList.length / recordsPerPage);

  return (
    <>
      <Row className="mt-4">
        <Col sm="12">
          <Card>
            <Card.Header className="d-flex justify-content-between">
              <h4 className="card-title fw-bold">Default Holiday </h4>
              {permissions.add && (
                <Button
                  className="btn-primary"
                  onClick={() => setShowAddEdit(true)}
                >
                  + Add Default Holiday
                </Button>
              )}
            </Card.Header>

            <Card.Body className="px-0">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Sr. No.</th>
                      <th>Day</th>
                      <th>Occasion</th>
                      <th>Year</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentRecords.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center">
                          No Default Holiday available
                        </td>
                      </tr>
                    ) : (
                      currentRecords.map((item, idx) => (
                        <tr key={item.id}>
                          <td>{indexOfFirstRecord + idx + 1}</td>
                          <td>{item.day}</td>
                          <td>{item.occasion}</td>
                          <td>{item.year}</td>
                          <td className="d-flex align-items-center">
                            {permissions.edit && (
                              <CreateTwoToneIcon
                                className="me-2"
                                onClick={() =>
                                  handleEdit(indexOfFirstRecord + idx)
                                }
                                color="primary"
                                style={{ cursor: "pointer" }}
                              />
                            )}
                            {permissions.del && (
                              <DeleteRoundedIcon
                                onClick={() => {
                                  setDeleteIndex(indexOfFirstRecord + idx);
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

              {/* Pagination Controls */}
              {holidayList.length > recordsPerPage && (
                <div className="d-flex justify-content-between align-items-center px-3 pb-3">
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                  >
                    Previous
                  </Button>
                  <span>
                    Page {currentPage} of {totalPages}
                  </span>
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
        formData={formData}
        setFormData={setFormData}
        onSave={handleAddOrUpdate}
        modalTitle={
          editId ? "Update Default Holiday" : "Add New Default Holiday"
        }
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
        modalTitle="Delete Default Holiday"
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

export default DefaultHoliday;
