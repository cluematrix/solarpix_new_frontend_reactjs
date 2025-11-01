import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Alert,
} from "@mui/material";

const Addpin = () => {
  const [pin, setPin] = useState("1234");
  const [showPin, setShowPin] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPin, setNewPin] = useState("");
  const [mode, setMode] = useState("idle"); // "idle", "view", "edit"
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");

  const sendOtp = async () => {
    await new Promise((r) => setTimeout(r, 500));
    setOtpSent(true);
    setError("");
  };

  const verifyOtp = () => {
    if (otp === "123456") {
      setShowPin(true);
      setError("");
    } else {
      setError("Invalid OTP. Use 123456 for demo.");
    }
  };

  const updatePin = () => {
    if (newPin.length === 4) {
      setPin(newPin);
      setShowPin(true);
      setMode("idle");
      setNewPin("");
    }
  };

  const startView = () => {
    setMode("view");
    setShowPin(false);
    sendOtp();
  };

  const startEdit = () => {
    setMode("edit");
    setShowPin(false);
    sendOtp();
  };

  const cancel = () => {
    setMode("idle");
    setOtp("");
    setNewPin("");
    setOtpSent(false);
    setShowPin(false);
    setError("");
  };

  return (
    <Box sx={{ p: 2, display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Paper sx={{ p: 3, maxWidth: 400, width: "100%" }}>
        <Typography variant="h6" align="center" gutterBottom>
          PIN Manager
        </Typography>

        {/* Current PIN Display */}
        <Box sx={{ p: 2, bgcolor: "grey.100", borderRadius: 1, textAlign: "center", mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Your PIN
          </Typography>
          <Typography variant="h5" sx={{ fontFamily: "monospace" }}>
            {showPin ? pin : "••••"}
          </Typography>
        </Box>

        {/* OTP Input */}
        {otpSent && !showPin && (
          <Stack spacing={2}>
            <Alert severity="info">OTP sent to your email</Alert>
            <TextField
              fullWidth
              label="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="123456"
            />
            {error && <Alert severity="error">{error}</Alert>}
            <Stack direction="row" spacing={1}>
              <Button
                variant="contained"
                fullWidth
                onClick={verifyOtp}
                disabled={otp.length !== 6}
              >
                Verify
              </Button>
              <Button variant="outlined" onClick={cancel}>
                Cancel
              </Button>
            </Stack>
          </Stack>
        )}

        {/* New PIN Input */}
        {showPin && mode === "edit" && (
          <Stack spacing={2}>
            <TextField
              fullWidth
              label="New 4-digit PIN"
              value={newPin}
              onChange={(e) => setNewPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
            />
            <Stack direction="row" spacing={1}>
              <Button
                variant="contained"
                fullWidth
                onClick={updatePin}
                disabled={newPin.length !== 4}
              >
                Save
              </Button>
              <Button variant="outlined" onClick={cancel}>
                Cancel
              </Button>
            </Stack>
          </Stack>
        )}

        {/* Main Actions */}
        {mode === "idle" && (
          <Stack spacing={1}>
            <Button
              variant="contained"
              fullWidth
              onClick={startView}
              disabled={!pin}
            >
              View PIN
            </Button>
            <Button
              variant="outlined"
              fullWidth
              onClick={startEdit}
              disabled={!pin}
            >
              Edit PIN
            </Button>
          </Stack>
        )}

        {/* Demo Info */}
        {/* <Alert severity="info" sx={{ mt: 2 }}>
          Demo OTP: 123456
        </Alert> */}
      </Paper>
    </Box>
  );
};

export default Addpin;