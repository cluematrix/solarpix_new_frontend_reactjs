import React, { useEffect, useState } from "react";
import { Form, Button, Row, Col, Card, Modal, Spinner } from "react-bootstrap";
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
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "brand" or "unit"
  const [newItemName, setNewItemName] = useState("");

  const initialValues = {
    type: "Goods",
    stock_name_id: "",
    brand_id: "",
    material: "",
    hsc_code: "",
    sac: "",
    type_sales_info: false,
    type_purchase_info: false,
    sales_info_selling_price: "",
    purchase_info_cost_price: "",
    purchase_info_vendor_id: "",
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

      if (submissionValues.branch_id) delete submissionValues.client_id;
      if (submissionValues.client_id) delete submissionValues.branch_id;

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
    isSubmitting,
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
        const [unitRes, vendorRes, warehouseRes] = await Promise.all([
          api.get("/api/v1/admin/unit"),
          api.get("/api/v1/admin/supplierManagement/active"),
          api.get("/api/v1/admin/branch"),
        ]);

        setMetaData({
          unitData: unitRes?.data?.data?.filter((e) => e.isActive) || [],
          taxPreferenceData: [],
          venderData: vendorRes.data || [],
          warehouse: warehouseRes.data.data || [],
          intraTaxData: [],
          interTaxData: [],
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

  // Handle opening the modal for adding new brand or unit
  const handleAddNewOption = (type) => {
    setModalType(type);
    setNewItemName("");
    setShowAddModal(true);
  };

  // Handle saving new brand or unit
  const handleSaveNewItem = async () => {
    if (!newItemName.trim()) {
      errorToast(`Please enter a valid ${modalType} name`);
      return;
    }

    try {
      setLoading(true);
      const payload =
        modalType === "brand"
          ? { brand_name: newItemName }
          : { unit: newItemName };
      const endpoint =
        modalType === "brand" ? "/api/v1/admin/brand" : "/api/v1/admin/unit";

      const response = await api.post(endpoint, payload);
      const newItem = response.data.data || response.data;

      if (modalType === "brand") {
        setBrandNames([...brandNames, newItem]);
        setFieldValue("brand_id", newItem.id);
      } else {
        setMetaData((prev) => ({
          ...prev,
          unitData: [...prev.unitData, newItem],
        }));
        setFieldValue("unit_id", newItem.id);
      }

      successToast(
        `${
          modalType.charAt(0).toUpperCase() + modalType.slice(1)
        } added successfully`
      );
      setShowAddModal(false);
      setNewItemName("");
    } catch (err) {
      console.error(`Error adding new ${modalType}:`, err);
      errorToast(`Failed to add new ${modalType}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loader-div">
        <Spinner animation="border" className="spinner" />
      </div>
    );
  }

  return (
    <Card>
      <Card.Header>
        <h5 className="mb-0">Item</h5>
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
              <Form.Group>
                <Form.Label>
                  Make <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  name="brand_id"
                  value={values.brand_id}
                  required
                  onChange={(e) => {
                    if (e.target.value === "add-new") {
                      handleAddNewOption("brand");
                    } else {
                      handleChange(e);
                    }
                  }}
                  onBlur={handleBlur}
                >
                  <option value="">
                    {brandNames.length ? "--" : "No brands available"}
                  </option>
                  {brandNames.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.brand_name}
                    </option>
                  ))}
                  <option
                    value="add-new"
                    style={{ fontWeight: "bold", color: "#3a57e8" }}
                  >
                    + Add Brand
                  </option>
                </Form.Select>
                {touched.brand_id && errors.brand_id && (
                  <Form.Text className="text-danger">
                    {errors.brand_id}
                  </Form.Text>
                )}
              </Form.Group>
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
          </Row>
          <Row className="mb-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>
                  Unit <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  name="unit_id"
                  value={values.unit_id}
                  required
                  onChange={(e) => {
                    if (e.target.value === "add-new") {
                      handleAddNewOption("unit");
                    } else {
                      handleChange(e);
                    }
                  }}
                  onBlur={handleBlur}
                >
                  <option value="">--</option>
                  {metaData.unitData.map((unit) => (
                    <option key={unit.id} value={unit.id}>
                      {unit.unit}
                    </option>
                  ))}
                  <option
                    value="add-new"
                    style={{ fontWeight: "bold", color: "#3a57e8" }}
                  >
                    + Add Unit
                  </option>
                </Form.Select>
                {touched.unit_id && errors.unit_id && (
                  <Form.Text className="text-danger">
                    {errors.unit_id}
                  </Form.Text>
                )}
              </Form.Group>
            </Col>
          </Row>
          <br></br>
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

          <div className="mt-4 text-end">
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? "Loading..." : "Save"}
            </Button>
          </div>
        </Form>

        {/* Modal for Adding New Brand or Unit */}
        <Modal
          show={showAddModal}
          centered
          backdrop="static"
          onHide={() => setShowAddModal(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>
              Add New {modalType === "brand" ? "Brand" : "Unit"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label>
                {modalType === "brand" ? "Brand Name" : "Unit Name"}
              </Form.Label>
              <Form.Control
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder={`Enter ${
                  modalType === "brand" ? "brand name" : "unit name"
                }`}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSaveNewItem}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </Button>
          </Modal.Footer>
        </Modal>
      </Card.Body>
    </Card>
  );
};

export default AddStockMaterial;
