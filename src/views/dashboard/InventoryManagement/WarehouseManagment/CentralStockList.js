import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Table,
  Spinner,
  Pagination,
  Form,
} from "react-bootstrap";
import api from "../../../../api/axios";
import { useFormik } from "formik";
import CustomSelect from "../../../../components/Form/CustomSelect";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "@mui/material";

const initialValues = {
  clientId: "",
};

const CenterStockList = () => {
  const [transactions, setTransactions] = useState([]);
  const [client, setClient] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showAll, setShowAll] = useState(true); // Toggle state

  // for navigation
  const navigate = useNavigate();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const formik = useFormik({
    initialValues,
  });

  const { values, handleBlur, handleChange } = formik;

  // 🔹 Fetch all or client-specific transactions
  const fetchTransactions = async (page = 1) => {
    try {
      setLoading(true);

      let url = `/api/v1/admin/stockTransaction/branch/total-stock/pagination?page=${page}&limit=${itemsPerPage}`;

      const res = await api.get(url);
      setTransactions(res.data?.data || []);

      // Extract pagination info
      const pagination = res.data?.pagination;
      if (pagination) {
        setTotalPages(pagination.totalPages || 1);
      }
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Fetch active client
  const fetchClient = async () => {
    try {
      const res = await api.get(`/api/v1/admin/client/active`);
      setClient(res.data.data || []);
    } catch (err) {
      console.error("Error fetching client:", err);
      setClient([]);
    }
  };

  // 🔹 Load client on mount
  useEffect(() => {
    fetchClient();
  }, []);

  // 🔹 Load all transactions initially
  useEffect(() => {
    fetchTransactions(currentPage);
  }, [currentPage]);

  // When toggle or client changes → reload
  useEffect(() => {
    setCurrentPage(1);
    fetchTransactions(1);
  }, [showAll, values.clientId]);

  return (
    <Card className="p-3">
      {/* <Row className="mb-3 d-flex align-items-center justify-content-between">
        <Col md={4}>
          <Form.Check
            type="switch"
            id="toggle-all"
            label={showAll ? "Showing All Transactions" : "Filter by Client"}
            checked={showAll}
            onChange={(e) => setShowAll(e.target.checked)}
          />
        </Col>

        {!showAll && (
          <Col md={4}>
            <CustomSelect
              // label="Select Client"
              name="clientId"
              value={values.clientId}
              onChange={handleChange}
              onBlur={handleBlur}
              options={client}
              placeholder="-- Select Client --"
              lableName="name"
              lableKey="id"
            />
          </Col>
        )}
      </Row> */}

      <Row>
        <Col>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" />
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <Table hover responsive className="table">
                  <thead className="table-light">
                    <tr>
                      <th>Sr. No.</th>
                      <th>Category</th>
                      <th>Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.length > 0 ? (
                      transactions.map((t, index) => (
                        <tr key={t.id}>
                          <td>
                            {(currentPage - 1) * itemsPerPage + index + 1}
                          </td>
                          <td>{t.inventory_category || "—"}</td>
                          <td>{t?.total_balance}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="text-center">
                          No transactions found
                        </td>
                      </tr>
                    )}
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
        </Col>
      </Row>
    </Card>
  );
};

export default CenterStockList;
