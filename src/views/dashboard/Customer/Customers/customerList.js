import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

const CustomerList = () => {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 10;
  const indexOfLast = currentPage * customersPerPage;
  const indexOfFirst = indexOfLast - customersPerPage;
  const totalPages = Math.ceil(customers.length / customersPerPage);
  const currentCustomers = customers.slice(indexOfFirst, indexOfLast);

  const [showDelete, setShowDelete] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

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
      });
  };

  const handleToggleActive = async (id, status) => {
    const newStatus = !status;
    try {
      const res = await api.put(`/api/v1/admin/client/${id}`, {
        isActive: newStatus,
      });
      if (res.status === 200) {
        successToast("Customer status updated successfully");
        setCustomers((prev) =>
          prev.map((c) => (c.id === id ? { ...c, isActive: newStatus } : c))
        );
      }
    } catch (err) {
      console.error("Error updating customer status:", err);
      errorToast(
        err.response?.data?.message || "Failed to update customer status"
      );
    }
  };

  return (
    <>
      <Row className="mt-4">
        <Col sm="12">
          <Card>
            <Card.Header
              className="d-flex justify-content-between"
              style={{ padding: "15px 15px 0px 15px" }}
            >
              <h5 className="card-title fw-lighter">Customers</h5>
              <Button
                className="btn-primary"
                onClick={() => navigate("/add-customer")}
              >
                + Add Customer
              </Button>
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
                        <th>Email</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentCustomers.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="text-center">
                            No customers available
                          </td>
                        </tr>
                      ) : (
                        currentCustomers.map((item, idx) => (
                          <tr key={item.id}>
                            <td>{indexOfFirst + idx + 1}</td>
                            <td>{item.client_id}</td>
                            <td>{item.name}</td>
                            <td>{item.email}</td>
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
                              <CreateTwoToneIcon
                                onClick={() => handleEdit(item.id)}
                                color="primary"
                                style={{
                                  cursor: "pointer",
                                  marginLeft: "5px",
                                }}
                              />
                              <DeleteRoundedIcon
                                onClick={() =>
                                  openDeleteModal(item.id, indexOfFirst + idx)
                                }
                                color="error"
                                style={{
                                  cursor: "pointer",
                                  marginLeft: "5px",
                                }}
                              />
                              <VisibilityIcon
                                onClick={() => handleView(item.id)}
                                color="primary"
                                style={{
                                  cursor: "pointer",
                                  marginLeft: "5px",
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
          deleteIndex !== null && customers[deleteIndex]
            ? `Are you sure you want to delete the customer ${customers[deleteIndex].name}?`
            : ""
        }
      />
    </>
  );
};

export default CustomerList;
