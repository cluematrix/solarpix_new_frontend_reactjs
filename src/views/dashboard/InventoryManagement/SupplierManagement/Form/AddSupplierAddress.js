import React from "react";
import { Col, Form, Row, Button } from "react-bootstrap";
import CustomInput from "../../../../../components/Form/CustomInput";

// Created by: Sufyan 30 Sep 2025
const AddSupplierAddress = ({ formik }) => {
  const copyBillingToShipping = () => {
    formik.setValues({
      ...formik.values,
      shipping_city: formik.values.billing_city,
      shipping_state: formik.values.billing_state,
      shipping_address: formik.values.billing_address,
      shipping_pincode: formik.values.billing_pincode,
      shipping_phone: formik.values.billing_phone,
    });
  };

  return (
    <Form>
      <div className="mb-3 mt-3 fw-light">
        <h6>Address: </h6>
      </div>

      {/* Billing Address Section */}
      <div className="mb-4">
        <h6 className="fw-light">Billing Address</h6>
        <Row>
          <Col md={4}>
            <CustomInput
              label="City"
              name="billing_city"
              value={formik.values.billing_city}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter billing city"
              touched={formik.touched.billing_city}
              errors={formik.errors.billing_city}
              required={true}
            />
          </Col>
          <Col md={4}>
            <CustomInput
              label="State"
              name="billing_state"
              value={formik.values.billing_state}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter billing state"
              touched={formik.touched.billing_state}
              errors={formik.errors.billing_state}
              required={true}
            />
          </Col>
          <Col md={4}>
            <CustomInput
              label="Address"
              name="billing_address"
              value={formik.values.billing_address}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter billing address"
              touched={formik.touched.billing_address}
              errors={formik.errors.billing_address}
              required={true}
            />
          </Col>
        </Row>
        <Row className="mt-3">
          <Col md={4}>
            <CustomInput
              label="Pincode"
              name="billing_pincode"
              value={formik.values.billing_pincode}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter billing pincode"
              touched={formik.touched.billing_pincode}
              errors={formik.errors.billing_pincode}
              required={true}
            />
          </Col>
          <Col md={4}>
            <CustomInput
              label="Phone"
              name="billing_phone"
              value={formik.values.billing_phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter billing phone"
              touched={formik.touched.billing_phone}
              errors={formik.errors.billing_phone}
              required={true}
            />
          </Col>
        </Row>
      </div>

      {/* Shipping Address Section */}
      <div className="mb-4">
        <h6 className="fw-light">Shipping Address</h6>
        <Row>
          <Col md={4}>
            <CustomInput
              label="City"
              name="shipping_city"
              value={formik.values.shipping_city}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter shipping city"
              touched={formik.touched.shipping_city}
              errors={formik.errors.shipping_city}
              required={true}
            />
          </Col>
          <Col md={4}>
            <CustomInput
              label="State"
              name="shipping_state"
              value={formik.values.shipping_state}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter shipping state"
              touched={formik.touched.shipping_state}
              errors={formik.errors.shipping_state}
              required={true}
            />
          </Col>
          <Col md={4}>
            <CustomInput
              label="Address"
              name="shipping_address"
              value={formik.values.shipping_address}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter shipping address"
              touched={formik.touched.shipping_address}
              errors={formik.errors.shipping_address}
              required={true}
            />
          </Col>
        </Row>
        <Row className="mt-3">
          <Col md={4}>
            <CustomInput
              label="Pincode"
              name="shipping_pincode"
              value={formik.values.shipping_pincode}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter shipping pincode"
              touched={formik.touched.shipping_pincode}
              errors={formik.errors.shipping_pincode}
              required={true}
            />
          </Col>
          <Col md={4}>
            <CustomInput
              label="Phone"
              name="shipping_phone"
              value={formik.values.shipping_phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter shipping phone"
              touched={formik.touched.shipping_phone}
              errors={formik.errors.shipping_phone}
              required={true}
            />
          </Col>
          <Col md={4} className="d-flex align-items-end">
            <Button variant="secondary" onClick={copyBillingToShipping}>
              Copy from Billing
            </Button>
          </Col>
        </Row>
      </div>
    </Form>
  );
};

export default AddSupplierAddress;
