import React from "react";
import { Typography, Box } from "@mui/material";

const AccountInfo: React.FC = () => {
  return (
    <Box className="py-10 pl-10">
      <Typography variant="h5" sx={{ fontWeight: 500 }}>
        Account Info
      </Typography>
      <Typography variant="body1" className="text-gray-600">
        Manage your account preferences and profile information.
      </Typography>
    </Box>
  );
};

export default AccountInfo;
