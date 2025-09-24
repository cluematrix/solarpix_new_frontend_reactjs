// Created by: Sufyan 02 Sep 2025
import React, { useState, useEffect } from "react";
import { Card } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../../../api/axios";
import * as Yup from "yup";
import { useFormik } from "formik";
import { successToast } from "../../../../components/Toast/successToast";
import { errorToast } from "../../../../components/Toast/errorToast";
import CustomizedSteppers from "./customizedSteppers";

const AddProject = ({
  setShowMembersModal,
  handleClose,
  selectedMemberNames,
}) => {
  // Get formData from location state if available
  const location = useLocation();
  const formData = location.state?.formData || {};
  const [activeStep, setActiveStep] = React.useState(0);

  const initialValues = {
    short_code: "",
    project_name: "",
    is_deadline: false,
    start_date: "", // (date_of_contract)
    end_date: "",
    project_category_id: "",
    client_id: "",
    project_remarks: "",
    estimate: "",
    day_count: 0, // auto-calc (frontend show only)

    stock_material: [], // array of { product_id, qty }
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
    net_metering_sanction_letter: null, // file upload
    net_metering_sanction_letter_status: "",

    np_phone: "",
    np_reg_no: "",
    np_email: "",
    np_ref_code: "",

    rts_doc_upload: null, // file upload
    rts_doc_upload_status: "",
    disbursement: "", // boolean checkbox

    co_ordinate: "",
    structure_installer: "",
    panel_wiring_installer: "",
    sepl_inspection_by: "",
    sepl_inspection_date: "",
    sepl_inspection_remarks: "",

    ...formData, // Spread any existing formData to pre-fill
  };

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [employee, setEmployee] = useState([]);
  const [metaData, setMetaData] = useState({
    projectCategory: [],
    clientList: [],
    employeeList: [],
    project: [],
    stock: [],
  });

  const validationSchemas = [
    // Step-wise validation schemas (project info)
    Yup.object().shape({
      short_code: Yup.string().required("Short Code is required"),
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

    // Step-wise validation schemas (staff management info)
    Yup.object().shape({
      co_ordinate: Yup.string().required("Co-ordinate is required"),
      structure_installer: Yup.string().required(
        "Structure installer is required"
      ),
      panel_wiring_installer: Yup.string().required(
        "Panel wiring installer is required"
      ),
      sepl_inspection_by: Yup.string().required(
        "SEPL inspection by is required"
      ),
      sepl_inspection_date: Yup.date().required(
        "SEPL inspection date is required"
      ),
    }),
  ];

  const onSubmit = async (values, { resetForm }) => {
    try {
      const res = await api.post("/api/v1/admin/project", values);
      successToast(res.data.message || "Project added successfully");

      setMetaData({ project: res.data.data });
      resetForm();
      handleClose();
      navigate("/project-list");
    } catch (err) {
      console.error("Error adding employee:", err);
      errorToast(err.response?.data?.message || "Failed to add project");
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema: validationSchemas[activeStep],
    onSubmit,
  });

  const { values, setFieldValue } = formik;

  // fetch employee
  const fetchEmployee = async () => {
    try {
      const res = await api.get("/api/v1/admin/employee");
      setEmployee(res.data.data || []);
    } catch (err) {
      console.error("Error fetching employee:", err);
    }
  };

  useEffect(() => {
    fetchEmployee();
  }, []);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [projectCatRes, clientRes, empListRes, projectRes, stockRes] =
          await Promise.all([
            api.get("/api/v1/admin/projectCategory"),
            api.get("/api/v1/admin/client"),
            api.get("/api/v1/admin/employee"),
            api.get("/api/v1/admin/project"),
            api.get("/api/v1/admin/stockMaterial"),
          ]);
        setMetaData({
          projectCategory: projectCatRes.data.data.filter((d) => d.isActive),
          clientList: clientRes.data.data.filter((d) => d.isActive),
          employeeList: empListRes.data.data.filter((e) => e.isActive),
          project: projectRes.data.data.filter((e) => e.isActive),
          client: clientRes.data.data.filter((e) => e.isActive),
          stock: stockRes.data.filter((e) => e.isActive),
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

  useEffect(() => {
    const employee_id = String(sessionStorage.getItem("employee_id"));
    console.log("employee_id from sessionStorage", employee_id);
    console.log("values.assign_by", values.assign_by);
    if (formData?.projectMembers) {
      setFieldValue("assign_to", formData.projectMembers);
      setFieldValue("assign_by", employee_id);
    }
  }, [formData?.projectMembers, setFieldValue]);

  //generate next short_code
  useEffect(() => {
    // After metaData.project is loaded
    if (metaData.project && metaData.project.length > 0) {
      // Get last short_code (assuming sorted by creation)
      const lastShortCode = metaData.project[metaData.project.length - 1];
      let lastId = lastShortCode.short_code || "SOLAR000";
      // Extract number part
      let num = parseInt(lastId.replace("SOLAR", ""), 10);
      // Increment and pad with zeros
      let nextId = "SOLAR" + String(num + 1).padStart(3, "0");
      formik.setFieldValue("short_code", nextId);
    } else {
      // First project
      formik.setFieldValue("short_code", "SOLAR001");
    }
  }, [metaData.project]);

  return (
    <>
      <Card>
        <Card.Body className="pt-3">
          <CustomizedSteppers
            formik={formik}
            metaData={metaData}
            selectedMemberNames={selectedMemberNames}
            setShowMembersModal={setShowMembersModal}
            employee={employee}
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
