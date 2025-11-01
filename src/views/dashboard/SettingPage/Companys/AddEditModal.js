import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Image, InputGroup } from "react-bootstrap";
import api from "../../../../api/axios";
import { toast } from "react-toastify";
import { BsEye } from "react-icons/bs/";
import { BsEyeSlash } from "react-icons/bs";
const token = localStorage.getItem("solarpix_token");
const AddEditCompanyModal = ({ show, handleClose, company, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    personName: "",
    email: "",
    address: "",
    GSTno: "",
    state: "",
    city: "",
    pincode: "",
    mobile1: "",
    mobile2: "",
    password: "",
    isActive: true,
  });
  const [logoFile, setLogoFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [tempPassword, setTempPassword] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);
const [correctPin, setCorrectPin] = useState("");
  // Predefined PIN - you might want to fetch this from a secure source
  // const correctPin = "1234";

  useEffect(() => {
    const fetchPin = async () => {
      console.log("Fetching company pin...");
      try {
        const response = await api.get("/api/v1/admin/pin/getPin");
        setCorrectPin(response.data.data[0].pin);
        console.log(response.data.data[0].pin);
        
      } catch (error) {
        console.error("Error fetching company pin:", error);
      }
    };
    fetchPin();
  }, []);

  

  useEffect(() => {
    if (company) {
      // Editing existing company
      setIsEditing(true);
      setIsPasswordVerified(false); // Reset verification state when editing
      setFormData({
        name: company.name || "",
        personName: company.personName || "",
        email: company.email || "",
        address: company.address || "",
        GSTno: company.GSTno || "",
        state: company.state || "",
        city: company.city || "",
        pincode: company.pincode || "",
        mobile1: company.mobile1 || "",
        mobile2: company.mobile2 || "",
        password: company.password || "",
        isActive: company.isActive ?? true,
      });
      setPreview(company.logo || "");
      // Reset password visibility when editing
      setShowPassword(false);
    } else {
      // Adding new company - show password normally
      setIsEditing(false);
      setIsPasswordVerified(true); // No verification needed for new company
      setFormData({
        name: "",
        personName: "",
        email: "",
        address: "",
        GSTno: "",
        state: "",
        city: "",
        pincode: "",
        mobile1: "",
        mobile2: "",
        password: "",
        isActive: true,
      });
      setPreview("");
      setLogoFile(null);
      // Show password by default when adding new company
      setShowPassword(true);
    }
  }, [company, show]); // Added show to dependencies to reset when modal opens/closes

  // Reset form when modal closes
  useEffect(() => {
    if (!show) {
      // Reset all states when modal closes
      setFormData({
        name: "",
        personName: "",
        email: "",
        address: "",
        GSTno: "",
        state: "",
        city: "",
        pincode: "",
        mobile1: "",
        mobile2: "",
        password: "",
        isActive: true,
      });
      setPreview("");
      setLogoFile(null);
      setShowPinModal(false);
      setPin("");
      setShowPassword(false);
      setTempPassword("");
      setIsEditing(false);
      setIsPasswordVerified(false); // Reset verification state on close
    }
  }, [show]);

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

  const handlePasswordVisibilityToggle = () => {
    if (showPassword) {
      // If already showing, hide it
      setShowPassword(false);
    } else {
      // If hidden and editing, show PIN modal if not verified
      if (isEditing) {
        if (!isPasswordVerified) {
          setTempPassword(formData.password); // Store current password temporarily
          setShowPinModal(true);
        } else {
          // If already verified, just show the password
          setShowPassword(true);
        }
      } else {
        // If adding new company, show password directly
        setShowPassword(true);
      }
    }
  };

  const handlePinSubmit = () => {
console.log(typeof pin);
console.log(typeof correctPin);

    if (pin == correctPin) {
      
      setShowPassword(true);
      setIsPasswordVerified(true); // Mark as verified
      setFormData((prev) => ({ ...prev, password: tempPassword }));
      setShowPinModal(false);
      setPin("");
      toast.success("PIN verified successfully");
    } else {
      toast.error("Invalid PIN");
      setPin("");
    }
  };

  const handlePinCancel = () => {
    setShowPinModal(false);
    setPin("");
    // Don't change showPassword state here, keep it as is
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => data.append(key, formData[key]));
      if (logoFile) data.append("logo", logoFile);

      if (company) {
        await api.put(`/api/v1/admin/companyMaster/${company.id}`, data, {
          headers: { "Content-Type": "multipart/form-data" , Authorization: `Bearer ${token}`},
        });
        toast.success("Company updated successfully");
      } else {
        await api.post("/api/v1/admin/companyMaster", data, {
          headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer  ${token}` },
        });
        toast.success("Company added successfully");
      }

      onSave();
      handleClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    }
  };

  // Determine password field type and behavior
  const getPasswordFieldType = () => {
    if (isEditing) {
      return showPassword ? "text" : "password";
    } else {
      // Always show as text when adding new company
      return "text";
    }
  };

  const getPasswordButtonTitle = () => {
    if (isEditing) {
      return showPassword ? "Hide Password" : "Show Password";
    } else {
      return "Password Visible";
    }
  };

  // Check if password field should be disabled
  const isPasswordDisabled = isEditing && !isPasswordVerified && !showPassword;

  return (
    <>
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
                { label: "Company Name", name: "name", required: true },
                { label: "Person Name", name: "personName", required: true },
                { label: "Email", name: "email", required: true },
                { label: "Address", name: "address", required: true },
                { label: "GST No", name: "GSTno", required: false },
                { label: "State", name: "state", required: true },
                { label: "City", name: "city", required: true },
                { label: "Pincode", name: "pincode", required: true },
                { label: "Mobile 1", name: "mobile1", required: true },
                { label: "Mobile 2", name: "mobile2", required: false },
              ].map((field) => (
                <Form.Group className="mb-3 col-md-6" key={field.name}>
                  <Form.Label>{field.label}</Form.Label>
                  <Form.Control
                    type={field.name === "email" ? "email" : "text"}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    required={field.required}
                  />
                </Form.Group>
              ))}

              {/* Password Field with Visibility Toggle */}
          {isEditing && (
  <Form.Group className="mb-3 col-md-6">
    <Form.Label>Password</Form.Label>
    <InputGroup>
      <Form.Control
        type={getPasswordFieldType()}
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Enter password"
        required
        disabled={isPasswordDisabled}
        className={isPasswordDisabled ? "bg-light" : ""}
      />
      <Button
        variant="outline-secondary"
        onClick={handlePasswordVisibilityToggle}
        title={getPasswordButtonTitle()}
      >
        {showPassword ? <BsEyeSlash /> : <BsEye />}
      </Button>
    </InputGroup>
    {!isPasswordVerified && !showPassword && (
      <Form.Text className="text-warning">
        Verify PIN to view or edit password
      </Form.Text>
    )}
    {isPasswordVerified && (
      <Form.Text className="text-success">
        PIN verified - Password is visible and editable
      </Form.Text>
    )}
  </Form.Group>
)}

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

      {/* PIN Verification Modal */}
      <Modal
        show={showPinModal}
        onHide={handlePinCancel}
        centered
  backdrop="static"
  style={{
    // backdropFilter: 'blur(5px)',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Enter PIN to View Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Security PIN</Form.Label>
            <Form.Control
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter 4-digit PIN"
              maxLength={4}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handlePinSubmit();
                }
              }}
            />
            <Form.Text className="text-muted">
              Enter the security PIN to view and edit the password.
            </Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handlePinCancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handlePinSubmit}>
            Verify PIN
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddEditCompanyModal;