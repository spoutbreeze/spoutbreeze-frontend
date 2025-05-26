import React from "react";
import { Typography, Box } from "@mui/material";

const DeleteAccount: React.FC = () => {
  return (
    <Box className="p-6">
      <Typography variant="h5" className="mb-4 text-[#262262]">
        Delete Account
      </Typography>
      <Typography variant="body1" className="text-gray-600 mb-4">
        Are you sure you want to delete your account? This action cannot be
        undone.
      </Typography>
    </Box>
  );
};

export default DeleteAccount;