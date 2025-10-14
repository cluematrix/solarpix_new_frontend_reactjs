import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Row,
  Col,
  Button,
  Table,
  Form,
  Modal,
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

const SalesOrderList = () => {
  const navigate = useNavigate();
  const [salesOrderList, setSalesOrderList] = useState([]);
  const [dealStages, setDealStages] = useState([]);
  const [leads, setLeads] = useState([]);
  const [clients, setClients] = useState([]);

  const [loading, setLoading] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [showViewModal, setShowViewModal] = useState(false);
  const [viewData, setViewData] = useState(null);

  const [showQuotationModal, setShowQuotationModal] = useState(false);
  const [quotationDeal, setQuotationDeal] = useState(null);

  const [showQuotationConfirm, setShowQuotationConfirm] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [pendingStageId, setPendingStageId] = useState(null);

  const [filter, setFilter] = useState(""); // all / final

  const getStageColor = (stageName) => {
    switch (stageName) {
      case "New":
        return "#e3f2fd";
      case "Qualified":
        return "#fff9c4";
      case "Proposal Sent":
        return "#ffe0b2";
      case "Negotiation":
        return "#d1c4e9";
      case "Won":
        return "#c8e6c9";
      case "Lost":
        return "#ffcdd2";
      default:
        return "#f0f0f0";
    }
  };

  // Fetch data from API whenever filter changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stagesRes, leadsRes, clientsRes] = await Promise.all([
          api.get("/api/v1/admin/dealStages/active"),
          api.get("/api/v1/admin/lead/active"),
          api.get("/api/v1/admin/client/active"),
        ]);

        setDealStages(stagesRes.data || []);
        setLeads(leadsRes.data?.data || leadsRes.data || []);
        setClients(clientsRes.data?.data || clientsRes.data || []);
        setCurrentPage(1); // reset page when filter changes
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [filter]);

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
  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/api/v1/admin/deal/${deleteId}`);
      setSalesOrderList((prev) => prev.filter((deal) => deal.id !== deleteId));
      setShowDeleteModal(false);
      setDeleteId(null);
    } catch (error) {
      console.error("Error deleting deal:", error.response || error);
    }
  };

  const fetchDeals = async () => {
    try {
      const res = await api.get("/api/v1/admin/deal");
      const salesOrder = res.data?.data || res.data || [];
      setSalesOrderList(salesOrder);
    } catch (err) {
      console.error("Error fetching salesOrder:", err);
    }
  };

  //  Loader while checking permissions
  if (loading) {
    return (
      <div className="loader-div">
        <Spinner animation="border" className="spinner" />
      </div>
    );
  }
  return (
    <>
      <Row className="mt-4">
        <Col sm="12">
          <Card>
            <Card.Header className="d-flex flex-wrap justify-content-between align-items-center gap-2">
              <h5 className="card-title fw-lighter mb-0">Sales Orders</h5>

              {/* Filter Dropdown */}
              <Form.Select
                size="sm"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-auto ms-auto"
              >
                <option value="all">All</option>
                <option value="final">Final</option>
                <option value="lost">Lost</option>
                <option value="proposal sent">Proposal sent</option>
              </Form.Select>

              {/* Add Deal Button */}
              <Button
                className="btn-primary w-auto"
                onClick={() => navigate("/add-sales-orders")}
              >
                + Generate Sales Orders
              </Button>
            </Card.Header>

            <Card.Body className="px-0 pt-3">
              <div className="table-responsive">
                <Table hover responsive className="table">
                  <thead>
                    <tr className="table-gray">
                      <th>Sr. No.</th>
                      <th>Customer Name</th>
                      <th>Sales Order</th>
                      {/* <th>Sales Order Date</th> */}
                      <th>Amount</th>
                      {/* <th>Status</th> */}
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
                      salesOrderList.map((deal, index) => (
                        <tr key={deal.id}>
                          <td>
                            {(currentPage - 1) * itemsPerPage + index + 1}
                          </td>
                          <td>{deal.lead?.name || "---"}</td>
                          <td>{deal?.sales_order_no || "---"}</td>
                          <td>₹{deal?.total || "---"}</td>
                          {/* <td>
                            {deal?.site_visit_date
                              ? new Date(
                                  deal.site_visit_date
                                ).toLocaleDateString("en-GB")
                              : "---"}
                          </td> */}

                          {/* <td>
                            <Form.Select
                              size="sm"
                              className="w-50"
                              value={deal.deal_stage_id || ""}
                              style={{
                                cursor: deal.is_disable
                                  ? "not-allowed"
                                  : "pointer",
                                cursor:
                                  deal.is_disable ||
                                  deal.deal_stage_id_name === "Won" ||
                                  deal.deal_stage_id_name === "Lost"
                                    ? "not-allowed"
                                    : "pointer",
                                backgroundColor: "transparent", // no background
                                color: "#000",
                              }}
                              disabled={
                                deal.is_disable ||
                                deal.deal_stage_id_name === "Won" ||
                                deal.deal_stage_id_name === "Lost"
                              }
                              onChange={async (e) => {
                                const newStageId = e.target.value;
                                if (!newStageId) return;

                                const stageName = dealStages.find(
                                  (s) => s.id == newStageId
                                )?.deal_stages;

                                if (stageName === "Won") {
                                  setSelectedDeal(deal);
                                  setPendingStageId(newStageId);
                                  setShowQuotationConfirm(true);
                                } else {
                                  try {
                                    await api.put(
                                      `/api/v1/admin/deal/${deal.id}`,
                                      {
                                        ...deal,
                                        deal_stage_id: newStageId,
                                      }
                                    );
                                    setSalesOrderList((prev) =>
                                      prev.map((d) =>
                                        d.id === deal.id
                                          ? { ...d, deal_stage_id: newStageId }
                                          : d
                                      )
                                    );
                                  } catch (err) {
                                    console.error("Error updating stage:", err);
                                  }
                                }
                              }}
                            >
                              <option value="">Select Stage</option>
                              {dealStages.map((stage) => {
                                const isDisabled =
                                  stage.id < deal.deal_stage_id &&
                                  !["Won", "Lost"].includes(
                                    deal.deal_stage_id_name
                                  );

                                // Map stage id to icon
                                const stageIcon = {
                                  1: "🟢", // Qualified
                                  2: "🟠", // Proposal Sent / Negotiation
                                  3: "🔵", // Negotiation - blue
                                  4: "🟢", // Won
                                  5: "🔴", // Lost
                                }[stage.id];

                                return (
                                  <option
                                    key={stage.id}
                                    value={stage.id}
                                    disabled={isDisabled}
                                    style={{
                                      cursor: isDisabled
                                        ? "not-allowed"
                                        : "pointer",
                                    }}
                                  >
                                    {stageIcon} {stage.deal_stages}
                                  </option>
                                );
                              })}
                            </Form.Select>
                          </td> */}

                          <td>
                            <VisibilityIcon
                              style={{ color: "#0d6efd", cursor: "pointer" }}
                              onClick={() => {
                                setQuotationDeal(deal);
                                setShowQuotationModal(true);
                              }}
                            />
                            <CreateTwoToneIcon
                              onClick={() => navigate(`/edit-sales/${deal.id}`)}
                              color="primary"
                              style={{ cursor: "pointer" }}
                            />
                            <DeleteRoundedIcon
                              onClick={() => {
                                setDeleteId(deal.id);
                                setShowDeleteModal(true);
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

      {/* Sales Orders Confirmation Modal */}
      <Modal
        show={showQuotationConfirm}
        onHide={() => setShowQuotationConfirm(false)}
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Sales Orders Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Do you want to send the current sales orders or update with a new
            one?
          </p>
        </Modal.Body>
        <Modal.Footer>
          {/* <Button
            variant="success"
            onClick={async () => {
              try {
                await api.put(`/api/v1/admin/deal/${selectedDeal.id}`, {
                  ...selectedDeal,
                  deal_stage_id: 4,
                  isFinal: 1,
                });
                await fetchDeals();
                setSalesOrderList((prev) =>
                  prev.map((d) =>
                    d.id === selectedDeal.id
                      ? { ...d, deal_stage_id: 4, isFinal: 1 }
                      : d
                  )
                );
                alert("Current sales orders sent successfully!");
              } catch (err) {
                console.error("Error sending sales orders:", err);
              } finally {
                setShowQuotationConfirm(false);
              }
            }}
          >
            Send Current
          </Button> */}
          <Button
            variant="success"
            onClick={async () => {
              try {
                await api.put(`/api/v1/admin/deal/${selectedDeal.id}`, {
                  ...selectedDeal,
                  deal_stage_id: 4,
                  isFinal: 1,
                });

                await fetchDeals();
                setSalesOrderList((prev) =>
                  prev.map((d) =>
                    d.id === selectedDeal.id
                      ? { ...d, deal_stage_id: 4, isFinal: 1 }
                      : d
                  )
                );

                // ✅ Redirect to addcustomer with deal data
                // navigate("/add-customer", { state: { deal: selectedDeal } });
                navigate("/add-customer", {
                  state: { leadData: selectedDeal.lead, deal: selectedDeal },
                });
              } catch (err) {
                console.error("Error sending sales orders:", err);
              } finally {
                setShowQuotationConfirm(false);
              }
            }}
          >
            Send Current
          </Button>

          <Button
            variant="primary"
            onClick={() => {
              setShowQuotationConfirm(false);
              navigate(`/UpdateQuotationNew/${selectedDeal.id}`);
            }}
          >
            Update New
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Modal */}
      <DeleteModal
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        onDelete={handleDeleteConfirm}
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
