import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Card, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../../../../api/axios";
import * as Yup from "yup";
import { useFormik } from "formik";
import { successToast } from "../../../../components/Toast/successToast";
import { errorToast } from "../../../../components/Toast/errorToast";
import {
  genderData,
  maritialStatusData,
  salutationData,
} from "../../../../mockData";
import CustomSelect from "../../../../components/Form/CustomSelect";
import CustomInput from "../../../../components/Form/CustomInput";
import CustomRadioGroup from "../../../../components/Form/CustomRadioGroup";
import CustomFileInput from "../../../../components/Form/CustomFileInput";

const AddEmployee = () => {
  const initialValues = {
    salutation: "",
    name: "",
    contact: "",
    email: "",
    dob: "",
    password: "",
    // probation_end_date: "",
    employment_type_id: "",
    joining_date: "",
    reporting_to: "",
    department_id: "",
    designation_id: "",
    // shift_id: "",
    gender: "",
    maritial_status: "",
    address: "",
    state: "",
    city: "",
    pincode: "",
    notice_start_date: "",
    notice_end_date: "",
    // skill: "",
    photo: null,
    role_id: "",
    bank_name: "",
    account_no: "",
    ifsc_code: "",
    branch_name: "",
  };

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [metaData, setMetaData] = useState({
    departments: [],
    designations: [],
    filteredDesignations: [],
    employeeType: [],
    employeeList: [],
    employeeRoleList: [],
  });

  const validationSchema = Yup.object().shape({
    salutation: Yup.string().required("Salutation is required"),
    name: Yup.string().required("Name is required"),
    gender: Yup.string().required("Gender is required"),
    address: Yup.string().required("Address is required"),
    dob: Yup.date()
      .required("Date of Birth is required")
      .typeError("Invalid Date of Birth"),
    employment_type_id: Yup.string().required("Employment Type is required"),
    joining_date: Yup.string().required("Joining date is required"),
    reporting_to: Yup.string().required("Reporting to is required"),
    contact: Yup.string()
      .required("Mobile number is required")
      .matches(/^[0-9]{10}$/, "Enter a valid 10-digit mobile number"),
    email: Yup.string()
      .required("Email is required")
      .email("Enter a valid email address"),
    department_id: Yup.string().required("Department is required"),
    designation_id: Yup.string().required("Designation is required"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 6 characters long"),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
    pincode: Yup.string()
      .required("Pincode is required")
      .matches(/^\d{6}$/, "Enter a valid 6-digit pincode"),
    bank_name: Yup.string().required("Bank name is required"),
    account_no: Yup.string()
      .min(11, "Account number should be 11 digits")
      .required("Account number is required")
      .matches(/^[0-9]+$/, "Account number must be numeric"),
    ifsc_code: Yup.string().required("IFSC code is required"),
    branch_name: Yup.string().required("Warehouse name is required"),
  });

  const onSubmit = async (values, { resetForm }) => {
    try {
      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        const value = values[key];
        if (value !== "" && value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });

      const res = await api.post("/api/v1/admin/employee", formData);
      successToast(res.data.message || "Employee added successfully");
      resetForm();
      navigate("/employee-list");
    } catch (err) {
      console.error("Error adding employee:", err);
      errorToast(err.response?.data?.message || "Failed to add employee");
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

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [deptRes, desigRes, empTypeRes, empListRes, roleRes] =
          await Promise.all([
            api.get("/api/v1/admin/department"),
            api.get("/api/v1/admin/designation/active"),
            api.get("/api/v1/admin/employmentType"),
            api.get("/api/v1/admin/employee"),
            api.get("/api/v1/admin/role/active"),
          ]);

        setMetaData({
          departments: deptRes.data.filter((d) => d.isActive),
          designations: desigRes.data.filter((d) => d.isActive),
          filteredDesignations: [],
          employeeType: empTypeRes.data.filter((t) => t.isActive),
          employeeList: empListRes.data.data.filter((e) => e.isActive),
          employeeRoleList: roleRes.data,
        });
      } catch (error) {
        errorToast("Error loading data");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // Department-wise designation filter
  useEffect(() => {
    if (values.department_id) {
      const filtered = metaData.designations.filter(
        (desig) => desig.department_id.toString() === values.department_id
      );
      setMetaData((prev) => ({ ...prev, filteredDesignations: filtered }));
      setFieldValue("designation_id", ""); // reset on department change
    }
  }, [values.department_id, metaData.designations]);

  const today = new Date();
  today.setFullYear(today.getFullYear() - 18);
  const maxDOB = today.toISOString().split("T")[0];

  if (loading) {
    return (
      <div className="loader-div">
        <Spinner animation="border" className="spinner" />
      </div>
    );
  }

  return (
    <>
      <Card>
        <Card.Header>
          <h5 className="mb-0">Personal Details</h5>
        </Card.Header>
        <hr />
        <Card.Body className="pt-0">
          <Form onSubmit={handleSubmit}>
            {/* Basic Info */}
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

            {/* Contact Info */}
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

            {/* DOB / Gender / Marital */}
            <Row className="mt-3">
              <Col md={4}>
                <CustomInput
                  type="date"
                  label="DOB"
                  name="dob"
                  value={values.dob}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  touched={touched.dob}
                  errors={errors.dob}
                  max={maxDOB}
                  required
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
              <Col md={4}>
                <CustomSelect
                  label="Marital Status"
                  name="maritial_status"
                  value={values.maritial_status}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  options={maritialStatusData}
                  placeholder="--"
                  error={errors.maritial_status}
                  touched={touched.maritial_status}
                />
              </Col>
            </Row>

            {/* Address */}
            <Row className="mt-3">
              <Col md={12}>
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
                />
              </Col>
            </Row>

            {/* City / State / Pincode */}
            <Row className="mt-3 mb-4">
              <Col md={4}>
                <CustomInput
                  label="Pincode"
                  name="pincode"
                  value={values.pincode}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  touched={touched.pincode}
                  errors={errors.pincode}
                  required
                />
              </Col>
              <Col md={4}>
                <CustomInput
                  label="City"
                  name="city"
                  value={values.city}
                  onChange={handleChange}
                  onBlur={handleBlur}
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
                  touched={touched.state}
                  errors={errors.state}
                  required
                />
              </Col>
            </Row>

            {/* Role / Photo */}
            <Row className="mt-3 mb-4">
              <Col md={4}>
                <CustomSelect
                  label="Role"
                  name="role_id"
                  value={values.role_id}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  options={metaData.employeeRoleList}
                  placeholder="--"
                  error={errors.role_id}
                  touched={touched.role_id}
                  required
                />
              </Col>
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
            </Row>

            <hr />
            <Card.Header className="p-0 pb-2">
              <h5 className="mb-0">Job Details</h5>
            </Card.Header>

            {/* Job Info */}
            <Row className="mt-3">
              <Col md={4}>
                <CustomSelect
                  label="Employment Type"
                  name="employment_type_id"
                  value={values.employment_type_id}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  options={metaData.employeeType}
                  placeholder="--"
                  error={errors.employment_type_id}
                  touched={touched.employment_type_id}
                  required
                  lableName="emp_type"
                />
              </Col>
              <Col md={4}>
                <CustomInput
                  type="date"
                  label="Joining Date"
                  name="joining_date"
                  value={values.joining_date}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  touched={touched.joining_date}
                  errors={errors.joining_date}
                  required
                />
              </Col>
            </Row>

            {/* Department / Designation */}
            <Row className="mt-3 mb-4">
              <Col md={4}>
                <CustomSelect
                  label="Reporting To"
                  name="reporting_to"
                  value={values.reporting_to}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  options={metaData.employeeList}
                  placeholder="--"
                  error={errors.reporting_to}
                  touched={touched.reporting_to}
                  required
                />
              </Col>

              <Col md={4}>
                <CustomSelect
                  label="Department"
                  name="department_id"
                  value={values.department_id}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  options={metaData.departments}
                  placeholder="--"
                  error={errors.department_id}
                  touched={touched.department_id}
                  required
                />
              </Col>

              <Col md={4}>
                <CustomSelect
                  label="Designation"
                  name="designation_id"
                  value={values.designation_id}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  options={metaData.filteredDesignations}
                  placeholder="-- Select Designation --"
                  error={errors.designation_id}
                  touched={touched.designation_id}
                  required
                />
              </Col>
            </Row>

            {/* Notice Period */}
            <Row className="mt-3">
              <Col md={4}>
                <CustomInput
                  type="date"
                  label="Notice Start Date"
                  name="notice_start_date"
                  value={values.notice_start_date}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  touched={touched.notice_start_date}
                  errors={errors.notice_start_date}
                />
              </Col>
              <Col md={4}>
                <CustomInput
                  type="date"
                  label="Notice End Date"
                  name="notice_end_date"
                  value={values.notice_end_date}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  touched={touched.notice_end_date}
                  errors={errors.notice_end_date}
                />
              </Col>
            </Row>

            <hr />
            <Card.Header className="p-0 pb-2">
              <h5 className="mb-0">Bank Details</h5>
            </Card.Header>

            {/* Bank Info */}
            <Row className="mt-3">
              <Col md={4}>
                <CustomInput
                  label="Bank Name"
                  name="bank_name"
                  value={values.bank_name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  touched={touched.bank_name}
                  errors={errors.bank_name}
                  required
                />
              </Col>
              <Col md={4}>
                <CustomInput
                  label="Account No"
                  name="account_no"
                  value={values.account_no}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  touched={touched.account_no}
                  errors={errors.account_no}
                  required
                />
              </Col>
              <Col md={4}>
                <CustomInput
                  label="IFSC Code"
                  name="ifsc_code"
                  value={values.ifsc_code}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  touched={touched.ifsc_code}
                  errors={errors.ifsc_code}
                  required
                />
              </Col>
            </Row>

            <Row className="mt-3">
              <Col md={4}>
                <CustomInput
                  label="Warehouse Name"
                  name="branch_name"
                  value={values.branch_name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  touched={touched.branch_name}
                  errors={errors.branch_name}
                  required
                />
              </Col>
            </Row>

            <div className="mt-4 text-end">
              <Button type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
};

export default AddEmployee;
