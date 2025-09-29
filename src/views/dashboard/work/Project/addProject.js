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

  const initialValues = {
    project_name: "",
    is_deadline: false,
    start_date: "", // (date_of_contract)
    end_date: "",
    project_category_id: "",
    client_id: "",
    project_remarks: "",
    estimate: "",
    day_count: 0, // auto-calc (frontend show only)

    stock_material: [], // array of { stock_id, qty }
    company_name: "",
    capacity: "",

    mseb_consumer_no: "",
    mseb_phone: "",
    mseb_email: "",
    mseb_nsc: "",

    additional_load_id: "",
    additional_load_date: "",

    net_metering_app_id: "",
    net_metering_app_date: "",
    net_metering_sanction_letter: "", // file upload
    net_metering_sanction_status: "Pending",

    np_phone: "",
    np_reg_no: "",
    np_email: "",
    np_ref_code: "",

    rts_doc_upload: "", // file upload
    rts_doc_upload_status: "Pending",
    disbursement: "Pending", // boolean checkbox

    co_ordinate: [],
    structure_installer: [],
    panel_wiring_installer: [],
    sepl_inspection_by: [],
    sepl_inspection_date: "",
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
      estimate: Yup.number()
        .typeError("Project estimate must be a number")
        .positive("Project estimate must be positive")
        .required("Project estimate is required"),
    }),

    // Step-wise validation schemas (material info)
    Yup.object().shape({
      stock_material: Yup.array()
        .min(1, "At least one stock material must be selected")
        .required("Stock material are required"),
      company_name: Yup.string().required("Company Name is required"),
      capacity: Yup.string().required("Capacity is required"),
    }),

    // Step-wise validation schemas (mseb info)
    Yup.object().shape({
      mseb_phone: Yup.number()
        .typeError("Phone must be a number")
        .min(1000000000, "Phone must be 10 digits")
        .max(9999999999, "Phone must be 10 digits"),

      mseb_email: Yup.string().email("Invalid email format"),
    }),

    // Step-wise validation schemas (net metering info)
    Yup.object().shape({
      net_metering_sanction_letter: Yup.mixed()
        .nullable()
        .test("fileType", "Only Pdf files are allowed", (value) => {
          if (!value) return true;
          return ["application/pdf"].includes(value.type);
        })
        .notRequired(),
    }),

    // Step-wise validation schemas (nodal point info)
    Yup.object().shape({
      np_phone: Yup.number()
        .typeError("Phone must be a number")
        .min(1000000000, "Phone must be 10 digits")
        .max(9999999999, "Phone must be 10 digits"),

      np_email: Yup.string().email("Invalid email format"),

      rts_doc_upload: Yup.mixed()
        .nullable()
        .test("fileType", "Only Pdf files are allowed", (value) => {
          if (!value) return true;
          return ["application/pdf"].includes(value.type);
        })
        .notRequired(),
    }),

    // Step-wise validation schemas (staff management info)
    Yup.object().shape({
      co_ordinate: Yup.array()
        .of(Yup.string())
        .min(1, "Co-ordinate is required"),

      structure_installer: Yup.array()
        .of(Yup.string())
        .min(1, "Structure installer is required"),

      panel_wiring_installer: Yup.array()
        .of(Yup.string())
        .min(1, "Panel wiring installer is required"),

      sepl_inspection_by: Yup.array()
        .of(Yup.string())
        .min(1, "Sepl inspection by is required"),
    }),
  ];

  const onSubmit = async (values, { resetForm }) => {
    try {
      console.log("Submitting values:", values);
      const formData = new FormData();

      Object.keys(values).forEach((key) => {
        const value = values[key];
        if (value !== "" && value !== null && value !== undefined) {
          if (value instanceof File) {
            formData.append(key, value); // file
          } else if (typeof value === "object") {
            formData.append(key, JSON.stringify(value)); // fix
          } else {
            formData.append(key, value);
          }
        }
      });

      const res = await api.post("/api/v1/admin/project", formData);
      successToast(res.data.message || "Project added successfully");

      setMetaData({ project: res.data.data });
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

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [
          projectCatRes,
          clientRes,
          empListRes,
          projectRes,
          stockRes,
          empRes,
        ] = await Promise.all([
          api.get("/api/v1/admin/projectCategory"),
          api.get("/api/v1/admin/client"),
          api.get("/api/v1/admin/employee"),
          api.get("/api/v1/admin/project"),
          api.get("/api/v1/admin/stockMaterial"),
          api.get("/api/v1/admin/employee"),
        ]);
        setMetaData({
          projectCategory: projectCatRes.data.data.filter((d) => d.isActive),
          clientList: clientRes.data.data.filter((d) => d.isActive),
          employeeList: empListRes.data.data.filter((e) => e.isActive),
          project: projectRes.data.data.filter((e) => e.isActive),
          client: clientRes.data.data.filter((e) => e.isActive),
          stock: stockRes.data.filter((e) => e.isActive),
          employee: empRes.data.data.filter((e) => e.isActive),
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

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }
  console.log("formData in main:", formData);
  console.log(
    "formik.values.net_metering_sanction_letter",
    formik.values.net_metering_sanction_letter
  );
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
          />
        </Card.Body>
      </Card>
    </>
  );
};

export default AddProject;
