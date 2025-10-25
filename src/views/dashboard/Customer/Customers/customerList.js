import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
import CreateTwoToneIcon from "@mui/icons-material/CreateTwoTone";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteModal from "./deleteModal";
import api from "../../../../api/axios";
import { successToast } from "../../../../components/Toast/successToast";
import { errorToast } from "../../../../components/Toast/errorToast";
import { FaUserXmark } from "react-icons/fa6";
import Tooltip from "@mui/material/Tooltip";
import KycModal from "./kycModal";
import { FaUserCheck } from "react-icons/fa6";
import CustomInput from "../../../../components/Form/CustomInput";

const CustomerList = () => {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { pathname } = useLocation();
  const [permissions, setPermissions] = useState(null);
  const [loadingDlt, setLoadingDlt] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const customersPerPage = 10;
  const indexOfLast = currentPage * customersPerPage;
  const indexOfFirst = indexOfLast - customersPerPage;

  const searchResult = customers.filter((item) => {
    return item.name.toLowerCase().startsWith(searchQuery.toLowerCase());
  });

  const filteredData = searchQuery ? searchResult : customers;
  const totalPages = Math.ceil(filteredData.length / customersPerPage);
  const currentCustomers = filteredData.slice(indexOfFirst, indexOfLast);

  const [showDelete, setShowDelete] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [enableVerification, setEnableVerification] = useState(false);
  const [kycData, setKycData] = useState(null);

  console.log("searchResult", searchResult);

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

      // Match current role + route
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
      setLoading(false); // Stop loader after API call
    }
  };

  useEffect(() => {
    setLoading(true); // reset loader each time route changes
    FETCHPERMISSION();
  }, [pathname]);

  // fetch customers
  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/v1/admin/client");
      setCustomers(res.data.data || []);
    } catch (err) {
      console.error("Error fetching customers:", err);
      errorToast("Failed to fetch customers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // navigate to edit page
  const handleEdit = (id) => {
    navigate(`/update-customer/${id}`);
  };

  // navigate to view page
  const handleView = (id) => {
    navigate(`/CustomeProfile/${id}`);
  };

  // delete modal
  const openDeleteModal = (id, idx) => {
    setDeleteIndex(idx);
    setShowDelete(true);
    setDeleteId(id);
  };

  const handleDeleteConfirm = () => {
    if (!deleteId) return;
    setLoadingDlt(true);
    api
      .delete(`/api/v1/admin/client/${deleteId}`)
      .then(() => {
        successToast("Customer deleted successfully");
        setCustomers((prev) => prev.filter((c) => c.id !== deleteId));
        setShowDelete(false);
      })
      .catch((err) => {
        console.error("Error deleting customer:", err);
        errorToast(err.response?.data?.message || "Failed to delete customer");
      })
      .finally(() => {
        setLoadingDlt(false);
      });
  };

  const handleToggleActive = async (id, status) => {
    const newStatus = !status;
    api
      .put(`/api/v1/admin/client/${id}`, {
        isActive: newStatus,
      })
      .then(() => {
        console.log("working");
        // toast.success("Status updated successfully");
        successToast("Status updated successfully");
        setCustomers((prev) =>
          prev.map((c) => (c.id === id ? { ...c, isActive: newStatus } : c))
        );
      })
      .catch((err) => {
        errorToast(
          err.response?.data?.message || "Failed to update customer status"
        );
      });
  };

  const handleOpenKycModal = (item) => {
    setEnableVerification(true);
    setKycData(item);
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
      <Row style={{ marginTop: "0px" }}>
        <Col md={4}>
          <CustomInput
            name="searchQuery"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search By Name"
          />
        </Col>
      </Row>
      <Row className="mt-3">
        <Col sm="12">
          <Card>
            <Card.Header
              className="d-flex justify-content-between"
              style={{ padding: "15px 15px 0px 15px" }}
            >
              <h5 className="card-title fw-lighter">Customers</h5>
            </Card.Header>

            <Card.Body className="px-0 pt-3">
              {loading ? (
                <div className="text-center my-4">
                  <Spinner animation="border" />
                </div>
              ) : (
                <div className="table-responsive">
                  <Table hover responsive className="table">
                    <thead>
                      <tr className="table-gray">
                        <th>Sr. No.</th>
                        <th>Cust ID</th>
                        <th>Name</th>
                        <th>Kyc Status</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentCustomers.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="text-center">
                            No customer available
                          </td>
                        </tr>
                      ) : (
                        currentCustomers.map((item, idx) => (
                          <tr key={item.id}>
                            <td>{indexOfFirst + idx + 1}</td>
                            <td>{item.client_id || "--"}</td>
                            <td>
                              {item.salutation || "--"} {item.name || "--"}
                            </td>
                            <td>
                              {" "}
                              {item.kyc_status}
                              <Tooltip title={item.kyc_status || "--"}>
                                <Button
                                  className={`${
                                    item?.kyc_status === "Pending"
                                      ? "text-warning"
                                      : item?.kyc_status === "Approved"
                                      ? "text-success"
                                      : "text-danger"
                                  }`}
                                  style={{
                                    padding: "5px",
                                    background: "none",
                                    border: "none",
                                  }}
                                  onClick={() => handleOpenKycModal(item)}
                                >
                                  {item?.kyc_status === "Approved" ? (
                                    <FaUserCheck style={{ fontSize: "18px" }} />
                                  ) : (
                                    <FaUserXmark style={{ fontSize: "18px" }} />
                                  )}
                                </Button>
                              </Tooltip>
                            </td>
                            <td>
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
                                checked={item.isActive}
                                onChange={() =>
                                  handleToggleActive(item.id, item.isActive)
                                }
                              />
                              <VisibilityIcon
                                onClick={() => handleView(item.id)}
                                color="primary"
                                style={{
                                  cursor: "pointer",
                                }}
                              />
                              <CreateTwoToneIcon
                                onClick={() => handleEdit(item.id)}
                                color="primary"
                                style={{
                                  cursor: "pointer",
                                }}
                              />
                              <DeleteRoundedIcon
                                onClick={() =>
                                  openDeleteModal(item.id, indexOfFirst + idx)
                                }
                                color="error"
                                style={{
                                  cursor: "pointer",
                                }}
                              />
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </Table>
                </div>
              )}
              {/* Pagination Controls */}
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
        show={showDelete}
        handleClose={() => {
          setShowDelete(false);
          setDeleteIndex(null);
        }}
        onConfirm={handleDeleteConfirm}
        modalTitle="Delete Customer"
        modalMessage={
          deleteIndex !== null && filteredData[deleteIndex]
            ? `Are you sure you want to delete this customer "${filteredData[deleteIndex].name}"?`
            : ""
        }
        loadingDlt={loadingDlt}
      />

      {/* Kyc Modal */}
      <KycModal
        show={enableVerification}
        handleClose={() => {
          setEnableVerification(false);
        }}
        onConfirm={handleDeleteConfirm}
        modalTitle="Customer Kyc"
        kycData={kycData}
        refetch={fetchCustomers}
      />
    </>
  );
};

export default CustomerList;
