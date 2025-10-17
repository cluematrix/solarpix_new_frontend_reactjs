import React, { useState, useEffect } from "react";
import {
  Form,
  Button,
  Row,
  Col,
  Card,
  Spinner,
  FormCheck,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../../api/axios";
import * as Yup from "yup";
import { useFormik } from "formik";
import { successToast } from "../../../../components/Toast/successToast";
import { errorToast } from "../../../../components/Toast/errorToast";
import { genderData, salutationData } from "../../../../mockData";
import CustomSelect from "../../../../components/Form/CustomSelect";
import CustomInput from "../../../../components/Form/CustomInput";
import CustomRadioGroup from "../../../../components/Form/CustomRadioGroup";
import CustomFileInput from "../../../../components/Form/CustomFileInput";

const UpdateCustomer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [customerList, setCustomerList] = useState([]);
  const [dealList, setDealList] = useState([]);
  const [dynamicFields, setDynamicFields] = useState([]);
  const [copyBillingToShipping, setCopyBillingToShipping] = useState(false);

  const initialValues = {
    lead_id: "",
    salutation: "",
    name: "",
    email: "",
    password: "",
    contact: "",
    billing_address: "",
    billing_city: "",
    billing_state: "",
    billing_pincode: "",
    shipping_address: "",
    shipping_city: "",
    shipping_state: "",
    shipping_pincode: "",
    gender: "",
    city: "",
    state: "",
    pincode: "",
    photo: null,
    client_category_id: "",
    description: "",
    kyc_status: "Pending",
    deal_id: "",
    dynamic_fields: {},
  };

  const validationSchema = Yup.object().shape({
    salutation: Yup.string().required("Salutation is required"),
    name: Yup.string().required("Name is required"),
    gender: Yup.string().required("Gender is required"),
    billing_address: Yup.string().required("Billing Address is required"),
    billing_city: Yup.string().required("Billing City is required"),
    billing_state: Yup.string().required("Billing State is required"),
    billing_pincode: Yup.string().required("Billing Pincode is required"),
    shipping_address: Yup.string().required("Shipping Address is required"),
    shipping_city: Yup.string().required("Shipping City is required"),
    shipping_state: Yup.string().required("Shipping State is required"),
    shipping_pincode: Yup.string().required("Shipping Pincode is required"),
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
    client_category_id: Yup.string().required("Customer Category is required"),
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

  // const onSubmit = async (values, { resetForm }) => {
  //   try {
  //     const formData = new FormData();
  //     Object.keys(values).forEach((key) => {
  //       if (values[key] !== "" && values[key] !== null) {
  //         if (key === "photo" && values[key] instanceof File) {
  //           formData.append(key, values[key]);
  //         } else if (
  //           key === "dynamic_fields" &&
  //           typeof values[key] === "object"
  //         ) {
  //           const textFields = {};
  //           Object.keys(values.dynamic_fields).forEach((fieldName) => {
  //             const field = dynamicFields.find(
  //               (f) => f.field_name === fieldName
  //             );
  //             if (field) {
  //               if (
  //                 field.data_type === "text" ||
  //                 field.data_type === "number"
  //               ) {
  //                 if (values.dynamic_fields[fieldName]) {
  //                   textFields[fieldName] = values.dynamic_fields[fieldName];
  //                 }
  //               } else if (
  //                 (field.data_type === "image" || field.data_type === "pdf") &&
  //                 values.dynamic_fields[fieldName] instanceof File
  //               ) {
  //                 formData.append(fieldName, values.dynamic_fields[fieldName]);
  //               }
  //             }
  //           });
  //           if (Object.keys(textFields).length > 0) {
  //             formData.append("dynamic_fields", JSON.stringify(textFields));
  //           }
  //         } else {
  //           formData.append(key, values[key]);
  //         }
  //       }
  //     });

  //     const res = await api.put(`/api/v1/admin/client/${id}`, formData, {
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //       },
  //     });
  //     successToast("Customer updated successfully");
  //     resetForm();
  //     navigate("/CustomerList");
  //   } catch (err) {
  //     errorToast(err.response?.data?.message || "Failed to update Customer");
  //   }
  // };

  const onSubmit = async (values, { resetForm }) => {
    try {
      const formData = new FormData();

      Object.keys(values).forEach((key) => {
        if (values[key] !== "" && values[key] !== null) {
          if (key === "photo" && values[key] instanceof File) {
            formData.append(key, values[key]);
          } else if (
            key === "dynamic_fields" &&
            typeof values[key] === "object"
          ) {
            const textFields = {};
            Object.keys(values.dynamic_fields).forEach((fieldName) => {
              const field = dynamicFields.find(
                (f) => f.field.field_name === fieldName
              );

              if (!field) return;

              const dataType = field.field.data_type;
              const newValue = values.dynamic_fields[fieldName];

              // 🟢 Handle text/number
              if (["text", "number"].includes(dataType)) {
                if (newValue !== undefined && newValue !== null) {
                  textFields[fieldName] = newValue;
                }
              }

              // 🟢 Handle image/pdf
              else if (["image", "pdf"].includes(dataType)) {
                if (newValue instanceof File) {
                  // New file selected
                  formData.append(fieldName, newValue);
                } else if (field.file_url) {
                  // Keep existing file reference if not changed
                  textFields[fieldName] = field.file_url;
                }
              }
            });

            if (Object.keys(textFields).length > 0) {
              formData.append("dynamic_fields", JSON.stringify(textFields));
            }
          } else {
            formData.append(key, values[key]);
          }
        }
      });

      const res = await api.put(`/api/v1/admin/client/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      successToast("Customer updated successfully");
      resetForm();
      navigate("/CustomerList");
    } catch (err) {
      errorToast(err.response?.data?.message || "Failed to update Customer");
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
    enableReinitialize: true,
  });

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setValues,
    isSubmitting,
  } = formik;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [catRes, custRes, dealRes, customerRes] = await Promise.all([
          api.get("/api/v1/admin/clientCategory/active"),
          api.get("/api/v1/admin/client"),
          api.get("/api/v1/admin/deal"),
          api.get(`/api/v1/admin/client/${id}`),
        ]);

        setCategories(catRes.data);
        setCustomerList(custRes.data.data);
        setDealList(dealRes.data.map((item) => item.lead));
        setDynamicFields(customerRes.data.data.dynamicFields || []);

        if (customerRes.data.success && customerRes.data.data) {
          const dynamicInit = {};
          customerRes.data.data.dynamicFields?.forEach((df) => {
            dynamicInit[df.field.field_name] = df.value || "";
          });

          setValues({
            ...initialValues,
            ...customerRes.data.data,
            dynamic_fields: dynamicInit,
          });
        }
      } catch (error) {
        errorToast("Error loading data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, setValues]);

  const handleDynamicChange = (fieldName, value) => {
    setFieldValue(`dynamic_fields.${fieldName}`, value);
  };

  const handleCopyBillingToShipping = (e) => {
    setCopyBillingToShipping(e.target.checked);
    if (e.target.checked) {
      setFieldValue("shipping_address", values.billing_address);
      setFieldValue("shipping_city", values.billing_city);
      setFieldValue("shipping_state", values.billing_state);
      setFieldValue("shipping_pincode", values.billing_pincode);
    }
  };

  if (loading) {
    return (
      <div className="loader-div">
        <Spinner animation="border" className="spinner" />
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
          <Row>
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
          </Row>

          <Row className="mt-3">
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
                // value={values}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter Password"
                touched={touched.password}
                errors={errors.password}
              />
            </Col>
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
          </Row>
          <Row className="mt-3">
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
          </Row>
          <br></br>
          <Row className="mt-3">
            {/* Billing Address - Left */}
            <Col md={6}>
              <CustomInput
                label="Billing Address"
                name="billing_address"
                as="textarea"
                value={values.billing_address}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter Billing Address"
                touched={touched.billing_address}
                errors={errors.billing_address}
                required
                row={2}
              />

              <CustomInput
                label="Billing City"
                name="billing_city"
                value={values.billing_city}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter Billing City"
                touched={touched.billing_city}
                errors={errors.billing_city}
                required
                className="mt-3"
              />

              <CustomInput
                label="Billing State"
                name="billing_state"
                value={values.billing_state}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter Billing State"
                touched={touched.billing_state}
                errors={errors.billing_state}
                required
                className="mt-3"
              />

              <CustomInput
                label="Billing Pin Code"
                name="billing_pincode"
                value={values.billing_pincode}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter Billing Pin Code"
                touched={touched.billing_pincode}
                errors={errors.billing_pincode}
                required
                className="mt-3"
              />
            </Col>

            {/* Shipping Address - Right */}
            <Col md={6}>
              <FormCheck
                type="checkbox"
                label="Same as Billing Address"
                checked={copyBillingToShipping}
                onChange={handleCopyBillingToShipping}
                className="mb-3"
              />

              <CustomInput
                label="Shipping Address"
                name="shipping_address"
                as="textarea"
                value={values.shipping_address}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter Shipping Address"
                touched={touched.shipping_address}
                errors={errors.shipping_address}
                required
                row={2}
                disabled={copyBillingToShipping}
              />

              <CustomInput
                label="Shipping City"
                name="shipping_city"
                value={values.shipping_city}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter Shipping City"
                touched={touched.shipping_city}
                errors={errors.shipping_city}
                required
                disabled={copyBillingToShipping}
                className="mt-3"
              />

              <CustomInput
                label="Shipping State"
                name="shipping_state"
                value={values.shipping_state}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter Shipping State"
                touched={touched.shipping_state}
                errors={errors.shipping_state}
                required
                disabled={copyBillingToShipping}
                className="mt-3"
              />

              <CustomInput
                label="Shipping Pin Code"
                name="shipping_pincode"
                value={values.shipping_pincode}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter Shipping Pin Code"
                touched={touched.shipping_pincode}
                errors={errors.shipping_pincode}
                required
                disabled={copyBillingToShipping}
                className="mt-3"
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

          <hr />
          <Card.Header className="p-0 pb-2">
            <h5 className="mb-0">Document Type</h5>
          </Card.Header>

          <Row className="mt-3 mb-4">
            {dynamicFields.length > 0 ? (
              dynamicFields.map((item) => {
                const field = item.field;
                const existingFile = item.file_url;
                return (
                  <Col md={4} key={field.id} className="mb-3">
                    {field.data_type === "text" && (
                      <CustomInput
                        label={field.label}
                        name={`dynamic_fields.${field.field_name}`}
                        value={values.dynamic_fields?.[field.field_name] || ""}
                        onChange={(e) =>
                          handleDynamicChange(field.field_name, e.target.value)
                        }
                        placeholder={`Enter ${field.label}`}
                      />
                    )}
                    {field.data_type === "number" && (
                      <CustomInput
                        type="number"
                        label={field.label}
                        name={`dynamic_fields.${field.field_name}`}
                        value={values.dynamic_fields?.[field.field_name] || ""}
                        onChange={(e) =>
                          handleDynamicChange(field.field_name, e.target.value)
                        }
                        placeholder={`Enter ${field.label}`}
                      />
                    )}
                    {(field.data_type === "pdf" ||
                      field.data_type === "image") && (
                      <>
                        <CustomFileInput
                          label={`${field.label} (${
                            field.data_type === "pdf" ? "PDF" : "Image"
                          })`}
                          name={`dynamic_fields.${field.field_name}`}
                          accept={
                            field.data_type === "pdf"
                              ? "application/pdf"
                              : "image/*"
                          }
                          onChange={(e) =>
                            handleDynamicChange(
                              field.field_name,
                              e.currentTarget.files[0]
                            )
                          }
                        />
                        {existingFile && (
                          <div className="mt-2">
                            <a
                              style={{ fontSize: "14px" }}
                              href={existingFile}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View Existing {field.label}
                            </a>
                          </div>
                        )}
                      </>
                    )}
                  </Col>
                );
              })
            ) : (
              <Col>
                <p className="text-muted">
                  No dynamic document fields configured.
                </p>
              </Col>
            )}
          </Row>

          <div className="mt-4 text-end">
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update"}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default UpdateCustomer;
