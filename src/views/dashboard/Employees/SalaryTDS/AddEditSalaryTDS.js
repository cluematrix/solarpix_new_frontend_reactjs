import React, { useEffect } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../../../api/axios";

const AddEditSalaryTDS = ({ show, handleClose, onSave, editData }) => {
  const formik = useFormik({
    initialValues: {
      annual_salary_from: "",
      annual_salary_upto: "",
      salary_percent: "",
    },
    validationSchema: Yup.object({
      annual_salary_from: Yup.number().required(
        "Annual Salary From is required"
      ),
      annual_salary_upto: Yup.number().required(
        "Annual Salary Upto is required"
      ),
      salary_percent: Yup.number().required("Salary Percent is required"),
    }),
    onSubmit: async (values) => {
      try {
        let response;
        if (editData) {
          response = await api.put(
            `/api/v1/admin/salaryTDS/${editData.id}`,
            values
          );
        } else {
          response = await api.post(`/api/v1/admin/salaryTDS`, values);
        }
        onSave(response.data.data || response.data);
        handleClose();
      } catch (err) {
        console.error("Error saving Salary TDS:", err);
        alert("Failed to save Salary TDS.");
      }
    },
  });

  // Prefill for edit
  useEffect(() => {
    if (editData) formik.setValues(editData);
    else formik.resetForm();
  }, [editData, show]);

  return (
    <Modal show={show} onHide={handleClose} size="md" backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>
          {editData ? "Edit Salary TDS" : "Add Salary TDS"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Row className="mt-2">
            <Col md={6}>
              <Form.Group>
                <Form.Label>
                  Annual Salary From <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="number"
                  name="annual_salary_from"
                  value={formik.values.annual_salary_from}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={
                    formik.touched.annual_salary_from &&
                    !!formik.errors.annual_salary_from
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.annual_salary_from}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>
                  Annual Salary Upto <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="number"
                  name="annual_salary_upto"
                  value={formik.values.annual_salary_upto}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={
                    formik.touched.annual_salary_upto &&
                    !!formik.errors.annual_salary_upto
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.annual_salary_upto}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mt-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>
                  Salary Percent (%) <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="number"
                  name="salary_percent"
                  value={formik.values.salary_percent}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={
                    formik.touched.salary_percent &&
                    !!formik.errors.salary_percent
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.salary_percent}
                </Form.Control.Feedback>
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

export default AddEditSalaryTDS;
