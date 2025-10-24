// Created by: Rishiraj Korde - Salary TDS Master
import React, { useState, useEffect } from "react";
import { Card, Row, Col, Button, Spinner, Table } from "react-bootstrap";
import CreateTwoToneIcon from "@mui/icons-material/CreateTwoTone";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import api from "../../../../api/axios";
import { successToast } from "../../../../components/Toast/successToast";
import { errorToast } from "../../../../components/Toast/errorToast";
import { useLocation } from "react-router-dom";
import AddEditSalaryTDS from "./AddEditSalaryTDS";

const SalaryPayMethodList = () => {
  const [tdsList, setTdsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [permissions, setPermissions] = useState(null);
  const [permLoading, setPermLoading] = useState(true);
  const [editIndex, setEditIndex] = useState(null);
  const [showAddEdit, setShowAddEdit] = useState(false);
  const { pathname } = useLocation();

  // Fetch permissions
  const FETCHPERMISSION = async () => {
    setPermLoading(true);
    try {
      const res = await api.get("/api/v1/admin/rolePermission");
      const data = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data.data)
        ? res.data.data
        : [];

      const roleId = String(sessionStorage.getItem("roleId"));
      if (roleId === "1") {
        setPermissions({
          view: true,
          add: true,
          edit: true,
          del: true,
          any_one: true,
        });
        return;
      }

      const displayName = "Salary TDS"; // Set dynamically if needed
      const matched = data.find(
        (perm) =>
          String(perm.role_id) === roleId &&
          perm.display_name?.toLowerCase() === displayName.toLowerCase()
      );

      if (matched) {
        setPermissions({
          view: matched.view === true || matched.view === 1,
          add: matched.add === true || matched.add === 1,
          edit: matched.edit === true || matched.edit === 1,
          del: matched.del === true || matched.del === 1,
          any_one: matched.any_one === true || matched.any_one === 1,
        });
      } else {
        setPermissions(null);
      }
    } catch (err) {
      console.error("Error fetching permissions:", err);
      setPermissions(null);
    } finally {
      setPermLoading(false);
    }
  };

  useEffect(() => {
    FETCHPERMISSION();
  }, [pathname]);

  // Fetch Salary TDS
  const fetchSalaryTDS = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/v1/admin/salaryTDS");
      const list = Array.isArray(res.data.data) ? res.data.data : [];
      setTdsList(list);
    } catch (error) {
      console.error("Error fetching TDS:", error);
      errorToast("Failed to fetch Salary TDS");
      setTdsList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!permLoading && permissions?.view) {
      fetchSalaryTDS();
    }
  }, [permLoading, permissions]);

  // Save after Add/Edit
  const handleSave = (data) => {
    if (editIndex !== null) {
      const updated = [...tdsList];
      updated[editIndex] = data;
      setTdsList(updated);
    } else {
      setTdsList([...tdsList, data]);
    }
    setEditIndex(null);
  };

  // Edit
  const handleEdit = (index) => {
    setEditIndex(index);
    setShowAddEdit(true);
  };

  // Delete
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this Salary TDS?"
    );
    if (!confirmDelete) return;
    try {
      await api.delete(`/api/v1/admin/salaryTDS/${id}`);
      successToast("Salary TDS deleted successfully");
      setTdsList(tdsList.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting TDS:", error);
      errorToast("Failed to delete Salary TDS");
    }
  };

  if (permLoading)
    return (
      <div className="loader-div">
        <Spinner animation="border" className="spinner" />
      </div>
    );
  if (!permissions?.view)
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "70vh" }}
      >
        <h4>You don’t have permission to view this page.</h4>
      </div>
    );

  return (
    <>
      <Row className="mt-4">
        <Col sm="12">
          <Card>
            <Card.Header
              className="d-flex justify-content-between align-items-center"
              style={{ padding: "15px 15px 0px 15px" }}
            >
              <h5 className="card-title fw-lighter">Salary TDS Master</h5>
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
              {loading ? (
                <div className="text-center p-4">
                  <Spinner animation="border" />
                </div>
              ) : (
                <div className="table-responsive">
                  <Table hover responsive className="table">
                    <thead>
                      <tr className="table-gray">
                        <th>#</th>
                        <th>Annual Salary From</th>
                        <th>Annual Salary Upto</th>
                        <th>Salary Percent (%)</th>
                        {(permissions.edit || permissions.del) && (
                          <th>Action</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {tdsList.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="text-center">
                            No TDS data available
                          </td>
                        </tr>
                      ) : (
                        tdsList.map((item, idx) => (
                          <tr key={item.id}>
                            <td>{idx + 1}</td>
                            <td>{item.annual_salary_from}</td>
                            <td>{item.annual_salary_upto}</td>
                            <td>{item.salary_percent}</td>
                            {(permissions.edit || permissions.del) && (
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
                                    onClick={() => handleDelete(item.id)}
                                    color="error"
                                    style={{ cursor: "pointer" }}
                                  />
                                )}
                              </td>
                            )}
                          </tr>
                        ))
                      )}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Add/Edit Modal */}
      <AddEditSalaryTDS
        show={showAddEdit}
        handleClose={() => {
          setShowAddEdit(false);
          setEditIndex(null);
        }}
        onSave={handleSave}
        editData={editIndex !== null ? tdsList[editIndex] : null}
      />
    </>
  );
};

export default SalaryPayMethodList;
