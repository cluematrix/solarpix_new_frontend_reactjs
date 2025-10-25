import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Spinner,
  Table,
  Image,
  Form,
} from "react-bootstrap";
import api from "../../../../api/axios";
import AddSalaryModal from "./AddSalaryModal";

const EmployeeSalaryList = () => {
  const [employeeList, setEmployeeList] = useState([]);
  const [salaryGroups, setSalaryGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddSalary, setShowAddSalary] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Fetch active employees and salary groups
  const fetchData = async () => {
    try {
      setLoading(true);
      const [employeesRes, salaryGroupsRes] = await Promise.all([
        api.get("/api/v1/admin/employee/active"),
        api.get("/api/v1/admin/salaryGroup"),
      ]);
      const employees = employeesRes?.data?.data || [];
      const groups = salaryGroupsRes?.data?.data || [];
      setEmployeeList(employees);
      setSalaryGroups(groups);
      if (employees.length > 0) setSelectedEmployee(employees[0]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddSalaryClick = (employee) => {
    setSelectedEmployee(employee);
    setShowAddSalary(true);
  };

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
                        employeeList.map((emp) => (
                          <tr key={emp.id}>
                            <td>
                              <Image
                                src={
                                  emp.photo ? emp.photo : "/default-avatar.png"
                                }
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
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => handleAddSalaryClick(emp)}
                              >
                                + Add Salary
                              </Button>
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

      {/* Add Salary Modal */}
      {selectedEmployee && (
        <AddSalaryModal
          show={showAddSalary}
          handleClose={() => setShowAddSalary(false)}
          employee={selectedEmployee}
          salaryGroups={salaryGroups}
        />
      )}
    </>
  );
};

export default EmployeeSalaryList;
