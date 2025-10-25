import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Table,
  Pagination,
  Spinner,
} from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../../../api/axios";
import AddEditModal from "./AddEditModal";
import CreateTwoToneIcon from "@mui/icons-material/CreateTwoTone";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { successToast } from "../../../../components/Toast/successToast";
import { errorToast } from "../../../../components/Toast/errorToast";

// validation
const validationSchema = Yup.object().shape({
  employee_id: Yup.string().required("Employee is required"),
  warehouse_name: Yup.string().required("Warehouse name is required"),
  address: Yup.string().required("Address is required"),
  city: Yup.string().required("City is required"),
  pincode: Yup.string().required("Pincode is required"),
});

const initialValues = {
  employee_id: "",
  warehouse_name: "",
  address: "",
  city: "",
  pincode: "",
};

const WarehouseList = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const dataPerPage = 5;

  // ✅ fetch employees
  useEffect(() => {
    api
      .get("/api/v1/admin/employee/active")
      .then((res) => {
        console.log(res);
        if (Array.isArray(res.data.data)) {
          setEmployeeOptions(res.data.data);
        } else if (Array.isArray(res.data.data)) {
          setEmployeeOptions(res.data.data);
        } else {
          setEmployeeOptions([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching employees:", err);
        setEmployeeOptions([]);
      });
  }, []);

  // ✅ fetch warehouses
  const fetchWarehouses = () => {
    api
      .get("/api/v1/admin/warehouse")
      .then((res) => {
        if (Array.isArray(res.data)) {
          setWarehouses(res.data);
        } else if (Array.isArray(res.data.data)) {
          setWarehouses(res.data.data);
        } else {
          setWarehouses([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching warehouses:", err);
        setWarehouses([]);
      });
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  // ✅ formik
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      setLoadingBtn(true);
      if (editId) {
        api
          .put(`/api/v1/admin/warehouse/${editId}`, values)
          .then(() => {
            successToast("Warehouse updated successfully");
            fetchWarehouses();
            handleResetForm();
          })
          .catch((err) => {
            errorToast(
              err.response?.data?.message || "Failed to update warehouse"
            );
          })
          .finally(() => setLoadingBtn(false));
      } else {
        api
          .post("/api/v1/admin/warehouse", values)
          .then(() => {
            successToast("Warehouse added successfully");
            fetchWarehouses();
            handleResetForm();
          })
          .catch((err) => {
            errorToast(
              err.response?.data?.message || "Failed to add warehouse"
            );
          })
          .finally(() => setLoadingBtn(false));
      }
    },
  });

  // ✅ reset form
  const handleResetForm = () => {
    formik.resetForm();
    setEditId(null);
    setShowModal(false);
  };

  // ✅ edit
  const handleEdit = (warehouse) => {
    setEditId(warehouse.id || warehouse._id);
    formik.setValues({
      employee_id: warehouse.employee_id || "",
      warehouse_name: warehouse.warehouse_name || "",
      address: warehouse.address || "",
      city: warehouse.city || "",
      pincode: warehouse.pincode || "",
    });
    setShowModal(true);
  };

  // ✅ delete confirm
  const handleDeleteConfirm = () => {
    if (!deleteId) return;
    api
      .delete(`/api/v1/admin/warehouse/${deleteId}`)
      .then(() => {
        successToast("Warehouse deleted successfully");
        fetchWarehouses();
        setShowDelete(false);
      })
      .catch((err) => {
        console.error("Delete failed:", err);
        errorToast("Failed to delete warehouse");
      });
  };

  // ✅ toggle status
  const handleToggleStatus = (warehouse) => {
    api
      .put(`/api/v1/admin/warehouse/${warehouse.id || warehouse._id}`, {
        isActive: !warehouse.isActive,
      })
      .then(() => {
        successToast("Status updated successfully");
        fetchWarehouses();
      })
      .catch((err) => {
        console.error("Status update failed:", err);
        errorToast("Failed to update status");
      });
  };

  // ✅ pagination
  const indexOfLast = currentPage * dataPerPage;
  const indexOfFirst = indexOfLast - dataPerPage;
  const currentData = warehouses.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(warehouses.length / dataPerPage);

  console.log("employeeOptions", employeeOptions);
  return (
    <>
      <Card>
        <Card.Header>
          <Row>
            <Col>
              <h5>Warehouse List</h5>
            </Col>
            <Col className="text-end">
              <Button onClick={() => setShowModal(true)}>
                + Add Warehouse
              </Button>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body>
          {warehouses.length === 0 ? (
            <p>No warehouses found</p>
          ) : (
            <Table bordered hover>
              <thead>
                <tr className="table-gray">
                  <th>Sr. No.</th>
                  <th>Employee</th>
                  <th>Warehouse Name</th>
                  <th>Address</th>
                  <th>City</th>
                  <th>Pincode</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((item, idx) => {
                  const emp = employeeOptions.find(
                    (e) => (e.id || e._id) === item.employee_id
                  );
                  return (
                    <tr key={item.id || item._id}>
                      <td>{indexOfFirst + idx + 1}</td>
                      <td>{emp ? emp.name : "-"}</td>
                      <td>{item.warehouse_name}</td>
                      <td>{item.address}</td>
                      <td>{item.city}</td>
                      <td>{item.pincode}</td>
                      <td>
                        <span
                          onClick={() => handleToggleStatus(item)}
                          style={{
                            cursor: "pointer",
                            color: item.isActive ? "green" : "red",
                          }}
                        >
                          {item.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        <Button
                          variant="light"
                          size="sm"
                          onClick={() => handleEdit(item)}
                        >
                          <CreateTwoToneIcon />
                        </Button>{" "}
                        <Button
                          variant="light"
                          size="sm"
                          onClick={() => {
                            setDeleteId(item.id || item._id);
                            setShowDelete(true);
                          }}
                        >
                          <DeleteRoundedIcon />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          )}
          {totalPages > 1 && (
            <Pagination>
              {Array.from({ length: totalPages }, (_, i) => (
                <Pagination.Item
                  key={i + 1}
                  active={i + 1 === currentPage}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </Pagination.Item>
              ))}
            </Pagination>
          )}
        </Card.Body>
      </Card>

      {/* ✅ Add/Edit Modal */}
      <AddEditModal
        show={showModal}
        handleClose={handleResetForm}
        onSave={formik.handleSubmit}
        modalTitle={editId ? "Edit Warehouse" : "Add Warehouse"}
        buttonLabel={editId ? "Update" : "Add"}
        loading={loadingBtn}
        formik={formik}
        employeeOptions={employeeOptions}
      />

      {/* ✅ Delete Confirm */}
      {/* <DeleteConfirmation
        show={showDelete}
        onHide={() => setShowDelete(false)}
        onConfirm={handleDeleteConfirm}
      /> */}
    </>
  );
};

export default WarehouseList;
