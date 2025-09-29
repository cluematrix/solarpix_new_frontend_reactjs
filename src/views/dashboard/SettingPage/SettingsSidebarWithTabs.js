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
            {activeSidebar === "Customer" && activeTab === 0 && (
              <>
                <ClientCategory />
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
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
