import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Row, Col, Button } from "react-bootstrap";
import CreateTwoToneIcon from "@mui/icons-material/CreateTwoTone";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import AddEditModal from "../AddEmployee/add-edit-modal";
import DeleteModal from "../AddEmployee/delete-modal";

const EmployeeList = () => {
  const navigate = useNavigate();
  const [userlist, setUserlist] = useState([
    {
      employeeId: "EMP001",
      salutation: "Mr.",
      name: "John Doe",
      gender: "Male",
      designation: "Software Engineer",
      address: "123 Main Street",
      dob: "1990-05-14",
      maritalStatus: "Single",
      probationEndDate: "2025-09-30",
      noticePeriodStart: "2025-10-01",
      noticePeriodEnd: "2025-11-01",
      employmentType: "Full Time",
      loginAllow: "Yes",
      reportingTo: "Jane Smith",
      profilePic: null,
    },
    {
      employeeId: "EMP002",
      salutation: "Ms.",
      name: "Alice Johnson",
      gender: "Female",
      designation: "HR Manager",
      address: "456 Park Avenue",
      dob: "1985-08-21",
      maritalStatus: "Married",
      probationEndDate: "2025-08-31",
      noticePeriodStart: "2025-09-01",
      noticePeriodEnd: "2025-09-30",
      employmentType: "Full Time",
      loginAllow: "Yes",
      reportingTo: "Robert White",
      profilePic: null,
    },
    {
      employeeId: "EMP003",
      salutation: "Mr.",
      name: "Michael Brown",
      gender: "Male",
      designation: "Marketing Executive",
      address: "789 Lake Road",
      dob: "1992-12-05",
      maritalStatus: "Single",
      probationEndDate: "2025-07-31",
      noticePeriodStart: "2025-08-01",
      noticePeriodEnd: "2025-08-31",
      employmentType: "Contract",
      loginAllow: "No",
      reportingTo: "Alice Johnson",
      profilePic: null,
    },
  ]);

  const [formData, setFormData] = useState({
    employeeId: "",
    salutation: "",
    name: "",
    gender: "",
    address: "",
    dob: "",
    maritalStatus: "",
    probationEndDate: "",
    noticePeriodStart: "",
    noticePeriodEnd: "",
    employmentType: "",
    loginAllow: "",
    reportingTo: "",
    profilePic: null,
  });

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const rolesPerPage = 10;

  const indexOfLastRole = currentPage * rolesPerPage;
  const indexOfFirstRole = indexOfLastRole - rolesPerPage;
  const currentRoles = userlist.slice(indexOfFirstRole, indexOfLastRole);
  const totalPages = Math.ceil(userlist.length / rolesPerPage);
  const [editIndex, setEditIndex] = useState(null);
  const [showAddEdit, setShowAddEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const handleAddOrUpdateEmployee = (data) => {
    if (!data.name.trim()) return; // basic validation

    if (editIndex !== null) {
      const updatedList = [...userlist];
      updatedList[editIndex] = data;
      setUserlist(updatedList);
    } else {
      setUserlist([...userlist, data]);
    }

    // reset
    setShowAddEdit(false);
    setFormData({
      employeeId: "",
      salutation: "",
      name: "",
      gender: "",
      address: "",
      dob: "",
      maritalStatus: "",
      probationEndDate: "",
      noticePeriodStart: "",
      noticePeriodEnd: "",
      employmentType: "",
      loginAllow: "",
      reportingTo: "",
      profilePic: null,
    });
    setEditIndex(null);
  };

  const handleEdit = (index) => {
    setFormData(userlist[index]);
    setEditIndex(index);
    setShowAddEdit(true);
  };

  const handleDeleteConfirm = () => {
    if (deleteIndex !== null) {
      setUserlist(userlist.filter((_, i) => i !== deleteIndex));
    }
    setShowDelete(false);
    setDeleteIndex(null);
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
                      <th>Gender</th>
                      <th>Designation</th>
                      {/* <th>Marital Status</th> */}
                      {/* <th>Employment Type</th> */}
                      <th>Login Status</th>
                      <th>Reporting To</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userlist.length === 0 ? (
                      <tr>
                        <td colSpan="10" className="text-center">
                          No Employee available
                        </td>
                      </tr>
                    ) : (
                      userlist.map((item, idx) => (
                        <tr key={idx}>
                          <td>{idx + 1}</td>
                          <td>{item.employeeId}</td>
                          <td>
                            {item.salutation} {item.name}
                          </td>
                          <td>{item.gender}</td>
                          <td>{item.designation}</td>
                          {/* <td>{item.maritalStatus}</td> */}
                          {/* <td>{item.employmentType}</td> */}
                          <td>{item.loginAllowed}</td>
                          <td>{item.reportingTo}</td>
                          <td>
                            <CreateTwoToneIcon
                              className="me-2"
                              onClick={() =>
                                navigate(`/update-employee/${item.employeeId}`)
                              }
                              color="primary"
                              style={{ cursor: "pointer" }}
                            />
                            <DeleteRoundedIcon
                              onClick={() => {
                                setDeleteIndex(idx);
                                setShowDelete(true);
                              }}
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

      {/* Add/Edit Modal */}
      <AddEditModal
        show={showAddEdit}
        handleClose={() => {
          setShowAddEdit(false);
          setFormData({
            employeeId: "",
            salutation: "",
            name: "",
            gender: "",
            address: "",
            dob: "",
            maritalStatus: "",
            probationEndDate: "",
            noticePeriodStart: "",
            noticePeriodEnd: "",
            employmentType: "",
            loginAllow: "",
            reportingTo: "",
            profilePic: null,
          });
          setEditIndex(null);
        }}
        formData={formData}
        setFormData={setFormData}
        onSave={handleAddOrUpdateEmployee}
        editData={editIndex !== null}
      />

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
          deleteIndex !== null
            ? `Are you sure you want to delete "${userlist[deleteIndex].name}"?`
            : ""
        }
      />
    </>
  );
};

export default EmployeeList;
