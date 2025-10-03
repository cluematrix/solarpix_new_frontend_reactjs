import React, { useEffect, useState } from "react";
import { Form, Button, Row, Col, Card, Modal } from "react-bootstrap";
import CustomSelect from "../../../../components/Form/CustomSelect";
import CustomInput from "../../../../components/Form/CustomInput";
import { useFormik } from "formik";
import { errorToast } from "../../../../components/Toast/errorToast";
import { successToast } from "../../../../components/Toast/successToast";
import api from "../../../../api/axios";
import * as Yup from "yup";
import { useParams } from "react-router-dom";
import CustomRadioGroup from "../../../../components/Form/CustomRadioGroup";
import { typeOfMaterial } from "../../../../mockData";
import CustomCheckbox from "../../../../components/Form/CustomCheckbox";

const AddStockMaterial = ({ invCatData }) => {
  const [materialList, setMaterialList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSerialModal, setShowSerialModal] = useState(false);
  const { id } = useParams();

  const [metaData, setMetaData] = useState({
    unitData: [],
    taxPreferenceData: [],
    venderData: [],
    invCatData: [],
    invTypeData: [],
    warehouse: [],
    intraTaxData: [],
    interTaxData: [],
  });

  const initialValues = {
    type: "Goods",
    material: "", //name
    balance: "",
    // unit_id: "",
    hsn_code: "",
    sac: "",
    tax_preference_id: "",
    exemption_reason: "", // enable only non-taxable
    type_sales_info: false,
    type_purchase_info: false,
    sales_info_selling_price: "",
    purchase_info_cost_price: "",
    purchase_info_vendor_id: "",
    intra_state_tax_rate_id: "",
    inter_state_tax_rate: "",
    inventory_category_id: "",
    inv_type_id: "",
    warehouse_id: "",
  };

  const validationSchema = Yup.object().shape({
    material: Yup.string().required("Material name is required"),
    type: Yup.string().required("Type is required"),
    // unit_id: Yup.string().required("Unit is required"),
    tax_preference_id: Yup.string().required("Tax preference is required"),
    sales_info_selling_price: Yup.string().required(
      "Selling price is required"
    ),
    purchase_info_cost_price: Yup.string().required("Cost price is required"),
    // inventory_category_id: Yup.string().required(
    //   "Inventory category is required"
    // ),
    // inv_type_id: Yup.string().required("Inventory type is required"),
    // warehouse_id: Yup.string().required("Warehouse is required"),
  });

  // Fetch stock material
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
        ] = await Promise.all([
          // api.get("/api/v1/admin/unit"),
          api.get("/api/v1/admin/taxPreference/active"),
          api.get("/api/v1/admin/supplierManagement/active"),
          api.get("/api/v1/admin/inventoryCategory/active"),
          api.get(
            "/api/v1/admin/inventoryType/active/pagination?page=1&limit=10"
          ),
          api.get("/api/v1/admin/branch"),
          api.get("/api/v1/admin/intraTax/active"),
          api.get("/api/v1/admin/interTax/active"),
        ]);

        setMetaData({
          // unitData: unitRes?.data?.data?.filter((e) => e.isActive),
          taxPreferenceData: taxPrefRes.data.data,
          venderData: vendorRes.data,
          invCatData: invCatRes.data,
          invTypeData: invTypeRes.data.data,
          warehouse: warehouseRes.data.data,
          intraTaxData: intraTaxRes.data.data,
          interTaxData: interTaxRes.data.data,
        });
        console.log("intraTaxRes", intraTaxRes.data.data);
      } catch (error) {
        errorToast("Error loading data");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  // console.log("unitData", metaData.unitData);
  console.log("taxPreferenceData", metaData.taxPreferenceData);

  const onSubmit = (values) => {
    console.log("submit huwa");
    if (id) {
      // Update
      api
        .put(`/api/v1/admin/stockMaterial/${id}`, values)
        .then(() => {
          successToast("Stock material updated successfully");
          fetchStockMaterial();
          resetForm();
        })
        .catch((err) => {
          console.error("Error updating stock material:", err);
          errorToast(
            err.response?.data?.message || "Failed to update stock material"
          );
          resetForm();
        })
        .finally(() => {
          resetForm();
        });
    } else {
      console.log("onSubmit");
      // Add
      api
        .post("/api/v1/admin/stockMaterial", values)
        .then(() => {
          successToast("Stock material added successfully");
          fetchStockMaterial();
        })
        .catch((err) => {
          console.error("Error adding stock material:", err);
          errorToast(
            err.response?.data?.message || "Failed to add stock material"
          );
        })
        .finally(() => {});
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  const {
    handleSubmit,
    resetForm,
    isSubmitting,
    values,
    handleBlur,
    handleChange,
    errors,
    touched,
  } = formik;

  console.log("formik.errors", errors);
  console.log("formik.values", formik.values);
  console.log("values.tax_preference_id", values.tax_preference_id);
  console.log("venderData", metaData.venderData);
  const taxPrefName = metaData?.taxPreferenceData?.find(
    (item) => item?.id === Number(values.tax_preference_id)
  );
  console.log("taxPrefName", taxPrefName);

  const handleSerialModalOpen = () => {
    setShowSerialModal(true);
  };

  return (
    <Card>
      <Card.Header>
        <h5 className="mb-0">Stock Material</h5>
      </Card.Header>
      <hr />
      <Card.Body className="pt-0">
        <Form onSubmit={handleSubmit}>
          {/* row type */}
          <Row className="mb-3">
            <Col md={12}>
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
          </Row>

          {/* row  inventory_category_id, inv_type_id, branch_name */}
          <Row className="mb-3">
            <Col md={4}>
              <CustomSelect
                label="Inventory Category"
                name="inventory_category_id"
                value={formik.values.inventory_category_id}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                options={metaData.invCatData}
                placeholder="--"
                error={formik.errors.inventory_category_id}
                touched={formik.touched.inventory_category_id}
                required
                lableName="category"
                lableKey="id"
              />
            </Col>
            <Col md={4}>
              <CustomSelect
                label="Inventory Type"
                name="inv_type_id"
                value={formik.values.inv_type_id}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                options={metaData.invTypeData}
                placeholder="--"
                error={formik.errors.inv_type_id}
                touched={formik.touched.inv_type_id}
                required
                lableName="type"
                lableKey="id"
              />
            </Col>
            <Col md={4}>
              <CustomSelect
                label="Warehouse"
                name="warehouse_id"
                value={formik.values.warehouse_id}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                options={metaData.warehouse}
                placeholder="--"
                error={formik.errors.warehouse_id}
                touched={formik.touched.warehouse_id}
                required
                lableName="branch_name"
                lableKey="id"
              />
            </Col>
          </Row>

          {/* row  name, unit, hsn_code */}
          <Row className="mb-3">
            <Col md={4}>
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

            {/* <Col md={4}>
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
            </Col> */}
            {values.type === "Goods" ? (
              <Col md={4}>
                <CustomInput
                  label="HSN Code"
                  name="hsn_code"
                  value={formik.values.hsn_code}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
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
          </Row>

          {/* row  tax_preference_id */}
          <Row className="mb-3  d-flex align-items-center justify-content-center">
            <Col md={4}>
              <CustomSelect
                label="Tax Preference"
                name="tax_preference_id"
                value={formik.values.tax_preference_id}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                options={metaData.taxPreferenceData}
                placeholder="--"
                error={formik.errors.tax_preference_id}
                touched={formik.touched.tax_preference_id}
                required
                lableName="name"
                lableKey="id"
              />
            </Col>
            {taxPrefName?.name.toLowerCase() === "non-taxable" && (
              <Col md={4}>
                <CustomInput
                  label="Exemption Name"
                  name="exemption_reason"
                  value={formik.values.exemption_reason}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter Exemption Reason"
                  touched={formik.touched.exemption_reason}
                  errors={formik.errors.exemption_reason}
                  required={true}
                />
              </Col>
            )}
            <Col md={4}>
              <CustomInput
                type="number"
                label="Balance"
                name="balance"
                value={formik.values.balance}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Balance"
                touched={formik.touched.balance}
                errors={formik.errors.balance}
                required={true}
                min={0}
              />
            </Col>
            <Col className="mt-4" md={4}>
              {values?.balance && (
                <Button variant="primary" onClick={handleSerialModalOpen}>
                  + Serial Number
                </Button>
              )}
            </Col>
          </Row>
          <hr />

          {/* row sales, purchase */}
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
                  {values.type_sales_info ? (
                    <CustomInput
                      label="Selling Price"
                      name="sales_info_selling_price"
                      value={formik.values.sales_info_selling_price}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Enter Selling Price"
                      touched={formik.touched.sales_info_selling_price}
                      errors={formik.errors.sales_info_selling_price}
                      required={true}
                      nameIcon="INR"
                      iconPosition="left"
                    />
                  ) : (
                    <CustomInput
                      label="Selling Price"
                      name="sales_info_selling_price"
                      value={formik.values.sales_info_selling_price}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Enter Selling Price"
                      touched={formik.touched.sales_info_selling_price}
                      errors={formik.errors.sales_info_selling_price}
                      required={true}
                      nameIcon="INR"
                      iconPosition="left"
                      disabled={true}
                      readOnly={true}
                    />
                  )}
                </Col>
              </Row>
            </Col>

            {/* purchase */}
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
                  {values.type_purchase_info ? (
                    <CustomInput
                      label="Cost Price"
                      name="purchase_info_cost_price"
                      value={formik.values.purchase_info_cost_price}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Enter Cost Price"
                      touched={formik.touched.purchase_info_cost_price}
                      errors={formik.errors.purchase_info_cost_price}
                      required={true}
                      nameIcon="INR"
                      iconPosition="left"
                    />
                  ) : (
                    <CustomInput
                      label="Cost Price"
                      name="purchase_info_cost_price"
                      value={formik.values.purchase_info_cost_price}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Enter Cost Price"
                      touched={formik.touched.purchase_info_cost_price}
                      errors={formik.errors.purchase_info_cost_price}
                      required={true}
                      nameIcon="INR"
                      iconPosition="left"
                      disabled={true}
                      readOnly={true}
                    />
                  )}
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={12}>
                  {values.type_purchase_info ? (
                    <CustomSelect
                      label="Preferred Vender"
                      name="purchase_info_vendor"
                      value={formik.values.purchase_info_vendor}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      options={metaData.venderData}
                      placeholder="--"
                      error={formik.errors.purchase_info_vendor}
                      touched={formik.touched.purchase_info_vendor}
                      lableName="name"
                      lableKey="id"
                    />
                  ) : (
                    <CustomSelect
                      label="Preferred Vender"
                      name="purchase_info_vendor"
                      value={formik.values.purchase_info_vendor}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      options={metaData.venderData}
                      placeholder="--"
                      error={formik.errors.purchase_info_vendor}
                      touched={formik.touched.purchase_info_vendor}
                      lableName="name"
                      lableKey="id"
                      disabled={true}
                      readOnly={true}
                    />
                  )}
                </Col>
              </Row>
            </Col>
          </Row>
          <hr />

          {/* row intra_state_tax_rate, inter_state_tax_rate */}
          {taxPrefName?.name?.toLowerCase() !== "non-taxable" && (
            <Row className="mb-3">
              <h6 className="mb-3">Default Text Rates</h6>
              <Col md={4}>
                <CustomSelect
                  label="Intra State Tax Rate"
                  name="intra_state_tax_rate"
                  value={values.intra_state_tax_rate}
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
                  name="inter_state_tax_rate"
                  value={values.inter_state_tax_rate}
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
        </Form>

        {/* Save */}
        <div className="mt-4 text-end">
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? "Loading..." : "Save"}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default AddStockMaterial;
