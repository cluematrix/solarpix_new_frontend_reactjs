import React from "react";
import { Col, Form, Row } from "react-bootstrap";
import CustomInput from "../../../../../components/Form/CustomInput";
import CustomFileInput from "../../../../../components/Form/CustomFileInput";

const AddProjectMetering = ({ formik }) => {
  return (
    <Form>
      <div className="mb-3 mt-3 fw-light">
        <h6>Metering Information: </h6>
      </div>
      {/* Row 1 {net_metering_app_id, net_metering_app_date, net_metering_sanction_letter} */}
      <Row>
        <Col md={4}>
          <CustomInput
            label="Net Metering App Id"
            name="net_metering_app_id"
            value={formik.values.net_metering_app_id}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter Consumer No"
            touched={formik.touched.net_metering_app_id}
            errors={formik.errors.net_metering_app_id}
          />
        </Col>

        <Col md={4}>
          <CustomInput
            label="Net Metering App Date"
            name="net_metering_app_date"
            value={formik.values.net_metering_app_date}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter Phone"
            touched={formik.touched.net_metering_app_date}
            errors={formik.errors.net_metering_app_date}
          />
        </Col>
        <Col md={4}>
          <CustomFileInput
            label="Net Metering Sanction Letter"
            name="net_metering_sanction_letter"
            accept="image/*"
            onChange={(e) =>
              formik.setFieldValue(
                "net_metering_sanction_letter",
                e.currentTarget.files[0]
              )
            }
            onBlur={formik.handleBlur}
            touched={formik.touched.photo}
            error={formik.errors.photo}
          />
        </Col>
      </Row>
    </Form>
  );
};

export default AddProjectMetering;
