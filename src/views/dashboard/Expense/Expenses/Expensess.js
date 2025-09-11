import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Spinner,
  Table,
  Pagination,
  Modal,
} from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CreateTwoToneIcon from "@mui/icons-material/CreateTwoTone";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import VisibilityIcon from "@mui/icons-material/Visibility"; // eye icon
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye"; // second eye icon
import AddEditModal from "./add-edit-modal";
import DeleteModal from "./delete-modal";
import api from "../../../../api/axios";

const Expensess = () => {
  const [expenseList, setExpenseList] = useState([]);

  // dropdown data
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);

  const [selectedExpense, setSelectedExpense] = useState(null);
  const [showAddEdit, setShowAddEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false); // for viewing all details

  const [loading, setLoading] = useState(true);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // 🔄 Fetch All Data
  const fetchExpenses = async () => {
    try {
      const res = await api.get("/api/v1/admin/expenses");
      setExpenseList(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch expenses");
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdownData = async () => {
    try {
      const [empRes, projRes, catRes] = await Promise.all([
        api.get("/api/v1/admin/employee/active"),
        api.get("/api/v1/admin/project/active"),
        api.get("/api/v1/admin/expenseCategory/active"),
      ]);
      setEmployees(empRes.data.data || []);
      setProjects(projRes.data.data || []);
      setCategories(catRes.data || []);
    } catch (err) {
      console.error("Error fetching dropdown data:", err);
      toast.error("Failed to load dropdown data");
    }
  };

  useEffect(() => {
    fetchExpenses();
    fetchDropdownData();
  }, []);

  // ✅ Save (Add or Update)
  const handleSave = async (formData) => {
    try {
      if (selectedExpense) {
        await api.put(`/api/v1/admin/expenses/${selectedExpense.id}`, formData);
        toast.success("Expense updated successfully");
      } else {
        await api.post("/api/v1/admin/expenses", formData);
        toast.success("Expense added successfully");
      }
      fetchExpenses();
      setShowAddEdit(false);
      setSelectedExpense(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save expense");
    }
  };

  // ✅ Delete
  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/api/v1/admin/expenses/${deleteId}`);
      toast.success("Expense deleted successfully");
      fetchExpenses();
      setShowDelete(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete expense");
    }
  };

  // Pagination
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentData = expenseList.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(expenseList.length / rowsPerPage);

  if (loading) {
    return (
      <div className="loader-div">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <>
      <Row className="mt-4">
        <Col sm="12">
          <Card>
            <Card.Header className="d-flex justify-content-between">
              <h5 className="card-title">Expenses</h5>
              <Button
                className="btn-primary"
                onClick={() => setShowAddEdit(true)}
              >
                + Add Expense
              </Button>
            </Card.Header>

            <Card.Body className="px-0">
              <div className="table-responsive">
                <Table hover responsive>
                  <thead>
                    <tr>
                      <th>Sr No</th>
                      <th>Item Name</th>
                      <th>Employee</th>
                      <th>Project</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Purchase Date</th>
                      <th className="text-center">Attachment</th>

                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="text-center">
                          No expenses available
                        </td>
                      </tr>
                    ) : (
                      currentData.map((item, idx) => (
                        <tr key={item.id}>
                          <td>{indexOfFirst + idx + 1}</td>
                          <td>{item.item_name}</td>
                          <td>{item.employee?.name}</td>
                          <td>{item.project?.project_name}</td>
                          <td>{item.category?.category}</td>
                          <td>{item.price}</td>
                          <td>{item.purchase_date}</td>
                          <td className="text-center">
                            {" "}
                            {/* 👁️ View attachment */}
                            {item.attachment && (
                              <VisibilityIcon
                                className="me-2 text-center"
                                color="info"
                                style={{ cursor: "pointer" }}
                                onClick={() =>
                                  window.open(item.attachment, "_blank")
                                }
                              />
                            )}
                          </td>
                          <td>
                            <CreateTwoToneIcon
                              className="me-2"
                              color="primary"
                              style={{ cursor: "pointer" }}
                              onClick={() => {
                                setSelectedExpense(item);
                                setShowAddEdit(true);
                              }}
                            />
                            <DeleteRoundedIcon
                              className="me-2"
                              color="error"
                              style={{ cursor: "pointer" }}
                              onClick={() => {
                                setDeleteId(item.id);
                                setShowDelete(true);
                              }}
                            />

                            {/* 👁️ View all details */}
                            <VisibilityIcon
                              color="info"
                              style={{ cursor: "pointer" }}
                              onClick={() => {
                                setSelectedExpense(item);
                                setShowViewModal(true);
                              }}
                            />
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </div>

              {totalPages > 1 && (
                <Pagination className="justify-content-center">
                  {[...Array(totalPages)].map((_, i) => (
                    <Pagination.Item
                      key={i + 1}
                      active={i + 1 === currentPage}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </Pagination.Item>
                  ))}
                </Pagination>
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
          setSelectedExpense(null);
        }}
        onSave={handleSave}
        data={selectedExpense}
        employees={employees}
        projects={projects}
        categories={categories}
      />

      {/* View Details Modal */}
      <Modal
        centered
        show={showViewModal}
        onHide={() => setShowViewModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Expense Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedExpense && (
            <div>
              <p>
                <strong>Item Name:</strong> {selectedExpense.item_name}
              </p>
              <p>
                <strong>Employee:</strong> {selectedExpense.employee?.name}
              </p>
              <p>
                <strong>Project:</strong>{" "}
                {selectedExpense.project?.project_name}
              </p>
              <p>
                <strong>Category:</strong> {selectedExpense.category?.category}
              </p>
              <p>
                <strong>Price:</strong> {selectedExpense.price}
              </p>
              <p>
                <strong>Purchase Date:</strong> {selectedExpense.purchase_date}
              </p>
              <p>
                <strong>Description:</strong> {selectedExpense.description}
              </p>
              {selectedExpense.attachment && (
                <p>
                  <strong>Attachment:</strong>{" "}
                  <a
                    href={selectedExpense.attachment}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View File
                  </a>
                </p>
              )}
            </div>
          )}
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        show={showDelete}
        handleClose={() => setShowDelete(false)}
        onConfirm={handleDeleteConfirm}
        modalTitle="Delete Expense"
        modalMessage="Are you sure you want to delete this expense?"
      />

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default Expensess;
