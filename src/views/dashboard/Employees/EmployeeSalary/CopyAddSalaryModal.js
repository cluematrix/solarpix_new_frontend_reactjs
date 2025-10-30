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
  const [componentOverrides, setComponentOverrides] = useState({});

  // Fetch salary components, TDS, and PF capping when modal opens
  useEffect(() => {
    if (show && employee) {
      fetchSalaryComponents();
      fetchTdsData();
      fetchPfCapping();

      const employeeGroup = salaryGroups.find((group) =>
        group.employees.some((emp) => emp.id === employee.id)
      );

      const defaultBasic = componentsData.find(
        (b) => b.salary_components === "Basic" && b.isActive
      );

      setFormData({
        employee_id: employee.id,
        annual_ctc: "",
        basic_salary_percent: defaultBasic
          ? parseFloat(defaultBasic.component_value_monthly)
          : 40,
        selectedBasicId: defaultBasic ? defaultBasic.id : "",
      });

      if (employeeGroup) {
        setSalaryComponents(employeeGroup.components || []);
      }
    }
  }, [show, employee, salaryGroups]);

  // Auto-select Basic component after componentsData loads and initialize overrides
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

        // Initialize component overrides with default percentages from componentsData
        const initialOverrides = {};
        salaryComponents.forEach((comp) => {
          const compData = componentsData.find(
            (c) => c.salary_components === comp.salary_components && c.isActive
          );
          if (compData && comp.value_type.includes("Percent")) {
            initialOverrides[comp.salary_components] = parseFloat(
              compData.component_value_monthly
            );
          }
        });
        setComponentOverrides(initialOverrides);
      }
    }
  }, [componentsData, show, salaryComponents]);

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

  // Get Component Value (uses override if present, otherwise default)
  const getComponentValue = (componentName) => {
    if (componentOverrides[componentName] !== undefined) {
      return parseFloat(componentOverrides[componentName]);
    }
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
    return (ctc * parseFloat(tds.salary_percent)) / 100 / 12;
  };

  // Main Calculation Logic
  const calculateComponentValues = () => {
    const ctc = parseFloat(formData.annual_ctc) || 0;
    const basicPercent = parseFloat(formData.basic_salary_percent) || 0;
    const values = {};
    let netPayAdjustment = 0;

    // BASIC CALCULATION
    const selectedBasic = componentsData.find(
      (b) => b.id === parseInt(formData.selectedBasicId)
    );
    let basicMonthly = 0;
    let basicAnnual = 0;

    if (selectedBasic) {
      if (selectedBasic.value_type === "Fixed") {
        basicMonthly = parseFloat(formData.basic_salary_percent) || 0;
        basicAnnual = basicMonthly * 12;
      } else if (selectedBasic.value_type === "CTC Percent") {
        basicAnnual = (ctc * basicPercent) / 100;
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

      // PF Capping
      if (
        pfCapping &&
        (comp.salary_components === "PF (Employee)" ||
          comp.salary_components === "PF (Employer)")
      ) {
        if (value > 1800) {
          netPayAdjustment += value - 1800;
          value = 1800;
        }
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

  // Live Calculation Effect
  useEffect(() => {
    if (formData.annual_ctc) {
      setCalculatedValues(calculateComponentValues());
    }
  }, [
    formData,
    componentsData,
    salaryComponents,
    tdsData,
    pfCapping,
    componentOverrides,
  ]);

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle Component Percent Change
  const handleComponentPercentChange = (componentName, value) => {
    setComponentOverrides((prev) => ({
      ...prev,
      [componentName]: parseFloat(value) || 0,
    }));
  };

  // Save Salary Data
  // const onSave = async () => {
  //   try {
  //     setLoading(true);
  //     if (!formData.employee_id || !formData.annual_ctc) {
  //       toast.warn("Please fill required fields");
  //       return;
  //     }
  //     console.log("Saving salary:", formData, calculatedValues);
  //     toast.success("Salary saved successfully!");
  //     handleClose();
  //   } catch (err) {
  //     toast.error("Failed to save salary");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const onSave = async () => {
    try {
      setLoading(true);

      if (!formData.employee_id || !formData.annual_ctc) {
        toast.warn("Please fill required fields");
        return;
      }

      // --- Prepare salary component breakdown ---
      const componentPayload = Object.entries(calculatedValues).map(
        ([name, comp]) => {
          const matchedComp = componentsData.find(
            (c) => c.salary_components === name
          );

          return {
            component_id: matchedComp ? matchedComp.id : null,
            component_name: name,
            component_type:
              comp.type?.toLowerCase() === "deduction"
                ? "deduction"
                : "earning",
            component_percent:
              componentOverrides[name] ||
              matchedComp?.component_value_monthly ||
              0,
            component_annual: comp.annual?.toFixed(2) || 0,
            component_monthly: comp.monthly?.toFixed(2) || 0,
          };
        }
      );

      // --- Calculate totals ---
      const totalEarningsMonthly = Object.values(calculatedValues)
        .filter((v) => v.type === "Earnings")
        .reduce((sum, v) => sum + v.monthly, 0);

      const totalDeductionsMonthly = Object.values(calculatedValues)
        .filter((v) => v.type === "Deduction")
        .reduce((sum, v) => sum + v.monthly, 0);

      const totalEarningsAnnual = totalEarningsMonthly * 12;
      const totalDeductionsAnnual = totalDeductionsMonthly * 12;

      const totalMonthly = totalEarningsMonthly + totalDeductionsMonthly;
      const totalAnnual = totalEarningsAnnual + totalDeductionsAnnual;

      const netMonthly = totalEarningsMonthly - totalDeductionsMonthly;
      const netAnnual = totalEarningsAnnual - totalDeductionsAnnual;

      // --- Build final payload ---
      const payload = {
        employee_id: formData.employee_id,
        per_annum_sal: parseFloat(formData.annual_ctc) || 0,
        basic_per: parseFloat(formData.basic_salary_percent) || 0,
        basic_amount:
          calculatedValues["Basic Salary"]?.monthly?.toFixed(2) || 0,
        deduction: totalDeductionsMonthly.toFixed(2),
        addition: totalEarningsMonthly.toFixed(2),

        // ✅ NEW FIELDS ADDED HERE
        total_monthly: totalMonthly.toFixed(2),
        total_annual: totalAnnual.toFixed(2),
        net_monthly: netMonthly.toFixed(2),
        net_annual: netAnnual.toFixed(2),

        status: "paid",
        sal_pay_id: 1, // Replace with selected payment method if needed
        paid_date: new Date().toISOString().split("T")[0],
        year: new Date().getFullYear(),
        month: new Date().toLocaleString("default", { month: "long" }),
        salary_components: componentPayload,
      };

      console.log("➡️ Sending payload to backend:", payload);

      const res = await api.post(
        "/api/v1/admin/employeeSalary/employee-salary",
        payload
      );

      if (res.data.success) {
        toast.success("Salary saved successfully!");
        handleClose();
      } else {
        toast.error("Failed to save salary");
      }
    } catch (err) {
      console.error("❌ Error saving salary:", err);
      toast.error("Something went wrong while saving salary");
    } finally {
      setLoading(false);
    }
  };

  const values = calculateComponentValues();
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
            <h5 className="text-success mb-3">Earnings</h5>
            {earnings.map(([compName, comp]) => {
              const compMeta = componentsData.find(
                (c) => c.salary_components === compName
              );
              const isPercentBased =
                compMeta?.value_type === "CTC Percent" ||
                compMeta?.value_type === "Basic Percent";
              return (
                <Row className="mb-3" key={compName}>
                  <Col md={4}>
                    <Form.Label>{compName}</Form.Label>
                    {isPercentBased ? (
                      <Form.Control
                        type="number"
                        value={getComponentValue(compName)}
                        onChange={(e) =>
                          handleComponentPercentChange(compName, e.target.value)
                        }
                      />
                    ) : (
                      <Form.Control
                        type="text"
                        value={`₹${getComponentValue(compName)}`}
                        readOnly
                      />
                    )}
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
              );
            })}
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

          {/* TOTAL & NET PAY */}
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

          <Card className="p-3 mb-4 bg-success bg-opacity-10 shadow-sm border-success">
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
          {loading ? <Spinner animation="border" size="sm" /> : "Save"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddSalaryModal;
