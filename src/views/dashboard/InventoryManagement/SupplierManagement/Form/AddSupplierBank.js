import React from "react";
import { Col, Form, Row } from "react-bootstrap";
import CustomInput from "../../../../../components/Form/CustomInput";

// Created by: Sufyan 30 Sep 2025
const AddSupplierBank = ({ formik }) => {
  return (
    <Form>
      <div className="mb-3 mt-3 fw-light">
        <h6>Bank Details: </h6>
      </div>
      {/* Row 1: account_holder_name, bank_name, account_number */}
      <Row>
        <Col md={4}>
          <CustomInput
            label="Account Holder Name"
            name="account_holder_name"
            value={formik.values.account_holder_name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter Account Holder Name"
            touched={formik.touched.account_holder_name}
            errors={formik.errors.account_holder_name}
            required={true}
          />
        </Col>
        <Col md={4}>
          <CustomInput
            label="Bank Name"
            name="bank_name"
            value={formik.values.bank_name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter Bank Name"
            touched={formik.touched.bank_name}
            errors={formik.errors.bank_name}
            required={true}
          />
        </Col>
        <Col md={4}>
          <CustomInput
            type="number"
            label="Account Number"
            name="account_number"
            value={formik.values.account_number}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter Account Number"
            touched={formik.touched.account_number}
            errors={formik.errors.account_number}
            required={true}
          />
        </Col>
      </Row>

      {/* Row 2: IFSC_no, remark */}
      <Row className="mt-3">
        <Col md={4}>
          <CustomInput
            label="IFSC Code"
            name="IFSC_no"
            value={formik.values.IFSC_no}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter IFSC Code"
            touched={formik.touched.IFSC_no}
            errors={formik.errors.IFSC_no}
            required={true}
          />
        </Col>
        <Col md={4}>
          <CustomInput
            label="Remark"
            name="remark"
            as="textarea"
            value={formik.values.remark}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter remark"
            touched={formik.touched.remark}
            errors={formik.errors.remark}
            row={2}
          />
        </Col>
      </Row>
    </Form>
  );
};

export default AddSupplierBank;
