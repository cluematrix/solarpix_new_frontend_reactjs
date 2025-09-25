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
import { IoNavigate } from "react-icons/io5";
import DealList from "../../Leads/Deals/deals-list";

const UpdateCustomer = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [customerData, setCustomerData] = useState(null);
  const [preview, setPreview] = useState(null);
  const [previewPdf, setPreviewPdf] = useState(null);
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
    docSelect: "",
    doc: "",
    doc_upload: "",
    description: "",
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
    // docSelect: Yup.string().required("Document Type is required"),
    doc_no: Yup.string().required("Document number is required"),
    // doc_upload: Yup.mixed()
    //   .nullable()
    //   .test("fileType", "Only Pdf files are allowed", (value) => {
    //     if (!value) return true;
    //     return ["application/pdf"].includes(value.type);
    //   }),
    doc_upload: Yup.mixed()
      .nullable()
      .test("fileType", "Only PDF files are allowed", (value) => {
        if (!value) return true; // not uploading → valid
        if (typeof value === "string") return true; // already uploaded URL → valid
        return value && value.type === "application/pdf"; // new file → check type
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

  console.log("customerData", customerData);

  useEffect(() => {
    if (customerData?.photo || customerData?.doc_upload) {
      setPreview(customerData?.photo);
      setPreviewPdf(customerData?.doc_upload);
    }
  }, [customerData]);

  // File input update
  // <CustomFileInput
  //   label="Profile Picture"
  //   name="photo"
  //   accept="image/*"
  //   onChange={(e) => {
  //     const file = e.currentTarget.files[0];
  //     setFieldValue("photo", file);
  //     if (file) {
  //       setPreview(URL.createObjectURL(file));
  //     }
  //   }}
  //   onBlur={handleBlur}
  //   error={errors.photo}
  //   touched={touched.photo}
  // />;

  if (loading && !customerData) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }

  console.log("previewPdf", previewPdf);
  console.log("errors", errors);
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
            <Col md={4}>
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
            <Col md={4}>
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
            <Col md={4}>
              <CustomSelect
                label="Deal"
                name="deal_id"
                value={values.deal_id}
                onChange={handleChange}
                onBlur={handleBlur}
                options={DealList}
                placeholder="--"
                error={errors.deal_id}
                touched={touched.deal_id}
                required
                valueName="id"
                lableName="name"
              />
            </Col>
          </Row>

          <hr />
          <Card.Header className="p-0 pb-2">
            <h5 className="mb-0">Document Details</h5>
          </Card.Header>

          {/* Row 5 {doc_upload(aadhaar), extra_doc(pan)} */}
          <Row className="mt-3 mb-4">
            <Col md={4}>
              <CustomFileInput
                label="Aadhaar Card (pdf)"
                name="doc_upload"
                // accept="application/pdf"
                onChange={(e) =>
                  setFieldValue("doc_upload", e.currentTarget.files[0])
                }
                onBlur={handleBlur}
                touched={touched.doc_upload}
                error={errors.doc_upload}
                required
              />
            </Col>

            <Col md={4}>
              <CustomFileInput
                label="Pan Card (pdf)"
                name="extra_doc"
                // accept="application/pdf"
                onChange={(e) =>
                  setFieldValue("extra_doc", e.currentTarget.files[0])
                }
                onBlur={handleBlur}
                touched={touched.extra_doc}
                error={errors.extra_doc}
                required
              />
            </Col>
          </Row>

          {/* electric_bill, extra_file */}
          <Row className="mt-3 mb-4">
            <Col md={4}>
              <CustomFileInput
                label="Electricity Bill (pdf)"
                name="electric_bill"
                // accept="application/pdf"
                onChange={(e) =>
                  setFieldValue("electric_bill", e.currentTarget.files[0])
                }
                onBlur={handleBlur}
                touched={touched.electric_bill}
                error={errors.electric_bill}
                required
              />
            </Col>

            <Col md={4}>
              <CustomFileInput
                label="NOC / Sale Deed (pdf)"
                name="extra_file"
                // accept="application/pdf"
                onChange={(e) =>
                  setFieldValue("extra_file", e.currentTarget.files[0])
                }
                onBlur={handleBlur}
                touched={touched.extra_file}
                error={errors.extra_file}
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
          {/* Save */}
          <div className="mt-4 text-end">
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default UpdateCustomer;
