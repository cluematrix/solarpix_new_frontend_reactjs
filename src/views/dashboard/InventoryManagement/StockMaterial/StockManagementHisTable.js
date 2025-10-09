// Created by Sufyan | Stock Management History Page

import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Spinner,
  Row,
  Col,
  Pagination,
  Button,
  Form,
} from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../../api/axios";
import { errorToast } from "../../../../components/Toast/errorToast";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { generatePDF } from "../../../../utilities/generatePdf";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

const StockManagementHisTable = () => {
  const { id } = useParams(); // materialId from route
  const navigate = useNavigate();

  const [serials, setSerials] = useState([]);
  const [materialName, setMaterialName] = useState("");
  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Date filter state
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // ✅ Fetch stock history with optional date filter
  const fetchSerialNumbers = async (page = 1, reset = false) => {
    setLoading(true);
    try {
      let url = `/api/v1/admin/stockManagement/stockManagementByMaterialId/${id}/pagination?page=${page}&limit=${itemsPerPage}`;

      // 👇 only add dates if not reset and both are filled
      if (!reset) {
        if (startDate) url += `&startDate=${startDate}`;
        if (endDate) url += `&endDate=${endDate}`;
      }

      const res = await api.get(url);

      if (res.data) {
        setSerials(res.data.data || []);
        setTotalPages(res.data.pagination?.totalPages || 1);
        setMaterialName(res.data.data[0]?.material?.material || "");
      } else {
        setSerials([]);
      }
    } catch (err) {
      console.error("Error fetching serial numbers:", err);
      errorToast("Failed to fetch stock history");
      setSerials([]);
    } finally {
      setLoading(false);
    }
  };

  // First load
  useEffect(() => {
    fetchSerialNumbers(currentPage);
  }, [currentPage]);

  // ✅ Reset filter handler
  const handleReset = () => {
    setStartDate("");
    setEndDate("");
    setCurrentPage(1);
    fetchSerialNumbers(1, true);
  };

  // for pdf
  const handleDownloadPDF = () => {
    if (serials.length === 0) {
      errorToast("No data to download!");
      return;
    }

    const columns = [
      "Sr No",
      "Material",
      "Particular",
      "Supplier",
      "Credit",
      "Debit",
      "Balance",
      "Created At",
    ];

    const rows = serials.map((item, index) => [
      (currentPage - 1) * itemsPerPage + index + 1,
      item.material?.material || "--",
      item.particular?.particular || "--",
      item.supplier?.name || "--",
      item.Credit || "--",
      item.Debit || "--",
      item.balance || "--",
      new Date(item.created_at).toLocaleDateString("en-GB"),
    ]);

    const companyInfo = {
      name: "Tech ERP Pvt. Ltd.",
      address: "123 Industrial Area",
      city: "Nagpur",
      state: "Maharashtra",
      pincode: "440001",
      country: "India",
      mobile1: "9876543210",
      GSTno: "27ABCDE1234F1Z5",
      email: "info@techerp.com",
      logo: "data:image/png;base64,....", // <-- optional base64 logo
    };

    generatePDF({
      title: "Stock Management History",
      subtitle: `Material: ${materialName} | Date: ${startDate} to ${endDate}`,
      columns,
      rows,
      company: companyInfo,
      fileName: `Stock_History_${materialName}.pdf`,
    });
  };

  return (
    <div className="mt-4">
      <Row>
        <Col sm="12">
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="fw-light mb-0">
                History: <span>{materialName || ""}</span>
              </h5>
              <div>
                <Button
                  variant="primary"
                  onClick={() => navigate(`/serial-number-list/${id}`)}
                  style={{ marginRight: "5px" }}
                >
                  <VisibilityIcon fontSize="small" /> Serial Number
                </Button>
                <Button variant="secondary" onClick={() => navigate(-1)}>
                  ← Back
                </Button>
              </div>
            </Card.Header>

            <Card.Body>
              {/* Date filter section */}
              <Row className="mb-4">
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Start Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      size="small"
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>End Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      size="small"
                    />
                  </Form.Group>
                </Col>
                <Col
                  md={3}
                  className="d-flex align-items-end justify-content-start gap-2"
                >
                  <Button
                    variant="primary"
                    onClick={() => fetchSerialNumbers(1)}
                    size="small"
                  >
                    Filter
                  </Button>
                  <Button
                    variant="outline-secondary"
                    onClick={handleReset}
                    size="small"
                  >
                    Reset
                  </Button>
                  <Button
                    variant="outline-secondary"
                    onClick={handleDownloadPDF}
                    size="small"
                  >
                    <PictureAsPdfIcon color="text-danger" fontSize="small" />
                  </Button>
                </Col>
              </Row>

              {loading ? (
                <div className="d-flex justify-content-center py-5">
                  <Spinner animation="border" />
                </div>
              ) : serials.length === 0 ? (
                <p className="text-center mb-0">No history available.</p>
              ) : (
                <>
                  <div className="table-responsive">
                    <Table hover>
                      <thead>
                        <tr>
                          <th>Sr. No.</th>
                          <th>Material</th>
                          <th>Particular</th>
                          <th>Supplier</th>
                          <th>Credit</th>
                          <th>Debit</th>
                          <th>Balance</th>
                          <th>Created At</th>
                        </tr>
                      </thead>
                      <tbody>
                        {serials.map((item, index) => (
                          <tr key={item.id}>
                            <td>
                              {(currentPage - 1) * itemsPerPage + index + 1}
                            </td>
                            <td>{item.material?.material || "--"}</td>
                            <td>{item.particular?.particular || "--"}</td>
                            <td>{item.supplier?.name || "--"}</td>
                            <td>{item.Credit || "--"}</td>
                            <td>{item.Debit || "--"}</td>
                            <td>{item.balance || "--"}</td>
                            <td>
                              {new Date(item.created_at).toLocaleDateString(
                                "en-GB"
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <Pagination className="justify-content-center mt-3">
                      <Pagination.First
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                      />
                      {[...Array(totalPages)].map((_, i) => (
                        <Pagination.Item
                          key={i + 1}
                          active={i + 1 === currentPage}
                          onClick={() => setCurrentPage(i + 1)}
                        >
                          {i + 1}
                        </Pagination.Item>
                      ))}
                      <Pagination.Last
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={currentPage === totalPages}
                      />
                    </Pagination>
                  )}
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StockManagementHisTable;
