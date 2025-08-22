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
        <li className="nav-item static-item">
          <Link className="nav-link static-item disabled" to="#" tabIndex="-1">
            <span className="default-icon">Home</span>
            <span className="mini-icon">-</span>
          </Link>
        </li>
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
                width="20"
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
            <span className="item-name">Dashboard</span>
          </Link>
        </li>
        {/* <Accordion.Item as="li" eventKey="horizontal-menu" bsPrefix={`nav-item ${active === 'menustyle' ? 'active' : ''} `} onClick={() => setActive('menustyle')}  >
                    <CustomToggle eventKey="horizontal-menu" onClick={(activeKey) => setActiveMenu(activeKey)}>
                    <i className="icon">
                            <svg width="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path opacity="0.4" d="M10.0833 15.958H3.50777C2.67555 15.958 2 16.6217 2 17.4393C2 18.2559 2.67555 18.9207 3.50777 18.9207H10.0833C10.9155 18.9207 11.5911 18.2559 11.5911 17.4393C11.5911 16.6217 10.9155 15.958 10.0833 15.958Z" fill="currentColor"></path>
                                <path opacity="0.4" d="M22.0001 6.37867C22.0001 5.56214 21.3246 4.89844 20.4934 4.89844H13.9179C13.0857 4.89844 12.4102 5.56214 12.4102 6.37867C12.4102 7.1963 13.0857 7.86 13.9179 7.86H20.4934C21.3246 7.86 22.0001 7.1963 22.0001 6.37867Z" fill="currentColor"></path>
                                <path d="M8.87774 6.37856C8.87774 8.24523 7.33886 9.75821 5.43887 9.75821C3.53999 9.75821 2 8.24523 2 6.37856C2 4.51298 3.53999 3 5.43887 3C7.33886 3 8.87774 4.51298 8.87774 6.37856Z" fill="currentColor"></path>
                                <path d="M21.9998 17.3992C21.9998 19.2648 20.4609 20.7777 18.5609 20.7777C16.6621 20.7777 15.1221 19.2648 15.1221 17.3992C15.1221 15.5325 16.6621 14.0195 18.5609 14.0195C20.4609 14.0195 21.9998 15.5325 21.9998 17.3992Z" fill="currentColor"></path>
                            </svg>
                        </i>
                        <span className="item-name">Menu Style</span>
                        <i className="right-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </i>
                    </CustomToggle>
                    <Accordion.Collapse eventKey="horizontal-menu" >
                        <ul  className="sub-nav">
                            <li className="nav-item">
                                <Link className={`${location.pathname === '/horizontal' ? 'active' : ''} nav-link`} to="/horizontal">
                                    <i className="icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="10" viewBox="0 0 24 24" fill="currentColor">
                                            <g>
                                            <circle cx="12" cy="12" r="8" fill="currentColor"></circle>
                                            </g>
                                        </svg>
                                    </i>
                                    <i className="sidenav-mini-icon"> H </i>
                                    <span className="item-name"> Horizontal </span>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link " to="/dual-horizontal">
                                    <i className="icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="10" viewBox="0 0 24 24" fill="currentColor">
                                            <g>
                                            <circle cx="12" cy="12" r="8" fill="currentColor"></circle>
                                            </g>
                                        </svg>
                                    </i>
                                    <i className="sidenav-mini-icon"> D </i>
                                    <span className="item-name">Dual Horizontal</span>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className={`${location.pathname === '/dual-compact' ? 'active' : ''} nav-link`}  to="/dual-compact">
                                    <i className="icon svg-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="10" viewBox="0 0 24 24" fill="currentColor">
                                            <g>
                                            <circle cx="12" cy="12" r="8" fill="currentColor"></circle>
                                            </g>
                                        </svg>
                                    </i>
                                    <i className="sidenav-mini-icon"> D </i>                   
                                    <span className="item-name">Dual Compact</span>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className={`${location.pathname === '/boxed' ? 'active' : ''} nav-link`} to="/boxed">
                                    <i className="icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="10" viewBox="0 0 24 24" fill="currentColor">
                                            <g>
                                            <circle cx="12" cy="12" r="8" fill="currentColor"></circle>
                                            </g>
                                        </svg>
                                    </i>
                                    <i className="sidenav-mini-icon"> B </i>
                                    <span className="item-name">Boxed Horizontal</span>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className={`${location.pathname === '/boxedfancy' ? 'active' : ''} nav-link`} to="/boxedFancy">
                                    <i className="icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="10" viewBox="0 0 24 24" fill="currentColor">
                                            <g>
                                            <circle cx="12" cy="12" r="8" fill="currentColor"></circle>
                                            </g>
                                        </svg>
                                    </i>
                                    <i className="sidenav-mini-icon"> B </i>
                                    <span className="item-name">Boxed Fancy</span>
                                </Link>
                            </li>
                        </ul>
                    </Accordion.Collapse>
                </Accordion.Item> */}
        {/* <li className="nav-item">
                    <Link className={`${location.pathname === '/' ? 'active' : ''} nav-link `} aria-current="page" target="blank" to="/">
                        <i className="icon">
                        <svg width="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M21.9964 8.37513H17.7618C15.7911 8.37859 14.1947 9.93514 14.1911 11.8566C14.1884 13.7823 15.7867 15.3458 17.7618 15.3484H22V15.6543C22 19.0136 19.9636 21 16.5173 21H7.48356C4.03644 21 2 19.0136 2 15.6543V8.33786C2 4.97862 4.03644 3 7.48356 3H16.5138C19.96 3 21.9964 4.97862 21.9964 8.33786V8.37513ZM6.73956 8.36733H12.3796H12.3831H12.3902C12.8124 8.36559 13.1538 8.03019 13.152 7.61765C13.1502 7.20598 12.8053 6.87318 12.3831 6.87491H6.73956C6.32 6.87664 5.97956 7.20858 5.97778 7.61852C5.976 8.03019 6.31733 8.36559 6.73956 8.36733Z" fill="currentColor"></path>
                            <path opacity="0.4" d="M16.0374 12.2966C16.2465 13.2478 17.0805 13.917 18.0326 13.8996H21.2825C21.6787 13.8996 22 13.5715 22 13.166V10.6344C21.9991 10.2297 21.6787 9.90077 21.2825 9.8999H17.9561C16.8731 9.90338 15.9983 10.8024 16 11.9102C16 12.0398 16.0128 12.1695 16.0374 12.2966Z" fill="currentColor"></path>
                            <circle cx="18" cy="11.8999" r="1" fill="currentColor"></circle>
                        </svg>
                        </i>
                        <span className="item-name">Design System<span className="badge rounded-pill bg-success ms-3">UI</span></span>
                    </Link>
                </li> */}
        <li>
          <hr className="hr-horizontal" />
        </li>
        <li className="nav-item static-item">
          <Link className="nav-link static-item disabled" to="#" tabIndex="-1">
            <span className="default-icon">Admin</span>
            <span className="mini-icon">-</span>
          </Link>
        </li>

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
                width="20"
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
            <span className="item-name">Role Management</span>

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
                    location.pathname === "role-list" ? "active" : ""
                  } nav-link`}
                  to="role-list"
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
                  <i className="sidenav-mini-icon"> R </i>
                  <span className="item-name">Roles</span>
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  className={`${
                    location.pathname === "rolep-list" ? "active" : ""
                  } nav-link`}
                  to="rolep-list"
                >
                  <i className="icon">
                    <KeyIcon fontSize="small" />
                  </i>
                  <i className="sidenav-mini-icon"> R P</i>
                  <span className="item-name">Roles Permission</span>
                </Link>
              </li>
              {/* <li className="nav-item">
                <Link
                  className={`${
                    location.pathname === "/dashboard/special-pages/calender"
                      ? "active"
                      : ""
                  } nav-link`}
                  to="/dashboard/special-pages/calender"
                >
                  <i className="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <g>
                        <circle
                          cx="12"
                          cy="12"
                          r="8"
                          fill="currentColor"
                        ></circle>
                      </g>
                    </svg>
                  </i>
                  <i className="sidenav-mini-icon"> C </i>
                  <span className="item-name">Calender</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`${
                    location.pathname === "/dashboard/special-pages/kanban"
                      ? "active"
                      : ""
                  } nav-link`}
                  to="/dashboard/special-pages/kanban"
                >
                  <i className="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <g>
                        <circle
                          cx="12"
                          cy="12"
                          r="8"
                          fill="currentColor"
                        ></circle>
                      </g>
                    </svg>
                  </i>
                  <i className="sidenav-mini-icon"> K </i>
                  <span className="item-name">kanban</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`${
                    location.pathname === "/dashboard/special-pages/pricing"
                      ? "active"
                      : ""
                  } nav-link`}
                  to="/dashboard/special-pages/pricing"
                >
                  <i className="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <g>
                        <circle
                          cx="12"
                          cy="12"
                          r="8"
                          fill="currentColor"
                        ></circle>
                      </g>
                    </svg>
                  </i>
                  <i className="sidenav-mini-icon"> P </i>
                  <span className="item-name">Pricing</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`${
                    location.pathname === "/dashboard/special-pages/rtl-support"
                      ? "active"
                      : ""
                  } nav-link`}
                  to="/dashboard/special-pages/rtl-support"
                >
                  <i className="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <g>
                        <circle
                          cx="12"
                          cy="12"
                          r="8"
                          fill="currentColor"
                        ></circle>
                      </g>
                    </svg>
                  </i>
                  <i className="sidenav-mini-icon"> RS </i>
                  <span className="item-name">RTL Support</span>
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  className={`${
                    location.pathname === "/dashboard/special-pages/timeline"
                      ? "active"
                      : ""
                  } nav-link`}
                  to="/dashboard/special-pages/timeline"
                >
                  <i className="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <g>
                        <circle
                          cx="12"
                          cy="12"
                          r="8"
                          fill="currentColor"
                        ></circle>
                      </g>
                    </svg>
                  </i>
                  <i className="sidenav-mini-icon"> T </i>
                  <span className="item-name">Timeline</span>
                </Link>
              </li> */}
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
              <AccessibilityIcon />
            </i>
            <span className="item-name">Employee Management</span>
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
                  <i className="sidenav-mini-icon"> D </i>
                  <span className="item-name">Department</span>
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
                      width="20"
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
                  <i className="sidenav-mini-icon"> D </i>
                  <span className="item-name">Designation</span>
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
                  <i className="sidenav-mini-icon"> S </i>
                  <span className="item-name">Shift</span>
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
                  <i className="sidenav-mini-icon"> ET </i>
                  <span className="item-name">Employee Type</span>
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
                  <i className="sidenav-mini-icon"> H </i>
                  <span className="item-name">Holiday</span>
                </Link>
              </li>
              {/* <li className="nav-item">
                <Link
                  className={`${location.pathname === "/auth/sign-in" ? "active" : ""
                    } nav-link`}
                  to="/auth/sign-in"
                >
                  <i className="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <g>
                        <circle
                          cx="12"
                          cy="12"
                          r="8"
                          fill="currentColor"
                        ></circle>
                      </g>
                    </svg>
                  </i>
                  <i className="sidenav-mini-icon"> L </i>
                  <span className="item-name">Login</span>
                </Link>
              </li> */}
              {/* <li className="nav-item">
                <Link
                  className={`${location.pathname === "/auth/sign-up" ? "active" : ""
                    } nav-link`}
                  to="/auth/sign-up"
                >
                  <i className="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <g>
                        <circle
                          cx="12"
                          cy="12"
                          r="8"
                          fill="currentColor"
                        ></circle>
                      </g>
                    </svg>
                  </i>
                  <i className="sidenav-mini-icon"> R </i>
                  <span className="item-name">Register</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`${location.pathname === "/auth/confirm-mail" ? "active" : ""
                    } nav-link`}
                  to="/auth/confirm-mail"
                >
                  <i className="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <g>
                        <circle
                          cx="12"
                          cy="12"
                          r="8"
                          fill="currentColor"
                        ></circle>
                      </g>
                    </svg>
                  </i>
                  <i className="sidenav-mini-icon"> C </i>
                  <span className="item-name">Confirm Mail</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`${location.pathname === "/auth/lock-screen" ? "active" : ""
                    } nav-link`}
                  to="/auth/lock-screen"
                >
                  <i className="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <g>
                        <circle
                          cx="12"
                          cy="12"
                          r="8"
                          fill="currentColor"
                        ></circle>
                      </g>
                    </svg>
                  </i>
                  <i className="sidenav-mini-icon"> L </i>
                  <span className="item-name">Lock Screen</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`${location.pathname === "/auth/recoverpw" ? "active" : ""
                    } nav-link`}
                  to="/auth/recoverpw"
                >
                  <i className="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <g>
                        <circle
                          cx="12"
                          cy="12"
                          r="8"
                          fill="currentColor"
                        ></circle>
                      </g>
                    </svg>
                  </i>
                  <i className="sidenav-mini-icon"> R </i>
                  <span className="item-name">Recover password</span>
                </Link>
              </li> */}
            </ul>
          </Accordion.Collapse>
        </Accordion.Item>

        {/* Employee */}
        <Accordion.Item
          as="li"
          className={`${activeMenu === "0" ? "active" : ""}`}
          eventKey="sidebar-auth1"
          bsPrefix={`nav-item ${active === "auth" ? "active" : ""} `}
          onClick={() => setActive("auth")}
        >
          <CustomToggle
            eventKey="sidebar-auth1"
            onClick={(activeKey) => setActiveMenu(activeKey)}
          >
            <i className="icon">
              <GroupsIcon />
            </i>
            <span className="item-name">Employee</span>
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
          <Accordion.Collapse eventKey="sidebar-auth1">
            <ul className="sub-nav">
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
                  <i className="sidenav-mini-icon"> E </i>
                  <span className="item-name">Employee</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`${
                    location.pathname === "leaves-list" ? "active" : ""
                  } nav-link`}
                  to="/leaves-list"
                >
                  <i className="icon">
                    <TimeToLeaveIcon fontSize="small" />
                  </i>
                  <i className="sidenav-mini-icon"> L </i>
                  <span className="item-name">Leave</span>
                </Link>
              </li>
              {/* <li className="nav-item">
                <Link
                  className={`${
                    location.pathname ===
                    "dashboard/EmployeeManagment/Designation/designation-list"
                      ? "active"
                      : ""
                  } nav-link`}
                  to="dashboard/EmployeeManagment/Designation/designation-list"
                >
                  <i className="icon">
                    <svg
                      width="20"
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
                  <i className="sidenav-mini-icon"> D </i>
                  <span className="item-name">Designation</span>
                </Link>
              </li> */}

              {/* <li className="nav-item">
                <Link
                  className={`${location.pathname === "/auth/sign-in" ? "active" : ""
                    } nav-link`}
                  to="/auth/sign-in"
                >
                  <i className="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <g>
                        <circle
                          cx="12"
                          cy="12"
                          r="8"
                          fill="currentColor"
                        ></circle>
                      </g>
                    </svg>
                  </i>
                  <i className="sidenav-mini-icon"> L </i>
                  <span className="item-name">Login</span>
                </Link>
              </li> */}
              {/* <li className="nav-item">
                <Link
                  className={`${location.pathname === "/auth/sign-up" ? "active" : ""
                    } nav-link`}
                  to="/auth/sign-up"
                >
                  <i className="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <g>
                        <circle
                          cx="12"
                          cy="12"
                          r="8"
                          fill="currentColor"
                        ></circle>
                      </g>
                    </svg>
                  </i>
                  <i className="sidenav-mini-icon"> R </i>
                  <span className="item-name">Register</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`${location.pathname === "/auth/confirm-mail" ? "active" : ""
                    } nav-link`}
                  to="/auth/confirm-mail"
                >
                  <i className="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <g>
                        <circle
                          cx="12"
                          cy="12"
                          r="8"
                          fill="currentColor"
                        ></circle>
                      </g>
                    </svg>
                  </i>
                  <i className="sidenav-mini-icon"> C </i>
                  <span className="item-name">Confirm Mail</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`${location.pathname === "/auth/lock-screen" ? "active" : ""
                    } nav-link`}
                  to="/auth/lock-screen"
                >
                  <i className="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <g>
                        <circle
                          cx="12"
                          cy="12"
                          r="8"
                          fill="currentColor"
                        ></circle>
                      </g>
                    </svg>
                  </i>
                  <i className="sidenav-mini-icon"> L </i>
                  <span className="item-name">Lock Screen</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`${location.pathname === "/auth/recoverpw" ? "active" : ""
                    } nav-link`}
                  to="/auth/recoverpw"
                >
                  <i className="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <g>
                        <circle
                          cx="12"
                          cy="12"
                          r="8"
                          fill="currentColor"
                        ></circle>
                      </g>
                    </svg>
                  </i>
                  <i className="sidenav-mini-icon"> R </i>
                  <span className="item-name">Recover password</span>
                </Link>
              </li> */}
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
              <WorkIcon fontSize="medium" />
            </i>
            <span className="item-name">Work</span>
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
                    location.pathname ===
                    "dashboardEmployeesAddEmployeeemployee-list"
                      ? "active"
                      : ""
                  } nav-link`}
                  to="/project-list"
                >
                  <i className="icon">
                    <AccountTreeIcon fontSize="small" />
                  </i>
                  <i className="sidenav-mini-icon"> T C </i>
                  <span className="item-name">Task Category</span>
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  className={`${
                    location.pathname ===
                    "dashboardEmployeesAddEmployeeemployee-list"
                      ? "active"
                      : ""
                  } nav-link`}
                  to="/project-list"
                >
                  <i className="icon">
                    <AccountTreeIcon fontSize="small" />
                  </i>
                  <i className="sidenav-mini-icon"> P C </i>
                  <span className="item-name">Project Category</span>
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  className={`${
                    location.pathname ===
                    "dashboardEmployeesAddEmployeeemployee-list"
                      ? "active"
                      : ""
                  } nav-link`}
                  to="/project-list"
                >
                  <i className="icon">
                    <WarehouseSharpIcon fontSize="small" />
                  </i>
                  <i className="sidenav-mini-icon"> S </i>
                  <span className="item-name">Stock</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`${
                    location.pathname ===
                    "dashboardEmployeesAddEmployeeemployee-list"
                      ? "active"
                      : ""
                  } nav-link`}
                  to="/project-list"
                >
                  <i className="icon">
                    <ListAltIcon fontSize="small" />
                  </i>
                  <i className="sidenav-mini-icon"> P </i>
                  <span className="item-name">Projects</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`${
                    location.pathname === "dashboardEmployeesLeavesleaves-list"
                      ? "active"
                      : ""
                  } nav-link`}
                  to="/task-list"
                >
                  <i className="icon">
                    <TaskIcon fontSize="small" />
                  </i>
                  <i className="sidenav-mini-icon"> T </i>
                  <span className="item-name">Tasks</span>
                </Link>
              </li>
              {/* <li className="nav-item">
                <Link
                  className={`${
                    location.pathname ===
                    "dashboard/EmployeeManagment/Designation/designation-list"
                      ? "active"
                      : ""
                  } nav-link`}
                  to="dashboard/EmployeeManagment/Designation/designation-list"
                >
                  <i className="icon">
                    <svg
                      width="20"
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
                  <i className="sidenav-mini-icon"> D </i>
                  <span className="item-name">Designation</span>
                </Link>
              </li> */}

              {/* <li className="nav-item">
                <Link
                  className={`${location.pathname === "/auth/sign-in" ? "active" : ""
                    } nav-link`}
                  to="/auth/sign-in"
                >
                  <i className="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <g>
                        <circle
                          cx="12"
                          cy="12"
                          r="8"
                          fill="currentColor"
                        ></circle>
                      </g>
                    </svg>
                  </i>
                  <i className="sidenav-mini-icon"> L </i>
                  <span className="item-name">Login</span>
                </Link>
              </li> */}
              {/* <li className="nav-item">
                <Link
                  className={`${location.pathname === "/auth/sign-up" ? "active" : ""
                    } nav-link`}
                  to="/auth/sign-up"
                >
                  <i className="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <g>
                        <circle
                          cx="12"
                          cy="12"
                          r="8"
                          fill="currentColor"
                        ></circle>
                      </g>
                    </svg>
                  </i>
                  <i className="sidenav-mini-icon"> R </i>
                  <span className="item-name">Register</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`${location.pathname === "/auth/confirm-mail" ? "active" : ""
                    } nav-link`}
                  to="/auth/confirm-mail"
                >
                  <i className="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <g>
                        <circle
                          cx="12"
                          cy="12"
                          r="8"
                          fill="currentColor"
                        ></circle>
                      </g>
                    </svg>
                  </i>
                  <i className="sidenav-mini-icon"> C </i>
                  <span className="item-name">Confirm Mail</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`${location.pathname === "/auth/lock-screen" ? "active" : ""
                    } nav-link`}
                  to="/auth/lock-screen"
                >
                  <i className="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <g>
                        <circle
                          cx="12"
                          cy="12"
                          r="8"
                          fill="currentColor"
                        ></circle>
                      </g>
                    </svg>
                  </i>
                  <i className="sidenav-mini-icon"> L </i>
                  <span className="item-name">Lock Screen</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`${location.pathname === "/auth/recoverpw" ? "active" : ""
                    } nav-link`}
                  to="/auth/recoverpw"
                >
                  <i className="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <g>
                        <circle
                          cx="12"
                          cy="12"
                          r="8"
                          fill="currentColor"
                        ></circle>
                      </g>
                    </svg>
                  </i>
                  <i className="sidenav-mini-icon"> R </i>
                  <span className="item-name">Recover password</span>
                </Link>
              </li> */}
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
              <PeopleIcon fontSize="medium" />
            </i>
            <span className="item-name">Leads</span>
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
                    location.pathname ===
                    "dashboardEmployeesAddEmployeeemployee-list"
                      ? "active"
                      : ""
                  } nav-link`}
                  to="/leads-list"
                >
                  <i className="icon">
                    <FormatListBulletedSharpIcon fontSize="small" />
                  </i>
                  <i className="sidenav-mini-icon"> L S</i>
                  <span className="item-name">Lead Source</span>
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  className={`${
                    location.pathname ===
                    "dashboardEmployeesAddEmployeeemployee-list"
                      ? "active"
                      : ""
                  } nav-link`}
                  to="/leads-list"
                >
                  <i className="icon">
                    <FormatListBulletedSharpIcon fontSize="small" />
                  </i>
                  <i className="sidenav-mini-icon"> D S</i>
                  <span className="item-name">Deal Stages</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`${
                    location.pathname ===
                    "dashboardEmployeesAddEmployeeemployee-list"
                      ? "active"
                      : ""
                  } nav-link`}
                  to="/leads-list"
                >
                  <i className="icon">
                    <ListAltIcon fontSize="small" />
                  </i>
                  <i className="sidenav-mini-icon"> L C</i>
                  <span className="item-name">Lead Contact</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`${
                    location.pathname === "dashboard-list" ? "active" : ""
                  } nav-link`}
                  to="/deals-list"
                >
                  <i className="icon">
                    <TaskIcon fontSize="small" />
                  </i>
                  <i className="sidenav-mini-icon"> D </i>
                  <span className="item-name">Deals</span>
                </Link>
              </li>
              {/* <li className="nav-item">
                <Link
                  className={`${
                    location.pathname ===
                    "dashboard/EmployeeManagment/Designation/designation-list"
                      ? "active"
                      : ""
                  } nav-link`}
                  to="dashboard/EmployeeManagment/Designation/designation-list"
                >
                  <i className="icon">
                    <svg
                      width="20"
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
                  <i className="sidenav-mini-icon"> D </i>
                  <span className="item-name">Designation</span>
                </Link>
              </li> */}

              {/* <li className="nav-item">
                <Link
                  className={`${location.pathname === "/auth/sign-in" ? "active" : ""
                    } nav-link`}
                  to="/auth/sign-in"
                >
                  <i className="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <g>
                        <circle
                          cx="12"
                          cy="12"
                          r="8"
                          fill="currentColor"
                        ></circle>
                      </g>
                    </svg>
                  </i>
                  <i className="sidenav-mini-icon"> L </i>
                  <span className="item-name">Login</span>
                </Link>
              </li> */}
              {/* <li className="nav-item">
                <Link
                  className={`${location.pathname === "/auth/sign-up" ? "active" : ""
                    } nav-link`}
                  to="/auth/sign-up"
                >
                  <i className="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <g>
                        <circle
                          cx="12"
                          cy="12"
                          r="8"
                          fill="currentColor"
                        ></circle>
                      </g>
                    </svg>
                  </i>
                  <i className="sidenav-mini-icon"> R </i>
                  <span className="item-name">Register</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`${location.pathname === "/auth/confirm-mail" ? "active" : ""
                    } nav-link`}
                  to="/auth/confirm-mail"
                >
                  <i className="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <g>
                        <circle
                          cx="12"
                          cy="12"
                          r="8"
                          fill="currentColor"
                        ></circle>
                      </g>
                    </svg>
                  </i>
                  <i className="sidenav-mini-icon"> C </i>
                  <span className="item-name">Confirm Mail</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`${location.pathname === "/auth/lock-screen" ? "active" : ""
                    } nav-link`}
                  to="/auth/lock-screen"
                >
                  <i className="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <g>
                        <circle
                          cx="12"
                          cy="12"
                          r="8"
                          fill="currentColor"
                        ></circle>
                      </g>
                    </svg>
                  </i>
                  <i className="sidenav-mini-icon"> L </i>
                  <span className="item-name">Lock Screen</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`${location.pathname === "/auth/recoverpw" ? "active" : ""
                    } nav-link`}
                  to="/auth/recoverpw"
                >
                  <i className="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <g>
                        <circle
                          cx="12"
                          cy="12"
                          r="8"
                          fill="currentColor"
                        ></circle>
                      </g>
                    </svg>
                  </i>
                  <i className="sidenav-mini-icon"> R </i>
                  <span className="item-name">Recover password</span>
                </Link>
              </li> */}
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
              <AccountBalanceWalletSharpIcon fontSize="medium" />
            </i>
            <span className="item-name">Expense</span>
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
                    location.pathname ===
                    "dashboardEmployeesAddEmployeeemployee-list"
                      ? "active"
                      : ""
                  } nav-link`}
                  to="/leads-list"
                >
                  <i className="icon">
                    <CurrencyRupeeSharpIcon fontSize="small" />
                  </i>
                  <i className="sidenav-mini-icon">E C</i>
                  <span className="item-name">Expense Category</span>
                </Link>
              </li>

              {/* <li className="nav-item">
                <Link
                  className={`${
                    location.pathname ===
                    "dashboardEmployeesAddEmployeeemployee-list"
                      ? "active"
                      : ""
                  } nav-link`}
                  to="/leads-list"
                >
                  <i className="icon">
                    <FormatListBulletedSharpIcon fontSize="small" />
                  </i>
                  <i className="sidenav-mini-icon"> D S</i>
                  <span className="item-name">Deal Stages</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`${
                    location.pathname ===
                    "dashboardEmployeesAddEmployeeemployee-list"
                      ? "active"
                      : ""
                  } nav-link`}
                  to="/leads-list"
                >
                  <i className="icon">
                    <ListAltIcon fontSize="small" />
                  </i>
                  <i className="sidenav-mini-icon"> L C</i>
                  <span className="item-name">Lead Contact</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`${
                    location.pathname === "dashboard-list" ? "active" : ""
                  } nav-link`}
                  to="/deals-list"
                >
                  <i className="icon">
                    <TaskIcon fontSize="small" />
                  </i>
                  <i className="sidenav-mini-icon"> D </i>
                  <span className="item-name">Deals</span>
                </Link>
              </li> */}
              {/* <li className="nav-item">
                <Link
                  className={`${
                    location.pathname ===
                    "dashboard/EmployeeManagment/Designation/designation-list"
                      ? "active"
                      : ""
                  } nav-link`}
                  to="dashboard/EmployeeManagment/Designation/designation-list"
                >
                  <i className="icon">
                    <svg
                      width="20"
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
                  <i className="sidenav-mini-icon"> D </i>
                  <span className="item-name">Designation</span>
                </Link>
              </li> */}

              {/* <li className="nav-item">
                <Link
                  className={`${location.pathname === "/auth/sign-in" ? "active" : ""
                    } nav-link`}
                  to="/auth/sign-in"
                >
                  <i className="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <g>
                        <circle
                          cx="12"
                          cy="12"
                          r="8"
                          fill="currentColor"
                        ></circle>
                      </g>
                    </svg>
                  </i>
                  <i className="sidenav-mini-icon"> L </i>
                  <span className="item-name">Login</span>
                </Link>
              </li> */}
              {/* <li className="nav-item">
                <Link
                  className={`${location.pathname === "/auth/sign-up" ? "active" : ""
                    } nav-link`}
                  to="/auth/sign-up"
                >
                  <i className="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <g>
                        <circle
                          cx="12"
                          cy="12"
                          r="8"
                          fill="currentColor"
                        ></circle>
                      </g>
                    </svg>
                  </i>
                  <i className="sidenav-mini-icon"> R </i>
                  <span className="item-name">Register</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`${location.pathname === "/auth/confirm-mail" ? "active" : ""
                    } nav-link`}
                  to="/auth/confirm-mail"
                >
                  <i className="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <g>
                        <circle
                          cx="12"
                          cy="12"
                          r="8"
                          fill="currentColor"
                        ></circle>
                      </g>
                    </svg>
                  </i>
                  <i className="sidenav-mini-icon"> C </i>
                  <span className="item-name">Confirm Mail</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`${location.pathname === "/auth/lock-screen" ? "active" : ""
                    } nav-link`}
                  to="/auth/lock-screen"
                >
                  <i className="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <g>
                        <circle
                          cx="12"
                          cy="12"
                          r="8"
                          fill="currentColor"
                        ></circle>
                      </g>
                    </svg>
                  </i>
                  <i className="sidenav-mini-icon"> L </i>
                  <span className="item-name">Lock Screen</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`${location.pathname === "/auth/recoverpw" ? "active" : ""
                    } nav-link`}
                  to="/auth/recoverpw"
                >
                  <i className="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <g>
                        <circle
                          cx="12"
                          cy="12"
                          r="8"
                          fill="currentColor"
                        ></circle>
                      </g>
                    </svg>
                  </i>
                  <i className="sidenav-mini-icon"> R </i>
                  <span className="item-name">Recover password</span>
                </Link>
              </li> */}
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
              <GroupsIcon />
            </i>
            <span className="item-name">Customer</span>
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
                    location.pathname === "/employee-list" ? "active" : ""
                  } nav-link`}
                  to="/employee-list"
                >
                  <i className="icon">
                    <AccountTreeIcon fontSize="small" />
                  </i>
                  <i className="sidenav-mini-icon"> C </i>
                  <span className="item-name">Customer Category</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`${
                    location.pathname === "leaves-list" ? "active" : ""
                  } nav-link`}
                  to="/leaves-list"
                >
                  <i className="icon">
                    <ContactEmergencyIcon fontSize="small" />
                  </i>
                  <i className="sidenav-mini-icon"> C T </i>
                  <span className="item-name">Contract Type</span>
                </Link>
              </li>
              {/* <li className="nav-item">
                <Link
                  className={`${
                    location.pathname ===
                    "dashboard/EmployeeManagment/Designation/designation-list"
                      ? "active"
                      : ""
                  } nav-link`}
                  to="dashboard/EmployeeManagment/Designation/designation-list"
                >
                  <i className="icon">
                    <svg
                      width="20"
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
                  <i className="sidenav-mini-icon"> D </i>
                  <span className="item-name">Designation</span>
                </Link>
              </li> */}

              {/* <li className="nav-item">
                <Link
                  className={`${location.pathname === "/auth/sign-in" ? "active" : ""
                    } nav-link`}
                  to="/auth/sign-in"
                >
                  <i className="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <g>
                        <circle
                          cx="12"
                          cy="12"
                          r="8"
                          fill="currentColor"
                        ></circle>
                      </g>
                    </svg>
                  </i>
                  <i className="sidenav-mini-icon"> L </i>
                  <span className="item-name">Login</span>
                </Link>
              </li> */}
              {/* <li className="nav-item">
                <Link
                  className={`${location.pathname === "/auth/sign-up" ? "active" : ""
                    } nav-link`}
                  to="/auth/sign-up"
                >
                  <i className="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <g>
                        <circle
                          cx="12"
                          cy="12"
                          r="8"
                          fill="currentColor"
                        ></circle>
                      </g>
                    </svg>
                  </i>
                  <i className="sidenav-mini-icon"> R </i>
                  <span className="item-name">Register</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`${location.pathname === "/auth/confirm-mail" ? "active" : ""
                    } nav-link`}
                  to="/auth/confirm-mail"
                >
                  <i className="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <g>
                        <circle
                          cx="12"
                          cy="12"
                          r="8"
                          fill="currentColor"
                        ></circle>
                      </g>
                    </svg>
                  </i>
                  <i className="sidenav-mini-icon"> C </i>
                  <span className="item-name">Confirm Mail</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`${location.pathname === "/auth/lock-screen" ? "active" : ""
                    } nav-link`}
                  to="/auth/lock-screen"
                >
                  <i className="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <g>
                        <circle
                          cx="12"
                          cy="12"
                          r="8"
                          fill="currentColor"
                        ></circle>
                      </g>
                    </svg>
                  </i>
                  <i className="sidenav-mini-icon"> L </i>
                  <span className="item-name">Lock Screen</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`${location.pathname === "/auth/recoverpw" ? "active" : ""
                    } nav-link`}
                  to="/auth/recoverpw"
                >
                  <i className="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <g>
                        <circle
                          cx="12"
                          cy="12"
                          r="8"
                          fill="currentColor"
                        ></circle>
                      </g>
                    </svg>
                  </i>
                  <i className="sidenav-mini-icon"> R </i>
                  <span className="item-name">Recover password</span>
                </Link>
              </li> */}
            </ul>
          </Accordion.Collapse>
        </Accordion.Item>

        {/* <Accordion.Item
          as="li"
          eventKey="sidebar-user"
          bsPrefix={`nav-item ${active === "user" ? "active" : ""} `}
          onClick={() => setActive("user")}
        >
          <CustomToggle
            eventKey="sidebar-user"
            onClick={(activeKey) => setActiveMenu(activeKey)}
          >
            <i className="icon">
              <svg
                width="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.9488 14.54C8.49884 14.54 5.58789 15.1038 5.58789 17.2795C5.58789 19.4562 8.51765 20.0001 11.9488 20.0001C15.3988 20.0001 18.3098 19.4364 18.3098 17.2606C18.3098 15.084 15.38 14.54 11.9488 14.54Z"
                  fill="currentColor"
                ></path>
                <path
                  opacity="0.4"
                  d="M11.949 12.467C14.2851 12.467 16.1583 10.5831 16.1583 8.23351C16.1583 5.88306 14.2851 4 11.949 4C9.61293 4 7.73975 5.88306 7.73975 8.23351C7.73975 10.5831 9.61293 12.467 11.949 12.467Z"
                  fill="currentColor"
                ></path>
                <path
                  opacity="0.4"
                  d="M21.0881 9.21923C21.6925 6.84176 19.9205 4.70654 17.664 4.70654C17.4187 4.70654 17.1841 4.73356 16.9549 4.77949C16.9244 4.78669 16.8904 4.802 16.8725 4.82902C16.8519 4.86324 16.8671 4.90917 16.8895 4.93889C17.5673 5.89528 17.9568 7.0597 17.9568 8.30967C17.9568 9.50741 17.5996 10.6241 16.9728 11.5508C16.9083 11.6462 16.9656 11.775 17.0793 11.7948C17.2369 11.8227 17.3981 11.8371 17.5629 11.8416C19.2059 11.8849 20.6807 10.8213 21.0881 9.21923Z"
                  fill="currentColor"
                ></path>
                <path
                  d="M22.8094 14.817C22.5086 14.1722 21.7824 13.73 20.6783 13.513C20.1572 13.3851 18.747 13.205 17.4352 13.2293C17.4155 13.232 17.4048 13.2455 17.403 13.2545C17.4003 13.2671 17.4057 13.2887 17.4316 13.3022C18.0378 13.6039 20.3811 14.916 20.0865 17.6834C20.074 17.8032 20.1698 17.9068 20.2888 17.8888C20.8655 17.8059 22.3492 17.4853 22.8094 16.4866C23.0637 15.9589 23.0637 15.3456 22.8094 14.817Z"
                  fill="currentColor"
                ></path>
                <path
                  opacity="0.4"
                  d="M7.04459 4.77973C6.81626 4.7329 6.58077 4.70679 6.33543 4.70679C4.07901 4.70679 2.30701 6.84201 2.9123 9.21947C3.31882 10.8216 4.79355 11.8851 6.43661 11.8419C6.60136 11.8374 6.76343 11.8221 6.92013 11.7951C7.03384 11.7753 7.09115 11.6465 7.02668 11.551C6.3999 10.6234 6.04263 9.50765 6.04263 8.30991C6.04263 7.05904 6.43303 5.89462 7.11085 4.93913C7.13234 4.90941 7.14845 4.86348 7.12696 4.82926C7.10906 4.80135 7.07593 4.78694 7.04459 4.77973Z"
                  fill="currentColor"
                ></path>
                <path
                  d="M3.32156 13.5127C2.21752 13.7297 1.49225 14.1719 1.19139 14.8167C0.936203 15.3453 0.936203 15.9586 1.19139 16.4872C1.65163 17.4851 3.13531 17.8066 3.71195 17.8885C3.83104 17.9065 3.92595 17.8038 3.91342 17.6832C3.61883 14.9167 5.9621 13.6046 6.56918 13.3029C6.59425 13.2885 6.59962 13.2677 6.59694 13.2542C6.59515 13.2452 6.5853 13.2317 6.5656 13.2299C5.25294 13.2047 3.84358 13.3848 3.32156 13.5127Z"
                  fill="currentColor"
                ></path>
              </svg>
            </i>
            <span className="item-name">Users</span>
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
          <Accordion.Collapse eventKey="sidebar-user">
            <ul className="sub-nav">
              <li className="nav-item">
                <Link
                  className={`${
                    location.pathname === "/dashboard/app/user-profile"
                      ? "active"
                      : ""
                  } nav-link`}
                  to="/dashboard/app/user-profile"
                >
                  <i className="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <g>
                        <circle
                          cx="12"
                          cy="12"
                          r="8"
                          fill="currentColor"
                        ></circle>
                      </g>
                    </svg>
                  </i>
                  <i className="sidenav-mini-icon"> U </i>
                  <span className="item-name">User Profile</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`${
                    location.pathname === "/dashboard/app/user-add"
                      ? "active"
                      : ""
                  } nav-link`}
                  to="/dashboard/app/user-add"
                >
                  <i className="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <g>
                        <circle
                          cx="12"
                          cy="12"
                          r="8"
                          fill="currentColor"
                        ></circle>
                      </g>
                    </svg>
                  </i>
                  <i className="sidenav-mini-icon"> E </i>
                  <span className="item-name">Add User</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`${
                    location.pathname === "/dashboard/app/user-list"
                      ? "active"
                      : ""
                  } nav-link`}
                  to="/dashboard/app/user-list"
                >
                  <i className="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <g>
                        <circle
                          cx="12"
                          cy="12"
                          r="8"
                          fill="currentColor"
                        ></circle>
                      </g>
                    </svg>
                  </i>
                  <i className="sidenav-mini-icon"> U </i>
                  <span className="item-name">User List</span>
                </Link>
              </li>
            </ul>
          </Accordion.Collapse>
        </Accordion.Item>
        <Accordion.Item
          as="li"
          eventKey="utilities-error"
          bsPrefix={`nav-item ${active === "error" ? "active" : ""} `}
          onClick={() => setActive("error")}
        >
          <CustomToggle
            eventKey="utilities-error"
            active={activeMenu === "utilities-error" ? true : false}
            onClick={(activeKey) => setActiveMenu(activeKey)}
          >
            <i className="icon">
              <svg
                width="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  opacity="0.4"
                  d="M11.9912 18.6215L5.49945 21.864C5.00921 22.1302 4.39768 21.9525 4.12348 21.4643C4.0434 21.3108 4.00106 21.1402 4 20.9668V13.7087C4 14.4283 4.40573 14.8725 5.47299 15.37L11.9912 18.6215Z"
                  fill="currentColor"
                ></path>
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M8.89526 2H15.0695C17.7773 2 19.9735 3.06605 20 5.79337V20.9668C19.9989 21.1374 19.9565 21.3051 19.8765 21.4554C19.7479 21.7007 19.5259 21.8827 19.2615 21.9598C18.997 22.0368 18.7128 22.0023 18.4741 21.8641L11.9912 18.6215L5.47299 15.3701C4.40573 14.8726 4 14.4284 4 13.7088V5.79337C4 3.06605 6.19625 2 8.89526 2ZM8.22492 9.62227H15.7486C16.1822 9.62227 16.5336 9.26828 16.5336 8.83162C16.5336 8.39495 16.1822 8.04096 15.7486 8.04096H8.22492C7.79137 8.04096 7.43991 8.39495 7.43991 8.83162C7.43991 9.26828 7.79137 9.62227 8.22492 9.62227Z"
                  fill="currentColor"
                ></path>
              </svg>
            </i>
            <span className="item-name">Utilities</span>
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
          <Accordion.Collapse eventKey="utilities-error">
            <ul className="sub-nav">
              <li className="nav-item">
                <Link
                  className={`${
                    location.pathname === "/errors/error404" ? "active" : ""
                  } nav-link`}
                  to="/errors/error404"
                >
                  <i className="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <g>
                        <circle
                          cx="12"
                          cy="12"
                          r="8"
                          fill="currentColor"
                        ></circle>
                      </g>
                    </svg>
                  </i>
                  <span className="item-name">Error 404</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`${
                    location.pathname === "/errors/error500" ? "active" : ""
                  } nav-link`}
                  to="/errors/error500"
                >
                  <i className="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <g>
                        <circle
                          cx="12"
                          cy="12"
                          r="8"
                          fill="currentColor"
                        ></circle>
                      </g>
                    </svg>
                  </i>
                  <span className="item-name">Error 500</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`${
                    location.pathname === "/errors/maintenance" ? "active" : ""
                  } nav-link`}
                  to="/errors/maintenance"
                >
                  <i className="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <g>
                        <circle
                          cx="12"
                          cy="12"
                          r="8"
                          fill="currentColor"
                        ></circle>
                      </g>
                    </svg>
                  </i>
                  <span className="item-name">Maintenance</span>
                </Link>
              </li>
            </ul>
          </Accordion.Collapse>
        </Accordion.Item>
        <li className="nav-item">
          <Link
            className={`${
              location.pathname === "/dashboard/admin/admin" ? "active" : ""
            } nav-link`}
            to="/dashboard/admin/admin"
          >
            <i className="icon">
              <svg
                width="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M7.7688 8.71387H16.2312C18.5886 8.71387 20.5 10.5831 20.5 12.8885V17.8254C20.5 20.1308 18.5886 22 16.2312 22H7.7688C5.41136 22 3.5 20.1308 3.5 17.8254V12.8885C3.5 10.5831 5.41136 8.71387 7.7688 8.71387ZM11.9949 17.3295C12.4928 17.3295 12.8891 16.9419 12.8891 16.455V14.2489C12.8891 13.772 12.4928 13.3844 11.9949 13.3844C11.5072 13.3844 11.1109 13.772 11.1109 14.2489V16.455C11.1109 16.9419 11.5072 17.3295 11.9949 17.3295Z"
                  fill="currentColor"
                ></path>
                <path
                  opacity="0.4"
                  d="M17.523 7.39595V8.86667C17.1673 8.7673 16.7913 8.71761 16.4052 8.71761H15.7447V7.39595C15.7447 5.37868 14.0681 3.73903 12.0053 3.73903C9.94257 3.73903 8.26594 5.36874 8.25578 7.37608V8.71761H7.60545C7.20916 8.71761 6.83319 8.7673 6.47754 8.87661V7.39595C6.4877 4.41476 8.95692 2 11.985 2C15.0537 2 17.523 4.41476 17.523 7.39595Z"
                  fill="currentColor"
                ></path>
              </svg>
            </i>
            <span className="item-name">Admin</span>
          </Link>
        </li>
        <li>
          <hr className="hr-horizontal" />
        </li>
        <li className="nav-item static-item">
          <Link className="nav-link static-item disabled" to="#" tabIndex="-1">
            <span className="default-icon">Elements</span>
            <span className="mini-icon">-</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/">
            <i className="icon">
              <svg
                width="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  opacity="0.4"
                  d="M2 11.0786C2.05 13.4166 2.19 17.4156 2.21 17.8566C2.281 18.7996 2.642 19.7526 3.204 20.4246C3.986 21.3676 4.949 21.7886 6.292 21.7886C8.148 21.7986 10.194 21.7986 12.181 21.7986C14.176 21.7986 16.112 21.7986 17.747 21.7886C19.071 21.7886 20.064 21.3566 20.836 20.4246C21.398 19.7526 21.759 18.7896 21.81 17.8566C21.83 17.4856 21.93 13.1446 21.99 11.0786H2Z"
                  fill="currentColor"
                ></path>
                <path
                  d="M11.2451 15.3843V16.6783C11.2451 17.0923 11.5811 17.4283 11.9951 17.4283C12.4091 17.4283 12.7451 17.0923 12.7451 16.6783V15.3843C12.7451 14.9703 12.4091 14.6343 11.9951 14.6343C11.5811 14.6343 11.2451 14.9703 11.2451 15.3843Z"
                  fill="currentColor"
                ></path>
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M10.211 14.5565C10.111 14.9195 9.762 15.1515 9.384 15.1015C6.833 14.7455 4.395 13.8405 2.337 12.4815C2.126 12.3435 2 12.1075 2 11.8555V8.38949C2 6.28949 3.712 4.58149 5.817 4.58149H7.784C7.972 3.12949 9.202 2.00049 10.704 2.00049H13.286C14.787 2.00049 16.018 3.12949 16.206 4.58149H18.183C20.282 4.58149 21.99 6.28949 21.99 8.38949V11.8555C21.99 12.1075 21.863 12.3425 21.654 12.4815C19.592 13.8465 17.144 14.7555 14.576 15.1105C14.541 15.1155 14.507 15.1175 14.473 15.1175C14.134 15.1175 13.831 14.8885 13.746 14.5525C13.544 13.7565 12.821 13.1995 11.99 13.1995C11.148 13.1995 10.433 13.7445 10.211 14.5565ZM13.286 3.50049H10.704C10.031 3.50049 9.469 3.96049 9.301 4.58149H14.688C14.52 3.96049 13.958 3.50049 13.286 3.50049Z"
                  fill="currentColor"
                ></path>
              </svg>
            </i>
            <span className="item-name">Components</span>
          </Link>
        </li>
        <Accordion.Item
          as="li"
          eventKey="sidebar-widget"
          bsPrefix={` ${
            location.pathname === "/dashboard/widget/widgetbasic" ||
            location.pathname === "/dashboard/widget/widgetchart" ||
            location.pathname === "/dashboard/widget/widgetcard"
              ? "active"
              : "" || active === "widget"
              ? "active"
              : ""
          } nav-item`}
          onClick={() => setActive("widget")}
        >
          <CustomToggle
            eventKey="sidebar-widget"
            active={activeMenu === "sidebar-widget" ? true : false}
            onClick={(activeKey) => setActiveMenu(activeKey)}
          >
            <i className="icon">
              <svg
                width="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  opacity="0.4"
                  d="M21.25 13.4764C20.429 13.4764 19.761 12.8145 19.761 12.001C19.761 11.1865 20.429 10.5246 21.25 10.5246C21.449 10.5246 21.64 10.4463 21.78 10.3076C21.921 10.1679 22 9.97864 22 9.78146L21.999 7.10415C21.999 4.84102 20.14 3 17.856 3H6.144C3.86 3 2.001 4.84102 2.001 7.10415L2 9.86766C2 10.0648 2.079 10.2541 2.22 10.3938C2.36 10.5325 2.551 10.6108 2.75 10.6108C3.599 10.6108 4.239 11.2083 4.239 12.001C4.239 12.8145 3.571 13.4764 2.75 13.4764C2.336 13.4764 2 13.8093 2 14.2195V16.8949C2 19.158 3.858 21 6.143 21H17.857C20.142 21 22 19.158 22 16.8949V14.2195C22 13.8093 21.664 13.4764 21.25 13.4764Z"
                  fill="currentColor"
                ></path>
                <path
                  d="M15.4303 11.5887L14.2513 12.7367L14.5303 14.3597C14.5783 14.6407 14.4653 14.9177 14.2343 15.0837C14.0053 15.2517 13.7063 15.2727 13.4543 15.1387L11.9993 14.3737L10.5413 15.1397C10.4333 15.1967 10.3153 15.2267 10.1983 15.2267C10.0453 15.2267 9.89434 15.1787 9.76434 15.0847C9.53434 14.9177 9.42134 14.6407 9.46934 14.3597L9.74734 12.7367L8.56834 11.5887C8.36434 11.3907 8.29334 11.0997 8.38134 10.8287C8.47034 10.5587 8.70034 10.3667 8.98134 10.3267L10.6073 10.0897L11.3363 8.61268C11.4633 8.35868 11.7173 8.20068 11.9993 8.20068H12.0013C12.2843 8.20168 12.5383 8.35968 12.6633 8.61368L13.3923 10.0897L15.0213 10.3277C15.2993 10.3667 15.5293 10.5587 15.6173 10.8287C15.7063 11.0997 15.6353 11.3907 15.4303 11.5887Z"
                  fill="currentColor"
                ></path>
              </svg>
            </i>
            <span className="item-name">widget</span>
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
          <Accordion.Collapse eventKey="sidebar-widget">
            <ul className="sub-nav">
              <li className="nav-item">
                <Link
                  className={`${
                    location.pathname === "/dashboard/widget/widgetbasic"
                      ? "active"
                      : ""
                  } nav-link`}
                  to="/dashboard/widget/widgetbasic"
                >
                  <i className="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <g>
                        <circle
                          cx="12"
                          cy="12"
                          r="8"
                          fill="currentColor"
                        ></circle>
                      </g>
                    </svg>
                  </i>
                  <i className="sidenav-mini-icon"> W </i>
                  <span className="item-name">Widget Basic</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`${
                    location.pathname === "/dashboard/widget/widgetchart"
                      ? "active"
                      : ""
                  } nav-link`}
                  to="/dashboard/widget/widgetchart"
                >
                  <i className="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <g>
                        <circle
                          cx="12"
                          cy="12"
                          r="8"
                          fill="currentColor"
                        ></circle>
                      </g>
                    </svg>
                  </i>
                  <i className="sidenav-mini-icon"> W </i>
                  <span className="item-name">Widget Chart</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`${
                    location.pathname === "/dashboard/widget/widgetcard"
                      ? "active"
                      : ""
                  } nav-link`}
                  to="/dashboard/widget/widgetcard"
                >
                  <i className="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <g>
                        <circle
                          cx="12"
                          cy="12"
                          r="8"
                          fill="currentColor"
                        ></circle>
                      </g>
                    </svg>
                  </i>
                  <i className="sidenav-mini-icon"> W </i>
                  <span className="item-name">Widget Card</span>
                </Link>
              </li>
            </ul>
          </Accordion.Collapse>
        </Accordion.Item>
        <Accordion.Item
          as="li"
          eventKey="sidebar-maps"
          bsPrefix={`nav-item ${active === "maps" ? "active" : ""} `}
          onClick={() => setActive("maps")}
        >
          <CustomToggle
            eventKey="sidebar-maps"
            active={activeMenu === "sidebar-maps" ? true : false}
            onClick={(activeKey) => setActiveMenu(activeKey)}
          >
            <i className="icon">
              <svg
                width="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M8.53162 2.93677C10.7165 1.66727 13.402 1.68946 15.5664 2.99489C17.7095 4.32691 19.012 6.70418 18.9998 9.26144C18.95 11.8019 17.5533 14.19 15.8075 16.0361C14.7998 17.1064 13.6726 18.0528 12.4488 18.856C12.3228 18.9289 12.1848 18.9777 12.0415 19C11.9036 18.9941 11.7693 18.9534 11.6508 18.8814C9.78243 17.6746 8.14334 16.134 6.81233 14.334C5.69859 12.8314 5.06584 11.016 5 9.13442C4.99856 6.57225 6.34677 4.20627 8.53162 2.93677ZM9.79416 10.1948C10.1617 11.1008 11.0292 11.6918 11.9916 11.6918C12.6221 11.6964 13.2282 11.4438 13.6748 10.9905C14.1214 10.5371 14.3715 9.92064 14.3692 9.27838C14.3726 8.29804 13.7955 7.41231 12.9073 7.03477C12.0191 6.65723 10.995 6.86235 10.3133 7.55435C9.63159 8.24635 9.42664 9.28872 9.79416 10.1948Z"
                  fill="currentColor"
                ></path>
                <ellipse
                  opacity="0.4"
                  cx="12"
                  cy="21"
                  rx="5"
                  ry="1"
                  fill="currentColor"
                ></ellipse>
              </svg>
            </i>
            <span className="item-name">Maps</span>
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
          <Accordion.Collapse eventKey="sidebar-maps">
            <ul className="sub-nav">
              <li className="nav-item">
                <Link
                  className={`${
                    location.pathname === "/dashboard/map/google"
                      ? "active"
                      : ""
                  } nav-link`}
                  to="/dashboard/map/google"
                >
                  <i className="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <g>
                        <circle
                          cx="12"
                          cy="12"
                          r="8"
                          fill="currentColor"
                        ></circle>
                      </g>
                    </svg>
                  </i>
                  <i className="sidenav-mini-icon"> G </i>
                  <span className="item-name">Google</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`${
                    location.pathname === "/dashboard/map/vector"
                      ? "active"
                      : ""
                  } nav-link`}
                  to="/dashboard/map/vector"
                >
                  <i className="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <g>
                        <circle
                          cx="12"
                          cy="12"
                          r="8"
                          fill="currentColor"
                        ></circle>
                      </g>
                    </svg>
                  </i>
                  <i className="sidenav-mini-icon"> V </i>
                  <span className="item-name">Vector</span>
                </Link>
              </li>
            </ul>
          </Accordion.Collapse>
        </Accordion.Item>
        <Accordion.Item
          as="li"
          eventKey="sidebar-form"
          bsPrefix={`nav-item ${active === "form" ? "active" : ""} `}
          onClick={() => setActive("form")}
        >
          <CustomToggle
            eventKey="sidebar-form"
            active={activeMenu === "sidebar-form" ? true : false}
            onClick={(activeKey) => setActiveMenu(activeKey)}
          >
            <i className="icon">
              <svg
                width="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  opacity="0.4"
                  d="M16.191 2H7.81C4.77 2 3 3.78 3 6.83V17.16C3 20.26 4.77 22 7.81 22H16.191C19.28 22 21 20.26 21 17.16V6.83C21 3.78 19.28 2 16.191 2Z"
                  fill="currentColor"
                ></path>
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M8.07996 6.6499V6.6599C7.64896 6.6599 7.29996 7.0099 7.29996 7.4399C7.29996 7.8699 7.64896 8.2199 8.07996 8.2199H11.069C11.5 8.2199 11.85 7.8699 11.85 7.4289C11.85 6.9999 11.5 6.6499 11.069 6.6499H8.07996ZM15.92 12.7399H8.07996C7.64896 12.7399 7.29996 12.3899 7.29996 11.9599C7.29996 11.5299 7.64896 11.1789 8.07996 11.1789H15.92C16.35 11.1789 16.7 11.5299 16.7 11.9599C16.7 12.3899 16.35 12.7399 15.92 12.7399ZM15.92 17.3099H8.07996C7.77996 17.3499 7.48996 17.1999 7.32996 16.9499C7.16996 16.6899 7.16996 16.3599 7.32996 16.1099C7.48996 15.8499 7.77996 15.7099 8.07996 15.7399H15.92C16.319 15.7799 16.62 16.1199 16.62 16.5299C16.62 16.9289 16.319 17.2699 15.92 17.3099Z"
                  fill="currentColor"
                ></path>
              </svg>
            </i>
            <span className="item-name">Form</span>
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
          <Accordion.Collapse eventKey="sidebar-form">
            <ul className="sub-nav">
              <li className="nav-item">
                <Link
                  className={`${
                    location.pathname === "/dashboard/form/form-element"
                      ? "active"
                      : ""
                  } nav-link`}
                  to="/dashboard/form/form-element"
                >
                  <i className="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <g>
                        <circle
                          cx="12"
                          cy="12"
                          r="8"
                          fill="currentColor"
                        ></circle>
                      </g>
                    </svg>
                  </i>
                  <i className="sidenav-mini-icon"> E </i>
                  <span className="item-name">Elements</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`${
                    location.pathname === "/dashboard/form/form-wizard"
                      ? "active"
                      : ""
                  } nav-link`}
                  to="/dashboard/form/form-wizard"
                >
                  <i className="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <g>
                        <circle
                          cx="12"
                          cy="12"
                          r="8"
                          fill="currentColor"
                        ></circle>
                      </g>
                    </svg>
                  </i>
                  <i className="sidenav-mini-icon"> W </i>
                  <span className="item-name">Wizard</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`${
                    location.pathname === "/dashboard/form/form-validation"
                      ? "active"
                      : ""
                  } nav-link`}
                  to="/dashboard/form/form-validation"
                >
                  <i className="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <g>
                        <circle
                          cx="12"
                          cy="12"
                          r="8"
                          fill="currentColor"
                        ></circle>
                      </g>
                    </svg>
                  </i>
                  <i className="sidenav-mini-icon"> V </i>
                  <span className="item-name">Validation</span>
                </Link>
              </li>
            </ul>
          </Accordion.Collapse>
        </Accordion.Item>
        <Accordion.Item
          as="li"
          eventKey="sidebar-table"
          bsPrefix={`nav-item ${active === "table" ? "active" : ""} `}
          onClick={() => setActive("table")}
        >
          <CustomToggle
            eventKey="sidebar-table"
            onClick={(activeKey) => setActiveMenu(activeKey)}
          >
            <i className="icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M2 5C2 4.44772 2.44772 4 3 4H8.66667H21C21.5523 4 22 4.44772 22 5V8H15.3333H8.66667H2V5Z"
                  fill="currentColor"
                  stroke="currentColor"
                />
                <path
                  d="M6 8H2V11M6 8V20M6 8H14M6 20H3C2.44772 20 2 19.5523 2 19V11M6 20H14M14 8H22V11M14 8V20M14 20H21C21.5523 20 22 19.5523 22 19V11M2 11H22M2 14H22M2 17H22M10 8V20M18 8V20"
                  stroke="currentColor"
                />
              </svg>
            </i>
            <span className="item-name">Table</span>
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
          <Accordion.Collapse eventKey="sidebar-table">
            <ul className="sub-nav">
              <li className="nav-item">
                <Link
                  className={`${
                    location.pathname === "/dashboard/table/bootstrap-table"
                      ? "active"
                      : ""
                  } nav-link`}
                  to="/dashboard/table/bootstrap-table"
                >
                  <i className="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <g>
                        <circle
                          cx="12"
                          cy="12"
                          r="8"
                          fill="currentColor"
                        ></circle>
                      </g>
                    </svg>
                  </i>
                  <i className="sidenav-mini-icon"> B </i>
                  <span className="item-name">Bootstrap Table</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`${
                    location.pathname === "/dashboard/table/table-data"
                      ? "active"
                      : ""
                  } nav-link`}
                  to="/dashboard/table/table-data"
                >
                  <i className="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <g>
                        <circle
                          cx="12"
                          cy="12"
                          r="8"
                          fill="currentColor"
                        ></circle>
                      </g>
                    </svg>
                  </i>
                  <i className="sidenav-mini-icon"> D </i>
                  <span className="item-name">Datatable</span>
                </Link>
              </li>
            </ul>
          </Accordion.Collapse>
        </Accordion.Item>
        <Accordion.Item
          as="li"
          eventKey="sidebar-icons"
          bsPrefix={`nav-item mb-5 ${active === "icons" ? "active" : ""} `}
          onClick={() => setActive("icons")}
        >
          <CustomToggle
            eventKey="sidebar-icons"
            onClick={(activeKey) => setActiveMenu(activeKey)}
          >
            <i className="icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  d="M8 10.5378C8 9.43327 8.89543 8.53784 10 8.53784H11.3333C12.4379 8.53784 13.3333 9.43327 13.3333 10.5378V19.8285C13.3333 20.9331 14.2288 21.8285 15.3333 21.8285H16C16 21.8285 12.7624 23.323 10.6667 22.9361C10.1372 22.8384 9.52234 22.5913 9.01654 22.3553C8.37357 22.0553 8 21.3927 8 20.6832V10.5378Z"
                  fill="currentColor"
                />
                <rect
                  opacity="0.4"
                  x="8"
                  y="1"
                  width="5"
                  height="5"
                  rx="2.5"
                  fill="currentColor"
                />
              </svg>
            </i>
            <span className="item-name">Icons</span>
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
          <Accordion.Collapse eventKey="sidebar-icons">
            <ul className="sub-nav">
              <li className="nav-item">
                <Link
                  className={`${
                    location.pathname === "/dashboard/icon/solid"
                      ? "active"
                      : ""
                  } nav-link`}
                  to="/dashboard/icon/solid"
                >
                  <i className="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <g>
                        <circle
                          cx="12"
                          cy="12"
                          r="8"
                          fill="currentColor"
                        ></circle>
                      </g>
                    </svg>
                  </i>
                  <i className="sidenav-mini-icon"> S </i>
                  <span className="item-name">Solid</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`${
                    location.pathname === "/dashboard/icon/outline"
                      ? "active"
                      : ""
                  } nav-link`}
                  to="/dashboard/icon/outline"
                >
                  <i className="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <g>
                        <circle
                          cx="12"
                          cy="12"
                          r="8"
                          fill="currentColor"
                        ></circle>
                      </g>
                    </svg>
                  </i>
                  <i className="sidenav-mini-icon"> O </i>
                  <span className="item-name">Outlined</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`${
                    location.pathname === "/dashboard/icon/dual-tone"
                      ? "active"
                      : ""
                  } nav-link`}
                  to="/dashboard/icon/dual-tone"
                >
                  <i className="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <g>
                        <circle
                          cx="12"
                          cy="12"
                          r="8"
                          fill="currentColor"
                        ></circle>
                      </g>
                    </svg>
                  </i>
                  <i className="sidenav-mini-icon"> D </i>
                  <span className="item-name">Dual Tone</span>
                </Link>
              </li>
            </ul>
          </Accordion.Collapse>
        </Accordion.Item> */}
      </Accordion>
    </Fragment>
  );
});

export default VerticalNav;
