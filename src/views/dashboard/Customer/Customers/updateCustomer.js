import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Row, Col, Button, Form, Spinner } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../../../api/axios";
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

const UpdateCustomer = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [customerData, setCustomerData] = useState(null);
  const [preview, setPreview] = useState(null);
  const initialValues = {
    client_id: "",
    salutation: "",
    name: "",
    email: "",
    password: "",
    contact: "",
    address: "",
    gender: "",
    city: "",
    state: "",
    pincode: "",
    photo: null,
    client_category_id: "",
  };

  const validationSchema = Yup.object().shape({
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
    password: Yup.string().min(
      6,
      "Password must be at least 6 characters long"
    ),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
    pincode: Yup.string()
      .required("Pincode is required")
      .matches(/^\d{6}$/, "Enter a valid 6-digit pincode"),
    client_category_id: Yup.string().required("Client Category is required"),
    // photo: Yup.mixed()
    //   .nullable()
    //   .test(
    //     "fileType",
    //     "Only JPG, JPEG, PNG, or GIF files are allowed",
    //     (value) => {
    //       if (!value) return true;
    //       return ["image/jpeg", "image/jpg", "image/png", "image/gif"].includes(
    //         value.type
    //       );
    //     }
    //   ),
    docSelect: Yup.string().required("Document Type is required"),
    doc_no: Yup.string().required("Document number is required"),
    doc_upload: Yup.mixed()
      .nullable()
      .test("fileType", "Only Pdf files are allowed", (value) => {
        if (!value) return true;
        return ["application/pdf"].includes(value.type);
      }),
  });

  const formik = useFormik({
    initialValues: customerData || initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const formData = new FormData();
        for (let key in values) {
          if (values[key] !== "" && values[key] !== null) {
            formData.append(key, values[key]);
          }
        }

        const res = await api.put(`/api/v1/admin/client/${id}`, formData);
        successToast(res.data.message || "Customer updated successfully");
        navigate("/CustomerList");
      } catch (err) {
        errorToast(err.response?.data?.message || "Failed to update customer");
      } finally {
        setLoading(false);
      }
    },
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

  // Fetch categories & customer details
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, custRes] = await Promise.all([
          api.get("/api/v1/admin/clientCategory/active"),
          api.get(`/api/v1/admin/client/${id}`),
        ]);

        setCategories(catRes.data || []);
        if (custRes.data?.data) {
          setCustomerData(custRes.data.data);
        }
      } catch (err) {
        errorToast("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    if (customerData?.photo) {
      setPreview(customerData.photo); // assuming API returns photo URL
    }
  }, [customerData]);
  // File input update
  <CustomFileInput
    label="Profile Picture"
    name="photo"
    accept="image/*"
    onChange={(e) => {
      const file = e.currentTarget.files[0];
      setFieldValue("photo", file);
      if (file) {
        setPreview(URL.createObjectURL(file));
      }
    }}
    onBlur={handleBlur}
    error={errors.photo}
    touched={touched.photo}
  />;

  if (loading && !customerData) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <Card>
      <Card.Header>
        <h5 className="mb-0">Update Customer</h5>
      </Card.Header>
      <hr />
      <Card.Body className="pt-0">
        <Form onSubmit={handleSubmit}>
          {/* Row 1 */}
          <Row>
            <Col md={4}>
              <CustomInput
                label="Customer ID"
                name="client_id"
                value={values.client_id}
                onChange={handleChange}
                onBlur={handleBlur}
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
                error={errors.salutation}
                touched={touched.salutation}
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
                errors={errors.name}
                touched={touched.name}
              />
            </Col>
          </Row>

          {/* Row 2 */}
          <Row className="mt-3">
            <Col md={4}>
              <CustomInput
                label="Mobile Number"
                name="contact"
                value={values.contact}
                onChange={handleChange}
                onBlur={handleBlur}
                errors={errors.contact}
                touched={touched.contact}
              />
            </Col>
            <Col md={4}>
              <CustomInput
                label="Email"
                name="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                errors={errors.email}
                touched={touched.email}
              />
            </Col>
            <Col md={4}>
              <CustomInput
                label="Password"
                type="password"
                name="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                errors={errors.password}
                touched={touched.password}
              />
            </Col>
          </Row>

          {/* Row 3 */}
          <Row className="mt-3">
            <Col md={4}>
              <CustomRadioGroup
                label="Gender"
                name="gender"
                options={genderData}
                value={values.gender}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.gender}
                touched={touched.gender}
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
                errors={errors.address}
                touched={touched.address}
              />
            </Col>
          </Row>

          {/* Row 4 */}
          <Row className="mt-3">
            <Col md={4}>
              <CustomInput
                label="City"
                name="city"
                value={values.city}
                onChange={handleChange}
                onBlur={handleBlur}
                errors={errors.city}
                touched={touched.city}
              />
            </Col>
            <Col md={4}>
              <CustomInput
                label="State"
                name="state"
                value={values.state}
                onChange={handleChange}
                onBlur={handleBlur}
                errors={errors.state}
                touched={touched.state}
              />
            </Col>
            <Col md={4}>
              <CustomInput
                label="Pincode"
                name="pincode"
                value={values.pincode}
                onChange={handleChange}
                onBlur={handleBlur}
                errors={errors.pincode}
                touched={touched.pincode}
              />
            </Col>
          </Row>

          {/* Row 5 */}
          <Row className="mt-3 mb-4">
            <Col md={6}>
              {preview && (
                <div className="">
                  <p
                    className="mb-2"
                    style={{ color: "#495057", fontSize: "14px" }}
                  >
                    Current Picture
                  </p>
                  <img
                    src={preview}
                    alt="Profile Preview"
                    style={{
                      maxWidth: "150px",
                      maxHeight: "150px",
                      borderRadius: "8px",
                      objectFit: "cover",
                      border: "1px solid #ddd",
                    }}
                  />
                </div>
              )}
              <CustomFileInput
                label="Profile Picture"
                name="photo"
                accept="image/*"
                onChange={(e) =>
                  setFieldValue("photo", e.currentTarget.files[0])
                }
                onBlur={handleBlur}
                error={errors.photo}
                touched={touched.photo}
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
                error={errors.client_category_id}
                touched={touched.client_category_id}
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

          {/* Buttons */}
          <div className="text-end">
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update"}
            </Button>
            <Button
              variant="secondary"
              className="ms-2"
              onClick={() => navigate("/CustomerList")}
            >
              Cancel
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default UpdateCustomer;
