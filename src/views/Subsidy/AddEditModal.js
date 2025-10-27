import React from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";
import CustomInput from "../../components/Form/CustomInput";

/**
 * Props:
 *  - show
 *  - handleClose
 *  - onSave         -> form submit handler (Formik's handleSubmit)
 *  - modalTitle
 *  - loading
 *  - formik         -> useFormik instance from parent
 *  - handleAddField -> optional, parent handler to add a field
 *  - handleRemoveField -> optional, parent handler to remove a field (index)
 *
 * Expects formik.initialValues.subsidyFields = [{ label: "", value: "" }, ...]
 */
const AddEditModal = ({
  show,
  handleClose,
  onSave,
  modalTitle,
  loading,
  formik,
  handleAddField,
  handleRemoveField,
}) => {
  // local fallback add/remove if parent doesn't provide handlers
  const localAdd = () => {
    const current = formik.values.subsidyFields || [];
    formik.setFieldValue("subsidyFields", [
      ...current,
      { label: "", value: "" },
    ]);
  };

  const localRemove = (index) => {
    const current = [...(formik.values.subsidyFields || [])];
    current.splice(index, 1);
    formik.setFieldValue("subsidyFields", current);
  };

  const addField = handleAddField || localAdd;
  const removeField = handleRemoveField || localRemove;

  console.log("errorsSubsidy", formik.errors);

  return (
    <Modal
      centered
      show={show}
      onHide={handleClose}
      backdrop="static"
      size="lg"
    >
      <Form onSubmit={onSave}>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {/* Dynamic Key/Value pairs */}
          {(formik.values.subsidyFields || []).map((field, index) => (
            <Row key={index} className="mb-3 align-items-end">
              <Col md={5}>
                <CustomInput
                  label="Key / Label"
                  name={`subsidyFields[${index}].label`}
                  value={field.label}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="e.g. Subsidy"
                  touched={formik.touched.subsidyFields?.[index]?.label}
                  errors={formik.errors.subsidyFields?.[index]?.label}
                  required
                />
              </Col>

              <Col md={5}>
                <CustomInput
                  label="Value"
                  name={`subsidyFields[${index}].value`}
                  value={field.value}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="e.g. ₹78,000/-"
                  touched={formik.touched.subsidyFields?.[index]?.value}
                  errors={formik.errors.subsidyFields?.[index]?.value}
                  required
                />
              </Col>

              <Col md={2}>
                {index === 0 ? (
                  <Button
                    variant="success"
                    onClick={(e) => {
                      e.preventDefault();
                      addField();
                    }}
                    className="w-100"
                    type="button"
                  >
                    + Add
                  </Button>
                ) : (
                  <Button
                    variant="danger"
                    onClick={(e) => {
                      e.preventDefault();
                      removeField(index);
                    }}
                    className="w-100"
                    type="button"
                  >
                    Remove
                  </Button>
                )}
              </Col>
            </Row>
          ))}

          {/* Show validation error for the array (if any) */}
          {typeof formik.errors.subsidyFields === "string" && (
            <div className="text-danger mb-2">
              {formik.errors.subsidyFields}
            </div>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button disabled={loading} variant="primary" type="submit">
            {loading ? "Saving..." : "Save"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddEditModal;
