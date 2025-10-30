// Created by: Rishiraj | Simplified Monthly Attendance with Permission (Final) | 28 Oct 2025

import React, { useEffect, useState } from "react";
import { Card, Row, Col, Button, Form, Table, Spinner } from "react-bootstrap";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../../../api/axios";
import { FaCheck, FaTimes } from "react-icons/fa";
import { MdEventAvailable } from "react-icons/md";
import { GiPalmTree } from "react-icons/gi";
import { useLocation } from "react-router-dom";

const AttendanceList = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmp, setSelectedEmp] = useState("");
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔐 Permissions
  const [permissions, setPermissions] = useState(null);
  const [permLoading, setPermLoading] = useState(true);
  const { pathname } = useLocation();

  // ✅ Fetch role-based permissions
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
          any_one: true, // ✅ important: super admin gets full list
          isSuperAdmin: true,
        });
        return;
      }

      // Match permission by route
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
            matchedPermission.any_one == "true" ||
            matchedPermission.any_one == 1,
          isSuperAdmin: false,
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

  // ✅ Fetch active employees (permission-based)
  const fetchEmployees = async () => {
    try {
      const res = await api.get("/api/v1/admin/employee/active");
      let empList = res.data.data || [];

      const loggedEmpId = String(sessionStorage.getItem("employee_id"));
      const roleId = String(sessionStorage.getItem("roleId"));

      // ✅ Super Admin or any_one → all employees
      if (permissions?.any_one || permissions?.isSuperAdmin) {
        setEmployees(empList);
      } else {
        // 👤 Only self
        const self = empList.filter((emp) => String(emp.id) === loggedEmpId);
        setEmployees(self);
        setSelectedEmp(loggedEmpId); // auto-select own name
      }
    } catch (err) {
      console.error("Error fetching employees:", err);
      toast.error("Failed to fetch employees");
    }
  };

  // ✅ Fetch attendance from the new API
  const fetchAttendance = async () => {
    if (!selectedEmp) {
      toast.warning("Please select an employee");
      return;
    }

    setLoading(true);
    try {
      const res = await api.get(
        `/api/v1/admin/attendance/employees/${selectedEmp}/attendance/monthly?month=${month}&year=${year}`
      );

      if (res.data.success) {
        setAttendanceData(res.data.data);
        toast.success("Attendance loaded successfully");
      } else {
        setAttendanceData(null);
        toast.error("No data found");
      }
    } catch (err) {
      console.error("Error fetching attendance:", err);
      toast.error("Failed to load attendance");
      setAttendanceData(null);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Icon Renderer
  const renderStatusIcon = (item) => {
    if (item.status === "Yes")
      return <FaCheck className="text-success" title="Present" />;
    if (item.status === "No" && item.leave)
      return <GiPalmTree className="text-info" title="Leave" />;
    if (item.festival_holiday)
      return (
        <MdEventAvailable
          className="text-warning"
          title={item.occasion || "Festival Holiday"}
        />
      );
    if (item.default_holiday)
      return (
        <MdEventAvailable
          className="text-secondary"
          title="Default Holiday (e.g., Sunday)"
        />
      );
    if (item.status === "No")
      return <FaTimes className="text-danger" title="Absent" />;
    return "-";
  };

  // 🔁 Load permissions first
  useEffect(() => {
    FETCHPERMISSION();
  }, [pathname]);

  // 🔁 Then load employee list after permissions ready
  useEffect(() => {
    if (!permLoading && permissions?.view) {
      fetchEmployees();
    }
  }, [permLoading, permissions]);

  // 🔁 Auto-load attendance when selection changes
  useEffect(() => {
    if (selectedEmp && permissions?.view) fetchAttendance();
  }, [selectedEmp, month, year]);

  // 🌀 Permission loading screen
  if (permLoading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
      </div>
    );
  }

  // 🚫 No permission
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

  // ✅ Main UI
  return (
    <>
      <Row className="mt-4">
        <Col sm="12">
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Monthly Attendance</h5>
              <Button
                variant="outline-primary"
                size="sm"
                onClick={fetchAttendance}
                disabled={loading}
              >
                {loading ? "Loading..." : "Reload"}
              </Button>
            </Card.Header>

            <Card.Body>
              {/* Filters */}
              <Row className="mb-3">
                <Col xs={12} md={4} className="mb-2">
                  <Form.Group>
                    <Form.Label>Employee</Form.Label>
                    <Form.Select
                      value={selectedEmp}
                      onChange={(e) => setSelectedEmp(e.target.value)}
                      disabled={
                        !permissions?.any_one && !permissions?.isSuperAdmin
                      }
                    >
                      <option value="">Select Employee</option>
                      {employees.map((emp) => (
                        <option key={emp.id} value={emp.id}>
                          {emp.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col xs={6} md={2} className="mb-2">
                  <Form.Group>
                    <Form.Label>Month</Form.Label>
                    <Form.Select
                      value={month}
                      onChange={(e) => setMonth(parseInt(e.target.value))}
                    >
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {new Date(0, i).toLocaleString("en", {
                            month: "long",
                          })}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col xs={6} md={2} className="mb-2">
                  <Form.Group>
                    <Form.Label>Year</Form.Label>
                    <Form.Control
                      type="number"
                      value={year}
                      onChange={(e) => setYear(parseInt(e.target.value))}
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* Legend */}
              <Row className="mb-2">
                <Col>
                  <div className="d-flex gap-3 align-items-center small text-muted">
                    <span>
                      <FaCheck className="text-success me-1" /> Present
                    </span>
                    <span>
                      <FaTimes className="text-danger me-1" /> Absent
                    </span>
                    <span>
                      <MdEventAvailable className="text-warning me-1" /> Holiday
                    </span>
                    <span>
                      <GiPalmTree className="text-info me-1" /> Leave
                    </span>
                  </div>
                </Col>
              </Row>

              {/* Attendance Table */}
              {loading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" />
                </div>
              ) : attendanceData ? (
                <div className="table-responsive mt-3">
                  <Table
                    bordered
                    hover
                    size="sm"
                    className="align-middle text-center"
                  >
                    <thead className="table-light">
                      <tr>
                        <th>Employee</th>
                        {attendanceData.report.map((d, idx) => (
                          <th key={idx} title={d.date}>
                            {d.date.split("/")[0]}
                          </th>
                        ))}
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="text-start">
                          <strong>{attendanceData.employee_name}</strong>
                          <br />
                          <small className="text-muted">
                            {attendanceData.employee_Comp_Id}
                          </small>
                        </td>
                        {attendanceData.report.map((item, idx) => (
                          <td key={idx}>{renderStatusIcon(item)}</td>
                        ))}
                        <td>
                          {attendanceData.present_days} /{" "}
                          {attendanceData.total_days}
                        </td>
                      </tr>
                    </tbody>
                  </Table>

                  <div className="mt-3">
                    <p>
                      <strong>Month:</strong> {attendanceData.month_name}{" "}
                      {attendanceData.year}
                    </p>
                    <p>
                      <strong>Present:</strong> {attendanceData.present_days} |{" "}
                      <strong>Absent:</strong> {attendanceData.absent_days}
                    </p>
                    <p>
                      <strong>Joining Date:</strong>{" "}
                      {attendanceData.joining_date}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted py-5">
                  No attendance data available
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        transition={Slide}
      />
    </>
  );
};

export default AttendanceList;
