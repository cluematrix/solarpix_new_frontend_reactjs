import React from "react";
import Index from "../views/dashboard/index";
// import { Switch, Route } from 'react-router-dom'
// user
import UserProfile from "../views/dashboard/app/user-profile";
import UserAdd from "../views/dashboard/app/user-add";
import UserList from "../views/dashboard/app/user-list";

//Admin
import RoleList from "../views/dashboard/role/role-list";
import RolePList from "../views/dashboard/RolePermission/rolep-list";
//Master 10 Aug
import DepartmentList from "../views/dashboard/EmployeeManagment/Department/department-list"; //10 Aug
import ShiftList from "../views/dashboard/EmployeeManagment/Shift/shift-list"; //12 Aug
import EmployeeType from "../views/dashboard/EmployeeManagment/EmployeeType/EmployeeTypes";
import LeaveType from "../views/dashboard/EmployeeManagment/LeaveType/LeaveTypes";
import AwardList from "../views/dashboard/EmployeeManagment/Award/awards/award-list";
import Holiday from "../views/dashboard/EmployeeManagment/Holidays/Holiday";
import DefaultHoliday from "../views/dashboard/EmployeeManagment/DefaultHoliday/DefaultHoliday";

// employee
import EmployeeList from "../views/dashboard/Employees/AddEmployee/employeeList"; // 11 Aug
import AddEmployee from "../views/dashboard/Employees/AddEmployee/addEmployee"; //12 Aug

import LeavesList from "../views/dashboard/Employees/Leaves/leaves-list"; //12 Aug

// expense Category
import ExpenseCategory from "../views/dashboard/Expense/ExpenseCategory/ExpenseCategory"; //26 Aug
import Expensess from "../views/dashboard/Expense/Expenses/Expensess";
// work
// Leads
import LeadsList from "../views/dashboard/Leads/Leadcontact/leads-list"; //12 Aug
import LeadFollowupList from "../views/dashboard/Leads/LeadfollowUp/leadfollowuplist"; //12 Sept
// import userProfileEdit from '../views/dashboard/app/user-privacy-setting';
// widget
import Widgetbasic from "../views/dashboard/widget/widgetbasic";
import Widgetcard from "../views/dashboard/widget/widgetcard";
import Widgetchart from "../views/dashboard/widget/widgetchart";
// icon
import Solid from "../views/dashboard/icons/solid";
import Outline from "../views/dashboard/icons/outline";
import DualTone from "../views/dashboard/icons/dual-tone";
// Form
import FormElement from "../views/dashboard/from/form-element";
import FormValidation from "../views/dashboard/from/form-validation";
import FormWizard from "../views/dashboard/from/form-wizard";
// table
import BootstrapTable from "../views/dashboard/table/bootstrap-table";
import TableData from "../views/dashboard/table/table-data";

// map
import Vector from "../views/dashboard/maps/vector";
import Google from "../views/dashboard/maps/google";

//Special Pages
import Kanban from "../views/dashboard/special-pages/kanban";
import Pricing from "../views/dashboard/special-pages/pricing";
import Timeline from "../views/dashboard/special-pages/timeline";
import Calender from "../views/dashboard/special-pages/calender";
import RtlSupport from "../views/dashboard/special-pages/RtlSupport";
//admin
import Admin from "../views/dashboard/admin/admin";
import Default from "../layouts/dashboard/default";

// employee 01 Sep
import UpdateEmployee from "../views/dashboard/Employees/AddEmployee/updateEmployee";
import NoticeBoard from "../views/dashboard/Notices/Notice/notice-list";
import AppreciationList from "../views/dashboard/EmployeeManagment/Award/Appreciations/Appreciation-list";
import RequirementList from "../views/dashboard/Leads/requirementType/requirement-list";
import SourceTrackList from "../views/dashboard/Leads/SourceTracking/SourceTrackList";
import RateList from "../views/dashboard/Leads/Rates/RateList";
import SettingsSidebarWithTabs from "../views/dashboard/SettingPage/SettingsSidebarWithTabs";
import AttedenceList from "../views/dashboard/EmployeeManagment/Attedence/AttedenceList";
import EmployeeSalaryList from "../views/dashboard/Employees/EmployeeSalary/EmployeeSalaryList";
import EmployeePayrollList from "../views/dashboard/Employees/EmployeePayroll/EmployeePayrollList";
// employee profile 01 Sep

// item
import Item from "../views/dashboard/Items/item";
// vendor
import Vendor from "../views/dashboard/Vendor/vendor";
// warehouse
import Warehouse from "../views/dashboard/Warehouse/warehouse";

// purchaseorder

export const DefaultRouter = [
  {
    path: "/",
    element: <Default />,
    children: [
      {
        path: "/",
        element: <Index />,
      },

      {
        path: "/dashboard",
        element: <Index />,
      },

      // setting page
      {
        path: "dashboard/app/settings",
        element: <SettingsSidebarWithTabs />,
      },
      {
        path: "dashboard/special-pages/calender",
        element: <Calender />,
      },
      {
        path: "dashboard/special-pages/kanban",
        element: <Kanban />,
      },
      {
        path: "dashboard/special-pages/pricing",
        element: <Pricing />,
      },
      {
        path: "dashboard/special-pages/timeline",
        element: <Timeline />,
      },
      {
        path: "dashboard/special-pages/rtl-support",
        element: <RtlSupport />,
      },
      {
        path: "dashboard/app/user-profile",
        element: <UserProfile />,
      },
      {
        path: "dashboard/app/user-add",
        element: <UserAdd />,
      },
      {
        path: "dashboard/app/user-list",
        element: <UserList />,
      },
      {
        path: "dashboard/admin/admin",
        element: <Admin />,
      },
      // role   07 Aug 2025    rishi
      {
        path: "/role-list",
        element: <RoleList />,
      },
      {
        path: "/rolep-list",
        element: <RolePList />,
      },

      //Master
      //08 Aug 2025
      {
        path: "/department-list",
        element: <DepartmentList />,
      },

      //08 Aug 2025
      {
        path: "/EmployeeType",
        element: <EmployeeType />,
      },

      {
        path: "/Attendance",
        element: <AttedenceList />,
      },

      {
        path: "/LeaveType",
        element: <LeaveType />,
      },

      {
        path: "/award-list",
        element: <AwardList />,
      },

      {
        path: "/Appreciation-list",
        element: <AppreciationList />,
      },

      {
        path: "/holiday",
        element: <Holiday />,
      },

      {
        path: "/default-holiday",
        element: <DefaultHoliday />,
      },

      //10 Aug 2025
      {
        path: "/shift-list",
        element: <ShiftList />,
      },


      //item
      {
        path: "Item",
        element: <Item />,
      },

      // vendor
      {
        path: "Vendor",
        element: <Vendor />,
      },

      // warehouse
      {
        path: "Warehouse",
        element: <Warehouse />,
      },  

      //Employee Manage 08 Aug 2025 rishi
      {
        path: "/employee-list",
        element: <EmployeeList />,
      },

      {
        path: "/add-employee",
        element: <AddEmployee />,
      },

      {
        path: "/EmployeeSalary",
        element: <EmployeeSalaryList />,
      },
      {
        path: "/EmployeePayrollList",
        element: <EmployeePayrollList />,
      },
      {
        path: "update-employee/:id", //13 Aug
        element: <UpdateEmployee />,
      },

      {
        path: "/leaves-list",
        element: <LeavesList />,
      },

      // notice
      {
        path: "/notice-board",
        element: <NoticeBoard />,
      },

      {
        path: "/ExpenseCategory-list",
        element: <ExpenseCategory />,
      },

      {
        path: "/Expensess-list",
        element: <Expensess />,
      },

      // leads
      {
        path: "/leads-list",
        element: <LeadsList />,
      },

      {
        path: "/RateList",
        element: <RateList />,
      },

      {
        path: "/SourceTrackList",
        element: <SourceTrackList />,
      },
      {
        path: "/LeadFollowupList",
        element: <LeadFollowupList />,
      },

      {
        path: "/requirement-list",
        element: <RequirementList />,
      },

      // Widget
      {
        path: "dashboard/widget/widgetbasic",
        element: <Widgetbasic />,
      },
      {
        path: "dashboard/widget/widgetchart",
        element: <Widgetchart />,
      },
      {
        path: "dashboard/widget/widgetcard",
        element: <Widgetcard />,
      },
      // Map
      {
        path: "dashboard/map/google",
        element: <Google />,
      },
      {
        path: "dashboard/map/vector",
        element: <Vector />,
      },
      // Form
      {
        path: "dashboard/form/form-element",
        element: <FormElement />,
      },
      {
        path: "dashboard/form/form-wizard",
        element: <FormWizard />,
      },
      {
        path: "dashboard/form/form-validation",
        element: <FormValidation />,
      },
      // Table
      {
        path: "dashboard/table/bootstrap-table",
        element: <BootstrapTable />,
      },
      {
        path: "dashboard/table/table-data",
        element: <TableData />,
      },
      // Icon
      {
        path: "dashboard/icon/solid",
        element: <Solid />,
      },
      {
        path: "dashboard/icon/outline",
        element: <Outline />,
      },
      {
        path: "dashboard/icon/dual-tone",
        element: <DualTone />,
      },
      
    ],
  },
];
