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
    deal_value: "",
    deal_stage_id: 2, // default stage
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
    final_amt: "",
    sol_rate: "",
    inv_rate: "",
    sender_by_id: "",
    quotation_no: "",
  });

  // Track manual edits
  const [manualEdit, setManualEdit] = useState({
    sol_amt: false,
    inv_amt: false,
    final_amt: false,
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
            api.get("/api/v1/admin/employee/active"),
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
    return month >= 4
      ? `${String(year).slice(-2)}-${String(year + 1).slice(-2)}`
      : `${String(year - 1).slice(-2)}-${String(year).slice(-2)}`;
  };

  useEffect(() => {
    const initQuotation = async () => {
      try {
        const fy = getFinancialYear();
        const res = await api.get("/api/v1/admin/deal");
        const deals = res.data || [];
        const fyDeals = deals.filter(
          (d) => d.quotation_no && d.quotation_no.includes(`QT/${fy}/`)
        );

        if (fyDeals.length > 0) {
          const lastNo = Math.max(
            ...fyDeals.map((d) => parseInt(d.quotation_no.split("/").pop(), 10))
          );
          const newNo = String(lastNo + 1).padStart(2, "0");
          setFormData((prev) => ({
            ...prev,
            quotation_no: `QT/${fy}/${newNo}`,
          }));
        } else {
          setFormData((prev) => ({ ...prev, quotation_no: `QT/${fy}/01` }));
        }
      } catch (err) {
        console.error("Failed to set quotation number:", err);
      }
    };

    if (!editData) {
      initQuotation();
    } else if (editData.quotation_no) {
      setFormData((prev) => ({ ...prev, quotation_no: editData.quotation_no }));
    }
  }, [editData]);

  // Fill edit data
  useEffect(() => {
    if (editData) {
      setFormData({
        ...editData,
        deal_stage_id: 2,
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

  // Auto calculate amounts unless manually edited
  useEffect(() => {
    setFormData((prev) => {
      const solAmt =
        (Number(prev.sol_cap) || 0) *
        (Number(prev.sol_qty) || 0) *
        (Number(prev.sol_rate) || 0);
      const invAmt = (Number(prev.inv_cap) || 0) * (Number(prev.inv_rate) || 0);

      const newSolAmt = manualEdit.sol_amt ? Number(prev.sol_amt) : solAmt;
      const newInvAmt = manualEdit.inv_amt ? Number(prev.inv_amt) : invAmt;
      const newFinalAmt = manualEdit.final_amt
        ? Number(prev.final_amt)
        : newSolAmt + newInvAmt;

      return {
        ...prev,
        sol_amt: newSolAmt,
        inv_amt: newInvAmt,
        final_amt: newFinalAmt,
      };
    });
  }, [
    formData.sol_cap,
    formData.sol_qty,
    formData.sol_rate,
    formData.inv_cap,
    formData.inv_rate,
    manualEdit,
  ]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "attachment") {
      setFormData((prev) => ({ ...prev, attachment: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (["sol_amt", "inv_amt", "final_amt"].includes(name)) {
        setManualEdit((prev) => ({ ...prev, [name]: true }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!formData.lead_id) {
        alert("Please fill all required fields: Lead, Stage, and Amount");
        setLoading(false);
        return;
      }

      if (editData) {
        await api.put(`/api/v1/admin/deal/${editData.id}`, formData);
      } else {
        await api.post("/api/v1/admin/deal", formData);
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
      setLoading(false);
    }
  };

  return (
    <Card className="p-4 shadow-sm">
      <Form onSubmit={handleSubmit}>
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
              <Form.Label>Customer *</Form.Label>
              <Form.Select
                name="lead_id"
                value={formData.lead_id}
                onChange={handleChange}
                required
              >
                <option value="">Select Lead</option>
                {leads
                  .filter((lead) => lead.status === "Won")
                  .map((lead) => (
                    <option key={lead.id} value={lead.id}>
                      {lead.name}
                    </option>
                  ))}
              </Form.Select>
            </Form.Group>
          </Col>

          {/* <Col md={4}>
            <Form.Group>
              <Form.Label>Status *</Form.Label>
              <Form.Select
                name="deal_stage_id"
                value={formData.deal_stage_id}
                disabled
              >
                {dealStages.map((stage) => (
                  <option key={stage.id} value={stage.id}>
                    {stage.deal_stages}
                  </option>
                ))}
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
        </Row>

        <Row className="mb-3">
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

        {/* Solar Fields */}
        <h6 className="mt-3">Solar Panel Details</h6>
        <p className="small">(Rate: ₹{getRate("SOLAR")})</p>
        <Row className="mb-3">
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
          <Col md={4}>
            <Form.Group>
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                name="sol_amt"
                value={formData.sol_amt}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={4}>
            <Form.Group>
              <Form.Label>Supplier</Form.Label>
              <Form.Select
                name="sol_seller_id"
                value={formData.sol_seller_id}
                onChange={handleChange}
              >
                <option value="">Select Supplier</option>
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
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Supplier</Form.Label>
              <Form.Select
                name="inv_seller_id"
                value={formData.inv_seller_id}
                onChange={handleChange}
              >
                <option value="">Select Supplier</option>
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={4}>
            <Form.Group>
              <Form.Label>Final Amount</Form.Label>
              <Form.Control
                type="number"
                name="final_amt"
                value={formData.final_amt}
                onChange={handleChange}
                disabled
              />
            </Form.Group>
          </Col>
        </Row>

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
                placeholder="Enter Message"
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Save */}
        <div className="text-end mt-2">
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? "Saving..." : editData ? "Update" : "Save"}
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default AddDeals;
