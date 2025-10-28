import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Spinner, Card, Row, Col } from "react-bootstrap";
import api from "../../../../api/axios";
import { toast } from "react-toastify";

const UpdateSalaryModal = ({ show, handleClose, salaryId }) => {
  const [loading, setLoading] = useState(false);
  const [employee, setEmployee] = useState(null);
  const [componentsData, setComponentsData] = useState([]);
  const [salaryComponents, setSalaryComponents] = useState([]);
  const [tdsData, setTdsData] = useState([]);
  const [pfCapping, setPfCapping] = useState(false);

  const [formData, setFormData] = useState({
    value_type: "Increment",
    annual_increment_amount: "",
    increment_date: new Date().toISOString().split("T")[0],
  });

  const [salaryData, setSalaryData] = useState({
    currentAnnual: 0,
    currentMonthly: 0,
    incrementedAnnual: 0,
    incrementedMonthly: 0,
  });

  const [componentOverrides, setComponentOverrides] = useState({});
  const [calculatedValues, setCalculatedValues] = useState({});

  // ---------------- Fetch Salary Details ----------------
  useEffect(() => {
    if (show && salaryId) fetchSalaryDetails();
  }, [show, salaryId]);

  const fetchSalaryDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get(
        `/api/v1/admin/employeeSalary/employee-salary/${salaryId}`
      );

      if (res.data.success) {
        const data = res.data.data;
        const emp = data.employeeSalary || data.employee || {};

        setEmployee({
          id: emp.id,
          name: emp.name,
          emp_id: emp.emp_id,
        });

        const annual = parseFloat(data.per_annum_sal) || 0;
        const monthly = parseFloat(data.total_monthly) || annual / 12;

        setSalaryData({
          currentAnnual: annual,
          currentMonthly: monthly,
          incrementedAnnual: annual,
          incrementedMonthly: monthly,
        });

        await Promise.all([
          fetchSalaryComponents(),
          fetchTdsData(),
          fetchPfCapping(),
        ]);
      }
    } catch (err) {
      console.error("Error fetching salary details:", err);
      toast.error("Failed to load salary details");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Fetch Salary Components ----------------
  const fetchSalaryComponents = async () => {
    try {
      const res = await api.get("/api/v1/admin/addSalaryComponent/active");
      if (res.data.success) {
        setComponentsData(res.data.data);
        setSalaryComponents(res.data.data);
      }
    } catch (err) {
      toast.error("Failed to load salary components");
    }
  };

  // ---------------- Fetch TDS ----------------
  const fetchTdsData = async () => {
    try {
      const res = await api.get("/api/v1/admin/salaryTDS");
      if (res.data.success) setTdsData(res.data.data);
    } catch (err) {
      toast.error("Failed to load TDS data");
    }
  };

  // ---------------- Fetch PF Capping ----------------
  const fetchPfCapping = async () => {
    try {
      const res = await api.get("/api/v1/admin/PFCapping");
      if (res.data.success && res.data.data.length > 0)
        setPfCapping(res.data.data[0].Capping);
    } catch (err) {
      toast.error("Failed to load PF capping");
    }
  };

  // ---------------- Calculation Helpers ----------------
  const getComponentValue = (componentName) => {
    if (componentOverrides[componentName] !== undefined)
      return parseFloat(componentOverrides[componentName]) || 0;

    const comp = componentsData.find(
      (c) => c.salary_components === componentName && c.isActive
    );
    return comp ? parseFloat(comp.component_value_monthly) || 0 : 0;
  };

  const calculateTds = (ctc) => {
    const tds = tdsData.find(
      (tds) =>
        ctc >= parseFloat(tds.annual_salary_from) &&
        ctc <= parseFloat(tds.annual_salary_upto)
    );
    return tds ? (ctc * parseFloat(tds.salary_percent)) / 100 / 12 : 0;
  };

  const calculateComponentValues = (annualCtc) => {
    const ctc = parseFloat(annualCtc) || 0;
    const basicPercent = 40; // default as per AddSalaryModal
    const values = {};

    // BASIC
    const basicAnnual = (ctc * basicPercent) / 100;
    const basicMonthly = basicAnnual / 12;
    values["Basic Salary"] = {
      monthly: basicMonthly,
      annual: basicAnnual,
      type: "Earnings",
    };

    // OTHER COMPONENTS
    salaryComponents.forEach((comp) => {
      if (!comp.isActive) return;
      const compValue = getComponentValue(comp.salary_components);
      let value = 0;

      switch (comp.value_type) {
        case "CTC Percent":
          value = (ctc * (compValue / 100)) / 12;
          break;
        case "Basic Percent":
          value = (basicAnnual * (compValue / 100)) / 12;
          break;
        case "Fixed":
          value = compValue;
          break;
        default:
          value = 0;
      }

      if (
        pfCapping &&
        (comp.salary_components === "PF" ||
          comp.salary_components === "PF(Employer)")
      ) {
        if (value > 1800) value = 1800;
      }

      values[comp.salary_components] = {
        monthly: value,
        annual: value * 12,
        type: comp.component_type || "Earnings",
      };
    });

    // TDS
    const tdsMonthly = calculateTds(ctc);
    values["TDS"] = {
      monthly: tdsMonthly,
      annual: tdsMonthly * 12,
      type: "Deduction",
    };

    return values;
  };

  // ---------------- On Increment Change ----------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);

    const increment = parseFloat(updated.annual_increment_amount) || 0;
    let newAnnual =
      updated.value_type === "Increment"
        ? salaryData.currentAnnual + increment
        : salaryData.currentAnnual - increment;

    setSalaryData((prev) => ({
      ...prev,
      incrementedAnnual: newAnnual,
      incrementedMonthly: newAnnual / 12,
    }));

    const newValues = calculateComponentValues(newAnnual);
    setCalculatedValues(newValues);
  };

  // ---------------- Save Updated Salary ----------------
  const handleSave = async () => {
    if (!employee?.id || !salaryData.incrementedAnnual) {
      toast.warn("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      const liveCalculatedValues = calculateComponentValues(
        salaryData.incrementedAnnual
      );

      const totalEarningsMonthly = Object.values(liveCalculatedValues)
        .filter((v) => v.type === "Earnings")
        .reduce((sum, v) => sum + (v.monthly || 0), 0);

      const totalDeductionsMonthly = Object.values(liveCalculatedValues)
        .filter((v) => v.type === "Deduction")
        .reduce((sum, v) => sum + (v.monthly || 0), 0);

      const totalAnnual = salaryData.incrementedAnnual;
      const totalMonthly = totalAnnual / 12;
      const netMonthly = totalMonthly - totalDeductionsMonthly;
      const netAnnual = netMonthly * 12;

      const componentPayload = Object.entries(liveCalculatedValues).map(
        ([name, comp]) => {
          const matchedComp = componentsData.find(
            (c) => c.salary_components === name
          );
          return {
            component_id: matchedComp ? matchedComp.id : null,
            component_name: name,
            component_type:
              comp.type.toLowerCase() === "deduction" ? "deduction" : "earning",
            component_percent:
              componentOverrides[name] ||
              matchedComp?.component_value_monthly ||
              0,
            component_annual: comp.annual?.toFixed(2) || 0,
            component_monthly: comp.monthly?.toFixed(2) || 0,
          };
        }
      );

      const payload = {
        employee_id: employee.id,
        per_annum_sal: totalAnnual,
        basic_per: 40,
        basic_amount:
          liveCalculatedValues["Basic Salary"]?.monthly?.toFixed(2) || 0,
        deduction: totalDeductionsMonthly.toFixed(2),
        addition: totalEarningsMonthly.toFixed(2),
        total_monthly: totalMonthly.toFixed(2),
        total_annual: totalAnnual.toFixed(2),
        net_monthly: netMonthly.toFixed(2),
        net_annual: netAnnual.toFixed(2),
        status: "paid",
        sal_pay_id: 1,
        paid_date: formData.increment_date,
        year: new Date().getFullYear(),
        month: new Date().toLocaleString("default", { month: "long" }),
        salary_components: componentPayload,
        remarks: `${formData.value_type} of ₹${formData.annual_increment_amount}`,
        annual_amount: formData.annual_increment_amount,
        value_type: `${formData.value_type}`,
      };

      console.log("🟢 Updated Salary Payload:", payload);

      const res = await api.post(
        "/api/v1/admin/employeeSalary/employee-salary",
        payload
      );

      if (res.data.success) {
        toast.success("Salary updated successfully!");
        handleClose();
      } else {
        toast.error(res.data.message || "Failed to update salary");
      }
    } catch (err) {
      console.error("❌ Error updating salary:", err);
      toast.error("Something went wrong while updating salary");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Render ----------------
  const earnings = Object.entries(calculatedValues).filter(
    ([_, v]) => v.type === "Earnings"
  );
  const deductions = Object.entries(calculatedValues).filter(
    ([_, v]) => v.type === "Deduction"
  );

  const totalMonthly = salaryData.incrementedAnnual / 12;
  const totalAnnual = salaryData.incrementedAnnual;
  const totalEarningsMonthly = earnings.reduce(
    (sum, [_, v]) => sum + (v.monthly || 0),
    0
  );
  const totalDeductionsMonthly = deductions.reduce(
    (sum, [_, v]) => sum + (v.monthly || 0),
    0
  );
  const netMonthly = totalMonthly - totalDeductionsMonthly;
  const netAnnual = netMonthly * 12;

  return (
    <Modal show={show} onHide={handleClose} size="xl" centered>
      <Modal.Header closeButton>
        <Modal.Title>Update Salary for {employee?.name}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {loading ? (
          <div className="text-center p-5">
            <Spinner animation="border" />
          </div>
        ) : (
          <Form>
            {/* EMPLOYEE */}
            <Card className="p-3 mb-4 shadow-sm">
              <Row>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Employee</Form.Label>
                    <Form.Control
                      type="text"
                      value={`${employee?.name || ""} (${
                        employee?.emp_id || ""
                      })`}
                      readOnly
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Current Annual Salary</Form.Label>
                    <Form.Control
                      type="text"
                      value={`₹${salaryData.currentAnnual.toLocaleString(
                        "en-IN"
                      )}`}
                      readOnly
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Current Monthly Salary</Form.Label>
                    <Form.Control
                      type="text"
                      value={`₹${salaryData.currentMonthly.toLocaleString(
                        "en-IN"
                      )}`}
                      readOnly
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Card>

            {/* INCREMENT INPUTS */}
            <Card className="p-3 mb-4 border-primary shadow-sm">
              <Row>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Value Type</Form.Label>
                    <Form.Select
                      name="value_type"
                      value={formData.value_type}
                      onChange={handleChange}
                    >
                      <option value="Increment">Increment</option>
                      <option value="Decrement">Decrement</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Annual Increment Amount</Form.Label>
                    <Form.Control
                      type="number"
                      name="annual_increment_amount"
                      value={formData.annual_increment_amount}
                      onChange={handleChange}
                      placeholder="Enter Amount"
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Effective Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="increment_date"
                      value={formData.increment_date}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Card>

            {/* EARNINGS */}
            {earnings.length > 0 && (
              <Card className="p-3 mb-4 shadow-sm">
                <h5 className="text-success mb-3">Earnings</h5>
                {earnings.map(([compName, comp]) => (
                  <Row className="mb-2" key={compName}>
                    <Col md={4}>
                      <Form.Label>{compName}</Form.Label>
                    </Col>
                    <Col md={4}>
                      <Form.Control
                        type="text"
                        value={`₹${comp.monthly.toFixed(2)}`}
                        readOnly
                      />
                    </Col>
                    <Col md={4}>
                      <Form.Control
                        type="text"
                        value={`₹${comp.annual.toFixed(2)}`}
                        readOnly
                      />
                    </Col>
                  </Row>
                ))}
              </Card>
            )}

            {/* DEDUCTIONS */}
            {deductions.length > 0 && (
              <Card className="p-3 mb-4 shadow-sm">
                <h5 className="text-danger mb-3">Deductions</h5>
                {deductions.map(([compName, comp]) => (
                  <Row className="mb-2" key={compName}>
                    <Col md={4}>
                      <Form.Label>{compName}</Form.Label>
                    </Col>
                    <Col md={4}>
                      <Form.Control
                        type="text"
                        value={`₹${comp.monthly.toFixed(2)}`}
                        readOnly
                      />
                    </Col>
                    <Col md={4}>
                      <Form.Control
                        type="text"
                        value={`₹${comp.annual.toFixed(2)}`}
                        readOnly
                      />
                    </Col>
                  </Row>
                ))}
              </Card>
            )}

            {/* TOTAL */}
            <Card className="p-3 mb-4 bg-light shadow-sm border-primary">
              <Row className="align-items-center">
                <Col md={6}>
                  <h5 className="fw-bold text-primary mb-0">
                    Total CTC (Incremented)
                  </h5>
                </Col>
                <Col md={3} className="text-end">
                  <h5>₹{totalMonthly.toFixed(2)}</h5>
                  <small>Monthly</small>
                </Col>
                <Col md={3} className="text-end">
                  <h5>₹{totalAnnual.toFixed(2)}</h5>
                  <small>Annual</small>
                </Col>
              </Row>
            </Card>

            <Card className="p-3 mb-4 bg-success bg-opacity-10 border-success shadow-sm">
              <Row className="align-items-center">
                <Col md={6}>
                  <h5 className="fw-bold text-success mb-0">
                    Net Pay (Take Home)
                  </h5>
                </Col>
                <Col md={3} className="text-end">
                  <h5 className="text-success">₹{netMonthly.toFixed(2)}</h5>
                  <small>Monthly</small>
                </Col>
                <Col md={3} className="text-end">
                  <h5 className="text-success">₹{netAnnual.toFixed(2)}</h5>
                  <small>Annual</small>
                </Col>
              </Row>
            </Card>
          </Form>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="outline-secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave} disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : "Save"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UpdateSalaryModal;
