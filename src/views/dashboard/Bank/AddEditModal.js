import React from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";
import CustomSelect from "../../../components/Form/CustomSelect";
import CustomInput from "../../../components/Form/CustomInput";
import { accountTypes } from "../../../mockData";

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
            {/* Row bank_name, acc_name, acc_no */}
            <Row className="mb-3">
              <Col md={4}>
                <CustomInput
                  label="Bank Name"
                  name="bank_name"
                  value={formik.values.bank_name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter Field Name"
                  touched={formik.touched.bank_name}
                  errors={formik.errors.bank_name}
                  required={true}
                />
              </Col>
              <Col md={4}>
                <CustomInput
                  label="Account Holder Name"
                  name="acc_name"
                  value={formik.values.acc_name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter Label"
                  touched={formik.touched.acc_name}
                  errors={formik.errors.acc_name}
                  required={true}
                />
              </Col>
              <Col md={4}>
                <CustomInput
                  label="Account No"
                  name="acc_no"
                  value={formik.values.acc_no}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter Label"
                  touched={formik.touched.acc_no}
                  errors={formik.errors.acc_no}
                  required={true}
                />
              </Col>
            </Row>

            {/* Row IFSC_code, acc_type */}
            <Row style={{ display: "flex", alignItems: "flex-end" }}>
              <Col md={6}>
                <CustomInput
                  label="IFSC Code"
                  name="IFSC_code"
                  value={formik.values.IFSC_code}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter Label"
                  touched={formik.touched.IFSC_code}
                  errors={formik.errors.IFSC_code}
                  required={true}
                />
              </Col>
              <Col md={6}>
                <CustomSelect
                  label="Data Type"
                  name="acc_type"
                  value={formik.values.acc_type}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  options={accountTypes}
                  placeholder="--"
                  error={formik.errors.acc_type}
                  touched={formik.touched.acc_type}
                  lableKey="name"
                  lableName="name"
                  required={true}
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
