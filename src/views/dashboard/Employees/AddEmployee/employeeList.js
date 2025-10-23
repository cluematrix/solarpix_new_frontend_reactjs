import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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

const EmployeeList = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [employee, setEmployee] = useState([]);
  const [loading, setLoading] = useState(false);
  const [permissions, setPermissions] = useState(null);
  const [permLoading, setPermLoading] = useState(true);

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

  // 🔑 Fetch Role Permissions
  const FETCHPERMISSION = async () => {
    setPermLoading(true);
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

      // ✅ Super Admin (roleId == 1) gets full access
      if (roleId === "1") {
        setPermissions({
          view: true,
          add: true,
          edit: true,
          del: true,
        });
        return;
      }

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
      setPermLoading(false);
    }
  };

  useEffect(() => {
    FETCHPERMISSION();
  }, [pathname]);

  // 👥 Fetch Employee Data
  const fetchEmployee = async () => {
    setLoading(true);
    try {
      const roleId = String(sessionStorage.getItem("roleId"));
      const empId = String(sessionStorage.getItem("employee_id")); // 👈 get logged-in employee id
      const res = await api.get("/api/v1/admin/employee");
      const allEmployees = res.data.data || [];

      if (roleId === "1") {
        // 👑 Super Admin - show all
        setEmployee(allEmployees);
      } else {
        // 👤 Normal employee - show only their own record
        const filtered = allEmployees.filter((emp) => String(emp.id) === empId);
        setEmployee(filtered);
      }
    } catch (err) {
      console.error("Error fetching employee:", err);
      errorToast("Failed to fetch employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployee();
  }, []);

  const handleEdit = (id) => navigate(`/update-employee/${id}`);
  const handleView = (id) => navigate(`/view-employee/${id}`);

  // 🗑 Delete Logic
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
        console.error("Error deleting employee:", err);
        errorToast(err.response?.data?.message || "Failed to delete employee");
      });
  };

  // 🔁 Toggle Employee Active Status
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
      console.error("Error updating employee status:", err);
      errorToast("Failed to update employee status");
    }
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) setCurrentPage(page);
  };

  // 🌀 Loader while checking permissions
  if (permLoading) {
    return (
      <div className="loader-div">
        <Spinner animation="border" className="spinner" />
      </div>
    );
  }

  // 🚫 No view permission
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
              <h5 className="card-title fw-lighter">Employees</h5>
              {permissions.add && (
                <Button
                  className="btn-primary fs-6"
                  onClick={() => navigate("/add-employee")}
                >
                  + Add Employee
                </Button>
              )}
            </Card.Header>

            <Card.Body className="px-0 pt-3">
              {loading ? (
                <div className="loader-div">
                  <Spinner className="spinner" animation="border" />
                </div>
              ) : (
                <div className="table-responsive">
                  <Table hover responsive className="table">
                    <thead>
                      <tr className="table-gray">
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
                              {permissions.edit && (
                                <Form.Check
                                  type="switch"
                                  id={`active-switch-${item.id}`}
                                  checked={item.isActive}
                                  onChange={() =>
                                    handleToggleActive(item.id, item.isActive)
                                  }
                                />
                              )}
                              {permissions.edit && (
                                <CreateTwoToneIcon
                                  onClick={() => handleEdit(item.id)}
                                  color="primary"
                                  style={{
                                    cursor: "pointer",
                                    marginLeft: "5px",
                                  }}
                                />
                              )}
                              {permissions.del && (
                                <DeleteRoundedIcon
                                  onClick={() => openDeleteModal(item.id, idx)}
                                  color="error"
                                  style={{
                                    cursor: "pointer",
                                    marginLeft: "5px",
                                  }}
                                />
                              )}
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

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination className="justify-content-center mt-3">
                  <Pagination.Prev
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  />
                  {[...Array(totalPages)].map((_, i) => (
                    <Pagination.Item
                      key={i + 1}
                      active={i + 1 === currentPage}
                      onClick={() => handlePageChange(i + 1)}
                    >
                      {i + 1}
                    </Pagination.Item>
                  ))}
                  <Pagination.Next
                    onClick={() => handlePageChange(currentPage + 1)}
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
