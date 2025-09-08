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
import api from "../../../../api/axios";

const CustomerProfile = () => {
  const { id } = useParams(); // Get customer ID from URL
  const [customer, setCustomer] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchCustomerById = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/v1/admin/client/${id}`);
      setCustomer(res.data.data || {});
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchCustomerById();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <Container fluid className="p-0">
      <Row className="mt-4">
        {/* Left Section */}
        <Col md={12}>
          {/* Profile Card */}
          <Card className="mb-4">
            <Card.Body className="d-flex align-items-center flex-wrap">
              <Image
                src={customer?.photo || "https://via.placeholder.com/80"}
                roundedCircle
                width={150}
                height={150}
                className="me-3"
              />
              <div>
                <h5>{customer?.name || "--"}</h5>
                <p className="mb-1 small">
                  {customer?.client_category?.name || "Customer"}
                </p>
                <small className="text-muted">{customer?.email || "--"}</small>
              </div>
            </Card.Body>
          </Card>

          {/* About Section */}
          {/* <Card className="mb-4">
            <Card.Body>
              <h5>About</h5>
              <p>{customer?.about || "No description available"}</p>
            </Card.Body>
          </Card> */}

          {/* Profile Info Section */}
          <Card>
            <Card.Body>
              <h5>Customer Info</h5>
              <Table borderless className="mt-3">
                <tbody>
                  <tr>
                    <td>Customer ID</td>
                    <td>{customer?.client_id || "--"}</td>
                  </tr>
                  <tr>
                    <td>Full Name</td>
                    <td>{customer?.name || "--"}</td>
                  </tr>
                  <tr>
                    <td>Email</td>
                    <td>{customer?.email || "--"}</td>
                  </tr>
                  <tr>
                    <td>Contact</td>
                    <td>{customer?.contact || "--"}</td>
                  </tr>
                  <tr>
                    <td>Address</td>
                    <td>{customer?.address || "--"}</td>
                  </tr>
                  {/* <tr>
                    <td>GST No</td>
                    <td>{customer?.gst_no || "--"}</td>
                  </tr>
                  <tr>
                    <td>PAN No</td>
                    <td>{customer?.pan_no || "--"}</td>
                  </tr> */}
                  <tr>
                    <td>Status</td>
                    <td>{customer?.isActive ? "Active" : "Inactive"}</td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        {/* Right Section */}
        <Col md={4}>
          {/* Bank Details */}
          {/* <Card>
            <Card.Body>
              <h6>Bank Details</h6>
              <Table borderless className="mt-3">
                <tbody>
                  <tr>
                    <td className="ps-0">Bank Name</td>
                    <td className="ps-0">{customer?.bank_name || "--"}</td>
                  </tr>
                  <tr>
                    <td className="ps-0">Account No</td>
                    <td className="ps-0">{customer?.account_no || "--"}</td>
                  </tr>
                  <tr>
                    <td className="ps-0">IFSC Code</td>
                    <td className="ps-0">{customer?.ifsc_code || "--"}</td>
                  </tr>
                  <tr>
                    <td className="ps-0">Branch Name</td>
                    <td className="ps-0">{customer?.branch_name || "--"}</td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card> */}
        </Col>
      </Row>
    </Container>
  );
};

export default CustomerProfile;
