import React, { useEffect, useState } from "react";
import { Card, Row, Col, Button, Form, Table, Spinner } from "react-bootstrap";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../../../api/axios";
import { FaCheck, FaTimes } from "react-icons/fa";
import { BsDownload } from "react-icons/bs";
import { MdEventAvailable } from "react-icons/md"; // Holiday icon
import { GiPalmTree } from "react-icons/gi"; // Leave icon

const AttendanceList = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedEmp, setSelectedEmp] = useState("");
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [attendanceData, setAttendanceData] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [defaultHolidays, setDefaultHolidays] = useState([]);
  const [employeeLeaves, setEmployeeLeaves] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🟢 Fetch Active Employees
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/v1/admin/employee/active");
      const empList = res.data.data || [];
      setEmployees(empList);

      const uniqueDepts = [
        ...new Map(
          empList
            .filter((e) => e.department)
            .map((e) => [e.department.id, e.department])
        ).values(),
      ];
      setDepartments(uniqueDepts);
    } catch (err) {
      console.error("Error fetching employees:", err);
      toast.error("Failed to fetch employees");
    } finally {
      setLoading(false);
    }
  };

  // 🟢 Fetch Active Holidays (specific dates)
  const fetchHolidays = async () => {
    try {
      const res = await api.get("/api/v1/admin/holiday/active");
      if (res.data && Array.isArray(res.data)) {
        setHolidays(res.data);
      } else if (res.data.data) {
        setHolidays(res.data.data);
      } else {
        setHolidays([]);
      }
    } catch (err) {
      console.error("Error fetching holidays:", err);
      toast.error("Failed to fetch holidays");
    }
  };

  // 🟢 Fetch Default Holidays (like Sunday, Monday)
  const fetchDefaultHolidays = async () => {
    try {
      const res = await api.get("/api/v1/admin/defaultHoliday/active");
      if (Array.isArray(res.data)) {
        setDefaultHolidays(res.data);
      } else if (res.data.data) {
        setDefaultHolidays(res.data.data);
      } else {
        setDefaultHolidays([]);
      }
    } catch (err) {
      console.error("Error fetching default holidays:", err);
      toast.error("Failed to fetch default holidays");
    }
  };

  // 🟢 Fetch Employee Leaves (approved only)
  const fetchEmployeeLeaves = async () => {
    try {
      const res = await api.get("/api/v1/admin/employeeLeave/");
      if (res.data && res.data.data) {
        const approved = res.data.data.filter((l) => l.status === "approve");
        setEmployeeLeaves(approved);
      } else {
        setEmployeeLeaves([]);
      }
    } catch (err) {
      console.error("Error fetching leaves:", err);
      toast.error("Failed to fetch employee leaves");
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchHolidays();
    fetchDefaultHolidays();
    fetchEmployeeLeaves();
  }, []);

  useEffect(() => {
    if (selectedDept) {
      const filtered = employees.filter(
        (emp) => emp.department?.id === parseInt(selectedDept)
      );
      setFilteredEmployees(filtered);
    } else {
      setFilteredEmployees([]);
    }
  }, [selectedDept, employees]);

  // 🗓️ Get all dates for a month
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

        // Filter report only for selected month/year
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

        // 🟡 Merge Attendance + Holidays + Default Holidays + Leaves
        const attendance = allDates.map((date) => {
          const dayName = new Date(date).toLocaleString("en-US", {
            weekday: "long",
          });

          // 1️⃣ Check Default Holiday
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

          // 2️⃣ Check Specific Holiday (from DB)
          const holiday = holidays.find((h) => h.date === date);
          if (holiday) {
            return {
              date,
              status: "Holiday",
              occasion: holiday.occasion,
            };
          }

          // 3️⃣ Check Approved Leave for Employee
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

          // 4️⃣ Else Attendance Record
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

  // 🧩 Render icons
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

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .attendance-table th,
          .attendance-table td {
            font-size: 10px;
            padding: 0.25rem;
          }
          .attendance-table th:first-child,
          .attendance-table td:first-child {
            min-width: 150px;
            text-align: left;
          }
          .attendance-table {
            white-space: nowrap;
          }
        }
      `}</style>

      <Row className="mt-4">
        <Col sm="12">
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Attendance</h5>
              <Button
                variant="outline-primary"
                size="sm"
                className="d-none d-md-inline-flex"
              >
                <BsDownload className="me-2" />
                Export
              </Button>
            </Card.Header>

            <Card.Body>
              {/* Filters */}
              <Row className="mb-3">
                <Col xs={12} md={3} className="mb-2">
                  <Form.Group>
                    <Form.Label>Department</Form.Label>
                    <Form.Select
                      value={selectedDept}
                      onChange={(e) => {
                        setSelectedDept(e.target.value);
                        setSelectedEmp("");
                      }}
                    >
                      <option value="">Select Department</option>
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col xs={12} md={3} className="mb-2">
                  <Form.Group>
                    <Form.Label>Employee</Form.Label>
                    <Form.Select
                      value={selectedEmp}
                      onChange={(e) => setSelectedEmp(e.target.value)}
                    >
                      <option value="">Select Employee</option>
                      {filteredEmployees.map((emp) => (
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
                    className="align-middle text-center attendance-table"
                  >
                    <thead className="table-light">
                      <tr>
                        <th>Employee</th>
                        {attendanceData[0].attendance
                          .filter(
                            (d) => new Date(d.date).getMonth() + 1 === month
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
                              (d) => new Date(d.date).getMonth() + 1 === month
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
