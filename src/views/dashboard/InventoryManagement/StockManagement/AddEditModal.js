import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Button,
  Row,
  Col,
  Pagination,
  Spinner,
  Table,
} from "react-bootstrap";
import CustomSelect from "../../../../components/Form/CustomSelect";
import CustomInput from "../../../../components/Form/CustomInput";
import CustomRadioGroup from "../../../../components/Form/CustomRadioGroup";
import { selectTypeData } from "../../../../mockData";
import api from "../../../../api/axios";

const AddEditModal = ({
  show,
  handleClose,
  onSave,
  modalTitle,
  formik,
  stockMaterial,
  stockParticular,
  supplierManagement,
  brand,
  customer,
  handleSerialModalOpen,
  showSerialModal,
  setShowSerialModal,
  handleSerialChange,
}) => {
  const [loading, setLoading] = useState(false);
  const [serialNoPagList, setSerialNoPagList] = useState(false);
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // for checkbox
  const [selectedSerials, setSelectedSerials] = useState([]);

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
    const selectedMaterial = stockMaterial?.find(
      (item) => item.id === Number(formik.values.stock_material_id)
    );

    console.log("selectedMaterial", selectedMaterial);
    formik.setFieldValue(
      "supplier_management_id",
      selectedMaterial?.SupplierManagement?.id || ""
    );
    formik.setFieldValue("client_id", selectedMaterial?.client?.id || "");
    formik.setFieldValue("balance", selectedMaterial?.balance || "");
  }, [formik.values.stock_material_id, stockMaterial]);

  // Fetch Serial Numbers with Pagination
  const fetchSerialNumberPag = async (page = 1) => {
    try {
      setLoading(true);
      if (formik.values.stock_material_id) {
        const res = await api.get(
          `/api/v1/admin/stockMaterialSerialNumber/${formik.values.stock_material_id}/pagination?page=${page}&limit=${itemsPerPage}`
        );

        console.log("Serial Number Response:", res);
        setSerialNoPagList(res.data?.data || []);

        // Extract pagination info properly
        const pagination = res.data?.pagination;
        if (pagination) {
          setTotalPages(pagination.totalPages || 1);
        }
      }
    } catch (err) {
      console.error("Error fetching serial numbers:", err);
    } finally {
      setLoading(false);
    }
  };

  //  Trigger API when:
  // 1. select_type is Debit
  // 2. Debit > 0
  // 3. stock_material_id changes
  // 4. page changes
  useEffect(() => {
    const { select_type, Debit, stock_material_id } = formik.values;

    if (select_type === "Debit" && Number(Debit) > 0 && stock_material_id) {
      fetchSerialNumberPag(currentPage);
    }
  }, [
    formik.values.select_type,
    formik.values.Debit,
    formik.values.stock_material_id,
    currentPage,
  ]);

  console.log("supplierManagementID", formik.values.supplier_management_id);
  console.log("client_id", formik.values?.client?.id);

  console.log("valuesImp", formik.values);
  console.log("errors", formik.errors);

  console.log("serialNoPagList", serialNoPagList);

  const handleCheckboxChange = (serial) => {
    setSelectedSerials(
      (prev) =>
        prev.includes(serial)
          ? prev.filter((s) => s !== serial) // uncheck -> remove
          : [...prev, serial] // check -> add
    );
  };

  console.log("values", formik.values);
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
                {formik.values.supplier_management_id ? (
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
                    readOnly={true}
                    disabled={true}
                  />
                ) : (
                  <CustomSelect
                    label="Customer"
                    name="client_id"
                    value={formik.values.client_id}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    options={supplierManagement}
                    placeholder="--"
                    error={formik.errors.client_id}
                    touched={formik.touched.client_id}
                    required
                    lableName="name"
                    lableKey="id"
                    readOnly={true}
                    disabled={true}
                  />
                )}
              </Col>
            </Row>

            {/* Row 2 select_type,  */}
            <Row className="mt-3">
              <Col md={4}>
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
              <Col className="mt-4" md={4}>
                {(formik.values.select_type === "Credit" &&
                  Number(formik.values.Credit > 0)) ||
                (formik.values.select_type === "Debit" &&
                  Number(formik.values.Debit) > 0 &&
                  formik.values.stock_material_id) ? (
                  <Button variant="primary" onClick={handleSerialModalOpen}>
                    + Serial Number
                  </Button>
                ) : null}
              </Col>

              <Modal
                show={showSerialModal}
                onHide={() => setShowSerialModal(false)}
              >
                <Modal.Header closeButton>
                  <Modal.Title>
                    {formik.values.Credit
                      ? "Enter Serial Numbers"
                      : "Select Serial Numbers"}
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {formik.values.Credit ? (
                    formik.values.serialNumbers.map((sn, index) => (
                      <Form.Group key={index} className="mb-2">
                        <Form.Label>Serial Number {index + 1}</Form.Label>
                        <Form.Control
                          type="text"
                          value={sn}
                          required
                          onChange={(e) =>
                            handleSerialChange(index, e.target.value)
                          }
                        />
                      </Form.Group>
                    ))
                  ) : (
                    <>
                      {loading ? (
                        <div className="loader-div">
                          <Spinner animation="border" className="spinner" />
                        </div>
                      ) : (
                        <Table shover responsive className="table" size="sm">
                          <thead>
                            <tr>
                              <th>Select</th>
                              <th>Sr No</th>
                              <th>Serial Number</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {serialNoPagList.length > 0 ? (
                              serialNoPagList?.map((sn, idx) => (
                                <tr key={sn.id || idx}>
                                  <td>
                                    <Form.Check
                                      type="checkbox"
                                      checked={selectedSerials.includes(
                                        sn.serialNumber
                                      )}
                                      onChange={() =>
                                        handleCheckboxChange(sn.serialNumber)
                                      }
                                    />
                                  </td>
                                  <td>
                                    {(currentPage - 1) * itemsPerPage + idx + 1}
                                  </td>
                                  <td>{sn.serialNumber || "--"}</td>
                                  <td>
                                    <span
                                      className={`status-dot ${
                                        sn.isActive ? "active" : "inactive"
                                      }`}
                                    ></span>
                                    {sn.isActive ? "Active" : "Inactive"}
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="3" className="text-center">
                                  No Serial Numbers Available
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </Table>
                      )}

                      {/* ✅ Pagination inside modal */}
                      {totalPages > 1 && (
                        <Pagination className="justify-content-center mt-3">
                          <Pagination.First
                            onClick={() => setCurrentPage(1)}
                            disabled={currentPage === 1}
                          />
                          {[...Array(totalPages)].map((_, i) => (
                            <Pagination.Item
                              key={i + 1}
                              active={i + 1 === currentPage}
                              onClick={() => setCurrentPage(i + 1)}
                            >
                              {i + 1}
                            </Pagination.Item>
                          ))}
                          <Pagination.Last
                            onClick={() => setCurrentPage(totalPages)}
                            disabled={currentPage === totalPages}
                          />
                        </Pagination>
                      )}
                    </>
                  )}
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    variant="primary"
                    onClick={() => {
                      setShowSerialModal(false);
                    }}
                  >
                    Save
                  </Button>
                </Modal.Footer>
              </Modal>
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
                    onChange={(e) => {
                      formik.handleChange(e);
                      formik.setFieldValue("Debit", 0);
                    }}
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
                    onChange={(e) => {
                      formik.handleChange(e);
                      formik.setFieldValue("Credit", 0);
                    }}
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
                  disabled={true}
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
            <Button
              disabled={formik.isSubmitting}
              variant="primary"
              type="submit"
            >
              {formik.isSubmitting ? "Saving..." : "Save"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default AddEditModal;
