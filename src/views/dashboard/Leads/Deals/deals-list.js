import React, { useState, useEffect } from "react";
import { Card, Row, Col, Button, Table } from "react-bootstrap";
import CreateTwoToneIcon from "@mui/icons-material/CreateTwoTone";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import AddEditModal from "./add-edit-modal";
import DeleteModal from "./delete-modal";
import api from "../../../../api/axios"; // axios instance

const DealList = () => {
  const [dealList, setDealList] = useState([]);

  const [dealStages, setDealStages] = useState([]);
  const [leads, setLeads] = useState([]);
  const [clients, setClients] = useState([]); // 👈 NEW state for clients

  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  // 🔹 fetch deals, stages, leads & clients
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dealsRes, stagesRes, leadsRes, clientsRes] = await Promise.all([
          api.get("/api/v1/admin/deal"),
          api.get("/api/v1/admin/dealStages/active"),
          api.get("/api/v1/admin/lead/active"),
          api.get("/api/v1/admin/client/active"), // 👈 fetch clients
        ]);
        setDealList(dealsRes.data || []);
        setDealStages(stagesRes.data || []);
        setLeads(leadsRes.data || []);
        setClients(clientsRes.data?.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // 🔹 save (add or update)
  const handleSave = async (formData) => {
    try {
      if (editData) {
        await api.put(`/api/v1/admin/deal/${editData.id}`, formData);
      } else {
        await api.post("/api/v1/admin/deal", formData);
      }

      // 🔹 Refetch fresh list after save
      const dealsRes = await api.get("/api/v1/admin/deal");
      setDealList(dealsRes.data || []);

      setShowModal(false);
      setEditData(null);
    } catch (error) {
      console.error("Error saving deal:", error);
    }
  };

  // 🔹 delete deal
  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/api/v1/admin/deal/${deleteId}`);
      setDealList((prev) => prev.filter((deal) => deal.id !== deleteId));
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting deal:", error);
    }
  };

  const handleEdit = (deal) => {
    setEditData(deal);
    setShowModal(true);
  };

  console.log("list", dealList);

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
                onClick={() => {
                  setEditData(null);
                  setShowModal(true);
                }}
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
                      <th>Customer</th>
                      <th>Amount</th>
                      <th>Stage</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dealList.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center">
                          No deals available
                        </td>
                      </tr>
                    ) : (
                      dealList.map((deal, index) => (
                        <tr key={deal.id}>
                          <td>{index + 1}</td>
                          <td>{deal.deal_name}</td>
                          <td>{deal.client?.name || "---"}</td>{" "}
                          {/* 👈 client name */}
                          <td>₹{deal.deal_value}</td>
                          <td>{deal.dealStage?.deal_stages || "---"}</td>
                          <td>
                            <CreateTwoToneIcon
                              className="me-2"
                              onClick={() => handleEdit(deal)}
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
        clients={clients} // 👈 pass clients to modal
      />

      {/* Delete Modal */}
      <DeleteModal
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        onDelete={handleDeleteConfirm}
      />
    </>
  );
};

export default DealList;
