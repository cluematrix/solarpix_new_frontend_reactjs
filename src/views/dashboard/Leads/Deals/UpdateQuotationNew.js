import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Card } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../../api/axios";

const UpdateQuotationNew = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [dealStages, setDealStages] = useState([]);
  const [leads, setLeads] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [rates, setRates] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    deal_name: "",
    deal_value: "",
    deal_stage_id: "",
    lead_id: "",
    description: "",
    site_visit_date: "",
    status: "",
    capacity: "",
    attachment: null,
    negotiable: "",
    sol_cap: "",
    sol_qty: "",
    sol_amt: "",
    sol_seller_id: "",
    inv_cap: "",
    inv_amt: "",
    inv_seller_id: "",
    final_amount: "",
    sol_rate: "",
    inv_rate: "",
    sender_by_id: "",
    quotation_no: "",
  });

  // ------------------------ Utility Functions ------------------------
  const getFinancialYear = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    return month >= 4
      ? `${String(year).slice(-2)}-${String(year + 1).slice(-2)}`
      : `${String(year - 1).slice(-2)}-${String(year).slice(-2)}`;
  };

  const getRate = (name) => {
    const rateObj = rates.find((r) => r.name === name);
    return rateObj ? rateObj.price : 0;
  };

  // ------------------------ Quotation No Generator ------------------------
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

      // No quotation for this lead → normal numbering
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

  // ------------------------ Fetch Data ------------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [supplierRes, rateRes, leadRes, stageRes, empRes, dealRes] =
          await Promise.all([
            api.get("/api/v1/admin/supplierManagement"),
            api.get("/api/v1/admin/rate/active"),
            api.get("/api/v1/admin/lead"),
            api.get("/api/v1/admin/dealStages/active"),
            api.get("/api/v1/admin/employee/active"),
            api.get(`/api/v1/admin/deal/${id}`),
          ]);

        setSuppliers(supplierRes.data || []);
        setRates(rateRes.data || []);
        setLeads(leadRes.data || []);
        setDealStages(stageRes.data || []);
        setEmployees(Array.isArray(empRes.data.data) ? empRes.data.data : []);

        const deal = dealRes.data;
        setFormData({
          ...deal,
          site_visit_date: deal.site_visit_date
            ? new Date(deal.site_visit_date).toISOString().slice(0, 16)
            : "",
          sol_rate: deal.sol_rate || "",
          inv_rate: deal.inv_rate || "",
          sender_by_id: deal.sender_by_id || "",
          quotation_no: deal.quotation_no || "",
        });
      } catch (err) {
        console.error("Error loading deal data:", err);
        alert("Failed to load deal details");
        navigate("/deals-list");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  // ------------------------ Default Rates ------------------------
  useEffect(() => {
    if (rates.length) {
      setFormData((prev) => ({
        ...prev,
        sol_rate: prev.sol_rate || getRate("SOLAR"),
        inv_rate: prev.inv_rate || getRate("INVERTOR"),
      }));
    }
  }, [rates]);

  // ------------------------ Auto Update Solar Capacity ------------------------
  useEffect(() => {
    if (formData.lead_id) {
      const selectedLead = leads.find(
        (lead) => lead.id === Number(formData.lead_id)
      );
      if (selectedLead && selectedLead.capacity) {
        setFormData((prev) => ({ ...prev, sol_cap: selectedLead.capacity }));
      }
    }
  }, [formData.lead_id, leads]);

  // ------------------------ Auto Calculate Amounts ------------------------
  useEffect(() => {
    const solAmt =
      (Number(formData.sol_cap) || 0) *
      (Number(formData.sol_qty) || 0) *
      (Number(formData.sol_rate) || 0);

    const invAmt =
      (Number(formData.inv_cap) || 0) * (Number(formData.inv_rate) || 0);

    setFormData((prev) => ({
      ...prev,
      sol_amt: solAmt,
      inv_amt: invAmt,
      final_amount: solAmt + invAmt,
    }));
  }, [
    formData.sol_cap,
    formData.sol_qty,
    formData.sol_rate,
    formData.inv_cap,
    formData.inv_rate,
  ]);

  // ------------------------ Handle Input Change ------------------------
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "attachment") {
      setFormData((prev) => ({ ...prev, attachment: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // ------------------------ Handle Submit ------------------------
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     if (!formData.deal_name || !formData.lead_id || !formData.sender_by_id) {
  //       alert("Please fill required fields");
  //       return;
  //     }

  //     // Generate quotation number for this lead
  //     const quotationNo = await generateQuotationNo(formData.lead_id);

  //     const payload = {
  //       deal_name: formData.deal_name,
  //       lead_id: formData.lead_id,
  //       deal_stage_id: 3, // Win
  //       isFinal: 0, // Final
  //       status: formData.status || "Active",
  //       site_visit_date: formData.site_visit_date,
  //       description: formData.description,
  //       sol_cap: formData.sol_cap,
  //       sol_qty: formData.sol_qty,
  //       sol_amt: formData.sol_amt,
  //       sol_seller_id: formData.sol_seller_id,
  //       inv_cap: formData.inv_cap,
  //       inv_amt: formData.inv_amt,
  //       inv_seller_id: formData.inv_seller_id,
  //       final_amount: formData.final_amount,
  //       sol_rate: formData.sol_rate,
  //       inv_rate: formData.inv_rate,
  //       sender_by_id: formData.sender_by_id,
  //       attachment: formData.attachment || null,
  //       quotation_no: quotationNo,
  //     };

  //     const formPayload = new FormData();
  //     Object.keys(payload).forEach((key) => {
  //       if (payload[key] !== null && payload[key] !== undefined) {
  //         formPayload.append(key, payload[key]);
  //       }
  //     });

  //     await api.post("/api/v1/admin/deal", formPayload, {
  //       headers: { "Content-Type": "multipart/form-data" },
  //     });

  //     alert("Quotation updated successfully!");
  //     navigate("/deals-list");
  //   } catch (error) {
  //     console.error("Error updating deal:", error.response || error.message);
  //     alert(
  //       `Failed to update deal: ${JSON.stringify(
  //         error.response?.data || error.message
  //       )}`
  //     );
  //   }
  // };

  // ------------------------ Handle Submit ------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (!formData.deal_name || !formData.lead_id || !formData.sender_by_id) {
        alert("Please fill required fields");
        return;
      }

      // Generate quotation number
      const quotationNo = await generateQuotationNo(formData.lead_id);

      // ------------------ DISABLE EXISTING QUOTATION ------------------
      if (id) {
        await api.put(`/api/v1/admin/deal/${id}`, { is_disable: true });
      }

      // ------------------ CREATE NEW QUOTATION ------------------
      const payload = {
        deal_name: formData.deal_name,
        lead_id: Number(formData.lead_id),
        deal_stage_id: 3,
        is_disable: false,
        is_final: 0,
        status: formData.status || "Active",
        site_visit_date: formData.site_visit_date,
        description: formData.description || "",
        sol_cap: Number(formData.sol_cap) || 0,
        sol_qty: Number(formData.sol_qty) || 0,
        sol_amt: Number(formData.sol_amt) || 0,
        sol_seller_id: Number(formData.sol_seller_id) || null,
        inv_cap: Number(formData.inv_cap) || 0,
        inv_amt: Number(formData.inv_amt) || 0,
        inv_seller_id: Number(formData.inv_seller_id) || null,
        final_amount: Number(formData.final_amount) || 0,
        sol_rate: Number(formData.sol_rate) || 0,
        inv_rate: Number(formData.inv_rate) || 0,
        sender_by_id: Number(formData.sender_by_id),
        quotation_no: quotationNo,
        attachment: formData.attachment || null,
      };

      const formPayload = new FormData();
      Object.keys(payload).forEach((key) => {
        if (payload[key] !== null && payload[key] !== undefined) {
          formPayload.append(key, payload[key]);
        }
      });

      await api.post("/api/v1/admin/deal", formPayload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // alert("Quotation saved successfully!");
      navigate("/deals-list");
    } catch (error) {
      console.error("Error saving quotation:", error.response || error.message);
      setSubmitting(false); // stop loader
    }
  };

  if (loading) return <p>Loading...</p>;

  // ------------------------ Render Form ------------------------
  return (
    <Card className="p-4 shadow-sm">
      <h4 className="mb-3">Update New Quotation</h4>
      <Form onSubmit={handleSubmit}>
        {/* Deal Info */}
        <Row className="mb-3">
          <Col md={4}>
            <Form.Group>
              <Form.Label>Deal Name *</Form.Label>
              <Form.Control
                type="text"
                name="deal_name"
                value={formData.deal_name}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Lead *</Form.Label>
              <Form.Select
                name="lead_id"
                value={formData.lead_id}
                onChange={handleChange}
                required
              >
                <option value="">Select Lead</option>
                {leads.map((lead) => (
                  <option key={lead.id} value={lead.id}>
                    {lead.name} (Capacity: {lead.capacity})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Stage *</Form.Label>
              <Form.Select
                name="deal_stage_id"
                value={formData.deal_stage_id}
                onChange={handleChange}
                required
              >
                <option value="">Select Stage</option>
                {dealStages.map((stage) => (
                  <option key={stage.id} value={stage.id}>
                    {stage.deal_stages}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        {/* Assign + Status + Visit */}
        <Row className="mb-3">
          <Col md={4}>
            <Form.Group>
              <Form.Label>Status</Form.Label>
              <Form.Select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Assign To *</Form.Label>
              <Form.Select
                name="sender_by_id"
                value={formData.sender_by_id}
                onChange={handleChange}
                required
              >
                <option value="">Select Employee</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Site Visit Date & Time</Form.Label>
              <Form.Control
                type="datetime-local"
                name="site_visit_date"
                value={formData.site_visit_date}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Solar Details */}
        <h6 className="mt-3">Solar Panel Details</h6>
        <p className="small">(Default Rate: ₹{getRate("SOLAR")})</p>
        <Row className="mb-3">
          <Col md={4}>
            <Form.Group>
              <Form.Label>Rate</Form.Label>
              <Form.Control
                type="number"
                name="sol_rate"
                value={formData.sol_rate}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    sol_rate: Number(e.target.value),
                  }))
                }
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Capacity</Form.Label>
              <Form.Control
                type="number"
                name="sol_cap"
                value={formData.sol_cap}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                name="sol_qty"
                value={formData.sol_qty}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md={4}>
            <Form.Group>
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                name="sol_amt"
                value={formData.sol_amt}
                readOnly
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Seller</Form.Label>
              <Form.Select
                name="sol_seller_id"
                value={formData.sol_seller_id}
                onChange={handleChange}
              >
                <option value="">Select Seller</option>
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        {/* Inverter Details */}
        <h6 className="mt-3">Inverter Details</h6>
        <p className="small">(Default Rate: ₹{getRate("INVERTOR")})</p>
        <Row className="mb-3">
          <Col md={4}>
            <Form.Group>
              <Form.Label>Rate</Form.Label>
              <Form.Control
                type="number"
                name="inv_rate"
                value={formData.inv_rate}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    inv_rate: Number(e.target.value),
                  }))
                }
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Capacity</Form.Label>
              <Form.Control
                type="number"
                name="inv_cap"
                value={formData.inv_cap}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                name="inv_amt"
                value={formData.inv_amt}
                readOnly
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Seller</Form.Label>
              <Form.Select
                name="inv_seller_id"
                value={formData.inv_seller_id}
                onChange={handleChange}
              >
                <option value="">Select Seller</option>
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        {/* Final Amount + Attachment + Description */}
        <Row className="mb-3">
          <Col md={4}>
            <Form.Group>
              <Form.Label>Final Amount</Form.Label>
              <Form.Control
                type="number"
                name="final_amount"
                value={formData.final_amount}
                readOnly
              />
            </Form.Group>
          </Col>
          {/* <Col md={4}>
            <Form.Group>
              <Form.Label>Attachment (PDF only)</Form.Label>
              <Form.Control
                type="file"
                name="attachment"
                accept="application/pdf"
                onChange={handleChange}
              />
            </Form.Group>
          </Col> */}

          <Col md={8}>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Submit */}
        <div className="text-end">
          <Button variant="secondary" onClick={() => navigate("/deals-list")}>
            Cancel
          </Button>{" "}
          <Button variant="primary" type="submit" disabled={submitting}>
            {submitting ? "Saving..." : "Update Quotation"}
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default UpdateQuotationNew;
