import React from "react";
import { Col, Form, Row } from "react-bootstrap";
import CustomInput from "../../../../../components/Form/CustomInput";
import CustomSelect from "../../../../../components/Form/CustomSelect";

// Created by: Sufyan 30 Sep 2025
const AddSupplierOther = ({ formik, metaData }) => {
  return (
    <Form>
      <div className="mb-3 mt-3 fw-light">
        <h6>Other Details: </h6>
      </div>
      {/* Row 1: gst_treatment_id, source_of_supply, pan */}
      <Row>
        <Col md={4}>
          <CustomSelect
            label="GST Treatment"
            name="GST_treatment_id"
            value={formik.values.GST_treatment_id}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            options={metaData.gstTreatment}
            placeholder="--"
            error={formik.errors.GST_treatment_id}
            touched={formik.touched.GST_treatment_id}
            required={true}
            lableName="GST_name"
            lableKey="id"
          />
        </Col>
        <Col md={4}>
          <CustomInput
            label="Source of Supply"
            name="source_of_supply"
            value={formik.values.source_of_supply}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter source of supply"
            touched={formik.touched.source_of_supply}
            errors={formik.errors.source_of_supply}
            required={true}
          />
        </Col>
        <Col md={4}>
          <CustomInput
            label="PAN No:"
            name="pan"
            value={formik.values.pan}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter PAN"
            touched={formik.touched.pan}
            errors={formik.errors.pan}
            required={true}
          />
        </Col>
      </Row>

      {/* Row 2: opening_balance, payment_term_id, tds_id */}
      <Row className="mt-3">
        <Col md={4}>
          <CustomInput
            label="Opening Balance"
            name="opening_balance"
            value={formik.values.opening_balance}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter opening balance"
            touched={formik.touched.opening_balance}
            errors={formik.errors.opening_balance}
            required={true}
          />
        </Col>
        <Col md={4}>
          <CustomSelect
            label="Payment Term"
            name="payment_term_id"
            value={formik.values.payment_term_id}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            options={metaData.paymentTerm}
            placeholder="--"
            error={formik.errors.payment_term_id}
            touched={formik.touched.payment_term_id}
            required={true}
            lableName="payment_term"
            lableKey="id"
          />
        </Col>
        <Col md={4}>
          <CustomSelect
            label="TDS"
            name="TDS_id"
            value={formik.values.TDS_id}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            options={metaData.tds}
            placeholder="--"
            error={formik.errors.TDS_id}
            touched={formik.touched.TDS_id}
            required={true}
            lableName="name"
            lableKey="id"
          />
        </Col>
      </Row>

      {/* Row 3: gst, document */}
      <Row className="mt-3">
        <Col md={4}>
          <CustomInput
            label="GST No:"
            name="gst"
            value={formik.values.gst}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter GST"
            touched={formik.touched.gst}
            errors={formik.errors.gst}
          />
        </Col>
        <Col md={4}>
          <CustomInput
            type="file"
            label="document"
            name="document"
            onChange={(e) =>
              formik.setFieldValue("document", e.target.files[0])
            }
            onBlur={formik.handleBlur}
            touched={formik.touched.document}
            errors={formik.errors.document}
          />
        </Col>
      </Row>
    </Form>
  );
};

export default AddSupplierOther;
