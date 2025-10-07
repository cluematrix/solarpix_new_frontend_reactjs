import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

const AddEditModal = ({
  show,
  handleClose,
  stockName,
  setStockName,
  inventoryCategories,
  inventoryTypes,
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
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave();
  };

  return (
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
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Select Category</option>
              {inventoryCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.category}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          {/* Inventory Type */}
          <Form.Group className="mb-3">
            <Form.Label>Inventory Type</Form.Label>
            <Form.Select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="">Select Type</option>
              {inventoryTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.type}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          {/* Stock Name */}
          <Form.Group>
            <Form.Label>Stock Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter stock name"
              value={stockName}
              onChange={(e) => setStockName(e.target.value)}
            />
            {errors && <p className="errors-text">{errors}</p>}
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button disabled={loading} variant="primary" type="submit">
            {loading ? "Saving..." : buttonLabel}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddEditModal;
