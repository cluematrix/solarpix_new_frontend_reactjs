import React, { Fragment, useEffect, useState } from "react";
import { Badge, Button, Col, Form, Modal, Row, Table } from "react-bootstrap";
import CustomInput from "../../../../../components/Form/CustomInput";

const AddProjectMaterial = ({ formik, metaData }) => {
  const [stockModal, setStockModal] = useState(false);

  console.log("formik.client_id", formik.values.client_id);

  const selectedCustomer = metaData.clientList.find(
    (c) => c.id == formik.values.client_id
  );

  console.log("selectedCustomer", selectedCustomer);
  useEffect(() => {
    if (selectedCustomer?.deal?.inv_cap) {
      formik.setFieldValue("capacity", selectedCustomer.deal.inv_cap);
    }
  }, [selectedCustomer]);
  // formik.setFieldValue("capacity", selectedCustomer?.deal?.inv_cap || "");

  const toggleStockSelection = (stockId) => {
    const current = formik.values.stock_material || [];

    const exists = current.find((item) => item.id === stockId);
    console.log("exists", exists);
    if (exists) {
      // unselect → remove from array
      const updated = current.filter((item) => item.id !== stockId);
      formik.setFieldValue("stock_material", updated);
    } else {
      // select → push with empty qty
      const updated = [...current, { id: stockId, qty: null }];
      formik.setFieldValue("stock_material", updated);
    }
  };

  const selectedMemberNames =
    metaData.stock
      ?.filter((m) =>
        formik.values.stock_material?.some((item) => item.id === m.id)
      )
      ?.map((m) => m.material) || [];

  console.log("formik", formik.values);
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
              {!stockModal && selectedMemberNames.length > 0 ? (
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
          <CustomInput
            label="Capacity"
            name="capacity"
            value={selectedCustomer?.deal?.inv_cap || formik.values.capacity}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter Pin Code"
            touched={formik.touched.capacity}
            errors={formik.errors.capacity}
            readOnly={true}
          />
        </Col>
      </Row>

      <Modal
        backdrop="static"
        show={stockModal}
        onHide={() => setStockModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Select Stock Material</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table hover responsive>
            <thead className="table-light">
              <tr className="align-top text-start">
                <th>Name</th>
                <th>Balance</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {metaData.stock?.map((stock) => {
                const selectedItem = formik.values.stock_material?.find(
                  (item) => item.id === stock.id
                );

                return (
                  <tr key={stock.id}>
                    <td>
                      <Form.Check
                        type="checkbox"
                        label={stock.material}
                        checked={!!selectedItem} // agar object mila to true
                        onChange={() => toggleStockSelection(stock.id)}
                      />
                    </td>

                    <td>
                      <span>{stock.balance}</span>
                    </td>

                    <td>
                      <CustomInput
                        type="number"
                        placeholder="Qty"
                        value={selectedItem?.qty || ""}
                        onChange={(e) => {
                          const newQty = e.target.value;
                          const updated = formik.values.stock_material.map(
                            (item) =>
                              item.id === stock.id
                                ? { ...item, qty: newQty }
                                : item
                          );
                          formik.setFieldValue("stock_material", updated);
                        }}
                        disabled={!selectedItem} // if not select then disable
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setStockModal(false)}>
            Save Selection
          </Button>
        </Modal.Footer>
      </Modal>
    </Form>
  );
};

export default AddProjectMaterial;
