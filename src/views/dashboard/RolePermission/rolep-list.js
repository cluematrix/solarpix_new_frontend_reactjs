import React, { useState, useEffect } from "react";
import { Card, Row, Col, Table, Form, Button, Spinner } from "react-bootstrap";
import api from "../../../api/axios";

const RolePermissionList = () => {
  const [roles, setRoles] = useState([]);
  const [modules, setModules] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [permissions, setPermissions] = useState({});
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [loadingModules, setLoadingModules] = useState(true);
  const [loadingPermissions, setLoadingPermissions] = useState(false);

  //  Match backend field names
  const permissionTypes = [
    { label: "View", field: "view" },
    { label: "Add", field: "add" },
    { label: "Edit", field: "edit" },
    { label: "Delete", field: "del" },
  ];

  //  fetch roles
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await api.get("/api/v1/admin/role/active");
        if (res.data && Array.isArray(res.data)) {
          console.log(res);
          const activeRoles = res.data.filter(
            (r) => r.isActive === 1 || r.isActive === true
          );
          setRoles(activeRoles);
        } else {
          setRoles([]);
        }
      } catch (err) {
        console.error("Error fetching roles:", err);
        setRoles([]);
      } finally {
        setLoadingRoles(false);
      }
    };
    fetchRoles();
  }, []);

  // fetch modules
  useEffect(() => {
    const fetchModules = async () => {
      try {
        const res = await api.get("/api/v1/admin/module");
        if (res.data && Array.isArray(res.data)) {
          setModules(res.data);
        } else {
          setModules([]);
        }
      } catch (err) {
        console.error("Error fetching modules:", err);
        setModules([]);
      } finally {
        setLoadingModules(false);
      }
    };
    fetchModules();
  }, []);

  //  fetch permissions for selected role
  const fetchPermissions = async (roleId) => {
    setLoadingPermissions(true);
    try {
      const res = await api.get(
        `/api/v1/admin/rolePermission?roleId=${roleId}`
      );
      if (res.data && Array.isArray(res.data)) {
        const formatted = {};
        res.data.forEach((perm) => {
          formatted[perm.module_id] = {
            view: perm.view === 1 || perm.view === true || perm.view === "1",
            add: perm.add === 1 || perm.add === true || perm.add === "1",
            edit: perm.edit === 1 || perm.edit === true || perm.edit === "1",
            del: perm.del === 1 || perm.del === true || perm.del === "1",
          };
        });
        setPermissions(formatted);
      } else {
        setPermissions({});
      }
    } catch (err) {
      console.error("Error fetching permissions:", err);
      setPermissions({});
    } finally {
      setLoadingPermissions(false);
    }
  };

  const handlePermissionChange = (moduleId, field) => {
    setPermissions((prev) => ({
      ...prev,
      [moduleId]: {
        ...prev[moduleId],
        [field]: !prev[moduleId]?.[field],
      },
    }));
  };

  const handleSelectRole = (e) => {
    const roleId = e.target.value;
    setSelectedRole(roleId);
    if (roleId) {
      fetchPermissions(roleId);
    } else {
      setPermissions({});
    }
  };

  //  FIXED: Added catch block
  const handleSave = async () => {
    try {
      // Convert permissions state into JSON payload
      const payloadArray = Object.entries(permissions).map(
        ([moduleId, perms]) => {
          const module = modules.find((m) => m.id === parseInt(moduleId));
          return {
            role_id: parseInt(selectedRole),
            module_id: parseInt(moduleId),
            view: perms.view || false,
            add: perms.add || false,
            edit: perms.edit || false,
            del: perms.del || false,
            display_name: module?.display_name || null, // include display_name
            route: module?.route || null, // include route
          };
        }
      );

      await api.put("/api/v1/admin/rolePermission", payloadArray, {
        headers: { "Content-Type": "application/json" },
      });

      alert("Permissions updated successfully!");
    } catch (err) {
      console.error("Error saving permissions:", err);
      alert("Failed to save permissions.");
    }
  };

  return (
    <Card className="p-3 shadow-sm">
      {/* Role dropdown */}
      {/* Role dropdown */}
      <Row className="mb-3">
        <Col md={4}>
          <Form.Group>
            <Form.Label>
              <b>Select Role</b>
            </Form.Label>
            {loadingRoles ? (
              <div className="d-flex align-items-center">
                <Spinner animation="border" size="sm" className="me-2" />{" "}
                Loading roles...
              </div>
            ) : (
              <Form.Select value={selectedRole} onChange={handleSelectRole}>
                <option value="">-- Select Role --</option>
                {roles
                  .filter((role) => role.id !== 1) // Exclude Admin from dropdown
                  .map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
              </Form.Select>
            )}
          </Form.Group>
        </Col>
      </Row>

      {/* Permissions table */}
      {selectedRole && (
        <>
          <h5 className="mb-3">
            Permissions for{" "}
            <span className="text-primary">
              {roles.find((r) => r.id.toString() === selectedRole)?.name}
            </span>
          </h5>

          {loadingModules || loadingPermissions ? (
            <div className="d-flex align-items-center">
              <Spinner animation="border" size="sm" className="me-2" />{" "}
              Loading...
            </div>
          ) : (
            <Table bordered hover responsive>
              <thead className="table-light">
                <tr>
                  <th>Module</th>
                  {permissionTypes.map((perm) => (
                    <th key={perm.field} className="text-center">
                      {perm.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {modules.map((module) => (
                  <tr key={module.id}>
                    <td>{module.display_name}</td>
                    {permissionTypes.map((perm) => (
                      <td key={perm.field} className="text-center">
                        <Form.Check
                          type="checkbox"
                          checked={Boolean(
                            permissions[module.id]?.[perm.field]
                          )}
                          onChange={() =>
                            handlePermissionChange(module.id, perm.field)
                          }
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </Table>
          )}

          <div className="text-end">
            <Button variant="primary" onClick={handleSave}>
              Save Permissions
            </Button>
          </div>
        </>
      )}
    </Card>
  );
};

export default RolePermissionList;
