import React, { useState, useEffect } from "react";
import { Card, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../../api/axios";
import * as Yup from "yup";
import { useFormik } from "formik";
import { successToast } from "../../../../components/Toast/successToast";
import { errorToast } from "../../../../components/Toast/errorToast";
import CustomizedSteppers from "./customizedSteppers";

// Created by: Sufyan 30 Sep 2025, updated 30/09/2025
const AddSupplier = () => {
  const { id } = useParams();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({});

  const initialValues = {
    salutation: "",
    name: "",
    company_name: "",
    email: "",
    display_name: "",
    phone: "",
    GST_treatment_id: "",
    source_of_supply: "",
    PAN: "",
    opening_balance: "",
    payment_term_id: "",
    TDS_id: "",
    document: null,
    GST: "",
    billing_city: "",
    billing_state: "",
    billing_address: "",
    billing_pincode: "",
    billing_phone: "",
    shipping_city: "",
    shipping_state: "",
    shipping_address: "",
    shipping_pincode: "",
    shipping_phone: "",
    account_holder_name: "",
    bank_name: "",
    account_number: "",
    IFSC_no: "",
    remark: "",
    ...formData,
  };

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [metaData, setMetaData] = useState({
    paymentTerm: [],
    gstTreatment: [],
    TDS: [],
  });

  const validationSchemas = [
    // Step 0: Basic Details
    Yup.object().shape({
      name: Yup.string().required("Name is required"),
      company_name: Yup.string().required("Company name is required"),
      display_name: Yup.string().required("Display name is required"),
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
      phone: Yup.string()
        .matches(/^\d{10}$/, "Phone must be 10 digits")
        .required("Phone is required"),
    }),

    // Step 1: Other Details
    Yup.object().shape({
      GST_treatment_id: Yup.string().required("GST Treatment is required"),
      source_of_supply: Yup.string().required("Source of supply is required"),
      PAN: Yup.string().required("PAN is required"),
      opening_balance: Yup.number()
        .typeError("Opening balance must be a number")
        .positive("Opening balance must be positive")
        .required("Opening balance is required"),
      payment_term_id: Yup.string().required("Payment term is required"),
      TDS_id: Yup.string().required("TDS is required"),
      GST: Yup.string().required("GST is required"),
      document: Yup.mixed()
        .nullable()
        .test("fileType", "Only PDF files are allowed", (value) => {
          if (typeof value === "string") return true; // for update string doc
          if (!value) return true;
          return ["application/pdf"].includes(value.type);
        })
        .notRequired(),
    }),

    // Step 2: Address (Billing and Shipping)
    Yup.object().shape({
      billing_city: Yup.string().required("Billing City is required"),
      billing_state: Yup.string().required("Billing State is required"),
      billing_address: Yup.string().required("Billing Address is required"),
      billing_pincode: Yup.string().required("Billing Pincode is required"),
      billing_phone: Yup.string()
        .matches(/^\d{10}$/, "Billing phone must be 10 digits")
        .required("Billing phone is required"),
      shipping_city: Yup.string().required("Shipping City is required"),
      shipping_state: Yup.string().required("Shipping State is required"),
      shipping_address: Yup.string().required("Shipping Address is required"),
      shipping_pincode: Yup.string().required("Shipping Pincode is required"),
      shipping_phone: Yup.string()
        .matches(/^\d{10}$/, "Shipping phone must be 10 digits")
        .required("Shipping phone is required"),
    }),

    // Step 3: Bank Details
    Yup.object().shape({
      account_holder_name: Yup.string().required(
        "Account holder name is required"
      ),
      bank_name: Yup.string().required("Bank name is required"),
      account_number: Yup.string()
        .matches(/^\d{11}$/, "AC no must be 11 digits")
        .required("Account number is required"),
      IFSC_no: Yup.string().required("IFSC no is required"),
      remark: Yup.string(),
    }),
  ];

  const onSubmit = async (values, { resetForm }) => {
    try {
      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        const value = values[key];
        if (value !== "" && value !== null && value !== undefined) {
          if (value instanceof File) {
            formData.append(key, value); // Appends "document" for the file
          } else if (typeof value === "object") {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value);
          }
        }
      });

      let res;
      if (id) {
        res = await api.put(`/api/v1/admin/supplierManagement/${id}`, formData);
        successToast(res.data.message || "Supplier updated successfully");
      } else {
        res = await api.post("/api/v1/admin/supplierManagement", formData);
        successToast(res.data.message || "Supplier added successfully");
      }

      resetForm();
      navigate("/supplier-management-list");
    } catch (err) {
      console.error("Error:", err);
      errorToast(err.response?.data?.message || "Failed to save supplier");
    }
  };
  const formik = useFormik({
    initialValues,
    validationSchema: validationSchemas[activeStep],
    enableReinitialize: true,
    onSubmit,
  });

  const getSupplierById = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/v1/admin/supplierManagement/${id}`);
      setFormData(res.data || {});
    } catch (error) {
      console.error("Fetch Supplier Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      getSupplierById();
    } else {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [paymentTermRes, gstTreatmentRes, tdsRes] = await Promise.all([
          api.get("/api/v1/admin/paymentTerm"),
          api.get("/api/v1/admin/gstTreatment"),
          api.get("/api/v1/admin/TDS"),
        ]);
        setMetaData({
          paymentTerm: paymentTermRes.data.data || paymentTermRes.data,
          gstTreatment: gstTreatmentRes.data.data || gstTreatmentRes.data,
          TDS: tdsRes.data.data || tdsRes.data,
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
      <div className="loader-div">
        <Spinner animation="border" className="spinner" />
      </div>
    );
  }

  return (
    <Card>
      <Card.Body className="pt-3">
        <CustomizedSteppers
          formik={formik}
          metaData={metaData}
          activeStep={activeStep}
          setActiveStep={setActiveStep}
          validationSchemas={validationSchemas}
        />
      </Card.Body>
    </Card>
  );
};

export default AddSupplier;
