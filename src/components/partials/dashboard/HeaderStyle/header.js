import React, { useEffect, Fragment, memo } from "react";
import { Navbar, Container, Nav, Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import CustomToggle from "../../../dropdowns";
import { useNavigate } from "react-router-dom";

import avatars1 from "../../../../assets/images/avatars/01.png";

import Logo from "../../components/logo";
import "../../../../styles/header.css";
import { useSelector } from "react-redux";


import * as SettingSelector from "../../../../store/setting/selectors";

const Header = memo((props) => {
  const navbarHide = useSelector(SettingSelector.navbar_show); // array
  const headerNavbar = useSelector(SettingSelector.header_navbar);
  useEffect(() => {
    // navbarstylemode
    if (headerNavbar === "navs-sticky" || headerNavbar === "nav-glass") {
      window.onscroll = () => {
        if (document.documentElement.scrollTop > 50) {
          document.getElementsByTagName("nav")[0].classList.add("menu-sticky");
        } else {
          document
            .getElementsByTagName("nav")[0]
            .classList.remove("menu-sticky");
        }
      };
    }
  });

  //   rishi 06 Aug 2025
  const navigate = useNavigate();
  const handleLogout = () => {
    // Clear local storage
    localStorage.clear();
    sessionStorage.clear();
    document.cookie = "accessToken=; max-age=0; path=/;";
    navigate("/");
    // window.location.reload();
  };

  const minisidebar = () => {
    document.getElementsByTagName("ASIDE")[0].classList.toggle("sidebar-mini");
  };

  const user = JSON.parse(sessionStorage.getItem("user") || null);

  return (
    <Fragment>
      <Navbar
        expand="lg"
        variant="light"
        className={`nav iq-navbar fixed-top ${headerNavbar} ${navbarHide.join(
          " "
        )}`}
        style={{ padding: "2px 0px", marginTop: "0px" }}
      >
        <Container fluid className="navbar-inner">
          <Link to="/dashboard" className="navbar-brand">
            <Logo color={true} />
            <h4 className="logo-title">SolarPix</h4>
          </Link>
          <div
            className="sidebar-toggle"
            data-toggle="sidebar"
            data-active="true"
            onClick={minisidebar}
          >
            <i className="icon">
              <svg width="20px" height="20px" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z"
                />
              </svg>
            </i>
          </div>
          <Navbar.Toggle aria-controls="navbarSupportedContent">
            <span className="navbar-toggler-icon">
              <span className="mt-2 navbar-toggler-bar bar1"></span>
              <span className="navbar-toggler-bar bar2"></span>
              <span className="navbar-toggler-bar bar3"></span>
            </span>
          </Navbar.Toggle>
          <Navbar.Collapse id="navbarSupportedContent">
            <Nav
              as="ul"
              className="mb-2 ms-auto navbar-list mb-lg-0 align-items-center"
            >
              <Dropdown as="li" className="nav-item">
                <Dropdown.Toggle
                  as={CustomToggle}
                  variant=" nav-link py-0 d-flex align-items-center"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <img
                    src={user?.photo || avatars1} // fallback to avatars1 if no photo
                    alt="User-Profile"
                    className="img-fluid avatar avatar-40 avatar-rounded"
                  />

                  <div className="caption ms-2 d-none d-md-block ">
                    <h6 className="mb-0 caption-title">{user?.name || ""}</h6>
                    <p
                      className="mb-0 caption-sub-title"
                      style={{ fontSize: "12px" }}
                    >
                      {user?.designation?.name || "Employee"}
                    </p>
                  </div>
                </Dropdown.Toggle>
                <Dropdown.Menu
                  className="dropdown-menu-end"
                  aria-labelledby="navbarDropdown"
                >
                  <Dropdown.Item href="https://templates.iqonic.design/hope-ui/react/build/dashboard/app/user-profile">
                    Profile
                  </Dropdown.Item>
                  <Dropdown.Item href="https://templates.iqonic.design/hope-ui/react/build/dashboard/app/user-privacy-setting">
                    Privacy Setting
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </Fragment>
  );
});

export default Header;
