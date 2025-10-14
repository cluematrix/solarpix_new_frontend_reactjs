import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Table,
  Spinner,
  Form,
  Dropdown,
  Pagination,
} from "react-bootstrap";
import api from "../../../../api/axios";

const BranchStockList = () => {
  const [materials, setMaterials] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedBranches, setSelectedBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingBranches, setLoadingBranches] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch stock materials
  // Fetch stock materials
  // Fetch stock materials
  const fetchMaterials = async () => {
    try {
      setLoading(true);
      let res;

      if (selectedBranches.length > 0) {
        // Use branch-multiple API when branches are selected
        const branchIds = selectedBranches.join(",");

        //   alert(branchIds)
        res = await api.get(
          `/api/v1/admin/stockMaterial/branch-multiple/${branchIds}/pagination?page=1&limit=10`
        );
      } else {
        // Fetch all warehouse materials
        res = await api.get(
          `/api/v1/admin/stockMaterial/pagination?page=1&limit=10`
        );
      }
// console.log("dataXXX",res)
      let data = Array.isArray(res.data.data) ? res.data.data : [];

      // Only warehouse items (just in case)
      data = data.filter((m) => m.direct_send === "Warehouse" && m.branch);

      setMaterials(data);
      setCurrentPage(1);
    } catch (err) {
      console.error("Error fetching materials:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch unique branches from materials
  const fetchBranches = async () => {
    try {
      setLoadingBranches(true);
      const res = await api.get(
        `/api/v1/admin/stockMaterial/pagination?page=1&limit=1000`
      );
      const data = Array.isArray(res.data.data) ? res.data.data : [];

      
      const uniqueBranches = [
        ...new Map(
          data
            .filter((m) => m.branch) // only items with branch
            .map((m) => [m.branch.id, m.branch])
        ).values(),
      ];
      setBranches(uniqueBranches);
    } catch (err) {
      console.error("Error fetching branches:", err);
    } finally {
      setLoadingBranches(false);
    }
  };

  // Handle branch selection
  const handleBranchChange = (id) => {
    setSelectedBranches((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    fetchBranches();
    fetchMaterials();
  }, []);

  // Pagination logic
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentMaterials = materials.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(materials.length / itemsPerPage);

  return (
    <Card className="p-3">
      <Row className="mb-3">
        <Col>
          <h5>Filter by Warehouse</h5>
          <Dropdown
            show={showDropdown}
            onToggle={() => setShowDropdown(!showDropdown)}
          >
            <Dropdown.Toggle variant="primary" style={{ marginTop: "10px" }}>
              {selectedBranches.length > 0
                ? branches
                    .filter((b) => selectedBranches.includes(b.id))
                    .map((b) => b.branch_name)
                    .join(", ")
                : "Select Branch"}
            </Dropdown.Toggle>

            <Dropdown.Menu style={{ minWidth: "250px", padding: "10px" }}>
              {loadingBranches ? (
                <div className="d-flex align-items-center p-2">
                  <Spinner animation="border" size="sm" className="me-2" />
                  Loading...
                </div>
              ) : (
                <>
                  {branches.map((branch) => (
                    <Form.Check
                      key={branch.id}
                      type="checkbox"
                      id={`branch-${branch.id}`}
                      label={branch.branch_name}
                      checked={selectedBranches.includes(branch.id)}
                      onChange={() => handleBranchChange(branch.id)}
                      className="mb-2"
                    />
                  ))}

                  <div className="d-flex justify-content-between mt-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setSelectedBranches([]);
                        fetchMaterials(); // Fetch all materials after clearing
                        setShowDropdown(false); // Optional: close dropdown
                      }}
                    >
                      Reset
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        fetchMaterials();
                        setShowDropdown(false);
                      }}
                    >
                      Apply
                    </Button>
                  </div>
                </>
              )}
            </Dropdown.Menu>
          </Dropdown>
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
                    <th>Branch</th>
                    <th>Vendor</th>
                  </tr>
                </thead>
                <tbody>
                  {currentMaterials.length > 0 ? (
                    currentMaterials.map((m) => (
                      <tr key={m.id}>
                        <td>{m.id}</td>
                        <td>{m.material}</td>
                        <td>{m.balance}</td>
                        <td>{m.category?.category || "-"}</td>
                        <td>{m.unit?.unit || "-"}</td>
                        <td>{m.branch?.branch_name || "N/A"}</td>
                        <td>{m.SupplierManagement?.name || "-"}</td>
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
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                  />
                  <Pagination.Prev
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
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

                  <Pagination.Next
                    onClick={() =>
                      setCurrentPage((p) => Math.min(p + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                  />
                  <Pagination.Last
                    onClick={() => setCurrentPage(totalPages)}
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

export default BranchStockList;
