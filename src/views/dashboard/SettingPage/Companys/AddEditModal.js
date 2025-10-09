import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Image } from "react-bootstrap";
import api from "../../../../api/axios";
import { toast } from "react-toastify";

const AddEditCompanyModal = ({ show, handleClose, company, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    GSTno: "",
    state: "",
    city: "",
    pincode: "",
    mobile1: "",
    mobile2: "",
    isActive: true,
  });
  const [logoFile, setLogoFile] = useState(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name || "",
        email: company.email || "",
        address: company.address || "",
        GSTno: company.GSTno || "",
        state: company.state || "",
        city: company.city || "",
        pincode: company.pincode || "",
        mobile1: company.mobile1 || "",
        mobile2: company.mobile2 || "",
        isActive: company.isActive ?? true,
      });
      setPreview(company.logo || "");
    } else {
      setFormData({
        name: "",
        email: "",
        address: "",
        GSTno: "",
        state: "",
        city: "",
        pincode: "",
        mobile1: "",
        mobile2: "",
        isActive: true,
      });
      setPreview("");
      setLogoFile(null);
    }
  }, [company]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && ["image/jpeg", "image/png"].includes(file.type)) {
      setLogoFile(file);
      setPreview(URL.createObjectURL(file));
    } else {
      toast.warning("Only JPG and PNG formats are allowed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => data.append(key, formData[key]));
      if (logoFile) data.append("logo", logoFile);

      if (company) {
        await api.put(`/api/v1/admin/companyMaster/${company.id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Company updated successfully");
      } else {
        await api.post("/api/v1/admin/companyMaster", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Company added successfully");
      }

      onSave();
      handleClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    }
  };

  return (
    <Modal
      centered
      show={show}
      onHide={handleClose}
      backdrop="static"
      size="lg"
    >
      <Form onSubmit={handleSubmit} encType="multipart/form-data">
        <Modal.Header closeButton>
          <Modal.Title>
            {company ? "Edit Company" : "Add New Company"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            {[
              { label: "Name", name: "name" },
              { label: "Email", name: "email" },
              { label: "Address", name: "address" },
              { label: "GST No", name: "GSTno" },
              { label: "State", name: "state" },
              { label: "City", name: "city" },
              { label: "Pincode", name: "pincode" },
              { label: "Mobile 1", name: "mobile1" },
              { label: "Mobile 2", name: "mobile2" },
            ].map((field) => (
              <Form.Group className="mb-3 col-md-6" key={field.name}>
                <Form.Label>{field.label}</Form.Label>
                <Form.Control
                  type={field.name === "email" ? "email" : "text"}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            ))}

            {/* Logo Upload */}
            <Form.Group className="mb-3 col-md-6">
              <Form.Label>Company Logo (JPG/PNG)</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              {preview && (
                <div className="mt-2">
                  <Image
                    src={preview}
                    alt="Preview"
                    rounded
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                    }}
                  />
                </div>
              )}
            </Form.Group>

            {/* Active Switch */}
            <Form.Group className="mb-3 col-md-6">
              <Form.Check
                type="switch"
                label="Active"
                name="isActive"
                checked={formData.isActive}
                onChange={() =>
                  setFormData((prev) => ({ ...prev, isActive: !prev.isActive }))
                }
              />
            </Form.Group>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            {company ? "Update" : "Save"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddEditCompanyModal;
