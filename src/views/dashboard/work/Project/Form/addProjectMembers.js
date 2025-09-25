import React from "react";
import { Col, Form, Row } from "react-bootstrap";
import SelectWithModal from "../../../../../components/Form/SelectWithModal";
import CustomInput from "../../../../../components/Form/CustomInput";

const AddProjectMembers = ({ formik, employee, formData }) => {
  console.log("Employee List:", employee);
  return (
    <Form>
      <Row>
        <Col md={4}>
          <SelectWithModal
            label="Coordinate Members"
            formik={formik}
            formikField="co_ordinate"
            options={employee} // employee list
            optionLabel="name"
          />
        </Col>
        <Col md={4}>
          <SelectWithModal
            label="Structure Installer"
            formik={formik}
            formikField="structure_installer"
            options={employee}
            optionLabel="name"
          />
        </Col>
        <Col md={4}>
          <SelectWithModal
            label="Panel Wiring Installer"
            formik={formik}
            formikField="panel_wiring_installer"
            options={employee}
            optionLabel="name"
          />
        </Col>
      </Row>

      <Row className="d-flex align-items-end">
        <Col md={4}>
          <SelectWithModal
            label="SEPL Inspection By"
            formik={formik}
            formikField="sepl_inspection_by"
            options={employee}
            optionLabel="name"
          />
        </Col>
        <Col md={4}>
          <CustomInput
            type="date"
            label="SEPL Inspection Date"
            name="sepl_inspection_date"
            value={formik.values.sepl_inspection_date}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter Date"
            touched={formik.touched.sepl_inspection_date}
            errors={formik.errors.sepl_inspection_date}
          />
        </Col>
      </Row>

      <Row className="mt-3">
        <Col md={12}>
          <CustomInput
            as="textarea"
            label="SEPL Inspection Remarks"
            name="sepl_inspection_remarks"
            value={formik.values.sepl_inspection_remarks}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter Remarks"
            touched={formik.touched.sepl_inspection_remarks}
            errors={formik.errors.sepl_inspection_remarks}
          />
        </Col>
      </Row>
    </Form>
  );
};

export default AddProjectMembers;
