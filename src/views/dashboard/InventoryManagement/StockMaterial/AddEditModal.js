import React from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";
import CustomSelect from "../../../../components/Form/CustomSelect";
import CustomInput from "../../../../components/Form/CustomInput";

const AddEditModal = ({
  show,
  handleClose,
  onSave,
  modalTitle,
  buttonLabel,
  loading,
  formik,
  invCatData,
}) => {
  console.log("formik.errors", formik.errors);
  console.log("formik.values", formik.values);
  return (
    <Modal centered show={show} onHide={handleClose} backdrop="static">
      <Form onSubmit={onSave}>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* row 1 material, inventory_category_id */}
          <Row>
            <Col md={6}>
              <CustomInput
                label="Material Name"
                name="material"
                value={formik.values.material}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter material name"
                touched={formik.touched.material}
                errors={formik.errors.material}
                required={true}
              />
            </Col>
            <Col md={6}>
              <CustomSelect
                label="Inventory Category"
                name="inventory_category_id"
                value={formik.values.inventory_category_id}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                options={invCatData}
                placeholder="--"
                error={formik.errors.inventory_category_id}
                touched={formik.touched.inventory_category_id}
                required
                lableName="category"
                lableKey="id"
              />
            </Col>
          </Row>

          {/* row 2 balance, submit */}
          <Row className="mt-3">
            <Col md={6}>
              <CustomInput
                type="number"
                label="Balance"
                name="balance"
                value={formik.values.balance}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter balance"
                touched={formik.touched.balance}
                errors={formik.errors.balance}
                required={true}
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
