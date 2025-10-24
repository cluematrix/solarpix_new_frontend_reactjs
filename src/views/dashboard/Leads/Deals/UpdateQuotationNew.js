// created by sufyan on 11/10/25
import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Card, Table, Spinner } from "react-bootstrap";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import api from "../../../../api/axios";
import { successToast } from "../../../../components/Toast/successToast";
import { errorToast } from "../../../../components/Toast/errorToast";
import { useFormik } from "formik";
import CustomSelect from "../../../../components/Form/CustomSelect";
import CustomInput from "../../../../components/Form/CustomInput";
import AddItemModal from "./AddItemModal";

const UpdateQuotationNew = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // get navigation state
  const location = useLocation();
  const isCustomer = location.state.isCustomer;
  const leadId = location.state;
  const isCustomerNeg = location.state.isCustomerNeg;
  const asPerSalesOrder =
    location?.state?.asPerSalesOrder?.asPerSalesOrder ||
    location?.state?.asPerSalesOrder;

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [metaData, setMetaData] = useState({
    leadData: [],
    employeeData: [],
    bankData: [],
    tdsData: [],
    tcsData: [],
    dealStages: [],
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
    sender_by_id: "",
    lead_id: "",
    Qt_date: "",
    expiry_date: "",
    companyBank_id: "",
    notes_customer: "",
    quotation_no: "",
    deal_stage_id: "",
  };

  // ------------------------ Financial Year helper (used by generateQuotationNo) ------------------------
  const getFinancialYear = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    return month >= 4
      ? `${String(year).slice(-2)}-${String(year + 1).slice(-2)}`
      : `${String(year - 1).slice(-2)}-${String(year).slice(-2)}`;
  };

  // ------------------------ Quotation No Generator (from your UpdateQuotationNew) ------------------------
  const generateQuotationNo = async (lead_id) => {
    try {
      const fy = getFinancialYear();
      const res = await api.get("/api/v1/admin/deal");
      const deals = res.data || [];

      const fyDeals = deals.filter(
        (d) => d.quotation_no && d.quotation_no.includes(`QT/${fy}/`)
      );

      // Check if this lead already has quotations in this FY
      const leadDeals = fyDeals.filter((d) => d.lead_id === Number(lead_id));

      if (leadDeals.length > 0) {
        const lastQuotation = leadDeals[leadDeals.length - 1].quotation_no;
        const match = lastQuotation.match(/(.+)-(\d+)$/);
        if (match) {
          const base = match[1];
          const suffix = parseInt(match[2], 10) + 1;
          return `${base}-${suffix}`;
        } else {
          return `${lastQuotation}-1`;
        }
      }

      // No quotation for this lead → normal numbering across FY
      if (fyDeals.length > 0) {
        const lastNo = Math.max(
          ...fyDeals.map((d) => parseInt(d.quotation_no.split("/").pop(), 10))
        );
        const newNo = String(lastNo + 1).padStart(2, "0");
        return `QT/${fy}/${newNo}`;
      } else {
        return `QT/${fy}/01`;
      }
    } catch (err) {
      console.error("Failed to generate quotation no:", err);
      return "";
    }
  };

  // ------------------------ Formik ------------------------
  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    onSubmit: async (values) => {
      if (!selectedItemsData)
        return errorToast("Please add at least one item before saving.");

      if (!values.lead_id || !values.sender_by_id) {
        return errorToast("Lead and Assign To are required.");
      }

      setSubmitting(true);

      try {
        // Generate quotation number using the custom generator
        const quotationNo = await generateQuotationNo(values.lead_id);

        // If editing existing quotation
        if (id) {
          // Step 1: Disable old deal
          await api.put(`/api/v1/admin/deal/${id}`, {
            is_disable: true,
            ...(isCustomer && { deal_stage_id: 4 }, //add deal_stage_id=4 (Won) if isCustomer true
            isCustomerNeg && { deal_stage_id: 3 }), //add deal_stage_id=3 (Negotiation) if isCustomerNeg true
          });

          // Step 2: If customer flow, stop here and go to customer page
          if (isCustomer) {
            successToast("Quotation finalized and deal marked as Won");
            navigate("/add-customer", {
              state: { leadId: leadId, asPerSalesOrder: asPerSalesOrder },
            });
            return; // prevent creating new deal
          }
        }
        // Build payload (mirrors AddDealsQt structure with fields + item_details & totals)
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
          lead_id: Number(values.lead_id) || "",
          leaQt_dated_id: values.Qt_date || "",
          sender_by_id: Number(values.sender_by_id) || "",
          expiry_date: values.expiry_date || "",
          companyBank_id: values.companyBank_id || "",
          notes_customer: values.notes_customer || "",
          deal_stage_id: 3, // changed it after first negotiation
          quotation_no: quotationNo,
          is_disable: false,
        };

        // If you need to send multipart when there's file/attachment, adapt here.
        // For now we send JSON as existing AddDealsQt did.
        await api.post("/api/v1/admin/deal", payload);

        successToast("Quotation saved successfully");
        navigate("/deals-list");
      } catch (err) {
        console.error("Save error:", err.response || err.message);
        errorToast(err.response?.data?.message || err.message || "Save failed");
      } finally {
        setSubmitting(false);
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

  // ------------------------ Fetch dropdowns and (if editing) deal by id ------------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [leadRes, empRes, bankRes, tdsRes, tcsRes, dealStagesRes] =
          await Promise.all([
            api.get("/api/v1/admin/lead/active"),
            api.get("/api/v1/admin/employee/active"),
            api.get("/api/v1/admin/companyBank/active"),
            api.get("/api/v1/admin/TDS/active"),
            api.get("/api/v1/admin/TCS/active"),
            api.get("/api/v1/admin/dealStages/active"),
          ]);

        setMetaData({
          leadData: leadRes?.data || [],
          employeeData: Array.isArray(empRes?.data?.data)
            ? empRes.data.data
            : [],
          bankData: Array.isArray(bankRes?.data?.data) ? bankRes.data.data : [],
          tdsData: Array.isArray(tdsRes?.data?.data) ? tdsRes.data.data : [],
          tcsData: Array.isArray(tcsRes?.data?.data) ? tcsRes.data.data : [],
          dealStages: Array.isArray(dealStagesRes?.data)
            ? dealStagesRes.data
            : [],
        });
      } catch (err) {
        console.error("Failed to fetch metadata:", err);
        errorToast("Failed to load dropdown data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ------------------------ If id present: fetch deal data & prefill ------------------------
  useEffect(() => {
    if (!id) return;

    const fetchDealById = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/api/v1/admin/deal/${id}`);
        const deal = data?.data || data;

        // Prefill form fields (Formik)
        setFieldValue("lead_id", deal.lead_id || "");
        setFieldValue("sender_by_id", deal.sender_by_id || "");
        setFieldValue("Qt_date", deal.Qt_date?.split("T")[0] || "");
        setFieldValue("expiry_date", deal.expiry_date?.split("T")[0] || "");
        setFieldValue("companyBank_id", deal.companyBank_id || "");
        setFieldValue("notes_customer", deal.notes_customer || "");
        setFieldValue("quotation_no", deal.quotation_no || "");
        setFieldValue("deal_stage_id", deal.deal_stage_id || "");

        // Prefill item details
        if (deal.item_details) {
          setSelectedItemsData(deal.item_details);
        }

        // Prefill subtotal and tax data as in AddDealsQt
        const isTDS = !!deal.TDS_id;
        const isTCS = !!deal.TCS_id;
        const taxType = isTDS ? "TDS" : isTCS ? "TCS" : "";
        const deductionId = isTDS ? deal.TDS_id : isTCS ? deal.TCS_id : null;

        const deductionAmount = parseFloat(deal.deductionAmount || 0);
        const subTotal = parseFloat(deal.sub_total || 0);
        const adjustment = parseFloat(deal.adjustment || 0);
        const deductionPercentage =
          deal.percentage ||
          (subTotal > 0 ? ((deductionAmount / subTotal) * 100).toFixed(2) : 0);

        setSubTotals({
          subTotal: subTotal,
          taxType: taxType || "TDS",
          deductionId: deductionId,
          deductionOption: deductionPercentage,
          deductionName: deal.deductionName || "",
          deductionAmount: deductionAmount,
          adjustment: adjustment,
        });
      } catch (err) {
        console.error("Failed to fetch deal data:", err);
        errorToast("Failed to load deal details");
      } finally {
        setLoading(false);
      }
    };

    fetchDealById();
  }, [id, setFieldValue]);

  // ------------------------ Recalculate subtotal when items change ------------------------
  useEffect(() => {
    if (!selectedItemsData) return;

    let total = selectedItemsData.selectedCategories.reduce(
      (acc, cat) => acc + (cat.grandTotal || 0),
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

  // ------------------------ Deduction option effect ------------------------
  useEffect(() => {
    if (subTotals.deductionOption === "commission") {
      setSubTotals((prev) => ({
        ...prev,
        deductionAmount: parseFloat((prev.subTotal * 0.02).toFixed(2)),
      }));
    }
  }, [subTotals.deductionOption, subTotals.subTotal]);

  // ------------------------ Loader ------------------------
  if (loading) {
    return (
      <div className="loader-div">
        <Spinner animation="border" className="spinner" />
      </div>
    );
  }

  // ------------------------ Render ------------------------
  return (
    <>
      <Card>
        <Card.Header>
          <h5 className="mb-0">
            {isCustomerNeg ? "Negotiation Quotation" : "Final Quotation"}
          </h5>
        </Card.Header>
        <hr />
        <Card.Body className="pt-0">
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col md={4}>
                <CustomInput
                  label="Quote No"
                  name="quotation_no"
                  value={values.quotation_no}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="--"
                  touched={touched.quotation_no}
                  errors={errors.quotation_no}
                  readOnly={true}
                  disabled={true}
                />
              </Col>
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
                  disabled={isCustomer || isCustomerNeg}
                  readOnly={isCustomer}
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
            </Row>

            <Row className="mb-3">
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
                  required
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

            {/* Items Table */}
            <div className="table-responsive mt-5">
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
                          <td>₹{cat.cgst.toFixed(2)}</td>
                          <td>₹{cat.sgst.toFixed(2)}</td>
                          <td>₹{cat.finalAmount.toFixed(2)}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </Table>
            </div>

            <Row className="mt-3">
              <div className="text-start">
                <Button variant="primary" onClick={() => setShowModal(true)}>
                  + Item
                </Button>
              </div>
            </Row>

            {/* Subtotal & Deduction Card */}
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

            <div className="text-end mt-3">
              <Button type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : id ? "Update" : "Save"}
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

export default UpdateQuotationNew;
