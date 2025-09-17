import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Row, Col, Button, Table, Form } from "react-bootstrap";
import CreateTwoToneIcon from "@mui/icons-material/CreateTwoTone";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

import AddEditModal from "./add-edit-modal";
import DeleteModal from "./delete-modal";
import ViewModal from "./ViewModal";
import QuotationModal from "./QuotationModal";

import api from "../../../../api/axios";

const DealList = () => {
  const navigate = useNavigate();
  const [dealList, setDealList] = useState([]);
  const [dealStages, setDealStages] = useState([]);
  const [leads, setLeads] = useState([]);
  const [clients, setClients] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [showViewModal, setShowViewModal] = useState(false);
  const [viewData, setViewData] = useState(null);

  const [showQuotationModal, setShowQuotationModal] = useState(false);
  const [quotationDeal, setQuotationDeal] = useState(null);

  // Stage color helper
  const getStageColor = (stageName) => {
    switch (stageName) {
      case "New":
        return "#e3f2fd"; // light blue
      case "In Progress":
        return "#fff3cd"; // light yellow
      case "Win":
        return "#d4edda"; // light green
      case "Lost":
        return "#f8d7da"; // light red
      default:
        return "#f0f0f0"; // default gray
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dealsRes, stagesRes, leadsRes, clientsRes] = await Promise.all([
          api.get("/api/v1/admin/deal"),
          api.get("/api/v1/admin/dealStages/active"),
          api.get("/api/v1/admin/lead/active"),
          api.get("/api/v1/admin/client/active"),
        ]);

        setDealList(dealsRes.data?.data || dealsRes.data || []);
        setDealStages(stagesRes.data || []);
        setLeads(leadsRes.data?.data || leadsRes.data || []);
        setClients(clientsRes.data?.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleSave = async (formData) => {
    try {
      if (editData) {
        await api.put(`/api/v1/admin/deal/${editData.id}`, formData);
      } else {
        await api.post("/api/v1/admin/deal", formData);
      }
      const dealsRes = await api.get("/api/v1/admin/deal");
      setDealList(dealsRes.data?.data || dealsRes.data || []);
      setShowModal(false);
      setEditData(null);
    } catch (error) {
      console.error("Error saving deal:", error);
    }
  };

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

  return (
    <>
      <Row className="mt-4">
        <Col sm="12">
          <Card>
            <Card.Header
              className="d-flex justify-content-between"
              style={{ padding: "15px 15px 0px 15px" }}
            >
              <h5 className="card-title fw-lighter">Deals</h5>
              <Button
                className="btn-primary"
                onClick={() => navigate("/AddDeals")}
              >
                + Add Deal
              </Button>
            </Card.Header>

            <Card.Body className="px-0 pt-3">
              <div className="table-responsive">
                <Table hover responsive className="table">
                  <thead>
                    <tr className="table-gray">
                      <th>Sr. No.</th>
                      <th>Deal Name</th>
                      <th>Lead Name</th>
                      <th>Site Visit Date</th>
                      {/* <th>Negotiable</th> */}
                      <th>Deal Stage</th>
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
                          <td>{index + 1}</td>
                          <td>{deal.deal_name}</td>
                          <td>{deal.lead?.name || "---"}</td>
                          <td>
                            {deal?.site_visit_date
                              ? new Date(
                                  deal.site_visit_date
                                ).toLocaleDateString("en-GB")
                              : "---"}
                          </td>{" "}
                          {/* <td>{deal.negotiable || "---"}</td> */}
                          <td>
                            <Form.Select
                              size="sm"
                              className="w-50"
                              value={deal.deal_stage_id || ""}
                              style={{
                                backgroundColor: getStageColor(
                                  dealStages.find(
                                    (s) => s.id == deal.deal_stage_id
                                  )?.deal_stages
                                ),
                              }}
                              onChange={async (e) => {
                                const newStageId = e.target.value;
                                try {
                                  await api.put(
                                    `/api/v1/admin/deal/${deal.id}`,
                                    {
                                      ...deal,
                                      deal_stage_id: newStageId,
                                    }
                                  );

                                  setDealList((prev) =>
                                    prev.map((d) =>
                                      d.id === deal.id
                                        ? {
                                            ...d,
                                            deal_stage_id: newStageId,
                                            dealStage: dealStages.find(
                                              (s) => s.id == newStageId
                                            ),
                                          }
                                        : d
                                    )
                                  );
                                } catch (err) {
                                  console.error("Error updating stage:", err);
                                }
                              }}
                            >
                              <option value="">Select Stage</option>
                              {dealStages.map((stage) => (
                                <option key={stage.id} value={stage.id}>
                                  {stage.deal_stages}
                                </option>
                              ))}
                            </Form.Select>
                          </td>
                          <td>
                            <VisibilityIcon
                              className="me-2"
                              onClick={() => {
                                setViewData(deal);
                                setShowViewModal(true);
                              }}
                              style={{ cursor: "pointer", color: "#0d6efd" }}
                            />
                            <CreateTwoToneIcon
                              className="me-2"
                              onClick={() => navigate(`/edit-deal/${deal.id}`)}
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
                            <PictureAsPdfIcon
                              style={{ color: "red", fontSize: "20px" }}
                              onClick={() => {
                                setQuotationDeal(deal);
                                setShowQuotationModal(true);
                              }}
                            />
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Add/Edit Modal */}
      <AddEditModal
        show={showModal}
        handleClose={() => {
          setShowModal(false);
          setEditData(null);
        }}
        onSave={handleSave}
        editData={editData}
        dealStages={dealStages}
        leads={leads}
        clients={clients}
      />

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
