import React from "react";
import { Col, Form, Row } from "react-bootstrap";
import CustomInput from "../../../../../components/Form/CustomInput";
import CustomSelect from "../../../../../components/Form/CustomSelect";
import CustomCheckbox from "../../../../../components/Form/CustomCheckbox";

const AddProjectInfo = ({ formik, metaData }) => {
  return (
    <Form>
      <div className="mb-3 mt-3 fw-light">
        <h6>Project Information: </h6>
      </div>
      {/* Row 1 {short_code, project_name, project_category_id} */}
      <Row>
        <Col md={4}>
          <CustomInput
            label="Short Code"
            name="short_code"
            value={formik.values.short_code}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Your Short Code"
            touched={formik.touched.short_code}
            errors={formik.errors.short_code}
            required={true}
            readOnly={true}
          />
        </Col>

        <Col md={4}>
          <CustomInput
            label="Project Name"
            name="project_name"
            value={formik.values.project_name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter Project Name"
            touched={formik.touched.project_name}
            errors={formik.errors.project_name}
            required={true}
          />
        </Col>
        <Col md={4}>
          <CustomSelect
            label="Project Category"
            name="project_category_id"
            value={formik.values.project_category_id}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            options={metaData.projectCategory}
            placeholder="--"
            error={formik.errors.project_category_id}
            touched={formik.touched.project_category_id}
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
            value={formik.values.start_date}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter Start Date"
            touched={formik.touched.start_date}
            errors={formik.errors.start_date}
            required={true}
            min={new Date().toISOString().split("T")[0]}
          />
        </Col>
        <Col md={4}>
          <CustomInput
            type="date"
            label="End Date"
            name="end_date"
            value={formik.values.end_date}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter End Date"
            touched={formik.touched.end_date}
            errors={formik.errors.end_date}
            required={true}
            min={new Date().toISOString().split("T")[0]}
            disabled={formik.values.is_deadline ? true : false}
          />
        </Col>
        <Col md={4} className="mt-4">
          <CustomCheckbox
            label="There is no project deadline"
            name="is_deadline"
            checked={!!formik.values.is_deadline}
            onChange={(e) => {
              formik.setFieldValue("is_deadline", e.target.checked); // always boolean
              formik.setFieldValue("end_date", "");
            }}
            onBlur={formik.handleBlur}
            error={formik.errors.is_deadline}
            touched={formik.touched.is_deadline}
          />
        </Col>
      </Row>

      {/* Row 5  client_id, estimate, project_remarks*/}
      <Row className="mt-3">
        <Col md={4}>
          <CustomSelect
            label="Customer"
            name="client_id"
            value={formik.values.client_id}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            options={metaData.clientList}
            placeholder="--"
            error={formik.errors.client_id}
            touched={formik.touched.client_id}
            required={true}
          />
        </Col>
        <Col md={4}>
          <CustomInput
            label="Estimate"
            name="estimate"
            value={formik.values.estimate}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="eg: ₹10000"
            touched={formik.touched.estimate}
            errors={formik.errors.estimate}
            required={true}
          />
        </Col>
      </Row>

      {/* Row 5 - project_remarks */}
      <Row className="mt-4">
        <Col md={12}>
          <CustomInput
            label="Project Remarks"
            name="project_remarks"
            as="textarea"
            value={formik.values.project_remarks}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter Project Summary"
            touched={formik.touched.project_remarks}
            errors={formik.errors.project_remarks}
            required={true}
            row={2}
          />
        </Col>
      </Row>
    </Form>
  );
};

export default AddProjectInfo;
