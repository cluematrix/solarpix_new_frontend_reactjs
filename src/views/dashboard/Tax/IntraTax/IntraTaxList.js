import React, { useState, useEffect } from "react";
import { Card, Row, Col, Button, Spinner, Table } from "react-bootstrap";
import { Slide, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CreateTwoToneIcon from "@mui/icons-material/CreateTwoTone";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import AddEditModal from "./add-edit-modal";
import DeleteModal from "./delete-modal";
import api from "../../../../api/axios";
import { useLocation } from "react-router";

const IntraTaxList = () => {
  const [taxList, setTaxList] = useState([]);
  const [name, setName] = useState("");
  const [intraPer, setIntraPer] = useState("");
  const [editId, setEditId] = useState(null);

  const [showAddEdit, setShowAddEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const { pathname } = useLocation();
  const [permissions, setPermissions] = useState(null);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentData = taxList.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(taxList.length / rowsPerPage);

  // Permission
  const FETCHPERMISSION = async () => {
    try {
      const res = await api.get("/api/v1/admin/rolePermission");
      let data = Array.isArray(res.data) ? res.data : res.data.data || [];
      const roleId = String(sessionStorage.getItem("roleId"));

      const matched = data.find(
        (perm) =>
          String(perm.role_id) === roleId &&
          perm.display_name === "Intra Tax List"
      );

      if (matched) {
        setPermissions({
          view: matched.view === true || matched.view === 1,
          add: matched.add === true || matched.add === 1,
          edit: matched.edit === true || matched.edit === 1,
          del: matched.del === true || matched.del === 1,
        });
      } else {
        setPermissions(null);
      }
    } catch (err) {
      console.error("Permission error:", err);
      setPermissions(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    FETCHPERMISSION();
  }, [pathname]);

  // Fetch
  const fetchData = () => {
    api
      .get("/api/v1/admin/intraTax")
      .then((res) => {
        setTaxList(Array.isArray(res.data) ? res.data : res.data.data || []);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setTaxList([]);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Save / Update
  const handleSave = () => {
    if (!name.trim()) {
      toast.warning("Name is required");
      return;
    }
    if (!intraPer.trim()) {
      toast.warning("Intra Tax % is required");
      return;
    }

    if (editId) {
      api
        .put(`/api/v1/admin/intraTax/${editId}`, { name, intra_per: intraPer })
        .then(() => {
          toast.success("Intra Tax updated successfully");
          fetchData();
          resetForm();
        })
        .catch((err) =>
          toast.error(err.response?.data?.message || "Update failed")
        );
    } else {
      api
        .post("/api/v1/admin/intraTax", { name, intra_per: intraPer })
        .then(() => {
          toast.success("Intra Tax added successfully");
          fetchData();
          resetForm();
        })
        .catch((err) =>
          toast.error(err.response?.data?.message || "Add failed")
        );
    }
  };

  const handleEdit = (idx) => {
    const data = taxList[idx];
    setName(data.name || "");
    setIntraPer(data.intra_per || "");
    setEditId(data.id);
    setShowAddEdit(true);
  };

  const handleDeleteConfirm = () => {
    if (!deleteId) return;
    api
      .delete(`/api/v1/admin/intraTax/${deleteId}`)
      .then(() => {
        toast.success("Deleted successfully");
        fetchData();
        setShowDelete(false);
      })
      .catch((err) =>
        toast.error(err.response?.data?.message || "Delete failed")
      );
  };

  const resetForm = () => {
    setShowAddEdit(false);
    setName("");
    setIntraPer("");
    setEditId(null);
  };

  if (loading) {
    return (
      <div className="loader-div">
        <Spinner animation="border" className="spinner" />
      </div>
    );
  }

  if (!permissions?.view) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "70vh" }}
      >
        <h4>You don’t have permission to view this page.</h4>
      </div>
    );
  }

  return (
    <>
      <Row className="mt-4">
        <Col sm="12">
          <Card>
            <Card.Header className="d-flex justify-content-between">
              <h5 className="card-title">Intra Tax</h5>
              {permissions.add && (
                <Button
                  className="btn-primary"
                  onClick={() => setShowAddEdit(true)}
                >
                  + New
                </Button>
              )}
            </Card.Header>
            <Card.Body className="px-0 pt-3">
              <div className="table-responsive">
                <Table hover responsive>
                  <thead>
                    <tr>
                      <th>Sr. No.</th>
                      <th>Name</th>
                      <th>Intra Tax %</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {taxList.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center">
                          No data available
                        </td>
                      </tr>
                    ) : (
                      currentData.map((item, idx) => (
                        <tr key={item.id}>
                          <td>{idx + 1}</td>
                          <td>{item.name}</td>
                          <td>{item.intra_per}</td>
                          <td>
                            {permissions.edit && (
                              <CreateTwoToneIcon
                                className="me-2"
                                onClick={() => handleEdit(idx)}
                                color="primary"
                                style={{ cursor: "pointer" }}
                              />
                            )}
                            {permissions.del && (
                              <DeleteRoundedIcon
                                onClick={() => {
                                  setDeleteIndex(idx);
                                  setDeleteId(item.id);
                                  setShowDelete(true);
                                }}
                                color="error"
                                style={{ cursor: "pointer" }}
                              />
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Add / Edit Modal */}
      <AddEditModal
        show={showAddEdit}
        handleClose={resetForm}
        name={name}
        setName={setName}
        intraPer={intraPer}
        setIntraPer={setIntraPer}
        onSave={handleSave}
        modalTitle={editId ? "Update Intra Tax" : "Add New Intra Tax"}
        buttonLabel={editId ? "Update" : "Save"}
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
        modalTitle="Delete Intra Tax"
        modalMessage={
          deleteIndex !== null && taxList[deleteIndex]
            ? `Are you sure you want to delete "${taxList[deleteIndex].name}"?`
            : ""
        }
      />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        transition={Slide}
      />
    </>
  );
};

export default IntraTaxList;
