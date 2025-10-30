import React, { useState, useEffect } from "react";
import { Card, Row, Col, Button, Form, Spinner } from "react-bootstrap";
import Select from "react-select";
import api from "../../../../api/axios";
import { errorToast } from "../../../../components/Toast/errorToast";
import { successToast } from "../../../../components/Toast/successToast";

const SELECT_ALL_OPTION = { value: "*", label: "Select All" };

const EmployeePayrollList = () => {
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedDept, setSelectedDept] = useState(null);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [includeExpense, setIncludeExpense] = useState(true);
  const [addTimelog, setAddTimelog] = useState(false);
  const [useAttendance, setUseAttendance] = useState(false);
  const [loading, setLoading] = useState(false);

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  // Fetch Departments
  const fetchDepartments = async () => {
    try {
      const res = await api.get("/api/v1/admin/department");
      setDepartments(
        (res?.data?.data || []).map((d) => ({
          value: d.id,
          label: d.name,
        }))
      );
    } catch (err) {
      console.error("Error fetching departments:", err);
      errorToast("Failed to load departments");
    }
  };

  // Fetch Active Employees
  const fetchActiveEmployees = async (deptId = null) => {
    try {
      setEmployees([]);
      let url = "/api/v1/admin/employeeSalary/active/latest";
      if (deptId) url += `?department_id=${deptId}`;
      const res = await api.get(url);
      const employeeOptions = (res?.data?.data || []).map((e) => ({
        value: e.employee_id,
        label: e.employeeSalary?.name || e.name || "Unnamed",
      }));
      setEmployees(employeeOptions);
    } catch (err) {
      console.error("Error fetching active employees:", err);
      errorToast("Failed to load active employees");
    }
  };

  useEffect(() => {
    fetchDepartments();
    fetchActiveEmployees();
  }, []);

  // On department change
  const handleDeptChange = (selected) => {
    setSelectedDept(selected);
    setSelectedEmployees([]);
    if (selected?.value) fetchActiveEmployees(selected.value);
    else fetchActiveEmployees();
  };

  // Custom options: Add "Select All" at the top
  const employeeOptionsWithSelectAll =
    employees.length > 0 ? [SELECT_ALL_OPTION, ...employees] : [];

  // Handle employee selection with "Select All" logic
  const handleEmployeeChange = (selected) => {
    if (selected && selected.some((option) => option.value === "*")) {
      // If "Select All" is selected
      const allEmployeeOptions = employees;
      const isSelectingAll = selected.length === employees.length + 1; // +1 for Select All

      if (isSelectingAll) {
        // Already all selected → deselect all
        setSelectedEmployees([]);
      } else {
        // Select all employees (exclude "Select All")
        setSelectedEmployees(allEmployeeOptions);
      }
    } else {
      // Normal selection
      setSelectedEmployees(selected || []);
    }
  };

  // Handle Payroll Generate
  const handleGenerate = async () => {
    const actualEmployeeIds = selectedEmployees
      .filter((e) => e.value !== "*")
      .map((e) => e.value);

    if (actualEmployeeIds.length === 0) {
      errorToast("Please select at least one employee");
      return;
    }

    const payload = {
      employee_ids: actualEmployeeIds,
      month: currentMonth,
      year: currentYear,
      generated_by: Number(sessionStorage.getItem("userId")) || 1,
      include_expense_claims: includeExpense,
      add_timelogs: addTimelog,
      use_attendance: useAttendance,
    };

    try {
      setLoading(true);
      const res = await api.post("/api/v1/admin/payroll", payload);
      if (res.data.success) {
        successToast("Payroll generated successfully!");
      } else {
        errorToast(res.data.message || "Payroll generation failed");
      }
    } catch (err) {
      console.error("Error generating payroll:", err);
      errorToast("Failed to generate payroll");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <Card>
        <Card.Header>
          <h5 className="fw-bold mb-0">Generate Payroll</h5>
        </Card.Header>
        <Card.Body>
          {/* Department Select (Uncomment if needed) */}
          {/* <Row className="mb-3">
            <Col md={6}>
              <Form.Label>Department</Form.Label>
              <Select
                options={departments}
                value={selectedDept}
                onChange={handleDeptChange}
                placeholder="Select Department"
                isClearable
              />
            </Col>
          </Row> */}

          {/* Employee Multi-Select with Select All */}
          <Row className="mb-3">
            <Col md={6}>
              <Form.Label>Select Employee(s)</Form.Label>
              <Select
                options={employeeOptionsWithSelectAll}
                value={selectedEmployees}
                onChange={handleEmployeeChange}
                placeholder="Select Employee(s)"
                isMulti
                closeMenuOnSelect={false}
                hideSelectedOptions={false}
                // Optional: Style Select All differently
                formatOptionLabel={(option) => {
                  if (option.value === "*") {
                    return (
                      <strong style={{ color: "#007bff" }}>
                        {option.label}
                      </strong>
                    );
                  }
                  return option.label;
                }}
              />
            </Col>
          </Row>

          {/* Generate Button */}
          <div className="text-end mt-3">
            <Button
              variant="primary"
              onClick={handleGenerate}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" /> Generating...
                </>
              ) : (
                "Generate"
              )}
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default EmployeePayrollList;
