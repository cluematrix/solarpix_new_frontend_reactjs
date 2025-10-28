import React, { useState } from "react";
import { Col, Form, Row, Button, FormCheck } from "react-bootstrap";
import CustomInput from "../../../../../components/Form/CustomInput";

// Created by: Sufyan 30 Sep 2025
const AddSupplierAddress = ({ formik }) => {
  const [copyBillingToShipping, setCopyBillingToShipping] = useState(false);

  const handleCopyBillingToShipping = (e) => {
    const checked = e.target.checked;
    setCopyBillingToShipping(checked);

    if (checked) {
      // Copy billing - shipping
      formik?.setFieldValue("shipping_address", formik?.values.billing_address);
      formik?.setFieldValue("shipping_city", formik?.values.billing_city);
      formik?.setFieldValue("shipping_state", formik?.values.billing_state);
      formik?.setFieldValue("shipping_pincode", formik?.values.billing_pincode);
      formik?.setFieldValue("shipping_phone", formik?.values.billing_phone);
    } else {
      // Clear shipping fields when unchecked
      formik?.setFieldValue("shipping_address", "");
      formik?.setFieldValue("shipping_city", "");
      formik?.setFieldValue("shipping_state", "");
      formik?.setFieldValue("shipping_pincode", "");
      formik?.setFieldValue("shipping_phone", "");
    }
  };
  return (
    <Form>
      <Row className="mt-5">
        {/* Billing Address - Left */}
        <Col md={6}>
          <CustomInput
            label="Billing Address"
            name="billing_address"
            as="textarea"
            value={formik?.values.billing_address}
            onChange={formik?.handleChange}
            onBlur={formik?.handleBlur}
            placeholder="Enter Billing Address"
            touched={formik?.touched.billing_address}
            errors={formik?.errors.billing_address}
            required
            row={2}
          />

          <CustomInput
            label="Billing City"
            name="billing_city"
            value={formik?.values.billing_city}
            onChange={formik?.handleChange}
            onBlur={formik?.handleBlur}
            placeholder="Enter Billing City"
            touched={formik?.touched.billing_city}
            errors={formik?.errors.billing_city}
            required
            className="mt-3"
          />

          <CustomInput
            label="Billing State"
            name="billing_state"
            value={formik?.values.billing_state}
            onChange={formik?.handleChange}
            onBlur={formik?.handleBlur}
            placeholder="Enter Billing State"
            touched={formik?.touched.billing_state}
            errors={formik?.errors.billing_state}
            required
            className="mt-3"
          />

          <CustomInput
            label="Billing Pin Code"
            name="billing_pincode"
            value={formik?.values.billing_pincode}
            onChange={formik?.handleChange}
            onBlur={formik?.handleBlur}
            placeholder="Enter Billing Pin Code"
            touched={formik?.touched.billing_pincode}
            errors={formik?.errors.billing_pincode}
            required
            className="mt-3"
          />

          <CustomInput
            label="Billing Phone"
            name="billing_phone"
            value={formik?.values.billing_phone}
            onChange={formik?.handleChange}
            onBlur={formik?.handleBlur}
            placeholder="Enter Billing Phone"
            touched={formik?.touched.billing_phone}
            errors={formik?.errors.billing_phone}
            required
            className="mt-3"
          />
        </Col>

        {/* Shipping Address - Right */}
        <Col md={6} style={{ marginTop: "-25px" }}>
          <FormCheck
            type="checkbox"
            label="Same as Billing Address"
            checked={copyBillingToShipping}
            onChange={handleCopyBillingToShipping}
          />

          <CustomInput
            label="Shipping Address"
            name="shipping_address"
            as="textarea"
            value={formik?.values.shipping_address}
            onChange={formik?.handleChange}
            onBlur={formik?.handleBlur}
            placeholder="Enter Shipping Address"
            touched={formik?.touched.shipping_address}
            errors={formik?.errors.shipping_address}
            required
            row={2}
            disabled={copyBillingToShipping}
          />

          <CustomInput
            label="Shipping City"
            name="shipping_city"
            value={formik?.values.shipping_city}
            onChange={formik?.handleChange}
            onBlur={formik?.handleBlur}
            placeholder="Enter Shipping City"
            touched={formik?.touched.shipping_city}
            errors={formik?.errors.shipping_city}
            required
            disabled={copyBillingToShipping}
            className="mt-3"
          />

          <CustomInput
            label="Shipping State"
            name="shipping_state"
            value={formik?.values.shipping_state}
            onChange={formik?.handleChange}
            onBlur={formik?.handleBlur}
            placeholder="Enter Shipping State"
            touched={formik?.touched.shipping_state}
            errors={formik?.errors.shipping_state}
            required
            disabled={copyBillingToShipping}
            className="mt-3"
          />

          <CustomInput
            label="Shipping Pin Code"
            name="shipping_pincode"
            value={formik?.values.shipping_pincode}
            onChange={formik?.handleChange}
            onBlur={formik?.handleBlur}
            placeholder="Enter Shipping Pin Code"
            touched={formik?.touched.shipping_pincode}
            errors={formik?.errors.shipping_pincode}
            required
            disabled={copyBillingToShipping}
            className="mt-3"
          />

          <CustomInput
            label="Shipping Phone"
            name="shipping_phone"
            value={formik?.values.shipping_phone}
            onChange={formik?.handleChange}
            onBlur={formik?.handleBlur}
            placeholder="Enter Shipping Phone"
            touched={formik?.touched.shipping_phone}
            errors={formik?.errors.shipping_phone}
            required
            disabled={copyBillingToShipping}
            className="mt-3"
          />
        </Col>
      </Row>
    </Form>
  );
};

export default AddSupplierAddress;
