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
import AddSalesOrderModal from "./AddSalesOrderModal";

const AddSalesOrder = () => {
  const { id } = useParams();
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [metaData, setMetaData] = useState({
    leadData: [],
    employeeData: [],
    bankData: [],
    tdsData: [],
    tcsData: [],
    paymentTermData: [],
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
    assign_to_emp_id: "",
    lead_id: "",
    sales_order_date: "",
    expected_shipment_date: "",
    companyBank_id: "",
    notes_customer: "",
    quotation_no: "",
    reference: "",
    payment_terms_id: "",
  };

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    onSubmit: async (values) => {
      if (!selectedItemsData)
        return errorToast("Please add at least one item.");

      try {
        // Determine which ID to send
        const isTDS = subTotals.taxType === "TDS";
        const isTCS = subTotals.taxType === "TCS";

        const payload = {
          ...values,

          // 🔹 item details JSON
          item_details: selectedItemsData,

          // 🔹 subtotal, adjustment, and total calculations
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

          // 🔹 Tax type details
          type: subTotals.taxType || null,
          TDS_id: isTDS ? subTotals.deductionId || null : null,
          TCS_id: isTCS ? subTotals.deductionId || null : null,

          lead_id: values.lead_id || "",
          leaQt_dated_id: values.sales_order_date || "",
          assign_to_emp_id: values.assign_to_emp_id || "",
          expected_shipment_date: values.expected_shipment_date || "",
          companyBank_id: values.companyBank_id || "",
          notes_customer: values.notes_customer || "",
          deal_stage_id: 2,
        };

        console.log("📤 Final Payload Sent:", payload);

        if (id) {
          await api.put(`/api/v1/admin/salesOrder/${id}`, payload);
          successToast("Sales Orders updated successfully");
        } else {
          await api.post("/api/v1/admin/salesOrder", payload);
          successToast("Sales Orders created successfully");
          console.log("payload", payload);
          navigate("/sales-order-list");
        }
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
        const [leadRes, empRes, bankRes, tdsRes, tcsRes, paymentRes] =
          await Promise.all([
            api.get("/api/v1/admin/lead/active"),
            api.get("/api/v1/admin/employee/active"),
            api.get("/api/v1/admin/companyBank/active"),
            api.get("/api/v1/admin/TDS/active"),
            api.get("/api/v1/admin/TCS/active"),
            api.get("/api/v1/admin/paymentTerm/active"),
          ]);

        setMetaData({
          leadData: leadRes?.data || [],
          employeeData: empRes?.data?.data || [],
          bankData: bankRes?.data?.data || [],
          tdsData: tdsRes?.data?.data || [],
          tcsData: tcsRes?.data?.data || [],
          paymentTermData: paymentRes?.data || [],
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Fetch sales orders data if editing (id present)
  useEffect(() => {
    if (!id) return;

    const fetchDealById = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/api/v1/admin/salesOrder/${id}`);
        const salesOrder = data?.data || data;

        // ✅ Prefill form fields
        setFieldValue("lead_id", salesOrder.lead_id || "");
        setFieldValue("assign_to_emp_id", salesOrder.assign_to_emp_id || "");
        setFieldValue(
          "sales_order_date",
          salesOrder.sales_order_date?.split("T")[0] || ""
        );
        setFieldValue(
          "expected_shipment_date",
          salesOrder.expected_shipment_date?.split("T")[0] || ""
        );
        setFieldValue("companyBank_id", salesOrder.companyBank_id || "");
        setFieldValue("notes_customer", salesOrder.notes_customer || "");
        setFieldValue("quotation_no", salesOrder.quotation_no || "");

        // ✅ Prefill item details
        if (salesOrder.item_details) {
          setSelectedItemsData(salesOrder.item_details);
        }

        // ✅ Prefill subtotal and tax data
        const isTDS = !!salesOrder.TDS_id;
        const isTCS = !!salesOrder.TCS_id;
        const taxType = isTDS ? "TDS" : isTCS ? "TCS" : "";
        const deductionId = isTDS
          ? salesOrder.TDS_id
          : isTCS
          ? salesOrder.TCS_id
          : null;

        // ✅ Recalculate deduction based on response
        const deductionAmount = parseFloat(salesOrder.deductionAmount || 0);
        const subTotal = parseFloat(salesOrder.sub_total || 0);
        const adjustment = parseFloat(salesOrder.adjustment || 0);
        const deductionPercentage =
          salesOrder.percentage ||
          (subTotal > 0 ? ((deductionAmount / subTotal) * 100).toFixed(2) : 0);

        setSubTotals({
          subTotal: subTotal,
          taxType: taxType,
          deductionId: deductionId,
          deductionOption: deductionPercentage,
          deductionName: salesOrder.deductionName || "",
          deductionAmount: deductionAmount,
          adjustment: adjustment,
        });
      } catch (err) {
        console.error("Failed to fetch sales orders data:", err);
        errorToast("Failed to load sales orders details");
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

  // Handle deduction option dynamically
  useEffect(() => {
    if (subTotals.deductionOption === "commission") {
      setSubTotals((prev) => ({
        ...prev,
        deductionAmount: parseFloat((prev.subTotal * 0.02).toFixed(2)),
      }));
    }
  }, [subTotals.deductionOption, subTotals.subTotal]);

  // create sales orders number
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
        const res = await api.get("/api/v1/admin/salesOrder");
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
        console.error("Failed to set sales orders number:", err);
      }
    };

    if (!id) {
      initQuotation();
    } else if (id) {
      setFieldValue("quotation_no", values.quotation_no);
    }
  }, [id]);

  //  Loader while checking permissions
  if (loading) {
    return (
      <div className="loader-div">
        <Spinner animation="border" className="spinner" />
      </div>
    );
  }

  console.log("metaData.tdsData", metaData.tdsData);
  console.log("selectedItemsData", selectedItemsData);
  console.log("values", values);
  return (
    <>
      <Card>
        <Card.Header>
          <h5 className="mb-0">Sales Orders</h5>
        </Card.Header>
        <hr />
        <Card.Body className="pt-0">
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col md={4}>
                <CustomSelect
                  label="Customer"
                  name="lead_id"
                  value={values.lead_id}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  options={metaData.leadData}
                  placeholder="--"
                  error={errors.lead_id}
                  touched={touched.lead_id}
                  required
                  lableName="name"
                  lableKey="id"
                />
              </Col>
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
                  label="Assign To"
                  name="assign_to_emp_id"
                  value={values.assign_to_emp_id}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  options={metaData.employeeData}
                  placeholder="--"
                  error={errors.assign_to_emp_id}
                  touched={touched.assign_to_emp_id}
                  required
                  lableName="name"
                  lableKey="id"
                />
              </Col>
            </Row>

            <Row className="mb-3">
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
            </Row>
            <Row className="mb-3">
              <Col md={4}>
                <CustomInput
                  type="date"
                  label="Sales Order Date"
                  name="sales_order_date"
                  value={values.sales_order_date}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter Quote Date"
                  touched={touched.sales_order_date}
                  errors={errors.sales_order_date}
                  required
                  min={new Date().toISOString().split("T")[0]}
                />
              </Col>
              <Col md={4}>
                <CustomInput
                  type="date"
                  label="Expected Shipment Date"
                  name="expected_shipment_date"
                  value={values.expected_shipment_date}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter Quote Expiry Date"
                  touched={touched.expected_shipment_date}
                  errors={errors.expected_shipment_date}
                  min={new Date().toISOString().split("T")[0]}
                />
              </Col>
              <Col md={4}>
                <CustomSelect
                  label="Bank"
                  name="companyBank_id"
                  value={values.companyBank_id}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  options={metaData.bankData}
                  placeholder="--"
                  error={errors.companyBank_id}
                  touched={touched.companyBank_id}
                  required
                  lableName="bank_name"
                  lableKey="id"
                />
              </Col>
            </Row>

            <Row className="mb-4">
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
                  row={2}
                />
              </Col>
            </Row>

            {/* Items Table */}
            <div className="table-responsive">
              <Table hover responsive className="table">
                <thead>
                  <tr className="table-gray">
                    <th>Item Category</th>
                    <th>Description</th>
                    <th>Quantity</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {!selectedItemsData ? (
                    <tr>
                      <td colSpan="4" className="text-center">
                        No Item Available
                      </td>
                    </tr>
                  ) : (
                    selectedItemsData.selectedCategories.map((cat) => (
                      <tr key={cat.id}>
                        <td>
                          <strong>{cat.name}</strong>
                        </td>
                        <td>
                          <ul style={{ paddingLeft: "18px", margin: 0 }}>
                            {cat.items.map((item) => (
                              <li key={item.id}>
                                {item.name} — Qty: {item.quantity} — Price: ₹
                                {parseFloat(item.price).toFixed(2)} — Total: ₹
                                {parseFloat(item.total).toFixed(2)}
                              </li>
                            ))}
                          </ul>
                        </td>
                        <td>
                          <strong>{cat.totalQuantity}</strong>
                        </td>
                        <td>
                          <strong>₹{cat.grandTotal.toFixed(2)}</strong>
                        </td>
                      </tr>
                    ))
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
        <AddSalesOrderModal
          show={showModal}
          handleClose={() => setShowModal(false)}
          existingData={selectedItemsData}
          onSave={(finalResponse) => {
            setSelectedItemsData(finalResponse);
            setShowModal(false);
          }}
        />
      )}
    </>
  );
};

export default AddSalesOrder;
