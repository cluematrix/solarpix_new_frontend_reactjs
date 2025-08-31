import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Card, Spinner } from "react-bootstrap";
import * as Yup from "yup";
import api from "../../../../api/axios";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import { successToast } from "../../../../components/Toast/successToast";
import { errorToast } from "../../../../components/Toast/errorToast";
import CustomInput from "../../../../components/Form/CustomInput";

const UpdateEmpBank = () => {
  const initialValues = {
    bank_name: "",
    account_no: "",
    ifsc_code: "",
    branch_name: "",
    employee_id: "",
  };

  const [loading, setLoading] = useState(true);

  const { id } = useParams();

  const navigate = useNavigate();

  const [empBankById, setEmpBankById] = useState([]);

  const validationSchema = Yup.object().shape({
    bank_name: Yup.string().required("Bank name is required"),
    account_no: Yup.string().required("Account number is required"),
    ifsc_code: Yup.string().required("IFSC code is required"),
    branch_name: Yup.string().required("Branch name is required"),
    employee_id: Yup.string().required("Employee Id is required"),
  });

  const onSubmit = async (values, { resetForm }) => {
    try {
      const res = await api.post("/api/v1/admin/employee", values);
      successToast(res.data.message || "Employee added successfully");
      // setEmployee((prev)=> [...prev, res.data.data])
      resetForm();
      navigate("/employee-list");
    } catch (err) {
      console.error("Error adding employee:", err);
      errorToast(err.response?.data?.message || "Failed to add employee");
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setValues,
    isSubmitting,
  } = formik;

  // fetch employee
  const fetchEmpBankById = async () => {
    try {
      setLoading(true)
      const res = await api.get(`/api/v1/admin/employee/${id}`);
      setEmpBankById(res.data.data);
    } catch (err) {
      console.error("Error fetching departments:", err);
    }
    finally{
      setLoading(false)
    }
  };

  useEffect(() => {
    fetchEmpBankById();
  }, []);

  // Create an object to map API data to Formik fields
  useEffect(() => {
    if (empBankById) {
      const updatedValues = { ...initialValues };
      Object.keys(updatedValues).forEach((key) => {
        updatedValues[key] = empBankById[key] || "";
      });
      setValues({
        ...updatedValues,
      });
    }
  }, [employeeById, setValues, setFieldValue]);

  //loading while fetching the api data
  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <Card>
      <Card.Header>
        <h5 className="mb-0">Update Bank Details</h5>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          {/* Row 1 */}
          <Row>
            <Col md={4}>
              <CustomInput
                label="Bank Name"
                name="bank_name"
                value={values.bank_name}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter Bank Name"
                touched={touched.bank_name}
                errors={errors.bank_name}
                required={true}
              />
            </Col>

            <Col md={4}>
              <CustomInput
                label="Account No"
                name="account_no"
                value={values.account_no}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter Account No"
                touched={touched.account_no}
                errors={errors.account_no}
                required={true}
              />
            </Col>
          </Row>

          {/* Row 2 */}
          <Row className="mt-3">
            <Col md={4}>
              <CustomInput
                label="IFSC Code"
                name="ifsc_code"
                value={values.ifsc_code}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter IFSC Code"
                touched={touched.ifsc_code}
                errors={errors.ifsc_code}
                required={true}
              />
            </Col>
            <Col md={4}>
              <CustomInput
                label="Branch Name"
                name="branch_name"
                value={values.branch_name}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter Branch Name"
                touched={touched.branch_name}
                errors={errors.branch_name}
                required={true}
              />
            </Col>
          </Row>

          {/* Row 3 */}
          <Row className="mt-3">
            <Col md={4}>
              <CustomInput
                label="Employee ID"
                name="employee_id"
                value={values.employee_id}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter Employee ID"
                touched={touched.employee_id}
                errors={errors.employee_id}
                required={true}
              />
            </Col>
          </Row>

          {/* Submit + Cancel */}
          <div className="mt-4 text-end">
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
            <Button
              variant="secondary"
              className="ms-2"
              onClick={() => navigate("/employee-list")}
            >
              Cancel
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default UpdateEmpBank;
