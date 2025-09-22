import React, { useState, useEffect } from "react";
import { Card, Row, Col, Button, Table, Spinner } from "react-bootstrap";
import AddEditModal from "./add-edit-modal";
import DeleteModal from "./delete-modal";
import api from "../../../../api/axios";
import CreateTwoToneIcon from "@mui/icons-material/CreateTwoTone";

const RateList = () => {
  const [appliances, setAppliances] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({ name: "", price: "" });
  const [editIndex, setEditIndex] = useState(null);
  const [showAddEdit, setShowAddEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  // 🔹 Fetch Appliances
  const fetchAppliances = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/v1/admin/rate");
      if (Array.isArray(res.data?.data)) {
        setAppliances(res.data.data);
      } else if (Array.isArray(res.data)) {
        setAppliances(res.data);
      } else {
        setAppliances([]);
      }
    } catch (err) {
      console.error("Error fetching appliances:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppliances();
  }, []);

  const resetForm = () => {
    setFormData({ name: "", price: "" });
    setEditIndex(null);
  };

  // 🔹 Add or Update Appliance
  const handleAddOrUpdate = async (data) => {
    try {
      if (editIndex !== null) {
        await api.put(`/api/v1/admin/rate/${appliances[editIndex].id}`, data);
      } else {
        await api.post("/api/v1/admin/rate", data);
      }
      fetchAppliances();
      setShowAddEdit(false);
      resetForm();
    } catch (err) {
      console.error("Error saving rate:", err);
    }
  };

  // 🔹 Edit
  const handleEdit = (index) => {
    setFormData({
      name: appliances[index].name,
      price: appliances[index].price,
    });
    setEditIndex(index);
    setShowAddEdit(true);
  };

  // 🔹 Delete
  const handleDeleteConfirm = async () => {
    if (deleteIndex !== null) {
      try {
        await api.delete(`/api/v1/admin/rate/${appliances[deleteIndex].id}`);
        fetchAppliances();
      } catch (err) {
        console.error("Error deleting rate:", err);
      }
    }
    setShowDelete(false);
    setDeleteIndex(null);
  };

  return (
    <>
      <Row className="mt-4">
        <Col sm="12">
          <Card>
            <Card.Header className="d-flex justify-content-between">
              <h5 className="card-title fw-lighter">
                Solar Panel Appliance Rates
              </h5>
              {/* <Button
                className="btn-primary"
                onClick={() => {
                  resetForm();
                  setShowAddEdit(true);
                }}
              >
                + Add Rate
              </Button> */}
            </Card.Header>

            <Card.Body className="px-0">
              {loading ? (
                <div className="text-center py-3">
                  <Spinner animation="border" />
                </div>
              ) : (
                <div className="table-responsive">
                  <Table hover responsive className="table">
                    <thead>
                      <tr className="table-gray">
                        <th>Sr. No.</th>
                        <th>Appliance Name</th>
                        <th>Price (₹)</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appliances.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="text-center">
                            No appliances available
                          </td>
                        </tr>
                      ) : (
                        appliances.map((item, idx) => (
                          <tr key={item.id}>
                            <td>{idx + 1}</td>
                            <td>{item.name}</td>
                            <td>{item.price} / kW</td>
                            <td>
                              <CreateTwoToneIcon
                                variant="primary"
                                size="sm"
                                className="me-2"
                                onClick={() => handleEdit(idx)}
                              />

                              {/* <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => {
                                  setDeleteIndex(idx);
                                  setShowDelete(true);
                                }}
                              >
                                Delete
                              </Button> */}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Add/Edit Modal */}
      <AddEditModal
        show={showAddEdit}
        handleClose={() => {
          setShowAddEdit(false);
          resetForm();
        }}
        formData={formData}
        setFormData={setFormData}
        onSave={handleAddOrUpdate}
        editData={editIndex !== null}
      />

      {/* Delete Modal */}
      <DeleteModal
        show={showDelete}
        handleClose={() => {
          setShowDelete(false);
          setDeleteIndex(null);
        }}
        onConfirm={handleDeleteConfirm}
        modalTitle="Delete Appliance"
        modalMessage={
          deleteIndex !== null
            ? `Are you sure you want to delete "${appliances[deleteIndex].name}"?`
            : ""
        }
      />
    </>
  );
};

export default RateList;
