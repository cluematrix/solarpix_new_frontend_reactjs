import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Row, Col, Button } from "react-bootstrap";
import CreateTwoToneIcon from "@mui/icons-material/CreateTwoTone";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import DeleteModal from "../AddEmployee/delete-modal";
import api from "../../../../api/axios";
import { successToast } from "../../../../components/Toast/successToast";
import { errorToast } from "../../../../components/Toast/errorToast";

const EmployeeList = () => {
  const navigate = useNavigate();

  const [employee, setEmployee] = useState([]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const rolesPerPage = 10;

  const indexOfLastRole = currentPage * rolesPerPage;
  const indexOfFirstRole = indexOfLastRole - rolesPerPage;
  const totalPages = Math.ceil(employee.length / rolesPerPage);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  // fetch employee
  const fetchEmployee = async () => {
    try {
      const res = await api.get("/api/v1/admin/employee");
      setEmployee(res.data.data);
    } catch (err) {
      console.error("Error fetching departments:", err);
    }
  };

  useEffect(() => {
    fetchEmployee();
  }, []);

 
  const handleEdit = (id) => {
    navigate(`/update-employee/${id}`)
  };

  const openDeleteModal = (id, idx) => {
    setDeleteIndex(idx);
    setShowDelete(true);
    setDeleteId(id)
  };

  const handleDeleteConfirm = () => {
    if(!deleteId) return;
    api
      .delete(`/api/v1/admin/employee/${deleteId}`)
      .then(() => {
        successToast("Employee Deleted Successfully");
        fetchEmployee();
        setShowDelete(false);
      })
      .catch((err) => {
        console.error("Error deleting department:", err);
        errorToast(err.response?.data?.message || "Failed to delete employee");
      });
  };

  return (
    <>
      <Row>
        <Col sm="12">
          <Card>
            <Card.Header className="d-flex justify-content-between">
              <h4 className="card-title">Employee List</h4>
              <Button
                className="btn-primary"
                onClick={() => navigate("/add-employee")}
              >
                + Add Employee
              </Button>
            </Card.Header>

            <Card.Body className="px-0">
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
                    {employee && employee?.length === 0 ? (
                      <tr>
                        <td colSpan="10" className="text-center">
                          No Employee available
                        </td>
                      </tr>
                    ) : (
                      employee?.map((item, idx) => (
                        <tr key={item.id}>
                          <td>{idx + 1}</td>
                          <td>{item.emp_id}</td>
                          <td>{item.name}</td>
                          <td>{item?.manager?.name}</td>
                          <td>
                            <span
                              className={`rounded-circle d-inline-block me-2`}
                              style={{
                                width: "10px",
                                height: "10px",
                                backgroundColor: item.isActive
                                  ? "#28a745"
                                  : "#dc3545",
                              }}
                            ></span>
                            {item.isActive ? "Active" : "Inactive"}
                          </td>
                          <td>
                            <CreateTwoToneIcon
                              className="me-2"
                              onClick={() =>
                              handleEdit(item.id)  
                              }
                              color="primary"
                              style={{ cursor: "pointer" }}
                            />
                            <DeleteRoundedIcon
                              onClick={() => openDeleteModal(item.id, idx)}
                              color="error"
                              style={{ cursor: "pointer" }}
                            />
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
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
            ? `Are you sure you want to delete the designation ${employee[deleteIndex].name}?`
            : ""
        }
      />
    </>
  );
};

export default EmployeeList;
