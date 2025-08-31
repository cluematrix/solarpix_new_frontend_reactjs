import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Row, Col, Card, Spinner } from "react-bootstrap";
import * as Yup from "yup";
import api from "../../../../api/axios";
import { useNavigate, useParams } from "react-router-dom";
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

const UpdateEmployee = () => {
  const initialValues = {
    emp_id: "",
    salutation: "",
    name: "",
    email: "",
    password: "",
    contact: "",
    address: "",
    gender: "",
    dob: "",
    maritial_status: "",
    role_id: "1", // default
    department_id: "",
    designation_id: "",
    employment_type_id: "",
    skill: "",
    probation_end_date: "",
    city: "",
    state: "",
    pincode: "",
    joining_date: "",
    reporting_to: "",
    photo: null,
    notice_start_date: "",
    notice_end_date: "",
    shift_id: "",
  };

  const [loading, setLoading] = useState(true);
  const [metaData, setMetaData] = useState({
    departments: [],
    designations: [],
    shift: [],
    employeeType: [],
    employeeList: [],
  });

  const [employeeById, setEmployeeById] = useState([]);
  const { id } = useParams();

  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    emp_id: Yup.string().required("Employee ID is required"),
    salutation: Yup.string().required("Salutation is required"),
    name: Yup.string().required("Name is required"),
    gender: Yup.string().required("Gender is required"),
    address: Yup.string().required("Address is required"),
    dob: Yup.date()
      .required("Date of Birth is required")
      .typeError("Invalid Date of Birth"),
    probation_end_date: Yup.date()
      .required("Probation End Date is required")
      .typeError("Invalid date"),
    employment_type_id: Yup.string().required("Employment Type is required"),
    joining_date: Yup.string().required("Joining date is required"),
    reporting_to: Yup.string().required("Reporting date is required"),
    contact: Yup.string()
      .required("Mobile number is required")
      .matches(/^[0-9]{10}$/, "Enter a valid 10-digit mobile number"),
    email: Yup.string()
      .required("Email is required")
      .email("Enter a valid email address"),
    department_id: Yup.string().required("Department is required"),
    designation_id: Yup.string().required("Designation is required"),
    shift_id: Yup.string().required("Shift is required"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 6 characters long"),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
    pincode: Yup.string()
      .required("Pincode is required")
      .matches(/^\d{6}$/, "Enter a valid 6-digit pincode"),
  });

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [
          deptRes,
          desigRes,
          shiftRes,
          empTypeRes,
          empListRes,
          empByIdRes,
        ] = await Promise.all([
          api.get("/api/v1/admin/department"),
          api.get("/api/v1/admin/designation"),
          api.get("/api/v1/admin/shift"),
          api.get("/api/v1/admin/employmentType"),
          api.get("/api/v1/admin/employee"),
          api.get(`/api/v1/admin/employee/${id}`),
        ]);

        setMetaData({
          departments: deptRes.data.filter((d) => d.isActive),
          designations: desigRes.data.filter((d) => d.isActive),
          shift: shiftRes.data.filter((s) => s.isActive),
          employeeType: empTypeRes.data.filter((t) => t.isActive),
          employeeList: empListRes.data.data.filter((e) => e.isActive),
        });

        setEmployeeById(empByIdRes.data.data);
      } catch (error) {
        errorToast("Error loading data");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [id]);

  const onSubmit = async (values) => {
    try {
      const formData = new FormData();

      // Append keys dynamically
      Object.keys(values).forEach((key) => {
        const value = values[key];
        if (value !== "" && value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });

      const res = await api.put(`/api/v1/admin/employee/${id}`, formData);
      successToast(res.data.message);
      navigate("/employee-list");
    } catch (error) {
      errorToast(error.response?.data?.message || "Internal Server Error");
      console.error("Error updating employee:", error);
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
    setValues,
    isSubmitting,
  } = formik;

  // Create an object to map API data to Formik fields
  useEffect(() => {
    if (employeeById) {
      const updatedValues = { ...initialValues };
      Object.keys(updatedValues).forEach((key) => {
        updatedValues[key] = employeeById[key] || "";
      });
      setValues({
        ...updatedValues,
        notice_start_date: employeeById.notice_start_date
          ? employeeById.notice_start_date.split("T")[0]
          : "",
        notice_end_date: employeeById.notice_end_date
          ? employeeById.notice_end_date.split("T")[0]
          : "",
        probation_end_date: employeeById.probation_end_date
          ? employeeById.probation_end_date.split("T")[0]
          : "",
        joining_date: employeeById.joining_date
          ? employeeById.joining_date.split("T")[0]
          : "",
      });
    }
  }, [employeeById, setValues, setFieldValue]);

  const today = new Date();
  today.setFullYear(today.getFullYear() - 18);
  const maxDOB = today.toISOString().split("T")[0]; // Format YYYY-MM-DD

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
        <h5 className="mb-0">Account Details</h5>
      </Card.Header>
      <hr />
      <Card.Body className="pt-0">
        <Form onSubmit={handleSubmit}>
          {/* Row 1 {emp_id, salutation, name} */}
          <Row>
            <Col md={4}>
              <CustomInput
                label="Employee ID"
                name="emp_id"
                value={values.emp_id}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter Employee ID"
                touched={touched.emp_id}
                errors={errors.emp_id}
                required={true}
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
                required={true}
              />
            </Col>
          </Row>

          {/* Row 2, {mobile_number, email, password } */}
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
                required={true}
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
                required={true}
              />
            </Col>
            <Col md={4}>
              <CustomInput
                type="date"
                label="DOB"
                name="dob"
                value={values.dob}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter DOB"
                touched={touched.dob}
                errors={errors.dob}
                required={true}
                max={maxDOB}
              />
            </Col>
          </Row>

          {/* Row 3, {probation_end_date, employment_type_id, joining_date*/}
          <Row className="mt-3">
            <Col md={4}>
              <CustomInput
                type="date"
                label="Probation End Date"
                name="probation_end_date"
                value={values.probation_end_date}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter Probation End Date"
                touched={touched.probation_end_date}
                errors={errors.probation_end_date}
                required={true}
              />
            </Col>
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
                placeholder="Enter Joining Date"
                touched={touched.joining_date}
                errors={errors.joining_date}
                min={new Date().toISOString().split("T")[0]}
                required
              />
            </Col>
          </Row>

          {/* Row 4 {reporting_to, department_id, designation_id}*/}
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
                options={metaData.designations}
                placeholder="--"
                error={errors.designation_id}
                touched={touched.designation_id}
                required
              />
            </Col>
          </Row>

          <hr />
          <Card.Header className="p-0 pb-2">
            <h5 className="mb-0">Other Details</h5>
          </Card.Header>

          {/* Row 5 shift_id, gender, maritial_status*/}
          <Row className="mt-3">
            <Col md={4}>
              <CustomSelect
                label="Shift"
                name="shift_id"
                value={values.shift_id}
                onChange={handleChange}
                onBlur={handleBlur}
                options={metaData.shift}
                placeholder="--"
                error={errors.shift_id}
                touched={touched.shift_id}
                required
                lableName="shift_name"
                le
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

          {/* Row 6 {address, state, city}*/}
          <Row className="mt-3">
            <Col md={4}>
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
                required={true}
                row={1}
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
                required={true}
              />
            </Col>
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
                required={true}
              />
            </Col>
          </Row>

          {/* Row 7 {pincode, notice_start_date, notice_end_date}*/}
          <Row className="mt-3">
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
                required={true}
              />
            </Col>
            <Col md={4}>
              <CustomInput
                type="date"
                label="Notice Period Start Date"
                name="notice_start_date"
                value={values.notice_start_date}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter Notice Period Start Date"
                touched={touched.notice_start_date}
                errors={errors.notice_start_date}
                min={new Date().toISOString().split("T")[0]}
              />
            </Col>
            <Col md={4}>
              <CustomInput
                type="date"
                label="Notice Period End Date"
                name="notice_end_date"
                value={values.notice_end_date}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter Notice Period End Date"
                touched={touched.notice_end_date}
                errors={errors.notice_end_date}
                min={new Date().toISOString().split("T")[0]}
              />
            </Col>
          </Row>

          {/* Row 8 {photo, skill}*/}
          <Row className="mt-3">
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
              <CustomInput
                label="Skill"
                name="skill"
                value={values.skill}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter Skill"
                touched={touched.skill}
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
              onClick={() => navigate("/employee-list")}
            >
              Cancel
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default UpdateEmployee;
