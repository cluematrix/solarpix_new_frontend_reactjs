import React, { useEffect, useState } from "react";
import {
  Form,
  Button,
  Row,
  Col,
  Card,
  Modal,
  Pagination,
  Spinner,
} from "react-bootstrap";
import CustomSelect from "../../../../components/Form/CustomSelect";
import CustomInput from "../../../../components/Form/CustomInput";
import { useFormik } from "formik";
import { errorToast } from "../../../../components/Toast/errorToast";
import { successToast } from "../../../../components/Toast/successToast";
import api from "../../../../api/axios";
import { useNavigate, useParams } from "react-router-dom";
import CustomRadioGroup from "../../../../components/Form/CustomRadioGroup";
import { typeOfMaterial } from "../../../../mockData";
import CustomCheckbox from "../../../../components/Form/CustomCheckbox";

const AddStockMaterial = () => {
  const [stockNames, setStockNames] = useState([]);
  const [brandNames, setBrandNames] = useState([]);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const [directSend, setDirectSend] = useState("Warehouse");
  const [serialData, setSerialData] = useState([]);
  const [metaData, setMetaData] = useState({
    unitData: [],
    taxPreferenceData: [],
    venderData: [],
    warehouse: [],
    intraTaxData: [],
    interTaxData: [],
    custData: [],
  });
  const [srNoPagList, setSrNoPagList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [showSerialModal, setShowSerialModal] = useState(false);

  const initialValues = {
    type: "Goods",
    stock_name_id: "",
    brand_id: "",
    material: "",
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
    serialNumbers: [],
    unit_id: "",
  };

  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      const selectedStock = stockNames.find(
        (stock) => stock.id === Number(values.stock_name_id)
      );

      const submissionValues = {
        ...values,
        material: selectedStock ? selectedStock.name : "",
      };

      // Delete branch/client depending on direct send
      if (submissionValues.branch_id) delete submissionValues.client_id;
      if (submissionValues.client_id) delete submissionValues.branch_id;

      // Non-Taxable check: set tax IDs to null
      const selectedTaxPref = metaData.taxPreferenceData.find(
        (item) => item.id === Number(values.tax_preference_id)
      );
      if (
        selectedTaxPref &&
        selectedTaxPref.name?.toLowerCase() === "non-taxable"
      ) {
        submissionValues.intra_state_tax_rate_id = null;
        submissionValues.inter_state_tax_rate_id = null;
      }

      if (id) {
        api
          .put(`/api/v1/admin/stockMaterial/${id}`, submissionValues)
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
          .post("/api/v1/admin/stockMaterial", submissionValues)
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
    values,
    handleChange,
    handleBlur,
    errors,
    touched,
    setFieldValue,
  } = formik;

  // Fetch stock names
  const fetchStockNames = () => {
    api
      .get("/api/v1/admin/stockName/active")
      .then((res) => setStockNames(res.data.data || []))
      .catch((err) => {
        console.error("Error fetching stock names:", err);
        setStockNames([]);
      });
  };

  // Fetch brands
  const fetchBrand = () => {
    api
      .get("/api/v1/admin/brand/active")
      .then((res) => {
        const brandData = res.data.data || res.data || [];
        setBrandNames(Array.isArray(brandData) ? brandData : []);
      })
      .catch((err) => {
        console.error("Error fetching brands:", err);
        setBrandNames([]);
        errorToast("Failed to fetch brand data");
      });
  };

  // Fetch metadata
  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [
          unitRes,
          taxPrefRes,
          vendorRes,
          warehouseRes,
          intraTaxRes,
          interTaxRes,
        ] = await Promise.all([
          api.get("/api/v1/admin/unit"),
          api.get("/api/v1/admin/taxPreference/active"),
          api.get("/api/v1/admin/supplierManagement/active"),
          api.get("/api/v1/admin/branch"),
          api.get("/api/v1/admin/intraTax/active"),
          api.get("/api/v1/admin/interTax/active"),
        ]);

        setMetaData({
          unitData: unitRes?.data?.data?.filter((e) => e.isActive) || [],
          taxPreferenceData: taxPrefRes.data.data || [],
          venderData: vendorRes.data || [],
          warehouse: warehouseRes.data.data || [],
          intraTaxData: intraTaxRes.data.data || [],
          interTaxData: interTaxRes.data.data || [],
          custData: [],
        });
      } catch (error) {
        errorToast("Error loading data");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
    fetchStockNames();
    fetchBrand();
  }, []);

  // Fetch stock material for edit
  useEffect(() => {
    if (!id) return;
    const fetchStockMaterial = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/v1/admin/stockMaterial/${id}`);
        const data = res.data;
        setFieldValue("type", data.type || "Goods");
        setFieldValue("stock_name_id", data.stock_name_id || "");
        setFieldValue("brand_id", data.brand_id || "");
        setFieldValue("material", data.material || "");
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
        setFieldValue("unit_id", data.unit_id || "");
        setDirectSend(data.direct_send || "Warehouse");
      } catch (err) {
        console.error("Error fetching stock material:", err);
        errorToast(
          err.response?.data?.message || "Failed to fetch stock material"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchStockMaterial();
  }, [id, setFieldValue]);

  // Auto-clear tax fields if Non-Taxable
  useEffect(() => {
    const selectedTaxPref = metaData.taxPreferenceData.find(
      (item) => item.id === Number(values.tax_preference_id)
    );
    if (
      selectedTaxPref &&
      selectedTaxPref.name?.toLowerCase() === "non-taxable"
    ) {
      setFieldValue("intra_state_tax_rate_id", "");
      setFieldValue("inter_state_tax_rate_id", "");
    }
  }, [values.tax_preference_id]);

  if (loading) {
    return (
      <div className="loader-div">
        <Spinner animation="border" className="spinner" />
      </div>
    );
  }

  const taxPrefName = metaData.taxPreferenceData.find(
    (item) => item?.id === Number(values.tax_preference_id)
  );

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
          </Row>

          <Row className="mb-3">
            <Col md={4}>
              <CustomSelect
                label="Item Name"
                name="stock_name_id"
                value={values.stock_name_id}
                onChange={handleChange}
                onBlur={handleBlur}
                options={stockNames}
                placeholder="--"
                error={errors.stock_name_id}
                touched={touched.stock_name_id}
                required
                lableName="name"
                lableKey="id"
              />
            </Col>
            <Col md={4}>
              <CustomSelect
                label="Make"
                name="brand_id"
                value={values.brand_id}
                onChange={handleChange}
                onBlur={handleBlur}
                options={brandNames}
                placeholder={brandNames.length ? "--" : "No brands available"}
                error={errors.brand_id}
                touched={touched.brand_id}
                required
                lableName="brand_name"
                lableKey="id"
              />
            </Col>
            <Col md={4}>
              {values.type === "Goods" ? (
                <CustomInput
                  label="HSN Code"
                  name="hsc_code"
                  value={values.hsc_code}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter HSN Code"
                />
              ) : (
                <CustomInput
                  label="SAC Code"
                  name="sac"
                  value={values.sac}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter SAC Code"
                />
              )}
            </Col>
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
          </Row>

          {/* Sales & Purchase Info */}
          <Row className="mb-3">
            <Col md={6}>
              <CustomCheckbox
                label="Sales Information"
                name="type_sales_info"
                checked={values.type_sales_info}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.type_sales_info}
                touched={touched.type_sales_info}
              />
              <CustomInput
                label="Selling Price (1 Qty)"
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
            <Col md={6}>
              <CustomCheckbox
                label="Purchase Information"
                name="type_purchase_info"
                checked={values.type_purchase_info}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.type_purchase_info}
                touched={touched.type_purchase_info}
              />
              <CustomInput
                label="Cost Price (1 Qty)"
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

          {/* Default Tax Rates */}
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
