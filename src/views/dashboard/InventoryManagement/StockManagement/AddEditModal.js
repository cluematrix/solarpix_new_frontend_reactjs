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
  loading,
  formik,
  stockMaterial,
  stockParticular,
  supplierManagement,
  brand,
  customer,
}) => {
  console.log("formik.values", formik.values);
  const [originalBalance, setOriginalBalance] = React.useState(0);

  useEffect(() => {
    if (
      formik.values.select_type === "Credit" &&
      formik.values.balance === ""
    ) {
      formik.setFieldValue("Debit", 0);
      formik.setFieldValue("balance", formik.values.Credit);
    }
    if (formik.values.select_type === "Debit" && formik.values.balance === "") {
      formik.setFieldValue("Credit", 0);
      formik.setFieldValue("balance", formik.values.Debit);
    }
  }, [
    formik.values.select_type,
    formik.values.Credit,
    formik.values.Debit,
    formik,
  ]);

  useEffect(() => {
    if (show && formik.values.balance !== "") {
      setOriginalBalance(Number(formik.values.balance)); // DB wala balance safe karo
    }
  }, [show]);

  //run only update time
  useEffect(() => {
    const { select_type, Credit, Debit } = formik.values;

    // Jab tak user kuch type nahi kare, kuch mat karo
    if (Credit === null && Debit === null) return;

    let updatedBalance = originalBalance;

    if (select_type === "Credit" && Credit !== null) {
      updatedBalance = originalBalance + Number(Credit || 0); // ✅ add credit
    }

    if (select_type === "Debit" && Debit !== null) {
      updatedBalance = originalBalance - Number(Debit || 0); // ✅ minus debit
    }

    formik.setFieldValue("balance", updatedBalance);
  }, [
    formik.values.select_type,
    formik.values.Credit,
    formik.values.Debit,
    originalBalance,
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
                  min={0}
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
                  min={0}
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
