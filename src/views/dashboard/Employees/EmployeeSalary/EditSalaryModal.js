import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Spinner, Card, Col, Row } from "react-bootstrap";
import api from "../../../../api/axios";
import { toast } from "react-toastify";

const EditSalaryModal = ({ show, handleClose, salaryId, salaryGroups }) => {
  const [formData, setFormData] = useState({
    employee_id: "",
    annual_ctc: "",
    basic_salary_percent: "",
    selectedBasicId: "",
  });

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [salaryData, setSalaryData] = useState(null);
  const [componentsData, setComponentsData] = useState([]);
  const [componentOverrides, setComponentOverrides] = useState({});
  const [calculatedValues, setCalculatedValues] = useState({});

  // ✅ Fetch salary data by ID
  const fetchSalaryData = async () => {
    try {
      setInitialLoading(true);
      const res = await api.get(
        `/api/v1/admin/employeeSalary/employee-salary/${salaryId}`
      );
      if (res.data.success) {
        const data = res.data;
        setSalaryData(data);

        // Fill top-level fields
        setFormData({
          employee_id: data.employee_id,
          annual_ctc: parseFloat(data.per_annum_sal) || 0,
          basic_salary_percent: parseFloat(data.basic_per) || 0,
          selectedBasicId: "", // we'll determine after fetching components
        });

        // Build overrides from components
        const overrides = {};
        data.components.forEach((comp) => {
          overrides[comp.component_name] = parseFloat(comp.component_percent);
        });
        setComponentOverrides(overrides);
      } else {
        toast.error("Failed to load salary details");
      }
    } catch (err) {
      console.error("Error fetching salary details:", err);
      toast.error("Failed to fetch salary details");
    } finally {
      setInitialLoading(false);
    }
  };

  // ✅ Fetch salary components for selection
  const fetchSalaryComponents = async () => {
    try {
      const res = await api.get("/api/v1/admin/addSalaryComponent/active");
      if (res.data.success) {
        setComponentsData(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching salary components:", err);
      toast.error("Failed to load components");
    }
  };

  // Run both API calls when modal opens
  useEffect(() => {
    if (show && salaryId) {
      fetchSalaryComponents();
      fetchSalaryData();
    }
  }, [show, salaryId]);

  // --- Calculation Logic (same as AddSalaryModal but simplified) ---
  const calculateValues = () => {
    if (!formData.annual_ctc) return {};

    const annualCTC = parseFloat(formData.annual_ctc);
    const basicPercent = parseFloat(formData.basic_salary_percent);
    const values = {};

    // Basic
    const basicAnnual = (annualCTC * basicPercent) / 100;
    const basicMonthly = basicAnnual / 12;
    values["Basic Salary"] = {
      monthly: basicMonthly,
      annual: basicAnnual,
      type: "Earnings",
    };

    // Other components
    salaryData?.components?.forEach((comp) => {
      const percent =
        componentOverrides[comp.component_name] ||
        parseFloat(comp.component_percent) ||
        0;
      let monthly = 0;

      if (comp.componentMaster?.value_type === "CTC Percent") {
        monthly = (annualCTC * percent) / 100 / 12;
      } else if (comp.componentMaster?.value_type === "Basic Percent") {
        monthly = (basicAnnual * percent) / 100 / 12;
      } else if (comp.componentMaster?.value_type === "Fixed") {
        monthly = percent;
      }

      values[comp.component_name] = {
        monthly,
        annual: monthly * 12,
        type: comp.component_type === "deduction" ? "Deduction" : "Earnings",
      };
    });

    return values;
  };

  useEffect(() => {
    if (salaryData) {
      setCalculatedValues(calculateValues());
    }
  }, [formData, componentOverrides, salaryData]);

  // Handle basic and component changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleComponentPercentChange = (componentName, value) => {
    setComponentOverrides((prev) => ({
      ...prev,
      [componentName]: parseFloat(value) || 0,
    }));
  };

  // --- Save Edited Salary ---
  const onSave = async () => {
    try {
      setLoading(true);

      const payload = {
        per_annum_sal: formData.annual_ctc,
        basic_per: formData.basic_salary_percent,
        components: Object.entries(calculatedValues).map(([name, val]) => ({
          component_name: name,
          component_percent: componentOverrides[name] || 0,
          component_monthly: val.monthly.toFixed(2),
          component_annual: val.annual.toFixed(2),
          component_type: val.type.toLowerCase(),
        })),
      };

      const res = await api.put(
        `/api/v1/admin/employeeSalary/employee-salary/${salaryId}`,
        payload
      );

      if (res.data.success) {
        toast.success("Salary updated successfully!");
        handleClose();
      } else {
        toast.error("Failed to update salary");
      }
    } catch (err) {
      console.error("Error updating salary:", err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading)
    return (
      <Modal show={show} centered>
        <Modal.Body className="text-center p-5">
          <Spinner animation="border" />
        </Modal.Body>
      </Modal>
    );

  if (!salaryData) return null;

  const earnings = Object.entries(calculatedValues).filter(
    ([_, v]) => v.type === "Earnings"
  );
  const deductions = Object.entries(calculatedValues).filter(
    ([_, v]) => v.type === "Deduction"
  );

  return (
    <Modal show={show} onHide={handleClose} size="xl" centered>
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold text-primary">
          Edit Salary for {salaryData.employeeSalary?.name}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Card className="p-3 mb-3 shadow-sm">
            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Annual CTC</Form.Label>
                  <Form.Control
                    type="number"
                    name="annual_ctc"
                    value={formData.annual_ctc}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Basic %</Form.Label>
                  <Form.Control
                    type="number"
                    name="basic_salary_percent"
                    value={formData.basic_salary_percent}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Card>

          {/* COMPONENTS */}
          <Card className="p-3 mb-3 shadow-sm">
            <h5 className="text-success mb-3">Earnings</h5>
            {earnings.map(([name, val]) => (
              <Row key={name} className="mb-2">
                <Col md={4}>
                  <Form.Label>{name}</Form.Label>
                  <Form.Control
                    type="number"
                    value={componentOverrides[name] || 0}
                    onChange={(e) =>
                      handleComponentPercentChange(name, e.target.value)
                    }
                  />
                </Col>
                <Col md={4}>
                  <Form.Label>Monthly</Form.Label>
                  <Form.Control value={val.monthly.toFixed(2)} readOnly />
                </Col>
                <Col md={4}>
                  <Form.Label>Annual</Form.Label>
                  <Form.Control value={val.annual.toFixed(2)} readOnly />
                </Col>
              </Row>
            ))}
          </Card>

          <Card className="p-3 mb-3 shadow-sm">
            <h5 className="text-danger mb-3">Deductions</h5>
            {deductions.map(([name, val]) => (
              <Row key={name} className="mb-2">
                <Col md={4}>
                  <Form.Label>{name}</Form.Label>
                  <Form.Control
                    type="number"
                    value={componentOverrides[name] || 0}
                    onChange={(e) =>
                      handleComponentPercentChange(name, e.target.value)
                    }
                  />
                </Col>
                <Col md={4}>
                  <Form.Label>Monthly</Form.Label>
                  <Form.Control value={val.monthly.toFixed(2)} readOnly />
                </Col>
                <Col md={4}>
                  <Form.Label>Annual</Form.Label>
                  <Form.Control value={val.annual.toFixed(2)} readOnly />
                </Col>
              </Row>
            ))}
          </Card>

          <Card className="p-3 bg-success bg-opacity-10 border-success">
            <Row>
              <Col md={6}>
                <h5 className="fw-bold text-success">Net Pay</h5>
              </Col>
              <Col md={3}>
                <h5>
                  ₹
                  {(
                    earnings.reduce((s, [_, v]) => s + v.monthly, 0) -
                    deductions.reduce((s, [_, v]) => s + v.monthly, 0)
                  ).toFixed(2)}
                </h5>
              </Col>
              <Col md={3}>
                <h5>
                  ₹
                  {(
                    earnings.reduce((s, [_, v]) => s + v.annual, 0) -
                    deductions.reduce((s, [_, v]) => s + v.annual, 0)
                  ).toFixed(2)}
                </h5>
              </Col>
            </Row>
          </Card>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="outline-secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onSave} disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : "Update Salary"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditSalaryModal;
