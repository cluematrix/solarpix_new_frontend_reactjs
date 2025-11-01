import React, { useState } from "react";
import {
  Box,
  Stack,
  TextField,
  Typography,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  MenuItem,
  Paper,
} from "@mui/material";

const AddItem = () => {
  const [form, setForm] = useState({
    type: "goods",
    itemName: "",
    unit: "",
    hsn: "",
    sac: "",
    taxPreference: "",
    sellable: true,
    sellingPrice: "",
    purchasable: true,
    purchasePrice: "",
    intraStateTaxRate: "",
    interStateTaxRate: "",
  });

  const [errors, setErrors] = useState({});
  const [showField, setshowField] = useState({
    selling: true,
    purchase: true,
  });

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const validateForm = () => {
    let newErrors = {};

    if (!form.itemName.trim()) newErrors.itemName = "Item Name is required";
    if (!form.unit) newErrors.unit = "Unit is required";
    if (!form.taxPreference)
      newErrors.taxPreference = "Tax Preference is required";

    if (showField.selling)
      if (!form.sellingPrice.trim())
        newErrors.sellingPrice = "Selling Price is required";

    if (showField.purchase)
      if (!form.purchasePrice.trim())
        newErrors.purchasePrice = "Cost Price is required";

    if (!form.intraStateTaxRate)
      newErrors.intraStateTaxRate = "Intra State Tax Rate is required";

    if (!form.interStateTaxRate)
      newErrors.interStateTaxRate = "Inter State Tax Rate is required";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleShowField = (fieldName, checked) => {
    // Update visibility
    setshowField((prev) => ({
      ...prev,
      [fieldName]: checked,
    }));

    // Update form
    if (fieldName === "selling") {
      setForm((prev) => ({
        ...prev,
        sellable: checked,
        sellingPrice: checked ? prev.sellingPrice : "",
      }));
    }

    if (fieldName === "purchase") {
      setForm((prev) => ({
        ...prev,
        purchasable: checked,
        purchasePrice: checked ? prev.purchasePrice : "",
      }));
    }
  };

  const handleFormSubmit = () => {
    if (validateForm()) {
      alert("Form submitted!");

      console.log("form", form);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        New Item
      </Typography>

      <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
        <Stack spacing={2} width="100%">
          <Stack spacing={1}>
            <Typography fontSize={14}>Type</Typography>
            <RadioGroup row value={form.type} onChange={handleChange("type")}>
              <FormControlLabel
                value="goods"
                control={<Radio />}
                label="Goods"
              />
              <FormControlLabel
                value="service"
                control={<Radio />}
                label="Service"
              />
            </RadioGroup>
          </Stack>

          <Stack
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            flexBasis="50%"
            gap={4}
          >
            <Stack
              spacing={1}
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
              width="100%"
            >
              <Typography fontSize={14} sx={{ flexBasis: "30%" }}>
                Item Name *
              </Typography>
              <TextField
                sx={{ flexBasis: "70%" }}
                size="small"
                fullWidth
                value={form.itemName}
                onChange={handleChange("itemName")}
                required
                error={!!errors.itemName}
                helperText={errors.itemName}
              />
            </Stack>

            <Stack
              spacing={1}
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
              width="100%"
            >
              <Typography fontSize={14} sx={{ flexBasis: "30%" }}>
                Unit
              </Typography>
              <TextField
                sx={{ flexBasis: "70%" }}
                select
                size="small"
                fullWidth
                value={form.unit}
                onChange={handleChange("unit")}
              >
                <MenuItem value="kg">Kg</MenuItem>
                <MenuItem value="pcs">Pcs</MenuItem>
                <MenuItem value="ltr">Litre</MenuItem>
              </TextField>
            </Stack>
          </Stack>
          <Stack
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            flexBasis="50%"
            gap={4}
          >
            <Stack
              spacing={1}
              flexDirection="row"
              justifyContent="space-between"
              width="100%"
            >
              <Typography fontSize={14} sx={{ flexBasis: "30%" }}>
                {form.type === "goods" ? "HSC Code" : "SAC Code"}
              </Typography>
              <TextField
                sx={{ flexBasis: "70%" }}
                size="small"
                fullWidth
                value={form.type === "goods" ? form.hsn : form.sac}
                onChange={(e) => {
                  if (form.type === "goods") {
                    setForm({ ...form, hsn: e.target.value, sac: "" }); // reset sac
                  } else {
                    setForm({ ...form, sac: e.target.value, hsn: "" }); // reset hsn
                  }
                }}
              />
            </Stack>

            <Stack
              spacing={1}
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
              width="100%"
            >
              <Typography fontSize={14} sx={{ flexBasis: "30%" }}>
                Tax Preference *
              </Typography>
              <TextField
                sx={{ flexBasis: "70%" }}
                select
                size="small"
                fullWidth
                value={form.taxPreference}
                onChange={handleChange("taxPreference")}
                error={!!errors.taxPreference}
                helperText={errors.taxPreference}
              >
                <MenuItem value="taxable">Taxable</MenuItem>
                <MenuItem value="nonTaxable">Non Taxable</MenuItem>
              </TextField>
            </Stack>
          </Stack>
        </Stack>
      </Paper>

      <Paper elevation={0} sx={{ p: 3, borderRadius: 2, mt: 3 }}>
        <Stack
          spacing={4}
          width="100%"
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Box flexBasis="50%">
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              mb={1}
              width="100%"
            >
              <Typography fontWeight={600}>Sales Information</Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={showField.selling}
                    onChange={(e) =>
                      handleShowField("selling", e.target.checked)
                    }
                  />
                }
                label="Sellable"
              />
            </Stack>
            <Stack
              width="100%"
              spacing={1}
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography fontSize={14} sx={{ flexBasis: "30%" }}>
                Selling Price *
              </Typography>
              <TextField
                sx={{ flexBasis: "60%" }}
                size="small"
                fullWidth
                disabled={!showField.selling}
                value={form.sellingPrice}
                onChange={handleChange("sellingPrice")}
                placeholder="Enter price"
                error={!!errors.sellingPrice}
                helperText={errors.sellingPrice}
              />
            </Stack>
          </Box>
          <Box flexBasis="50%">
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              mb={1}
            >
              <Typography fontWeight={600}>Purchase Information</Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={showField.purchase}
                    onChange={(e) =>
                      handleShowField("purchase", e.target.checked)
                    }
                  />
                }
                label="Purchasable"
              />
            </Stack>

            <Stack
              width="100%"
              spacing={1}
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography sx={{ flexBasis: "30%" }} fontSize={14}>
                Cost Price *
              </Typography>
              <TextField
                sx={{ flexBasis: "60%" }}
                size="small"
                disabled={!showField.purchase}
                fullWidth
                value={form.purchasePrice}
                onChange={handleChange("purchasePrice")}
                placeholder="Enter purchase price"
                error={!!errors.purchasePrice}
                helperText={errors.purchasePrice}
              />
            </Stack>
          </Box>
        </Stack>

        <Typography fontWeight={600} sx={{ margin: "1rem 0" }}>
          Default Tax Rate
        </Typography>
        <Stack width="100%" direction="row" spacing={4}>
          <Stack flexBasis="50%" direction="column" spacing={2}>
            <Stack
              spacing={1}
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
              flexBasis="50%"
            >
              <Typography fontSize={14} sx={{ flexBasis: "30%" }}>
                Intra State Tax Rate *
              </Typography>
              <TextField
                sx={{ flexBasis: "60%" }}
                select
                size="small"
                fullWidth
                value={form.intraStateTaxRate}
                onChange={handleChange("intraStateTaxRate")}
                error={!!errors.intraStateTaxRate}
                helperText={errors.intraStateTaxRate}
              >
                <MenuItem value="taxable">20</MenuItem>
                <MenuItem value="nonTaxable">21</MenuItem>
              </TextField>
            </Stack>
            <Stack
              spacing={1}
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
              flexBasis="50%"
            >
              <Typography fontSize={14} sx={{ flexBasis: "30%" }}>
                Inter State Tax Rate *
              </Typography>
              <TextField
                sx={{ flexBasis: "60%" }}
                select
                size="small"
                fullWidth
                value={form.interStateTaxRate}
                onChange={handleChange("interStateTaxRate")}
                error={!!errors.interStateTaxRate}
                helperText={errors.interStateTaxRate}
              >
                <MenuItem value="taxable">18</MenuItem>
                <MenuItem value="nonTaxable">20</MenuItem>
              </TextField>
            </Stack>
          </Stack>
          <Stack flexBasis="50%" direction="column"></Stack>
        </Stack>
      </Paper>
      <Box mt={1} display="flex" justifyContent="flex-start">
        <button
          style={{
            padding: "10px 20px",
            backgroundColor: "#1976d2",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
          onClick={handleFormSubmit}
        >
          Save
        </button>
      </Box>
    </Box>
  );
};

export default AddItem;
