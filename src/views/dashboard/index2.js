// Created by: Rishiraj | Dashboard with Equal Box Height | 28 Oct 2025
import React, { useEffect, useState, memo, Fragment } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation } from "swiper";
import "swiper/swiper-bundle.min.css";
import axios from "../../api/axios";
import CountUp from "react-countup";
import Circularprogressbar from "../../components/circularprogressbar.js";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import GroupsIcon from "@mui/icons-material/Groups";
import ListAltIcon from "@mui/icons-material/ListAlt";
SwiperCore.use([Navigation]);

const Index2 = memo(() => {
  const [data, setData] = useState({
    totalLeads: 0,
    totalClients: 0,
    totalProjects: 0,
    totalEmployees: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          "/api/v1/admin/dashboard/dashboard/counts"
        );

        if (response.data.success) {
          setData(response.data.data);
        } else {
          setError("Failed to load dashboard data");
        }
      } catch (err) {
        setError(err?.response?.data?.message || "Network error");
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  const getProgress = (value, multiplier = 10) => {
    return Math.min(value * multiplier, 100);
  };

  const cardStyle = {
    height: "180px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const cardBodyStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    textAlign: "center",
  };

  return (
    <Fragment>
      {error && (
        <div className="alert alert-danger text-center" role="alert">
          {error}
        </div>
      )}

      <div className="overflow-hidden d-slider1">
        <Swiper
          className="p-0 m-0 mb-2 list-inline"
          slidesPerView={4}
          spaceBetween={32}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          breakpoints={{
            320: { slidesPerView: 1 },
            576: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            992: { slidesPerView: 4 },
          }}
        >
          {/* Total Leads */}
          <SwiperSlide
            className="card card-slide"
            style={{ ...cardStyle, height: "150px" }}
          >
            <div
              className="card-body d-flex align-items-center justify-content-center"
              style={cardBodyStyle}
            >
              <div className="progress-widget text-center">
                <Circularprogressbar
                  stroke="#3a57e8"
                  Linecap="rounded"
                  trailstroke="#ddd"
                  value={loading ? 0 : getProgress(data.totalLeads, 5)}
                  id="progress-leads"
                  style={{ width: "80px", height: "80px" }}
                >
                  <LeaderboardIcon />
                </Circularprogressbar>

                <div className="progress-detail mt-2">
                  <p className="mb-1 fw-semibold">Total Leads</p>
                  <h4 className="counter mb-0">
                    {loading ? (
                      <span className="spinner-border spinner-border-sm" />
                    ) : (
                      <CountUp end={data.totalLeads} duration={2} />
                    )}
                  </h4>
                </div>
              </div>
            </div>
          </SwiperSlide>

          {/* Total Clients */}
          <SwiperSlide
            className="card card-slide"
            style={{ ...cardStyle, height: "150px" }}
          >
            <div
              className="card-body d-flex align-items-center justify-content-center"
              style={cardBodyStyle}
            >
              <div className="progress-widget text-center">
                <Circularprogressbar
                  stroke="#4bc7d2"
                  Linecap="rounded"
                  trailstroke="#ddd"
                  value={loading ? 0 : getProgress(data.totalClients, 20)}
                  id="progress-clients"
                  style={{ width: "80px", height: "80px" }}
                >
                  <GroupsIcon />
                </Circularprogressbar>

                <div className="progress-detail mt-2">
                  <p className="mb-1 fw-semibold">Total Clients</p>
                  <h4 className="counter mb-0">
                    {loading ? (
                      <span className="spinner-border spinner-border-sm" />
                    ) : (
                      <CountUp end={data.totalClients} duration={2} />
                    )}
                  </h4>
                </div>
              </div>
            </div>
          </SwiperSlide>

          {/* Total Projects */}
          <SwiperSlide
            className="card card-slide"
            style={{ ...cardStyle, height: "150px" }}
          >
            <div
              className="card-body d-flex align-items-center justify-content-center"
              style={cardBodyStyle}
            >
              <div className="progress-widget text-center">
                <Circularprogressbar
                  stroke="#3a57e8"
                  Linecap="rounded"
                  trailstroke="#ddd"
                  value={loading ? 0 : getProgress(data.totalProjects, 25)}
                  id="progress-projects"
                  style={{ width: "80px", height: "80px" }}
                >
                  <ListAltIcon />
                </Circularprogressbar>

                <div className="progress-detail mt-2">
                  <p className="mb-1 fw-semibold">Total Projects</p>
                  <h4 className="counter mb-0">
                    {loading ? (
                      <span className="spinner-border spinner-border-sm" />
                    ) : (
                      <CountUp end={data.totalProjects} duration={2} />
                    )}
                  </h4>
                </div>
              </div>
            </div>
          </SwiperSlide>

          {/* Total Employees */}
          <SwiperSlide
            className="card card-slide"
            style={{ ...cardStyle, height: "150px" }}
          >
            <div
              className="card-body d-flex align-items-center justify-content-center"
              style={cardBodyStyle}
            >
              <div className="progress-widget text-center">
                <Circularprogressbar
                  stroke="#4bc7d2"
                  Linecap="rounded"
                  trailstroke="#ddd"
                  value={loading ? 0 : getProgress(data.totalEmployees, 15)}
                  id="progress-employees"
                  style={{ width: "80px", height: "80px" }}
                >
                  <GroupsIcon />
                </Circularprogressbar>

                <div className="progress-detail mt-2">
                  <p className="mb-1 fw-semibold">Total Employees</p>
                  <h4 className="counter mb-0">
                    {loading ? (
                      <span className="spinner-border spinner-border-sm" />
                    ) : (
                      <CountUp end={data.totalEmployees} duration={2} />
                    )}
                  </h4>
                </div>
              </div>
            </div>
          </SwiperSlide>

          <div className="swiper-button swiper-button-next"></div>
          <div className="swiper-button swiper-button-prev"></div>
        </Swiper>
      </div>
    </Fragment>
  );
});

export default Index2;
