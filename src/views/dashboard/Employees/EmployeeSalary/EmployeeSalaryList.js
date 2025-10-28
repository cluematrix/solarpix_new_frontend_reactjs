import React, { useState, useEffect } from "react";
import { Card, Row, Col, Button, Spinner, Table, Image } from "react-bootstrap";
import api from "../../../../api/axios";
import AddSalaryModal from "./AddSalaryModal";
import EditSalaryModal from "./UpdateSalaryModal";
import SalaryHistoryModal from "./SalaryHistoryModal"; // 👈 new import
import IsoIcon from "@mui/icons-material/Iso";
import HistoryIcon from "@mui/icons-material/History";

const EmployeeSalaryList = () => {
  const [employeeList, setEmployeeList] = useState([]);
  const [salaryGroups, setSalaryGroups] = useState([]);
  const [employeeSalaries, setEmployeeSalaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddSalary, setShowAddSalary] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showEditSalary, setShowEditSalary] = useState(false);
  const [selectedSalaryId, setSelectedSalaryId] = useState(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false); // 👈 new
  const [selectedHistoryEmployee, setSelectedHistoryEmployee] = useState(null); // 👈 new

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

  const handleEditClick = (salaryId) => {
    setSelectedSalaryId(salaryId);
    setShowEditSalary(true);
  };

  const handleHistoryClick = (employee) => {
    setSelectedHistoryEmployee(employee);
    setShowHistoryModal(true);
  };

  const hasSalary = (employeeId) =>
    employeeSalaries.some((sal) => sal.employee_id === employeeId);

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
                                  <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={() => handleAddSalaryClick(emp)}
                                  >
                                    + Add Salary
                                  </Button>
                                ) : (
                                  <>
                                    <IsoIcon
                                      color="error"
                                      className="me-2"
                                      style={{ cursor: "pointer" }}
                                      onClick={() => handleEditClick(salary.id)}
                                    />
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

      {selectedEmployee && (
        <AddSalaryModal
          show={showAddSalary}
          handleClose={() => setShowAddSalary(false)}
          employee={selectedEmployee}
          salaryGroups={salaryGroups}
        />
      )}

      {showEditSalary && (
        <EditSalaryModal
          show={showEditSalary}
          handleClose={() => setShowEditSalary(false)}
          salaryId={selectedSalaryId}
          salaryGroups={salaryGroups}
        />
      )}

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
