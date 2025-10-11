import React, { useState } from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Tabs,
  Tab,
  Paper,
} from "@mui/material";
import CustomInput from "../../../components/Form/CustomInput";

//search icon
import SearchIcon from "@mui/icons-material/Search";
import { sidebarItems, tabConfig } from "../../../mockData";
import LeadSourceList from "../Leads/LeadSource/leadsSource-list";
import ClientCategory from "../Customer/CustomerCategory/ClientCategory";
import RequirementLeadList from "../Leads/requirementLead/RequirementLeadList";
import UnitList from "../Leads/Unit/UnitList";
import LeadStatusList from "../Leads/LeadStatus/LeadStatusList";
import EmployeeType from "../EmployeeManagment/EmployeeType/EmployeeTypes";
import DepartmentList from "../EmployeeManagment/Department/department-list";
import ShiftList from "../EmployeeManagment/Shift/shift-list";
import DesignationList from "../EmployeeManagment/Designation/designationList";
import TaskCategory from "../work/TaskCategory/TaskCategory";
import BillingMethodList from "../work/BillingMethod/BillingMethodList.js";
import InstallationStatusList from "../work/InstallationStatus/InstallationStatusList";
import GSTTreatmentList from "../Tax/GstTreatment/GSTTreatmentList";
import TaxPreferenceList from "../Tax/TaxPreference/TaxPreferenceList";
import TDSList from "../Tax/tds/TDSList";
import BranchList from "../Branch/branches/BranchList";
import DefaultHoliday from "../EmployeeManagment/DefaultHoliday/DefaultHoliday";
import ReasonList from "../InventoryManagement/Reason/ReasonList";
import InterTaxList from "../Tax/InterTax/InterTaxList";
import IntraTaxList from "../Tax/IntraTax/IntraTaxList";
import CustomFieldList from "../Customer/CustomField/CustomFieldList";
import CompanyList from "./Companys/CompanyList";
import BankList from "../Bank/BankList";
import TCSList from "../Tax/tcs/TCSList";
import MSEBFieldList from "../work/MSEB/MSEBFieldList";
import NetMeteringFieldList from "../work/NetMetering/NetMeteringFieldList";
import NodalPointList from "../work/NodalPoint/NodalPointList";
import InventoryCategoriesList from "../InventoryManagement/InventoryCategories/InventoryCategoriesList";
import InventoryTypeList from "../InventoryManagement/InventoryType/InventoryTypeList";

export default function SettingsSidebarWithTabs() {
  const [activeSidebar, setActiveSidebar] = useState(sidebarItems[0]);
  const [activeTab, setActiveTab] = useState(0);

  // For search functionality
  const [searchQuery, setSearchQuery] = useState("");

  const handleSidebarClick = (item) => {
    setActiveSidebar(item);
    setActiveTab(0); // reset tab on sidebar switch
  };

  console.log("searchQuery:", searchQuery);

  const filteredSidebarItems = sidebarItems.filter((item) =>
    item.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "90vh",
        bgcolor: "#f9f9f9",
      }}
    >
      {/* 📁 Left Sidebar */}
      <Drawer
        variant="permanent"
        anchor="left"
        sx={{
          position: "relative",
          width: 230,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            position: "relative",
            width: 230,
            boxSizing: "border-box",
            borderRight: "1px solid #ddd",
            bgcolor: "#fff",
          },
          borderBottom: "1px solid #ddd",
          zIndex: "99",
        }}
      >
        <Box sx={{ padding: "17px 8px 15px 8px" }}>
          <CustomInput
            name="searchQuery"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search"
            Icon={SearchIcon}
            iconPosition="left"
          />
        </Box>
        <List sx={{ paddingTop: 0 }}>
          {filteredSidebarItems.map((item) => (
            <ListItem key={item} disablePadding>
              <ListItemButton
                selected={activeSidebar === item}
                onClick={() => handleSidebarClick(item)}
                sx={{
                  "&.Mui-selected": {
                    bgcolor: "#3a57e8",
                    color: "#fff",
                    "&:hover": { bgcolor: "#3a57e8" },
                  },
                }}
              >
                <ListItemText
                  primary={item}
                  primaryTypographyProps={{
                    fontSize: "14px",
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* 📄 Right side content with tabs */}
      <Box sx={{ flexGrow: 1, padding: "15px" }}>
        <Paper elevation={1} sx={{ padding: "10px 16px 16px 16px" }}>
          {/* Tabs */}
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            sx={{
              "& .MuiTab-root": {
                color: "#3a57e8", // text color
                textTransform: "none",
                fontSize: "14px",
              },
              "& .Mui-selected": {
                color: "#3a57e8", // active tab text
                fontSize: "14px",
              },
              "& .MuiTabs-indicator": {
                backgroundColor: "#3a57e8", // active indicator color
              },
              borderBottom: "1px solid #ddd",
            }}
          >
            {tabConfig[activeSidebar].map((tab, index) => (
              <Tab key={index} label={tab} />
            ))}
          </Tabs>

          {/* Render content based on active tab */}
          <Box sx={{ mt: 3 }}>
            {activeSidebar === "Lead" && activeTab === 0 && (
              <>
                <LeadSourceList />
              </>
            )}
            {activeSidebar === "Lead" && activeTab === 1 && (
              <>
                <RequirementLeadList />
              </>
            )}
            {activeSidebar === "Lead" && activeTab === 2 && (
              <>
                <UnitList />
              </>
            )}
            {activeSidebar === "Lead" && activeTab === 3 && (
              <>
                <LeadStatusList />
              </>
            )}
            {activeSidebar === "Customer" && activeTab === 0 && (
              <>
                <ClientCategory />
              </>
            )}
            {activeSidebar === "Customer" && activeTab === 1 && (
              <>
                <CustomFieldList />
              </>
            )}

            {activeSidebar === "Projects" && activeTab === 0 && (
              <div>📊 Projects Summary Component render here</div>
            )}
            {activeSidebar === "Projects" && activeTab === 1 && (
              <div>👥 Project Team Component render here</div>
            )}

            {activeSidebar === "Leads" && activeTab === 0 && (
              <div>📈 All Leads Component render here</div>
            )}
            {activeSidebar === "Leads" && activeTab === 1 && (
              <div>📑 Reports Component render here</div>
            )}

            {activeSidebar === "Employee" && activeTab === 0 && (
              <>
                <EmployeeType />
              </>
            )}
            {activeSidebar === "Employee" && activeTab === 1 && (
              <>
                <DepartmentList />
              </>
            )}
            {activeSidebar === "Employee" && activeTab === 2 && (
              <>
                <DesignationList />
              </>
            )}

            {activeSidebar === "Employee" && activeTab === 3 && (
              <>
                <ShiftList />
              </>
            )}

            {activeSidebar === "Task" && activeTab === 0 && (
              <>
                <TaskCategory />
              </>
            )}

            {activeSidebar === "Project" && activeTab === 2 && (
              <>
                <MSEBFieldList />
              </>
            )}

            {/* Net Merering */}
            {activeSidebar === "Project" && activeTab === 3 && (
              <>
                <NetMeteringFieldList />
              </>
            )}

            {/*  Nodal Point Module */}
            {activeSidebar === "Project" && activeTab === 4 && (
              <>
                <NodalPointList />
              </>
            )}
            {activeSidebar === "Project" && activeTab === 5 && (
              <>
                <BillingMethodList />
              </>
            )}
            {activeSidebar === "Project" && activeTab === 6 && (
              <>
                <InstallationStatusList />
              </>
            )}
            {activeSidebar === "Tax" && activeTab === 0 && (
              <>
                <GSTTreatmentList />
              </>
            )}
            {activeSidebar === "Tax" && activeTab === 1 && (
              <>
                <TaxPreferenceList />
              </>
            )}
            {activeSidebar === "Tax" && activeTab === 2 && (
              <>
                <TDSList />
              </>
            )}
            {activeSidebar === "Tax" && activeTab === 3 && (
              <>
                <TCSList />
              </>
            )}
            {activeSidebar === "Tax" && activeTab === 4 && (
              <>
                <InterTaxList />
              </>
            )}
            {activeSidebar === "Tax" && activeTab === 5 && (
              <>
                <IntraTaxList />
              </>
            )}

            {activeSidebar === "Branch" && activeTab === 0 && (
              <>
                <BranchList />
              </>
            )}

            {activeSidebar === "Holiday" && activeTab === 0 && (
              <>
                <DefaultHoliday />
              </>
            )}

            {activeSidebar === "Inventory" && activeTab === 0 && (
              <>
                <ReasonList />
              </>
            )}

            {activeSidebar === "Inventory" && activeTab === 1 && (
              <>
                <InventoryCategoriesList />
              </>
            )}

            {activeSidebar === "Inventory" && activeTab === 2 && (
              <>
                <InventoryTypeList />
              </>
            )}

            {activeSidebar === "Company" && activeTab === 0 && (
              <>
                <CompanyList />
              </>
            )}

            {activeSidebar === "Bank" && activeTab === 0 && (
              <>
                <BankList />
              </>
            )}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
