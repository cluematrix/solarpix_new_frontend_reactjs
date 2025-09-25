import React from "react";
import { Col, Form, Row } from "react-bootstrap";
import CustomInput from "../../../../../components/Form/CustomInput";

const AddProjectNp = ({ formik }) => {
  return (
    <Form>
      <div className="mb-3 mt-3 fw-light">
        <h6>Nodal Point Information: </h6>
      </div>

      {/* Row 1 {np_ref_code, np_reg_no} */}
      <Row>
        <Col md={4}>
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

        <Col md={4}>
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
      </Row>

      {/* Row 2 {np_phone, np_email} */}
      <Row>
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
            label="Point Reg No"
            name="np_email"
            value={formik.values.np_email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter Email"
            touched={formik.touched.np_email}
            errors={formik.errors.np_email}
          />
        </Col>
      </Row>
    </Form>
  );
};

export default AddProjectNp;
