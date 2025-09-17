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
  stockMaterial,
  stockParticular,
  supplierManagement,
  brand,
  customer,
}) => {
  console.log("valuesStockMg", formik.values.remark);
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
          {/* row 1 Credit, Debit, balance */}
          <Row>
            <Col md={4}>
              <CustomInput
                label="Credit"
                name="Credit"
                value={formik.values.Credit}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter credit"
                touched={formik.touched.Credit}
                errors={formik.errors.Credit}
                required={true}
              />
            </Col>
            <Col md={4}>
              <CustomInput
                label="Debit"
                name="Debit"
                value={formik.values.Debit}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter debit"
                touched={formik.touched.Debit}
                errors={formik.errors.Debit}
                required={true}
              />
            </Col>
            <Col md={4}>
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

          {/* row 2 stock_material_id, stock_particular_id, supplier_management_id */}
          <Row className="mt-3">
            <Col md={4}>
              <CustomSelect
                label="Stock Material"
                name="stock_material_id"
                value={formik.values.stock_material_id}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                options={stockMaterial}
                placeholder="--"
                error={formik.errors.stock_material_id}
                touched={formik.touched.stock_material_id}
                required
                lableName="material"
                lableKey="id"
              />
            </Col>
            <Col md={4}>
              <CustomSelect
                label="Stock Particular"
                name="stock_particular_id"
                value={formik.values.stock_particular_id}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                options={stockParticular}
                placeholder="--"
                error={formik.errors.stock_particular_id}
                touched={formik.touched.stock_particular_id}
                required
                lableName="particular"
                lableKey="id"
              />
            </Col>
            <Col md={4}>
              <CustomSelect
                label="Supplier Management"
                name="supplier_management_id"
                value={formik.values.supplier_management_id}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                options={supplierManagement}
                placeholder="--"
                error={formik.errors.supplier_management_id}
                touched={formik.touched.supplier_management_id}
                required
                lableName="name"
                lableKey="id"
              />
            </Col>
          </Row>

          {/* row 3 brand_id, client_id */}
          <Row className="mt-3">
            <Col md={4}>
              <CustomSelect
                label="Brand"
                name="brand_id"
                value={formik.values.brand_id}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                options={brand}
                placeholder="--"
                error={formik.errors.brand_id}
                touched={formik.touched.brand_id}
                required
                lableName="brand_name"
                lableKey="id"
              />
            </Col>
            <Col md={4}>
              <CustomSelect
                label="Customer"
                name="client_id"
                value={formik.values.client_id}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                options={customer}
                placeholder="--"
                error={formik.errors.client_id}
                touched={formik.touched.client_id}
                required
                lableName="name"
                lableKey="id"
              />
            </Col>
          </Row>

          {/* row 4 remark */}
          <Row className="mt-3">
            <Col md={12}>
              <CustomInput
                as="textArea"
                label="Remark"
                name="remark"
                value={formik.values.remark}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Remarks"
                touched={formik.touched.remark}
                errors={formik.errors.remark}
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
