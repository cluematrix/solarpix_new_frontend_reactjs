import React, { useState } from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import CreateTwoToneIcon from "@mui/icons-material/CreateTwoTone";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import AddEditLeaveModal from "./add-edit-modal";

const LeaveList = () => {
  // const [leaveList, setLeaveList] = useState([]);

  const [leaveList, setLeaveList] = useState([
    {
      employeeName: "John Doe",
      leaveType: "Casual",
      duration: "Full Day",
      date: "2025-08-10",
      reason: "Family function",
    },
    {
      employeeName: "Alice Johnson",
      leaveType: "Sick",
      duration: "First Half",
      date: "2025-08-12",
      reason: "Doctor appointment",
    },
    {
      employeeName: "Michael Brown",
      leaveType: "Earned",
      duration: "Multiple Days",
      date: "2025-08-15 to 2025-08-20",
      reason: "Vacation",
    },
  ]);

  const [editIndex, setEditIndex] = useState(null);
  const [showAddEdit, setShowAddEdit] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const handleSaveLeave = (data) => {
    if (editIndex !== null) {
      const updatedList = [...leaveList];
      updatedList[editIndex] = data;
      setLeaveList(updatedList);
    } else {
      setLeaveList([...leaveList, data]);
    }
    setEditIndex(null);
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setShowAddEdit(true);
  };

  const handleDelete = (index) => {
    setLeaveList(leaveList.filter((_, i) => i !== index));
  };

  return (
    <>
      <Row>
        <Col sm="12">
          <Card>
            <Card.Header className="d-flex justify-content-between">
              <h4 className="card-title">Leave Requests</h4>
              <Button
                className="btn-primary"
                onClick={() => setShowAddEdit(true)}
              >
                + Add Leave
              </Button>
            </Card.Header>

            <Card.Body className="px-0">
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Sr. No.</th>
                      <th>Employee</th>
                      <th>Leave Type</th>
                      <th>Duration</th>
                      <th>Date</th>
                      <th>Reason</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaveList.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center">
                          No leave requests available
                        </td>
                      </tr>
                    ) : (
                      leaveList.map((item, idx) => (
                        <tr key={idx}>
                          <td>{idx + 1}</td>
                          <td>{item.employeeName}</td>
                          <td>{item.leaveType}</td>
                          <td>{item.duration}</td>
                          <td>{item.date}</td>
                          <td>{item.reason}</td>
                          <td>
                            <CreateTwoToneIcon
                              className="me-2"
                              onClick={() => handleEdit(idx)}
                              color="primary"
                              style={{ cursor: "pointer" }}
                            />
                            <DeleteRoundedIcon
                              onClick={() => handleDelete(idx)}
                              color="error"
                              style={{ cursor: "pointer" }}
                            />
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <AddEditLeaveModal
        show={showAddEdit}
        handleClose={() => {
          setShowAddEdit(false);
          setEditIndex(null);
        }}
        onSave={handleSaveLeave}
        editData={editIndex !== null ? leaveList[editIndex] : null}
      />
    </>
  );
};

export default LeaveList;
