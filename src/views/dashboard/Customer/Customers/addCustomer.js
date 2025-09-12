import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Card, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../../../../api/axios";
import * as Yup from "yup";
import { useFormik } from "formik";
import { successToast } from "../../../../components/Toast/successToast";
import { errorToast } from "../../../../components/Toast/errorToast";
import {
  docTypeOptions,
  genderData,
  salutationData,
} from "../../../../mockData";
import CustomSelect from "../../../../components/Form/CustomSelect";
import CustomInput from "../../../../components/Form/CustomInput";
import CustomRadioGroup from "../../../../components/Form/CustomRadioGroup";
import CustomFileInput from "../../../../components/Form/CustomFileInput";
import { useLocation } from "react-router-dom";

const AddCustomer = () => {
  const location = useLocation();
  const leadData = location.state?.leadData || null;

  console.log("leadData", leadData);
  const initialValues = {
    client_id: "",
    lead_id: leadData?.id || "",
    salutation: leadData?.salutation || "",
    name: leadData?.name || "",
    email: leadData?.email || "",
    password: "", // keep blank
    contact: leadData?.contact || "",
    address: leadData?.address || "",
    gender: "", // lead may not have gender
    city: leadData?.city || "",
    state: leadData?.state || "",
    pincode: leadData?.pincode || "",
    photo: leadData.photo || null,
    client_category_id: leadData.client_category_id || "",
    docSelect: leadData.docSelect || "",
    doc_no: leadData.doc_no || "",
    doc_upload: leadData.doc_upload || "",
    description: leadData.description || "",
  };

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [customerList, setCustomerList] = useState([]); // store all customers

  const validationSchema = Yup.object().shape({
    client_id: Yup.string().required("Customer ID is required"),
    salutation: Yup.string().required("Salutation is required"),
    name: Yup.string().required("Name is required"),
    gender: Yup.string().required("Gender is required"),
    address: Yup.string().required("Address is required"),
    contact: Yup.string()
      .required("Mobile number is required")
      .matches(/^[0-9]{10}$/, "Enter a valid 10-digit mobile number"),
    email: Yup.string()
      .required("Email is required")
      .email("Enter a valid email address"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters long"),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
    pincode: Yup.string()
      .required("Pincode is required")
      .matches(/^\d{6}$/, "Enter a valid 6-digit pincode"),
    client_category_id: Yup.string().required("Client Category is required"),
    photo: Yup.mixed()
      .nullable()
      .test(
        "fileType",
        "Only JPG, JPEG, PNG, or GIF files are allowed",
        (value) => {
          if (!value) return true;
          return ["image/jpeg", "image/jpg", "image/png", "image/gif"].includes(
            value.type
          );
        }
      ),
    docSelect: Yup.string().required("Document Type is required"),
    doc_no: Yup.string().required("Document number is required"),
    doc_upload: Yup.mixed()
      .nullable()
      .test("fileType", "Only Pdf files are allowed", (value) => {
        if (!value) return true;
        return ["application/pdf"].includes(value.type);
      })
      .required("Upload doc is required"),
  });

  const onSubmit = async (values, { resetForm }) => {
    try {
      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        if (values[key] !== "" && values[key] !== null) {
          formData.append(key, values[key]);
        }
      });

      const res = await api.post("/api/v1/admin/client", formData);
      console.log(res);
      successToast(res.data.message || "Customer added successfully");
      resetForm();
      navigate("/CustomerList");
    } catch (err) {
      errorToast(err.response?.data?.message || "Failed to add Customer");
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    isSubmitting,
  } = formik;

  // Fetch categories and customer list
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [catRes, custRes] = await Promise.all([
          api.get("/api/v1/admin/clientCategory/active"),
          api.get("/api/v1/admin/client"), // assuming this returns all customers
        ]);

        console.log("cust-re", custRes);
        setCategories(catRes.data || []);
        setCustomerList(custRes.data.data || []);
      } catch (error) {
        errorToast("Error loading data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ✅ Auto-generate next Client ID
  useEffect(() => {
    if (customerList && customerList.length > 0) {
      // Extract numeric parts from all client_id values
      const nums = customerList.map((c) => {
        const num = parseInt(c.client_id?.replace("CUSTO", ""), 10);
        return isNaN(num) ? 0 : num;
      });
      console.log("list of ", customerList);
      // Find maximum number
      const maxNum = Math.max(...nums);

      // Generate next ID
      const nextId = "CUSTO" + String(maxNum + 1).padStart(3, "0");

      setFieldValue("client_id", nextId);

      console.log("Last max client_id number:", maxNum, " → Next:", nextId);
    } else {
      // First customer
      setFieldValue("client_id", "CUSTO001");
    }
  }, [customerList, setFieldValue]);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }

  console.log("lead_id", values.lead_id);
  return (
    <Card>
      <Card.Header>
        <h5 className="mb-0">Add Customer</h5>
      </Card.Header>
      <hr />
      <Card.Body className="pt-0">
        <Form onSubmit={handleSubmit}>
          {/* Row 1 {client_id, salutation, name} */}
          <Row>
            <Col md={4}>
              <CustomInput
                label="Customer ID"
                name="client_id"
                value={values.client_id}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter Customer ID"
                touched={touched.client_id}
                errors={errors.client_id}
                required
                disabled
              />
            </Col>
            <Col md={4}>
              <CustomSelect
                label="Salutation"
                name="salutation"
                value={values.salutation}
                onChange={handleChange}
                onBlur={handleBlur}
                options={salutationData}
                placeholder="--"
                error={errors.salutation}
                touched={touched.salutation}
                required
                valueName="value"
                lableName="salutation"
              />
            </Col>
            <Col md={4}>
              <CustomInput
                label="Name"
                name="name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter Name"
                touched={touched.name}
                errors={errors.name}
                required
              />
            </Col>
          </Row>

          {/* Row 2 {contact, email, password} */}
          <Row className="mt-3">
            <Col md={4}>
              <CustomInput
                label="Mobile Number"
                name="contact"
                value={values.contact}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter Mobile Number"
                touched={touched.contact}
                errors={errors.contact}
                required
              />
            </Col>
            <Col md={4}>
              <CustomInput
                label="Email"
                name="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter Email"
                touched={touched.email}
                errors={errors.email}
                required
              />
            </Col>
            <Col md={4}>
              <CustomInput
                label="Password"
                name="password"
                type="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter Password"
                touched={touched.password}
                errors={errors.password}
                required
              />
            </Col>
          </Row>

          {/* Row 3 {gender, address} */}
          <Row className="mt-3">
            <Col md={4}>
              <CustomRadioGroup
                label="Gender"
                name="gender"
                options={genderData}
                value={values.gender}
                onChange={handleChange}
                onBlur={handleBlur}
                touched={touched.gender}
                error={errors.gender}
                required
              />
            </Col>
            <Col md={8}>
              <CustomInput
                label="Address"
                name="address"
                as="textarea"
                value={values.address}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter Address"
                touched={touched.address}
                errors={errors.address}
                required
                row={2}
              />
            </Col>
          </Row>

          {/* Row 4 {city, state, pincode} */}
          <Row className="mt-3">
            <Col md={4}>
              <CustomInput
                label="City"
                name="city"
                value={values.city}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter City"
                touched={touched.city}
                errors={errors.city}
                required
              />
            </Col>
            <Col md={4}>
              <CustomInput
                label="State"
                name="state"
                value={values.state}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter State"
                touched={touched.state}
                errors={errors.state}
                required
              />
            </Col>
            <Col md={4}>
              <CustomInput
                label="Pin Code"
                name="pincode"
                value={values.pincode}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter Pin Code"
                touched={touched.pincode}
                errors={errors.pincode}
                required
              />
            </Col>
          </Row>

          {/* Row 5 {photo, category} */}
          <Row className="mt-3 mb-4">
            <Col md={6}>
              <CustomFileInput
                label="Profile Picture"
                name="photo"
                accept="image/*"
                onChange={(e) =>
                  setFieldValue("photo", e.currentTarget.files[0])
                }
                onBlur={handleBlur}
                touched={touched.photo}
                error={errors.photo}
              />
            </Col>
            <Col md={6}>
              <CustomSelect
                label="Client Category"
                name="client_category_id"
                value={values.client_category_id}
                onChange={handleChange}
                onBlur={handleBlur}
                options={categories}
                placeholder="--"
                error={errors.client_category_id}
                touched={touched.client_category_id}
                required
                valueName="id"
                lableName="category"
              />
            </Col>
          </Row>

          <hr />
          <Card.Header className="p-0 pb-2">
            <h5 className="mb-0">Document Details</h5>
          </Card.Header>

          {/* Row 5 {docSelect} */}
          <Row className="mt-3 mb-4">
            <Col md={4}>
              <CustomRadioGroup
                label="Select Document"
                name="docSelect"
                options={docTypeOptions}
                value={values.docSelect}
                onChange={handleChange}
                onBlur={handleBlur}
                touched={touched.docSelect}
                error={errors.docSelect}
                required
              />
            </Col>
          </Row>

          {/* Row 5 {doc_no} */}
          <Row className="mt-3 mb-4">
            <Col md={4}>
              <CustomInput
                label={`Enter ${values.docSelect} No`}
                name="doc_no"
                value={values.doc_no}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder={`Enter ${values.docSelect} No`}
                touched={touched.doc_no}
                errors={errors.doc_no}
                disabled={!values.docSelect}
                required
                title={!values.docSelect && `Choose doc type first`}
              />
            </Col>

            <Col md={4}>
              <CustomFileInput
                label={`Upload ${values.docSelect} (Pdf)`}
                name="doc_upload"
                // accept="application/pdf"
                onChange={(e) =>
                  setFieldValue("doc_upload", e.currentTarget.files[0])
                }
                onBlur={handleBlur}
                touched={touched.doc_upload}
                error={errors.doc_upload}
                disabled={!values.docSelect}
                required
                title={!values.docSelect && `Choose doc type first`}
              />
            </Col>
          </Row>
          <Row className="mt-3 mb-4">
            <Col md={12}>
              <CustomInput
                as="textarea"
                label="Enter Notes / Remarks"
                name="description"
                value={values.description}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter Notes / Remarks"
                touched={touched.description}
                errors={errors.description}
              />
            </Col>
          </Row>
          {/* Submit + Cancel */}
          <div className="mt-4 text-end">
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
            <Button
              variant="secondary"
              className="ms-2"
              onClick={() => navigate("/Customerlist")}
            >
              Cancel
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default AddCustomer;
