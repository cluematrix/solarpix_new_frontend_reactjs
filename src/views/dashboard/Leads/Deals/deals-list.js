import React, { useState } from "react";
import { Card, Row, Col, Button, Table } from "react-bootstrap";
import CreateTwoToneIcon from "@mui/icons-material/CreateTwoTone";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import AddEditModal from "./add-edit-modal";
import DeleteModal from "./delete-modal";

const DealList = () => {
  const [dealList, setDealList] = useState([
    {
      id: 1,
      dealName: "Project 123",
      client: "ABC Corp",
      amount: 5000,
      stage: "Proposal",
    },
    {
      id: 2,
      dealName: "Project 456",
      client: "XYZ Ltd",
      amount: 2000,
      stage: "Negotiation",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const handleSave = (formData) => {
    if (editData) {
      setDealList((prev) =>
        prev.map((deal) =>
          deal.id === editData.id ? { ...formData, id: editData.id } : deal
        )
      );
    } else {
      setDealList((prev) => [...prev, { ...formData, id: Date.now() }]);
    }
    setShowModal(false);
    setEditData(null);
  };

  const handleEdit = (deal) => {
    setEditData(deal);
    setShowModal(true);
  };

  const handleDeleteConfirm = () => {
    setDealList((prev) => prev.filter((deal) => deal.id !== deleteId));
    setShowDeleteModal(false);
  };

  return (
    <>
      <Row className="mt-4">
        <Col sm="12">
          <Card>
            <Card.Header className="d-flex justify-content-between">
              <h4 className="card-title fw-bold">Deals </h4>
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

            <Card.Body className="px-0">
              <div className="table-responsive">
                <Table bordered hover>
                  <thead>
                    <tr>
                      <th>Sr. No.</th>
                      <th>Deal Name</th>
                      <th>Client</th>
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
                          <td>{index + 1}</td> {/* Sr. No. */}
                          <td>{deal.dealName}</td>
                          <td>{deal.client}</td>
                          <td>${deal.amount}</td>
                          <td>{deal.stage}</td>
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
