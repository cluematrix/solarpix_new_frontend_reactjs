import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Image,
  Spinner,
} from "react-bootstrap";
import { useParams } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import api from "../../../../api/axios";
import { errorToast } from "../../../../components/Toast/errorToast";

const CustomerProfile = () => {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch Single Customer by ID
  const fetchCustomerById = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/v1/admin/client/${id}`);
      console.log("API Response:", res.data);

      if (res.data.success && res.data.data) {
        setCustomer(res.data.data);
      } else {
        errorToast("No customer data found");
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      errorToast("Failed to fetch customer data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchCustomerById();
    }
  }, [id]);

  // ✅ Render dynamic field (Text / Image / PDF)
  const renderDynamicFieldValue = (field) => {
    if (!field) return "--";

    switch (field.data_type) {
      case "text":
      case "number":
        return field.value || "--";

      case "image":
        return field.file_url ? (
          <a
            href={field.file_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary d-flex align-items-center"
          >
            <FaEye className="me-1" /> View Image
          </a>
        ) : (
          "--"
        );

      case "pdf":
        return field.file_url ? (
          <a
            href={field.file_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary d-flex align-items-center"
          >
            <FaEye className="me-1" /> View PDF
          </a>
        ) : (
          "--"
        );

      default:
        return "--";
    }
  };

  // ✅ Loading State
  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }

  // ✅ Empty Data State
  if (!customer) {
    return (
      <Container fluid className="p-0">
        <Row className="mt-4">
          <Col>
            <Card>
              <Card.Body>
                <h5>No Customer Data Available</h5>
                <p>Please check the customer ID or try again later.</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  // ✅ Render UI
  return (
    <Container fluid className="p-0">
      {/* --- Customer Header --- */}
      <Row className="mt-4">
        <Col md={12}>
          <Card className="mb-4">
            <Card.Body className="d-flex align-items-center flex-wrap">
              <Image
                src={customer.photo || "https://via.placeholder.com/80"}
                roundedCircle
                width={100}
                height={100}
                className="me-3"
              />
              <div>
                <h5 className="mb-1">
                  {customer.salutation ? `${customer.salutation} ` : ""}
                  {customer.name || "--"}
                </h5>
                <p className="mb-0 text-muted small">
                  {customer.category?.category || "Customer"}
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* --- Customer Info --- */}
      <Row className="mt-4">
        <Col lg={8}>
          <Card>
            <Card.Body>
              <h5>Customer Info</h5>
              <Table borderless className="mt-3">
                <tbody>
                  <tr>
                    <td>Customer ID</td>
                    <td>{customer.client_id || "--"}</td>
                  </tr>
                  <tr>
                    <td>Full Name</td>
                    <td>
                      {customer.salutation ? `${customer.salutation} ` : ""}
                      {customer.name || "--"}
                    </td>
                  </tr>
                  <tr>
                    <td>Email</td>
                    <td>{customer.email || "--"}</td>
                  </tr>
                  <tr>
                    <td>Contact</td>
                    <td>{customer.contact || "--"}</td>
                  </tr>
                  <tr>
                    <td>Gender</td>
                    <td>{customer.gender || "--"}</td>
                  </tr>
                  <tr>
                    <td>Billing Address</td>
                    <td>
                      {customer.billing_address
                        ? `${customer.billing_address}${
                            customer.billing_pincode
                              ? ` - ${customer.billing_pincode}`
                              : ""
                          }${
                            customer.billing_city
                              ? `, ${customer.billing_city}`
                              : ""
                          }${
                            customer.billing_state
                              ? `, ${customer.billing_state}`
                              : ""
                          }`
                        : "--"}
                    </td>
                  </tr>
                  <tr>
                    <td>Shipping Address</td>
                    <td>
                      {customer.shipping_address
                        ? `${customer.shipping_address}${
                            customer.shipping_pincode
                              ? ` - ${customer.shipping_pincode}`
                              : ""
                          }${
                            customer.shipping_city
                              ? `, ${customer.shipping_city}`
                              : ""
                          }${
                            customer.shipping_state
                              ? `, ${customer.shipping_state}`
                              : ""
                          }`
                        : "--"}
                    </td>
                  </tr>
                  <tr>
                    <td>Category</td>
                    <td>{customer.category?.category || "--"}</td>
                  </tr>
                  <tr>
                    <td>Description</td>
                    <td>{customer.description || "--"}</td>
                  </tr>
                  <tr>
                    <td>Status</td>
                    <td
                      className={
                        customer.isActive
                          ? "text-success fw-bold"
                          : "text-danger fw-bold"
                      }
                    >
                      {customer.isActive ? "Active" : "Inactive"}
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        {/* --- Dynamic Fields / Documents --- */}
        <Col lg={4}>
          <Card>
            <Card.Body>
              <h6 className="mb-3">Document Details</h6>
              <Table borderless className="align-middle">
                <tbody>
                  {customer.dynamic_fields &&
                  Object.keys(customer.dynamic_fields).length > 0 ? (
                    Object.keys(customer.dynamic_fields).map((key) => (
                      <tr key={key}>
                        <td className="ps-0 fw-semibold">
                          {customer.dynamic_fields[key].label}
                        </td>
                        <td className="ps-0">
                          {renderDynamicFieldValue(
                            customer.dynamic_fields[key]
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="ps-0">No documents available</td>
                      <td className="ps-0">--</td>
                    </tr>
                  )}

                  <tr>
                    <td className="ps-0 fw-semibold">KYC Status</td>
                    <td
                      className={`fw-bold ps-0 ${
                        customer.kyc_status === "Pending"
                          ? "text-warning"
                          : customer.kyc_status === "Approved"
                          ? "text-success"
                          : customer.kyc_status === "Rejected"
                          ? "text-danger"
                          : "text-muted"
                      }`}
                    >
                      {customer.kyc_status || "--"}
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CustomerProfile;
