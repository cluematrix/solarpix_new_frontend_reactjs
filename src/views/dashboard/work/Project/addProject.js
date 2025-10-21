// Created by: Sufyan 02 Sep 2025
import React, { useState, useEffect } from "react";
import { Card, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../../api/axios";
import * as Yup from "yup";
import { useFormik } from "formik";
import { successToast } from "../../../../components/Toast/successToast";
import { errorToast } from "../../../../components/Toast/errorToast";
import CustomizedSteppers from "./customizedSteppers";

const AddProject = ({ setShowMembersModal, selectedMemberNames }) => {
  const { id } = useParams();
  const [activeStep, setActiveStep] = React.useState(0);
  const [formData, setFormData] = useState({});

  // mseb state
  const [msebField, setMsebField] = useState([]);
  const [NmField, setNmField] = useState([]);
  const [NpField, setNpField] = useState([]);

  const initialValues = {
    project_name: "",
    is_deadline: false,
    start_date: new Date().toISOString().split("T")[0], // (date_of_contract)
    end_date: "",
    project_category_id: "",
    client_id: "",
    project_remarks: "",
    estimate: "",
    day_count: 0, // auto-calc (frontend show only)

    item_details: null, // material info

    mseb_dynamic_fields: {}, // mseb
    net_metering_dynamic_fields: {}, // nm
    np_dynamic_fields: {}, // np

    // staff
    co_ordinate: [],
    structure_installer: [],
    panel_wiring_installer: [],
    sepl_inspection_by: [],
    sepl_inspection_date: new Date().toISOString().split("T")[0],
    sepl_inspection_remarks: "",
    status: "Approval",

    ...formData, // Spread any existing formData to pre-fill
  };

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [metaData, setMetaData] = useState({
    projectCategory: [],
    clientList: [],
    employeeList: [],
    project: [],
    stock: [],
    employee: [],
  });

  const validationSchemas = [
    // Step-wise validation schemas (project info)
    Yup.object().shape({
      project_name: Yup.string().required("Project Name is required"),
      start_date: Yup.date().required("Start Date is required"),
      is_deadline: Yup.boolean().default(false),
      end_date: Yup.date()
        .nullable()
        .when("is_deadline", (is_deadline, schema) => {
          return !is_deadline
            ? schema
                .required("End Date is required")
                .min(
                  Yup.ref("start_date"),
                  "End Date cannot be before Start Date"
                )
            : schema.nullable(); // if is_deadline is true, end_date not required
        }),
      project_category_id: Yup.string().required(
        "Project Category is required"
      ),
      client_id: Yup.string().required("Customer is required"),
      project_remarks: Yup.string().required("Project remarks is required"),
    }),

    // Step-wise validation schemas (material info)

    // Step-wise validation schemas (mseb info)

    // Step-wise validation schemas (net metering info)

    // Step-wise validation schemas (nodal point info)

    // Step-wise validation schemas (staff management info)
    // Yup.object().shape({
    //   co_ordinate: Yup.array()
    //     .of(Yup.string())
    //     .min(1, "Co-ordinate is required"),

    //   structure_installer: Yup.array()
    //     .of(Yup.string())
    //     .min(1, "Structure installer is required"),

    //   panel_wiring_installer: Yup.array()
    //     .of(Yup.string())
    //     .min(1, "Panel wiring installer is required"),

    //   sepl_inspection_by: Yup.array()
    //     .of(Yup.string())
    //     .min(1, "Sepl inspection by is required"),
    // }),
  ];

  const onSubmit = async (values, { resetForm }) => {
    try {
      const formData = new FormData();

      Object.keys(values).forEach((key) => {
        const value = values[key];

        if (value !== "" && value !== null && value !== undefined) {
          // ================================
          // Handle MSEB dynamic fields
          // ================================
          if (key === "mseb_dynamic_fields" && typeof value === "object") {
            const textFields = {};
            Object.keys(value).forEach((fieldName) => {
              const field = msebField.find((f) => f.field_name === fieldName);
              if (field) {
                if (
                  field.data_type === "text" ||
                  field.data_type === "number"
                ) {
                  if (value[fieldName]) {
                    textFields[fieldName] = value[fieldName];
                  }
                } else if (
                  (field.data_type === "image" || field.data_type === "pdf") &&
                  value[fieldName] instanceof File
                ) {
                  formData.append(fieldName, value[fieldName]);
                }
              }
            });
            if (Object.keys(textFields).length > 0) {
              formData.append(
                "mseb_dynamic_fields",
                JSON.stringify(textFields)
              );
            }
          }

          // ================================
          // Handle NM dynamic fields
          // ================================
          else if (
            key === "net_metering_dynamic_fields" &&
            typeof value === "object"
          ) {
            const textFields = {};
            Object.keys(value).forEach((fieldName) => {
              const field = NmField.find((f) => f.field_name === fieldName);
              if (field) {
                if (
                  field.data_type === "text" ||
                  field.data_type === "number"
                ) {
                  if (value[fieldName]) {
                    textFields[fieldName] = value[fieldName];
                  }
                } else if (
                  (field.data_type === "image" || field.data_type === "pdf") &&
                  value[fieldName] instanceof File
                ) {
                  formData.append(fieldName, value[fieldName]);
                }
              }
            });
            if (Object.keys(textFields).length > 0) {
              formData.append(
                "net_metering_dynamic_fields",
                JSON.stringify(textFields)
              );
            }
          }

          // ================================
          //  Handle NP dynamic fields
          // ================================
          else if (key === "np_dynamic_fields" && typeof value === "object") {
            const textFields = {};
            Object.keys(value).forEach((fieldName) => {
              const field = NpField.find((f) => f.field_name === fieldName);
              if (field) {
                if (
                  field.data_type === "text" ||
                  field.data_type === "number"
                ) {
                  if (value[fieldName]) {
                    textFields[fieldName] = value[fieldName];
                  }
                } else if (
                  (field.data_type === "image" || field.data_type === "pdf") &&
                  value[fieldName] instanceof File
                ) {
                  formData.append(fieldName, value[fieldName]);
                }
              }
            });
            if (Object.keys(textFields).length > 0) {
              formData.append("np_dynamic_fields", JSON.stringify(textFields));
            }
          }

          // ================================
          //  Handle other normal fields
          // ================================
          else if (Array.isArray(value) || typeof value === "object") {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value);
          }
        }
      });

      const res = await api.post("/api/v1/admin/project", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res?.data?.data?.id) {
        const payload = {
          item_details: formik.values.item_details,
          reference_id: res.data.data.id,
        };
        console.log("res", res?.data?.data?.id);
        try {
          await api.post(
            "/api/v1/admin/stockTransaction/debitStockSrNo",
            payload
          );
          navigate("/project-list");
          resetForm();
        } catch (error) {
          errorToast(error.response?.data?.message || "Failed to debit Sr No.");
        }
      } else {
        console.warn(
          "Project ID not found in response — skipping stock debit."
        );
      }

      successToast(res.data.message || "Project added successfully");
      resetForm();
      navigate("/project-list");
    } catch (err) {
      console.error("Error adding project:", err);
      errorToast(err.response?.data?.message || "Failed to add project");
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema: validationSchemas[activeStep],
    enableReinitialize: true,
    onSubmit,
  });

  //  Fetch project by ID
  const getProjectById = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/v1/admin/project/${id}`);
      setFormData(res.data.data || {});
    } catch (error) {
      console.error("Fetch Project Error:", error);
    } finally {
      setLoading(false);
    }
  };

  //  Call APIs after ID is available
  useEffect(() => {
    if (id) {
      getProjectById();
    } else {
      console.warn("ID not found in route params!");
    }
  }, [id]);

  // call all api
  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [projectCatRes, clientRes, empListRes] = await Promise.all([
          api.get("/api/v1/admin/projectCategory/active"),
          api.get("/api/v1/admin/client"),
          api.get("/api/v1/admin/employee/active"),
        ]);
        setMetaData({
          projectCategory: projectCatRes.data.data,
          clientList: clientRes.data.data.filter((d) => d.isActive),
          employeeList: empListRes.data.data,
        });
      } catch (error) {
        errorToast("Error loading data");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  // mseb dynamic field
  useEffect(() => {
    const fetchDynamicFieldsMseb = async () => {
      try {
        const res = await api.get("/api/v1/admin/msebField/active");
        setMsebField(res.data || []);
      } catch (err) {
        errorToast("Failed to load dynamic fields");
      }
    };
    fetchDynamicFieldsMseb();
  }, []);

  const handleDynamicChangeMseb = (fieldName, value) => {
    formik.setFieldValue(`mseb_dynamic_fields.${fieldName}`, value);
  };

  // NM dynamic field
  useEffect(() => {
    const fetchDynamicFieldsNm = async () => {
      try {
        const res = await api.get("/api/v1/admin/netMeteringField/active");
        setNmField(res.data || []);
      } catch (err) {
        errorToast("Failed to load dynamic fields");
      }
    };
    fetchDynamicFieldsNm();
  }, []);

  const handleDynamicChangeNm = (fieldName, value) => {
    formik.setFieldValue(`net_metering_dynamic_fields.${fieldName}`, value);
  };

  // NP dynamic field
  useEffect(() => {
    const fetchDynamicFieldsNp = async () => {
      try {
        const res = await api.get("/api/v1/admin/npField/active");
        setNpField(res.data || []);
      } catch (err) {
        errorToast("Failed to load dynamic fields");
      }
    };
    fetchDynamicFieldsNp();
  }, []);

  const handleDynamicChangeNp = (fieldName, value) => {
    formik.setFieldValue(`np_dynamic_fields.${fieldName}`, value);
  };

  if (loading) {
    return (
      <div className="loader-div">
        <Spinner animation="border" className="spinner" />
      </div>
    );
  }

  // console section
  console.log("formData in main:", formData);
  console.log(
    "formik.values.net_metering_sanction_letter",
    formik.values.net_metering_sanction_letter
  );
  console.log("formik.values", formik.values);
  console.log("formik.errors", formik.errors);
  console.log("msebField", msebField);
  console.log("employeeList", metaData.employeeList);
  return (
    <>
      <Card>
        <Card.Body className="pt-3">
          <CustomizedSteppers
            formik={formik}
            metaData={metaData}
            selectedMemberNames={selectedMemberNames}
            setShowMembersModal={setShowMembersModal}
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            validationSchemas={validationSchemas}
            msebField={msebField}
            NmField={NmField}
            NpField={NpField}
            handleDynamicChangeMseb={handleDynamicChangeMseb}
            handleDynamicChangeNm={handleDynamicChangeNm}
            handleDynamicChangeNp={handleDynamicChangeNp}
          />
        </Card.Body>
      </Card>
    </>
  );
};

export default AddProject;
