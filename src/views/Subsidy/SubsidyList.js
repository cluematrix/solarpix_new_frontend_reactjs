// Created by Sufyan on 23 Oct

import React, { useState, useEffect } from "react";
import { Card, Row, Col, Button, Spinner, Table } from "react-bootstrap";
import CreateTwoToneIcon from "@mui/icons-material/CreateTwoTone";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteModal from "./DeleteModal";
import AddEditModal from "./AddEditModal";
import ViewModal from "./ViewModal";
import api from "../../api/axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useLocation } from "react-router";
import { successToast } from "../../components/Toast/successToast";
import { errorToast } from "../../components/Toast/errorToast";

const initialValues = {
  subsidyFields: [{ label: "", value: "" }],
  title: "",
};

const SubsidyList = () => {
  const [subsidy, setSubsidy] = useState(null); // only one subsidy object
  const [editId, setEditId] = useState(null);
  const [showAddEdit, setShowAddEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const { pathname } = useLocation();
  const [permissions, setPermissions] = useState(null);
  const [loading, setLoading] = useState(true);

  // View modal
  const [showView, setShowView] = useState(false);
  const [viewData, setViewData] = useState(null);

  // Validation
  const validationSchema = Yup.object().shape({
    subsidyFields: Yup.array()
      .of(
        Yup.object().shape({
          label: Yup.string().required("Label is required"),
          value: Yup.string().required("Value is required"),
        })
      )
      .min(1, "At least one field is required"),
  });

  // Permissions (same as your other modules)
  const FETCHPERMISSION = async () => {
    try {
      const res = await api.get("/api/v1/admin/rolePermission");
      let data = [];
      if (Array.isArray(res.data)) data = res.data;
      else if (Array.isArray(res.data.data)) data = res.data.data;

      const roleId = String(sessionStorage.getItem("roleId"));
      const matchedPermission = data.find(
        (perm) =>
          String(perm.role_id) === roleId &&
          perm.display_name === "Subsidy List"
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
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    FETCHPERMISSION();
  }, [pathname]);

  // Fetch single subsidy object
  const fetchSubsidy = async () => {
    try {
      const res = await api.get("/api/v1/admin/subsidy/getAllSubsidy");
      if (res.data?.data) {
        setSubsidy(res.data.data);
      } else {
        setSubsidy(null);
      }
    } catch (error) {
      console.error("Error fetching subsidy:", error);
      setSubsidy(null);
    }
  };

  useEffect(() => {
    fetchSubsidy();
  }, []);

  // Add / Update
  const onSubmit = async (values) => {
    console.log("onSubmitHit");
    setLoadingBtn(true);
    try {
      if (editId) {
        // Update existing subsidy
        const res = await api.put(
          `/api/v1/admin/subsidy/updateSubsidy/${editId}`,
          values
        );
        if (res) {
          successToast("Subsidy updated successfully");
          fetchSubsidy();
          handleResetForm();
        }
      } else {
        console.log("createSubHi");
        // Create new subsidy
        const res = await api.post(
          "/api/v1/admin/subsidy/createSubsidy",
          values
        );
        if (res) {
          successToast("Subsidy added successfully");
          fetchSubsidy();
          handleResetForm();
        }
      }
    } catch (err) {
      console.error("Error saving subsidy:", err);
      errorToast("Failed to save subsidy");
    } finally {
      setLoadingBtn(false);
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  const { handleSubmit, resetForm, setValues } = formik;

  const handleEdit = () => {
    if (!subsidy) return;
    setValues({
      title: subsidy.title || "",
      subsidyFields: subsidy.subsidyFields || [{ label: "", value: "" }],
    });
    setEditId(subsidy.id);
    setShowAddEdit(true);
  };

  const handleDeleteConfirm = async () => {
    if (!subsidy?.id) return;
    setLoadingBtn(true);
    try {
      await api.delete(`/api/v1/admin/subsidy/deleteSubsidy/${subsidy.id}`);
      successToast("Subsidy deleted successfully");
      fetchSubsidy();
      setShowDelete(false);
    } catch (err) {
      console.error("Error deleting subsidy:", err);
      errorToast("Failed to delete subsidy");
    } finally {
      setLoadingBtn(false);
    }
  };

  const handleResetForm = () => {
    setShowAddEdit(false);
    setEditId(null);
    resetForm();
  };

  const handleAddField = () => {
    formik.setFieldValue("subsidyFields", [
      ...formik.values.subsidyFields,
      { label: "", value: "" },
    ]);
  };

  const handleRemoveField = (index) => {
    const updatedFields = [...formik.values.subsidyFields];
    updatedFields.splice(index, 1);
    formik.setFieldValue("subsidyFields", updatedFields);
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

  const handleView = () => {
    setViewData(subsidy);
    setShowView(true);
  };

  return (
    <>
      <Row className="mt-4">
        <Col sm="12">
          <Card>
            <Card.Header
              className="d-flex justify-content-between"
              style={{ padding: "15px 15px 0px 15px" }}
            >
              <h5 className="card-title fw-lighter">Subsidy Details</h5>
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
              {!subsidy ? (
                <div className="text-center py-5">No Subsidy Available</div>
              ) : (
                <div className="px-3 pb-3">
                  <Table hover responsive className="table">
                    <thead>
                      <tr className="table-gray">
                        <th>Sr. No.</th>
                        <th>Subsidy Details</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>1</td>
                        <td>
                          {subsidy?.subsidyFields?.map((field, idx) => (
                            <div key={idx}>
                              <strong>{field.label}:</strong> {field.value}
                            </div>
                          ))}
                        </td>
                        <td>
                          <div className="d-flex">
                            <VisibilityIcon
                              onClick={() => handleView(subsidy)}
                              color="info"
                              style={{ cursor: "pointer" }}
                            />
                            {permissions?.edit && (
                              <CreateTwoToneIcon
                                onClick={() => handleEdit(subsidy)}
                                color="primary"
                                style={{ cursor: "pointer" }}
                              />
                            )}
                            {permissions?.del && (
                              <DeleteRoundedIcon
                                onClick={() => setShowDelete(true)}
                                color="error"
                                style={{ cursor: "pointer" }}
                              />
                            )}
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Add/Edit Modal */}
      <AddEditModal
        show={showAddEdit}
        handleClose={handleResetForm}
        onSave={handleSubmit}
        modalTitle={editId ? "Update Subsidy" : "Add New Subsidy"}
        buttonLabel="Save"
        loading={loadingBtn}
        formik={formik}
        handleAddField={handleAddField}
        handleRemoveField={handleRemoveField}
      />

      {/* View Modal */}
      {showView && viewData && (
        <ViewModal
          showView={showView}
          setShowView={setShowView}
          viewData={viewData}
        />
      )}

      {/* Delete Modal */}
      <DeleteModal
        show={showDelete}
        handleClose={() => setShowDelete(false)}
        onConfirm={handleDeleteConfirm}
        modalTitle="Delete Subsidy"
        modalMessage={`Are you sure you want to delete this data"?`}
        loading={loadingBtn}
      />
    </>
  );
};

export default SubsidyList;
