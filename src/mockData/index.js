export const salutationData = [
  { value: "1", salutation: "Mr" },
  { value: "2", salutation: "Mrs" },
  { value: "3", salutation: "Dr" },
  { value: "4", salutation: "Sir" },
  { value: "5", salutation: "Mam" },
];

export const maritialStatusData = [
  { id: "1", name: "Single" },
  { id: "2", name: "Married" },
  { id: "3", name: "Divorced" },
  { id: "4", name: "Widowed" },
];

export const genderData = [
  { id: "1", name: "Male" },
  { id: "2", name: "Female" },
  { id: "3", name: "Other" },
];

export const statusOptions = [
  { icon: "🔴", name: "Incomplete" },
  { icon: "🟡", name: "To Do" },
  { icon: "🔵", name: "Doing" },
  { icon: "🟢", name: "Completed" },
];

export const docTypeOptions = [
  { id: "1", name: "Aadhaar Card" },
  { id: "2", name: "Pan Card" },
];

export const kycDataOptions = [
  { id: "1", icon: "🟡", name: "Pending" },
  { id: "2", icon: "🟢", name: "Approved" },
  { id: "3", icon: "🔴", name: "Rejected" },
];

export const priorityOptions = [
  { id: "1", icon: "🔴", name: "Low" },
  { id: "2", icon: "🟡", name: "Medium" },
  { id: "3", icon: "🟢", name: "High" },
];

export const disbursementOptions = [
  { id: "1", icon: "🟢", name: "Done" }, // Green circle
  { id: "2", icon: "🟡", name: "Pending" }, // Red circle
];

export const selectTypeData = [
  { id: "1", name: "Debit" },
  { id: "2", name: "Credit" },
];

// Sidebar list
export const sidebarItems = [
  "Lead",
  "Customer",
  "Tax",
  "Account",
  "Inventory",
  "Task",
  "Project",
  "Employee",
  "Holiday",
  "Branch",
  "Company",
  "Bank",
];

// Tabs config –
export const tabConfig = {
  Lead: ["Source", "Requirement", "Unit", "Status"],
  Customer: ["Categories", "Custom Field"],
  Tax: [
    "GST Treatment",
    "Tax Preference",
    "TDS",
    "TCS",
    "Inter Tax",
    "Intra Tax",
  ],
  Account: ["Type"],
  Inventory: ["Reason", "Inventory Category", "Inventory Type"],
  Task: ["Type"],
  Project: [
    "Category",
    "Document",
    "MSEB",
    "NM",
    "NP",
    "Billing Method",
    "Installation Status",
  ],
  Employee: ["Employee Type", "Department", "Designation", "Office Time"],
  Holiday: ["Default Holiday"],
  Branch: ["Branch"],
  Company: ["Details"],
  Bank: ["Details"],
};

export const typeOfMaterial = [
  { id: "1", name: "Goods" },
  { id: "2", name: "Purchase" },
];

export const requiredTypes = [
  { id: "1", name: "true" },
  { id: "2", name: "false" },
];

export const typeOfData = [
  { id: "4", name: "image" },
  { id: "5", name: "pdf" },
];

export const accountTypes = [
  { id: "1", name: "Current" },
  { id: "2", name: "Saving" },
];

export const personType = [
  { id: "1", name: "Warehouse" },
  { id: "2", name: "Customer" },
];

// Default text for new quotations
export const defaultNotes = `Subsidy - ₹78,000/-
Solar Panel Warranty = 12 Years Product, 13 Years Performance
Solar On-Grid Inverter Warranty = 7-10 Years
Service = 5 Years CMC`;
