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
import PaidIcon from "@mui/icons-material/Paid";
const initialValues = {
  branchId: "",
};

const BranchStockList = () => {
  const [transactions, setTransactions] = useState([]);
  const [branches, setBranches] = useState([]);
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

  // 🔹 Fetch all or branch-specific transactions
  const fetchTransactions = async (page = 1) => {
    try {
      setLoading(true);

      let url = `/api/v1/admin/stockTransaction/getAllBranchStock/pagination?page=${page}&limit=${itemsPerPage}`;
      if (!showAll && values.branchId) {
        url = `/api/v1/admin/stockTransaction/${values.branchId}/pagination?page=${page}&limit=${itemsPerPage}`;
      }

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

  // 🔹 Fetch active branches
  const fetchBranches = async () => {
    try {
      const res = await api.get(`/api/v1/admin/branch/active`);
      setBranches(res.data.data || []);
    } catch (err) {
      console.error("Error fetching branches:", err);
      setBranches([]);
    }
  };

  // 🔹 Load branches on mount
  useEffect(() => {
    fetchBranches();
  }, []);

  // 🔹 Load all transactions initially
  useEffect(() => {
    fetchTransactions(currentPage);
  }, [currentPage]);

  // When toggle or branch changes → reload
  useEffect(() => {
    setCurrentPage(1);
    fetchTransactions(1);
  }, [showAll, values.branchId]);

  return (
    <Card className="p-3">
      <Row className="mb-3 d-flex align-items-center justify-content-between">
        <Col md={4}>
          <Form.Check
            type="switch"
            id="toggle-all"
            label={showAll ? "Showing All Transactions" : "Filter by Branch"}
            checked={showAll}
            onChange={(e) => setShowAll(e.target.checked)}
          />
        </Col>

        {!showAll && (
          <Col md={4}>
            <CustomSelect
              // label="Select Branch"
              name="branchId"
              value={values.branchId}
              onChange={handleChange}
              onBlur={handleBlur}
              options={branches}
              placeholder="-- Select Branch --"
              lableName="branch_name"
              lableKey="id"
            />
          </Col>
        )}
      </Row>

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
                      <th>Category</th>
                      <th>Material</th>
                      <th>Balance</th>
                      <th>Date</th>
                      <th>Action</th>
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
                          <td>{t.balance_after || t.balance}</td>
                          <td>
                            {new Date(t.createdAt).toLocaleDateString("en-IN")}
                          </td>
                          <td>
                            {" "}
                            <Tooltip title="History" arrow>
                              <PaidIcon
                                variant="outline-secondary"
                                size="sm"
                                style={{
                                  cursor: "pointer",
                                  marginRight: "5px",
                                }}
                                onClick={() =>
                                  navigate(
                                    `/branch-stock-list-history/${t.id}`,
                                    {
                                      state: {
                                        branch_id: t.branch_id,
                                        stock_material_id: t.stock_material_id,
                                      },
                                    }
                                  )
                                }
                              />
                            </Tooltip>
                            <Tooltip title="Sr No" arrow>
                              <FormatListNumberedIcon
                                variant="outline-secondary"
                                size="sm"
                                style={{ cursor: "pointer" }}
                                onClick={() =>
                                  navigate(`/branch-stock-srno-list/${t.id}`, {
                                    state: {
                                      branch_id: t.branch_id,
                                      stock_material_id: t.stock_material_id,
                                    },
                                  })
                                }
                              />
                            </Tooltip>
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

export default BranchStockList;
