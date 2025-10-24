import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Row,
  Col,
  Button,
  Table,
  Form,
  Pagination,
  Spinner,
} from "react-bootstrap";
import CreateTwoToneIcon from "@mui/icons-material/CreateTwoTone";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import VisibilityIcon from "@mui/icons-material/Visibility";

import DeleteModal from "./delete-modal";
import ViewModal from "./ViewModal";
import QuotationModal from "./QuotationModal";

import api from "../../../../api/axios";
import { successToast } from "../../../../components/Toast/successToast";
import { errorToast } from "../../../../components/Toast/errorToast";

const SalesOrderList = () => {
  const navigate = useNavigate();

  // store table data
  const [salesOrderList, setSalesOrderList] = useState([]);

  // for api call
  const [loading, setLoading] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // for delete
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [loadingBtn, setLoadingBtn] = useState(false);

  const [showViewModal, setShowViewModal] = useState(false);
  const [viewData, setViewData] = useState(null);

  const [showQuotationModal, setShowQuotationModal] = useState(false);
  const [quotationDeal, setQuotationDeal] = useState(null);

  const [filter, setFilter] = useState(""); // all / final

  // Fetch
  const fetchSalesOrder = async (page = 1) => {
    try {
      setLoading(true);
      const res = await api.get(
        `/api/v1/admin/salesOrder/pagination?page=${page}&limit=${itemsPerPage}`
      );

      const salesOrder = res.data.data;
      const filteredDeals = salesOrder.filter((deal) => {
        if (filter === "final") {
          return deal.isFinal === true && deal.deal_stage_id === 4;
        } else if (filter === "lost") {
          return deal.deal_stage_id === 5;
        } else if (filter === "proposal sent") {
          return deal.deal_stage_id === 2;
        }
        return true;
      });

      setSalesOrderList(filteredDeals);
      //  Extract pagination info properly
      const pagination = res.data?.pagination;

      if (pagination) {
        setTotalPages(pagination.totalPages || 1);
      }
    } catch (err) {
      console.error("Error fetching leads:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesOrder(currentPage);
  }, [currentPage]);

  const handleDeleteConfirm = () => {
    if (!deleteId) return;
    setLoadingBtn(true);
    api
      .delete(`/api/v1/admin/salesOrder/${deleteId}`)
      .then(() => {
        successToast("Order deleted successfully");
        fetchSalesOrder(currentPage);
        setShowDelete(false);
      })
      .catch((err) => {
        console.error("Error deleting order:", err);
        errorToast(err.response?.data?.message || "Failed to delete order");
      })
      .finally(() => {
        setLoadingBtn(false);
      });
  };

  //  Loader while checking permissions
  if (loading) {
    return (
      <div className="loader-div">
        <Spinner animation="border" className="spinner" />
      </div>
    );
  }

  console.log("salesOrderList", salesOrderList);
  return (
    <>
      <Row className="mt-4">
        <Col sm="12">
          <Card>
            <Card.Header className="d-flex flex-wrap justify-content-between align-items-center gap-2">
              <h5 className="card-title fw-lighter mb-0">Sales Orders</h5>

              {/* Add Deal Button */}
              <Button
                className="btn-primary w-auto"
                onClick={() => navigate("/add-sales-orders")}
              >
                + Generate
              </Button>
            </Card.Header>

            <Card.Body className="px-0 pt-3">
              <div className="table-responsive">
                <Table hover responsive className="table">
                  <thead>
                    <tr className="table-gray">
                      <th>Sr. No.</th>
                      <th>Customer Name</th>
                      <th>Sales Order#</th>
                      <th>Reference#</th>
                      <th>Amount</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salesOrderList.length === 0 ? (
                      <tr>
                        <td colSpan="11" className="text-center">
                          No Sales Order available
                        </td>
                      </tr>
                    ) : (
                      salesOrderList.map((so, index) => (
                        <tr key={so.id}>
                          <td>
                            {(currentPage - 1) * itemsPerPage + index + 1}
                          </td>
                          <td>
                            {so.lead?.salutation || "--"}{" "}
                            {so.lead?.name || "--"}
                          </td>
                          <td>{so?.sales_order_no || "--"}</td>
                          <td>{so?.reference || "--"}</td>
                          <td>₹{so?.total || "--"}</td>
                          <td>
                            <VisibilityIcon
                              style={{ color: "#0d6efd", cursor: "pointer" }}
                              onClick={() => {
                                setQuotationDeal(so);
                                setShowQuotationModal(true);
                              }}
                            />
                            <CreateTwoToneIcon
                              onClick={() => navigate(`/edit-sales/${so.id}`)}
                              color="primary"
                              style={{ cursor: "pointer" }}
                            />
                            <DeleteRoundedIcon
                              onClick={() => {
                                setDeleteIndex(index);
                                setDeleteId(so.id);
                                setShowDelete(true);
                              }}
                              color="error"
                              style={{ cursor: "pointer" }}
                            />
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </div>

              {/* Pagination Controls */}
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
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Delete Modal */}
      <DeleteModal
        show={showDelete}
        handleClose={() => {
          setShowDelete(false);
          setDeleteIndex(null);
          setDeleteId(null);
        }}
        onConfirm={handleDeleteConfirm}
        modalTitle="Delete Item"
        modalMessage={
          deleteIndex !== null && salesOrderList[deleteIndex]
            ? `Are you sure you want to delete the order" ${salesOrderList[deleteIndex].sales_order_no}"?`
            : ""
        }
        loading={loadingBtn}
      />

      {/* View Modal */}
      <ViewModal
        show={showViewModal}
        handleClose={() => setShowViewModal(false)}
        viewData={viewData}
      />

      {/* Sales Orders Modal */}
      <QuotationModal
        show={showQuotationModal}
        handleClose={() => setShowQuotationModal(false)}
        deal={quotationDeal}
      />
    </>
  );
};

export default SalesOrderList;
