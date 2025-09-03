import React from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";

const AddEditStockModal = ({
  show,
  handleClose,
  onSave,
  formData,
  setFormData,
  editData,
}) => {
  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;

    if (files) {
      const file = files[0];
      const allowedTypes = [
        "application/pdf", // PDF
        "text/csv", // CSV
        "application/vnd.ms-excel", // XLS
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // XLSX
      ];

      if (file && !allowedTypes.includes(file.type)) {
        toast.error("Only PDF, CSV, and Excel files are allowed!");
        e.target.value = ""; // reset invalid file
        return;
      }

      setFormData({ ...formData, [name]: file || null });
    } else if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else if (type === "number") {
      setFormData({ ...formData, [name]: value === "" ? "" : Number(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleModalClose = () => {
    if (!editData) {
      setFormData({ ...formData, attachment: null });
    }
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleModalClose} size="lg" backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>{editData ? "Edit Stock" : "Add Stock"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Item Name</Form.Label>
                <Form.Control
                  type="text"
                  name="item_name"
                  value={formData.item_name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mt-2">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Purchase Date</Form.Label>
                <Form.Control
                  type="date"
                  name="purchase_date"
                  value={formData.purchase_date}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Stock Quantity</Form.Label>
                <Form.Control
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mt-2">
            <Col md={12}>
              <Form.Group>
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mt-2">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Attachment (PDF, CSV, Excel)</Form.Label>
                <Form.Control
                  type="file"
                  name="attachment"
                  accept=".pdf, .csv, .xls, .xlsx"
                  onChange={handleChange}
                />

                {/* If user selects new file */}
                {formData.attachment && formData.attachment.name && (
                  <small className="text-success">
                    Selected File: {formData.attachment.name}
                  </small>
                )}

                {/* If editing and old file exists */}
                {editData &&
                  editData.attachment &&
                  !formData.attachment?.name && (
                    <div className="mt-2">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() =>
                          window.open(editData.attachment, "_blank")
                        }
                      >
                        View Attachment
                      </Button>
                    </div>
                  )}
              </Form.Group>
            </Col>
            <Col md={6} className="d-flex align-items-center">
              <Form.Check
                type="checkbox"
                label="Active"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
              />
            </Col>
          </Row>

          <div className="text-end mt-3">
            <Button variant="secondary" onClick={handleModalClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="ms-2">
              Save Stock
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddEditStockModal;
