import React, { useState, useEffect, Fragment } from "react";
import { Form, Button, Row, Col, Card, Spinner, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../../../../api/axios";
import * as Yup from "yup";
import { useFormik } from "formik";
import { successToast } from "../../../../components/Toast/successToast";
import { errorToast } from "../../../../components/Toast/errorToast";
import { genderData, maritialStatusData } from "../../../../mockData";
import CustomSelect from "../../../../components/Form/CustomSelect";
import CustomInput from "../../../../components/Form/CustomInput";
import CustomCheckbox from "../../../../components/Form/CustomCheckbox";

const AddProject = ({ formData, setShowMembersModal }) => {
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
    added_by: [],
  };

  const navigate = useNavigate();

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
    is_deadline: Yup.boolean(),
    // end_date: Yup.date().when("is_deadline", {
    //   is: false,
    //   then: Yup.date().required("End Date is required"),
    //   otherwise: Yup.date().nullable(),
    // }),
    project_category_id: Yup.string().nullable(),
    // added_by: Yup.string().required("Project Members is required"),
  });

  const onSubmit = async (values, { resetForm }) => {
    try {
      // const res = await api.post("/api/v1/admin/employee", values);
      // successToast(res.data.message || "Employee added successfully");
      successToast("Project added successfully");

      // setEmployee((prev)=> [...prev, res.data.data])
      // setMetaData({ employeeList: res.data.data });
      // setMetaData({ project: res.data.data });
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
    isSubmitting,
    setFieldValue,
  } = formik;

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [projectCatRes, clientRes, empListRes] = await Promise.all([
          api.get("/api/v1/admin/projectCategory"),
          api.get("/api/v1/admin/client"),
          api.get("/api/v1/admin/employee"),
        ]);
        console.log("Project Categories:", projectCatRes.data.data);
        setMetaData({
          projectCategory: projectCatRes.data.data.filter((d) => d.isActive),
          clientList: clientRes.data.filter((d) => d.isActive),
          employeeList: empListRes.data.data.filter((e) => e.isActive),
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
    if (formData?.projectMembers) {
      setFieldValue("added_by", formData.projectMembers);
    }
  }, [formData?.projectMembers, setFieldValue]);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }

  console.log(
    "typeof values.is_deadline:",
    typeof values.is_deadline,
    values.is_deadline
  );

  console.log("formik values:", values);
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
                />
              </Col>
            </Row>

            {/* Row 2, {start_date, end_date, is_deadline } */}
            <Row className="mt-3 d-flex align-items-center">
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
                />
              </Col>
              <Col md={4}>
                <CustomCheckbox
                  label="There is no project deadline"
                  name="is_deadline"
                  checked={!!values.is_deadline}
                  onChange={(e) => {
                    setFieldValue("is_deadline", e.target.checked); // always boolean
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
                  label="Client"
                  name="client_id"
                  value={values.client_id}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  options={maritialStatusData}
                  placeholder="--"
                  error={errors.client_id}
                  touched={touched.client_id}
                />
              </Col>
              <Col md={4}>
                <CustomInput
                  label="Project Budget"
                  name="project_budget"
                  value={values.project_budget}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="eg: 10000"
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
                  placeholder="eg: 100"
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
                    {formData?.projectMembers?.length > 0 ? (
                      formData?.projectMembers?.map((m) => (
                        <Badge bg="info" text="dark" className="me-2" key={m}>
                          {m}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-muted">No members selected</p>
                    )}
                  </div>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="mt-2"
                    onClick={() => setShowMembersModal(true)}
                  >
                    Select Members
                  </Button>
                </Form.Group>
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
                onClick={() => navigate("/project-list")}
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
