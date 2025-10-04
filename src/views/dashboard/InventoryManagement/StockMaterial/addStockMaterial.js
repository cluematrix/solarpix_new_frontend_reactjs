import React, { useEffect, useState } from "react";
import { Form, Button, Row, Col, Card, Modal } from "react-bootstrap";
import CustomSelect from "../../../../components/Form/CustomSelect";
import CustomInput from "../../../../components/Form/CustomInput";
import { useFormik } from "formik";
import { errorToast } from "../../../../components/Toast/errorToast";
import { successToast } from "../../../../components/Toast/successToast";
import api from "../../../../api/axios";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import CustomRadioGroup from "../../../../components/Form/CustomRadioGroup";
import { typeOfMaterial } from "../../../../mockData";
import CustomCheckbox from "../../../../components/Form/CustomCheckbox";

const AddStockMaterial = ({ invCatData }) => {
  const [materialList, setMaterialList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSerialModal, setShowSerialModal] = useState(false);
  const { id } = useParams();
  const [directSend, setDirectSend] = useState("Warehouse");
  const [customerData, setCustomerData] = useState([]);
  const navigate = useNavigate();
  const [metaData, setMetaData] = useState({
    unitData: [],
    taxPreferenceData: [],
    venderData: [],
    invCatData: [],
    invTypeData: [],
    Warehouse: [],
    intraTaxData: [],
    interTaxData: [],
    custData: [],
  });

  const initialValues = {
    type: "Goods",
    material: "",
    balance: "",
    hsc_code: "",
    sac: "",
    tax_preference_id: "",
    exemption_reason: "",
    type_sales_info: false,
    type_purchase_info: false,
    sales_info_selling_price: "",
    purchase_info_cost_price: "",
    purchase_info_vendor_id: "",
    intra_state_tax_rate_id: "",
    inter_state_tax_rate_id: "",
    inventory_category_id: "",
    inventoryType_id: "",
    branch_id: "",
    client_id: "",
    serialNumbers: [],
    direct_send: "Warehouse",
    unit_id: "",
  };

  const validationSchema = Yup.object().shape({
    material: Yup.string().required("Material name is required"),
    type: Yup.string().required("Type is required"),
    tax_preference_id: Yup.string().required("Tax preference is required"),
    sales_info_selling_price: Yup.string().required(
      "Selling price is required"
    ),
    purchase_info_cost_price: Yup.string().required("Cost price is required"),
    unit_id: Yup.string().required("Unit is required"),
    ...(directSend === "Customer" && {
      client_id: Yup.string().required("Customer is required"),
    }),
    ...(directSend === "Warehouse" && {
      branch_id: Yup.string().required("Warehouse is required"),
    }),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      if (values.branch_id) {
        delete values.client_id;
      } else if (values.client_id) {
        delete values.branch_id;
      }
      console.log("onsubmitvalue", values);
      if (id) {
        api
          .put(`/api/v1/admin/stockMaterial/${id}`, values)
          .then(() => {
            successToast("Stock material updated successfully");
            navigate("/stock-material-list");
          })
          .catch((err) => {
            console.error("Error updating stock material:", err);
            errorToast(
              err.response?.data?.message || "Failed to update stock material"
            );
          });
      } else {
        api
          .post("/api/v1/admin/stockMaterial", values)
          .then(() => {
            successToast("Stock material added successfully");
            navigate("/stock-material-list");
          })
          .catch((err) => {
            console.error("Error adding stock material:", err);
            errorToast(
              err.response?.data?.message || "Failed to add stock material"
            );
          });
      }
    },
  });

  const {
    handleSubmit,
    isSubmitting,
    values,
    handleBlur,
    handleChange,
    errors,
    touched,
    setFieldValue,
  } = formik;

  const fetchStockMaterial = () => {
    api
      .get("/api/v1/admin/stockMaterial")
      .then((res) => {
        if (Array.isArray(res.data)) {
          setMaterialList(res.data);
        } else if (Array.isArray(res.data.data)) {
          setMaterialList(res.data.data);
        } else {
          setMaterialList([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching stock material:", err);
        setMaterialList([]);
      });
  };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [
          unitRes,
          taxPrefRes,
          vendorRes,
          invCatRes,
          invTypeRes,
          warehouseRes,
          intraTaxRes,
          interTaxRes,
          custRes,
        ] = await Promise.all([
          api.get("/api/v1/admin/unit"),
          api.get("/api/v1/admin/taxPreference/active"),
          api.get("/api/v1/admin/supplierManagement/active"),
          api.get("/api/v1/admin/inventoryCategory/active"),
          api.get(
            "/api/v1/admin/inventoryType/active/pagination?page=1&limit=10"
          ),
          api.get("/api/v1/admin/branch"),
          api.get("/api/v1/admin/intraTax/active"),
          api.get("/api/v1/admin/interTax/active"),
          api.get("/api/v1/admin/client/active"),
        ]);

        setMetaData({
          unitData: unitRes?.data?.data?.filter((e) => e.isActive) || [],
          taxPreferenceData: taxPrefRes.data.data || [],
          venderData: vendorRes.data || [],
          invCatData: invCatRes.data || [],
          invTypeData: invTypeRes.data.data || [],
          warehouse: warehouseRes.data.data || [],
          intraTaxData: intraTaxRes.data.data || [],
          interTaxData: interTaxRes.data.data || [],
          custData: custRes.data.data || [],
        });
      } catch (error) {
        errorToast("Error loading data");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  useEffect(() => {
    if (id) {
      setLoading(true);
      api
        .get(`/api/v1/admin/stockMaterial/${id}`)
        .then((res) => {
          const data = res.data; // Adjust if nested, e.g., res.data.data
          setFieldValue("type", data.type || "Goods");
          setFieldValue("material", data.material || "");
          setFieldValue("balance", data.balance || "");
          setFieldValue("hsc_code", data.hsc_code || "");
          setFieldValue("sac", data.sac || "");
          setFieldValue("tax_preference_id", data.tax_preference_id || "");
          setFieldValue("exemption_reason", data.exemption_reason || "");
          setFieldValue("type_sales_info", data.type_sales_info || false);
          setFieldValue("type_purchase_info", data.type_purchase_info || false);
          setFieldValue(
            "sales_info_selling_price",
            data.sales_info_selling_price || ""
          );
          setFieldValue(
            "purchase_info_cost_price",
            data.purchase_info_cost_price || ""
          );
          setFieldValue(
            "purchase_info_vendor_id",
            data.purchase_info_vendor_id || ""
          );
          setFieldValue(
            "intra_state_tax_rate_id",
            data.intra_state_tax_rate_id || ""
          );
          setFieldValue(
            "inter_state_tax_rate_id",
            data.inter_state_tax_rate_id || ""
          );
          setFieldValue(
            "inventory_category_id",
            data.inventory_category_id || ""
          );
          setFieldValue("inventoryType_id", data.inventoryType_id || "");
          setFieldValue("branch_id", data.branch_id || "");
          setFieldValue("client_id", data.client_id || "");
          setFieldValue("serialNumbers", data.serialNumbers || []);
          setFieldValue("direct_send", data.direct_send || "Warehouse");
          setFieldValue("unit_id", data.unit_id || "");
          setDirectSend(data.direct_send || "Warehouse");
        })
        .catch((err) => {
          console.error("Error fetching stock material for edit:", err);
          errorToast(
            err.response?.data?.message || "Failed to fetch stock material"
          );
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id, setFieldValue]);

  const taxPrefName = metaData?.taxPreferenceData?.find(
    (item) => item?.id === Number(values.tax_preference_id)
  );

  const directSendOptions = [
    { id: "1", name: "Warehouse" },
    { id: "2", name: "Customer" },
  ];

  const handleSerialModalOpen = () => {
    const count = parseInt(values.balance, 10) || 0;
    let serials = values.serialNumbers;
    if (serials.length !== count) {
      serials = Array(count)
        .fill("")
        .map((_, i) => serials[i] || "");
    }
    setFieldValue("serialNumbers", serials);
    setShowSerialModal(true);
  };

  const handleSerialChange = (index, value) => {
    const updated = [...values.serialNumbers];
    updated[index] = value;
    setFieldValue("serialNumbers", updated);
  };

  if (loading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  console.log("values", values);
  return (
    <Card>
      <Card.Header>
        <h5 className="mb-0">Stock Material</h5>
      </Card.Header>
      <hr />
      <Card.Body className="pt-0">
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col md={4}>
              <CustomRadioGroup
                label="Type"
                name="type"
                options={typeOfMaterial}
                value={values.type}
                onChange={handleChange}
                onBlur={handleBlur}
                touched={touched.type}
                error={errors.type}
                required
              />
            </Col>
            <Col md={4}>
              <CustomRadioGroup
                label="Direct Send"
                name="direct_send"
                options={directSendOptions}
                value={values.direct_send}
                onChange={(e) => {
                  handleChange(e);
                  setDirectSend(e.target.value);
                }}
                onBlur={handleBlur}
                touched={touched.direct_send}
                error={errors.direct_send}
                required
              />
            </Col>
            <Col md={4}>
              {values.direct_send === "Warehouse" ? (
                <CustomSelect
                  label="Warehouse"
                  name="branch_id"
                  onChange={(e) => {
                    handleChange(e);
                    setFieldValue("client_id", "");
                  }}
                  onBlur={handleBlur}
                  options={metaData.warehouse}
                  placeholder="--"
                  error={errors.branch_id}
                  touched={touched.branch_id}
                  required
                  lableName="branch_name"
                  lableKey="id"
                  value={values.branch_id}
                />
              ) : (
                <CustomSelect
                  label="Customer"
                  name="client_id"
                  value={values.client_id}
                  onChange={(e) => {
                    handleChange(e);
                    setFieldValue("branch_id", "");
                  }}
                  onBlur={handleBlur}
                  options={metaData.custData}
                  placeholder="--"
                  error={errors.client_id}
                  touched={touched.client_id}
                  required
                  lableName="name"
                  lableKey="id"
                />
              )}
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={4}>
              <CustomSelect
                label="Inventory Category"
                name="inventory_category_id"
                value={values.inventory_category_id}
                onChange={handleChange}
                onBlur={handleBlur}
                options={metaData.invCatData}
                placeholder="--"
                error={errors.inventory_category_id}
                touched={touched.inventory_category_id}
                required
                lableName="category"
                lableKey="id"
              />
            </Col>
            <Col md={4}>
              <CustomSelect
                label="Inventory Type"
                name="inventoryType_id"
                value={values.inventoryType_id}
                onChange={handleChange}
                onBlur={handleBlur}
                options={metaData.invTypeData}
                placeholder="--"
                error={errors.inventoryType_id}
                touched={touched.inventoryType_id}
                required
                lableName="type"
                lableKey="id"
              />
            </Col>
            <Col md={4}>
              <CustomInput
                label="Material Name"
                name="material"
                value={values.material}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter material name"
                touched={touched.material}
                errors={errors.material}
                required
              />
            </Col>
          </Row>

          <Row className="mb-3">
            {values.type === "Goods" ? (
              <Col md={4}>
                <CustomInput
                  label="HSN Code"
                  name="hsc_code"
                  value={values.hsc_code}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter HSN Code"
                />
              </Col>
            ) : (
              <Col md={4}>
                <CustomInput
                  label="SAC Code"
                  name="sac"
                  value={values.sac}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter SAC Code"
                />
              </Col>
            )}

            <Col md={4}>
              <CustomSelect
                label="Unit"
                name="unit_id"
                value={values.unit_id}
                onChange={handleChange}
                onBlur={handleBlur}
                options={metaData.unitData}
                placeholder="--"
                error={errors.unit_id}
                touched={touched.unit_id}
                required
                lableName="unit"
                lableKey="id"
              />
            </Col>

            <Col md={4}>
              <CustomSelect
                label="Tax Preference"
                name="tax_preference_id"
                value={values.tax_preference_id}
                onChange={handleChange}
                onBlur={handleBlur}
                options={metaData.taxPreferenceData}
                placeholder="--"
                error={errors.tax_preference_id}
                touched={touched.tax_preference_id}
                required
                lableName="name"
                lableKey="id"
              />
            </Col>
          </Row>

          <Row className="mb-3 d-flex align-items-center">
            {taxPrefName?.name.toLowerCase() === "non-taxable" && (
              <Col md={4}>
                <CustomInput
                  label="Exemption Name"
                  name="exemption_reason"
                  value={values.exemption_reason}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter Exemption Reason"
                  touched={touched.exemption_reason}
                  errors={errors.exemption_reason}
                  required
                />
              </Col>
            )}
            <Col md={4}>
              <Form.Group>
                <Form.Label>Balance</Form.Label>
                <Form.Control
                  type="number"
                  name="balance"
                  value={values.balance}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter Balance"
                  min={0}
                  required
                />
              </Form.Group>
            </Col>
            <Col className="mt-4" md={4}>
              {values.balance > 0 && (
                <Button variant="primary" onClick={handleSerialModalOpen}>
                  + Serial Number
                </Button>
              )}
            </Col>

            <Modal
              show={showSerialModal}
              onHide={() => setShowSerialModal(false)}
            >
              <Modal.Header closeButton>
                <Modal.Title>Enter Serial Numbers</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {values.serialNumbers.map((sn, index) => (
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
                ))}
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="primary"
                  onClick={() => {
                    setShowSerialModal(false);
                    // Optionally, include serial numbers in the form submission
                  }}
                >
                  Save
                </Button>
              </Modal.Footer>
            </Modal>
          </Row>
          <hr />

          <Row className="mb-3">
            <Col md={6}>
              <Row className="mb-3">
                <Col md={12}>
                  <CustomCheckbox
                    label="Sales Information"
                    name="type_sales_info"
                    checked={values.type_sales_info}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.type_sales_info}
                    touched={touched.type_sales_info}
                  />
                </Col>
              </Row>
              <Row>
                <Col md={8}>
                  <CustomInput
                    label="Selling Price"
                    name="sales_info_selling_price"
                    value={values.sales_info_selling_price}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter Selling Price"
                    touched={touched.sales_info_selling_price}
                    errors={errors.sales_info_selling_price}
                    required
                    nameIcon="INR"
                    iconPosition="left"
                    disabled={!values.type_sales_info}
                    readOnly={!values.type_sales_info}
                  />
                </Col>
              </Row>
            </Col>

            <Col md={6}>
              <Row className="mb-3">
                <Col md={12}>
                  <CustomCheckbox
                    label="Purchase Information"
                    name="type_purchase_info"
                    checked={values.type_purchase_info}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.type_purchase_info}
                    touched={touched.type_purchase_info}
                  />
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={12}>
                  <CustomInput
                    label="Cost Price"
                    name="purchase_info_cost_price"
                    value={values.purchase_info_cost_price}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter Cost Price"
                    touched={touched.purchase_info_cost_price}
                    errors={errors.purchase_info_cost_price}
                    required
                    nameIcon="INR"
                    iconPosition="left"
                    disabled={!values.type_purchase_info}
                    readOnly={!values.type_purchase_info}
                  />
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={12}>
                  <CustomSelect
                    label="Preferred Vendor"
                    name="purchase_info_vendor_id"
                    value={values.purchase_info_vendor_id}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    options={metaData.venderData}
                    placeholder="--"
                    error={errors.purchase_info_vendor_id}
                    touched={touched.purchase_info_vendor_id}
                    lableName="name"
                    lableKey="id"
                    disabled={!values.type_purchase_info}
                    readOnly={!values.type_purchase_info}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
          <hr />

          {taxPrefName?.name?.toLowerCase() !== "non-taxable" && (
            <Row className="mb-3">
              <h6 className="mb-3">Default Tax Rates</h6>
              <Col md={4}>
                <CustomSelect
                  label="Intra State Tax Rate"
                  name="intra_state_tax_rate_id"
                  value={values.intra_state_tax_rate_id}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  options={metaData.intraTaxData}
                  placeholder="--"
                  lableName="name"
                  lableKey="id"
                  percent="intra_per"
                />
              </Col>
              <Col md={4}>
                <CustomSelect
                  label="Inter State Tax Rate"
                  name="inter_state_tax_rate_id"
                  value={values.inter_state_tax_rate_id}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  options={metaData.interTaxData}
                  placeholder="--"
                  lableName="name"
                  lableKey="id"
                  percent="inter_per"
                />
              </Col>
            </Row>
          )}

          <div className="mt-4 text-end">
            <Button type="submit" variant="primary">
              Save
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default AddStockMaterial;
