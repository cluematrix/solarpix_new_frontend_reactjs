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
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import VisibilityIcon from "@mui/icons-material/Visibility";

import DeleteModal from "./delete-modal";
import ViewModal from "./ViewModal";
import QuotationModal from "./NewQuatationModal";

import api from "../../../../api/axios";

const DealList = () => {
  const navigate = useNavigate();
  const [dealList, setDealList] = useState([]);
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
  const [showNegModal, setShowNegModal] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [pendingStageId, setPendingStageId] = useState(null);

  const [filter, setFilter] = useState("all"); // Default to "all"

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
  const fetchDealPag = async (page = 1) => {
    try {
      setLoading(true);
      const res = await api.get(
        `/api/v1/admin/deal/pagination?page=${page}&limit=${itemsPerPage}`
      );

      const deals = res.data.data;
      const filteredDeals = deals.filter((deal) => {
        const stage = deal.dealStage?.deal_stages || "";
        switch (filter) {
          case "Qualified":
            return deal.deal_stage_id === 1;
          case "Proposal Sent":
            return deal.deal_stage_id === 2;
          case "Negotiation":
            return deal.deal_stage_id === 3;
          case "Won":
            return deal.deal_stage_id === 4 && deal.isFinal === true;
          case "Lost":
            return deal.deal_stage_id === 5;
          case "all":
          default:
            return true;
        }
      });

      setDealList(filteredDeals);
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
    fetchDealPag(currentPage);
  }, [currentPage, filter]);

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/api/v1/admin/deal/${deleteId}`);
      setDealList((prev) => prev.filter((deal) => deal.id !== deleteId));
      setShowDeleteModal(false);
      setDeleteId(null);
    } catch (error) {
      console.error("Error deleting deal:", error.response || error);
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

  console.log("selectedDeal", selectedDeal);
  console.log("dealList", dealList);
  return (
    <>
      <Row className="mt-4">
        <Col sm="12">
          <Card>
            <Card.Header className="d-flex flex-wrap justify-content-between align-items-center gap-2">
              <h5 className="card-title fw-lighter mb-0">Quotation</h5>

              {/* Filter Dropdown */}
              <Form.Select
                size="sm"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-auto ms-auto"
              >
                <option value="all">All</option>
                <option value="Qualified">Qualified</option>
                <option value="Proposal Sent">Proposal Sent</option>
                <option value="Negotiation">Negotiation</option>
                <option value="Won">Won</option>
                <option value="Lost">Lost</option>
              </Form.Select>

              {/* Add Deal Button */}
              <Button
                className="btn-primary w-auto"
                onClick={() => navigate("/AddDeals")}
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
                      <th>Lead Name</th>
                      <th>Assign To </th>
                      <th>Final Amount </th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dealList.length === 0 ? (
                      <tr>
                        <td colSpan="11" className="text-center">
                          No deals available
                        </td>
                      </tr>
                    ) : (
                      dealList.map((deal, index) => (
                        <tr key={deal.id}>
                          <td>
                            {(currentPage - 1) * itemsPerPage + index + 1}
                          </td>
                          <td>
                            {deal.lead?.salutation || "---"}{" "}
                            {deal.lead?.name || "---"}
                          </td>
                          <td>{deal.senderBy?.name || "---"}</td>

                          <td>{deal?.total || "---"}</td>

                          <td style={{ width: "195px" }}>
                            <Form.Select
                              size="sm"
                              value={deal.deal_stage_id || ""}
                              style={{
                                cursor:
                                  deal.is_disable ||
                                  ["Won", "Lost"].includes(
                                    deal.dealStage?.deal_stages
                                  )
                                    ? "not-allowed"
                                    : "pointer",
                                backgroundColor: "transparent",
                                color: "#000",
                              }}
                              disabled={
                                deal.is_disable ||
                                ["Won", "Lost"].includes(
                                  deal.dealStage?.deal_stages
                                )
                              }
                              onChange={async (e) => {
                                const newStageId = e.target.value;
                                if (!newStageId) return;

                                const stageName = dealStages.find(
                                  (s) => s.id == newStageId
                                )?.deal_stages;

                                if (stageName === "Negotiation") {
                                  setSelectedDeal(deal);
                                  setPendingStageId(newStageId);
                                  setShowNegModal(true);
                                }
                                if (stageName === "Won") {
                                  setSelectedDeal(deal);
                                  setPendingStageId(newStageId);
                                  setShowQuotationConfirm(true);
                                }
                              }}
                            >
                              <option value="">Select Stage</option>

                              {dealStages.map((stage) => {
                                const isDisabled =
                                  stage.id < deal.deal_stage_id &&
                                  !["Won", "Lost"].includes(
                                    deal.dealStage?.deal_stages
                                  );

                                const stageIcons = {
                                  1: "🟢", // Qualified
                                  2: "🟠", // Proposal Sent
                                  3: "🔵", // Negotiation
                                  4: "🟢", // Won
                                  5: "🔴", // Lost
                                };

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
                                    {stageIcons[stage.id] || "⚪"}{" "}
                                    {stage.deal_stages}
                                  </option>
                                );
                              })}
                            </Form.Select>
                          </td>

                          <td>
                            <VisibilityIcon
                              style={{ color: "#0d6efd", cursor: "pointer" }}
                              onClick={() => {
                                setQuotationDeal(deal);
                                setShowQuotationModal(true);
                              }}
                            />
                            <DeleteRoundedIcon
                              color="error"
                              style={{
                                cursor: deal.is_disable
                                  ? "not-allowed"
                                  : "pointer",
                                opacity: deal.is_disable ? 0.5 : 1,
                              }}
                              onClick={() => {
                                if (!deal.is_disable) {
                                  setDeleteId(deal.id);
                                  setShowDeleteModal(true);
                                }
                              }}
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

      {/* For Negotiation Quotation Confirmation Modal */}
      <Modal
        show={showNegModal}
        onHide={() => setShowNegModal(false)}
        centered
        backdrop="static"
        size="md"
      >
        <Modal.Header closeButton>
          <Modal.Title>Quotation Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Do you want to update this quotation with new changes?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="success"
            onClick={() => {
              navigate(`/UpdateQuotationNew/${selectedDeal.id}`, {
                state: {
                  isCustomerNeg: true,
                  isCustomer: false,
                  asPerSalesOrder: selectedDeal?.total,
                },
              });
            }}
          >
            Yes
          </Button>

          <Button
            variant="danger"
            onClick={() => {
              setShowNegModal(false);
            }}
          >
            No
          </Button>
        </Modal.Footer>
      </Modal>

      {/* for won Quotation Confirmation Modal */}
      <Modal
        show={showQuotationConfirm}
        onHide={() => setShowQuotationConfirm(false)}
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Quotation Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Use the current quotation or update it before closing the deal?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="success"
            onClick={() => {
              navigate("/add-customer", {
                state: {
                  leadId: selectedDeal.lead.id,
                  asPerSalesOrder: selectedDeal?.total,
                },
              });
            }}
          >
            Use Current
          </Button>

          <Button
            variant="primary"
            onClick={() => {
              setShowQuotationConfirm(false);
              navigate(`/UpdateQuotationNew/${selectedDeal.id}`, {
                state: {
                  isCustomer: true,
                  isCustomerNeg: false,
                  leadId: selectedDeal.lead.id,
                },
              });
            }}
          >
            Final Quotation
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

      {/* Quotation Modal */}
      <QuotationModal
        show={showQuotationModal}
        handleClose={() => setShowQuotationModal(false)}
        deal={quotationDeal}
      />
    </>
  );
};

export default DealList;
