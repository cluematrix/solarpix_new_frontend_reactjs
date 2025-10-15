// Created by Sufyan | Modified by Rishi on 15 Oct 2025

import React from "react";
import { Modal, Button, Table, Form } from "react-bootstrap";
import { useFormik } from "formik";
import { FaEye } from "react-icons/fa";
import api from "../../../../api/axios";
import { successToast } from "../../../../components/Toast/successToast";
import { errorToast } from "../../../../components/Toast/errorToast";
import { kycDataOptions } from "../../../../mockData";

const KycModal = ({ show, handleClose, modalTitle, kycData, refetch }) => {
  console.log("kycData:", kycData);

  const formik = useFormik({
    initialValues: {
      kycStatus: kycData?.kyc_status || "",
    },
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        await api.put(`/api/v1/admin/client/${kycData.id}`, {
          kyc_status: values.kycStatus,
        });
        successToast("KYC updated successfully");
        refetch();
        handleClose();
      } catch (err) {
        errorToast(
          err.response?.data?.message || "Failed to update KYC status"
        );
      }
    },
  });

  const { values, handleChange, handleBlur, handleSubmit } = formik;

  // ✅ Render each dynamic document field
  const renderDynamicFieldValue = (field) => {
    if (!field) return "--";

    if (
      (field.data_type === "image" || field.data_type === "pdf") &&
      field.file_url
    ) {
      return (
        <a
          href={field.file_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary d-flex align-items-center"
        >
          <FaEye className="me-1" /> View {field.data_type.toUpperCase()}
        </a>
      );
    } else if (field.data_type === "text" || field.data_type === "number") {
      return field.value || "--";
    }

    return "--";
  };

  return (
    <Modal centered show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{modalTitle || "KYC Details"}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Table borderless className="mt-2">
          <tbody>
            {/* ✅ Dynamic Document Fields */}
            {kycData?.dynamic_fields &&
            Object.keys(kycData.dynamic_fields).length > 0 ? (
              Object.keys(kycData.dynamic_fields).map((key) => (
                <tr key={key}>
                  <td className="ps-0 fw-semibold">
                    {kycData.dynamic_fields[key].label}
                  </td>
                  <td className="ps-0">
                    {renderDynamicFieldValue(kycData.dynamic_fields[key])}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="ps-0">No documents available</td>
                <td className="ps-0">--</td>
              </tr>
            )}

            {/* ✅ KYC Status Dropdown */}
            <tr>
              <td className="ps-0 fw-semibold">KYC Status</td>
              <td className="ps-0">
                <Form onSubmit={handleSubmit}>
                  <Form.Select
                    name="kycStatus"
                    value={values.kycStatus}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    size="sm"
                    required
                    className="w-75"
                  >
                    <option value="">Select Status</option>
                    {kycDataOptions.map((status) => (
                      <option key={status.name} value={status.name}>
                        {status.icon} {status.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form>
              </td>
            </tr>
          </tbody>
        </Table>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="danger" onClick={handleSubmit}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default KycModal;
