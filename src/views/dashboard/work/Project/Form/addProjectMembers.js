import React, { useState } from "react";
import { Badge, Button, Col, Form, Modal, Row } from "react-bootstrap";
import SelectWithModal from "../../../../../components/Form/SelectWithModal";

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

      <Row>
        <Col md={4}>
          <SelectWithModal
            label="SEPL Inspection By"
            formik={formik}
            formikField="sepl_inspection_by"
            options={employee}
            optionLabel="name"
          />
        </Col>
      </Row>
    </Form>
  );
};

export default AddProjectMembers;
