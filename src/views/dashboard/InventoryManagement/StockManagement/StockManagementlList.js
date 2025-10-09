// Created by sufyan on 16 sep

import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Form,
  Spinner,
  Table,
  Pagination,
} from "react-bootstrap";
import "react-toastify/dist/ReactToastify.css";
import CreateTwoToneIcon from "@mui/icons-material/CreateTwoTone";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import AddEditModal from "./AddEditModal";
import DeleteModal from "./DeleteModal";
import api from "../../../../api/axios";
import { useLocation } from "react-router";
import { successToast } from "../../../../components/Toast/successToast";
import { errorToast } from "../../../../components/Toast/errorToast";
import * as Yup from "yup";
import { useFormik } from "formik";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ViewModal from "./ViewModal";

const initialValues = {
  Credit: 0,
  Debit: 0,
  balance: "",
  remark: "",
  stock_material_id: "",
  stock_particular_id: "",
  supplier_management_id: "",
  brand_id: "",
  client_id: "",
  select_type: "Debit",
  serialNumbers: [],
};

const StockManagementList = () => {
  const [userlist, setUserlist] = useState([]);
  const [editId, setEditId] = useState(null);
  const [showAddEdit, setShowAddEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const { pathname } = useLocation();
  const [permissions, setPermissions] = useState(null);
  const [showSerialModal, setShowSerialModal] = useState(false);

  // View Modal
  const [showView, setShowView] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [materialPagList, setMaterialPagList] = useState([]);

  const [loading, setLoading] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [metaData, setMetaData] = useState({
    stockMaterial: [],
    stockParticular: [],
    supplierManagement: [],
    brand: [],
    customer: [],
  });

  const validationSchema = Yup.object().shape({
    balance: Yup.number()
      .required("Balance is required")
      .typeError("Balance must be a number"),

    stock_material_id: Yup.string().required("Stock material is required"),
    stock_particular_id: Yup.string().required("Stock particular is required"),
    supplier_management_id: Yup.string().required(
      "Supplier management is required"
    ),
    brand_id: Yup.string().required("Brand name is required"),
    select_type: Yup.string()
      .oneOf(["Credit", "Debit"], "Select type is required")
      .required("Select type is required"),

    Credit: Yup.number()
      .nullable()
      .when("select_type", {
        is: "Credit",
        then: (schema) =>
          schema
            .required("Credit is required")
            .min(0, "Credit cannot be negative")
            .positive("Credit must be positive")
            .typeError("Credit must be a number"),
        otherwise: (schema) => schema.notRequired(),
      }),

    Debit: Yup.number()
      .nullable()
      .when("select_type", {
        is: "Debit",
        then: (schema) =>
          schema
            .required("Debit is required")
            .min(0, "Debit cannot be negative")
            .positive("Debit must be positive")
            .typeError("Debit must be a number"),
        otherwise: (schema) => schema.notRequired(),
      }),
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
          perm.route?.toLowerCase() === pathname?.toLowerCase()
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
      setLoading(false); // ✅ Stop loader after API call
    }
  };

  useEffect(() => {
    setLoading(true); // reset loader each time route changes
    FETCHPERMISSION();
  }, [pathname]);

  // Fetch stock management
  const fetchStockManagement = () => {
    api
      .get("/api/v1/admin/stockManagement")
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
        console.error("Error fetching stock management:", err);
        setUserlist([]);
      });
  };

  useEffect(() => {
    fetchStockManagement();
  }, []);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [
          stockMaterialRes,
          stockParticularRes,
          supplierManagementRes,
          brandRes,
          customerRes,
        ] = await Promise.all([
          api.get("/api/v1/admin/stockMaterial"),
          api.get("/api/v1/admin/stockParticular"),
          api.get("/api/v1/admin/supplierManagement"),
          api.get("/api/v1/admin/brand/active"),
          api.get("/api/v1/admin/client"),
        ]);

        setMetaData({
          stockMaterial: stockMaterialRes.data.filter((d) => d.isActive),
          stockParticular: stockParticularRes.data.filter((d) => d.isActive),
          supplierManagement: supplierManagementRes.data.filter(
            (s) => s.isActive
          ),
          brand: brandRes?.data,
          customer: customerRes.data.data.filter((e) => e.isActive),
        });
        console.log("brandRes", brandRes.data);
      } catch (error) {
        errorToast("Error loading data");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const refetchStockMaterial = async () => {
    const res = await api.get("/api/v1/admin/stockMaterial");
    setMetaData((prev) => ({
      ...prev,
      stockMaterial: res.data.filter((d) => d.isActive),
    }));
  };

  // Fetch
  const fetchStockMaterialPag = async (page = 1) => {
    try {
      setLoading(true);
      const res = await api.get(
        `/api/v1/admin/stockManagement/pagination?page=${page}&limit=${itemsPerPage}`
      );

      setMaterialPagList(res.data?.data || []);
      //  Extract pagination info properly
      const pagination = res.data?.pagination;

      if (pagination) {
        setTotalPages(pagination.totalPages || 1);
      }
    } catch (err) {
      console.error("Error fetching leads:", err);
    } finally {
      setLoading(false);
    }
  };

  //  Fetch again when page changes
  useEffect(() => {
    fetchStockMaterialPag(currentPage);
  }, [currentPage]);

  // Toggle Active/Inactive with optimistic update
  const handleToggleActive = (id, currentStatus) => {
    const newStatus = !currentStatus;

    // Optimistic UI update
    setUserlist((prev) =>
      prev.map((dept) =>
        dept.id === id ? { ...dept, isActive: newStatus } : dept
      )
    );

    api
      .put(`/api/v1/admin/stockManagement/${id}`, { isActive: newStatus })
      .then(() => {
        successToast("Status updated successfully");
      })
      .catch((err) => {
        console.error("Update failed:", err);
        errorToast(err.response?.data?.message || "Failed to update status");
        // Rollback if API fails
        setUserlist((prev) =>
          prev.map((dept) =>
            dept.id === id ? { ...dept, isActive: currentStatus } : dept
          )
        );
      });
  };

  const onSubmit = (values) => {
    if (editId) {
      // Update
      setLoadingBtn(true);
      api
        .put(`/api/v1/admin/stockManagement/${editId}`, values)
        .then(() => {
          successToast("Stock management updated successfully");
          fetchStockManagement();
          handleResetForm();
        })
        .catch((err) => {
          console.error("Error updating stock management:", err);
          errorToast(
            err.response?.data?.message || "Failed to update stock management"
          );
        })
        .finally(() => {
          setLoadingBtn(false);
        });
    } else {
      if (values.Debit) {
        delete values.Credit;
        delete values.balance;
      }
      if (values.Credit) {
        delete values.Debit;
        delete values.balance;
      }
      if (values.supplier_management_id) {
        delete values.client_id;
      }
      if (values.client_id) {
        delete values.supplier_management_id;
      }
      // Add
      setLoadingBtn(true);
      api
        .post("/api/v1/admin/stockManagement", values)
        .then(() => {
          successToast("Stock management added successfully");
          fetchStockManagement();
          refetchStockMaterial();
          handleResetForm();
        })
        .catch((err) => {
          console.error("Error adding stock management:", err);
          errorToast(
            err.response?.data?.message || "Failed to add stock management"
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

  const { handleSubmit, resetForm, values, setFieldValue } = formik;

  // View
  const handleView = (notice) => {
    setViewData(notice);
    setShowView(true);
  };
  console.log("formik.values.remark", formik.values.remark);

  const handleEdit = (index) => {
    const stock_management = userlist[index];
    console.log("stock_management.remark", stock_management.remark);
    formik.setValues({
      Credit: null,
      Debit: null,
      remark: stock_management.remark,
      balance: stock_management.balance,
      stock_material_id: stock_management.stock_material_id,
      stock_particular_id: stock_management.stock_particular_id,
      supplier_management_id: stock_management.supplier_management_id,
      brand_id: stock_management.brand_id,
      client_id: stock_management.client_id,
      select_type: "Debit",
      serialNumbers: stock_management.serialNumbers,
    });
    setEditId(stock_management.id || stock_management._id);
    setShowAddEdit(true);
  };

  const handleDeleteConfirm = () => {
    if (!deleteId) return;
    setLoadingBtn(true);
    api
      .delete(`/api/v1/admin/stockManagement/${deleteId}`)
      .then(() => {
        successToast("Stock Management deleted successfully");
        fetchStockManagement();
        setShowDelete(false);
      })
      .catch((err) => {
        console.error("Error deleting stock management:", err);
        errorToast(
          err.response?.data?.message || "Failed to delete stock management"
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

  //  Loader
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

  console.log("stockMaterial", metaData.stockMaterial);

  const handleSerialModalOpen = () => {
    const count = parseInt(values.Credit, 10) || 0;
    let serials = values.serialNumbers;
    if (serials.length !== count) {
      serials = Array(count)
        .fill("")
        .map((_, i) => serials[i] || "");
    }
    setFieldValue("serialNumbers", serials);
    setShowSerialModal(true);
  };

  const handleSerialChange = (index, value) => {
    const updated = [...values.serialNumbers];
    updated[index] = value;
    setFieldValue("serialNumbers", updated);
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
              <h5 className="card-title fw-lighter">Stock Management</h5>
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
                      {/* <th>Credit</th> */}
                      {/* <th>Debit</th> */}
                      <th>Balance</th>
                      <th>Stock Material</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {materialPagList?.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center">
                          No Stock Available
                        </td>
                      </tr>
                    ) : (
                      materialPagList?.map((item, idx) => (
                        <tr key={item.id || item._id}>
                          <td>{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                          {/* <td>{item.Credit || "--"}</td> */}
                          {/* <td>{item.Debit || "--"}</td> */}
                          <td>{item.material.balance}</td>
                          <td>{item.material.material}</td>
                          <td>
                            <span
                              className={`status-dot ${
                                item.isActive ? "active" : "inactive"
                              }`}
                            ></span>
                            {item.isActive ? "Active" : "Inactive"}
                          </td>
                          <td className="d-flex align-items-center">
                            <Form.Check
                              type="switch"
                              id={`active-switch-${item.id}`}
                              checked={item.isActive === true}
                              onChange={() =>
                                handleToggleActive(item.id, item.isActive)
                              }
                            />
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

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <Pagination className="justify-content-center mt-3">
                  <Pagination.First
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                  />
                  {[...Array(totalPages)].map((_, i) => (
                    <Pagination.Item
                      key={i + 1}
                      active={i + 1 === currentPage}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </Pagination.Item>
                  ))}
                  <Pagination.Last
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                  />
                </Pagination>
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
        modalTitle={
          editId ? "Update Stock Management" : "Add New Stock Management"
        }
        buttonLabel={editId ? "Update" : "Save"}
        loading={loadingBtn}
        formik={formik}
        stockMaterial={metaData.stockMaterial}
        stockParticular={metaData.stockParticular}
        supplierManagement={metaData.supplierManagement}
        brand={metaData.brand}
        customer={metaData.customer}
        handleSerialModalOpen={handleSerialModalOpen}
        showSerialModal={showSerialModal}
        setShowSerialModal={setShowSerialModal}
        handleSerialChange={handleSerialChange}
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
        modalTitle="Delete Stock Management"
        modalMessage={
          deleteIndex !== null && userlist[deleteIndex]
            ? // ? `Are you sure you want to delete the stock management "${userlist[deleteIndex].id}"?`
              `Are you sure you want to delete this stock management?`
            : ""
        }
        loading={loadingBtn}
      />

      {/* View Modal */}
      {showView && viewData && (
        <ViewModal
          showView={showView}
          setShowView={setShowView}
          viewData={viewData}
        />
      )}
    </>
  );
};

export default StockManagementList;
