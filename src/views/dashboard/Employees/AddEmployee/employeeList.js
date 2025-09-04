import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Row, Col, Button, Form, Spinner } from "react-bootstrap";
import CreateTwoToneIcon from "@mui/icons-material/CreateTwoTone";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import DeleteModal from "./deleteModal";
import api from "../../../../api/axios";
import { successToast } from "../../../../components/Toast/successToast";
import { errorToast } from "../../../../components/Toast/errorToast";
import VisibilityIcon from "@mui/icons-material/Visibility";

const EmployeeList = () => {
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
    navigate(`/update-employee/${id}`);
  };

  // navigate to view page
  const handleView = (id) => {
    navigate(`/view-employee/${id}`);
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
      console.log("resUpdatedEmp", res);
      if (res.status === 200) {
        console.log("enter", res.status);
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
      <Row className="mt-4">
        <Col sm="12">
          <Card>
            <Card.Header className="d-flex justify-content-between">
              <h5 className="card-title fw-bold">Employees </h5>
              <Button
                className="btn-primary fs-6"
                onClick={() => navigate("/add-employee")}
              >
                + Add Employee
              </Button>
            </Card.Header>

            <Card.Body className="px-0">
              {loading ? (
                <div className="loader-div">
                  <Spinner className="spinner" animation="border" />
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Sr. No.</th>
                        <th>Emp ID</th>
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
                  </table>
                </div>
              )}
              {/* Pagination Controls */}
              {totalPages > 1 && !loading && (
                <div className="d-flex justify-content-end mt-3 me-3">
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                  >
                    Previous
                  </Button>
                  {[...Array(totalPages)].map((_, i) => (
                    <Button
                      key={i}
                      variant={currentPage === i + 1 ? "primary" : "light"}
                      size="sm"
                      className="mx-1"
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </Button>
                  ))}
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

      {/* Delete Confirmation Modal */}
      <DeleteModal
        show={showDelete}
        handleClose={() => {
          setShowDelete(false);
          setDeleteIndex(null);
        }}
        onConfirm={handleDeleteConfirm}
        modalTitle="Delete Employee"
        modalMessage={
          deleteIndex !== null && employee[deleteIndex]
            ? `Are you sure you want to delete the employee ${employee[deleteIndex].name}?`
            : ""
        }
      />
    </>
  );
};

export default EmployeeList;
