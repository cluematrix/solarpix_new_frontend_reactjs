import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Table,
  Spinner,
  Modal,
  Pagination,
} from "react-bootstrap";
import CreateTwoToneIcon from "@mui/icons-material/CreateTwoTone";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import VisibilityTwoToneIcon from "@mui/icons-material/VisibilityTwoTone";
import AddEditModal from "./add-edit-modal";
import DeleteModal from "./delete-modal";
import api from "../../../../api/axios";
import { useLocation } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import VisibilityIcon from "@mui/icons-material/Visibility";

const NoticeBoardList = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  // permissions
  const { pathname } = useLocation();
  const [permissions, setPermissions] = useState(null);

  // Add/Edit Modal
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [editData, setEditData] = useState(null);

  // Delete Modal
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // View Modal
  const [showView, setShowView] = useState(false);
  const [viewData, setViewData] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // ✅ Fetch Permissions
  const FETCHPERMISSION = async () => {
    try {
      const res = await api.get("/api/v1/admin/rolePermission");
      let data = Array.isArray(res.data) ? res.data : res.data.data || [];

      const roleId = String(sessionStorage.getItem("roleId"));
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

  // ✅ Fetch Notices
  const fetchNotices = async () => {
    try {
      const res = await api.get("/api/v1/admin/noticeBoard");
      setNotices(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (err) {
      console.error("Failed to fetch notices:", err);
      toast.error("Failed to fetch notices");
      setNotices([]);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  // ✅ Save (Add/Edit)
  const handleSave = async () => {
    try {
      if (editData) {
        await api.put(`/api/v1/admin/noticeBoard/${editData.id}`, formData);

        toast.success("Notice updated successfully");
      } else {
        await api.post("/api/v1/admin/noticeBoard", formData);

        toast.success("Notice added successfully");
      }
      fetchNotices();
      setShowModal(false);
      setEditData(null);
      setFormData({});
    } catch (err) {
      console.error("Failed to save notice:", err);
      toast.error("Failed to save notice");
    }
  };

  // ✅ Edit
  const handleEdit = (notice) => {
    setEditData(notice);
    setFormData(notice);
    setShowModal(true);
  };

  // ✅ Delete confirm
  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      const res = await api.delete(`/api/v1/admin/noticeBoard/${deleteId}`);
      // refetchNotice(res.data.data);
      toast.success("Notice deleted successfully");
      fetchNotices();
      setShowDelete(false);
      setDeleteId(null);
    } catch (err) {
      console.error("Failed to delete notice:", err);
      toast.error("Failed to delete notice");
    }
  };

  // ✅ View
  const handleView = (notice) => {
    setViewData(notice);
    setShowView(true);
  };

  // Helper: truncate description
  const truncateDescription = (text, wordLimit) => {
    if (!text) return "";
    const words = text.split(" ");
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + "..."
      : text;
  };

  // Pagination logic
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentData = notices.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(notices.length / rowsPerPage);

  // Loader while checking permissions
  if (loading) {
    return (
      <div className="loader-div">
        <Spinner animation="border" className="spinner" />
      </div>
    );
  }

  // Permission check
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

  // ✅ local updater for notices
  const refetchNotice = (newNotice) => {
    console.log("newNotice", newNotice);
    setNotices((prev) => [newNotice, ...prev]); // add new notice to top
  };

  return (
    <Card className="p-3 shadow-sm">
      <Row className="mb-3">
        <Col>
          <h5 className="mb-0">Notice Board</h5>
        </Col>
        {permissions.add && (
          <Col className="text-end">
            <Button onClick={() => setShowModal(true)}>+ Add Notice</Button>
          </Col>
        )}
      </Row>

      {loading ? (
        <div className="text-center my-3">
          <Spinner animation="border" />
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <Table bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Heading</th>
                  <th>To</th>
                  <th>Description</th>
                  <th>Attachment</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentData.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No notices available
                    </td>
                  </tr>
                ) : (
                  currentData.map((notice, idx) => (
                    <tr key={notice.id}>
                      <td>{indexOfFirst + idx + 1}</td>
                      <td>{notice.heading}</td>
                      <td>{notice.to}</td>
                      <td>{truncateDescription(notice.description, 6)}</td>
                      <td>
                        {notice.attachment ? (
                          <a
                            href={notice.attachment}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View PDF
                          </a>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="d-flex align-items-center">
                        {/* View */}
                        <VisibilityIcon
                          className="me-2"
                          onClick={() => handleView(notice)}
                          color="info"
                          style={{ cursor: "pointer" }}
                        />

                        {/* Edit */}
                        {permissions.edit && (
                          <CreateTwoToneIcon
                            className="me-2"
                            onClick={() => handleEdit(notice)}
                            color="primary"
                            style={{ cursor: "pointer" }}
                          />
                        )}

                        {/* Delete */}
                        {permissions.del && (
                          <DeleteRoundedIcon
                            onClick={() => {
                              setDeleteId(notice.id);
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
            <Pagination className="justify-content-center mt-3">
              <Pagination.First
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              />
              <Pagination.Prev
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
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
        </>
      )}

      {/* Add/Edit Modal */}
      <AddEditModal
        show={showModal}
        handleClose={() => {
          setShowModal(false);
          setEditData(null);
          setFormData({});
        }}
        onSave={handleSave}
        formData={formData}
        setFormData={setFormData}
        editData={editData}
        refetchNotice={refetchNotice}
      />

      {/* Delete Modal */}
      <DeleteModal
        show={showDelete}
        handleClose={() => setShowDelete(false)}
        onConfirm={handleDeleteConfirm}
        modalTitle="Delete Notice"
        modalMessage="Are you sure you want to delete this notice?"
      />

      {/* View Modal */}
      {showView && viewData && (
        <Modal show={showView} onHide={() => setShowView(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Notice Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              <strong>Heading:</strong> {viewData.heading}
            </p>
            <p>
              <strong>To:</strong> {viewData.to}
            </p>
            <p>
              <strong>Description:</strong> {viewData.description}
            </p>
            {viewData.attachment && (
              <p>
                <strong>Attachment:</strong>{" "}
                <a
                  href={viewData.attachment}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View PDF
                </a>
              </p>
            )}
          </Modal.Body>
          <Modal.Footer>
            {/* <Button variant="secondary" onClick={() => setShowView(false)}>
              Close
            </Button> */}
          </Modal.Footer>
        </Modal>
      )}

      {/* Toasts */}
      <ToastContainer position="top-right" autoClose={3000} />
    </Card>
  );
};

export default NoticeBoardList;
