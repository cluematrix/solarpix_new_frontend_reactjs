import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";

const AddEditModal = ({
  show,
  handleClose,
  onSave,
  data,
  employees,
  projects,
  categories,
}) => {
  const [form, setForm] = useState({
    item_name: "",
    price: "",
    employee_id: "",
    project_id: "",
    expense_category_id: "",
    purchase_date: "",
    description: "",
    attachment: null, // ✅ new field
  });

  useEffect(() => {
    if (data) {
      setForm({
        item_name: data.item_name || "",
        price: data.price || "",
        employee_id: data.employee_id || "",
        project_id: data.project_id || "",
        expense_category_id: data.expense_category_id || "",
        purchase_date: data.purchase_date || "",
        description: data.description || "",
        attachment: null, // always start null, existing attachment shown in UI optionally
      });
    } else {
      setForm({
        item_name: "",
        price: "",
        employee_id: "",
        project_id: "",
        expense_category_id: "",
        purchase_date: "",
        description: "",
        attachment: null,
      });
    }
  }, [data]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ["application/pdf", "text/csv"];
      if (!allowedTypes.includes(file.type)) {
        alert("Only PDF or CSV files are allowed!");
        e.target.value = null;
        return;
      }
      setForm({ ...form, attachment: file });
    }
  };

  const handleSubmit = () => {
    // Prepare FormData for file upload
    const formData = new FormData();
    formData.append("item_name", form.item_name);
    formData.append("price", form.price);
    formData.append("employee_id", form.employee_id);
    formData.append("project_id", form.project_id);
    if (form.expense_category_id) {
      formData.append("expense_category_id", form.expense_category_id);
    }
    formData.append("purchase_date", form.purchase_date);
    formData.append("description", form.description);
    if (form.attachment) {
      formData.append("attachment", form.attachment);
    }

    onSave(formData); // pass FormData instead of plain object
  };

  return (
    <Modal
      centered
      show={show}
      onHide={handleClose}
      backdrop="static"
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>{data ? "Edit Expense" : "Add Expense"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Item Name</Form.Label>
                <Form.Control
                  type="text"
                  name="item_name"
                  value={form.item_name}
                  onChange={handleChange}
                  placeholder="Enter item name"
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="Enter price"
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Employee</Form.Label>
                <Form.Select
                  name="employee_id"
                  value={form.employee_id}
                  onChange={handleChange}
                >
                  <option value="">Select Employee</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Project</Form.Label>
                <Form.Select
                  name="project_id"
                  value={form.project_id}
                  onChange={handleChange}
                >
                  <option value="">Select Project</option>
                  {projects.map((proj) => (
                    <option key={proj.id} value={proj.id}>
                      {proj.project_name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Expense Category</Form.Label>
                <Form.Select
                  name="expense_category_id"
                  value={form.expense_category_id}
                  onChange={handleChange}
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.category}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Purchase Date</Form.Label>
                <Form.Control
                  type="date"
                  name="purchase_date"
                  value={form.purchase_date}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Attachment (PDF or CSV)</Form.Label>
                <Form.Control
                  type="file"
                  name="attachment"
                  onChange={handleFileChange}
                  accept=".pdf"
                />
                {data?.attachment && (
                  <a
                    href={data.attachment}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="d-block mt-1"
                  >
                    View Existing Attachment
                  </a>
                )}
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleSubmit}>
          {data ? "Update" : "Save"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddEditModal;
