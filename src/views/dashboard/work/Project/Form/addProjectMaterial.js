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
import api from "../../../../../api/axios";
import CustomSelect from "../../../../../components/Form/CustomSelect";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import { Tooltip } from "@mui/material";
import SrNoModal from "./SrNoModal"; // new modal component

const AddProjectMaterial = ({ formik, metaData, formData }) => {
  const [transactions, setTransactions] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAll, setShowAll] = useState(true);

  const [showSrNoModal, setShowSrNoModal] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);

  // store srno selection per (branch + stock_material)
  const [selectedSrNosMap, setSelectedSrNosMap] = useState({});

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // 🔹 Fetch all or branch-specific transactions
  const fetchTransactions = async (page = 1) => {
    try {
      setLoading(true);
      let url = `/api/v1/admin/stockTransaction/getAllBranchStock/pagination?page=${page}&limit=${itemsPerPage}`;
      if (!showAll && formik.values.branchId) {
        url = `/api/v1/admin/stockTransaction/${formik.values.branchId}/pagination?page=${page}&limit=${itemsPerPage}`;
      }
      const res = await api.get(url);
      setTransactions(res.data?.data || []);

      const pagination = res.data?.pagination;
      if (pagination) setTotalPages(pagination.totalPages || 1);
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

  useEffect(() => {
    fetchBranches();
  }, []);

  useEffect(() => {
    fetchTransactions(currentPage);
  }, [currentPage]);

  useEffect(() => {
    setCurrentPage(1);
    fetchTransactions(1);
  }, [showAll, formik.values.branchId]);

  // 🔹 handle modal open
  const handleOpenSrNoModal = (transaction) => {
    setSelectedStock(transaction);
    setShowSrNoModal(true);
  };

  // 🔹 handle modal close
  const handleCloseSrNoModal = () => {
    setShowSrNoModal(false);
  };

  // 🔹 Update selected srnos in parent
  const handleSrNoSelectionChange = (key, selectedSrNos) => {
    setSelectedSrNosMap((prev) => ({
      ...prev,
      [key]: selectedSrNos,
    }));
  };

  const getKey = (branch_id, stock_material_id) =>
    `${branch_id}-${stock_material_id}`;

  console.log("selectedSrNosMap", selectedSrNosMap);
  console.log("item_details", formik.values.item_details);
  console.log("formData", formData);

  return (
    <Card className="p-3">
      {formData?.id && (
        <Row
          className=" mb-3 ps-1 text-dark"
          style={{ backgroundColor: "#f3d90657" }}
        >
          You can’t edit material information here!
        </Row>
      )}
      <Row className="mb-3 d-flex align-items-center justify-content-between">
        <Col md={4}>
          <Form.Check
            type="switch"
            id="toggle-all"
            label={showAll ? "Showing All Stock" : "Filter by Warehouse"}
            checked={showAll}
            onChange={(e) => setShowAll(e.target.checked)}
          />
        </Col>

        {!showAll && (
          <Col md={4}>
            <CustomSelect
              name="branchId"
              value={formik.values.branchId}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              options={branches}
              placeholder="--"
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
                      <th>Warehouse</th>
                      <th>Material</th>
                      <th>Balance</th>
                      <th>Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.length > 0 ? (
                      transactions.map((t, index) => {
                        const key = getKey(t.branch_id, t.stock_material_id);
                        const hasSelected = selectedSrNosMap[key]?.length > 0;

                        return (
                          <tr key={t.id}>
                            <td>
                              {(currentPage - 1) * itemsPerPage + index + 1}
                            </td>
                            <td>{t.branch?.branch_name || "—"}</td>
                            <td>{t.material?.material || "—"}</td>
                            <td>{t.balance_after || t.balance}</td>
                            <td>
                              {new Date(t.createdAt).toLocaleDateString(
                                "en-IN"
                              )}
                            </td>
                            <td>
                              <Tooltip
                                title={
                                  hasSelected
                                    ? "View Selected SrNos"
                                    : "Select SrNos"
                                }
                                arrow
                              >
                                <FormatListNumberedIcon
                                  color={hasSelected ? "primary" : "inherit"}
                                  style={{
                                    cursor: formData?.id
                                      ? "not-allowed"
                                      : "pointer",
                                  }}
                                  onClick={() =>
                                    formData?.id ? null : handleOpenSrNoModal(t)
                                  }
                                />
                              </Tooltip>
                            </td>
                          </tr>
                        );
                      })
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

      {/* Modal for SrNo List */}
      {selectedStock && (
        <SrNoModal
          show={showSrNoModal}
          handleClose={handleCloseSrNoModal}
          branch_id={selectedStock.branch_id}
          stock_material_id={selectedStock.stock_material_id}
          selectedSrNos={
            selectedSrNosMap[
              getKey(selectedStock.branch_id, selectedStock.stock_material_id)
            ] || []
          }
          onSelectionChange={(selected) =>
            handleSrNoSelectionChange(
              getKey(selectedStock.branch_id, selectedStock.stock_material_id),
              selected
            )
          }
          formik={formik}
        />
      )}
    </Card>
  );
};

export default AddProjectMaterial;
