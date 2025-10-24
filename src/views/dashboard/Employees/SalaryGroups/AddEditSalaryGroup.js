import React, { useEffect, useState } from "react";
import { Modal, Form, Button, Row, Col, Spinner, Card } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../../../api/axios";

const AddEditSalaryGroup = ({ show, handleClose, onSave, editData }) => {
  const [components, setComponents] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch components & employees
  const fetchData = async () => {
    try {
      setLoading(true);
      const [compRes, empRes] = await Promise.all([
        api.get("/api/v1/admin/addSalaryComponent/active"),
        api.get("/api/v1/admin/employee/active"),
      ]);
      setComponents(Array.isArray(compRes.data.data) ? compRes.data.data : []);
      setEmployees(Array.isArray(empRes.data.data) ? empRes.data.data : []);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch components or employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (show) fetchData();
  }, [show]);

  const formik = useFormik({
    initialValues: {
      name: "",
      component_ids: [],
      employee_ids: [],
      isActive: true,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Group name is required"),
      component_ids: Yup.array().min(1, "Select at least one component"),
      employee_ids: Yup.array().min(1, "Select at least one employee"),
    }),
    onSubmit: async (values) => {
      try {
        const payload = {
          name: values.name,
          component_ids: values.component_ids,
          employee_ids: values.employee_ids,
          isActive: values.isActive,
        };
        let response;
        if (editData) {
          response = await api.put(
            `/api/v1/admin/salaryGroup/${editData.id}`,
            payload
          );
        } else {
          response = await api.post(`/api/v1/admin/salaryGroup`, payload);
        }
        onSave(response.data.data || response.data);
        handleClose();
      } catch (err) {
        console.error("Error saving salary group:", err);
        alert("Failed to save salary group");
      }
    },
  });

  useEffect(() => {
    if (editData) {
      formik.setValues({
        name: editData.name || "",
        component_ids: editData.components?.map((c) => c.id) || [],
        employee_ids: editData.employees?.map((e) => e.id) || [],
        isActive: editData.isActive || true,
      });
    } else {
      formik.resetForm();
    }
  }, [editData, show]);

  const toggleComponent = (id) => {
    const selected = formik.values.component_ids.includes(id)
      ? formik.values.component_ids.filter((c) => c !== id)
      : [...formik.values.component_ids, id];
    formik.setFieldValue("component_ids", selected);
  };

  const toggleEmployee = (id) => {
    const selected = formik.values.employee_ids.includes(id)
      ? formik.values.employee_ids.filter((e) => e !== id)
      : [...formik.values.employee_ids, id];
    formik.setFieldValue("employee_ids", selected);
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>
          {editData ? "Edit Salary Group" : "Add Salary Group"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" />
          </div>
        ) : (
          <Form onSubmit={formik.handleSubmit}>
            {/* Group Name */}
            <Form.Group className="mb-3">
              <Form.Label>
                Group Name <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.name && !!formik.errors.name}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.name}
              </Form.Control.Feedback>
            </Form.Group>

            <Row>
              {/* Salary Components */}
              <Col md={6}>
                <Form.Label>
                  Salary Components <span className="text-danger">*</span>
                </Form.Label>
                <Card
                  className="p-2"
                  style={{
                    maxHeight: "200px",
                    overflowY: "auto",
                    border: "1px solid #ced4da",
                  }}
                >
                  {components.map((c) => (
                    <Form.Check
                      key={c.id}
                      type="checkbox"
                      id={`comp-${c.id}`}
                      label={`${c.salary_components}`}
                      checked={formik.values.component_ids.includes(c.id)}
                      onChange={() => toggleComponent(c.id)}
                    />
                  ))}
                  {formik.touched.component_ids &&
                    formik.errors.component_ids && (
                      <div className="text-danger mt-1">
                        {formik.errors.component_ids}
                      </div>
                    )}
                </Card>
              </Col>

              {/* Employees */}
              <Col md={6}>
                <Form.Label>
                  Employees <span className="text-danger">*</span>
                </Form.Label>
                <Card
                  className="p-2"
                  style={{
                    maxHeight: "200px",
                    overflowY: "auto",
                    border: "1px solid #ced4da",
                  }}
                >
                  {employees.map((e) => (
                    <Form.Check
                      key={e.id}
                      type="checkbox"
                      id={`emp-${e.id}`}
                      label={`${e.name}`}
                      checked={formik.values.employee_ids.includes(e.id)}
                      onChange={() => toggleEmployee(e.id)}
                    />
                  ))}
                  {formik.touched.employee_ids &&
                    formik.errors.employee_ids && (
                      <div className="text-danger mt-1">
                        {formik.errors.employee_ids}
                      </div>
                    )}
                </Card>
              </Col>
            </Row>

            <Form.Group className="mt-3 mb-3">
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
              <Button type="submit" variant="primary">
                Save
              </Button>
            </div>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default AddEditSalaryGroup;
