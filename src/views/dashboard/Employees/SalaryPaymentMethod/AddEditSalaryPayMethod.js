import React, { useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../../../api/axios";

const AddEditSalaryPayMethod = ({ show, handleClose, onSave, editData }) => {
  const formik = useFormik({
    initialValues: {
      salary_payment_method: "",
      isActive: true,
    },
    validationSchema: Yup.object({
      salary_payment_method: Yup.string().required(
        "Payment Method is required"
      ),
    }),
    onSubmit: async (values) => {
      try {
        let response;
        if (editData) {
          response = await api.put(
            `/api/v1/admin/salaryPaymentMethod/${editData.id}`,
            values
          );
        } else {
          response = await api.post(
            `/api/v1/admin/salaryPaymentMethod`,
            values
          );
        }
        onSave(response.data.data || response.data);
        handleClose();
      } catch (err) {
        console.error("Error saving payment method:", err);
        alert("Failed to save payment method.");
      }
    },
  });

  useEffect(() => {
    if (editData) formik.setValues(editData);
    else formik.resetForm();
  }, [editData, show]);

  return (
    <Modal show={show} onHide={handleClose} size="md" backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>
          {editData ? "Edit Payment Method" : "Add Payment Method"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>
              Payment Method <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="salary_payment_method"
              value={formik.values.salary_payment_method}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={
                formik.touched.salary_payment_method &&
                !!formik.errors.salary_payment_method
              }
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.salary_payment_method}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="Active"
              name="isActive"
              checked={formik.values.isActive}
              onChange={(e) =>
                formik.setFieldValue("isActive", e.target.checked)
              }
            />
          </Form.Group>

          <div className="text-end">
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

export default AddEditSalaryPayMethod;
