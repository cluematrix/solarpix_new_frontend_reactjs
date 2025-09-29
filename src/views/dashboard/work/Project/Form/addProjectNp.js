// Created by: Sufyan 26 Sep 2025

import React from "react";
import { Col, Form, Row } from "react-bootstrap";
import CustomInput from "../../../../../components/Form/CustomInput";
import { disbursementOptions } from "../../../../../mockData";
import CustomFileInput from "../../../../../components/Form/CustomFileInput";

const AddProjectNp = ({ formik }) => {
  return (
    <Form>
      <div className="mb-3 mt-3 fw-light">
        <h6>Nodal Point Information: </h6>
      </div>

      {/* Row 1 {np_ref_code, np_reg_no, disbursement} */}
      <Row>
        <Col md={4} className="h-100">
          <CustomInput
            label="Ref Code"
            name="np_ref_code"
            value={formik.values.np_ref_code}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter Ref code"
            touched={formik.touched.np_ref_code}
            errors={formik.errors.np_ref_code}
          />
        </Col>

        <Col md={4} className="h-100">
          <CustomInput
            label="Reg No"
            name="np_reg_no"
            value={formik.values.np_reg_no}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter Reg No"
            touched={formik.touched.np_reg_no}
            errors={formik.errors.np_reg_no}
          />
        </Col>
        <Col md={4} className="h-100 d-flex align-items-end">
          <div style={{ width: "100%" }}>
            <Form.Label>Disbursement</Form.Label>
            <Form.Select
              name="disbursement"
              value={formik.values?.disbursement}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="form-control"
            >
              {disbursementOptions?.map((status) => (
                <option key={status.name} value={status.name}>
                  {status.icon} {status.name}
                </option>
              ))}
            </Form.Select>
          </div>
        </Col>
      </Row>

      {/* Row 2 {np_phone, np_email, rts_doc_upload} */}
      <Row className="mt-3">
        <Col md={4}>
          <CustomInput
            label="Phone"
            name="np_phone"
            value={formik.values.np_phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter Phone"
            touched={formik.touched.np_phone}
            errors={formik.errors.np_phone}
          />
        </Col>

        <Col md={4}>
          <CustomInput
            label="Email"
            name="np_email"
            value={formik.values.np_email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter Email"
            touched={formik.touched.np_email}
            errors={formik.errors.np_email}
          />
        </Col>

        <Col md={4}>
          <CustomFileInput
            label="RTS Document Upload"
            name="rts_doc_upload"
            onChange={(e) =>
              formik.setFieldValue("rts_doc_upload", e.currentTarget.files[0])
            }
            onBlur={formik.handleBlur}
            touched={formik.touched.rts_doc_upload}
            error={formik.errors.rts_doc_upload}
          />
        </Col>
      </Row>
    </Form>
  );
};

export default AddProjectNp;
