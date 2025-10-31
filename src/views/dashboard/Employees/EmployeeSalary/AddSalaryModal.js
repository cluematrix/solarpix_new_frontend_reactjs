import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Spinner, Card, Col, Row } from "react-bootstrap";
import api from "../../../../api/axios";
import { toast } from "react-toastify";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";

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
  const [employeeList, setEmployeeList] = useState([]);

  // Fetch salary components, TDS, and PF capping when modal opens
  useEffect(() => {
    if (show && employee) {
      fetchSalaryComponents();
      fetchTdsData();
      fetchPfCapping();

      const employeeGroup = salaryGroups.find((group) =>
        group.employees.some((emp) => emp.id === employee.id)
      );

      setFormData({
        employee_id: employee.id,
        annual_ctc: "",
        basic_salary_percent: 40, // Default to 40% as per API response
        selectedBasicId: "",
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
        (b) =>
          b.salary_components === "Basic" &&
          b.isActive &&
          b.value_type === "CTC Percent"
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

  // Fetch Active Salary Components
  const fetchEmployeeSalary = async () => {
    try {
      const res = await api.get("/api/v1/admin/employeeSalary/employee-salary");
      setEmployeeList(res?.data?.data);
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
      return parseFloat(componentOverrides[componentName]) || 0;
    }
    const comp = componentsData.find(
      (c) => c.salary_components === componentName && c.isActive
    );
    return comp ? parseFloat(comp.component_value_monthly) || 0 : 0;
  };

  // Calculate TDS based on annual CTC
  const calculateTds = (ctc) => {
    const tds = tdsData.find(
      (tds) =>
        ctc >= parseFloat(tds.annual_salary_from) &&
        ctc <= parseFloat(tds.annual_salary_upto)
    );
    return tds ? (ctc * parseFloat(tds.salary_percent)) / 100 / 12 : 0;
  };

  // Main Calculation Logic
  const calculateComponentValues = () => {
    const ctc = parseFloat(formData.annual_ctc) || 0;
    const basicPercent = parseFloat(formData.basic_salary_percent) || 0;
    const values = {};

    // BASIC CALCULATION
    const selectedBasic = componentsData.find(
      (b) => b.id === parseInt(formData.selectedBasicId)
    );
    let basicMonthly = 0;
    let basicAnnual = 0;

    if (selectedBasic) {
      if (selectedBasic.value_type === "Fixed") {
        basicMonthly = parseFloat(selectedBasic.component_value_monthly) || 0;
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
        (comp.salary_components === "PF" ||
          comp.salary_components === "PF(Employer)")
      ) {
        if (value > 1800) {
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

  useEffect(() => {
    fetchEmployeeSalary();
  }, []);

  // Live Calculation Effect
  useEffect(() => {
    if (formData.annual_ctc) {
      const values = calculateComponentValues();
      setCalculatedValues(values);
      console.log("Calculated Values:", values);
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
  // ✅ Save Salary Data
  const onSave = async () => {
    try {
      setLoading(true);

      if (
        !formData.employee_id ||
        !formData.annual_ctc ||
        parseFloat(formData.annual_ctc) <= 0
      ) {
        toast.warn("Please fill required fields with valid values");
        return;
      }

      // 🔹 Recalculate all component values
      const liveCalculatedValues = calculateComponentValues();

      // 🔹 Calculate earnings & deductions
      const totalEarningsMonthly = Object.values(liveCalculatedValues)
        .filter((v) => v.type === "Earnings")
        .reduce((sum, v) => sum + (v.monthly || 0), 0);

      const totalDeductionsMonthly = Object.values(liveCalculatedValues)
        .filter((v) => v.type === "Deduction")
        .reduce((sum, v) => sum + (v.monthly || 0), 0);

      // 🔹 Annual totals
      const totalEarningsAnnual = totalEarningsMonthly * 12;
      const totalDeductionsAnnual = totalDeductionsMonthly * 12;

      // ✅ Fix as per your requirements
      const totalMonthly = parseFloat(formData.annual_ctc) / 12; // (25,000)
      const totalAnnual = parseFloat(formData.annual_ctc); // (300,000)

      const netMonthly = totalMonthly - totalDeductionsMonthly; // (25,000 - 2,950 = 22,050)
      const netAnnual = netMonthly * 12; // (22,050 * 12 = 264,600)

      // 🔹 Build component payload
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

      // 🔹 Build final payload
      const payload = {
        employee_id: formData.employee_id,
        per_annum_sal: parseFloat(formData.annual_ctc) || 0,
        basic_per: parseFloat(formData.basic_salary_percent) || 0,
        basic_amount:
          liveCalculatedValues["Basic Salary"]?.monthly?.toFixed(2) || 0,
        deduction: totalDeductionsMonthly.toFixed(2),
        addition: totalEarningsMonthly.toFixed(2),
        total_monthly: totalMonthly.toFixed(2), //  25,000
        total_annual: totalAnnual.toFixed(2), //  300,000
        net_monthly: netMonthly.toFixed(2), //  25,000 - 2,950 = 22,050
        net_annual: netAnnual.toFixed(2), //  22,050 * 12 = 264,600
        status: "paid",
        sal_pay_id: 1,
        paid_date: new Date().toISOString().split("T")[0],
        year: new Date().getFullYear(),
        month: new Date().toLocaleString("default", { month: "long" }),
        salary_components: componentPayload,
      };

      console.log("➡️ Final Payload Sent:", payload);

      // 🔹 Send to backend
      const res = await api.post(
        "/api/v1/admin/employeeSalary/employee-salary",
        payload
      );

      if (res.data.success) {
        toast.success("Salary saved successfully!");
        fetchEmployeeSalary();
        handleClose();
      } else {
        toast.error(
          `Failed to save salary: ${res.data.message || "Unknown error"}`
        );
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

  console.log("deductionsww", deductions);

  // 🔹 👉 ADD THIS BLOCK RIGHT BEFORE THE RETURN STATEMENT 👇
  const totalMonthly = parseFloat(formData.annual_ctc || 0) / 12;
  const totalAnnual = parseFloat(formData.annual_ctc || 0);

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
                    required
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
                          ? `Fixed - ${(<CurrencyRupeeIcon />)}${
                              b.component_value_monthly
                            }/month`
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
              console.log("earningsss", earnings);
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
                        value={`₹${getComponentValue(compName).toFixed(2)}`}
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
            {deductions.map(([compName, comp]) => {
              console.log("compNamedd", compName);
              console.log("compss", comp);
              return (
                <Row className="mb-3" key={compName}>
                  <Col md={4}>
                    <Form.Label>{compName}</Form.Label>
                    <Form.Control
                      type="text"
                      value={
                        compName === "TDS"
                          ? `${(
                              ((comp.monthly || 0) * 12 * 100) /
                              parseFloat(formData.annual_ctc || 1)
                            ).toFixed(2)}%`
                          : `₹${(comp.monthly || 0).toFixed(2)}`
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
              );
            })}
          </Card>

          {/* TOTAL & NET PAY */}
          {/*  TOTAL & NET PAY SECTION */}
          <Card className="p-3 mb-4 bg-light shadow-sm border-primary">
            <Row className="align-items-center">
              <Col md={6}>
                <h5 className="fw-bold text-primary mb-0">
                  Total Cost To Company (CTC)
                </h5>
              </Col>
              <Col md={3} className="text-end">
                <h5 className="mb-0">₹{totalMonthly.toFixed(2)}</h5>
                <small className="text-muted">Monthly</small>
              </Col>
              <Col md={3} className="text-end">
                <h5 className="mb-0">₹{totalAnnual.toFixed(2)}</h5>
                <small className="text-muted">Annual</small>
              </Col>
            </Row>
          </Card>

          <Card className="p-3 mb-4 bg-success bg-opacity-10 shadow-sm border-success">
            <Row className="align-items-center">
              <Col md={6}>
                <h5 className="fw-bold text-success mb-0">
                  Net Pay (Take Home)
                </h5>
              </Col>
              <Col md={3} className="text-end">
                <h5 className="mb-0 text-success">₹{netMonthly.toFixed(2)}</h5>
                <small className="text-muted">Monthly</small>
              </Col>
              <Col md={3} className="text-end">
                <h5 className="mb-0 text-success">₹{netAnnual.toFixed(2)}</h5>
                <small className="text-muted">Annual</small>
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
