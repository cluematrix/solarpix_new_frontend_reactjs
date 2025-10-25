import React, { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import api from "../../../../api/axios";
import * as Yup from "yup";
import { Formik, Form as FormikForm, ErrorMessage } from "formik";

// Validation Schema
const leadValidationSchema = Yup.object().shape({
  lead_id: Yup.string().required("Lead is required"),
  message: Yup.string().required("Message is required"),
  followup_date: Yup.string().required("Date is required"),
  schedule_by_id: Yup.string().required("Schedule To is required"),
});

const AddEditModal = ({
  show,
  handleClose,
  onSave,
  formData,
  setFormData,
  editData,
  leads,
}) => {
  const [employees, setEmployees] = useState([]);
  const loggedInEmployeeId = sessionStorage.getItem("employee_id");

  // 🔹 Fetch active employees
  const fetchEmployees = async () => {
    try {
      const res = await api.get("/api/v1/admin/employee/active");
      if (Array.isArray(res.data?.data)) setEmployees(res.data.data);
    } catch (err) {
      console.error("Error fetching employees:", err);
    }
  };

  useEffect(() => {
    if (show) {
      fetchEmployees();

      if (!editData && !formData.followup_date) {
        const today = new Date().toISOString().slice(0, 16); // yyyy-MM-ddTHH:mm
        setFormData((prev) => ({ ...prev, followup_date: today }));
      }
    }
  }, [show, editData, formData.followup_date, setFormData]);

  const selectedLead = leads.find(
    (lead) => lead.id === parseInt(formData.lead_id)
  );

  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="md"
      centered
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {editData ? "Edit Follow Up" : "Add Follow Up"}
        </Modal.Title>
      </Modal.Header>

      <Formik
        initialValues={{
          ...formData,
          schedule_by_id: formData.schedule_by_id || loggedInEmployeeId || "",
        }}
        enableReinitialize
        validationSchema={leadValidationSchema}
        onSubmit={(values) => {
          const finalData = {
            ...values,
            schedule_by_id: values.schedule_by_id || loggedInEmployeeId,
          };
          onSave(finalData);
        }}
      >
        {({
          values,
          handleChange,
          handleSubmit,
          errors,
          touched,
          isSubmitting,
        }) => (
          <FormikForm onSubmit={handleSubmit}>
            <Modal.Body>
              {/* Lead Selection */}
              {!editData && (
                <Form.Group className="mb-3">
                  <Form.Label>
                    Lead <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    name="lead_id"
                    value={values.lead_id || ""}
                    onChange={handleChange}
                    isInvalid={touched.lead_id && !!errors.lead_id}
                  >
                    <option value="">Select Lead</option>
                    {leads.map((lead) => (
                      <option key={lead.id} value={lead.id}>
                        {lead.name}
                      </option>
                    ))}
                  </Form.Select>
                  <ErrorMessage
                    name="lead_id"
                    component="div"
                    className="text-danger small errors-text"
                  />
                </Form.Group>
              )}

              {/* Mobile Number */}
              {selectedLead && (
                <Form.Group className="mb-3">
                  <Form.Label>Mobile Number</Form.Label>
                  <Form.Control
                    type="text"
                    value={selectedLead.contact || ""}
                    readOnly
                  />
                </Form.Group>
              )}

              {/* Message */}
              <Form.Group className="mb-3">
                <Form.Label>
                  Message <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="message"
                  value={values.message || ""}
                  onChange={handleChange}
                  isInvalid={touched.message && !!errors.message}
                  style={{ color: "black" }}
                />
                <ErrorMessage
                  name="message"
                  component="div"
                  className="text-danger small errors-text"
                />
              </Form.Group>

              {/* Follow Up DateTime */}
              <Form.Group className="mb-3">
                <Form.Label>
                  Follow Up Date & Time <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="datetime-local"
                  name="followup_date"
                  value={values.followup_date || ""}
                  onChange={handleChange}
                  isInvalid={touched.followup_date && !!errors.followup_date}
                />
                <ErrorMessage
                  name="followup_date"
                  component="div"
                  className="text-danger small errors-text"
                />
              </Form.Group>

              {/* Schedule By */}
              <Form.Group className="mb-3">
                <Form.Label>
                  Schedule By <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  name="schedule_by_id"
                  value={values.schedule_by_id || loggedInEmployeeId || ""}
                  onChange={handleChange}
                  isInvalid={touched.schedule_by_id && !!errors.schedule_by_id}
                >
                  <option value="">Select Employee</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name}
                    </option>
                  ))}
                </Form.Select>
                <ErrorMessage
                  name="schedule_by_id"
                  component="div"
                  className="text-danger small errors-text"
                />
              </Form.Group>

              {/* Action Buttons */}
              <div className="text-end">
                <Button
                  type="submit"
                  variant="primary"
                  className="ms-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save"}
                </Button>
              </div>
            </Modal.Body>
          </FormikForm>
        )}
      </Formik>
    </Modal>
  );
};

export default AddEditModal;
