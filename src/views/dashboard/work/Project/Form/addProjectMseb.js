import React from "react";
import { Col, Form, Row } from "react-bootstrap";
import CustomInput from "../../../../../components/Form/CustomInput";

const AddProjectMseb = ({ formik }) => {
  return (
    <Form>
      <div className="mb-3 mt-3 fw-light">
        <h6>MSEB Information: </h6>
      </div>
      {/* Row 1 {mseb_consumer_no, mseb_phone, mseb_email} */}
      <Row>
        <Col md={4}>
          <CustomInput
            label="Consumer No"
            name="mseb_consumer_no"
            value={formik.values.mseb_consumer_no}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter Consumer No"
            touched={formik.touched.mseb_consumer_no}
            errors={formik.errors.mseb_consumer_no}
          />
        </Col>

        <Col md={4}>
          <CustomInput
            label="Phone"
            name="mseb_phone"
            value={formik.values.mseb_phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter Phone"
            touched={formik.touched.mseb_phone}
            errors={formik.errors.mseb_phone}
          />
        </Col>
        <Col md={4}>
          <CustomInput
            label="Email"
            name="mseb_email"
            value={formik.values.mseb_email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter Email"
            touched={formik.touched.mseb_email}
            errors={formik.errors.mseb_email}
          />
        </Col>
      </Row>

      {/* Row 2, { mseb_nsc, additional_load_id, additional_load_date} */}
      <Row className="mt-3 d-flex align-items-start">
        <Col md={4}>
          <CustomInput
            type="date"
            label="NSC Date"
            name="mseb_nsc"
            value={formik.values.mseb_nsc}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter End Date"
            touched={formik.touched.mseb_nsc}
            errors={formik.errors.mseb_nsc}
          />
        </Col>
        <Col md={4}>
          <CustomInput
            label="Additional Load Id"
            name="additional_load_id"
            value={formik.values.additional_load_id}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter Additional Load Id"
            touched={formik.touched.additional_load_id}
            errors={formik.errors.additional_load_id}
          />
        </Col>
        <Col md={4}>
          <CustomInput
            type="date"
            label="Additional Load Date"
            name="additional_load_date"
            value={formik.values.additional_load_date}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter Additional Load Date"
            touched={formik.touched.additional_load_date}
            errors={formik.errors.additional_load_date}
          />
        </Col>
      </Row>
    </Form>
  );
};

export default AddProjectMseb;
