// Created by: Rishiraj | Permission-integrated Employee Salary List | 28 Oct 2025

import React, { useState, useEffect } from "react";
import { Card, Row, Col, Button, Spinner, Table, Image } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import IsoIcon from "@mui/icons-material/Iso";
import HistoryIcon from "@mui/icons-material/History";
import api from "../../../../api/axios";
import { successToast } from "../../../../components/Toast/successToast";
import { errorToast } from "../../../../components/Toast/errorToast";
import AddSalaryModal from "./AddSalaryModal";
import EditSalaryModal from "./UpdateSalaryModal";
import SalaryHistoryModal from "./SalaryHistoryModal";

const EmployeeSalaryList = () => {
  const [employeeList, setEmployeeList] = useState([]);
  const [salaryGroups, setSalaryGroups] = useState([]);
  const [employeeSalaries, setEmployeeSalaries] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔐 Permission states
  const [permissions, setPermissions] = useState(null);
  const [permLoading, setPermLoading] = useState(true);
  const { pathname } = useLocation();

  // Modal states
  const [showAddSalary, setShowAddSalary] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showEditSalary, setShowEditSalary] = useState(false);
  const [selectedSalaryId, setSelectedSalaryId] = useState(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedHistoryEmployee, setSelectedHistoryEmployee] = useState(null);

  // 🔐 Fetch role-based permissions (same logic as TaskList)
  const FETCHPERMISSION = async () => {
    setPermLoading(true);
    try {
      const res = await api.get("/api/v1/admin/rolePermission");
      let data = [];
      if (Array.isArray(res.data)) data = res.data;
      else if (Array.isArray(res.data.data)) data = res.data.data;

      const roleId = String(sessionStorage.getItem("roleId"));

      // 👑 Super Admin — full access
      if (roleId === "1") {
        setPermissions({
          view: true,
          add: true,
          edit: true,
          del: true,
          any_one: true,
        });
        return;
      }

      // Match permission by current route
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
          any_one:
            matchedPermission.any_one === true ||
            matchedPermission.any_one === 1,
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

  // Fetch data (only if user has view permission)
  const fetchData = async () => {
    try {
      setLoading(true);
      const [employeesRes, salaryGroupsRes, employeeSalariesRes] =
        await Promise.all([
          api.get("/api/v1/admin/employee/active"),
          api.get("/api/v1/admin/salaryGroup"),
          api.get("/api/v1/admin/employeeSalary/employee-salary"),
        ]);

      setEmployeeList(employeesRes?.data?.data || []);
      setSalaryGroups(salaryGroupsRes?.data?.data || []);
      setEmployeeSalaries(employeeSalariesRes?.data?.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      errorToast("Failed to fetch salary data");
    } finally {
      setLoading(false);
    }
  };

  // 🪄 Load permissions first, then fetch data
  useEffect(() => {
    FETCHPERMISSION();
  }, [pathname]);

  useEffect(() => {
    if (!permLoading && permissions?.view) {
      fetchData();
    }
  }, [permLoading, permissions]);

  // Modal handlers
  const handleAddSalaryClick = (employee) => {
    if (!permissions?.add) {
      errorToast("You don’t have permission to add salary");
      return;
    }
    setSelectedEmployee(employee);
    setShowAddSalary(true);
  };

  const handleEditClick = (salaryId) => {
    if (!permissions?.edit) {
      errorToast("You don’t have permission to edit salary");
      return;
    }
    setSelectedSalaryId(salaryId);
    setShowEditSalary(true);
  };

  const handleHistoryClick = (employee) => {
    setSelectedHistoryEmployee(employee);
    setShowHistoryModal(true);
  };

  const hasSalary = (employeeId) =>
    employeeSalaries.some((sal) => sal.employee_id === employeeId);

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

  // ✅ Main render
  return (
    <>
      <Row className="mt-4">
        <Col sm="12">
          <Card>
            <Card.Header>
              <h5 className="card-title fw-light mb-0">Employee Salary List</h5>
            </Card.Header>
            <Card.Body className="px-0 pt-3">
              {loading ? (
                <div className="text-center p-4">
                  <Spinner animation="border" />
                </div>
              ) : (
                <div className="table-responsive">
                  <Table hover responsive>
                    <thead>
                      <tr className="table-gray">
                        <th>Photo</th>
                        <th>Name</th>
                        <th>Role</th>
                        <th>Department</th>
                        <th>Designation</th>
                        <th>Employment Type</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employeeList.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="text-center">
                            No active employees found
                          </td>
                        </tr>
                      ) : (
                        employeeList.map((emp) => {
                          const salary = employeeSalaries.find(
                            (sal) => sal.employee_id === emp.id
                          );
                          return (
                            <tr key={emp.id}>
                              <td>
                                <Image
                                  src={emp.photo || "/default-avatar.png"}
                                  roundedCircle
                                  width={40}
                                  height={40}
                                  alt="Employee"
                                />
                              </td>
                              <td>
                                <div className="fw-semibold">{emp.name}</div>
                                <div className="text-muted small">
                                  {emp.email}
                                </div>
                              </td>
                              <td>{emp.role?.name || "--"}</td>
                              <td>{emp.department?.name || "--"}</td>
                              <td>{emp.designation?.name || "--"}</td>
                              <td>{emp.employmentType?.emp_type || "--"}</td>
                              <td>
                                {!hasSalary(emp.id) ? (
                                  permissions?.add && (
                                    <Button
                                      variant="primary"
                                      size="sm"
                                      onClick={() => handleAddSalaryClick(emp)}
                                    >
                                      + Add Salary
                                    </Button>
                                  )
                                ) : (
                                  <>
                                    {permissions?.edit && (
                                      <IsoIcon
                                        color="error"
                                        className="me-2"
                                        style={{ cursor: "pointer" }}
                                        onClick={() =>
                                          handleEditClick(salary.id)
                                        }
                                      />
                                    )}
                                    <HistoryIcon
                                      color="primary"
                                      style={{ cursor: "pointer" }}
                                      onClick={() => handleHistoryClick(emp)}
                                    />
                                  </>
                                )}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Add Salary */}
      {selectedEmployee && (
        <AddSalaryModal
          show={showAddSalary}
          handleClose={() => setShowAddSalary(false)}
          employee={selectedEmployee}
          salaryGroups={salaryGroups}
        />
      )}

      {/* Edit Salary */}
      {showEditSalary && (
        <EditSalaryModal
          show={showEditSalary}
          handleClose={() => setShowEditSalary(false)}
          salaryId={selectedSalaryId}
          salaryGroups={salaryGroups}
        />
      )}

      {/* Salary History */}
      {showHistoryModal && selectedHistoryEmployee && (
        <SalaryHistoryModal
          show={showHistoryModal}
          handleClose={() => setShowHistoryModal(false)}
          employee={selectedHistoryEmployee}
        />
      )}
    </>
  );
};

export default EmployeeSalaryList;
