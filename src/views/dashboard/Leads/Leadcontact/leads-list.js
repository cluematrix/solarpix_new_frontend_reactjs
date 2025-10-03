import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Table,
  Spinner,
  Form,
  Pagination,
} from "react-bootstrap";
import CreateTwoToneIcon from "@mui/icons-material/CreateTwoTone";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import AddEditModal from "./add-edit-modal";
import DeleteModal from "./delete-modal";
import api from "../../../../api/axios";
import { useNavigate, useLocation } from "react-router-dom";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import Tooltip from "@mui/material/Tooltip";
import ViewModal from "./ViewModal";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { successToast } from "../../../../components/Toast/successToast";
import { errorToast } from "../../../../components/Toast/errorToast";

const LeadsList = () => {
  const [leadList, setLeadList] = useState([]);
  const [leadSources, setLeadSources] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingAPI, setLoadingAPI] = useState(false);
  const [leadStatus, setLeadStatus] = useState([]);

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [showView, setShowView] = useState(false);
  const [viewData, setViewData] = useState(null);

  const [permissions, setPermissions] = useState(null);

  // 🔹 Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // same as backend limit
  const [totalPages, setTotalPages] = useState(1);

  const [formData, setFormData] = useState({
    customerType: "Individual",
    companyName: "",
    salutation: "",
    name: "",
    amount: "",
    email: "",
    contact: "",
    leadSource: "",
    addedBy: "",
    leadOwner: "",
    city: "",
    state: "",
    pincode: "",
    reference: "",
    address: "",
    requirementType: "",
    capacity: "",
    status: "Progress",
    company_remark: "",
    customer_remark: "",
    last_call: "",
    priority: "",
    requirement_lead_id: "",
  });

  const [editIndex, setEditIndex] = useState(null);
  const [showAddEdit, setShowAddEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  // 🔑 Fetch Permission
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
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    FETCHPERMISSION();
  }, [pathname]);

  // Convert Lead to Customer
  const handleConvertToCustomer = (lead) => {
    navigate("/add-customer", { state: { leadData: lead } });
  };

  // Fetch dropdowns
  const fetchDropdowns = async () => {
    try {
      const [leadRes, empRes, cliRes, statusRes] = await Promise.all([
        api.get("/api/v1/admin/leadSource/active"),
        api.get("/api/v1/admin/employee/active"),
        api.get("/api/v1/admin/client/active"),
        // api.get("/api/v1/admin/requirementLead/active"),
        api.get("/api/v1/admin/leadStatus/active"),
      ]);

      setLeadSources(leadRes.data || []);
      if (empRes.data?.success) setEmployees(empRes.data.data || []);
      if (cliRes.data?.success) setClients(cliRes.data.data || []);
      setLeadStatus(statusRes.data.data || []);
    } catch (err) {
      console.error("Error fetching dropdowns:", err);
    }
  };

  // Fetch Leads
  const fetchLeads = async (page = 1) => {
    try {
      setLoading(true);
      const res = await api.get(
        `/api/v1/admin/lead/pagination?page=${page}&limit=${itemsPerPage}`
      );

      // ✅ Adjust this based on your backend response
      setLeadList(res.data?.data || []);
      setTotalPages(res.data?.totalPages || 1);
      // calculate totalCount from itemPerPage
      if (res.data?.pagination.total) {
        console.log("totalPageFun", res?.data?.pagination?.total);
        setTotalPages(Math.ceil(res?.data?.pagination?.total / itemsPerPage));
      }
    } catch (err) {
      console.error("Error fetching leads:", err);
    } finally {
      setLoading(false);
    }
  };

  console.log("totalPage", totalPages);
  useEffect(() => {
    fetchDropdowns();
    fetchLeads(currentPage);
  }, [currentPage]);

  const resetForm = () => {
    setFormData({
      customerType: "Individual",
      companyName: "",
      salutation: "",
      name: "",
      amount: "",
      email: "",
      contact: "",
      leadSource: "",
      addedBy: "",
      leadOwner: "",
      city: "",
      state: "",
      pincode: "",
      reference: "",
      address: "",
      requirementType: "",
      capacity: "",
      status: "Progress",
      company_remark: "",
      customer_remark: "",
      last_call: "",
      priority: "",
      requirement_lead_id: "",
      unit_id: "",
    });
    setEditIndex(null);
  };

  // Save lead
  const handleAddOrUpdateLead = async (data) => {
    console.log("dataEditTime", data);
    const payload = {
      customer_type: data.customerType,
      name: data.name,
      company_name: data.customerType === "Business" ? data.companyName : null,
      salutation: data.customerType === "Individual" ? data.salutation : null,
      email: data.email,
      contact: data.contact,
      lead_source: Number(data.leadSource),
      added_by: Number(data.addedBy),
      lead_owner: data.leadOwner ? Number(data.leadOwner) : null,
      city: data.city,
      state: data.state,
      amount: data.amount ? Number(data.amount) : null,
      pincode: data.pincode,
      reference: data.reference,
      address: data.address,
      requirement_type_id: Number(data.requirementType) || null,
      capacity: data.capacity ? Number(data.capacity) : null,
      status: data.status,
      company_remark: data.company_remark,
      customer_remark: data.customer_remark,
      last_call: data.last_call,
      priority: data.priority,
      requirement_lead_id: data.requirement_lead_id || "",
      unit_id: data.unit_id || "",
    };

    try {
      if (editIndex !== null) {
        setLoadingAPI(true);
        await api.put(`/api/v1/admin/lead/${leadList[editIndex].id}`, payload);
        successToast("Lead updated successfully");
      } else {
        setLoadingAPI(true);
        await api.post("/api/v1/admin/lead", payload);
        successToast("Lead created successfully");
      }
      fetchLeads();
      setShowAddEdit(false);
      resetForm();
    } catch (err) {
      setLoadingAPI(false);
      console.error("Error saving lead:", err);
      errorToast("Error while adding the lead");
    } finally {
      setLoadingAPI(false);
    }
  };

  const handleEdit = (index) => {
    const lead = leadList[index];
    console.log("leadEdit", lead);
    setFormData({
      customerType: lead.customer_type || "Individual",
      companyName: lead.company_name || "",
      name: lead.name || "",
      salutation:
        lead.customer_type === "Individual" ? lead.salutation || "" : "",
      amount: lead.amount || "",
      email: lead.email || "",
      contact: lead.contact || "",
      leadSource: lead.lead_source?.id || lead.lead_source || "",
      addedBy: lead.added_by?.id || lead.added_by || "",
      leadOwner: lead.lead_owner?.id || lead.lead_owner || "",
      city: lead.city || "",
      state: lead.state || "",
      pincode: lead.pincode || "",
      reference: lead.reference || "",
      address: lead.address || "",
      requirementType:
        lead.requirement_type_id?.id || lead.requirement_type_id || "",
      capacity: lead.capacity || "",
      status: lead.status || "",
      company_remark: lead.company_remark || "",
      customer_remark: lead.customer_remark || "",
      last_call: lead.last_call || "",
      priority: lead.priority || "",
      requirement_lead_id: lead.requirement_lead_id || "",
      unit_id: lead.unit_id || "",
    });
    setEditIndex(index);
    setShowAddEdit(true);
  };

  const handleDeleteConfirm = async () => {
    if (deleteIndex !== null) {
      try {
        setLoadingAPI(true);
        await api.delete(`/api/v1/admin/lead/${leadList[deleteIndex].id}`);
        successToast("Lead deleted successfully");
        fetchLeads();
      } catch (err) {
        setLoadingAPI(true);
        console.error("Error deleting lead:", err);
        errorToast("Error while deleting lead");
      } finally {
        setLoadingAPI(false);
      }
    }
    setShowDelete(false);
    setDeleteIndex(null);
  };

  // 🔹 Pagination Logic
  const indexOfLastItem = currentPage * totalPages;
  const indexOfFirstItem = indexOfLastItem - totalPages;
  // const totalPages = Math.ceil(leadList.length / itemsPerPage);

  // Loader while checking permissions
  if (loading && !permissions) {
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

  return (
    <>
      <Row className="mt-4">
        <Col sm="12">
          <Card>
            <Card.Header
              className="d-flex justify-content-between"
              style={{ padding: "15px 15px 0px 15px" }}
            >
              <h5 className="card-title fw-lighter">Leads Contact</h5>
              {permissions.add && (
                <Button
                  className="btn-primary"
                  onClick={() => {
                    resetForm();
                    setShowAddEdit(true);
                  }}
                >
                  + New
                </Button>
              )}
            </Card.Header>

            <Card.Body className="px-0">
              {loading ? (
                <div className="text-center py-3">
                  <Spinner animation="border" />
                </div>
              ) : (
                <div className="table-responsive">
                  <Table hover responsive className="table">
                    <thead>
                      <tr className="table-gray centered">
                        <th>Sr. No.</th>
                        <th>Name</th>
                        <th>Company Name</th>
                        <th>Priority</th>
                        <th>Status</th> {/* New column */}
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leadList?.length === 0 ? (
                        <tr>
                          <td colSpan="9" className="text-center">
                            No leads available
                          </td>
                        </tr>
                      ) : (
                        leadList?.map((item, idx) => (
                          <tr key={item.id}>
                            <td>
                              {(currentPage - 1) * itemsPerPage + idx + 1}
                            </td>
                            <td>{item.name}</td>
                            <td>{item.company_name || "Individual"}</td>

                            <td>
                              <Form.Select
                                size="sm"
                                value={item.priority || ""}
                                onChange={async (e) => {
                                  const newPriority = e.target.value;
                                  try {
                                    await api.put(
                                      `/api/v1/admin/lead/${item.id}`,
                                      {
                                        ...item,
                                        priority: newPriority,
                                      }
                                    );
                                    successToast(
                                      "Priority updated successfully"
                                    );
                                    setLeadList((prev) =>
                                      prev.map((lead) =>
                                        lead.id === item.id
                                          ? { ...lead, priority: newPriority }
                                          : lead
                                      )
                                    );
                                  } catch (err) {
                                    console.error(
                                      "Error updating priority:",
                                      err
                                    );
                                  }
                                  // errorToast(
                                  //   "Error while updating the priority"
                                  // );
                                }}
                              >
                                <option disabled value="">
                                  --
                                </option>
                                {[
                                  { id: "1", icon: "🟢", name: "High" },
                                  { id: "2", icon: "🟠", name: "Medium" },
                                  { id: "3", icon: "🔴", name: "Low" },
                                ].map((option) => (
                                  <option key={option.id} value={option.name}>
                                    {option.icon} {option.name}
                                  </option>
                                ))}
                              </Form.Select>
                            </td>

                            <td>
                              <Form.Select
                                size="sm"
                                value={item.status || "Progress"}
                                onChange={async (e) => {
                                  const newStatus = e.target.value;
                                  try {
                                    await api.put(
                                      `/api/v1/admin/lead/${item.id}`,
                                      {
                                        ...item,
                                        status: newStatus,
                                      }
                                    );
                                    successToast("Status updated successfully");
                                    setLeadList((prev) =>
                                      prev.map((lead) =>
                                        lead.id === item.id
                                          ? { ...lead, status: newStatus }
                                          : lead
                                      )
                                    );
                                  } catch (err) {
                                    console.error(
                                      "Error updating status:",
                                      err
                                    );
                                  }
                                }}
                              >
                                {leadStatus?.map((option) => (
                                  <option key={option.id} value={option.name}>
                                    {option.icon} {option.leadStatus_name}
                                  </option>
                                ))}
                              </Form.Select>
                            </td>

                            <td>
                              <VisibilityIcon
                                color="primary"
                                size="sm"
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                  setViewData(item);
                                  setShowView(true);
                                }}
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
                                    setDeleteIndex(indexOfFirstItem + idx);
                                    setShowDelete(true);
                                  }}
                                  color="error"
                                  style={{ cursor: "pointer" }}
                                />
                              )}
                              {clients.some(
                                (client) => client.lead_id === item.id
                              ) ? (
                                <Tooltip title="Already Customer">
                                  <span>
                                    <PersonAddIcon
                                      size="sm"
                                      style={{
                                        cursor: "not-allowed",
                                        color: "gray",
                                      }}
                                    />
                                  </span>
                                </Tooltip>
                              ) : (
                                <Tooltip title="Add to Customer">
                                  <PersonAddIcon
                                    size="sm"
                                    style={{
                                      cursor: "pointer",
                                      color: "blue",
                                    }}
                                    onClick={() =>
                                      handleConvertToCustomer(item)
                                    }
                                  />
                                </Tooltip>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </Table>

                  {/* 🔹 Pagination Controls */}
                  {totalPages > 1 && (
                    <Pagination className="justify-content-center mt-3">
                      <Pagination.First
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                      />
                      {/* <Pagination.Prev
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                      /> */}
                      {[...Array(totalPages)].map((_, i) => (
                        <Pagination.Item
                          key={i + 1}
                          active={i + 1 === currentPage}
                          onClick={() => setCurrentPage(i + 1)}
                        >
                          {i + 1}
                        </Pagination.Item>
                      ))}
                      {/* <Pagination.Next
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          )
                        }
                        disabled={currentPage === totalPages}
                      /> */}
                      <Pagination.Last
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={currentPage === totalPages}
                      />
                    </Pagination>
                  )}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Add/Edit Modal */}
      <AddEditModal
        show={showAddEdit}
        handleClose={() => {
          setShowAddEdit(false);
          resetForm();
        }}
        formData={formData}
        setFormData={setFormData}
        onSave={handleAddOrUpdateLead}
        editData={editIndex !== null}
        loadingAPI={loadingAPI}
      />
      <ViewModal
        show={showView}
        handleClose={() => {
          setShowView(false);
          setViewData(null);
        }}
        lead={viewData}
      />
      <DeleteModal
        show={showDelete}
        handleClose={() => {
          setShowDelete(false);
          setDeleteIndex(null);
        }}
        onConfirm={handleDeleteConfirm}
        modalTitle="Delete Lead"
        modalMessage={
          deleteIndex !== null
            ? `Are you sure you want to delete lead "${leadList[deleteIndex].name}"?`
            : ""
        }
        loadingAPI={loadingAPI}
      />
    </>
  );
};

export default LeadsList;
