import React from "react";
import { Modal, Button, Table, Form } from "react-bootstrap";
import { useFormik } from "formik";
import { kycDataOptions } from "../../../../mockData";
import api from "../../../../api/axios";
import { successToast } from "../../../../components/Toast/successToast";
import { errorToast } from "../../../../components/Toast/errorToast";

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
    kyc_status: kycData?.kyc_status || "",
  };

  const onSubmit = () => {
    api
      .put(`/api/v1/admin/client/${kycData.id}`, {
        kyc_status: values.kyc_status,
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
  });

  const { values, handleChange, handleBlur, handleSubmit } = formik;
  return (
    <Modal centered show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{modalTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Table borderless className="mt-3">
          <tbody>
            <tr>
              <td className="ps-0">Document No</td>
              <td className="ps-0">{kycData?.doc_no || "--"}</td>
            </tr>
            <tr>
              <td className="ps-0">View Document</td>
              {kycData?.doc_upload ? (
                <td className="ps-0">
                  <a
                    href={kycData?.doc_upload}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View PDF
                  </a>
                </td>
              ) : (
                "--"
              )}
            </tr>
            <tr>
              <td className="ps-0">Kyc Status</td>
              <td className="ps-0">
                <Form onSubmit={handleSubmit}>
                  <Form.Select
                    name="kyc_status"
                    value={values?.kyc_status || ""}
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
