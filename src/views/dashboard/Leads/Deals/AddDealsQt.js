import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Card, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../../../../api/axios";
import { successToast } from "../../../../components/Toast/successToast";
import { errorToast } from "../../../../components/Toast/errorToast";
import { useFormik } from "formik";
import CustomSelect from "../../../../components/Form/CustomSelect";
import CustomInput from "../../../../components/Form/CustomInput";
import AddItemModal from "./AddItemModal";

const AddDealsQt = ({ editData }) => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [metaData, setMetaData] = useState({
    leadData: [],
    employeeData: [],
    bankData: [],
    tdsData: [],
    tcsData: [],
  });

  const [selectedItemsData, setSelectedItemsData] = useState(null); // modal data

  const [subTotals, setSubTotals] = useState({
    subTotal: 0,
    taxType: "TDS",
    deductionOption: "",
    // deductionAmount: 0,
    adjustment: 0,
  });

  const initialValues = {
    sender_by_id: "",
    lead_id: "",
    Qt_date: "",
    expiry_date: "",
    companyBank_id: "",
    notes_customer: "",
  };

  const formik = useFormik({
    initialValues,
    onSubmit: async (values) => {
      if (!selectedItemsData)
        return errorToast("Please add at least one item.");

      setLoading(true);

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
          // deductionAmount: parseFloat(subTotals.deductionAmount || 0).toFixed(2),
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
          leaQt_dated_id: values.Qt_date || "",
          sender_by_id: values.sender_by_id || "",
          expiry_date: values.expiry_date || "",
          companyBank_id: values.companyBank_id || "",
          notes_customer: values.notes_customer || "",
        };

        console.log("📤 Final Payload Sent:", payload);

        if (editData) {
          await api.put(`/api/v1/admin/deal/${editData.id}`, payload);
          successToast("Quotation updated successfully");
        } else {
          await api.post("/api/v1/admin/deal", payload);
          successToast("Quotation created successfully");
          console.log("payload", payload);
          navigate("/deals-list");
        }
      } catch (err) {
        console.error(err);
        errorToast(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
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
  } = formik;

  // Fetch dropdown data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [leadRes, empRes, bankRes, tdsRes, tcsRes] = await Promise.all([
          api.get("/api/v1/admin/lead/active"),
          api.get("/api/v1/admin/employee/active"),
          api.get("/api/v1/admin/companyBank/active"),
          api.get("/api/v1/admin/TDS/active"),
          api.get("/api/v1/admin/TCS/active"),
        ]);

        setMetaData({
          leadData: leadRes?.data || [],
          employeeData: empRes?.data?.data || [],
          bankData: bankRes?.data?.data || [],
          tdsData: tdsRes?.data?.data || [],
          tcsData: tcsRes?.data?.data || [],
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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

  console.log("metaData.tdsData", metaData.tdsData);
  console.log("selectedItemsData", selectedItemsData);
  console.log("values", values);
  return (
    <>
      <Card className="p-4 shadow-sm">
        <Card.Header>
          <h5 className="mb-0">Deal</h5>
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
                <CustomSelect
                  label="Assign To"
                  name="sender_by_id"
                  value={values.sender_by_id}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  options={metaData.employeeData}
                  placeholder="--"
                  error={errors.sender_by_id}
                  touched={touched.sender_by_id}
                  required
                  lableName="name"
                  lableKey="id"
                />
              </Col>
              <Col md={4}>
                <CustomInput
                  type="date"
                  label="Quote Date"
                  name="Qt_date"
                  value={values.Qt_date}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter Quote Date"
                  touched={touched.Qt_date}
                  errors={errors.Qt_date}
                  required
                  min={new Date().toISOString().split("T")[0]}
                />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={4}>
                <CustomInput
                  type="date"
                  label="Expiry Date"
                  name="expiry_date"
                  value={values.expiry_date}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter Quote Expiry Date"
                  touched={touched.expiry_date}
                  errors={errors.expiry_date}
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
                {isSubmitting ? "Saving..." : editData ? "Update" : "Save"}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      {showModal && (
        <AddItemModal
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

export default AddDealsQt;
