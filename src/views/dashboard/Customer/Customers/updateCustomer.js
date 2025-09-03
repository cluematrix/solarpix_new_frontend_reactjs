import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Card, Spinner } from "react-bootstrap";
import * as Yup from "yup";
import api from "../../../../api/axios";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import { successToast } from "../../../../components/Toast/successToast";
import { errorToast } from "../../../../components/Toast/errorToast";
import { genderData, salutationData } from "../../../../mockData";
import CustomSelect from "../../../../components/Form/CustomSelect";
import CustomInput from "../../../../components/Form/CustomInput";
import CustomRadioGroup from "../../../../components/Form/CustomRadioGroup";
import CustomFileInput from "../../../../components/Form/CustomFileInput";

const UpdateCustomer = () => {
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
    client_sub_category_id: "",
  };

  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [customerData, setCustomerData] = useState(null);

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
    client_sub_category_id: Yup.string().required(
      "Client Sub Category is required"
    ),
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
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch categories
        const categoryRes = await api.get("/api/v1/admin/clientCategory");
        setCategories(categoryRes.data.filter((c) => c.isActive));

        // Fetch customer by ID
        const customerRes = await api.get(`/api/v1/admin/Customer/${id}`);
        setCustomerData(customerRes.data.data);

        // Set subcategories if category exists
        if (customerRes.data.data.client_category_id) {
          const selectedCat = categoryRes.data.find(
            (c) => c.id === customerRes.data.data.client_category_id
          );
          setSubCategories(selectedCat?.subCategories || []);
        }
      } catch (error) {
        errorToast("Error loading customer details");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const onSubmit = async (values) => {
    try {
      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        if (values[key] !== "" && values[key] !== null) {
          formData.append(key, values[key]);
        }
      });

      const res = await api.put(`/api/v1/admin/Customer/${id}`, formData);
      successToast(res.data.message || "Customer updated successfully");
      navigate("/Customer-list");
    } catch (err) {
      errorToast(err.response?.data?.message || "Failed to update Customer");
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
    enableReinitialize: true, // <-- IMPORTANT for prefill
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

  useEffect(() => {
    if (customerData) {
      formik.setValues({
        ...initialValues,
        ...customerData,
        photo: null, // reset file input
      });
    }
  }, [customerData]);

  if (loading) {
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
          {/* Row 1 {client_id, salutation, name} */}
          <Row>
            <Col md={4}>
              <CustomInput
                label="Customer ID"
                name="client_id"
                value={values.client_id}
                onChange={handleChange}
                onBlur={handleBlur}
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

          {/* Row 5 {photo, category, subcategory} */}
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
                onChange={(e) => {
                  handleChange(e);
                  const selectedCat = categories.find(
                    (c) => c.id === parseInt(e.target.value)
                  );
                  setSubCategories(selectedCat?.subCategories || []);
                }}
                onBlur={handleBlur}
                options={categories}
                placeholder="--"
                error={errors.client_category_id}
                touched={touched.client_category_id}
                required
                lableName="category"
              />
            </Col>
            <Col md={4}>
              <CustomSelect
                label="Client Sub Category"
                name="client_sub_category_id"
                value={values.client_sub_category_id}
                onChange={handleChange}
                onBlur={handleBlur}
                options={subCategories}
                placeholder="--"
                error={errors.client_sub_category_id}
                touched={touched.client_sub_category_id}
                required
                lableName="sub_category_name"
              />
            </Col>
          </Row>

          {/* Submit + Cancel */}
          <div className="mt-4 text-end">
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Update"}
            </Button>
            <Button
              variant="secondary"
              className="ms-2"
              onClick={() => navigate("/Customer-list")}
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
