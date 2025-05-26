import React from "react";
import { Typography, Box } from "@mui/material";

const PasswordSettings: React.FC = () => {
  return (
    <Box className="p-6">
      <Typography variant="h5" className="mb-4 text-[#262262]">
        Password Settings
      </Typography>
      <Typography variant="body1" className="text-gray-600">
        Configure security options and privacy settings.
      </Typography>
    </Box>
  );
};

export default PasswordSettings;