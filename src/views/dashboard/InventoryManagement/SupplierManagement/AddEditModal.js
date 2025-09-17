import React, { useState } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";
import CustomInput from "../../../../components/Form/CustomInput";
import CustomSelect from "../../../../components/Form/CustomSelect";

const AddEditModal = ({
  show,
  handleClose,
  onSave,
  modalTitle,
  buttonLabel,
  loading,
  formik,
  paymentTermData,
  isDisplayEdited,
  setIsDisplayEdited,
}) => {
  return (
    <Modal
      centered
      show={show}
      onHide={handleClose}
      backdrop="static"
      size="lg"
    >
      <Form onSubmit={onSave}>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* row 1 name, company_name, display_name */}
          <Row>
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
                placeholder="Enter Company Name"
                touched={formik.touched.company_name}
                errors={formik.errors.company_name}
                required
              />
            </Col>
            <Col md={4}>
              <CustomInput
                label="Display Company Name"
                name="display_name"
                value={formik.values.display_name}
                onChange={(e) => {
                  if (formik.values.company_name.trim() === "") {
                    return;
                  }
                  setIsDisplayEdited(true); // once edited, stop auto-sync
                  formik.handleChange(e);
                }}
                onBlur={formik.handleBlur}
                placeholder="Your Company Name"
                touched={formik.touched.display_name}
                errors={formik.errors.display_name}
                required
                disabled={formik.values.company_name.trim() === ""} //  disable until company_name filled
                title={
                  formik.values.company_name.trim() === "" &&
                  "Filled company name first"
                }
              />
            </Col>
          </Row>

          {/* row 2 email, phone, Address */}
          <Row className="mt-3">
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
                label="Phone Number"
                name="phone"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Company Name"
                touched={formik.touched.phone}
                errors={formik.errors.phone}
                required={true}
              />
            </Col>
            <Col md={4}>
              <CustomInput
                label="Address"
                name="Address"
                value={formik.values.Address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter address"
                touched={formik.touched.Address}
                errors={formik.errors.Address}
                required={true}
              />
            </Col>
          </Row>

          {/* row 3 GST, PAN, TDS */}
          <Row className="mt-3">
            <Col md={4}>
              <CustomInput
                label="GST Number"
                name="GST"
                value={formik.values.GST}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter gst number"
                touched={formik.touched.GST}
                errors={formik.errors.GST}
                required={true}
              />
            </Col>
            <Col md={4}>
              <CustomInput
                label="PAN"
                name="PAN"
                value={formik.values.PAN}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter pan number"
                touched={formik.touched.PAN}
                errors={formik.errors.PAN}
                required={true}
              />
            </Col>
            <Col md={4}>
              <CustomInput
                label="TDS"
                name="TDS"
                value={formik.values.TDS}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter TDS"
                touched={formik.touched.TDS}
                errors={formik.errors.TDS}
                required={true}
              />
            </Col>
          </Row>

          {/* row 3 payment_term_id, submit */}
          <Row className="mt-3">
            <Col md={4}>
              <CustomSelect
                label="Payment Terms"
                name="payment_term_id"
                value={formik.values.payment_term_id}
                options={paymentTermData}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="--"
                error={formik.errors.payment_term_id}
                touched={formik.touched.payment_term_id}
                required
                lableName="payment_term"
                lableKey="id"
              />
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button disabled={loading} variant="primary" type="submit">
            {loading ? "Saving..." : buttonLabel}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddEditModal;
