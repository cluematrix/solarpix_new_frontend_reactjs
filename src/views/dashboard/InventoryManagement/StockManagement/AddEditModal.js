import React, { useEffect } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";
import CustomSelect from "../../../../components/Form/CustomSelect";
import CustomInput from "../../../../components/Form/CustomInput";
import CustomRadioGroup from "../../../../components/Form/CustomRadioGroup";
import { selectTypeData } from "../../../../mockData";

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
  console.log("formik.values", formik.values);
  console.log("formik.errors", formik.errors);
  // Balance calculate useEffect
  useEffect(() => {
    const selectedMaterial = stockMaterial.find((m) => {
      console.log("m.id", m.id);
      console.log(
        "formik.values.stock_material_id",
        formik.values.stock_material_id
      );
      return m.id == formik.values.stock_material_id;
    });

    console.log("selectedMaterial.balance", selectedMaterial);
    if (!selectedMaterial) return;

    let baseBalance = selectedMaterial.balance || 0;
    let newBalance = baseBalance;

    if (formik.values.select_type == "Credit" && formik.values.Credit) {
      newBalance = baseBalance + Number(formik.values.Credit);
      formik.setFieldValue("Debit", 0);
    } else if (formik.values.select_type == "Debit" && formik.values.Debit) {
      newBalance = baseBalance - Number(formik.values.Debit);
      formik.setFieldValue("Credit", 0);
    }

    formik.setFieldValue("balance", newBalance);
  }, [
    formik.values.stock_material_id,
    formik.values.Credit,
    formik.values.Debit,
    formik.values.select_type,
    stockMaterial,
  ]);

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
          {/* Row 1 stock_material_id, stock_particular_id, supplier_management_id */}
          <Row>
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

          {/* Row 2 select_type,  */}
          <Row className="mt-3">
            <Col md={12}>
              <CustomRadioGroup
                label="Select Type"
                name="select_type"
                options={selectTypeData}
                value={formik.values.select_type}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                touched={formik.touched.select_type}
                error={formik.errors.select_type}
                required
              />
            </Col>
          </Row>

          {/* Row 3 Credit, Debit, balance */}
          <Row className="mt-3">
            <Col md={4}>
              {formik.values.select_type === "Credit" ? (
                <CustomInput
                  type="number"
                  label="Credit"
                  name="Credit"
                  value={formik.values.Credit}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter Credit"
                  touched={formik.touched.Credit}
                  errors={formik.errors.Credit}
                />
              ) : (
                <CustomInput
                  type="number"
                  label="Debit"
                  name="Debit"
                  value={formik.values.Debit}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter Debit"
                  touched={formik.touched.Debit}
                  errors={formik.errors.Debit}
                />
              )}
            </Col>
            <Col md={4}>
              <CustomInput
                type="number"
                label="Balance"
                name="balance"
                value={formik.values.balance}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Balance"
                touched={formik.touched.balance}
                errors={formik.errors.balance}
                readOnly={true}
              />
            </Col>
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
            {loading ? "Saving..." : "Save"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddEditModal;
