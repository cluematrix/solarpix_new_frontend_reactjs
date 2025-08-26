import React, { useState, useEffect } from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import CreateTwoToneIcon from "@mui/icons-material/CreateTwoTone";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import AddEditStockModal from "./add-edit-modal";
import DeleteModal from "./delete-modal";
import api from "../../../../api/axios";

const StockList = () => {
  const [stockList, setStockList] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    item_name: "",
    price: "",
    purchase_date: "",
    stock: "",
    description: "",
    attachment: null,
    isActive: true,
  });
  const [editIndex, setEditIndex] = useState(null);
  const [showAddEdit, setShowAddEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    fetchStockList();
  }, []);

  const fetchStockList = async () => {
    try {
      const res = await api.get("/api/v1/admin/stock");
      console.log("API response:", res.data);

      // Handle different structures
      let stocks = [];
      if (Array.isArray(res.data.data)) {
        stocks = res.data.data;
      } else if (res.data.data) {
        stocks = [res.data.data];
      } else if (Array.isArray(res.data)) {
        stocks = res.data;
      } else if (res.data) {
        stocks = [res.data];
      }

      setStockList(stocks);
    } catch (error) {
      console.error("Error fetching stock:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      id: "",
      item_name: "",
      price: "",
      purchase_date: "",
      stock: "",
      description: "",
      attachment: null,
      isActive: true,
    });
    setEditIndex(null);
  };

  const handleSave = async (data) => {
    try {
      const formDataToSend = new FormData();
      for (const key in data) {
        formDataToSend.append(key, data[key]);
      }

      if (editIndex !== null) {
        await api.put(`/api/v1/admin/stock/${data.id}`, formDataToSend);
      } else {
        await api.post("/admin/stock", formDataToSend);
      }

      fetchStockList();
      setShowAddEdit(false);
      resetForm();
    } catch (error) {
      console.error("Error saving stock:", error);
    }
  };

  const handleEdit = (index) => {
    setFormData(stockList[index]);
    setEditIndex(index);
    setShowAddEdit(true);
  };

  const handleDeleteConfirm = async () => {
    if (deleteIndex !== null) {
      try {
        const id = stockList[deleteIndex].id;
        await api.delete(`/admin/stock/${id}`);
        fetchStockList();
      } catch (error) {
        console.error("Error deleting stock:", error);
      }
    }
    setShowDelete(false);
    setDeleteIndex(null);
  };

  // Pagination logic
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentData = stockList.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(stockList.length / rowsPerPage);

  return (
    <>
      <Row>
        <Col sm="12">
          <Card>
            <Card.Header className="d-flex justify-content-between">
              <h4 className="card-title">Stock List</h4>
              <Button
                className="btn-primary"
                onClick={() => {
                  resetForm();
                  setShowAddEdit(true);
                }}
              >
                + Add Stock
              </Button>
            </Card.Header>

            <Card.Body className="px-0">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Sr. No.</th>
                      <th>Item Name</th>
                      <th>Price</th>
                      <th>Purchase Date</th>
                      <th>Stock</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center">
                          No stock available
                        </td>
                      </tr>
                    ) : (
                      currentData.map((item, idx) => (
                        <tr key={item.id}>
                          <td>{indexOfFirst + idx + 1}</td>
                          <td>{item.item_name}</td>
                          <td>{item.price}</td>
                          <td>{item.purchase_date}</td>
                          <td>{item.stock}</td>
                          <td>
                            {item.isActive ? (
                              <span className="badge bg-success">Active</span>
                            ) : (
                              <span className="badge bg-danger">Inactive</span>
                            )}
                          </td>
                          <td>
                            <CreateTwoToneIcon
                              className="me-2"
                              onClick={() => handleEdit(indexOfFirst + idx)}
                              color="primary"
                              style={{ cursor: "pointer" }}
                            />
                            <DeleteRoundedIcon
                              onClick={() => {
                                setDeleteIndex(indexOfFirst + idx);
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
      <AddEditStockModal
        show={showAddEdit}
        handleClose={() => {
          setShowAddEdit(false);
          resetForm();
        }}
        formData={formData}
        setFormData={setFormData}
        onSave={handleSave}
        editData={editIndex !== null}
      />

      {/* Delete Modal */}
      <DeleteModal
        show={showDelete}
        handleClose={() => {
          setShowDelete(false);
          setDeleteIndex(null);
        }}
        onConfirm={handleDeleteConfirm}
        modalTitle="Delete Stock"
        modalMessage={
          deleteIndex !== null
            ? `Are you sure you want to delete "${stockList[deleteIndex].item_name}"?`
            : ""
        }
      />
    </>
  );
};

export default StockList;
