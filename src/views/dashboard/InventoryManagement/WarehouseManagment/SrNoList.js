import React, { useState, useEffect } from "react";
import { Card, Row, Col, Table, Spinner, Pagination } from "react-bootstrap";
import api from "../../../../api/axios";
import { useLocation } from "react-router-dom";
import CreateTwoToneIcon from "@mui/icons-material/CreateTwoTone";
import { successToast } from "../../../../components/Toast/successToast";
import { errorToast } from "../../../../components/Toast/errorToast";
import EditModalSrNo from "./EditModalSrNo";

const SrNoList = () => {
  const location = useLocation();
  const { branch_id } = location?.state;
  const { stock_material_id } = location?.state;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState(false);

  // for edit
  const [roleName, setRoleName] = useState("");
  const [showAddEdit, setShowAddEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch all or branch-specific data
  const fetchTransactionsById = async (page = 1) => {
    try {
      setLoading(true);
      let url = `/api/v1/admin/stockMaterialSrNo/branchIdStockId/${branch_id}/${stock_material_id}/pagination?page=${page}&limit=${itemsPerPage}`;

      const res = await api.get(url);
      setData(res.data?.data || []);

      // Extract pagination info
      const pagination = res.data?.pagination;
      if (pagination) {
        setTotalPages(pagination.totalPages || 1);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSave = () => {
    if (editId) {
      // Update
      setLoadingBtn(true);
      api
        .put(`/api/v1/admin/stockMaterialSrNo/updateSrNo/${editId}`, {
          serialNumber: roleName,
        })
        .then(() => {
          successToast("Serial number updated successfully");
          fetchTransactionsById(currentPage);
          resetForm();
        })
        .catch((err) => {
          console.error("Error updating serial number:", err);
          errorToast(
            err.response?.data?.message || "Failed to update serial number"
          );
          setLoadingBtn(false);
        })
        .finally(() => {
          setLoadingBtn(false);
        });
    }
  };

  const handleEdit = (index) => {
    const srNo = data[index];
    console.log("srNo", srNo);
    setRoleName(srNo.serialNumber);
    setEditId(srNo.id || srNo._id);
    setShowAddEdit(true);
  };

  const resetForm = () => {
    setShowAddEdit(false);
    setRoleName("");
    setEditId(null);
  };

  // Load all data initially
  useEffect(() => {
    fetchTransactionsById(currentPage);
  }, [currentPage]);

  // console section

  return (
    <>
      <Card className="p-3">
        <Row>
          <Col>
            {loading ? (
              <div className="loader-div">
                <Spinner animation="border" />
              </div>
            ) : (
              <>
                <div className="table-responsive">
                  <Table hover responsive className="table">
                    <thead className="table-light">
                      <tr>
                        <th>Sr. No.</th>
                        <th>Branch</th>
                        <th>Category</th>
                        <th>Material</th>
                        <th>Serial No</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.length > 0 ? (
                        data.map((t, index) => (
                          <tr key={t.id}>
                            <td>
                              {(currentPage - 1) * itemsPerPage + index + 1}
                            </td>
                            <td>{t.branch?.branch_name || "—"}</td>
                            <td>{t.inv_cat?.category || "—"}</td>
                            <td>{t.stock_material?.material || "—"}</td>
                            <td>{t.serialNumber || "—"}</td>
                            <td>{t.isUsed ? "Sold" : "Available" || "—"}</td>
                            <td>
                              {" "}
                              <CreateTwoToneIcon
                                onClick={
                                  !t.isUsed
                                    ? () => handleEdit(index)
                                    : undefined
                                }
                                color="primary"
                                style={{
                                  cursor: t.isUsed ? "not-allowed" : "pointer",
                                  opacity: t.isUsed ? 0.5 : 1, // optional visual cue
                                }}
                              />
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="8" className="text-center">
                            No data found
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
              </>
            )}
          </Col>
        </Row>
      </Card>

      {/* Edit Modal */}
      <EditModalSrNo
        show={showAddEdit}
        handleClose={resetForm}
        roleName={roleName}
        setRoleName={setRoleName}
        onSave={handleEditSave}
        modalTitle="Update Serial No."
        buttonLabel="Save"
        loadingBtn={loadingBtn}
      />
    </>
  );
};

export default SrNoList;
