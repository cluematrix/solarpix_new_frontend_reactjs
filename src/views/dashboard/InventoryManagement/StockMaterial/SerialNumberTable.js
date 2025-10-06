// Created by sufyan | Serial Number List Page

import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Spinner,
  Row,
  Col,
  Pagination,
  Button,
} from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../../api/axios";
import { errorToast } from "../../../../components/Toast/errorToast";

const SerialNumberTable = () => {
  const { id } = useParams(); // materialId from route
  const navigate = useNavigate();

  const [serials, setSerials] = useState([]);
  const [materialName, setMaterialName] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchSerialNumbers = async (materialId, pageNo = 1) => {
    setLoading(true);
    try {
      const res = await api.get(
        `/api/v1/admin/stockMaterialSerialNumber/${materialId}/pagination?page=${pageNo}&limit=10`
      );

      if (res.data?.data) {
        setSerials(res.data.data);
        setTotalPages(res.data.pagination?.totalPages || 1);
        setMaterialName(res.data.data[0]?.material?.material || "");
      } else {
        setSerials([]);
      }
    } catch (err) {
      console.error("Error fetching serial numbers:", err);
      errorToast("Failed to fetch serial numbers");
      setSerials([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchSerialNumbers(id, page);
  }, [id, page]);

  return (
    <div className="mt-4">
      <Row>
        <Col sm="12">
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="fw-light mb-0">
                Serial Numbers for{" "}
                <span className="text-primary">{materialName || "..."}</span>
              </h5>
              <Button variant="primary" onClick={() => navigate(-1)}>
                ← Back
              </Button>
            </Card.Header>

            <Card.Body>
              {loading ? (
                <div className="d-flex justify-content-center py-5">
                  <Spinner animation="border" />
                </div>
              ) : serials.length === 0 ? (
                <p className="text-center mb-0">No Serial Numbers Found.</p>
              ) : (
                <>
                  <div className="table-responsive">
                    <Table hover bordered>
                      <thead className="">
                        <tr>
                          <th>Sr. No.</th>
                          <th>Serial Number</th>
                          <th>Status</th>
                          <th>Created At</th>
                        </tr>
                      </thead>
                      <tbody>
                        {serials.map((item, index) => (
                          <tr key={item.id}>
                            <td>{(page - 1) * 10 + index + 1}</td>
                            <td>{item.serialNumber}</td>
                            <td>
                              <span
                                className={`badge ${
                                  item.isActive ? "bg-success" : "bg-danger"
                                }`}
                              >
                                {item.isActive ? "Active" : "Inactive"}
                              </span>
                            </td>
                            <td>
                              {new Date(item.created_at).toLocaleDateString(
                                "en-GB"
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <Pagination className="justify-content-center mt-3">
                      <Pagination.First
                        onClick={() => setPage(1)}
                        disabled={page === 1}
                      />
                      <Pagination.Prev
                        onClick={() => setPage((p) => Math.max(p - 1, 1))}
                        disabled={page === 1}
                      />
                      {[...Array(totalPages)].map((_, i) => (
                        <Pagination.Item
                          key={i + 1}
                          active={page === i + 1}
                          onClick={() => setPage(i + 1)}
                        >
                          {i + 1}
                        </Pagination.Item>
                      ))}
                      <Pagination.Next
                        onClick={() =>
                          setPage((p) => Math.min(p + 1, totalPages))
                        }
                        disabled={page === totalPages}
                      />
                      <Pagination.Last
                        onClick={() => setPage(totalPages)}
                        disabled={page === totalPages}
                      />
                    </Pagination>
                  )}
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SerialNumberTable;
