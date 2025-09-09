import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Row, Col, Spinner } from "react-bootstrap";
import api from "../../../../api/axios";
import { toast } from "react-toastify";
import { successToast } from "../../../../components/Toast/successToast";

const AddEditModal = ({
  show,
  handleClose,
  editData,
  onSave,
  refetchNotice,
}) => {
  const [formData, setFormData] = useState({
    heading: "",
    to: "",
    description: "",
  });

  console.log("formdata", formData);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editData) {
      setFormData({
        heading: editData.heading || "",
        to: editData.to || "",
        description: editData.description || "",
      });
    } else {
      setFormData({ heading: "", to: "", description: "" });
      setFile(null);
    }
  }, [editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // const reqData = new FormData();
      // reqData.append("heading", formData.heading);
      // reqData.append("to", formData.to);
      // reqData.append("description", formData.description);
      // if (file) reqData.append("attachment", file);

      if (editData) {
        const res = await api.put(
          `/api/v1/admin/noticeBoard/${editData.id}`,
          formData
        );
        refetchNotice(res.data.data);
      } else {
        const res = await api.post("/api/v1/admin/noticeBoard", formData);
        refetchNotice(res.data.data);
        successToast("Notice added successfully");
      }

      // onSave();
      handleClose();
    } catch (err) {
      console.error("Failed to save notice:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" centered>
      <Modal.Header closeButton>
        <Modal.Title>{editData ? "Edit Notice" : "Add Notice"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={12} className="mb-3">
              <Form.Label>Heading</Form.Label>
              <Form.Control
                type="text"
                name="heading"
                value={formData.heading}
                onChange={handleChange}
                required
              />
            </Col>
            <Col md={12} className="mb-3">
              <Form.Label>To</Form.Label>
              <Form.Control
                type="text"
                name="to"
                value={formData.to}
                onChange={handleChange}
                required
              />
            </Col>
            <Col md={12} className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </Col>
            <Col md={12} className="mb-3">
              <Form.Label>Attachment (PDF only)</Form.Label>
              <Form.Control
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
              />
              {editData?.attachment && (
                <div className="mt-2">
                  <a
                    href={editData.attachment}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Current File
                  </a>
                </div>
              )}
            </Col>
          </Row>
          <div className="d-flex justify-content-end">
            <Button variant="secondary" onClick={handleClose} className="me-2">
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? <Spinner size="sm" animation="border" /> : "Save"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddEditModal;
