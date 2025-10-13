// AddEditModal.js
import React, { useState } from "react";
import { Modal, Form, Button, Spinner } from "react-bootstrap";
import api from "../../../../api/axios"; // ✅ Import your axios instance
import { successToast } from "../../../../components/Toast/successToast";
import { errorToast } from "../../../../components/Toast/errorToast";

const AddEditModal = ({
  show,
  handleClose,
  stockName,
  setStockName,
  inventoryCategories,
  setInventoryCategories,
  inventoryTypes,
  setInventoryTypes,
  selectedCategory,
  setSelectedCategory,
  selectedType,
  setSelectedType,
  errors,
  onSave,
  modalTitle,
  buttonLabel,
  loading,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [addMode, setAddMode] = useState(""); // "category" or "type"
  const [newValue, setNewValue] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave();
  };

  // Open "Add new" modal
  const handleAddNew = (mode) => {
    setAddMode(mode);
    setNewValue("");
    setShowAddModal(true);
  };

  // Save new category or type TO DATABASE
  const handleSaveNew = async () => {
    if (!newValue.trim()) {
      errorToast("Name cannot be empty");
      return;
    }

    setSaving(true);
    try {
      if (addMode === "category") {
        // ✅ API CALL for Category
        const res = await api.post("/api/v1/admin/inventoryCategory", {
          category: newValue,
        });

        const newCat = res.data.data || res.data;
        successToast("Category added successfully");
        setInventoryCategories((prev) => [...prev, newCat]);
        setSelectedCategory(newCat.id);
      } else if (addMode === "type") {
        // ✅ API CALL for Type
        const res = await api.post("/api/v1/admin/inventoryType", {
          type: newValue,
        });

        const newType = res.data.data || res.data;
        successToast("Type added successfully");
        setInventoryTypes((prev) => [...prev, newType]);
        setSelectedType(newType.id);
      }

      setShowAddModal(false);
    } catch (err) {
      console.error("Error saving new item:", err);
      errorToast(err.response?.data?.message || "Failed to save data");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {/* Main Add/Edit Modal */}
      <Modal centered show={show} onHide={handleClose} backdrop="static">
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>{modalTitle}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {/* Inventory Category */}
            <Form.Group className="mb-3">
              <Form.Label>Inventory Category</Form.Label>
              <Form.Select
                value={selectedCategory}
                onChange={(e) => {
                  if (e.target.value === "add_new") {
                    handleAddNew("category");
                  } else {
                    setSelectedCategory(e.target.value);
                  }
                }}
              >
                <option value="">Select Category</option>
                {inventoryCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.category}
                  </option>
                ))}
                <option value="add_new">➕ Add New Category</option>
              </Form.Select>
            </Form.Group>

            {/* Inventory Type */}
            <Form.Group className="mb-3">
              <Form.Label>Inventory Type</Form.Label>
              <Form.Select
                value={selectedType}
                onChange={(e) => {
                  if (e.target.value === "add_new") {
                    handleAddNew("type");
                  } else {
                    setSelectedType(e.target.value);
                  }
                }}
              >
                <option value="">Select Type</option>
                {inventoryTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.type}
                  </option>
                ))}
                <option value="add_new">➕ Add New Type</option>
              </Form.Select>
            </Form.Group>

            {/* Item Name */}
            <Form.Group>
              <Form.Label>Item Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Item Name"
                value={stockName}
                onChange={(e) => setStockName(e.target.value)}
              />
              {errors && (
                <p className="errors-text text-danger mt-1">{errors}</p>
              )}
            </Form.Group>
          </Modal.Body>

          <Modal.Footer>
            <Button disabled={loading} variant="primary" type="submit">
              {loading ? "Saving..." : buttonLabel}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Add New Category/Type Modal */}
      <Modal
        centered
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {addMode === "category" ? "Add New Category" : "Add New Type"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form.Group>
            <Form.Label>
              Enter {addMode === "category" ? "Category" : "Type"} Name
            </Form.Label>
            <Form.Control
              type="text"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              placeholder={`Enter new ${addMode}`}
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveNew} disabled={saving}>
            {saving ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />{" "}
                Saving...
              </>
            ) : (
              "Save"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddEditModal;
