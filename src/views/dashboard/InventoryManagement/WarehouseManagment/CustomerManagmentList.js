import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Table,
  Spinner,
  Form,
  Pagination,
} from "react-bootstrap";
import api from "../../../../api/axios";

const CustomerManagementList = () => {
  const [materials, setMaterials] = useState([]);
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState("");
  const [loading, setLoading] = useState(false);
  const [clientsLoading, setClientsLoading] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  /** 🔹 Fetch all customers (from all pages) */
  const fetchAllClients = async () => {
    try {
      setClientsLoading(true);
      let page = 1;
      let totalPages = 1;
      let allData = [];

      do {
        const res = await api.get(
          `/api/v1/admin/stockMaterial/client/pagination?page=${page}&limit=${itemsPerPage}`
        );
        const data = res.data.data || [];
        const pagination = res.data.pagination || {};
        totalPages = pagination.totalPages || 1;

        allData = [...allData, ...data];
        page++;
      } while (page <= totalPages);

      // Extract unique clients
      const uniqueClients = [];
      const seen = new Set();
      allData.forEach((item) => {
        if (item.client && item.client.name && !seen.has(item.client_id)) {
          seen.add(item.client_id);
          uniqueClients.push({
            id: item.client_id,
            name: item.client.name,
          });
        }
      });

      setClients(uniqueClients);
    } catch (err) {
      console.error("Error fetching all clients:", err);
    } finally {
      setClientsLoading(false);
    }
  };

  /** 🔹 Fetch materials (default or for specific client) */
  const fetchMaterials = async (clientId = "", page = 1) => {
    try {
      setLoading(true);
      const endpoint = clientId
        ? `/api/v1/admin/stockMaterial/client/${clientId}/pagination?page=${page}&limit=${itemsPerPage}`
        : `/api/v1/admin/stockMaterial/client/pagination?page=${page}&limit=${itemsPerPage}`;

      const res = await api.get(endpoint);
      const data = Array.isArray(res.data.data) ? res.data.data : [];

      setMaterials(data);
      setTotalPages(res.data.pagination?.totalPages || 1);
      setCurrentPage(page);
    } catch (err) {
      console.error("Error fetching materials:", err);
    } finally {
      setLoading(false);
    }
  };

  /** 🔹 Load all clients + first page of materials on mount */
  useEffect(() => {
    fetchAllClients();
    fetchMaterials();
  }, []);

  /** 🔹 Handle dropdown change */
  const handleClientChange = (e) => {
    const id = e.target.value;
    setSelectedClient(id);
    fetchMaterials(id);
  };

  /** 🔹 Handle pagination change */
  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchMaterials(selectedClient, page);
  };

  /** 🔹 Handle reset */
  const handleReset = () => {
    setSelectedClient("");
    fetchMaterials();
  };

  return (
    <Card className="p-3">
      <Row className="mb-3 align-items-end">
        <Col md={4}>
          <Form.Group controlId="clientSelect">
            <Form.Label>Select Customer</Form.Label>
            {clientsLoading ? (
              <div className="text-muted">Loading customers...</div>
            ) : (
              <Form.Select value={selectedClient} onChange={handleClientChange}>
                <option value="">All Customers</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </Form.Select>
            )}
          </Form.Group>
        </Col>
        <Col md="auto">
          <Button variant="secondary" className="mt-3" onClick={handleReset}>
            Reset
          </Button>
        </Col>
      </Row>

      <Row>
        <Col>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" />
              <p className="mt-2">Loading materials...</p>
            </div>
          ) : (
            <>
              <Table hover responsive>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Material</th>
                    <th>Balance</th>
                    <th>Category</th>
                    <th>Unit</th>
                    <th>Customer Name</th>
                    <th>Type</th>
                  </tr>
                </thead>
                <tbody>
                  {materials.length > 0 ? (
                    materials.map((m) => (
                      <tr key={m.id}>
                        <td>{m.id}</td>
                        <td>{m.material}</td>
                        <td>{m.balance}</td>
                        <td>{m.category?.category || "-"}</td>
                        <td>{m.unit?.unit || "-"}</td>
                        <td>{m.client?.name || "-"}</td>
                        <td>{m.type || "-"}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center">
                        No materials found
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination className="justify-content-end mt-3">
                  <Pagination.First
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                  />
                  <Pagination.Prev
                    onClick={() =>
                      handlePageChange(Math.max(currentPage - 1, 1))
                    }
                    disabled={currentPage === 1}
                  />
                  {[...Array(totalPages)].map((_, i) => (
                    <Pagination.Item
                      key={i + 1}
                      active={i + 1 === currentPage}
                      onClick={() => handlePageChange(i + 1)}
                    >
                      {i + 1}
                    </Pagination.Item>
                  ))}
                  <Pagination.Next
                    onClick={() =>
                      handlePageChange(Math.min(currentPage + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                  />
                  <Pagination.Last
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                  />
                </Pagination>
              )}
            </>
          )}
        </Col>
      </Row>
    </Card>
  );
};

export default CustomerManagementList;
