// Created by: Sufyan 02 Sep 2025
import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Card, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../../../../api/axios";
import * as Yup from "yup";
import { useFormik } from "formik";
import { successToast } from "../../../../components/Toast/successToast";
import { errorToast } from "../../../../components/Toast/errorToast";
import CustomSelect from "../../../../components/Form/CustomSelect";
import CustomInput from "../../../../components/Form/CustomInput";
import CustomCheckbox from "../../../../components/Form/CustomCheckbox";

const AddProject = ({
  formData,
  setShowMembersModal,
  handleClose,
  selectedMemberNames,
}) => {
  const initialValues = {
    short_code: "",
    project_name: "",
    is_deadline: false,
    start_date: "",
    end_date: "",
    project_category_id: "",
    client_id: "",
    project_summary: "",
    project_budget: "",
    hour_estimate: "",
    assign_by: "",
    assign_to: [],
  };

  const navigate = useNavigate();
  console.log("formDataAddProject", formData);
  const [loading, setLoading] = useState(true);
  const [metaData, setMetaData] = useState({
    projectCategory: [],
    clientList: [],
    employeeList: [],
    project: [],
  });

  const validationSchema = Yup.object().shape({
    short_code: Yup.string().required("Short Code is required"),
    project_name: Yup.string().required("Project Name is required"),
    start_date: Yup.date().required("Start Date is required"),
    is_deadline: Yup.boolean().default(false),
    end_date: Yup.date()
      .nullable()
      .when("is_deadline", (is_deadline, schema) => {
        return !is_deadline
          ? schema
              .required("End Date is required")
              .min(
                Yup.ref("start_date"),
                "End Date cannot be before Start Date"
              )
          : schema.nullable(); // if is_deadline is true, end_date not required
      }),
    project_category_id: Yup.string().required("Project Category is required"),
    client_id: Yup.string().required("Customer is required"),
    project_summary: Yup.string().required("Project Summary is required"),
    project_budget: Yup.number()
      .typeError("Project Budget must be a number")
      .positive("Project Budget must be positive")
      .required("Project Budget is required"),
    hour_estimate: Yup.number()
      .typeError("Hour Estimate must be a number")
      .positive("Hour Estimate must be positive")
      .required("Hour Estimate is required"),
    assign_to: Yup.array()
      .min(1, "At least one project member must be selected")
      .required("Project Members are required"),
  });

  const onSubmit = async (values, { resetForm }) => {
    try {
      const res = await api.post("/api/v1/admin/project", values);
      successToast(res.data.message || "Project added successfully");

      setMetaData({ project: res.data.data });
      resetForm();
      handleClose();
      navigate("/project-list");
    } catch (err) {
      console.error("Error adding employee:", err);
      errorToast(err.response?.data?.message || "Failed to add project");
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
    isSubmitting,
    setFieldValue,
  } = formik;

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [projectCatRes, clientRes, empListRes, projectRes] =
          await Promise.all([
            api.get("/api/v1/admin/projectCategory"),
            api.get("/api/v1/admin/client"),
            api.get("/api/v1/admin/employee"),
            api.get("/api/v1/admin/project"),
          ]);
        setMetaData({
          projectCategory: projectCatRes.data.data.filter((d) => d.isActive),
          clientList: clientRes.data.data.filter((d) => d.isActive),
          employeeList: empListRes.data.data.filter((e) => e.isActive),
          project: projectRes.data.data.filter((e) => e.isActive),
          client: clientRes.data.data.filter((e) => e.isActive),
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

  useEffect(() => {
    const employee_id = String(sessionStorage.getItem("employee_id"));
    console.log("employee_id from sessionStorage", employee_id);
    console.log("values.assign_by", values.assign_by);
    if (formData?.projectMembers) {
      setFieldValue("assign_to", formData.projectMembers);
      setFieldValue("assign_by", employee_id);
    }
  }, [formData?.projectMembers, setFieldValue]);

  useEffect(() => {
    // After metaData.project is loaded
    if (metaData.project && metaData.project.length > 0) {
      // Get last short_code (assuming sorted by creation)
      const lastShortCode = metaData.project[metaData.project.length - 1];
      let lastId = lastShortCode.short_code || "SOLAR000";
      // Extract number part
      let num = parseInt(lastId.replace("SOLAR", ""), 10);
      // Increment and pad with zeros
      let nextId = "SOLAR" + String(num + 1).padStart(3, "0");
      formik.setFieldValue("short_code", nextId);
    } else {
      // First project
      formik.setFieldValue("short_code", "SOLAR001");
    }
  }, [metaData.project]);

  return (
    <>
      <Card>
        <Card.Body className="pt-0">
          <Form onSubmit={handleSubmit}>
            {/* Row 1 {short_code, project_name, project_category_id} */}
            <Row>
              <Col md={4}>
                <CustomInput
                  label="Short Code"
                  name="short_code"
                  value={values.short_code}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter Short Code"
                  touched={touched.short_code}
                  errors={errors.short_code}
                  required={true}
                  readOnly={true}
                />
              </Col>

              <Col md={4}>
                <CustomInput
                  label="Project Name"
                  name="project_name"
                  value={values.project_name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter Project Name"
                  touched={touched.project_name}
                  errors={errors.project_name}
                  required={true}
                />
              </Col>
              <Col md={4}>
                <CustomSelect
                  label="Project Category"
                  name="project_category_id"
                  value={values.project_category_id}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  options={metaData.projectCategory}
                  placeholder="--"
                  error={errors.project_category_id}
                  touched={touched.project_category_id}
                  lableName="category"
                  required={true}
                />
              </Col>
            </Row>

            {/* Row 2, {start_date, end_date, is_deadline } */}
            <Row className="mt-3 d-flex align-items-start">
              <Col md={4}>
                <CustomInput
                  type="date"
                  label="Start Date"
                  name="start_date"
                  value={values.start_date}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter Start Date"
                  touched={touched.start_date}
                  errors={errors.start_date}
                  required={true}
                  min={new Date().toISOString().split("T")[0]}
                />
              </Col>
              <Col md={4}>
                <CustomInput
                  type="date"
                  label="End Date"
                  name="end_date"
                  value={values.end_date}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter End Date"
                  touched={touched.end_date}
                  errors={errors.end_date}
                  required={true}
                  min={new Date().toISOString().split("T")[0]}
                  disabled={values.is_deadline ? true : false}
                />
              </Col>
              <Col md={4} className="mt-4">
                <CustomCheckbox
                  label="There is no project deadline"
                  name="is_deadline"
                  checked={!!values.is_deadline}
                  onChange={(e) => {
                    setFieldValue("is_deadline", e.target.checked); // always boolean
                    setFieldValue("end_date", "");
                  }}
                  onBlur={handleBlur}
                  error={errors.is_deadline}
                  touched={touched.is_deadline}
                />
              </Col>
            </Row>

            {/* Row 5  client_id, project_budget, hour_estimate*/}
            <Row className="mt-3">
              <Col md={4}>
                <CustomSelect
                  label="Customer"
                  name="client_id"
                  value={values.client_id}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  options={metaData.clientList}
                  placeholder="--"
                  error={errors.client_id}
                  touched={touched.client_id}
                  required={true}
                />
              </Col>
              <Col md={4}>
                <CustomInput
                  label="Project Budget"
                  name="project_budget"
                  value={values.project_budget}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="eg: ₹10000"
                  touched={touched.project_budget}
                  errors={errors.project_budget}
                  required={true}
                />
              </Col>
              <Col md={4}>
                <CustomInput
                  label="Hour Estimate"
                  name="hour_estimate"
                  value={values.hour_estimate}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="eg: ₹100"
                  touched={touched.hour_estimate}
                  errors={errors.hour_estimate}
                  required={true}
                />
              </Col>
            </Row>

            {/* Row 4 - Members */}
            <Row className="mt-2">
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="pt-4">Project Members</Form.Label>
                  <div>
                    {selectedMemberNames?.length > 0 ? (
                      selectedMemberNames?.map((m) => (
                        <Badge
                          bg="light"
                          text="dark"
                          className="me-2 p-1"
                          key={m}
                        >
                          {m}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-muted" style={{ fontSize: "13px" }}>
                        No members selected
                      </p>
                    )}
                  </div>
                  <Button
                    size="sm"
                    className="mt-2"
                    onClick={() => setShowMembersModal(true)}
                  >
                    Select Members
                  </Button>
                </Form.Group>
                {touched.assign_to && errors.assign_to && (
                  <div
                    className="text-danger mt-1"
                    style={{ fontSize: "11px" }}
                  >
                    {errors.assign_to}
                  </div>
                )}
              </Col>
            </Row>

            {/* Row 6 {project_summary}*/}
            <Row className="mt-3">
              <Col md={12}>
                <CustomInput
                  label="Project Summary"
                  name="project_summary"
                  as="textarea"
                  value={values.project_summary}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter Project Summary"
                  touched={touched.project_summary}
                  errors={errors.project_summary}
                  required={true}
                  row={2}
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
                onClick={handleClose}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      {/* <AddEmpBank /> */}
    </>
  );
};

export default AddProject;
