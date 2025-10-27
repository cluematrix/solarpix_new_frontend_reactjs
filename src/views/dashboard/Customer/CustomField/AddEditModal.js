import React from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";
import CustomSelect from "../../../../components/Form/CustomSelect";
import CustomInput from "../../../../components/Form/CustomInput";
import CustomRadioGroup from "../../../../components/Form/CustomRadioGroup";
import { typeOfData, requiredTypes } from "../../../../mockData";

const AddEditModal = ({
  show,
  handleClose,
  onSave,
  modalTitle,
  loading,
  formik,
}) => {
  return (
    <>
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
            {/* Row field_name, label */}
            <Row className="mb-3">
              <Col md={6}>
                <CustomInput
                  label="Field Name"
                  name="field_name"
                  value={formik.values.field_name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter Field Name"
                  touched={formik.touched.field_name}
                  errors={formik.errors.field_name}
                  required={true}
                />
              </Col>
              <Col md={6}>
                <CustomInput
                  label="Label"
                  name="label"
                  value={formik.values.label}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter Label"
                  touched={formik.touched.label}
                  errors={formik.errors.label}
                  required={true}
                />
              </Col>
            </Row>

            {/* Row data_type, required */}
            <Row style={{ display: "flex", alignItems: "flex-end" }}>
              <Col md={6}>
                <CustomSelect
                  label="Data Type"
                  name="data_type"
                  value={formik.values.data_type}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  options={typeOfData}
                  placeholder="--"
                  error={formik.errors.data_type}
                  touched={formik.touched.data_type}
                  lableKey="name"
                  lableName="name"
                  required={true}
                />
              </Col>
              <Col md={6}>
                <CustomRadioGroup
                  label="Is required"
                  name="is_required"
                  options={requiredTypes}
                  value={formik.values.is_required}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  touched={formik.touched.is_required}
                  error={formik.errors.is_required}
                />
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button disabled={loading} variant="primary" type="submit">
              {loading ? "Saving..." : "Save"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default AddEditModal;
