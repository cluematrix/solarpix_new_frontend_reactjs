import React, { useState, useEffect } from "react";
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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CreateTwoToneIcon from "@mui/icons-material/CreateTwoTone";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import AddEditModal from "./add-edit-modal";
import DeleteModal from "./delete-modal";
import api from "../../../../../api/axios";
import * as FaIcons from "react-icons/fa";

const AwardList = () => {
  const [awards, setAwards] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    icon: "",
    color: "#000000",
    description: "",
  });
  const [editId, setEditId] = useState(null);
  const [showAddEdit, setShowAddEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch Awards
  const fetchAwards = () => {
    api
      .get("/api/v1/admin/award")
      .then((res) => {
        const data = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.data)
          ? res.data.data
          : [];
        setAwards(data);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to fetch awards");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAwards();
  }, []);

  const handleAddOrUpdateAward = () => {
    if (!formData.title.trim()) {
      toast.warning("Award title is required");
      return;
    }

    if (editId) {
      api
        .put(`/api/v1/admin/award/${editId}`, formData)
        .then(() => {
          toast.success("Award updated successfully");
          fetchAwards();
          resetForm();
        })
        .catch(() => toast.error("Failed to update award"));
    } else {
      api
        .post("/api/v1/admin/award", formData)
        .then(() => {
          toast.success("Award added successfully");
          fetchAwards();
          resetForm();
        })
        .catch(() => toast.error("Failed to add award"));
    }
  };

  const handleEdit = (index) => {
    const award = awards[index];
    setFormData({
      title: award.title,
      icon: award.icon,
      color: award.color || "#000000",
      description: award.description || "",
    });
    setEditId(award.id || award._id);
    setShowAddEdit(true);
  };

  const handleDeleteConfirm = () => {
    if (!deleteId) return;
    api
      .delete(`/api/v1/admin/award/${deleteId}`)
      .then(() => {
        toast.success("Award deleted successfully");
        fetchAwards();
        setShowDelete(false);
      })
      .catch(() => toast.error("Failed to delete award"));
  };

  const resetForm = () => {
    setShowAddEdit(false);
    setFormData({ title: "", icon: "", color: "#000000", description: "" });
    setEditId(null);
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAwards = awards.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(awards.length / itemsPerPage);

  if (loading)
    return (
      <div className="loader-div">
        <Spinner animation="border" className="spinner" />
      </div>
    );

  return (
    <>
      <Row className="mt-4">
        <Col sm="12">
          <Card>
            <Card.Header
              className="d-flex justify-content-between"
              style={{ padding: "15px 15px 0px 15px" }}
            >
              <h5 className="card-title fw-lighter">Awards</h5>
              <Button
                className="btn-primary"
                onClick={() => setShowAddEdit(true)}
              >
                + New Award
              </Button>
            </Card.Header>
            <Card.Body className="px-0 pt-3">
              <div className="table-responsive">
                <Table hover responsive className="table">
                  <thead>
                    <tr className="table-gray">
                      <th>Sr. No.</th>
                      <th>Title</th>
                      <th>Icon</th>
                      {/* <th>Color</th> */}
                      <th>Description</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentAwards.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center">
                          No awards available
                        </td>
                      </tr>
                    ) : (
                      currentAwards.map((item, idx) => {
                        const IconComp = FaIcons[item.icon];
                        return (
                          <tr key={item.id || item._id}>
                            <td>{indexOfFirstItem + idx + 1}</td>
                            <td>{item.title}</td>
                            <td>{IconComp ? <IconComp size={24} /> : "-"}</td>
                            {/* <td>
                              <div
                                style={{
                                  width: "20px",
                                  height: "20px",
                                  backgroundColor: item.color || "#000",
                                  borderRadius: "50%",
                                }}
                              ></div>
                            </td> */}
                            <td>{item.description}</td>
                            <td className="d-flex align-items-center">
                              <CreateTwoToneIcon
                                className="me-2"
                                onClick={() =>
                                  handleEdit(indexOfFirstItem + idx)
                                }
                                color="primary"
                                style={{ cursor: "pointer" }}
                              />
                              <DeleteRoundedIcon
                                onClick={() => {
                                  setDeleteIndex(indexOfFirstItem + idx);
                                  setDeleteId(item.id || item._id);
                                  setShowDelete(true);
                                }}
                                color="error"
                                style={{ cursor: "pointer" }}
                              />
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-3">
                  <Pagination>
                    <Pagination.Prev
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                    />
                    {[...Array(totalPages)].map((_, idx) => (
                      <Pagination.Item
                        key={idx + 1}
                        active={idx + 1 === currentPage}
                        onClick={() => setCurrentPage(idx + 1)}
                      >
                        {idx + 1}
                      </Pagination.Item>
                    ))}
                    <Pagination.Next
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                    />
                  </Pagination>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Add/Edit Modal */}
      <AddEditModal
        show={showAddEdit}
        handleClose={resetForm}
        formData={formData}
        setFormData={setFormData}
        onSave={handleAddOrUpdateAward}
        modalTitle={editId ? "Update Award" : "Add Award"}
        buttonLabel={editId ? "Update" : "Submit"}
      />

      {/* Delete Modal */}
      <DeleteModal
        show={showDelete}
        handleClose={() => {
          setShowDelete(false);
          setDeleteIndex(null);
          setDeleteId(null);
        }}
        onConfirm={handleDeleteConfirm}
        modalTitle="Delete Award"
        modalMessage={
          deleteIndex !== null && awards[deleteIndex]
            ? `Are you sure you want to delete the award "${awards[deleteIndex].title}"?`
            : ""
        }
      />

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default AwardList;
