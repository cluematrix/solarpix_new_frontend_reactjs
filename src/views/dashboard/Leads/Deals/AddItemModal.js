import React, { useEffect, useState } from "react";
import { Col, Modal, Pagination, Row, Spinner, Table } from "react-bootstrap";
import api from "../../../../api/axios";

const AddItemModal = ({ show, handleClose }) => {
  // loading for item category
  const [loading, setLoading] = useState(false);

  // item name - category
  const [itemCategory, setItemCategory] = useState([]);

  // Pagination state for item category - like battery
  const [currentPageCat, setCurrentPageCat] = useState(1);
  const [itemsPerPageCat] = useState(10);
  const [totalPagesCat, setTotalPagesCat] = useState(1);

  const fetchItemCategory = async (page = 1) => {
    try {
      setLoading(true);
      const res = await api.get(
        `/api/v1/admin/stockName/active/pagination?page=${page}&limit=${itemsPerPageCat}`
      );

      setItemCategory(res.data?.data || []);

      //  Extract pagination info properly
      const pagination = res.data?.pagination;

      if (pagination) {
        setTotalPagesCat(pagination.totalPages || 1);
      }
    } catch (err) {
      console.error("Error fetching leads:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItemCategory(currentPageCat);
  }, [currentPageCat]);

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      backdrop="static"
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>Add Item</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {loading ? (
          <div className="loader-div text-center py-4">
            <Spinner animation="border" className="spinner" />
          </div>
        ) : (
          <>
            <Row>
              <Col md={4}>
                <div className="table-responsive">
                  <Table hover responsive className="table">
                    <thead>
                      <tr className="table-gray">
                        <th>Sr.No</th>
                        <th>Item Category</th>
                      </tr>
                    </thead>
                    <tbody>
                      {itemCategory?.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="text-center">
                            No Item Available
                          </td>
                        </tr>
                      ) : (
                        itemCategory.map((item, idx) => (
                          <tr key={item.id || item._id}>
                            <td>
                              {(currentPageCat - 1) * itemsPerPageCat + idx + 1}
                            </td>
                            <td>{item.name}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </Table>
                </div>

                {totalPagesCat > 1 && (
                  <Pagination className="justify-content-center mt-3">
                    <Pagination.First
                      onClick={() => setCurrentPageCat(1)}
                      disabled={currentPageCat === 1}
                    />
                    {[...Array(totalPagesCat)].map((_, i) => (
                      <Pagination.Item
                        key={i + 1}
                        active={i + 1 === currentPageCat}
                        onClick={() => setCurrentPageCat(i + 1)}
                      >
                        {i + 1}
                      </Pagination.Item>
                    ))}
                    <Pagination.Last
                      onClick={() => setCurrentPageCat(totalPagesCat)}
                      disabled={currentPageCat === totalPagesCat}
                    />
                  </Pagination>
                )}
              </Col>
              <Col md={8}>item according to item category</Col>
            </Row>
          </>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default AddItemModal;
