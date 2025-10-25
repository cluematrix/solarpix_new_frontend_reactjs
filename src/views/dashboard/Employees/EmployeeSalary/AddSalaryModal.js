import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Spinner, Card, Col, Row } from "react-bootstrap";
import api from "../../../../api/axios";
import { toast } from "react-toastify";

const AddSalaryModal = ({ show, handleClose, employee, salaryGroups }) => {
  const [formData, setFormData] = useState({
    employee_id: "",
    annual_ctc: "",
    basic_salary_percent: 50,
    selectedBasicId: "",
  });

  const [loading, setLoading] = useState(false);
  const [salaryComponents, setSalaryComponents] = useState([]);
  const [componentsData, setComponentsData] = useState([]);
  const [tdsData, setTdsData] = useState([]);
  const [pfCapping, setPfCapping] = useState(false);
  const [calculatedValues, setCalculatedValues] = useState({});

  // Fetch salary components, TDS, and PF capping when modal opens
  useEffect(() => {
    if (show && employee) {
      fetchSalaryComponents();
      fetchTdsData();
      fetchPfCapping();

      const employeeGroup = salaryGroups.find((group) =>
        group.employees.some((emp) => emp.id === employee.id)
      );

      // Find default Basic component (e.g., 40%)
      const defaultBasic = componentsData.find(
        (b) => b.salary_components === "Basic" && b.isActive
      );

      setFormData({
        employee_id: employee.id,
        annual_ctc: "",
        basic_salary_percent: defaultBasic
          ? parseFloat(defaultBasic.component_value_monthly)
          : 40, // fallback default 40%
        selectedBasicId: defaultBasic ? defaultBasic.id : "",
      });

      if (employeeGroup) {
        setSalaryComponents(employeeGroup.components || []);
      }
    }
  }, [show, employee, salaryGroups]);

  // Auto-select Basic component after componentsData loads
  useEffect(() => {
    if (componentsData.length > 0 && show) {
      const defaultBasic = componentsData.find(
        (b) => b.salary_components === "Basic" && b.isActive
      );

      if (defaultBasic) {
        setFormData((prev) => ({
          ...prev,
          selectedBasicId: defaultBasic.id,
          basic_salary_percent:
            parseFloat(defaultBasic.component_value_monthly) || 40,
        }));
      }
    }
  }, [componentsData, show]);
  // Fetch Active Salary Components
  const fetchSalaryComponents = async () => {
    try {
      const res = await api.get("/api/v1/admin/addSalaryComponent/active");
      if (res.data.success) {
        setComponentsData(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching salary components:", error);
      toast.error("Failed to load salary components");
    }
  };

  // Fetch TDS Data
  const fetchTdsData = async () => {
    try {
      const res = await api.get("/api/v1/admin/salaryTDS");
      if (res.data.success) {
        setTdsData(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching TDS data:", error);
      toast.error("Failed to load TDS data");
    }
  };

  // Fetch PF Capping
  const fetchPfCapping = async () => {
    try {
      const res = await api.get("/api/v1/admin/PFCapping");
      if (res.data.success && res.data.data.length > 0) {
        setPfCapping(res.data.data[0].Capping);
      }
    } catch (error) {
      console.error("Error fetching PF capping:", error);
      toast.error("Failed to load PF capping data");
    }
  };

  // Basic Options (Filtered)
  const basicOptions = componentsData.filter(
    (c) => c.salary_components === "Basic" && c.isActive
  );

  // Get Component Value by Name
  const getComponentValue = (componentName) => {
    const comp = componentsData.find(
      (c) => c.salary_components === componentName && c.isActive
    );
    if (!comp) return 0;
    return parseFloat(comp.component_value_monthly) || 0;
  };

  // Calculate TDS based on annual CTC
  const calculateTds = (ctc) => {
    const tds = tdsData.find(
      (tds) =>
        ctc >= parseFloat(tds.annual_salary_from) &&
        ctc <= parseFloat(tds.annual_salary_upto)
    );
    if (!tds) return 0;
    return (ctc * parseFloat(tds.salary_percent)) / 100 / 12; // Monthly TDS
  };

  // Main Calculation Logic
  const calculateComponentValues = () => {
    const ctc = parseFloat(formData.annual_ctc) || 0;
    const basicPercent = parseFloat(formData.basic_salary_percent) || 0;
    const values = {};
    let netPayAdjustment = 0;

    // BASIC SALARY OLD CODE BY RISHI LOGIC
    // const basicAnnual = (ctc * basicPercent) / 100;
    // const basicMonthly = basicAnnual / 12;
    // values["Basic Salary"] = {
    //   monthly: basicMonthly,
    //   annual: basicAnnual,
    //   type: "Earnings",
    // };

    // BASIC SALARY  SAI RITIK LOGIC 24 OCT
    const selectedBasic = componentsData.find(
      (b) => b.id === parseInt(formData.selectedBasicId)
    );
    let basicMonthly = 0;
    let basicAnnual = 0;

    if (selectedBasic) {
      if (selectedBasic.value_type === "Fixed") {
        // User enters a fixed monthly value
        basicMonthly = parseFloat(formData.basic_salary_percent) || 0;
        basicAnnual = basicMonthly * 12;
      } else if (selectedBasic.value_type === "CTC Percent") {
        // Calculate from Annual CTC percentage
        basicAnnual = (ctc * parseFloat(formData.basic_salary_percent)) / 100;
        basicMonthly = basicAnnual / 12;
      }
    }

    values["Basic Salary"] = {
      monthly: basicMonthly,
      annual: basicAnnual,
      type: "Earnings",
    };

    // OTHER COMPONENTS
    salaryComponents.forEach((comp) => {
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

      // Apply PF Capping for PF (Employee) and PF (Employer)
      if (
        pfCapping &&
        (comp.salary_components === "PF (Employee)" ||
          comp.salary_components === "PF (Employer)")
      ) {
        if (value > 1800) {
          netPayAdjustment += value - 1800; // Excess goes to net pay
          value = 1800; // Cap at 1800
        }
      }

      values[comp.salary_components] = {
        monthly: value,
        annual: value * 12,
        type: comp.component_type || "Earnings", // Default to Earnings if not specified
      };
    });

    // SPECIAL ALLOWANCE (Remaining)
    // const totalUsed = Object.values(values).reduce(
    //   (sum, v) => sum + v.annual,
    //   0
    // );
    // const specialAnnual = ctc - totalUsed;
    // const specialMonthly = specialAnnual / 12;

    // values["Special Allowance"] = {
    //   monthly: specialMonthly,
    //   annual: specialAnnual,
    //   type: "Earnings",
    // };

    // TDS
    const tdsMonthly = calculateTds(ctc);
    values["TDS"] = {
      monthly: tdsMonthly,
      annual: tdsMonthly * 12,
      type: "Deduction",
    };

    // Net Pay Adjustment (from PF capping excess)
    // values["Net Pay Adjustment"] = {
    //   monthly: netPayAdjustment,
    //   annual: netPayAdjustment * 12,
    //   type: "Earnings",
    // };

    return values;
  };

  // Live Calculation Effect
  useEffect(() => {
    if (formData.annual_ctc) {
      setCalculatedValues(calculateComponentValues());
    }
  }, [formData, componentsData, salaryComponents, tdsData, pfCapping]);

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Save Salary Data
  const onSave = async () => {
    try {
      setLoading(true);
      if (!formData.employee_id || !formData.annual_ctc) {
        toast.warn("Please fill required fields");
        return;
      }

      console.log("Saving salary:", formData, calculatedValues);
      toast.success("Salary saved successfully!");
      handleClose();
    } catch (err) {
      toast.error("Failed to save salary");
    } finally {
      setLoading(false);
    }
  };

  const values = calculateComponentValues();

  // Separate Earnings and Deductions
  const earnings = Object.entries(values).filter(
    ([_, val]) => val.type === "Earnings"
  );
  const deductions = Object.entries(values).filter(
    ([_, val]) => val.type === "Deduction"
  );

  return (
    <Modal show={show} onHide={handleClose} size="xl" centered>
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold text-primary">
          Add Salary for {employee?.name}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          {/* EMPLOYEE DETAILS */}
          <Card className="p-3 mb-4 shadow-sm">
            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Employee</Form.Label>
                  <Form.Control
                    type="text"
                    value={`${employee?.name} (${employee?.emp_id || "N/A"})`}
                    readOnly
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Annual CTC *</Form.Label>
                  <Form.Control
                    type="number"
                    name="annual_ctc"
                    placeholder="Enter Annual CTC"
                    value={formData.annual_ctc}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Card>

          {/* BASIC SALARY */}
          <Card className="p-3 mb-4 border-primary shadow-sm">
            <h5 className="text-primary mb-3">Basic Salary</h5>
            <Row>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Select Basic Component</Form.Label>
                  <Form.Select
                    name="selectedBasicId"
                    value={formData.selectedBasicId}
                    onChange={(e) => {
                      const selectedId = e.target.value;
                      const selectedComp = basicOptions.find(
                        (b) => b.id === parseInt(selectedId)
                      );
                      setFormData((prev) => ({
                        ...prev,
                        selectedBasicId: selectedId,
                        basic_salary_percent: selectedComp
                          ? parseFloat(selectedComp.component_value_monthly)
                          : 0,
                      }));
                    }}
                  >
                    <option value="">Select Basic Option</option>
                    {basicOptions.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.value_type === "Fixed"
                          ? `Fixed - ₹${b.component_value_monthly}/month`
                          : `CTC Percent - ${b.component_value_monthly}%`}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={2}>
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
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Monthly</Form.Label>
                  <Form.Control
                    type="number"
                    value={
                      calculatedValues["Basic Salary"]?.monthly?.toFixed(2) || 0
                    }
                    readOnly
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Annual</Form.Label>
                  <Form.Control
                    type="number"
                    value={
                      calculatedValues["Basic Salary"]?.annual?.toFixed(2) || 0
                    }
                    readOnly
                  />
                </Form.Group>
              </Col>
            </Row>
          </Card>

          {/* EARNINGS */}
          <Card className="p-3 mb-4 shadow-sm">
            <h5 className="text-secondary mb-3">Earnings</h5>
            {earnings.map(([compName, comp]) => (
              <Row className="mb-3" key={compName}>
                <Col md={4}>
                  <Form.Label>{compName}</Form.Label>
                  <Form.Control
                    type="text"
                    value={
                      componentsData
                        .find((c) => c.salary_components === compName)
                        ?.value_type.includes("Percent")
                        ? `${getComponentValue(compName)}%`
                        : `₹${getComponentValue(compName)}`
                    }
                    readOnly
                  />
                </Col>
                <Col md={4}>
                  <Form.Label>Monthly</Form.Label>
                  <Form.Control
                    type="number"
                    value={comp.monthly?.toFixed(2) || 0}
                    readOnly
                  />
                </Col>
                <Col md={4}>
                  <Form.Label>Annual</Form.Label>
                  <Form.Control
                    type="number"
                    value={comp.annual?.toFixed(2) || 0}
                    readOnly
                  />
                </Col>
              </Row>
            ))}
          </Card>

          {/* DEDUCTIONS */}
          <Card className="p-3 mb-4 shadow-sm">
            <h5 className="text-danger mb-3">Deductions</h5>
            {deductions.map(([compName, comp]) => (
              <Row className="mb-3" key={compName}>
                <Col md={4}>
                  <Form.Label>{compName}</Form.Label>
                  <Form.Control
                    type="text"
                    value={
                      compName === "TDS"
                        ? `${(
                            (comp.monthly * 12 * 100) /
                            parseFloat(formData.annual_ctc || 1)
                          ).toFixed(2)}%`
                        : `₹${comp.monthly}`
                    }
                    readOnly
                  />
                </Col>
                <Col md={4}>
                  <Form.Label>Monthly</Form.Label>
                  <Form.Control
                    type="number"
                    value={comp.monthly?.toFixed(2) || 0}
                    readOnly
                  />
                </Col>
                <Col md={4}>
                  <Form.Label>Annual</Form.Label>
                  <Form.Control
                    type="number"
                    value={comp.annual?.toFixed(2) || 0}
                    readOnly
                  />
                </Col>
              </Row>
            ))}
          </Card>

          {/* TOTAL CTC */}
          <Card className="p-3 bg-light shadow-sm">
            <Row>
              <Col md={6}>
                <h5 className="fw-bold">Total Cost To Company (CTC)</h5>
              </Col>
              <Col md={3}>
                <h5>₹{(formData.annual_ctc / 12 || 0).toFixed(2)}</h5>
              </Col>
              <Col md={3}>
                <h5>₹{parseFloat(formData.annual_ctc || 0).toFixed(2)}</h5>
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
          {loading ? <Spinner animation="border" size="sm" /> : "Save"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddSalaryModal;
