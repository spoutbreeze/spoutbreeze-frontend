import React, { useState } from "react";
import { Typography, Box, TextField, Button } from "@mui/material";

const PasswordSettings: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      console.error("New passwords don't match");
      return;
    }

    // Add your password update logic here
    console.log("Updating password...");
  };

  return (
    <Box className="p-6">
      <Typography variant="h5" className="mb-4 text-[#262262]">
        Password Settings
      </Typography>

      <Typography variant="body1" className="text-gray-600 mb-6">
        Update your password to keep your account secure.
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
        className="space-y-4 max-w-md"
      >
        <TextField
          label="Current Password"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          variant="outlined"
          fullWidth
          required
        />

        <TextField
          label="New Password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          variant="outlined"
          fullWidth
          required
        />

        <TextField
          label="Confirm New Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          variant="outlined"
          fullWidth
          required
          error={confirmPassword !== "" && newPassword !== confirmPassword}
          helperText={
            confirmPassword !== "" && newPassword !== confirmPassword
              ? "Passwords don't match"
              : ""
          }
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={
            !currentPassword ||
            !newPassword ||
            !confirmPassword ||
            newPassword !== confirmPassword
          }
          sx={{ textTransform: "none" }}
        >
          Update Password
        </Button>
      </Box>
    </Box>
  );
};

export default PasswordSettings;