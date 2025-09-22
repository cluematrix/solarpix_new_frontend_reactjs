import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Card } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../../api/axios";

const EditDeal = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [dealStages, setDealStages] = useState([]);
  const [leads, setLeads] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [rates, setRates] = useState([]);

  const [formData, setFormData] = useState({
    // deal_name: "",
    // deal_value: "",
    // deal_stage_id: "",
    // lead_id: "",
    // description: "",
    // site_visit_date: "",
    // status: "",
    // capacity: "",
    // attachment: null,
    // negotiable: "",
    // sol_cap: "",
    // sol_qty: "",
    // sol_amt: "",
    // sol_seller_id: "",
    // inv_cap: "",
    // inv_qty: "",
    // inv_amt: "",
    // inv_seller_id: "",
    // final_amount: "",

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
    inv_qty: "",
    inv_amt: "",
    inv_seller_id: "",
    final_amt: "",
    sol_rate: "", // new field
    inv_rate: "", // new field
  });

  const [loading, setLoading] = useState(true);

  // Fetch dropdown data and deal details
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [supplierRes, rateRes, leadRes, stageRes, dealRes] =
          await Promise.all([
            api.get("/api/v1/admin/supplierManagement"),
            api.get("/api/v1/admin/rate/active"),
            api.get("/api/v1/admin/lead"),
            api.get("/api/v1/admin/dealStages/active"),
            api.get(`/api/v1/admin/deal/${id}`),
          ]);

        setSuppliers(supplierRes.data || []);
        setRates(rateRes.data || []);
        setLeads(leadRes.data || []);
        setDealStages(stageRes.data || []);

        const deal = dealRes.data;
        setFormData({
          ...deal,
          site_visit_date: deal.site_visit_date
            ? deal.site_visit_date.split("T")[0]
            : "",
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

  // Auto update solar capacity when lead changes
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

  const getRate = (name) => {
    const rateObj = rates.find((r) => r.name === name);
    return rateObj ? rateObj.price : 0;
  };

  // Auto calculate amounts
  useEffect(() => {
    const solAmt =
      (Number(formData.sol_cap) || 0) *
      (Number(formData.sol_qty) || 0) *
      getRate("SOLAR");
    const invAmt =
      (Number(formData.inv_cap) || 0) *
      (Number(formData.inv_qty) || 0) *
      getRate("INVERTOR");
    setFormData((prev) => ({
      ...prev,
      sol_amt: solAmt,
      inv_amt: invAmt,
      final_amount: solAmt + invAmt,
    }));
  }, [
    formData.sol_cap,
    formData.sol_qty,
    formData.inv_cap,
    formData.inv_qty,
    rates,
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
    try {
      if (!formData.deal_name || !formData.lead_id || !formData.deal_stage_id) {
        alert("Please fill required fields");
        return;
      }

      const submitData = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "attachment" && formData[key]) {
          submitData.append(key, formData[key]);
        } else if (formData[key] !== null && formData[key] !== undefined) {
          submitData.append(key, formData[key]);
        }
      });

      await api.put(`/api/v1/admin/deal/${id}`, submitData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      //   alert("Deal updated successfully");
      navigate("/deals-list");
    } catch (error) {
      console.error("Error updating deal:", error);
      alert(
        `Failed to update deal: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  if (loading) return <p>Loading...</p>;

  console.log("formData.inv_rate", formData.inv_rate);
  return (
    // <Card className="p-4 shadow-sm">
    //   <h4 className="mb-3">Edit Deal</h4>
    //   <Form onSubmit={handleSubmit}>
    //     {/* Deal Fields */}
    //     <Row className="mb-3">
    //       <Col md={4}>
    //         <Form.Group>
    //           <Form.Label>Deal Name *</Form.Label>
    //           <Form.Control
    //             type="text"
    //             name="deal_name"
    //             value={formData.deal_name}
    //             onChange={handleChange}
    //             required
    //           />
    //         </Form.Group>
    //       </Col>
    //       <Col md={4}>
    //         <Form.Group>
    //           <Form.Label>Lead *</Form.Label>
    //           <Form.Select
    //             name="lead_id"
    //             value={formData.lead_id}
    //             onChange={handleChange}
    //             required
    //           >
    //             <option value="">Select Lead</option>
    //             {leads.map((lead) => (
    //               <option key={lead.id} value={lead.id}>
    //                 {lead.name} (Capacity: {lead.capacity})
    //               </option>
    //             ))}
    //           </Form.Select>
    //         </Form.Group>
    //       </Col>
    //       <Col md={4}>
    //         <Form.Group>
    //           <Form.Label>Stage *</Form.Label>
    //           <Form.Select
    //             name="deal_stage_id"
    //             value={formData.deal_stage_id}
    //             onChange={handleChange}
    //             required
    //           >
    //             <option value="">Select Stage</option>
    //             {dealStages.map((stage) => (
    //               <option key={stage.id} value={stage.id}>
    //                 {stage.deal_stages}
    //               </option>
    //             ))}
    //           </Form.Select>
    //         </Form.Group>
    //       </Col>
    //     </Row>

    //     <Row className="mb-3">
    //       <Col md={4}>
    //         <Form.Group>
    //           <Form.Label>Status</Form.Label>
    //           <Form.Select
    //             name="status"
    //             value={formData.status}
    //             onChange={handleChange}
    //           >
    //             <option value="">Select</option>
    //             <option value="Active">Active</option>
    //             <option value="Inactive">Inactive</option>
    //           </Form.Select>
    //         </Form.Group>
    //       </Col>
    //       <Col md={4}>
    //         <Form.Group>
    //           <Form.Label>Attachment (PDF only)</Form.Label>
    //           <Form.Control
    //             type="file"
    //             name="attachment"
    //             accept="application/pdf"
    //             onChange={handleChange}
    //           />
    //         </Form.Group>
    //       </Col>
    //       <Col md={4}>
    //         <Form.Group>
    //           <Form.Label>Site Visit Date</Form.Label>
    //           <Form.Control
    //             type="date"
    //             name="site_visit_date"
    //             value={formData.site_visit_date}
    //             onChange={handleChange}
    //           />
    //         </Form.Group>
    //       </Col>
    //     </Row>

    //     {/* Solar Fields */}
    //     <h6 className="mt-3">Solar Panel Details</h6>
    //     <p className="small">(Rate: ₹{getRate("SOLAR")})</p>
    //     <Row className="mb-3">
    //       <Col md={3}>
    //         <Form.Group>
    //           <Form.Label>Capacity</Form.Label>
    //           <Form.Control
    //             type="number"
    //             name="sol_cap"
    //             value={formData.sol_cap}
    //             onChange={handleChange}
    //           />
    //         </Form.Group>
    //       </Col>
    //       <Col md={3}>
    //         <Form.Group>
    //           <Form.Label>Quantity</Form.Label>
    //           <Form.Control
    //             type="number"
    //             name="sol_qty"
    //             value={formData.sol_qty}
    //             onChange={handleChange}
    //           />
    //         </Form.Group>
    //       </Col>
    //       <Col md={3}>
    //         <Form.Group>
    //           <Form.Label>Amount</Form.Label>
    //           <Form.Control
    //             type="number"
    //             name="sol_amt"
    //             value={formData.sol_amt}
    //             readOnly
    //           />
    //         </Form.Group>
    //       </Col>
    //       <Col md={3}>
    //         <Form.Group>
    //           <Form.Label>Seller</Form.Label>
    //           <Form.Select
    //             name="sol_seller_id"
    //             value={formData.sol_seller_id}
    //             onChange={handleChange}
    //           >
    //             <option value="">Select Seller</option>
    //             {suppliers.map((s) => (
    //               <option key={s.id} value={s.id}>
    //                 {s.name}
    //               </option>
    //             ))}
    //           </Form.Select>
    //         </Form.Group>
    //       </Col>
    //     </Row>

    //     {/* Inverter Fields */}
    //     <h6 className="mt-3">Inverter Details</h6>
    //     <p className="small">(Rate: ₹{getRate("INVERTOR")})</p>
    //     <Row className="mb-3">
    //       <Col md={3}>
    //         <Form.Group>
    //           <Form.Label>Capacity</Form.Label>
    //           <Form.Control
    //             type="number"
    //             name="inv_cap"
    //             value={formData.inv_cap}
    //             onChange={handleChange}
    //           />
    //         </Form.Group>
    //       </Col>
    //       <Col md={3}>
    //         <Form.Group>
    //           <Form.Label>Quantity</Form.Label>
    //           <Form.Control
    //             type="number"
    //             name="inv_qty"
    //             value={formData.inv_qty}
    //             onChange={handleChange}
    //           />
    //         </Form.Group>
    //       </Col>
    //       <Col md={3}>
    //         <Form.Group>
    //           <Form.Label>Amount</Form.Label>
    //           <Form.Control
    //             type="number"
    //             name="inv_amt"
    //             value={formData.inv_amt}
    //             readOnly
    //           />
    //         </Form.Group>
    //       </Col>
    //       <Col md={3}>
    //         <Form.Group>
    //           <Form.Label>Seller</Form.Label>
    //           <Form.Select
    //             name="inv_seller_id"
    //             value={formData.inv_seller_id}
    //             onChange={handleChange}
    //           >
    //             <option value="">Select Seller</option>
    //             {suppliers.map((s) => (
    //               <option key={s.id} value={s.id}>
    //                 {s.name}
    //               </option>
    //             ))}
    //           </Form.Select>
    //         </Form.Group>
    //       </Col>
    //     </Row>

    //     {/* Final Amount */}
    //     <Row className="mb-3">
    //       <Col md={4}>
    //         <Form.Group>
    //           <Form.Label>Final Amount</Form.Label>
    //           <Form.Control
    //             type="number"
    //             name="final_amount"
    //             value={formData.final_amount}
    //             readOnly
    //           />
    //         </Form.Group>
    //       </Col>
    //       <Col md={8}>
    //         <Form.Group>
    //           <Form.Label>Description</Form.Label>
    //           <Form.Control
    //             as="textarea"
    //             rows={3}
    //             name="description"
    //             value={formData.description}
    //             onChange={handleChange}
    //           />
    //         </Form.Group>
    //       </Col>
    //     </Row>

    //     {/* Submit */}
    //     <div className="text-end">
    //       <Button variant="secondary" onClick={() => navigate("/deals-list")}>
    //         Cancel
    //       </Button>{" "}
    //       <Button variant="primary" type="submit">
    //         Update Deal
    //       </Button>
    //     </div>
    //   </Form>
    // </Card>

    <Card className="p-4 shadow-sm">
      <Form onSubmit={handleSubmit}>
        {/* Deal Fields */}
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
              <Form.Label>Attachment (PDF only)</Form.Label>
              <Form.Control
                type="file"
                name="attachment"
                accept="application/pdf"
                onChange={handleChange}
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group>
              <Form.Label>Site Visit Date</Form.Label>
              <Form.Control
                type="date"
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

        <Row>
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
          <Col md={4}>
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
          </Col>
        </Row>
        <Row className="mb-3">
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

        {/* Final Amount */}
        <Row className="mb-3">
          <Col md={12}>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter description"
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Submit */}
        <div className="text-end">
          <Button variant="secondary" onClick={() => navigate("/deals-list")}>
            Cancel
          </Button>{" "}
          <Button variant="primary" type="submit">
            Update Deal
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default EditDeal;
