import React, { useState, useEffect } from "react";
import {
  Form,
  Button,
  Row,
  Col,
  Card,
  Table,
  Pagination,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../../../../api/axios";
import * as Yup from "yup";
import { successToast } from "../../../../components/Toast/successToast";
import { errorToast } from "../../../../components/Toast/errorToast";
import { useFormik } from "formik";
import CustomSelect from "../../../../components/Form/CustomSelect";
import CustomInput from "../../../../components/Form/CustomInput";
import AddItemModal from "./AddItemModal";

const AddDealsQt = ({ editData }) => {
  // initial values
  const initialValues = {
    sender_by_id: "", // emp id
    lead_id: "", // lead => customer
    quote_date: "",
    quote_expiry_date: "",
    bank_id: "",
  };

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // item category modal
  const [showModal, setShowModal] = useState(false);
  const [metaData, setMetaData] = useState({
    leadData: [],
    employeeData: [],
    bankData: [],
  });

  // validation
  // const validationSchema = Yup.object({
  // })

  // Fetch dropdown data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [leadRes, empRes, bankRes] = await Promise.all([
          api.get("/api/v1/admin/lead/active"), //active with won list
          api.get("/api/v1/admin/employee/active"),
          api.get("/api/v1/admin/companyBank/active"),
        ]);
        setMetaData({
          leadData: leadRes?.data || [],
          employeeData: empRes.data.data || [],
          bankData: bankRes.data.data || [],
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

  // console section
  console.log("leadObj", leadObj);

  return (
    <>
      <Card className="p-4 shadow-sm">
        <Card.Header>
          <h5 className="mb-0">Deal</h5>
        </Card.Header>
        <hr />
        <Card.Body className="pt-0">
          <Form onSubmit={handleSubmit}>
            {/* lead_id, sender_by_id, quote_date */}
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

              <Col md={4}>
                <CustomInput
                  type="date"
                  label="Quote Date"
                  name="quote_date"
                  value={values.quote_date}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter Quote Date"
                  touched={touched.quote_date}
                  errors={errors.quote_date}
                  required
                  min={new Date().toISOString().split("T")[0]}
                />
              </Col>
            </Row>

            {/* quote_expiry_date, bank */}
            <Row className="mb-3">
              <Col md={4}>
                <CustomInput
                  type="date"
                  label="Expiry Date"
                  name="quote_expiry_date"
                  value={values.quote_expiry_date}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter Quote Expiry Date"
                  touched={touched.quote_expiry_date}
                  errors={errors.quote_expiry_date}
                  min={new Date().toISOString().split("T")[0]}
                />
              </Col>

              <Col md={4}>
                <CustomSelect
                  label="Bank"
                  name="bank_id"
                  value={values?.bank_id}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  options={metaData.bankData}
                  placeholder="--"
                  error={errors.bank_id}
                  touched={touched.bank_id}
                  required
                  lableName="bank_name"
                  lableKey="id"
                />
              </Col>
            </Row>
            <div className="table-responsive">
              <Table hover responsive className="table">
                <thead>
                  <tr className="table-gray">
                    <th>Item Category</th>
                    <th>Description</th>
                    <th>Quantity</th>
                    <th>Rate</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {/* {itemCategory?.length === 0 ? ( */}
                  <tr>
                    <td colSpan="5" className="text-center">
                      No Item Available
                    </td>
                  </tr>
                  {/* ) : ( */}
                  {/* itemCategory?.map((item, idx) => ( */}
                  {/* <tr key={item.id || item._id}> */}
                  {/* <td>{(currentPageCat - 1) * itemsPerPageCat + idx + 1}</td> */}
                  {/* </tr> */}
                  {/* )) */}
                  {/* )} */}
                </tbody>
              </Table>
            </div>
            <Row>
              <div className="text-start">
                <Button variant="primary" onClick={() => setShowModal(true)}>
                  + Item
                </Button>
              </div>
              <Card.Body className="px-0 pt-3"></Card.Body>
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

      {showModal && (
        <AddItemModal
          show={showModal}
          handleClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default AddDealsQt;
