// Created by: Rishiraj | Integrated Employee Payroll List | 28 Oct 2025

import React, { useState, useEffect } from "react";
import { Card, Row, Col, Button, Spinner, Table } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import IsoIcon from "@mui/icons-material/Iso";
import HistoryIcon from "@mui/icons-material/History";
import api from "../../../../api/axios";
import { errorToast } from "../../../../components/Toast/errorToast";

const EmployeePayrollList = () => {
  const [employeePayrolls, setEmployeePayrolls] = useState([]);
  const [loading, setLoading] = useState(true);

  // Permission states
  const [permissions, setPermissions] = useState(null);
  const [permLoading, setPermLoading] = useState(true);
  const { pathname } = useLocation();

  // Modal states
  const [showAddPayroll, setShowAddPayroll] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showEditPayroll, setShowEditPayroll] = useState(false);
  const [selectedPayrollId, setSelectedPayrollId] = useState(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedHistoryEmployee, setSelectedHistoryEmployee] = useState(null);

  // ✅ Fetch permissions
  const FETCHPERMISSION = async () => {
    setPermLoading(true);
    try {
      const res = await api.get("/api/v1/admin/rolePermission");
      const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
      const roleId = String(sessionStorage.getItem("roleId"));

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

      const matched = data.find(
        (perm) =>
          String(perm.role_id) === roleId &&
          perm.route?.toLowerCase() === pathname?.toLowerCase()
      );

      if (matched) {
        setPermissions({
          view: matched.view === true || matched.view === 1,
          add: matched.add === true || matched.add === 1,
          edit: matched.edit === true || matched.edit === 1,
          del: matched.del === true || matched.del === 1,
          any_one: matched.any_one === true || matched.any_one === 1,
        });
      } else {
        setPermissions(null);
      }
    } catch (err) {
      console.error("Permission fetch error:", err);
      setPermissions(null);
    } finally {
      setPermLoading(false);
    }
  };

  // ✅ Fetch payroll data
  const fetchPayrollData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/v1/admin/employeeSalary/employee-salary");
      setEmployeePayrolls(res?.data?.data || []);
    } catch (error) {
      console.error("Payroll fetch error:", error);
      errorToast("Failed to fetch payroll data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    FETCHPERMISSION();
  }, [pathname]);

  useEffect(() => {
    if (!permLoading && permissions?.view) {
      fetchPayrollData();
    }
  }, [permLoading, permissions]);

  // ✅ Modal handlers
  const handleAddPayrollClick = (employee) => {
    if (!permissions?.add) {
      errorToast("You don’t have permission to add payroll");
      return;
    }
    setSelectedEmployee(employee);
    setShowAddPayroll(true);
  };

  const handleEditClick = (payrollId) => {
    if (!permissions?.edit) {
      errorToast("You don’t have permission to edit payroll");
      return;
    }
    setSelectedPayrollId(payrollId);
    setShowEditPayroll(true);
  };

  const handleHistoryClick = (employee) => {
    setSelectedHistoryEmployee(employee);
    setShowHistoryModal(true);
  };

  // ✅ Generate Salary Slip Handler
  const handleGenerateSlip = async (payroll) => {
    try {
      if (!payroll?.id) return;

      const res = await api.get(
        `/api/v1/admin/employeeSalary/generate-slip/${payroll.id}`,
        { responseType: "blob" } // expecting a PDF file
      );

      // Create blob for download
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `${payroll.employeeSalary?.name || "Employee"}_SalarySlip_${
          payroll.month
        }_${payroll.year}.pdf`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error generating salary slip:", error);
      errorToast("Failed to generate salary slip");
    }
  };

  // ✅ Loader state
  if (permLoading) {
    return (
      <div className="loader-div">
        <Spinner animation="border" className="spinner" />
      </div>
    );
  }

  // ✅ No permission case
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

  // ✅ Render UI
  return (
    <>
      <Row className="mt-4">
        <Col sm="12">
          <Card>
            <Card.Header>
              <h5 className="card-title fw-light mb-0">
                Employee Payroll List
              </h5>
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
                        <th>Employee</th>
                        <th>Month</th>
                        <th>Year</th>
                        <th>Total Monthly</th>
                        <th>Net Monthly</th>
                        <th>Payment Method</th>
                        <th>Status</th>
                        <th>Paid Date</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employeePayrolls.length === 0 ? (
                        <tr>
                          <td colSpan="9" className="text-center">
                            No payroll records found
                          </td>
                        </tr>
                      ) : (
                        employeePayrolls.map((payroll) => (
                          <tr key={payroll.id}>
                            <td>
                              <div className="fw-semibold">
                                {payroll.employeeSalary?.name || "--"}
                              </div>
                            </td>
                            <td>{payroll.month || "--"}</td>
                            <td>{payroll.year || "--"}</td>
                            <td>
                              ₹{Number(payroll.total_monthly).toLocaleString()}
                            </td>
                            <td className="fw-bold text-success">
                              ₹{Number(payroll.net_monthly).toLocaleString()}
                            </td>
                            <td>
                              {payroll.salaryPaymentMethod
                                ?.salary_payment_method || "--"}
                            </td>
                            <td>
                              <span
                                className={`badge ${
                                  payroll.status === "paid"
                                    ? "bg-success"
                                    : "bg-warning text-dark"
                                }`}
                              >
                                {payroll.status?.toUpperCase() || "--"}
                              </span>
                            </td>
                            <td>
                              {payroll.paid_date
                                ? new Date(
                                    payroll.paid_date
                                  ).toLocaleDateString("en-IN")
                                : "--"}
                            </td>
                            <td>
                              <div className="d-flex align-items-center gap-2">
                                {/* ✅ Generate Salary Slip */}
                                <Button
                                  variant="outline-primary"
                                  size="sm"
                                  onClick={() => handleGenerateSlip(payroll)}
                                >
                                  Generate Slip
                                </Button>

                                {/* Edit */}
                                {permissions?.edit && (
                                  <IsoIcon
                                    color="error"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => handleEditClick(payroll.id)}
                                  />
                                )}

                                {/* History */}
                                <HistoryIcon
                                  color="primary"
                                  style={{ cursor: "pointer" }}
                                  onClick={() =>
                                    handleHistoryClick(payroll.employeeSalary)
                                  }
                                />
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default EmployeePayrollList;
