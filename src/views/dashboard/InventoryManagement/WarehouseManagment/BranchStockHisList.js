import React, { useState, useEffect } from "react";
import { Card, Row, Col, Table, Spinner, Pagination } from "react-bootstrap";
import api from "../../../../api/axios";
import { useLocation } from "react-router-dom";

const BranchStockHisList = () => {
  const location = useLocation();
  const { branch_id } = location.state;
  const { stock_material_id } = location.state;
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

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

  // console section

  return (
    <Card className="p-3">
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
                      <th>Branch</th>
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
                          <td>{t.material?.material || "—"}</td>
                          <td>{t.balance_after || t.balance}</td>
                          <td>{t.Debit || "--"}</td>
                          <td>{t.Credit || "--"}</td>
                          <td>
                            {new Date(t.created_at).toLocaleDateString("en-IN")}
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
