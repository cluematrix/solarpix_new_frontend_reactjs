import React, { memo, Fragment, useState, useEffect } from "react";
import { Row, Col, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "../../../../api/axios";
//img imports...
import topHeader from "../../../../assets/images/dashboard/top-header.png";
import topHeader1 from "../../../../assets/images/dashboard/top-header1.png";
import topHeader2 from "../../../../assets/images/dashboard/top-header2.png";
import topHeader3 from "../../../../assets/images/dashboard/top-header3.png";
import topHeader4 from "../../../../assets/images/dashboard/top-header4.png";
import topHeader5 from "../../../../assets/images/dashboard/top-header5.png";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { errorToast } from "../../../Toast/errorToast";

const SubHeader = memo(() => {
  const [time, setTime] = useState(new Date());
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState(null);
  const [clockOutTime, setClockOutTime] = useState(null);

  const employeeId = sessionStorage.getItem("employee_id");

  //  Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchTodayAttendance = async () => {
      try {
        const todayDate = new Date().toISOString().split("T")[0];
        const res = await axios.get(
          `/api/v1/admin/attendance?employee_id=${employeeId}&date=${todayDate}`
        );

        // Check if we got data for today
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          const todayAttendance = res.data[0];

          // clock_in exists
          if (todayAttendance.clock_in) {
            const clockInFormatted = new Date(
              `1970-01-01T${todayAttendance.clock_in}`
            ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

            setClockInTime(clockInFormatted);

            // clock_out exists?
            if (todayAttendance.clock_out) {
              const clockOutFormatted = new Date(
                `1970-01-01T${todayAttendance.clock_out}`
              ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

              setClockOutTime(clockOutFormatted);
              setIsClockedIn(false); // already clocked out
            } else {
              // still clocked in
              setIsClockedIn(true);
              setClockOutTime(null);
            }
          } else {
            // No clock in yet today
            setIsClockedIn(false);
            setClockInTime(null);
            setClockOutTime(null);
          }
        } else {
          // No attendance record today
          setIsClockedIn(false);
          setClockInTime(null);
          setClockOutTime(null);
        }
      } catch (err) {
        console.error("Error fetching attendance:", err);
      }
    };

    fetchTodayAttendance();
  }, [employeeId]);

  // 🚀 Handle Clock In
  // 🚀 Handle Clock In
  const handleClockIn = async () => {
    const now = new Date();
    const todayDate = now.toISOString().split("T")[0];
    const formattedClockIn = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    try {
      const res = await axios.post("/api/v1/admin/attendance", {
        employee_id: employeeId,
        clock_in: now.toTimeString().split(" ")[0],
        date: todayDate,
        isClock_in: true,
      });

      setIsClockedIn(true);
      setClockInTime(formattedClockIn);
      setClockOutTime(null);
    } catch (err) {
      errorToast(
        err.response.data.message || "You have already completed 2 shifts today"
      );
      console.error("Clock In failed:", err);
    }
  };

  // 🔄 Handle Clock Out
  const handleClockOut = async () => {
    const now = new Date();
    const todayDate = now.toISOString().split("T")[0];
    const formattedClockOut = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    try {
      const res = await axios.patch("/api/v1/admin/attendance/clock-out", {
        employee_id: employeeId,
        date: todayDate,
        clock_out: now.toTimeString().split(" ")[0],
        isClock_in: false,
      });

      // alert(res);
      if (res.data.success) {
        setIsClockedIn(false);
        setClockOutTime(formattedClockOut);
      }
    } catch (err) {
      console.error("Clock Out failed:", err);
    }
  };

  const formattedTime = time.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Fragment>
      <div className="iq-navbar-header" style={{ height: "250px" }}>
        <Container fluid className="iq-container">
          <Row>
            <Col md="12">
              <div className="d-flex justify-content-between flex-wrap align-items-center">
                <div>
                  <h1>Hello! SolarPix Team</h1>
                  <p>Empower Your Energy, Sustainably Managed.</p>
                </div>
                <div
                  className="text-end p-3 rounded shadow-sm"
                  style={{ minWidth: "100px" }}
                >
                  <h5 className="mb-0 text-white">
                    <b>{formattedTime}</b>
                  </h5>
                  <small className="d-block text-light">
                    {isClockedIn && clockInTime ? (
                      <>
                        Clock In at - <b>{clockInTime}</b>
                      </>
                    ) : clockOutTime ? (
                      <>
                        Clock Out at - <b>{clockOutTime}</b>
                      </>
                    ) : (
                      <span>Not Clocked In</span>
                    )}
                  </small>
                  <Link
                    to="#"
                    className={`btn ${
                      isClockedIn ? "btn-danger" : "btn-success"
                    } w-100 mt-2`}
                    onClick={() =>
                      isClockedIn ? handleClockOut() : handleClockIn()
                    }
                  >
                    {isClockedIn ? (
                      <>
                        <ExitToAppIcon className="me-1" /> Clock Out
                      </>
                    ) : (
                      <>
                        <ArrowForwardIcon className="me-1" /> Clock In
                      </>
                    )}
                  </Link>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
        <div className="iq-header-img">
          <img
            src={topHeader}
            alt="header"
            className="theme-color-default-img img-fluid w-100 h-100 animated-scaleX"
          />
          <img
            src={topHeader1}
            alt="header"
            className="theme-color-purple-img img-fluid w-100 h-100 animated-scaleX"
          />
          <img
            src={topHeader2}
            alt="header"
            className="theme-color-blue-img img-fluid w-100 h-100 animated-scaleX"
          />
          <img
            src={topHeader3}
            alt="header"
            className="theme-color-green-img img-fluid w-100 h-100 animated-scaleX"
          />
          <img
            src={topHeader4}
            alt="header"
            className="theme-color-yellow-img img-fluid w-100 h-100 animated-scaleX"
          />
          <img
            src={topHeader5}
            alt="header"
            className="theme-color-pink-img img-fluid w-100 h-100 animated-scaleX"
          />
        </div>
      </div>
    </Fragment>
  );
});

export default SubHeader;
