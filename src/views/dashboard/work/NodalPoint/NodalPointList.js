// Created by sufyan on 16 sep

import React, { useState, useEffect } from "react";
import { Card, Row, Col, Button, Spinner, Table } from "react-bootstrap";
import "react-toastify/dist/ReactToastify.css";
import CreateTwoToneIcon from "@mui/icons-material/CreateTwoTone";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import DeleteModal from "./DeleteModal";
import api from "../../../../api/axios";
import { useLocation, useNavigate } from "react-router";
import { successToast } from "../../../../components/Toast/successToast";
import { errorToast } from "../../../../components/Toast/errorToast";
import * as Yup from "yup";
import { useFormik } from "formik";
import AddEditModal from "./AddEditModal";

const initialValues = {
  field_name: "",
  label: "",
  data_type: "",
  is_required: false,
};

const NodalPointList = () => {
  const [userlist, setUserlist] = useState([]);
  const [editId, setEditId] = useState(null);
  const [showAddEdit, setShowAddEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const { pathname } = useLocation();
  const [permissions, setPermissions] = useState(null);
  const [showView, setShowView] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const validationSchema = Yup.object().shape({
    field_name: Yup.string().required("Field name is required"),
    label: Yup.string().required("Label is required"),
    data_type: Yup.string().required("Data type is required"),
  });

  const FETCHPERMISSION = async () => {
    try {
      const res = await api.get("/api/v1/admin/rolePermission");

      let data = [];
      if (Array.isArray(res.data)) {
        data = res.data;
      } else if (Array.isArray(res.data.data)) {
        data = res.data.data;
      }

      const roleId = String(sessionStorage.getItem("roleId"));
      console.log(roleId, "roleId from sessionStorage");
      console.log(pathname, "current pathname");

      // ✅ Match current role + route
      const matchedPermission = data.find(
        (perm) =>
          String(perm.role_id) === roleId &&
          perm.display_name === "NodalPoint"
      );

      if (matchedPermission) {
        setPermissions({
          view: matchedPermission.view === true || matchedPermission.view === 1,
          add: matchedPermission.add === true || matchedPermission.add === 1,
          edit: matchedPermission.edit === true || matchedPermission.edit === 1,
          del: matchedPermission.del === true || matchedPermission.del === 1,
        });
      } else {
        setPermissions(null);
      }
    } catch (err) {
      console.error("Error fetching roles:", err);
      setPermissions(null);
    } finally {
      setLoading(false); // Stop loader after API call
    }
  };

  useEffect(() => {
    setLoading(true); // reset loader each time route changes
    FETCHPERMISSION();
  }, [pathname]);

  // Fetch custom field
  const fetchCustomField = () => {
    api
      .get("/api/v1/admin/npField")
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
        console.error("Error fetching Nodal Point Module field:", err);
        setUserlist([]);
      });
  };

  useEffect(() => {
    fetchCustomField();
  }, []);

  const onSubmit = (values) => {
    const payload = {
      field_name: values.field_name,
      label: values.label,
      data_type: values.data_type,
      is_required: Boolean(values.is_required),
    };

    setLoadingBtn(true);

    if (editId) {
      // Update
      api
        .put(`/api/v1/admin/npField/${editId}`, payload)
        .then(() => {
          successToast("Nodal Point field updated successfully");
          fetchCustomField();
          handleResetForm();
        })
        .catch((err) => {
          console.error("Error updating field:", err);
          errorToast(
            err.response?.data?.message || "Failed to update Nodal Point field"
          );
        })
        .finally(() => {
          setLoadingBtn(false);
        });
    } else {
      // Add
      api
        .post("/api/v1/admin/npField", payload)
        .then((res) => {
          successToast("MSEB field added successfully");
          fetchCustomField();
          handleResetForm();
        })
        .catch((err) => {
          console.error("Error adding Nodal Point field:", err);
          errorToast(
            err.response?.data?.message || "Failed to add Nodal Point field"
          );
        })
        .finally(() => {
          setLoadingBtn(false);
        });
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  const { handleSubmit, resetForm, values } = formik;

  const handleEdit = (index) => {
    const data = userlist[index];
    console.log("datass", data);
    // console.log("data.remark", data.remark);
    formik.setValues({
      field_name: data?.field_name || "",
      label: data?.label || "",
      data_type: data?.data_type || "",
      is_required: data.is_required,
    });
    setEditId(data.id || data._id);
    setShowAddEdit(true);
  };

  const handleDeleteConfirm = () => {
    if (!deleteId) return;
    setLoadingBtn(true);
    api
      .delete(`/api/v1/admin/npField/${deleteId}`)
      .then(() => {
        successToast("Nodal Point field deleted successfully");
        fetchCustomField();
        setShowDelete(false);
      })
      .catch((err) => {
        console.error("Error deleting MSEB field:", err);
        errorToast(
          err.response?.data?.message || "Nodal Point to delete MSEB field"
        );
      })
      .finally(() => {
        setLoadingBtn(false);
      });
  };

  const handleResetForm = () => {
    setShowAddEdit(false);
    setEditId(null);
    resetForm();
  };

  //  Loader while checking permissions
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

  console.log("is_required", typeof Boolean(values.is_required));
  return (
    <>
      <Row className="mt-4">
        <Col sm="12">
          <Card>
            <Card.Header
              className="d-flex justify-content-between"
              style={{ padding: "15px 15px 0px 15px" }}
            >
              <h5 className="card-title fw-lighter">Nodal Point Field</h5>
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
                <Table hover responsive className="table">
                  <thead>
                    <tr className="table-gray">
                      <th>Sr. No.</th>
                      <th>Name</th>
                      <th>Label</th>
                      <th>Data Type</th>
                      <th>Required</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userlist?.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center">
                          No MSEB Filed Available
                        </td>
                      </tr>
                    ) : (
                      userlist?.map((item, idx) => (
                        <tr key={item.id || item._id}>
                          <td>{idx + 1}</td>
                          <td>{item.field_name || "--"}</td>
                          <td>{item.label || "--"}</td>
                          <td>{item.data_type || "--"}</td>
                          <td>{item.is_required || "--"}</td>
                          <td>
                            <span
                              className={`status-dot ${
                                item.is_active ? "active" : "inactive"
                              }`}
                            ></span>
                            {item.is_active ? "Active" : "Inactive"}
                          </td>
                          <td className="d-flex align-items-center">
                            {permissions.edit && (
                              <CreateTwoToneIcon
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
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Add/Edit Modal */}
      <AddEditModal
        show={showAddEdit}
        handleClose={handleResetForm}
        onSave={handleSubmit}
        modalTitle={editId ? "Update Field" : "Add New Field"}
        buttonLabel="Save"
        loading={loadingBtn}
        formik={formik}
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
        modalTitle="Delete Stock Material"
        modalMessage={
          deleteIndex !== null && userlist[deleteIndex]
            ? `Are you sure you want to delete the stock material" ${userlist[deleteIndex].material}"?`
            : ""
        }
        loading={loadingBtn}
      />
    </>
  );
};

export default NodalPointList;
