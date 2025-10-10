// Created by sufyan on 16 sep

import React, { useState, useEffect } from "react";
import { Card, Row, Col, Button, Spinner, Table } from "react-bootstrap";
import "react-toastify/dist/ReactToastify.css";
import CreateTwoToneIcon from "@mui/icons-material/CreateTwoTone";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import DeleteModal from "./DeleteModal";
import api from "../../../api/axios";
import { useLocation } from "react-router";
import { successToast } from "../../../components/Toast/successToast";
import { errorToast } from "../../../components/Toast/errorToast";
import * as Yup from "yup";
import { useFormik } from "formik";
import AddEditModal from "./AddEditModal";
import ViewModal from "./ViewModal";
import VisibilityIcon from "@mui/icons-material/Visibility";

const initialValues = {
  bank_name: "",
  acc_name: "",
  acc_no: "",
  IFSC_code: "",
  acc_type: "",
};

const BankList = () => {
  const [userlist, setUserlist] = useState([]);
  const [editId, setEditId] = useState(null);
  const [showAddEdit, setShowAddEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const { pathname } = useLocation();
  const [permissions, setPermissions] = useState(null);

  // View Modal
  const [showView, setShowView] = useState(false);
  const [viewData, setViewData] = useState(null);

  const [loading, setLoading] = useState(true);

  const validationSchema = Yup.object().shape({
    bank_name: Yup.string().required("Bank name is required"),
    acc_name: Yup.string().required("Account name is required"),
    acc_no: Yup.string().required("Account number is required"),
    IFSC_code: Yup.string().required("IFSC code is required"),
    acc_type: Yup.string().required("Data type is required"),
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
          perm.display_name === "Client Custom List"
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
  const fetchBank = () => {
    api
      .get("/api/v1/admin/companyBank")
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
        console.error("Error fetching bank field:", err);
        setUserlist([]);
      });
  };

  useEffect(() => {
    fetchBank();
  }, []);

  const onSubmit = (values) => {
    setLoadingBtn(true);

    if (editId) {
      // Update
      api
        .put(`/api/v1/admin/companyBank/${editId}`, values)
        .then(() => {
          successToast("Bank details updated successfully");
          fetchBank();
          handleResetForm();
        })
        .catch((err) => {
          console.error("Error updating field:", err);
          errorToast(
            err.response?.data?.message || "Failed to update bank details"
          );
        })
        .finally(() => {
          setLoadingBtn(false);
        });
    } else {
      // Add
      api
        .post("/api/v1/admin/companyBank", values)
        .then((res) => {
          successToast("Bank Details added successfully");
          fetchBank();
          handleResetForm();
        })
        .catch((err) => {
          console.error("Error adding bank:", err);
          errorToast(err.response?.data?.message || "Failed to add bank");
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
      bank_name: data?.bank_name || "",
      acc_name: data?.acc_name || "",
      acc_no: data?.acc_no || "",
      IFSC_code: data?.IFSC_code || "",
      acc_type: data?.acc_type || "",
    });
    setEditId(data.id || data._id);
    setShowAddEdit(true);
  };

  const handleDeleteConfirm = () => {
    if (!deleteId) return;
    setLoadingBtn(true);
    api
      .delete(`/api/v1/admin/companyBank/${deleteId}`)
      .then(() => {
        successToast("Bank details deleted successfully");
        fetchBank();
        setShowDelete(false);
      })
      .catch((err) => {
        console.error("Error deleting bank:", err);
        errorToast(err.response?.data?.message || "Failed to delete bank");
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

  // View
  const handleView = (notice) => {
    setViewData(notice);
    setShowView(true);
  };

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
              <h5 className="card-title fw-lighter">Bank Details</h5>
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
                      <th>Bank</th>
                      <th>Account Name</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userlist?.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center">
                          No Bank Available
                        </td>
                      </tr>
                    ) : (
                      userlist?.map((item, idx) => (
                        <tr key={item.id || item._id}>
                          <td>{idx + 1}</td>
                          <td>{item.bank_name || "--"}</td>
                          <td>{item.acc_name || "--"}</td>
                          <td>
                            <span
                              className={`status-dot ${
                                item.isActive ? "active" : "inactive"
                              }`}
                            ></span>
                            {item.isActive ? "Active" : "Inactive"}
                          </td>
                          <td className="d-flex align-items-center">
                            {/* View */}
                            <VisibilityIcon
                              onClick={() => handleView(item)}
                              color="info"
                              style={{ cursor: "pointer" }}
                            />
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
        modalTitle={editId ? "Update Bank" : "Add New Bank"}
        buttonLabel="Save"
        loading={loadingBtn}
        formik={formik}
      />

      {/* View Modal */}
      {showView && viewData && (
        <ViewModal
          showView={showView}
          setShowView={setShowView}
          viewData={viewData}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteModal
        show={showDelete}
        handleClose={() => {
          setShowDelete(false);
          setDeleteIndex(null);
          setDeleteId(null);
        }}
        onConfirm={handleDeleteConfirm}
        modalTitle="Delete Bank Details"
        modalMessage={
          deleteIndex !== null && userlist[deleteIndex]
            ? `Are you sure you want to delete the bank details" ${userlist[deleteIndex].bank_name}"?`
            : ""
        }
        loading={loadingBtn}
      />
    </>
  );
};

export default BankList;
