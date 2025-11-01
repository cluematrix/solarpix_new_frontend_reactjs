import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Form,
  Spinner,
  Table,
  Image,
} from "react-bootstrap";
import { Slide, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CreateTwoToneIcon from "@mui/icons-material/CreateTwoTone";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import AddEditCompanyModal from "./AddEditModal";
import DeleteModal from "./DeleteModal";
import api from "../../../../api/axios";

const SubCompany = () => {
  const [companyList, setCompanyList] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showAddEdit, setShowAddEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentData = companyList.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(companyList.length / rowsPerPage);

  // Fetch all companies
  const fetchCompanies = () => {
    setLoading(true);
    api
      .get("/api/v1/admin/companyMaster/getCompaniesByAdmin",{
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        if (Array.isArray(res.data.data)) {
          setCompanyList(res.data.data);
        } else {
          setCompanyList([]);
        }
      })
      .catch(() => toast.error("Failed to fetch companies"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  // Toggle Active/Inactive
  const handleToggleActive = (id, currentStatus) => {
    const newStatus = !currentStatus;
    setCompanyList((prev) =>
      prev.map((company) =>
        company.id === id ? { ...company, isActive: newStatus } : company
      )
    );
    api
      .put(`/api/v1/admin/companyMaster/${id}`, { isActive: newStatus })
      .then(() => toast.success("Status updated successfully"))
      .catch(() => {
        toast.error("Failed to update status");
        setCompanyList((prev) =>
          prev.map((company) =>
            company.id === id
              ? { ...company, isActive: currentStatus }
              : company
          )
        );
      });
  };

  // Delete Company
  const handleDeleteConfirm = () => {
    if (!deleteId) return;
    api
      .delete(`/api/v1/admin/companyMaster/${deleteId}`)
      .then(() => {
        toast.success("Company deleted successfully");
        fetchCompanies();
        setShowDelete(false);
      })
      .catch(() => toast.error("Failed to delete company"));
  };

  if (loading) {
    return (
      <div className="loader-div">
        <Spinner animation="border" className="spinner" />
      </div>
    );
  }

  return (
    <>
      <Row className="mt-4">
        <Col sm="12">
          <Card>
            <Card.Header className="d-flex justify-content-between">
              <h5 className="card-title fw-lighter">Company Master</h5>
              <Button
                className="btn-primary"
                onClick={() => {
                  setSelectedCompany(null);
                  setShowAddEdit(true);
                }}
              >
                + New
              </Button>
            </Card.Header>

            <Card.Body className="px-0 pt-3">
              <div className="table-responsive">
                <Table hover responsive className="table">
                  <thead>
                    <tr className="table-gray">
                      <th>Sr. No.</th>
                      <th>Logo</th>
                      <th>Name</th>
                      {/* <th>Email</th>
                      <th>Address</th>
                      <th>GST No</th>
                      <th>State</th> */}
                      {/* <th>City</th> */}
                      {/* <th>Pincode</th> */}
                      <th>Mobile 1</th>
                      {/* <th>Mobile 2</th> */}
                      {/* <th>Status</th> */}
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {companyList.length === 0 ? (
                      <tr>
                        <td colSpan="13" className="text-center">
                          No companies available
                        </td>
                      </tr>
                    ) : (
                      currentData.map((company, idx) => (
                        <tr key={company.id}>
                          <td>{indexOfFirst + idx + 1}</td>
                          <td>
                            {company.logo ? (
                              <Image
                                src={company.logo}
                                alt="Logo"
                                rounded
                                style={{
                                  width: "50px",
                                  height: "50px",
                                  objectFit: "cover",
                                }}
                              />
                            ) : (
                              <span>No Logo</span>
                            )}
                          </td>
                          <td>{company.name}</td>
                          {/* <td>{company.email}</td> */}
                          {/* <td>{company.address}</td> */}
                          {/* <td>{company.GSTno}</td> */}
                          {/* <td>{company.state}</td> */}
                          {/* <td>{company.city}</td> */}
                          {/* <td>{company.pincode}</td> */}
                          <td>{company.mobile1}</td>
                          {/* <td>{company.mobile2}</td> */}
                          {/* <td>{company.isActive ? "Active" : "Inactive"}</td> */}
                          <td className="d-flex align-items-center">
                            {/* <Form.Check
                              type="switch"
                              id={`active-switch-${company.id}`}
                              checked={company.isActive}
                              onChange={() =>
                                handleToggleActive(company.id, company.isActive)
                              }
                              className="me-3"
                            /> */}
                            <CreateTwoToneIcon
                              className="me-2"
                              onClick={() => {
                                setSelectedCompany(company);
                                setShowAddEdit(true);
                              }}
                              color="primary"
                              style={{ cursor: "pointer" }}
                            />
                            {/* <DeleteRoundedIcon
                              onClick={() => {
                                setDeleteId(company.id);
                                setShowDelete(true);
                              }}
                              color="error"
                              style={{ cursor: "pointer" }}
                            /> */}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-end mt-3 me-3">
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
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
                    onClick={() => setCurrentPage((p) => p + 1)}
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
      <AddEditCompanyModal
        show={showAddEdit}
        handleClose={() => setShowAddEdit(false)}
        company={selectedCompany}
        onSave={fetchCompanies}
      />

      {/* Delete Modal */}
      <DeleteModal
        show={showDelete}
        handleClose={() => setShowDelete(false)}
        onConfirm={handleDeleteConfirm}
        modalTitle="Delete Company"
        modalMessage="Are you sure you want to delete this company?"
      />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        transition={Slide}
      />
    </>
  );
};

export default SubCompany;
