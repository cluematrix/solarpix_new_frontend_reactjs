import React, { useEffect, useState } from "react";
import { Card, Row, Col, Button, Form, Table, Spinner } from "react-bootstrap";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../../../api/axios";
import { FaCheck, FaTimes } from "react-icons/fa";
import { BsDownload } from "react-icons/bs";
import { MdEventAvailable } from "react-icons/md";
import { GiPalmTree } from "react-icons/gi";
import { useLocation } from "react-router";

const AttendanceList = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmp, setSelectedEmp] = useState("");
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [attendanceData, setAttendanceData] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [defaultHolidays, setDefaultHolidays] = useState([]);
  const [employeeLeaves, setEmployeeLeaves] = useState([]);
  const [loading, setLoading] = useState(true); // include permissions loading state
  const [permissions, setPermissions] = useState(null);

  const { pathname } = useLocation();

  // 🔑 Fetch Role Permissions
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
      console.error("Error fetching roles:", err);
      setPermissions(null);
    } finally {
      setLoading(false);
    }
  };

  // Run once when route changes
  useEffect(() => {
    setLoading(true);
    FETCHPERMISSION();
  }, [pathname]);

  // 🟢 Fetch Active Employees
  const fetchEmployees = async () => {
    try {
      const res = await api.get("/api/v1/admin/employee/active");
      const empList = res.data.data || [];

      const sessionEmpId = parseInt(sessionStorage.getItem("employee_id"));
      const sessionRoleId = parseInt(sessionStorage.getItem("roleId"));

      if (sessionRoleId === 1) {
        // 🟢 Admin (Role ID 1): show all employees
        setEmployees(empList);
      } else if (permissions && permissions.any_one === true) {
        // 🟡 Non-admin but "any_one" is true → show all employees
        setEmployees(empList);
      } else {
        // 🔴 Non-admin and "any_one" is false → show only own record
        const filtered = empList.filter((emp) => emp.id === sessionEmpId);
        setEmployees(filtered);
        setSelectedEmp(sessionEmpId);
      }
    } catch (err) {
      console.error("Error fetching employees:", err);
      toast.error("Failed to fetch employees");
    }
  };

  const fetchHolidays = async () => {
    try {
      const res = await api.get("/api/v1/admin/holiday/active");
      setHolidays(res.data.data || []);
    } catch (err) {
      console.error("Error fetching holidays:", err);
      toast.error("Failed to fetch holidays");
    }
  };

  const fetchDefaultHolidays = async () => {
    try {
      const res = await api.get("/api/v1/admin/defaultHoliday/active");
      setDefaultHolidays(res.data.data || res.data || []);
    } catch (err) {
      console.error("Error fetching default holidays:", err);
      toast.error("Failed to fetch default holidays");
    }
  };

  const fetchEmployeeLeaves = async () => {
    try {
      const res = await api.get("/api/v1/admin/employeeLeave/");
      const approved = (res.data.data || []).filter(
        (l) => l.status === "approve"
      );
      setEmployeeLeaves(approved);
    } catch (err) {
      console.error("Error fetching leaves:", err);
      toast.error("Failed to fetch employee leaves");
    }
  };

  useEffect(() => {
    if (permissions?.view) {
      fetchEmployees();
      fetchHolidays();
      fetchDefaultHolidays();
      fetchEmployeeLeaves();
    }
  }, [permissions]);

  // 🗓️ Utility to get all dates of month
  const getAllDatesOfMonth = (month, year) => {
    const dates = [];
    const lastDay = new Date(year, month, 0).getDate();
    for (let day = 1; day <= lastDay; day++) {
      const dateObj = new Date(year, month - 1, day);
      const iso = dateObj.toISOString().split("T")[0];
      dates.push(iso);
    }
    return dates;
  };

  // 🟢 Fetch Attendance
  const fetchAttendance = async () => {
    if (!selectedEmp) {
      toast.warning("Please select an employee");
      return;
    }

    setLoading(true);
    try {
      const res = await api.get(
        `/api/v1/admin/attendance/employee/${selectedEmp}/daywise`
      );

      if (res.data.success) {
        const data = res.data.data;
        const report = data.report || [];
        const monthStr = String(month).padStart(2, "0");

        const filteredReport = report.filter((r) =>
          r.date.includes(`/${monthStr}/`)
        );

        const reportMap = {};
        filteredReport.forEach((r) => {
          const [dd, mm, yyyy] = r.date.split("/");
          const parsedDate = new Date(`${yyyy}-${mm}-${dd}`);
          const isoDate = parsedDate.toISOString().split("T")[0];
          reportMap[isoDate] = r.status === "Yes" ? "Present" : "Absent";
        });

        const allDates = getAllDatesOfMonth(month, year);

        const attendance = allDates.map((date) => {
          const dayName = new Date(date).toLocaleString("en-US", {
            weekday: "long",
          });

          const defaultHoliday = defaultHolidays.find((h) =>
            h.day.includes(dayName)
          );
          if (defaultHoliday) {
            return {
              date,
              status: "Holiday",
              occasion: defaultHoliday.occasion,
            };
          }

          const holiday = holidays.find((h) => h.date === date);
          if (holiday) {
            return {
              date,
              status: "Holiday",
              occasion: holiday.occasion,
            };
          }

          const leave = employeeLeaves.find(
            (l) =>
              l.employee_id === parseInt(selectedEmp) &&
              new Date(date) >= new Date(l.start_date) &&
              new Date(date) <= new Date(l.end_date)
          );
          if (leave) {
            return {
              date,
              status: "Leave",
              occasion: leave.leaveType?.leave_type || "Leave",
            };
          }

          return {
            date,
            status: reportMap[date] || "Absent",
          };
        });

        const empData = [
          {
            id: selectedEmp,
            name: data.employee_name,
            empCode: data.employee_Comp_Id,
            joiningDate: data.joining_date,
            total_days: attendance.length,
            present_days: attendance.filter((r) => r.status === "Present")
              .length,
            absent_days: attendance.filter((r) => r.status === "Absent").length,
            holiday_days: attendance.filter((r) => r.status === "Holiday")
              .length,
            leave_days: attendance.filter((r) => r.status === "Leave").length,
            attendance,
          },
        ];

        setAttendanceData(empData);
        toast.success("Attendance loaded successfully");
      } else {
        toast.error("No data found");
        setAttendanceData([]);
      }
    } catch (err) {
      console.error("Error fetching attendance:", err);
      toast.error("Failed to load attendance");
      setAttendanceData([]);
    } finally {
      setLoading(false);
    }
  };

  const renderStatusIcon = (status, occasion) => {
    switch (status) {
      case "Present":
        return <FaCheck className="text-success" title="Present" />;
      case "Absent":
        return <FaTimes className="text-danger" title="Absent" />;
      case "Holiday":
        return (
          <MdEventAvailable
            className="text-warning"
            title={occasion || "Holiday"}
          />
        );
      case "Leave":
        return <GiPalmTree className="text-info" title={occasion || "Leave"} />;
      default:
        return "-";
    }
  };

  // 🌀 Show loader while permissions are fetched
  if (loading && !permissions) {
    return (
      <div className="loader-div">
        <Spinner animation="border" className="spinner" />
      </div>
    );
  }

  // 🚫 No View Permission
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
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Attendance</h5>
              {permissions.add && (
                <Button variant="outline-primary" size="sm">
                  <BsDownload className="me-2" />
                  Export
                </Button>
              )}
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

                <Col
                  xs={12}
                  md={2}
                  className="d-flex align-items-end justify-content-end mb-2"
                >
                  {permissions.view && (
                    <Button
                      variant="primary"
                      className="w-100"
                      onClick={fetchAttendance}
                      disabled={loading}
                    >
                      {loading ? (
                        <Spinner animation="border" size="sm" />
                      ) : (
                        "Load"
                      )}
                    </Button>
                  )}
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
              {attendanceData.length > 0 && (
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
                        {attendanceData[0].attendance
                          .filter(
                            (d) => new Date(d.date).getMonth() === month - 1
                          )
                          .sort((a, b) => new Date(a.date) - new Date(b.date))
                          .map((d, idx) => (
                            <th key={idx} title={d.date}>
                              {new Date(d.date).getDate()}
                            </th>
                          ))}
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceData.map((emp) => (
                        <tr key={emp.id}>
                          <td className="text-start">
                            <strong>{emp.name}</strong>
                            <br />
                            <small className="text-muted">{emp.empCode}</small>
                          </td>
                          {emp.attendance
                            .filter(
                              (d) => new Date(d.date).getMonth() === month - 1
                            )
                            .sort((a, b) => new Date(a.date) - new Date(b.date))
                            .map((d, idx) => (
                              <td key={idx}>
                                {renderStatusIcon(d.status, d.occasion)}
                              </td>
                            ))}
                          <td>
                            {emp.present_days} / {emp.total_days}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}

              {!loading && attendanceData.length === 0 && (
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
