import React, { useEffect } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../../../api/axios";

const AddEditSalaryComponent = ({ show, handleClose, onSave, editData }) => {
  const formik = useFormik({
    initialValues: {
      salary_components: "",
      component_type: "Earnings",
      value_type: "Fixed",
      component_value_monthly: "",
      component_value_weekly: "",
      component_value_bi_weekly: "",
      component_value_semi_weekly: "",
    },
    validationSchema: Yup.object({
      salary_components: Yup.string().required("Salary Component is required"),
      component_type: Yup.string().required("Component Type is required"),
      value_type: Yup.string().required("Value Type is required"),
      component_value_monthly: Yup.number()
        .typeError("Must be a number")
        .required("Monthly value is required"),
    }),
    onSubmit: async (values) => {
      try {
        let response;
        if (editData) {
          response = await api.put(
            `/api/v1/admin/AddSalaryComponent/${editData.id}`,
            values
          );
        } else {
          response = await api.post(`/api/v1/admin/addSalaryComponent`, values);
        }
        onSave(response.data.data || response.data);
        handleClose();
      } catch (err) {
        console.error("Error saving component:", err);
        alert("Failed to save salary component.");
      }
    },
  });

  // Prefill for edit
  useEffect(() => {
    if (editData) formik.setValues(editData);
    else formik.resetForm();
  }, [editData, show]);

  // Auto calculate other values when monthly changes
  useEffect(() => {
    const monthly = parseFloat(formik.values.component_value_monthly || 0);
    if (!isNaN(monthly)) {
      formik.setFieldValue(
        "component_value_weekly",
        ((monthly / 12) * 2.8).toFixed(2)
      );
      formik.setFieldValue(
        "component_value_bi_weekly",
        ((monthly / 12) * 5.6).toFixed(2)
      );
      formik.setFieldValue(
        "component_value_semi_weekly",
        ((monthly / 12) * 6).toFixed(2)
      );
    }
  }, [formik.values.component_value_monthly]);

  return (
    <Modal show={show} onHide={handleClose} size="lg" backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>
          {editData ? "Edit Salary Component" : "Add Salary Component"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Row className="mt-2">
            <Col md={6}>
              <Form.Group>
                <Form.Label>
                  Salary Component <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="salary_components"
                  value={formik.values.salary_components}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={
                    formik.touched.salary_components &&
                    !!formik.errors.salary_components
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.salary_components}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>
                  Component Type <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  name="component_type"
                  value={formik.values.component_type}
                  onChange={formik.handleChange}
                >
                  <option value="Earnings">Earnings</option>
                  <option value="Deduction">Deduction</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mt-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>
                  Value Type <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  name="value_type"
                  value={formik.values.value_type}
                  onChange={formik.handleChange}
                >
                  <option value="Fixed">Fixed</option>
                  <option value="Variable">Variable</option>
                  <option value="CTC Percent">CTC Percent</option>
                  <option value="Basic Percent">Basic Percent</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>
                  Component Value (Monthly){" "}
                  <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="number"
                  name="component_value_monthly"
                  value={formik.values.component_value_monthly}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={
                    formik.touched.component_value_monthly &&
                    !!formik.errors.component_value_monthly
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.component_value_monthly}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mt-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Weekly</Form.Label>
                <Form.Control
                  type="number"
                  name="component_value_weekly"
                  value={formik.values.component_value_weekly}
                  readOnly
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Bi-Weekly</Form.Label>
                <Form.Control
                  type="number"
                  name="component_value_bi_weekly"
                  value={formik.values.component_value_bi_weekly}
                  readOnly
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Semi-Monthly</Form.Label>
                <Form.Control
                  type="number"
                  name="component_value_semi_weekly"
                  value={formik.values.component_value_semi_weekly}
                  readOnly
                />
              </Form.Group>
            </Col>
          </Row>

          <div className="text-end mt-4">
            <Button variant="secondary" onClick={handleClose} className="me-2">
              Close
            </Button>
            <Button type="submit" variant="primary">
              Save
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddEditSalaryComponent;
