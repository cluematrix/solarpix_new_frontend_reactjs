// Created by sufyan, modified by Rishi on 7 Oct 2025

import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Form,
  Spinner,
  Table,
  Pagination,
} from "react-bootstrap";
import CreateTwoToneIcon from "@mui/icons-material/CreateTwoTone";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import AddEditModal from "./AddEditModal";
import DeleteModal from "./DeleteModal";
import api from "../../../../api/axios";
import { successToast } from "../../../../components/Toast/successToast";
import { errorToast } from "../../../../components/Toast/errorToast";

const StockNameList = () => {
  const [stockList, setStockList] = useState([]);
  const [inventoryCategories, setInventoryCategories] = useState([]);
  const [inventoryTypes, setInventoryTypes] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [stockName, setStockName] = useState("");

  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState(null);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [showAddEdit, setShowAddEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentData = stockList.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(stockList.length / rowsPerPage);

  const [loading, setLoading] = useState(true);

  // Fetch inventory category
  const fetchInventoryCategories = async () => {
    try {
      const res = await api.get("/api/v1/admin/inventoryCategory/active");
      setInventoryCategories(res.data.data || res.data || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setInventoryCategories([]);
    }
  };

  // Fetch inventory types
  const fetchInventoryTypes = async () => {
    try {
      const res = await api.get(
        "/api/v1/admin/inventoryType/active/pagination?page=1&limit=10"
      );
      console.log("Inventory type response:", res.data); // 👈 Add this line
      setInventoryTypes(res.data.data || res.data || []);
    } catch (err) {
      console.error("Error fetching types:", err);
      setInventoryTypes([]);
    }
  };

  // Fetch stock name list
  const fetchStockNames = async () => {
    try {
      const res = await api.get("/api/v1/admin/stockName");
      setStockList(res.data.data || res.data || []);
    } catch (err) {
      console.error("Error fetching stock names:", err);
      setStockList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventoryCategories();
    fetchInventoryTypes();
    fetchStockNames();
  }, []);

  // Add / Update
  const handleAddOrUpdateStock = async () => {
    if (!stockName.trim()) {
      setErrors("Stock name is required");
      return;
    }
    if (!selectedCategory) {
      setErrors("Please select inventory category");
      return;
    }
    if (!selectedType) {
      setErrors("Please select inventory type");
      return;
    }

    const payload = {
      name: stockName,
      inv_cat_id: selectedCategory,
      inv_type_id: selectedType,
    };

    setLoadingBtn(true);
    try {
      if (editId) {
        await api.put(`/api/v1/admin/stockName/${editId}`, payload);
        successToast("Stock name updated successfully");
      } else {
        await api.post("/api/v1/admin/stockName", payload);
        successToast("Stock name added successfully");
      }
      fetchStockNames();
      resetForm();
    } catch (err) {
      console.error("Error saving stock:", err);
      errorToast(err.response?.data?.message || "Failed to save stock name");
    } finally {
      setLoadingBtn(false);
    }
  };

  // Delete
  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setLoadingBtn(true);
    try {
      await api.delete(`/api/v1/admin/stockName/${deleteId}`);
      successToast("Stock name deleted successfully");
      fetchStockNames();
      setShowDelete(false);
    } catch (err) {
      console.error("Delete failed:", err);
      errorToast(err.response?.data?.message || "Failed to delete stock name");
    } finally {
      setLoadingBtn(false);
    }
  };

  // Edit
  const handleEdit = (stock) => {
    setStockName(stock.name || ""); // Use correct field
    setSelectedCategory(stock.inv_cat_id || stock.InventoryCat?.id || "");
    setSelectedType(stock.inv_type_id || stock.InventoryType?.id || "");
    setEditId(stock.id);
    setShowAddEdit(true);
  };

  const resetForm = () => {
    setShowAddEdit(false);
    setEditId(null);
    setStockName("");
    setSelectedCategory("");
    setSelectedType("");
    setErrors(null);
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
              <h5 className="card-title fw-lighter">Stock Name List</h5>
              <Button
                className="btn-primary"
                onClick={() => setShowAddEdit(true)}
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
                      <th>Stock Name</th>
                      <th>Category</th>
                      <th>Type</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stockList.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center">
                          No Stock Names Available
                        </td>
                      </tr>
                    ) : (
                      currentData.map((item, idx) => (
                        <tr key={item.id}>
                          <td>{indexOfFirst + idx + 1}</td>
                          <td>{item.name}</td>
                          <td>{item.InventoryCat?.category || "-"}</td>
                          <td>{item.InventoryType?.type || "-"}</td>
                          <td>
                            <CreateTwoToneIcon
                              onClick={() => handleEdit(item)}
                              color="primary"
                              style={{ cursor: "pointer" }}
                            />
                            <DeleteRoundedIcon
                              onClick={() => {
                                setDeleteId(item.id);
                                setShowDelete(true);
                              }}
                              color="error"
                              style={{ cursor: "pointer", marginLeft: 8 }}
                            />
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination className="justify-content-center mt-3">
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
        handleClose={resetForm}
        stockName={stockName}
        setStockName={setStockName}
        inventoryCategories={inventoryCategories}
        inventoryTypes={inventoryTypes}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        errors={errors}
        onSave={handleAddOrUpdateStock}
        modalTitle={editId ? "Edit Stock Name" : "Add Stock Name"}
        buttonLabel={editId ? "Update" : "Save"}
        loading={loadingBtn}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        show={showDelete}
        handleClose={() => setShowDelete(false)}
        onConfirm={handleDeleteConfirm}
        modalTitle="Delete Stock Name"
        modalMessage="Are you sure you want to delete this stock name?"
        loading={loadingBtn}
      />
    </>
  );
};

export default StockNameList;
