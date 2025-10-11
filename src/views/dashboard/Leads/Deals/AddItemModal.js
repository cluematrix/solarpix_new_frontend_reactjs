import React, { useEffect, useState } from "react";
import { Col, Modal, Pagination, Row, Spinner, Table } from "react-bootstrap";
import api from "../../../../api/axios";

const AddItemModal = ({ show, handleClose }) => {
  // loading for item category
  const [loadingCat, setLoadingCat] = useState(false);

  // item name - category
  const [intCategory, setIntCategory] = useState([]);

  const fetchIntCategory = async () => {
    try {
      setLoadingCat(true);
      const res = await api.get("/api/v1/admin/inventoryCategory/active");

      setIntCategory(res.data || []);
    } catch (err) {
      console.error("Error fetching leads:", err);
    } finally {
      setLoadingCat(false);
    }
  };

  useEffect(() => {
    fetchIntCategory();
  }, []);

  console.log("intCategory", intCategory);

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
        {loadingCat ? (
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
                      {intCategory?.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="text-center">
                            No Item Category Available
                          </td>
                        </tr>
                      ) : (
                        intCategory.map((item, idx) => (
                          <tr key={item.id || item._id}>
                            <td>{idx + 1}</td>
                            <td>{item.category}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </Table>
                </div>
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
