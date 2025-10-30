import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Table,
  Spinner,
  Pagination,
  Button,
  Modal,
} from "react-bootstrap";
import api from "../../../../api/axios";
import { useNavigate, useParams } from "react-router-dom";
import { MdKeyboardBackspace } from "react-icons/md";
import pdfMake from "pdfmake/build/pdfmake";

const CustomerStockHisList = () => {
  const { id } = useParams();

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleClose = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  const handleView = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  console.log("idCus", id);

  // Fetch supplier transactions
  const fetchTransactionsById = async (page = 1) => {
    try {
      setLoading(true);
      const url = `/api/v1/admin/purchaseOrder/client/${id}/pagination?page=${page}&limit=${itemsPerPage}`;
      const res = await api.get(url);
      setTransactions(res?.data?.data || []);
      const pagination = res.data?.pagination;
      if (pagination) setTotalPages(pagination.totalPages || 1);
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactionsById(currentPage);
  }, [currentPage]);

  // Generate PDF using pdfmake
  const handleDownloadPDF = () => {
    if (!selectedOrder) return;

    const order = selectedOrder;
    const { supplierManagement, Client, item_details } = order;

    // Table rows
    const itemTableBody = [
      [
        { text: "Category", bold: true },
        { text: "Item", bold: true },
        { text: "Qty", bold: true },
        { text: "Price", bold: true },
        { text: "Total", bold: true },
        { text: "Serial Numbers", bold: true },
      ],
    ];

    item_details?.selectedCategories?.forEach((cat) => {
      cat.items.forEach((item) => {
        itemTableBody.push([
          cat.name,
          item.name,
          item.quantity.toString(),
          `₹${item.price}`,
          `₹${item.total}`,
          item.serialNumbers?.join(", ") || "—",
        ]);
      });
    });

    // Document definition
    const docDefinition = {
      pageSize: "A4",
      pageMargins: [40, 60, 40, 40],
      content: [
        { text: "Purchase Order Details", style: "header" },
        { text: `PO No: ${order.purchase_order_no}`, style: "subheader" },
        { text: "\n" },

        {
          columns: [
            [
              { text: "Supplier Details", bold: true },
              { text: supplierManagement?.name || "—" },
              { text: supplierManagement?.company_name || "" },
              {
                text:
                  supplierManagement?.billing_address +
                    ", " +
                    supplierManagement?.billing_city +
                    ", " +
                    supplierManagement?.billing_state || "",
              },
              { text: `Phone: ${supplierManagement?.billing_phone || "—"}` },
            ],
            [
              { text: "Customer Details", bold: true },
              { text: Client?.name || "—" },
              { text: Client?.email || "" },
              { text: `PO Date: ${new Date(order.date).toLocaleDateString()}` },
              {
                text: `Delivery Date: ${new Date(
                  order.delivery_date
                ).toLocaleDateString()}`,
              },
            ],
          ],
        },

        { text: "\n" },
        { text: "Item Details", style: "sectionHeader" },
        {
          table: {
            widths: ["*", "*", "auto", "auto", "auto", "*"],
            body: itemTableBody,
          },
          layout: "lightHorizontalLines",
        },
        { text: "\n" },

        {
          columns: [
            {},
            {
              width: "auto",
              table: {
                body: [
                  ["Sub Total", `₹${order.sub_total || "—"}`],
                  ["Adjustment", `₹${order.adjustment || 0}`],
                  [
                    "TDS",
                    `${order.TDS?.name || "—"} (${
                      order.TDS?.percentage || 0
                    }%)`,
                  ],
                  [
                    { text: "Total", bold: true },
                    { text: `₹${order.total || "—"}`, bold: true },
                  ],
                ],
              },
              layout: "lightHorizontalLines",
            },
          ],
        },

        { text: "\nNotes / Remarks:", bold: true },
        { text: order.notes_customer || "—" },
      ],

      styles: {
        header: {
          fontSize: 16,
          bold: true,
          alignment: "center",
          margin: [0, 0, 0, 10],
        },
        subheader: {
          fontSize: 12,
          italics: true,
          alignment: "center",
        },
        sectionHeader: {
          fontSize: 13,
          bold: true,
          margin: [0, 10, 0, 5],
        },
      },
    };

    pdfMake.createPdf(docDefinition).download(`${order.purchase_order_no}.pdf`);
  };

  return (
    <Card className="p-3">
      <Row>
        <Col>
          {loading ? (
            <div className="loader-div">
              <Spinner animation="border" className="spinner" />
            </div>
          ) : (
            <>
              {/* Back button */}
              <div style={{ textAlign: "start", marginBottom: "10px" }}>
                <Button
                  style={{ padding: "2px 10px" }}
                  variant="primary"
                  onClick={() => navigate(-1)}
                >
                  <MdKeyboardBackspace fontSize="20px" />
                </Button>
              </div>

              <h5 className="mb-3">Customer Stock History</h5>

              {/* Table */}
              <div className="table-responsive">
                <Table hover size="sm">
                  <thead className="table-light">
                    <tr>
                      <th>Sr. No.</th>
                      <th>PO No.</th>
                      <th>Supplier</th>
                      <th>Customer</th>
                      <th>Total</th>
                      <th>Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.length > 0 ? (
                      transactions.map((t, index) => (
                        <tr key={t.id}>
                          <td>
                            {(currentPage - 1) * itemsPerPage + index + 1}
                          </td>
                          <td>{t.purchase_order_no || "--"}</td>
                          <td>{t?.supplierManagement?.name || "--"}</td>
                          <td>{t?.Client?.name || "--"}</td>
                          <td>₹{t?.total || "--"}</td>
                          <td>
                            {new Date(t?.date).toLocaleDateString("en-IN")}
                          </td>
                          <td>
                            <Button
                              size="sm"
                              variant="info"
                              onClick={() => handleView(t)}
                            >
                              View
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center">
                          No transactions found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>

              {/* Pagination */}
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

              {/* View Modal */}
              <Modal show={showModal} onHide={handleClose} size="lg" centered>
                <Modal.Header closeButton>
                  <Modal.Title>
                    Purchase Order ({selectedOrder?.purchase_order_no})
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {selectedOrder && (
                    <>
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <p>
                            <strong>Supplier:</strong>{" "}
                            {selectedOrder?.supplierManagement?.name}
                          </p>
                          <p>
                            <strong>Customer:</strong>{" "}
                            {selectedOrder?.Client?.name}
                          </p>
                          <p>
                            <strong>Total:</strong> ₹{selectedOrder?.total}
                          </p>
                        </div>
                        <Button variant="success" onClick={handleDownloadPDF}>
                          Download PDF
                        </Button>
                      </div>

                      <hr />
                      <h6>Item Details</h6>
                      <Table bordered hover size="sm">
                        <thead className="table-light">
                          <tr>
                            <th>Category</th>
                            <th>Item</th>
                            <th>Qty</th>
                            <th>Price</th>
                            <th>Total</th>
                            <th>Serial Numbers</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedOrder?.item_details?.selectedCategories?.map(
                            (cat) =>
                              cat.items.map((item, idx) => (
                                <tr key={idx}>
                                  <td>{cat.name}</td>
                                  <td>{item.name}</td>
                                  <td>{item.quantity}</td>
                                  <td>₹{item.price}</td>
                                  <td>₹{item.total}</td>
                                  <td>
                                    {item.serialNumbers?.join(", ") || "—"}
                                  </td>
                                </tr>
                              ))
                          )}
                        </tbody>
                      </Table>
                    </>
                  )}
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleClose}>
                    Close
                  </Button>
                </Modal.Footer>
              </Modal>
            </>
          )}
        </Col>
      </Row>
    </Card>
  );
};

export default CustomerStockHisList;
