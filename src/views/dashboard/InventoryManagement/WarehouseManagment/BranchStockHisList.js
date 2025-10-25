import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Table,
  Spinner,
  Pagination,
  Button,
} from "react-bootstrap";
import api from "../../../../api/axios";
import { useLocation, useNavigate } from "react-router-dom";
import { MdKeyboardBackspace } from "react-icons/md";

const BranchStockHisList = () => {
  const location = useLocation();
  const { branch_id } = location.state;
  const { stock_material_id } = location.state;
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch all or branch-specific transactions
  const fetchTransactionsById = async (page = 1) => {
    try {
      setLoading(true);
      let url = `/api/v1/admin/stockTransaction/${branch_id}/${stock_material_id}/pagination?page=${page}&limit=${itemsPerPage}`;

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

  // Load all transactions initially
  useEffect(() => {
    fetchTransactionsById(currentPage);
  }, [currentPage]);

  // Calculate available balance
  const availableBalance = transactions.reduce((acc, t) => {
    const credit = t.Credit || 0;
    const debit = t.Debit || 0;
    return acc + credit - debit;
  }, 0);

  // console section

  return (
    <Card className="p-3">
      <Row>
        <Col>
          {loading ? (
            <div className="loader-div">
              <Spinner animation="border" className="spinner" />
            </div>
          ) : (
            <>
              <div style={{ textAlign: "start", marginBottom: "10px" }}>
                <Button
                  style={{ padding: "2px 10px" }}
                  variant="primary"
                  onClick={() => navigate(-1)}
                >
                  <MdKeyboardBackspace fontSize="20px" />
                </Button>
              </div>
              {/* Show available balance */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Stock Transactions</h5>
                <h6 className="mb-0 text-primary">
                  Available Balance: <strong>{availableBalance}</strong>
                </h6>
              </div>

              <div className="table-responsive">
                <Table hover responsive className="table">
                  <thead className="table-light">
                    <tr>
                      <th>Sr. No.</th>
                      <th>Branch</th>
                      <th>Category</th>
                      <th>Material</th>
                      <th>Debit</th>
                      <th>Credit</th>
                      <th>Balance</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.length > 0 ? (
                      transactions.map((t, index) => (
                        <tr key={t.id}>
                          <td>
                            {(currentPage - 1) * itemsPerPage + index + 1}
                          </td>
                          <td>{t.branch?.branch_name || "—"}</td>
                          <td>
                            {t.material?.stockName?.InventoryCat?.category ||
                              "—"}
                          </td>
                          <td>{t.material?.material || "—"}</td>
                          <td>{t.Debit || 0}</td>
                          <td>{t.Credit || 0}</td>
                          <td>{t.balance_after || 0}</td>
                          <td>
                            {new Date(t.createdAt).toLocaleDateString("en-IN")}
                          </td>
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

export default BranchStockHisList;
