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
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import CustomRadioGroup from "../../../../components/Form/CustomRadioGroup";
import { typeOfMaterial } from "../../../../mockData";
import CustomCheckbox from "../../../../components/Form/CustomCheckbox";

const AddStockMaterial = () => {
  const [stockNames, setStockNames] = useState([]);
  const [brandNames, setBrandNames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSerialModal, setShowSerialModal] = useState(false);
  const [showSerialModalCr, setShowSerialModalCr] = useState(false);
  const { id } = useParams();
  const [directSend, setDirectSend] = useState("Warehouse");
  const navigate = useNavigate();
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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const initialValues = {
    type: "Goods",
    stock_name_id: "",
    brand_id: "",
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
    branch_id: "",
    client_id: "",
    serialNumbers: [],
    direct_send: "Warehouse",
    unit_id: "",

    Credit: 0,
    Debit: 0,
    remark: "",
    stock_material_id: "",
    stock_particular_id: "",
    supplier_management_id: "",
    select_type: "Debit",
    serialNumbersCr: [],
  };

  // const validationSchema = Yup.object().shape({
  //   stock_name_id: Yup.string().required("Stock name is required"),
  //   brand_id: Yup.string().required("Brand is required"),
  //   type: Yup.string().required("Type is required"),
  //   tax_preference_id: Yup.string().required("Tax preference is required"),
  //   sales_info_selling_price: Yup.string().required(
  //     "Selling price is required"
  //   ),
  //   purchase_info_cost_price: Yup.string().required("Cost price is required"),
  //   unit_id: Yup.string().required("Unit is required"),
  //   ...(directSend === "Customer" && {
  //     client_id: Yup.string().required("Customer is required"),
  //   }),
  //   ...(directSend === "Warehouse" && {
  //     branch_id: Yup.string().required("Warehouse is required"),
  //   }),
  // });

  const formik = useFormik({
    initialValues,
    // validationSchema,
    onSubmit: (values) => {
      const selectedStock = stockNames.find(
        (stock) => stock.id === Number(values.stock_name_id)
      );
      const submissionValues = {
        ...values,
        material: selectedStock ? selectedStock.name : "",
      };

      if (submissionValues.branch_id) {
        delete submissionValues.client_id;
      } else if (submissionValues.client_id) {
        delete submissionValues.branch_id;
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
    handleBlur,
    handleChange,
    errors,
    touched,
    setFieldValue,
  } = formik;

  const fetchStockNames = () => {
    api
      .get("/api/v1/admin/stockName/active")
      .then((res) => {
        if (Array.isArray(res.data.data)) {
          setStockNames(res.data.data);
        } else {
          setStockNames([]);
          console.warn("Stock names API returned non-array data:", res.data);
        }
      })
      .catch((err) => {
        console.error("Error fetching stock names:", err);
        setStockNames([]);
      });
  };

  const fetchBrand = () => {
    api
      .get("/api/v1/admin/brand/active")
      .then((res) => {
        // Handle different possible API response structures
        const brandData = res.data.data || res.data || [];
        if (Array.isArray(brandData)) {
          setBrandNames(brandData);
        } else {
          setBrandNames([]);
          console.warn("Brand API returned non-array data:", res.data);
        }
      })
      .catch((err) => {
        console.error("Error fetching brands:", err);
        setBrandNames([]);
        errorToast("Failed to fetch brand data");
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
          warehouseRes,
          intraTaxRes,
          interTaxRes,
          custRes,
        ] = await Promise.all([
          api.get("/api/v1/admin/unit"),
          api.get("/api/v1/admin/taxPreference/active"),
          api.get("/api/v1/admin/supplierManagement/active"),
          api.get("/api/v1/admin/branch"),
          api.get("/api/v1/admin/intraTax/active"),
          api.get("/api/v1/admin/interTax/active"),
          api.get("/api/v1/admin/client/active"),
        ]);

        setMetaData({
          unitData: unitRes?.data?.data?.filter((e) => e.isActive) || [],
          taxPreferenceData: taxPrefRes.data.data || [],
          venderData: vendorRes.data || [],
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
    fetchStockNames();
    fetchBrand();
  }, []);

  const fetchSerialNumberByStockMaterialIdPag = async (page = 1) => {
    try {
      setLoading(true);
      const res = await api.get(
        `/api/v1/admin/stockMaterialSerialNumber/${id}/pagination?page=${page}&limit=${itemsPerPage}`
      );

      setSrNoPagList(res.data?.data || []);

      const serialNumbers =
        res.data.data.map((item) => item.serialNumber) || [];
      setSerialData(res.data.data);
      setFieldValue("serialNumbers", serialNumbers);

      //  Extract pagination info properly
      const pagination = res.data?.pagination;

      if (pagination) {
        setTotalPages(pagination.totalPages || 1);
      }
    } catch (err) {
      console.error("Error fetching leads:", err);
    } finally {
      setLoading(false);
    }
  };

  //  Fetch again when page changes
  useEffect(() => {
    fetchSerialNumberByStockMaterialIdPag(currentPage);
  }, [currentPage]);

  const fetchStockMaterial = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/v1/admin/stockMaterial/${id}`);
      const data = res.data;

      console.log("Stock Material API Response:", data);

      // Sare fields ko directly yahan set kar do:
      setFieldValue("type", data.type || "Goods");
      setFieldValue("stock_name_id", data.stock_name_id || "");
      setFieldValue("brand_id", data.brand_id || "");
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
      // setFieldValue("branch_id", data.branch_id || "");
      // setFieldValue("client_id", data.client_id || "");
      // setFieldValue("direct_send", data.direct_send || "Warehouse");
      setFieldValue("unit_id", data.unit_id || "");

      setDirectSend(data.direct_send || "Warehouse");

      // Optional: Brand check
      if (data.brand_id && !brandNames.find((b) => b.id === data.brand_id)) {
        console.warn(
          `Brand ID ${data.brand_id} not found in brandNames:`,
          brandNames
        );
      }
    } catch (err) {
      console.error("Error fetching stock material:", err);
      errorToast(
        err.response?.data?.message || "Failed to fetch stock material"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;

    fetchStockMaterial();
  }, [id, setFieldValue, brandNames]);

  const taxPrefName = metaData?.taxPreferenceData?.find(
    (item) => item?.id === Number(values.tax_preference_id)
  );

  const directSendOptions = [
    { id: "1", name: "Warehouse" },
    { id: "2", name: "Customer" },
  ];

  // for update serial number
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

  const handleSaveSerialNumbers = async () => {
    if (!id) {
      setShowSerialModal(false);
      return;
    }
    try {
      // Backend ke liye payload bana rahe hain
      const payload = {
        updates: values.serialNumbers.map((serialNumber, index) => ({
          id: serialData[index]?.id, // ← isme tumhe har serial ka id chahiye hoga
          serialNumber,
        })),
      };

      console.log("Sending payload:", payload);

      await api.put(
        "/api/v1/admin/stockMaterialSerialNumber/updateMultipleSrNo",
        payload
      );

      successToast("Serial numbers updated successfully");
      setShowSerialModal(false);
    } catch (err) {
      console.error("Error updating serial numbers:", err);
      errorToast(
        err.response?.data?.message || "Failed to update serial numbers"
      );
    }
  };

  // for add new serial number

  // Auto-update serialNumbersCr length whenever Credit changes
  useEffect(() => {
    const count = parseInt(values.Credit, 10) || 0;
    let serials = values.serialNumbersCr || [];

    if (serials.length !== count) {
      serials = Array(count)
        .fill("")
        .map((_, i) => serials[i] || "");
      setFieldValue("serialNumbersCr", serials);
    }
  }, [values.Credit]); // <- runs whenever Credit changes

  const handleSerialModalOpenCr = () => {
    setShowSerialModalCr(true);
  };

  const handleSerialChangeCr = (index, value) => {
    const updated = [...values.serialNumbersCr];
    updated[index] = value;
    setFieldValue("serialNumbersCr", updated);
  };

  const handleSaveSerialNumbersCr = async () => {
    console.log(
      "purchase_info_vendor_id",
      typeof values.purchase_info_vendor_id
    );
    try {
      const payload = {
        Credit: values.Credit,
        Debit: 0,
        remark: "Purchase",
        stock_material_id: Number(id),
        stock_particular_id: 2,
        supplier_management_id: values.purchase_info_vendor_id,
        select_type: "Credit",
        client_id: values.client_id,
        serialNumbers: values.serialNumbersCr,
      };

      if (values.purchase_info_vendor_id) {
        delete payload.client_id;
      }
      // if (values.client_id) {
      //   delete payload.supplier_management_id;
      // }

      console.log("Sending payload srno:", payload);

      await api.post("/api/v1/admin/stockManagement", payload);
      fetchSerialNumberByStockMaterialIdPag(currentPage);
      fetchStockMaterial();
      successToast("Stock serial  number added successfully");
      setShowSerialModalCr(false);
    } catch (err) {
      console.error("Error adding serial numbers:", err);
      errorToast(
        err.response?.data?.message || "Failed to adding serial numbers"
      );
    }
  };

  //  Loader
  if (loading) {
    return (
      <div className="loader-div">
        <Spinner animation="border" className="spinner" />
      </div>
    );
  }

  console.log("formik.valuesSrNo", formik.values);
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
            {/* <Col md={4}>
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
            </Col> */}
            {/* <Col md={4}>
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
            </Col> */}
          </Row>

          <Row className="mb-3">
            <Col md={4}>
              <CustomSelect
                label="Stock Name"
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

          {/* <Row className="mb-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>{id ? "Balance" : "Qty"}</Form.Label>
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
              <Button variant="primary" onClick={handleSerialModalOpen}>
                {id && values.balance > 0
                  ? "Update Serial Number"
                  : "+ Serial Number"}
              </Button>
            </Col>
            {id && (
              <Col className="mt-4" md={4}>
                <Button variant="primary" onClick={handleSerialModalOpenCr}>
                  + Serial Number
                </Button>
              </Col>
            )}
          </Row> */}

          {/* Credit srNo*/}
          {/* <Row>
            <Modal
              show={showSerialModalCr}
              onHide={() => setShowSerialModalCr(false)}
            >
              <Modal.Header closeButton>
                <Modal.Title>Add Serial Number</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Col md={4}>
                  <CustomInput
                    type="number"
                    min={0}
                    label="Enter Number"
                    name="Credit"
                    value={formik.values.Credit}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter Credit"
                    touched={formik.touched.Credit}
                    errors={formik.errors.Credit}
                  />
                </Col>
                {values.Credit &&
                  values.serialNumbersCr.map((sn, index) => (
                    <Form.Group key={index} className="mb-2">
                      <Form.Label>Serial Number {index + 1}</Form.Label>
                      <Form.Control
                        type="text"
                        value={sn}
                        required
                        onChange={(e) =>
                          handleSerialChangeCr(index, e.target.value)
                        }
                      />
                    </Form.Group>
                  ))}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="primary" onClick={handleSaveSerialNumbersCr}>
                  Save
                </Button>
              </Modal.Footer>
            </Modal>
          </Row> */}

          {/* for update srNo and add srNo */}
          <Row className="mb-3 d-flex align-items-center">
            <Modal
              show={showSerialModal}
              onHide={() => setShowSerialModal(false)}
            >
              <Modal.Header closeButton>
                <Modal.Title>
                  {" "}
                  {id && values.balance > 0
                    ? "Update Serial Number"
                    : "Add Serial Number"}
                </Modal.Title>
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
                      // disabled={id ? true : false}
                      // style={{ cursor: id ? "not-allowed" : "auto" }}
                    />
                  </Form.Group>
                ))}

                {/* Pagination Controls */}
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
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="primary"
                  

                  onClick={handleSaveSerialNumbers}
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
