import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Form,
  Spinner,
  Table,
  Pagination,
} from "react-bootstrap";
import "react-toastify/dist/ReactToastify.css";
import CreateTwoToneIcon from "@mui/icons-material/CreateTwoTone";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import DeleteModal from "./DeleteModal";
import api from "../../../../api/axios";
import { useLocation, useNavigate } from "react-router";
import { successToast } from "../../../../components/Toast/successToast";
import { errorToast } from "../../../../components/Toast/errorToast";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ViewModal from "./ViewModal";

const SupplierManagementList = () => {
  const [userlist, setUserlist] = useState([]);
  const [paymentTermData, setPaymentTermData] = useState([]);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const { pathname } = useLocation();
  const [permissions, setPermissions] = useState(null);

  // View Modal
  const [showView, setShowView] = useState(false);
  const [viewData, setViewData] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentData = userlist.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(userlist.length / rowsPerPage);

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    FETCHPERMISSION();
  }, [pathname]);

  // Fetch supplier management
  const fetchSupplierManagement = () => {
    api
      .get("/api/v1/admin/supplierManagement")
      .then((res) => {
        if (Array.isArray(res.data)) {
          setUserlist(res.data);
        } else if (Array.isArray(res.data.data)) {
          setUserlist(res.data.data);
        } else {
          setUserlist([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching supplier management:", err);
        setUserlist([]);
      });
  };

  // Fetch payment terms (for view or other uses)
  const fetchPaymentTerm = () => {
    api
      .get("/api/v1/admin/paymentTerm")
      .then((res) => {
        if (Array.isArray(res.data)) {
          setPaymentTermData(res.data);
        } else if (Array.isArray(res.data.data)) {
          setPaymentTermData(res.data.data);
        } else {
          setPaymentTermData([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching payment terms:", err);
        setPaymentTermData([]);
      });
  };

  useEffect(() => {
    fetchSupplierManagement();
    fetchPaymentTerm();
  }, []);

  // Toggle Active/Inactive with optimistic update
  const handleToggleActive = (id, currentStatus) => {
    const newStatus = !currentStatus;

    // Optimistic UI update
    setUserlist((prev) =>
      prev.map((dept) =>
        dept.id === id ? { ...dept, isActive: newStatus } : dept
      )
    );

    api
      .put(`/api/v1/admin/supplierManagement/${id}`, { isActive: newStatus })
      .then(() => {
        successToast("Status updated successfully");
      })
      .catch((err) => {
        console.error("Update failed:", err);
        errorToast(err.response?.data?.message || "Failed to update status");
        // Rollback if API fails
        setUserlist((prev) =>
          prev.map((dept) =>
            dept.id === id ? { ...dept, isActive: currentStatus } : dept
          )
        );
      });
  };

  const handleEdit = (id) => {
    navigate(`/supplier-management/edit/${id}`);
  };

  // View
  const handleView = (notice) => {
    setViewData(notice);
    setShowView(true);
  };

  const handleDeleteConfirm = () => {
    if (!deleteId) return;
    setLoadingBtn(true);
    api
      .delete(`/api/v1/admin/supplierManagement/${deleteId}`)
      .then(() => {
        successToast("Supplier Management deleted successfully");
        fetchSupplierManagement();
        setDeleteIndex(null);
        setDeleteId(null);
      })
      .catch((err) => {
        console.error("Error deleting supplier management:", err);
        errorToast(
          err.response?.data?.message || "Failed to delete supplier management"
        );
      })
      .finally(() => {
        setLoadingBtn(false);
      });
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
              <h5 className="card-title fw-lighter">Supplier</h5>
              {permissions.add && (
                <Button
                  className="btn-primary"
                  onClick={() => navigate("/add-supplier")}
                >
                  + New
                </Button>
              )}
            </Card.Header>

            <Card.Body className="px-0 pt-3">
              <div className="table-responsive">
                <Table hover responsive className="table">
                  <thead>
                    <tr className="table-gray">
                      <th>Sr. No.</th>
                      <th>Name</th>
                      <th>Display Name</th>
                      <th>Payment Term</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userlist.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center">
                          No Supplier Management Available
                        </td>
                      </tr>
                    ) : (
                      currentData.map((item, idx) => (
                        <tr key={item.id || item._id}>
                          <td>{idx + 1}</td>
                          <td>
                            {item.salutation} {item.name}
                          </td>
                          <td>{item.display_name}</td>
                          <td>{item.paymentTerm?.payment_term}</td>
                          <td style={{ width: "100px" }}>
                            <span
                              className={`status-dot ${
                                item.isActive ? "active" : "inactive"
                              }`}
                            ></span>
                            {item.isActive ? "Active" : "Inactive"}
                          </td>
                          <td className="d-flex align-items-center">
                            <Form.Check
                              type="switch"
                              id={`active-switch-${item.id}`}
                              checked={item.isActive === true}
                              onChange={() =>
                                handleToggleActive(item.id, item.isActive)
                              }
                            />
                            {/* View */}
                            <VisibilityIcon
                              onClick={() => handleView(item)}
                              color="info"
                              style={{ cursor: "pointer" }}
                            />
                            {permissions.edit && (
                              <CreateTwoToneIcon
                                onClick={() => handleEdit(item.id)}
                                color="primary"
                                style={{ cursor: "pointer" }}
                              />
                            )}

                            {permissions.del && (
                              <DeleteRoundedIcon
                                onClick={() => {
                                  setDeleteIndex(idx);
                                  setDeleteId(item.id || item._id);
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

              {/* 🔹 Pagination Controls */}
              {totalPages > 1 && (
                <Pagination className="justify-content-center mt-3">
                  <Pagination.First
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                  />
                  <Pagination.Prev
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
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
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        show={deleteId !== null}
        handleClose={() => {
          setDeleteIndex(null);
          setDeleteId(null);
        }}
        onConfirm={handleDeleteConfirm}
        modalTitle="Delete Supplier Management"
        modalMessage={
          deleteIndex !== null && userlist[deleteIndex]
            ? `Are you sure you want to delete the supplier management "${userlist[deleteIndex].name}"?`
            : ""
        }
        loading={loadingBtn}
      />

      {/* View Modal */}
      {showView && viewData && (
        <ViewModal
          showView={showView}
          setShowView={setShowView}
          viewData={viewData}
        />
      )}
    </>
  );
};

export default SupplierManagementList;
