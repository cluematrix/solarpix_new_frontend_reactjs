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
import DeleteModal from "./deleteModal";
import api from "../../../../api/axios";
import { successToast } from "../../../../components/Toast/successToast";
import { errorToast } from "../../../../components/Toast/errorToast";
import VisibilityIcon from "@mui/icons-material/Visibility";

const CustomerList = () => {
  // ✅ Renamed with uppercase C
  const navigate = useNavigate();

  const [employee, setEmployee] = useState([]);
  const [loading, setLoading] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const rolesPerPage = 10;
  const indexOfLastRole = currentPage * rolesPerPage;
  const indexOfFirstRole = indexOfLastRole - rolesPerPage;
  const totalPages = Math.ceil(employee.length / rolesPerPage);
  const currentEmployees = employee.slice(indexOfFirstRole, indexOfLastRole);

  const [showDelete, setShowDelete] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  // fetch employee
  const fetchEmployee = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/v1/admin/employee");
      setEmployee(res.data.data || []);
    } catch (err) {
      console.error("Error fetching employee:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployee();
  }, []);

  // navigate to edit page
  const handleEdit = (id) => {
    navigate(`/update-customer/${id}`);
  };

  // navigate to view page
  const handleView = (id) => {
    navigate(`/view-customer/${id}`);
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
      .delete(`/api/v1/admin/employee/${deleteId}`)
      .then(() => {
        successToast("Employee Deleted Successfully");
        setEmployee((prev) => prev.filter((emp) => emp.id !== deleteId));
        setShowDelete(false);
      })
      .catch((err) => {
        console.error("Error deleting department:", err);
        errorToast(err.response?.data?.message || "Failed to delete employee");
      });
  };

  const handleToggleActive = async (id, status) => {
    const newStatus = !status;
    try {
      const res = await api.put(`/api/v1/admin/employee/${id}`, {
        isActive: newStatus,
      });
      if (res.status === 200) {
        successToast("Employee status updated successfully");
        setEmployee((prev) =>
          prev.map((emp) =>
            emp.id === id ? { ...emp, isActive: newStatus } : emp
          )
        );
      }
    } catch (err) {
      console.error("Error employee status:", err);
      errorToast(
        err.response?.data?.message || "Failed to update employee status"
      );
    }
  };

  return (
    <>
      <Row>
        <Col sm="12">
          <Card>
            <Card.Header className="d-flex justify-content-between">
              <h5 className="card-title fw-lighter">Customers</h5>
              <Button
                className="btn-primary fs-6"
                onClick={() => navigate("/add-Customer")}
              >
                + Add Customer
              </Button>
            </Card.Header>

            <Card.Body className="px-0">
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
                        <th>Reporting To</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentEmployees.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="text-center">
                            No Employee available
                          </td>
                        </tr>
                      ) : (
                        currentEmployees.map((item, idx) => (
                          <tr key={item.id}>
                            <td>{indexOfFirstRole + idx + 1}</td>
                            <td>{item.emp_id}</td>
                            <td>{item.name}</td>
                            <td>{item?.manager?.name || "N/A"}</td>
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
                                onClick={() => openDeleteModal(item.id, idx)}
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
          deleteIndex !== null && employee[deleteIndex]
            ? `Are you sure you want to delete the employee ${employee[deleteIndex].name}?`
            : ""
        }
      />
    </>
  );
};

export default CustomerList; // ✅ Also updated export
