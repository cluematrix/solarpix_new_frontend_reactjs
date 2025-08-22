import React, { useState, useEffect } from "react";
import { Card, Row, Col, Button, Form } from "react-bootstrap";
import CreateTwoToneIcon from "@mui/icons-material/CreateTwoTone";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import AddEditModal from "./add-edit-modal";
import DeleteModal from "./delete-modal";
import api from "../../../../api/axios";
import { useLocation } from "react-router";

const EmployeeType = () => {
  const [userlist, setUserlist] = useState([]);
  const [empType, setEmpType] = useState(""); // ✅ updated
  const [editId, setEditId] = useState(null);

  const [showAddEdit, setShowAddEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const { pathname } = useLocation();
  const [permissions, setPermissions] = useState(null);

  // 🔑 PERMISSION CHECK
  const FETCHPERMISSION = async () => {
    try {
      const res = await api.get("/api/v1/admin/rolePermission");
      let data = [];

      if (Array.isArray(res.data)) data = res.data;
      else if (Array.isArray(res.data.data)) data = res.data.data;

      const matchedPermission = data.find((perm) => perm.route === pathname);
      setPermissions(matchedPermission || null);
    } catch (err) {
      console.error("Error fetching roles:", err);
      setPermissions(null);
    }
  };

  useEffect(() => {
    FETCHPERMISSION();
  }, [pathname]);

  // Fetch employee types
  const fetchEmployeeTypes = () => {
    api
      .get("/api/v1/admin/employmentType")
      .then((res) => {
        if (Array.isArray(res.data)) {
          setUserlist(res.data);
        } else if (Array.isArray(res.data.data)) {
          setUserlist(res.data.data);
        } else {
          setUserlist([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching employee types:", err);
        setUserlist([]);
      });
  };

  useEffect(() => {
    fetchEmployeeTypes();
  }, []);

  // Toggle Active/Inactive
  const handleToggleActive = (id, currentStatus) => {
    const newStatus = currentStatus === 1 ? 0 : 1;

    setUserlist((prev) =>
      prev.map((et) => (et.id === id ? { ...et, isActive: newStatus } : et))
    );

    api
      .put(`/api/v1/admin/employmentType/${id}`, { isActive: newStatus })
      .catch((err) => {
        console.error("Update failed:", err);
        setUserlist((prev) =>
          prev.map((et) =>
            et.id === id ? { ...et, isActive: currentStatus } : et
          )
        );
      });
  };

  // Add or Update Employee Type
  const handleAddOrUpdate = () => {
    if (!empType.trim()) return;
    if (editId) {
      api
        .put(`/api/v1/admin/employmentType/${editId}`, { emp_type: empType }) // ✅ use emp_type
        .then(() => {
          fetchEmployeeTypes();
          resetForm();
        })
        .catch((err) => console.error("Error updating employee type:", err));
    } else {
      api
        .post("/api/v1/admin/employmentType/", { emp_type: empType }) // ✅ use emp_type
        .then(() => {
          fetchEmployeeTypes();
          resetForm();
        })
        .catch((err) => console.error("Error adding employee type:", err));
    }
  };

  const handleEdit = (index) => {
    const emp = userlist[index];
    setEmpType(emp.emp_type); // ✅ use emp_type
    setEditId(emp.id || emp._id);
    setShowAddEdit(true);
  };

  const handleDeleteConfirm = () => {
    if (!deleteId) return;
    api
      .delete(`/api/v1/admin/employmentType/${deleteId}`)
      .then(() => {
        fetchEmployeeTypes();
        setShowDelete(false);
      })
      .catch((err) => console.error("Error deleting employee type:", err));
  };

  const resetForm = () => {
    setShowAddEdit(false);
    setEmpType("");
    setEditId(null);
  };

  // 🚫 Block page if no permission
  if (!permissions) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "70vh" }}
      >
        <h4>Loading permissions...</h4>
      </div>
    );
  }

  if (!permissions.view) {
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
      <Row>
        <Col sm="12">
          <Card>
            <Card.Header className="d-flex justify-content-between">
              <h4 className="card-title">Employee Type List</h4>
              {permissions.add && (
                <Button
                  className="btn-primary"
                  onClick={() => setShowAddEdit(true)}
                >
                  + Add Type
                </Button>
              )}
            </Card.Header>

            <Card.Body className="px-0">
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Sr. No.</th>
                      <th>Employee Type</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userlist.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center">
                          No Employee Type available
                        </td>
                      </tr>
                    ) : (
                      userlist.map((item, idx) => (
                        <tr key={item.id || item._id}>
                          <td>{idx + 1}</td>
                          <td>{item.emp_type}</td> {/* ✅ show emp_type */}
                          <td>{item.isActive ? "Active" : "Inactive"}</td>
                          <td className="d-flex align-items-center">
                            <Form.Check
                              type="switch"
                              id={`active-switch-${item.id}`}
                              checked={item.isActive === 1}
                              onChange={() =>
                                handleToggleActive(item.id, item.isActive)
                              }
                              className="me-3"
                            />

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
                                  setDeleteId(item.id || item._id);
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
                </table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Add/Edit Modal */}
      <AddEditModal
        show={showAddEdit}
        handleClose={resetForm}
        empType={empType} // ✅ pass empType
        setEmpType={setEmpType} // ✅ setter
        onSave={handleAddOrUpdate}
        modalTitle={editId ? "Update Employee Type" : "Add New Employee Type"}
        buttonLabel={editId ? "Update" : "Submit"}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        show={showDelete}
        handleClose={() => {
          setShowDelete(false);
          setDeleteIndex(null);
          setDeleteId(null);
        }}
        onConfirm={handleDeleteConfirm}
        modalTitle="Delete Employee Type"
        modalMessage={
          deleteIndex !== null && userlist[deleteIndex]
            ? `Are you sure you want to delete the employee type "${userlist[deleteIndex].emp_type}"?`
            : ""
        }
      />
    </>
  );
};

export default EmployeeType;
