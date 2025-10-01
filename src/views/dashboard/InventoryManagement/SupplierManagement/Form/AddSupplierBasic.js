import React, { useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import CustomInput from "../../../../../components/Form/CustomInput";

// Created by: Sufyan 30 Sep 2025
const AddSupplierBasic = ({ formik }) => {
  const [isDisplayEdited, setIsDisplayEdited] = useState(false);

  return (
    <Form>
      <div className="mb-3 mt-3 fw-light">
        <h6>Basic Details: </h6>
      </div>
      {/* Row 1: salutation, name, company_name */}
      <Row>
        <Col md={4}>
          <CustomInput
            label="Salutation"
            name="salutation"
            value={formik.values.salutation}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter salutation (e.g., Mr/Mrs)"
            touched={formik.touched.salutation}
            errors={formik.errors.salutation}
          />
        </Col>
        <Col md={4}>
          <CustomInput
            label="Name"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter name"
            touched={formik.touched.name}
            errors={formik.errors.name}
            required={true}
          />
        </Col>
        <Col md={4}>
          <CustomInput
            label="Company Name"
            name="company_name"
            value={formik.values.company_name}
            onChange={(e) => {
              formik.handleChange(e);
              if (!isDisplayEdited) {
                formik.setFieldValue("display_name", e.target.value);
              }
            }}
            onBlur={formik.handleBlur}
            placeholder="Enter company name"
            touched={formik.touched.company_name}
            errors={formik.errors.company_name}
            required={true}
          />
        </Col>
      </Row>

      {/* Row 2: display_name, email, phone */}
      <Row className="mt-3">
        <Col md={4}>
          <CustomInput
            label="Display Name"
            name="display_name"
            value={formik.values.display_name}
            onChange={(e) => {
              if (formik.values.company_name.trim() === "") {
                return;
              }
              setIsDisplayEdited(true);
              formik.handleChange(e);
            }}
            onBlur={formik.handleBlur}
            placeholder="Enter display name"
            touched={formik.touched.display_name}
            errors={formik.errors.display_name}
            required={true}
            disabled={formik.values.company_name.trim() === ""}
            title={
              formik.values.company_name.trim() === "" &&
              "Fill company name first"
            }
          />
        </Col>
        <Col md={4}>
          <CustomInput
            label="Email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter email"
            touched={formik.touched.email}
            errors={formik.errors.email}
            required={true}
          />
        </Col>
        <Col md={4}>
          <CustomInput
            label="Mobile"
            name="phone"
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter mobile number"
            touched={formik.touched.phone}
            errors={formik.errors.phone}
            required={true}
          />
        </Col>
      </Row>
    </Form>
  );
};

export default AddSupplierBasic;
