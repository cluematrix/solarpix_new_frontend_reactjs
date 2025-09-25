import React, { useState } from "react";
import { Badge, Button, Col, Form, Modal, Row } from "react-bootstrap";
import CustomInput from "../../../../../components/Form/CustomInput";
import CustomSelect from "../../../../../components/Form/CustomSelect";
import CustomCheckbox from "../../../../../components/Form/CustomCheckbox";

const AddProjectMaterial = ({
  formik,
  metaData,
  employee,
  formData,
  // selectedMemberNames,
}) => {
  const [stockModal, setStockModal] = useState(false);

  const toggleStockSelection = (id) => {
    const alreadySelected = formik.values.stock_material?.includes(id);
    if (alreadySelected) {
      formik.setFieldValue(
        "stock_material",
        formik.values.stock_material.filter((m) => m !== id)
      );
    } else {
      formik.setFieldValue("stock_material", [
        ...formik.values.stock_material,
        id,
      ]);
    }
  };

  const selectedMemberNames = metaData.stock
    .filter((m) => formik.values.stock_material?.includes(m.id))
    .map((m) => m.material);

  return (
    <Form>
      <div className="mb-3 mt-3 fw-light">
        <h6>Material Information: </h6>
      </div>
      {/* Row 1 {stock_material} */}
      <Row>
        <Col md={4}>
          <Form.Group>
            <Form.Label className="pt-4">Stock Material</Form.Label>
            <div>
              {selectedMemberNames.length > 0 ? (
                selectedMemberNames.map((name) => (
                  <Badge key={name} bg="light" text="dark" className="me-2 p-1">
                    {name}
                  </Badge>
                ))
              ) : (
                <p className="text-muted" style={{ fontSize: "13px" }}>
                  No stock selected
                </p>
              )}
            </div>
            <Button
              size="sm"
              className="mt-2"
              onClick={() => setStockModal(true)}
            >
              Select Stock
            </Button>
          </Form.Group>
          {formik.touched.stock_material && formik.errors.stock_material && (
            <div className="text-danger mt-1" style={{ fontSize: "11px" }}>
              {formik.errors.stock_material}
            </div>
          )}
        </Col>
      </Row>

      {/* Row 2, {company_name, capacity } */}
      <Row className="mt-3">
        <Col md={4}>
          <CustomInput
            label="Company Name"
            name="company_name"
            value={formik.values.company_name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter Project Name"
            touched={formik.touched.company_name}
            errors={formik.errors.company_name}
          />
        </Col>
        <Col md={4}>
          <CustomSelect
            label="Capacity"
            name="capacity"
            value={formik.values.capacity}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            options={metaData.projectCategory}
            placeholder="--"
            error={formik.errors.capacity}
            touched={formik.touched.capacity}
            lableName="category"
          />
        </Col>
      </Row>

      <Modal show={stockModal} onHide={() => setStockModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Select Stock Material</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {metaData.stock?.map((stock) => (
            <Form.Check
              key={stock.id}
              type="checkbox"
              label={stock.material}
              checked={formik.values.stock_material?.includes(stock.id)}
              onChange={() => toggleStockSelection(stock.id)}
            />
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setStockModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={() => setStockModal(false)}>
            Save Selection
          </Button>
        </Modal.Footer>
      </Modal>
    </Form>
  );
};

export default AddProjectMaterial;
