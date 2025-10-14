import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Row, Col, Button, Table, Pagination } from "react-bootstrap";
import CreateTwoToneIcon from "@mui/icons-material/CreateTwoTone";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import VisibilityIcon from "@mui/icons-material/Visibility";

import DeleteModal from "./delete-modal";
import PurchaseOrderModal from "./QuotationModal";

import api from "../../../../api/axios";

const PurchaseOrderList = () => {
  const navigate = useNavigate();
  const [purchaseOrderList, setPurchaseOrderList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [showPurchaseOrderModal, setShowPurchaseOrderModal] = useState(false);
  const [selectedPurchaseOrder, setSelectedPurchaseOrder] = useState(null);

  // Fetch purchase orders
  const fetchPurchaseOrders = async (page = 1) => {
    try {
      setLoading(true);
      const res = await api.get(
        `/api/v1/admin/purchaseOrder/pagination?page=${page}&limit=${itemsPerPage}`
      );

      const purchaseOrders = res.data.data || [];
      setPurchaseOrderList(purchaseOrders);

      // Extract pagination info
      const pagination = res.data?.pagination;
      if (pagination) {
        setTotalPages(pagination.totalPages || 1);
      }
    } catch (err) {
      console.error("Error fetching purchase orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchaseOrders(currentPage);
  }, [currentPage]);

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/api/v1/admin/purchaseOrder/${deleteId}`);
      setShowDeleteModal(false);
      setDeleteId(null);
      fetchPurchaseOrders(currentPage); // Refresh list after delete
    } catch (error) {
      console.error("Error deleting purchase order:", error.response || error);
    }
  };

  return (
    <>
      <Row className="mt-4">
        <Col sm="12">
          <Card>
            <Card.Header className="d-flex flex-wrap justify-content-between align-items-center gap-2">
              <h5 className="card-title fw-lighter mb-0">Purchase Orders</h5>

              {/* Add Purchase Order Button */}
              <Button
                className="btn-primary w-auto"
                onClick={() => navigate("/add-purchase-orders")}
              >
                + Generate Purchase Order
              </Button>
            </Card.Header>

            <Card.Body className="px-0 pt-3">
              <div className="table-responsive">
                <Table hover responsive className="table">
                  <thead>
                    <tr className="table-gray">
                      <th>Sr. No.</th>
                      <th>Supplier Name</th>
                      <th>Purchase Order No.</th>
                      <th>Purchase Date</th>
                      <th>Amount</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="6" className="text-center">
                          Loading...
                        </td>
                      </tr>
                    ) : purchaseOrderList.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center">
                          No Purchase Orders available
                        </td>
                      </tr>
                    ) : (
                      purchaseOrderList.map((order, index) => (
                        <tr key={order.id}>
                          <td>
                            {(currentPage - 1) * itemsPerPage + index + 1}
                          </td>
                          <td>{order.supplierManagement?.name || "---"}</td>
                          <td>{order.purchase_order_no || "---"}</td>
                          <td>
                            {order.date
                              ? new Date(order.date).toLocaleDateString(
                                  "en-GB",
                                  {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                  }
                                )
                              : "---"}
                          </td>
                          <td>₹{order.total || "---"}</td>
                          <td>
                            <VisibilityIcon
                              style={{ color: "#0d6efd", cursor: "pointer" }}
                              onClick={() => {
                                setSelectedPurchaseOrder(order);
                                setShowPurchaseOrderModal(true);
                              }}
                            />
                            <CreateTwoToneIcon
                              onClick={() =>
                                navigate(`/edit-purchase/${order.id}`)
                              }
                              color="primary"
                              style={{ cursor: "pointer" }}
                            />
                            <DeleteRoundedIcon
                              onClick={() => {
                                setDeleteId(order.id);
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

      {/* Delete Modal */}
      <DeleteModal
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        onDelete={handleDeleteConfirm}
      />

      {/* Purchase Order Modal */}
      <PurchaseOrderModal
        show={showPurchaseOrderModal}
        handleClose={() => setShowPurchaseOrderModal(false)}
        deal={selectedPurchaseOrder}
      />
    </>
  );
};

export default PurchaseOrderList;
