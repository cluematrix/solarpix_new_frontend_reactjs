import React, { useState, useContext, memo, Fragment } from "react";
import { Link, useLocation } from "react-router-dom";
import ApartmentIcon from "@mui/icons-material/Apartment";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import BrowseGalleryIcon from "@mui/icons-material/BrowseGallery";
import TimeToLeaveIcon from "@mui/icons-material/TimeToLeave";
import TaskIcon from "@mui/icons-material/Task";
import AccessibilityIcon from "@mui/icons-material/Accessibility";
import GroupsIcon from "@mui/icons-material/Groups";
import WorkIcon from "@mui/icons-material/Work";
import ListAltIcon from "@mui/icons-material/ListAlt";
import PeopleIcon from "@mui/icons-material/People";
import KeyIcon from "@mui/icons-material/Key";
import FormatListBulletedSharpIcon from "@mui/icons-material/FormatListBulletedSharp";
import WarehouseSharpIcon from "@mui/icons-material/WarehouseSharp";
import CurrencyRupeeSharpIcon from "@mui/icons-material/CurrencyRupeeSharp";
import AccountBalanceWalletSharpIcon from "@mui/icons-material/AccountBalanceWalletSharp";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import ContactEmergencyIcon from "@mui/icons-material/ContactEmergency";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

import {
  Accordion,
  useAccordionButton,
  AccordionContext,
} from "react-bootstrap";

function CustomToggle({ children, eventKey, onClick }) {
  const { activeEventKey } = useContext(AccordionContext);

  const decoratedOnClick = useAccordionButton(eventKey, (active) =>
    onClick({ state: !active, eventKey: eventKey })
  );

  const isCurrentEventKey = activeEventKey === eventKey;

  return (
    <Link
      to="#"
      aria-expanded={isCurrentEventKey ? "true" : "false"}
      className="nav-link"
      role="button"
      onClick={(e) => {
        decoratedOnClick(isCurrentEventKey);
      }}
    >
      {children}
    </Link>
  );
}

const VerticalNav = memo((props) => {
  const [activeMenu, setActiveMenu] = useState(false);
  const [active, setActive] = useState("");
  //location
  let location = useLocation();
  return (
    <Fragment>
      <Accordion as="ul" className="navbar-nav iq-main-menu">
        {/* <li className="nav-item static-item">
          <Link className="nav-link static-item disabled" to="#" tabIndex="-1">
            <span className="default-icon">Home</span>
            <span className="mini-icon">-</span>
          </Link>
        </li> */}
        <li
          className={`${
            location.pathname === "/dashboard" ? "active" : ""
          } nav-item `}
        >
          <Link
            className={`${
              location.pathname === "/dashboard" ? "active" : ""
            } nav-link `}
            aria-current="page"
            to="/dashboard"
            onClick={() => {}}
          >
            <i className="icon">
              <svg
                width="17"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  opacity="0.4"
                  d="M16.0756 2H19.4616C20.8639 2 22.0001 3.14585 22.0001 4.55996V7.97452C22.0001 9.38864 20.8639 10.5345 19.4616 10.5345H16.0756C14.6734 10.5345 13.5371 9.38864 13.5371 7.97452V4.55996C13.5371 3.14585 14.6734 2 16.0756 2Z"
                  fill="currentColor"
                ></path>
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M4.53852 2H7.92449C9.32676 2 10.463 3.14585 10.463 4.55996V7.97452C10.463 9.38864 9.32676 10.5345 7.92449 10.5345H4.53852C3.13626 10.5345 2 9.38864 2 7.97452V4.55996C2 3.14585 3.13626 2 4.53852 2ZM4.53852 13.4655H7.92449C9.32676 13.4655 10.463 14.6114 10.463 16.0255V19.44C10.463 20.8532 9.32676 22 7.92449 22H4.53852C3.13626 22 2 20.8532 2 19.44V16.0255C2 14.6114 3.13626 13.4655 4.53852 13.4655ZM19.4615 13.4655H16.0755C14.6732 13.4655 13.537 14.6114 13.537 16.0255V19.44C13.537 20.8532 14.6732 22 16.0755 22H19.4615C20.8637 22 22 20.8532 22 19.44V16.0255C22 14.6114 20.8637 13.4655 19.4615 13.4655Z"
                  fill="currentColor"
                ></path>
              </svg>
            </i>
            <span className="item-name sidebar-font-size">Dashboard</span>
          </Link>
        </li>

        <li>
          <hr className="hr-horizontal" />
        </li>
        {/* <li className="nav-item static-item">
          <Link className="nav-link static-item disabled" to="#" tabIndex="-1">
            <span className="default-icon">Admin</span>
            <span className="mini-icon">-</span>
          </Link>
        </li> */}

        {/* admin */}
        <Accordion.Item
          as="li"
          eventKey="sidebar-special"
          bsPrefix={`nav-item ${active === "special" ? "active" : ""} `}
          onClick={() => setActive("special")}
        >
          <CustomToggle
            eventKey="sidebar-special"
            onClick={(activeKey) => setActiveMenu(activeKey)}
          >
            <i className="icon">
              <svg
                width="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  opacity="0.4"
                  d="M13.3051 5.88243V6.06547C12.8144 6.05584 12.3237 6.05584 11.8331 6.05584V5.89206C11.8331 5.22733 11.2737 4.68784 10.6064 4.68784H9.63482C8.52589 4.68784 7.62305 3.80152 7.62305 2.72254C7.62305 2.32755 7.95671 2 8.35906 2C8.77123 2 9.09508 2.32755 9.09508 2.72254C9.09508 3.01155 9.34042 3.24276 9.63482 3.24276H10.6064C12.0882 3.2524 13.2953 4.43736 13.3051 5.88243Z"
                  fill="currentColor"
                ></path>
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M15.164 6.08279C15.4791 6.08712 15.7949 6.09145 16.1119 6.09469C19.5172 6.09469 22 8.52241 22 11.875V16.1813C22 19.5339 19.5172 21.9616 16.1119 21.9616C14.7478 21.9905 13.3837 22.0001 12.0098 22.0001C10.6359 22.0001 9.25221 21.9905 7.88813 21.9616C4.48283 21.9616 2 19.5339 2 16.1813V11.875C2 8.52241 4.48283 6.09469 7.89794 6.09469C9.18351 6.07542 10.4985 6.05615 11.8332 6.05615C12.3238 6.05615 12.8145 6.05615 13.3052 6.06579C13.9238 6.06579 14.5425 6.07427 15.164 6.08279ZM10.8518 14.7459H9.82139V15.767C9.82139 16.162 9.48773 16.4896 9.08538 16.4896C8.67321 16.4896 8.34936 16.162 8.34936 15.767V14.7459H7.30913C6.90677 14.7459 6.57311 14.4279 6.57311 14.0233C6.57311 13.6283 6.90677 13.3008 7.30913 13.3008H8.34936V12.2892C8.34936 11.8942 8.67321 11.5667 9.08538 11.5667C9.48773 11.5667 9.82139 11.8942 9.82139 12.2892V13.3008H10.8518C11.2542 13.3008 11.5878 13.6283 11.5878 14.0233C11.5878 14.4279 11.2542 14.7459 10.8518 14.7459ZM15.0226 13.1177H15.1207C15.5231 13.1177 15.8567 12.7998 15.8567 12.3952C15.8567 12.0002 15.5231 11.6727 15.1207 11.6727H15.0226C14.6104 11.6727 14.2866 12.0002 14.2866 12.3952C14.2866 12.7998 14.6104 13.1177 15.0226 13.1177ZM16.7007 16.4318H16.7988C17.2012 16.4318 17.5348 16.1139 17.5348 15.7092C17.5348 15.3143 17.2012 14.9867 16.7988 14.9867H16.7007C16.2885 14.9867 15.9647 15.3143 15.9647 15.7092C15.9647 16.1139 16.2885 16.4318 16.7007 16.4318Z"
                  fill="currentColor"
                ></path>
              </svg>
            </i>
            <span className="item-name sidebar-font-size">Role Management</span>

            <i className="right-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </i>
          </CustomToggle>
          <Accordion.Collapse eventKey="sidebar-special">
            <ul className="sub-nav">
              <li className="nav-item">
                <Link
                  className={`${
                    location.pathname === "/role-list" ? "active" : ""
                  } nav-link`}
                  to="/role-list"
                >
                  <i className="icon">
                    <svg
                      width="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9.34933 14.8577C5.38553 14.8577 2 15.47 2 17.9173C2 20.3665 5.364 20.9999 9.34933 20.9999C13.3131 20.9999 16.6987 20.3876 16.6987 17.9403C16.6987 15.4911 13.3347 14.8577 9.34933 14.8577Z"
                        fill="currentColor"
                      />
                      <path
                        opacity="0.4"
                        d="M9.34935 12.5248C12.049 12.5248 14.2124 10.4062 14.2124 7.76241C14.2124 5.11865 12.049 3 9.34935 3C6.65072 3 4.48633 5.11865 4.48633 7.76241C4.48633 10.4062 6.65072 12.5248 9.34935 12.5248Z"
                        fill="currentColor"
                      />
                      <path
                        opacity="0.4"
                        d="M16.1733 7.84873C16.1733 9.19505 15.7604 10.4513 15.0363 11.4948C14.961 11.6021 15.0275 11.7468 15.1586 11.7698C15.3406 11.7995 15.5275 11.8177 15.7183 11.8216C17.6165 11.8704 19.3201 10.6736 19.7907 8.87116C20.4884 6.19674 18.4414 3.79541 15.8338 3.79541C15.551 3.79541 15.2799 3.82416 15.0157 3.87686C14.9795 3.88453 14.9404 3.90177 14.9208 3.93244C14.8954 3.97172 14.914 4.02251 14.9394 4.05605C15.7232 5.13214 16.1733 6.44205 16.1733 7.84873Z"
                        fill="currentColor"
                      />
                      <path
                        d="M21.779 15.1693C21.4316 14.4439 20.593 13.9465 19.3171 13.7022C18.7153 13.5585 17.0852 13.3544 15.5695 13.3831C15.547 13.386 15.5343 13.4013 15.5324 13.4109C15.5294 13.4262 15.5363 13.4492 15.5656 13.4655C16.2662 13.8047 18.9737 15.2804 18.6332 18.3927C18.6185 18.5288 18.729 18.6438 18.867 18.6246C19.5333 18.5317 21.2476 18.1704 21.779 17.0474C22.0735 16.4533 22.0735 15.7634 21.779 15.1693Z"
                        fill="currentColor"
                      />
                    </svg>
                  </i>
                  <i className="sidenav-mini-icon">
                    {" "}
                    <svg
                      width="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9.34933 14.8577C5.38553 14.8577 2 15.47 2 17.9173C2 20.3665 5.364 20.9999 9.34933 20.9999C13.3131 20.9999 16.6987 20.3876 16.6987 17.9403C16.6987 15.4911 13.3347 14.8577 9.34933 14.8577Z"
                        fill="currentColor"
                      />
                      <path
                        opacity="0.4"
                        d="M9.34935 12.5248C12.049 12.5248 14.2124 10.4062 14.2124 7.76241C14.2124 5.11865 12.049 3 9.34935 3C6.65072 3 4.48633 5.11865 4.48633 7.76241C4.48633 10.4062 6.65072 12.5248 9.34935 12.5248Z"
                        fill="currentColor"
                      />
                      <path
                        opacity="0.4"
                        d="M16.1733 7.84873C16.1733 9.19505 15.7604 10.4513 15.0363 11.4948C14.961 11.6021 15.0275 11.7468 15.1586 11.7698C15.3406 11.7995 15.5275 11.8177 15.7183 11.8216C17.6165 11.8704 19.3201 10.6736 19.7907 8.87116C20.4884 6.19674 18.4414 3.79541 15.8338 3.79541C15.551 3.79541 15.2799 3.82416 15.0157 3.87686C14.9795 3.88453 14.9404 3.90177 14.9208 3.93244C14.8954 3.97172 14.914 4.02251 14.9394 4.05605C15.7232 5.13214 16.1733 6.44205 16.1733 7.84873Z"
                        fill="currentColor"
                      />
                      <path
                        d="M21.779 15.1693C21.4316 14.4439 20.593 13.9465 19.3171 13.7022C18.7153 13.5585 17.0852 13.3544 15.5695 13.3831C15.547 13.386 15.5343 13.4013 15.5324 13.4109C15.5294 13.4262 15.5363 13.4492 15.5656 13.4655C16.2662 13.8047 18.9737 15.2804 18.6332 18.3927C18.6185 18.5288 18.729 18.6438 18.867 18.6246C19.5333 18.5317 21.2476 18.1704 21.779 17.0474C22.0735 16.4533 22.0735 15.7634 21.779 15.1693Z"
                        fill="currentColor"
                      />
                    </svg>
                  </i>
                  <span className="item-name sidebar-font-size">Roles</span>
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  className={`${
                    location.pathname === "/rolep-list" ? "active" : ""
                  } nav-link`}
                  to="/rolep-list"
                >
                  <i className="icon">
                    <KeyIcon fontSize="small" />
                  </i>
                  <i className="sidenav-mini-icon">
                    <KeyIcon fontSize="small" />
                  </i>
                  <span className="item-name sidebar-font-size">
                    Roles Permission
                  </span>
                </Link>
              </li>
            </ul>
          </Accordion.Collapse>
        </Accordion.Item>
        {/* Employee Manage */}
        <Accordion.Item
          as="li"
          className={`${activeMenu === "0" ? "active" : ""}`}
          eventKey="sidebar-auth"
          bsPrefix={`nav-item ${active === "auth" ? "active" : ""} `}
          onClick={() => setActive("auth")}
        >
          <CustomToggle
            eventKey="sidebar-auth"
            onClick={(activeKey) => setActiveMenu(activeKey)}
          >
            <i className="icon">
              <AccessibilityIcon fontSize="small" />
            </i>
            <span className="item-name sidebar-font-size">
              Employee Management
            </span>
            <i className="right-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </i>
          </CustomToggle>
          <Accordion.Collapse eventKey="sidebar-auth">
            <ul className="sub-nav">
              <li className="nav-item">
                <Link
                  className={`${
                    location.pathname === "/department-list" ? "active" : ""
                  } nav-link`}
                  to="/department-list"
                >
                  <i className="icon">
                    <ApartmentIcon fontSize="small" />
                  </i>
                  <i className="sidenav-mini-icon">
                    {" "}
                    <ApartmentIcon fontSize="small" />{" "}
                  </i>
                  <span className="item-name sidebar-font-size">
                    Department
                  </span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`${
                    location.pathname === "/designation-list" ? "active" : ""
                  } nav-link`}
                  to="/designation-list"
                >
                  <i className="icon">
                    <svg
                      width="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11.997 15.1746C7.684 15.1746 4 15.8546 4 18.5746C4 21.2956 7.661 21.9996 11.997 21.9996C16.31 21.9996 19.994 21.3206 19.994 18.5996C19.994 15.8786 16.334 15.1746 11.997 15.1746Z"
                        fill="currentColor"
                      />
                      <path
                        opacity="0.4"
                        d="M11.9971 12.5838C14.9351 12.5838 17.2891 10.2288 17.2891 7.29176C17.2891 4.35476 14.9351 1.99976 11.9971 1.99976C9.06008 1.99976 6.70508 4.35476 6.70508 7.29176C6.70508 10.2288 9.06008 12.5838 11.9971 12.5838Z"
                        fill="currentColor"
                      />
                    </svg>
                  </i>
                  <i className="sidenav-mini-icon">
                    {" "}
                    <svg
                      width="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11.997 15.1746C7.684 15.1746 4 15.8546 4 18.5746C4 21.2956 7.661 21.9996 11.997 21.9996C16.31 21.9996 19.994 21.3206 19.994 18.5996C19.994 15.8786 16.334 15.1746 11.997 15.1746Z"
                        fill="currentColor"
                      />
                      <path
                        opacity="0.4"
                        d="M11.9971 12.5838C14.9351 12.5838 17.2891 10.2288 17.2891 7.29176C17.2891 4.35476 14.9351 1.99976 11.9971 1.99976C9.06008 1.99976 6.70508 4.35476 6.70508 7.29176C6.70508 10.2288 9.06008 12.5838 11.9971 12.5838Z"
                        fill="currentColor"
                      />
                    </svg>{" "}
                  </i>
                  <span className="item-name sidebar-font-size">
                    Designation
                  </span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`${
                    location.pathname === "/shift-list" ? "active" : ""
                  } nav-link`}
                  to="/shift-list"
                >
                  <i className="icon">
                    <BrowseGalleryIcon fontSize="small" />
                  </i>
                  <i className="sidenav-mini-icon">
                    <BrowseGalleryIcon fontSize="small" />
                  </i>
                  <span className="item-name sidebar-font-size">Shift</span>
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  className={`${
                    location.pathname === "/EmployeeType" ? "active" : ""
                  } nav-link`}
                  to="/EmployeeType"
                >
                  <i className="icon">
                    <AccountTreeIcon fontSize="small" />
                  </i>
                  <i className="sidenav-mini-icon">
                    <AccountTreeIcon fontSize="small" />
                  </i>
                  <span className="item-name sidebar-font-size">
                    Employee Type
                  </span>
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  className={`${
                    location.pathname === "/LeaveType" ? "active" : ""
                  } nav-link`}
                  to="/LeaveType"
                >
                  <i className="icon">
                    <TimeToLeaveIcon fontSize="small" />
                  </i>
                  <i className="sidenav-mini-icon">
                    {" "}
                    <TimeToLeaveIcon fontSize="small" />{" "}
                  </i>
                  <span className="item-name sidebar-font-size">
                    Leave Type
                  </span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`${
                    location.pathname === "/holiday" ? "active" : ""
                  } nav-link`}
                  to="/holiday"
                >
                  <i className="icon">
                    <AccountTreeIcon fontSize="small" />
                  </i>
                  <i className="sidenav-mini-icon">
                    {" "}
                    <AccountTreeIcon fontSize="small" />
                  </i>
                  <span className="item-name sidebar-font-size">Holiday</span>
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  className={`${
                    location.pathname === "/Default-Holiday" ? "active" : ""
                  } nav-link`}
                  to="/Default-Holiday"
                >
                  <i className="icon">
                    <AccountTreeIcon fontSize="small" />
                  </i>
                  <i className="sidenav-mini-icon">
                    {" "}
                    <AccountTreeIcon fontSize="small" />{" "}
                  </i>
                  <span className="item-name sidebar-font-size">
                    Default Holiday
                  </span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`${
                    location.pathname === "/award-list" ? "active" : ""
                  } nav-link`}
                  to="/award-list"
                >
                  <i className="icon">
                    <EmojiEventsIcon fontSize="small" />
                  </i>
                  <i className="sidenav-mini-icon">
                    <EmojiEventsIcon fontSize="small" />{" "}
                  </i>
                  <span className="item-name sidebar-font-size">Award</span>
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  className={`${
                    location.pathname === "/employee-list" ? "active" : ""
                  } nav-link`}
                  to="/employee-list"
                >
                  <i className="icon">
                    <PersonAddIcon fontSize="small" />
                  </i>
                  <i className="sidenav-mini-icon">
                    <PersonAddIcon fontSize="small" />
                  </i>
                  <span className="item-name sidebar-font-size">Employee</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`${
                    location.pathname === "/leaves-list" ? "active" : ""
                  } nav-link`}
                  to="/leaves-list"
                >
                  <i className="icon">
                    <TimeToLeaveIcon fontSize="small" />
                  </i>
                  <i className="sidenav-mini-icon">
                    <TimeToLeaveIcon fontSize="small" />{" "}
                  </i>
                  <span className="item-name sidebar-font-size">
                    Employee Leave
                  </span>
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  className={`${
                    location.pathname === "/leaves-list" ? "active" : ""
                  } nav-link`}
                  to="/leaves-list"
                >
                  <i className="icon">
                    <TimeToLeaveIcon fontSize="small" />
                  </i>
                  <i className="sidenav-mini-icon">
                    <TimeToLeaveIcon fontSize="small" />
                  </i>
                  <span className="item-name sidebar-font-size">
                    Attendance
                  </span>
                </Link>
              </li>
            </ul>
          </Accordion.Collapse>
        </Accordion.Item>

        {/* Work */}
        <Accordion.Item
          as="li"
          className={`${activeMenu === "0" ? "active" : ""}`}
          eventKey="sidebar-auth2"
          bsPrefix={`nav-item ${active === "auth" ? "active" : ""} `}
          onClick={() => setActive("auth")}
        >
          <CustomToggle
            eventKey="sidebar-auth2"
            onClick={(activeKey) => setActiveMenu(activeKey)}
          >
            <i className="icon">
              <WorkIcon fontSize="small" />
            </i>
            <span className="item-name sidebar-font-size">Work</span>
            <i className="right-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </i>
          </CustomToggle>
          <Accordion.Collapse eventKey="sidebar-auth2">
            <ul className="sub-nav">
              <li className="nav-item">
                <Link
                  className={`${
                    location.pathname === "/taskcategory-list" ? "active" : ""
                  } nav-link`}
                  to="/taskcategory-list"
                >
                  <i className="icon">
                    <AccountTreeIcon fontSize="small" />
                  </i>
                  <i className="sidenav-mini-icon">
                    {" "}
                    <AccountTreeIcon fontSize="small" />
                  </i>
                  <span className="item-name sidebar-font-size">
                    Task Category
                  </span>
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  className={`${
                    location.pathname === "/projectcategory-list"
                      ? "active"
                      : ""
                  } nav-link`}
                  to="/projectcategory-list"
                >
                  <i className="icon">
                    <AccountTreeIcon fontSize="small" />
                  </i>
                  <i className="sidenav-mini-icon">
                    {" "}
                    <AccountTreeIcon fontSize="small" />{" "}
                  </i>
                  <span className="item-name sidebar-font-size">
                    Project Category
                  </span>
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  className={`${
                    location.pathname === "/stock-list" ? "active" : ""
                  } nav-link`}
                  to="/stock-list"
                >
                  <i className="icon">
                    <WarehouseSharpIcon fontSize="small" />
                  </i>
                  <i className="sidenav-mini-icon">
                    {" "}
                    <WarehouseSharpIcon fontSize="small" />{" "}
                  </i>
                  <span className="item-name sidebar-font-size">Stock</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`${
                    location.pathname === "/project-list" ? "active" : ""
                  } nav-link`}
                  to="/project-list"
                >
                  <i className="icon">
                    <ListAltIcon fontSize="small" />
                  </i>
                  <i className="sidenav-mini-icon">
                    {" "}
                    <ListAltIcon fontSize="small" />{" "}
                  </i>
                  <span className="item-name sidebar-font-size">Projects</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`${
                    location.pathname === "/task-list" ? "active" : ""
                  } nav-link`}
                  to="/task-list"
                >
                  <i className="icon">
                    <TaskIcon fontSize="small" />
                  </i>
                  <i className="sidenav-mini-icon">
                    {" "}
                    <TaskIcon fontSize="small" />
                  </i>
                  <span className="item-name sidebar-font-size">Tasks</span>
                </Link>
              </li>
            </ul>
          </Accordion.Collapse>
        </Accordion.Item>

        {/* Leads */}
        <Accordion.Item
          as="li"
          className={`${activeMenu === "0" ? "active" : ""}`}
          eventKey="sidebar-leads"
          bsPrefix={`nav-item ${active === "auth" ? "active" : ""} `}
          onClick={() => setActive("auth")}
        >
          <CustomToggle
            eventKey="sidebar-leads"
            onClick={(activeKey) => setActiveMenu(activeKey)}
          >
            <i className="icon">
              <PeopleIcon fontSize="small" />
            </i>
            <span className="item-name sidebar-font-size">Leads</span>
            <i className="right-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </i>
          </CustomToggle>
          <Accordion.Collapse eventKey="sidebar-leads">
            <ul className="sub-nav">
              <li className="nav-item">
                <Link
                  className={`${
                    location.pathname === "/leadsSource-list" ? "active" : ""
                  } nav-link`}
                  to="/leadsSource-list"
                >
                  <i className="icon">
                    <FormatListBulletedSharpIcon fontSize="small" />
                  </i>
                  <i className="sidenav-mini-icon">
                    {" "}
                    <FormatListBulletedSharpIcon fontSize="small" />
                  </i>
                  <span className="item-name sidebar-font-size">
                    Lead Source
                  </span>
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  className={`${
                    location.pathname === "/dealstages-list" ? "active" : ""
                  } nav-link`}
                  to="/dealstages-list"
                >
                  <i className="icon">
                    <FormatListBulletedSharpIcon fontSize="small" />
                  </i>
                  <i className="sidenav-mini-icon">
                    {" "}
                    <FormatListBulletedSharpIcon fontSize="small" />
                  </i>
                  <span className="item-name sidebar-font-size">
                    Deal Stages
                  </span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`${
                    location.pathname === "/leads-list" ? "active" : ""
                  } nav-link`}
                  to="/leads-list"
                >
                  <i className="icon">
                    <ListAltIcon fontSize="small" />
                  </i>
                  <i className="sidenav-mini-icon">
                    {" "}
                    <ListAltIcon fontSize="small" />
                  </i>
                  <span className="item-name sidebar-font-size">
                    Lead Contact
                  </span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`${
                    location.pathname === "/deals-list" ? "active" : ""
                  } nav-link`}
                  to="/deals-list"
                >
                  <i className="icon">
                    <TaskIcon fontSize="small" />
                  </i>
                  <i className="sidenav-mini-icon">
                    {" "}
                    <TaskIcon fontSize="small" />
                  </i>
                  <span className="item-name sidebar-font-size">Deals</span>
                </Link>
              </li>
            </ul>
          </Accordion.Collapse>
        </Accordion.Item>

        {/* Expense */}
        <Accordion.Item
          as="li"
          className={`${activeMenu === "0" ? "active" : ""}`}
          eventKey="sidebar-expense"
          bsPrefix={`nav-item ${active === "auth" ? "active" : ""} `}
          onClick={() => setActive("auth")}
        >
          <CustomToggle
            eventKey="sidebar-expense"
            onClick={(activeKey) => setActiveMenu(activeKey)}
          >
            <i className="icon">
              <AccountBalanceWalletSharpIcon fontSize="small" />
            </i>
            <span className="item-name sidebar-font-size">Expense</span>
            <i className="right-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </i>
          </CustomToggle>
          <Accordion.Collapse eventKey="sidebar-expense">
            <ul className="sub-nav">
              <li className="nav-item">
                <Link
                  className={`${
                    location.pathname === "/ExpenseCategory-list"
                      ? "active"
                      : ""
                  } nav-link`}
                  to="/ExpenseCategory-list"
                >
                  <i className="icon">
                    <CurrencyRupeeSharpIcon fontSize="small" />
                  </i>
                  <i className="sidenav-mini-icon">
                    <CurrencyRupeeSharpIcon fontSize="small" />
                  </i>
                  <span className="item-name sidebar-font-size">
                    Expense Category
                  </span>
                </Link>
              </li>
            </ul>
          </Accordion.Collapse>
        </Accordion.Item>

        {/* Customer */}
        <Accordion.Item
          as="li"
          className={`${activeMenu === "0" ? "active" : ""}`}
          eventKey="sidebar-cust"
          bsPrefix={`nav-item ${active === "auth" ? "active" : ""} `}
          onClick={() => setActive("auth")}
        >
          <CustomToggle
            eventKey="sidebar-cust"
            onClick={(activeKey) => setActiveMenu(activeKey)}
          >
            <i className="icon">
              <GroupsIcon fontSize="small" />
            </i>
            <span className="item-name sidebar-font-size">Customer</span>
            <i className="right-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </i>
          </CustomToggle>
          <Accordion.Collapse eventKey="sidebar-cust">
            <ul className="sub-nav">
              <li className="nav-item">
                <Link
                  className={`${
                    location.pathname === "/customerList" ? "active" : ""
                  } nav-link`}
                  to="/customerList"
                >
                  <i className="icon">
                    <PersonAddIcon fontSize="small" />
                  </i>
                  <i className="sidenav-mini-icon">
                    <PersonAddIcon fontSize="small" />
                  </i>
                  <span className="item-name sidebar-font-size">Customer</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`${
                    location.pathname === "/clientCategory-list" ? "active" : ""
                  } nav-link`}
                  to="/clientCategory-list"
                >
                  <i className="icon">
                    <AccountTreeIcon fontSize="small" />
                  </i>
                  <i className="sidenav-mini-icon">
                    <AccountTreeIcon fontSize="small" />
                  </i>
                  <span className="item-name sidebar-font-size">
                    Customer Category
                  </span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`${
                    location.pathname === "/contractType-list" ? "active" : ""
                  } nav-link`}
                  to="/contractType-list"
                >
                  <i className="icon">
                    <ContactEmergencyIcon fontSize="small" />
                  </i>
                  <i className="sidenav-mini-icon">
                    {" "}
                    <ContactEmergencyIcon fontSize="small" />{" "}
                  </i>
                  <span className="item-name sidebar-font-size">
                    Contract Type
                  </span>
                </Link>
              </li>
            </ul>
          </Accordion.Collapse>
        </Accordion.Item>
      </Accordion>
    </Fragment>
  );
});

export default VerticalNav;
