import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Table,
  Pagination,
  Spinner,
  Modal,
} from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CreateTwoToneIcon from "@mui/icons-material/CreateTwoTone";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import VisibilityTwoToneIcon from "@mui/icons-material/VisibilityTwoTone";
import AddEditModal from "./add-edit-modal";
import DeleteModal from "./delete-modal";
import api from "../../../../../api/axios";
import { useLocation } from "react-router";

const AppreciationList = () => {
  const [appreciations, setAppreciations] = useState([]);
  const [formData, setFormData] = useState({
    award_id: "",
    employee_id: "",
    date: "",
    description: "",
    photo: null,
  });
  const [editId, setEditId] = useState(null);
  const [showAddEdit, setShowAddEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showView, setShowView] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 🔑 Permissions
  const { pathname } = useLocation();
  const [permissions, setPermissions] = useState(null);

  // 🔐 Fetch Role Permissions
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
      console.error("Error fetching permissions:", err);
      setPermissions(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    FETCHPERMISSION();
  }, [pathname]);

  // 🔄 Fetch Appreciations
  const fetchAppreciations = () => {
    setLoading(true);
    api
      .get("/api/v1/admin/appreciation")
      .then((res) => {
        const data = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.data)
          ? res.data.data
          : [];
        setAppreciations(data);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to fetch appreciations");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAppreciations();
  }, []);

  // ➕ Add / ✏️ Update
  const handleAddOrUpdate = () => {
    if (!formData.award_id || !formData.employee_id || !formData.date) {
      toast.warning("Award, Employee & Date are required");
      return;
    }

    const formPayload = new FormData();
    Object.keys(formData).forEach((key) =>
      formPayload.append(key, formData[key])
    );

    if (editId) {
      api
        .put(`/api/v1/admin/appreciation/${editId}`, formPayload)
        .then(() => {
          toast.success("Appreciation updated successfully");
          fetchAppreciations();
          resetForm();
        })
        .catch(() => toast.error("Failed to update appreciation"));
    } else {
      api
        .post("/api/v1/admin/appreciation", formPayload)
        .then(() => {
          toast.success("Appreciation added successfully");
          fetchAppreciations();
          resetForm();
        })
        .catch(() => toast.error("Failed to add appreciation"));
    }
  };

  // ✏️ Edit
  const handleEdit = (index) => {
    const appreciation = appreciations[index];
    setFormData({
      award_id: appreciation.award_id,
      employee_id: appreciation.employee_id,
      date: appreciation.date ? appreciation.date.split("T")[0] : "",
      description: appreciation.description || "",
      photo: null,
      existingPhoto: appreciation.photo || null,
    });
    setEditId(appreciation.id);
    setShowAddEdit(true);
  };

  // ❌ Delete
  const handleDeleteConfirm = () => {
    if (!deleteId) return;
    api
      .delete(`/api/v1/admin/appreciation/${deleteId}`)
      .then(() => {
        toast.success("Appreciation deleted successfully");
        fetchAppreciations();
        setShowDelete(false);
      })
      .catch(() => toast.error("Failed to delete appreciation"));
  };

  const resetForm = () => {
    setShowAddEdit(false);
    setFormData({
      award_id: "",
      employee_id: "",
      date: "",
      description: "",
      photo: null,
    });
    setEditId(null);
  };

  // 🔄 Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAppreciations = appreciations.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(appreciations.length / itemsPerPage);

  // 🌀 Loader while checking permissions
  if (loading) {
    return (
      <div className="loader-div text-center p-4">
        <Spinner animation="border" className="spinner" />
      </div>
    );
  }

  // 🚫 View Restriction
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
            <Card.Header className="d-flex justify-content-between">
              <h5 className="card-title fw-lighter">Appreciations</h5>
              {permissions.add && (
                <Button
                  className="btn-primary"
                  onClick={() => setShowAddEdit(true)}
                >
                  + New Appreciation
                </Button>
              )}
            </Card.Header>

            <Card.Body className="px-0">
              <div className="table-responsive">
                <Table hover responsive className="table">
                  <thead>
                    <tr className="table-gray">
                      <th>Sr. No.</th>
                      <th>Award</th>
                      <th>Employee</th>
                      <th>Date</th>
                      <th>Description</th>
                      <th>Photo</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentAppreciations.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center">
                          No appreciations available
                        </td>
                      </tr>
                    ) : (
                      currentAppreciations.map((item, idx) => (
                        <tr key={item.id}>
                          <td>{indexOfFirstItem + idx + 1}</td>
                          <td>{item.award?.title || "-"}</td>
                          <td>{item.employee?.name || "-"}</td>
                          <td>
                            {item.date
                              ? new Date(item.date).toLocaleDateString()
                              : "-"}
                          </td>
                          <td>{item.description || "-"}</td>
                          <td>
                            {item.photo ? (
                              <img
                                src={item.photo}
                                alt="Appreciation"
                                style={{
                                  width: "30px",
                                  height: "30px",
                                  objectFit: "cover",
                                }}
                              />
                            ) : (
                              "-"
                            )}
                          </td>
                          <td className="d-flex align-items-center">
                            <VisibilityTwoToneIcon
                              className="me-2"
                              color="primary"
                              onClick={() => {
                                setViewData(item);
                                setShowView(true);
                              }}
                              style={{ cursor: "pointer" }}
                            />
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

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-3">
                  <Pagination>
                    <Pagination.Prev
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                    />
                    {[...Array(totalPages)].map((_, idx) => (
                      <Pagination.Item
                        key={idx + 1}
                        active={idx + 1 === currentPage}
                        onClick={() => setCurrentPage(idx + 1)}
                      >
                        {idx + 1}
                      </Pagination.Item>
                    ))}
                    <Pagination.Next
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                    />
                  </Pagination>
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
        modalTitle={editId ? "Update Appreciation" : "Add Appreciation"}
        buttonLabel={editId ? "Update" : "Save"}
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
        modalTitle="Delete Appreciation"
        modalMessage={
          deleteIndex !== null && appreciations[deleteIndex]
            ? `Are you sure you want to delete this appreciation for "${appreciations[deleteIndex].employee?.name}"?`
            : ""
        }
      />

      {/* View Modal */}
      <Modal
        show={showView}
        onHide={() => setShowView(false)}
        size="md"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Appreciation Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {viewData && (
            <>
              <p>
                <b>Award:</b> {viewData.award?.title}
              </p>
              <p>
                <b>Employee:</b> {viewData.employee?.name}
              </p>
              <p>
                <b>Date:</b>{" "}
                {viewData.date
                  ? new Date(viewData.date).toLocaleDateString()
                  : "-"}
              </p>
              <p>
                <b>Description:</b> {viewData.description || "-"}
              </p>
              {viewData.photo && (
                <div className="text-center">
                  <img
                    src={viewData.photo}
                    alt="Appreciation"
                    style={{
                      width: "200px",
                      height: "200px",
                      objectFit: "cover",
                    }}
                  />
                </div>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowView(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default AppreciationList;
