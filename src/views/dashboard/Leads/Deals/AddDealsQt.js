import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../../../../api/axios";
import * as Yup from "yup";
import { successToast } from "../../../../components/Toast/successToast";
import { errorToast } from "../../../../components/Toast/errorToast";
import { useFormik } from "formik";
import CustomSelect from "../../../../components/Form/CustomSelect";

const AddDealsQt = ({ editData }) => {
  // initial values
  const initialValues = {
    sender_by_id: "", // emp id
    lead_id: "", // lead => customer
  };

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [metaData, setMetaData] = useState({
    leadData: [],
    employeeData: [],
  });

  // validation
  // const validationSchema = Yup.object({

  // })

  // Fetch dropdown data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [leadRes, empRes] = await Promise.all([
          api.get("/api/v1/admin/lead/active"), //active with won list
          api.get("/api/v1/admin/employee/active"),
        ]);
        setMetaData({
          leadData: leadRes?.data || [],
          employeeData: empRes.data.data || [],
        });
      } catch (err) {
        console.error("Error loading data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // on submit
  const onSubmit = async (values) => {
    setLoading(true);
    try {
      if (editData) {
        await api.put(`/api/v1/admin/deal/${editData.id}`, values);
        successToast("Quotation updated successfully");
      } else {
        await api.post("/api/v1/admin/deal", values);
        successToast("Quotation created successfully");
        navigate("/deals-list");
      }
    } catch (error) {
      console.error("Error saving deal:", error);
      errorToast(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues,
    onSubmit,
    // validationSchema,
  });

  const { values, errors, touched, handleSubmit, handleBlur, handleChange } =
    formik;

  // fetch lead obj according to lead_id
  const leadObj = metaData.leadData.find(
    (item) => item.id === Number(values.lead_id)
  );

  // address render field
  const renderField = (label, value) => (
    <Row className="mb-2">
      <Col xs={5} className="fw-semibold text-muted">
        {label}:
      </Col>
      <Col xs={7}>{value || "—"}</Col>
    </Row>
  );
  // console section
  console.log("leadObj", leadObj);

  return (
    <Card className="p-4 shadow-sm">
      <Card.Header>
        <h5 className="mb-0">Lead</h5>
      </Card.Header>
      <hr />
      <Card.Body className="pt-0">
        <Form onSubmit={handleSubmit}>
          {/* lead_id, sender_by_id */}
          <Row className="mb-3">
            <Col md={4}>
              <CustomSelect
                label="Customer"
                name="lead_id"
                value={values?.lead_id}
                onChange={handleChange}
                onBlur={handleBlur}
                options={metaData?.leadData}
                placeholder="--"
                error={errors?.lead_id}
                touched={touched?.lead_id}
                required
                lableName="name"
                lableKey="id"
              />
            </Col>

            <Col md={4}>
              <CustomSelect
                label="Assign To"
                name="sender_by_id"
                value={values?.sender_by_id}
                onChange={handleChange}
                onBlur={handleBlur}
                options={metaData.employeeData}
                placeholder="--"
                error={errors.sender_by_id}
                touched={touched.sender_by_id}
                required
                lableName="name"
                lableKey="id"
              />
            </Col>
          </Row>

          {/* showing lead(customer) address */}
          <Row>
            <Col md={6}>
              <Card className="border-0 shadow-sm h-80">
                <Card.Header className="bg-light fw-semibold text-muted py-1">
                  Billing Address
                </Card.Header>
                <Card.Body>
                  {leadObj.billing_city},{leadObj.billing_state}{" "}
                  {renderField("City", leadObj.billing_city)}
                  {renderField("State", leadObj.billing_state)}
                  {renderField("Address", leadObj.billing_address)}
                  {renderField("Pincode", leadObj.billing_pincode)}
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="border-0 shadow-sm mb-3 h-100">
                <Card.Header className="bg-light fw-semibold text-muted py-2">
                  Billing Address
                </Card.Header>
                <Card.Body>
                  {" "}
                  {renderField("City", leadObj.shipping_city)}
                  {renderField("State", leadObj.shipping_state)}
                  {renderField("Address", leadObj.shipping_address)}
                  {renderField("Pincode", leadObj.shipping_pincode)}
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Save */}
          <div className="text-end mt-2">
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? "Saving..." : editData ? "Update" : "Save"}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default AddDealsQt;
