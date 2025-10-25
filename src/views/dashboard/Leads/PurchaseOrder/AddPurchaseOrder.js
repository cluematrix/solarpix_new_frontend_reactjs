// created by sufyan on 11/10/25

import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Card, Table, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../../api/axios";
import { successToast } from "../../../../components/Toast/successToast";
import { errorToast } from "../../../../components/Toast/errorToast";
import { useFormik } from "formik";
import CustomSelect from "../../../../components/Form/CustomSelect";
import CustomInput from "../../../../components/Form/CustomInput";
import AddPurchaseOrderModal from "./AddPurchaseOrderModal";
import CustomRadioGroup from "../../../../components/Form/CustomRadioGroup";
import { defaultNotes, personType } from "../../../../mockData";
import * as Yup from "yup";

const AddPurchaseOrder = () => {
  const { id } = useParams();
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [metaData, setMetaData] = useState({
    tdsData: [],
    tcsData: [],
    paymentTermData: [],
    venderData: [],
    clientData: [],
    branchData: [],
  });

  const [selectedItemsData, setSelectedItemsData] = useState(null); // modal data

  const [subTotals, setSubTotals] = useState({
    subTotal: 0,
    taxType: "TDS",
    deductionOption: "",
    deductionAmount: 0,
    adjustment: 0,
  });

  const initialValues = {
    date: new Date().toISOString().split("T")[0],
    delivery_date: "",
    notes_customer: defaultNotes,
    reference: "",
    payment_terms_id: "",
    type: "Warehouse",
    client_id: null,
    supplier_id: "",
    branch_id: null,
  };

  const validationSchema = Yup.object().shape({
    date: Yup.string().required("Date is required"),
    delivery_date: Yup.string().required("Delivery date is required"),
    notes_customer: Yup.string().required(
      "Customer notes or subsidy is required"
    ),
    payment_terms_id: Yup.string().required("Payment terms is required"),
    supplier_id: Yup.string().required("Supplier is required"),
    type: Yup.string()
      .oneOf(["Warehouse", "Customer"])
      .required("Type is required"),

    branch_id: Yup.string().when("type", {
      is: "Warehouse",
      then: (schema) => schema.required("Branch is required"),
      otherwise: (schema) => schema.notRequired(),
    }),

    client_id: Yup.string().when("type", {
      is: "Customer",
      then: (schema) => schema.required("Client is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      if (!selectedItemsData)
        return errorToast("Please add at least one item.");

      try {
        const isTDS = subTotals.taxType === "TDS";
        const isTCS = subTotals.taxType === "TCS";

        const payload = {
          ...values,
          item_details: selectedItemsData,
          sub_total: parseFloat(subTotals.subTotal || 0).toFixed(2),
          deductionAmount: parseFloat(subTotals.deductionAmount || 0).toFixed(
            2
          ),
          adjustment: parseFloat(subTotals.adjustment || 0),
          total: (
            subTotals.subTotal -
            subTotals.deductionAmount +
            subTotals.adjustment
          ).toFixed(2),

          type: subTotals.taxType || null,
          TDS_id: isTDS ? subTotals.deductionId || null : null,
          TCS_id: isTCS ? subTotals.deductionId || null : null,

          date: values.date || "",
          reference: values.reference || "",
          delivery_date: values.delivery_date || "",
          type: values.type || "",
          notes_customer: values.notes_customer || "",
          client_id: values.client_id || null,
          supplier_id: values.supplier_id || "",
          payment_terms_id: values.payment_terms_id || "",
          branch_id: values.branch_id || null,
        };

        // Send only one of them
        if (values.client_id) delete payload.branch_id;
        else if (values.branch_id) delete payload.client_id;

        console.log("📤 Final Payload Sent:", payload);

        let purchaseOrderRes;
        if (id) {
          purchaseOrderRes = await api.put(
            `/api/v1/admin/purchaseOrder/${id}`,
            payload
          );
          successToast("Purchase Order updated successfully");
        } else {
          purchaseOrderRes = await api.post(
            "/api/v1/admin/purchaseOrder",
            payload
          );
          successToast("Purchase order created successfully");
        }

        // create SR No
        if (purchaseOrderRes && values.branch_id) {
          const payload = {
            selectedCategories: selectedItemsData.selectedCategories,
            branch_id: values.branch_id,
          };
          await api.post("/api/v1/admin/stockMaterialSrNo/createSrNo", payload);
        }

        console.log("purchaseOrderRes", purchaseOrderRes);
        // Step 2: Create Stock Transactions
        if (purchaseOrderRes?.data?.id || purchaseOrderRes?.data?.data?.id) {
          const purchaseOrderId =
            purchaseOrderRes.data.id || purchaseOrderRes.data.data.id;
          console.log("purchaseOrderResUnder", purchaseOrderRes);

          // for stock transaction
          const stockPayload = {
            branch_id: values.branch_id,
            client_id: values.client_id,
            reference_type: "PurchaseOrder",
            reference_id: purchaseOrderId,
            item_details: selectedItemsData,
          };

          // Send only one of them
          if (values.client_id) delete stockPayload.branch_id;
          else if (values.branch_id) delete stockPayload.client_id;

          try {
            await api.post(
              "/api/v1/admin/stockTransaction/multiple",
              stockPayload
            );
            console.log(" Stock transaction recorded successfully");
          } catch (stockErr) {
            console.error("Error creating stock transaction:", stockErr);
            errorToast("Purchase saved, but stock transaction failed!");
          }
        }

        navigate("/purchase-order-list");
      } catch (err) {
        console.error(err);
        errorToast(err.response?.data?.message || err.message);
      }
    },
  });

  const {
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    errors,
    touched,
    isSubmitting,
    setFieldValue,
  } = formik;

  // Fetch dropdown data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [tdsRes, tcsRes, paymentRes, venderRes, custRes, branchRes] =
          await Promise.all([
            api.get("/api/v1/admin/TDS/active"),
            api.get("/api/v1/admin/TCS/active"),
            api.get("/api/v1/admin/paymentTerm/active"),
            api.get("/api/v1/admin/supplierManagement/active"),
            api.get("/api/v1/admin/client/active"),
            api.get("/api/v1/admin/branch/active"),
          ]);
        setMetaData({
          tdsData: tdsRes?.data?.data || [],
          tcsData: tcsRes?.data?.data || [],
          paymentTermData: paymentRes?.data || [],
          venderData: venderRes?.data || [],
          clientData: custRes?.data.data || [],
          branchData: branchRes?.data.data || [],
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Fetch purchase orders data if editing (id present)
  useEffect(() => {
    if (!id) return;

    const fetchDealById = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/api/v1/admin/purchaseOrder/${id}`);
        const purchaseOrder = data?.data || data;

        // Prefill form fields
        setFieldValue("date", purchaseOrder.date?.split("T")[0] || "");
        setFieldValue("reference", purchaseOrder.reference || "");
        setFieldValue("payment_terms_id", purchaseOrder.payment_terms_id || "");
        setFieldValue(
          "delivery_date",
          purchaseOrder.delivery_date?.split("T")[0] || ""
        );
        setFieldValue("type", purchaseOrder.type || "");
        setFieldValue("notes_customer", purchaseOrder.notes_customer || "");
        setFieldValue("client_id", purchaseOrder.client_id || "");
        setFieldValue("client_id", purchaseOrder.client_id || "");
        setFieldValue("supplier_id", purchaseOrder.supplier_id || "");
        setFieldValue(
          "purchase_order_no",
          purchaseOrder.purchase_order_no || ""
        );
        setFieldValue("branch_id", purchaseOrder.branch_id || "");

        // Prefill item details
        if (purchaseOrder.item_details) {
          setSelectedItemsData(purchaseOrder.item_details);
        }

        // Prefill subtotal and tax data
        const isTDS = !!purchaseOrder.TDS_id;
        const isTCS = !!purchaseOrder.TCS_id;
        const taxType = isTDS ? "TDS" : isTCS ? "TCS" : "";
        const deductionId = isTDS
          ? purchaseOrder.TDS_id
          : isTCS
          ? purchaseOrder.TCS_id
          : null;

        // Recalculate deduction based on response
        const deductionAmount = parseFloat(purchaseOrder.deductionAmount || 0);
        const subTotal = parseFloat(purchaseOrder.sub_total || 0);
        const adjustment = parseFloat(purchaseOrder.adjustment || 0);
        const deductionPercentage =
          purchaseOrder.percentage ||
          (subTotal > 0 ? ((deductionAmount / subTotal) * 100).toFixed(2) : 0);

        setSubTotals({
          subTotal: subTotal,
          taxType: taxType,
          deductionId: deductionId,
          deductionOption: deductionPercentage,
          deductionName: purchaseOrder.deductionName || "",
          deductionAmount: deductionAmount,
          adjustment: adjustment,
        });
      } catch (err) {
        console.error("Failed to fetch purchase orders data:", err);
        errorToast("Failed to load purchase orders details");
      } finally {
        setLoading(false);
      }
    };

    fetchDealById();
  }, [id]);

  // Whenever selectedItemsData changes, recalc subtotal
  useEffect(() => {
    if (!selectedItemsData) return;

    let total = selectedItemsData.selectedCategories.reduce(
      (acc, cat) => acc + cat.grandTotal,
      0
    );

    setSubTotals((prev) => ({
      ...prev,
      subTotal: total,
      deductionAmount:
        prev.deductionOption === "commission"
          ? parseFloat((total * 0.02).toFixed(2))
          : prev.deductionAmount,
    }));
  }, [selectedItemsData]);

  // Whenever selectedItemsData changes, recalc subtotal including CGST & SGST
  useEffect(() => {
    if (!selectedItemsData) return;

    const total = selectedItemsData.selectedCategories.reduce(
      (acc, cat) => acc + (cat.finalAmount || cat.grandTotal),
      0
    );

    setSubTotals((prev) => ({
      ...prev,
      subTotal: total,
      deductionAmount:
        prev.deductionOption === "commission"
          ? parseFloat((total * 0.02).toFixed(2))
          : prev.deductionAmount,
    }));
  }, [selectedItemsData]);

  // create purchase orders number
  const getFinancialYear = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    return month >= 4
      ? `${String(year).slice(-2)}-${String(year + 1).slice(-2)}`
      : `${String(year - 1).slice(-2)}-${String(year).slice(-2)}`;
  };

  useEffect(() => {
    const initQuotation = async () => {
      try {
        const fy = getFinancialYear();
        const res = await api.get("/api/v1/admin/purchaseOrder");
        const deals = res.data || [];
        const fyDeals = deals.filter(
          (d) => d.quotation_no && d.quotation_no.includes(`QT/${fy}/`)
        );

        if (fyDeals.length > 0) {
          const lastNo = Math.max(
            ...fyDeals.map((d) => parseInt(d.quotation_no.split("/").pop(), 10))
          );
          const newNo = String(lastNo + 1).padStart(2, "0");
          setFieldValue("quotation_no", `QT/${fy}/${newNo}`);
        } else {
          setFieldValue("quotation_no", `QT/${fy}/01`);
        }
      } catch (err) {
        console.error("Failed to set purchase orders number:", err);
      }
    };

    if (!id) {
      initQuotation();
    } else if (id) {
      setFieldValue("quotation_no", values.quotation_no);
    }
  }, [id]);

  // fetch subsidy
  useEffect(() => {
    const fetchSubsidy = async () => {
      try {
        const res = await api.get("/api/v1/admin/subsidy/getAllSubsidy");
        if (res.data?.data && Array.isArray(res.data.data.subsidyFields)) {
          const fields = res.data.data.subsidyFields;

          // Format fields into a readable string
          const formattedText = fields
            .map((f) => `${f.label} = ${f.value}`)
            .join("\n");

          // Set the formatted text into Formik's textarea field
          formik.setFieldValue("notes_customer", formattedText);
        } else {
          formik.setFieldValue("notes_customer", "");
        }
      } catch (error) {
        console.error("Error fetching subsidy:", error);
        formik.setFieldValue("notes_customer", "");
      }
    };

    fetchSubsidy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //  Loader while checking permissions
  if (loading) {
    return (
      <div className="loader-div">
        <Spinner animation="border" className="spinner" />
      </div>
    );
  }

  // Handle tax change per category
  const handleTaxChange = (catId, selectedTax, type) => {
    setSelectedItemsData((prev) => {
      const newCats = prev.selectedCategories.map((cat) => {
        if (cat.id === catId) {
          const taxRate =
            type === "intra" ? selectedTax.intra_per : selectedTax.inter_per;
          const totalTax = (cat.grandTotal * taxRate) / 100;
          const cgst = totalTax / 2;
          const sgst = totalTax / 2;

          return {
            ...cat,
            selectedTax,
            cgst,
            sgst,
            finalAmount: cat.grandTotal + cgst + sgst,
          };
        }
        return cat;
      });
      return { ...prev, selectedCategories: newCats };
    });
  };

  console.log("metaData.tdsData", metaData.tdsData);
  console.log("selectedItemsData", selectedItemsData);
  console.log("values", values);
  return (
    <>
      <Card>
        <Card.Header>
          <h5 className="mb-0">Purchase Orders</h5>
        </Card.Header>
        <hr />
        <Card.Body className="pt-0">
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3 ">
              <Col md={4}>
                <CustomSelect
                  label="Supplier Name"
                  name="supplier_id"
                  value={values.supplier_id}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  options={metaData.venderData}
                  placeholder="--"
                  error={errors.supplier_id}
                  touched={touched.supplier_id}
                  lableName="name"
                  lableKey="id"
                  required
                />
              </Col>
              <Col md={4}>
                <CustomRadioGroup
                  label="Type"
                  name="type"
                  options={personType}
                  value={values.type}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  touched={touched.type}
                  error={errors.type}
                  required
                />
              </Col>
              <Col md={4}>
                {values.type === "Customer" ? (
                  <CustomSelect
                    label="Customer"
                    name="client_id"
                    value={values.client_id}
                    onChange={(e) => {
                      handleChange(e);
                      setFieldValue("branch_id", "");
                    }}
                    onBlur={handleBlur}
                    options={metaData.clientData}
                    placeholder="--"
                    error={errors.client_id}
                    touched={touched.client_id}
                    required
                    lableName="name"
                    lableKey="id"
                  />
                ) : (
                  <CustomSelect
                    label="Warehouse"
                    name="branch_id"
                    value={values.branch_id}
                    onChange={(e) => {
                      handleChange(e);
                      setFieldValue("client_id", "");
                    }}
                    onBlur={handleBlur}
                    options={metaData.branchData}
                    placeholder="--"
                    error={errors.branch_id}
                    touched={touched.branch_id}
                    required
                    lableName="branch_name"
                    lableKey="id"
                  />
                )}
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={4}>
                <CustomInput
                  label="Reference"
                  name="reference"
                  value={values.reference}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter Reference"
                  touched={touched.reference}
                  errors={errors.reference}
                />
              </Col>
              <Col md={4}>
                <CustomSelect
                  label="Payment Terms"
                  name="payment_terms_id"
                  value={values.payment_terms_id}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  options={metaData.paymentTermData}
                  placeholder="--"
                  error={errors.payment_terms_id}
                  touched={touched.payment_terms_id}
                  required
                  lableName="payment_term"
                  lableKey="id"
                />
              </Col>
              <Col md={4}>
                <CustomInput
                  type="date"
                  label="Date"
                  name="date"
                  value={values.date}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Select Date"
                  touched={touched.date}
                  errors={errors.date}
                  required
                  min={new Date().toISOString().split("T")[0]}
                />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={4}>
                <CustomInput
                  type="date"
                  label="Delivery Date"
                  name="delivery_date"
                  value={values.delivery_date}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Select Delivery Date"
                  touched={touched.delivery_date}
                  errors={errors.delivery_date}
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
              </Col>
            </Row>

            {/* Items Table */}
            <div className="table-responsive">
              <Table hover responsive>
                <thead>
                  <tr className="table-gray">
                    <th>Item Category</th>
                    <th>Description</th>
                    <th>Quantity</th>
                    <th>Amount</th>
                    <th>Tax</th>
                    <th>CGST</th>
                    <th>SGST</th>
                    <th>Final Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {!selectedItemsData ? (
                    <tr>
                      <td colSpan="8" className="text-center">
                        No Item Available
                      </td>
                    </tr>
                  ) : (
                    selectedItemsData.selectedCategories.map((cat) => {
                      console.log("cat", cat);
                      return (
                        <tr key={cat.id}>
                          <td>
                            <strong>{cat.name}</strong>
                          </td>
                          <td>
                            <ul style={{ paddingLeft: "18px", margin: 0 }}>
                              {cat.items.map((item) => (
                                <li key={item.id}>
                                  {item.name} <br />
                                  Qty: {item.quantity} <br /> Price: ₹
                                  {parseFloat(item.price).toFixed(2)} <br />
                                  Total: ₹{parseFloat(item.total).toFixed(2)}
                                </li>
                              ))}
                            </ul>
                          </td>
                          <td>{cat.totalQuantity}</td>
                          <td>₹{cat.grandTotal.toFixed(2)}</td>
                          <td>
                            <Form.Select
                              size="sm"
                              value={cat.selectedTax?.id || ""}
                              onChange={(e) => {
                                const selectedId = parseInt(e.target.value);
                                if (
                                  cat.intraTax &&
                                  cat.intraTax.id === selectedId
                                ) {
                                  handleTaxChange(
                                    cat.id,
                                    cat.intraTax,
                                    "intra"
                                  );
                                } else if (
                                  cat.interTax &&
                                  cat.interTax.id === selectedId
                                ) {
                                  handleTaxChange(
                                    cat.id,
                                    cat.interTax,
                                    "inter"
                                  );
                                }
                              }}
                            >
                              <option value="">-- Select Tax --</option>
                              {cat.intraTax && (
                                <option value={cat.intraTax.id}>
                                  Intra Tax - {cat.intraTax.name} -{" "}
                                  {cat.intraTax.intra_per}%
                                </option>
                              )}
                              {cat.interTax && (
                                <option value={cat.interTax.id}>
                                  Inter Tax - {cat.interTax.name} -{" "}
                                  {cat.interTax.inter_per}%
                                </option>
                              )}
                            </Form.Select>
                          </td>
                          <td>₹{cat?.cgst?.toFixed(2)}</td>
                          <td>₹{cat?.sgst?.toFixed(2)}</td>
                          <td>₹{cat?.finalAmount?.toFixed(2)}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </Table>
            </div>

            <Row>
              <div className="text-start">
                <Button variant="primary" onClick={() => setShowModal(true)}>
                  + Item
                </Button>
              </div>
            </Row>

            {/* Subtotal Card */}
            {selectedItemsData && (
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "flex-end",
                }}
              >
                <Card
                  className="p-3 my-3 shadow-lg"
                  style={{
                    backgroundColor: "#f6f6f6",
                    width: "430px",
                  }}
                >
                  <Row className="mb-2">
                    <Col md={6}>
                      <strong style={{ fontSize: "13px" }}>
                        Sub Total (Tax Inclusive)
                      </strong>
                    </Col>
                    <Col md={6} className="text-end">
                      ₹{subTotals.subTotal.toFixed(2)}
                    </Col>
                  </Row>

                  {/* --- Tax Type Radios --- */}
                  <Row className="mb-2 align-items-center">
                    <Col md={4} className="d-flex">
                      <Form.Check
                        type="radio"
                        id="TDS"
                        label="TDS"
                        name="taxType"
                        value="TDS"
                        checked={subTotals.taxType === "TDS"}
                        onChange={(e) => {
                          const selectedType = e.target.value;
                          setSubTotals((prev) => ({
                            ...prev,
                            taxType: selectedType,
                            deductionOption: "", // reset dropdown
                            deductionId: null,
                            deductionName: "",
                            deductionAmount: 0,
                          }));
                        }}
                        style={{ marginRight: "10px" }}
                      />
                      <Form.Check
                        type="radio"
                        id="TCS"
                        label="TCS"
                        name="taxType"
                        value="TCS"
                        checked={subTotals.taxType === "TCS"}
                        onChange={(e) => {
                          const selectedType = e.target.value;
                          setSubTotals((prev) => ({
                            ...prev,
                            taxType: selectedType,
                            deductionOption: "",
                            deductionId: null,
                            deductionName: "",
                            deductionAmount: 0,
                          }));
                        }}
                      />
                    </Col>
                  </Row>
                  <Row className="mb-2 align-items-center">
                    {/* --- Dropdown --- */}
                    <Col md={6} className="mt-1">
                      <Form.Select
                        value={subTotals.deductionId || ""}
                        onChange={(e) => {
                          const selectedId = parseInt(e.target.value);
                          let selectedItem = null;

                          if (subTotals.taxType === "TDS") {
                            selectedItem = metaData.tdsData.find(
                              (x) => x.id === selectedId
                            );
                          } else if (subTotals.taxType === "TCS") {
                            selectedItem = metaData.tcsData.find(
                              (x) => x.id === selectedId
                            );
                          }

                          if (selectedItem) {
                            const percentage = parseFloat(
                              selectedItem.percentage || 0
                            );
                            const deduction =
                              (subTotals.subTotal * percentage) / 100;

                            setSubTotals((prev) => ({
                              ...prev,
                              deductionId: selectedItem.id,
                              deductionOption: percentage, // store percentage for calculations
                              deductionName: selectedItem.name,
                              deductionAmount: deduction,
                            }));
                          }
                        }}
                        disabled={!subTotals.taxType}
                        size="sm"
                      >
                        <option value="">
                          -- Select {subTotals.taxType || "Type"} --
                        </option>

                        {subTotals.taxType === "TDS" &&
                          metaData.tdsData?.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.name} [{item.percentage}%]
                            </option>
                          ))}

                        {subTotals.taxType === "TCS" &&
                          metaData.tcsData?.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.name} [{item.percentage}%]
                            </option>
                          ))}
                      </Form.Select>

                      {subTotals.deductionName && (
                        <small
                          className="text-muted"
                          style={{ fontSize: "12px" }}
                        >
                          {subTotals.deductionName} ({subTotals.deductionOption}
                          %)
                        </small>
                      )}
                    </Col>

                    {/* --- Deduction Display --- */}
                    <Col md={6} className="text-end">
                      - ₹{subTotals?.deductionAmount?.toFixed(2)}
                    </Col>
                  </Row>

                  <Row className="mb-2 align-items-center">
                    <Col md={4}>
                      <p style={{ fontSize: "15px" }}>Adjustment</p>
                    </Col>
                    <Col md={4}>
                      <Form.Control
                        type="number"
                        value={subTotals.adjustment}
                        onChange={(e) =>
                          setSubTotals((prev) => ({
                            ...prev,
                            adjustment: parseFloat(e.target.value) || 0,
                          }))
                        }
                        size="sm"
                      />
                    </Col>
                    <Col md={4} className="text-end">
                      ₹{subTotals.adjustment.toFixed(2)}
                    </Col>
                  </Row>

                  <hr />

                  <Row>
                    <Col md={6}>
                      <strong>Total (₹)</strong>
                    </Col>
                    <Col md={6} className="text-end">
                      <strong>
                        ₹
                        {(
                          subTotals.subTotal -
                          subTotals.deductionAmount +
                          subTotals.adjustment
                        ).toFixed(2)}
                      </strong>
                    </Col>
                  </Row>
                </Card>
              </div>
            )}

            <Row className="mt-4">
              <Col md={12}>
                <CustomInput
                  as="textarea"
                  label="Notes"
                  name="notes_customer"
                  value={values.notes_customer}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter Notes"
                  touched={touched.notes_customer}
                  errors={errors.notes_customer}
                  row={4}
                />
              </Col>
            </Row>

            {/* Save Button */}
            <div className="text-end mt-2">
              <Button variant="primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : id ? "Update" : "Save"}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      {showModal && (
        <AddPurchaseOrderModal
          show={showModal}
          handleClose={() => setShowModal(false)}
          existingData={selectedItemsData}
          onSave={(finalResponse) => {
            setSelectedItemsData(finalResponse);
            setShowModal(false);
          }}
          formik={formik}
        />
      )}
    </>
  );
};

export default AddPurchaseOrder;
