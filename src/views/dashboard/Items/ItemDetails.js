import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Stack,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Inventory as InventoryIcon,
  Receipt as ReceiptIcon,
  Timeline as TimelineIcon,
  AttachMoney as MoneyIcon,
  Scale as ScaleIcon,
  Category as CategoryIcon,
  LocalOffer as TagIcon,
} from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";

export default function ItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [item, setItem] = useState(null);

  const dummyItems = [
    {
      id: 1,
      type: "Goods",
      itemName: "Organic Almonds Premium",
      unit: "kg",
      hsn: "0802.12",
      sac: "998877",
      taxPreference: "GST",
      sellable: true,
      sellingPrice: 150,
      purchasable: true,
      purchasePrice: 100,
      intraStateTaxRate: "9% CGST + 9% SGST",
      interStateTaxRate: "18% IGST",
      opening: 20,
      debit: 5,
      credit: 10,
      closing: 15,
      category: "Nuts & Dry Fruits",
      sku: "ALM-PRM-001",
      description: "Premium quality organic almonds imported from California",

      history: [
        {
          date: "2024-01-15",
          type: "Sale",
          qty: 2,
          amount: 300,
          reference: "INV-001",
        },
        {
          date: "2024-01-12",
          type: "Sale",
          qty: 3,
          amount: 450,
          reference: "INV-002",
        },
        {
          date: "2024-01-10",
          type: "Purchase",
          qty: 10,
          amount: 1000,
          reference: "PO-123",
        },
        {
          date: "2024-01-08",
          type: "Sale",
          qty: 4,
          amount: 600,
          reference: "INV-003",
        },
        {
          date: "2024-01-05",
          type: "Purchase",
          qty: 15,
          amount: 1500,
          reference: "PO-124",
        },
      ],
    },
  ];

  useEffect(() => {
    const data = dummyItems.find((d) => String(d.id) === id);
    setItem(data);
  }, [id]);

  if (!item) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <Typography variant="h6" color="text.secondary">
          Loading item details...
        </Typography>
      </Box>
    );
  }

  const getStatusColor = (status) => {
    return status ? "success" : "default";
  };

  const StatCard = ({ icon, title, value, color = "primary" }) => (
    <Card sx={{ height: "100%", boxShadow: 2 }}>
      <CardContent sx={{ textAlign: "center", p: 2 }}>
        <Box sx={{ color: `${color}.main`, mb: 1 }}>{icon}</Box>
        <Typography variant="h4" fontWeight="bold" color={color}>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
      </CardContent>
    </Card>
  );

  const InfoRow = ({ icon, label, value, color = "text.primary" }) => (
    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
      <Box sx={{ color: "primary.main", mr: 2, minWidth: 24 }}>{icon}</Box>
      <Box sx={{ flex: 1 }}>
        <Typography variant="caption" color="text.secondary" display="block">
          {label}
        </Typography>
        <Typography variant="body1" color={color} fontWeight="medium">
          {value}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ p: 3, backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      {/* Header Section */}
      <Card sx={{  boxShadow: 3, borderRadius: 2 }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 2,
            }}
          >
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(-1)}
              sx={{  textTransform: "none" }}
            >
              Back to Items
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Tabs Section */}
      <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
        <Tabs
          value={tab}
          onChange={(e, newVal) => setTab(newVal)}
          variant="fullWidth"
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            "& .MuiTab-root": {
              py: 2,
              fontSize: "1rem",
              fontWeight: "medium",
              textTransform: "none",
            },
          }}
        >
          <Tab
            icon={<InventoryIcon />}
            iconPosition="start"
            label="Basic Information"
          />
          <Tab
            icon={<TimelineIcon />}
            iconPosition="start"
            label="Stock Ledger"
          />
          <Tab
            icon={<ReceiptIcon />}
            iconPosition="start"
            label="Transaction History"
          />
        </Tabs>

        <CardContent sx={{ p: 0 }}>
          {/* Basic Information Tab */}
          {tab === 0 && (
            <Box sx={{ p: 3 }}>
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ color: "primary.main", mb: 3 }}
                  >
                    Product Details
                  </Typography>

                  <InfoRow
                    icon={<CategoryIcon />}
                    label="Item Type"
                    value={item.type}
                  />
                  <InfoRow
                    icon={<TagIcon />}
                    label="Category"
                    value={item.category}
                  />
                  <InfoRow
                    icon={<ScaleIcon />}
                    label="Unit"
                    value={item.unit}
                  />
                  <InfoRow
                    icon={<InventoryIcon />}
                    label="SKU"
                    value={item.sku}
                  />

                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ color: "primary.main", mt: 4, mb: 3 }}
                  >
                    Tax Information
                  </Typography>

                  <InfoRow
                    icon={<ReceiptIcon />}
                    label="HSN Code"
                    value={item.hsn}
                  />
                  <InfoRow
                    icon={<ReceiptIcon />}
                    label="SAC Code"
                    value={item.sac}
                  />
                  <InfoRow
                    icon={<ReceiptIcon />}
                    label="Tax Preference"
                    value={item.taxPreference}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ color: "primary.main", mb: 3 }}
                  >
                    Pricing & Tax Rates
                  </Typography>

                  <InfoRow
                    icon={<MoneyIcon />}
                    label="Selling Price"
                    value={`₹${item.sellingPrice}`}
                    color="success.main"
                  />
                  <InfoRow
                    icon={<MoneyIcon />}
                    label="Purchase Price"
                    value={`₹${item.purchasePrice}`}
                    color="info.main"
                  />

                  <Divider sx={{ my: 2 }} />

                  <InfoRow
                    icon={<ReceiptIcon />}
                    label="Intra-State Tax Rate"
                    value={item.intraStateTaxRate}
                  />
                  <InfoRow
                    icon={<ReceiptIcon />}
                    label="Inter-State Tax Rate"
                    value={item.interStateTaxRate}
                  />

                  <Divider sx={{ my: 2 }} />

                  <Box
                    sx={{ backgroundColor: "#f8f9fa", p: 2, borderRadius: 1 }}
                  >
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Description
                    </Typography>
                    <Typography variant="body2">{item.description}</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Stock Ledger Tab */}
          {tab === 1 && (
            <Box sx={{ p: 3 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ color: "primary.main", mb: 3 }}
              >
                Stock Movement Summary
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ backgroundColor: "#e3f2fd", boxShadow: 1 }}>
                    <CardContent sx={{ textAlign: "center" }}>
                      <Typography
                        variant="h3"
                        fontWeight="bold"
                        color="info.main"
                      >
                        {item.opening}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Opening Stock
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ backgroundColor: "#fff3e0", boxShadow: 1 }}>
                    <CardContent sx={{ textAlign: "center" }}>
                      <Typography
                        variant="h3"
                        fontWeight="bold"
                        color="warning.main"
                      >
                        {item.debit}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Debit
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ backgroundColor: "#e8f5e8", boxShadow: 1 }}>
                    <CardContent sx={{ textAlign: "center" }}>
                      <Typography
                        variant="h3"
                        fontWeight="bold"
                        color="success.main"
                      >
                        {item.credit}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Credit
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ backgroundColor: "#fce4ec", boxShadow: 1 }}>
                    <CardContent sx={{ textAlign: "center" }}>
                      <Typography
                        variant="h3"
                        fontWeight="bold"
                        color="secondary.main"
                      >
                        {item.closing}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Closing Stock
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Transaction History Tab */}
          {tab === 2 && (
            <Box sx={{ p: 3 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ color: "primary.main", mb: 3 }}
              >
                Recent Transactions
              </Typography>

              {item.history.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <ReceiptIcon
                    sx={{ fontSize: 64, color: "text.disabled", mb: 2 }}
                  />
                  <Typography variant="h6" color="text.secondary">
                    No transactions found
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Transaction history will appear here once available.
                  </Typography>
                </Box>
              ) : (
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                        <TableCell>
                          <strong>Date</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Type</strong>
                        </TableCell>
                        <TableCell align="right">
                          <strong>Quantity</strong>
                        </TableCell>
                        <TableCell align="right">
                          <strong>Amount</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Reference</strong>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {item.history.map((transaction, index) => (
                        <TableRow
                          key={index}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                            "&:hover": { backgroundColor: "#f8f9fa" },
                          }}
                        >
                          <TableCell>
                            <Typography variant="body2" fontWeight="medium">
                              {transaction.date}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={transaction.type}
                              color={
                                transaction.type === "Sale"
                                  ? "success"
                                  : "primary"
                              }
                              size="small"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Typography
                              variant="body2"
                              fontWeight="bold"
                              color={
                                transaction.type === "Sale"
                                  ? "error.main"
                                  : "success.main"
                              }
                            >
                              {transaction.type === "Sale" ? "-" : "+"}
                              {transaction.qty}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" fontWeight="medium">
                              ₹{transaction.amount}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {transaction.reference}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
