import React, { useState, useEffect } from "react";
import { Card, Row, Col, Table, Form, Button, Spinner } from "react-bootstrap";
import api from "../../../api/axios";
import { toast } from "react-toastify";
import { errorToast } from "../../../components/Toast/errorToast";
import { successToast } from "../../../components/Toast/successToast";

const RolePermissionList = () => {
  const [roles, setRoles] = useState([]);
  const [modules, setModules] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [permissions, setPermissions] = useState({});
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [loadingModules, setLoadingModules] = useState(true);
  const [loadingPermissions, setLoadingPermissions] = useState(false);
  const [loading, setLoading] = useState(false);
  const permissionTypes = [
    { label: "View", field: "view" },
    { label: "Add", field: "add" },
    { label: "Edit", field: "edit" },
    { label: "Delete", field: "del" },
  ];

  // ✅ modules that should show Access dropdown
  const accessModules = [
    "employee-list",
    "project-list",
    "task-list",
    "leavetype",
    "leaves-list",
    "payroll",
    "Attendance",
    "EmployeeSalary",
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
            // ✅ any_one = 0 (own) or 1 (anyone)
            any_one:
              perm.any_one === 1 ||
              perm.any_one === true ||
              perm.any_one === "1"
                ? 1
                : 0,
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

  // ✅ Handle Access dropdown (0 = own, 1 = anyone)
  const handleAccessChange = (moduleId, value) => {
    setPermissions((prev) => ({
      ...prev,
      [moduleId]: {
        ...prev[moduleId],
        any_one: parseInt(value, 10),
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
        { any_one: current.any_one ?? 0 } // ✅ preserve any_one value
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
      setLoading(true);
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
            // ✅ include boolean numeric field
            any_one: perms.any_one ?? 0,
          };
        }
      );

      await api.put("/api/v1/admin/rolePermission", payloadArray, {
        headers: { "Content-Type": "application/json" },
      });
      setLoading(false);
      successToast("Permissions updated successfully");
    } catch (err) {
      console.error("Error saving permissions:", err);
      errorToast("Failed to save permissions");
      setLoading(false);
    }
  };

  return (
    <Card className="p-3 shadow-sm mt-4">
      <Row className="mb-3">
        <Col md={4}>
          <Form.Group>
            <Form.Label>Select Role</Form.Label>
            {loadingRoles ? (
              <div className="d-flex align-items-center">
                <Spinner animation="border" size="sm" className="me-2" />{" "}
                Loading roles...
              </div>
            ) : (
              <Form.Select value={selectedRole} onChange={handleSelectRole}>
                <option value="">--</option>
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
                  <th className="text-center">Access</th> {/* ✅ new column */}
                </tr>
              </thead>
              <tbody>
                {modules.map((module) => {
                  const modulePerms = permissions[module.id] || {};
                  const allSelected = permissionTypes.every(
                    (p) => modulePerms[p.field]
                  );

                  const showAccessDropdown = accessModules.includes(
                    module.display_name || module.display_name?.toLowerCase()
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
                      <td className="text-center">
                        {showAccessDropdown ? (
                          <Form.Select
                            size="sm"
                            value={modulePerms.any_one ?? 0}
                            onChange={(e) =>
                              handleAccessChange(module.id, e.target.value)
                            }
                          >
                            <option value={0}>Own</option>
                            <option value={1}>Anyone</option>
                          </Form.Select>
                        ) : (
                          "-"
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          )}

          <div className="text-end">
            <Button variant="primary" onClick={handleSave} disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </>
      )}
    </Card>
  );
};

export default RolePermissionList;
