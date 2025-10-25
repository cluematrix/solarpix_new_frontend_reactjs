// PF Capping Toggle - Salary Payment Method Master
import React, { useState, useEffect } from "react";
import { Card, Row, Col, Spinner, Table, Form } from "react-bootstrap";
import api from "../../../../api/axios";
import { successToast } from "../../../../components/Toast/successToast";
import { errorToast } from "../../../../components/Toast/errorToast";
import { useLocation } from "react-router-dom";

const PFCappingList = () => {
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [permissions, setPermissions] = useState(null);
  const [permLoading, setPermLoading] = useState(true);
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
          edit: true,
        });
        return;
      }

      const displayName = "Salary Payment Method";
      const matched = data.find(
        (perm) =>
          String(perm.role_id) === roleId &&
          perm.display_name?.toLowerCase() === displayName.toLowerCase()
      );

      if (matched) {
        setPermissions({
          view: matched.view === true || matched.view === 1,
          edit: matched.edit === true || matched.edit === 1,
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

  // Fetch salary payment methods including PF Capping
  const fetchMethods = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/v1/admin/PFCapping");
      const list = Array.isArray(res.data.data) ? res.data.data : [];
      setMethods(list);
    } catch (error) {
      console.error("Error fetching payment methods:", error);
      errorToast("Failed to fetch payment methods");
      setMethods([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!permLoading && permissions?.view) {
      fetchMethods();
    }
  }, [permLoading, permissions]);

  // Handle PF Capping toggle
  const handleToggle = async (id, Capping) => {
    try {
      await api.put(`/api/v1/admin/PFCapping/${id}`, { Capping });
      const updated = methods.map((item) =>
        item.id === id ? { ...item, Capping } : item
      );
      setMethods(updated);
      successToast("PF Capping updated successfully");
    } catch (error) {
      console.error("Error updating PF Capping:", error);
      errorToast("Failed to update PF Capping");
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
    <Row className="mt-4">
      <Col sm="12">
        <Card>
          <Card.Header>
            <h5 className="card-title fw-lighter">PF Capping</h5>
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
                      {/* <th>Payment Method</th> */}
                      <th>Apply PF Capping</th>
                    </tr>
                  </thead>
                  <tbody>
                    {methods.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="text-center">
                          No payment methods available
                        </td>
                      </tr>
                    ) : (
                      methods.map((item, idx) => (
                        <tr key={item.id}>
                          <td>{idx + 1}</td>
                          {/* <td>{item.salary_payment_method}</td> */}
                          <td>
                            {permissions.edit ? (
                              <Form.Check
                                type="switch"
                                id={`pf-toggle-${item.id}`}
                                label={item.isActive ? "Yes" : "No"}
                                checked={item.Capping}
                                onChange={(e) =>
                                  handleToggle(item.id, e.target.checked)
                                }
                              />
                            ) : item.Capping ? (
                              "Yes"
                            ) : (
                              "No"
                            )}
                          </td>
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
  );
};

export default PFCappingList;
