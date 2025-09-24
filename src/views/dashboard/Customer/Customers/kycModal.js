import React from "react";
import { Modal, Button, Table, Form } from "react-bootstrap";
import { useFormik } from "formik";
import { kycDataOptions } from "../../../../mockData";
import api from "../../../../api/axios";
import { successToast } from "../../../../components/Toast/successToast";
import { errorToast } from "../../../../components/Toast/errorToast";
import { FaEye } from "react-icons/fa";

const KycModal = ({
  show,
  handleClose,
  onConfirm,
  modalTitle,
  kycData,
  refetch,
}) => {
  console.log("kycData", kycData);
  const initialValues = {
    kycStatus: kycData?.kyc_status || "",
  };

  const onSubmit = () => {
    api
      .put(`/api/v1/admin/client/${kycData.id}`, {
        kyc_status: values.kycStatus,
      })
      .then(() => {
        console.log("workingKycModal");
        successToast("Kyc updated successfully");
        refetch();
        handleClose();
      })
      .catch((err) => {
        errorToast(
          err.response?.data?.message || "Failed to update customer status"
        );
      });
  };

  const formik = useFormik({
    initialValues,
    onSubmit,
    enableReinitialize: true,
  });

  const { values, handleChange, handleBlur, handleSubmit } = formik;

  console.log("valuesKycModal", values.kycStatus);
  return (
    <Modal centered show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{modalTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Table borderless className="mt-3">
          <tbody>
            <tr>
              <td className="ps-0">Aadhaar Card</td>
              <td className="ps-0">
                {kycData?.doc_upload ? (
                  <a
                    href={kycData.doc_upload}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary d-flex align-items-center"
                  >
                    <FaEye className="me-1" />
                  </a>
                ) : (
                  "--"
                )}
              </td>
            </tr>

            <tr>
              <td className="ps-0">Pan Card</td>
              <td className="ps-0">
                {kycData?.extra_doc ? (
                  <a
                    href={kycData.extra_doc}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary d-flex align-items-center"
                  >
                    <FaEye className="me-1" />
                  </a>
                ) : (
                  "--"
                )}
              </td>
            </tr>

            <tr>
              <td className="ps-0">Electricity Bill</td>
              <td className="ps-0">
                {kycData?.electric_bill ? (
                  <a
                    href={kycData.electric_bill}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary d-flex align-items-center"
                  >
                    <FaEye className="me-1" />
                  </a>
                ) : (
                  "--"
                )}
              </td>
            </tr>

            <tr>
              <td className="ps-0">NOC / Sale Deed</td>
              <td className="ps-0">
                {kycData?.extra_file ? (
                  <a
                    href={kycData.extra_file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary d-flex align-items-center"
                  >
                    <FaEye className="me-1" />
                  </a>
                ) : (
                  "--"
                )}
              </td>
            </tr>
            <tr>
              <td className="ps-0">Kyc Status</td>
              <td className="ps-0">
                <Form onSubmit={handleSubmit}>
                  <Form.Select
                    name="kycStatus"
                    value={values?.kycStatus}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    size="sm"
                    required
                    className="w-50"
                  >
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
