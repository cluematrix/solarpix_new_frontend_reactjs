import React, { useEffect, useState } from "react";
import { Modal, Table, Spinner, Alert, Image } from "react-bootstrap";
import api from "../../../../api/axios";

const SalaryHistoryModal = ({ show, handleClose, employee }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (show && employee) fetchHistory();
  }, [show, employee]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await api.get(
        `/api/v1/admin/employeeSalary/employees/${employee.id}/increment-history`
      );
      setHistory(res?.data?.data || []);
    } catch (error) {
      console.error("Error fetching increment history:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (val) => {
    if (!val) return "--";
    return `₹${parseFloat(val).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
    })}`;
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold">View Salary History</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" />
          </div>
        ) : history.length === 0 ? (
          <Alert variant="info" className="text-center">
            No salary history found.
          </Alert>
        ) : (
          <>
            {/* Employee Info */}
            <div className="d-flex align-items-center mb-3">
              <Image
                src={employee.photo || "/default-avatar.png"}
                roundedCircle
                width={50}
                height={50}
                className="me-3"
              />
              <div>
                <h6 className="mb-0 fw-semibold">{employee.name}</h6>
                <small className="text-muted">
                  {employee.designation?.name || "--"}
                </small>
              </div>
            </div>

            {/* Salary History Table */}
            <Table
              bordered
              hover
              size="sm"
              className="align-middle text-center"
            >
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Total Annual (₹)</th>
                  <th>Change (Annual)</th>
                  <th>Total Monthly (₹)</th>
                  <th>Change (Monthly)</th>
                  <th>Value Type</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item, index) => {
                  const annualChange =
                    item.annual_amount && item.annual_amount !== "null"
                      ? `+ ${formatAmount(item.annual_amount)}`
                      : "--";

                  const monthlyChange =
                    item.previous_monthly &&
                    item.total_monthly &&
                    parseFloat(item.total_monthly) -
                      parseFloat(item.previous_monthly) !==
                      0
                      ? `+ ₹${(
                          parseFloat(item.total_monthly) -
                          parseFloat(item.previous_monthly)
                        ).toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                        })}`
                      : "--";

                  return (
                    <tr key={item.id}>
                      <td>{index + 1}</td>
                      <td>{formatAmount(item.total_annual)}</td>
                      <td>{annualChange}</td>
                      <td>{formatAmount(item.total_monthly)}</td>
                      <td>{monthlyChange}</td>
                      <td
                        className={
                          item.value_type === "Increment"
                            ? "text-success"
                            : item.value_type === "Decrement"
                            ? "text-danger"
                            : "text-secondary"
                        }
                      >
                        {item.value_type == "null"
                          ? "Initial"
                          : item.value_type}
                      </td>

                      <td>
                        {new Date(item.increment_date).toLocaleDateString(
                          "en-GB"
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default SalaryHistoryModal;
