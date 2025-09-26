import React from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";
import CustomInput from "../../../../components/Form/CustomInput";
import CustomSelect from "../../../../components/Form/CustomSelect"; // make sure you have this

const AddEditModal = ({
  show,
  handleClose,
  onSave,
  modalTitle,
  buttonLabel,
  loading,
  formik,
  employeeOptions,
}) => {
  console.log("employeeOptions addd", employeeOptions);
  return (
    <Modal centered show={show} onHide={handleClose} backdrop="static">
      <Form onSubmit={onSave}>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={6}>
              <CustomSelect
                label="Employee Name"
                name="employee_id"
                value={formik.values.employee_id}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                options={employeeOptions}
                touched={formik.touched.employee_id}
                errors={formik.errors.employee_id}
                required
              />
            </Col>
            <Col md={6}>
              <CustomInput
                label="Warehouse Name"
                name="warehouse_name"
                value={formik.values.warehouse_name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter warehouse name"
                touched={formik.touched.warehouse_name}
                errors={formik.errors.warehouse_name}
                required
              />
            </Col>
          </Row>

          <Row className="mt-3">
            <Col md={6}>
              <CustomInput
                label="City"
                name="city"
                value={formik.values.city}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter city"
                touched={formik.touched.city}
                errors={formik.errors.city}
                required
              />
            </Col>
            <Col md={6}>
              <CustomInput
                label="Pincode"
                name="pincode"
                value={formik.values.pincode}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter pincode"
                touched={formik.touched.pincode}
                errors={formik.errors.pincode}
                required
              />
            </Col>
          </Row>

          <Row className="mt-3">
            <Col md={12}>
              <CustomInput
                label="Address"
                name="address"
                value={formik.values.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter address"
                touched={formik.touched.address}
                errors={formik.errors.address}
                required
              />
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button disabled={loading} variant="primary" type="submit">
            {loading ? "Saving..." : buttonLabel}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddEditModal;
