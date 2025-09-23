import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../../../../api/axios";

const AddDeals = ({ editData }) => {
  const navigate = useNavigate();
  const [dealStages, setDealStages] = useState([]);
  const [leads, setLeads] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [rates, setRates] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
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
    // inv_qty: "",
    inv_amt: "",
    inv_seller_id: "",
    final_amt: "",
    sol_rate: "", // new field
    inv_rate: "", // new field
    sender_by_id: "",
    quotation_no: "",
  });

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [supplierRes, rateRes, leadRes, stageRes, empRes] =
          await Promise.all([
            api.get("/api/v1/admin/supplierManagement"),
            api.get("/api/v1/admin/rate/active"),
            api.get("/api/v1/admin/lead"),
            api.get("/api/v1/admin/dealStages/active"),
            api.get("/api/v1/admin/employee/active"), // 👈 new
          ]);
        setSuppliers(supplierRes.data || []);
        setRates(rateRes.data || []);
        setLeads(leadRes.data || []);
        setDealStages(stageRes.data || []);
        setEmployees(Array.isArray(empRes.data.data) ? empRes.data.data : []);
      } catch (err) {
        console.error("Error loading data", err);
      }
    };
    fetchData();
  }, []);

  const getFinancialYear = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    if (month >= 4) {
      return `${String(year).slice(-2)}-${String(year + 1).slice(-2)}`;
    } else {
      return `${String(year - 1).slice(-2)}-${String(year).slice(-2)}`;
    }
  };

  useEffect(() => {
    const initQuotation = async () => {
      try {
        const fy = getFinancialYear();
        const res = await api.get("/api/v1/admin/deal"); // fetch all deals
        const deals = res.data || [];

        // Filter only deals from current FY
        const fyDeals = deals.filter(
          (d) => d.quotation_no && d.quotation_no.includes(`QT/${fy}/`)
        );

        if (fyDeals.length > 0) {
          // Get max number used
          const lastNo = Math.max(
            ...fyDeals.map((d) => parseInt(d.quotation_no.split("/").pop(), 10))
          );
          const newNo = String(lastNo + 1).padStart(2, "0");
          setFormData((prev) => ({
            ...prev,
            quotation_no: `QT/${fy}/${newNo}`,
          }));
        } else {
          // No quotations in this FY → start from 01
          setFormData((prev) => ({ ...prev, quotation_no: `QT/${fy}/01` }));
        }
      } catch (err) {
        console.error("Failed to set quotation number:", err);
      }
    };

    if (!editData) {
      initQuotation(); // only generate for new deals
    } else if (editData.quotation_no) {
      setFormData((prev) => ({ ...prev, quotation_no: editData.quotation_no }));
    }
  }, [editData]);

  // Fill edit data
  useEffect(() => {
    if (editData) {
      setFormData({
        ...editData,
        site_visit_date: editData.site_visit_date
          ? new Date(editData.site_visit_date).toISOString().slice(0, 16)
          : "",
      });
    }
  }, [editData]);

  useEffect(() => {
    if (rates.length) {
      setFormData((prev) => ({
        ...prev,
        sol_rate: getRate("SOLAR"),
        inv_rate: getRate("INVERTOR"),
      }));
    }
  }, [rates]);

  // Update sol_cap when lead_id changes
  useEffect(() => {
    if (formData.lead_id) {
      const selectedLead = leads.find(
        (lead) => lead.id === Number(formData.lead_id)
      );
      if (selectedLead && selectedLead.capacity) {
        setFormData((prev) => ({
          ...prev,
          sol_cap: selectedLead.capacity,
        }));
      }
    }
  }, [formData.lead_id, leads]);

  const getRate = (name) => {
    const rateObj = rates.find((r) => r.name === name);
    return rateObj ? rateObj.price : 0;
  };

  // Auto calculate amounts
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
      final_amt: solAmt + invAmt,
    }));
  }, [
    formData.sol_cap,
    formData.sol_qty,
    formData.sol_rate,
    formData.inv_cap,
    // formData.inv_qty,
    formData.inv_rate,
  ]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "attachment") {
      setFormData((prev) => ({ ...prev, attachment: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // start loading
    try {
      if (!formData.deal_name || !formData.lead_id) {
        alert(
          "Please fill all required fields: Deal Name, Lead, Stage, and Amount"
        );
        setLoading(false);
        return;
      }

      const submitData = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "attachment" && formData[key]) {
          submitData.append(key, formData[key]);
        } else if (key === "site_visit_date" && !formData[key]) {
          submitData.append(key, "");
        } else if (formData[key] !== null && formData[key] !== undefined) {
          submitData.append(key, formData[key]);
        }
      });

      if (editData) {
        await api.put(`/api/v1/admin/deal/${editData.id}`, submitData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/api/v1/admin/deal", submitData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      navigate("/deals-list");
    } catch (error) {
      console.error("Error saving deal:", error);
      alert(
        `Failed to ${editData ? "update" : "create"} deal: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setLoading(false); // stop loading in both success/fail
    }
  };

  return (
    <Card className="p-4 shadow-sm">
      <Form onSubmit={handleSubmit}>
        {/* Deal Fields */}
        <Row className="mb-3">
          <Col md={4}>
            <Form.Group>
              <Form.Label>Quotation No</Form.Label>
              <Form.Control
                type="text"
                name="quotation_no"
                value={formData.quotation_no}
                readOnly
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Deal Name *</Form.Label>
              <Form.Control
                type="text"
                name="deal_name"
                value={formData.deal_name}
                onChange={handleChange}
                required
                placeholder="Enter deal name"
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
        </Row>

        <Row className="mb-3">
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
          {/* <Col md={4}>
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
          </Col> */}
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

        <Row className="mb-3"></Row>

        {/* Solar Fields */}
        <h6 className="mt-3">Solar Panel Details</h6>
        <p className="small">(Rate: ₹{getRate("SOLAR")})</p>
        <Row className="mb-3">
          {/* Solar Rate */}
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
                placeholder="Enter capacity"
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
                placeholder="Enter quantity"
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
              <Form.Label>Supplier</Form.Label>
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

        {/* Inverter Fields */}
        <h6 className="mt-3">Inverter Details</h6>
        <p className="small">(Rate: ₹{getRate("INVERTOR")})</p>
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
                placeholder="Enter capacity"
              />
            </Form.Group>
          </Col>
          {/* <Col md={3}>
            <Form.Group>
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                name="inv_qty"
                value={formData.inv_qty}
                onChange={handleChange}
                placeholder="Enter quantity"
              />
            </Form.Group>
          </Col> */}
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
        </Row>

        <Row className="mb-3">
          <Col md={4}>
            <Form.Group>
              <Form.Label>Supplier</Form.Label>
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
          <Col md={4}>
            <Form.Group>
              <Form.Label>Final Amount</Form.Label>
              <Form.Control
                type="number"
                name="final_amt"
                value={formData.final_amt}
                readOnly
              />
            </Form.Group>
          </Col>
        </Row>

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
        <Row>
          <Col md={12}>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
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
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? "Saving..." : editData ? "Update Deal" : "Save Deal"}
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default AddDeals;
