import React, { useState, useEffect } from "react";
import { Card, Row, Col, Table, Form, Button, Spinner } from "react-bootstrap";
import api from "../../../api/axios";
import { toast } from "react-toastify";

const RolePermissionList = () => {
  const [roles, setRoles] = useState([]);
  const [modules, setModules] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [permissions, setPermissions] = useState({});
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [loadingModules, setLoadingModules] = useState(true);
  const [loadingPermissions, setLoadingPermissions] = useState(false);

  const permissionTypes = [
    { label: "View", field: "view" },
    { label: "Add", field: "add" },
    { label: "Edit", field: "edit" },
    { label: "Delete", field: "del" },
  ];

  // fetch roles
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await api.get("/api/v1/admin/role/active");
        if (res.data && Array.isArray(res.data)) {
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

  // fetch permissions
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

  // Select All for module
  const handleSelectAll = (moduleId) => {
    const current = permissions[moduleId] || {};
    const allSelected = permissionTypes.every((p) => current[p.field]);
    setPermissions((prev) => ({
      ...prev,
      [moduleId]: permissionTypes.reduce(
        (acc, p) => ({ ...acc, [p.field]: !allSelected }),
        {}
      ),
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

  const handleSave = async () => {
    try {
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
            display_name: module?.display_name || null,
            route: module?.route || null,
          };
        }
      );

      await api.put("/api/v1/admin/rolePermission", payloadArray, {
        headers: { "Content-Type": "application/json" },
      });

      toast.success("Permissions updated successfully");
    } catch (err) {
      console.error("Error saving permissions:", err);
      toast.error("Failed to save permissions");
    }
  };
  return (
    <Card className="p-3 shadow-sm mt-4">
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
                  .filter((role) => role.id !== 1)
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
            <Table hover responsive>
              <thead className="table-light">
                <tr>
                  <th>Module</th>
                  <th className="text-center">Select All</th>
                  {permissionTypes.map((perm) => (
                    <th key={perm.field} className="text-center">
                      {perm.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {modules.map((module) => {
                  const modulePerms = permissions[module.id] || {};
                  const allSelected = permissionTypes.every(
                    (p) => modulePerms[p.field]
                  );
                  return (
                    <tr key={module.id}>
                      <td>{module.display_name}</td>
                      <td className="text-center">
                        <Form.Check
                          type="checkbox"
                          checked={allSelected}
                          onChange={() => handleSelectAll(module.id)}
                        />
                      </td>
                      {permissionTypes.map((perm) => (
                        <td key={perm.field} className="text-center">
                          <Form.Check
                            type="checkbox"
                            checked={Boolean(modulePerms[perm.field])}
                            onChange={() =>
                              handlePermissionChange(module.id, perm.field)
                            }
                          />
                        </td>
                      ))}
                    </tr>
                  );
                })}
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
